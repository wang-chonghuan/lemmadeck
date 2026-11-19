const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const evidence = `${book}/evidence/resume182-13-n38-n39-n41-complete`;
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const candidate = `${base}/counter-supported-owned-RECOVERY2/layout.py`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const git = (...args) => {
  const result = cp.spawnSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
const binding = read(`${base}/counter-supported-owned-RECOVERY2/binding.json`);
assert.equal(git("rev-parse", "HEAD").trim(), binding.head);
assert.equal(hash(layout), binding.workingFileSha256);
assert.equal(hash(candidate), binding.candidateSha256);
assert(!fs.readFileSync(candidate, "utf8").includes("_fraction_baselines"));
const manifest = read(`${evidence}/manifest.json`);
assert.equal(manifest.completedOfflineCourses, 3);
const files = [
  ".intentfold/tickets/STEMROBIN-182/progress.md",
  ".intentfold/tickets/STEMROBIN-182/usage.json",
  ".claude/skills/ld-s10y-lesson/tests/test_supported_fraction_fragments.py",
];
const collect = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.push(file); }
  }
};
collect(evidence);
for (const id of ["alg7-c4-s2-n38", "alg7-c4-s2-n39", "alg7-c4-s2-n41"]) {
  collect(`${book}/editions/modern-us-neutral/lessons/${id}/choice-set`);
}
assert.equal(files.length, new Set(files).size);
const transientReferences = (value, file) => {
  if (Array.isArray(value)) value.forEach(item => transientReferences(item, file));
  else if (value && typeof value === "object") Object.values(value).forEach(item => transientReferences(item, file));
  else if (typeof value === "string") {
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/")
      && !(value.startsWith(".intentfold/") && value.includes("/tmp/")), `${file}: transient dependency`);
  }
};
for (const file of files) {
  assert(!/(^|\/)\.env($|\/)|test_wrapped_fraction_baselines/.test(file));
  assert(!/(^|\/)(node_modules|runtime|\.cache|[^/]*profile)(\/|$)/.test(file));
  assert(!["page.png", "page.grid.png", "layout.json", "text.html", "exercises.html", "choices.html"]
    .includes(file.split("/").at(-1)));
  if (/\.(json|record|md|cjs|mjs|py|patch|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:\bpostgres(?:ql)?:\/\/[^\s"']+|\bplane_api_[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{20,}|\bgh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
    if (/\.(py|patch)$/.test(file)) assert(!/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(text));
  }
  if (file.startsWith(book) && file.endsWith(".json")) transientReferences(read(file), file);
}
for (let index = 0; index < files.length; index += 100) git("add", "--", ...files.slice(index, index + 100));
const blob = git("hash-object", "-w", candidate).trim();
git("update-index", "--cacheinfo", "100644", blob, layout);
assert.equal(hash(layout), binding.workingFileSha256);
assert(!git("show", `:${layout}`).includes("_fraction_baselines"));
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...files, layout].sort());
const firstWhitespace = cp.spawnSync("git", ["diff", "--cached", "--check"], { encoding: "utf8" });
const exemptions = [];
if (firstWhitespace.status !== 0) {
  const failingFiles = new Set();
  for (const line of firstWhitespace.stdout.split("\n")) {
    const match = line.match(/^(.+):\d+: (?:trailing whitespace|new blank line at EOF|space before tab in indent)\.$/);
    if (match) failingFiles.add(match[1]);
  }
  assert(failingFiles.size > 0, firstWhitespace.stdout || firstWhitespace.stderr);
  for (const file of failingFiles) {
    assert(file.startsWith(`${evidence}/`), `Product/code whitespace must be fixed: ${file}`);
    const retained = manifest.retained.find(entry => entry.retained.path === file);
    assert(retained, `No immutable evidence binding: ${file}`);
    assert.equal(hash(file), retained.retained.sha256);
    const stagedBytes = cp.spawnSync("git", ["show", `:${file}`]).stdout;
    assert.equal(crypto.createHash("sha256").update(stagedBytes).digest("hex"), retained.retained.sha256);
    exemptions.push({ path: file, sha256: hash(file), reason: "Exact immutable evidence whitespace retained." });
  }
}
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(item => `:(exclude)${item.path}`));
const result = {
  status: "pass", recordedAt: new Date().toISOString(), paths: staged, stagedFiles: staged.length,
  layoutBlob: blob, candidateSha256: hash(candidate), workingFileSha256: hash(layout),
  scopeSecretsTransientCheck: "pass", userHelperGuardAndTestPreservedUnstaged: true,
  immutableWhitespaceFirstExit: firstWhitespace.status,
  immutableWhitespaceFirstOutput: firstWhitespace.stdout,
  immutableWhitespaceExemptions: exemptions, allOtherWhitespaceCheck: "pass",
  completedOfflineCourses: 3, fullMechanicalDefenceDeferredToFinalHandoff: true,
  databaseWritesPublishingApplicationDependenciesMergeDeployClosure: false,
};
fs.mkdirSync(`${evidence}/delivery`);
const resultFile = `${evidence}/delivery/result.json`;
fs.writeFileSync(resultFile, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
manifest.delivery = { path: resultFile, sha256: hash(resultFile) };
fs.writeFileSync(`${evidence}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", resultFile, `${evidence}/manifest.json`);
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(item => `:(exclude)${item.path}`));
console.log(JSON.stringify({ status: "pass", stagedFiles: staged.length + 1, immutableWhitespaceExemptions: exemptions.length }));
