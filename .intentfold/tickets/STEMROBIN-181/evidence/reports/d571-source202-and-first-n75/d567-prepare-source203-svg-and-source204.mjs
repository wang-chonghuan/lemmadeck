import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d561-source203-first-author`;
const folder = `${ticket}/tmp/d567-source203-svg-and-source204-preparation`;
await verify(`${author}/author-freeze.json`,
  '64b24d918e704ed3fdaea402effc2cfca8d6b0df7ac73e14fa75af7ec27989f8');
await verify(`${author}/report.json`,
  '7b09f98b9de9f43f320854c0cdbb56a4132f35635036e7c49b8c13cde04bc2a2');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const previews = [];
for (const id of ['179', '180']) {
  const svg = `${author}/work/10p/pages/0203/figures/fig-${id}.svg`;
  const raw = svg.replace(/\.svg$/, '.png');
  for (const file of [svg, raw]) {
    const row = freeze.files.find(entry => absolute(entry.path) === absolute(file));
    assert.ok(row, file);
    await verify(file, row.sha256);
  }
  const output = `${folder}/previews/fig-${id}.native.png`;
  await immutableWrite(output, new Resvg(await bytes(svg), { background: 'white' }).render().asPng());
  previews.push({ figure: `fig-${id}`, page: 203, svg: await bind(svg),
    RAW: await bind(raw), preview: await bind(output), firstNativePreview: true, previewCount: 1 });
}
await immutableWrite(`${folder}/source203-previews.json`, serialize({
  ticket: 'STEMROBIN-181', previews, authorFreeze: await bind(`${author}/author-freeze.json`),
  rasterizationInvocations: 2, independentReview: 'PENDING', parentImageOpens: 0,
}));
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '204',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0204'), false);
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First actual next-page boundary after SOURCE203 closed paragraphs; no TOC-based closure.',
  source203Author: await bind(`${author}/report.json`), source203Independent: 'PENDING',
  parentImageOpens: 0, n76Complete: false,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-204.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0204/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [204],
  source203Previews: await bind(`${folder}/source203-previews.json`),
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, source203Independent: 'PENDING', n76Complete: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
