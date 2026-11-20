const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const t = require("./review-tools.cjs");
const base = ".intentfold/tickets/STEMROBIN-188/tmp/";
const oldRoot = path.resolve(t.repo, base + "source235237-FIRST-review-01");
const repairRoot = path.resolve(t.repo, base + "source236-theorem-repair-02");
const oldPage = path.resolve(t.repo, base + "source235236-author/artifacts/9-10g/pages/0236");
const newPage = path.join(repairRoot, "artifacts/9-10g/pages/0236");
const firstPath = path.join(oldRoot, "FIRST-p0236.json");
const priorReportPath = path.join(oldRoot, "report.json");
const intakePath = path.resolve(t.repo, base + "source235237-n48figure27-review-inputs-01/blind-intake.json");
const prepPath = path.resolve(t.repo, base + "source236-theorem-focused-01/preparation.json");
const failedPrepPath = path.resolve(t.repo, base + "source236-theorem-focused-FIRSTFAIL.json");
const repairPath = path.join(repairRoot, "repair.json");
const resultPath = path.join(repairRoot, "result.json");
const commandPath = path.join(repairRoot, "finalize.command.json");
const first = t.json(firstPath);
const priorReport = t.json(priorReportPath);
const intake = t.json(intakePath);
const prep = t.json(prepPath);
const failedPrep = t.json(failedPrepPath);
const repair = t.json(repairPath);
const result = t.json(resultPath);
const command = t.json(commandPath);
const prior = t.json(path.join(oldPage, "page.json"));
const current = t.json(path.join(newPage, "page.json"));
const priorMd = t.read(path.join(oldPage, "page.md")).toString();
const currentMd = t.read(path.join(newPage, "page.md")).toString();
const priorAudit = t.json(path.join(oldPage, "audit.json"));
const currentAudit = t.json(path.join(newPage, "audit.json"));
const oldObservation = first.blocks.find((b) => b.id === "own-p236-theorem40").text;
const actualOriginal = intake.sourcePages.find((p) => p.page === 236).original;
const correctOriginalSha256 = "19847cc4db645d1776634e425789e6f0ecd2e2779617eb89be5fbe1bbf739c9b";
assert.equal(actualOriginal.sha256, correctOriginalSha256);
assert.equal(t.digest(t.read(actualOriginal.path)), correctOriginalSha256);
assert.equal(prep.sourceSha256, correctOriginalSha256);
assert.equal(prep.source, actualOriginal.path);
assert.equal(first.sourceSha256.length, 70);
assert.equal(first.sourceSha256.endsWith("fed86a2"), true);
assert.notEqual(first.sourceSha256, correctOriginalSha256);
assert.equal(failedPrep.cropFilesCreated, 0);
assert.equal(failedPrep.imagesOpened, 0);
assert.equal(failedPrep.scientificVerdict, null);
const existingCorrectBinding = priorReport.inputBindings.find((b) => b.path === actualOriginal.path);
assert.equal(existingCorrectBinding.sha256Before, correctOriginalSha256);
assert.equal(existingCorrectBinding.sha256After, correctOriginalSha256);
assert.equal(oldObservation, "定理40. 计算半径是R的球体的体积的公式是：");
assert.equal(prior.blocks.length, 9);
assert.equal(current.blocks.length, 9);
const beforeNoun = "定理40. 计算半径是$R$的球的体积的公式是：";
const afterNoun = "定理40. 计算半径是$R$的球体的体积的公式是：";
assert.equal(prior.blocks[5].lines[0], beforeNoun);
assert.equal(current.blocks[5].lines[0], afterNoun);
assert.equal(current.blocks[5].lines[1], prior.blocks[5].lines[1]);
const expectedBlock = structuredClone(prior.blocks[5]);
expectedBlock.lines[0] = afterNoun;
assert.deepEqual(current.blocks[5], expectedBlock);
assert.deepEqual(current.meta, prior.meta);
const unchangedBlocks = prior.blocks.map((b, i) => ({
  ref: "p0236#" + (i + 1),
  sha256Before: t.digest(Buffer.from(JSON.stringify(b))),
  sha256After: t.digest(Buffer.from(JSON.stringify(current.blocks[i]))),
  unchanged: JSON.stringify(b) === JSON.stringify(current.blocks[i])
})).filter((b) => b.ref !== "p0236#6");
assert.equal(unchangedBlocks.every((b) => b.unchanged), true);
assert.equal(currentMd, priorMd.replace(beforeNoun, afterNoun));
assert.equal(repair.affectedRef, "p0236#6");
assert.equal(repair.defect, "R236-THEOREM40-OMISSION");
assert.equal(t.digest(t.read(repair.originalReview.path)), repair.originalReview.sha256);
assert.equal(repair.focusedOriginalPixels.path, prep.crop);
assert.equal(repair.focusedOriginalPixels.sha256, prep.cropSha256);
// Hash opaque PNG bytes only; no image decoding, display or new pixel observation.
assert.equal(t.digest(t.read(prep.crop)), prep.cropSha256);
const boundRepairInputs = repair.originalBindings.map((input) => {
  const sha256 = t.digest(t.read(input.path));
  assert.equal(sha256, input.sha256);
  return { path: input.path, sha256, matchesRecordedBinding: true };
});
const unchangedCrops = [103, 104].map((id) => {
  const oldCrop = path.resolve(t.repo, base + "source235236-author/work/9-10g/pages/0236/figures/fig-g10-" + id + ".png");
  const newCrop = path.join(repairRoot, "work/9-10g/pages/0236/figures/fig-g10-" + id + ".png");
  const beforeHash = t.digest(t.read(oldCrop));
  const afterHash = t.digest(t.read(newCrop));
  assert.equal(beforeHash, afterHash);
  return { id, priorPath: oldCrop, currentPath: newCrop, sha256: afterHash, bytesIdentical: true, imageOpened: false, semanticRereview: false };
});
const workOriginal = path.join(repairRoot, "work/9-10g/pages/0236/page.png");
assert.equal(t.digest(t.read(workOriginal)), correctOriginalSha256);
const oldLayout = path.resolve(t.repo, base + "source235236-author/work/9-10g/pages/0236/layout.json");
const newLayout = path.join(repairRoot, "work/9-10g/pages/0236/layout.json");
assert.equal(t.digest(t.read(oldLayout)), t.digest(t.read(newLayout)));
assert.equal(t.digest(t.read(result.candidate.path)), result.candidate.sha256);
assert.equal(result.candidate.path, path.join(newPage, "page.json"));
assert.equal(t.digest(t.read(result.audit.path)), result.audit.sha256);
assert.equal(result.audit.path, path.join(newPage, "audit.json"));
assert.equal(command.exitCode, 0);
assert.equal(command.cwd, t.repo);
assert.equal(command.stderr, "");
assert.match(command.stdout, /13 行（印刷 13）/);
assert.equal(command.args[2], "finalize");
assert.deepEqual(result.nativeLineCounts, [13, 13]);
assert.equal(currentAudit.lines_printed, 13);
assert.equal(currentAudit.lines_md, 13);
assert.deepEqual(currentAudit.errors, []);
assert.deepEqual(currentAudit.unknown_chars, []);
assert.deepEqual(currentAudit.katex_warnings, []);
assert.deepEqual(currentAudit.count_exclusions, []);
assert.deepEqual(currentAudit.figures, priorAudit.figures);
assert.deepEqual(currentAudit.normalizations, []);
const auditExpected = structuredClone(priorAudit);
auditExpected.normalizations = [];
assert.deepEqual(currentAudit, auditExpected);
const rows = current.blocks.reduce((n, b) => n + b.lines.length - (b.samerow ? b.lines.length : 0), 0);
assert.equal(rows, 13);
const originalReviewBefore = JSON.parse(fs.readFileSync(path.join(t.root, "original-review-before.json")));
const originalReviewChecks = originalReviewBefore.files.map((input) => {
  const bytes = t.read(input.path);
  const mode = "0" + (fs.statSync(input.path).mode & 0o777).toString(8);
  const sha256After = t.digest(bytes);
  assert.equal(sha256After, input.sha256);
  assert.equal(bytes.length, input.bytes);
  assert.equal(mode, input.mode);
  return { path: input.path, sha256Before: input.sha256, sha256After, bytes: bytes.length, mode, unchanged: true };
});
assert.deepEqual(fs.readdirSync(oldRoot).sort(), originalReviewBefore.files.map((f) => path.basename(f.path)).sort());
const failureScriptBindings = [prep.originalFailedScript, repair.originalFailedScript.path].map((file) => ({ path: file, sha256: t.digest(t.read(file)) }));
assert.equal(failureScriptBindings[1].sha256, repair.originalFailedScript.sha256);
const seedFailurePath = path.resolve(t.repo, base + "source236-theorem-repair-seed-FIRSTFAIL.json");
const seedFailure = t.json(seedFailurePath);
assert.equal(seedFailure.contentChanged, false);
const inputBindings = t.finishBindings();
assert.equal(inputBindings.every((b) => b.sha256Before === b.sha256After), true);
const binding = (file) => {
  const found = inputBindings.find((b) => b.path === path.resolve(t.repo, file));
  assert.ok(found, "Missing input binding " + file);
  return found;
};
const report = {
  schema: "STEMROBIN188/source236-theorem-affected-review@1",
  ticket: "STEMROBIN-188",
  assignment: "188-6",
  role: "Same original-context sole independent reviewer",
  status: "pass",
  findings: [],
  affectedRef: "p0236#6",
  resolvedDefect: "R236-THEOREM40-OMISSION",
  scope: "Only the affected theorem40 noun restoration 球→球体, unchanged-field equality and existing native-result/hash verification",
  workdir: t.repo,
  exclusiveWriteRoot: t.root,
  affectedChange: {
    before: beforeNoun,
    after: afterNoun,
    insertedCharacter: "体",
    matchesOwnOriginalObservation: true,
    ownOriginalObservation: oldObservation,
    ownSealedFIRST: binding(firstPath),
    ownPriorFinding: { report: binding(priorReportPath), defect: "R236-THEOREM40-OMISSION", affectedRef: "p0236#6" },
    parentFocusedConfirmation: {
      source: "Direct human instruction and existing repair.json actualParentObservation",
      observation: repair.actualParentObservation,
      originalFocusedObservationCount: 1,
      thisReviewerNewFocusedObservations: 0,
      cropHashOnlyBinding: binding(prep.crop),
      preparationBinding: binding(prepPath),
      preparationPendingClassificationNotTreatedAsContentApproval: true
    }
  },
  unchangedFields: {
    metadataIdentical: true,
    affectedBlockAllNonNounFieldsIdentical: true,
    affectedFormulaLineIdentical: true,
    remainingBlockCount: 8,
    otherBlocks: unchangedBlocks,
    markdownExactlyOneNounInsertion: true,
    layoutBytesIdentical: true,
    nativeFigureGeometryAndOwnerMetadataIdentical: true,
    twoSourceCrops: unchangedCrops,
    otherTextSemanticallyRereviewed: false
  },
  existingNativeResult: {
    result: binding(resultPath),
    command: binding(commandPath),
    pageJson: binding(path.join(newPage, "page.json")),
    pageMarkdown: binding(path.join(newPage, "page.md")),
    audit: binding(path.join(newPage, "audit.json")),
    recordedExitCode: 0,
    recordedRows: { printed: 13, markdown: 13 },
    mechanicallyRecountedRows: 13,
    auditErrors: [],
    nativeReexecutionCount: 0,
    auditNormalizationHistoryDelta: {
      before: priorAudit.normalizations,
      after: currentAudit.normalizations,
      explanation: "Existing candidate was already normalized. The retained new native run reports zero new normalization actions. Every other audit field is identical."
    },
    resultPendingAffectedReviewFlagRetainedHistorically: true,
    wholePageApproved: false
  },
  hashEntryFault: {
    classification: "technical-malformed-FIRST-source-hash-entry",
    status: "acknowledged-and-authoritative-binding-used",
    affectedOriginalField: "FIRST-p0236.json.sourceSha256",
    malformedValue: first.sourceSha256,
    malformedLength: 70,
    malformedSuffix: "fed86a2",
    authoritativeOriginalSha256: correctOriginalSha256,
    authoritativeExistingIntake: binding(intakePath),
    authoritativeOriginalHashOnlyBinding: binding(actualOriginal.path),
    existingOriginalReportInputBindingCorrect: true,
    failureReceipt: binding(failedPrepPath),
    failedPreparationExitCode: failedPrep.exitCode,
    failedPreparationCropOutputs: 0,
    failedPreparationImageObservations: 0,
    technicalRecovery: prep.technicalRecovery,
    originalFIRSTRewritten: false,
    originalReportRewritten: false,
    scientificFailureImplied: false,
    unrelatedContentBlanketBlocked: false
  },
  inheritedPASS: [
    { scope: "p0236#6 displayed V=4/3πR³ formula", status: "pass-inherited", newMathematicalReview: false },
    { scope: "Prior readable-math/ownership PASSs outside the one noun", status: "unchanged-inherited", semanticRereview: false },
    { scope: "Source234 previously scoped PASS", status: "unchanged-inherited", originalOrPriorSourcePASSReopened: false }
  ],
  inheritedHOLDs: [
    { scope: "N67 diameter/wording FIRST conflicts", status: "HOLD", unchanged: true },
    { scope: "Figure103 prefix before60, local to N67", status: "HOLD", unchanged: true, blanketBlocksN68: false },
    { scope: "Figure104 exact separators/fine vector glyphs", status: "HOLD", unchanged: true },
    { scope: "Source237 exact inequality glyph", status: "HOLD", unchanged: true },
    { scope: "Figure27 independent-FIRST relationship conflict", status: "HOLD", unchanged: true },
    { scope: "All original fine-glyph/all-ink/FIRST exposure and incomplete-lesson boundaries", status: "HOLD", unchanged: true }
  ],
  preservation: {
    originalReviewOutputsAndFIRSTsByteForByteUnchanged: true,
    originalReviewFileSetUnchanged: true,
    originalReviewModesUnchanged: true,
    originalReviewChecks,
    originalFailureRecordsAndScriptsUnchanged: true,
    failureScriptBindings,
    seedTechnicalFailureReceipt: binding(seedFailurePath),
    sourceRepairContentRepairCountFromExistingRecord: repair.contentRepairCount,
    thisReviewerContentRepairs: 0,
    cumulativeFigure27RepairsPreserved: 2,
    nativeFigurePASSCreated: false
  },
  imageExposure: {
    newImages: 0,
    newPageImages: 0,
    newCropImages: 0,
    imageDecodeOrDisplayCalls: 0,
    originalIndependentReviewImagesRetainedHistorically: 8,
    parentFocusedCropAlreadyObservedOnceNotReopened: true,
    pngOperations: "Opaque byte hashing only; no decoded pixels or visual payload"
  },
  inputBindings,
  sourceCandidateEditsByReviewer: 0,
  oldArtifactsEdits: 0,
  coreCodeEdits: 0,
  dbCalls: 0,
  envReads: 0,
  networkCalls: 0,
  modelCalls: 0,
  rendererCalls: 0,
  agentDispatches: 0,
  gitMutations: 0,
  wholePageApproved: false,
  wholeLessonApproved: false,
  productAcceptance: false,
  nativeFigurePASS: false,
  promoted: false,
  published: false
};
t.output("report.json", report);
t.output("verification.json", {
  schema: "affected-review-verification@1",
  affectedRef: "p0236#6",
  exactNounRestorationMatchesOwnFIRST: true,
  currentInputCount: inputBindings.length,
  allBeforeAfterHashesEqual: true,
  originalReviewOutputCount: originalReviewChecks.length,
  originalReviewBytesModesAndFileSetUnchanged: true,
  nativeExitCode: 0,
  printedRows: 13,
  markdownRows: 13,
  unchangedBlocks: 8,
  unchangedCrops: 2,
  newImages: 0,
  findings: [],
  scopeOnlyAffectedNoun: true
});
t.index();
console.log(JSON.stringify({
  status: report.status,
  affectedRef: report.affectedRef,
  newImages: 0,
  report: { path: path.join(t.root, "report.json"), sha256: t.digest(fs.readFileSync(path.join(t.root, "report.json"))) },
  index: { path: path.join(t.root, "output-index.json"), sha256: t.digest(fs.readFileSync(path.join(t.root, "output-index.json"))) }
}, null, 2));
