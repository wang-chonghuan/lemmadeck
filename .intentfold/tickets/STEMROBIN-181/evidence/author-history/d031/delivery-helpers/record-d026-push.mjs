import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  branch, cards, rawCards, stagingPath, pushPath, helperPaths, projectionPaths, sharedIndices,
  sourceIndex, bookRoot, bytes, sha256, git, exactSet, verifyBindings,
  assertAbsent, writeReceipt, assertContext, treeEntries, loadFinalization, relative,
  prepareModernIndex, prepareSourceIndex, assertN107Untouched, assertPristineStaging, inspectEvidenceIndex,
} from './stage-d026.mjs';

export async function successfulPushReceipt(file, commit, parent) {
  const data = await bytes(file);
  const value = JSON.parse(data);
  const remoteRef = `refs/heads/${branch}`;
  assert.equal(value.status, 'pass');
  assert.equal(value.exitCode, 0, 'Push must have explicitly succeeded');
  assert.equal(value.commit, commit);
  assert.equal(value.parent, parent);
  assert.equal(value.remote, 'origin');
  assert.equal(value.branch, branch);
  assert.ok(Array.isArray(value.args), 'Missing actual git push args');
  const refspec = value.args[3];
  assert.ok(refspec === `HEAD:${remoteRef}` || refspec === `${commit}:${remoteRef}`,
    'Only one explicit ordinary refspec is accepted');
  assert.deepEqual(value.args, ['push', '--porcelain', 'origin', refspec],
    'Only an ordinary push; no force, sync or alternative remote');
  assert.equal(typeof value.stdout, 'string', 'Missing actual successful push stdout');
  assert.equal(typeof value.stderr, 'string', 'Missing actual successful push stderr');
  const output = value.stdout.split(/\r?\n/);
  const urls = git(['remote', 'get-url', '--push', '--all', 'origin']).trim().split(/\r?\n/);
  assert.ok(output.some(line => urls.some(url => line === `To ${url}`)),
    'Successful push output must identify the configured origin push URL');
  const updates = output.filter(line => line.includes('\t'));
  assert.equal(updates.length, 1, 'Successful push must report exactly one ref update');
  const [flag, reportedRefspec, summary, ...extra] = updates[0].split('\t');
  assert.ok(!extra.length && (flag === ' ' || flag === '*'), 'Not an ordinary successful ref update');
  assert.equal(reportedRefspec, refspec);
  if (flag === '*') assert.equal(summary, '[new branch]');
  else {
    const range = /^([a-f0-9]{7,40})\.\.([a-f0-9]{7,40})(?: .*)?$/.exec(summary);
    assert.ok(range && commit.startsWith(range[2]), 'Push output does not bind the actual commit');
  }
  assert.ok(output.includes('Done'), 'Incomplete successful porcelain push output');
  return { binding: { path: relative(file), sha256: sha256(data) }, value };
}

export async function recordPush(commit, pushReceiptFile) {
  assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'Expected actual 40-character commit SHA');
  await assertAbsent(pushPath);
  assertContext(commit);
  assertPristineStaging('Commit must leave pristine staging; never reset new staging');
  const stagingBytes = await bytes(stagingPath);
  const stagingBinding = { path: stagingPath, sha256: sha256(stagingBytes) };
  const staging = JSON.parse(stagingBytes);
  assert.equal(staging.ticket, 'STEMROBIN-181');
  assert.equal(staging.batch, 'D026');
  assert.equal(staging.status, 'exact-owned-files-staged');
  assert.equal(staging.branch, branch);
  exactSet(staging.cards, cards, 'Exact three staged modern cards');
  assert.deepEqual(staging.rawCards, rawCards);
  assert.match(staging.parent ?? '', /^[a-f0-9]{40}$/);
  assert.equal(staging.headBefore, staging.parent);
  assert.deepEqual(git(['rev-list', '--parents', '-n', '1', commit]).trim().split(/\s+/),
    [commit, staging.headBefore], 'Exactly one ordinary commit with parent=headBefore; no merge/rebase');
  assert.equal(staging.sourceIndexPartial, true);
  assert.equal(staging.modernIndexPartial, true);
  assert.equal(staging.sharedWorkingIndicesUnchanged, true);
  assert.ok(Array.isArray(staging.files) && staging.files.length);
  assert.ok(Array.isArray(staging.helperBindings) && Array.isArray(staging.preservedWorkspace));
  exactSet(staging.helperBindings.map(row => row.path), helperPaths, 'Bound retained/new helper set');
  exactSet(staging.preservedWorkingIndices.map(row => row.path), sharedIndices, 'Preserved working indices');
  await verifyBindings([stagingBinding, staging.finalization, ...staging.helperBindings,
    ...staging.preservedWorkspace, ...staging.preservedWorkingIndices, ...staging.preservedN107]);
  const finalization = await loadFinalization(staging.finalization.path);
  assert.deepEqual(finalization.binding, staging.finalization);
  assert.deepEqual(finalization.value.counts, staging.counts);
  assert.deepEqual(finalization.value.currentSourceCounts, staging.currentSourceCounts);
  assert.deepEqual(finalization.sourceCountBasis, staging.sourceCountBasis);
  assert.deepEqual(await inspectEvidenceIndex(staging.parent, finalization.ownedFiles), staging.evidenceIndex,
    'All retained evidence index rows preserved; new rows explicitly manifest-bound');
  const manifest = new Map(finalization.ownedFiles.map(row => [row.path, row]));
  assert.ok(Array.isArray(staging.unchangedOwnedFiles));
  exactSet([
    ...staging.files.filter(row => !projectionPaths.includes(row.path)), ...staging.unchangedOwnedFiles,
  ].map(row => row.path), finalization.ownedFiles.filter(row => !projectionPaths.includes(row.path))
    .map(row => row.path), 'Complete owned manifest coverage: staged changes plus unchanged files');
  const recomputed = [
    await prepareModernIndex(staging.parent, finalization.ownedFiles),
    await prepareSourceIndex(staging.parent, finalization.ownedFiles),
  ];
  exactSet(staging.files.filter(row => row.partialIndex).map(row => row.path),
    projectionPaths, 'Both and only 9p partial indices');
  for (const projected of recomputed) {
    const saved = staging.files.find(row => row.path === projected.path);
    const { data, ...expected } = projected;
    for (const [field, value] of Object.entries(expected)) {
      assert.deepEqual(saved[field], value, `Recomputed projection differs: ${projected.path}/${field}`);
    }
    assert.equal(saved.workspaceSha256, manifest.get(saved.path)?.sha256,
      `Partial index working hash must be explicitly manifest-owned: ${saved.path}`);
  }
  assert.deepEqual(staging.indexProjections, staging.files.filter(row => row.partialIndex));
  const source = recomputed.find(row => row.path === sourceIndex);
  assert.deepEqual(staging.omittedUnrelatedRows, source.omittedUnrelatedRows);
  assert.deepEqual(staging.sourceCurrentIndexOmission, {
    path: sourceIndex, currentWorkspaceSha256: source.workspaceSha256,
    stagedBlobSha256: source.sha256, currentCounts: source.currentIndexCountsOmitted,
    projectedCounts: source.projectedCounts, omittedPagePaths: source.omittedWorkingPagePaths,
    omittedRows: source.omittedUnrelatedRows, wholesaleCurrentIndexNotStaged: true,
  }, 'Explicit source/current index omission receipt');
  exactSet(staging.omittedSharedIndices, sharedIndices.filter(file => !projectionPaths.includes(file)),
    'All 10p shared indices excluded');
  const committedPaths = git([
    'diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', '-z', staging.parent, commit,
  ]).split('\0').filter(Boolean);
  exactSet(committedPaths, staging.files.map(row => row.path), 'Actual committed D026 changed-file set');
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
    if (!projectionPaths.includes(row.path)) {
      assert.equal(row.partialIndex, false);
      assert.equal(row.stagedBlobSha256, manifest.get(row.path)?.sha256,
        `Commit outside explicit path/hash manifest: ${row.path}`);
      assert.equal(row.workspaceSha256, row.stagedBlobSha256);
    }
    assert.deepEqual(entries.get(row.path), { mode: row.mode, blob: row.stagedBlobSha },
      `Commit tree differs from stage receipt blob/mode: ${row.path}`);
    const committedSha256 = sha256(git(['show', `${commit}:${row.path}`], { encoding: null }));
    assert.equal(committedSha256, row.stagedBlobSha256, `Committed SHA256 mismatch: ${row.path}`);
    committedFiles.push({ ...row, committedSha256 });
  }
  for (const row of staging.unchangedOwnedFiles) {
    assert.equal(row.sha256, manifest.get(row.path)?.sha256);
    assert.equal(sha256(git(['show', `${commit}:${row.path}`], { encoding: null })), row.sha256,
      `Unchanged owned file differs in actual commit: ${row.path}`);
  }
  assert.deepEqual(assertN107Untouched(staging.parent, commit), staging.headN107,
    'HEAD n107 bytes remain exactly unchanged in the delivered tree');
  exactSet(git(['ls-tree', '-r', '--name-only', '-z', commit, '--', `${bookRoot}/pages`])
    .split('\0').filter(file => /^pages\/\d{4}\/page\.json$/.test(file.slice(`${bookRoot}/`.length))),
  source.pagePaths, 'Committed source page set excludes unrelated untracked pages');
  for (const input of source.inputs) assert.equal(
    sha256(git(['show', `${commit}:${input.path}`], { encoding: null })), input.sha256,
    `Committed source projection input differs: ${input.path}`);
  const workingBindings = staging.files.map(row => ({ path: row.path, sha256: row.workspaceSha256 }));
  await verifyBindings(workingBindings);
  const suppliedPush = pushReceiptFile ?
    await successfulPushReceipt(pushReceiptFile, commit, staging.parent) : null;
  const remoteRef = `refs/heads/${branch}`;
  let remoteOutput;
  let remoteQueryError;
  try {
    remoteOutput = git(['ls-remote', '--exit-code', '--refs', 'origin', remoteRef]);
  } catch (error) {
    // An observed absent branch is not a connectivity failure and cannot use receipt substitution.
    assert.ok(error.status !== 2 && suppliedPush,
      'Origin query failed; supply explicit successful ordinary git push stdout/stderr receipt');
    remoteQueryError = {
      status: error.status ?? null, message: error.message,
      stdout: String(error.stdout ?? ''), stderr: String(error.stderr ?? ''),
    };
  }
  if (remoteOutput !== undefined) assert.deepEqual(remoteOutput.trim().split(/\s+/), [commit, remoteRef],
    'Actual origin branch must equal commit; no tracking ref or earlier/future SHA substitution');
  assertContext(commit);
  assertPristineStaging('Concurrent staging; preserve it and stop');
  await verifyBindings([stagingBinding, finalization.binding, ...staging.helperBindings,
    ...staging.preservedWorkspace, ...workingBindings, ...(suppliedPush ? [suppliedPush.binding] : [])]);
  await writeReceipt(pushPath, {
    ticket: 'STEMROBIN-181', batch: 'D026',
    status: remoteOutput !== undefined ? 'ordinary-push-confirmed-by-actual-remote' :
      'ordinary-push-confirmed-by-explicit-successful-push-output',
    branch, parent: staging.parent, headBefore: staging.headBefore, commit,
    remote: 'origin', remoteRef, remoteOutput: remoteOutput ?? null,
    remoteQueryError: remoteQueryError ?? null, successfulPush: suppliedPush ?? null,
    cards, rawCards, staging: stagingBinding, finalization: finalization.binding,
    helperBindings: staging.helperBindings, committedFiles,
    counts: staging.counts, currentSourceCounts: staging.currentSourceCounts,
    sourceCountBasis: staging.sourceCountBasis, evidenceIndex: staging.evidenceIndex,
    sourceIndexPartial: true, modernIndexPartial: true, indexProjections: staging.indexProjections,
    preservedWorkingIndices: staging.preservedWorkingIndices, preservedN107: staging.preservedN107,
    headN107: staging.headN107, omittedUnrelatedRows: staging.omittedUnrelatedRows,
    sourceCurrentIndexOmission: staging.sourceCurrentIndexOmission,
    omittedSharedIndices: staging.omittedSharedIndices, sharedWorkingIndicesUnchanged: true,
    confirmedAt: new Date().toISOString(),
    limits: 'Receipt only. No push, commit, sync, rebase, image/browser jobs, or meter/completion writes.',
  });
  console.log(JSON.stringify({ receipt: pushPath, commit, remoteRef }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [execute, commit, receipt, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && commit && !extra.length,
    'PREPARE ONLY. Usage: node record-d026-push.mjs --execute <actualCommitSHA> [successfulPushJSONpath]');
  await recordPush(commit, receipt);
}
