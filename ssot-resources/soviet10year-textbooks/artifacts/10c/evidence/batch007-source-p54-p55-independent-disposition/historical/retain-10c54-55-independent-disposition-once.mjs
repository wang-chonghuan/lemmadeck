import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence')
const destination = path.join(base, 'batch007-source-p54-p55-independent-disposition')
assert(!fs.existsSync(destination), 'First independent-disposition retention only')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const originals = [
  ['source-10c-p54-p55-independent-review.md', 'a2584f13da56a1b86dab4e00d92de195e4ac5e8ee7ff421994e9cadadea890e0'],
  ['source-10c-p54-p55-independent-review-p54-text.png', '20305d22602bc1a7c8db679dea6c77c67798c316c00b908034af21ca6d7ee4ab'],
  ['source-10c-p54-p55-independent-review-p55-text.png', '30ac1480874cdb656b31f34c8c4828dfc693f9b143ec4a33423062af599ebfd6'],
  ['source-10c-p55-margin-diagnostic/diagnostic.json'],
  ['diagnose-10c55-margin-bands-once.py'],
]
const files = originals.map(([relative, expected]) => {
  const source = path.join(T, relative)
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  return { sourcePathProvenanceOnly: source, retainedRelativePath: `historical/${relative}`, bytes: fs.statSync(source).size, sha256 }
})
const script = fileURLToPath(import.meta.url)
files.push({ sourcePathProvenanceOnly: script, retainedRelativePath: `historical/${path.basename(script)}`, bytes: fs.statSync(script).size, sha256: hash(script) })
const first = path.join(base, 'batch007-source-p54-p55-first-failure/retention.json')
const firstHash = hash(first)
assert.equal(firstHash, 'f18b9c00dc4e9a32d322b5dacb85962359e47df7a602de55f091142606c550fe')
fs.mkdirSync(destination)
for (const item of files) {
  const output = path.join(destination, item.retainedRelativePath)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(item.sourcePathProvenanceOnly, output, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(output), item.sha256)
  assert.equal(hash(item.sourcePathProvenanceOnly), item.sha256)
  fs.chmodSync(output, 0o444)
}
const result = {
  role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY', status: 'SOURCE_NOT_GLOBAL_PASS_MARGIN_ALLOCATION_PENDING',
  ticket: 'STEMROBIN-184', book: '10c', physicalPages: [54, 55],
  firstFailure: { retainedRelativePath: '../batch007-source-p54-p55-first-failure/retention.json', sha256: firstHash },
  disposition: 'UniqueStageB supportsauthorperiodsat54有解and55一次.而,9arc-cos spacingfactsrequireexplicitrepresentation;bothactualfiguresretainmeaningfulobjects/gaps.55first17vs15FAILunchanged.',
  diagnostic: 'Read-onlycurrentcount17vs15;twoextrabands0..18and2479..2511;noexcludedpixels/countoverride/sourceedit/retry. MarginphysicalcauseUNKNOWN;affectedallocationclarificationpending.',
  runtimeDependencies: [], provenancePolicy: 'Absolute source paths are PROVENANCE_ONLY; use retainedRelativePath and SHA256.',
  operations: { invokedOnce: true, newImageLoads: 0, newReviews: 0, counter: false,
    finalize: false, sourceEdits: false, retries: false, assembly: false,
    formalAnswers: 0, choices: 0, git: false, database: false, production: false },
  counts: { copiedFiles: files.length, copiedBytes: files.reduce((sum, item) => sum + item.bytes, 0) },
  files,
}
assert.equal(hash(first), firstHash)
const output = path.join(destination, 'retention.json')
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ ...result.counts, totalFiles: files.length + 1, retentionPath: output, sha256: hash(output) }))
