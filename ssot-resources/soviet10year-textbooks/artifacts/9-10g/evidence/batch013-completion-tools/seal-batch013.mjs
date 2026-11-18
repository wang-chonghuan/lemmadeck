import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
assert.equal(process.cwd(), repo);
const book = "ssot-resources/soviet10year-textbooks/artifacts/9-10g";
const edition = `${book}/editions/modern-us-neutral`;
const evidence = `${book}/evidence`;
const load = filename => JSON.parse(fs.readFileSync(filename, "utf8"));
const sha = filename => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const record = filename => ({ path: filename, sha256: sha(filename) });
const reports = new Map([
  [32, "visual-review-resumed3.json"],
  [33, "visual-review.json"],
  [34, "visual-review-affected.json"],
  [35, "visual-review.json"],
]);
const lessons = [];
const figures = new Set();
for (const [number, reportName] of reports) {
  const id = `geo910-c1-s3-n${number}`;
  const root = `${edition}/lessons/${id}`;
  const retained = `${evidence}/batch013-offline-acceptance/${id}`;
  const answers = load(`${root}/answer-keys.json`);
  const draft = load(`${root}/choice-set/draft.json`);
  const review = load(`${root}/choice-set/review.json`);
  const result = load(`${retained}/result.json`);
  assert.equal(answers.status, "ready");
  assert.equal(load(`${root}/answer-keys.audit.json`).status, "pass");
  assert.equal(review.outcome, "pass");
  assert.equal(result.status, "pass");
  assert.equal(load(`${retained}/${reportName}`).status, "pass");
  assert.equal(result.results.length, 6);
  assert.equal(new Set(result.results.map(item => `${item.view}:${item.viewport.width}`)).size, 6);
  for (const item of result.results) assert.equal(item.status, "pass");
  for (const figure of load(`${root}/figures.json`).figures) figures.add(figure.id);
  const files = fs.readdirSync(root).filter(name => name.endsWith(".json"))
    .map(name => record(`${root}/${name}`));
  for (const name of ["seed", "draft", "review"]) files.push(record(`${root}/choice-set/${name}.json`));
  lessons.push({
    lesson: id, answers: answers.answers.length,
    auto: answers.answers.filter(answer => answer.grading === "auto").length,
    choices: draft.questions.length,
    options: draft.questions.reduce((sum, question) => sum + question.view.options.length, 0),
    artifacts: files,
    offline_acceptance: record(`${retained}/result.json`),
    visual_review: record(`${retained}/${reportName}`),
    screenshots: result.results.map(item => record(`${retained}/${path.basename(item.screenshot)}`)),
  });
}
const totals = Object.fromEntries(["answers", "auto", "choices", "options"].map(key =>
  [key, lessons.reduce((sum, lesson) => sum + lesson[key], 0)]));
assert.deepEqual(totals, { answers: 32, auto: 8, choices: 34, options: 140 });
assert.equal(figures.size, 10);
const output = `${evidence}/batch013-completion.json`;
const document = {
  schema: "s10y-offline-batch-completion@1", ticket: "STEMROBIN-184",
  createdAt: new Date().toISOString(), status: "pass",
  scope: "Four completed offline modern lessons; not publication, live-product acceptance or ticket completion.",
  totals: { lessons: lessons.length, ...totals, ungraded: totals.answers - totals.auto, figures: figures.size },
  lessons,
  figures: [...figures].sort().map(id => ({
    figure: id,
    files: ["spec.json", "svg", "render.json", "review.json"]
      .map(suffix => record(`${edition}/figures/${id}.${suffix}`)),
  })),
  evidence: ["batch013-repairs-and-approvals", "batch013-choice-answer-gates", "batch013-offline-acceptance"]
    .map(name => record(`${evidence}/${name}/retention.json`)),
  qualifications: [
    "First failed reviews, failed browser calls and changed candidates remain retained; only affected units were rechecked.",
    "Answer semantic gates bind their historical draft hashes; existing owner finalize then changed status/count and wrote audits without new answer authoring.",
    "Original paths inside retained reports are historical. This manifest references durable evidence copies.",
    "Modern36 adaptation and four figure gates pass; its answers, choices and final acceptance remain in progress and are not counted.",
    "Historical cumulative totals were not recounted. Full mechanical defence/build remains for formal handoff; the established pre-existing wider-test failure is not waived.",
  ],
  parent_image_opens: 0, new_paid_calls: 0, database_writes: 0, published: false,
};
fs.writeFileSync(output, JSON.stringify(document, null, 2) + "\n", { flag: "wx", mode: 0o444 });
console.log(JSON.stringify({ output, sha256: sha(output), totals: document.totals }));
