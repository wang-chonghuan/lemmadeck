import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${tmp}/production-assembly10c125-corrected/10c`
const target = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const edition = 'editions/modern-us-neutral'
const id = 'ana10-c9-s2-n125'
const output = `${tmp}/production-promoted10c125`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(output), 'Only the first canonical125 promotion')
const decisionFile = `${tmp}/production-modern10c125-promotion-decision.json`
const decision = read(decisionFile)
assert.equal(decision.lesson, id)
assert.equal(decision.status, 'APPROVED_OFFLINE_ONLY')
assert.equal(decision.visualApproved, true)
assert.equal(decision.zeroExercises, true)
assert.equal(decision.fullBookApproved, false)
assert.equal(hash(decision.retainedVisualManifest.path), decision.retainedVisualManifest.sha256)
const retained = read(`${target}/evidence/batch012-125-first-modern-empty-answer/copy-manifest.json`)
const bindings = new Map(retained.copied.map(item => [item.source, item]))
function bound(file) {
  const item = bindings.get(file)
  assert(item, `No retained first-operation binding: ${file}`)
  assert.equal(hash(file), item.sha256)
  assert.equal(hash(item.retained), item.sha256)
}
const sourceFiles = ['lesson.json', 'lesson.md', 'exercises.json']
const modernFiles = [
  'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json', 'choice-set/README.md',
]
for (const file of sourceFiles) bound(`${source}/lessons/${id}/${file}`)
for (const file of modernFiles) bound(`${source}/${edition}/lessons/${id}/${file}`)
const beforeSource = read(`${target}/book.json`)
const beforeEdition = read(`${target}/${edition}/book.json`)
const assembled = read(`${source}/book.json`)
const modernBook = read(`${source}/${edition}/book.json`)
const selectedSource = assembled.lessons.find(item => item.id === id)
const selectedEdition = modernBook.lessons.find(item => item.id === id)
assert(selectedSource && selectedEdition)
assert.equal(assembled.pages, 2)
for (const book of [beforeSource, beforeEdition])
  assert(!book.lessons.some(item => item.id === id))
for (const directory of [`${target}/lessons/${id}`, `${target}/${edition}/lessons/${id}`])
  assert(!fs.existsSync(directory))
const nextSource = {
  ...beforeSource, pages: beforeSource.pages + assembled.pages,
  lessons: [...beforeSource.lessons, selectedSource],
}
const nextEdition = { ...beforeEdition, lessons: [...beforeEdition.lessons, selectedEdition] }
assert.deepEqual(nextSource.lessons.slice(0, beforeSource.lessons.length), beforeSource.lessons)
assert.deepEqual(nextEdition.lessons.slice(0, beforeEdition.lessons.length), beforeEdition.lessons)
assert.deepEqual(nextSource.audit, beforeSource.audit)
const started = new Date().toISOString()
fs.mkdirSync(output)
for (const [from, name] of [
  [`${target}/book.json`, 'before-source-book.json'],
  [`${target}/${edition}/book.json`, 'before-edition-book.json'],
  [decisionFile, 'decision.json'],
]) fs.copyFileSync(from, `${output}/${name}`, fs.constants.COPYFILE_EXCL)
const copies = []
for (const [from, to] of [
  ...sourceFiles.map(file => [`${source}/lessons/${id}/${file}`, `${target}/lessons/${id}/${file}`]),
  ...modernFiles.map(file => [`${source}/${edition}/lessons/${id}/${file}`, `${target}/${edition}/lessons/${id}/${file}`]),
]) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copies.push({ from, to, sha256: hash(to), bytes: fs.statSync(to).size })
}
for (const [file, value] of [
  [`${target}/book.json`, nextSource], [`${target}/${edition}/book.json`, nextEdition],
]) fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
fs.copyFileSync(`${target}/book.json`, `${output}/after-source-book.json`, fs.constants.COPYFILE_EXCL)
fs.copyFileSync(`${target}/${edition}/book.json`, `${output}/after-edition-book.json`, fs.constants.COPYFILE_EXCL)
const render = read(`${tmp}/production-modern10c125/first-render/stdout.txt`)
const result = {
  executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd(),
  started, finished: new Date().toISOString(), exitCode: 0,
  lesson: id, copies, sourceProseObjects: selectedSource.prose_blocks,
  renderedParagraphs: render.lessons.find(item => item.lesson === id).prose,
  exercises: 0, answers: 0, choices: 0, options: 0, figures: 0, sourcePages: [220, 221],
  beforeSourceBookSha256: hash(`${output}/before-source-book.json`),
  afterSourceBookSha256: hash(`${output}/after-source-book.json`),
  beforeEditionBookSha256: hash(`${output}/before-edition-book.json`),
  afterEditionBookSha256: hash(`${output}/after-edition-book.json`),
  existingSourceAndEditionEntriesUnchanged: true,
  existingSourceAuditAndPartialQualificationsUnchanged: true,
  sourceAssemblyWarningsRetained: assembled.audit.warnings,
  prior124Promoted: false, chapterSupplementPromoted: false, fullBookApproved: false,
  qualification: 'One newly approved offline125 only. Prior124 ownership and incomplete chapter supplement remain excluded. Source-relative 本世纪 and the first TEXT review presentation limitation remain. No old PASS reruns, math/input empty-set claim, DB, app, Git, publication, deployment or handoff.',
}
fs.writeFileSync(`${output}/promotion.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ lesson: id, copies: copies.length,
  sourceProseObjects: result.sourceProseObjects, renderedParagraphs: result.renderedParagraphs,
  exercises: 0, answers: 0, choices: 0, options: 0, figures: 0,
  prior124Promoted: false, chapterSupplementPromoted: false, fullBookApproved: false }))
