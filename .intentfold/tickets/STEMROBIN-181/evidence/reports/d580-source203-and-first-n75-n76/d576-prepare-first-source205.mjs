import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d576-source205-first-preparation`;
const author = `${base}/d570-source204-first-author`;
await verify(`${author}/READY.json`,
  '15710d3d797c3e118cad219045a6cd4b3f90544e02a4b156a8094f3d25029dd4');
await verify(`${author}/author-freeze.json`,
  '24fb81eb5853d70724fa71a6fc84bd4c0e069b7af0e29e231e9958f1fe1555f8');
assert.equal(await exists(folder), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0205'), false);
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '205',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First actual continuation of SOURCE204 open derivation, no source completion inferred.',
  source204Author: await bind(`${author}/READY.json`), source204Independent: 'PENDING',
  parentImageOpens: 0, n77Complete: false,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-205.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0205/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [205],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, n77Complete: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
