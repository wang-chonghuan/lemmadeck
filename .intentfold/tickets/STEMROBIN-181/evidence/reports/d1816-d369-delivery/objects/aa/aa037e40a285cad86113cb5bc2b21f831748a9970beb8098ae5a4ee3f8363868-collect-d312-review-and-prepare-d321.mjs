import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d312-source376-379-review`;
const O = `${T}/tmp/d1816-d321-source376-379-affected-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d321/root';
const work = '.tmp/STEMROBIN-181/d1816-d321/source-work';
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
assert.equal(report.sha256, 'de8ffca5756a4fe54d737c188ccab177b28321f673d2e533eb8522d2f88494ce');
assert.equal(freeze.sha256, '3a6798d210b617a4feba3c40b839497637159fe2644a201f4ef7eaf0bf65836e');
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
assert.equal(review.firstNativeCountingFailure.classification, 'COUNTER_ARTIFACT_NOT_MISSING_OR_EXTRA_PRINTED_ROW');
assert.equal(review.exactFindings.length, 5);
const collected = save(`${V}/parent-collected.json`, {
  batch: 'D312', reviewerClosed: true, report, reviewFreeze: freeze,
  verifiedBindings: verified, actualImageOpens: 8, parentImageOpens: 0,
  passedSourcePagesReused: [377, 378], affectedPages: [376, 379],
  aggregateSourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
});
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
const originals = [];
const copy = (from, to, mode) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
for (const page of [376, 377, 378, 379]) {
  const number = String(page).padStart(4, '0');
  const from = `.tmp/STEMROBIN-181/d1816-d311/root/10p/pages/${number}/page.md`;
  originals.push({ page, before: bind(from) });
  copy(from, `${root}/10p/pages/${number}/page.md`, 0o644);
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`.tmp/STEMROBIN-181/d1816-d311/source-work/10p/pages/${number}/${name}`,
      `${work}/10p/pages/${number}/${name}`, 0o444);
  fs.mkdirSync(`${work}/10p/pages/${number}/figures`, { recursive: true });
}
const prepared = save(`${O}/prepared.json`, {
  batch: 'D321', root, work, report, reviewFreeze: freeze, originals,
  intendedContentEdits: review.exactFindings,
  countingBoundary: {
    page: 376, bottomMarginPx: 137, cutoffY: 2200,
    reason: review.firstNativeCountingFailure.sourcePixelReason,
    footerBand: [2049, 2076], nontextBand: [2220, 2223],
  },
  firstFailureRetained: true, affectedContentRepairs: 1,
  passedPagesUnchanged: [377, 378], parentImageOpens: 0,
  sourceApproval: false, completeCoursesAdded: 0,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D312, {
  status: 'FIRST_REVIEW_COLLECTED_CLOSED_SOURCE376_379_FAIL_SOURCE377_378_PASS',
  report, reviewFreeze: freeze, parentCollected: collected, reviewerClosed: true,
  actualImageOpens: 8, sourceRows: [21, 25, 25, 25],
  aggregateSourceApproval: false,
});
meter.currentResume1816.D321 = {
  status: 'SOLE_SOURCE376_379_AFFECTED_RECOVERY_PREPARED',
  prepared, root, work, contentRepairsConsumed: 1, remainingContentRepairs: 0,
  parentImageOpens: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D318.author = '01a1face-462d-7101-96c2-29758390fa5f';
meter.currentResume1816.D318.status = 'FIRST_SOURCE386_388_BOUNDED_AUTHOR_ACTIVE';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected, prepared, verified, completeDelivered: 142 }));
