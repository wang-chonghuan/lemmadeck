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
  'n61-answer215-affected-review-02': 'stemrobin188-g10-n61/answer215-affected-review',
  'n64-text-review-figure-author-01': 'stemrobin188-g10-n64/modern-text-review-figure-author',
  'n64-figure96-review-01': 'stemrobin188-g10-n64/figure96-independent-review',
  'n66-text-author-01': 'stemrobin188-g10-n66/modern-text-author',
  'source235236-author': 'stemrobin188-source235236/author-attempt',
  'source237238-author': 'stemrobin188-source237238/author-attempt',
  'source239240-author': 'stemrobin188-source239240/author-attempt',
  'source235236-FIRST-review-01': 'stemrobin188-source235236/FIRST-review',
  'source237238-FIRST-review-01': 'stemrobin188-source237238/FIRST-review',
  'n64-answer-author': 'stemrobin188-g10-n64/answer-author',
  'n64-choice-author': 'stemrobin188-g10-n64/choice-author',
  'n64-answer-choice-review-01': 'stemrobin188-g10-n64/answer-choice-independent-review',
  'n64-display-review-01': 'stemrobin188-g10-n64/complete-display-review',
  'n66-text-review-01': 'stemrobin188-g10-n66/modern-text-independent-review',
  'n66-figure9899-author-01': 'stemrobin188-g10-n66/figure9899-author',
  'n66-figure100101-author-01': 'stemrobin188-g10-n66/figure100101-author',
  'n66-figure9899-review-01': 'stemrobin188-g10-n66/figure9899-independent-review',
  'n66-figure100101-review-01': 'stemrobin188-g10-n66/figure100101-independent-review',
  'n64-choice232-author-02': 'stemrobin188-g10-n64/choice232-author',
}
assert.ok(scopes[name], name)
assert.match(expected, /^[a-f0-9]{64}$/)
const root = path.join(tmp, name)
const index = path.join(root, 'output-index.json')
assert.equal(hash(index), expected)
const collection = path.join(tmp, `${name}-collection-01.json`)
assert.ok(!fs.existsSync(collection), collection)
const indexed = read(index)
const usesHashField = indexed.schema === 'n66-text-author-output-index@1'
if (usesHashField) assert.equal(name, 'n66-text-author-01')
const usesAbsolutePathField = indexed.schema === 'same188-6/output-index@1'
if (usesAbsolutePathField) assert.equal(name, 'source237238-author')
const entries = indexed.outputs
assert.ok(Array.isArray(entries) && entries.length > 0)
const outputs = entries.map(entry => {
  const prefix = path.relative(repo, root) + path.sep
  const inputPath = usesAbsolutePathField ? entry.absolute_path : entry.path
  assert.equal(typeof inputPath, 'string')
  const file = path.isAbsolute(inputPath) ? inputPath
    : inputPath.startsWith(prefix) ? path.resolve(repo, inputPath)
      : path.resolve(root, inputPath)
  assert.ok(file.startsWith(root + path.sep), file)
  assert.notEqual(file, index)
  safe(file)
  const expectedHash = usesHashField ? entry.hash : entry.sha256
  assert.match(expectedHash, /^[a-f0-9]{64}$/)
  assert.equal(hash(file), expectedHash, file)
  assert.equal(fs.statSync(file).size, entry.bytes, file)
  assert.equal((fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'), entry.mode, file)
  return { ...bind(file), bytes: entry.bytes, mode: entry.mode }
})
save(collection, {
  status: 'closed-agent-outputs-verified-once', name, outputIndex: bind(index), outputs,
  parentImageLoads: 0, published: false, wholeLessonApproved: false,
})
const files = [
  collection, index, ...outputs.map(output => output.path), new URL(import.meta.url).pathname,
]
if (name === 'n66-text-author-01')
  files.push(path.join(tmp, 'n66-text-author-01-collection-FIRSTFAIL.json'))
if (name === 'source237238-author')
  files.push(path.join(tmp, 'source237238-author-collection-FIRSTFAIL.json'))
retain(path.join(core, 'evidence', scopes[name]), files, {
  status: `collected-${name}-with-original-failures-and-holds`,
  collection: bind(collection), sourceOrFigureReviewIsNotWholeLessonApproval: true,
})
