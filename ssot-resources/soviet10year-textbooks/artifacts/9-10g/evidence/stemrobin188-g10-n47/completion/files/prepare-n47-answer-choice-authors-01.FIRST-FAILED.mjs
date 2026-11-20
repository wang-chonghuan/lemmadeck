import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s2-n47'
const modern = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const output = path.join(tmp, 'n47-answer-choice-author-inputs-01')
assert.ok(!fs.existsSync(output))
assert.equal(read(path.join(tmp, 'n47-adapt-finalize-01/command.json')).exitCode, 0)
assert.equal(read(path.join(tmp, 'n47-render-01/command.json')).exitCode, 0)
assert.equal(read(path.join(modern, 'adaptation.audit.json')).status, 'pass')
const exercises = read(path.join(modern, 'exercises.json')).exercises
assert.deepEqual(exercises.map(item => String(item.number)), ['49', '50', '51', '52', '53', '54'])
assert.deepEqual([...new Set(exercises.flatMap(item => item.figure_refs))], ['fig-g10-22'])
const reviewPath = path.join(tmp, 'n47-fig18-22-n48-text-review-01/figures-review.json')
const figure = read(reviewPath).figs.find(item => item.id === 'fig-g10-22')
assert.equal(figure.status, 'pass')
const figureAssets = [16, 17, 18, 19, 20, 21, 22].map(id => {
  const file = path.join(core, 'editions/modern-us-neutral/figures', `fig-g10-${id}`)
  const spec = read(`${file}.spec.json`)
  const review = read(`${file}.review.json`)
  assert.equal(review.status, 'pass')
  assert.equal(review.spec.sha256, hash(`${file}.spec.json`))
  assert.equal(review.outputs.svg.sha256, hash(`${file}.svg`))
  const source = bind(path.join(repo, spec.source.image.path))
  assert.equal(source.sha256, spec.source.image.sha256)
  return {
    id: `fig-g10-${id}`,
    source,
    spec: bind(`${file}.spec.json`), svg: bind(`${file}.svg`),
    render: bind(`${file}.render.json`), review: bind(`${file}.review.json`),
  }
})
const files = [
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
    .map(name => path.join(modern, name)),
  path.join(core, 'book.json'),
  path.join(core, 'editions/modern-us-neutral/book.json'),
  ...figureAssets.flatMap(item => [item.source, item.spec, item.svg, item.render, item.review]
    .map(binding => binding.path)),
  figure.previews[0].path,
]
const bindings = [...new Map(files.map(file => [file, bind(file)])).values()]
fs.mkdirSync(output)
save(path.join(output, 'manifest.json'), {
  status: 'pending-two-independent-authors', ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
  book: '9-10g', lesson, edition: 'modern-us-neutral',
  currentModern: ['lesson.json', 'exercises.json', 'figures.json'].map(name => bind(path.join(modern, name))),
  rawSourceForAnswerAlignment: [
    bind(path.join(core, 'lessons', lesson, 'lesson.json')),
    bind(path.join(core, 'lessons', lesson, 'exercises.json')),
  ],
  sourceExercises: exercises.map(item => ({ number: String(item.number), figureRefs: item.figure_refs })),
  figures: figureAssets,
  requiredAnswerFigureImages: [figure.source, figure.previews[0]],
  optionalConceptFigureImagesMustBeBudgeted: true,
  bindings,
  authorWriteRoots: {
    answer: path.join(tmp, 'n47-answer-author'),
    choice: path.join(tmp, 'n47-choice-author'),
  },
  rolesMustNotReadEachOthersOutputs: true, choiceAuthorMustNotReadAnswersOrOldChoices: true,
  allSixWrittenExercisesRemainOriginalTasks: true, drawingAndProofNotAutomaticallyCertified: true,
  source49ExactGlyphUnknownPreserved: true, sourceGlyphAndAllInkHoldsPreserved: true,
  hardImageLimit: 8, parentImageLoads: 0, published: false, wholeLessonApproved: false,
})
console.log(JSON.stringify({ output, bindings: bindings.length,
  exercises: exercises.length, requiredAnswerImages: 2 }))
