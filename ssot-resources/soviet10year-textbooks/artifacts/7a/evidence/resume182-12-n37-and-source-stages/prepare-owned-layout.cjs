const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const file = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const output = `${base}/staged-layout`;
const hash = (content) => crypto.createHash("sha256").update(content).digest("hex");
const current = fs.readFileSync(file, "utf8");
const before = fs.readFileSync(`${base}/counter-repair/layout-before.py`, "utf8");
const userHelper = (text) => text.slice(text.indexOf("def _fraction_baselines("), text.indexOf("    band = ink[a:b + 1].copy()", text.indexOf("def _single_fraction_row(")));
assert(userHelper(current).includes("len(_fraction_baselines"));
assert.equal(userHelper(current), userHelper(before), "Pre-existing helper/guard changed");
const result = cp.spawnSync("git", ["diff", "--", file], { encoding: "utf8", cwd: process.cwd() });
assert.equal(result.status, 0);
const pieces = result.stdout.split(/(?=^@@ )/m);
const header = pieces.shift();
const excluded = pieces.shift();
assert(excluded.includes("+def _fraction_baselines("));
assert(!excluded.includes("_fraction_system_row_count"));
const owned = header + pieces.join("");
assert(!owned.includes("_fraction_baselines"), "Owned patch still depends on unstaged helper");
assert(owned.includes("+def _fraction_system_row_count("));
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(`${output}/own.patch`, owned, { flag: "wx" });
fs.writeFileSync(`${output}/excluded-user.patch`, header + excluded, { flag: "wx" });
const head = cp.spawnSync("git", ["show", `HEAD:${file}`], { encoding: "utf8", cwd: process.cwd() });
assert.equal(head.status, 0);
assert(!head.stdout.includes("def _fraction_baselines("));
const candidate = `${output}/layout.py`;
fs.writeFileSync(candidate, head.stdout, { flag: "wx" });
const candidatePatch = owned.replaceAll(`a/${file}`, `a/${candidate}`).replaceAll(`b/${file}`, `b/${candidate}`);
fs.writeFileSync(`${output}/candidate.patch`, candidatePatch, { flag: "wx" });
const applied = cp.spawnSync("git", ["apply", "--unsafe-paths", `${output}/candidate.patch`], {
  encoding: "utf8", cwd: process.cwd(),
});
assert.equal(applied.status, 0, applied.stderr);
assert(!fs.readFileSync(candidate, "utf8").includes("_fraction_baselines"));
fs.writeFileSync(`${output}/binding.json`, `${JSON.stringify({
  cwd: process.cwd(), currentFileSha256: hash(current), candidateSha256: hash(fs.readFileSync(candidate)),
  ownPatchSha256: hash(owned), excludedUserPatchSha256: hash(header + excluded),
  excludedUserHelperSha256: hash(userHelper(current)),
  preExistingHelperAndGuardUnchanged: true, ownHunks: pieces.length,
  candidateBuiltFromHeadPlusOwnedHunksOnly: true, independentOfUnstagedHelper: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ candidate: path.resolve(candidate), ownHunks: pieces.length, unrelatedHelperExcluded: true }));
