import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const review = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d167-n5-text-review");
const expectedInputHash = "ca2dc78361cb19e495b16d0c413d36814d67de41f9a128bb98c5477e7c6dba19";
const expectedBaselineHash = "99296eeb7e2a0878b63487c440c1ed3d08bde3aad8e06c4e3535aa64d7cadeb9";
assert.equal(process.cwd(), root);

function binding(file) {
  const resolved = path.resolve(root, file);
  assert.ok(resolved.startsWith(root + "/"));
  assert.ok(!/\.(png|svg|jpe?g|webp|pdf)$/i.test(resolved), "ImagesZERO");
  const bytes = fs.readFileSync(resolved);
  return {
    path: resolved,
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

function load(file) {
  return JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
}

function check(expected) {
  const actual = binding(expected.path);
  assert.equal(actual.bytes, expected.bytes, expected.path + ": bytes");
  assert.equal(actual.sha256, expected.sha256, expected.path + ": sha256");
  return actual;
}

function saveNew(name, document) {
  const destination = path.join(review, name);
  fs.writeFileSync(destination, JSON.stringify(document, null, 2) + "\n", { flag: "wx" });
  return binding(destination);
}

const mode = process.argv[2];
if (mode === "inputs") {
  const input = binding(path.join(review, "input-freeze.json"));
  assert.equal(input.sha256, expectedInputHash);
  const baseline = binding(path.join(review, "source-baseline.json"));
  assert.equal(baseline.sha256, expectedBaselineHash);
  const inputData = load(input.path);
  const sourceOnly = check(inputData.sourceOnly);
  const afterBaseline = check(inputData.afterBaseline);
  const source = load(sourceOnly.path);
  const authorContext = load(afterBaseline.path);
  const authorReport = load(check(authorContext.authorReport).path);
  const authorFreeze = load(check(authorContext.authorFreeze).path);
  const expected = [
    input, baseline, sourceOnly, afterBaseline,
    source.originalLesson, source.originalExercises,
    authorContext.collectedAuthor, authorContext.authorReport, authorContext.authorFreeze,
    ...Object.values(authorContext.languages),
    ...authorFreeze.currentSourceToolAndProtectedBindings,
    ...authorFreeze.evidenceBindings,
    ...authorFreeze.templates.flatMap((item) => [item.working, item.frozen]),
  ];
  const unique = new Map();
  for (const item of expected) {
    const verified = check(item);
    unique.set(verified.path, verified);
  }
  for (const file of [
    "ssot-resources/soviet10year-textbooks/toc/9p/zh.json",
    "ssot-resources/soviet10year-textbooks/toc/9p/en.json",
    ".claude/skills/ld-s10y-lesson/tools/render_lesson.js",
    ".intentfold/readme.md",
    ".intentfold/project.json",
    ".intentfold/charter/product.md",
    ".intentfold/charter/engineering.md",
    ".intentfold/charter/operations.md",
    ".intentfold/charter/ui.md",
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
    ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ".intentfold/tickets/STEMROBIN-181/ticket.json",
  ]) {
    const item = binding(file);
    unique.set(item.path, item);
  }
  const original = load(source.originalLesson.path);
  for (const item of Object.values(authorContext.languages)) {
    const template = load(item.path);
    assert.deepEqual(template.source.data, original, "complete original snapshot");
    assert.equal(template.source.sha256, source.originalLesson.sha256);
    assert.equal(template.prose.length, 14);
    template.prose.forEach((block, index) => {
      assert.equal(block.source_text, original.prose[index].text, "source_text");
      assert.deepEqual(block.source_refs, original.prose[index].source_refs, "source_refs");
    });
  }
  const evidenceFile = authorReport.evidenceBindings.find((item) => item.path.endsWith("/mechanical-evidence.json"));
  const mechanical = load(evidenceFile.path);
  const authorDir = path.dirname(authorContext.authorReport.path);
  const prepareDir = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native");
  const stagePaths = [
    path.join(prepareDir, "d166-n5-zh-first-isolated-prepare/receipt.json"),
    path.join(prepareDir, "d166-n5-en-first-isolated-prepare/receipt.json"),
    path.join(authorDir, "receipts/prose-flow/modern-us-neutral/receipt.json"),
    path.join(authorDir, "receipts/prose-flow/modern-us-neutral-en/receipt.json"),
    path.join(authorDir, "receipts/focused-native-text/receipt.json"),
  ];
  const reusedStages = stagePaths.map((file) => {
    const receipt = load(file);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.cwd, root);
    return { receipt: binding(file), exitCode: 0, execution: "REUSED_NOT_RERUN" };
  });
  assert.deepEqual(mechanical.nativeTextEvidence.errors, []);
  const result = {
    schema: "d167-current-text-bindings@1",
    batch: "D167",
    ticket: "STEMROBIN-181",
    book: "9p",
    lesson: "phy9-c1-s1-n5",
    verifiedAt: new Date().toISOString(),
    method: "Read-only path/byte/SHA256 binding verification and original snapshot/reference comparison; no native functions imported or producers run.",
    allCurrentNonVisualBindingsMatch: true,
    sourceBaselineBeforeAuthorHash: baseline.sha256,
    currentBindings: [...unique.values()],
    reusedStages,
    reusedNativeTextErrors: [],
    reusedProseFlow: mechanical.proseFlow.map((item) => ({
      edition: item.edition,
      resolvedIndices: item.resolvedIndicesFromExistingParser,
      afterExecutionChange: item.afterExecutionChange,
    })),
    sourceReview: "SOURCE17/18/19 composed PASS reused from source-only.json; page hashes only verified, no source-page review.",
    visualBindings: "Inherited historical strings only; not read, hashed, displayed or approved.",
    counters: {
      imageReads: 0,
      browserCalls: 0,
      nativeRuns: 0,
      sourcePageReviews: 0,
      paidCalls: 0,
      templateWrites: 0,
      sourceWrites: 0,
    },
  };
  const output = saveNew("bindings-evidence.json", result);
  console.log(JSON.stringify({ output, verifiedCurrentNonVisualBindings: unique.size, reusedStages: reusedStages.length }, null, 2));
} else if (mode === "freeze") {
  const evidenceBinding = binding(path.join(review, "bindings-evidence.json"));
  const evidence = load(evidenceBinding.path);
  for (const item of evidence.currentBindings) check(item);
  const reportBinding = binding(path.join(review, "report.json"));
  const report = load(reportBinding.path);
  assert.equal(report.batch, "D167");
  assert.equal(report.blocks.length, 14);
  assert.equal(report.sourceBaselineBeforeAuthor.sha256, expectedBaselineHash);
  assert.equal(report.bindingEvidence.sha256, evidenceBinding.sha256);
  const outputBindings = [
    binding(path.join(review, "source-baseline.json")),
    binding(path.join(review, "bind-review.mjs")),
    evidenceBinding,
    reportBinding,
  ];
  const freeze = {
    schema: "d167-independent-text-review-freeze@1",
    batch: "D167",
    ticket: "STEMROBIN-181",
    book: "9p",
    lesson: "phy9-c1-s1-n5",
    frozenAt: new Date().toISOString(),
    status: "FIRST_INDEPENDENT_TEXT_REVIEW_COMPLETE_AWAIT_PARENT_COLLECTION_NOT_CLOSED",
    scienceVerdict: report.scienceVerdict,
    zhVerdict: report.zhVerdict,
    enVerdict: report.enVerdict,
    verdictScope: "Text only; no complete lesson/course or figure approval.",
    sourceBaselineBeforeAuthor: report.sourceBaselineBeforeAuthor,
    report: reportBinding,
    evidence: evidenceBinding,
    currentInputTemplateSourceToolEvidenceBindings: evidence.currentBindings,
    outputBindings,
    selfBinding: "The SHA256 of this file is returned to the parent, not embedded recursively.",
    nativeEvidence: "Five successful prepare/prose_flow/focused-native stage receipts reused without execution; historical pre-section_break input hashes remain historical, not mislabeled current.",
    firstIndependentReviews: { science: 1, chinese: 1, english: 1 },
    figures: {
      approved: false,
      unapprovedIds: ["fig-02", "fig-03", "tbl-p0018-03"],
      interpretation: "No images inspected or diagram facts endorsed.",
    },
    counters: report.counters,
    parentActions: "Parent collects and closes this reviewer; only affected-block repair/review if needed, with no authorization granted here.",
    changedPaths: [
      ...outputBindings.map((item) => item.path),
      path.join(review, "review-freeze.json"),
    ],
  };
  const freezeBinding = saveNew("review-freeze.json", freeze);
  console.log(JSON.stringify({ report: reportBinding, freeze: freezeBinding, changedPaths: freeze.changedPaths }, null, 2));
} else {
  throw new Error("Expected inputs or freeze; no other mode is authorized.");
}
