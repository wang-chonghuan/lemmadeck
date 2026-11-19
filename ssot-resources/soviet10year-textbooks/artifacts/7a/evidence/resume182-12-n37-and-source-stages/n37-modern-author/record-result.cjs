const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const reportRoot = `${base}/n37-modern-author`;
const lessonId = "alg7-c4-s2-n37";
const book = `${base}/n37-source-stage-affected/artifacts/7a`;
const output = `${book}/editions/modern-us-neutral/lessons/${lessonId}`;
const work = `${base}/n37-modern-work/adapt/7a/modern-us-neutral/lessons/${lessonId}`;
const render = `${reportRoot}/render-FIRST/${lessonId}`;
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = (file) => ({
  path: path.resolve(file),
  bytes: fs.statSync(file).size,
  sha256: hash(file),
});
const save = (file, value) =>
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const first = read(`${reportRoot}/FIRST-template.manifest.json`);
const affected = read(`${reportRoot}/AFFECTED-template.manifest.json`);
const sourceDrift = first.sourceFiles.filter((file) => hash(file.path) !== file.sha256);
assert.deepEqual(sourceDrift, []);
for (const template of affected.templates) {
  assert.equal(hash(template.working), template.sha256);
  assert.equal(hash(template.snapshot), template.sha256);
}
for (const template of first.templates) {
  assert.equal(hash(template.snapshot.path), template.snapshot.sha256);
}

const lesson = read(`${output}/lesson.json`);
const exercises = read(`${output}/exercises.json`);
const figures = read(`${output}/figures.json`);
const audit = read(`${output}/adaptation.audit.json`);
const firstLesson = read(`${reportRoot}/FIRST-template/lesson.template.json`);
const firstExercises = read(`${reportRoot}/FIRST-template/exercises.template.json`);
assert.deepEqual(lesson.source, firstLesson.source);
assert.deepEqual(exercises.source, firstExercises.source);
for (const field of [
  "id", "card_id", "chapter", "section", "number", "title", "printed_title",
  "start_page", "start_printed", "exercise_count",
]) {
  assert.deepEqual(lesson[field], firstLesson[field]);
}
assert.equal(lesson.prose.length, firstLesson.prose.length);
for (const [index, block] of lesson.prose.entries()) {
  for (const field of ["kind", "id", "label", "printed_page", "source_refs", "source_text"]) {
    assert.deepEqual(block[field], firstLesson.prose[index][field]);
  }
  assert.deepEqual(block.numeric_changes, []);
}
assert.equal(exercises.exercises.length, firstExercises.exercises.length);
for (const [index, item] of exercises.exercises.entries()) {
  for (const field of [
    "number", "source_number", "group", "group_id", "pages", "figure_refs",
    "figures", "numbering_erratum", "source_text", "lines",
  ]) {
    assert.deepEqual(item[field], firstExercises.exercises[index][field]);
  }
  assert.deepEqual(item.numeric_changes, []);
  assert.equal(/[\u0400-\u04ff]/u.test(item.text), false);
  for (const field of ["answer", "answerKey", "interaction", "choiceSet"]) {
    assert.equal(Object.hasOwn(item, field), false);
  }
}
assert.equal(lesson.errata.length, 1);
assert.equal(lesson.errata[0].id, "p0229-math-1");
assert.equal(lesson.errata[0].target, "lesson.prose[19]");
assert.equal(
  lesson.errata[0].corrected,
  lesson.errata[0].original.replace("\\sqrt{33}", "\\sqrt{36}"),
);
assert.deepEqual(lesson.errata, firstLesson.errata);
assert.equal(lesson.prose[19].changes.includes("math-correction"), true);
assert.equal(lesson.prose[19].source_text.includes("\\sqrt{33}"), true);
assert.equal(figures.figures.length, 0);

const flowCommand = [
  "node", ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs", "--json", `${output}/lesson.json`,
];
const flowRun = cp.spawnSync(flowCommand[0], flowCommand.slice(1), { cwd, encoding: "utf8" });
assert.equal(flowRun.status, 0, flowRun.stderr);
const flow = JSON.parse(flowRun.stdout);
save(`${reportRoot}/final-prose-flow.json`, flow);
assert.deepEqual(flow.boundaries, audit.resolvedSectionBreaks);
const textHtml = fs.readFileSync(`${render}/text.html`, "utf8");
const exerciseHtml = fs.readFileSync(`${render}/exercises.html`, "utf8");
const renderedIds = [...exerciseHtml.matchAll(/id="ex-([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(renderedIds, exercises.exercises.map((item) => item.number));
const paragraphCount = [...textHtml.matchAll(/<p class="para(?: section)?">/g)].length;
const sectionCount = [...textHtml.matchAll(/<p class="para section">/g)].length;
assert.equal(paragraphCount, flow.paragraphs.length);
assert.equal(sectionCount, flow.boundaries.length);
for (const html of [textHtml, exerciseHtml]) {
  assert.equal(/class="(?:katex-error|err)"/.test(html), false);
  assert.equal(/<(?:script|input|form|button)\b/i.test(html), false);
  assert.equal(/(?:src|href)=["']https?:|url\(["']?https?:/i.test(html), false);
  assert.equal(/<img\b|<figure\b/i.test(html), false);
  assert.equal(/[\u0400-\u04ff]/u.test(html), false);
  assert.ok([...html.matchAll(/src:url\(data:font\/woff2;base64,/g)].length > 0);
}

const labels = [
  "n37-modern-prepare-FIRST",
  "n37-modern-finalize-FIRST",
  "n37-modern-finalize-AFFECTED-ONCE",
  "n37-modern-render-FIRST",
];
const receipts = labels.map((label) => {
  const file = `${base}/stages/${label}.receipt.json`;
  const receipt = read(file);
  for (const stream of receipt.streams) assert.equal(hash(stream.path), stream.sha256);
  return { label, file: record(file), receipt };
});
assert.deepEqual(receipts.map((item) => item.receipt.exit), [0, 2, 0, 0]);
assert.equal(audit.status, "pass");
const checks = {
  sourceFilesUnchanged: first.sourceFiles.length,
  firstSnapshotsUnchanged: first.templates.length,
  sourceSnapshotsAndSourceTextRetained: true,
  identityAndBindingsRetained: true,
  preparedLinesRetained: exercises.exercises.length,
  numberingErrataRetained: exercises.exercises.filter((item) => item.numbering_erratum).length,
  authoredExerciseTextCyrillicCount: 0,
  renderedExerciseIds: renderedIds,
  renderedParagraphs: paragraphCount,
  renderedSectionBoundaries: sectionCount,
  renderedFormulaErrorElements: 0,
  renderedExternalResourceReferences: 0,
  renderedImages: 0,
  addedAnswerOrInteractionFields: 0,
};
const result = {
  schema: "n37-offline-authorship-result@1",
  cwd,
  recordedAt: new Date().toISOString(),
  ticket: "STEMROBIN-182",
  finish: "review",
  status: "isolated-mechanically-finalized-not-approved",
  promoted: false,
  independentTextMathReview: "pending-parent",
  affectedToolBindingReview: "pending",
  imageOpens: 0,
  browserOpens: 0,
  visualReview: "not-performed",
  counts: {
    proseBlocks: lesson.prose.length,
    finalParagraphs: flow.paragraphs.length,
    sectionBreaks: flow.boundaries.length,
    originalExercises: exercises.exercises.length,
    exerciseRange: [exercises.exercises[0].number, exercises.exercises.at(-1).number],
    figures: figures.figures.length,
    mathErrata: lesson.errata.length,
    numberingErrata: checks.numberingErrataRetained,
    changedProseBlocks: audit.changedProseBlocks,
    changedExercises: audit.changedExercises,
    finalizeCalls: 2,
    affectedOnlyRetries: 1,
    renderCalls: 1,
  },
  authoredTemplates: ["lesson.template.json", "exercises.template.json"].map((name) => record(`${work}/${name}`)),
  untouchedFigureTemplate: record(`${work}/figures.template.json`),
  outputs: ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"].map((name) => record(`${output}/${name}`)),
  namedFinalizeIsolatedEditionIndex: record(`${book}/editions/modern-us-neutral/book.json`),
  renders: ["text.html", "exercises.html"].map((name) => record(`${render}/${name}`)),
  evidence: [
    "FIRST-template.manifest.json", "AFFECTED-template.manifest.json",
    "FIRST-adaptation.audit.json", "prose-flow-FIRST.receipt.json",
    "prose-flow-FIRST.stdout", "prose-flow-FIRST.stderr", "final-prose-flow.json",
    "author-notes.md", "snapshot-FIRST.cjs", "record-result.cjs",
  ].map((name) => record(`${reportRoot}/${name}`)),
  stageReceipts: receipts,
  sourceFiles: first.sourceFiles,
  changedToolHashesSinceFIRST: first.toolFiles.filter((file) => hash(file.path) !== file.sha256),
  checks,
  sourceBoundCorrection: lesson.errata[0],
  numberingIdentity: exercises.exercises.filter((item) => item.numbering_erratum)
    .map(({ number, source_number, numbering_erratum }) => ({ number, source_number, numbering_erratum })),
  uncertainty: [
    "Independent text/math and affected tool-binding reviews remain pending; mechanical pass and candidate presence do not approve or promote this output.",
    "FIRST finalization failed only because the numeric regex excludes source-terminal 3. but counts 3 followed by a Chinese period. Recovery retained the ASCII terminal period in exercise 798; no number or formula was changed.",
    "Prepared exercise lines remain unchanged and carry Cyrillic labels; authored text and offline rendered text use Latin labels. The existing finalizer only rewrites lines if normalization changes text.",
    "Exercise 790 still refers to the source book's square table; no new table or figure was supplied. Its two source-supplied worked formats are retained, not newly authored answers.",
    "No browser or visual review was performed; image opens are zero.",
  ],
  forbiddenOperationsPerformed: [],
};
const resultPath = `${reportRoot}/result.json`;
save(resultPath, result);
console.log(JSON.stringify({
  result: record(resultPath),
  counts: result.counts,
  outputs: result.outputs,
  receipts: receipts.map(({ label, file, receipt }) => ({ label, file, exit: receipt.exit })),
  checks,
  changedToolHashesSinceFIRST: result.changedToolHashesSinceFIRST,
}, null, 2));
