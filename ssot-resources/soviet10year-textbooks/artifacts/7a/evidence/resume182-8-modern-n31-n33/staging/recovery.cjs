const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-8";
const target = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-8-modern-n31-n33";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const git = (...args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
};
const first = JSON.parse(fs.readFileSync(`${base}/staging-modern-batch.json`, "utf8"));
assert.equal(first.diffCheckExit, 2);
assert.deepEqual(git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort(), first.paths);
const exceptions = [
  { path: `${target}/resume182-8/layout-owned.patch`, lines: [15, 16],
    reason: "Blank context lines in the original patch must retain their leading diff-context space." },
  { path: "ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0210/page.md",
    lines: [62, 75], reason: "blocks.py parse explicitly retains trailing spaces as cross-line join separators." },
];
for (const exception of exceptions) {
  const staged = git("show", `:${exception.path}`);
  assert.equal(staged, fs.readFileSync(exception.path, "utf8"));
  const actual = staged.split("\n").flatMap((line, index) => /[ \t]+$/.test(line) ? [index + 1] : []);
  assert.deepEqual(actual, exception.lines);
  assert.equal(hash(exception.path), hash(exception.path.startsWith(target)
    ? `${base}/layout-owned.patch`
    : exception.path));
}
const output = `${target}/staging`;
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(`${base}/staging-modern-batch.json`, `${output}/first.record`, fs.constants.COPYFILE_EXCL);
fs.copyFileSync(`${base}/recover-stage-whitespace.cjs`, `${output}/recovery.cjs`, fs.constants.COPYFILE_EXCL);
const commands = [
  ["git", "-c", "core.whitespace=-blank-at-eol", "diff", "--cached", "--check", "--", ...exceptions.map((x) => x.path)],
  ["git", "diff", "--cached", "--check", "--", ".", ...exceptions.map((x) => `:(exclude)${x.path}`)],
];
const checks = commands.map(([command, ...args]) => {
  const result = cp.spawnSync(command, args, { cwd, encoding: "utf8" });
  return { command: [command, ...args], exit: result.status, stdout: result.stdout, stderr: result.stderr };
});
assert(checks.every((x) => x.exit === 0));
fs.writeFileSync(`${output}/recovery.record`, `${JSON.stringify({
  recordedAt: new Date().toISOString(), cwd, firstExit: first.diffCheckExit,
  firstReceipt: ref(`${output}/first.record`), exceptions, checks,
  sourceAndEvidenceBytesUnchanged: true, defaultWhitespaceChecksForAllOtherFiles: true,
}, null, 2)}\n`, { flag: "wx" });
const manifestFile = `${target}/manifest.json`;
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
for (const name of ["first.record", "recovery.cjs", "recovery.record"]) {
  manifest.retained.push({ retained: ref(`${output}/${name}`),
    role: "staged whitespace failure and narrowly bounded format-contract recovery" });
}
manifest.stagingWhitespaceRecovery = ref(`${output}/recovery.record`);
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
const added = ["first.record", "recovery.cjs", "recovery.record"].map((x) => `${output}/${x}`);
git("add", "--", manifestFile, ...added);
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...first.paths, ...added].sort());
git("diff", "--cached", "--check", "--", ".", ...exceptions.map((x) => `:(exclude)${x.path}`));
console.log(JSON.stringify({ stagedFiles: staged.length, retainedFiles: manifest.retained.length,
  firstDefaultCheckExit: first.diffCheckExit, boundedRecoveryChecks: checks.map((x) => x.exit) }));
