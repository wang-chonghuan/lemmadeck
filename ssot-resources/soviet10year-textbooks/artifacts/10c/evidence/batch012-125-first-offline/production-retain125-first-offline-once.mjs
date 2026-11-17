import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = path.resolve(tmp, 'production-modern10c125-first-offline-review')
const output = path.resolve('ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-125-first-offline')
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
assert(!fs.existsSync(output), 'First retention only; preserve earlier evidence')
assert.equal(hash(fs.readFileSync(`${source}/manifest.json`)), '0a0f2044a8cf181952792c91ca563d9e5e95f5aac138c738e05878f819823917')
assert.equal(hash(fs.readFileSync(`${source}/final-report.json`)), '4e9a6488f30327df9b9b53b0d9101eb38ddcecd59f2bb63c47977ca47558e04d')
const files = []
function collect(file, destination) {
  const stat = fs.lstatSync(file)
  assert(!stat.isSymbolicLink())
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(file)))
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(file).sort()) collect(`${file}/${name}`, `${destination}/${name}`)
  } else {
    assert(stat.isFile())
    const bytes = fs.readFileSync(file)
    files.push({ source: file, retained: destination, bytes: bytes.length, sha256: hash(bytes) })
  }
}
collect(source, `${output}/package`)
collect(path.resolve(tmp, 'production-retain125-first-offline-once.mjs'), `${output}/production-retain125-first-offline-once.mjs`)
const actual = new Map(files.map(item => [item.source, item]))
const manifest = JSON.parse(fs.readFileSync(`${source}/manifest.json`, 'utf8'))
for (const entry of manifest.entries) {
  const item = actual.get(entry.path)
  assert(item, `Missing manifest payload: ${entry.path}`)
  assert.equal(item.bytes, entry.bytes)
  assert.equal(item.sha256, entry.sha256)
}
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  ticket: 'STEMROBIN-184', session: 'sameSessionB',
  executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd(), exitCode: 0,
  copied: files, totalFiles: files.length, totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  manifestBindings: manifest.entries.length, exclusions: [],
  consumption: 'Inherited complete report/ledger/manifest0075d2; scripts bceafa; actual vectors/streams/input/native379d97; plan/freeze/seal b51fb2. Final bounded projection016a1a fully consumed all four surfaces, twelve paragraph rows, fourteen wrappers/formulas, twelve number spans and separator/font/link facts. Earlier truncated projections remain explicitly incomplete, full raw browser results retained by exact byte binding.',
  reviewer: 'Lagrange 01a1e8fa-3d65-7852-8960-9af9811e7483; permanent4/24, batch4/8, zero reopens',
  parentImages: 'Permanent24/24; zero opens or returned image payloads',
  qualification: 'FIRST offline browser and native visual only, not DB/product/quiz acceptance. No overflow wrapper observed; scroll-endpoint tests N/A, not empty-set PASS. Source-relative historical wording and prior124/incomplete supplement exclusions remain. No old acceptance rerun.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ output, totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  manifestBindings: result.manifestBindings, exclusions: [], retainedManifest: `${output}/package/manifest.json`,
  manifestSha256: hash(fs.readFileSync(`${output}/package/manifest.json`)) }, null, 2))
