const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { proseFlow } = require("../../../../../.claude/skills/ld-s10y-lesson/tools/htmlfrag.js");
const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const edition = `${book}/editions/modern-us-neutral`;
const target = `${book}/evidence/resume182-11-modern-n34-n36`;
assert(!fs.existsSync(target));
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const ref = (p) => ({ path: p, sha256: hash(p) });
const files = new Set();
const include = (p) => { assert(fs.statSync(p).isFile(), p); files.add(p); };
const walk = (dir, predicate = () => true) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!["runtime", "node_modules", ".cache", ".config", ".home"].includes(entry.name)
        && !entry.name.includes("profile")) walk(p, predicate);
    } else if (predicate(p)) include(p);
  }
};
const completed = ["alg7-c4-s1-n34", "alg7-c4-s1-n35", "alg7-c4-s2-n36"].map((id) => {
  const dir = `${edition}/lessons/${id}`;
  const L = read(`${dir}/lesson.json`);
  const X = read(`${dir}/exercises.json`);
  const A = read(`${dir}/answer-keys.json`);
  const D = read(`${dir}/choice-set/draft.json`);
  assert.equal(L.status, "ready");
  assert.equal(X.status, "ready");
  assert.equal(A.status, "ready");
  assert.equal(read(`${dir}/answer-keys.audit.json`).status, "pass");
  assert.equal(read(`${dir}/choice-set/review.json`).outcome, "pass");
  assert(A.answers.every((a) => a.grading === "ungraded" && a.parts.length === 0));
  assert.equal(A.answers.length, X.exercises.length);
  return { id, proseBlocks: L.prose.length,
    proseParagraphs: proseFlow(L.prose, L.section_breaks).filter((b) => !["fig", "cap"].includes(b.kind)).length,
    exercises: X.exercises.length,
    figures: read(`${dir}/figures.json`).figures.length, choiceFigures: D.new_figures.length,
    questions: D.questions.length,
    options: D.questions.reduce((n, q) => n + q.view.options.length, 0),
    current: ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json",
      "answer-keys.json", "answer-keys.audit.json", "choice-set/seed.json",
      "choice-set/draft.json", "choice-set/review.json"].map((name) => ref(`${dir}/${name}`)) };
});
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (entry.isFile() && /\.(md|json|cjs|mjs|stdout|stderr)$/.test(entry.name)) include(`${base}/${entry.name}`);
}
walk(`${base}/stages`, (p) => {
  const prefix = p.replace(/\.(start\.json|receipt\.json|stdout|stderr)$/, "");
  return fs.existsSync(`${prefix}.receipt.json`);
});
for (const name of ["n34-errata", "n34-finalize-inputs-before", "n35-finalize-inputs-before"]) walk(`${base}/${name}`);
for (const name of ["n34-choice-author", "n35-choice-author", "n36-author"]) {
  walk(`${base}/${name}`, (p) =>
    /\.(md|json|stdout|stderr|raw|txt|cjs|mjs)$/.test(p) &&
    !p.endsWith("/seed.json") &&
    (!p.endsWith("/draft.json") || name !== "n34-choice-author"));
}
for (const name of ["n35-choice-repaired", "n36-choice-repaired"]) {
  if (fs.existsSync(`${base}/${name}`)) {
    walk(`${base}/${name}`, (p) => !/\/(seed|draft|review)\.json$/.test(p));
  }
}
if (fs.existsSync(`${base}/n36-774-figures`)) {
  walk(`${base}/n36-774-figures`, (p) => !p.endsWith(".svg") || /fail/i.test(p));
}
for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  if (entry.isDirectory() && /answer-review-(FIRST|affected).*receipts|choice-review-(FIRST|affected)/.test(entry.name)) walk(`${base}/${entry.name}`);
}
for (const name of ["n34-figures", "n35-figures"]) {
  walk(`${base}/${name}`, (p) =>
    /\/(failed-independent-visual-FIRST|failed-files|failed-author-preview-01|failed-report-01)\//.test(p) ||
    /\/(source-inventory|independent-label-repair|text-binding|repair)\.json$/.test(p));
}
const display = [];
walk(`${base}/display`);
for (const entry of fs.readdirSync(`${base}/display-current`, { withFileTypes: true })) {
  assert(entry.isDirectory());
  const dir = `${base}/display-current/${entry.name}`;
  const result = read(`${dir}/result.json`);
  assert.equal(result.status, "pass");
  assert.equal(result.checks.length, 6);
  const visual = read(`${dir}/visual-review.json`);
  assert.equal(visual.status, "pass");
  walk(dir);
  for (const check of result.checks) {
    assert.equal(check.screenshot.sha256, hash(check.screenshot.path));
    display.push({ lesson: check.lesson, surface: check.surface, viewport: check.viewport,
      screenshotOrigin: check.screenshot });
  }
}
assert.equal(display.length, 18);
const retained = [];
const byDigest = new Map();
for (const p of [...files].sort()) {
  const relative = path.relative(base, p);
  assert(!relative.startsWith(".."));
  const digest = hash(p);
  let destination = byDigest.get(digest);
  if (!destination) {
    destination = `${target}/${relative.replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(p, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(destination), digest);
    byDigest.set(digest, destination);
  }
  retained.push({ historicalOriginRelativeToBatch: relative, originalSha256: digest,
    retained: ref(destination) });
}
for (const item of display) {
  item.screenshot = ref(byDigest.get(item.screenshotOrigin.sha256));
  delete item.screenshotOrigin;
}
for (const entry of fs.readdirSync(`${edition}/figures/evidence`, { withFileTypes: true })) {
  const dir = `${edition}/figures/evidence/${entry.name}/resume182-11-approved`;
  if (!fs.existsSync(dir)) continue;
  for (const name of ["spec", "render"]) fs.renameSync(`${dir}/${name}.json`, `${dir}/${name}.record`);
}
const manifest = {
  ticket: "STEMROBIN-182", book: "7a", edition: "modern-us-neutral", completed,
  totals: completed.reduce((r, l) => {
    for (const key of Object.keys(r)) r[key] += l[key];
    return r;
  }, { proseBlocks: 0, proseParagraphs: 0, exercises: 0, figures: 0, choiceFigures: 0, questions: 0, options: 0 }),
  sourcePages: [215, 218, 219, 221, 222, 223, 224, 225, 226, 227],
  source225_765b: "Initially misread a>=0; actual source a>0, corrected transcription.",
  errataModernOnly: ["p0215-math-1", "p0218-math-1", "p0219-math-1"],
  sourceCropOldIdentity: "No old digest baseline; current binding only.",
  display, retained, uniqueEvidenceFiles: byDigest.size,
  historicalOriginPathsAreNotRuntimeDependencies: true,
  imagesOpenedDuringRetention: 0, parentConservativeImages: 6,
  firstFailuresPreserved: true, unrelatedDirtyChangesExcluded: true,
  noDBPublisherAppInteractionCap3MergeDeployClosure: true,
  fullMechanicalDefenceDeferredToFinalHandoff: true,
  displayScope: "Current offline display derivations only; caption/footer repairs do not modify the application or durable lesson prose.",
  n37BoundaryOnlyNotDelivered: true,
};
fs.writeFileSync(`${target}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ evidence: target, uniqueEvidenceFiles: byDigest.size, totals: manifest.totals }));
