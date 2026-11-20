import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const R = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-188/tmp");
const own = path.join(T, "n66-section-breaks-affected-review-01");
const intake = path.join(T, "n66-section-breaks-affected-review-inputs-01/manifest.json");
const old = path.join(T, "n66-figure9899-review-01");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const save = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + "\n");
const manifest = load(intake);
const expected = new Map(manifest.inputBindings.map((b) => [b.path, b.sha256]));
expected.set(intake, sha(intake));
const oldExpected = {
  "output-index.json": "0da3fcf6a1728d9d076e035aac9ad396b9027592e5756eb840cd7aa5c27a4d06",
  "report.json": "e626802d8a07319a28cde28d09be6eaa2c5ca1d681a4f1514e6e619b3efa1ab3",
  "fig-g10-98.FIRST.json": "f76c3f32334e1a997cf2fd551cfd2b2a378aa1997ada1b86de96629ffaecbed3",
  "fig-g10-99.FIRST.json": "bfa1f8ececbc3bdb35ca0a85235e12e724a1c8d68b74e43d75928d765921c959"
};
for (const [name, hash] of Object.entries(oldExpected)) expected.set(path.join(old, name), hash);
const htmlfrag = path.join(R, ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js");
const edition = path.join(R, ".claude/skills/ld-s10y-lesson/tools/edition.py");
for (const p of [htmlfrag, edition]) expected.set(p, sha(p));

function differences(a, b, prefix = "") {
  if (Object.is(a, b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) =>
      differences(a[key], b[key], `${prefix}/${key}`));
  }
  return [{ path: prefix, before: a, after: b }];
}

if (process.argv[2] === "capture") {
  const bindings = [...expected].map(([p, hash]) => {
    assert.ok(path.isAbsolute(p));
    assert.equal(sha(p), hash, `manifest/prior-review hash: ${p}`);
    return { path: p, sha256Before: hash };
  });
  save("input-bindings-before.json", { schema: "affected-review-input-bindings@1", bindings });
  const original = load(manifest.original.path);
  const candidate = load(manifest.candidate.path);
  const nativePath = manifest.inputBindings.find((b) => b.path.endsWith("/geo910-c2-s3-n66/lesson.json")).path;
  const actual = load(nativePath);
  const preFlow = load(path.join(T, "n66-section-break-repair-01/prose-flow.json"));
  const repairedFlow = load(path.join(T, "n66-section-break-repair-01/repaired-prose-flow.json"));
  console.log(JSON.stringify({
    capturedBindings: bindings.length,
    candidateDiff: differences(original, candidate),
    nativeKeys: Object.keys(actual),
    nativeVsCandidateDiff: differences(candidate, actual).map((d) => ({ path: d.path, beforeType: typeof d.before, afterType: typeof d.after })),
    preFlowKeys: Object.keys(preFlow),
    repairedFlowKeys: Object.keys(repairedFlow),
    repairedFlowBreaks: repairedFlow.resolvedBreaks,
    repairedFlowBoundaries: repairedFlow.boundaries
  }, null, 2));
} else if (process.argv[2] === "check") {
  const before = load(path.join(own, "input-bindings-before.json"));
  for (const b of before.bindings) assert.equal(sha(b.path), b.sha256Before, b.path);
  const original = load(manifest.original.path);
  const candidate = load(manifest.candidate.path);
  const priorText = load(manifest.priorReview.path);
  const priorFigures = load(path.join(old, "report.json"));
  const repair = load(manifest.repair.path);
  const nativePath = manifest.inputBindings.find((b) => b.path.endsWith("/geo910-c2-s3-n66/lesson.json")).path;
  const auditPath = manifest.inputBindings.find((b) => b.path.endsWith("/adaptation.audit.json")).path;
  const failurePath = manifest.inputBindings.find((b) => b.path.endsWith("/n66-modern-adapt-finalize-01/adapt-finalize.command.json")).path;
  const successPath = manifest.inputBindings.find((b) => b.path.endsWith("/adapt-finalize-02.command.json")).path;
  const actual = load(nativePath);
  const audit = load(auditPath);
  const failedNative = load(failurePath);
  const passedNative = load(successPath);
  const preFlow = load(path.join(T, "n66-section-break-repair-01/prose-flow.json"));
  const repairedFlow = load(path.join(T, "n66-section-break-repair-01/repaired-prose-flow.json"));
  const diff = differences(original, candidate);
  assert.deepEqual(diff.map((d) => d.path), ["/section_breaks/0/before", "/section_breaks/1/before"]);
  assert.equal(sha(manifest.candidate.path), "26c431fc854e650f67dc66f5084f618ca0b43ffe46d1b4c6f16fff9f08159e94");
  const { section_breaks: oldBreaks, ...oldRest } = original;
  const { section_breaks: newBreaks, ...newRest } = candidate;
  assert.deepEqual(newRest, oldRest, "entire non-anchor document unchanged");
  assert.equal(newBreaks.length, 2);
  assert.deepEqual(oldBreaks, repair.sectionBreaksBefore);
  assert.deepEqual(newBreaks, repair.sectionBreaksAfter);
  assert.deepEqual(newBreaks.map((b) => b.after), oldBreaks.map((b) => b.after));
  assert.equal(priorText.status, "pass");
  assert.deepEqual(priorText.findings, []);
  assert.equal(priorText.objectsChecked, 16);
  assert.equal(priorText.exercise.subquestionsChecked, 6);
  assert.equal(priorText.exercise.number, "242");
  const priorAuthorBinding = priorText.inputBindings.find((b) => b.path === manifest.original.path);
  assert.ok(priorAuthorBinding, "prior text PASS binds the immutable author snapshot");
  assert.equal(priorAuthorBinding.sha256Before, manifest.original.sha256);
  assert.equal(priorAuthorBinding.sha256After, manifest.original.sha256);
  assert.equal(priorFigures.status, "pass");
  assert.ok(priorFigures.perFigure.every((f) => f.status === "pass" && f.nativeReviewStatus === "pass"));
  assert.equal(priorFigures.sourceGlyphHOLDs.length, 5);
  assert.ok(priorFigures.sourceGlyphHOLDs.every((h) => h.cleared === false));
  assert.equal(audit.status, "pass");
  assert.deepEqual(audit.errors, []);
  assert.equal(audit.proseBlocks, 16);
  assert.equal(audit.exercises, 1);
  assert.equal(audit.sectionBreaks, 2);
  assert.equal(audit.sourceLessonSha256, original.source.sha256);
  const previousRawExercises = priorText.inputBindings.find((b) => b.path.endsWith("/geo910-c2-s3-n66/exercises.json"));
  assert.equal(audit.sourceExercisesSha256, previousRawExercises.sha256After);
  assert.equal(failedNative.exitCode, 2);
  assert.ok(failedNative.stdout.includes("section_breaks[0]"));
  assert.ok(failedNative.stdout.includes("matched 0"));
  assert.equal(passedNative.exitCode, 0);
  assert.ok(passedNative.stdout.includes("PASS"));
  assert.equal(passedNative.cwd, R);

  // The native lesson is already normalized; inspect its flow without native replay.
  const require = createRequire(import.meta.url);
  const { proseOutline, sectionBreakIndices, proseFlow } = require(htmlfrag);
  const outline = proseOutline(actual.prose);
  const resolved = sectionBreakIndices(actual.prose, newBreaks);
  assert.equal(outline.length, 15);
  assert.deepEqual(resolved, [2, 14]);
  assert.deepEqual(resolved, manifest.expectedNativeResolvedBreaks);
  assert.deepEqual(resolved, repairedFlow.resolvedBreaks);
  assert.deepEqual(outline, preFlow.paragraphs);
  assert.deepEqual(outline, repairedFlow.paragraphs);
  assert.deepEqual(actual.section_breaks, newBreaks);
  const boundaries = newBreaks.map((anchor, i) => {
    const matches = outline.slice(1).filter((p) =>
      outline[p.index - 1].text === anchor.before && p.text === anchor.after);
    assert.equal(matches.length, 1, `exact unique pair for anchor ${i}`);
    const next = matches[0];
    const previous = outline[next.index - 1];
    assert.equal(next.index, resolved[i]);
    assert.deepEqual({ index: next.index, before: previous.text, after: next.text }, audit.resolvedSectionBreaks[i]);
    assert.deepEqual({ index: next.index, before: previous.text, after: next.text }, repairedFlow.boundaries[i]);
    return {
      anchor: i, exactAdjacentMatches: matches.length, index: next.index,
      before: previous.text, after: next.text,
      beforeBlockIndex: previous.blockIndex, afterBlockIndex: next.blockIndex,
      source_refs: actual.prose[next.blockIndex].source_refs,
      conceptualJudgment: i === 0
        ? "The introduction ends after cross-sectional area and V(x) have been defined; the next paragraph introduces the monotonic assumption and its volume-integral proof. The switch is at the argument transition, not inside the definition."
        : "The completed emphasized volume formula and its (2) number stay together in the preceding paragraph; the following independent note extends the result to general continuous, nonmonotone functions. The switch is not before the formula number or inside the proof.",
      status: "pass"
    };
  });
  assert.deepEqual(boundaries[0].source_refs, ["p0232#2"]);
  assert.deepEqual(boundaries[1].source_refs, ["p0233#5"]);
  const flowSwitches = proseFlow(actual.prose, newBreaks)
    .filter((b) => b.kind === "p")
    .flatMap((b, i) => b.sectionBreak ? [i] : []);
  assert.deepEqual(flowSwitches, [2, 14]);
  const nativeDiff = differences(candidate, actual);
  assert.deepEqual(nativeDiff.map((d) => d.path), [
    "/prose/0/text", "/prose/7/text", "/prose/11/text", "/prose/12/text", "/status"
  ]);
  for (const d of nativeDiff.filter((d) => d.path !== "/status")) {
    assert.equal(d.before.replace(/\s/g, ""), d.after.replace(/\s/g, ""), "native differences are whitespace-only normalization");
  }
  assert.equal(actual.status, "ready");
  assert.equal(candidate.status, "draft");
  const nativeComparable = structuredClone(actual);
  nativeComparable.status = candidate.status;
  for (let i = 0; i < nativeComparable.prose.length; i++) nativeComparable.prose[i].text = candidate.prose[i].text;
  assert.deepEqual(nativeComparable, candidate, "native non-layout data matches repaired candidate exactly");
  const inputBindings = before.bindings.map((b) => {
    const after = sha(b.path);
    assert.equal(after, b.sha256Before, b.path);
    return { path: b.path, sha256Before: b.sha256Before, sha256After: after };
  });
  for (const name of ["fig-g10-98.FIRST.json", "fig-g10-99.FIRST.json"]) {
    assert.equal(fs.statSync(path.join(old, name)).mode & 0o7777, 0o444);
  }
  const receipt = {
    schema: "affected-review-binding-check-receipt@1",
    command: [process.execPath, ...process.argv.slice(1)], cwd: process.cwd(),
    status: "pass", exitCode: 0,
    checks: {
      candidateHashCurrent: true, deepDiffOnlyTwoBeforeAnchors: true,
      afterAnchorsUnchanged: true, allNonAnchorFieldsIdentical: true,
      immutableOriginalMatchesPriorTextPASS: true, priorFigurePASSAndSealedFIRSTsReused: true,
      normalizedNativeDiffWhitespaceAndStatusOnly: true,
      nativeAuditMatchesActualPairs: true,
      normalizedParagraphCount: outline.length,
      independentlyResolvedIndices: resolved, exactPairMatchCounts: boundaries.map((b) => b.exactAdjacentMatches),
      firstNativeFailurePreserved: true, existingRetryPASSVerifiedWithoutRerun: true,
      newImageLoads: 0, nativeCalls: 0, normalizerReplays: 0, renderCalls: 0
    },
    candidateDiff: diff, nativeDiffPaths: nativeDiff.map((d) => d.path),
    inputBindings
  };
  save("binding-check.receipt.json", receipt);
  save("input-bindings-after.json", { schema: "affected-review-input-bindings@1", inputBindings, allUnchanged: true });
  save("report.json", {
    schema: "stemrobin188-N66-two-section-break-anchor-affected-review@1",
    ticket: "STEMROBIN-188", assignment: "SAME188-6", lesson: manifest.lesson,
    role: "sole-independent-reviewer", status: "pass", findings: [],
    scope: "Affected-only review of section_breaks[0] and section_breaks[1] before/after anchors. Only their two before strings changed; after strings and every other original candidate field are unchanged. No original math, full text, exercise, source, option or figure rereview.",
    candidate: manifest.candidate, immutableAuthor: manifest.original,
    actualDiffPaths: diff.map((d) => d.path),
    allNonAnchorCandidateFieldsUnchanged: true,
    bothAfterAnchorsUnchanged: true,
    boundaries, normalizedParagraphs: outline.length, resolvedSwitches: resolved,
    normalizedNativeComparison: {
      lesson: { path: nativePath, sha256: sha(nativePath) },
      audit: { path: auditPath, sha256: sha(auditPath), status: audit.status },
      diffPaths: nativeDiff.map((d) => d.path),
      judgment: "The existing native lesson matches the repaired candidate exactly except deterministic whitespace layout in four prose text fields and native draft-to-ready status. Existing normalized flow records, actual native outline and audit agree on the same 15 paragraphs and exact adjacent pairs at 2 and 14.",
      noContentOrFormulaChanges: true, nativeExecutionRepeated: false,
      statusReadyIsNativeMetadataOnly: true
    },
    reusedEvidence: {
      textPASS: manifest.priorReview,
      all16ObjectsAndExercise242SixSubpartsPASSReused: true,
      figures9899PASS: { path: path.join(old, "report.json"), sha256: sha(path.join(old, "report.json")) },
      sourceFIRSTs: ["fig-g10-98.FIRST.json", "fig-g10-99.FIRST.json"].map((name) => ({
        path: path.join(old, name), sha256: sha(path.join(old, name)), mode: "0444"
      })),
      oldPackageUntouched: true
    },
    firstFailure: { path: failurePath, sha256: sha(failurePath), exitCode: failedNative.exitCode, stdout: failedNative.stdout, preserved: true, supersededNotErased: true },
    existingSuccessfulRetry: { path: successPath, sha256: sha(successPath), exitCode: passedNative.exitCode, rerun: false },
    sourceGlyphHOLDs: priorFigures.sourceGlyphHOLDs,
    inheritedSourceReviewHolds: priorFigures.inheritedSourceReviewHolds,
    sourceGlyphOrProcedureHoldsCleared: false,
    sourceOrMathUnknownResolution: false,
    originalProcedureFailureAndRepairHistoryPreserved: true,
    actualImagesOpened: 0, newImagesOpened: 0,
    limitation: "Affected-only offline artifact/paragraph-flow check. Existing native PASS remains offline evidence, not headed-product or whole-lesson approval. No new approval is demanded for unchanged content or figures.",
    wholeLessonApproved: false, wholeN66Approved: false, published: false,
    inputBindings,
    bindingCheckReceipt: { path: path.join(own, "binding-check.receipt.json"), sha256: sha(path.join(own, "binding-check.receipt.json")) },
    reviewerCheckerFirstFailure: { path: path.join(own, "binding-check-FIRST.receipt.json"), sha256: sha(path.join(own, "binding-check-FIRST.receipt.json")), cause: "Incorrect approved expectation corrected to the native ready status; inputs untouched.", preserved: true },
    prohibitionCompliance: { exclusiveWriteRoot: own, oldPackageModified: false, nativeCalls: 0, renderCalls: 0, sourceRereviews: 0, figuresRereviewed: 0, paidCalls: 0, installs: 0, DBCalls: 0, publisherCalls: 0, GitOperations: 0, appOrToolChanges: 0, agentsOrOtherChats: 0, mergeDeployCloseCalls: 0 },
    reviewedAt: new Date().toISOString()
  });
  console.log(JSON.stringify({ status: "pass", diffPaths: diff.map((d) => d.path), actualParagraphs: outline.length, resolvedSwitches: resolved, exactPairMatches: boundaries.map((b) => b.exactAdjacentMatches), bindingsChecked: inputBindings.length, imagesOpened: 0 }, null, 2));
} else if (process.argv[2] === "index") {
  const outputs = fs.readdirSync(own).filter((n) => n !== "output-index.json").sort().map((name) => {
    const p = path.join(own, name);
    const stat = fs.statSync(p);
    assert.ok(stat.isFile());
    return { path: p, sha256: sha(p), bytes: stat.size, mode: (stat.mode & 0o7777).toString(8).padStart(4, "0") };
  });
  save("output-index.json", { schema: "affected-review-output-index@1", outputRoot: own, outputs });
  console.log(JSON.stringify(["report.json", "output-index.json"].map((name) => ({
    path: path.join(own, name), sha256: sha(path.join(own, name))
  })), null, 2));
} else {
  throw new Error("Expected capture, check or index");
}
