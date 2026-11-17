import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp/n19-first-offline-display')
const output = path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n19')
const source = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s2-n19')
const render = path.join(repo, '.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/geo910-c1-s2-n19')
const argv = ['../.intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs', '9-10g', 'geo910-c1-s2-n19']
const cwd = path.join(repo, 'app')
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
const fileRecord = (file) => {
  const bytes = fs.readFileSync(file)
  const stat = fs.statSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes), mtime: stat.mtime.toISOString() }
}
const tracked = [
  path.join(owned, 'run-once.mjs'),
  path.join(repo, '.intentfold/tickets/STEMROBIN-184/tmp/offline-check.mjs'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  path.join(repo, 'app/package.json'),
  path.join(repo, 'app/package-lock.json'),
  ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map((name) => path.join(source, name)),
  ...['text.html', 'exercises.html'].map((name) => path.join(render, name)),
]
if (fs.existsSync(path.join(owned, 'execution.json'))) throw new Error('Invocation already recorded; do not rerun')
if (fs.existsSync(output) && fs.readdirSync(output).length) throw new Error('First output is not empty; do not overwrite')
const before = tracked.map(fileRecord)
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', PLAYWRIGHT_HTML_REPORT_OPEN: 'never' }
delete env.PWDEBUG
delete env.OFFLINE_KINDS
delete env.OFFLINE_REPORT
const environment = {
  PWDEBUG: 'unset',
  PLAYWRIGHT_HTML_OPEN: 'never',
  PLAYWRIGHT_HTML_REPORT_OPEN: 'never',
  OFFLINE_KINDS: 'unset; script default text,exercises',
  OFFLINE_REPORT: 'unset; script default report.json',
}
const startedAt = new Date().toISOString()
const monotonicStart = process.hrtime.bigint()
fs.writeFileSync(path.join(owned, 'execution.json'), JSON.stringify({
  status: 'started', executable: process.execPath, argv, cwd, startedAt, environment, before,
}, null, 2) + '\n', { flag: 'wx' })
const child = spawnSync(process.execPath, argv, { cwd, env, encoding: null, maxBuffer: 16 * 1024 * 1024 })
const finishedAt = new Date().toISOString()
const elapsedMilliseconds = Number(process.hrtime.bigint() - monotonicStart) / 1e6
const stdout = child.stdout ?? Buffer.alloc(0)
const stderr = child.stderr ?? Buffer.alloc(0)
fs.writeFileSync(path.join(owned, 'stdout.raw'), stdout, { flag: 'wx' })
fs.writeFileSync(path.join(owned, 'stderr.raw'), stderr, { flag: 'wx' })
const after = tracked.map(fileRecord)
const outputs = fs.existsSync(output) ? fs.readdirSync(output).sort().map((name) => fileRecord(path.join(output, name))) : []
const execution = {
  status: child.status === 0 ? 'command_exit_0_not_semantic_approval' : 'STOP_first_command_failure',
  executable: process.execPath,
  argv,
  cwd,
  startedAt,
  finishedAt,
  elapsedMilliseconds,
  exitCode: child.status,
  signal: child.signal,
  spawnError: child.error ? { name: child.error.name, message: child.error.message, code: child.error.code } : null,
  environment,
  stdout: fileRecord(path.join(owned, 'stdout.raw')),
  stderr: fileRecord(path.join(owned, 'stderr.raw')),
  before,
  after,
  unchanged: before.every((record, index) => record.sha256 === after[index].sha256),
  outputs,
  childInvocations: 1,
  imageObservationsBeforeRun: 0,
  sourceImageOpens: 0,
}
fs.writeFileSync(path.join(owned, 'execution.json'), JSON.stringify(execution, null, 2) + '\n')
console.log(JSON.stringify({
  status: execution.status, startedAt, finishedAt, exitCode: child.status, signal: child.signal,
  unchanged: execution.unchanged, outputs, rawStderrBytes: stderr.length,
}, null, 2))
if (child.status !== 0 || !execution.unchanged) process.exitCode = 1
