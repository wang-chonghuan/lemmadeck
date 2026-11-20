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
const affectedFile = `${T}/tmp/d1816-d371-n151-affected-text-review/report.json`;
assert.equal(read(affectedFile).status, 'PASS');
const nativeFile = `${T}/tmp/d1816-d362-n151-native/result.json`;
assert.equal(read(nativeFile).status, 'native-pass-display-pending');
r.D371 = { ...r.D371, status: 'N151_AFFECTED_TWO_FINDINGS_PASS_REVIEWER_CLOSED',
  report: bind(affectedFile),
  reviewFreeze: bind(`${T}/tmp/d1816-d371-n151-affected-text-review/review-freeze.json`),
  usage: read(affectedFile).usage, reviewerClosed: true };
r.D367.reviewerClosed = true;
r.D358.reviewerClosed = true;
r.D370.status = 'N151_REFERENCE_CLARITY_REPAIR_AFFECTED_PASS';
r.D351.status = 'FIRST_SCI_PASS_AND_TWO_ZHEN_FINDINGS_AFFECTED_PASS_COMPOSED';
r.D362 = { status: 'N151_BOTH_NATIVE_FINALIZATIONS_AND_FIRST_OFFLINE_RENDERS_PASS',
  result: bind(nativeFile), completeCoursesAdded: 0, sourcePagesAdded: 0 };
r.D368 = { ...r.D368, status: 'FIRST_SOURCE394397_INDEPENDENT_REVIEW_ACTIVE',
  reviewer: '01a1fb1a-a46e-7631-ac1c-a9bac41653f8' };
r.D375 = { status: 'FIRST_SOURCE398400_AUTHOR_ACTIVE',
  author: '01a1fb19-09c8-7113-a415-03391e169fd0', imagesAuthorized: 8,
  completeCoursesAdded: 0, sourcePagesAdded: 0 };
const oldReport = `${T}/tmp/d1816-d334-source384-typography-supplement/report.json`;
r.D334 = { ...r.D334, status: 'FINITE_SOURCE384_TYPOGRAPHY_SUPPLEMENT_HOLD_REPORT_COLLECTED',
  report: bind(oldReport),
  reviewFreeze: bind(`${T}/tmp/d1816-d334-source384-typography-supplement/review-freeze.json`),
  actualImagesOpened: read(oldReport).usage.context_image_opens,
  activeInCurrentAgentInventory: false, agentClosed: null,
  closureLimitation: 'Historical report collected without waking or requerying its old agent.' };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ recorded: ['D371', 'D362', 'D368', 'D375', 'D334'],
  delivered: meter.currentCheckpoint.completeDeliveredCards }));
