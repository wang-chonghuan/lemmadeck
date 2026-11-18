import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const base = path.dirname(root);
const originalRoot = path.join(base, "d495-t13-first-bilingual-written-answer-author");
const reviewRoot = path.join(base, "d500-t13-first-independent-written-answer-review");
const pointer = "/answers/4/displayAnswer";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const mode = (file) => `0${(fs.statSync(file).mode & 0o777).toString(8)}`;
const metadata = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length, mode: mode(file) };
};
const verified = (file, sha256, bytes) => {
  const result = metadata(file);
  assert.equal(result.sha256, sha256, file);
  assert.equal(result.mode, "0444", file);
  if (bytes !== undefined) assert.equal(result.bytes, bytes, file);
  return result;
};
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (name, value) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(file, 0o444);
  return metadata(file);
};

const originalFreeze = verified(
  path.join(originalRoot, "author-freeze.json"),
  "1e620eae4557c3eb83ea539cb358c148b04f7b05eb7dfd8bb04747d21dcd6dff",
);
const reviewReport = verified(
  path.join(reviewRoot, "report.json"),
  "4d2002fc0f607a4ce961d7dc13f2714471681e8ddfa5d354493473017df02d17",
);
const reviewFreeze = verified(
  path.join(reviewRoot, "review-freeze.json"),
  "f5159d7645c79e7bb1c896502fe0af4769be9d34612a3ea3629cc40a87d5fe54",
);
const priorLedger = verified(
  path.join(base, "d511-source167-first-original-detail-and-gate-review/actual-opens.json"),
  "1605d1cf3d9b1f43c9750d20076e765837217323448cd8e5109c33358e866fff",
);
const prior = load(priorLedger.path);
assert.equal(prior.context_cumulative_opens, 24);
assert.equal(prior.remaining_context_capacity, 0);
const reviewed = load(reviewReport.path);
assert.equal(reviewed.uniqueNecessaryRepair.Q2Changes, "NONE");
assert.equal(reviewed.uniqueNecessaryRepair.batches, 1);
assert.deepEqual(reviewed.confirmedCandidateDefects.map((d) => d.id), ["S005"]);
const originalFiles = load(originalFreeze.path).files.map((file) => {
  assert.ok(file.path.startsWith(`${originalRoot}/`));
  return verified(file.path, file.sha256, file.bytes);
});

// Compare every JSON value; no non-target field is exempted from the scope check.
function differences(before, after, location = "") {
  if (Object.is(before, after)) return [];
  const beforeObject = before !== null && typeof before === "object";
  const afterObject = after !== null && typeof after === "object";
  if (!beforeObject || !afterObject) return [{ pointer: location, before, after }];
  assert.equal(Array.isArray(before), Array.isArray(after), location);
  assert.deepEqual(Object.keys(before), Object.keys(after), location);
  return Object.keys(before).flatMap((key) => {
    const escaped = key.replaceAll("~", "~0").replaceAll("/", "~1");
    return differences(before[key], after[key], `${location}/${escaped}`);
  });
}

const candidates = [];
const beforeCopies = [];
const changes = [];
for (const locale of ["zh", "en"]) {
  const relative = `${locale}/answer-keys.candidate.json`;
  const originalFile = path.join(originalRoot, "candidate", relative);
  const beforeFile = path.join(root, "evidence/before", relative);
  const candidateFile = path.join(root, "candidate", relative);
  const originalBytes = fs.readFileSync(originalFile);
  assert.ok(originalBytes.equals(fs.readFileSync(beforeFile)), "Before copy differs");
  const before = JSON.parse(originalBytes);
  const afterBytes = fs.readFileSync(candidateFile);
  const after = JSON.parse(afterBytes);
  const delta = differences(before, after);
  assert.equal(delta.length, 1, locale);
  assert.equal(delta[0].pointer, pointer, locale);
  assert.equal(typeof delta[0].before, "string");
  assert.equal(typeof delta[0].after, "string");

  // Also prove byte-for-byte preservation outside the single encoded JSON string.
  const originalText = originalBytes.toString("utf8");
  const oldString = JSON.stringify(delta[0].before);
  const newString = JSON.stringify(delta[0].after);
  const position = originalText.indexOf(oldString);
  assert.ok(position >= 0);
  assert.equal(originalText.indexOf(oldString, position + oldString.length), -1);
  const expectedText = originalText.slice(0, position)
    + newString + originalText.slice(position + oldString.length);
  assert.ok(Buffer.from(expectedText).equals(afterBytes), "Non-target bytes changed");
  assert.equal(after.answers.length, 7);
  for (const answer of after.answers) {
    assert.equal(answer.grading, "ungraded");
    assert.deepEqual(answer.parts, []);
    assert.equal(answer.scientificApproval, false);
    assert.equal(answer.figureApproval, false);
    assert.equal(answer.displayApproval, false);
  }
  fs.chmodSync(candidateFile, 0o444);
  fs.chmodSync(beforeFile, 0o444);
  candidates.push({ locale, ...metadata(candidateFile) });
  beforeCopies.push({ locale, originalPath: originalFile, ...metadata(beforeFile) });
  changes.push({ locale, path: candidateFile, ...delta[0] });
}
assert.equal(changes.length, 2);

const diffEvidence = write("exact-two-leaf-diff.json", {
  schema: "STEMROBIN-181/d514-exact-two-leaf-diff@1",
  method: "Recursive JSON-parser comparison and byte equality outside each changed encoded string",
  totalChangedLeaves: 2,
  changedPointers: changes.map(({ locale, pointer: leaf }) => ({ locale, pointer: leaf })),
  beforeCopies,
  candidates,
  changes,
  allOther12DisplayAnswerStringsUnchanged: true,
  allNonTargetJSONValuesUnchanged: true,
  allBytesOutsideAuthorizedJSONStringUnchanged: true,
  sourceSnapshotsConditionsUnresolvedIDsPagesGradingPartsKeysSolutionBindingsUnchanged: true,
  mathematicalOrSemanticApproval: false,
});
const inputBindings = write("input-bindings.json", {
  schema: "STEMROBIN-181/d514-input-bindings@1",
  originalFreeze,
  originalFiles,
  authorizedReviewReport: reviewReport,
  authorizedReviewFreeze: reviewFreeze,
  priorLedger,
  beforeCopies,
  original17FrozenFilesVerifiedSHA256BytesMode0444: true,
  reviewerBaselineAndSolutionsFilesRead: false,
  sourceSolutionContentsReadOrRederived: false,
  sourceSolutionAndSourceExercisesBytesHashVerifiedOnly: true,
  initialCandidateCopiesWereByteIdenticalBeforeManualApplyPatch: true,
});
const ledger = write("actual-opens.json", {
  schema: "STEMROBIN-181/d514-zero-image-batch@1",
  ticket: "STEMROBIN-181",
  task: path.basename(root),
  prior_record: priorLedger,
  prior_actual_opens: 24,
  batch_actual_opens: 0,
  context_cumulative_opens: 24,
  context_cumulative_limit: 24,
  remaining_context_capacity: 0,
  no_budget_reset: true,
  entries: [],
  reopens: 0,
  images_returned_to_parent: 0,
  further_image_opens_forbidden: true,
  batch_complete: true,
});
const report = write("report.json", {
  schema: "STEMROBIN-181/d514-t13-q5-written-answer-repair@1",
  ticket: "STEMROBIN-181",
  task: path.basename(root),
  lesson: "phy10-c2-s2-t13",
  status: "Q5-ONLY-FIRST-NECESSARY-REPAIR-FROZEN-AFFECTED-INDEPENDENT-PENDING",
  scope: "Only the two Q5 displayAnswer strings; no new source solving or review replay",
  authority: { reviewReport, reviewFreeze, uniqueNecessaryRepair: reviewed.uniqueNecessaryRepair },
  repair: {
    defect: "S005",
    localRepairBatches: 1,
    editingMethod: "Byte-copy actual frozen d495 candidates; manual apply_patch only",
    changedLeaves: changes.map(({ locale, path: file, pointer: leaf }) => ({
      locale, path: file, pointer: leaf,
    })),
    exactLeafCount: 2,
    appliedChanges: [
      "Exact-normal entry, long-face observation and emergence for exact 45-degree routes",
      "Backward trace limited to a first short-face hit on the lower newspaper-facing face before its n_b criterion",
      "Oblique branch explicitly binds common exterior n_e, n_g>n_e and theta_c=arcsin(n_e/n_g)",
    ],
    retained: [
      "Source media/contact/viewing HOLD",
      "Finite-prism/newspaper/observer path intersection qualification",
      "Oblique-path visibility caveat and weaker Fresnel-reflection caveat",
      "No unconditional source yes/no, figure approval or automatic grading",
    ],
    nonDisplayLegacyNearNormalMetadata: "Unchanged as explicitly required; not a renewed scientific assertion or endorsement",
  },
  scopeCorrection: {
    authority: reviewed.latestHumanScopeCorrection,
    Q2: "Authorized explicitly conditional 1.4 cm branch requires no repair; measurement HOLD remains",
    Q2Changed: false,
    allOther12DisplayAnswersChanged: false,
    conditionsUnresolvedIDsSourceSnapshotsGradingKeysSolutionBindingChanged: false,
  },
  candidates,
  evidence: { diffEvidence, inputBindings, ledger },
  retainedHistory: {
    d495OriginalCandidateBytesAnd17FreezeBindings: "All preserved and hash/byte/mode verified",
    firstFormatFailure: reviewed.authorFirstStructuralFailureHistory,
    d500OriginalSCI: "FAIL-Q5-S005 remains immutable historical evidence",
    d500OtherSixSCI: "Existing scoped PASS inherited only for unchanged text; not reviewed again",
    d500ZHEN: "Existing scoped PASS; repaired Q5 needs affected-only independent review",
    allHistoricalFAILHOLD: "Preserved without upgrading source or figure gates",
    sourceAndFigureHolds: reviewed.retainedHoldsAndScope,
  },
  gates: {
    exactTwoLeafAndSourceHashCheck: "PASS-STRUCTURAL-ONLY",
    SCI_Q5_affected: "PENDING-INDEPENDENT-AFFECTED-ONLY",
    ZHEN_Q5_affected: "PENDING-INDEPENDENT-AFFECTED-ONLY",
    unaffectedQuestions: "INHERIT-D500-SCOPED-VERDICTS-NO-REPLAY",
    FIG: false,
    DISPLAY: false,
    fullcard: false,
    sourceYesNoOrWholeQuestionApproval: false,
  },
  images: { priorActual: 24, newActual: 0, cumulativeActual: 24, remaining: 0, reset: false },
  actionsPerformed: {
    nativeAnswerFinalizeRenderWholeTests: 0,
    newSourceSolvingFiguresPaidCalls: 0,
    DBGitCanonicalIndexMeterConsume: 0,
    newWorkersWorktreesBranches: 0,
    editsOutsideOutputDirectory: 0,
  },
  outputsOnlyUnder: root,
  fullcard: false,
  freezeMode: "0444",
});

fs.chmodSync(fileURLToPath(import.meta.url), 0o444);
const files = [
  ...candidates, ...beforeCopies, diffEvidence, inputBindings, ledger, report,
  metadata(fileURLToPath(import.meta.url)),
];
const authorFreeze = write("author-freeze.json", {
  schema: "STEMROBIN-181/d514-written-answer-repair-freeze@1",
  ticket: "STEMROBIN-181",
  task: path.basename(root),
  status: "FROZEN-Q5-TWO-LEAF-REPAIR-INDEPENDENT-AFFECTED-PENDING",
  freezeDate: "2026-11-18",
  outputDirectory: root,
  files,
  originalFreeze,
  authorizedReviewReport: reviewReport,
  authorizedReviewFreeze: reviewFreeze,
  exactDiff: diffEvidence,
  imageLedger: ledger,
  SCI: "PENDING-INDEPENDENT-AFFECTED-Q5-ONLY",
  FIG: false,
  DISPLAY: false,
  fullcard: false,
  selfHash: "Excluded from circular binding; returned in the textual receipt",
});
for (const file of [...files, authorFreeze, ...originalFiles, originalFreeze, reviewReport, reviewFreeze, priorLedger]) {
  verified(file.path, file.sha256, file.bytes);
}
console.log(JSON.stringify({
  outcome: "FROZEN-EXACT-TWO-LEAF-REPAIR-INDEPENDENT-PENDING",
  report, authorFreeze, diffEvidence, ledger, candidates,
  changedLeaves: changes.map(({ locale, pointer: leaf }) => ({ locale, pointer: leaf })),
  actualImages: { before: 24, added: 0, total: 24 },
}, null, 2));
