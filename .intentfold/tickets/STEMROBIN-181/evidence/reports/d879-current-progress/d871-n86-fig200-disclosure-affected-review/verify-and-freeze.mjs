import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual as equal } from 'node:util';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticketRoot = path.join(root, '.intentfold/tickets/STEMROBIN-181');
const tmp = path.join(ticketRoot, 'tmp');
const out = path.join(tmp, 'd871-n86-fig200-disclosure-affected-review');
if (process.cwd() !== root || path.dirname(fileURLToPath(import.meta.url)) !== out) {
  throw new Error('Wrong review root or workdir');
}

const inputs = new Map();
function bind(file) {
  const resolved = path.resolve(root, file);
  if (!resolved.startsWith(root + '/')) throw new Error('Input outside sole root');
  const bytes = fs.readFileSync(resolved);
  return {
    path: resolved,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
  };
}
function input(file, expected) {
  const record = bind(file);
  if (expected && record.sha256 !== expected) throw new Error(`Stale input: ${file}`);
  inputs.set(record.path, record);
  return record;
}
function read(file, expected) {
  const record = input(file, expected);
  return JSON.parse(fs.readFileSync(record.path, 'utf8'));
}
function check(condition, message) {
  if (!condition) throw new Error(message);
}
function write(name, value) {
  const target = path.join(out, name);
  if (fs.existsSync(target)) throw new Error(`Refusing overwrite: ${target}`);
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
}
function differences(before, after, prefix = '') {
  if (equal(before, after)) return [];
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap(key => {
      const pointer = `${prefix}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
      return key in before && key in after
        ? differences(before[key], after[key], pointer)
        : [pointer];
    });
  }
  return [prefix];
}

const firstPath = path.join(tmp, 'd844-n86-fig200-first-independent-review/report.json');
const repairPath = path.join(tmp, 'd859-n86-fig200-disclosure-repair/report.json');
const repair = read(repairPath, '2fd5b0c6d6b2a6774a64a777fc2e2b4f885dbfab8b9c61ef41773f8e022be5b3');
const first = read(firstPath, repair.firstIndependentFail.sha256);
input(path.join(ticketRoot, 'evidence/reports/d862-current-progress/d844-n86-fig200-first-independent-review/report.json'), repair.firstIndependentFail.sha256);
const oldSpec = read(first.bindings.spec.path, first.bindings.spec.sha256);
const spec = read(repair.finalAssets.spec.path, repair.finalAssets.spec.sha256);
const firstVerification = read(first.bindings.verification.path, first.bindings.verification.sha256);
const render = read(repair.finalAssets.render.path, repair.finalAssets.render.sha256);
const svg = input(repair.finalAssets.svg.path, repair.finalAssets.svg.sha256);
const display = read(repair.authorPixels.displayVerification.path, repair.authorPixels.displayVerification.sha256);
const mapping = read(repair.sourceAdditionMapping.path, repair.sourceAdditionMapping.sha256);
const authority = read(repair.approvedBilingualText.authorityFile.path, repair.approvedBilingualText.authorityFile.sha256);
const contexts = repair.approvedBilingualText.sourceContexts.map(c => read(c.path, c.sha256));
input(repair.native.specValidation.path, repair.native.specValidation.sha256);
input(repair.preservation.inputManifest.path, repair.preservation.inputManifest.sha256);
for (const file of repair.frozenEvidence.filter(f => /FIRST-|disclosure-layout-adjustment\.json$/.test(f.path))) {
  input(file.path, file.sha256);
}
for (const file of [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
]) input(path.join(root, file));

const observations = JSON.parse(fs.readFileSync(path.join(out, 'visual-observations.json'), 'utf8'));
const changes = differences(oldSpec, spec);
check(equal(changes, ['/description', '/objects/61', '/objects/62']), 'Unexpected spec changes');
check(oldSpec.assertions.length === 23 && spec.assertions.length === 23, 'Assertion count changed');
check(equal(oldSpec.assertions, spec.assertions), 'Assertion definitions changed');
check(oldSpec.objects.length === 61 && spec.objects.length === 63, 'Object count changed');
check(equal(oldSpec.objects, spec.objects.slice(0, 61)), 'Original objects changed');
check(first.statuses.exactGeometry === 'PASS', 'FIRST geometry not PASS');
check(first.blockingFindings.length === 1 && first.blockingFindings[0].id === 'FIG200-THIN-LAYER-MAGNIFICATION-DISCLOSURE', 'FIRST blocker scope changed');
check(equal(spec.source.authoritativeText, authority), 'Authority copy changed');
check(equal(spec.source, oldSpec.source), 'Source fields changed');
check(equal(mapping.sourceRequirementsRetained, spec.source.inventory.map(({ id, objects, assertions }) => ({ id, objects, assertions }))), 'Source mapping changed');
check(mapping.classification === 'MODERN-LEARNER-VISIBLE-DISCLOSURE-NOT-ORIGINAL-SOURCE-FACT', 'Addition classification missing');
check(mapping.visibleText === observations.visibleText, 'Addition wording mismatch');
check(spec.description.includes('Modern learner-visible disclosure (not a source-pixel fact)'), 'Explicit source-addition disclosure missing');
check(render.status === 'pass' && render.spec.sha256 === repair.finalAssets.spec.sha256, 'Stale or failed render');
check(render.output.svg.sha256 === svg.sha256 && render.collisions.length === 0, 'Output or collision evidence mismatch');
check(equal(display.spec, repair.finalAssets.spec) && equal(display.svg, repair.finalAssets.svg), 'Display evidence uses different assets');
check(equal(spec.display.widths, [331, 342, 640]), 'Display widths changed');
check(contexts.every(c => c.figure === 'fig-200'), 'Source-context figure mismatch');

const widths = observations.widths.map(observation => {
  const author = repair.authorPixels.widths.find(w => w.width === observation.width);
  const shot = input(author.screenshot.path, author.screenshot.sha256);
  const evidence = display.outputs.find(w => w.width === observation.width);
  const labels = evidence.measured.labels.filter(l => l.id.startsWith('modern-layer-magnification-disclosure-') || l.id.startsWith('modern-not-to-scale-disclosure-'));
  check(shot.sha256 === observation.sha256 && evidence.screenshot.sha256 === shot.sha256, 'Screenshot changed since inspection');
  check(evidence.measured.disclosure === observations.visibleText && labels.length === 2, 'Frozen visible text mismatch');
  check(evidence.measured.overlaps.length === 0 && evidence.measured.geometrySvgNodesUnchanged && evidence.measured.originalSvgLabelsUnchanged, 'Saved preservation evidence failed');
  check(labels.every(l => l.insideMedia && l.px >= 16), 'Saved disclosure readability failed');
  return {
    width: observation.width,
    screenshot: shot,
    pixelReviewStatus: observation.status,
    minimumTextPxFromFrozenEvidence: evidence.measured.minMeasuredTextPx,
    disclosureLabelsFromFrozenEvidence: labels,
    disclosureLineClearancePxFromFrozenBounds: labels[1].bounds.y - labels[0].bounds.y - labels[0].bounds.height,
    freshMeasurement: false,
  };
});

const verification = {
  schema: 'ld-s10y-image/affected-preservation-verification@1',
  status: 'PASS',
  method: 'Read-only structured JSON equality and exact SHA-256 binding; no geometry calculations, validation, browser, or native replay',
  changedSpecPaths: changes,
  assertions: { before: 23, after: 23, definitionsUnchanged: true, ids: spec.assertions.map(a => a.id) },
  objects: { before: 61, after: 63, original61Unchanged: true, additions: spec.objects.slice(61) },
  unchangedTopLevelFields: Object.keys(oldSpec).filter(k => !['description', 'objects'].includes(k)),
  sourceInventoryUnchanged: true,
  authoritativeTextUnchanged: true,
  authorityCopyMatchesSpec: true,
  sourceRequirementsMappingUnchanged: true,
  geometry: { status: 'PASS-REUSED-FIRST-D844-NOT-RERUN', firstEvidence: firstVerification.geometry },
  savedRenderStatus: render.status,
  savedRenderSpecAndOutputHashesCurrent: true,
  actualSvgGeometryAndOldLabels: 'PASS-REUSED-FROZEN-D859-EVIDENCE-NOT-REMEASURED',
  widths,
  originalSourceImage: { ...spec.source.image, provenance: 'Hash copied from unchanged FIRST and current spec source fields; source file not reopened or rehashed in d871' },
  actualInputBindings: [...inputs.values()],
};
write('verification.json', verification);

const report = {
  schema: 'ld-s10y-image/independent-affected-figure-review@1',
  ticket: 'STEMROBIN-181/181-3',
  card: 'phy10-c2-s3-n86',
  figure: 'fig-200',
  date: '2026-11-19',
  reviewedAt: new Date().toISOString(),
  round: 'D871-INDEPENDENT-AFFECTED-DISCLOSURE-REVIEW',
  reviewerRole: 'Independent reviewer, not d859 author; no author repairs',
  root,
  authorizedWriteRoot: out,
  status: 'PASS',
  scope: observations.scope,
  evidenceClass: 'SCOPED-AFFECTED-REVIEW-ONLY-NOT-FULL-N86-APPROVAL-NOT-PROMOTION',
  firstFinding: {
    id: first.blockingFindings[0].id,
    firstStatus: 'FAIL',
    affectedDisposition: 'PASS-RESOLVED-FOR-EXACT-FROZEN-D859-INPUTS',
    firstReport: inputs.get(firstPath),
    firstRecordPreserved: true,
  },
  statuses: {
    thinLayerMagnificationDisclosure: 'PASS',
    affectedLabelReadabilityAndSpacing: 'PASS',
    englishMeaning: 'PASS',
    explicitModernSourceAdditionDisclosure: 'PASS',
    sourceLabelsAndRelationships: 'PASS-REUSED-FIRST-D844-NOT-REREVIEWED',
    exactGeometry: 'PASS-REUSED-FIRST-D844-23-ASSERTIONS-UNCHANGED-NOT-RERUN',
    approvedBilingualText: 'PASS-REUSED-D815-D818-VIA-FIRST-NOT-REREVIEWED',
    wholeN86: 'NOT-REVIEWED-NOT-CLEARED',
    plateV: 'SOURCE-OBSERVED-SAVED-EVIDENCE-ROMAN-COLOR-PIPELINE-HOLD-RETAINED',
  },
  method: 'Read FIRST d844 before comparison or image review; inspect only three current d859 screenshots; compare frozen spec fields to FIRST-bound d831 spec; reuse FIRST geometry PASS; bind exact inputs. No original-source reopen or full review.',
  changedSpecPaths: changes,
  preservation: {
    assertions: 23,
    assertionDefinitionsUnchanged: true,
    originalObjectsUnchanged: 61,
    sourceCanvasDisplayLayoutUnchanged: true,
    originalGeometryPassReused: true,
    geometryRecalculated: false,
    priorFailuresAndRepairHistoryRetained: true,
    inputHashesRecheckedBeforeFreeze: true,
  },
  visibleText: observations.visibleText,
  englishMeaning: observations.englishMeaning,
  sourceAdditionDisclosure: observations.sourceAdditionDisclosure,
  visualObservations: observations.widths,
  blockingFindings: [],
  bindings: {
    repairReport: inputs.get(repairPath),
    firstReport: inputs.get(firstPath),
    firstSpec: inputs.get(first.bindings.spec.path),
    currentSpec: inputs.get(repair.finalAssets.spec.path),
    currentSvg: svg,
    currentRender: inputs.get(repair.finalAssets.render.path),
    sourceAdditionMapping: inputs.get(repair.sourceAdditionMapping.path),
    firstVerification: inputs.get(first.bindings.verification.path),
    displayEvidence: inputs.get(repair.authorPixels.displayVerification.path),
    sourceImage: verification.originalSourceImage,
    screenshots: widths.map(w => w.screenshot),
    verification: bind(path.join(out, 'verification.json')),
    visualObservations: bind(path.join(out, 'visual-observations.json')),
  },
  actualUsage: {
    independentAffectedReviewAssignments: 1,
    readOnlyComparisonProbeInvocations: 2,
    verificationAndFreezeHelperInvocations: 1,
    ordinaryReadOnlyProbeFailures: 2,
    probeFailureNotes: [
      'Initial abbreviated T lookup used tmp/d859 at repo root and found no file; resolved T to the existing ticket root.',
      'A directory inventory included the not-yet-created d871 output directory; no input or review failure.',
    ],
    imagesLoaded: 3,
    imageBatches: 1,
    maxImagesInBatch: 3,
    imageBatchLimit: 8,
    currentContextImageLoads: 3,
    contextImageLimit: 24,
    currentScreenshotImageOpens: 3,
    sourceImageReopens: 0,
    sourceImageHashReads: 0,
    oldPreviewImageOpens: 0,
    imageReopens: 0,
    crops: 0,
    newScreenshots: 0,
    newRenderingCalls: 0,
    localRasterGenerations: 0,
    nativeSpecValidationCalls: 0,
    geometryCalculationReplays: 0,
    captureReplays: 0,
    browserOperations: 0,
    recordReviewCalls: 0,
    fullFigureReviews: 0,
    fullTextRereviews: 0,
    fullN86Reviews: 0,
    sourceReviewsReplayed: 0,
    authorRepairs: 0,
    contentRepairs: 0,
    modelImageGenerationCalls: 0,
    paidCalls: 0,
    sourceWrites: 0,
    figureWrites: 0,
    canonicalWrites: 0,
    indexWrites: 0,
    meterReadsOrWrites: 0,
    gitCalls: 0,
    databaseCalls: 0,
    publisherCalls: 0,
    deployCalls: 0,
    fullTestsOrBuilds: 0,
    otherChatOperations: 0,
    branchOperations: 0,
    worktreeOperations: 0,
    repositoryCodeChanges: 0,
    writesOutsideAuthorizedRoot: 0,
    priorRoundUsageRecounted: false,
  },
  disposition: {
    recordReviewPerformed: false,
    reason: 'This is a non-promotable affected-only review, not cap4 promotion. record_review.py internally invokes rendered native validation; it was not run to honor the no-native-replay boundary.',
    fullSkillPromotionReviewIssued: false,
    canonicalOrSharedRecordsWritten: false,
    promotionApproved: false,
    publicationApproved: false,
    wholeCardApprovalGranted: false,
    plateVBypassed: false,
    nextAction: 'Return these frozen scoped evidence paths and hashes, then stop.',
  },
  freeze: { fileMode: '0444', directoryMode: '0555', manifest: path.join(out, 'hashes.sha256') },
};
write('report.json', report);

for (const record of inputs.values()) check(bind(record.path).sha256 === record.sha256, `Input changed during review: ${record.path}`);
const files = fs.readdirSync(out).filter(name => fs.statSync(path.join(out, name)).isFile()).sort();
const manifest = files.map(name => `${bind(path.join(out, name)).sha256}  ${name}`).join('\n') + '\n';
fs.writeFileSync(path.join(out, 'hashes.sha256'), manifest, { flag: 'wx' });
for (const name of [...files, 'hashes.sha256']) fs.chmodSync(path.join(out, name), 0o444);
fs.chmodSync(out, 0o555);
console.log(JSON.stringify({
  status: report.status,
  scope: report.evidenceClass,
  inputCount: inputs.size,
  outputs: [...files, 'hashes.sha256'].map(name => bind(path.join(out, name))),
}, null, 2));
