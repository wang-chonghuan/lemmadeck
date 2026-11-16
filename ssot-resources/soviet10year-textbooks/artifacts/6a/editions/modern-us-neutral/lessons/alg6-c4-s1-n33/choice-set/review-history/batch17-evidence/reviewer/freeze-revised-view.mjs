import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const dir = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-6a-n33";
const viewPath = ".intentfold/tickets/STEMROBIN-182/tmp/6a-n33/view.json";
const digest = (data) => crypto.createHash("sha256").update(data).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const viewBytes = fs.readFileSync(viewPath);
const view = JSON.parse(viewBytes);
const prior = load(`${dir}/view-checks.json`);
const sourcePath = `${dir}/source-solutions.json`;
assert.equal(digest(fs.readFileSync(sourcePath)), prior.inputs.source_baseline_frozen_before_opening_view.byte_sha256);
assert.deepEqual(Object.keys(view), ["questions"]);
assert.equal(view.questions.length, 10);
assert.equal(view.questions.reduce((n, q) => n + q.view.options.length, 0), 31);
for (const q of view.questions) assert.deepEqual(Object.keys(q).sort(), ["id", "source_numbers", "view"]);
const reconstructedOldView = structuredClone(view);
const question = reconstructedOldView.questions.find((q) => q.id === "four-normalized-scientific-power-values");
const revisedC = question.view.options.find((option) => option.id === "C").text;
question.view.options.find((option) => option.id === "C").text =
  "$2.7\\cdot10^5;\\ 2.89\\cdot10^3;\\ 3.249\\cdot10^5;\\ 5.12\\cdot10^4$。";
const reconstructedBytes = JSON.stringify(reconstructedOldView, null, 2) + "\n";
assert.equal(digest(reconstructedBytes), prior.inputs.view.byte_sha256,
  "The current pure view differs beyond the stated single C text change.");
const unit = load(`${dir}/scientific-unit-revised.json`);
const result = structuredClone(prior);
result.stage = "revised_pure_view_frozen_before_author_internals";
result.inputs.view.byte_sha256 = digest(viewBytes);
result.lessons[0].question_reviews = result.lessons[0].question_reviews.map((q) =>
  q.question_id === unit.question_id ? unit : q);
const cov = result.source_coverage.find((s) => s.source_number === "595");
cov.coverage = {
  verdict: "pass",
  evidence: "All four source inputs retained. Revised C independently varies every correctly precomputed normalized coefficient through the coherent unpowered-coefficient procedure. A still varies the exponent rule. All coefficient and exponent targets are assessable; original calculations need not be rewritten independently in a choice response.",
};
cov.production_losses = ["Four independent written coefficient powers, scientific-notation normalization and explanations are replaced by complete-result recognition; no invariant correct coefficient vector remains."];
cov.unrepresented_source_tasks = [];
result.package_relationships.verdict = "pass";
result.package_relationships.evidence =
  "Mechanical reconstruction of the previous complete pure view, replacing only revised595 option C text with its old value, reproduces the exact prior byte SHA. Therefore other nine questions plus595 stem/A/B/order/mode/IDs are byte-identical in the formatted projection. Source evidence unchanged. Fresh595 pass resolves the local within-unit coefficient leakage; unchanged cross-question relations and all other independent truths are reused, not re-solved.";
result.findings = [];
result.resolved_findings = [{
  prior_record: `${dir}/view-checks.json`,
  question_id: unit.question_id,
  finding: "all-alternative fixed correct coefficient vector",
  resolution: "Only C now varies all four coefficient targets with an exact wrong procedure.",
}];
result.counts.visible_question_revise = 0;
result.outcome = "pass";
result.revision = {
  prior_view_sha256: prior.inputs.view.byte_sha256,
  revised_view_sha256: digest(viewBytes),
  exact_single_changed_path: "questions[3].view.options[2].text",
  before: question.view.options[2].text,
  after: revisedC,
  reconstructed_prior_view_sha256: digest(reconstructedBytes),
  unchanged_questions_reused: 9,
  fresh_options_checked: 3,
  internals_read_before_freeze: false,
};
result.notes.push("Only revised595 pure view was substantively rechecked. The prior rejected view review remains unchanged. Author internal comparison is a subsequent newly authorized stage.");
fs.writeFileSync(`${dir}/view-checks-revised.json`, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  outcome: result.outcome,
  path: `${dir}/view-checks-revised.json`,
  sha256: digest(fs.readFileSync(`${dir}/view-checks-revised.json`)),
  exact_changed_path: result.revision.exact_single_changed_path,
  source_unchanged: true,
}, null, 2));
