import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const own = `${root}/.tmp/s10y-choice/batch013-independent34`;
const author = ".tmp/s10y-choice/batch013-author3435";
const load = (p) => JSON.parse(fs.readFileSync(`${root}/${p}`, "utf8"));
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const fileSha = (p) => sha(fs.readFileSync(`${root}/${p}`));
const sort = (v) => Array.isArray(v) ? v.map(sort) :
  v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort(v[k])])) : v;
const digest = (v) => sha(JSON.stringify(sort(v)).replace(/[\u007f-\uffff]/g,
  (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`));
const reviewPath = ".tmp/s10y-choice/batch013-independent34/review.json";
const answerReportPath = ".tmp/s10y-choice/batch013-independent34/answerGate-review.json";
const review = load(reviewPath);
const answerReport = load(answerReportPath);
const seed = load(`${author}/n34.seed.json`);
const draft = load(`${author}/n34.draft.json`);
assert.equal(digest(seed), review.seed_sha256, "Seed changed after blind review");
assert.equal(digest(draft), review.draft_sha256, "Draft changed after view-only review");
for (const binding of [answerReport.answer_keys, ...answerReport.input_bindings]) {
  assert.equal(fileSha(binding.path), binding.file_sha256, `Reviewed input changed: ${binding.path}`);
}
for (const p of answerReport.source_capture.pages) {
  assert.equal(fileSha(p.opened_path), p.image_sha256);
  const pagePath = `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${String(p.physical_page).padStart(4, "0")}/page.json`;
  assert.equal(fileSha(pagePath), p.page_json_sha256);
  const page = load(pagePath);
  assert.equal(page.meta.render.sha256, p.image_sha256);
  assert.equal(page.meta.printed_page, p.printed_page);
}
for (const f of answerReport.figureEvidence) {
  for (const [p, hash] of [
    [f.modern_svg_path, f.modern_svg_sha256], [f.spec_path, f.spec_sha256],
    [f.opened_modern_preview, f.preview_sha256], [f.opened_source_path, f.source_sha256],
    [f.preview_svg_path, f.modern_svg_sha256], [f.preview_spec_path, f.spec_sha256]
  ]) assert.equal(fileSha(p), hash, `Figure evidence changed: ${p}`);
}
assert.equal(fs.existsSync(`${root}/ssot-resources/soviet10year-textbooks/artifacts/9-10g/answers.json`), false);
const answers = load(answerReport.answer_keys.path);
const exercises = load(answerReport.input_bindings[0].path);
assert.equal(answers.answers.length, 14);
assert.equal(exercises.exercises.length, 14);
assert.deepEqual(answers.answers.map((a) => a.exercise), exercises.exercises.map((e) => e.number));
assert.deepEqual(answerReport.exercise_reviews.map((a) => a.exercise), answers.answers.map((a) => a.exercise));
assert(answers.answers.every((a) => a.source === "derived"));
assert.equal(answers.answers.filter((a) => a.bookRaw).length, 1);
const printed313 = exercises.exercises.find((e) => e.number === "313").source_text;
assert.equal(answers.answers.find((a) => a.exercise === "313").bookRaw,
  printed313.slice(printed313.indexOf("解.")));
assert.equal(answers.answers.reduce((n, a) => n + a.parts.length, 0), 7);
assert(answers.answers.filter((a) => a.grading === "ungraded").every((a) => a.parts.length === 0));

const command = [
  ".agents/skills/ld-s10y-choice/scripts/validate.py", "--repo", ".",
  "--seed", `${author}/n34.seed.json`, "--draft", `${author}/n34.draft.json`,
  "--review", reviewPath
];
const validation = spawnSync("python3", command, {
  cwd: root, encoding: "utf8", env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"}
});
const receipt = {
  command: ["python3", ...command], workdir: root, exit_code: validation.status,
  stdout: validation.stdout, stderr: validation.stderr,
  outcome: review.outcome, expected_exit_code: 3,
  explanation: "One combined mandated seed/draft/review validator invocation. Exit 3 means structurally valid, fresh, hash-bound artifacts with a nonpassing substantive review; not a tool error and not approval.",
  real_mathlive_computeengine_or_answer_finalize_run: false
};
fs.writeFileSync(`${own}/validation-receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`, {flag: "wx"});
assert.equal(validation.status, 3);
assert.match(validation.stderr, /mechanical checks passed; semantic review outcome: revise/);
assert.equal(digest(load(`${author}/n34.seed.json`)), review.seed_sha256);
assert.equal(digest(load(`${author}/n34.draft.json`)), review.draft_sha256);
assert.equal(fileSha(answerReport.answer_keys.path), answerReport.answer_keys.file_sha256);
const result = {
  ticket: "Same184-3",
  lesson: "geo910-c1-s3-n34",
  checked_at: new Date().toISOString(),
  workdir: root,
  choice: {
    status: "revise",
    seed_path: `${author}/n34.seed.json`, seed_sha256: review.seed_sha256,
    draft_path: `${author}/n34.draft.json`, draft_sha256: review.draft_sha256,
    review_path: reviewPath, review_sha256: digest(review), review_file_sha256: fileSha(reviewPath),
    seed_count: 13, questions: 16, independently_checked_options: 64,
    complete_313_excluded_from_seeds_and_concepts: true,
    validation_exit_code: validation.status,
    finding: "q320's stem discloses the complete two-sided offset-plane locus requested by q319, allowing q319 option D to be obtained by package copying. Both q319/q320 redundancy and cross-question answer-leakage checks require revision.",
    mathematics: "All 16 complete true sets, all 64 option truth judgments and all stated author distractor procedures checked; no mathematics disagreement.",
    affected_followup: ["q319", "q320", "their source coverage and cross-question relationships"],
    first_review_preserved: true
  },
  answerGate: {
    status: "pass-substantive-only",
    report_path: answerReportPath,
    report_sha256: digest(answerReport), report_file_sha256: fileSha(answerReportPath),
    answer_keys_path: answerReport.answer_keys.path,
    answer_keys_file_sha256: answerReport.answer_keys.file_sha256,
    answer_keys_canonical_sha256: digest(answers),
    reviewed_exercises: 14, auto_parts: 7,
    findings: [],
    concrete_high_risk_checks: [
      "313 complete printed cross-page solution and actual fig127 modern/raw/spec: circumradius 2sqrt(3) cm, height 2 cm.",
      "317 both same-side and opposite-side projection distances retained, capital C length parameter preserved.",
      "323 16 cm unit conversion, m=n nonuniqueness, c=0 perpendicular case, and feasibility lower-bound equality allowing one zero projection all retained; ungraded classification prevents false deterministic grading."
    ],
    limitation: "Real MathLive/ComputeEngine and answer finalization deliberately not run; current durable answer status is draft, not a ready/published artifact."
  },
  images_loaded: 7,
  parent_image_payloads: false,
  writes: "Only .tmp/s10y-choice/batch013-independent34/",
  forbidden_operations_performed: [],
  first_review_policy: "No draft/answer/source repair by reviewer; keep first reviews and do affected-only follow-up only after an actual author repair."
};
fs.writeFileSync(`${own}/report.json`, `${JSON.stringify(result, null, 2)}\n`, {flag: "wx"});
console.log(JSON.stringify(result, null, 2));
