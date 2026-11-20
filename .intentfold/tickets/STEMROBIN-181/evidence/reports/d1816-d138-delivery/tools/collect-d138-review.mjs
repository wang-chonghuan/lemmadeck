import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const phase = process.argv[2];
assert(['semantic', 'pixels'].includes(phase));
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verified = new Map();
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    const actual = verified.get(value.path) || bind(value.path);
    assert.equal(actual.sha256, value.sha256, value.path);
    verified.set(value.path, actual);
  }
  for (const child of Object.values(value)) visit(child);
}
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const current = meter.currentResume1816.D138;
let output;
let result;
if (phase === 'semantic') {
  const dir = `${T}/tmp/d1816-d138-t9-semantic-review`;
  const freeze = bind(`${dir}/review-freeze.json`);
  assert.equal(freeze.sha256, 'b1ddb37921607847b49391b59189ac2d5017aef243e29d495346293f4bacd3d8');
  visit(read(freeze.path));
  const report = bind(`${dir}/report.json`);
  assert.equal(report.sha256, '079b6c18f4c4d0ebf939dbeef7de19fed90695c956b4c8e74334470d8a7d267f');
  const content = read(report.path);
  for (const field of ['status', 'englishQ2AffectedVerdict', 'answersVerdict']) assert.equal(content[field], 'pass');
  assert.equal(content.reviewerIsAuthor, false);
  for (const locale of ['zh', 'en']) assert.equal(read(`${dir}/review.${locale}.json`).outcome, 'pass');
  output = `${dir}/parent-collected.json`;
  result = { batch: 'D138', status: 'FIRST_SEMANTIC_PASS_COLLECTED_CLOSED',
    reviewer: '01a1f870-e3eb-7ab0-a109-3eb04ecde999', reviewerClosed: true,
    freeze, report, verifiedBindings: [...verified.values()],
    originalWrittenTasks: 6, choiceQuestionsPerLocale: 6, readOnlyStandardsPerLocale: 6,
    actualImages: 4, wholeCourseApproved: false, canonicalPromotion: false,
    completeCoursesAdded: 0, sourcePagesAdded: 0, passedStagesReplayed: 0 };
  Object.assign(current, { semanticReviewerClosed: true, semanticReviewFreeze: freeze,
    semanticReview: report, independentChoicesAndAnswersApproved: true,
    englishQ2AffectedReviewPending: false, actualSemanticReviewerImages: 4,
    status: 'SEMANTIC_PASS_COLLECTED_CLOSED_TWELVE_DISPLAY_PIXELS_PENDING' });
} else {
  const dir = `${T}/tmp/d1816-d138-t9-display-review`;
  const screenshots = [];
  const reviews = [];
  for (const locale of ['zh', 'en']) {
    const report = read(`${dir}/${locale}/report.json`);
    assert.equal(report.reviewerIsAuthor, false);
    assert.equal(report.screenshots.length, 6);
    assert(report.imageOpens <= 8);
    visit(read(`${dir}/${locale}/review-freeze.json`));
    visit(report.screenshots);
    reviews.push({ locale, report: bind(`${dir}/${locale}/report.json`),
      freeze: bind(`${dir}/${locale}/review-freeze.json`), imageOpens: report.imageOpens,
      reviewerClosed: true });
    if (locale === 'zh') {
      assert.equal(report.status, 'revise');
      const inherited = report.screenshots.filter(row => row.status === 'pass');
      assert.equal(inherited.length, 5);
      const affected = read(`${dir}/zh-affected/report.json`);
      assert.equal(affected.status, 'pass');
      assert.equal(affected.reviewerIsAuthor, false);
      assert.equal(affected.screenshots.length, 1);
      assert(affected.imageOpens <= 8);
      visit(read(`${dir}/zh-affected/review-freeze.json`));
      visit(affected.screenshots);
      assert.equal(affected.screenshots[0].status, 'pass');
      screenshots.push(...inherited, ...affected.screenshots);
      reviews.push({ locale, affectedOnly: true, report: bind(`${dir}/zh-affected/report.json`),
        freeze: bind(`${dir}/zh-affected/review-freeze.json`), imageOpens: affected.imageOpens,
        reviewerClosed: true, inheritedPassedScreenshots: 5 });
    } else {
      assert.equal(report.status, 'revise');
      const inherited = report.screenshots.filter(row => row.status === 'pass');
      assert.equal(inherited.length, 4);
      const affected = read(`${dir}/en-affected/report.json`);
      assert.equal(affected.status, 'pass');
      assert.equal(affected.reviewerIsAuthor, false);
      assert.equal(affected.screenshots.length, 2);
      assert(affected.imageOpens <= 8);
      visit(read(`${dir}/en-affected/review-freeze.json`));
      visit(affected.screenshots);
      assert(affected.screenshots.every(row => row.status === 'pass'));
      screenshots.push(...inherited, ...affected.screenshots);
      reviews.push({ locale, affectedOnly: true, report: bind(`${dir}/en-affected/report.json`),
        freeze: bind(`${dir}/en-affected/review-freeze.json`), imageOpens: affected.imageOpens,
        reviewerClosed: true, inheritedPassedScreenshots: 4 });
    }
  }
  assert.equal(new Set(screenshots.map(row => path.resolve(row.path))).size, 12);
  output = `${dir}/combined.json`;
  result = { batch: 'D138', status: 'pass', screenshots, reviews,
    verifiedBindings: [...verified.values()], offline: true, productAcceptance: false,
    parentImageOpens: 0, completeCoursesAdded: 0,
    displayOnlyRepairs: 2, originalFailurePreserved: true,
    mathContentChanged: false, passedScreenshotReviewsReplayed: 0,
    layoutMetricScope: 'Nine unchanged surfaces reuse their original layout checks. Two changed English mobile surfaces have fresh list-box and Q3 unit-group bounds; English answers also preserve Q4-Q6 base-bound checks. Changed Chinese mobile answers retain current base bounds and actual pixels but historical list-box positions.' };
  Object.assign(current, { status: 'ALL_T9_OFFLINE_STAGES_PASS_DURABLE_RETENTION_PENDING',
    offlineDisplay: bind(`${T}/tmp/d1816-d138-t9-display/latest-result.json`),
    displayReviewersClosed: true, displayReviews: reviews, canonicalPromotions: 0 });
}
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
current[phase === 'semantic' ? 'semanticCollected' : 'displayPixelsCollected'] = bind(output);
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ phase, collected: bind(output), verifiedBindings: verified.size,
  completeCoursesAdded: 0, imagesOpened: 0 }));
