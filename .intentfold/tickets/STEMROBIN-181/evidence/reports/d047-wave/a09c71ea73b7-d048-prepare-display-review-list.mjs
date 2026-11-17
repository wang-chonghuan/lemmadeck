import assert from 'node:assert/strict';
import {
  ticket, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const paths = [
  ...Array.from({ length: 5 }, (_, i) => `d048-display-retained-${String(i + 1).padStart(2, '0')}.json`),
  ...Array.from({ length: 12 }, (_, i) => `d048-display-u${String(i + 1).padStart(2, '0')}.json`),
  ...Array.from({ length: 7 }, (_, i) => `d048-display-r${String(i + 1).padStart(2, '0')}.json`),
].map(name => `${ticket}/tmp/${name}`);
for (const file of paths) {
  const report = await read(file);
  assert.equal(report.status, 'PASS', file);
  assert.equal(report.imagesOpened, report.tiles.length);
  assert.ok(report.tiles.length > 0 && report.tiles.length <= 8);
  for (const tile of report.tiles) {
    assert.equal(tile.actuallyOpened, true);
    assert.equal(tile.status, 'PASS');
    assert.deepEqual(tile.defects, []);
    await verify(tile.path, tile.sha256);
  }
}
const destination = `${ticket}/tmp/d048-display-review-list.json`;
await immutableWrite(destination, `${JSON.stringify({
  reports: await Promise.all(paths.map(bind)),
}, null, 2)}\n`);
console.log(JSON.stringify({ reviewList: await bind(destination), reports: paths.length }));
