import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${tmp}/production-assembly10c125-corrected/10c`
const modern = `${tmp}/production-modern10c125`
const answer = `${tmp}/production-answers10c125`
const id = 'ana10-c9-s2-n125'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-125-first-modern-empty-answer'
const hash = data => createHash('sha256').update(data).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
assert(!fs.existsSync(output))
for (const file of [
  `${modern}/first-finalize/command.json`, `${modern}/first-render/command.json`,
  `${answer}/first-prepare/command.json`, `${answer}/first-finalize/command.json`,
]) assert.equal(read(file).exitCode, 0)
const files = []
function collect(from, to) {
  const stat = fs.lstatSync(from)
  assert(!stat.isSymbolicLink())
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
  [`${source}/lessons/${id}`, 'faithful125'],
  [`${source}/book.json`, 'source-assembly-book.json'],
  [`${source}/editions/modern-us-neutral/lessons/${id}`, 'modern125'],
  [`${source}/editions/modern-us-neutral/book.json`, 'edition-book.json'],
  [`${modern}/first-finalize`, 'first-modern-finalize'],
  [`${modern}/first-render`, 'first-render'],
  [`${modern}/render/10c/modern-us-neutral/${id}`, 'rendered-html'],
  [answer, 'empty-answer'],
  [`${tmp}/production-answer10c125-once.mjs`, 'production-answer10c125-once.mjs'],
  [`${tmp}/production-modern10c125-once.mjs`, 'production-modern10c125-once.mjs'],
  [`${tmp}/production-retain125-first-modern-answer-once.mjs`, 'production-retain125-first-modern-answer-once.mjs'],
]) collect(from, `${output}/${name}`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  totalFiles: files.length, totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  copied: files, exclusions: [],
  consumption: 'First finalize d6990f and complete command/audit/JSON88f8d6; first renderd4223d and command/fullstreamd8aecf; first empty answerprepare6295ed/full d8aecf, exactdraft3d1067, firstfinalize4982d3/full9da3e8.',
  qualification: '125 first modern and legitimate empty-answer operations only. Independent first offline visual review pending. No empty-set mathematics/input chain proof, prior124/supplement acceptance, old PASS reruns, canonical promotion or whole-book approval.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes, exclusions: [] }))
