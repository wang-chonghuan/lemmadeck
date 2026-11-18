import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const bind = p => ({path: p, sha256: sha(p), bytes: fs.statSync(p).size});
const freezePath = path.join(root, "author-freeze.json");
assert(!fs.existsSync(freezePath), "Author freeze is immutable; do not overwrite");
const report = read("report.json");
const inputs = read("input-bindings.json");
for (const input of inputs.inputs) assert.equal(sha(input.path), input.sha256, input.path);
for (const item of Object.values(report.bindings)) {
  assert.equal(sha(path.join(root, item.path)), item.sha256, item.path);
}
const candidate = read("written-answers.candidate.json");
const held = read("held-tasks.json");
const structure = read("local-structure-check.json");
const latex = read("local-latex.stdout.json");
const receipt = read("local-latex.receipt.json");
const ledger = read("actual-opens.json");
assert.equal(candidate.answers.length, report.coverage.authoredBilingualTasks);
assert.equal(structure.authoredTasks, 10);
assert.equal(latex.displayAnswers, 20);
assert.equal(latex.formulas, 102);
assert.deepEqual(latex.errors, []);
assert.deepEqual(latex.warnings, []);
assert.equal(receipt.exitCode, 0);
assert.equal(ledger.new, 0);
assert.equal(ledger.cumulative, 24);
assert.equal(sha(ledger.inheritedLedger.path), ledger.inheritedLedger.sha256);
assert.deepEqual(held.tasks.map(x => x.id), ["t5-ex5"]);
assert(!candidate.answers.some(x => x.id === "t5-ex5"));
assert(!report.boundaries.completeCardPASSOrPublicationReady);
for (const alias of ["n68", "t5"]) {
  for (const language of ["zh", "en"]) {
    const document = read(`${alias}/${language}/answer-keys.candidate.json`);
    assert.equal(document.status, "draft");
    assert.equal(document.answers.length, alias === "n68" ? 4 : 6);
    for (const answer of document.answers) {
      assert.equal(answer.source, "derived");
      assert.equal(answer.grading, "ungraded");
      assert.deepEqual(answer.parts, []);
    }
  }
}
function listFiles(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(p);
    assert(entry.isFile(), "Unexpected nonfile in author outputs");
    return [p];
  }).sort();
}
const files = listFiles(root);
const freeze = {
  schema: "stemrobin/first-bilingual-written-answer-author-freeze@1",
  ticket: "STEMROBIN-181", date: "2026-11-18", frozenUtc: new Date().toISOString(),
  role: "First candidate author, not independent SCI/ZHEN answer reviewer",
  status: report.status, writeRoot: root,
  report: bind(path.join(root, "report.json")),
  candidates: bind(path.join(root, "written-answers.candidate.json")),
  heldTasks: bind(path.join(root, "held-tasks.json")),
  evidenceRegister: bind(path.join(root, "evidence-register.json")),
  actualOpens: bind(path.join(root, "actual-opens.json")),
  inputBindings: bind(path.join(root, "input-bindings.json")),
  verifiedInputs: inputs.inputs, artifacts: files.map(bind),
  coverage: report.coverage, localChecks: report.localChecks, imageBudget: report.imageBudget,
  finalIntegrity: {status: "MATCH", directInputHashes: inputs.inputs.length,
    ownedReportBindings: Object.keys(report.bindings).length,
    scope: "Hash and report consistency only; no repeated calculation, native finalize or independent review"},
  fullGate2PASS: false, t5CompleteAnswerCoverage: false,
  wholeCardReady: false, independentAnswerSCIAndZHEN: "PENDING",
  immutablePolicy: "Create once. Every owned output and this freeze become0444; future changes require new output scope."
};
fs.writeFileSync(freezePath, JSON.stringify(freeze, null, 2) + "\n", {flag: "wx"});
for (const p of [...files, freezePath]) fs.chmodSync(p, 0o444);
console.log(JSON.stringify({
  freeze: bind(freezePath), report: bind(path.join(root, "report.json")),
  ownedArtifacts: files.length, mode: "0444", authoredTasks: 10, languageDisplayAnswers: 20,
  heldTasks: ["t5-ex5"], newImages: 0, cumulativeImages: 24, remainingImages: 0,
  localStructureExit: 0, localLaTeXExit: receipt.exitCode,
  numericRechecks: 0, nativeFinalizeOrPublisherCalls: 0
}, null, 2));
