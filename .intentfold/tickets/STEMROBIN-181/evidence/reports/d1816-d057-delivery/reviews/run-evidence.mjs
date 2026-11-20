import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const own = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d062-n22-review');
const stage = process.argv[2];
let command;
let args;
let receiptPath;
if (stage === 'prepare' || stage === 'finalize') {
  command = process.execPath;
  args = [path.join(own, 'build-evidence.mjs'), stage];
  receiptPath = path.join(own, `${stage}-receipt.json`);
} else {
  assert.ok(['fig-34', 'fig-35'].includes(stage));
  const notes = JSON.parse(fs.readFileSync(path.join(own, 'review-notes.json'), 'utf8'));
  const figure = notes.figureReview.find(f => f.figure === stage);
  command = path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  args = [
    path.join(W, '.agents/skills/ld-s10y-image/scripts/record_review.py'),
    '--spec', path.join(W, `.tmp/STEMROBIN-181/d1816-d057/n22-figure-author/modern-us-neutral/lessons/phy10-c1-s3-n22/figures/${stage}.spec.json`),
    '--render', path.join(own, `figures/${stage}.review-bound.render.json`),
    '--output', path.join(own, `figures/${stage}.review.json`),
    '--status', 'pass', '--notes', figure.recordNotes,
  ];
  receiptPath = path.join(own, `figures/${stage}.record-review-receipt.json`);
}
const startedAt = new Date().toISOString();
const result = spawnSync(command, args, {
  cwd: W,
  encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  maxBuffer: 8 * 1024 * 1024,
});
const receipt = {
  schema: 'STEMROBIN-181/independent-review-command-receipt@1',
  stage, cwd: W, command: [command, ...args],
  startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status,
  error: result.error?.message ?? null,
  stdout: result.stdout ?? '',
  stderr: result.stderr ?? '',
  writesRestrictedTo: own,
};
assert.ok(receiptPath.startsWith(`${own}/`));
fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
if (fs.existsSync(receiptPath)) {
  const prior = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert.notEqual(prior.exitCode, 0, 'Do not rerun a passed stage');
  let attempt = 1;
  let preserved = path.join(own, `${stage}-failure-${attempt}.json`);
  while (fs.existsSync(preserved)) preserved = path.join(own, `${stage}-failure-${++attempt}.json`);
  fs.renameSync(receiptPath, preserved);
  receipt.preservedPriorFailure = preserved;
}
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(receipt.stdout);
if (receipt.stderr) console.error(receipt.stderr);
process.exit(result.status ?? 1);
