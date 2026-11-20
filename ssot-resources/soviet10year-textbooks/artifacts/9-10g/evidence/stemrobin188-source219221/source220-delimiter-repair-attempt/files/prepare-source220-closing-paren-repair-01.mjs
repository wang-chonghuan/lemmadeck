import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save, hash } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source220-closing-paren-repair-01')
assert.ok(!fs.existsSync(root), root)
const verdictPath = path.join(tmp, 'source220221-FIRST-review-01/source220221-review.json')
const verdict = read(verdictPath)
assert.deepEqual(verdict.FAIL.map(f => f.id), ['F220-CLOSING-PAREN'])
const original = path.join(tmp, 'source219221-author/artifacts/9-10g/pages/0220')
const candidate = path.join(root, 'artifacts/9-10g/pages/0220')
fs.mkdirSync(candidate, { recursive: true })
const inputs = ['page.md', 'page.json', 'audit.json'].map(name => {
  const from = path.join(original, name)
  const to = path.join(candidate, name)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
  assert.equal(hash(from), hash(to))
  return { before: bind(from), copied: bind(to) }
})
const originalLine = read(path.join(original, 'page.json')).blocks[4].lines[0]
assert.equal(originalLine.split('$[O_1,O]$').length, 2)
save(path.join(root, 'repair-scope.json'), {
  schema: 'stemrobin188-source220-sole-closing-parenthesis-repair-scope@1',
  status: 'prepared-only-not-yet-edited',
  verdict: bind(verdictPath), finding: 'F220-CLOSING-PAREN',
  original, candidate, inputs, ref: 'p0220#5',
  beforeLine: originalLine,
  afterLine: originalLine.replace('$[O_1,O]$', '$[O_1,O]$)'),
  originalNativeRowsReused: [16, 16],
  repairUsageBefore: 0, repairLimit: 1, nativeCallsAllowed: 0, imagesAllowed: 0,
  allOtherMetadataBlocksRowsMathGeometryAndAuditBytesFrozen: true,
  originalFIRSTsAndDiagnosticCorrectionFailuresPreserved: true, wholeLessonApproved: false,
})
console.log(JSON.stringify({ root, copied: 3, finding: 'F220-CLOSING-PAREN',
  changedSourceCharactersPlanned: 1, nativeCalls: 0, images: 0 }))
