import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d149-n9-figures-author`;
const O = `${T}/evidence/reports/d1816-d149-n9-figures67-hold`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${dir}/${row.name}`) : [`${dir}/${row.name}`]);
assert(!fs.existsSync(O));
const report = bind(`${A}/report.json`);
const freeze = bind(`${A}/author-freeze.json`);
assert.equal(report.sha256, 'b7e80122c0a1f64dea51430d727adabfd3c6ad1c3e9b9406ef93fb52923057aa');
assert.equal(freeze.sha256, 'b80d6f13d5ef1889da0f6e14e9ab3c29f8e1e7158aefc1d0929a74e6a7251a36');
const authorReport = read(report.path);
assert.equal(authorReport.status, 'AUTHOR_HOLD_REPAIR_LIMIT_NOT_READY_FOR_INDEPENDENT_REVIEW');
assert.equal(authorReport.authorReadyForIndependentReview, false);
assert.equal(authorReport.actualImageOpens, 5);
assert.deepEqual(authorReport.contentRepairsPerFigure, { 'fig-06': 1, 'fig-07': 1 });
const holds = Object.entries(authorReport.figures).map(([figure, row]) => ({
  figure, status: row.status, selectedTerminalCandidate: row.selectedCandidate,
  nativeValidationStatus: row.validation.status, nativeRenderStatus: row.renderStatus,
  findings: row.findings, contentRepairs: row.contentRepairs,
  independentApproval: false,
}));
const collected = `${A}/parent-collected.json`;
save(collected, {
  batch: 'D149', status: 'AUTHOR_REPAIR_LIMIT_HOLDS_COLLECTED_CLOSED',
  author: '01a1f8d8-8c68-7a52-90a1-0a001ef161c9', authorClosed: true,
  report, freeze, verifiedCurrentBindingsBeforeClosure: 96,
  returnedHashesOmittedByAuthor: true, actualHashesComputedByParentFromSavedBytes: true,
  holds, actualImageOpens: 5, parentImageOpens: 0,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  sourceInventoryErratumPreserved: authorReport.sourceInventoryErratum,
  originalFailuresPreserved: true, independentApproval: false,
  additionalRepairsAuthorized: false, canonicalPromotions: 0, completeCoursesAdded: 0,
  paidCalls: 0, productAcceptance: false, formalHandoff: false,
});
const retained = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
};
for (const from of walk(A)) copy(from, `${O}/author/${path.relative(A, from)}`);
const candidates = '.tmp/STEMROBIN-181/d1816-d149/figures';
for (const from of walk(candidates)) copy(from, `${O}/candidates/${path.relative(candidates, from)}`);
for (const name of ['prepare-d149-n9-figures.mjs', 'prepare-d150-n9-source-input.mjs',
  'record-d149-d151-authors-active.mjs', 'retain-d149-author-holds.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`);
}
const disposition = `${O}/retained-progress.json`;
save(disposition, {
  batch: 'D149', status: 'N9_FIG06_FIG07_REPAIR_LIMIT_HOLDS_RETAINED_NOT_REVIEW_READY',
  lesson: 'phy9-c1-s1-n9', retained,
  collected: bind(`${O}/author/parent-collected.json`),
  terminalCandidatesRetainedNotPromoted: true, firstFailuresAndSourceInventoryErratumPreserved: true,
  actualImageOpens: 5, parentImageOpens: 0,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  independentApproval: false, completeCoursesAdded: 0, canonicalPromotions: 0,
  additionalRepairsAuthorized: false, passedStagesReplayed: false,
  paidCalls: 0, databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D149, {
  status: 'N9_FIG06_FIG07_REPAIR_LIMIT_HOLDS_RETAINED_AUTHOR_CLOSED',
  authorClosed: true, authorReportPending: false, report, freeze,
  collected: bind(collected), retained: bind(disposition), actualImageOpens: 5,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  independentApproval: false, additionalRepairsAuthorized: false,
});
Object.assign(meter.currentResume1816.D150, {
  status: 'NOT_DISPATCHED_AUTHOR_CANDIDATES_HELD_AT_REPAIR_LIMIT',
  reviewer: null, independentApproval: false,
});
Object.assign(meter.currentResume1816.D154, {
  status: 'FIRST_AFFECTED_SOURCE_COUNT_ADJUDICATION_ACTIVE',
  reviewer: '01a1f8ed-856b-74b2-a9c5-79f0d45bf178', reviewerClosed: false,
});
meter.currentResume1816.currentContinuation =
  '137 complete offline courses pushed;561 SOURCE pages and136 book-answer records unchanged. D144 N8 delivered at5e5712dece2cd02da131823d49b0b882bef60b5a. N9 composed SCI/ZH/EN text PASS retained,original34 observations and3 source limits preserved. D149 fig06/07 terminal candidates retained with wall-contact/label-clearance HOLDs,one repair each exhausted,author closed;D150 not dispatched. D151 fig08/09 source-count HOLD retained author closed;D152 no higher PDF resolution. D154 sole first affected source-count reviewer active;D153 fig11/12 author active. All10 N9 figures still unapproved;portrait generation unauthorized. All earlier HOLDs/source187/307 untouched. Continue authorized missing stages and small batches,no extra repairs beyond cap,parent images,paid calls,DB,deploy,merge,closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file));
  index.reports.push({ ...bind(file), batch: 'D149' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), retained: bind(disposition),
  retainedFiles: walk(O).length, imagesOpened: 0, independentApproval: false }));
