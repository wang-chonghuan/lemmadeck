import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const base = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const own = path.join(base, "n38-choice-review");
const seedBytes = fs.readFileSync(path.join(base, "n38-choice-author/source.json"));
const seed = JSON.parse(seedBytes);
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
assert.equal(sha(seedBytes), "77bf17157ed5f78d99c9fe777a8ee7780bf133aaa08bbdffbfeea351e282df37");
assert.equal(sha(Buffer.from(canonical(seed))), "7408cddfd1708375927eedd577eed061db345b7befc28caead8e875c72826875");
assert.deepEqual(seed.exercises.map((item) => item.number), ["799", "800", "801", "802", "803", "804", "805"]);
assert.deepEqual(seed.concepts.map((item) => item.block), [1, 2, 3, 5, 10, 11, 15]);
assert.deepEqual(seed.figures, []);

const groups = {
  "799.a": ["1.3", "4.7", "2.8", "5.7", "8.3", "7.2", "9.6"],
  "799.b": ["2.34", "5.12", "8.37", "9.56", "3.04", "6.19"],
  "799.c": ["1.243", "4.325", "7.239", "8.127", "6.571", "9.044"],
  "800.a": ["5.243", "52.43", "5243", "0.5243"],
  "800.b": ["1.315", "0.1315", "131.5", "13150"],
  "801": ["0.254", "0.716", "934", "61.7", "0.5892", "23.41", "0.06789", "987600"],
  "802": ["3.1238", "0.10058", "41.405", "67752"],
  "804": ["3.26", "0.516", "47.8", "812", "4.82e5", "1.6e-4"],
};

// Finite-decimal arithmetic and rounding use integers, including exact halves.
function decimal(text) {
  const [mantissa, expText = "0"] = text.replace(",", ".").split(/e/i);
  const parts = mantissa.split(".");
  let coefficient = BigInt(parts.join(""));
  let places = (parts[1]?.length ?? 0) - Number(expText);
  if (places < 0) {
    coefficient *= 10n ** BigInt(-places);
    places = 0;
  }
  return { coefficient, places };
}
function rational(text) {
  const { coefficient, places } = decimal(text);
  return [coefficient, 10n ** BigInt(places)];
}
function equal(a, b) {
  const [an, ad] = rational(a);
  const [bn, bd] = rational(b);
  return an * bd === bn * ad;
}
function square(text) {
  const { coefficient, places } = decimal(text);
  const digits = (coefficient * coefficient).toString().padStart(2 * places + 1, "0");
  return places ? `${digits.slice(0, -2 * places)}.${digits.slice(-2 * places)}` : digits;
}
function roundSignificant(text, count) {
  const { coefficient, places } = decimal(text);
  const drop = coefficient.toString().length - count;
  if (drop <= 0) return text;
  const factor = 10n ** BigInt(drop);
  const rounded = ((coefficient + factor / 2n) / factor) * factor;
  const digits = rounded.toString().padStart(places + 1, "0");
  return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
}
function add(a, b, sign = 1n) {
  const av = decimal(a), bv = decimal(b), places = Math.max(av.places, bv.places);
  const sum = av.coefficient * 10n ** BigInt(places - av.places)
    + sign * bv.coefficient * 10n ** BigInt(places - bv.places);
  const digits = sum.toString().padStart(places + 1, "0");
  return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
}

const report = fs.readFileSync(path.join(own, "stage1-independent-solves.md"), "utf8");
const rows = report.split("\n").filter((line) => /^\| (799|800|801|802|803|804|805)\.[a-z]\d* \|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
const mainRows = rows.filter((row) => row.length === 5);
assert.equal(mainRows.length, 49);
assert.equal(new Set(mainRows.map((row) => row[0])).size, 49);
for (const [number, count] of Object.entries({799: 19, 800: 8, 801: 8, 802: 4, 803: 2, 804: 6, 805: 2})) {
  assert.equal(mainRows.filter((row) => row[0].startsWith(`${number}.`)).length, count);
}
for (const [group, inputs] of Object.entries(groups)) {
  const number = group.split(".")[0];
  const prose = seed.exercises.find((item) => item.number === number).text;
  for (const [index, input] of inputs.entries()) {
    const id = group.startsWith("799") || group.startsWith("800")
      ? `${group}${index + 1}` : `${group}.${String.fromCharCode(97 + index)}`;
    const row = mainRows.find((item) => item[0] === id);
    assert.ok(row, id);
    if (number === "804" && index >= 4) {
      assert.ok(prose.includes(index === 4 ? "4.82" : "1.6"));
    } else assert.ok(prose.includes(input), `${id}: seed input`);
    const operand = number === "802" ? roundSignificant(input, 4) : input;
    assert.ok(equal(square(operand), row[2]), `${id}: exact square`);
    assert.ok(equal(roundSignificant(square(operand), 4), row[3]), `${id}: direct R4`);
    if (number === "802") assert.ok(equal(row[1].split(" -> ")[1], operand), `${id}: preprocessing`);
  }
}
const lookup = (id) => mainRows.find((item) => item[0] === id);
assert.ok(equal(add(square("17.3"), square("1.64")), lookup("803.a")[2]));
assert.ok(equal(add(square("8.14"), square("3.265"), -1n), lookup("803.b")[2]));
for (const id of ["803.a", "803.b"]) {
  assert.ok(equal(roundSignificant(lookup(id)[2], 4), lookup(id)[3]), `${id}: direct R4`);
}
assert.equal(lookup("805.a")[2], "x=11,y=9");
assert.equal(lookup("805.b")[2], "x=25,y=16");
assert.equal(3 * 11 - 9, 24);
assert.equal(6 * 11 + 9, 75);
assert.equal(8 * 25 - 5 * 16, 120);
assert.equal(16 * 25 - 5 * 16, 320);
assert.equal((11 + 9) / 4 - 9 / 3, 2);
assert.equal((11 + 9) / 5 + 11, 15);
assert.equal((25 - 16) / 3 + 25 / 5, 8);
assert.equal(25 / 10 - 16 / 32, 2);

const captures = new Map(Array.from({ length: 8 }, (_, index) => {
  const page = 33 + index;
  return [page, JSON.parse(fs.readFileSync(path.join(base, `bradis-cell-review/capture-${page}.json`)))];
}));
const operations = rows.filter((row) => row.length === 11);
assert.equal(operations.length, 18);
assert.equal(new Set(operations.map((row) => row[0])).size, 18);
assert.equal(new Set(operations.map((row) => row[2])).size, 12);
assert.equal(operations.filter((row) => row[7] === "SUBTRACT").length, 4);
assert.equal(operations.filter((row) => row[7] === "ADD").length, 14);
const differences = [];
for (const op of operations) {
  const [id, locator, coefficient, selectedCoefficient, main, unit, digit, sign, integer, scale, result] = op;
  const [page, index] = locator.split(":").map(Number);
  const capture = captures.get(page);
  assert.equal(capture.table, "III");
  const cell = capture.records_in_request_address_order[index];
  const fourthDigit = Number(coefficient.slice(-1));
  const high = fourthDigit > 5;
  assert.equal(sign, high ? "SUBTRACT" : "ADD", `${id}: route`);
  assert.equal(Number(digit), high ? 10 - fourthDigit : fourthDigit, `${id}: correction digit`);
  const selected = high ? cell.next_main : cell.main;
  assert.ok(selected, `${id}: selected actual main`);
  assert.ok(equal(main, selected.printed), `${id}: main printed bytes`);
  const step = `${cell.row.replace(",", ".").slice(0, 1)}.${cell.row.replace(",", ".").slice(-1)}${selected.column}`;
  assert.ok(equal(selectedCoefficient, step), `${id}: main address`);
  const correction = cell.corrections.find((item) => item.column === digit);
  assert.ok(correction, `${id}: actual correction address`);
  assert.equal(integer, correction.printed, `${id}: correction integer`);
  const places = main.split(".")[1].length;
  assert.ok(equal(unit, `1e-${places}`), `${id}: actual last-place unit`);
  const mv = decimal(main), uv = decimal(unit);
  const signedCorrection = BigInt(integer) * uv.coefficient * (high ? -1n : 1n);
  assert.equal(mv.places, uv.places);
  const intermediate = mv.coefficient + signedCorrection;
  const [rn, rd] = rational(result);
  const power = Number(scale) - mv.places;
  if (power >= 0) assert.equal(intermediate * 10n ** BigInt(power) * rd, rn);
  else assert.equal(intermediate * rd, rn * 10n ** BigInt(-power));
  assert.equal(Math.abs(Number(scale) % 2), 0, `${id}: squared scale`);
  const original = decimal(lookup(id)[1]), normalized = decimal(coefficient);
  const k = Number(scale) / 2;
  const [on, od] = rational(lookup(id)[1]), [cn, cd] = rational(coefficient);
  if (k >= 0) assert.equal(on * cd, cn * 10n ** BigInt(k) * od, `${id}: normalize`);
  else assert.equal(on * cd * 10n ** BigInt(-k), cn * od, `${id}: normalize`);
  assert.ok(original.coefficient > 0n && normalized.coefficient > 0n);
  assert.ok(lookup(id)[4].endsWith(result) || lookup(id)[4].includes(`=${result}`), `${id}: report agrees`);
  if (!equal(result, lookup(id)[3])) differences.push(id);
}
assert.deepEqual(differences, ["799.c3", "799.c5", "801.e", "801.f", "801.h"]);
const allIII = [...captures.values()].filter((capture) => capture.table === "III");
const mainAddresses = new Set();
const correctionAddresses = new Set();
for (const capture of allIII) {
  for (const record of capture.records_in_request_address_order) {
    const row = record.row.replace(",", ".");
    mainAddresses.add(`${row}:${record.main.column}`);
    if (record.next_main) mainAddresses.add(`${row}:${record.next_main.column}`);
    for (const correction of record.corrections) correctionAddresses.add(`${row}:${correction.column}`);
  }
}
const provenance = fs.readFileSync(path.join(own, "stage1-provenance-missing.md"), "utf8");
const missingMain = provenance.split("\n").filter((line) => /^\| \d\.\d(?: upper)? \| \d \|/.test(line))
  .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
assert.equal(missingMain.length, 28);
const requiredAbsent = new Set();
for (const row of missingMain) {
  const address = `${row[0].replace(" upper", "")}:${row[1]}`;
  assert.ok(!mainAddresses.has(address), `${address}: absent printed main`);
  assert.ok(!requiredAbsent.has(address), `${address}: unique missing main`);
  requiredAbsent.add(address);
  assert.ok(equal(roundSignificant(square(row[2]), 4), row[3]), `${address}: derived main reference`);
}
const sourceRequiredMain = new Set();
const sourceRequiredCorrections = [];
function requireSquare(input) {
  const value = decimal(input);
  const digits = value.coefficient.toString().replace(/0+$/, "").padEnd(4, "0");
  assert.ok(value.coefficient > 0n);
  const fourth = Number(digits[3]);
  const lowArgument = Number(digits.slice(0, 3));
  const selectedArgument = fourth > 5 ? lowArgument + 1 : lowArgument;
  const selected = selectedArgument.toString();
  sourceRequiredMain.add(`${selected[0]}.${selected[1]}:${selected[2]}`);
  if (fourth) sourceRequiredCorrections.push(`${digits[0]}.${digits[1]}:${fourth > 5 ? 10 - fourth : fourth}`);
}
for (const [group, inputs] of Object.entries(groups)) {
  for (const input of inputs) requireSquare(group === "802" ? roundSignificant(input, 4) : input);
}
for (const input of ["17.3", "1.64", "8.14", "3.265"]) requireSquare(input);
const derivedMissingMain = [...sourceRequiredMain].filter((address) => !mainAddresses.has(address)).sort();
assert.deepEqual(derivedMissingMain, [...requiredAbsent].sort(), "missing main list exactly equals source-derived addresses");
assert.equal(sourceRequiredCorrections.length, 23);
assert.equal(sourceRequiredCorrections.filter((address) => correctionAddresses.has(address)).length, 18);
assert.deepEqual(sourceRequiredCorrections.filter((address) => !correctionAddresses.has(address)).sort(),
  ["3.1:4", "1.0:4", "4.1:1", "6.7:5", "3.2:5"].sort());
for (const address of ["3.1:4", "1.0:4", "4.1:1", "6.7:5", "3.2:5"]) {
  assert.ok(!correctionAddresses.has(address), `${address}: actual correction absent`);
}
const additional = ["802.a", "802.b", "802.c", "802.d", "803.b"];
for (const id of additional) assert.ok(lookup(id)[4].startsWith("U:"), `${id}: not falsely authenticated`);
assert.ok(lookup("802.b")[4].includes("NEXT"));
assert.ok(lookup("802.a")[4].includes("0.001"));
assert.ok(lookup("803.b")[4].includes("+0.01"));
assert.ok(equal(roundSignificant(square("47.8"), 3), "2280"));
assert.ok(equal(roundSignificant(roundSignificant(square("47.8"), 4), 3), "2290"));
assert.ok(equal(roundSignificant("41.405", 4), "41.41"));
assert.ok(equal(roundSignificant(square("1.6e-4"), 2), "2.6e-8"));
assert.ok(equal(captures.get(34).records_in_request_address_order[1].main.printed, "65.93"));
console.log("PASS: unchanged source byte/canonical hashes; 49 unique original tasks; 47 exact numerical references; 2 systems.");
console.log("PASS: all18 captured corrections independently recomputed; 14ADD/4NEXT-SUBTRACT; 12 normalized coefficients; 5 direct-R4 differences.");
console.log("PASS: 28 absent main addresses; 5 additional unavailable actual corrections; explicit802 rounding; 804c double-rounding distinction.");
console.log("Stage1 ONLY. No images/views/keys/network/database/dependencies/writes in this verification.");
