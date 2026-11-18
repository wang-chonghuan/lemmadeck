import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(root);
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const sourceRoot = path.join(tmp, "d507-source198-style-first-detail-review");
const repairRoot = path.join(tmp, "d512-source198-first-style-repair");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (file) => path.resolve(repo, file);
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const meta = (file) => {
  file = absolute(file);
  const bytes = fs.readFileSync(file);
  return {
    path: file, sha256: hash(bytes), bytes: bytes.length,
    mode: `0${(fs.statSync(file).mode & 0o777).toString(8)}`,
  };
};
const verify = (file, expectedHash, expectedBytes) => {
  const result = meta(file);
  assert.equal(result.mode, "0444", result.path);
  if (expectedHash) assert.equal(result.sha256, expectedHash, result.path);
  if (expectedBytes !== undefined) assert.equal(result.bytes, expectedBytes, result.path);
  return result;
};
const manifest = (file, expectedHash) => {
  const binding = verify(file, expectedHash);
  const data = read(binding.path);
  const files = data.files.map((entry) => verify(entry.path, entry.sha256, entry.bytes));
  return { binding, data, files };
};
const write = (name, data) => {
  const file = path.join(root, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(file, 0o444);
  return meta(file);
};
function diff(before, after, pointer = "") {
  if (Object.is(before, after)) return [];
  if (!before || !after || typeof before !== "object" || typeof after !== "object") {
    return [{ pointer, before, after }];
  }
  assert.equal(Array.isArray(before), Array.isArray(after), pointer);
  assert.deepEqual(Object.keys(before), Object.keys(after), pointer);
  return Object.keys(before).flatMap((key) => diff(
    before[key], after[key], `${pointer}/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`,
  ));
}

const sourceFreeze = manifest(path.join(sourceRoot, "review-freeze.json"));
const inventoryBinding = verify(
  path.join(sourceRoot, "source-inventory.json"),
  "420f8faaa98e8d9712899ae5d3d2fb243358158bd5fcc60a16d6f3e92dede3bb",
);
const sourceSeal = verify(
  path.join(sourceRoot, "precomparison-freeze.json"),
  "385c91ec0910176d66995df5482991160aa8c07be025961cbf8cc8781f55f827",
);
const sourceInventory = read(inventoryBinding.path);
assert.equal(sourceInventory.fresh_source_style.faithful_markup_semantics, "emphasis/italic");
assert.equal(sourceInventory.fresh_source_style.bold_addition_certified, false);

const repairReportBinding = verify(
  path.join(repairRoot, "report.json"),
  "fd276c2e207d0cd16e3832ee57d7be4d7ad93923d7b360847a150495b9f71ee5",
);
const repairFreeze = manifest(
  path.join(repairRoot, "author-freeze.json"),
  "f74d1b508a278fa670d5de0805fd59b94a1296dfd243a161d70b2ed52132828b",
);
const repair = read(repairReportBinding.path);
const originalFreeze = manifest(repair.originalFreeze.path, repair.originalFreeze.sha256);
const originalRoot = path.dirname(originalFreeze.binding.path);
const jsonRelative = "source/10p/pages/0198/page.json";
const mdRelative = "source/10p/pages/0198/page.md";
const originalJSON = verify(path.join(originalRoot, jsonRelative));
const candidateJSON = verify(repair.pageJSON.path, repair.pageJSON.sha256);
const originalMD = verify(path.join(originalRoot, mdRelative));
const candidateMD = verify(repair.pageMD.path, repair.pageMD.sha256);
const before = read(originalJSON.path);
const after = read(candidateJSON.path);
const leafDifferences = diff(before, after);
assert.deepEqual(leafDifferences.map((entry) => entry.pointer), ["/blocks/7/lines/1"]);
assert.equal(leafDifferences[0].before, sourceInventory.visible_line_literal);
assert.equal(leafDifferences[0].after, sourceInventory.expected_line_with_visible_style);
const mdBefore = fs.readFileSync(originalMD.path, "utf8").split("\n");
const mdAfter = fs.readFileSync(candidateMD.path, "utf8").split("\n");
assert.equal(mdBefore.length, mdAfter.length);
const mdDifferences = mdBefore.flatMap((line, index) => line === mdAfter[index] ? [] : [{
  line: index + 1, before: line, after: mdAfter[index],
}]);
assert.deepEqual(mdDifferences.map((entry) => entry.line), [78]);
assert.equal(mdDifferences[0].after, sourceInventory.expected_line_with_visible_style);
assert.equal(mdDifferences[0].before, sourceInventory.visible_line_literal);

const punctuationFreeze = manifest(
  path.join(tmp, "d509-source198-first-affected-punctuation-review/review-freeze.json"),
);
const punctuationReportBinding = verify(
  path.join(tmp, "d509-source198-first-affected-punctuation-review/report.json"),
  "fbf7055f7f159014d27ffe35f6a95fb0eb96e0a72ab5bd7aa31b5c67e333ec32",
);
const punctuation = read(punctuationReportBinding.path);
assert.equal(punctuation.verdicts.affected_punctuation, "PASS");
const retainedPunctuation = punctuation.affected_literals.map((entry, index) => {
  assert.equal(after.blocks[8].lines[index], entry.after);
  assert.equal(before.blocks[8].lines[index], entry.after);
  assert.equal(mdAfter[entry.md_line - 1], entry.after);
  return { ...entry, verdict: "INHERITED-PASS-BYTE-UNCHANGED-NO-REPLAY" };
});
const sourceWorkFiles = (files, prefix) => files
  .filter((entry) => entry.path.startsWith(`${prefix}/source/`) || entry.path.startsWith(`${prefix}/work/`))
  .map((entry) => ({ relative: path.relative(prefix, entry.path), ...entry }));
const oldFiles = sourceWorkFiles(originalFreeze.files, originalRoot);
const newFiles = sourceWorkFiles(repairFreeze.files, repairRoot);
assert.deepEqual(oldFiles.map((entry) => entry.relative).sort(), newFiles.map((entry) => entry.relative).sort());
const unchanged = oldFiles.filter((entry) => ![jsonRelative, mdRelative].includes(entry.relative))
  .map((entry) => {
    const current = newFiles.find((file) => file.relative === entry.relative);
    assert.equal(current.sha256, entry.sha256);
    assert.equal(current.bytes, entry.bytes);
    return { relative: entry.relative, before: entry, after: current, verdict: "BYTE-UNCHANGED-ONLY" };
  });

const priorLedger = verify(
  path.join(tmp, "d514-t13-q5-first-written-answer-repair/actual-opens.json"),
  "304d71be9661c12f2e7613176781595efe2783f04aea1055c7b9d3f9235c144d",
);
assert.equal(read(priorLedger.path).context_cumulative_opens, 24);
const ledger = write("actual-opens.json", {
  schema: "STEMROBIN-181/d513-zero-image-affected-style-ledger@1",
  ticket: "STEMROBIN-181",
  prior_record: priorLedger,
  prior_actual_opens: 24, batch_actual_opens: 0,
  context_cumulative_opens: 24, context_cumulative_limit: 24,
  no_budget_reset: true, remaining_context_capacity: 0,
  entries: [], reopens: 0, images_returned_to_parent: 0,
  further_image_opens_forbidden: true,
});
const report = write("report.json", {
  schema: "STEMROBIN-181/d513-source198-affected-style-review@1",
  ticket: "STEMROBIN-181",
  status: "SINGLE-AFFECTED-ITALIC-SPAN-PASS-EXACT-SCOPE-PASS-FULLPAGE-COMPOSITION-PENDING",
  scope: "D507-STYLE-01 only against its already sealed original-pixel observation; no new visual or whole-text review",
  sourceEvidence: { sourceFreeze: sourceFreeze.binding, inventoryBinding, sourceSeal },
  repairEvidence: {
    repairReportBinding, repairFreeze: repairFreeze.binding,
    originalFreeze: originalFreeze.binding, originalJSON, candidateJSON, originalMD, candidateMD,
  },
  finding: {
    id: "D507-STYLE-01",
    jsonPointer: "/blocks/7/lines/1", mdLine: 78,
    sourceLiteral: sourceInventory.target_literal,
    sourceStyle: "Visible slanted emphasis/italic, not additional bold",
    sourceObservation: sourceInventory.fresh_source_style.observation,
    candidateSpan: "*\u7269\u4f53*",
    candidateExactLeaf: after.blocks[7].lines[1],
    verdict: "PASS-AFFECTED-SOURCE-STYLE-ONLY",
    basis: "The candidate's single-asterisk emphasis matches the independently sealed D507 word style and preserves every literal neighbor",
    expectedStyleNotInferredFromNativeOrRepairAuthor: true,
  },
  uniqueJSONLeafDifferences: leafDifferences,
  uniqueMDLineDifferences: mdDifferences,
  exactOneLeafOneLine: true,
  priorPunctuation: {
    report: punctuationReportBinding, freeze: punctuationFreeze.binding,
    retainedPunctuation, unaffectedAndNotReReviewed: true,
  },
  allOtherSourceWorkFilesByteUnchanged: unchanged,
  imageAssetHashing: "Byte binding only; no decoding, viewing, visual approval or preview replay",
  inherited: {
    d497UnaffectedLiteralMathStylePhysicalRowsCaptionFootnoteBoundaries: "Not reviewed again; reserved for first d518 composition",
    originalD497PunctuationFAILAndStyleHOLD: "Immutable history retained",
    originalD507StyleFAIL: "Immutable history retained; only current corrected span passes",
    source198Wholepage: "PENDING-FIRST-COMPOSITION",
    n75: "OPEN", fig168: "HOLD-UNOBSERVED-OFFPAGE",
    SOURCE196: "PROCEDURAL-HOLD", allOtherFAILHOLD: "Preserved",
  },
  gates: { affectedStyle: "PASS", exactRepairScope: "PASS", wholepage: "PENDING", FIG: false, DISPLAY: false, fullcard: false },
  images: { priorActual: 24, added: 0, total: 24, reset: false },
  actions: { nativeRuns: 0, imageOpens: 0, wholeTextReviewReplay: 0, candidateEdits: 0, DBGitCanonicalIndexMeterConsume: 0, newWorkers: 0 },
  actualOpens: ledger,
  fullcard: false,
  outputsOnlyUnder: root,
});
fs.chmodSync(fileURLToPath(import.meta.url), 0o444);
const files = [ledger, report, meta(fileURLToPath(import.meta.url))];
const freeze = write("review-freeze.json", {
  schema: "STEMROBIN-181/d513-affected-style-review-freeze@1",
  ticket: "STEMROBIN-181", status: "FROZEN-AFFECTED-STYLE-PASS-UNRELATED-HOLDS-PRESERVED",
  files, sourceEvidence: { sourceFreeze: sourceFreeze.binding, inventoryBinding, sourceSeal },
  candidateFreeze: repairFreeze.binding,
  affectedStyle: "PASS", wholepage: "PENDING-FIRST-COMPOSITION",
  imageLedger: ledger, fullcard: false,
  selfHash: "Returned textually; excluded from circular binding",
});
for (const entry of [
  ...files, freeze, ...sourceFreeze.files, ...repairFreeze.files, ...originalFreeze.files,
  sourceFreeze.binding, repairFreeze.binding, originalFreeze.binding,
]) verify(entry.path, entry.sha256, entry.bytes);
console.log(JSON.stringify({ report, freeze, ledger, newImages: 0, cumulativeImages: 24 }, null, 2));
