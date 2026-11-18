import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const folderName = process.argv[2] || 'mechanical-text-check'
if (!/^mechanical-text-check(?:-repair)?$/.test(folderName)) throw new Error('Unexpected check output directory')
const folder = path.join(out, folderName)
fs.mkdirSync(folder, { recursive: true })
const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const argv = ['-B', path.join(out, 'check-text-contract.py')]
const temp = path.join(out, 'native-tmp')
fs.mkdirSync(temp, { recursive: true })
const startedUtc = new Date().toISOString()
const proc = spawnSync(python, argv, {
  cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: temp },
})
const stdout = path.join(folder, 'stdout.json')
const stderr = path.join(folder, 'stderr.txt')
fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
const receipt = {
  command: [python, ...argv], startedUtc, finishedUtc: new Date().toISOString(),
  exitCode: proc.status, signal: proc.signal, error: proc.error?.message || null,
  stdout: bound(stdout), stderr: bound(stderr),
  scope: 'Native text-only helper checks, not adapt-finalize/render or SCI/ZHEN review.',
  fullSourceOrEditionNativeReplays: 0, newImageOpens: 0,
}
const receiptPath = path.join(folder, 'receipt.json')
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
const report = proc.status === 0 ? JSON.parse(proc.stdout) : null
console.log(JSON.stringify({
  receipt: bound(receiptPath), exitCode: proc.status,
  mechanicalStatus: report?.mechanicalStatus || 'FAIL',
  errors: report?.errors || proc.stderr,
  newImages: 0,
}, null, 2))
process.exitCode = proc.status === 0 ? 0 : 1
