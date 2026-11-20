import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = path.dirname(new URL(import.meta.url).pathname);
const inputRoot = path.resolve(root, "../n61-fig8788-review-inputs-01");
const authorRoot = path.resolve(root, "../n61-fig8788-author");
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const manifest = load(path.join(inputRoot, "manifest.json"));
const record = (p) => {
  const b = fs.readFileSync(p);
  return { path: p, sha256: hash(b), bytes: b.length };
};
const write = (name, value) => {
  const p = path.join(root, name);
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  console.log(JSON.stringify(record(p)));
};
const admission = load(manifest.n61TextAdmission.path);
const author = load(manifest.authorReport.path);
write("inherited-state.json", {
  schema: "independent-review-preserved-inherited-state@1",
  readOnly: true,
  authorReport: record(manifest.authorReport.path),
  textAdmission: record(manifest.n61TextAdmission.path),
  sourceHolds: admission.sourceHolds,
  n61TextLate0444ProceduralHold: {
    status: "HOLD", reason: admission.reviewHolds,
    strictFIRSTProcessApproved: admission.strictFIRSTProcessApproved,
    reviewerDisposition: "RETAINED_UNCLEARED"
  },
  authorLocalProcedureHolds: author.HOLDs.localProcedure,
  manifestAuthorLocalProcedureHolds: manifest.authorLocalProcedureHOLD,
  authorInheritedProcedure: author.HOLDs.inheritedProcedure,
  historicalFigure87FIRSTFailures: author.failures,
  authorHistoricalImageCounters: author.imageCounters,
  authorCounterInterpretation: "Historical record retained verbatim; this reviewer counts actual image units in image-ledger.json, not the author's file/tool counts.",
  outOfScopeFigure86: { status: "FAIL", basis: "Human scope instruction", visuallyOpened: false,
    reviewedHere: false, changed: false },
  otherFailedFigures: { status: "FAIL_PRESERVED_TEXT_ONLY", visuallyOpened: false,
    reviewedHere: false, changed: false },
  clearance: false, sourceApproval: false, wholeLessonApproved: false, promoted: false
});
const stageNames = [
  "fig87-FIRST-construct", "fig87-FIRST-validate", "fig87-FIRST-render", "fig87-FIRST-snapshot",
  "fig87-REPAIR1-author", "fig87-REPAIR1-validate", "fig87-REPAIR1-render", "fig87-REPAIR1-snapshot",
  "fig88-FIRST-construct", "fig88-FIRST-validate", "fig88-FIRST-render", "fig88-FIRST-snapshot"
];
write("saved-native-receipt-readback.json", {
  schema: "independent-review-saved-native-readback@1",
  method: "Read existing hash-bound JSON and text receipts only. Nothing executed from these commands.",
  reruns: 0, newRenderings: 0,
  stages: stageNames.map((stage) => {
    const dir = path.join(authorRoot, "commands", stage);
    return { stage, command: load(path.join(dir, "command.json")),
      exit: load(path.join(dir, "exit.json")),
      stdout: fs.readFileSync(path.join(dir, "stdout.txt"), "utf8"),
      stderr: fs.readFileSync(path.join(dir, "stderr.txt"), "utf8"),
      files: ["command.json", "exit.json", "stdout.txt", "stderr.txt"].map((name) => record(path.join(dir, name)))
    };
  }),
  current: manifest.figures.map((f) => ({
    figure: f.id, current: f.current, render: load(f.current.render.path),
    snapshot: load(f.current.snapshot.path),
    historicalFailureNeverClearedBySnapshotPass: f.id === "fig-g10-87"
  }))
});
const contexts = manifest.figures.map((f) => ({ figure: f.id, ...load(f.source.context.path) }));
const lesson = load(contexts[0].editionLesson.path);
const exercises = load(contexts[0].editionExercises.path);
write("authoritative-text-readback.json", {
  schema: "independent-complete-edition-text-readback@1",
  scope: "N61 complete authoritative edition prose and exercises read after both source FIRST seals.",
  contextBindings: manifest.figures.map((f) => f.source.context),
  lesson: record(contexts[0].editionLesson.path),
  exercises: record(contexts[0].editionExercises.path),
  proseCount: lesson.prose.length, exerciseCount: exercises.exercises.length,
  completeProse: lesson.prose, completeExercises: exercises.exercises,
  contextsMatchEditionText: contexts.every((ctx) =>
    JSON.stringify(ctx.completeEditionProse) === JSON.stringify(lesson.prose) &&
    JSON.stringify(ctx.completeEditionExercises) === JSON.stringify(exercises.exercises)),
  answersRead: false, otherFiguresVisuallyOpened: false,
  exactSourceCodepointsOrFineFontsCleared: false
});
