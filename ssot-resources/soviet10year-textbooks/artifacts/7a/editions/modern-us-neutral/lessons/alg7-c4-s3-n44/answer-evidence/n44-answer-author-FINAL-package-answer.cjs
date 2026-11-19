const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const working = __dirname;
const owner = path.dirname(working);
const final = path.join(owner, "FINAL");
const choice = path.join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-choice-author/frozen");
if (process.cwd() !== repo || owner !== path.join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-answer-author")) {
  throw new Error("Wrong checkout or ownership boundary");
}
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const parse = file => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (name, value) => fs.writeFileSync(path.join(working, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
const choiceManifest = parse(path.join(choice, "freeze.json"));
const choiceFiles = [
  ...choiceManifest.files.map(entry => ({ path: entry.path, sha256: entry.sha256 })),
  { path: path.join(choice, "freeze.json"), sha256: hash(path.join(choice, "freeze.json")) },
];
for (const entry of choiceFiles) {
  if (hash(entry.path) !== entry.sha256) throw new Error("Existing frozen choice package changed");
}
const lessonRoot = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n44");
const capturePath = path.join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-original-root-capture/capture.json");
const capture = parse(capturePath);
const sourceBindings = parse(path.join(choice, "source-bindings.json"));
const inputs = [
  ["source-exercises", path.join(lessonRoot, "exercises.json")],
  ["source-lesson", path.join(lessonRoot, "lesson.json")],
  ["source-figure-manifest", path.join(lessonRoot, "figures.json")],
  ["own-seed", path.join(choice, "seed.json")],
  ["own-source-calculations", path.join(choice, "source-calculations.md")],
  ["own-author-analysis", path.join(choice, "author-analysis.json")],
  ["own-table-source", path.join(choice, "table-source.json")],
  ["own-source-only-comparison", path.join(choice, "table-comparison.md")],
  ["independent-source-only-literal-capture", capturePath],
  ["existing-answer-skill", path.join(repo, ".claude/skills/ld-s10y-answer/SKILL.md")],
  ["existing-schema-validator", path.join(repo, ".claude/skills/ld-s10y-answer/tools/lesson_answers.py")],
  ["culture-profile", path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")],
].map(([id, file]) => ({ id, path: file, sha256: hash(file) }));
for (const entry of sourceBindings.seed_trace_at_prepare.slice(1)) {
  if (hash(path.join(repo, entry.path)) !== entry.sha256) throw new Error("Source changed from own frozen solving snapshot");
}
write("evidence-inputs.json", {
  schema: "n44-answer-author-evidence-inputs-v1",
  role: "formatting own frozen mathematics; no new solving or semantic review",
  inputs,
  source_counts: {
    originals: 15,
    exercise_numbers: Array.from({ length: 15 }, (_, index) => String(858 + index)),
    previous_printed_letter_level_tasks: 64,
    source_tasks_solved_again: 0,
    previous_choice_questions: 33,
    previous_choice_options: 144,
  },
  frozen_choice_package_baseline: choiceFiles,
  new_source_image_opens: 0,
  inherited_own_same_book_image_opens: 1,
  new_images: 0,
  image_reopens: 0,
  snapshot_references_in_answer_notes: "Stable evidence filenames only; input location/hash mapping is held here",
});
write("same-book-source-cells.json", {
  schema: "n44-answer-author-same-book-source-cells-v1",
  source: "same book appendix, not external Bradis",
  capture_evidence_id: "independent-source-only-literal-capture",
  capture_sha256: hash(capturePath),
  image_sha256: capture.image.sha256,
  physical_page: capture.physical_page,
  printed_page: capture.printed_footer_literal,
  printed_precision: "Exactly three fractional digits in each requested cell; format observation only",
  cells: capture.entries.map(entry => ({
    N: entry.requested_n,
    tens_row: entry.row_header_literal,
    units_column: entry.column_header_literal,
    literal: entry.entry_literal,
    fractional_digits: entry.fractional_digit_count,
  })),
  new_image_opens: 0,
  reopens: 0,
  rounding_rule_observed: false,
  tie_rule_observed: false,
  physical_data_accuracy_guarantee_claimed: false,
  mathematics_approval: false,
});
const command = [
  "python3", "-B",
  path.relative(repo, path.join(working, "check-answer-syntax.py")),
  path.relative(repo, path.join(working, "answer-keys.json")),
];
const checked = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: "utf8" });
write("checks.receipt.json", {
  schema: "n44-answer-author-check-receipt-v1",
  cwd: repo,
  command,
  invocation: 1,
  exit: checked.status,
  stdout: checked.stdout,
  stderr: checked.stderr,
  candidate_sha256: hash(path.join(working, "answer-keys.json")),
  minimal_checker_sha256: hash(path.join(working, "check-answer-syntax.py")),
  existing_validator_sha256: hash(path.join(repo, ".claude/skills/ld-s10y-answer/tools/lesson_answers.py")),
  semantic_approval: false,
  finalizer_invocations: 0,
});
if (checked.status !== 0) {
  console.error(checked.stdout, checked.stderr);
  process.exit(checked.status || 2);
}
const checkReport = JSON.parse(checked.stdout);
write("checks.json", checkReport);
const candidate = parse(path.join(working, "answer-keys.json"));
for (const entry of inputs) {
  if (hash(entry.path) !== entry.sha256) throw new Error("Read-only input changed during packaging");
}
for (const entry of choiceFiles) {
  if (hash(entry.path) !== entry.sha256 || (fs.statSync(entry.path).mode & 0o777) !== 0o444) {
    throw new Error("Frozen choice bytes or permissions changed");
  }
}
write("handoff.json", {
  schema: "n44-answer-author-handoff-v1",
  status: "draft_candidate_for_parent_independent_review",
  cwd: repo,
  branch: "codex/STEMROBIN-182-textbooks",
  candidate: "answer-keys.json",
  candidate_sha256: hash(path.join(working, "answer-keys.json")),
  lesson_answers_schema: candidate.schema,
  counts: {
    answers: candidate.answers.length,
    derived: candidate.answers.filter(answer => answer.source === "derived").length,
    ungraded: candidate.answers.filter(answer => answer.grading === "ungraded").length,
    automatic: 0,
    judging_parts: 0,
    bookRaw: 0,
    historical_entities: 0,
    source_tasks_solved_again: 0,
    new_image_opens: 0,
    image_reopens: 0,
    generated_images: 0,
    existing_schema_check_invocations: 1,
    minimal_syntax_passes: 1,
    display_math_spans_checked: checkReport.display_math_spans_checked,
    finalizer_invocations: 0,
    publisher_invocations: 0,
  },
  source_exercises_sha256: hash(path.join(lessonRoot, "exercises.json")),
  frozen_own_solves_sha256: hash(path.join(choice, "source-calculations.md")),
  frozen_choice_package_unchanged: true,
  source_inputs_unchanged: true,
  notes_use_stable_evidence_filenames: true,
  pending: ["Parent independent answer review before any finalization or retention"],
  mathematical_approval: false,
  whole_appendix_approval: false,
  runtime_input_contract_checked: false,
  written_read_only: true,
  external_actions: [],
});
const names = [
  "answer-keys.json", "answer-methods.md", "evidence-inputs.json",
  "same-book-source-cells.json", "check-answer-syntax.py", "package-answer.cjs",
  "checks.receipt.json", "checks.json", "handoff.json",
];
for (const name of names) {
  fs.copyFileSync(path.join(working, name), path.join(final, name), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(path.join(final, name), 0o444);
}
write("freeze.json", {
  schema: "n44-answer-author-freeze-v1",
  frozen_at: new Date().toISOString(),
  directory: final,
  files: names.map(name => ({
    path: path.join(final, name),
    sha256: hash(path.join(final, name)),
    bytes: fs.statSync(path.join(final, name)).size,
    mode: "0444",
  })),
  self_hash_excluded: true,
  separate_working_copies_writable: true,
  semantic_approval: false,
});
fs.copyFileSync(path.join(working, "freeze.json"), path.join(final, "freeze.json"), fs.constants.COPYFILE_EXCL);
fs.chmodSync(path.join(final, "freeze.json"), 0o444);
console.log(JSON.stringify({
  candidate: path.join(final, "answer-keys.json"),
  candidate_sha256: hash(path.join(final, "answer-keys.json")),
  answer_count: candidate.answers.length,
  check_exit: checked.status,
  checks: checkReport,
  freeze: path.join(final, "freeze.json"),
  freeze_sha256: hash(path.join(final, "freeze.json")),
  frozen_choice_files_preserved: choiceFiles.length,
}, null, 2));
