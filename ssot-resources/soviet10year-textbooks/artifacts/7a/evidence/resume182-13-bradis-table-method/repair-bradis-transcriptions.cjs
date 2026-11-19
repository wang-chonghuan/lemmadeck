const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const folder = `${base}/bradis-tables-source-review`;
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const original = read(`${folder}/transcriptions.json`);
assert.equal(sha(`${folder}/transcriptions.json`),
  "2afbd789fa418d36427c673f17ab253219eb63717b94ff91b467b436aedebbad");
const verdict = read(`${base}/bradis-cell-review/stage2-verdict.json`);
assert.equal(verdict.cell_discrepancies_in_request_order.length, 3);
const current = structuredClone(original);
const square = current.n38_hold_lookups.find(item => item.id === "799.c2");
assert.equal(square.corrections["5"], "4");
square.corrections["5"] = "5";
square.lesson_add_result = "18.71";
square.III_instruction_result = "18.71";
const root = current.n39_main_and_correction_cells.find(item => item.id === "r60.37");
assert.equal(root.corrections["7"], "5");
root.corrections["7"] = "4";
root.derived_add_result = "7.769";
const main = current.n39_main_and_correction_cells.find(item => item.id === "r6.52");
assert.equal(main.main.printed, "2,554");
main.main.printed = "2,553";
const rules = read(`${folder}/source-rules.json`);
const tableIII = rules.tables.find(item => item.id === "III");
assert(tableIII);
tableIII.grid.instruction_grid_discrepancy =
  "FIRST author misread corrected from frozen independent pixels: printed prose and grid both state nine correction columns, 1-9; no source discrepancy.";
const scaleIII = tableIII.instruction_examples_read.find(item =>
  item.expression_printed_normalized.startsWith("0.015072"));
assert(scaleIII);
scaleIII.expression_printed_normalized =
  "0.01507^2 = (1.507*10^-2)^2 = 2.271*10^-4 = 0.0002271";
scaleIII.route_printed =
  "Independent frozen capture confirms the final 2 is a square exponent, not an argument digit. This four-significant-digit example establishes no over-resolution preprocessing convention.";
const tableIV = rules.tables.find(item => item.id === "IV");
const scaleIV = tableIV.instruction_examples_read.find(item =>
  item.expression_printed_normalized.startsWith("sqrt886.3 "));
scaleIV.expression_printed_normalized =
  "sqrt886.3 = sqrt(886.3*10^2) = sqrt8.863*10 = 2.978*10 = 29.78 [first equality is printed incorrectly]";
scaleIV.route_printed =
  "Frozen independent pixels confirm the first right radical repeats886.3 before*10^2, while the following line uses8.863. Faithful expression retains this printing error; mathematically valid normalization requires8.863 in the first right radical. No affected answer adopts the invalid equality.";
for (const [file, value] of [
  ["transcriptions.corrected.json", current],
  ["source-rules.corrected.json", rules],
]) {
  fs.writeFileSync(`${folder}/${file}`, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
}
fs.writeFileSync(`${base}/bradis-transcription-repair.json`, `${JSON.stringify({
  original: [ref(`${folder}/transcriptions.json`), ref(`${folder}/source-rules.json`)],
  independentReview: ref(`${base}/bradis-cell-review/stage2-verdict.json`),
  independentFreeze: ref(`${base}/bradis-cell-review/independent-freeze.json`),
  corrected: [ref(`${folder}/transcriptions.corrected.json`), ref(`${folder}/source-rules.corrected.json`)],
  changedCellIds: ["799.c2", "r60.37", "r6.52"],
  sourceRuleCorrections: ["nine correction columns", "square exponent, not fifth argument digit"],
  printedScalingErrorRetained: true,
  imagesOpened: 0, allOriginalEvidencePreserved: true,
}, null, 2)}\n`, { flag: "wx" });
