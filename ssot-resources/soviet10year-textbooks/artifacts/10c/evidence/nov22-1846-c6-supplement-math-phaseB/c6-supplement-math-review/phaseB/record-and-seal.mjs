import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const phaseA = path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseA");
const out = path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseB");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const sourceInputs = [
  ["released-answer-candidate", path.join(cwd, ".tmp/stemrobin-184-six/c6-supplement-answer-author/answer-keys.json"), "310e25715d88089e71d8637d45333ae91160723c1d0583ff0356688cab5a364e"],
  ["consumed-independent-math-freeze", path.join(phaseA, "source-first-solutions.md"), "205d8d6564c3b8dc5625e0c75898b870b061c159f29127bb9ef1f022ed2d0c4d"],
  ["unchanged-frozen-source-bindings", path.join(phaseA, "bindings.json"), "66272cab8404358d798586dc6c9cbb113e48123ff7d3d0a11a6a056c6ee1c462"],
];
const inputs = sourceInputs.map(([role, absolutePath, authorizedHash]) => {
  const bytes = fs.readFileSync(absolutePath);
  const actualHash = digest(bytes);
  if (actualHash !== authorizedHash) throw new Error("Input byte hash mismatch: " + role);
  return { role, path: absolutePath, bytes: bytes.length, sha256: actualHash, text: bytes.toString("utf8") };
});
const candidate = JSON.parse(inputs[0].text);
const frozen = inputs[1].text;
const frozenBindings = JSON.parse(inputs[2].text);
const assessmentsBytes = fs.readFileSync(path.join(out, "assessments.json"));
const assessments = JSON.parse(assessmentsBytes).rows;
const scope = Array.from({ length: 57 }, (_, i) => String(335 + i));
const equalOrder = (numbers) => JSON.stringify(numbers) === JSON.stringify(scope);
if (!equalOrder(candidate.answers.map((a) => a.exercise))
    || !equalOrder(frozenBindings.items.map((a) => a.number))
    || !equalOrder(assessments.map((a) => a.exercise))) {
  throw new Error("Candidate/freeze/manual-row identifier order mismatch");
}
if (candidate.book !== "10c" || candidate.lesson !== "ana10-c6-ex"
    || candidate.edition !== "modern-us-neutral" || candidate.status !== "draft") {
  throw new Error("Wrong candidate identity or non-draft status");
}
const exactFieldHash = (value) => {
  const serialization = typeof value === "string" ? value : JSON.stringify(value);
  const bytes = Buffer.from(serialization, "utf8");
  return { bytes: bytes.length, sha256: digest(bytes),
    serialization: typeof value === "string" ? "exact-decoded-field-text-UTF8" : "JSON.stringify(value)-UTF8" };
};
const rows = assessments.map((manual, index) => {
  const a = candidate.answers[index];
  const b = frozenBindings.items[index];
  const held = a.exercise === "338";
  if (!Array.isArray(a.parts) || a.parts.length !== 0) throw new Error("Parts must stay empty: " + a.exercise);
  if (held) {
    if (a.displayAnswer !== "" || a.grading !== null || a.source !== null
        || !a.notes.includes("HOLD") || !a.notes.includes("UNKNOWN")
        || manual.disposition !== "HOLD_PRESERVED") throw new Error("338 noanswer contract changed");
  } else if (a.grading !== "ungraded" || a.source !== "derived" || !a.displayAnswer) {
    throw new Error("Substantive candidate contract changed: " + a.exercise);
  }
  const begin = frozen.indexOf("### " + a.exercise + "\n");
  const next = index === 56 ? frozen.indexOf("## Freeze Boundary", begin) : frozen.indexOf("### " + scope[index + 1] + "\n", begin);
  if (begin < 0 || next <= begin) throw new Error("Frozen solution section missing");
  const sectionBytes = Buffer.from(frozen.slice(begin, next), "utf8");
  return {
    ...manual,
    candidateLocation: { file: inputs[0].path, index, pointer: "/answers/" + index },
    comparedCandidateFields: Object.fromEntries(Object.entries(a).map(([key, value]) => [key, {
      pointer: `/answers/${index}/${key}`, ...exactFieldHash(value),
    }])),
    originalNumber: b.number, originalSourceNumber: b.source_number,
    groupId: b.group_id, group: b.group,
    sourceOwnership: b.source_ownership_status,
    frozenQuestion: { bindingFile: inputs[2].path, pointer: `/items/${index}/modern_text`,
      ...exactFieldHash(b.modern_text) },
    frozenSolution: { file: inputs[1].path, heading: "### " + a.exercise,
      bytes: sectionBytes.length, sha256: digest(sectionBytes) },
    gradingComparison: held ? "null remains incomplete/draft" : "ungraded intentionally retained; no auto promotion",
    sourceComparison: held ? "null remains noanswer; not an approved source label" : "derived is consistent with the independent derived solution, not bookRaw",
    partsComparison: "[] deliberately retained; no grading expected keys or judging introduced",
    notesReviewed: true, displayReviewed: true,
    findingIds: a.exercise === "350" ? ["C6-B-350-REQUEST-COMPLETENESS"] : [],
  };
});
const counts = Object.fromEntries(["MATCH", "REVISE", "HOLD_PRESERVED"].map((v) => [v, rows.filter((r) => r.disposition === v).length]));
if (counts.MATCH !== 55 || counts.REVISE !== 1 || counts.HOLD_PRESERVED !== 1) {
  throw new Error("Unexpected manual disposition summary");
}
const finding = {
  id: "C6-B-350-REQUEST-COMPLETENESS", priority: 2, exercise: "350",
  classification: "incomplete-retained-request-not-incorrect-ODE-result",
  title: "Correct ODE check omits retained g4 function analysis and graph data",
  candidateFile: inputs[0].path,
  locations: [
    { pointer: "/answers/15/displayAnswer", line: 132 },
    { pointer: "/answers/15/notes", line: 134 },
  ],
  retainedGroup: { id: "g4", command: "利用导数讨论函数并作出它的图象：" },
  independentReference: { path: inputs[1].path, heading: "### 350" },
  existingContentToPreserve: "affirmative ODE answer; y'=-2sin(2x-pi/4), y''=-4cos(2x-pi/4)=-4y for all real x",
  replacementRequirements: [
    "Append domain R, range [-1,1], amplitude 1, fundamental period pi, and y-intercept sqrt(2)/2.",
    "Append decreasing intervals (pi/8+k*pi,5pi/8+k*pi) and increasing intervals (5pi/8+k*pi,9pi/8+k*pi), k integer.",
    "Append maxima 1 at pi/8+k*pi, minima -1 at 5pi/8+k*pi, and zeros 3pi/8+k*pi/2, k integer.",
    "Append one-period plotting coordinates (pi/8,1), (3pi/8,0), (5pi/8,-1), (7pi/8,0), (9pi/8,1), with period-pi extension.",
    "Adjust the ODE-only notes to acknowledge the retained g4 task; preserve the explicit ODE request and do not invent initial conditions.",
    "If sine phase is supplied, use positive amplitude/frequency and phase pi/4; leave ungraded, derived and parts[] unchanged.",
  ],
  candidateEdited: false, replacementKeyProduced: false, manualAnswerEditAuthorized: false,
};
const inheritedIntake = {
  phase: "A", consumedOnce: true,
  retentionPath: path.join(cwd, "ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-supplement-math-phaseA"),
  finalSealSha256: "f759e32b25f2cfe3f03f76ad8b2dd7f289ffee592b252ab74ee537ce00d486ef",
  durableRetentionCompactId: "ec2d7d70",
  initialCheck: { passed: 479, total: 480, exitCode: 1 },
  affectedRecovery: { exercise: "374", precision: 100, exitCode: 0, residual: "1.93124E-92" },
  evidenceStatus: "human-delegated completed intake; retained directory/seal/receipts not reopened in Phase B",
  sourceSolvingReplayed: false, checksReplayed: false, originalRunRelabelled: false, modified: false,
};
const accounting = {
  candidateComparisonCount: 1, identifiersReviewed: 57, substantiveAnswersReviewed: 56,
  completeMatchingAnswers: 55, incompleteCorrectMathAnswers: ["350"], noanswerHolds: ["338"],
  qualifiedGroupOwnership: ["371", "372", "373"], dispositionCounts: counts,
  deliberateUngradedAnswers: 56, deliberatelyEmptyPartsArrays: 57,
  candidateFilesRead: 1, authorReportsRead: 0, authorManifestsRead: 0, otherSolutionPackagesRead: 0,
  sourceResolvingOperations: 0, mathCheckReplays: 0,
  images: 0, rois: 0, imageHeadersOrBytesOrPixelsOrDecodesOrCrops: 0, renderOperations: 0, displayOperations: 0,
  paidCalls: 0, modelServiceCalls: 0, externalServiceCalls: 0,
  installs: 0, freshnessCalls: 0, backendCalls: 0, finalizerCalls: 0, assemblyCalls: 0,
  dbCalls: 0, envOperations: 0, gitOperations: 0, publishOperations: 0,
  chatOrPeerOrSupervisorMessages: 0, automationOperations: 0,
  parentPermanentImages: { used: 24, limit: 24, status: "inherited-exhausted-not-reset" },
  phaseAChanged: false, candidateChanged: false, sourceChanged: false,
  downstreamAuthorization: false, lessonCoursePass: false,
};
const writeNew = (name, value) =>
  fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
writeNew("comparison.json", {
  schema: "stemrobin-184/c6-phaseB-rowwise-comparison@1", cwd,
  verdict: "REVISE", wholeLesson: "HOLD", counts,
  reviewerMethod: "manual comparison to already frozen independent proofs; this script records results and byte/structural bindings only",
  rows, findings: [finding],
});
const readable = [
  "# C6 Phase B: All 57 Rowwise Comparisons",
  "",
  "Scoped verdict: REVISE. Whole-lesson HOLD. 55 complete matches, 350 incomplete, 338 noanswer HOLD.",
  "Candidate file: " + inputs[0].path,
  "Candidate SHA-256: " + inputs[0].sha256,
  "Independent freeze SHA-256: " + inputs[1].sha256,
  "",
  "Every candidate exercise/source/grading/displayAnswer/parts/notes field was compared.",
  "All 56 substantive entries remain derived and deliberately ungraded with parts[].",
  "338 remains empty/null/draft; no derivative or alternative interpretation was generated.",
  "MATCH is an answer-comparison disposition, not a source approval or lesson PASS.",
  "",
];
for (const row of rows) {
  readable.push(
    `## ${row.exercise}: ${row.disposition}`, "",
    `Candidate location: ${row.candidateLocation.pointer}; frozen group ${row.groupId}: ${row.group}`,
    `Display/request comparison: ${row.displayComparison}`,
    `Notes/proof comparison: ${row.notesComparison}`,
    `Domain/branch/phase/scope: ${row.constraintComparison}`,
    `Source/grading/parts: ${row.sourceComparison}; ${row.gradingComparison}; ${row.partsComparison}.`,
    `Source ownership: ${row.sourceOwnership}.`, "",
  );
}
readable.push("## Stop Boundary", "",
  "350 must be completed as specified in report.md; no candidate edits were made.",
  "371-373 retain inherited qualified instruction ownership, irrespective of arithmetic.",
  "338 keeps whole-lesson HOLD even after a future 350 repair.",
  "Only one candidate comparison occurred. Stop for parent intake; no downstream authorization.", "");
fs.writeFileSync(path.join(out, "comparison.md"), readable.join("\n"), { flag: "wx" });
writeNew("bindings.json", {
  schema: "stemrobin-184/c6-phaseB-bindings@1", cwd,
  inputs: inputs.map(({ text, ...metadata }) => metadata),
  authority: { candidate: "released authored candidate only; not bookRaw, source, or independent approval",
    mathematicalBaseline: "unchanged consumed independent Phase A solutions",
    modernSemanticSource: "question text already bound in Phase A bindings, reused without source rereview" },
  inheritedSourceInputs: frozenBindings.inputs.map((x) => ({ ...x, readInPhaseB: false, status: "inherited-PhaseA-binding-not-replayed" })),
  inheritedIntake,
  rowBindingFile: path.join(out, "comparison.json"),
  fieldHashConvention: "decoded string text uses exact UTF8 bytes; other values use JSON.stringify(value) UTF8; whole-file hashes use actual file bytes",
});
writeNew("failures.json", {
  schema: "stemrobin-184/c6-phaseB-failures@1",
  commandFailures: [], contentFindings: [finding],
  sourceHolds: [{ exercise: "338", state: "HOLD-noanswer",
    reason: "lowpoint decimal-versus-multiplication remains UNKNOWN; no interpretation supplied",
    emptyDisplay: true, nullSourceAndGrading: true, emptyParts: true, draftPackage: true }],
  qualifiedOwnership: [{ exercises: ["371", "372", "373"], groupId: "g9",
    group: "验证等式：", correctMathDoesNotApproveSourceOwnership: true }],
  inheritedInitialFailureAndRecovery: inheritedIntake,
  verdict: "REVISE", wholeLesson: "HOLD", accounting,
});
const commands = [
  { command: "test ! -e .tmp/stemrobin-184-six/c6-supplement-math-review/phaseB",
    outcome: "absent before all writes", exitCode: 0 },
  { commandKind: "node -e", purpose: "read released candidate only; actual byte hash and package metadata",
    outcome: "authorized hash match; draft 10c/ana10-c6-ex/modern-us-neutral; 57 entries", exitCode: 0 },
  ...["1,250", "251,520", "521,780"].map((range) => ({
    command: `sed -n '${range}p' .tmp/stemrobin-184-six/c6-supplement-math-review/phaseA/source-first-solutions.md`,
    outcome: "reused unchanged independent mathematical freeze for comparison; no computation replay", exitCode: 0,
  })),
  ...[[335, 354], [355, 374], [375, 391]].map((range) => ({
    commandKind: "node -e", purpose: "print complete released candidate rows by identifier range", range,
    inputs: [inputs[0].path], outcome: "all fields read: exercise, grading, source, displayAnswer, parts, notes", exitCode: 0,
  })),
  { command: "rg -n -A 7 -B 2 '\"exercise\": \"350\"' .tmp/stemrobin-184-six/c6-supplement-answer-author/answer-keys.json",
    outcome: "verified item and affected field locations: exercise line129, displayAnswer132, notes134", exitCode: 0 },
  { commandKind: "node -e", purpose: "actual byte hashes of own consumed PhaseA freeze/bindings, plus retained group projection",
    inputs: inputs.slice(1).map((x) => x.path), outcome: "both frozen input hashes match; exact original number/group mapping reused", exitCode: 0 },
  { argv: ["node", ".tmp/stemrobin-184-six/c6-supplement-math-review/phaseB/record-and-seal.mjs"],
    outcome: "recorded manual rowwise comparison, input/field/output hashes and seal; no mathematical or grader execution",
    exitCode: 0, exitCodeBasis: "successful checks/writes complete before tool returns actual exit status" },
].map((command) => ({ ...command, cwd }));
writeNew("ledger.json", {
  schema: "stemrobin-184/c6-phaseB-compact-ledger@1", cwd,
  invocation: "same-STEMROBIN-184/184-6", finish: "review", phase: "B",
  commands, writes: { manual: "apply_patch", mechanical: "this recorder, exclusive-create only", root: out },
  observations: { verifiedInputHashes: 3, exactOrder: true, candidateDraft: true,
    manualComparedRows: 57, deliberateUngraded: 56, emptyParts: 57, hold338Preserved: true,
    numericOrSourceSolvingCommands: 0, substantiveDispositionSource: "manual assessments.json, not string or numeric grading" },
  commandFailures: 0, contentFindings: 1,
  authorReportsAndManifestsNotNeededOrRead: true,
  stdoutRetention: "actual intake command outputs observed in chat; no fabricated stream receipts",
  inheritedIntake, accounting,
});
const names = ["assessments.json", "report.md", "record-and-seal.mjs", "comparison.json",
  "comparison.md", "bindings.json", "ledger.json", "failures.json"];
const outputs = names.map((name) => {
  const absolutePath = path.join(out, name);
  const bytes = fs.readFileSync(absolutePath);
  return { name, path: absolutePath, bytes: bytes.length, sha256: digest(bytes) };
});
writeNew("seal.json", {
  schema: "stemrobin-184/c6-phaseB-seal@1", cwd, phase: "B", finish: "review",
  verdict: "REVISE", wholeLesson: "HOLD",
  inputs: inputs.map(({ text, ...metadata }) => metadata), outputs,
  accounting, inheritedIntake,
  candidateComparisonComplete: true, candidateEditAuthorized: false,
  independentSourceOwnershipApproval: false, downstreamAuthorization: false,
  selfHash: "excluded to avoid self-reference; actual seal-byte hash printed by this command",
});
const sealBytes = fs.readFileSync(path.join(out, "seal.json"));
console.log(JSON.stringify({
  cwd, verdict: "REVISE", wholeLesson: "HOLD", counts,
  commandFailures: 0, finding: { id: finding.id, exercise: finding.exercise, locations: finding.locations },
  inputs: inputs.map(({ text, ...metadata }) => metadata), outputs,
  seal: { path: path.join(out, "seal.json"), bytes: sealBytes.length, sha256: digest(sealBytes) },
  accounting,
}, null, 2));
