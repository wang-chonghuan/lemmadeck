import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d118/fig-26';
const O = `${T}/tmp/d1816-d118-n19-fig26-label-author`;
const read = p => JSON.parse(fs.readFileSync(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p) });
const oldFile = `${T}/tmp/d1816-d114-n19-fig26-author/author-freeze.json`;
assert.equal(hash(oldFile), 'c585fe3d7bb5405d5b650da0ffb985f175b631262c2365c2025d3d41855eee1f');
const old = read(oldFile);
assert.equal(hash(old.candidate.path), old.candidate.sha256);
const before = read(old.candidate.path);
const currentFile = `${B}/fig-26.spec.json`;
const current = read(currentFile);
const restored = structuredClone(current);
const label = restored.objects.find(o => o.id === 'delta-p1-label');
assert.deepEqual(label.labelPlacement.offset, [4, 56]);
label.labelPlacement.offset = [4, 0];
assert.deepEqual(restored, before);
const reviewFile = `${T}/tmp/d1816-d117-n19-fig26-review/report.json`;
assert.equal(hash(reviewFile), '4cff429078393da6c779ee52d0c3ea7a3256622c8334b82c6d2bc02df13477ea');
assert.equal(read(reviewFile).scopedVerdicts.sourceFidelityAndInventoryCompleteness, 'PASS');
assert.equal(read(`${B}/fig-26.render.json`).status, 'pass');
const output = `${O}/author-freeze.json`;
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/affected-figure-label-author@1',
  ticket: 'STEMROBIN-181', batch: 'D118', lesson: old.lesson, figure: old.figure,
  role: 'AUTHOR, not reviewer',
  status: 'native-pass-affected-readability-review-pending',
  priorAuthor: bind(oldFile), priorIndependentReview: bind(reviewFile),
  candidate: bind(currentFile), svg: bind(`${B}/fig-26.svg`),
  render: bind(`${B}/fig-26.render.json`), preview: bind(`${B}/fig-26.preview.png`),
  changedObject: 'delta-p1-label',
  changedPointer: '/objects[id=delta-p1-label]/labelPlacement/offset/1',
  change: { from: 0, to: 56, units: 'native renderer screen pixels' },
  resolves: 'D117-READ-01: lower cap crosses the distinguishing subscript 1',
  exactEqualityOutsideChangedPointer: true,
  sourceTextImageInventoryGeometryEndpointsAssertionsAndLabelTextUnchanged: true,
  priorSourcePhysicalAndCulturalVerdictsReused: true,
  firstAffectedIndependentReadabilityReviewPending: true,
  renderCallsThisAffectedStage: 1, actualImageOpens: 0,
  previewOnlyRecovery: {
    cause: 'Successful native render requested SVG/report without --png; first author-freeze call stopped on missing preview.',
    nativeGeometryAndReportReplayed: false,
    generatedFromAlreadyPassedSvg: true,
    receipt: bind(`${T}/tmp/d1816-recovery/native/d118-n19-existing-svg-preview-only/receipt.json`),
  },
  previousD114ImageOpens: 3, previousD117ImageOpens: 4,
  historicalRepairCountsNotReset: true,
  previousKnownScopedTargetedRepairsLowerBound: 3,
  currentKnownScopedTargetedRepairsLowerBound: 4,
  nativeFailureAndContentReviewFailureKeptSeparate: true,
  newReadabilityRepairAfterFirstIndependentFinding: 1,
  sourcePagesAdded: 0, completeCoursesAdded: 0, paidCalls: 0,
  databaseWrites: false, approved: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ author: bind(output), candidate: bind(currentFile),
  render: bind(`${B}/fig-26.render.json`), imageOpens: 0, affectedReviewPending: true }));
