import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Exact task cwd required");
const out = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d203-10p-source68-70-author");
const root = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d203/root");
const work = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d203/source-work");
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const binding = (file) => {
  const p = path.resolve(cwd, file);
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length, sha256: hash(bytes) };
};
const writeJson = (name, value) => {
  const file = path.join(out, name);
  if (!file.startsWith(out + path.sep)) throw new Error("Output escaped authorized directory");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx", mode: 0o444 });
  return binding(file);
};
const same = (actual, expected) =>
  actual.bytes === expected.bytes && actual.sha256 === expected.sha256;
const requireSame = (actual, expected) => {
  if (!same(actual, expected)) throw new Error(`Binding changed: ${actual.path}`);
};
const filesBelow = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const p = path.join(dir, entry.name);
  return entry.isDirectory() ? filesBelow(p) : entry.isFile() ? [p] : [];
});
const freezeCopy = (name) => {
  const original = path.join(out, name);
  const target = path.join(out, "frozen-evidence", name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(original, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  const current = binding(original);
  const frozen = binding(target);
  requireSame(current, frozen);
  return { original: current, frozen, mode: "0444" };
};

const input = readJson(path.join(out, "input-freeze.json"));
const inputFiles = [
  ...input.pages.flatMap((p) => [p.source, p.grid, p.template, p.layout]),
  input.preparation, input.precedingCandidateText, input.toc
];
for (const expected of inputFiles) requireSame(binding(expected.path), expected);
const inputIntegrity = writeJson("input-integrity-at-freeze.json", {
  status: "PASS_EXACT_BYTES_AND_SHA256",
  checkedAt: new Date().toISOString(),
  preparedPagesRerendered: false,
  files: inputFiles.map((expected) => ({ expected, current: binding(expected.path) })),
  note: "Hash checks read bytes, not previous source images or previous-page content beyond the authorized p0067#9 textual tail."
});

const frozenEvidence = [
  "input-freeze.json", "dispatch-record.json",
  "source-inventory-0068.json", "source-inventory-0069.json", "source-inventory-0070.json",
  "source-observation-supplement.json", "figure-42-author-observation.json",
  "source-crops/0068-E-labels.png", "source-crops/0069-definition-tail.png",
  "source-crops/0070-circuit.png", "author-tools.mjs", "build-report.mjs"
].map(freezeCopy);
const frozen = (name) => frozenEvidence.find((e) => e.original.path === path.join(out, name)).frozen;
const inventories = [68, 69, 70].map((p) => readJson(path.join(out, `source-inventory-${String(p).padStart(4, "0")}.json`)));
const parser = readJson(path.join(out, "parser-summary.json"));
const nativeDirs = fs.readdirSync(path.join(out, "native")).sort();
const nativeReceipts = nativeDirs.map((name) => {
  const dir = path.join(out, "native", name);
  const value = readJson(path.join(dir, "receipt.json"));
  requireSame(binding(value.stdout.path), value.stdout);
  requireSame(binding(value.stderr.path), value.stderr);
  return { binding: binding(path.join(dir, "receipt.json")), value };
});
const firstFailure = nativeReceipts.find((r) => r.value.exitCode !== 0);
if (firstFailure?.value.name !== "p0069-finalize-FIRST" || firstFailure.value.exitCode !== 1) {
  throw new Error("Unexpected first-failure history; report must not infer a different result");
}
const forbiddenCalls = ["p0069-vectorize-FIRST", "p0070-finalize-FIRST", "p0070-vectorize-FIRST"];
if (forbiddenCalls.some((n) => nativeDirs.includes(n))) throw new Error("Dependent-stage stop violated");
const nativeEvidenceFiles = filesBelow(path.join(out, "native")).map((p) => {
  if ((fs.statSync(p).mode & 0o222) !== 0) throw new Error(`Native evidence writable: ${p}`);
  return binding(p);
});
const originalDraftFiles = filesBelow(path.join(out, "original-drafts")).map((p) => {
  if ((fs.statSync(p).mode & 0o222) !== 0) throw new Error(`Original draft snapshot writable: ${p}`);
  return binding(p);
});
const outputBindings = [68, 69, 70].map((page) => {
  const folder = String(page).padStart(4, "0");
  const dir = path.join(root, "10p/pages", folder);
  const candidate = ["page.md", "page.json", "audit.json"].flatMap((name) => {
    const p = path.join(dir, name);
    if (!fs.existsSync(p)) return [];
    const current = binding(p);
    const reference = page === 70
      ? path.join(out, "original-drafts", folder, name)
      : path.join(out, "native", `p${folder}-finalize-FIRST`, "outputs", "candidate", name);
    const evidence = binding(reference);
    requireSame(current, evidence);
    if ((fs.statSync(p).mode & 0o200) === 0) throw new Error(`Operative candidate not writable: ${p}`);
    return [{ current, frozen: evidence, operativeMode: "0644", frozenMode: "0444" }];
  });
  const figuresDir = path.join(work, "10p/pages", folder, "figures");
  const generatedFigures = fs.existsSync(figuresDir) ? filesBelow(figuresDir).map((p) => {
    const current = binding(p);
    const evidence = binding(path.join(out, "native", `p${folder}-finalize-FIRST`, "outputs", "figures", path.basename(p)));
    requireSame(current, evidence);
    return { current, frozen: evidence };
  }) : [];
  return { page, candidate, generatedFigures };
});

const perPage = [68, 69, 70].map((page, i) => {
  const pdir = path.join(root, "10p/pages", String(page).padStart(4, "0"));
  const auditPath = path.join(pdir, "audit.json");
  const audit = fs.existsSync(auditPath) ? readJson(auditPath) : null;
  if (page === 68 && audit?.errors.length) throw new Error("Page 68 is not native PASS");
  if (page === 69 && (audit?.errors.length !== 1 || audit.unknown_chars[0]?.char !== "■")) throw new Error("Unexpected page 69 failure");
  if (page === 70 && audit) throw new Error("Page 70 unexpectedly finalized");
  return {
    page, printedPage: inventories[i].printedPage,
    authorStatus: "COMPLETE_CANDIDATE_WITH_GLYPH_HOLDS_NOT_SOURCE_APPROVED",
    independentSourceReview: "PENDING",
    parserStatus: "PASS",
    parserPrintedRows: parser[i].printedRows,
    parserBlocks: parser[i].blocks,
    nativeFinalizeStatus: page === 68 ? "PASS" : page === 69 ? "FAIL_CHARSET_BLACK_SQUARE" : "NOT_RUN_STOPPED_AFTER_P0069_FIRST_FAILURE",
    nativeVectorizeStatus: page === 68 ? "PASS_ZERO_FIGURES_NO_FIDELITY_CLAIM" : "NOT_RUN_DEPENDENCY_STOP",
    nativeFinalizeCalls: page === 70 ? 0 : 1,
    nativeVectorizeCalls: page === 68 ? 1 : 0,
    linesPrintedNative: audit?.lines_printed ?? null,
    linesMdNative: audit?.lines_md ?? null,
    normalizations: audit?.normalizations ?? [],
    nativeErrors: audit?.errors ?? [],
    nativeUnknownCharacters: audit?.unknown_chars ?? [],
    nativeKatexWarnings: audit?.katex_warnings ?? [],
    audit: audit ? binding(auditPath) : null,
    sourceInventory: frozen(`source-inventory-${String(page).padStart(4, "0")}.json`),
    output: outputBindings[i]
  };
});
const glyphHolds = [
  ...inventories.flatMap((p) => p.glyphHolds.map((g) => ({ page: p.page, ...g, status: "HOLD_INDEPENDENT_SOURCE_REVIEW" }))),
  ...readJson(path.join(out, "source-observation-supplement.json")).additionalGlyphHolds
];
const boundaries = {
  incomingN25: {
    unit: "phy10-c1-s3-n25",
    titleFromToc: "交流电路中的电感",
    precedingTextBinding: binding(input.precedingCandidateText.path),
    onlyPrecedingContentUsed: {
      ref: "p0067#9",
      lines: ["我们来求接有纯电阻可以忽略不计的线圈的电路中的", "电流强度（图 41）. 为此，我们先求出电路里的自感电动势与"]
    },
    precedingSourceStatus: "D196_FIRST_SOURCE67_REVIEW_ACTIVE_NOT_ASSUMED",
    connection: { from: "p0067#9", to: "p0068#1", tail: "自感电动势与", continuation: "线圈上的电压之间的关系." },
    figure42Reference: { ref: "p0068#9", exactRow: "当线圈上的电压达到最大值时，电流强度等于零（图 42）.", figure: "p0069#1", caption: "p0069#2" },
    finalBlock: "p0069#8",
    finalText: "感抗与频率有关. 稳恒电流一般“不能察觉”线圈的电感. 在 $\\omega=0$ 时，感抗 $X_L=0$. 电压变化越快，自感电动势就越大，电流的振幅就越小.",
    finalPrintedRow: "电流的振幅就越小.",
    tasks: [],
    taskObservation: "本范围 N25 结尾没有习题栏、独立题号、小问标记或问句；未推断不存在的任务。",
    closesBefore: { ref: "p0069#9", exactTitle: "26. 交流电路的欧姆定律" },
    authorObservedLocalEnd: true,
    completeUnitSourceApproval: false,
    approvalHold: "SOURCE67_D196_AND_THIS_BATCH_INDEPENDENT_SOURCE_REVIEW_PENDING"
  },
  N26: {
    unit: "phy10-c1-s3-n26",
    title: { ref: "p0069#9", exactText: "26. 交流电路的欧姆定律" },
    acrossPages: {
      from: "p0069#10", to: "p0070#1",
      prefixTail: "线圈及电",
      continuationRows: ["容为 $C$ 的电容器串联的电路中的情况", "（图 43）."]
    },
    figure43: { ref: "p0070#3", caption: "p0070#4", captionSamerowWith: "p0070#2 last printed row" },
    internalAcrossFigure: {
      from: "p0070#2", transparent: ["p0070#3", "p0070#4"], to: "p0070#5",
      prefixTail: "到，在电路里分别接入纯电阻 $R$、电容",
      continuationStart: "为 $C$ 的电容器和自感系数为 $L$ 的线圈时，电流强度的振幅分"
    },
    embeddedProseQuestions: inventories[2].questions,
    tasks: [],
    exerciseAlphabet: "NO_PRINTED_SUBQUESTIONS_IN_RANGE; NONE_INVENTED",
    terminal: {
      ref: "p0070#9", open: true,
      exactText: "如果在相加的电压之间考虑到相位差，那么：",
      nextSourceRead: false, continuationUnknown: true,
      unitClosed: false, releaseAllowed: false
    },
    nextTitleObserved: null,
    sourceApproval: false
  },
  rangeTitlesObserved: ["26. 交流电路的欧姆定律"],
  noOtherUnitBoundaryInvented: true,
  noAssemblyExecuted: true
};
const imageEvents = [
  { open: 1, page: 68, kind: "originalSourcePage", path: input.pages[0].source.path },
  { open: 2, page: 69, kind: "originalSourcePage", path: input.pages[1].source.path },
  { open: 3, page: 70, kind: "originalSourcePage", path: input.pages[2].source.path },
  { open: 4, page: 68, kind: "sourceDerivedCrop", path: path.join(out, "source-crops/0068-E-labels.png") },
  { open: 5, page: 69, kind: "sourceDerivedCrop", path: path.join(out, "source-crops/0069-definition-tail.png") },
  { open: 6, page: 70, kind: "sourceDerivedCrop", path: path.join(out, "source-crops/0070-circuit.png") },
  { open: 7, page: 69, kind: "firstNativeCropAuthorObservationOnly", path: path.join(work, "10p/pages/0069/figures/fig-42.png") }
].map((e) => ({ ...e, file: binding(e.path) }));
const figures = inventories.flatMap((p) => p.figures.map((f) => ({
  page: p.page, id: f.id, inventory: frozen(`source-inventory-${String(p.page).padStart(4, "0")}.json`),
  coarseBox: f.coarseBox, objects: f.objects, labels: f.labels,
  numericData: f.numericData, topology: f.topology,
  labelCurveMismatch: f.labelCurveMismatch,
  inheritedContentRepairs: 0, authorContentRepairs: 0, totalContentRepairs: 0,
  maximumContentRepairs: 1, remainingContentRepairs: 1,
  firstCropAttempts: f.id === "fig-42" ? 1 : 0,
  vectorizeAttempts: 0, modernFigureAttempts: 0,
  sourceApproval: false, independentReview: "PENDING"
})));

const report = {
  schema: "d203/author-report@1", batch: "D203", ticket: "STEMROBIN-181",
  role: input.role, cwd, book: "10p", physicalPages: [68, 69, 70],
  generatedAt: new Date().toISOString(),
  invocation: { finish: "review", grill: "self", alreadySatisfied: true, setupRepeated: false, freshnessRepeated: false, grillRepeated: false },
  status: "AUTHOR_CANDIDATES_COMPLETE_NATIVE_FIRST_FAILURE_HOLD_INDEPENDENT_SOURCE_REVIEW_PENDING",
  summary: {
    authorPages: 3, parserPassPages: 3, finalizePassPages: 1, finalizeFailedPages: 1,
    finalizeNotRunPages: 1, sourceApprovedPages: 0,
    nativeFirstFailure: "p0069-finalize-FIRST rejects faithfully retained ■ U+25A0; no source-content deletion to pass",
    terminalRightOpenUnit: "phy10-c1-s3-n26",
    independentSourceReview: "PENDING_ALL_THREE_PAGES_AND_PRECEDING_SOURCE67"
  },
  inputFreeze: frozen("input-freeze.json"),
  inputIntegrity,
  preparation: { status: "PREEXISTING_PASS_NOT_REPLAYED", receipt: binding(input.preparation.path), prepareCallsThisAuthor: 0, rerenderCalls: 0 },
  perPage, glyphHolds, sourceAnomalies: inventories.flatMap((p) => (p.sourceAnomalies || []).map((a) => ({ page: p.page, ...a }))),
  scanAnomalies: inventories.flatMap((p) => (p.scanAnomalies || []).map((a) => ({ page: p.page, ...a }))),
  boundaries,
  imageUsage: {
    actualImageOpens: 7, contextImageOpens: 7, maximumActualImageOpens: 8, maximumContextImageOpens: 24,
    inheritedImageOpens: 0, parentImageOpens: 0, gridsOpened: 0, previousSourceImagesOpened: 0,
    nextSourceImagesOpened: 0, events: imageEvents,
    countingBasis: "Every view_image image payload, including source-derived crops and first native crop, is counted. Native machine pixel I/O is not a model/context image open."
  },
  figures,
  native: {
    receipts: nativeReceipts,
    firstFailureReceipt: firstFailure.binding,
    stoppedDependentStages: ["p0069 vectorize", "p0070 finalize", "p0070 vectorize"],
    retryCalls: 0, passedStagesReplayed: 0, nativeReviewCalls: 0,
    failedOutputRetained: outputBindings[1],
    failureClassification: "NATIVE_CHARACTER_CONTRACT_REJECTS_FAITHFUL_PRINTED_SOURCE_MARKER; NOT_SCIENTIFIC_VERDICT_OR_SOURCE_APPROVAL",
    recoveryDisposition: "No authorized whitelist change and no deletion/substitution of printed ■. Preserve failure and stop dependent range stages."
  },
  frozenOriginalDrafts: originalDraftFiles,
  frozenEvidence,
  nonActions: {
    canonicalProductWrites: 0, sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
    sourceApproval: false, courseApproval: false, formalHandoff: false,
    nativeAssemblyCalls: 0, modernAdaptationCalls: 0, answerCalls: 0,
    envReadsOrWrites: 0, databaseWrites: 0, publisherCalls: 0, apiCalls: 0,
    modelCalls: 0, paidCalls: 0, networkCalls: 0, gitCalls: 0, deployCalls: 0,
    mainSyncCalls: 0, supervisorOrPeerMessages: 0,
    preparedSourceEditsOrChmods: 0, sourceContentRepairs: 0
  },
  limitations: [
    "Independent source review has not occurred. The author is not the independent reviewer and has not granted source or course approval.",
    "N25 local ending is observed, but SOURCE67 approval remains pending D196, so no assembled or approved N25 is claimed.",
    "N26 terminal source block is right-open; next-page continuation was not opened, inferred, assembled or released.",
    "p0070 has parser-derived candidate JSON only, not a native finalize/audit/crop/vector result.",
    "KaTeX warnings about Unicode м are retained in per-page audit evidence; they are not silently changed to Latin M.",
    "Write-scope compliance is established by this author's scoped actions and bindings, not by a prohibited Git or whole-canonical audit."
  ]
};
const reportBinding = writeJson("report.json", report);

const sourceManifest = path.join(cwd, "ssot-resources/soviet10year-textbooks/sources/manifest.json");
const manifest = readJson(sourceManifest);
const catalog = manifest.catalogs.find((c) => c.book === "10p");
const sourceRecord = manifest.pdfs.find((p) => p.book === catalog.sourcePdf);
const declaredRoot = path.isAbsolute(manifest.pdfRoot) ? manifest.pdfRoot : [
  path.join(cwd, manifest.pdfRoot), path.join(path.dirname(sourceManifest), manifest.pdfRoot)
].find(fs.existsSync);
if (!declaredRoot || !sourceRecord) throw new Error("Unable to bind native PDF source");
const pdf = binding(path.join(declaredRoot, sourceRecord.file));
const expectedPdfHash = readJson(path.join(root, "10p/pages/0068/page.json")).meta.source.pdf_sha256;
if (pdf.sha256 !== expectedPdfHash) throw new Error("PDF source changed");

const relevantContracts = [
  ".intentfold/readme.md", ".intentfold/project.json",
  ".intentfold/charter/engineering.md", ".intentfold/charter/operations.md", ".intentfold/charter/product.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".claude/skills/ld-s10y-lesson/tools/blocks.py", ".agents/skills/ld-s10y-image/SKILL.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md"
].map(binding);
const nativeTools = [
  ...new Set(nativeReceipts.flatMap((r) => r.value.nativeToolsAtCall.map((b) => b.path)))
].map(binding);
const drift = nativeReceipts.flatMap((r) => r.value.nativeToolsAtCall.flatMap((b) =>
  same(binding(b.path), b) ? [] : [{ receipt: r.binding, atCall: b, current: binding(b.path) }]
));
const preparationOutputs = input.pages.flatMap((p) => ["prepare.0001.stdout", "prepare.0001.stderr"].map((n) =>
  binding(path.join(path.dirname(p.source.path), n))));
const freeze = {
  schema: "d203/author-freeze@1", batch: "D203", ticket: "STEMROBIN-181",
  cwd, book: "10p", pages: [68, 69, 70], frozenAt: new Date().toISOString(),
  report: reportBinding,
  exactAuthorization: { current: binding(path.join(out, "input-freeze.json")), frozen: frozen("input-freeze.json"), writeScope: input.writeScope },
  inputs: {
    preparedPages: input.pages,
    preparationReceipt: binding(input.preparation.path), preparationOutputs,
    precedingCandidateText: binding(input.precedingCandidateText.path),
    precedingUsage: "p0067#9 textual tail only; no preceding source image/review reopened",
    toc: binding(input.toc.path), pdf, sourceManifest: binding(sourceManifest), relevantContracts
  },
  outputs: outputBindings,
  originalDrafts: parser.map(({ page, originals }) => ({ page, originals })),
  evidence: {
    frozenEvidence, nativeEvidenceFiles, originalDraftFiles,
    parserSummary: binding(path.join(out, "parser-summary.json")),
    initialInputBindings: binding(path.join(out, "input-bindings-before.json")),
    finalInputIntegrity: inputIntegrity
  },
  native: {
    receipts: nativeReceipts.map((r) => r.binding),
    toolsAtFreeze: nativeTools, toolDriftSinceCalls: drift,
    runtime: [
      binding(process.execPath),
      binding(".claude/skills/ld-s10y-lesson/.venv/bin/python"),
      binding(".claude/skills/ld-s10y-lesson/package.json"),
      binding(".claude/skills/ld-s10y-lesson/package-lock.json")
    ],
    firstFailure: firstFailure.binding,
    dependentStagesStopped: true, retries: 0, passedStageReplay: false
  },
  usage: { actualImageOpens: 7, contextImageOpens: 7, inheritedFigureRepairs: 0, fig42TotalContentRepairs: 0, fig43TotalContentRepairs: 0, perFigureContentRepairLimit: 1, paidCalls: 0 },
  immutability: {
    freezeAndReportMode: "0444",
    originalDraftSnapshotsMode: "0444",
    nativeEvidenceMode: "0444",
    frozenEvidenceCopiesMode: "0444",
    operativeCandidateFilesRemainWritable: true,
    preparedPageFilesUnmodifiedAndNotChmodded: true,
    originalInputAndSharedFilesNotChmodded: true,
    noArtifactMayBePromotedOrApprovedFromThisAuthorFreezeAlone: true
  },
  independentSourceReview: "PENDING",
  sourceApproval: false, courseApproval: false, canonicalPromotions: 0,
  terminalUnitRightOpen: "phy10-c1-s3-n26",
  selfBinding: "Manifest excludes its own recursive hash; exact manifest SHA256 is returned externally."
};
const freezeBinding = writeJson("author-freeze.json", freeze);
for (const b of [reportBinding, ...inputFiles, ...nativeEvidenceFiles, ...originalDraftFiles]) {
  requireSame(binding(b.path), b);
}
for (const e of frozenEvidence) {
  requireSame(binding(e.frozen.path), e.frozen);
  if ((fs.statSync(e.frozen.path).mode & 0o222) !== 0) throw new Error("Frozen evidence is writable");
}
for (const file of [reportBinding.path, freezeBinding.path]) {
  if ((fs.statSync(file).mode & 0o222) !== 0) throw new Error("Report/freeze is writable");
}
console.log(JSON.stringify({ report: reportBinding, authorFreeze: freezeBinding }, null, 2));
