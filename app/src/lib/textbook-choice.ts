import { createServerFn } from '@tanstack/react-start'
import { sql } from '~/lib/db'
import { currentUserId } from '~/lib/session.server'
import { currentLocale } from '~/lib/locale.server'
import type { CardFigure } from '~/lib/lessons'
import type { TransactionSql } from 'postgres'

export type ChoiceQuestion = {
  id: string
  mode: 'single' | 'multiple'
  html: string
  figures: (CardFigure & { displayWidthPx?: number })[]
  options: { id: string; html: string; svg?: string }[]
}
export type ChoiceDeck = { revision: string; questions: ChoiceQuestion[] }
export type StoredQuestion = ChoiceQuestion & {
  sourceNumbers: string[]
  correctOptionIds: string[]
  explanationHtml: string
  options: (ChoiceQuestion['options'][number] & { misconception?: string })[]
}
export type StoredDeck = { revision: string; questions: StoredQuestion[] }
export type ChoiceResult = {
  isCorrect: boolean
  correctOptionIds: string[]
  explanationHtml: string
  misconception: string | null
}
export type ChoiceAttempt = { optionIds: string[]; result: ChoiceResult }
export type ChoiceProgress = {
  userId: number | null
  roundId: string
  attempts: Record<string, ChoiceAttempt>
}
type ChoiceSubmission = {
  lessonId: string
  revision: string
  questionId: string
  optionIds: string[]
  roundId: string
  userId: number | null
}

const roundNode = (revision: string) => `choice:${revision}`
const questionNode = (revision: string, questionId: string) => `choice:${revision}:${questionId}`

async function currentRound(database: TransactionSql | ReturnType<typeof sql>, userId: number, lessonId: string, revision: string) {
  const [row] = await database`
    select id::text as id from sr_content_answer_events
    where user_id = ${userId} and lesson_id = ${lessonId}
      and kind = 'exercise' and node_id = ${roundNode(revision)}
    order by id desc limit 1
  `
  return (row?.id as string | undefined) ?? '0'
}

export async function loadChoiceProgress(database: ReturnType<typeof sql>, userId: number | null, lessonId: string, deck: StoredDeck): Promise<ChoiceProgress> {
  if (userId === null) return { userId, roundId: '0', attempts: {} }
  // One snapshot keeps a concurrent restart from mixing two practice rounds.
  return database.begin('isolation level repeatable read', async (transaction) => {
    const roundId = await currentRound(transaction, userId, lessonId, deck.revision)
    const prefix = `${roundNode(deck.revision)}:`
    const rows = await transaction`
      select distinct on (node_id) node_id, answer_text, is_correct
      from sr_content_answer_events
      where user_id = ${userId} and lesson_id = ${lessonId} and kind = 'exercise'
        and id > ${roundId}::bigint and starts_with(node_id, ${prefix})
      order by node_id, id
    `
    const attempts: Record<string, ChoiceAttempt> = {}
    for (const row of rows) {
      const questionId = row.node_id.slice(prefix.length)
      const optionIds = JSON.parse(row.answer_text) as string[]
      const result = judgeChoice(deck, { revision: deck.revision, questionId, optionIds })
      if (!('error' in result)) {
        attempts[questionId] = { optionIds, result: { ...result, isCorrect: row.is_correct } }
      }
    }
    return { userId, roundId, attempts }
  })
}

export async function saveChoiceAnswer(database: ReturnType<typeof sql>, userId: number | null, locale: string, data: ChoiceSubmission, deck: StoredDeck): Promise<ChoiceAttempt | { error: string }> {
  const result = judgeChoice(deck, data)
  if ('error' in result) return result
  if (userId !== data.userId) return { error: '登录状态已变化，请刷新后重试' }
  const question = deck.questions.find((item) => item.id === data.questionId)!
  const optionIds = question.options.filter((option) => data.optionIds.includes(option.id)).map((option) => option.id)
  if (userId === null) return { optionIds, result }
  return database.begin(async (transaction) => {
    // Serialize only this learner/lesson. The first pick in a round is immutable.
    await transaction`select pg_advisory_xact_lock(hashtextextended(${`choice:${userId}:${data.lessonId}`}, 0))`
    if (await currentRound(transaction, userId, data.lessonId, deck.revision) !== data.roundId) {
      return { error: '本轮练习已更新，请刷新后重试' }
    }
    const node = questionNode(deck.revision, data.questionId)
    const [existing] = await transaction`
      select answer_text, is_correct from sr_content_answer_events
      where user_id = ${userId} and lesson_id = ${data.lessonId} and kind = 'exercise'
        and node_id = ${node} and id > ${data.roundId}::bigint
      order by id limit 1
    `
    if (existing) {
      const priorIds = JSON.parse(existing.answer_text) as string[]
      const prior = judgeChoice(deck, { ...data, optionIds: priorIds })
      if ('error' in prior) return prior
      return { optionIds: priorIds, result: { ...prior, isCorrect: existing.is_correct } }
    }
    const chosen = question.mode === 'single'
      ? question.options.findIndex((option) => option.id === optionIds[0]) : null
    await transaction`
      insert into sr_content_answer_events
        (user_id, lesson_id, kind, node_id, is_correct, chosen, answer_text, locale)
      values (${userId}, ${data.lessonId}, 'exercise', ${node},
        ${result.isCorrect}, ${chosen}, ${JSON.stringify(optionIds)}, ${locale})
    `
    return { optionIds, result }
  })
}

export function judgeChoice(deck: StoredDeck | undefined, data: {
  revision: string; questionId: string; optionIds: string[]
}): ChoiceResult | { error: string } {
  if (!deck || deck.revision !== data.revision) return { error: '题目已更新，请刷新后重试' }
  const question = deck.questions.find((item) => item.id === data.questionId)
  if (!question || !Array.isArray(data.optionIds) || !data.optionIds.length
    || new Set(data.optionIds).size !== data.optionIds.length
    || data.optionIds.some((id) => !question.options.some((option) => option.id === id))
    || (question.mode === 'single' && data.optionIds.length !== 1)) {
    return { error: '题目或选项不存在' }
  }
  const isCorrect = data.optionIds.length === question.correctOptionIds.length
    && data.optionIds.every((id) => question.correctOptionIds.includes(id))
  const misconceptions = question.options
    .filter((option) => data.optionIds.includes(option.id) && !question.correctOptionIds.includes(option.id))
    .map((option) => option.misconception).filter(Boolean)
  return { isCorrect, correctOptionIds: question.correctOptionIds,
    explanationHtml: question.explanationHtml,
    misconception: isCorrect ? null : misconceptions.join('\n') || null }
}

export function projectChoiceDeck(deck: StoredDeck | undefined): ChoiceDeck | null {
  if (!deck?.revision || !Array.isArray(deck.questions) || !deck.questions.length) return null
  return {
    revision: deck.revision,
    questions: deck.questions.map((question) => ({
      id: question.id,
      mode: question.mode,
      html: question.html,
      figures: (question.figures ?? []).map((figure) => ({
        id: figure.id, label: figure.label ?? null,
        svg: figure.svg ?? null, image: figure.image ?? null,
        mode: figure.mode, layout: figure.layout,
        purpose: figure.purpose, maxWidthPx: figure.maxWidthPx,
        ...(figure.displayWidthPx ? { displayWidthPx: figure.displayWidthPx } : {}),
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
    return projectChoiceDeck((rows[0]?.exercises as { choiceSet?: StoredDeck } | undefined)?.choiceSet)
  })

export const getTextbookChoiceProgress = createServerFn({ method: 'GET' })
  .validator((data: { lessonId: string; revision: string }) => data)
  .handler(async ({ data }): Promise<ChoiceProgress | { error: string }> => {
    const rows = await sql()`select exercises from sr_lessons where id = ${data.lessonId}`
    const deck = (rows[0]?.exercises as { choiceSet?: StoredDeck } | undefined)?.choiceSet
    if (!deck || deck.revision !== data.revision) return { error: '题目已更新，请刷新后重试' }
    return loadChoiceProgress(sql(), currentUserId(), data.lessonId, deck)
  })

export const restartTextbookChoices = createServerFn({ method: 'POST' })
  .validator((data: { lessonId: string; revision: string; roundId: string; userId: number | null }) => data)
  .handler(async ({ data }): Promise<ChoiceProgress | { error: string }> => {
    const userId = currentUserId()
    if (userId !== data.userId) return { error: '登录状态已变化，请刷新后重试' }
    const rows = await sql()`select exercises from sr_lessons where id = ${data.lessonId}`
    const deck = (rows[0]?.exercises as { choiceSet?: StoredDeck } | undefined)?.choiceSet
    if (!deck || deck.revision !== data.revision) return { error: '题目已更新，请刷新后重试' }
    if (userId === null) return { userId, roundId: '0', attempts: {} }
    await sql().begin(async (transaction) => {
      await transaction`select pg_advisory_xact_lock(hashtextextended(${`choice:${userId}:${data.lessonId}`}, 0))`
      const roundId = await currentRound(transaction, userId, data.lessonId, deck.revision)
      if (roundId !== data.roundId) return
      await transaction`
        insert into sr_content_answer_events (user_id, lesson_id, kind, node_id, locale)
        values (${userId}, ${data.lessonId}, 'exercise', ${roundNode(deck.revision)}, ${currentLocale()})
      `
    })
    return loadChoiceProgress(sql(), userId, data.lessonId, deck)
  })

export const submitTextbookChoice = createServerFn({ method: 'POST' })
  .validator((data: ChoiceSubmission) => data)
  .handler(async ({ data }): Promise<ChoiceAttempt | { error: string }> => {
    if ([data.lessonId, data.revision, data.questionId].some(
      (value) => typeof value !== 'string' || !value || value.length > 200,
    )) return { error: '作答数据无效' }
    if (!Array.isArray(data.optionIds) || !data.optionIds.length || data.optionIds.some(
      (value) => typeof value !== 'string' || !value || value.length > 200,
    )) return { error: '作答数据无效' }
    if (typeof data.roundId !== 'string' || !/^\d{1,19}$/.test(data.roundId)) return { error: '作答数据无效' }
    const rows = await sql()`select exercises from sr_lessons where id = ${data.lessonId}`
    const deck = (rows[0]?.exercises as { choiceSet?: StoredDeck } | undefined)?.choiceSet
    if (!deck || deck.revision !== data.revision) return { error: '题目已更新，请刷新后重试' }
    return saveChoiceAnswer(sql(), currentUserId(), currentLocale(), data, deck)
  })
