import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, relative, read, bytes, bind, hash,
  verify, exists, immutableWrite, walk, lookup, scratch, activePaths,
} from './retain-d016-evidence.mjs';

const [execute, pixelReviewPath] = process.argv.slice(2);
assert.equal(execute, '--execute');
assert.ok(pixelReviewPath);
const tmp = `${ticket}/tmp`;
const card = 'phy9-c2-s4-n111';
const displayPath = `${tmp}/offline-d024/result-${card}.json`;
const originalPixelPath = `${tmp}/d030-n111-pixel-review.json`;
const headingPixelPath = `${tmp}/d030-n111-heading-pixel-review.json`;
const headingRepairPath = `${tmp}/d030-n111-heading-repair/result.json`;
const manifestPath = `${evidence}/reports/d030-n111-retention-manifest.json`;
assert.ok(!await exists(manifestPath));
const display = await read(displayPath);
const pixels = await read(pixelReviewPath);
const originalPixels = await read(originalPixelPath);
const headingPixels = await read(headingPixelPath);
const headingRepair = await read(headingRepairPath);
assert.equal(display.status, 'pass');
assert.equal(pixels.status.toLowerCase(), 'pass');
assert.equal(originalPixels.status, 'fail');
assert.equal(headingPixels.status.toLowerCase(), 'pass');
assert.deepEqual(originalPixels.findings.map(row => row.id), ['PIXEL-1']);
await verify(originalPixelPath, '6ef46a88979ba7fe1e6db44c8b0f166156f52a0c59fc253baa5646a0da842955');
await verify(headingRepairPath, '54eed424a715f59d0c95e38b265be38064b741982bf991caa282c2af133e0489');
await verify(pixels.originalPixelReview.path, pixels.originalPixelReview.sha256);
await verify(pixels.headingPixelReview.path, pixels.headingPixelReview.sha256);
assert.equal(relative(pixels.originalPixelReview.path), originalPixelPath);
assert.equal(relative(pixels.headingPixelReview.path), headingPixelPath);
assert.equal(display.results.length, 4);
const originalIndex = await bytes(indexPath);
const index = JSON.parse(originalIndex);
const retained = [];
const reused = [];
async function retain(file, collection = 'reports', expected, destination) {
  file = relative(file);
  const data = await bytes(file);
  const sha256 = hash(data);
  if (expected) assert.equal(sha256, expected, `Retained input drift: ${file}`);
  const previous = lookup(index, file, sha256);
  if (previous) {
    await verify(previous, sha256);
    reused.push({ path: previous, sha256, originalPath: file });
    return { path: previous, sha256 };
  }
  destination ??= `${evidence}/author-history/d030/n111/inputs/${sha256.slice(0, 16)}-${path.basename(file)}`;
  await immutableWrite(destination, data);
  const row = { path: destination, sha256, originalPath: file, batch: 'D-030',
    deliveryClaim: false };
  const old = index[collection].find(item => item.path === destination);
  if (old) assert.equal(old.sha256, sha256);
  else index[collection].push(row);
  retained.push(row);
  return { path: destination, sha256 };
}
const reports = [
  '9p-n111-prose-freeze.json', '9p-n111-science-review.json',
  '9p-n111-science-effective-review.json', '9p-n111-figure-review.json',
  'd030-n111-figures-author-freeze.json', 'd030-n111-promotion-review.json',
  'd029-approved-pages-crop-review.json', 'd029-source-caption-padding-affected-review.json',
  'd030-n111-offline-tiles.json', 'd030-n111-pixel-review.json',
  'd030-n111-heading-pixel-review.json',
];
for (const name of reports)
  await retain(`${tmp}/${name}`, 'reports', undefined, `${evidence}/reports/${name}`);
for (const file of [displayPath, pixelReviewPath])
  await retain(file, 'reports', undefined, `${evidence}/reports/${path.basename(file)}`);
for (const name of ['d029-n111-source-candidate', 'd029-n111-prose-author',
  'd030-n111-build', 'd030-n111-prose-correction', 'd030-n111-native',
  'd030-n111-layout-repair', 'd030-n111-heading-repair'])
  for (const file of await walk(`${tmp}/${name}`))
    await retain(file, /\.png$/.test(file) ? 'figurePixels' : 'reports', undefined,
      `${evidence}/author-history/d030/n111/${name}/${path.relative(`${tmp}/${name}`, file)}`);
for (const file of await walk('.tmp/STEMROBIN-181/9p-d030-n111-figures'))
  await retain(file, /\.png$/.test(file) ? 'figurePixels' : 'figureFiles', undefined,
    `${evidence}/figures/candidates/9p/9p-d030-n111-figures/${path.relative('.tmp/STEMROBIN-181/9p-d030-n111-figures', file)}`);
for (const page of [273, 274]) {
  const stem = String(page).padStart(4, '0');
  const source = `ssot-resources/soviet10year-textbooks/artifacts/9p/pages/${stem}`;
  for (const name of ['page.md', 'page.json', 'audit.json'])
    await retain(`${source}/${name}`, 'reports', undefined,
      `${evidence}/author-history/d030/n111/source-pages/${stem}/${name}`);
  const image = `.tmp/ld-s10y-lesson/9p/pages/${stem}/page.png`;
  await retain(image, 'sourceCrops', (await read(`${source}/page.json`)).meta.render.sha256,
    `${evidence}/source-pages/9p/${stem}/page.png`);
}
const metadataRebindings = [];
const figureRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures';
for (const id of ['fig-224', 'fig-225', 'fig-226']) {
  const file = `${figureRoot}/${id}.independent-review.json`;
  const before = await bytes(file);
  const current = JSON.parse(before);
  assert.equal(current.status, 'pass');
  const references = [];
  activePaths(current, (owner, key, sha256, trail) =>
    references.push({ owner, key, sha256, trail }));
  const replacements = [];
  for (const reference of references) {
    const original = reference.owner[reference.key];
    if (!scratch(original)) {
      if (reference.sha256) await verify(original, reference.sha256);
      continue;
    }
    const binding = await retain(original, /\.png$/.test(original) ? 'figurePixels' : 'figureFiles',
      reference.sha256);
    reference.owner[reference.key] = binding.path;
    replacements.push({ field: reference.trail, original, retained: binding });
  }
  const reversed = structuredClone(current);
  for (const replacement of replacements) {
    let owner = reversed;
    for (const key of replacement.field.slice(0, -1)) owner = owner[key];
    owner[replacement.field.at(-1)] = replacement.original;
  }
  assert.deepEqual(reversed, JSON.parse(before), 'Only historical reference paths may change.');
  await retain(file, 'reports', hash(before),
    `${evidence}/author-history/d030/n111/${id}-before-durable-paths.independent-review.json`);
  await fs.writeFile(absolute(file), `${JSON.stringify(current, null, 2)}\n`);
  metadataRebindings.push({
    figure: id, current: await bind(file), replacements, mediaOrSpecOrRenderChanges: false,
  });
}
for (const row of display.results) {
  await retain(row.screenshot, 'surfaces', row.screenshotSha256);
  await retain(row.sourceHtml.path, 'reports', row.sourceHtml.sha256);
  if (row.metrics.scrollEndScreenshot)
    await retain(row.metrics.scrollEndScreenshot, 'surfaces', row.metrics.scrollEndScreenshotSha256);
}
const tiles = (await read(`${tmp}/d030-n111-offline-tiles.json`)).tiles;
assert.equal(tiles.length, 8);
assert.equal(originalPixels.tiles.length, tiles.length);
for (const tile of tiles) {
  const reviewed = originalPixels.tiles.find(row => relative(row.path) === relative(tile.path));
  assert.ok(reviewed);
  assert.equal(reviewed.sha256, tile.sha256);
  assert.equal(reviewed.actuallyOpened, true);
  assert.ok(['pass', 'fail'].includes(reviewed.status.toLowerCase()));
  await retain(tile.path, 'surfaces', tile.sha256);
}
assert.equal(headingRepair.headers.length, 4);
assert.equal(headingPixels.headers.length, 4);
for (const header of headingRepair.headers) {
  const reviewed = headingPixels.headers.find(row =>
    relative(row.screenshot.path) === relative(header.screenshot.path));
  assert.ok(reviewed);
  assert.equal(reviewed.screenshot.sha256, header.screenshot.sha256);
  assert.equal(reviewed.actuallyOpened, true);
  assert.equal(reviewed.openCount, 1);
  assert.equal(reviewed.status.toLowerCase(), 'pass');
  await retain(header.screenshot.path, 'surfaces', header.screenshot.sha256);
  await retain(header.sourceHtml.path, 'reports', header.sourceHtml.sha256);
}
await retain(headingRepair.toolAfter.path, 'reports', headingRepair.toolAfter.sha256,
  `${evidence}/author-history/d030/n111/heading-renderer-after.js`);
for (const name of ['finalize-d030-n111.mjs', 'repair-d030-n111-layout-anchors.mjs',
  'retain-d030-n111-evidence.mjs', 'crop-d030-n111-pixels.py', 'promote-d005-figure.mjs',
  'retain-d016-evidence.mjs', 'offline-d024-check.mjs',
  'repair-d030-n111-heading.mjs', 'combine-d030-n111-pixel-evidence.mjs'])
  await retain(`${tmp}/${name}`);
await immutableWrite(manifestPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'exact-evidence-retained-path-only-rebinding',
  display: await bind(displayPath), pixels: await bind(pixelReviewPath),
  originalPixels: await bind(originalPixelPath), headingPixels: await bind(headingPixelPath),
  headingRepair: await bind(headingRepairPath),
  retained, reused, metadataRebindings, sourcePages: [273, 274],
  limits: 'Exact existing evidence retained, including original FAIL and separate repaired-heading PASS. Independent sidecar paths only rebound. Main figure review, spec/SVG/render and lesson bytes unchanged; old HTML retained, new HTML differs only in H1. No new review/native/browser/image run, commit/push, delivery or formalhandoff.',
}, null, 2)}\n`);
index.reports.push({ ...await bind(manifestPath), batch: 'D-030', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), originalIndex);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ manifest: await bind(manifestPath),
  retained: retained.length, reused: reused.length }));
