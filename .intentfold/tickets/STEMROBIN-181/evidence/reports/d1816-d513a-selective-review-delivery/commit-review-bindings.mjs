import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d513a-selective-review-delivery`;
const scope = JSON.parse(fs.readFileSync(`${O}/commit-scope.json`));
const git = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(repo, path.resolve(file));
const bytesFromIndex = file => execFileSync('git', ['show', `:${file}`], {
  cwd: repo, maxBuffer: 64 * 1024 * 1024,
});
assert.equal(git('rev-parse', 'HEAD'), scope.baseCommit);
for (const row of scope.selectiveBlobs) {
  assert.equal(hash(bytesFromIndex(row.file)), row.stagedSha256, row.file);
  assert.equal(hash(fs.readFileSync(row.file)), row.working.sha256, row.file);
}
for (const row of scope.retainedDependencies) {
  assert.equal(hash(bytesFromIndex(relative(row.path))), row.sha256, row.path);
}
const staged = git('diff', '--cached', '--name-only').split('\n');
const allowed = new Set([
  ...scope.selectiveBlobs.map(row => row.file),
  ...scope.retainedDependencies.map(row => relative(row.path)),
]);
assert(staged.every(file => allowed.has(file) || file.startsWith(`${O}/`)));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
const stageReceipt = `${T}/tmp/d1816-recovery/native/d513a-selective-stage-token-boundary-recovery`;
const target = `${O}/native/d513a-selective-stage-token-boundary-recovery`;
fs.mkdirSync(target, { recursive: true });
const additional = [];
for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt']) {
  fs.copyFileSync(`${stageReceipt}/${file}`, `${target}/${file}`, fs.constants.COPYFILE_EXCL);
  additional.push(`${target}/${file}`);
}
assert.equal(JSON.parse(fs.readFileSync(`${target}/receipt.json`)).exitCode, 0);
const retainedScript = `${O}/commit-review-bindings.mjs`;
fs.copyFileSync(`${T}/tmp/d1816-recovery/commit-d514-review-bindings.mjs`,
  retainedScript, fs.constants.COPYFILE_EXCL);
git('add', '--', ...additional, retainedScript);
git('diff', '--cached', '--check', '--',
  ...scope.selectiveBlobs.map(row => row.file), `${T}/review.md`, retainedScript);
git('commit', '--quiet', '-m',
  'STEMROBIN-181: repair exact asset bindings and prepare review with explicit holds');
console.log(JSON.stringify({
  commit: git('rev-parse', 'HEAD'), targetBranch: scope.targetBranch,
  scope: `${O}/commit-scope.json`, metadataFiles: scope.metadataFiles,
  pathFieldsRepaired: scope.exactPathFields.length,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
  coursesUnchanged: 146, pagesUnchanged: 577,
}));
