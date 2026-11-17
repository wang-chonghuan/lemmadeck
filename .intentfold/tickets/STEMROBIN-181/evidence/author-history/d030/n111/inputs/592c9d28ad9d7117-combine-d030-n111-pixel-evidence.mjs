import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite, exists, relative,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const output = `${tmp}/d030-n111-pixel-effective-review.json`;
assert.ok(!await exists(output));
const originalPath = `${tmp}/d030-n111-pixel-review.json`;
const headingPath = `${tmp}/d030-n111-heading-pixel-review.json`;
const repairPath = `${tmp}/d030-n111-heading-repair/result.json`;
await verify(originalPath, '6ef46a88979ba7fe1e6db44c8b0f166156f52a0c59fc253baa5646a0da842955');
await verify(repairPath, '54eed424a715f59d0c95e38b265be38064b741982bf991caa282c2af133e0489');
const original = await read(originalPath);
const heading = await read(headingPath);
const repair = await read(repairPath);
assert.equal(original.status, 'fail');
assert.deepEqual(original.findings.map(row => row.id), ['PIXEL-1']);
assert.equal(heading.status.toLowerCase(), 'pass');
assert.equal(heading.headers.length, 4);
assert.equal(heading.imageOpens, 4);
assert.equal(repair.headers.length, 4);
assert.equal(repair.htmlChanges.length, 2);
for (const change of repair.htmlChanges) {
  assert.equal(change.onlyChangedElement, 'h1');
  for (const binding of [change.before, change.after])
    await verify(binding.path, binding.sha256);
}
for (const row of repair.headers) {
  assert.equal(row.status, 'pass');
  const image = heading.headers.find(item =>
    relative(item.screenshot.path) === relative(row.screenshot.path));
  assert.ok(image);
  assert.equal(image.screenshot.sha256, row.screenshot.sha256);
  assert.equal(image.status.toLowerCase(), 'pass');
  assert.equal(image.actuallyOpened, true);
  assert.equal(image.openCount, 1);
  await verify(image.screenshot.path, image.screenshot.sha256);
}
const bodyKeys = [
  'completeText', 'bodyFormulas', 'emphasis', 'sectionBreaks', 'figures',
  'labelPositions', 'captionPlacement',
];
for (const key of bodyKeys) assert.match(original.displayChecks[key], /^pass:/);
assert.equal(original.tiles.length, 8);
for (const tile of original.tiles) {
  assert.equal(tile.actuallyOpened, true);
  await verify(tile.path, tile.sha256);
}
await immutableWrite(output, `${JSON.stringify({
  schema: 'ld-s10y-lesson/effective-offline-pixel-review@1',
  ticket: 'STEMROBIN-181',
  card: 'phy9-c2-s4-n111',
  status: 'pass',
  originalPixelReview: await bind(originalPath),
  headingPixelReview: await bind(headingPath),
  headingRepair: await bind(repairPath),
  originalTileStatusesUnchanged: original.tiles.map(row => ({
    path: row.path, sha256: row.sha256, status: row.status,
  })),
  bodyChecksReused: Object.fromEntries(bodyKeys.map(key => [key, original.displayChecks[key]])),
  repairedHeadings: repair.headers.map(row => ({
    surface: row.surface, viewport: row.viewport, sourceHtml: row.sourceHtml,
    screenshot: row.screenshot, status: 'pass',
  })),
  findings: [{
    id: 'PIXEL-1', status: 'resolved-by-affected-only-review',
    originalStatus: 'fail', replacementStatus: 'pass',
    scope: 'Four repaired desktop/mobile text/exercise headings only.',
  }],
  imageOpens: 0,
  previousIndependentImageOpens: { originalBodyAndHeading: 8, repairedHeadingOnly: 4 },
  limits: 'Evidence composition only. Reuses unchanged body/figure PASS observations from the original overall FAIL and four independently inspected repaired-heading PASS images. Original tiles and statuses remain unchanged. No new pixel/native/browser/SCI/figure checks, content edits, full-card delivery, DB, commit/push or handoff.',
}, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(output) }));
