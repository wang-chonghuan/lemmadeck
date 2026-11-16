import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const manifestPath = `${work}/offline-d017/d017-screenshot-tiles.json`;
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const result = JSON.parse(await fs.readFile(manifest.result.path, 'utf8'));
assert.equal(result.status, 'pass');
const cards = ['phy9-c2-s1', 'phy9-c2-s2-n61'];
const tiles = manifest.tiles.filter(tile => cards.includes(tile.card));
assert.equal(tiles.length, 7);
for (const tile of tiles) assert.equal((await bind(tile.path)).sha256, tile.sha256);
await fs.writeFile(`${work}/d017-main-screenshot-review.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', reviewer: 'Main',
  manifest: await bind(manifestPath), batchResult: manifest.result,
  tiles: tiles.map(tile => ({ ...tile, actuallyOpened: true, reviewer: 'Main', status: 'pass' })),
  surfaces: result.results.filter(item => cards.includes(item.id) && item.surface === 'text').map(item => ({
    card: item.id, surface: item.surface, viewport: item.viewport.width,
    status: 'pass', reviewer: 'Main', screenshot: item.screenshot, screenshotSha256: item.screenshotSha256,
    observation: item.id === 'phy9-c2-s1'
      ? 'All full-height tiles opened at original resolution. Header/prose/three semantic separators, complete compact160px Maxwell bust, biography and final paragraph/page footer are legible and separated; no clipped text, overlap or unresolved image.'
      : 'All full-height tiles opened at original resolution. Header, all10 normalized paragraphs, original8-1 signed sum, explanatory footnote, three separators and complete page bottom are visible. Formula and Chinese lines fit the mobile width, no orphan or overlap.',
  })),
  limits: 'Seven original-pixel tile openings cover four nonempty surfaces. Existing native assertions and gates not rerun. Six source-defined empty exercise surfaces are recorded separately in the batch manifest.',
}, null, 2) + '\n', { flag: 'wx' });
