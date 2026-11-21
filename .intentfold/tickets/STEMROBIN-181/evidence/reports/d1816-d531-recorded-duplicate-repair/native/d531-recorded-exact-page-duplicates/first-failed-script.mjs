import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d531-recorded-duplicate-repair`;
const originalFailure = `${T}/evidence/reports/d1816-d512-review-preparation/native/d509-review-resource-boundary-audit/stderr.txt`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(fs.readFileSync(file)) });
const write = (name, value) => fs.writeFileSync(`${O}/${name}`, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const prefix = 'FAIL page-level duplicate figure: ';
const recorded = [...new Set(fs.readFileSync(originalFailure, 'utf8').split('\n')
  .filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length)))];
assert.equal(recorded.length, 81);
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const candidates = recorded.map(original => {
  const matched = original.match(/^ssot-resources\/soviet10year-textbooks\/artifacts\/(9p|10p)\/pages\/(\d{4})\/figures\/(fig-\d+\.(png|svg))$/);
  assert(matched, original);
  const canonical = `ssot-resources/soviet10year-textbooks/artifacts/${matched[1]}/figures/${matched[3]}`;
  const exists = fs.existsSync(original), canonicalExists = fs.existsSync(canonical);
  const originalBinding = exists ? bind(original) : null;
  const canonicalBinding = canonicalExists ? bind(canonical) : null;
  const exact = exists && canonicalExists && originalBinding.sha256 === canonicalBinding.sha256;
  const tracked = spawnSync('git', ['ls-files', '--error-unmatch', '--', original], { cwd: repo, stdio: 'ignore' }).status === 0;
  const headBytes = tracked ? execFileSync('git', ['show', `HEAD:${original}`], { cwd: repo, maxBuffer: 8 * 1024 * 1024 }) : null;
  const originalDirty = tracked && hash(headBytes) !== originalBinding?.sha256;
  return { original, canonical, originalBinding, canonicalBinding, tracked, originalDirty,
    pageDirectory: path.dirname(path.dirname(original)), exact,
    status: !exists ? 'ALREADY_REMOVED_PRESERVED_PREVIOUSLY' : !canonicalExists
      ? 'CANONICAL_MISSING_KEEP_LOCAL_DRAFT' : !exact ? 'DIFFERENT_BYTES_KEEP_LOCAL_DRAFT'
      : originalDirty ? 'DIRTY_TRACKED_BYTES_KEEP_LOCAL_DRAFT' : 'EXACT_DUPLICATE_READY_TO_RETAIN_AND_REMOVE' };
});
const ready = candidates.filter(row => row.status === 'EXACT_DUPLICATE_READY_TO_RETAIN_AND_REMOVE');
assert.equal(ready.length, 48);
assert.equal(ready.filter(row => row.tracked).length, 34);
write('plan.json', {
  stage: 'D531', scope: 'Only page-level duplicates named by the retained D509 failure, not a fresh corpus audit.',
  originalFailure: bind(originalFailure), recorded: recorded.length, ready: ready.length,
  trackedReady: 34, untrackedReady: 14, unchangedDrafts: candidates.filter(row => row.originalBinding && !ready.includes(row)),
  candidates, approvalOrSourceFidelityClaim: false, globalAuditReplayed: false,
});
const patterns = [...new Set(ready.flatMap(row => [row.original,
  row.original.slice(row.original.indexOf('/pages/') + 1)]))];
fs.writeFileSync(`${O}/dependency-patterns.txt`, patterns.join('\n') + '\n', { flag: 'wx' });
const dependencySearch = spawnSync('rg', ['--json', '--fixed-strings', '--file', `${O}/dependency-patterns.txt`,
  '--glob', '*.json', '--glob', '*.md',
  'ssot-resources/soviet10year-textbooks/artifacts/9p',
  'ssot-resources/soviet10year-textbooks/artifacts/10p'], { cwd: repo, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
assert([0, 1].includes(dependencySearch.status), dependencySearch.stderr);
const matches = dependencySearch.stdout.trim() ? dependencySearch.stdout.trim().split('\n')
  .map(line => JSON.parse(line)).filter(row => row.type === 'match') : [];
write('dependencies.json', { command: ['rg', '48 exact recorded paths and their page-relative equivalents'],
  exitCode: dependencySearch.status, stderr: dependencySearch.stderr, matches,
  scope: 'Exact removed-path dependency scan only; no old tree/index search or source/semantic review.' });
assert.equal(matches.length, 0, 'Persistent metadata depends on a removed path; do not move without rebinding.');
const owners = [...new Set(ready.map(row => row.pageDirectory))].flatMap(directory => ['page.json', 'page.md']
  .map(name => `${directory}/${name}`).filter(fs.existsSync)).map(bind);
for (const row of ready) {
  for (const owner of owners.filter(item => item.path.startsWith(`${row.pageDirectory}/`)))
    assert(!fs.readFileSync(owner.path, 'utf8').includes(`figures/${path.basename(row.original)}`),
      `${owner.path} has a relative page-level dependency`);
}
const moved = [];
for (const row of ready) {
  assert.equal(bind(row.original).sha256, row.originalBinding.sha256);
  assert.equal(bind(row.canonical).sha256, row.originalBinding.sha256);
  const backup = `${O}/before/${row.original}`;
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  assert(!fs.existsSync(backup));
  fs.renameSync(row.original, backup);
  assert.equal(bind(backup).sha256, row.originalBinding.sha256);
  moved.push({ ...row, backup: bind(backup) });
}
for (const owner of owners) assert.equal(bind(owner.path).sha256, owner.sha256);
for (const row of moved) {
  assert(!fs.existsSync(row.original));
  assert.equal(bind(row.canonical).sha256, row.canonicalBinding.sha256);
}
const unresolved = candidates.filter(row => row.originalBinding && !ready.includes(row));
assert.equal(unresolved.length, 31);
for (const row of unresolved) assert.equal(bind(row.original).sha256, row.originalBinding.sha256);
write('repair.json', {
  stage: 'D531', status: '48_EXACT_RECORDED_DUPLICATES_RETAINED_AND_REMOVED',
  originalFailure: bind(originalFailure), changes: moved, unchangedPageMetadata: owners,
  originalCanonicalBytesUnchanged: true, backedUpBytesVerified: true,
  removedDuplicateFiles: 48, trackedRemovals: 34, untrackedCopiesRetained: 14,
  remainingRecordedDraftFiles: 31, remainingDrafts: unresolved,
  scopeMechanicalCheck: 'PASS', wholeResourceAuditPassed: false,
  sourceOrContentApprovalsInherited: false, courseOrPageMeterDelta: 0,
  imagesOpened: 0, globalAuditReplayed: false, sharedDatabaseWrites: false,
});
fs.copyFileSync(import.meta.filename, `${O}/repair-recorded-duplicates.mjs`, fs.constants.COPYFILE_EXCL);
console.log(JSON.stringify({ stage: 'D531', removedExactDuplicates: 48, tracked: 34,
  untrackedBackups: 14, remainingLocalDraftFiles: 31, imagesOpened: 0,
  wholeResourceGatePassed: false }));
