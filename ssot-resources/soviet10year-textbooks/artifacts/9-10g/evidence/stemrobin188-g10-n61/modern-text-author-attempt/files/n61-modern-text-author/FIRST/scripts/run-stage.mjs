import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../../../..')
const [stage, command, ...args] = process.argv.slice(2)
if (!stage || !command || !/^[a-z0-9-]+$/.test(stage)) {
  throw new Error('Usage: run-stage.mjs <stage> <command> [arguments]')
}
const directory = path.join(own, 'receipts', stage)
fs.mkdirSync(directory, { recursive: true })
if (fs.existsSync(path.join(directory, 'command.json'))) {
  throw new Error(`Stage already has a receipt: ${stage}`)
}
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const startedAt = new Date().toISOString()
const result = spawnSync(command, args, {
  cwd: repo,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
const stdout = result.stdout ?? ''
const stderr = (result.stderr ?? '') + (result.error ? `${result.error.stack}\n` : '')
fs.writeFileSync(path.join(directory, 'stdout.txt'), stdout, { flag: 'wx' })
fs.writeFileSync(path.join(directory, 'stderr.txt'), stderr, { flag: 'wx' })
const exitCode = result.status ?? 2
const receipt = {
  schema: 'n61-author-command-receipt@1',
  stage, command, args, cwd: repo,
  startedAt, endedAt: new Date().toISOString(), exitCode,
  signal: result.signal ?? null,
  executionError: result.error ? String(result.error) : null,
  classification: exitCode === 0 ? 'completed' : exitCode === 20 ? 'content-failure' : 'technical-execution-failure',
  stdout: { path: `receipts/${stage}/stdout.txt`, sha256: hash(stdout), bytes: Buffer.byteLength(stdout) },
  stderr: { path: `receipts/${stage}/stderr.txt`, sha256: hash(stderr), bytes: Buffer.byteLength(stderr) },
  invocationScript: { path: 'run-stage.mjs', sha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))) },
  offline: true,
  imagesInspected: 0,
  paidCalls: 0,
  sourceWritten: false,
  templatesPromoted: false,
}
fs.writeFileSync(path.join(directory, 'command.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' })
for (const file of ['command.json', 'stdout.txt', 'stderr.txt']) {
  fs.chmodSync(path.join(directory, file), 0o444)
}
process.stdout.write(JSON.stringify({ stage, exitCode, classification: receipt.classification, receipt: `receipts/${stage}/command.json` }) + '\n')
if (stdout) process.stdout.write(stdout)
if (stderr) process.stderr.write(stderr)
process.exitCode = exitCode
