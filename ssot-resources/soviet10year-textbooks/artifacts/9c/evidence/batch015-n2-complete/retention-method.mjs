import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/a07e/lemmadeck");
const book = "ssot-resources/soviet10year-textbooks/artifacts/9c";
const id = "ana9-c1-s1-n2";
const lesson = `${book}/editions/modern-us-neutral/lessons/${id}`;
const evidence = `${book}/evidence/batch015-n2-complete`;
const independent = ".tmp/s10y-choice/batch015-ana9-n2-independent";
const localization = ".tmp/s10y-choice/batch015-ana9-n2-localization-independent";
const visualRoot = ".tmp/s10y-display/batch015-ana9-n2-independent";
const display = `.intentfold/tickets/STEMROBIN-184/tmp/offline-batch015/${id}`;
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = file => ({ path: file, sha256: hash(file) });
const load = file => JSON.parse(fs.readFileSync(file));
const native = load(`${display}/result.json`);
const visual = load(`${visualRoot}/visual-review.json`);
assert.equal(native.status, "pass");
assert.equal(visual.status, "pass");
assert.equal(load(`${localization}/affected-review.json`).outcome, "pass");
assert.equal(load(`${independent}/validation-final.json`).exit, 0);
assert.equal(load(`${lesson}/answer-keys.audit.json`).status, "pass");
assert.equal(load(`${lesson}/answer-keys.json`).answers.length, 7);
const draft = load(`${lesson}/choice-set/draft.json`);
assert.equal(draft.questions.length, 7);
assert.equal(draft.questions.reduce((n, q) => n + q.view.options.length, 0), 28);
assert.equal(hash(`${lesson}/choice-set/draft.json`), visual.recorded_producer_draft_binding.sha256);
assert.equal(hash(`${localization}/affected-review.json`), visual.evidence.consumed_localization_review.sha256);
assert.equal(hash(`${localization}/identity-correction.json`), visual.evidence.identity_correction.sha256);
assert.equal(visual.budgets.cumulative_image_opens, 6);
assert.equal(visual.images.length, 2);
for (const image of visual.images) assert.equal(hash(image.path), image.sha256);
const entries = [];
function addTree(source, relative, skip = new Set()) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    assert.ok(!entry.isSymbolicLink());
    const input = `${source}/${entry.name}`;
    const output = `${relative}/${entry.name}`;
    if (entry.isDirectory()) addTree(input, output);
    else entries.push([input, output]);
  }
}
addTree(".tmp/s10y-choice/batch015-ana9-n2-repair", "author", new Set(["seed.json"]));
addTree(independent, "independent");
addTree(localization, "localization");
addTree(visualRoot, "display-review");
addTree(display, "display");
entries.push([
  ".intentfold/tickets/STEMROBIN-184/tmp/check-offline-batch015-n2.mjs",
  "display-method.mjs"
]);
entries.push([
  ".intentfold/tickets/STEMROBIN-184/tmp/retain-batch015-n2.mjs",
  "retention-method.mjs"
]);
assert.ok(!fs.existsSync(evidence));
fs.mkdirSync(evidence);
const retained = entries.map(([source, relative]) => {
  const output = `${evidence}/${relative}`;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, 0o444);
  assert.equal(hash(output), hash(source));
  return { source, retained: output, bytes: fs.statSync(output).size, sha256: hash(output) };
});
const retention = `${evidence}/retention.json`;
fs.writeFileSync(retention, JSON.stringify({
  schema: "s10y-evidence-retention@1", ticket: "STEMROBIN-184",
  createdAt: new Date().toISOString(), files: retained,
  copiedFiles: retained.length, copiedBytes: retained.reduce((n, f) => n + f.bytes, 0),
  seed_reference: record(`${lesson}/choice-set/seed.json`),
  scope: "Retained original author/fault receipts, independent math freezes, affected localization, identity correction and completed display exactly once. Original paths inside immutable reports are provenance; this mapping locates their retained bytes. No runtime, source PDF or previous evidence package copied."
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
const output = `${book}/evidence/batch015-n2-completion.json`;
fs.writeFileSync(output, JSON.stringify({
  schema: "s10y-offline-batch-completion@1", ticket: "STEMROBIN-184",
  createdAt: new Date().toISOString(), status: "pass",
  scope: "Existing lesson's missing choice stage completed offline; not publication or ticket handoff",
  totals: { lessons: 1, answers: 7, choices: 7, options: 28, figures: 0 },
  lessons: [{
    lesson: id,
    artifacts: [
      ...["lesson", "exercises", "figures", "adaptation.audit", "answer-keys", "answer-keys.audit"].map(name => record(`${lesson}/${name}.json`)),
      ...["seed", "draft", "review"].map(name => record(`${lesson}/choice-set/${name}.json`))
    ],
    independent_math: ["source-first.md", "view-first.md", "internal-comparison.md", "validation-final.json"].map(name => record(`${evidence}/independent/${name}`)),
    localization: record(`${evidence}/localization/affected-review.json`),
    identity_correction: record(`${evidence}/localization/identity-correction.json`),
    offline_acceptance: record(`${evidence}/display/result.json`),
    visual_review: record(`${evidence}/display-review/visual-review.json`),
    screenshots: visual.images.map(image => record(`${evidence}/display/${path.basename(image.path)}`))
  }],
  retained_evidence: record(retention),
  qualifications: [
    "Seven answers, existing prose, written exercises and their earlier display passes are inherited unchanged, not rerun. Historical plan lines264-270 report desktop/mobile display and 7/7 answer review, but original screenshot/report files were not recovered in bounded searches; no historical screenshot hash or renewed review is claimed.",
    "The new author independently solved sources before constructing alternatives. Parent source-first, view-first and internal comparison passed; this is honest parent self-review, not a separately spawned mathematical reviewer.",
    "Chinese localization changes only visible prose: all151TeX spans and non-view fields are unchanged. Lovelace's affected wording pass and attribution-only correction are retained; original review bytes remain unchanged.",
    "Q3 explicitly handles zero and nonzero ratio without adopting a0^0convention. Choice recognition does not certify independent proof production.",
    "Only two headless offline choice screenshots were newly checked and actually inspected by Lovelace. No headed live-product, grading or navigation acceptance is claimed."
  ],
  parent_image_opens: 0, new_reviewer_image_opens: 2,
  reviewer_cumulative_image_opens: 6, new_paid_calls: 0,
  database_writes: 0, published: false
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
console.log(JSON.stringify({ output, sha256: hash(output), retention: record(retention), files: retained.length, bytes: retained.reduce((n, f) => n + f.bytes, 0) }));
