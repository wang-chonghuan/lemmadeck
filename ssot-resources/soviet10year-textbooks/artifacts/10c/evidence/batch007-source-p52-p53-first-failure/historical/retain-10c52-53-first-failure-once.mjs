import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const E = path.join(T, 'source-10c-p52-p53-author-20261116T1240Z')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c')
const destination = path.join(base, 'evidence/batch007-source-p52-p53-first-failure')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const fixed = {
  [path.join(E, 'full-report.md')]: '3f4d837d91bdc318dee3d5bf82d859564d669a007ae073dfb97897fb0b02f71b',
  [path.join(E, 'full-manifest.json')]: '097a968104a47210ae5754f3b1a36512a19ccd51ce48c09b499263a5d0adcfb9',
  [path.join(E, 'raw-hashes.json')]: 'c26838eac136fdd2ac4a43230bf2c943621eeddd56a3648b86a57036ce75fe43',
  [path.join(T, 'source-10c-p52-p53-independent-source-first.md')]: '93d227274265f814a9f73b17225a68e9d6d9a834a34c2f8b6649d06c04fb655a',
  [path.join(T, 'source-10c-p52-p53-independent-review.md')]: 'f5664a5e90fb2c242241fee03237d77542ba80baf1c8742faa8ab26b19fc4121',
}
assert.equal(process.cwd(), root)
assert(!fs.existsSync(destination), 'First retention only')
for (const [file, sha] of Object.entries(fixed)) assert.equal(hash(file), sha, file)
const manifest = JSON.parse(fs.readFileSync(path.join(E, 'full-manifest.json'), 'utf8'))
const index = JSON.parse(fs.readFileSync(path.join(E, 'raw-hashes.json'), 'utf8'))
assert.equal(index.files.length, 185)
assert.equal(manifest.current_files.length, 18)
assert.equal(manifest.first_actual_finalize_failure.page, 53)
assert.equal(manifest.first_actual_finalize_failure.exit_code, 1)
const plans = new Map()
const add = (source, retainedRelativePath, expected) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink(), source)
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  const existing = plans.get(source)
  if (existing) return assert.equal(existing.retainedRelativePath, retainedRelativePath)
  plans.set(source, { sourcePathProvenanceOnly: source, retainedRelativePath, sha256, bytes: stat.size })
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  assert(!item.isSymbolicLink(), 'No archival symlinks')
  const file = path.join(dir, item.name)
  return item.isDirectory() ? walk(file) : [file]
})
for (const item of index.files) {
  const relative = path.relative(E, item.path)
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative))
  assert.equal(fs.statSync(item.path).size, item.bytes)
  add(item.path, `historical/author/${relative}`, item.sha256)
}
add(path.join(E, 'raw-hashes.json'), 'historical/author/raw-hashes.json', fixed[path.join(E, 'raw-hashes.json')])
for (const file of Object.keys(fixed).filter(file => !file.startsWith(`${E}/`))) {
  add(file, `historical/${path.basename(file)}`, fixed[file])
}
for (const item of manifest.current_files) {
  const relative = path.relative(root, item.path)
  assert(relative && !relative.startsWith('..') && !path.isAbsolute(relative))
  add(item.path, `inputs/current/${relative}`, item.sha256)
}
for (const file of walk(path.join(T, 'prepare-10c-p52-p53-first'))) {
  add(file, `historical/${path.relative(T, file)}`)
}
add(path.join(T, 'prepare-10c-p52-p53-first.mjs'), 'historical/prepare-10c-p52-p53-first.mjs')
add(fileURLToPath(import.meta.url), 'historical/retain-10c52-53-first-failure-once.mjs')
add(path.join(base, 'book.json'), 'inputs/book-before-append.json')
fs.mkdirSync(destination)
for (const item of plans.values()) {
  const target = path.join(destination, item.retainedRelativePath)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(item.sourcePathProvenanceOnly, target, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(target), item.sha256)
  assert.equal(hash(item.sourcePathProvenanceOnly), item.sha256)
  fs.chmodSync(target, 0o444)
}
const retention = {
  status: 'SOURCE_FIRST_FAILURE_NOT_ACCEPTED', role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY',
  ticket: 'STEMROBIN-184', book: '10c', physicalPages: [52, 53],
  recordedOutcome: {
    page52: 'First finalize exit0;9/9 rows;3 source images',
    page53: 'First finalize exit1;19 printed/20 body rows;1 source image',
    independentStageB: 'NOT_ACCEPTED_STOP; exact operator gap discrepancy remains',
    causeOfCountFailure: 'UNKNOWN_BEFORE_DIAGNOSIS',
  },
  limitations: [
    'Eight source arc cos occurrences are collapsed to arccos; no repair performed in this checkpoint.',
    'Bottom displacement accent is independently confirmed bar; first-paragraph accents remain limited UNKNOWN.',
    'First computation relation independently confirmed equals; caption is a separate source row.',
    'All endpoint-marker/emphasis/glyph limits and unseen unit86 right boundary remain.',
    'Historical declarations and failures retained unchanged, not recertified or promoted.',
  ],
  runtimeDependencies: [], provenancePolicy: 'All absolute scratch paths are PROVENANCE_ONLY; use retainedRelativePath and raw SHA-256.',
  operations: {
    invokedOnce: true, exactByteCopies: true, newImageLoads: 0, newReviews: 0,
    counter: false, finalize: false, sourceEdits: false, retries: false, assembly: false,
    formalAnswers: 0, choices: 0, Git: false, database: false, production: false,
  },
  counts: { copiedFiles: plans.size, copiedBytes: [...plans.values()].reduce((sum, item) => sum + item.bytes, 0) },
  files: [...plans.values()],
}
const output = path.join(destination, 'retention.json')
fs.writeFileSync(output, `${JSON.stringify(retention, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ ...retention.counts, totalFiles: plans.size + 1, retentionPath: output, sha256: hash(output) }, null, 2))
