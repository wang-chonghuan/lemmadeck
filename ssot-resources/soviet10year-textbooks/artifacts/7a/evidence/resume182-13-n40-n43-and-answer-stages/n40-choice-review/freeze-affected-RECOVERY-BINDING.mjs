import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const checkout = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const scratch = path.join(checkout, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const owner = path.join(scratch, "n40-choice-review");
const disclosure = path.join(scratch, "n40-choice-affected-author/RECOVERY-BINDING");
const hash = data => crypto.createHash("sha256").update(data).digest("hex");
const json = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sort = value => Array.isArray(value) ? value.map(sort) : value && typeof value === "object"
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])])) : value;
const canonicalHash = value => hash(JSON.stringify(sort(value)).replace(/[\u007f-\uffff]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`));
const writeOnce = (name, data) => fs.writeFileSync(path.join(owner, name), data, { flag: "wx", mode: 0o600 });
const writeJson = (name, value) => writeOnce(name, `${JSON.stringify(value, null, 2)}\n`);
const outputNames = [
  "affected-input-snapshot-RECOVERY-BINDING.json",
  "affected-validation-RECOVERY-BINDING.json",
  "affected-hashes-RECOVERY-BINDING.json",
  "affected-stage2-freeze-RECOVERY-BINDING.json",
  "affected-stage2-freeze-RECOVERY-BINDING.sha256"
];
for (const name of outputNames) assert(!fs.existsSync(path.join(owner, name)), `Write-once output exists: ${name}`);
const priorNames = fs.readdirSync(owner).filter(name => !name.includes("RECOVERY-BINDING"));
const preserved = priorNames.map(name => {
  const file = path.join(owner, name);
  assert(fs.statSync(file).isFile(), `Unexpected existing entry ${name}`);
  return { name, path: file, sha256: hash(fs.readFileSync(file)), mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0") };
});
assert(preserved.every(file => file.mode === "0444"));
const expectedInputs = [
  [path.join(disclosure, "seed.json"), "d1380a97e156c61eee1518a9646a820ed130deba4b520ff98385b3d19eff69b4"],
  [path.join(disclosure, "reviewer-views.json"), "430fbfac2c936aeaa12b2f74eaa98313b3bbdf8bc23391e5719a9bdb64469c8e"],
  [path.join(disclosure, "source-provenance.json"), "df9b105f11bddeba89b723666a321a30b297e78e71c69fee55adf69f57007e0a"],
  [path.join(scratch, "n40-choice-affected-author/supplementary-context.json"), "b6210ad66c0260a22ec3974a05fc614edcf908d325dc3505781c4bbebaa08838"],
  [path.join(scratch, "n40-table-cell-review/captures.json"), "aa31b153eef42b3b0abbe5f6407201f28c63ca0a7be68de57f0ff7f096dd048d"],
  [path.join(scratch, "bradis-tables-source-review/source-rules.corrected.json"), "41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46"]
];
const inputs = expectedInputs.map(([file, sha256]) => {
  assert.equal(hash(fs.readFileSync(file)), sha256, `Changed input ${file}`);
  return { path: file, sha256 };
});
const seed = json(path.join(disclosure, "seed.json"));
const views = json(path.join(disclosure, "reviewer-views.json"));
const provenance = json(path.join(disclosure, "source-provenance.json"));
const supplement = json(path.join(scratch, "n40-choice-affected-author/supplementary-context.json"));
const captures = json(path.join(scratch, "n40-table-cell-review/captures.json"));
const iv = json(path.join(scratch, "bradis-tables-source-review/source-rules.corrected.json")).tables.find(table => table.id === "IV");
const first = json(path.join(owner, "FIRST-summary.json"));
const oldSource = json(path.join(owner, "source-solutions.json"));
const review = json(path.join(owner, "affected-view-review-RECOVERY-BINDING.json"));
const truthSets = json(path.join(owner, "affected-every-option-true-sets-RECOVERY-BINDING.json"));
const operations = json(path.join(owner, "affected-source-operations-RECOVERY-BINDING.json"));
assert.equal(canonicalHash(seed), oldSource.seed_sha256);
assert.equal(hash(fs.readFileSync(path.join(disclosure, "seed.json"))), oldSource.seed_file_sha256);
assert.equal(views.seed_sha256, canonicalHash(seed));
assert.equal(provenance.sourceRepoForStructuralValidation, checkout);
assert.equal(views.sourceRepoForStructuralValidation, checkout);
assert.equal(seed.figures.length, 0);
assert.equal(views.questions.length, 3);
assert.equal(captures.captures.length, 8);
const trace = seed.trace.map(entry => {
  const file = path.join(checkout, entry.path);
  assert.equal(hash(fs.readFileSync(file)), entry.sha256);
  return { path: file, sha256: entry.sha256, hashOnlyNoFullSourceReview: true };
});
assert.equal(trace.length, 4);
const ids = ["n40-lookup-method-comparison", "n40-table-ready-plan", "n40-radius-and-area"];
assert.deepEqual(views.questions.map(question => question.id), ids);
assert.deepEqual(truthSets.questions.map(question => question.question_id), ids);
assert.deepEqual(review.questionReviews.map(question => question.question_id), ids);
assert.equal(operations.operations.length, 8);
assert.deepEqual(review.preservedFIRST.unaffected17Approvals, first.unaffected_17_approvals);
assert.equal(first.outcome, "blocked");
assert.equal(review.outcome, "pass");
for (const [index, question] of views.questions.entries()) {
  assert.equal(question.view.mode, "single");
  assert.equal(question.view.options.length, 4);
  assert.equal(question.view.figure_ids.length, 0);
  const mathematics = truthSets.questions[index].mathematics;
  assert.equal(mathematics.verdict, "pass");
  assert.deepEqual(mathematics.option_checks.map(check => check.option_id), question.view.options.map(option => option.id));
  assert.deepEqual(mathematics.correct, mathematics.option_checks.filter(check => check.truth === "correct").map(check => check.option_id));
  assert.equal(mathematics.correct.length, 1);
  for (const check of mathematics.option_checks) assert(check.evidence.length > 40);
  for (const field of ["task_fidelity", "redundancy", "answer_leakage"]) assert.equal(review.questionReviews[index][field].verdict, "pass");
  assert.equal(review.questionReviews[index].missingEssentialTasks.length, 0);
}
for (const verification of operations.factEvidence.cellVerification) {
  const capture = captures.captures[verification.captureIndex];
  assert.equal(verification.rowExact, capture.rowExact);
  assert.equal(verification.column, capture.mainColumnExact);
  assert.equal(verification.printed, capture.mainCellExact);
  assert.equal(verification.viewValue, capture.mainCellExact.replace(",", "."));
  if (verification.correction) {
    assert.equal(verification.correction.column, capture.correction.columnExact);
    assert.equal(verification.correction.printed, capture.correction.cellExact);
  } else assert.equal(capture.correction, null);
}
for (const question of views.questions) {
  const sourceNumber = question.source_numbers[0];
  assert(question.view.stem.includes(supplement.rules));
  assert(question.view.stem.includes(supplement.contexts[sourceNumber].table));
  assert(question.view.stem.includes(supplement.contexts[sourceNumber].condition));
}
const validation = {
  schema: "stemrobin182/n40-affected-stage2-validation@1",
  status: "PASS_THREE_KEYLESS_VIEWS",
  questions: 3,
  everyOptionChecks: 12,
  restoredSourceLookupTasks: 8,
  sourceCaptureCellMatches: 8,
  realTraceMatches: 4,
  seedMatchesOriginalFIRST: true,
  unaffectedFIRSTApprovalsPreserved: 17,
  FIRSTOutcomePreserved: "blocked",
  originalFrozenFilesPreserved: preserved.length,
  newImages: 0,
  repairedDraftKeysAuthorSolvesOrMethodReviewsRead: false,
  nativeFullDraftValidatorRun: false
};
writeJson("affected-input-snapshot-RECOVERY-BINDING.json", {
  schema: "stemrobin182/n40-affected-stage2-input-snapshot@1",
  capturedAtUtc: new Date().toISOString(),
  inputs,
  realTrace: trace,
  affectedOriginalProse: seed.exercises.filter(exercise => ["829", "830", "831"].includes(exercise.number)),
  conceptSelectorsOnly: seed.concepts.map(concept => concept.block),
  seedCanonicalSha256: canonicalHash(seed),
  views,
  supplementaryFactualContext: supplement,
  independentCaptures: captures,
  tableIVRules: iv,
  authorizedProvenanceSidecar: provenance,
  noReferencedDraftAuthorCaptureOrAuthorSolutionOpened: true
});
writeJson("affected-validation-RECOVERY-BINDING.json", validation);
const payloadNames = [
  "affected-source-operations-RECOVERY-BINDING.json",
  "affected-view-review-RECOVERY-BINDING.json",
  "affected-every-option-true-sets-RECOVERY-BINDING.json",
  "affected-input-snapshot-RECOVERY-BINDING.json",
  "affected-validation-RECOVERY-BINDING.json",
  "freeze-affected-RECOVERY-BINDING.mjs"
];
const artifacts = payloadNames.map(name => {
  const bytes = fs.readFileSync(path.join(owner, name));
  return { name, path: path.join(owner, name), sha256: hash(bytes), bytes: bytes.length, mode: "0444" };
});
writeJson("affected-hashes-RECOVERY-BINDING.json", {
  schema: "stemrobin182/n40-affected-stage2-hashes@1",
  algorithm: "sha256",
  inputs: [...inputs, ...trace],
  artifacts,
  preservedFIRSTAndEarlierFreezes: preserved
});
const hashesFile = path.join(owner, "affected-hashes-RECOVERY-BINDING.json");
writeJson("affected-stage2-freeze-RECOVERY-BINDING.json", {
  schema: "stemrobin182/n40-affected-stage2-freeze@1",
  ticket: "STEMROBIN-182",
  frozenAtUtc: new Date().toISOString(),
  status: "FROZEN_PRE_KEY_PASS_THREE_AFFECTED_VIEWS",
  writeOnce: true,
  mode: "0444",
  owner,
  seedCanonicalSha256: canonicalHash(seed),
  viewsCanonicalSha256: canonicalHash(views),
  viewsFileSha256: inputs[1].sha256,
  declaredDraftCanonicalSha256: views.draft_sha256,
  repairedDraftDigestIndependentlyVerified: false,
  sourceOperations: artifacts[0],
  viewReview: artifacts[1],
  everyOptionTrueSets: artifacts[2],
  hashManifest: { path: hashesFile, sha256: hash(fs.readFileSync(hashesFile)) },
  validation,
  completeTrueSets: truthSets.completeTrueSets,
  FIRSTUnchanged: { canonicalOutcome: "blocked", unaffectedApprovals: first.unaffected_17_approvals, artifacts: preserved },
  noRepairedKeyDisclosureBeforeFreeze: true,
  noCanonicalFullDraftApprovalClaimed: true,
  nextN40Action: "Stop before repaired keys; await explicit disclosure.",
  nextSeparateAction: "The user authorized n41 RECOVERY1 Stage2 answer comparison only after this affected pre-key freeze."
});
const checksumNames = [...payloadNames, "affected-hashes-RECOVERY-BINDING.json", "affected-stage2-freeze-RECOVERY-BINDING.json"];
writeOnce("affected-stage2-freeze-RECOVERY-BINDING.sha256", checksumNames.map(name => `${hash(fs.readFileSync(path.join(owner, name)))}  ${name}\n`).join(""));
for (const input of [...inputs, ...trace]) assert.equal(hash(fs.readFileSync(input.path)), input.sha256);
for (const old of preserved) {
  assert.equal(hash(fs.readFileSync(old.path)), old.sha256, `Preserved artifact changed ${old.name}`);
  assert.equal((fs.statSync(old.path).mode & 0o777).toString(8).padStart(4, "0"), old.mode);
}
for (const name of [...checksumNames, "affected-stage2-freeze-RECOVERY-BINDING.sha256"]) fs.chmodSync(path.join(owner, name), 0o444);
console.log(JSON.stringify({
  ...validation,
  frozenMode: "0444",
  viewReview: artifacts[1],
  everyOptionTrueSets: artifacts[2],
  freezeReceipt: { path: path.join(owner, "affected-stage2-freeze-RECOVERY-BINDING.json"), sha256: hash(fs.readFileSync(path.join(owner, "affected-stage2-freeze-RECOVERY-BINDING.json"))) }
}, null, 2));
