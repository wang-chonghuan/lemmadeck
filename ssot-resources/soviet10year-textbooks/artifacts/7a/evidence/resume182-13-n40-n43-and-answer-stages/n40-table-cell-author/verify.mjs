import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const json = (name) => JSON.parse(readFileSync(resolve(root, name), "utf8"));
const hash = (name) =>
  createHash("sha256").update(readFileSync(resolve(root, name))).digest("hex");
const captures = json("captures.json");
const frozen = json("freeze-manifest.json");
const derived = json("derived.json");
const inputs = json("hashes.json");
const ledger = json("image-ledger.json");

for (const file of frozen.files) {
  assert.equal(hash(file.path), file.sha256, `Frozen hash: ${file.path}`);
  assert.equal(statSync(resolve(root, file.path)).mode & 0o222, 0);
}
for (const file of inputs.files) {
  assert.equal(hash(file.path), file.sha256, `Input hash: ${file.path}`);
}
assert.equal(hash("captures.json"), derived.basis.captures_sha256);
assert.equal(hash("freeze-manifest.json"), derived.basis.freeze_manifest_sha256);
assert.equal(captures.coverage.derived_values_present, false);
assert.equal(captures.captures.length, 8);
assert.equal(captures.captures.filter((x) => x.correction_cell_raw !== null).length, 3);
assert.equal(derived.outputs.length, 8);
assert.deepEqual(
  captures.captures.map((x) => x.requested_target),
  ["33.33", "12", "80", "4.5", "28", "1.2", "3.981", "2.624"],
);

const decimalUnits = (text, places = 6) => {
  const normalized = text.replace(",", ".");
  assert.match(normalized, /^\d+(?:\.\d*)?$/);
  const [whole, fraction = ""] = normalized.split(".");
  assert.ok(fraction.length <= places);
  return BigInt(whole) * 10n ** BigInt(places) +
    BigInt(fraction.padEnd(places, "0"));
};
const thousandths = (text) => decimalUnits(text, 3);

for (const output of derived.outputs) {
  const capture = captures.captures.find((x) => x.id === output.capture_id);
  assert.ok(capture, `Capture ID: ${output.capture_id}`);
  assert.equal(output.requested_argument, capture.requested_target);
  const units = captures.source_rule_units_not_printed_header_text.find(
    (x) => x.id === capture.unit_regime,
  );
  assert.ok(units);
  const row = decimalUnits(capture.row_label_raw);
  const mainArgument = row +
    BigInt(capture.main_column_raw) * decimalUnits(units.main_argument_digit_unit);
  const argumentExcess = capture.correction_column_raw === null
    ? 0n
    : BigInt(capture.correction_column_raw) *
      decimalUnits(units.correction_argument_digit_unit);
  assert.equal(decimalUnits(capture.requested_target), mainArgument + argumentExcess);
  assert.equal(decimalUnits(output.lower_main_argument), mainArgument);
  assert.equal(decimalUnits(output.argument_remainder), argumentExcess);
  assert.equal(output.correction_argument_digit, capture.correction_column_raw);
  assert.equal(output.main_argument_step, units.main_argument_step);
  assert.equal(output.correction_argument_digit_unit, units.correction_argument_digit_unit);
  assert.equal(output.above_half_main_step, argumentExcess * 2n > decimalUnits(output.main_argument_step));

  const main = thousandths(capture.main_cell_raw);
  const correction = BigInt(capture.correction_cell_raw ?? "0");
  const total = main + correction;
  assert.equal(output.main_root_thousandths, main.toString());
  assert.equal(output.correction_root_thousandths, correction.toString());
  assert.equal(thousandths(output.derived_table_output), total);

  const scale = output.root_scale_power_of_ten;
  assert.ok([-1, 0, 1].includes(scale));
  assert.equal(output.radicand_scale_power_of_ten, scale * 2);
  const beforeScale = decimalUnits(output.derived_table_output);
  const afterScale = scale < 0
    ? beforeScale / 10n
    : beforeScale * 10n ** BigInt(scale);
  assert.equal(decimalUnits(output.derived_scaled_output), afterScale);
  const radicand = decimalUnits(output.requested_argument);
  const scaledRadicand = scale < 0
    ? radicand / 100n
    : radicand * 10n ** BigInt(scale * 2);
  assert.equal(decimalUnits(output.scaled_radicand), scaledRadicand);
  if (capture.target_kind.startsWith("parent_selected_4sig")) {
    assert.equal(output.argument_kind, capture.target_kind);
    assert.equal(output.guard_selection_approved, false);
  }
}

assert.equal(ledger.totals.image_opens, 3);
assert.deepEqual(ledger.events.map((x) => x.actual_printed_footer_observed), ["35", "37", "39"]);
for (const name of ["reopens", "crops", "new_renders", "ocr", "network_calls", "db_calls"]) {
  assert.equal(ledger.totals[name], 0);
}
assert.deepEqual(captures.coverage.remaining_required_cells, []);
assert.deepEqual(derived.summary.remaining_required_cells, []);
for (const name of ["historical_equivalence_claim", "answer_approval", "holds_lifted", "gate_approval"]) {
  assert.equal(derived.summary[name], false);
}
console.log("PASS: frozen raw hashes and read-only modes; all input hashes; 8 main + 3 correction cells; exact lower-add and scale arithmetic; 3 once-only image ledger; no remaining required cells.");
console.log("This is structural/arithmetic verification, not independent pixel review or approval.");
