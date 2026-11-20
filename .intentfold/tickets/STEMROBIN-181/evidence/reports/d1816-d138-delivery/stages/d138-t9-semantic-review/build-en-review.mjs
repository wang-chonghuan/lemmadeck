import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Wrong cwd");
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d138-t9-semantic-review");
const read = name => JSON.parse(fs.readFileSync(path.join(own, name), "utf8"));
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const first = read("source-first-solutions.json");
const findings = read("view-first-findings.json");
const projection = read("visible-only.json");
const images = read("image-ledger.json");
if (hash(fs.readFileSync(path.join(own, "source-first-solutions.json"))) !== findings.sourceFirstSha256 ||
    hash(fs.readFileSync(path.join(own, "visible-only.json"))) !== findings.visibleProjectionSha256) {
  throw new Error("Independent-first files changed");
}
if (hash(fs.readFileSync(projection.locales.en.draftBinding.path)) !== projection.locales.en.draftBinding.sha256) {
  throw new Error("English draft changed after visible review");
}
const coverage = {
  "1": "molecular-motion retains the hydrogen/nitrogen speed comparison. Author intent, limitations and coverage disclose common-temperature classical equilibrium and the RMS statistic as explicit conditions, plus related energy/quantifier judgments. Independent written derivation is not measured. No essential speed comparison is omitted.",
  "2": "graph-internal-energy retains all five original directed segments in one complete table, with original n17 isothermality, fixed composition and no numerical scale. Author derivations agree with the independent source solution and opened pixels. Free written explanation is not established by table recognition and that loss is declared; no source path is deferred.",
  "3": "air-water-molecule-count preserves pressure, temperature, both volumes and the total-count comparison. Visible approximate liquid properties disclose what original prose leaves implicit. Author calculations use different phase-counting models and agree with the independent result. Written derivation is the recorded response-capacity loss.",
  "4": "mean-squared-speed-heating preserves the original n32 overline(v^2) definition, 37-to-40 C heating and initial-value percentage. The classical liquid-molecule translational assumption is explicit, not a gas-pressure model for blood. The author does not redefine the source as RMS. Independent writing is not measured; bookRaw disagreement is separately retained in report.json.",
  "5": "vacuum-molecule-count preserves the SI pressure, 27 C, 1 cm^3 and molecular count. Expected count and source-rounded mmHg are explicit qualifications, not changed source data. Author intent and all exponent/temperature derivations agree with the independent solution. Written derivation is the declared capacity loss.",
  "6": "adiabatic-compression-rise retains 4 mol, monatomic gas, 500 J, adiabatic process and temperature change. The author's intent, limitations and coverage explicitly preserve the source's unstated work actor/sign and gross-versus-net transfer limit. The visible closed-gas net-work-on model is independently solvable; no unconditional resolution or constant-volume/reversible assumption is claimed."
};
const sourceReviews = first.solutions.map(row => ({
  source_number: row.source_number,
  independent_solution: row.independent_solution +
    (row.source_number === "1" ?
      " The original does not explicitly state equal temperature; this is the customary conditional equilibrium interpretation, not a newly asserted source datum." : "") +
    (row.source_number === "6" ?
      " This saved first solution uses the ordinary net-work-on compression model. The original does not explicitly specify the actor/sign or gross drive losses. Positive work-by would yield cooling and conflict with passive compression; gross compressor expenditure alone cannot fix the gas's net energy input. Keep those source limits distinct from the explicit visible conditional model." : ""),
  coverage: {verdict: "pass", evidence: coverage[row.source_number]}
}));
const seed = JSON.parse(fs.readFileSync(projection.seed.path, "utf8"));
const figureChecks = seed.figures.map(figure => {
  const index = figure.id === "fig-24" ? 0 : 1;
  const source = images.entries[index];
  const preview = images.entries[index + 2];
  return {
    figure_id: figure.id,
    asset_path: figure.assets[0].path,
    asset_sha256: figure.assets[0].sha256,
    observation: `Actually opened original PNG ${source.path} (SHA-256 ${source.sha256}) before the complete 640px preview ${preview.path} (SHA-256 ${preview.sha256}). ${source.observation} ${preview.observation} Verified the preview's author SVG is byte-identical to this seed asset, hash ${preview.svgSha256}. No rendering or previous structural review was rerun. Ledger records four actual image opens total.`
  };
});
const questions = structuredClone(findings.questionReviewsBothInspectedLocales);
for (const question of questions) {
  if (JSON.stringify(question.mathematics.correct) !==
      JSON.stringify(findings.completeTrueSets.en[question.question_id])) {
    throw new Error("Independent option set mismatch");
  }
  question.mathematics.independent_solution +=
    " Only after this complete true set was saved were the author's source solution, key, every rationale and misconception compared. They agree with these independently solved assertions.";
  for (const option of question.mathematics.option_checks) {
    option.evidence += option.truth === "correct" ?
      " The author's positive derivation is valid and its misconception is null." :
      " The author's stated mistaken procedure was checked and produces this false assertion.";
  }
}
questions.find(q => q.question_id === "graph-internal-energy").mathematics.option_checks
  .find(o => o.option_id === "C").evidence +=
  " Specifically, falsely taking Q=0 during both isothermal compressions gives the author's +,+,+,+,- vector.";
questions.find(q => q.question_id === "air-water-molecule-count").mathematics.option_checks
  .find(o => o.option_id === "C").evidence +=
  " The author's specific volume error 200 cm^3 -> 200*10^-3 m^3=0.2 m^3 gives 200 kg at the stated density and therefore the same 0.1870808 ratio.";
questions.find(q => q.question_id === "mean-squared-speed-heating").mathematics.option_checks
  .find(o => o.option_id === "B").evidence +=
  " Exact numerical audit of the final-denominator mistake is 300/313.15=0.9580073447 percent; the earlier first-view approximate decimal is superseded only in this numerical precision, not its saved verdict or true set.";
questions.find(q => q.question_id === "vacuum-molecule-count").mathematics.option_checks
  .find(o => o.option_id === "B").evidence +=
  " Exact numerical audit of T=27 gives 348735.6174; this refines the earlier first-view approximate decimal without changing the option's 3.5e5 rounded result or saved true set.";
const review = {
  schema: "s10y-choice-review-v1",
  seed_sha256: projection.seed.canonicalSha256,
  draft_sha256: projection.locales.en.draftBinding.canonicalSha256,
  reviewer: first.reviewer,
  source_reviews: sourceReviews,
  figure_checks: figureChecks,
  new_figure_reviews: [],
  question_reviews: questions,
  outcome: "pass"
};
const destination = path.join(own, "review.en.json");
fs.writeFileSync(destination, JSON.stringify(review, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({path: destination, sha256: hash(fs.readFileSync(destination)), outcome: review.outcome}));
