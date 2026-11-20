import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

const base = path.join(tmp, 'g10-n61')
const lesson = 'geo910-c2-s3-n61'
const raw = path.join(base, 'artifacts/9-10g/lessons', lesson)
const templates = path.join(base, 'work/adapt/9-10g/modern-us-neutral/lessons', lesson)
const stages = ['assemble-source-01', 'vectorize-source-01',
  'assemble-source-02', 'adapt-prepare-isolated-01']
stages.forEach(s => assert.equal(read(path.join(base, s, 'command.json')).exitCode, 0))
const rawLesson = bind(path.join(raw, 'lesson.json'))
const rawExercises = bind(path.join(raw, 'exercises.json'))
const lessonData = read(rawLesson.path)
const exercises = read(rawExercises.path).exercises
assert.equal(lessonData.prose.length, 20)
assert.deepEqual(exercises.map(e => e.number),
  Array.from({ length: 10 }, (_, i) => String(206 + i)))
assert.deepEqual(exercises.find(e => e.number === '209').pages, ['p0220#12', 'p0221#1'])
const sourceAdmission = bind(path.join(tmp, 'n61-source-admission-01.json'))
const source = read(sourceAdmission.path)
assert.equal(source.status, 'pass-for-readable-n61-source-only-with-local-holds')
const initialTemplates = ['lesson.template.json', 'exercises.template.json']
  .map(n => bind(path.join(templates, n)))
const figureContractsOnly = bind(path.join(templates, 'figures.template.json'))
const files = [...new Set([
  rawLesson.path, rawExercises.path, path.join(raw, 'lesson.md'),
  ...initialTemplates.map(b => b.path), figureContractsOnly.path, sourceAdmission.path,
  path.join(base, 'source-bindings.json'), path.join(base, 'artifacts/9-10g/book.json'),
  ...stages.map(s => path.join(base, s, 'command.json')),
  ...source.pages.flatMap(p => ['page.json', 'audit.json'].map(n => path.join(p.artifactDirectory, n))),
  new URL(import.meta.url).pathname,
])]
const directory = path.join(tmp, 'n61-modern-text-author-inputs-01')
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
save(path.join(directory, 'manifest.json'), {
  schema: 'stemrobin188-modern-text-author-inputs@1',
  status: 'pending-bounded-modern-text-author-only',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
  rawLesson, rawExercises, initialTemplates, figureContractsOnly, sourceAdmission,
  sourceHolds: source.localHolds, originalCounts: { prose: 20, exercises: 10 },
  objectsRequired: 30, exercise209SourceRefs: ['p0220#12', 'p0221#1'],
  incomingRecallJoin: ['p0218#12', 'p0219#5'],
  frustumDelimiterJoin: ['p0219#15', 'p0220#5'],
  sourceMathCorrectionsAndNumericChangesAuthorized: false,
  source220HistoricalFAILAndSoleAcceptedRepairPreserved: true,
  source218Repair1AndActualHeadingContractPreserved: true,
  figureCreationOrInspectionAuthorizedHere: false, sourceApprovalRepeated: false,
  imagesPlanned: 0, contentRepairLimit: 1, contentRepairsUsed: 0,
  bindings: files.map(bind), templatesApplied: false,
  wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ directory, bindings: files.length,
  objectsRequired: 30, imagesPlanned: 0 }))
