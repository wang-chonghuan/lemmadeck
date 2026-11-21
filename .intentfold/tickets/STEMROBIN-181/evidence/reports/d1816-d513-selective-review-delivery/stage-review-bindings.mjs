import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const E = `${T}/evidence/reports`;
const O = `${E}/d1816-d513-selective-review-delivery`;
const base = 'd66fa86e177df73dc2feefa14f6986434a9b6cf4';
const branch = 'codex/STEMROBIN-181-textbooks';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: hash(fs.readFileSync(file)) });
const relative = file => path.relative(repo, path.resolve(file));
const git = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const headBytes = file => execFileSync('git', ['show', `${base}:${file}`], {
  cwd: repo, maxBuffer: 64 * 1024 * 1024,
});
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const save = (file, value) => fs.writeFileSync(file, jsonBytes(value), { flag: 'wx' });
const getParent = (value, pointer) => pointer.slice(0, -1).reduce((v, key) => v[key], value);
const get = (value, pointer) => pointer.reduce((v, key) => v?.[key], value);
const set = (value, pointer, item) => {
  let parent = value;
  for (const key of pointer.slice(0, -1)) parent = parent[key] ??= {};
  parent[pointer.at(-1)] = structuredClone(item);
};
const allFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = `${dir}/${entry.name}`;
  assert(!entry.isSymbolicLink(), `Unexpected evidence symlink: ${file}`);
  return entry.isDirectory() ? allFiles(file) : [file];
});
assert.equal(git('rev-parse', 'HEAD'), base);
assert.equal(git('diff', '--cached', '--name-only'), '');
assert(!fs.existsSync(O));
assert.equal(read(`${T}/ticket.json`).branch, branch);
assert.equal(read(`${T}/ticket.json`).stage, 'developing');
const repairs = read(`${E}/d1816-d510-exact-spec-binding-repair/repair.json`);
const assets = read(`${E}/d1816-d511-exact-review-asset-paths/repair.json`);
const updates = [
  ...repairs.changes.map(row => ({ file: relative(row.after.path),
    pointer: ['spec', 'path'], oldPath: row.oldSpecBinding.path,
    asset: row.currentSpec, sha256: row.oldSpecBinding.sha256 })),
  ...assets.repaired.flatMap(row => row.changes.map(change => ({
    file: relative(row.after.path), pointer: change.pointer, oldPath: change.oldPath,
    asset: change.current, sha256: change.current.sha256,
  }))),
];
assert.equal(updates.length, 135);
const selective = new Map();
const originals = new Map();
const proof = [];
const verifiedAssets = new Map();
for (const row of updates) {
  if (!originals.has(row.file)) {
    const original = JSON.parse(headBytes(row.file));
    originals.set(row.file, original);
    selective.set(row.file, structuredClone(original));
  }
  const originalParent = getParent(originals.get(row.file), row.pointer);
  assert.equal(originalParent.path, row.oldPath, row.file);
  assert.equal(originalParent.sha256, row.sha256, row.file);
  assert.equal(bind(row.asset.path).sha256, row.sha256);
  const assetPath = relative(row.asset.path);
  assert(assetPath.startsWith('ssot-resources/'));
  if (!verifiedAssets.has(assetPath)) {
    assert.equal(hash(headBytes(assetPath)), row.sha256, `Asset not approved in HEAD: ${assetPath}`);
    verifiedAssets.set(assetPath, row.sha256);
  }
  const newPath = get(read(row.file), row.pointer);
  assert.equal(path.resolve(newPath), path.resolve(row.asset.path));
  set(selective.get(row.file), row.pointer, newPath);
  proof.push({ file: row.file, pointer: row.pointer, oldPath: row.oldPath,
    newPath, sha256Unchanged: row.sha256, assetAlreadyInBase: assetPath });
}
const meterPath = `${T}/production-meter.json`;
const workingMeter = read(meterPath);
const baseMeter = JSON.parse(headBytes(meterPath));
const commitMeter = structuredClone(baseMeter);
const meterPointers = [
  ['currentCheckpoint', 'fullProjectTestsOrBuildRunOnResume'],
  ['currentResume1816', 'currentContinuation'],
  ['currentResume1816', 'N153NonheldSubset', 'finalDurableBindings'],
  ['currentResume1816', 'N153NonheldSubset', 'nextMissingStage'],
  ...['D506', 'D508', 'D509', 'D510', 'D511', 'D512'].map(key => ['currentResume1816', key]),
];
for (const pointer of meterPointers) {
  const value = get(workingMeter, pointer);
  assert.notEqual(value, undefined);
  set(commitMeter, pointer, value);
}
assert.equal(commitMeter.sourcePagesFinalized, 577);
assert.equal(commitMeter.currentCheckpoint.completeDeliveredCards, 146);
assert.deepEqual(commitMeter.currentCheckpoint.completeUnbatchedCards, []);
assert.equal(commitMeter.currentResume1816.D512.formalHandoffComplete, false);
assert.equal(commitMeter.currentResume1816.D512.allAcceptanceCriteriaMet, false);
selective.set(meterPath, commitMeter);
const dirs = [
  `${E}/d1816-d474-n153-approved-subset`,
  `${E}/d1816-d482-current-approved-progress`,
  `${E}/d1816-d508-n153-final-bindings`,
  `${E}/d1816-d510-exact-spec-binding-repair`,
  `${E}/d1816-d511-exact-review-asset-paths`,
  `${E}/d1816-d512-review-preparation`,
];
for (const dir of dirs.slice(0, 2)) {
  for (const row of read(`${dir}/retained-progress.json`).retained)
    assert.equal(bind(row.path).sha256, row.sha256, row.path);
}
const workingBindings = [...selective.keys()].map(bind);
fs.mkdirSync(O, { recursive: true });
const beforeMeterPath = `${T}/tmp/d1816-recovery/d506-before-continuation.production-meter.json`;
fs.copyFileSync(beforeMeterPath, `${O}/d506-before-continuation.production-meter.json`, fs.constants.COPYFILE_EXCL);
fs.copyFileSync(`${T}/tmp/d1816-recovery/stage-d513-review-bindings.mjs`,
  `${O}/stage-review-bindings.mjs`, fs.constants.COPYFILE_EXCL);
const native = `${T}/tmp/d1816-recovery/native/d512-review-package-and-affected-bindings`;
fs.mkdirSync(`${O}/native/d512-review-package-and-affected-bindings`, { recursive: true });
for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  fs.copyFileSync(`${native}/${file}`, `${O}/native/d512-review-package-and-affected-bindings/${file}`,
    fs.constants.COPYFILE_EXCL);
const normalFiles = [...new Set([...dirs.flatMap(allFiles), `${T}/review.md`])];
const snapshots = new Map(normalFiles.map(file => [file, fs.readFileSync(file)]));
save(`${O}/commit-scope.json`, {
  stage: 'D513', status: 'SELECTIVE_PATH_BINDINGS_AND_REVIEW_PREPARATION_ONLY',
  baseCommit: base, targetBranch: branch, checkoutDetached: git('rev-parse', '--abbrev-ref', 'HEAD') === 'HEAD',
  otherWorktreesOrBranchRefsModified: false, branchOrWorktreeCreated: false,
  metadataFiles: originals.size, exactPathFields: proof,
  boundAssetsAlreadyInBase: [...verifiedAssets].map(([file, sha256]) => ({ file, sha256 })),
  meterPointers, meterCountersUnchanged: { courses: 146, pages: 577, unbatched: [] },
  meterDescriptionNormalization: 'D500 did not run global checks; D509 did. No formal handoff completed.',
  originalD506MeterAlias: { original: bind(beforeMeterPath),
    retained: bind(`${O}/d506-before-continuation.production-meter.json`) },
  selectiveBlobs: [...selective].map(([file, value]) => ({
    file, working: bind(file), stagedSha256: hash(jsonBytes(value)),
    unrelatedWorkingFieldsNotStaged: true,
  })),
  retainedDependencies: normalFiles.map(bind),
  originalGlobalFailuresRetained: true, contentOrDisplayReviewReplayed: false,
  formalHandoffComplete: false, allAcceptanceCriteriaMet: false,
  newCompleteCourses: 0, newSourcePages: 0,
  paidCalls: 0, imageOpens: 0, databaseWrites: false,
  merge: false, deploy: false, closure: false, forcePush: false,
});
for (const file of allFiles(O)) snapshots.set(file, fs.readFileSync(file));
for (const [file, value] of selective) snapshots.set(file, jsonBytes(value));
const secretPattern = /postgres(?:ql)?:\/\/[^\s"'<>]+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|AKIA[A-Z0-9]{16}|authorization["': =]+Bearer\s+[A-Za-z0-9._-]{20,}/i;
for (const [file, bytes] of snapshots) {
  assert(!/(^|\/)\.env(?:$|\/)/.test(file), 'Never stage environment files');
  if (/\.(?:json|md|txt|mjs|js|html|svg|py)$/.test(file))
    assert(!secretPattern.test(bytes.toString('utf8')), `Potential credential in staged evidence: ${file}`);
}
for (const [file, bytes] of snapshots) {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: repo, encoding: 'utf8', input: bytes,
  }).trim();
  git('update-index', '--add', '--cacheinfo', `100644,${blob},${file}`);
}
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => snapshots.has(file)), 'Unexpected staged files');
for (const row of workingBindings) assert.equal(bind(row.path).sha256, row.sha256);
git('diff', '--cached', '--check', '--', ...selective.keys(), `${T}/review.md`);
console.log(JSON.stringify({
  scope: bind(`${O}/commit-scope.json`), stagedFiles: staged.length,
  changedMetadata: originals.size, exactPathFields: updates.length,
  unrelatedWorkingFilesAndFieldsPreserved: true, summary: git('diff', '--cached', '--shortstat'),
  formalHandoffComplete: false,
}));
