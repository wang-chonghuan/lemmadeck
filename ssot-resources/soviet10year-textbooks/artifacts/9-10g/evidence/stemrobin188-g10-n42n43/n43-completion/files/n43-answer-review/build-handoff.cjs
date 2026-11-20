const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const root = process.cwd();
const tmp = ".intentfold/tickets/STEMROBIN-188/tmp/";
const paths = [
  tmp + "n43-choice-review/FIRST-source.md",
  tmp + "n43-choice-review/views-only.json",
  tmp + "n43-choice-review/pre-key.md",
  tmp + "n43-choice-review/pre-key.json",
  tmp + "n43-choice-review/review.md",
  tmp + "n43-choice-review/review.json",
  tmp + "n43-answer-review/answer-review.md",
  tmp + "n43-answer-review/answer-review.json"
];
const records = paths.map((relative) => {
  const absolute = path.join(root, relative);
  const stat = fs.statSync(absolute);
  return {
    path: absolute,
    sha256: crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex"),
    modified_utc: stat.mtime.toISOString(),
    created_utc: stat.birthtime.toISOString()
  };
});
const choice = JSON.parse(fs.readFileSync(path.join(root, paths[5]), "utf8"));
const answer = JSON.parse(fs.readFileSync(path.join(root, paths[7]), "utf8"));
if (choice.source_reviews.length !== 8 || choice.question_reviews.length !== 8 ||
    choice.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0) !== 32 ||
    choice.outcome !== "pass" || answer.semantic_outcome !== "PASS") {
  throw new Error("Unexpected review coverage or outcome");
}
if (answer.input_bindings.find((item) => item.path === paths[0]).sha256 !== records[0].sha256 ||
    answer.input_bindings.find((item) => item.path === paths[5]).sha256 !== records[5].sha256) {
  throw new Error("First evidence or choice report changed after answer binding");
}
const creation = (index) => Date.parse(records[index].created_utc);
if (!(creation(0) < creation(1) && creation(1) < creation(3) &&
      creation(3) < creation(5) && creation(5) < creation(7))) {
  throw new Error("Source/view/pre-key/choice/answer persisted order is not established");
}
const handoff = {
  schema: "n43-independent-review-handoff-v1",
  ticket: "STEMROBIN-188",
  batch: "same188-6",
  choice_semantic_outcome: "PASS",
  answer_semantic_outcome: "PASS",
  findings: [],
  files: records,
  first_evidence: records[0],
  canonical_snapshots: {
    seed_sha256: choice.seed_sha256,
    draft_sha256: choice.draft_sha256,
    answer_candidate_sha256: answer.candidate.canonical_sha256
  },
  supplied_raw_candidate_sha256: answer.candidate.sha256,
  chronology_assertion: "Created FIRST-source.md before views-only.json, before pre-key.json, before choice review.json, before answer-review.json; actual author disclosure was separately guarded by the preceding persisted records.",
  actual_image_opens: 2,
  context_images: 2,
  image_payload_in_handoff: false,
  parent_pending: [
    "One review-aware choices checker; not run by this reviewer.",
    "Actual MathLive keyboard/serialization contract and finalize mechanical gates; not run by this reviewer."
  ],
  prohibited_actions_performed: false
};
const output = path.join(root, tmp, "n43-answer-review/handoff.json");
fs.writeFileSync(output, JSON.stringify(handoff, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(handoff, null, 2));
console.log("handoff_sha256=" + crypto.createHash("sha256").update(fs.readFileSync(output)).digest("hex"));
