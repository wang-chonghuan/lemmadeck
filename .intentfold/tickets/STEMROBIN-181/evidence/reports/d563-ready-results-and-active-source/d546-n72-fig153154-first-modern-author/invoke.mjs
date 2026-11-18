import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const [id, executable, ...args] = process.argv.slice(2)
if (!/^[a-z0-9.-]+$/.test(id || '') || !executable) throw new Error('Expected a unique receipt id and command')
const target = suffix => path.join(root, 'commands', `${id}.${suffix}`)
if (fs.existsSync(target('receipt.json'))) throw new Error('Refuse repeated command id')
const startedAt = new Date().toISOString()
const result = spawnSync(executable, args, {
  cwd: '/Users/yong/.codex/worktrees/00b1/lemmadeck',
  encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, TMPDIR: path.join(root, 'runtime'), PYTHONDONTWRITEBYTECODE: '1' },
})
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const stdout = result.stdout || '', stderr = result.stderr || ''
fs.writeFileSync(target('stdout.txt'), stdout, { flag: 'wx' })
fs.writeFileSync(target('stderr.txt'), stderr, { flag: 'wx' })
fs.writeFileSync(target('receipt.json'), `${JSON.stringify({
  id, executable, args, cwd: '/Users/yong/.codex/worktrees/00b1/lemmadeck',
  startedAt, endedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
  stdout: { path: target('stdout.txt'), sha256: hash(stdout) },
  stderr: { path: target('stderr.txt'), sha256: hash(stderr) },
}, null, 2)}\n`, { flag: 'wx' })
process.stdout.write(stdout)
process.stderr.write(stderr)
process.exitCode = result.status ?? 1
