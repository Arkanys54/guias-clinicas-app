import type { AsignacionContextoDefinicionDto } from '../../services/algoritmos.types';
import { evaluateOperationExpression, looksLikeOperationExpression } from './expressionEvaluator';

type ScopeValue = string | number | boolean | null | undefined;

type SupportedAssignmentOperation =
  | 'set'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'append'
  | 'min'
  | 'max';

const ASSIGNMENT_OPERATION_ALIASES: Record<string, SupportedAssignmentOperation> = {
  set: 'set',
  assign: 'set',
  add: 'add',
  sum: 'add',
  increment: 'add',
  subtract: 'subtract',
  decrement: 'subtract',
  multiply: 'multiply',
  divide: 'divide',
  append: 'append',
  concat: 'append',
  min: 'min',
  max: 'max',
};

export function castContextValueByType(tipo: string | undefined, rawValue: unknown): unknown {
  if (tipo === 'boolean') {
    if (typeof rawValue === 'boolean') return rawValue;
    return rawValue === 'true' || rawValue === '1' || rawValue === 1;
  }

  if (tipo === 'integer') {
    const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
  }

  if (tipo === 'decimal') {
    const parsed = typeof rawValue === 'number' ? rawValue : Number(rawValue);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (rawValue === null || rawValue === undefined) return '';
  return String(rawValue);
}

export function resolveAssignmentResult(
  assignment: AsignacionContextoDefinicionDto,
  currentValue: unknown,
  scope: Record<string, ScopeValue>
): unknown {
  const incomingValue = resolveIncomingValue(assignment, scope);
  const operation = normalizeAssignmentOperation(assignment.operacion);
  const nextValue = applyAssignmentOperation(operation, currentValue, incomingValue);
  return castContextValueByType(assignment.tipo, nextValue);
}

function normalizeAssignmentOperation(operation?: string): SupportedAssignmentOperation {
  if (!operation) return 'set';
  return ASSIGNMENT_OPERATION_ALIASES[operation.toLowerCase()] ?? 'set';
}

function resolveIncomingValue(
  assignment: AsignacionContextoDefinicionDto,
  scope: Record<string, ScopeValue>
): unknown {
  const rawValue = assignment.valor ?? '';

  if (looksLikeOperationExpression(rawValue)) {
    try {
      return evaluateOperationExpression(rawValue, scope);
    } catch {
      // Si la expresión no se puede resolver, cae al modo literal.
    }
  }

  return castContextValueByType(assignment.tipo, rawValue);
}

function applyAssignmentOperation(
  operation: SupportedAssignmentOperation,
  currentValue: unknown,
  incomingValue: unknown
): unknown {
  switch (operation) {
    case 'add':
      return toNumber(currentValue) + toNumber(incomingValue);
    case 'subtract':
      return toNumber(currentValue) - toNumber(incomingValue);
    case 'multiply':
      return toNumber(currentValue, 1) * toNumber(incomingValue, 1);
    case 'divide': {
      const divisor = toNumber(incomingValue);
      if (divisor === 0) return null;
      return toNumber(currentValue) / divisor;
    }
    case 'append':
      if (Array.isArray(currentValue)) {
        return [...currentValue, ...(Array.isArray(incomingValue) ? incomingValue : [incomingValue])];
      }
      return `${currentValue ?? ''}${incomingValue ?? ''}`;
    case 'min':
      return Math.min(toNumber(currentValue), toNumber(incomingValue));
    case 'max':
      return Math.max(toNumber(currentValue), toNumber(incomingValue));
    case 'set':
    default:
      return incomingValue;
  }
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
