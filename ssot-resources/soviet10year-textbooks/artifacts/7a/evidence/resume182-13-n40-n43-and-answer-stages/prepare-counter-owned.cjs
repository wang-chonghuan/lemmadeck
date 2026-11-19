const fs = require("node:fs");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/counter-owned";
const source = ".claude/skills/ld-s10y-lesson/tools/layout.py";
const before = fs.readFileSync(".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/counter-affected/.claude__skills__ld-s10y-lesson__tools__layout.py", "utf8");
const current = fs.readFileSync(source, "utf8");
const helper = text => text.slice(text.indexOf("def _fraction_baselines("), text.indexOf("def _single_fraction_row("));
const guard = "    if len(_fraction_baselines(ink, a, b, line_h)) > 1:\n        return False\n";
assert.equal(helper(current), helper(before));
assert(current.includes(guard) && before.includes(guard));
const owned = current.replace(helper(current), "").replace(guard, "");
assert(!owned.includes("_fraction_baselines"));
fs.mkdirSync(base, { recursive: true });
const head = cp.spawnSync("git", ["show", `HEAD:${source}`], { encoding: "utf8" });
assert.equal(head.status, 0);
fs.writeFileSync(`${base}/head-layout.py`, head.stdout, { flag: "wx" });
fs.writeFileSync(`${base}/layout.py`, owned, { flag: "wx" });
const diff = cp.spawnSync("git", ["diff", "--no-index", "--", `${base}/head-layout.py`, `${base}/layout.py`], { encoding: "utf8" });
assert.equal(diff.status, 1, diff.stderr);
const patch = diff.stdout
  .replace(/^diff --git .+$/m, `diff --git a/${source} b/${source}`)
  .replace(/^--- .+$/m, `--- a/${source}`)
  .replace(/^\+\+\+ .+$/m, `+++ b/${source}`);
fs.writeFileSync(`${base}/own.patch`, patch, { flag: "wx" });
const sha = text => crypto.createHash("sha256").update(text).digest("hex");
fs.writeFileSync(`${base}/binding.json`, JSON.stringify({
  userHelperAndGuardUnchanged: true,
  excludedHelperSha256: sha(helper(current)),
  candidateWithoutUserHelper: true,
  head: head.stdout ? cp.spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim() : null,
  candidateSha256: sha(owned),
  workingFileSha256: sha(current),
  ownPatchSha256: sha(patch),
}, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ candidate: `${base}/layout.py`, ownPatch: `${base}/own.patch` }));
