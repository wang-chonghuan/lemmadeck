import { useEffect, useRef, useState } from 'react'
import { Check, Circle, CircleDot, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { submitTextbookChoice, type ChoiceDeck, type ChoiceQuestion, type ChoiceResult } from '~/lib/textbook-choice'
import { t, type Locale } from '~/lib/i18n'

type Attempt = { optionId: string; result: ChoiceResult }
type Progress = { attempts: Record<string, Attempt> }

export function TextbookChoices({ deck, lessonId, locale }: {
  deck: ChoiceDeck
  lessonId: string
  locale: Locale
}) {
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({})
  const [loaded, setLoaded] = useState(false)
  const [pass, setPass] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const storage = `sr_choices:${lessonId}:${deck.revision}`

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storage) ?? 'null') as Progress | null
      if (saved?.attempts) {
        const restored: Record<string, Attempt> = {}
        for (const [id, value] of Object.entries(saved.attempts ?? {})) {
          const item = deck.questions.find((candidate) => candidate.id === id)
          if (item?.options.some((option) => option.id === value?.optionId) &&
            item.options.some((option) => option.id === value.result?.correctOptionId) &&
            typeof value.result?.isCorrect === 'boolean' &&
            typeof value.result.explanationHtml === 'string') restored[id] = value
        }
        setAttempts(restored)
      }
    } catch { /* Storage is optional; an unreadable record starts a new pass. */ }
    setLoaded(true)
  }, [storage, deck.questions])

  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem(storage, JSON.stringify({ attempts })) } catch { /* Private storage may be disabled. */ }
  }, [storage, attempts, loaded])

  const answered = Object.keys(attempts).length
  const correct = Object.values(attempts).filter((item) => item.result.isCorrect).length
  return (
    <section className="mt-5 min-w-0" aria-label={t(locale, 'card.exercises')} data-testid="textbook-choices">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span>{t(locale, 'choice.score', { answered, correct })}</span>
        {answered === deck.questions.length && (
          <button className="sr-icontool" type="button" title={t(locale, 'choice.restart')}
            aria-label={t(locale, 'choice.restart')} onClick={() => {
              setAttempts({})
              setPass((previous) => previous + 1)
              window.requestAnimationFrame(() => {
                const first = listRef.current?.querySelector<HTMLElement>('[role="radio"]')
                first?.scrollIntoView({ block: 'center' })
                first?.focus({ preventScroll: true })
              })
            }}>
            <RotateCcw size={18} />
          </button>
        )}
      </div>
      <div ref={listRef}>
        {deck.questions.map((question, index) => (
          <ChoiceItem key={`${question.id}:${pass}`} question={question} number={index + 1}
            lessonId={lessonId} revision={deck.revision} locale={locale} loaded={loaded}
            attempt={attempts[question.id]}
            onAnswered={(attempt) => setAttempts((previous) => ({ ...previous, [question.id]: attempt }))} />
        ))}
      </div>
    </section>
  )
}

function ChoiceItem({ question, number, lessonId, revision, locale, loaded, attempt, onAnswered }: {
  question: ChoiceQuestion
  number: number
  lessonId: string
  revision: string
  locale: Locale
  loaded: boolean
  attempt?: Attempt
  onAnswered: (attempt: Attempt) => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [focused, setFocused] = useState(question.options[0].id)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const alive = useRef(true)
  const inFlight = useRef(false)
  const misconceptionRef = useRef<HTMLParagraphElement>(null)
  const picked = attempt?.optionId ?? chosen
  const locked = !loaded || pending || Boolean(attempt)

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

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

  async function submit(optionId: string) {
    if (!loaded || inFlight.current || attempt) return
    inFlight.current = true
    setChosen(optionId)
    setPending(true)
    setError('')
    try {
      const result = await submitTextbookChoice({ data: {
        lessonId, revision, questionId: question.id, optionId,
      } })
      if (!alive.current) return
      if ('error' in result) setError(result.error)
      else onAnswered({ optionId, result })
    } catch {
      if (alive.current) setError(t(locale, 'choice.failed'))
    } finally {
      inFlight.current = false
      if (alive.current) setPending(false)
    }
  }

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
              onClick={() => void submit(option.id)}>
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
