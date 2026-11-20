import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const dir = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d229-source80-82-review");
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
const binding = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const save = (name, value) => {
  const file = path.join(dir, name);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  return binding(file);
};
const input = read("input-freeze.json");
const source = read("source-only.json");
const after = read("after-inventory.json");
const baseline = read("independent-baseline.json");
const author = JSON.parse(fs.readFileSync(after.authorReport.path, "utf8"));
if (binding(path.join(dir, "input-freeze.json")).sha256 !== "50ef895aa387f9ea5be863d704c6fce9e602a672d6392fa5ea7380e853a744ab") {
  throw new Error("Input freeze mismatch");
}
if (baseline.stage !== "SAVED_BEFORE_OPENING_AFTER_INVENTORY_OR_D225_D228_CONTENT" ||
    baseline.imageOpensAtSave !== 6 || baseline.originalFigureInventories.length !== 6) {
  throw new Error("Missing independent before-inventory baseline");
}
const draftRefs = author.currentDrafts.flatMap((entry) => [
  { ...entry.preNative.md, role: `D225-frozen-draft-md-SOURCE${entry.page}` },
  { ...entry.preNative.parsedJson, role: `D225-frozen-draft-json-SOURCE${entry.page}` }
]);
const withoutFigures = (json) => json.blocks.filter((b) => b.kind !== "fig").map((b) => ({
  kind: b.kind, cont: b.cont, open: b.open, samerow: b.samerow, lines: b.lines
}));
const comparisons = after.candidates.map((entry) => {
  const frozen = author.currentDrafts.find((d) => d.page === entry.page);
  const nativeJson = JSON.parse(fs.readFileSync(entry.files.find((f) => f.path.endsWith("page.json")).path, "utf8"));
  const draftJson = JSON.parse(fs.readFileSync(frozen.preNative.parsedJson.path, "utf8"));
  const audit = JSON.parse(fs.readFileSync(entry.files.find((f) => f.path.endsWith("audit.json")).path, "utf8"));
  return {
    source: entry.page,
    D225FrozenDraft: frozen.preNative,
    D228NativeTextOutputs: entry.files,
    nonFigureBlocksIdentical: JSON.stringify(withoutFigures(draftJson)) === JSON.stringify(withoutFigures(nativeJson)),
    originalImageShaMatchesNativeMetadata: nativeJson.meta.render.sha256 === source.pages.find((p) => p.page === entry.page).original.sha256,
    auditPrintedRows: audit.lines_printed,
    auditMarkdownRows: audit.lines_md,
    auditErrors: audit.errors,
    katexWarnings: audit.katex_warnings,
    figures: nativeJson.meta.figures.map((f) => f.id),
    caveat: "Text/flags comparison and saved audit reading only. Audit success does not approve source fidelity or any native figure."
  };
});
if (comparisons.some((c) => !c.nonFigureBlocksIdentical || !c.originalImageShaMatchesNativeMetadata)) {
  throw new Error("Unexpected author/native text or metadata drift");
}

// Preserve the pre-comparison baseline and disclose reader corrections separately.
const finalPages = structuredClone(baseline.pages);
finalPages[0].paragraphs[1].rows[4] = "伏特计测出的. 在共振时这些量值增大几十倍甚至几百倍.";
finalPages[1].paragraphs[0].rows[0] = "电压振荡才是显著的. 这就是说，从天线里激发的各种频率";
for (const [index, count] of [18, 25, 17].entries()) {
  finalPages[index].counts.totalTextSegments = finalPages[index].counts.totalNonFigureRows;
  finalPages[index].counts.totalNonFigureRows = count;
  finalPages[index].counts.uniquePhysicalRows = count;
}
const rows = [];
const add = (page, segments) => {
  const index = rows.filter((r) => r.source === page).length + 1;
  rows.push({ source: page, physicalRow: index, segments });
};
const prose = (page, paragraph, indices) => {
  for (const i of indices) add(page, [{ kind: "p", baselineRow: `${paragraph.id}:${i + 1}`, text: paragraph.rows[i] }]);
};
const all = (paragraph) => paragraph.rows.map((_, i) => i);
const p80 = finalPages[0].paragraphs;
prose(80, p80[0], all(p80[0]));
prose(80, p80[1], all(p80[1]));
add(80, [{ kind: "cap", text: "图 49" }]);
prose(80, p80[2], all(p80[2]));
rows.find((r) => r.source === 80 && r.physicalRow === 16).segments.push({ kind: "cap", text: "图 50", samerow: true });
add(80, [{ kind: "foot", text: "• 70 •" }]);
const p81 = finalPages[1].paragraphs;
prose(81, p81[0], all(p81[0]));
prose(81, p81[1], all(p81[1]));
add(81, [{ kind: "h3", text: "29. 三极电子管" }]);
for (const p of p81.slice(2)) prose(81, p, all(p));
add(81, [{ kind: "foot", text: "• 71 •" }]);
const p82 = finalPages[2].paragraphs;
add(82, [{ kind: "cap", text: "图 52" }]);
prose(82, p82[0], all(p82[0]));
rows.find((r) => r.source === 82 && r.physicalRow === 4).segments.push({ kind: "cap", text: "图 51", samerow: true });
prose(82, p82[1], all(p82[1]));
add(82, [{ kind: "cap", text: "图 53" }, { kind: "cap", text: "图 54", samerow: true }]);
prose(82, p82[2], all(p82[2]));
add(82, [{ kind: "foot", text: "• 72 •" }]);
if (rows.length !== 60) throw new Error("Wrong physical-row inventory");
const lineOf = (file, needle) => {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  const line = lines.findIndex((text) => text.includes(needle)) + 1;
  if (line === 0) throw new Error(`Missing finding anchor: ${needle}`);
  return line;
};
const anchors81 = (needle) => {
  const frozen = author.currentDrafts.find((d) => d.page === 81).preNative.md;
  const native = after.candidates.find((d) => d.page === 81).files.find((f) => f.path.endsWith("page.md"));
  return [frozen, native].map((f) => ({ ...f, line: lineOf(f.path, needle) }));
};
const imageNames = [
  [80, "original", source.pages[0].original.path, null],
  [81, "original", source.pages[1].original.path, null],
  [82, "original", source.pages[2].original.path, null],
  [80, "original-only-crop", path.join(dir, "source80-original-meter-labels.png"), [560, 1020, 720, 340]],
  [82, "original-only-crop", path.join(dir, "source82-original-lower.png"), [140, 1200, 1210, 920]],
  [81, "original-only-crop", path.join(dir, "source81-original-emphasis.png"), [190, 990, 1200, 960]],
  [80, "original-only-crop", path.join(dir, "source80-original-row8.png"), [160, 735, 1190, 95]],
  [81, "original-only-crop", path.join(dir, "source81-original-row1.png"), [190, 140, 1210, 105]]
];
const imageLedger = imageNames.map(([page, kind, file, cropBoxXYWH], index) => ({
  sequence: index + 1, source: page, kind, artifact: binding(file), cropBoxXYWH,
  sourceOriginal: source.pages.find((p) => p.page === page).original,
  phase: index < 6 ? "BEFORE_AFTER_INVENTORY" : "AFFECTED_ORIGINAL_ONLY_READER_DISCREPANCY_CHECK",
  resampled: false, opened: true
}));
const baselineRef = binding(path.join(dir, "independent-baseline.json"));
const report = {
  schema: "ld-s10y-lesson/offline-independent-source-review@1",
  batch: "D229", ticket: "STEMROBIN-181", book: "10p",
  role: "SOLE_FIRST_INDEPENDENT_SOURCE80_82_TEXT_AND_ORIGINAL_FIGURE_INVENTORY_REVIEWER",
  cwd, finish: "review",
  status: "HOLD_SOURCE81_TEXT_AND_EMPHASIS_SOURCE81_82_GLYPH_IDENTITIES_RAW_UNREVIEWED",
  writeScope: [dir],
  sameInvocationSetupGrillFreshness: "Already satisfied per direct human instruction; not restarted, no backend or network call.",
  sourceApproval: false, fullPageSourceApproval: false, rawFidelityApproval: false,
  wholeCourseApproval: false, formalHandoff: false, repairsPerformed: false,
  inputFreeze: binding(path.join(dir, "input-freeze.json")),
  sourceOnly: binding(path.join(dir, "source-only.json")),
  afterInventory: binding(path.join(dir, "after-inventory.json")),
  baseline: baselineRef,
  orderEvidence: {
    sourceOnlyReadFirst: true, originalsOpenedIndividually: true,
    allSixOriginalInventoriesSavedBeforeAfterInventory: true,
    initialBaselineImageOpens: 6, finalImageOpens: 8,
    initialBaselinePreservedWithoutOverwrite: true
  },
  scopeOutcomes: [
    {
      source: 80, printedPage: 70,
      textSourceOutcome: "PASS_LOCAL_TEXT_ROWS_INLINE_R_CAPTIONS_AND_BOUNDARY_FLAGS_ONLY",
      sourceOriginalOutcome: "ORIGINAL_FIG49_50_INVENTORIES_RECORDED_WITH_UNCERTAINTIES_NO_NATIVE_APPROVAL",
      physicalRows: 18, proseRows: 16, captionSegments: 2, independentCaptionRows: 1,
      tasks: 0, titleRows: 0, displayFormulaRows: 0,
      qualification: "No remaining prose mismatch found after source-only reader corrections. Incoming SOURCE79 is a held draft, not an approved left boundary; figure49 labels/pointers and figure50 mark endpoints remain held."
    },
    {
      source: 81, printedPage: 71,
      textSourceOutcome: "HOLD_ONE_SOURCE_WORD_SUBSTITUTION_AND_TWO_OMITTED_EMPHASIS_SPANS",
      sourceOriginalOutcome: "NO_ORIGINAL_FIGURES_ON_PAGE_OMEGA_IDENTITY_HOLD_PRESERVED",
      physicalRows: 25, proseRows: 23, captionSegments: 0, independentCaptionRows: 0,
      tasks: 0, titleRows: 1, displayFormulaRows: 0,
      qualification: "Row topology, actual title, continuation and local N28/N29 transition match. Native mechanical pass carries unchanged source-text defects."
    },
    {
      source: 82, printedPage: 72,
      textSourceOutcome: "PASS_LOCAL_PROSE_SHAPES_ROWS_EXPLICIT_EMPHASIS_CAPTIONS_AND_BOUNDARIES_EXCLUDING_SUBSCRIPT_IDENTITIES",
      fullTextIdentityOutcome: "HOLD_CYRILLIC_A_C_Z_SCRIPT_CASE_AND_Z_VERSUS_3",
      sourceOriginalOutcome: "ORIGINAL_FIG51_54_INVENTORIES_RECORDED_WITH_UNCERTAINTIES_NO_NATIVE_APPROVAL",
      physicalRows: 17, proseRows: 14, captionSegments: 4, independentCaptionRows: 2,
      tasks: 0, titleRows: 0, displayFormulaRows: 0,
      qualification: "No ordinary Chinese prose mismatch found. Retain draft Cyrillic а U+0430, с U+0441, з U+0437 exactly as provisional, never normalize to Latin. N29 ends in literal （电子 and remains right-open."
    }
  ],
  findings: [
    {
      id: "d229-s81-tutorial-word", priority: 2, status: "HOLD", source: 81,
      location: { physicalRow: 14, baselineRow: "s81-p4:1", block: "p0081#5", blockLine: 1 },
      sourceText: "在九年级的物理教程中已经讲了二极电子管的构造和作",
      candidateText: "在九年级的物理教程里已经讲了二极电子管的构造和作",
      explanation: "The original shows 中 after 教程. Both D225 frozen draft and D228 native output substitute 里. The initial source-only baseline had 中 before either candidate was inspected.",
      candidateBindings: anchors81("在九年级的物理教程里"),
      evidence: binding(path.join(dir, "source81-original-emphasis.png")),
      repair: "NOT_PERFORMED_OR_AUTHORIZED"
    },
    {
      id: "d229-s81-missing-emphasis", priority: 2, status: "HOLD", source: 81,
      location: { physicalRow: 18, baselineRow: "s81-p4:5", block: "p0081#5", blockLine: 5 },
      sourceEmphasis: ["电场", "电子急速"],
      candidateEmphasis: [],
      explanation: "These two spans are distinctly heavier in the original-only crop and were recorded before after-inventory. D225 and D228 preserve the words but leave the full row plain. The separate 自激振荡 emphasis is retained correctly. No claim is made about merely uneven/dark type elsewhere.",
      candidateBindings: anchors81("极的电场的作用下"),
      evidence: binding(path.join(dir, "source81-original-emphasis.png")),
      repair: "NOT_PERFORMED_OR_AUTHORIZED"
    }
  ],
  reviewerBaselineCorrections: [
    {
      source: 80, baselineRow: "s80-p2:5", initial: "几十倍至几百倍",
      final: "几十倍甚至几百倍", evidenceOpen: 7,
      classification: "REVIEWER_INITIAL_READING_CORRECTED_NOT_A_CANDIDATE_DEFECT"
    },
    {
      source: 81, baselineRow: "s81-p1:1", initial: "从天线里散发", final: "从天线里激发",
      evidenceOpen: 8, classification: "REVIEWER_INITIAL_READING_CORRECTED_NOT_A_CANDIDATE_DEFECT"
    },
    {
      initial: "Baseline totalNonFigureRows 19/25/19 counted all text segments separately.",
      final: "Unique physical rows 18/25/17; 63 text segments occupy 60 physical rows.",
      reason: "Caption50 shares SOURCE80 prose row16; caption51 shares SOURCE82 prose row4; captions53/54 share SOURCE82 row13. Segment inventories remain complete; no caption is deleted.",
      classification: "REVIEWER_COUNT_TERMINOLOGY_CLARIFICATION_NOT_A_CANDIDATE_DEFECT"
    }
  ],
  finalPhysicalRowInventory: rows,
  finalBaselinePages: finalPages,
  finalBaselineNotation: "Shape-level Latin a/c placeholders in the pre-comparison independent baseline do not authorize a rewrite of held Cyrillic draft identities. Explicit inherited codepoints below govern preservation; neither their identities nor small punctuation weight is approved.",
  originalFigureInventories: baseline.originalFigureInventories,
  originalInventoryOutcome: "ALL_6_RECORDED_INDEPENDENTLY_BEFORE_AFTER_INVENTORY_WITH_EXPLICIT_UNCERTAINTIES",
  originalInventoryComparison: [
    { id: "fig-49", result: "Observed apparatus/dials/wires/capacity-mark inventory compatible with D225; hidden topology and tiny marks held." },
    { id: "fig-50", result: "Observed antenna/two winding paths/loop/ground/dots/open-ended branches compatible; diagonal mark endpoint held." },
    { id: "fig-51", result: "Observed tube and four Chinese labels/leaders compatible; exact pin/turn counts and tips held." },
    { id: "fig-52", result: "Observed circle, three middle strokes, four labels and lower leads compatible; hidden contacts held." },
    { id: "fig-53", result: "Observed ticks, right-side 4, two explicit axis arrows, one ungridded curve and three label groups compatible; subscript identity, exact intercept/current and extension unapproved." },
    { id: "fig-54", result: "Observed DC-source box, sockets, vertical element, visible left-facing arrow, V/mA, tube, battery signs and visible wires compatible; no physics-derived current direction or hidden contacts." }
  ],
  inheritedGlyphAndFigureHolds: author.glyphHolds.map((h) => ({ ...h, D229Resolution: "NOT_CLEARED" })),
  priorSourceStatus: {
    SOURCE77_79: "EXISTING_NATIVE_AND_SOURCE_HOLD_UNCHANGED",
    SOURCE78: author.inheritedSource78Failure,
    SOURCE79: "Only the hash-bound precedingText draft was read. No original79 opened or source/native approval issued. Cyrillic amplitude/capacitance and round omega-subscript holds remain."
  },
  localBoundaries: baseline.pages.map((p) => ({ source: p.source, ...p.boundaries })),
  nativeComparison: comparisons,
  nativeMechanicalEvidence: after.stages.filter((s) => s.stage !== "preview").map((s) => ({
    page: s.page, stage: s.stage, name: s.name, exitCode: s.exitCode, evidence: s.evidence,
    result: "SAVED_MECHANICAL_PASS_READ_NOT_REEXECUTED_NOT_SOURCE_APPROVAL"
  })),
  nativePreviewEvidence: "Six pre-existing preview receipts/artifacts are frozen by bytes/hash only. No preview or native PNG/SVG was opened, decoded, rendered or visually reviewed.",
  unreviewedNativeFigureBindings: after.figures,
  unreviewedRetainedRawFigureBindings: after.rawFigures,
  imageLedger,
  counters: {
    originalPagesOpenedIndividually: 3, originalFigureInventories: 6,
    actualImageOpens: 8, contextImageOpens: 8, parentImageOpens: 0,
    originalFullPageOpens: 3, originalOnlyCropOpens: 5, imageReopens: 0, gridImageOpens: 0,
    nativePngOpens: 0, nativeSvgOpens: 0, nativePreviewOpens: 0,
    maximumActualImageOpens: 8, maximumContextImageOpens: 24,
    physicalRowsInventoried: 60, proseRowsInventoried: 53, captionSegments: 6, titleRows: 1, footerRows: 3,
    tasks: 0, standaloneDisplayFormulaRows: 0, inlineFormulaOccurrences: 6,
    sourcePagesAdded: 0, sourceApprovals: 0, completeCoursesAdded: 0,
    contentRepairs: 0, figureContentRepairs: 0,
    nativeCalls: 0, p2cCalls: 0, vectorizeCalls: 0, previewCalls: 0,
    modelApiCalls: 0, paidCalls: 0, gitCalls: 0,
    databaseCalls: 0, canonicalWrites: 0, publisherCalls: 0, deployCalls: 0,
    mergeCalls: 0, handoffCalls: 0, peerMessages: 0, childrenCreated: 0,
    ownFreezeVerificationRuns: 1
  },
  excludedApprovals: ["RAW fidelity", "Native PNG/SVG fidelity", "Modern figures", "Whole-course completion", "Full N28 approval", "N29 closure", "SOURCE77-79 hold resolution", "Publisher/DB/canonical promotion"],
  stop: "BOUNDED_D229_REVIEW_FINISHED_NO_REPAIR_OR_FOLLOW_ON_BATCH",
  selfHashPolicy: "report.json is bound in review-freeze.json. Freeze self SHA is emitted externally to avoid cyclic self hashes."
};
const reportRef = save("report.json", report);
const refs = new Map();
const include = (ref, role) => {
  const old = refs.get(ref.path);
  if (old && (old.bytes !== ref.bytes || old.sha256 !== ref.sha256)) throw new Error(`Conflicting expected binding: ${ref.path}`);
  if (old) old.roles.push(role);
  else refs.set(ref.path, { path: ref.path, bytes: ref.bytes, sha256: ref.sha256, roles: [role] });
};
const collect = (value, role) => {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.bytes === "number" && typeof value.sha256 === "string") {
    include(value, role);
    return;
  }
  for (const [key, child] of Object.entries(value)) collect(child, `${role}.${key}`);
};
collect(source, "source-only");
collect(input, "input-freeze-declared-binding");
collect(after, "after-inventory-binary-artifacts-hash-only-no-visual-review");
draftRefs.forEach((ref) => include(ref, ref.role));
imageLedger.forEach((entry) => include(entry.artifact, `actually-opened-image-${entry.sequence}`));
for (const name of ["input-freeze.json", "source-only.json", "after-inventory.json", "dispatch-record.json", "independent-baseline.json", "close-review.mjs"]) {
  include(binding(path.join(dir, name)), `D229-${name}`);
}
include(reportRef, "D229-review-report");
const consultedRules = [
  ".intentfold/readme.md", ".intentfold/project.json", ".intentfold/tickets/STEMROBIN-181/ticket.json",
  ".intentfold/charter/product.md", ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md", ".intentfold/charter/ui.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md"
];
for (const name of consultedRules) include(binding(path.isAbsolute(name) ? name : path.join(cwd, name)), "read-only-consulted-rule");
const freezeRef = save("review-freeze.json", {
  schema: "d229/source-review-freeze@1", batch: "D229", ticket: "STEMROBIN-181",
  cwd, finish: "review", report: reportRef, independentBaseline: baselineRef,
  status: report.status, sourceApproval: false, rawApproval: false,
  scope: "SOURCE80-82 text/source-original inventories only",
  verificationPolicy: "Verify each unique bound path/bytes/SHA256 once after writing this freeze. Binary hashing is not an image open or source fidelity review.",
  verificationCommand: "node .intentfold/tickets/STEMROBIN-181/tmp/d1816-d229-source80-82-review/close-review.mjs",
  uniqueBindingCount: refs.size,
  bindings: [...refs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  imageCounters: report.counters,
  selfHashPolicy: "Freeze SHA emitted externally; no cyclic self binding."
});

// This is the sole verification of the completed reviewer freeze.
const frozen = read("review-freeze.json");
const mismatches = [];
let verifiedCount = 0;
for (const expected of frozen.bindings) {
  try {
    const actual = binding(expected.path);
    if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) mismatches.push({ expected, actual });
    else verifiedCount++;
  } catch (error) {
    mismatches.push({ expected, error: String(error) });
  }
}
if (verifiedCount !== frozen.uniqueBindingCount || mismatches.length) {
  console.error(JSON.stringify({ verificationRuns: 1, verifiedCount, mismatches }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: report.status, report: reportRef, reviewFreeze: freezeRef,
    verificationRuns: 1, verifiedCount, mismatches: 0,
    actualImageOpens: 8, contextImageOpens: 8, originalInventories: 6,
    nativeImageOpens: 0, paidCalls: 0, repairs: 0
  }, null, 2));
}
