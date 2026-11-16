import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c')
const destination = path.join(base, 'evidence/batch007-source-p53-affected-repair')
assert(!fs.existsSync(destination), 'First affected retention only')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = new Map()
const add = (source, relative, expected) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink())
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  assert(!files.has(source), 'Unique source mapping')
  files.set(source, { sourcePathProvenanceOnly: source, retainedRelativePath: relative, bytes: stat.size, sha256 })
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  assert(!item.isSymbolicLink())
  const file = path.join(dir, item.name)
  return item.isDirectory() ? walk(file) : [file]
})
for (const name of ['source-10c-p53-row-diagnostic', 'source-10c-p53-row-core-guard', 'source-10c-p53-affected-finalize'])
  for (const file of walk(path.join(T, name))) add(file, `historical/${path.relative(T, file)}`)
for (const name of ['diagnose-10c53-row-collapse-once.py', 'count-10c53-after-core-guard-once.py',
  'finalize-10c53-affected-once.mjs', 'test-fraction-core-guard-focused-once.mjs',
  'verify-fraction-caption-overlap-repair-once.py'])
  add(path.join(T, name), `historical/${name}`)
add(path.join(T, 'source-10c-p53-affected-review.md'), 'historical/source-10c-p53-affected-review.md',
  'f97cecee5fb123b8645c05ecf85b22bbed05da35a9e3e6e6681031f1344e0172')
add(path.join(root, '.claude/skills/ld-s10y-lesson/tools/layout.py'), 'inputs/final-layout.py',
  '734e2e31b457009fe1454964bd874776b65127b2ac6b7941bf31476b6cf07479')
add(path.join(root, '.claude/skills/ld-s10y-lesson/tests/test_fraction_caption_rows.py'),
  'inputs/test_fraction_caption_rows.py', '5fdbf0e0c2215e3248be5311caa86f45207d2936e7543dd815d013088af6786c')
for (const id of ['0052', '0053'])
  for (const name of ['page.md', 'page.json', 'audit.json'])
    add(path.join(base, 'pages', id, name), `inputs/pages/${id}/${name}`)
add(fileURLToPath(import.meta.url), 'historical/retain-10c53-affected-repair-once.mjs')
const originalRetention = path.join(base, 'evidence/batch007-source-p52-p53-first-failure/retention.json')
const originalHash = hash(originalRetention)
fs.mkdirSync(destination)
for (const item of files.values()) {
  const output = path.join(destination, item.retainedRelativePath)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(item.sourcePathProvenanceOnly, output, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(output), item.sha256)
  assert.equal(hash(item.sourcePathProvenanceOnly), item.sha256)
  fs.chmodSync(output, 0o444)
}
const result = {
  role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY', status: 'LIMITED_R1_R2_RESOLVED_NOT_COMPLETE_UNIT',
  ticket: 'STEMROBIN-184', book: '10c', physicalPages: [53],
  originalFailure: { retainedRelativePath: '../batch007-source-p52-p53-first-failure/retention.json', sha256: originalHash },
  history: [
    'Original first finalize53exit1/19vs20 and original StageB STOP remain unchanged.',
    'Intermediate central-core guard4newtestsPASS/count20vs20/one affectedfinalize0 preserved.',
    'Focused compatibility33tests/1FAIL/4unavailable-source-fixtureSKIP remains failure.',
    'Final compact full-glyph overlap preserves tall core rule;failed valid staggered caption plus five cases6PASS/count20vs20;no second finalize.',
    'Final affected addendum R1/R2 RESOLVED only;exact eight token change preserved.',
  ],
  limits: 'No final33-test full compatibility pass certified;all source UNKNOWNs/unseen unit86 remain. All absolute scratch paths are PROVENANCE_ONLY.',
  runtimeDependencies: [],
  operations: { invokedOnce: true, newImageLoads: 0, newReviews: 0, counter: false,
    finalize: false, sourceEdits: false, retries: false, assembly: false,
    formalAnswers: 0, choices: 0, git: false, database: false, production: false },
  counts: { copiedFiles: files.size, copiedBytes: [...files.values()].reduce((sum, item) => sum + item.bytes, 0) },
  files: [...files.values()],
}
assert.equal(hash(originalRetention), originalHash)
const output = path.join(destination, 'retention.json')
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ ...result.counts, totalFiles: files.size + 1, retentionPath: output, sha256: hash(output) }))
