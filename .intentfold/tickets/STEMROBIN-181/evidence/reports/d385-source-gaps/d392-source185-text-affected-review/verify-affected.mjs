import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const baseline = path.join(tmp, "d364-source185-first-author");
const firstReview = path.join(tmp, "d376-source185-first-independent-review");
const typography = path.join(tmp, "d386-source185-typography-affected-review");
const candidate = path.join(tmp, "d390-source185-first-text-repair");
const output = path.join(tmp, "d392-source185-text-affected-review");
const checks = [];
const bindings = new Map();

function check(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function binding(file) {
  const absolute = path.resolve(file);
  if (!absolute.startsWith(`${tmp}/`)) throw new Error("Out-of-scope input");
  const stat = fs.lstatSync(absolute);
  if (!stat.isFile()) throw new Error("Expected regular frozen file");
  const bytes = fs.readFileSync(absolute);
  const result = {
    path: absolute,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  };
  bindings.set(absolute, result);
  return result;
}

function verified(record, requireFrozen = true) {
  const actual = binding(record.path);
  check(`hash:${record.path}`, actual.sha256 === record.sha256);
  if (record.bytes !== undefined) {
    check(`size:${record.path}`, actual.bytes === record.bytes);
  }
  if (requireFrozen) check(`mode:${record.path}`, actual.mode === "0444");
  return actual;
}

function json(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const anchors = [
  [baseline, "author-freeze.json", "178f3f4c1cd36ec258c411a0f15da2e95a9c924b24af8e12078bf26376c88b81"],
  [firstReview, "report.json", "58fb65699115bfce4b4b58159b688ae81e998ef7676c844a3f5af35ede3935ad"],
  [firstReview, "review-freeze.json", "d0a5c62b3a01ae35c26d3bd9dd81508545c47432b4f663e175a657a14ec187e1"],
  [typography, "report.json", "2cae55c3caadb1a69d9841d7814c42d265da1146701e5d87421d417ce231215d"],
  [typography, "review-freeze.json", "dd2a7473240b67a9498e838fd5353a1ac9dc70fb424826910e2f6857e90cc39a"],
  [typography, "actual-opens.json", "32df73d31f94da0dd7d939d0870d3d71e61206b4d058ada615f700890b3eafeb"],
  [candidate, "report.json", "8de061c08a9c748af1cffa980377fbd8e95e506a29f26ffdcdf78ad71388547b"],
  [candidate, "author-freeze.json", "00bd81e372b12281236c6eb091165ebaf9cdf1ac07f4b3e5a0a804ff718df5f0"],
];
for (const [root, name, sha256] of anchors) {
  verified({ path: path.join(root, name), sha256 });
}

const oldFreeze = json(path.join(baseline, "author-freeze.json"));
const newFreeze = json(path.join(candidate, "author-freeze.json"));
const prior = json(path.join(firstReview, "report.json"));
const sourceReading = json(path.join(typography, "report.json"));
const history = json(path.join(typography, "actual-opens.json"));
const authorReport = json(path.join(candidate, "report.json"));

check("candidate manifest frozen", newFreeze.frozen === true);
check("candidate manifest root", newFreeze.root === candidate);
check("candidate manifest paths stay in candidate", newFreeze.files.every((entry) => entry.path.startsWith(`${candidate}/`)));
for (const entry of newFreeze.files) verified(entry);
const baselineEntries = oldFreeze.files.filter((entry) =>
  entry.path.startsWith(`${baseline}/source/10p/pages/0185/`) ||
  entry.path.startsWith(`${baseline}/work/10p/pages/0185/`) ||
  oldFreeze.native_receipts.some((receipt) => receipt.path === entry.path) ||
  entry.path === oldFreeze.report.path
);
for (const entry of baselineEntries) verified(entry);
for (const root of [firstReview, typography]) {
  const freeze = json(path.join(root, "review-freeze.json"));
  for (const entry of freeze.artifacts) {
    if (!entry.path.endsWith(".png")) verified(entry);
  }
}
check("permanent reviewer image history is 23", history.totals.cumulative === 23);
check("permanent reviewer image limit is 24", history.totals.limit === 24);
check("prior source words and local structure passed", prior.verdicts.SOURCE185_WORDS_AND_LOCAL_STRUCTURE === "PASS");
check("prior source HOLD preserved", prior.verdicts.SOURCE185 === "HOLD");
check("typography authority is BOLD-CONFIRMED REVISE", sourceReading.decision === "BOLD-CONFIRMED" && sourceReading.affectedVerdict === "REVISE");
check("prior review bound baseline freeze", prior.inputAuthorFreezeSHA256 === binding(path.join(baseline, "author-freeze.json")).sha256);

const pageRelative = "source/10p/pages/0185";
const beforeJSONPath = path.join(baseline, pageRelative, "page.json");
const afterJSONPath = path.join(candidate, pageRelative, "page.json");
const beforeMDPath = path.join(baseline, pageRelative, "page.md");
const afterMDPath = path.join(candidate, pageRelative, "page.md");
const beforeJSON = json(beforeJSONPath);
const afterJSON = json(afterJSONPath);
const beforeJSONText = fs.readFileSync(beforeJSONPath, "utf8");
const afterJSONBytes = fs.readFileSync(afterJSONPath);
const beforeMDText = fs.readFileSync(beforeMDPath, "utf8");
const afterMDBytes = fs.readFileSync(afterMDPath);
const requirements = sourceReading.exactRepairRequirements;
check("frozen reading baseline JSON binding", requirements.targetCandidateSHA256 === binding(beforeJSONPath).sha256);
check("frozen reading baseline MD binding", requirements.targetMDSHA256 === binding(beforeMDPath).sha256);
const requiredStrings = [
  "\u5df2\u77e5\u7269\u4f53\u5230\u7403\u9762\u955c\u7684\u4f4d\u7f6e\uff0c\u5c31\u53ef\u4ee5\u7528\u4f5c\u56fe\u6cd5\u6c42\u51fa**\u50cf\u7684\u4f4d",
  "\u7f6e**. \u4e3a\u6b64\uff0c\u5e94\u8be5\u4f1a\u4f5c\u51fa\u7269\u4f53\u7684",
];
const pointers = ["/blocks/7/lines/0", "/blocks/7/lines/1"];
const rows = requirements.rows.map((row, index) => {
  check(`source reading pointer ${index}`, row.jsonPointer === pointers[index]);
  check(`source reading required string ${index}`, row.required === requiredStrings[index]);
  check(`baseline affected row ${index}`, beforeJSON.blocks[7].lines[index] === row.original);
  check(`candidate affected row ${index}`, afterJSON.blocks[7].lines[index] === row.required);
  check(`source words preserved row ${index}`, row.required.replaceAll("**", "") === row.original);
  return {
    jsonPointer: row.jsonPointer,
    original: beforeJSON.blocks[7].lines[index],
    sourceRequired: row.required,
    actual: afterJSON.blocks[7].lines[index],
    verdict: afterJSON.blocks[7].lines[index] === row.required ? "PASS" : "FAIL",
  };
});
check("exactly two source repair rows", requirements.rows.length === 2);

const differences = [];
function walk(before, after, pointer = "") {
  if (isDeepStrictEqual(before, after)) return;
  if (before && after && typeof before === "object" && typeof after === "object" &&
      Array.isArray(before) === Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      const escaped = key.replaceAll("~", "~0").replaceAll("/", "~1");
      walk(before[key], after[key], `${pointer}/${escaped}`);
    }
  } else {
    differences.push({ pointer, before, after });
  }
}
walk(beforeJSON, afterJSON);
check("only allowed JSON pointers changed", isDeepStrictEqual(differences.map((entry) => entry.pointer).sort(), [...pointers].sort()));
const expectedJSON = structuredClone(beforeJSON);
for (let index = 0; index < 2; index++) expectedJSON.blocks[7].lines[index] = requiredStrings[index];
check("all other JSON text metadata rowflags unchanged", isDeepStrictEqual(expectedJSON, afterJSON));

function replaceOnce(text, original, required, label) {
  const count = text.split(original).length - 1;
  check(`unique complete row token:${label}`, count === 1);
  return count === 1 ? text.replace(original, required) : text;
}
let expectedJSONText = beforeJSONText;
let expectedMDText = beforeMDText;
for (const row of requirements.rows) {
  expectedJSONText = replaceOnce(expectedJSONText, JSON.stringify(row.original), JSON.stringify(row.required), `JSON:${row.jsonPointer}`);
  expectedMDText = replaceOnce(expectedMDText, `\n${row.original}\n`, `\n${row.required}\n`, `MD:${row.jsonPointer}`);
}
check("JSON byte diff exactly two double-asterisk insertions", Buffer.from(expectedJSONText).equals(afterJSONBytes));
check("MD byte diff exactly two double-asterisk insertions", Buffer.from(expectedMDText).equals(afterMDBytes));
check("JSON increases exactly four ASCII bytes", afterJSONBytes.length - Buffer.byteLength(beforeJSONText) === 4);
check("MD increases exactly four ASCII bytes", afterMDBytes.length - Buffer.byteLength(beforeMDText) === 4);
const beforeMDLines = beforeMDText.split("\n");
const afterMDLines = afterMDBytes.toString("utf8").split("\n");
const mdDifferences = beforeMDLines.flatMap((line, index) =>
  line === afterMDLines[index] ? [] : [{ line1based: index + 1, before: line, after: afterMDLines[index] }]
);
check("physical MD row count unchanged", beforeMDLines.length === afterMDLines.length);
check("only two MD rows changed", mdDifferences.length === 2);
const spanRows = afterJSON.blocks[7].lines.slice(0, 2).join("");
check("one continuous four-character bold span", spanRows.split("**").length === 3 && spanRows.split("**")[1] === "\u50cf\u7684\u4f4d\u7f6e");

function treeFiles(root, relative = "") {
  return fs.readdirSync(path.join(root, relative), { withFileTypes: true })
    .flatMap((entry) => {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) return treeFiles(root, name);
      if (!entry.isFile()) throw new Error("Non-regular entry in comparison tree");
      return [name];
    }).sort();
}
const treeComparisons = [];
for (const relative of [pageRelative, "work/10p/pages/0185"]) {
  const oldTree = treeFiles(path.join(baseline, relative));
  const newTree = treeFiles(path.join(candidate, relative));
  check(`same complete file set:${relative}`, isDeepStrictEqual(oldTree, newTree));
  for (const name of oldTree) {
    const fullRelative = path.join(relative, name);
    const before = binding(path.join(baseline, fullRelative));
    const after = binding(path.join(candidate, fullRelative));
    const bytesIdentical = fs.readFileSync(before.path).equals(fs.readFileSync(after.path));
    const authorizedChanged = fullRelative === `${pageRelative}/page.json` || fullRelative === `${pageRelative}/page.md`;
    if (!authorizedChanged) check(`unchanged asset:${fullRelative}`, bytesIdentical);
    treeComparisons.push({ relative: fullRelative, before, after, bytesIdentical, authorizedChanged });
  }
}
const rawComparisons = treeComparisons.filter((entry) => entry.relative.includes("/figures/"));
check("exactly six RAW PNG SVG comparisons", rawComparisons.length === 6);
const priorOpens = json(path.join(firstReview, "actual-opens.json"));
for (const id of ["145", "146", "147"]) {
  check(`inherited RAW${id} PASS`, prior.verdicts[`RAW${id}`] === "PASS");
  const raw = rawComparisons.find((entry) => entry.relative.endsWith(`fig-${id}.png`));
  const opened = priorOpens.actualOpens.find((entry) => entry.path === raw.before.path);
  check(`prior RAW${id} independently opened same bytes`, opened?.sha256 === raw.before.sha256 && opened?.successfulPixelLoad === true);
}

const receiptPath = path.join(candidate, "native/finalize-185.receipt.json");
const receipt = json(receiptPath);
const started = json(path.join(candidate, "native/finalize-185.started.json"));
verified(receipt.stdout);
verified(receipt.stderr);
const stdout = fs.readFileSync(receipt.stdout.path, "utf8");
check("author first native invocation ordinal one", receipt.invocation_ordinal === 1 && started.invocation_ordinal === 1);
check("author native receipt exit zero", receipt.exit_code === 0 && receipt.signal === null && receipt.launch_error === null);
check("author native receipt exactly one finalize", receipt.native_finalize_runs === 1 && authorReport.native_finalize_runs === 1);
check("author native receipt exact started argv", isDeepStrictEqual(receipt.argv, started.argv));
check("author native stdout 18 of 18", /18 \u884c\uff08\u5370\u5237 18\uff09/.test(stdout));
check("author native stdout normalization zero", /\u89c4\u8303\u5316 0 \u5904/.test(stdout));
check("author native stderr empty", receipt.stderr.bytes === 0);
check("author vectorize and raster zero", receipt.vectorize_runs === 0 && receipt.raster_runs === 0);
check("candidate before-native and after bindings byte identical", fs.readFileSync(path.join(candidate, "before-native-bindings.json")).equals(fs.readFileSync(path.join(candidate, "after-bindings.json"))));
const nativeEvidence = {
  receipt: binding(receiptPath),
  started: binding(path.join(candidate, "native/finalize-185.started.json")),
  stdout: binding(receipt.stdout.path),
  stderr: binding(receipt.stderr.path),
  invocationOrdinal: receipt.invocation_ordinal,
  authorFinalizeRuns: receipt.native_finalize_runs,
  exitCode: receipt.exit_code,
  linesPrinted: 18,
  linesMD: 18,
  recordedStdout: stdout,
  existingAuthorReceiptConsumptionCount: 1,
  reviewerNativeRuns: 0,
  nativeReuseCount: 0,
  mechanicalPassUsedAsSemanticPass: false,
  limitation: "Existing frozen receipt only; no native process invoked or historical invocation count independently reconstructed.",
};

const failures = checks.filter((entry) => !entry.passed);
const evidence = {
  schema: "source185-text-affected-exact-binding@1",
  ticket: "STEMROBIN-181",
  reviewer: "same-resumed-SOURCE181-independent-reviewer",
  scope: "Affected two-row text repair only; independent byte/hash comparisons, not a new pixel or scientific review.",
  baselineRoot: baseline,
  candidateRoot: candidate,
  authority: anchors.map(([root, name]) => binding(path.join(root, name))),
  authorFreezeEntriesVerified: newFreeze.files.length,
  selectedBaselineFreezeEntriesVerified: baselineEntries.length,
  rows,
  jsonDifferences: differences,
  mdDifferences,
  typography: { boldPhrase: "\u50cf\u7684\u4f4d\u7f6e", continuousSpanAcrossTwoPrintedRows: true },
  treeComparisons,
  rawComparisons,
  nativeEvidence,
  inputBindings: [...bindings.values()],
  checks,
  failures,
  eligible: failures.length === 0,
  imageReads: "Opaque file bytes for SHA256 and equality only; no PNG decoding, pixel display or image tool calls.",
  newImages: 0,
  cumulativeImages: 23,
  reviewerNativeRuns: 0,
};
const target = path.join(output, "exact-binding.json");
fs.writeFileSync(target, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(target, 0o444);
console.log(JSON.stringify({
  exactBinding: target,
  sha256: crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex"),
  eligible: evidence.eligible,
  checkCount: checks.length,
  failures,
  rows,
  mdDifferences,
  unchangedAssets: treeComparisons.filter((entry) => entry.bytesIdentical).length,
  rawComparisons: rawComparisons.map((entry) => ({ relative: entry.relative, sha256: entry.after.sha256, bytesIdentical: entry.bytesIdentical })),
  authorFreezeEntriesVerified: newFreeze.files.length,
  selectedBaselineFreezeEntriesVerified: baselineEntries.length,
  nativeEvidence,
}, null, 2));
if (failures.length) process.exitCode = 1;
