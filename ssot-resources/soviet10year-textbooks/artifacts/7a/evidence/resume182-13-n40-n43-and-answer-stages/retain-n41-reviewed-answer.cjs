const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const dir = "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41";
const out = `${dir}/answer-evidence`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const summaryFile = `${base}/n41-answer-review/stage2-binding-summary-RECOVERY1.json`;
const summary = read(summaryFile);
assert.equal(summary.status, "PASS");
assert.equal(summary.validation.taskMatches, 80);
assert.equal(summary.validation.tableValuesMatched, 12);
assert.deepEqual(summary.validation.findings, []);
for (const row of summary.authorInputs) assert.equal(sha(row.path), row.sha256);
for (const row of summary.sourceBindingComparisons) assert.equal(sha(row.path), row.sha256);
const source = summary.authorInputs.find(row => row.name === "alg7-c4-s2-n41.answer-keys.frozen.json");
assert.equal(source.sha256, "d19f79dfff3e4ceb7b6a5d7921a31af26710890a3c5bf5cbfcc9215ab63bd3e0");
assert(!fs.existsSync(out));
assert(!fs.existsSync(`${dir}/answer-keys.json`));
const records = [];
for (const file of [
  source.path, summaryFile,
  `${base}/n41-answer-review/stage1-freeze.json`,
  `${base}/n41-answer-review/source-solutions.stage1.json`,
  `${base}/n41-answer-review/stage2-review-RECOVERY1.json`,
  `${base}/n41-answer-review/stage2-validation-RECOVERY1.json`,
  `${base}/n41-answer-review/stage2-freeze-RECOVERY1.json`,
  `${base}/n41-table-cell-source/capture-36.json`,
  `${base}/n41-table-cell-source/capture-37.json`,
  `${base}/n41-table-cell-source/source-captures.json`,
]) {
  const retained = `${out}/${path.basename(file).replace(/\.json$/, ".record")}`;
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(file, retained, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(file), sha(retained));
  records.push({ original: ref(file), retained: ref(retained) });
}
const provenanceFile = `${out}/provenance.json`;
const shared = "ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-13-bradis-table-method/provenance.json";
fs.writeFileSync(provenanceFile, `${JSON.stringify({
  ticket: "STEMROBIN-182", status: "PASS",
  originals: 17, mathematicalTasks: 80, lookupObligations: 12,
  independentSourceFrozenBeforeCandidate: true, sourceAndFigureReviewNotRepeated: true,
  independentReview: ref(records.find(row => row.original.path.endsWith("/stage2-review-RECOVERY1.json")).retained.path),
  tableSourceIdentityAndRules: ref(shared),
  sourcePdfCopied: false, historicalTableEquivalenceClaimed: false,
  tieOrTrueValueErrorGuaranteeClaimed: false,
  records: records.map(row => ({
    historicalOriginRelativeToBatch: path.relative(base, row.original.path),
    retained: row.retained,
  })),
  historicalPathsInRecordsAreNotRuntimeDependencies: true,
  newImageOpens: 0,
}, null, 2)}\n`, { flag: "wx" });
const original = read(source.path);
const candidate = structuredClone(original);
const changedNotes = [];
for (const answer of candidate.answers) {
  if (!["835", "843"].includes(answer.exercise)) continue;
  answer.notes = `All six exact results and table-cell arithmetic independently reviewed. No correction, extra rounding, historical table equivalence or true-value error guarantee is claimed. Source cells, prior captures, conventions and the independent 80-task review: ${provenanceFile}, SHA256=${sha(provenanceFile)}.`;
  changedNotes.push(answer.exercise);
}
assert.deepEqual(changedNotes, ["835", "843"]);
assert.deepEqual(candidate.answers.map(({ notes, ...row }) => row),
  original.answers.map(({ notes, ...row }) => row));
assert(candidate.answers.every(row => row.grading === "ungraded" && row.parts.length === 0));
fs.writeFileSync(`${dir}/answer-keys.json`, `${JSON.stringify(candidate, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(`${base}/n41-answer-stage.json`, `${JSON.stringify({
  source, target: ref(`${dir}/answer-keys.json`), provenance: ref(provenanceFile),
  changedNotes, mathematicalFieldsUnchanged: true, finalizePending: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedReviewedAnswers: 17, tasks: 80, lookupObligations: 12, changedNotes }));
