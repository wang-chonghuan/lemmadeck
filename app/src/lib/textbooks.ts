// The curriculum outline shown in the left catalog (STEMROBIN-113).
//
// The outline is the Soviet ten-year school series. Its transcription is a
// repo-level source of truth, not app data: ssot-resources/soviet10year-textbooks/
// toc/<bookId>/<locale>.json. Each locale is a complete file — zh.json is what
// the book prints (extracted from the scan, the authority), en.json is its
// translation — so adding a language adds a file and changes no structure. See
// that directory's README.
//
// The shelf discovers itself: every toc/<bookId>/<locale>.json on disk is picked
// up, so transcribing a new volume is dropping in a directory. Order comes from
// the books' own `subject` and `grade`, not from a list kept in step by hand.
//
// `contents` is the printed table of contents' first level, and not every entry
// there is a chapter — 难题 sits at the same indent as the five chapters. The
// JSON says which is which (`kind`) and this module maps it; the rail renders
// what it is handed rather than knowing about any particular entry.
//
// Depth is 学科 → 册 → 章 → 课. The branch (代数 / 几何 / …) is folded into the
// book's own title ("Algebra, Grade 6") rather than being a fourth level: a
// 236px rail cannot indent four times and still read.
//
// Availability is DB-driven: an outline lesson becomes a link when sr_lessons
// holds its id, and is plain text otherwise.

import { t, type Locale } from '~/lib/i18n'

type SourceRef = { printedSection: number } | { printedName: string }
type RawTopic = { id: string; printedNumber?: number | null; title: string; page: number }
type RawLesson = {
  id: string
  kind: 'section' | 'exercises'
  number: string | null
  title: string
  page: number
  source: SourceRef
  topics?: RawTopic[]
}
type RawEntry =
  | {
      id: string
      kind: 'chapter'
      /** Null where the book gives a container no chapter number of its own —
       *  Приложение and Самостоятельные и контрольные работы sit level with the
       *  numbered chapters but carry no number, so the rail shows the bare title
       *  rather than inventing an ordinal for them. */
      number: number | null
      title: string
      page: number
      lessons: RawLesson[]
    }
  | (RawLesson & { kind: 'exercises' })
type RawBook = {
  book: string
  locale: Locale
  subject: string
  grade: number
  title: string
  contents: RawEntry[]
}

export type Discipline = 'math' | 'physics'

// Which discipline each book's subject belongs under, and the order the branches
// run in. The Kolmogorov reform merged the lower grades into plain "mathematics"
// and split algebra/geometry from grade 6 — so these are branches of one
// discipline, not disciplines.
const BRANCH: Record<string, { discipline: Discipline; rank: number }> = {
  early: { discipline: 'math', rank: 0 },
  algebra: { discipline: 'math', rank: 1 },
  geometry: { discipline: 'math', rank: 2 },
  analysis: { discipline: 'math', rank: 3 },
  // Probability is the one branch the Soviet series never carried, so it comes
  // from a different pair of books (Тюрин et al.) and sits last — it depends on
  // the combinatorics and limits the branches above it build.
  probability: { discipline: 'math', rank: 4 },
  physics: { discipline: 'physics', rank: 0 },
}

const FILES = import.meta.glob<RawBook>(
  '../../../ssot-resources/soviet10year-textbooks/toc/*/*.json',
  {
    eager: true,
    import: 'default',
  },
)

const SHELF: Partial<Record<Locale, RawBook>>[] = (() => {
  const byBook = new Map<string, Partial<Record<Locale, RawBook>>>()
  for (const [path, book] of Object.entries(FILES)) {
    const m = /\/toc\/([^/]+)\/([^/]+)\.json$/.exec(path)
    if (!m) continue
    const entry = byBook.get(m[1]) ?? {}
    entry[m[2] as Locale] = book
    byBook.set(m[1], entry)
  }
  const rank = (b: Partial<Record<Locale, RawBook>>) => {
    const any = b.zh ?? b.en
    return any ? [BRANCH[any.subject]?.rank ?? 9, any.grade] : [9, 99]
  }
  return [...byBook.values()].sort((a, b) => {
    const [ra, ga] = rank(a)
    const [rb, gb] = rank(b)
    return ra - rb || ga - gb
  })
})()

/** `topics` are the book's own teaching items inside a section. Numbered topics
 *  are the section's card boundaries; all-unnumbered topics are supplemental
 *  cards following a main section card. */
export type OutlineTopic = { id: string; number: number | null; title: string; ready: boolean }
export type OutlineLesson = {
  id: string
  number: string
  title: string
  /** Whether the section itself is a card. Sections with numbered topics are
   * structural; sections with only unnumbered topics keep their main lesson. */
  hasOwnCard: boolean
  ready: boolean
  /** Destination for the section title. Structural sections use their first
   * available topic; publishable parent sections use their own id. */
  cardId: string
  topics: OutlineTopic[]
}
/** A book's contents, mirroring the printed first level: a chapter with sections
 *  beneath it, or an entry that is itself a lesson. */
export type OutlineNode =
  | { kind: 'chapter'; id: string; label: string; lessons: OutlineLesson[] }
  | { kind: 'lesson'; lesson: OutlineLesson }
export type OutlineBook = { book: string; title: string; contents: OutlineNode[] }
export type OutlineDiscipline = { discipline: Discipline; label: string; books: OutlineBook[] }

/** How a chapter reads in the rail and in a card's trail. An unnumbered container
 *  is shown by name alone — "第 null 章" would be worse than no ordinal. */
function chapterLabel(locale: Locale, n: number | null, title: string): string {
  return n === null ? title : t(locale, 'cat.chapter', { n, title })
}

function rawLessonHasOwnCard(lesson: RawLesson): boolean {
  const topics = lesson.topics ?? []
  return topics.length === 0 || !topics.some((topic) => topic.printedNumber != null)
}

/** The catalog tree, localized, with availability resolved against the DB ids. */
export function getTextbookOutline(
  lessonIds: readonly string[],
  locale: Locale,
): OutlineDiscipline[] {
  const available = new Set(lessonIds)
  const byDiscipline = new Map<Discipline, OutlineBook[]>()

  for (const localized of SHELF) {
    const book = localized[locale] ?? localized.zh ?? localized.en
    if (!book) continue
    // Content is stored per card. A structural section is ready when one of its
    // numbered topic cards is available; a publishable parent is ready only when
    // its own id exists, independently of its supplemental topic cards.
    const lesson = (l: RawLesson): OutlineLesson => {
      const topics = (l.topics ?? []).map((tp) => ({
        id: tp.id,
        number: tp.printedNumber ?? null,
        title: tp.title,
        ready: available.has(tp.id),
      }))
      const hasOwnCard = rawLessonHasOwnCard(l)
      const firstReady = topics.find((tp) => tp.ready)
      return {
        id: l.id,
        number: l.number ?? '',
        title: l.title,
        hasOwnCard,
        ready: hasOwnCard ? available.has(l.id) : Boolean(firstReady),
        cardId: hasOwnCard ? l.id : firstReady?.id ?? topics[0]?.id ?? l.id,
        topics,
      }
    }
    const contents: OutlineNode[] = book.contents.map((e) =>
      e.kind === 'chapter'
        ? {
            kind: 'chapter' as const,
            id: e.id,
            label: chapterLabel(locale, e.number, e.title),
            lessons: e.lessons.map(lesson),
          }
        : { kind: 'lesson' as const, lesson: lesson(e) },
    )
    const discipline = BRANCH[book.subject]?.discipline ?? 'math'
    const shelf = byDiscipline.get(discipline) ?? []
    shelf.push({ book: book.book, title: book.title, contents })
    byDiscipline.set(discipline, shelf)
  }

  const order: Discipline[] = ['math', 'physics']
  return order.flatMap((d) => {
    const books = byDiscipline.get(d)
    return books?.length ? [{ discipline: d, label: t(locale, `cat.disc.${d}`), books }] : []
  })
}

/** One card, resolved for its own page: where it sits, and its neighbours in
 *  reading order across the whole volume — a card's next is the first card of
 *  the following section once its own runs out. */
export type Card = {
  id: string
  /** The book's own number, where it has one. A section's exercise set and the
   *  volume's closing set are unnumbered. */
  number: number | null
  title: string
  /** The trail down to the card: volume, then whatever levels apply. */
  trail: string[]
  prev: { id: string; title: string } | null
  next: { id: string; title: string } | null
}

type FlatCard = { id: string; number: number | null; title: string; trail: string[] }

/** Every card in a volume, in reading order.
 *
 *  A card is the atom of content, so anything the book gives content to is one:
 *  a section's numbered items are its cards, and an entry the book leaves
 *  unnumbered — a chapter's exercise set, the volume's closing 难题 — is itself
 *  a single card rather than an empty container. That is what keeps every row
 *  of the outline reachable. */
function cardsOf(book: RawBook, locale: Locale): FlatCard[] {
  const sectionLabel = (l: RawLesson) => (l.number ? `${l.number} ${l.title}` : l.title)
  const lessonCards = (lesson: RawLesson, trail: string[]): FlatCard[] => {
    const topics = lesson.topics ?? []
    return [
      ...(rawLessonHasOwnCard(lesson)
        ? [{ id: lesson.id, number: null, title: lesson.title, trail }]
        : []),
      ...topics.map((topic) => ({
        id: topic.id,
        number: topic.printedNumber ?? null,
        title: topic.title,
        trail: [...trail, sectionLabel(lesson)],
      })),
    ]
  }
  return book.contents.flatMap((e) => {
    if (e.kind !== 'chapter') {
      return lessonCards(e, [book.title])
    }
    const ch = chapterLabel(locale, e.number, e.title)
    return e.lessons.flatMap((lesson) => lessonCards(lesson, [book.title, ch]))
  })
}

export function findCard(cardId: string, locale: Locale): Card | null {
  for (const localized of SHELF) {
    const book = localized[locale] ?? localized.zh ?? localized.en
    if (!book) continue
    const flat = cardsOf(book, locale)
    const i = flat.findIndex((c) => c.id === cardId)
    if (i < 0) continue
    const ref = (n: number) => (flat[n] ? { id: flat[n].id, title: flat[n].title } : null)
    return { ...flat[i], prev: ref(i - 1), next: ref(i + 1) }
  }
  return null
}

/** The printed volume id for one card. Runtime records store the card id, while
 *  learner-facing history names the source book (for example `5m`). Resolve it
 *  from the same shelf authority as navigation instead of parsing the card id. */
export function findTextbookBook(cardId: string): string | null {
  for (const localized of SHELF) {
    const book = localized.zh ?? localized.en
    if (book && cardsOf(book, book.locale).some((card) => card.id === cardId)) {
      return book.book
    }
  }
  return null
}

/** Every card id in the whole shelf, in reading order. The deck's denominator —
 *  and, once a card's content is written, the id its row in sr_lessons takes, so
 *  a card's answer events need no table of their own. */
export function allCardIds(): string[] {
  const seen = new Set<string>()
  for (const localized of SHELF) {
    const book = localized.zh ?? localized.en
    if (!book) continue
    for (const c of cardsOf(book, 'zh')) seen.add(c.id)
  }
  return [...seen]
}

/** Every lesson in a book, chapters and top-level entries alike. */
export function bookLessons(book: OutlineBook): OutlineLesson[] {
  return book.contents.flatMap((n) => (n.kind === 'chapter' ? n.lessons : [n.lesson]))
}

export function outlineLessonCards(
  lesson: OutlineLesson,
): { id: string; title: string; ready: boolean }[] {
  return [
    ...(lesson.hasOwnCard
      ? [{ id: lesson.id, title: lesson.title, ready: lesson.ready }]
      : []),
    ...lesson.topics,
  ]
}

export function lessonHasReadyCard(lesson: OutlineLesson): boolean {
  return outlineLessonCards(lesson).some((card) => card.ready)
}

/** Cards that have content, in book order — the overview's grid and the
 *  prev/next chain. Cards, not sections: a section is a container, and it is the
 *  card that carries a page. */
export function getAvailableTextbookLessons(
  lessonIds: readonly string[],
  locale: Locale,
): { id: string; title: string; subject: string }[] {
  return getTextbookOutline(lessonIds, locale).flatMap((d) =>
    d.books.flatMap((b) =>
      bookLessons(b).flatMap((l) => [
        ...(l.hasOwnCard && l.ready
          ? [{
              id: l.id,
              title: l.number ? `${l.number} ${l.title}` : l.title,
              subject: b.title,
            }]
          : []),
        ...l.topics
          .filter((topic) => topic.ready)
          .map((topic) => ({
            id: topic.id,
            title: topic.number === null ? topic.title : `${topic.number}. ${topic.title}`,
            subject: b.title,
          })),
      ]),
    ),
  )
}

/** How a lesson reads in a header or a prev/next chip: the book's own number and
 *  title, or the bare id when the outline does not carry it. */
export function getTextbookLessonLabel(id: string, locale: Locale): string {
  for (const d of getTextbookOutline([], locale))
    for (const b of d.books)
      for (const l of bookLessons(b)) {
        if (l.id === id) return l.number ? `${l.number} ${l.title}` : l.title
        const tp = l.topics.find((x) => x.id === id)
        if (tp) return tp.number === null ? tp.title : `${tp.number}. ${tp.title}`
      }
  return id
}

/** Prev/next in reading order, among the lessons that actually have content —
 *  skipping over what is still only an outline entry. */
export function getTextbookLessonNav(
  id: string,
  lessonIds: readonly string[],
  locale: Locale,
): { prev?: { id: string; title: string }; next?: { id: string; title: string } } {
  const all = getAvailableTextbookLessons(lessonIds, locale)
  const i = all.findIndex((l) => l.id === id)
  return i === -1 ? {} : { prev: all[i - 1], next: all[i + 1] }
}
