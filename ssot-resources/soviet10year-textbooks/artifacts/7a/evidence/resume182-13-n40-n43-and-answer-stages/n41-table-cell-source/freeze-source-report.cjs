'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const owner = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-table-cell-source');
assert.equal(__dirname, owner);
assert.equal(fs.realpathSync(process.cwd()), root);
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const read = (name) => JSON.parse(fs.readFileSync(path.join(owner, name), 'utf8'));
const plan = read('address-plan.json');
assert.equal(sha(fs.readFileSync(path.join(owner, 'address-plan.json'))), '361483bbe3dd68a16242079966224e3f9a244584db6d814968404c37169f7571');
const addressFreeze = read('address-plan-freeze.json');
assert.equal(sha(fs.readFileSync(path.join(owner, 'address-plan-freeze.json'))), 'f82bc0662e77623149d3ce52a90491d6c077c1386be0cc958a5bd823481e522c');
for (const input of [...plan.inputs, ...addressFreeze.files]) assert.equal(sha(fs.readFileSync(input.path)), input.sha256);
const ledger = read('image-load-ledger.json');
assert.equal(ledger.closed, true);
assert.equal(ledger.completedImageLoadsThisJob, 2);
assert.equal(ledger.authorKeysOrSolutionsRead, false);
assert.equal(ledger.reusedCoveredAddressImagesOpened, 0);
assert.equal(ledger.crops, 0);
assert.equal(ledger.renders, 0);
assert.equal(ledger.withinJobReopens, 0);
assert.ok(ledger.images.every((i) => i.loadsThisJob === 1 && i.status === 'observed-full-PNG-once'));
const newCaptures = ['capture-36.json', 'capture-37.json'].map((name) => {
  const file = read(name);
  assert.equal(file.stage, 'SOURCE_ONLY_WRITE_ONCE_BEFORE_ANY_N41_AUTHOR_READ');
  assert.equal(file.authorKeysOrSolutionsRead, false);
  assert.equal(file.candidateCompared, false);
  assert.equal(file.answerApproval, false);
  assert.equal(file.tableExact, 'IV');
  const image = ledger.images.find((i) => i.page === file.pdfImage);
  assert.ok(image);
  assert.equal(file.sourceImageSha256, image.sha256);
  assert.equal(file.printedFooterExact, image.observedPrintedFooter);
  fs.chmodSync(path.join(owner, name), 0o444);
  return {name, file, sha256: sha(fs.readFileSync(path.join(owner, name)))};
});
const cells = plan.addresses.map((address) => {
  const regime = Number(address.argument) < 10 ? plan.ruleUnitProvenance.below10 : plan.ruleUnitProvenance.from10;
  const existing = address.existingIndependentMatches[0];
  const newFile = newCaptures.find((c) => c.file.cells.some((cell) => cell.id === address.id));
  const newCell = newFile?.file.cells.find((cell) => cell.id === address.id);
  assert.equal(Boolean(existing), !Boolean(newCell));
  const raw = existing?.mainCellExact ?? newCell.mainCellExact;
  assert.match(raw, /^\d,\d{3}$/);
  if (newCell) {
    assert.equal(newCell.rowExact, address.row);
    assert.equal(newCell.mainColumnExact, address.mainColumn);
    assert.equal(newCell.correctionColumnExact, null);
    assert.equal(newCell.correctionCellExact, null);
  }
  return {
    id: address.id,
    argumentAddressInferredFromProse: address.argument,
    table: 'IV',
    rowExact: address.row,
    mainColumnExact: address.mainColumn,
    mainCellExact: raw,
    correctionColumnExact: null,
    correctionCellExact: null,
    correctionStatus: 'NOT_REQUIRED_NOT_A_PRINTED_ZERO',
    pdfImage: address.page,
    printedFooterExact: existing?.printedFooter ?? newFile.file.printedFooterExact,
    imagePath: existing?.imagePath ?? path.join(root, newFile.file.sourceImage),
    imageSha256: existing?.imageSha256 ?? newFile.file.sourceImageSha256,
    mainArgumentUnit: regime.mainArgumentUnit,
    correctionArgumentUnit: regime.correctionArgumentUnit,
    rootCorrectionUnit: regime.rootCorrectionUnit,
    mainStringBasis: existing ? 'REUSED_FROZEN_INDEPENDENT_SOURCE_CAPTURE' : 'NEW_LITERAL_SOURCE_PNG_CAPTURE',
    capturePath: existing?.capturePath ?? path.join(owner, newFile.name),
    captureSha256: existing?.captureSha256 ?? newFile.sha256,
    capturePointer: existing?.pointer ?? `#/cells/${newFile.file.cells.indexOf(newCell)}/mainCellExact`,
    priorCaptureRequestId: existing?.oldRequestId ?? null,
    neededBy: address.neededBy,
    sourceRuleProvenance: {
      correctedRules: plan.inputs.find((i) => i.role === 'Corrected Table IV source rules'),
      ruleIds: ['IV-domain-and-precision', 'IV-addition', 'IV-scale', 'IV-over-resolution-and-guard'],
      unitLocator: Number(address.argument) < 10 ? '#/tables/1/grid/below_10' : '#/tables/1/grid/at_or_above_10',
      rootUnitLocator: '#/tables/1/grid/correction_result_unit',
      literalUnitCaptionsInNumericHeaders: false
    },
    computedSquareRootUsedForSourceString: false,
    numericAnswerProduced: false
  };
});
assert.equal(cells.length, 4);
assert.equal(cells.filter((c) => c.mainStringBasis.startsWith('NEW')).length, 3);
assert.equal(cells.filter((c) => c.mainStringBasis.startsWith('REUSED')).length, 1);
assert.ok(cells.every((c) => c.correctionCellExact === null));
const tasks = plan.tasks.map((task) => ({
  ...task,
  lookups: task.arguments.map((argument) => {
    const cell = cells.find((c) => c.argumentAddressInferredFromProse === argument);
    assert.ok(cell);
    return {...cell, neededBy: undefined};
  }),
  sourceLookupCoverage: 'COMPLETE',
  finalDecimalAnswer: null,
  finalPrecisionApproved: false,
  authorComparisonPerformed: false,
  parentOwnsMethodAnswerReview: true
}));
assert.equal(tasks.length, 8);
assert.equal(tasks.reduce((n, t) => n + t.lookups.length, 0), 10);
const source = {
  schema: 'stemrobin182/n41-eight-task-source-only-captures@1',
  ticket: 'STEMROBIN-182',
  status: 'SOURCE_ONLY_LOOKUP_CAPTURE_COMPLETE_FOR_8_TASKS',
  createdAtUtc: new Date().toISOString(),
  checkout: root,
  owner,
  exerciseAuthority: plan.inputs.find((i) => i.role.startsWith('Current n41')),
  addressPlan: {path: path.join(owner, 'address-plan.json'), sha256: '361483bbe3dd68a16242079966224e3f9a244584db6d814968404c37169f7571', frozenBeforeSourceViews: true},
  inputs: plan.inputs,
  distinctCells: cells,
  tasks,
  counts: {
    requestedTasks: 8,
    lookupOccurrences: 10,
    distinctMainCells: 4,
    reusedIndependentMainCells: 1,
    newMainCellsCaptured: 3,
    requestedCorrectionCells: 0,
    inferredSourceStrings: 0,
    newImageLoads: 2,
    imagesPerNeededPage: 1,
    imagesOpenedForExistingCoveredAddresses: 0,
    withinJobReopens: 0,
    crops: 0,
    renders: 0,
    totalImageLoadsInRetainedChatContext: 5,
    candidateValuesRead: 0,
    n41AuthorKeyOrSolutionReads: 0,
    finalNumericAnswersProduced: 0,
    writesOutsideOwner: 0,
    network: 0,
    fullPdfReadsOrRedistribution: 0,
    db: 0,
    paidCalls: 0,
    durableEdits: 0,
    app: 0,
    finalize: 0,
    publish: 0,
    commit: 0
  },
  inferenceBoundary: 'The exact simplifications, conjugate rationalizations and argument addresses are inferred from actual exercise prose. Only the four mainCellExact strings are printed-cell facts, each bound to its independent source capture. No root arithmetic is used to create any source string. Null corrections do not mean a source-printed zero.',
  methodBoundary: 'The prompt does not specify a unique alternate absorbed-factor lookup route. This source package supplies the shared root cells for the standard simplified forms, not a full method/answer verdict.',
  generalRuleProvenance: plan.inputs.find((i) => i.role.startsWith('General rule')),
  precisionBoundary: 'No final rounding or precision is adjudicated. The allowed general rules warn against last-digit guarantees and do not specify a universal table-first sum/product/difference or tie convention. The parent handles author comparison and any subsequent affected review.',
  sourceOnly: true,
  answerApproval: false,
  n40CellAndMethodPass: 'Reused unchanged; no n40 files edited or rerun.',
  stop: true
};
const writeNew = (name, content) => fs.writeFileSync(path.join(owner, name), content, {flag: 'wx', mode: 0o444});
writeNew('source-captures.json', JSON.stringify(source, null, 2) + '\n');
const rows = tasks.map((t) => {
  const refs = t.lookups.map((c) => `N=${c.argumentAddressInferredFromProse}: row ${c.rowExact}, main ${c.mainColumnExact}, exact ${c.mainCellExact}, PDF ${c.pdfImage}/footer ${c.printedFooterExact}, ${c.mainStringBasis.startsWith('REUSED') ? 'reused' : 'new'}`).join('; ');
  return `| ${t.id} | ${t.simplified} | ${refs} | none |`;
});
const report = [
  '# n41 Bounded SOURCE-ONLY Lookup Capture',
  '',
  '**Complete source lookup coverage: eight tasks, four distinct main cells. No answer or candidate approval.**',
  '',
  `Exact checkout: \`${root}\`. New ownership: \`${owner}\`. OFFLINE.`,
  '',
  `Exercise template SHA-256: \`${source.exerciseAuthority.sha256}\`. The supplied current frozen template was read only for 835.c/d/e and 843.a/b/c/d/e. No n41 author keys or solutions were opened.`,
  '',
  '## Tasks And Literal Cells',
  '',
  '| Task | Inferred Exact Simplification | Literal Main Cell / Address / Provenance | Correction |',
  '| --- | --- | --- | --- |',
  ...rows,
  '',
  'Every raw main string uses its full printed decimal comma. The simplifications are inferred algebra, not printed table content or decimal answers.',
  '',
  '## Existing Coverage And New Capture',
  '',
  '- Existing independent `capture-38.json` covers the main root-10 cell: row `10,`, main column `0`, exact `3,162`, printed footer `37`, record `r10`, pointer `#/records_in_request_address_order/0/main`. It covers the root-10 part of 843.b without reopening page 38.',
  '- The independent `capture-33.json` through `capture-40.json` inventory has no exact main-cell address for root 3, 5 or 7. Table III square cells cannot substitute for Table IV root cells. No fourth-digit correction from a different argument is needed or reused.',
  '- Page 36 was opened once for the missing root-3 cell only; printed footer `35` and Table IV identity were verified. Page 37 was opened once for the missing root-5 and root-7 cells; footer `36` was verified at bottom left.',
  '- Each new capture file is write-once and read-only. The root-10 capture is reused with its original independent freeze and hash, not recaptured.',
  '',
  '## Units And Rule Provenance',
  '',
  '- Root 3, 5 and 7: numeric main column step in the argument is `0.01`; right correction-column argument unit is `0.001`.',
  '- Root 10: numeric main column step in the argument is `0.1`; right correction-column argument unit is `0.01`.',
  '- In both regimes, a root-correction integer has unit `0.001`. All four requested roots are exact main-table arguments, so correction column/string is null: no correction cell is needed, and no printed correction column 0 exists.',
  '- Header bands are `N`, main `0` through `9`, correction `1` through `9`, repeated at the bottom. Units are interpretations from row layout and the allowed source rules, not invented literal header captions.',
  '',
  `Corrected Table IV source-rules SHA-256: \`${plan.inputs.find((i) => i.role === 'Corrected Table IV source rules').sha256}\`. Locators: \`tables[1].grid.below_10\`, \`grid.at_or_above_10\`, \`grid.correction_result_unit\`; rules \`IV-domain-and-precision\`, \`IV-addition\`, \`IV-scale\`, \`IV-over-resolution-and-guard\`.`,
  '',
  `General-rules SHA-256: \`${source.generalRuleProvenance.sha256}\`. Their precision, reserve-digit, interpolation and last-digit caveats are reused as textual context only; no final-precision, tie-policy, physical-error or historical-equivalence guarantee is introduced.`,
  '',
  '## Exact Hashes',
  '',
  ...cells.map((c) => `- ${c.id}: capture \`${c.capturePath}\`, SHA-256 \`${c.captureSha256}\`; source image \`${c.imagePath}\`, SHA-256 \`${c.imageSha256}\`.`),
  '',
  `Existing independent freeze SHA-256: \`${plan.inputs.find((i) => i.role === 'Existing independent source-capture freeze').sha256}\`. Existing capture and image-ledger hashes match that freeze. All source/capture/rule/template input hashes are included in the machine package and final receipt.`,
  '',
  '## Boundary And Stop',
  '',
  source.inferenceBoundary,
  '',
  source.methodBoundary,
  '',
  source.precisionBoundary,
  '',
  'Counts: 8 tasks; 10 lookup occurrences; 4 distinct main cells (1 reused, 3 newly captured); 0 requested correction cells; 2 needed full-image loads, one per page; 0 images for already-covered addresses; 0 crops/renders/within-job reopens; 0 n41 author-key/solution reads; 0 numeric answers.',
  '',
  'The context count includes the prior disjoint n40 images: 3 carried + 2 new = 5, below 24. The newly needed page-36 read is counted again; no page is opened twice in this job.',
  '',
  'No network, full-PDF read or redistribution, DB, paid calls, durable/app changes, finalizer, publish or commit. Existing n40 PASS evidence and other workers files remain untouched. Parent owns author comparison and subsequent affected method/answer review. Stop.'
].join('\n') + '\n';
writeNew('source-report.md', report);
fs.chmodSync(path.join(owner, 'image-load-ledger.json'), 0o444);
fs.chmodSync(__filename, 0o444);
const names = ['prepare-source-addresses.cjs', 'address-plan.json', 'address-plan-freeze.json', 'image-load-ledger.json', 'capture-36.json', 'capture-37.json', 'freeze-source-report.cjs', 'source-captures.json', 'source-report.md'];
const files = names.map((name) => {
  const absolute = path.join(owner, name);
  assert.equal(fs.statSync(absolute).mode & 0o222, 0);
  return {name, path: absolute, sha256: sha(fs.readFileSync(absolute)), mode: '0444'};
});
const receipt = {
  schema: 'stemrobin182/n41-source-only-freeze-receipt@1',
  frozenAtUtc: new Date().toISOString(),
  ticket: 'STEMROBIN-182',
  checkout: root,
  owner,
  status: source.status,
  sourceOnly: true,
  files,
  inputBindings: plan.inputs,
  imageBindings: cells.map((c) => ({path: c.imagePath, sha256: c.imageSha256, pdfImage: c.pdfImage, printedFooterExact: c.printedFooterExact, newViewForThisAddress: c.mainStringBasis.startsWith('NEW')})),
  counts: source.counts,
  keysOrSolutionsReadBeforeFreeze: false,
  candidateValuesRead: false,
  answerApproval: false,
  parentOwnsNextStage: true,
  stop: true
};
writeNew('freeze-receipt.json', JSON.stringify(receipt, null, 2) + '\n');
for (const file of files) assert.equal(sha(fs.readFileSync(file.path)), file.sha256);
for (const input of plan.inputs) assert.equal(sha(fs.readFileSync(input.path)), input.sha256);
const receiptPath = path.join(owner, 'freeze-receipt.json');
assert.equal(fs.statSync(receiptPath).mode & 0o222, 0);
console.log(JSON.stringify({
  status: source.status,
  cells: cells.map((c) => ({argument: c.argumentAddressInferredFromProse, row: c.rowExact, mainColumn: c.mainColumnExact, mainCellExact: c.mainCellExact, correctionCellExact: c.correctionCellExact, pdfImage: c.pdfImage, printedFooterExact: c.printedFooterExact, basis: c.mainStringBasis})),
  counts: source.counts,
  files,
  receiptPath,
  receiptSha256: sha(fs.readFileSync(receiptPath)),
  stop: true
}, null, 2));
