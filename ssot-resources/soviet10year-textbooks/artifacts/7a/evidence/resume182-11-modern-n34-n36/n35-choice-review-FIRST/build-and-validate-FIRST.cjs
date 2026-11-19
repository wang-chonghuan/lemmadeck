const fs = require("node:fs");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const out = `${base}/n35-choice-review-FIRST`;
const seedPath = `${base}/n35-choice-author/seed.json`;
const draftPath = `${base}/n35-choice-author/draft.json`;
const reviewPath = `${out}/review.json`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  return value;
};
const ascii = (str) => str.replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const digest = (value) => sha(ascii(JSON.stringify(stable(value))));
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, data) => fs.writeFileSync(file, data, { flag: "wx" });
const saveJson = (file, value) => save(file, `${ascii(JSON.stringify(value, null, 2))}\n`);

const preopen = load(`${out}/asset-before-open-FIRST.json`);
const sourceReceipt = load(`${out}/source-freeze-FIRST.json`);
const projectionReceipt = load(`${out}/view-projection-FIRST.json`);
const viewReceipt = load(`${out}/view-freeze-FIRST.json`);
for (const item of viewReceipt.evidence) {
  if (sha(fs.readFileSync(item.path)) !== item.raw_sha256) throw new Error("Frozen view/recovery evidence changed");
}
if (sha(fs.readFileSync(sourceReceipt.evidence_path)) !== sourceReceipt.evidence_raw_sha256) throw new Error("Source evidence changed");
if (sha(fs.readFileSync(seedPath)) !== preopen.seed_raw_sha256) throw new Error("Seed changed");
if (sha(fs.readFileSync(draftPath)) !== projectionReceipt.draft_raw_sha256) throw new Error("Draft changed");
const seed = load(seedPath);
const draft = load(draftPath);
const source = load(sourceReceipt.evidence_path);
const recovery = load(`${out}/source-image-recovery.json`);
const visible = load(`${out}/view-review-FIRST.json`);
const internalPath = `${out}/internal-comparison-FIRST.json`;
const internal = load(internalPath);
const asset = recovery.asset_check;
if (sha(fs.readFileSync(asset.asset_path)) !== asset.asset_sha256) throw new Error("Seed SVG changed");
if (sha(fs.readFileSync(asset.preview_svg_path)) !== asset.asset_sha256) throw new Error("Preview SVG changed");
if (sha(fs.readFileSync(asset.preview_png_path)) !== asset.preview_png_sha256) throw new Error("Preview PNG changed");
if (draft.new_figures.length) throw new Error("Unexpected new figure");
if (digest(seed) !== preopen.seed_sha256 || digest(draft) !== projectionReceipt.draft_sha256) throw new Error("Canonical snapshot mismatch");

const questions = structuredClone(visible.question_reviews);
let optionsChecked = 0;
let correctOptions = 0;
for (const question of questions) {
  const original = draft.questions.find((q) => q.id === question.question_id);
  const compare = internal.question_comparisons.find((q) => q.question_id === question.question_id);
  if (!original || !compare) throw new Error("Missing author comparison");
  if (JSON.stringify(question.mathematics.correct.slice().sort()) !== JSON.stringify(original.key.correct.slice().sort())) {
    throw new Error("Unexpected key disagreement: retain independent truth, do not normalize");
  }
  question.task_fidelity.evidence += ` Author-intent comparison: ${compare.intent_evidence}`;
  for (const check of question.mathematics.option_checks) {
    const author = original.key.rationales.find((r) => r.option_id === check.option_id);
    const rationale = compare.rationale_checks.find((r) => r.option_id === check.option_id);
    if (!author || author.truth !== check.truth || !rationale || rationale.verdict !== "pass") throw new Error("Incomplete rationale comparison");
    check.evidence += ` Author derivation/misconception comparison: ${rationale.evidence}`;
    optionsChecked += 1;
    if (check.truth === "correct") correctOptions += 1;
  }
  question.mathematics.independent_solution += " Complete true set and every option truth were frozen before author disclosure; the author's key and per-option truth agree.";
}
if (questions.length !== 11 || optionsChecked !== 52 || correctOptions !== 18) throw new Error("Incomplete review count");
const sources = source.source_reviews.map((item) => {
  const cover = internal.source_coverage.find((row) => row.source_number === item.source_number);
  if (!cover) throw new Error("Missing source coverage review");
  const correctedVisual = recovery.affected_source_reviews.find((row) => row.source_number === item.source_number);
  const independent = correctedVisual
    ? `${item.independent_solution} The preceding visual blocker records the immutable first conversion fault, not the final verdict. Authorized affected-only image recovery: ${correctedVisual.independent_solution}`
    : item.independent_solution;
  return { source_number: item.source_number, independent_solution: independent, coverage: cover.coverage };
});
const verdicts = [
  ...sources.map((item) => item.coverage.verdict),
  ...questions.flatMap((q) => [q.task_fidelity.verdict, q.redundancy.verdict, q.answer_leakage.verdict, q.mathematics.verdict])
];
const outcome = verdicts.includes("blocked") ? "blocked" : verdicts.includes("revise") ? "revise" : "pass";
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: { kind: internal.reviewer_kind, identity: internal.reviewer_identity },
  source_reviews: sources,
  figure_checks: [{
    figure_id: asset.figure_id,
    asset_path: asset.asset_path,
    asset_sha256: asset.asset_sha256,
    observation: `${asset.observation} Viewed existing complete 640x360 browser PNG ${asset.preview_png_path}, SHA-256 ${asset.preview_png_sha256}, after proving its sibling SVG byte-identical to this seed asset. The prior bare-resvg PNG SHA-256 ${preopen.converted_png_sha256} was unreadable; original fault evidence retained. Direct human authorization permitted this single recovery inspection, for two total image loads (one failed, one successful), no crops, passed-image reopens or table images. Visual tenths/near-crossing observations are separate from exact algebraic reference values and global monotonicity proofs.`
  }],
  new_figure_reviews: [],
  question_reviews: questions,
  outcome
};
saveJson(reviewPath, stable(review));
fs.chmodSync(internalPath, 0o444);
fs.chmodSync(reviewPath, 0o444);
saveJson(`${out}/comparison-freeze-FIRST.json`, {
  stage: "3-complete-canonical-review-before-validator",
  time: new Date().toISOString(),
  cwd: root,
  internal_comparison_path: internalPath,
  internal_comparison_raw_sha256: sha(fs.readFileSync(internalPath)),
  review_path: reviewPath,
  review_raw_sha256: sha(fs.readFileSync(reviewPath)),
  review_sha256: digest(review),
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  source_tasks: 36,
  question_count: questions.length,
  option_count: optionsChecked,
  correct_options: correctOptions,
  false_options: optionsChecked - correctOptions,
  outcome,
  source_and_draft_unmodified: true,
  no_new_figures: true
});

const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", seedPath,
  "--draft", draftPath,
  "--review", reviewPath
];
const startPath = `${out}/FIRST-validate.start.json`;
saveJson(startPath, {
  time: new Date().toISOString(),
  cwd: root,
  executable: "python3",
  args,
  named_script: ".agents/skills/ld-s10y-choice/scripts/validate.py",
  attempt: "real FIRST --review; run exactly once",
  review_raw_sha256: sha(fs.readFileSync(reviewPath))
});
const started = Date.now();
const result = spawnSync("python3", args, { cwd: root, maxBuffer: 8 * 1024 * 1024 });
const stdoutPath = `${out}/FIRST-validate.stdout`;
const stderrPath = `${out}/FIRST-validate.stderr`;
save(stdoutPath, result.stdout || Buffer.alloc(0));
save(stderrPath, result.stderr || Buffer.alloc(0));
save(`${out}/FIRST-validate.exit`, `${result.status === null ? "null" : result.status}\n`);
const receipt = {
  time: new Date().toISOString(),
  cwd: root,
  executable: "python3",
  args,
  elapsed_ms: Date.now() - started,
  exit_code: result.status,
  signal: result.signal,
  execution_error: result.error ? result.error.message : null,
  stdout_path: stdoutPath,
  stdout_sha256: sha(result.stdout || Buffer.alloc(0)),
  stderr_path: stderrPath,
  stderr_sha256: sha(result.stderr || Buffer.alloc(0)),
  review_outcome: outcome,
  semantic_approval: false,
  named_validator_invocations: 1
};
saveJson(`${out}/FIRST-validate.receipt.json`, receipt);

const md = [
  "# STEMROBIN-182 n35 Independent Choice Gate FIRST",
  "",
  `Outcome: **${outcome}**. All 11 keys and 52 option truths agree; no mathematical key repair or normalization was made.`,
  "",
  "## Findings",
  "",
  "- **Revise q06/q09: duplicate complete results and cross-question answer reuse.** q09 C's {4},(4,+infinity),[0,4) is q06 A/B/D verbatim in graph language. q06 above-line alternatives expose only threshold 4, allowing q09 to be answered by matching; then q09 supplies q06's full true set. The original 758 graph explanation and 759c algebraic solving are distinct methods, but these visible units assess the same exposed result recognition. Author acknowledgment of original repetition does not remove the cue.",
  "- **Affected coverage: 758 and 759.** All source tasks are present and production losses are explicitly declared, but the two methods are not independently assessed. Repair only the implicated units and their source/package relationships; do not delete an original task silently or force an 11-question quota.",
  "- **No remaining image blocker.** The first bare-resvg result was unreadable, retained as a technical fault. The direct human-authorized single existing-preview recovery succeeded. No passed review was repeated and no source was changed.",
  "",
  "## Scope And Order",
  "",
  `Sole cwd for every command: \`${root}\`. Owned output directory: \`${out}/\`.`,
  "Offline only: no network, .env, DB, app, Git, publishing, answer files, other ticket history, cap3, source/draft edits or new figures.",
  "Independent reviewer is a separate review assignment from the author, not a self-review.",
  "",
  `1. Source prose/definitions and all 36 independent algebraic reference tasks frozen at ${sourceReceipt.time}, before any draft view: source evidence raw SHA-256 \`${sourceReceipt.evidence_raw_sha256}\`. Initial visual failure was recorded honestly, not guessed.`,
  `2. Only {id,view} disclosed at ${projectionReceipt.time}; projection raw SHA-256 \`${projectionReceipt.projection_raw_sha256}\`. Recovery of the previously blocked source image followed the latest direct human authorization; pre-disclosure algebraic results remained immutable.`,
  `3. Fidelity/redundancy/leakage and every independent true set/option frozen at ${viewReceipt.time}, before author intent/key/rationales/coverage were disclosed. View evidence raw SHA-256 \`${viewReceipt.evidence[0].raw_sha256}\`.`,
  "4. Full draft internals compared only after those freezes. Every stated mistaken procedure and correct derivation was checked below; the review remains bound to the original candidate.",
  "",
  "## Snapshots",
  "",
  `- Seed canonical SHA-256: \`${review.seed_sha256}\`.`,
  `- Draft canonical SHA-256: \`${review.draft_sha256}\`.`,
  `- Actual source SVG SHA-256: \`${asset.asset_sha256}\`; sibling preview SVG byte equality established before recovery open.`,
  `- Failed full resvg PNG SHA-256: \`${preopen.converted_png_sha256}\`; one open, unreadable black canvas, evidence retained.`,
  `- Existing complete browser PNG SHA-256: \`${asset.preview_png_sha256}\`; 640x360, one authorized recovery open.`,
  "- Total images: 2 (1 failed conversion + 1 recovery). No crops, reopens of a passed image, table images or new figures.",
  "",
  "## Actual Figure And Precision",
  "",
  asset.observation,
  "",
  "Observed forward readings: approximately 1.6,2.35,2.9 at x=2.5,5.5,8.4. Observed inverse readings: approximately 1.4,2.9,6.2-6.3 at y=1.2,1.7,2.5. Tenths are suitable approximate response candidates, not exact pixel measurements. The complete tuple distinguishes the best fit; 2.3 versus 2.4 alone is not presented as high-precision graphical proof.",
  "",
  "Exact roots and x=1.44,2.89,6.25 were computed algebraically before draft disclosure; they are not attributed to image observation. The finite curve's crossing is near (4,2); sqrt(4)=2 fixes it exactly by formula, and global strict monotonicity extends x>4 beyond the visible window. Graph-reading, graph-production and written-proof losses are separate: choices do not establish independent guides, estimates, graphical explanations or construction of a complete graph.",
  "",
  "## Definitions",
  ""
];
for (const [block, evidence] of Object.entries(source.definitions)) md.push(`- Block ${block}: ${evidence}`);
md.push("", "## All 36 Source Tasks", "");
for (const item of sources) {
  const inventory = source.source_reviews.find((row) => row.source_number === item.source_number);
  md.push(`### ${item.source_number} (${inventory.tasks.length} tasks)`, "", item.independent_solution, "", `Coverage **${item.coverage.verdict}**: ${item.coverage.evidence}`, "");
  for (const task of inventory.tasks) md.push(`- \`${task.id}\`: ${task.result || task.algebraic_reference}${task.visual_status ? " (original visual blocker recovered separately; formula reference is not visual proof)" : ""}.`);
  const declaration = draft.coverage.find((row) => row.source_number === item.source_number);
  md.push("", `Author mapping: ${declaration.question_ids.join(", ")}.`, `Author reason: ${declaration.reason}`, "Recorded production losses:");
  for (const loss of declaration.omitted_tasks) md.push(`- ${loss}`);
  md.push("");
}
md.push("## Every Question And Option", "");
for (const question of questions) {
  const authored = draft.questions.find((q) => q.id === question.question_id);
  md.push(`### ${question.question_id}`, "", `Independent complete true set: **${question.mathematics.correct.join(", ")}**. Author key: ${authored.key.correct.join(", ")}. Mathematics: **${question.mathematics.verdict}**.`, "", `Task fidelity **${question.task_fidelity.verdict}**: ${question.task_fidelity.evidence}`, "", `Redundancy **${question.redundancy.verdict}**: ${question.redundancy.evidence}`, "", `Answer leakage **${question.answer_leakage.verdict}**: ${question.answer_leakage.evidence}`, "", question.mathematics.independent_solution, "");
  for (const check of question.mathematics.option_checks) md.push(`- **${check.option_id}: ${check.truth}.** ${check.evidence}`);
  md.push("", "Author's concrete limitations:");
  for (const loss of authored.intent.limitations) md.push(`- ${loss}`);
  md.push("");
}
md.push("## Named Validation FIRST", "", "```bash", `python3 ${args.join(" ")}`, "```", "", `Actual FIRST exit: **${receipt.exit_code}**. Named validator invocations: 1. This is not a passing semantic gate.`, "", `Raw stdout: \`${stdoutPath}\`, SHA-256 \`${receipt.stdout_sha256}\`.`, `Raw stderr: \`${stderrPath}\`, SHA-256 \`${receipt.stderr_sha256}\`.`, "", "stdout:", "```text", result.stdout && result.stdout.length ? result.stdout.toString("utf8").trimEnd() : "(empty)", "```", "", "stderr:", "```text", result.stderr && result.stderr.length ? result.stderr.toString("utf8").trimEnd() : "(empty)", "```", "", "The checker verifies structure/snapshot/reference consistency and honors this declared nonpassing review; it is not automatic mathematical, visual or learning-purpose proof.", "", "## Handoff", "", internal.repair_scope, "", "Source, draft and source assets were rehashed and left unchanged. FIRST records remain retained; no downstream publication or integration was attempted.", "");
save(`${out}/review.md`, `${md.join("\n")}\n`);
saveJson(`${out}/handoff-FIRST.json`, {
  cwd: root,
  review_json: reviewPath,
  review_md: `${out}/review.md`,
  outcome,
  validation_exit: result.status,
  validation_receipt: `${out}/FIRST-validate.receipt.json`,
  affected_questions: ["n35-q06", "n35-q09"],
  affected_source_coverage: ["758", "759"],
  all_11_keys_agree: true,
  source_tasks: 36,
  options: 52,
  image_total: 2,
  source_and_draft_unmodified: sha(fs.readFileSync(seedPath)) === preopen.seed_raw_sha256 && sha(fs.readFileSync(draftPath)) === projectionReceipt.draft_raw_sha256,
  reviewer_available_for_affected_only_review: true
});
for (const file of [
  `${out}/comparison-freeze-FIRST.json`, startPath, stdoutPath, stderrPath,
  `${out}/FIRST-validate.exit`, `${out}/FIRST-validate.receipt.json`,
  `${out}/review.md`, `${out}/handoff-FIRST.json`
]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ review: reviewPath, outcome, validation: receipt, questions: questions.length, options: optionsChecked, correctOptions, sourceTasks: 36 }, null, 2));
process.exit(result.status === null ? 1 : result.status);
