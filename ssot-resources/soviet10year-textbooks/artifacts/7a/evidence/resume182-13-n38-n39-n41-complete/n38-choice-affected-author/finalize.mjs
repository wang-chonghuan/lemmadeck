import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {isDeepStrictEqual} from "node:util";
import {spawnSync} from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const own = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-affected-author";
assert.equal(fs.realpathSync(process.cwd()), repo);
const target = name => path.join(repo, own, name);
const bytes = name => fs.readFileSync(target(name));
const read = name => JSON.parse(bytes(name));
const sha = value => crypto.createHash("sha256").update(value).digest("hex");
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
const digest = value => sha(canonical(value));
const create = (name, value) => fs.writeFileSync(target(name),
  `${JSON.stringify(value, null, 2)}\n`, {flag: "wx"});
for (const name of ["structural-repaired.json", "hashes.json", "affected-author-freeze.json"]) {
  assert.ok(!fs.existsSync(target(name)), `Keep prior receipt: ${name}`);
}
const modelFreeze = read("affected-model-solve-freeze.json");
assert.equal(sha(bytes("affected-model-solve.md")), modelFreeze.model.sha256);
for (const input of modelFreeze.inputs) {
  assert.equal(sha(fs.readFileSync(path.join(repo, input.preserved_path))), input.sha256);
  assert.equal(sha(fs.readFileSync(path.join(repo, input.original_path))), input.sha256);
}
for (const name of ["seed.json", "source.json", "solve-freeze.json"]) {
  assert.ok(bytes(name).equals(bytes(`original/${name}`)), `${name} changed`);
}
const original = read("original/draft.json");
const draft = read("draft.json");
const expected = ["n38-round-before-square", "n38-estimate-error-distinction"];
assert.equal(original.questions.length, 13);
assert.deepEqual(draft.questions.map(q => q.id), original.questions.map(q => q.id));
const changed = draft.questions.filter((q, i) => !isDeepStrictEqual(q, original.questions[i]));
assert.deepEqual(changed.map(q => q.id), expected);
const metadata = value => Object.fromEntries(Object.entries(value).filter(([key]) => key !== "questions"));
assert.deepEqual(metadata(draft), metadata(original));
const round = draft.questions.find(q => q.id === expected[0]);
const originalRound = original.questions.find(q => q.id === expected[0]);
assert.deepEqual(round.view.options, originalRound.view.options);
assert.deepEqual(round.key, originalRound.key);
const uncertainty = draft.questions.find(q => q.id === expected[1]);
assert.ok(uncertainty.view.stem.includes("$6.42$"));
assert.ok(!/812|659000|6\.59/.test(JSON.stringify(uncertainty)));
const originalContext = read("original/supplementary-context.json");
const context = read("supplementary-context.json");
assert.deepEqual(context.authored_main_table.rows, originalContext.authored_main_table.rows);
const contextWithoutRepair = structuredClone(context);
delete contextWithoutRepair.authored_uncertainty_model;
contextWithoutRepair.authored_main_table.row_3_1_boundary =
  originalContext.authored_main_table.row_3_1_boundary;
delete contextWithoutRepair.authored_correction_table.entries[0].applicability;
contextWithoutRepair.visible_context_conditions = originalContext.visible_context_conditions;
assert.deepEqual(contextWithoutRepair, originalContext);
assert.deepEqual(context.visible_context_conditions.slice(0, 3),
  originalContext.visible_context_conditions.slice(0, 3));
assert.deepEqual(context.visible_context_conditions.slice(4, 7),
  originalContext.visible_context_conditions.slice(4, 7));
assert.equal(context.visible_context_conditions.length, 8);
const projection = value => value.questions.map(q => ({question_id: q.id, view: q.view}));
assert.deepEqual(read("original/views.json"), projection(original));
assert.ok(bytes("views.json").equals(bytes("original/views.json")), "Working views changed before export");
const views = projection(draft);
fs.writeFileSync(target("views.json"), `${JSON.stringify(views, null, 2)}\n`);
assert.deepEqual(read("views.json"), projection(draft));
const changedViews = views.filter((v, i) => !isDeepStrictEqual(v, projection(original)[i]));
assert.deepEqual(changedViews.map(v => v.question_id), expected);

const args = ["-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", repo, "--seed", `${own}/seed.json`, "--draft", `${own}/draft.json`];
const started = new Date().toISOString();
const checker = spawnSync("python3", args, {cwd: repo, encoding: "utf8"});
const receipt = {
  schema: "n38-affected-author-structural-receipt-v1",
  started_at: started, finished_at: new Date().toISOString(), cwd: repo,
  command: ["python3", ...args], validator_invocations: 1,
  seed_file_sha256: sha(bytes("seed.json")), draft_file_sha256: sha(bytes("draft.json")),
  checker_file_sha256: sha(fs.readFileSync(path.join(repo, args[1]))),
  prepare_file_sha256: sha(fs.readFileSync(path.join(repo, ".agents/skills/ld-s10y-choice/scripts/prepare.py"))),
  exit_code: checker.status, signal: checker.signal,
  execution_error: checker.error?.message ?? null,
  stdout: checker.stdout ?? "", stderr: checker.stderr ?? "",
  semantic_review: "NOT_PERFORMED_AFFECTED_INDEPENDENT_REVIEW_REQUIRED",
};
create("structural-repaired.json", receipt);
const hashFile = name => ({
  path: `${own}/${name}`, sha256: sha(bytes(name)),
  canonical_json_sha256: name.endsWith(".json") ? digest(read(name)) : null,
});
const names = ["seed.json", "source.json", "solve-freeze.json", "draft.json", "views.json",
  "supplementary-context.json", "affected-model-solve.md", "affected-model-solve-freeze.json",
  "repair-notes.md", "structural-repaired.json", "freeze-model.mjs", "finalize.mjs"];
const hashes = {
  schema: "n38-affected-author-hashes-v1",
  generated_at: new Date().toISOString(), cwd: repo,
  status: "AUTHOR_REPAIR_FROZEN_AFFECTED_INDEPENDENT_REVIEW_REQUIRED",
  changed_question_ids: expected, changed_view_question_ids: expected,
  unchanged_question_ids: draft.questions.filter(q => !expected.includes(q.id)).map(q => q.id),
  unchanged_question_count: 11, unchanged_questions_deep_equal: true,
  draft_metadata_and_coverage_deep_equal: true, view_only_projection_exact: true,
  original_804_report_deep_equal: true,
  seed_canonical_sha256: digest(read("seed.json")),
  original_draft_canonical_sha256: digest(original),
  draft_canonical_sha256: digest(draft), views_canonical_sha256: digest(views),
  changed_questions: changed.map(q => {
    const before = original.questions.find(old => old.id === q.id);
    return {question_id: q.id, before_canonical_sha256: digest(before),
      after_canonical_sha256: digest(q), before_view_canonical_sha256: digest(before.view),
      after_view_canonical_sha256: digest(q.view)};
  }),
  preserved_inputs: modelFreeze.inputs,
  files: names.map(hashFile),
  validator_invocations: 1, structural_exit_code: checker.status,
  source_tasks_resolved_again: 0, images_opened: 0,
  independent_review_read: false, independent_review_created: false,
  independent_pass_claimed: false,
};
create("hashes.json", hashes);
create("affected-author-freeze.json", {
  schema: "n38-affected-author-candidate-freeze-v1",
  frozen_at: new Date().toISOString(), cwd: repo,
  status: hashes.status, file_mode: "0444",
  changed_question_ids: expected, unchanged_questions_deep_equal: true,
  unchanged_question_count: 11, validator_invocations: 1,
  structural_exit_code: checker.status, independent_pass_claimed: false,
  files: [...names, "hashes.json"].map(hashFile),
});
for (const name of [...names, "hashes.json", "affected-author-freeze.json"]) {
  fs.chmodSync(target(name), 0o444);
}
process.stdout.write(receipt.stdout);
process.stderr.write(receipt.stderr);
console.log(JSON.stringify({
  changed_question_ids: expected, unchanged_questions_deep_equal: 11,
  validator_invocations: 1, structural_exit_code: checker.status,
  draft_canonical_sha256: hashes.draft_canonical_sha256,
  views_canonical_sha256: hashes.views_canonical_sha256,
  freeze: target("affected-author-freeze.json"),
  independent_review: "PENDING_AFFECTED_ONLY",
}, null, 2));
process.exitCode = checker.status ?? 2;
