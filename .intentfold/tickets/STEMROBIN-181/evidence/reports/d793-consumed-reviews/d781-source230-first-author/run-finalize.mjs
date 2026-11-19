import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  constants, copyFileSync, existsSync, readFileSync, writeFileSync,
} from 'node:fs';
import path from 'node:path';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const D = path.join(R, '.intentfold/tickets/STEMROBIN-181/tmp/d781-source230-first-author');
const root = path.join(D, 'root');
const work = path.join(D, 'work');
const page = path.join(root, '10p/pages/0230');
const first = path.join(D, 'first/10p/pages/0230');
const receipt = path.join(D, 'finalize.0001.receipt.json');
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
assert.equal(process.cwd(), R);
assert.equal(existsSync(receipt), false, 'The first native call must not be replayed.');
const input = path.join(page, 'page.md');
const inputSnapshot = path.join(first, 'page.authored.md');
copyFileSync(input, inputSnapshot, constants.COPYFILE_EXCL);
const executable = path.join(R, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const tool = path.join(R, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const args = [
  tool, 'finalize', '--book', '10p', '--page', '230',
  '--root', root, '--work', work,
];
const started = new Date().toISOString();
const result = spawnSync(executable, args, {
  cwd: R,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  encoding: 'utf8',
  maxBuffer: 8 * 1024 * 1024,
});
const stdout = path.join(D, 'finalize.0001.stdout');
const stderr = path.join(D, 'finalize.0001.stderr');
writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' });
writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' });
const outputs = [];
for (const name of ['page.md', 'page.json', 'audit.json']) {
  const file = path.join(page, name);
  if (!existsSync(file)) continue;
  const snapshot = path.join(first, name);
  copyFileSync(file, snapshot, constants.COPYFILE_EXCL);
  outputs.push({ path: file, snapshot, sha256: hash(file) });
}
const data = {
  schema: 'ld-s10y-source-first-native-call@1',
  physicalPage: 230,
  cwd: R,
  executable,
  args,
  environmentOverride: { PYTHONDONTWRITEBYTECODE: '1' },
  started,
  finished: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  spawnError: result.error?.message ?? null,
  input: { path: inputSnapshot, sha256: hash(inputSnapshot) },
  tool: { path: tool, sha256: hash(tool) },
  stdout: { path: stdout, sha256: hash(stdout) },
  stderr: { path: stderr, sha256: hash(stderr) },
  outputs,
  nativeFinalizeCalls: 1,
  contentReview: 'not performed; independent pending',
};
writeFileSync(receipt, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');
console.log(JSON.stringify({ receipt, exitCode: result.status, outputs }, null, 2));
process.exitCode = result.status ?? 2;
