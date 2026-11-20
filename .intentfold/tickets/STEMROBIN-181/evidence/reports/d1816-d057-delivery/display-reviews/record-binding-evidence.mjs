import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const T = '.intentfold/tickets/STEMROBIN-181/tmp';
const O = `${T}/d1816-d065-n22-display-review`;
const read = file => JSON.parse(fs.readFileSync(path.resolve(W, file), 'utf8'));
const text = file => fs.readFileSync(path.resolve(W, file), 'utf8');
const bind = file => {
  const absolute = path.resolve(W, file);
  const bytes = fs.readFileSync(absolute);
  return { path: absolute, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
};
const checked = [];
const verify = expected => {
  const actual = bind(expected.path);
  assert.equal(actual.sha256, expected.sha256, actual.path);
  checked.push(actual);
  return actual;
};
const writeEvidence = (name, value) => {
  const file = path.resolve(W, O, name);
  assert.equal(path.dirname(file), path.resolve(W, O));
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};

const baseReview = verify({
  path: `${T}/d1816-d064-source308309-review/report.json`,
  sha256: 'ff9f18dba504c2247fc8bf69418fb12b73b9140661a902920ac45e64446d0d18',
});
const baseFreeze = verify({
  path: `${T}/d1816-d064-source308309-review/review-freeze.json`,
  sha256: '0f7cfa0a09e7d30282cc28bc71a6c2a4eb4e13ad4aa972963f9a9f34ed37fb37',
});
const base = read(baseReview.path);
const freeze = read(baseFreeze.path);
for (const key of ['authorFreeze', 'report', 'imageLedger', 'bindingProof', 'selfGrill', 'mechanicalVerifier']) {
  verify(freeze[key]);
}
const historicalAuthor = bind(`${T}/d1816-d063-source308309-author/author-freeze.json`);
const repairedAuthor = bind(`${T}/d1816-d064-source-period-repair/author-freeze.json`);
const author = read(repairedAuthor.path);
verify(author.originalReview);
const appliedBinding = verify(author.applied);
const applied = read(appliedBinding.path);
verify(applied.originalReview);
for (const image of [...author.sourceImagesAndFigures, ...applied.sourceImagesAndFigures]) verify(image);

const resultBinding = bind(`${T}/d1816-d057-n22-display/result.json`);
const result = read(resultBinding.path);
assert.equal(result.records.length, 4);
const display = result.records.map(row => ({
  id: row.id,
  edition: row.edition,
  locale: row.locale,
  viewport: row.viewport,
  lesson: verify(row.lesson),
  html: verify(row.html),
  screenshot: verify(row.screenshot),
  figureSpecs: row.figureChecks.map(figure => verify(figure.spec)),
}));
assert.deepEqual(display.map(row => `${row.locale}-${row.viewport.name}`),
  ['zh-desktop', 'en-desktop', 'zh-mobile', 'en-mobile']);
const d062Binding = bind(`${T}/d1816-d062-n22-review/review-freeze.json`);
const d062 = read(d062Binding.path);
for (const key of ['report', 'imageLedger', 'bindings', 'reviewNotes']) verify(d062[key]);
for (const item of [...d062.figureReviews, ...d062.reviewerPathBoundRenders]) verify(item);

const source = [];
for (const row of base.records) {
  const page = row.page;
  assert.ok([308, 309].includes(page));
  const repaired = author.records.find(item => item.page === page);
  const application = applied.records.find(item => item.page === page);
  const before = `${T}/d1816-d064-source-period-repair/before/0${page}`;
  const current = `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0${page}`;
  const beforeBindings = {};
  for (const [name, key] of [['page.md', 'pageMd'], ['page.json', 'pageJson'], ['audit.json', 'audit']]) {
    beforeBindings[key] = verify({ path: `${before}/${name}`, sha256: row.boundFiles[key].sha256 });
    const snapshot = application.before.find(item => item.snapshot.path.endsWith(`/${name}`));
    verify(snapshot.snapshot);
    assert.equal(snapshot.original.sha256, row.boundFiles[key].sha256);
    assert.equal(snapshot.snapshot.sha256, row.boundFiles[key].sha256);
    assert.equal(fs.statSync(beforeBindings[key].path).mode & 0o222, 0);
  }
  const oldJson = read(`${before}/page.json`);
  const currentJson = read(`${current}/page.json`);
  const expectedJson = structuredClone(oldJson);
  const oldMdLines = text(`${before}/page.md`).split('\n');
  const expectedMdLines = [...oldMdLines];
  const locations = row.SOURCE.bodyFidelity.periodLocations;
  assert.equal(locations.length, page === 308 ? 16 : 11);
  const observedEdits = [];
  for (const finding of locations) {
    assert.equal(finding.actual, 'U+3002');
    assert.equal(finding.expected, 'U+002E');
    const originalLine = oldJson.blocks[finding.block - 1].lines[finding.blockLine - 1];
    assert.equal(originalLine, finding.text);
    assert.equal(oldMdLines[finding.pageMdLine - 1], originalLine);
    assert.equal([...originalLine][finding.character - 1], '\u3002');
    const jsonChars = [...expectedJson.blocks[finding.block - 1].lines[finding.blockLine - 1]];
    assert.equal(jsonChars[finding.character - 1], '\u3002');
    jsonChars[finding.character - 1] = '.';
    expectedJson.blocks[finding.block - 1].lines[finding.blockLine - 1] = jsonChars.join('');
    const mdChars = [...expectedMdLines[finding.pageMdLine - 1]];
    assert.equal(mdChars[finding.character - 1], '\u3002');
    mdChars[finding.character - 1] = '.';
    expectedMdLines[finding.pageMdLine - 1] = mdChars.join('');
    observedEdits.push({
      block: finding.block, blockLine: finding.blockLine, pageMdLine: finding.pageMdLine,
      character: finding.character, before: 'U+3002', after: 'U+002E',
    });
  }
  assert.deepEqual(currentJson, expectedJson);
  assert.equal(text(`${current}/page.md`), expectedMdLines.join('\n'));
  assert.equal(text(`${current}/audit.json`), text(`${before}/audit.json`));
  const editShape = observedEdits.map(edit => ({
    line: edit.pageMdLine, character: edit.character, before: edit.before, after: edit.after,
  }));
  assert.deepEqual(editShape, repaired.punctuationEdits);
  assert.deepEqual(editShape, application.modifications);
  const currentBindings = {
    pageMd: verify(repaired.pageMd),
    pageJson: verify(repaired.pageJson),
    audit: verify(repaired.audit),
  };
  for (const key of ['sourceImage', 'sourceGrid', 'rawPng', 'rawSvg', 'svgPreview']) {
    currentBindings[key] = verify(row.boundFiles[key]);
  }
  const nativeDir = `${T}/d1816-recovery/native/d064-source${page}-period-only-finalize`;
  const receipt = read(`${nativeDir}/receipt.json`);
  const stdout = text(`${nativeDir}/stdout.txt`);
  assert.equal(receipt.cwd, W);
  assert.equal(receipt.exitCode, 0);
  const audit = read(`${current}/audit.json`);
  assert.equal(audit.lines_printed, page === 308 ? 27 : 19);
  assert.equal(audit.lines_md, audit.lines_printed);
  assert.ok(stdout.includes(`${audit.lines_md} 行（印刷 ${audit.lines_printed}）`));
  source.push({
    page, beforeBindings, currentBindings, observedEdits,
    mdEqualsBeforeWithOnlyExactLocationsChanged: true,
    blocksEqualBeforeWithOnlyExactLocationsChanged: true,
    wholeJsonEqualsBeforeWithOnlyExactLocationsChanged: true,
    auditByteIdentical: true,
    metadataAndBlockStructureUnchanged: true,
    nativeRows: audit.lines_printed,
    writtenRows: audit.lines_md,
    proseBlockRows: currentJson.blocks.filter(block => block.kind === 'p').map(block => block.lines.length),
    cropGeometry: audit.figures,
    counting: currentJson.meta.counting ?? null,
    reusedNativeEvidence: {
      receipt: bind(`${nativeDir}/receipt.json`),
      stdout: bind(`${nativeDir}/stdout.txt`),
      stderr: bind(`${nativeDir}/stderr.txt`),
      rerun: false,
    },
  });
}
assert.equal(source.reduce((sum, row) => sum + row.observedEdits.length, 0), 27);
const authority = base.authority.boundFiles.map(verify);
const comments = read(authority[1].path);
const list = Array.isArray(comments) ? comments : comments.results;
const latest = [...list].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
assert.equal(latest.id, '830251c5-4c6f-48af-9bae-6e3a22118c80');
writeEvidence('binding-evidence.json', {
  schema: 'STEMROBIN-181/scoped-mechanical-bindings@1',
  batch: 'D065', workdir: W, semanticApprovalIssuedByThisScript: false,
  allCheckedHashesMatch: true, checkedBindingCount: checked.length,
  baseReview, baseFreeze, historicalAuthor, repairedAuthor, applied: appliedBinding,
  result: resultBinding, reusedD062Freeze: d062Binding, authority,
  latest179CommentId: latest.id,
  display, source, checkedBindings: checked,
  priorMechanicalAttempts: [
    {
      exitCode: 1,
      error: 'Assertion compared D064 page308 line60 second finding with already-mutated expected MD line.',
      scope: 'Reviewer bookkeeping only; no file writes or native producer call.',
      correction: 'Compare findings against immutable oldMdLines; apply exact positions separately to expectedMdLines.',
      contentVerdict: 'none',
    },
    {
      exitCode: 1,
      error: 'ENOENT at an assumed durable pages/0308/figures/fig-284.png path not present in either author freeze.',
      scope: 'Reviewer added an unbound path assumption; authoritative RAW/SVG paths are the frozen .tmp paths.',
      correction: 'Use exactly D064 and repaired-author sourceImage/sourceGrid/rawPng/rawSvg/svgPreview bindings. No new asset requirement or fallback.',
      contentVerdict: 'none',
    },
  ],
});
console.log(JSON.stringify({
  evidence: bind(`${O}/binding-evidence.json`),
  checkedBindingCount: checked.length,
  exactCodepointChanges: source.map(row => ({ page: row.page, edits: row.observedEdits.length })),
  semanticApprovalIssuedByThisScript: false,
}, null, 2));
