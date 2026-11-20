import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, core, read, bind, save, hash } from './retain-scoped-evidence-02.mjs'

const output = path.join(tmp, 'n60-source-admission-01.json')
assert.ok(!fs.existsSync(output), output)
const affected215216Path = path.join(tmp, 'source219-FIRST-review-01/verdict215216-affected.json')
const affected215216 = read(affected215216Path)
assert.equal(affected215216.status, 'ACCEPT-THREE-ISOLATED-METADATA-REPAIRS-ONLY')
assert.deepEqual(affected215216.verdicts.map(v => v.finding),
  ['F215-EMPHASIS', 'F216-EMPHASIS', 'F216-NAMESPACE'])
const collection219Path = path.join(tmp, 'source219-FIRST-review-01-collection-01.json')
assert.equal(read(collection219Path).outputsVerified, 21)
const collection220221Path = path.join(tmp, 'source220221-FIRST-review-01-collection-01.json')
const collection220221 = read(collection220221Path)
const affected217218Path = path.join(tmp, 'source220221-FIRST-review-01/metadata217218-affected-review.json')
assert.ok(collection220221.outputs.some(b => b.path === affected217218Path))
const affected217218 = read(affected217218Path)
assert.deepEqual([...affected217218.acceptedFindingIds].sort(), [
  'F217-NAMESPACE', 'F218-NAMESPACE', 'F217-EMPHASIS', 'F218-HEADINGTYPE-N61', 'F218-EMPHASIS',
].sort())
assert.deepEqual(affected217218.currentAffectedFAIL, [])
assert.match(affected217218.status, /PASS|ACCEPT/)
const headingPath = path.join(tmp, 'source217218-FIRST-review-01/heading215-adjudication.json')
assert.equal(read(headingPath).headingContractApproval, 'PASS_N60_BLOCK_ROLE_ONLY')
const first215216Path = path.join(tmp, 'source215216-FIRST-review-01/report.json')
const first215216 = read(first215216Path)
assert.ok(first215216.seamsAndOwners.some(v =>
  v.object === 'figure77' && v.verdict === 'EXPLICIT-SOURCE-OWNER-BODY1-OF-§60'))
const first217218Path = path.join(tmp, 'source217218-FIRST-review-01/source217218-review.json')
const first217218 = read(first217218Path)
assert.equal(first217218.textMathNumbersPunctuationAndRows.status, 'PASS_PAGE_LOCAL')
assert.ok(first217218.flagsSeamsHeadingsAndOwners.some(v =>
  v.boundary === '217-to218' && v.judgment === 'PASS_LITERAL_OBJECT_JOIN'))
const source212ReviewPath = path.join(tmp, 'source211212-FIRST-review-01/report.json')
const sourceDescriptors = [
  { physical: 212, artifact: 'source211212-author', native: 'source211212-author', figures: [], refs: [1], repairs: 0 },
  { physical: 215, artifact: 'source215216-metadata-repair-01', native: 'source213215-author', figures: [77], refs: [6, 8, 9, 10, 11, 12, 13, 14], repairs: 1 },
  { physical: 216, artifact: 'source215216-metadata-repair-01', native: 'source216218-author', figures: [78, 79, 80], refs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], repairs: 1 },
  { physical: 217, artifact: 'source217218-metadata-repair-01', native: 'source216218-author', figures: [81, 82], refs: Array.from({ length: 13 }, (_, i) => i + 1), repairs: 1 },
  { physical: 218, artifact: 'source217218-metadata-repair-01', native: 'source216218-author', figures: [], refs: [1, 2, 3, 4, 5, 6, 7, 8], repairs: 1 },
]
const files = [
  affected215216Path, affected217218Path, collection219Path, collection220221Path,
  headingPath, first215216Path, first217218Path, source212ReviewPath,
  path.join(tmp, 'source217218-FIRST-review-01-collection-01.json'),
  path.join(tmp, 'source215216-metadata-repair-01/result.json'),
  path.join(tmp, 'source217218-metadata-repair-01/result.json'),
  path.join(core, 'evidence/stemrobin188-source215216/metadata-affected-review/bindings.json'),
  path.join(core, 'evidence/stemrobin188-source215216/N60-heading-adjudication/bindings.json'),
  path.join(tmp, 'assemble-n60.py'), path.join(tmp, 'g10-n60.mjs'),
  new URL(import.meta.url).pathname,
]
const selected = []
const pages = sourceDescriptors.map(p => {
  const id = String(p.physical).padStart(4, '0')
  const artifactDirectory = path.join(tmp, p.artifact, 'artifacts/9-10g/pages', id)
  const workDirectory = path.join(tmp, p.native, 'work/9-10g/pages', id)
  const data = read(path.join(artifactDirectory, 'page.json'))
  const audit = read(path.join(artifactDirectory, 'audit.json'))
  assert.equal(data.meta.numbering_scope, 'g10')
  assert.deepEqual(audit.errors, [])
  assert.equal(audit.lines_printed, audit.lines_md)
  const original = bind(path.join(workDirectory, 'page.png'))
  assert.equal(original.sha256, data.meta.render.sha256)
  const preparedLayout = bind(path.join(workDirectory, 'layout.json'))
  const selectedFigures = p.figures.map(number => {
    const figureID = `fig-g10-${number}`
    const f = data.meta.figures.find(f => f.id === figureID)
    assert.ok(f, figureID)
    const crop = bind(path.join(tmp, p.artifact, 'work/9-10g/pages', id, 'figures', `${figureID}.png`))
    return { id: figureID, ...crop }
  })
  const selectedRefs = p.refs.map(i => `p${id}#${i}`)
  selected.push(...p.refs.map(i => ({ ...data.blocks[i - 1], ref: `p${id}#${i}` })))
  files.push(...['page.md', 'page.json', 'audit.json'].map(n => path.join(artifactDirectory, n)),
    original.path, preparedLayout.path, ...selectedFigures.map(f => f.path))
  return {
    physical: p.physical, artifactDirectory, workDirectory, original, preparedLayout, selectedFigures,
    selectedRefs, nativeCountsReused: [audit.lines_printed, audit.lines_md],
    sourcePageRepairsUsed: p.physical === 212 ? 1 : p.repairs,
    ancestorOnlyUsesUnchangedOriginal212Title: p.physical === 212,
    currentAuditAliasNotNewNativeReceipt: [216, 217].includes(p.physical),
  }
})
assert.deepEqual(selected.filter(b => b.kind === 'fig').map(b => b.id),
  Array.from({ length: 6 }, (_, i) => `fig-g10-${77 + i}`))
assert.deepEqual(selected.filter(b => b.kind === 'ex').map(b => b.label),
  ['195', '196', '197', '198', '198', '199', '200', '201', '202', '203', '204', '205'])
assert.equal(read(path.join(tmp, 'source217218-metadata-repair-01/artifacts/9-10g/pages/0218/page.json')).blocks[8].kind, 'h3')
save(output, {
  schema: 'stemrobin188-scoped-readable-source-admission@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g', lesson: 'geo910-c2-s3-n60',
  status: 'pass-for-readable-n60-source-only-with-local-holds',
  preheadingFigure77OwnershipApproved: true, namespaceIntegrationApproved: true,
  pages, scope: {
    first: 'p0215#9', rightBoundaryExcluded: 'p0218#9', ancestorTitleOnly: 'p0212#1',
    preheadingOwnedFigureRefs: ['p0215#6', 'p0215#8'],
    exercise198Join: ['p0217#12', 'p0218#1'],
    exercises: Array.from({ length: 11 }, (_, i) => 195 + i),
    figures: Array.from({ length: 6 }, (_, i) => `fig-g10-${77 + i}`),
  },
  localHolds: {
    source215216: first215216.HOLD, source217218: first217218.HOLD,
    figure80RightLabel: 'UNREADABLE_NO_B1_OR_SYMMETRY_INFERENCE_MODERN_FIGURE_HOLD',
    figure82LeadingGlyph: 'C_LIKE_RASTER_RETAINED_EXACT_CODEPOINT_NOT_CLEARED',
    exactPanelCodepointsFineFontsEmphasisAndPunctuation: 'HOLD_UNCHANGED',
    source212ProceduralFAIL: 'HISTORICAL_FAIL_PRESERVED_ONLY_UNCHANGED_H1_USED',
    source214AndN59: 'OUTSIDE_N60_NO_PRIOR_LESSON_APPROVAL',
    N61: 'ONLY_BOUNDARY_H3_NOT_LESSON_ADMISSION',
  },
  inheritedReviews: [affected215216Path, affected217218Path, headingPath,
    first215216Path, first217218Path].map(bind),
  bindings: [...new Set(files)].map(bind),
  allHistoricalFIRSTsFAILsHOLDsAndRepairUsagePreserved: true,
  sourceBodyEditedByAdmission: false, nativeOrPassedStageRepeated: false,
  sourcePagesGloballyApproved: false, N59Excluded: true, N61Excluded: true,
  modernApproved: false, figuresApproved: false, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, selectedSourceObjects: selected.length,
  exercises: 11, figures: 6, status: 'N60-readable-source-only-localHOLDs-preserved' }))
