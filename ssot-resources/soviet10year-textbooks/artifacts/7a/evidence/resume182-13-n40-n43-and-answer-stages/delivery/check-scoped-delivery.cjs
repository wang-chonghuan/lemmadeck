const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const out = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-13-n40-n43-and-answer-stages";
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const git = (...args) => {
  const result = cp.spawnSync("git", args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const manifest = read(`${out}/manifest.json`);
const initial = read(`${base}/staging.json`);
assert.equal(initial.scopeSecretTransientCheck, "pass");
const userSnapshot = `${out}/counter-affected/.claude__skills__ld-s10y-lesson__tests__test_wrapped_fraction_baselines.py`;
const userSnapshotEntry = manifest.retained.find(entry => entry.retained.path === userSnapshot);
assert(userSnapshotEntry);
assert.equal(sha(userSnapshot), userSnapshotEntry.retained.sha256);
git("restore", "--staged", "--", userSnapshot);
fs.renameSync(userSnapshot, `${base}/delivery-excluded-user-test-snapshot.py`);
manifest.retained = manifest.retained.filter(entry => entry.retained.path !== userSnapshot);
manifest.excluded.push({
  origin: userSnapshotEntry.historicalOriginRelativeToBatch,
  sha256: userSnapshotEntry.retained.sha256,
  reason: "Preexisting user test snapshot, removed from delivery and preserved in scratch",
});
manifest.uniqueEvidenceFiles--;
manifest.newlyCopiedEvidenceFiles--;
const exemptions = [
  `${out}/counter-owned/own.patch`,
  `${out}/n41-choice-author/learner-views.md`,
  `${out}/stages/counter-owned-tests-FIRST.stderr`,
  `${out}/stages/n40-assembly-wrapper-FIRST.stdout`,
].map(file => {
  const retained = manifest.retained.find(entry => entry.retained.path === file);
  assert(retained, file);
  assert.equal(sha(file), retained.retained.sha256);
  return { ...retained.retained,
    reason: "Immutable original evidence; preserve hash-bound whitespace, not product formatting" };
});
assert.deepEqual(git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort(),
  initial.paths.filter(file => file !== userSnapshot));
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(entry => `:(exclude)${entry.path}`));
const binding = read(`${base}/counter-owned/binding.json`);
assert.equal(sha(".claude/skills/ld-s10y-lesson/tools/layout.py"), binding.workingFileSha256);
assert(!git("show", ":.claude/skills/ld-s10y-lesson/tools/layout.py").includes("_fraction_baselines"));
const currentPaths = initial.paths.filter(file => file !== userSnapshot);
assert(!currentPaths.some(file => /(^|\/)\.env($|\/)|test_wrapped_fraction_baselines/.test(file)));
const result = {
  status: "pass", recordedAt: new Date().toISOString(), stagedFilesBeforeRecoveryEvidence: initial.stagedFiles,
  scopeSecretTransientCheck: initial.scopeSecretTransientCheck,
  immutableWhitespaceExemptions: exemptions, allOtherStagedWhitespaceCheck: "pass",
  originalHelperGuardAndTestPreservedUnstaged: true, fullMechanicalDefenceDeferredToFinalHandoff: true,
  preexistingUserTestSnapshotExcluded: true,
  stageFirstFailure: "Credential scanner matched sk- inside ordinary task-capture schema; word boundary repaired",
  databaseWritesPublishingApplicationDependenciesMergeDeployClosure: false,
};
const additions = [];
for (const origin of [
  "staging.json", "stage-current-batch.cjs", "check-scoped-delivery.cjs",
  "stages/retain-current-batch-FIRST.receipt.json",
  "stages/stage-current-batch-FIRST.receipt.json", "stages/stage-current-batch-FIRST.stderr",
  "stages/stage-current-batch-RECOVERY1.receipt.json",
  "stages/stage-current-batch-RECOVERY1.stdout",
  "stages/scoped-delivery-check-FIRST.receipt.json",
  "stages/scoped-delivery-check-FIRST.stderr",
]) {
  const from = `${base}/${origin}`;
  const file = `${out}/delivery/${origin.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  fs.copyFileSync(from, file, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(file), sha(from));
  additions.push(file);
}
const file = `${out}/delivery/result.json`;
fs.writeFileSync(file, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
manifest.deliveryRecovery = {
  result: { path: file, sha256: sha(file) },
  records: additions.map(path => ({ path, sha256: sha(path) })),
};
fs.writeFileSync(`${out}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", `${out}/manifest.json`, file, ...additions);
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(entry => `:(exclude)${entry.path}`));
console.log(JSON.stringify({ status: "pass", result: file,
  stagedFiles: git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).length }));
