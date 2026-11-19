const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const source = `${base}/bradis-tables-source-review/transcriptions.json`;
const data = JSON.parse(fs.readFileSync(source, "utf8"));
const sets = [
  ["III", "n38_hold_lookups"], ["III", "n38_worked_example_cells"],
  ["IV", "n39_main_and_correction_cells"], ["IV", "n39_context_cells"],
  ["IV", "n39_worked_example_cells"], ["III", "n39_816_square_cells"],
];
const requests = sets.flatMap(([table, key]) => data[key].map((entry, index) => ({
  table, key, index, id: entry.id ?? entry.argument,
  pdf_image: entry.pdf_image,
  row_printed: entry.row_printed,
  main_column: entry.main.column,
  correction_columns: Object.keys(entry.corrections ?? {}),
  next_main_column: entry.next_main?.column ?? null,
})));
fs.writeFileSync(`${base}/table-cell-review-requests.json`, JSON.stringify({
  requests, sourcePdfSha256: data.source_pdf_sha256,
  authorTranscriptionSha256: crypto.createHash("sha256").update(fs.readFileSync(source)).digest("hex"),
  valuesWithheld: true,
}, null, 2) + "\n", { flag: "wx" });
