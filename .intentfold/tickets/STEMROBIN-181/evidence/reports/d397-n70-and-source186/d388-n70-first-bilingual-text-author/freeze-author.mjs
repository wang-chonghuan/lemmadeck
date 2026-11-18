import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const writeNew = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const list = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const p = path.join(dir, entry.name)
  assert(!entry.isSymbolicLink(), 'Never follow symlinks during owned-output freeze')
  return entry.isDirectory() ? list(p) : [p]
}).sort()
const fileRecord = (p) => ({ path: p, sha256: sha(p), bytes: fs.statSync(p).size })
const checkedInputs = read('inputs-before.json').inputs.map((input) => {
  const sha256After = sha(input.path)
  assert.equal(sha256After, input.sha256Before, `Input drift: ${input.path}`)
  return { ...input, sha256After, unchanged: true }
})
writeNew('inputs-after.json', { inputs: checkedInputs, allUnchanged: true, imageFilesReadOrHashed: 0 })
const check = read('text-check-final.json')
assert.equal(check.status, 'PASS-SCOPED-STRUCTURE-TEXT-ONLY')
assert.equal(check.errors.length, 0)
const alignment = read('bilingual-alignment.json')
const mapping = read('source-sentence-mapping.json')
const author = read('author-input.json')
assert.equal(mapping.sourceSentenceCount, 45)
assert.equal(alignment.unitCount, 64)
const templates = ['lesson.template.json', 'english.lesson.template.json', 'exercises.template.json', 'english.exercises.template.json', 'figures.template.json']
assert.deepEqual(fs.readdirSync(path.join(root, 'candidate')).sort(), templates.slice().sort())
for (const language of ['zh', 'en']) {
  const lessonName = language === 'zh' ? 'lesson.template.json' : 'english.lesson.template.json'
  const flow = read(`prose-flow/${language}-final.json`)
  assert.equal(flow.candidateSha256, sha(path.join(root, 'candidate', lessonName)))
  assert.equal(flow.result.paragraphs.length, 25)
  assert.equal(flow.result.boundaries.length, 7)
}
const outputsBeforeReport = list(root).map(fileRecord)
writeNew('report.json', {
  schema: 'STEMROBIN-181/n70-first-bilingual-text-author-report@1',
  ticket: 'STEMROBIN-181',
  batch: 'd388',
  card: 'phy10-c2-s2-n70',
  status: 'BILINGUAL-TEXT-AUTHORED-AWAITING-INDEPENDENT-REVIEWS',
  outputDirectory: root,
  candidateDirectory: path.join(root, 'candidate'),
  result: {
    sourceBlocks: 26,
    paragraphBlocksIncludingFootnotes: 14,
    footnotes: 2,
    captions: 6,
    pendingFigurePlaceholders: 6,
    mappedSourceSentences: 45,
    totalSourceSentences: 45,
    missingSourceSentences: 0,
    bilingualUnits: 64,
    modernClarificationUnits: alignment.units.filter((u) => u.provenance === 'modern-clarification').length,
    finalProseParagraphsPerLanguage: 25,
    conceptBoundariesPerLanguage: 7,
    sourceExercises: 0,
    chineseExercises: 0,
    englishExercises: 0,
    inventedExercisesChoicesAnswers: 0,
    unregisteredFormulaChanges: 0,
    newEquations: 0,
  },
  checks: {
    sourceTextHashesBeforeAfter: 'PASS-7-SCOPED-INPUTS-UNCHANGED',
    sourceSnapshotAndIdentity: 'PASS-SCOPED-TEXT',
    mathAndNumberReferenceSignatures: 'PASS-52-BILINGUAL-BLOCKS',
    sourceSentenceMapping: 'PASS-AUTHOR-COVERAGE-NOT-INDEPENDENT-SEMANTIC-APPROVAL',
    finalProseFlow: 'PASS-TOOL-RESOLVED-BEFORE-AFTER-ANCHORS',
    zeroExercises: 'PASS-EXACT-ORIGINAL-ZERO',
    independentSCI: 'PENDING',
    independentZHEN: 'PENDING',
    FIG: 'PENDING',
    DISPLAY: 'PENDING',
    fullDISPLAY: 'HOLD',
    fullGate2: 'HOLD',
    completeCard: 'HOLD',
    productAC: 'NOT-RUN-NOT-PASS',
  },
  sourceScope: {
    source185FullPage: 'HOLD-preserved',
    source185SelectedPrefix: 'p0185#1..7-independent-PASS-inherited-from-d387',
    n70ActualSource185Refs: ['p0185#1', 'p0185#2', 'p0185#3', 'p0185#4', 'p0185#5', 'p0185#6'],
    heldBlock: 'p0185#8-belongs-to-n71-outside-this-candidate',
    n71SourceImported: false,
    n71Complete: false,
    sourcePagesAdded: 0,
    completeCardsAdded: 0,
    delivered98LessonsChanged: false,
  },
  inheritedT18Scope: {
    textTasks: '14/16-unchanged',
    heldTasks: '1/9-unchanged',
    conditionalHOLD: 'preserved',
    oldVisualEvidenceChanged: false,
    originalCheckerFAIL: 'preserved-not-rerun',
    fullDISPLAY: 'HOLD',
    fullGate2: 'HOLD',
    completeCard: 'HOLD',
    scopeReviewedInThisBatch: false,
  },
  scientificCoverage: author.scientificEvidencePolicy,
  independentReviewFocus: [
    'Terminology: sphere center versus a thin-lens optical center.',
    'Source footnotes: small ray height relative to radius and small principal-axis angles remain explicit.',
    'Point focusing and focal plane are approximations, not exact all-aperture/all-field claims.',
    'Real rays versus backward extensions; real concave focus and virtual convex focus.',
    'Farther/nearer source movement is explicitly relative to the focal position.',
    'Vertex-to-focus distance and the source F notation, with no new signed equation.',
    'Modern clarification is visibly labeled and separately mapped; no external optics citation or page number was fabricated.',
    'English captions are translated, but frozen identity labels and title remain unchanged; localized_title is an authoring aid, not a claimed product localization integration.',
  ],
  figurePolicy: {
    scope: 'fig-141..fig-146-association-only',
    sourceHashDeclarations: 'Inherited unchanged from prepared figure template; no source image bytes or pixels were read or reverified.',
    sourceRawModernImagesOpened: 0,
    newFigureSpecsOrArtwork: 0,
    renderedOrApprovedFigures: 0,
    readyClaim: false,
  },
  actualOpens: [],
  totals: { priorImageOpens: 24, newImageOpens: 0, cumulativeImageOpens: 24, imageLimit: 24, imageReopens: 0, newWorkers: 0 },
  forbiddenActionsPerformed: {
    reset: false,
    workerChatWorktreeBranchCreation: false,
    nativeFinalize: false,
    renderScreenshotCropResize: false,
    paidGeneration: false,
    sourcePixelReview: false,
    readAnswerKeysOrDrafts: false,
    indexMeterCanonicalChanges: false,
    GitDBCommitPushDeploy: false,
    cleanup: false,
  },
  commandEvidence: [
    { command: ['node', path.join(root, 'author.mjs')], exitCode: 0, result: 'Cloned verified template directory, authored candidates, emitted mappings and proseFlow evidence.' },
    { command: ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', path.join(root, 'validate-text.py')], exitCode: 0, result: 'Initial scoped text check, 52 blocks, zero errors.' },
    { command: ['node', path.join(root, 'revise-owned-text.mjs')], exitCode: 0, result: 'Two prose clarifications synchronized into owned outputs, final proseFlow observed.' },
    { command: ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', path.join(root, 'validate-text.py'), 'text-check-final.json'], exitCode: 0, result: 'Final scoped text check, 52 blocks, zero errors.' },
  ],
  sourceInputs: checkedInputs,
  candidateFiles: templates.map((name) => fileRecord(path.join(root, 'candidate', name))),
  evidenceFiles: outputsBeforeReport,
  freezePolicy: 'All owned regular output files frozen to mode 0444; final output-frozen-manifest binds report, author-freeze and payload hashes. This report is not an approval.',
  stopCondition: 'This text-only batch ends here. No image opens remain authorized; await the parent human-authorized next gap.',
})
writeNew('author-freeze.json', {
  schema: 'STEMROBIN-181/n70-bilingual-author-freeze@1',
  card: 'phy10-c2-s2-n70',
  status: 'AUTHOR-FROZEN-SCI-ZHEN-FIG-DISPLAY-PENDING',
  approved: false,
  ready: false,
  report: fileRecord(path.join(root, 'report.json')),
  sourceInputs: checkedInputs,
  candidateFiles: templates.map((name) => fileRecord(path.join(root, 'candidate', name))),
  coverage: fileRecord(path.join(root, 'coverage.json')),
  sourceSentenceMapping: fileRecord(path.join(root, 'source-sentence-mapping.json')),
  bilingualAlignment: fileRecord(path.join(root, 'bilingual-alignment.json')),
  scientificBindings: fileRecord(path.join(root, 'scientific-source-bindings.json')),
  scopedTextCheck: fileRecord(path.join(root, 'text-check-final.json')),
  finalFlow: ['zh', 'en'].map((l) => fileRecord(path.join(root, `prose-flow/${l}-final.json`))),
  pending: ['SCI', 'ZHEN', 'FIG', 'DISPLAY'],
  holds: ['source185-full-page', 'fullDISPLAY', 'fullGate2', 'complete-card'],
  sourceParagraphsFullyMapped: true,
  emptyExercisesPreserved: true,
  sourceSnapshotsUnchanged: true,
  imageBudget: { historical: 24, new: 0, total: 24, limit: 24 },
  frozenMode: '0444',
  selfHashPolicy: 'Author-freeze self hash is bound by output-frozen-manifest, avoiding a circular digest.',
})
for (const p of list(root)) fs.chmodSync(p, 0o444)
const payload = list(root).map((p) => {
  const mode = (fs.statSync(p).mode & 0o777).toString(8).padStart(4, '0')
  assert.equal(mode, '0444')
  return { ...fileRecord(p), mode }
})
writeNew('output-frozen-manifest.json', {
  schema: 'STEMROBIN-181/n70-author-output-frozen-manifest@1',
  directory: root,
  status: 'AUTHOR-OUTPUTS-FROZEN-NOT-APPROVED',
  files: payload,
  regularPayloadFiles: payload.length,
  allPayloadModesVerified: '0444',
  includesSelf: false,
  selfHashPolicy: 'Manifest self hash is computed and returned after its own 0444 freeze; not embedded recursively.',
  imageBudget: { historical: 24, new: 0, total: 24, limit: 24 },
})
const manifest = path.join(root, 'output-frozen-manifest.json')
fs.chmodSync(manifest, 0o444)
for (const record of payload) {
  assert.equal(sha(record.path), record.sha256)
  assert.equal(fs.statSync(record.path).mode & 0o777, 0o444)
}
assert.equal(fs.statSync(manifest).mode & 0o777, 0o444)
for (const input of checkedInputs) assert.equal(sha(input.path), input.sha256Before)
console.log(JSON.stringify({
  status: 'AUTHOR-FROZEN-NOT-APPROVED',
  filesFrozen0444: list(root).length,
  newImageOpens: 0,
  cumulativeImageOpens: 24,
  summary: ['report.json', 'author-freeze.json', 'output-frozen-manifest.json', ...templates.map((n) => `candidate/${n}`)]
    .map((name) => ({ ...fileRecord(path.join(root, name)), mode: '0444' })),
}, null, 2))
