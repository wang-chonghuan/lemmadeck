import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const lesson = 'geo910-c2-s2-n47'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const inventory = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  assert.ok(!entry.isSymbolicLink(), file)
  assert.ok(!['.env', '.git', 'node_modules', '.venv', '__pycache__', 'runtime'].includes(entry.name))
  assert.ok(!/\.(pdf|pyc|pem|key)$/i.test(entry.name))
  return entry.isDirectory() ? inventory(file) : [file]
})
const output = path.join(tmp, 'n47-answer-choice-surfaces-review-inputs-01')
assert.ok(!fs.existsSync(output))
const authorInputsPath = path.join(tmp, 'n47-answer-choice-author-inputs-01/manifest.json')
const inputs = read(authorInputsPath)
inputs.bindings.forEach(check)
const seedPath = path.join(tmp, 'n47-choice-author/seed.json')
const draftPath = path.join(tmp, 'n47-choice-author/draft.json')
const answerPath = path.join(tmp, 'n47-answer-author/candidate/answer-keys.json')
const seed = read(seedPath)
const draft = read(draftPath)
const answers = read(answerPath)
assert.equal(seed.schema, 's10y-choice-seed-v1')
assert.equal(draft.schema, 's10y-choice-draft-v1')
assert.equal(seed.source.book, '9-10g')
assert.equal(seed.source.lesson, lesson)
assert.deepEqual(seed.exercises.map(item => String(item.number)), ['49', '50', '51', '52', '53', '54'])
assert.deepEqual(answers.answers.map(item => String(item.exercise)), ['49', '50', '51', '52', '53', '54'])
assert.deepEqual(draft.new_figures, [])
const displayPath = path.join(tmp, 'n47-display-surfaces-01/result.json')
const display = read(displayPath)
assert.equal(display.status, 'machine-surfaces-pass-visual-review-pending')
display.screenshots.forEach(check)
const figures = ['1617', '1819', '2021', '22'].flatMap(selector =>
  read(path.join(tmp, `n47-fig${selector}-admission-01.json`)).figures)
const used = [...new Set([
  'fig-g10-22', ...seed.source.concept_figure_ids,
  ...seed.exercises.flatMap(item => item.figure_ids),
  ...draft.questions.flatMap(item => [
    ...item.view.figure_ids, ...item.view.options.flatMap(option => option.figure_ids),
  ]),
])]
const selected = used.map(id => {
  const figure = figures.find(item => item.id === id)
  assert.ok(figure, id)
  for (const field of ['source', 'spec', 'svg', 'render', 'nativeReview']) check(figure[field])
  const preview = figure.previews.find(item => item.width === 480)
  check(preview)
  const seedFigure = seed.figures.find(item => item.id === id)
  assert.ok(seedFigure, id)
  for (const asset of seedFigure.assets) {
    const file = path.resolve(repo, asset.path)
    assert.equal(hash(file), asset.sha256, file)
    if (file.endsWith('.svg')) assert.equal(asset.sha256, figure.svg.sha256)
  }
  return { id, source: figure.source, preview, currentSvg: figure.svg, currentSpec: figure.spec }
})
const figure22 = selected.find(item => item.id === 'fig-g10-22')
const images = [
  { ...figure22.source, scope: 'answer54-original-source-FIRST' },
  ...selected.map(item => ({ ...item.preview, scope: `${item.id}-actual-current-seed-image` })),
  ...display.screenshots.map(item => ({ ...item, scope: `N47-${item.kind}-${item.viewport.width}-first-display` })),
]
assert.ok(images.length <= 8, 'Split scopes without resetting image counters if the selected seed exceeds eight images')
const files = [
  authorInputsPath, ...inputs.bindings.map(item => item.path),
  ...inventory(path.join(tmp, 'n47-answer-author')),
  ...inventory(path.join(tmp, 'n47-choice-author')),
  displayPath, ...inventory(path.join(tmp, 'n47-display-surfaces-01')),
  ...selected.flatMap(item => [item.source.path, item.preview.path, item.currentSvg.path, item.currentSpec.path]),
  ...display.screenshots.map(item => item.path),
  path.join(tmp, 'prepare-n47-answer-choice-surfaces-review-01.mjs'),
]
const bindings = [...new Map(files.map(file => [file, bind(file)])).values()]
fs.mkdirSync(output)
save(path.join(output, 'source-only.json'), {
  book: '9-10g', lesson, seed, currentModern: inputs.currentModern,
  answerFigureImages: [figure22.source, figure22.preview], internalKeysIncluded: false,
})
save(path.join(output, 'visible-questions.json'), {
  questions: draft.questions.map(item => ({ id: item.id, view: item.view })),
  internalSolutionsAndKeysIncluded: false,
})
save(path.join(output, 'manifest.json'), {
  status: 'pending-first-independent-n47-answer-choice-and-surfaces-review',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
  sourceOnly: bind(path.join(output, 'source-only.json')),
  visibleQuestions: bind(path.join(output, 'visible-questions.json')),
  keyLast: { draft: bind(draftPath), answerCandidate: bind(answerPath) },
  sourceExercises: seed.exercises.length, questions: draft.questions.length,
  options: draft.questions.reduce((sum, item) => sum + item.view.options.length, 0),
  figures: selected, display: bind(displayPath), images, bindings,
  imageOpensPlanned: images.length, hardImageLimit: 8,
  originalCandidatesAndFailuresPreserved: true, contentRepairsReset: false,
  full33TextAndSevenFigureFidelityPassNotRepeated: true,
  drawingAndProofNotAutomaticallyCertified: true,
  source49GlyphAndAllInkHoldsPreserved: true,
  wholeLessonApproved: false, nativeFinalizeOrRenderRepeated: false, published: false,
})
console.log(JSON.stringify({ output, bindings: bindings.length, images: images.length,
  questions: draft.questions.length }))
