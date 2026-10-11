import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Menu,
  MessageCircleQuestion,
  Star,
} from 'lucide-react'

import { useEffect, useRef, useState } from 'react'

import { BrandMark } from '~/components/brand-mark'
import { TextbookChoices } from '~/components/textbook-choices'
import { getTextbookChoices } from '~/lib/textbook-choice'
import { t, type Locale } from '~/lib/i18n'
import { useLayoutStore } from '~/lib/layout-store'
import { getLocale } from '~/lib/locale'
import {
  getCardContent,
  type CardExercise,
  type CardFigure,
  type ProseBlock,
} from '~/lib/lessons'
import { findCard } from '~/lib/textbooks'

// One card: a numbered teaching item from the printed book.
//
// The body is what the scan actually says — 課文 blocks and the book's own
// numbered exercises, transcribed by ld-s10y-lesson. Both arrive as HTML fragments
// with the formulas already rendered and the figures inline, so this page
// lays them out with the app's own typography. It deliberately does NOT host a
// self-contained document in an iframe: that made the text a second document
// inside the product (its own fonts, its own measure) and left its height to be
// guessed, which is what pushed the action bar into the middle of the page.
export const Route = createFileRoute('/_app/card/$id')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: 'ex' | 'choices'; exercise?: string } => {
    const exercise =
      typeof search.exercise === 'string'
        ? search.exercise.trim()
        : typeof search.exercise === 'number'
          ? String(search.exercise)
          : ''
    return {
      tab: search.tab === 'ex' || search.tab === 'choices' ? search.tab : undefined,
      exercise: exercise || undefined,
    }
  },
  component: CardPage,
  loader: async ({ params }) => {
    const [locale, content, choices] = await Promise.all([
      getLocale(),
      getCardContent({ data: params.id }),
      getTextbookChoices({ data: params.id }),
    ])
    return { locale, content, choices, card: findCard(params.id, locale) }
  },
})

function figureMaxWidth(figure: CardFigure) {
  const { maxWidthPx } = figure
  return (
    typeof maxWidthPx === 'number' &&
    Number.isInteger(maxWidthPx) &&
    maxWidthPx >= 128 &&
    maxWidthPx <= 960
  )
    ? maxWidthPx
    : undefined
}

function FigureMedia({ figure }: { figure: CardFigure }) {
  const layered = Boolean(figure.image && figure.svg)
  const maxWidthPx = figureMaxWidth(figure)
  return (
    <div
      className={`sr-figure-media${layered ? ' sr-figure-layered' : ''}`}
      data-figure-mode={figure.mode}
      data-figure-purpose={figure.purpose ?? 'instructional'}
      data-figure-theme="neutral"
      style={maxWidthPx ? { width: maxWidthPx, maxWidth: '100%' } : undefined}
    >
      {figure.image ? (
        <img
          className="sr-figure-artwork"
          src={figure.image}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      {figure.svg ? (
        <div
          className="sr-figure-vector"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: figure.svg }}
        />
      ) : null}
    </div>
  )
}

type FigureBlock = Extract<ProseBlock, { kind: 'fig' }>
type CaptionBlock = Extract<ProseBlock, { kind: 'cap' }>
type ProseDisplayBlock =
  | ProseBlock
  | {
      kind: 'compact-group'
      items: { figure: FigureBlock; caption: CaptionBlock }[]
    }

function groupCompactFigures(blocks: ProseBlock[]): ProseDisplayBlock[] {
  const grouped: ProseDisplayBlock[] = []
  let index = 0

  while (index < blocks.length) {
    const block = blocks[index]
    if (block.kind !== 'fig' || figureMaxWidth(block) === undefined) {
      grouped.push(block)
      index += 1
      continue
    }

    const figures: FigureBlock[] = []
    let cursor = index
    while (
      cursor < blocks.length &&
      blocks[cursor].kind === 'fig' &&
      figureMaxWidth(blocks[cursor] as FigureBlock) !== undefined
    ) {
      figures.push(blocks[cursor] as FigureBlock)
      cursor += 1
    }

    const captions: CaptionBlock[] = []
    const figureEnd = cursor
    while (
      cursor < blocks.length &&
      captions.length < figures.length &&
      blocks[cursor].kind === 'cap'
    ) {
      captions.push(blocks[cursor] as CaptionBlock)
      cursor += 1
    }

    if (captions.length === figures.length) {
      grouped.push({
        kind: 'compact-group',
        items: figures.map((figure, itemIndex) => ({
          figure,
          caption: captions[itemIndex],
        })),
      })
      index = cursor
      continue
    }

    grouped.push(...figures)
    index = figureEnd
  }

  return grouped
}

function Prose({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="sr-read">
      {groupCompactFigures(blocks).map((b, i) =>
        b.kind === 'compact-group' ? (
          <div className="sr-compact-figures" key={`compact-${i}`}>
            {b.items.map(({ figure, caption }) => (
              <figure
                key={figure.id}
                className="sr-compact-figure"
                aria-label={figure.label ?? undefined}
                data-figure-id={figure.id}
                data-figure-layout={figure.layout ?? 'inline'}
                data-figure-purpose={figure.purpose ?? 'instructional'}
                style={{ width: figureMaxWidth(figure), maxWidth: '100%' }}
              >
                <FigureMedia figure={figure} />
                <figcaption
                  className="sr-compact-caption"
                  dangerouslySetInnerHTML={{ __html: caption.html }}
                />
              </figure>
            ))}
          </div>
        ) : b.kind === 'fig' ? (
          <figure
            key={i}
            className="sr-read-fig"
            aria-label={b.label ?? undefined}
            data-figure-id={b.id}
            data-figure-layout={b.layout ?? 'inline'}
            data-figure-purpose={b.purpose ?? 'instructional'}
          >
            <FigureMedia figure={b} />
          </figure>
        ) : b.kind === 'cap' ? (
          <p key={i} className="sr-read-cap" dangerouslySetInnerHTML={{ __html: b.html }} />
        ) : (
          <p
            key={i}
            className={`sr-read-p${b.sectionBreak ? ' sr-read-section' : ''}`}
            dangerouslySetInnerHTML={{ __html: b.html }}
          />
        ),
      )}
    </div>
  )
}

// `number` is a stable lesson-local identity. `sourceNumber` is what the book
// actually printed and may be null for an unnumbered question.
function Exercises({
  items,
  locale,
  targetExercise,
  anchors = true,
}: {
  items: CardExercise[]
  locale: Locale
  targetExercise?: string
  anchors?: boolean
}) {
  let group: string | null | undefined
  return (
    <div className="sr-ex-list">
      {items.map((e) => {
        const head = e.group !== group ? ((group = e.group), e.group) : null
        return (
          <section key={e.number} className="sr-ex-wrap">
            {head !== null && <h2 className="sr-ex-group">{head || t(locale, 'card.practice')}</h2>}
            <article
              className={`sr-ex${
                anchors && e.number === targetExercise ? ' sr-ex-target' : ''
              }`}
              id={anchors ? `ex-${e.number}` : undefined}
            >
              <div className="sr-ex-n sr-num">{e.sourceNumber ?? ''}</div>
              <div className="sr-ex-body">
                <div dangerouslySetInnerHTML={{ __html: e.html }} />
                {e.figures.map((f) => (
                  <figure
                    key={f.id}
                    className="sr-ex-fig"
                    data-figure-id={f.id}
                    data-figure-layout={f.layout ?? 'inline'}
                    data-figure-purpose={f.purpose ?? 'instructional'}
                    aria-label={f.label ?? undefined}
                  >
                    <FigureMedia figure={f} />
                  </figure>
                ))}
              </div>
            </article>
          </section>
        )
      })}
    </div>
  )
}

function CardPage() {
  const { locale, content, choices, card } = Route.useLoaderData()
  const search = Route.useSearch()
  const setDrawer = useLayoutStore((s) => s.setDrawer)
  const where = useRef<HTMLElement>(null)
  const [tab, setTab] = useState<'read' | 'ex' | 'choices'>('read')

  // Park the trail at its own end, so a trail too long for the pane shows the
  // section rather than the volume. Re-run once the display font lands.
  const cardId = card?.id
  useEffect(() => {
    const el = where.current
    if (!el) return
    const park = () => {
      el.scrollLeft = el.scrollWidth
    }
    park()
    document.fonts?.ready.then(park).catch(() => {})
  }, [cardId])

  // Existing exercise links open the writing tab at the book-numbered problem.
  useEffect(() => {
    setTab(
      search.tab === 'choices' && choices
        ? 'choices'
        : search.tab === 'ex' && (content?.exercises.length ?? 0) > 0
        ? 'ex'
        : 'read',
    )
  }, [cardId, content?.exercises.length, choices, search.tab])

  useEffect(() => {
    if (tab !== 'ex' || !search.exercise) return
    const scrollToExercise = () => {
      document.getElementById(`ex-${search.exercise}`)?.scrollIntoView({
        block: 'center',
      })
    }
    // TanStack's page-navigation restoration resets the detail pane after the
    // first paint. Scroll after restoration so the requested problem stays in view.
    const timers = [
      window.setTimeout(scrollToExercise, 80),
      window.setTimeout(scrollToExercise, 500),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [cardId, search.exercise, tab])

  const top = (title: string, printable = false) => (
    <div className="sr-d-top">
      <button
        className="sr-navtoggle"
        aria-label={t(locale, 'cat.open')}
        type="button"
        onClick={() => setDrawer(true)}
      >
        <Menu size={18} />
      </button>
      <BrandMark className="sr-title-logo" size={22} decorative />
      <span className="sr-d-title">{title}</span>
      {printable && (
        <button
          type="button"
          className="sr-icontool sr-d-download"
          onClick={() => window.print()}
          aria-label={t(locale, 'lesson.pdf')}
          title={t(locale, 'lesson.pdf')}
        >
          <Download size={17} aria-hidden />
        </button>
      )}
    </div>
  )

  if (!card) {
    return (
      <main className="sr-detail">
        {top(t(locale, 'deck.missing'))}
        <div className="sr-d-scroll" data-scroll-restoration-id="app-detail">
          <p className="sr-note">{t(locale, 'deck.missing')}</p>
        </div>
      </main>
    )
  }

  const exercises = content?.exercises ?? []
  const prose = content?.prose ?? []

  return (
    <main className="sr-detail">
      {top(card.trail[card.trail.length - 1], prose.length > 0 || exercises.length > 0)}
      <div className="sr-d-scroll" data-scroll-restoration-id="app-detail">
        <article className="sr-deck">
          <nav
            className="sr-deck-where"
            aria-label={t(locale, 'cat.group.curriculum')}
            ref={where}
          >
            {card.trail.map((step, i) => (
              <span key={step} className="sr-deck-step">
                {i > 0 && <span aria-hidden>/</span>}
                {step}
              </span>
            ))}
          </nav>

          <h1 className="sr-deck-title">
            {card.number !== null && <span className="sr-deck-n sr-num">{card.number}</span>}
            {card.title}
          </h1>

          {(exercises.length > 0 || choices) && (
            <div className="sr-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'read'}
                className={`sr-tab${tab === 'read' ? ' on' : ''}`}
                onClick={() => setTab('read')}
              >
                {t(locale, 'card.read')}
              </button>
              {choices && (
                <button type="button" role="tab" aria-selected={tab === 'choices'}
                  className={`sr-tab${tab === 'choices' ? ' on' : ''}`}
                  onClick={() => setTab('choices')}>
                  {t(locale, 'card.exercises')}
                  <span className="sr-tab-n">{choices.questions.length}</span>
                </button>
              )}
              {exercises.length > 0 && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'ex'}
                  className={`sr-tab${tab === 'ex' ? ' on' : ''}`}
                  onClick={() => setTab('ex')}
                >
                  {t(locale, 'card.writing')}
                  <span className="sr-tab-n">{exercises.length}</span>
                </button>
              )}
            </div>
          )}

          {prose.length === 0 && exercises.length === 0 ? (
            <div className="sr-deck-empty">
              <p className="sr-note">{t(locale, 'deck.empty')}</p>
            </div>
          ) : tab === 'read' ? (
            <Prose blocks={prose} />
          ) : tab === 'choices' && choices ? (
            <TextbookChoices key={`${card.id}:${choices.revision}`} deck={choices} lessonId={card.id} locale={locale} />
          ) : (
            <section aria-label={t(locale, 'card.writing')} data-testid="textbook-writing">
              <Exercises
                items={exercises}
                locale={locale}
                targetExercise={search.exercise}
              />
            </section>
          )}

          <footer className="sr-deck-actions">
            <button type="button" className="sr-deck-act">
              <Star size={15} aria-hidden /> {t(locale, 'deck.fav')}
            </button>
            <button type="button" className="sr-deck-act">
              <MessageCircleQuestion size={15} aria-hidden /> {t(locale, 'deck.askai')}
            </button>
            <span className="sr-deck-spacer" />
            <span className="sr-deck-turn">
              {card.prev ? (
                <Link
                  to="/card/$id"
                  params={{ id: card.prev.id }}
                  className="sr-deck-act"
                  title={card.prev.title}
                >
                  <ChevronLeft size={15} aria-hidden /> {t(locale, 'deck.prev')}
                </Link>
              ) : (
                <span className="sr-deck-act disabled">
                  <ChevronLeft size={15} aria-hidden /> {t(locale, 'deck.prev')}
                </span>
              )}
              {card.next ? (
                <Link
                  to="/card/$id"
                  params={{ id: card.next.id }}
                  className="sr-deck-act"
                  title={card.next.title}
                >
                  {t(locale, 'deck.next')} <ChevronRight size={15} aria-hidden />
                </Link>
              ) : (
                <span className="sr-deck-act disabled">
                  {t(locale, 'deck.next')} <ChevronRight size={15} aria-hidden />
                </span>
              )}
            </span>
          </footer>
        </article>
      </div>
      <article
        className="sr-print-lesson"
        aria-hidden="true"
        data-testid="lesson-print"
      >
        <p className="sr-print-trail">{card.trail.join(' / ')}</p>
        <h1 className="sr-print-title">
          {card.number !== null && <span className="sr-num">{card.number} </span>}
          {card.title}
        </h1>
        {prose.length > 0 && (
          <section className="sr-print-section" data-print-section="read">
            <h2 className="sr-print-section-title">{t(locale, 'card.read')}</h2>
            <Prose blocks={prose} />
          </section>
        )}
        {exercises.length > 0 && (
          <section className="sr-print-section" data-print-section="exercises">
            <h2 className="sr-print-section-title">{t(locale, 'card.writing')}</h2>
            <Exercises
              items={exercises}
              locale={locale}
              anchors={false}
            />
          </section>
        )}
      </article>
    </main>
  )
}
