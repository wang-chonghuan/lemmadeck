import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const relativeWork = ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice370-definition-author-07";
const work = path.join(cwd, relativeWork);
const seedPath = ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice-author-first-07/seed.json";
const priorPath = ".intentfold/tickets/STEMROBIN-188/tmp/n29-choice-author-first-07/draft.json";
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const ordered = (value) => Array.isArray(value)
  ? value.map(ordered)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]))
    : value;
const canonical = (value) => JSON.stringify(ordered(value))
  .replace(/[\u007f-\uffff]/g, (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));
const digest = (value) => sha256(canonical(value));
const describeStat = (stat) => ({
  mode: (stat.mode & 0o777).toString(8).padStart(4, "0"),
  bytes: stat.size,
  birth_utc: stat.birthtime.toISOString(),
  mtime_utc: stat.mtime.toISOString(),
  ctime_utc: stat.ctime.toISOString(),
});

assert.equal(process.cwd(), cwd);
for (const name of [
  "merged-draft.json", "preservation.json", "validate.stdout.txt",
  "validate.stderr.txt", "validate.execution.json", "Report.json", "manifest.json",
]) {
  assert.equal(fs.existsSync(path.join(work, name)), false, `Refusing to overwrite ${name}`);
}
const write = (name, bytes) => fs.writeFileSync(path.join(work, name), bytes, { flag: "wx" });
const writeJSON = (name, value) => write(name, JSON.stringify(value, null, 2) + "\n");
const readStable = (relative) => {
  const absolute = path.join(cwd, relative);
  const before = fs.statSync(absolute);
  const bytes = fs.readFileSync(absolute);
  const after = fs.statSync(absolute);
  assert.equal(after.size, before.size, `Changed input ${relative}`);
  assert.equal(after.mtimeMs, before.mtimeMs, `Changed input ${relative}`);
  assert.equal(after.ctimeMs, before.ctimeMs, `Changed input ${relative}`);
  return { value: JSON.parse(bytes), bytes, stat: describeStat(after), path: relative };
};
const own = (name) => readStable(`${relativeWork}/${name}`);
const first = own("FIRST.json");
const freeze = own("FIRST-freeze.json").value;
assert.equal(first.stat.mode, "0444");
assert.equal(sha256(first.bytes), freeze.sha256);
const question = own("question370.json");
const coverage = own("coverage370.json");
const supplement = own("supplemental-source.json");
assert.ok(Date.parse(question.stat.birth_utc) > Date.parse(freeze.observed_utc.stdout.trim()));
assert.equal(question.value.id, "n29-written370-common-tangent-definition-07");
assert.deepEqual(question.value.source_numbers, ["370"]);
assert.deepEqual(question.value.view.figure_ids, []);
assert.ok(question.value.view.options.every((option) => option.figure_ids.length === 0));
assert.deepEqual(Object.keys(question.value.view).sort(), ["figure_ids", "mode", "options", "stem"]);

const seed = readStable(seedPath);
assert.equal(sha256(seed.bytes), first.value.source_exercise.seed_file_sha256);
assert.equal(digest(seed.value), first.value.source_exercise.seed_canonical_sha256);
assert.equal(seed.value.exercises.length, 9);
assert.deepEqual(seed.value.figures, []);
const selectedConcepts = new Set(seed.value.concepts.map((concept) => concept.block));
assert.ok(question.value.intent.concept_blocks.every((block) => selectedConcepts.has(block)));

// Receive the authorized completed prior draft once; do not open its author's solutions separately.
const priorReadStarted = new Date().toISOString();
const prior = readStable(priorPath);
const priorReadFinished = new Date().toISOString();
assert.ok(Date.parse(prior.stat.mtime_utc) < Date.parse(freeze.observed_utc.stdout.trim()));
assert.equal(prior.value.schema, "s10y-choice-draft-v1");
assert.equal(prior.value.seed_sha256, digest(seed.value));
assert.equal(prior.value.questions.length, 8);
assert.equal(prior.value.coverage.length, 9);
assert.deepEqual(prior.value.new_figures, []);
assert.ok(prior.value.questions.every((item) => !item.source_numbers.includes("370")));
const heldRecords = prior.value.coverage.filter((row) => row.source_number === "370");
assert.equal(heldRecords.length, 1);
assert.deepEqual(heldRecords[0].question_ids, []);
assert.ok(heldRecords[0].omitted_tasks.length > 0);
assert.equal(coverage.value.source_number, "370");
assert.deepEqual(coverage.value.question_ids, [question.value.id]);

const merged = {
  ...prior.value,
  questions: [...prior.value.questions, question.value],
  coverage: prior.value.coverage.map((row) => row.source_number === "370" ? coverage.value : row),
};
const retainedQuestions = prior.value.questions.map((original, index) => {
  const retained = merged.questions[index];
  assert.deepEqual(retained, original);
  return {
    id: original.id,
    original_index: index,
    merged_index: index,
    original_canonical_sha256: digest(original),
    merged_canonical_sha256: digest(retained),
    deep_equal: true,
    status: "AUTHOR_ONLY_UNCHANGED_NOT_SEMANTIC_PASS",
  };
});
const retainedCoverage = prior.value.coverage.flatMap((original, index) => {
  if (original.source_number === "370") return [];
  const retained = merged.coverage[index];
  assert.deepEqual(retained, original);
  return [{
    source_number: original.source_number,
    original_index: index,
    merged_index: index,
    original_canonical_sha256: digest(original),
    merged_canonical_sha256: digest(retained),
    deep_equal: true,
  }];
});
assert.equal(retainedCoverage.length, 8);
assert.deepEqual(
  Object.fromEntries(Object.entries(merged).filter(([key]) => !["questions", "coverage"].includes(key))),
  Object.fromEntries(Object.entries(prior.value).filter(([key]) => !["questions", "coverage"].includes(key))),
);
writeJSON("merged-draft.json", merged);
const preservation = {
  schema: "s10y-choice-unchanged-eight-evidence-v1",
  comparison: "node:assert/strict deepEqual of each original parsed JSON object to its merged object; canonical digests supplied as additional bindings",
  cwd,
  prior_draft: {
    path: priorPath,
    file_sha256: sha256(prior.bytes),
    canonical_sha256: digest(prior.value),
    stat: prior.stat,
    read_started_utc: priorReadStarted,
    read_finished_utc: priorReadFinished,
    unchanged_before_after_read: true,
    read_count_in_merge: 1,
    mtime_precedes_first_freeze: true,
  },
  merged_draft: {
    path: `${relativeWork}/merged-draft.json`,
    canonical_sha256: digest(merged),
  },
  retained_questions: retainedQuestions,
  retained_coverage: retainedCoverage,
  replaced_370_held_coverage_verbatim: heldRecords[0],
  replacement_370_coverage: coverage.value,
  added_question_id: question.value.id,
  other_top_level_fields_deep_equal: true,
  original_eight_semantic_review_performed: false,
  prior_hold_diagnosis: "Missing definitions, not a confirmed mathematical defect; the prior held record is historical and not the current370 availability state.",
};
writeJSON("preservation.json", preservation);

const executable = "python3";
const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", cwd,
  "--seed", path.join(cwd, seedPath),
  "--draft", path.join(work, "merged-draft.json"),
];
const validationStarted = new Date().toISOString();
const result = spawnSync(executable, args, { cwd, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
const validationFinished = new Date().toISOString();
assert.notEqual(result.stdout, undefined, "Validator stdout unavailable");
assert.notEqual(result.stderr, undefined, "Validator stderr unavailable");
write("validate.stdout.txt", result.stdout);
write("validate.stderr.txt", result.stderr);
const execution = {
  schema: "local-command-execution-v1",
  argv: [executable, ...args],
  cwd,
  started_utc: validationStarted,
  finished_utc: validationFinished,
  exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? { code: result.error.code, message: result.error.message } : null,
  streams: {
    stdout: {
      path: "validate.stdout.txt",
      sha256: sha256(result.stdout),
      bytes: Buffer.byteLength(result.stdout),
    },
    stderr: {
      path: "validate.stderr.txt",
      sha256: sha256(result.stderr),
      bytes: Buffer.byteLength(result.stderr),
    },
  },
  invocation_count: 1,
  review_argument_supplied: false,
};
writeJSON("validate.execution.json", execution);

const finalSeedBytes = fs.readFileSync(path.join(cwd, seedPath));
const finalPriorBytes = fs.readFileSync(path.join(cwd, priorPath));
const finalFirstBytes = fs.readFileSync(path.join(work, "FIRST.json"));
assert.equal(sha256(finalSeedBytes), sha256(seed.bytes));
assert.equal(sha256(finalPriorBytes), sha256(prior.bytes));
assert.equal(sha256(finalFirstBytes), freeze.sha256);
assert.equal(fs.statSync(path.join(work, "FIRST.json")).mode & 0o777, 0o444);
const succeeded = result.status === 0 && !result.signal && !result.error;
const report = {
  schema: "s10y-choice-author-only-supplement-report-v1",
  ticket: "STEMROBIN-188",
  assignment: "SAME188-6 bounded N29 written exercise370 definition supplement",
  status: succeeded ? "AUTHOR_ONLY_READY_FOR_REVIEW" : "AUTHOR_ONLY_STRUCTURAL_FAILURE",
  finish: "review",
  offline: true,
  cwd,
  owned_directory: relativeWork,
  installed_versions: {
    user_declared: "db613601/corresponding093a4baa",
    evidence: "Direct user-supplied installed versions; no setup, update or git inspection invoked.",
  },
  source_bindings: {
    original_immutable_nine_source_seed: {
      path: seedPath,
      file_sha256: sha256(seed.bytes),
      canonical_sha256: digest(seed.value),
      original_file_unchanged: true,
      no_supplement_inserted_into_seed: true,
    },
    supplemental_definitions: {
      path: `${relativeWork}/supplemental-source.json`,
      file_sha256: sha256(supplement.bytes),
      lesson_path: supplement.value.supplement.path,
      lesson_file_sha256: supplement.value.supplement.file_sha256,
      blocks: supplement.value.supplement.blocks,
      only_zero_based_blocks_2_and_4_used: true,
      image_dependency: false,
      not_complete_course_evidence: true,
    },
  },
  FIRST: {
    path: `${relativeWork}/FIRST.json`,
    file_sha256: freeze.sha256,
    stat: first.stat,
    mode: "0444",
    freeze_receipt: `${relativeWork}/FIRST-freeze.json`,
    frozen_observed_utc: freeze.observed_utc.stdout.trim(),
    new_question_stat: question.stat,
    prior_draft_read_started_utc: priorReadStarted,
    actual_chmod_stat_hash_precede_options_and_prior_candidate_read: true,
    substantive_full370_solution: true,
    independent_author_reasoning_not_independent_reviewer: true,
  },
  changes: {
    question_id: question.value.id,
    question_path: `${relativeWork}/question370.json`,
    question_file_sha256: sha256(question.bytes),
    question_canonical_sha256: digest(question.value),
    merged_draft_path: `${relativeWork}/merged-draft.json`,
    merged_draft_canonical_sha256: digest(merged),
    prior_draft_path: priorPath,
    prior_draft_file_sha256: sha256(prior.bytes),
    prior_draft_unchanged: true,
    exactly_one_question_added: true,
    only370_coverage_replaced: true,
    figures_added: 0,
    keys_only_internal: true,
  },
  unchanged_eight: {
    evidence_path: `${relativeWork}/preservation.json`,
    questions_deep_equal: retainedQuestions,
    coverage_deep_equal: retainedCoverage,
    not_reauthored: true,
    not_rereviewed: true,
    status: "AUTHOR_ONLY_NOT_SEMANTIC_PASS",
  },
  provenance_and_limitations: {
    historical_370_held_record: `${relativeWork}/preservation.json#/replaced_370_held_coverage_verbatim`,
    prior_failed_and_hold_artifacts: "Preserved untouched in original author directory; no old Report, FIRST, solution, review or validator stream read.",
    original_hold_diagnosis: "Missing definitions, not confirmed mathematical defect.",
    current370: "Full written task resolved for authoring from valid original definitions. No missing-definition HOLD remains; independent semantic review is pending.",
    capacity_loss: coverage.value.omitted_tasks,
    no_independent_approval: true,
    no_semantic_pass_claim: true,
    structural_success_is_not_semantic_approval: true,
  },
  structural_validation: {
    receipt_path: `${relativeWork}/validate.execution.json`,
    ...execution,
    stdout: result.stdout,
    stderr: result.stderr,
    outcome: succeeded ? "STRUCTURAL_PASS_ONLY" : "FAILED",
    concrete_failures: succeeded ? [] : [{
      exit_code: result.status,
      signal: result.signal,
      stdout: result.stdout,
      stderr: result.stderr,
      spawn_error: execution.spawn_error,
    }],
    smallest_repair: succeeded ? null : "Stop dependent stages. Diagnose only the concrete recorded validator failure; no source, original eight, seed, installed tooling or other worker artifact changed. No validator rerun is authorized in this bounded once-only run.",
    repairs_applied: 0,
  },
  counters: {
    selected_source_exercises: 9,
    existing_author_only_questions_retained: 8,
    existing_coverage_records_retained: 8,
    newly_authored_questions: 1,
    merged_author_only_questions: 9,
    merged_coverage_records: 9,
    current370_missing_definition_holds: 0,
    structural_validator_invocations: 1,
    semantic_reviews: 0,
    independent_approvals: 0,
    new_figures: 0,
    images_opened: 0,
    model_calls: 0,
    network_calls: 0,
    db_operations: 0,
    setup_or_update_calls: 0,
    git_calls: 0,
    parent_or_supervisor_messages: 0,
    writes_outside_owned_directory: 0,
    publisher_retention_finalization_calls: 0,
    validator_session_live: false,
  },
  execution_scope: {
    no_app_browser_env_or_answers_used: true,
    no_publisher_db_retention_finalization_or_course_count: true,
    no_parent_state_change_or_message: true,
    dependent_stages_started_after_failure: false,
    child_validator_exited: result.status !== null || result.signal !== null || Boolean(result.error),
    persistent_sessions_created: 0,
  },
};
writeJSON("Report.json", report);
const names = [
  "FIRST.json", "FIRST-freeze.json", "supplemental-source.json", "question370.json",
  "coverage370.json", "merged-draft.json", "preservation.json",
  "validate.execution.json", "validate.stdout.txt", "validate.stderr.txt", "finish.mjs", "Report.json",
];
const manifest = {
  schema: "s10y-choice-minimal-manifest-v1",
  status: report.status,
  question_id: question.value.id,
  files: names.map((name) => {
    const bytes = fs.readFileSync(path.join(work, name));
    return { path: `${relativeWork}/${name}`, sha256: sha256(bytes), bytes: bytes.length };
  }),
  external_inputs: [
    { path: seedPath, sha256: sha256(seed.bytes) },
    { path: priorPath, sha256: sha256(prior.bytes) },
    { path: supplement.value.supplement.path, sha256: supplement.value.supplement.file_sha256, used_blocks: [2, 4] },
  ],
  canonical_merged_draft_sha256: digest(merged),
  independent_approval: false,
};
writeJSON("manifest.json", manifest);
console.log(JSON.stringify({
  report: `${relativeWork}/Report.json`,
  manifest: `${relativeWork}/manifest.json`,
  status: report.status,
  validator_exit_code: result.status,
  validator_stdout: result.stdout,
  validator_stderr: result.stderr,
  question_id: question.value.id,
  retained_questions_deep_equal: retainedQuestions.length,
  retained_coverage_deep_equal: retainedCoverage.length,
  prior_held370_coverage: heldRecords[0],
  counters: report.counters,
  validator_exited: report.execution_scope.child_validator_exited,
}, null, 2));
process.exitCode = succeeded ? 0 : 1;
