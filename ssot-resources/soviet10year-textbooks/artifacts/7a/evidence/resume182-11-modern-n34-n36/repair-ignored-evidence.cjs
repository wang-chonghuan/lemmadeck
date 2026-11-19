const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cp = require("node:child_process");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const root = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-11-modern-n34-n36";
const file = `${root}/manifest.json`;
const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const logs = [
  "n36-choice-review-FIRST/validate.log",
  "n36-choice-review-FIRST/validate.stderr.log",
  "n36-choice-review-affected/validate.log",
];
const renamed = [];
for (const relative of logs) {
  const original = `${root}/${relative}`;
  const destination = `${original}.record`;
  assert.equal(cp.spawnSync("git", ["check-ignore", original]).status, 0);
  assert(!fs.existsSync(destination));
  const digest = hash(original);
  fs.renameSync(original, destination);
  assert.equal(hash(destination), digest);
  let rebound = 0;
  for (const entry of manifest.retained) {
    if (entry.retained.path === original) {
      assert.equal(entry.retained.sha256, digest);
      entry.retained.path = destination;
      rebound++;
    }
  }
  assert(rebound > 0);
  renamed.push({ originalRelativePath: relative, retained: { path: destination, sha256: digest }, rebound });
}
const byDigest = new Map(manifest.retained.map((entry) => [entry.retained.sha256, entry.retained.path]));
const append = (source, relative) => {
  const digest = hash(source);
  let destination = byDigest.get(digest);
  if (!destination) {
    destination = `${root}/${relative.replace(/\.json$/, ".record")}`;
    fs.mkdirSync(require("node:path").dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
    byDigest.set(digest, destination);
  }
  manifest.retained.push({
    historicalOriginRelativeToBatch: relative, originalSha256: digest,
    retained: { path: destination, sha256: digest },
  });
};
for (const stage of ["n34-n36-narrow-stage-FIRST", "n34-n36-retain-evidence-FIRST"]) {
  for (const suffix of ["start.json", "receipt.json", "stdout", "stderr"]) {
    append(`${base}/stages/${stage}.${suffix}`, `stages/${stage}.${suffix}`);
  }
}
append(`${base}/repair-ignored-evidence.cjs`, "repair-ignored-evidence.cjs");
manifest.uniqueEvidenceFiles = byDigest.size;
manifest.ignoredLogExtensionRepair = {
  renamed, bytesUnchanged: true, firstStagingFailurePreserved: true,
  semanticAndDisplayGatesRepeated: false,
};
fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ renamed: renamed.length, bytesUnchanged: true,
  uniqueEvidenceFiles: byDigest.size, firstStagingFailurePreserved: true }));
