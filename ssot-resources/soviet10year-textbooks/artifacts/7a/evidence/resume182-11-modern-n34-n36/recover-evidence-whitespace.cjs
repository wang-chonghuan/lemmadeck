const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const path = require("node:path");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const root = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-11-modern-n34-n36";
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const git = (...args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const staging = read(`${base}/staging.json`);
assert.equal(staging.diffCheckExit, 2);
const observed = staging.stdout.trim().split("\n").map((line) => {
  const match = line.match(/^(.*):(\d+): new blank line at EOF\.$/);
  assert(match, `unexpected whitespace failure: ${line}`);
  assert(match[1].startsWith(`${root}/`));
  return { path: match[1], line: Number(match[2]) };
});
assert.equal(observed.length, 8);
assert.equal(new Set(observed.map((o) => o.path)).size, 8);
assert.deepEqual(git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort(),
  [...staging.paths].sort());
const manifestFile = `${root}/manifest.json`;
const manifest = read(manifestFile);
for (const item of observed) {
  const ref = manifest.retained.find((entry) => entry.retained.path === item.path)?.retained;
  assert(ref);
  assert.equal(hash(item.path), ref.sha256);
  assert.equal(digest(cp.execFileSync("git", ["show", `:${item.path}`], { cwd })), ref.sha256);
  assert(/\n\n$/.test(fs.readFileSync(item.path, "utf8")));
  item.sha256 = ref.sha256;
}
const byDigest = new Map(manifest.retained.map((entry) => [entry.retained.sha256, entry.retained.path]));
const added = [];
const append = (source, relative) => {
  const sha256 = hash(source);
  let destination = byDigest.get(sha256);
  if (!destination) {
    destination = `${root}/${relative.replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), sha256);
    byDigest.set(sha256, destination);
    added.push(destination);
  }
  manifest.retained.push({ historicalOriginRelativeToBatch: relative, originalSha256: sha256,
    retained: { path: destination, sha256 } });
};
for (const label of ["n34-n36-ignored-log-path-recovery-FIRST", "n34-n36-narrow-stage-path-recovery"]) {
  for (const suffix of ["start.json", "receipt.json", "stdout", "stderr"]) {
    append(`${base}/stages/${label}.${suffix}`, `stages/${label}.${suffix}`);
  }
}
append(`${base}/staging.json`, "staging.json");
append(`${base}/recover-evidence-whitespace.cjs`, "recover-evidence-whitespace.cjs");
manifest.uniqueEvidenceFiles = byDigest.size;
manifest.whitespaceException = {
  observed, ruleDisabledOnlyForTheseFiles: "blank-at-eof", immutableBytesUnchanged: true,
  firstDiffCheckExit: 2, allOtherFilesUseDefaultRules: true,
};
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", manifestFile, ...added);
const commands = [
  ["diff", "--cached", "--check", "--", ".", ...observed.map((item) => `:(exclude)${item.path}`)],
  ["-c", "core.whitespace=-blank-at-eof", "diff", "--cached", "--check", "--", ...observed.map((item) => item.path)],
];
const checks = commands.map((args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8" });
  return { command: ["git", ...args], exit: result.status, stdout: result.stdout, stderr: result.stderr };
});
assert(checks.every((check) => check.exit === 0), JSON.stringify(checks));
const expected = [...staging.paths, ...added].sort();
const current = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(current, expected);
for (const item of observed) assert.equal(hash(item.path), item.sha256);
fs.writeFileSync(`${base}/staging-whitespace-recovery.json`, `${JSON.stringify({
  checks, exceptionFiles: observed, immutableBytesUnchanged: true,
  initialStagedFiles: staging.stagedFiles, stagedFiles: current.length,
  newlyStagedEvidenceFiles: added, stageScopeInheritedFromFirstPassingWhitelist: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ checkExits: checks.map((check) => check.exit), exceptionFiles: observed.length,
  immutableBytesUnchanged: true, stagedFiles: current.length, uniqueEvidenceFiles: byDigest.size }));
