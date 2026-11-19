const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const own = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n45-modern-review/output-binding');
const receipts = path.join(own, 'RECEIPTS/output-binding-FIRST');
if (fs.existsSync(receipts)) throw new Error('Already attempted');
fs.mkdirSync(receipts, { recursive: true });
const command = ['node', path.join(own, 'check-bindings.cjs')];
const start = { cwd: root, command, startedAt: new Date().toISOString() };
fs.writeFileSync(path.join(receipts, 'start.json'), JSON.stringify(start, null, 2) + '\n', { flag: 'wx' });
const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' });
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const stream of ['stdout', 'stderr']) {
  fs.writeFileSync(path.join(receipts, `${stream}.txt`), result[stream] || '', { flag: 'wx' });
}
const receipt = { ...start, finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error ? String(result.error) : null,
  streams: ['stdout', 'stderr'].map(stream => ({
    path: path.join(receipts, `${stream}.txt`), sha256: hash(path.join(receipts, `${stream}.txt`))
  })),
  scope: 'New affected-only JSON/hash comparison; no producer/validator/render/parser/image/source-review calls'
};
fs.writeFileSync(path.join(receipts, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(result.stdout || '');
if (result.stderr) console.error(result.stderr);
process.exitCode = result.status === 0 ? 0 : 1;
