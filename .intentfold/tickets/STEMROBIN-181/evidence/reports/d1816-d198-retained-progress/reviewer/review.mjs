import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd, "Exact authorized cwd required");
const directory = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d198-source64-punctuation-review");
const script = fileURLToPath(import.meta.url);
assert.equal(script, path.join(directory, "review.mjs"));
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bindings = {};
const checkedBytes = new Map();
const checks = [];
const findings = [];
let affectedComparison = null;
let inherited = null;
let native = null;

function bind(role, filename, expected) {
  assert.equal(path.isAbsolute(filename), true, `Absolute path required: ${role}`);
  assert.equal(filename.startsWith(`${cwd}/`), true, `Outside checkout: ${role}`);
  assert.equal(/\.(?:png|jpg|jpeg|webp|pdf|svg)$/i.test(filename), false, "Pixel/media files must not be read");
  const bytes = fs.readFileSync(filename);
  const binding = {
    path: filename,
    bytes: bytes.length,
    sha256: sha(bytes),
    mode: (fs.statSync(filename).mode & 0o777).toString(8)
  };
  bindings[role] = binding;
  checkedBytes.set(filename, bytes);
  if (expected) {
    assert.equal(filename, expected.path, `Path mismatch: ${role}`);
    assert.equal(binding.bytes, expected.bytes, `Byte length mismatch: ${role}`);
    assert.equal(binding.sha256, expected.sha256, `SHA256 mismatch: ${role}`);
  }
  return bytes;
}

function json(role, filename, expected) {
  return JSON.parse(bind(role, filename, expected));
}

function checked(name, action) {
  action();
  checks.push({ name, verdict: "PASS" });
}

function onlyCommaDeletion(before, after, name) {
  let offset = 0;
  while (offset < after.length && before[offset] === after[offset]) offset++;
  const comma = Buffer.from("\uff0c", "utf8");
  assert.equal(before.length - after.length, comma.length, `${name}: one UTF8 character only`);
  assert.deepEqual(before.subarray(offset, offset + comma.length), comma, `${name}: deleted character`);
  assert.deepEqual(
    Buffer.concat([before.subarray(0, offset), before.subarray(offset + comma.length)]),
    after,
    `${name}: all other bytes unchanged`
  );
  return { byteOffsetZeroBased: offset, deletedCodePoint: "U+FF0C", utf8BytesDeleted: 3, allOtherBytesIdentical: true };
}

function save(filename, value) {
  assert.equal(path.dirname(filename), directory, "Writes restricted to reviewer directory");
  const text = `${JSON.stringify(value, null, 2)}\n`.replace(
    /[\u007f-\uffff]/g,
    character => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
  fs.writeFileSync(filename, text, { flag: "wx", mode: 0o444 });
  fs.chmodSync(filename, 0o444);
}

fs.chmodSync(script, 0o444);
bind("reviewCode", script);
let baseline;
try {
  baseline = json("affectedSourceBaseline", path.join(directory, "source-baseline.json"), {
    path: path.join(directory, "source-baseline.json"),
    bytes: 5029,
    sha256: "b0c8c05da3c0cd8a5ac56b259135cb3fcb2772ecc74493a394be297be3d36122"
  });
  checked("Affected source baseline sealed before repaired input read", () => {
    assert.equal(bindings.affectedSourceBaseline.mode, "444");
    assert.equal(baseline.createdBeforeAfterBaselineRead, true);
    assert.equal(baseline.currentRepairedCandidateRead, false);
  });
  for (const [role, expected] of Object.entries(baseline.sourceEvidenceBindings)) {
    bind(role, expected.path, expected);
  }
  const input = JSON.parse(checkedBytes.get(baseline.sourceEvidenceBindings.inputFreeze.path));
  const sourceOnly = JSON.parse(checkedBytes.get(baseline.sourceEvidenceBindings.sourceOnly.path));
  const d191 = JSON.parse(checkedBytes.get(baseline.sourceEvidenceBindings.d191Report.path));
  const d191Freeze = JSON.parse(checkedBytes.get(baseline.sourceEvidenceBindings.d191ReviewFreeze.path));
  const supplement = JSON.parse(checkedBytes.get(baseline.sourceEvidenceBindings.d191SourceClarification.path));
  const expectation = baseline.affectedSourceExpectation;
  checked("Expected full line comes from D191-F1 and its disclosed pixel clarification", () => {
    assert.equal(d191.findings.length, 1);
    assert.equal(d191.findings[0].id, "D191-F1");
    assert.equal(d191.findings[0].observedSource, expectation.observedOriginalFullLine);
    assert.equal(d191.findings[0].candidate, expectation.unsupportedCandidateFullLine);
    assert.equal(sourceOnly.independentFinding.observedSource, expectation.observedOriginalFullLine);
    assert.equal(supplement.correctedSourceRows.find(row => row.printedRow === 23).observedSource, expectation.observedOriginalFullLine);
    assert.equal(sourceOnly.imagesAuthorized ?? input.imagesAuthorized, 0);
    assert.equal(sha(checkedBytes.get(sourceOnly.firstIndependentBaseline.path)), sourceOnly.firstIndependentBaseline.sha256);
    assert.deepEqual(bindings.sourceOnly.sha256, input.sourceOnly.sha256);
  });
  const after = json("afterBaseline", input.afterBaseline.path, input.afterBaseline);
  for (const [role, expected] of [
    ["repairReport", after.repairedAuthor],
    ["repairFreeze", after.repairFreeze],
    ["firstFailedReview", after.firstFailedReview],
    ["originalCollectedReview", after.originalCollectedReview]
  ]) bind(role, expected.path, expected);
  const repairFreeze = JSON.parse(checkedBytes.get(after.repairFreeze.path));
  const repairReport = JSON.parse(checkedBytes.get(after.repairedAuthor.path));
  const originalCollected = JSON.parse(checkedBytes.get(after.originalCollectedReview.path));
  const sets = {};
  for (const [group, entries] of [["before", repairFreeze.before], ["frozen", after.frozen], ["candidate", repairFreeze.candidate]]) {
    sets[group] = {};
    for (const entry of entries) sets[group][path.basename(entry.path)] = bind(`${group}.${path.basename(entry.path)}`, entry.path, entry);
  }
  checked("Before snapshots retain the actual D191-reviewed candidate identity", () => {
    const original = d191Freeze.currentInputs;
    for (const [filename, role] of [
      ["page.md", "afterInventory.candidateMarkdown"],
      ["page.json", "afterInventory.candidateStructuredPage"],
      ["audit.json", "afterInventory.audit"]
    ]) {
      assert.equal(sha(sets.before[filename]), original[role].sha256);
      assert.equal(sets.before[filename].length, original[role].bytes);
    }
    assert.equal(originalCollected.independentApproval, false);
    assert.equal(originalCollected.independentTextApproval, false);
    assert.equal(originalCollected.originalFailuresPreserved, true);
    assert.equal(d191.sourceVerdict, "FAIL");
  });
  const beforePage = JSON.parse(sets.before["page.json"]);
  const correctedPage = JSON.parse(sets.frozen["page.json"]);
  const beforeMarkdownLines = sets.before["page.md"].toString("utf8").split("\n");
  const correctedMarkdownLines = sets.frozen["page.md"].toString("utf8").split("\n");
  checked("Corrected full line exactly matches independently observed original text", () => {
    assert.equal(beforePage.blocks[10].lines[4], expectation.unsupportedCandidateFullLine);
    assert.equal(correctedPage.blocks[10].lines[4], expectation.observedOriginalFullLine);
    assert.equal(beforeMarkdownLines[82], expectation.unsupportedCandidateFullLine);
    assert.equal(correctedMarkdownLines[82], expectation.observedOriginalFullLine);
  });
  const markdownDelta = onlyCommaDeletion(sets.before["page.md"], sets.frozen["page.md"], "Markdown");
  const structuredDelta = onlyCommaDeletion(sets.before["page.json"], sets.frozen["page.json"], "Structured page");
  checked("Only the affected field and matching markdown character changed", () => {
    const expectedPage = structuredClone(beforePage);
    expectedPage.blocks[10].lines[4] = expectation.observedOriginalFullLine;
    assert.deepEqual(correctedPage, expectedPage);
    for (const filename of ["page.md", "page.json", "audit.json"]) {
      assert.deepEqual(sets.candidate[filename], sets.frozen[filename], `Current/frozen identity: ${filename}`);
    }
    assert.deepEqual(sets.before["audit.json"], sets.frozen["audit.json"], "Audit bytes unchanged");
    assert.equal(after.cumulativeSource64TextRepairs, 1);
    assert.equal(repairReport.cumulativeSource64TextRepairs, 1);
    assert.equal(repairReport.figureContentRepairs, 0);
  });
  checked("Unaffected source, questions, rows and boundary decisions inherited without replay", () => {
    const passes = d191.wholePageComparison.blockVerdicts.filter(block => block.verdict === "PASS");
    assert.equal(passes.length, 11);
    assert.deepEqual(passes.map(block => block.ref), baseline.inheritedDecisions.unaffectedBlockRefs);
    assert.deepEqual(after.inheritedUnaffectedBlockVerdicts, passes);
    assert.equal(d191.rowVerdict, "PASS");
    assert.equal(d191.originalTaskPreservation.count, 4);
    assert.equal(d191.taskPreservationVerdict, "PASS");
    assert.equal(d191.boundaryVerdict, "PASS");
    assert.equal(d191.boundaries.outgoing.n24Complete, false);
    assert.equal(after.inheritedBoundaryVerdict, "PASS");
    assert.equal(after.inheritedTaskPreservationVerdict, "PASS");
  });
  affectedComparison = {
    sourceRef: "p0064#11",
    printedRow: 23,
    blockLine: 5,
    markdownLine: 83,
    structuredLocation: "blocks[10].lines[4]",
    observedOriginalFullLine: expectation.observedOriginalFullLine,
    beforeFullLine: expectation.unsupportedCandidateFullLine,
    correctedFullLine: correctedPage.blocks[10].lines[4],
    fullLineExactEquivalence: true,
    markdownDelta,
    structuredDelta,
    allOtherStructuredFieldsAndMarkdownBytesUnchanged: true,
    currentCandidateEqualsFrozenExactly: true,
    auditBytesUnchanged: true
  };
  inherited = {
    verdictBasis: bindings.d191Report,
    unaffectedBlockCount: 11,
    blockVerdicts: after.inheritedUnaffectedBlockVerdicts,
    rowVerdict: "PASS",
    printedRows: 24,
    taskPreservationVerdict: "PASS",
    n23OriginalQuestionCount: 4,
    originalQuestionsAndGivensUnchanged: true,
    boundaryVerdict: "PASS",
    n23EndingClosed: true,
    n24StartRef: "p0064#9",
    outgoingRef: "p0064#11",
    outgoingOpen: true,
    n24Complete: false,
    wholePageSourceReviewReplayed: false,
    pixelReviewReplayed: false
  };
  native = {
    verdict: "PASS_INHERITED_NOT_REVIEWED_AGAIN",
    rows: "24/24",
    evidenceBasis: bindings.repairReport,
    receipt: repairReport.native,
    nativeCommandsRun: 0,
    nativeReviewReplayed: false,
    nativePassUsedAsSourceApproval: false
  };
  checked("Bound input bytes remain unchanged at result freeze", () => {
    for (const [filename, bytes] of checkedBytes) {
      assert.equal(sha(fs.readFileSync(filename)), sha(bytes), `Concurrent input drift: ${filename}`);
    }
  });
} catch (error) {
  findings.push({
    id: "D198-H1",
    priority: "P2",
    sourceRef: "p0064#11",
    printedRow: 23,
    title: "Affected source approval held",
    reason: error.message,
    repairPerformed: false
  });
}

const pass = findings.length === 0;
const limits = {
  imagesAuthorized: 0, actualImageOpens: 0, sourcePixelsOrCropFilesRead: 0,
  parentImageOpens: 0, reviewerRepairs: 0, cumulativeSource64TextRepairs: 1,
  figureRepairs: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  canonicalPromotions: 0, modernAuthorship: 0, envReads: 0, databaseCalls: 0,
  publisherCalls: 0, networkCalls: 0, modelCalls: 0, paidCalls: 0,
  gitCommands: 0, deployCommands: 0, supervisorPeerMessages: 0,
  setupFreshnessGrillReplayed: false, nativeCommandsRun: 0,
  wholePageSourceReviewReplayed: false, pixelReviewReplayed: false,
  candidateEdits: 0, existingInputEdits: 0, figureApproval: false,
  courseApproval: false, productAcceptance: false, formalHandoff: false
};
const report = {
  schema: "ld-s10y-source-review/report@1",
  batch: "D198", ticket: "STEMROBIN-181",
  role: "SOLE_AFFECTED_SOURCE64_PUNCTUATION_REVIEW",
  cwd, book: "10p", physicalPage: 64, printedPage: 54,
  sameInvocation: true, finish: "review", grill: "self satisfied; not replayed",
  verdict: pass ? "PASS" : "HOLD",
  sourceVerdict: pass ? "PASS" : "HOLD",
  composedSourceApproval: pass,
  sourceApproval: pass,
  approvalScope: "Current corrected SOURCE64 page only, composed with D191 unchanged source, original-task, row and boundary decisions.",
  findings,
  resolvedFindings: pass ? [{
    id: "D191-F1", resolution: "Unsupported U+FF0C after Shi removed; complete corrected line equals D191 independently observed original exactly.",
    firstFailurePreserved: true, reviewerRepairPerformed: false
  }] : [],
  independence: {
    sourceOnlyAndD191BaselineAndFindingReadBeforeRepairedInputs: true,
    affectedBaselineSavedAndSealedBeforeAfterBaselineRead: true,
    baselineSealedAt: "2026-11-20T16:19:10.221Z",
    baseline: bindings.affectedSourceBaseline,
    directPixelObservationsReusedNotReopened: true,
    initialD191BaselineAndClarificationPreserved: true,
    repairAuthorClaimsUsedAsSourceTruth: false
  },
  affectedComparison, inheritedDecisions: inherited, nativeEvidence: native,
  bindingChecks: checks, currentInputs: bindings,
  preservationAndScope: limits,
  remainingScope: "Parent collection/closure only. No next reviewer, new source page, figure, course, canonical promotion or publication authorized."
};
const reportPath = path.join(directory, "report.json");
save(reportPath, report);
const reportBinding = {
  path: reportPath,
  bytes: fs.statSync(reportPath).size,
  sha256: sha(fs.readFileSync(reportPath)),
  mode: (fs.statSync(reportPath).mode & 0o777).toString(8)
};
const freezePath = path.join(directory, "review-freeze.json");
save(freezePath, {
  schema: "ld-s10y-source-review/freeze@1",
  batch: "D198", ticket: "STEMROBIN-181",
  role: "SOLE_AFFECTED_SOURCE64_PUNCTUATION_REVIEW",
  cwd, createdAt: new Date().toISOString(), sameInvocation: true,
  finish: "review", grill: "self satisfied; not replayed",
  verdict: report.verdict, sourceVerdict: report.sourceVerdict,
  composedSourceApproval: pass, sourceApproval: pass,
  approvalScope: report.approvalScope,
  report: reportBinding,
  currentInputs: bindings,
  affectedBaselineWrittenAndSealedBeforeRepairedInputRead: true,
  inheritedDecisionsReusedNotReplayed: true,
  allCurrentInputsVerified: pass,
  allNewReviewerEvidenceReadOnly: true,
  permissionChangesRestrictedToNewD198Evidence: true,
  preservationAndScope: limits,
  selfHashPolicy: "review-freeze.json SHA256 is returned externally; no self-referential hash is claimed."
});
console.log(JSON.stringify({
  sourceVerdict: report.sourceVerdict,
  composedSourceApproval: pass,
  checks,
  findings,
  affectedComparison,
  outputs: [
    reportBinding,
    { path: freezePath, bytes: fs.statSync(freezePath).size, sha256: sha(fs.readFileSync(freezePath)), mode: (fs.statSync(freezePath).mode & 0o777).toString(8) }
  ]
}, null, 2));
