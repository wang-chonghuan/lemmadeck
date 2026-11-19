import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const owner = join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n42-n43-answer-review");
const authorDirectory = join(repo, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n42-n43-answer-author");
assert.equal(dirname(fileURLToPath(import.meta.url)), owner);
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const readBound = (path, expected) => {
  const bytes = readFileSync(path);
  const hash = sha(bytes);
  if (expected) assert.equal(hash, expected, `Binding mismatch: ${path}`);
  return { path, sha256: hash, bytes: bytes.length, data: JSON.parse(bytes) };
};
const manifest = readBound(join(owner, "freeze-manifest.json"),
  "cf380614ea0d5a29d21f4233482f469cd09bd44bdc5ec9ba0a6d173f629012de");
const binding = readBound(join(authorDirectory, "author-binding.json"),
  "1b49a7aaa0e25edefbe6970f594e33a7df5673162e447e1257ceffd67957f241");
const notesPath = join(owner, "stage2-review-notes.json");
const notes = readBound(notesPath);
assert.equal(binding.data.lessons.length, 2);
assert.equal(binding.data.exerciseCount, 7);
assert.equal(binding.data.mathematicalTasks, 26);
assert.equal(notes.data.lessons.length, 2);
assert.equal(notes.data.n43ProseMetadataNotice.proseReopened, false);
assert.equal(notes.data.n43ProseMetadataNotice.independentlyRecheckedProse, false);

function verifyStage1Unchanged() {
  assert.equal(sha(readFileSync(manifest.path)), manifest.sha256);
  assert.equal(statSync(manifest.path).mode & 0o777, 0o444);
  for (const output of manifest.data.outputs) {
    assert.ok(output.path.startsWith(`${owner}/`));
    assert.equal(sha(readFileSync(output.path)), output.sha256);
    assert.equal(statSync(output.path).mode & 0o777, 0o444);
  }
}
verifyStage1Unchanged();

const sourcePairs = [
  ["alg7-c4-s3-n42", ["851", "852", "853", "854"], [7, 3, 6, 1]],
  ["alg7-c4-s3-n43", ["855", "856", "857"], [6, 2, 1]]
];
const frozenAt = new Date().toISOString();
const receipts = [];
const reports = [];
const receipt = item => ({ path: item.path, sha256: item.sha256, bytes: item.bytes });

for (const [lesson, exerciseNumbers, counts] of sourcePairs) {
  const stage1Path = join(owner, lesson, "stage1-solutions.json");
  const stage1Output = manifest.data.outputs.find(item => item.path === stage1Path);
  assert.ok(stage1Output);
  const stage1 = readBound(stage1Path, stage1Output.sha256);
  const authorBinding = binding.data.lessons.find(item => item.lesson === lesson);
  assert.ok(authorBinding);
  const authorPath = join(authorDirectory, `${lesson}.answer-keys.frozen.json`);
  assert.equal(resolve(repo, authorBinding.frozen.path), authorPath);
  const author = readBound(authorPath, authorBinding.frozen.sha256);
  const sourceReceipt = manifest.data.sourceReceipts.find(item => item.lesson === lesson && item.role === "sourceInput");
  assert.equal(resolve(repo, authorBinding.source.path), sourceReceipt.path);
  assert.equal(authorBinding.source.sha256, sourceReceipt.sha256);
  assert.equal(stage1.data.sourceInput.sha256, sourceReceipt.sha256);
  assert.equal(stage1.data.authorComparison, "not-disclosed-not-performed");
  assert.equal(stage1.data.stage, 1);
  assert.deepEqual(stage1.data.answers.map(item => item.exercise), exerciseNumbers);
  assert.deepEqual(stage1.data.answers.map(item => item.tasks.length), counts);
  assert.deepEqual(author.data.answers.map(item => item.exercise), exerciseNumbers);
  assert.equal(author.data.lesson, lesson);
  assert.equal(author.data.book, "7a");
  assert.equal(author.data.edition, "modern-us-neutral");
  assert.equal(author.data.status, "draft");
  for (const item of [...stage1.data.answers, ...author.data.answers]) {
    assert.equal(item.grading, "ungraded");
    assert.equal(item.source, "derived");
    assert.deepEqual(item.parts, []);
  }

  const manual = notes.data.lessons.find(item => item.lesson === lesson);
  assert.ok(manual);
  assert.equal(manual.overall, "PASS");
  const frozenTasks = stage1.data.answers.flatMap((item, answerIndex) =>
    item.tasks.map((task, taskIndex) => ({ exercise: item.exercise, answerIndex, taskIndex, task })));
  assert.equal(manual.tasks.length, frozenTasks.length);
  const taskReports = manual.tasks.map((verdict, index) => {
    const frozen = frozenTasks[index];
    assert.equal(verdict.exercise, frozen.exercise);
    assert.equal(verdict.label, frozen.task.label);
    const authorAnswer = author.data.answers[frozen.answerIndex];
    assert.equal(authorAnswer.exercise, verdict.exercise);
    for (const axis of ["correctness", "method", "completeness"]) assert.equal(verdict[axis], "PASS");
    assert.ok(verdict.comparison.length > 20);
    assert.ok(verdict.authorEvidence.length > 0);
    for (const fragment of verdict.authorEvidence) assert.ok(authorAnswer.displayAnswer.includes(fragment),
      `Evidence fragment missing: ${lesson}/${verdict.exercise}/${verdict.label}`);
    return {
      exercise: verdict.exercise,
      label: verdict.label,
      correctness: verdict.correctness,
      method: verdict.method,
      completeness: verdict.completeness,
      discrepancies: [],
      comparison: verdict.comparison,
      frozenStage1TaskPointer: `/answers/${frozen.answerIndex}/tasks/${frozen.taskIndex}`,
      frozenStage1Task: frozen.task,
      authorDisplayAnswerPointer: `/answers/${frozen.answerIndex}/displayAnswer`,
      authorEvidence: verdict.authorEvidence
    };
  });
  const exerciseReports = exerciseNumbers.map((exercise, index) => ({
    exercise, expectedTasks: counts[index],
    comparedTasks: taskReports.filter(item => item.exercise === exercise).length,
    correctness: "PASS", method: "PASS", completeness: "PASS",
    grading: "ungraded", parts: [], discrepancies: []
  }));
  const methodContract = lesson.endsWith("n42") ? {
    status: "PASS",
    graphicalExercises: ["852", "853"],
    construction: "The author supplies a shared coordinate frame, y=x^2 plotting points in 852, the reused parabola method in 853, and two construction points for each corresponding straight line.",
    intersections: "852 gives both coordinate pairs. 853 gives intersection abscissae, with nonintegral readings explicitly approximate and the no-real-intersection case explicit.",
    exactAlgebra: "Validation only, following graph construction and graph-read results; not bare algebra substituted for the requested method.",
    crossExerciseAuthorEvidence: [
      { exercise: "852", fragment: "抛物线可取点 $(-2,4)$、$(-1,1)$、$(0,0)$、$(1,1)$、$(2,4)$" },
      { exercise: "853", fragment: "先把每个方程化成 $x^2=mx+n$，在同一坐标系中画 $y=x^2$ 与对应直线 $y=mx+n$，读取交点的横坐标。" },
      { exercise: "853", fragment: "抛物线可沿用第 852 题的作图方法。" },
      { exercise: "853", fragment: "非整数交点的小数是便于对照的图解近似，不把有限刻度读数当作准确值。" }
    ]
  } : {
    status: "PASS",
    completingSquare: "855 has all six completed-square equations, both signs when applicable, one distinct root for the zero-square case, and the real-domain impossibility explanation for the negative-square case. 856 includes monic reduction followed by completed squares.",
    proof: "857 preserves the given sum and difference and completes the square-difference proof to product 1."
  };
  for (const evidence of methodContract.crossExerciseAuthorEvidence || []) {
    assert.ok(author.data.answers.find(item => item.exercise === evidence.exercise).displayAnswer.includes(evidence.fragment));
  }
  receipts.push({ lesson, stage1: receipt(stage1), author: receipt(author), exerciseSourceBinding: sourceReceipt });
  reports.push({
    path: join(owner, lesson, "stage2-comparison.json"),
    data: {
      schema: "ld-s10y-answer/independent-stage2-comparison@1",
      ticket: "STEMROBIN-182", stage: 2, lesson, book: "7a", edition: "modern-us-neutral",
      status: "PASS", frozenAt,
      basis: notes.data.reviewBasis,
      verificationRole: "Human-readable task comparison verdicts are authored in stage2-review-notes.json. This script checks hashes, coverage, policy and quoted evidence; it does not solve exercises or generate mathematical verdicts.",
      bindings: { stage1: receipt(stage1), author: receipt(author), authorBinding: receipt(binding), stage1Freeze: receipt(manifest), exerciseSource: sourceReceipt },
      sourceHashComparison: "PASS: author-binding source hash exactly matches historical Stage1 exercise source hash; source files were not reopened.",
      totals: { exercises: exerciseNumbers.length, tasks: taskReports.length, correctnessPass: taskReports.length, methodPass: taskReports.length, completenessPass: taskReports.length, discrepancies: 0 },
      methodContract, exerciseReports, taskReports,
      nonblockingDifferences: manual.nonblockingDifferences,
      n43ProseMetadataNotice: lesson.endsWith("n43") ? notes.data.n43ProseMetadataNotice : null,
      limits: {
        noResolve: true, sourceTextReopened: false, proseReopened: false, figuresReopened: false,
        finalized: false, promoted: false, appUsed: false, networkUsed: false, databaseUsed: false,
        stage1Modified: false, authorFilesModified: false, productArtifactsWritten: false,
        overallGate2CompletionClaimed: false
      }
    }
  });
}
assert.equal(reports.reduce((sum, report) => sum + report.data.totals.tasks, 0), 26);
const summaryPath = join(owner, "stage2-summary.json");
const freezePath = join(owner, "stage2-freeze-manifest.json");
const reportPaths = [...reports.map(report => report.path), summaryPath, freezePath];
for (const path of reportPaths) {
  assert.ok(resolve(path).startsWith(`${owner}/`));
  assert.ok(!existsSync(path), `Refusing to overwrite Stage2 evidence: ${path}`);
}
verifyStage1Unchanged();
assert.equal(sha(readFileSync(binding.path)), binding.sha256);
for (const item of receipts) assert.equal(sha(readFileSync(item.author.path)), item.author.sha256);
const summary = {
  schema: "ld-s10y-answer/independent-stage2-summary@1",
  ticket: "STEMROBIN-182", stage: 2, status: "PASS", frozenAt,
  scope: "Frozen-to-frozen comparison only; 7 exercises and 26 tasks.",
  totals: { lessons: 2, exercises: 7, tasks: 26, correctnessPass: 26, methodPass: 26, completenessPass: 26, discrepancies: 0, ungradedExercises: 7, gradingParts: 0 },
  perLesson: reports.map(report => ({ lesson: report.data.lesson, status: report.data.status, totals: report.data.totals, report: report.path })),
  authorBinding: receipt(binding), stage1Freeze: receipt(manifest), comparisonInputs: receipts,
  stage1Integrity: "PASS before and after comparison; all original hashes and 0444 file modes retained.",
  n43ProseMetadataNotice: notes.data.n43ProseMetadataNotice,
  limits: "No new solve, source/prose/figure reopening, finalization, promotion, app, network, DB, commit or product write.",
  nextAction: "STOP. This is a Stage2 comparison result only, not finalization or publication authorization."
};
for (const report of reports) writeFileSync(report.path, `${JSON.stringify(report.data, null, 2)}\n`, { flag: "wx" });
writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, { flag: "wx" });
const outputPaths = [...reports.map(report => report.path), summaryPath, notesPath, fileURLToPath(import.meta.url)];
const outputs = outputPaths.map(path => {
  const bytes = readFileSync(path);
  return { path, sha256: sha(bytes), bytes: bytes.length, mode: "0444" };
});
const freeze = {
  schema: "ld-s10y-answer/independent-stage2-freeze@1",
  ticket: "STEMROBIN-182", stage: 2, status: "PASS", frozenAt, hashAlgorithm: "SHA-256",
  outputs, stage1Freeze: receipt(manifest), authorBinding: receipt(binding),
  authorFrozenKeys: receipts.map(item => ({ lesson: item.lesson, ...item.author })),
  stage1Unchanged: true, sourceProseNotReopened: true,
  scopeStop: summary.nextAction
};
writeFileSync(freezePath, `${JSON.stringify(freeze, null, 2)}\n`, { flag: "wx" });
for (const path of [...outputPaths, freezePath]) {
  chmodSync(path, 0o444);
  assert.equal(statSync(path).mode & 0o777, 0o444);
}
verifyStage1Unchanged();
for (const output of outputs) assert.equal(sha(readFileSync(output.path)), output.sha256);
assert.equal(sha(readFileSync(binding.path)), binding.sha256);
for (const item of receipts) assert.equal(sha(readFileSync(item.author.path)), item.author.sha256);
console.log(JSON.stringify({
  status: "PASS", totals: summary.totals, outputs,
  manifest: { path: freezePath, sha256: sha(readFileSync(freezePath)), mode: "0444" }
}, null, 2));
