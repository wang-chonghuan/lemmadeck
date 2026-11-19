const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const evidence = `${book}/evidence/resume182-13-n44-complete`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const git = (...args) => {
  const result = cp.spawnSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const userLayoutHash = hash(layout);
const manifest = read(`${evidence}/manifest.json`);
assert.equal(manifest.completedOfflineCourses, 1);
assert(!read(`${book}/book.json`).lessons.some(item => item.id === "alg7-c4-s3-n45"));
const files = [
  ".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json",
  `${book}/book.json`, `${book}/editions/modern-us-neutral/book.json`,
];
const collect = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.push(file); }
  }
};
collect(evidence);
collect(`${book}/lessons/alg7-c4-s3-n44`);
collect(`${book}/editions/modern-us-neutral/lessons/alg7-c4-s3-n44`);
for (let page = 259; page <= 266; page++) collect(`${book}/pages/${String(page).padStart(4, "0")}`);
assert.equal(files.length, new Set(files).size);
const dependencies = (value, file) => {
  if (Array.isArray(value)) value.forEach(item => dependencies(item, file));
  else if (value && typeof value === "object") Object.values(value).forEach(item => dependencies(item, file));
  else if (typeof value === "string") {
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/")
      && !(value.includes("/tmp/") && value.includes(".intentfold/")),
    `${file}: transient product dependency`);
  }
};
for (const file of files) {
  assert(!/(^|\/)\.env($|\/)|test_wrapped_fraction_baselines|\/layout.py$/.test(file));
  assert(!/(^|\/)(node_modules|runtime|\.cache|[^/]*profile)(\/|$)/.test(file));
  if (!file.startsWith(evidence)) {
    assert(!["page.png", "page.grid.png", "layout.json", "text.html", "exercises.html", "choices.html"]
      .includes(file.split("/").at(-1)));
  }
  if (/\.(json|record|md|cjs|mjs|py|patch|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:\bpostgres(?:ql)?:\/\/[^\s"']+|\bplane_api_[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{20,}|\bgh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
  }
  if (file.startsWith(book) && file.endsWith(".json")) dependencies(read(file), file);
}
for (let index = 0; index < files.length; index += 100) git("add", "--", ...files.slice(index, index + 100));
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert(staged.length > 0);
assert(staged.every(file => files.includes(file)), "Staging includes an unowned path");
assert.equal(hash(layout), userLayoutHash);
const whitespace = cp.spawnSync("git", ["diff", "--cached", "--check"], { encoding: "utf8" });
const exemptions = [];
if (whitespace.status !== 0) {
  const failing = new Set();
  for (const line of whitespace.stdout.split("\n")) {
    const match = line.match(/^(.+):\d+: (?:trailing whitespace|new blank line at EOF|space before tab in indent)\.$/);
    if (match) failing.add(match[1]);
  }
  assert(failing.size > 0, whitespace.stdout || whitespace.stderr);
  for (const file of failing) {
    assert(file.startsWith(`${evidence}/`), `Non-evidence whitespace: ${file}`);
    const retained = manifest.retained.find(item => item.retained.path === file);
    assert(retained, `Missing immutable binding: ${file}`);
    assert.equal(hash(file), retained.retained.sha256);
    const stagedBytes = cp.spawnSync("git", ["show", `:${file}`]).stdout;
    assert.equal(crypto.createHash("sha256").update(stagedBytes).digest("hex"), retained.retained.sha256);
    exemptions.push({ path: file, sha256: hash(file), reason: "Immutable original evidence whitespace." });
  }
}
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(item => `:(exclude)${item.path}`));
const result = {
  status: "pass", paths: staged, stagedFiles: staged.length, recordedAt: new Date().toISOString(),
  userLayoutHash, userHelperGuardTestPreservedUnstaged: true,
  immutableWhitespaceFirstExit: whitespace.status, immutableWhitespaceFirstOutput: whitespace.stdout,
  immutableWhitespaceExemptions: exemptions, allOtherWhitespaceCheck: "pass",
  completedOfflineCourses: 1, sourcePagesRetained: [259, 260, 261, 262, 263, 264, 265, 266],
  n45AndLaterExcluded: true, fullMechanicalDefenceDeferredToFinalHandoff: true,
  databasePublishAppDependenciesMergeDeployClosure: false,
};
fs.mkdirSync(`${evidence}/delivery`);
const resultFile = `${evidence}/delivery/result.json`;
fs.writeFileSync(resultFile, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
manifest.delivery = { path: resultFile, sha256: hash(resultFile) };
fs.writeFileSync(`${evidence}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", resultFile, `${evidence}/manifest.json`);
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(item => `:(exclude)${item.path}`));
console.log(JSON.stringify({ status: "pass", stagedFiles: staged.length + 1, exemptions: exemptions.length }));
