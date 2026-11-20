import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d317-source383-385-review`;
const O = `${T}/tmp/d1816-d325-source383-385-affected-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d325/root';
const work = '.tmp/STEMROBIN-181/d1816-d325/source-work';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const report = bind(`${V}/report.json`);
const freeze = bind(`${V}/review-freeze.json`);
assert.equal(report.sha256, '767faeec6912f0a6ba3ada916a172e5f9e767b8b5934a5f104518eca6f15414e');
assert.equal(freeze.sha256, '113695bcde18c9a0fa292b1a03edde24564b89ae0734c53bd876c0dfcf12ea66');
let verified = 0;
const verify = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    assert.equal(bind(value.path).sha256, value.sha256, value.path);
    verified += 1;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(verify);
    else if (child && typeof child === 'object') verify(child);
  }
};
verify(read(freeze.path));
const review = read(report.path);
assert.equal(review.findings.length, 7);
const collected = save(`${V}/parent-collected.json`, {
  batch: 'D317', reviewerClosed: true, report, reviewFreeze: freeze,
  verifiedBindings: verified, actualImageOpens: 8, sourceRows: [26, 18, 26],
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
});
const copy = (from, to, mode = 0o444) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
const originals = [383, 384, 385].map(page => {
  const number = String(page).padStart(4, '0');
  const from = `.tmp/STEMROBIN-181/d1816-d316/root/10p/pages/${number}/page.md`;
  copy(from, `${root}/10p/pages/${number}/page.md`, 0o644);
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`.tmp/STEMROBIN-181/d1816-d316/source-work/10p/pages/${number}/${name}`,
      `${work}/10p/pages/${number}/${name}`);
  fs.mkdirSync(`${work}/10p/pages/${number}/figures`, { recursive: true });
  if (page === 384)
    for (const name of ['fig-277.png', 'fig-277.svg'])
      copy(`.tmp/STEMROBIN-181/d1816-d316/source-work/10p/pages/${number}/figures/${name}`,
        `${work}/10p/pages/${number}/figures/${name}`);
  return { page, before: bind(from) };
});
const prepared = save(`${O}/prepared.json`, {
  batch: 'D325', reviewBatch: 'D326', root, work, originals,
  priorIndependentReview: report, reviewFreeze: freeze, expectedRows: [26, 18, 26],
  intendedContentEdits: review.findings,
  bodyReplacements: [
    { page: 383, from: '只是在核中子靠着', to: '只是在核中中子靠着' },
    { page: 383, from: '此闪烁物层在量子穿过', to: '此闪烁物层在$\\gamma$量子穿过' },
    { page: 384, from: '过了一段不太大的时间', to: '过了一段不大的时间' },
    { page: 384, from: '引起闪烁物闪光. 这个闪光', to: '引起闪烁物闪光，这个闪光' },
    { page: 385, from: '基本粒子，而重氢——氘', to: '基本粒子. 而重氢——**氘**' },
    { page: 385, from: '**静止质量**', to: '静止质量' },
  ],
  countingBoundary: null, actualParentImageOpens: 0,
  contentRepairsByPage: { 383: 1, 384: 1, 385: 1 },
  reusedVectorization: bind(`${T}/tmp/d1816-recovery/native/d316-source384-first-vectorize/receipt.json`),
  crops: [], sourceApproval: false, completeCoursesAdded: 0,
});
const raw = `${T}/tmp/d1816-d320-raw277-first-review`;
const supplement = save(`${raw}/fine-detail-supplement.json`, {
  batch: 'D320', role: 'NECESSARY_FIRST_ORIGINAL_FIG277_FINE_DETAIL_BEFORE_RAW_CANDIDATES',
  priorInput: bind(`${raw}/input-freeze.json`),
  original: bind('.tmp/STEMROBIN-181/d1816-d316/source-work/10p/pages/0384/page.png'),
  originalCropBoxXYWH: [400, 230, 680, 565],
  instructions: 'Before RAW/SVG candidates, create/open exactly this original-derived figure detail and freeze missing directed zigzag/C-junction/label/arrow inventory. Reuse D317 passed gross original facts. Then open rawPNG and existingSVGpreview once each. This necessary supplemental fine stage adds one image, not a new source whole-page review.',
  imagesAuthorized: 3, maximumContextImageOpens: 24, parentImageOpens: 0,
  sourceApproval: false, modernFigureApproval: false, completeCoursesAdded: 0,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D317, {
  status: 'FIRST_REVIEW_COLLECTED_CLOSED_SEVEN_SOURCE_DEFECTS_AND_HOLDS',
  report, reviewFreeze: freeze, parentCollected: collected, reviewerClosed: true,
  actualImageOpens: 8, sourceApproval: false,
});
meter.currentResume1816.D325 = {
  status: 'SOLE_SOURCE383_385_AFFECTED_RECOVERY_PREPARED', prepared, root, work,
  contentRepairsByPage: { 383: 1, 384: 1, 385: 1 },
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
Object.assign(meter.currentResume1816.D320, { fineDetailSupplement: supplement, imagesAuthorized: 3 });
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected, prepared, supplement, verified }));
