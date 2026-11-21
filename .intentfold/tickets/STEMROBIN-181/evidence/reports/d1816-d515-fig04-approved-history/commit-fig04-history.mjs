import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d515-fig04-approved-history`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024 }).trim();
const report = read(`${O}/repair.json`);
const file = path.relative(repo, report.independentReviewAfter.path);
const base = git('rev-parse', 'HEAD');
assert.equal(base, 'ede9fa9c49ce4fca39bd993b4dbf69a332483a76');
assert.equal(git('diff', '--cached', '--name-only'), '');
const baseMetadata = JSON.parse(git('show', `HEAD:${file}`));
const workingMetadata = read(file);
const commitMetadata = structuredClone(baseMetadata);
assert.equal(baseMetadata.spec.sha256, report.approvedSha256Unchanged);
commitMetadata.spec.path = workingMetadata.spec.path;
assert.deepEqual(commitMetadata, workingMetadata);
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const commitMeter = JSON.parse(git('show', `HEAD:${meterFile}`));
commitMeter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation;
commitMeter.currentResume1816.D512.review.path = meter.currentResume1816.D512.review.path;
commitMeter.currentResume1816.D515 = meter.currentResume1816.D515;
assert.equal(commitMeter.sourcePagesFinalized, 577);
assert.equal(commitMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(commitMeter.currentCheckpoint.completeUnbatchedCards, []);
const beforeMeterHash = hash(fs.readFileSync(meterFile));
const native = `${T}/tmp/d1816-recovery/native/d515-fig04-approved-history-binding`;
fs.mkdirSync(`${O}/native`, { recursive: true });
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  fs.copyFileSync(`${native}/${name}`, `${O}/native/${name}`, fs.constants.COPYFILE_EXCL);
assert.equal(read(`${O}/native/receipt.json`).exitCode, 0);
fs.copyFileSync(`${T}/tmp/d1816-recovery/commit-d516-fig04-history.mjs`,
  `${O}/commit-fig04-history.mjs`, fs.constants.COPYFILE_EXCL);
const bytes = value => JSON.stringify(value, null, 2) + '\n';
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base, branchTarget: 'codex/STEMROBIN-181-textbooks', metadata: file,
  metadataPointers: [['spec', 'path']],
  meterPointers: [['currentResume1816', 'currentContinuation'],
    ['currentResume1816', 'D512', 'review', 'path'], ['currentResume1816', 'D515']],
  meterWorkingSha256: beforeMeterHash, stagedMeterSha256: hash(bytes(commitMeter)),
  restoredApprovedSpec: report.restoredApprovedResource,
  countersUnchanged: { courses: 146, pages: 577, unbatched: [] },
  unrelatedDirtyFieldsPreserved: true, noApprovalHashChanges: true,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
}), { flag: 'wx' });
git('add', '--', O, `${T}/review.md`, path.relative(repo, report.restoredApprovedResource.path));
const stage = (file, content) => {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: repo, input: content, encoding: 'utf8',
  }).trim();
  git('update-index', '--cacheinfo', `100644,${blob},${file}`);
};
stage(file, bytes(commitMetadata));
stage(meterFile, bytes(commitMeter));
const allowed = new Set([file, meterFile, `${T}/review.md`,
  path.relative(repo, report.restoredApprovedResource.path)]);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => allowed.has(file) || file.startsWith(`${O}/`)));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
assert.equal(hash(fs.readFileSync(meterFile)), beforeMeterHash);
git('diff', '--cached', '--check', '--', file, meterFile, `${T}/review.md`);
git('commit', '--quiet', '-m',
  'STEMROBIN-181: bind fig04 historical review to original approved spec bytes');
console.log(JSON.stringify({ commit: git('rev-parse', 'HEAD'), stagedFiles: staged.length,
  approvedShaUnchanged: report.approvedSha256Unchanged, courses: 146, pages: 577,
  formalHandoffComplete: false }));
