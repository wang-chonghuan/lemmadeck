import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const author = path.join(ticket, 'tmp/d782-n83-first-written-answer-author')
const output = path.join(ticket, 'tmp/d791-n83-written-native-finalize')
const review = path.join(ticket, 'tmp/d783-n83-first-independent-written-answer-review/review-report.json')
const card = 'phy10-c2-s3-n83'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
}
assert.equal(sha(review), 'c0f1c94947c7f6f709bf9a3da3c67a7cb9b640526798142be4f3429a76985b1e')
assert.equal(read(review).SCI, 'PASS')
const packets = []
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const calls = []
function run(name, tool, mode, root) {
  const command = [python, '-B', tool, mode, '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card, '--root', root]
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  const receipt = { command, cwd: repo, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }
  save(path.join(output, 'calls', `${name}.json`), receipt)
  calls.push(receipt)
  assert.equal(result.status, 0, result.stderr || result.stdout)
}
for (const locale of ['zh', 'en']) {
  const root = path.join(output, locale, 'root')
  const from = path.join(author, locale, 'root/10p/editions/modern-us-neutral/lessons', card)
  const folder = path.join(root, '10p/editions/modern-us-neutral/lessons', card)
  for (const name of ['lesson.json', 'exercises.json', 'figures.json']) copy(path.join(from, name), path.join(folder, name))
  const candidate = path.join(author, locale, 'answer-keys.json')
  copy(candidate, path.join(folder, 'answer-keys.json'))
  const answersBefore = read(candidate).answers
  run(`${locale}-answers-finalize`, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', root)
  assert.deepEqual(read(path.join(folder, 'answer-keys.json')).answers, answersBefore)
  assert.equal(read(path.join(folder, 'answer-keys.audit.json')).status, 'pass')
  run(`${locale}-interactions-prepare`, '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', 'prepare', root)
  run(`${locale}-interactions-finalize`, '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', 'finalize', root)
  const interaction = read(path.join(folder, 'interactions.json'))
  assert.deepEqual(interaction.interactions.map((item) => item.exercise), ['1', '2', '3'])
  assert.ok(interaction.interactions.every((item) => item.widget === 'free' && item.derivation && !item.needsAuthoring))
  packets.push({
    locale, reviewedCandidate: bind(candidate),
    outputs: ['answer-keys.json', 'answer-keys.audit.json', 'interactions.json', 'interactions.audit.json'].map((name) => bind(path.join(folder, name))),
    questionCount: 3, auto: 0, ungraded: 3, widgets: ['free', 'free', 'free'],
  })
}
const report = {
  status: 'BILINGUAL-WRITTEN-ANSWERS-AND-FREE-INTERACTIONS-NATIVE-PASS',
  ticket: 'STEMROBIN-181', card, review: bind(review), packets,
  nativeCLIInvocations: calls.length, actualImages: 0, paidCalls: 0,
  scienceOrSourceReviewsReplayed: false, reviewedAnswersUnchanged: true,
  historicalNonblockingTerminologyFinding: 'F1-PRESERVED-NOT-REPAIRED-NOT-BLOCKING',
  canonicalPromotion: false, databaseWrites: false, publisherCalls: false,
  nativeLessonOrFIGApproval: false, wholeCardApproved: false,
  pending: ['lesson figures and Roman/color plate boundaries', 'choices', 'DISPLAY', 'whole-card native finalize', 'canonical retention'],
}
save(path.join(output, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, packets, nativeCLIInvocations: calls.length, images: 0, paidCalls: 0 }))
