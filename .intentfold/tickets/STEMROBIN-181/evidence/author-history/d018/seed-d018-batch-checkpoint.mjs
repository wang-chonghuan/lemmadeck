import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { bind, read, verify, exists, ticket } from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/offline-d018`;
const cards = [63, 64, 65].map(number => `phy9-c2-s2-n${number}`);
const original = `${folder}/checkpoint-${cards[0]}.json`;
const checkpoint = await read(original);
assert.equal(checkpoint.status, 'incomplete');
assert.equal(checkpoint.results.length, 4);
for (const surface of checkpoint.results) {
  assert.equal(surface.id, cards[0]);
  await verify(surface.sourceHtml.path, surface.sourceHtml.sha256);
  await verify(surface.screenshot, surface.screenshotSha256);
}
const output = `${folder}/checkpoint-${cards.join('--')}.json`;
assert.ok(!await exists(output));
await fs.writeFile(output, `${JSON.stringify({
  status: 'incomplete', results: checkpoint.results,
  seed: await bind(original),
  basis: 'Four completed n63 surfaces reused byte-exact. Only unfinished64/65 surfaces may run.',
}, null, 2)}\n`, { flag: 'wx' });
console.log(output);
