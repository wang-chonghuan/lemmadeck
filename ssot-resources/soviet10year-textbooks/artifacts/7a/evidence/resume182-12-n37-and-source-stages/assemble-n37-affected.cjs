const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const stage = `${base}/n37-source-stage-affected`;
const root = `${stage}/artifacts`;
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const ref = (file) => ({ path: file, sha256: hash(file) });
assert(!fs.existsSync(stage));
const inputs = [];
for (let page = 227; page <= 234; page++) {
  const directory = String(page).padStart(4, "0");
  const folder = `${book}/pages/${directory}`;
  assert.deepEqual(read(`${folder}/audit.json`).errors, []);
  if ([231, 232].includes(page)) {
    const expected = read(`${base}/source-FIRST-snapshots/${directory}/page.json`);
    if (page === 232) {
      assert(expected.blocks[2].lines[1].includes("\\sqrt{2^8\\times3^4}"));
      expected.blocks[2].lines[1] = expected.blocks[2].lines[1]
        .replace("\\sqrt{2^8\\times3^4}", "\\sqrt{2^6\\times3^4}");
    }
    const current = read(`${folder}/page.json`);
    delete current.meta.exercise_numbering_errata;
    assert.deepEqual(current, expected);
  }
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${folder}/${name}`;
    const target = `${root}/7a/pages/${directory}/${name}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
    inputs.push(ref(file));
  }
}
fs.writeFileSync(`${stage}/inputs.json`, `${JSON.stringify({
  inputs, selected: ["alg7-c4-s2-n37"],
  FIRSTFailure: ref(`${base}/stages/n37-assembly-FIRST.receipt.json`),
  metadataOnlyRecovery: true, allPrintedLabelsAndTextRetained: true,
  originalExponentRepairInherited: true, sourceImagesReopened: 0,
  independentNumberingReviewPending: true,
}, null, 2)}\n`, { flag: "wx" });
const result = cp.spawnSync("node", [
  `${base}/run-stage.cjs`, "n37-assembly-numbering-affected",
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py", "assemble",
  "--book", "7a", "--root", root, "--work", `${stage}/work`,
  "--books", "ssot-resources/soviet10year-textbooks/sources",
  "--toc", "ssot-resources/soviet10year-textbooks/toc/7a/zh.json",
], { cwd: process.cwd(), stdio: "inherit" });
if (result.status !== 0) {
  process.exitCode = result.status ?? 1;
} else {
  const exercisePath = `${root}/7a/lessons/alg7-c4-s2-n37/exercises.json`;
  const exercises = read(exercisePath).exercises;
  assert.deepEqual(exercises.map((item) => Number(item.number)),
    Array.from({ length: 22 }, (_, index) => index + 777));
  for (const [number, printed] of [["786", "736"], ["787", "737"], ["788", "738"]]) {
    const item = exercises.find((exercise) => exercise.number === number);
    assert.equal(item.source_number, printed);
    assert(item.text.startsWith(`${printed}.`));
    assert.equal(item.numbering_erratum.corrected, number);
  }
  fs.writeFileSync(`${stage}/candidate-binding.json`, `${JSON.stringify({
    exerciseFile: ref(exercisePath), count: exercises.length,
    logicalNumbers: exercises.map((item) => item.number),
    printedNumberingErrata: exercises.filter((item) => item.numbering_erratum)
      .map((item) => ({ number: item.number, source_number: item.source_number,
        numbering_erratum: item.numbering_erratum })),
    durableLessonPromotion: false,
  }, null, 2)}\n`, { flag: "wx" });
}
