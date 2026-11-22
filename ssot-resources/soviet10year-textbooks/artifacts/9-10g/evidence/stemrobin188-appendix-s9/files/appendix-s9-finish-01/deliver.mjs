import assert from "node:assert/strict";
import path from "node:path";
import { bind, core, inventory, read, repo, retain, save, tmp } from "../retain-scoped-evidence-02.mjs";

assert.equal(process.cwd(), repo);
const own = path.join(tmp, "appendix-s9-finish-01");
const lessonId = "geo910-appendix-s9";
const ready = path.join(core, "editions/modern-us-neutral/lessons", lessonId);
const displayFile = path.join(tmp, "appendix-s9-display-review-01/display-review.json");
assert.equal(bind(displayFile).sha256, "d71e20b7d3d9e4a20e2fb31a5576c50cb5524a6ea2ddea4f74c7f2674058ffc3");
const display = read(displayFile);
assert.equal(display.status, "PASS");
assert.equal(display.completed, true);
const outputs = ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]
  .map(name => {
    const item = bind(path.join(ready, name));
    assert.equal(item.sha256, display.bindings.current_core[name]);
    return item;
  });
const sourceReview = bind(path.join(tmp, "source321322-boundary-affected-FIRST-review-01/review.json"));
const affectedReview = bind(path.join(tmp, "s9-source-affected-and-text-review-02/affected-review.json"));
const textReview = bind(path.join(tmp, "s9-source-affected-and-text-review-02/text-review.json"));
assert.equal(affectedReview.sha256, "d0077d623d5f1ec8998a677322627da2b92b56a54d74f7dbe859ab0d62999ef9");
assert.equal(textReview.sha256, "81cfc03fe4ef65493f308398030878b0ff491af059fd7b83ef0ccca14458fed2");
const delivery = {
  schema: "STEMROBIN188/offline-lesson-delivery@1",
  status: "S9_SCOPED_OFFLINE_LESSON_COMPLETE",
  lesson: lessonId,
  edition: "modern-us-neutral",
  sourceTextAndLocalScienceReviewsReused: [sourceReview],
  affectedSourceAndScopedAncestorReview: affectedReview,
  textReview,
  displayReview: bind(displayFile),
  displayResult: bind(path.join(tmp, "offline-display-9-10g_geo910-appendix-s9-surfaces/result.json")),
  native: bind(path.join(tmp, "appendix-s9-draft-03/adapt-finalize-01/command.json")),
  promotion: bind(path.join(own, "promotion.json")),
  index: bind(path.join(own, "index.json")),
  outputs,
  proseBlocks: 28,
  normalizedTextParagraphs: 29,
  sectionBreaks: 6,
  axiomGroups: 5,
  axioms: 17,
  displayFormulas: 16,
  exercises: 0,
  figures: 0,
  newOfflineLessonsThisContinuation: 1,
  noExerciseAnswerOrChoiceStageRequired: true,
  nativeScope: "Explicit target source stream with the approved302 h1 ancestor; not canonical whole-book reconstruction.",
  nativeFinalizeCalls: 1,
  sourceFinalizerReplays: 0,
  lessonRendererCalls: 1,
  browserCalls: 1,
  reviewerImageLoads: 2,
  parentImageLoads: 0,
  parentPermanentImages: 24,
  source322ContentRevisions: 1,
  source320KindRevisions: 1,
  canonicalSourceOwnerExBlocked: true,
  allOtherSourceAndScientificHoldsPreserved: true,
  sharedSkillChangesThisContinuation: 0,
  paidCalls: 0,
  dbWrites: 0,
  headedOrLiveAcceptance: false,
  deployed: false,
  merged: false,
  ticketComplete: false,
  published: false,
};
save(path.join(own, "delivery.json"), delivery);

const files = [
  path.join(own, "delivery.json"),
  path.join(own, "deliver.mjs"),
  path.join(tmp, "record-stage-20261121.mjs"),
  path.join(tmp, "offline-display.mjs"),
  ...outputs.map(item => item.path),
  ...inventory(path.join(tmp, "appendix-s9-display-review-01")),
  ...inventory(path.join(tmp, "s9-source-affected-and-text-review-02")),
  ...inventory(path.join(tmp, "source322-literal-repair-02")),
  ...inventory(path.join(tmp, "source320-heading-repair-02")),
  ...inventory(path.join(tmp, "appendix-s9-text-rebind-02")),
  ...inventory(path.join(tmp, "appendix-s9-text-author-01")),
  ...inventory(path.join(tmp, "offline-display-9-10g_geo910-appendix-s9-surfaces")),
];
for (const name of ["source-index-before.json", "edition-index-before.json", "promotion.json", "index.json", "promote.py", "index.py"]) {
  files.push(path.join(own, name));
}
for (const name of ["promote-01", "source-reindex-01", "index-01", "render-01", "display-01"]) {
  files.push(...inventory(path.join(own, name)));
}
for (const name of ["report.json", "assemble.py"]) {
  files.push(path.join(tmp, "appendix-s9-draft-03", name));
}
for (const name of ["assemble-receipts", "adapt-prepare-01", "adapt-finalize-01"]) {
  files.push(...inventory(path.join(tmp, "appendix-s9-draft-03", name)));
}
for (const name of ["lesson.template.json", "exercises.template.json", "figures.template.json"]) {
  files.push(path.join(tmp, "appendix-s9-draft-03/work/adapt/9-10g/modern-us-neutral/lessons", lessonId, name));
}
for (const name of ["review.json", "FIRST-0321.json", "FIRST-0322.json", "FIRST-0323-title.json", "verification.json", "s9-text-review.json", "completion.json"]) {
  files.push(path.join(tmp, "source321322-boundary-affected-FIRST-review-01", name));
}
for (const page of ["0321", "0322"]) {
  for (const name of ["page.md", "page.json", "audit.json"]) {
    files.push(path.join(tmp, "source321322-author/artifacts/9-10g/pages", page, name));
  }
}
for (const page of ["0302", "0320", "0321", "0322"]) {
  files.push(...inventory(path.join(tmp, "appendix-s9-draft-03/artifacts/9-10g/pages", page)));
}
files.push(
  path.join(tmp, "appendix-s9-draft-01/assemble-scoped.FIRSTFAIL.py"),
  path.join(tmp, "appendix-s9-draft-01/assemble-scoped.py"),
  path.join(tmp, "appendix-s9-draft-02/work/adapt/9-10g/modern-us-neutral/lessons", lessonId, "lesson.template.json"),
  ...inventory(path.join(tmp, "appendix-s9-draft-01/assemble-receipts")),
);
retain(path.join(core, "evidence/stemrobin188-appendix-s9"), files, {
  status: "S9_SCOPED_OFFLINE_COMPLETE_EVIDENCE_RETAINED",
  actualDelivery: bind(path.join(own, "delivery.json")),
  scope: "Necessary current inputs, first failures and independent source/text/display evidence retained once. No rerun or new approval.",
  pdfRuntimeAndInterveningPagesCopied: false,
});
console.log(JSON.stringify({ delivery: bind(path.join(own, "delivery.json")) }));
