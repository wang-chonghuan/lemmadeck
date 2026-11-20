import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s2-n47'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const safe = file => {
  assert.ok(file.startsWith(tmp + path.sep) || file.startsWith(core + path.sep), file)
  assert.equal(fs.realpathSync(file), file)
  assert.ok(!file.split(path.sep).some(part => ['.env', '.git', 'node_modules', '.venv', '__pycache__', 'runtime'].includes(part)))
  assert.ok(!/\.(pdf|pyc|pem|key)$/i.test(file))
  return file
}
const check = binding => assert.equal(hash(safe(binding.path)), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const inventory = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  assert.ok(!entry.isSymbolicLink(), file)
  if (['.env', '.git', 'node_modules', '.venv', '__pycache__', 'runtime'].includes(entry.name)
    || /\.(pdf|pyc|pem|key)$/i.test(entry.name)) return []
  return entry.isDirectory() ? inventory(file) : [safe(file)]
})
const stage = process.argv[2]
assert.ok(['admit', 'retain'].includes(stage))
const admissionPath = path.join(tmp, 'n47-completion-admission-01.json')
const reviewRoot = path.join(tmp, 'n47-choice-display-source191192-review-01')
const visualPath = path.join(reviewRoot, 'choice-visual-review.json')
const surfaceVisualPath = path.join(tmp, 'n47-answer-choice-surfaces-review-01/visual-review.json')
const artifactFiles = () => [
  ...inventory(path.join(core, 'lessons', lesson)), ...inventory(target),
  ...read(path.join(target, 'figures.json')).figures.flatMap(figure =>
    ['svg', 'png', 'artwork', 'spec', 'render', 'review'].filter(field => figure[field])
      .map(field => safe(path.resolve(core, 'editions/modern-us-neutral', figure[field])))),
]
if (stage === 'admit') {
  assert.ok(!fs.existsSync(admissionPath))
  const latestIndexPath = path.join(reviewRoot, 'output-index.json')
  const expectedIndex = process.argv[3]
  assert.match(expectedIndex, /^[0-9a-f]{64}$/)
  assert.equal(hash(latestIndexPath), expectedIndex)
  const latestIndex = read(latestIndexPath)
  latestIndex.outputs.forEach(check)
  assert.equal(read(visualPath).status, 'pass')
  assert.equal(read(visualPath).lesson, lesson)
  assert.equal(read(surfaceVisualPath).status, 'pass')
  const surfaceScreens = read(surfaceVisualPath).screenshots
  assert.equal(surfaceScreens.length, 4)
  surfaceScreens.forEach(item => { check(item); assert.equal(item.status, 'pass') })
  const displayPath = path.join(tmp, `offline-display-9-10g_${lesson}-choices/result.json`)
  const choiceScreens = read(displayPath).results.map(item => {
    assert.equal(hash(item.screenshot), item.screenshotSha256)
    for (const [name, sha256] of Object.entries(item.sourceHashes))
      assert.equal(hash(path.join(target, name)), sha256)
    return bind(item.screenshot)
  })
  assert.equal(choiceScreens.length, 2)
  const reviewedScreens = read(visualPath).screenshots
  assert.equal(reviewedScreens.length, 2)
  reviewedScreens.forEach(item => {
    check(item)
    assert.equal(item.status, 'pass')
    assert.ok(choiceScreens.some(screen => screen.path === item.path && screen.sha256 === item.sha256))
  })
  const receipts = [
    ['adapt-finalize', 'n47-adapt-finalize-01/command.json'],
    ['render', 'n47-render-01/command.json'],
    ['answer-finalize', 'n47-answer-finalize-01/command.json'],
    ...['check', 'retain', 'display'].map(name => [`choice-${name}`, `n47-choice-${name}-01/command.json`]),
  ].map(([name, file]) => {
    const binding = bind(path.join(tmp, file))
    assert.equal(read(binding.path).exitCode, 0)
    return { stage: name, ...binding }
  })
  const answerReviewPath = path.join(tmp, 'n47-answer-choice-surfaces-review-01/answer-review.json')
  const choiceReviewPath = path.join(tmp, 'n47-choice-internal-affected-review-01/review.json')
  const modern = read(path.join(tmp, 'n47-modern-admission-01.json'))
  assert.equal(modern.status, 'pass-for-modern-text-only')
  check(modern.review)
  assert.equal(read(modern.review.path).status, 'pass')
  assert.equal(read(answerReviewPath).status, 'pass')
  assert.equal(read(choiceReviewPath).outcome, 'pass')
  assert.equal(read(path.join(target, 'answer-keys.json')).status, 'ready')
  assert.equal(read(path.join(target, 'answer-keys.json')).answers.length, 6)
  assert.equal(read(path.join(target, 'exercises.json')).exercises.length, 6)
  assert.equal(read(path.join(target, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(target, 'answer-keys.audit.json')).status, 'pass')
  assert.equal(read(path.join(target, 'choice-set/review.json')).outcome, 'pass')
  const figures = read(path.join(target, 'figures.json')).figures
  assert.equal(figures.length, 7)
  for (const figure of figures) {
    const review = read(path.resolve(core, 'editions/modern-us-neutral', figure.review))
    const render = read(path.resolve(core, 'editions/modern-us-neutral', figure.render))
    assert.equal(review.status, 'pass')
    assert.equal(render.status, 'pass')
  }
  const inheritedPackages = [
    'source/bindings.json', 'modern-text/bindings.json', 'source-index-transition/bindings.json',
    ...['1617', '1819', '2021', '22'].map(selector => `fig${selector}/promotion-bindings.json`),
  ].map(file => bind(path.join(core, 'evidence/stemrobin188-g10-n47', file)))
  const directories = [
    'n47-answer-author', 'n47-choice-author', 'n47-answer-choice-author-inputs-01',
    'n47-answer-choice-surfaces-review-inputs-01', 'n47-answer-choice-surfaces-review-01',
    'n47-choice-internal-repair-01', 'n47-choice-internal-affected-review-01',
    'n47-answer-finalize-01', 'n47-choice-check-01', 'n47-choice-retain-01', 'n47-choice-display-01',
    'n47-choice-display-source191192-review-inputs-01', 'n47-choice-display-source191192-review-01',
    'n47-adapt-finalize-01', 'n47-render-01', 'n47-display-surfaces-01',
    `offline-display-9-10g_${lesson}-surfaces`, `offline-display-9-10g_${lesson}-choices`,
  ]
  const inputManifests = [
    'n47-answer-choice-surfaces-review-inputs-01/manifest.json',
    'n47-choice-display-source191192-review-inputs-01/manifest.json',
  ].map(file => read(path.join(tmp, file)))
  inputManifests.forEach(manifest => manifest.bindings.forEach(check))
  const files = [...new Set([
    ...directories.flatMap(directory => inventory(path.join(tmp, directory))),
    ...inputManifests.flatMap(manifest => manifest.bindings.map(item => item.path)),
    ...['finalize-n47-answers-01.mjs', 'finalize-n47-choices-01.mjs',
      'repair-n47-choice-internal-01.mjs', 'prepare-n47-choice-display-source191192-review-01.mjs',
      'retain-n47-completion-01.mjs'].map(file => path.join(tmp, file)),
  ])]
  files.forEach(safe)
  const bindings = [...new Map([
    ...files.map(bind), ...artifactFiles().map(bind), ...inheritedPackages,
    ...receipts, modern.review, bind(answerReviewPath), bind(choiceReviewPath),
    bind(surfaceVisualPath), bind(visualPath), bind(latestIndexPath), ...surfaceScreens, ...choiceScreens,
  ].map(item => [item.path, { path: item.path, sha256: item.sha256 }])).values()]
  bindings.forEach(check)
  save(admissionPath, {
    status: 'pass-for-offline-completion', book: '9-10g', lesson, receipts,
    reviews: { modern: modern.review, answer: bind(answerReviewPath), choice: bind(choiceReviewPath) },
    visuals: { textAndExercises: bind(surfaceVisualPath), choices: bind(visualPath),
      screenshots: [...surfaceScreens.map(item => ({ path: item.path, sha256: item.sha256 })), ...choiceScreens] },
    inheritedPackages, retainFiles: files, bindings,
    history: {
      reset: false, allOriginalFailuresAndHoldsPreserved: true, choiceInternalContentRepairs: 1,
      figureRepairs: { 16: 0, 17: 0, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1 },
      source49ExactRaisedGlyphUnknownAndAllInkHoldsPreserved: true,
      source20OldFirst3Rays17SegmentsAndCorrected4Rays18SegmentsPreserved: true,
      grading: { auto: 5, ungraded: 1, construction52NotAutomaticallyCertified: true },
      originalSource193And195FailuresAnd189ReceiptHoldNotClearedByCompositeVisualPass: true,
      noPaidCallsOrPublishing: true, fullMechanicalDefence: false,
    },
    published: false, fullMechanicalDefence: false, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ output: admissionPath, bindings: bindings.length, retainFiles: files.length }))
} else {
  const admission = read(admissionPath)
  assert.equal(admission.status, 'pass-for-offline-completion')
  assert.equal(admission.lesson, lesson)
  assert.equal(admission.published, false)
  assert.equal(admission.history.reset, false)
  admission.bindings.forEach(check)
  for (const receipt of admission.receipts) assert.equal(read(receipt.path).exitCode, 0)
  assert.equal(read(admission.visuals.choices.path).status, 'pass')
  artifactFiles().forEach(file => assert.ok(admission.bindings.some(item => item.path === file && item.sha256 === hash(file))))
  const output = path.join(core, 'evidence/stemrobin188-g10-n47/completion')
  assert.ok(!fs.existsSync(output), 'Never replace partial or successful retention')
  const existing = new Map(inventory(core).map(file => [hash(file), file]))
  const files = [...new Set([admissionPath, ...admission.retainFiles])]
  files.forEach(safe)
  fs.mkdirSync(output, { recursive: true })
  const retained = files.map(from => {
    const sha256 = hash(from)
    const reused = existing.has(sha256)
    const to = reused ? existing.get(sha256) : path.join(output, 'files', path.relative(tmp, from))
    if (!reused) {
      assert.ok(from.startsWith(tmp + path.sep), 'Copy only new ticket evidence bytes')
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
      existing.set(sha256, to)
    }
    assert.equal(hash(to), sha256)
    return { from, retained: path.relative(core, to), sha256, reused }
  })
  admission.bindings.forEach(check)
  save(path.join(output, 'bindings.json'), {
    schema: 'stemrobin188-offline-completion@1', book: '9-10g', lesson, status: 'complete-offline',
    exercises: 6, figures: 7, answers: 6, choices: 7, options: 24,
    lessonArtifacts: [...new Set(artifactFiles())].map(file => ({ path: path.relative(core, file), sha256: hash(file) })),
    inheritedPackages: admission.inheritedPackages.map(item => ({ path: path.relative(core, item.path), sha256: item.sha256 })),
    history: admission.history, bindings: retained, published: false, fullMechanicalDefence: false, parentImageLoads: 0,
  })
  console.log(JSON.stringify({ output, status: 'complete-offline', bindings: retained.length,
    copied: retained.filter(item => !item.reused).length, reused: retained.filter(item => item.reused).length }))
}
