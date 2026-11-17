import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const source = 'ssot-resources/soviet10year-textbooks/artifacts/10c'
const assembled = '.intentfold/tickets/STEMROBIN-184/tmp/production-assembly10c92-95/10c'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const previous = read(`${source}/book.json`)
const added = read(`${assembled}/book.json`)
const id = 'ana10-c6-s4-n94'
const lesson = added.lessons.find(item => item.id === id)
assert.deepEqual(added.audit.errors, [])
assert.equal(lesson.card_id, id)
assert.equal(lesson.exercises, 15)
assert(!previous.lessons.some(item => item.id === id))
assert(!fs.existsSync(`${source}/lessons/${id}`))
for (const page of ['0092', '0093', '0094', '0095']) {
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    assert(fs.readFileSync(`${source}/pages/${page}/${file}`)
      .equals(fs.readFileSync(`${assembled}/pages/${page}/${file}`)))
  }
}
const exercises = read(`${assembled}/lessons/${id}/exercises.json`)
assert.deepEqual(exercises.exercises.map(item => item.number),
  Array.from({ length: 15 }, (_, index) => String(310 + index)))
fs.cpSync(`${assembled}/lessons/${id}`, `${source}/lessons/${id}`, { recursive: true })
const warning = added.audit.warnings.find(item => item.startsWith('p0094#1:'))
assert(warning)
fs.writeFileSync(`${source}/book.json`, JSON.stringify({
  ...previous,
  pages: previous.pages + added.pages,
  lessons: [...previous.lessons, lesson],
  audit: {
    ...previous.audit,
    warnings: [...new Set([...previous.audit.warnings, warning])],
    exercise_range: [previous.audit.exercise_range[0], 324],
    exercise_count: previous.audit.exercise_count + 15,
  },
}, null, 2) + '\n')
console.log(JSON.stringify({
  promoted: id, exercises: 15, sourceAssemblyReused: true,
  untouchedUnclaimedContainer: 'x1-承上页', partialN95Promoted: false,
  warningRetained: warning,
  paragraphDecision: 'p93 ends a complete roots sentence; p94 I/II is a new prose block in the same complete Example4 owner. No artificial open flag or source edit.',
}, null, 2))
