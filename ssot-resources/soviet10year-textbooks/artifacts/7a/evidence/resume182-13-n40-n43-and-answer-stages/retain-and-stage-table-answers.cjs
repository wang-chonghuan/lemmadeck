const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const book = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const out = `${book}/evidence/resume182-13-bradis-table-method`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const verdictFile = `${base}/table-answer-review/verdict.json`;
const verdict = read(verdictFile);
assert.equal(verdict.status, "PASS_AFFECTED_TABLE_METHOD_AND_KEYS");
assert.deepEqual(verdict.actionable_defects, []);
for (const binding of Object.values(verdict.candidate_bindings)) {
  assert.equal(sha(binding.path), binding.sha256);
}
assert(!fs.existsSync(out));
const files = new Set();
const collect = (folder, suffixes) => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = `${folder}/${entry.name}`;
    if (entry.isDirectory()) collect(file, suffixes);
    else if (entry.isFile() && suffixes.test(file)) files.add(file);
  }
};
for (const folder of [
  "bradis-identification", "bradis-method-rules", "bradis-cell-review",
  "bradis-tables-source-review", "table-answer-author/FIRST", "table-answer-review",
]) collect(`${base}/${folder}`, /\.(json|md|sha256|py)$/);
files.add(`${base}/bradis-source/download.json`);
files.add(`${base}/bradis-transcription-repair.json`);
files.add(`${base}/repair-bradis-transcriptions.cjs`);
const archive = new Map();
const byHash = new Map();
for (const file of [...files].sort()) {
  const digest = sha(file);
  let retained = byHash.get(digest);
  if (!retained) {
    retained = `${out}/${path.relative(base, file).replace(/\.json$/, ".record")}`;
    fs.mkdirSync(path.dirname(retained), { recursive: true });
    fs.copyFileSync(file, retained, fs.constants.COPYFILE_EXCL);
    assert.equal(sha(retained), digest);
    byHash.set(digest, retained);
  }
  archive.set(file, retained);
}
const provenanceFile = `${out}/provenance.json`;
const authorProvenance = read(`${base}/table-answer-author/FIRST/provenance.json`);
const { identity_evidence, ...sourceIdentity } = authorProvenance.source_identity;
fs.writeFileSync(provenanceFile, `${JSON.stringify({
  ticket: "STEMROBIN-182",
  status: verdict.status,
  sourceIdentity,
  identityEvidence: ref(archive.get(`${base}/bradis-identification/identification.json`)),
  sourcePdfCopied: false,
  actualReviewedOutputs: verdict.scope.actual_displayed_outputs_compared,
  authorProvenance: ref(archive.get(`${base}/table-answer-author/FIRST/provenance.json`)),
  independentReview: ref(archive.get(verdictFile)),
  methodRoute: ref(archive.get(`${base}/table-answer-author/FIRST/method-route.md`)),
  retained: [...archive].map(([origin, retained]) => ({
    historicalOriginRelativeToBatch: path.relative(base, origin), retained: ref(retained),
  })),
  historicalPathsInRecordsAreNotRuntimeDependencies: true,
  imagesOpenedDuringRetention: 0,
  firstFailuresPreserved: true,
  historicalSameEditionClaim: false,
  unconditionalErrorGuarantee: false,
}, null, 2)}\n`, { flag: "wx" });
const promoted = [];
for (const short of ["n38", "n39"]) {
  const source = verdict.candidate_bindings[short];
  const original = read(source.path);
  const candidate = structuredClone(original);
  const changedNotes = [];
  for (const answer of candidate.answers) {
    if (!answer.notes?.startsWith("AUTHOR FIRST")) continue;
    answer.notes = `Table method and keys independently reviewed; prior arithmetic approvals reused. Actual source: Bradis, Drofa 2010, 13th stereotype edition, not a historical same-edition claim. Retained source cells, rules, conventions and review: ${provenanceFile}, SHA256=${sha(provenanceFile)}.`;
    changedNotes.push(answer.exercise);
  }
  assert(changedNotes.length > 0);
  const stripped = value => value.answers.map(({ notes, ...answer }) => answer);
  assert.deepEqual(stripped(candidate), stripped(original));
  assert(candidate.answers.every(answer => answer.grading === "ungraded" && answer.parts.length === 0));
  const target = `${book}/editions/modern-us-neutral/lessons/${candidate.lesson}/answer-keys.json`;
  assert(!fs.existsSync(target));
  fs.writeFileSync(target, `${JSON.stringify(candidate, null, 2)}\n`, { flag: "wx" });
  promoted.push({
    lesson: candidate.lesson, source, target: ref(target),
    changedNotes, mathematicalContentUnchanged: true,
    sourceProvenance: ref(provenanceFile), independentReview: ref(archive.get(verdictFile)),
    finalizePending: true, completeCourseCredit: false,
  });
}
fs.writeFileSync(`${base}/n38-n39-answer-stage.json`,
  `${JSON.stringify({ promoted, uniqueRetainedEvidenceFiles: byHash.size }, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ stagedLessons: promoted.map(item => item.lesson),
  uniqueRetainedEvidenceFiles: byHash.size, mathematicalContentUnchanged: true }));
