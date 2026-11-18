const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const ticket = ".intentfold/tickets/STEMROBIN-182";
const base = `${ticket}/tmp/resume182-8`;
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const target = `${book}/evidence/resume182-8-modern-n31-n33`;
assert(!fs.existsSync(target));
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = (file) => ({ path: file, sha256: hash(file) });
const files = new Set();
const include = (file) => { assert(fs.statSync(file).isFile(), file); files.add(file); };
const includeIfPresent = (file) => { if (fs.existsSync(file)) include(file); };
const lessons = ["alg7-c4-s1-n31", "alg7-c4-s1-n32", "alg7-c4-s1-n33"];
const completed = lessons.map((id) => {
  const root = `${edition}/lessons/${id}`;
  const L = read(`${root}/lesson.json`);
  const X = read(`${root}/exercises.json`);
  const answers = read(`${root}/answer-keys.json`);
  const audit = read(`${root}/answer-keys.audit.json`);
  const draft = read(`${root}/choice-set/draft.json`);
  const review = read(`${root}/choice-set/review.json`);
  assert.equal(L.status, "ready");
  assert.equal(X.status, "ready");
  assert.equal(answers.status, "ready");
  assert.equal(audit.status, "pass");
  assert.equal(review.outcome, "pass");
  assert.equal(answers.answers.length, X.exercises.length);
  return { id, proseBlocks: L.prose.length, exercises: X.exercises.length,
    figures: L.figures.length, questions: draft.questions.length,
    options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
    current: ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json",
      "answer-keys.json", "answer-keys.audit.json", "choice-set/seed.json",
      "choice-set/draft.json", "choice-set/review.json"].map((name) => ref(`${root}/${name}`)),
    raw: ["lesson.md", "lesson.json", "exercises.json"].map((name) => ref(`${book}/lessons/${id}/${name}`)) };
});
for (const name of ["source210-216-author.md", "source210-216-author.json",
  "original210-216-files.json", "source210-216-review.md", "source210-216-affected-review.md",
  "n33-math-review.md", "n33-answer-binding.md", "source212-214-affected-first-receipts.json",
  "source214-errata-binding-recovery.json", "n32-figures-author.md", "n32-figures-author.json",
  "n32-figures-review.md", "n32-figure-promotion.json", "n31-author.md", "n31-author.json",
  "n32-author.md", "n32-author.json", "normalize-n32-markers.cjs",
  "n32-exercises-before-marker-normalization.json", "check-display.mjs",
  "run-stage.cjs", "assemble-n32.cjs", "promote-n32-figures.cjs", "layout-owned.patch",
  "check-index-counter.py", "index-counter-result.json", "n31-answer-binding.md",
  "n32-answer-binding.md", "n32-independent-source.md", "n34-local-math-review.md",
  "stage-modern-batch.cjs", "retain-batch.cjs", "n31-choice/draft-FIRST-failed.json",
  "n31-choice/review-FIRST-failed.json", "n31-choice/review-FIRST-failed.md"]) include(`${base}/${name}`);
for (const name of ["source217-220-author.md", "source217-220-author.json", "source217-220-review.md"]) {
  include(`${ticket}/tmp/resume182-9/${name}`);
}
for (let page = 210; page <= 216; page++) {
  for (const suffix of ["start.json", "stdout", "stderr", "final.json"]) include(`${base}/finalize${page}-FIRST.${suffix}`);
}
for (let page = 217; page <= 220; page++) {
  for (const suffix of ["start.json", "rawstdout", "rawstderr", "final.receipt.json"]) {
    include(`${ticket}/tmp/resume182-9/p${page}.finalize-FIRST.${suffix}`);
  }
}
for (const page of [212, 213, 214]) {
  for (const name of ["page.md", "page.json", "audit.json"]) include(`${base}/original210-216/${page}/${name}`);
  for (const suffix of ["start.json", "stdout", "stderr", "json"]) include(`${base}/p0${page}.affected.${suffix}`);
}
for (const name of ["page.md", "page.json", "audit.json"]) include(`${base}/failed214-errata-wrap/${name}`);
for (const suffix of ["start.json", "stdout", "stderr", "json"]) include(`${base}/p0214.errata-binding-recovery.${suffix}`);
for (const name of ["review.md", "inputs.json", "recovery.json"]) include(`${base}/counter205-206/${name}`);
for (const page of [205, 206]) {
  include(`${base}/counter205-206/before/${page}/audit.json`);
  for (const suffix of ["start.json", "stdout", "stderr", "json"]) include(`${base}/counter205-206/p0${page}.counter-recovery.${suffix}`);
}
for (const number of [31, 32, 33]) {
  const stage = `${base}/n${number}-source-stage`;
  for (const name of ["inputs.json", "source-stage-receipt.json"]) include(`${stage}/${name}`);
  for (const prefix of ["FIRST-assembly", `FIRST-modern-prepare-alg7-c4-s1-n${number}`]) {
    for (const suffix of ["start.json", "stdout", "stderr", "json"]) include(`${stage}/${prefix}.${suffix}`);
  }
  include(`${base}/n${number}-choice/review.md`);
}
for (const id of ["fig-44", "fig-45", "tbl-p0209-02", "tbl-p0210-01"]) {
  const folder = `${base}/n32-figures/${id}`;
  for (const name of ["inventory.json", "contract.json", "offline-preview.result.json",
    "attempt-1.receipt.json", "attempt-1.spec.json", "attempt-2.receipt.json",
    "attempt-1.render.json", `attempt-1.${id}.svg`, "attempt-1.complete-preview.png"]) includeIfPresent(`${folder}/${name}`);
}
for (const filename of fs.readdirSync(`${base}/stages`)) include(`${base}/stages/${filename}`);
const display = [];
for (const label of fs.readdirSync(`${base}/display`)) {
  const root = `${base}/display/${label}`;
  const result = read(`${root}/result.json`);
  assert.equal(result.status, "pass");
  assert.equal(result.checks.length, 6);
  assert.equal(new Set(result.checks.map((check) => check.lesson)).size, 1);
  include(`${root}/result.json`);
  include(`${root}/visual-review.md`);
  for (const check of result.checks) {
    assert.equal(check.screenshot.sha256, hash(check.screenshot.path));
    include(check.screenshot.path);
    display.push({ lesson: check.lesson, surface: check.surface, viewport: check.viewport, screenshot: check.screenshot });
  }
}
assert.equal(display.length, 18);
for (const lesson of lessons) assert.equal(display.filter((item) => item.lesson === lesson).length, 6);
const retained = [];
for (const file of [...files].sort()) {
  const relative = path.relative(`${ticket}/tmp`, file);
  assert(!relative.startsWith(".."));
  const destination = `${target}/${relative.replace(/\.json$/, ".record")}`;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(file, destination, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(file), hash(destination));
  retained.push({ historicalOriginRelativeToTicketTmp: relative,
    originalSha256: hash(file), retained: ref(destination) });
}
for (const id of ["fig-44", "fig-45", "tbl-p0209-02", "tbl-p0210-01"]) {
  const evidence = `${edition}/figures/evidence/${id}/n32-author`;
  for (const name of ["spec", "render", "review"]) {
    const original = `${evidence}/${id}.${name}.json`;
    const destination = `${evidence}/${id}.${name}.record`;
    assert(!fs.existsSync(destination));
    fs.renameSync(original, destination);
  }
}
const durableByOrigin = new Map(retained.map((item) => [
  item.historicalOriginRelativeToTicketTmp, item.retained,
]));
for (const item of display) {
  item.screenshot = durableByOrigin.get(path.relative(`${ticket}/tmp`, item.screenshot.path));
  assert(item.screenshot);
}
const manifest = {
  ticket: "STEMROBIN-182", book: "7a", edition: "modern-us-neutral", completed,
  currentBookIndexes: [ref(`${book}/book.json`), ref(`${edition}/book.json`)],
  newIndexOrder: lessons,
  previousRawAndModernIndexRowsUnchanged: [18, 11],
  display, retained, historicalOriginPathsAreNotRuntimeDependencies: true,
  sourcePages: Array.from({ length: 11 }, (_, i) => 210 + i),
  sourcePageMathematicsUnchanged: true, confirmedErrataModernOnly: [
    "p0212-math-1", "p0214-math-1", "p0214-math-2"],
  parentImagesLoaded: 6, originalFailuresPreserved: true,
  preexistingDirtyChangesExcluded: true, noDBPublisherAppDeployMergeClosure: true,
  finalMechanicalDefenceDeferredToHandoff: true,
  nextBatchConfirmedErrataUnapplied: {
    review: durableByOrigin.get("resume182-8/n34-local-math-review.md"),
    corrections: ["p0215 rising interval lower endpoint0 to6", "p0219 exercise751 left variable x to y"],
    originalSourceMathematicsUnchanged: true,
    n34ModernAndWholeLessonNotApproved: true,
  },
  totals: completed.reduce((totals, lesson) => {
    for (const key of Object.keys(totals)) totals[key] += lesson[key] || 0;
    return totals;
  }, { proseBlocks: 0, exercises: 0, figures: 0, questions: 0, options: 0 }),
};
fs.writeFileSync(`${target}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ evidence: target, retainedFiles: retained.length, totals: manifest.totals }));
