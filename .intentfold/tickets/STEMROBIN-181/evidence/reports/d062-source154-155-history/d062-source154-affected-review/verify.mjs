import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const outputRoot = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.dirname(outputRoot);
const repairRoot = path.join(tmp, "d061-source154-text-repair");
const verificationPath = path.join(outputRoot, "verification.json");
assert.equal(fs.existsSync(verificationPath), false, "Never overwrite evidence");
const cache = new Map();
const verifiedBindings = new Map();
let bindingOccurrences = 0;
const historicalBindings = [];

function bytes(file) {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(file));
  return cache.get(file);
}

function binding(file) {
  const data = bytes(file);
  return {
    path: file,
    sha256: crypto.createHash("sha256").update(data).digest("hex"),
    bytes: data.length
  };
}

function verify(expected) {
  const actual = binding(expected.path);
  assert.equal(actual.sha256, expected.sha256, expected.path);
  if (typeof expected.bytes === "number") {
    assert.equal(actual.bytes, expected.bytes, expected.path);
  }
  verifiedBindings.set(actual.path, actual);
  bindingOccurrences++;
  return actual;
}

function json(file) {
  return JSON.parse(bytes(file).toString("utf8"));
}

function walk(value, historical = new Map()) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    const permitted = historical.get(value.path);
    if (permitted && value.sha256 === permitted.before.sha256) {
      const actual = verify(permitted.after);
      historicalBindings.push({
        before: permitted.before,
        actualAfter: actual,
        reason: "Historical pre-repair binding, verified by the sole-insertion comparison"
      });
    } else {
      verify(value);
    }
  }
  for (const child of Object.values(value)) walk(child, historical);
}

function sameBytes(left, right) {
  assert.equal(bytes(left.path).equals(bytes(right.path)), true, `${left.path} != ${right.path}`);
}

const freezePath = path.join(repairRoot, "author-freeze.json");
const freezeBinding = verify({
  path: freezePath,
  sha256: "3aa41b73b2eb9f1fb3683573f619dda9a0d62829990c9f640d7eda54b8768909"
});
const freeze = json(freezePath);
walk(freeze);
const originalReport = json(freeze.originalIndependentReport.path);
assert.equal(freeze.originalIndependentReport.sha256,
  "3846f3d38752555c9f8d1ca63c66169ef378fd2cb496cf7d88cb87f47df48a73");
walk(originalReport);
const originalFreeze = json(freeze.originalAuthorFreeze.path);
walk(originalFreeze);
sameBytes(freeze.originalAuthorFreeze, freeze.originalAuthorFreeze.preservedCopy);
sameBytes(freeze.originalIndependentReport, freeze.originalIndependentReport.preservedCopy);

const exact = json(freeze.exactDiff.path);
const beforeBindings = json(freeze.beforeBindings.path);
const afterBindings = json(freeze.afterBindings.path);
walk(exact);
walk(afterBindings);
const historical = new Map(exact.files.map(file => [file.after.path, file]));
walk(beforeBindings, historical);
assert.equal(historicalBindings.length, 2);
for (const copy of afterBindings.preservedBeforeCopies) sameBytes(copy.original, copy.copy);
for (const work of afterBindings.workFiles) {
  sameBytes(work.original, work.after);
  const priorCopy = beforeBindings.copies.find(item =>
    item.copy.path.includes("/before/work/") && item.original.path === work.original.path);
  assert.ok(priorCopy);
  sameBytes(priorCopy.copy, work.after);
}
sameBytes(exact.audit.before, exact.audit.after);

const original154 = originalReport.pages.find(page => page.physicalPage === 154);
const original155 = originalReport.pages.find(page => page.physicalPage === 155);
assert.equal(original154.SOURCE, "FAIL");
assert.equal(original154.actualDefects.length, 1);
assert.deepEqual(beforeBindings.originalIndependentPage, original154);
const finding = original154.actualDefects[0];
assert.equal(finding.id, "D060-SRC-154-NEI");
assert.equal(finding.missingCharacter.codePointAt(0), 0x5185);
assert.deepEqual(exact.originalIndependentFinding, finding);
const changes = exact.files.map(file => {
  const before = bytes(file.before.path);
  const after = bytes(file.after.path);
  let offset = 0;
  while (offset < before.length && before[offset] === after[offset]) offset++;
  assert.equal(after.length - before.length, 3);
  const inserted = after.subarray(offset, offset + 3);
  assert.equal(inserted.toString("hex"), "e58685");
  assert.equal(inserted.toString("utf8"), finding.missingCharacter);
  assert.equal(before.subarray(offset).equals(after.subarray(offset + 3)), true);
  assert.equal(offset, file.change.zeroBasedByteOffset);
  assert.equal(before.toString("utf8").split("\n").length,
    after.toString("utf8").split("\n").length);
  assert.equal(after.toString("utf8").includes(finding.frozenRow), false);
  assert.equal(after.toString("utf8").includes(finding.printedRow), true);
  return {
    name: file.name,
    before: verify(file.before),
    after: verify(file.after),
    zeroBasedByteOffset: offset,
    insertedCharacter: finding.missingCharacter,
    codePoint: "U+5185",
    utf8Hex: inserted.toString("hex"),
    bytesAdded: inserted.length,
    allOtherBytesIdentical: true,
    allLineBreaksIdentical: true
  };
});
const jsonChange = exact.files.find(file => file.name === "page.json");
const mdChange = exact.files.find(file => file.name === "page.md");
sameBytes(jsonChange.before, original154.pageJson);
sameBytes(mdChange.before, original154.pageMd);
const before154 = json(jsonChange.before.path);
const after154 = json(jsonChange.after.path);
assert.equal(before154.blocks[1].lines[3], finding.frozenRow);
assert.equal(after154.blocks[1].lines[3], finding.printedRow);
const expected154 = structuredClone(before154);
expected154.blocks[1].lines[3] = finding.printedRow;
assert.deepEqual(after154, expected154);
const rowCount154 = after154.blocks.reduce((sum, block) =>
  sum + (block.samerow ? 0 : block.lines.length), 0);
assert.equal(rowCount154, 20);
assert.equal(rowCount154, original154.independentPrintedRows.total);
assert.equal(after154.blocks.length, 8);
assert.deepEqual(after154.meta, before154.meta);

const raw114 = originalReport.figures.find(figure => figure.id === "fig-114");
assert.equal(original154.RAW, "PASS");
assert.equal(raw114.RAW, "PASS");
assert.equal(raw114.originalFullPageViewed, true);
assert.equal(raw114.originalCropViewed, true);
assert.equal(raw114.existingSvgFirstRasterViewed, true);
assert.equal(raw114.actualDefects.length, 0);
const unchanged154 = [
  { label: "sourcePagePixels", original: original154.pagePixels, current: freeze.page.sourcePixels },
  { label: "crop114", original: raw114.originalCrop, current: freeze.page.sourceCrop114 },
  { label: "svg114", original: raw114.originalSvg, current: freeze.page.existingSvg114 },
  { label: "audit", original: original154.audit, current: freeze.page.files["audit.json"] }
].map(item => {
  sameBytes(item.original, item.current);
  return { ...item, byteIdentical: true };
});
assert.equal(after154.meta.render.sha256, original154.pagePixels.sha256);
assert.deepEqual(after154.meta.figures[0].box, original154.sourceFigures[0].exactNativeBox);
assert.deepEqual(after154.blocks[4].box, original154.sourceFigures[0].exactNativeBox);
assert.equal(after154.blocks[4].id, "fig-114");

assert.equal(original155.SOURCE, "PASS");
assert.equal(original155.RAW, "HOLD");
const page155 = json(original155.pageJson.path);
assert.equal(page155.meta.render.sha256, original155.pagePixels.sha256);
assert.equal(after154.blocks[0].kind, "h3");
assert.deepEqual(after154.blocks[0].lines, ["58. \u8c03\u5e45"]);
assert.equal(page155.blocks[0].kind, "p");
assert.equal(page155.blocks[0].lines.length, 3);
assert.equal(page155.blocks[0].open, false);
assert.equal(page155.blocks[0].cont, false);
assert.equal(page155.blocks[1].kind, "h3");
assert.deepEqual(page155.blocks[1].lines, ["59. \u68c0\u6ce2"]);
assert.equal(page155.blocks[10].open, true);
const n58 = originalReport.objects.find(object => object.id === "phy10-c1-s6-n58");
assert.equal(n58.first, "p0154#1");
assert.equal(n58.last, "p0155#1");
assert.equal(n58.rightBoundary, "p0155#2");
assert.equal(n58.rangeCompletenessObserved, true);
assert.equal(n58.blockingDefect, finding.id);
assert.deepEqual(n58.ownedFigures, ["fig-114"]);
const sourceRangeBlocks = [
  ...after154.blocks.slice(0, 7).map((block, i) => ({
    sourceRef: `p0154#${i + 1}`, kind: block.kind, lines: block.lines, open: block.open
  })),
  { sourceRef: "p0155#1", kind: page155.blocks[0].kind,
    lines: page155.blocks[0].lines, open: page155.blocks[0].open }
];
const nativeReceipt = json(freeze.nativeReceipt.path);
assert.equal(nativeReceipt.exitCode, 0);
assert.equal(nativeReceipt.nativeInvocationCount, 1);
assert.equal(nativeReceipt.retries, 0);
const nativeStdout = bytes(nativeReceipt.stdout.path).toString("utf8");
const displayPath = path.join(tmp, "d061-n52-display-noether/report.json");
const displayBinding = verify({
  path: displayPath,
  sha256: "1e9297cea8b5de14224720b8e45ebf617dd4b39cd08bb64e139275b75734329b"
});
const display = json(displayPath);
walk(display);
assert.equal(display.status, "PASS");
assert.equal(display.imagesOpened, 7);
assert.equal(display.cumulativeImageCount, 24);
assert.deepEqual(display.selectedReviewTileIndices, [5, 6, 7, 12, 13, 16, 17]);

const result = {
  schema: "STEMROBIN-181/zero-image-byte-verification@1",
  ticket: "STEMROBIN-181",
  reviewer: "Noether",
  completedAt: new Date().toISOString(),
  status: "PASS",
  scope: "Byte bindings and affected line only; no image decoding, viewing, native execution or source approval by this helper",
  verifier: binding(fileURLToPath(import.meta.url)),
  authorFreeze: freezeBinding,
  originalIndependentReport: verify(freeze.originalIndependentReport),
  exactDiff: verify(freeze.exactDiff),
  beforeBindings: verify(freeze.beforeBindings),
  afterBindings: verify(freeze.afterBindings),
  verifiedBindingOccurrences: bindingOccurrences,
  uniqueVerifiedFiles: verifiedBindings.size,
  originalFilesVerifiedUnchanged: afterBindings.originalFiles.length,
  preservedBeforeCopiesVerifiedByteIdentical: afterBindings.preservedBeforeCopies.length,
  repairWorkFilesVerifiedByteIdentical: afterBindings.workFiles.length,
  historicalBeforeBindingOccurrences: historicalBindings,
  changes,
  jsonPointer: "/blocks/1/lines/3",
  actualJsonMatchesOldJsonWithOnlyObservedLineRestored: true,
  metadataNotesFigureBoxesAndAllOtherPropertiesIdentical: true,
  printedRowFromOriginalIndependentObservation: finding.printedRow,
  actualRepairedRow: after154.blocks[1].lines[3],
  originalFinding: finding,
  independentOriginalRowsInherited: original154.independentPrintedRows,
  actualTranscribedRows154: rowCount154,
  unchanged154,
  previousRaw114: {
    originalReportPointer: "/figures/3",
    originalIndependentComparison: raw114.comparison,
    sourceInventory: raw114.sourceInventory,
    firstComparisonRaster: raw114.firstComparisonRaster.result.output,
    rasterReceipt: raw114.firstComparisonRaster.receipt,
    RAW: raw114.RAW,
    noNewViewOrRender: true
  },
  unchanged155: {
    previousSOURCE: original155.SOURCE,
    previousRAW: original155.RAW,
    pageMd: verify(original155.pageMd),
    pageJson: verify(original155.pageJson),
    pixels: verify(original155.pagePixels),
    audit: verify(original155.audit),
    originalBoundaryObservation: original155.observations[0]
  },
  n58OriginalSourceRange: {
    first: n58.first,
    last: n58.last,
    rightBoundary: n58.rightBoundary,
    blocks: sourceRangeBlocks,
    rightBoundaryActualBlock: page155.blocks[1],
    oldBoundaryObservationInherited: true,
    actualPageObjectsMatchOldObservedBoundaries: true,
    ownedFigures: n58.ownedFigures,
    nextObjectStillOpen: page155.blocks[10].open
  },
  existingAuthorNativeReceipt: {
    file: verify(freeze.nativeReceipt),
    stdout: verify(freeze.nativeReceipt.stdout),
    stderr: verify(freeze.nativeReceipt.stderr),
    started: verify(freeze.nativeReceipt.started),
    contentReadOnly: nativeStdout,
    exitCode: nativeReceipt.exitCode,
    usedAsIndependentApproval: false
  },
  completedDisplayReport: displayBinding,
  imagesOpened: 0,
  imageReopens: 0,
  renders: 0,
  nativeRuns: 0,
  cumulativeBefore: 24,
  cumulativeAfter: 24,
  verifiedFiles: [...verifiedBindings.values()].sort((a, b) => a.path.localeCompare(b.path))
};
result.verifiedBindingOccurrences = bindingOccurrences;
result.uniqueVerifiedFiles = verifiedBindings.size;
fs.writeFileSync(verificationPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  verification: {
    path: verificationPath,
    sha256: crypto.createHash("sha256").update(fs.readFileSync(verificationPath)).digest("hex"),
    bytes: fs.statSync(verificationPath).size
  },
  status: result.status,
  uniqueVerifiedFiles: result.uniqueVerifiedFiles,
  verifiedBindingOccurrences: result.verifiedBindingOccurrences,
  originalFilesVerifiedUnchanged: result.originalFilesVerifiedUnchanged,
  preservedBeforeCopiesVerifiedByteIdentical: result.preservedBeforeCopiesVerifiedByteIdentical,
  repairWorkFilesVerifiedByteIdentical: result.repairWorkFilesVerifiedByteIdentical,
  changes,
  printedRowFromOriginalIndependentObservation: finding.printedRow,
  actualRepairedRow: after154.blocks[1].lines[3],
  n58: {
    first: n58.first,
    last: n58.last,
    rightBoundary: n58.rightBoundary,
    firstActualHeading: after154.blocks[0].lines,
    source155LastParagraph: page155.blocks[0].lines,
    rightBoundaryActualHeading: page155.blocks[1].lines
  },
  nativeReceiptReadOnly: nativeStdout,
  imagesOpened: 0,
  cumulativeImageCount: 24
}, null, 2));
