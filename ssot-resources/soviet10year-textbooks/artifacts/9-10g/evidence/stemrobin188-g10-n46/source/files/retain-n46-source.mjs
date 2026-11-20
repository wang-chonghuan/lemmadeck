import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const base = path.join(tmp, 'g10-n46')
const lesson = 'geo910-c2-s1-n46'
const output = path.join(core, 'evidence/stemrobin188-g10-n46/source')
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
const admissionPath = path.join(tmp, 'n46-source-admission-identity-02.json')
const admission = json(admissionPath)
assert.equal(admission.status, 'pass-for-readable-n46-source-only')
assert.equal(admission.localHoldsPreserved, true)
assert.equal(admission.chapterReviewApproved, false)
assert.deepEqual(admission.cumulativeRepairCounts, { 165: 2, 166: 1 })
for (const binding of admission.bindings)
  assert.equal(hash(binding.path), binding.sha256, binding.path)
const sourceBindings = json(path.join(base, 'source-current-bindings.json'))
for (const binding of sourceBindings)
  assert.equal(hash(binding.from), binding.sha256, binding.from)
assert.equal(json(path.join(base, 'assemble-source-01/command.json')).exitCode, 1)
const stages = ['assemble-source-recovery-01', 'vectorize-source-01', 'assemble-source-02',
  'import-source-01', 'adapt-prepare-isolated-01', 'reindex-core-01']
for (const stage of stages.filter(stage => stage !== 'import-source-01'))
  assert.equal(json(path.join(base, stage, 'command.json')).exitCode, 0)
const sourceBook = json(path.join(base, 'artifacts/9-10g/book.json'))
assert.deepEqual(sourceBook.audit.errors, [])
assert.equal(sourceBook.lessons.length, 1)
assert.equal(sourceBook.lessons[0].id, lesson)
assert.equal(sourceBook.lessons[0].exercises, 6)
assert.equal(sourceBook.lessons[0].figures, 3)
const files = [...new Set([
  admissionPath, ...admission.bindings.map(binding => binding.path),
  ...sourceBindings.map(binding => binding.from),
  ...['source-bindings.json', 'source-current-bindings.json', 'source-admission.json',
    'source-current-admission.json'].map(name => path.join(base, name)),
  ...['assemble-source-01', ...stages, 'apply-reviewed-identity-repair-01']
    .flatMap(directory => inventory(path.join(base, directory))),
  ...inventory(path.join(base, 'artifacts/9-10g')).filter(file => !file.includes('/editions/')),
  ...inventory(path.join(tmp, 'n46-number36-identity-repair-01')),
  path.join(tmp, 'g10-n46.mjs'), path.join(tmp, 'assemble-n46.py'),
  path.join(tmp, 'admit-n46-source.mjs'), path.join(tmp, 'admit-n46-identity-repair-01.mjs'),
  path.join(tmp, 'snapshot-n46-failed-assembly.mjs'), path.join(tmp, 'retain-n46-source.mjs'),
])]
for (const file of files) {
  assert.ok(file.startsWith(tmp + path.sep), file)
  assert.ok(!unsafe(file) && fs.realpathSync(file) === file && fs.statSync(file).isFile(), file)
}
assert.ok(!fs.existsSync(output), 'Never repeat successful or replace partial retention')
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
  schema: 'stemrobin188-n46-source-evidence@1', book: '9-10g', lesson,
  status: 'complete-reviewed-readable-n46-source-only',
  startIncluded: 'p0163#5', rightBoundaryExcluded: 'p0166#2',
  sourcePages: [163, 164, 165, 166], exercises: 6, originalFigures: 3,
  originalFailedAssemblyPreserved: true, originalSourceReviewRevisePreserved: true,
  cumulativeSourceRepairs: admission.cumulativeRepairCounts,
  localHoldsPreserved: true, localHolds: admission.localHolds,
  chapterReviewApproved: false, wholePagesAllInkApproved: false,
  modernApproved: false, answersAndChoicesApproved: false, published: false,
  noPdfRuntimeOrEarlierPackageCopied: true, bindings,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({
  output, bindings: bindings.length,
  copied: bindings.filter(item => !item.reused).length,
  reused: bindings.filter(item => item.reused).length,
}))
