import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const first = path.join(ticket, 'tmp/d791-n83-written-native-finalize')
const out = path.dirname(new URL(import.meta.url).pathname)
const author = path.join(ticket, 'tmp/d782-n83-first-written-answer-author')
const card = 'phy10-c2-s3-n83'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (f, data) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
save(path.join(out, 'first-execution-failure.json'), {
  status: 'EXECUTION-REPORT-PARSER-FAILURE-NOT-CONTENT-FAILURE',
  script: bind(path.join(first, 'finalize-once.mjs')), exitCode: 1,
  error: "ENOENT: no such file or directory, open '" + path.join(first, 'zh/root/10p/editions/modern-us-neutral/lessons', card, 'interactions.audit.json') + "'",
  cause: 'lesson_interactions.py writes ready interactions.json and no audit file.',
  completedChineseNativeCalls: 3, replayedChineseNativeCalls: 0, contentRepairs: 0,
})
const packets = []
for (const locale of ['zh', 'en']) {
  const root = path.join(first, locale, 'root')
  const folder = path.join(root, '10p/editions/modern-us-neutral/lessons', card)
  const original = path.join(author, locale, 'answer-keys.json')
  if (locale === 'en') {
    fs.mkdirSync(folder, { recursive: true })
    const from = path.join(author, locale, 'root/10p/editions/modern-us-neutral/lessons', card)
    for (const name of ['lesson.json', 'exercises.json', 'figures.json'])
      fs.copyFileSync(path.join(from, name), path.join(folder, name), fs.constants.COPYFILE_EXCL)
    fs.copyFileSync(original, path.join(folder, 'answer-keys.json'), fs.constants.COPYFILE_EXCL)
    for (const [stage, tool, mode] of [
      ['answers-finalize', 'lesson_answers.py', 'finalize'],
      ['interactions-prepare', 'lesson_interactions.py', 'prepare'],
      ['interactions-finalize', 'lesson_interactions.py', 'finalize'],
    ]) {
      const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
        '.claude/skills/ld-s10y-answer/tools/' + tool, mode, '--book', '10p',
        '--edition', 'modern-us-neutral', '--lesson', card, '--root', root]
      const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
      save(path.join(out, 'calls', locale + '-' + stage + '.json'),
        { command, cwd: repo, exitCode: r.status, stdout: r.stdout, stderr: r.stderr })
      assert.equal(r.status, 0, r.stderr || r.stdout)
    }
  } else {
    for (const stage of ['answers-finalize', 'interactions-prepare', 'interactions-finalize'])
      assert.equal(read(path.join(first, 'calls/zh-' + stage + '.json')).exitCode, 0)
  }
  assert.deepEqual(read(path.join(folder, 'answer-keys.json')).answers, read(original).answers)
  assert.equal(read(path.join(folder, 'answer-keys.audit.json')).status, 'pass')
  const interactions = read(path.join(folder, 'interactions.json'))
  assert.equal(interactions.status, 'ready')
  assert.deepEqual(interactions.interactions.map(x => x.exercise), ['1', '2', '3'])
  assert.ok(interactions.interactions.every(x => x.widget === 'free' && x.derivation && !x.needsAuthoring))
  packets.push({ locale, root, outputs: ['answer-keys.json', 'answer-keys.audit.json', 'interactions.json'].map(n => bind(path.join(folder, n))) })
}
const report = {
  status: 'BILINGUAL-WRITTEN-ANSWERS-AND-FREE-INTERACTIONS-NATIVE-PASS',
  ticket: 'STEMROBIN-181', card, packets, nativeCallsNew: 3, nativeCallsReused: 3,
  firstExecutionFailure: bind(path.join(out, 'first-execution-failure.json')),
  contentRepairsNew: 0, actualImages: 0, paidCalls: 0, reviewedStandardsUnchanged: true,
  sourceOrScienceReviewsReplayed: false, wholeCardApproved: false,
  canonicalPromotion: false, databaseWrites: false, publisherCalls: false,
}
save(path.join(out, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')), newCalls: 3, reusedCalls: 3 }))
