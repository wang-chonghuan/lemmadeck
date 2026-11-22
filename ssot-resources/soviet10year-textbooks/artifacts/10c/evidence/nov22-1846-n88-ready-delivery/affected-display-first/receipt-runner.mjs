import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const [stage, script, ...args] = process.argv.slice(2);
assert.match(stage, /^[a-z0-9-]+$/);
assert.equal(path.dirname(path.resolve(script)), out);
const dir = path.join(out, stage);
fs.mkdirSync(dir);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const startedAt = new Date().toISOString();
const argv = [path.resolve(script), ...args];
const result = spawnSync(process.execPath, argv, {
  cwd: root, encoding: null, maxBuffer: 32 * 1024 * 1024,
});
const streams = {};
for (const name of ['stdout', 'stderr']) {
  const bytes = result[name] ?? Buffer.alloc(0);
  const filename = path.join(dir, `${name}.txt`);
  fs.writeFileSync(filename, bytes, { flag: 'wx' });
  streams[name] = { path: filename, bytes: bytes.length, sha256: hash(bytes) };
}
const receipt = {
  schema: 'stemrobin1846/actual-scoped-execution@1',
  startedAt, finishedAt: new Date().toISOString(), cwd: root,
  command: process.execPath, argv, exitCode: result.status,
  signal: result.signal, launchError: result.error ? String(result.error) : null,
  status: result.status === 0 ? 'PASS' : 'FAIL', streams,
};
fs.writeFileSync(path.join(dir, 'execution.json'),
  JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(result.stdout ?? Buffer.alloc(0));
process.stderr.write(result.stderr ?? Buffer.alloc(0));
console.log(JSON.stringify({ receipt: path.join(dir, 'execution.json'),
  exitCode: result.status, signal: result.signal }));
process.exitCode = result.status ?? 1;
