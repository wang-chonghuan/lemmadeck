import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { bind, read, verify, ticket } from './retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/offline-d018`;
const cards = [63, 64, 65].map(number => `phy9-c2-s2-n${number}`);
const target = `${folder}/checkpoint-${cards.join('--')}.json`;
const prior = await read(target);
assert.equal(prior.results.length, 4);
assert.ok(prior.results.every(surface => surface.id === cards[0]));
const original = `${folder}/checkpoint-${cards[1]}.json`;
const next = await read(original);
assert.equal(next.status, 'incomplete');
assert.equal(next.results.length, 4);
assert.ok(next.results.every(surface => surface.id === cards[1]));
for (const surface of [...prior.results, ...next.results]) {
  await verify(surface.sourceHtml.path, surface.sourceHtml.sha256);
  await verify(surface.screenshot, surface.screenshotSha256);
  if (surface.metrics.scrollEndScreenshot) {
    await verify(surface.metrics.scrollEndScreenshot, surface.metrics.scrollEndScreenshotSha256);
  }
}
await fs.writeFile(target, `${JSON.stringify({
  ...prior, results: [...prior.results, ...next.results],
  appendedCheckpoint: await bind(original),
  basis: 'Eight completed n63/n64 surfaces reused byte-exact. Only unfinished n65 surfaces may run.',
}, null, 2)}\n`);
console.log(target);
