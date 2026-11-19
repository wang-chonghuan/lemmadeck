import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181");
const O = path.join(T, "tmp/d883-source236-first-independent-review");
const A = path.join(T, "tmp/d860-source236-first-author");
const C = path.join(T, "tmp/d870-source236-punctuation-repair");
const expectedReportHash =
  "1702752713881fa65daf20f544b3a4e52593f7b28d7cb99db6822786359c0266";
assert.equal(process.cwd(), R);

const sha = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");
const json = (file) => JSON.parse(readFileSync(file, "utf8"));
const put = (name, value) => {
  const file = path.join(O, name);
  assert.equal(existsSync(file), false, `Preserve existing output: ${file}`);
  writeFileSync(
    file,
    typeof value === "string"
      ? value
      : `${JSON.stringify(value, null, 2)}\n`,
    { flag: "wx" },
  );
};
assert.equal(sha(path.join(C, "FIRST/report.json")), expectedReportHash);

const verified = new Map();
const verifyHash = (file, expected) => {
  const actual = verified.has(file) ? verified.get(file) : sha(file);
  assert.equal(actual, expected, `Frozen input mismatch: ${file}`);
  verified.set(file, actual);
};
const freezes = [];
for (const root of [A, C]) {
  const file = path.join(root, "FIRST/freeze.json");
  const manifest = json(file);
  const entries = Object.entries(manifest.hashes);
  for (const [relative, expected] of entries) {
    const absolute = path.resolve(R, relative);
    assert.ok(absolute.startsWith(`${root}/`));
    verifyHash(absolute, expected);
  }
  freezes.push({
    path: file,
    sha256: sha(file),
    status: manifest.status,
    entries: entries.length,
    allEntriesMatch: true,
  });
}

const candidate = path.join(C, "root/10p/pages/0236");
const pageMd = path.join(candidate, "page.md");
const pageJson = path.join(candidate, "page.json");
const auditFile = path.join(candidate, "audit.json");
const page = json(pageJson);
const audit = json(auditFile);
const nativeFile = path.join(C, "FIRST/finalize.receipt.json");
const native = json(nativeFile);
const stdout = path.join(C, "FIRST/finalize.stdout.txt");
const stderr = path.join(C, "FIRST/finalize.stderr.txt");
verifyHash(stdout, native.stdoutSha256);
verifyHash(stderr, native.stderrSha256);
assert.equal(native.exit, 0);
assert.equal(native.cwd, R);
assert.equal(native.repairedTextUnchangedByNative, true);
assert.equal(audit.lines_printed, 26);
assert.equal(audit.lines_md, 26);
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.normalizations, []);
assert.deepEqual(audit.unknown_chars, []);
assert.deepEqual(audit.katex_warnings, []);
assert.equal(page.meta.book, "10p");
assert.equal(page.meta.page, 236);
assert.equal(page.meta.printed_page, 226);
assert.equal(page.meta.printed_lines, 26);

const source = path.join(C, "work/10p/pages/0236/page.png");
verifyHash(source, page.meta.render.sha256);
const pdf = path.join(
  R,
  "ssot-resources/soviet10year-textbooks/sources/soviet10years",
  page.meta.source.pdf,
);
verifyHash(pdf, page.meta.source.pdf_sha256);
assert.equal(page.meta.source.pdf_page, 236);

const baselineFile = path.join(A, "artifacts/10p/pages/0236/page.md");
const beforeCopy = path.join(C, "FIRST/page.before.md");
assert.equal(sha(beforeCopy), sha(baselineFile));
const baselineChars = Array.from(readFileSync(baselineFile, "utf8"));
const candidateChars = Array.from(readFileSync(pageMd, "utf8"));
assert.equal(baselineChars.length, candidateChars.length);
const changes = [];
for (let i = 0; i < candidateChars.length; i += 1) {
  if (baselineChars[i] !== candidateChars[i]) {
    assert.equal(baselineChars[i], "\u3002");
    assert.equal(candidateChars[i], "\u002e");
    changes.push({
      unicodeScalarIndex0: i,
      from: "U+3002",
      to: "U+002E",
      context: candidateChars.slice(Math.max(0, i - 8), i + 9).join(""),
    });
  }
}
assert.equal(changes.length, 6);
assert.equal(
  sha(path.join(C, "FIRST/page.repaired-before-native.md")),
  sha(pageMd),
);

const baselinePage = json(path.join(A, "artifacts/10p/pages/0236/page.json"));
const repairedLocations = [
  { block: 1, line: 3, row: 3, after: "部分" },
  { block: 1, line: 4, row: 4, after: "情况" },
  { block: 2, line: 1, row: 5, after: "限制" },
  { block: 2, line: 3, row: 7, after: "组" },
  { block: 2, line: 4, row: 8, after: "光点" },
  { block: 2, line: 6, row: 10, after: "决定" },
];
const locations = new Map(
  repairedLocations.map((location) => [
    `${location.block}:${location.line}`,
    location,
  ]),
);
assert.deepEqual(page.meta, baselinePage.meta);
assert.equal(page.blocks.length, 9);
assert.equal(page.blocks.length, baselinePage.blocks.length);
for (let b = 0; b < page.blocks.length; b += 1) {
  const { lines: oldLines, ...oldRest } = baselinePage.blocks[b];
  const { lines: newLines, ...newRest } = page.blocks[b];
  assert.deepEqual(newRest, oldRest);
  assert.equal(newLines.length, oldLines.length);
  for (let l = 0; l < newLines.length; l += 1) {
    const location = locations.get(`${b + 1}:${l + 1}`);
    const expected = location
      ? oldLines[l].replace(`${location.after}。`, `${location.after}.`)
      : oldLines[l];
    assert.equal(newLines[l], expected);
  }
}

// This table comes from the source-first pixel inventory, not candidate text.
const inventoryFile = path.join(O, "original-first-inventory.md");
const inventory = readFileSync(inventoryFile, "utf8");
const sourceRows = Array.from(
  inventory.matchAll(/^\| (\d{2}) \| (.*) \|$/gm),
  (match) => ({ row: Number(match[1]), sourceText: match[2] }),
);
assert.equal(sourceRows.length, 26);
const plain = (text) => text.replaceAll("**", "").replace(/[ \u3000]/g, "");
const footerPlain = (text) => plain(text).replaceAll("·", "•");
const rows = [];
for (let b = 0; b < page.blocks.length; b += 1) {
  const block = page.blocks[b];
  if (block.kind === "fig") continue;
  for (let l = 0; l < block.lines.length; l += 1) {
    const sourceRow = sourceRows[rows.length];
    const candidateText = block.lines[l];
    const comparableSource = block.kind === "foot"
      ? footerPlain(sourceRow.sourceText)
      : plain(sourceRow.sourceText);
    const comparableCandidate = block.kind === "foot"
      ? footerPlain(candidateText)
      : plain(candidateText);
    rows.push({
      row: sourceRow.row,
      sourceRef: `p0236#${b + 1}`,
      block: b + 1,
      line: l + 1,
      kind: block.kind,
      smallType: block.label === "small",
      sourceText: sourceRow.sourceText,
      candidateText,
      textComparison: comparableSource === comparableCandidate ? "PASS" : "HOLD",
      review: "one full pixel-to-candidate row comparison",
      findings: [],
    });
  }
}
assert.equal(rows.length, 26);
const defects = [
  {
    id: "S236-F01",
    severity: "source-fidelity",
    row: 14,
    sourceRef: "p0236#3",
    line: 4,
    field: "body and matching metadata note",
    candidate: "正确的",
    source: "准确的",
    candidateCodepoint: "正 U+6B63",
    sourceCodepoint: "准 U+51C6",
    reason: "The bold source conclusion reads 才是准确的, not 才是正确的. Metadata repeats the same wrong source reading.",
    evidence: path.join(O, "original-middle-detail.png"),
  },
  {
    id: "S236-F02",
    severity: "source-fidelity",
    row: 15,
    sourceRef: "p0236#5",
    line: 1,
    field: "body",
    candidate: "奥古斯丁",
    source: "奥古斯汀",
    candidateCodepoint: "丁 U+4E01",
    sourceCodepoint: "汀 U+6C40",
    reason: "The printed name has the water radical: 汀. Retain the source spelling, regardless of another conventional transliteration.",
    evidence: path.join(O, "original-middle-detail.png"),
  },
];
const remainingStops = [
  [12, 3, 2, "近似性质"],
  [14, 3, 4, "的", "candidate after 正确的; source after 准确的"],
  [16, 5, 2, "物理学家"],
  [17, 5, 3, "基础"],
  [18, 5, 4, "定量理论"],
  [19, 6, 1, "证实"],
  [21, 6, 3, "意义"],
  [24, 8, 2, "础的"],
  [25, 8, 3, "）", "after the 图206 reference"],
];
for (let i = 0; i < remainingStops.length; i += 1) {
  const [row, block, line, after, note] = remainingStops[i];
  assert.ok(rows[row - 1].candidateText.replaceAll("**", "").includes(`${after}。`));
  defects.push({
    id: `S236-F${String(i + 3).padStart(2, "0")}`,
    severity: "source-punctuation",
    row,
    sourceRef: `p0236#${block}`,
    line,
    field: "body",
    after,
    note: note ?? null,
    candidate: "。",
    source: ".",
    candidateCodepoint: "U+3002",
    sourceCodepoint: "U+002E",
    reason: "The original has a filled printed stop, not the hollow Chinese full stop used in the candidate.",
    evidence: path.join(
      O,
      row <= 18 ? "original-middle-detail.png" : "original-lower-detail.png",
    ),
  });
}
for (const defect of defects) rows[defect.row - 1].findings.push(defect.id);
for (const row of rows) {
  assert.equal(row.textComparison === "HOLD", row.findings.length > 0);
  row.typographyComparison = "PASS";
  row.status = row.findings.length ? "HOLD" : "PASS";
}
assert.equal(defects.length, 11);
assert.equal(rows.filter((row) => row.status === "HOLD").length, 10);
assert.equal(rows.filter((row) => row.status === "PASS").length, 16);
assert.equal(rows[0].candidateText.includes("模糊的。"), true);
assert.equal(
  rows.map((row) => row.candidateText).join("").match(/。/g).length,
  10,
);

assert.deepEqual(page.blocks.map((block) => [block.kind, block.label]), [
  ["p", null], ["p", null], ["p", null], ["fig", null],
  ["p", "small"], ["p", "small"], ["h3", null], ["p", null],
  ["foot", null],
]);
assert.deepEqual(page.blocks.map((block) => block.lines.length), [
  4, 6, 4, 0, 4, 3, 1, 3, 1,
]);
const expectedBold = [
  "几何光学的应用范围",
  "只有在光传播的路程上的障碍物的大小远远大于光波的长度时，光的直线传播定律和几何光学的其它各定律才是正确的",
  "光波的横向性",
  "衍射光栅",
  "不透明的",
];
const actualBold = Array.from(
  page.blocks.map((block) => block.lines.join("")).join("").matchAll(/\*\*(.*?)\*\*/g),
  (match) => match[1],
);
assert.deepEqual(actualBold, expectedBold);
assert.equal(page.blocks[0].cont, true);
assert.equal(page.blocks[0].open, false);
assert.equal(page.blocks[7].open, true);
const incomingTail = "因为光并不是严格";
const incomingStart = "地直线传播";
const outgoingTail = "好的光栅是利用专门的刻划机";
assert.ok(page.blocks[0].lines[0].startsWith(incomingStart));
assert.ok(page.blocks[7].lines.at(-1).endsWith(outgoingTail));
assert.equal(`${incomingTail}${incomingStart}`, "因为光并不是严格地直线传播");

const portrait = path.join(
  C,
  "work/10p/pages/0236/figures/tbl-p0236-01.png",
);
const figure = page.blocks[3];
assert.equal(figure.id, "tbl-p0236-01");
assert.equal(figure.label, null);
assert.equal(figure.owner_exercise, null);
assert.deepEqual(figure.box, [926, 1197, 317, 443]);
assert.equal(audit.figures.length, 1);
assert.deepEqual(audit.figures[0].box, figure.box);
assert.equal(sha(portrait), "96e76c45711addcd4cdf619cb47bb3192328aa4619000608c8517ec7eee9e82a");
assert.equal(page.blocks.filter((block) => block.kind === "ex").length, 0);
assert.equal(page.blocks.filter((block) => block.kind === "cap").length, 0);
assert.equal(page.blocks.filter((block) => block.label === "small").length, 2);
assert.equal(page.blocks.filter((block) => block.label === "smallmath").length, 0);
assert.equal(rows.some((row) => /[$↵]/u.test(row.candidateText)), false);
assert.equal(rows.map((row) => row.candidateText).join("").includes("207"), false);

const originalAuthor = json(path.join(A, "FIRST/report.json"));
const repairAuthor = json(path.join(C, "FIRST/report.json"));
assert.equal(originalAuthor.status, "HOLD_AUTHOR_CONTENT_FAILURE");
assert.equal(originalAuthor.independentReview, false);
assert.equal(originalAuthor.sourceApproval, false);
assert.equal(repairAuthor.independentReview, false);
assert.equal(repairAuthor.sourceApproval, false);

const inputReceipt = {
  schema: "source-review-input-verification@1",
  root: R,
  originalAuthorFreeze: freezes[0],
  repairedAuthorFreeze: freezes[1],
  verifiedFrozenFileCount: verified.size - 1,
  sourcePdf: { path: pdf, sha256: sha(pdf), page: 236, noRenderingReplay: true },
  hashes: Object.fromEntries(verified),
  observations: {
    boundRepairReportHashMatched: true,
    bothFrozenManifestsAllEntriesMatched: true,
    exactSixScalarSubstitutionsOnly: true,
    allOtherMetadataFlagsGeometryAndTextUnchangedByRepair: true,
    noNativeReplay: true,
  },
};
put("input-verification.json", inputReceipt);
put("exact-six-repair.json", {
  status: "PASS",
  scope: "six author repair substitutions only, not whole-page SOURCE approval",
  baseline: { path: baselineFile, sha256: sha(baselineFile) },
  candidate: { path: pageMd, sha256: sha(pageMd) },
  substitutions: changes,
  rowLocations: repairedLocations,
  hollowStopAfter模糊的: { codepoint: "U+3002", preserved: true },
  onlySixCharactersChanged: true,
  unaffectedFieldsAndBytesPreserved: true,
  fullPageVerdict: "HOLD",
});
put("row-review.json", {
  schema: "source-page-independent-row-review@1",
  status: "HOLD",
  root: R,
  physicalPage: 236,
  sourceSha256: sha(source),
  candidateSha256: sha(pageMd),
  comparisonPolicy: {
    candidateTextRetainedExactly: true,
    sourceTextFromIndependentPixelInventory: true,
    ignoredForGlyphComparison: [
      "Markdown bold delimiters, reviewed separately",
      "proportional typesetting spaces, U+0020/U+3000",
    ],
    footerOrnaments: "Both source dots are filled page ornaments; U+2022 candidate bullets accepted. No literal source Unicode identity is claimed from pixels.",
    lineBreaksAndPunctuationNotNormalized: true,
  },
  rowsReviewed: 26,
  fullComparisonPasses: 1,
  glyphTextPassRows: 16,
  glyphTextHoldRows: 10,
  all26RowsAccountedFor: true,
  all26TypographyAndBlockRolesReviewed: true,
  rows,
  findings: defects,
});

const loads = [
  { order: 1, path: source, kind: "original full page before candidate content" },
  {
    order: 2,
    path: path.join(A, "FIRST/original-punctuation-detail.png"),
    kind: "existing unmasked top source detail; exact six glyph confirmation",
  },
  {
    order: 3,
    path: path.join(O, "original-middle-detail.png"),
    kind: "targeted unmasked source detail, rows 11-18",
  },
  {
    order: 4,
    path: path.join(O, "original-lower-detail.png"),
    kind: "targeted unmasked source detail, rows 19-25",
  },
  { order: 5, path: portrait, kind: "existing native portrait crop comparison" },
].map((load) => ({ ...load, batch: 1, sha256: sha(load.path) }));
const report = {
  schema: "source-page-first-independent-review@1",
  assignment: "STEMROBIN-181 successor181-3 d883 FIRST independent SOURCE236 full26-row SOURCE review",
  root: R,
  ownedWriteRoot: O,
  recordedAt: new Date().toISOString(),
  book: "10p",
  physicalPage: 236,
  printedPage: 226,
  gate: "SOURCE",
  status: "HOLD",
  sourceStatus: "SOURCE_HOLD",
  sourceApproval: false,
  independentReview: true,
  firstIndependentFullPageReview: true,
  priorIndependentPassExists: false,
  selfCertification: false,
  completeCard: false,
  independentInventoryBeforeCandidateContent: true,
  source: {
    pdf: { path: pdf, sha256: sha(pdf), physicalPage: 236 },
    page: { path: source, sha256: sha(source), dimensions: [1536, 2337] },
    pagePixelsNotAltered: true,
    frozenSourceInputsVerified: true,
    noSource237ReadOrReopen: true,
  },
  bindings: {
    originalAuthor: {
      report: path.join(A, "FIRST/report.json"),
      reportSha256: sha(path.join(A, "FIRST/report.json")),
      freeze: freezes[0],
      originalStatus: originalAuthor.status,
      independentReview: false,
      sourceApproval: false,
      originalHoldReason: originalAuthor.failure.reason,
      originalHistoryPreservedWithoutReclassification: true,
    },
    currentRepairAuthor: {
      report: path.join(C, "FIRST/report.json"),
      reportSha256: sha(path.join(C, "FIRST/report.json")),
      expectedReportSha256: expectedReportHash,
      boundHashMatched: true,
      freeze: freezes[1],
      originalStatus: repairAuthor.status,
      independentReview: false,
      sourceApproval: false,
    },
    candidate: {
      pageMd: { path: pageMd, sha256: sha(pageMd) },
      pageJson: { path: pageJson, sha256: sha(pageJson) },
      audit: { path: auditFile, sha256: sha(auditFile) },
    },
  },
  review: {
    rowsIndependentlyInventoried: 26,
    rowsComparedToCandidate: 26,
    fullPageComparisonPasses: 1,
    rowCoverage: "26/26",
    glyphTextPassRows: 16,
    glyphTextHoldRows: 10,
    omittedOrInventedRows: 0,
    blocks: 9,
    textualBlocks: 8,
    allRowBlocksAndTypographyChecked: true,
    typography: {
      inlineBoldTopicNotSeparateHeading: true,
      conclusionBoldSpan: "row12 只有 through row14 source 准确的; span retained, candidate wording wrong",
      smallProseBlocks: 2,
      smallPrintedRows: 7,
      boldSmallLabel: "光波的横向性",
      heading: "89. 衍射光栅",
      boldUnit89Terms: ["衍射光栅", "不透明的"],
      noBoldRangeDefectFound: true,
    },
    formulas: {
      count: 0,
      mathematicalDelimiters: 0,
      smallmath: 0,
      datesNotMisclassifiedAsMath: true,
    },
    captionCount: 0,
    exerciseCount: 0,
    footnoteCount: 0,
    footer: "filled ornaments with printed 226; U+2022 transcription accepted",
    contentGlyphDefects: 2,
    remainingFilledStopDefects: 9,
    findingsCount: 11,
    findings: defects,
    metadataNoteDrift: "The author note also says 正确的 rather than the pixel reading 准确的; recorded under S236-F01.",
    detailsDoNotConstituteAnotherFullPagePass: true,
    externalKnowledgeNotUsedToCorrectOrInferSource: true,
  },
  exactSixRepair: {
    status: "PASS",
    changesCount: 6,
    from: "U+3002",
    to: "U+002E",
    rows: repairedLocations,
    glyphsConfirmedFromPixels: true,
    hollowStopAfter模糊的Preserved: true,
    noOtherCandidateBytesChanged: true,
    evidence: path.join(O, "exact-six-repair.json"),
    doesNotClearFullPageHold: true,
  },
  native: {
    status: "PASS_REUSED",
    linesPrinted: 26,
    linesMd: 26,
    auditErrors: [],
    normalizations: 0,
    receipt: nativeFile,
    receiptSha256: sha(nativeFile),
    exit: native.exit,
    stdout: { path: stdout, sha256: sha(stdout) },
    stderr: { path: stderr, sha256: sha(stderr) },
    finalizeInvocationsThisReview: 0,
    vectorizeInvocationsThisReview: 0,
    reprepareInvocationsThisReview: 0,
    nativeCountNotUsedAsSourceFidelityApproval: true,
  },
  ownership: {
    unnumberedPortrait: {
      id: figure.id,
      path: portrait,
      sha256: sha(portrait),
      box: figure.box,
      sourceOwner: "adjacent 菲涅耳 biography, p0236#5 and p0236#6",
      cropStatus: "PASS",
      allSourcePortraitElementsPreserved: true,
      noAdjacentTextOrCaptionContamination: true,
      noInventedCaptionNumberOrExerciseOwner: true,
      rawAssetOnlyNoModernApproval: true,
    },
    RAW206: "text reference only; no owned figure on SOURCE236",
    RAW207: "absent from SOURCE236 text and owned figures",
    namedOwnedRawTargets: [],
    noInferenceAboutSource237: true,
  },
  boundaries: {
    incomingProvidedSourceRef: "p0235#7",
    incomingProvidedFlag: "open",
    incomingProvidedExactTail: incomingTail,
    ownIncomingSourceRef: "p0236#1",
    ownIncomingFlag: "cont",
    ownIncomingExactStart: incomingStart,
    literalIncomingJoin: `${incomingTail}${incomingStart}`,
    incomingJoinStatus: "PASS_SUPPLIED_TEXT_ONLY",
    source235ReadOrReapproved: false,
    ownOutgoingSourceRef: "p0236#8",
    ownOutgoingFlag: "open",
    ownOutgoingExactTail: outgoingTail,
    closure: false,
    nextSourceRef: null,
    noSource237OpenedOrInferred: true,
  },
  history: {
    d860: "author self HOLD, not an independent review and not a prior PASS",
    d870: "six-character author repair complete only, not full-page reapproval",
    d883: "first independent full26-row SOURCE verdict HOLD; exact-six affected comparison PASS",
    noFailedAuthorReceiptErasedOrReplaced: true,
  },
  usage: {
    imageLoadsThisContext: 5,
    imageLoadsInherited: 0,
    imageLoadsCumulativeInContext: 5,
    batches: 1,
    maximumImagesInBatch: 5,
    batchLimit: 8,
    contextLimit: 24,
    loads,
    newDiagnosticImageGenerationInvocations: 1,
    newDiagnosticFiles: 2,
    imageMasking: false,
    nativeReplays: 0,
    contentRepairAttemptsThisReview: 0,
    paidCallsThisReview: 0,
    hostUsage: "unknown",
    nativeInternalImageOpenUsage: "not replayed; historical calls not separately instrumented",
  },
  evidence: {
    inventory: inventoryFile,
    inputVerification: path.join(O, "input-verification.json"),
    exactSixRepair: path.join(O, "exact-six-repair.json"),
    fullRowReview: path.join(O, "row-review.json"),
    detailsProvenance: path.join(O, "source-details-provenance.json"),
    freeze: path.join(O, "freeze.json"),
  },
  stop: {
    noRepairs: true,
    noCanonicalIndexMeterGitDatabasePublisherDeployOrBrowser: true,
    noOtherChatsOrWorkers: true,
    noSource237Reopen: true,
    noAssemblyAdaptationRenderingOrProductionFollowOn: true,
    onlyOwnedWriteRootUsed: true,
    othersWorkPreserved: true,
    stoppedAfterFrozenTextPathsAndHashes: true,
  },
};
put("report.json", report);
put("report.md", `# d883 FIRST Independent SOURCE236: HOLD

Root: ${R}
Write root: ${O}

All 26 original rows were independently inventoried and compared once.
Native 26/26 is hash-verified and reused, with no finalize/vectorize replay.
Text-glyph result: 16 PASS rows, 10 HOLD rows. Coverage is complete; no missing
or invented line was found.

## Findings

1. Row 14, p0236#3 line 4: source **准确的**, candidate **正确的**.
   The metadata note repeats the candidate's incorrect reading.
2. Row 15, p0236#5 line 1: source **奥古斯汀**, candidate **奥古斯丁**.
3. Nine filled source stops remain U+3002 instead of U+002E:
   rows 12, 14, 16, 17, 18, 19, 21, 24 and 25.

The exact six d870 U+3002 -> U+002E substitutions PASS independently.
The hollow U+3002 after 模糊的 is retained correctly. No other candidate bytes
were changed by that repair; neither observation clears the full-page HOLD.

Inline heading/bold ranges, seven small-type biography lines, unit heading 89,
the page footer, no-formula/no-caption facts and the unnumbered portrait were
reviewed. The existing portrait PNG is complete and clean. RAW206 is only a
text reference on this page; RAW207 is absent. No vector replay was made.

Incoming supplied join: 因为光并不是严格 -> 地直线传播 =
因为光并不是严格地直线传播.
Outgoing open suffix: 好的光栅是利用专门的刻划机.
This is not closure or a complete-card approval. SOURCE235 pixels and SOURCE237
were not opened; no next-page identity or ownership was inferred.

Original d860 HOLD_AUTHOR_CONTENT_FAILURE and d870 author-only status remain
unchanged and hash-verified. d883 is the first independent full-page verdict,
not an affected-only continuation of a nonexistent independent PASS.

Usage: 5 image loads, one batch (5 <= 8; context 5 <= 24), two unmasked
diagnostic crops generated in one invocation; 0 paid calls, 0 native replays,
0 content repairs. Host usage is unknown. All writes are in the stated root.

Evidence: report.json, row-review.json, exact-six-repair.json,
original-first-inventory.md, input-verification.json,
source-details-provenance.json and freeze.json.
`);

// Recheck only bound immutable inputs at freeze, not the page's content again.
const criticalInputs = [pageMd, pageJson, auditFile, source, portrait,
  path.join(A, "FIRST/report.json"), path.join(C, "FIRST/report.json")];
for (const file of criticalInputs) {
  assert.equal(sha(file), verified.get(file));
}
const outputFiles = readdirSync(O).sort().map((name) => path.join(O, name));
assert.ok(outputFiles.every((file) => statSync(file).isFile()));
const outputHashes = Object.fromEntries(outputFiles.map((file) => [file, sha(file)]));
put("freeze.json", {
  schema: "source-page-first-independent-review-freeze@1",
  recordedAt: new Date().toISOString(),
  root: R,
  ownedWriteRoot: O,
  status: "HOLD",
  gate: "SOURCE",
  sourceApproval: false,
  independentReview: true,
  physicalPage: 236,
  reportSha256: outputHashes[path.join(O, "report.json")],
  hashes: outputHashes,
  originalAuthorHistoryPreserved: true,
  frozenInputBindings: {
    d860Report: sha(path.join(A, "FIRST/report.json")),
    d860Freeze: freezes[0].sha256,
    d870Report: expectedReportHash,
    d870Freeze: freezes[1].sha256,
    candidatePageMd: sha(pageMd),
    candidatePageJson: sha(pageJson),
    nativeAudit: sha(auditFile),
    sourcePage: sha(source),
  },
  fullRowReviewPasses: 1,
  permissions: "All d883 output files chmod 0444; no input permissions changed.",
});
for (const name of readdirSync(O)) chmodSync(path.join(O, name), 0o444);
console.log(JSON.stringify({
  status: report.status,
  rowsReviewed: 26,
  passRows: 16,
  holdRows: 10,
  findings: 11,
  exactSixRepair: "PASS",
  native: "26/26 reused",
  frozenFiles: readdirSync(O).length,
  frozenInputFiles: verified.size,
  paths: {
    report: path.join(O, "report.json"),
    rowReview: path.join(O, "row-review.json"),
    freeze: path.join(O, "freeze.json"),
  },
  hashes: {
    report: sha(path.join(O, "report.json")),
    rowReview: sha(path.join(O, "row-review.json")),
    freeze: sha(path.join(O, "freeze.json")),
    candidate: sha(pageMd),
    d870Report: expectedReportHash,
  },
}, null, 2));
