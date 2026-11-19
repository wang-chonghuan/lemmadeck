const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const root = `${base}/n37-source-stage/artifacts`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
assert(!fs.existsSync(root));
assert(!fs.existsSync(`${book}/lessons/alg7-c4-s2-n37`));
const reviewPath = `${base}/source228-234-review/source228-234-review.json`;
const review = read(reviewPath);
const inputs = [];
for (let page = 227; page <= 234; page++) {
  const directory = String(page).padStart(4, "0");
  const folder = `${book}/pages/${directory}`;
  assert.deepEqual(read(`${folder}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${folder}/${name}`;
    if (page !== 227 && page !== 232 && name !== "audit.json") {
      const expected = review.pages.find((item) => item.physical_page === page);
      assert(expected && ["passed-unchanged", "source-pass-gate-failed"].includes(expected.status));
      assert.equal(hash(file), expected.files[name].sha256);
    }
    const target = `${root}/7a/pages/${directory}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    inputs.push(ref(file));
  }
}
fs.writeFileSync(`${base}/n37-source-stage/inputs.json`, `${JSON.stringify({
  inputs, sourceReview: ref(reviewPath),
  affectedReview: ref(`${base}/source232-affected-review/source232-affected-review.json`),
  prior227Review: ref(".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source221-227-review.md"),
  selected: ["alg7-c4-s2-n37"], neighboringPartialLessonsNotSelected: true,
  sourceImagesReopened: 0, sourceNumberingNotSilentlyChanged: true,
}, null, 2)}\n`, { flag: "wx" });
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n37-assembly-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", `${base}/n37-source-stage/work`,
  "--books", "ssot-resources/soviet10year-textbooks/sources",
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { cwd: process.cwd(), stdio: "inherit" });
process.exitCode = result.status ?? 1;
