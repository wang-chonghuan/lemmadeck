import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = dirname(fileURLToPath(import.meta.url));
const allowed = join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d809-n83-fig196197-first-independent-review");
const author = join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d794-n83-fig196197-first-author");
assert.equal(process.cwd(), root);
assert.equal(output, allowed);

const load = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const hash = (path) => createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
const record = (path) => ({ path: resolve(root, path), sha256: hash(path) });
const writeNew = (name, value) => {
  const path = join(output, name);
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  return record(path);
};
let bindingsChecked = 0;
function verifyBindings(value) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && typeof value.sha256 === "string") {
    assert.equal(hash(value.path), value.sha256, `Changed binding: ${value.path}`);
    bindingsChecked += 1;
  }
  for (const child of Object.values(value)) verifyBindings(child);
}

const freezePath = join(author, "close-ready-freeze.json");
const authorReportPath = join(author, "report.json");
assert.equal(hash(freezePath), "d4ac25e111633cae41a6ecc53a32586f9507cc9ff6761e0b53abdec5384fd955");
assert.equal(hash(authorReportPath), "83ba3250c1934ac1350a43164f3d25165d2a357e99362a4d950e03310fa1b571");
const freeze = load(freezePath);
const authorReport = load(authorReportPath);
const inputs = [
  freeze, authorReport, load(freeze.hashManifest.path), load(authorReport.inputBinding.path),
];
for (const input of inputs) verifyBindings(input);
const initialBindingsChecked = bindingsChecked;
const judgments = load(join(output, "judgments.json"));
const observations = load(join(output, "source-observations.json"));
verifyBindings(observations);
const authoritative = load(authorReport.authoritativeText.path);
assert.deepEqual(authorReport.repairs, { "fig-196": 2, "fig-197": 3, total: 5, reset: false });
assert.equal(judgments.imageUsage.loads, 4);

const results = [];
for (const candidate of freeze.candidates) {
  const judgment = judgments.figures.find((entry) => entry.figure === candidate.figure);
  assert.equal(judgment.revision, candidate.revision);
  const spec = load(candidate.spec.path);
  const render = load(candidate.render.path);
  const directory = dirname(candidate.spec.path);
  const displayPath = join(directory, "display-640.json");
  const display = load(displayPath);
  assert.deepEqual(spec.source.authoritativeText, authoritative.authoritativeText);
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256);
  assert.equal(render.status, "pass");
  assert.equal(render.spec.sha256, candidate.spec.sha256);
  assert.equal(render.output.svg.sha256, candidate.svg.sha256);
  assert.equal(display.status, "pass");
  assert.equal(display.specSha256, candidate.spec.sha256);
  assert.equal(display.svgSha256, candidate.svg.sha256);
  assert.equal(display.screenshot.sha256, candidate.actual640.sha256);
  const contextChecks = [];
  for (const binding of freeze.completeBilingualContexts.filter((entry) => entry.figure === candidate.figure)) {
    const context = load(binding.path);
    const lesson = context.lessons[0];
    const template = load(lesson.authoritativeLesson.path);
    assert.deepEqual(lesson.completeEditionProse, template.prose);
    assert.equal(lesson.completeEditionProse.length, 12);
    assert.deepEqual(
      lesson.completeEditionProse.filter((entry) => entry.kind === "p" || entry.kind === "cap").map((entry) => entry.text),
      authoritative.authoritativeText.filter((entry) => entry.lesson.endsWith(`:${binding.locale}`)).map((entry) => entry.text),
    );
    assert.equal(template.external_dependencies.length, 2);
    assert.ok(template.external_dependencies.every((entry) =>
      entry.identity_approved === false && entry.asset === null && entry.status === "PLATE-IDENTITY-AND-OWNERSHIP-PENDING"));
    contextChecks.push({ ...binding, template: record(lesson.authoritativeLesson.path), completeProseEqualsTemplate: true });
  }
  const objectIds = new Set(spec.objects.map((entry) => entry.id));
  const assertionIds = new Set(spec.assertions.map((entry) => entry.id));
  for (const mapping of judgment.sourceCoverage) {
    for (const id of mapping.objects || []) assert.ok(objectIds.has(id), `Missing object ${id}`);
    for (const id of mapping.assertions || []) assert.ok(assertionIds.has(id), `Missing assertion ${id}`);
  }
  const mappedInventory = spec.source.inventory.map((group) => {
    for (const id of group.objects) assert.ok(objectIds.has(id));
    for (const id of group.assertions) assert.ok(assertionIds.has(id));
    return { id: group.id, objects: group.objects, assertions: group.assertions, requires: group.requires };
  });
  const roles = new Set(["ink", "muted", "accent", "accentSoft", "grid", "paper"]);
  for (const object of spec.objects) {
    for (const key of ["stroke", "fill"]) if (object[key]) assert.ok(roles.has(object[key]));
  }
  if (candidate.figure === "fig-196") {
    const circles = spec.objects.filter((entry) => /^round-image-\d+$/.test(entry.id));
    assert.equal(circles.length, 7);
    for (let index = 0; index < circles.length - 1; index++) {
      const a = spec.objects.find((entry) => entry.id === circles[index].center).at;
      const b = spec.objects.find((entry) => entry.id === circles[index + 1].center).at;
      assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < circles[index].radius + circles[index + 1].radius);
    }
  } else {
    for (const side of ["upper", "lower"]) {
      assert.equal(spec.objects.find((entry) => entry.id === `${side}-no-prism-reference`).dash, 2);
      for (const color of ["red", "violet"]) {
        for (const suffix of ["exit-on-face", "internal-connects", "emergent-connects", "arrow-connects", "arrow-start-on-ray", "arrow-end-on-ray"]) {
          assert.ok(assertionIds.has(`${side}-${color}-${suffix}`));
        }
        assert.ok(!spec.objects.find((entry) => entry.id === `${side}-${color}-emergent`).dash);
      }
    }
  }
  const nativePasses = ["draft", "render", "rendered"].map((stage) => {
    const path = join(directory, `${stage}.command.json`);
    const receipt = load(path);
    assert.equal(receipt.exitCode, 0);
    assert.equal(receipt.specSha256, candidate.spec.sha256);
    return { stage, evidence: record(path), exitCode: 0, reusedWithoutReplay: true };
  });
  const reviewPath = join(output, `${candidate.figure}.review.json`);
  const args = [
    join(root, ".agents/skills/ld-s10y-image/scripts/record_review.py"),
    "--spec", candidate.spec.path, "--render", candidate.render.path,
    "--output", reviewPath, "--status", judgment.status, "--notes", judgment.nativeReviewNotes,
  ];
  const run = spawnSync("python3", args, {
    cwd: root,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    encoding: "utf8",
    timeout: 120000,
  });
  const command = writeNew(`${candidate.figure}.record-review.command.json`, {
    cwd: root, command: "python3", args,
    script: record(args[0]), bytecodeWritesDisabled: true,
    exitCode: run.status, signal: run.signal,
    stdout: run.stdout, stderr: run.stderr, error: run.error?.message || null,
  });
  assert.equal(run.status, 0, run.stderr || run.error?.message);
  const review = load(reviewPath);
  assert.equal(review.schema, "ld-s10y-image/review@1");
  assert.equal(review.status, judgment.status);
  assert.equal(review.spec.sha256, candidate.spec.sha256);
  assert.equal(review.render.sha256, candidate.render.sha256);
  verifyBindings(review);
  results.push({
    ...candidate, status: judgment.status, summary: judgment.summary,
    source: record(spec.source.image.path), nativePasses,
    actualDisplay: { evidence: record(displayPath), observations: display.observations, reusedWithoutReplay: true },
    completeBilingualContexts: contextChecks, mappedInventory,
    independentJudgment: judgment, nativeReview: record(reviewPath), recordReviewCommand: command,
  });
}

// Recheck the frozen files after recording; no candidate or historical evidence is rewritten.
for (const input of inputs) verifyBindings(input);
const report = {
  schema: "d809/independent-figure-review-report@1",
  status: "COMPLETE-PASS-NUMBERED-FIGURES-ONLY",
  ticket: "STEMROBIN-181/181-3", card: "phy10-c2-s3-n83", checkout: root,
  exclusiveWriteRoot: output, role: "independent reviewer, not author",
  authorFreeze: record(freezePath), authorReport: record(authorReportPath),
  sourceObservations: record(join(output, "source-observations.json")),
  judgments: record(join(output, "judgments.json")),
  recordingScript: record(fileURLToPath(import.meta.url)),
  initialAuthorBindingsChecked: initialBindingsChecked, finalFrozenBindingsUnchanged: true,
  figures: results,
  historyPreserved: {
    firstFailures: freeze.candidates.map((entry) => record(join(author, entry.figure, "FIRST-native-failure.json"))),
    failureEvidence: authorReport.failureEvidence,
    repairs: authorReport.repairs, nativeAttempts: authorReport.execution,
    authorImageUsage: authorReport.cumulativeImageUsage, reviewerRepairs: 0,
    ordinaryRepairDelegation: "Repeated reversible author repairs remain permitted by the direct instruction; the reviewer made none and did not reset cumulative usage.",
  },
  imageUsage: {
    ...judgments.imageUsage,
    images: [
      ...observations.figures.map((entry) => ({ purpose: "original PNG independently inspected", ...entry.source })),
      ...freeze.candidates.map((entry) => ({ purpose: "exact final actual640 independently inspected", ...entry.actual640 })),
    ],
  },
  paidUsage: { calls: 0, images: 0, tokens: 0, cost: 0 },
  boundaries: {
    ...judgments.boundaries,
    sourceEdits: 0, candidateEdits: 0, canonicalEdits: 0, indexEdits: 0, meterEdits: 0,
    gitCommands: 0, databaseActions: 0, publishActions: 0, deployActions: 0,
    branchesOrWorktreesCreated: 0, otherChatMessages: 0, agentsSpawned: 0,
    rendersRun: 0, determinismReplays: 0, fullLessonAcceptanceRun: false,
    alternateThemePixelChecksRun: false,
    nativeRecordReviewValidation: "The permitted native recorder validates rendered bindings internally; existing author producer stages were not rerun.",
  },
  unresolved: ["External Roman Color Plate I identity/ownership", "External Roman Color Plate II identity/ownership", "Whole-card acceptance and any promotion/publication remain outside this review"],
  stop: "This bounded batch is finished. No further image loads, review batches, repairs or production are authorized in this reviewer run.",
};
const reportBinding = writeNew("report.json", report);
const reviewFreeze = writeNew("review-freeze.json", {
  schema: "d809/review-freeze@1", status: report.status,
  report: reportBinding,
  authorFreeze: report.authorFreeze, authorReport: report.authorReport,
  sourceObservations: report.sourceObservations, judgments: report.judgments,
  script: report.recordingScript,
  figures: results.map((entry) => ({
    figure: entry.figure, status: entry.status, revision: entry.revision,
    source: entry.source, spec: entry.spec, svg: entry.svg, render: entry.render,
    actual640: entry.actual640, review: entry.nativeReview, command: entry.recordReviewCommand,
  })),
  imageLoads: 4, contextImages: 4, paidCalls: 0, repairsPreserved: 5,
  wholeCardApproved: false, externalRomanPlatesCleared: false,
});
console.log(JSON.stringify({ report: reportBinding, freeze: reviewFreeze, figures: results.map((entry) => ({ figure: entry.figure, status: entry.status, review: entry.nativeReview })), imageLoads: 4 }, null, 2));
