const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const git = (...args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const protectedStage = [layout,
  ".claude/skills/ld-s10y-lesson/tests/test_system_labels_fraction_tail.py"];
const stagedNames = () => git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(stagedNames(), [...protectedStage].sort());
const stagedLayout = git("show", `:${layout}`);
assert.equal(hash(stagedLayout), "017f9f13a7fdfa8d1c124d10209cb68704d5b0305cbcd1644cf5b651309d175e");
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const paths = [
  ".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json",
  `${book}/book.json`, `${edition}/book.json`,
  `${book}/pages/0205/audit.json`, `${book}/pages/0206/audit.json`,
];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) walk(file);
    else {
      assert(entry.isFile(), file);
      paths.push(file);
    }
  }
};
walk(`${book}/evidence/resume182-8-modern-n31-n33`);
for (const n of [31, 32, 33]) {
  const id = `alg7-c4-s1-n${n}`;
  walk(`${book}/lessons/${id}`);
  walk(`${edition}/lessons/${id}`);
}
for (let page = 210; page <= 220; page++) {
  for (const name of ["page.md", "page.json", "audit.json"]) {
    paths.push(`${book}/pages/${String(page).padStart(4, "0")}/${name}`);
  }
}
for (const id of ["fig-44", "fig-45", "tbl-p0209-02", "tbl-p0210-01"]) {
  paths.push(`${book}/figures/${id}.png`);
  for (const suffix of ["svg", "spec.json", "render.json", "review.json"]) {
    paths.push(`${edition}/figures/${id}.${suffix}`);
  }
  walk(`${edition}/figures/evidence/${id}`);
}
assert.equal(paths.length, new Set(paths).size);
const transientNames = new Set(["layout.json", "page.grid.png", "page.png",
  "page.template.md", "text.html", "exercises.html"]);
const checkJson = (value, file, pointer = "$") => {
  if (Array.isArray(value)) value.forEach((child, index) => checkJson(child, file, `${pointer}[${index}]`));
  else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) checkJson(child, file, `${pointer}.${key}`);
  } else if (typeof value === "string") {
    assert(!(value.startsWith(".tmp/") || value.includes("/.tmp/") ||
      (value.startsWith(".intentfold/tickets/") && value.includes("/tmp/"))),
    `${file}:${pointer}=${value}`);
  }
};
for (const file of paths) {
  assert(!/(^|\/)\.env($|\/)/.test(file), file);
  assert(fs.statSync(file).isFile(), file);
  assert(!transientNames.has(file.split("/").at(-1)), file);
  assert(!file.includes(".template."), file);
  if (file.endsWith(".json")) {
    const value = JSON.parse(fs.readFileSync(file, "utf8"));
    if (file.startsWith(book)) checkJson(value, file);
  }
}
git("add", "--", ...paths);
assert.equal(git("show", `:${layout}`), stagedLayout);
const staged = stagedNames();
assert.deepEqual(staged, [...paths, ...protectedStage].sort());
const result = cp.spawnSync("git", ["diff", "--cached", "--check"], { cwd, encoding: "utf8" });
const receipt = {
  recordedAt: new Date().toISOString(), paths: staged, stagedFiles: staged.length,
  whitelistJsonDisposableSecretCheck: "pass",
  stagedLayoutSha256: hash(stagedLayout),
  diffCheckExit: result.status, stdout: result.stdout, stderr: result.stderr,
  preexistingFractionBaselineAndOldTestStaged: false,
  preexisting4mAndOther7aStaged: false,
};
fs.writeFileSync(".intentfold/tickets/STEMROBIN-182/tmp/resume182-8/staging-modern-batch.json",
  `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedFiles: staged.length,
  whitelistJsonDisposableSecretCheck: receipt.whitelistJsonDisposableSecretCheck,
  diffCheckExit: result.status, stdout: result.stdout, stderr: result.stderr }));
process.exitCode = result.status;
