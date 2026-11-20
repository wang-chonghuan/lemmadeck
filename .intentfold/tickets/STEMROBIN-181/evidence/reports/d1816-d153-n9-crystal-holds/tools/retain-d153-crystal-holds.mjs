import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d153-n9-crystal-figures-author`;
const O = `${T}/evidence/reports/d1816-d153-n9-crystal-holds`;
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
assert.equal(report.sha256, '507c94bfb6865621882ea43964cc38a2854f070a35f757b19c66b15acca6c88b');
assert.equal(freeze.sha256, '55ed7f9a2e3c7d0949a399169ccaed48a09267719aa37855070143e87fd066d3');
const authorReport = read(report.path);
assert.equal(authorReport.status, 'HOLD');
assert.equal(authorReport.actualImageOpens, 4);
assert.deepEqual(authorReport.contentRepairsPerFigure, { 'fig-11': 0, 'fig-12': 0 });
const collected = `${A}/parent-collected.json`;
save(collected, {
  batch: 'D153', status: 'FIRST_CRYSTAL_AUTHOR_HOLDS_COLLECTED_CLOSED',
  author: '01a1f8e8-bcb9-7c51-adbd-5dbdef392eb4', authorClosed: true,
  report, freeze, verifiedCurrentBindingsBeforeClosure: 35,
  uniqueBoundFilesReportedByAuthor: 33, returnedHashesOmittedByAuthor: true,
  actualHashesComputedByParentFromSavedBytes: true,
  figures: authorReport.figures, actualImageOpens: 4,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  originalFailuresPreserved: true, independentApproval: false,
  fig11RepresentationClassificationDiagnosisPending: true,
  fig12HiddenConnectorSourceHoldUnchanged: true,
  completeCoursesAdded: 0, canonicalPromotions: 0, parentImageOpens: 0,
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
const candidates = '.tmp/STEMROBIN-181/d1816-d153/figures';
for (const from of walk(candidates)) copy(from, `${O}/candidates/${path.relative(candidates, from)}`);
copy(`${T}/tmp/d1816-recovery/retain-d153-crystal-holds.mjs`,
  `${O}/tools/retain-d153-crystal-holds.mjs`);
const disposition = `${O}/retained-progress.json`;
save(disposition, {
  batch: 'D153', status: 'N9_FIG11_CLASSIFICATION_FIG12_SOURCE_HOLDS_RETAINED',
  lesson: 'phy9-c1-s1-n9', retained,
  collected: bind(`${O}/author/parent-collected.json`),
  actualImageOpens: 4, parentImageOpens: 0,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  fig11OriginalValidationFailurePreserved: true, fig11DiagnosisPending: true,
  fig12HiddenConnectorSourceHoldUnchanged: true,
  independentApproval: false, completeCoursesAdded: 0, canonicalPromotions: 0,
  passedStagesReplayed: false, paidCalls: 0,
  productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D153, {
  status: 'FIRST_CRYSTAL_HOLDS_RETAINED_AUTHOR_CLOSED',
  authorClosed: true, authorReportPending: false, report, freeze,
  collected: bind(collected), retained: bind(disposition), actualImageOpens: 4,
  contentRepairsPerFigure: authorReport.contentRepairsPerFigure,
  independentApproval: false,
});
meter.currentResume1816.D155 = {
  status: 'SOURCE_ONLY_INPUT_PREPARED_NOT_DISPATCHED_AUTHOR_NOT_READY',
  sourceOnly: bind(`${T}/tmp/d1816-d155-n9-crystal-figures-review-input/source-only.json`),
  reviewer: null, completeCoursesAdded: 0, independentApproval: false,
};
Object.assign(meter.currentResume1816.D156, {
  status: 'FIRST_BOUNDED_CRYSTAL_APPEARANCE_AUTHOR_ACTIVE',
  author: '01a1f8f0-3e92-7662-851d-41060192f219', authorClosed: false,
  actualImageOpens: null, authorReportPending: true,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file));
  index.reports.push({ ...bind(file), batch: 'D153' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), retained: bind(disposition),
  retainedFiles: walk(O).length, imagesOpened: 0, independentApproval: false }));
