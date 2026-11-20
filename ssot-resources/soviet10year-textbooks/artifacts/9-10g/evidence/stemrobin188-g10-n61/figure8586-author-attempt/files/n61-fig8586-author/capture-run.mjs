import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = path.resolve('.intentfold/tickets/STEMROBIN-188/tmp/n61-fig8586-author')
const [name, command, ...args] = process.argv.slice(2)
if (!name || !command || !/^[A-Za-z0-9-]+$/.test(name)) throw new Error('Expected receipt name and command')
const prefix = path.join(root, name)
if (fs.existsSync(`${prefix}.command.json`)) throw new Error('Refusing to overwrite FIRST command evidence')
const startedAt = new Date().toISOString()
const result = spawnSync(command, args, { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
fs.writeFileSync(`${prefix}.exit.json`, JSON.stringify({
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${prefix}.command.json`, JSON.stringify({
  cwd: process.cwd(), executable: command, argv: args, startedAt, finishedAt: new Date().toISOString(),
  stdout: `${name}.stdout.txt`, stderr: `${name}.stderr.txt`, exit: `${name}.exit.json`,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ name, exitCode: result.status, stdout: result.stdout?.trim(), stderr: result.stderr?.trim() }))
process.exitCode = result.status ?? 1
