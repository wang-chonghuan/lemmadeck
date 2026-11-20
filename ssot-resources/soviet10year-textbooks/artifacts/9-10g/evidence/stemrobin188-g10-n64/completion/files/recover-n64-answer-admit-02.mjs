import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const failed = path.join(tmp, 'n64-completion-answer-admit-01')
const output = path.join(tmp, 'n64-completion-answer-admit-02')
assert.ok(fs.existsSync(failed))
assert.deepEqual(fs.readdirSync(failed), [])
assert.ok(!fs.existsSync(output))
const producer = path.join(tmp, 'continue-n64-completion-01.mjs')
const candidate = path.join(tmp, 'n64-answer234-choice233-affected-02/answer-keys.candidate.json')
const reviewPath = path.join(tmp, 'n64-answer234-choice233-affected-review-02/answer-review.json')
const review = read(reviewPath)
assert.equal(review.schema, 'stemrobin188-n64-answer-review@1')
assert.equal(review.result, 'PASS')
assert.deepEqual(review.findings, [])
assert.ok(!Array.isArray(review.inputBindings))
const bindings = Object.values(review.inputBindings)
assert.ok(bindings.length > 0)
bindings.forEach(item => {
  assert.equal(item.sha256Before, item.sha256After)
  assert.equal(hash(item.path), item.sha256After)
})
assert.equal(review.inputBindings.currentCandidate.path, candidate)
assert.equal(hash(candidate), '6850c533b1b511a91cfc0c167a249905c2b4913252a476c6bdae48c8433eef75')
assert.deepEqual(review.perExercise.map(item => item.exercise),
  Array.from({ length: 7 }, (_, index) => String(index + 229)))
assert.ok(review.perExercise.every(item => item.result === 'PASS'))
const target = path.join(core, 'editions/modern-us-neutral/lessons/geo910-c2-s3-n64/answer-keys.json')
assert.ok(!fs.existsSync(target))
const snapshot = path.join(failed, 'continue-n64-completion.FIRST.mjs')
fs.copyFileSync(producer, snapshot, fs.constants.COPYFILE_EXCL)
fs.chmodSync(snapshot, 0o444)
save(path.join(failed, 'FIRSTFAIL.json'), {
  command: 'node .intentfold/tickets/STEMROBIN-188/tmp/continue-n64-completion-01.mjs answer-admit',
  cwd: repo, exitCode: 1, stdout: '',
  stderr: 'file://' + producer + ':26\n'
    + '  review.inputBindings.forEach(binding => assert.equal(hash(binding.path), binding.sha256After))\n'
    + '                       ^\n\n'
    + 'TypeError: review.inputBindings.forEach is not a function\n'
    + '    at file://' + producer + ':26:24\n'
    + '    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)\n'
    + '    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)\n\n'
    + 'Node.js v24.16.0\n',
  preservedProducer: { ...bind(snapshot), mode: '0444' },
  cause: 'Current review.inputBindings is a role-keyed object, not the previous array.',
  contentFailure: false, answerCopiedBeforeFailure: false, reviewRepeated: false,
})
fs.mkdirSync(output)
fs.copyFileSync(candidate, target, fs.constants.COPYFILE_EXCL)
fs.chmodSync(target, 0o644)
assert.equal(hash(target), hash(candidate))
save(path.join(output, 'result.json'), {
  status: 'pass-for-answer-candidate-only', candidate: bind(candidate),
  review: bind(reviewPath), retained: bind(target),
  firstFailure: bind(path.join(failed, 'FIRSTFAIL.json')),
  repair: 'Read the existing role-keyed binding object with Object.values; content untouched.',
  nativeFinalizationPending: true, producerReplays: 0, reviewReplays: 0,
  newImages: 0, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, retained: bind(target), producerReplays: 0 }))
