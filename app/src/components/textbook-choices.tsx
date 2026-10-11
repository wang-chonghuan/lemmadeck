import { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Circle, CircleDot, LoaderCircle, RotateCcw, X } from 'lucide-react'
import {
  getTextbookChoiceProgress, restartTextbookChoices, submitTextbookChoice,
  type ChoiceAttempt, type ChoiceDeck, type ChoiceProgress, type ChoiceQuestion,
} from '~/lib/textbook-choice'
import { t, type Locale } from '~/lib/i18n'

const PAGE_SIZE = 50
type Submission = { optionId: string; pending: boolean; error: string }

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

  async function submit(questionId: string, optionId: string) {
    if (!progress || busy || inFlight.current.has(questionId) || attempts[questionId]) return
    inFlight.current.add(questionId)
    setSubmissions((previous) => ({ ...previous, [questionId]: { optionId, pending: true, error: '' } }))
    try {
      const result = await submitTextbookChoice({ data: {
        lessonId, revision: deck.revision, questionId, optionId,
        roundId: progress.roundId, userId: progress.userId,
      } })
      if (!alive.current) return
      if ('error' in result) {
        setSubmissions((previous) => ({ ...previous, [questionId]: { optionId, pending: false, error: result.error } }))
      } else {
        setProgress((previous) => previous ? {
          ...previous, attempts: { ...previous.attempts, [questionId]: result },
        } : previous)
        setSubmissions((previous) => ({ ...previous, [questionId]: { optionId: result.optionId, pending: false, error: '' } }))
      }
    } catch {
      if (alive.current) setSubmissions((previous) => ({
        ...previous, [questionId]: { optionId, pending: false, error: t(locale, 'choice.failed') },
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
            onSubmit={(optionId) => void submit(question.id, optionId)} />
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
  onSubmit: (optionId: string) => void
}) {
  const [focused, setFocused] = useState(question.options[0].id)
  const misconceptionRef = useRef<HTMLParagraphElement>(null)
  const pending = submission?.pending ?? false
  const error = submission?.error
  const picked = attempt?.optionId ?? submission?.optionId
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
      <p className="sr-ex-n mb-2">{number}.</p>
      <h2 className="sr-quiz-prompt"
        dangerouslySetInnerHTML={{ __html: question.html }} />
      {question.figures.map((figure) => (
        <figure key={figure.id} className="sr-ex-fig" data-figure-layout={figure.layout ?? 'inline'}>
          <div className="sr-figure-media">
            {figure.svg && <div className="sr-figure-vector" dangerouslySetInnerHTML={{ __html: figure.svg }} />}
            {figure.image && <img src={figure.image} alt={figure.label ?? ''} />}
          </div>
        </figure>
      ))}
      <div role="radiogroup" aria-label={t(locale, 'choice.options')} aria-busy={pending} className="sr-quiz-options">
        {question.options.map((option, optionIndex) => {
          const right = attempt?.result.correctOptionId === option.id
          const wrong = Boolean(attempt && picked === option.id && !right)
          return (
            <button type="button" role="radio" aria-checked={picked === option.id}
              key={option.id} data-option-id={option.id}
              disabled={locked}
              tabIndex={focused === option.id ? 0 : -1}
              onFocus={() => setFocused(option.id)}
              onKeyDown={(event) => {
                if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
                event.preventDefault()
                if (locked) return
                const next = (optionIndex + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) +
                  question.options.length) % question.options.length
                setFocused(question.options[next].id)
                const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                buttons?.[next]?.focus()
              }}
              className={`sr-quiz-opt${right ? ' correct' : wrong ? ' wrong' : picked === option.id ? ' picking' : ''}`}
              onClick={() => onSubmit(option.id)}>
              <span className="shrink-0">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="sr-quiz-opt-text min-w-0">
                <span dangerouslySetInnerHTML={{ __html: option.html }} />
                {option.svg && <span className="sr-figure-media pointer-events-none [&_*]:pointer-events-none mt-2 block w-full max-w-[400px]"
                  data-testid="choice-graph" dangerouslySetInnerHTML={{ __html: option.svg }} />}
              </span>
              {pending && picked === option.id ? <LoaderCircle size={18} className="shrink-0 animate-spin motion-reduce:animate-none" /> :
                right ? <Check size={18} className="shrink-0" /> : wrong ? <X size={18} className="shrink-0" /> :
                picked === option.id ? <CircleDot size={18} className="shrink-0" /> : <Circle size={18} className="shrink-0" />}
            </button>
          )
        })}
      </div>
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
