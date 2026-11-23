import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'source166-two-text-defects-revision1-13')
const original = path.join(tmp, 'source6g165166-author-first-11/artifacts/6-8g/pages/0166')
const changedJSON = path.join(own, 'page.json')
const changedMD = path.join(own, 'page.md')
const candidate = read(changedJSON)
const prior = read(path.join(original, 'page.json'))
const receipt = read(path.join(own, 'parse.execution.json'))
assert.equal(receipt.exitCode, 0)
const parsed = read(receipt.streams.stdout.path)
assert.deepEqual(parsed.meta, candidate.meta)
assert.equal(parsed.lines, 26)
const parseProjection = blocks => blocks.map(block => {
  const projected = { ...block }
  if (block.kind === 'fig') delete projected.id
  return projected
})
assert.deepEqual(parsed.blocks, parseProjection(candidate.blocks))
assert.deepEqual(
  candidate.blocks.filter(block => block.kind === 'fig'),
  prior.blocks.filter(block => block.kind === 'fig'),
)
assert.deepEqual(candidate.meta.figures, prior.meta.figures)
const changedPointers = []
function diff(before, after, pointer = '') {
  if (Object.is(before, after)) return
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    assert.deepEqual(Object.keys(after), Object.keys(before), pointer)
    for (const key of Object.keys(before)) diff(before[key], after[key], `${pointer}/${key}`)
  } else changedPointers.push(pointer)
}
diff(prior, candidate)
assert.deepEqual(changedPointers, ['/meta/notes/2', '/blocks/1/lines/2', '/blocks/9/lines/1'])
const reviewRoot = path.join(tmp, 'source165166-first-and163164-affected-review-12')
const reportFile = path.join(reviewRoot, 'report.json')
const record = {
  status: 'SOURCE166_TWO_TEXT_DEFECTS_REPAIRED_AFFECTED_REVIEW_PENDING',
  changedMD: bind(changedMD), changedJSON: bind(changedJSON),
  originalMD: bind(path.join(original, 'page.md')), originalJSON: bind(path.join(original, 'page.json')),
  changedPointers, contentRevisionsUsed: { 165: 0, 166: 1 },
  parsedStructureAndRows: { exitCode: 0, lines: 26, derivedFigureIdNotAParsedMarkdownField: true },
  technicalRecovery: {
    originalScript: bind(path.join(tmp, 'repair-source166-two-text-defects-13.mjs')),
    originalWrapperExitCode: 1, toolOutputChunk: '3e88bf',
    cause: 'Compared raw blocks.parse output against finalized page.json, which additionally stores derived fig.id. Only fig-220.id was absent in the parse result.',
    completedParserReceipt: bind(path.join(own, 'parse.execution.json')),
    candidateOrParserReplayed: false, contentFailureAdded: false,
  },
  source165NotEdited: true, figure220IdGeometryAndSourcePixelsUnchanged: true,
  originalNativeExitCode: 1, originalNativeRows: [26, 26],
  originalAuditHistoricalOnly: bind(path.join(original, 'audit.json')),
  nativeGlyphFAILPreserved: ['U+25AE', 'U+25BC'],
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  nativeFinalizeReplayed: false, cropRebuilt: false, sourceImagesOpened: false,
  parentImageLoads: 0, activeExecSessions: [], wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const inputs = path.join(own, 'affected-review-inputs.json')
save(inputs, {
  status: 'AFFECTED_ONLY_READY_NOT_DISPATCHED',
  scope: '166 missing 度, sentence stop, and corrected explanatory note only',
  changedMD: bind(changedMD), changedJSON: bind(changedJSON), repairRecord: bind(recordFile),
  originalMD: bind(path.join(original, 'page.md')), originalJSON: bind(path.join(original, 'page.json')),
  reusedIndependentFIRST: bind(path.join(reviewRoot, 'FIRST.md')),
  reusedIndependentReport: bind(reportFile),
  reusedIndependentManifest: bind(path.join(reviewRoot, 'result-manifest.json')),
  parserReceipt: bind(path.join(own, 'parse.execution.json')),
  instructions: 'Zero images. Reuse prior independent FIRST/detail-crop observations and all unaffected PASS. Review only two text rows and explanatory note, verify all other leaves unchanged. No native finalize/crop/parser replay, alphabet inference, full-page or whole-lesson approval. NativeU25AE/U25BC FAIL and220 tiny-mark topologyUNKNOWN remain. Revisions165:0,166:1. Original wrapper failure is a raw-parser/derived-id comparison mistake, not a source/math/native failure.',
})
console.log(JSON.stringify({
  candidate: bind(changedJSON), inputs: bind(inputs),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-source165166/two-text-defects-revision1-13',
    [
      bind(changedMD), bind(changedJSON), bind(path.join(original, 'page.md')),
      bind(path.join(original, 'page.json')), bind(path.join(own, 'parse.execution.json')),
      ...Object.values(receipt.streams), bind(recordFile), bind(inputs),
      bind(path.join(reviewRoot, 'FIRST.md')), bind(reportFile),
      bind(path.join(tmp, 'repair-source166-two-text-defects-13.mjs')),
      bind(path.join(tmp, 'retain-source166-completed-text-repair-13.mjs')),
    ],
    ['evidence/stemrobin188-6g-source165166/independent-review13/retention.json'],
    record,
  ),
}))
