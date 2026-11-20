import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, safe, save, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const [name, expected] = process.argv.slice(2)
const scopes = {
  'n61-answer-author': 'stemrobin188-g10-n61/answer-author',
  'n61-choice-author': 'stemrobin188-g10-n61/choice-author',
  'n61-answer-choice-review-01': 'stemrobin188-g10-n61/answer-choice-independent-review',
  'n61-display-review-01': 'stemrobin188-g10-n61/complete-display-review',
  'n64-text-review-figure-author-01': 'stemrobin188-g10-n64/modern-text-review-figure-author',
  'n64-figure96-review-01': 'stemrobin188-g10-n64/figure96-independent-review',
}
assert.ok(scopes[name], name)
assert.match(expected, /^[a-f0-9]{64}$/)
const root = path.join(tmp, name)
const index = path.join(root, 'output-index.json')
assert.equal(hash(index), expected)
const collection = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collection), collection)
const entries = read(index).outputs
assert.ok(Array.isArray(entries) && entries.length > 0)
const outputs = entries.map(entry => {
  const prefix = path.relative(repo, root) + path.sep
  const file = path.isAbsolute(entry.path) ? entry.path
    : entry.path.startsWith(prefix) ? path.resolve(repo, entry.path)
      : path.resolve(root, entry.path)
  assert.ok(file.startsWith(root + path.sep), file)
  assert.notEqual(file, index)
  safe(file)
  assert.equal(hash(file), entry.sha256, file)
  assert.equal(fs.statSync(file).size, entry.bytes, file)
  assert.equal((fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'), entry.mode, file)
  return { ...bind(file), bytes: entry.bytes, mode: entry.mode }
})
save(collection, {
  status: 'closed-agent-outputs-verified-once', name, outputIndex: bind(index), outputs,
  parentImageLoads: 0, published: false, wholeLessonApproved: false,
})
retain(path.join(core, 'evidence', scopes[name]), [
  collection, index, ...outputs.map(output => output.path), new URL(import.meta.url).pathname,
], {
  status: `collected-${name}-with-original-failures-and-holds`,
  collection: bind(collection), sourceOrFigureReviewIsNotWholeLessonApproval: true,
})
