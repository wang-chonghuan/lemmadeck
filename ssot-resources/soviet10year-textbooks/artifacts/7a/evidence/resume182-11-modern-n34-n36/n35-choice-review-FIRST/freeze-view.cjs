const fs = require("node:fs");
const crypto = require("node:crypto");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const out = `${base}/n35-choice-review-FIRST`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const projection = JSON.parse(fs.readFileSync(`${out}/view-only-FIRST.json`, "utf8"));
const viewPath = `${out}/view-review-FIRST.json`;
const review = JSON.parse(fs.readFileSync(viewPath, "utf8"));
let checked = 0;
for (const question of projection) {
  const check = review.question_reviews.find((item) => item.question_id === question.id);
  if (!check) throw new Error("Missing visible question review");
  const actual = check.mathematics.option_checks.map((item) => item.option_id).sort();
  const expected = question.view.options.map((item) => item.id).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error("Missing independent option check");
  const truths = check.mathematics.option_checks.filter((item) => item.truth === "correct").map((item) => item.option_id).sort();
  if (JSON.stringify(truths) !== JSON.stringify(check.mathematics.correct.slice().sort())) throw new Error("Incomplete true set");
  checked += actual.length;
}
const paths = [viewPath, `${out}/source-image-recovery.json`];
const receipt = {
  stage: "2-frozen-before-full-draft-internals",
  time: new Date().toISOString(),
  cwd: root,
  source_initial_freeze_path: `${out}/source-freeze-FIRST.json`,
  projection_receipt_path: `${out}/view-projection-FIRST.json`,
  evidence: paths.map((file) => ({ path: file, raw_sha256: sha(fs.readFileSync(file)) })),
  question_count: review.question_reviews.length,
  every_option_checked: checked,
  true_sets_frozen: true,
  fidelity_redundancy_leakage_frozen: true,
  author_internals_disclosed: false,
  image_total: 2,
  recovery: "Only formerly blocked source-image evidence recovered; original passed algebra and initial failure retained."
};
const receiptPath = `${out}/view-freeze-FIRST.json`;
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
for (const file of [...paths, receiptPath]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify(receipt, null, 2));
