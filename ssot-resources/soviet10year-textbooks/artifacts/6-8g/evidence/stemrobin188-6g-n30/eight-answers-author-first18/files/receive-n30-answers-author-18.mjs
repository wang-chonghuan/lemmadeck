import assert from 'node:assert/strict'
import path from 'node:path'
import { repo, tmp, read, hash, bind } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const file = path.join(tmp, 'n30-eight-answers-author-first-18/manifest.json')
assert.equal(hash(file), '41f5a9f5676486276d1e973c699a1123c4679d4e76c80a810ff376ea42530845')
const manifest = read(file)
assert.equal(manifest.lesson, 'geo68-c2-s4-n30')
assert.equal(manifest.answers, 8)
assert.equal(manifest.status, 'draft')
const references = [bind(file)]
for (const item of [...manifest.files, ...manifest.inputs]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.push(item)
}
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n30/eight-answers-author-first18',
  [...references, bind(path.join(tmp, 'receive-n30-answers-author-18.mjs')),
    bind(path.join(tmp, 'receive-n30-answers-author-18.FIRSTFAIL.mjs')),
    bind(path.join(tmp, 'n30-answer-reception-first-failure18.json'))],
  ['evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'],
  {
    status: 'EIGHT_ANSWER_CANDIDATES_AWAIT_INDEPENDENT_REVIEW',
    lesson: manifest.lesson, answers: 8, ungraded: 8, subparts: 14,
    unknownSourceExercises: manifest.unknownSourceExercises,
    authorReportedArithmeticCases: manifest.verification.numericCases,
    authorReportedCommand: manifest.verification.command,
    authorReportedExitCode: manifest.verification.exitCode,
    arithmeticRawStreamsRetained: false,
    noNativeFinalizationOrIndependentApproval: true,
    counters: manifest.counters,
  },
)))
