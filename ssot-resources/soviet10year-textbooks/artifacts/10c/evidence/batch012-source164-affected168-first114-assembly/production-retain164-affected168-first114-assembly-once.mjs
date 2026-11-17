import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const affected = `${ticket}/production-source10c164-167-review/affected-text`
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source164-affected168-first114-assembly'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(output), 'Retain once')
const freezeBytes = fs.readFileSync(`${affected}/freeze.json`)
assert.equal(hash(freezeBytes), '58896b1409f33f9d13550ab49aa5810ba7654dacf6833deba98faa2c760de466')
const freeze = JSON.parse(freezeBytes)
const manifestBytes = fs.readFileSync(freeze.inputOutputManifest.path)
assert.equal(hash(manifestBytes), freeze.inputOutputManifest.sha256)
const manifest = JSON.parse(manifestBytes)
const bindings = [...manifest.inputs, ...manifest.outputs, ...freeze.supplementalOutputs]
for (const item of bindings) {
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
}
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink())
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)))
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${to}/${name}`)
    return
  }
  assert(stat.isFile())
  const bytes = fs.readFileSync(from)
  files.push({ source: from, retained: to, bytes: bytes.length, sha256: hash(bytes) })
}
collect(affected, `${output}/affected164`)
collect(`${ticket}/production-source10c168-171-first-finalize`, `${output}/first168`)
collect(`${ticket}/production-assembly10c168-171`, `${output}/assembly114-initial`)
for (const name of ['production-finalize10c168-171-first-once.mjs',
  'production-assemble10c114-first.mjs', 'production-retain164-affected168-first114-assembly-once.mjs'])
  collect(`${ticket}/${name}`, `${output}/${name}`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  copied: files, totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  affectedMatchedBindingsOnce: bindings.length + 2,
  exclusions: [],
  consumption: 'Full affected report/freeze/manifest106dcd; all three programs/receipt0bbfca; full actual streams0d2353; full C01/authority/ledgerd6b67f. Transported historical T01-T06 remain summaries, not fabricated raw streams. 166/167 timing qualification preserved; no failed current166167 transport check observed by this reviewer. First168 commands/audits/all pageJSON semantics fully52a3c2 and actual2d65fd. Initial114 assembly7154f1 exit0 but TOC114 fallback identity unresolved; no modern delivery approval.',
  statement: '164/165 exact narrow delta confirmed; downstream first checks not yet executed. 168-171 PASS23/23,22/22,22/22,23/23 never rerun. Literal171 two exp_a subscripts unchanged. Figure75 and all inherited HOLD/UNKNOWN remain. No model image opened.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  affectedMatchedBindingsOnce: result.affectedMatchedBindingsOnce, exclusions: [] }))
