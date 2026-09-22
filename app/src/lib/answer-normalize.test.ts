import { describe, it, expect } from 'vitest'
import {
  exactMathAnswersMatch,
  normalizeMathAnswer as n,
} from './answer-normalize'

// The input-mode judge compares n(typed) against n(each accept form). These
// tests pin the typing variants a child actually produces.
describe('normalizeMathAnswer', () => {
  it('strips whitespace anywhere', () => {
    expect(n(' 3x + 3 ')).toBe('3x+3')
  })
  it('maps full-width chars from Chinese IME to half-width', () => {
    expect(n('３ｘ＋３')).toBe('3x+3')
    expect(n('－１')).toBe('-1')
    expect(n('１／２')).toBe('1/2')
  })
  it('unifies unicode minus signs', () => {
    expect(n('−2y')).toBe('-2y')
    expect(n('–2y')).toBe('-2y')
  })
  it('collapses explicit multiplication next to letters/brackets, keeps digit*digit', () => {
    expect(n('3×x')).toBe('3x')
    expect(n('3·x')).toBe('3x')
    expect(n('8*x')).toBe('8x')
    expect(n('x*y')).toBe('xy')
    expect(n('3*(a+1)')).toBe('3(a+1)')
    expect(n('2*3')).toBe('2*3') // numeric product stays explicit (23 ≠ 6)
  })
  it('normalizes LaTeX and Unicode division signs', () => {
    expect(n('2\\div3')).toBe('2/3')
    expect(n('2÷3')).toBe('2/3')
  })
  it('preserves grouped fraction scope', () => {
    expect(n('\\frac{1}{ab}')).toBe('1/(ab)')
    expect(n('\\frac{1}{a}b')).toBe('1/ab')
    expect(n('\\frac{a+b}{c}')).toBe('(a+b)/c')
    expect(n('a+\\frac{b}{c}')).toBe('a+b/c')
  })
  it('normalizes Greek Unicode and LaTeX commands consistently', () => {
    expect(n('α≠0')).toBe(n('\\alpha\\ne0'))
    expect(n('β≤γ')).toBe(n('\\beta\\le\\gamma'))
    expect(n('Ω')).toBe(n('\\Omega'))
    expect(n('φ')).toBe(n('\\varphi'))
  })
  it('turns superscripts into ^n', () => {
    expect(n('x²y')).toBe('x^2y')
    expect(n('x³')).toBe('x^3')
  })
  it('normalizes full-width brackets and trailing 句号', () => {
    expect(n('（a－1）。')).toBe('(a-1)')
  })
  it('judging: typed variants match canonical accept forms', () => {
    const accept = ['5x-2x+3', '3x+3']
    const typed = '５x − 2x ＋ 3' // full-width 5, unicode minus, full-width plus
    expect(accept.some((a) => n(a) === n(typed))).toBe(true)
  })

  it.each([
    ['Chinese text', '\\text{是}', ['是', '整式', '是整式'], '\\text{否}'],
    [
      'plus-minus fraction',
      '\\pm\\frac{2}{5}',
      ['{-2/5,2/5}', '-2/5,2/5', '2/5,-2/5', '±2/5'],
      '\\pm\\frac{3}{5}',
    ],
    [
      'not-equal fraction',
      'x\\ne\\frac12',
      ['x≠1/2', 'x!=1/2', 'ℝ∖{1/2}', 'R\\{1/2}'],
      'x=\\frac12',
    ],
    ['real numbers', '\\mathbb{R}', ['R', 'ℝ', '全体实数'], '\\mathbb{Z}'],
    [
      'finite set',
      '\\left\\{1,2,3,6\\right\\}',
      ['{1,2,3,6}', '1,2,3,6'],
      '\\left\\{1,2,3,5\\right\\}',
    ],
    ['plus-minus integer', '\\pm6', ['{-6,6}', '-6,6', '6,-6', '±6'], '\\pm5'],
  ])('matches MathLive LaTeX for %s', (_name, submitted, expected, wrong) => {
    expect(exactMathAnswersMatch(expected, submitted)).toBe(true)
    expect(exactMathAnswersMatch(expected, wrong)).toBe(false)
  })

  it.each([
    ['denominator product', '\\frac{1}{ab}', ['\\frac{1}{ab}'], '\\frac{1}{a}b'],
    [
      'condition denominator product',
      'x\\ne\\frac{1}{ab}',
      ['x\\ne\\frac{1}{ab}'],
      'x\\ne\\frac{1}{a}b',
    ],
    ['numerator group', '\\frac{a+b}{c}', ['\\frac{a+b}{c}'], 'a+\\frac{b}{c}'],
  ])('keeps operator scope for %s', (_name, submitted, expected, wrong) => {
    expect(exactMathAnswersMatch(expected, submitted)).toBe(true)
    expect(exactMathAnswersMatch(expected, wrong)).toBe(false)
  })
})
