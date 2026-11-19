const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const stage = `${base}/n44-source-stage`;
const source = "ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0262";
const target = `${stage}/artifacts/7a/pages/0262`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
assert.deepEqual(read(`${source}/page.json`).blocks, read(`${target}/page.json`).blocks);
assert.equal(read(`${base}/stages/source262-metadata-erratum-FIRST.receipt.json`).exit, 0);
const outputs = [];
for (const name of ["page.md", "page.json", "audit.json"]) {
  const before = `${stage}/metadata-FIRST/0262/${name}`;
  fs.mkdirSync(path.dirname(before), { recursive: true });
  fs.copyFileSync(`${target}/${name}`, before, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(before, 0o444);
  fs.copyFileSync(`${source}/${name}`, `${target}/${name}`);
  assert.equal(sha(`${source}/${name}`), sha(`${target}/${name}`));
  outputs.push({ path: `${target}/${name}`, sha256: sha(`${target}/${name}`) });
}
fs.writeFileSync(`${stage}/metadata-erratum-binding.json`, `${JSON.stringify({
  metadataOnlyErratum: "p0262-math-1", sourceBlocksUnchanged: true,
  rawAssemblyReused: `${base}/stages/n44-assembly-FIRST.receipt.json`,
  sourceReviewReused: `${base}/source259-266-review/report.md`,
  modernCorrectionIndependentReviewPending: true, outputs,
}, null, 2)}\n`, { flag: "wx" });
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n44-adapt-prepare-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "adapt-prepare",
  "--book", "7a", "--edition", "modern-us-neutral", "--lesson", "alg7-c4-s3-n44",
  "--root", `${stage}/artifacts`, "--work", `${base}/n44-adapt-work`,
], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
