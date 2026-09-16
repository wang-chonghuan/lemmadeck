import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { LessonRow } from './catalog'

describe('Catalog lesson availability', () => {
  it('keeps an unpublished section expandable while disabling its destinations', () => {
    const html = renderToStaticMarkup(
      <LessonRow
        lesson={{
          id: 'alg6-c2-s1',
          number: '2.1',
          title: '示例',
          ready: false,
          cardId: 'alg6-c2-s1-n8',
          topics: [
            { id: 'alg6-c2-s1-n8', number: 8, title: '未生成一', ready: false },
            { id: 'alg6-c2-s1-n9', number: 9, title: '未生成二', ready: false },
          ],
        }}
        title="2.1 示例"
        openCard={undefined}
        onNavigate={vi.fn()}
      />,
    )

    expect(html).toContain('<details')
    expect(html).toContain('<summary>')
    expect(html.match(/aria-disabled="true"/g)).toHaveLength(3)
    expect(html.match(/sr-out-disabled/g)).toHaveLength(3)
    expect(html).not.toContain('<a')
  })

  it('marks an unpublished leaf lesson as disabled', () => {
    const html = renderToStaticMarkup(
      <LessonRow
        lesson={{
          id: 'alg6-c2-ex',
          number: '',
          title: '练习',
          ready: false,
          cardId: 'alg6-c2-ex',
          topics: [],
        }}
        title="练习"
        openCard={undefined}
        onNavigate={vi.fn()}
      />,
    )

    expect(html).toContain('class="sr-out-lesson sr-out-disabled"')
    expect(html).toContain('aria-disabled="true"')
    expect(html).not.toContain('<a')
  })
})
