import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${ticket}/production-assembly10c114-heading-fixed/10c`
const modern = `${ticket}/production-modern10c114`
const answer = `${ticket}/production-answers10c114`
const id = 'ana10-c8-s2-n114'
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-114-first-modern-empty-answer'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
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
    const data = fs.readFileSync(from)
    files.push({ source: from, retained: to, bytes: data.length, sha256: hash(data) })
  }
}
for (const [from, name] of [
  [`${source}/lessons/${id}`, 'faithful114'],
  [`${source}/book.json`, 'source-assembly-book.json'],
  [`${source}/editions/modern-us-neutral/lessons/${id}`, 'modern114'],
  [`${source}/editions/modern-us-neutral/book.json`, 'edition-book.json'],
  [`${modern}/first-finalize`, 'first-modern-finalize'],
  [`${modern}/first-render`, 'first-render'],
  [`${modern}/render/10c/modern-us-neutral/${id}`, 'rendered-html'],
  [answer, 'empty-answer'],
  [`${ticket}/production-answer10c114-once.mjs`, 'production-answer10c114-once.mjs'],
  [`${ticket}/production-modern10c114-once.mjs`, 'production-modern10c114-once.mjs'],
  [`${ticket}/production-retain114-first-modern-answer-once.mjs`, 'production-retain114-first-modern-answer-once.mjs'],
]) collect(from, `${output}/${name}`)
for (const item of files) {
  fs.mkdirSync(path.dirname(item.retained), { recursive: true })
  fs.copyFileSync(item.source, item.retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(fs.readFileSync(item.retained)), item.sha256)
}
const result = {
  totalFiles: files.length,
  totalBytes: files.reduce((sum, item) => sum + item.bytes, 0),
  copied: files, exclusions: [],
  consumption: 'First adapt-finalize68e0df/command2ed7dc/audit7d25e0, first rendera45d76/completevector-stream-hashes25e910. First empty answerpreparef44770/full44e9bc; exact draftacd78e; first finalize0a6ed1/fullcommand-audit-streamc7cc04.',
  qualification: '114 TEXT and first modern/empty-answer gates PASS only; first offline visual acceptance still pending. No115 promotion, new choice seed, fullbook claim, old PASS rerun, DB, Git or app action. All historical failures and UNKNOWNs remain.',
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ totalFiles: result.totalFiles, totalBytes: result.totalBytes, exclusions: [] }))
