import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d524-source199-first-author`;
const folder = `${ticket}/tmp/d529-source199-first-svg-previews`;
await verify(`${author}/author-freeze.json`,
  '2f6f0fee6eb81023493581fb988da83153827997afcc8c06158782dc0b4ad318');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const previews = [];
for (const id of ['168', '169', '170', '171']) {
  const svg = `${author}/work/10p/pages/0199/figures/fig-${id}.svg`;
  const raw = svg.replace(/\.svg$/, '.png');
  for (const file of [svg, raw]) {
    const entry = freeze.files.find(row => absolute(row.path) === absolute(file));
    assert.ok(entry, file);
    await verify(file, entry.sha256);
  }
  const output = `${folder}/fig-${id}.native.png`;
  await immutableWrite(output, new Resvg(await bytes(svg), { background: 'white' }).render().asPng());
  previews.push({
    figure: `fig-${id}`, page: 199, svg: await bind(svg), RAW: await bind(raw),
    preview: await bind(output), firstNativePreview: true, previewCount: 1,
  });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'FIRST-ORIGINAL-SVG-PREVIEWS-INDEPENDENT-PIXEL-REVIEW-PENDING',
  authorFreeze: await bind(`${author}/author-freeze.json`), previews,
  rasterizationInvocations: 4, sourceCropChanges: 0,
  parentImageOpens: 0, parentImageCount: 24, noImageBudgetReset: true,
  sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
