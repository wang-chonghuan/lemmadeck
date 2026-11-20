import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const root = path.dirname(fileURLToPath(import.meta.url));
if (process.cwd() !== repo) throw new Error('Wrong authorized checkout');
const [name, command, ...args] = process.argv.slice(2);
if (!/^[a-zA-Z0-9.-]+$/.test(name)) throw new Error('Invalid receipt name');
const receiptRoot = path.join(root, 'commands', name);
fs.mkdirSync(receiptRoot, { recursive: true });
const temporaryRoot = path.join(root, 'browser-tmp', name);
fs.mkdirSync(temporaryRoot, { recursive: true });
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.writeFileSync(path.join(receiptRoot, 'command.json'), JSON.stringify({
  schema: 'bounded-author-command@1', cwd: repo, command, args,
  startedAt: new Date().toISOString(),
  environmentOverrides: { TMPDIR: temporaryRoot, PYTHONDONTWRITEBYTECODE: '1', PYTHON: 'python3' },
  executables: args.filter(a => fs.existsSync(a) && fs.statSync(a).isFile())
    .map(p => ({ path: path.relative(repo, path.resolve(p)), sha256: sha(p) })),
}, null, 2) + '\n', { flag: 'wx' });
const result = spawnSync(command, args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, TMPDIR: temporaryRoot, PYTHONDONTWRITEBYTECODE: '1', PYTHON: 'python3' },
});
fs.writeFileSync(path.join(receiptRoot, 'stdout.txt'), result.stdout || '', { flag: 'wx' });
fs.writeFileSync(path.join(receiptRoot, 'stderr.txt'), result.stderr || '', { flag: 'wx' });
const exit = {
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  finishedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(receiptRoot, 'exit.json'), JSON.stringify(exit, null, 2) + '\n', { flag: 'wx' });
for (const file of fs.readdirSync(receiptRoot)) fs.chmodSync(path.join(receiptRoot, file), 0o444);
console.log(JSON.stringify({ receiptRoot: path.relative(repo, receiptRoot), ...exit, stdout: result.stdout, stderr: result.stderr }, null, 2));
process.exitCode = result.status ?? 1;
