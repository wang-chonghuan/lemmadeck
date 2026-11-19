const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const evidence = `${book}/evidence/resume182-13-n45-complete`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const git = (...args) => {
  const result = cp.spawnSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
assert.equal(git("branch", "--show-current").trim(), "codex/STEMROBIN-182-textbooks");
assert.equal(git("diff", "--cached", "--name-only").trim(), "");
assert.equal(git("rev-parse", "HEAD").trim(), git("rev-parse", "origin/codex/STEMROBIN-182-textbooks").trim());
const layout = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const userLayoutHash = hash(layout);
const userTest = ".claude/skills/ld-s10y-lesson/tests/test_wrapped_fraction_baselines.py";
const userTestHash = hash(userTest);
const manifest = read(`${evidence}/manifest.json`);
assert.equal(manifest.completedOfflineCourses, 1);
const indices = [
  [`${book}/book.json`, `${base}/n46-n47-raw-index-before.json`],
  [`${book}/editions/modern-us-neutral/book.json`, `${base}/n46-n47-modern-index-before.json`],
];
const indexBindings = indices.map(([target, source]) => {
  const previous = JSON.parse(git("show", `HEAD:${target}`));
  const candidate = read(source);
  assert.equal(candidate.lessons.length, previous.lessons.length + 1);
  assert.deepEqual(candidate.lessons.slice(0, -1), previous.lessons);
  assert.equal(candidate.lessons.at(-1).id, "alg7-c4-s3-n45");
  assert(!candidate.lessons.some(row => /n4[67]$/.test(row.id)));
  return { target, source, sourceSha256: hash(source), workingSha256: hash(target) };
});
const files = [".intentfold/tickets/STEMROBIN-182/progress.md"];
const collect = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collect(file);
    else { assert(entry.isFile()); files.push(file); }
  }
};
collect(evidence);
collect(`${book}/lessons/alg7-c4-s3-n45`);
collect(`${book}/editions/modern-us-neutral/lessons/alg7-c4-s3-n45`);
collect(`${book}/editions/modern-us-neutral/figures/evidence/n45-independent`);
for (let page = 267; page <= 273; page++) collect(`${book}/pages/${String(page).padStart(4, "0")}`);
for (const number of [59, 60, 61]) {
  files.push(`${book}/figures/fig-${number}.png`);
  for (const suffix of ["spec.json", "svg", "render.json", "review.json"])
    files.push(`${book}/editions/modern-us-neutral/figures/fig-${number}.${suffix}`);
}
assert.equal(files.length, new Set(files).size);
const dependencies = (value, file) => {
  if (Array.isArray(value)) value.forEach(item => dependencies(item, file));
  else if (value && typeof value === "object") Object.values(value).forEach(item => dependencies(item, file));
  else if (typeof value === "string")
    assert(!value.startsWith(".tmp/") && !value.includes("/.tmp/")
      && !(value.includes("/tmp/") && value.includes(".intentfold/")), `${file}: transient dependency`);
};
for (const file of files) {
  assert(!/(^|\/)\.env($|\/)|test_wrapped_fraction_baselines|\/layout.py$/.test(file));
  assert(!/(^|\/)(node_modules|runtime|\.cache|[^/]*profile)(\/|$)/.test(file));
  if (/\.(json|record|md|cjs|mjs|py|patch|stdout|stderr|txt)$/.test(file)) {
    const text = fs.readFileSync(file, "utf8");
    assert(!/(?:\bpostgres(?:ql)?:\/\/[^\s"']+|\bplane_api_[A-Za-z0-9_-]{16,}|\bsk-[A-Za-z0-9_-]{20,}|\bgh[pousr]_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text),
      `${file}: credential-shaped literal`);
    if (/\.(py|patch)$/.test(file)) assert(!/(?:^|\n)[+ ]?def _fraction_baselines\(/.test(text));
  }
  if (file.startsWith(book) && file.endsWith(".json")) dependencies(read(file), file);
}
for (let offset = 0; offset < files.length; offset += 100) git("add", "--", ...files.slice(offset, offset + 100));
for (const binding of indexBindings) {
  const blob = git("hash-object", "-w", binding.source).trim();
  git("update-index", "--cacheinfo", "100644", blob, binding.target);
  binding.indexBlob = blob;
  assert.equal(hash(binding.target), binding.workingSha256);
}
const staged = git("diff", "--cached", "--name-only", "-z").split("\0").filter(Boolean).sort();
assert.deepEqual(staged, [...files, ...indices.map(([target]) => target)].sort());
assert.equal(hash(layout), userLayoutHash);
assert.equal(hash(userTest), userTestHash);
const first = cp.spawnSync("git", ["diff", "--cached", "--check"], { encoding: "utf8" });
const exemptions = [];
if (first.status !== 0) {
  const failing = new Set();
  for (const line of first.stdout.split("\n")) {
    const match = line.match(/^(.+):\d+: (?:trailing whitespace|new blank line at EOF|space before tab in indent)\.$/);
    if (match) failing.add(match[1]);
  }
  assert(failing.size > 0, first.stdout || first.stderr);
  for (const file of failing) {
    const retained = manifest.retained.find(row => row.retained.path === file);
    assert(retained, `Product whitespace requires repair: ${file}`);
    assert.equal(hash(file), retained.retained.sha256);
    exemptions.push({ path: file, sha256: hash(file), reason: "Exact immutable evidence whitespace." });
  }
}
git("diff", "--cached", "--check", "--", ".", ...exemptions.map(row => `:(exclude)${row.path}`));
const resultFile = `${evidence}/delivery/result.json`;
fs.mkdirSync(`${evidence}/delivery`);
fs.writeFileSync(resultFile, `${JSON.stringify({
  status: "pass", recordedAt: new Date().toISOString(), paths: staged, stagedFiles: staged.length,
  indexBindings, userLayoutHash, userTestHash, workingIndicesAndUserChangesUntouched: true,
  completedOfflineCourses: 1, sourcePages: [267, 268, 269, 270, 271, 272, 273],
  immutableWhitespaceFirstExit: first.status, immutableWhitespaceFirstOutput: first.stdout,
  immutableWhitespaceExemptions: exemptions, allOtherWhitespaceCheck: "pass",
  fullMechanicalDefenceDeferredToFinalHandoff: true, databasePublishAppDependenciesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
manifest.delivery = { path: resultFile, sha256: hash(resultFile) };
fs.writeFileSync(`${evidence}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
git("add", "--", resultFile, `${evidence}/manifest.json`);
console.log(JSON.stringify({ status: "pass", stagedFiles: staged.length + 1, immutableWhitespaceExemptions: exemptions.length }));
