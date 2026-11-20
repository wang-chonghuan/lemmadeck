import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d140-n8-text-author`;
const V = `${T}/tmp/d1816-d140-n8-text-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verified = new Map();
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    const key = path.resolve(value.path);
    const actual = verified.get(key) || bind(value.path);
    assert.equal(actual.sha256, value.sha256, value.path);
    verified.set(key, actual);
  }
  for (const child of Object.values(value)) visit(child);
}
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(`${A}/parent-collected.json`));
const freeze = bind(`${A}/author-freeze.json`);
assert.equal(freeze.sha256, '4ba5d71bb1db1655870673716d3e22bc7d5692fb5679ae4a655d3345a61dda15');
const frozen = read(freeze.path);
visit(frozen);
visit(read(frozen.prepared.path));
assert.equal(frozen.independentApproval, false);
assert.equal(frozen.originalTasks, 0);
assert.equal(frozen.imageOpens, 0);
assert.equal(frozen.templates.length, 6);
assert.deepEqual(frozen.textBlockers, []);
for (const row of frozen.templates) {
  const actual = bind(row.frozenCopy);
  assert.equal(actual.sha256, row.sha256, row.frozenCopy);
  verified.set(path.resolve(row.frozenCopy), actual);
}
const collected = `${A}/parent-collected.json`;
save(collected, { batch: 'D140', status: 'AUTHOR_COLLECTED_CLOSED_FIRST_SCI_ZHEN_REVIEW_PENDING',
  author: '01a1f89e-3f63-7f63-854c-a155eeed787a', authorClosed: true,
  freeze, report: frozen.report, verifiedBindings: [...verified.values()],
  independentApproval: false, originalTasks: 0, figuresPending: ['fig-05'],
  completeCoursesAdded: 0, sourcePagesAdded: 0, canonicalPromotion: false,
  parentImageOpens: 0, paidCalls: 0, passedStagesReplayed: 0 });
assert(!fs.existsSync(V));
fs.mkdirSync(V, { recursive: true });
const input = `${V}/input-freeze.json`;
save(input, { batch: 'D140', ticket: 'STEMROBIN-181', book: '9p', lesson: 'phy9-c1-s1-n8',
  role: 'FIRST_INDEPENDENT_BILINGUAL_SCIENCE_AND_LANGUAGE_TEXT_REVIEW',
  nativeSourceFiles: frozen.sourceFiles,
  templates: frozen.templates.map(row => ({ edition: row.edition, file: row.file, ...bind(row.frozenCopy) })),
  authorFreeze: freeze, authorReport: frozen.report, authorCollected: bind(collected),
  sourceFidelityReused: true, imagesAuthorized: 0, originalTasks: 0,
  pendingFiguresNotReviewed: ['fig-05'], formulaOrderCheckNotReplayed: true,
  noNativeFinalizeRenderOrPromotion: true, productAcceptance: false, paidCalls: 0 });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D140, {
  status: 'AUTHOR_COLLECTED_CLOSED_FIRST_INDEPENDENT_SCI_ZHEN_REVIEW_QUEUED',
  authorClosed: true, authorFreeze: freeze, authorCollected: bind(collected),
  actualAuthorImages: 0, reviewInput: bind(input),
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), reviewInput: bind(input),
  verifiedBindings: verified.size, imagesOpened: 0, completeCoursesAdded: 0 }));
