import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, evidence, indexPath, absolute, read, bytes, bind, verify,
  exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const owned = '.tmp/STEMROBIN-181/9p-d031-n113-figures-a/fig-229/artwork';
const retainedRoot = `${evidence}/figures/candidates/9p/9p-d031-n113-figures-a/fig-229/artwork`;
const receiptPath = `${ticket}/tmp/d031-n113-artwork-retention.json`;
assert.ok(!await exists(receiptPath));
const generationPath = `${owned}/burner-opaque.png.json`;
const generation = await read(generationPath);
assert.equal(generation.schema, 'n-azure/image-generation@1');
assert.equal(generation.model, 'gpt-image-2');
await verify(generation.output.path, generation.output.sha256);
const indexBefore = await bytes(indexPath);
const index = JSON.parse(indexBefore);
const retained = [];
for (const file of await walk(owned)) {
  const destination = `${retainedRoot}/${path.relative(owned, file)}`;
  await immutableWrite(destination, await bytes(file));
  const row = { ...await bind(destination), originalPath: file,
    batch: 'D-031', deliveryClaim: false };
  const collection = /\.png$/.test(file) ? 'figurePixels' : 'reports';
  const previous = index[collection].find(item => item.path === destination);
  if (previous) assert.equal(previous.sha256, row.sha256);
  else index[collection].push(row);
  retained.push(row);
}
const durableGeneration = structuredClone(generation);
durableGeneration.output.path = `${retainedRoot}/burner-opaque.png`;
const durableGenerationPath = `${retainedRoot}/burner-opaque.durable.png.json`;
const reversed = structuredClone(durableGeneration);
reversed.output.path = generation.output.path;
assert.deepEqual(reversed, generation);
await immutableWrite(durableGenerationPath, `${JSON.stringify(durableGeneration, null, 2)}\n`);
index.reports.push({ ...await bind(durableGenerationPath),
  originalPath: generationPath, batch: 'D-031', deliveryClaim: false });
await immutableWrite(receiptPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', figure: 'fig-229',
  status: 'exact-artwork-retained-generation-output-path-only-rebound',
  retained,
  asset: await bind(`${retainedRoot}/burner.png`),
  generation: await bind(durableGenerationPath),
  originalGeneration: await bind(`${retainedRoot}/burner-opaque.png.json`),
  originalGeneratedPixels: await bind(`${retainedRoot}/burner-opaque.png`),
  limits: 'Candidate author artwork retained before final spec freeze. Original image/generation bytes retained, generation output path alone has a separate durable copy. No generation/render/pixel/SCI/independent gate or promotion.',
}, null, 2)}\n`);
const durableReceipt = `${evidence}/reports/d031-n113-artwork-retention.json`;
await immutableWrite(durableReceipt, await bytes(receiptPath));
index.reports.push({ ...await bind(durableReceipt), originalPath: receiptPath,
  batch: 'D-031', deliveryClaim: false });
const helper = `${ticket}/tmp/retain-d031-n113-artwork.mjs`;
const helperDestination = `${evidence}/author-history/d031/retain-d031-n113-artwork.mjs`;
await immutableWrite(helperDestination, await bytes(helper));
index.reports.push({ ...await bind(helperDestination), originalPath: helper,
  batch: 'D-031', deliveryClaim: false });
assert.deepEqual(await bytes(indexPath), indexBefore);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(receiptPath),
  asset: await bind(`${retainedRoot}/burner.png`), generation: await bind(durableGenerationPath) }));
