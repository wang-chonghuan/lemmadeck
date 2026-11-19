const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const stage = `${base}/n44-source-stage`;
const root = `${stage}/artifacts`;
const id = "alg7-c4-s3-n44";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
assert(!fs.existsSync(stage));
const inputs = [];
for (let page = 258; page <= 266; page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${source}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const from = `${source}/pages/${directory}/${name}`;
    const to = `${root}/7a/pages/${directory}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(from), hash(to));
    inputs.push(ref(from));
  }
}
save(`${stage}/inputs.json`, {
  selected: [id], inputs,
  sourceReview: ref(`${base}/source259-266-review/report.md`),
  affectedFinalizeReceipts: [261, 264].map(page =>
    ref(`${base}/stages/source${page}-supported-counter-RECOVERY2.receipt.json`)),
  sourceImagesReopened: 0, n45BoundaryOnly: true,
  affectedBindingReviewPending: true,
});
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n44-assembly-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", ".tmp/ld-s10y-lesson",
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { stdio: "inherit" });
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const folder = `${root}/7a/lessons/${id}`;
  const lesson = read(`${folder}/lesson.json`);
  const exercises = read(`${folder}/exercises.json`).exercises;
  assert.deepEqual(exercises.map(item => Number(item.number)),
    Array.from({ length: 15 }, (_, index) => 858 + index));
  assert.equal(lesson.figures.length, 0);
  const selected = [{
    id, proseBlocks: lesson.prose.length, exerciseCount: exercises.length,
    figures: [],
    outputs: ["lesson.json", "lesson.md", "exercises.json"].map(name => ref(`${folder}/${name}`)),
  }];
  save(`${stage}/candidate-binding.json`, {
    selected, durablePromotion: false, modernApproval: false,
    n45Excluded: true, preceding855857Excluded: true,
    assemblyReceipt: ref(`${base}/stages/n44-assembly-FIRST.receipt.json`),
  });
  console.log(JSON.stringify({ selected }));
}
