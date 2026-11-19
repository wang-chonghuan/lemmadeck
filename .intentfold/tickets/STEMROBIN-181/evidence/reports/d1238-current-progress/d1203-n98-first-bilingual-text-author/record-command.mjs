import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
const [name, executable, ...args] = process.argv.slice(2)
assert.match(name ?? '', /^[a-zA-Z0-9-]+$/)
assert.ok(executable)
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const native = path.join(owned, 'native')
fs.mkdirSync(native, { recursive: true })
const write = (suffix, value) => fs.writeFileSync(path.join(native, `${name}.${suffix}`), value, { flag: 'wx' })
const candidatePaths = ['zh', 'en'].flatMap((locale) =>
  ['lesson', 'exercises'].map((kind) => path.join(owned, locale, `${kind}.template.json`)))
const freezePath = path.join(owned, 'FIRST-candidate-freeze.json')
const started = {
  cwd: repo, argv: [executable, ...args], startedAt: new Date().toISOString(),
  candidates: candidatePaths.map(bind),
  inventory: bind(path.join(owned, 'source-inventory.json')),
  freeze: fs.existsSync(freezePath) ? bind(freezePath) : null,
}
write('started.json', JSON.stringify(started, null, 2) + '\n')
const result = spawnSync(executable, args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
})
write('stdout.txt', result.stdout ?? '')
write('stderr.txt', result.stderr ?? '')
const receipt = {
  ...started, finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, executionError: result.error?.message ?? null,
  candidatesAfter: candidatePaths.map(bind),
  stdout: bind(path.join(native, `${name}.stdout.txt`)),
  stderr: bind(path.join(native, `${name}.stderr.txt`)),
}
write('receipt.json', JSON.stringify(receipt, null, 2) + '\n')
console.log(JSON.stringify({
  receipt: bind(path.join(native, `${name}.receipt.json`)),
  exitCode: result.status, stdout: receipt.stdout, stderr: receipt.stderr,
}, null, 2))
if (result.status !== 0) {
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
}
process.exitCode = result.status ?? 1
