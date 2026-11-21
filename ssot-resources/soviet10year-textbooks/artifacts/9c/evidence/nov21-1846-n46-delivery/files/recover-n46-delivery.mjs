import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9c';
const root = path.join(repo, raw, 'evidence/nov21-1846-n46-delivery');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  file = path.resolve(repo, file);
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const git = (args, input) => {
  const result = spawnSync('git', args, {
    cwd: repo, input, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const first = path.join(base, 'stages/n46-first-narrow-tail-stage-nov21.receipt.json');
assert.equal(read(first).exitCode, 1);
const stage = read(path.join(base, 'n46-narrow-stage.json'));
assert.equal(git(['rev-parse', 'HEAD']).trim(), stage.base);
assert.equal(git(['rev-parse', 'FETCH_HEAD']).trim(), stage.base);
assert.equal(git(['rev-parse', 'refs/heads/codex/STEMROBIN-184-textbooks']).trim(),
  stage.historicalBranch);
const paths = git(['diff', '--cached', '--name-only']).trim().split('\n');
assert.deepEqual(paths, stage.staged);
stage.protectedBindings.forEach(row => assert.equal(bind(row.path).sha256, row.sha256));
const exceptions = [
  `${raw}/evidence/nov21-1846-n46-complete/files/.tmp/stemrobin-184-six/stages/n46-first-prose-flow-nov21.stdout`,
  `${raw}/evidence/nov21-1846-source167/files/.tmp/stemrobin-184-six/stages/source167-active-first-native-text-review-nov21.stdout`,
  `${raw}/evidence/nov21-1846-source167/files/.tmp/stemrobin-184-six/stages/source167-active-postfreeze-full-inert-inputs-nov21.stdout`,
];
const exceptionBindings = exceptions.map(bind);
assert.equal(fs.readFileSync(path.join(repo, exceptions[0]), 'utf8')
  .split('\n')[0].endsWith(' '), true);
exceptions.slice(1).forEach(file =>
  assert.equal(fs.readFileSync(path.join(repo, file), 'utf8').endsWith('\n\n'), true));
exceptionBindings.forEach(row => {
  const staged = Buffer.from(git(['show', `:${row.path}`]));
  assert.equal(staged.length, row.bytes);
  assert.equal(crypto.createHash('sha256').update(staged).digest('hex'), row.sha256);
});
git(['diff', '--cached', '--check', '--', ...paths.filter(file => !exceptions.includes(file))]);
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const oldUsage = JSON.parse(git(['show', `HEAD:${usagePath}`]));
const stagedUsage = JSON.parse(git(['show', `:${usagePath}`]));
Object.entries(oldUsage).forEach(([key, value]) => assert.deepEqual(stagedUsage[key], value));
assert(!fs.existsSync(root));
fs.mkdirSync(root);
const retained = ['stage-n46-narrow.mjs', 'recover-n46-delivery.mjs', 'n46-narrow-stage.json',
  ...['stdout', 'stderr', 'receipt.json'].map(suffix =>
    `stages/n46-first-narrow-tail-stage-nov21.${suffix}`)].map(name => {
  const origin = path.join(base, name), destination = path.join(root, 'files', name);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(origin, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o444);
  assert.equal(bind(origin).sha256, bind(destination).sha256);
  return { origin: bind(origin), retained: bind(destination) };
});
const note = {
  at: new Date().toISOString(), status: 'N46_NARROW_WHITESPACE_RECOVERY_PASS',
  firstFailure: bind(first), originalStageFiles: paths.length,
  diagnosisIntake: ['a71957', '43d636', 'b9d50a', '549eed'],
  immutableWhitespaceExceptions: exceptionBindings,
  everyOtherStagedFileWhitespaceCheck: 'PASS', immutableBytesChanged: 0,
  passedStageReplays: 0, parentImagesOrDecodes: 0,
  originalHeadUsageKeysPreserved: true, protectedDirtStaged: false,
  historicalLocalBranchUnchanged: stage.historicalBranch,
  completeLessonDeltaAlreadyRecorded: 1, additionalCompleteLessonDelta: 0,
  groupComplete: false, finish: 'review', retained,
};
const record = path.join(root, 'recovery.json');
fs.writeFileSync(record, JSON.stringify(note, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
const key = 'nov21_1846_n46_narrow_stage_technical_recovery';
assert(!Object.hasOwn(stagedUsage, key));
stagedUsage[key] = { ...note, record: bind(record) };
const oid = git(['hash-object', '-w', '--stdin'],
  JSON.stringify(stagedUsage, null, 2) + '\n').trim();
git(['update-index', '--add', '--cacheinfo', '100644', oid, usagePath]);
git(['add', '-f', '--', path.relative(repo, root)]);
git(['diff', '--cached', '--check', '--', usagePath, path.relative(repo, root)]);
const working = read(path.join(repo, usagePath));
assert(!Object.hasOwn(working, key));
working[key] = stagedUsage[key];
fs.writeFileSync(path.join(repo, usagePath), JSON.stringify(working, null, 2) + '\n');
const progressFile = path.join(base, 'source-progress.json');
const progress = read(progressFile);
progress.n46.deliveryRecovery = { ...note, record: bind(record) };
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify({ status: note.status, firstFiles: paths.length,
  finalFiles: git(['diff', '--cached', '--name-only']).trim().split('\n').length,
  exactImmutableWhitespaceExceptions: 3, protectedDirtStaged: false,
  detached: true, newCompleteLessonDelta: 0 }));
