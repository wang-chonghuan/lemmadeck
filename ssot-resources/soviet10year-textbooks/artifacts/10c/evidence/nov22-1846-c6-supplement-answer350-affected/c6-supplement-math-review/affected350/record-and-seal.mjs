import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const out = path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-math-review/affected350");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const specs = [
  ["repair-candidate", ".tmp/stemrobin-184-six/c6-supplement-answer-350-repair/answer-keys.json", "956a0a02f0ada0719c65945d970625a5f342cc708ea03db9d3b15540af8aa058"],
  ["scoped-diff-proof", ".tmp/stemrobin-184-six/c6-supplement-answer-350-repair/scope-proof.json", "ca7967c9414a4b2701eb9fd44dac45504757d73f29c74cb0ccc0fc8a0f3d9c4f"],
  ["actual-proof-execution-wrapper", ".tmp/stemrobin-184-six/n88-stage-executions/nov22-c6-answer350-scoped-diff-proof-first/execution.json", "81274f41231ed2781cf906572a45d21a67c268626631c2f492b6c741a98a2f48"],
];
const inputs = specs.map(([role, relative, expected]) => {
  const absolutePath = path.join(cwd, relative);
  const bytes = fs.readFileSync(absolutePath);
  const sha256 = digest(bytes);
  if (sha256 !== expected) throw new Error("Input hash mismatch: " + role);
  return { role, path: absolutePath, bytes: bytes.length, sha256, data: JSON.parse(bytes) };
});
const item = inputs[0].data.answers[15];
if (item.exercise !== "350") throw new Error("Wrong affected ID");
const proof = inputs[1].data;
const execution = inputs[2].data;
if (proof.cwd !== cwd || proof.changedExercise !== "350"
    || JSON.stringify(proof.changedFields) !== JSON.stringify(["displayAnswer", "notes"])
    || proof.candidate.sha256 !== inputs[0].sha256
    || proof.candidate.path !== inputs[0].path
    || !proof.other56EntriesAndPackageMetadataUnchanged
    || !proof.hold338Unchanged || !proof.originalODEAnswerPreserved
    || !proof.originalCandidateAndPhaseAUnchanged || proof.scopeProof !== "PASS") {
  throw new Error("Supplied scoped-diff proof has conflicting facts");
}
if (execution.cwd !== cwd || execution.command !== "node"
    || JSON.stringify(execution.argv) !== JSON.stringify([".tmp/stemrobin-184-six/repair-c6-answer350.mjs", "verify"])
    || execution.exitCode !== 0 || execution.signal !== null || execution.launchError !== null) {
  throw new Error("Supplied proof execution did not complete as bound");
}
const reviewPath = path.join(out, "review.json");
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
if (review.exercise !== "350" || review.criteria.length !== 17
    || review.criteria.some((x) => x.result !== "MATCH")
    || review.affectedDisposition !== "MATCH_COMPLETE") {
  throw new Error("Manual affected review is not complete");
}
const fields = Object.fromEntries(["displayAnswer", "notes"].map((field) => {
  const bytes = Buffer.from(item[field], "utf8");
  return [field, { pointer: `/answers/15/${field}`, bytes: bytes.length, sha256: digest(bytes),
    hashConvention: "exact decoded string UTF8 bytes" }];
}));
const inherited = {
  phaseA: {
    solutionsSha256: "205d8d6564c3b8dc5625e0c75898b870b061c159f29127bb9ef1f022ed2d0c4d",
    finalSealSha256: "f759e32b25f2cfe3f03f76ad8b2dd7f289ffee592b252ab74ee537ce00d486ef",
    initialVerification: { passed: 479, total: 480, exitCode: 1 },
    affected374Recovery: { precision: 100, exitCode: 0, residual: "1.93124E-92" },
    reopenedOrReplayed: false, originalFailureRelabelled: false,
  },
  phaseB: {
    retentionPath: path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-supplement-math-phaseB"),
    retentionSha256: "acf611a63ba9e35ee315a1df4397f261aae7b8c742f94582e984f8b6a8fb8138",
    sealSha256: "53800f882b4bda3fcb1ad3d2f0e96ce5b8f45e1fe14b30762c99338cd5317192",
    priorVerdict: "REVISE", priorDisposition: { matches: 55, revise350: 1, hold338: 1 },
    consumedAndRetainedOnce: true, priorVerdictRewritten: false, reopenedOrReplayed: false,
  },
  unchanged55Matches: true, hold338Noanswer: true, qualifiedOwnership371373: true,
  settings: "draft metadata, derived/ungraded/parts[] are inherited via completed Phase B and scoped-diff proof, not read from other candidate entries",
  status: "human-delegated inherited intake and proof facts; no new gate or source approval",
};
const accounting = {
  affectedComparisons: 1, contentReviewedExercises: ["350"], changedContentFieldsReviewed: 2,
  criteriaMatched: 17, unchangedAnswerReviews: 0, sourceSolvingReplays: 0, numericalCheckReplays: 0,
  imageOperations: 0, roiOperations: 0, imageHeadersBytesPixelsDecodesCrops: 0,
  renderOperations: 0, displayOperations: 0, paidCalls: 0, modelCalls: 0, externalServiceCalls: 0,
  finalizerAssemblyCalls: 0, dbEnvBackendOperations: 0, installsFreshnessOperations: 0,
  gitPublishOperations: 0, chatAutomationPeerSupervisorMessages: 0,
  parentPermanentImages: { used: 24, limit: 24, status: "inherited-exhausted-not-reset" },
  priorFilesOrCandidatesEdited: false, newCompleteLessons: 0,
  wholeLessonPass: false, downstreamAuthorization: false,
};
const writeNew = (name, data) =>
  fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
writeNew("bindings.json", {
  schema: "stemrobin-184/c6-affected350-bindings@1", cwd,
  inputs: inputs.map(({ data, ...metadata }) => metadata),
  candidateScope: { exercise: "350", index: 15, fields },
  scopedDiffEvidence: {
    changedExercise: proof.changedExercise, changedFields: proof.changedFields,
    other56EntriesAndPackageMetadataUnchanged: proof.other56EntriesAndPackageMetadataUnchanged,
    hold338Unchanged: proof.hold338Unchanged, originalODEAnswerPreserved: proof.originalODEAnswerPreserved,
    originalCandidateAndPhaseAUnchanged: proof.originalCandidateAndPhaseAUnchanged,
    original: proof.original, inputsUnchanged: proof.inputsUnchanged,
    producerMathStatusAtProofTime: proof.mathematicalReview,
    scopedDiffNotMathApproval: true, producerNotRerun: true,
  },
  executionFacts: {
    command: execution.command, argv: execution.argv, cwd: execution.cwd,
    startedAt: execution.startedAt, finishedAt: execution.finishedAt,
    exitCode: execution.exitCode, signal: execution.signal, launchError: execution.launchError,
    streams: execution.streams, streamEvidence: "wrapper-recorded hashes only; stream files not read or independently rehashed",
  },
  inherited,
});
writeNew("failures.json", {
  schema: "stemrobin-184/c6-affected350-failures@1",
  commandFailures: [], unresolved350ContentFindings: [],
  resolvedPriorFinding: {
    id: "C6-B-350-REQUEST-COMPLETENESS", currentCandidateSha256: inputs[0].sha256,
    affectedResult: "MATCH_COMPLETE", priorREVISEPreserved: true,
  },
  inheritedSourceHolds: [{ exercise: "338", status: "HOLD-noanswer", reReviewed: false }],
  inheritedQualifiedOwnership: ["371", "372", "373"],
  inheritedPriorNumericalFailureAndRecovery: inherited.phaseA,
  overallScopedVerdict: "PARTIAL_PASS_56_WITH_HOLD338", wholeLesson: "HOLD", accounting,
});
writeNew("ledger.json", {
  schema: "stemrobin-184/c6-affected350-compact-ledger@1", cwd,
  invocation: "same-STEMROBIN-184/184-6", finish: "review",
  commands: [
    { command: "test ! -e .tmp/stemrobin-184-six/c6-supplement-math-review/affected350",
      cwd, exitCode: 0, outcome: "absent before writes" },
    { commandKind: "node -e", cwd, exitCode: 0,
      purpose: "actual repair candidate full-byte hash, expose only index15 exercise/displayAnswer/notes",
      outcome: "authorized hash matched; only affected350 fields read for content comparison" },
    { commandKind: "node -e", cwd, exitCode: 0,
      purpose: "actual small scope-proof and execution-wrapper hashes plus JSON evidence",
      outcome: "both released hashes matched; proof binds exactly two changes and wrapper records actual exit0" },
    { argv: ["node", ".tmp/stemrobin-184-six/c6-supplement-math-review/affected350/record-and-seal.mjs"],
      cwd, exitCode: 0, outcome: "recorded affected manual comparison and actual input/output bindings; no proof or math-check replay",
      exitCodeBasis: "binding checks and writes completed before final tool result supplies actual status" },
  ],
  manualWrites: { tool: "apply_patch", root: out },
  mechanicalWrites: { tool: "this recorder", root: out, exclusiveCreate: true },
  producerExecutionReceipt: { path: inputs[2].path, sha256: inputs[2].sha256,
    actualExitCode: execution.exitCode, readNotReexecuted: true },
  comparisonMethod: review.method,
  commandFailures: 0, matchedCriteria: 17, inherited, accounting,
});
const names = ["review.json", "report.md", "record-and-seal.mjs", "bindings.json", "ledger.json", "failures.json"];
const outputs = names.map((name) => {
  const absolutePath = path.join(out, name);
  const bytes = fs.readFileSync(absolutePath);
  return { name, path: absolutePath, bytes: bytes.length, sha256: digest(bytes) };
});
writeNew("seal.json", {
  schema: "stemrobin-184/c6-affected350-seal@1", cwd, finish: "review",
  affectedDisposition: "MATCH_COMPLETE", overallScopedVerdict: "PARTIAL_PASS_56_WITH_HOLD338",
  wholeLesson: "HOLD", inputs: inputs.map(({ data, ...metadata }) => metadata), fields, outputs,
  proofWrapperActualExitCode: execution.exitCode,
  inherited, accounting,
  priorREVISEPreserved: true, wholeLessonGatePass: false, downstreamAuthorization: false,
  selfHash: "excluded to avoid self-reference; actual seal-byte hash printed by this command",
});
const sealBytes = fs.readFileSync(path.join(out, "seal.json"));
console.log(JSON.stringify({
  cwd, affectedDisposition: "MATCH_COMPLETE", matchedCriteria: 17,
  overallScopedVerdict: "PARTIAL_PASS_56_WITH_HOLD338", wholeLesson: "HOLD",
  commandFailures: 0, proofWrapperActualExitCode: execution.exitCode,
  inputs: inputs.map(({ data, ...metadata }) => metadata), fields, outputs,
  seal: { path: path.join(out, "seal.json"), bytes: sealBytes.length, sha256: digest(sealBytes) },
  accounting,
}, null, 2));
