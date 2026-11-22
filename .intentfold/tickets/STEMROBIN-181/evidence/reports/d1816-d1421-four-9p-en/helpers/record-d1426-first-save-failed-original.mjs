import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ticket, bind, read, save } from './n42-native.mjs';

const meterPath = `${ticket}/production-meter.json`;
const meter = read(meterPath);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 153);
assert.equal(meter.sourcePagesFinalized, 581);
const inventory = bind(`${ticket}/tmp/d1816-d1392-next-kinetic-phase-en-inventory/result.json`);
assert.equal(inventory.sha256, '62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3');
const rows = [
  ['n34', 'D1393', 'D1425', 'affected-text', 'D1395', '01a204e4-0c04-7ad3-8d46-323c6c28d948'],
  ['n35', 'D1400', 'D1401', 'first-missing-en', 'D1402', '01a204e6-2268-72d2-9a8b-752028a593cf'],
  ['n38', 'D1407', 'D1423', 'first-missing-en', 'D1409', '01a204ea-9c3a-7581-a15d-0fb540e5e91a'],
  ['n39', 'D1414', 'D1424', 'first-missing-en', 'D1416', '01a204ea-d4c1-7de2-ad5f-5ecc2b1b3a27'],
].map(([number, prepare, author, suffix, review, agent]) => {
  const prepared = bind(`${ticket}/tmp/d1816-${prepare.toLowerCase()}-${number}-first-missing-en/prepared.json`);
  const authored = bind(`${ticket}/tmp/d1816-${author.toLowerCase()}-${number}-${suffix}/authored.json`);
  const value = read(authored.path);
  assert(['FIRST_MISSING_EN_AUTHOR_NATIVE_PASS', 'AFFECTED_ONLY_HEAT_PARTICLE_FINDINGS_AUTHOR_PASS'].includes(value.status));
  meter.currentResume1816[prepare] = { status: 'FIRST_MISSING_EN_PREPARE_PASS', evidence: prepared };
  meter.currentResume1816[author] = {
    status: value.status, evidence: authored, flowParagraphs: value.flowParagraphs,
    independentReview: { task: review, agent, status: 'PENDING', imagesAuthorized: 0 },
  };
  return { number, prepare, author, prepared, authored, review, agent, paragraphs: value.flowParagraphs };
});
const firstReview = bind(`${ticket}/tmp/d1816-d1395-n34-first-en-review/review.json`);
assert.equal(read(firstReview.path).status, 'REVISE');
meter.currentResume1816.D1395 = { status: 'FIRST_EN_REVISE_THREE_LOCAL_FINDINGS_PRESERVED', evidence: firstReview };
const n35Review = bind(`${ticket}/tmp/d1816-d1402-n35-first-en-review/review.json`);
assert.equal(read(n35Review.path).status, 'REVISE');
meter.currentResume1816.D1402 = {
  status: 'FIRST_EN_REVISE_FOUR_LOCAL_READABILITY_FINDINGS_PRESERVED',
  evidence: n35Review, independentScienceFidelityPassed: true,
};
for (const [task, number, recovery, cause] of [
  ['D1408', 'n38', 'D1423', 'Temperature/pressure/volume formula-token order'],
  ['D1415', 'n39', 'D1424', 'Omitted original cover-location digit 2'],
]) {
  const receipt = bind(`${ticket}/tmp/d1816-recovery/native/${task.toLowerCase()}-${number}-first-missing-en-author-native/receipt.json`);
  assert.notEqual(read(receipt.path).exitCode, 0);
  meter.currentResume1816[task] = {
    status: 'FIRST_AUTHOR_FAILURE_PRESERVED_AFFECTED_RECOVERY_NATIVE_PASS',
    evidence: receipt, recoveredBy: recovery, cause, independentContentApproval: false,
  };
}
meter.currentResume1816.D1426 = {
  status: 'FOUR_KINETIC_PHASE_ENGLISH_AUTHORS_NATIVE_PASS_INDEPENDENT_REVIEWS_PENDING',
  inventory, rows,
  helperAdapter: { agent: '01a204e8-7a33-76c3-a2e2-822a564e7068', status: 'ACTIVE_NOT_ACCEPTED' },
  sourceAndChineseReviewReplayed: false, parentNewImages: 0,
  newCompleteCourses: 0, newSourcePages: 0, databaseWrites: 0, paidCalls: 0,
  formalHandoff: false, scopeCompleted: false, continuousProduction: true,
  additionalElapsedTimeAndTokenCost: 'unknown',
};
meter.updatedAt = new Date().toISOString();
save(meterPath, meter);
fs.appendFileSync(`${ticket}/review.md`,
  '\nD1392-D1426: Continued N34/N35/N38/N39 first English production after D1381 ordinary verified push. All four first prepare and source/fourChinese/sourcepage historical commit-byte bindings PASS;69originalobjects/0tasks,7unique unchanged figures(6SVG/1decorative160pxPNG;shared55 used by two lessons). Authors now23/33/28/32paragraphs. N34 FIRST REVISE three local definition/unit-conversion/referent findings preserved; only affected prose3/14/19 and adjacent flow anchors repaired/nativechecked underD1425, independent affected review pending. N35 science/fidelityPASS with four local readability findings, originalREVISEpreserved. N38D1408 formula-token-order and N39D1415 cover2-digit failures preserved; failed author stages recovered only underD1423/D1424. N38 three registered V2-vapor/V1-liquid errata and N39 critical-state conditions remain sourcebound. Four independent reviewers at0images; missing nativefinalize/display/pixel/width/retention stages remain pending, scratchadapteractive. No source/Chinese/figure replay,paid/DB/broadtest/force/merge/deploy/formalhandoff/scopecompletion or extra counts;totals153/581unchanged. Further elapsed/tokencost unknown,continuousproductionactive.\n');
console.log(JSON.stringify({ rows: rows.map(row => ({ number: row.number, paragraphs: row.paragraphs })), inventory }));
