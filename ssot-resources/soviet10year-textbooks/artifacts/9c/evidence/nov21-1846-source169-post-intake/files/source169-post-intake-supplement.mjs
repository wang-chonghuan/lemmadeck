import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const evidence = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence');
const target = path.join(evidence, 'nov21-1846-source169-post-intake');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: hash(bytes) };
};
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const progress = read(progressPath), usage = read(usagePath);
assert.equal(progress.source169.closed, true);
assert.equal(progress.source169.review.closed, true);
assert.equal(progress.source169.review.boundaryApproved, true);
assert(progress.source169.canonical);
assert(!fs.existsSync(target));
const packages = [
  'nov21-1846-source169', 'nov21-1846-source169-review-zero-view',
  'nov21-1846-source169-review-stage1', 'nov21-1846-source169-review-stage2',
];
const previous = new Map();
const references = packages.map(name => {
  const manifestPath = path.join(evidence, name, 'manifest.json');
  read(manifestPath).rows.forEach(row => previous.set(row.origin, {
    package: name, path: row.path, bytes: row.bytes, sha256: row.sha256,
  }));
  return bind(manifestPath);
});
const names = [
  'source169-parent-preflight.json', 'source169-dispatch-parent-receipt.json',
  'source169-author-parent-intake.json', 'source169-author-closure.json',
  'source169-review-zero-view-parent-intake.json',
  'source169-review-stage1-parent-intake.json', 'source169-review-stage2-release.json',
  'source169-review-stage2-parent-intake.json', 'source169-review-closure.json',
  'source169-canonical-retention.json', 'source169-controls.mjs', 'retain-source169.mjs',
  'source169-post-intake-supplement.mjs',
];
const stages = [
  'source169-parent-serial-preflight-v1', 'source169-actual-serial-dispatch-v1',
  'source169-parent-full-author-intake-nov21', 'source169-author-actual-close-nov21',
  'source169-independent-blind-dispatch-nov21',
  'source169-review-zero-view-hold-intake-nov21',
  'source169-parent-only-zero-limit-clarified-nov21',
  'source169-blind-stage1-full-intake-nov21',
  'source169-one-author-comparison-release-nov21',
  'source169-stage2-full-qualified-intake-nov21',
  'source169-reviewer-actual-closure-nov21',
  'source169-first-native-canonical-retain-nov21',
];
for (const stage of stages) {
  for (const suffix of ['receipt.json', 'stdout', 'stderr']) {
    names.push(`stages/${stage}.${suffix}`);
  }
}
fs.mkdirSync(target);
const rows = [], reused = [];
for (const name of names) {
  const input = path.join(base, name), binding = bind(input);
  const existing = previous.get(binding.path);
  if (existing && existing.sha256 === binding.sha256) {
    reused.push({ origin: binding.path, ...existing });
    continue;
  }
  const output = path.join(target, 'files', name);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, 0o444);
  rows.push({ origin: binding.path, path: path.relative(target, output),
    bytes: binding.bytes, sha256: binding.sha256 });
}
const manifest = {
  schema: 'stemrobin1846/post-intake-supplement@1',
  at: new Date().toISOString(),
  status: 'SOURCE169_NEW_CLOSURE_BOUNDARY_APPROVAL_CANONICAL_CONTROLS_RETAINED',
  rows, reused, references,
  scope: 'Custody supplement only; original manifests and FAIL/HOLD/UNKNOWN remain unchanged',
  parentNewImagesOrDecodes: 0, sourceReviewReplays: 0, nativeReplays: 0,
  knownTracked164169: 46, hiddenInternals: 'UNKNOWN',
  holds: progress.source169.holds,
  approvedScope: progress.source169.review.approvedScope,
  completeLessonDelta: 0, finish: 'review',
};
const manifestPath = path.join(target, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
const freeze = directory => {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (item.isDirectory()) freeze(path.join(directory, item.name));
  }
  fs.chmodSync(directory, 0o555);
};
freeze(target);
const receipt = { ...bind(manifestPath), filesRetained: rows.length,
  priorFilesReferenced: reused.length, parentNewImagesOrDecodes: 0 };
progress.source169.postIntakeSupplement = receipt;
usage.nov21_1846_source169_post_intake_supplement = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify(receipt));
