import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const author = "/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d393-source186-first-author";
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const digest = (file) => {
  const stat = fs.lstatSync(file);
  assert.ok(stat.isFile());
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: `0${(stat.mode & 0o777).toString(8)}`,
  };
};
const inventoryPath = path.join(root, "independent-text-inventory.json");
const inventory = readJSON(inventoryPath);
const prefreezePath = path.join(root, "independent-text-freeze.json");
const prefreeze = readJSON(prefreezePath);
assert.equal(digest(inventoryPath).sha256, "303ddd09419877c350dadd1b3d0b106ec2c95f7ab9bdcd8149115656881847bd");
assert.equal(digest(prefreezePath).sha256, "f6480625df94d18d56464046dd60d02b880900e46649b2f5b423c83d5f872d85");
for (const artifact of prefreeze.artifacts) assert.deepEqual(digest(artifact.path), artifact);
assert.equal(prefreeze.independentInventoryFrozenBeforeAuthorSemanticReads, true);

const freezePath = path.join(author, "author-freeze.json");
const reportPath = path.join(author, "report.json");
assert.equal(digest(freezePath).sha256, "225091a6216694b7208db451766a940743e7540dcb5ca8c6cfff0a074bc0e552");
assert.equal(digest(reportPath).sha256, "cfd31a518eff2c07656a7eea4a9ae2cbfdd51a60d89c00fee6b9cd7e0b26c8f8");
const freeze = readJSON(freezePath);
const authorReport = readJSON(reportPath);
const selectedNames = [
  "report.json",
  "source/10p/pages/0186/page.png",
  "source/10p/pages/0186/page.json",
  "source/10p/pages/0186/page.md",
  "source/10p/pages/0186/audit.json",
  "native/finalize-186.receipt.json",
  "native/finalize-186.stdout.txt",
  "native/finalize-186.stderr.txt",
  "native/vectorize-186.receipt.json",
  "native/vectorize-186.stdout.txt",
  "native/vectorize-186.stderr.txt",
  "native/first-svg-preview-fig-148.receipt.json",
  "native/first-svg-preview-fig-148.stdout.txt",
  "native/first-svg-preview-fig-148.stderr.txt",
];
const inputBindings = selectedNames.map((relative) => {
  const file = path.join(author, relative);
  const declared = freeze.files.find((entry) => entry.path === file);
  assert.ok(declared);
  const actual = digest(file);
  assert.equal(actual.sha256, declared.sha256);
  assert.equal(actual.bytes, declared.bytes);
  assert.equal(actual.mode, "0444");
  return actual;
});
inputBindings.push(digest(freezePath), digest(inventoryPath), digest(prefreezePath), digest(path.join(root, "actual-opens.json")));

const page = readJSON(path.join(author, "source/10p/pages/0186/page.json"));
const audit = readJSON(path.join(author, "source/10p/pages/0186/audit.json"));
const pageMD = fs.readFileSync(path.join(author, "source/10p/pages/0186/page.md"), "utf8");
const map = [0, 1, 2, 5, 6, 7, 8, 9];
const lexical = (text) => text.normalize("NFC").replace(/[$\s.,;:()，。；：（）]/gu, "");
const comparisons = inventory.textGroups.map((group, index) => {
  const blockIndex = map[index];
  const block = page.blocks[blockIndex];
  const rowComparisons = group.lines.map((source, lineIndex) => {
    const candidate = block.lines[lineIndex];
    return {
      jsonPointer: `/blocks/${blockIndex}/lines/${lineIndex}`,
      independentSourceReading: source,
      candidate,
      exactMatch: source === candidate,
      wordsAndMathLabelsMatchIgnoringTranscriptionPunctuationAndSpacing: lexical(source) === lexical(candidate),
    };
  });
  return {
    independentGroup: group.id,
    candidateBlockRef: `p0186#${blockIndex + 1}`,
    candidateBlockIndex: blockIndex,
    candidateKind: block.kind,
    rowsMatch: group.lines.length === block.lines.length,
    wordVerdict: rowComparisons.every((row) => row.wordsAndMathLabelsMatchIgnoringTranscriptionPunctuationAndSpacing) ? "PASS" : "FAIL",
    rowComparisons,
  };
});
const wordDifferences = comparisons.flatMap((group) =>
  group.rowComparisons.filter((row) => !row.wordsAndMathLabelsMatchIgnoringTranscriptionPunctuationAndSpacing)
);
const typographyCandidate = page.blocks[8].lines[1];
const caption = page.blocks[4];
const footer = page.blocks[10];
const structureChecks = {
  bookAndPageCorrect: page.meta.book === "10p" && page.meta.page === 186 && page.meta.printed_page === 176,
  sourceHashAndHeaderBound: page.meta.render.sha256 === inventory.source.sha256 && page.meta.render.w === 1536 && page.meta.render.h === 2337,
  observedBodyRowsMatch: comparisons.reduce((sum, group) => sum + group.rowComparisons.length, 0) === 24 && comparisons.every((group) => group.rowsMatch),
  allEightTextGroupsAreProse: comparisons.every((group) => group.candidateKind === "p"),
  fourNumberedRaysRemainProseNotExercises: [2, 5, 6, 7].every((index, offset) => page.blocks[index].kind === "p" && page.blocks[index].lines[0].startsWith(`${offset + 1}.`)),
  noHeadingOrExerciseBlock: !page.blocks.some((block) => ["h1", "h2", "h3", "ex", "exhead"].includes(block.kind)),
  oneFigurePresenceOnly: page.blocks.filter((block) => block.kind === "fig").length === 1 && page.blocks[3].id === "fig-148",
  captionTextAndSharedBand: caption.kind === "cap" && lexical(caption.lines[0]) === "图148" && caption.samerow === true,
  footer176Separate: footer.kind === "foot" && footer.lines[0].replace(/[\s*•]/gu, "") === "176",
  paragraphFlagsLocallyAppropriate: comparisons.every((group) => page.blocks[group.candidateBlockIndex].cont === false && page.blocks[group.candidateBlockIndex].open === false),
  MDContainsAllJSONTextRows: comparisons.every((group) => page.blocks[group.candidateBlockIndex].lines.every((line) => pageMD.includes(`\n${line}\n`))),
  independentlyCountedPhysicalRows25: inventory.structure.independentPhysicalRowCount === 25 && page.meta.printed_lines === 25 && audit.lines_printed === 25 && audit.lines_md === 25,
};

const receiptNames = ["finalize-186", "vectorize-186", "first-svg-preview-fig-148"];
const nativeEvidence = receiptNames.map((name) => {
  const file = path.join(author, `native/${name}.receipt.json`);
  const receipt = readJSON(file);
  return {
    kind: name,
    binding: digest(file),
    recordedExitCode: receipt.exit_code,
    recordedInvocationOrdinal: receipt.invocation_ordinal ?? null,
    recordedSuccessful: receipt.exit_code === 0,
    reviewerReruns: 0,
    use: "Frozen mechanical receipt only; not a source-text, RAW-crop or SVG visual PASS.",
  };
});
const uninspectedAssets = freeze.files
  .filter((entry) => entry.path.includes("/figures/fig-148.") || entry.path.endsWith("/first-svg-preview/fig-148.png"))
  .map((entry) => ({ ...entry, hashAuthority: "author-freeze declaration only", bytesReadByThisReviewer: false, pixelsOpened: false, independentVisualVerdict: "HOLD" }));
const evidence = {
  schema: "source186-first-text-review-bindings@1",
  ticket: "STEMROBIN-181",
  reviewer: "same-resumed-SOURCE181-independent-reviewer",
  independentInventoryFrozenBeforeAuthorComparison: true,
  independentInventory: digest(inventoryPath),
  independentPrefreeze: digest(prefreezePath),
  authorFreeze: digest(freezePath),
  authorReport: digest(reportPath),
  inputBindings,
  comparisonPolicy: "Compare every independently read physical text row to the corresponding parsed author block. Punctuation/spacing normalization supports lexical comparison only and does not assert exact punctuation fidelity.",
  comparisons,
  wordDifferences,
  wordVerdict: wordDifferences.length === 0 ? "PASS" : "FAIL",
  definiteEmphasisComparison: {
    independentGroup: "s186-text-3",
    jsonPointer: "/blocks/8/lines/1",
    sourceDefiniteBoldPhrase: "任意两条",
    candidateLine: typographyCandidate,
    candidateHasRequiredBoldSpan: typographyCandidate.includes("**任意两条**"),
    verdict: typographyCandidate.includes("**任意两条**") ? "PASS" : "FAIL",
  },
  unresolvedTypography: inventory.uncertainties,
  structureChecks,
  structureVerdict: Object.values(structureChecks).every(Boolean) ? "PASS" : "HOLD",
  nativeEvidence,
  recordedAuthorFinalizeRuns: authorReport.native_finalize_runs,
  recordedAuthorVectorizeRuns: authorReport.native_vectorize_runs,
  recordedAuthorFirstSVGPreviewRuns: authorReport.first_svg_preview_runs,
  recordedNative25of25: audit.lines_printed === 25 && audit.lines_md === 25 && audit.errors.length === 0,
  uninspectedAssets,
  authorInventoryRead: false,
  RAWOrSVGOrGridBytesRead: false,
  actualImageOpens: 1,
  cumulativeImageOpens: 24,
  reviewerNativeRuns: 0,
  nativeReuseCount: 0,
};
const target = path.join(root, "bindings.json");
fs.writeFileSync(target, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(target, 0o444);
console.log(JSON.stringify({
  binding: digest(target),
  wordVerdict: evidence.wordVerdict,
  wordDifferences,
  definiteEmphasisComparison: evidence.definiteEmphasisComparison,
  structureVerdict: evidence.structureVerdict,
  structureChecks,
  nativeEvidence,
  uninspectedAssets,
}, null, 2));
