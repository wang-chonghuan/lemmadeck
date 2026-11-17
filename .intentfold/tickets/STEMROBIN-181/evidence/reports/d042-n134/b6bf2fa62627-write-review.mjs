import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const evidenceDir = dirname(fileURLToPath(import.meta.url));
const tmp = dirname(evidenceDir);
const workspace = resolve(tmp, "../../../..");
const output = resolve(tmp, "d042-n134-display-review.json");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const binding = (entry) => {
  const path = resolve(workspace, entry.path);
  const sha256 = digest(readFileSync(path));
  assert.equal(sha256, entry.sha256, `Binding changed: ${path}`);
  return { ...entry, path, sha256, verified: true };
};
const receipt = (relative, sha256) => binding({ path: resolve(tmp, relative), sha256 });
const writeJson = (name, value) => {
  const path = resolve(evidenceDir, name);
  const bytes = `${JSON.stringify(value, null, 2)}\n`;
  writeFileSync(path, bytes, { flag: "wx" });
  return { path, sha256: digest(bytes) };
};

const receipts = {
  screenshotManifest: receipt(
    "d042-n134-display/screenshot-manifest.json",
    "11713ba9b127071400328ca4367315f988bd16e50f3691bd36736428d9cc41fe",
  ),
  displayResult: receipt(
    "d042-n134-display/result.json",
    "1deb0e1646885662787ec6b2a95ac21e18677fa16acfb69294dd20ffc0993379",
  ),
  affectedDOMResult: receipt(
    "d042-n134-display-affected/result.json",
    "27801078c3f086b77b0073eb1df7eba91425f7df9b741d1243fa383557bbd167",
  ),
  nativeResult: receipt(
    "d042-n134-native/result.json",
    "7f4e05b65d4383bac08e2b02601d4cd84eb87c924a1c3b3026ba1471ff052e3f",
  ),
};
const manifest = read(receipts.screenshotManifest.path);
const prior = read(receipts.displayResult.path);
const affected = read(receipts.affectedDOMResult.path);
const native = read(receipts.nativeResult.path);
assert.equal(manifest.screenshots.length, 8);
assert.equal(prior.failures.length, 12);
assert.equal(prior.status, "FAIL-preserved-no-repair");
assert.equal(affected.status, "FAIL-affected");
assert.deepEqual(native.counts, {
  sourceExercises: 0, modernExercises: 0, modernFigures: 3,
});

// These observations were made in order from eight successful view_image calls.
// This script only binds existing files; it neither opens images nor renders HTML.
const observations = [
  {
    id: "zh-text-1440x960",
    displayed: [1234, 6000],
    notes: [
      "Chinese title, print-page metadata, complete prose flow, separators, all three figures and final zero-exercise link are visible.",
      "Single centered reading column; paragraphs and displayed equations have clear vertical separation through the page end.",
      "B = mu B_0, I = B - B_0, I = (mu - 1) B_0, equation numbers, inline Greek mu, subscripts and primes show no visible glyph truncation.",
    ],
  },
  {
    id: "zh-exercises-1440x960",
    displayed: [1440, 960],
    notes: [
      "Chinese exercise title and print-page metadata fit on the page; return-to-text link is separate and readable.",
      "Otherwise empty white exercise surface, consistent with zero source and zero modern exercises; no invented questions or exercise figures.",
    ],
  },
  {
    id: "zh-text-390x844",
    displayed: [287, 6000],
    notes: [
      "Chinese title fits; full narrow reading column wraps inside the margins from the first paragraph through the final zero-exercise link.",
      "Separators, equations and all three figures remain visibly distinct from adjacent prose; no visible page-edge truncation or overlapping blocks.",
      "Formula subscripts, Greek mu, equation numbers and prime-bearing references remain discernible with no visible clipping.",
    ],
  },
  {
    id: "zh-exercises-390x844",
    displayed: [390, 844],
    notes: [
      "Chinese exercise heading fits a single line within the margins; metadata and return-to-text link remain separated.",
      "The remaining blank page is truthful for the bound zero-exercise inputs; no questions or figures are missing from an expected nonempty list.",
    ],
  },
  {
    id: "en-text-1440x960",
    displayed: [848, 6000],
    notes: [
      "English title and complete English lesson prose are visible in a centered column; bold terms, equations, separators and figure captions remain separated through the footer.",
      "All three figures are clear; inline and displayed mathematics show no visible clipping, missing glyph boxes or raw TeX delimiters.",
      "Native renderer print-page metadata and the zero-exercise navigation link remain Chinese; this is not evidence of fully localized product chrome.",
    ],
  },
  {
    id: "en-exercises-1440x960",
    displayed: [1440, 960],
    notes: [
      "English lesson title plus the native Chinese exercise suffix fit on one line; Chinese print-page metadata and return link remain readable.",
      "Empty exercise surface agrees with the zero-exercise inputs; no overlap, fabricated question or broken media is visible.",
    ],
  },
  {
    id: "en-text-390x844",
    displayed: [171, 6000],
    notes: [
      "English lesson title wraps onto two lines; prose, long terms, equations, separators and all three figures remain within the narrow column.",
      "The complete page, including the last figure caption and zero-exercise link, is present without visible block overlap or edge clipping.",
      "Formula glyphs and figure labels remain distinguishable in the tool-displayed full-page image; the tool's strong downscaling limits subpixel inspection.",
      "Chinese native navigation and print-page metadata remain visible; product UI localization and interaction were not evaluated.",
    ],
  },
  {
    id: "en-exercises-390x844",
    displayed: [390, 844],
    notes: [
      "The exercise heading wraps onto three lines: two English-title lines followed by the final Chinese character of the native exercise suffix.",
      "This wrap is not clipped or overlapping; print-page metadata and return-to-text link move below it with clear separation.",
      "The page is otherwise empty, correctly matching the zero-exercise native inputs; retained Chinese renderer chrome is explicitly noted.",
    ],
  },
];
const figureVisuals = [
  {
    id: "fig-301",
    status: "PASS-visual",
    labels: ["I", "B_0", "0"],
    notes: "Rising initial curve bends toward saturation; both arrowed axes, origin label and subscripted horizontal-axis label are clear and separated from the curve and caption.",
  },
  {
    id: "fig-302",
    status: "PASS-visual",
    labels: ["I", "B_0", "o", "a", "b", "c", "a'", "b'", "c'"],
    notes: "Closed hysteresis loop, initial branch and directional arrows are visible; positive and prime-bearing negative labels are distinguishable. The spaced B and subscript 0 remain legible, with no label collision.",
  },
  {
    id: "fig-303",
    status: "PASS-visual",
    labels: ["(a) Soft magnetic", "(b) Hard magnetic", "I", "B_0", "0"],
    notes: "Both vertically stacked panels are complete. Narrow soft-material and wider hard-material loops are visibly distinct; both headings, axes, origins and subscripted labels are clear, with no panel or caption overlap.",
  },
];

const ledger = manifest.screenshots.map((screenshot, index) => {
  const observation = observations[index];
  assert.equal(observation.id, screenshot.surface);
  const screenshotBinding = binding(screenshot);
  const nativeHtml = binding(screenshot.nativeHtml);
  const png = readFileSync(screenshot.path);
  assert.equal(png.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), screenshot.width);
  assert.equal(png.readUInt32BE(20), screenshot.height);
  return {
    sequence: index + 1,
    surface: screenshot.surface,
    tool: "functions.view_image",
    path: screenshotBinding.path,
    sha256: screenshotBinding.sha256,
    requestedDetail: "original",
    outcome: "success-image-displayed-firsthand",
    openedOnce: true,
    fullPage: true,
    nativeHtml,
    screenshotDimensions: { width: screenshot.width, height: screenshot.height },
    toolDisplayedDimensions: { width: observation.displayed[0], height: observation.displayed[1] },
    resizedByTool: screenshot.height > 6000,
    toolReceiptBasis: "Successful view_image result and, for long text pages, the accompanying image_resize_notice in this reviewer's conversation.",
    crop: false,
    reopen: false,
  };
});
const nativeLanguages = native.languages.map((language) => ({
  language: language.language,
  finalize: binding(language.finalize),
  render: binding(language.render),
  nativeOutputs: language.nativeOutputs.map(binding),
  displayOutputs: language.outputs.map(binding),
  html: language.html.map(binding),
  displayBinding: language.displayBinding,
}));
const bindingsEvidence = writeJson("bindings.json", {
  schema: "native-display-review-bindings@1",
  ticket: native.ticket,
  card: native.card,
  receipts,
  screenshots: ledger.map(({ surface, path, sha256, nativeHtml }) => ({
    surface, path, sha256, nativeHtml,
  })),
  exactNativeInputs: prior.exactNativeInputs.map(binding),
  nativeFinalizationInputs: native.inputs.map(binding),
  nativeFlowInputs: prior.nativeFlowInputs.map(binding),
  consumedReviewBindings: prior.consumedReviews.map(binding),
  nativeLanguages,
  verification: "Read-only SHA-256 checks against the existing bound inputs and receipts; no render, browser replay, assertion rerun or substantive science/source review.",
});
const failuresEvidence = writeJson("preserved-failures.json", {
  schema: "native-display-review-preserved-failures@1",
  priorDisplay: {
    ...receipts.displayResult,
    status: prior.status,
    failureCount: prior.failures.length,
    failures: prior.failures,
  },
  affectedDOM: {
    ...receipts.affectedDOMResult,
    status: affected.status,
    failureCount: affected.failures.length,
    failures: affected.failures,
  },
  modifiedOriginalReceipts: false,
  resolvedAssertions: [],
  note: "Verbatim failed-assertion objects are retained. PASS-visual is a separate firsthand visual verdict and does not clear either failing receipt.",
});
const cutoffGlyphs = affected.failures
  .filter((failure) => failure.label === "actual-formula-glyph-cutoff")
  .flatMap((failure) => failure.formula.glyphCutoffs);
assert.equal(cutoffGlyphs.length, 68);
assert.ok(cutoffGlyphs.every((glyph) => glyph.text === "\u200b" && glyph.width === 0));
const affectedMetrics = affected.surfaces.map((surface) => {
  const labels = surface.observed.figures.flatMap((figure) => figure.labels);
  return {
    surface: surface.id,
    origin: "Existing affected DOM receipt, not a newly executed check",
    minimumFigureLabelScreenPx: Math.min(...labels.map((label) => label.size)),
    figureFontFamilies: [...new Set(labels.map((label) => label.font))],
    combiningVectorLabelCount: labels.filter((label) => label.text.includes("\u20d7")).length,
    figureLabels: surface.observed.figures.map((figure) => ({
      id: figure.id, labels: figure.labels,
    })),
  };
});
const surfaces = observations.map((observation, index) => {
  const image = ledger[index];
  const machineSurface = prior.surfaces.find((surface) => surface.id === observation.id);
  assert.ok(machineSurface);
  const isText = machineSurface.kind === "text";
  return {
    id: observation.id,
    language: machineSurface.language,
    kind: machineSurface.kind,
    viewport: machineSurface.viewport,
    status: "PASS-visual",
    firsthand: true,
    screenshot: { path: image.path, sha256: image.sha256, fullPage: true, ...image.screenshotDimensions },
    nativeHtml: image.nativeHtml,
    imageOpenLedgerSequence: image.sequence,
    checks: {
      fullPageReadabilityAndLayout: "PASS-visual",
      overlap: "none-visible",
      visibleFormulaGlyphClipping: isText ? "none-visible-at-tool-display-scale" : "not-applicable-no-formulas",
      figures301Through303: isText ? "all-three-complete-and-labels-distinguishable" : "not-applicable-truthful-empty-exercise-surface",
      footer: "visible-separated-from-content",
      exercises: "zero-source-and-zero-modern-bound",
    },
    observations: observation.notes,
    figureReview: isText ? figureVisuals : [],
    defects: [],
    supplementalPriorReceipt: {
      source: receipts.displayResult,
      status: machineSurface.status,
      failures: machineSurface.failures,
      scroll: machineSurface.observed.scroll,
      exerciseCount: machineSurface.observed.exerciseCount,
      endReachable: machineSurface.endReachable,
      provenance: "Copied existing measurements; no browser replay or assertion reclassification.",
    },
  };
});
assert.equal(surfaces.length, 8);
const report = {
  schema: "ld-s10y-lesson/native-full-card-display-review@1",
  ticket: native.ticket,
  card: native.card,
  status: "PASS-visual",
  reviewScope: "Fresh bounded firsthand review of exactly the eight existing screenshot-manifest images, one at a time using functions.view_image.",
  decision: "The eight displayed screenshots show readable full-page layouts, discernible formulas and complete figures 301-303 without visible clipping or overlap; zero-exercise surfaces agree with the bound native inputs.",
  evidenceBindings: {
    ...receipts,
    verifiedNativeInputsAndReceipts: bindingsEvidence,
    preservedFailures: failuresEvidence,
    reportBuilder: { path: fileURLToPath(import.meta.url), sha256: digest(readFileSync(fileURLToPath(import.meta.url))) },
    nativeLanguages,
  },
  surfaces,
  imageOpenLedger: ledger,
  imageOpenCounts: {
    budget: 8,
    successfulViewImageCalls: 8,
    uniqueManifestScreenshots: 8,
    reopens: 0,
    crops: 0,
    extraImages: 0,
    originalOrFigureImagesOpened: 0,
    evidenceScriptImageOpens: 0,
  },
  preservedAssertionStatus: {
    priorDisplayStatus: prior.status,
    priorDisplayFailedAssertions: 12,
    priorFailedAssertionLabels: prior.failures.map((failure) => failure.label),
    affectedDOMStatus: affected.status,
    affectedDOMFailedAssertions: affected.failures.length,
    evidence: failuresEvidence,
    resolutionsApplied: 0,
    originalReceiptsUnchanged: true,
    separateResolutionOverlayConsumed: false,
    promotionBlockedByThisReview: "This visual report grants no promotion and does not adjudicate or clear failed automated assertions.",
  },
  supplementalExistingDOMObservations: {
    evidence: receipts.affectedDOMResult,
    recordedCutoffGlyphCount: cutoffGlyphs.length,
    recordedCutoffCodepoint: "U+200B",
    recordedCutoffWidth: 0,
    ordinaryVisibleCutoffGlyphsInRecordedList: 0,
    figureMetrics: affectedMetrics,
    vectorFontCondition: {
      source: prior.nativeFlowInputs.find((entry) => entry.path.endsWith("/htmlfrag.js")),
      function: "withVectorGlyphFont",
      line: 163,
      condition: "The existing function returns SVG unchanged when U+20D7 combining vector is absent; these recorded figure labels contain no U+20D7.",
      resolutionApplied: false,
    },
    note: "Read-only characterization of existing receipts/code, not an automatic PASS and not the parent's resolution overlay.",
  },
  emptyExercises: {
    sourceCount: native.counts.sourceExercises,
    modernCount: native.counts.modernExercises,
    allowed: true,
    observedExerciseSurfaces: 4,
    visibleInventedExercises: 0,
  },
  limitations: [
    "Native/offline only. No live app, app shell, database, backend, authentication, browser replay, rerender or product interaction was performed.",
    "The pre-existing display run was isolated headless native HTML evidence; this review is not headed formal product acceptance.",
    "view_image was requested with detail original, but the tool resized all four long text screenshots to 6000 pixels high. Exact resizing is recorded in the image-open ledger; subpixel glyph geometry is not newly certified.",
    "English body/title display is visible, while native renderer metadata, exercise suffix and navigation remain Chinese. Fully localized learner-facing product chrome is not approved.",
    "No original-source image, independent figure source fidelity or science/translation review was repeated; those bindings are provenance only.",
    "All original automated failures remain preserved. No separate resolution overlay was consumed or assumed to pass.",
  ],
  actions: {
    nativeRerenders: 0,
    browserReplays: 0,
    setupOrUpdates: 0,
    dependencyOrAppOrCharterEdits: 0,
    backendDatabaseOrGitOperations: 0,
    canonicalPromotion: false,
    fullCardApproval: false,
    formalProductApproval: false,
    writesLimitedToOwnedReviewAndEvidence: true,
  },
};
for (const entry of Object.values(receipts)) binding(entry);
writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
const final = read(output);
assert.equal(final.surfaces.length, 8);
assert.equal(final.imageOpenLedger.length, 8);
assert.deepEqual(read(failuresEvidence.path).priorDisplay.failures, prior.failures);
assert.deepEqual(read(failuresEvidence.path).affectedDOM.failures, affected.failures);
console.log(JSON.stringify({
  path: output, sha256: digest(readFileSync(output)), status: final.status,
  surfaces: final.surfaces.length, imageOpens: final.imageOpenCounts.successfulViewImageCalls,
  originalFailuresPreserved: final.preservedAssertionStatus.priorDisplayFailedAssertions,
}));
