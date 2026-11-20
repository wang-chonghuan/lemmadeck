import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d140-n8-text-progress`;
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const read = file => JSON.parse(fs.readFileSync(file));
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
assert(!fs.existsSync(O));
const reviewDir = `${T}/tmp/d1816-d140-n8-text-review`;
const collected = read(`${reviewDir}/parent-collected.json`);
assert.equal(collected.reviewerClosed, true);
assert.equal(collected.scienceVerdict, 'pass');
assert.equal(collected.zhVerdict, 'pass');
assert.equal(collected.enVerdict, 'pass');
assert.equal(bind(`${reviewDir}/review-freeze.json`).sha256,
  '832d38eb6b217c5141348ef4b84a88d7c5f0fa97bd30ef811c5bcc1810a3e413');
const retained = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
};
for (const [stage, dir] of [
  ['author', `${T}/tmp/d1816-d140-n8-text-author`], ['review', reviewDir],
]) {
  for (const from of walk(dir)) copy(from, `${O}/${stage}/${path.relative(dir, from)}`);
}
for (const name of ['prepare-d140-n8.mjs', 'collect-d140-author.mjs',
  'collect-d140-text-review.mjs', 'retain-d140-text-progress.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`);
}
const disposition = `${O}/retained-progress.json`;
save(disposition, {
  batch: 'D140', status: 'FIRST_N8_SCI_ZHEN_TEXT_PASS_RETAINED_FIG05_PENDING',
  lesson: 'phy9-c1-s1-n8', retained,
  authorFreeze: bind(`${O}/author/author-freeze.json`),
  reviewFreeze: bind(`${O}/review/review-freeze.json`),
  collected: bind(`${O}/review/parent-collected.json`),
  scienceVerdict: 'pass', zhVerdict: 'pass', enVerdict: 'pass',
  independentTextApproval: true, wholeCourseApproved: false, figuresPending: ['fig-05'],
  sourceReviewsReplayed: false, authorCheckerReplayed: false, nativeStagesReplayed: 0,
  originalTasks: 0, answers: 0, choices: 0, imagesOpened: 0, paidCalls: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, sourcePagesAdded: 0,
  databaseWrites: false, publisherCalls: 0, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D140, { retainedTextProgress: bind(disposition) });
Object.assign(meter.currentResume1816.D141, {
  status: 'FIRST_SHARED_FIG05_AUTHOR_ACTIVE', author: '01a1f8b1-02d6-7773-8813-1d183d407d8a',
  authorClosed: false, authorImagesAuthorized: 8,
});
meter.currentResume1816.currentContinuation =
  '136 complete courses pushed. D139 current fig23 independent PASS retained, N17 remaining HOLDs unchanged. D140 first N8 SCI/ZH/EN text PASS collected and reviewer closed; zero original tasks. D141 first fig05 author active with bounded eight-image context. No source/author/native review replay, paid calls, DB, deploy, merge, closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D140' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ retained: bind(disposition), retainedFiles: walk(O).length,
  completeDelivered: 136, completeCoursesAdded: 0, imagesOpened: 0, staged: false }));
