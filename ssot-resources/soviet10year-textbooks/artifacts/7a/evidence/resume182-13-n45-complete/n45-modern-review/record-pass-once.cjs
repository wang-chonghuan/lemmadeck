const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const own = path.join(base, 'n45-modern-review');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (read(path.join(own, 'comparison.json')).status !== 'pass' ||
    read(path.join(own, 'review.json')).status !== 'pass') {
  throw new Error('Independent comparison and visual/text adjudication must both pass first');
}
const receipts = [];
for (const verdict of read(path.join(own, 'review.json')).figures) {
  if (verdict.status !== 'pass') throw new Error(`Not passed: ${verdict.figure}`);
  const id = verdict.figure;
  const candidateDir = path.join(base, 'n45-modern-figure-author/FINAL', id);
  const spec = path.join(candidateDir, `${id}.spec.json`);
  const render = path.join(candidateDir, `${id}.render.json`);
  const output = path.join(own, `${id}.review.json`);
  const receiptDir = path.join(own, 'RECEIPTS', `${id}-record-review-FIRST`);
  if (fs.existsSync(receiptDir) || fs.existsSync(output)) throw new Error(`Already attempted: ${id}`);
  fs.mkdirSync(receiptDir, { recursive: true });
  const command = ['python3', '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', spec, '--render', render, '--output', output,
    '--status', 'pass', '--notes', verdict.recordNotes];
  const start = { cwd: root, command, startedAt: new Date().toISOString(),
    specSha256: hash(spec), renderSha256: hash(render),
    independentReviewSha256: hash(path.join(own, 'review.json')) };
  fs.writeFileSync(path.join(receiptDir, 'start.json'), JSON.stringify(start, null, 2) + '\n', { flag: 'wx' });
  const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8' });
  for (const stream of ['stdout', 'stderr']) {
    fs.writeFileSync(path.join(receiptDir, `${stream}.txt`), result[stream] || '', { flag: 'wx' });
  }
  const receipt = { ...start, finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error ? String(result.error) : null,
    streams: ['stdout', 'stderr'].map(stream => ({
      path: path.join(receiptDir, `${stream}.txt`),
      sha256: hash(path.join(receiptDir, `${stream}.txt`))
    })),
    output: fs.existsSync(output) ? { path: output, sha256: hash(output) } : null,
    specUnchanged: hash(spec) === start.specSha256,
    renderUnchanged: hash(render) === start.renderSha256,
    note: 'record_review.py invokes validate() in-process; no standalone validator, renderer, test or browser call'
  };
  fs.writeFileSync(path.join(receiptDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
  receipts.push({ figure: id, exitCode: result.status, receipt: path.join(receiptDir, 'receipt.json') });
  console.log(result.stdout || '');
  if (result.status !== 0) {
    console.error(result.stderr || '');
    process.exitCode = 1;
    break;
  }
}
fs.writeFileSync(path.join(own, 'record-review-commands.json'), JSON.stringify(receipts, null, 2) + '\n',
  { flag: 'wx' });
