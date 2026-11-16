import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const root = ".intentfold/tickets/STEMROBIN-182/tmp/5m-n40";
const archive = path.join(root, "history/position-cycle-before");
const reviewerPath = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-5m-n40/view-checks.json";
const evidencePath = path.join(root, "position-cycle-repair-evidence.json");
const readyPath = path.join(root, "ready-position-repaired.json");
assert.ok(!fs.existsSync(evidencePath) && !fs.existsSync(readyPath),
  "Refusing to repeat the independent read-only delta check.");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const byteSha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const before = read(path.join(archive, "draft.json"));
const after = read(path.join(root, "draft.json"));
const oldView = read(path.join(archive, "view.json"));
const newView = read(path.join(root, "view.json"));
const reviewer = read(reviewerPath);
const swaps = new Map([
  [6, ["A", "C"]],
  [10, ["A", "D"]],
  [14, ["A", "B"]],
  [20, ["A", "C"]],
  [24, ["A", "D"]],
]);
assert.equal(before.questions.length, 28);
assert.equal(after.questions.length, 28);
assert.equal(after.questions.reduce((n, q) => n + q.view.options.length, 0), 112);
const project = draft => ({
  questions: draft.questions.map(({ id, source_numbers, view }) => ({
    id, source_numbers, view,
  })),
});
assert.deepEqual(oldView, project(before));
assert.deepEqual(newView, project(after));
assert.deepEqual(after.coverage, before.coverage);
assert.deepEqual(after.new_figures, before.new_figures);
assert.equal(after.seed_sha256, before.seed_sha256);
const restored = structuredClone(after);
const permutationMap = [];
const beforeTruths = [];
const afterTruths = [];
const changedQuestions = [];
const unchangedQuestions = [];
const actualLabelReferences = [];

for (let i = 0; i < before.questions.length; i++) {
  const oldQ = before.questions[i];
  const newQ = after.questions[i];
  const labels = oldQ.view.options.map(o => o.id);
  assert.deepEqual(labels, ["A", "B", "C", "D"]);
  assert.deepEqual(newQ.view.options.map(o => o.id), labels);
  assert.equal(oldQ.view.mode, "single");
  assert.equal(newQ.view.mode, "single");
  assert.deepEqual(newQ.intent, oldQ.intent);
  assert.deepEqual(newQ.source_numbers, oldQ.source_numbers);
  assert.equal(newQ.id, oldQ.id);
  assert.equal(newQ.view.stem, oldQ.view.stem);
  assert.deepEqual(newQ.view.figure_ids, oldQ.view.figure_ids);
  const swap = swaps.get(i);
  const remap = id => swap && id === swap[0] ? swap[1] :
    swap && id === swap[1] ? swap[0] : id;
  const oldToNew = Object.fromEntries(labels.map(id => [id, remap(id)]));
  const newToOld = Object.fromEntries(labels.map(id => [id, remap(id)]));
  const review = reviewer.question_reviews.find(r => r.question_id === oldQ.id);
  assert.ok(review, oldQ.id);
  assert.deepEqual(review.mathematics.correct, oldQ.key.correct);
  beforeTruths.push(review.mathematics.correct[0]);
  afterTruths.push(remap(review.mathematics.correct[0]));
  for (const id of labels) {
    const oldOption = oldQ.view.options.find(o => o.id === id);
    const newOption = newQ.view.options.find(o => o.id === remap(id));
    assert.deepEqual(newOption, { ...oldOption, id: remap(id) });
    const oldRationale = oldQ.key.rationales.find(r => r.option_id === id);
    const newRationale = newQ.key.rationales.find(r => r.option_id === remap(id));
    assert.deepEqual(newRationale, { ...oldRationale, option_id: remap(id) });
    const independentlyChecked = review.mathematics.option_checks.find(c => c.option_id === id);
    assert.equal(oldRationale.truth, independentlyChecked.truth);
    assert.equal(newRationale.truth, independentlyChecked.truth);
    if (swap) {
      for (const field of ["derivation", "misconception"]) {
        const text = oldRationale[field];
        if (typeof text === "string" &&
            /(?:选项|候选|答案|记录)\s*[ABCD]|[ABCD](?:选项|候选|答案|记录)|\b(?:option|candidate)\s+[ABCD]\b/i.test(text)) {
          actualLabelReferences.push({ index: i, option_id: id, field, text });
        }
      }
    }
  }
  assert.deepEqual(newQ.key.correct, oldQ.key.correct.map(remap));
  if (swap) {
    changedQuestions.push(oldQ.id);
    const q = restored.questions[i];
    q.view.options = labels.map(id => ({
      ...newQ.view.options.find(o => o.id === remap(id)), id,
    }));
    q.key.correct = newQ.key.correct.map(remap);
    q.key.rationales = labels.map(option_id => ({
      ...newQ.key.rationales.find(r => r.option_id === remap(option_id)), option_id,
    }));
  } else {
    assert.deepEqual(newQ, oldQ);
    unchangedQuestions.push(oldQ.id);
  }
  permutationMap.push({
    zero_based_index: i,
    one_based_question: i + 1,
    question_id: oldQ.id,
    source_numbers: oldQ.source_numbers,
    changed: Boolean(swap),
    swapped_labels: swap || [],
    old_to_new: oldToNew,
    new_to_old: newToOld,
    new_position_old_candidate_order: labels.map(remap),
    independent_true_before: review.mathematics.correct,
    independent_true_rebound: review.mathematics.correct.map(remap),
  });
}
assert.deepEqual(restored, before);
assert.equal(changedQuestions.length, 5);
assert.equal(unchangedQuestions.length, 23);
assert.deepEqual(actualLabelReferences, []);
const savedSequence = reviewer.package_checks.position_leakage.independent_true_sequence;
assert.deepEqual(beforeTruths, savedSequence);
assert.equal(beforeTruths.slice(6, 17).join(""), "ABCDABCDABC");
assert.equal(beforeTruths.slice(20, 28).join(""), "ABCDABCD");
assert.equal(afterTruths.slice(6, 17).join(""), "CBCDDBCDBBC");
assert.equal(afterTruths.slice(20, 28).join(""), "CBCDDBCD");
const fieldDeltas = [];
function diff(a, b, pointer = "") {
  if (JSON.stringify(a) === JSON.stringify(b)) return;
  if (a !== null && b !== null && typeof a === "object" && typeof b === "object" &&
      Array.isArray(a) === Array.isArray(b) &&
      (!Array.isArray(a) || a.length === b.length)) {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      diff(a[key], b[key], `${pointer}/${key}`);
    }
  } else {
    fieldDeltas.push({ path: pointer, before: a, after: b });
  }
}
diff(before, after);
for (const delta of fieldDeltas) {
  const match = delta.path.match(/^\/questions\/(\d+)\/(?:view\/options\/|key\/(?:correct\/|rationales\/))/);
  assert.ok(match && swaps.has(Number(match[1])), delta.path);
}
const unchangedFiles = [];
for (const name of fs.readdirSync(archive)) {
  if (["draft.json", "view.json"].includes(name)) continue;
  assert.ok(fs.readFileSync(path.join(archive, name)).equals(
    fs.readFileSync(path.join(root, name))), `Unrelated file changed: ${name}`);
  unchangedFiles.push({ filename: name, byte_sha256: byteSha(path.join(root, name)) });
}
function canonicalDigest(file) {
  const run = spawnSync("python3", [
    ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", file,
  ], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr);
  const result = run.stdout.trim();
  assert.match(result, /^[a-f0-9]{64}$/);
  return result;
}
const digests = {
  seed_sha256: canonicalDigest(path.join(root, "seed.json")),
  draft_before_sha256: canonicalDigest(path.join(archive, "draft.json")),
  draft_after_sha256: canonicalDigest(path.join(root, "draft.json")),
  view_before_sha256: canonicalDigest(path.join(archive, "view.json")),
  view_after_sha256: canonicalDigest(path.join(root, "view.json")),
};
assert.equal(digests.seed_sha256, after.seed_sha256);
assert.equal(digests.view_before_sha256, reviewer.view_sha256);
const evidence = {
  stage: "author-position-only-repair",
  role: "Repair author; not a new semantic reviewer.",
  status: "frozen-awaiting-Socrates-mapping-and-pure-view-review",
  archive,
  archived_top_level_file_count: fs.readdirSync(archive).length,
  reviewer_evidence_path: reviewerPath,
  reviewer_evidence_byte_sha256: byteSha(reviewerPath),
  question_count: 28,
  option_count: 112,
  changed_question_count: 5,
  unchanged_question_count: 23,
  exact_json_field_delta_count: fieldDeltas.length,
  digests,
  draft_before_byte_sha256: byteSha(path.join(archive, "draft.json")),
  draft_after_byte_sha256: byteSha(path.join(root, "draft.json")),
  view_before_byte_sha256: byteSha(path.join(archive, "view.json")),
  view_after_byte_sha256: byteSha(path.join(root, "view.json")),
  permutation_map: permutationMap,
  exact_json_field_deltas: fieldDeltas,
  unchanged_questions: unchangedQuestions,
  unchanged_questions_canonical_proof: "Every one of the other 23 question objects is deeply equal to its archived object. Inverting the five declared permutations restores the entire original draft exactly.",
  unchanged_top_level_files: unchangedFiles,
  actual_label_reference_edits: actualLabelReferences,
  label_reference_note: "Selected rationale programs contain no actual option-letter references; derivation and misconception strings travel unchanged with their original candidate. Mathematical variable letters are not relabeled.",
  position_rebinding: {
    independently_saved_sequence_before: beforeTruths,
    sequence_rebound_only: afterTruths,
    original_run_7_17: "ABCDABCDABC",
    repaired_run_7_17: afterTruths.slice(6, 17).join(""),
    original_run_21_28: "ABCDABCD",
    repaired_run_21_28: afterTruths.slice(20, 28).join(""),
    note: "Rebinding arithmetic only, not a fresh semantic package pass; independent reviewer makes the subsequent leakage verdict.",
  },
  source721_blocker_preserved: {
    first_question_canonical_unchanged: true,
    all_coverage_canonical_unchanged: true,
    reviewer_blocked_record_unmodified: true,
  },
  delta_check: {
    execution_count: 1,
    result: "pass",
    input_files_read_only: true,
    no_new_mathematics_solved_or_changed: true,
    pure_view_exact_projection: true,
    option_content_truth_program_correspondence_preserved: true,
  },
  original_readiness_and_structural_records_preserved: true,
  structural_executions_this_repair: 0,
  canonical_executions_this_repair: 0,
  browser_executions_this_repair: 0,
  durable_writes: false,
  in_flight_operations: [],
  model: null,
  usage: null,
};
fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2) + "\n", { flag: "wx" });
const ready = {
  stage: evidence.status,
  role: evidence.role,
  lesson: "math5-c2-s1-n40",
  seed_path: path.join(root, "seed.json"),
  draft_path: path.join(root, "draft.json"),
  view_path: path.join(root, "view.json"),
  evidence_path: evidencePath,
  archive,
  ...digests,
  questions: 28,
  options: 112,
  changed_questions: 5,
  unchanged_questions: 23,
  exact_json_field_delta_count: fieldDeltas.length,
  source721_blocker_preserved: true,
  original_author_status_and_validation_preserved: true,
  structural_executions_this_repair: 0,
  canonical_executions_this_repair: 0,
  browser_executions_this_repair: 0,
  in_flight_operations: [],
  model: null,
  usage: null,
};
fs.writeFileSync(readyPath, JSON.stringify(ready, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(ready, null, 2));
