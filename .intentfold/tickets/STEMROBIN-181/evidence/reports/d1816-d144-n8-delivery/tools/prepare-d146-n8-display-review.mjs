import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const D = `${T}/tmp/d1816-d144-n8-display`;
const O = `${T}/tmp/d1816-d146-n8-display-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const result = read(`${D}/result.json`);
assert.equal(result.status, 'pass');
assert.equal(result.records.length, 4);
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
for (const row of result.records) {
  for (const expected of [row.html, row.screenshot, row.figureScreenshot]) {
    assert.equal(bind(expected.path).sha256, expected.sha256);
  }
}
const file = `${O}/input-freeze.json`;
fs.writeFileSync(file, JSON.stringify({
  batch: 'D146', ticket: 'STEMROBIN-181', lesson: 'phy9-c1-s1-n8',
  role: 'FIRST_OFFLINE_BILINGUAL_DESKTOP_MOBILE_DISPLAY_PIXEL_REVIEW',
  result: bind(`${D}/result.json`), records: result.records,
  nativeFinalized: bind(`${T}/tmp/d1816-d144-n8-native/native-finalized.json`),
  independentTextReview: bind(`${T}/tmp/d1816-d140-n8-text-review/parent-collected.json`),
  independentFigureReview: bind(`${T}/tmp/d1816-d143-n8-figure-review/parent-collected.json`),
  requiredWholePageScreenshots: 4, optionalFigureCropsAvailable: 4,
  authorizedImageOpens: 8, maximumContextImageOpens: 24, parentImageOpens: 0,
  scope: 'Actual current screenshot layout, prose/formula fit, labels, clipping and coherent section separation. Do not replay SCI/ZH/EN or source/figure semantics.',
  mobileScrollScope: 'Figure media stays640px wide; DOM proves the reachable horizontal scroll end and minimum text size. Screenshots are captured at that edge. Deliberate scroll viewport truncation is not lost figure content.',
  originalTasks: 0, answers: 0, choices: 0, sourceReviewsReplayed: false,
  nativeStagesReplayed: false, productAcceptance: false, completeCoursesAdded: 0,
  canonicalPromotion: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D144, {
  status: 'FIRST_N8_NATIVE_AND_FOUR_OFFLINE_DOM_SURFACES_PASS_PIXELS_PENDING',
  display: bind(`${D}/result.json`), offlineSurfaces: 4,
});
Object.assign(meter.currentResume1816.D145, {
  status: 'FIRST_N9_SCI_ZHEN_REVIEW_ACTIVE',
  reviewer: '01a1f8c6-8646-7e30-a5cc-9331273bc0a3', reviewerClosed: false,
});
meter.currentResume1816.D146 = {
  status: 'FIRST_N8_DISPLAY_REVIEW_QUEUED_BEHIND_SOLE_D145_REVIEWER',
  inputFreeze: bind(file), imagesAuthorized: 8, completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: bind(file), surfaces: 4, screenshotsAvailable: 8,
  imagesOpened: 0, reviewerDispatched: false }));
