import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const O = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d097-source322323-affected324-svg298-review');
assert.equal(process.cwd(), W);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const reportPath = path.join(O, 'report.json');
const report = read(reportPath);
const before = read(path.join(O, 'bindings-before.json'));
const after = read(path.join(O, 'bindings-after.json'));
assert.deepEqual(before, after);
for (const entry of before.bindings) assert.deepEqual(bind(entry.path), entry);
function verifyReferences(v) {
  if (!v || typeof v !== 'object') return;
  if (v.path && v.sha256) assert.equal(bind(v.path).sha256, v.sha256, v.path);
  for (const value of Object.values(v)) verifyReferences(value);
}
verifyReferences(report);
assert.equal(report.imageLedger.actualBatchOpens, 8);
assert.equal(report.imageLedger.actualContextOpens, 8);
assert.equal(report.imageLedger.events.length, 8);
assert.equal(new Set(report.imageLedger.events.map(v => v.path)).size, 8);
for (let i = 0; i < 8; i++) {
  const actual = report.imageLedger.events[i];
  const bound = before.plannedImages[i];
  assert.equal(actual.ordinal, i + 1);
  assert.equal(actual.id, bound.id);
  assert.equal(actual.path, bound.path);
  assert.equal(actual.sha256, bound.sha256);
  assert.deepEqual(actual.dimensionsPx, [bound.width, bound.height]);
  assert.equal(actual.opens, 1);
}
for (const [target, rows] of [['SOURCE322', 25], ['SOURCE323', 28]]) {
  const verdict = report.verdicts.find(v => v.target === target);
  assert.equal(verdict.rowsChecked.reduce((sum, r) => sum + (r.additionalCountRows ?? r.rows ?? 0), 0), rows);
}
const preservedContent = [];
const body = text => text.split('---').slice(2).join('---');
for (const page of [322, 323]) {
  const oldRoot = path.join(W, `.intentfold/tickets/STEMROBIN-181/tmp/d1816-d084-source322323-author/native/finalize-${page}-first`);
  const currentRoot = path.join(W, `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0${page}`);
  const old = read(path.join(oldRoot, 'page.json'));
  const current = read(path.join(currentRoot, 'page.json'));
  assert.deepEqual(old.blocks, current.blocks);
  assert.equal(body(fs.readFileSync(path.join(oldRoot, 'page.md'), 'utf8')),
    body(fs.readFileSync(path.join(currentRoot, 'page.md'), 'utf8')));
  const oldAudit = read(path.join(oldRoot, 'audit.json'));
  const currentAudit = read(path.join(currentRoot, 'audit.json'));
  assert.equal(currentAudit.lines_printed, currentAudit.lines_md);
  assert.equal(current.counting, undefined);
  assert.equal(current.meta.counting.edge_margin_px, 80);
  preservedContent.push({
    page,
    firstBlocksAndCurrentBlocksStructurallyIdentical: true,
    firstMarkdownBodyAndCurrentMarkdownBodyIdentical: true,
    firstAudit: bind(path.join(oldRoot, 'audit.json')),
    currentAudit: bind(path.join(currentRoot, 'audit.json')),
    firstPrintedRows: oldAudit.lines_printed,
    currentPrintedRows: currentAudit.lines_printed,
    currentMarkdownRows: currentAudit.lines_md,
    currentCountingEdgeMarginPx: current.meta.counting.edge_margin_px,
    newCounterFinalizeVectorizerCalls: 0
  });
}
const artifacts = fs.readdirSync(O).filter(name => name !== 'review-freeze.json')
  .sort().map(name => bind(path.join(O, name)));
const freeze = {
  schema: 'D097/independent-review-freeze@1',
  reviewer: 'D097',
  ticket: 'STEMROBIN-181',
  book: '9p',
  workdir: W,
  frozenAt: new Date().toISOString(),
  finish: 'review',
  grill: 'self',
  status: 'REVIEW_COMPLETE_PARENT_CONSUMPTION_PENDING_ONE_NARROW_CASE_HOLD',
  report: bind(reportPath),
  inputBindings: [bind(path.join(O, 'bindings-before.json')), bind(path.join(O, 'bindings-after.json'))],
  uniqueCurrentInputsVerified: before.bindings.length,
  beforeAfterCurrentInputBytesUnchanged: true,
  evidenceArtifacts: artifacts,
  originalReviewerInspectionFailure: bind(path.join(O, 'inspection-first-failure.json')),
  inspectionRepair: {
    status: 'PASS_STRUCTURED_AND_MARKDOWN_BODY_COMPARISON',
    originalExit1Preserved: true,
    diagnosis: 'Author Python sorted/spaced digest versus reviewer compact insertion-order JS digest. No reviewed input change.',
    verification: preservedContent
  },
  verdicts: report.verdicts.map(v => ({ target: v.target, status: v.status, scope: v.scope })),
  narrowHolds: report.narrowHolds,
  reusedPASSAndPreservedFAILDetails: { reportSha256: bind(reportPath).sha256, fields: ['priorPASSReused', 'firstFailuresPreserved'] },
  imageLedger: report.imageLedger,
  onlyWrittenRoot: O,
  nativeStepsPromotionMeterIndexDBDeployGitModelDependencyPurchaseOtherChatAgentCalls: 0,
  parentOwnsConsumptionAndNativeSteps: true,
  whole131ChoiceAnswerModernApproval: false,
  selfHash: 'Excluded to avoid a circular digest; exact final file SHA256 is returned externally.'
};
const target = path.join(O, 'review-freeze.json');
assert.ok(!fs.existsSync(target), 'Do not overwrite an existing freeze');
fs.writeFileSync(target, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'PASS', report: bind(reportPath), reviewFreeze: bind(target), inputFiles: before.bindings.length, images: 8, preservedContent }));
