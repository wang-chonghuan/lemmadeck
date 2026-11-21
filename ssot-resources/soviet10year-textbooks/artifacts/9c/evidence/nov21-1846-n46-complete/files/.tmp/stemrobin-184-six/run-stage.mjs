import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const [stage, command, ...args] = process.argv.slice(2);
assert(stage && command && /^[a-z0-9-]+$/.test(stage));
const directory = path.join(root, '.tmp/stemrobin-184-six/stages');
fs.mkdirSync(directory, { recursive: true });
const prefix = path.join(directory, stage);
for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
  assert(!fs.existsSync(`${prefix}.${suffix}`), `Existing stage: ${stage}`);
}
const started = new Date().toISOString();
const result = spawnSync(command, args, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, PWDEBUG: '0' },
});
const outputs = {};
for (const name of ['stdout', 'stderr']) {
  const bytes = result[name] ?? '';
  fs.writeFileSync(`${prefix}.${name}`, bytes, { flag: 'wx' });
  outputs[name] = {
    path: path.relative(root, `${prefix}.${name}`),
    bytes: Buffer.byteLength(bytes),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
  (name === 'stdout' ? process.stdout : process.stderr).write(bytes);
}
const receipt = {
  stage, command, args, cwd: root, started,
  ended: new Date().toISOString(),
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  outputs,
};
fs.writeFileSync(`${prefix}.receipt.json`, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
process.exitCode = result.status ?? 1;
