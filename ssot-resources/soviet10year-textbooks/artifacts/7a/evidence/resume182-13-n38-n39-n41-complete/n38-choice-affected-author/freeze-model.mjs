import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-affected-author";
const prior = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author";
assert.equal(fs.realpathSync(process.cwd()), repo);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bytes = relative => fs.readFileSync(path.join(repo, relative));
const inputs = ["seed.json", "draft.json", "views.json", "supplementary-context.json",
  "solve-freeze.json", "source.json"].map(name => {
  const source = `${prior}/${name === "seed.json" ? "source.json" : name}`;
  const snapshot = `${own}/original/${name}`;
  assert.ok(bytes(source).equals(bytes(snapshot)), `${name}: original copy changed`);
  assert.ok(bytes(snapshot).equals(bytes(`${own}/${name}`)), `${name}: edits started too early`);
  return {name, original_path: source, preserved_path: snapshot,
    sha256: sha(bytes(snapshot)), exact_byte_copy: true};
});
const record = {
  schema: "n38-affected-author-model-freeze-v1",
  frozen_at: new Date().toISOString(),
  cwd: repo,
  phase: "NEW_SUPPLEMENTAL_MODEL_DERIVED_BEFORE_REPAIRED_OPTIONS",
  seed_alias: "Original author has no seed.json; its checker used source.json as the seed. Both preserved aliases are exact bytes of original source.json.",
  inputs,
  model: {path: `${own}/affected-model-solve.md`, sha256: sha(bytes(`${own}/affected-model-solve.md`))},
  affected_question_ids: ["n38-estimate-error-distinction", "n38-round-before-square"],
  original_source_tasks_resolved_again: 0,
  images_opened: 0,
  independent_review_read: false,
  semantic_review: "NOT_PERFORMED_AFFECTED_INDEPENDENT_REVIEW_REQUIRED",
};
const out = path.join(repo, own, "affected-model-solve-freeze.json");
fs.writeFileSync(out, `${JSON.stringify(record, null, 2)}\n`, {flag: "wx"});
for (const name of ["affected-model-solve.md", "affected-model-solve-freeze.json"]) {
  fs.chmodSync(path.join(repo, own, name), 0o444);
}
console.log(JSON.stringify(record, null, 2));
