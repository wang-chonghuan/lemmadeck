import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ownRoot = fs.realpathSync(path.dirname(fileURLToPath(import.meta.url)));
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const assignedRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-review-01');
assert.equal(ownRoot, assignedRoot);
const inputRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-review-inputs-01');
const manifestPath = path.join(inputRoot, 'manifest.json');
const manifestHash = 'ea9ccc655b70bcfc4574a2a936c86af1a96b75c9057e375f890a4aa53dcdec43';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const record = p => {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: digest(bytes), bytes: bytes.length };
};
const ownPath = relative => {
  assert.ok(!path.isAbsolute(relative) && relative !== '');
  const resolved = path.resolve(ownRoot, relative);
  assert.ok(resolved.startsWith(ownRoot + path.sep), `Outside own root: ${relative}`);
  if (fs.existsSync(resolved)) {
    assert.ok(fs.realpathSync(resolved).startsWith(ownRoot + path.sep), `Symlink outside root: ${relative}`);
    assert.ok(fs.statSync(resolved).isFile(), `Not a file: ${relative}`);
  }
  return resolved;
};
const writeJSON = (relative, data) => {
  fs.writeFileSync(ownPath(relative), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
const listOwnFiles = () => {
  const walk = (directory, prefix = '') => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const relative = prefix + entry.name;
      assert.ok(!entry.isSymbolicLink(), `Unexpected symlink: ${relative}`);
      if (entry.isDirectory()) return walk(path.join(directory, entry.name), relative + '/');
      ownPath(relative);
      return [relative];
    });
  return walk(ownRoot).filter(p => p !== 'output-index.json').sort();
};

// This utility hashes artifacts only. It imports no producer/validator and launches no process.
const mode = process.argv[2];
if (mode === 'after') {
  assert.equal(record(manifestPath).sha256, manifestHash);
  const manifest = readJSON(manifestPath);
  const bindings = manifest.bindings.map(expected => {
    assert.ok(fs.realpathSync(expected.path).startsWith(repo + path.sep));
    const actual = record(expected.path);
    return { ...actual, expectedSha256: expected.sha256, match: actual.sha256 === expected.sha256 };
  });
  const before = readJSON(ownPath('bindings-before.json'));
  const seals = readJSON(ownPath('FIRST-seal-receipt.json')).sealed.map(expected => {
    const actual = record(ownPath(expected.path));
    const actualMode = (fs.statSync(actual.path).mode & 0o777).toString(8).padStart(4, '0');
    return {
      ...actual,
      path: expected.path,
      actualMode,
      expectedSha256: expected.sha256,
      expectedBytes: expected.bytes,
      match: actual.sha256 === expected.sha256 && actual.bytes === expected.bytes && actualMode === '0444'
    };
  });
  const authorBefore = readJSON(path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n62-fig8990-author/bindings-before.json'));
  const primaryPaths = new Set(bindings.map(b => b.path));
  const supplemental = authorBefore.outputs
    .map(b => ({ ...b, path: path.resolve(repo, b.path) }))
    .filter(b => !primaryPaths.has(b.path))
    .map(expected => {
      const actual = record(expected.path);
      return { ...actual, expectedSha256: expected.expectedSha256, match: actual.sha256 === expected.expectedSha256 };
    });
  const contracts = [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md'
  ].map(relative => record(path.join(repo, relative)));
  const failures = [...bindings, ...supplemental, ...seals].filter(b => !b.match);
  const receipt = {
    schema: 'independent-review-binding-verification@1',
    phase: 'after-content-visual-review-before-index',
    observedAt: new Date().toISOString(),
    manifest: record(manifestPath),
    beforeToolReceipt: before.toolReceipt,
    primaryBeforeCount: before.count,
    primaryAfterCount: bindings.length,
    primaryBeforeAllMatched: before.allMatch,
    primaryAfterAllMatched: bindings.every(b => b.match),
    primaryBeforeAfterUnchanged: before.allMatch && bindings.length === before.count && bindings.every(b => b.match),
    bindings,
    supplementalPreviouslyReadAuthorBindings: supplemental,
    supplementalScope: 'Verified now; no claim these were included in the 95-path independent BEFORE check. Legacy SVGs are hash-only, not opened or reused.',
    independentFIRSTSeals: seals,
    contractsRead: contracts,
    failures,
    nativeValidatorOrRenderOrFlowInvoked: false,
    allMatch: failures.length === 0
  };
  writeJSON('bindings-after.json', receipt);
  console.log(JSON.stringify({
    path: ownPath('bindings-after.json'),
    primaryCount: bindings.length,
    supplementalCount: supplemental.length,
    allMatch: receipt.allMatch,
    sealsMatch: seals.every(b => b.match),
    failures
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} else if (mode === 'index') {
  const outputs = listOwnFiles().map(relative => {
    const actual = record(ownPath(relative));
    return { path: relative, sha256: actual.sha256, bytes: actual.bytes };
  });
  writeJSON('output-index.json', {
    schema: 'independent-review-output-index@1',
    root: ownRoot,
    pathBase: 'exact-own-output-root-relative',
    outputs,
    excludesSelf: true,
    entriesResolveInsideOwnRoot: true
  });
  console.log(JSON.stringify(record(ownPath('output-index.json')), null, 2));
} else if (mode === 'verify') {
  const index = readJSON(ownPath('output-index.json'));
  assert.equal(index.root, ownRoot);
  assert.deepEqual(index.outputs.map(o => o.path).sort(), listOwnFiles());
  for (const expected of index.outputs) {
    const actual = record(ownPath(expected.path));
    assert.equal(actual.sha256, expected.sha256, expected.path);
    assert.equal(actual.bytes, expected.bytes, expected.path);
  }
  const after = readJSON(ownPath('bindings-after.json'));
  assert.equal(after.allMatch, true);
  for (const expected of [...after.bindings, ...after.supplementalPreviouslyReadAuthorBindings]) {
    assert.equal(record(expected.path).sha256, expected.sha256, expected.path);
  }
  for (const seal of after.independentFIRSTSeals) {
    const p = ownPath(seal.path);
    assert.equal(record(p).sha256, seal.sha256);
    assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  }
  const report = readJSON(ownPath('report.json'));
  assert.equal(report.figures.length, 2);
  for (const figure of report.figures) {
    const review = readJSON(ownPath(figure.reviewReceipt));
    const slot = readJSON(manifestPath).figures.find(f => f.id === figure.id);
    assert.equal(review.source.sha256, slot.source.sourceImage.sha256);
    assert.equal(review.spec.sha256, slot.current.spec.sha256);
    assert.equal(review.render.sha256, slot.current.render.sha256);
    assert.equal(review.outputs.svg.sha256, slot.current.svg.sha256);
    assert.equal(review.contactSheet.sha256, slot.current.image.sha256);
    assert.equal(review.status, 'pass');
    assert.equal(review.promotionApproved, false);
    assert.equal(review.integrationApproved, false);
    assert.equal(figure.remainingRepairs, 0);
  }
  assert.equal(readJSON(ownPath('image-ledger.json')).counts.batchImageUnits, 6);
  console.log(JSON.stringify({
    status: 'OUTPUT_INDEX_AND_BINDINGS_VERIFIED',
    outputs: index.outputs.length,
    entriesResolveInsideOwnRoot: true,
    excludesSelf: true,
    exhaustive: true,
    primaryBindingsUnchanged: after.bindings.length,
    supplementalBindingsUnchanged: after.supplementalPreviouslyReadAuthorBindings.length,
    independentFIRSTsStill0444: true,
    reviewReceiptHashesMatchCurrentManifest: true,
    nativeValidatorOrRenderOrFlowInvoked: false,
    index: record(ownPath('output-index.json'))
  }, null, 2));
} else {
  throw new Error('Expected after, index, or verify');
}
