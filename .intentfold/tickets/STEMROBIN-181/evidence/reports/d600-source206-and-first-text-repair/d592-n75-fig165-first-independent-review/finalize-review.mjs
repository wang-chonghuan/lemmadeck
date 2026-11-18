import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const authorPath = path.join(tmp, 'd577-n75-fig164165-first-modern-author/fig-165/report.json');
const hash = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const entry = (p) => ({ path: path.isAbsolute(p) ? p : path.join(root, p), sha256: hash(path.isAbsolute(p) ? p : path.join(root, p)) });
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, data) => fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
const author = load(authorPath);
const spec = load(author.artifacts.spec.path);
const auditPath = path.join(owned, 'binding-audit.json');
const fullPath = path.join(owned, 'full-browser-observations.json');
const audit = load(auditPath);
const full = load(fullPath);
const sourceInventoryPath = path.join(owned, 'independent-source-inventory.json');
const inventory = load(sourceInventoryPath);
const sourceFreezePath = path.join(owned, 'source-inventory-freeze.json');
const sourceFreeze = load(sourceFreezePath);
assert.equal(hash(sourceInventoryPath), sourceFreeze.inventory.sha256);
assert.equal(fs.statSync(sourceInventoryPath).mode & 0o777, 0o444);
for (const binding of audit.bindings) assert.equal(hash(binding.path), binding.actual_sha256);
assert.equal(hash(authorPath), '8dd29955a28ffd5dc883e4a5c020e10b0aeb66c27896911e8e0cd8907517376c');
assert.equal(hash(full.result.screenshot.path), full.result.screenshot.sha256);
assert.equal(full.result.screenshot.sha256, author.artifacts.fullResolution.sha256);
assert.equal(hash(author.artifacts.actual342.path), author.artifacts.actual342.sha256);

const sourceEntry = entry(path.join(root, author.source.image.path));
const fullEntry = entry(full.result.screenshot.path);
const actualEntry = entry(author.artifacts.actual342.path);
const opens = [
  { sequence: 1, ...sourceEntry, tool: 'functions.view_image', detail: 'original', role: 'FIRST original pixels before all author/context/edition material; independent inventory frozen next', imageDimensionsPx: [427, 285], crop: false, reopen: false },
  { sequence: 2, ...fullEntry, tool: 'functions.view_image', detail: 'original', role: 'Exact current native SVG full 640px, FIRST independent isolated Chromium CSS-resolved screenshot; byte-identical to supplied native.full.png', imageDimensionsPx: [640, 440], crop: false, reopen: false },
  { sequence: 3, ...actualEntry, tool: 'functions.view_image', detail: 'original', role: 'Hash-bound author actual342 isolated headless Chromium screenshot reused and independently inspected', imageDimensionsPx: [342, 236], actualSvgCSSDimensionsPx: [342, 235.125], crop: false, reopen: false }
];
const ledgerPath = path.join(owned, 'actual-opens-ledger.json');
save(ledgerPath, {
  schema: 'd592-fig165-actual-image-opens-ledger@1',
  initialOwnCount: 0, finalOwnCount: 3, batchCount: 3, batchLimit: 8, contextCount: 3, contextLimit: 24,
  crops: 0, reopens: 0, opens,
  parentAndOld24Of24: 'Unchanged; no resets, meter writes, or image-bearing returns.',
  fig164ImageOpens: 0
});

const commonEvidence = {
  source: sourceEntry,
  sourceOnlyInventory: entry(sourceInventoryPath),
  spec: entry(author.artifacts.spec.path),
  nativeRender: entry(author.artifacts.render.path),
  fullScreenshot: fullEntry,
  actual342Screenshot: actualEntry,
  fullBrowserObservations: entry(fullPath)
};
const groups = [];
groups.push({
  independentGroup: 'source-triptych',
  requirements: inventory.groups[0].requirements,
  authorInventoryGroup: 's165-order',
  sourceFacts: { profiles: 3, order: 'Left inward-bowing left edge and rightward outer bulge; middle two outward bulges; right flat left side and curved right side.', markGroupCounts: [3, 4, 3], readableSourceLabels: 0, namedSourcePoints: 0, sourceRays: 0, instructionalGrids: 0 },
  objects: spec.source.inventory.find((x) => x.id === 's165-order').objects,
  assertions: spec.source.inventory.find((x) => x.id === 's165-order').assertions,
  requires: { gridDimensions: 'N/A: three profiles in a row are layout, not a grid.', pointRelationships: 'N/A: original has no marked/named points; construction literals are not source points.' },
  evidence: commonEvidence,
  observations: 'Exactly three closed profiles remain in source order, with five curved boundaries and one straight boundary. No source rays, point labels, scale or values added. Modern captions/fill are additions, not source facts.',
  requirementsResults: [
    { requirement: 'Three ordered separated different profiles', status: 'PASS' },
    { requirement: 'Closed profiles and distinguishable boundary shapes', status: 'PASS' },
    { requirement: 'Internal dark oblique groups in every source profile', status: 'FAIL', finding: 'FIG165-MARKS-OMITTED' }
  ],
  status: 'FAIL',
  blocking_list: ['FIG165-MARKS-OMITTED']
});
for (const [slot, name, count] of [[1, 'left', 3], [2, 'middle', 4], [3, 'right', 3]]) {
  const independentId = `source-${name}-profile`;
  const authorId = `s165-${name}`;
  const mapped = spec.source.inventory.find((x) => x.id === authorId);
  const values = Object.fromEntries(['central', 'upper', 'lower'].map((position) => [
    position, spec.assertions.find((x) => x.id === `${authorId}-${position}-thickness`).value
  ]));
  assert.ok(values.central > values.upper && values.central > values.lower);
  groups.push({
    independentGroup: independentId,
    requirements: inventory.groups.find((x) => x.id === independentId).requirements,
    authorInventoryGroup: authorId,
    sourceSlot: slot,
    objects: mapped.objects, assertions: mapped.assertions,
    requires: { gridDimensions: 'N/A: no source grid', pointRelationships: 'N/A: zero source points; joins and curved boundaries mapped to native distance/pointOnCircle assertions' },
    evidence: commonEvidence,
    mathematicalResult: {
      status: 'PASS',
      thicknessDistances: values,
      interpretation: 'Authored coordinate-space distances, NOT measured source values. Native exact checks already passed; current mapped values have center > upper/lower edge values.',
      boundaryObservation: name === 'left' ? 'Left edge bows inward; right edge bows rightward more strongly; top/bottom join.' : name === 'middle' ? 'Both sides bulge outward with narrow joined ends; no equal radii claimed.' : 'Vertical plane left side and rightward curved side; top/bottom join.',
      exactCircularRadii: 'Modern regularization consistent with spherical-lens edition context, not recovered numerical source facts.',
      assertionCoverage: 'All listed IDs resolve. Joined-tip coordinates match the current arc endpoint literals; circle endpoint assertions bind their authored centers/radii. No objectCount substituted for a grid or source point relationship.'
    },
    markPresenceResult: { status: 'FAIL', sourceVisibleGroupCount: count, candidateVisibleGroupCount: 0, assertionIds: [], finding: 'FIG165-MARKS-OMITTED', evidence: 'Original open 1 versus both exact SVG screenshots, opens 2 and 3. Spec objects contain no internal mark objects or corresponding assertions.' },
    fineDetail: { status: 'HOLD', limitations: inventory.groups.find((x) => x.id === independentId).uncertainties, inheritedHOLD: author.source.fineDetailHOLD[slot - 1], overridden: false },
    status: 'FAIL',
    blocking_list: ['FIG165-MARKS-OMITTED', 'FIG165-SOURCE-FINE-DETAIL-HOLD']
  });
}
groups.push({
  independentGroup: 'source-mark-fine-detail',
  requirements: inventory.groups.find((x) => x.id === 'source-mark-fine-detail').requirements,
  authorInventoryGroup: 'No source-mark group maps marks to objects/assertions; m165-edition-labels instead declares neutral fill replacing unresolved strokes.',
  objects: [], assertions: [], evidence: commonEvidence,
  sourceKnownPresence: { groupsPerProfile: [3, 4, 3], totalGroups: 10, meaning: 'Not inferred' },
  unresolvedTopology: 'Stroke multiplicity, crossbars/endpoints and boundary contact remain unresolved. No crop, page-source escalation, or mark-meaning assertion was performed.',
  exactMarkFidelity: 'HOLD',
  knownMarkPresenceFidelity: 'FAIL',
  replacementAssessment: 'A uniform tint does not demonstrate preservation of ten visible separated mark groups. The edition does not explain those glyphs; do not assume they are disposable hatching or rays. Old source-fine-detail HOLD is not waived by the author fill declaration.',
  status: 'HOLD',
  blocking_list: ['FIG165-SOURCE-FINE-DETAIL-HOLD', 'FIG165-MARKS-OMITTED']
});
groups.push({
  independentGroup: 'modern-additions',
  authorInventoryGroup: 'm165-edition-labels',
  requirements: ['Keep additions separate from original facts.', 'English labels agree with observed profiles and inherited edition context.', 'Do not invent source rays, foci, given values, or numerical optical properties.'],
  objects: spec.source.inventory.find((x) => x.id === 'm165-edition-labels').objects,
  assertions: spec.source.inventory.find((x) => x.id === 'm165-edition-labels').assertions,
  evidence: commonEvidence,
  acceptableWithinScope: ['English profile names Meniscus / Biconvex / Plano-convex, supported by observed outline types.', 'Glass lenses in air header matches inherited EN/ZH /prose/10 condition.', 'Height, gap and circular-curve regularization explicitly disclosed as modern additions.'],
  notAcceptedAsSourceFidelity: 'Uniform semantic tint replacing unresolved original marks.',
  status: 'HOLD',
  blocking_list: ['FIG165-SOURCE-FINE-DETAIL-HOLD']
});

const at342 = audit.browser.widthChecks.find((x) => x.width === 342);
const reportPath = path.join(owned, 'report.json');
save(reportPath, {
  schema: 'STEMROBIN-181/fig165-first-independent-modern-review@1',
  ticket: 'STEMROBIN-181', task: 'd592-n75-fig165-first-independent-review',
  figure: 'fig-165', card: 'phy10-c2-s2-n75', date: '2026-11-18',
  status: 'FIG165-FAIL-DISPLAY342-PASS-SOURCE-FINE-DETAIL-HOLD-PRESERVED',
  independence: {
    freshOneOffFirstReview: true, permanentOrReplacementAD: false,
    firstImageAction: 'Original FIG165 PNG at requested SHA; no previous image in this own context.',
    inventoryFrozenBeforeAuthorSpecReportInventoryPreviewContextAndEdition: true,
    inventory: entry(sourceInventoryPath), inventoryFreeze: entry(sourceFreezePath),
    originalObservationUsedForInventory: true, authorGeometryUsedToDeriveSourceFacts: false,
    actualOpensLedger: entry(ledgerPath), imagesOpened: 3
  },
  gates: {
    FIG165: {
      status: 'FAIL',
      blocking_list: ['FIG165-MARKS-OMITTED', 'FIG165-SOURCE-FINE-DETAIL-HOLD'],
      mathematicalRelationships: 'PASS: profile count/order, closed tips, concave/convex/plane boundary distinctions and center-thicker relation preserved.',
      sourceFidelity: 'FAIL: all ten visible internal mark groups (3/4/3) are absent from both current screenshots and spec objects.',
      fineDetail: 'HOLD: old unresolved individual stroke topology retained; mark meaning NOT guessed.',
      eligibleForNativeReviewAt1Pass: false
    },
    DISPLAY342: {
      status: 'PASS', blocking_list: [],
      scope: 'Readability and unclipped presentation of the exact current emitted SVG in an isolated 342px CSS-width browser figure, independently of source-fidelity failure. Not full-card or in-product container acceptance.',
      actualWidthPx: 342, actualHeightPx: 235.125, screenshotRasterPx: [342, 236],
      minTextRequiredPx: 16, actualMinTextPx: 17.1,
      labels: at342.labels,
      screenshot: actualEntry,
      reuseBinding: 'Author screenshots.json FIG165-only row binds current spec/SVG/CSS and actual342 screenshot; screenshots command exited 0 and browser closed. Current hashes independently verified.',
      visualObservation: 'All three shapes and four English labels are readable and separated; flat/inward/outward edge distinctions remain visible. No black raster, missing outline, clipped tip or caption overlap observed.',
      clipping: 'Label bounds are inside the 342px SVG. Plano-convex ends at x=334.49688720703125, within width 342. All tips and outer contours visible.',
      sourceFidelityNotOverridden: true,
      fullResolutionCrosscheck: { widthPx: 640, minTextPx: 32, allSvgNodesParsed: 1225, noClippingWithStroke: true, evidence: entry(fullPath), screenshot: fullEntry, byteIdenticalToAuthorNativeFull: true }
    }
  },
  findings: [
    {
      id: 'FIG165-MARKS-OMITTED', severity: 'blocking', status: 'FAIL',
      sourceRequirement: 'Known visible mark-group presence, independently frozen before author exposure.',
      actual: 'Original left/middle/right contain 3/4/3 separated oblique dark groups. Candidate has none; author expressly declares neutral material fill in their place.',
      evidence: { original: sourceEntry, sourceInventory: entry(sourceInventoryPath), candidateSpec: entry(author.artifacts.spec.path), full: fullEntry, actual342: actualEntry },
      noMeaningAssumed: true, authorOrSpecRepairPerformed: false
    },
    {
      id: 'FIG165-SOURCE-FINE-DETAIL-HOLD', severity: 'blocking', status: 'HOLD',
      actual: 'Exact small-stroke multiplicity/topology and physical meaning were not independently established. Existing three per-profile HOLD limitations remain active.',
      authorHOLDs: author.source.fineDetailHOLD, sourceOnlyHOLD: inventory.groups.find((x) => x.id === 'source-mark-fine-detail'),
      authorFillDoesNotOverride: true, newEvidenceResolvingOldHOLD: false
    }
  ],
  sourceInventoryGroupChecks: groups,
  bindingEvidence: {
    status: 'PASS', audit: entry(auditPath), uniqueFilesVerified: audit.uniqueFilesVerified,
    source: sourceEntry, authorReport: entry(authorPath),
    perFigureAuthorFreeze: entry(path.join(path.dirname(authorPath), 'author-freeze.json')),
    authorSourceInventory: entry(author.source.inventory.path),
    exactSpec: entry(author.artifacts.spec.path), exactSvg: entry(author.artifacts.svg.path),
    exactRender: entry(author.artifacts.render.path), originalNativeFull: entry(author.artifacts.fullResolution.path),
    independentlyOpenedFull: fullEntry, actual342: actualEntry,
    authorBrowserMetadata: entry(author.artifacts.browser.path), authorBrowserCommand: entry(author.artifacts.browserCommand.path),
    ownFullBrowserMetadata: entry(fullPath), css: entry(audit.browser.css.path),
    en: entry(author.editionBinding.fullEN.path), zh: entry(author.editionBinding.fullZH.path),
    inheritedSCI_ZHENReport: entry(author.editionBinding.textReview.path),
    context: entry(author.editionBinding.contexts.path),
    exactCurrentSpecTextEntriesMatchBothEntireLessons: true,
    completeENProseObjects: 45, completeZHProseObjects: 45, boundNonemptyTexts: 64,
    auditScope: audit.scope, schemasInspected: audit.schemas,
    inputsRehashedUnchangedAtReviewFinalization: true
  },
  inheritedText: {
    SCI: 'PASS-INHERITED-NOT-REPLAYED', ZHEN: 'PASS-INHERITED-NOT-REPLAYED',
    fullAuthoritativeENandZHReadAfterInventoryFreeze: true, textReReview: false,
    scopeUse: 'Whole n75 context was read. Figure-specific interpretation uses spherical/one-plane boundary model and glass-in-air /prose/10 center-thicker classification; no text coverage verdict newly issued.',
    source201OrderingQualification: 'Historical D553-ORDERING-DISCLOSURE and older source open-tail FAIL/HOLD remain as recorded in d568; not replayed, hidden or overridden.'
  },
  languageCultureAndDisplay: {
    language: { status: 'PASS', visibleSVGLabels: full.result.labels.map((x) => x.text), EnglishOnly: true, CyrillicOrCJKVisible: false },
    culture: { status: 'PASS', observed: 'Clean neutral contemporary mathematical outline diagram; no Soviet symbols, flags, uniforms, fictional names, handwriting, source scan texture or portrait identity involved.' },
    minText: { status: 'PASS', minRequiredPx: 16, widths: [{ width: 331, px: 16.55, evidence: 'Inherited bound native + author Chromium metrics; no extra image opened' }, { width: 342, px: 17.1, evidence: 'Bound actual342 Chromium screenshot independently opened once' }, { width: 640, px: 32, evidence: 'Own exact SVG full Chromium observation + screenshot independently opened once' }] },
    semanticColors: { status: 'PASS-FOR-VISIBLE-OUTPUT', roles: full.result.roles, CSSVariablesResolved: true, visibleColorsRoleBound: true, limitation: 'The emitted JSXGraph SVG also contains 605 hidden literal-color construction nodes; they are unpainted in current Chromium evidence. No claim that every stored SVG attribute uses variables, or that alternate/print themes were tested.' },
    clipping: { status: 'PASS', fullCanvasIncludingStroke: true, actual342ContoursAndLabelsVisible: true, overlapObserved: false, scroll: 'N/A: inline figure' },
    fullCardAcceptance: false
  },
  execution: {
    nativeValidation: 'PASS inherited exact current first-attempt evidence; NOT invoked',
    nativeRender: 'PASS inherited exact current first-attempt evidence; NOT invoked',
    nativeValidationInvocations: 0, nativeRenderInvocations: 0, resvgInvocations: 0,
    ownBrowserMeasurementInvocations: 2, ownScreenshotsProduced: 1, ownImagesOpened: 3,
    firstOwnHarnessFailurePreserved: entry(path.join(owned, 'first-preview-harness-failure.json')),
    firstOwnHarnessFailureClarification: 'Initial expected DOM count of 9 was an incorrect own-harness assumption, not a figure FAIL. Actual parsed SVG contains 587 painted geometry nodes: 3 polygons, 5 paths and 579 lines (one plane boundary plus polygon boundary segments). The initial nonpainting explanation is not adopted as a final factual conclusion. Corrected own classifier inspected nonzero stroke/fill paint, removed unsupported exact DOM-count assertion and reused immutable original HTML; native SVG bytes unchanged.',
    firstFullScreenshotOnly: true, figureRepairs: 0, authorEdits: 0,
    browserClosed: true, nativeReviewAt1Written: false, selfApprovalWritten: false
  },
  preservation: {
    onlyWrittenDirectory: owned, fig164TerminalNativeFAIL: 'Excluded, not opened or reviewed; no files touched.',
    allOriginalFAILHOLDPreserved: true, parentAndOld24Of24: 'Unchanged; neither meter was readjusted or edited.',
    fullcardSOURCE: 'NOT REVIEWED', signature: 'NOT ISSUED', replacementAD: false,
    gitActions: 0, worktreeOrBranchActions: 0, dbActions: 0, deployActions: 0,
    canonicalEdits: 0, sharedEvidenceOrMeterEdits: 0, paidGenerationCalls: 0,
    noImagePayloadReturn: true
  },
  parentDisposition: {
    eligibleSuccessfulReview: false,
    nativeReviewAt1PassMustNotBeRecordedForThisVerdict: true,
    note: 'Only if a future separately authorized eligible successful review settles the blocking source facts may the parent record native review@1 separately. This report records no self-approval and performs no repair.'
  }
});

for (const binding of audit.bindings) assert.equal(hash(binding.path), binding.actual_sha256);
for (const name of fs.readdirSync(owned)) {
  const file = path.join(owned, name);
  assert.ok(fs.statSync(file).isFile(), 'Only owned regular files');
  fs.chmodSync(file, 0o444);
}
const files = fs.readdirSync(owned).sort().map((name) => ({ ...entry(path.join(owned, name)), mode: '0444' }));
const freezePath = path.join(owned, 'review-freeze.json');
save(freezePath, {
  schema: 'd592-fig165-first-independent-review-freeze@1',
  figure: 'fig-165', scope: owned,
  status: 'FIG165-FAIL-DISPLAY342-PASS-SOURCE-FINE-DETAIL-HOLD-PRESERVED',
  files, report: entry(reportPath), sourceInventory: entry(sourceInventoryPath),
  allListedFilesMode: '0444', totalImageOpens: 3,
  selfHash: 'Excluded from file list; returned externally.',
  nativeReviewAt1Written: false, fullcardSOURCE: false, signature: false,
  noWritesOutsideOwnedScope: true
});
fs.chmodSync(freezePath, 0o444);
const freeze = load(freezePath);
for (const file of freeze.files) {
  assert.equal(hash(file.path), file.sha256);
  assert.equal(fs.statSync(file.path).mode & 0o777, 0o444);
}
console.log(JSON.stringify({ FIG165: 'FAIL', DISPLAY342: 'PASS', fineDetail: 'HOLD-PRESERVED', ownImageOpens: 3, report: entry(reportPath), freeze: entry(freezePath), frozenFilesIncludingManifest: files.length + 1, nativeReviewAt1Written: false }, null, 2));
