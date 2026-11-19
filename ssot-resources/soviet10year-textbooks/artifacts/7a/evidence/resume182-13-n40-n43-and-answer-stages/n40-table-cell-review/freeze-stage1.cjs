'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const owner = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-table-cell-review');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);

const names = ['scope.json', 'captures.json', 'image-load-ledger.json', 'freeze-stage1.cjs'];
const receiptPath = path.join(owner, 'freeze-receipt.json');
assert.equal(fs.existsSync(receiptPath), false, 'A Stage 1 freeze already exists; never overwrite it.');
const read = (name) => JSON.parse(fs.readFileSync(path.join(owner, name), 'utf8'));
const captures = read('captures.json');
const ledger = read('image-load-ledger.json');
const scope = read('scope.json');
assert.equal(captures.stage1Complete, true);
assert.equal(captures.authorReadBeforeFreeze, false);
assert.equal(captures.answerKeysRead, false);
assert.deepEqual(ledger.authorFilesRead, []);
assert.deepEqual(ledger.answerKeyFilesRead, []);
assert.equal(ledger.completedImageLoads, 3);
assert.equal(ledger.closed, true);
assert.deepEqual(ledger.actualCounts, {images: 3, loads: 3, crops: 0, reopens: 0, renders: 0});
assert.equal(captures.captures.length, 8);
assert.equal(captures.captures.filter((c) => c.correction !== null).length, 3);
assert.equal(captures.sourceImages.length, 3);
assert.deepEqual(captures.sourceImages.map((s) => s.printedFooterExact), ['35', '37', '39']);
assert.ok(captures.sourceImages.every((s) => s.tableNumberExact === 'IV'));
assert.deepEqual(
  captures.captures.map((c) => c.targetArgumentAddress),
  scope.stage1.targets.map((t) => t.argument)
);
for (const source of ledger.images) {
  assert.equal(source.loadCount, 1);
  assert.equal(source.status, 'observed-full-image-once');
  const captureSource = captures.sourceImages.find((s) => s.path === source.path);
  assert.ok(captureSource);
  assert.equal(source.sha256, captureSource.sha256);
  assert.equal(source.observedFooter, captureSource.printedFooterExact);
}
for (const cell of captures.captures) {
  assert.match(cell.mainCellExact, /^\d+,\d{3}$/);
  const target = scope.stage1.targets.find((t) => t.argument === cell.targetArgumentAddress);
  assert.equal(Number(cell.mainColumnExact), target.mainColumn);
  assert.equal(cell.rowExact.replace(/,$/, '').replace(',', '.'), target.row);
  if (cell.correction) {
    assert.equal(cell.correction.rowExact, cell.rowExact);
    assert.equal(Number(cell.correction.columnExact), target.correctionColumn);
    assert.match(cell.correction.cellExact, /^\d+$/);
  } else {
    assert.equal(target.correctionColumn, null);
  }
}
assert.ok(captures.scales.targetAddressCompatibility.every((s) => s.compatible));
assert.equal(captures.scales.below10.correctionColumnArgumentUnit, '0.001');
assert.equal(captures.scales.from10.correctionColumnArgumentUnit, '0.01');
assert.equal(captures.scales.below10.rootCorrectionUnit, '0.001');
assert.equal(captures.scales.from10.rootCorrectionUnit, '0.001');

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const files = names.map((name) => {
  const filePath = path.join(owner, name);
  const bytes = fs.readFileSync(filePath);
  fs.chmodSync(filePath, 0o444);
  return {name, path: filePath, sha256: sha256(bytes), bytes: bytes.length, mode: '0444'};
});
const receipt = {
  schema: 'stemrobin182/independent-pre-author-freeze-receipt@1',
  ticket: 'STEMROBIN-182',
  stage: 'stage1-frozen-before-any-author-read',
  frozenAtUtc: new Date().toISOString(),
  checkout: root,
  owner,
  files,
  sourceImages: captures.sourceImages.map((s) => ({
    path: path.join(root, s.path),
    sha256: s.sha256,
    printedFooterExact: s.printedFooterExact,
    table: s.tableNumberExact,
    fullImageVisualLoads: 1
  })),
  counts: {targets: 8, mainCells: 8, requestedCorrectionCells: 3, exactCells: 11, sourceImages: 3, visualLoads: 3, crops: 0, reopens: 0, renders: 0, authorReadsBeforeFreeze: 0, answerKeyReads: 0},
  sourceCellValues: 'Bound by immutable captures.json digest; no author values supplied to Stage 1.',
  permissions: 'Frozen files are read-only; no later Stage 1 amendments.',
  nextStageAuthorization: scope.stage2
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx', mode: 0o444});
const receiptBytes = fs.readFileSync(receiptPath);
for (const file of files) {
  assert.equal(sha256(fs.readFileSync(file.path)), file.sha256);
  assert.equal(fs.statSync(file.path).mode & 0o222, 0);
}
assert.equal(fs.statSync(receiptPath).mode & 0o222, 0);
console.log(JSON.stringify({
  status: 'FROZEN',
  frozenAtUtc: receipt.frozenAtUtc,
  receiptPath,
  receiptSha256: sha256(receiptBytes),
  files,
  counts: receipt.counts,
  authorFilesRead: 0,
  answerKeysRead: 0
}, null, 2));
