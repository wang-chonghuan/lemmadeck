import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-208-text-binding-revision2-13')
const recordFile = path.join(own, 'record.json')
const inputsFile = path.join(own, 'affected-review-inputs.json')
const record = read(recordFile)
assert.equal(record.status, '208_CHANGED_TEXT_BINDING_NATIVE_PASS_AFFECTED_REVIEW_PENDING')
const references = [
  bind(recordFile), bind(inputsFile), record.changedSpec, record.changedContext,
  record.changedTemplate, record.oldSVG, record.changedSVG, record.originalReview,
  record.independentText438PASS,
  bind(path.join(core6g, 'evidence/stemrobin188-6g-n32/approved207208-assets12/promotion.json')),
]
for (const name of ['validate', 'render']) {
  const file = path.join(own, `${name}.execution.json`)
  const receipt = read(file)
  assert.equal(receipt.exitCode, 0)
  references.push(bind(file), ...Object.values(receipt.streams))
}
const inputs = read(inputsFile)
references.push(inputs.oldSpec, inputs.oldContext, inputs.currentRender)
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const recoveryRecord = {
  ...record,
  technicalRecovery: {
    originalScript: bind(path.join(tmp, 'rebind-n32-208-approved438-text-13.mjs')),
    originalWrapperExitCode: 1, toolOutputChunk: '35f0d8',
    cause: 'Prior approved207208-assets12 stores promotion.json, not retention.json. Failure occurred only at final evidence reception after changed-native PASS and SVG byte-identity assertion.',
    actualPriorPromotion: bind(path.join(core6g, 'evidence/stemrobin188-6g-n32/approved207208-assets12/promotion.json')),
    completedOutputsRetainedOnly: true,
    candidateValidatorRendererAndSVGComparisonReplayed: false,
    newContentRevisionOrImageCharge: false,
  },
}
const recoveryFile = path.join(own, 'reception-recovery.json')
save(recoveryFile, recoveryRecord)
references.push(
  bind(recoveryFile), bind(path.join(tmp, 'rebind-n32-208-approved438-text-13.mjs')),
  bind(path.join(tmp, 'retain-208-completed-binding-recovery-13.mjs')),
)
console.log(JSON.stringify({
  inputs: bind(inputsFile), recovery: bind(recoveryFile),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-n32/208-text-binding-revision2-13',
    references,
    [
      'evidence/stemrobin188-6g-n32/approved207208-recordings12/retention.json',
      'evidence/stemrobin188-6g-source167168/independent-review13/retention.json',
    ],
    recoveryRecord,
  ),
}))
