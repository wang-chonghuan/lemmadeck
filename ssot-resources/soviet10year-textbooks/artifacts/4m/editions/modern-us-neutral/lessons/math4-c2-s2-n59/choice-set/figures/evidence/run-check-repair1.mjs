import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187';
assert.equal(process.cwd(), root);
const directory = path.dirname(fileURLToPath(import.meta.url));
const name = 'check-REPAIR1';
assert.equal(fs.existsSync(path.join(directory, `${name}.command.json`)), false);
const args = [path.relative(root, path.join(directory, 'check.mjs'))];
const startedAt = new Date().toISOString();
const result = spawnSync('node', args, { cwd: root, encoding: 'utf8' });
fs.writeFileSync(path.join(directory, `${name}.stdout.txt`), result.stdout || '', { flag: 'wx' });
fs.writeFileSync(path.join(directory, `${name}.stderr.txt`), result.stderr || '', { flag: 'wx' });
fs.writeFileSync(path.join(directory, `${name}.command.json`),
  `${JSON.stringify({ command: 'node', args, workdir: root, startedAt,
    finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal,
    error: result.error?.message || null }, null, 2)}\n`, { flag: 'wx' });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.status || (result.error ? 1 : 0);
