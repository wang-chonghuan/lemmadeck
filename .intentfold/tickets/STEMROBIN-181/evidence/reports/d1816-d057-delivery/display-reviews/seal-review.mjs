import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const O = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d065-n22-display-review');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const read = name => JSON.parse(fs.readFileSync(path.join(O, name), 'utf8'));
const verifyBindings = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    assert.equal(bind(path.resolve(W, value.path)).sha256, value.sha256, value.path);
  }
  for (const nested of Object.values(value)) verifyBindings(nested);
};
const display = read('display-report.json');
const source = read('source-period-report.json');
const ledger = read('image-ledger.json');
const grill = read('grill.json');
const evidence = read('binding-evidence.json');
for (const report of [display, source, ledger]) verifyBindings(report);
verifyBindings(evidence.display);
verifyBindings(evidence.source);
verifyBindings(evidence.checkedBindings);
assert.equal(display.records.length, 4);
assert.equal(display.actualImageOpens, 4);
assert.equal(ledger.actualImageOpens, 4);
assert.deepEqual(display.records.map(row => row.screenshot.sha256), ledger.records.map(row => row.sha256));
for (const row of source.records) {
  const mechanical = evidence.source.find(item => item.page === row.page);
  assert.deepEqual(row.punctuationEdits, mechanical.observedEdits);
  assert.equal(row.punctuationEditCount, mechanical.observedEdits.length);
}
const freeze = {
  schema: 'STEMROBIN-181/two-scope-independent-review-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D065', status: { display: display.status, sourcePeriod: source.status },
  reviewerIsAuthor: false, soleActiveIndependentReviewer: true, finish: 'review', grill: 'self',
  workdir: W,
  displayReport: bind(path.join(O, 'display-report.json')),
  sourcePeriodReport: bind(path.join(O, 'source-period-report.json')),
  imageLedger: bind(path.join(O, 'image-ledger.json')),
  selfGrill: bind(path.join(O, 'grill.json')),
  bindingEvidence: bind(path.join(O, 'binding-evidence.json')),
  bindingRecorder: bind(path.join(O, 'record-binding-evidence.mjs')),
  sealRecorder: bind(path.join(O, 'seal-review.mjs')),
  boundResult: evidence.result,
  reusedD062Freeze: evidence.reusedD062Freeze,
  baseReview: evidence.baseReview,
  baseReviewFreeze: evidence.baseFreeze,
  repairedAuthor: evidence.repairedAuthor,
  applied: evidence.applied,
  authority: {
    mode: 'Reread existing parent-supplied live receipts; no new backend/capability invocation.',
    boundFiles: evidence.authority,
    latest179CommentId: evidence.latest179CommentId,
    finish: 'review', grill: 'self',
  },
  actualImageOpens: ledger.actualImageOpens,
  sourceImageOpens: 0, rawImageOpens: 0, svgImageOpens: 0,
  conservativeCountedContextTotal: ledger.conservativeCountedContextTotal,
  actualAffectedSOURCEpages: source.actualAffectedSOURCEpages,
  whole125Approval: false, existing307ReviewedOrCounted: false, modern125Produced: false,
  parentConsumption: 'pending; parent alone consumes later',
  nativeProducerReruns: [], formalHandoff: false,
  semanticVerdicts: 'Manually authored by independent reviewer in the two reports and self-Grill; this script only records bindings.',
  selfGrillStatus: grill.status,
  frozenAt: new Date().toISOString(),
};
const output = path.join(O, 'review-freeze.json');
fs.writeFileSync(output, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ freeze: bind(output), reports: [freeze.displayReport, freeze.sourcePeriodReport],
  ledger: freeze.imageLedger, grill: freeze.selfGrill, status: freeze.status, actualImageOpens: 4,
  sourceImageOpens: 0, actualAffectedSOURCEpages: 2, whole125Approval: false }, null, 2));
