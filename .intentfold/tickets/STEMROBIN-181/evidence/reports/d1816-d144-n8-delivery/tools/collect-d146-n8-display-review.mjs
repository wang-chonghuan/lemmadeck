import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d146-n8-display-review`;
const [reportSha, freezeSha, reviewer] = process.argv.slice(2);
assert.match(reportSha || '', /^[a-f0-9]{64}$/);
assert.match(freezeSha || '', /^[a-f0-9]{64}$/);
assert.match(reviewer || '', /^[a-f0-9-]{36}$/);
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const report = bind(`${O}/report.json`);
const freeze = bind(`${O}/review-freeze.json`);
assert.equal(report.sha256, reportSha);
assert.equal(freeze.sha256, freezeSha);
const review = read(report.path);
assert.equal(review.status.toLowerCase(), 'pass');
assert.equal(review.reviewerIsAuthor, false);
assert.equal(review.independent, true);
assert(review.actualImageOpens <= 8);
assert.deepEqual(review.findings, []);
const result = read(`${T}/tmp/d1816-d144-n8-display/result.json`);
const screenshots = result.records.map(row => {
  const reviewed = review.screenshots.find(item =>
    path.resolve(item.path) === path.resolve(row.screenshot.path) && item.sha256 === row.screenshot.sha256);
  assert(reviewed, row.screenshot.path);
  assert.equal(reviewed.verdict.toLowerCase(), 'pass');
  assert.equal(bind(row.screenshot.path).sha256, row.screenshot.sha256);
  return { ...row.screenshot, locale: row.locale, viewport: row.viewport.name, verdict: 'pass' };
});
const file = `${O}/parent-collected.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D146', status: 'pass', reviewer, reviewerClosed: true,
  report, freeze, screenshots, actualImageOpens: review.actualImageOpens,
  independent: true, reviewerIsAuthor: false, scope: 'Four current offline display surfaces only',
  parentImageOpens: 0, canonicalPromotions: 0, completeCoursesAdded: 0,
  sourceReviewsReplayed: false, nativeStagesReplayed: 0, productAcceptance: false,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D146, {
  status: 'FIRST_FOUR_N8_OFFLINE_DISPLAY_PIXELS_PASS_COLLECTED_CLOSED',
  reviewer, reviewerClosed: true, report, freeze, collected: bind(file),
  actualReviewerImages: review.actualImageOpens, independentApproval: true,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(file), screenshots: screenshots.length,
  imagesOpened: 0, completeCoursesAdded: 0 }));
