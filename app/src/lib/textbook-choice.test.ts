import { describe, expect, it, vi } from 'vitest'
vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({ validator: () => ({ handler: (handler: unknown) => handler }) }),
}))
vi.mock('~/lib/db', () => ({ sql: vi.fn() }))
vi.mock('~/lib/session.server', () => ({ currentUserId: () => null }))
vi.mock('~/lib/locale.server', () => ({ currentLocale: () => 'zh' }))
import { projectChoiceDeck, judgeChoice } from './textbook-choice'

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
})
