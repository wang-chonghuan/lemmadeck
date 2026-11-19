'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const owner = path.join(base, 'n40-table-cell-review');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const ownReceiptPath = path.join(owner, 'freeze-receipt.json');
const receiptBytes = fs.readFileSync(ownReceiptPath);
const receiptSha256 = sha256(receiptBytes);
assert.equal(receiptSha256, 'd09a73fc60afcdc5fb5089b9036757d71ce3bab334ef2c42210597a781a4c9c5');
const freeze = JSON.parse(receiptBytes);
const verifyFreeze = () => {
  assert.equal(sha256(fs.readFileSync(ownReceiptPath)), receiptSha256);
  assert.equal(fs.statSync(ownReceiptPath).mode & 0o222, 0);
  for (const file of freeze.files) {
    assert.equal(sha256(fs.readFileSync(file.path)), file.sha256);
    assert.equal(fs.statSync(file.path).mode & 0o222, 0);
  }
};
verifyFreeze();
const captures = JSON.parse(fs.readFileSync(path.join(owner, 'captures.json'), 'utf8'));
const scope = JSON.parse(fs.readFileSync(path.join(owner, 'scope.json'), 'utf8'));
const authorPath = path.join(base, 'n40-table-cell-author/captures.json');
const authorBytes = fs.readFileSync(authorPath);
const authorSha256 = sha256(authorBytes);
assert.equal(authorSha256, scope.stage2.requiredAuthorCapturesSha256);
const comparisonAtUtc = new Date().toISOString();
const firstAuthorReadAtUtc = '2026-11-19T04:07:47.283Z';
assert.ok(Date.parse(freeze.frozenAtUtc) < Date.parse(firstAuthorReadAtUtc));
assert.ok(Date.parse(firstAuthorReadAtUtc) <= Date.parse(comparisonAtUtc));
const author = JSON.parse(authorBytes);

// Project only cell, source-grid, header and unit fields; unrelated author context is not evidence.
const authorCells = author.captures;
assert.equal(authorCells.length, 8);
assert.equal(new Set(authorCells.map((c) => c.requested_target)).size, 8);
assert.equal(author.source_first_inventory.length, 3);
assert.equal(author.headers.length, 1);
const authorHeaders = author.headers[0];
const sourceChecks = captures.sourceImages.map((source) => {
  const basename = path.basename(source.path);
  const other = author.source_first_inventory.find((s) => path.basename(s.image) === basename);
  assert.ok(other);
  const checks = {
    sourceHash: source.sha256 === other.sha256,
    printedFooter: source.printedFooterExact === other.actual_printed_footer,
    tableTitle: source.printedTitleExact === other.title_raw,
    rowHeader: source.rowHeaderExact === authorHeaders.row_header_raw,
    mainTop: JSON.stringify(source.mainColumnHeadersExact) === JSON.stringify(authorHeaders.main_top_raw),
    mainBottom: JSON.stringify(source.mainColumnHeadersExact) === JSON.stringify(authorHeaders.main_bottom_raw),
    correctionTop: JSON.stringify(source.correctionColumnHeadersExact) === JSON.stringify(authorHeaders.correction_top_raw),
    correctionBottom: JSON.stringify(source.correctionColumnHeadersExact) === JSON.stringify(authorHeaders.correction_bottom_raw),
    numericHeadersNotLiteralUnitCaptions: authorHeaders.units_literally_written_in_column_headers === false
  };
  return {image: basename, sha256: source.sha256, printedFooter: source.printedFooterExact, table: 'IV', checks, status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL'};
});

const scaleChecks = ['IV-below-10', 'IV-at-or-above-10'].map((id) => {
  const other = author.source_rule_units_not_printed_header_text.find((s) => s.id === id);
  assert.ok(other);
  const own = id === 'IV-below-10' ? captures.scales.below10 : captures.scales.from10;
  const checks = {
    mainArgumentDigitUnit: own.mainColumnArgumentUnit === other.main_argument_digit_unit,
    mainArgumentStep: own.mainColumnArgumentUnit === other.main_argument_step,
    correctionArgumentDigitUnit: own.correctionColumnArgumentUnit === other.correction_argument_digit_unit,
    rootCorrectionIntegerUnit: own.rootCorrectionUnit === other.correction_result_integer_unit
  };
  return {
    regime: id,
    mainArgumentUnit: own.mainColumnArgumentUnit,
    correctionArgumentUnit: own.correctionColumnArgumentUnit,
    rootCorrectionUnit: own.rootCorrectionUnit,
    checks,
    status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
    independentBasis: 'Frozen source row-comma notation, numeric headers, and source explanation on printed page 39; author basis paths were not opened.'
  };
});

const addressUnits = (decimal) => {
  const normalized = decimal.replace(',', '.');
  const match = /^(\d+)(?:\.(\d{0,4}))?$/.exec(normalized);
  assert.ok(match, `Not a source address: ${decimal}`);
  return BigInt(match[1]) * 10000n + BigInt((match[2] || '').padEnd(4, '0'));
};
const comparisons = captures.captures.map((cell) => {
  const other = authorCells.find((c) => c.requested_target === cell.targetArgumentAddress);
  assert.ok(other);
  const scale = captures.scales.targetAddressCompatibility.find((s) => s.argument === cell.targetArgumentAddress);
  const target = scope.stage1.targets.find((s) => s.argument === cell.targetArgumentAddress);
  const regime = addressUnits(target.row) < 100000n ? 'IV-below-10' : 'IV-at-or-above-10';
  const rowMatches = cell.rowExact === other.row_label_raw;
  const mainColumnMatches = cell.mainColumnExact === other.main_column_raw;
  const mainMatches = cell.mainCellExact === other.main_cell_raw;
  const sourceMatches = cell.sourceImage === other.image && cell.printedFooter === other.printed_page;
  const regimeMatches = regime === other.unit_regime;
  const ownCorrection = cell.correction;
  const correctionColumnMatches = (ownCorrection?.columnExact ?? null) === other.correction_column_raw;
  const correctionMatches = (ownCorrection?.cellExact ?? null) === other.correction_cell_raw;
  const addressedArgument = addressUnits(cell.rowExact)
    + BigInt(cell.mainColumnExact) * addressUnits(scale.mainColumnArgumentUnit)
    + BigInt(ownCorrection?.columnExact ?? '0') * addressUnits(scale.correctionColumnArgumentUnit);
  const addressCompatible = addressedArgument === addressUnits(cell.targetArgumentAddress);
  const checks = {sourceMatches, rowMatches, mainColumnMatches, mainMatches, correctionColumnMatches, correctionMatches, regimeMatches, addressCompatible};
  const repairs = [];
  if (!mainMatches) {
    repairs.push({
      authorCaptureId: other.id,
      sourceImage: cell.sourceImage,
      printedFooter: cell.printedFooter,
      table: 'IV',
      rowExact: cell.rowExact,
      mainColumnExact: cell.mainColumnExact,
      field: 'main_cell_raw',
      replaceWithExactSourceCell: cell.mainCellExact,
      authorCurrent: other.main_cell_raw
    });
  }
  if (!correctionMatches || !correctionColumnMatches) {
    repairs.push({
      authorCaptureId: other.id,
      sourceImage: cell.sourceImage,
      printedFooter: cell.printedFooter,
      table: 'IV',
      rowExact: cell.rowExact,
      correctionColumnExact: ownCorrection?.columnExact ?? null,
      fields: ['correction_column_raw', 'correction_cell_raw'],
      replaceWithExactSourceColumn: ownCorrection?.columnExact ?? null,
      replaceWithExactSourceCell: ownCorrection?.cellExact ?? null,
      authorCurrentColumn: other.correction_column_raw,
      authorCurrentCell: other.correction_cell_raw
    });
  }
  return {
    targetArgumentAddress: cell.targetArgumentAddress,
    authorCaptureId: other.id,
    sourceImage: cell.sourceImage,
    printedFooter: cell.printedFooter,
    table: 'IV',
    rowExact: cell.rowExact,
    mainColumnExact: cell.mainColumnExact,
    independentMainCellExact: cell.mainCellExact,
    authorMainCellExact: other.main_cell_raw,
    mainCellStatus: mainMatches && rowMatches && mainColumnMatches && sourceMatches ? 'PASS' : 'FAIL',
    correctionColumnExact: ownCorrection?.columnExact ?? null,
    independentCorrectionCellExact: ownCorrection?.cellExact ?? null,
    authorCorrectionCellExact: other.correction_cell_raw,
    correctionCellStatus: ownCorrection ? (correctionMatches && correctionColumnMatches && rowMatches && sourceMatches ? 'PASS' : 'FAIL') : 'NOT_REQUESTED',
    mainArgumentAddress: scale.mainAddress,
    correctionArgumentIncrement: scale.correctionArgumentIncrement ?? null,
    mainArgumentUnit: scale.mainColumnArgumentUnit,
    correctionArgumentUnit: scale.correctionColumnArgumentUnit,
    rootCorrectionUnit: scale.rootCorrectionUnit,
    checks,
    targetStatus: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
    repairs
  };
});
const repairs = comparisons.flatMap((c) => c.repairs);
const allPass = comparisons.every((c) => c.targetStatus === 'PASS')
  && sourceChecks.every((s) => s.status === 'PASS')
  && scaleChecks.every((s) => s.status === 'PASS');
const counts = {
  sourceImages: 3,
  visualImageLoads: 3,
  imagesPerSource: 1,
  crops: 0,
  reopens: 0,
  renders: 0,
  targetsCompared: comparisons.length,
  targetsPassed: comparisons.filter((c) => c.targetStatus === 'PASS').length,
  mainCellsCompared: comparisons.length,
  mainCellsPassed: comparisons.filter((c) => c.mainCellStatus === 'PASS').length,
  requestedCorrectionCellsCompared: comparisons.filter((c) => c.correctionColumnExact !== null).length,
  requestedCorrectionCellsPassed: comparisons.filter((c) => c.correctionCellStatus === 'PASS').length,
  correctionNotRequested: comparisons.filter((c) => c.correctionCellStatus === 'NOT_REQUESTED').length,
  sourceCellsApproved: comparisons.filter((c) => c.mainCellStatus === 'PASS').length + comparisons.filter((c) => c.correctionCellStatus === 'PASS').length,
  footersVerified: sourceChecks.filter((s) => s.checks.printedFooter).length,
  sourceHashesCompatible: sourceChecks.filter((s) => s.checks.sourceHash).length,
  headerSetsCompatible: sourceChecks.filter((s) => s.status === 'PASS').length,
  scaleRegimesCompatible: scaleChecks.filter((s) => s.status === 'PASS').length,
  discrepantSourceCells: repairs.length,
  authorReadsBeforeFreeze: 0,
  authorCaptureFileReadsAfterFreeze: 2,
  authorUniqueFilesReadAfterFreeze: 1,
  derivedFileReads: 0,
  answerKeyReads: 0,
  writesOutsideOwner: 0,
  networkActions: 0,
  dbActions: 0,
  appActions: 0,
  sourceOrDurableEdits: 0,
  commits: 0
};
assert.equal(allPass, true, 'This receipt only finalizes the observed all-PASS comparison.');
assert.equal(counts.sourceCellsApproved, 11);
assert.equal(counts.requestedCorrectionCellsPassed, 3);
assert.equal(repairs.length, 0);
verifyFreeze();

const comparison = {
  schema: 'stemrobin182/n40-independent-source-cell-comparison@1',
  ticket: 'STEMROBIN-182',
  mode: 'OFFLINE',
  checkout: root,
  owner,
  stage1: {frozenAtUtc: freeze.frozenAtUtc, freezeReceiptPath: ownReceiptPath, freezeReceiptSha256: receiptSha256, capturesSha256: freeze.files.find((f) => f.name === 'captures.json').sha256, remainedByteIdenticalAndReadOnly: true},
  stage2: {firstAuthorReadAtUtc, comparedAtUtc: comparisonAtUtc, authorizedAuthorPath: authorPath, authorizedAuthorSha256: authorSha256, requiredSha256Matched: true, comparisonProjection: ['captures', 'source_first_inventory: image/hash/footer/title', 'headers: row/main/correction labels', 'source_rule_units_not_printed_header_text: unit fields'], derivedJson: 'Not read; unnecessary for this source-cell verdict.', otherAuthorFiles: 'Not read.', answerKeys: 'Not read.'},
  status: 'SOURCE_CELLS_APPROVED',
  exactApproval: 'Approve the eight specified main cells and the three specified correction cells in the authorized author captures.json at the verified SHA-256. This includes the source-printed zero correction at row 3,9, correction column 1. Approve their exact Table IV source addresses, all three footers, all three source-image hashes, and the stated argument/root-correction units.',
  boundaries: 'Source-cell approval only. No final numeric answers or preprocessing/precision adjudication. No historical-equivalence or human-approval gate is introduced.',
  sourceChecks,
  scaleChecks,
  comparisons,
  repairs,
  unaffectedPassPolicy: 'All eleven source cells remain PASS. No source-cell repairs are prescribed; no unaffected cells are reopened or rerun.',
  counts
};

const tableRows = comparisons.map((c) =>
  `| ${c.targetArgumentAddress} | ${c.printedFooter} | ${c.rowExact} | ${c.mainColumnExact} | ${c.independentMainCellExact} | ${c.correctionColumnExact ?? '-'} | ${c.independentCorrectionCellExact ?? '-'} | ${c.targetStatus} |`
);
const report = [
  '# n40 Independent Table IV Source-Cell Review',
  '',
  'STEMROBIN-182. OFFLINE. Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.',
  '',
  '## Final Cell Approval',
  '',
  '**SOURCE_CELLS_APPROVED: 11/11 exact cells; 8/8 target addresses PASS.**',
  '',
  comparison.exactApproval,
  '',
  'The numbers below are literal source MAIN/correction cell captures, not evaluated exercise answers. A dash means no correction was requested, not a synthetic printed zero.',
  '',
  '| Target Address | Footer | Exact Row | Main Column | Exact MAIN Cell | Correction Column | Exact Correction Cell | Verdict |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...tableRows,
  '',
  '## Rows, Corrections, And Scales',
  '',
  '- All requested rows and columns match exactly, including trailing commas on integer rows `12,`, `28,`, `33,`, and `80,`.',
  '- Below 10: main argument columns advance by `0.01`; correction argument columns advance by `0.001`.',
  '- From 10: main argument columns advance by `0.1`; correction argument columns advance by `0.01`. Thus address `33.33` uses row `33,`, main column `3`, correction column `3`: main address `33,3`, correction argument increment `0.03`.',
  '- For `2.624` and `3.981`, correction argument increments are `0.004` and `0.001`, respectively. The printed zero for the latter is a real captured correction cell.',
  '- Root-correction integers always have unit `0.001` in both regimes. Argument increment and root-correction amount are distinct.',
  '- Header bands are `N`, main `0` through `9`, correction `1` through `9`, repeated at the bottom. Units are not literal header captions: the independent unit check uses exact row-comma positions and the source explanation/examples on printed page 39.',
  '- The five main-only targets need no requested correction cell; the source prints no correction column 0.',
  '',
  '## Source And Freeze',
  '',
  ...sourceChecks.map((s) => `- \`${s.image}\`: printed footer \`${s.printedFooter}\`, Table IV, source SHA-256 \`${s.sha256}\`; source/hash/footer/header comparison PASS.`),
  '',
  `Stage 1 was frozen at \`${freeze.frozenAtUtc}\` before the first author read at \`${firstAuthorReadAtUtc}\`.`,
  '',
  `- Frozen independent captures: \`captures.json\`, SHA-256 \`${comparison.stage1.capturesSha256}\`.`,
  `- Frozen image ledger: \`image-load-ledger.json\`, SHA-256 \`${freeze.files.find((f) => f.name === 'image-load-ledger.json').sha256}\`.`,
  `- Freeze receipt: \`freeze-receipt.json\`, SHA-256 \`${receiptSha256}\`.`,
  `- Compared only authorized \`../n40-table-cell-author/captures.json\`, verified SHA-256 \`${authorSha256}\`.`,
  '- All Stage 1 files and the freeze receipt remain byte-identical and read-only.',
  '',
  '## Discrepancies And Scope',
  '',
  'No discrepancies. No source-cell repair is required. Every unaffected PASS is retained; no source image is reopened.',
  '',
  comparison.boundaries,
  '',
  '`derived.json` was not read because source-cell comparison needs no root arithmetic. No answer keys or other author files were read. No original transcript, durable content, app, database, network, or commit action was performed.',
  '',
  'Counts: 3 source images, 3 full-image loads (one each), 0 crops/reopens/renders; 8 main cells plus 3 requested correction cells approved; 3 footers and 3 image hashes compatible; 2 scale regimes compatible; 0 discrepancies; 0 author reads before freeze; 0 answer-key reads.',
  '',
  'Detailed machine comparison and final file hashes are in `comparison.json` and `completion-receipt.json`. Stop after this source-cell report.'
].join('\n') + '\n';

const writeNew = (name, content) => {
  fs.writeFileSync(path.join(owner, name), content, {flag: 'wx', mode: 0o444});
};
writeNew('comparison.json', JSON.stringify(comparison, null, 2) + '\n');
writeNew('report.md', report);
fs.chmodSync(__filename, 0o444);
const manifestNames = [
  ...freeze.files.map((f) => f.name),
  'freeze-receipt.json',
  'compare-stage2.cjs',
  'comparison.json',
  'report.md'
];
const files = manifestNames.map((name) => {
  const filePath = path.join(owner, name);
  const bytes = fs.readFileSync(filePath);
  assert.equal(fs.statSync(filePath).mode & 0o222, 0);
  return {name, path: filePath, sha256: sha256(bytes), bytes: bytes.length, mode: '0444'};
});
const completion = {
  schema: 'stemrobin182/n40-source-cell-review-completion@1',
  ticket: 'STEMROBIN-182',
  completedAtUtc: new Date().toISOString(),
  status: comparison.status,
  checkout: root,
  owner,
  stage1FrozenAtUtc: freeze.frozenAtUtc,
  firstAuthorReadAtUtc,
  authorizedAuthorCapturesSha256: authorSha256,
  counts,
  files,
  boundaries: comparison.boundaries,
  sourceImagePayloadsReturned: 0,
  sourceImages: freeze.sourceImages,
  finalAction: 'Reports complete; stop. No other stage authorized by this result.'
};
writeNew('completion-receipt.json', JSON.stringify(completion, null, 2) + '\n');
verifyFreeze();
for (const file of files) {
  assert.equal(sha256(fs.readFileSync(file.path)), file.sha256);
}
const completionPath = path.join(owner, 'completion-receipt.json');
assert.equal(fs.statSync(completionPath).mode & 0o222, 0);
console.log(JSON.stringify({
  status: completion.status,
  counts,
  files,
  completionReceiptPath: completionPath,
  completionReceiptSha256: sha256(fs.readFileSync(completionPath)),
  finalAction: 'STOP'
}, null, 2));
