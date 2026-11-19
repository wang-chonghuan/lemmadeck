import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'

const root = process.cwd()
const out = path.join(root, '.tmp/stemrobin-184-resume/n13-figure-author')
const [stage, command, ...args] = process.argv.slice(2)
if (!stage || !command || !/^[a-z0-9-]+$/.test(stage)) throw new Error('stage and command required')
const stdoutPath = path.join(out, `${stage}.stdout.log`)
const stderrPath = path.join(out, `${stage}.stderr.log`)
const receiptPath = path.join(out, `${stage}.receipt.json`)
for (const file of [stdoutPath, stderrPath, receiptPath]) {
  if (fs.existsSync(file)) throw new Error(`immutable stage already exists: ${file}`)
}
const started = new Date().toISOString()
const result = spawnSync(command, args, {cwd: root, env: process.env, encoding: null, maxBuffer: 32 * 1024 * 1024})
const stdout = result.stdout || Buffer.alloc(0)
const stderr = result.stderr || Buffer.alloc(0)
fs.writeFileSync(stdoutPath, stdout, {flag: 'wx'})
fs.writeFileSync(stderrPath, stderr, {flag: 'wx'})
const receipt = {
  stage, cwd: root, command, args,
  started, finished: new Date().toISOString(),
  actualExit: result.status, signal: result.signal,
  executionError: result.error ? {name: result.error.name, message: result.error.message, code: result.error.code} : null,
  stdout: {path: stdoutPath, bytes: stdout.length, sha256: crypto.createHash('sha256').update(stdout).digest('hex')},
  stderr: {path: stderrPath, bytes: stderr.length, sha256: crypto.createHash('sha256').update(stderr).digest('hex')}
}
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx'})
for (const file of [stdoutPath, stderrPath, receiptPath]) fs.chmodSync(file, 0o444)
if (result.status !== 0) {
  const first = path.join(out, 'first-failure.receipt.json')
  if (!fs.existsSync(first)) {
    fs.writeFileSync(first, `${JSON.stringify(receipt, null, 2)}\n`, {flag: 'wx'})
    fs.chmodSync(first, 0o444)
  }
}
process.stdout.write(stdout)
process.stderr.write(stderr)
console.log(JSON.stringify({stage, actualExit: result.status, signal: result.signal, receiptPath}))
process.exitCode = result.status ?? 1
