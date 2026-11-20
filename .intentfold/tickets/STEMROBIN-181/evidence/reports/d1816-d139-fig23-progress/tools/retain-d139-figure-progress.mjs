import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d139-n17-fig23-author`;
const V = `${T}/tmp/d1816-d139-n17-fig23-review`;
const O = `${T}/evidence/reports/d1816-d139-fig23-progress`;
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
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
assert(!fs.existsSync(`${V}/parent-collected.json`));
assert(!fs.existsSync(O));
const freeze = bind(`${V}/review-freeze.json`);
assert.equal(freeze.sha256, '230c0f11f0eaaff47a8ab2c703fe076a1a7c2af96536d63c0e624cf61d046652');
visit(read(freeze.path));
const reportBinding = bind(`${V}/report.json`);
assert.equal(reportBinding.sha256, '9a89badb24879834007353f273d053ef410ed2c2b1b6a6f68bce0e2a4d016d94');
const report = read(reportBinding.path);
assert.equal(report.semanticVerdict, 'pass');
assert.equal(report.offlineVisualVerdict, 'pass');
assert.equal(report.independent, true);
assert.equal(report.reviewerIsAuthor, false);
assert(report.actualImageOpens <= 8);
assert.equal(report.nativeReviewAt1Created, false);
assert.equal(report.durablePromotion, false);
const collected = `${V}/parent-collected.json`;
save(collected, { batch: 'D139', status: 'CURRENT_FIG23_INDEPENDENT_PASS_COLLECTED_CLOSED',
  reviewer: '01a1f8a3-bd45-74e0-933f-cc739eb79a87', reviewerClosed: true,
  freeze, report: reportBinding, verifiedBindings: [...verified.values()],
  actualImages: report.actualImageOpens, semanticVerdict: 'pass', offlineVisualVerdict: 'pass',
  remainingHolds: report.remainingHolds, sourceUncertainty: report.sourceUncertainty,
  canonicalPromotion: false, nativeReviewAt1Created: false, wholeCourseApproved: false,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidCalls: 0, parentImageOpens: 0 });
const retained = [];
for (const [stage, dir] of [['author', A], ['review', V]]) {
  for (const from of walk(dir)) {
    const to = `${O}/${stage}/${path.relative(dir, from)}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(from).sha256, bind(to).sha256, to);
    retained.push({ ...bind(to), originalPath: from });
  }
}
for (const name of ['prepare-d139-n17-fig23.mjs', 'collect-d139-author.mjs', 'retain-d139-figure-progress.mjs']) {
  const from = `${T}/tmp/d1816-recovery/${name}`;
  const to = `${O}/tools/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
}
const disposition = `${O}/retained-progress.json`;
save(disposition, { batch: 'D139', status: 'CURRENT_FIG23_INDEPENDENT_PASS_RETAINED_NO_COURSE_PROMOTION',
  lesson: 'phy9-c1-s2-n17', figure: 'fig-23', retained,
  authorFreeze: bind(`${O}/author/author-freeze.json`), reviewFreeze: bind(`${O}/review/review-freeze.json`),
  remainingHolds: report.remainingHolds, sourceUncertainty: report.sourceUncertainty,
  authorImages: 4, reviewerImages: report.actualImageOpens, parentImages: 0,
  geometryPixelIdentityClaim: false, opacityOnlyDifferencesAcknowledged: 14,
  oldFailureUsageReset: false, nativeStagesReplayed: 0, sourceScienceReviewReplayed: false,
  nativeReviewAt1Created: false, canonicalPromotion: false, wholeCourseApproved: false,
  completeCoursesAdded: 0, sourcePagesAdded: 0, paidCalls: 0, productAcceptance: false,
  databaseWrites: false, formalHandoff: false });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 136);
Object.assign(meter.currentResume1816.D139, {
  status: 'CURRENT_FIG23_INDEPENDENT_PASS_RETAINED_N17_WHOLE_COURSE_HOLD',
  reviewer: '01a1f8a3-bd45-74e0-933f-cc739eb79a87', reviewerClosed: true,
  reviewFreeze: bind(`${O}/review/review-freeze.json`), review: bind(`${O}/review/report.json`),
  collected: bind(`${O}/review/parent-collected.json`), retained: bind(disposition),
  actualReviewerImages: report.actualImageOpens, independentApproval: true,
  wholeCourseApproval: false, canonicalPromotions: 0, completeCoursesAdded: 0,
  remainingHolds: report.remainingHolds,
});
Object.assign(meter.currentResume1816.D140, {
  status: 'FIRST_N8_INDEPENDENT_SCI_ZHEN_REVIEW_ACTIVE',
  reviewer: '01a1f8ab-5ea8-74c2-9dcb-e1340deb2e27', reviewerImagesAuthorized: 0,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D139' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ retained: bind(disposition), verifiedBindings: verified.size,
  retainedFiles: walk(O).length, independentFigurePass: true, completeCoursesAdded: 0,
  completeDelivered: 136, imagesOpened: 0, staged: false }));
