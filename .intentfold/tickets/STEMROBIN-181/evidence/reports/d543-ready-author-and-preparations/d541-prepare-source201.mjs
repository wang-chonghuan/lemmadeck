import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d541-source201-first-preparation`;
const authorPath = `${ticket}/tmp/d531-source200-first-author/report.json`;
await verify(authorPath, 'df4743f4959a1b72dc3077515954e5dba65aa53ecd3767e2fd41663cbd357ef5');
const author = await read(authorPath);
assert.equal(author.object_boundaries.next_page_required_for_text_closure, true);
assert.equal(author.object_boundaries.n75_complete, false);
assert.equal(await exists(folder), false);
assert.equal(await exists('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0201'), false);
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '201',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', book: '10p', page: 201, command,
  reason: 'First physical continuation of SOURCE200 open prose and unresolved fig174 owner.',
  author200: await bind(authorPath), prepareInvocationsAuthorized: 1, parentImages: 24,
  newParentImages: 0, n75Complete: false, nextPageContentsNotInferred: true,
}));
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-201.receipt.json`, serialize({
  command, invocations: 1, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0201/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [201],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`, inputs,
  prepareInvocations: 1, newParentImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, n75Complete: false, fig174OwnerResolved: false,
  sourcePagesAdded: 0, completeCardsAdded: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
