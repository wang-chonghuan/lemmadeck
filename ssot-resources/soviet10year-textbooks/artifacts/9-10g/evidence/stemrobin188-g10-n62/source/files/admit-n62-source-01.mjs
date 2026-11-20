import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

const output = path.join(tmp, 'n62-source-admission-01.json')
assert.ok(!fs.existsSync(output), output)
const firstPath = path.join(tmp, 'source222223-FIRST-review-01/source222223-review.json')
const first = read(firstPath)
assert.equal(first.status, 'PASS_LITERAL_OBJECTS_WITH_HOLDS')
assert.deepEqual(first.FAIL, [])
assert.equal(first.proofSeam.actualSourceContinuity, true)
const tailPath = path.join(tmp, 'source224225-n60-text-review-01/source224-review.json')
const tail = read(tailPath)
assert.equal(tail.status, 'PASS_LITERAL_OBJECTS_AND_NATIVE_CROPS_WITH_HOLDS')
assert.deepEqual(tail.FAIL, [])
assert.equal(tail.incoming223Seam.status, 'PASS_LOCAL_EX220_CLOSURE')
assert.equal(tail.headingBoundary.preheadingExercisesRemainPriorTopic, true)
assert.deepEqual(tail.objectReview.slice(0, 4).map(v => [v.ref, v.status]), [
  ['p0224#1', 'PASS'], ['p0224#2', 'PASS'], ['p0224#3', 'PASS'], ['p0224#4', 'PASS'],
])
const collectionPaths = [
  'source222223-FIRST-review-01-collection-01.json',
  'source224225-n60-text-review-01-collection-01.json',
].map(n => path.join(tmp, n))
assert.deepEqual(collectionPaths.map(p => read(p).outputsVerified), [17, 15])
const ancestor = read(path.join(tmp, 'n60-source-admission-01.json')).pages
  .find(p => p.physical === 212)
const descriptors = [
  { physical: 212, artifactDirectory: ancestor.artifactDirectory,
    workDirectory: ancestor.workDirectory, refs: [1], figures: [], repairs: 1 },
  ...[222, 223, 224].map(physical => ({
    physical,
    artifactDirectory: path.join(tmp, 'source222224-author/artifacts/9-10g/pages', `0${physical}`),
    workDirectory: path.join(tmp, 'source222224-author/work/9-10g/pages', `0${physical}`),
    refs: physical === 224 ? [1, 2, 3, 4] : undefined,
    figures: physical === 222 ? [89, 90] : physical === 223 ? [91] : [],
    repairs: physical === 224 ? 1 : 0,
  })),
]
const files = [firstPath, tailPath, ...collectionPaths,
  path.join(tmp, 'n60-source-admission-01.json'),
  path.join(tmp, 'assemble-n62.py'), path.join(tmp, 'g10-n62.mjs'),
  new URL(import.meta.url).pathname]
const pages = descriptors.map(p => {
  const data = read(path.join(p.artifactDirectory, 'page.json'))
  const audit = read(path.join(p.artifactDirectory, 'audit.json'))
  assert.equal(data.meta.numbering_scope, 'g10')
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  const original = bind(path.join(p.workDirectory, 'page.png'))
  assert.equal(original.sha256, data.meta.render.sha256)
  const preparedLayout = bind(path.join(p.workDirectory, 'layout.json'))
  const selectedFigures = p.figures.map(n => {
    const id = `fig-g10-${n}`
    assert.ok(data.meta.figures.some(f => f.id === id), id)
    return { id, ...bind(path.join(p.workDirectory, 'figures', `${id}.png`)) }
  })
  const refs = p.refs ?? data.blocks.map((_, i) => i + 1)
  files.push(...['page.md', 'page.json', 'audit.json'].map(n => path.join(p.artifactDirectory, n)),
    original.path, preparedLayout.path, ...selectedFigures.map(f => f.path))
  return { physical: p.physical, artifactDirectory: p.artifactDirectory,
    workDirectory: p.workDirectory, original, preparedLayout, selectedFigures,
    selectedRefs: refs.map(n => `p${String(p.physical).padStart(4, '0')}#${n}`),
    nativeCountsReused: [audit.lines_printed, audit.lines_md], sourcePageRepairsUsed: p.repairs,
    ancestorOnly: p.physical === 212,
    rightBoundaryOnlyExcludedRef: p.physical === 224 ? 'p0224#4' : null,
    source224OriginalCropFAILAndRepairPreserved: p.physical === 224 }
})
save(output, {
  schema: 'stemrobin188-scoped-readable-source-admission@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s3-n62',
  status: 'pass-for-readable-n62-source-only-with-local-holds',
  source224IndependentTailAndHeadingAccepted: true, pages,
  scope: { first: 'p0222#1', rightBoundaryExcluded: 'p0224#4',
    ancestorTitleOnly: 'p0212#1', exercises: Array.from({ length: 7 }, (_, i) => 216 + i),
    figures: ['fig-g10-89', 'fig-g10-90', 'fig-g10-91'],
    proofJoin: ['p0222#11', 'p0223#3'], exercise220Join: ['p0223#10', 'p0224#1'],
    lastTwoExercises: ['p0224#2', 'p0224#3'] },
  localHolds: { source222223: first.HOLD, source224: tail.HOLD,
    source212ProceduralFAIL: 'HISTORICAL_FAIL_PRESERVED_ONLY_UNCHANGED_H1_USED',
    source224CropFIRSTFAILAndSoleRepair: 'HISTORICAL_FAIL_AND_REPAIR1/1_PRESERVED',
    N63GlyphAndSource225Equation: 'EXCLUDED; d>alpha and unsquared R do not enter N62',
    exactPanelCodepointsFineFontsEmphasisPunctuation: 'HOLD_UNCHANGED' },
  inheritedReviews: [firstPath, tailPath].map(bind), bindings: [...new Set(files)].map(bind),
  allHistoricalFIRSTsFAILsHOLDsAndRepairUsagePreserved: true,
  sourceBodyEditedByAdmission: false, nativeOrPassedStageRepeated: false,
  sourcePagesGloballyApproved: false, N61Excluded: true, N63Excluded: true,
  modernApproved: false, figuresApproved: false, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, bindings: new Set(files).size,
  exercises: 7, figures: 3, imageLoads: 0, status: 'N62-readable-source-only-with-local-HOLDs' }))
