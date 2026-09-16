import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MathAnswerField } from './math-answer-field'

describe('exercise keyboard coverage', () => {
  for (const input of ['number', 'math'] as const) {
    it(`provides a keyboard control for every ${input} answer part`, () => {
      const html = renderToStaticMarkup(
        <MathAnswerField
          lessonId="test"
          exercise="1"
          storageKey="test"
          locale="zh"
          answerSpec={{
            grading: 'auto',
            parts: [{ input, label: 'a)' }, { input, label: 'b)' }],
          }}
        />,
      )
      expect(html.match(/aria-label="数学键盘"/g)).toHaveLength(4)
      const targets = [...html.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1])
      expect(targets).toHaveLength(2)
      expect(new Set(targets).size).toBe(2)
      expect(html).not.toContain('<input')
    })
  }

  it('also provides a keyboard for an ungraded free answer', () => {
    const html = renderToStaticMarkup(
      <MathAnswerField
        lessonId="test" exercise="2" storageKey="test" locale="zh"
        answerSpec={{ grading: 'ungraded', parts: [] }}
      />,
    )
    expect(html.match(/aria-controls=/g)).toHaveLength(1)
  })
})
