import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const output = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n47-choice-internal-affected-review-01");
const manifestPath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n47-choice-internal-repair-01/manifest.json");
assert.equal(process.cwd(), repo, "Exact authorized cwd required");
assert.equal(fs.realpathSync(output), output, "Output root must not redirect writes");

const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const escapeAscii = (text) => JSON.stringify(text).replace(/[\u007f-\uffff]/g,
  (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));

// Canonical JSON matches the contract's sorted, compact, ensure_ascii=True form.
function canonical(value) {
  if (typeof value === "string") return escapeAscii(value);
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  return "{" + Object.keys(value).sort().map(
    (key) => escapeAscii(key) + ":" + canonical(value[key])).join(",") + "}";
}
const digest = (value) => hash(Buffer.from(canonical(value), "utf8"));
const binding = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
function write(name, value) {
  assert.equal(path.basename(name), name, "Write only directly under the authorized root");
  const file = path.join(output, name);
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n";
  fs.writeFileSync(file, text, { encoding: "utf8", flag: "wx" });
  return binding(file);
}

const manifest = read(manifestPath);
assert.equal(manifest.assignment, "SAME188-6");
assert.equal(manifest.ticket, "STEMROBIN-188");
assert.equal(manifest.cumulativeContentRepairs, 1);
assert.deepEqual(manifest.images, []);
assert.equal(manifest.imageOpensPlanned, 0);
const references = [];
function collect(value, pointer = "") {
  if (value === null || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    references.push({ manifest_pointer: pointer, ...value });
  }
  for (const [key, child] of Object.entries(value)) collect(child, pointer + "/" + key);
}
collect(manifest);

const standardPaths = [
  ".agents/skills/ld-s10y-choice/SKILL.md",
  ".agents/skills/ld-s10y-choice/references/review.md",
  ".agents/skills/ld-s10y-choice/references/contract.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
].map((file) => path.join(repo, file));
const uniquePaths = [...new Set([manifestPath, ...references.map((ref) => ref.path), ...standardPaths])];
function capture(phase) {
  const files = uniquePaths.map(binding);
  const byPath = new Map(files.map((file) => [file.path, file]));
  const checks = references.map((ref) => {
    const actual = byPath.get(ref.path);
    assert.equal(actual.sha256, ref.sha256, "Manifest hash mismatch: " + ref.manifest_pointer);
    if (ref.bytes !== undefined) assert.equal(actual.bytes, ref.bytes, "Manifest byte count mismatch");
    return {
      manifest_pointer: ref.manifest_pointer, path: ref.path,
      expected_sha256: ref.sha256, actual_sha256: actual.sha256,
      actual_bytes: actual.bytes,
      declared_bytes: ref.bytes ?? null, match: true,
    };
  });
  const snapshots = Object.fromEntries(["seed", "original", "repaired", "firstReview"].map(
    (role) => [role, { ...byPath.get(manifest[role].path),
      canonical_sha256: digest(read(manifest[role].path)) }]));
  return {
    schema: "n47-choice-affected-bindings-v1", phase,
    manifest: byPath.get(manifestPath), snapshots, files,
    manifest_hash_checks: checks, manifest_hash_occurrences: checks.length,
    unique_manifest_bound_paths: new Set(references.map((ref) => ref.path)).size,
    all_manifest_hashes_and_declared_bytes_match: true,
    standards: standardPaths.map((file) => byPath.get(file)),
    asset_files_reopened_or_rehashed: false,
  };
}
const before = capture("before");
const beforeOutput = write("bindings-before.json", before);
const seed = read(manifest.seed.path);
const original = read(manifest.original.path);
const repaired = read(manifest.repaired.path);
const first = read(manifest.firstReview.path);
const firstIndex = read(manifest.firstReviewIndex.path);
assert.equal(first.outcome, "revise", "Preserve the first REVISE");
assert.equal(first.reviewer.kind, "independent_agent");
assert.equal(first.seed_sha256, digest(seed));
assert.equal(first.draft_sha256, digest(original));
assert.equal(repaired.seed_sha256, digest(seed));
for (const entry of firstIndex.outputs) {
  assert.ok(references.some((ref) => ref.path === entry.path &&
    ref.sha256 === entry.sha256 && ref.bytes === entry.bytes), "Unbound FIRST output");
}

const changes = [];
function compare(left, right, pointer = "") {
  if (left === null || right === null || typeof left !== "object" || typeof right !== "object") {
    if (left !== right) changes.push({ pointer, before: left, after: right });
    return;
  }
  assert.equal(Array.isArray(left), Array.isArray(right), "Container type changed: " + pointer);
  assert.deepEqual(Object.keys(left).sort(), Object.keys(right).sort(),
    "Structural keys or array length changed: " + pointer);
  for (const key of Object.keys(left)) compare(left[key], right[key], pointer + "/" + key);
}
compare(original, repaired);
const index = original.questions.findIndex((question) => question.id === manifest.changedQuestion);
assert.equal(index, 6);
assert.equal(repaired.questions[index].id, manifest.changedQuestion);
const allowed = [
  `/questions/${index}/intent/source_solution`,
  `/questions/${index}/intent/figure_observations/0/observation`,
];
assert.deepEqual(changes.map((change) => change.pointer).sort(), allowed.toSorted());
assert.deepEqual(manifest.changedFields, [
  "intent.source_solution", "intent.figure_observations[0].observation",
]);
for (const change of changes) {
  assert.equal(change.after, change.before.replaceAll("CDEF", "DCEF"));
}
const replacements = changes.reduce((count, change) =>
  count + change.before.split("CDEF").length - 1, 0);
assert.equal(replacements, 3);
assert.deepEqual(manifest.cyclicFaceCorrection, { before: "CDEF", after: "DCEF", replacements: 3 });
const restored = structuredClone(repaired);
restored.questions[index].intent.source_solution = original.questions[index].intent.source_solution;
restored.questions[index].intent.figure_observations[0].observation =
  original.questions[index].intent.figure_observations[0].observation;
assert.deepEqual(restored, original, "Every field outside the two strings must be identical");

const getFirstBinding = (name) => {
  const file = path.join(path.dirname(manifest.firstReview.path), name);
  const result = before.files.find((entry) => entry.path === file);
  assert.ok(result, "Inherited record must be manifest-bound: " + name);
  return result;
};
const firstSolutionsBinding = getFirstBinding("source-solutions-FIRST.json");
const firstSolutions = read(firstSolutionsBinding.path);
const firstReport = read(getFirstBinding("report.json").path);
assert.ok(firstReport.notation_disclosure.includes("remain sealed and unchanged"));
assert.ok(firstReport.notation_disclosure.includes("verified cyclic order DCEF"));
assert.ok(firstSolutions.exercises.find((row) => row.exercise === "54").independent_solution.includes("CDEF"));
const originalObservation = firstSolutions.figure_observations[0].observation;
assert.ok(originalObservation.includes("CDEF"), "Historical informal vertex list remains unchanged");
const solidLinks = originalObservation.match(/Solid links ([^;]+);/);
assert.ok(solidLinks, "Use actual independently observed incidence, not author's face labels");
const observedEdges = solidLinks[1].match(/\b[A-F]{2}\b/g);
assert.equal(observedEdges.length, 8);
const edgeKey = (edge) => edge.split("").sort().join("");
const edgeSet = new Set(observedEdges.map(edgeKey));
const cycleEdges = (cycle) => [...cycle].map((vertex, position) =>
  vertex + cycle[(position + 1) % cycle.length]);
const correctedEdges = cycleEdges("DCEF");
assert.deepEqual(correctedEdges, ["DC", "CE", "EF", "FD"]);
assert.ok(correctedEdges.every((edge) => edgeSet.has(edgeKey(edge))));
const absentOldEdges = cycleEdges("CDEF").filter((edge) => !edgeSet.has(edgeKey(edge)));
assert.deepEqual(absentOldEdges, ["DE", "FC"]);
assert.ok(first.figure_checks[0].observation.includes("D-C-E-F-D"));
assert.ok(first.source_reviews.find((row) => row.source_number === "54").independent_solution.includes("DCEF"));

const oldQuestionReview = first.question_reviews[index];
assert.equal(oldQuestionReview.question_id, manifest.changedQuestion);
assert.equal(oldQuestionReview.mathematics.verdict, "revise");
const reviewer = {
  kind: "independent_agent",
  identity: "SAME188-6 sole independent N47 CHOICE internal affected-only reviewer; FIRST hash-bound source, figure, six-question, fidelity/redundancy/leakage and all option records inherited unchanged; no new figure pixel observation",
};
const evidence = "Affected-only independent judgment: the hash-bound FIRST source-only observation records solid links DC, CE, EF and FD (DF is the same undirected edge). DCEF traverses D-C-E-F-D using exactly those four observed boundary edges; CDEF would require absent DE and FC. Both repaired internal strings now use DCEF, with two occurrences in source_solution and one in figure_observations[0].observation. This matches the FIRST final review's explicitly corrected source54 boundary and its source solution, rather than accepting the author's relabeling on trust. The same four vertices and parallel bases CD/FE are used, so the opposite trapezoid, its plane CDF and its previously independently checked 3sqrt(19)a^2/16 area contribution are unchanged. The other four face contributions remain a^2, 3sqrt(3)a^2/16, a^2/4 and a^2/4; the existing five-face sum and both angles are inherited, not recalculated. The entire JSON diff proves all views, options, keys, derivations, limitations, coverage and every other field are identical. The existing complete true set D and every option_check are retained exactly. The defect is resolved in the repaired snapshot only. FIRST source-solutions/visible records also used CDEF informally; they remain immutable, and the FIRST final review already explicitly corrected this notation. No new source solution, figure pixel observation, option solving or display review is claimed.";
const priorIndependentPart = oldQuestionReview.mathematics.independent_solution.split(" Key-last comparison:")[0];
assert.ok(priorIndependentPart.endsWith("Complete true set D."));
const review = structuredClone(first);
review.seed_sha256 = digest(seed);
review.draft_sha256 = digest(repaired);
review.reviewer = reviewer;
review.question_reviews[index].mathematics.verdict = "pass";
review.question_reviews[index].mathematics.independent_solution =
  priorIndependentPart + " " + evidence;
const verdicts = [
  ...review.source_reviews.map((row) => row.coverage.verdict),
  ...review.new_figure_reviews.map((row) => row.verdict),
  ...review.question_reviews.flatMap((row) => [
    row.task_fidelity.verdict, row.redundancy.verdict,
    row.answer_leakage.verdict, row.mathematics.verdict,
  ]),
];
review.outcome = verdicts.includes("blocked") ? "blocked" :
  verdicts.includes("revise") ? "revise" : "pass";
assert.equal(review.outcome, "pass");
assert.deepEqual(Object.keys(review).sort(), [
  "schema", "seed_sha256", "draft_sha256", "reviewer", "source_reviews",
  "figure_checks", "new_figure_reviews", "question_reviews", "outcome",
].sort(), "Standard full-bound review has no provenance extensions");
assert.equal(review.schema, "s10y-choice-review-v1");

const inheritedRecords = [];
function inherit(pointer, oldValue, newValue) {
  assert.deepEqual(newValue, oldValue, "Inherited record changed: " + pointer);
  inheritedRecords.push({
    pointer, first_review_sha256: manifest.firstReview.sha256,
    before_canonical_sha256: digest(oldValue), after_canonical_sha256: digest(newValue),
    exactly_equal: true, repeated_review: false,
  });
}
for (const name of ["source_reviews", "figure_checks", "new_figure_reviews"]) {
  inherit("/" + name, first[name], review[name]);
}
for (let position = 0; position < review.question_reviews.length; position++) {
  if (position !== index) {
    assert.equal(first.question_reviews[position].mathematics.verdict, "pass");
    inherit(`/question_reviews/${position}`, first.question_reviews[position], review.question_reviews[position]);
  } else {
    for (const name of ["task_fidelity", "redundancy", "answer_leakage"]) {
      inherit(`/question_reviews/${position}/${name}`,
        first.question_reviews[position][name], review.question_reviews[position][name]);
    }
    for (const name of ["correct", "option_checks"]) {
      inherit(`/question_reviews/${position}/mathematics/${name}`,
        first.question_reviews[position].mathematics[name], review.question_reviews[position].mathematics[name]);
    }
  }
}
assert.equal(review.question_reviews.reduce((count, row) => count + row.mathematics.option_checks.length, 0), 24);
const reviewOutput = write("review.json", review);
const holds = {
  source49_glyph_meaning: "unresolved; not inferred or reinterpreted",
  all_ink_hold: "unchanged",
  first_revise: { ...before.snapshots.firstReview, outcome: "revise", preserved_unchanged: true },
  original_author_and_repaired_candidate: "read-only inputs; not edited",
  historical_informal_CDEF: "FIRST source-solutions and visible records remain sealed; FIRST final review explicitly corrected DCEF",
  historical_source54_coverage_wording: "Inherited EXACTLY, including its reference to the separately recorded internal notation defect; the new affected mathematics record records resolution only for the repaired draft",
  source52_actual_drawings: "Both eight-edge and nine-edge constructions remain unperformed; recognition does not complete them",
  written_proof_and_derivation_capacity: "All original limitations and coverage omissions preserved; no learner proof or counterexample production certified",
  whole_lesson_approved: false,
  inherited_holds_resolved: false,
};
const repairBudget = { cumulative_content_repairs: 1, limit: 1, remaining: 0, reset: false };
const imageLedgerOutput = write("image-ledger.json", {
  schema: "bounded-affected-review-zero-image-ledger-v1",
  scope: "N47 CHOICE two internal strings only",
  images: [], image_opens_planned: 0, image_opens_actual: 0,
  image_loads: 0, crops: 0, reopens: 0, screenshots_opened: 0,
  browser_calls: 0, renderer_calls: 0, new_figure_pixel_observations: 0,
  image_payloads_forwarded: 0, parent_image_loads: 0,
  inherited_figure_checks: { ...before.snapshots.firstReview, pointer: "/figure_checks",
    canonical_sha256: digest(first.figure_checks), reused_exactly: true },
  original_first_image_ledger: getFirstBinding("image-ledger.json"),
  explanation: "Image observations in copied records refer only to prior FIRST work. This invocation opened no source/modern PNG, SVG image, screenshot or renderer and did not rehash asset files.",
});
const affectedOutput = write("affected-review.json", {
  schema: "s10y-choice-affected-review-v1",
  ticket: manifest.ticket, assignment: manifest.assignment, book: manifest.book, lesson: manifest.lesson,
  reviewer, scope: "affected-only internal face-cycle repair; no new source/math/answer/display stages",
  outcome: review.outcome, finding_id: "N47-CHOICE-54-CYCLIC-FACE",
  finding_status: "resolved-in-repaired-draft-only",
  question_id: manifest.changedQuestion,
  bindings: { manifest: before.manifest, ...before.snapshots, review: reviewOutput },
  entire_json_diff: changes, changed_fields: manifest.changedFields, textual_replacements: replacements,
  independent_affected_evidence: evidence,
  incidence_provenance: {
    source_only_FIRST: firstSolutionsBinding,
    pointer: "/figure_observations/0/observation",
    observed_edges: observedEdges, corrected_boundary: "D-C-E-F-D",
    corrected_boundary_edges: correctedEdges, rejected_old_boundary: "C-D-E-F-C",
    absent_old_edges: absentOldEdges,
    final_FIRST_review: { ...before.snapshots.firstReview, pointer: "/figure_checks/0/observation" },
    historical_error_and_final_correction_disclosed: true,
    new_figure_pixel_observation: false,
  },
  unchanged_scope_proof: {
    entire_JSON_compared: true, structural_keys_and_array_lengths_identical: true,
    only_allowed_two_strings_changed: true,
    restoring_only_these_two_strings_reproduces_original_entire_JSON_exactly: true,
    all_views_options_keys_other_fields_identical: true,
    all_package_relationships_and_capacity_limitations_identical: true,
    no_new_figures: repaired.new_figures.length === 0,
    no_new_option_review_or_calculation: true,
  },
  seventh_mathematics: {
    before_verdict: oldQuestionReview.mathematics.verdict,
    after_verdict: review.question_reviews[index].mathematics.verdict,
    before_canonical_sha256: digest(oldQuestionReview.mathematics),
    after_canonical_sha256: digest(review.question_reviews[index].mathematics),
    before_independent_solution: oldQuestionReview.mathematics.independent_solution,
    after_independent_solution: review.question_reviews[index].mathematics.independent_solution,
    complete_true_set: review.question_reviews[index].mathematics.correct,
    complete_true_set_retained_exactly: true,
    option_checks_canonical_sha256: digest(oldQuestionReview.mathematics.option_checks),
    option_checks_retained_exactly: true,
    evidence_added_not_blind_top_verdict_flip: true,
  },
  inherited_records: inheritedRecords, inherited_option_check_count: 24,
  answer_PASS: { ...getFirstBinding("answer-review.json"), repeated: false },
  surface_PASS: { ...getFirstBinding("visual-review.json"), repeated: false },
  repair_budget: repairBudget, holds, zero_image_ledger: imageLedgerOutput,
  native_validation_run: false, publication: false, parent_collection_and_closure_only: true,
});
const after = capture("after");
assert.deepEqual(after.files, before.files, "Inputs or standards changed during review");
assert.deepEqual(after.snapshots, before.snapshots);
assert.deepEqual(after.manifest_hash_checks, before.manifest_hash_checks);
const afterOutput = write("bindings-after.json", {
  ...after, compared_with_before: beforeOutput, changed_input_count: 0,
  all_input_bindings_unchanged: true,
});
const report = {
  schema: "n47-choice-internal-affected-report-v1",
  status: "pass", ticket: manifest.ticket, assignment: manifest.assignment,
  book: manifest.book, lesson: manifest.lesson, reviewer,
  decision_scope: "Repaired N47 CHOICE internal face-cycle only; no whole-lesson/source-hold approval",
  findings: [{
    id: "N47-CHOICE-54-CYCLIC-FACE", before: "revise", after: "pass",
    resolution: "CDEF->DCEF in exactly two internal fields, three occurrences; corrected cycle uses DC,CE,EF,FD and avoids absent DE,FC",
    evidence: affectedOutput, essential_affected_defect_remaining: false,
  }],
  manifest_checks: {
    hash_occurrences: before.manifest_hash_occurrences,
    unique_bound_paths: before.unique_manifest_bound_paths,
    first_index_outputs: firstIndex.outputs.length,
    mismatches_before: 0, mismatches_after: 0, changed_inputs: 0,
  },
  canonical_snapshots: {
    seed: digest(seed), original_draft: digest(original), repaired_draft: digest(repaired),
    old_review: digest(first), new_review: digest(review),
  },
  bindings: {
    manifest: before.manifest, original: before.snapshots.original,
    repaired: before.snapshots.repaired, old_review: before.snapshots.firstReview,
    before: beforeOutput, after: afterOutput,
  },
  inheritance: {
    provenance: "Hash-bound FIRST independent records; not new pixel/source/option evidence",
    records: inheritedRecords,
    six_untouched_questions_reused_exactly: true,
    seventh_fidelity_redundancy_leakage_reused_exactly: true,
    all_24_option_checks_and_complete_truth_sets_reused_exactly: true,
    source_and_figure_reviews_reused_exactly: true,
    answer_and_surface_PASS_not_repeated: true,
    source54_coverage_historical_wording_preserved: holds.historical_source54_coverage_wording,
  },
  repair_budget: repairBudget, holds,
  image_opens_actual: 0, new_figure_pixel_observations: 0,
  restrictions_observed: {
    setup_freshness_grill: "not performed",
    full_source_math_answer_display_reviews: "not repeated",
    author_candidate_edits: "none",
    native_validation_finalize_retention_publish: "not performed",
    git_database_dependencies_credentials_web_model_services: "no calls",
    supervisor_peer_messages: "none",
    sole_write_root: output,
  },
  outputs: { review: reviewOutput, affected_review: affectedOutput, zero_image_ledger: imageLedgerOutput },
  collection_state: "Ready for parent collection/closure; stop. No further repair budget or dependent stage authorized.",
};
write("report.json", report);
write("report.md", [
  "# N47 CHOICE Internal Affected Review",
  "",
  "PASS for the repaired draft only. Sole independent reviewer SAME188-6 / STEMROBIN-188.",
  "",
  "All 29 manifest hash occurrences (23 distinct files) and declared byte counts match before/after. All 17 FIRST index outputs are bound. The entire old/new JSON comparison has exactly two changed strings under questions[6].intent: source_solution (two replacements) and figure_observations[0].observation (one). Every view, option, key, other field, coverage relationship and limitation is identical. No input changed.",
  "",
  "The already-independent FIRST observation supplies DC, CE, EF and FD (DF undirected). D-C-E-F-D uses those four boundary edges; C-D-E-F-C incorrectly needs absent DE and FC. DCEF therefore resolves the actual internal defect and agrees with the explicitly corrected FIRST final source/figure review. The same four vertices, CD/FE bases, plane CDF and five-face area reasoning remain; no angles, areas or options were recalculated.",
  "",
  "The standard full-bound review inherits source_reviews, figure_checks, new_figure_reviews, all six untouched question records and the seventh fidelity/redundancy/leakage records EXACTLY. All 24 option checks and complete truth sets are unchanged. Only the seventh mathematics verdict/solution gains the affected evidence; aggregate PASS is derived from the records. Inheritance digests and structural diff are in affected-review.json.",
  "",
  "FIRST REVISE remains immutable. FIRST source-solutions/visible records also used CDEF informally and remain sealed; the FIRST final review explicitly corrected it. Copied source54 coverage retains its historical defect wording, with repaired-only resolution recorded in the new mathematics and provenance sidecar.",
  "",
  "Source49 glyph convention is unresolved; all-ink/source holds remain. Both source52 drawings remain unperformed. Construction, written-proof and derivation limitations are preserved. No whole-lesson approval or hold resolution is claimed. Cumulative content repair is 1/1 consumed, zero remaining; no reset.",
  "",
  "Zero images opened, zero new pixel observations, no screenshots/browser/renderer. No setup/freshness/Grill, source/math/answer/display reruns, candidate edits, native validation/finalize/retention/publish, Git/DB/dependency/credential/web/model-service calls or supervisor/peer messages.",
  "",
  "Canonical seed: " + digest(seed),
  "Canonical original draft: " + digest(original),
  "Canonical repaired draft: " + digest(repaired),
  "",
  "Artifacts: review.json, affected-review.json, report.json, report.md, bindings-before.json, bindings-after.json, image-ledger.json and assembly script. output-index.json excludes itself; its SHA-256 is returned externally.",
  "",
  "Ready for parent collection/closure. Stop.",
  "",
].join("\n"));

const outputs = fs.readdirSync(output).filter((name) => name !== "output-index.json")
  .sort().map((name) => binding(path.join(output, name)));
const indexOutput = write("output-index.json", {
  schema: "bounded-review-output-index-v1", excludes_self: true, outputs,
});
console.log(JSON.stringify({
  status: review.outcome, outputs: outputs.length, output_index: indexOutput,
  review: reviewOutput, affected_review: affectedOutput,
  canonical_seed_sha256: digest(seed), canonical_repaired_draft_sha256: digest(repaired),
  manifest_hash_occurrences_verified: before.manifest_hash_occurrences,
  unique_manifest_bound_paths: before.unique_manifest_bound_paths,
  inherited_exact_record_groups: inheritedRecords.length,
  inherited_option_checks: 24, input_changes: 0, image_opens: 0,
  cumulative_content_repairs: 1, repair_limit: 1,
  native_validation_run: false, collection_state: "stop-for-parent-collection-and-closure",
}, null, 2));
