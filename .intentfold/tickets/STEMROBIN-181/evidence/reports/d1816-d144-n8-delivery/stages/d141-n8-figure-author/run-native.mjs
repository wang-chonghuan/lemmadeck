import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const home = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d141-n8-figure-author');
if (process.cwd() !== repo) throw new Error('Wrong author cwd');
const [name, command, ...args] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(name || '') || !command) throw new Error('Named call required');
const dir = path.join(home, 'native', name);
if (fs.existsSync(dir)) throw new Error(`Refusing receipt reuse: ${name}`);
fs.mkdirSync(dir, { recursive: true });
const startedAt = new Date();
const call = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const stdout = call.stdout || '';
const stderr = call.stderr || '';
fs.writeFileSync(path.join(dir, 'stdout.txt'), stdout);
fs.writeFileSync(path.join(dir, 'stderr.txt'), stderr);
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const receipt = {
  schema: 'STEMROBIN-181/native-call@1',
  name,
  cwd: repo,
  command: [command, ...args],
  startedAt: startedAt.toISOString(),
  finishedAt: new Date().toISOString(),
  elapsedMs: Date.now() - startedAt.getTime(),
  exitCode: call.status,
  error: call.error?.message || null,
  stdout: { path: path.join(dir, 'stdout.txt'), sha256: digest(stdout) },
  stderr: { path: path.join(dir, 'stderr.txt'), sha256: digest(stderr) },
};
fs.writeFileSync(path.join(dir, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(stdout);
console.error(stderr);
console.log(JSON.stringify(receipt));
process.exitCode = call.status ?? 1;
