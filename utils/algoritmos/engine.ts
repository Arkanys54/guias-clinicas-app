import type {
  AccionNodoDto,
  AsignacionContextoDefinicionDto,
  BloqueContenidoDefinicionDto,
  CondicionDto,
  DefinicionAlgoritmoDto,
  NodoAlgoritmoDefinicionDto,
  NodoAlertDefinicionDto,
  NodoBooleanDefinicionDto,
  NodoComputedDefinicionDto,
  NodoDateInputDefinicionDto,
  NodoDecisionDefinicionDto,
  NodoInfoDefinicionDto,
  NodoMultiChoiceDefinicionDto,
  NodoNumericInputDefinicionDto,
  NodoResultDefinicionDto,
  NodoSingleChoiceDefinicionDto,
  NodoTextInputDefinicionDto,
  VariableInicialContextoDto,
} from '../../services/algoritmos.types';
import { castContextValueByType, resolveAssignmentResult } from './assignmentOperations';

export interface AlgorithmRuntimeSnapshot {
  currentNode: NodoAlgoritmoDefinicionDto | null;
  context: Record<string, unknown>;
  responses: Record<string, unknown>;
  canGoBack: boolean;
  isTerminal: boolean;
}

interface RuntimeHistoryEntry {
  currentNodeKey: string | null;
  context: Record<string, unknown>;
  responses: Record<string, unknown>;
}

export class AlgorithmRuntime {
  private readonly definition: DefinicionAlgoritmoDto;
  private currentNodeKey: string | null;
  private context: Record<string, unknown>;
  private responses: Record<string, unknown>;
  private history: RuntimeHistoryEntry[];

  constructor(definition: DefinicionAlgoritmoDto) {
    this.definition = definition;
    this.currentNodeKey = definition.nodoInicioClave || definition.nodos[0]?.clave || null;
    this.context = this.seedInitialContext(definition.variablesIniciales);
    this.responses = {};
    this.history = [];
  }

  getSnapshot(): AlgorithmRuntimeSnapshot {
    const node = this.getCurrentNode();
    return {
      currentNode: node ? this.decorateNode(node) : null,
      context: { ...this.context },
      responses: { ...this.responses },
      canGoBack: this.history.length > 0,
      isTerminal: Boolean(node?.esTerminal),
    };
  }

  getCurrentNode(): NodoAlgoritmoDefinicionDto | null {
    return this.definition.nodos.find((node) => node.clave === this.currentNodeKey) ?? null;
  }

  goBack(): AlgorithmRuntimeSnapshot {
    const previous = this.history.pop();
    if (!previous) return this.getSnapshot();

    this.currentNodeKey = previous.currentNodeKey;
    this.context = previous.context;
    this.responses = previous.responses;

    return this.getSnapshot();
  }

  reset(): AlgorithmRuntimeSnapshot {
    this.currentNodeKey = this.definition.nodoInicioClave || this.definition.nodos[0]?.clave || null;
    this.context = this.seedInitialContext(this.definition.variablesIniciales);
    this.responses = {};
    this.history = [];
    return this.advanceToRenderableNode();
  }

  submit(answer?: unknown): AlgorithmRuntimeSnapshot {
    const node = this.getCurrentNode();
    if (!node) return this.getSnapshot();

    const shouldStoreResponse = isInputNode(node);
    const normalizedAnswer = shouldStoreResponse ? normalizeNodeResponse(node, answer) : answer;
    const nextNodeKey = this.resolveNextNodeKey(node, normalizedAnswer);

    if (shouldStoreResponse || nextNodeKey) {
      this.pushHistory();
    }

    if (shouldStoreResponse) {
      this.responses[node.clave] = normalizedAnswer;
    }

    if (!nextNodeKey) {
      return this.getSnapshot();
    }

    this.currentNodeKey = nextNodeKey;

    return this.advanceToRenderableNode();
  }

  private advanceToRenderableNode(): AlgorithmRuntimeSnapshot {
    let safetyCounter = 0;

    while (safetyCounter < 100) {
      const node = this.getCurrentNode();
      if (!node) break;
      if (node.esTerminal) break;

      if (node.type === 'computed') {
        this.processComputedNode(node);
        this.currentNodeKey = node.nodoSiguienteClave || null;
        safetyCounter += 1;
        continue;
      }

      if (node.type === 'decision') {
        this.currentNodeKey = this.resolveDecisionNode(node);
        safetyCounter += 1;
        continue;
      }

      break;
    }

    return this.getSnapshot();
  }

  private processComputedNode(node: NodoComputedDefinicionDto): void {
    (node.asignaciones ?? [])
      .slice()
      .sort((left, right) => (left.orden ?? 0) - (right.orden ?? 0))
      .forEach((assignment) => {
        if (!assignment.nombreVariable) return;
        if (assignment.condicion && !this.evaluateCondition(assignment.condicion)) return;

        this.context[assignment.nombreVariable] = this.resolveAssignmentValue(assignment);
      });
  }

  private resolveAssignmentValue(assignment: AsignacionContextoDefinicionDto): unknown {
    const scope = {
      ...this.responses,
      ...this.context,
    } as Record<string, string | number | boolean | null | undefined>;

    return resolveAssignmentResult(
      assignment,
      this.context[assignment.nombreVariable],
      scope
    );
  }

  private resolveNextNodeKey(node: NodoAlgoritmoDefinicionDto, answer?: unknown): string | null {
    if (node.type === 'single_choice') {
      const selected = (node as NodoSingleChoiceDefinicionDto).opciones.find((option) => option.valor === answer);
      return selected?.nodoDestinoClave || null;
    }

    if (node.type === 'multi_choice') {
      return (node as NodoMultiChoiceDefinicionDto).nodoSiguienteClave || null;
    }

    if (node.type === 'numeric_input') {
      return (node as NodoNumericInputDefinicionDto).nodoSiguienteClave || null;
    }

    if (node.type === 'date_input') {
      return (node as NodoDateInputDefinicionDto).nodoSiguienteClave || null;
    }

    if (node.type === 'text_input') {
      return (node as NodoTextInputDefinicionDto).nodoSiguienteClave || null;
    }

    if (node.type === 'boolean') {
      const booleanNode = node as NodoBooleanDefinicionDto;
      const normalized = normalizeNodeResponse(booleanNode, answer);
      return normalized === (booleanNode.valorVerdadero ?? 'si')
        ? booleanNode.nodoDestinoVerdaderoClave || null
        : booleanNode.nodoDestinoFalsoClave || null;
    }

    if (node.type === 'result' || node.type === 'info' || node.type === 'alert') {
      return resolveActionDestination(this.definition, node.accion);
    }

    return null;
  }

  private resolveDecisionNode(node: NodoDecisionDefinicionDto): string | null {
    const rules = [...(node.reglas ?? [])].sort((left, right) => left.prioridad - right.prioridad);

    for (const rule of rules) {
      if (this.evaluateCondition(rule.condicion)) {
        return rule.nodoDestinoClave || null;
      }
    }

    return node.nodoDestinoPorDefectoClave || null;
  }

  private evaluateCondition(condition: CondicionDto | null | undefined): boolean {
    if (!condition) return true;

    if (condition.kind === 'group') {
      const conditions = condition.condiciones ?? [];
      if (conditions.length === 0) return false;

      if (condition.operador === 'or') return conditions.some((item) => this.evaluateCondition(item));
      if (condition.operador === 'not') return !this.evaluateCondition(conditions[0]);
      return conditions.every((item) => this.evaluateCondition(item));
    }

    const operation = condition.operacion;
    const leftValue = operation.startsWith('context_')
      ? this.context[condition.variableContexto]
      : this.responses[condition.nodoClave];

    if (operation === 'context_exists') {
      return leftValue !== null && leftValue !== undefined && leftValue !== '';
    }

    if (leftValue === null || leftValue === undefined) return false;

    const rightValue = resolvePredicateRightValue(condition);
    const leftNumber = Number(leftValue);
    const rightNumber = Number(rightValue);
    const canCompareAsNumber = Number.isFinite(leftNumber) && Number.isFinite(rightNumber);

    switch (operation) {
      case 'response_equals':
        return canCompareAsNumber ? leftNumber === rightNumber : String(leftValue) === String(rightValue);
      case 'response_includes':
        return Array.isArray(leftValue)
          ? leftValue.map(String).includes(String(rightValue))
          : String(leftValue).includes(String(rightValue));
      case 'response_not_includes':
        return Array.isArray(leftValue)
          ? !leftValue.map(String).includes(String(rightValue))
          : !String(leftValue).includes(String(rightValue));
      case 'response_count_gte':
        return Array.isArray(leftValue) && canCompareAsNumber && leftValue.length >= rightNumber;
      case 'response_count_equals':
        return Array.isArray(leftValue) && canCompareAsNumber && leftValue.length === rightNumber;
      case 'context_equals':
        if (typeof leftValue === 'boolean' || typeof rightValue === 'boolean') {
          return Boolean(leftValue) === Boolean(rightValue);
        }
        return canCompareAsNumber ? leftNumber === rightNumber : String(leftValue) === String(rightValue);
      case 'context_not_equals':
        if (typeof leftValue === 'boolean' || typeof rightValue === 'boolean') {
          return Boolean(leftValue) !== Boolean(rightValue);
        }
        return canCompareAsNumber ? leftNumber !== rightNumber : String(leftValue) !== String(rightValue);
      case 'context_gte':
        return canCompareAsNumber && leftNumber >= rightNumber;
      case 'context_lte':
        return canCompareAsNumber && leftNumber <= rightNumber;
      default:
        return false;
    }
  }

  private decorateNode(node: NodoAlgoritmoDefinicionDto): NodoAlgoritmoDefinicionDto {
    if (node.type === 'result') {
      return {
        ...(node as NodoResultDefinicionDto),
        bloques: this.filterVisibleBlocks(node.bloques),
      };
    }

    if (node.type === 'info') {
      return {
        ...(node as NodoInfoDefinicionDto),
        bloques: this.filterVisibleBlocks(node.bloques),
      };
    }

    if (node.type === 'alert') {
      return {
        ...(node as NodoAlertDefinicionDto),
        bloques: this.filterVisibleBlocks(node.bloques),
      };
    }

    return node;
  }

  private filterVisibleBlocks(blocks: BloqueContenidoDefinicionDto[]): BloqueContenidoDefinicionDto[] {
    return (blocks ?? []).filter((block) => !block.condicion || this.evaluateCondition(block.condicion));
  }

  private pushHistory(): void {
    this.history.push({
      currentNodeKey: this.currentNodeKey,
      context: JSON.parse(JSON.stringify(this.context)),
      responses: JSON.parse(JSON.stringify(this.responses)),
    });
  }

  private seedInitialContext(variables: VariableInicialContextoDto[]): Record<string, unknown> {
    return (variables ?? []).reduce<Record<string, unknown>>((accumulator, variable) => {
      if (!variable.nombre) return accumulator;
      accumulator[variable.nombre] = castContextValueByType(variable.tipo, variable.valor);
      return accumulator;
    }, {});
  }
}

function isInputNode(node: NodoAlgoritmoDefinicionDto): boolean {
  return [
    'single_choice',
    'multi_choice',
    'numeric_input',
    'date_input',
    'boolean',
    'text_input',
  ].includes(node.type);
}

function normalizeNodeResponse(node: NodoAlgoritmoDefinicionDto, answer: unknown): unknown {
  if (node.type === 'boolean') {
    const booleanNode = node as NodoBooleanDefinicionDto;
    const isTrue =
      answer === true ||
      answer === 'true' ||
      answer === booleanNode.valorVerdadero ||
      answer === 1;
    return isTrue ? booleanNode.valorVerdadero ?? 'si' : booleanNode.valorFalso ?? 'no';
  }

  if (node.type === 'multi_choice') {
    return Array.isArray(answer) ? answer : [];
  }

  if (node.type === 'numeric_input') {
    const parsed = Number(answer);
    return Number.isFinite(parsed) ? parsed : answer;
  }

  return answer;
}

function resolveActionDestination(definition: DefinicionAlgoritmoDto, action?: AccionNodoDto | null): string | null {
  if (!action) return null;
  if (action.accion === 'restart') {
    return definition.nodoInicioClave || definition.nodos[0]?.clave || null;
  }
  if (action.accion === 'next') {
    return action.nodoDestinoClave || null;
  }
  return null;
}

function resolvePredicateRightValue(condition: Extract<CondicionDto, { kind: 'predicate' }>): unknown {
  if (condition.valorBooleano !== null && condition.valorBooleano !== undefined) return condition.valorBooleano;
  if (condition.valorNumerico !== null && condition.valorNumerico !== undefined) return condition.valorNumerico;
  if (condition.valorFecha) return condition.valorFecha;
  return condition.valor;
}
