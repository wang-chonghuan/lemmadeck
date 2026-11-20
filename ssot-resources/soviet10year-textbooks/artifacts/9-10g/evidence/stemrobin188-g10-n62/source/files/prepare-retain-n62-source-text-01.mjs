import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

const base = path.join(tmp, 'g10-n62')
const lesson = 'geo910-c2-s3-n62'
const stages = ['assemble-source-01', 'vectorize-source-01',
  'assemble-source-02', 'adapt-prepare-isolated-01']
stages.forEach(s => assert.equal(read(path.join(base, s, 'command.json')).exitCode, 0))
const sourceAdmission = bind(path.join(tmp, 'n62-source-admission-01.json'))
const source = read(sourceAdmission.path)
assert.equal(source.status, 'pass-for-readable-n62-source-only-with-local-holds')
const script = new URL(import.meta.url).pathname
if (process.argv[2] === 'prepare') {
  const raw = path.join(base, 'artifacts/9-10g/lessons', lesson)
  const templates = path.join(base, 'work/adapt/9-10g/modern-us-neutral/lessons', lesson)
  const rawLesson = bind(path.join(raw, 'lesson.json'))
  const rawExercises = bind(path.join(raw, 'exercises.json'))
  assert.equal(read(rawLesson.path).prose.length, 13)
  const exercises = read(rawExercises.path).exercises
  assert.deepEqual(exercises.map(e => e.number),
    Array.from({ length: 7 }, (_, i) => String(216 + i)))
  assert.deepEqual(exercises.find(e => e.number === '220').pages, ['p0223#10', 'p0224#1'])
  const initialTemplates = ['lesson.template.json', 'exercises.template.json']
    .map(n => bind(path.join(templates, n)))
  const figureContractsOnly = bind(path.join(templates, 'figures.template.json'))
  const files = [...new Set([
    rawLesson.path, rawExercises.path, path.join(raw, 'lesson.md'),
    ...initialTemplates.map(b => b.path), figureContractsOnly.path, sourceAdmission.path,
    path.join(base, 'source-bindings.json'), path.join(base, 'artifacts/9-10g/book.json'),
    ...stages.map(s => path.join(base, s, 'command.json')),
    ...source.pages.flatMap(p => ['page.json', 'audit.json'].map(n => path.join(p.artifactDirectory, n))),
    script,
  ])]
  const directory = path.join(tmp, 'n62-modern-text-author-inputs-01')
  assert.ok(!fs.existsSync(directory), directory)
  fs.mkdirSync(directory)
  save(path.join(directory, 'manifest.json'), {
    schema: 'stemrobin188-modern-text-author-inputs@1',
    status: 'pending-bounded-modern-text-author-only',
    ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson,
    rawLesson, rawExercises, initialTemplates, figureContractsOnly, sourceAdmission,
    sourceHolds: source.localHolds, originalCounts: { prose: 13, exercises: 7 },
    objectsRequired: 20, exercise220SourceRefs: ['p0223#10', 'p0224#1'],
    lastTwoExerciseRefs: ['p0224#2', 'p0224#3'],
    proofJoin: ['p0222#11', 'p0223#3'],
    sourceMathCorrectionsAndNumericChangesAuthorized: false,
    source224CropFAILAndSoleRepairPreserved: true, N63AndSource225Excluded: true,
    figureCreationOrInspectionAuthorizedHere: false, sourceApprovalRepeated: false,
    imagesPlanned: 0, contentRepairLimit: 1, contentRepairsUsed: 0,
    bindings: files.map(bind), templatesApplied: false, wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ directory, bindings: files.length,
    objectsRequired: 20, imagesPlanned: 0 }))
} else {
  assert.equal(process.argv[2], 'retain')
  retain(path.join(core, 'evidence/stemrobin188-g10-n62/source'), [
    ...inventory(base), sourceAdmission.path, ...source.bindings.map(b => b.path),
    path.join(tmp, 'n62-modern-text-author-inputs-01/manifest.json'), script,
  ], {
    schema: 'stemrobin188-N62-scoped-source-and-prepared-templates-retention@1',
    status: 'N62-only-source-assembly-and-three-vectorPASS-modern-templates-not-completion',
    admission: sourceAdmission, originalProseObjects: 13, exercises: 7, sourceFigures: 3,
    proofAndExercise220JoinsPreserved: true, source224LastTwoExercisesIncluded: true,
    source224OriginalCropFAILAndSoleRepairPreserved: true,
    allLocalHoldsAndSource212ProceduralFAILPreserved: true,
    N59N63PhysicalRangeWarningsNotLessonApproval: true,
    nativeSourceStagesRerun: 0, parentImages: 0, coreRawLessonsPromoted: false,
    wholeLessonApproved: false,
  })
}
