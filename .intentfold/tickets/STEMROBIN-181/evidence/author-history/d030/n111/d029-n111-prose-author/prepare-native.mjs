import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const own = path.join(tmp, 'd029-n111-prose-author')
const candidate = path.join(tmp, 'd029-n111-source-candidate')
const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const reportPath = path.join(candidate, 'result.json')
const expected = '6888d094bf556444b0d8e3098898241968dd1b01b2da5c21be3c5845f34cc1b8'
if (digest(reportPath) !== expected) throw new Error('Source report SHA mismatch')
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const inputs = [...report.output, report.sourceBookCandidate, report.command].map((item) => {
  const file = path.resolve(repo, item.path)
  if (digest(file) !== item.sha256) throw new Error(`Source binding mismatch: ${file}`)
  return { path: file, sha256: item.sha256 }
})
const root = path.join(candidate, 'artifacts')
const work = path.join(own, 'work')
const target = path.join(work, 'adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n111')
const commandFile = path.join(own, 'adapt-prepare.command.json')
if (fs.existsSync(commandFile) || fs.existsSync(target)) {
  throw new Error('adapt-prepare is already attempted; do not repeat')
}
const executable = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = [
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/p2c.py'),
  'adapt-prepare', '--book', '9p', '--edition', 'modern-us-neutral',
  '--lesson', 'phy9-c2-s4-n111', '--root', root, '--work', work,
]
fs.writeFileSync(commandFile, JSON.stringify({
  executable, args, cwd: repo, sourceReport: { path: reportPath, sha256: expected },
  sourceInputs: inputs, sourceRoot: root, workRoot: work,
  permittedWrites: [own], invocationCount: 1,
  action: 'Native adapt-prepare only; no SOURCE, image, finalize, render or publication command.',
}, null, 2) + '\n', { flag: 'wx' })
const result = spawnSync(executable, args, {
  cwd: repo, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
fs.writeFileSync(path.join(own, 'adapt-prepare.stdout.txt'), result.stdout ?? '')
fs.writeFileSync(path.join(own, 'adapt-prepare.stderr.txt'), result.stderr ?? '')
fs.writeFileSync(path.join(own, 'adapt-prepare.result.json'), JSON.stringify({
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
}, null, 2) + '\n')
if (result.status !== 0) throw new Error('Native adapt-prepare failed; retain evidence and HOLD')
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  const prepared = path.join(target, name)
  fs.copyFileSync(prepared, path.join(own, `prepared-${name}`), fs.constants.COPYFILE_EXCL)
}
fs.copyFileSync(
  path.join(work, 'adapt/9p/modern-us-neutral/book.template.json'),
  path.join(own, 'prepared-book.template.json'),
  fs.constants.COPYFILE_EXCL,
)
for (const item of inputs) {
  if (digest(item.path) !== item.sha256) throw new Error(`Source mutated: ${item.path}`)
}
console.log(result.stdout.trim())
console.log(`Prepared once; immutable baseline retained at ${own}`)
