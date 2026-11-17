import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticket}/production-promoted10c114`
const retained = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-canonical-promotion'
const commandRoot = `${ticket}/production-promote10c114-command`
const program = `${ticket}/production-promote10c114-once.mjs`
const receipt = file => {
  const bytes = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex') }
}
assert(!fs.existsSync(commandRoot), 'Only one promotion execution')
assert(!fs.existsSync(retained), 'Only one promotion retention')
fs.mkdirSync(commandRoot)
const executable = process.execPath
const argv = [executable, path.resolve(program)]
const cwd = process.cwd()
const programReceipt = receipt(program)
const startedAt = new Date().toISOString()
const child = spawnSync(executable, argv.slice(1), { cwd, encoding: null, maxBuffer: 64 * 1024 * 1024 })
const endedAt = new Date().toISOString()
for (const [name, bytes] of [['stdout.raw', child.stdout ?? Buffer.alloc(0)],
  ['stderr.raw', child.stderr ?? Buffer.alloc(0)]])
  fs.writeFileSync(`${commandRoot}/${name}`, bytes, { flag: 'wx' })
fs.writeFileSync(`${commandRoot}/command.json`, JSON.stringify({
  executable, argv, cwd, startedAt, endedAt, exitStatus: child.status, signal: child.signal,
  error: child.error ? { message: child.error.message, code: child.error.code } : null,
  program: programReceipt, runtime: receipt(executable),
  stdout: receipt(`${commandRoot}/stdout.raw`), stderr: receipt(`${commandRoot}/stderr.raw`),
  outerArgv: process.argv, outerProgram: receipt(import.meta.filename),
}, null, 2) + '\n', { flag: 'wx' })
const copied = []
function copy(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink())
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) copy(`${from}/${name}`, `${to}/${name}`)
  } else {
    assert(stat.isFile())
    const binding = receipt(from)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
    assert.equal(receipt(to).sha256, binding.sha256)
    copied.push({ source: from, retained: to, bytes: binding.bytes, sha256: binding.sha256 })
  }
}
copy(commandRoot, `${retained}/command`)
if (fs.existsSync(output)) copy(output, `${retained}/promotion`)
copy(program, `${retained}/production-promote10c114-once.mjs`)
copy(import.meta.filename, `${retained}/production-promote-retain10c114-once.mjs`)
fs.writeFileSync(`${retained}/copy-manifest.json`, JSON.stringify({
  totalFiles: copied.length, totalBytes: copied.reduce((sum, item) => sum + item.bytes, 0),
  copied, exclusions: [], exitStatus: child.status,
  qualification: 'First canonical promotion only; actual command and before/after books retained, including any failure. No acceptance gate rerun, no115/full-book/DB/Git/publisher/app/handoff/deployment action.',
}, null, 2) + '\n', { flag: 'wx' })
process.stdout.write(child.stdout ?? Buffer.alloc(0))
process.stderr.write(child.stderr ?? Buffer.alloc(0))
console.log(JSON.stringify({ exitStatus: child.status, retained, files: copied.length,
  bytes: copied.reduce((sum, item) => sum + item.bytes, 0), exclusions: [] }))
process.exitCode = child.status ?? 1
