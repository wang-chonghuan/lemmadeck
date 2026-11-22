import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, hash, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const stage = process.argv[2]
assert.ok(['technical', 'seed'].includes(stage))
const references = []
const add = file => { references.push(bind(file)); return bind(file) }
const addReceipt = file => {
  const item = add(file)
  for (const stream of Object.values(read(file).streams)) {
    assert.equal(hash(stream.path), stream.sha256)
    references.push(stream)
  }
  return item
}
let record
let relative
let prior
if (stage === 'technical') {
  const own = path.join(tmp, 'n32-modern-technical-recovery-16')
  const recovery = read(path.join(own, 'recovery.json'))
  assert.equal(recovery.status, 'N32_MODERN_NATIVE_RECOVERED_AFTER_SUBPART_LABEL_ROLE_FIX')
  const firstFailure = addReceipt(recovery.firstFailure.path)
  const successfulRecovery = addReceipt(recovery.recovery.path)
  for (const key of ['firstFailureAudit', 'oldCodeReconstructedByInvertingOnlyThisPatch',
    'currentCodeSnapshot', 'downstreamWrapper'])
    add(recovery[key].path)
  addReceipt(path.join(own, 'before-existing-prose-test.execution.json'))
  const tests = add(path.join(own, 'tests.actual-tool-results.json'))
  for (const file of [
    path.join(tmp, 'recover-n32-modern-16.mjs'),
    path.join(tmp, 'run-n32-scoped-native-15.mjs'),
    path.join(tmp, 'install-render-n32-15.FIRST.mjs'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tests/test_subpart_label_signature.py'),
  ]) add(file)
  record = {
    status: 'N32_MODERN_SIGNATURE_TECHNICAL_RECOVERY_RETAINED_INDEPENDENT_CODE_REVIEW_PENDING',
    firstFailure, successfulRecovery, recovery: add(path.join(own, 'recovery.json')), tests,
    unchangedContentAndFigureReviewsReused: true, newContentRevisions: 0,
    firstFailurePreserved: true, preExistingUnrelatedProseTestFailurePreserved: true,
    codeReviewPending: true, fullProjectMechanicalDefencePerformed: false,
  }
  relative = 'evidence/stemrobin188-6g-n32/modern-signature-technical-recovery16'
  prior = ['evidence/stemrobin188-6g-n32/install15/retention.json']
} else {
  const own = path.join(tmp, 'n32-formal-choice-seed-16')
  const seedFile = path.join(own, 'seed.json')
  const seed = read(seedFile)
  assert.equal(hash(seedFile), 'f4f84696ce28d72f64ced2fdcef4c4266ae2f9d0bbf68ab339c077335e4dd778')
  for (const stage of ['inspect', 'prepare']) {
    const file = path.join(own, `${stage}.execution.json`)
    assert.equal(read(file).exitCode, 0)
    addReceipt(file)
  }
  for (const item of seed.trace) {
    const file = path.join(repo, item.path)
    assert.equal(hash(file), item.sha256)
    add(file)
  }
  for (const figure of seed.figures)
    for (const item of figure.assets) {
      const file = path.join(repo, item.path)
      assert.equal(hash(file), item.sha256)
      add(file)
    }
  add(path.join(tmp, 'prepare-n32-formal-choice-seed-16.mjs'))
  record = {
    status: 'N32_FORMAL_NINE_SOURCE_CHOICE_SEED_RETAINED_AUTHORING_PENDING',
    seed: add(seedFile),
    canonicalDigest: '1155d99b6978dde29816e56a5ba4deb5ec0c5a338330c6820d7fb920d109bbcd',
    exercises: seed.exercises.map(item => item.number),
    statementBlocks: seed.concepts.map(item => item.block),
    nativeInstallBeforePreparation: true, toolPreparedNotManuallyAssembled: true,
    sourceSolveReplayed: false, sourceFIRSTUnchanged: true,
    draftAndIndependentChoiceReviewPending: true,
  }
  relative = 'evidence/stemrobin188-6g-n32/formal-choice-seed16'
  prior = ['evidence/stemrobin188-6g-n32/install15/retention.json',
    'evidence/stemrobin188-6g-n32/choice-source-solving-FIRST16/retention.json']
}
const recordFile = path.join(tmp, `n32-${stage}-retained-16.json`)
save(recordFile, record)
add(recordFile)
add(path.join(tmp, 'retain-n32-technical-and-seed-16.mjs'))
console.log(JSON.stringify(retainCurrent6g(relative, references, prior, record)))
