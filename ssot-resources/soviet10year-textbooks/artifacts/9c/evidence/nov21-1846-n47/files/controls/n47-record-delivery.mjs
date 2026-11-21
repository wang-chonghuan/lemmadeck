import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const progressPath = path.join(base, 'source-progress.json');
const progress = read(progressPath);
assert.equal(progress.n47.completeOffline, true);
assert.equal(progress.n47.completeLessonDelta, 1);
assert.equal(progress.n47.offline.closed, true);
const stages = [
  'n47-narrow-stage-first', 'n47-narrow-commit-first', 'n47-ordinary-ff-push-first',
].map(name => path.join(base, 'stages', `${name}.receipt.json`));
for (const file of stages) assert.equal(read(file).exitCode, 0);
const head = git('rev-parse', 'HEAD');
const parent = git('rev-parse', 'HEAD^');
assert.equal(parent, 'e6aa79ccce50e1edf4a8ed88285c1f72ce23bf82');
const remote = git('ls-remote', '--heads', 'origin', 'refs/heads/codex/STEMROBIN-184-textbooks');
assert.equal(remote.split(/\s+/)[0], head);
assert.equal(remote.split(/\s+/)[1], 'refs/heads/codex/STEMROBIN-184-textbooks');
assert.equal(git('rev-parse', 'refs/heads/codex/STEMROBIN-184-textbooks'),
  'bd853c8f2e1d762ce9b92d19dd4bc8eeb4bf434d');
assert.equal(git('diff', '--cached', '--name-only'), '');
const bookPath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/book.json';
const currentBook = read(path.join(root, bookPath));
const committedBook = JSON.parse(git('show', `HEAD:${bookPath}`));
assert.equal(currentBook.pages, 52);
assert.equal(committedBook.pages, 49);
const paths = git('diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD').split('\n');
assert(!paths.some(file => /(^|\/)\.env(?:$|\/)/.test(file)));
assert(!paths.some(file => /pages\/(0104|0122|0135)\//.test(file)));
const receipt = {
  schema: 'stemrobin1846/n47-ordinary-delivery@1', at: new Date().toISOString(),
  book: '9c', lesson: 'ana9-c4-s2-n47', finish: 'review',
  commit: head, previousHead: parent,
  targetBranch: 'codex/STEMROBIN-184-textbooks', remoteConfirmed: true,
  remoteActual: remote, ordinaryFastForwardPush: true, forceRebaseOrBranchSwitch: false,
  historicalLocalBranchUnchanged: 'bd853c8f2e1d762ce9b92d19dd4bc8eeb4bf434d',
  bookPages: { committed: 49, workingPreserved: 52, unrelatedPreserved: 3 },
  stages: stages.map(bind),
  evidence: progress.n47.evidence, completeLessonDelta: 1, strictCompliance: false,
  counts: progress.n47.counts, noHistoricalRecount: true,
  allOriginalFailHoldUnknownPreserved: true, parentNewImagesOrDecodes: 0,
  paidCredentialsDatabasePublicationMergeDeployOrTicketClosure: 0,
  next: 'Immediate actual serial SOURCE170; not a pause or scope completion',
};
const output = path.join(base, 'n47-delivery-parent-receipt.json');
fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
progress.n47.delivery = bind(output);
progress.n47.status = 'N47_NARROW_COMMIT_PUSH_REMOTE_CONFIRMED';
progress.status = 'n47 delivery complete; immediate serial SOURCE170 next';
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const usage = read(usagePath);
usage.nov21_1846_n47_delivered = receipt;
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify(receipt));
