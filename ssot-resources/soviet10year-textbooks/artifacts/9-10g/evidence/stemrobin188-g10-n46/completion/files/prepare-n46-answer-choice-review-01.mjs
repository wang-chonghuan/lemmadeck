import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const output = path.join(tmp, 'n46-answer-choice-review-inputs-01')
const choiceRoot = path.join(tmp, 'n46-choice-author')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (name, value) => fs.writeFileSync(path.join(output, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const seedPath = path.join(choiceRoot, 'seed.json')
const draftPath = path.join(choiceRoot, 'draft.json')
const answerPath = path.join(tmp, 'n46-answer-author/answer-keys.json')
assert.equal(hash(seedPath), '45e29c232f6ca61a681105583a7d80054163bba75d30d4f718722a7c139cafb0')
assert.equal(hash(draftPath), '3e5d7214b2d4bc693bf2a2b7e533c5a77f2a9e2e52a678ce27b309ac67ad70dc')
assert.equal(hash(answerPath), '5a753f2d5beecb0f3ba83abd009fea37bd7573f44d2b31468d3c2c5c0fc0bb84')
const draft = json(draftPath)
assert.equal(draft.questions.length, 11)
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const displayPath = path.join(tmp, 'n46-display-convention-source-review-inputs-01/manifest.json')
const display = json(displayPath)
for (const binding of display.bindings) assert.equal(hash(binding.path), binding.sha256)
save('source-only.json', {
  book: '9-10g', lesson: 'geo910-c2-s1-n46', seed: json(seedPath),
  conventionSource: display.conventionSource, keysIncluded: false, imagesExpected: 0,
})
save('visible-questions.json', {
  questions: draft.questions.map(item => ({ id: item.id, view: item.view })),
  internalSolutionsAndKeysIncluded: false,
})
save('manifest.json', {
  status: 'pending-first-n46-answer-choice-review',
  book: '9-10g', lesson: 'geo910-c2-s1-n46',
  sourceOnly: bind(path.join(output, 'source-only.json')),
  visibleQuestions: bind(path.join(output, 'visible-questions.json')),
  keyLast: { draft: bind(draftPath), answerCandidate: bind(answerPath) },
  displayConventionSourceManifest: bind(displayPath),
  bindings: [
    bind(seedPath), bind(draftPath), bind(answerPath),
    bind(path.join(choiceRoot, 'draft.first.json')),
    bind(path.join(choiceRoot, 'report.json')),
    bind(path.join(choiceRoot, 'report.md')),
    bind(path.join(tmp, 'n46-answer-author/report.json')),
    bind(displayPath),
    bind(path.join(output, 'source-only.json')),
    bind(path.join(output, 'visible-questions.json')),
  ],
  authorChoiceContentRepairs: 1, authorAnswerWordingRepairs: 1,
  answerSymbolHold: 'N46-36-1-SYMBOL remains in original candidate; judge convention separately before candidate readiness.',
  originalCandidatesAndFailuresPreserved: true, imageOpensPlanned: 7,
  priorPassedReviewsRepeated: false, semanticApproval: false,
})
console.log(JSON.stringify({ output, questions: 11, options: 44, sourceCount: 6 }))
