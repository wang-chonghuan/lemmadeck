import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const source = path.join(tmp, 'finish-n68-modern-01.mjs')
const snapshot = path.join(tmp, 'finish-n68-modern-FIRSTFAIL.mjs')
assert.ok(!fs.existsSync(path.join(tmp, 'n68-modern-prepare-01')))
fs.copyFileSync(source, snapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(snapshot, 0o444)
save(path.join(tmp, 'n68-modern-prepare-FIRSTFAIL.json'), {
  command: 'node .intentfold/tickets/STEMROBIN-188/tmp/finish-n68-modern-01.mjs prepare',
  cwd: repo,
  exitCode: 1,
  failedScript: bind(snapshot),
  diagnosis: 'Pre-write assertion expected text.findings=[]; actual PASS report has preserved source ambiguity, missing-density and exact-glyph HOLD observations with requestedCandidateChange=null. The defect list is text.defects=[].',
  failureLocation: 'finish-n68-modern-01.mjs:26',
  producerCalls: 0,
  candidateWrites: 0,
  imageLoads: 0,
  reviewReplay: 0,
  published: false,
})
