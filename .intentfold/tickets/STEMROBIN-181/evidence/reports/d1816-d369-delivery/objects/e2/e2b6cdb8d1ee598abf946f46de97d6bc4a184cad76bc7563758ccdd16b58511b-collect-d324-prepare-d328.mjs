import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d324-source380-382-affected-review`;
const O = `${T}/tmp/d1816-d328-source380-sole-text-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d328/root';
const work = '.tmp/STEMROBIN-181/d1816-d328/source-work';
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
assert.equal(report.sha256, '9c2a62867237acfac4b9acbaeab0f4798fe74ea3934226c25ee88211f120bb35');
assert.equal(freeze.sha256, 'da06f653ba14fc1b13c9e4d11cdecb4f2f95da81633a39188124d022099247cc');
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
assert.equal(review.newConfirmedFinding.id, 'D324-F1');
const collected = save(`${V}/parent-collected.json`, {
  batch: 'D324', reviewerClosed: true, report, reviewFreeze: freeze,
  verifiedBindings: verified, actualImageOpens: 2,
  priorFourFindingsAndCountingPassed: true, source380LexemeFailureRetained: true,
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
});
const copy = (from, to, mode = 0o444) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
const before = bind('.tmp/STEMROBIN-181/d1816-d323/root/10p/pages/0380/page.md');
copy(before.path, `${root}/10p/pages/0380/page.md`, 0o644);
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
  copy(`.tmp/STEMROBIN-181/d1816-d323/source-work/10p/pages/0380/${name}`,
    `${work}/10p/pages/0380/${name}`);
for (const id of ['fig-275', 'fig-276'])
  for (const extension of ['png', 'svg'])
    copy(`.tmp/STEMROBIN-181/d1816-d323/source-work/10p/pages/0380/figures/${id}.${extension}`,
      `${work}/10p/pages/0380/figures/${id}.${extension}`, extension === 'png' ? 0o644 : 0o444);
const prepared = save(`${O}/prepared.json`, {
  batch: 'D328', reviewBatch: 'D329', root, work,
  originals: [{ page: 380, before }], priorIndependentReview: report,
  reviewFreeze: freeze, expectedRows: [18],
  intendedContentEdits: [review.newConfirmedFinding],
  bodyReplacements: [{ page: 380, from: '简单的各个粒子的组成部分', to: '简单的各旧粒子的组成部分' }],
  countingBoundary: null, crops: [], actualParentImageOpens: 0,
  contentRepairsByPage: { 380: 1 },
  reusedVectorization: bind(`${T}/tmp/d1816-recovery/native/d323-source380-first-vectorize/receipt.json`),
  sourceApproval: false, completeCoursesAdded: 0,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D324, {
  status: 'FOUR_FIXES_COUNTING_PASS_CLOSED_NEW_SOURCE380_各旧_FAIL_RETAINED',
  report, reviewFreeze: freeze, parentCollected: collected, reviewerClosed: true,
  actualImageOpens: 2, sourceApproval: false,
});
meter.currentResume1816.D328 = {
  status: 'SOLE_SOURCE380_WORD_REPAIR_PREPARED_NATIVE_PENDING',
  prepared, root, work, contentRepairsByPage: { 380: 1 },
  sourcePagesAdded: 0, completeCoursesAdded: 0,
};
Object.assign(meter.currentResume1816.D327, {
  status: 'FIRST_INDEPENDENT_SOURCE386_388_REVIEW_ACTIVE',
  reviewer: '01a1fadb-eaa5-7fe0-919a-6fb43afa33d4',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected, prepared, verified }));
