import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== repo) throw new Error("Wrong cwd");
const parent = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d207-10p-source71-73-author");
const output = path.join(parent, "author-output");
const root = path.join(repo, ".tmp/STEMROBIN-181/d1816-d207/root");
const hash = data => crypto.createHash("sha256").update(data).digest("hex");
const binding = file => {
  const data = fs.readFileSync(file);
  return { path: file, bytes: data.length, sha256: hash(data) };
};
const verify = expected => {
  const actual = binding(expected.path);
  if (actual.bytes !== expected.bytes || actual.sha256 !== expected.sha256) {
    throw new Error(`Binding mismatch: ${expected.path}`);
  }
  return actual;
};
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};
const reportPath = path.join(output, "report.json");
const authorFreezePath = path.join(output, "author-freeze.json");
if (fs.existsSync(reportPath) || fs.existsSync(authorFreezePath)) throw new Error("Final evidence already exists");
const inputPath = path.join(parent, "input-freeze.json");
const input = read(inputPath);
const draftFreezePath = path.join(output, "draft-freeze.json");
const draftFreeze = read(draftFreezePath);
const statePath = path.join(output, "native-state.json");
const state = read(statePath);
const opensPath = path.join(output, "visual-opens.json");
const opens = read(opensPath);
const uncertaintiesPath = path.join(output, "source-uncertainties.json");
const uncertainties = read(uncertaintiesPath);
const cropObservationsPath = path.join(output, "author-crop-observations.json");
const cropObservations = read(cropObservationsPath);
verify(draftFreeze.inputFreeze);
verify(state.inputFreeze);
verify(state.immutableDraftFreeze);
for (const page of input.pages) for (const field of ["source", "grid", "template", "layout"]) verify(page[field]);
for (const expected of [input.preparation, input.precedingCandidateText, input.toc, draftFreeze.sourcePdf]) verify(expected);
for (const draft of draftFreeze.drafts) {
  for (const field of ["immutableMarkdown", "immutableParsedCandidate"]) {
    const item = draft[field];
    verify(item);
    if (!item.path.startsWith(path.join(output, "original-drafts") + path.sep)) {
      throw new Error("Historical draft bound outside immutable original-drafts");
    }
    if (fs.statSync(item.path).mode & 0o222) throw new Error("Immutable draft is writable");
  }
}
if (opens.opens.length !== 8 || opens.actualImageOpens !== 8 ||
    opens.contextImageOpens > 24 || opens.parentImageOpens !== 0) {
  throw new Error("Actual image-open ledger violates invocation bounds");
}
if (cropObservations.actualTotalFigureContentRepairs !== 0 || input.inheritedFigureContentRepairs !== 0) {
  throw new Error("Unexpected figure repair use");
}
const frozenOutputs = [];
const freezeOutput = (file, relative) => {
  const current = binding(file);
  const frozenPath = path.join(output, "frozen-final", relative);
  fs.mkdirSync(path.dirname(frozenPath), { recursive: true });
  fs.copyFileSync(file, frozenPath, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(frozenPath, 0o444);
  const frozen = binding(frozenPath);
  if (current.sha256 !== frozen.sha256 || current.bytes !== frozen.bytes) throw new Error("Frozen copy differs");
  const pair = { current, frozen };
  frozenOutputs.push(pair);
  return pair;
};
const receiptEvidence = [];
for (const stage of state.stages) {
  if (!stage.receipt) continue;
  verify(stage.receipt);
  const receipt = read(stage.receipt.path);
  verify(receipt.stdout);
  verify(receipt.stderr);
  for (const file of [stage.receipt.path, receipt.stdout.path, receipt.stderr.path]) fs.chmodSync(file, 0o444);
  receiptEvidence.push({
    page: stage.page,
    stage: stage.stage,
    status: stage.status,
    receipt: stage.receipt,
    stdout: receipt.stdout,
    stderr: receipt.stderr,
    exitCode: receipt.exitCode,
  });
}
const perPage = [];
for (const page of input.pages) {
  const key = String(page.page).padStart(4, "0");
  const pageDir = path.join(root, "10p/pages", key);
  const draft = draftFreeze.drafts.find(item => item.page === page.page);
  const inventoryPath = path.join(output, "source-inventory", `${key}.json`);
  const inventory = read(inventoryPath);
  const finalize = state.stages.find(item => item.page === page.page && item.stage === "finalize");
  const vectorize = state.stages.find(item => item.page === page.page && item.stage === "vectorize");
  const finalized = Boolean(finalize.receipt);
  const candidates = ["page.md", "page.json"].map(file =>
    freezeOutput(path.join(pageDir, file), path.join(key, file)));
  const auditPath = path.join(pageDir, "audit.json");
  const audit = fs.existsSync(auditPath) ? read(auditPath) : null;
  const auditEvidence = audit ? freezeOutput(auditPath, path.join(key, "audit.json")) : null;
  const nativeFigures = [];
  const figuresDir = path.join(path.dirname(page.source.path), "figures");
  if (fs.existsSync(figuresDir)) {
    for (const file of fs.readdirSync(figuresDir).sort()) {
      if (!/\.(png|svg)$/.test(file)) throw new Error("Unexpected native figure output");
      nativeFigures.push(freezeOutput(path.join(figuresDir, file), path.join(key, "figures", file)));
    }
  }
  if (!finalized && nativeFigures.length) throw new Error("Output from an unattempted dependent stage");
  if (!finalized) {
    if (candidates[0].current.sha256 !== draft.immutableMarkdown.sha256 ||
        candidates[1].current.sha256 !== draft.immutableParsedCandidate.sha256) {
      throw new Error("Unattempted candidate changed");
    }
  }
  perPage.push({
    page: page.page,
    printedPage: page.printedPage,
    sourceInputs: { original: page.source, grid: page.grid, template: page.template, layout: page.layout },
    inventory: binding(inventoryPath),
    immutableOriginalDraft: draft,
    currentCandidatesAndFrozenCopies: candidates,
    candidateKind: finalized ? "NATIVE_FINALIZE_OUTPUT_AUTHOR_ONLY" : "FULL_TEXT_AUTHOR_CANDIDATE_NATIVE_UNATTEMPTED",
    sourceStatus: "AUTHOR_ONLY_INDEPENDENT_SOURCE_REVIEW_PENDING",
    finalize, vectorize,
    nativeAuditAndFrozenCopy: auditEvidence,
    nativeAuditSummary: audit ? {
      linesPrintedByNative: audit.lines_printed,
      linesInMarkdown: audit.lines_md,
      errors: audit.errors,
      normalizations: audit.normalizations,
      unknownCharacters: audit.unknown_chars,
      katexWarnings: audit.katex_warnings,
      errataCount: audit.errata,
      snappedFigures: audit.figures,
    } : null,
    nativeFiguresAndFrozenCopies: nativeFigures,
    observedPrintedTextRows: inventory.observedPrintedTextRows,
    fullPrintedExerciseGroups: inventory.exerciseGroups,
    fullPrintedExerciseNumbers: inventory.exerciseNumbers,
    printedHeadings: inventory.headings,
    incomingBoundary: inventory.incoming,
    outgoingBoundary: inventory.outgoing,
    uncertaintyHoldIds: inventory.uncertaintyHoldIds,
    sourceApproval: false,
    figureApproval: false,
    courseApproval: false,
  });
}
const git = spawnSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" });
if (git.status !== 0) throw new Error("Cannot read repository revision");
const actualCounters = {
  actualImageOpens: opens.actualImageOpens,
  contextImageOpens: opens.contextImageOpens,
  parentImageOpens: opens.parentImageOpens,
  originalPageOpens: opens.sourcePageOpens,
  preparedGridOpens: opens.preparedGridOpens,
  nativeCropOpens: opens.nativeCropOpens,
  actualFinalizeInvocations: state.actualFinalizeInvocations,
  actualVectorizeInvocations: state.actualVectorizeInvocations,
  nativeRetries: 0,
  preparationInvocationsThisAuthor: 0,
  candidateSourcePagesWritten: perPage.length,
  completeTextCandidates: perPage.length,
  authorObservedPrintedTextRows: perPage.reduce((sum, page) => sum + page.observedPrintedTextRows, 0),
  nativeMechanicalPagePasses: perPage.filter(page => page.finalize.status === "NATIVE_MECHANICAL_PASS").length,
  nativePageFailures: perPage.filter(page => page.finalize.status === "NATIVE_FAILURE_HOLD").length,
  nativePagesUnattempted: perPage.filter(page => !page.finalize.receipt).length,
  nativePngCrops: perPage.flatMap(page => page.nativeFiguresAndFrozenCopies).filter(item => item.current.path.endsWith(".png")).length,
  nativeSvgOutputs: perPage.flatMap(page => page.nativeFiguresAndFrozenCopies).filter(item => item.current.path.endsWith(".svg")).length,
  inheritedFigureContentRepairs: 0,
  figureContentRepairsThisInvocation: 0,
  maximumTotalContentRepairsPerFigure: 1,
  sourcePagesApproved: 0,
  sourcePagesAdded: 0,
  completeCoursesAdded: 0,
  coursesApproved: 0,
  canonicalPromotions: 0,
  canonicalConsumption: 0,
  assemblyInvocations: 0,
  modernAdaptationInvocations: 0,
  answerOrChoiceInvocations: 0,
  dbCalls: 0,
  publisherCalls: 0,
  apiCalls: 0,
  paidCalls: 0,
  commits: 0,
  pushes: 0,
  merges: 0,
  deployments: 0,
  closureActions: 0,
  globalChecks: 0,
  peerOrSupervisorMessages: 0,
  childAgents: 0,
};
const preparationLogs = input.pages.map(page => ({
  page: page.page,
  stdout: binding(path.join(path.dirname(page.source.path), "prepare.0001.stdout")),
  stderr: binding(path.join(path.dirname(page.source.path), "prepare.0001.stderr")),
}));
const report = {
  schema: "STEMROBIN-181/source-transcription-author-report@1",
  ticket: "STEMROBIN-181",
  batch: "D207",
  role: input.role,
  book: "10p",
  physicalPages: [71, 72, 73],
  printedPages: [61, 62, 63],
  status: "HOLD_NATIVE72_LINE_COUNT_AND_INDEPENDENT_SOURCE_REVIEW",
  generatedAt: new Date().toISOString(),
  cwd: repo,
  gitRevision: git.stdout.trim(),
  authorization: {
    ongoingOfflineProductionExplicitlyAuthorized: true,
    sameInvocationSetupFreshnessGrillSatisfiedByDirectHumanInstruction: true,
    writeScope: input.writeScope,
    noAdditionalCapabilityInvocation: true,
    originalPreparedPixelsGridLayoutTemplateImmutable: true,
    firstNativeOnlyNoRetries: true,
    stopDependentRangeStagesAtFirstNativeFailure: true,
    stopAtOneTotalFigureContentRepairAndHold: true,
  },
  inputFreeze: binding(inputPath),
  sourceInputs: {
    pages: input.pages,
    sourcePdf: draftFreeze.sourcePdf,
    sourceManifest: draftFreeze.sourceManifest,
    exerciseNumbering: draftFreeze.exerciseNumbering,
    toc: input.toc,
    preparationReceipt: input.preparation,
    preparationLogs,
    precedingCandidateText: input.precedingCandidateText,
    precedingSourceStatus: input.precedingSourceStatus,
    incomingTail: input.incomingTail,
    incomingTailApprovalInferred: false,
  },
  immutableDraftFreeze: binding(draftFreezePath),
  historicalDraftBindingRule: "Pre-finalize draft hashes bind ONLY read-only original-drafts snapshot files. No historical hash is assigned to an operative path overwritten by native finalize.",
  currentOutputBindingRule: "Every native output and operative full-text candidate is bound to its current path/bytes/SHA256 and an equal-byte read-only frozen-final copy.",
  pages: perPage,
  nativeState: binding(statePath),
  nativeReceipts: receiptEvidence,
  firstNativeFailure: state.firstFailure,
  nativeFailureDisposition: "Page72 finalize failed 20 native printed rows versus 21 full author rows. No text/figure edits or native retries were made to force passage. Page72 vectorize and all page73 native stages were not attempted.",
  uncertaintyHolds: uncertainties.holds,
  sourceUncertaintyFile: binding(uncertaintiesPath),
  visualOpenLedger: binding(opensPath),
  visualImageBindings: opens.opens.map(item => ({ ...item, image: binding(item.path) })),
  authorCropObservations: binding(cropObservationsPath),
  authorCropObservationSummary: cropObservations.observations,
  runtimeAtFirstNative: { profile: draftFreeze.profile, files: draftFreeze.runtimeInputs },
  runtimeCurrentAtReport: {
    profile: binding(draftFreeze.profile.path),
    files: draftFreeze.runtimeInputs.map(item => binding(item.path)),
  },
  preparedSourceBindingsVerifiedUnchanged: true,
  actualCounters,
  sourceApproval: false,
  figureApproval: false,
  courseApproval: false,
  formalHandoff: false,
  canonicalConsumptionAuthorized: false,
  terminalUnitN27RightOpen: true,
  squareMarkerPolicy: {
    sharedProfileAdmits: "■",
    observedInThisSourceRange: false,
    removedToPassNative: false,
  },
  authorFreezePath,
};
writeNew(reportPath, report);
const evidenceFiles = [
  reportPath, draftFreezePath, statePath, opensPath, uncertaintiesPath, cropObservationsPath,
  path.join(output, "native-first.mjs"), path.join(output, "finalize-evidence.mjs"),
  ...perPage.map(page => page.inventory.path),
  ...receiptEvidence.flatMap(item => [item.receipt.path, item.stdout.path, item.stderr.path]),
  ...draftFreeze.drafts.flatMap(item => [item.immutableMarkdown.path, item.immutableParsedCandidate.path]),
  ...draftFreeze.drafts.flatMap(item => {
    const key = String(item.page).padStart(4, "0");
    return [path.join(output, "candidate-parser", `${key}.stdout`), path.join(output, "candidate-parser", `${key}.stderr`)];
  }),
];
for (const file of evidenceFiles) fs.chmodSync(file, 0o444);
const authorFreeze = {
  schema: "STEMROBIN-181/source-transcription-author-freeze@1",
  ticket: "STEMROBIN-181",
  batch: "D207",
  book: "10p",
  createdAt: new Date().toISOString(),
  status: report.status,
  inputFreeze: report.inputFreeze,
  report: binding(reportPath),
  sourceInputs: report.sourceInputs,
  immutableDraftFreeze: report.immutableDraftFreeze,
  immutableOriginalDrafts: draftFreeze.drafts,
  currentOutputsAndImmutableFrozenCopies: frozenOutputs,
  currentAuthorEvidenceBindings: evidenceFiles.map(binding),
  nativeReceipts: receiptEvidence,
  firstNativeFailure: state.firstFailure,
  actualCounters,
  immutableHistoricalDraftPathRuleVerified: true,
  frozenOutputByteEqualityVerified: true,
  originalPreparedInputsUnchanged: true,
  sourceApproval: false,
  figureApproval: false,
  courseApproval: false,
  sourcePagesAdded: 0,
  completeCoursesAdded: 0,
  canonicalPromotions: 0,
  paidCalls: 0,
  formalHandoff: false,
};
writeNew(authorFreezePath, authorFreeze);
fs.chmodSync(authorFreezePath, 0o444);

// One final ticket-scoped binding verification; it does not rerun native stages or approve content.
const visit = value => {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string" && typeof value.bytes === "number") verify(value);
  for (const child of Object.values(value)) visit(child);
};
visit(report);
visit(authorFreeze);
console.log(JSON.stringify({
  report: binding(reportPath),
  authorFreeze: binding(authorFreezePath),
  status: report.status,
  actualCounters,
  finalBindingVerification: "PASS",
}, null, 2));
