import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9c';
const root = path.join(repo, raw, 'evidence/nov21-1846-n45-delivery');
const bind = file => {
  file = path.resolve(repo, file);
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const git = args => {
  const result = spawnSync('git', args, { cwd: repo, encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const firstReceipt = JSON.parse(fs.readFileSync(path.join(base,
  'stages/n45-first-narrow-tail-stage-nov21.receipt.json')));
assert.equal(firstReceipt.exitCode, 1);
assert.equal(git(['rev-parse', 'HEAD']).trim(), '39e5f6d1e747901724ba43964803ce011521d436');
assert.equal(git(['rev-parse', 'FETCH_HEAD']).trim(), '39e5f6d1e747901724ba43964803ce011521d436');
assert.equal(spawnSync('git', ['symbolic-ref', '-q', 'HEAD'], { cwd: repo }).status, 1);
const exceptions = [
  `${raw}/evidence/nov21-1846-source166-glyph/files/.tmp/stemrobin-184-six/source166-glyph-recovery/manifest.sha256.txt`,
  `${raw}/evidence/nov21-1846-source166/files/.tmp/stemrobin-184-six/stages/source166-active-full-template-layout-text-nov21.stdout`,
];
const exceptionBindings = exceptions.map(bind);
const tsv = fs.readFileSync(path.join(repo, exceptions[0]), 'utf8');
const rows = tsv.split('\n').filter(line => line && !line.startsWith('#'));
for (const line of rows) {
  // Keep empty fifth fields: they encode absent symlink targets, not prose spaces.
  const fields = line.split('\t');
  assert.equal(fields.length, 5);
  assert.match(fields[0], /^[a-f0-9]{64}$/);
  assert.match(fields[1], /^\d+$/);
}
const paths = git(['diff', '--cached', '--name-only']).trim().split('\n');
const allowed = file => [
  '.intentfold/tickets/STEMROBIN-184/plan.md',
  '.intentfold/tickets/STEMROBIN-184/usage.json',
  `${raw}/book.json`,
  `${raw}/editions/modern-us-neutral/book.json`,
].includes(file) || [
  `${raw}/pages/0164/`, `${raw}/pages/0165/`, `${raw}/pages/0166/`,
  `${raw}/lessons/ana9-c4-s2-n45/`,
  `${raw}/editions/modern-us-neutral/lessons/ana9-c4-s2-n45/`,
  ...['nov21-1846-source164165', 'nov21-1846-native164165',
    'nov21-1846-n45-math', 'nov21-1846-source166',
    'nov21-1846-source166-affected', 'nov21-1846-source166-glyph',
    'nov21-1846-n45-complete'].map(name => `${raw}/evidence/${name}/`),
].some(prefix => file.startsWith(prefix));
assert(paths.every(allowed));
assert(!paths.some(file => /(?:^|\/)\.env(?:$|[./])|pages\/(?:0104|0122|0135)\//.test(file)));
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const oldUsage = JSON.parse(git(['show', `HEAD:${usagePath}`]));
const stagedUsage = JSON.parse(git(['show', `:${usagePath}`]));
for (const [key, value] of Object.entries(oldUsage)) assert.deepEqual(stagedUsage[key], value);
assert.equal(stagedUsage.nov21_1846_n45_COMPLETE_retention.completeLessonDelta, 1);
const filtered = paths.filter(file => !exceptions.includes(file));
const whitespace = git(['diff', '--cached', '--check', '--', ...filtered]);
assert.equal(whitespace, '');
for (const row of exceptionBindings) {
  const staged = git(['show', `:${row.path}`]);
  assert.equal(crypto.createHash('sha256').update(staged).digest('hex'), row.sha256);
}
assert(!fs.existsSync(root));
fs.mkdirSync(root);
const files = [
  'stage-n45-narrow.mjs', 'recover-n45-delivery.mjs',
  ...['stdout', 'stderr', 'receipt.json'].map(suffix =>
    `stages/n45-first-narrow-tail-stage-nov21.${suffix}`),
];
const retained = files.map(file => {
  const origin = path.join(base, file);
  const target = path.join(root, 'files', file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(origin, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  return { origin: bind(origin), retained: bind(target) };
});
const record = {
  at: new Date().toISOString(), status: 'NARROW_STAGING_RECOVERY_PASS',
  firstFailure: bind(path.join(base, 'stages/n45-first-narrow-tail-stage-nov21.receipt.json')),
  diagnosisTextIntake: '29e600/cf1197; staged-stat739f7b truncated, not full intake',
  cause: 'Git whitespace check sees empty final TSV target fields and a frozen stdout blank EOF.',
  immutableWhitespaceExceptions: exceptionBindings,
  everyOtherStagedFileWhitespaceCheck: 'PASS',
  sourceOrEvidenceBytesChanged: 0, priorStagingReplays: 0,
  parentImagesOrDecodes: 0, protectedDirtStaged: false,
  allOriginalHeadUsageKeysPreserved: true, firstStagedFiles: paths.length,
  additionalRetainedRoot: `${raw}/evidence/nov21-1846-n45-delivery`,
  finish: 'review', completeGroup: false, retained,
};
const recordPath = path.join(root, 'recovery.json');
fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
const key = 'nov21_1846_n45_narrow_stage_technical_recovery';
assert(!Object.hasOwn(stagedUsage, key));
stagedUsage[key] = { ...record, receipt: bind(recordPath) };
// Supply the updated usage through stdin without changing the working file.
const blob = spawnSync('git', ['hash-object', '-w', '--stdin'], {
  cwd: repo, input: JSON.stringify(stagedUsage, null, 2) + '\n', encoding: 'utf8' });
assert.equal(blob.status, 0);
git(['update-index', '--add', '--cacheinfo', '100644', blob.stdout.trim(), usagePath]);
git(['add', '-f', '--', record.additionalRetainedRoot]);
git(['diff', '--cached', '--check', '--', usagePath, record.additionalRetainedRoot]);
const workingUsage = JSON.parse(fs.readFileSync(path.join(repo, usagePath)));
assert(!Object.hasOwn(workingUsage, key));
workingUsage[key] = stagedUsage[key];
fs.writeFileSync(path.join(repo, usagePath), JSON.stringify(workingUsage, null, 2) + '\n');
const progressPath = path.join(base, 'source-progress.json');
const progress = JSON.parse(fs.readFileSync(progressPath));
progress.n45.deliveryRecovery = { ...record, receipt: bind(recordPath) };
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(path.join(base, 'n45-narrow-stage.json'),
  JSON.stringify({ ...record, staged: git(['diff', '--cached', '--name-only']).trim().split('\n') },
    null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ status: record.status, firstFiles: paths.length,
  finalFiles: git(['diff', '--cached', '--name-only']).trim().split('\n').length,
  exactImmutableWhitespaceExceptions: 2, newEvidenceRoot: record.additionalRetainedRoot }));
