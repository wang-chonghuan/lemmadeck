import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const ticket = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp");
const first = path.join(ticket, "d1816-d496-laboratory-first-independent-review");
const out = path.join(ticket, "d1816-d496a-laboratory-affected-review");
const root = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d492/root/10p");
const work = path.join(cwd, ".tmp/STEMROBIN-181/d1816-d492/source-work/adapt/10p");
const editions = ["modern-us-neutral", "modern-us-neutral-en"];
const zh = path.join(work, editions[0], "lessons/phy10-c4-s4/lesson.template.json");
const raw = path.join(root, "lessons/phy10-c4-s4/lesson.json");
const parentCheck = path.join(out, "parent-affected-mechanical-check.json");
const receiptDir = path.join(ticket, "d1816-recovery/native/d496a-laboratory-zh-separator-affected-mechanical-check");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const evidence = (file) => ({ path: file, sha256: sha(file), bytes: fs.statSync(file).size });
const writeOnce = (name, data) => fs.writeFileSync(path.join(out, name), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
const originalHashes = {
  report: "fdd0aba54da42cdcffe073701c788c0ee2d766755158c47ff3a25dd4e0ec9aa3",
  freeze: "9391e1bdd75ae557f4d6dda0f71a8e193994b09982091738dc8d68484e38db0d",
};
const verifyOriginal = () => {
  assert.equal(sha(path.join(first, "report.json")), originalHashes.report);
  assert.equal(sha(path.join(first, "review-freeze.json")), originalHashes.freeze);
};
const diff = (oldValue, newValue, pointer = "") => {
  if (Object.is(oldValue, newValue)) return [];
  if (oldValue === null || newValue === null ||
      typeof oldValue !== "object" || typeof newValue !== "object" ||
      Array.isArray(oldValue) !== Array.isArray(newValue)) {
    return [{ jsonPointer: pointer, before: oldValue, after: newValue }];
  }
  const keys = new Set([...Object.keys(oldValue), ...Object.keys(newValue)]);
  return [...keys].flatMap((key) => diff(oldValue[key], newValue[key], pointer + "/" + key.replace(/~/g, "~0").replace(/\//g, "~1")));
};

if (process.argv[2] === "verify") {
  verifyOriginal();
  const originalFreeze = read(path.join(first, "review-freeze.json"));
  const record = originalFreeze.records.find((r) => r.path === zh);
  assert.ok(record);
  assert.equal(sha(record.snapshot), record.sha256);
  const oldBytes = fs.readFileSync(record.snapshot, "utf8");
  const newBytes = fs.readFileSync(zh, "utf8");
  const oldLesson = JSON.parse(oldBytes);
  const currentLesson = JSON.parse(newBytes);
  const oldPhrase = "\u6761\u7eb9\u81f3\u81f3\u6295\u5f71\u4eea";
  const newPhrase = "\u6761\u7eb9\uff1a\u6295\u5f71\u4eea";
  assert.equal(oldBytes.split(oldPhrase).length - 1, 1);
  assert.equal(newBytes, oldBytes.replace(oldPhrase, newPhrase), "No other byte change is allowed");
  const changes = diff(oldLesson, currentLesson);
  assert.equal(changes.length, 1);
  assert.equal(changes[0].jsonPointer, "/prose/88/text");
  assert.equal(changes[0].after, changes[0].before.replace(oldPhrase, newPhrase));
  const currentRaw = read(raw);
  assert.deepEqual(currentLesson.prose[88].source_refs, ["p0407#10"]);
  assert.equal(currentLesson.prose[88].source_text, currentRaw.prose[88].text);
  const mechanical = read(parentCheck);
  assert.equal(mechanical.status, "PASS");
  assert.equal(mechanical.records[0].lesson.sha256, sha(zh));
  assert.equal(mechanical.records[0].lesson.sha256, "3f96d915cf5a24e2251695f56b38b694bf3709517190aaeb65f946a8a65f671e");
  assert.deepEqual(mechanical.records[0].checkedIndices, [88]);
  assert.equal(mechanical.imageOpens, 0);
  const receipt = read(path.join(receiptDir, "receipt.json"));
  assert.equal(receipt.cwd, cwd);
  assert.equal(receipt.exitCode, 0);
  const currentInputs = originalFreeze.records.map((r) => {
    assert.equal(sha(r.snapshot), r.sha256);
    const currentHash = sha(r.path);
    if (r.path !== zh) assert.equal(currentHash, r.sha256, r.path);
    return {
      path: r.path, sha256: currentHash, originalSha256: r.sha256,
      changed: r.path === zh,
      validation: r.path === zh ? "PASS_EXACT_SINGLE_FIELD_AND_BYTE_DELTA" : "PASS_HASH_UNCHANGED_NO_SEMANTIC_REPLAY",
    };
  });
  const inheritedFigure = read(path.join(first, "modern-figure-independent-review.json"));
  assert.equal(inheritedFigure.status, "PASS");
  for (const name of ["spec", "source", "svg", "preview", "independentSourceInventory"]) {
    assert.equal(sha(inheritedFigure[name].path), inheritedFigure[name].sha256);
  }
  const inputs = [
    evidence(path.join(first, "report.json")),
    evidence(path.join(first, "review-freeze.json")),
    evidence(path.join(first, "first-report-freeze.json")),
    evidence(path.join(first, "all-110-blocks-text-science-audit.json")),
    evidence(path.join(first, "independent-binding-check.json")),
    evidence(path.join(first, "modern-figure-independent-review.json")),
    evidence(path.join(first, "independent-source-pixel-inventory.json")),
    evidence(parentCheck),
    ...["receipt.json", "stdout.txt", "stderr.txt"].map((n) => evidence(path.join(receiptDir, n))),
    evidence(path.join(cwd, ".agents/skills/ld-s10y-image/scripts/record_review.py")),
    evidence(path.join(cwd, ".agents/skills/ld-s10y-image/scripts/validate_spec.py")),
  ];
  const snapshot = path.join(out, "current-zh-lesson.template.frozen.json");
  fs.copyFileSync(zh, snapshot, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(snapshot), sha(zh));
  writeOnce("affected-delta-check.json", {
    status: "PASS",
    checkedAt: new Date().toISOString(),
    originalTemplate: { path: record.snapshot, sha256: record.sha256 },
    currentTemplate: evidence(zh),
    completeTemplateByteDeltaOnlyRequestedReplacement: true,
    completeStructuredTemplateDifferences: changes,
    independentlyReadAffectedRawSentence: currentRaw.prose[88].text,
    currentAffectedSentence: currentLesson.prose[88].text,
    sourceRefs: ["p0407#10"],
    sourceTextAndSourceRefsUnchanged: true,
    manualAffectedSemanticReview: "PASS: the Chinese explanatory colon restores the appositional identification of the observed bright strip as the projector's slit image. The 45-degree edge, horizontal glass placement, viewing target, procedure number and wording are unchanged. This is not a numeric-range separator.",
    allOther109ZhBlocksAndAll110EnBlocks: "INHERITED_PASS_HASH_AND_EXACT_DELTA_CONFIRMED",
    unchangedOriginalInputs: currentInputs.filter((r) => !r.changed).length,
    parentMechanicalCheck: evidence(parentCheck),
    firstOverallFailPreserved: true,
    imageOpens: 0,
    cumulativeActualImageOpens: 2,
  });
  writeOnce("review-freeze.json", {
    schemaVersion: 1,
    task: "STEMROBIN-181 D496a ZERO-image affected-text review",
    frozenAt: new Date().toISOString(),
    cwd,
    course: "phy10-c4-s4",
    notANewImageBatch: true,
    actualImageOpensThisTask: 0,
    cumulativeActualImageOpensThisReviewer: 2,
    originalBatchLimit: 8,
    contextLimit: 24,
    frozenBeforeReviewAt1Writes: true,
    inheritedOriginalFail: evidence(path.join(first, "report.json")),
    immutableOriginalFreeze: evidence(path.join(first, "review-freeze.json")),
    currentWholeZhTemplate: evidence(zh),
    currentWholeZhTemplateSnapshot: evidence(snapshot),
    currentInputRecords: currentInputs,
    reviewEvidenceAndParentInputs: inputs,
    exactDeltaEvidence: evidence(path.join(out, "affected-delta-check.json")),
    constraints: "No image opens, page/course semantic replay, render, content edit, initialization, DB/publisher, branch/worktree/chat, merge/deploy/closure or display work. Current hash checks are byte integrity checks, not visual reopens or semantic re-review.",
  });
  console.log(JSON.stringify({
    status: "PASS", jsonPointersChanged: changes.map((d) => d.jsonPointer),
    rawAffectedSentence: currentRaw.prose[88].text,
    currentAffectedSentence: currentLesson.prose[88].text,
    currentWholeZhTemplateSha256: sha(zh), unchangedInputs: currentInputs.length - 1,
    freeze: evidence(path.join(out, "review-freeze.json")),
    actualImageOpens: 0, cumulativeActualImageOpens: 2,
  }, null, 2));
}

if (process.argv[2] === "reviews") {
  verifyOriginal();
  const freeze = read(path.join(out, "review-freeze.json"));
  for (const record of freeze.currentInputRecords) assert.equal(sha(record.path), record.sha256, record.path);
  for (const record of freeze.reviewEvidenceAndParentInputs) assert.equal(sha(record.path), record.sha256, record.path);
  const outputs = [];
  for (const edition of editions) {
    const figureDir = path.join(root, `editions/${edition}/figures`);
    const output = path.join(figureDir, "fig-278.review.json");
    assert.ok(!fs.existsSync(output), "Do not overwrite an existing figure review: " + output);
    const args = [
      path.join(cwd, ".agents/skills/ld-s10y-image/scripts/record_review.py"),
      "--spec", path.join(figureDir, "fig-278.spec.json"),
      "--render", path.join(figureDir, "fig-278.render.json"),
      "--output", output,
      "--status", "pass",
      "--notes",
      `D496a composed affected-text PASS; FIRST actual independent modern semantic/pixel observations inherited unchanged from ${path.join(first, "modern-figure-independent-review.json")} SHA256 ${sha(path.join(first, "modern-figure-independent-review.json"))}. D496 raw PNG and integrated preview were actually opened exactly once each; this ZERO-image continuation opens0, cumulative2. A/B/C, plate, ray/normal separation, short alpha/beta sectors, source hatches/dot, mathematical-only labels and absence of answers passed. Current declared 240/288/320/358/384/480 widths pass exact vector scale and bound render checks (minimum16px); final product/offline display remains for a separate reviewer/batch. Full ZH template currentSHA ${sha(zh)} differs from D496 only by prose[88].text's explanatory colon; all other TEXT/SCI/assembly and figure source/spec/render/SVG/preview hashes are unchanged. New freeze ${path.join(out, "review-freeze.json")} SHA256 ${sha(path.join(out, "review-freeze.json"))}. Original D496 overall FAIL SHA256 ${originalHashes.report} and freeze SHA256 ${originalHashes.freeze} remain immutable; historic FAIL/HOLD are not overwritten or lifted by this scoped approval.`,
    ];
    const startedAt = new Date().toISOString();
    const run = spawnSync(path.join(cwd, ".claude/skills/ld-s10y-lesson/.venv/bin/python"), args, {
      cwd, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, encoding: "utf8",
    });
    writeOnce(`record-review-${edition}.receipt.json`, {
      command: [path.join(cwd, ".claude/skills/ld-s10y-lesson/.venv/bin/python"), ...args],
      cwd, startedAt, finishedAt: new Date().toISOString(),
      exitCode: run.status, stdout: run.stdout, stderr: run.stderr,
      error: run.error?.message || null,
      imageOpens: 0, cumulativeActualImageOpens: 2,
    });
    assert.equal(run.status, 0, run.stderr);
    const review = read(output);
    assert.equal(review.schema, "ld-s10y-image/review@1");
    assert.equal(review.status, "pass");
    for (const record of [review.source, review.spec, review.render, ...Object.values(review.outputs)]) {
      assert.equal(sha(path.resolve(cwd, record.path)), record.sha256, record.path);
    }
    outputs.push({ edition, review: evidence(output), receipt: evidence(path.join(out, `record-review-${edition}.receipt.json`)) });
  }
  writeOnce("current-figure-reviews.json", { status: "PASS", outputs, actualImageOpens: 0, cumulativeActualImageOpens: 2 });
  console.log(JSON.stringify({ status: "PASS", outputs, actualImageOpens: 0, cumulativeActualImageOpens: 2 }, null, 2));
}

if (process.argv[2] === "report") {
  verifyOriginal();
  const freeze = read(path.join(out, "review-freeze.json"));
  for (const record of freeze.currentInputRecords) assert.equal(sha(record.path), record.sha256, record.path);
  for (const record of freeze.reviewEvidenceAndParentInputs) assert.equal(sha(record.path), record.sha256, record.path);
  assert.equal(sha(freeze.currentWholeZhTemplateSnapshot.path), freeze.currentWholeZhTemplateSnapshot.sha256);
  const firstReport = read(path.join(first, "report.json"));
  const reviews = read(path.join(out, "current-figure-reviews.json"));
  assert.equal(reviews.status, "PASS");
  for (const record of reviews.outputs) assert.equal(sha(record.review.path), record.review.sha256);
  writeOnce("report.json", {
    schemaVersion: 1,
    status: "PASS",
    task: "STEMROBIN-181 D496a ZERO-image affected-text review",
    completedAt: new Date().toISOString(),
    cwd, course: "phy10-c4-s4",
    reviewKind: "COMPOSED_CURRENT_PASS_FROM_FIRST_REVIEW_PLUS_EXACT_AFFECTED_TEXT_DELTA",
    gates: { text: "PASS", science: "PASS", modernFigure: "PASS", assembly: "PASS" },
    findings: [],
    inheritedOriginalFail: {
      ...evidence(path.join(first, "report.json")),
      status: "FAIL", immutable: true,
      originalReviewFreeze: evidence(path.join(first, "review-freeze.json")),
      originalFinding: "D496-TEXT-001",
      currentDisposition: "RESOLVED_IN_D496a_ONLY; original report and finding are not rewritten",
    },
    currentWholeTemplates: editions.map((edition) => ({
      edition, ...evidence(path.join(work, edition, "lessons/phy10-c4-s4/lesson.template.json")),
    })),
    currentRawLesson: evidence(raw),
    affectedText: {
      status: "PASS", locale: "zh", jsonPointer: "/prose/88/text",
      exactStructuredDifferences: 1, completeByteDeltaOnlyRequestedReplacement: true,
      manualSentenceReview: "The explanatory Chinese colon correctly identifies the observed bright strip as the projected slit image. All source conditions and quantities remain intact.",
      evidence: evidence(path.join(out, "affected-delta-check.json")),
      parentMechanicalCheck: evidence(parentCheck),
      parentReceipt: evidence(path.join(receiptDir, "receipt.json")),
      sourceChanged: false, reviewerContentEdits: false,
    },
    inheritedUnchangedGates: {
      text: {
        status: "PASS", reviewedWholeLessonBlocksPerLocale: 110,
        method: "Reuse D496 actual full independent reading of both locales. Only ZH prose88 is newly reviewed; exact full-template byte/structured delta proves the remaining 109 ZH blocks and all 110 EN blocks unchanged.",
        originalAudit: firstReport.text.report,
        originalBindingCheck: firstReport.text.bindingCheck,
        currentEnProse73: firstReport.text.currentEnProse73,
        mathContainingBlocksPerLocale: 19,
        mathAndFormulaReferenceOrder: "INHERITED_PASS_UNCHANGED",
      },
      science: firstReport.science,
      assembly: firstReport.assembly,
      modernFigure: {
        status: "PASS", figure: "fig-278",
        observations: firstReport.modernFigure.report,
        sourcePixelInventory: firstReport.modernFigure.independentSourcePixelInventory,
        currentFigureSourceSpecRenderSvgAndPreviewUnchanged: true,
        visibleLabels: firstReport.modernFigure.visibleLabels,
        sourceTopologyAndDirectedArcs: "INHERITED_PASS",
        noAnswerLeakage: true,
        declaredWidthLegibility: "INHERITED_PASS",
        declaredWidthsPx: [240, 288, 320, 358, 384, 480],
        actualIndependentImageObservations: "D496 source PNG once and integrated preview once; never reopened in D496a",
        reviewAt1WrittenUsingExistingRecorder: reviews.outputs,
      },
    },
    reviewFreeze: evidence(path.join(out, "review-freeze.json")),
    limitations: [
      "This is a ZERO-image affected-text continuation, not a new image batch and not a full course/page/figure semantic replay.",
      "Scientific PASS remains limited to source-preserving modernization. D496 source qualifications and all historic SCI/FAIL/HOLD are retained; no specialist or safety certification is asserted.",
      "Declared-width figure approval inherits the D496 native-preview inspection plus current hash-bound vector/render checks; actual product/offline display has not been reviewed.",
      "PASS and the two current review@1 files allow the parent's next native stage only within its workflow. No course render, native finalization, publication, DB/publisher, merge/deploy or ticket closure is performed or authorized as completed here.",
      "The parent will close this reviewer and use a new bounded reviewer for ONE separate display-review image batch. No display work was started.",
      "D496 original FAIL report/review-freeze and parent-affected-mechanical-check.json are unchanged; all composed current approval is stored separately in D496a."
    ],
    usage: {
      notANewImageBatch: true,
      actualImageOpensThisTask: 0,
      cumulativeActualImageOpensThisReviewer: 2,
      originalBatchLimit: 8, contextLimit: 24,
      imageOpenEvents: [], paidCalls: 0,
      pageCourseOrFigureSemanticReplay: false,
      figureOrCourseRender: false, contentEdits: false,
      databaseWrites: false, publisherInvoked: false,
      initializationOrBaselineGit: false,
      newBranchWorktreeOrChat: false, merge: false, deploy: false, ticketClosure: false,
      displayReviewStarted: false,
      figureReviewFilesWritten: 2,
    },
    finalIntegrity: {
      status: "PASS", originalReportAndFreezeHashesUnchanged: true,
      currentInputRecords: freeze.currentInputRecords.length,
      originalInputsUnchangedExceptExactZhTextField: freeze.currentInputRecords.filter((r) => !r.changed).length,
      parentFilesUnmodified: true,
    },
  });
  const finalized = {
    status: "PASS", report: evidence(path.join(out, "report.json")),
    reviewFreeze: evidence(path.join(out, "review-freeze.json")),
    originalReport: evidence(path.join(first, "report.json")),
    originalFreeze: evidence(path.join(first, "review-freeze.json")),
    currentWholeZhTemplateSha256: sha(zh),
    figureReviews: reviews.outputs,
    actualImageOpens: 0, cumulativeActualImageOpens: 2,
  };
  writeOnce("composed-report-freeze.json", finalized);
  console.log(JSON.stringify(finalized, null, 2));
}
