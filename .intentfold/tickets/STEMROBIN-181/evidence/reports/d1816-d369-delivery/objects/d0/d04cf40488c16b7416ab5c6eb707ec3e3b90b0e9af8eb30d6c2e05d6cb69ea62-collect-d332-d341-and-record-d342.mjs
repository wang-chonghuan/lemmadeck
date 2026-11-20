import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const meterFile = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(meterFile));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const authorRoot = `${T}/tmp/d1816-d341-source392-394-author`;
const author = JSON.parse(fs.readFileSync(`${authorRoot}/report.json`));
for (const page of author.pages) {
  assert.equal(bind(page.draft.path).sha256, page.draft.sha256);
  assert.equal(bind(page.source_original_render.path).sha256, page.source_original_render.sha256);
}
meter.currentResume1816.D341 = {
  status: 'FIRST_SOURCE392_394_AUTHOR_CLOSED_PUNCTUATION_HOLD_RETAINED',
  authorClosed: true, root: '.tmp/STEMROBIN-181/d1816-d341/root',
  work: '.tmp/STEMROBIN-181/d1816-d341/source-work',
  report: bind(`${authorRoot}/report.json`), authorFreeze: bind(`${authorRoot}/author-freeze.json`),
  actualImageOpens: author.usage.actual_image_opens,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
for (const [stage, root, status, count] of [
  ['D332', `${T}/tmp/d1816-d332-n149-first-text-review`, 'FIRST_TEXT_FAIL_F1_F4_COLLECTED_CLOSED', 0],
  ['D333', `${T}/tmp/d1816-d333-fig277-first-author`, 'AUTHOR_CLOSED_RENDERER_BLOCKER_RECOVERED_SEPARATE_LABEL_FAIL', 1],
]) {
  assert(fs.existsSync(`${root}/report.json`));
  meter.currentResume1816[stage] = {
    ...meter.currentResume1816[stage], status, agentClosed: true,
    report: bind(`${root}/report.json`),
    freeze: bind(`${root}/${stage === 'D332' ? 'review' : 'author'}-freeze.json`),
    actualImageOpens: count,
  };
}
meter.currentResume1816.D342 = {
  status: 'SHORT_ARROW_RECOVERY_AND_FOCUSED_REGRESSION_PASS_LABEL_COLLISION_RETAINED',
  renderer: bind('.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  regression: bind('.agents/skills/ld-s10y-image/tests/test_render_spec.py'),
  render: bind('.tmp/STEMROBIN-181/d1816-d342/fig-277.render.json'),
  failedCall: bind(`${T}/tmp/d1816-recovery/native/d342-fig277-short-arrow-recovery/receipt.json`),
  focusedTest: bind(`${T}/tmp/d1816-recovery/native/d342-short-arrow-focused-test/receipt.json`),
  originalSpecUnchanged: bind('.tmp/STEMROBIN-181/d1816-d333/fig-277.spec.json'),
  firstFailuresRetained: true, technicalRepair: 'Fit JSXGraph short-arrow heads within half of the actual screen-space segment; zero marker still fails.',
  imagesOpened: 0, paidCalls: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D343 = {
  status: 'F1_F4_TEXT_REPAIR_FROZEN_AFFECTED_REVIEW_PENDING',
  authorFreeze: bind(`${T}/tmp/d1816-d343-n149-text-repair/author-freeze.json`),
  contentRepairs: 1, imagesOpened: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D344 = {
  status: 'FIG277_POSITRON_LABEL_LAYOUT_AUTHOR_ACTIVE',
  agent: '01a1faf2-57fb-7e23-8a74-4d27ccb5147b',
  outputRoot: `${T}/tmp/d1816-d344-fig277-label-repair`,
  imagesAuthorized: 8, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D336.reviewer = '01a1faeb-c719-7f00-9882-5b2389b1b8d7';
meter.currentResume1816.D336.status = 'FIRST_SOURCE389_391_REVIEW_ACTIVE';
meter.currentResume1816.currentContinuation =
  '142 complete offline courses pushed. D332 first N149 text FAIL retained, D343 four affected repairs frozen. D333 author closed; actual zero short-arrow marker diagnosed, D342 renderer recovery and endpoint/visible-head regression PASS, genuine e+ label collision retained for D344. D336 source389391 independent review active. D341 source392394 author closed7images with394 punctuation HOLD. No new complete courses, source approvals, paid calls, DB, publisher, deploy, merge, closure or full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ stagesRecorded: ['D332', 'D333', 'D336', 'D341', 'D342', 'D343', 'D344'], delivered: meter.currentCheckpoint.completeDeliveredCards }));
