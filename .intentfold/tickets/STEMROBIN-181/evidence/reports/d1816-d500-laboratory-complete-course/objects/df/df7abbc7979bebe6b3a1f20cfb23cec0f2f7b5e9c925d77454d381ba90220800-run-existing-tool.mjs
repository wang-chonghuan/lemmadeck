import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const [receiptPath, command, ...args] = process.argv.slice(2)
if (!receiptPath || !command) {
  throw new Error('usage: run-existing-tool.mjs receipt.json command [arguments]')
}

const startedAt = new Date()
const result = spawnSync(command, args, {
  cwd: process.cwd(),
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
})
const finishedAt = new Date()
const outputFlagPaths = args.flatMap((arg, index) => (
  ['--svg', '--png', '--report'].includes(arg) ? [args[index + 1]] : []
))
const outputs = outputFlagPaths.filter(Boolean).filter(fs.existsSync).map(file => ({
  path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
}))
const receipt = {
  schemaVersion: 1,
  role: 'author mechanical tool receipt, not a semantic/pixel review',
  cwd: process.cwd(),
  command: [command, ...args],
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  elapsedMs: finishedAt - startedAt,
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message || null,
  stdout: result.stdout || '',
  stderr: result.stderr || '',
  outputs,
}
fs.mkdirSync(path.dirname(receiptPath), { recursive: true })
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`)
process.stdout.write(receipt.stdout)
process.stderr.write(receipt.stderr)
console.log(`Receipt: ${receiptPath}`)
process.exitCode = result.status ?? 1
