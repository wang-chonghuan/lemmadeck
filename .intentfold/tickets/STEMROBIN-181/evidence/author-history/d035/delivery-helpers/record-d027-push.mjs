import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { successfulPushReceipt } from './record-d026-push.mjs';
import {
  branch, fixedBase, cards, rawCards, stagingPath, pushPath, helperPaths, stagedProjectionPaths,
  projectionPaths, sharedIndices, sourceIndex, bookRoot, bytes, sha256, git, exactSet,
  verifyBindings, verifyWorkspace, assertAbsent, writeReceipt, assertContext, assertTicketContext,
  treeEntries, loadFinalization, relative, prepareModernIndex, prepareSourceIndex, prepareEvidenceIndex,
  assertN107Untouched, assertPristineStaging,
} from './stage-d027.mjs';

export async function recordPush(commit, successfulPushFile) {
  assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'Expected actual commit SHA');
  assert.ok(successfulPushFile, 'Actual successful ordinary git push stdout/stderr receipt is mandatory');
  await assertAbsent(pushPath);
  await assertTicketContext();
  assertContext(commit);
  assertPristineStaging('Require pristine staging after commit; do not reset concurrent staging');
  const stagingBytes = await bytes(stagingPath);
  const stagingBinding = { path: stagingPath, sha256: sha256(stagingBytes) };
  const staging = JSON.parse(stagingBytes);
  assert.equal(staging.ticket, 'STEMROBIN-181');
  assert.equal(staging.batch, 'D027');
  assert.equal(staging.status, 'exact-owned-files-staged');
  assert.equal(staging.branch, branch);
  assert.equal(staging.base, fixedBase);
  exactSet(staging.cards, cards, 'Exact staged D027 cards');
  assert.deepEqual(staging.rawCards, rawCards);
  assert.match(staging.parent ?? '', /^[a-f0-9]{40}$/);
  assert.equal(staging.headBefore, staging.parent);
  assert.deepEqual(git(['rev-list', '--parents', '-n', '1', commit]).trim().split(/\s+/),
    [commit, staging.parent], 'One ordinary commit whose parent equals stage HEAD; no merge/rebase');
  for (const field of ['sourceIndexPartial', 'modernIndexPartial', 'evidenceIndexPartial',
    'sharedWorkingIndicesUnchanged']) assert.equal(staging[field], true);
  assert.ok(Array.isArray(staging.files) && staging.files.length);
  exactSet(staging.helperBindings.map(row => row.path), helperPaths, 'Frozen helper set');
  exactSet(staging.preservedWorkingIndices.map(row => row.path), sharedIndices, 'Preserved shared indices');
  await verifyWorkspace([stagingBinding, staging.finalization, ...staging.helperBindings,
    ...staging.preservedWorkspace, ...staging.preservedWorkingIndices, ...staging.preservedN107]);
  const finalization = await loadFinalization(staging.finalization.path);
  assert.deepEqual(finalization.binding, staging.finalization);
  assert.deepEqual(staging.preservation, finalization.preservation.binding);
  assert.deepEqual(staging.preservedUnownedFiles, finalization.preservation.files);
  for (const field of ['counts', 'currentSourceCounts', 'sourceCountBasis', 'sourceDependencies'])
    assert.deepEqual(staging[field], finalization.value[field], `Frozen ${field}`);
  assert.deepEqual(staging.helperBindings, finalization.value.helperBindings);
  const manifest = new Map(finalization.ownedFiles.map(row => [row.path, row]));
  exactSet([
    ...staging.files.filter(row => !stagedProjectionPaths.includes(row.path)),
    ...staging.unchangedOwnedFiles,
  ].map(row => row.path), finalization.ownedFiles.filter(row => !stagedProjectionPaths.includes(row.path))
    .map(row => row.path), 'All owned ordinary files staged or unchanged in the actual commit');
  const recomputed = [
    await prepareModernIndex(staging.parent, finalization.ownedFiles),
    await prepareSourceIndex(staging.parent, finalization.ownedFiles),
    await prepareEvidenceIndex(staging.parent, finalization.ownedFiles, finalization.preservation),
  ];
  exactSet(staging.files.filter(row => row.partialIndex).map(row => row.path), stagedProjectionPaths,
    'Both 9p indices and only the projected evidence index');
  for (const projected of recomputed) {
    const saved = staging.files.find(row => row.path === projected.path);
    const { data, ...expected } = projected;
    for (const [field, value] of Object.entries(expected))
      assert.deepEqual(saved[field], value, `Actual projection differs: ${projected.path}/${field}`);
    assert.equal(saved.workspaceSha256, manifest.get(saved.path)?.sha256,
      'Projection binds preserved working bytes separately from staged bytes');
  }
  assert.deepEqual(staging.indexProjections, staging.files.filter(row => row.partialIndex));
  assert.deepEqual(staging.evidenceIndex, staging.files.find(row => row.evidenceIndex));
  const source = recomputed.find(row => row.path === sourceIndex);
  assert.deepEqual(staging.omittedUnrelatedRows, source.omittedUnrelatedRows);
  assert.deepEqual(staging.sourceCurrentIndexOmission, {
    path: sourceIndex, currentWorkspaceSha256: source.workspaceSha256, stagedBlobSha256: source.sha256,
    currentCounts: source.currentIndexCountsOmitted, projectedCounts: source.projectedCounts,
    omittedPagePaths: source.omittedWorkingPagePaths, omittedRows: source.omittedUnrelatedRows,
    wholesaleCurrentIndexNotStaged: true,
  });
  exactSet(staging.omittedSharedIndices, sharedIndices.filter(file => !projectionPaths.includes(file)),
    'No unowned 10p index staged');
  const committedPaths = git(['diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z',
    staging.parent, commit]).split('\0').filter(Boolean);
  exactSet(committedPaths, staging.files.map(row => row.path), 'Exact actually committed D027 boundary');
  const entries = treeEntries(commit, committedPaths);
  const committedFiles = [];
  for (const row of staging.files) {
    assert.equal(relative(row.path), row.path);
    assert.match(row.stagedBlobSha256 ?? '', /^[a-f0-9]{64}$/);
    assert.match(row.workspaceSha256 ?? '', /^[a-f0-9]{64}$/);
    assert.match(row.stagedBlobSha ?? '', /^[a-f0-9]{40}$/);
    assert.ok(['100644', '100755'].includes(row.mode));
    assert.equal(row.sha256, row.stagedBlobSha256);
    assert.equal(row.workingSha256, row.workspaceSha256);
    if (!stagedProjectionPaths.includes(row.path)) {
      assert.equal(row.partialIndex, false);
      assert.equal(row.stagedBlobSha256, manifest.get(row.path)?.sha256);
      assert.equal(row.workspaceSha256, row.stagedBlobSha256);
    }
    assert.deepEqual(entries.get(row.path), { mode: row.mode, blob: row.stagedBlobSha },
      `Commit blob/mode differs from stage: ${row.path}`);
    const committedSha256 = sha256(git(['show', `${commit}:${row.path}`], { encoding: null }));
    assert.equal(committedSha256, row.stagedBlobSha256);
    committedFiles.push({ ...row, committedSha256 });
  }
  for (const row of staging.unchangedOwnedFiles) {
    assert.equal(row.sha256, manifest.get(row.path)?.sha256);
    assert.equal(sha256(git(['show', `${commit}:${row.path}`], { encoding: null })), row.sha256);
  }
  assert.deepEqual(assertN107Untouched(staging.parent, commit), staging.headN107);
  exactSet(git(['ls-tree', '-r', '--name-only', '-z', commit, '--', `${bookRoot}/pages`])
    .split('\0').filter(file => /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length))),
  source.pagePaths, 'Actual source page set has no unowned local pages');
  for (const input of source.inputs) assert.equal(
    sha256(git(['show', `${commit}:${input.path}`], { encoding: null })), input.sha256,
    `Committed source projection input: ${input.path}`);
  const workingBindings = staging.files.map(row => ({ path: row.path, sha256: row.workspaceSha256 }));
  await verifyBindings(workingBindings);
  const suppliedPush = await successfulPushReceipt(successfulPushFile, commit, staging.parent);
  const remoteRef = `refs/heads/${branch}`;
  const remoteArgs = ['ls-remote', '--exit-code', '--refs', 'origin', remoteRef];
  const remoteOutput = git(remoteArgs);
  assert.deepEqual(remoteOutput.trim().split(/\s+/), [commit, remoteRef],
    'Actual origin must equal the actual commit; no tracking ref, fallback or fabricated remote');
  await assertTicketContext();
  assertContext(commit);
  assertPristineStaging('Concurrent staging; preserve it and stop');
  await verifyWorkspace([stagingBinding, finalization.binding, ...staging.helperBindings,
    ...staging.preservedWorkspace, ...workingBindings, suppliedPush.binding]);
  await writeReceipt(pushPath, {
    ticket: 'STEMROBIN-181', batch: 'D027',
    status: 'ordinary-push-confirmed-by-actual-remote-and-successful-push-output',
    branch, base: fixedBase, parent: staging.parent, headBefore: staging.headBefore, commit,
    remote: 'origin', remoteRef, remoteQuery: { args: remoteArgs, exitCode: 0, stdout: remoteOutput },
    remoteOutput, successfulPush: suppliedPush,
    cards, rawCards, staging: stagingBinding, finalization: finalization.binding,
    helperBindings: staging.helperBindings, committedFiles, unchangedOwnedFiles: staging.unchangedOwnedFiles,
    counts: staging.counts, currentSourceCounts: staging.currentSourceCounts,
    sourceCountBasis: staging.sourceCountBasis, sourceDependencies: staging.sourceDependencies,
    evidenceIndex: staging.evidenceIndex, sourceIndexPartial: true, modernIndexPartial: true,
    evidenceIndexPartial: true, indexProjections: staging.indexProjections,
    preservation: staging.preservation, preservedUnownedFiles: staging.preservedUnownedFiles,
    preservedWorkingIndices: staging.preservedWorkingIndices, preservedN107: staging.preservedN107,
    headN107: staging.headN107, omittedUnrelatedRows: staging.omittedUnrelatedRows,
    sourceCurrentIndexOmission: staging.sourceCurrentIndexOmission,
    omittedSharedIndices: staging.omittedSharedIndices, sharedWorkingIndicesUnchanged: true,
    completeDeliveredCardsUnchanged: 83, confirmedAt: new Date().toISOString(),
    limits: 'Receipt only; real successful push output AND actual ls-remote required. No push/commit/sync/rebase/reset, gate replay, image opens, DB or meter/completion writes.',
  });
  console.log(JSON.stringify({ receipt: pushPath, commit, remoteRef, deliveredUnchanged: 83 }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [execute, commit, receipt, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && commit && receipt && !extra.length,
    'PREPARE ONLY. Usage: node record-d027-push.mjs --execute <actualCommitSHA> <successfulPushJSONpath>');
  await recordPush(commit, receipt);
}
