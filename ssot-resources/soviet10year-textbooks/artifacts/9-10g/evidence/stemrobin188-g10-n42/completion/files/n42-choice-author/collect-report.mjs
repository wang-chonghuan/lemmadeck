import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (fs.realpathSync(process.cwd()) !== repo) throw new Error("Wrong cwd");
const relative = ".intentfold/tickets/STEMROBIN-188/tmp/n42-choice-author";
const out = path.join(repo, relative);
const read = (name) => JSON.parse(fs.readFileSync(path.join(out, name), "utf8"));
const hash = (filename) =>
  crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const writeNew = (name, value) =>
  fs.writeFileSync(path.join(out, name), value, { flag: "wx" });
const jsonNew = (name, value) => writeNew(name, JSON.stringify(value, null, 2) + "\n");
if (fs.existsSync(path.join(out, "validation-structure-01.json"))) {
  throw new Error("Structural validator already invoked; no rerun authorized");
}

const seed = read("seed.json");
const draft = read("draft.json");
const digest = (name) => {
  const result = spawnSync(
    "python3",
    ["-B", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", `${relative}/${name}`],
    { cwd: repo, encoding: "utf8" },
  );
  if (result.status !== 0) throw new Error(result.stderr || "Digest failed");
  return result.stdout.trim();
};
const candidateFiles = ["seed.json", "draft.json", "task-solutions.md"].map((name) => ({
  path: path.join(out, name),
  repo_relative_path: `${relative}/${name}`,
  file_sha256: hash(path.join(out, name)),
  ...(name.endsWith(".json") ? { canonical_sha256: digest(name) } : {}),
}));
for (const name of ["seed.json", "draft.json", "task-solutions.md"]) {
  fs.chmodSync(path.join(out, name), 0o444);
}

const failedInspections = [
  {
    command: "python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book book9-10g --lesson lessongeo910-c2-s1-n42",
    cwd: repo,
    exit_code: 2,
    stderr: "input error: [Errno 2] No such file or directory: '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/book9-10g/book.json'\n",
    classification: "technical_source_selector",
  },
  {
    command: "python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 9-10g --lesson lessongeo910-c2-s1-n42",
    cwd: repo,
    exit_code: 2,
    stderr: "input error: [Errno 2] No such file or directory: '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/lessongeo910-c2-s1-n42/lesson.json'\n",
    classification: "technical_source_selector",
  },
];
jsonNew("inspect-failure-receipts.json", {
  failures: failedInspections,
  correction: "Resolve book/card display identities to tool directory selectors 9-10g and geo910-c2-s1-n42 in the current checkout core artifact root. The successful inspect and prepare used these selectors. No source bytes or tool code were edited.",
  successful_inspect_command: "python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 9-10g --lesson geo910-c2-s1-n42",
});

const argv = [
  "-B",
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo",
  ".",
  "--seed",
  `${relative}/seed.json`,
  "--draft",
  `${relative}/draft.json`,
];
jsonNew("validation-started-01.json", {
  executable: "python3",
  argv,
  cwd: repo,
  review_argument: null,
  invocation: 1,
  candidates: candidateFiles,
});
const validation = spawnSync("python3", argv, {
  cwd: repo,
  encoding: "utf8",
  timeout: 120000,
});
const receipt = {
  executable: "python3",
  argv,
  cwd: repo,
  exit_code: validation.status,
  signal: validation.signal,
  stdout: validation.stdout || "",
  stderr: validation.stderr || "",
  error: validation.error ? String(validation.error) : null,
  scope: "structure_only",
  invocation: 1,
  review_run: false,
  candidates: candidateFiles,
};
jsonNew("validation-structure-01.json", receipt);

const imageLedger = [];
for (const number of ["01", "02"]) {
  const base = `ssot-resources/soviet10year-textbooks/artifacts/9-10g`;
  const svg = `${base}/editions/modern-us-neutral/figures/fig-g10-${number}.svg`;
  const modern = `${relative}/modern-fig-g10-${number}-complete.png`;
  const original = `${base}/figures/fig-g10-${number}.png`;
  imageLedger.push(
    {
      batch: 1,
      image_load: imageLedger.length + 1,
      kind: "complete_rendered_current_modern_svg",
      figure_id: `fig-g10-${number}`,
      path: path.join(repo, modern),
      sha256: hash(path.join(repo, modern)),
      authoritative_asset_path: path.join(repo, svg),
      authoritative_asset_sha256: hash(path.join(repo, svg)),
      render_size: { width: 480, height: 400 },
      viewed: true,
      role: number === "01" ? "selected_definition_and_question" : "lesson_context_only",
      observation: number === "01"
        ? "Common origin; i down-left, j right, k up; all arrowheads and vector-accent labels visible. The rightmost j and lowest i are inside the complete canvas. No general collinearity or perpendicularity criterion is stated by these pixels."
        : "Complete cuboid with solid visible edges and dashed hidden edges, a dashed directed diagonal from the lower front-right vertex to the upper back-left vertex, and i,j,k plus xi,yj,zk arrows. Rightmost xi and all bottom arrows/labels are visible. This illustration is not used as an arbitrary-vector geometric criterion.",
    },
    {
      batch: 1,
      image_load: imageLedger.length + 2,
      kind: "actual_original_png",
      figure_id: `fig-g10-${number}`,
      path: path.join(repo, original),
      sha256: hash(path.join(repo, original)),
      viewed: true,
      role: "original_visual_correspondence",
      observation: number === "01"
        ? "Original three-arrow basis from a shared vertex: i down-left, j right, k up. All original arrowheads and labels are present in the modern rendering."
        : "Original complete cuboid and directed diagonal, with xi on the slanted right edge, yj leftward on the lower front edge, zk upward at the front-right edge, and the three unit-vector labels. Modern image retains this structure and all labeled directions.",
    },
  );
}
const covered = draft.coverage.filter((row) => row.question_ids.length > 0);
const held = draft.coverage.filter((row) => row.question_ids.length === 0);
const report = {
  schema: "n42-choice-author-report-v1",
  role: "offline_choice_author_only",
  status: validation.status === 0 ? "author_candidate_partial_hold" : "structural_failure_preserved",
  semantic_approval: false,
  date: "2026-11-20",
  cwd: repo,
  authorized_write_root: out,
  source: {
    requested_identity: { book: "book9-10g", lesson: "lessongeo910-c2-s1-n42" },
    tool_selectors: seed.source,
    artifact_root: path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts"),
    modern_status_observed: "ready",
    trace: seed.trace,
    selected_concept_blocks: seed.concepts.map((item) => item.block),
    excluded_proof_blocks: [13, 14, 15, 16],
    concept_selection_reason: "Only ordered-basis/coordinate definitions and the four coordinate operation rules relevant to the original exercises. No proof or worked solution was copied into seed concepts.",
  },
  candidate_files: candidateFiles,
  immutable_first_snapshots: {
    seed: "seed.json",
    draft: "draft.json",
    independent_before_options_solution: "task-solutions.md",
    permissions: "0444",
    content_revisions: 0,
    structural_local_corrections: 0,
    note: "First authored seed/draft bytes retained unchanged. There was no structural failure requiring a changed candidate; selector recovery receipts are separate.",
  },
  counts: {
    original_exercises_selected: seed.exercises.length,
    selected_definition_blocks: seed.concepts.length,
    source_figures_in_seed: seed.figures.length,
    questions: draft.questions.length,
    single_questions: draft.questions.filter((q) => q.view.mode === "single").length,
    multiple_questions: draft.questions.filter((q) => q.view.mode === "multiple").length,
    options: draft.questions.reduce((n, q) => n + q.view.options.length, 0),
    coverage_records: draft.coverage.length,
    sources_with_full_mathematical_content_candidates: covered.length,
    sources_with_original_geometric_tasks_held: held.length,
    source_written_subtasks_accounted: 20,
    written_subtasks_represented_in_candidates: 15,
    original_geometric_pair_decisions_held: 4,
    geometric_parameter_tasks_held: 1,
    images_loaded: 4,
    image_batches: 1,
    max_images_per_batch: 8,
    max_images_in_context: 24,
    new_figures: 0,
    paid_calls: 0,
    model_service_calls: 0,
    structural_validator_invocations: 1,
    review_invocations: 0,
  },
  coverage: draft.coverage,
  truth_sets_internal: draft.questions.map((q) => ({
    question_id: q.id,
    mode: q.view.mode,
    correct: q.key.correct,
    option_truths: q.key.rationales.map((r) => ({
      option_id: r.option_id,
      truth: r.truth,
    })),
  })),
  holds: [
    {
      source_numbers: ["4", "5"],
      missing_authority: "The section 20 collinearity condition explicitly referenced by original exercise 4 is absent from permitted current N42 definition prose.",
      independently_resolved_arithmetic: "b=(2/3)a; d=(-3/4)c; the equations a=t b uniquely yield t=x=-5/3 and y=6/5.",
      retained_unknown_task: "Geometric classification of both source 4 pairs and the necessity/sufficiency of the complete source 5 collinearity parameter answer.",
      resumption_input: "Parent-authorized clean current READY definition text for the referenced condition, with source identity; no old key or answer-author material.",
    },
    {
      source_numbers: ["7"],
      missing_authority: "Permitted N42 definition prose does not state a general arbitrary-vector perpendicularity criterion; the perpendicular basis illustration is not that criterion.",
      independently_resolved_arithmetic: "The two original scalar products are exactly 4 and 0; every given vector is nonzero.",
      retained_unknown_task: "Both original perpendicularity decisions remain unkeyed rather than being replaced by arithmetic questions.",
      resumption_input: "Parent-authorized clean current READY definition of the geometric criterion, not a generic convention or answer key.",
    },
  ],
  image_ledger: imageLedger,
  structural_validation: {
    receipt_path: path.join(out, "validation-structure-01.json"),
    command: ["python3", ...argv].join(" "),
    exit_code: validation.status,
    stdout: receipt.stdout,
    stderr: receipt.stderr,
    semantic_review_pending: true,
  },
  isolation_and_boundaries: {
    authoritative_inputs: "Modern original question prose, selected current N42 definitions, referenced actual images, and four source JSON file hashes.",
    learner_facing_subtree: "questions[].view only",
    internal_only: "intent, key, coverage, task-solutions.md, report, receipts, and image ledger",
    answers_read: false,
    answer_author_or_reviewer_outputs_read: false,
    previous_choice_keys_read: false,
    reviews_performed: false,
    peer_contact: false,
    env_files_read_or_written: false,
    database_connections: false,
    git_commands: false,
    dependency_installation: false,
    retainer_run: false,
    core_promotion: false,
    finalization: false,
    publication: false,
    source_edits: false,
    new_figure_generation: false,
    note: "Directory and path metadata were used solely to resolve tool selectors. No independent answer author was contacted or given this author's solutions.",
  },
  handoff: "Author-only offline partial candidate, not approved. No independent review was authorized or run; preserve all HOLD tasks. All option derivations/misconceptions and exact truth sets are internal in draft.json.",
};
jsonNew("report.json", report);
writeNew("report.md", [
  "# N42 Choice Author Report",
  "",
  "Status: author-only partial candidate with explicit source-task HOLD. Not reviewed or approved.",
  "",
  "Current source: READY core `9-10g / geo910-c2-s1-n42`; requested identities were book9-10g / lessongeo910-c2-s1-n42. Directory selectors were resolved without source edits. Failed inspect receipts are preserved.",
  "",
  "All 7 original exercises were explicitly prepared. Selected definition blocks: 0, 5, 7, 9, 10, 11, 12. No proof/worked solution is in seed concepts. Independent arithmetic for every selected task was recorded before options.",
  "",
  "## Candidate",
  "",
  "4 questions: 3 single, 1 native multiple; 18 options. Sources 1, 2, 3 and 6 retain all their mathematical requested results (15 written subparts). Complete tables/results are response units, not individual blanks. Written production is explicitly lost.",
  "",
  "Coverage: all 7 source records; 4 candidate-covered sources; 3 sources on HOLD (5 original geometric subparts/tasks). Sources 4 and 5 require the unavailable section 20 collinearity condition. Source 7 requires the unavailable general perpendicularity criterion. Exact arithmetic is documented, but no geometric key or substitute arithmetic item is manufactured.",
  "",
  "## Immutable First Snapshots",
  "",
  ...candidateFiles.map((file) => `- \`${file.path}\`: file SHA-256 \`${file.file_sha256}\`${file.canonical_sha256 ? `; canonical SHA-256 \`${file.canonical_sha256}\`` : ""}.`),
  "",
  "Seed, draft and pre-option solutions are read-only 0444; zero content revisions. Every option has a derivation, every incorrect option has a reproducible misconception, and each question has a complete internal truth set. Only `view` is learner-facing.",
  "",
  "## Structure Only",
  "",
  `Exit ${validation.status}; validator invoked exactly once, without review.`,
  "",
  "```text",
  receipt.stdout.trim() || "(no stdout)",
  receipt.stderr.trim() || "(no stderr)",
  "```",
  "",
  `Command: \`${["python3", ...argv].join(" ")}\``,
  "",
  `Receipt: \`${path.join(out, "validation-structure-01.json")}\`. No structural correction was necessary; no checker rerun or semantic review was performed.`,
  "",
  "## Image Ledger",
  "",
  "One batch, 4 actual image loads, no crops/reopens (limit 8 per batch / 24 in context). Complete current modern figures 1 and 2 were rendered at 480x400 and viewed alongside their original PNGs. All rightmost/bottommost objects are visible. Figure 1 is selected definition context and used by the coordinate question; figure 2 is lesson context only. Paths, actual hashes and pixel observations are in report.json.",
  "",
  "No new figure, paid/model call, answer read, peer contact, review, retainer, promotion, finalize, DB, environment-file or Git command. All new files remain in the authorized author directory. Independent answer author remains isolated.",
  "",
  "The parent may supply clean authoritative missing definitions and separately authorize affected-task authoring. This handoff is not semantic approval.",
  "",
].join("\n"));
console.log(JSON.stringify({
  report: path.join(out, "report.json"),
  markdown: path.join(out, "report.md"),
  validator_exit: validation.status,
  candidate_files: candidateFiles,
  counts: report.counts,
}, null, 2));
