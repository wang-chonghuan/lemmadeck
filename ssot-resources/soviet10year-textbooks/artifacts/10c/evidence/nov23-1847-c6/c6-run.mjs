import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const [name, command, ...args] = process.argv.slice(2);
assert(/^[a-z0-9-]+$/.test(name) && command);
const out = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov23-1847-c6/stages';
fs.mkdirSync(out, { recursive: true });
const files = ['stdout.txt', 'stderr.txt', 'receipt.json'].map(ext => `${out}/${name}.${ext}`);
assert(files.every(file => !fs.existsSync(file)));
const start = new Date().toISOString();
const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
for (const [file, text] of [[files[0], result.stdout ?? ''], [files[1], result.stderr ?? '']]) {
  fs.writeFileSync(file, text, { flag: 'wx' });
}
const receipt = { command: [command, ...args], cwd: root, startedAt: start,
  endedAt: new Date().toISOString(), exit: result.status, signal: result.signal,
  error: result.error?.message,
  outputs: files.slice(0, 2).map(file => ({ path: file,
    sha256: createHash('sha256').update(fs.readFileSync(file)).digest('hex') })) };
fs.writeFileSync(files[2], JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
console.log(result.stdout ?? '');
console.error(result.stderr ?? '');
process.exitCode = result.status ?? 1;
