import assert from 'node:assert/strict';
import {
  branch, cards, stagingPath, pushPath, helperPaths, sourceIndices, modernIndices,
  bytes, sha256, git, exactSet, verifyBindings, assertAbsent, writeReceipt,
  assertContext, treeEntries, loadFinalization, relative,
} from './stage-d025.mjs';

const [execute, commit, ...extra] = process.argv.slice(2);
assert.ok(execute === '--execute' && /^[a-f0-9]{40}$/.test(commit ?? '') && !extra.length,
  'PREPARE ONLY. Usage: node record-d025-push.mjs --execute <40charActualCommit>');
await assertAbsent(pushPath);
assertContext(commit);
const stagingBytes = await bytes(stagingPath);
const stagingBinding = { path: stagingPath, sha256: sha256(stagingBytes) };
const staging = JSON.parse(stagingBytes);
assert.equal(staging.ticket, 'STEMROBIN-181');
assert.equal(staging.batch, 'D025');
assert.equal(staging.status, 'exact-owned-files-staged');
assert.equal(staging.branch, branch);
exactSet(staging.cards, cards, 'three staged D025 cards');
assert.match(staging.parent ?? '', /^[a-f0-9]{40}$/);
assert.deepEqual(git(['rev-list', '--parents', '-n', '1', commit]).trim().split(/\s+/),
  [commit, staging.parent], 'Actual commit must have exactly the saved HEAD parent');
assert.equal(staging.bothSourceIndicesExplicit, true);
assert.equal(staging.bothModernIndicesPartial, true);
assert.equal(staging.sharedWorkingIndicesUnchanged, true);
assert.ok(Array.isArray(staging.files) && staging.files.length);
assert.ok(Array.isArray(staging.helperBindings) && Array.isArray(staging.preservedWorkspace));
exactSet(staging.helperBindings.map(row => row.path), helperPaths, 'bound helper set');
await verifyBindings([stagingBinding, staging.finalization, ...staging.helperBindings,
  ...staging.preservedWorkspace]);
const finalization = await loadFinalization(staging.finalization.path);
assert.deepEqual(finalization.binding, staging.finalization);
assert.deepEqual(finalization.value.counts, staging.counts);
assert.deepEqual(finalization.value.currentSourceCounts, staging.currentSourceCounts);
const manifest = new Map(finalization.ownedFiles.map(row => [row.path, row]));
assert.ok(Array.isArray(staging.unchangedOwnedFiles));
exactSet([
  ...staging.files.filter(row => !modernIndices.includes(row.path)),
  ...staging.unchangedOwnedFiles,
].map(row => row.path), finalization.ownedFiles.filter(row => !modernIndices.includes(row.path))
  .map(row => row.path), 'complete manifest coverage: staged changes plus unchanged owned files');
for (const row of staging.files) {
  assert.equal(relative(row.path), row.path, 'Boundary paths must be repository-relative');
  assert.match(row.stagedBlobSha256 ?? '', /^[a-f0-9]{64}$/);
  assert.match(row.workspaceSha256 ?? '', /^[a-f0-9]{64}$/);
  assert.match(row.stagedBlobSha ?? '', /^[a-f0-9]{40}$/);
  assert.ok(['100644', '100755'].includes(row.mode));
  assert.equal(row.sha256, row.stagedBlobSha256);
  assert.equal(row.workingSha256, row.workspaceSha256);
  if (modernIndices.includes(row.path)) {
    assert.equal(row.partialIndex, true);
    assert.equal(row.preservesUnrelatedWorkingBytes, true);
  } else {
    assert.equal(row.partialIndex, false);
    assert.equal(row.stagedBlobSha256, manifest.get(row.path)?.sha256,
      `Commit path/hash outside explicit manifest: ${row.path}`);
    assert.equal(row.workspaceSha256, row.stagedBlobSha256);
  }
}
exactSet(staging.files.filter(row => row.partialIndex).map(row => row.path),
  modernIndices, 'both partial modern indices');
for (const file of sourceIndices) {
  assert.ok(staging.files.some(row => row.path === file && row.sourceIndex === true &&
    row.partialIndex === false), `Missing full SOURCE manifest index: ${file}`);
}
assert.deepEqual(staging.indexProjections, staging.files.filter(row => row.partialIndex));
const committedPaths = git([
  'diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z', staging.parent, commit,
]).split('\0').filter(Boolean);
exactSet(committedPaths, staging.files.map(row => row.path), 'actual committed D025 diff-tree set');
const entries = treeEntries(commit, committedPaths);
const committedFiles = [];
for (const row of staging.files) {
  assert.deepEqual(entries.get(row.path), { mode: row.mode, blob: row.stagedBlobSha },
    `Commit tree differs from staged blob/mode: ${row.path}`);
  const committedSha256 = sha256(git(['show', `${commit}:${row.path}`], { encoding: null }));
  assert.equal(committedSha256, row.stagedBlobSha256, `Committed hash mismatch: ${row.path}`);
  committedFiles.push({ ...row, committedSha256 });
}
for (const row of staging.unchangedOwnedFiles) {
  assert.equal(row.sha256, manifest.get(row.path)?.sha256, `Unchanged manifest binding: ${row.path}`);
  assert.equal(sha256(git(['show', `${commit}:${row.path}`], { encoding: null })), row.sha256,
    `Unchanged owned output missing or different in actual commit: ${row.path}`);
}
const workingBindings = staging.files.map(row => ({ path: row.path, sha256: row.workspaceSha256 }));
await verifyBindings(workingBindings);
assertContext(commit);
// Main has already performed the ordinary push. This command only observes origin.
const remoteRef = `refs/heads/${branch}`;
const remoteOutput = git(['ls-remote', '--exit-code', '--refs', 'origin', remoteRef]);
assert.deepEqual(remoteOutput.trim().split(/\s+/), [commit, remoteRef],
  'Actual origin branch must equal the actual commit; no future or tracking-ref substitute');
assertContext(commit);
await verifyBindings([stagingBinding, finalization.binding, ...staging.helperBindings,
  ...staging.preservedWorkspace, ...workingBindings]);
await writeReceipt(pushPath, {
  ticket: 'STEMROBIN-181', batch: 'D025', status: 'ordinary-push-confirmed-by-actual-remote',
  branch, parent: staging.parent, commit, remote: 'origin', remoteRef, remoteOutput,
  cards, staging: stagingBinding, finalization: finalization.binding,
  helperBindings: staging.helperBindings, committedFiles,
  counts: staging.counts, currentSourceCounts: staging.currentSourceCounts,
  previousCompleteDeliveredCards: 77, newlyDeliveredCards: 3,
  completeDeliveredCardsAtPush: 80,
  bothSourceIndicesExplicit: true, bothModernIndicesPartial: true,
  indexProjections: staging.indexProjections, sharedWorkingIndicesUnchanged: true,
  confirmedAt: new Date().toISOString(),
  limits: 'Receipt only after actual remote confirmation. No push, meter/retention/completion writes or gate replay.',
});
console.log(JSON.stringify({ receipt: pushPath, commit, remoteRef, completeDeliveredCardsAtPush: 80 }));
