import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
assert.equal(process.cwd(), root);
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp");
const out = path.join(tmp, "n42-layout-affected-review-01");
const repair = path.join(tmp, "n42-mobile-layout-repair-01");
const transition = path.join(tmp, "n42-layout-choice-transition-01");
const historical = path.join(tmp, "n42-answer-choice-review");
const original = path.join(tmp, "n42-choice-prerequisite-repair-01");
const surfaces = path.join(tmp, "offline-display-9-10g_geo910-c2-s1-n42-surfaces-layout-repair-01");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const hashBytes = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const hash = p => hashBytes(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: hash(p), size: fs.statSync(p).size });
const equal = (a, b) => {
  try { assert.deepStrictEqual(a, b); return true; }
  catch { return false; }
};
const changes = (a, b, prefix = "") => {
  if (equal(a, b)) return [];
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object"
      || Array.isArray(a) !== Array.isArray(b)) return [prefix];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(k =>
    changes(a[k], b[k], Array.isArray(a) ? `${prefix}[${k}]` : prefix ? `${prefix}.${k}` : k));
};
const write = (name, value) => {
  const target = path.join(out, name);
  assert.equal(path.dirname(target), out);
  assert.equal(fs.existsSync(target), false, `Refuse to overwrite ${target}`);
  fs.writeFileSync(target, typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n",
    { flag: "wx" });
  return bind(target);
};
const reviewer = {
  kind: "independent_agent",
  identity: "Codex sole independent affected-layout/trace reviewer for STEMROBIN-188 SAME188-6 N42, separate from parent; independently verifies the trace-only transition; inherits Dirac semantic PASS with original solutions and figure observations unchanged; no new independent solutions or figure review"
};
const oldReview = read(path.join(historical, "review.json"));
const oldReport = read(path.join(historical, "report.json"));
const oldVisual = read(path.join(historical, "visual-observation.json"));
const claims = read(path.join(transition, "bindings.json"));
const templateClaim = read(path.join(repair, "template-transition.json"));
const modernClaim = read(path.join(repair, "modern-transition.json"));
const machinePath = path.join(surfaces, "result.json");
const machine = read(machinePath);
const oldSeedPath = path.join(original, "seed.json");
const oldDraftPath = path.join(original, "draft.json");
const seedPath = path.join(transition, "seed.json");
const draftPath = path.join(transition, "draft.json");
const oldSeed = read(oldSeedPath);
const oldDraft = read(oldDraftPath);
const seed = read(seedPath);
const draft = read(draftPath);
const modern = read(modernClaim.after.path);
const lessonDir = path.dirname(modernClaim.after.path);

for (const claim of [claims.oldSeed, claims.oldDraft, claims.inheritedReview,
  claims.modernTransition, claims.newSeed, claims.newDraft]) {
  assert.equal(hash(claim.path), claim.sha256);
}
const canonical = {
  method: "Python prepare.digest, independently executed read-only with python3 -B before assembly",
  algorithm: 'SHA256(json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8"))',
  old_seed: "eb833521273dce14f37a8e0c5c3e27fcf019bef1fc2dc5594d7c0b5c6411da6e",
  old_draft: "7296e3f79ce6d9ba1434ae87f58cb31e9b82fa98b3f0a734a7a1a2a853de0822",
  current_seed: "c7abd6e7ad45fbe0cccc32be90c849911f680a159264f8674d0000ccc4c3aba1",
  current_draft: "8783e454025bdbf73db166e1ae16744e2860dcbce647230110824ba35c680399",
  old_canonical_digests_match_prior_review: true,
  current_canonical_digests_match_bindings: true
};
assert.equal(canonical.old_seed, oldReview.seed_sha256);
assert.equal(canonical.old_draft, oldReview.draft_sha256);
assert.equal(canonical.current_seed, claims.seedSha256);
assert.equal(canonical.current_draft, claims.draftSha256);
assert.equal(canonical.current_seed, draft.seed_sha256);

const mathSpans = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map(m => m[1] ?? m[2]);
const tokens = text => mathSpans(text).flatMap(s => s.match(/\\[A-Za-z]+|\\.|[^\s]/gu) ?? []);
const strip = text => text.replace(/\$|\\\(|\\\)|\\\[|\\\]|\s/gu, "");
const layoutTransitions = [templateClaim, modernClaim].map((claim, index) => {
  const before = read(claim.before.path);
  const after = read(claim.after.path);
  const changed = changes(before, after);
  assert.deepStrictEqual(changed, ["prose[15].text"]);
  assert.equal(hash(claim.before.path), claim.before.sha256);
  assert.equal(hash(claim.after.path), claim.after.sha256);
  assert.equal(strip(before.prose[15].text), strip(after.prose[15].text));
  assert.deepStrictEqual(tokens(before.prose[15].text), tokens(after.prose[15].text));
  assert.deepStrictEqual(before.source, after.source);
  assert.deepStrictEqual(after.prose[15].source_refs, ["p0154#1"]);
  return {
    kind: index === 0 ? "template" : "modern",
    before: bind(claim.before.path),
    current: bind(claim.after.path),
    changed_fields: changed,
    source_selector: "prose[15].text",
    source_ref: "p0154#1",
    source_data_exact: true,
    source_text_exact: before.prose[15].source_text === after.prose[15].source_text,
    all_other_lesson_fields_exact: true,
    delimiter_whitespace_removed_stream_equal: true,
    removed_stream_sha256: hashBytes(strip(after.prose[15].text)),
    tex_token_stream_equal: true,
    tex_token_count: tokens(after.prose[15].text).length,
    tex_token_stream_sha256: hashBytes(JSON.stringify(tokens(after.prose[15].text))),
    before_formula_rows: mathSpans(before.prose[15].text).length,
    current_formula_rows: mathSpans(after.prose[15].text).length,
    independent_semantic_review_rerun: false
  };
});
const unchangedDocuments = ["exercises.json", "figures.json", "adaptation.audit.json"].map(name => {
  const before = bind(path.join(repair, "before", name));
  const current = bind(path.join(lessonDir, name));
  assert.equal(before.sha256, current.sha256);
  return { name, before, current, byte_identical: true };
});
const sourceBindings = (oldReport.input_bindings ?? [])
  .filter(x => x.roles?.some(r => r === "raw source bytes" || r === "raw exercise bytes"))
  .map(x => {
    const current = bind(x.path);
    assert.equal(current.sha256, x.sha256);
    return { historical: x, current, byte_identical: true, reinterpreted: false };
  });
const seedTrace = seed.trace.map(x => {
  const current = bind(path.join(root, x.path));
  assert.equal(current.sha256, x.sha256);
  return { declared: x, current, matches: true };
});
const figureBindings = seed.figures.flatMap(f => f.assets.map(a => {
  const current = bind(path.join(root, a.path));
  assert.equal(current.sha256, a.sha256);
  return { figure_id: f.id, declared: a, current, matches: true, image_loaded: false };
}));
const priorFigureBindings = (oldReport.input_bindings ?? [])
  .filter(x => x.roles?.includes("current SVG rendered and opened as PNG"))
  .map(x => {
    const current = bind(x.path);
    assert.equal(current.sha256, x.sha256);
    return { historical: x, current, byte_identical: true, approval_repeated: false };
  });
const terms = mathSpans(modern.prose[15].text).slice(1).flatMap(s =>
  s.replace(/^=/, "").replace(/\.$/, "").split("+").filter(Boolean));
assert.equal(terms.length, 9);

const observedText = {
  1440: [
    "Observed the complete 1440px screenshot from title and metadata through the bottom seven-exercise link, exactly once. Both figures and captions, section divider, four rules, proofs and final proof square are visible, with no newly introduced incoherent overlap or missing-glyph boxes.",
    "Affected prose[15] shows the factorized dot product and three separate expansion rows of three terms each. The first expansion row ends with z1*x2*k dot i; the middle row includes the formerly clipped y1*y2*j^2 in full and ends with z1*y2*k dot j; the last row ends with z1*z2*k^2 and its period. All nine terms, vector accents, dots, subscripts, plus/equality signs and squared basis vectors are visible.",
    "All affected rows fit inside the desktop prose column with clear vertical spacing and no clipping or overlap with surrounding prose or the final orthonormal relations. This is presentation observation only, not a repeated figure or mathematical approval."
  ],
  390: [
    "Observed the complete 390px screenshot from its clean two-line title to the bottom seven-exercise link, exactly once. Body paragraphs, both complete figures/captions, section divider, rules, proofs and ending remain visible; no new layout collision or missing-glyph boxes are apparent.",
    "Affected prose[15] displays the factorized product and then three rows of three expansion terms. The complete middle-row y1*y2*j^2 is readable within the right margin. All nine terms through final z1*z2*k^2 are visible without horizontal interaction. The equality, leading continuation plus signs, dot operators, vector arrows, subscripts and powers are present.",
    "The repaired expansion has no right-edge clipping, missing tail, incoherent overlap or collision with its introductory paragraph or the following orthonormal relations. N42-VIS-01 is resolved for this current static mobile surface; the historical failed screenshot and REVISE are retained, not overwritten or reopened."
  ]
};
assert.equal(machine.results.length, 2);
const screenshots = machine.results.map((screen, index) => {
  assert.equal(screen.kind, "text");
  const width = screen.viewport.width;
  assert.ok([1440, 390].includes(width));
  const expected = path.join(surfaces, "geo910-c2-s1-n42", `text-${width}.png`);
  assert.equal(screen.screenshot, expected);
  const bytes = fs.readFileSync(expected);
  assert.equal(hashBytes(bytes), screen.screenshotSha256);
  assert.equal(bytes.toString("ascii", 12, 16), "IHDR");
  assert.equal(bytes.readUInt32BE(16), width);
  assert.equal(screen.sourceHashes["lesson.json"], hash(modernClaim.after.path));
  assert.equal(screen.sourceHashes["exercises.json"], hash(path.join(lessonDir, "exercises.json")));
  return {
    kind: "text", viewport: screen.viewport,
    image_dimensions: { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) },
    screenshot: expected, sha256: screen.screenshotSha256,
    actual_load_index: index + 1, actual_opens: 1, complete_image: true,
    cropped: false, reopened: false, status: "pass",
    source_binding: {
      lesson: bind(modernClaim.after.path),
      exercises: bind(path.join(lessonDir, "exercises.json")),
      selector: "prose[15]", source_ref: "p0154#1",
      current_block_sha256: hashBytes(JSON.stringify(modern.prose[15]))
    },
    observations: observedText[width]
  };
});
const historicalFailure = oldReport.first_genuine_defect;
assert.equal(historicalFailure.status, "revise");
const inheritedExerciseSurfaces = oldVisual.screenshots.filter(s => s.kind === "exercises");
assert.equal(inheritedExerciseSurfaces.length, 2);
const commonLimitations = [
  "Only the two named NEW complete static screenshots were actually loaded, once each. No crop, reopen, prior failed screenshot, exercise screenshot, original figure or new browser was opened.",
  "Screenshots are existing headless offline text surfaces, not headed production, live interaction, choice widgets, MathLive editing, answer grading, retention or publication evidence.",
  "Dirac's prior seven-answer and seven-question/28-option semantic PASS, independent solutions, source coverage and figure observations are inherited, not newly solved or re-reviewed.",
  "Existing semantic/source/figure approvals and tests were not rerun. No reviewed choice checker was run; its one authorized run remains with the parent.",
  "Code review includes one isolated AST-extracted math_signature counterexample, not unit-test execution or an end-to-end adapt-finalize probe. No new malformed lesson was created.",
  "Historical cumulative repairs, failures, HOLD records and image usage remain historical. This review adds two actual image loads and resets no counts."
];
const visual = {
  schema: "n42-affected-layout-visual-observation-v1",
  status: "pass", ticket: "STEMROBIN-188", scope: "SAME188-6 N42-VIS-01 affected layout only",
  reviewer, machine_result: bind(machinePath),
  machine_result_status_preserved: true,
  source_binding: bind(modernClaim.after.path),
  source_selector: "prose[15]", source_ref: "p0154#1",
  screenshots,
  affected_expansion_terms_in_source_order: terms,
  affected_issue_resolution: {
    id: "N42-VIS-01", previous_status: "revise", current_status: "pass",
    historical_failed_evidence: historicalFailure,
    historical_failed_image_loaded: false,
    current_evidence: screenshots.map(s => ({ path: s.screenshot, sha256: s.sha256 })),
    resolution: "All nine terms fit visibly as three rows of three terms in both new screenshots; no clipping, overlap or missing symbols in the affected block.",
    historical_record_modified: false
  },
  historical_exercise_surfaces: {
    policy: "Exact prior JSON rows retained as inherited historical observations, not opened again or rebound as new observations.",
    source: bind(path.join(historical, "visual-observation.json")),
    entries: inheritedExerciseSurfaces
  },
  actual_image_count: 2, actual_image_limit: 2,
  image_reopens: 0, image_crops: 0, new_browser_runs: 0,
  limitations: commonLimitations
};
const visualBinding = write("visual-observation.json", visual);

assert.deepStrictEqual(changes(oldSeed, seed), ["trace[1].sha256"]);
assert.deepStrictEqual(changes(oldDraft, draft), ["seed_sha256"]);
assert.deepStrictEqual(seed.concepts.map(c => c.block), [0, 5, 7, 9, 10, 11, 12]);
assert.equal(seed.concepts.some(c => c.block === 15), false);
assert.equal(seed.concepts.every(c => c.text === modern.prose[c.block].text), true);
for (const key of ["schema", "source", "exercises", "concepts", "figures"]) {
  assert.deepStrictEqual(oldSeed[key], seed[key]);
}
for (const key of ["schema", "new_figures", "questions", "coverage"]) {
  assert.deepStrictEqual(oldDraft[key], draft[key]);
}
assert.equal(oldReview.outcome, "pass");
const currentReview = structuredClone(oldReview);
currentReview.seed_sha256 = canonical.current_seed;
currentReview.draft_sha256 = canonical.current_draft;
currentReview.reviewer = reviewer;
assert.deepStrictEqual(Object.keys(currentReview), Object.keys(oldReview));
assert.deepStrictEqual(changes(oldReview, currentReview).sort(),
  ["seed_sha256", "draft_sha256", "reviewer.identity"].sort());
const inheritedKeys = ["source_reviews", "figure_checks", "new_figure_reviews", "question_reviews"];
const exactRows = inheritedKeys.map(key => {
  assert.deepStrictEqual(currentReview[key], oldReview[key]);
  assert.equal(JSON.stringify(currentReview[key]), JSON.stringify(oldReview[key]));
  return { field: key, count: currentReview[key].length, retained_exact: true,
    before_row_sha256: hashBytes(JSON.stringify(oldReview[key])),
    current_row_sha256: hashBytes(JSON.stringify(currentReview[key])) };
});
const standardBinding = write("review.json", currentReview);
const trace = {
  schema: "n42-choice-trace-review-v1", status: "pass", reviewer,
  semantic_provenance: {
    inherited_reviewer_name_from_direct_user: "Dirac",
    inherited_reviewer_identity_from_file: oldReview.reviewer,
    prior_review: bind(path.join(historical, "review.json")),
    prior_semantic_outcome: oldReview.outcome,
    current_semantic_outcome: currentReview.outcome,
    new_independent_solutions: 0,
    semantic_review_repeated: false, figure_review_repeated: false
  },
  before: { seed: bind(oldSeedPath), draft: bind(oldDraftPath) },
  current: { seed: bind(seedPath), draft: bind(draftPath) },
  canonical_digests: canonical,
  exact_changed_fields: ["seed.trace[1].sha256", "draft.seed_sha256"],
  seed_trace_transition: { before: oldSeed.trace[1], current: seed.trace[1] },
  selected_concept_blocks: seed.concepts.map(c => c.block), changed_block_15_excluded: true,
  selected_definitions_match_current_lesson: true,
  all_definitions_exercises_figures_views_intents_keys_coverage_exact: true,
  exact_inherited_semantic_rows: exactRows,
  inherited_semantic_entries: Object.fromEntries(inheritedKeys.map(k => [k, oldReview[k]])),
  standard_review_changed_fields: changes(oldReview, currentReview),
  standard_schema_unchanged: true, standard_review: standardBinding,
  lesson_layout_transition: layoutTransitions,
  visual_observation: visualBinding,
  current_seed_trace_bindings: seedTrace, current_seed_asset_bindings: figureBindings,
  history_reset: false, reviewed_checker_run: false, limitations: commonLimitations
};
const traceBinding = write("trace-review.json", trace);

const codePath = path.join(root, ".claude/skills/ld-s10y-lesson/tools/edition.py");
const testPath = path.join(root, ".claude/skills/ld-s10y-lesson/tools/test_math_continuation_layout.py");
const codeFinding = {
  id: "N42-CODE-01", severity: "P2", status: "revise",
  title: "Continuation equality accepts a split inside an unclosed TeX argument",
  file: codePath, start: 541, end: 550,
  affected_test_file: testPath, affected_test_start: 7, affected_test_end: 31,
  counterexample: {
    source: "$\\frac{a+b}{c}$",
    changed: "$\\frac{a$\n$+b}{c}$",
    signatures_equal: true,
    exact_observed_signature: ["\\frac\u001f{\u001fa\u001f+\u001fb\u001f}\u001f{\u001fc\u001f}"],
    method: "Read-only python3 -B AST extraction and execution of current normalize_math_sentence_boundary/math_signature plus their regex constants. No production module import, image load or unit-test execution.",
    first_fragment: "\\frac{a", second_fragment: "+b}{c}",
    first_fragment_missing_closing_brace: true,
    second_fragment_has_unmatched_closing_brace: true
  },
  evidence: "The new continuation condition checks whitespace and a leading =/+/-, but does not check that each math span is independently closed. The reproduced invalid fraction fragments therefore receive exactly the same signature as the intact fraction. validate_text uses this equality as its math-preservation gate at edition.py:867; the new tests protect command boundaries and changed group tokens, but do not reject splitting a formula inside its still-open group.",
  consequence: "A malformed layout-only candidate can pass this shared mathematical-preservation comparison. The renderer handles each math span separately (render_lesson.js:73, throwOnError:false), so this equality is not evidence that the split retains a renderable formula. This is a concrete gate regression, not a defect in the current N42 row or an inherited answer/choice semantic finding.",
  requested_repair: "Before treating spans as continuations, reject boundaries inside unclosed TeX groups or paired environments; retain the current complete-row N42 repair. Add a negative regression for the supplied split-fraction counterexample, without weakening the existing token/sign/command-boundary protections.",
  no_silent_edit: true, current_n42_formula_corrupted: false
};
const codeReview = {
  schema: "n42-localized-code-review-v1", status: "revise", reviewer,
  inputs: [bind(codePath), bind(testPath)],
  scope: "Localized math_signature continuation/token change and its new test file only",
  findings: [codeFinding],
  retained_strengths: [
    "The token separator retains TeX command-token boundaries, including alpha followed by b versus alphab.",
    "The supplied tests cover valid complete-row continuations, whitespace, intervening prose/punctuation, changed signs, missing operators, different grouping tokens and changed basis vectors.",
    "The actual N42 transition keeps all TeX tokens and all nine terms and has a separate two-screen visual PASS."
  ],
  tests_read: true, tests_edited: false, tests_executed: false,
  isolated_counterexample_probes: 1,
  limitations: ["No new lesson candidate, full validator, render or adapt-finalize was run for the malformed fraction. The counterexample establishes the exact shared signature false equivalence."]
};
const codeBinding = write("code-review.json", codeReview);
const failures = [
  {
    phase: "snapshot",
    evidence: bind(path.join(repair, "snapshot-first-failure.json")),
    retained_receipt: read(path.join(repair, "snapshot-first-failure.json")),
    content_failure: false
  },
  {
    phase: "adapt-finalize-first-failure",
    evidence: bind(path.join(repair, "adapt-finalize/command.json")),
    retained_receipt: read(path.join(repair, "adapt-finalize/command.json")),
    stdout: bind(path.join(repair, "adapt-finalize/stdout.txt")),
    stdout_text: fs.readFileSync(path.join(repair, "adapt-finalize/stdout.txt"), "utf8"),
    repeated_by_reviewer: false
  },
  {
    phase: "adapt-finalize-recovery-01",
    evidence: bind(path.join(repair, "adapt-finalize-recovery-01/command.json")),
    retained_receipt: read(path.join(repair, "adapt-finalize-recovery-01/command.json")),
    repeated_by_reviewer: false
  },
  {
    phase: "render",
    evidence: bind(path.join(repair, "render/command.json")),
    retained_receipt: read(path.join(repair, "render/command.json")),
    repeated_by_reviewer: false
  }
];
const inputPaths = [
  path.join(root, ".agents/skills/ld-s10y-image/SKILL.md"),
  path.join(root, ".claude/skills/ld-s10y-lesson/references/production-resume.md"),
  path.join(root, ".agents/skills/ld-s10y-choice/SKILL.md"),
  path.join(root, ".agents/skills/ld-s10y-choice/references/contract.md"),
  path.join(root, ".agents/skills/ld-s10y-choice/references/review.md"),
  path.join(root, ".agents/skills/ld-s10y-choice/scripts/prepare.py"),
  path.join(repair, "template-transition.json"),
  path.join(repair, "modern-transition.json"),
  path.join(repair, "snapshot.json"),
  path.join(transition, "bindings.json"),
  oldSeedPath, oldDraftPath, seedPath, draftPath,
  path.join(historical, "review.json"),
  path.join(historical, "report.json"),
  path.join(historical, "visual-observation.json"),
  path.join(historical, "first-defect.json"),
  path.join(historical, "FIRST-seal.json"),
  path.join(historical, "PREKEY-seal.json"),
  path.join(historical, "keys-read-receipt.json"),
  codePath, testPath, machinePath,
  path.join(out, "assemble-review.mjs")
];
const inputBindings = [...new Set(inputPaths)].map(bind);
const reportText = `# N42 Affected Layout and Trace Review

Overall: REVISE for one localized code-gate defect, N42-CODE-01.
N42-VIS-01: PASS on the two NEW complete screenshots; all nine terms are visible.
Choice trace-only transition: PASS, inheriting Dirac semantic PASS exactly.

## Finding

P2, edition.py:541-550: the continuation gate accepts splitting an unclosed TeX argument.
An isolated read-only probe confirmed identical signatures for
\`$\\frac{a+b}{c}$\` and \`$\\frac{a$\\n$+b}{c}$\`.
The fragments have unbalanced braces, but the new predicate checks only whitespace and a leading operator.
The new test file does not reject this split-inside-group case. Reject nonclosed span boundaries and add that negative case.
No code, passed test, lesson, seed, draft or historical evidence was edited. Current N42 has no such malformed split.

## Evidence

Template and modern lesson differ only at prose[15].text, source p0154#1.
Removing math delimiters/whitespace gives the exact same stream; independent TeX token arrays also match, preserving command boundaries.
Exercises, figures, adaptation audit, source.data, other lesson fields and historical raw sources are unchanged.
1440px and 390px whole screenshots were loaded exactly once each. The expansion is three rows of three terms; the previously clipped y1*y2*j^2 and the final z1*z2*k^2 are fully visible.
The prior failed screenshot/REVISE and historical exercise surfaces remain retained and were not reopened.

Only seed.trace[1].sha256 and draft.seed_sha256 changed. Selected concepts 0,5,7,9,10,11,12 exclude block15.
Python prepare.digest independently matched old/current canonical digests and the parent's bindings.
The standard review retains every source, figure, question and option entry exactly, changing only its two canonical digest fields and reviewer identity.
No new independent mathematical solutions, semantic review, figure approval or reviewed checker is claimed.

## Outputs

- ${visualBinding.path} SHA256 ${visualBinding.sha256}
- ${standardBinding.path} SHA256 ${standardBinding.sha256}
- ${traceBinding.path} SHA256 ${traceBinding.sha256}
- ${codeBinding.path} SHA256 ${codeBinding.sha256}

The report JSON binds these outputs, current inputs, failure/recovery receipts and inherited cumulative history.
Current actual image loads: 2 of maximum 2; reopens/crops/new browsers: 0.
Prior reviewer image loads: ${oldReport.counts.total_actual_image_loads}; known prior-plus-current review subtotal: ${oldReport.counts.total_actual_image_loads + 2}, not a reset or a whole-production usage claim.
This repair's recorded contentRepairDelta remains ${templateClaim.contentRepairDelta}; earlier cumulative repairs/HOLDs remain preserved by their original reports.
No network, DB, .env, paid calls, installs, Git, delegation/messages, publication or deployment.
The parent still owns its single reviewed checker run. The new code REVISE does not revoke inherited answer/choice/figure approvals.
`;
const mdBinding = write("report.md", reportText);
const report = {
  schema: "n42-affected-layout-trace-report-v1",
  ticket: "STEMROBIN-188", assignment: "SAME188-6 bounded N42 affected layout/trace-only transition",
  review_date: "2026-11-20", cwd: root, reviewer,
  status: "revise",
  outcomes: { affected_visual_layout: "pass", trace_only_choice_transition: "pass",
    inherited_answer_semantics: "pass", inherited_choice_semantics: "pass",
    localized_code_review: "revise", overall: "revise" },
  findings: [codeFinding],
  resolved_affected_issue: { id: "N42-VIS-01", current_status: "pass",
    historical_revise_preserved: true, visual_observation: visualBinding },
  input_bindings: inputBindings,
  layout_transitions: layoutTransitions,
  unchanged_documents: unchangedDocuments,
  raw_source_bindings: sourceBindings,
  current_seed_trace_bindings: seedTrace,
  inherited_figure_asset_bindings: priorFigureBindings,
  outputs: [visualBinding, standardBinding, traceBinding, codeBinding, mdBinding],
  standard_review_semantic_rows_exact: exactRows,
  historical: {
    prior_report: bind(path.join(historical, "report.json")),
    prior_outcomes: oldReport.outcomes,
    prior_first_genuine_defect: historicalFailure,
    prior_failures: oldReport.failures,
    prior_preserved_history: oldReport.preserved_history,
    prior_technical_events: oldReport.technical_events,
    prior_author_boundary_deviation: oldReport.historical_author_boundary_deviation,
    seals: ["FIRST-seal.json", "PREKEY-seal.json", "keys-read-receipt.json"].map(n => bind(path.join(historical, n))),
    exercise_surface_entries_retained_exact: true,
    historical_images_loaded: false,
    failure_and_recovery_receipts: failures,
    repair_accounting: {
      existing_content_repair_delta: templateClaim.contentRepairDelta,
      history_reset: false,
      prior_cumulative_counts_not_replaced: true,
      newly_authored_repairs_by_reviewer: 0,
      new_paid_calls_by_reviewer: 0,
      historical_image_count: oldReport.counts.total_actual_image_loads,
      current_actual_image_count: 2,
      known_prior_plus_current_review_image_subtotal: oldReport.counts.total_actual_image_loads + 2,
      whole_production_image_total_claimed: false
    }
  },
  boundaries: {
    sole_reviewer: true, delegated_tasks: 0, other_task_messages: 0,
    actual_image_count: 2, actual_image_limit: 2, image_reopens: 0, image_crops: 0, browser_runs: 0,
    source_or_candidate_edits: 0, core_code_edits: 0, test_edits: 0, test_runs: 0,
    reviewed_checker_runs: 0, semantic_review_reruns: 0, figure_review_reruns: 0,
    network_calls: 0, db_calls: 0, env_access: 0, paid_calls: 0, installs: 0,
    git_calls: 0, publish_calls: 0, deploy_calls: 0,
    all_exec_cwd_explicit: root, only_output_directory_written: out,
    isolated_signature_counterexample_probe: true,
    current_source_binding_checks_only: true
  },
  reviewer_technical_events: [
    "Two read-only rg calls named absent guessed validate_edition.py/render.py/display.py paths; inspection continued using the actual edition.py/render_lesson.js/mathcheck.py files. No dependency installation or rerun of passed stages."
  ],
  limitations: commonLimitations,
  remaining_action: "Parent repairs N42-CODE-01 at the localized gate/test boundary; do not repeat passed semantic/figure reviews. Parent owns the single reviewed choice checker run."
};
const reportBinding = write("report.json", report);
console.log(JSON.stringify({
  status: report.status, outcomes: report.outcomes,
  actual_image_count: 2, findings: [codeFinding.id],
  report: reportBinding, visual: visualBinding, standard_review: standardBinding,
  trace: traceBinding, code: codeBinding, report_markdown: mdBinding
}, null, 2));
