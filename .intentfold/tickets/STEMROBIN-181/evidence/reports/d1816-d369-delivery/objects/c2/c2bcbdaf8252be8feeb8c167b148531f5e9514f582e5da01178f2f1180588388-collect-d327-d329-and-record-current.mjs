import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const T = '.intentfold/tickets/STEMROBIN-181';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
let verified = 0;
const verify = (value, base) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
    const file = fs.existsSync(value.path) ? value.path : path.join(base, value.path);
    assert.equal(bind(file).sha256, value.sha256, value.path);
    verified++;
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(item => verify(item, base));
    else if (child && typeof child === 'object') verify(child, base);
  }
};
const file = `${T}/production-meter.json`;
const meter = read(file);
for (const [stage, directory, reportHash, freezeHash, images] of [
  ['D327', 'd1816-d327-source386-388-review',
    '9443f3bf794d56451e44089b19e3114ee8edd8971e008678fab80ccf58584e21',
    '083fd043ffbc7344bf1013eedaf4e50662ca1e0117492a0d228e53747e4867df', 8],
  ['D329', 'd1816-d329-source380-sole-text-review',
    'e03afcbac506ff3054de97fcf88b43a1c75f1317c0d961653962a871c0ef856c',
    'd122b633b09b79fbc0470fa6284bbf1d67fd8392a4b9a360e0958a7338ac8f1c', 0],
]) {
  const O = `${T}/tmp/${directory}`;
  const report = bind(`${O}/report.json`);
  const freeze = bind(`${O}/review-freeze.json`);
  assert.equal(report.sha256, reportHash);
  assert.equal(freeze.sha256, freezeHash);
  verify(read(freeze.path), O);
  const collected = `${O}/parent-collected.json`;
  fs.writeFileSync(collected, JSON.stringify({
    stage, report, reviewFreeze: freeze, verifiedBindings: verified,
    reviewerClosed: true, actualImageOpens: images,
    affectedVerdict: stage === 'D329' ? 'PASS_SOLE_WORD_REPAIR' : 'SOURCE_TEXT_NO_CONFIRMED_DEFECTS_WITH_TABLE_AND_PUNCTUATION_HOLDS',
    sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
  }, null, 2) + '\n', { flag: 'wx' });
  Object.assign(meter.currentResume1816[stage], {
    status: stage === 'D329' ? 'SOLE_SOURCE380_WORD_REPAIR_PASS_COLLECTED_CLOSED'
      : 'SOURCE386_388_TEXT_ROW_PASS_WITH_TABLE_PUNCTUATION_HOLDS_COLLECTED_CLOSED',
    report, reviewFreeze: freeze, parentCollected: bind(collected),
    reviewerClosed: true, actualImageOpens: images, sourceApproval: false,
  });
}
for (const [stage, agent, output, images, scope] of [
  ['D331', '01a1fae3-59f9-7c10-8f97-d9e13c7d26b5', 'd1816-d331-source389-391-author', 8, 'FIRST_SOURCE389_391_AUTHOR'],
  ['D332', '01a1fae6-62ff-7f71-8e48-f932fe2cc9c7', 'd1816-d332-n149-first-text-review', 0, 'FIRST_N149_BILINGUAL_SCI_TEXT_REVIEW'],
  ['D333', '01a1fae6-b6c9-7892-b2e5-48f378eebdd4', 'd1816-d333-fig277-first-author', 8, 'FIRST_MODERN_FIG277_DETERMINISTIC_AUTHOR'],
]) meter.currentResume1816[stage] = {
  status: `${scope}_ACTIVE`, agent, outputRoot: `${T}/tmp/${output}`,
  imagesAuthorized: images, agentClosed: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.currentResume1816.D330.authorFreeze =
  bind(`${T}/tmp/d1816-d330-n149-first-preparation/author-freeze.json`);
meter.currentResume1816.currentContinuation = '142 complete offline courses pushed. D320 RAW277 crop/SVG PASS, D326 seven fixes PASS with audit event differences recorded, D329 sole SOURCE380 repair PASS, D327 SOURCE386-388 row/text inventory no confirmed defect but table exponent/punctuation HOLD; all four collected/closed. D330 N149-only bilingual author frozen; D332 independent text/science and D333 deterministic FIG277 author active, D331 SOURCE389-391 author active. Parent images23/24. No source/course increments, paid generation, DB/publisher/deploy/merge/closure/full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ verified, completeDeliveredCards: meter.currentCheckpoint.completeDeliveredCards }));
