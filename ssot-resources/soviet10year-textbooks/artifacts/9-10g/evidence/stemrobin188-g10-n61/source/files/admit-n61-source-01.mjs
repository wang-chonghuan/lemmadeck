import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save } from './retain-scoped-evidence-02.mjs'

const output = path.join(tmp, 'n61-source-admission-01.json')
assert.ok(!fs.existsSync(output), output)
const source219Path = path.join(tmp, 'source219-FIRST-review-01/verdict219-FIRST.json')
const source219 = read(source219Path)
assert.deepEqual(source219.definiteFAIL, [])
assert.equal(source219.objectAndMathComparison.noDefiniteMissingWordsOperatorsFactorsExponentsOrVisibleFigureObjects, true)
assert.equal(source219.continuationsAndOwners[0].verdict, 'SUPPORTED-BY-SUPPLIED-TEXT-ONLY')
const source220221Path = path.join(tmp, 'source220221-FIRST-review-01/source220221-review.json')
const source220221 = read(source220221Path)
assert.deepEqual(source220221.FAIL.map(f => f.id), ['F220-CLOSING-PAREN'])
assert.equal(source220221.pageVerdicts[1].status, 'PASS_PAGE_LOCAL_WITH_HOLDS')
assert.equal(source220221.seams[1].status, 'PASS_LITERAL_PAGE_LOCAL_JOIN')
const delimiterPath = path.join(tmp, 'source222223-FIRST-review-01/source220-delimiter-affected-review.json')
const delimiter = read(delimiterPath)
assert.deepEqual(delimiter.acceptedFindingIds, ['F220-CLOSING-PAREN'])
assert.deepEqual(delimiter.currentAffectedFAIL, [])
assert.equal(delimiter.oneGlyphFrozenDiff.allMathOpaqueEqual, true)
const boundaryPath = path.join(tmp, 'source222223-FIRST-review-01/source222223-review.json')
const boundary = read(boundaryPath)
assert.equal(boundary.status, 'PASS_LITERAL_OBJECTS_WITH_HOLDS')
assert.equal(boundary.headingBoundary.candidate, 'p0222#1 h3')
assert.equal(boundary.headingBoundary.predecessor.open, false)
assert.equal(boundary.headingBoundary.predecessor.label, '215')
const headingPath = path.join(tmp, 'source220221-FIRST-review-01/metadata217218-affected-review.json')
assert.ok(read(headingPath).acceptedFindingIds.includes('F218-HEADINGTYPE-N61'))
const previous = read(path.join(tmp, 'n60-source-admission-01.json'))
const ancestor = previous.pages.find(p => p.physical === 212)
const descriptors = [
  { physical: 212, artifactDirectory: ancestor.artifactDirectory,
    workDirectory: ancestor.workDirectory, refs: [1], figures: [], repairs: 1 },
  { physical: 218, artifactDirectory: path.join(tmp, 'source217218-metadata-repair-01/artifacts/9-10g/pages/0218'),
    workDirectory: path.join(tmp, 'source216218-author/work/9-10g/pages/0218'),
    refs: [9, 10, 11, 12, 13], figures: [], repairs: 1 },
  { physical: 219, artifactDirectory: path.join(tmp, 'source219221-author/artifacts/9-10g/pages/0219'),
    workDirectory: path.join(tmp, 'source219221-author/work/9-10g/pages/0219'),
    figures: [83, 84, 85, 86], repairs: 0 },
  { physical: 220, artifactDirectory: path.join(tmp, 'source220-closing-paren-repair-01/artifacts/9-10g/pages/0220'),
    workDirectory: path.join(tmp, 'source219221-author/work/9-10g/pages/0220'),
    figures: [87, 88], repairs: 1 },
  { physical: 221, artifactDirectory: path.join(tmp, 'source219221-author/artifacts/9-10g/pages/0221'),
    workDirectory: path.join(tmp, 'source219221-author/work/9-10g/pages/0221'),
    figures: [], repairs: 0 },
  { physical: 222, artifactDirectory: path.join(tmp, 'source222224-author/artifacts/9-10g/pages/0222'),
    workDirectory: path.join(tmp, 'source222224-author/work/9-10g/pages/0222'),
    refs: [1], figures: [], repairs: 0 },
]
const inheritedPaths = [source219Path, source220221Path, delimiterPath, boundaryPath, headingPath]
const collectionPaths = [
  'source219-FIRST-review-01-collection-01.json',
  'source220221-FIRST-review-01-collection-01.json',
  'source222223-FIRST-review-01-collection-01.json',
].map(n => path.join(tmp, n))
assert.deepEqual(collectionPaths.map(p => read(p).outputsVerified), [21, 16, 17])
const files = [...inheritedPaths, ...collectionPaths,
  path.join(tmp, 'n60-source-admission-01.json'),
  path.join(tmp, 'source220-closing-paren-repair-01/result.json'),
  path.join(core, 'evidence/stemrobin188-source219221/source220-delimiter-affected-review/bindings.json'),
  path.join(core, 'evidence/stemrobin188-source222224/source222223-FIRST-review/bindings.json'),
  path.join(tmp, 'assemble-n61.py'), path.join(tmp, 'g10-n61.mjs'),
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
    ancestorOnly: p.physical === 212, rightBoundaryOnlyExcluded: p.physical === 222,
    source220CurrentAuditReusedNotNewNative: p.physical === 220 }
})
save(output, {
  schema: 'stemrobin188-scoped-readable-source-admission@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s3-n61',
  status: 'pass-for-readable-n61-source-only-with-local-holds',
  pages, scope: { first: 'p0218#9', rightBoundaryExcluded: 'p0222#1',
    ancestorTitleOnly: 'p0212#1', exercises: Array.from({ length: 10 }, (_, i) => 206 + i),
    figures: Array.from({ length: 6 }, (_, i) => `fig-g10-${83 + i}`),
    exercise209Join: ['p0220#12', 'p0221#1'],
    incomingRecallJoin: ['p0218#12', 'p0219#5'],
    frustumDelimiterJoin: ['p0219#15', 'p0220#5'] },
  localHolds: { source218: previous.localHolds.source217218,
    source219: source219.HOLD, source220221: source220221.HOLD,
    source220OriginalMissingParenFAIL: 'HISTORICAL_FAIL; current single repair accepted separately',
    source212ProceduralFAIL: previous.localHolds.source212ProceduralFAIL,
    source87AuthorUnobservedHOLD: 'Historical author HOLD retained; independent actual crop observed separately',
    source222: 'Only actual next h3 plus closed predecessor ex215 establishes local N61 right boundary; no N62 approval',
    exactCodepointsFineFontsEmphasisPunctuation: 'HOLD_UNCHANGED' },
  inheritedReviews: inheritedPaths.map(bind), bindings: [...new Set(files)].map(bind),
  allHistoricalFIRSTsFAILsHOLDsAndRepairUsagePreserved: true,
  sourceBodyEditedByAdmission: false, nativeOrPassedStageRepeated: false,
  sourcePagesGloballyApproved: false, N60Excluded: true, N62Excluded: true,
  modernApproved: false, figuresApproved: false, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, bindings: new Set(files).size,
  exercises: 10, figures: 6, imageLoads: 0, status: 'N61-readable-source-only-local-HOLDs-preserved' }))
