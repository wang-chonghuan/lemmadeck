import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d142-n9-text-author`;
const O = `${T}/evidence/reports/d1816-d142-n9-author-progress`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
assert(!fs.existsSync(O));
const collected = read(`${A}/parent-collected.json`);
assert.equal(collected.authorClosed, true);
assert.equal(collected.independentApproval, false);
assert.equal(collected.verifiedCurrentBindings, 90);
const retained = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
};
for (const from of walk(A)) copy(from, `${O}/author/${path.relative(A, from)}`);
for (const name of ['prepare-d142-n9.mjs', 'record-d142-author-active.mjs',
  'collect-d142-prepare-d145.mjs', 'retain-d142-author-progress.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`);
}
const disposition = `${O}/retained-progress.json`;
fs.writeFileSync(disposition, JSON.stringify({
  batch: 'D142', status: 'FIRST_N9_BILINGUAL_AUTHOR_PROGRESS_RETAINED_NOT_INDEPENDENT_APPROVAL',
  lesson: 'phy9-c1-s1-n9', retained,
  authorFreeze: bind(`${O}/author/author-freeze.json`),
  collected: bind(`${O}/author/parent-collected.json`),
  historicalDigestClassification: bind(`${O}/author/parent-historical-digest-classification.json`),
  sourceBlocksPerLocale: 35, originalTasks: 0, answers: 0, choices: 0,
  independentApproval: false, wholeCourseApproved: false,
  figuresPending: collected.figuresPending, holds: collected.holds,
  imagesOpened: 0, paidCalls: 0, sourceReviewsReplayed: false,
  authorCheckerReplayed: false, nativeStagesReplayed: 0,
  completeCoursesAdded: 0, sourcePagesAdded: 0, canonicalPromotions: 0,
  productAcceptance: false, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D142, { retainedAuthorProgress: bind(disposition) });
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D142' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ retained: bind(disposition), retainedFiles: walk(O).length,
  imagesOpened: 0, independentApproval: false, completeCoursesAdded: 0, staged: false }));
