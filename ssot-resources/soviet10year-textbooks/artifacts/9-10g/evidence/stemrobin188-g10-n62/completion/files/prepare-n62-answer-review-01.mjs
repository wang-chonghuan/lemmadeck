import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const lesson = 'geo910-c2-s3-n62'
const source = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const root = path.join(tmp, 'n62-answer-review-inputs-01')
assert.ok(!fs.existsSync(root))
fs.mkdirSync(root)
const lessonDoc = read(path.join(source, 'lesson.json'))
const exercises = read(path.join(source, 'exercises.json')).exercises
assert.deepEqual(exercises.map(exercise => exercise.number),
  ['216', '217', '218', '219', '220', '221', '222'])
assert.ok(exercises.every(exercise => exercise.figure_refs.length === 0))
save(path.join(root, 'source-first.json'), {
  book: '9-10g', lesson,
  exercises: exercises.map(({ number, text }) => ({ number, text })),
  definitions: [0, 7, 9, 12].map(block =>
    ({ block, text: lessonDoc.prose[block].text })),
  figureInputsNeeded: false, sourceSolutionsOrKeysIncluded: false,
})
const candidate = path.join(tmp, 'n62-answer-author/answer-keys.candidate.json')
assert.equal(read(candidate).answers.length, 7)
save(path.join(root, 'manifest.json'), {
  ticket: 'STEMROBIN-188', lesson,
  firstInput: bind(path.join(root, 'source-first.json')),
  sourceBindings: ['lesson.json', 'exercises.json'].map(name => bind(path.join(source, name))),
  keyLast: bind(candidate),
  bookAnswersAvailable: false, requiredImages: 0,
  existingModernAndSourcePASSsReused: true, wholeLessonApproved: false,
})
console.log(JSON.stringify({ root, images: 0, sourceAndKeySeparated: true,
  candidateSHA256: hash(candidate) }))
