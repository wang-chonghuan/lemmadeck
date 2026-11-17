import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const authorRoot = path.join(workspace, 'tmp/d040-10p-source104-107-author');
const evidenceRoot = path.dirname(import.meta.filename);
const expectedEvidenceRoot = path.join(
  workspace,
  '.intentfold/tickets/STEMROBIN-181/tmp/d040-10p-source104-107-review-evidence',
);
assert.equal(evidenceRoot, expectedEvidenceRoot);
const freezePath = path.join(authorRoot, 'author-freeze.json');
const freezeSha256 = '3923b7e3391d79c2b0da5e9238a8be99b234cf713bcf196686f5f33bef0b0b46';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: digest(bytes), bytes: bytes.length };
};
assert.equal(bind(freezePath).sha256, freezeSha256);
const freeze = read(freezePath);
const inputBindings = read(path.join(authorRoot, 'input-bindings.json'));
assert.equal(freeze.cwd, workspace);
assert.equal(freeze.ticket, 'STEMROBIN-181');
assert.deepEqual(freeze.pages, [104, 105, 106, 107]);
assert.deepEqual(freeze.printedPages, [94, 95, 96, 97]);

const groups = Object.entries({
  artifacts: freeze.artifacts,
  prepared: freeze.prepared,
  inputs: inputBindings.inputs,
}).map(([group, entries]) => ({
  group,
  status: 'PASS',
  count: entries.length,
  bindings: entries.map(expected => {
    const actual = bind(path.resolve(workspace, expected.path));
    assert.equal(actual.sha256, expected.sha256, `Hash drift: ${actual.path}`);
    assert.equal(actual.bytes, expected.bytes, `Size drift: ${actual.path}`);
    return { ...actual, status: 'PASS' };
  }),
}));

const pdfBinding = inputBindings.inputs.find(item => item.path.endsWith('.pdf'));
assert(pdfBinding);
const pdfPath = path.resolve(workspace, pdfBinding.path);
const lineage = freeze.pages.map(physicalPage => {
  const stem = String(physicalPage).padStart(4, '0');
  const pagePath = path.join(workspace, '.tmp/ld-s10y-lesson/10p/pages', stem, 'page.png');
  const nativePageRoot = path.join(authorRoot, 'native/10p/pages', stem);
  const nativeWorkRoot = path.join(authorRoot, 'native-work/10p/pages', stem);
  const page = fs.readFileSync(pagePath);
  const native = read(path.join(nativePageRoot, 'page.json'));
  const audit = read(path.join(nativePageRoot, 'audit.json'));
  assert.equal(native.meta.page, physicalPage);
  assert.equal(native.meta.printed_page, physicalPage - 10);
  assert.equal(native.meta.source.pdf_page, physicalPage);
  assert.equal(native.meta.source.pdf_sha256, pdfBinding.sha256);
  assert.equal(native.meta.render.sha256, digest(page));
  assert.equal(native.meta.render.dpi, 300);
  assert.equal(native.meta.render.w, page.readUInt32BE(16));
  assert.equal(native.meta.render.h, page.readUInt32BE(20));
  assert(page.equals(fs.readFileSync(path.join(nativeWorkRoot, 'page.png'))));

  // Regenerate only into memory, never replacing the reviewed frozen page paths.
  const command = [
    'pdftoppm', '-png', '-r', '300',
    '-f', String(physicalPage), '-l', String(physicalPage), pdfPath,
  ];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: workspace,
    timeout: 60000,
    maxBuffer: 16 * 1024 * 1024,
  });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
  assert(page.equals(result.stdout), `Original PDF render mismatch: ${physicalPage}`);
  return {
    physicalPage,
    printedPage: physicalPage - 10,
    status: 'PASS',
    sourcePage: bind(pagePath),
    candidateMarkdown: bind(path.join(authorRoot, 'candidate/10p/pages', stem, 'page.md')),
    nativeMarkdown: bind(path.join(nativePageRoot, 'page.md')),
    nativeJson: bind(path.join(nativePageRoot, 'page.json')),
    nativeAudit: bind(path.join(nativePageRoot, 'audit.json')),
    nativeWorkPageEqualsOriginal: true,
    originalPdfRender: {
      command,
      exitCode: result.status,
      signal: result.signal,
      stderr: result.stderr.toString('utf8'),
      outputSha256: digest(result.stdout),
      byteIdenticalToReviewedPath: true,
      outputPersisted: false,
      loadedIntoVisualContext: false,
    },
    countingOverridePresent: Object.hasOwn(native.meta, 'counting'),
    rawFigures: audit.figures.map(figure => ({
      id: figure.id,
      snappedBox: figure.box,
      defaultPaddingPx: 12,
      binding: bind(path.join(nativeWorkRoot, 'figures', `${figure.id}.png`)),
    })),
  };
});

// Recheck after rendering so the receipt cannot silently bind changed inputs.
for (const group of groups) {
  for (const expected of group.bindings) {
    assert.deepEqual(bind(expected.path), {
      path: expected.path,
      sha256: expected.sha256,
      bytes: expected.bytes,
    });
  }
}
assert.equal(bind(freezePath).sha256, freezeSha256);
const receipt = {
  schema: 'ld-s10y-source-binding-verification@1',
  ticket: 'STEMROBIN-181',
  verifiedAt: new Date().toISOString(),
  status: 'PASS',
  freeze: bind(freezePath),
  verifier: bind(import.meta.filename),
  groups,
  lineage,
  totalFrozenEntriesChecked: groups.reduce((sum, group) => sum + group.count, 0),
  additionalImagesLoadedIntoVisualContext: 0,
  authorFilesWritten: false,
  canonicalFilesWritten: false,
  nativeFinalizeRerun: false,
  sourceVisualVerdictsDerivedFromNativeStatus: false,
};
const output = path.join(evidenceRoot, 'binding-verification.json');
fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: receipt.status,
  frozenEntriesChecked: receipt.totalFrozenEntriesChecked,
  originalPdfPagesByteVerified: lineage.length,
  output: bind(output),
}));
