import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, hash, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const manifestFile = path.join(tmp, 'n32-choice-source-solving-first-author-15/manifest.json')
assert.equal(hash(manifestFile), '3ce683a425d12ce1033cf34d511dc7152dc87a7014c616bf64283950bc293551')
const manifest = read(manifestFile)
assert.equal(manifest.status, 'SOURCE_SOLVING_FIRST_COMPLETE_SEALED_FORMAL_TOOL_SEED_PENDING')
assert.deepEqual(manifest.activeExecSessions, [])
const first = manifest.outputs.find(item => item.name === 'source-solving-FIRST')
assert.equal(first.sha256, 'b54165fbfce5ca00f3f1ff42edaa1edafee6365e4899fa94a8cf9b4cef522271')
assert.equal(fs.statSync(first.path).mode & 0o777, 0o444)
assert.equal(manifest.imageLedger.chargedImageViewAttempts, 3)
const references = [bind(manifestFile), ...manifest.inputs,
  ...manifest.outputs, ...manifest.instructionBindings]
for (const item of references) assert.equal(hash(item.path), item.sha256, item.path)
const own = path.join(tmp, 'receive-n32-choice-source-solving-16')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const record = {
  status: 'N32_BLIND_SOURCE_SOLVING_FIRST_RECEIVED_NOT_CHOICE_APPROVAL',
  first, manifest: bind(manifestFile), outputs: manifest.outputs,
  sourceSolving: manifest.sourceSolving, actualSeal: manifest.actualSeal,
  imageLedger: manifest.imageLedger, proposedResponseUnits: manifest.proposedResponseUnits,
  formalSeedPending: true, sourceSolveReplayRequired: false,
  independentReviewer: false, alternativeOrKeyedDraftCreated: false,
  parentPermanentImages: '24/24', activeExecSessions: [],
}
const file = path.join(own, 'record.json')
save(file, record)
references.push(bind(file), bind(path.join(tmp, 'receive-n32-choice-source-solving-16.mjs')))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/choice-source-solving-FIRST16', references,
  ['evidence/stemrobin188-6g-n32/205208-review-recording14/retention.json'], record)))
