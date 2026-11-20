import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d151-n9-figures89-author`;
const O = `${T}/evidence/reports/d1816-d151-n9-figures89-hold`;
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
assert.equal(report.sha256, 'b03c47803dee30022d4b4029fe1084b6ece0e5d2ee23aa9655f7c3d2fe006c3d');
assert.equal(freeze.sha256, 'ce746f34025b44a7a88a4ddc657de0987f4a3ac2d1bac8d35d19aa531efc4d65');
const authorReport = read(report.path);
assert.equal(authorReport.status, 'HOLD_SOURCE_FIDELITY');
assert.equal(authorReport.authorReady, false);
assert.equal(authorReport.actualImageOpens, 4);
assert.deepEqual(authorReport.selectedPathsAndHashes, []);
const collected = `${A}/parent-collected.json`;
save(collected, {
  batch: 'D151', status: 'AUTHOR_SOURCE_COUNT_HOLD_COLLECTED_CLOSED_NO_CANDIDATES',
  author: '01a1f8da-9911-7d12-a651-95b58c648487', authorClosed: true,
  report, freeze, verifiedCurrentBindingsBeforeClosure: 25,
  returnedHashesOmittedByAuthor: true, actualHashesComputedByParentFromSavedBytes: true,
  failedImagePathNotComparedAsCurrent: true, actualImageOpens: 4,
  contentRepairs: 0, nativeValidators: 0, nativeRenders: 0,
  holds: authorReport.figures.map(row => ({ figure: row.figure, status: row.status, reason: row.holdReason })),
  originalTechnicalImagePathFailurePreserved: true,
  independentApproval: false, sourcePageApprovalsUnchanged: true,
  canonicalPromotions: 0, completeCoursesAdded: 0, parentImageOpens: 0,
  paidCalls: 0, portraitGenerationAuthorized: false, productAcceptance: false,
});
const retained = [];
for (const from of walk(A)) {
  const to = `${O}/author/${path.relative(A, from)}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retained.push({ ...bind(to), originalPath: from });
}
for (const name of ['prepare-d151-n9-figures89.mjs', 'retain-d151-source-count-hold.mjs']) {
  const from = `${T}/tmp/d1816-recovery/${name}`;
  const to = `${O}/tools/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  retained.push({ ...bind(to), originalPath: from });
}
const disposition = `${O}/retained-progress.json`;
save(disposition, {
  batch: 'D151', status: 'N9_FIG08_FIG09_SOURCE_COUNT_HOLD_RETAINED_NO_APPROVAL',
  lesson: 'phy9-c1-s1-n9', retained,
  collected: bind(`${O}/author/parent-collected.json`),
  actualImageOpens: 4, parentImageOpens: 0, selectedCandidates: 0,
  independentApproval: false, completeCoursesAdded: 0, canonicalPromotions: 0,
  sourcePageApprovalsUnchanged: true, nativeOrReviewReplay: false,
  contentRepairs: 0, paidCalls: 0, portraitGenerationAuthorized: false,
  sourceResolutionDiagnosisPending: true, productAcceptance: false, formalHandoff: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
Object.assign(meter.currentResume1816.D151, {
  status: 'N9_FIG08_FIG09_SOURCE_COUNT_HOLD_RETAINED_AUTHOR_CLOSED',
  authorClosed: true, authorReportPending: false, report, freeze,
  collected: bind(collected), retained: bind(disposition), actualImageOpens: 4,
  selectedCandidates: 0, contentRepairs: 0,
});
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
index.updatedAt = meter.updatedAt;
for (const file of walk(O)) {
  assert(!index.reports.some(row => row.path === file), file);
  index.reports.push({ ...bind(file), batch: 'D151' });
}
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ collected: bind(collected), retained: bind(disposition),
  retainedFiles: walk(O).length, independentApproval: false, imagesOpened: 0 }));
