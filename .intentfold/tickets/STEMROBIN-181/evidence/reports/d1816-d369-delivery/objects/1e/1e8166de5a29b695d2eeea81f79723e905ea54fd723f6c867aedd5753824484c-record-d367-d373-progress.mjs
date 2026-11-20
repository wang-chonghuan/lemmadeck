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
const r = meter.currentResume1816;
const unaffected = { completeCoursesAdded: 0, sourcePagesAdded: 0, imagesOpened: 0, paidToolCalls: 0 };
const reviewFile = `${T}/tmp/d1816-d367-n149-layout-context-review/report.json`;
assert.equal(read(reviewFile).status, 'PASS');
r.D367 = { status: 'N149_AFFECTED_LAYOUT_CONTEXT_PASS', report: bind(reviewFile),
  reviewFreeze: bind(`${T}/tmp/d1816-d367-n149-layout-context-review/review-freeze.json`),
  usage: read(reviewFile).usage, ...unaffected };
r.D365.status = 'N149_LAYOUT_ONLY_REPAIR_AFFECTED_PASS';
const failedFile = `${T}/tmp/d1816-d366-n149-native-recovery/result.json`;
assert.equal(read(failedFile).status, 'native-failure');
r.D366 = { status: 'BOTH_NATIVE_FINALIZATIONS_AND_ZH_RENDER_PASS_EN_RENDER_FAIL_RETAINED',
  result: bind(failedFile), ...unaffected };
r.D372 = { status: 'ENGLISH_CHAPTER_RENDERER_CONTRACT_FIX_FIVE_FOCUSED_TESTS_PASS',
  source: bind('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  tests: bind('.claude/skills/ld-s10y-lesson/tests/test_render_lesson.py'),
  receipt: bind(`${T}/tmp/d1816-recovery/native/d372-english-chapter-render-focused-regression/receipt.json`),
  technicalRepairsAdded: 1, ...unaffected };
const recoveredFile = `${T}/tmp/d1816-d373-n149-en-render-recovery/result.json`;
assert.equal(read(recoveredFile).status, 'native-pass-display-pending');
r.D373 = { status: 'FAILED_EN_RENDER_ONLY_RECOVERED_N149_NATIVE_PASS_DISPLAY_PENDING',
  result: bind(recoveredFile), unaffectedSuccessfulStagesReplayed: 0, ...unaffected };
r.D371 = { status: 'N151_AFFECTED_TWO_FINDINGS_REVIEW_ACTIVE',
  reviewer: '01a1fb07-98bb-74a3-bbec-d60473ca8996', ...unaffected };
r.D368 = { status: 'FIRST_SOURCE394397_REVIEW_INPUTS_FROZEN_REVIEWER_NOT_DISPATCHED',
  inputFreeze: bind(`${T}/tmp/d1816-d368-source394397-first-review/input-freeze.json`),
  imagesAuthorized: 8, ...unaffected };
r.currentContinuation = '142 complete offline courses pushed;563 source pages unchanged. D358 first SCI PASS/ZHEN two findings FAIL retained. D370 only entry15 references/EN model wording repaired with source/math/digit/metadata/anchors unchanged; D371 affected review active. D367 N149 layout/context affected PASS. D366 both native finalizations and ZH render PASS, EN translated-chapter renderer FAIL retained. D372 chapter-only renderer fix with five focused tests PASS; D373 only failed EN render recovered, no successful-stage replay. D360 author closed8images with scoped HOLDs; D368 firstSOURCE394397 inputs frozen but not yet dispatched. Parent23/24 remains zero new opens. No new paidtools, DB/publish/merge/deploy/closure/formalhandoff/full-project checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ recorded: ['D367', 'D366', 'D372', 'D373', 'D371', 'D368'],
  delivered: meter.currentCheckpoint.completeDeliveredCards, sourcePages: meter.sourcePagesFinalized }));
