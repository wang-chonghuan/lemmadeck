import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const base = path.join(tmp, 'g10-n47')
const lesson = 'geo910-c2-s2-n47'
const output = path.join(core, 'evidence/stemrobin188-g10-n47/source')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const unsafe = file => file.split(path.sep).some(part =>
  ['.env', '.git', 'node_modules', '.venv', '__pycache__'].includes(part))
  || /\.(pdf|pyc|pem|key)$/i.test(file)
const inventory = (directory, reuseOnly = false) => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  if (reuseOnly && (entry.isSymbolicLink() || unsafe(file))) return []
  assert.ok(!entry.isSymbolicLink() && !unsafe(file), file)
  return entry.isDirectory() ? inventory(file, reuseOnly) : [file]
})
const admissionPath = path.join(tmp, 'n47-source-admission-01.json')
const admission = json(admissionPath)
assert.equal(admission.status, 'pass-for-readable-n47-source-only')
assert.equal(admission.localHoldsPreserved, true)
assert.equal(admission.source167168ReviewCardApproved, false)
for (const binding of admission.bindings) assert.equal(hash(binding.path), binding.sha256, binding.path)
const sourceBindings = json(path.join(base, 'source-bindings.json'))
for (const binding of sourceBindings) assert.equal(hash(binding.from), binding.sha256, binding.from)
const stages = ['assemble-source-01', 'vectorize-source-01', 'assemble-source-02',
  'import-source', 'adapt-prepare-isolated-01']
for (const stage of stages.filter(stage => stage !== 'import-source'))
  assert.equal(json(path.join(base, stage, 'command.json')).exitCode, 0)
const sourceBook = json(path.join(base, 'artifacts/9-10g/book.json'))
assert.deepEqual(sourceBook.audit.errors, [])
assert.equal(sourceBook.lessons.length, 1)
assert.equal(sourceBook.lessons[0].id, lesson)
assert.equal(sourceBook.lessons[0].exercises, 6)
assert.equal(sourceBook.lessons[0].figures, 7)
const firstPrior = json(admission.inheritedReviews[0].path).FIRSTInventories
  .filter(item => item.page === 169).map(item => item.path)
const firstNew = json(admission.inheritedReviews[1].path).immutableFIRST.map(item => item.path)
const files = [...new Set([
  admissionPath, ...admission.bindings.map(binding => binding.path),
  ...sourceBindings.map(binding => binding.from),
  ...['source-bindings.json', 'source-admission.json'].map(name => path.join(base, name)),
  ...stages.flatMap(directory => inventory(path.join(base, directory))),
  ...inventory(path.join(base, 'artifacts/9-10g')).filter(file => !file.includes('/editions/')),
  ...firstPrior, ...firstNew,
  path.join(tmp, 'n41-choice-source167169-review-01/FIRST-fig16-17-crop-inventory.json'),
  ...['source-affected-FIRST.json', 'counters.json', 'bindings-before.json', 'bindings-after.json']
    .map(name => path.join(tmp, 'n46-answer-choice-display-source-review-01', name)),
  ...['p0170-held-locus.png', 'p0172-held-locus.png', 'source-held-loci.json']
    .map(name => path.join(tmp, 'n46-display-convention-source-review-inputs-01', name)),
  ...['g10-n47.mjs', 'assemble-n47.py', 'admit-n47-source-01.mjs', 'retain-n47-source.mjs']
    .map(name => path.join(tmp, name)),
])]
for (const file of files) {
  assert.ok(file.startsWith(tmp + path.sep), file)
  assert.ok(!unsafe(file) && fs.realpathSync(file) === file && fs.statSync(file).isFile(), file)
}
assert.ok(!fs.existsSync(output))
const existing = new Map(inventory(core, true).map(file => [hash(file), file]))
fs.mkdirSync(output, { recursive: true })
const bindings = files.map(from => {
  const sha256 = hash(from)
  const reused = existing.has(sha256)
  const to = reused ? existing.get(sha256) : path.join(output, 'files', path.relative(tmp, from))
  if (!reused) {
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    existing.set(sha256, to)
  }
  assert.equal(hash(to), sha256)
  return { from, retained: path.relative(core, to), sha256, reused }
})
fs.writeFileSync(path.join(output, 'bindings.json'), JSON.stringify({
  schema: 'stemrobin188-n47-source-evidence@1', book: '9-10g', lesson,
  status: 'complete-reviewed-readable-n47-source-only',
  startIncluded: 'p0169#1', rightBoundaryExcluded: 'p0172#12',
  sourcePages: [169, 170, 171, 172], exercises: 6, originalFigures: 7,
  originalSourceReviewReviseAndFIRSTPreserved: true, sourceBodyRepairs: 0,
  localHoldsPreserved: true, exact49GlyphUnknownPreserved: true,
  lexical170HoldSettledByIndependentPixelsOnly: true,
  source167168ReviewCardApproved: false, N48Approved: false,
  wholePagesAllInkApproved: false, modernApproved: false,
  answersAndChoicesApproved: false, published: false,
  noPdfRuntimeOrEarlierPackageCopied: true, bindings,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  output, bindings: bindings.length,
  copied: bindings.filter(item => !item.reused).length,
  reused: bindings.filter(item => item.reused).length,
}))
