import { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Circle, CircleDot, LoaderCircle, RotateCcw, Square, SquareCheck, X } from 'lucide-react'
import {
  getTextbookChoiceProgress, restartTextbookChoices, submitTextbookChoice,
  type ChoiceAttempt, type ChoiceDeck, type ChoiceProgress, type ChoiceQuestion,
} from '~/lib/textbook-choice'
import { t, type Locale } from '~/lib/i18n'

const PAGE_SIZE = 50
type Submission = { optionIds: string[]; pending: boolean; error: string }

export function TextbookChoices({ deck, lessonId, locale }: {
  deck: ChoiceDeck
  lessonId: string
  locale: Locale
}) {
  const [progress, setProgress] = useState<ChoiceProgress | null>(null)
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({})
  const [page, setPage] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const alive = useRef(true)
  const inFlight = useRef(new Set<string>())

  async function restore() {
    setError('')
    try {
      const restored = await getTextbookChoiceProgress({ data: { lessonId, revision: deck.revision } })
      if (!alive.current) return
      if ('error' in restored) setError(restored.error)
      else {
        setProgress(restored)
        const firstUnanswered = deck.questions.findIndex((question) => !restored.attempts[question.id])
        setPage(firstUnanswered < 0 ? 0 : Math.floor(firstUnanswered / PAGE_SIZE))
      }
    } catch {
      if (alive.current) setError(t(locale, 'choice.failed'))
    }
  }

  useEffect(() => {
    alive.current = true
    void restore()
    return () => { alive.current = false }
  }, [lessonId, deck.revision])

  const attempts = progress?.attempts ?? {}
  const answered = Object.keys(attempts).length
  const correct = Object.values(attempts).filter((item) => item.result.isCorrect).length
  const pageCount = Math.ceil(deck.questions.length / PAGE_SIZE)

  function changePage(next: number) {
    setPage(next)
    listRef.current?.scrollIntoView({ block: 'start' })
  }

  async function submit(questionId: string, optionIds: string[]) {
    if (!progress || busy || inFlight.current.has(questionId) || attempts[questionId]) return
    inFlight.current.add(questionId)
    setSubmissions((previous) => ({ ...previous, [questionId]: { optionIds, pending: true, error: '' } }))
    try {
      const result = await submitTextbookChoice({ data: {
        lessonId, revision: deck.revision, questionId, optionIds,
        roundId: progress.roundId, userId: progress.userId,
      } })
      if (!alive.current) return
      if ('error' in result) {
        setSubmissions((previous) => ({ ...previous, [questionId]: { optionIds, pending: false, error: result.error } }))
      } else {
        setProgress((previous) => previous ? {
          ...previous, attempts: { ...previous.attempts, [questionId]: result },
        } : previous)
        setSubmissions((previous) => ({ ...previous, [questionId]: { optionIds: result.optionIds, pending: false, error: '' } }))
      }
    } catch {
      if (alive.current) setSubmissions((previous) => ({
        ...previous, [questionId]: { optionIds, pending: false, error: t(locale, 'choice.failed') },
      }))
    } finally {
      inFlight.current.delete(questionId)
    }
  }

  async function restart() {
    if (!progress || busy || inFlight.current.size) return
    setBusy(true)
    setError('')
    try {
      const result = await restartTextbookChoices({ data: {
        lessonId, revision: deck.revision, roundId: progress.roundId, userId: progress.userId,
      } })
      if (!alive.current) return
      if ('error' in result) setError(result.error)
      else {
        setProgress(result)
        setSubmissions({})
        setPage(0)
        listRef.current?.scrollIntoView({ block: 'start' })
      }
    } catch {
      if (alive.current) setError(t(locale, 'choice.failed'))
    } finally {
      if (alive.current) setBusy(false)
    }
  }

  const pagination = pageCount > 1 && (
    <nav aria-label={t(locale, 'choice.pagination')} className="my-3 flex items-center justify-center gap-3">
      <button className="sr-icontool" type="button" disabled={page === 0}
        title={t(locale, 'choice.previousPage')} aria-label={t(locale, 'choice.previousPage')}
        onClick={() => changePage(page - 1)}><ChevronLeft size={18} /></button>
      <span className="text-sm" aria-live="polite">{t(locale, 'choice.page', { page: page + 1, total: pageCount })}</span>
      <button className="sr-icontool" type="button" disabled={page === pageCount - 1}
        title={t(locale, 'choice.nextPage')} aria-label={t(locale, 'choice.nextPage')}
        onClick={() => changePage(page + 1)}><ChevronRight size={18} /></button>
    </nav>
  )

  return (
    <section className="mt-5 min-w-0" aria-label={t(locale, 'card.exercises')} data-testid="textbook-choices">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>{t(locale, 'choice.score', { answered, correct })}</span>
        {answered === deck.questions.length && (
          <button className="sr-icontool" type="button" title={t(locale, 'choice.restart')}
            disabled={busy} aria-label={t(locale, 'choice.restart')} onClick={() => void restart()}>
            {busy ? <LoaderCircle size={18} className="animate-spin" /> : <RotateCcw size={18} />}
          </button>
        )}
      </div>
      {!progress && !error && <p role="status">{t(locale, 'quiz.loading')}</p>}
      {error && <div className="mb-3 flex items-center gap-2">
        <p role="alert" className="sr-quiz-err">{error}</p>
        <button className="sr-icontool" type="button" title={t(locale, 'choice.retry')}
          aria-label={t(locale, 'choice.retry')} onClick={() => void (progress ? restart() : restore())}>
          <RotateCcw size={18} />
        </button>
      </div>}
      {pagination}
      <div ref={listRef}>
        {deck.questions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((question, index) => (
          <ChoiceItem key={`${question.id}:${progress?.roundId}`} question={question} number={page * PAGE_SIZE + index + 1}
            locale={locale} loaded={Boolean(progress) && !busy}
            attempt={attempts[question.id]}
            submission={submissions[question.id]}
            onSubmit={(optionIds) => void submit(question.id, optionIds)} />
        ))}
      </div>
      {pagination}
    </section>
  )
}

function ChoiceItem({ question, number, locale, loaded, attempt, submission, onSubmit }: {
  question: ChoiceQuestion
  number: number
  locale: Locale
  loaded: boolean
  attempt?: ChoiceAttempt
  submission?: Submission
  onSubmit: (optionIds: string[]) => void
}) {
  const [focused, setFocused] = useState(question.options[0].id)
  const [selected, setSelected] = useState<string[]>([])
  const multiple = question.mode === 'multiple'
  const misconceptionRef = useRef<HTMLParagraphElement>(null)
  const pending = submission?.pending ?? false
  const error = submission?.error
  const picked = attempt?.optionIds ?? (multiple ? selected : submission?.optionIds ?? [])
  const locked = !loaded || pending || Boolean(attempt)

  useEffect(() => {
    const element = misconceptionRef.current
    if (!element) return
    let timer: ReturnType<typeof setTimeout>
    let tries = 0
    const typeset = () => {
      const render = (window as unknown as { renderMathInElement?: Function }).renderMathInElement
      if (typeof render === 'function') {
        render(element, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
          throwOnError: false,
        })
      } else if (tries++ < 100) timer = setTimeout(typeset, 100)
    }
    typeset()
    return () => clearTimeout(timer)
  }, [attempt?.result.misconception])

  return (
    <section className="min-w-0 border-t border-[var(--sr-line-soft)] py-4"
      aria-label={t(locale, 'choice.question', { number })} data-testid="choice-question">
      <p className="sr-ex-n mb-2">{number}. {t(locale, multiple ? 'choice.multiple' : 'choice.single')}</p>
      <h2 className="sr-quiz-prompt"
        dangerouslySetInnerHTML={{ __html: question.html }} />
      {question.figures.map((figure) => (
        <figure key={figure.id} className="sr-ex-fig" data-figure-layout={figure.layout ?? 'inline'}>
          <div className="sr-figure-media"
            style={figure.layout === 'scroll' && figure.displayWidthPx ? { width: figure.displayWidthPx } : undefined}>
            {figure.svg && <div className="sr-figure-vector" dangerouslySetInnerHTML={{ __html: figure.svg }} />}
            {figure.image && <img src={figure.image} alt={figure.label ?? ''} />}
          </div>
        </figure>
      ))}
      <div role={multiple ? 'group' : 'radiogroup'} aria-label={t(locale, 'choice.options')} aria-busy={pending} className="sr-quiz-options">
        {question.options.map((option, optionIndex) => {
          const right = attempt?.result.correctOptionIds.includes(option.id)
          const chosen = picked.includes(option.id)
          const wrong = Boolean(attempt && chosen && !right)
          return (
            <button type="button" role={multiple ? 'checkbox' : 'radio'} aria-checked={chosen}
              key={option.id} data-option-id={option.id}
              disabled={locked}
              tabIndex={multiple || focused === option.id ? 0 : -1}
              onFocus={() => setFocused(option.id)}
              onKeyDown={(event) => {
                if (multiple) return
                if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
                event.preventDefault()
                if (locked) return
                const next = (optionIndex + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) +
                  question.options.length) % question.options.length
                setFocused(question.options[next].id)
                const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                buttons?.[next]?.focus()
              }}
              className={`sr-quiz-opt${right ? ' correct' : wrong ? ' wrong' : chosen ? ' picking' : ''}`}
              onClick={() => multiple
                ? setSelected((previous) => previous.includes(option.id)
                  ? previous.filter((id) => id !== option.id) : [...previous, option.id])
                : onSubmit([option.id])}>
              <span className="shrink-0">{String.fromCharCode(65 + optionIndex)}</span>
              <span className={`sr-quiz-opt-text min-w-0${option.html.includes('<table>') ? '' : ' pointer-events-none [&_*]:pointer-events-none'}`}>
                <span className="block max-w-full overflow-x-auto [&_*]:pointer-events-none [&_table]:w-max [&_th]:border [&_td]:border [&_th]:border-[var(--sr-line)] [&_td]:border-[var(--sr-line)] [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1"
                  dangerouslySetInnerHTML={{ __html: option.html }} />
                {option.svg && <span className="sr-figure-media pointer-events-none [&_*]:pointer-events-none mt-2 block w-full max-w-[400px]"
                  data-testid="choice-graph" dangerouslySetInnerHTML={{ __html: option.svg }} />}
              </span>
              {pending && chosen ? <LoaderCircle size={18} className="shrink-0 animate-spin motion-reduce:animate-none" /> :
                right ? <Check size={18} className="shrink-0" /> : wrong ? <X size={18} className="shrink-0" /> :
                multiple ? (chosen ? <SquareCheck size={18} className="shrink-0" /> : <Square size={18} className="shrink-0" />) :
                chosen ? <CircleDot size={18} className="shrink-0" /> : <Circle size={18} className="shrink-0" />}
            </button>
          )
        })}
      </div>
      {multiple && !attempt && (
        <button type="button" className="sr-btn primary mt-3 inline-flex items-center gap-2 disabled:opacity-50" disabled={locked || !selected.length}
          onClick={() => onSubmit(selected)}>
          <Check size={16} />{t(locale, 'choice.submit')}
        </button>
      )}
      {error && <p role="alert" className="sr-quiz-err">{error}</p>}
      {pending && <p role="status" className="mt-3 text-sm">{t(locale, 'choice.submitting')}</p>}
      {attempt && (
        <div className="sr-quiz-feedback" role="status">
          <p className={`sr-quiz-verdict ${attempt.result.isCorrect ? 'ok' : 'bad'}`}>
            {attempt.result.isCorrect ? <Check size={17} /> : <X size={17} />}
            {t(locale, attempt.result.isCorrect ? 'choice.correct' : 'choice.incorrect')}
          </p>
          {attempt.result.misconception && <p ref={misconceptionRef} className="mb-2 text-sm"
            data-testid="choice-misconception">{attempt.result.misconception}</p>}
          <div className="sr-quiz-answer" dangerouslySetInnerHTML={{ __html: attempt.result.explanationHtml }} />
        </div>
      )}
    </section>
  )
}
