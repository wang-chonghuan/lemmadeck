import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const manifestFile = path.join(tmp, 'n32-206-revision2-affected-review-15/manifest.json')
assert.equal(hash(manifestFile), '92c0f1cd9b4934cede77ff354a19076bdba396ca23e1e542bcf6d105f53fb954')
const manifest = read(manifestFile)
assert.equal(manifest.status, 'PASS_SCOPED_R2_ANNOTATION_TRUE_CONCLUSION_FRAMING_NATIVE_ACTUAL300358')
assert.deepEqual(manifest.activeExecSessions, [])
assert.deepEqual(manifest.findings, [])
assert.equal(manifest.chargedImageLedger.charged, 3)
assert.equal(manifest.currentNamedBindings.contentRevision, 2)
const report = manifest.outputs.find(item => item.name === 'substantive-review-report')
assert.equal(report.sha256, '6ef32114038b52fc961ea1c06b994f1ec04c814c3c54fd955bf3695ac05783b1')
const references = [bind(manifestFile), manifest.input, ...manifest.outputs,
  ...Object.values(manifest.currentNamedBindings).filter(item => item?.path),
  ...manifest.reusedSourceAndAuthority, ...manifest.authorEvidence,
  ...manifest.executionReceiptBindings, ...manifest.oldFailureBindingsPreserved,
  ...manifest.historicalLedgers, ...manifest.contractsReadOnly]
for (const item of references) {
  assert.equal(hash(item.path), item.sha256, item.path)
  if (item.mode === '0444')
    assert.equal(fs.statSync(item.path).mode & 0o777, 0o444, item.path)
}
const own = path.join(tmp, 'receive-206-revision2-review-16')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const record = {
  status: 'FIG206_REVISION2_AFFECTED_INDEPENDENT_PASS_RECEIVED',
  report, manifest: bind(manifestFile), currentNamedBindings: manifest.currentNamedBindings,
  scopedReview: manifest.scopedReview, preservation: manifest.preservation,
  imageLedger: manifest.chargedImageLedger, revisionLedger: manifest.revisionLedger,
  originalFIRSTsFailuresUNKNOWNAndCountersPreserved: true,
  producerParserNativeWidthEditorReplays: 0, canonicalPromotionPerformed: false,
  parentPermanentImages: '24/24', activeExecSessions: [],
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile), bind(path.join(tmp, 'receive-206-revision2-review-16.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/206-revision2-independent-review16',
  references, [
    'evidence/stemrobin188-6g-n32/204206-source169171-independent-review15/retention.json',
    'evidence/stemrobin188-6g-n32/206-revision2-author15/retention.json',
  ], record)))
