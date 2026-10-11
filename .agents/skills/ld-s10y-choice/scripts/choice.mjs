import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { contentSql, readRepoEnv } from '../../lib/content-db.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const require = createRequire(path.join(root, 'app/package.json'))
const { inline } = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const { ComputeEngine } = require('@cortex-js/compute-engine')
const katex = require('katex')
const engine = new ComputeEngine()
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const renderCopy = (text) => {
  for (const match of text.matchAll(/\$([^$]+)\$/g)) {
    katex.renderToString(match[1], { throwOnError: true, strict: 'error' })
  }
  return inline(text)
}
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

export function selectLessons(book, units, ids = []) {
  if (!/^[a-z0-9-]+$/.test(book)) throw new Error('Invalid book')
  const index = read(path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts', book, 'book.json'))
  const numbers = new Set()
  for (const range of (units ?? '').split(',').filter(Boolean)) {
    if (!/^\d+(?:-\d+)?$/.test(range)) throw new Error(`Invalid units: ${range}`)
    const [first, last = first] = range.split('-').map(Number)
    if (last < first || last - first > 300) throw new Error(`Invalid range: ${range}`)
    for (let n = first; n <= last; n += 1) numbers.add(String(n))
  }
  const selected = index.lessons.filter((lesson) => numbers.has(String(lesson.number)) || ids.includes(lesson.id))
  if (!selected.length) throw new Error('No lessons selected')
  for (const number of numbers) {
    if (selected.filter((lesson) => String(lesson.number) === number).length !== 1) {
      throw new Error(`Unit ${number} is missing or ambiguous`)
    }
  }
  for (const id of ids) if (!selected.some((lesson) => lesson.id === id)) throw new Error(`Missing lesson ${id}`)
  return selected
}

export function context(book, edition, id) {
  const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts', book)
  const directory = path.join(base, 'editions', edition, 'lessons', id)
  const lesson = read(path.join(directory, 'lesson.json'))
  const exercises = read(path.join(directory, 'exercises.json'))
  const answers = read(path.join(directory, 'answer-keys.json'))
  const figures = read(path.join(directory, 'figures.json')).figures
  if (lesson.status !== 'ready' || exercises.status !== 'ready') throw new Error(`${id}: edition not ready`)
  const figureIds = [...new Set(exercises.exercises.flatMap((exercise) => exercise.figure_refs ?? []))]
  const figureHashes = {}
  for (const figureId of figureIds) {
    const figure = figures.find((item) => item.id === figureId)
    if (!figure) throw new Error(`${id}: missing figure ${figureId}`)
    for (const field of ['svg', 'png', 'spec', 'artwork']) {
      if (figure[field]) {
        const file = path.join(base, 'editions', edition, figure[field])
        figureHashes[`${figureId}:${field}`] = hash(fs.readFileSync(file))
      }
    }
  }
  const source = {
    lesson: hash(fs.readFileSync(path.join(directory, 'lesson.json'))),
    exercises: hash(fs.readFileSync(path.join(directory, 'exercises.json'))),
    answers: hash(fs.readFileSync(path.join(directory, 'answer-keys.json'))),
    figures: figureHashes,
  }
  return { directory, base, lesson, exercises, answers, figures, source }
}

function validateMath(question) {
  const check = question.verification
  if (!check || !['numeric', 'expression', 'set', 'literal', 'graph'].includes(check.kind)) {
    throw new Error(`${question.id}: missing verification`)
  }
  if (check.kind === 'literal' || check.kind === 'graph') {
    if (!check.reason?.trim()) throw new Error(`${question.id}: missing semantic verification`)
    if (check.kind === 'literal' && question.options.every((option) => {
      const latex = option.text.match(/^\$([^$]+)\$$/)?.[1]
      return latex && engine.parse(latex).operator === 'Set'
    })) throw new Error(`${question.id}: finite sets require set verification`)
    if (check.kind === 'graph' && question.options.some((option) => !option.figure)) {
      throw new Error(`${question.id}: unrendered graph option`)
    }
    return
  }
  const target = engine.parse(check.expected)
  if (target.has('Error')) throw new Error(`${question.id}: invalid expected`)
  if (check.kind === 'set' && target.operator !== 'Set') throw new Error(`${question.id}: expected finite set required`)
  const values = question.options.map((option) => {
    if (!option.value) throw new Error(`${question.id}: missing option value`)
    const value = engine.parse(option.value)
    if (value.has('Error')) throw new Error(`${question.id}: invalid value ${option.value}`)
    if (check.kind === 'set' && value.operator !== 'Set') throw new Error(`${question.id}: option finite set required`)
    const displayed = option.text.match(/^\$([^$]+)\$/)?.[1]
    if (!displayed || engine.parse(displayed).isEqual(value) !== true) throw new Error(`${question.id}: displayed value mismatch`)
    return value
  })
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      if (values[i].isEqual(values[j]) === true) throw new Error(`${question.id}: equivalent options`)
    }
  }
  const matches = values.map((value, index) => value.isEqual(target) === true ? index : -1).filter((index) => index >= 0)
  if (matches.length !== 1 || question.options[matches[0]].id !== question.correctOptionId) {
    throw new Error(`${question.id}: mathematical key mismatch`)
  }
}

export function validateDocument(document, ctx) {
  if (document.schema !== 'ld-s10y-choice/lesson@1') throw new Error('Invalid choice schema')
  if (JSON.stringify(document.source) !== JSON.stringify(ctx.source)) throw new Error('Source changed; re-prepare and regenerate')
  if (!Array.isArray(document.coverage) || !Array.isArray(document.questions) || !document.questions.length) {
    throw new Error('Missing coverage/questions')
  }
  const expected = new Set(ctx.exercises.exercises.map((exercise) => String(exercise.number)))
  const targets = new Set()
  const coveredExercises = new Set()
  for (const item of document.coverage) {
    if (!expected.has(item.exercise) || coveredExercises.has(item.exercise) ||
      !Array.isArray(item.targets) || !item.targets.length) throw new Error('Invalid coverage')
    coveredExercises.add(item.exercise)
    for (const target of item.targets) {
      const key = `${item.exercise}:${target}`
      if (!target || targets.has(key)) throw new Error(`Duplicate target ${key}`)
      targets.add(key)
    }
  }
  if (new Set(document.coverage.map((item) => item.exercise)).size !== expected.size) throw new Error('Missing exercise coverage')
  const used = new Set()
  const ids = new Set()
  for (const question of document.questions) {
    const target = `${question.source?.exercise}:${question.source?.target}`
    if (!targets.has(target) || used.has(target)) throw new Error(`${question.id}: invalid target ${target}`)
    used.add(target)
    if (!/^[a-zA-Z0-9-]+$/.test(question.id) || ids.has(question.id)) throw new Error('Duplicate/invalid question id')
    ids.add(question.id)
    if (!question.prompt?.trim() || !question.explanation?.trim()) throw new Error(`${question.id}: missing copy`)
    if (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > 4) throw new Error('Invalid options')
    const studentCopy = [question.prompt, question.explanation,
      ...question.options.flatMap((option) => [option.text, option.misconception ?? ''])]
    if (studentCopy.some((copy) => /原题|原表/.test(copy))) throw new Error(`${question.id}: source reference in student copy`)
    const options = new Set()
    const texts = new Set()
    for (const option of question.options) {
      if (!option.id || options.has(option.id) || !option.text?.trim() || texts.has(option.text.trim())) throw new Error('Duplicate/empty option')
      options.add(option.id)
      texts.add(option.text.trim())
      renderCopy(option.text)
      if (option.id !== question.correctOptionId && !option.misconception?.trim()) throw new Error(`${question.id}: missing distractor reason`)
      if (option.misconception) renderCopy(option.misconception)
      if (option.svg) throw new Error('Option SVG must be generated from a FigureSpec, not embedded in the draft')
      if (option.figure) validateFigure(option.figure, ctx)
    }
    if (!options.has(question.correctOptionId)) throw new Error(`${question.id}: invalid key`)
    for (const figure of question.generatedFigures ?? []) validateFigure(figure, ctx)
    renderCopy(question.prompt)
    renderCopy(question.explanation)
    const original = ctx.exercises.exercises.find((exercise) => String(exercise.number) === question.source.exercise)
    if ((question.group ?? null) !== (original.group ?? null)) throw new Error(`${question.id}: source group changed`)
    for (const ref of question.figureRefs ?? []) {
      if (!(ctx.exercises.exercises.find((exercise) => String(exercise.number) === question.source.exercise)?.figure_refs ?? []).includes(ref)) {
        throw new Error(`${question.id}: unrelated figure ${ref}`)
      }
    }
    validateMath(question)
  }
  if (used.size !== targets.size) throw new Error('Uncovered subquestions')
  return { questions: document.questions.length, exercises: expected.size, targets: used.size }
}

function resource(ctx, relative) {
  const file = path.resolve(ctx.directory, relative)
  if (!file.startsWith(`${ctx.directory}${path.sep}`) || !fs.statSync(file).isFile()) throw new Error('Invalid figure path')
  return file
}

function validateFigure(figure, ctx) {
  const files = Object.fromEntries(['spec', 'svg', 'render', 'review'].map((key) => [key, resource(ctx, figure[key])]))
  const spec = read(files.spec)
  const render = read(files.render)
  const review = read(files.review)
  if (spec.schema !== 'ld-s10y-image/figure-spec@2' || render.status !== 'pass' ||
    review.schema !== 'ld-s10y-image/review@1' || review.status !== 'pass' ||
    render.spec.sha256 !== hash(fs.readFileSync(files.spec)) ||
    review.spec.sha256 !== render.spec.sha256 ||
    review.render.sha256 !== hash(fs.readFileSync(files.render)) ||
    render.output.svg.sha256 !== hash(fs.readFileSync(files.svg)) ||
    review.outputs.svg.sha256 !== render.output.svg.sha256 ||
    spec.source.image.sha256 !== hash(fs.readFileSync(path.join(root, spec.source.image.path)))) {
    throw new Error('Missing/stale graph evidence')
  }
  const svg = fs.readFileSync(files.svg, 'utf8')
  if (/<(?:script|image|foreignObject)\b/i.test(svg) || /\bon\w+\s*=|(?:href|src)\s*=/i.test(svg)) throw new Error('Unsafe graph SVG')
}

export function documentHash(document) {
  const directory = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts',
    document.book, 'editions', document.edition, 'lessons', document.lesson)
  const files = new Set(document.questions.flatMap((question) => [
    ...question.options.flatMap((option) => option.figure ? Object.values(option.figure) : []),
    ...(question.generatedFigures ?? []).flatMap((figure) => Object.values(figure)),
  ]))
  const assets = Object.fromEntries([...files].sort().map((file) => [
    file, hash(fs.readFileSync(resource({ directory }, file))),
  ]))
  return hash(JSON.stringify({ ...document, status: 'ready', assets }))
}

function validateReview(document, ctx) {
  const review = read(path.join(ctx.directory, 'choices.review.json'))
  if (review.schema !== 'ld-s10y-choice/review@1' || review.status !== 'pass' ||
    review.hash !== documentHash(document) || !review.notes?.trim() ||
    review.questions?.length !== document.questions.length ||
    document.questions.some((question) => !review.questions.includes(question.id))) {
    throw new Error('Current complete semantic review required')
  }
}

function figurePayload(ctx, edition, id) {
  const figure = ctx.figures.find((item) => item.id === id)
  const base = path.join(ctx.base, 'editions', edition)
  const spec = read(path.join(base, figure.spec))
  return {
    id, label: figure.label ?? null,
    svg: figure.svg ? fs.readFileSync(path.join(base, figure.svg), 'utf8') : null,
    image: figure.png ? `data:image/png;base64,${fs.readFileSync(path.join(base, figure.png)).toString('base64')}` : null,
    layout: spec.display.layout,
    mode: spec.mode,
  }
}

function payload(document, ctx) {
  return {
    schema: document.schema,
    revision: documentHash(document),
    source: document.source,
    coverage: document.coverage,
    questions: document.questions.map((question) => ({
      ...question,
      html: renderCopy(question.prompt),
      explanationHtml: renderCopy(question.explanation),
      options: question.options.map((option) => ({ ...option, html: renderCopy(option.text),
        ...(option.figure ? { svg: fs.readFileSync(resource(ctx, option.figure.svg), 'utf8') } : {}),
      })),
      figures: [
        ...(question.figureRefs ?? []).map((id) => figurePayload(ctx, document.edition, id)),
        ...(question.generatedFigures ?? []).map((figure) => ({
          id: read(resource(ctx, figure.spec)).id, label: null,
          svg: fs.readFileSync(resource(ctx, figure.svg), 'utf8'),
          image: null, layout: 'inline', mode: 'deterministic', maxWidthPx: 400,
        })),
      ],
    })),
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2)
  const arg = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback
  const book = arg('--book')
  const edition = arg('--edition', 'modern-us-neutral')
  if (!book || !/^[a-z0-9-]+$/.test(edition)) throw new Error('Usage: choice.mjs prepare|finalize|publish --book <id> --units 16-18 [--lesson <id>]')
  const lessons = selectLessons(book, arg('--units'), args.flatMap((value, index) => value === '--lesson' ? [args[index + 1]] : []))
  const sql = command === 'publish' && !args.includes('--dry') ? contentSql({ env: readRepoEnv(root) }) : null
  try {
    for (const lesson of lessons) {
      const ctx = context(book, edition, lesson.id)
      const file = path.join(ctx.directory, 'choices.json')
      if (command === 'prepare') {
        write(path.join(root, '.tmp/ld-s10y-choice', book, lesson.id, 'context.json'), {
          ...ctx, directory: undefined, base: undefined,
        })
        if (!fs.existsSync(file)) {
          write(file, { schema: 'ld-s10y-choice/lesson@1', book, edition, lesson: lesson.id,
            status: 'draft', source: ctx.source, coverage: [], questions: [] })
        } else if (JSON.stringify(read(file).source) !== JSON.stringify(ctx.source)) {
          if (!args.includes('--refresh')) throw new Error(`${lesson.id}: source changed; use prepare --refresh to archive and regenerate`)
          write(path.join(root, '.tmp/ld-s10y-choice', book, lesson.id, `previous-${Date.now()}.json`), read(file))
          write(file, { schema: 'ld-s10y-choice/lesson@1', book, edition, lesson: lesson.id,
            status: 'draft', source: ctx.source, coverage: [], questions: [] })
        }
        console.log(`[prepare] ${lesson.id}: ${ctx.exercises.count} exercises`)
        continue
      }
      const document = read(file)
      if (document.book !== book || document.edition !== edition || document.lesson !== lesson.id) throw new Error('Lesson identity mismatch')
      const report = validateDocument(document, ctx)
      validateReview(document, ctx)
      if (command === 'finalize') {
        document.status = 'ready'
        write(file, document)
        write(path.join(ctx.directory, 'choices.audit.json'), {
          status: 'pass', hash: documentHash(document), ...report,
        })
        console.log(`[finalize] ${lesson.id}: ${JSON.stringify(report)}`)
      } else if (command === 'publish') {
        const audit = read(path.join(ctx.directory, 'choices.audit.json'))
        if (document.status !== 'ready' || audit.hash !== documentHash(document)) throw new Error('Finalize required')
        if (sql) {
          await sql.begin(async (tx) => {
            const rows = await tx`select exercises from sr_lessons where id = ${lesson.id} for update`
            const deck = rows[0]?.exercises
            if (deck?.edition !== edition || deck.exercises?.length !== ctx.exercises.count) throw new Error('Published source mismatch')
            for (const original of ctx.exercises.exercises) {
              const stored = deck.exercises.find((item) => String(item.number) === String(original.number))
              if (!stored || stored.html !== inline(original.text)) throw new Error(`Published original changed: ${original.number}`)
              for (const id of original.figure_refs ?? []) {
                const storedFigure = deck.exercises.flatMap((item) => item.figures ?? []).find((figure) => figure.id === id)
                if (storedFigure?.svg?.replace(/<\?xml[^>]*\?>/, '').trim() !== figurePayload(ctx, edition, id).svg?.replace(/<\?xml[^>]*\?>/, '').trim()) {
                  throw new Error(`Published figure changed: ${id}`)
                }
              }
            }
            const next = payload(document, ctx)
            if (deck.choices?.revision !== next.revision) {
              await tx`update sr_lessons set exercises = ${tx.json({ ...deck, choices: next })}, updated_at = now() where id = ${lesson.id}`
            }
          })
        }
        console.log(`[publish] ${lesson.id}: ${report.questions} questions${sql ? '' : ' (dry)'}`)
      } else throw new Error('Unknown command')
    }
  } finally { if (sql) await sql.end() }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1 })
}
