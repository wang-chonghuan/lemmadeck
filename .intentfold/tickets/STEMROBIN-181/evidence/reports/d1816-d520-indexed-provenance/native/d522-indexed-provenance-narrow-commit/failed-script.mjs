import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const [outputName = 'd1816-d517-retained-provenance', stage = 'D518',
  previousStage = 'D515', base = '75c59ec87e02e6c47fb79a35548380c3dfa88184'] = process.argv.slice(2);
assert(/^[a-z0-9-]+$/.test(outputName));
assert(/^D\d+$/.test(stage) && /^D\d+$/.test(previousStage));
assert(/^[a-f0-9]{40}$/.test(base));
const O = `${T}/evidence/reports/${outputName}`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: hash(fs.readFileSync(file)) });
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024 }).trim();
const report = read(`${O}/repair.json`);
assert.equal(git('rev-parse', 'HEAD'), base);
assert.equal(git('diff', '--cached', '--name-only'), '');
const stagedMetadata = new Map();
const newDependencies = new Set();
for (const row of report.changes) {
  if (!stagedMetadata.has(row.file))
    stagedMetadata.set(row.file, JSON.parse(git('show', `HEAD:${row.file}`)));
  const currentParent = row.pointer.slice(0, -1).reduce((v, k) => v[k], read(row.file));
  const stageParent = row.pointer.slice(0, -1).reduce((v, k) => v[k], stagedMetadata.get(row.file));
  assert.equal(stageParent.sha256, row.expectedSha256);
  assert.equal(stageParent.path, row.oldPath);
  assert.equal(currentParent.path, row.target);
  if (spawnSync('git', ['cat-file', '-e', `HEAD:${row.target}`], { cwd: repo, stdio: 'ignore' }).status === 0) {
    assert.equal(hash(execFileSync('git', ['show', `HEAD:${row.target}`], {
      cwd: repo, maxBuffer: 64 * 1024 * 1024,
    })), row.expectedSha256, row.target);
  } else {
    assert.equal(bind(row.target).sha256, row.expectedSha256);
    assert(row.target.startsWith(`${T}/evidence/`));
    newDependencies.add(row.target);
  }
  stageParent.path = row.target;
}
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
const priorReviewPath = `${O}/before/review.md`;
assert.equal(bind(priorReviewPath).sha256, meter.currentResume1816[previousStage].review.sha256);
meter.currentResume1816[previousStage].review.path = path.resolve(priorReviewPath);
meter.currentResume1816[stage].review = bind(`${T}/review.md`);
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const workingMeterHash = bind(meterFile).sha256;
const stageMeter = JSON.parse(git('show', `HEAD:${meterFile}`));
stageMeter.currentResume1816.currentContinuation = meter.currentResume1816.currentContinuation;
stageMeter.currentResume1816[previousStage].review.path = meter.currentResume1816[previousStage].review.path;
stageMeter.currentResume1816[stage] = meter.currentResume1816[stage];
assert.equal(stageMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.equal(stageMeter.sourcePagesFinalized, 577);
assert.deepEqual(stageMeter.currentCheckpoint.completeUnbatchedCards, []);
const receipts = stage === 'D521'
  ? ['d519-retained-provenance-narrow-commit', 'd519-retained-provenance-nonforce-push',
    'd520-indexed-provenance-candidates', 'd521-indexed-provenance-paths']
  : ['d516-fig04-history-narrow-commit', 'd516-fig04-history-nonforce-push',
    'd517-readonly-retained-provenance-discovery', 'd518-exact-retained-provenance-paths'];
for (const name of receipts) {
  const source = `${T}/tmp/d1816-recovery/native/${name}`;
  const target = `${O}/native/${name}`;
  fs.mkdirSync(target, { recursive: true });
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    fs.copyFileSync(`${source}/${file}`, `${target}/${file}`, fs.constants.COPYFILE_EXCL);
  assert.equal(read(`${target}/receipt.json`).exitCode, 0);
}
fs.copyFileSync(`${T}/tmp/d1816-recovery/commit-d519-retained-provenance.mjs`,
  `${O}/commit-retained-provenance.mjs`, fs.constants.COPYFILE_EXCL);
const bytes = value => JSON.stringify(value, null, 2) + '\n';
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base: git('rev-parse', 'HEAD'), targetBranch: 'codex/STEMROBIN-181-textbooks',
  exactPathChanges: report.changes, assetsAlreadyPresentAtOriginalShaInBase: newDependencies.size === 0,
  newlyTrackedExactDependencies: [...newDependencies],
  meterPointers: [['currentResume1816', 'currentContinuation'], ['currentResume1816', stage],
    ['currentResume1816', previousStage, 'review', 'path']],
  meterWorkingSha256: workingMeterHash, meterStagedSha256: hash(bytes(stageMeter)),
  originalApprovalHashesStatusesAndSemanticsPreserved: true,
  unrelatedDirtyFieldsNotStaged: true, newCourses: 0, newPages: 0,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
}), { flag: 'wx' });
git('add', '--', O, `${T}/review.md`, ...newDependencies);
const stage = (file, content) => {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: repo, input: content, encoding: 'utf8',
  }).trim();
  git('update-index', '--cacheinfo', `100644,${blob},${file}`);
};
for (const [file, value] of stagedMetadata) stage(file, bytes(value));
stage(meterFile, bytes(stageMeter));
const allowed = new Set([...stagedMetadata.keys(), meterFile, `${T}/review.md`, ...newDependencies]);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => allowed.has(file) || file.startsWith(`${O}/`)));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
assert.equal(bind(meterFile).sha256, workingMeterHash);
git('diff', '--cached', '--check', '--', ...allowed);
git('commit', '--quiet', '-m',
  `STEMROBIN-181: resolve ${report.changes.length} provenance paths to exact retained evidence`);
console.log(JSON.stringify({ commit: git('rev-parse', 'HEAD'), metadataFiles: stagedMetadata.size,
  exactPathFields: report.changes.length, courses: 146, pages: 577,
  formalHandoffComplete: false }));
