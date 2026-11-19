const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const stage = `${base}/n41-n43-source-stage`;
const root = `${stage}/artifacts`;
assert(!fs.existsSync(stage));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = file => ({ path: file, sha256: hash(file) });
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const inputs = [];
for (let page = 246; page <= 258; page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${source}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${source}/pages/${directory}/${name}`;
    const target = `${root}/7a/pages/${directory}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(target), hash(file));
    inputs.push(ref(file));
  }
}
const reviews = ["source243-250-review/review.md", "source251-258-review/review.md"]
  .map(file => ref(`${base}/${file}`));
const ids = ["alg7-c4-s2-n41", "alg7-c4-s3-n42", "alg7-c4-s3-n43"];
save(`${stage}/inputs.json`, {
  selected: ids, inputs, sourceReviews: reviews,
  sourceImagesReopened: 0, n44BoundaryOnly: true,
  counterReviewSeparate: true,
});
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n41-n43-assembly-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", ".tmp/ld-s10y-lesson",
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { stdio: "inherit" });
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const ranges = [[834, 850], [851, 854], [855, 857]];
  const selected = ids.map((id, index) => {
    const folder = `${root}/7a/lessons/${id}`;
    const lesson = read(`${folder}/lesson.json`);
    const exercises = read(`${folder}/exercises.json`).exercises;
    const [first, last] = ranges[index];
    assert.deepEqual(exercises.map(ex => Number(ex.number)),
      Array.from({ length: last - first + 1 }, (_, offset) => first + offset));
    return {
      id, proseBlocks: lesson.prose.length, exerciseCount: exercises.length,
      figures: lesson.figures.map(figure => ({ id: figure.id, owner_exercise: figure.owner_exercise })),
      outputs: ["lesson.json", "lesson.md", "exercises.json"].map(name => ref(`${folder}/${name}`)),
    };
  });
  save(`${stage}/candidate-binding.json`, {
    selected, durablePromotion: false, modernApproval: false,
    n44Excluded: true, preceding833Excluded: true,
    assemblyReceipt: ref(`${base}/stages/n41-n43-assembly-FIRST.receipt.json`),
  });
  console.log(JSON.stringify({ selected }));
}
