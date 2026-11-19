const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const stage = `${base}/n40-source-stage`;
const root = `${stage}/artifacts`;
const id = "alg7-c4-s2-n40";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const review = `${base}/source243-250-review/review.md`;
assert.equal(hash(review), "32ed61fa1441633b7c1a22e158e35d014a5639948668d125ff65d9d269ad764e");
assert(!fs.existsSync(stage));
const inputs = [];
for (let page = 242; page <= 246; page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${book}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${book}/pages/${directory}/${name}`;
    const target = `${root}/7a/pages/${directory}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(target), hash(file));
    inputs.push(ref(file));
  }
}
save(`${stage}/inputs.json`, {
  selected: [id], inputs, sourceReview: ref(review),
  prior242SourceAndDisplayPassInherited: true,
  n41BoundaryOnly: true, sourceImagesReopened: 0,
});
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n40-assembly-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", `${stage}/work`,
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { cwd: process.cwd(), stdio: "inherit" });
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const folder = `${root}/7a/lessons/${id}`;
  const exercises = read(`${folder}/exercises.json`).exercises;
  assert.deepEqual(exercises.map((exercise) => Number(exercise.number)),
    Array.from({ length: 14 }, (_, index) => 820 + index));
  const lesson = read(`${folder}/lesson.json`);
  assert.deepEqual(lesson.figures, []);
  save(`${stage}/candidate-binding.json`, {
    selected: [{
      id, proseBlocks: lesson.prose.length, exerciseCount: exercises.length,
      figures: lesson.figures.length,
      outputs: ["lesson.json", "lesson.md", "exercises.json"]
        .map((name) => ref(`${folder}/${name}`)),
    }],
    durableLessonPromotion: false, modernApproval: false,
    n41Excluded: true, assembly: ref(`${base}/stages/n40-assembly-FIRST.receipt.json`),
  });
}
