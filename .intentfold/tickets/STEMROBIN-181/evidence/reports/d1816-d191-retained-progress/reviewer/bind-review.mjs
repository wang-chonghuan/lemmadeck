import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const repo = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), repo);
const dir = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d191-10p-source64-review");
const output = name => path.join(dir, name);
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return {
    path: path.resolve(file),
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    mode: (fs.statSync(file).mode & 0o777).toString(8)
  };
};
const writeNew = (name, value) => {
  const file = output(name);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  fs.chmodSync(file, 0o444);
  return bind(file);
};
const whitespaceOnly = line => line.replace(/\s+/gu, "");
const inventory = read(output("after-inventory.json"));
const source = read(output("source-only.json"));
const input = read(output("input-freeze.json"));
const supplement = read(output("source-observations-supplement.json"));

if (process.argv[2] === "compare") {
  const baseline = read(output("source-baseline.json"));
  const baselineBinding = bind(output("source-baseline.json"));
  assert.equal(baselineBinding.sha256, supplement.baseline.sha256);
  assert.equal(baselineBinding.bytes, supplement.baseline.bytes);
  assert.equal(baselineBinding.mode, "444");
  const page = read(inventory.candidateStructuredPage.path);
  const md = fs.readFileSync(inventory.candidateMarkdown.path, "utf8");
  const draft = fs.readFileSync(inventory.frozenDraft.path, "utf8");
  const sections = md.split(/^---\r?$/mu);
  const draftSections = draft.split(/^---\r?$/mu);
  assert.equal(sections.length, 3);
  assert.equal(draftSections.length, 3);
  const metadata = JSON.parse(sections[1]);
  const parsedBlocks = [];
  let current;
  for (const line of sections[2].split(/\r?\n/u)) {
    const marker = /^<!--\s+(.+?)\s+-->$/u.exec(line);
    if (marker) {
      const [kind, ...tokens] = marker[1].split(/\s+/u);
      current = { kind, label: kind === "ex" ? tokens[0] : null, cont: tokens.includes("cont"), open: tokens.includes("open"), samerow: tokens.includes("samerow"), lines: [] };
      parsedBlocks.push(current);
    } else if (line.trim()) {
      assert.ok(current, "Text must belong to a declared block");
      current.lines.push(line);
    }
  }
  assert.deepEqual(metadata, page.meta);
  assert.equal(parsedBlocks.length, page.blocks.length);
  for (let i = 0; i < parsedBlocks.length; i++) {
    for (const key of ["kind", "label", "cont", "open", "samerow", "lines"]) {
      assert.deepEqual(parsedBlocks[i][key], page.blocks[i][key]);
    }
  }
  const blocks = baseline.blocks.map((original, i) => {
    const expected = structuredClone(original);
    for (const correction of supplement.correctedSourceRows) {
      if (correction.sourceRef === expected.id) expected.lines[correction.blockLine - 1] = correction.observedSource;
    }
    const candidate = page.blocks[i];
    return {
      sourceRef: expected.id,
      kind: candidate.kind,
      structuralMatch: expected.kind === candidate.kind && (expected.label ?? null) === candidate.label && expected.cont === candidate.cont && expected.open === candidate.open && candidate.samerow === false,
      sourceRows: expected.rows,
      expectedRowCount: expected.lines.length,
      candidateRowCount: candidate.lines.length,
      rowCountMatch: expected.lines.length === candidate.lines.length,
      lines: expected.lines.map((line, j) => ({
        printedRow: expected.rows[j],
        blockLine: j + 1,
        source: line,
        candidate: candidate.lines[j],
        exactMatch: line === candidate.lines[j],
        matchIgnoringWhitespaceOnly: whitespaceOnly(line) === whitespaceOnly(candidate.lines[j])
      }))
    };
  });
  const mismatches = blocks.flatMap(block => block.lines.filter(line => !line.matchIgnoringWhitespaceOnly).map(line => ({ sourceRef: block.sourceRef, ...line })));
  const audit = read(inventory.audit.path);
  const result = {
    schema: "source-candidate-comparison@1",
    batch: "D191",
    sourceBaseline: baselineBinding,
    sourceSupplement: bind(output("source-observations-supplement.json")),
    candidateMarkdown: bind(inventory.candidateMarkdown.path),
    candidateStructuredPage: bind(inventory.candidateStructuredPage.path),
    comparisonNormalization: "Whitespace only; punctuation, Chinese wording, superscripts and formula syntax remain significant.",
    candidateMarkdownMatchesStructuredPage: true,
    nativeCandidateBodyEqualsFrozenAuthorDraft: sections[2] === draftSections[2],
    sourceRenderHashMatchesCandidateMetadata: page.meta.render.sha256 === source.sourceImage.sha256,
    expectedBlockCount: baseline.blocks.length,
    actualBlockCount: page.blocks.length,
    expectedPrintedRows: baseline.printedRows,
    actualCandidateRows: page.blocks.reduce((n, block) => n + block.lines.length, 0),
    candidateMetadataRows: page.meta.printed_lines,
    existingNativeAudit: audit,
    nativeAuditReplayed: false,
    allBlockStructuresMatch: blocks.every(block => block.structuralMatch),
    allBlockRowCountsMatch: blocks.every(block => block.rowCountMatch),
    blocks,
    mismatchCount: mismatches.length,
    mismatches,
    originalQuestions: page.blocks.filter(block => block.kind === "ex").map(block => ({
      label: block.label,
      text: block.lines.join(""),
      sourceTextPreservedIgnoringWhitespaceOnly: baseline.n23FinalOriginalQuestions.some(q => q.label === block.label && whitespaceOnly(block.lines.join("").replace(/^\d+\.\s*/u, "")) === whitespaceOnly(q.text))
    }))
  };
  console.log(JSON.stringify(writeNew("comparison.json", result)));
  console.log(JSON.stringify({ blocks: result.actualBlockCount, rows: result.actualCandidateRows, mismatchCount: result.mismatchCount, mismatches, questionsPreserved: result.originalQuestions.every(q => q.sourceTextPreservedIgnoringWhitespaceOnly) }));
} else if (process.argv[2] === "freeze") {
  const report = read(output("report.json"));
  const comparison = read(output("comparison.json"));
  assert.equal(report.sourceVerdict, "FAIL");
  assert.equal(report.boundaryVerdict, "PASS");
  assert.equal(report.taskPreservationVerdict, "PASS");
  assert.equal(comparison.mismatchCount, 1);
  const currentInputs = {};
  const expectedBindings = [];
  const record = (role, file, expected) => {
    const actual = bind(file);
    currentInputs[role] = actual;
    if (expected?.sha256) {
      expectedBindings.push({
        role,
        path: actual.path,
        expectedBytes: expected.bytes,
        expectedSha256: expected.sha256,
        actualBytes: actual.bytes,
        actualSha256: actual.sha256,
        matches: (expected.bytes === undefined || expected.bytes === actual.bytes) && expected.sha256 === actual.sha256
      });
    }
  };
  record("inputFreeze", output("input-freeze.json"));
  record("sourceOnly", input.sourceOnly.path, input.sourceOnly);
  record("afterInventory", input.afterInventory.path, input.afterInventory);
  for (const [role, value] of Object.entries(source)) if (value?.path) record(`sourceOnly.${role}`, value.path, value);
  for (const [role, value] of Object.entries(inventory)) if (value?.path) record(`afterInventory.${role}`, value.path, value);
  const currentStrictBindingsMatch = expectedBindings.every(binding => binding.matches);
  assert.ok(currentStrictBindingsMatch, "A current supplied input drifted");
  const strictBindings = expectedBindings.length;
  const authorFreeze = read(inventory.authorFreeze.path);
  for (const group of ["inputs", "outputs"]) {
    for (const [role, value] of Object.entries(authorFreeze[group])) {
      if (value?.path) record(`historicalAuthorFreeze.${group}.${role}`, value.path, value);
    }
  }
  const recovery = read(inventory.technicalRecovery.path);
  for (const [role, value] of Object.entries(recovery)) if (value?.path) record(`technicalRecovery.${role}`, value.path, value);
  for (const stage of ["d190-10p-source64-first-prepare", "d190-10p-source64-first-isolated-finalize"]) {
    for (const file of ["receipt.json", "stdout.txt", "stderr.txt"]) {
      record(`native.${stage}.${file}`, path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native", stage, file));
    }
  }
  for (const file of [
    ".intentfold/readme.md",
    ".intentfold/project.json",
    ".intentfold/charter/product.md",
    ".intentfold/charter/engineering.md",
    ".intentfold/charter/operations.md",
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ".agents/skills/ld-s10y-image/SKILL.md",
    "/Users/yong/.agents/skills/intentfold/SKILL.md"
  ]) record(`norms.${file}`, path.resolve(repo, file));
  const newEvidence = ["source-baseline.json", "source-observations-supplement.json", "punctuation-evidence.png", "comparison.json", "bind-review.mjs", "report.json"];
  const outputs = {};
  for (const name of newEvidence) {
    fs.chmodSync(output(name), 0o444);
    outputs[name] = bind(output(name));
  }
  const value = {
    schema: "ld-s10y-source-review/freeze@1",
    batch: "D191",
    ticket: "STEMROBIN-181",
    role: "FIRST_SOLE_INDEPENDENT_SOURCE64_TRANSCRIPTION_BOUNDARY_REVIEW",
    cwd: repo,
    createdAt: new Date().toISOString(),
    verdict: report.verdict,
    sourceVerdict: report.sourceVerdict,
    boundaryVerdict: report.boundaryVerdict,
    taskPreservationVerdict: report.taskPreservationVerdict,
    currentInputs,
    outputs,
    suppliedCurrentInputBindingsMatch: currentStrictBindingsMatch,
    suppliedCurrentBindingCount: strictBindings,
    referencedBindingComparisons: expectedBindings,
    historicalBindingMismatches: expectedBindings.filter(binding => !binding.matches),
    historicalMismatchExplanation: "The old author freeze records the pre-finalize candidate markdown. Its current file has native metadata added; the exact body equality is independently recorded in comparison.json. Historical records are retained unchanged and are not treated as current candidate bindings.",
    baselineWrittenAndSealedBeforeCandidateRead: true,
    initialBaselineCorrectionsExplicitlyRetained: true,
    immutableInputsOrExistingCropsModified: false,
    permissionChangesRestrictedToNewD191Evidence: true,
    newDiagnosticPixelCopyOnly: outputs["punctuation-evidence.png"],
    allNewEvidenceReadOnly: Object.values(outputs).every(binding => binding.mode === "444"),
    imageUsage: supplement.finalImageUsage,
    priorSourceImageReviewsReplayed: false,
    nativeStagesOrExistingCheckersOrReviewsReplayed: false,
    candidateRepairsPerformed: 0,
    figureApproval: "NOT_APPLICABLE",
    sourceApproval: false,
    sourcePagesAdded: 0,
    completeCoursesAdded: 0,
    canonicalPromotions: 0,
    modernAuthorship: 0,
    databaseWrites: 0,
    publisherCalls: 0,
    paidCalls: 0,
    networkCalls: 0,
    gitCommands: 0,
    deployCommands: 0,
    wholeProjectChecks: 0,
    supervisorPeerMessages: 0,
    setupFreshnessGrillReplayed: false,
    productAcceptance: false,
    formalHandoff: false,
    selfHashPolicy: "The review-freeze.json SHA256 is returned externally; the freeze does not claim a self-referential hash."
  };
  const freezeBinding = writeNew("review-freeze.json", value);
  console.log(JSON.stringify({ report: outputs["report.json"], reviewFreeze: freezeBinding, historicalBindingMismatches: value.historicalBindingMismatches }, null, 2));
} else {
  throw new Error("Expected compare or freeze; neither mode runs a native stage or existing checker.");
}
