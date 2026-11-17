import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = `${ticket}/production-assembly10c114-heading-fixed/10c`
const target = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const edition = 'editions/modern-us-neutral'
const id = 'ana10-c8-s2-n114'
const output = `${ticket}/production-promoted10c114`
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(output), 'Only the first canonical promotion')
const decisionFile = `${ticket}/production-modern10c114-promotion-decision.json`
const decision = read(decisionFile)
assert.equal(decision.lesson, id)
assert.equal(decision.status, 'APPROVED_OFFLINE_ONLY')
assert.equal(decision.visualApproved, true)
assert.equal(decision.zeroExercises, true)
assert.equal(decision.fullBookApproved, false)
assert.equal(hash(decision.retainedVisualManifest.path), decision.retainedVisualManifest.sha256)
const retained = read(`${target}/evidence/batch012-114-first-modern-empty-answer/copy-manifest.json`)
const copied = new Map(retained.copied.map(item => [item.source, item]))
function bound(file) {
  const item = copied.get(file)
  assert(item, `No retained first-operation binding: ${file}`)
  assert.equal(hash(file), item.sha256)
  assert.equal(hash(item.retained), item.sha256)
}
for (const file of ['lesson.json', 'lesson.md', 'exercises.json']) bound(`${source}/lessons/${id}/${file}`)
const modernFiles = [
  'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  'answer-keys.json', 'answer-keys.audit.json', 'choice-set/README.md',
]
for (const file of modernFiles) bound(`${source}/${edition}/lessons/${id}/${file}`)
assert.equal(read(`${source}/${edition}/lessons/${id}/answer-keys.audit.json`).answerCount, 0)
const beforeSource = read(`${target}/book.json`)
const beforeEdition = read(`${target}/${edition}/book.json`)
const assembled = read(`${source}/book.json`)
const modernBook = read(`${source}/${edition}/book.json`)
const selectedSource = assembled.lessons.find(item => item.id === id)
const selectedEdition = modernBook.lessons.find(item => item.id === id)
assert(selectedSource && selectedEdition)
for (const previous of [beforeSource, beforeEdition]) {
  assert(!previous.lessons.some(item => item.id === id))
}
for (const directory of [`${target}/lessons/${id}`, `${target}/${edition}/lessons/${id}`])
  assert(!fs.existsSync(directory))
assert.equal(assembled.pages, 4)
const nextSource = {
  ...beforeSource,
  pages: beforeSource.pages + assembled.pages,
  lessons: [...beforeSource.lessons, selectedSource],
}
const nextEdition = { ...beforeEdition, lessons: [...beforeEdition.lessons, selectedEdition] }
assert.deepEqual(nextSource.lessons.slice(0, beforeSource.lessons.length), beforeSource.lessons)
assert.deepEqual(nextEdition.lessons.slice(0, beforeEdition.lessons.length), beforeEdition.lessons)
assert.deepEqual(nextSource.audit, beforeSource.audit)
fs.mkdirSync(output)
fs.copyFileSync(`${target}/book.json`, `${output}/before-source-book.json`, fs.constants.COPYFILE_EXCL)
fs.copyFileSync(`${target}/${edition}/book.json`, `${output}/before-edition-book.json`, fs.constants.COPYFILE_EXCL)
fs.copyFileSync(decisionFile, `${output}/decision.json`, fs.constants.COPYFILE_EXCL)
const copies = []
for (const [from, to] of [
  ...['lesson.json', 'lesson.md', 'exercises.json'].map(file =>
    [`${source}/lessons/${id}/${file}`, `${target}/lessons/${id}/${file}`]),
  ...modernFiles.map(file =>
    [`${source}/${edition}/lessons/${id}/${file}`, `${target}/${edition}/lessons/${id}/${file}`]),
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
const result = {
  lesson: id, copies, proseBlocks: 28, exercises: 0, answers: 0, choices: 0, options: 0, figures: 0,
  sourcePages: [168, 169, 170, 171],
  beforeSourceBookSha256: hash(`${output}/before-source-book.json`),
  afterSourceBookSha256: hash(`${output}/after-source-book.json`),
  beforeEditionBookSha256: hash(`${output}/before-edition-book.json`),
  afterEditionBookSha256: hash(`${output}/after-edition-book.json`),
  existingSourceAndEditionEntriesUnchanged: true,
  existingSourceAuditAndPartialQualificationsUnchanged: true,
  sourceAssemblyWarningsRetained: assembled.audit.warnings,
  incoming115Promoted: false,
  fullBookApproved: false,
  qualification: 'One newly approved offline lesson only. Faithful literal exp_a on both sides remains; modern uses sole registered correction. No old source/modern gates rerun; held pages, failures and UNKNOWNs unchanged. No DB/publisher/app/Git/deployment/handoff action. All four books remain incomplete.',
}
fs.writeFileSync(`${output}/promotion.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ lesson: id, copies: copies.length, proseBlocks: 28, exercises: 0,
  answers: 0, choices: 0, options: 0, figures: 0, incoming115Promoted: false, fullBookApproved: false }))
