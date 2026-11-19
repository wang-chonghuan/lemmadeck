const fs = require("node:fs");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const first = `${base}/n35-choice-review-FIRST`;
const out = `${base}/n35-choice-review-affected`;
const repaired = `${base}/n35-choice-repaired`;
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  return value;
};
const ascii = (value) => value.replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const canonical = (value) => ascii(JSON.stringify(stable(value)));
const digest = (value) => sha(canonical(value));
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (file, value) => fs.writeFileSync(file, value, { flag: "wx" });
const saveJson = (file, value) => save(file, `${ascii(JSON.stringify(value, null, 2))}\n`);

const projection = load(`${out}/receipts/view-projection.json`);
const freeze = load(`${out}/receipts/view-freeze.json`);
if (sha(fs.readFileSync(freeze.evidence_path)) !== freeze.evidence_raw_sha256) throw new Error("Affected view evidence changed");
if (sha(fs.readFileSync(projection.seed_path)) !== projection.seed_raw_sha256) throw new Error("Repaired seed changed");
if (sha(fs.readFileSync(projection.draft_path)) !== projection.draft_raw_sha256) throw new Error("Repaired draft changed");
for (const item of projection.FIRST_evidence_before) {
  if (sha(fs.readFileSync(item.path)) !== item.raw_sha256) throw new Error("FIRST evidence changed");
}
const seed = load(projection.seed_path);
const draft = load(projection.draft_path);
const oldDraft = load(`${base}/n35-choice-author/draft.json`);
const firstReview = load(`${first}/review.json`);
const visible = load(freeze.evidence_path);
const internalPath = `${out}/affected-internal-comparison.json`;
const compare = load(internalPath);
const original = oldDraft.questions.find((q) => q.id === "n35-q06");
const replacement = draft.questions.find((q) => q.id === "n35-q06");
if (canonical(replacement.key) !== canonical(original.key)) throw new Error("q06 key changed from FIRST");
if (canonical(replacement.source_numbers) !== canonical(["758", "759"])) throw new Error("Wrong merged sources");
if (draft.new_figures.length) throw new Error("Unexpected new figures");
if (digest(seed) !== firstReview.seed_sha256 || digest(draft) !== projection.draft_sha256) throw new Error("Canonical binding mismatch");
for (const item of projection.inherited_whole_question_checks) {
  const q = draft.questions.find((q) => q.id === item.id);
  if (digest(q) !== item.whole_question_canonical_sha256) throw new Error("Inherited question changed");
}
for (const source of oldDraft.coverage.filter((s) => !["758", "759"].includes(s.source_number))) {
  if (canonical(source) !== canonical(draft.coverage.find((s) => s.source_number === source.source_number))) throw new Error("Unaffected coverage changed");
}

const q06 = structuredClone(visible.q06_review);
q06.task_fidelity.evidence += ` Repaired author-intent/loss comparison: ${compare.q06_intent.evidence}`;
q06.redundancy.evidence += ` Affected package comparison: ${compare.package_relationships.evidence}`;
q06.mathematics.independent_solution += " All six option truths and the complete set were frozen before repaired author internals were disclosed; the unchanged author key agrees.";
for (const check of q06.mathematics.option_checks) {
  const reasoning = compare.option_rationale_comparisons.find((r) => r.option_id === check.option_id);
  const key = replacement.key.rationales.find((r) => r.option_id === check.option_id);
  if (!reasoning || reasoning.verdict !== "pass" || key.truth !== check.truth) throw new Error("Incomplete affected rationale comparison");
  check.evidence += ` Repaired author derivation/misconception comparison: ${reasoning.evidence}`;
}
if (canonical(q06.mathematics.correct) !== canonical(replacement.key.correct)) throw new Error("Independent true set disagrees; never normalize");
const questionReviews = draft.questions.map((q) => q.id === "n35-q06"
  ? q06
  : structuredClone(firstReview.question_reviews.find((r) => r.question_id === q.id)));
const sourceReviews = firstReview.source_reviews.map((source) => {
  const item = structuredClone(source);
  const affected = compare.coverage_reviews.find((row) => row.source_number === source.source_number);
  if (affected) item.coverage = structuredClone(affected.coverage);
  return item;
});
const figureChecks = structuredClone(firstReview.figure_checks);
const attributionOld = "Direct human authorization permitted this single recovery inspection";
const attributionNew = "Preview recovery was delegated by the parent under the standing human production scope, not a new direct human message; that delegated recovery permitted this single inspection";
for (const check of figureChecks) {
  if (sha(fs.readFileSync(check.asset_path)) !== check.asset_sha256) throw new Error("Source SVG changed");
  if (!check.observation.includes(attributionOld)) throw new Error("Expected FIRST attribution text missing");
  check.observation = check.observation.replace(attributionOld, attributionNew);
  check.observation += " This affected review inherits the existing successful observation without reopening the image; the attribution correction does not change visual findings or hashes.";
}
const verdicts = [
  ...sourceReviews.map((s) => s.coverage.verdict),
  ...questionReviews.flatMap((q) => [q.task_fidelity.verdict, q.redundancy.verdict, q.answer_leakage.verdict, q.mathematics.verdict])
];
const outcome = verdicts.includes("blocked") ? "blocked" : verdicts.includes("revise") ? "revise" : "pass";
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: {
    kind: "independent_agent",
    identity: "Same separate STEMROBIN-182 n35 independent FIRST reviewer; affected-only review of the parent-repaired candidate, not its author. Nine unchanged passes and prior source/image evidence inherited."
  },
  source_reviews: sourceReviews,
  figure_checks: figureChecks,
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome
};
const reviewPath = `${out}/review.json`;
saveJson(reviewPath, stable(review));
const inherited = questionReviews.filter((q) => q.question_id !== "n35-q06").map((q) => {
  const prior = firstReview.question_reviews.find((r) => r.question_id === q.question_id);
  if (canonical(q) !== canonical(prior)) throw new Error("Inherited review record altered");
  return { question_id: q.question_id, review_record_sha256: digest(q), copied_verbatim: true };
});
const totalOptions = questionReviews.reduce((sum, q) => sum + q.mathematics.option_checks.length, 0);
const trueOptions = questionReviews.reduce((sum, q) => sum + q.mathematics.correct.length, 0);
if (questionReviews.length !== 10 || inherited.length !== 9 || totalOptions !== 48 || trueOptions !== 17) throw new Error("Final counts mismatch");
const provenance = {
  stage: "affected-final-review-assembled-after-view-freeze",
  time: new Date().toISOString(),
  cwd: root,
  source_review_path: `${first}/review.json`,
  source_review_raw_sha256: sha(fs.readFileSync(`${first}/review.json`)),
  draft_path: projection.draft_path,
  draft_sha256: review.draft_sha256,
  review_path: reviewPath,
  review_sha256: digest(review),
  view_freeze_path: `${out}/receipts/view-freeze.json`,
  internal_comparison_path: internalPath,
  internal_comparison_raw_sha256: sha(fs.readFileSync(internalPath)),
  inherited_question_reviews: inherited,
  independent_source_solutions_copied_verbatim: sourceReviews.map((s) => ({
    source_number: s.source_number,
    copied_verbatim: s.independent_solution === firstReview.source_reviews.find((r) => r.source_number === s.source_number).independent_solution
  })),
  source_coverage_replaced: ["758", "759"],
  source_coverage_inherited: ["754", "755", "756", "757", "760"],
  image_evidence: "Inherited successful FIRST fig-54 observation; source SVG hash rechecked only, zero new image loads. Attribution corrected to parent-delegated standing human production scope.",
  question_count: questionReviews.length,
  option_count: totalOptions,
  inherited_option_checks: totalOptions - q06.mathematics.option_checks.length,
  affected_option_checks: q06.mathematics.option_checks.length,
  source_tasks: 36,
  removed_question_ids: ["n35-q09"],
  historical_q09_mentions_in_inherited_records: "These refer to immutable FIRST context only. No q09 question or review record is in the repaired final package.",
  outcome
};
saveJson(`${out}/receipts/inheritance-and-comparison.json`, provenance);
for (const file of [internalPath, reviewPath, `${out}/receipts/inheritance-and-comparison.json`]) fs.chmodSync(file, 0o444);

const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", projection.seed_path,
  "--draft", projection.draft_path,
  "--review", reviewPath
];
saveJson(`${out}/receipts/FIRST-validate.start.json`, {
  time: new Date().toISOString(),
  cwd: root,
  executable: "python3",
  args,
  invocation: "One real FIRST --review against repaired snapshot; original FIRST revise is not rerun.",
  bytecode_writes_disabled: true,
  review_raw_sha256: sha(fs.readFileSync(reviewPath))
});
const started = Date.now();
const result = spawnSync("python3", args, {
  cwd: root,
  maxBuffer: 8 * 1024 * 1024,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
});
const stdout = result.stdout || Buffer.alloc(0);
const stderr = result.stderr || Buffer.alloc(0);
save(`${out}/receipts/FIRST-validate.stdout`, stdout);
save(`${out}/receipts/FIRST-validate.stderr`, stderr);
save(`${out}/receipts/FIRST-validate.exit`, `${result.status === null ? "null" : result.status}\n`);
const validation = {
  time: new Date().toISOString(),
  cwd: root,
  executable: "python3",
  args,
  exit_code: result.status,
  signal: result.signal,
  execution_error: result.error ? result.error.message : null,
  elapsed_ms: Date.now() - started,
  stdout_path: `${out}/receipts/FIRST-validate.stdout`,
  stdout_sha256: sha(stdout),
  stderr_path: `${out}/receipts/FIRST-validate.stderr`,
  stderr_sha256: sha(stderr),
  named_validator_invocations: 1,
  declared_review_outcome: outcome,
  real_pass: outcome === "pass" && result.status === 0,
  no_publisher_or_retention_invoked: true
};
saveJson(`${out}/receipts/FIRST-validate.receipt.json`, validation);
const firstIntegrity = projection.FIRST_evidence_before.map((item) => ({
  ...item,
  after_sha256: sha(fs.readFileSync(item.path)),
  unchanged: sha(fs.readFileSync(item.path)) === item.raw_sha256
}));
if (firstIntegrity.some((item) => !item.unchanged)) throw new Error("FIRST evidence changed");
saveJson(`${out}/receipts/FIRST-preservation.json`, { time: new Date().toISOString(), cwd: root, files: firstIntegrity, immutable_FIRST_preserved: true });

const md = [
  "# STEMROBIN-182 n35 Affected Choice Review",
  "",
  `Outcome: **${outcome}**. Actual named-validator FIRST exit against the repaired snapshot: **${result.status}**. Real pass: **${validation.real_pass}**.`,
  "",
  "## Scope And Clarification",
  "",
  `Sole cwd: \`${root}\`. Output ownership: \`${out}/\`.`,
  "Affected-only review: replacement q06, removed q09 and resulting package/758/759 relationships. Nine unchanged whole-question objects and their review records are inherited, not re-reviewed. All seven independent source solutions and successful source-image observations are reused. Zero new image loads or figures; no network, .env, DB, app, Git, publishing, answer files, source/draft edits or cap3.",
  "",
  "FIRST's 'direct human-authorized' preview-recovery attribution was inaccurate. That recovery was delegated by the parent under the standing human production scope, not authorized by a new direct human message. FIRST is immutable and unchanged. This affected record corrects attribution only; it does not invent a new authorization or new visual observation.",
  "",
  "## Order And Snapshots",
  "",
  `- View-only projection: ${projection.time}; raw SHA-256 \`${projection.projection_raw_sha256}\`.`,
  `- Affected fidelity/redundancy/leakage, removal and all six independent option checks frozen before repaired internals: ${freeze.time}; evidence SHA-256 \`${freeze.evidence_raw_sha256}\`.`,
  "- Prior source mathematics and prior key knowledge were honestly inherited; this is not claimed to be a new blind full-source review.",
  `- Repaired seed is byte-identical to original; canonical SHA-256 \`${review.seed_sha256}\`.`,
  `- Repaired draft canonical SHA-256 \`${review.draft_sha256}\`.`,
  `- Final review canonical SHA-256 \`${digest(review)}\`.`,
  `- Existing source SVG SHA-256 \`${figureChecks[0].asset_sha256}\`, rehashed without opening. Successful prior full-preview PNG hash remains \`8c039a4a34d3a0907232252da287db8f395b402ce4d070769c947fc4cb587a49\`.`,
  "- Final package: 10 questions, 48 options, 6 single / 4 multiple; 9 unchanged passes cover 42 options, and replacement q06 covers 6. All 36 source tasks remain accounted for.",
  "",
  "## Replacement q06",
  "",
  `Task fidelity **${q06.task_fidelity.verdict}**: ${q06.task_fidelity.evidence}`,
  "",
  `Redundancy **${q06.redundancy.verdict}**: ${q06.redundancy.evidence}`,
  "",
  `Answer leakage **${q06.answer_leakage.verdict}**: ${q06.answer_leakage.evidence}`,
  "",
  `Mathematics **${q06.mathematics.verdict}**; independent complete true set **${q06.mathematics.correct.join(", ")}**.`,
  "",
  q06.mathematics.independent_solution,
  ""
];
for (const check of q06.mathematics.option_checks) md.push(`- **${check.option_id}: ${check.truth}.** ${check.evidence}`);
md.push("", "## Removed q09 And Package", "", visible.removed_q09.evidence, "", compare.package_relationships.evidence, "", "The merge judges a single graph-to-equation/inequality relationship. It does not claim independent execution of both written methods. Losses of graph guides/construction, graphical explanation and independent algebraic derivation/writing are explicitly retained. Finite-pixel observations and exact algebra/global-domain proofs remain separate.", "", "## Coverage 758 And 759", "");
for (const row of compare.coverage_reviews) md.push(`- **${row.source_number}: ${row.coverage.verdict}.** ${row.coverage.evidence}`);
md.push("", "## Inherited Question Passes", "", "| Question | Complete True Set | Option Checks | Inheritance |", "| --- | --- | --- | --- |");
for (const q of questionReviews.filter((q) => q.question_id !== "n35-q06")) md.push(`| ${q.question_id} | ${q.mathematics.correct.join(", ")} | ${q.mathematics.option_checks.length} | FIRST record copied verbatim; whole draft question unchanged |`);
md.push("", "Historical q09 references inside these verbatim inherited records refer to FIRST context only. The final question/review lists contain no q09; the affected package check above explicitly verifies its removal.", "", "## Inherited Source And Figure Evidence", "");
for (const s of sourceReviews) md.push(`- Source ${s.source_number}: independent solution copied verbatim; coverage ${["758", "759"].includes(s.source_number) ? "replaced by affected check" : "FIRST pass copied verbatim"}.`);
md.push("", figureChecks[0].observation, "", "No crop, alternate preview, screenshot or passed-image reopen was performed in this affected review. Exact numerical/squared-coordinate calculations remain algebraic reference evidence, not visual proof of precision.", "", "## Named Validation Once", "", "```bash", `python3 ${args.join(" ")}`, "```", "", `Actual exit: **${result.status}**. Invocations: **1**.`, "", "stdout:", "```text", stdout.length ? stdout.toString("utf8").trimEnd() : "(empty)", "```", "", "stderr:", "```text", stderr.length ? stderr.toString("utf8").trimEnd() : "(empty)", "```", "", `Raw receipt: \`${out}/receipts/FIRST-validate.receipt.json\`. Raw stdout/stderr and exit are preserved in that directory.`, "", "Structural success binds and checks the declared semantic review; it does not automatically prove purpose, image interpretation or mathematics.", "", "## Handoff", "", "Original FIRST outcome remains revise with its real exit 3 and immutable evidence. All recorded FIRST hashes match before/after this affected run. Repaired seed/draft were not modified. Parent-owned retention is permissible only upon the real pass above; this reviewer did not retain, publish or integrate content.", "");
save(`${out}/review.md`, `${md.join("\n")}\n`);
saveJson(`${out}/receipts/handoff.json`, {
  cwd: root,
  review_json: reviewPath,
  review_md: `${out}/review.md`,
  outcome,
  validation_exit: result.status,
  real_pass: validation.real_pass,
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  inherited_question_passes: 9,
  changed_question: "n35-q06",
  removed_question: "n35-q09",
  source_tasks: 36,
  questions: 10,
  options: 48,
  new_image_loads: 0,
  FIRST_preserved: true,
  repaired_seed_draft_unchanged: sha(fs.readFileSync(projection.seed_path)) === projection.seed_raw_sha256 && sha(fs.readFileSync(projection.draft_path)) === projection.draft_raw_sha256,
  attribution_corrected_without_new_authorization: true,
  parent_retention_not_performed: true
});
for (const file of [
  `${out}/review.md`,
  ...fs.readdirSync(`${out}/receipts`).map((file) => `${out}/receipts/${file}`)
]) fs.chmodSync(file, 0o444);
console.log(JSON.stringify({ outcome, real_pass: validation.real_pass, validation, review: reviewPath, inherited_questions: inherited.length, questions: questionReviews.length, options: totalOptions, FIRST_preserved: true, new_image_loads: 0 }, null, 2));
process.exit(result.status === null ? 1 : result.status);
