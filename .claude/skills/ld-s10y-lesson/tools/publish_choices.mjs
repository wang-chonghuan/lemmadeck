import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { choiceHtml } from './choice_html.mjs'

const require = createRequire(import.meta.url)
const { inline } = require('./htmlfrag.js')

// Publication is separate from the offline author's skill. Only reviewed snapshots
// are compiled, and only the choiceSet field is changed in existing lesson rows.
export async function publishChoices({ book, editionName, requestedLessons, dry, database }) {
  const repo = process.cwd()
  const skill = path.join(repo, '.agents/skills/ld-s10y-choice')
  const rows = []
  for (const lessonId of requestedLessons) {
    const dir = path.join(book, 'editions', editionName, 'lessons', lessonId, 'choice-set')
    const seedPath = path.join(dir, 'seed.json')
    const draftPath = path.join(dir, 'draft.json')
    const reviewPath = path.join(dir, 'review.json')
    const gate = spawnSync(process.env.PYTHON || 'python3', [
      path.join(skill, 'scripts/validate.py'), '--repo', repo,
      '--seed', seedPath, '--draft', draftPath, '--review', reviewPath,
    ], { encoding: 'utf8' })
    if (gate.error || gate.status !== 0) {
      throw new Error(`${lessonId}: ${gate.error?.message || gate.stdout || gate.stderr}`)
    }
    const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'))
    const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
    const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'))
    if (seed.source.lesson !== lessonId || seed.source.book !== path.basename(book)) {
      throw new Error(`${lessonId}: seed belongs to another lesson or book`)
    }
    const edition = path.join(book, 'editions', editionName)
    const manifest = JSON.parse(fs.readFileSync(path.join(edition, 'lessons', lessonId, 'figures.json'), 'utf8')).figures
    const figures = new Map(seed.figures.map((figure) => {
      const declared = manifest.find((item) => item.id === figure.id)
      const spec = JSON.parse(fs.readFileSync(path.join(edition, declared.spec), 'utf8'))
      const assets = figure.assets.map((asset) => {
        const bytes = fs.readFileSync(path.join(repo, asset.path))
        if (asset.path.endsWith('.svg')) return { svg: bytes.toString('utf8') }
        const extension = path.extname(asset.path).slice(1)
        return { image: `data:image/${extension === 'jpg' ? 'jpeg' : extension};base64,${bytes.toString('base64')}` }
      })
      return [figure.id, {
        id: figure.id, label: null, ...Object.assign({}, ...assets),
        mode: spec.mode,
        layout: spec.display.layout,
        purpose: spec.display.purpose ?? 'instructional',
        ...(spec.display.maxWidthPx ? { maxWidthPx: spec.display.maxWidthPx } : {}),
        ...(spec.display.layout === 'scroll' ? { displayWidthPx: Math.min(...spec.display.widths) } : {}),
      }]
    }))
    for (const figure of draft.new_figures) {
      const assetPath = path.resolve(repo, figure.path)
      const retainedRoot = path.resolve(dir, 'figures')
      if (!fs.realpathSync(assetPath).startsWith(`${fs.realpathSync(retainedRoot)}${path.sep}`)) {
        throw new Error(`${lessonId}: authored figures must be retained inside choice-set/figures`)
      }
      const specPath = assetPath.replace(/\.[^.]+$/, '.spec.json')
      const renderPath = assetPath.replace(/\.[^.]+$/, '.render.json')
      const imageReviewPath = assetPath.replace(/\.[^.]+$/, '.review.json')
      const imageGate = spawnSync(process.env.PYTHON || 'python3', [
        path.join(repo, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
        specPath, '--stage', 'rendered',
      ], { encoding: 'utf8' })
      if (imageGate.error || imageGate.status !== 0) {
        throw new Error(`${lessonId}: ${imageGate.error?.message || imageGate.stdout || imageGate.stderr}`)
      }
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
      const render = JSON.parse(fs.readFileSync(renderPath, 'utf8'))
      const imageReview = JSON.parse(fs.readFileSync(imageReviewPath, 'utf8'))
      const imageHash = (filename) => createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
      const sourceMatches = 'authoredBasis' in spec.source
        ? imageReview.source.authoredBasis === spec.source.authoredBasis
        : imageReview.source.sha256 === imageHash(path.resolve(repo, spec.source.image.path))
      if (render.status !== 'pass' || imageReview.status !== 'pass'
        || render.figure !== figure.id || imageReview.figure !== figure.id
        || render.spec.sha256 !== imageHash(specPath)
        || imageReview.spec.sha256 !== imageHash(specPath)
        || imageReview.render.sha256 !== imageHash(renderPath)
        || !sourceMatches
        || render.output.svg.sha256 !== figure.sha256
        || imageReview.outputs.svg.sha256 !== figure.sha256) {
        throw new Error(`${lessonId}: stale or failing authored figure evidence`)
      }
      figures.set(figure.id, {
        id: figure.id, label: null, svg: fs.readFileSync(assetPath, 'utf8'),
        mode: spec.mode, layout: spec.display.layout,
        purpose: spec.display.purpose,
        ...(spec.display.maxWidthPx ? { maxWidthPx: spec.display.maxWidthPx } : {}),
        ...(spec.display.layout === 'scroll' ? { displayWidthPx: Math.min(...spec.display.widths) } : {}),
      })
    }
    const questions = draft.questions.map((question) => ({
      id: question.id,
      mode: question.view.mode,
      sourceNumbers: question.source_numbers,
      html: choiceHtml(question.view.stem),
      figures: question.view.figure_ids.map((id) => figures.get(id)),
      options: question.view.options.map((option) => ({
        id: option.id, html: choiceHtml(option.text),
        ...(option.figure_ids.length
          ? { svg: option.figure_ids.map((id) => {
            const figure = figures.get(id)
            return figure.svg ?? `<img alt="" src="${figure.image}">`
          }).join('') } : {}),
        misconception: question.key.rationales.find((rationale) => rationale.option_id === option.id).misconception,
      })),
      correctOptionIds: question.key.correct,
      explanationHtml: question.key.rationales.map((rationale, index) =>
        inline(`${String.fromCharCode(65 + index)}：${rationale.derivation}`)).join('<br>'),
    }))
    rows.push({
      id: lessonId,
      deck: { revision: review.draft_sha256, questions },
    })
    console.log(`${lessonId}: ${questions.length} reviewed questions, `
      + `${questions.filter((question) => question.mode === 'multiple').length} multiple`)
  }
  if (dry) return
  await database.begin(async (transaction) => {
    for (const row of rows) {
      const [before] = await transaction`
        select md5(content::text) as content_hash,
          md5((exercises - 'choiceSet')::text) as written_hash
        from sr_lessons where id = ${row.id} for update
      `
      if (!before) throw new Error(`${row.id}: publish the written lesson first`)
      await transaction`
        update sr_lessons
        set exercises = jsonb_set(exercises, '{choiceSet}', ${transaction.json(row.deck)}::jsonb),
          updated_at = now()
        where id = ${row.id}
      `
      const [after] = await transaction`
        select md5(content::text) as content_hash,
          md5((exercises - 'choiceSet')::text) as written_hash
        from sr_lessons where id = ${row.id}
      `
      if (before.content_hash !== after.content_hash || before.written_hash !== after.written_hash) {
        throw new Error(`${row.id}: original lesson or written exercises changed`)
      }
      console.log(`${row.id}: published; original content and written exercises unchanged`)
    }
  })
}
