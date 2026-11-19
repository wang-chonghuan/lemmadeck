import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const workdir = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const root = join(workdir, ".tmp/s10y-choice/batch015-ana9-n2-repair");
assert.equal(process.cwd(), workdir);
const read = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));
const hashBytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sorted = (value) => {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
  }
  return value;
};
const canonical = (value) => JSON.stringify(sorted(value)).replace(
  /[\u007f-\uffff]/g,
  (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
);
const digest = (value) => hashBytes(canonical(value));
const write = (name, value) => {
  const path = join(root, name);
  assert.equal(existsSync(path), false, `Refusing to overwrite ${path}`);
  writeFileSync(path, value, { flag: "wx" });
};
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);

const seed = read("seed.json");
const draft = read("draft.json");
const validation = read("commands/validate.json");
assert.equal(validation.exit_code, 0);
assert.equal(validation.stdout_closed, true);
assert.equal(validation.stderr_closed, true);
assert.equal(digest(seed), draft.seed_sha256);
assert.equal(
  digest(seed),
  readFileSync(join(root, "commands/seed-digest.stdout"), "utf8").trim(),
);
assert.equal(
  digest(draft),
  readFileSync(join(root, "commands/draft-digest.stdout"), "utf8").trim(),
);
assert.equal(seed.figures.length, 0);
assert.equal(draft.new_figures.length, 0);
const views = draft.questions.map((question) => question.view);
for (const view of views) {
  assert.deepEqual(Object.keys(view).sort(), ["figure_ids", "mode", "options", "stem"]);
  assert.equal(view.figure_ids.length, 0);
  for (const option of view.options) {
    assert.deepEqual(Object.keys(option).sort(), ["figure_ids", "id", "text"]);
    assert.equal(option.figure_ids.length, 0);
  }
}
const q3 = draft.questions.find((question) => question.id === "q3");
assert.ok(q3);
const q3Rows = q3.view.options.map((option) => {
  const rows = option.text.split("\n");
  assert.equal(rows.length, 4);
  assert.ok(rows[2].startsWith("| $q\\ne0$ |"));
  assert.ok(rows[3].startsWith("| $q=0$ |"));
  return {
    option_id: option.id,
    nonzero_row_count: 1,
    zero_row_count: 1,
    character_count: option.text.length,
  };
});
const sources = seed.trace.map((entry, index) => {
  const actual = hashBytes(readFileSync(join(workdir, entry.path)));
  if (index > 0) assert.equal(actual, entry.sha256, `Source changed: ${entry.path}`);
  return {
    path: join(workdir, entry.path),
    seed_snapshot_sha256: entry.sha256,
    current_sha256: actual,
    byte_identical_to_prepared_snapshot: actual === entry.sha256,
    role: index === 0 ? "book_membership_index" : "authoritative_lesson_input",
  };
});
const reasoningStat = statSync(join(root, "source-solving.md"));
const draftStat = statSync(join(root, "draft.json"));
assert.ok(reasoningStat.birthtimeMs < draftStat.birthtimeMs);
writeJson("view.json", views);
write("view.md", views.map((view, index) => [
  `## ${index + 1}`,
  `Mode: ${view.mode}`,
  view.stem,
  ...view.options.map((option) => `### ${option.id}\n\n${option.text}`),
].join("\n\n")).join("\n\n") + "\n");

const handoff = {
  ticket: "STEMROBIN-184",
  invocation: "worker184-3 same open-development continuation",
  workdir,
  owned_directory: root,
  book: seed.source.book,
  lesson: seed.source.lesson,
  status: "candidate_ready_for_parent_independent_review",
  original_candidate: {
    located: false,
    snapshot_binding: null,
    absence_report: join(root, "DISCOVERY.md"),
    historical_passes_adopted: false,
    branch: "explicitly_authorized_missing_candidate_fallback",
  },
  seed_path: join(root, "seed.json"),
  seed_canonical_sha256: digest(seed),
  draft_path: join(root, "draft.json"),
  draft_canonical_sha256: digest(draft),
  view_path: join(root, "view.json"),
  view_canonical_sha256: digest(views),
  view_markdown_path: join(root, "view.md"),
  source_reasoning_path: join(root, "source-solving.md"),
  source_reasoning_created_at: reasoningStat.birthtime.toISOString(),
  draft_created_at: draftStat.birthtime.toISOString(),
  reasoning_precedes_draft_creation: true,
  source_inputs: sources,
  counts: {
    selected_source_exercises: seed.exercises.length,
    selected_definition_blocks: seed.concepts.length,
    questions: views.length,
    single_questions: views.filter((view) => view.mode === "single").length,
    multiple_questions: views.filter((view) => view.mode === "multiple").length,
    options: views.reduce((count, view) => count + view.options.length, 0),
    source_figures: 0,
    authored_figures: 0,
    images_opened: 0,
    images_authorized: 0,
  },
  q3: {
    view_canonical_sha256: digest(q3.view),
    branch_rows: q3Rows,
    zero_power_convention_adopted: false,
    affected_goal: "comparable zero/nonzero alternatives for a complete coupled induction step",
    semantic_verdict: null,
  },
  coverage: {
    source_numbers: seed.exercises.map((exercise) => exercise.number),
    convention_dependent_task_unavailable: "Literal 0^0 interpretation in the compact source term formula at q=0,n=1.",
    actual_zero_sequence_and_sums_represented: true,
    production_losses_recorded: true,
  },
  mechanical_validation: {
    receipt_path: join(root, "commands/validate.json"),
    argv: validation.argv,
    workdir: validation.workdir,
    exit_code: validation.exit_code,
    stdout: readFileSync(validation.stdout_path, "utf8"),
    stderr: readFileSync(validation.stderr_path, "utf8"),
    stdout_closed: validation.stdout_closed,
    stderr_closed: validation.stderr_closed,
    failed_validation_attempts: 0,
    scope: "Official structural/input/snapshot checks only; not semantic proof.",
  },
  semantic_review: {
    status: "pending_parent_independent_reviewer",
    self_approval_performed: false,
    descendants_spawned: 0,
    review_file: null,
    request_path: join(root, "REVIEW-REQUEST.md"),
    required_scope: "All new views; original passed question snapshots unavailable.",
  },
  boundaries: {
    approved_prose_regenerated_or_reviewed: false,
    approved_written_exercises_regenerated_or_reviewed: false,
    standard_answers_read_or_reviewed: false,
    canonical_writes: 0,
    network_calls: 0,
    database_calls: 0,
    publisher_calls: 0,
    git_commands: 0,
    browser_calls: 0,
    dependency_installs: 0,
  },
};
writeJson("handoff.json", handoff);
const files = readdirSync(root, { recursive: true }).filter((name) =>
  statSync(join(root, name)).isFile(),
);
writeJson("package-hashes.json", files.sort().map((name) => ({
  path: join(root, name),
  sha256: hashBytes(readFileSync(join(root, name))),
  bytes: statSync(join(root, name)).size,
})));
console.log(JSON.stringify({
  status: handoff.status,
  seed_canonical_sha256: handoff.seed_canonical_sha256,
  draft_canonical_sha256: handoff.draft_canonical_sha256,
  view_canonical_sha256: handoff.view_canonical_sha256,
  counts: handoff.counts,
  source_files_byte_identical: sources.every((entry) => entry.byte_identical_to_prepared_snapshot),
  handoff_path: join(root, "handoff.json"),
}, null, 2));
