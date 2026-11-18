import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const folder = `${ticket}/tmp/d465-source197-first-preparation`;
const previousPath = `${ticket}/tmp/d453-source196-first-author/report.json`;
await verify(previousPath, '56f63ecde0bf7e9d27397c67c7738eaf2158fa9c4091c1e2107c4e4bb201b6e9');
const previous = await read(previousPath);
assert.equal(previous.boundary.n74_complete, false);
assert.equal(previous.boundary.whole_exercise8_sequence_closed, false);
assert.equal(previous.boundary.new_unit_observed, false);
assert.equal(await exists(folder), false);
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', book: '10p', page: 197,
  reason: 'SOURCE196 visibly ends within exercise8 without a next-unit heading; only the first next page is needed to establish its right boundary.',
  authorCheckpoint: await bind(previousPath),
  SOURCE196IndependentStatus: 'pending', notWholeSOURCE196Approval: true, noImageOpens: true,
}));
const command = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
  '--book', '10p', '--page', '197',
  '--root', absolute(`${folder}/source`), '--work', absolute(`${folder}/work`),
];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 120000,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
await immutableWrite(`${folder}/prepare-197.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
}));
assert.equal(result.status, 0, result.stderr);
const inputs = [];
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
  inputs.push(await bind(`${folder}/work/10p/pages/0197/${name}`));
}
const manifestPath = `${folder}/manifest.json`;
await immutableWrite(manifestPath, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', book: '10p', pages: [197],
  status: 'FIRST-PREPARED-NOT-READ-NOT-AUTHORED-NOT-APPROVED',
  sourceRoot: `${folder}/source`, sourceWork: `${folder}/work`,
  inputs, prepareInvocations: 1, newImages: 0, parentImageCount: 24,
  noImageBudgetReset: true, sourcePagesAdded: 0, completeCardsAdded: 0,
  n74Complete: false, newPaidGeneration: 0,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeployCommitPush: false,
}));
console.log(JSON.stringify(await bind(manifestPath)));
