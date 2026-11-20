import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const report = (id, suffix) => `${T}/tmp/d1816-${id}-${suffix}/report.json`;
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
assert.equal(meter.sourcePagesFinalized, 563);
const r = meter.currentResume1816;
for (const [id, suffix, status] of [
  ['D368', 'source394397-first-review', 'FIRST_REVIEW_HOLD_PRESERVED_TWO_NECESSARY_FINDINGS_ADJUDICATED_D378'],
  ['D364', 'n149-n151-display-review', 'FIRST_PIXEL_HOLD_PRESERVED_MISSING_EVIDENCE_CAPTURED_D382'],
  ['D378', 'source395396-affected-adjudication', 'TWO_SOURCE_DISAGREEMENTS_AFFECTED_PASS_NO_CANDIDATE_EDITS'],
]) {
  const file = report(id.toLowerCase(), suffix);
  r[id] = { ...r[id], status, report: bind(file), usage: read(file).usage,
    sourcePagesAdded: 0, completeCoursesAdded: 0 };
}
for (const [id, suffix, author, images] of [
  ['D375', 'source398400-first-author', '01a1fb19-09c8-7113-a415-03391e169fd0', 6],
  ['D377', 'source401403-first-author', '01a1fb1f-2632-70a3-841e-77c3e51ad61e', 5],
]) {
  const dir = `${T}/tmp/d1816-${id.toLowerCase()}-${suffix}`;
  r[id] = { ...r[id], status: 'FIRST_AUTHOR_FROZEN_CLOSED_NOT_SOURCE_APPROVAL',
    author, authorClosed: true, actualImagesOpened: images,
    report: bind(`${dir}/report.json`), authorFreeze: bind(`${dir}/author-freeze.json`),
    sourcePagesAdded: 0, completeCoursesAdded: 0 };
}
r.D379 = { status: 'FIRST_SOURCE398400_REVIEW_ACTIVE',
  reviewer: '01a1fb1a-a46e-7631-ac1c-a9bac41653f8',
  inputFreeze: bind(`${T}/tmp/d1816-d379-source398400-first-review/input-freeze.json`),
  previousReviewerContextImages: 18, maximumNewImages: 6, maximumActualContextImages: 24,
  firstByteEqualityGuardFailurePreserved: true, sourcePagesAdded: 0, completeCoursesAdded: 0 };
r.D380 = { status: 'THREE_NATIVE_30_OF_30_PASS_SOURCE_REVIEW_PENDING',
  result: bind(`${T}/tmp/d1816-d380-source398400-first-native/result.json`),
  authorTextUnchanged: true, sourcePagesAdded: 0, completeCoursesAdded: 0 };
r.D381 = { status: 'FIRST_SOURCE404406_AUTHOR_ACTIVE',
  author: '01a1fb28-c96b-7f63-94c2-830d69693d9d', maximumImages: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
r.D382 = { status: 'MISSING_DISPLAY_EVIDENCE_AUTOMATIC_PASS_PIXEL_REVIEW_PENDING',
  result: bind(`${T}/tmp/d1816-d382-display-missing-evidence/result.json`),
  screenshotsCaptured: 12, actualForwardBackNavigationPairs: 8,
  actualMobilePanPairs: 2, parentImageOpens: 0, headless: true, offline: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ updated: ['D368', 'D364', 'D378', 'D375', 'D377',
  'D379', 'D380', 'D381', 'D382'], delivered: 142, sourcePages: 563 }));
