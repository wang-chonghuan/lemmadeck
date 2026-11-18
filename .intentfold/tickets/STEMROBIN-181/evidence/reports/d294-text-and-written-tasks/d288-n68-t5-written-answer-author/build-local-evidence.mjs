import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const authorRoot = path.join(tmp, "d283-n68-t5-text-author");
const candidatePath = path.join(root, "written-answers.candidate.json");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const objectSHA = value => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
const binding = (p, role) => ({role, path: p, sha256: sha(p), bytes: fs.statSync(p).size});
const writeNew = (p, value) => {
  assert(p.startsWith(root + path.sep), "Writes must remain in d288");
  fs.mkdirSync(path.dirname(p), {recursive: true});
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + "\n", {flag: "wx"});
};

assert(!fs.existsSync(path.join(root, "evidence-register.json")), "Local stage already completed; do not replay");
const freezePath = path.join(authorRoot, "author-freeze.json");
assert.equal(sha(freezePath), "96002fefdde2e2c2d6735cbb28487a4a8755b8274da4e3a5b52d8665e45ac458");
assert.equal(fs.statSync(freezePath).mode & 0o777, 0o444);
const freeze = read(freezePath);
const d284Path = path.join(tmp, "d284-n68-t5-first-text-review/report.json");
const rawPath = path.join(tmp, "d280-illumination-independent-raw-solutions/independent-solutions.json");
assert.equal(sha(d284Path), "157c8bf65332b698e5bdf3577f56185b6a31f2636722fe54a01b042e05f37588");
assert.equal(sha(rawPath), "b7c7613eca97e07a42de0b8b85c3533240e2ed9bdd722004213e868c3167eb09");
const raw = read(rawPath);
const review = read(d284Path);
const selected = freeze.candidates.flatMap(card => card.templates
  .filter(t => t.name === "exercises" || (card.alias === "n68" && t.name === "lesson"))
  .map(t => ({...t, alias: card.alias, language: card.language, card: card.card})));
assert.equal(selected.length, 6);
for (const item of selected) {
  assert.equal(sha(item.path), item.sha256);
  assert.equal(fs.statSync(item.path).mode & 0o777, 0o444);
}
const inputs = [
  binding(freezePath, "d283-current-author-freeze"),
  binding(d284Path, "d284-scoped-text-review-not-answer-approval"),
  binding(rawPath, "d280-pre-solutions-reused-not-recomputed"),
  ...selected.map(t => binding(t.path, `${t.alias}-${t.language}-${t.name}`)),
  binding(path.join(workspace, ".claude/skills/ld-s10y-answer/SKILL.md"), "cap2-contract"),
  binding(path.join(workspace, ".claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md"), "gate2-contract"),
  binding(path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"), "local-math-module"),
  binding(path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/katex_check.js"), "local-katex-parser")
];
const ledger = read(path.join(root, "actual-opens.json"));
assert.equal(sha(ledger.inheritedLedger.path), ledger.inheritedLedger.sha256);
assert.equal(ledger.cumulative, 24);
assert.equal(ledger.new, 0);
assert.deepEqual(ledger.opens, []);
inputs.push(binding(ledger.inheritedLedger.path, "same-agent-lifetime-ledger"));
writeNew(path.join(root, "input-bindings.json"), {
  schema: "stemrobin/written-answer-input-bindings@1", ticket: "STEMROBIN-181",
  inputs, selectedTemplatesVerified: 6, d283OtherArtifactsReplayed: false,
  sourceSnapshots: "Embedded in the frozen exercise templates; no canonical/raw-page or figure files reopened.",
  imageHashesComputed: 0, preSolutionArithmeticReruns: 0,
  d286ParallelRepairConsumed: false
});

const docs = Object.fromEntries(selected.filter(t => t.name === "exercises")
  .map(t => [`${t.alias}:${t.language}`, {document: read(t.path), binding: binding(t.path, "modern-prompt")}]));
const candidates = read(candidatePath);
const held = read(path.join(root, "held-tasks.json"));
assert.equal(candidates.schema, "stemrobin/bilingual-written-answer-candidates@1");
assert.equal(candidates.status, "draft");
const requested = raw.solutions.map(s => s.id);
const authoredIds = ["n68-q1", "n68-q2", "n68-q3", "n68-q4",
  "t5-ex1", "t5-ex2", "t5-ex3", "t5-ex4", "t5-ex6", "t5-ex7"];
assert.deepEqual(candidates.answers.map(a => a.id), authoredIds);
assert.equal(new Set(authoredIds).size, 10);
assert.deepEqual(candidates.heldTaskIds, ["t5-ex5"]);
assert.deepEqual(held.tasks.map(t => t.id), ["t5-ex5"]);
assert(!candidates.wholeCardReady);
const forbiddenFields = new Set(["expected", "judge", "correct", "correctOptions", "answerKey"]);
function noAutoKeys(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    assert(!forbiddenFields.has(key), `No automatic grading fields: ${key}`);
    noAutoKeys(item);
  }
}
noAutoKeys(candidates);
const registry = [];
for (const id of requested) {
  const solutionIndex = raw.solutions.findIndex(s => s.id === id);
  const solution = raw.solutions[solutionIndex];
  const alias = id.startsWith("n68-") ? "n68" : "t5";
  const zh = docs[`${alias}:zh`];
  const en = docs[`${alias}:en`];
  const index = zh.document.exercises.findIndex(e => String(e.number) === String(solution.sourceNumber));
  const z = zh.document.exercises[index];
  const e = en.document.exercises[index];
  assert(z && e);
  assert.equal(z.number, e.number);
  assert.equal(z.group_id, e.group_id);
  assert.deepEqual(z.pages, e.pages);
  assert.deepEqual(z.figure_refs, []);
  assert.deepEqual(e.figure_refs, []);
  assert.deepEqual(z.figures, []);
  assert.deepEqual(e.figures, []);
  assert.deepEqual(zh.document.source.data, en.document.source.data);
  assert.equal(zh.document.source.sha256, en.document.source.sha256);
  assert.deepEqual(z.pages, solution.sourceRefs);
  const draft = candidates.answers.find(a => a.id === id);
  if (draft) {
    assert.equal(draft.source, "derived");
    assert.equal(draft.grading, "ungraded");
    assert.deepEqual(draft.parts, []);
    assert.equal(draft.lesson, solution.card);
    assert.equal(draft.exercise, z.number);
    assert.equal(draft.source_number, z.source_number);
    assert.equal(draft.group_id, z.group_id);
    assert.deepEqual(draft.source_refs, z.pages);
    assert.deepEqual(draft.historical_entities, []);
    assert(draft.taskCoverage.length);
    for (const language of ["zh", "en"]) {
      assert.equal(typeof draft.displayAnswer[language], "string");
      assert(draft.displayAnswer[language].trim().length > 40);
      assert(!/[\u0400-\u04ff]/u.test(draft.displayAnswer[language]), "No revived Cyrillic cultural wording");
      for (const term of ["伊凡", "果戈里"]) assert(!draft.displayAnswer[language].includes(term));
    }
    if (id === "t5-ex3") {
      assert(draft.displayAnswer.zh.includes("Alex"));
      assert(draft.displayAnswer.en.includes("Alex"));
    }
  } else {
    assert.equal(id, "t5-ex5");
    assert(!held.tasks[0].answerAuthored);
  }
  const taskReview = review.pairedQuestionReviews.find(q => q.preSolutionId === id);
  assert(taskReview);
  registry.push({
    evidenceId: draft?.evidenceId || "D288-E-T5-EX5-HELD",
    taskId: id, lesson: solution.card, exercise: z.number, groupId: z.group_id,
    sourceNumber: z.source_number, sourceRefs: z.pages,
    modernExercisePointer: `/exercises/${index}`,
    modernZH: {file: zh.binding, snapshot: z, semanticSnapshotSHA256: objectSHA(z)},
    modernEN: {file: en.binding, snapshot: e, semanticSnapshotSHA256: objectSHA(e)},
    embeddedSource: {
      logicalPath: zh.document.source.path, declaredFileSHA256: zh.document.source.sha256,
      pointer: `/source/data/exercises/${index}`, snapshot: zh.document.source.data.exercises[index],
      semanticSnapshotSHA256: objectSHA(zh.document.source.data.exercises[index]),
      originalFileReopened: false
    },
    priorTextReview: {
      file: binding(d284Path, "text-task-review"),
      pointer: `/pairedQuestionReviews/${review.pairedQuestionReviews.indexOf(taskReview)}`,
      SCI: taskReview.SCI, ZHEN: taskReview.ZHEN, answerApproval: false
    },
    reusedPreSolution: {
      file: binding(rawPath, "pre-solution-only"),
      pointer: `/solutions/${solutionIndex}`, id: solution.id,
      entrySHA256JSONstringify: objectSHA(solution),
      originalTextSHA256: solution.sourceTextUtf8Sha256,
      preSolutionStatus: solution.preSolutionStatus,
      independentSolution: id === "t5-ex5" ? "Internal conditional calculation is cited by pointer only; no display answer." : solution.independentSolution,
      conditions: solution.conditions, definitionRefs: solution.definitionRefs || solution.unitEvidenceRefs,
      units: solution.units || solution.printedUnits,
      conditionalCalculationForHeldTaskPointer: id === "t5-ex5" ? `/solutions/${solutionIndex}/conditionalResult` : null,
      numericValuesRecomputed: false, modernAnswerApproved: false,
      legacyResponseUnitProposalsUsedOrCopied: false
    },
    answerArtifact: draft ? {path: candidatePath, pointer: `/answers/${candidates.answers.indexOf(draft)}`,
      taskCoverage: draft.taskCoverage, grading: "ungraded", source: "derived",
      independentSCIAndZHEN: "PENDING"} : {status: "HOLD-NO-ANSWER-AUTHORED", findings: held.tasks[0].findings},
    figureEvidence: [], sourceOrModernPixelsObserved: false
  });
}
writeNew(path.join(root, "evidence-register.json"), {
  schema: "stemrobin/written-answer-evidence-register@1", ticket: "STEMROBIN-181",
  entries: registry, snapshotDigestConvention: "SHA256 of UTF-8 JSON.stringify of the selected object, not a physical byte slice",
  fullInputFileBindings: "input-bindings.json", requested: 11, authored: 10, held: 1,
  d280IsPreSolutionEvidenceNotApprovedModernAnswer: true, independentReview: "PENDING",
  figureReferencesAcrossAllElevenTasks: 0, newImages: 0
});

const derivedPaths = [];
for (const alias of ["n68", "t5"]) {
  for (const language of ["zh", "en"]) {
    const promptDoc = docs[`${alias}:${language}`].document;
    const answers = candidates.answers.filter(a => a.lesson === promptDoc.lesson).map(answer => {
      const exercise = promptDoc.exercises.find(e => e.number === answer.exercise);
      return {
        exercise: answer.exercise, source_number: answer.source_number, group_id: answer.group_id,
        prompt: exercise.text, source_refs: answer.source_refs, figureEvidence: [],
        grading: "ungraded", source: "derived", displayAnswer: answer.displayAnswer[language],
        parts: [], historical_entities: [], evidenceId: answer.evidenceId,
        reviewStatus: "PENDING-INDEPENDENT-SCI-AND-ZHEN"
      };
    });
    const output = path.join(root, alias, language, "answer-keys.candidate.json");
    writeNew(output, {
      schema: "ld-s10y-answer/lesson-answers@1", book: "10p", lesson: promptDoc.lesson,
      edition: "modern-us-neutral", language, status: "draft", answers,
      readOnlyWrittenResponses: true, automaticGradingKeys: 0,
      coverage: {requested: promptDoc.count, authored: answers.length, held: alias === "t5" ? ["5"] : [],
        completeAnswerCoverage: alias === "n68", completeCardReady: false},
      finalizeRun: false, independentReview: "PENDING"
    });
    derivedPaths.push(binding(output, `${alias}-${language}-written-answer-candidate`));
  }
}
writeNew(path.join(root, "local-structure-check.json"), {
  schema: "stemrobin/partial-written-answer-structure-check@1",
  ticket: "STEMROBIN-181", status: "PASS-LOCAL-STRUCTURE-ONLY",
  requestedTasks: 11, authoredTasks: 10, languageDisplayAnswers: 20, heldTasks: ["t5-ex5"],
  nativeShapeCandidateFiles: derivedPaths,
  allAuthoredSourceDerivedGradingUngradedPartsEmpty: true,
  promptAndIdentityAndSourceRefsBoundToFrozenEdition: true,
  noAutomaticGradingFields: true, noRevivedSourceActorNames: true,
  allElevenTasksHaveNoFigureReferences: true, oldInputsOrInteractionsEdited: false,
  fullGate2Coverage: "HOLD: t5 exercise5 has no answer",
  wholeLessonFinalizeOrNativeValidateLessonInvoked: false,
  sourceScientificOrBilingualIndependentReviewPASS: false,
  mathematicalArithmeticEvaluations: 0, newImages: 0
});

const python = path.join(workspace, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const command = [python, "-B", path.join(root, "local-latex-check.py"), candidatePath];
const startedUtc = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), {
  cwd: workspace, encoding: "utf8", env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"}
});
const stdout = path.join(root, "local-latex.stdout.json");
const stderr = path.join(root, "local-latex.stderr.txt");
fs.writeFileSync(stdout, result.stdout || "", {flag: "wx"});
fs.writeFileSync(stderr, result.stderr || "", {flag: "wx"});
writeNew(path.join(root, "local-latex.receipt.json"), {
  schema: "stemrobin/local-candidate-check-receipt@1", command,
  startedUtc, finishedUtc: new Date().toISOString(), invocationCount: 1,
  exitCode: result.status, signal: result.signal, error: result.error?.message || null,
  stdout: binding(stdout, "local-latex-result"), stderr: binding(stderr, "local-latex-stderr"),
  arithmeticRechecks: 0, nativeFinalizeOrPublisherCalls: 0, modelNetworkCalls: 0, newImages: 0
});
console.log(result.stdout || "");
if (result.stderr) console.error(result.stderr);
assert.equal(result.status, 0, "Local LaTeX check must pass; never substitute a whole-card gate");
for (const input of inputs) assert.equal(sha(input.path), input.sha256, "Preserve frozen inputs");
console.log(JSON.stringify({
  localStructureExit: 0, latexExit: result.status, authoredTasks: 10, authoredDisplayAnswers: 20,
  heldTasks: ["t5-ex5"], inputBindings: inputs.length, sourceTaskArithmeticReruns: 0,
  newImages: 0, cumulativeImages: 24,
  outputs: [candidatePath, path.join(root, "held-tasks.json"), path.join(root, "actual-opens.json"),
    path.join(root, "input-bindings.json"), path.join(root, "evidence-register.json"),
    path.join(root, "local-structure-check.json"), path.join(root, "local-latex.stdout.json"),
    path.join(root, "local-latex.receipt.json"), ...derivedPaths.map(x => x.path)].map(p => binding(p, "output"))
}, null, 2));
