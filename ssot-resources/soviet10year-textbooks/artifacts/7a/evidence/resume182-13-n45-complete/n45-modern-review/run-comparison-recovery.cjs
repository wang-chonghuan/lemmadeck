const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-review');
const receiptDir = path.join(own, 'RECEIPTS/comparison-RECOVERY1');
if (fs.existsSync(receiptDir)) throw new Error('Already attempted');
fs.mkdirSync(receiptDir, { recursive: true });
const command = ['node', path.join(own, 'inspect-current.cjs')];
const start = { cwd: root, command, startedAt: new Date().toISOString() };
fs.writeFileSync(path.join(receiptDir, 'start.json'), JSON.stringify(start, null, 2) + '\n', { flag: 'wx' });
const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' });
for (const stream of ['stdout', 'stderr']) {
  fs.writeFileSync(path.join(receiptDir, `${stream}.txt`), result[stream] || '', { flag: 'wx' });
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const receipt = { ...start, finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error ? String(result.error) : null,
  streams: ['stdout', 'stderr'].map(stream => ({ path: path.join(receiptDir, `${stream}.txt`),
    sha256: hash(path.join(receiptDir, `${stream}.txt`)) })),
  note: 'Reviewer read-only JSON/hash diagnostic only; not a producer/test rerun' };
fs.writeFileSync(path.join(receiptDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(result.stdout || '');
if (result.stderr) console.error(result.stderr);
process.exitCode = result.status === 0 ? 0 : 1;
