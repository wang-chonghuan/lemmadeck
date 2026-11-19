import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const name = args.shift();
assert(/^[a-z0-9-]+$/u.test(name));
const snapshots = [];
const results = [];
while (args[0] === '--snapshot' || args[0] === '--result') {
  const flag = args.shift();
  (flag === '--snapshot' ? snapshots : results).push(args.shift());
}
assert.equal(args.shift(), '--');
const command = args;
assert(command.length > 0);
const output = `.tmp/stemrobin-184-resume/${name}`;
assert(!fs.existsSync(output), 'Existing invocation protected');
fs.mkdirSync(output);
const inputs = snapshots.map(file => {
  assert(file && !file.startsWith('/') && !file.split('/').includes('..'));
  const bytes = fs.readFileSync(file);
  const target = `${output}/inputs/${file}`;
  fs.mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o444 });
  return { path: file, retainedPath: target, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
});
fs.writeFileSync(`${output}/capture.mjs`, fs.readFileSync(import.meta.filename), { flag: 'wx', mode: 0o444 });
const stdout = fs.openSync(`${output}/native.stdout`, 'wx');
const stderr = fs.openSync(`${output}/native.stderr`, 'wx');
const startedAt = new Date().toISOString();
let actual;
try {
  actual = spawnSync(command[0], command.slice(1), { cwd: process.cwd(), stdio: ['ignore', stdout, stderr] });
} finally {
  fs.closeSync(stdout);
  fs.closeSync(stderr);
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const outputs = results.map(file => {
  assert(file && !file.startsWith('/') && !file.split('/').includes('..'));
  if (!fs.existsSync(file)) return { path: file, missing: true };
  const bytes = fs.readFileSync(file);
  const target = `${output}/outputs/${file}`;
  fs.mkdirSync(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o444 });
  return { path: file, retainedPath: target, bytes: bytes.length, sha256: hash(file) };
});
const receipt = { schema: 'bounded-native-invocation@1', name, command, cwd: process.cwd(),
  startedAt, endedAt: new Date().toISOString(), actualExit: actual.status, signal: actual.signal,
  error: actual.error?.message ?? null, invocations: 1, inputs, outputs,
  stdoutSha256: hash(`${output}/native.stdout`), stderrSha256: hash(`${output}/native.stderr`),
  next: actual.status === 0 ? 'Reuse actual outputs; no replay' : 'Preserve failure and stop dependent stages' };
fs.writeFileSync(`${output}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
process.exitCode = actual.status ?? 1;
