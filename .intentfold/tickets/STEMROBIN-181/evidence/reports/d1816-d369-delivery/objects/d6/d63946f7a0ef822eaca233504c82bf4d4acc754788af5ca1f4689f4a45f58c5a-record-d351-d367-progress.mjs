import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const sourceOnly = { sourcePagesAdded: 0, completeCoursesAdded: 0 };
const authorRoot = `${T}/tmp/d1816-d351-n151-bilingual-author`;
const author = read(`${authorRoot}/report.json`);
for (const output of author.outputs) assert.equal(bind(output.path).sha256, output.sha256);
meter.currentResume1816.D351 = {
  status: 'AUTHOR_FROZEN_CLOSED_FIRST_SCI_ZHEN_PENDING',
  report: bind(`${authorRoot}/report.json`), authorFreeze: bind(`${authorRoot}/author-freeze.json`),
  usage: author.usage, reviewerIsAuthor: false, agentClosed: true, ...sourceOnly,
};
for (const [stage, folder] of [
  ['D355', 'd355-fig277-first-review'], ['D356', 'd356-source388390-affected-review'],
]) {
  const dir = `${T}/tmp/d1816-${folder}`;
  assert.equal(read(`${dir}/report.json`).status, 'PASS');
  meter.currentResume1816[stage] = { status: 'INDEPENDENT_PASS_REVIEWER_CLOSED',
    report: bind(`${dir}/report.json`), reviewFreeze: bind(`${dir}/review-freeze.json`),
    reviewerClosed: true, assignmentImageOpens: 2,
    imagesThisStage: stage === 'D355' ? 2 : 0, ...sourceOnly };
}
meter.currentResume1816.D354.status = 'EXACT_TWO_MARKS_AND_NOTES_AFFECTED_PASS';
meter.currentResume1816.D352.status = 'FIRST_FIGURE_PASS_CURRENT_CONTEXT';
meter.currentResume1816.D357 = { status: 'SOURCE_ONLY_RAW_AND_TEMPLATE_REBINDING_PASS',
  freeze: bind(`${T}/tmp/d1816-d357-n151-source-rebinding/input-freeze.json`),
  imagesOpened: 0, modernTextChanged: false, ...sourceOnly };
meter.currentResume1816.D358 = { status: 'FIRST_N151_SCI_AND_ZHEN_REVIEW_ACTIVE',
  reviewer: '01a1fb07-98bb-74a3-bbec-d60473ca8996', imagesAuthorized: 0, ...sourceOnly };
meter.currentResume1816.D360 = { status: 'FIRST_SOURCE395397_AUTHOR_ACTIVE',
  author: '01a1fb02-dfeb-7283-9e5e-3811ec5b592a', imagesAuthorized: 8, ...sourceOnly };
meter.currentResume1816.D361 = { status: 'ENGLISH_HEADING_CONTRACT_RECOVERY_FOCUSED_REGRESSION_PASS',
  source: bind('.claude/skills/ld-s10y-lesson/tools/edition.py'),
  tests: bind('.claude/skills/ld-s10y-lesson/tests/test_english_lesson_headings.py'),
  receipt: bind(`${T}/tmp/d1816-recovery/native/d361-english-heading-focused-regression/receipt.json`),
  protectedSourceSnapshotsUnchanged: true, ...sourceOnly };
meter.currentResume1816.D337 = { ...meter.currentResume1816.D337,
  status: 'FIRST_NATIVE_PRINTED_TITLE_AND_NORMALIZED_ANCHOR_FAILURE_RETAINED',
  result: bind(`${T}/tmp/d1816-d337-n149-native/result.json`),
  sourceFiguresRetained: 2, newCompleteCourses: 0 };
meter.currentResume1816.D365 = { status: 'N149_NATIVE_LAYOUT_ONLY_REPAIR_FROZEN_AFFECTED_REVIEW_PENDING',
  freeze: bind(`${T}/tmp/d1816-d365-n149-native-layout-repair/author-freeze.json`),
  native: bind(`${T}/tmp/d1816-recovery/native/d365-n149-native-layout-repair/receipt.json`),
  imagesOpened: 0, wordingMathDigitsChanged: false, ...sourceOnly };
meter.currentResume1816.D338.status = 'UNEXECUTED_REPLACED_BY_PLANNED_SINGLE_BATCH_D363';
meter.currentResume1816.currentContinuation =
  '142 complete offline courses pushed;563 source pages recorded unchanged. D355 firstFIG277 independentPASS,D356 two punctuation-only affectedPASS,reviewer closed2images. D351 N151 author closed26bilingual0fig0tasks, pure text/flow and original sources frozen; EN heading identity gap D361 fixed with6focusedPASS, no source snapshot edits. D357 repaired source-only assembly/snapshots PASS, D358 firstSCI/ZHEN active. D337 firstN149nativeFAIL retained (ZHprinted-title markup, native-normalized anchor), D365 whitespace-only4entries and same-position concept anchors plus matchingfigurecontext repaired/frozen; affectedreview pending. D360 firstSOURCE395397 author active<=8images. Parent23/24 unchanged,0newopens. No newcourse,paidtools,DB,publisher,merge,deploy,closure,formalhandoff or fullchecks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ recorded: ['D351','D355','D356','D357','D358','D360','D361','D337','D365'],
  completeDelivered: meter.currentCheckpoint.completeDeliveredCards }));
