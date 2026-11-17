import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = import.meta.dirname
const name = process.argv[2]
if (!['prepare', 'diff', 'browser-check', 'project-images', 'seal'].includes(name)) throw new Error('Unsupported bounded command')
const receipt = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
}
const write = (name, bytes) => {
  const target = path.join(root, name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx' })
  return receipt(target)
}
write(`commands/${name}.once`, `${new Date().toISOString()}\n`)
fs.mkdirSync(path.join(root, 'runtime-temp'), { recursive: true })
const executable = name === 'diff' ? '/usr/bin/diff' : process.execPath
const args = name === 'diff' ? ['-u',
  path.join(path.dirname(root), 'production-modern10c114-first-offline-review/browser-check.mjs'),
  path.join(root, 'browser-check.mjs')] : [path.join(root, `${name}.mjs`)]
const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never', TMPDIR: path.join(root, 'runtime-temp'), DEBUG: 'pw:browser' }
delete env.PWDEBUG
const programs = args.filter((file) => fs.existsSync(file) && fs.statSync(file).isFile()).map(receipt)
const runtime = receipt(executable)
const cwd = process.cwd()
const startedAt = new Date().toISOString()
const child = spawnSync(executable, args, { cwd, env, encoding: null, maxBuffer: 128 * 1024 * 1024 })
const endedAt = new Date().toISOString()
const stdout = write(`commands/${name}.stdout.raw`, child.stdout || Buffer.alloc(0))
const stderr = write(`commands/${name}.stderr.raw`, child.stderr || Buffer.alloc(0))
const result = { executable, argv: [executable, ...args], cwd, startedAt, endedAt,
  exitStatus: child.status, signal: child.signal,
  error: child.error ? { message: child.error.message, code: child.error.code, stack: child.error.stack } : null,
  programs, runtime, stdout, stderr,
  controlledEnvironment: { PWDEBUG: '(removed)', PLAYWRIGHT_HTML_OPEN: 'never', DEBUG: 'pw:browser', TMPDIR: env.TMPDIR },
  launcher: { argv: process.argv, program: receipt(import.meta.filename), runtime: receipt(process.execPath) },
}
const resultReceipt = write(`commands/${name}.receipt.json`, `${JSON.stringify(result, null, 2)}\n`)
process.stdout.write(child.stdout || Buffer.alloc(0))
process.stderr.write(child.stderr || Buffer.alloc(0))
console.log(JSON.stringify({ command: name, receipt: resultReceipt }))
process.exitCode = name === 'diff' && child.status === 1 ? 0 : (child.status || (child.error ? 1 : 0))
