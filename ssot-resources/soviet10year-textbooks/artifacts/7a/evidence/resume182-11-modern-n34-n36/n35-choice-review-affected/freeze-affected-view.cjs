const fs = require("node:fs");
const crypto = require("node:crypto");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const out = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n35-choice-review-affected";
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const projection = JSON.parse(fs.readFileSync(`${out}/view-only.json`, "utf8"));
const receipt = JSON.parse(fs.readFileSync(`${out}/receipts/view-projection.json`, "utf8"));
const evidencePath = `${out}/affected-view-findings.json`;
const evidenceBytes = fs.readFileSync(evidencePath);
const evidence = JSON.parse(evidenceBytes);
const q = projection.find((item) => item.id === "n35-q06");
const checks = evidence.q06_review.mathematics.option_checks;
if (JSON.stringify(q.view.options.map((o) => o.id).sort()) !== JSON.stringify(checks.map((o) => o.option_id).sort())) throw new Error("Incomplete affected option checks");
if (JSON.stringify(checks.filter((o) => o.truth === "correct").map((o) => o.option_id).sort()) !== JSON.stringify(evidence.q06_review.mathematics.correct.slice().sort())) throw new Error("Incomplete affected true set");
if (projection.some((item) => item.id === "n35-q09")) throw new Error("Duplicate q09 remains");
if (sha(fs.readFileSync(receipt.draft_path)) !== receipt.draft_raw_sha256) throw new Error("Repaired draft changed");
for (const item of receipt.FIRST_evidence_before) if (sha(fs.readFileSync(item.path)) !== item.raw_sha256) throw new Error("FIRST evidence changed");
const freeze = {
  stage: "affected-visible-fidelity-redundancy-leakage-math-and-removal-frozen-before-new-internals",
  time: new Date().toISOString(),
  cwd: root,
  evidence_path: evidencePath,
  evidence_raw_sha256: sha(evidenceBytes),
  draft_path: receipt.draft_path,
  draft_raw_sha256: receipt.draft_raw_sha256,
  draft_sha256: receipt.draft_sha256,
  changed_question: "n35-q06",
  removed_question: "n35-q09",
  independent_true_set: evidence.q06_review.mathematics.correct,
  option_checks: checks.length,
  inherited_unchanged_question_count: 9,
  repaired_intent_key_rationales_coverage_disclosed: false,
  FIRST_evidence_unchanged: true,
  new_image_loads: 0,
  clarification_path: `${out}/clarification.md`
};
const freezePath = `${out}/receipts/view-freeze.json`;
fs.writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(evidencePath, 0o444);
fs.chmodSync(freezePath, 0o444);
console.log(JSON.stringify(freeze, null, 2));
