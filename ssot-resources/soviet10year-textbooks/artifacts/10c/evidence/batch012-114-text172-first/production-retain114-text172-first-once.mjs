import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-text172-first'
const review = `${ticket}/production-modern10c114-text-review`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const matched = new Map()
function bind(file, bytes, sha256) {
  file = path.resolve(file)
  if (matched.has(file)) {
    assert.deepEqual(matched.get(file), { bytes, sha256 })
    return
  }
  const data = fs.readFileSync(file)
  assert.equal(data.length, bytes, file)
  assert.equal(hash(data), sha256, file)
  matched.set(file, { bytes, sha256 })
}
assert(!fs.existsSync(output))
assert.equal(hash(fs.readFileSync(`${review}/manifest.json`)), 'e3000cb7e47ab02079daf44d1aec41129c41c6c74773e43e3d11ca2f1a05b122')
bind(`${review}/review.json`, 97432, 'fa89fc2eaa54b94ee97292a5c768d6fe75c5d3074c60068a3c4e61fe49133625')
const manifest = read(`${review}/manifest.json`)
for (const item of [...manifest.inputs, ...manifest.outputs]) {
  bind(item.path, item.bytes, item.sha256)
  if (item.frozen_path) bind(item.frozen_path, item.bytes, item.sha256)
}
for (const item of read(`${ticket}/production-modern10c114/author/manifest.json`).inputs)
  bind(item.path, item.bytes, item.sha256)
for (const [root, pages] of [
  [`${ticket}/production-source10c172-175-first-finalize`, [172]],
  [`${ticket}/production-source10c173-175-remaining-first-finalize`, [173, 174, 175]],
]) for (const number of pages) {
  const page = String(number).padStart(4, '0')
  const command = read(`${root}/${page}/command.json`)
  bind(command.source, fs.statSync(command.source).size, command.sourceSha256)
  assert.equal(command.exitCode, [172, 174].includes(number) ? 1 : 0)
}
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink(), from)
  assert(!['.env', '.venv', 'node_modules', '__pycache__'].includes(path.basename(from)))
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(from).sort()) collect(`${from}/${name}`, `${to}/${name}`)
  } else {
    assert(stat.isFile())
    const bytes = fs.readFileSync(from)
    files.push({ source: from, retained: to, bytes: bytes.length, sha256: hash(bytes) })
  }
}
for (const [from, name] of [
  [review, 'modern114-text-review'],
  [`${ticket}/production-modern10c114/author`, 'modern114-author'],
  [`${ticket}/production-modern10c114/first-prepare`, 'modern114-first-prepare'],
  [`${ticket}/production-modern10c114/first-flow`, 'modern114-first-flow'],
  [`${ticket}/production-assembly10c114-heading-fixed/10c/lessons/ana10-c8-s2-n114`, 'faithful114'],
  [`${ticket}/production-source10c172-175-first-finalize`, 'first172'],
  [`${ticket}/production-source10c173-175-remaining-first-finalize`, 'remaining-first173175'],
]) collect(from, `${output}/${name}`)
for (const name of [
  'production-finalize10c172-175-first-once.mjs',
  'production-finalize10c173-175-remaining-first-once.mjs',
  'production-retain114-text172-first-once.mjs',
  'production-modern10c114-once.mjs',
  'production-freeze114-modern-author-once.mjs',
]) collect(`${ticket}/${name}`, `${output}/${name}`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  uniqueMatchedBindings: matched.size,
  copied: files,
  exclusions: [],
  consumption: 'Full manifest35b844, three programs5b2017/e76111, actual vectors/raw inspect header and freeze streame64361, all28prose semantic comparisons95c9de with missing3-13 supplemented9b3af6. Initial909319 and oversized95c9de truncations not claimed full; duplicate literal inspection stream retained/hash-bound, not a new review. All173175 first commands/audits/streams and pageJSON semantic fields19d170, actual28613a/eae9a7.',
  qualification: '114 first TEXT PASS only, no rendering/finalizer/publication claim; Hilbert0/24, parent24/24 zero opens.17220/19FAIL and wrapper MD equality abort preserved;17324/24PASS and17521/21PASS never rerun;17425/24FAIL, no repair or counter call. All historical failures/UNKNOWNs unchanged.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes,
  uniqueMatchedBindings: matched.size, exclusions: [] }))
