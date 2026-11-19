const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const evidence = `${book}/evidence/resume182-13-n40-n43-and-answer-stages`;
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const git = (...args) => {
  const result = cp.spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
assert(read(`${evidence}/manifest.json`).completedOfflineCourses >= 3);
const binding = read(`${base}/counter-owned/binding.json`);
assert.equal(git("rev-parse", "HEAD").trim(), binding.head);
assert.equal(sha(layout), binding.workingFileSha256);
assert.equal(sha(`${base}/counter-owned/layout.py`), binding.candidateSha256);
assert.equal(sha(`${base}/counter-owned/own.patch`), binding.ownPatchSha256);
assert.equal(read(`${base}/counter-review/binding.json`).verdict, "PASS");
assert(!fs.readFileSync(`${base}/counter-owned/layout.py`, "utf8").includes("_fraction_baselines"));
const files = [
  ".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json",
  ".claude/skills/ld-s10y-lesson/tests/test_radical_overbar_margin_outline.py",
  `${book}/book.json`, `${edition}/book.json`,
];
const collect = folder => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.push(file); }
  }
};
collect(evidence);
collect(`${book}/evidence/resume182-13-bradis-table-method`);
for (const id of ["alg7-c4-s2-n40", "alg7-c4-s2-n41", "alg7-c4-s3-n42", "alg7-c4-s3-n43"]) {
  collect(`${book}/lessons/${id}`);
  collect(`${edition}/lessons/${id}`);
}
for (const id of ["alg7-c4-s2-n38", "alg7-c4-s2-n39"]) {
  files.push(`${edition}/lessons/${id}/answer-keys.json`);
  files.push(`${edition}/lessons/${id}/answer-keys.audit.json`);
}
for (let page = 243; page <= 258; page++) {
  for (const name of ["page.md", "page.json", "audit.json"]) {
    files.push(`${book}/pages/${String(page).padStart(4, "0")}/${name}`);
  }
}
for (const id of ["fig-56", "fig-57", "fig-58"]) {
  files.push(`${book}/figures/${id}.png`);
  for (const suffix of ["svg", "spec.json", "render.json", "review.json"]) {
    files.push(`${edition}/figures/${id}.${suffix}`);
  }
}
for (const name of [
  "fig56-58-independent-FIRST.record", "fig57-association-2-affected.record",
]) files.push(`${edition}/figures/evidence/${name}`);
assert.equal(new Set(files).size, files.length);
const scan = (value, file) => {
  if (Array.isArray(value)) value.forEach(item => scan(item, file));
  else if (value && typeof value === "object") Object.values(value).forEach(item => scan(item, file));
  else if (typeof value === "string") {
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/")
      && !(value.startsWith(".intentfold/") && value.includes("/tmp/")),
    `${file}: transient dependency ${value}`);
  }
};
for (const file of files) {
  assert(!/(^|\/)\.env($|\/)/.test(file));
  assert(!/(^|\/)(node_modules|runtime|\.cache|[^/]*profile)(\/|$)/.test(file));
  assert(!["page.png", "page.grid.png", "layout.json", "text.html", "exercises.html", "choices.html"]
    .includes(file.split("/").at(-1)));
  assert(fs.statSync(file).isFile(), file);
  if (/\.(json|record|md|cjs|mjs|py|patch|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:\bpostgres(?:ql)?:\/\/[^\s"']+|\bplane_api_[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{20,}|\bgh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
    if (/\.(py|patch)$/.test(file)) {
      assert(!/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(text), `${file}: preexisting user helper`);
    }
  }
  if (file.startsWith(book) && file.endsWith(".json")) scan(read(file), file);
}
for (let i = 0; i < files.length; i += 100) git("add", "--", ...files.slice(i, i + 100));
const blob = git("hash-object", "-w", `${base}/counter-owned/layout.py`).trim();
git("update-index", "--cacheinfo", "100644", blob, layout);
assert(!git("show", `:${layout}`).includes("_fraction_baselines"));
assert.equal(sha(layout), binding.workingFileSha256);
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...files, layout].sort());
const diffCheck = cp.spawnSync("git", ["diff", "--cached", "--check"], { cwd, encoding: "utf8" });
fs.writeFileSync(`${base}/staging.json`, `${JSON.stringify({
  stagedFiles: staged.length, paths: staged, layoutBlob: blob,
  scopeSecretTransientCheck: "pass", unrelatedDirtyHelperAndTestsPreserved: true,
  diffCheckExit: diffCheck.status, stdout: diffCheck.stdout, stderr: diffCheck.stderr,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedFiles: staged.length, diffCheckExit: diffCheck.status }));
process.exitCode = diffCheck.status;
