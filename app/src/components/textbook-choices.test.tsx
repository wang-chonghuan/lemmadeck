import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { TextbookChoices } from './textbook-choices'

vi.mock('~/lib/textbook-choice', () => ({
  getTextbookChoiceProgress: vi.fn(),
  restartTextbookChoices: vi.fn(),
  submitTextbookChoice: vi.fn(),
}))

describe('Textbook choice pagination', () => {
  it.each([1, 50, 51, 100, 103])('shows at most 50 of %i questions and paginates only long decks', (count) => {
    const deck = { revision: 'r1', questions: Array.from({ length: count }, (_, index) => ({
      id: `q${index + 1}`, mode: 'single' as const, html: `Question ${index + 1}`, figures: [],
      options: [{ id: 'a', html: '1' }, { id: 'b', html: '2' }],
    })) }
    const html = renderToStaticMarkup(<TextbookChoices deck={deck} lessonId="lesson" locale="zh" />)
    expect(html.match(/data-testid="choice-question"/g)).toHaveLength(Math.min(count, 50))
    expect(html).toContain('aria-label="选择题"')
    expect(html.includes('aria-label="选择题分页"')).toBe(count > 50)
    if (count > 50) {
      expect(html).toContain(`第 1 / ${Math.ceil(count / 50)} 页`)
      expect(html).not.toContain('Question 51')
    }
  })
  it('shows checkbox selection and an explicit submit only for multiple questions', () => {
    const deck = { revision: 'r1', questions: [{
      id: 'q1', mode: 'multiple' as const, html: 'Choose all', figures: [],
      options: [{ id: 'a', html: 'A' }, { id: 'b', html: 'B' }],
    }, {
      id: 'q2', mode: 'single' as const, html: 'Choose one', figures: [],
      options: [{ id: 'a', html: 'A' }, { id: 'b', html: 'B' }],
    }] }
    const html = renderToStaticMarkup(<TextbookChoices deck={deck} lessonId="lesson" locale="zh" />)
    expect(html.match(/role="checkbox"/g)).toHaveLength(2)
    expect(html.match(/role="radio"/g)).toHaveLength(2)
    expect(html.match(/提交答案/g)).toHaveLength(1)
    expect(html).toContain('多选题')
    expect(html).toContain('单选题')
  })
})
