import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d453-source196-first-author`;
const folder = `${ticket}/tmp/d466-source196-first-native-svg-previews`;
await verify(`${author}/report.json`,
  '56f63ecde0bf7e9d27397c67c7738eaf2158fa9c4091c1e2107c4e4bb201b6e9');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const previews = [];
for (const id of ['fig-161', 'fig-162', 'fig-163']) {
  const input = `${author}/work/10p/pages/0196/figures/${id}.svg`;
  const raw = input.replace(/\.svg$/, '.png');
  for (const file of [input, raw]) {
    const row = freeze.files.find(item => absolute(item.path) === absolute(file));
    assert.ok(row, file);
    await verify(file, row.sha256);
  }
  const output = `${folder}/${id}.native.png`;
  const png = new Resvg(await bytes(input), { background: 'white' }).render().asPng();
  await immutableWrite(output, png);
  previews.push({
    figure: id, page: 196, svg: await bind(input), RAW: await bind(raw),
    preview: await bind(output), firstNativePreview: true, previewCount: 1,
  });
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033',
  status: 'FIRST-EXTRACTION-SVG-PREVIEWS-INDEPENDENT-OBSERVATION-PENDING',
  authorReport: await bind(`${author}/report.json`),
  authorFreeze: await bind(`${author}/author-freeze.json`), previews,
  meaning: 'First saved native-canvas renders of new faithful-source SVGs; no source fidelity, modern FIG or DISPLAY verdict.',
  rasterizationInvocations: 3, sourceCropChanges: 0, parentImageOpens: 0,
  parentImageCount: 24, noImageBudgetReset: true,
  sourcePagesAdded: 0, completeCardsAdded: 0, completeCard: false,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0,
  DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify({ manifest: await bind(manifestPath), previews }));
