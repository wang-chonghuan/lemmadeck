const fs = require("node:fs");
const cp = require("node:child_process");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const git = (...args) => {
  const r = cp.spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const paths = [".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json", `${book}/book.json`, `${edition}/book.json`];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) walk(p);
    else { assert(entry.isFile()); paths.push(p); }
  }
};
walk(`${book}/evidence/resume182-11-modern-n34-n36`);
for (const lesson of ["alg7-c4-s1-n34", "alg7-c4-s1-n35", "alg7-c4-s2-n36"]) {
  walk(`${book}/lessons/${lesson}`);
  walk(`${edition}/lessons/${lesson}`);
}
for (const n of [215, 218, 219, 221, 222, 223, 224, 225, 226, 227]) {
  for (const name of ["page.md", "page.json", "audit.json"]) {
    paths.push(`${book}/pages/${String(n).padStart(4, "0")}/${name}`);
  }
}
for (const id of ["fig-46", "fig-47", "fig-48", "fig-49", "fig-50", "fig-51", "fig-52", "fig-53", "fig-54", "tbl-p0220-01"]) {
  paths.push(`${book}/figures/${id}.png`);
  for (const suffix of ["svg", "spec.json", "render.json", "review.json"]) paths.push(`${edition}/figures/${id}.${suffix}`);
  walk(`${edition}/figures/evidence/${id}/resume182-11-approved`);
}
assert.equal(paths.length, new Set(paths).size);
const scan = (value, file) => {
  if (Array.isArray(value)) value.forEach((v) => scan(v, file));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => scan(v, file));
  else if (typeof value === "string") {
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/") &&
      !(value.startsWith(".intentfold/") && value.includes("/tmp/")), `${file}: transient dependency ${value}`);
  }
};
for (const file of paths) {
  assert(!/(^|\/)\.env($|\/)/.test(file), file);
  assert(!/(^|\/)(runtime|node_modules|\.cache|[^/]*profile)(\/|$)/.test(file), file);
  assert(!["page.png", "page.grid.png", "layout.json", "text.html", "exercises.html", "choices.html"].includes(file.split("/").at(-1)), file);
  assert(!file.includes(".template.") || file.includes("/evidence/"), file);
  assert(fs.statSync(file).isFile(), file);
  if (/\.(json|record|md|cjs|mjs|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:postgres(?:ql)?:\/\/[^\s"']+|plane_api_[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
  }
  if (file.endsWith(".json") && file.startsWith(book)) scan(JSON.parse(fs.readFileSync(file, "utf8")), file);
}
git("add", "--", ...paths);
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...paths].sort());
assert(!staged.some((p) => p.startsWith(".claude/") || p.startsWith("app/") || p.includes("/artifacts/4m/")));
const check = cp.spawnSync("git", ["diff", "--cached", "--check"], { cwd, encoding: "utf8" });
fs.writeFileSync(`${base}/staging.json`, `${JSON.stringify({
  branch: "codex/STEMROBIN-182-textbooks", stagedFiles: staged.length, paths: staged,
  scopeSecretTransientCheck: "pass", diffCheckExit: check.status,
  stdout: check.stdout, stderr: check.stderr, unrelatedDirtyChangesExcluded: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedFiles: staged.length, diffCheckExit: check.status,
  scopeSecretTransientCheck: "pass", stdout: check.stdout, stderr: check.stderr }));
process.exitCode = check.status;
