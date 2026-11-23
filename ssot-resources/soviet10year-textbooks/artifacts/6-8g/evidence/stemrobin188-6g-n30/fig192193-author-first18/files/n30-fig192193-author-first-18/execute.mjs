import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const W = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
if (process.cwd() !== W) throw new Error('Wrong cwd')
const [name, command, ...argv] = process.argv.slice(2)
if (!name || !command || !/^[A-Za-z0-9-]+$/.test(name)) throw new Error('Need immutable attempt name and executable argv')
const dir = path.join(root, 'executions', name)
if (fs.existsSync(dir)) throw new Error('Will not overwrite an execution')
fs.mkdirSync(dir, { recursive: true })
fs.mkdirSync(path.join(root, 'runtime-tmp'), { recursive: true })
const startedAt = new Date().toISOString()
const specArg = argv.includes('--spec') ? argv[argv.indexOf('--spec') + 1] : argv.find(a => a.endsWith('/spec.json'))
if (specArg && fs.existsSync(specArg)) fs.copyFileSync(specArg, path.join(dir, 'spec-input.json'))
const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, TMPDIR: path.join(root, 'runtime-tmp') } })
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const streams = {}
for (const k of ['stdout', 'stderr']) {
  const p = path.join(dir, `${k}.txt`)
  fs.writeFileSync(p, result[k] || '')
  streams[k] = { path: p, sha256: sha(p) }
}
const snapshots = []
for (const flag of ['--svg', '--png', '--report']) {
  const index = argv.indexOf(flag)
  if (index < 0) continue
  const file = argv[index + 1]
  if (!fs.existsSync(file)) continue
  const p = path.join(dir, path.basename(file))
  fs.copyFileSync(file, p)
  snapshots.push({ path: p, sha256: sha(p), role: flag })
}
const receipt = { cwd: W, command, argv, startedAt, endedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message || null, streams, snapshots }
fs.writeFileSync(path.join(dir, 'execution.json'), JSON.stringify(receipt, null, 2) + '\n')
console.log(JSON.stringify(receipt, null, 2))
if (result.stdout) console.log(result.stdout)
if (result.stderr) console.error(result.stderr)
process.exitCode = result.status ?? 1
