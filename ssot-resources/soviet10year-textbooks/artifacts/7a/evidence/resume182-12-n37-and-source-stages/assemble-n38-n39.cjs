const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const stage = `${base}/n38-n39-source-stage`;
const root = `${stage}/artifacts`;
const ids = ["alg7-c4-s2-n38", "alg7-c4-s2-n39"];
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
};
const review = `${base}/source237-241-affected-review/source237-241-affected-review.md`;
assert.match(process.argv[2] || "", /^[a-f0-9]{64}$/);
assert.equal(hash(review), process.argv[2]);
assert(!fs.existsSync(stage));
const inputs = [];
for (let page = 234; page <= 242; page++) {
  const directory = String(page).padStart(4, "0");
  assert.deepEqual(read(`${book}/pages/${directory}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${book}/pages/${directory}/${name}`;
    copy(file, `${root}/7a/pages/${directory}/${name}`);
    inputs.push(ref(file));
  }
}
const crop = `${base}/source235-242-author/work/7a/pages/0241/figures/fig-55.png`;
assert.equal(hash(crop), "0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f");
copy(crop, `${stage}/work/7a/pages/0241/figures/fig-55.png`);
save(`${stage}/inputs.json`, {
  inputs, crop: ref(crop), affectedReview: ref(review),
  priorReviews: [
    ref(`${base}/source228-234-review/source228-234-review.json`),
    ref(`${base}/source235-242-review/source235-242-review.json`),
    ref(`${base}/source239-arbitration/source239-arbitration.json`),
  ],
  selected: ids, nextPartialLessonExcluded: true, sourceImagesReopened: 0,
});
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n38-n39-assembly-FIRST",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", `${stage}/work`,
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { cwd: process.cwd(), stdio: "inherit" });
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const selected = [];
  for (const [index, id] of ids.entries()) {
    const exercises = read(`${root}/7a/lessons/${id}/exercises.json`).exercises;
    const first = index === 0 ? 799 : 806;
    const count = index === 0 ? 7 : 14;
    assert.deepEqual(exercises.map((item) => Number(item.number)),
      Array.from({ length: count }, (_, i) => first + i));
    const lesson = read(`${root}/7a/lessons/${id}/lesson.json`);
    assert.deepEqual(lesson.figures.map((item) => item.id), index === 0 ? [] : ["fig-55"]);
    if (index === 1) {
      const owner = exercises.find((item) => item.number === "819");
      assert.deepEqual(owner.figure_refs, ["fig-55"]);
      assert.equal(owner.figures.length, 1);
      assert(owner.pages.some((value) => value.startsWith("p0241#")));
      assert(owner.pages.some((value) => value.startsWith("p0242#")));
      assert(!lesson.prose.some((item) => item.kind === "fig" || item.kind === "cap"));
      assert.equal(hash(`${root}/7a/figures/fig-55.png`), hash(crop));
    }
    selected.push({
      id, proseBlocks: lesson.prose.length, exerciseCount: count,
      outputs: ["lesson.json", "lesson.md", "exercises.json"]
        .map((name) => ref(`${root}/7a/lessons/${id}/${name}`)),
    });
  }
  save(`${stage}/candidate-binding.json`, {
    selected, durableLessonPromotion: false, modernApproval: false,
    n40Excluded: true, assembly: ref(`${base}/stages/n38-n39-assembly-FIRST.receipt.json`),
  });
}
