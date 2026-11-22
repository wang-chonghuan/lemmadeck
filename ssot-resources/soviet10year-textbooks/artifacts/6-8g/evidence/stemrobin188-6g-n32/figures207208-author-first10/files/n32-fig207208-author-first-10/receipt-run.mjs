import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig207208-author-first-10');
const [name, outputsJson, ...argv] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(name) || !argv.length) throw new Error('Invalid invocation');
const receiptPath = path.join(owned, 'receipts', `${name}.json`);
if (fs.existsSync(receiptPath)) throw new Error('Preserve receipts; choose a new attempt name');
const outputs = JSON.parse(outputsJson).map(p => path.resolve(root, p));
if (outputs.some(p => !p.startsWith(`${owned}/`))) throw new Error('Output outside ownership');
fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const start = new Date().toISOString();
const result = spawnSync(argv[0], argv.slice(1), {
  cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
});
const stdout = path.join(owned, 'receipts', `${name}.stdout.txt`);
const stderr = path.join(owned, 'receipts', `${name}.stderr.txt`);
fs.writeFileSync(stdout, result.stdout || '');
fs.writeFileSync(stderr, result.stderr || '');
const receipt = {
  schema: 'same188-6/execution-receipt@1', argv, cwd: root,
  startedAt: start, finishedAt: new Date().toISOString(),
  actualExitCode: result.status, signal: result.signal,
  executionError: result.error?.message || null,
  streams: {
    stdout: { path: stdout, sha256: hash(stdout) },
    stderr: { path: stderr, sha256: hash(stderr) },
  },
  outputs: outputs.map(p => ({
    path: p, exists: fs.existsSync(p),
    sha256: fs.existsSync(p) ? hash(p) : null,
  })),
};
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
console.log(`Receipt: ${receiptPath}`);
process.exitCode = result.status ?? 1;
