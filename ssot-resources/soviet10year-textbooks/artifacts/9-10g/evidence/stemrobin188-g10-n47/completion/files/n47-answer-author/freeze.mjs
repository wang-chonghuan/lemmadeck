import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-author')
if (process.cwd() !== repo) throw new Error('Wrong cwd')
const candidate = path.join(own, 'candidate/answer-keys.json')
const first = path.join(own, 'candidate/answer-keys.FIRST.json')
const receipt = path.join(own, 'evidence/first-candidate-freeze.json')
if (fs.existsSync(first) || fs.existsSync(receipt)) throw new Error('First candidate already frozen')
const document = JSON.parse(fs.readFileSync(candidate, 'utf8'))
if (document.status !== 'draft') throw new Error('Candidate must remain draft')
if (document.answers.map((answer) => answer.exercise).join(',') !== '49,50,51,52,53,54') {
  throw new Error('Six-exercise identity mismatch')
}
if (document.answers.some((answer) => !answer.displayAnswer || answer.source !== 'derived')) {
  throw new Error('Incomplete candidate')
}
fs.copyFileSync(candidate, first, fs.constants.COPYFILE_EXCL)
fs.chmodSync(candidate, 0o444)
fs.chmodSync(first, 0o444)
const digest = crypto.createHash('sha256').update(fs.readFileSync(candidate)).digest('hex')
const result = {
  candidate: { path: candidate, sha256: digest },
  firstSnapshot: { path: first, sha256: digest },
  status: 'draft-frozen-first-candidate',
  candidateCount: 1,
  successfulManualMathWrites: 1,
  contentRevisionCount: 0,
  freezeBeforeAuthorChecks: true,
  independentApproval: false,
  gate2Approval: false,
  finalized: false,
  published: false,
}
fs.writeFileSync(receipt, `${JSON.stringify(result, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify(result, null, 2))
