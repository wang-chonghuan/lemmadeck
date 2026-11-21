import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const progress = read(progressPath), usage = read(usagePath);
assert(progress.n48.recovery && !progress.n48.assemblyEvidence);
assert.equal(progress.n48.recovery.rawPromotionAndModernizationApproved, false);
const target = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov21-1846-n48-assembly-recovery');
const receiptPath = path.join(base, 'n48-assembly-retention-parent-receipt.json');
assert(!fs.existsSync(target) && !fs.existsSync(receiptPath));
const originalHold = progress.n48.firstFailure.manifest;
assert.deepEqual(bind(path.join(root, originalHold.path)), originalHold);
const files = new Set(progress.n48.recovery.files.map(item => item.path));
for (const name of [
  'assemble-n48-recovery.py', 'check-n48-assembly-saved-output.mjs',
  'n48-controls.mjs', 'retain-n48-assembly.mjs', 'n48-recovery-intake-parent-receipt.json',
]) files.add(`.tmp/stemrobin-184-six/${name}`);
for (const stage of [
  'n48-continuation-identity-assembly-recovery-first',
  'n48-saved-assembly-text-check-recovery-first',
  'n48-assembly-recovery-intake-first',
]) for (const suffix of ['stdout', 'stderr', 'receipt.json']) {
  files.add(`.tmp/stemrobin-184-six/stages/${stage}.${suffix}`);
}
progress.n48.recovery.files.forEach(item => assert.deepEqual(bind(path.join(root, item.path)), item));
fs.mkdirSync(target);
const rows = [...files].map(relative => {
  const input = bind(path.join(root, relative));
  const output = path.join(target, 'files', relative);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(path.join(root, relative), output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, 0o444);
  assert.equal(bind(output).sha256, input.sha256);
  return { origin: relative, path: path.relative(target, output),
    bytes: input.bytes, sha256: input.sha256 };
});
const record = {
  schema: 'stemrobin1846/n48-partial-assembly-evidence@1', at: new Date().toISOString(),
  status: 'N48_RAW_ASSEMBLY_RECOVERY_RETAINED_ONLY_NO_COMPLETE_LESSON',
  rows, originalFirstFailureReferenceOnly: originalHold,
  earlierPackagesCopied: false, sourceReferences: progress.n48.firstFailure.sourceReferences,
  approvedScope: 'Current six-source-exercise text assembly and verified387continuation identity only',
  recoveryCheckFailure: progress.n48.recovery.originalRecoveryCheckFailure,
  scientificHolds: progress.n48.recovery.scientificHolds,
  originalFailedAssemblyAndCheckPreserved: true,
  sourceMathNativeGateReplays: 0, savedOutputCheckAssemblerReplays: 0,
  parentNewImagesOrDecodes: 0, parentPermanentBudget: '24/24 unchanged',
  hiddenImageInternals: 'UNKNOWN', strictCompliance: false, completeLessonDelta: 0,
  rawPromotionAndModernizationApproved: false, finish: 'review',
  databasePublicationGitMergeDeployOrTicketClosure: 0,
};
const manifest = path.join(target, 'manifest.json');
fs.writeFileSync(manifest, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
const freeze = directory => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.isDirectory()) freeze(path.join(directory, item.name));
  }
  fs.chmodSync(directory, 0o555);
};
freeze(target);
const receipt = { at: record.at, status: record.status, manifest: bind(manifest),
  filesRetained: rows.length, earlierPackagesCopied: false,
  completeLessonDelta: 0, parentNewImagesOrDecodes: 0 };
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
progress.n48.assemblyEvidence = receipt.manifest;
usage.nov21_1846_n48_assembly_recovery_retention = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify(receipt));
