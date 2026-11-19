const fs = require("node:fs");
const cp = require("node:child_process");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const evidence = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-12-n37-and-source-stages";
const manifestFile = `${evidence}/manifest.json`;
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hashBytes = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const hash = (file) => hashBytes(fs.readFileSync(file));
const runGit = (...args) => cp.spawnSync("git", args, {
  cwd, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
});
const git = (...args) => {
  const result = runGit(...args);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
const staging = read(`${base}/staging.json`);
assert.equal(staging.diffCheckExit, 2);
assert.equal(staging.scopeSecretTransientCheck, "pass");
const stagedPaths = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(stagedPaths, staging.paths);
const manifest = read(manifestFile);
const problems = [...staging.stdout.matchAll(/^(.+):(\d+): (trailing whitespace\.|new blank line at EOF\.)$/gm)]
  .map((match) => ({ file: match[1], line: Number(match[2]), reason: match[3] }));
assert.equal(problems.length, 21);
const exceptionPaths = [...new Set(problems.map((problem) => problem.file))].sort();
assert.equal(exceptionPaths.length, 9);
for (const problem of problems) {
  assert(problem.file.startsWith(`${evidence}/`));
  const binding = manifest.retained.find((item) => item.retained.path === problem.file);
  assert(binding, problem.file);
  assert.equal(hash(problem.file), binding.retained.sha256);
  assert.equal(hashBytes(git("show", `:${problem.file}`)), binding.retained.sha256);
  const line = fs.readFileSync(problem.file, "utf8").split("\n")[problem.line - 1];
  if (problem.reason === "new blank line at EOF.") {
    assert(problem.file.endsWith(".stdout") && line === "");
  } else if (problem.file.endsWith(".patch")) {
    assert.equal(line, " ");
  } else {
    assert(problem.file.endsWith(".stderr") && /^test_.+ \.\.\. $/.test(line));
  }
}
const checks = [];
const check = (args, scope) => {
  const result = runGit(...args);
  checks.push({ scope, command: ["git", ...args], exit: result.status, stdout: result.stdout, stderr: result.stderr });
  assert.equal(result.status, 0, result.stdout + result.stderr);
};
check(["diff", "--cached", "--check", "--", ".", ...exceptionPaths.map((file) => `:(exclude)${file}`)], "Default rules for all other staged files");
const trailing = exceptionPaths.filter((file) => problems.some((item) => item.file === file && item.reason === "trailing whitespace."));
const eof = exceptionPaths.filter((file) => problems.some((item) => item.file === file && item.reason === "new blank line at EOF."));
check(["-c", "core.whitespace=-blank-at-eol", "diff", "--cached", "--check", "--", ...trailing], "Only original evidence context-line/test-log trailing spaces");
check(["-c", "core.whitespace=-blank-at-eof", "diff", "--cached", "--check", "--", ...eof], "Only original stdout terminal blank line");

const recovery = `${base}/staging-recovery.json`;
save(recovery, {
  status: "pass", originalStagedFiles: stagedPaths.length,
  firstFailurePreserved: true, immutableEvidenceBytesChanged: false,
  exceptions: problems, checks, unrelatedChangesPreserved: true,
});
const additional = [
  "staging.json", "staging-recovery.json", "finish-staging.cjs",
  ...["retain-batch-FIRST", "stage-batch-FIRST"].flatMap((name) =>
    ["start.json", "receipt.json", "stdout", "stderr"].map((suffix) => `stages/${name}.${suffix}`)),
];
for (const relative of additional) {
  const file = `${base}/${relative}`;
  const digest = hash(file);
  let destination = manifest.retained.find((item) => item.retained.sha256 === digest)?.retained.path;
  if (!destination) {
    destination = `${evidence}/delivery/${relative.replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
  }
  manifest.retained.push({
    historicalOriginRelativeToBatch: relative,
    originalSha256: digest, retained: { path: destination, sha256: digest },
  });
}
manifest.uniqueEvidenceFiles = new Set(manifest.retained.map((item) => item.retained.path)).size;
manifest.stageWhitespaceRecovery = {
  path: manifest.retained.find((item) => item.historicalOriginRelativeToBatch === "staging-recovery.json").retained.path,
  sha256: hash(recovery), status: "pass", immutableExceptionFiles: exceptionPaths.length,
};
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", manifestFile, `${evidence}/delivery`);
check(["diff", "--cached", "--check", "--", ".", ...exceptionPaths.map((file) => `:(exclude)${file}`)], "Default rules after final receipt retention");
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
assert.equal(hash(layout), read(`${base}/staged-layout/binding.json`).currentFileSha256);
assert(!git("show", `:${layout}`).includes("_fraction_baselines"));
const finalPaths = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean);
assert(!finalPaths.some((file) => /(^|\/)\.env($|\/)/.test(file)));
assert(!finalPaths.some((file) => file.endsWith("test_wrapped_fraction_baselines.py")));
console.log(JSON.stringify({
  status: "pass", stagedFiles: finalPaths.length, uniqueEvidenceFiles: manifest.uniqueEvidenceFiles,
  immutableEvidenceExceptionFiles: exceptionPaths.length,
  contentOrImageGatesRepeated: 0, unrelatedDirtyHelperAndTestsPreserved: true,
}));
