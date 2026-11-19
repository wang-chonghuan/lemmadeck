const fs = require("node:fs");
const crypto = require("node:crypto");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const first = `${base}/n35-choice-review-FIRST`;
const out = `${base}/n35-choice-review-affected`;
const repaired = `${base}/n35-choice-repaired`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  return value;
};
const canonical = (value) => JSON.stringify(stable(value)).replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
fs.mkdirSync(`${out}/receipts`, { recursive: true });
const originalSeed = fs.readFileSync(`${base}/n35-choice-author/seed.json`);
const repairedSeed = fs.readFileSync(`${repaired}/seed.json`);
if (!originalSeed.equals(repairedSeed)) throw new Error("Seed bytes changed: scope mismatch");
const original = load(`${base}/n35-choice-author/draft.json`);
const draftBytes = fs.readFileSync(`${repaired}/draft.json`);
const draft = JSON.parse(draftBytes);
const oldIds = original.questions.map((q) => q.id);
const newIds = draft.questions.map((q) => q.id);
if (JSON.stringify(newIds) !== JSON.stringify(oldIds.filter((id) => id !== "n35-q09"))) throw new Error("Unexpected question removal/order");
const unchanged = draft.questions.filter((q) => q.id !== "n35-q06").map((q) => {
  const old = original.questions.find((item) => item.id === q.id);
  if (canonical(q) !== canonical(old)) throw new Error(`Question ${q.id} changed beyond authorized scope`);
  return { id: q.id, whole_question_canonical_sha256: sha(canonical(q)), unchanged: true };
});
if (unchanged.length !== 9) throw new Error("Expected exactly nine unchanged questions");
const views = draft.questions.map(({ id, view }) => ({ id, view }));
save(`${out}/view-only.json`, views);
const frozenFiles = [
  "review.json", "review.md", "source-independent-FIRST.json",
  "source-freeze-FIRST.json", "source-image-recovery.json",
  "view-review-FIRST.json", "view-freeze-FIRST.json",
  "FIRST-validate.receipt.json", "FIRST-validate.stdout", "FIRST-validate.stderr"
];
const receipt = {
  stage: "affected-view-only-projection-before-repaired-internals",
  time: new Date().toISOString(),
  cwd: root,
  seed_path: `${repaired}/seed.json`,
  seed_raw_sha256: sha(repairedSeed),
  seed_sha256: sha(canonical(JSON.parse(repairedSeed))),
  seed_byte_identical_to_FIRST_author: true,
  draft_path: `${repaired}/draft.json`,
  draft_raw_sha256: sha(draftBytes),
  draft_sha256: sha(canonical(draft)),
  projection_path: `${out}/view-only.json`,
  projection_raw_sha256: sha(fs.readFileSync(`${out}/view-only.json`)),
  disclosed_fields: ["id", "view"],
  repaired_q06_internals_disclosed: false,
  repaired_coverage_disclosed: false,
  removed_ids: ["n35-q09"],
  inherited_whole_question_checks: unchanged,
  counts: {
    questions: views.length,
    options: views.reduce((sum, q) => sum + q.view.options.length, 0),
    single: views.filter((q) => q.view.mode === "single").length,
    multiple: views.filter((q) => q.view.mode === "multiple").length
  },
  FIRST_evidence_before: frozenFiles.map((file) => ({ path: `${first}/${file}`, raw_sha256: sha(fs.readFileSync(`${first}/${file}`)) })),
  new_image_loads: 0,
  new_image_generation: 0,
  inherited_source_image_evidence: `${first}/source-image-recovery.json`,
  authorization_attribution: "Prior preview recovery was delegated by the parent under the standing human production scope, not a new direct human message; FIRST is immutable."
};
save(`${out}/receipts/view-projection.json`, receipt);
for (const file of [`${out}/clarification.md`, `${out}/view-only.json`, `${out}/receipts/view-projection.json`]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify(receipt, null, 2));
console.log(JSON.stringify(views.find((q) => q.id === "n35-q06"), null, 2));
