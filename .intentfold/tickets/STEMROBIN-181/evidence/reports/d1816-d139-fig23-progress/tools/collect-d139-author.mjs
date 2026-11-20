import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d139-n17-fig23-author`;
const V = `${T}/tmp/d1816-d139-n17-fig23-review`;
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
assert.equal(freeze.sha256, '2c53a21a30d2e14d901c9dadef90c09d720c812a7a7794b9a5c7769f13939eb4');
const frozen = read(freeze.path);
visit(frozen);
const report = read(frozen.report.path);
assert.equal(report.notIndependentApproval, true);
assert.equal(report.native.status, 'pass');
assert.equal(report.render.status, 'pass');
assert.deepEqual(report.render.collisions, []);
assert(report.usage.thisBatch.imageOpens <= 8);
assert.equal(report.canonicalPromotion, false);
const collected = `${A}/parent-collected.json`;
save(collected, { batch: 'D139', status: 'AUTHOR_COLLECTED_CLOSED_FIRST_FIGURE_REVIEW_PENDING',
  author: '01a1f89a-eac8-7151-b1d6-b0b83da6fa2c', authorClosed: true,
  freeze, report: frozen.report, verifiedBindings: [...verified.values()],
  actualImages: report.usage.thisBatch.imageOpens, nativeAndRenderAuthorPass: true,
  independentApproval: false, wholeCourseApproved: false, canonicalPromotion: false,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidCalls: 0, parentImageOpens: 0 });
assert(!fs.existsSync(V));
fs.mkdirSync(V, { recursive: true });
const input = `${V}/input-freeze.json`;
save(input, { batch: 'D139', ticket: 'STEMROBIN-181', book: '9p', lesson: 'phy9-c1-s2-n17',
  figure: 'fig-23', role: 'FIRST_INDEPENDENT_SOURCE_FIRST_CURRENT_FIGURE_REVIEW',
  originalSource: frozen.externalImmutableInputs.originalSource,
  currentSpec: frozen.currentSpec, currentSvg: frozen.currentSvg, currentRender: frozen.currentRender,
  previews: ['fig-23.full.png', 'fig-23.w640.png', 'fig-23.w331.png'].map(name => frozen.artifacts[name]),
  authorFreeze: freeze, authorReport: frozen.report, authorCollected: bind(collected),
  originalCandidate: frozen.externalImmutableInputs.oldCandidate,
  originalFailure: frozen.externalImmutableInputs.originalFailure,
  authoritativeText: read(`${A}/input-freeze.json`).authoritativeText,
  inheritedProseReview: frozen.externalImmutableInputs.inheritedProseReview,
  sourcePointBindings: frozen.artifacts['source-point-bindings.json'],
  geometryComparison: frozen.artifacts['source-geometry-comparison.json'],
  alphaOnlyDeltaDiagnostic: frozen.artifacts['mobile-geometry-diagnostic.json'],
  originalSourceBeforeAnyCandidateRequired: true,
  imageBudget: { batch: 8, context: 24, parent: 0 }, nativeStagesNotReplayed: true,
  noCourseApprovalOrPromotion: true, productAcceptance: false, paidCalls: 0 });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D139, {
  status: 'AUTHOR_COLLECTED_CLOSED_FIRST_INDEPENDENT_FIGURE_REVIEW_PENDING',
  authorClosed: true, authorFreeze: freeze, authorCollected: bind(collected),
  actualAuthorImages: report.usage.thisBatch.imageOpens, reviewInput: bind(input),
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), reviewInput: bind(input),
  verifiedBindings: verified.size, imagesOpened: 0, completeCoursesAdded: 0 }));
