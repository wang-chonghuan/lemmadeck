const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), root);
const base = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11';
const affected = `${base}/display/n34-affected`;
const firstDir = `${base}/display/n34-FIRST`;
const receipts = `${affected}/visual-review-receipts`;
const mode = process.argv[2];
assert.ok(['pre', 'post'].includes(mode));
const files = new Map();

function absolute(file) {
  const resolved = path.resolve(root, file);
  assert.ok(resolved.startsWith(`${root}/`), `Outside sole checkout: ${file}`);
  return resolved;
}

function bind(file, expected) {
  const bytes = fs.readFileSync(absolute(file));
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (expected) assert.equal(sha256, expected, `Hash mismatch: ${file}`);
  const entry = { path: file, sha256 };
  files.set(file, entry);
  return entry;
}

function json(file) {
  bind(file);
  return JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
}

function write(name, value) {
  fs.writeFileSync(absolute(`${receipts}/${name}`), `${JSON.stringify(value, null, 2)}\n`);
}

const resultPath = `${affected}/result.json`;
const result = json(resultPath);
assert.equal(result.cwd, root);
assert.equal(result.status, 'pass');
assert.equal(result.checks.length, 4);
assert.deepEqual(result.checks.map(c => `${c.surface}-${c.viewport.width}`),
  ['text-1440', 'exercises-1440', 'text-390', 'exercises-390']);
const repairPath = `${base}/alg7-c4-s1-n34-display-repair.json`;
const repair = json(repairPath);
assert.equal(repair.sourceFilesUnchanged, true);
assert.equal(repair.paragraphExerciseFigureCaptionBytesUnchangedInDOM, true);
const firstPath = `${firstDir}/visual-review.json`;
const first = json(firstPath);
assert.equal(first.status, 'revise');
bind(`${firstDir}/visual-review.md`);
bind(first.existingMechanicalEvidence.path, first.existingMechanicalEvidence.sha256);
const screenshots = result.checks.map(check => {
  assert.equal(check.layout.rootOverflow, 0);
  assert.ok(check.layout.scrolls.every(scroll => scroll.reachable));
  assert.deepEqual(check.consoleErrors, []);
  bind(check.html.path, check.html.sha256);
  const entry = bind(check.screenshot.path, check.screenshot.sha256);
  const header = fs.readFileSync(absolute(entry.path)).subarray(0, 24);
  assert.equal(header.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(header.subarray(12, 16).toString('ascii'), 'IHDR');
  return {
    id: `${check.surface}-${check.viewport.width}`,
    ...entry,
    viewport: check.viewport,
    pngDimensions: { width: header.readUInt32BE(16), height: header.readUInt32BE(20) },
    html: check.html,
    currentHashMatchesResult: true,
  };
});
for (const change of repair.changes) {
  bind(change.input.path, change.input.sha256);
  bind(change.output.path, change.output.sha256);
}
const sources = repair.sources.map(source => ({
  ...bind(source.path, source.sha256), matchesRepairReceipt: true,
}));
bind(repair.inheritedChoices.path, repair.inheritedChoices.sha256);
const choices = first.screenshots.filter(s => s.surface === 'choices').map(s => {
  assert.equal(s.status, 'pass');
  bind(s.html.path, s.html.sha256);
  return {
    id: s.id, status: s.status, ...bind(s.path, s.sha256),
    html: s.html, hashesCurrent: true, openCount: 0, inheritedFrom: firstPath,
  };
});
assert.equal(choices.length, 2);
const approvalPath = first.inheritedFigureScope.approvalBinding;
const approval = json(approvalPath);
bind(approvalPath, first.inheritedFigureScope.sha256);
assert.equal(approval.status, 'pass');
for (const report of approval.reports) bind(report.path, report.sha256);
const roles = ['source', 'spec', 'render', 'svg', 'preview'];
const figures = approval.figures.map(figure => {
  assert.equal(figure.status, 'pass');
  for (const role of roles) bind(figure[role].path, figure[role].sha256);
  return { id: figure.id, status: figure.status, svgSha256: figure.svg.sha256,
    allFiveAssetBindingsMatch: true, imageOpens: 0 };
});
assert.equal(figures.length, 8);
const now = new Date().toISOString();
if (mode === 'pre') {
  assert.ok(!fs.existsSync(absolute(`${receipts}/pre-open-hashes.json`)));
  write('pre-open-hashes.json', {
    schema: 'offline-display/affected-pre-open-hashes@1', recordedAt: now,
    cwd: root, status: 'pass', result: files.get(resultPath),
    repair: files.get(repairPath), firstReview: files.get(firstPath),
    screenshots, evidenceFiles: [...files.values()],
    imageLoadsDuringHashing: 0, browserRendererDomRuns: 0,
  });
  write('inherited-bindings.json', {
    schema: 'offline-display/affected-inherited-bindings@1', recordedAt: now,
    cwd: root, status: 'pass', firstReview: files.get(firstPath),
    firstStatusPreserved: 'revise', choices,
    approval: files.get(approvalPath), reports: approval.reports, figures,
    assetRolesComparedPerFigure: roles, assetBindingComparisons: 40,
    reportHashComparisons: 3, sources, sourceHashComparisons: 7,
    sourceBytesCurrent: true, allBindingsMatch: true,
    paragraphFormulaSvgPreservationBasis: 'Parent repair receipt; no new DOM derivation or formula/paragraph extraction in reviewer.',
    newlyApprovedMathematicalOrLabelScope: false, inheritedImageOpens: 0,
  });
  console.log(JSON.stringify({ status: 'pass', screenshots, evidenceFiles: files.size,
    inheritedChoices: 2, inheritedFigureAssets: 40, sources: 7 }, null, 2));
} else {
  const pre = json(`${receipts}/pre-open-hashes.json`);
  for (const file of pre.evidenceFiles) bind(file.path, file.sha256);
  const review = json(`${affected}/visual-review.json`);
  assert.equal(review.schema, first.schema);
  assert.equal(review.screenshots.length, 4);
  for (const screenshot of review.screenshots) {
    bind(screenshot.path, screenshot.sha256);
    assert.equal(screenshot.openCount, 1);
  }
  const expectedImages = review.imageCounts.fullpageOpens + review.imageCounts.crops;
  assert.equal(review.imageCounts.fullpageOpens, 4);
  assert.equal(review.imageCounts.reopens, 0);
  assert.ok(expectedImages <= 6);
  assert.equal(review.imageCounts.totalContextImages, expectedImages);
  const ledger = json(`${receipts}/image-load-ledger.json`);
  assert.deepEqual(ledger.imageCounts, review.imageCounts);
  assert.equal(ledger.images.length, expectedImages);
  for (const image of ledger.images) {
    bind(image.path, image.sha256);
    assert.equal(image.openCount, 1);
  }
  for (const crop of review.crops) bind(crop.path, crop.sha256);
  const inherited = json(`${receipts}/inherited-bindings.json`);
  assert.equal(inherited.allBindingsMatch, true);
  assert.deepEqual(inherited.choices.map(c => c.sha256), choices.map(c => c.sha256));
  const statuses = review.screenshots.map(s => s.status);
  const aggregate = statuses.includes('blocked') ? 'blocked'
    : statuses.includes('revise') ? 'revise' : 'pass';
  assert.equal(review.status, aggregate);
  const reportHashes = ['visual-review.json', 'visual-review.md'].map(name =>
    bind(`${affected}/${name}`));
  write('final-verification.json', {
    schema: 'offline-display/affected-final-verification@1', verifiedAt: now,
    cwd: root, verificationStatus: 'pass', visualGateStatus: review.status,
    allEvidenceHashesUnchanged: true, firstReviewPreserved: files.get(firstPath),
    firstStatusPreserved: 'revise', result: files.get(resultPath),
    repair: files.get(repairPath), screenshots,
    inheritedChoicesCurrent: choices, inheritedAssetHashComparisons: 40,
    inheritedReportHashComparisons: 3, sourceHashComparisons: 7,
    reportHashes, imageCounts: review.imageCounts,
    imagesLoadedByVerification: 0, browserRendererDomRuns: 0,
    networkOperations: 0, gitOperations: 0,
  });
  console.log(JSON.stringify({ status: review.status, reportHashes,
    imageCounts: review.imageCounts, allEvidenceHashesUnchanged: true }, null, 2));
}
