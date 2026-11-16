import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${ticket}/advance-9g-through49`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(`${ticket}/source-9g-p48-targeted-repair-review.md`),
  '748d56884dbd8e6cc85dc10af22ffe7a7611e7415e23284c0c0479246860487c')
assert.equal(hash(`${ticket}/source-9g-p49-targeted-repair-review.md`),
  '7b6326f5667b1740f4223bd910444a43427cad69536b204ce6766dcc518c4db4')
assert(!fs.existsSync(root), 'Only the unattempted49 source boundary')
assert(!fs.existsSync(`${ticket}/assembly-9g-p8-p49`))
fs.mkdirSync(root)
const args = [`${ticket}/assemble-geo910-through39.mjs`, '49']
const startedAtUtc = new Date().toISOString()
const result = spawnSync('node', args, { encoding: 'utf8' })
fs.writeFileSync(`${root}/stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/stderr.txt`, result.stderr || '')
fs.writeFileSync(`${root}/command.json`, JSON.stringify({
  executable: 'node', args, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0, 'Preserve any first failure; no automatic retry')
