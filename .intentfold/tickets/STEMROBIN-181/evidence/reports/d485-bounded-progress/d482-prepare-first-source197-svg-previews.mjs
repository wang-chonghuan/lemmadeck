import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d467-source197-first-author`;
const folder = `${ticket}/tmp/d482-source197-first-native-svg-previews`;
await verify(`${author}/report.json`,
  'c843c7d61f846da55ccf40d5bbba2ef0554e8ad4d87ffbe1a5897965631dcd17');
await verify(`${author}/author-freeze.json`,
  '8410c0f6447b501dc90f284a8a48dbcdcae185c0f8aa567965aa06af2bcfb3ef');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const previews = [];
for (const id of ['fig-164', 'fig-165', 'fig-166']) {
  const input = `${author}/work/10p/pages/0197/figures/${id}.svg`;
  const raw = input.replace(/\.svg$/, '.png');
  for (const file of [input, raw]) {
    const row = freeze.files.find(item => absolute(item.path) === absolute(file));
    assert.ok(row, file);
    await verify(file, row.sha256);
  }
  const output = `${folder}/${id}.native.png`;
  await immutableWrite(output, new Resvg(await bytes(input), { background: 'white' }).render().asPng());
  previews.push({
    figure: id, page: 197, svg: await bind(input), RAW: await bind(raw),
    preview: await bind(output), firstNativePreview: true, previewCount: 1,
  });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'FIRST-EXTRACTION-SVG-PREVIEWS-INDEPENDENT-OBSERVATION-PENDING',
  authorReport: await bind(`${author}/report.json`),
  authorFreeze: await bind(`${author}/author-freeze.json`), previews,
  rasterizationInvocations: 3, sourceCropChanges: 0, parentImageOpens: 0,
  parentImageCount: 24, noImageBudgetReset: true, sourcePagesAdded: 0,
  completeCardsAdded: 0, completeCard: false, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), previews }));
