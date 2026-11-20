import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d314-source380-382-review`;
const O = `${T}/tmp/d1816-d323-source380-382-affected-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d323/root';
const work = '.tmp/STEMROBIN-181/d1816-d323/source-work';
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
assert.equal(report.sha256, '43beb2566d813f0e7d14a7a010fd0d081d4ad887806b898f6b3d7e842eacb2ae');
assert.equal(freeze.sha256, 'e85a663640e8e4f8d5ad49637bc904b8e0f231ce5f5d6e176fe65474ad65b934');
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
assert.equal(review.confirmedFindings.length, 4);
const collected = save(`${V}/parent-collected.json`, {
  batch: 'D314', reviewerClosed: true, report, reviewFreeze: freeze,
  verifiedBindings: verified, actualImageOpens: 8,
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
});
const copy = (from, to, mode = 0o444) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
for (const dir of [root, work]) assert(!fs.existsSync(dir));
const originals = [380, 381, 382].map(page => {
  const number = String(page).padStart(4, '0');
  const previous = `.tmp/STEMROBIN-181/d1816-d313/root/10p/pages/${number}/page.md`;
  copy(previous, `${root}/10p/pages/${number}/page.md`, 0o644);
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`.tmp/STEMROBIN-181/d1816-d313/source-work/10p/pages/${number}/${name}`,
      `${work}/10p/pages/${number}/${name}`);
  fs.mkdirSync(`${work}/10p/pages/${number}/figures`, { recursive: true });
  return { page, before: bind(previous) };
});
const prepared = save(`${O}/prepared.json`, {
  batch: 'D323', reviewBatch: 'D324', root, work, originals,
  priorIndependentReview: report, reviewFreeze: freeze, expectedRows: [18, 25, 26],
  intendedContentEdits: review.confirmedFindings,
  bodyReplacements: [
    { page: 381, from: '反物质. $1971$ 年，在苏联首次制成了**反氢**.',
      to: '*反物质*. $1971$ 年，在苏联首次制成了**反氦**.' },
    { page: 381, from: '电子从哪里来呢？', to: '电子从哪里来的呢？' },
    { page: 382, from: '相矛盾！', to: '相矛盾的！' },
  ],
  countingBoundary: {
    page: 380, bottomMarginPx: 137, cutoffY: 2200, footerEndY: 2075,
    nontextBand: [2217, 2225], diagnostic: bind(`${T}/tmp/d1816-recovery/native/d323-source380-failure-bands-diagnosis/stdout.txt`),
    reason: 'Parent observed original-derived lower margin strip: isolated faint horizontal scan trace at y2217-2225; no printed words, formula, caption, task or footer. Footer ends before2076. Count only above2200 without changing source pixels.',
  },
  crops: [
    { kind: 'disputed-lexeme', originalBox: [740, 1745, 585, 70],
      binding: bind(`${O}/source380-disputed-lexeme.png`) },
    { kind: 'bottom-trace', originalBox: [0, 2090, 1536, 247],
      binding: bind(`${O}/source380-bottom-trace.png`) },
  ],
  unresolvedLexeme: {
    source: '各 + uncertain old/same-like enclosed glyph', currentCandidate: '各个',
    parentObservation: 'Second glyph appears enclosed with internal horizontal stroke, unlike 个. Provisional 旧-like read is not a verdict. First targeted independent pixel review still required; text unchanged until settled.',
  },
  actualParentImageOpens: 2, cumulativeParentImageOpens: 23,
  contentRepairsByPage: { 380: 0, 381: 1, 382: 1 },
  sourceApproval: false, completeCoursesAdded: 0,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D314, {
  status: 'FIRST_SOURCE_REVIEW_COLLECTED_CLOSED_FOUR_DEFECTS_AND_HOLDS',
  report, reviewFreeze: freeze, parentCollected: collected, reviewerClosed: true,
  actualImageOpens: 8, sourceRows: [18, 25, 26], sourceApproval: false,
});
meter.currentResume1816.D323 = {
  status: 'AFFECTED_SOURCE381_382_AND_SOURCE380_COUNTING_RECOVERY_PREPARED',
  prepared, root, work, actualParentImageOpens: 2,
  contentRepairsByPage: { 380: 0, 381: 1, 382: 1 },
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected, prepared, verified, parentImageOpens: 23 }));
