type ScopeValue = string | number | boolean | null | undefined;
type OperatorTokenValue = '+' | '-' | '*' | '/' | '%' | '^' | '**';

type Token =
  | { type: 'number'; value: number }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: OperatorTokenValue }
  | { type: 'paren'; value: '(' | ')' }
  | { type: 'comma'; value: ',' };

const FUNCTION_TABLE: Record<string, (...args: number[]) => number> = {
  abs: (value) => Math.abs(value ?? 0),
  ceil: (value) => Math.ceil(value ?? 0),
  floor: (value) => Math.floor(value ?? 0),
  round: (value) => Math.round(value ?? 0),
  max: (...values) => Math.max(...values),
  min: (...values) => Math.min(...values),
  pow: (base, exponent) => Math.pow(base ?? 0, exponent ?? 0),
};

class ExpressionParser {
  private readonly tokens: Token[];
  private index = 0;
  private readonly scope: Record<string, ScopeValue>;

  constructor(tokens: Token[], scope: Record<string, ScopeValue>) {
    this.tokens = tokens;
    this.scope = scope;
  }

  parse(): number {
    const value = this.parseAdditive();
    if (this.peek()) {
      throw new Error('Expresión inválida: quedaron tokens sin consumir.');
    }
    return value;
  }

  private parseAdditive(): number {
    let left = this.parseMultiplicative();

    while (this.matchOperator('+') || this.matchOperator('-')) {
      const operator = this.previousOperator();
      const right = this.parseMultiplicative();
      left = operator === '+' ? left + right : left - right;
    }

    return left;
  }

  private parseMultiplicative(): number {
    let left = this.parsePower();

    while (this.matchOperator('*') || this.matchOperator('/') || this.matchOperator('%')) {
      const operator = this.previousOperator();
      const right = this.parsePower();

      if (operator === '*') left *= right;
      if (operator === '/') left /= right;
      if (operator === '%') left %= right;
    }

    return left;
  }

  private parsePower(): number {
    let left = this.parseUnary();

    while (this.matchOperator('^') || this.matchOperator('**')) {
      const operator = this.previousOperator();
      const right = this.parseUnary();
      left = operator === '^' || operator === '**' ? Math.pow(left, right) : left;
    }

    return left;
  }

  private parseUnary(): number {
    if (this.matchOperator('+')) return +this.parseUnary();
    if (this.matchOperator('-')) return -this.parseUnary();
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const token = this.advance();
    if (!token) throw new Error('Expresión incompleta.');

    if (token.type === 'number') return token.value;

    if (token.type === 'identifier') {
      if (this.matchParen('(')) {
        const args: number[] = [];
        if (!this.checkParen(')')) {
          do {
            args.push(this.parseAdditive());
          } while (this.matchComma());
        }

        this.consumeParen(')');

        const fn = FUNCTION_TABLE[token.value.toLowerCase()];
        if (!fn) throw new Error(`Función no soportada: ${token.value}`);
        return fn(...args);
      }

      if (token.value === 'true') return 1;
      if (token.value === 'false') return 0;

      const rawValue = this.scope[token.value];
      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        throw new Error(`La variable "${token.value}" no es numérica o no existe.`);
      }

      return numericValue;
    }

    if (token.type === 'paren' && token.value === '(') {
      const value = this.parseAdditive();
      this.consumeParen(')');
      return value;
    }

    throw new Error('Token inesperado en la expresión.');
  }

  private peek(): Token | null {
    return this.tokens[this.index] ?? null;
  }

  private advance(): Token | null {
    const token = this.peek();
    if (token) this.index += 1;
    return token;
  }

  private matchOperator(operator: OperatorTokenValue): boolean {
    const token = this.peek();
    if (token?.type === 'operator' && token.value === operator) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private previousOperator(): OperatorTokenValue {
    const token = this.tokens[this.index - 1];
    if (!token || token.type !== 'operator') {
      throw new Error('Se esperaba un operador.');
    }
    return token.value;
  }

  private matchParen(value: '(' | ')'): boolean {
    const token = this.peek();
    if (token?.type === 'paren' && token.value === value) {
      this.index += 1;
      return true;
    }
    return false;
  }

  private checkParen(value: '(' | ')'): boolean {
    const token = this.peek();
    return token?.type === 'paren' && token.value === value;
  }

  private consumeParen(value: '(' | ')'): void {
    if (!this.matchParen(value)) {
      throw new Error(`Se esperaba "${value}" en la expresión.`);
    }
  }

  private matchComma(): boolean {
    const token = this.peek();
    if (token?.type === 'comma') {
      this.index += 1;
      return true;
    }
    return false;
  }
}

export function evaluateOperationExpression(
  expression: string,
  scope: Record<string, ScopeValue>
): number {
  const tokens = tokenizeExpression(expression);
  if (tokens.length === 0) {
    throw new Error('La expresión está vacía.');
  }

  const parser = new ExpressionParser(tokens, scope);
  return parser.parse();
}

export function looksLikeOperationExpression(value: string): boolean {
  return /[+\-*/()%^]/.test(value) || /\b(abs|ceil|floor|round|max|min|pow)\s*\(/i.test(value);
}

function tokenizeExpression(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const current = expression[index];

    if (/\s/.test(current)) {
      index += 1;
      continue;
    }

    if (current === '*' && expression[index + 1] === '*') {
      tokens.push({ type: 'operator', value: '**' });
      index += 2;
      continue;
    }

    if ('+-*/%^'.includes(current)) {
      tokens.push({ type: 'operator', value: current as OperatorTokenValue });
      index += 1;
      continue;
    }

    if (current === '(' || current === ')') {
      tokens.push({ type: 'paren', value: current });
      index += 1;
      continue;
    }

    if (current === ',') {
      tokens.push({ type: 'comma', value: ',' });
      index += 1;
      continue;
    }

    if (/\d|\./.test(current)) {
      let rawNumber = current;
      index += 1;
      while (index < expression.length && /[\d.]/.test(expression[index])) {
        rawNumber += expression[index];
        index += 1;
      }

      const parsed = Number(rawNumber);
      if (!Number.isFinite(parsed)) {
        throw new Error(`Número inválido en expresión: ${rawNumber}`);
      }

      tokens.push({ type: 'number', value: parsed });
      continue;
    }

    if (/[A-Za-z_]/.test(current)) {
      let identifier = current;
      index += 1;

      while (index < expression.length && /[A-Za-z0-9_]/.test(expression[index])) {
        identifier += expression[index];
        index += 1;
      }

      tokens.push({ type: 'identifier', value: identifier });
      continue;
    }

    throw new Error(`Carácter no soportado en expresión: ${current}`);
  }

  return tokens;
}
