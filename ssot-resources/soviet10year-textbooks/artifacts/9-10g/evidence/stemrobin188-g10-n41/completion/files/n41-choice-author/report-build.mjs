import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n41-choice-author");
const bookRoot = path.join(repo, "ssot-resources/soviet10year-textbooks/artifacts/9-10g");
const edition = path.join(bookRoot, "editions/modern-us-neutral");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const sorted = value => Array.isArray(value)
  ? value.map(sorted)
  : value && typeof value === "object"
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]))
    : value;
const canonical = value => JSON.stringify(sorted(value))
  .replace(/[^\x00-\x7f]/g, ch => `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`);
const canonicalHash = value => hash(Buffer.from(canonical(value)));
const record = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const write = (name, value) => fs.writeFileSync(path.join(root, name), value, { flag: "wx" });

const seed = read("seed.json");
const draft = read("draft.json");
const firstDraft = read("draft.first.json");
const ledger = read("execution-ledger.json");
const receipt = read("structural-receipt.json");
const counts = {
  selected_sources: seed.exercises.length,
  source_case_tasks: seed.exercises.reduce((sum, ex) => sum + ({ "391": 3, "392": 2, "402": 2 }[ex.number] ?? 1), 0),
  coverage_rows: draft.coverage.length,
  sources_with_questions: draft.coverage.filter(row => row.question_ids.length).length,
  sources_without_questions: draft.coverage.filter(row => !row.question_ids.length).length,
  convention_qualified_sources: ["399", "402"],
  sources_without_explicit_convention_qualification: 12,
  questions: draft.questions.length,
  options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
  single: draft.questions.filter(q => q.view.mode === "single").length,
  multiple: draft.questions.filter(q => q.view.mode === "multiple").length,
  correct_option_records: draft.questions.reduce((sum, q) => sum + q.key.correct.length, 0),
  incorrect_option_records: draft.questions.reduce((sum, q) => sum + q.view.options.length - q.key.correct.length, 0),
  selected_definition_paragraphs: seed.concepts.length,
  selected_seed_figures: seed.figures.length,
  figures_used_in_questions: [...new Set(draft.questions.flatMap(q => q.view.figure_ids))].length,
  new_candidate_figures: draft.new_figures.length,
  image_opens: ledger.image_count,
  image_batches: ledger.image_batches.length,
  inspect_calls: ledger.inspect_calls,
  prepare_calls: ledger.prepare_calls,
  structural_calls: ledger.structural_calls,
  structural_failures: receipt.structural_failures.length,
  semantic_review_calls: ledger.semantic_review_calls,
  author_content_revisions: ledger.author_content_revisions,
  technical_failure_events: ledger.first_failures.length,
  paid_calls: 0,
  network_calls: 0,
  delegates: 0,
  messages: 0,
  application_edits: 0,
  core_writes: 0,
  database_calls: 0,
  publishing_calls: 0
};
const inputFiles = [
  ...seed.trace.map(item => record(path.join(repo, item.path))),
  ...["fig-160", "fig-161"].flatMap(id => [
    record(path.join(bookRoot, `figures/${id}.png`)),
    record(path.join(edition, `figures/${id}.spec.json`)),
    record(path.join(edition, `figures/${id}.svg`))
  ])
];
const imageLedger = [
  { order: 1, figure: "fig-160", role: "original_png", file: path.join(bookRoot, "figures/fig-160.png"), observed: "S above SA/SB/SC; D on SC; A-N-B and S-N-M dashed; N diamond; alpha,beta,gamma; complete source relationships." },
  { order: 2, figure: "fig-160", role: "first_failed_raster", file: path.join(root, "fig-160.current.png"), observed: "Actual open was blank/transparent because CSS var() colors were not resolved by resvg; retained, not treated as a math observation." },
  { order: 3, figure: "fig-161", role: "original_png", file: path.join(bookRoot, "figures/fig-161.png"), observed: "A1-S-A opposite rays; SB/SC; dashed AB; curved AC/BC cut outlines; all original and supplementary labels." },
  { order: 4, figure: "fig-161", role: "first_failed_raster", file: path.join(root, "fig-161.current.png"), observed: "Actual open was blank/transparent because CSS var() colors were not resolved by resvg; retained, not treated as a math observation." },
  { order: 5, figure: "fig-160", role: "current_svg_fallback_color_raster", file: path.join(root, "fig-160.fallback-colors.png"), observed: "Full 480x560 composition inspected; B at right, C/continuation at bottom, Greek labels and N/M readable. Only declared fallback colors resolved in memory." },
  { order: 6, figure: "fig-161", role: "current_svg_fallback_color_raster", file: path.join(root, "fig-161.fallback-colors.png"), observed: "Full 480x600 composition inspected; A1 at top, B at right, C at bottom and both supplementary labels/leaders visible. Only declared fallback colors resolved in memory." }
].map(item => ({ ...item, ...record(item.file), batch: 1, image_open_count: 1 }));

const ownFiles = fs.readdirSync(root)
  .filter(name => !["report.json", "report.md", "delivery-hashes.json"].includes(name))
  .sort().map(name => record(path.join(root, name)));
const snapshotHashes = {
  seed: { ...record(path.join(root, "seed.json")), canonical_sha256: canonicalHash(seed) },
  seed_first: { ...record(path.join(root, "seed.first.json")), canonical_sha256: canonicalHash(read("seed.first.json")) },
  draft: { ...record(path.join(root, "draft.json")), canonical_sha256: canonicalHash(draft) },
  draft_first: { ...record(path.join(root, "draft.first.json")), canonical_sha256: canonicalHash(firstDraft) },
  frozen_derivations: record(path.join(root, "derivations.frozen.md"))
};
const report = {
  schema: "n41-choice-author-report-v1",
  role: "author_only",
  status: "structural_pass_pending_sole_parent_independent_review",
  semantically_approved: false,
  source_convention_alignment_confirmed: false,
  repo,
  output_root: root,
  ticket: "STEMROBIN-188",
  batch: "SAME188-6 offline9-10g",
  lesson: "geo910-c1-s3-n41",
  authorization: {
    outputs_only_below: root,
    independent_reviewer: "sole parent, after author collection",
    reviewer_dispatched: false,
    review_artifact_created: false,
    source_answers_read: false,
    previous_choices_reviews_tests_ticket_outputs_read: false,
    interaction_or_judge_data_inspected: false,
    git_used: false,
    env_read: false,
    database_used: false,
    network_used: false,
    installed_dependencies: false,
    application_edited: false,
    published: false,
    existing_figure_gates_rerun: false
  },
  counts,
  snapshots: snapshotHashes,
  actual_inputs: inputFiles,
  authoritative_modern_text: {
    prose_block_count: 17,
    written_exercise_numbers: seed.exercises.map(ex => ex.number),
    selectors_explicit: true,
    includes_405_or_third_chapter_review: false,
    modern_erratum_authority: "Use current modern text as explicitly authorized; no erratum or former review output was inspected.",
    original_prose_or_answer_sources_read: false
  },
  selected_definitions_projection: seed.concepts,
  selected_seed_figure_projection: seed.figures.map(figure => ({
    ...figure,
    assets: figure.assets.map(asset => ({ ...asset, path: path.join(repo, asset.path) }))
  })),
  question_inventory: draft.questions.map(q => ({
    id: q.id, source_numbers: q.source_numbers, mode: q.view.mode,
    option_count: q.view.options.length, correct_option_count: q.key.correct.length,
    concept_blocks: q.intent.concept_blocks, figure_ids: q.view.figure_ids,
    limitations: q.intent.limitations
  })),
  coverage: draft.coverage,
  unknowns_and_qualifications: [
    {
      source: "399",
      exact_occurrence: "geo910-c1-s3-n41 exercise 399: 与三面角所有的棱的距离相等的全部点的集合",
      unknown: "The supplied N41 definition statements do not specify distance to the edge ray as a set versus distance to its full supporting line.",
      needed_true_extract: "The chapter's actual edge definition and point-to-edge distance convention, explicitly sufficient to decide minimization over t>=0 versus t in R.",
      unavailable_reference: "Preceding lesson ID/paragraph number not supplied and not read; no exact predecessor identifier fabricated.",
      author_action: "Freeze both complete solutions. Draft visibly states ray nearest-point distance and covers the entire ray locus, including exterior negative polar cone and vertex.",
      source_capacity_pending: "If original convention is supporting-line distance, the full four-line locus is not the draft's complete response and needs affected-unit author revision after parent supplies the real definition."
    },
    {
      source: "402",
      exact_occurrence: "geo910-c1-s3-n41 exercise 402 versus lesson.prose[13], [14], [15]",
      unknown: "Exercise omits the word convex; selected surrounding theorem scope explicitly begins with convex multihedral angles.",
      needed_true_extract: "Only if the parent rejects the local convex scope: the chapter's genuine convention deciding whether unqualified multihedral angle includes nonconvex angles in this exercise.",
      author_action: "Draft visibly states convex scope and covers both lists in that scope; does not claim the 360-degree bound for nonconvex angles.",
      source_capacity_pending: "Unrestricted nonconvex realizability of first list is not covered."
    }
  ],
  capacity_loss_policy: "All concrete production losses are recorded in intent.limitations and coverage.omitted_tasks; no selected source has zero questions. This is not a claim of original-convention closure for the two qualified sources.",
  image_ledger: { ...ledger.image_batches[0], items: imageLedger, cumulative_context_opens: 6, context_remaining: 18 },
  structural_receipt: { ...receipt, file: record(path.join(root, "structural-receipt.json")) },
  first_failures: ledger.first_failures,
  author_revision: ledger.author_revision,
  own_artifacts_with_actual_byte_hashes: ownFiles,
  report_paths: {
    json: path.join(root, "report.json"),
    markdown: path.join(root, "report.md"),
    external_byte_hash_binding: path.join(root, "delivery-hashes.json")
  },
  no_self_hash_claim: "report.json and report.md are externally byte-hash-bound by delivery-hashes.json; no circular self-hash is asserted."
};
write("report.json", JSON.stringify(report, null, 2) + "\n");
const reportJson = record(path.join(root, "report.json"));
const summary = [
  "# N41 Choice Author Handoff",
  "",
  "Author only. Structural pass; semantic review and source-convention alignment are not approved.",
  `Exact repo: \`${repo}\``,
  `Only output root: \`${root}\``,
  "",
  "## Snapshot Bindings",
  "",
  ...Object.entries(snapshotHashes).map(([name, value]) => `${name}: \`${value.path}\`\nByte SHA-256: \`${value.sha256}\`${value.canonical_sha256 ? `\nCanonical SHA-256: \`${value.canonical_sha256}\`` : ""}\n`),
  `Report JSON: \`${reportJson.path}\`\nByte SHA-256: \`${reportJson.sha256}\``,
  "",
  "## Counters",
  "",
  `Sources 14 (391-404), printed-case tasks ${counts.source_case_tasks}, coverage rows 14, questions ${counts.questions}, options ${counts.options}; single ${counts.single}, multiple ${counts.multiple}.`,
  `Keyed true alternatives ${counts.correct_option_records}, false alternatives ${counts.incorrect_option_records}. Definitions 7: blocks 0,8,10,12,13,14,15. Seed figures 2; newly authored figures 0.`,
  `Images opened 6 in one batch (limit 8, context limit 24), including 2 retained failed rasters. Reopens 0, crops 0, remaining context image capacity 18.`,
  "Inspect 1, prepare 1, structural validation 1, structural failures 0, author content revisions 1. Semantic reviews 0, delegates/messages/network/paid/install/DB/git/env/application/publish/core writes 0.",
  "",
  "## Source Coverage",
  "",
  "| Source | Question | Coverage | Explicit Losses |",
  "|---|---|---|---|",
  ...draft.coverage.map(row => `| ${row.source_number} | ${row.question_ids.join(", ")} | ${row.reason} | ${row.omitted_tasks.join("；")} |`),
  "",
  "## Qualifications",
  "",
  "399: N41 does not define whether distance to an edge means nearest-point distance to the positive ray or conventional distance to the supporting line. The draft explicitly chooses the former and covers its complete locus, including all exterior polar-cone points and the vertex. Both independent complete solutions are frozen. Needed real extract: the chapter's edge and point-to-edge distance definitions. The predecessor lesson ID/paragraph was not supplied or read and is not invented. Four supporting lines are not claimed as this ray-distance answer.",
  "",
  "402: The question visibly follows the convex scope of prose[13-15]. The original exercise omits convex. Nonconvex first-list realizability is not claimed or covered. If unrestricted scope is intended, parent must provide the genuine scope convention.",
  "",
  "403: First draft supplied phi; retained first snapshot records that loss. The final draft removes the supplied intermediate value and uses exact full angle alternatives, covering both computation and placement. No semantic gate was performed during author revision.",
  "",
  "## Structural Evidence",
  "",
  `\`${receipt.command}\``,
  "",
  "Exit 0. Actual stdout: `mechanical checks passed; semantic review still required`.",
  `Receipt: \`${path.join(root, "structural-receipt.json")}\``,
  "No --review argument, self-review, independent review dispatch, figure quality gate rerun or approval claim.",
  "",
  "## Images and First Failures",
  "",
  ...imageLedger.map(item => `Open ${item.order}, batch 1, ${item.role}: \`${item.path}\`\nSHA-256: \`${item.sha256}\`\n${item.observed}\n`),
  "Failure 1: locator rg exit 2 for two absent candidate dependency directories; third returned the existing installed resvg. No install.",
  "Failure 2: combined spec tool display truncated; recovered by bounded fig-161 source inventory projection only.",
  "Failure 3: original resvg PNGs were blank because CSS variable colors were unresolved. Kept first PNGs, resolved only SVG-declared fallback ink/paper colors in memory, rendered new own PNGs, and opened both. Current promoted SVG/spec hashes unchanged; no diagram was authored or modified.",
  "",
  "## Complete Path and Hash Manifest",
  "",
  "The JSON report contains full exact input paths/hashes, all selected definition paragraphs, seed asset projection, all 14 coverage entries, per-question counts/limitations, image ledger and failure receipts.",
  "",
  ...ownFiles.map(item => `\`${item.path}\`\nSHA-256: \`${item.sha256}\`\n`),
  ...inputFiles.map(item => `Input \`${item.path}\`\nSHA-256: \`${item.sha256}\`\n`),
  `The two report byte hashes are bound externally in \`${path.join(root, "delivery-hashes.json")}\`.`
];
write("report.md", summary.join("\n") + "\n");
const bindings = {
  schema: "n41-choice-author-delivery-hashes-v1",
  role: "author_only",
  seed_canonical_sha256: snapshotHashes.seed.canonical_sha256,
  draft_canonical_sha256: snapshotHashes.draft.canonical_sha256,
  files: [
    ...Object.values(snapshotHashes),
    record(path.join(root, "report.json")),
    record(path.join(root, "report.md")),
    record(path.join(root, "structural-receipt.json")),
    record(path.join(root, "execution-ledger.json"))
  ]
};
write("delivery-hashes.json", JSON.stringify(bindings, null, 2) + "\n");
console.log(JSON.stringify({ counts, snapshots: snapshotHashes, reports: bindings.files.slice(5), delivery_manifest: record(path.join(root, "delivery-hashes.json")) }, null, 2));
