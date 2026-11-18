import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const cwd = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const root = path.join(cwd, ".tmp/s10y-image/batch013-independent121124");
assert.equal(process.cwd(), cwd);
const reportPath = path.join(root, "report.json");
const snapshots = new Map();
const absolute = (p) => path.resolve(cwd, p);
function reference(p) {
  const resolved = absolute(p);
  const sha256 = createHash("sha256").update(fs.readFileSync(resolved)).digest("hex");
  snapshots.set(resolved, sha256);
  return { path: resolved, sha256 };
}
function read(p) {
  reference(p);
  return JSON.parse(fs.readFileSync(absolute(p), "utf8"));
}
function bound(ref) {
  const actual = reference(ref.path);
  assert.equal(actual.sha256, ref.sha256, ref.path);
  return actual;
}
function restoreChanges(current, prior, changes) {
  const restored = structuredClone(current);
  for (const change of changes) {
    if (change.addedObject && typeof change.addedObject === "object") {
      const index = restored.objects.findIndex((o) => o.id === change.addedObject.id);
      assert.ok(index >= 0);
      assert.deepEqual(restored.objects[index], change.addedObject);
      restored.objects.splice(index, 1);
    } else if (change.addedAssertion && typeof change.addedAssertion === "object") {
      const index = restored.assertions.findIndex((a) => a.id === change.addedAssertion.id);
      assert.ok(index >= 0);
      assert.deepEqual(restored.assertions[index], change.addedAssertion);
      restored.assertions.splice(index, 1);
    } else if (change.inventory) {
      const group = restored.source.inventory.find((g) => g.id === change.inventory);
      assert.ok(group);
      if (change.field) {
        assert.deepEqual(group[change.field], change.after);
        group[change.field] = change.before;
      } else {
        assert.ok(group.objects.includes(change.addedObject));
        assert.ok(group.assertions.includes(change.addedAssertion));
        group.objects = group.objects.filter((id) => id !== change.addedObject);
        group.assertions = group.assertions.filter((id) => id !== change.addedAssertion);
      }
    } else {
      const collection = change.object ? restored.objects : restored.assertions;
      const target = collection.find((o) => o.id === (change.object ?? change.assertion));
      assert.ok(target);
      assert.deepEqual(target[change.field], change.after);
      target[change.field] = change.before;
    }
  }
  assert.deepEqual(restored, prior, "Unchanged spec fields must match the historical spec exactly");
}

if (process.argv[2] === "--finalize") {
  const report = read(reportPath);
  for (const entry of report.inputSnapshots) bound(entry);
  for (const item of report.items) {
    const review = read(item.review.path);
    assert.equal(review.schema, "ld-s10y-image/review@1");
    assert.equal(review.figure, item.figure);
    assert.equal(review.status, "pass");
    for (const field of ["source", "spec", "render"]) {
      assert.equal(review[field].sha256, item.current[field].sha256);
      bound(review[field]);
    }
    for (const output of Object.values(review.outputs)) bound(output);
    item.review = reference(item.review.path);
    item.status = "pass";
  }
  report.status = "pass";
  report.calls.recordReview = 4;
  report.calls.mandatoryRecordReviewValidation = 4;
  report.calls.reportFinalization = 1;
  report.preservation.allReferencedInputsUnchanged = true;
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({
    report: reference(reportPath),
    status: report.status,
    images: report.images.total,
    calls: report.calls,
    reviews: report.items.map(({ figure, status, review }) => ({ figure, status, review })),
  }, null, 2));
} else {
  assert.equal(fs.existsSync(reportPath), false);
  const repair32 = read(".tmp/s10y-image/batch013-repair121122/report.json");
  const repair33 = read(".tmp/s10y-image/batch013-repair123124/report.json");
  const findings = {
    "fig-121": "PASS affected-only: opened source fig-121.png exactly once solely for the rear-alpha interval, and preview.340.r2.png exactly once. Source rear edge is dashed inside beta and solid right of beta. Current hidden [140,395]-[530,395] and solid [530,395]-[600,395] meet at unchanged beta-right x=530, share ink/strokeWidth=2, and the solid interval meets alpha-right at [600,395]. Updated inventory maps both intervals and endpoint assertions. Reused the prior unchanged source relationships, 17 passed geometry checks, and unchanged labels/directions; historical overall FAIL is not approval. Reused current render checks at 340/640 (17/32px minimum), no rerender. No whole-source, math, spatial, or lesson review rerun; no promotion or final lesson/product approval.",
    "fig-122": "PASS affected-only: opened preview.640.r3.png exactly once; only B0/C0/C1 label clearance and ownership inspected. B0 is clear of its point and nearby projection/edge strokes; C0 is clear above its foot; C1 is clear above its vertex and neighboring edge/arrow strokes. All remain unambiguously attached. Exact structured diff changes only these three labelPlacement fields; source inventory, nonlabel geometry, all assertions and directions unchanged. Reused prior source comparison and 42 passed geometry/direction checks; historical renderer/overall FAIL is not approval. Reused current fixed-640 scroll-media pass with 17px minimum text; no source image reopened, rerender, full math/spatial/source/lesson review, promotion, or final lesson/product approval.",
    "fig-123": "PASS affected-only: opened current fig-123.preview.png exactly once, inspecting only M/N clearance, ownership and readability. Both east-side labels are separated from their point disks and vertical stroke, with unambiguous M/N attachment. Exact structured diff changes only M/N label gap 18->24. Reused prior source-specific comparison and eight spatial PASS checks, unchanged source inventory/nonlabel geometry/assertions/downward direction; historical overall FAIL is not approval. Reused current render passes at actual declared 331/340/640 media widths (17.584375/18.0625/34px minimum). No original reopened, rerender, full math/spatial/source/lesson review, promotion, or final lesson/product approval.",
    "fig-124": "PASS affected-only: opened current fig-124.preview.png exactly once, inspecting only A/B and a1/a2/b1/b2 clearance, ownership and readability. A/B are clear northeast of their points and section strokes; a1/b1 stay above the right-hand sections and a2/b2 above the left-hand sections, with readable subscripts and unambiguous attachment. Exact structured diff changes only A/B gap 16->32 and the four declared text offsets. Reused prior source-specific comparison and nine spatial PASS checks, unchanged source inventory/nonlabel geometry/assertions/directions; historical overall FAIL is not approval. Reused current render passes at actual declared 331/340/640 widths (16.55/17/32px minimum). No original reopened, rerender, full math/spatial/source/lesson review, promotion, or final lesson/product approval.",
  };
  const items = [];
  for (const figure of ["fig-121", "fig-122", "fig-123", "fig-124"]) {
    const newer = repair32.items.find((i) => i.figure === figure)
      ?? repair33.figures.find((i) => i.id === figure);
    const currentRefs = newer.candidate ?? newer.artifacts;
    const current = {};
    for (const field of ["spec", "render", "svg"]) current[field] = bound(currentRefs[field]);
    const spec = read(current.spec.path);
    const render = read(current.render.path);
    current.source = bound(spec.source.image);
    const priorReviewRef = newer.prior?.review ?? newer.priorReview;
    const priorReview = read(bound(priorReviewRef).path);
    const priorSpec = read(bound(priorReview.spec).path);
    const priorRender = read(bound(priorReview.render).path);
    assert.equal(priorReview.source.sha256, current.source.sha256);
    assert.equal(priorRender.spec.sha256, priorReview.spec.sha256);
    restoreChanges(spec, priorSpec, newer.changes);
    const passedRef = newer.reusedPasses?.geometry ?? newer.reusedSpatialEvidence;
    const priorPass = read(bound(passedRef).path);
    assert.equal(priorPass.status, "pass");
    assert.equal(priorPass.spec.sha256, priorReview.spec.sha256);
    assert.equal(priorPass.source.sha256, current.source.sha256);
    assert.ok(priorPass.checks.every((check) => check.status === "pass"));
    assert.equal(render.status, "pass");
    assert.equal(render.spec.sha256, current.spec.sha256);
    assert.deepEqual(render.collisions, []);
    assert.deepEqual(render.displayChecks.map((c) => c.width), spec.display.widths);
    assert.ok(render.displayChecks.every((c) =>
      c.status === "pass" && c.minTextPx >= 16 && c.measuredMinPx >= 16 && c.failures.length === 0));
    for (const output of Object.values(render.output)) bound(output);
    const previewRef = newer.authorVisualSelfCheck?.evidence.product ?? currentRefs.preview;
    current.preview = bound(previewRef);
    const reviewPath = path.join(root, `${figure}.review.json`);
    items.push({
      figure, status: "pending_record_review", affectedOnlyVisualStatus: "pass",
      scope: "affected_only_once", notes: findings[figure], changes: newer.changes,
      exactStructuredDiffWithinAuthorizedScope: true, current,
      reused: {
        priorReview: bound(priorReviewRef), historicalOverallStatus: priorReview.status,
        priorSpec: bound(priorReview.spec), priorRender: bound(priorReview.render),
        sourceSpecificComparisonReusedFromPriorReview: true,
        spatialOrGeometry: bound(passedRef), passedCheckCount: priorPass.checks.length,
        recomputed: false,
      },
      existingDisplayChecks: render.displayChecks, review: { path: reviewPath },
      currentFigureApprovalAfterRecordingOnly: true, finalLessonOrProductApproval: false,
      promotionPerformed: false, findings: [],
    });
  }
  const report = {
    schema: "ld-s10y-image/affected-only-independent-review-report@1",
    ticket: "STEMROBIN-184", lane: "same184-3", batch: "batch013-independent121124",
    workdir: cwd, ownedWriteRoot: root, status: "pending_record_review",
    authorization: "Latest direct human instruction: one affected-only independent review; ordinary zero-paid repairs already authorized beyond historical one-repair gate; no repair performed in this review.",
    images: {
      total: 5, originals: 1, currentPreviews: 4,
      opensPerImage: 1, reopens: 0, crops: 0, contactSheets: 0, duplicateMedia: 0,
      authorizedMaximum: 5, hardBatchMaximum: 8, hardContextMaximum: 24,
      loaded: [items[0].current.source, ...items.map((item) => item.current.preview)],
    },
    calls: {
      affectedOnlyVisualReviews: 4, imageReads: 5, scopeDiffAndExistingEvidenceComparison: 1,
      recordReview: 0, mandatoryRecordReviewValidation: 0, reportFinalization: 0,
      newRender: 0, newRepair: 0, extraFullValidators: 0, mathOrSpatialReruns: 0,
      fullSourceReviewReruns: 0, fullLessonReruns: 0, paid: 0, generation: 0,
      web: 0, installs: 0, descendants: 0, newChats: 0,
      incidentalTextReadFailures: 1,
    },
    technicalNotes: ["One optional rg text read named nonexistent changes.json and exited 2; compact repair-report changes were already available and used. No producer/renderer/review rerun caused by this read fault."],
    preservation: { writesRestrictedTo: root, allReferencedInputsUnchanged: null },
    forbiddenActionsPerformed: [], remainingAffectedFindings: [], items,
    inputSnapshots: [...snapshots].map(([p, sha256]) => ({ path: p, sha256 })),
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({
    scopeDiff: "pass", existingRenderChecks: "pass", reusedPasses: "bound",
    report: reference(reportPath), figures: items.map((i) => i.figure),
  }));
}
