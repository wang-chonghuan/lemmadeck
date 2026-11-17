import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const from = `${ticket}/production-modern10c114-first-offline-review`
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-offline-first-harness-failure'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const matched = new Map()
function bind(item) {
  if (matched.has(item.path)) {
    assert.deepEqual(matched.get(item.path), { bytes: item.bytes, sha256: item.sha256 })
    return
  }
  const bytes = fs.readFileSync(item.path)
  assert.equal(bytes.length, item.bytes)
  assert.equal(hash(bytes), item.sha256)
  matched.set(item.path, { bytes: item.bytes, sha256: item.sha256 })
}
assert(!fs.existsSync(output))
assert.equal(hash(fs.readFileSync(`${from}/complete-manifest.json`)), '5a63291df677d8c32617bdbdf353c24fbbf0f946727ef6e6b58b14f133156639')
assert.equal(hash(fs.readFileSync(`${from}/seal-supplement-manifest.json`)), '8e6069d1cf7734468bd7133ed354aba596db1f22fdfd5d0f185fbdcb50f02013')
const manifest = read(`${from}/complete-manifest.json`)
const supplement = read(`${from}/seal-supplement-manifest.json`)
for (const item of [...manifest.originalInputs, ...manifest.guidance, ...manifest.outputs,
  supplement.completeManifest, ...supplement.finalOutputs]) bind(item)
const files = []
function collect(source, retained) {
  const stat = fs.lstatSync(source)
  assert(!stat.isSymbolicLink())
  assert(!['.env', 'node_modules', '.venv', '__pycache__'].includes(path.basename(source)))
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(source).sort()) collect(`${source}/${name}`, `${retained}/${name}`)
  } else {
    assert(stat.isFile())
    const bytes = fs.readFileSync(source)
    files.push({ source, retained, bytes: bytes.length, sha256: hash(bytes) })
  }
}
collect(from, `${output}/first-failed-package`)
collect(`${ticket}/production-retain114-offline-failure-once.mjs`, `${output}/production-retain114-offline-failure-once.mjs`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  totalFiles: files.length, totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  uniqueMatchedBindings: matched.size, copied: files, exclusions: [],
  consumption: 'Completefindings/manifest a7eb95, supplement11a1ad, fiveprograms391417/fea8fa, allactualvectors/rawstreams/coverage/ledger3a7080, fullinputfreeze(nonduplicateruntime)7148c1.1fe92d/6090d6wrongfilename-navigationfailureschangednothing. No pixels or browser observed.',
  qualification: 'First harness parse FAIL before Chromium launch: duplicate require within try. Inputs frozen and original script preserved. No browser or visual acceptance, zero images permanently. Parent identified nonexecuted test-target defects: KaTeX SVG is not a lesson figure; .nb supports native horizontal formula scrolling, not mandatory full-width fitting. Only a new bounded corrected harness may perform first actual browser observation, not rerun any PASS or edit lesson/HTML.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  uniqueMatchedBindings: matched.size, exclusions: [] }))
