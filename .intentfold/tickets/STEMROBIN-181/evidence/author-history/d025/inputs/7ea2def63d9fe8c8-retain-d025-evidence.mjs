import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash, verify,
  exists, immutableWrite, walk, lookup, scratch, activePaths,
} from './retain-d016-evidence.mjs';

const [execute, displayPath, pixelReviewPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
const tmp = `${ticket}/tmp`;
const manifestPath = `${evidence}/reports/d025-retention-manifest.json`;
assert.ok(!await exists(manifestPath));
const originalIndex = await bytes(indexPath);
const index = JSON.parse(originalIndex);
const retained = [];
const reused = [];
const metadataRebindings = [];
async function retain(file, collection = 'reports', expected, destination, alias) {
  file = relative(file);
  const data = await bytes(file);
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected, `Retained input drift: ${file}`);
  const previous = lookup(index, alias ?? file, sha256) ?? lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: alias ?? file });
    return { path: previous, sha256 };
  }
  destination ??= `${evidence}/author-history/d025/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  assert.ok(destination.startsWith(`${evidence}/`));
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: alias ?? file, batch: 'D-025' };
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
  return { path: destination, sha256 };
}
const meter = await read(`${ticket}/production-meter.json`);
const sourcePaths = meter.currentCheckpoint.nextBatch.sourceEvidence.map(row => row.path);
const reports = [
  ...sourcePaths,
  `${tmp}/d025-10p-n5-readiness.json`, `${tmp}/d025-10p-n5-science-review.json`,
  `${tmp}/9p-n101-prose-freeze.json`, `${tmp}/9p-n105-prose-freeze.json`,
  `${tmp}/9p-n101-science-review.json`, `${tmp}/9p-n105-science-review.json`,
  `${tmp}/9p-n105-science-effective-review.json`,
  `${tmp}/9p-n105-prose-native-layout-correction.json`,
  `${tmp}/9p-n101-figure-review.json`, `${tmp}/9p-n101-figure-effective-review.json`,
  `${tmp}/d025-n101-context-rebind.json`, `${tmp}/9p-n105-figure-review.json`,
  `${tmp}/9p-n105-figure-effective-review.json`,
  `${tmp}/d026-n101-figures-author-freeze.json`, `${tmp}/d026-n102-figures-author-freeze.json`,
  `${tmp}/9p-n102-prose-freeze.json`, `${tmp}/9p-n102-science-review.json`,
  `${tmp}/d025-n102-figure-hold.json`,
  `${tmp}/10p-n19-prose-freeze.json`, `${tmp}/10p-n19-science-review.json`,
  `${tmp}/d025-10p-n19-figure-source-hold.json`,
  `${tmp}/d025-101-native/result.json`, `${tmp}/d025-105-native/result.json`,
  `${tmp}/d025-pixel-review-n101-desktop.json`, `${tmp}/d025-pixel-review-n101-mobile.json`,
  `${tmp}/d025-pixel-review-n105.json`,
  `${tmp}/d025-offline-tiles.json`, displayPath, pixelReviewPath,
];
for (const file of reports) await bytes(file);
for (const file of reports) {
  const name = ['result.json', 'report.json'].includes(path.basename(file))
    ? `${path.basename(path.dirname(file))}-${path.basename(file)}` : path.basename(file);
  await retain(file, 'reports', undefined, `${evidence}/reports/${name}`);
}
const layoutCorrection = await read(`${tmp}/9p-n105-prose-native-layout-correction.json`);
await retain(layoutCorrection.flow.path, 'reports', layoutCorrection.flow.sha256);
await retain(`${tmp}/d027-n105-prose-author/author-notes.md`);
const sourcePages = [];
for (const file of sourcePaths) {
  const receipt = await read(file);
  for (const page of receipt.pages ?? []) {
    assert.ok(page.outputs && page.source && page.review);
    sourcePages.push(page.page);
    await retain(page.review.path, 'reports', page.review.sha256);
    await retain(page.candidate.path, 'reports', page.candidate.sha256);
    await retain(page.source.path, 'sourceCrops', page.source.sha256,
      `${evidence}/source-pages/9p/${String(page.page).padStart(4, '0')}/page.png`);
    for (const key of ['finalize', 'vectorize']) {
      if (page[key]) await retain(page[key].path, 'reports', page[key].sha256);
    }
  }
}
for (const number of ['101', '105']) {
  const freeze = await read(`${tmp}/9p-n${number}-prose-freeze.json`);
  for (const row of freeze.snapshots ?? []) {
    await retain(row.path, 'reports', row.sha256, undefined, row.originalPath);
  }
  const nativeFolder = `${tmp}/d025-${number}-native`;
  const start = await read(`${nativeFolder}/started.json`);
  for (const row of start.consumedBindings ?? []) {
    await retain(row.path, 'reports', row.sha256, undefined, row.originalPath);
  }
  for (const file of await walk(nativeFolder)) await retain(file);
  const effectiveGate = `${tmp}/9p-n${number}-figure-effective-review.json`;
  const originalGate = await exists(effectiveGate)
    ? effectiveGate : `${tmp}/9p-n${number}-figure-review.json`;
  const gate = await read(originalGate);
  assert.equal(gate.status, 'pass');
  for (const row of gate.figures) {
    const figureRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
    const renderFile = `${figureRoot}/${row.id}.render.json`;
    const reviewFile = `${figureRoot}/${row.id}.review.json`;
    const renderBefore = await bytes(renderFile);
    const render = JSON.parse(renderBefore);
    const renderReferences = [];
    activePaths(render, (owner, key, sha256, trail) =>
      renderReferences.push({ owner, key, sha256, trail }));
    const renderReplacements = [];
    for (const reference of renderReferences) {
      const original = reference.owner[reference.key];
      if (!scratch(original)) {
        if (reference.sha256) await verify(original, reference.sha256);
        continue;
      }
      const binding = await retain(original, 'figureFiles', reference.sha256);
      reference.owner[reference.key] = binding.path;
      renderReplacements.push({ field: reference.trail, original, retained: binding });
    }
    const renderReversed = structuredClone(render);
    for (const replacement of renderReplacements) {
      let owner = renderReversed;
      for (const key of replacement.field.slice(0, -1)) owner = owner[key];
      owner[replacement.field.at(-1)] = replacement.original;
    }
    assert.deepEqual(renderReversed, JSON.parse(renderBefore));
    if (renderReplacements.length) {
      await retain(renderFile, 'reports', hash(renderBefore),
        `${evidence}/author-history/d025/${row.id}-before-durable-paths.render.json`);
      await retain(reviewFile, 'reports', undefined,
        `${evidence}/author-history/d025/${row.id}-before-durable-paths.review.json`);
      await fs.writeFile(absolute(renderFile), `${JSON.stringify(render, null, 2)}\n`);
      execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
        '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
        '--spec', `${figureRoot}/${row.id}.spec.json`, '--render', renderFile,
        '--output', reviewFile, '--status', 'pass',
        '--notes', 'Existing independent current-context/source/pixel PASS reused. Only retained historical evidence paths changed; spec/SVG/HTML unchanged. Native hash refresh is not a new visual gate or render.',
      ], { stdio: 'pipe', encoding: 'utf8' });
      metadataRebindings.push({
        figure: row.id, beforeRenderSha256: hash(renderBefore),
        render: await bind(renderFile), review: await bind(reviewFile),
        pathReplacements: renderReplacements, newRenderOrPixelGate: false,
      });
    }
    const durable = `${figureRoot}/${row.id}.independent-review.json`;
    const before = await bytes(durable);
    const current = JSON.parse(before);
    assert.equal(current.status, 'pass');
    const references = [];
    activePaths(current, (owner, key, sha256, trail) => references.push({ owner, key, sha256, trail }));
    const replacements = [];
    for (const reference of references) {
      const original = reference.owner[reference.key];
      if (!scratch(original)) {
        if (reference.sha256) await verify(original, reference.sha256);
        continue;
      }
      const binding = await retain(original, /\.png$/.test(original) ? 'figurePixels' : 'figureFiles', reference.sha256);
      reference.owner[reference.key] = binding.path;
      replacements.push({ field: reference.trail, original, retained: binding });
    }
    const reversed = structuredClone(current);
    for (const replacement of replacements) {
      let owner = reversed;
      for (const key of replacement.field.slice(0, -1)) owner = owner[key];
      owner[replacement.field.at(-1)] = replacement.original;
    }
    assert.deepEqual(reversed, JSON.parse(before), 'Only review path rebinding is allowed.');
    await retain(durable, 'reports', hash(before),
      `${evidence}/author-history/d025/${row.id}-before-durable-paths.independent-review.json`);
    if (replacements.length) {
      await fs.writeFile(absolute(durable), `${JSON.stringify(current, null, 2)}\n`);
    }
    row.durableReview = await bind(durable);
    row.pathReplacements = replacements;
  }
  await retain(originalGate, 'reports', undefined, `${evidence}/reports/${path.basename(originalGate)}`);
}
const display = await read(displayPath);
assert.equal(display.status, 'pass');
const pixels = await read(pixelReviewPath);
assert.equal(pixels.status, 'pass');
for (const row of display.results) {
  await retain(row.screenshot, 'surfaces', row.screenshotSha256);
  await retain(row.sourceHtml.path, 'reports', row.sourceHtml.sha256);
  if (row.metrics.scrollEndScreenshot) {
    await retain(row.metrics.scrollEndScreenshot, 'surfaces', row.metrics.scrollEndScreenshotSha256);
  }
}
for (const tile of pixels.tiles) {
  assert.equal(tile.actuallyOpened, true);
  await retain(tile.path, 'surfaces', tile.sha256);
}
const helpers = ['finalize-d025-card.mjs', 'retain-d025-evidence.mjs',
  'crop-d025-pixels.py', 'stage-d025.mjs', 'record-d025-push.mjs',
  'rebind-d025-n101-context.mjs', 'record-d025-n102-hold.mjs', 'complete-d025.mjs',
  'record-d025-n105-no-figures.mjs', 'complete-d025-post-push.mjs',
  'record-d025-n105-science.mjs', 'repair-d025-n105-native-layout.mjs',
  'recover-d025-n105-native.mjs', 'combine-d025-pixel-reviews.mjs'];
for (const name of helpers) await retain(`${tmp}/${name}`);
const manifest = {
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'exact-evidence-retained-path-only-rebinding',
  cards: ['phy10-c1-s2-n5', 'phy9-c2-s4-n101', 'phy9-c2-s4-n105'],
  sourcePages: [...new Set(sourcePages)].sort((a, b) => a - b),
  display: await bind(displayPath), pixels: await bind(pixelReviewPath), retained, reused,
  metadataRebindings,
  limits: 'Byte retention and render/independent-review path rebinding only, with native review hashes refreshed. Historical scratch paths inside verbatim reports are provenance. No historical skill retention expansion, substantive review/native-finalize/render/browser replay or media/spec mutation.',
};
await immutableWrite(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-025' });
assert.deepEqual(await bytes(indexPath), originalIndex, 'Concurrent shared-index update.');
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length, sourcePages: manifest.sourcePages }));
