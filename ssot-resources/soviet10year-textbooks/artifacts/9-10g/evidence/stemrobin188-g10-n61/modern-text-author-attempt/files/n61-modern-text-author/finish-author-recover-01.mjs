import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../../../..')
const readPath = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const read = (relative) => readPath(path.join(own, relative))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const save = (relative, value, mode = 0o444) => {
  fs.writeFileSync(path.join(own, relative), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode })
  fs.chmodSync(path.join(own, relative), mode)
}
const manifestPath = path.join(path.dirname(own), 'n61-modern-text-author-inputs-01/manifest.json')
const manifest = readPath(manifestPath)
const before = read('input-bindings.before.json')
const after = read('input-bindings.after.json')
const check = read('focused-author-check-01.json')
const anchors = read('anchor-binding.json')
const flow = read('prose-flow.saved.json')
const freeze = read('FIRST/freeze.json')
const originalFailure = read('receipts/finish-author-01/command.json')
if (originalFailure.classification !== 'technical-execution-failure') {
  throw new Error('Recovery applies only to the saved report-aggregation execution failure')
}
const receipts = fs.readdirSync(path.join(own, 'receipts')).sort()
  .filter((stage) => fs.existsSync(path.join(own, `receipts/${stage}/command.json`)))
  .map((stage) => {
    const relative = `receipts/${stage}/command.json`
    return { path: relative, sha256: hash(fs.readFileSync(path.join(own, relative))), data: read(relative) }
  })
const finalBindings = ['lesson', 'exercises'].flatMap((name) => ['template', 'candidate'].map((suffix) => {
  const relative = `${name}.${suffix}.json`
  const filename = path.join(own, relative)
  const bytes = fs.readFileSync(filename)
  return { path: relative, sha256: hash(bytes), bytes: bytes.length,
    mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, '0'),
    reusedFromCompletedPartOfFailedFinishStage: true }
}))
const recovery = {
  schema: 'n61-author-technical-recovery@1',
  stage: 'Report receipt aggregation only',
  failedCommandReceipt: 'receipts/finish-author-01/command.json',
  cause: 'run-stage created its receipt directory before launching the child; the child enumerated that in-flight directory and tried to read its command.json before the wrapper had written it.',
  resolution: 'Only aggregate existing completed command.json receipts; retain the original failure and collect the successful recovery receipt during index sealing.',
  validOutputsReused: [
    'input-bindings.after.json', 'FIRST/freeze.json', 'focused-author-check-01.json',
    'prose-flow.saved.json', 'anchor-binding.json', ...finalBindings.map((item) => item.path),
  ],
  savedPriorChecksRerun: false,
  inputHashChecksRerun: false,
  finalCandidateWritesRepeated: false,
  contentChanges: 0,
  contentRepairsConsumed: 0,
  FIRSTScriptsUnchanged: true,
  originalFailedScript: 'FIRST/scripts/finish-author.mjs',
  recoveryScript: 'finish-author-recover-01.mjs',
  originalSealerScript: 'FIRST/scripts/seal-index.mjs',
  workingSealerChange: 'Collect recovery receipt and mark only the known original report-aggregation failure resolved; no content or check changes.',
}
save('technical-recovery-01.json', recovery)
const inheritedPaths = manifest.bindings.filter((item) => /\/(?:assemble-source-01|vectorize-source-01|assemble-source-02|adapt-prepare-isolated-01)\/command\.json$/.test(item.path))
const inherited = inheritedPaths.map((item) => ({ ...item, receipt: readPath(item.path), rerunByThisAuthor: false }))
const allObjects = check.all30ObjectComparison.map((item) => ({
  ...item,
  final_text: item.FIRST_text,
  finalContentBoundToCheckedFIRST: true,
  finalContentCheck: 'Reuse completed pre-failure saved-FIRST equality from the original finish script; no unaffected checks repeated',
}))
const admission = readPath(manifest.sourceAdmission.path)
save('author-report.json', {
  schema: 'stemrobin188-n61-modern-text-author-report@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6', book: '9-10g',
  lesson: 'geo910-c2-s3-n61', edition: 'modern-us-neutral',
  role: 'MODERN TEXT AUTHOR ONLY, NOT REVIEWER',
  status: 'authored-candidates-ready-for-parent-collection-and-independent-review',
  repository: repo, ownRoot: own,
  suppliedManifest: { path: manifestPath, sha256: before.manifest.sha256 },
  candidates: finalBindings,
  counts: { allObjects: 30, prose: 20, textualProse: 8, figureSlots: 6, captionSlots: 6, exercises: 10 },
  all30ObjectComparisonAndChangeMapping: allObjects,
  figureCaptionPairs: check.figureCaptionPairs,
  textPolicy: {
    sourceNeutral: true, semanticOrCulturalRewrites: 0,
    preservedNonWhitespaceCodepointSequence: true,
    literalOrderedFormulasPreserved: true,
    numeric_changes: [], historical_entities: [], errata: [],
    gradeMappingAdded: false, sourceMathCorrection: false,
    panelTransliterations: [], figureInspectionOrCreation: false,
    mathPunctuation: 'No Chinese prose punctuation inserted inside math; literal source math and outside punctuation retained.',
    protected: ['source218 accepted h3 repair and N60 exclusion', 'recall p0218#12,p0219#5',
      'frustum p0219#15,p0220#5 and literal ) immediately after $[O_1,O]$ outside math',
      'exercise209 p0220#12,p0221#1', 'source219 literal S_{侧} and S_{圆锥}',
      '207 raised circle literal prefix', '210 roof 苫 verb', 'all source emphasis, fine glyph/font/codepoint/punctuation HOLDs',
      'Figure88 prose/net roles and exercise215 refs', 'N62 exclusion'],
  },
  inputBindings: {
    before, after,
    afterEvidenceReused: 'The original finish stage saved and checked these bindings before its later receipt-aggregation error; no input-hash stage rerun.',
  },
  actualCommandReceipts: receipts,
  reusedPriorStages: inherited,
  first: { path: 'FIRST/freeze.json', sha256: hash(fs.readFileSync(path.join(own, 'FIRST/freeze.json'))),
    frozenBeforeFocusedChecks: true, files: freeze.files, immutable: true,
    byteAndPermissionBindingReused: 'Original finish stage completed FIRST byte/0444 comparison before the later receipt-aggregation error.' },
  focusedAuthorCheck: { path: 'focused-author-check-01.json',
    sha256: hash(fs.readFileSync(path.join(own, 'focused-author-check-01.json'))),
    status: check.status, helpers: check.helperBinding, failures: check.failures },
  savedActualFlow: { path: 'prose-flow.saved.json',
    sha256: hash(fs.readFileSync(path.join(own, 'prose-flow.saved.json'))), ...flow },
  anchorBinding: anchors,
  failures: {
    initialAuthorContentFailures: check.failures,
    technicalExecutionFailures: [{
      receipt: 'receipts/finish-author-01/command.json',
      data: originalFailure,
      stdout: 'receipts/finish-author-01/stdout.txt',
      stderr: 'receipts/finish-author-01/stderr.txt',
      retained: true,
      recovery: 'technical-recovery-01.json',
    }],
    preauthorDirectoryProbe: {
      command: 'ls -ld .intentfold/tickets/STEMROBIN-188/tmp/n61-modern-text-author',
      exitCode: 1, stdout: '',
      stderr: 'ls: .intentfold/tickets/STEMROBIN-188/tmp/n61-modern-text-author: No such file or directory\n',
      classification: 'Expected nonexistence inventory result establishing NEW own root; not a failed author stage.',
    },
    source220OriginalFAIL: 'Historical original missing-parenthesis FAIL retained, not overwritten by accepted repair.',
    bothSource220MissedFIRSTs: 'Both historical FIRST misses remain historical; existing single accepted repair1/1 reused, no source repair performed here.',
    source212ProceduralFAIL: manifest.sourceHolds.source212ProceduralFAIL,
  },
  technicalRecovery: recovery,
  repair: { limit: 1, used: 0, affectedOnlyChecks: [], genuineProseRepairs: 0,
    anchorInsertionNotContentRepair: true, technicalRecoveryNotContentRepair: true },
  counters: {
    initialAuthorRuns: 1, focusedAuthorChecks: 1, focusedAffectedOnlyChecks: 0,
    proseFlowRuns: 1, affectedProseFlowRuns: 0, postAnchorFlowRuns: 0,
    contentRepairsUsed: 0, sourceRepairsByThisAuthor: 0, imagesInspected: 0,
    sourceImageReads: 0, figuresCreated: 0, mathSyntaxChecks: 0, paidCalls: 0,
    sourceAdmissionReruns: 0, assembly1Reruns: 0, vectorizationReruns: 0,
    assembly2Reruns: 0, adaptPrepareReruns: 0, adaptFinalizeRuns: 0,
    nativeCalls: 0, sourceParserCalls: 0, counterCalls: 0, rendererCalls: 0,
    formalProjectChecks: 0, peerMessages: 0, backendCalls: 0, databaseCalls: 0,
    dependencyChanges: 0, commits: 0, pushes: 0, publications: 0,
    technicalExecutionFailures: 1, failedTechnicalStageRecoveryRuns: 1,
  },
  syntaxCheckNotNeeded: 'Already assembled exact source math retained; pure exact identity/signature checks do not constitute mathematical validity review. No KaTeX helper invocation.',
  holds: manifest.sourceHolds,
  figure87EvidenceSeparation: {
    historicalAuthorUnobservedHOLD: 'RETAINED, not overwritten',
    laterIndependentActualObservation: 'Inherited separately as recorded by supplied source admission; not observed or approved by this author',
  },
  inheritedSourceAdmission: {
    path: manifest.sourceAdmission.path, sha256: manifest.sourceAdmission.sha256,
    status: admission.status,
    historicalEvidenceReferences: admission.inheritedReviews,
    body: 'Existing admission reused as supplied; no transitive source images, review packages, answers or neighboring lessons opened.',
  },
  approvals: {
    authorSelfApproval: false, independentModernTextApproval: false, sourceApproval: false,
    figureApproval: false, wholeLessonApproval: false, templatesApplied: false,
    promoted: false, published: false, ticketClosed: false,
  },
  parentCollectionContract: 'Parent collects and CLOSES this author before reading outputs; no approval or promotion by author.',
}, 0o644)
console.log(JSON.stringify({ status: 'report-aggregation-technically-recovered',
  reusedFinalCandidates: finalBindings, contentRepairsUsed: 0,
  focusedChecksRerun: 0, flowReruns: 0, report: 'author-report.json',
  failureRetained: 'receipts/finish-author-01/command.json' }, null, 2))
