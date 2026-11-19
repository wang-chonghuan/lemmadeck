import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const raw = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
const modern = path.join(raw, 'editions/modern-us-neutral')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const copy = (file, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (fs.existsSync(target)) assert.equal(sha(target), sha(file), target)
  else fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  return bind(target)
}
const outputs = []
const rows = []
const reports = []
for (const name of ['n101', 't11']) {
  const file = path.join(tmp, 'd1277-n101-t11-first-native', name, 'report.json')
  const native = read(file)
  assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
  reports.push(bind(file))
  const packet = native.outputs.zh
  const card = native.card
  for (const item of packet.nativeFiles) assert.equal(sha(item.path), item.sha256)
  const audit = read(path.join(packet.target, 'adaptation.audit.json'))
  assert.equal(audit.status, 'pass')
  for (const filename of ['lesson.json', 'lesson.md', 'exercises.json'])
    outputs.push(copy(path.join(packet.raw, 'lessons', card, filename),
      path.join(raw, 'lessons', card, filename)))
  for (const item of packet.nativeFiles)
    outputs.push(copy(item.path, path.join(modern, 'lessons', card, path.basename(item.path))))
  const lesson = read(path.join(packet.target, 'lesson.json'))
  rows.push({ id: card, number: lesson.number, title: lesson.title,
    prose_blocks: lesson.prose.length, exercises: native.sourceQuestions, figures: 0,
    source_lesson_sha256: audit.sourceLessonSha256, source_exercises_sha256: audit.sourceExercisesSha256 })
}
const calls = []
const run = (label, args) => {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', ...args]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  })
  calls.push(save(path.join(own, label + '.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }))
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
run('raw-index', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  '--root', path.dirname(raw), '--work', path.join(own, 'index-work')])
const rowsFile = path.join(own, 'modern-rows.json')
save(rowsFile, rows)
run('modern-index', ['-c',
  'import sys,json; from pathlib import Path; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import update_book_index; update_book_index(Path(sys.argv[1]),Path(sys.argv[2]),Path(sys.argv[3]),json.loads(Path(sys.argv[4]).read_text()))',
  raw, modern, path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'), rowsFile])
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', status: 'NATIVE-PASS-STAGED-NOT-COMPLETE',
  reports, outputs, calls, index: [bind(path.join(raw, 'book.json')), bind(path.join(modern, 'book.json'))],
  pending: ['N101-T11-readonly-answer-independent-review-and-finalize', 'N101-T11-choice',
    'N101-T11-first-display'], completeCardsAdded: 0, nativePassReplays: 0,
  parentImageOpens: 0, databaseWrites: false, n102UnchangedOpen: true,
})
console.log(JSON.stringify({ status: 'NATIVE-PASS-STAGED-NOT-COMPLETE', cards: rows.map(item => item.id) }))
