const fs = require("node:fs");
const path = require("node:path");
const t = require("./evidence-tools.cjs");
const own = (name) => path.join(t.root, name);
const readOwn = (name) => JSON.parse(fs.readFileSync(own(name)));
const base = ".intentfold/tickets/STEMROBIN-188/tmp/";
const joint = JSON.parse(t.read(base + "source235237-n48figure27-review-inputs-01/manifest.json"));
const sourceManifest = JSON.parse(t.read(joint.sourceManifest.path));
const priorText = JSON.parse(t.read(joint.modernText[2].path));
const author = JSON.parse(t.read(base + "n48-figure27-repair02-author/report.json"));
const mechanical = readOwn("mechanical-checks.json");
const seals = readOwn("FIRST-seals.json");
const images = readOwn("image-ledger.json");
const dispositions = readOwn("FIRST-dispositions.json");
const firstSealChecks = seals.files.map((item) => {
  const file = own(item.file);
  return {
    path: file,
    sha256: t.digest(fs.readFileSync(file)),
    mode: "0" + (fs.statSync(file).mode & 0o777).toString(8),
    unchanged: t.digest(fs.readFileSync(file)) === item.sha256,
    sealed0444: (fs.statSync(file).mode & 0o777) === 0o444
  };
});
if (!firstSealChecks.every((x) => x.unchanged && x.sealed0444)) throw new Error("FIRST seal drift");
if (images.actualImageLoads !== 8 || images.images.some((x) => x.loads !== 1)) throw new Error("Image-ledger violation");
const inputBindings = t.finishBindings().sort((a, b) => a.path.localeCompare(b.path));
if (inputBindings.some((x) => x.sha256Before !== x.sha256After)) throw new Error("Input drift at completion");
const binding = (file) => {
  const b = inputBindings.find((x) => x.path === path.resolve(t.repo, file));
  if (!b) throw new Error("Missing current binding " + file);
  return b;
};
const pngDimensions = images.images.filter((x) => x.width).map((x) => {
  const bytes = fs.readFileSync(x.path);
  return { path: x.path, declaredWidth: x.width, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
});
if (pngDimensions.some((x) => x.width !== x.declaredWidth)) throw new Error("Wrong current-width PNG");
const block = (ref, kind, status, finding, extra = {}) => ({ ref, kind, status, finding, ...extra });
const pages = [
  {
    physicalPage: 235,
    printedPageCandidate: 228,
    status: "HOLD",
    readableContentStatus: "scoped-pass-except-local-FIRST-disputes",
    nativeAuditStatus: "pass",
    lineCounts: { ownOriginal: 25, nativePrinted: 25, nativeMarkdown: 25, recomputedCandidate: 25 },
    headings: [],
    candidateFiles: sourceManifest.candidateFiles.filter((x) => x.path.includes("/0235/")).map((x) => binding(x.path)),
    blocks: [
      block("p0235#1", "ex243-cont", "pass", "Four-row visible continuation retained: twice-generatrix8.0m, density750 per cubic metre, slope33 degrees, stone volume10m³; closes here.", { inheritedHoldsPreserved: true, predecessorRef: "p0234#10", wholeExerciseApproved: false }),
      block("p0235#2", "ex244", "pass", "Chord a, subtended arc2alpha, generatrix inclination phi, cone-volume task retained in two rows.", { exactPhiGlyphStatus: "HOLD", readableMathOnly: true }),
      block("p0235#3", "ex245", "HOLD", "Three-row right-triangle rotation about hypotenuse and a/beta roles agree. Exact source wording cannot be certified from the FIRST paraphrase 所得到的 versus candidate 所得的.", { mathematicalContentStatus: "pass", hold: "R235-EX245-SUMMARY" }),
      block("p0235#4", "ex246", "pass", "Sector radiusR and alpha in radians, cone-volume request retained."),
      block("p0235#5", "ex247", "pass", "RadiusR sector and maximum funnel capacity angle request retained."),
      block("p0235#6", "ex248", "pass", "Both subparts retained: radii1dm/9dm and generatrix1m; R/r with R>r and frustum-to-original-cone volume ratio."),
      block("p0235#7", "ex249", "HOLD", "Independent FIRST says20cm; candidate says2cm. This may be a reviewer misread and is not a proven candidate error. No guessed correction.", { hold: "R235-EX249-DIAMETER", unchallengedFacts: ["32cm first diameter", "maximal square-section timber", "same length as log", "utilization request"] }),
      block("p0235#8", "ex250", "pass", "Figure103, section of cylindrical iron bucket, millimetres for given dimensions and litres for requested capacity retained.", { figureStatus: "HOLD", figureOwner: "N67", figureRef: "p0236#1 owner-ex250" }),
      block("p0235#9", "ex251", "pass", "Rhombus sidea/acutealpha; rotation axis through obtuse vertex and perpendicular to one side; volume task and closure retained."),
      block("p0235#10", "footer", "HOLD", "FIRST tentatively reads228; last fine footer digit was not confidently established. Candidate228 is consistent but not independently fine-glyph certified.", { blocksReadableBody: false })
    ],
    boundaryStatus: "pass-for-visible-continuation-and-ex251-closure-only",
    wholeLessonApproved: false
  },
  {
    physicalPage: 236,
    printedPage: 229,
    status: "revise",
    readableContentStatus: "revise-one-literal-omission",
    nativeAuditStatus: "pass",
    lineCounts: { ownOriginal: 13, nativePrinted: 13, nativeMarkdown: 13, recomputedCandidate: 13, sameRowCaptionDeduction: 1 },
    headings: ["§68. 球体的体积"],
    candidateFiles: sourceManifest.candidateFiles.filter((x) => x.path.includes("/0236/")).map((x) => binding(x.path)),
    blocks: [
      block("p0236#1", "fig103", "HOLD", "Complete bucket section and dimensions120/140/50/240 preserved; prefix before60 unresolved in both allowed exposures.", { ownerExercise: "250", ownerLesson: "N67", adjoiningRef: "p0235#8", hold: "R103-PREFIX60", blanketBlocksN68: false }),
      block("p0236#2", "cap103", "pass", "Caption103 preserved; shares the printed row with104."),
      block("p0236#3", "fig104", "HOLD", "Single hatched upper semicircle, A/B/O and x/y common coordinate frame preserved in the one native crop. Exact tiny endpoint separator/vector strokes remain local.", { readableStructureStatus: "pass", ownerLesson: "N68", owner: "theorem40 proof", hold: "R104-CROP-OBSERVATION" }),
      block("p0236#4", "cap104-samerow", "pass", "Caption104 preserved with explicit samerow, matching independent row count."),
      block("p0236#5", "h3", "pass", "Actual §68 sphere-volume heading preserved; it starts the new lesson after the figures."),
      block("p0236#6", "theorem40", "revise", "Original FIRST recorded 球体的体积; candidate page.md/page.json have 球的体积, omitting 体. FormulaV=4/3πR³ remains correct.", { defect: "R236-THEOREM40-OMISSION", formulaStatus: "pass" }),
      block("p0236#7", "proof-setup", "pass", "Four rows preserve O, |AB|=2R, OA as horizontal axis, fig104, curvilinear trapezoid and y=sqrt(R²-x²)."),
      block("p0236#8", "proof-integral", "pass", "Rotation about horizontal axis, §66, both -R..R integrals, antiderivativeR²x-x³/3, evaluation bounds, 4/3πR³ and proof-end square retained; four rows total."),
      block("p0236#9", "footer", "pass", "229 preserved.")
    ],
    boundaryStatus: "pass-theorem-proof-closed-no-empty-ex-cont",
    wholeLessonApproved: false
  },
  {
    physicalPage: 237,
    printedPage: 230,
    status: "HOLD",
    readableContentStatus: "pass-except-exact-inequality-glyph",
    nativeAuditStatus: "pass",
    lineCounts: { ownOriginal: 24, nativePrinted: 24, nativeMarkdown: 24, recomputedCandidate: 24 },
    headings: ["习题", "§69. 球面的面积"],
    candidateFiles: sourceManifest.candidateFiles.filter((x) => x.path.includes("/0237/")).map((x) => binding(x.path)),
    blocks: [
      block("p0237#1", "exhead", "pass", "Exercise heading belongs to §68."),
      block("p0237#2", "ex252", "pass", "Ratio of two sphere volumes equals cube ratio of radii/diameters."),
      block("p0237#3", "ex253", "pass", "Both subparts and original wording 增大两倍 retained; Earth13000km and Moon3500km diameter data retained without interpretation or answers."),
      block("p0237#4", "ex254", "pass", "ApproximationV=1/2d³, insufficient/excess and relative-error questions retained in three physical rows."),
      block("p0237#5", "ex255", "pass", "400kg iron sphere and diameter request retained."),
      block("p0237#6", "ex256", "pass", "2m cork sphere and density0.25g/cm³ retained."),
      block("p0237#7", "ex257", "HOLD", "Inclusive inequalityx²+y²+z²<=R² and volume request are readable; exact source leqslant glyph is not independently settled by the allowed full page.", { mathMeaningStatus: "pass", candidateLiteral: "\\leqslant", hold: "R237-EX257-RELATION-GLYPH", authorExtraCropUsedAsIndependentEvidence: false }),
      block("p0237#8", "ex258", "pass", "Sphere equation, homothety centerO/ratiok, image sphere, original 象 wording and volume request retained."),
      block("p0237#9", "ex259", "pass", "All cube vertices on sphere, edgea and enclosed sphere volume request retained; closes before§69."),
      block("p0237#10", "h3", "pass", "Actual §69 surface-area heading belongs to N69, not N68."),
      block("p0237#11", "n69-opening", "pass", "Both opening sentences retained: cylinder/cone surface area via net, sphere cannot unfold on plane. Sentences close; complete N69 remains out of scope."),
      block("p0237#12", "footer", "pass", "230 preserved.")
    ],
    boundaryStatus: "pass-visible-N68-exercises-to-N69-opening",
    n69CompletionStatus: "HOLD",
    source238Examined: false,
    wholeLessonApproved: false
  }
];
const report = {
  schema: "STEMROBIN188/independent-source235237-FIRST-review@1",
  ticket: "STEMROBIN-188",
  assignment: "188-6",
  role: "Sole in-flight independent reviewer; no dispatch",
  workdir: t.repo,
  exclusiveWriteRoot: t.root,
  scope: "First source physical235–237 and first semantic review of current N48 figure27 repair02 only",
  status: "revise-with-local-HOLDs",
  pages,
  defects: [{
    id: "R236-THEOREM40-OMISSION",
    severity: "source-fidelity",
    status: "revise",
    ref: "p0236#6",
    finding: "球体 became 球 in both candidate representations, dropping 体.",
    requestedAction: "Restore the source noun in an authorized candidate repair; reviewer made no mutation.",
    nativeAuditDoesNotDetectIt: true
  }],
  explicitHolds: dispositions.dispositions.filter((x) => /HOLD|local-HOLD/.test(x.status)),
  inheritedHolds: {
    source234: { scopedStatus: "pass-inherited-from-direct-human-instruction", reexamined: false, originalFineGlyphAndFIRSTExposureHolds: "preserved", oldSourceOrPASSRead: false },
    originalFineGlyphAndFIRSTExposureHolds: "All remain; no author FIRST is promoted to independent evidence.",
    predecessor243: { ref: "p0234#10", evidence: binding(sourceManifest.predecessor.path), sourceApproval: false, fullPredecessorOpened: false },
    n69: { status: "HOLD", reason: "Only opening on237 was reviewed; original238 excluded." }
  },
  lessons: [
    { lesson: "N67", status: "HOLD", scope: "Visible235 blocks and236 figure103 only", reasons: ["local independent-FIRST wording/diameter conflicts", "figure103 unreadable prefix60"], unrelatedN68BlockedByFigure103: false, wholeLessonApproved: false },
    { lesson: "N68", status: "revise-with-local-HOLDs", scope: "236 theorem/proof and237 exercises252–259", reasons: ["theorem40 literal omission", "local fig104 fine separators/vector strokes", "ex257 exact relation glyph"], bodyFormulasAndOwnership: "pass", wholeLessonApproved: false },
    { lesson: "N69", status: "HOLD", scope: "237 heading and two opening sentences pass", reasons: ["full lesson/source238 not reviewed"], wholeLessonApproved: false },
    { lesson: "N48", status: "HOLD", scope: "figure27 current repair02 only", reasons: ["independent source-FIRST relationship conflict"], wholeLessonApproved: false }
  ],
  fullSourceContentRead: { pageMarkdown: 3, pageJson: 3, nativeAudit: 3, sourceOriginalImages: 3, sourceCrops: 2, nativeReruns: 0 },
  nativeEvidence: { path: own("mechanical-checks.json"), allPageCountsPass: true, countExclusions: [], semanticPASSImplied: false },
  ownFIRSTs: firstSealChecks,
  ownFIRSTDispositions: own("FIRST-dispositions.json"),
  figure27Review: own("n48-figure27-review.json"),
  imageLedger: own("image-ledger.json"),
  actualImageLoads: 8,
  contextImageLoads: 8,
  cumulativeFigureContentRepairs: 2,
  thisReviewerContentRepairs: 0,
  originalFailuresPreserved: true,
  originalFailuresIndependentlyReread: false,
  readOnlyInputsUnchanged: true,
  inputBindings,
  sourceOrCandidateMutations: 0,
  codeMutationsOutsideOwnReviewRoot: 0,
  dbCalls: 0,
  envReads: 0,
  networkCalls: 0,
  modelCalls: 0,
  rendererCalls: 0,
  agentDispatches: 0,
  gitMutations: 0,
  productAcceptance: false,
  wholeLessonApproved: false,
  published: false
};
const figureReview = {
  schema: "STEMROBIN188/independent-N48-current-figure27-review@1",
  ticket: "STEMROBIN-188",
  assignment: "188-6",
  figure: "fig-g10-27",
  lesson: "geo910-c2-s2-n48",
  exercise: "59",
  currentRepair: "repair02",
  firstSemanticReviewOfCurrentRepair02: true,
  status: "HOLD",
  verdictReason: "Current arithmetic, task semantics and widths pass. Blind FIRST misread crowded K/L construction as possible perpendicular feet and failed to inventory both complete diagonals. That independent source-relationship conflict is unresolved; do not convert post-author/spec exposure into independent source PASS or request a guessed right-angle repair.",
  currentInputBindings: [
    joint.figure27.source.path,
    joint.figure27.spec.path,
    joint.figure27.svg.path,
    joint.figure27.render.path,
    ...joint.figure27.currentWidthImages.map((x) => x.path),
    ...joint.modernText.map((x) => x.path)
  ].map(binding),
  inputBindings,
  ownFIRST: firstSealChecks.find((x) => x.path.endsWith("FIRST-fig-g10-27.json")),
  sourcePreservation: {
    status: "HOLD",
    independentlyReadableObjectsStatus: "pass",
    retainedTokens: ["A", "B", "C", "D", "A1", "B1", "C1", "D1", "K", "L"],
    retainedStructure: ["one common quadrilateral prism frame", "source visible/hidden outline distinction", "one hatched diagonal section", "top/bottom K/L labels", "dashed interior KL"],
    disputedRelations: ["complete A1C1/AC diagonals and their crossings versus FIRST's overinterpreted perpendicular-foot reading"],
    noAuthorFIRSTTreatedAsIndependent: true,
    localExactHatchFineGlyphAllInkHoldsPreserved: true
  },
  mathematics: {
    status: "pass-for-current-spec-and-current-exercise59",
    numericAssertionsPass: 30,
    pointCount: 10,
    segmentCount: 33,
    sourceMappingIdsAndRequiredPointRelationshipsResolve: true,
    finding: "Corresponding bases differ by(0,320); K lies on both top diagonals, L on both lower diagonals; KL parallels lateral edges. A general quadrilateral base is used, without a right/regular-prism condition. Machine checks are not visual-source proof."
  },
  visual: {
    status: "pass",
    widths: [
      { width: 480, imageLoads: 1, minimumTextPxFromBoundNativeReport: 28, observed: "Nonblank; all10 labels readable; B1 below/right of corner and clear of adjacent B1C1 stroke; no clipping or misleading label association." },
      { width: 300, imageLoads: 1, minimumTextPxFromBoundNativeReport: 17.5, observed: "Nonblank; subscripts and K/L readable; B1 clear; dashed construction and hatched plane distinguishable; no added answer wording." }
    ],
    pngDimensions,
    nativeCollisions: [],
    boundNativeReportStatus: "pass",
    rendererRerun: false,
    productWidthMeasurementPerformed: false,
    liveProductAcceptanceImplied: false
  },
  englishAndCulture: { status: "pass", finding: "Only Latin point names with numeric subscripts; no Chinese, Cyrillic, cultural symbols or old-paper texture in current images. Semantic vector roles/CSS variables retained." },
  noAnswerLeak: { status: "pass", finding: "No displayed proof, computed measurement, volume, parallel tick marks, right-angle marks or solution text. KL is a construction line, not a written answer. Exercise61's supplied solution elsewhere in the complete N48 text was not used as an answer source for figure59." },
  currentModernText: {
    proseObjectsRead: 15,
    exercisesRead: 10,
    completeCurrentObjectsEqualPreviouslyReviewedBindings: 25,
    priorScopedTextStatus: priorText.status,
    priorReviewBinding: binding(joint.modernText[2].path),
    exactSourceGlyphApprovalInherited: false,
    allPriorModernTextHoldsPreserved: priorText.holds,
    specAuthoritativeTextStillSaysInitialTemplate: true,
    currentFullTextBoundHereExternally: true,
    wholeN48Approved: false
  },
  originalFailureHistory: {
    cumulativeActualContentRepairs: 2,
    thisReviewerContentRepairs: 0,
    firstRepair: "hatch-direction correction retained; no old image reopened",
    currentRepair: "B1 label shifted from E to SE, as author repair history states; current two widths independently observed",
    oldFAILNotErased: true,
    historyProviderBinding: binding(base + "n48-figure27-repair02-author/report.json"),
    priorFailureReferencesFromCurrentAuthorReport: author.priorFailureReferences,
    priorFailureBytesNotIndependentlyReread: true,
    contentRepairCounterReset: false
  },
  nativeReview: {
    created: false,
    expectedOutputIfPassed: own("fig-g10-27.review.json"),
    recordReviewInvoked: false,
    reason: "Conditional PASS prerequisite not satisfied. Do not write native status:pass while independent source-relationship gate is held."
  },
  actualImageLoadsThisReview: 8,
  original27Loads: 1,
  current27Loads: 2,
  productAcceptance: false,
  sourceAllInkApproved: false,
  wholeLessonApproved: false,
  promoted: false,
  published: false
};
t.output("report.json", report);
t.output("n48-figure27-review.json", figureReview);
t.output("verification.json", {
  schema: "review-completion-verification@1",
  inputBindingCount: inputBindings.length,
  allBeforeAfterHashesEqual: true,
  firstSealChecks,
  actualImageLoads: 8,
  manifestCurrentInputsMatch: [joint.sourceManifest, ...joint.modernText, joint.figure27.source, joint.figure27.spec, joint.figure27.svg, joint.figure27.render, ...joint.figure27.currentWidthImages, ...sourceManifest.candidateFiles, ...sourceManifest.crops].every((x) => binding(x.path).sha256After === x.sha256),
  pageCounts: mechanical.pages.map((x) => ({ page: x.page, expectedIndependentRows: x.independentOriginalRows, candidateRows: x.computedCandidateRows, nativeRows: x.nativePrintedRows, pass: x.allCountsEqual })),
  numericAssertionsPass: mechanical.figure.allNumericAssertionsPass,
  currentTextBindingsPass: mechanical.figure.allReviewedCurrentTextBindingsEqual,
  reviewToolTechnicalRecovery: { count: 1, issue: "Prose figure/caption objects selected by wrong category in first mechanical text-binding pass", initialEvidence: own("mechanical-checks.initial.json"), repairedEvidence: own("mechanical-checks.json"), sourceOrFigureRepairs: 0, rendererCalls: 0 },
  nativeReviewNotWrittenBecauseHOLD: true,
  outputRoot: t.root
});
t.index();
console.log(JSON.stringify({ sourceStatus: report.status, pageVerdicts: pages.map((x) => ({ page: x.physicalPage, status: x.status })), figure27Status: figureReview.status, images: images.actualImageLoads, report: { path: own("report.json"), sha256: t.digest(fs.readFileSync(own("report.json"))) }, figureReview: { path: own("n48-figure27-review.json"), sha256: t.digest(fs.readFileSync(own("n48-figure27-review.json"))) }, index: { path: own("output-index.json"), sha256: t.digest(fs.readFileSync(own("output-index.json"))) } }, null, 2));
