import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const T = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp')
const E = path.join(T, 'source-6g-p72-p73-emphasis-affected')
const base = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence')
const destination = path.join(base, 'batch007-source-p72-p73-emphasis-affected')
assert(!fs.existsSync(destination), 'First affected retention only')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = []
const add = (source, relative, expected) => {
  const stat = fs.lstatSync(source)
  assert(stat.isFile() && !stat.isSymbolicLink())
  const sha256 = hash(source)
  if (expected) assert.equal(sha256, expected, source)
  files.push({ sourcePathProvenanceOnly: source, retainedRelativePath: relative, sha256, bytes: stat.size })
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  assert(!item.isSymbolicLink())
  const file = path.join(dir, item.name)
  return item.isDirectory() ? walk(file) : [file]
})
for (const file of walk(E)) add(file, `historical/affected/${path.relative(E, file)}`)
add(path.join(T, 'source-6g-p72-p73-emphasis-affected-review.md'),
  'historical/source-6g-p72-p73-emphasis-affected-review.md',
  '7c3274011112651aeb987b330bd78e4fd3d0aafcd4b8563673b78754db22d931')
add(path.join(T, 'finalize-6g72-73-emphasis-affected-once.mjs'), 'historical/finalize-6g72-73-emphasis-affected-once.mjs')
add(fileURLToPath(import.meta.url), 'historical/retain-6g72-73-emphasis-affected-once.mjs')
const original = path.join(base, 'batch007-source-p72-p73-first-hold/retention.json')
const originalHash = hash(original)
assert.equal(originalHash, '633454dbf8029017de8566ceefb31b2387b38ea9f1bd4799cd2e95f59c0808f6')
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
  role: 'MECHANICAL_EXACT_BYTE_RETENTION_ONLY', status: 'R03_METADATA_RESOLVED_SOURCE_STILL_HOLD',
  ticket: 'STEMROBIN-184', book: '6-8g', physicalPages: [72, 73],
  originalHold: { retainedRelativePath: '../batch007-source-p72-p73-first-hold/retention.json', sha256: originalHash },
  disposition: 'R03 onlyfiveconfirmednumericprefixspansRESOLVED;R01过/着,R02period/colonUNRESOLVED;187/unit15OPEN/allotheremphasisandglyphlimitsUNKNOWN. No renderedstyle/globalPASS/promotion.',
  preservation: 'Bodies/blocks/audits/raw/grid/layout/templates/crops/originalreports unchanged;30legitimatecrosspagewarnings retained;firstaffectedfinalize eachonce0/18,25.',
  runtimeDependencies: [], provenancePolicy: 'Absolute source paths are PROVENANCE_ONLY; use retainedRelativePath and SHA256.',
  operations: { invokedOnce: true, newImageLoads: 0, newReviews: 0, counter: false,
    finalize: false, sourceEdits: false, retries: false, assembly: false,
    formalAnswers: 0, choices: 0, git: false, database: false, production: false },
  counts: { copiedFiles: files.length, copiedBytes: files.reduce((sum, item) => sum + item.bytes, 0) },
  files,
}
assert.equal(hash(original), originalHash)
const output = path.join(destination, 'retention.json')
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
console.log(JSON.stringify({ ...result.counts, totalFiles: files.length + 1, retentionPath: output, sha256: hash(output) }))
