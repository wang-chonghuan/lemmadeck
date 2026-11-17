import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const assembled = '.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c104-106/10c'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const previous = read(`${source}/book.json`)
const added = read(`${assembled}/book.json`)
const id = 'ana10-c7-s1-n97'
const lesson = added.lessons.find(item => item.id === id)
assert.deepEqual(added.audit.errors, [])
assert.deepEqual(added.audit.warnings, [])
assert.equal(lesson.card_id, id)
assert.equal(lesson.exercises, 10)
assert.equal(lesson.prose_blocks, 15)
assert.deepEqual(read(`${assembled}/lessons/${id}/exercises.json`).exercises
  .map(exercise => exercise.number), Array.from({ length: 10 }, (_, i) => String(i + 392)))
assert(!previous.lessons.some(item => item.id === id))
assert(!fs.existsSync(`${source}/lessons/${id}`))
fs.cpSync(`${assembled}/lessons/${id}`, `${source}/lessons/${id}`, { recursive: true })
fs.writeFileSync(`${source}/book.json`, JSON.stringify({
  ...previous,
  pages: previous.pages + added.pages,
  lessons: [...previous.lessons, lesson],
}, null, 2) + '\n')
console.log(JSON.stringify({
  promoted: id, exercises: 10, prose: 15, sourceAssemblyReused: true,
  incompleteN98Promoted: false,
}, null, 2))
