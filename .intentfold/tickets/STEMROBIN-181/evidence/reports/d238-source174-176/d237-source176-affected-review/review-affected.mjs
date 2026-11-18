import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticketTmp = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp");
const out = path.dirname(new URL(import.meta.url).pathname);
const oldRoot = path.join(ticketTmp, "d224-source176-first-author");
const newRoot = path.join(ticketTmp, "d236-source176-affected-repair");
const priorRoot = path.join(ticketTmp, "d231-source176-and-raw134-first-review");
const hash = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const bind = p => ({path: p, sha256: hash(p)});
const checks = [];
function verify(p, expectedSha256, kind) {
  p = path.resolve(root, p);
  const sha256 = hash(p);
  checks.push({path: p, expectedSha256, sha256, kind, matches: sha256 === expectedSha256});
}
function walk(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    verify(value.path, value.sha256, "freeze-reference");
  }
  for (const child of Object.values(value)) walk(child);
}
const freezePath = path.join(newRoot, "author-freeze.json");
verify(freezePath, "3a4d55dde21ff29ec50bc5b71b47a0365de28d12cb7b3820ccaa702a95300b05", "repair-freeze");
const freeze = read(freezePath);
walk(freeze);
verify(path.join(priorRoot, "output-hashes.json"), "1e43ebe8c067bcd5d4f7a049f5fec1499de91d40a4e92165624974ddcc79264e", "prior-output-manifest");
const priorOutputs = read(path.join(priorRoot, "output-hashes.json"));
for (const file of priorOutputs.files) verify(file.path, file.sha256, "prior-review-preservation");
const prior = read(path.join(priorRoot, "report.json"));
const priorLedger = read(path.join(priorRoot, "actual-opens.json"));
const priorDetails = read(path.join(priorRoot, "source176-detail-observations.json"));
verify(prior.raw134.authorFreeze.path, prior.raw134.authorFreeze.sha256, "inherited-RAW-freeze");
for (const field of ["actualnativeCrop", "existingSvg", "preview"]) {
  verify(prior.raw134[field].path, prior.raw134[field].sha256, "inherited-RAW-evidence-hash-only");
}
const relativePage = "source/10p/pages/0176";
const oldMdPath = path.join(oldRoot, relativePage, "page.md");
const newMdPath = path.join(newRoot, relativePage, "page.md");
const oldJsonPath = path.join(oldRoot, relativePage, "page.json");
const newJsonPath = path.join(newRoot, relativePage, "page.json");
const oldText = "光通量的单位 取流明作为光通量的单位. 1 流明是发";
const newText = "光通量的单位 取流明作为光通量的单位，1 流明是发";
function soleReplacement(oldPath, newPath) {
  const original = fs.readFileSync(oldPath);
  const repaired = fs.readFileSync(newPath);
  const text = original.toString("utf8");
  const occurrences = text.split(oldText).length - 1;
  const expected = Buffer.from(text.replace(oldText, newText), "utf8");
  return {
    original: bind(oldPath),
    repaired: bind(newPath),
    oldTextOccurrences: occurrences,
    exactExpectedByteReplacement: occurrences === 1 && expected.equals(repaired),
    otherBytesUnchanged: occurrences === 1 && expected.equals(repaired),
    oldText,
    newText
  };
}
const mdDiff = soleReplacement(oldMdPath, newMdPath);
const jsonByteDiff = soleReplacement(oldJsonPath, newJsonPath);
const oldJson = read(oldJsonPath);
const newJson = read(newJsonPath);
function changedPointers(a, b, pointer = "") {
  if (Object.is(a, b)) return [];
  if (!a || !b || typeof a !== "object" || typeof b !== "object" || Array.isArray(a) !== Array.isArray(b)) return [pointer];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].flatMap(key => {
    const escaped = key.replaceAll("~", "~0").replaceAll("/", "~1");
    if (!Object.hasOwn(a, key) || !Object.hasOwn(b, key)) return [`${pointer}/${escaped}`];
    return changedPointers(a[key], b[key], `${pointer}/${escaped}`);
  });
}
const pointers = changedPointers(oldJson, newJson);
const unchangedFiles = [
  path.join(relativePage, "audit.json"),
  "work/10p/pages/0176/page.png",
  "work/10p/pages/0176/layout.json",
  "work/10p/pages/0176/page.grid.png",
  "work/10p/pages/0176/page.template.md"
].map(relative => {
  const originalPath = path.join(oldRoot, relative);
  const repairedPath = path.join(newRoot, relative);
  return {
    relativePath: relative,
    original: bind(originalPath),
    repaired: bind(repairedPath),
    byteIdentical: fs.readFileSync(originalPath).equals(fs.readFileSync(repairedPath)),
    imageOpened: false
  };
});
const oldFreeze = read(path.join(oldRoot, "author-freeze.json"));
verify(oldFreeze.inputManifest.path, oldFreeze.inputManifest.sha256, "old-preparation-manifest");
const preparation = read(path.resolve(root, oldFreeze.inputManifest.path));
const prepared176 = preparation.outputs.find(p => p.physicalPage === 176);
for (const name of ["page.png", "layout.json"]) {
  const prepared = prepared176.files.find(f => f.path.endsWith(`/${name}`));
  verify(prepared.path, prepared.sha256, "prepared-source-binding-hash-only");
  verify(path.join(oldRoot, "work/10p/pages/0176", name), prepared.sha256, "old-copy-prepared-binding");
  verify(path.join(newRoot, "work/10p/pages/0176", name), prepared.sha256, "repaired-copy-prepared-binding");
}
const native = read(path.join(newRoot, "native.json"));
const audit = read(path.join(newRoot, relativePage, "audit.json"));
const lineCount = newJson.blocks.reduce((sum, block) => sum + block.lines.length, 0);
const boldNotes = newJson.meta.notes.filter(n => n.type === "bold");
const pointSourceCoveredByDeclaredBold = boldNotes.some(n => typeof n.text === "string" && n.text.includes("点光源"));
const currentNative = {
  receipt: bind(path.join(newRoot, "native.json")),
  exitCode: native.exitCode,
  freezeExitCode: freeze.actualNativeExit,
  receiptMatchesFreezeHash: checks.find(c => c.path === path.join(newRoot, "native.json"))?.matches ?? false,
  commandTargetsRepairedPage: native.command.includes("176") && native.command.includes(path.join(newRoot, "source")) && native.command.includes(path.join(newRoot, "work")),
  auditLinesPrinted: audit.lines_printed,
  auditLinesMd: audit.lines_md,
  structuredLines: lineCount,
  stdoutHas24of24: native.stdout.includes("24 行（印刷 24）"),
  reviewerNativeCommandsExecuted: 0
};
const inheritedHold = prior.source176.checks.emphasis.pointSourceBoldStatus;
const priorFinding = priorDetails.findings.find(f => f.id === "SOURCE176-F01");
const invariants = {
  allInputHashesMatch: checks.every(c => c.matches),
  mdOnlyExpectedReplacement: mdDiff.exactExpectedByteReplacement,
  jsonOnlyExpectedReplacement: jsonByteDiff.exactExpectedByteReplacement,
  soleStructuredChangedPointer: pointers.length === 1 && pointers[0] === "/blocks/2/lines/0",
  newAffectedRowMatchesRecordedCommaObservation: newJson.blocks[2].lines[0] === newText && priorFinding.sourceText.includes("单位，1"),
  auditAndAllPreparedWorkBytesUnchanged: unchangedFiles.every(f => f.byteIdentical),
  metaNotesAndAllOtherStructuredContentUnchanged: pointers.length === 1 && pointers[0] === "/blocks/2/lines/0",
  nativeCurrentExitZeroAnd24of24: currentNative.exitCode === 0 && currentNative.freezeExitCode === 0 && currentNative.commandTargetsRepairedPage && audit.lines_printed === 24 && audit.lines_md === 24 && lineCount === 24 && currentNative.stdoutHas24of24,
  priorPointSourceBoldHoldPresent: inheritedHold === "HOLD-NOT-POSITIVELY-ESTABLISHED",
  pointSourceNotInDeclaredBoldScope: !pointSourceCoveredByDeclaredBold,
  priorCumulativeImagesFive: priorLedger.cumulativeTotal === 5 && priorLedger.opens.length === 5,
  inheritedRawStatusPass: prior.raw134.status === "PASS",
  inheritedCropCompletenessHold: prior.raw134.unobservedChecks.cropCompletenessAgainstFull175Page === "HOLD-NOT-OBSERVED-IN-THIS-SCOPE"
};
function writeNew(name, data) {
  fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n", {flag: "wx"});
}
writeNew("input-bindings.json", {
  schema: "stemrobin/text-only-affected-review-bindings@1",
  scope: "SOURCE176-F01",
  status: invariants.allInputHashesMatch ? "PASS" : "FAIL",
  checks,
  noImagePayloadRead: true
});
writeNew("byte-delta.json", {
  schema: "stemrobin/sole-affected-source-delta@1",
  finding: "SOURCE176-F01",
  md: mdDiff,
  json: jsonByteDiff,
  changedJsonPointers: pointers,
  unchangedFiles,
  onlyChangedContentFiles: ["source/10p/pages/0176/page.md", "source/10p/pages/0176/page.json"],
  uniqueChangedSourceRow: "p0176#3 line 1",
  sourcePngAndLayoutComparedByBytesNotVisuallyReopened: true
});
writeNew("actual-opens.json", {
  schema: "stemrobin/text-only-affected-actual-opens@1",
  inheritedLedger: bind(path.join(priorRoot, "actual-opens.json")),
  inheritedOpens: 5,
  newOpens: [],
  newTotal: 0,
  cumulativeTotal: 5,
  contextLimit: 24,
  contextReset: false,
  parentContextTotal: 24,
  parentOpens: 0,
  screenshotsGenerated: 0,
  imagePayloadsLoaded: 0
});
const valid = Object.values(invariants).every(Boolean);
const review = {
  schema: "stemrobin/text-only-affected-review@1",
  ticket: "STEMROBIN-181",
  reviewerUnit: "d237-source176-affected-review",
  date: "2026-11-17",
  writeRoot: out,
  status: valid ? "PASS" : "FAIL",
  statusScope: "SOURCE176-F01 punctuation repair only; not a fresh full-source or display review.",
  authorFreeze: bind(freezePath),
  inheritedFirstReview: bind(path.join(priorRoot, "report.json")),
  currentAuthorMd: bind(newMdPath),
  currentAuthorJson: bind(newJsonPath),
  currentAuthorAudit: bind(path.join(newRoot, relativePage, "audit.json")),
  inputBindings: bind(path.join(out, "input-bindings.json")),
  byteDelta: bind(path.join(out, "byte-delta.json")),
  actualOpens: bind(path.join(out, "actual-opens.json")),
  resolvedFinding: {
    id: "SOURCE176-F01",
    priorStatus: "FAIL",
    currentStatus: valid ? "PASS-RESOLVED" : "FAIL-NOT-RESOLVED",
    sourceRef: "p0176#3",
    line: 1,
    jsonPointer: "/blocks/2/lines/0",
    basis: "The repaired comma matches the already-observed original pixels recorded at d231 open sequence 2. No new source observation.",
    priorPixelObservation: bind(path.join(priorRoot, "source176-detail-observations.json")),
    priorOriginalPage: prior.source176.originalPage,
    priorFailureFileRetainedUnchanged: true,
    otherSourceRowsReviewedAgain: false
  },
  currentNativeExit: currentNative,
  inheritedSource176: {
    firstReviewStatusRemainsHistorical: prior.source176.status,
    firstReviewChecksInheritedApartFromResolvedF01: true,
    pointSourceBoldStatus: inheritedHold,
    pointSourceBoldHoldFromInitialDetailObservation: priorDetails.clarifications[0].status,
    pointSourceCoveredByDeclaredBold,
    unchangedDeclaredBoldSpans: boldNotes.map(n => ({sourceRef: n.block, text: n.text, lineRange: n.line_range})),
    strictScopeExplanation: "Existing explicit bold notes cover only the inline 光通量的单位 heading in p0176#3 and the illuminance definition in p0176#6, not 点光源. This repair does not change those notes or claim point-source bold fidelity. The original pointSourceBoldStatus HOLD is retained, not waived or changed to PASS.",
    sourceBoundaryChecks: prior.source176.checks.blockMapping,
    n68RightBoundary: "HOLD-UNOBSERVED",
    wholeSource176UnqualifiedPass: false,
    necessaryDisplayBatch: "NOT-PERFORMED"
  },
  inheritedRaw134: {
    status: prior.raw134.status,
    passScope: prior.raw134.passScope,
    authorFreeze: prior.raw134.authorFreeze,
    actualnativeCrop: prior.raw134.actualnativeCrop,
    existingSvg: prior.raw134.existingSvg,
    preview: prior.raw134.preview,
    pixelComparison: prior.raw134.pixelComparison,
    unobservedChecks: prior.raw134.unobservedChecks,
    modernFigure: false,
    rereviewedOrReopened: false
  },
  invariants,
  imageBudget: {newImages: 0, inheritedImages: 5, cumulativeReviewerImages: 5, contextLimit: 24, reset: false},
  preservation: {
    d231AndAuthorsUnchanged: true,
    writesOnlyD237: true,
    prepareFinalizeVectorizeAssembleRun: false,
    newSourceImageCropPreviewScreenshotOrDisplayBatch: false,
    meterIndexSkillsCanonicalAppDependencyDatabaseGit: false,
    spawnedAgentsOrChildProcesses: false,
    branchChange: false
  }
};
writeNew("affected-review.json", review);
const finalChecks = checks.map(c => ({path: c.path, beforeSha256: c.sha256, afterSha256: hash(c.path), unchanged: hash(c.path) === c.sha256}));
writeNew("integrity.json", {
  schema: "stemrobin/affected-review-final-integrity@1",
  status: valid && finalChecks.every(c => c.unchanged) ? "PASS" : "FAIL",
  inputChecks: finalChecks,
  authorAndPriorReviewFilesUnchanged: finalChecks.every(c => c.unchanged),
  outputs: ["input-bindings.json", "byte-delta.json", "actual-opens.json", "affected-review.json", "review-affected.mjs"].map(name => bind(path.join(out, name))),
  imageOpens: 0,
  cumulativeImages: 5
});
writeNew("output-hashes.json", {
  schema: "stemrobin/affected-review-output-hashes@1",
  files: fs.readdirSync(out).filter(name => fs.statSync(path.join(out, name)).isFile() && name !== "output-hashes.json").sort().map(name => bind(path.join(out, name)))
});
console.log(JSON.stringify({
  status: review.status,
  scope: review.statusScope,
  review: bind(path.join(out, "affected-review.json")),
  integrity: bind(path.join(out, "integrity.json")),
  hashes: bind(path.join(out, "output-hashes.json")),
  newImages: 0,
  cumulativeImages: 5,
  failedInvariants: Object.entries(invariants).filter(([, value]) => !value).map(([key]) => key)
}));
if (!valid || finalChecks.some(c => !c.unchanged)) process.exitCode = 1;
