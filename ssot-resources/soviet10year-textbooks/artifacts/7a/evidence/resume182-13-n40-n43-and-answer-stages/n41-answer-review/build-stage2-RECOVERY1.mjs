import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const checkout = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const scratch = path.join(checkout, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const owner = path.join(scratch, "n41-answer-review");
const author = path.join(scratch, "n41-answer-author/RECOVERY1");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const json = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeOnce = (name, bytes) => fs.writeFileSync(path.join(owner, name), bytes, { flag: "wx", mode: 0o600 });
const writeJson = (name, value) => writeOnce(name, `${JSON.stringify(value, null, 2)}\n`);
const outputs = [
  "stage2-candidate-snapshot-RECOVERY1.json", "stage2-review-RECOVERY1.json",
  "stage2-binding-summary-RECOVERY1.json", "stage2-validation-RECOVERY1.json",
  "hashes.stage2-RECOVERY1.json", "stage2-freeze-RECOVERY1.json", "checksums.stage2-RECOVERY1.sha256"
];
for (const name of outputs) assert(!fs.existsSync(path.join(owner, name)), `Write-once output exists: ${name}`);
const stage1Names = fs.readdirSync(owner).filter(name => !name.includes("RECOVERY1"));
const preservedStage1 = stage1Names.map(name => {
  const file = path.join(owner, name);
  const mode = fs.statSync(file).mode & 0o777;
  assert.equal(mode, 0o444, `Stage1 artifact is not frozen: ${name}`);
  return { path: file, name, sha256: hash(fs.readFileSync(file)), mode: "0444" };
});
const expected = [
  ["alg7-c4-s2-n41.answer-keys.frozen.json", "d19f79dfff3e4ceb7b6a5d7921a31af26710890a3c5bf5cbfcc9215ab63bd3e0"],
  ["author-binding.json", "c89fc0ccd13f8305fdf606e0b224fd6458ce362273326fa531d04013b4a77a94"],
  ["source-and-task-binding.json", "4f96a1787a9165b3da7666dc3cb38f8092989281efdeb9797bdd2fd00a96dc0b"],
  ["author-checks.json", "a703a311e7a544d8646bed2809f410bc39501f9519c863267ac480ae784283fc"],
  ["standard-answers.md", "8dddf9c5a60b049874dc09a62c7a352a646de4be2901dc03cd460601396e87a6"]
];
const authorInputs = expected.map(([name, sha256]) => {
  const file = path.join(author, name);
  const bytes = fs.readFileSync(file);
  assert.equal(hash(bytes), sha256, `Changed authorized disclosure: ${name}`);
  return { name, path: file, sha256, bytes: bytes.length };
});
const candidate = json(authorInputs[0].path);
const binding = json(authorInputs[1].path);
const provenance = json(authorInputs[2].path);
const authorChecks = json(authorInputs[3].path);
const standard = fs.readFileSync(authorInputs[4].path, "utf8");
const stage1 = json(path.join(owner, "source-solutions.stage1.json"));
const frozenHashes = json(path.join(owner, "hashes.stage1.json"));
const frozenSnapshot = json(path.join(owner, "source-snapshot.stage1.json"));
const evidence = json(path.join(owner, "comparison-evidence-RECOVERY1.json"));
assert.equal(hash(fs.readFileSync(path.join(owner, "source-solutions.stage1.json"))), evidence.frozenIndependentSolutionsSha256);
assert.equal(evidence.candidateSha256, authorInputs[0].sha256);
assert.equal(binding.frozen.path, authorInputs[0].path);
assert.equal(binding.frozen.sha256, authorInputs[0].sha256);
for (const [field, inputIndex] of [["authorChecks", 3], ["provenance", 2], ["standardAnswers", 4]]) {
  assert.equal(binding[field].path, authorInputs[inputIndex].path);
  assert.equal(binding[field].sha256, authorInputs[inputIndex].sha256);
}
const expectedFields = ["book", "edition", "lesson", "schema", "status", "answers"];
assert.deepEqual(Object.keys(candidate).sort(), expectedFields.sort());
assert.equal(candidate.schema, "ld-s10y-answer/lesson-answers@1");
assert.equal(candidate.book, "7a");
assert.equal(candidate.edition, "modern-us-neutral");
assert.equal(candidate.lesson, "alg7-c4-s2-n41");
assert.equal(candidate.status, "draft");
assert.equal(candidate.answers.length, 17);
assert.deepEqual(candidate.answers.map(answer => answer.exercise), stage1.coverage.numbers);
assert.equal(new Set(candidate.answers.map(answer => answer.exercise)).size, 17);
assert.equal(evidence.exerciseEvidence.length, 17);
const excerptFor = (answer, task, index) => {
  const lines = answer.displayAnswer.split("\n");
  if (answer.exercise === "848" || answer.exercise === "849") return lines[index + 1];
  if (answer.exercise === "850") return lines[[1, 2, 3, 6, 7, 8][index]];
  if (["844", "845"].includes(answer.exercise)) return answer.displayAnswer;
  if (answer.exercise === "846") {
    const chunks = answer.displayAnswer.split(/(?=^[a-z]\))/m);
    return chunks.find(chunk => chunk.startsWith(`${task.label})`))?.trim();
  }
  return lines.find(line => line.startsWith(`${task.label})`));
};
const exerciseReviews = candidate.answers.map((answer, exerciseIndex) => {
  const source = stage1.exercises[exerciseIndex];
  const manual = evidence.exerciseEvidence[exerciseIndex];
  assert.equal(manual.exercise, source.exercise);
  assert.equal(manual.tasks.length, source.tasks.length);
  assert.equal(answer.grading, "ungraded");
  assert.equal(answer.source, "derived");
  assert(Array.isArray(answer.parts));
  assert.equal(answer.parts.length, 0);
  assert(typeof answer.displayAnswer === "string" && answer.displayAnswer.length > 0);
  assert(standard.includes(`## ${answer.exercise}\n\n${answer.displayAnswer}`), `Markdown does not mirror ${answer.exercise}`);
  const tasks = source.tasks.map((task, taskIndex) => {
    const excerpt = excerptFor(answer, task, taskIndex);
    assert(excerpt?.length > 0, `Candidate missing display span for ${task.id}`);
    return {
      taskId: task.id,
      verdict: "pass",
      independentFrozenAnswer: task.answer,
      independentFrozenDomain: task.domain,
      candidateLocator: `#/answers/${exerciseIndex}/displayAnswer`,
      candidateExcerpt: excerpt,
      evidence: manual.tasks[taskIndex],
      scope: "Manual semantic comparison to the frozen Stage1 task; excerpt association/completeness is mechanically checked, not symbolic proof by script."
    };
  });
  return {
    exercise: answer.exercise, verdict: "pass", mathematicalTasks: tasks.length,
    gradingContract: { grading: answer.grading, source: answer.source, parts: [], verdict: "pass" },
    displayCompleteness: "Specific answers and relevant reasoning, domains/branches or attainment are present for every task.",
    standardAnswersMarkdownMatchesDisplay: true, taskReviews: tasks
  };
});
const taskReviews = exerciseReviews.flatMap(review => review.taskReviews);
assert.equal(taskReviews.length, 80);
assert.equal(new Set(taskReviews.map(review => review.taskId)).size, 80);
const lookupTasks = stage1.exercises.flatMap(exercise => exercise.tasks).filter(task => task.table);
const frozenCells = new Map(stage1.tableEvidence.cells.map(cell => [cell.id, cell]));
const tableReviews = lookupTasks.map(task => {
  const [exerciseNumber, label] = task.id.split(".");
  const answer = candidate.answers.find(item => item.exercise === exerciseNumber);
  const line = answer.displayAnswer.split("\n").find(item => item.startsWith(`${label})`));
  const decimals = line.match(/-?\d+\.\d+/g);
  const displayed = decimals.at(-1);
  assert.equal(displayed, task.table.approximation, `Table report differs: ${task.id}`);
  const authorCheck = authorChecks.affectedChecks.find(check => check.id === task.id);
  if (authorCheck) {
    assert.equal(authorCheck.displayResult, task.table.approximation);
    assert.equal(authorCheck.exactFiniteDecimalResult, task.table.approximation);
    assert.deepEqual(authorCheck.lookupCells.map(cell => cell.id), task.table.cells);
    for (const cell of authorCheck.lookupCells) assert.equal(cell.printed, frozenCells.get(cell.id).cellExact);
  }
  return {
    taskId: task.id, verdict: "pass", exactAnswer: task.answer,
    frozenTableArithmetic: task.table.arithmetic, expectedTableReport: task.table.approximation,
    candidateTableReport: displayed, tableCellIds: task.table.cells,
    authorRecoveryClass: authorCheck ? "new-eight-obligation-completion" : "FIRST-four-completed-obligations-retained",
    route: "Exact simplification, direct main entries, finite-cell arithmetic; no corrections, argument preprocessing or root rescaling required.",
    sourceCellsAndRoutesComparedFromFrozenCacheOnly: true,
    precision: "Three-decimal finite-cell arithmetic report, explicitly not a guaranteed true-value rounding."
  };
});
assert.equal(tableReviews.length, 12);
assert.equal(authorChecks.affectedChecks.length, 8);
for (const task of provenance.tasks) assert.equal(task.count, stage1.coverage.taskCounts[task.exercise]);
assert.equal(provenance.totals.mathematicalTasks, 80);
assert.equal(provenance.totals.completedLookupObligations, 12);
assert.equal(provenance.pendingLookupTasks.length, 0);
const frozenInputs = new Map(frozenHashes.inputs.map(input => [input.path, input.sha256]));
const sourceBindingComparisons = ["finalNormalizedLesson", "finalNormalizedExercises"].map(field => {
  const declared = binding.sources[field];
  assert.equal(declared.sha256, frozenInputs.get(declared.path));
  assert.deepEqual(declared, provenance.sources[field]);
  return { field, ...declared, matchesIndependentStage1Hash: true, currentSourceReopened: false };
});
assert.equal(provenance.sourceDisclosure.captures.sha256, stage1.tableEvidence.primarySourceOnlyPacket.sha256);
const cachedCaptures = new Map(frozenSnapshot.sourceOnlyTableEvidenceProjection.distinctCells.map(cell => [cell.id, cell]));
for (const cell of provenance.sourceDisclosure.cells) {
  const cached = cachedCaptures.get(cell.id);
  for (const field of ["mainCellExact", "rowExact", "mainColumnExact", "capturePath", "captureSha256", "imageSha256"]) assert.equal(cell[field], cached[field]);
  assert.equal(cell.correctionCellExact, null);
}

// FIRST is consulted only for byte/hash and changed-field provenance, never as the independent mathematical answer.
const firstReference = provenance.FIRSTReuse.candidate;
assert.equal(firstReference.path, path.join(scratch, "n41-answer-author/alg7-c4-s2-n41.answer-keys.frozen.json"));
const firstBytes = fs.readFileSync(firstReference.path);
assert.equal(hash(firstBytes), firstReference.sha256);
const firstCandidate = JSON.parse(firstBytes);
const differences = [];
function diff(before, after, pointer) {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  if (before && after && typeof before === "object" && typeof after === "object" && Array.isArray(before) === Array.isArray(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) diff(before[key], after[key], `${pointer}/${key}`);
  } else differences.push(pointer);
}
diff(firstCandidate, candidate, "");
assert.deepEqual(differences.sort(), authorChecks.coverage.onlyChangedAnswerFields.slice().sort());
const unchangedAnswerObjects = candidate.answers.filter((answer, index) => JSON.stringify(answer) === JSON.stringify(firstCandidate.answers[index])).map(answer => answer.exercise);
assert.equal(unchangedAnswerObjects.length, 15);
const retainedFour = ["835.a", "835.b", "835.f", "843.f"].map(id => {
  const [number, label] = id.split(".");
  const before = firstCandidate.answers.find(answer => answer.exercise === number).displayAnswer.split("\n").find(line => line.startsWith(`${label})`));
  const after = candidate.answers.find(answer => answer.exercise === number).displayAnswer.split("\n").find(line => line.startsWith(`${label})`));
  assert.equal(before, after);
  return { taskId: id, displayLineUnchanged: true };
});
const findings = evidence.findings;
assert.equal(findings.length, 0);
const outcome = "pass";
const validation = {
  schema: "stemrobin182/n41-answer-stage2-validation@1", status: "PASS",
  exerciseCount: 17, uniqueExerciseCount: 17, mathematicalTaskCount: 80,
  taskMatches: 80, exactDomainProofGraphExtremumChecks: 80,
  tableObligations: 12, tableValuesMatched: 12, tableRoutesMatched: 12,
  gradingUngradedCount: 17, emptyPartsCount: 17, sourceDerivedCount: 17,
  completeDisplayAnswerCount: 17, standardMarkdownMatches: 17,
  newRecoveryLookupObligationsMatched: 8, retainedFIRSTLookupObligationsMatched: 4,
  unchangedFIRSTAnswerObjects: 15, actualChangedFields: differences,
  newSourceTableOrFigureOpens: 0, newFullIndependentSolves: 0,
  findings: [], checkedBy: "Dedicated independent reviewer with frozen80-task evidence; structured binding/completeness checks are supplemental."
};
writeOnce("stage2-candidate-snapshot-RECOVERY1.json", fs.readFileSync(authorInputs[0].path));
writeJson("stage2-review-RECOVERY1.json", {
  schema: "stemrobin182/n41-answer-stage2-review@1", ticket: "STEMROBIN-182",
  stage: 2, variant: "RECOVERY1", lesson: "alg7-c4-s2-n41", edition: "modern-us-neutral",
  reviewer: { kind: "independent_agent", identity: "Dedicated answer reviewer; independent Stage1 solutions frozen before any author disclosure." },
  outcome, status: "PASS", candidate: authorInputs[0],
  independentSourceSolutions: { path: path.join(owner, "source-solutions.stage1.json"), sha256: evidence.frozenIndependentSolutionsSha256 },
  scope: "Read-only answer comparison for all17 ungraded originals and80 mathematical tasks; no app/DB, full source re-solve, table/source image reopening, finalizer, publication or commit.",
  exerciseReviews, tableReviews, precisionReview: evidence.displayPrecisionReview,
  sourceBindingComparisons,
  findings, validation,
  limits: {
    authorChecksAreNotIndependentEvidence: true, sourceImagesReopened: 0, tableFilesReopened: 0,
    originalSourceJsonReopened: 0, fullIndependentSolvesRepeated: 0, choicesRead: 0,
    historicalTableEquivalenceClaimed: false, displayMathRenderedInApp: false,
    finalizerRun: false, overallGate2Completed: false, publicationOrPromotionApproved: false
  },
  conclusion: "All80 candidate task answers and all12 table reports/routes agree with the frozen source solutions. Proofs, original domains/exceptional branches, concrete graph answers and extrema attainment are complete. No substantive revision finding.",
  nextAction: "Freeze Stage2 and return. Parent owns later Gate2/finalization/integration; this does not authorize those actions."
});
writeJson("stage2-binding-summary-RECOVERY1.json", {
  schema: "stemrobin182/n41-answer-stage2-binding-summary@1", status: "PASS",
  authorInputs, sourceBindingComparisons,
  sourceTableCaptureBinding: { declared: provenance.sourceDisclosure.captures, frozenIndependentSha256: stage1.tableEvidence.primarySourceOnlyPacket.sha256, matchedFromFrozenCache: true },
  FIRSTReuse: { candidate: firstReference, consultedOnlyForProvenance: true, actualChangedFields: differences, unchangedAnswerObjects, retainedLookupLines: retainedFour, FIRSTArtifactWritten: false },
  precision: evidence.displayPrecisionReview, validation,
  originalAndAuthorFreezesPreserved: true, noSourceTableOrFigureReopening: true,
  provenanceLimit: "Undisclosed normalization/audit/image and source capture files are not reopened. Relevant final normalized hashes and literal source bindings are compared with the independent Stage1 cache; author-only assertions are not promoted to independent proof."
});
writeJson("stage2-validation-RECOVERY1.json", validation);
const payloadNames = [
  "comparison-evidence-RECOVERY1.json", "build-stage2-RECOVERY1.mjs",
  "stage2-candidate-snapshot-RECOVERY1.json", "stage2-review-RECOVERY1.json",
  "stage2-binding-summary-RECOVERY1.json", "stage2-validation-RECOVERY1.json"
];
const artifacts = payloadNames.map(name => {
  const bytes = fs.readFileSync(path.join(owner, name));
  return { name, path: path.join(owner, name), sha256: hash(bytes), bytes: bytes.length, mode: "0444" };
});
writeJson("hashes.stage2-RECOVERY1.json", {
  schema: "stemrobin182/n41-answer-stage2-hashes@1", algorithm: "sha256",
  authorInputs, authorizedFIRSTProvenanceReference: firstReference,
  independentStage1Preserved: preservedStage1, artifacts
});
const hashesPath = path.join(owner, "hashes.stage2-RECOVERY1.json");
writeJson("stage2-freeze-RECOVERY1.json", {
  schema: "stemrobin182/n41-answer-stage2-freeze@1", ticket: "STEMROBIN-182",
  frozenAtUtc: new Date().toISOString(), status: "FROZEN_PASS", outcome,
  mode: "0444", writeOnce: true, owner,
  candidateSha256: authorInputs[0].sha256, independentStage1Sha256: evidence.frozenIndependentSolutionsSha256,
  review: artifacts.find(artifact => artifact.name === "stage2-review-RECOVERY1.json"),
  bindingSummary: artifacts.find(artifact => artifact.name === "stage2-binding-summary-RECOVERY1.json"),
  hashManifest: { path: hashesPath, sha256: hash(fs.readFileSync(hashesPath)) },
  validation, independentStage1Preserved: preservedStage1,
  overallGate2Completed: false, finalizerRun: false, promoted: false, published: false,
  nextSeparateAction: "User authorized n40 Stage3 only after the current n41 comparison; proceed using affected truth freeze and preserve FIRST17."
});
const checksumNames = [...payloadNames, "hashes.stage2-RECOVERY1.json", "stage2-freeze-RECOVERY1.json"];
writeOnce("checksums.stage2-RECOVERY1.sha256", checksumNames.map(name => `${hash(fs.readFileSync(path.join(owner, name)))}  ${name}\n`).join(""));
for (const original of preservedStage1) {
  assert.equal(hash(fs.readFileSync(original.path)), original.sha256);
  assert.equal(fs.statSync(original.path).mode & 0o777, 0o444);
}
for (const input of authorInputs) assert.equal(hash(fs.readFileSync(input.path)), input.sha256);
assert.equal(hash(fs.readFileSync(firstReference.path)), firstReference.sha256);
for (const name of [...checksumNames, "checksums.stage2-RECOVERY1.sha256"]) fs.chmodSync(path.join(owner, name), 0o444);
console.log(JSON.stringify({
  status: "FROZEN_PASS", outcome, mode: "0444", validation,
  review: artifacts.find(artifact => artifact.name === "stage2-review-RECOVERY1.json"),
  bindingSummary: artifacts.find(artifact => artifact.name === "stage2-binding-summary-RECOVERY1.json"),
  freezeReceipt: { path: path.join(owner, "stage2-freeze-RECOVERY1.json"), sha256: hash(fs.readFileSync(path.join(owner, "stage2-freeze-RECOVERY1.json"))) }
}, null, 2));
