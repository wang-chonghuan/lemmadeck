const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { isDeepStrictEqual: equal } = require("node:util");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const B = path.join(cwd, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12");
const out = path.join(B, "n37-modern-review/probes.json");
if (fs.existsSync(out)) throw new Error("Preserve existing probe evidence");
const author = path.join(B, "n37-modern-author");
const book = path.join(B, "n37-source-stage-affected/artifacts/7a");
const id = "alg7-c4-s2-n37";
const raw = path.join(book, "lessons", id);
const modern = path.join(book, "editions/modern-us-neutral/lessons", id);
const references = {};
const checks = [];
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function read(file) {
  const bytes = fs.readFileSync(file);
  references[file] = { sha256: hash(bytes), bytes: bytes.length };
  return bytes;
}
const json = file => JSON.parse(read(file).toString("utf8"));
function check(name, pass, details = {}) {
  checks.push({ name, status: pass ? "PASS" : "REVISE", ...details });
}
function bind(record, name) {
  const bytes = read(record.path);
  check(name, hash(bytes) === record.sha256 &&
    (record.bytes === undefined || bytes.length === record.bytes),
  { path: record.path, expected: record.sha256, observed: hash(bytes) });
}
const result = json(path.join(author, "result.json"));
check("caller-result-hash",
  references[path.join(author, "result.json")].sha256 ===
  "5cb7ff9c70226b186ba4617fbb6143cbdb94c4e250ce4d00d0b04a113dedab89");
const drift = json(path.join(author, "tool-drift.json"));
const first = json(path.join(author, "FIRST-template.manifest.json"));
const affected = json(path.join(author, "AFFECTED-template.manifest.json"));
const flowRecorded = json(path.join(author, "final-prose-flow.json"));
const failure = json(path.join(author, "FIRST-adaptation.audit.json"));
const lesson = json(path.join(raw, "lesson.json"));
const exercises = json(path.join(raw, "exercises.json"));
const candidateLesson = json(path.join(modern, "lesson.json"));
const candidateExercises = json(path.join(modern, "exercises.json"));
const figures = json(path.join(modern, "figures.json"));
const audit = json(path.join(modern, "adaptation.audit.json"));

const inheritedFiles = [
  "numbering-affected-review/numbering-affected-review.json",
  "numbering-affected-review/numbering-binding-affected-review/numbering-binding-affected-review.json",
  "numbering-start-order-affected-review/numbering-start-order-affected-review.json"
];
const inherited = inheritedFiles.map(file => json(path.join(B, file)));
check("inherited-source-and-candidate-only",
  inherited[0].source_numbering_metadata_status === "PASS" &&
  inherited[0].isolated_candidate_status === "PASS");
check("inherited-P1-and-numbering-only-authority",
  inherited[1].prior_P1_answer_authority_bypass === "PASS" &&
  inherited[1].prior_P2_numbering_only_early_return === "PASS");
check("inherited-remaining-start-order", inherited[2].status === "PASS");
check("inherited-candidate-hashes",
  inherited[1].actual_candidate.lesson_sha256 === references[path.join(raw, "lesson.json")].sha256 &&
  inherited[1].actual_candidate.exercises_sha256 === references[path.join(raw, "exercises.json")].sha256);

for (const field of ["outputs", "renders", "evidence", "authoredTemplates", "sourceFiles"]) {
  for (const record of result[field]) bind(record, `result-${field}-hash`);
}
bind(result.untouchedFigureTemplate, "untouched-figure-template-hash");
bind(result.namedFinalizeIsolatedEditionIndex, "isolated-index-hash-only");
check("source-manifest-retained", equal(first.sourceFiles, result.sourceFiles));
for (const template of first.templates) bind(template.snapshot, "FIRST-template-hash");
for (const template of affected.templates) {
  bind({ path: template.snapshot, sha256: template.sha256 }, "AFFECTED-template-hash");
}
bind(affected.firstManifest, "AFFECTED-FIRST-manifest-binding");
bind(affected.firstFailureReceipt, "AFFECTED-FIRST-failure-receipt-binding");
bind(affected.firstFailureAudit, "AFFECTED-FIRST-failure-audit-binding");
bind(drift.result, "drift-result-binding");

const receipts = result.stageReceipts.map(stage => {
  bind(stage.file, "stage-receipt-hash");
  const receipt = json(stage.file.path);
  check("stage-receipt-content", equal(receipt, stage.receipt), { label: stage.label });
  check("stage-sole-cwd", receipt.cwd === cwd, { label: stage.label });
  for (const stream of receipt.streams) {
    bind({ path: path.join(cwd, stream.path), sha256: stream.sha256 }, "stage-stream-hash");
  }
  return { label: stage.label, ...receipt };
});
check("inherited-stage-exits", equal(receipts.map(x => x.exit), [0, 2, 0, 0]));
check("FIRST-single-failure", failure.status === "fail" && failure.errors.length === 1 &&
  failure.errors[0] === "exercises[21] \u7684\u975e\u516c\u5f0f\u6570\u5b57\u53d8\u5316\u672a\u88ab\u51c6\u786e\u58f0\u660e: want=['5', '2'], got=['5', '2', '3']");
check("current-audit-pass", audit.status === "pass" && audit.errors.length === 0);
check("FIRST-snapshot-before-FIRST-execution",
  new Date(first.capturedAt) < new Date(receipts[1].startedAt));
check("AFFECTED-snapshot-before-AFFECTED-execution",
  new Date(affected.capturedAt) < new Date(receipts[2].startedAt));
check("candidate-identity", lesson.id === id && candidateLesson.id === id &&
  candidateExercises.lesson === id && figures.lesson === id && audit.lesson === id);

const editionPath = path.join(cwd, ".claude/skills/ld-s10y-lesson/tools/edition.py");
const toolChanges = first.toolFiles.map(record => {
  const current = read(record.path);
  return { path: record.path, before: record.sha256, current: hash(current) };
}).filter(record => record.before !== record.current);
check("sole-expected-tool-drift", toolChanges.length === 1 && toolChanges[0].path === editionPath);
check("tool-drift-hash-chain", toolChanges.length === 1 &&
  toolChanges[0].before === drift.changedTools[0].before.sha256 &&
  toolChanges[0].current === drift.changedTools[0].current.sha256 &&
  toolChanges[0].current === inherited[2].exact_delta.current_edition_sha256 &&
  toolChanges[0].before === inherited[2].exact_delta.guard_removed_matches_prior_full_edition_sha256);
const recordedMtime = drift.changedTools[0].current.mtime;
check("recorded-tool-change-between-finalize-calls",
  new Date(recordedMtime) > new Date(receipts[1].finishedAt) &&
  new Date(recordedMtime) < new Date(receipts[2].startedAt),
  { recordedMtime, limit: "Timestamp/hash correlation, not instrumented process-loaded code proof." });
check("result-tool-hash-is-disclosed-FIRST-not-current",
  result.changedToolHashesSinceFIRST[0].sha256 === toolChanges[0].before);

const firstLesson = json(path.join(author, "FIRST-template/lesson.template.json"));
const firstExercises = json(path.join(author, "FIRST-template/exercises.template.json"));
const affectedLesson = json(path.join(author, "AFFECTED-template/lesson.template.json"));
const affectedExercises = json(path.join(author, "AFFECTED-template/exercises.template.json"));
const expectedAffected = structuredClone(firstExercises);
const firstText = expectedAffected.exercises[21].text;
expectedAffected.exercises[21].text = firstText.slice(0, -1) + ".";
check("local-repair-only-terminal-ASCII-period",
  firstText.endsWith("3\u3002") && affectedExercises.exercises[21].text.endsWith("3.") &&
  equal(expectedAffected, affectedExercises) && equal(firstLesson, affectedLesson),
  { pointer: "/exercises/21/text", FIRST: "3\\u3002", AFFECTED: "3." });
check("local-repair-figure-template-identical",
  equal(read(path.join(author, "FIRST-template/figures.template.json")),
    read(path.join(author, "AFFECTED-template/figures.template.json"))));

check("lesson-source-snapshot", equal(candidateLesson.source.data, lesson) &&
  candidateLesson.source.sha256 === references[path.join(raw, "lesson.json")].sha256);
check("exercise-source-snapshot", equal(candidateExercises.source.data, exercises) &&
  candidateExercises.source.sha256 === references[path.join(raw, "exercises.json")].sha256);
check("source-paths", candidateLesson.source.path === `lessons/${id}/lesson.json` &&
  candidateExercises.source.path === `lessons/${id}/exercises.json`);
const additionKeys = ["source_text", "changes", "numeric_changes", "historical_entities"];
function retained(source, target, exclusions) {
  return Object.keys(source).every(key => exclusions.includes(key) || equal(source[key], target[key]));
}
check("lesson-root-identity-and-metadata",
  retained(lesson, candidateLesson, ["prose"]));
check("exercise-root-identity-and-metadata",
  retained(exercises, candidateExercises, ["exercises"]));
const formulas = text => Array.from(text.matchAll(/\$([^$]*)\$/g), match => match[1]);
const nonMath = text => text.replace(/\$[^$]*\$/g, "");
const numbers = text => Array.from(nonMath(text).matchAll(/\d+(?:\.\d+)?/g), match => match[0]);
const cyrillic = "\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u043a\u043b\u043c\u043d\u043e\u043f\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044d\u044e\u044f";
const proseProof = [];
const exerciseProof = [];
let proseFormulaCount = 0;
let exerciseFormulaCount = 0;
candidateLesson.prose.forEach((target, index) => {
  const source = lesson.prose[index];
  let expectedText = source.text;
  if (index === 19) {
    expectedText = expectedText.replace(result.sourceBoundCorrection.original,
      result.sourceBoundCorrection.corrected);
  }
  const proof = {
    index,
    source_refs: source.source_refs,
    source_text_exact: target.source_text === source.text,
    immutable_fields_exact: retained(source, target, ["text"]),
    formula_sequence_exact_after_only_registered_correction: equal(formulas(expectedText), formulas(target.text)),
    nonformula_numeric_tokens_exact_including_terminal_numbers: equal(numbers(source.text), numbers(target.text)),
    numeric_changes_empty: target.numeric_changes.length === 0,
    source_math_correction_marker: target.changes.includes("math-correction") === (index === 19)
  };
  check("prose-block-fidelity", Object.entries(proof).every(([key, value]) =>
    typeof value !== "boolean" || value), { index });
  proseFormulaCount += formulas(target.text).length;
  proseProof.push(proof);
});
candidateExercises.exercises.forEach((target, index) => {
  const source = exercises.exercises[index];
  const labels = Array.from(nonMath(target.text).matchAll(/(?:^|\n)([a-z])\)/g), match => match[1]);
  const sourceLabels = Array.from(nonMath(source.text).matchAll(
    new RegExp("([" + cyrillic + "])\\)", "g")), match => match[1]);
  const proof = {
    index,
    number: target.number,
    source_number: target.source_number,
    group_id: target.group_id,
    pages: target.pages,
    source_text_exact: target.source_text === source.text,
    immutable_identity_numbering_and_refs_exact: retained(source, target, ["text", "lines"]),
    prepared_lines_exact: equal(target.lines, firstExercises.exercises[index].lines),
    faithful_lines_exact_in_source_data: equal(source.lines, candidateExercises.source.data.exercises[index].lines),
    formula_sequence_exact: equal(formulas(source.text), formulas(target.text)),
    nonformula_numeric_tokens_exact_including_terminal_numbers: equal(numbers(source.text), numbers(target.text)),
    latin_subparts: labels,
    source_subpart_count: sourceLabels.length,
    natural_subpart_order_and_count: equal(labels, sourceLabels.map((_, i) => String.fromCharCode(97 + i))),
    each_subpart_owns_one_line: labels.length === target.text.split("\n").filter(line => /^[a-z]\)/.test(line)).length &&
      target.text.split("\n").every(line => (nonMath(line).match(/[a-z]\)/g) || []).length <= 1),
    prefix_owns_first_line: labels.length === 0 || !/[a-z]\)/.test(nonMath(target.text.split("\n")[0])),
    numeric_changes_empty: target.numeric_changes.length === 0,
    no_added_fields_except_edition_metadata: Object.keys(target).every(key =>
      Object.hasOwn(source, key) || additionKeys.includes(key))
  };
  check("exercise-fidelity", Object.entries(proof).every(([key, value]) =>
    typeof value !== "boolean" || value), { index, number: target.number });
  exerciseFormulaCount += formulas(target.text).length;
  exerciseProof.push(proof);
});
const visibleText = candidateLesson.prose.concat(candidateExercises.exercises).map(x => x.text);
check("modern-text-no-Cyrillic", visibleText.every(text => !/[\u0400-\u052f]/.test(text)));
check("modern-text-no-fullwidth-column-spaces", visibleText.every(text => !text.includes("\u3000")));
check("CJK-math-punctuation-outside-delimiters", visibleText.every(text =>
  formulas(text).every(math => !/[\u3001\uff0c\uff1b\u3002\uff1f\uff01\uff1a]/.test(math))));
check("math-delimiters-balanced", visibleText.every(text => (text.match(/\$/g) || []).length % 2 === 0));
check("no-authored-HTML-wrapper", visibleText.every(text => !/<\/?(?:span|div|p)\b/i.test(text)));
check("no-added-answer-or-interaction-fields",
  [candidateLesson, candidateExercises, figures].every(value =>
    !/"(?:answers?|answer_key|correct_index|accept|choices?|interaction|interactions)"\s*:/.test(JSON.stringify(value))));

const erratum = candidateLesson.errata[0];
check("one-exact-authorized-erratum", candidateLesson.errata.length === 1 &&
  equal(erratum, result.sourceBoundCorrection));
const p229 = first.sourceFiles.find(record => record.path.endsWith("/pages/0229/page.json"));
check("erratum-page-and-target-binding",
  erratum.id === "p0229-math-1" && erratum.target === "lesson.prose[19]" &&
  erratum.source.page === 229 && erratum.source.printed_page === lesson.prose[19].printed_page &&
  equal(lesson.prose[19].source_refs, [erratum.source.block]) && erratum.source.block === "p0229#2" &&
  p229.sha256 === erratum.source.sha256 && references[p229.path].sha256 === erratum.source.sha256);
check("erratum-exactly-33-to-36", erratum.corrected === erratum.original.replace("\\sqrt{33}", "\\sqrt{36}") &&
  lesson.prose[19].text.split(erratum.original).length === 2 &&
  candidateLesson.prose[19].text.split(erratum.corrected).length === 2 &&
  !candidateLesson.prose[19].text.includes(erratum.original));
check("erratum-PDF-hash-retained",
  erratum.source.pdf_sha256 === "8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052",
  { limit: "Inherited source arbitration; original PDF and pixels not opened." });

const flowTool = path.join(cwd, ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs");
const flow = JSON.parse(execFileSync(process.execPath, [flowTool, "--stdin"],
  { cwd, encoding: "utf8", input: JSON.stringify(candidateLesson) }));
check("current-prose-flow-exactly-recorded", equal(flow, flowRecorded));
check("audit-resolved-boundaries-match-flow",
  equal(audit.resolvedSectionBreaks, flow.boundaries) && equal(candidateLesson.section_breaks,
    flow.boundaries.map(({ index, ...anchors }) => anchors)));
for (const boundary of flow.boundaries) {
  check("boundary-adjacent-exact-paragraphs",
    flow.paragraphs[boundary.index - 1].text === boundary.before &&
    flow.paragraphs[boundary.index].text === boundary.after, { index: boundary.index });
}
check("expected-structure-and-flow-counts", lesson.prose.length === 24 &&
  candidateLesson.prose.length === 24 && flow.paragraphs.length === 29 &&
  equal(flow.resolvedBreaks, [10, 17, 22, 24, 28]) && figures.figures.length === 0 &&
  exercises.exercises.length === 22 && candidateExercises.exercises.length === 22 &&
  equal(candidateExercises.exercises.map(x => x.number),
    Array.from({ length: 22 }, (_, i) => String(777 + i))));
const numbered = candidateExercises.exercises.filter(x => x.numbering_erratum);
check("three-source-numbering-labels-retained", equal(numbered.map(x => [x.number, x.source_number]),
  [["786", "736"], ["787", "737"], ["788", "738"]]) &&
  numbered.every(x => x.text.startsWith(x.source_number + ".") &&
    x.numbering_erratum.block === x.pages[0]));
const counts = {
  proseBlocks: candidateLesson.prose.length,
  finalParagraphs: flow.paragraphs.length,
  sectionBoundaries: flow.boundaries.length,
  boundaryIndices: flow.resolvedBreaks,
  exercises: candidateExercises.exercises.length,
  exerciseRange: [candidateExercises.exercises[0].number, candidateExercises.exercises.at(-1).number],
  exercisesWithLatinSubparts: exerciseProof.filter(x => x.latin_subparts.length).length,
  latinSubparts: exerciseProof.reduce((total, x) => total + x.latin_subparts.length, 0),
  proseFormulas: proseFormulaCount,
  exerciseFormulas: exerciseFormulaCount,
  mathematicalCorrections: candidateLesson.errata.length,
  numberingErrata: numbered.length,
  figures: figures.figures.length,
  sourceFilesHashVerified: result.sourceFiles.length,
  FIRSTTemplatesPreserved: first.templates.length,
  imageOpens: 0,
  producerOrSuiteReruns: 0,
  readOnlyProseFlowCallsInSuccessfulProbe: 1,
  priorReadOnlyProseFlowFormatFailure: 1
};
const stable = Object.entries(references).every(([file, record]) =>
  hash(fs.readFileSync(file)) === record.sha256);
check("read-set-stable-at-probe-completion", stable);
const output = {
  schema: "n37-modern-independent-readonly-probes@1",
  cwd, ticket: "STEMROBIN-182", finish: "review", offline: true,
  recordedAt: new Date().toISOString(),
  status: checks.every(x => x.status === "PASS") ? "PASS" : "REVISE",
  scope: "Structural/fidelity evidence, not semantic approval by itself.",
  counts, checks, proseProof, exerciseProof, flow, toolChanges, references,
  limits: [
    "Page/book/tool bytes hash-checked only; no source page, tool code, answer file or choice content inspected.",
    "Original source33 printing arbitration inherited; no new pixel arbitration.",
    "Receipts are existing execution evidence, not reruns or instrumented loaded-code evidence.",
    "Candidate outputs bind this review. No promotion or full-lesson/ticket approval."
  ]
};
fs.writeFileSync(out, JSON.stringify(output, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  path: out, sha256: hash(fs.readFileSync(out)), status: output.status,
  counts, checks: checks.length, failures: checks.filter(x => x.status !== "PASS")
}, null, 2));
if (output.status !== "PASS") process.exitCode = 2;
