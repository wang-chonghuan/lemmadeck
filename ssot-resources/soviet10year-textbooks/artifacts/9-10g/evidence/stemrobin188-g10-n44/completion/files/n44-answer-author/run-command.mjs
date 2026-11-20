import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {spawnSync} from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const owned = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-author')
const [name, executable, ...args] = process.argv.slice(2)
if (!/^[a-z0-9-]+$/.test(name ?? '') || !executable) throw Error('receipt name and executable required')
if (process.cwd() !== cwd) throw Error('wrong cwd')
const receiptPath = path.join(owned, 'receipts', `${name}.json`)
fs.mkdirSync(path.dirname(receiptPath), {recursive: true})
if (fs.existsSync(receiptPath)) throw Error('immutable receipt already exists')
const startedAt = new Date().toISOString()
const result = spawnSync(executable, args, {
  cwd,
  encoding: 'utf8',
  timeout: 120000,
  maxBuffer: 8 * 1024 * 1024,
})
const receipt = {
  cwd,
  command: [executable, ...args],
  startedAt,
  endedAt: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  stdout: result.stdout ?? '',
  stderr: result.stderr ?? '',
  error: result.error ? String(result.error) : null,
}
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx', mode: 0o444})
console.log(JSON.stringify({
  receiptPath,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(receiptPath)).digest('hex'),
  ...receipt,
}, null, 2))
process.exitCode = result.status ?? 2
