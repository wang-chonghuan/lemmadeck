import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = `${R}/.intentfold/tickets/STEMROBIN-181`;
const W = `${T}/tmp/d869-source235-bold-affected-review`;
const A = `${T}/tmp/d845-source235-first-author`;
const B = `${T}/tmp/d867-source235-bold-repair`;
const D = `${T}/tmp/d855-source235-first-independent-review`;
assert.equal(process.cwd(), R);
assert.equal(path.dirname(new URL(import.meta.url).pathname), W);
for (const name of ["report.json", "input-bindings.json", "mechanical-checks.json", "freeze.json"]) {
  assert.equal(fs.existsSync(`${W}/${name}`), false, `Preserve existing output: ${name}`);
}

const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const expectedInputs = [
  [B, "report.json", "675dd7f94846e70f4033e003e7580c1968a2717de06c372b8a6c897ea5d5e03d", "repair report"],
  [D, "report.json", "ed3caa93301b044886ed600d352fc76a6802dc1df30f8095e625bf93299690f0", "prior independent review"],
  [D, "freeze.json", "489cda00b06490d00931c395e257866451386975b988c588e19561a97a1ba1f3", "prior review freeze"],
  [D, "input-bindings.json", "7efb78258cbd160f57153e2b44983a7f2cb401d07c5cf86308fa148a0b99a61b", "prior exact input hashes"],
  [D, "mechanical-checks.json", "02b569571a72e800f9ed576609aa7c119c15b826a61b20121b93a336603b303a", "prior mechanical evidence"],
  [A, "freeze.json", "7e840e1738e34333282e6c1b9d96a15bdb1885ea6b749449a80bf751f9e27363", "baseline freeze"],
  [A, "root/10p/pages/0235/page.md", "5e9f8809e1d6c78115f7c553e98f9f2cebf6bcb85f7d1ff142ffcc85fe6a6ed5", "baseline Markdown"],
  [B, "root/10p/pages/0235/page.md", "286b139afc5dc0ddd01d6fa6d232667e62376a30635702832fd9e52bec9323be", "repaired Markdown"],
  [A, "root/10p/pages/0235/page.json", "ad179e277291e7a87a23909ab51fd99f58971a7e60c78cc6a46d7cebaf674d45", "baseline blocks"],
  [B, "root/10p/pages/0235/page.json", "2504861aa233eff2dd4a453e0331b705869dfd9654cf35e132522a0c74539289", "repaired blocks"],
  [B, "native/receipt.json", "fa64082b4900f6b75a8622f3bb81d0a10c2147c949656db2ab18b9a8129034eb", "existing repair receipt; hash only"],
  [D, "source-prose.crop.png", "b7417a41fe4419622f8be37ccfe95af8b6072292940be028f0e8c67850c48966", "original SOURCE235 prose pixels viewed"],
  [D, "source-tail.crop.png", "fee9df382c4ed902dd87b39d6ea8c1a061235b7605a5e29905f23a6a3cc1b339", "original SOURCE235 tail pixels viewed"],
  [A, "work/10p/pages/0235/page.png", "eb468dd93d626681de05163b5339ae1fd40aa015747d0b10fcaac3951f503c6e", "original SOURCE235 render; hash only"],
  [B, "work/10p/pages/0235/page.png", "eb468dd93d626681de05163b5339ae1fd40aa015747d0b10fcaac3951f503c6e", "repair SOURCE235 render; hash only"],
  [A, "work/10p/pages/0235/figures/fig-205.png", "f5e9a0dea51f55f80ad0c1c80e2bc08daa4540573208ef008e0436adbd23854a", "d855-passed RAW205; hash only"],
  [B, "work/10p/pages/0235/figures/fig-205.png", "f5e9a0dea51f55f80ad0c1c80e2bc08daa4540573208ef008e0436adbd23854a", "repair RAW205; hash only"],
  [A, "work/10p/pages/0235/figures/fig-205.svg", "0b680698bb64008a297800d8ce4b68d2f24cfafed25f0cb08a9f3ba4cfe4bf20", "d855-passed SVG205; hash only"],
  [B, "work/10p/pages/0235/figures/fig-205.svg", "0b680698bb64008a297800d8ce4b68d2f24cfafed25f0cb08a9f3ba4cfe4bf20", "repair SVG205; hash only"]
];
const snapshots = new Map();
const inputs = expectedInputs.map(([root, relative, expectedSha256, role]) => {
  const file = `${root}/${relative}`;
  assert.equal(fs.realpathSync(file).startsWith(`${R}/`), true);
  const bytes = fs.readFileSync(file);
  snapshots.set(file, bytes);
  return { path: file, role, bytes: bytes.length, sha256: sha(bytes), expectedSha256, matchesExpected: sha(bytes) === expectedSha256 };
});
const text = file => snapshots.get(file).toString("utf8");
const json = file => JSON.parse(text(file));
const prior = json(`${D}/report.json`);
const priorFreeze = json(`${D}/freeze.json`);
const priorBindings = json(`${D}/input-bindings.json`);
const repair = json(`${B}/report.json`);
const beforeMd = text(`${A}/root/10p/pages/0235/page.md`);
const afterMd = text(`${B}/root/10p/pages/0235/page.md`);
const beforeJsonText = text(`${A}/root/10p/pages/0235/page.json`);
const afterJsonText = text(`${B}/root/10p/pages/0235/page.json`);
const before = JSON.parse(beforeJsonText);
const after = JSON.parse(afterJsonText);
const spans = [
  { block: "p0235#3", index: 2, marker: "<!-- p -->", text: "\u4e0d\u540c\u969c\u788d\u7269\u7684\u884d\u5c04\u56fe\u6837", crop: `${D}/source-prose.crop.png` },
  { block: "p0235#7", index: 6, marker: "<!-- p open -->", text: "\u663e\u5fae\u955c\u548c\u671b\u8fdc\u955c\u7684\u5206\u8fa8\u672c\u9886", crop: `${D}/source-tail.crop.png` }
];
const checks = [];
const check = (name, passed, detail = null) => checks.push({ name, passed: Boolean(passed), detail });
check("all_input_exact_hashes", inputs.every(input => input.matchesExpected));
check("repair_report_paths_and_hashes", repair.original.path === `${A}/root/10p/pages/0235/page.md` && repair.candidate.path === `${B}/root/10p/pages/0235/page.md` && repair.FIRST.sha256 === inputs.find(input => input.path === `${D}/report.json`).sha256);
check("d855_report_bound_to_d855_freeze", priorFreeze.report.sha256 === inputs.find(input => input.path === `${D}/report.json`).sha256);
check("d855_input_bindings_bound_to_d855_freeze", priorFreeze.inputBindings.sha256 === inputs.find(input => input.path === `${D}/input-bindings.json`).sha256);
check("d855_mechanical_evidence_bound_to_d855_freeze", priorFreeze.files.find(file => file.path === `${D}/mechanical-checks.json`)?.sha256 === inputs.find(input => input.path === `${D}/mechanical-checks.json`).sha256);

let expectedMd = beforeMd;
let restoredMd = afterMd;
let restoredJsonText = afterJsonText;
const expectedJson = structuredClone(before);
for (const span of spans) {
  const needle = `${span.marker}\n${span.text}\u3000`;
  const replacement = `${span.marker}\n**${span.text}**\u3000`;
  check(`${span.block}_baseline_unique_exact_anchor`, beforeMd.split(needle).length === 2);
  check(`${span.block}_candidate_unique_exact_anchor`, afterMd.split(replacement).length === 2);
  expectedMd = expectedMd.replace(needle, replacement);
  restoredMd = restoredMd.replace(replacement, needle);
  restoredJsonText = restoredJsonText.replace(`**${span.text}**`, span.text);
  const originalLine = before.blocks[span.index].lines[0];
  expectedJson.blocks[span.index].lines[0] = originalLine.replace(span.text, `**${span.text}**`);
  check(`${span.block}_regular_prose_follows_bold`, after.blocks[span.index].lines[0].startsWith(`**${span.text}**\u3000`));
  check(`${span.block}_source_pixels_exact_prior_binding`, priorFreeze.files.find(file => file.path === span.crop)?.sha256 === inputs.find(input => input.path === span.crop).sha256);
}
check("markdown_exact_two_allowed_insertions", afterMd === expectedMd);
check("markdown_restored_byte_exact", restoredMd === beforeMd);
check("markdown_added_exactly_eight_ASCII_bytes", Buffer.byteLength(afterMd) - Buffer.byteLength(beforeMd) === 8);
check("markdown_exactly_four_added_bold_markers", (beforeMd.match(/\*\*/g) ?? []).length === 0 && (afterMd.match(/\*\*/g) ?? []).length === 4);
check("structured_JSON_exact_two_allowed_changes", JSON.stringify(after) === JSON.stringify(expectedJson));
check("structured_JSON_restored_byte_exact", restoredJsonText === beforeJsonText);
check("both_blocks_remain_prose_not_headings", spans.every(span => after.blocks[span.index].kind === "p"));
check("p0235_7_open_boundary_preserved", after.blocks[6].open === true && after.blocks[6].lines.at(-1).endsWith("\u56e0\u4e3a\u5149\u5e76\u4e0d\u662f\u4e25\u683c"));
check("all_other_prose_metadata_rows_and_markdown_unchanged", afterMd === expectedMd && restoredJsonText === beforeJsonText);
check("original_and_repair_SOURCE235_render_exact", inputs.find(input => input.path === `${A}/work/10p/pages/0235/page.png`).sha256 === inputs.find(input => input.path === `${B}/work/10p/pages/0235/page.png`).sha256 && priorBindings.candidateFiles.find(file => file.path === `${A}/work/10p/pages/0235/page.png`)?.sha256 === before.meta.render.sha256);
for (const extension of ["png", "svg"]) {
  const originalPath = `${A}/work/10p/pages/0235/figures/fig-205.${extension}`;
  const candidatePath = `${B}/work/10p/pages/0235/figures/fig-205.${extension}`;
  const originalHash = inputs.find(input => input.path === originalPath).sha256;
  const candidateHash = inputs.find(input => input.path === candidatePath).sha256;
  const priorHash = priorBindings.candidateFiles.find(file => file.path === originalPath)?.sha256;
  check(`fig205_${extension}_both_files_equal_exact_d855_hash`, originalHash === candidateHash && candidateHash === priorHash, { originalHash, candidateHash, priorHash });
}
check("d855_RAW205_PASS_reusable", prior.statuses.RAW205 === "PASS" && prior.raw205Checks.status === "PASS");
check("d855_SVG205_PASS_reusable", prior.statuses.SVG205 === "PASS" && prior.svg205Checks.status === "PASS");

const write = (name, value) => {
  assert.equal(path.basename(name), name);
  fs.writeFileSync(`${W}/${name}`, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx", mode: 0o600 });
};
for (const input of inputs) {
  check(`input_still_exact_at_freeze:${path.relative(T, input.path)}`, sha(fs.readFileSync(input.path)) === input.sha256);
}
const failures = checks.filter(check => !check.passed);
const status = failures.length === 0 ? "PASS" : "HOLD";
const frozenAt = new Date().toISOString();
const inputBindings = {
  schema: "d869-source235-bold-affected-input-bindings@1",
  cwd: R,
  ticketRoot: T,
  files: inputs,
  allExactHashesMatched: inputs.every(input => input.matchesExpected),
  checkedAgainBeforeFreeze: true,
  sourcePdfSha256MetadataOnly: before.meta.source.pdf_sha256,
  sourcePdfReopenedOrRehashed: false
};
const mechanical = {
  schema: "d869-source235-bold-affected-mechanical-checks@1",
  status,
  checks,
  failures,
  changedBlocks: spans.map(span => span.block),
  exactMarkdownDeltaBytes: Buffer.byteLength(afterMd) - Buffer.byteLength(beforeMd),
  exactJsonDeltaBytes: Buffer.byteLength(afterJsonText) - Buffer.byteLength(beforeJsonText),
  blockKinds: after.blocks.map(block => block.kind),
  rowsPerBlock: after.blocks.map(block => block.lines.length),
  printedRows: after.blocks.reduce((total, block) => total + block.lines.length, 0),
  nativeOrVectorCalls: 0
};
const report = {
  schema: "d869-source235-bold-affected-independent-review@1",
  reviewId: "d869",
  ticket: "STEMROBIN-181",
  successor: "181-3",
  mode: "bounded offline bold-only affected independent review",
  finish: "review",
  cwd: R,
  ticketRoot: T,
  writeRoot: W,
  frozenAt,
  status,
  statuses: {
    SOURCE235_BOLD_AFFECTED: status,
    SOURCE235_OTHER_PROSE_AND_MARKDOWN: status === "PASS" ? "UNCHANGED_D855_EVIDENCE_REUSED" : "HOLD",
    RAW205: status === "PASS" ? "PASS_REUSED_D855_EXACT_HASHES" : "HOLD",
    SVG205: status === "PASS" ? "PASS_REUSED_D855_EXACT_HASHES" : "HOLD",
    HISTORICAL_AUTHOR_BOUNDARY: "HOLD_NOT_WAIVED",
    COMPLETE_CARD: "NOT_REVIEWED"
  },
  summary: status === "PASS"
    ? "Only p0235#3 and p0235#7 gain source-matching bold lead-ins. Original rendered pixels confirm both exact strings and regular following prose. Markdown and structured JSON are otherwise byte-exact after removing those four added ** markers. RAW205/SVG205 retain exact d855-passed hashes. Historical author-boundary HOLD remains."
    : "Affected review HOLD; see mechanical-checks.json failures. No repair or broader approval.",
  independence: {
    authority: "Own visual inspection of the two hash-bound original SOURCE235 crops; own whole-candidate exact-byte and structured-block comparisons.",
    originalFullPageImageOpened: false,
    originalSourceCropImagesOpened: 2,
    candidateMarkdownReadBeforeOwnPixelInspection: true,
    notARepeatedFIRSTSourceInventory: true,
    authorInventoryUsedAsAuthority: false,
    priorSOURCEHOLDNotSilentlyReusedAsPASS: true
  },
  affectedFindings: spans.map(span => ({
    block: span.block,
    status,
    exactBoldText: span.text,
    sourcePixelEvidence: span.crop,
    observedOriginalBold: true,
    followingProseRegular: true,
    candidateEncoding: `**${span.text}**`,
    separatorOutsideBold: "U+3000",
    remainsParagraph: true,
    sourceObservation: "Original glyphs are blackface only for the lead-in; subsequent text is regular. The bold span ends before the paragraph separator."
  })),
  typographyFinding: {
    priorFinding: "D855-SOURCE-01",
    priorStatus: "HOLD",
    disposition: status === "PASS" ? "RESOLVED_ONLY_FOR_THE_TWO_AUTHORIZED_BOLD_SPANS" : "HOLD"
  },
  exactChangeChecks: {
    markdownAllowedInsertionsOnly: checks.find(check => check.name === "markdown_exact_two_allowed_insertions").passed,
    markdownRestoredByteExact: restoredMd === beforeMd,
    jsonRestoredByteExact: restoredJsonText === beforeJsonText,
    addedMarkdownBytes: Buffer.byteLength(afterMd) - Buffer.byteLength(beforeMd),
    otherProseMetadataMarkdownRowsBlockKindsAndOpenFlagsChanged: !(afterMd === expectedMd && restoredJsonText === beforeJsonText)
  },
  reusedEvidence: {
    d855Report: inputs.find(input => input.path === `${D}/report.json`),
    priorStatuses: prior.statuses,
    RAW205: {
      status: prior.raw205Checks.status,
      exactSha256: "f5e9a0dea51f55f80ad0c1c80e2bc08daa4540573208ef008e0436adbd23854a",
      originalAndRepairHashesVerified: true,
      originalAndRepairMatchD855Binding: true,
      newPixelComparisonOrImageOpen: false,
      priorChecks: prior.raw205Checks
    },
    SVG205: {
      status: prior.svg205Checks.status,
      exactSha256: "0b680698bb64008a297800d8ce4b68d2f24cfafed25f0cb08a9f3ba4cfe4bf20",
      originalAndRepairHashesVerified: true,
      newRasterOrVectorRun: false
    },
    nativeRepairReceipt: {
      binding: inputs.find(input => input.path === `${B}/native/receipt.json`),
      reuse: "Existing receipt hash matched the repair report; no native run or new native PASS claimed."
    },
    priorNativeReceiptsMetadata: prior.nativeFirstReusedNotRerun,
    priorFullTextRowsClassificationAndPageBoundary: "Reused only because the exact-byte checks establish no changes beyond the two allowed bold spans."
  },
  historicalAuthorBoundary: {
    ...prior.historicalAuthorBoundary,
    status: "HOLD - historical, not waived",
    reproducedByThisReviewer: false,
    broaderSOURCEOrCompleteCardApproval: false
  },
  sharedState: {
    notAlone: true,
    othersPreserved: true,
    wholeCheckoutUnchangedClaim: false,
    inputFilesUnmodifiedByReviewer: true,
    allBoundInputsStillExactAtFreeze: checks.filter(check => check.name.startsWith("input_still_exact_at_freeze:")).every(check => check.passed),
    writesOnlyUnder: W,
    canonicalIndicesMeterGitDatabasePublisherDeployBrowserOtherChatsTouched: false
  },
  usage: {
    imageBatches: 1,
    imageLoadsThisBatch: 2,
    imageLoadsThisContext: 2,
    imageLoadsThisReview: 2,
    maxImageLoadsPerBatch: 8,
    maxImageLoadsPerContext: 24,
    imageLoads: spans.map((span, index) => ({ sequence: index + 1, file: span.crop, role: `original SOURCE235 pixels for ${span.block}`, actualTool: "functions.view_image", detail: "original" })),
    imageReopens: 0,
    sourceDerivedCropLoads: 2,
    sourceCropDerivationCalls: 0,
    originalFullPageImageLoads: 0,
    raw205ImageLoads: 0,
    svg205ImageLoads: 0,
    source234ImageLoads: 0,
    source236ImageLoads: 0,
    source237ImageLoads: 0,
    source234ContentOpens: 0,
    source236ContentOpens: 0,
    source237ContentOpens: 0,
    adjacentPageNamesInSOURCE235MetadataDoNotConstituteAdjacentSourceOpens: true,
    execCommandsThroughFreeze: 19,
    commandWorkdirAlwaysExplicitR: true,
    missingPathLookupFailures: 2,
    readOnlyFileInventoryCommands: 3,
    metadataAndInstructionReadsIncludedInExecCount: true,
    preliminaryReadOnlyMechanicalCommands: 1,
    ownCheckAndFreezeScriptCalls: 1,
    applyPatchCalls: 1,
    multiToolParallelWrappers: 4,
    ownSuccessfulPixelInspectionCalls: 2,
    prepareCalls: 0,
    finalizeCalls: 0,
    vectorizeCalls: 0,
    rasterCalls: 0,
    assembleCalls: 0,
    externalPaidModelOrImageCalls: 0,
    imageGenerationCalls: 0,
    planeOrHelperCalls: 0,
    appOrDatabaseCalls: 0,
    publisherOrDeployCalls: 0,
    browserCalls: 0,
    gitCommands: 0,
    fullTestsOrBuildCalls: 0,
    canonicalCoreIndicesMeterModernAnswersChoicesWrites: 0,
    otherChatsOrDelegations: 0,
    hostModelCallCount: null,
    actualHostTokenUsage: null,
    actualHostBillingUsage: null,
    actualHostCost: null,
    exactReviewStartTimestamp: null,
    exactLocalFreezeTimestamp: frozenAt,
    unknownUsageReason: "Host model-call totals, token totals, billing and cost are not exposed by these tools. Unknown is not zero. d845/d855/d867 usage is not this review usage. No consolidated review-start clock was captured."
  },
  evidence: {
    exactInputHashes: "input-bindings.json",
    exactByteAndBlockChecks: "mechanical-checks.json",
    allOwnOutputHashBindings: "freeze.json"
  },
  limitations: [
    "Affected typography only, not an unrestricted SOURCE, complete-card, lesson-closure or publication approval.",
    "Original full page and PDF were not visually reopened; two frozen original rendered SOURCE235 crops were visually inspected.",
    "RAW205/SVG205 PASS reused from d855 after exact original/repair hash checks; no figure image opens, raster, native or vector reruns.",
    "Historical author-boundary HOLD and unknown deletion filenames remain unchanged and are not waived.",
    "Host token/billing/cost and exact review-start timestamp remain unknown.",
    "No SOURCE234/236/237 source opened or inferred; references already present in SOURCE235 metadata are preserved."
  ],
  failures,
  completeCard: false,
  stop: "Freeze only this affected review directory, return text/path/hashes, then stop."
};
write("input-bindings.json", inputBindings);
write("mechanical-checks.json", mechanical);
write("report.json", report);
const files = ["review.mjs", "input-bindings.json", "mechanical-checks.json", "report.json"].map(name => {
  const file = `${W}/${name}`;
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
});
const freeze = {
  schema: "d869-source235-bold-affected-review-freeze@1",
  cwd: R,
  writeRoot: W,
  frozenAt,
  status,
  statuses: report.statuses,
  inputFiles: inputs,
  files,
  permissions: { files: "0444", directories: "0555" },
  selfHash: "Returned by command, not recursively embedded.",
  scope: ["p0235#3 bold lead-in", "p0235#7 bold lead-in", "exact unchanged d855 RAW205/SVG205 evidence reuse"],
  stop: report.stop
};
write("freeze.json", freeze);
for (const file of [...files, { path: `${W}/freeze.json` }]) fs.chmodSync(file.path, 0o444);
fs.chmodSync(W, 0o555);
for (const file of files) {
  assert.equal(sha(fs.readFileSync(file.path)), file.sha256);
  assert.equal(fs.statSync(file.path).mode & 0o777, 0o444);
}
assert.equal(fs.statSync(`${W}/freeze.json`).mode & 0o777, 0o444);
assert.equal(fs.statSync(W).mode & 0o777, 0o555);
console.log(JSON.stringify({
  status,
  historicalAuthorBoundary: report.statuses.HISTORICAL_AUTHOR_BOUNDARY,
  report: files.find(file => file.path === `${W}/report.json`),
  freeze: { path: `${W}/freeze.json`, sha256: sha(fs.readFileSync(`${W}/freeze.json`)) },
  candidateSha256: inputs.find(input => input.path === `${B}/root/10p/pages/0235/page.md`).sha256,
  raw205Sha256: report.reusedEvidence.RAW205.exactSha256,
  inputCount: inputs.length,
  checkCount: checks.length,
  failures,
  actualImageLoads: report.usage.imageLoadsThisContext,
  nativeCalls: 0,
  vectorCalls: 0,
  outputHashesAndPermissionsVerified: true,
  stopped: true
}, null, 2));
