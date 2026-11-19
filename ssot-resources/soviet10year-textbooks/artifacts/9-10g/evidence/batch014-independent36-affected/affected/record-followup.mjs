import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const originalRoot = ".tmp/s10y-choice/batch014-independent36";
const root = `${originalRoot}/affected`;
const oldDraftPath = ".tmp/s10y-choice/batch014-repair36-option-order/draft.json";
const candidatePath = ".tmp/s10y-choice/batch014-repair36-internal-evidence/draft.json";
const receiptPath = ".tmp/s10y-choice/batch014-repair36-internal-evidence/repair-receipt.json";
const viewPath = ".tmp/s10y-choice/batch014-repair36-option-order/view-only.json";
const seedPath = ".tmp/s10y-choice/batch014-author36/seed.json";
const identity = "Confucius (01a1f0ef-c431-7580-80fe-f3e094d72911), independent reviewer for worker184-3";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const read = (file) => JSON.parse(fs.readFileSync(file));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const entry = (file) => ({ path: file, sha256: sha(file) });
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const canonicalValue = (value) => {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]));
};
const canonical = (value) => JSON.stringify(canonicalValue(value))
  .replace(/[\u007f-\uffff]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
const digest = (value) => crypto.createHash("sha256").update(canonical(value)).digest("hex");
const same = (left, right) => canonical(left) === canonical(right);
const write = (name, value) => fs.writeFileSync(path.join(root, name), value, { flag: "wx" });
const writeJSON = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);

const generatedNames = [
  "review.json", "verification.json", "validation.json",
  "validation.stdout.txt", "validation.stderr.txt", "artifact-hashes.json",
];
for (const name of generatedNames) {
  assert(!fs.existsSync(path.join(root, name)), "Affected followup already recorded; do not rerun");
}
const originalManifestPath = `${originalRoot}/artifact-hashes.json`;
assert(sha(originalManifestPath) === "3b42bd3fee31db5de930aea8c76edfe63f83d4419c91cb3cad2a4c2622fd8206",
  "Original manifest changed");
const originals = [...read(originalManifestPath).files, entry(originalManifestPath)];
const verifyOriginals = () => {
  for (const file of originals) assert(sha(file.path) === file.sha256, `Original changed: ${file.path}`);
};
verifyOriginals();
assert(sha(oldDraftPath) === "153c22566cbb9e4af39e40efc4043fd877971d54c837256249749226cb2c1d77", "Previous draft changed");
assert(sha(candidatePath) === "2b0b69aed672bfceea6788b0c25f714ba3d93a74692de4d94e2ea11dbf01a55e", "Candidate SHA mismatch");
assert(sha(viewPath) === "21aaa3a2dcb106db3563b22e6f439a1f0ffcd238a173b78bce9e09751c3ce134", "View SHA mismatch");
const previous = read(oldDraftPath);
const candidate = read(candidatePath);
const repair = read(receiptPath);
const differences = [];
const walk = (before, after, pointer = "") => {
  if (same(before, after)) return;
  if (before && after && typeof before === "object" && typeof after === "object"
    && Array.isArray(before) === Array.isArray(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      walk(before[key], after[key], `${pointer}/${key}`);
    }
  } else {
    differences.push({ path: pointer, before, after });
  }
};
walk(previous, candidate);
const allowedPointers = [
  "/questions/4/key/rationales/2/misconception",
  "/questions/5/key/rationales/2/derivation",
];
assert(same(differences.map((item) => item.path), allowedPointers), "Unexpected candidate changes");
assert(repair.sourceSha256 === sha(oldDraftPath) && repair.outputSha256 === sha(candidatePath),
  "Repair receipt snapshot mismatch");
assert(repair.viewSha256 === sha(viewPath) && repair.repairs.length === 2, "Repair receipt scope mismatch");
for (const [index, difference] of differences.entries()) {
  const declared = repair.repairs[index];
  assert(declared.before === difference.before && declared.after === difference.after, "Receipt differs from actual patch");
}
const projectedView = {
  questions: candidate.questions.map((question) => ({ question_id: question.id, view: question.view })),
};
assert(same(projectedView, read(viewPath)), "Candidate view content changed");
const projectedBytes = Buffer.from(`${JSON.stringify(projectedView, null, 2)}\n`);
assert(projectedBytes.equals(fs.readFileSync(viewPath)), "Candidate view serialization differs from original bytes");

const oldReview = read(`${originalRoot}/review.json`);
assert(oldReview.outcome === "revise", "Original failure must be retained");
const review = structuredClone(oldReview);
review.reviewer.identity = identity;
review.draft_sha256 = digest(candidate);
review.outcome = "pass";
const changes = [
  {
    question_id: "n36-rectangle",
    independent_solution: "Affected-only repair accepted; independent true set remains b, unchanged from the original view-first review. Squared lengths remain h^2,h^2+x^2,h^2+y^2,h^2+x^2+y^2, with B/D right and MC longest, MA shortest. The repaired c misconception now genuinely produces the wrong bundle: retain the correct right angles, omit MA and MC from comparison, unjustifiably assume x>y, obtain MB^2-MD^2=x^2-y^2>0, and promote the restricted pair's maximum MB and minimum MD to global extrema. For example x=2,y=1,h=1 gives pair squared lengths5 and2 but actual global squared extrema6 and1. This is a concrete mistaken procedure, not an asserted picture label. All unaffected source/fidelity/leakage/option/image checks reused without re-solving.",
    evidence: "c remains false because MC^2-MB^2=y^2>0 and MD^2-MA^2=y^2>0. The repaired wrong procedure compares only MB/MD, invents AB>AD, and reports their local extrema as all-four extrema; it now derives exactly MB-longest/MD-shortest while preserving the correct B/D angles. With x=2,y=1,h=1 it reports squared extrema5/2 instead of6/1. Only this misconception-generation defect was rechecked; unchanged true set b and other option checks reused.",
  },
  {
    question_id: "n36-triangle-construction",
    independent_solution: "Affected-only repair accepted; independent true set remains d. Repaired c derivation no longer assumes F is interior: the lines through M and N parallel to MN coincide with the fixed normal and meet the triangle plane only at F. Three supporting side lines of a nondegenerate triangle have no common point, so they cannot all be met by that one normal. An exterior/interior F meets none or perhaps one supporting line; a vertex meets its two incident side lines but not the opposite line. Thus the recipe fails for all allowed F locations without reading spatial foot position from pixels. All unaffected construction, source/fidelity/leakage/option/image checks reused without replay.",
    evidence: "c remains false. The revised argument uses only the unique plane intersection F and nonconcurrence of all three side lines, not M's projected interiority or a guessed endpoint foot. Even at a vertex F the third side line is missed. The existing direction-versus-incidence misconception is still concrete and unchanged. The unsupported 'depicted interior F' premise is removed; unchanged correct set d and other option checks reused.",
  },
];
for (const change of changes) {
  const question = review.question_reviews.find((item) => item.question_id === change.question_id);
  assert(question.mathematics.verdict === "revise", "Affected original finding missing");
  question.mathematics.verdict = "pass";
  question.mathematics.independent_solution = change.independent_solution;
  question.mathematics.option_checks.find((item) => item.option_id === "c").evidence = change.evidence;
}

// Only the two failed evidence records, outcome, digest and attribution may change.
const restoredReview = structuredClone(review);
restoredReview.reviewer = oldReview.reviewer;
restoredReview.draft_sha256 = oldReview.draft_sha256;
restoredReview.outcome = oldReview.outcome;
for (const { question_id: questionId } of changes) {
  const oldMath = oldReview.question_reviews.find((item) => item.question_id === questionId).mathematics;
  restoredReview.question_reviews.find((item) => item.question_id === questionId).mathematics = oldMath;
  const newMath = review.question_reviews.find((item) => item.question_id === questionId).mathematics;
  assert(same(newMath.correct, oldMath.correct), "Affected true set changed");
  for (const option of newMath.option_checks) {
    const oldOption = oldMath.option_checks.find((item) => item.option_id === option.option_id);
    assert(option.truth === oldOption.truth, "Affected option truth changed");
    if (option.option_id !== "c") assert(same(option, oldOption), "Unaffected option evidence changed");
  }
}
assert(same(restoredReview, oldReview), "Unrelated original review content changed");
writeJSON("review.json", review);

const args = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", seedPath,
  "--draft", candidatePath,
  "--review", `${root}/review.json`,
];
const startedAt = new Date().toISOString();
const result = spawnSync("python3", args, {
  cwd,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
});
if (result.error) throw result.error;
write("validation.stdout.txt", result.stdout);
write("validation.stderr.txt", result.stderr);
writeJSON("validation.json", {
  schema: "s10y-choice-native-validation-receipt@1",
  cwd,
  command: ["python3", ...args],
  runs: 1,
  startedAt,
  endedAt: new Date().toISOString(),
  exit_code: result.status,
  signal: result.signal,
  stdout: result.stdout,
  stderr: result.stderr,
  stdout_file: entry(`${root}/validation.stdout.txt`),
  stderr_file: entry(`${root}/validation.stderr.txt`),
  input_files: [seedPath, candidatePath, `${root}/review.json`].map(entry),
  image_opens: 0,
  limitation: "One native validation for this repaired snapshot only; semantic evidence is reused plus the two affected checks.",
});
verifyOriginals();
writeJSON("verification.json", {
  schema: "s10y-choice-affected-only-followup@1",
  reviewer: identity,
  cwd,
  owned_root: root,
  outcome: review.outcome,
  previous_review: entry(`${originalRoot}/review.json`),
  candidate: entry(candidatePath),
  candidate_canonical_sha256: review.draft_sha256,
  repair_receipt: entry(receiptPath),
  view: entry(viewPath),
  projected_view_bytes_equal: true,
  exact_candidate_changes: differences,
  only_two_review_math_evidences_updated: true,
  all_unaffected_review_checks_reused_unchanged: true,
  original_files_checked_before_and_after: originals.length,
  original_file_bytes: originals.reduce((total, item) => total + fs.statSync(item.path).size, 0),
  original_hashes_unchanged: true,
  original_files: originals,
  parent_reported_retention_sha256: "0dd18b0c77b8f76162eb044017b90eef1bb88f577dea5274a9739632954ce86a",
  parent_retention_not_reopened: true,
  answer_gate_reused: {
    ...entry(`${originalRoot}/answer-gate.json`),
    outcome: "pass",
    semantic_only: true,
    rechecked: false,
    snapshot: entry(`${originalRoot}/answer-keys.input.json`),
  },
  new_image_opens: 0,
  cumulative_image_opens: 7,
  task_image_limit: 8,
  remaining_image_opens: 1,
  native_validation_exit: result.status,
  validator_runs_on_new_snapshot: 1,
  answer_contracts_or_finalize_runs: 0,
  writes_outside_affected_root: 0,
  limitations: [
    "Not a new whole-package/source/image review; all unaffected checks are carried forward from the immutable first review.",
    "Answer11/11 semantic pass remains bound to its original snapshot; parent owns finalize and input-chain/product acceptance.",
    "No image reopens or counter resets, paid/network/Git/DB/publish/other-chat/descendant operations.",
  ],
});
const outputs = fs.readdirSync(root).filter((name) => name !== "artifact-hashes.json")
  .filter((name) => fs.statSync(path.join(root, name)).isFile()).sort()
  .map((name) => entry(`${root}/${name}`));
writeJSON("artifact-hashes.json", {
  schema: "s10y-choice-affected-output-hashes@1",
  reviewer: identity,
  cwd,
  choice_outcome: review.outcome,
  native_validation_exit: result.status,
  new_image_opens: 0,
  cumulative_image_opens: 7,
  original_hashes_unchanged: true,
  files: outputs,
  excluded_self: "No self-referential hash",
});
verifyOriginals();
console.log(JSON.stringify({
  outcome: review.outcome,
  native_validation_exit: result.status,
  stdout: result.stdout,
  stderr: result.stderr,
  review: entry(`${root}/review.json`),
  verification: entry(`${root}/verification.json`),
  validation: entry(`${root}/validation.json`),
  manifest: entry(`${root}/artifact-hashes.json`),
  original_files: originals.length,
  original_hashes_unchanged: true,
  new_image_opens: 0,
  cumulative_image_opens: 7,
}, null, 2));
