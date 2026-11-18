import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bind, verify, read, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d587-source206-first-preparation`;
const author = `${base}/d579-source205-first-author`;
await verify(`${author}/report.json`,
  '45deae31d2b6907fa8af00bdd9d374fe7986b876834c3e7860699606acc342f2');
await verify(`${author}/author-freeze.json`,
  '11cbf4f9393eba7562d39f2f0ff736c7045407bbba1ddbf580fb8747ba38c824');
const report = await read(`${author}/report.json`);
assert.equal(report.n77Complete, false);
assert.equal(report.boundaries.outgoingFlags.open, true);
assert.equal(await exists(folder), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0206'), false);
await fs.mkdir(absolute(`${folder}/source`), { recursive: true });
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '206',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', command, invocationsAuthorized: 1,
  reason: 'First actual continuation of SOURCE205 open derivation; no completion inferred.',
  source205Author: await bind(`${author}/report.json`),
  source205Independent: 'FIRST-REVIEW-RUNNING-NOT-CERTIFIED',
  previousTailTextOnly: report.boundaries.outgoingTail,
  source204205Join: 'FIRST-INDEPENDENT-REVIEW-PENDING',
  parentImageOpens: 0, n77Complete: false,
}));
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-206.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0206/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [206],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, n77Complete: false,
  previousTailTextOnly: report.boundaries.outgoingTail,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
