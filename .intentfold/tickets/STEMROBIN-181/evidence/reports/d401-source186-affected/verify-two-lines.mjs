import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";

const output = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(output);
const baseline = path.join(tmp, "d393-source186-first-author");
const reviewRoot = path.join(tmp, "d396-source186-first-text-review");
const candidate = path.join(tmp, "d398-source186-first-text-repair");
const bindings = new Map();
const checks = [];
const check = (name, passed) => checks.push({ name, passed: Boolean(passed) });
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

function digest(file) {
  const absolute = path.resolve(file);
  if (!absolute.startsWith(`${tmp}/`)) throw new Error("Input outside ticket tmp");
  const stat = fs.lstatSync(absolute);
  if (!stat.isFile()) throw new Error("Expected regular file");
  const bytes = fs.readFileSync(absolute);
  const entry = {
    path: absolute,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  };
  bindings.set(absolute, entry);
  return entry;
}

function verify(entry) {
  const actual = digest(entry.path);
  check(`sha256:${entry.path}`, actual.sha256 === entry.sha256);
  if (entry.bytes !== undefined) check(`bytes:${entry.path}`, actual.bytes === entry.bytes);
  check(`frozenMode:${entry.path}`, actual.mode === "0444");
  return actual;
}

const anchors = [
  [baseline, "report.json", "cfd31a518eff2c07656a7eea4a9ae2cbfdd51a60d89c00fee6b9cd7e0b26c8f8"],
  [baseline, "author-freeze.json", "225091a6216694b7208db451766a940743e7540dcb5ca8c6cfff0a074bc0e552"],
  [reviewRoot, "report.json", "9d72c7496e8eaf22b31f950d5e97ed76a4ab33978be882b37e140900d18653df"],
  [reviewRoot, "review-freeze.json", "208741140e9a8b1b30aad5e6e1e813f96d0fdea0000cb20485fb03d3fdd3651c"],
  [reviewRoot, "independent-text-inventory.json", "303ddd09419877c350dadd1b3d0b106ec2c95f7ab9bdcd8149115656881847bd"],
  [reviewRoot, "independent-text-freeze.json", "f6480625df94d18d56464046dd60d02b880900e46649b2f5b423c83d5f872d85"],
  [reviewRoot, "bindings.json", "18e826fe23de1d4d790ce3a0ffc70e97f7fff57826e6c51f19ed0590d75799fd"],
  [reviewRoot, "actual-opens.json", "8a3cc1802457d9afcd76ccb40000313126d2630bd1a33acd0a89e0b12a93d6e8"],
  [candidate, "report.json", "e5ea80d682471170103139a0f45a17345c244ad1f3af0ea8c2c4a959f57f9e32"],
  [candidate, "author-freeze.json", "8e2c7c4ad0c91eb589a23b11c12a502c6abeb0222548b2c8ca21fc414dea6cd5"],
];
for (const [root, name, sha256] of anchors) verify({ path: path.join(root, name), sha256 });
const baselineFreeze = readJSON(path.join(baseline, "author-freeze.json"));
const candidateFreeze = readJSON(path.join(candidate, "author-freeze.json"));
const prior = readJSON(path.join(reviewRoot, "report.json"));
const inventory = readJSON(path.join(reviewRoot, "independent-text-inventory.json"));
const priorBindings = readJSON(path.join(reviewRoot, "bindings.json"));
const history = readJSON(path.join(reviewRoot, "actual-opens.json"));
const authorReport = readJSON(path.join(candidate, "report.json"));
check("candidate manifest frozen", candidateFreeze.frozen === true);
check("candidate manifest bound to candidate root", candidateFreeze.root === candidate);
check("candidate manifest paths scoped to candidate", candidateFreeze.files.every((entry) => entry.path.startsWith(`${candidate}/`)));
for (const entry of candidateFreeze.files) verify(entry);
for (const entry of baselineFreeze.files) verify(entry);
for (const entry of readJSON(path.join(reviewRoot, "review-freeze.json")).artifacts) verify(entry);
check("reviewer permanent history 24 of 24", history.totals.cumulative === 24 && history.totals.limit === 24 && history.totals.remaining === 0);
check("d396 source reading frozen before author semantics", prior.scope.independentReadingFrozenBeforeAuthorJSON === true && inventory.authorSemanticInputsReadBeforeThisInventory === false);

const requirements = [
  prior.findings.find((entry) => entry.id === "D396-S186-W001"),
  prior.findings.find((entry) => entry.id === "D396-S186-E001"),
];
const rows = [
  { blockIndex: 0, lineIndex: 5, pointer: "/blocks/0/lines/5", finding: requirements[0], inventoryGroup: 0, inventoryLine: 5 },
  { blockIndex: 8, lineIndex: 1, pointer: "/blocks/8/lines/1", finding: requirements[1], inventoryGroup: 6, inventoryLine: 1 },
];
const relative = "source/10p/pages/0186";
const beforeJSONPath = path.join(baseline, relative, "page.json");
const afterJSONPath = path.join(candidate, relative, "page.json");
const beforeMDPath = path.join(baseline, relative, "page.md");
const afterMDPath = path.join(candidate, relative, "page.md");
const before = readJSON(beforeJSONPath);
const after = readJSON(afterJSONPath);
const beforeJSONText = fs.readFileSync(beforeJSONPath, "utf8");
const afterJSONBytes = fs.readFileSync(afterJSONPath);
const beforeMDText = fs.readFileSync(beforeMDPath, "utf8");
const afterMDBytes = fs.readFileSync(afterMDPath);
check("reviewed baseline JSON unchanged", digest(beforeJSONPath).sha256 === prior.authorBinding.pageJSON.sha256);
check("reviewed baseline MD unchanged", digest(beforeMDPath).sha256 === prior.authorBinding.pageMD.sha256);

const rowResults = rows.map((row) => {
  const oldLine = before.blocks[row.blockIndex].lines[row.lineIndex];
  const newLine = after.blocks[row.blockIndex].lines[row.lineIndex];
  const required = row.finding.requiredAffectedCandidate;
  const frozenSource = inventory.textGroups[row.inventoryGroup].lines[row.inventoryLine];
  check(`historical finding remains FAIL:${row.finding.id}`, row.finding.status === "FAIL");
  check(`finding pointer:${row.pointer}`, row.finding.jsonPointer === row.pointer);
  check(`original row bound:${row.pointer}`, oldLine === row.finding.candidate);
  check(`exact required row:${row.pointer}`, newLine === required);
  if (row.blockIndex === 0) {
    check("word requirement exactly independent frozen row", required === frozenSource);
    check("only extra U+526F removed from affected word row", oldLine.replace("和\u526f光轴", "和光轴") === required);
  } else {
    check("frozen inventory confirms four-character bold phrase", inventory.textGroups[6].styles.definiteBoldChinese.includes("任意两条"));
    check("only emphasis markers added to affected emphasis row", required.replaceAll("**", "") === oldLine);
    check("exactly one bold span on confirmed phrase", required.split("**").length === 3 && required.split("**")[1] === "任意两条");
  }
  return {
    finding: row.finding.id,
    jsonPointer: row.pointer,
    original: oldLine,
    independentFrozenSourceRow: frozenSource,
    required,
    actual: newLine,
    verdict: newLine === required ? "PASS" : "FAIL",
  };
});

const expected = structuredClone(before);
for (const row of rows) expected.blocks[row.blockIndex].lines[row.lineIndex] = row.finding.requiredAffectedCandidate;
check("all nonaffected text metadata frames flags unchanged structurally", isDeepStrictEqual(expected, after));
const differences = [];
function walk(oldValue, newValue, pointer = "") {
  if (isDeepStrictEqual(oldValue, newValue)) return;
  if (oldValue && newValue && typeof oldValue === "object" && typeof newValue === "object" && Array.isArray(oldValue) === Array.isArray(newValue)) {
    for (const key of new Set([...Object.keys(oldValue), ...Object.keys(newValue)])) {
      walk(oldValue[key], newValue[key], `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`);
    }
  } else {
    differences.push({ pointer, before: oldValue, after: newValue });
  }
}
walk(before, after);
check("exactly the two allowed JSON pointer differences", isDeepStrictEqual(differences.map((entry) => entry.pointer).sort(), rows.map((row) => row.pointer).sort()));
function replaceOnce(text, oldToken, newToken, name) {
  const count = text.split(oldToken).length - 1;
  check(`unique complete row replacement:${name}`, count === 1);
  return count === 1 ? text.replace(oldToken, newToken) : text;
}
let expectedJSONText = beforeJSONText;
let expectedMDText = beforeMDText;
for (const row of rowResults) {
  expectedJSONText = replaceOnce(expectedJSONText, JSON.stringify(row.original), JSON.stringify(row.required), `JSON:${row.jsonPointer}`);
  expectedMDText = replaceOnce(expectedMDText, `\n${row.original}\n`, `\n${row.required}\n`, `MD:${row.jsonPointer}`);
}
check("JSON byte diff exactly authorized deletion and markers", Buffer.from(expectedJSONText).equals(afterJSONBytes));
check("MD byte diff exactly authorized deletion and markers", Buffer.from(expectedMDText).equals(afterMDBytes));
check("JSON net byte delta +1 from minus3 plus4", afterJSONBytes.length - Buffer.byteLength(beforeJSONText) === 1);
check("MD net byte delta +1 from minus3 plus4", afterMDBytes.length - Buffer.byteLength(beforeMDText) === 1);
const oldMDLines = beforeMDText.split("\n");
const newMDLines = afterMDBytes.toString("utf8").split("\n");
const mdDifferences = oldMDLines.flatMap((line, index) => line === newMDLines[index] ? [] : [{ line1based: index + 1, before: line, after: newMDLines[index] }]);
check("same physical MD rows", oldMDLines.length === newMDLines.length);
check("exactly two changed MD rows", mdDifferences.length === 2);
check("final summary HOLD row byte-identical", before.blocks[9].lines[0] === after.blocks[9].lines[0]);
check("d396 final summary HOLD retained", prior.findings.find((entry) => entry.id === "D396-S186-T001").status === "HOLD");

function treeFiles(root, current = "") {
  return fs.readdirSync(path.join(root, current), { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(current, entry.name);
    if (entry.isDirectory()) return treeFiles(root, name);
    if (!entry.isFile()) throw new Error("Non-regular comparison entry");
    return [name];
  }).sort();
}
const assetComparisons = [];
for (const subtree of [relative, "work/10p/pages/0186", "first-svg-preview"]) {
  const oldFiles = treeFiles(path.join(baseline, subtree));
  const newFiles = treeFiles(path.join(candidate, subtree));
  check(`identical subtree file sets:${subtree}`, isDeepStrictEqual(oldFiles, newFiles));
  for (const name of oldFiles) {
    const fullRelative = path.join(subtree, name);
    const oldBinding = digest(path.join(baseline, fullRelative));
    const newBinding = digest(path.join(candidate, fullRelative));
    const byteIdentical = fs.readFileSync(oldBinding.path).equals(fs.readFileSync(newBinding.path));
    const authorizedChanged = fullRelative === `${relative}/page.md` || fullRelative === `${relative}/page.json`;
    if (!authorizedChanged) check(`nonaffected asset byte-identical:${fullRelative}`, byteIdentical);
    assetComparisons.push({ relative: fullRelative, before: oldBinding, after: newBinding, byteIdentical, authorizedChanged });
  }
}
check("RAW PNG SVG and first preview remain byte-identical", assetComparisons.filter((entry) => entry.relative.includes("/figures/") || entry.relative === "first-svg-preview/fig-148.png").every((entry) => entry.byteIdentical));
check("nonaffected independent word PASS groups inherited unchanged", priorBindings.comparisons.filter((entry) => entry.independentGroup !== "s186-text-1").every((entry) => entry.wordVerdict === "PASS"));
check("prior lexical issue was only the repaired row", priorBindings.wordDifferences.length === 1 && priorBindings.wordDifferences[0].jsonPointer === "/blocks/0/lines/5");

const receiptPath = path.join(candidate, "native/finalize-186.receipt.json");
const receipt = readJSON(receiptPath);
const started = readJSON(path.join(candidate, "native/finalize-186.started.json"));
verify(receipt.stdout);
verify(receipt.stderr);
const stdout = fs.readFileSync(receipt.stdout.path, "utf8");
check("existing repair author receipt first invocation", receipt.invocation_ordinal === 1 && started.invocation_ordinal === 1);
check("existing repair author native exit zero", receipt.exit_code === 0 && receipt.signal === null && receipt.launch_error === null);
check("recorded author repair finalize once", receipt.native_finalize_runs === 1 && authorReport.native_finalize_runs === 1);
check("native stdout 25 of 25", /25 \u884c\uff08\u5370\u5237 25\uff09/.test(stdout));
check("native normalization zero", /\u89c4\u8303\u5316 0 \u5904/.test(stdout));
check("native stderr empty", receipt.stderr.bytes === 0);
check("no new repair author vectorize or raster", receipt.vectorize_runs === 0 && receipt.raster_runs === 0 && authorReport.vectorize_runs === 0 && authorReport.raster_runs === 0);
check("before and after repair native bindings equal", fs.readFileSync(path.join(candidate, "before-native-bindings.json")).equals(fs.readFileSync(path.join(candidate, "after-bindings.json"))));
const audit = readJSON(path.join(candidate, relative, "audit.json"));
check("audit unchanged and 25 of 25 errors empty", audit.lines_printed === 25 && audit.lines_md === 25 && audit.errors.length === 0);
const failures = checks.filter((entry) => !entry.passed);
const evidence = {
  schema: "source186-two-lines-affected-exact-binding@1",
  ticket: "STEMROBIN-181",
  reviewer: "same-resumed-SOURCE181-independent-reviewer",
  scope: "Zero-image comparison of only two source-author text repairs; composition eligible for SOURCE_WORDS only, never full SOURCE186.",
  authority: anchors.map(([root, name]) => digest(path.join(root, name))),
  candidateFreezeEntriesVerified: candidateFreeze.files.length,
  baselineFreezeEntriesVerified: baselineFreeze.files.length,
  rowResults,
  jsonDifferences: differences,
  mdDifferences,
  assetComparisons,
  nativeEvidence: {
    receipt: digest(receiptPath),
    stdout: digest(receipt.stdout.path),
    recordedAuthorFirstRepairInvocation: receipt.invocation_ordinal,
    recordedAuthorRepairFinalizeRuns: receipt.native_finalize_runs,
    recordedExitCode: receipt.exit_code,
    printedRows: 25,
    MDRows: 25,
    existingRepairAuthorReceiptConsumptionCount: 1,
    originalFirstAuthorReceipt: digest(path.join(baseline, "native/finalize-186.receipt.json")),
    reviewerNativeRuns: 0,
    nativeReuseCount: 0,
    mechanicalPASSUsedAsSemanticPASS: false,
  },
  retainedHolds: [
    { finding: "D396-S186-T001", pointer: "/blocks/9/lines/0", status: "HOLD", rowByteIdentical: true },
    { finding: "RAW148_SVG148_GLYPH_CROP_FIDELITY", status: "HOLD", noActualIndependentRAWOrSVGDisplay: true },
  ],
  inputBindings: [...bindings.values()],
  checks,
  failures,
  eligibleForSOURCE_WORDSComposition: failures.length === 0,
  eligibleForFullSOURCE186: false,
  opaqueImageBytesOnlyForHashAndEquality: true,
  imageDecodes: 0,
  actualImageOpens: 0,
  oldPermanentImageOpens: 24,
  cumulativeImageOpens: 24,
  reviewerNativeRuns: 0,
  authorInventorySemanticallyReadOrUsedAsTruth: false,
};
const target = path.join(output, "exact-binding.json");
fs.writeFileSync(target, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(target, 0o444);
console.log(JSON.stringify({
  exactBinding: digest(target),
  eligibleForSOURCE_WORDSComposition: evidence.eligibleForSOURCE_WORDSComposition,
  checkCount: checks.length,
  failures,
  rowResults,
  mdDifferences,
  comparedFiles: assetComparisons.length,
  unchangedAssets: assetComparisons.filter((entry) => entry.byteIdentical).length,
  candidateFreezeEntriesVerified: candidateFreeze.files.length,
  baselineFreezeEntriesVerified: baselineFreeze.files.length,
  nativeEvidence: evidence.nativeEvidence,
}, null, 2));
if (failures.length) process.exitCode = 1;
