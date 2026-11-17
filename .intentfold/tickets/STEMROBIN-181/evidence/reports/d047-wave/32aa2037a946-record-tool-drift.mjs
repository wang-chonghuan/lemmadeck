import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const folder = path.dirname(import.meta.filename);
assert.equal(folder, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-n38-author'));
assert.equal(process.cwd(), repo);
const owned = name => {
  const target = path.resolve(folder, name);
  assert.ok(target.startsWith(`${folder}/`));
  return target;
};
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const freezePath = owned('author-freeze.json');
const freeze = JSON.parse(await fs.readFile(freezePath, 'utf8'));
const bindings = [];
const collect = value => {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') bindings.push(value);
  for (const child of Object.values(value)) collect(child);
};
collect(freeze);
const mismatches = [];
for (const expected of bindings) {
  const current = await bind(expected.path);
  if (current.sha256 !== expected.sha256) {
    mismatches.push({
      path: expected.path,
      nativeCheckTimeSha256: expected.sha256,
      observedSha256: current.sha256,
    });
  }
}
assert.equal(mismatches.length, 1);
assert.equal(mismatches[0].path, path.join(repo, '.claude/skills/ld-s10y-lesson/tools/edition.py'));
await fs.copyFile(freezePath, owned('attempts/repair-1/author-freeze.json'), fs.constants.COPYFILE_EXCL);
const receiptPath = owned('postfreeze-binding-check.json');
await fs.writeFile(receiptPath, `${JSON.stringify({
  schema: 'ld-s10y-lesson/bounded-postfreeze-binding-check@1',
  command: 'node', args: [path.join(folder, 'record-tool-drift.mjs')], cwd: repo,
  observedAt: new Date().toISOString(),
  status: 'fail-external-tool-drift',
  expectedBindings: bindings.length,
  matchingBindings: bindings.length - mismatches.length,
  mismatches,
  authoredTemplatesProseAndFlowHashesMatch: true,
  firstPostfreezeAssertionFailed: true,
  firstFailure: 'The shared edition.py changed after both recorded text checks; its current SHA-256 no longer matches the check-time binding.',
  action: 'Record drift only. Do not revert, modify or revalidate the concurrently changed shared tool.',
  nativeCheckReplay: false, additionalTextRepairs: 0, imagesOpened: 0,
}, null, 2)}\n`, { flag: 'wx' });
freeze.repairAttempt.authorFreeze = await bind(owned('attempts/repair-1/author-freeze.json'));
freeze.postfreezeBindingCheck = await bind(receiptPath);
freeze.contractBindingsRole = 'Exact tool/input hashes used during the recorded native checks, not a claim that concurrent shared files still have those hashes.';
freeze.externalToolDrift = mismatches;
freeze.currentNativeCompatibility = 'NOT-REVALIDATED-AFTER-CONCURRENT-EDITION-PY-CHANGE';
freeze.nativeBlockersRole = 'All five unfiltered native FAILs from the hash-bound initial and sole-repair runs. Current shared-tool behavior is unverified.';
freeze.authorFiles.push(await bind(owned('record-tool-drift.mjs')));
await fs.writeFile(freezePath, `${JSON.stringify(freeze, null, 2)}\n`);
for (const item of freeze.frozen) {
  for (const field of [
    'template', 'exercisesTemplate', 'figuresTemplate', 'currentProse',
    'readingText', 'nativeNormalizationReceipt', 'nativeFlowReceipt', 'nativeFlow',
    'boundaryCandidatesReceipt',
  ]) assert.equal((await bind(item[field].path)).sha256, item[field].sha256);
}
console.log(JSON.stringify({
  freeze: await bind(freezePath),
  authoredBindings: 'pass',
  postfreezeSharedToolBindings: 'fail-external-tool-drift',
  nativeStatusAsRecorded: freeze.nativeTextCheckStatus,
  currentNativeCompatibility: freeze.currentNativeCompatibility,
  externalToolDrift: mismatches,
  textRepairs: freeze.targetedRepairs,
  initialAndRepairFreezesRetained: true,
  imagesOpened: 0,
}, null, 2));
