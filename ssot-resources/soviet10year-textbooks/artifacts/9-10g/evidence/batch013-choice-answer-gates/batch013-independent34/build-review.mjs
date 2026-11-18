import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const own = `${root}/.tmp/s10y-choice/batch013-independent34`;
const author = `${root}/.tmp/s10y-choice/batch013-author3435`;
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const sort = (v) => Array.isArray(v) ? v.map(sort) :
  v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort(v[k])])) : v;
const canonical = (v) => JSON.stringify(sort(v)).replace(/[\u007f-\uffff]/g,
  (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const digest = (v) => sha(canonical(v));
const seed = load(`${author}/n34.seed.json`);
const draft = load(`${author}/n34.draft.json`);
const blind = load(`${own}/blind-solutions.json`);
const visible = load(`${own}/view-only-reasoning.json`);
assert.equal(digest(seed), "3287414fbd0c819bff546df6134e8c4bbb0efc66cedfd561118ad293333ede61");
assert.equal(digest(draft), "5c34e027c7c0e733fe2e72d02ee26611f48803c9152e501016726cfcb74e527b");
assert.equal(blind.seed_sha256, digest(seed));
assert.equal(seed.exercises.length, 13);
assert(!seed.exercises.some((s) => s.number === "313"));
assert.equal(draft.questions.length, 16);
const coverageEvidence = {
  "310": "q310 keeps comparison and iff equality together; independent-written-proof loss is explicitly declared.",
  "311": "q311 ordered pair retains both diagonal cases; auxiliary construction and written calculation loss declared.",
  "312": "q312 retains both signed-distance cases and zero contacts; independent proof production is explicitly omitted, not falsely claimed.",
  "314": "q314-right and q314-angle preserve forward and inverse distance systems and l=R boundary; independent circumcenter construction/proofs and two-sided point counting losses declared.",
  "315": "q315 covers the right triangle, cyclic isosceles trapezoid and empty non-square rhombus; drawing and proof-production losses declared.",
  "316": "q316 includes point invariance for parallel line and zero for intersection; written proof loss declared.",
  "317": "q317 gives the complete two-length set with c>b and no invented side condition; c=b boundary and constructive exhaustion losses declared.",
  "318": "q318 retains both parallel-plane constancy and intersection zero; standalone proof production is explicitly not verified.",
  "319": "q319 mathematically includes both offset planes for l>0; l=0/l<0 and drawing losses declared. Separate leakage/redundancy failure is recorded against q319/q320, not hidden by this coverage pass.",
  "320": "q320 includes strict interior/exterior, excluded boundaries and alpha inclusion; nonpositive parameter and drawing losses declared. Its q319 answer donation is separately failed.",
  "321": "q321 retains the unique full median plane and excludes exterior solutions; equation-production proof loss declared.",
  "322": "q322 retains eligible axis direction, location and whole-family union, with half-turn meaning explicit; constructive necessity/sufficiency production losses declared.",
  "323": "All three data systems survive as separate meaningful units; m=n nonuniqueness remains. Symbolic-production, full feasibility proofs and numeric working losses are declared; none are concealed."
};
const authorComparison = {
  "q310": "Author set C and squared-distance proof match; reverse inclusion, strictness, and missing-foot distractor procedures give A,B,D respectively and are false.",
  "q311": "Author set A matches; dimension interchange, unsquared coefficients and multiplication instead of division give B,C,D exactly.",
  "q312": "Author B,D match; heights 2,6 give 4 rather than 2 for A; 2,-6 give 2 rather than 4 for C. Signed-height averaging includes contacts/containment.",
  "q314-right": "Author D and circumcenter proof match. Whole diameter as radius, adding perpendicular lengths, and failing to square denominator give A,B,C exactly.",
  "q314-angle": "Author B matches extended sine law and real-domain boundary. Assuming diameter, excluding in-plane M, and adding instead of subtracting R^2 give A,C,D.",
  "q315": "Author A,B,D match. Opposite-pair distances in a centrally symmetric rhombus do not imply equal half-diagonals; this is the concrete C misconception.",
  "q316": "Author A matches. Extending constant point distance to an intersecting line gives B; assuming unbounded line length approaches the plane gives C; tangential movement changing height gives D.",
  "q317": "Author C and +/-r coordinates match. Selecting only same or opposite signs gives A/B; using c rather than sqrt(c^2-b^2) gives D.",
  "q318": "Author B matches. Excluding intersection points gives A; arbitrary pair instead of perpendicular pair gives C; importing common-point zero to distinct parallel planes gives D.",
  "q319": "Author D and both signed normal levels match. Fixed-point distance, dropping one sign, and replacing equality by <= give A,B,C. Author coverage is honest, but does not rescue cross-question leakage.",
  "q320": "Author A matches all strict boundaries. Closing inequalities gives B, interchanging regions gives C, and discarding zero distance gives D. Outgoing leakage to q319 remains definite.",
  "q321": "Author C matches unique z=H/2. Membership in one plane, fixed sum instead of equality, and distance to only nearer plane give A,B,D.",
  "q322": "Author B matches R=2vv^T-I, v dot n=0, median height. Normal axes preserve height, arbitrary parallel axes have wrong height, and alpha axes fix alpha; A,C,D procedures are false.",
  "q323-numeric": "Author D matches k=2 and 16 cm. A is sqrt(30^2-12^2)=6sqrt(21). Author B specifically uses the erroneous addition sqrt(20^2+12^2)=sqrt(544)=4sqrt(34); this gives the printed option exactly. C comes from reading 3 dm as 3 cm, yielding negative k^2.",
  "q323-ratio": "Author A,C match. The incorrect non-crossed elimination in B yields h^2+(m^2+n^2)t^2, strictly too large for t>0. D adds an unsupported projection=height constraint, giving a/sqrt(2).",
  "q323-sum": "Author B and feasibility c^2>=abs(a^2-b^2), c<a+b match. For a=13,b=15,c=14, p=5,q=9,h=12; A=2sqrt(30), C=3sqrt(11), D has negative radicand. Stated false procedures respectively assume equal projections, replace p^2+q^2 by c^2, and use total c as one projection."
};
for (const q of draft.questions) {
  const r = visible.question_reviews.find((v) => v.question_id === q.id);
  assert(r);
  assert.deepEqual([...r.mathematics.correct].sort(), [...q.key.correct].sort());
  for (const option of r.mathematics.option_checks) {
    assert.equal(option.truth, q.key.rationales.find((a) => a.option_id === option.option_id).truth);
  }
}
const questions = structuredClone(visible.question_reviews);
questions.find((q) => q.question_id === "q323-numeric").mathematics.option_checks
  .find((o) => o.option_id === "B").evidence +=
  " Author's actual mistaken procedure is sqrt(20^2+12^2)=sqrt(544)=4sqrt(34), also checked explicitly.";
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  reviewer: {
    kind: "independent_agent",
    identity: "Same184-3 fresh authorized Codex reviewer, batch013-independent34; separate from n34 author"
  },
  source_reviews: blind.source_reviews.map((s) => ({
    ...s,
    coverage: {verdict: "pass", evidence: coverageEvidence[s.source_number]}
  })),
  figure_checks: [],
  new_figure_reviews: [],
  question_reviews: questions,
  outcome: "revise"
};
const comparison = {
  seed_sha256: digest(seed),
  draft_sha256: digest(draft),
  stage: "author-internals-disclosed-only-after-saved-blind-and-view-only-reasoning",
  question_comparisons: Object.entries(authorComparison).map(([question_id, evidence]) => ({
    question_id, mathematics_and_distractor_procedure_verdict: "pass", evidence
  })),
  coverage_verdict: "pass-with-declared-recognition-capacity-losses",
  package_verdict: "revise",
  figures: "No question or source exercise in this choice draft uses a figure. Seed definition fig-125 was actually opened and recorded in blind-solutions.json; strict figure_checks must be empty because the validator requires exactly question-used assets. There are no new figures.",
  findings: visible.package_findings,
  first_review_policy: "Keep review.json immutable after this first review. Only affected follow-up review after actual author repair, bound to the new snapshot."
};
for (const [name, data] of [["review.json", review], ["author-comparison.json", comparison]]) {
  fs.writeFileSync(`${own}/${name}`, `${JSON.stringify(data, null, 2)}\n`, {flag: "wx"});
}
console.log(JSON.stringify({
  outcome: review.outcome,
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  review_sha256: digest(review),
  review_file_sha256: sha(fs.readFileSync(`${own}/review.json`)),
  questions: review.question_reviews.length,
  independently_checked_options: review.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0)
}, null, 2));
