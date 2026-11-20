import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 139);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
const r = meter.currentResume1816;
assert.equal(r.parentContinuationImageOpens, 16);
const reviews = [
  ['D290', 'd290-fig2425-review/report.json',
    'FIRST_FIG24_25_SOURCE_MATH_VISUAL_CULTURAL_PASS_CLOSED', 7],
  ['D291', 'd291-fig26-review/report.json',
    'FIRST_FIG26_SUBSTANTIVE_PASS_STALE_CONTEXT_FAILURE_PRESERVED_CLOSED', 2],
  ['D292', 'd292-n19-text-review/report.json',
    'FIRST_N19_SCIENCE_PASS_OPENING_PARAGRAPH_FAILURE_PRESERVED_CLOSED', 0],
  ['D294', 'd294-fig2829-review/report.json',
    'FIRST_FIG28_29_SOURCE_MATH_VISUAL_CULTURAL_PASS_CLOSED', 8],
  ['D296', 'd296-n19-table-review/report.json',
    'FIRST_TABLE_SOURCE_MATH_VISUAL_CULTURAL_PASS_CLOSED', 3],
];
for (const [stage, suffix, status, images] of reviews) {
  Object.assign(r[stage], { status, report: bind(`${T}/tmp/d1816-${suffix}`),
    reviewerClosed: true, actualImageOpens: images, completeCoursesAdded: 0,
    inputTokens: null, outputTokens: null, costUsd: null });
}
for (const [stage, suffix, status] of [
  ['D297', 'd297-english-table-label-focused-tests',
    'EXACT_ENGLISH_UNNUMBERED_TABLE_ALIAS_FOCUSED_THREE_TESTS_PASS'],
]) {
  r[stage] = { status, testReceipt: bind(`${T}/tmp/d1816-recovery/native/${suffix}/receipt.json`),
    actualImageOpens: 0, completeCoursesAdded: 0 };
}
for (const [stage, suffix, status] of [
  ['D298', 'd298-n19-affected-author/result.json',
    'ONE_EN_OPENING_REPAIR_AND_SHARED_REFERENCE_METADATA_AFFECTED_PASS_D300'],
  ['D299', 'd299-current-figure-text/result.json',
    'SEVEN_FIGURES_CURRENT_BILINGUAL_METADATA_BINDING_AFFECTED_PASS_D300'],
  ['D300', 'd300-affected-context-review/report.json',
    'PASS_AFFECTED_TEXT_AND_CONTEXT_ONLY_REVIEWER_CLOSED'],
  ['D301', 'd301-current-figure-install/result.json',
    'SEVEN_CURRENT_NATIVE_REVIEW_RECORDS_INSTALLED_PASS_NO_GEOMETRY_RERENDER'],
  ['D302', 'd302-n19-native/result.json',
    'N19_BILINGUAL_NATIVE_FINALIZATION_AND_OFFLINE_RENDER_PASS'],
  ['D303', 'd303-display/result.json',
    'TWELVE_OFFLINE_DESKTOP_MOBILE_AUTOMATIC_SURFACES_PASS'],
  ['D307', 'd307-n17n18-native-recovery/result.json',
    'N18_FAILED_RENDER_ONLY_RECOVERED_EN_FIRST_NATIVE_PASS_PRIOR_ZH_REUSED'],
]) {
  r[stage] = { ...r[stage], status, result: bind(`${T}/tmp/d1816-${suffix}`),
    actualParentImageOpens: 0, completeCoursesAdded: 0 };
}
r.D298.contentRepairRounds = 1;
r.D300.reviewerClosed = true;
r.D300.actualImageOpens = 0;
r.D307.originalFailure = bind(`${T}/tmp/d1816-d288-n17n18-native/result.json`);
r.D288.status = 'ORIGINAL_NATIVE_CAPTION_OWNER_FAILURE_PRESERVED_RECOVERY_D307';
for (const [stage, suffix, reviewer, images] of [
  ['D304', 'd304-n17n18-display-review', '01a1faaf-fa5b-7de0-9229-7f83a0df375d', 8],
  ['D305', 'd305-n19-display-review', '01a1faaf-faf5-7173-b081-00eb694ecd9b', 4],
]) {
  const file = `${T}/tmp/d1816-${suffix}/report.json`;
  assert.equal(read(file).status, 'pass');
  assert.equal(read(file).screenshots.length, images);
  r[stage] = { status: 'FINAL_OFFLINE_DISPLAY_PIXELS_PASS_REVIEWER_CLOSED',
    reviewer, reviewerClosed: true, report: bind(file),
    actualImageOpens: images, imageReopens: 0, completeCoursesAdded: 0,
    inputTokens: null, outputTokens: null, costUsd: null };
}
r.currentContinuation =
  '139 complete offline courses pushed, unchanged. N17/N18/N19 all first/affected SCI and bilingual text, seven independent modern figures, current native finalizations/renders, and twelve desktop/mobile offline automatic and pixel surfaces PASS. Original D291 context and D292 opening failures retained with affected-only D298/D299/D300 repairs; original D288 caption-owner failure retained with failed-stage-only D307 recovery. Reviewers closed; parent image opens16, no new paid calls, DB/publisher/deploy/merge/closure or formal handoff. D306 retention and small-batch commit/push are next; no completed-course increment yet.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ status: 'collected', completeDelivered: 139,
  completeUnbatched: [], parentImageOpens: 16, displayImages: 12 }));
