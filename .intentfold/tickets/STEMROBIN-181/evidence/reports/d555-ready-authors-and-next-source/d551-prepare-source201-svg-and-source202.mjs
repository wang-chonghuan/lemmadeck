import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const author = `${ticket}/tmp/d542-source201-first-author`;
const folder = `${ticket}/tmp/d551-source201-svg-and-source202-preparation`;
await verify(`${author}/author-freeze.json`,
  '708b4beaff5a9406c07b471b6067a365a251e34e22f4bc275933e5b056680dde');
await verify(`${author}/report.json`,
  'fb27002c2e1646694a1d401d0f9a50856532495018f8606de35027125e94dbfa');
assert.equal(await exists(folder), false);
const freeze = await read(`${author}/author-freeze.json`);
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { Resvg } = require('@resvg/resvg-js');
const previews = [];
for (const id of ['175', '176']) {
  const svg = `${author}/work/10p/pages/0201/figures/fig-${id}.svg`;
  const raw = svg.replace(/\.svg$/, '.png');
  for (const file of [svg, raw]) {
    const row = freeze.files.find(entry => absolute(entry.path) === absolute(file));
    assert.ok(row, file);
    await verify(file, row.sha256);
  }
  const output = `${folder}/previews/fig-${id}.native.png`;
  await immutableWrite(output, new Resvg(await bytes(svg), { background: 'white' }).render().asPng());
  previews.push({ figure: `fig-${id}`, page: 201, svg: await bind(svg),
    RAW: await bind(raw), preview: await bind(output), firstNativePreview: true, previewCount: 1 });
}
await immutableWrite(`${folder}/source201-previews.json`, serialize({
  ticket: 'STEMROBIN-181', previews, authorFreeze: await bind(`${author}/author-freeze.json`),
  rasterizationInvocations: 2, independentReview: 'PENDING', parentImageOpens: 0,
}));
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '202',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0202'), false);
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'Observe actual next heading or body continuation after closed SOURCE201 paragraphs; no TOC-based closure.',
  source201Author: await bind(`${author}/report.json`), source201Independent: 'PENDING',
  parentImageOpens: 0, n75Complete: false,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-202.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0202/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [202],
  source201Previews: await bind(`${folder}/source201-previews.json`),
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, n75Complete: false, fig174IndependentOwnerResolved: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
