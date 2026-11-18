import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const folder = path.join(out, 'local-text-check-initial')
fs.mkdirSync(folder, { recursive: true })
const command = [
  path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  '-B', path.join(out, 'check-local-text.py'),
]
const startedUtc = new Date().toISOString()
const proc = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: out },
})
const stdout = path.join(folder, 'stdout.json')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receiptPath = path.join(folder, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify({
  command, startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  candidateTemplates: ['zh', 'en'].map(language =>
    bound(path.join(out, 'frozen/n68', language, 'lesson.template.json'))),
  stdout: bound(stdout), stderr: bound(stderr),
  scope: 'Four local text units only. No adapt-finalize, render or independent SCI.',
  attempt: 1, automaticRetries: 0, retainAnyFirstFailure: true, newImages: 0,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({
  receipt: bound(receiptPath), exitCode: proc.status,
  mechanicalStatus: proc.status === 0 ? JSON.parse(proc.stdout).mechanicalStatus : 'FAIL',
  newImages: 0,
}, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
