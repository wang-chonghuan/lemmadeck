import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const file = `${ticket}/production-meter.json`;
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 139);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
const resume = meter.currentResume1816;
for (const [batch, dir, report, freeze, images, repairs] of [
  ['D280', 'd1816-d280-fig2425-author', 'report.json', 'output-freeze.json', 7, 0],
  ['D281', 'd1816-d281-fig2829-author', 'report.json', 'author-freeze.json', 6, 0],
  ['D282', 'd1816-d282-fig26-author', 'report.json', 'freeze.json', 3, 1],
]) {
  Object.assign(resume[batch], { status: 'AUTHOR_NATIVE_PASS_COLLECTED_CLOSED_REVIEW_PENDING',
    authorClosed: true, report: bind(`${ticket}/tmp/${dir}/${report}`),
    freeze: bind(`${ticket}/tmp/${dir}/${freeze}`), actualImageOpens: images,
    contentRepairs: repairs });
}
Object.assign(resume.D285, { status: 'FIG27_INDEPENDENT_SOURCE_MATH_VISUAL_CULTURAL_PASS_CLOSED',
  reviewerClosed: true, report: bind(`${ticket}/tmp/d1816-d285-fig27-review/report.json`),
  actualImageOpens: 3 });
resume.D287 = { status: 'N19_EXACT_ZH_RECOVERY_NEW_EN_TEXT_REVIEW_PENDING',
  authorClosed: true, report: bind(`${ticket}/tmp/d1816-d287-n19-text-recovery/d287-report.json`),
  freeze: bind(`${ticket}/tmp/d1816-d287-n19-text-recovery/d287-text-freeze.json`),
  actualImageOpens: 0, completeCoursesAdded: 0 };
resume.D288 = { status: 'FIG27_INSTALLED_REMAINING_FIGURES_PENDING',
  figure27: bind(`${ticket}/tmp/d1816-d288-figure-install/fig-27.installed.json`),
  completeCoursesAdded: 0 };
resume.D289 = { status: 'N19_TABLE_SOURCE_INVENTORY_GEOMETRY_DRAFT_REUSED_D293',
  inventory: bind(`${ticket}/tmp/d1816-d289-n19-table-author/source-inventory.json`),
  draft: bind(`${ticket}/tmp/d1816-d289-n19-table-author/geometry-draft.json`),
  actualParentImageOpens: 1, completeCoursesAdded: 0 };
for (const [batch, reviewer, images, scope] of [
  ['D290', '01a1fa9b-1493-73a0-8b2a-f8769402225b', 7, 'fig24/25'],
  ['D291', '01a1fa9d-40c1-7e31-8288-6c35092295e8', 4, 'fig26'],
  ['D292', '01a1fa9d-410c-7c70-a222-fd11b2797f78', 0, 'N19 EN SCI/reconstruction'],
  ['D294', '01a1fa9e-730e-7f22-b18a-6538749a4259', 8, 'fig28/29'],
  ['D296', '01a1faa1-67e9-7101-9228-b750955d0c31', 3, 'N19 table'],
]) resume[batch] = { status: 'FIRST_INDEPENDENT_REVIEW_ACTIVE', reviewer,
  imagesAuthorized: images, scope, completeCoursesAdded: 0 };
resume.D293 = { status: 'COMPLETE_N19_BILINGUAL_FIGURE_CONTEXT_BOUND_TABLE_FIRST_NATIVE_PASS',
  result: bind(`${ticket}/tmp/d1816-d293-n19-figure-context/result.json`),
  preview: bind(`${ticket}/tmp/d1816-d293-n19-figure-context/tbl-p0053-01/preview.json`),
  geometryRerenders: 0, tableFirstRenders: 1, completeCoursesAdded: 0 };
resume.D295 = { status: 'NATIVE_PARAGRAPH_BOUNDARY_AND_BOLD_REPAIR_PASS',
  result: bind(`${ticket}/tmp/d1816-d295-native-layout/result.json`),
  focusedTests: 5,
  testReceipt: bind(`${ticket}/tmp/d1816-recovery/native/d295-explicit-prose-and-bold-focused-tests/receipt.json`),
  diagnosticFailures: ['d295-six-current-template-normalization-equality', 'd295-layout-drift-diagnosis']
    .map(name => bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`)),
  sourceAndFormulaWordingChanged: false, N19ExactRecoveryPreserved: true,
  completeCoursesAdded: 0 };
resume.parentContinuationImageOpens = 16;
resume.currentContinuation = '139 complete offline courses pushed, unchanged. SOURCE48-51/raw24-29 retained D284. N17/N18 bilingual SCI text PASS D279, semantic boundaries preserved through native layout-only D295 repair. N19 exact ten-paragraph Chinese recovery retained, new English first review pending. Fig27 first independent PASS installed; remaining first figure reviews active. Table first validation/render/browser preview PASS awaiting independent review. Original failures and image usage preserved; parent opens16. No DB/publisher/deploy/merge/closure, paid calls, full-project checks or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ meter: bind(file), completeDeliveredCards: 139, parentImages: 16 }));
