import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, read, bind, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const branch = 'codex/STEMROBIN-181-textbooks';
const parent = 'aa0d0dea1b795602b53ece5a9bb9d4f58a84011a';
function git(args) {
  const result = spawnSync('git', args, {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
assert.equal(git(['branch', '--show-current']), branch);
assert.equal(git(['diff', '--cached', '--name-only']), '');
const commit = git(['rev-parse', 'HEAD']);
assert.equal(git(['rev-parse', 'HEAD^']), parent);
const staging = `${ticket}/tmp/d029/staging.json`;
const staged = await read(staging);
assert.equal(staged.parent, parent);
const command = ['git', 'push', 'origin', `HEAD:refs/heads/${branch}`];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
});
const receipt = `${ticket}/tmp/d029/push.json`;
await immutableWrite(receipt, `${JSON.stringify({
  command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  commit, staging: await bind(staging),
}, null, 2)}\n`);
assert.equal(result.status, 0, result.stderr);
const remote = git(['ls-remote', 'origin', `refs/heads/${branch}`]).split(/\s+/)[0];
assert.equal(remote, commit);
assert.equal(git(['rev-parse', `origin/${branch}`]), commit);
console.log(JSON.stringify({ commit, remote, push: await bind(receipt) }));
