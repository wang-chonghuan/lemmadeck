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
const figRoot = `${T}/tmp/d1816-d344-fig277-label-repair`;
const figure = JSON.parse(fs.readFileSync(`${figRoot}/author-freeze.json`));
for (const name of ['source', 'spec', 'svg', 'render', 'preview'])
  assert.equal(bind(figure[name].path).sha256, figure[name].sha256);
meter.currentResume1816.D344 = {
  ...meter.currentResume1816.D344, status: 'AUTHOR_CLOSED_NATIVE_PASS_FIRST_FIGURE_REVIEW_PENDING',
  agentClosed: true, authorFreeze: bind(`${figRoot}/author-freeze.json`),
  report: bind(`${figRoot}/report.json`), actualImageOpens: 3,
  additionalLayoutRepairs: 1, totalKnownFigureAuthorRepairs: 2,
  independentFigureApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D336 = {
  ...meter.currentResume1816.D336, status: 'FIRST_TEXT_ROWS_BOUNDARIES_PASS_MARKER_AND_PUNCTUATION_QUALIFIED_CLOSED',
  reviewerClosed: true,
  report: bind(`${T}/tmp/d1816-d336-source389-391-review/report.json`),
  reviewFreeze: bind(`${T}/tmp/d1816-d336-source389-391-review/review-freeze.json`),
  actualImageOpens: 8,
};
meter.currentResume1816.D346 = {
  ...meter.currentResume1816.D346, status: 'FIRST_SOURCE392393_REVIEW_ACTIVE',
  reviewer: '01a1faf5-df1b-7a20-8146-cbcdcac4f3a4',
};
meter.currentResume1816.D347 = {
  status: 'N149_F1_F4_AFFECTED_ONLY_REVIEW_QUEUED_SAME_SOLE_REVIEWER',
  reviewer: '01a1faf5-df1b-7a20-8146-cbcdcac4f3a4',
  imagesAuthorized: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D348 = {
  status: 'SOURCE391_ORDINARY_CONJUNCTION_BOLD_REPAIR_NATIVE_PASS',
  authorFreeze: bind(`${T}/tmp/d1816-d348-source391-marker-repair/author-freeze.json`),
  imagesOpened: 0, contentRepairs: 1, affectedReviewPending: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D349 = {
  status: 'SOURCE390388_PUNCTUATION_AND391_AFFECTED_ONLY_REVIEW_QUEUED_SAME_REVIEWER',
  reviewer: '01a1faf5-df1b-7a20-8146-cbcdcac4f3a4',
  allAssignmentImagesBoundedTo8: true, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D350 = {
  status: 'N151_SOURCE_OBJECT_CLOSED_FIRST_ASSEMBLY_AND_BILINGUAL_PREPARE_PASS',
  prepared: bind(`${T}/tmp/d1816-d350-n151-preparation/prepared.json`),
  root: '.tmp/STEMROBIN-181/d1816-d350/root',
  work: '.tmp/STEMROBIN-181/d1816-d350/source-work',
  sourcePagesAdded: 0, completeCoursesAdded: 0, originalTasks: 0,
};
meter.currentResume1816.D351 = {
  status: 'FIRST_N151_BILINGUAL_AUTHOR_ACTIVE',
  agent: '01a1faf7-d3da-7131-adc3-52b700a8e1d7', imagesAuthorized: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D338 = {
  status: 'PREPARED_ONLY_FIRST_NATIVE_AND_APPROVAL_REQUIRED_BEFORE_CAPTURE',
  checker: bind(`${T}/tmp/d1816-recovery/check-d338-n149-offline.mjs`),
  browser: 'isolated-headless-chrome-per-direct-human-background-instruction',
  initialDerivationPreserved: bind(`${T}/tmp/d1816-recovery/d338-display-derivation.json`),
  overrides: 'Corrected unused headed launch to headless before any capture.',
  firstDisplayExecuted: false, imagesOpened: 0,
};
meter.currentResume1816.currentContinuation =
  '142 complete offline courses pushed. FIG277 D344 nativePASS, zero collisions,11labels min24px at640; first independentFIG pending, original renderer/contentFAIL and2known author repairs retained. D343 N149 four text repairs under sole reviewer alongside FIRST source392393 and narrow source388390 punctuation/source391 marker. D350 N151 actual26prose/0tasks/0figures assembled, first bilingual author D351 active. Source394 punctuation and archival source glyph/font holds remain scoped. No new complete course/source approval, paid call, DB, publisher, deploy, merge, closure or full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ recorded: ['D338', 'D344', 'D346', 'D347', 'D348', 'D349', 'D350', 'D351'], delivered: meter.currentCheckpoint.completeDeliveredCards }));
