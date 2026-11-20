import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const cfg = {
  D318: {
    output: 'd1816-d318-10p-source386-388-author', kind: 'author',
    reportHash: '9db888a28a31d246ff12e6cb8a246cfbf9373d9ea3fdb4c576f4b678251e4f9a',
    freezeHash: 'baa6d4ba54e63f6b0bfc60fdb64ec522b1e5060533b92b7c2b5578bce7a17920',
  },
  D322: {
    output: 'd1816-d322-source376-379-affected-review', kind: 'review',
    reportHash: 'b7c0a3bef1aa6569df15b87b863858be197cc40f7c34dfb374a3dacbdaf9c58e',
    freezeHash: '47da0c2d4925550a1e9d879ff242fe02256fc94bd66c2f1f6adba4f99e038e30',
  },
}[process.argv[2]];
assert(cfg);
const stage = process.argv[2];
const O = `${T}/tmp/${cfg.output}`;
const report = bind(`${O}/report.json`);
const freeze = bind(`${O}/${cfg.kind}-freeze.json`);
assert.equal(report.sha256, cfg.reportHash);
assert.equal(freeze.sha256, cfg.freezeHash);
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
if (stage === 'D318') {
  verify(read(`${O}/draft-freeze.json`));
  for (const page of read(freeze.path).pages) {
    assert.equal(bind(page.working_path).sha256, page.sha256);
    assert.equal(bind(page.snapshot_path).sha256, page.sha256);
    assert.equal(bind(page.inventory_path).sha256, page.inventory_sha256);
    verified += 3;
  }
}
const collected = `${O}/parent-collected.json`;
fs.writeFileSync(collected, JSON.stringify({
  batch: stage, report, freeze, verifiedBindings: verified,
  [`${cfg.kind === 'author' ? 'author' : 'reviewer'}Closed`]: true,
  actualImageOpens: stage === 'D318' ? 8 : 0,
  affectedReviewPass: stage === 'D322', sourceApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
Object.assign(meter.currentResume1816[stage], {
  status: stage === 'D318' ? 'FIRST_SOURCE386_388_AUTHOR_FROZEN_CLOSED_NATIVE_PENDING'
    : 'FIVE_SOURCE_EDITS_AND_COUNTING_PASS_COLLECTED_CLOSED_OTHER_HOLDS_UNCHANGED',
  report, [cfg.kind === 'author' ? 'authorFreeze' : 'reviewFreeze']: freeze,
  parentCollected: bind(collected),
  [cfg.kind === 'author' ? 'authorClosed' : 'reviewerClosed']: true,
  actualImageOpens: stage === 'D318' ? 8 : 0, sourceApproval: false,
});
if (stage === 'D318') Object.assign(meter.currentResume1816.D318, {
  sourceRows: [25, 2, 21], originalTasks: 5, originalTable: '基本粒子表',
});
Object.assign(meter.currentResume1816.D326, {
  status: 'ZERO_IMAGE_SEVEN_FINDING_AFFECTED_REVIEW_ACTIVE',
  reviewer: '01a1fad9-d37a-7ca3-a072-bf6b59197aa4',
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ stage, collected: bind(collected), verified }));
