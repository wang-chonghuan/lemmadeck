import type { MouseEventHandler, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { LessonRow } from './catalog'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...await importOriginal<typeof import('@tanstack/react-router')>(),
  Link: ({ params, className, onClick, children }: {
    params: { id: string }
    className: string
    onClick: MouseEventHandler<HTMLAnchorElement>
    children: ReactNode
  }) => <a href={`/card/${params.id}`} className={className} onClick={onClick}>{children}</a>,
}))

describe('Catalog lesson availability', () => {
  it('keeps an unpublished section expandable while disabling its destinations', () => {
    const html = renderToStaticMarkup(
      <LessonRow
        lesson={{
          id: 'alg6-c2-s1',
          number: '2.1',
          title: '示例',
          hasOwnCard: false,
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
    expect(html.match(/aria-disabled="true"/g)).toHaveLength(2)
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
          hasOwnCard: true,
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

  it('renders an unnumbered supplemental card separately from its parent lesson', () => {
    const html = renderToStaticMarkup(
      <LessonRow
        lesson={{
          id: 'phy6-c2-s4',
          number: '2.4',
          title: '气体、液体及固体中的扩散现象',
          hasOwnCard: true,
          ready: false,
          cardId: 'phy6-c2-s4',
          topics: [{
            id: 'phy6-c2-s4-t1',
            number: null,
            title: '布朗运动',
            ready: false,
          }],
        }}
        title="2.4 气体、液体及固体中的扩散现象"
        openCard="phy6-c2-s4"
        onNavigate={vi.fn()}
      />,
    )

    expect(html.match(/aria-disabled="true"/g)).toHaveLength(1)
    expect(html).toContain('气体、液体及固体中的扩散现象')
    expect(html).toContain('布朗运动')
    expect(html).not.toContain('sr-out-topic-n')
  })

  it.each([false, true])('never links a published branch title (hasOwnCard: %s)', (hasOwnCard) => {
    const onNavigate = vi.fn()
    const html = renderToStaticMarkup(
      <LessonRow
        lesson={{
          id: 'section',
          number: '2.4',
          title: '分支',
          hasOwnCard,
          ready: true,
          cardId: hasOwnCard ? 'section' : 'topic-ready',
          topics: [
            { id: 'topic-ready', number: hasOwnCard ? null : 19, title: '已发布', ready: true },
            { id: 'topic-unavailable', number: hasOwnCard ? null : 20, title: '未发布', ready: false },
          ],
        }}
        title="2.4 分支"
        openCard="topic-ready"
        onNavigate={onNavigate}
      />,
    )

    const summary = html.match(/<summary>(.*?)<\/summary>/)?.[1]
    expect(summary).toContain('2.4 分支')
    expect(summary).not.toContain('<a')
    expect(summary).not.toContain('aria-disabled')
    expect(html).toContain('open=""')
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toContain('href="/card/topic-ready"')
    expect(html).not.toContain('href="/card/section"')
    expect(html).not.toContain('href="/card/topic-unavailable"')
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('keeps a published leaf linked to its own course with the navigation callback', () => {
    const onNavigate = vi.fn()
    const row = LessonRow({
      lesson: {
        id: 'leaf',
        number: '',
        title: '独立课程',
        hasOwnCard: true,
        ready: true,
        cardId: 'leaf',
        topics: [],
      },
      title: '独立课程',
      openCard: undefined,
      onNavigate,
    })
    const html = renderToStaticMarkup(row)

    expect(html).toContain('href="/card/leaf"')
    expect(html).not.toContain('<details')
    expect(row.props.children.props.onClick).toBe(onNavigate)
  })
})
