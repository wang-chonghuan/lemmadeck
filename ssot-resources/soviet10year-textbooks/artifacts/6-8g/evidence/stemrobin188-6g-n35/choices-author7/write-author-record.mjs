import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmod, copyFile, readFile, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
const directory = resolve(root, ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices7");
assert.equal(process.cwd(), root);
const byteHash = value => createHash("sha256").update(value).digest("hex");
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
  }
  return value;
}
function canonicalHash(value) {
  const ascii = JSON.stringify(sorted(value)).replace(/[^\x00-\x7f]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
  return byteHash(ascii);
}
async function artifact(name, json = false) {
  const path = resolve(directory, name);
  const bytes = await readFile(path);
  const metadata = await stat(path);
  return {
    path,
    sha256: byteHash(bytes),
    ...(json ? { canonical_sha256: canonicalHash(JSON.parse(bytes.toString("utf8"))) } : {}),
    bytes: bytes.length,
    mode: `0${(metadata.mode & 0o777).toString(8)}`,
  };
}
const seed = JSON.parse(await readFile(resolve(directory, "seed.json"), "utf8"));
const draft = JSON.parse(await readFile(resolve(directory, "draft.json"), "utf8"));
assert.equal(canonicalHash(seed), "029294324997c6b097f467ae580c8d06323565798041adb236bce6c4ab524058");
const source = await artifact("SOURCE-SOLVING.md");
assert.equal(source.mode, "0444");
assert.equal(source.sha256, "c4e52c6cfbcbc54962dbea7df032e21d3c33baa1d379d45e3f1d4e46d4d4460a");
await copyFile(resolve(directory, "draft.json"), resolve(directory, "draft.candidate-02.json"), constants.COPYFILE_EXCL);
await chmod(resolve(directory, "draft.candidate-02.json"), 0o444);
await chmod(resolve(directory, "draft.json"), 0o444);
const first = JSON.parse(await readFile(resolve(directory, "validation.first.json"), "utf8"));
const record = {
  schema: "n35-choice-author-record-v1",
  status: "authorcandidate-only",
  cwd: root,
  owned_directory: directory,
  authority: {
    seed: await artifact("seed.json", true),
    selected_written_sources: seed.exercises.map(exercise => exercise.number),
    selected_definition_blocks: seed.concepts.map(concept => concept.block),
    selected_solved_proof_or_example_blocks: [],
    original_glyph_identity: "UNKNOWN",
    original_printing_roles: "UNKNOWN",
    raw_source_content_read_by_author: false,
    previous_answers_or_choices_read: false,
    other_lessons_or_ticket_outputs_read: false,
    reviewer_results_read: false,
    native_checker_freshness_reads: "Only the requested structural checker may refresh its normal whitelist projection; its raw source objects were not displayed or used to author.",
  },
  artifacts: {
    source_solving: source,
    draft: await artifact("draft.json", true),
    first_candidate: await artifact("draft.candidate-01.json", true),
    notation_repaired_candidate: await artifact("draft.candidate-02.json", true),
    first_validation_receipt: await artifact("validation.first.json", true),
    first_validation_stdout: await artifact("validation.first.stdout.txt"),
    first_validation_stderr: await artifact("validation.first.stderr.txt"),
    given_figure_screenshot: await artifact("fig218-headed.png"),
    image_first_failure: await artifact("image-execution-first-failure.json", true),
    image_first_script: await artifact("view-given-figure.first-attempt.mjs"),
    image_recovered_script: await artifact("view-given-figure.mjs"),
    structural_runner: await artifact("run-structural-once.mjs"),
    record_writer: await artifact("write-author-record.mjs"),
  },
  source_solving: {
    complete_selected_source_count: 10,
    sealed_mode: "0444",
    sealed_before_first_draft_write: true,
    basis: "Execution order: complete source-solving file written and corrected, chmod 0444 succeeded, source byte hash recorded, then first draft was written.",
    source_solving_reopened_after_seal_for_new_mathematics: false,
    independent_of_written_answer_keys: true,
  },
  structural_validation: {
    ...first,
    current_candidate_tested: false,
    current_candidate_structural_status: "unvalidated-after-notation-repair",
    native_error: "contract error: option.text: embedded media/HTML/URL",
    failed_candidate_binding: await artifact("draft.candidate-01.json", true),
    diagnosis: "The visible-text guard at validate.py:55-59 matches </?[A-Za-z][^>]*>; a raw mathematical a<b followed later by a>b in the same Markdown table is mistaken for an HTML tag.",
    minimal_repair: {
      question_id: "ray-set-table",
      scope: "Only the eight raw comparison signs in four option tables were replaced by LaTeX \\lt and \\gt. Conditions, sets, alternatives, keys and source mathematics were not changed.",
      new_candidate: await artifact("draft.candidate-02.json", true),
      native_rerun: false,
      reason_not_rerun: "Human authorization specified one native structural validation invocation; that invocation is already preserved. No success is inferred for the repaired snapshot.",
    },
  },
  semantic_review: {
    status: "not-run",
    reviewer: null,
    semantic_pass_claimed: false,
    review_artifact_created: false,
    next_stage: "No semantic review has been performed. The notation-repaired candidate also lacks a native structural result under this one-invocation authorization.",
  },
  counters: {
    selected_sources: seed.exercises.length,
    source_tasks_solved: 10,
    selected_definition_blocks: seed.concepts.length,
    questions: draft.questions.length,
    single_questions: draft.questions.filter(question => question.view.mode === "single").length,
    multiple_questions: draft.questions.filter(question => question.view.mode === "multiple").length,
    options: draft.questions.reduce((count, question) => count + question.view.options.length, 0),
    candidate_snapshots: 2,
    post_first_validation_notation_repairs: 1,
    native_structural_validation_invocations: 1,
    native_structural_validation_failures: 1,
    native_structural_validation_exit_code: first.exit_code,
    native_structural_validation_reruns: 0,
    semantic_reviews: 0,
    semantic_passes: 0,
    new_figures: 0,
    source_figures_viewed: 1,
    concept_figure_loads: 0,
    image_context_opens: 1,
    image_crops: 0,
    image_reopens: 0,
    headed_browser_launches: 2,
    browser_asset_load_attempts: 2,
    screenshot_attempts: 2,
    successful_screenshots: 1,
    screenshot_execution_failures: 1,
    image_context_total: 1,
    image_batch_total: 1,
    image_batch_limit: 8,
    image_context_limit: 24,
    technical_read_failures: 2,
    written_answer_key_reads: 0,
    old_choice_reads: 0,
    previous_ticket_output_reads: 0,
    other_lesson_reads: 0,
    paid_model_calls: 0,
    external_network_calls: 0,
    dependency_mutations: 0,
    environment_file_actions: 0,
    database_actions: 0,
    publisher_actions: 0,
    canonical_resource_writes: 0,
    git_actions: 0,
    worktree_actions: 0,
    peer_or_chat_actions: 0,
    supervisor_actions: 0,
  },
  image_usage: {
    asset_path: resolve(root, seed.figures[0].assets[0].path),
    asset_sha256: seed.figures[0].assets[0].sha256,
    transport: "Original modern SVG bytes embedded in an offline HTML img, not an authored diagram.",
    actual_open_log: [
      { attempt: 1, context_image_loaded: false, screenshot_completed: false, outcome: "Standalone SVG screenshot timeout after load; browser closed; no pixel-view image produced." },
      { attempt: 2, context_image_loaded: true, screenshot_completed: true, screenshot_path: resolve(directory, "fig218-headed.png"), action: "One view_image open of full screenshot; no crop or reopen." },
    ],
    successful_execution: {
      cwd: root,
      argv: ["node", ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/view-given-figure.mjs"],
      exit_code: 0,
      headed: true,
      offline: true,
      image_bounds: { x: 0, y: 0, width: 640, height: 420 },
      screenshot_dimensions: { width: 1440, height: 960 },
      all_relevant_objects_visible: "Observed upper A-Q-B, lower C-P-D, diagonal F-P-Q-E; rightmost B and bottommost F wholly visible.",
    },
    browser_closed: true,
    figure_fidelity_review_claimed: false,
  },
  technical_read_failures: [
    {
      cwd: root,
      argv: ["sed", "-n", "1,260p", ".agents/skills/playwright-cli/SKILL.md"],
      exit_code: 1,
      stdout: "",
      stderr: "sed: .agents/skills/playwright-cli/SKILL.md: No such file or directory\n",
      recovery: "Read the routed existing skill at .agents/skills/node_modules/playwright-core/lib/tools/cli-client/skill/SKILL.md; no installation.",
    },
    {
      cwd: root,
      argv: ["rg", "-n", "-C", "6", "embedded media/HTML/URL", ".agents/skills/ld-s10y-choice/scripts/validate.py", ".agents/skills/ld-s10y-choice/scripts/common.py"],
      exit_code: 2,
      stderr: "rg: .agents/skills/ld-s10y-choice/scripts/common.py: No such file or directory (os error 2)\n",
      recovery: "The requested narrow visible-text guard was returned from existing validate.py lines 53-65. No second diagnostic or entire checker read was needed.",
    },
  ],
  coverage_status: "authored-coverage-with-explicit-losses-not-semantically-reviewed",
  coverage: draft.coverage,
  stop_boundary: "Author candidate only. First native structural failure preserved, notation-only repair saved unvalidated. No semantic review, approval, figure delegation, retention, publication or external action.",
};
const output = resolve(directory, "AUTHOR-RECORD.json");
await writeFile(output, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
await chmod(output, 0o444);
console.log(JSON.stringify({
  record: await artifact("AUTHOR-RECORD.json", true),
  seed: record.authority.seed,
  source_solving: record.artifacts.source_solving,
  draft: record.artifacts.draft,
  counters: record.counters,
  status: record.status,
}, null, 2));
