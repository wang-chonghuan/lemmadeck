import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n29-text-and-nine-answers-author-first-06')
const reportFile = path.join(own, 'Report.json')
assert.equal(hash(reportFile), '6602e7ed3211c346df6a965cf5cec56fc9ba142f70834f9b9198873bfc2bae6b')
const report = read(reportFile)
assert.equal(report.status, 'AUTHOR_ONLY')
assert.equal(report.counts.ownSessions, 0)
assert.equal(report.counts.answerCandidates, 9)
const references = new Map([[reportFile, bind(reportFile)]])
for (const item of [...report.outputManifest, ...report.originalInputs]) {
  assert.equal(hash(item.path), item.sha256, item.path)
  references.set(item.path, { path: item.path, sha256: item.sha256 })
  if (item.role === 'immutable byte-identical baseline')
    assert.equal(fs.statSync(item.path).mode & 0o777, 0o444)
}
const flowFile = report.wordingNotes.find(item => item.evidence)?.evidence.path
const flow = read(flowFile)
assert.equal(flow.cwd ?? flow.workdir, repo)
assert.equal(flow.exitCode ?? flow.exit_code ?? flow.returncode, 0)
const collectionRoot = path.join(tmp, 'n29-text-and-answers-author-collection-06')
fs.mkdirSync(collectionRoot)
const collectionFile = path.join(collectionRoot, 'collection.json')
save(collectionFile, {
  status: 'AUTHOR_ONLY_N29_TEXT_AND_NINE_KEYS_AWAIT_INDEPENDENT_REVIEW',
  report: bind(reportFile), candidates: report.candidateBindings,
  counts: report.counts, wordingNotes: report.wordingNotes,
  mathematicsNotes: report.mathematicsNotes, diagnostics: report.diagnostics,
  sourceLogicClarificationNotSourceRewrite: true,
  originalFirstCheckFailureRetained: true,
  historicalFailedFullExerciseCandidateSnapshotAvailable: false,
  historicalFailureCoverage:
    'The original failure record preserves formula-sequence mismatch and repair facts; no complete failed candidate byte snapshot was returned. Do not reconstruct it and call it observed evidence.',
  authorOnlyNotIndependentApproval: true,
  sourceProducerReplays: 0, parentImageLoads: 0, published: false,
})
references.set(collectionFile, bind(collectionFile))
const contextFile = path.join(collectionRoot, 'figure-author-context.json')
const rawRoot = path.join(tmp, 'n29-draft-first-06/artifacts/6-8g')
save(contextFile, {
  status: 'N29_CANDIDATE_MODERN_TEXT_AUTHORITY_FOR_FIGURE_AUTHOR_ONLY',
  candidateText: report.candidateBindings.lesson,
  candidateExercises: report.candidateBindings.exercises,
  authorReport: bind(reportFile),
  sourceLesson: bind(path.join(rawRoot, 'lessons/geo68-c2-s4-n29/lesson.json')),
  originalFigures: [187, 188, 189].map(number => ({
    id: `fig-${number}`, source: bind(path.join(rawRoot, `figures/fig-${number}.png`)),
  })),
  figuresTemplate: bind(path.join(tmp,
    'n29-draft-first-06/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c2-s4-n29/figures.template.json')),
  sourceCropsAlreadyPASS: true, modernFiguresNotProducedOrApproved: true,
  native189DamagedGlyphIdentityStillUnknown: true,
  labelAdditionsFromProseMustNotBeClaimedAsSourcePixelIdentities: true,
  noNewNumericOrGeometricGivens: true, parentImageLoads: 0, published: false,
})
references.set(contextFile, bind(contextFile))
references.set(path.join(tmp, 'collect-n29-text-and-answers-author-06.mjs'),
  bind(path.join(tmp, 'collect-n29-text-and-answers-author-06.mjs')))
const retained = retainCurrent6g(
  'evidence/stemrobin188-6g-n29/text-and-answers-author-first06',
  [...references.values()],
  ['evidence/stemrobin188-6g-n29/assembly-and-prepare-first06/retention.json'],
  { status: 'AUTHOR_ONLY_N29_TEXT_AND_NINE_KEYS_AWAIT_INDEPENDENT_REVIEW',
    lesson: 'geo68-c2-s4-n29', proseBlocks: 23, answerCandidates: 9,
    autoAnswers: 1, ungradedAnswers: 8, imageLoads: 0,
    authorInvariantFailures: 1, affectedCandidateFormulaReferenceRepairs: 1,
    historicalFullFailedCandidateSnapshotNotReturned: true,
    sourceLogicClarificationOnly: true, modernFiguresPending: true },
)
console.log(JSON.stringify({ collection: bind(collectionFile), retained,
  figureContext: bind(contextFile) }))
