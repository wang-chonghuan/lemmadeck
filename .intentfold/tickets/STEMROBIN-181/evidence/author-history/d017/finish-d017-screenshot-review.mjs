import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const read = async path => JSON.parse(await fs.readFile(path, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const manifestPath = `${work}/offline-d017/d017-screenshot-tiles.json`;
const manifest = await read(manifestPath);
const result = await read(manifest.result.path);
const mainPath = `${work}/d017-main-screenshot-review.json`;
const agentPath = `${work}/d017-n59-screenshot-review.json`;
const main = await read(mainPath);
const agent = await read(agentPath);
assert.equal(main.status, 'pass');
assert.equal(agent.status, 'pass');
assert.equal(agent.manifest.sha256, (await bind(manifestPath)).sha256);
assert.equal(agent.existingOfflineResultBinding.sha256, manifest.result.sha256);
const relative = file => path.relative(process.cwd(), path.resolve(file));
const agentTiles = agent.tiles.map(tile => {
  const original = manifest.tiles.find(item => relative(item.path) === relative(tile.path));
  assert.ok(original);
  assert.equal(tile.sha256, original.sha256);
  assert.deepEqual(tile.crop, original.crop);
  assert.equal(tile.viewport, original.viewport);
  assert.equal(tile.verdict, 'pass');
  return {
    ...original, path: relative(tile.path), actuallyOpened: tile.actuallyOpened,
    reviewer: 'Huygens', status: tile.verdict, observations: tile.observations,
  };
});
const agentSurfaces = agent.surfaces.map(surface => {
  assert.equal(surface.verdict, 'pass');
  const original = result.results.find(item => item.id === surface.card &&
    item.surface === surface.surface && item.viewport.width === surface.viewport);
  assert.ok(original);
  assert.equal(surface.source.sha256, original.screenshotSha256);
  assert.equal(relative(surface.source.path), relative(original.screenshot));
  return {
    ...surface, status: surface.verdict, reviewer: 'Huygens',
    screenshot: surface.source.path, screenshotSha256: surface.source.sha256,
  };
});
const tiles = [...main.tiles, ...agentTiles];
const surfaces = [...main.surfaces, ...agentSurfaces];
const normalize = item => `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
assert.equal(tiles.length, manifest.tiles.length);
assert.deepEqual(tiles.map(item => relative(item.path)).sort(), manifest.tiles.map(item => relative(item.path)).sort());
assert.equal(new Set(tiles.map(item => relative(item.path))).size, tiles.length);
for (const tile of tiles) {
  assert.equal(tile.actuallyOpened, true);
  assert.equal((await bind(tile.path)).sha256, tile.sha256);
}
assert.equal(surfaces.length, 6);
assert.deepEqual(surfaces.map(normalize).sort(),
  result.results.filter(item => item.surface === 'text').map(normalize).sort());
assert.ok(surfaces.every(item => item.status === 'pass'));
await fs.writeFile(`${work}/d017-screenshot-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', batchResult: manifest.result,
  manifest: await bind(manifestPath), contributors: [await bind(mainPath), await bind(agentPath)],
  surfaces, tiles, emptySourceDefinedSurfaces: manifest.emptySourceDefinedSurfaces,
  scope: 'Three complete cards,12 surfaces:6 nonempty text surfaces inspected through13 actual original-pixel tiles and6 source-defined empty exercise surfaces. Six desktop native checks reused; only unfinished mobile surfaces observed.',
  excluded: 't4 actual mobile fig101 text below16px after its one repair; source/answer/choice stages and both offline failures retained, not a complete card.',
  limits: 'No screenshot/browser/source/SCI/figure gate repeated. This file only combines existing disjoint actual inspections.',
}, null, 2) + '\n', { flag: 'wx' });
