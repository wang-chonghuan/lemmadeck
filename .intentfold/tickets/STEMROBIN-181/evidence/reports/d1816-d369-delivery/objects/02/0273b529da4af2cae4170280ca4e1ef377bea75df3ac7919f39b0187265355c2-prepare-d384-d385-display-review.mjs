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
const captureFile = `${T}/tmp/d1816-d382-display-missing-evidence/result.json`;
const capture = read(captureFile);
assert.equal(capture.status, 'pass');
const images = capture.observations.flatMap(row => row.screenshots.map(image => ({
  ...image, kind: row.kind, id: row.id, locale: row.locale, viewport: row.viewport,
  html: row.html, destination: row.destination ?? null,
})));
assert.equal(images.length, 12);
for (const image of images) assert.equal(bind(image.path).sha256, image.sha256);
const first = images.filter(row => row.kind === 'mobile-figure-pan' ||
  (row.id.endsWith('n149') && row.viewport.name === 'mobile'));
const second = images.filter(row => !first.includes(row));
assert.equal(first.length, 6);
assert.equal(second.length, 6);
for (const [id, suffix, screenshots, previousImages] of [
  ['D384', 'mobile-pan-and-empty-first-review', first, 0],
  ['D385', 'remaining-empty-destinations-first-review', second, 6],
]) {
  const dir = `${T}/tmp/d1816-${id.toLowerCase()}-${suffix}`;
  assert(!fs.existsSync(dir));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}/input-freeze.json`, JSON.stringify({
    stage: id, status: 'prepared-not-dispatched',
    scope: 'FIRST independent review of missing D364 final-display pixels only',
    originalHold: bind(`${T}/tmp/d1816-d364-n149-n151-display-review/report.json`),
    captureResult: bind(captureFile), screenshots,
    previousReviewerContextImages: previousImages, maximumNewImages: 6,
    maximumActualContextImagesAfterBatch: previousImages + 6,
    originalScreenshotsMustNotBeReopened: true,
    sourceScienceTranslationAndFigureSemanticReviewsMustNotBeReplayed: true,
    generatedCandidateEditsForbidden: true,
    parentImageOpens: 0, databaseWrites: false, paidCalls: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0,
  }, null, 2) + '\n', { flag: 'wx' });
}
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D383 = {
  status: 'SOURCE401_NATIVE_PASS_SOURCE402_FIRST_21_OF_22_FAIL_SOURCE403_UNEXECUTED',
  result: bind(`${T}/tmp/d1816-d383-source401403-first-native/result.json`),
  sourcePagesAdded: 0, completeCoursesAdded: 0, imagesOpened: 0,
  counterOrCandidateRepair: false, independentPixelDiagnosisPending: true,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared: ['D384', 'D385'], eachImages: 6,
  noNewReviewerDispatched: true, delivered: meter.currentCheckpoint.completeDeliveredCards }));
