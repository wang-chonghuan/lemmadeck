import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n61-display-technical-recovery-02')
assert.ok(!fs.existsSync(output), output)
const resultPath = path.join(tmp, 'n61-complete-display-01/result.json')
const result = read(resultPath)
assert.equal(result.status, 'fail')
assert.equal(result.screenshotImages, 0)
assert.ok(result.failure.includes('fig-g10-88: small text'))
result.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
const renderPath = path.join(core, 'editions/modern-us-neutral/figures/fig-g10-88.render.json')
assert.equal(read(renderPath).labels, 0)
assert.equal(read(renderPath).status, 'pass')
fs.mkdirSync(output)
const scriptPath = path.join(tmp, 'display-n61-complete-01.mjs')
const beforePath = path.join(output, 'display-script.FIRST.mjs')
fs.copyFileSync(scriptPath, beforePath, fs.constants.COPYFILE_EXCL)
fs.chmodSync(beforePath, 0o444)
save(path.join(output, 'diagnosis.json'), {
  status: 'technical-checker-defect-not-content-failure',
  failure: bind(resultPath), originalScript: bind(beforePath), render: bind(renderPath),
  cause: 'Checker wrongly requires labels on every figure; reviewed figure88 is intentionally unlabeled.',
  correction: 'Require actual label count to equal bound render labels, then min16px for each actual label.',
  completedScreenshotsRepeated: 0, sourceAndFigureBytesChanged: false,
  sourceOrSemanticReviewRepeated: false, contentRepairs: 0, imageLoads: 0,
  published: false, wholeLessonApproved: false,
})
