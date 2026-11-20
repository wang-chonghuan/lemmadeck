import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const own = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== root) throw new Error('Wrong author worktree');
const [name, command, ...args] = process.argv.slice(2);
if (!/^d281-[a-z0-9-]+$/.test(name || '') || !command) {
  throw new Error('Unique d281-* receipt name and command required');
}
const dir = path.join(own, 'native', name);
fs.mkdirSync(path.dirname(dir), { recursive: true });
fs.mkdirSync(dir, { recursive: false });
const started = new Date();
const call = spawnSync(command, args, {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
});
const receipt = {
  schema: 'd281/native-execution@1',
  name,
  cwd: root,
  command: [command, ...args],
  startedAt: started.toISOString(),
  finishedAt: new Date().toISOString(),
  elapsedMs: Date.now() - started.getTime(),
  exitCode: call.status,
  signal: call.signal,
  error: call.error?.message || null,
  authorOnly: true,
};
fs.writeFileSync(path.join(dir, 'stdout.txt'), call.stdout || '', { flag: 'wx' });
fs.writeFileSync(path.join(dir, 'stderr.txt'), call.stderr || '', { flag: 'wx' });
fs.writeFileSync(path.join(dir, 'receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
console.log(call.stdout || '');
console.error(call.stderr || '');
console.log(JSON.stringify(receipt));
process.exitCode = call.status ?? 1;
