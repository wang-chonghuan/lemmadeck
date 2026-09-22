const LATEX_COMMANDS: Record<string, string> = {
  pm: '±',
  mp: '∓',
  ne: '!=',
  neq: '!=',
  le: '<=',
  leq: '<=',
  ge: '>=',
  geq: '>=',
  times: '*',
  cdot: '*',
  div: '/',
  in: '∈',
  notin: '∉',
  setminus: '∖',
  backslash: '∖',
  cup: '∪',
  cap: '∩',
  infty: '∞',
  ldots: '...',
  cdots: '...',
  dots: '...',
}

const LATEX_NAMES = new Set([
  'sin',
  'cos',
  'tan',
  'cot',
  'sec',
  'csc',
  'log',
  'ln',
  'exp',
  'min',
  'max',
])

function simpleFractionPart(value: string): boolean {
  return /^[+-]?(?:[0-9]+(?:\.[0-9]+)?|[A-Za-z]+)$/.test(value)
}

function parseLatex(value: string): string {
  let index = 0

  function commandName(): string {
    index += 1
    if (index >= value.length) return ''
    if (!/[A-Za-z]/.test(value[index])) return value[index++]
    const start = index
    while (index < value.length && /[A-Za-z]/.test(value[index])) index += 1
    return value.slice(start, index)
  }

  function argument(): string {
    while (index < value.length && /\s/.test(value[index])) index += 1
    if (value[index] === '{') {
      index += 1
      return sequence('}')
    }
    if (value[index] === '\\') {
      const start = index
      const rendered = command()
      return rendered || value.slice(start, index)
    }
    return index < value.length ? value[index++] : ''
  }

  function command(): string {
    const name = commandName()
    if (name === 'left' || name === 'right') return ''
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
      const numerator = argument()
      const denominator = argument()
      const left = simpleFractionPart(numerator) ? numerator : `(${numerator})`
      const right = simpleFractionPart(denominator) ? denominator : `(${denominator})`
      return `${left}/${right}`
    }
    if (name === 'sqrt') return `sqrt(${argument()})`
    if (name === 'text' || name === 'textrm' || name === 'mathrm' || name === 'operatorname') {
      return argument()
    }
    if (name === 'mathbb') return argument()
    if (name === '{' || name === '}') return name
    if (name === ',' || name === ';' || name === ':' || name === '!' || name === ' ') return ''
    if (name === '%') return '%'
    if (LATEX_COMMANDS[name] != null) return LATEX_COMMANDS[name]
    if (LATEX_NAMES.has(name)) return name
    return `\\${name}`
  }

  function sequence(stop?: string): string {
    let result = ''
    while (index < value.length) {
      const char = value[index]
      if (stop && char === stop) {
        index += 1
        break
      }
      if (char === '\\') {
        result += command()
        continue
      }
      if (char === '{') {
        index += 1
        result += `{${sequence('}')}}`
        continue
      }
      if (char === '}') {
        index += 1
        continue
      }
      result += char
      index += 1
    }
    return result
  }

  return sequence()
}

// Normalize typed math for lexical comparison. MathLive's `.value` is LaTeX,
// so both learner input and stored accept forms pass through the same parser.
export function normalizeMathAnswer(s: string): string {
  const unwrapped = s
    .trim()
    .replace(/^\$(.*)\$$/s, '$1')
    .replace(/^\\\((.*)\\\)$/s, '$1')
  return parseLatex(unwrapped)
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .normalize('NFKC')
    // full-width → half-width (！-～ covers digits, letters, operators, brackets)
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-') // unicode minus/dashes → '-'
    .replace(/[≠]/g, '!=')
    .replace(/[≤]/g, '<=')
    .replace(/[≥]/g, '>=')
    .replace(/[ℝ]/g, 'R')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/。$/, '')
    // collapse explicit * into implicit multiplication when a letter/bracket is
    // adjacent (8*x → 8x, x*y → xy, 3*(a+1) → 3(a+1)); keep digit*digit (2*3)
    .replace(/([0-9a-zA-Z)])\*(?=[a-zA-Z(])/g, '$1')
}

export function exactMathAnswersMatch(expected: string[], submitted: string): boolean {
  const normalized = normalizeMathAnswer(submitted)
  return expected.some((candidate) => normalizeMathAnswer(candidate) === normalized)
}
