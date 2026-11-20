import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d310-10p-source380-382-author`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const report = bind(`${O}/report.json`);
const freeze = bind(`${O}/author-freeze.json`);
assert.equal(report.sha256, '4553674c7c012906afc48a4c47e4d0575dd495f4bac97299a4530913e1ebe3db');
assert.equal(freeze.sha256, '285680e466747f1e9ca0511bfc7db62622216b096f09350ebf2a83f7a69b88e0');
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
const frozen = read(freeze.path);
verify(frozen);
for (const page of frozen.pages) {
  assert.equal(bind(page.rootDraft).sha256, page.sha256);
  assert.equal(bind(page.snapshot).sha256, page.sha256);
  verified += 2;
}
const authored = read(report.path);
assert.deepEqual(authored.pages.map(row => row.rowsIncludingPageFoot), [18, 25, 26]);
const collected = `${O}/parent-collected.json`;
fs.writeFileSync(collected, JSON.stringify({
  batch: 'D310', authorClosed: true, report, authorFreeze: freeze,
  verifiedBindings: verified, rowCounts: [18, 25, 26], actualImageOpens: 8,
  firstNativeParentPending: true, sourceApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
Object.assign(meter.currentResume1816.D310, {
  status: 'FIRST_THREE_SOURCE_DRAFTS_FROZEN_AUTHOR_CLOSED_NATIVE_PENDING',
  authorClosed: true, report, authorFreeze: freeze, parentCollected: bind(collected),
  sourceRows: [18, 25, 26], actualImageOpens: 8, sourceApproval: false,
  sourcePagesAdded: 0, completeCoursesAdded: 0,
});
meter.currentResume1816.currentContinuation =
  '142 complete offline courses pushed. D308 and D310 first authors frozen and closed; D311 first SOURCE376 row mismatch preserved; D312 first source review active. D315 parent source383-385 author active after first383 image, parent opens17. D309 FIG33 scoped first PASS reused; FIG32/integration/full display HOLD unchanged. No new source/course counts, paid calls, DB/publisher/deploy/merge/closure/full checks or handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), verified,
  completeDelivered: 142, sourceApproval: false }));
