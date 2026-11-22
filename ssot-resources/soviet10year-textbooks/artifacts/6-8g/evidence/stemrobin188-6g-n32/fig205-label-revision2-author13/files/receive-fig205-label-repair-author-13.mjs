import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const root = path.join(tmp, 'n32-fig205-B-label-repair-author-13')
const manifestFile = path.join(root, 'manifest.json')
assert.equal(hash(manifestFile), '8b1210f97eea20ef78260a59f92b53ffe8ad6c896239333663db545f253348a6')
const manifest = read(manifestFile)
assert.deepEqual(manifest.activeExecSessions, [])
assert.equal(hash(manifest.report.path), '16674ba9c641071443e30988436bd63d4a5fdfc415aa9024601e6510431abc84')
const report = read(manifest.report.path)
assert.equal(report.revisions.cumulativeContentRevisions, 2)
assert.equal(report.images.chargedAttempts, 4)
assert.equal(report.actualNativeStatuses.validator.exitCode, 0)
assert.equal(report.actualNativeStatuses.renderer.exitCode, 0)
assert.deepEqual(report.actualNativeStatuses.renderer.collisions, [])
assert.equal(report.labelOnlyDiff.pointer, '/objects/5/labelPlacement/offset/1')
const references = [
  bind(manifestFile), ...manifest.artifacts, ...manifest.originalEvidenceReferences,
  report.authority.source, report.authority.context, ...report.authority.contextBindings,
]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
assert.equal(fs.statSync(report.sourceFirst.inventory.path).mode & 0o777, 0o444)
for (const receipt of report.execution.receipts)
  assert.equal(read(receipt.path).exitCode, 0)
const own = path.join(tmp, 'receive-fig205-label-repair-author-13')
fs.mkdirSync(own)
const record = {
  status: 'AUTHOR205_LABEL_REVISION2_RETAINED_INDEPENDENT_REVIEW_PENDING',
  report: manifest.report, finalBindings: report.finalBindings,
  labelOnlyDiff: report.labelOnlyDiff, revisions: report.revisions,
  nativeStatuses: report.actualNativeStatuses, imageLedger: report.images,
  sourceFirst: report.sourceFirst, historicalFailuresAndCountersPreserved: true,
  contextGeometryAndOtherLabelsUnchanged: true,
  noReviewAt1OrPromotion: true, noProducerReplays: true,
  parentImageLoads: 0, wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-fig205-label-repair-author-13.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/fig205-label-revision2-author13',
  references,
  ['evidence/stemrobin188-6g-n32/figures204206-author-first10/retention.json'],
  record,
)))
