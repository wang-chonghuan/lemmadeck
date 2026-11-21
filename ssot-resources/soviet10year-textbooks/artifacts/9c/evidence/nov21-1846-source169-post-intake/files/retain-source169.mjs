import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), repo);
const base = path.join(repo, '.tmp/stemrobin-184-six');
const progressFile = path.join(base, 'source-progress.json');
const usageFile = path.join(repo, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(repo, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => {
  const actual = bind(path.resolve(repo, row.path));
  assert.equal(actual.bytes, row.bytes);
  assert.equal(actual.sha256, row.sha256);
  return actual;
};
const progress = read(progressFile), usage = read(usageFile);
const source = progress.source169;
assert.equal(source.closed, true);
assert.equal(source.review.closed, true);
assert.equal(source.review.approved, true);
assert.equal(source.review.boundaryApproved, true);
assert(source.review.stage2Intake);
assert(!source.canonical);
verify(source.intake);
verify(source.review.stage2Intake);
const native = path.join(base, 'source169-active/native/9c/pages/0169');
const canonical = path.join(repo,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0169');
assert(!fs.existsSync(canonical));
const originalRows = read(path.resolve(repo, source.intake.path)).files;
const inputs = ['page.md', 'page.json', 'audit.json'].map(name => {
  const file = path.join(native, name);
  const row = originalRows.find(item => path.resolve(repo, item.path) === file);
  assert(row, name);
  return verify(row);
});
const audit = read(path.join(native, 'audit.json'));
assert.deepEqual([audit.lines_printed, audit.lines_md], [23, 23]);
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.normalizations, []);
assert.deepEqual(audit.count_exclusions, []);
const page = read(path.join(native, 'page.json'));
assert.equal(page.blocks[0].kind, 'h3');
assert.deepEqual(page.blocks[0].lines, ['48. 有理分式函数的导数']);
fs.mkdirSync(canonical);
const files = inputs.map(row => {
  const target = path.join(canonical, path.basename(row.path));
  fs.copyFileSync(path.resolve(repo, row.path), target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  const retained = bind(target);
  assert.equal(retained.sha256, row.sha256);
  return retained;
});
const output = path.join(base, 'source169-canonical-retention.json');
const entry = {
  at: new Date().toISOString(),
  status: 'SOURCE169_FAITHFUL_FIRST_NATIVE_BYTES_RETAINED_N47_BOUNDARY_CONFIRMED',
  inputs, files, reviewIntake: source.review.stage2Intake,
  sourceFidelityScope: source.review.approvedScope,
  holdsPreserved: source.holds,
  sourceN48MathematicalDomainQualifications: 'Preserved separately; not full strict compliance or n48 delivery',
  firstNativeReplays: 0, newImagesOrDecodes: 0, parentPermanentBudget: '24/24',
  knownTracked164169: 46, hiddenInternals: 'UNKNOWN',
  completeLessonDelta: 0, groupComplete: false, finish: 'review',
};
fs.writeFileSync(output, JSON.stringify(entry, null, 2) + '\n',
  { flag: 'wx', mode: 0o444 });
source.canonical = bind(output);
source.status = entry.status;
progress.status = '1846 SOURCE169 faithful canonical bytes retained; n47 source boundary confirmed; dependent lesson gates remain';
progress.observed_at = entry.at;
const key = 'nov21_1846_source169_canonical_first_native_retention';
assert(!Object.hasOwn(usage, key));
usage[key] = entry;
fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usageFile, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ status: entry.status, files: files.length,
  nativeReplays: 0, newImagesOrDecodes: 0, completeLessonDelta: 0 }));
