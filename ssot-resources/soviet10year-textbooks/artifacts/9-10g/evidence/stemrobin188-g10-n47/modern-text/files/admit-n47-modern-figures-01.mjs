import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const lesson = 'geo910-c2-s2-n47'
const work = path.join(tmp, 'g10-n47/work/adapt/9-10g/modern-us-neutral/lessons', lesson)
const firstRoot = path.join(tmp, 'n47-text-fig1617-n46-choice-review-01')
const snapshot = path.join(tmp, 'n47-modern-text-promotion-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const check = binding => assert.equal(hash(binding.path), binding.sha256, binding.path)
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const safe = file => {
  assert.ok(file.startsWith(tmp + path.sep) || file.startsWith(core + path.sep), file)
  assert.equal(fs.realpathSync(file), file)
  assert.ok(!file.split(path.sep).some(part =>
    ['.env', '.git', 'node_modules', '.venv', '__pycache__'].includes(part)), file)
  assert.ok(!/\.(pdf|pyc|pem|key)$/i.test(file), file)
  return file
}
const inventory = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (entry.isSymbolicLink() || ['.env', '.git', 'node_modules', '.venv', '__pycache__', 'runtime'].includes(entry.name)
    || /\.(pdf|pyc|pem|key)$/i.test(entry.name)) return []
  return entry.isDirectory() ? inventory(file) : [safe(file)]
})
const retain = (output, files, record) => {
  assert.ok(!fs.existsSync(output))
  const unique = [...new Set(files)]
  for (const file of unique) safe(file)
  const existing = new Map(inventory(core).map(file => [hash(file), file]))
  fs.mkdirSync(output, { recursive: true })
  const bindings = unique.map(from => {
    const sha256 = hash(from)
    const reused = existing.has(sha256)
    const to = reused ? existing.get(sha256) : path.join(output, 'files', path.relative(tmp, from))
    if (!reused) {
      assert.ok(from.startsWith(tmp + path.sep), from)
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
      existing.set(sha256, to)
    }
    assert.equal(hash(to), sha256)
    return { from, retained: path.relative(core, to), sha256, reused }
  })
  save(path.join(output, 'bindings.json'), { ...record, bindings })
  return bindings
}
const modernAdmissionPath = path.join(tmp, 'n47-modern-admission-01.json')
const [action, selector, reviewArg] = process.argv.slice(2)
if (action === 'admit-modern') {
  const manifestPath = path.join(tmp, 'n47-modern-text-review-inputs-01/manifest.json')
  const manifest = json(manifestPath)
  for (const binding of manifest.bindings) check(binding)
  const reviewPath = path.join(firstRoot, 'modern-review.json')
  const review = json(reviewPath)
  assert.equal(review.status, 'pass')
  assert.equal(review.lesson, lesson)
  assert.equal(review.completeComparisonCount, 33)
  assert.equal(review.newScopedHolds.length, 0)
  assert.ok(review.punctuationDispositions.every(item => item.blocksModernTextContract === false))
  for (const binding of review.bindings) check(binding)
  assert.ok(!fs.existsSync(snapshot))
  fs.mkdirSync(path.join(snapshot, 'before'), { recursive: true })
  const originals = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'].map(name => {
    const original = bind(path.join(work, name))
    const before = path.join(snapshot, 'before', name)
    fs.copyFileSync(original.path, before, fs.constants.COPYFILE_EXCL)
    check({ path: before, sha256: original.sha256 })
    return { original, before: bind(before) }
  })
  const normalizedBindings = manifest.bindings.map(binding => {
    const old = originals.find(item => item.original.path === binding.path)
    return old ? { ...old.before, historicalPath: binding.path } : binding
  })
  save(modernAdmissionPath, {
    status: 'pass-for-modern-text-only', lesson, review: bind(reviewPath),
    candidates: manifest.candidates, originals, normalizedBindings,
    originalReviewBindingsPreserved: true, originalAuthorFlagsUnchanged: true,
    punctuationDispositions: review.punctuationDispositions,
    exact49GlyphUnknownPreserved: true, allInkHoldsPreserved: true,
    published: false, wholeLessonApproved: false, historyReset: false,
  })
  console.log(JSON.stringify({ output: modernAdmissionPath, bindings: normalizedBindings.length }))
} else if (action === 'admit-figures') {
  const groups = { '1617': [16, 17], '1819': [18, 19], '2021': [20, 21], '22': [22] }
  assert.ok(groups[selector])
  const manifestPath = path.join(tmp, `n47-fig${selector}-review-inputs-01/manifest.json`)
  const manifest = json(manifestPath)
  const modern = json(modernAdmissionPath)
  check(modern.review)
  const resolve = binding => {
    const old = modern.originals.find(item => item.original.path === binding.path)
    if (old) {
      assert.equal(old.original.sha256, binding.sha256)
      return old.before
    }
    return binding
  }
  for (const binding of manifest.bindings) check(resolve(binding))
  const reviewPath = path.resolve(reviewArg)
  safe(reviewPath)
  assert.ok(reviewPath.startsWith(tmp + path.sep))
  const review = json(reviewPath)
  assert.equal(review.status, 'pass')
  const expected = groups[selector].map(id => `fig-g10-${id}`)
  const selected = review.figs.filter(item => expected.includes(item.id))
  assert.deepEqual(selected.map(item => item.id), expected)
  for (const figure of selected) {
    assert.equal(figure.status, 'pass')
    for (const field of ['source', 'spec', 'svg', 'render', 'preview', 'nativeReview', 'sourceInventory'])
      check(figure[field])
    for (const binding of figure.previews) check(binding)
    const native = json(figure.nativeReview.path)
    assert.equal(native.status, 'pass')
    assert.equal(native.spec.sha256, figure.spec.sha256)
    assert.equal(native.outputs.svg.sha256, figure.svg.sha256)
    assert.equal(json(figure.render.path).status, 'pass')
  }
  const output = path.join(tmp, `n47-fig${selector}-admission-01.json`)
  save(output, {
    status: 'pass-for-listed-figures-only', lesson, batch: `fig${selector}`,
    review: bind(reviewPath), reviewMarkdown: path.join(path.dirname(reviewPath), 'report.md'),
    figures: selected, originalReviewBindingsPreserved: true,
    normalizedBindings: manifest.bindings.map(resolve),
    wholeLessonApproved: false, contentRepairsReset: false,
  })
  console.log(JSON.stringify({ output, figures: selected.length }))
} else if (action === 'apply-text') {
  const admission = json(modernAdmissionPath)
  assert.equal(admission.status, 'pass-for-modern-text-only')
  check(admission.review)
  for (const binding of admission.normalizedBindings) check(binding)
  const textOriginals = admission.originals.filter(item => !item.original.path.endsWith('figures.template.json'))
  for (const item of textOriginals) check(item.original)
  const transitions = textOriginals.map(item => {
    const expected = path.basename(item.original.path).replace('.template.json', '.json')
    const candidate = admission.candidates.find(binding => path.basename(binding.path) === expected)
    assert.ok(candidate, expected)
    check(candidate)
    return { before: item.before, original: item.original, reviewedCandidate: candidate }
  })
  const files = [modernAdmissionPath, path.join(tmp, 'admit-n47-modern-figures-01.mjs'),
    ...inventory(path.join(tmp, 'n47-modern-text-author')),
    path.join(tmp, 'n47-modern-text-review-inputs-01/manifest.json'),
    path.join(tmp, 'n47-text-fig1617-n46-choice-review-inputs-01/manifest.json'),
    ...inventory(firstRoot), ...admission.originals.map(item => item.before.path)]
  const output = path.join(core, 'evidence/stemrobin188-g10-n47/modern-text')
  const bindings = retain(output, files, {
    status: 'pass-for-modern-text-only', lesson, published: false, wholeLessonApproved: false,
    originalBeforeBindingsPreserved: true, originalAuthorFlagsUnchanged: true,
    originalFailuresAndHoldsPreserved: true, transitions,
  })
  for (const item of transitions) {
    fs.copyFileSync(item.reviewedCandidate.path, item.original.path)
    check({ path: item.original.path, sha256: item.reviewedCandidate.sha256 })
  }
  save(path.join(snapshot, 'transition.json'), {
    status: 'pass', lesson, transitions,
    figureTemplateModifiedByThisStage: false, rawSourceModified: false,
    originalCandidateBytesUnchanged: true, historicalFailuresAndHoldsPreserved: true,
  })
  console.log(JSON.stringify({ output, templates: transitions.length, bindings: bindings.length }))
} else if (action === 'retain-figure-evidence') {
  assert.ok(['1617', '1819', '2021', '22'].includes(selector))
  const admissionPath = path.join(tmp, `n47-fig${selector}-admission-01.json`)
  const admission = json(admissionPath)
  check(admission.review)
  for (const binding of admission.normalizedBindings) check(binding)
  const promotion = path.join(core, `evidence/stemrobin188-g10-n47/fig${selector}/promotion-bindings.json`)
  assert.deepEqual(json(promotion).figures, admission.figures.map(item => item.id))
  const files = [admissionPath, path.join(tmp, `n47-fig${selector}-review-inputs-01/manifest.json`),
    ...inventory(path.join(tmp, `n47-fig${selector}-author`)),
    ...inventory(path.dirname(admission.review.path)),
    ...inventory(path.join(tmp, `promotion-${lesson}-fig${selector}`)),
    path.join(tmp, 'admit-n47-modern-figures-01.mjs')]
  if (selector === '1819') files.push(
    ...inventory(path.join(tmp, 'n47-fig1819-review-01')),
    ...inventory(path.join(tmp, 'n47-fig18-repair-01')),
    path.join(tmp, 'repair-n47-fig18-01.mjs'),
    path.join(tmp, 'display-n47-fig18-repair-01.mjs'),
    path.join(tmp, 'n47-fig18-22-n48-text-review-inputs-01/manifest.json'),
    ...inventory(path.dirname(json(admission.review.path).independentAffectedReview.path)),
    path.join(tmp, 'resolve-n47-figure-pair-02.mjs'),
  )
  if (selector === '2021') files.push(
    ...inventory(path.join(tmp, 'n47-fig2021-review-01')),
    ...inventory(path.join(tmp, 'n47-fig20-assertion-repair-01')),
    path.join(tmp, 'repair-n47-fig20-assertions-01.mjs'),
    path.join(tmp, 'n47-fig20-source181182-review-inputs-02/manifest.json'),
    ...inventory(path.dirname(json(admission.review.path).independentAffectedReview.path)),
    path.join(tmp, 'resolve-n47-figure-pair-02.mjs'),
  )
  const output = path.join(core, `evidence/stemrobin188-g10-n47/fig${selector}/attempts`)
  const bindings = retain(output, files, {
    status: 'pass-for-listed-figures-only', lesson,
    figures: admission.figures.map(item => item.id),
    originalAuthorFailuresAndFIRSTPreserved: true, countersReset: false,
    originalSourceGlyphAndAllInkHoldsPreserved: true, wholeLessonApproved: false, published: false,
    rendererRepeated: false, promotionMetadataOnly: true,
  })
  console.log(JSON.stringify({ output, bindings: bindings.length }))
} else {
  throw new Error('Use admit-modern, admit-figures, apply-text or retain-figure-evidence')
}
