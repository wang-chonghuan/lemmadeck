import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ticket, bind, read, save, copy } from './n42-native.mjs';

const stages = [
  ['D1436', 'd1816-d1436-n40-first-missing-en/prepared.json'],
  ['D1437', 'd1816-d1437-n40-first-missing-en/authored.json'],
  ['D1443', 'd1816-d1443-n42-first-missing-en/prepared.json'],
  ['D1483', 'd1816-d1483-n42-first-missing-en/authored.json'],
  ['D1450', 'd1816-d1450-n43-first-missing-en/prepared.json'],
  ['D1451', 'd1816-d1451-n43-first-missing-en/authored.json'],
  ['D1457', 'd1816-d1457-n46-first-missing-en/prepared.json'],
  ['D1458', 'd1816-d1458-n46-first-missing-en/authored.json'],
];
const reports = stages.map(([task, relative]) => ({ task, evidence: bind(`${ticket}/tmp/${relative}`) }));
const firstReviews = [
  'd1816-d1438-n40-first-en-review', 'd1816-d1445-n42-first-en-review',
  'd1816-d1452-n43-first-en-review', 'd1816-d1459-n46-first-en-review',
].map(directory => {
  const evidence = bind(`${ticket}/tmp/${directory}/review.json`);
  assert.equal(read(evidence.path).status, 'REVISE');
  return evidence;
});
const affectedAuthors = [
  ['D1485', 'd1816-d1485-n40-affected-text'],
  ['D1486', 'd1816-d1486-n42-affected-text'],
  ['D1487', 'd1816-d1487-n43-affected-text'],
  ['D1488', 'd1816-d1488-n46-affected-text'],
].map(([task, directory]) => ({ task, evidence: bind(`${ticket}/tmp/${directory}/authored.json`) }));
const n40AffectedReview = bind(`${ticket}/tmp/d1816-d1438-n40-first-en-review/affected-review.json`);
assert.equal(read(n40AffectedReview.path).status, 'PASS');
const before = read(`${ticket}/tmp/d1816-d1444-n42-first-missing-en/en.before-native.json`);
const after = read(`${ticket}/tmp/d1816-d1483-n42-first-missing-en/en.before-native.json`);
assert.deepEqual(after, before);
const directory = `${ticket}/tmp/d1816-d1484-surface-humidity-progress`;
save(`${directory}/result.json`, {
  task: 'D1484', status: 'FOUR_FIRST_REVIEWS_REVISE_FOUR_AFFECTED_AUTHORS_PASS_N40_AFFECTED_REVIEW_PASS',
  firstReviews, affectedAuthors, n40AffectedReview,
  n42ExactFragmentFirstFailure: bind(`${ticket}/tmp/d1816-d1489-n42-repair-fragment-recovery/first-failure.json`),
  affectedParagraphCounts: [19, 83, 64, 71],
  reports, inventory: bind(`${ticket}/tmp/d1816-d1435-next-surface-humidity-en-inventory/result.json`),
  previousPush: bind(`${ticket}/evidence/reports/d1816-d1421-four-9p-en/actual-push.json`),
  originalObjects: 76, originalTasks: 0, uniqueUnchangedFigures: 7,
  paragraphCounts: [15, 55, 24, 26],
  n42FirstFailure: bind(`${ticket}/tmp/d1816-d1482-n42-notation-checker-recovery/first-failure.json`),
  n42CompleteEnglishInputUnchangedAfterCheckerArgumentRecovery: true,
  reviewers: [
    { card: 'phy9-c1-s4-n40', agent: '01a20513-1d2d-7531-83e2-4039339af688' },
    { card: 'phy9-c1-s4-n42', agent: '01a20514-0b1b-7f43-8774-98ea123ec705' },
    { card: 'phy9-c1-s5-n43', agent: '01a20513-1d72-76a0-98d3-43f534811537' },
    { card: 'phy9-c1-s5-n46', agent: '01a20513-1def-76b0-a0b7-4bf23c7dd9b2' },
  ],
  independentImagesAssigned: 0, parentNewImages: 0, providerInputTokens: null,
  providerOutputTokens: null, costUsd: null, databaseWrites: 0, paidCalls: 0,
  nativeFinalizationDisplayPixelWidthRetentionPending: true,
  newCompleteCourses: 0, newSourcePages: 0, totals: { completeCourses: 153, sourcePages: 581 },
  historicalSourceChineseFigureApprovalNotReplayedOrRecovered: true,
  neighborHoldsNotReopened: true, formalHandoff: false, scopeCompleted: false, continuousProduction: true,
});
const file = `${ticket}/production-meter.json`;
copy(file, `${directory}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${directory}/review.before.md`);
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const report of reports) meter.currentResume1816[report.task] = {
  status: report.evidence.path.endsWith('/authored.json') ? 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS'
    : 'FIRST_MISSING_EN_PREPARE_SOURCE_CHINESE_DELIVERY_BYTE_BINDINGS_PASS',
  evidence: report.evidence,
};
for (const report of affectedAuthors) meter.currentResume1816[report.task] = {
  status: 'AFFECTED_READABILITY_AUTHOR_NATIVE_PASS', evidence: report.evidence,
};
meter.currentResume1816.D1484 = { evidence: bind(`${directory}/result.json`), status: 'FOUR_REVISE_REPAIRED_N40_AFFECTED_REVIEW_PASS_OTHER_AFFECTED_REVIEWS_RUNNING' };
meter.currentResume1816.currentContinuation =
  'D1421 ordinary push681368f79 independently verified. N40/N42/N43/N46:76objects/0tasks/7unchangedfigures. Four FIRST reviews genuineREVISE(readability), all source/science/figuretextPASS. Four named affected-text repairs nativePASS,paragraphs19/83/64/71; N40affectedreviewPASS and otherthreeaffectedreviewsrunning,images0. N42omittednotationargument and exactfragmentfirstfailures preserved. No finalize/display/pixels/width/retention/newpushyet. Counts153/581unchanged;HOLDs/sourceChinesecriticalsubscripts/ARIA/headlesslimits preserved;continuousproductionactive.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1435-D1489: Continued after verified ordinary push681368f79: N40/N42/N43/N46,76objects/0tasks/7unchangedfigures. FourFIRSTreviews genuineREVISE forreadability, source/science/figuretextPASS. Fouraffected-only repairs nativePASS,paragraphs19/83/64/71. N40affectedreviewPASS231c9aec;otherthreeaffectedreviewsrunning,images0. N42omittednotationargument recovery unchangedEnglishinput and exact-fragmentfirstfailure026fee11 retained. Corrected4.4x10^5pressure,bothworkedexamplesasprose,N40criticalsubscript,N46surface/S2-S1=lh preserved. No finalization/display/pixels/width/retention/newpushyet;counts153/581unchanged;no source/Chinese/figure reopens,HOLDchanges,DB/paid/skills/broadtests/force/merge/deploy/formalhandoff/scopecompletion;continuousproductionactive.\n');
console.log(JSON.stringify({ progress: bind(`${directory}/result.json`), paragraphCounts: [15, 55, 24, 26] }));
