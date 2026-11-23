import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'receive-finished-source-and-n31-figures-10')
fs.mkdirSync(own)
const reviewRoot = path.join(tmp, 'source157158-independent-review-09')
const reviewFile = path.join(reviewRoot, 'report.json')
const reviewManifest = path.join(reviewRoot, 'manifest.json')
assert.equal(hash(reviewFile), '5d91ecdaf4aa775b49594a42273a46d245a0c81e44badf0ec33b49a7272ea8ea')
assert.equal(hash(reviewManifest), '663a95927d1de70c6f3a802f11d877dd6982d3cd0dcac08cf10a094f2ff49b04')
const review = read(reviewFile)
assert.equal(review.status, 'REVISE')
assert.equal(review.delivery.running_exec_sessions, 0)
assert.deepEqual(review.defects.map(item => item.id), ['D157-01', 'D158-01'])
assert.equal(fs.statSync(review.first_gate.path).mode & 0o777, 0o444)
const reviewRefs = [bind(reviewFile), bind(reviewManifest)]
for (const item of [...read(reviewManifest).owned_files, ...read(reviewManifest).external_bindings]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  reviewRefs.push(bind(item.path))
}
const sourceRecord = {
  status: 'SOURCE157158_REVISE_TWO_LITERAL_DEFECTS_RECEIVED',
  report: bind(reviewFile), defects: review.defects,
  unchangedPASS: ['26/25 rows', 'fig212 source crop and ownership', '441 B-then-A structure'],
  unit33Closure: 'UNKNOWN', firstAndFailuresPreserved: true,
  parentImageLoads: 0, producerReplays: 0, wholeLessonApproved: false,
}
const sourceRecordFile = path.join(own, 'source-record.json')
save(sourceRecordFile, sourceRecord)
reviewRefs.push(bind(sourceRecordFile), bind(path.join(tmp, 'receive-finished-source-and-n31-figures-10.mjs')))
const sourceRetention = retainCurrent6g('evidence/stemrobin188-6g-source157158/independent-review09',
  reviewRefs, ['evidence/stemrobin188-6g-source157158/author-first09/retention.json'], sourceRecord)
console.log(JSON.stringify({ sourceRetention }))

const figureRoot = path.join(tmp, 'n31-fig201203-author-first-09')
const figureManifestFile = path.join(figureRoot, 'figures.manifest.json')
const hashesFile = path.join(figureRoot, 'hashes.json')
assert.equal(hash(figureManifestFile), 'a6acb6c4c457c8d599ca2ee4cabb5976cd494cf1677d25eb0c37ac4858fb3cd6')
assert.equal(hash(hashesFile), '0389bca66998f6a05a0b563840c2addad26dbcbf2da59e127078c4f6e46248cd')
const manifest = read(figureManifestFile)
const refs = [bind(figureManifestFile), bind(hashesFile)]
const index = read(hashesFile)
assert.ok(Array.isArray(index.files))
for (const item of index.files) {
  assert.ok(item.path.startsWith(figureRoot + path.sep))
  assert.equal(hash(item.path), item.sha256, item.path)
  refs.push(bind(item.path))
}
for (const item of Object.values(manifest.authoritativeInputs)) {
  if (item?.path) {
    assert.equal(hash(item.path), item.sha256)
    refs.push(bind(item.path))
  }
}
assert.deepEqual(manifest.figures.map(item => item.disposition), ['HOLD', 'AUTHOR_ONLY', 'HOLD'])
for (const item of manifest.figures) {
  assert.equal(hash(item.source.path), item.source.sha256)
  refs.push(bind(item.source.path))
  assert.equal(fs.statSync(item.firstInventory.path).mode & 0o777, 0o444)
  assert.equal(item.candidateMapping.review, null)
  assert.equal(item.candidateMapping.promote, false)
}
const record = {
  status: 'N31_FIG201203_AUTHOR_ONLY_WITH_201203_HOLDS_RECEIVED',
  manifest: bind(figureManifestFile),
  figures: manifest.figures.map(({ id, disposition, reason, candidateMapping, currentExecution }) =>
    ({ id, disposition, reason, candidateMapping, currentExecution })),
  actualImageUsage: read(path.join(figureRoot, 'imageledger.json')),
  firstFailuresRepairsAndHoldsPreserved: true,
  independentApproval: false, modernAssetsPromoted: false, parentImageLoads: 0,
}
const recordFile = path.join(own, 'figure-record.json')
save(recordFile, record)
refs.push(bind(recordFile), bind(path.join(tmp, 'receive-finished-source-and-n31-figures-10.mjs')))
const figureRetention = retainCurrent6g('evidence/stemrobin188-6g-n31/figures-author-first09', refs,
  ['evidence/stemrobin188-6g-n31/text-layout-candidate09/retention.json'], record)
console.log(JSON.stringify({ figureRetention }))
