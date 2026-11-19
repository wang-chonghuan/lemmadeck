import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const own = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1265-n98-q7-definition-affected-review");
const seedPath = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1251-n98-first-choice/seed.json");
const authorRoot = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1251-n98-first-choice/author");
const predecessorRoot = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1258-n98-first-choice-independent-review");
const validator = path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const qid = "q-longitudinal-length";
const locales = ["zh", "en"];
assert.equal(process.cwd(), repo, "Sole authorized cwd required");
assert.equal(fs.realpathSync(own), own, "Output root must not be a symlink");

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

function canonicalBytes(value) {
  return JSON.stringify(canonical(value)).replace(/[\u0080-\uffff]/g, char =>
    "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"));
}

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function digest(value) {
  return sha(canonicalBytes(value));
}

function binding(file) {
  const bytes = fs.readFileSync(file);
  const result = { path: file, bytes: bytes.length, file_sha256: sha(bytes) };
  if (file.endsWith(".json")) result.canonical_sha256 = digest(JSON.parse(bytes));
  return result;
}

function load(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeGenerated(relative, value) {
  const target = path.join(own, relative);
  assert(target.startsWith(own + path.sep), "Generated output outside sole allowed directory");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  assert.equal(fs.realpathSync(path.dirname(target)), path.dirname(target), "No output symlink");
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", { encoding: "utf8", flag: "wx" });
  return target;
}

function aggregate(review) {
  const checks = [
    ...review.source_reviews.map(row => row.coverage.verdict),
    ...review.new_figure_reviews.map(row => row.verdict),
    ...review.question_reviews.flatMap(row =>
      [row.task_fidelity.verdict, row.redundancy.verdict, row.answer_leakage.verdict, row.mathematics.verdict])
  ];
  assert(checks.every(verdict => ["pass", "revise", "blocked"].includes(verdict)));
  return checks.includes("blocked") ? "blocked" : checks.includes("revise") ? "revise" : "pass";
}

const sourceFreezePath = path.join(own, "source-freeze.json");
const viewFreezePath = path.join(own, "view-freeze.json");
const affectedPath = path.join(own, "affected-review.json");
const sourceFreeze = load(sourceFreezePath);
const viewFreeze = load(viewFreezePath);
const affected = load(affectedPath);
assert.equal(binding(sourceFreezePath).file_sha256, viewFreeze.source_freeze.file_sha256);
assert.equal(binding(viewFreezePath).file_sha256, "33482d09a04e557c682a892664240c4a8efac6405f4b14f963e228488902a081");
assert.equal(binding(seedPath).file_sha256, sourceFreeze.seed_binding.file_sha256);
const seed = load(seedPath);
assert.deepEqual(seed.exercises.filter(row => row.number === "7"), [sourceFreeze.seed_binding.selected_exercise]);
assert.equal(seed.figures.length, 0, "Zero-image scope");
assert.deepEqual(seed.source.concept_figure_ids, []);
assert.equal(digest(seed), sourceFreeze.seed_binding.canonical_sha256);

const protectedPaths = [seedPath, sourceFreezePath, viewFreezePath, affectedPath];
const inputBindings = {};
for (const locale of locales) {
  const definition = sourceFreeze.definition_bindings[locale];
  const actual = binding(definition.path);
  assert.equal(actual.file_sha256, definition.file_sha256);
  assert.equal(actual.canonical_sha256, definition.canonical_sha256);
  const template = load(definition.path);
  const selection = [0, 3, 4, 5, 6].map(index => ({ index, entry: template.prose[index] }));
  assert.equal(digest(selection), definition.selected_projection_sha256);
  for (const entry of definition.selected_entries) {
    assert.equal(template.prose[entry.index].text, entry.literal_text);
    assert.equal(digest(template.prose[entry.index]), entry.entry_sha256);
  }
  inputBindings[locale] = { definition_file: actual, selected_definitions: definition.selected_entries,
    selected_projection_sha256: definition.selected_projection_sha256 };
  protectedPaths.push(definition.path, path.join(authorRoot, locale, "draft.json"),
    path.join(predecessorRoot, locale, "review.json"));
}

const instructions = [
  ".agents/skills/ld-s10y-choice/SKILL.md",
  ".agents/skills/ld-s10y-choice/references/review.md",
  ".agents/skills/ld-s10y-choice/references/contract.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  ".agents/skills/ld-s10y-choice/scripts/prepare.py"
].map(relative => path.join(repo, relative));
protectedPaths.push(...instructions);
const beforeBindings = protectedPaths.map(binding);
const localeResults = {};

for (const locale of locales) {
  const draftPath = path.join(authorRoot, locale, "draft.json");
  const predecessorPath = path.join(predecessorRoot, locale, "review.json");
  const draft = load(draftPath);
  const predecessor = load(predecessorPath);
  const frozen = viewFreeze.locale_bindings[locale];
  assert.equal(binding(draftPath).file_sha256, frozen.draft_file_sha256);
  assert.equal(predecessor.seed_sha256, digest(seed));
  assert.equal(predecessor.draft_sha256, digest(draft));
  assert.equal(draft.new_figures.length, 0, "No authored images");
  assert.equal(predecessor.figure_checks.length, 0);
  assert.equal(predecessor.new_figure_reviews.length, 0);
  assert.equal(draft.questions.length, 8);
  const question = draft.questions.find(row => row.id === qid);
  assert(question);
  assert.deepEqual(question.source_numbers, ["7"]);
  assert.equal(digest(question.view), frozen.view_sha256);
  assert.deepEqual(question.view, frozen.view);
  assert.deepEqual(question.key.correct, viewFreeze.complete_true_set);
  const newQuestion = affected.question_reviews[locale];
  assert.deepEqual(newQuestion.mathematics.correct, viewFreeze.complete_true_set);
  for (const check of newQuestion.mathematics.option_checks) {
    assert.equal(check.truth, viewFreeze.all_four_option_judgments.find(row => row.option_id === check.option_id).truth);
    assert.equal(check.truth, question.key.rationales.find(row => row.option_id === check.option_id).truth);
  }

  // Preserve whole records and their order; only the affected source and question are replaced.
  const review = structuredClone(predecessor);
  review.reviewer = structuredClone(affected.reviewer);
  review.source_reviews = predecessor.source_reviews.map(row =>
    row.source_number === "7" ? structuredClone(affected.source_review) : structuredClone(row));
  review.question_reviews = predecessor.question_reviews.map(row =>
    row.question_id === qid ? structuredClone(newQuestion) : structuredClone(row));
  review.outcome = aggregate(review);
  assert.equal(review.source_reviews.filter(row => row.source_number === "7").length, 1);
  assert.equal(review.question_reviews.filter(row => row.question_id === qid).length, 1);

  const inheritedQuestions = predecessor.question_reviews.filter(row => row.question_id !== qid).map(row => {
    const retained = review.question_reviews.find(item => item.question_id === row.question_id);
    assert.deepEqual(retained, row);
    return { question_id: row.question_id, before_sha256: digest(row), after_sha256: digest(retained), exact_equal: true };
  });
  const inheritedSources = predecessor.source_reviews.filter(row => row.source_number !== "7").map(row => {
    const retained = review.source_reviews.find(item => item.source_number === row.source_number);
    assert.deepEqual(retained, row);
    return { source_number: row.source_number, before_sha256: digest(row), after_sha256: digest(retained), exact_equal: true };
  });
  assert.equal(inheritedQuestions.length, 7);
  assert.equal(inheritedSources.length, 7);
  for (const field of ["schema", "seed_sha256", "draft_sha256", "figure_checks", "new_figure_reviews"]) {
    assert.deepEqual(review[field], predecessor[field]);
  }

  const reviewPath = writeGenerated(`${locale}/review.json`, review);
  const args = ["-B", validator, "--repo", repo, "--seed", seedPath, "--draft", draftPath, "--review", reviewPath];
  const validation = spawnSync("python3", args, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const receipt = {
    executable: "python3",
    args,
    cwd: repo,
    exit_code: validation.status,
    signal: validation.signal,
    execution_error: validation.error?.message ?? null,
    stdout: validation.stdout ?? "",
    stderr: validation.stderr ?? "",
    caveat: "Existing validator establishes mechanical contract/freshness/binding checks, not automatic scientific proof. -B disables import bytecode writes."
  };
  const receiptPath = writeGenerated(`${locale}/validation.json`, receipt);
  localeResults[locale] = {
    draft_binding: binding(draftPath),
    affected_question_sha256: digest(question),
    affected_view_sha256: digest(question.view),
    predecessor_binding: binding(predecessorPath),
    predecessor_outcome: predecessor.outcome,
    review_binding: binding(reviewPath),
    composed_outcome: review.outcome,
    inherited_question_records: inheritedQuestions,
    inherited_source_records: inheritedSources,
    replacement_source_record: { before_sha256: digest(predecessor.source_reviews.find(row => row.source_number === "7")), after_sha256: digest(affected.source_review) },
    replacement_question_record: { before_sha256: digest(predecessor.question_reviews.find(row => row.question_id === qid)), after_sha256: digest(newQuestion) },
    validation: receipt,
    validation_receipt_binding: binding(receiptPath)
  };
}

const afterBindings = protectedPaths.map(binding);
assert.deepEqual(afterBindings, beforeBindings, "Protected input changed during composition/validation");
const passed = locales.every(locale =>
  localeResults[locale].composed_outcome === "pass" && localeResults[locale].validation.exit_code === 0);
const report = {
  schema: "s10y-choice-scoped-affected-review-report-v1",
  ticket: "STEMROBIN-181",
  cwd: repo,
  branch: "codex/STEMROBIN-181-textbooks",
  branch_authority: "Direct user instruction; no git access",
  status: passed ? "pass" : "non-passing",
  scope: affected.scope,
  seed_binding: binding(seedPath),
  seed_source7: sourceFreeze.seed_binding.selected_exercise,
  seed_source7_projection_sha256: digest(sourceFreeze.seed_binding.selected_exercise),
  seed_trace_provenance: seed.trace,
  definition_bindings: inputBindings,
  freeze_bindings: { source: binding(sourceFreezePath), view: binding(viewFreezePath) },
  affected_observations_binding: binding(affectedPath),
  instruction_and_validator_bindings: instructions.map(binding),
  composition_script_binding: binding(path.join(own, "compose.mjs")),
  review_order: [
    "Read actual current skill/review/contract/recovery instructions, then source7 only and authorized N97 definition paragraphs.",
    "Persist source-freeze.json with exact law, conditions and independent source solution before opening either draft.",
    "Read only q-longitudinal-length view in each draft; persist view-freeze.json with all four judgments and complete set before author internals.",
    "Read only q7 author intent/key/rationales and source7 coverage; compare against the already frozen judgments.",
    "Read predecessor reviews only after both freezes; mechanically inherit untouched records and replace source7/q7 observations.",
    "Run the existing validator once per locale against original seed, unchanged full author draft and new full strict review."
  ],
  affected_field_composition: {
    manually_authored_with_apply_patch: ["source-freeze.json", "view-freeze.json", "affected-review.json", "compose.mjs"],
    generated_by_mechanical_record_composition: ["zh/review.json", "en/review.json", "zh/validation.json", "en/validation.json", "report.json"],
    replaced_record_selectors: ["source_reviews[source_number='7']", "question_reviews[question_id='q-longitudinal-length']"],
    changed_header_fields: ["reviewer", "outcome"],
    preserved_header_fields: ["schema", "seed_sha256", "draft_sha256", "figure_checks", "new_figure_reviews"],
    per_locale_exactly_unchanged_question_records: 7,
    per_locale_exactly_unchanged_source_records: 7,
    no_other_question_semantic_reassessment: true,
    original_seed_and_author_drafts_written: false,
    predecessor_reviews_written: false
  },
  definition_input_omission_diagnosis: {
    original_seed_selected_concepts: [4, 6],
    original_seed_concepts_subject: "N98 velocity composition (8.6) and its classical approximation, not rod length",
    original_q7_intent_concept_blocks: [],
    predecessor_supplied_N97_literal_definition_indices: [0, 6, 19, 21],
    predecessor_hold: "Insufficient supplied quantitative definition: no independently established exact length law or nonzero-speed monotonic comparison before key disclosure",
    predecessor_did_not_claim: ["false mathematics in option a", "need to open held figures", "whole-card approval"],
    newly_authorized_literal_definition_indices: [0, 3, 4, 5, 6],
    decisive_input: "N97 prose[4] explicitly supplies equation (8.2); prose[0,3,5,6] supplies proper length, simultaneous measuring-frame endpoint convention, longitudinal and subluminal scope",
    resolution: "Independent source-first derivation and view-only option freeze now establish {a}; author key is compared only afterward. Earlier HOLD remains preserved and is not retrospectively converted into a false-math claim.",
    author_definition_history_unchanged: affected.post_freeze_comparison.author_definition_history
  },
  post_freeze_comparison: affected.post_freeze_comparison,
  language_equivalence: viewFreeze.language_equivalence,
  locales: localeResults,
  preservation: {
    protected_input_bindings_before: beforeBindings,
    protected_input_bindings_after: afterBindings,
    exact_unchanged: true,
    scope_caveat: "Comparison covers actual files bound for this task, not an unauthorized whole-worktree or git audit."
  },
  actual_usage: {
    reviewer_sessions: 1,
    independent_affected_review_rounds: 1,
    affected_source_tasks: 1,
    locale_question_review_records: 2,
    option_judgments: 8,
    authorized_definition_paragraphs_read: 10,
    unrelated_question_views_read: 0,
    unrelated_source_exercises_semantically_reviewed: 0,
    passed_question_reassessment_count: 0,
    existing_validator_runs: 2,
    author_rewrites: 0,
    content_revision_rounds: 0,
    images_opened: 0,
    images_generated: 0,
    image_payloads: 0,
    network_calls: 0,
    paid_model_service_calls: 0,
    dependency_installs: 0,
    environment_reads: 0,
    environment_writes: 0,
    database_calls: 0,
    publisher_calls: 0,
    git_commands: 0,
    chat_management_or_messages: 0,
    application_writes: 0,
    writes_outside_authorized_output_directory: 0,
    usage_caveat: "No model billing/token metrics are exposed for this reviewer session; zero paid service calls does not assert zero platform session cost."
  },
  technical_receipts: [
    { stage: "Initial output inventory", observation: "rg --files named the output directory before it existed and returned exit 2. apply_patch then created only the authorized directory.", scientific_verdict: false },
    { stage: "Predecessor-output reading", observation: "Combined full JSON tool output was truncated. A bounded selector/hash read recovered only q7 and inheritance bindings; no source, image or author stage was rerun.", scientific_verdict: false }
  ],
  approval_boundary: "Pass, if present, covers composed offline choice-review checks only. No N97 lesson/figure, whole-card, deployment, publisher or human-approval inference."
};
const reportPath = writeGenerated("report.json", report);
console.log(JSON.stringify({ status: report.status, report: binding(reportPath),
  locales: Object.fromEntries(locales.map(locale => [locale, {
    outcome: localeResults[locale].composed_outcome,
    validation_exit_code: localeResults[locale].validation.exit_code,
    retained_questions_exactly_equal: localeResults[locale].inherited_question_records.every(row => row.exact_equal)
  }])) }, null, 2));
if (!passed) process.exitCode = 1;
