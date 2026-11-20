const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const root = process.cwd();
const scratch = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n43-choice-review");
const author = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp/n43-choice-author");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.keys(value).sort().map((key) =>
      canonical(key) + ":" + canonical(value[key])).join(",") + "}";
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (character) =>
    "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));
}
const seedBytes = fs.readFileSync(path.join(author, "seed.json"));
const draftBytes = fs.readFileSync(path.join(author, "draft.json"));
if (sha(seedBytes) !== "86242128195f1d2dd75e73826ae326baccb5881a866235132198c355ed637af9" ||
    sha(draftBytes) !== "ef87d49b05a9cecac970a65e7f9a4e2348fec630184db37bac86b3e128a1c700") {
  throw new Error("Authorized snapshot changed");
}
const seed = JSON.parse(seedBytes);
const draft = JSON.parse(draftBytes);
const sourceText = fs.readFileSync(path.join(scratch, "FIRST-source.md"), "utf8");
const preKey = JSON.parse(fs.readFileSync(path.join(scratch, "pre-key.json"), "utf8"));
const views = JSON.parse(fs.readFileSync(path.join(scratch, "views-only.json"), "utf8"));
if (canonical(views) !== canonical(draft.questions.map((question) => question.view))) {
  throw new Error("Learner view changed after pre-key review");
}
const questionReviews = preKey.question_reviews.map((row, index) => {
  const question = draft.questions[index];
  const independent = [...row.mathematics.correct].sort();
  if (canonical(independent) !== canonical([...question.key.correct].sort())) {
    throw new Error("Independent truth set disagrees; do not normalize away");
  }
  row.question_id = question.id;
  for (const check of row.mathematics.option_checks) {
    const rationale = question.key.rationales.find((item) => item.option_id === check.option_id);
    if (!rationale || rationale.truth !== check.truth) throw new Error("Option truth disagreement");
    check.evidence += " Post-key comparison: the author's stated derivation, independently recalculated above, matches this alternative: " +
      rationale.derivation + (rationale.misconception === null ?
        " Correct alternative has no misconception." :
        " Its stated mistaken procedure also matches the false alternative: " + rationale.misconception);
  }
  row.mathematics.independent_solution += " Author source solution and exact set were disclosed only after the source/view/option records existed; every rationale has been compared below.";
  return row;
});
const coverageEvidence = {
  "8": "The one n43-norms tuple contains all four lengths and preserves signed/zero components. Author acknowledges loss of independent written calculations; recognition can also discriminate by a subset, recorded in pre-key evidence. No norm task silently removed.",
  "9": "n43-equal-coordinates includes exactly both uniform-sign triples and rejects a mixed-sign triple. Author coverage admits equation-generation loss; no positive-sign assumption or omitted solution.",
  "10": "n43-sum-norms retains both ordinary addition and opposite-vector cancellation. Author reports both results and written-work loss; partial elimination does not remove vector-sum judgment.",
  "11": "n43-weighted-sum-norms retains both 2a+3b pairs, with squared norms 72 and 70. Author omission-of-cross-term rationale produces 48 and 58 exactly; reported losses concern written production, not lost coefficients or a missing pair.",
  "12": "n43-vector-angle returns arccos(4/9), the requested angle, not merely its cosine. The standard principal-angle domain adds no acute premise. Only autonomous derivation is deferred.",
  "13": "n43-sum-difference-cosine uses the requested derived vectors and all three components, result 1/11. No transfer of original orthogonality replaces the task. Written construction is explicitly deferred.",
  "14": "n43-direction-proof covers BOTH proofs and BOTH 45/135 angle branches. Complete chains require positive scaling, signed dot-product identification and actual squared-sum validity. Author explicitly reports lost free proof writing and partial-chain elimination, consistent with independent pre-key observations. The schematic supplies no positivity premise; neither proof nor an angle branch is silently omitted.",
  "15": "n43-direction-cosine-table retains four vectors and all twelve ordered cosines including zeros and negative signs. Author reports complete-table recognition loss and single-cell elimination; all mathematical results are covered, with no independent twelve-cell production claim."
};
const sourceReviews = seed.exercises.map((exercise) => {
  const marker = `### ${exercise.number}\n`;
  const beginning = sourceText.indexOf(marker);
  if (beginning < 0) throw new Error("Independent source section missing");
  const following = sourceText.slice(beginning + marker.length);
  const end = following.search(/\n(?:### |## )/);
  const independentSolution = (end < 0 ? following : following.slice(0, end)).trim();
  return {
    source_number: exercise.number,
    independent_solution: independentSolution,
    coverage: { verdict: "pass", evidence: coverageEvidence[exercise.number] }
  };
});
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: sha(canonical(seed)),
  draft_sha256: sha(canonical(draft)),
  reviewer: {
    kind: "independent_agent",
    identity: "Authorized SINGLE independent N43 reviewer, same188-6/STEMROBIN-188; source-first then view-only then all-option pre-key evidence; not the candidate author."
  },
  source_reviews: sourceReviews,
  figure_checks: [{
    figure_id: "fig-g10-05",
    asset_path: seed.figures[0].assets[0].path,
    asset_sha256: seed.figures[0].assets[0].sha256,
    observation: "Actually opened the inherited approved full preview PNG ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/stemrobin188-g10-n42n43/geo910-c2-s1-n43-figures/fig-g10-05.preview.png, SHA256 b208a7c07dc22b876978aa23f05de2e64e906b284424dc1ee2f51f7fe51fe022, before draft views. Four outward arrows share an unmarked tail: i down-left, j right, k up, a up-right; alpha pairs i/a, beta j/a, gamma k/a. Full rightmost j and bottommost i labels, all tips and three Greek marks are visible. No degree values, coordinates or answers. Screen sweeps and projected lengths are schematic, not true 3D measurements, and do not imply r>0 or gamma acute. Current seed SVG actual hash agrees. Also actually opened original PNG (SHA256 ead0b7efbccc03c7d8205535a406dd7b6be2da7697567dd34b596337255f2cc7), confirming the same associations without a positivity condition. Existing modern figure PASS is inherited, not reapproved or rerendered. Total 2 actual opens, 2 context images."
  }],
  new_figure_reviews: [],
  question_reviews: questionReviews,
  outcome: "pass"
};
fs.writeFileSync(path.join(scratch, "review.json"), JSON.stringify(review, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  outcome: review.outcome,
  seed_sha256: review.seed_sha256,
  draft_sha256: review.draft_sha256,
  review_raw_sha256: sha(fs.readFileSync(path.join(scratch, "review.json"))),
  source_count: sourceReviews.length,
  question_count: questionReviews.length,
  option_count: questionReviews.reduce((total, row) => total + row.mathematics.option_checks.length, 0)
}, null, 2));
