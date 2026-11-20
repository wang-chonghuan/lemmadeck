import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const owner = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d174-n12-figures17-19-author')
const allowed = [owner, path.join(cwd, '.tmp/STEMROBIN-181/d1816-d174/figures')]
const [id, manifestPath] = process.argv.slice(2)
if (process.cwd() !== cwd || !/^d174-[a-z0-9-]+$/.test(id || '')) {
  throw new Error('Exact cwd and unique D174 receipt id required')
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const receiptDir = path.join(owner, 'native', id)
if (fs.existsSync(receiptDir)) throw new Error('Receipt already exists; passed stages must not be replayed')
const binding = (file) => {
  const absolute = path.resolve(file)
  const bytes = fs.readFileSync(absolute)
  return {
    path: absolute,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  }
}
for (const output of manifest.outputs) {
  const absolute = path.resolve(output)
  if (!allowed.some((root) => absolute.startsWith(`${root}/`))) throw new Error('Output outside D174 scope')
  if (fs.existsSync(absolute)) throw new Error(`Refusing to replace output: ${absolute}`)
}
const inputsBefore = manifest.inputs.map(binding)
fs.mkdirSync(receiptDir, { recursive: true })
const startedAt = new Date().toISOString()
const result = spawnSync(manifest.command[0], manifest.command.slice(1), {
  cwd,
  encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  maxBuffer: 16 * 1024 * 1024,
})
const endedAt = new Date().toISOString()
fs.writeFileSync(path.join(receiptDir, 'stdout.txt'), result.stdout || '', { flag: 'wx' })
fs.writeFileSync(path.join(receiptDir, 'stderr.txt'), result.stderr || '', { flag: 'wx' })
const receipt = {
  schema: 'STEMROBIN-181/D174-native-receipt@1',
  ticket: 'STEMROBIN-181',
  batch: 'D174',
  id,
  cwd,
  command: manifest.command,
  startedAt,
  endedAt,
  inputs: inputsBefore,
  inputsAfter: manifest.inputs.map(binding),
  outputs: manifest.outputs.filter((file) => fs.existsSync(file)).map(binding),
  absentOutputs: manifest.outputs.filter((file) => !fs.existsSync(file)),
  stdout: binding(path.join(receiptDir, 'stdout.txt')),
  stderr: binding(path.join(receiptDir, 'stderr.txt')),
  exitCode: result.status,
  signal: result.signal,
  executionError: result.error?.message || null,
  figureApproval: false,
}
fs.writeFileSync(path.join(receiptDir, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ receipt: binding(path.join(receiptDir, 'receipt.json')), exitCode: result.status }))
process.exitCode = result.status ?? 1
