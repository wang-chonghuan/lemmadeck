import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, tmp, branch, stagingPath, bytes, git, assertContext,
  assertTicketContext, assertPristineStaging, verifyWorkspace, writeReceipt, assertAbsent,
} from './stage-d027.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
await assertTicketContext();
const commit = assertContext();
const staging = JSON.parse(await bytes(stagingPath));
assert.deepEqual(git(['rev-list', '--parents', '-n', '1', commit]).trim().split(/\s+/),
  [commit, staging.parent]);
assertPristineStaging('Preserve concurrent staging; no ordinary push until the batch commit is complete.');
const receiptPath = `${tmp}/d027-push-command-result.json`;
await assertAbsent(receiptPath);
await verifyWorkspace(staging.preservedWorkspace);
const args = ['push', '--porcelain', 'origin', `HEAD:refs/heads/${branch}`];
const startedAt = new Date().toISOString();
const result = spawnSync('git', args, {
  cwd: root, encoding: 'utf8', timeout: 300000, maxBuffer: 8 * 1024 * 1024,
});
await writeReceipt(receiptPath, {
  status: result.status === 0 ? 'pass' : 'FAIL-preserved',
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  commit, parent: staging.parent, remote: 'origin', branch, args,
  stdout: result.stdout ?? '', stderr: result.stderr ?? '',
  startedAt, finishedAt: new Date().toISOString(),
  actualCommandExecuted: true,
});
console.log(result.stdout ?? '');
console.log(result.stderr ?? '');
assert.equal(result.status, 0);
await verifyWorkspace(staging.preservedWorkspace);
console.log(JSON.stringify({ receipt: receiptPath, commit }));
