import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const relativeRoot = ".intentfold/tickets/STEMROBIN-188/tmp/n42-choice-prerequisite-repair-01";
const root = path.join(cwd, relativeRoot);
const previousRoot = path.join(cwd, ".intentfold/tickets/STEMROBIN-188/tmp/n42-choice-author");
assert.equal(process.cwd(), cwd);

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const digest = (value) => sha256(Buffer.from(canonical(value)));
const readJson = (filename) => JSON.parse(fs.readFileSync(filename, "utf8"));
const bind = (filename) => ({
  path: filename,
  sha256: sha256(fs.readFileSync(filename)),
});
const writeNew = (name, bytes) => {
  const filename = path.join(root, name);
  assert.equal(path.dirname(filename), root);
  fs.writeFileSync(filename, bytes, { flag: "wx" });
};
const writeJson = (name, value) => writeNew(name, `${JSON.stringify(value, null, 2)}\n`);

for (const name of ["preservation-evidence.json", "prerequisite-bindings.json",
  "validation-structure-01.json", "report.json", "report.md", "SHA256SUMS"]) {
  assert.equal(fs.existsSync(path.join(root, name)), false, `existing evidence: ${name}`);
}

const originalHashes = {
  "seed.json": "7af941de3c3b69c17374070d44b48a548ca7a64b4789c2f9c01a02de9fb9308e",
  "draft.json": "d773e3d42c1cf6968112df279dff7bff507f12d1ba087d9d9aae74a5068fa288",
  "report.json": "3c60fcb0480bc2fc85aecc50bacf1052f6e4c19039352118125d2f5b3a98586a",
  "task-solutions.md": "747fff2082beb5e33280e2e01fdf9bf3c21639405d6ef24128f50cee5cd4f02d",
};
const originalBindings = Object.entries(originalHashes).map(([name, expected]) => {
  const binding = bind(path.join(previousRoot, name));
  assert.equal(binding.sha256, expected, `original changed: ${name}`);
  return binding;
});
const oldDraftBytes = fs.readFileSync(path.join(previousRoot, "draft.json"));
const draftBytes = fs.readFileSync(path.join(root, "draft.json"));
const oldDraft = JSON.parse(oldDraftBytes);
const draft = JSON.parse(draftBytes);
const seedBytes = fs.readFileSync(path.join(root, "seed.json"));
const seed = JSON.parse(seedBytes);
assert.equal(seedBytes.equals(fs.readFileSync(path.join(previousRoot, "seed.json"))), true);
assert.equal(draft.seed_sha256, digest(seed));
assert.deepEqual(draft.questions.slice(0, oldDraft.questions.length), oldDraft.questions);
assert.deepEqual(draft.new_figures, oldDraft.new_figures);
assert.equal(draft.new_figures.length, 0);
assert.equal(oldDraft.questions.length, 4);
assert.equal(oldDraft.questions.reduce((sum, q) => sum + q.view.options.length, 0), 18);

// Preserve the literal original question bytes through the last closing brace.
const oldText = oldDraftBytes.toString("utf8");
const prefixEnd = oldText.indexOf('\n  ],\n  "coverage":');
assert.notEqual(prefixEnd, -1);
const originalPrefix = Buffer.from(oldText.slice(0, prefixEnd));
assert.equal(draftBytes.subarray(0, originalPrefix.length).equals(originalPrefix), true);

const changedSources = ["4", "5", "7"];
const retainedSources = ["1", "2", "3", "6"];
for (const source of retainedSources) {
  assert.deepEqual(draft.coverage.find((row) => row.source_number === source),
    oldDraft.coverage.find((row) => row.source_number === source));
}
const addedQuestions = draft.questions.slice(oldDraft.questions.length);
assert.deepEqual(addedQuestions.map((q) => q.id), [
  "n42-collinearity-pairs", "n42-collinearity-parameters", "n42-perpendicularity-pairs",
]);
assert.deepEqual(addedQuestions.flatMap((q) => q.source_numbers), changedSources);
for (const question of addedQuestions) {
  assert.deepEqual(question.view.figure_ids, []);
  assert.equal(question.view.options.every((option) => option.figure_ids.length === 0), true);
  const visible = JSON.stringify(question.view);
  assert.equal(/source_refs|p0071|p0073|p0155|prose\[|task-solutions|ssot-resources|HOLD/.test(visible), false);
}
const preservation = {
  original_files: originalBindings,
  seed_byte_identical: true,
  seed_copy_writable: Boolean(fs.statSync(path.join(root, "seed.json")).mode & 0o200),
  draft_copy_writable: Boolean(fs.statSync(path.join(root, "draft.json")).mode & 0o200),
  unchanged_original_question_prefix_bytes: originalPrefix.length,
  original_questions_exact_object_equality: true,
  original_question_canonical_sha256: oldDraft.questions.map((q) => ({
    id: q.id, sha256: digest(q),
  })),
  unchanged_coverage_source_numbers: retainedSources,
  changed_coverage_source_numbers: changedSources,
  seed_schema_and_keys_unchanged: true,
  original_new_figures_unchanged: true,
  independent_solution_saved_before_options: {
    author_attestation: "task-solutions.md was created before the original draft was read or new options were constructed; later only its selector notation was corrected to top-level prose.",
    path: path.join(root, "task-solutions.md"),
    created_at: fs.statSync(path.join(root, "task-solutions.md")).birthtime.toISOString(),
    current_sha256: bind(path.join(root, "task-solutions.md")).sha256,
  },
};
assert.equal(preservation.seed_copy_writable, true);
assert.equal(preservation.draft_copy_writable, true);
writeJson("preservation-evidence.json", preservation);

const supportingFiles = [
  {
    id: "n20-raw-collinearity",
    relative_path: "ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n20/lesson.json",
    expected_sha256: "e408ad1d8d74e87a8b70493bcc31a31d36d11ec843f2179376f1bbcc1d4e8cd3",
    indices: [0, 22],
    refs: [["p0071#12"], ["p0073#8"]],
    role: "Authorized raw definition and nonzero-vector Theorem 10; unrelated N20 exercises/answers/choices/figures/HOLD are excluded.",
  },
  {
    id: "n43-clean-general-cosine",
    relative_path: "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n43/lesson.json",
    expected_sha256: "a931778a149bbcfbee6d8e551531f9bdc7b42b70600002193bcaf08e4b6f9b80",
    indices: [8],
    refs: [["p0155#12"]],
    role: "Only the explicitly authorized general cosine relation; parent-supplied READY review context is not independently reverified here.",
  },
];
const supportingBindings = supportingFiles.map((item) => {
  const filename = path.join(cwd, item.relative_path);
  const binding = bind(filename);
  assert.equal(binding.sha256, item.expected_sha256, `support changed: ${filename}`);
  const object = readJson(filename);
  const paragraphs = item.indices.map((index, position) => {
    const paragraph = object.prose[index];
    assert.deepEqual(paragraph.source_refs, item.refs[position]);
    return {
      selector: `prose[${index}]`,
      source_refs: paragraph.source_refs,
      paragraph_canonical_sha256: digest(paragraph),
      paragraph,
    };
  });
  return {
    id: item.id,
    ...binding,
    realpath: fs.realpathSync(filename),
    role: item.role,
    paragraphs,
  };
});
writeJson("prerequisite-bindings.json", {
  user_designation: "core9-10g",
  actual_retained_book_directory: path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/9-10g"),
  seed_unchanged: true,
  supplementary_internal_only: true,
  bindings: supportingBindings,
  derived_criteria: [
    "N20 Theorem 10 plus seed coordinate uniqueness and scalar multiplication: nonzero vectors are collinear iff all coordinates satisfy one common scalar multiple; a negative scalar is permitted by prose[0].",
    "N43 general cosine relation plus positive lengths of these nonzero vectors and the right-angle value cos(pi/2)=0: perpendicular iff dot product is exactly zero; the seed orthonormal basis gives its coordinate formula.",
  ],
});

const args = [
  "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".", "--seed", `${relativeRoot}/seed.json`,
  "--draft", `${relativeRoot}/draft.json`,
];
const validation = spawnSync("python3", args, { cwd, encoding: "utf8" });
const receipt = {
  executable: "python3",
  args,
  command: `python3 ${args.join(" ")}`,
  cwd,
  seed: bind(path.join(root, "seed.json")),
  draft: bind(path.join(root, "draft.json")),
  exit_code: validation.status,
  signal: validation.signal,
  stdout: validation.stdout ?? "",
  stderr: validation.stderr ?? "",
  execution_error: validation.error ? String(validation.error) : null,
  review_argument_supplied: false,
  semantic_review_performed: false,
  scope_invocation: 1,
};
writeJson("validation-structure-01.json", receipt);
for (const binding of originalBindings) {
  assert.equal(bind(binding.path).sha256, binding.sha256, `original changed during check: ${binding.path}`);
}

// Read original-author bookkeeping only, not an answer-author report or key.
const oldReport = readJson(path.join(previousRoot, "report.json"));
assert.equal(oldReport.immutable_first_snapshots.content_revisions, 0);
const counts = (questions) => ({
  questions: questions.length,
  options: questions.reduce((sum, q) => sum + q.view.options.length, 0),
  single_questions: questions.filter((q) => q.view.mode === "single").length,
  multiple_questions: questions.filter((q) => q.view.mode === "multiple").length,
});
const before = counts(oldDraft.questions);
const after = counts(draft.questions);
const added = counts(addedQuestions);
assert.deepEqual(added, { questions: 3, options: 10, single_questions: 2, multiple_questions: 1 });
const report = {
  schema: "n42-choice-prerequisite-repair-report-v1",
  role: "fresh_offline_author_not_reviewer",
  date: "2026-11-20",
  cwd,
  authorized_write_root: root,
  status: validation.status === 0
    ? "offline_author_candidate_prerequisites_recovered"
    : "offline_author_candidate_technical_validation_failure",
  semantic_approval: false,
  semantic_review_performed: false,
  current_criterion_contradictions: [],
  unresolved_criterion_holds: [],
  files: ["seed.json", "draft.json", "task-solutions.md", "prerequisite-bindings.json",
    "preservation-evidence.json", "validation-structure-01.json", "record-evidence.mjs"].map((name) => bind(path.join(root, name))),
  seed_canonical_sha256: digest(seed),
  draft_canonical_sha256: digest(draft),
  preservation,
  exact_delta: {
    before, added, after,
    unchanged_question_ids: oldDraft.questions.map((q) => q.id),
    added_question_ids: addedQuestions.map((q) => q.id),
    replaced_coverage_source_numbers: changedSources,
    unchanged_coverage_source_numbers: retainedSources,
    coverage_records_before: oldDraft.coverage.length,
    coverage_records_after: draft.coverage.length,
    original_data_changed: false,
    new_source_facts: 0,
    new_figures: 0,
    selected_source_written_subtasks: 20,
    represented_written_subtasks_before: 15,
    newly_represented_written_subtasks: 5,
    represented_written_subtasks_after: 20,
    recovered_original_geometric_pair_decisions: 4,
    recovered_original_geometric_parameter_tasks: 1,
  },
  counters: {
    content_revisions: { prior: 0, new_delta: 1, cumulative: 1 },
    structural_local_corrections: { prior: 0, new_delta: 0, cumulative: 0 },
    image_loads: { prior: oldReport.counts.images_loaded, new_delta: 0, cumulative: oldReport.counts.images_loaded },
    image_batches: { prior: oldReport.counts.image_batches, new_delta: 0, cumulative: oldReport.counts.image_batches },
    new_figures: { prior: oldReport.counts.new_figures, new_delta: 0, cumulative: oldReport.counts.new_figures },
    paid_calls: { prior: oldReport.counts.paid_calls, new_delta: 0, cumulative: oldReport.counts.paid_calls },
    model_service_calls: { prior: oldReport.counts.model_service_calls, new_delta: 0, cumulative: oldReport.counts.model_service_calls },
    structural_validator_invocations: { prior: oldReport.counts.structural_validator_invocations, new_delta: 1, cumulative: oldReport.counts.structural_validator_invocations + 1 },
    review_invocations: { prior: oldReport.counts.review_invocations, new_delta: 0, cumulative: oldReport.counts.review_invocations },
  },
  prior_hold_snapshots: changedSources.map((number) => ({
    original_draft_path: path.join(previousRoot, "draft.json"),
    original_draft_sha256: originalHashes["draft.json"],
    status: "historical_original_snapshot_not_current_criterion_hold",
    original_record: oldDraft.coverage.find((row) => row.source_number === number),
  })),
  supporting_bindings: supportingBindings,
  covered_sources: draft.coverage,
  new_truth_sets_internal: addedQuestions.map((q) => ({
    question_id: q.id,
    correct: q.key.correct,
    per_option_truth: q.key.rationales.map((r) => ({ option_id: r.option_id, truth: r.truth })),
    note: q.id === "n42-collinearity-pairs"
      ? "Both original pairs qualify; no incorrect pair was fabricated to meet a distractor quota."
      : "Every incorrect complete result has a reproducible wrong derivation in the internal rationale.",
  })),
  production_losses_internal: addedQuestions.map((q) => ({
    question_id: q.id,
    limitations: q.intent.limitations,
  })),
  historical_visual_evidence_only: {
    original_report_path: path.join(previousRoot, "report.json"),
    original_report_sha256: originalHashes["report.json"],
    original_author_image_ledger: oldReport.image_ledger,
    unchanged_original_question_observations: oldDraft.questions.flatMap((q) =>
      q.intent.figure_observations.map((observation) => ({ question_id: q.id, ...observation }))),
    fresh_author_images_loaded: 0,
    fresh_independent_visual_approval: false,
    approval_owner: "later independently authorized reviewer",
  },
  technical_lookup_recovery: {
    wrong_initial_paths: [
      "ssot-resources/soviet10year-textbooks/artifacts/core9-10g/lessons/geo910-c1-s2-n20",
      "ssot-resources/soviet10year-textbooks/artifacts/core9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n43",
    ],
    result: "Directory inventory located the actual retained 9-10g files; the exact authorized paragraph source_refs matched. This was path resolution, not a content failure or scientific HOLD.",
    unrelated_content_opened: false,
  },
  structural_validation: receipt,
  boundaries: {
    write_scope: "Only new n42-choice-prerequisite-repair-01 directory",
    original_artifacts_unchanged: true,
    n42_modern_text_and_seed_schema_unchanged: true,
    n20_exercises_answers_choices_figures_not_read_or_changed: true,
    n20_unrelated_hold_unchanged: true,
    n43_only_general_prose8_read: true,
    no_answer_author_report_or_key_lookup: true,
    no_prepare_redo: true,
    no_semantic_review_core_promotion_retention_finalization: true,
    no_database_git_environment_model_paid_or_other_agent_contact: true,
    supplementary_references_internal_only: true,
  },
  handoff: "Offline extended author candidate only. Prerequisite input gaps are resolved, not scientific unknowns. Structural success is not semantic or visual approval. No additional READY-only prerequisite approval gate was invented.",
};
writeJson("report.json", report);
const reportBinding = bind(path.join(root, "report.json"));
const lines = [
  "# N42 choice prerequisite recovery",
  "",
  "Fresh offline AUTHOR only; no semantic review or visual approval.",
  "",
  `Status: ${report.status}.`,
  `Checker: exit ${validation.status}; one current extended-draft invocation with the same seed.`,
  "",
  "## Exact delta",
  "",
  "- Original 4 questions / 18 options unchanged, including their internal objects and literal question bytes.",
  "- Add 3 questions / 10 options: one multiple over the two original collinear pairs (both true), one single complete parameter solution, one single complete perpendicularity verdict.",
  "- Current total: 7 questions / 28 options; 5 single, 2 multiple.",
  "- Replace only coverage sources 4,5,7; preserve 1,2,3,6 unchanged and all three prior HOLD records verbatim in report.json.",
  "- Recover all four original geometric pair decisions and the one parameter task; retain all source data. Written-proof/production losses remain internal.",
  "- Content revision counter: prior 0 + new delta 1 = cumulative 1. New figures 0; new image loads 0; paid/model calls 0.",
  "",
  "## Supporting bindings",
  "",
  ...supportingBindings.flatMap((binding) => [
    `- ${binding.path}`,
    `  SHA-256: ${binding.sha256}`,
    ...binding.paragraphs.map((paragraph) =>
      `  ${paragraph.selector}: ${paragraph.source_refs.join(", ")}; paragraph canonical SHA-256 ${paragraph.paragraph_canonical_sha256}`),
  ]),
  "",
  "The retained core9-10g designation maps to artifacts/9-10g in this checkout.",
  "No N20 exercises/answers/choices/figures or N43 numeric worked results were read. N20 fig116/HOLD remains unrelated and unchanged.",
  "The explicit raw nonzero-vector theorem supplies collinearity; the authorized general cosine relation supplies the perpendicularity criterion for these nonzero vectors in the seed orthonormal basis.",
  "",
  "## File hashes",
  "",
  `- report.json: ${reportBinding.sha256}`,
  ...["seed.json", "draft.json", "task-solutions.md", "prerequisite-bindings.json",
    "preservation-evidence.json", "validation-structure-01.json"].map((name) =>
    `- ${name}: ${bind(path.join(root, name)).sha256}`),
  `- Seed canonical SHA-256: ${digest(seed)}`,
  `- Draft canonical SHA-256: ${digest(draft)}`,
  "",
  "report.md's own byte SHA-256 is in SHA256SUMS, avoiding a self-referential hash.",
  "",
  "## Validation",
  "",
  "```text",
  receipt.command,
  `cwd: ${cwd}`,
  `exit: ${validation.status}`,
  receipt.stdout.trimEnd(),
  receipt.stderr.trimEnd() || "stderr: empty",
  "```",
  "",
  "Old visual observations are historical-only, unchanged, and not fresh approval.",
  "Later independent semantic/visual review is outside this author's assignment; no READY-only extra prerequisite gate was added.",
  "No promotion, retention, finalization, DB/Git/env/model/paid operation, or other-agent contact.",
  "",
];
writeNew("report.md", lines.join("\n"));
const outputNames = ["report.json", "report.md", "draft.json", "seed.json", "task-solutions.md",
  "prerequisite-bindings.json", "preservation-evidence.json", "validation-structure-01.json", "record-evidence.mjs"];
writeNew("SHA256SUMS", outputNames.map((name) =>
  `${bind(path.join(root, name)).sha256}  ${name}\n`).join(""));
console.log(JSON.stringify({
  status: report.status,
  validation: { exit_code: validation.status, stdout: receipt.stdout, stderr: receipt.stderr },
  exact_delta: report.exact_delta,
  content_revisions: report.counters.content_revisions,
  output_hashes: outputNames.map((name) => ({ name, ...bind(path.join(root, name)) })),
}, null, 2));
process.exitCode = validation.status ?? 2;
