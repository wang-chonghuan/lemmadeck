import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp");
const out = path.join(tmp, "n46-answer-symbol-affected-review-01");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const input = (relative) => read(path.join(tmp, relative));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const ascii = (text) => text.replace(/[\u007f-\uffff]/g, (c) =>
  `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
}
const canonical = (value) => sha(ascii(JSON.stringify(sorted(value))));
const same = (a, b) => canonical(a) === canonical(b);
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, raw_sha256: sha(bytes), bytes: bytes.length };
};
function save(name, value) {
  fs.writeFileSync(path.join(out, name), `${ascii(JSON.stringify(value, null, 2))}\n`, { flag: "wx" });
}
function requireFact(condition, message) {
  if (!condition) throw new Error(message);
}
function delta(before, after, pointer = "") {
  if (same(before ?? null, after ?? null)) return [];
  if (before && after && typeof before === "object" && typeof after === "object") {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .flatMap((key) => delta(before[key], after[key], `${pointer}/${key}`));
  }
  return [{ pointer, before, after }];
}
const reviewer = { kind: "independent_agent", identity: "SAME188-6 sole independent affected reviewer and FIRST source173174 reviewer" };
const primaryPath = path.join(tmp, "n46-symbol-affected-review-inputs-01/manifest.json");
const manifest = read(primaryPath);
const sourceManifest = read(manifest.sourceFirstReview.path);
const beforeBindings = input("n46-answer-symbol-affected-review-01/bindings-before.json");
const afterBindings = input("n46-answer-symbol-affected-review-01/bindings-after.json");
requireFact(afterBindings.expected_mismatch_count === 0 && afterBindings.changed_since_before_count === 0,
  "Actual supplied snapshot must remain bound.");

const oldSeedPath = path.join(tmp, "n46-choice-author/seed.json");
const oldDraftPath = path.join(tmp, "n46-choice-author/draft.json");
const oldSeed = read(oldSeedPath);
const oldDraft = read(oldDraftPath);
const seed = read(manifest.choice.seed.path);
const draft = read(manifest.choice.draft.path);
const inheritedChoice = read(manifest.choice.inheritedReview.path);
const priorRoot = path.join(tmp, "n46-answer-choice-display-source-review-01");
const oldAnswerReviewPath = path.join(priorRoot, "answer-review.json");
const oldAnswerReview = read(oldAnswerReviewPath);
const conventionPath = path.join(priorRoot, "convention-review.json");
const convention = read(conventionPath);
const oldVisual = read(manifest.visual.inheritedReview.path);
const oldIndex = read(path.join(priorRoot, "output-index.json"));
const repair = input("n46-answer-symbol-repair-01/repair.json");
const oldAnswerPath = path.join(tmp, "n46-answer-symbol-repair-01/before/answer-keys.json");
const oldAnswer = read(oldAnswerPath);
const answer = read(manifest.answerCandidate.path);
const modernDirectory = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n46");
const modern = read(path.join(modernDirectory, "exercises.json"));
const oldModern = input("n46-answer-symbol-repair-01/before/modern/exercises.json");
const lesson = read(path.join(modernDirectory, "lesson.json"));
const seedDelta = delta(oldSeed, seed);
const draftDelta = delta(oldDraft, draft);
const modernDelta = delta(oldModern, modern);
const answerDelta = delta(oldAnswer, answer);
requireFact(same(seedDelta.map((x) => x.pointer), ["/exercises/2/text", "/trace/2/sha256"]), "Unexpected seed delta.");
requireFact(same(draftDelta.map((x) => x.pointer), ["/seed_sha256"]), "Unexpected draft delta.");
requireFact(same(modernDelta.map((x) => x.pointer), ["/exercises/2/text", "/exercises/2/lines/0"]), "Unexpected modern delta.");
requireFact(same(answerDelta.map((x) => x.pointer), ["/answers/2/displayAnswer", "/answers/2/notes"]), "Unexpected answer delta.");
requireFact(oldSeed.exercises[2].text.replace("36*.", "36*") === seed.exercises[2].text, "Prefix change is not exact.");
requireFact(oldModern.exercises[2].text.replace("36*.", "36*") === modern.exercises[2].text, "Modern prefix change is not exact.");
requireFact(same(oldDraft.questions, draft.questions) && same(oldDraft.coverage, draft.coverage) &&
  same(oldDraft.new_figures, draft.new_figures), "Question or coverage content changed.");
requireFact(canonical(oldSeed) === inheritedChoice.seed_sha256 &&
  canonical(oldDraft) === inheritedChoice.draft_sha256, "Inherited review binding does not match original reviewed files.");
requireFact(canonical(seed) === manifest.choice.seedSha256 &&
  canonical(draft) === manifest.choice.draftSha256 && draft.seed_sha256 === canonical(seed),
  "Current canonical binding mismatch.");
const traceBindings = seed.trace.map((item) => ({
  ...bind(path.join(root, item.path)), seed_trace_sha256: item.sha256,
}));
requireFact(traceBindings.every((x) => x.raw_sha256 === x.seed_trace_sha256), "Current source trace mismatch.");
const projections = modern.exercises.map((item) => ({
  number: item.number,
  text: item.group && item.group.trim() ? `${item.group}\n${item.text}` : item.text,
  figure_ids: [...new Set([...(item.figure_refs ?? []), ...(item.figures ?? []).map((f) => f.id)])],
}));
const selectedConcepts = seed.concepts.map((item) => ({
  block: item.block, text: lesson.prose[item.block].text,
}));
requireFact(same(seed.exercises, projections) && same(seed.concepts, selectedConcepts),
  "Seed content is not the actual current modern exercise/concept projection.");
requireFact(seed.figures.length === 0 && draft.new_figures.length === 0, "Unexpected figures.");
requireFact(inheritedChoice.outcome === "pass" &&
  inheritedChoice.source_reviews.every((x) => x.coverage.verdict === "pass") &&
  inheritedChoice.question_reviews.every((x) =>
    [x.task_fidelity, x.redundancy, x.answer_leakage, x.mathematics].every((check) => check.verdict === "pass")),
  "Only passing inherited semantic rows may be reused.");
const nativeReview = structuredClone(inheritedChoice);
nativeReview.seed_sha256 = canonical(seed);
nativeReview.draft_sha256 = canonical(draft);
save("review.json", nativeReview);

const traceReview = {
  schema: "same188-6/affected-choice-trace-review@1",
  status: "pass", reviewer, lesson: "geo910-c2-s1-n46",
  scope: "Fresh affected prefix/trace check only; explicitly inherited complete original semantic PASS, not a second mathematical review.",
  original: { seed: bind(oldSeedPath), draft: bind(oldDraftPath),
    seed_canonical_sha256: canonical(oldSeed), draft_canonical_sha256: canonical(oldDraft) },
  current: { seed: bind(manifest.choice.seed.path), draft: bind(manifest.choice.draft.path),
    seed_canonical_sha256: canonical(seed), draft_canonical_sha256: canonical(draft) },
  exact_deltas: { seed: seedDelta, draft: draftDelta, actual_modern_exercises: modernDelta },
  actual_current_seed: {
    status: "pass", trace_bindings: traceBindings,
    exercise_projection_matches_actual_modern: true,
    selected_concept_blocks: seed.concepts.map((x) => x.block),
    concept_projection_matches_actual_modern: true,
    source_selectors_unchanged: same(oldSeed.source, seed.source),
    native_preparation_receipt: bind(path.join(tmp, "n46-answer-symbol-repair-01/choice-seed-refresh-01/command.json")),
    command_not_rerun: true,
    evidence: "All four trace hashes match actual files. Six full group-prefixed exercise texts and concept blocks 0,4,12 agree with current JSON; only 36*. -> 36* changed.",
  },
  unchanged: {
    question_objects: draft.questions.length,
    option_objects: draft.questions.reduce((n, x) => n + x.view.options.length, 0),
    questions_canonical_sha256: canonical(draft.questions),
    coverage_canonical_sha256: canonical(draft.coverage),
    concepts_canonical_sha256: canonical(seed.concepts),
    figures_canonical_sha256: canonical(seed.figures),
    views_internal_solutions_keys_rationales_derivations_and_limitations: "Entire questions subtree content-identical, including order and all 44 options.",
    coverage_and_omissions: true, concepts: true, figures: true,
    math_reshuffle: false, responses_lost: false,
  },
  semantic_pass_reuse: {
    original_review: bind(manifest.choice.inheritedReview.path),
    original_review_outcome: inheritedChoice.outcome,
    source_rows_reused: inheritedChoice.source_reviews.length,
    question_rows_reused: inheritedChoice.question_reviews.length,
    option_math_rows_reused: inheritedChoice.question_reviews.reduce((n, x) => n + x.mathematics.option_checks.length, 0),
    source_reviews_content_identical: same(inheritedChoice.source_reviews, nativeReview.source_reviews),
    question_reviews_content_identical: same(inheritedChoice.question_reviews, nativeReview.question_reviews),
    figure_checks_content_identical: same(inheritedChoice.figure_checks, nativeReview.figure_checks),
    new_figure_reviews_content_identical: same(inheritedChoice.new_figure_reviews, nativeReview.new_figure_reviews),
    source_reviews_sha256: canonical(nativeReview.source_reviews),
    question_reviews_sha256: canonical(nativeReview.question_reviews),
    provenance: "Original independent reviewer identity and every independent solution/evidence/option truth row retained verbatim as structured content. Only top-level seed_sha256 and draft_sha256 rebound.",
    current_native_review: bind(path.join(out, "review.json")),
    second_full_independent_math_review: false,
    exact_native_schema_fields_unchanged: same(Object.keys(inheritedChoice), Object.keys(nativeReview)),
  },
  native_validator_executed: false, parent_once_after_collection: true,
  previous_failures_and_repairs_preserved: true,
};
save("trace-review.json", traceReview);

const formulaTokens = (text) => [...text.matchAll(/\$\$[\s\S]*?\$\$|(?<!\$)\$(?!\$)[^$]*?\$(?!\$)/g)].map((m) => m[0]);
const prior36 = oldAnswer.answers[2];
const current36 = answer.answers[2];
const oldTokens = formulaTokens(prior36.displayAnswer);
const newTokens = formulaTokens(current36.displayAnswer);
const otherAnswersUnchanged = oldAnswer.answers.every((item, i) => i === 2 || same(item, answer.answers[i]));
const tail23Unchanged = prior36.displayAnswer.slice(prior36.displayAnswer.indexOf("2\uff09")) ===
  current36.displayAnswer.slice(current36.displayAnswer.indexOf("2\uff09"));
requireFact(otherAnswersUnchanged && tail23Unchanged &&
  same(oldTokens, newTokens.filter((token) => token !== "$O$")), "Unchanged formula/answer premise failed.");
requireFact(convention.role_verdict === "pass" && convention.outcome === "pass", "Missing inherited center-role PASS.");
const polynomialPhrase = "\u4efb\u610f\u975e\u96f6\u6574\u5f0f\u500d\u6570";
const constantPhrase = "\u4efb\u610f\u975e\u96f6\u5e38\u6570";
requireFact(current36.notes.includes(polynomialPhrase) && current36.displayAnswer.includes(constantPhrase),
  "Changed notes finding must be bound to the actual candidate.");
const answerReview = {
  schema: "same188-6/affected-answer-wording-readiness-review@1",
  status: "revise", reviewer, lesson: "geo910-c2-s1-n46",
  scope: "Only repaired 36(1) introductory/concluding wording and notes; affected readiness, not full Gate2.",
  candidate_binding: bind(manifest.answerCandidate.path),
  immutable_before_binding: bind(oldAnswerPath),
  inherited_answer_review: bind(oldAnswerReviewPath),
  original_outcome: oldAnswerReview.outcome,
  inherited_mathematical_PASS: {
    status: oldAnswerReview.mathematical_outcome,
    answers: 6, all_original_answer_math_rows: oldAnswerReview.answer_reviews,
    fresh_solutions: 0, re_solved_answers: 0,
    explanation: "Every unchanged equation, substitution, other answer and 36(2)(3) inherits the already independent mathematical PASS. This copy is historical evidence, including the immutable old readiness REVISE.",
  },
  exact_changed_fields: answerDelta,
  center_role_wording: {
    status: "pass",
    convention_review: bind(conventionPath),
    role: convention.role,
    inherited_role_evidence: convention.evidence,
    before_intro: prior36.displayAnswer.split("\n\n")[1],
    after_intro: current36.displayAnswer.split("\n\n")[1],
    before_conclusion: "\u56e0\u6b64\u5728\u8fd9\u4e00\u89e3\u91ca\u4e0b\uff0c\u50cf\u5e73\u9762\u7684\u65b9\u7a0b\u4e3a",
    after_conclusion: "\u56e0\u6b64\uff0c\u50cf\u5e73\u9762\u7684\u65b9\u7a0b\u4e3a",
    finding: "Intro now states origin-centered central symmetry unconditionally, citing the preceding exercise and section14. The unsupported undefined/conditional conclusion and active symbol HOLD are removed. Remaining words condition/HOLD in notes explicitly describe retained historical candidates, not a current unresolved center role.",
    active_unexplained_conditional_or_symbol_hold: false,
    literal_source_z_0: "unchanged",
    historical_O_or_zero_exact_typography: "UNKNOWN unchanged; neither corrected nor newly source-approved",
  },
  invariants: {
    other_five_answer_objects_unchanged: otherAnswersUnchanged,
    part2_part3_and_final_constant_multiplier_qualification_unchanged: tail23Unchanged,
    prior_formula_tokens_preserved_in_order: true,
    prior_formula_tokens: oldTokens,
    current_formula_tokens: newTokens,
    notation_only_added_token: "$O$ in the new center-definition attribution",
    qualification: "The complete list of math-delimited strings is not byte-identical: one standalone $O$ attribution was added. All 16 pre-existing math substrings, equations and substitutions remain unchanged. No false exact-list equality is claimed.",
    answers: 6, auto: 0, ungraded: 6, parts: 0, derived: 6,
    schema_top_status_and_other_fields_unchanged: true,
    grading_contract_changed: false,
  },
  learner_display_readiness: "pass",
  notes_readiness: "revise",
  findings: [{
    id: "N46-36-1-NOTE-MULTIPLIER-WORDING",
    status: "revise", location: "/answers/2/notes",
    actual_changed_phrase: polynomialPhrase,
    unchanged_display_phrase: constantPhrase,
    evidence: "New notes use nonzero polynomial multiples, whereas unchanged displayAnswer and inherited open-plane equivalence rationale require nonzero constants. The note must not broaden that already-reviewed domain. This is a fresh wording discrepancy in an affected field, not a recomputation or rejection of the inherited answer equations.",
    smallest_requested_repair: "Replace only \u4efb\u610f\u975e\u96f6\u6574\u5f0f\u500d\u6570 with \u4efb\u610f\u975e\u96f6\u5e38\u6570\u500d\u6570 (or the exact unchanged displayAnswer constant wording). Keep center role, historical UNKNOWN, equations, all grading and original REVISE receipts intact.",
    source_or_math_edit_requested: false,
  }],
  original_failure_resolution: {
    id: "N46-36-1-ANSWER-WORDING", repaired_center_role_status: "pass",
    original_review_file_modified: false, original_outcome_rewritten: false,
  },
  full_Gate2_rerun: false, native_finalize_or_validate_executed: false,
  reviewer_candidate_edit: false, human_or_parent_approval: false,
};
save("answer-review.json", answerReview);

const screenshotResult = input("n46-exercise-display-repair-01/result.json");
const visualReview = {
  schema: "same188-6/affected-exercise-display-review@1",
  status: "pass", reviewer, scope: "Only two supplied new full-frame exercise screenshots; display separator repair.",
  source_hashes: screenshotResult.sourceBindings.map((x) => ({
    ...bind(x.path), supplied_sha256: x.sha256,
  })),
  screenshots: manifest.visual.screenshots.map((item, index) => ({
    ...bind(item.path), image_load_ordinal: index + 7, opens: 1,
    viewport: screenshotResult.results[index].viewport,
    observed: index === 0 ? [
      "Desktop marker reads 36.* with exactly one period and one star; body immediately begins with the requested previous-exercise wording, no separate dot.",
      "All 34-39 appear once, in order. Both image-plane equations, all three symmetry items and literal z_0 retained.",
      "38 includes both coefficients and the two-case surface-area ratio request. 39 retains construction and final original/image surface-area ratio request, followed by return button.",
      "No new incoherent overlap, clipped equation tail or missing last content visible.",
    ] : [
      "390-wide marker reads 36.* with one period; body begins with the requested previous-exercise wording, not a separate leading period.",
      "All 34-39 remain complete; longer text/formulas wrap below without gutter/body collision.",
      "The full 36 equation and all three subcases including z_0 remain. 38 ends with its two-case ratio request.",
      "39 includes k=1/3, construction and final surface-area ratio request; return button and bottom margin remain visible.",
    ],
    marker_literal: "36.*", body_start_literal: "\u5229\u7528\u4e0a\u9898\u7684\u7ed3\u679c",
    body_extra_leading_dot: false, verdict: "pass",
  })),
  inherited_text_figures_endpoint_PASS: {
    review: bind(manifest.visual.inheritedReview.path),
    original_outcome: oldVisual.outcome,
    reused_surfaces: oldVisual.surfaces.filter((x) => x.verdict === "pass"),
    scope: "Desktop text, mobile text-left and complementary mobile text-right figure endpoint PASS reused; no old image opened.",
    unchanged_current_lesson_and_figures_bound: true,
    old_text_images_opened: 0, old_figure_images_opened: 0,
  },
  old_REVISE_preserved: {
    original_review: bind(manifest.visual.inheritedReview.path),
    original_failures: oldVisual.failures,
    old_exercise_images_opened: 0,
    original_bytes_not_modified: true, outcome_not_rewritten: true,
    repair_resolves: "N46-36-DISPLAY-NUMBER-PUNCTUATION only",
  },
  renderer_or_browser_executed: false, full_text_or_figure_re_review: false,
  accessibility_qualification: "Static visual evidence only; no new live runtime, keyboard or screen-reader claim.",
};
save("visual-review.json", visualReview);

const sourceAuthor = read(sourceManifest.authorReport.path);
const prior172 = input("source170172-review-01/review.json");
const prior172Page = prior172.pages.find((x) => x.physical === 172);
const rowEvidence = {
  173: [
    "Two parallel planes, remaining n parallelogram faces; continuation preserves mid-definition entry.",
    "n-prism term closes the definition.",
    "Existence paragraph, polygon Phi_1 and convex qualifier begins.",
    "Qualifier closes; parallel alpha and Phi_1 not subset alpha; reference23 retained.",
    "Projection not necessarily orthogonal; next phrase remains split.",
    "Each edge/projection opposite sides; all-parallelogram phrase continues.",
    "Parallelograms, Phi_1 and Phi enclose a closed polyhedral surface.",
    "Literal polyhedral-surface wording retained, not mathematically repaired.",
    "Bases Phi_1/Phi and vector AA_1(Phi)=Phi_1 preserved.",
    "Base mapping and figure23 reference; sentence continues.",
    "Congruent bases, side faces and their union retained.",
    "Lateral-surface term closes this paragraph.",
    "Both captions23/24 share one printed horizontal row; figures are separate objects.",
    "Drawing begins with one base and section13 reference; then split at line end.",
    "Parallel equal lateral edges and base-edge parenthetical retained.",
    "Join other lateral-edge endpoints.",
    "Right/oblique classification and perpendicular-lateral-edge clause.",
    "Figure24 and nonperpendicular clause end literally before next-page continuation.",
    "Decorated folio166 retained, bottom left.",
  ],
  174: [
    "Oblique-prism definition continuation closes page173 open paragraph.",
    "Height endpoints and base-perpendicular condition; called split at line end.",
    "Height term, figure25 and ABCDA_1B_1C_1D_1 retained.",
    "Height MN closes paragraph; no invented subscript.",
    "Both captions25/26 share one printed horizontal row.",
    "Regular-polygon-base right prism definition and figure26 reference.",
    "Regular hexagonal prism and its net retained.",
    "Exercise heading appears before55, not a numbered lesson heading.",
    "55 asks minimum faces then vertices, edges and lateral edges.",
    "55 lateral-edge request closes at question mark.",
    "56(1) regular quadrangular prism, diagonal25cm; lateral diagonal phrase split.",
    "56(1) lateral diagonal20cm and height request retained.",
    "56(2) base diagonal a, lateral diagonal b split as printed.",
    "b and prism-diagonal request retained.",
    "57 all edges a and generic diagonal-length request retained verbatim.",
    "58 right prism, rhombus side a, acute varphi; clause continues.",
    "58 longer diagonal makes beta with base; no change to the given relation.",
    "58 generic diagonal-length request closes; no extra task quantity inferred.",
    "Decorated folio167 retained, bottom right.",
  ],
};
function pageRows(page) {
  const rows = [];
  for (const [index, block] of page.blocks.entries()) {
    if (block.kind === "fig") continue;
    for (const [lineIndex, text] of block.lines.entries()) {
      const ref = { block: `p${String(page.meta.page).padStart(4, "0")}#${index + 1}`,
        line: lineIndex + 1, text };
      if (block.samerow && lineIndex === 0) {
        rows.at(-1).candidates.push(ref);
        rows.at(-1).shared_caption_row = true;
      } else {
        rows.push({ row: rows.length + 1, candidates: [ref], shared_caption_row: false });
      }
    }
  }
  return rows.map((row, index) => ({
    ...row, status: "pass", observed_comparison: rowEvidence[page.meta.page][index],
  }));
}
const figureDescriptions = {
  "fig-g10-23": {
    labels: ["A", "B", "C", "D", "E", "A_1", "B_1", "C_1", "D_1", "E_1", "Phi", "Phi_1", "alpha", "l"],
    relationships: "Five upper/lower vertex pairs; Phi_1 upper and Phi lower faces; alpha labels separate surrounding plane, not a vertex; AA_1 arrow upward.",
    solid_dashed: "Top pentagon and four lateral edges solid; E_1-E and lower rear D-E-A dashed. Rear plane contour dashed across prism. External l solid to plane dot, dashed to foreground-plane contour, then solid below contour.",
    ownership: "Expository projection/existence and base-translation paragraphs, p0173#2/#3; not an exercise.",
  },
  "fig-g10-24": {
    labels: [], relationships: "Complete unlabelled pentagonal prism; no projection plane, external line or numeric givens.",
    solid_dashed: "Top/front/side boundaries solid; rear vertical and two lower rear edges dashed.",
    ownership: "Right-prism example explicitly referenced in p0173#9; not an exercise.",
  },
  "fig-g10-25": {
    labels: ["A", "B", "C", "D", "A_1", "B_1", "C_1", "D_1", "M", "N"],
    relationships: "Eight vertices and two internal height dots; upper M, lower N; no established right-angle box.",
    solid_dashed: "Perimeter and four lateral edges solid; rear lower A-D and internal MN dashed.",
    ownership: "Height-definition paragraph p0174#2 explicitly names ABCDA_1B_1C_1D_1 and MN; not exercise55.",
  },
  "fig-g10-26": {
    labels: ["two visible subfigure markers; exact script/glyph identity localHOLD"],
    relationships: "Left hexagonal prism; right six rectangular cells with two hexagons attached above/below cell3; both subfigures retained in one native crop.",
    solid_dashed: "Prism hidden rear edges dashed; strip has five dashed internal vertical folds and two dashed hexagon attachment segments; outer perimeters solid.",
    ownership: "Regular-prism/net paragraph p0174#7 explicitly references26; neither subfigure belongs to exercise55 or56.",
  },
};
const pages = sourceManifest.pages.map((item) => {
  const page = read(item.candidateJSON.path);
  const md = fs.readFileSync(item.candidateMD.path, "utf8");
  const headerEnd = md.indexOf("\n---", 4);
  const mdMeta = JSON.parse(md.slice(4, headerEnd));
  const rows = pageRows(page);
  requireFact(rows.length === 19 && same(page.meta, mdMeta), "Source row/metadata comparison failed.");
  requireFact(page.blocks.every((block) => block.lines.every((line) => md.includes(line))),
    "Native MD/JSON line content disagreement.");
  const audit = read(item.audit.path);
  const figs = item.figures.map((figure) => {
    const bytes = fs.readFileSync(figure.crop.path);
    const dimensions = [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
    const authorCrop = sourceAuthor.pages.find((x) => x.physical_page === item.page).crops.find((x) => x.id === figure.id);
    requireFact(dimensions[0] === figure.exactBox[2] + 24 &&
      dimensions[1] === figure.exactBox[3] + 24, "Native PNG dimensions/12px padding do not match supplied inner box.");
    return {
      id: figure.id, ...bind(figure.crop.path),
      visual_status: "pass-for-readable-source-objects-and-contours",
      exact_source_inner_box: figure.exactBox,
      actual_PNG_IHDR_dimensions: dimensions, white_padding_px: 12,
      no_extra_crop_created: true, crop_loaded_once: true,
      captions_excluded_and_complete_figure_present: true,
      ...figureDescriptions[figure.id],
      author_exact_inner_array_evidence_inherited_not_rerun: {
        author_report: bind(sourceManifest.authorReport.path),
        author_pixel_array_sha256: authorCrop.pixel_array_sha256,
        status: "author mechanical provenance only, not independent semantic approval",
      },
      image_load_ordinal: Number(figure.id.split("-").at(-1)) - 20,
    };
  });
  return {
    physical_page: item.page, printed_page: item.printed,
    status: "pass-for-readable-content-with-scoped-localHOLDs",
    source_image: bind(item.original.path),
    candidate_MD: bind(item.candidateMD.path), candidate_JSON: bind(item.candidateJSON.path),
    native_audit: bind(item.audit.path), FIRST: bind(path.join(out, `FIRST-0${item.page}.md`)),
    full_page_open_ordinal: item.page - 172,
    FIRST_frozen_before_candidate_or_author_disclosure: true,
    meta: page.meta,
    MD_JSON_all_metadata_equal: true, MD_JSON_all_printed_lines_agree: true,
    actual_blocks: page.blocks.length,
    independent_compared_printed_rows: rows.length,
    native_author_rows: { printed: audit.lines_printed, MD: audit.lines_md,
      independence: "Reused author/native counts; separate fresh full-page/row comparison recorded here." },
    printed_rows: rows,
    block_findings: page.blocks.map((block, index) => ({
      reference: `p0${item.page}#${index + 1}`, kind: block.kind, label: block.label,
      owner_exercise: block.owner_exercise, cont: block.cont, open: block.open,
      samerow: block.samerow, figure_id: block.id ?? null,
      status: "pass",
      evidence: block.kind === "fig" ? figureDescriptions[block.id].ownership :
        block.kind === "cap" ? "Observed numbered caption kept separate; second caption shares row." :
        block.kind === "foot" ? "Printed decorated folio retained, not counted as exercise text." :
        block.kind === "ex" ? "Observed exercise numeral, exact full prose and subparts retained; no invented star or ring." :
        block.kind === "exhead" ? "Actual exercise heading before55." :
        "Matches source-only FIRST reading and all printed line breaks; open/cont flags reflect actual sentence boundary.",
    })),
    figures: figs,
    header: "No fresh numbered heading on this page; section48 role supplied only by scoped predecessor text.",
    all_math_delimited_source_substrings: page.blocks.flatMap((b) => b.lines.flatMap(formulaTokens)),
    native_audit_rerun: false, source_edit: false,
  };
});
const sourceHolds = [
  {
    id: "H173174-DETACHED-INK", status: "localHOLD",
    scope: "Detached margin/blank/interior specks on both source pages and native crops, especially figure23.",
    finding: "Exact identity is not readable as a printed mathematical character or owned object. Original pixels remain; no cleanup, inferred glyph, count exclusion or extra vertex.",
    blocks_readable_content_PASS: false, whole_ink_identity_approval: false,
  },
  {
    id: "H174-FIG25-UPPER-DOT-TAIL", status: "localHOLD",
    scope: "Figure25 tiny downward ink adjacent to upper M dot.",
    finding: "M/N letters, dots and dashed MN are readable. Tiny tail's exact identity is not established; no M_1 relabelling authorized.",
    blocks_readable_height_role_PASS: false,
  },
  {
    id: "H174-FIG26-EXACT-SUBFIGURE-GLYPHS", status: "localHOLD",
    scope: "Two markers below figure26; page174 meta.notes[1] asserts specific Cyrillic letters.",
    actual_author_metadata_note: pages[1].meta.notes[1],
    finding: "Both markers and their left/right ownership are retained in raw pixels. Exact script/code-point identity was not confidently established in FIRST or the one crop; author Cyrillic identification is not promoted to independent PASS.",
    blocks_two_subfigure_and_net_geometry_PASS: false,
  },
];
const sourceReview = {
  schema: "same188-6/first-source173174-review@1",
  status: "hold", scoped_status: "pass-for-readable-source-content-and-joins-with-localHOLDs",
  reviewer, ticket: "STEMROBIN-188", book: "9-10g", numbering_scope: "g10",
  manifest: bind(manifest.sourceFirstReview.path),
  FIRST_complete_before_candidates: true,
  FIRST_files: ["FIRST-0173.md", "FIRST-0174.md", "FIRST-native-crops.md"].map((name) => bind(path.join(out, name))),
  original_full_pages_opened_FIRST: [173, 174],
  native_crops_then_candidates_order: true,
  fullpage_findings: pages,
  total_printed_rows_compared: 38,
  figures_compared: 4,
  joins: [
    {
      status: "pass-scoped-text-role-and-contour-only",
      predecessor_MD: bind(sourceManifest.predecessor.candidateMD.path),
      predecessor_JSON: bind(sourceManifest.predecessor.candidateJSON.path),
      prior_independent_qualification: bind(path.join(tmp, "source170172-review-01/review.json")),
      original_whole_review_status: prior172.status,
      original_page172_status: prior172Page.status,
      inherited_scoped_rows: prior172Page.completeRowComparisons.filter((x) => [21, 22].includes(x.row)),
      predecessor_ref: "p0172#13 open definition ends with \u5b83\u4eec\u5206\u522b\u5728",
      successor_ref: "p0173#1 cont begins \u4e24\u4e2a\u5e73\u884c\u5e73\u9762\u5185",
      evidence: "Scoped independent row21 section48 and row22 incomplete definition PASS are reusable at the bound closed predecessor. Newly read173 begins the corresponding two-parallel-plane clause and completes n-prism definition; no invented missing phrase.",
      predecessor_read_after_FIRST_only: true, predecessor_pixels_opened: false,
      old_whole172_REVISE_preserved: true, whole172_approval_inferred: false,
    },
    {
      status: "pass", predecessor: "p0173#9 open", successor: "p0174#1 cont",
      predecessor_tail: "\u90a3\u4e48\u5b83", successor_text: "\u5c31\u53eb\u505a\u659c\u68f1\u67f1.",
      evidence: "Full-page pixels independently show unfinished nonperpendicular clause and next-page closure; one definition paragraph, not a second new heading.",
    },
    {
      status: "pass-for-observed-exercise-object-end-only", terminal_ref: "p0174#12 exercise58",
      observed_exercise_labels: ["55", "56", "57", "58"],
      exercise56_subparts: ["1)", "2)"],
      exercise58_last_text: "\u6c42\u76f4\u68f1\u67f1\u7684\u5bf9\u89d2\u7ebf\u957f.",
      open: false, cont: false,
      evidence: "The full last request and final punctuation are present. No following page read and no assertion that section48 or N48/N49 is complete.",
      section_complete: null, whole_lesson_approved: false,
    },
  ],
  exercise_figure_ownership: "Figures23-26 belong to exposition references, not nearest exercises55-58; all figure owner_exercise fields correctly null. Exercise56's numeric subparts stay in one exercise object.",
  metadata_findings: {
    status: "pass-for-bound-page-identity-structure-with-local-exact-glyph-HOLD",
    physical_to_printed: [[173, 166], [174, 167]],
    book_numbering: "9-10g/g10",
    actual_PNG_dimensions: [1506, 2126],
    PDF_identity: "Source PDF metadata retained and consistent between pages; PDF not opened or freshly independently verified.",
    same_horizontal_caption_rows: ["23/24", "25/26"],
    printed_exercise_numerals: "55-58 numeric, no observed stars or circles",
    unknown_chars_empty_in_native_audit_not_proof_of_all_ink_readability: true,
    fullpage_English_FIRST_qualifications: [
      "FIRST's numbered inventory is a row/block reading inventory, not native weighted line arithmetic: actual weighted rows are 17 text +1 shared caption +1 folio on each page.",
      "FIRST-0173's coarse below-plane-l description is qualified by the crop: l becomes solid again below the foreground contour.",
      "FIRST's English plural diagonal-length paraphrase is not a literal printed plurality requirement; actual generic Chinese requests are retained without inventing task counts.",
    ],
  },
  localHOLDs: sourceHolds,
  localHOLDs_preserved_not_hidden: true,
  native_author_success_independently_approved: false,
  inherited_author_native_counts: { pages: 2, printed_rows_each: 19, MD_rows_each: 19 },
  fresh_independent_source_comparison: "Performed from two full originals first and four supplied native crops once each, then actual MD/JSON/audits; this is not author's 19/19 PASS reused as semantic approval.",
  native_rerun: false, source_edit: false,
  whole_N48_approval: false, whole_N49_approval: false,
  source_core_import_or_retention_or_publish: false,
};
save("source-review.json", sourceReview);

const imagePaths = [
  ...sourceManifest.pages.map((x) => x.original.path),
  ...sourceManifest.pages.flatMap((x) => x.figures.map((f) => f.crop.path)),
  ...manifest.visual.screenshots.map((x) => x.path),
];
const counters = {
  schema: "same188-6/affected-review-accounting@1",
  planned_images: 8, hard_batch_image_limit: 8, context_image_limit: 24,
  actual_successful_image_loads: 8, actual_context_image_payloads: 8,
  image_tool_attempts: 9, failed_image_attempts: 1, failed_attempt_image_payloads: 0,
  full_page_loads: 2, existing_native_crop_loads: 4, new_exercise_screenshot_loads: 2,
  reopens: 0, additional_crops: 0, collages: 0, images_to_parent: 0,
  image_log: imagePaths.map((file, i) => ({
    load_ordinal: i + 1, tool_attempt_ordinal: i < 4 ? i + 1 : i + 2,
    ...bind(file), opens: 1, payload_returned: true,
    kind: i < 2 ? "original full page" : i < 6 ? "supplied native work crop" : "new exercise full-frame screenshot",
  })),
  failed_attempts: [
    {
      kind: "image-tool-path-error", tool_attempt_ordinal: 5,
      path: path.join(root, ".intentfold/tickets/STEMROBIN-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/source173174-author/work/9-10g/pages/0174/figures/fig-g10-25.png"),
      error: "ENOENT / os error2, no image payload",
      correction: "Correct exact manifest path used once for still-unread load5; no loaded image reopened.",
      retained: true,
    },
    {
      kind: "read-only-rg-path-error", exit_code: 2,
      missing_path: ".agents/skills/ld-s10y-choice/scripts/common.py",
      correction: "Read the actual existing prepare.py; no preparation or validator executed.",
      retained: true,
    },
    {
      kind: "read-only-rg-path-error", exit_code: 2,
      missing_path: "node_modules at checkout root",
      correction: "Stopped dependency search; no install, pixel decode or new crop. Actual PNG IHDR metadata only; author exact-array evidence remains inherited mechanical provenance.",
      retained: true,
    },
  ],
  own_tool_failures: 3, own_content_edits_to_candidates: 0,
  fresh_affected_answer_reviews: 1, fresh_affected_visual_reviews: 1,
  fresh_affected_trace_reviews: 1, fresh_FIRST_source_review_batches: 1,
  second_full_math_reviews: 0,
  inherited_accounting: {
    original_independent_review_index: bind(path.join(priorRoot, "output-index.json")),
    original_independent_image_counts: oldIndex.image_loads,
    original_failures: oldIndex.failures,
    original_answer_author_counts: input("n46-answer-author/report.json").counts,
    original_answer_author_failures_and_repairs: input("n46-answer-author/report.json").preservedFailuresAndRepairs,
    original_choice_author_counts: input("n46-choice-author/report.json").counts,
    original_choice_first_fails: input("n46-choice-author/report.json").first_fails,
    symbol_repair_counts: {
      original_author_wording_repairs: repair.originalAuthorWordingRepairs,
      new_answer_symbol_wording_repairs: repair.newAnswerSymbolWordingRepairs,
      exercise_presentation_repairs: repair.exercisePresentationRepairs,
    },
    source173174_author_counters: sourceAuthor.counters,
    predecessor_original_review_status: prior172.status,
    history_reset: false,
  },
  forbidden_operations: {
    agents: 0, git: 0, backend: 0, messages: 0, credentials_or_env: 0,
    DB: 0, paid: 0, model_or_network_calls: 0, install: 0, prepare: 0,
    finalize: 0, render: 0, native_validate: 0, retention: 0, publish: 0,
  },
  all_exec_cwd: root, write_boundary: out,
};
save("counters.json", counters);
const report = {
  schema: "same188-6/affected-N46-and-FIRST173174-collection-report@1",
  status: "complete-for-collection-with-revise-and-localHOLDs",
  assignment: "SAME188-6 / STEMROBIN-188 sole independent affected reviewer + FIRST source173174",
  date: "2026-11-20", reviewer, root, output_directory: out,
  verdicts: {
    answer_affected_wording_notes: answerReview.status,
    answer_center_role_readiness: "pass", inherited_answer_mathematics: "pass",
    exercise_display: "pass", choice_trace: "pass", inherited_native_choice: "pass",
    source173174: "hold", source173174_readable_scoped_findings: "pass",
  },
  concrete_findings: [
    "Center-role repair passes; active undefined/conditional role is gone. Source z_0 and historical O/0 UNKNOWN unchanged.",
    "Notes-only REVISE: actual candidate says arbitrary nonzero polynomial multiples where unchanged answer says arbitrary nonzero constants. No equation/math/source edit requested.",
    "Two new screenshots independently PASS; one separator36.*, body no extra dot, all34-39 and last39 ratio request retained.",
    "Native review.json copies ALL6 source and11 question/44 option PASS rows with original evidence and reviewer, rebinding only seed/draft canonical hashes; no second full independent mathematical review.",
    "FIRST source173174 complete before candidate/author disclosure; all38 weighted rows,23 blocks,4 figures and real joins compared. Exact glyph/ink localHOLDs remain explicit.",
  ],
  collection_files: ["answer-review.json", "visual-review.json", "trace-review.json", "review.json", "source-review.json", "counters.json"],
  input_bindings: {
    primary: bind(primaryPath), secondary: bind(manifest.sourceFirstReview.path),
    files: beforeBindings.file_count,
    before: bind(path.join(out, "bindings-before.json")),
    after: bind(path.join(out, "bindings-after.json")),
    mismatch_before: beforeBindings.expected_mismatch_count,
    mismatch_after: afterBindings.expected_mismatch_count,
    actual_changes_since_before: afterBindings.changed_since_before_count,
    all_current_raw_hashes: afterBindings.files,
  },
  canonical_hashes: {
    original_seed: canonical(oldSeed), original_draft: canonical(oldDraft),
    current_seed: canonical(seed), current_draft: canonical(draft),
    unchanged_questions: canonical(draft.questions), unchanged_coverage: canonical(draft.coverage),
  },
  inherited_original_REVISE_records_preserved: [bind(oldAnswerReviewPath), bind(manifest.visual.inheritedReview.path)],
  counters: bind(path.join(out, "counters.json")),
  snapshot_bound_status_only: true, history_reset: false,
  native_validator_run: false, parent_validator_once_after_collection: true,
  source_or_candidate_changes: false, parent_message_sent: false, image_payloads_to_parent: false,
  parent_approval: false, whole_N48_N49_approval: false,
  stop: "Collection closure only. No continued assembly, revision, native gate, retention or publication.",
};
save("report.json", report);
const markdown = `# SAME188-6 Collection Review

Scope: affected N46 wording/display/trace and FIRST source173174 only.
All writes are confined to this review directory; all exec cwd is the assigned checkout.

## Verdicts

- Answer center-role/readable display: PASS, inherited six-answer mathematical PASS.
- Answer affected notes: REVISE. New notes use \`${polynomialPhrase}\`; unchanged answer uses \`${constantPhrase}\`. Request only constant-multiple wording in notes. No candidate/source equation change.
- Two new exercise screenshots: PASS. Marker \`36.*\` has one separator; body starts \`\u5229\u7528\u4e0a\u9898\u7684\u7ed3\u679c\` without a residual dot. All34-39 and final39 area-ratio request present.
- Choice trace: PASS. Seed changes only36 prefix and exercise trace hash; draft changes only seed hash. Entire11 question/44 option objects, coverage, concepts and figure lists unchanged.
- Native \`review.json\`: inherited PASS, not a second independent math review. All6 source rows and11 question/44 option rows and their evidence are preserved; only top-level snapshot hashes rebound.
- Source173174: readable-content/structure/joins scoped PASS; overall local HOLD for exact detached ink, figure25 dot-tail and figure26 marker script identity. The author's Cyrillic metadata assertion is not independent exact-glyph PASS.

## Snapshot Evidence

Current answer raw SHA256: ${bind(manifest.answerCandidate.path).raw_sha256}

Current seed canonical SHA256: ${canonical(seed)}

Current draft canonical SHA256: ${canonical(draft)}

All95 supplied actual files match before and after; zero changes. Full raw hashes are in \`bindings-after.json\` and \`report.json\`.
Old answer/visual REVISE files, author failures and cumulative repairs remain intact.
All16 pre-existing36 math substrings are unchanged; one standalone \`$O$\` attribution was added. No false exact equality of the full math-token list is asserted.

## FIRST Source

Both original pages were opened first and the complete FIRST files frozen before candidates/author reports.
All38 weighted printed rows and23 blocks were compared. Each page has17 text rows,1 shared caption row and1 folio.
All four supplied native work crops were inspected once. Source inner boxes and actual PNG dimensions with12px white padding are recorded; exact-array native author evidence is inherited mechanical provenance, not a rerun.
Figures23-26 are exposition-owned, not assigned to adjacent exercises55-58.
The closed172 predecessor is text-only after FIRST; only inherited section48/definition role and contour PASS is reused. Its whole-page REVISE is preserved.
173 open nonperpendicular clause joins174 cont oblique-prism closure. Exercise58 visibly closes; neither N48 nor N49 whole approval is claimed.
FIRST is immutable but fallible: crop qualifies the coarse external-l contour description; English plural-diagonal paraphrase does not add a printed task requirement.

## Accounting and Stop

Eight successful payload loads:2 full originals,4 existing native crops,2 new exercise screenshots.
Nine image-tool attempts include1 ENOENT path failure with zero payload. No reopened image, new crop or collage.
Two read-only path-lookup failures are also preserved. Inherited failures/repair counters are not reset.
No agent, Git, backend, message, env/credential, DB, network/model/paid, install, prepare, finalize, render, native validator, retention or publish operation.
The exact native validator is left to the parent once after collection.
Stopped at collection closure. No image payloads or parent messages sent.
`;
fs.writeFileSync(path.join(out, "report.md"), markdown, { flag: "wx" });
const outputFiles = fs.readdirSync(out).sort().filter((name) => {
  const stat = fs.statSync(path.join(out, name));
  return stat.isFile() && !["output-index.json", "output-index.sha256"].includes(name);
}).map((name) => ({ name, ...bind(path.join(out, name)) }));
const index = {
  schema: "same188-6/review-output-index@1",
  status: report.status, verdicts: report.verdicts,
  output_directory: out, output_files: outputFiles,
  images: { successful_loads: 8, tool_attempts: 9, failed_attempts: 1, payloads_from_failure: 0, reopens: 0, new_crops: 0, collages: 0 },
  input_files_bound: 95, mismatches_before: 0, mismatches_after: 0, changes: 0,
  canonical_hashes: report.canonical_hashes,
  all_current_raw_hashes_reference: bind(path.join(out, "bindings-after.json")),
  original_REVISE_and_repair_history_preserved: true,
  self_sha_policy: "Index excludes itself and its external SHA256 sidecar. Exact index raw SHA256 is in output-index.sha256 and command receipt.",
  collection_stop: true, native_validator_executed: false, parent_messages: 0, image_payloads_to_parent: 0,
};
save("output-index.json", index);
const indexBinding = bind(path.join(out, "output-index.json"));
fs.writeFileSync(path.join(out, "output-index.sha256"), `${indexBinding.raw_sha256}  output-index.json\n`, { flag: "wx" });
console.log(JSON.stringify({
  status: report.status, verdicts: report.verdicts, output_index: indexBinding,
  files: outputFiles.length, input_count: 95, input_changes: 0,
  native_review: bind(path.join(out, "review.json")),
  canonical_seed: canonical(seed), canonical_draft: canonical(draft),
  image_payloads: 8, image_tool_failures: 1,
}, null, 2));
