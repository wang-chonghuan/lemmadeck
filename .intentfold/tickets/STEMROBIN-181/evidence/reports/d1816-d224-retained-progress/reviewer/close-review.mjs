import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const own = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d224-source77-79-review");
assert.equal(process.cwd(), repo);
assert.equal(path.dirname(fileURLToPath(import.meta.url)), own);
const abs = (value) => path.resolve(repo, value);
const read = (value) => JSON.parse(fs.readFileSync(abs(value), "utf8"));
const digest = (value) => {
  const file = abs(value);
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex") };
};
const output = (name, value) => {
  const file = path.join(own, name);
  assert.equal(path.dirname(file), own);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const input = read(path.join(own, "input-freeze.json"));
const source = read(path.join(own, "source-only.json"));
const after = read(path.join(own, "after-inventory.json"));
const supplement = read(path.join(own, "fig48-first-preview-supplement.json"));
const inventory = read(path.join(own, "independent-source-inventory.json"));
const author = read(after.authorReport.path);
const declared = new Map();
function collect(value) {
  if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") {
    if (value.path && Number.isInteger(value.bytes) && value.sha256) {
      const record = { path: abs(value.path), bytes: value.bytes, sha256: value.sha256 };
      if (declared.has(record.path)) assert.deepEqual(declared.get(record.path), record);
      declared.set(record.path, record);
    }
    Object.values(value).forEach(collect);
  }
}
collect(input);
collect(source);
collect(after);
collect(supplement);
collect(author.historicalDrafts);
collect(author.operativeDraftsBoundToCurrentBytes);
const records = (files) => files.map((file) => digest(file.path ?? file));
const candidate = (page) => records(after.candidates.find((item) => item.page === page).files);
const md = (page) => candidate(page).find((file) => file.path.endsWith("page.md"));
const sourceBinding = (page) => source.pages.find((item) => item.page === page).original;
const layoutPath = abs(".tmp/STEMROBIN-181/d1816-d223/source-work/10p/pages/0078/layout.json");
const bands = read(layoutPath).line_bands;
assert.equal(bands.length, 25);
assert.deepEqual(bands.slice(13, 15), [[1280, 1294], [1316, 1369]]);
assert.deepEqual(inventory.pages.map((item) => item.physicalRowsIncludingFooter), [24, 24, 23]);
assert.equal(digest(path.join(own, "input-freeze.json")).sha256,
  "2f803f3714910c1759c8aaceb0fe764377bfa2d246d92d6aa705a009c7c1b594");

const candidateComparisons = [];
for (const page of [77, 78, 79]) {
  const number = String(page).padStart(4, "0");
  const currentJson = candidate(page).find((file) => file.path.endsWith("page.json"));
  const current = read(currentJson.path);
  const views = [];
  for (const base of [
    ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author/pre-native-snapshots/10p/pages",
    ".tmp/STEMROBIN-181/d1816-d220/root/10p/pages",
    ".tmp/STEMROBIN-181/d1816-d223/root/10p/pages"
  ]) {
    const files = ["page.md", "page.json"].map((name) => digest(path.join(base, number, name)));
    const previous = read(files[1].path);
    const comparable = (blocks) => blocks.map(({ kind, label, box, cont, open, samerow, lines }) =>
      ({ kind, label, box, cont, open, samerow, lines }));
    const previousBlocks = comparable(previous.blocks);
    const currentBlocks = comparable(current.blocks);
    const changes = [];
    for (let index = 0; index < Math.max(previousBlocks.length, currentBlocks.length); index++) {
      if (JSON.stringify(previousBlocks[index]) !== JSON.stringify(currentBlocks[index])) {
        changes.push({ block: index + 1, before: previousBlocks[index], after: currentBlocks[index] });
      }
    }
    assert(changes.length === 0 || page === 77 && changes.length === 1 && changes[0].block === 2);
    views.push({
      files, changedBlocks: changes,
      textualBlockLinesUnchanged: JSON.stringify(previous.blocks.map((item) => item.lines)) ===
        JSON.stringify(current.blocks.map((item) => item.lines))
    });
  }
  candidateComparisons.push({
    page, current: candidate(page), comparedViews: views,
    mdJsonInspection: "Current MD and JSON read fully and compared against original rows. Historical MD diff preserves all textual blocks; native77 adds snapped figure metadata/link, native78 adds metadata, native79 bytes unchanged.",
    notApprovalFromByteEquality: true
  });
}

const findings = [
  {
    id: "D224-F1", status: "fail", type: "SOURCE_CONTENT_OPERATOR_MISMATCH", priority: 1,
    sourcePage: 77, printedPage: 67, sourceRow: 6, block: "p0077#1", blockLine: 6,
    candidate: md(77), mdLine: 60,
    original: sourceBinding(77),
    sourcePixels: "cos phi < 0.85: two chevron strokes, no equality bar. The detached tiny speck below is not a connected or complete underbar.",
    currentCandidate: "\\cos\\varphi\\leq0.85",
    requiredSourceFact: "\\cos\\varphi<0.85",
    support: digest(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author/inspection-crops/p77-threshold.png")),
    inheritedHold: "p77-threshold-glyph",
    disposition: "Current held clause is not a qualifying pass. Pixel reading is clarified, but original candidate and inherited HOLD record remain untouched; no repair or physics-based normalization."
  },
  {
    id: "D224-F2", status: "fail", type: "SOURCE_CONTENT_EMPHASIS_OMISSION", priority: 2,
    sourcePage: 77, printedPage: 67, sourceRow: 21, block: "p0077#11", blockLine: 3,
    candidate: md(77), mdLine: 97, original: sourceBinding(77),
    sourcePixels: "The second occurrence of 共振 in 就发生共振 is bold, as independently tagged in the saved original-only inventory and confirmed on original reopen.",
    currentCandidate: "就发生共振. 当摩擦力很小时，稳定的受迫振动的振幅就会",
    comparison: "Only the first occurrence in 象--共振 is emphasized in both candidate MD and JSON. Second source occurrence lacks emphasis.",
    disposition: "No loss of words or row; local emphasis fidelity fails. Do not consume the whole introductory paragraph as an emphasis pass. No edit."
  },
  {
    id: "D224-F3", status: "fail", type: "SOURCE_CONTENT_FORMULA_PUNCTUATION_OMISSION", priority: 2,
    sourcePage: 79, printedPage: 69, sourceRow: 11, block: "p0079#8", blockLine: 1,
    candidate: md(79), mdLine: 62, original: sourceBinding(79),
    sourcePixels: "In the final displayed comparison only, the right-hand voltage has a comma after the L-shaped subscript and before 共振: U_(shape-M,L,共振). The left C-shaped subscript has no such comma.",
    currentCandidate: "U_{\\mathrm{м},L\\text{共振}}",
    requiredVisibleSeparator: "U_{shape-M,L,共振}",
    support: digest(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author/inspection-crops/p79-formulas.png")),
    distinction: "The earlier L-voltage identity at source row7 has no corresponding comma after L; do not regularize every formula or remove the final source comma.",
    disposition: "Local displayed formula punctuation fails independently of unresolved amplitude/C-script/omega-subscript HOLDs. No algebraic correction inferred and no repair."
  }
];

const qualifyingPasses = [
  {
    id: "D224-P1", status: "pass", scope: "SOURCE77_PHYSICAL_ROW_INVENTORY_ONLY",
    pages: [77], bindings: candidate(77),
    detail: "24 distinct physical rows including footer. 25 textual entries include caption 图48 sharing question3's second row; samerow correctly subtracts one. Counts are not threshold/emphasis approval."
  },
  {
    id: "D224-P2", status: "pass", scope: "SOURCE77_QUESTIONS1_4_AND_CAPTION_ROW_POSITION",
    pages: [77], bindings: candidate(77), sourceRefs: ["p0077#3", "p0077#4", "p0077#5", "p0077#6", "p0077#7", "p0077#8", "p0077#9"],
    detail: "One 问题 group, exactly questions1-4, ten exercise text rows, question3's negligible-resistance condition preserved, open/cont around transparent caption correctly rejoins one question. No answers/choices approved."
  },
  {
    id: "D224-P3", status: "pass", scope: "SOURCE77_TITLE_AND_LOCAL_OLD_NEW_UNIT_BOUNDARY",
    pages: [77], bindings: candidate(77), sourceRefs: ["p0077#9", "p0077#10", "p0077#12"],
    detail: "28. 电谐振 starts after question4; preceding unit has a local observed end only. Last new-unit paragraph remains open at 作出以. Neither N27 nor N28 is complete/approved."
  },
  {
    id: "D224-P4", status: "pass", scope: "SOURCE77_UNAFFECTED_LOCAL_PROSE_WORDS_AND_ROWS",
    pages: [77], bindings: candidate(77), sourceRows: [1, 2, 3, 4, 5, 19, 20, 22, 23],
    detail: "Listed rows match source wording/row boundaries, allowing period/spacing typography already present. Excludes row6 threshold clause and row21 second 共振 emphasis; no whole-paragraph or incoming76 approval."
  },
  {
    id: "D224-P5", status: "pass", scope: "SOURCE78_PHYSICAL_ROWS_NO_SOURCE_OMISSION_DIAGNOSIS",
    pages: [78], bindings: candidate(78),
    detail: "24 physical rows including footer: 20 prose + 3 independent equation rows + footer. Every row is transcribed. Native25 arises from two detector bands within one (2.49) radical/fraction row, not an omitted line.",
    nativeFailureStillFailed: true, mechanicalRepairAuthorized: false
  },
  {
    id: "D224-P6", status: "pass", scope: "SOURCE78_UNAFFECTED_PROSE_EMPHASIS_AND_FORMULA_STRUCTURE",
    pages: [78], bindings: candidate(78),
    detail: "Prose, references (2.39)/(2.47)/section20, three-row bold definition, R->0 and I_(共振)->infinity match source. Equations2.47-2.49 retain operators, fraction/radical structure and numbers. This is not script/case approval of (2.48) or native gate clearance.",
    excluded: ["amplitude-alphabet-p78-p79", "all inherited glyph HOLDs", "native78 clearance"]
  },
  {
    id: "D224-P7", status: "pass", scope: "SOURCE77_78_79_OBSERVED_INTERNAL_CONTINUATIONS",
    pages: [77, 78, 79], bindings: [...candidate(77), ...candidate(78), ...candidate(79)],
    detail: "77->78 作出以 + 下的结论; 78->79 电流强度的振幅 + 和频率间的对应关系. open/cont joins are exact with no repeated words. Terminal79 在电路中接通 stays open; incoming76 source and next80 unobserved."
  },
  {
    id: "D224-P8", status: "pass", scope: "SOURCE79_ROW_COMPLETENESS_UNAFFECTED_PROSE_AND_RECORDED_EMPHASIS",
    pages: [79], bindings: candidate(79),
    detail: "23 physical rows including footer: 18 prose + 4 display equations + footer. No missing row. Mid-row bold start at 电容器和电感 through 很多倍 and complete bold phase-zero sentence match independent inventory. Prose wording, references, visible << / >> structure and lowercase-looking u cancellation relation are locally retained.",
    excluded: ["D224-F3 final-formula comma", "amplitude-alphabet-p78-p79", "capacitance-alphabet-p79", "omega-subscript-origin", "row17 电流 emphasis qualification", "native79 approval"]
  },
  {
    id: "D224-P9", status: "pass", scope: "FIG48_SOURCE_CITATION_OWNERSHIP_ONLY",
    pages: [77, 78, 79], bindings: [...candidate(77), ...candidate(79)],
    figure: "fig-48", owner: "phy10-c1-s3-n28",
    detail: "SOURCE79 p0079#1 explicitly cites 图48 in N28 prose continued from77/78. Raw graph/caption physically precede N28 heading but must not be assigned to N27/question3 by proximity. Assembled ownership not observed or approved."
  },
  {
    id: "D224-P10", status: "pass", scope: "FIG48_AVAILABLE_RAW_CROP_AND_FIRST_SVG_PREVIEW_VISIBLE_MARK_PRESERVATION_ONLY",
    pages: [77], bindings: [...records(after.rawFigures), ...records([supplement.png, supplement.svg, supplement.preview])],
    detail: "Original full-page graph -> raw PNG -> first existing SVG preview: both axes/extensions/end wedges, three solid non-identical humps, all finite left/right tails, three R-shaped numbered labels and leader strokes, dashed slightly slanted guide, M-shaped amplitude label, O-shaped origin and omega labels preserved. No adjacent task text or separate caption contamination. No blank/cropped preview, extra ticks/grid/curve or regularization observed.",
    excluded: ["glyph/script/case interpretation", "exact analytical peak coincidence or symmetry", "arrowhead semantic/topological approval", "modern FigureSpec/render/product gate", "whole figure promotion"]
  }
];

const nativeDiagnosis = {
  source77: {
    finalize: "FIRST_EXISTING_PASS_EXIT0_NOT_REPLAYED",
    vectorize: "FIRST_EXISTING_PASS_EXIT0_NOT_REPLAYED",
    lines: { detected: 24, transcribed: 24, independentlyObserved: 24 },
    vectorMismatchReportedPercent: 0.044,
    evidence: records(after.stages.filter((item) => item.page === 77).flatMap((item) => item.evidence)),
    contentApprovalFromNative: false
  },
  source78: {
    status: "FIRST_EXISTING_FINALIZE_FAILURE_PRESERVED_EXIT1",
    lines: { detected: 25, transcribed: 24, independentlyObservedIncludingFooter: 24 },
    physicalRowDecomposition: { prose: 20, displayedEquations: 3, footer: 1 },
    detectorEvidence: digest(layoutPath),
    split: {
      detectorBandIndexesOneBased: [14, 15], yRanges: [[1280, 1294], [1316, 1369]],
      sourcePhysicalRow: 14, equation: "2.49",
      actualSingleRow: "\\omega=\\sqrt{\\frac{1}{LC}} (2.49)",
      diagnosis: "Upper radical/vinculum ink and the lower omega/fraction/equation-number ink are two disconnected projection bands of one printed equation, with no second independent statement.",
      notOmittedContent: true,
      prohibition: "Do not add a fake row, split formula with a false source break, delete a denominator, or enforce detector25. No counter repair or native rerun in D224."
    },
    entireDetectedToPhysicalMapping: bands.map((band, index) => ({
      detectedBand: index + 1, yRange: band, physicalRow: index < 14 ? index + 1 : index
    })),
    sourceContentFailureDueToCount: false,
    evidence: records(after.firstFailure.evidence),
    warnings: "Existing (2.48) Cyrillic м math warnings retained; not resolved by this count diagnosis.",
    nativeGateCleared: false
  },
  source79: {
    status: "UNATTEMPTED_AFTER_SOURCE78_FIRST_FAILURE",
    auditAvailable: false, nativeExecutedByReviewer: false,
    json: candidate(79).find((file) => file.path.endsWith("page.json")),
    jsonNature: "author_view parsed draft; nativeStages UNATTEMPTED, normalized false, notCanonical true; presence is not native success.",
    sourceContentFailureFromUnattemptedNative: false,
    genuineLocalSourceDefect: "D224-F3, unrelated to whether native ran",
    noUnexecutedStagePassClaim: true
  },
  preview: {
    status: "FIRST_EXISTING_ISOLATED_SOURCE77_RAW_SVG_PREVIEW_REUSED_NOT_REGENERATED",
    evidence: records(supplement.nativeEvidence),
    dimensions: [539, 579], source78FailurePreserved: true, source79StillUnattempted: true
  }
};

const imagePaths = [
  sourceBinding(77).path, sourceBinding(78).path, sourceBinding(79).path,
  after.rawFigures.find((file) => file.path.endsWith(".png")).path,
  supplement.preview.path,
  path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author/inspection-crops/p77-threshold.png"),
  path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d220-10p-source77-79-author/inspection-crops/p79-formulas.png"),
  sourceBinding(77).path
];
const imageLedger = imagePaths.map((file, index) => ({
  open: index + 1, ...digest(file),
  stage: index < 3 ? "ORIGINAL_ONLY_BEFORE_SAVED_INVENTORY" : "AFTER_SAVED_INVENTORY_COMPARISON",
  reopen: index === 7
}));
const consulted = new Set([
  ".intentfold/readme.md", ".intentfold/project.json",
  ".intentfold/charter/product.md", ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md", ".intentfold/charter/ui.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".claude/skills/ld-s10y-lesson/tools/p2c.py",
  ".claude/skills/ld-s10y-lesson/tools/layout.py",
  layoutPath, path.join(own, "input-freeze.json"), path.join(own, "source-only.json"),
  path.join(own, "after-inventory.json"), path.join(own, "fig48-first-preview-supplement.json"),
  path.join(own, "independent-source-inventory.json"), after.authorReport.path,
  after.authorFreeze.path, after.authorCollected.path, after.prepared.path,
  supplement.originalFirstNativeState.path, source.precedingText.path,
  author.historicalDrafts.freeze.path
].map(abs));
after.candidates.forEach((item) => item.files.forEach((file) => consulted.add(abs(file.path))));
after.stages.forEach((item) => item.evidence.forEach((file) => consulted.add(abs(file.path))));
after.rawFigures.forEach((file) => consulted.add(abs(file.path)));
supplement.nativeEvidence.forEach((file) => consulted.add(abs(file.path)));
imagePaths.forEach((file) => consulted.add(abs(file)));
candidateComparisons.forEach((item) => item.comparedViews.forEach((view) =>
  view.files.forEach((file) => consulted.add(file.path))));
// Hash-only inputs are explicit, not silently represented as viewed pixels.
const hashOnly = source.pages.map((item) => item.grid).concat([supplement.png, supplement.svg])
  .filter((file) => !consulted.has(abs(file.path))).map((file) => digest(file.path));
const currentInputs = [...consulted].sort().map(digest);
const report = {
  schema: "d224/independent-bounded-review@1",
  batch: "D224", ticket: "STEMROBIN-181", book: "10p",
  role: "SOLE_FIRST_INDEPENDENT_SOURCE77_79_REVIEWER",
  status: "BOUNDED_REVIEW_CLOSED_LOCAL_PASSES_WITH_CONTENT_FAILURES_AND_INHERITED_HOLDS",
  finish: "review", cwd: repo, date: "2026-11-20",
  inputFreeze: digest(path.join(own, "input-freeze.json")),
  sourceOnly: digest(path.join(own, "source-only.json")),
  afterInventory: digest(path.join(own, "after-inventory.json")),
  firstPreviewSupplement: digest(path.join(own, "fig48-first-preview-supplement.json")),
  independentInventory: digest(path.join(own, "independent-source-inventory.json")),
  chronology: [
    "Read repo router/redlines, production-resume and image-batches; user-authorized same invocation setup/Grill/freshness not repeated; no backend call.",
    "Read source-only before after-inventory/native/author; verified authoritative input-freeze SHA256.",
    "Opened all3 ORIGINAL pages individually as images1-3.",
    "Saved independent-source-inventory.json with all71 distinct physical rows, formulas, emphasis, tasks, title/boundaries and fig48 inventory before reading after-inventory/native/author/candidate content.",
    "Read after-inventory and supplement only after baseline; compared all current MD/JSON and author/native/historical views; read existing first-native receipts and source78 detector bands.",
    "Opened raw PNG, first existing SVG preview, two already-existing source crops and SOURCE77 original reopen as images4-8; no new render/crop.",
    "Wrote report and review-freeze only inside permitted review directory; next single read-only freeze verification determines closure eligibility."
  ],
  inventorySupplementAfterComparison: {
    source79Row17: "Original power paragraph's 电流 is bold and candidate also records **电流**. It was not separately tagged in the first saved inventory; recorded here as a supplemental comparison observation, excluded from qualifying FIRST-inventory emphasis scope.",
    fig48Alignment: "First inventory's peak-at-guide description is qualitative. Original dash guide is slightly slanted and drawn humps imperfect; no exact coincident coordinates, symmetry or physics-based curve parameters approved."
  },
  findings, qualifyingPasses,
  pageVerdicts: [
    { page: 77, status: "LOCAL_CONTENT_FAILURES_PLUS_GLYPH_HOLDS", completePageApproved: false, physicalRows: 24, findings: ["D224-F1", "D224-F2"] },
    { page: 78, status: "NO_MISSING_SOURCE_ROW_LOCAL_FACTS_PASS_NATIVE_FAILURE_AND_GLYPH_HOLDS_RETAINED", completePageApproved: false, physicalRows: 24, nativeClearance: false },
    { page: 79, status: "LOCAL_FORMULA_SEPARATOR_FAILURE_GLYPH_HOLDS_NATIVE_UNATTEMPTED", completePageApproved: false, physicalRows: 23, findings: ["D224-F3"] }
  ],
  candidateComparisons,
  currentCandidateBindings: after.candidates.map((item) => ({ page: item.page, files: candidate(item.page) })),
  rawFigureBindings: records(after.rawFigures),
  firstPreviewBindings: records([supplement.png, supplement.svg, supplement.preview]),
  nativeDiagnosis,
  fig48: {
    originalInventory: inventory.fig48,
    localVisibleMarkPreservation: "pass", fullFigureApproval: false,
    svgReadOnlyXmlInspection: {
      root: "svg", width: 539, height: 579, viewBox: "0 0 539 579",
      pathElements: 1, rasterImages: 0, scripts: 0, hrefs: 0, transforms: 0,
      tool: "xmllint XPath read only; existing SVG never rasterized again"
    },
    ownership: "phy10-c1-s3-n28, by SOURCE79 p0079#1 citation",
    firstNativeRasterVectorMismatchIsNotSemanticApproval: true,
    noSourceCurveRegularization: true, noModernFigureApproval: true
  },
  inheritedHolds: author.ambiguityAndProcessHolds.map((hold) => ({
    ...hold,
    reviewDisposition: hold.id === "p77-threshold-glyph" ?
      "Pixel < observation and current <= local failure recorded; original HOLD and candidate bytes not rewritten, not a qualifying pass." :
      hold.id === "independent-source-review" ?
        "This bounded independent review has run; only listed local scopes qualify after closure, not blanket page/figure/lesson approval." :
        hold.id === "first-native-parent-pending" ?
          "Historical author-stage pending note superseded only by observed first-native77 pass/78 fail/79 unattempted; never a content approval." :
          "Preserved. No script/case/identity/topology or course completion inferred."
  })),
  unavailableOrUnobserved: {
    incoming76Original: "Not opened; supplied JSON tail joins grammatically, but preceding SOURCE74-76 queued/not-approved state remains.",
    source80AndBeyond: "Not opened; SOURCE79 ends 在电路中接通.",
    source79Native: "Unattempted, not failure of source content, not passed.",
    assembledOwnershipAndLessons: "Not observed; only citation ownership fact qualifies.",
    modernEditionFigureSpecAndRendering: "Unavailable/unobserved in this bounded raw review.",
    answersChoicesProductRuntimeDatabasePublicationDeployment: "Unobserved and unauthorized.",
    wholeCourseApproval: false
  },
  imageLedger,
  counters: {
    originalPagesOpened: 3, actualImageOpens: 8, distinctImagesOpened: 7,
    contextImageOpens: 8, maximumActualImageOpens: 8, maximumContextImageOpens: 24,
    parentImageOpens: 0, childImageOpens: 0,
    uniquePhysicalRowsIncludingFooters: 71, textualEntriesIncludingSharedCaption: 72,
    displayedFormulaRows: 7, tasks: 4, exerciseTextRows: 10, exerciseGroups: 1,
    titleRows: 1, sourceFigures: 1, captions: 1,
    qualifyingLocalPassScopes: qualifyingPasses.length, localContentFindings: findings.length,
    wholePagesApproved: 0, wholeFiguresApproved: 0, completeCoursesApproved: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
    sourceContentRepairs: 0, figureContentRepairs: 0, inheritedFigureContentRepairs: 0,
    nativeCalls: 0, p2cCalls: 0, vectorizeCalls: 0, nativeReplays: 0,
    previewRegenerations: 0, imageCropGenerations: 0,
    gitCalls: 0, modelApiCalls: 0, paidCalls: 0, databaseCalls: 0, backendCalls: 0,
    publisherCalls: 0, deployCalls: 0, mergeCalls: 0, handoffCalls: 0,
    childrenStarted: 0, peerMessages: 0, sharedWrites: 0, charterWrites: 0
  },
  consultedInputsCurrentBytes: currentInputs,
  inputsHashedButPixelsNotOpened: hashOnly,
  preservation: {
    originalInputsAndCandidatesUnchanged: true, unrelatedWorkersPreserved: true,
    originalNativeFailurePreserved: true, noPermissionChanges: true,
    writesOnlyIn: own, setupGrillFreshnessNotRepeated: true,
    nativeStagesNotRegenerated: true, repairsAuthorized: false,
    noNewProductionOrCost: true
  },
  parentConsumption: {
    onlyAfterReviewClosureAndFreezeVerification: true,
    consumeOnlyStatusPassScopesListedInQualifyingPasses: true,
    bindingsMustMatchExactCurrentPathsBytesSha256: true,
    failedHeldUnavailableUnobservedScopesNotConsumable: true,
    noWholePageFigureLessonCourseCanonicalApproval: true,
    noAdditionalRepairOrNativeExecutionAuthorization: true,
    reviewerStopsAfterBoundedReview: true
  },
  sourceApproval: false, figureApproval: false, lessonApproval: false,
  wholeCourseApproved: false, formalHandoff: false,
  hashClosure: {
    reviewFreezePath: path.join(own, "review-freeze.json"),
    freezeBindsReportNotItself: true, ownFreezeVerificationRequiredExactlyOnce: true,
    selfHashesSuppliedInFinalText: true
  }
};
output("report.json", report);
const closureOutputs = ["independent-source-inventory.json", "close-review.mjs", "report.json"].map((name) =>
  digest(path.join(own, name)));
const freeze = {
  schema: "d224/review-freeze@1", batch: "D224", ticket: "STEMROBIN-181", book: "10p",
  status: "CLOSED_ARTIFACTS_PENDING_SINGLE_READ_ONLY_FREEZE_VERIFICATION",
  cwd: repo, permittedWriteRoot: own, authoritativeInputFreeze: report.inputFreeze,
  expectedInputDeclarations: [...declared.values()].sort((a, b) => a.path.localeCompare(b.path)),
  currentInputs, hashOnlyInputs: hashOnly, outputBindings: closureOutputs,
  report: closureOutputs.find((file) => file.path.endsWith("report.json")),
  qualifyingPassIds: qualifyingPasses.map((item) => item.id),
  localContentFailureIds: findings.map((item) => item.id),
  actualImageOpens: 8, uniquePhysicalRowsIncludingFooters: 71,
  sourceApproval: false, figureApproval: false, lessonApproval: false,
  wholeCourseApproved: false, formalHandoff: false,
  closureRule: "Parent may consume only listed qualifying local scopes after the one read-only verification succeeds and reviewer closes. Every relevant binding must still match. No cyclic freeze self-hash or unrun stage pass.",
  selfHashProvidedInFinalTextNotEmbedded: true
};
output("review-freeze.json", freeze);
console.log(JSON.stringify({
  generated: ["report.json", "review-freeze.json"].map((name) => digest(path.join(own, name))),
  uniquePhysicalRows: 71, actualImageOpens: 8, localPassScopes: qualifyingPasses.length,
  localContentFindings: findings.length, next: "Verify this own freeze once, read-only; then stop."
}, null, 2));
