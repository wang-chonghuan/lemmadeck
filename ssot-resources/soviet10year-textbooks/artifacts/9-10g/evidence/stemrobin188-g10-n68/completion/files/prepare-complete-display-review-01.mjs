import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const name = process.argv[2]
assert.ok(['n61', 'n64', 'n68'].includes(name))
const output = path.join(tmp, `${name}-display-review-inputs-01`)
assert.ok(!fs.existsSync(output), output)
const displayAttempt = name === 'n61' ? '02' : '01'
const resultPath = path.join(tmp, `${name}-complete-display-${displayAttempt}/result.json`)
const display = read(resultPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
display.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
display.results.forEach(item => assert.equal(hash(item.screenshot.path), item.screenshot.sha256))
fs.mkdirSync(output)
save(path.join(output, 'manifest.json'), {
  schema: 'stemrobin188-bounded-complete-display-review-inputs@1',
  role: 'one-independent-final-offline-display-reviewer',
  result: bind(resultPath), inputs: display.sourceBindings,
  screenshots: display.results.map(item => ({
    kind: item.kind, viewport: item.viewport, screenshot: item.screenshot,
  })),
  maxImageLoads: 8, maxContextImageLoads: 24,
  observeEachExactlyOnce: true, previousImagesMustNotReopen: true,
  sourceAndSemanticPASSReusedNotReaudited: true,
  outputRoot: path.join(tmp, `${name}-display-review-01`),
  headlessLimitationPreserved: true, offlineOnly: true,
  published: false, wholeLessonApproved: false,
})
console.log(JSON.stringify({ output, screenshotPaths: 8, parentImageLoads: 0 }))
