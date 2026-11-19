import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const base = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const own = path.join(base, "n38-choice-review");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const fidelityPath = path.join(own, "stage2-fidelity-leakage.md");
assert.equal(fs.statSync(fidelityPath).mode & 0o777, 0o444);
assert.equal(sha(fs.readFileSync(fidelityPath)), "0d668153b5d00fdac47e68e30fe98dc250739d6da059e63003825a39e1651faf");
const sourcePath = path.join(own, "stage1-independent-solves.md");
assert.equal(fs.statSync(sourcePath).mode & 0o777, 0o444);
assert.equal(sha(fs.readFileSync(sourcePath)), "1642034ff8a92968da4916d691e8d6f5adaa71f26e9637bc1a15074176532452");
const viewBytes = fs.readFileSync(path.join(base, "n38-choice-author/views.json"));
assert.equal(sha(viewBytes), "301520f0972263e8482557407567782391bd37ade7d913e5d84d9ac3eb59b3be");
const views = JSON.parse(viewBytes);
assert.equal(views.length, 13);
assert.equal(views.reduce((count, q) => count + q.view.options.length, 0), 55);
for (const q of views) {
  assert.deepEqual(Object.keys(q).sort(), ["question_id", "view"]);
  assert.deepEqual(q.view.figure_ids, []);
  for (const option of q.view.options) assert.deepEqual(option.figure_ids, []);
}

function decimal(text) {
  const [mantissa, exponent = "0"] = text.split(/e/i);
  const [integer, fraction = ""] = mantissa.split(".");
  let coefficient = BigInt(integer + fraction);
  let places = fraction.length - Number(exponent);
  if (places < 0) {
    coefficient *= 10n ** BigInt(-places);
    places = 0;
  }
  return { coefficient, places };
}
function rational(text) {
  const normalized = text.replace(/\\(?:left|right)/g, "")
    .replace(/\\times\s*10\^\{([^}]+)\}/g, "e$1")
    .replace(/\\times\s*10\^(-?\d+)/g, "e$1").trim();
  const fraction = normalized.match(/^\\frac\{(-?\d+)\}\{(\d+)\}$/);
  if (fraction) return [BigInt(fraction[1]), BigInt(fraction[2])];
  const value = decimal(normalized);
  return [value.coefficient, 10n ** BigInt(value.places)];
}
function equal(a, b) {
  const [an, ad] = rational(a), [bn, bd] = rational(b);
  return an * bd === bn * ad;
}
function square(text) {
  const value = decimal(text);
  const digits = (value.coefficient ** 2n).toString().padStart(2 * value.places + 1, "0");
  return value.places ? `${digits.slice(0, -2 * value.places)}.${digits.slice(-2 * value.places)}` : digits;
}
function rSignificant(text, count) {
  const value = decimal(text), drop = value.coefficient.toString().length - count;
  if (drop <= 0) return text;
  const factor = 10n ** BigInt(drop);
  const rounded = ((value.coefficient + factor / 2n) / factor) * factor;
  const digits = rounded.toString().padStart(value.places + 1, "0");
  return value.places ? `${digits.slice(0, -value.places)}.${digits.slice(-value.places)}` : digits;
}
function cells(line) {
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}
function tuples(text) {
  const normalized = text.replace(/\\(?:left|right)/g, "");
  return [...normalized.matchAll(/\$\((.*?)\)\$/gs)].map((match) => match[1].split(",").map((part) => part.trim()));
}
function vectorEqual(actual, expected) {
  return actual?.length === expected.length && actual.every((value, index) => equal(value, expected[index]));
}
const sourceRows = fs.readFileSync(sourcePath, "utf8").split("\n")
  .filter((line) => /^\| (799|800|801|802|803|804|805)\.[a-z]\d* \|/.test(line))
  .map(cells).filter((row) => row.length === 5);
assert.equal(sourceRows.length, 49);
const sourceSquare = (id) => sourceRows.find((row) => row[0] === id)[2];
const mathematical = fs.readFileSync(path.join(own, "stage2-option-mathematics.md"), "utf8");
const optionRows = mathematical.split("\n").filter((line) => /^\| n38-[a-z-]+ \| [A-E] \| (true|false) \|/.test(line)).map(cells);
assert.equal(optionRows.length, 55);
assert.equal(new Set(optionRows.map((row) => `${row[0]}:${row[1]}`)).size, 55);
const declared = new Map(optionRows.map((row) => [`${row[0]}:${row[1]}`, row[2] === "true"]));
const newQuestions = new Set(["n38-direct-tenths", "n38-direct-hundredths", "n38-direct-scaled-values", "n38-round-before-square"]);
const newCellCounts = new Map();
const main = new Map();
const correction = new Map();
let newMainCount = 0, excerptMainCount = 0, excerptCorrectionCount = 0;
const capturedMain = new Map([
  ["1.2:4", "1.538"], ["4.3:2", "18.66"], ["7.2:3", "52.27"], ["7.2:4", "52.42"],
  ["8.1:2", "65.93"], ["8.1:3", "66.10"], ["6.5:7", "43.16"], ["9.0:4", "81.72"],
  ["5.2:4", "27.46"], ["1.3:1", "1.716"], ["5.8:9", "34.69"], ["2.3:4", "5.476"],
  ["6.7:8", "45.97"], ["6.7:9", "46.10"], ["9.8:7", "97.42"], ["9.8:8", "97.61"],
]);
const capturedCorrection = new Map([
  ["1.2:3", "7"], ["4.3:5", "5"], ["7.2:1", "1"], ["7.2:9", "13"],
  ["8.1:3", "5"], ["8.1:7", "11"], ["6.5:1", "1"], ["9.0:4", "7"],
  ["5.2:3", "3"], ["1.3:5", "13"], ["5.8:2", "2"], ["2.3:1", "5"],
  ["6.7:1", "1"], ["6.7:9", "12"], ["9.8:4", "8"], ["9.8:6", "12"],
]);
for (const q of views) {
  let header = null;
  for (const line of q.view.stem.split("\n")) {
    if (!line.startsWith("|")) continue;
    const row = cells(line);
    if (row.every((cell) => /^[- :]+$/.test(cell))) continue;
    if (row[0] === "$N$") { header = row; continue; }
    if (!header) continue;
    if (/(?:c=|主列)/.test(header[1])) {
      for (let i = 1; i < row.length; i++) {
        if (row[i] === "-") continue;
        const column = header[i].match(/\d+/)[0], address = `${Number(row[0]).toFixed(1)}:${column}`;
        main.set(`${q.question_id}:${address}`, row[i]);
        if (newQuestions.has(q.question_id)) {
          const argument = ((BigInt(row[0].replace(".", "")) * 10n) + BigInt(column)).toString();
          const input = `${argument.slice(0, -2)}.${argument.slice(-2)}`;
          assert.ok(equal(row[i], rSignificant(square(input), 4)), `${q.question_id}:${address}: new cell`);
          assert.equal(decimal(row[i]).coefficient.toString().length, 4, `${q.question_id}:${address}: written precision`);
          newMainCount++;
          newCellCounts.set(q.question_id, (newCellCounts.get(q.question_id) ?? 0) + 1);
        } else {
          assert.equal(row[i], capturedMain.get(address), `${q.question_id}:${address}: frozen captured string`);
          excerptMainCount++;
        }
      }
    } else {
      if (q.question_id === "n38-round-before-square") {
        correction.set(`${q.question_id}:${Number(row[0]).toFixed(1)}:${row[1]}`, row[2]);
      } else {
        for (let i = 1; i < row.length; i++) {
          if (row[i] === "-") continue;
          const column = header[i].match(/\d+/)[0], address = `${Number(row[0]).toFixed(1)}:${column}`;
          assert.equal(row[i], capturedCorrection.get(address), `${q.question_id}:${address}: frozen captured correction`);
          excerptCorrectionCount++;
        }
      }
    }
  }
}
assert.equal(newMainCount, 97);
assert.deepEqual([...newCellCounts.values()], [21, 36, 20, 20]);
assert.equal(excerptMainCount, 16);
assert.equal(excerptCorrectionCount, 16);
assert.equal(correction.size, 4);
for (const [address, integer] of [["3.1:4", "25"], ["1.0:4", "8"], ["4.1:1", "1"], ["6.7:5", "7"]]) {
  assert.equal(correction.get(`n38-round-before-square:${address}`), integer);
}
function linearCorrection(lower, upper, unit, digit) {
  const [ln, ld] = rational(lower), [un, ud] = rational(upper);
  const [unitN, unitD] = rational(unit);
  const numerator = (un * ld - ln * ud) * unitD * BigInt(digit);
  const denominator = ld * ud * unitN * 10n;
  return (2n * numerator + denominator) / (2n * denominator);
}
for (const [address, lower, upper, unit, digit, integer] of [
  ["3.1:4", "9.734", rSignificant(square("3.13"), 4), "0.001", 4, 25n],
  ["1.0:4", "1.000", "1.020", "0.001", 4, 8n],
  ["4.1:1", "17.14", rSignificant(square("4.15"), 4), "0.01", 1, 1n],
  ["6.7:5", "45.83", rSignificant(square("6.78"), 4), "0.01", 5, 7n],
]) {
  assert.equal(linearCorrection(lower, upper, unit, digit), integer, `${address}: independent linear relationship`);
}
assert.ok(equal(square("3.174"), "10.074276"));
assert.ok(equal(rSignificant(square("3.174"), 4), "10.07"));
assert.equal(main.get("n38-round-before-square:3.1:7"), "10.05");
assert.notEqual(10.05 + 25 * 0.01, 10.07);
assert.equal(linearCorrection("10.05", rSignificant(square("3.18"), 4), "0.01", 4), 2n);

const expected = new Map([
  ["n38-direct-tenths", ["1.690", "22.09", "7.840", "32.49", "68.89", "51.84", "92.16"]],
  ["n38-direct-hundredths", ["5.476", "26.21", "70.06", "91.39", "9.242", "38.32"]],
  ["n38-scale-family-five", ["27.49", "2749", "2.749e7", "0.2749"]],
  ["n38-scale-family-one", ["1.729", "0.01729", "1.729e4", "1.729e8"]],
  ["n38-direct-scaled-values", ["0.06452", "0.5127", "8.724e5", "3807"]],
  ["n38-corrected-scaled-values", ["0.3471", "548.1", "0.004609", "9.753e11"]],
  ["n38-square-arithmetic", [sourceSquare("803.a"), sourceSquare("803.b")]],
  ["n38-squared-estimate-report", ["a", "b", "c", "d", "e", "f"].map((letter, index) => rSignificant(sourceSquare(`804.${letter}`), index < 5 ? 3 : 2))],
]);
const groups = [["1.545", "18.71", "52.41"], ["66.05", "43.17", "81.79"]];
const roundBase = ["3.124", "0.1006", "41.41", "67750"], roundSquare = ["9.759", "0.01012", "1715", "4.590e9"];
const complete = new Map();
let trueCount = 0;
for (const q of views) {
  const selected = [];
  for (const option of q.view.options) {
    let truth;
    const tuple = tuples(option.text).at(-1);
    if (q.question_id === "n38-direct-tenths") {
      const factor = option.text.match(/原来的 \$([24])\$ 倍/)[1];
      truth = vectorEqual(tuple, expected.get(q.question_id)) && factor === "4";
    } else if (q.question_id === "n38-direct-hundredths") {
      const halfClaim = option.text.match(/不超过 \$([0-9.]+)\$/)[1];
      truth = vectorEqual(tuple, expected.get(q.question_id)) && equal(halfClaim, "0.0005");
    } else if (q.question_id === "n38-correction-blocks") {
      truth = vectorEqual(tuple, groups[option.text.includes("1.243") ? 0 : 1]);
    } else if (q.question_id === "n38-round-before-square") {
      const tableRows = option.text.split("\n").filter((line) => /^\| \d/.test(line)).map(cells);
      assert.equal(tableRows.length, 4);
      const actualBase = tableRows.map((row) => row[0]);
      const actualSquare = tableRows.map((row) => row[1].replace(/\$/g, ""));
      truth = vectorEqual(actualBase, roundBase) && vectorEqual(actualSquare, roundSquare);
    } else if (q.question_id === "n38-estimate-error-distinction") {
      if (option.id === "A") {
        assert.ok(option.text.includes("811.5\\le x<812.5"));
        truth = true;
      } else if (option.id === "B") {
        assert.ok(equal(square("811.5"), "658532.25"));
        assert.ok(equal(square("812.5"), "660156.25"));
        assert.ok(option.text.includes("658532.25\\le x^2<660156.25"));
        truth = true;
      } else if (option.id === "C") {
        const [n, d] = rational(square("812.4"));
        assert.ok(n - 659000n * d > 500n * d);
        truth = false;
      } else if (option.id === "D") {
        assert.ok(!equal(sourceSquare("804.d"), "659000"));
        truth = false;
      } else {
        assert.ok(equal(square("812.4"), "659993.76"));
        const [n, d] = rational(square("812.4")), [en, ed] = rational("993.76");
        assert.equal((n - 659000n * d) * ed, en * d);
        assert.ok(option.text.includes("993.76>500"));
        truth = true;
      }
    } else if (q.question_id === "n38-system-sum" || q.question_id === "n38-system-difference") {
      const [xn, xd] = rational(tuple[0]), [yn, yd] = rational(tuple[1]);
      const a = q.question_id === "n38-system-sum" ? 3n : 8n;
      const b = q.question_id === "n38-system-sum" ? -1n : -5n;
      const c = q.question_id === "n38-system-sum" ? 24n : 120n;
      const d = q.question_id === "n38-system-sum" ? 6n : 16n;
      const e = q.question_id === "n38-system-sum" ? 1n : -5n;
      const f = q.question_id === "n38-system-sum" ? 75n : 320n;
      truth = a * xn * yd + b * yn * xd === c * xd * yd
        && d * xn * yd + e * yn * xd === f * xd * yd;
    } else truth = vectorEqual(tuple, expected.get(q.question_id));
    assert.equal(truth, declared.get(`${q.question_id}:${option.id}`), `${q.question_id}:${option.id}: independently checked truth`);
    if (truth) { selected.push(option.id); trueCount++; }
  }
  if (q.view.mode === "single") assert.equal(selected.length, 1);
  complete.set(q.question_id, selected);
}
assert.equal(trueCount, 16);
const setRows = mathematical.split("\n").filter((line) => /^\| n38-[a-z-]+ \| (single|multiple) \|/.test(line)).map(cells);
assert.equal(setRows.length, 13);
for (const row of setRows) assert.deepEqual(complete.get(row[0]), row[2].split(","), `${row[0]}: complete set`);
const reportView = views.find((q) => q.question_id === "n38-squared-estimate-report").view;
const errorView = views.find((q) => q.question_id === "n38-estimate-error-distinction").view;
assert.ok(reportView.stem.includes("812"));
assert.ok(errorView.stem.includes("6.59\\times10^5"));
assert.ok(equal(rSignificant(sourceSquare("804.c"), 3), "2280"));
assert.ok(equal(rSignificant(rSignificant(sourceSquare("804.c"), 4), 3), "2290"));
console.log("PASS: frozen FIRST fidelity hash/mode; unchanged Stage1 solves; exact view-only snapshot; 13 questions/55 options/0 figures.");
console.log("PASS: all97 new main cells; 16 captured main occurrences and16 captured corrections; 4 new intended-address corrections.");
console.log("PASS: all55 option judgments and13 complete true sets; 16true/39false; source Stage1 reused, not re-solved.");
console.log("CONFIRMED REVISE: F-L1 cross-question812 report leak; M-C1 supplemental row3.1 correction25 range/unit counterexample.");
for (const [id, selected] of complete) console.log(`${id}: ${selected.join(",")}`);
