import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const base = path.join(tmp, 'g10-n61')
const admissionPath = path.join(tmp, 'n61-source-admission-01.json')
const admission = read(admissionPath)
assert.equal(admission.status, 'pass-for-readable-n61-source-only-with-local-holds')
for (const stage of ['assemble-source-01', 'vectorize-source-01',
  'assemble-source-02', 'adapt-prepare-isolated-01']) {
  assert.equal(read(path.join(base, stage, 'command.json')).exitCode, 0)
}
retain(path.join(core, 'evidence/stemrobin188-g10-n61/source'), [
  ...inventory(base), admissionPath, ...admission.bindings.map(b => b.path),
  path.join(tmp, 'assemble-n61.py'), path.join(tmp, 'g10-n61.mjs'),
  path.join(tmp, 'admit-n61-source-01.mjs'),
  path.join(tmp, 'prepare-n61-modern-text-author-01.mjs'),
  path.join(tmp, 'n61-modern-text-author-inputs-01/manifest.json'),
  new URL(import.meta.url).pathname,
], {
  schema: 'stemrobin188-N61-scoped-source-and-prepared-templates-retention@1',
  status: 'N61-only-source-assembly-and-six-vectorPASS-modern-templates-not-completion',
  admission: bind(admissionPath), originalProseObjects: 20, exercises: 10, sourceFigures: 6,
  exercise209TwoSourceRefsPreserved: true,
  recallAndFrustumDelimiterJoinsPreserved: true,
  source220OriginalFAILAndSoleAcceptedRepairPreserved: true,
  N59PhysicalRangeWarningNotLessonApproval: true,
  allLocalHoldsAndSource212ProceduralFAILPreserved: true,
  source218220Repair1EachNotReset: true,
  nativeSourceStagesRerun: 0, parentImages: 0, coreRawLessonsPromoted: false,
  wholeLessonApproved: false,
})
