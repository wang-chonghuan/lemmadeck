import { createServerFn } from '@tanstack/react-start'
import { sql } from '~/lib/db'
import { currentUserId } from '~/lib/session.server'
import { currentLocale } from '~/lib/locale.server'
import type { CardFigure } from '~/lib/lessons'

export type ChoiceQuestion = {
  id: string
  html: string
  figures: CardFigure[]
  options: { id: string; html: string; svg?: string }[]
}
export type ChoiceDeck = { revision: string; questions: ChoiceQuestion[] }
type StoredQuestion = ChoiceQuestion & {
  source: { exercise: string; target: string }
  group: string | null
  correctOptionId: string
  explanationHtml: string
  options: (ChoiceQuestion['options'][number] & { misconception?: string })[]
}
type StoredDeck = { revision: string; questions: StoredQuestion[] }
export type ChoiceResult = {
  isCorrect: boolean
  correctOptionId: string
  explanationHtml: string
  misconception: string | null
}

export function judgeChoice(deck: StoredDeck | undefined, data: {
  revision: string; questionId: string; optionId: string
}): ChoiceResult | { error: string } {
  if (!deck || deck.revision !== data.revision) return { error: '题目已更新，请刷新后重试' }
  const question = deck.questions.find((item) => item.id === data.questionId)
  const chosen = question?.options.find((option) => option.id === data.optionId)
  if (!question || !chosen) return { error: '题目或选项不存在' }
  const isCorrect = chosen.id === question.correctOptionId
  return { isCorrect, correctOptionId: question.correctOptionId,
    explanationHtml: question.explanationHtml,
    misconception: isCorrect ? null : chosen.misconception ?? null }
}

export function projectChoiceDeck(deck: StoredDeck | undefined): ChoiceDeck | null {
  if (!deck?.revision || !Array.isArray(deck.questions) || !deck.questions.length) return null
  return {
    revision: deck.revision,
    questions: deck.questions.map((question) => ({
      id: question.id,
      html: question.html,
      figures: (question.figures ?? []).map((figure) => ({
        id: figure.id, label: figure.label ?? null,
        svg: figure.svg ?? null, image: figure.image ?? null,
        mode: figure.mode, layout: figure.layout,
      })),
      options: question.options.map((option) => ({
        id: option.id, html: option.html, ...(option.svg ? { svg: option.svg } : {}),
      })),
    })),
  }
}

export const getTextbookChoices = createServerFn({ method: 'GET' })
  .validator((lessonId: string) => lessonId)
  .handler(async ({ data }): Promise<ChoiceDeck | null> => {
    const rows = await sql()`select exercises from sr_lessons where id = ${data}`
    return projectChoiceDeck((rows[0]?.exercises as { choices?: StoredDeck } | undefined)?.choices)
  })

export const submitTextbookChoice = createServerFn({ method: 'POST' })
  .validator((data: { lessonId: string; revision: string; questionId: string; optionId: string }) => data)
  .handler(async ({ data }): Promise<ChoiceResult | { error: string }> => {
    if ([data.lessonId, data.revision, data.questionId, data.optionId].some(
      (value) => typeof value !== 'string' || !value || value.length > 200,
    )) return { error: '作答数据无效' }
    const rows = await sql()`select exercises from sr_lessons where id = ${data.lessonId}`
    const deck = (rows[0]?.exercises as { choices?: StoredDeck } | undefined)?.choices
    const result = judgeChoice(deck, data)
    if ('error' in result) return result
    const question = deck!.questions.find((item) => item.id === data.questionId)!
    const chosen = question.options.findIndex((option) => option.id === data.optionId)
    const userId = currentUserId()
    if (userId !== null) {
      await sql()`
        insert into sr_content_answer_events
          (user_id, lesson_id, kind, node_id, is_correct, chosen, answer_text, locale)
        values (${userId}, ${data.lessonId}, 'exercise', ${`choice:${deck!.revision}:${question.id}`},
          ${result.isCorrect}, ${chosen}, ${data.optionId}, ${currentLocale()})
      `
    }
    return result
  })
