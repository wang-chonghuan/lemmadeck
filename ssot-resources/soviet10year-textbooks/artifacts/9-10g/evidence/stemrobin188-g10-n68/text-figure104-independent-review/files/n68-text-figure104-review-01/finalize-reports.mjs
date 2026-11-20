import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp`;
assert.equal(process.cwd(), repo);
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const digest = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const binding = (p) => ({ path: p, sha256After: digest(p) });
const writeNew = (name, value) => {
  const target = path.join(root, name);
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
  fs.chmodSync(target, 0o444);
};
const manifest = read(`${tmp}/n68-text-figure104-review-inputs-01/manifest.json`);
const lesson = read(manifest.currentText[0].path);
const exercises = read(manifest.currentText[1].path);
const rawLesson = read(manifest.rawLesson.path);
const rawExercises = read(manifest.rawExercises.path);
const spec = read(manifest.figure.spec.path);
const render = read(manifest.figure.render.path);
const boundaries = read(`${tmp}/n68-text-author-01/prose-flow-boundaries.json`);
const firstLesson = read(`${tmp}/n68-text-author-01/FIRST-lesson.template.json`);
const first = read(path.join(root, "FIRST.json"));
const nativePath = path.join(root, "fig-g10-104.review.json");
const native = read(nativePath);
const before = read(path.join(root, "inputs-before.json"));
const inputBindings = before.inputs.map((record) => {
  const stat = fs.statSync(record.path);
  const after = digest(record.path);
  assert.equal(after, record.sha256Before, `Changed input ${record.path}`);
  assert.equal(stat.size, record.bytes);
  assert.equal(`0${(stat.mode & 0o777).toString(8)}`, record.mode);
  return { path: record.path, sha256Before: record.sha256Before, sha256After: after };
});
assert.deepEqual(lesson.source.data, rawLesson);
assert.deepEqual(exercises.source.data, rawExercises);
assert.equal(lesson.source.sha256, digest(manifest.rawLesson.path));
assert.equal(exercises.source.sha256, digest(manifest.rawExercises.path));
assert.equal(lesson.prose.length, 5);
assert.equal(exercises.exercises.length, 8);
assert.equal(exercises.count, 8);
assert.equal(lesson.exercise_count, 8);
assert.equal(spec.source.image.sha256, first.source.sha256);
assert.equal(fs.statSync(path.join(root, "FIRST.json")).mode & 0o777, 0o444);
assert.equal(digest(path.join(root, "FIRST.json")),
  "b7ac1ea74ce952911f0d17b2440a5b33e17148c9f9d0c03cb9478a2120ca4229");
for (const key of [
  "id", "card_id", "chapter", "section", "number", "title", "printed_title",
  "start_page", "start_printed", "figures", "exercise_count",
]) assert.deepEqual(lesson[key], rawLesson[key], key);
const { section_breaks: ignoredFinal, ...withoutFinalBreaks } = lesson;
const { section_breaks: ignoredFirst, ...withoutFirstBreaks } = firstLesson;
assert.deepEqual(withoutFinalBreaks, withoutFirstBreaks);
assert.deepEqual(lesson.section_breaks, boundaries.selectedBoundaryObjects);
assert.equal(boundaries.nativeParagraphCount, 5);
assert.deepEqual(boundaries.resolvedIndicesFromNativeParser, [1, 3]);
assert.equal(boundaries.inputFirst.sha256, digest(boundaries.inputFirst.path));
assert.equal(boundaries.finalCandidate.sha256, digest(boundaries.finalCandidate.path));
assert.equal(boundaries.nativeStdout.sha256, digest(boundaries.nativeStdout.path));
for (const selected of lesson.section_breaks) {
  assert(boundaries.allBoundaryObjects.some((candidate) =>
    candidate.before === selected.before && candidate.after === selected.after));
}
const expectedContext = [
  { lesson: lesson.id, text: lesson.printed_title },
  ...lesson.prose.filter((v) => v.text).map((v) => ({ lesson: lesson.id, text: v.text })),
  ...exercises.exercises.map((v) => ({
    lesson: lesson.id, exercise: v.number, text: v.text,
  })),
];
assert.deepEqual(spec.source.authoritativeText, expectedContext);
assert.equal(render.status, "pass");
assert.equal(render.spec.sha256, digest(manifest.figure.spec.path));
assert.equal(render.output.svg.sha256, digest(manifest.figure.svg.path));
assert.equal(native.status, "pass");
assert.equal(native.spec.sha256, digest(manifest.figure.spec.path));
assert.equal(native.render.sha256, digest(manifest.figure.render.path));
assert.equal(native.outputs.svg.sha256, digest(manifest.figure.svg.path));
assert.equal(native.source.sha256, first.source.sha256);

const mathSpans = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((v) => v[1]);
const numbers = (text) => text.match(/\d+(?:\.\d+)?/g) ?? [];
const common = (raw, modern) => {
  assert.equal(modern.source_text, raw.text);
  assert.deepEqual(mathSpans(modern.text), mathSpans(raw.text));
  assert.deepEqual(numbers(modern.text), numbers(raw.text));
  assert(!mathSpans(modern.text).some((v) => /[、，；。？！：]/.test(v)));
  assert(!/[\u0400-\u052f]/.test(modern.text));
  assert.deepEqual(modern.numeric_changes, []);
  assert.deepEqual(modern.historical_entities, []);
  assert(modern.changes.every((v) => ["wording", "layout"].includes(v)));
  return {
    sourceTextMatchesRaw: true,
    mathSpansExact: true,
    numericTokensExact: true,
    chinesePunctuationOutsideMath: true,
    numeric_changes: [],
    historical_entities: [],
    changes: modern.changes,
  };
};
const proseVerdicts = [
  "Theorem 40 retains the sphere solid, radius R, and V=4/3 pi R^3, with the source-restored solid noun intact.",
  "Proof setup retains center O, diameter |AB|=2R, origin O, positive horizontal OA, rectangular axes, figure104, and upper function sqrt(R^2-x^2) enclosing the region with the horizontal axis.",
  "The single prose-owned fig-g10-104 object and p0236#3 binding are retained; no exercise figure or ownership reassignment.",
  "Figure caption and p0236#4 binding remain unchanged.",
  "Rotation about the horizontal axis, section66 reference, integration bounds -R to R, both integrands, antiderivative, endpoint evaluation and conclusion are retained in their original order.",
];
const exerciseVerdicts = [
  "252 retains the proof task comparing sphere-volume ratio with the cube of corresponding radius or diameter ratio.",
  "253 retains both subparts in order and on separate lines, Earth diameter 1 wan 3 qian km and Moon diameter 3.5 qian km. The literal volume-increase wording is preserved without selecting a final-factor interpretation.",
  "254 retains V=1/2 d^3, the under/overestimate question, and relative-error task. Modern plain-language wording does not supply the answer.",
  "255 retains iron material, 400kg and the diameter question. Weight-to-mass terminology is appropriate for kg, and no missing density or numerical answer is invented.",
  "256 retains cork material, diameter 2m, mass question and 0.25 g/cm^3. Density wording reflects the source's mass-per-volume unit without changing its value.",
  "257 retains the spatial inequality x^2+y^2+z^2 <= R^2 and volume task. Inclusion of the boundary is a semantic PASS; the exact original slanted relation glyph remains HOLD.",
  "258 retains the sphere bounded by the given equation, homothety center O and ratio k, the image sphere and its volume task, without adding a sign restriction or answer expression.",
  "259 retains all cube vertices on one sphere, edge length a, and the enclosed sphere-solid volume task, without supplying the radius or volume.",
];
const objects = lesson.prose.map((modern, index) => {
  const raw = rawLesson.prose[index];
  assert.deepEqual(modern.source_refs, raw.source_refs);
  for (const key of ["kind", "id", "label", "printed_page"]) {
    assert.deepEqual(modern[key], raw[key]);
  }
  return {
    id: `prose-${index + 1}`,
    kind: modern.kind,
    status: "pass",
    source_refs: modern.source_refs,
    ...common(raw, modern),
    finding: proseVerdicts[index],
  };
});
exercises.exercises.forEach((modern, index) => {
  const raw = rawExercises.exercises[index];
  assert.equal(modern.number, String(252 + index));
  for (const key of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) {
    assert.deepEqual(modern[key], raw[key], `exercise${modern.number}.${key}`);
  }
  assert.equal(modern.lines.join("\n"), modern.text);
  objects.push({
    id: `exercise-${modern.number}`,
    kind: "exercise",
    status: "pass",
    source_refs: modern.pages,
    ...common(raw, modern),
    finding: exerciseVerdicts[index],
  });
});
assert.equal(objects.length, 13);
assert.equal(exercises.exercises[1].lines.length, 3);
assert(exercises.exercises[1].text.includes("\u589e\u5927\u4e24\u500d"));
assert(!exercises.exercises[3].text.includes("\u5bc6\u5ea6"));
assert(exercises.exercises[5].text.includes("\\leqslant"));

const exactHolds = [
  {
    id: "R104-CROP-OBSERVATION",
    status: "hold",
    scope: "Exact original endpoint-coordinate punctuation and fine basis-vector glyph strokes only",
    finding: "Conventional comma tuples and arrow-accented i/j preserve mathematical roles. They do not certify source strokes character-for-character.",
    sourceMathSemanticStatus: "pass",
    requestedCandidateChange: null,
  },
  {
    id: "R237-EX257-RELATION-GLYPH",
    status: "hold",
    scope: "Exact original inequality glyph only",
    finding: "The inclusive region is retained and semantically passed. Literal candidate \\leqslant is unchanged; original slanted-glyph encoding is not independently recertified.",
    sourceMathSemanticStatus: "pass",
    requestedCandidateChange: null,
  },
];
const preservedTextIssues = [
  {
    id: "N68-EX253-AMBIGUITY-PRESERVED",
    classification: "source-ambiguity-retained",
    scope: "exercise253 subpart2",
    status: "pass",
    finding: "The exact phrase \u589e\u5927\u4e24\u500d remains. No author/reviewer choice of a doubled-final-volume versus additive-increase interpretation is inserted.",
    requestedCandidateChange: null,
  },
  {
    id: "N68-EX255-MISSING-DENSITY-PRESERVED",
    classification: "source-underdetermination-retained",
    scope: "exercise255",
    status: "pass",
    finding: "400kg and the diameter question remain, but iron density is not given. The candidate correctly does not invent a density or a unique numerical diameter.",
    requestedCandidateChange: null,
  },
];
const history = {
  firstParentCollisionFailure: {
    ...binding(`${tmp}/n68-figure104-author-01/fig-g10-104.render.json`),
    status: "fail",
    collisions: ["104-O-label", "104-A-label", "104-B-label", "104-x-label-label"],
    retainedNotReplaced: true,
  },
  singleTargetedLabelRepair: {
    ...binding(`${tmp}/n68-figure104-author-01/repair01.json`),
    contentRepairsUsed: 1,
    changedFieldsOnly: ["O/A/B labelPlacement.gap", "x-label.at"],
    geometryAndAssertionsUnchangedByRecordedRepair: true,
    reviewerRepairs: 0,
  },
  parentFIRSTProcedureLimitation: {
    ...binding(`${tmp}/n68-figure104-author-01/source-observation-FIRST.json`),
    classification: "historical-order-limitation",
    finding: "Parent observation was persisted after helper code and prior readable-structure evidence were read. It remains author provenance, not sealed independent FIRST evidence.",
    unchanged: true,
    independentEvidenceSubstitution: false,
    newGateCreated: false,
  },
};
writeNew("comparison-receipt.json", {
  schema: "stemrobin188-independent-comparison-receipt@1",
  status: "pass",
  cwd: repo,
  sourceSnapshotsMatchRaw: true,
  topLevelIdentityAndCountsPreserved: true,
  objectsCompared: 13,
  objects,
  currentSpecFullModernContextExact: true,
  finalTextDiffersFromNativeFlowInputOnlyBySectionBreaks: true,
  selectedBoundariesMatchNativeAdjacentParagraphAnchors: true,
  paragraphsFromExistingNativeEvidence: 5,
  selectedBoundaryIndicesFromExistingNativeEvidence: [1, 3],
  existingNativeEvidenceReused: true,
  nativeCheckReplay: 0,
  rendererReplay: 0,
});
writeNew("FIRST-seal.json", {
  schema: "stemrobin188-review-first-seal@1",
  status: "pass",
  FIRST: {
    path: path.join(root, "FIRST.json"),
    sha256: digest(path.join(root, "FIRST.json")),
    bytes: fs.statSync(path.join(root, "FIRST.json")).size,
    mode: "0444",
  },
  observedSealReceiptAt: "2026-11-20T21:59:18.497Z",
  manifestFirstReadOccurredAfterSealReceipt: true,
  currentTextSpecOrPreviewReadBeforeSeal: false,
  originalImageOpenCount: 1,
});
writeNew("image-ledger.json", {
  schema: "stemrobin188-review-image-ledger@1",
  images: [
    { order: 1, role: "blind-original", ...binding(manifest.original.path), opens: 1, beforeOwnFIRSTSeal: true },
    { order: 2, role: "current-preview-480", ...binding(manifest.figure.previews[0].path), opens: 1, afterOwnFIRSTSeal: true },
    { order: 3, role: "current-preview-300", ...binding(manifest.figure.previews[1].path), opens: 1, afterOwnFIRSTSeal: true },
  ],
  actualImageLoads: 3,
  contextImageLoads: 3,
  maxImageLoads: 3,
  maxContextImageLoads: 24,
  originalPageOpens: 0,
  originalReopens: 0,
  oldFailedPreviewOpens: 0,
  answerKeysRead: 0,
  finalResponseMediaPayloads: 0,
});
writeNew("native-review.command.json", {
  schema: "stemrobin188-review-command-receipt@1",
  stage: "record-current-independent-figure-review",
  cwd: repo,
  environment: { PYTHONDONTWRITEBYTECODE: "1" },
  argv: [
    "python3", `${repo}/.agents/skills/ld-s10y-image/scripts/record_review.py`,
    "--spec", manifest.figure.spec.path, "--render", manifest.figure.render.path,
    "--output", nativePath, "--status", "pass", "--notes", native.notes,
  ],
  exitCode: 0,
  stdout: `PASS: fig-g10-104 -> ${nativePath}\n`,
  invocationCount: 1,
  rendererCalled: false,
  sourceOrNativeChecksReplayed: false,
  builtInReadOnlyRecordingValidation: true,
  tool: binding(`${repo}/.agents/skills/ld-s10y-image/scripts/record_review.py`),
  output: binding(nativePath),
});
writeNew("text-review.json", {
  schema: "stemrobin188-independent-modern-text-review@1",
  reviewer: "SAME188-6",
  status: "pass",
  scope: "First current modern N68 text review against admitted raw lesson/exercises; exact source glyph holds excluded from certification",
  lesson: lesson.id,
  findings: [...preservedTextIssues, exactHolds[1]],
  defects: [],
  objectsRequired: 13,
  objectsReviewed: 13,
  objects,
  proseFlow: {
    status: "pass",
    nativeEvidence: binding(`${tmp}/n68-text-author-01/prose-flow.native.txt`),
    nativeCommand: binding(`${tmp}/n68-text-author-01/prose-flow.command.json`),
    noProseChangesAfterNativeRun: true,
    actualParagraphs: 5,
    selectedBoundaries: lesson.section_breaks,
    resolvedIndices: [1, 3],
    findings: [
      "First selected boundary separates theorem statement/formula from proof setup in adjacent final paragraphs.",
      "Second selected boundary separates the described generating half-disk from rotation about the horizontal axis and the section66 volume method; the intervening figure/caption is transparent to the native prose flow.",
      "No boundary splits a formula, invents a concept transition from a raw block count, or breaks the sequential antiderivative calculation.",
    ],
    nativeReplay: 0,
  },
  inheritedSourceAdmission: binding(`${tmp}/g10-n68/source-admission.json`),
  sourceTranscriptionReviewReusedNotRepeated: true,
  exactGlyphHolds: exactHolds,
  newMathematicalHolds: [],
  inputBindings,
  wholeLessonApproved: false,
  productApproved: false,
  published: false,
});
writeNew("figures-review.json", {
  schema: "stemrobin188-independent-current-figure-review@1",
  reviewer: "SAME188-6",
  status: "pass",
  scope: "Current fig-g10-104 mathematical/visual/cultural content only",
  nativeReview: binding(nativePath),
  figures: [
    {
      id: "fig-g10-104",
      status: "pass",
      source: binding(manifest.original.path),
      independentFIRST: binding(path.join(root, "FIRST.json")),
      spec: binding(manifest.figure.spec.path),
      render: binding(manifest.figure.render.path),
      svg: binding(manifest.figure.svg.path),
      currentPreviews: manifest.figure.previews.map((v) => binding(v.path)),
      findings: [
        { item: "subfigures", status: "pass", finding: "Exactly one shared frame and one upper semicircle; no missing panel." },
        { item: "semicircle-and-hatching", status: "pass", finding: "The A-to-B upper arc and full upper half-disk hatching match independent source inventory. Down-right hatch strokes reach arc/baseline throughout both sides, without a lower region or extra sector." },
        { item: "O-midpoint", status: "pass", finding: "B/O/A share the baseline with equal opposite radii. Collinearity, equal-distance, point-on-circle and two displacement assertions cover all three source-bound points." },
        { item: "endpoint-labels", status: "pass", finding: "B is left with (-R,0); A is right with (R,0). Coordinate signs and zero vertical values are preserved; exact source separator strokes remain excluded." },
        { item: "axes-and-basis", status: "pass", finding: "Perpendicular axes share O; x is rightward and y upward. Connected positive-direction arrows retain horizontal i and vertical j roles. Moving j's label to the other side of its shaft does not change its role." },
        { item: "schematic-radius", status: "pass", finding: "Internal radius200 is drawing geometry only. No visible number200, new radius dimension, new given value or answer-bearing annotation is introduced." },
        { item: "full-modern-text", status: "pass", finding: "Spec authoritativeText exactly contains the current title, all nonempty prose and every exercise252-259. The proof's diameter2R, originO, upper graph and rotation axis agree with the diagram." },
        { item: "480-and-300-previews", status: "pass", finding: "Both current previews are nonblank and show all labels, both basis arrows and complete geometry without observed clipping or collision. Existing render PASS records minimum labels27px and16.875px at480/300, above16px." },
        { item: "culture-and-answer-leak", status: "pass", finding: "Visible labels are mathematical Latin symbols/coordinate tuples only. No Chinese/Cyrillic cultural text, old-book texture, formula result, exercise answer or extra construction appears." },
      ],
      exactSourceGlyphCertification: "hold",
      sourceGlyphHolds: [exactHolds[0]],
      existingRendererStatus: "pass",
      rendererReplay: 0,
      nativeCheckReplay: 0,
      history,
    },
  ],
  defects: [],
  newMathematicalHolds: [],
  inputBindings,
  actualImageLoads: 3,
  wholeLessonApproved: false,
  productApproved: false,
  promoted: false,
  published: false,
});
writeNew("report.json", {
  schema: "stemrobin188-independent-n68-text-figure-review@1",
  ticket: "STEMROBIN-188",
  reviewer: "SAME188-6",
  role: "sole-independent-reviewer",
  status: "pass",
  scope: "First current review of N68 modern TEXT (13 objects) and final fig-g10-104 only",
  summary: "All 13 modern objects preserve admitted source mathematics, conditions, numbers, proof/tasks and bindings. Current fig104 independently passes mathematical, visual and cultural review. No candidate revisions or new unresolved source-mathematics holds were found.",
  findings: [
    ...preservedTextIssues,
    ...exactHolds,
    {
      id: "PARENT-FIRST-LATE-PERSISTENCE",
      classification: "retained-procedure-limitation",
      status: "retained",
      finding: history.parentFIRSTProcedureLimitation.finding,
      requestedCandidateChange: null,
      blocksCurrentContentPASS: false,
    },
    {
      id: "PARENT-INITIAL-COLLISION-FAIL-AND-REPAIR",
      classification: "retained-failure-and-single-repair",
      status: "retained",
      finding: "Initial O/A/B/x label collision FAIL remains bound. Exactly one recorded label-placement repair led to the current native renderer PASS; no geometry/source data were rewritten and no repair was repeated here.",
      requestedCandidateChange: null,
    },
  ],
  defects: [],
  unresolvedCurrentSourceMathematics: [],
  newGateFromSummaryOrReadabilityCaveat: false,
  textReview: binding(path.join(root, "text-review.json")),
  figuresReview: binding(path.join(root, "figures-review.json")),
  nativeFigureReview: binding(nativePath),
  FIRST: binding(path.join(root, "FIRST.json")),
  FIRSTSeal: binding(path.join(root, "FIRST-seal.json")),
  comparisonReceipt: binding(path.join(root, "comparison-receipt.json")),
  imageLedger: binding(path.join(root, "image-ledger.json")),
  inputBindingsFile: path.join(root, "inputBindings.json"),
  inputBindings,
  allActualInputsUnchanged: true,
  sourceReviewsInherited: [
    binding(`${tmp}/g10-n68/source-admission.json`),
    binding(`${tmp}/source235237-FIRST-review-01/report.json`),
    binding(`${tmp}/source236-theorem-affected-review-02/report.json`),
  ],
  unrelatedSourceHolds: {
    ids: ["R235-EX249-DIAMETER", "R235-EX245-SUMMARY", "R27-FIRST-RELATIONSHIP-CONFLICT", "R103-PREFIX60"],
    disposition: "Inherited and unchanged; out of N68 content scope and not blanket blockers. No new source review or approval.",
  },
  retainedHistory: history,
  exposureAndActions: {
    actualImageLoads: 3,
    contextImageLoads: 3,
    originalImageLoads: 1,
    currentPreviewLoads: 2,
    originalPageLoads: 0,
    originalReopens: 0,
    answerKeysRead: 0,
    nativeRendererReplay: 0,
    nativeChecksReplayed: 0,
    recordReviewInvocations: 1,
    candidateSourceCoreOrPlanEdits: 0,
    reviewerContentRepairs: 0,
    paidCalls: 0,
    databaseCalls: 0,
    publicationCalls: 0,
    gitCalls: 0,
    otherChatsContacted: 0,
    furtherAgents: 0,
    reviewerReceiptToolRecovery: binding(path.join(root, "execution-recovery.json")),
  },
  scopedPASSOnly: true,
  exactOriginalGlyphsApproved: false,
  wholeLessonApproved: false,
  wholePageApproved: false,
  productApproved: false,
  promoted: false,
  published: false,
});
console.log(JSON.stringify({
  status: "pass",
  objects: objects.length,
  images: 3,
  nativeFigureStatus: native.status,
  inputsUnchanged: inputBindings.length,
  reports: ["report.json", "text-review.json", "figures-review.json"],
}));
