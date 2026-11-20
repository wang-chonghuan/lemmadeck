import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d331-source389-391-author`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
let verified = 0;
const verify = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    assert.equal(bind(value.path).sha256, value.sha256, value.path);
    verified++;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(verify);
    else if (child && typeof child === 'object') verify(child);
  }
};
const report = bind(`${O}/report.json`);
const freeze = bind(`${O}/author-freeze.json`);
assert.equal(report.sha256, 'e7ed6444aba624f8175a0a066afc88f6d1e94e8b333fc76c7bce64273c6ec320');
assert.equal(freeze.sha256, '7cd1ccb14e7a497e08cf52fd9892af3b1777497e7ceca3b1ba56ecc3d32ce2ac');
verify(read(freeze.path));
const collected = `${O}/parent-collected.json`;
fs.writeFileSync(collected, JSON.stringify({
  stage: 'D331', report, authorFreeze: freeze, authorClosed: true, verifiedBindings: verified,
  actualImageOpens: 6, sourceRows: [26, 26, 26], sourceApproval: false,
  originalTasks: 0, originalFigures: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = read(file);
Object.assign(meter.currentResume1816.D331, {
  status: 'FIRST_SOURCE389_391_AUTHOR_FROZEN_COLLECTED_CLOSED',
  root: '.tmp/STEMROBIN-181/d1816-d331/root',
  work: '.tmp/STEMROBIN-181/d1816-d331/source-work',
  report, authorFreeze: freeze, parentCollected: bind(collected),
  authorClosed: true, agentClosed: true, actualImageOpens: 6,
});
meter.currentResume1816.D334 = {
  status: 'FINITE_SOURCE384_TYPOGRAPHY_SUPPLEMENT_ACTIVE',
  agent: '01a1fae8-3fd0-7432-a678-f12c29f532c0',
  outputRoot: `${T}/tmp/d1816-d334-source384-typography-supplement`,
  imagesAuthorized: 2, sourcePagesAdded: 0, completeCoursesAdded: 0, agentClosed: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ verified, collected: bind(collected) }));
