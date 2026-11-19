import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const base = path.join(root, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13");
const own = path.join(base, "n38-choice-review");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const preserved = [
  ["stage1-independent-solves.md", "1642034ff8a92968da4916d691e8d6f5adaa71f26e9637bc1a15074176532452"],
  ["stage1-provenance-missing.md", "c4432e5e2897e50ef643387063dd07b34733cd08f5ef3c762fdcd06a4da9caa8"],
  ["stage1-hashes.json", "5820c3c7252bfba53d37cf66546222ef6a9f2cd052ea13db1c6775f4fe85aa0c"],
  ["stage2-fidelity-leakage.md", "0d668153b5d00fdac47e68e30fe98dc250739d6da059e63003825a39e1651faf"],
  ["stage2-option-mathematics.md", "8d4fc13b9a2ad1a250227966dbb6278ab95ebe61b5f490c9529bea9dfae9ff99"],
  ["stage2-verification.mjs", "99e38f2525067d4f3851178dc11d42c1306e057325f8fdccedf74a1f88c40f46"],
  ["stage2-hashes.json", "697e291e05f8e3ba66e082ff7744b77ecdbeca1b932f2e8ba4af15b5fe8e0ef7"],
  ["stage2-affected-fidelity.md", "5d83bdefbc52ed27e48a637d846feabc3d95adae22b5f07a3190de824648e4aa"],
];
for (const [name, digest] of preserved) {
  const file = path.join(own, name);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444, name);
  assert.equal(sha(fs.readFileSync(file)), digest, name);
}
const bytes = fs.readFileSync(path.join(base, "n38-choice-affected-author/views.json"));
assert.equal(sha(bytes), "c714bf73152f28cdfaf3db95cfd09008831da026c5d6c51a8901bfbc088c9da5");
const views = JSON.parse(bytes), restored = structuredClone(views);
const affected = (items, id) => items.find((q) => q.question_id === id).view;
const rounding = affected(views, "n38-round-before-square");
const error = affected(views, "n38-estimate-error-distinction");

// Inverse only the two repair sections; unchanged options are not re-solved.
const restriction = rounding.stem.match(/\u5176\u4e2d \$3\.1\$[\s\S]*?\u6b64\u5904\u672a\u63d0\u4f9b\u76f8\u5e94\u4fee\u6b63\u3002/)[0];
assert.ok(restriction.includes("$0,1,2,4$"));
assert.ok(restriction.includes("$0.001$"));
assert.ok(restriction.includes("\u5c0f\u4e8e $10$"));
assert.ok(restriction.includes("\u4e0d\u9002\u7528\u4e8e\u4e3b\u5217 $7$"));
assert.ok(restriction.includes("$10.05$"));
affected(restored, "n38-round-before-square").stem = rounding.stem.replace(restriction, "");
const priorError = affected(restored, "n38-estimate-error-distinction");
priorError.stem = error.stem
  .replace(/^.*?(\u6b63\u6570 \$x\$)/, "\u5bf9\u8fd1\u4f3c\u503c $812$ \u518d\u660e\u786e\u4e00\u4e2a\u8bef\u5dee\u6a21\u578b\uff1a$1")
  .replace("\u767e\u5206\u4f4d", "\u4e2a\u4f4d")
  .replaceAll("$6.42$", "$812$")
  .replace("$41.2$", "$6.59\\times10^5$");
const replacements = [
  [["6.415", "811.5"], ["6.425", "812.5"]],
  [["41.152225", "658532.25"], ["41.280625", "660156.25"]],
  [["41.2", "659000"], ["0.05", "500"]],
  [["41.2", "659000"]],
  [["6.424", "812.4"], ["41.2", "659000"], ["0.067776", "993.76"], ["0.05", "500"]],
];
priorError.options.forEach((option, index) => {
  for (const [newToken, oldToken] of replacements[index]) option.text = option.text.replace(newToken, oldToken);
});
assert.equal(sha(Buffer.from(JSON.stringify(restored, null, 2) + "\n")),
  "301520f0972263e8482557407567782391bd37ade7d913e5d84d9ac3eb59b3be");
assert.equal(views.length - 2, 11);
assert.deepEqual(rounding.figure_ids, []);
assert.deepEqual(error.figure_ids, []);
assert.equal(error.options.length, 5);

function decimal(text) {
  const [integer, fraction = ""] = text.split(".");
  return { n: BigInt(integer + fraction), places: fraction.length };
}
function rational(text) {
  const value = decimal(text);
  return [value.n, 10n ** BigInt(value.places)];
}
function equal(a, b) {
  const [an, ad] = rational(a), [bn, bd] = rational(b);
  return an * bd === bn * ad;
}
function square(text) {
  const value = decimal(text), places = 2 * value.places;
  const digits = (value.n ** 2n).toString().padStart(places + 1, "0");
  return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
}
function rSignificant(text, count) {
  const value = decimal(text), drop = value.n.toString().length - count;
  if (drop <= 0) return text;
  const factor = 10n ** BigInt(drop);
  const digits = (((value.n + factor / 2n) / factor) * factor).toString().padStart(value.places + 1, "0");
  return value.places ? `${digits.slice(0, -value.places)}.${digits.slice(-value.places)}` : digits;
}
function nearestHundredth(text) {
  const value = decimal(text);
  assert.ok(value.places >= 2);
  const divisor = 10n ** BigInt(value.places - 2);
  const units = value.places === 2 ? value.n : (value.n + divisor / 2n) / divisor;
  const digits = units.toString().padStart(3, "0");
  return `${digits.slice(0, -2)}.${digits.slice(-2)}`;
}
function corrected(main) {
  const value = decimal(main);
  assert.equal(value.places, 3);
  const digits = (value.n + 25n).toString();
  return `${digits.slice(0, -3)}.${digits.slice(-3)}`;
}
const mainRow = rounding.stem.split("\n").find((line) => line.startsWith("| 3.1 |"))
  .split("|").slice(1, -1).map((cell) => cell.trim());
const frozenSource = fs.readFileSync(path.join(own, "stage1-independent-solves.md"), "utf8");
const source802a = frozenSource.split("\n").find((line) => line.startsWith("| 802.a |"))
  .split("|").slice(1, -1).map((cell) => cell.trim())[2];
const scope = [
  [0, "3.104", square("3.104")],
  [1, "3.114", square("3.114")],
  [2, "3.124", source802a],
  [4, "3.144", square("3.144")],
];
const shownColumns = [0, 1, 2, 4, 7];
for (const [column, argument, exact] of scope) {
  const main = mainRow[shownColumns.indexOf(column) + 1];
  assert.ok(Number(main) < 10, `${argument}: permitted unit range`);
  assert.ok(equal(corrected(main), rSignificant(exact, 4)), `${argument}: restricted correction25 relationship`);
}
assert.equal(mainRow[5], "10.05");
assert.ok(rounding.stem.includes("\u6b64\u5904\u672a\u63d0\u4f9b\u76f8\u5e94\u4fee\u6b63"));
assert.ok(equal(square("6.42"), "41.2164"));
assert.ok(equal(rSignificant(square("6.42"), 3), "41.2"));
assert.ok(equal(nearestHundredth("6.415"), "6.42"));
assert.ok(equal(nearestHundredth("6.425"), "6.43"));
assert.ok(equal(square("6.415"), "41.152225"));
assert.ok(equal(square("6.425"), "41.280625"));
const truths = [];
for (const option of error.options) {
  assert.deepEqual(option.figure_ids, []);
  let truth;
  if (option.id === "A") {
    const match = option.text.match(/^\$([0-9.]+)\\le x<([0-9.]+)\$/);
    truth = equal(match[1], "6.415") && equal(match[2], "6.425");
  } else if (option.id === "B") {
    const match = option.text.match(/^\$([0-9.]+)\\le x\^2<([0-9.]+)\$/);
    truth = equal(match[1], square("6.415")) && equal(match[2], square("6.425"));
  } else if (option.id === "C") {
    const center = option.text.match(/x\^2-([0-9.]+)/)[1];
    const bound = option.text.match(/\\le([0-9.]+)/)[1];
    const [n, d] = rational(square("6.424")), [cn, cd] = rational(center), [bn, bd] = rational(bound);
    assert.ok(equal(nearestHundredth("6.424"), "6.42"));
    truth = (n * cd - cn * d) * bd <= bn * d * cd;
  } else if (option.id === "D") {
    const center = option.text.match(/x\^2=([0-9.]+)/)[1];
    truth = equal(square("6.42"), center);
  } else {
    const example = option.text.match(/x=([0-9.]+)/)[1];
    const center = option.text.match(/x\^2-([0-9.]+)/)[1];
    const errorClaim = option.text.match(/=([0-9.]+)>/)[1];
    const bound = option.text.match(/>([0-9.]+)\$/)[1];
    const [n, d] = rational(square(example)), [cn, cd] = rational(center);
    const [en, ed] = rational(errorClaim), [bn, bd] = rational(bound);
    truth = equal(nearestHundredth(example), "6.42")
      && (n * cd - cn * d) * ed === en * d * cd
      && en * bd > bn * ed;
  }
  if (truth) truths.push(option.id);
}
assert.deepEqual(truths, ["A", "B", "E"]);
assert.ok(!/812|659000|6\.59/.test(error.stem + error.options.map((option) => option.text).join(" ")));
const oldEvidence = JSON.parse(fs.readFileSync(path.join(own, "stage2-hashes.json")));
assert.deepEqual(oldEvidence.complete_independent_true_sets.find((q) => q.question_id === "n38-round-before-square").correct, ["A"]);
assert.deepEqual(oldEvidence.complete_independent_true_sets.find((q) => q.question_id === "n38-squared-estimate-report").correct, ["B"]);
const report = fs.readFileSync(path.join(own, "stage2-affected-mathematics.md"), "utf8");
const optionRows = report.split("\n").filter((line) => /^\| [A-E] \| (true|false) \|/.test(line));
assert.equal(optionRows.length, 5);
assert.deepEqual(optionRows.filter((line) => line.includes("| true |")).map((line) => line.split("|")[1].trim()), truths);
console.log("PASS: original Stage1/FIRST/55-option artifacts unchanged0444; affected fidelity frozen FIRST.");
console.log("PASS: inverse two-section repair exactly reconstructs original packet;11 questions/five rounding options reused.");
console.log("PASS: correction25 at all four allowed below10 columns;10.05 explicitly excluded with no correction supplied.");
console.log("PASS: independently checked all5 new uncertainty options; complete set A,B,E; rounding set A reused.");
console.log("PASS: original804 report B reused; old812 report leak absent. Affected-only pass; stop before canonical key.");
