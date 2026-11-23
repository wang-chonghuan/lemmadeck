import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
assert.equal(process.cwd(), root);
const n = path.join(root, "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n30");
const own = path.join(n, "fig190191-independent7");
const author = path.join(n, "fig190191-author-first18/files/n30-fig190191-author-first-18");
const candidates = path.join(n, "four-figure-metadata-rebindings18/files/n30-fig190191-bound-candidates-18");
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (p) => createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const binding = (p) => ({ path: path.resolve(p), sha256: hash(p) });
const write = (p, data) => {
  assert.ok(path.resolve(p).startsWith(`${own}/`));
  assert.equal(fs.existsSync(p), false, `Do not overwrite existing review evidence: ${p}`);
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
};
const sourceFirstPath = path.join(own, "source-first.json");
const sourceFirst = load(sourceFirstPath);
assert.equal(hash(sourceFirstPath), "69c9e7fe71d8f491408e20bba4b4268ed26f3c88cf485598f30ceadc28d98914");
assert.equal(fs.statSync(sourceFirstPath).mode & 0o777, 0o444);
const displayPath = path.join(author, "display/checks.json");
const display = load(displayPath);
const displayExecutionPath = path.join(author, "display/execution.json");
const displayExecution = load(displayExecutionPath);
assert.equal(displayExecution.exitCode, 0);
assert.equal(displayExecution.result.sha256, hash(displayPath));
assert.deepEqual(display.requests, []);
assert.deepEqual(display.errors, []);

const figures = [190, 191].map((id) => {
  const specPath = path.join(candidates, `fig-${id}/fig-${id}.spec.json`);
  const originalRenderPath = path.join(candidates, `fig-${id}/fig-${id}.render.json`);
  const renderPath = path.join(own, `fig-${id}/render.bound.json`);
  const outputPath = path.join(author, `figures/fig-${id}.svg`);
  const authorSpecPath = path.join(author, `figures/fig-${id}.spec.json`);
  const spec = load(specPath);
  const originalRender = load(originalRenderPath);
  const render = load(renderPath);
  const authorSpec = load(authorSpecPath);
  assert.equal(spec.id, `fig-${id}`);
  assert.equal(hash(path.join(root, spec.source.image.path)), spec.source.image.sha256);
  assert.equal(hash(specPath), render.spec.sha256);
  assert.equal(hash(outputPath), render.output.svg.sha256);
  assert.equal(render.status, "pass");
  const expectedBound = structuredClone(originalRender);
  expectedBound.spec.path = path.relative(root, specPath);
  expectedBound.output.svg.path = path.relative(root, outputPath);
  assert.deepEqual(render, expectedBound, "Only the two permitted paths may differ");
  for (const key of ["schema", "id", "mode", "description", "canvas", "display", "layout", "objects", "assertions"]) {
    assert.deepEqual(authorSpec[key], spec[key], `Unchanged render contract: ${key}`);
  }
  assert.deepEqual(authorSpec.source.inventory, spec.source.inventory);
  assert.equal(
    createHash("sha256").update(JSON.stringify(spec.source.authoritativeText)).digest("hex"),
    sourceFirst.authoritativeText.sha256,
  );
  const checks = display.checks.filter((check) => check.figure === spec.id);
  assert.equal(checks.length, 4);
  for (const check of checks) {
    assert.ok(spec.display.widths.includes(check.mediaWidth));
    assert.ok(check.minTextPx >= 16);
    assert.deepEqual(check.overlaps, []);
    assert.equal(check.documentOverflow, false);
    assert.equal(check.texts.some((text) => text.clipped), false);
    assert.ok(check.texts.every((text) => text.px >= 16));
  }
  const screenshots = ["desktop-max", "mobile-prose"].map((surface) => {
    const p = path.join(author, `display/fig-${id}-${surface}.png`);
    const evidence = checks.find((check) => check.viewport.label === surface);
    assert.equal(evidence.screenshot.sha256, hash(p));
    assert.ok(evidence.screenshot.inkPixels > 0);
    assert.ok(evidence.screenshot.darkFraction < 0.1);
    return { surface, ...binding(p), mediaWidth: evidence.mediaWidth };
  });
  return {
    id: spec.id,
    verdicts: { mathematical: "pass", sourceRelationships: "pass", visualOffline: "pass", cultural: "pass", answerLeakage: "pass" },
    source: binding(path.join(root, spec.source.image.path)),
    authoritativeTextSha256: sourceFirst.authoritativeText.sha256,
    spec: binding(specPath),
    originalRender: binding(originalRenderPath),
    boundRender: binding(renderPath),
    output: binding(outputPath),
    priorAuthorSpec: binding(authorSpecPath),
    unchangedRenderingContract: true,
    renderPathOnlyChanges: ["spec.path", "output.svg.path"],
    screenshots,
    reusedDisplayChecks: checks.map((check) => ({
      viewport: check.viewport,
      actualMediaWidth: check.mediaWidth,
      mathematicalTextMinPx: check.minTextPx,
      overlaps: check.overlaps,
      clipped: false,
      documentOverflow: check.documentOverflow,
    })),
    unknownSourceFacts: sourceFirst.figures.find((figure) => figure.id === spec.id).inventory
      .flatMap((group) => group.unknowns ?? []),
  };
});

// The native command includes rendered-stage validation; do not prepend a duplicate validator.
const nativeRuns = [];
const tool = path.join(root, ".agents/skills/ld-s10y-image/scripts/record_review.py");
for (const figure of figures) {
  const reviewPath = path.join(own, `${figure.id}/review.json`);
  assert.equal(fs.existsSync(reviewPath), false, "One native review call per figure");
  const notes = `${figure.id}: independent source-FIRST snapshot 69c9e7fe71d8f491408e20bba4b4268ed26f3c88cf485598f30ceadc28d98914 sealed before candidate inspection; substantive mathematical, visual and cultural PASS in fig190191-independent7/report.md. Current authoritativeText only; already registered radius-c errata not re-reviewed. Original weak glyph/case and named lower-branch uncertainty remain UNKNOWN where applicable. Original PNG and existing desktop/mobile screenshots inspected once; actual retained SVG hash matched; render PASS reused with only two durable-path repairs. Offline figure scope only; no canonical/whole-lesson/App/DB/answer/choice approval.`;
  const argv = ["-B", tool, "--spec", figure.spec.path, "--render", figure.boundRender.path,
    "--output", reviewPath, "--status", "pass", "--notes", notes];
  const startedAt = new Date().toISOString();
  const result = spawnSync("python3", argv, { cwd: root, encoding: "utf8", timeout: 120000 });
  nativeRuns.push({
    executable: "python3", argv, cwd: root, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? "", stderr: result.stderr ?? "",
  });
  if (result.status !== 0 || result.error) {
    write(path.join(own, "native-execution.json"), { status: "fail", runs: nativeRuns });
    throw new Error(`Native ${figure.id} failed; original failed execution preserved in this directory`);
  }
  const review = load(reviewPath);
  assert.equal(review.schema, "ld-s10y-image/review@1");
  assert.equal(review.figure, figure.id);
  assert.equal(review.status, "pass");
  for (const key of ["source", "spec"]) {
    assert.equal(path.resolve(root, review[key].path), figure[key].path);
    assert.equal(review[key].sha256, figure[key].sha256);
  }
  assert.equal(path.resolve(root, review.render.path), figure.boundRender.path);
  assert.equal(review.render.sha256, figure.boundRender.sha256);
  assert.equal(path.resolve(root, review.outputs.svg.path), figure.output.path);
  assert.equal(review.outputs.svg.sha256, figure.output.sha256);
  figure.review = binding(reviewPath);
}
const nativeExecutionPath = path.join(own, "native-execution.json");
write(nativeExecutionPath, {
  status: "pass", nativeCalls: 2, includedRenderedStageValidations: 2,
  noSeparateValidatorOrRerender: true, runs: nativeRuns,
});

const retentionPath = path.join(n, "fig190191-author-first18/retention.json");
const retention = load(retentionPath);
const historicalPaths = [
  "failures/fig-190-first-validate/failure.json",
  "failures/fig-190-first-validate/0-fig-190.spec.json",
  "failures/fig-190-first-validate/1-execution.json",
  "failures/fig-190-first-validate/2-stdout.txt",
  "snapshots/fig-191.pre-text-scope-repair.spec.json",
  "failures/fig-191-text-scope-first-render/failure.json",
  "failures/fig-191-text-scope-first-render/0-fig-191.spec.json",
  "failures/fig-191-text-scope-first-render/1-fig-191.svg",
  "failures/fig-191-text-scope-first-render/2-fig-191.render.json",
  "failures/fig-191-text-scope-first-render/3-execution.json",
  "failures/display-first-import/execution.json",
  "state.json",
];
const imagePaths = [
  figures[0].source.path, figures[1].source.path,
  ...figures.flatMap((figure) => figure.screenshots.map((shot) => shot.path)),
];
const manifestPath = path.join(own, "manifest.json");
write(manifestPath, {
  schema: "stemrobin188/fig190191-independent-review@1",
  status: "PASS_FIG190191_CURRENT_BOUND_CANDIDATES",
  reviewer: "188-7 fresh NONFORK sole independent reviewer",
  date: "2026-11-23",
  workdir: root,
  writesOnly: own,
  scope: ["N30 fig-190", "N30 fig-191"],
  sourceFirst: { ...binding(sourceFirstPath), mode: "0444", sealedBeforeCandidateInspection: true },
  report: binding(path.join(own, "report.md")),
  nativeExecution: binding(nativeExecutionPath),
  finalizeScript: binding(path.join(own, "finalize-review.mjs")),
  figures,
  existingDisplayEvidence: {
    checks: binding(displayPath),
    execution: binding(displayExecutionPath),
    surface: display.surface,
    headless: true,
    headedProductVerificationPerformed: false,
    lessonWideAcceptance: false,
    screenshotHashesMatched: true,
    renderingContractUnchangedBetweenAuthorAndBoundCandidates: true,
  },
  sourceRelationships: {
    fig190: "A above C, B right of C, AC perpendicular BC; AB=c, BC=a; two capped given bars equal corresponding sides and c>a; original weak diagonal glyph UNKNOWN.",
    fig191: "B circle center, C left of B on shared horizontal trace, p perpendicular BC through C; upper A and unnamed lower crossing on circle/p; circle radius c=AB>a; no named/drawn lower triangle.",
    candidateInventoryQualification: "Author inventory shorthand c is not independent proof of original glyph. Source-first UNKNOWNs remain authoritative for literal pixel uncertainty; current text supplies c.",
    noObjectCountSubstitute: true,
    congruenceClass: "One under supplied text; two mirror placements in the plane, lower crossing unnamed.",
    registeredErrataReReviewed: false,
  },
  currentCounts: {
    sourceOriginalLoads: 2, screenshotLoads: 4, successfulImageLoads: 6, failedImageLoads: 0,
    crops: 0, reopens: 0, batchLoads: 6, batchLimit: 8, actualContextLoads: 6, contextLimit: 24,
    nativeReviewCalls: 2, includedRenderedStageValidations: 2, standaloneValidatorCalls: 0,
    mathematicalReviews: 2, visualReviews: 2, culturalReviews: 2, currentContentFailures: 0,
    nativeFailures: 0, rendererCalls: 0, browserDisplayCalls: 0, newScreenshots: 0,
    paidCalls: 0, networkCalls: 0, dbCalls: 0, gitCalls: 0, otherAgents: 0,
    diagnosticFailedExecutions: 2,
  },
  imageLedger: imagePaths.map((p, index) => ({ load: index + 1, ...binding(p), reopen: false, crop: false })),
  diagnosticRecovery: [
    {
      type: "read-only stat failure",
      exitCode: 1,
      detail: "Guessed cpython-314 cache filename absent; corrected by reading existing cache directory. Not an image/native/content failure.",
    },
    {
      type: "protective cleanup guard",
      exitCode: 1,
      detail: "Cache ownership/time guard refused unlink. No file removed; actual cache birth 2026-11-22T23:55:50.109Z predates source-first birth 2026-11-23T00:04:36.713Z. Prior commentary corrected; existing cache preserved. Native uses -B.",
    },
  ],
  historicalAuthor: {
    retention: binding(retentionPath),
    manifest: binding(path.join(author, "manifest.json")),
    countersPreservedExactly: retention.counters,
    executionAccountingPreservedExactly: retention.executionAccounting,
    authoredSpecVersions: { "fig-190": 2, "fig-191": 3 },
    contentGateFailures: 2, technicalDisplayFailures: 1, preparationToolFailures: 1,
    authorImageLoads: "6/8", authorContextLoads: "6/24",
    failureAndVersionBindings: historicalPaths.map((p) => binding(path.join(author, p))),
    originalFailureClassificationNotRewritten: "Initial fig-190 contentFailure=false retained; author's final counters report two content-gate failures.",
    originalAuthorHoldsKeptAsHistory: true,
    historicalRadiusErrataHoldNotReinstated: true,
    noHistoricalCounterReset: true,
  },
  boundaries: {
    noCanonicalPromotion: true, parentOwnsPromotion: true, noAnswerOrChoiceWork: true,
    noApprovedProseOrErrataReview: true, noOtherFigureReviewScope: true,
    noSourcePipelineWork: true, noWholeLessonDisplayOrApproval: true,
    noAppDbEnvNetworkPaidInstallGitChatsBranchesOtherAgents: true,
    noPermanentTechnicalApprovalGate: true,
    unchangedPassEvidenceReusedWithoutRerender: true,
  },
});
console.log(JSON.stringify({
  status: "pass",
  nativeCalls: nativeRuns.map((run) => ({ exitCode: run.exitCode, stdout: run.stdout.trim() })),
  manifest: binding(manifestPath),
  report: binding(path.join(own, "report.md")),
  reviews: figures.map((figure) => ({ figure: figure.id, ...figure.review })),
  imageLoads: "6/8", actualContextLoads: "6/24", newRendering: 0,
}, null, 2));
