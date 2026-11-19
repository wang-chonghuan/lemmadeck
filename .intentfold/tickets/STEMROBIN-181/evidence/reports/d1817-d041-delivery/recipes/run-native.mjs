import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repo = process.cwd();
if (repo !== '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck') {
  throw new Error('Wrong production worktree');
}
const [name, command, ...args] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/i.test(name || '') || !command) throw new Error('Name and command required');
const dir = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/native', name);
fs.mkdirSync(dir, { recursive: true });
if (fs.existsSync(path.join(dir, 'receipt.json'))) throw new Error(`Existing call must be preserved: ${name}`);
const start = new Date();
const call = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
fs.writeFileSync(path.join(dir, 'stdout.txt'), call.stdout || '');
fs.writeFileSync(path.join(dir, 'stderr.txt'), call.stderr || '');
const receipt = {
  name, cwd: repo, command: [command, ...args], startedAt: start.toISOString(),
  finishedAt: new Date().toISOString(), elapsedMs: Date.now() - start.getTime(),
  exitCode: call.status, error: call.error?.message || null,
};
fs.writeFileSync(path.join(dir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(call.stdout || '');
console.error(call.stderr || '');
console.log(JSON.stringify(receipt));
process.exitCode = call.status ?? 1;
