import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source163164-affected-repair-12')
const author = path.join(tmp, 'source6g163164-author-first-11')
const reviewFile = path.join(tmp, 'source163164-first-and161-affected-review-12/report.json')
const references = [bind(reviewFile), bind(path.join(own, 'staging.json')),
  bind(path.join(tmp, 'repair-source163164-affected-12.mjs')),
  bind(path.join(tmp, 'retain-source163164-repair-recovery-12.mjs'))]
const pages = []
for (const [page, figure] of [[163, 217], [164, 218]]) {
  const id = `0${page}`
  const folder = path.join(own, `artifacts/6-8g/pages/${id}`)
  const receiptFile = path.join(own, `${id}.execution.json`)
  const receipt = read(receiptFile)
  const audit = read(path.join(folder, 'audit.json'))
  assert.equal(receipt.exitCode, 0)
  assert.deepEqual(audit.errors, [])
  assert.deepEqual(audit.normalizations, [])
  assert.deepEqual([audit.lines_printed, audit.lines_md], page === 163 ? [21, 21] : [25, 25])
  for (const stream of Object.values(receipt.streams)) {
    assert.equal(hash(stream.path), stream.sha256)
    references.push(bind(stream.path))
  }
  const crop = path.join(own, `work/6-8g/pages/${id}/figures/fig-${figure}.png`)
  assert.equal(hash(crop), hash(path.join(author, `work/6-8g/pages/${id}/figures/fig-${figure}.png`)))
  pages.push({ page, before: bind(path.join(author, `artifacts/6-8g/pages/${id}/page.json`)),
    after: bind(path.join(folder, 'page.json')), nativeExitCode: 0,
    rows: [audit.lines_printed, audit.lines_md], contentRevisionsUsed: 1,
    receipt: bind(receiptFile), sourceCrop: bind(crop), unchangedCrop: true })
  references.push(bind(path.join(own, `${id}.prefinalize.md`)), bind(receiptFile), bind(crop),
    ...['page.md', 'page.json', 'audit.json'].map(name => bind(path.join(folder, name))))
}
const record = {
  status: 'SOURCE163164_AFFECTED_REPAIR_AUTHOR_ONLY_NATIVE_PASS_IDENTITIES_UNKNOWN',
  review: bind(reviewFile), pages, allOtherStructuredLeavesUnchanged: true,
  structuredDiffEvidence: 'Original wrapper deep-equality checks for both pages and crop/row checks completed before line83 failed only on expected164 exit status.',
  oldFIRSTsPlaceholderCandidatesAndNativePASSPreserved: true,
  shapeTransportIsNotAlphabetIdentity: true, independentAffectedReviewPending: true,
  technicalRecovery: {
    failedScript: bind(path.join(tmp, 'repair-source163164-affected-12.mjs')),
    failedCommand: ['node', '.intentfold/tickets/STEMROBIN-188/tmp/repair-source163164-affected-12.mjs', 'finalize'],
    actualWrapperExitCode: 1, actualNative163ExitCode: 0, actualNative164ExitCode: 0,
    failure: 'Assertion at line83 expected native164 exit1; actual native164 exit0. No original source/native failure was fabricated.',
    recovery: 'Read already completed native receipts and retain outputs only. No finalizer replay or source edit.',
  },
  nativePASSDoesNotCertifyAlphabetIdentity: true,
  parentImageLoads: 0, wholeLessonApproved: false, dependentAssemblyStopped: true,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
references.push(bind(recordFile))
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-source163164/affected-repair12', references,
  ['evidence/stemrobin188-6g-source163164/author-first11/retention.json',
    'evidence/stemrobin188-6g-source163164/independent-review12/retention.json'], record,
)))
