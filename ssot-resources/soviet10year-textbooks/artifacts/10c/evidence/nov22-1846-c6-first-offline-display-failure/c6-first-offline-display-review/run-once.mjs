import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
const out = path.join(cwd, '.tmp/stemrobin-184-six/c6-first-offline-display-review');
const script = path.join(out, 'review-check.mjs');
const receipt = path.join(out, 'execution.json');
if (process.cwd() !== cwd || fs.existsSync(receipt)) throw Error('Wrong cwd or execution already recorded; no replay allowed');
const startedAt = new Date().toISOString();
const argv = [process.execPath, script];
const child = spawnSync(argv[0], argv.slice(1), { cwd, encoding: 'utf8', timeout: 90000, maxBuffer: 1024 * 1024 });
const streams = {};
for (const name of ['stdout', 'stderr']) {
  const p = path.join(out, `browser.${name}.txt`);
  const text = child[name] || '';
  fs.writeFileSync(p, text, { flag: 'wx' });
  streams[name] = { path: p, bytes: Buffer.byteLength(text), sha256: crypto.createHash('sha256').update(text).digest('hex') };
}
const record = {
  cwd, argv, startedAt, finishedAt: new Date().toISOString(), exitCode: child.status,
  signal: child.signal, error: child.error ? String(child.error) : null,
  streams, script: { path: script, sha256: crypto.createHash('sha256').update(fs.readFileSync(script)).digest('hex') },
  truncation: { maxBufferBytes: 1048576, timedOut: child.error?.code === 'ETIMEDOUT', truncated: child.error?.code === 'ENOBUFS' },
  attempts: 1,
};
fs.writeFileSync(receipt, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
process.stdout.write(child.stdout || '');
process.stderr.write(child.stderr || '');
if (child.error) process.stderr.write(String(child.error) + '\n');
process.exitCode = child.status ?? 1;
