import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n66-display-review-inputs-01')
assert.ok(!fs.existsSync(output))
const resultPath = path.join(tmp, 'n66-complete-display-02/result.json')
const result = read(resultPath)
assert.equal(result.status, 'mechanical-pass-visual-observation-pending')
assert.equal(result.results.length, 8)
result.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
const screenshots = result.results.map(({ kind, viewport, screenshot }) => {
  assert.equal(hash(screenshot.path), screenshot.sha256)
  return { kind, viewport, screenshot }
})
fs.mkdirSync(output)
save(path.join(output, 'manifest.json'), {
  schema: 'stemrobin188-bounded-complete-display-review-inputs@1',
  role: 'one-independent-final-offline-display-reviewer',
  result: bind(resultPath), inputs: result.sourceBindings, screenshots,
  maxImageLoads: 8, maxContextImageLoads: 24, observeEachExactlyOnce: true,
  previousImagesMustNotReopen: true, sourceAndSemanticPASSReusedNotReaudited: true,
  outputRoot: path.join(tmp, 'n66-display-review-01'),
  headlessLimitationPreserved: true, offlineOnly: true, published: false,
  wholeLessonApproved: false,
})
console.log(JSON.stringify({ output, screenshots: 8, parentImageLoads: 0 }))
