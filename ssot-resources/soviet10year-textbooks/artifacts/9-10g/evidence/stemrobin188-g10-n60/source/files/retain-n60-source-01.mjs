import assert from 'node:assert/strict'
import path from 'node:path'
import { tmp, core, read, bind, inventory, retain } from './retain-scoped-evidence-02.mjs'

const base = path.join(tmp, 'g10-n60')
const admissionPath = path.join(tmp, 'n60-source-admission-01.json')
const admission = read(admissionPath)
assert.equal(admission.status, 'pass-for-readable-n60-source-only-with-local-holds')
for (const stage of ['assemble-source-01', 'vectorize-source-01', 'assemble-source-02',
  'adapt-prepare-isolated-01']) {
  assert.equal(read(path.join(base, stage, 'command.json')).exitCode, 0)
}
retain(path.join(core, 'evidence/stemrobin188-g10-n60/source'), [
  ...inventory(base), admissionPath, ...admission.bindings.map(b => b.path),
  path.join(tmp, 'assemble-n60.py'), path.join(tmp, 'g10-n60.mjs'),
  path.join(tmp, 'admit-n60-source-01.mjs'), new URL(import.meta.url).pathname,
], {
  schema: 'stemrobin188-N60-scoped-source-and-prepared-templates-retention@1',
  status: 'N60-only-source-assembly-and-six-vectorPASS-modern-templates-not-completion',
  admission: bind(admissionPath), originalProseObjects: 22, exercises: 11, sourceFigures: 6,
  exercise198TwoSourceRefsPreserved: true, preheading77SemanticOwnershipPreserved: true,
  N59N61OnlyExcludedRangeWarningsNotLessonApproval: true,
  allLocalHoldsAndSource212ProceduralFAILPreserved: true,
  source215216217218Repair1EachNotReset: true,
  nativeSourceStagesRerun: 0, parentImages: 0, coreRawLessonsPromoted: false,
  wholeLessonApproved: false,
})
