const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const source = `${base}/n45-source-stage/artifacts/7a`;
const id = "alg7-c4-s3-n45";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: hash(file) });
const head = cp.execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const delivery = read(`${base}/n44-pushed.json`);
assert.equal(delivery.commit, head);
assert.equal(delivery.remoteShaVerified, head);
assert.equal(delivery.status, "pushed-verified");
const reviewFile = `${base}/n45-modern-review/output-binding/review.json`;
const review = read(reviewFile);
assert.equal(review.candidateBindingStatus, "pass");
assert.deepEqual(review.defects, []);
assert.deepEqual([...review.actualOutputInventory].sort(),
  ["adaptation.audit.json", "exercises.json", "figures.json", "lesson.json"]);
assert.equal(review.requestedChangesFile.inlineDeclarationsUnchanged, true);
for (const file of review.outputFiles) assert.equal(hash(file.path), file.sha256);
for (const figure of review.figureBindings) {
  for (const field of ["source", "spec", "svg", "render", "review", "preview"]) {
    assert.equal(hash(figure[field].path), figure[field].sha256);
  }
}
for (const file of review.inheritedReceipts) {
  assert.equal(hash(file.path), file.sha256);
  assert.equal(file.exit, 0);
}
const rawBefore = read(`${book}/book.json`);
const modernBefore = read(`${book}/editions/modern-us-neutral/book.json`);
assert(!rawBefore.lessons.some(row => row.id === id));
assert(!modernBefore.lessons.some(row => row.id === id));
const outputs = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(from), hash(to));
  outputs.push(ref(to));
};
copy(`${book}/book.json`, `${base}/n45-raw-index-before.json`);
copy(`${book}/editions/modern-us-neutral/book.json`, `${base}/n45-modern-index-before.json`);
for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
  copy(`${source}/lessons/${id}/${name}`, `${book}/lessons/${id}/${name}`);
}
for (const file of review.outputFiles) {
  copy(file.path, `${book}/editions/modern-us-neutral/lessons/${id}/${path.basename(file.path)}`);
}
const row = read(`${source}/book.json`).lessons.find(item => item.id === id);
assert.equal(row.exercises, 19);
assert.equal(row.figures, 3);
const rawNext = structuredClone(rawBefore);
rawNext.lessons.push(row);
rawNext.pages += 7;
rawNext.audit.exercise_count += 19;
rawNext.audit.exercise_range[1] = 891;
rawNext.audit.figure_numbers.push(59, 60, 61);
rawNext.audit.warnings.push("Appended only complete RAW n45 through891 from reviewed266-273; prior266 reused and n46 open boundary excluded. Modern text/figures approved separately; answers, choices and display remain unfinished.");
assert.deepEqual(rawNext.lessons.slice(0, rawBefore.lessons.length), rawBefore.lessons);
assert.equal(rawNext.audit.figure_numbers.length, new Set(rawNext.audit.figure_numbers).size);
fs.writeFileSync(`${book}/book.json`, `${JSON.stringify(rawNext, null, 2)}\n`);
const result = cp.spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [
  `${base}/../resume182-12/update-modern-index.py`,
  `${source}/editions/modern-us-neutral/book.json`, id,
], { stdio: "inherit" });
assert.equal(result.status, 0);
assert.deepEqual(read(`${book}/editions/modern-us-neutral/book.json`).lessons.filter(item => item.id !== id),
  modernBefore.lessons);
fs.writeFileSync(`${base}/n45-promotion.json`, `${JSON.stringify({
  lesson: id, outputs, review: ref(reviewFile), previousN44PushVerified: delivery,
  contractCorrection: "Finalizer produces four files. The parent's fifth-file expectation was mistaken; changes are inline and hash-bound. No fifth file or repeated review was needed.",
  rawIndex: ref(`${book}/book.json`), modernIndex: ref(`${book}/editions/modern-us-neutral/book.json`),
  previousRowsUnchanged: true, sourceAndModernBytesUnchanged: true,
  originalExercises: 19, figures: 3, completedOfflineCourseCredit: false,
  databasePublishAppDependenciesMergeDeployClosure: false,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ retained: id, originals: 19, figures: 3, completedOfflineCourseCredit: false }));
