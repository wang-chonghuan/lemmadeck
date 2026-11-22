import fs from 'node:fs';
import assert from 'node:assert/strict';
import { ticket, bind, read, save, copy } from './n42-native.mjs';

const out = `${ticket}/tmp/d1816-d1340-next-four-stage-progress`;
const inventory = `${ticket}/tmp/d1816-d1307-next-four-en-inventory/result.json`;
const push = `${ticket}/evidence/reports/d1816-d1295-four-9p-en/actual-push.json`;
assert.equal(read(push).head, '98c24795fc1de56beb5561ac96c822ca2647fa81');
const rows = [
  ['phy9-c1-s2-n10', 'D1308', 'D1309', 'D1310', '01a204af-55ec-74e2-a6bd-1ec5fd186256'],
  ['phy9-c1-s2-n15', 'D1315', 'D1316', 'D1317', '01a204af-5637-7c31-b8e3-7d985a55c73f'],
  ['phy9-c1-s2-n18', 'D1322', 'D1323', 'D1324', '01a204af-567b-7643-99fc-4b01650f747b'],
  ['phy9-c1-s2-n20', 'D1329', 'D1339', 'D1331', '01a204af-56d1-7c31-9ee1-5858e12d9f00'],
].map(([card, prepare, author, reviewer, agent]) => {
  const number = card.split('-').at(-1);
  const prepared = bind(`${ticket}/tmp/d1816-${prepare.toLowerCase()}-${number}-first-missing-en/prepared.json`);
  const authored = bind(`${ticket}/tmp/d1816-${author.toLowerCase()}-${number}-first-missing-en/authored.json`);
  assert.equal(read(authored.path).status, 'FIRST_MISSING_EN_AUTHOR_NATIVE_PASS');
  return { card, prepare, author, reviewer, agent, prepared, authored,
    status: 'FIRST_EN_AUTHOR_NATIVE_PASS_INDEPENDENT_ENGLISH_REVIEW_ACTIVE',
    independentScienceReviewPassed: false, imagesAssigned: 0 };
});
const result = {
  task: 'D1340', inventory: bind(inventory), previousRemoteVerifiedPush: bind(push), rows,
  originalN20Failure: bind(`${ticket}/tmp/d1816-recovery/native/d1330-n20-first-missing-en-author-native/receipt.json`),
  recoveredN20Author: rows.find(row => row.card.endsWith('n20')).authored,
  helperAdapter: { task: 'D1338', agent: '01a204a9-c780-7772-95e1-52d9a6bf36e2', status: 'ACTIVE_NOT_ACCEPTED' },
  sourceAndChineseCommitBytesCompared: true, sourceOrFigurePixelsReopened: false,
  newEnglishScienceApprovalInvented: false, historicalScienceGapsPreserved: true,
  noReceiptOnlyCommit: true, newCompleteCourses: 0, newSourcePages: 0,
  totals: { completeCourses: 153, sourcePages: 581 },
  paidCalls: 0, databaseWrites: 0, parentImagesOpened: 0,
  finish: 'review', formalHandoff: false, continuousProduction: true, scopeCompleted: false,
};
save(`${out}/result.json`, result);
copy(`${ticket}/production-meter.json`, `${out}/production-meter.before.json`);
copy(`${ticket}/review.md`, `${out}/review.before.md`);
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
for (const row of rows) {
  meter.currentResume1816[row.prepare] = { status: 'FIRST_MISSING_EN_PREPARE_PASS', evidence: row.prepared };
  meter.currentResume1816[row.author] = { status: row.status, evidence: row.authored, reviewer: row.reviewer };
}
meter.currentResume1816.D1330 = { status: 'AUTHOR_MATH_TOKEN_ORDER_FAILURE_PRESERVED_RECOVERED_BY_D1339',
  evidence: result.originalN20Failure, sourceScienceApproval: false };
meter.currentResume1816.D1340 = { status: 'NEXT_FOUR_EN_REVIEW_AND_TECHNICAL_ADAPTER_ACTIVE',
  evidence: bind(`${out}/result.json`), noReceiptOnlyCommit: true };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(`${ticket}/production-meter.json`, JSON.stringify(meter, null, 2) + '\n');
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1307-D1340: After ordinary D1295 push98c24795fc1de56beb5561ac96c822ca2647fa81 and independent remote proof, continued N10/N15/N18/N20 FIRST English production. Inventory72objects/0tasks/6figures; five unchanged reviewed SVGs plus one generatedPNG. All four actual prepare and historical delivery commit-byte comparisons passed for raw/fourChinese/sourcepages. English author checks passed14/26/16/39paragraphs. Original N20D1330 math-token-order failure preserved; D1339 changes only workedexample2 prompt order to match source, no content approval invented. Four independent FIRST English science/fidelity/readability reviewers active with zero images assigned; downstream mixed-mode scratch-helper adapter active, not accepted. No finalization/display/retention/push approval for this new batch yet. Historical source/science binding gaps preserved; no source/figure pixel reopening, new paid calls/DB/broadtests/force/merge/deploy/formalhandoff/scopecompletion. Counts153/581 unchanged, production continues.\n');
console.log(JSON.stringify({ result: bind(`${out}/result.json`), reviews: rows.length, totals: result.totals }));
