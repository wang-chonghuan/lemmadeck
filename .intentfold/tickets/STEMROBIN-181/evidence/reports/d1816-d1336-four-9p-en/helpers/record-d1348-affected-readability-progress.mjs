import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, copy, run } from './n42-native.mjs';

const out = `${ticket}/tmp/d1816-d1348-affected-readability-progress`;
const rows = [
  ['n10', 'D1343', 'd1816-d1343-n10-two-readability-recovery', 'D1310', 17],
  ['n15', 'D1346', 'd1816-d1346-n15-readability', 'D1317', 29],
  ['n18', 'D1345', 'd1816-d1345-n18-readability', 'D1324', 17],
  ['n20', 'D1347', 'd1816-d1347-n20-readability', 'D1331', 42],
].map(([number, task, directory, reviewer, paragraphs]) => {
  const authored = bind(`${ticket}/tmp/${directory}/authored.json`), author = read(authored.path);
  assert.equal(author.flowParagraphs, paragraphs);
  assert.equal(bind(author.englishDraft.path).sha256, author.englishDraft.sha256);
  return { number, task, reviewer, authored, paragraphs, status: 'AFFECTED_ONLY_NATIVE_PASS_ENGLISH_REVIEW_PENDING' };
});
const syntaxReceipts = [
  'finalize-d997-n72-first-en.mjs', 'display-d998-n72-first-en-full-course.mjs',
  'retain-d1000-n72-first-complete-en.mjs', 'push-d1214-three-early-10p-en.mjs',
].map(name => run(`d1348-${name.replace(/\.mjs$/, '')}-syntax`,
  ['node', '--check', `${ticket}/tmp/d1816-recovery/${name}`]));
save(`${out}/result.json`, {
  task: 'D1348', rows, syntaxReceipts,
  adapter: bind(`${ticket}/tmp/d1816-d1338-next-four-helper-adapter/result.json`),
  preservedFailures: [
    bind(`${ticket}/tmp/d1816-recovery/d1341-first-review-intake-failure.json`),
    bind(`${ticket}/tmp/d1816-recovery/native/d1341-n10-three-affected-readability-fields-native/receipt.json`),
    bind(`${ticket}/tmp/d1816-recovery/native/d1344-n15-affected-readability-native/receipt.json`),
  ],
  originalEnglishReviewsRemainRevise: true, affectedOnlyIndependentReviewsPending: true,
  originalSourceChineseFigureApprovalsReplayed: false, historicalChineseScienceApprovalRecovered: false,
  imagesAssigned: 0, parentImagesOpened: 0, paidCalls: 0, databaseWrites: 0,
  totals: { completeCourses: 153, sourcePages: 581 }, newCompleteCourses: 0, newSourcePages: 0,
  finish: 'review', scopeCompleted: false, formalHandoff: false, continuousProduction: true,
});
copy(`${ticket}/production-meter.json`, `${out}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${out}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const row of rows) meter.currentResume1816[row.task] = {
  status: row.status, authored: row.authored, paragraphs: row.paragraphs, reviewer: row.reviewer,
};
meter.currentResume1816.D1348 = { status: 'FOUR_AFFECTED_NATIVE_PASS_INDEPENDENT_REVIEW_PENDING',
  evidence: bind(`${out}/result.json`), noReceiptOnlyCommit: true };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1341-D1348: Allfour FIRST English reviews returned genuine readability REVISE while source/science/unchangedfigure applicability passed. Affected-only terminology/prose fields repaired and nativechecked: N10D1343(17paragraphs),N15D1346(29),N18D1345(17),N20D1347(42). N10 unfrozen-review intake failure before output/native and hardcoded originalparagraphcount failure preserved; N15 repeated prose1/273 signature failure preserved, original formula retained and same fraction explained in words. N18 second boundary anchor rebound from actualflow; allN20 workedexamples unchanged. D1338adapter original helpers retained; downstream configs now point to affected authors/actualparagraphcounts. Four affected independent reviews remain pending, no new wholecourse/nativefinalize/display/pixel/retention approval claimed. Totals153/581unchanged; no source/Chinese/figure reopens,paid/DB/broadtests/force/merge/deploy/handoff/scopecompletion. Continuousproduction remains active.\n');
console.log(JSON.stringify({ result: bind(`${out}/result.json`), rows: rows.length }));
