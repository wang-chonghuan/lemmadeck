import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const root = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n46-delivery');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
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
const failedPrefix = path.join(base, 'stages/n46-narrow-stage-whitespace-recovery-nov21');
const failedReceipt = read(failedPrefix + '.receipt.json');
assert.equal(failedReceipt.exitCode, 1);
const failedStderr = fs.readFileSync(failedPrefix + '.stderr', 'utf8');
const copiedStderr = path.join(root, 'files/stages/n46-first-narrow-tail-stage-nov21.stderr');
assert(failedStderr.includes(path.relative(repo, copiedStderr) + ':6: trailing whitespace.'));
assert(failedStderr.includes('++[0] **\u5b9a\u7406** \n'));
const originalStderr = path.join(base, 'stages/n46-first-narrow-tail-stage-nov21.stderr');
assert.equal(bind(copiedStderr).sha256, bind(originalStderr).sha256);
const stagedStderr = git(['show', ':' + path.relative(repo, copiedStderr)]);
assert.equal(crypto.createHash('sha256').update(stagedStderr).digest('hex'),
  bind(copiedStderr).sha256);
const component = read(path.join(root, 'recovery.json'));
const stage = read(path.join(base, 'n46-narrow-stage.json'));
assert.equal(git(['rev-parse', 'HEAD']).trim(), stage.base);
assert.equal(git(['rev-parse', 'refs/heads/codex/STEMROBIN-184-textbooks']).trim(),
  stage.historicalBranch);
stage.protectedBindings.forEach(row =>
  assert.equal(bind(path.join(repo, row.path)).sha256, row.sha256));
const note = {
  at: new Date().toISOString(), status: 'N46_FINAL_NARROW_STAGING_PASS',
  originalComponentRecord: bind(path.join(root, 'recovery.json')),
  componentVerdictQualification: 'The original three immutable-output exceptions and all other initial files passed. That component record predates failure of its newly copied diagnostic stderr; it is not first-run complete staging approval.',
  secondFailure: { receipt: failedReceipt,
    exactStdout: fs.readFileSync(failedPrefix + '.stdout', 'utf8'),
    exactStderr: failedStderr, originalReceiptBinding: bind(failedPrefix + '.receipt.json'),
    originalStderrBinding: bind(failedPrefix + '.stderr') },
  fourthImmutableWhitespaceException: bind(copiedStderr),
  diagnosticLogMatchesOriginalFailureBytes: true,
  previouslyPassedChecksReplayed: 0, originalImmutableBytesChanged: 0,
  preservedFailures: 2, parentImagesOrDecodes: 0,
  extraCompleteLessonDelta: 0, protectedDirtStaged: false,
  historicalLocalBranchUnchanged: stage.historicalBranch,
  detached: true, finish: 'review', groupComplete: false,
};
const recipe = path.join(root, 'files/finish-n46-staging.mjs');
fs.copyFileSync(path.join(base, 'finish-n46-staging.mjs'), recipe, fs.constants.COPYFILE_EXCL);
fs.chmodSync(recipe, 0o444);
note.recipe = bind(recipe);
const file = path.join(root, 'diagnostic-recovery.json');
fs.writeFileSync(file, JSON.stringify(note, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const usage = JSON.parse(git(['show', `:${usagePath}`]));
const key = 'nov21_1846_n46_narrow_diagnostic_whitespace_recovery';
assert(!Object.hasOwn(usage, key));
usage[key] = { ...note, record: bind(file) };
const oid = git(['hash-object', '-w', '--stdin'], JSON.stringify(usage, null, 2) + '\n').trim();
git(['update-index', '--add', '--cacheinfo', '100644', oid, usagePath]);
git(['add', '-f', '--', path.relative(repo, file), path.relative(repo, recipe)]);
git(['diff', '--cached', '--check', '--', usagePath,
  path.relative(repo, file), path.relative(repo, recipe)]);
const workingPath = path.join(repo, usagePath), working = read(workingPath);
for (const entry of ['nov21_1846_n46_narrow_stage_technical_recovery', key]) {
  assert(!Object.hasOwn(working, entry));
  working[entry] = usage[entry];
}
fs.writeFileSync(workingPath, JSON.stringify(working, null, 2) + '\n');
const progressPath = path.join(base, 'source-progress.json'), progress = read(progressPath);
progress.n46.deliveryRecovery = { component, finalGate: note, record: bind(file) };
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
console.log(JSON.stringify({ status: note.status,
  stagedFiles: git(['diff', '--cached', '--name-only']).trim().split('\n').length,
  immutableWhitespaceExceptions: 4, originalFailuresPreserved: 2,
  parentImagesOrDecodes: 0, protectedDirtStaged: false }));
