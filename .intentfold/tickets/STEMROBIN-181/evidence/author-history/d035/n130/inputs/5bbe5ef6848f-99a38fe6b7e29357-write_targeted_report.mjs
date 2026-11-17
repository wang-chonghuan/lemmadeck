import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const evidence = join(tmp, 'd035-source318-targeted-evidence');
const reportPath = join(tmp, 'd035-source318-targeted-review.json');
const priorPath = join(tmp, 'd035-source316-319-source-review.json');
const sourcePath = join(root, '.tmp/ld-s10y-lesson/9p/pages/0318/page.png');
const priorHash = '1bf8015aac39cec695413ef6db33e8a87a24206548d801244c07c61e16edfc80';
const candidateHash = '5e9953741ba2c10a984cbb8c624066804bff04f350cef43ac3a7397b95577be1';
const sourceHash = 'e454f4df18da41fe1421956da8e6786d32c981f5b761d75aecab135b413a777a';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const valueHash = value => hash(Buffer.from(JSON.stringify(value)));
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const binding = (path, expected) => {
  const bytes = readFileSync(path);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected);
  return { path, sha256, bytes: bytes.length, verified: true };
};

const priorBinding = binding(priorPath, priorHash);
const prior = json(priorPath);
const priorPage = prior.pages.find(page => page.physicalPage === 318);
assert.equal(priorPage.candidate.sha256, candidateHash);
assert.equal(priorPage.sourceSha256, sourceHash);
assert.equal(priorPage.independentRows.total, 25);
const candidateBinding = binding(priorPage.candidate.path, candidateHash);
const sourceBinding = binding(sourcePath, sourceHash);
const decisionsPath = join(evidence, 'targeted-decisions.json');
const decisions = json(decisionsPath);
const candidate = readFileSync(priorPage.candidate.path, 'utf8');
for (const proposal of decisions.exactAffectedProposals) {
  for (const line of proposal.frozenLines ?? [proposal.frozenLine]) {
    assert(candidate.includes(line));
  }
}
const cropManifestPath = join(evidence, 'crop-bindings.json');
const crops = json(cropManifestPath);
assert.equal(crops.length, 5);
const imageEvents = crops.map((crop, index) => {
  binding(crop.path, crop.sha256);
  assert.equal(crop.sourceSha256, sourceHash);
  return {
    event: index + 1,
    physicalPage: 318,
    kind: index < 2 ? 'bounded-source-locator-and-context' : 'bounded-source-detail',
    ...crop,
    actualViewOccurred: true,
  };
});
const retainedKeys = ['candidate', 'sourceSha256', 'footer', 'independentRows',
  'initialCountReceipt', 'confirmedSourceFacts', 'affectedProposals'];
const preservedBindings = Object.fromEntries(retainedKeys.map(key => [
  key, { valueSha256: valueHash(priorPage[key]), unchanged: true },
]));
const figure294 = prior.rawDiagramInventory.find(figure => figure.figure === 'fig-294');
const remainingUnresolved = priorPage.unresolvedFacts.slice(2);
const page = {
  ...structuredClone(priorPage),
  status: 'FAIL',
  sourceApproval: false,
  statusMeaning: 'The unchanged frozen candidate has two precisely supported text corrections. The two targeted HOLDs are resolved; this is not whole-page or figure approval.',
  unresolvedFacts: remainingUnresolved,
};
for (const key of retainedKeys) assert.deepEqual(page[key], priorPage[key]);
assert.equal(prior.countingOnlyProposal.metadata.counting.edge_margin_px, 100);

const report = {
  schema: 'ld-s10y-lesson/targeted-source-review@1',
  ticket: 'STEMROBIN-181',
  batch: 'd035-source318-targeted',
  reviewDate: '2026-11-17',
  role: 'FRESH BOUNDED AFFECTED-ONLY SOURCE REVIEWER',
  scope: {
    book: '9p',
    physicalPages: [318],
    printedPages: [309],
    sameDevelopmentInvocation: true,
    sameOpenProductionInvocation: true,
    sourceOnly: true,
    targets: [
      { id: 'S318-GLYPH-HOLD', refs: ['p0318#1.row5', 'p0318#1.row6'] },
      { id: 'S318-EMPHASIS-HOLD', ref: 'p0318#5.row1' },
    ],
    ownedReport: reportPath,
    ownedEvidenceDirectory: evidence,
    unownedWrites: 0,
    authorFilesModified: false,
    priorImageHistoryInherited: false,
    otherPriorSourceFactsReusedUnchanged: true,
    neighboringPageImagesOpened: false,
    sourcePage319UsedToChooseSubscript: false,
    punctuationWeightOutsideTheNamedHoldReviewed: false,
    childAgentsCreated: 0,
    imagePayloadsReturnedToParent: false,
  },
  status: 'FAIL',
  disposition: 'BOTH-TEXT-HOLDS-RESOLVED-EXACT-CORRECTIONS-SUPPORTED-NOT-APPLIED',
  sourceApproval: false,
  rawApproval: false,
  nativeApproval: false,
  cropApproval: false,
  modernApproval: false,
  fullCardApproval: false,
  hashBindings: {
    originalIndependentSourceReport: priorBinding,
    frozenInitialCandidate318: candidateBinding,
    originalSource318: sourceBinding,
    cropManifest: binding(cropManifestPath),
    targetedDecisions: binding(decisionsPath),
    evidenceScripts: [
      binding(join(evidence, 'make_target_crops.py')),
      binding(join(evidence, 'write_targeted_report.mjs')),
    ],
    allTargetBindingsMatch: true,
    priorReportAndFrozenCandidateAndSourceUnchanged: true,
  },
  imageBudget: {
    maximum: 8,
    actualImageOpens: 5,
    contextImageTotal: 5,
    sequential: true,
    fullPageOpens: 0,
    wholePageReopens: 0,
    sourceCropsAndControls: 5,
    renderedBitmapOpens: 0,
    reopens: 0,
    imageEvents,
    detailContract: 'Each image is a source-coordinate-bound original318 rectangle enlarged only by integer nearest-neighbor. No thresholding, sharpening, reconstruction, glyph renderer, OCR, or new PDF rendering was used.',
  },
  pages: [page],
  exactAffectedProposals: decisions.exactAffectedProposals,
  unchangedPriorSourceFacts: {
    authority: priorBinding,
    page318RetainedFields: preservedBindings,
    remainingPage318UnresolvedFacts: {
      values: remainingUnresolved,
      unchangedFromOriginalReport: true,
    },
    otherPages: {
      physicalPages: [316, 317, 319],
      recordsRemainAuthoritativeInOriginalReport: true,
      reviewedAgainHere: false,
      decisionsOverriddenHere: false,
    },
    figure294: {
      authorityPath: priorPath,
      priorInventoryValueSha256: valueHash(figure294),
      priorInventoryUnchanged: true,
      unresolvedSourceMark: figure294.unresolvedSourceMark,
      retainedInkFact: figure294.independentInventory.find(fact => fact.startsWith('A dark angled mark')),
      status: 'UNRESOLVED-OUTSIDE-TEXT-TARGETS',
      markMustNotBeErased: true,
      figurePixelsReviewedHere: false,
      rawApprovalGrantedHere: false,
      nativeOrModernApprovalGrantedHere: false,
    },
  },
  countingOnlyProposal: structuredClone(prior.countingOnlyProposal),
  countingDisposition: {
    inheritedFromOriginalReportUnchanged: true,
    inheritedProposalValueSha256: valueHash(prior.countingOnlyProposal),
    page318ExactSupportedPrintedRows: 25,
    freshRecountExecuted: false,
    edgeMarginPx: 100,
    appliedByThisReviewer: false,
    nativeExpectedResultAsserted: false,
    initialFailureRetained: true,
    newCountingMetadataOrCounterCodeProposed: false,
  },
  totals: {
    supportedPrintedRows318: 25,
    printedRowDelta: 0,
    resolvedTargetedTextLoci: 2,
    unresolvedTargetedTextLoci: 0,
    unappliedCorrectionProposals: 2,
    actualImageOpens: 5,
    sourceCandidateEdits: 0,
    nativeCountInvocations: 0,
    nativeFinalizeInvocations: 0,
    rawOrModernApprovals: 0,
    canonicalOrIndexOrMeterWrites: 0,
  },
  operationsNotPerformed: [
    'setup or freshness/update',
    'Plane operations',
    'tests, build, app startup or dependency installation',
    'DB or Git operations',
    'canonical, meter, index or charter writes',
    'candidate edits',
    'native recount, finalize, gate replay or source integration',
    'RAW, exact-crop, native, modern or full-card approval',
    'child-agent delegation or image payload handoff',
  ],
  handoff: 'Text report and existing evidence paths/hashes only. In both named318 occurrences delete only the period in the provisional i.s subscript, retaining the established script/i/s transcription conventions without source codepoint claims. In p0318#5.row1 remove only the whole-sentence bold markers; preserve all words, the period and every other approved span. These are supported proposals against the unchanged initial snapshot, not applied repairs or whole-page approval. Inherit exactly25rows and the unapplied counting.edge_margin_px100 proposal unchanged. Keep the294 angled-cell mark explicit and unresolved outside these targets.',
};
assert.deepEqual(report.countingOnlyProposal, prior.countingOnlyProposal);
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
binding(priorPath, priorHash);
binding(priorPage.candidate.path, candidateHash);
binding(sourcePath, sourceHash);
console.log(JSON.stringify({
  report: binding(reportPath),
  status: report.status,
  disposition: report.disposition,
  actualImageOpens: 5,
  printedRows318: 25,
  candidateAndSourceAndPriorReportUnchanged: true,
}, null, 2));
