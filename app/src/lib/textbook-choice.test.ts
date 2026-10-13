import { describe, expect, it, vi } from 'vitest'
vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({ validator: () => ({ handler: (handler: unknown) => handler }) }),
}))
vi.mock('~/lib/db', () => ({ sql: vi.fn() }))
vi.mock('~/lib/session.server', () => ({ currentUserId: () => null }))
vi.mock('~/lib/locale.server', () => ({ currentLocale: () => 'zh' }))
import { projectChoiceDeck, judgeChoice, loadChoiceProgress, saveChoiceAnswer } from './textbook-choice'

describe('choice client projection', () => {
  const deck = { revision: 'r1', questions: [{
    id: 'q1', mode: 'single' as const, sourceNumbers: ['1'],
    html: 'Question', figures: [], correctOptionIds: ['right'], explanationHtml: 'Current answer',
    options: [{ id: 'wrong', html: '2', misconception: 'Sign lost' }, { id: 'right', html: '-2' }],
  }] }
  it('judges stable IDs independently of display order and rejects stale revisions', () => {
    const data = { revision: 'r1', questionId: 'q1', optionIds: ['right'] }
    expect(judgeChoice(deck, data)).toMatchObject({ isCorrect: true })
    const reversed = structuredClone(deck)
    reversed.questions[0].options.reverse()
    expect(judgeChoice(reversed, data)).toMatchObject({ isCorrect: true })
    expect(judgeChoice(deck, { ...data, optionIds: ['wrong'] })).toMatchObject({
      isCorrect: false, misconception: 'Sign lost',
    })
    expect(judgeChoice(deck, { ...data, revision: 'old' })).toHaveProperty('error')
    expect(judgeChoice(deck, { ...data, optionIds: ['missing'] })).toHaveProperty('error')
  })
  it('returns only student question data, never answers or internal source mappings', () => {
    const deck = {
      revision: 'revision', questions: [{
        id: 'ex1-1', mode: 'multiple' as const, sourceNumbers: ['1'],
        html: 'Question', figures: [], correctOptionIds: ['o1'], explanationHtml: 'Answer',
        options: [{ id: 'o1', html: '1' }, { id: 'o2', html: '2', misconception: 'Wrong' }],
        verification: { expected: '1' },
      }],
    }
    const client = JSON.stringify(projectChoiceDeck(deck))
    expect(client).not.toMatch(/correctOptionId|explanationHtml|misconception|verification|source|target|group/)
    expect(JSON.parse(client).questions[0].options).toHaveLength(2)
    expect(projectChoiceDeck(undefined)).toBeNull()
  })

  it('keeps anonymous progress empty and refuses a changed account without writing', async () => {
    const database = vi.fn() as unknown as Parameters<typeof saveChoiceAnswer>[0]
    expect(await loadChoiceProgress(database, null, 'lesson', deck)).toEqual({
      userId: null, roundId: '0', attempts: {},
    })
    const data = { lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionIds: ['right'], roundId: '0', userId: 2 }
    expect(await saveChoiceAnswer(database, null, 'zh', data, deck)).toHaveProperty('error')
    expect(database).not.toHaveBeenCalled()
    expect(await saveChoiceAnswer(database, null, 'zh', { ...data, userId: null }, deck))
      .toMatchObject({ optionIds: ['right'], result: { isCorrect: true } })
  })

  it('restores only answered questions in the user revision and current round', async () => {
    const transaction = vi.fn()
      .mockResolvedValueOnce([{ id: '25' }])
      .mockResolvedValueOnce([
        { node_id: 'choice:r1:q1', answer_text: '["wrong"]', is_correct: false },
        { node_id: 'choice:r1:removed', answer_text: '["right"]', is_correct: true },
      ])
    const database = { begin: vi.fn(async (_options, fn) => fn(transaction)) } as unknown as Parameters<typeof loadChoiceProgress>[0]
    const result = await loadChoiceProgress(database, 2, 'lesson', deck)
    expect(result).toMatchObject({
      userId: 2, roundId: '25', attempts: { q1: { optionIds: ['wrong'], result: { isCorrect: false } } },
    })
    expect(Object.keys(result.attempts)).toEqual(['q1'])
    expect(transaction.mock.calls[1]).toContain('25')
    expect(transaction.mock.calls[1]).toContain('choice:r1:')
  })

  it('returns the saved first pick for a retried submission without inserting again', async () => {
    const transaction = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ answer_text: '["wrong"]', is_correct: false }])
    const database = { begin: vi.fn(async (fn) => fn(transaction)) } as unknown as Parameters<typeof saveChoiceAnswer>[0]
    const result = await saveChoiceAnswer(database, 2, 'zh', {
      lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionIds: ['right'], roundId: '0', userId: 2,
    }, deck)
    expect(result).toMatchObject({ optionIds: ['wrong'], result: { isCorrect: false } })
    expect(transaction).toHaveBeenCalledTimes(3)
  })

  it('rejects a submission from an earlier practice round', async () => {
    const transaction = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: '30' }])
    const database = { begin: vi.fn(async (fn) => fn(transaction)) } as unknown as Parameters<typeof saveChoiceAnswer>[0]
    expect(await saveChoiceAnswer(database, 2, 'zh', {
      lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionIds: ['right'], roundId: '0', userId: 2,
    }, deck)).toHaveProperty('error')
    expect(transaction).toHaveBeenCalledTimes(2)
  })

  it('judges a multiple selection as an order-independent exact set', () => {
    const multiple = { revision: 'r2', questions: [{
      id: 'q2', mode: 'multiple' as const, sourceNumbers: ['2'],
      html: 'Choose all', figures: [], correctOptionIds: ['a', 'c'], explanationHtml: 'Reason',
      options: [{ id: 'a', html: 'A' }, { id: 'b', html: 'B', misconception: 'Wrong rule' }, { id: 'c', html: 'C' }],
    }] }
    const data = { revision: 'r2', questionId: 'q2' }
    expect(judgeChoice(multiple, { ...data, optionIds: ['c', 'a'] })).toMatchObject({ isCorrect: true })
    expect(judgeChoice(multiple, { ...data, optionIds: ['a'] })).toMatchObject({ isCorrect: false })
    expect(judgeChoice(multiple, { ...data, optionIds: ['a', 'b', 'c'] })).toMatchObject({ isCorrect: false, misconception: 'Wrong rule' })
    expect(judgeChoice(multiple, { ...data, optionIds: ['a', 'a'] })).toHaveProperty('error')
    expect(judgeChoice(multiple, { ...data, optionIds: [] })).toHaveProperty('error')
    expect(judgeChoice(deck, { revision: 'r1', questionId: 'q1', optionIds: ['wrong', 'right'] })).toHaveProperty('error')
  })

  it('saves the canonical selected set with learner, lesson, question and correctness', async () => {
    const multiple = { revision: 'r2', questions: [{
      id: 'q2', mode: 'multiple' as const, sourceNumbers: ['2'],
      html: 'Choose all', figures: [], correctOptionIds: ['a', 'c'], explanationHtml: 'Reason',
      options: [{ id: 'a', html: 'A' }, { id: 'b', html: 'B' }, { id: 'c', html: 'C' }],
    }] }
    const transaction = vi.fn().mockResolvedValue([])
    const database = { begin: vi.fn(async (fn) => fn(transaction)) } as unknown as Parameters<typeof saveChoiceAnswer>[0]
    expect(await saveChoiceAnswer(database, 2, 'zh', {
      lessonId: 'lesson', revision: 'r2', questionId: 'q2',
      optionIds: ['c', 'a'], userId: 2, roundId: '0',
    }, multiple)).toMatchObject({ optionIds: ['a', 'c'], result: { isCorrect: true } })
    expect(transaction.mock.calls[3].slice(1)).toEqual([2, 'lesson', 'choice:r2:q2', true, null, '["a","c"]', 'zh'])
  })
})
