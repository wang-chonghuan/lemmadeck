const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const evidence = `${book}/evidence/resume182-12-n37-and-source-stages`;
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const git = (...args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
assert.equal(read(`${evidence}/manifest.json`).completedOfflineCourses, 1);
assert.equal(read(`${base}/owned-layout-review/owned-layout-review.json`).verdict, "PASS");
const binding = read(`${base}/staged-layout/binding.json`);
assert.equal(hash(layout), binding.currentFileSha256);
assert.equal(hash(`${base}/staged-layout/layout.py`), binding.candidateSha256);
assert.equal(hash(`${base}/staged-layout/own.patch`), binding.ownPatchSha256);
assert(!fs.readFileSync(`${base}/staged-layout/layout.py`, "utf8").includes("_fraction_baselines"));

const paths = [
  ".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json",
  `${book}/book.json`, `${edition}/book.json`,
  ".claude/skills/ld-s10y-answer/tools/lesson_answers.py",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ...["assemble", "blocks", "edition", "p2c"].map((name) => `.claude/skills/ld-s10y-lesson/tools/${name}.py`),
  ...["exercise_numbering_errata", "footnote_separator_row", "fraction_system_rows", "offset_label_row"]
    .map((name) => `.claude/skills/ld-s10y-lesson/tests/test_${name}.py`),
];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(file);
    else { assert(entry.isFile(), file); paths.push(file); }
  }
};
walk(evidence);
for (const id of ["alg7-c4-s2-n37", "alg7-c4-s2-n38", "alg7-c4-s2-n39"]) {
  walk(`${book}/lessons/${id}`);
  walk(`${edition}/lessons/${id}`);
}
for (let page = 228; page <= 242; page++) {
  for (const name of ["page.md", "page.json", "audit.json"]) paths.push(`${book}/pages/${String(page).padStart(4, "0")}/${name}`);
}
paths.push(`${book}/figures/fig-55.png`);
for (const suffix of ["svg", "spec.json", "render.json", "review.json"]) paths.push(`${edition}/figures/fig-55.${suffix}`);
assert.equal(new Set(paths).size, paths.length);

const scan = (value, file) => {
  if (Array.isArray(value)) value.forEach((item) => scan(item, file));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => scan(item, file));
  else if (typeof value === "string") {
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/")
      && !(value.startsWith(".intentfold/") && value.includes("/tmp/")),
    `${file}: transient dependency ${value}`);
  }
};
for (const file of paths) {
  assert(!/(^|\/)\.env($|\/)/.test(file));
  assert(!/(^|\/)(node_modules|runtime|\.cache|[^/]*profile)(\/|$)/.test(file));
  assert(!["page.png", "page.grid.png", "layout.json", "text.html", "exercises.html", "choices.html"].includes(file.split("/").at(-1)));
  assert(fs.statSync(file).isFile(), file);
  if (/\.(json|record|md|cjs|mjs|py|patch|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:postgres(?:ql)?:\/\/[^\s"']+|plane_api_[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
    if (file.endsWith(".py") || file.endsWith(".patch")) {
      assert(!/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(text),
        `${file}: preexisting helper bytes`);
    }
  }
  if (file.startsWith(book) && file.endsWith(".json")) scan(read(file), file);
}
for (let offset = 0; offset < paths.length; offset += 100) git("add", "--", ...paths.slice(offset, offset + 100));
const blob = git("hash-object", "-w", `${base}/staged-layout/layout.py`).trim();
git("update-index", "--cacheinfo", "100644", blob, layout);
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...paths, layout].sort());
assert(!git("show", `:${layout}`).includes("_fraction_baselines"));
assert.equal(hash(layout), binding.currentFileSha256);
const check = cp.spawnSync("git", ["diff", "--cached", "--check"], { cwd, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
fs.writeFileSync(`${base}/staging.json`, `${JSON.stringify({
  stagedFiles: staged.length, paths: staged, layoutBlob: blob,
  scopeSecretTransientCheck: "pass", unrelatedDirtyHelperAndTestsPreserved: true,
  diffCheckExit: check.status, stdout: check.stdout, stderr: check.stderr,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedFiles: staged.length, scopeSecretTransientCheck: "pass",
  diffCheckExit: check.status, stdout: check.stdout, stderr: check.stderr }));
process.exitCode = check.status;
