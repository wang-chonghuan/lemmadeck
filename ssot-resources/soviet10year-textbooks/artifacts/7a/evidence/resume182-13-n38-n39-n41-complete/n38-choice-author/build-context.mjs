import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const out = path.join(repo, base, "n38-choice-author");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const read = relative => JSON.parse(fs.readFileSync(path.join(repo, relative), "utf8"));
const evidence = relative => ({
  path: relative,
  sha256: hash(fs.readFileSync(path.join(repo, relative))),
});
const allowedIds = new Set([
  "799.c1", "799.c2", "799.c3", "799.c4", "799.c5", "799.c6",
  "800.a1-a4", "800.b1-b4", "801.e", "801.f", "801.g", "801.h",
]);
const captured = [];
const captureFiles = [];
for (let page = 33; page <= 40; page++) {
  const relative = `${base}/bradis-cell-review/capture-${page}.json`;
  const data = read(relative);
  if (data.table !== "III") continue;
  captureFiles.push(evidence(relative));
  for (const record of data.records_in_request_address_order) {
    if (!allowedIds.has(record.id)) continue;
    captured.push({
      source_record: record.id,
      capture_path: relative,
      pdf_image: data.pdf_image,
      printed_page: data.printed_page,
      row_printed: record.row,
      main: record.main,
      corrections: record.corrections,
      next_main: record.next_main,
    });
  }
}
if (captured.length !== 12) throw new Error("Incomplete allowed III primary capture projection");
const correctedPath = `${base}/bradis-tables-source-review/source-rules.corrected.json`;
const methodPath = `${base}/bradis-method-rules/source-rules.json`;
const corrected = read(correctedPath);
const methods = read(methodPath);
const selectedIII = new Set([
  "III-main", "III-correction-unit", "III-low-fourth-digit",
  "III-high-fourth-digit", "III-scale", "III-over-resolution",
]);
const selectedGeneral = new Set(["G3-G7-earlier-page-context", "G-warning-last-digit"]);

// All authored main entries come from integer squaring, not captured solutions.
function fourSignificantSquare(hundredths) {
  const numerator = BigInt(hundredths) ** 2n;
  const digits = numerator.toString().length;
  const dropped = Math.max(0, digits - 4);
  const divisor = 10n ** BigInt(dropped);
  const rounded = ((numerator + divisor / 2n) / divisor) * divisor;
  const places = Math.max(0, 4 - dropped);
  const scaled = rounded / 10n ** BigInt(4 - places);
  const raw = scaled.toString().padStart(places + 1, "0");
  return places ? `${raw.slice(0, -places)}.${raw.slice(-places)}` : raw;
}
const rowTenths = [
  10, 13, 23, 25, 28, 30, 31, 41, 47, 51, 57, 61, 67, 71, 72, 83, 93, 95, 96,
];
const authoredMainRows = rowTenths.map(row => ({
  N: (row / 10).toFixed(1),
  main: Array.from({length: 10}, (_, column) => ({
    column: String(column),
    value: fourSignificantSquare(row * 10 + column),
    exact_square_numerator: String(BigInt(row * 10 + column) ** 2n),
    exact_square_denominator: "10000",
  })),
}));
const authoredCorrections = [
  {N: "3.1", main_column: "2", main_value: "9.734", fourth_digit: "4", correction_column: "4", integer: "25", unit: "0.001", anchor: "3.12", operation: "add", derivation: "2 * 3.1 * 0.004 / 0.001 = 24.8; half-up integer rounding gives 25."},
  {N: "1.0", main_column: "0", next_column: "1", next_value: "1.020", fourth_digit: "6", correction_column: "4", integer: "8", unit: "0.001", anchor: "1.01", operation: "subtract", derivation: "2 * 1.0 * 0.004 / 0.001 = 8; subtract from the next main entry."},
  {N: "4.1", main_column: "4", main_value: "17.14", fourth_digit: "1", correction_column: "1", integer: "1", unit: "0.01", anchor: "4.14", operation: "add", derivation: "2 * 4.1 * 0.001 / 0.01 = 0.82; half-up integer rounding gives 1."},
  {N: "6.7", main_column: "7", main_value: "45.83", fourth_digit: "5", correction_column: "5", integer: "7", unit: "0.01", anchor: "6.77", operation: "add", derivation: "2 * 6.7 * 0.005 / 0.01 = 6.7; half-up integer rounding gives 7."},
];
const value = {
  schema: "n38-authored-supplementary-context-v1",
  status: "NEW_VIEW_CONTEXT_NOT_ORIGINAL_SOURCE",
  boundary: "This file is separate from source.json. It neither changes written exercise prose nor adds concepts or figures to the seed. It is not an answer-key package.",
  primary_evidence: [...captureFiles, evidence(correctedPath), evidence(methodPath)],
  source_identity: {
    author: corrected.source.author,
    title: corrected.source.title,
    edition: corrected.source.edition,
    publisher_place_year: corrected.source.publisher_place_year,
    pdf_sha256: corrected.source.pdf_sha256,
    historical_equivalence: corrected.source.historical_equivalence,
  },
  printed_III_cells: captured,
  selected_III_method_definitions: corrected.tables.find(t => t.id === "III").rules
    .filter(rule => selectedIII.has(rule.id)),
  selected_general_method_definitions: methods.rules.filter(rule => selectedGeneral.has(rule.id))
    .map(rule => ({id: rule.id, locator: rule.locator, paraphrase: rule.paraphrase ?? null,
      direct_translation: rule.direct_translation ?? null,
      provenance_tier: rule.id === "G3-G7-earlier-page-context" ?
        "Secondary source-only method paraphrase; no original page read in this job." :
        "Source-only direct translation; no solution example selected."})),
  authored_main_table: {
    provenance: "NEW mathematical reference grid. No claim of transcribing uncaptured Bradis cells. At row N and column c, square N + 0.01c exactly, then round once to four significant digits, half upward. The integer numerator and denominator bind each value to exact arithmetic.",
    rounding: "Positive half-up; powers of ten and trailing zeros are retained in displayed entries.",
    row_3_1_boundary: "Cells 0-6 use thousandth units; cells 7-9 use hundredth units. The rows are a new reference grid, not an image of either printed physical line.",
    rows: authoredMainRows,
  },
  authored_correction_table: {
    provenance: "NEW supplementary linear-correction integers for the four uncovered rounded-input lookups in 802. Derive from 2N times the argument displacement, expressed in the main result's final-place units and rounded half-up to an integer. These are not captured original correction cells.",
    entries: authoredCorrections,
    cross_check: "The resulting four normalized approximations agree with rounding the exact squares of 3.124, 1.006, 4.141 and 6.775 to four significant digits. This check is mathematical corroboration, not printed-cell provenance.",
  },
  visible_context_conditions: [
    "Native Markdown tables are supplementary view data, not original figures.",
    "Comma decimal separators in captured strings are changed to dots only for new views; source strings here remain unchanged.",
    "For correction-table questions use the displayed III route, including next-entry subtraction when the fourth digit exceeds 5. Do not substitute rounding the exact square.",
    "For 802 first round the original base half-up to four significant digits, then use the supplied reference/correction grid.",
    "803 requests exact arithmetic; do not round intermediate squares.",
    "804 uses one final positive half-up rounding of the exact square of the supplied estimate to the same significant-figure count. This explicit new view convention is not a universal printed Bradis rule.",
    "The 804 significant-figure convention is an estimate-reporting rule, not a worst-case error theorem.",
  ],
};
fs.writeFileSync(path.join(out, "supplementary-context.json"), `${JSON.stringify(value, null, 2)}\n`, {flag: "wx"});
console.log(`context: ${captured.length} printed-cell records, ${authoredMainRows.length} authored main rows, ${authoredCorrections.length} authored correction entries`);
