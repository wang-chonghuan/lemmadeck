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
    id: 'q1', source: { exercise: '1', target: 'value' }, group: null,
    html: 'Question', figures: [], correctOptionId: 'right', explanationHtml: 'Current answer',
    options: [{ id: 'wrong', html: '2', misconception: 'Sign lost' }, { id: 'right', html: '-2' }],
  }] }
  it('judges stable IDs independently of display order and rejects stale revisions', () => {
    const data = { revision: 'r1', questionId: 'q1', optionId: 'right' }
    expect(judgeChoice(deck, data)).toMatchObject({ isCorrect: true })
    const reversed = structuredClone(deck)
    reversed.questions[0].options.reverse()
    expect(judgeChoice(reversed, data)).toMatchObject({ isCorrect: true })
    expect(judgeChoice(deck, { ...data, optionId: 'wrong' })).toMatchObject({
      isCorrect: false, misconception: 'Sign lost',
    })
    expect(judgeChoice(deck, { ...data, revision: 'old' })).toHaveProperty('error')
    expect(judgeChoice(deck, { ...data, optionId: 'missing' })).toHaveProperty('error')
  })
  it('returns only student question data, never answers or internal source mappings', () => {
    const deck = {
      revision: 'revision', questions: [{
        id: 'ex1-1', source: { exercise: '1', target: 'value' }, group: null,
        html: 'Question', figures: [], correctOptionId: 'o1', explanationHtml: 'Answer',
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
    const data = { lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionId: 'right', roundId: '0', userId: 2 }
    expect(await saveChoiceAnswer(database, null, 'zh', data, deck)).toHaveProperty('error')
    expect(database).not.toHaveBeenCalled()
    expect(await saveChoiceAnswer(database, null, 'zh', { ...data, userId: null }, deck))
      .toMatchObject({ optionId: 'right', result: { isCorrect: true } })
  })

  it('restores only answered questions in the user revision and current round', async () => {
    const transaction = vi.fn()
      .mockResolvedValueOnce([{ id: '25' }])
      .mockResolvedValueOnce([
        { node_id: 'choice:r1:q1', answer_text: 'wrong', is_correct: false },
        { node_id: 'choice:r1:removed', answer_text: 'right', is_correct: true },
      ])
    const database = { begin: vi.fn(async (_options, fn) => fn(transaction)) } as unknown as Parameters<typeof loadChoiceProgress>[0]
    const result = await loadChoiceProgress(database, 2, 'lesson', deck)
    expect(result).toMatchObject({
      userId: 2, roundId: '25', attempts: { q1: { optionId: 'wrong', result: { isCorrect: false } } },
    })
    expect(Object.keys(result.attempts)).toEqual(['q1'])
    expect(transaction.mock.calls[1]).toContain('25')
    expect(transaction.mock.calls[1]).toContain('choice:r1:')
  })

  it('returns the saved first pick for a retried submission without inserting again', async () => {
    const transaction = vi.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ answer_text: 'wrong', is_correct: false }])
    const database = { begin: vi.fn(async (fn) => fn(transaction)) } as unknown as Parameters<typeof saveChoiceAnswer>[0]
    const result = await saveChoiceAnswer(database, 2, 'zh', {
      lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionId: 'right', roundId: '0', userId: 2,
    }, deck)
    expect(result).toMatchObject({ optionId: 'wrong', result: { isCorrect: false } })
    expect(transaction).toHaveBeenCalledTimes(3)
  })

  it('rejects a submission from an earlier practice round', async () => {
    const transaction = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: '30' }])
    const database = { begin: vi.fn(async (fn) => fn(transaction)) } as unknown as Parameters<typeof saveChoiceAnswer>[0]
    expect(await saveChoiceAnswer(database, 2, 'zh', {
      lessonId: 'lesson', revision: 'r1', questionId: 'q1', optionId: 'right', roundId: '0', userId: 2,
    }, deck)).toHaveProperty('error')
    expect(transaction).toHaveBeenCalledTimes(2)
  })
})
