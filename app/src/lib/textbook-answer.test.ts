import { describe, expect, it } from 'vitest'

import { judgeTextbookPart, recordTextbookSubmission } from './textbook-answer'

describe('judgeTextbookPart', () => {
  it('accepts equivalent numeric forms', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'numeric', expected: ['0.75'], unit: '' },
        '\\frac{3}{4}',
      ),
    ).resolves.toBe(true)
  })

  it('accepts displayed percent and degree units', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'numeric', expected: ['66.7'], unit: '%', tolerance: 0.1 },
        '66.7\\%',
      ),
    ).resolves.toBe(true)
    await expect(
      judgeTextbookPart(
        { judge: 'numeric', expected: ['60'], unit: '°' },
        '60^{\\circ}',
      ),
    ).resolves.toBe(true)
  })

  it('uses configured numeric tolerance', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'numeric', expected: ['18000'], tolerance: 500 },
        '17847',
      ),
    ).resolves.toBe(true)
  })

  it('accepts algebraically equivalent expressions', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'expression', expected: ['(x+1)^2'] },
        'x^2+2x+1',
      ),
    ).resolves.toBe(true)
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
  ])('normalizes exact MathLive answers for %s', async (
    _name,
    submitted,
    expected,
    wrong,
  ) => {
    await expect(
      judgeTextbookPart(
        { judge: 'exact', expected },
        submitted,
      ),
    ).resolves.toBe(true)
    await expect(
      judgeTextbookPart(
        { judge: 'exact', expected },
        wrong,
      ),
    ).resolves.toBe(false)
  })

  it('keeps multiplication outside a fraction denominator distinct', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'exact', expected: ['x\\ne\\frac{1}{ab}'] },
        'x\\ne\\frac{1}{ab}',
      ),
    ).resolves.toBe(true)
    await expect(
      judgeTextbookPart(
        { judge: 'exact', expected: ['x\\ne\\frac{1}{ab}'] },
        'x\\ne\\frac{1}{a}b',
      ),
    ).resolves.toBe(false)
  })

  it('accepts equivalent Unicode and LaTeX Greek symbols', async () => {
    await expect(
      judgeTextbookPart(
        { judge: 'exact', expected: ['α≠0'] },
        '\\alpha\\ne0',
      ),
    ).resolves.toBe(true)
  })

  it('rejects a different value', async () => {
    await expect(
      judgeTextbookPart({ judge: 'numeric', expected: ['18'] }, '17'),
    ).resolves.toBe(false)
  })
})

describe('recordTextbookSubmission', () => {
  it('keeps both wrong-answer writes inside one transaction', async () => {
    const statements: string[] = []
    let beginCalls = 0
    const database = {
      begin: async (callback: (tx: unknown) => Promise<void>) => {
        beginCalls += 1
        const tx = (strings: TemplateStringsArray) => {
          const statement = strings.join('?')
          statements.push(statement)
          if (statement.includes('sr_textbook_mistakes')) {
            throw new Error('forced mistake write failure')
          }
          return Promise.resolve([])
        }
        await callback(tx)
      },
    } as unknown as Parameters<typeof recordTextbookSubmission>[0]

    await expect(
      recordTextbookSubmission(database, {
        userId: 2,
        bookId: '5m',
        lessonId: 'math5-c1-s1-n1',
        exercise: '9',
        isCorrect: false,
        answerText: 'wrong',
        locale: 'en',
      }),
    ).rejects.toThrow('forced mistake write failure')

    expect(beginCalls).toBe(1)
    expect(statements).toHaveLength(2)
    expect(statements[0]).toContain('sr_content_answer_events')
    expect(statements[1]).toContain('sr_textbook_mistakes')
  })

  it('does not write a mistake for a correct submission', async () => {
    const statements: string[] = []
    const database = {
      begin: async (callback: (tx: unknown) => Promise<void>) => {
        const tx = (strings: TemplateStringsArray) => {
          statements.push(strings.join('?'))
          return Promise.resolve([])
        }
        await callback(tx)
      },
    } as unknown as Parameters<typeof recordTextbookSubmission>[0]

    await recordTextbookSubmission(database, {
      userId: 2,
      bookId: '5m',
      lessonId: 'math5-c1-s1-n1',
      exercise: '9',
      isCorrect: true,
      answerText: '18',
      locale: 'en',
    })

    expect(statements).toHaveLength(1)
    expect(statements[0]).toContain('sr_content_answer_events')
  })
})
