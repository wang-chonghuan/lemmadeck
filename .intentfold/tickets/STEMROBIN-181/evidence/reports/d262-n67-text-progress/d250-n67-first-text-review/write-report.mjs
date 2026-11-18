import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.dirname(new URL(import.meta.url).pathname);
const hash = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const bind = p => ({path: p, sha256: hash(p)});
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const absolute = p => path.resolve(root, p);
const own = name => path.join(out, name);
function writeNew(name, data) {
  fs.writeFileSync(own(name), JSON.stringify(data, null, 2) + "\n", {flag: "wx"});
}
const bindings = read(own("input-bindings.json"));
const finalChecks = bindings.checks.map(c => ({
  path: c.path,
  expectedSha256: c.expectedSha256,
  initialSha256: c.sha256,
  currentSha256: hash(c.path),
  unchanged: hash(c.path) === c.sha256,
  matches: hash(c.path) === c.expectedSha256
}));
assert(finalChecks.every(c => c.unchanged && c.matches), "Frozen input changed during review.");
const freezePath = absolute(".intentfold/tickets/STEMROBIN-181/tmp/d248-n67-text-author/author-freeze.json");
const freeze = read(freezePath);
const manifestPath = absolute(freeze.sourcePreparation.path);
const manifest = read(manifestPath);
const sourcePath = absolute(freeze.sourceLesson.path);
const source = read(sourcePath);
const original = read(absolute(freeze.originalTemplate.path));
const checks = read(own("pure-text-check.json"));
const judgments = read(own("first-review-judgments.json"));
const primary = read(own("primary-source-notes.json"));
const primaryHttp = read(own("primary-text-bindings.json"));
assert.equal(primaryHttp.results.length, 6);
assert(primaryHttp.results.every(result => result.httpStatus === 200 && result.status === "TEXT-RETRIEVED"));
const zh = read(absolute(freeze.textCandidates.zh.lesson.path));
const en = read(absolute(freeze.textCandidates.en.lesson.path));
assert.equal(source.prose.length, 19);
assert.equal(judgments.blocks.length, 19);
assert.equal(checks.invocationCount, 1);
assert.equal(checks.nativeTextErrorCount, 6);
assert(checks.sourceBindingsPreserved);
const equationDefinitions = [
  [9, "6.1", "\\Omega=\\frac{S}{R^2}"],
  [13, "6.2", "\\Omega=\\frac{S}{R^2}=\\frac{4\\pi R^2}{R^2}=4\\pi"],
  [14, "6.3", "I=\\frac{\\Phi}{\\Omega}"],
  [15, "6.4", "I=\\frac{\\Phi}{4\\pi}"]
];
const equationChecks = equationDefinitions.map(([ordinal, number, expression]) => {
  const sourceText = source.prose[ordinal - 1].text;
  const texts = {source: sourceText, zh: zh.prose[ordinal - 1].text, en: en.prose[ordinal - 1].text};
  const results = Object.fromEntries(Object.entries(texts).map(([lang, text]) => {
    const token = `$${expression}$`;
    return [lang, {
      exactFullMathSpanPreserved: text.split(token).length - 1 === 1,
      equationNumberPreserved: text.split(`(${number})`).length - 1 === 1
    }];
  }));
  assert(Object.values(results).every(r => r.exactFullMathSpanPreserved && r.equationNumberPreserved));
  return {ordinal, number, expression, sourceRefs: source.prose[ordinal - 1].source_refs, status: "PASS", results};
});
const exerciseSource = read(absolute(freeze.sourceExercises.path));
const exerciseChecks = ["zh", "en"].map(language => {
  const p = absolute(freeze.textCandidates[language].exercises.path);
  const candidate = read(p);
  assert.deepEqual(candidate.source.data, exerciseSource);
  assert.equal(candidate.count, 0);
  assert.deepEqual(candidate.exercises, []);
  return {language, candidate: bind(p), sourceSnapshotPreserved: true, count: 0, status: "PASS"};
});
const page176Path = absolute("ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0176/page.json");
const page176 = read(page176Path);
const ownerNote = page176.meta.notes.find(n => n.type === "footnote" && n.block === "p0176#9");
assert.equal(ownerNote.owner_source_ref, "p0176#2");
assert.equal(ownerNote.owner_line, 2);
assert.equal(ownerNote.unit, "n67");
assert.equal(source.prose[17].label, "footnote");
assert.deepEqual(source.prose[17].source_refs, ["p0176#9"]);
assert(source.prose[16].text.includes("①"));
assert(zh.prose[16].text.includes("①") && en.prose[16].text.includes("①"));
const footnote = {
  status: "PASS",
  authoritativePageJson: bind(page176Path),
  note: ownerNote,
  sourceOrdinal: 18,
  sourceRef: "p0176#9",
  ownerSourceRef: "p0176#2",
  ownerOrdinal: 17,
  ownerLine: 2,
  unit: "n67",
  snapshotPreserved: source.prose[17].text === original.prose[17].source_text && source.prose[17].text === zh.prose[17].source_text && source.prose[17].text === en.prose[17].source_text,
  originalSourceFootnote: source.prose[17].text,
  bilingualOwnerCalloutPreserved: true,
  sourcePixelsReopened: false,
  earlierUnitBoundaryMistakeNotReintroduced: true
};
const beforeLedgerPath = absolute(".intentfold/tickets/STEMROBIN-181/tmp/d235-t16-display-review-b11/actual-opens.json");
assert.equal(hash(beforeLedgerPath), "8fd46db207d76feb1d31a276e8c684d079041b80d40aff23cf6a5de75d1d8f53");
assert.equal(read(beforeLedgerPath).budget.cumulativeContextImages, 24);
const perBlock = judgments.blocks.map(block => ({
  ...block,
  sourceRefs: source.prose[block.ordinal - 1].source_refs,
  kind: source.prose[block.ordinal - 1].kind,
  sourceBlock: `/prose/${block.ordinal - 1}`,
  candidatePaths: {zh: absolute(freeze.textCandidates.zh.lesson.path), en: absolute(freeze.textCandidates.en.lesson.path)},
  nativeTextCheckErrors: checks.rows.filter(r => r.ordinal === block.ordinal && r.nativeTextErrors.length).map(r => ({language: r.language, errors: r.nativeTextErrors})),
  sourceSnapshotAndRefChecks: checks.rows.filter(r => r.ordinal === block.ordinal).map(r => ({
    language: r.language,
    sourceSnapshotPreserved: r.sourceSnapshotPreserved,
    sourceRefsPreserved: r.sourceRefsPreserved,
    embeddedSourcePreserved: r.embeddedSourcePreserved,
    textMatchesAuthoredList: r.textMatchesAuthoredList
  }))
}));
writeNew("final-input-integrity.json", {
  schema: "stemrobin/first-text-review-final-input-integrity@1",
  status: "PASS",
  inputBindings: bind(own("input-bindings.json")),
  checks: finalChecks,
  authorAndPreparedFilesUnchanged: true,
  currentSourceFootnotePageBound: bind(page176Path),
  priorImageLedger: bind(beforeLedgerPath),
  newImagesOpened: 0,
  cumulativeContextImages: 24
});
const report = {
  schema: "stemrobin/first-independent-bilingual-text-review@1",
  ticket: "STEMROBIN-181",
  card: "phy10-c2-s2-n67",
  reviewerUnit: "d250-n67-first-text-review",
  date: "2026-11-17",
  writeRoot: out,
  status: "FAIL",
  statusReason: "SCI and bilingual semantic meaning pass for the reviewed text. The one-shot existing pure text check fails six errors grouped into four stable contract findings; the English historical-entity declaration remains HOLD. This is not a publishable/whole-card PASS.",
  authorFreeze: bind(freezePath),
  sourcePreparation: bind(manifestPath),
  originalTemplate: bind(absolute(freeze.originalTemplate.path)),
  sourceLesson: bind(sourcePath),
  sourceExercises: bind(absolute(freeze.sourceExercises.path)),
  candidates: Object.fromEntries(["zh", "en"].map(language => [language, Object.fromEntries(Object.entries(freeze.textCandidates[language]).map(([name, value]) => [name, bind(absolute(value.path))]))])),
  authoredTexts: bind(absolute(freeze.authoredTexts.path)),
  inputBindings: bind(own("input-bindings.json")),
  finalInputIntegrity: bind(own("final-input-integrity.json")),
  SCI: {
    status: "PASS",
    scope: "First independent correctness/completeness review of the 17 prose blocks in both languages, with necessary primary evidence and explicit reviewer derivations. No figure semantics or image validation.",
    proseBlocksReviewed: 17,
    missingNumberedFormulas: 0,
    physicalFormulaAlterations: 0,
    imageAndCaptionVisualStatus: "HOLD-NOT-REVIEWED",
    conditions: [
      "Photometric flux is visually weighted, not bare radiant power or an observer's informal brightness judgment.",
      "Photopic green sensitivity is a qualified spectral-response statement.",
      "Point-source geometry does not imply isotropic emission.",
      "Finite Φ/Ω equals uniform intensity or is an angular mean when intensity varies.",
      "Total Φ/(4π) requires isotropy to describe every direction.",
      "S/R² uses spherical area centered at the vertex and permits a noncircular ray-region boundary.",
      "Candela, steradian and lumen values and roles are consistent.",
      "Historical emitter/old-name statements are attributed to the source, not presented as a full exact current SI realization."
    ],
    primaryEvidence: bind(own("primary-source-notes.json")),
    primaryHttpBindings: bind(own("primary-text-bindings.json")),
    necessaryPrimaryResponses: primaryHttp.results.map(result => ({
      id: result.id,
      url: result.resolvedUrl,
      httpStatus: result.httpStatus,
      responseSha256: result.responseSha256,
      textSha256: result.textSha256
    })),
    authorScienceClarificationListUsedAsCorrectAnswer: false
  },
  ZHEN: {
    status: "PASS",
    scope: "First independent semantic equivalence review of all 19 aligned source blocks. Placeholder/caption identity is text-only. Strict native token order and declaration gates are recorded separately, not silently waived.",
    blocksReviewed: 19,
    numberConditionUnitAndFormulaMeaning: "PASS",
    sourceSnapshotAndRefs: "PASS",
    mathematicalTokenOrderMechanicalAlignment: "FAIL-ORDINAL14",
    historicalIdentityMeaning: "PASS-Maxwell-retained",
    historicalEntityDeclaration: "HOLD-EN-ORDINAL1",
    imageReview: "HOLD-NOT-REVIEWED"
  },
  perBlock,
  findings: judgments.findings,
  sourcePreservation: {
    status: "PASS",
    blockCount: 19,
    originalSourceSnapshotsExact: true,
    embeddedRawSourceDataExact: true,
    sourceRefsAndBlockOrderExact: true,
    rawSourceNotReauthored: true,
    exercises: exerciseChecks,
    equations: equationChecks,
    footnote,
    headingSourceRef: manifest.physicalSource.heading,
    n67LastMainProseSourceRef: manifest.physicalSource.bodyEnd,
    n68BoundarySourceRef: manifest.physicalSource.rightBoundary,
    n68ContentIncluded: false,
    figurePlaceholders: [10, 11].map(ordinal => ({
      ordinal,
      sourceRefs: source.prose[ordinal - 1].source_refs,
      kind: source.prose[ordinal - 1].kind,
      figureId: "fig-134",
      textIdentity: "PASS",
      visualReview: "HOLD-NOT-REVIEWED",
      modernFigureGate: "HOLD-NOT-ASSESSED"
    })),
    previousRAW134FidelityPass: "Retained as prior evidence only; not repeated, not converted into a modern figure PASS."
  },
  pureTextCheck: {
    status: checks.status,
    path: bind(own("pure-text-check.json")),
    invocationCount: 1,
    actualExitCode: 1,
    nativeTextErrors: checks.nativeTextErrorCount,
    existingFunctions: checks.existingFunctions,
    tools: checks.tools,
    delimiterStatus: checks.rows.every(r => r.delimiterErrors.length === 0) ? "PASS" : "FAIL",
    normalization: "In-memory only. Normalized strings and affected ordinals retained in check record; no candidate edits or second run.",
    bilingualMechanicalAlignment: "FAIL-ONLY-MATH-TOKEN-SEQUENCE-ORDINAL14",
    katexStatus: checks.katexStatus,
    adaptFinalizeRun: false,
    imageGateRun: false,
    failedGateNeverTreatedAsPass: true
  },
  imageBudget: {
    inheritedLedger: bind(beforeLedgerPath),
    contextImagesBeforeReview: 24,
    newImagesOpened: 0,
    actualOpenCalls: 0,
    reopens: 0,
    otherImagesOpened: 0,
    cumulativeContextImages: 24,
    contextReset: false,
    additionalImageAllowance: 0,
    screenshotsOrBrowsersUsed: false,
    sourceImageHashingWasNotPixelObservation: true
  },
  preservation: {
    onlyD250Written: true,
    authorFilesPreparedFilesAndSourceSnapshotsUnchanged: true,
    reviewerDidNotRepairAuthor: true,
    firstTextReviewOnly: true,
    t16B11NotRepeatedOrModified: true,
    sourcePixelReviewNotRepeated: true,
    prepareFinalizeAdaptFinalizeVectorizeAssemble: false,
    browsersScreenshotsImagesPaidGeneration: false,
    stableSkillsCanonicalSharedMeterIndexDatabaseGitCommitPushApp: false,
    newWorktreesAgentsOrChildProcesses: false,
    branchChange: false,
    completeCardOrPublicationClaim: false
  },
  remainingHolds: [
    "N67-TEXT-F05: English source-bound historical declaration not established.",
    "Modern fig-134, its figure/caption visual relation and display are not reviewed.",
    "KaTeX runtime not invoked by this allowed one-shot delimiter/signature check.",
    "Earlier unresolved pixel observations and RAW134 full-page crop-completeness limits are not cleared by this zero-image text review."
  ]
};
writeNew("report.json", report);
const outputs = fs.readdirSync(out).filter(name => fs.statSync(own(name)).isFile() && name !== "output-hashes.json").sort();
writeNew("output-hashes.json", {
  schema: "stemrobin/first-text-review-output-hashes@1",
  files: outputs.map(name => bind(own(name))),
  primaryObservationBindings: primary.sources.map(source => ({
    id: source.id,
    url: source.url,
    observationSha256: crypto.createHash("sha256").update(JSON.stringify(source)).digest("hex"),
    fullRemotePageBytesBound: false
  }))
});
console.log(JSON.stringify({
  status: report.status,
  SCI: report.SCI.status,
  ZHENMeaning: report.ZHEN.status,
  nativeTextCheck: report.pureTextCheck.status,
  findings: report.findings.map(f => ({id: f.id, status: f.status, affectedRefs: f.affectedRefs})),
  report: bind(own("report.json")),
  inputBindings: bind(own("input-bindings.json")),
  integrity: bind(own("final-input-integrity.json")),
  newImages: 0,
  cumulativeImages: 24
}));
