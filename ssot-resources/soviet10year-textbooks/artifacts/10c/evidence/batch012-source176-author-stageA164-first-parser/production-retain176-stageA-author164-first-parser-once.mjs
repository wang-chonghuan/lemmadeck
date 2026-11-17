import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source176-author-stageA164-first-parser'
const author = `${ticket}/production-source10c176-179-author`
const review = `${ticket}/production-source10c176-179-review`
const parser = `${ticket}/production-114-heading-parser`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
assert(!fs.existsSync(output), 'Retain once; do not replace historical evidence')
assert.equal(hash(fs.readFileSync(`${author}/frozen.json`)), '9859a492893386ed4dd7f04128822c77c3ed1f346daea4e1103e805e0a1ab6d4')
assert.equal(hash(fs.readFileSync(`${author}/bindings.json`)), 'f79c2284052c0f8765c6c783e83d239a57709c3fe991eb47cc620ebf18459212')
const bindings = read(`${author}/bindings.json`)
for (const item of [...bindings.input_bindings, ...bindings.output_bindings]) {
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes, item.path)
  assert.equal(hash(bytes), item.sha256, item.path)
}
assert.equal(hash(fs.readFileSync(`${review}/freeze-receipt.json`)), 'bf84b30ced57b99e9c2b59e5c3bfae22d18af453ae68d35ea68ca5bf32e1e332')
assert.equal(hash(fs.readFileSync(`${review}/SHA256SUMS`)), '131fa67f66b5a6f66c28e52bf4e9e74f8775e78fc6438b9040e2113a8c35156b')
const reviewerInputs = read(`${review}/freeze-inputs.json`).inputs
for (const item of reviewerInputs) {
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
const reviewerOutputs = read(`${review}/output-hashes.json`).files
for (const item of reviewerOutputs) {
  const bytes = fs.readFileSync(`${review}/${item.name}`)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
const sums = fs.readFileSync(`${review}/SHA256SUMS`, 'utf8').trim().split('\n')
for (const line of sums) {
  const match = /^([0-9a-f]{64})  (.+)$/.exec(line)
  assert(match, line)
  assert.equal(hash(fs.readFileSync(`${review}/${match[2]}`)), match[1])
}
assert.equal(hash(fs.readFileSync(`${parser}/freeze.json`)), 'e70c830fda6095ddd1161c96077b70221947d889d9bff6e1f48965216268d7b7')
const parserBindings = read(`${parser}/freeze.json`).files
for (const [name, sha256] of Object.entries(parserBindings)) {
  assert.equal(hash(fs.readFileSync(`${parser}/${name}`)), sha256, name)
}
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink(), from)
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)), from)
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${to}/${name}`)
  } else {
    assert(stat.isFile(), from)
    const bytes = fs.readFileSync(from)
    files.push({ source: from, retained: to, bytes: bytes.length, sha256: hash(bytes) })
  }
}
collect(author, `${output}/author176`)
collect(review, `${output}/stageA176`)
collect(parser, `${output}/parser114`)
collect(`${ticket}/production-source10c164-165-first-finalize`, `${output}/first164165`)
collect(`${ticket}/production-finalize10c164-165-first-once.mjs`, `${output}/production-finalize10c164-165-first-once.mjs`)
collect('.claude/skills/ld-s10y-lesson/tools/assemble.py', `${output}/assemble.after.py.txt`)
for (const item of read(`${author}/frozen.json`).pages) {
  collect(item.markdown.path, `${output}/author176-page-snapshots/${String(item.page).padStart(4, '0')}.md`)
}
collect(`${ticket}/production-retain176-stageA-author164-first-parser-once.mjs`,
  `${output}/production-retain176-stageA-author164-first-parser-once.mjs`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  copied: files,
  totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  authorMatchedOnce: { inputs: bindings.input_bindings.length, outputs: bindings.output_bindings.length },
  reviewerMatchedOnce: { inputs: reviewerInputs.length, outputs: reviewerOutputs.length, sums: sums.length },
  parserMatchedOnce: Object.keys(parserBindings).length,
  exclusions: [],
  consumption: '176 author full four MD f13bb7, handoff a6ab2a, programs b6a229, bindings8a40e9 inherited; full176/top4aa98d. Earlier178projectionceada3 and command0408af truncations not claimed full; pages177/178/179 complete3bec9f/691517/614bc6, missing preload streams77fe18/5ef4d1/7d5eed, all nine actual vectors060fbf now complete. Freeze/seal stdout equality inherited. Reviewer full report/inventories/scope/ledger/commands/streams513718/d5d534/0e8556/429eaf/b1e4f6 inherited. 164165 first5f1c59/all semantic consumption1b4fb1 inherited, never rerun. Parser full five scripts/diff e2dbf2/7e4c58, readme244384, resultf54425, all actual commands and focused distinct-case stream projection77e43c and failedstderr4f19eb consumed without executing tests.',
  qualification: 'Parent zero image opens; permanently24/24. Hubble author6/24. Locke StageA frozen ledger8/24 and8/8 conservatively preserved despite anomalous entry4 plus four new originals; only zero-image unique StageB may follow. No new authority or accounting reset. Author727 remains UNKNOWN, reviewer3^x is competing observation not adjudication; names discrepancy retained. Frozen layout_hashes compares tool layout.py to page layout.json, different objects; additive qualification only, no change to frozen wording. Source171 literal two exp_a subscripts unchanged. Parser first focused exit1 synthetic final expectation failure preserved, 55 prior passing cases never rerun; only two NEW boundary cases exit0.',
  first164165: { helperExit: 1, page164: 'PASS21/21 forever', page165: 'FAIL25/24 unchanged; no diagnosis or retry yet', figure75: { box: [1001, 573, 451, 463], origin: 'UNKNOWN' } },
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  authorMatchedOnce: result.authorMatchedOnce, reviewerMatchedOnce: result.reviewerMatchedOnce,
  parserMatchedOnce: result.parserMatchedOnce, exclusions: [] }))
