import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d496-source198-first-author`;
const folder = `${ticket}/tmp/d504-source198-first-native-svg-preview`;
await verify(`${author}/report.json`,
  '08940bb5560173d18bac2fc76171cf07873a5931174b4497bccf0b16e09b9c79');
await verify(`${author}/author-freeze.json`,
  '506b9ed1cda39ae6d122d0df5a6aef18eaa9cd4b38ac093cd516f9dd29b044ee');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const svg = `${author}/work/10p/pages/0198/figures/fig-167.svg`;
const raw = svg.replace(/\.svg$/, '.png');
for (const file of [svg, raw]) {
  const row = freeze.files.find(item => absolute(item.path) === absolute(file));
  assert.ok(row, file);
  await verify(file, row.sha256);
}
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const output = `${folder}/fig-167.native.png`;
await immutableWrite(output, new Resvg(await bytes(svg), { background: 'white' }).render().asPng());
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'FIRST-SOURCE-EXTRACTION-SVG-PREVIEW-INDEPENDENT-OBSERVATION-PENDING',
  authorReport: await bind(`${author}/report.json`),
  authorFreeze: await bind(`${author}/author-freeze.json`),
  previews: [{
    figure: 'fig-167', page: 198, svg: await bind(svg), RAW: await bind(raw),
    preview: await bind(output), firstNativePreview: true, previewCount: 1,
  }],
  rasterizationInvocations: 1, sourceCropChanges: 0, parentImageOpens: 0,
  parentImageCount: 24, noImageBudgetReset: true, sourcePagesAdded: 0,
  completeCardsAdded: 0, completeCard: false, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
