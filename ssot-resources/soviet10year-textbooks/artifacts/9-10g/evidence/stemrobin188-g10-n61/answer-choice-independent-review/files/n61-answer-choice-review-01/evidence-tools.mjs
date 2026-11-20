import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scope = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scope, "../../../../..");
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const canonical = (v) => {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v).sort().map((k) => `${canonical(k)}:${canonical(v[k])}`).join(",")}}`;
  }
  return JSON.stringify(v).replace(/[\u007f-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const digest = (p) => crypto.createHash("sha256").update(canonical(JSON.parse(fs.readFileSync(p, "utf8")))).digest("hex");
const scoped = (name) => {
  const p = path.resolve(scope, name);
  if (!p.startsWith(`${scope}${path.sep}`)) throw new Error("Write outside review scope refused");
  return p;
};
const writeNew = (name, value) => fs.writeFileSync(scoped(name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { cwd: repo, encoding: "utf8", ...options });
  return { command: [command, ...args], exitCode: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "", error: result.error?.message ?? null };
};
const [mode, ...args] = process.argv.slice(2);
if (mode === "seal") {
  const p = scoped(args[0]);
  const hashBefore = sha(p);
  const chmod = run("chmod", ["0444", p]);
  const stat = run("stat", ["-f", "%N %Sp %OLp %z %m", p]);
  const hash = run("shasum", ["-a", "256", p]);
  const s = fs.statSync(p);
  if (chmod.exitCode !== 0 || stat.exitCode !== 0 || hash.exitCode !== 0 || (s.mode & 0o777) !== 0o444 || hashBefore !== sha(p)) throw new Error("Seal failed");
  writeNew(`${args[0]}.seal.json`, { path: p, sealedAt: new Date().toISOString(), sha256Before: hashBefore, sha256After: sha(p), bytes: s.size, mode: "0444", chmod, stat, hash });
  console.log(JSON.stringify({ path: p, sha256: sha(p), bytes: s.size, mode: "0444" }));
} else if (mode === "fingerprint") {
  console.log(JSON.stringify(args.map((p) => ({ path: path.resolve(repo, p), sha256: sha(path.resolve(repo, p)), canonicalSha256: p.endsWith(".json") ? digest(path.resolve(repo, p)) : null })), null, 2));
} else if (mode === "bind-before") {
  const manifestPath = path.resolve(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-answer-choice-review-inputs-01/manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const inputs = [...manifest.inputs.map((item) => ({ path: item.path, declaredSha256: item.sha256 })), { path: manifestPath, declaredSha256: null }];
  const bindings = inputs.map((item) => {
    const actual = sha(item.path);
    if (item.declaredSha256 && actual !== item.declaredSha256) throw new Error(`Input differs from manifest: ${item.path}`);
    return { ...item, sha256Before: actual, bytesBefore: fs.statSync(item.path).size };
  });
  writeNew("input-bindings.before.json", { recordedAt: new Date().toISOString(), inputs: bindings });
  console.log(JSON.stringify({ inputCount: bindings.length, allDeclaredHashesMatch: true, seedCanonical: digest(manifest.seed.path), draftCanonical: digest(manifest.draftKeyLast.path) }));
} else if (mode === "compose") {
  const readOwn = (name) => JSON.parse(fs.readFileSync(scoped(name), "utf8"));
  const source = readOwn("source-independent.FIRST.json");
  const visible = readOwn("visible-independent.FIRST.json");
  const comparison = readOwn("author-comparison.json");
  const before = readOwn("input-bindings.before.json");
  for (const [name, expected] of [
    ["source-independent.FIRST.json", comparison.comparisonReceipt.sourceFIRSTSha256],
    ["visible-independent.FIRST.json", comparison.comparisonReceipt.visibleFIRSTSha256]
  ]) {
    if (sha(scoped(name)) !== expected || (fs.statSync(scoped(name)).mode & 0o777) !== 0o444) throw new Error(`FIRST seal changed: ${name}`);
  }
  const inputBindings = before.inputs.map((item) => ({ path: item.path, sha256Before: item.sha256Before, sha256After: sha(item.path) }));
  if (inputBindings.some((item) => item.sha256Before !== item.sha256After)) throw new Error("An author/source input changed during review");
  const manifest = JSON.parse(fs.readFileSync(inputBindings.find((item) => item.path.endsWith("/manifest.json")).path, "utf8"));
  const draft = JSON.parse(fs.readFileSync(manifest.draftKeyLast.path, "utf8"));
  const question_reviews = structuredClone(visible.question_reviews);
  for (const q of question_reviews) {
    const c = comparison.questionComparisons.find((item) => item.question_id === q.question_id);
    if (!c || Object.keys(c.rationaleChecks).length !== q.mathematics.option_checks.length) throw new Error(`Incomplete rationale comparison: ${q.question_id}`);
    q.task_fidelity.evidence += ` Key-last capacity comparison: ${c.capacityEvidence}`;
    for (const option of q.mathematics.option_checks) {
      if (c.finalOptionEvidenceOverrides?.[option.option_id]) option.evidence = c.finalOptionEvidenceOverrides[option.option_id];
      option.evidence += ` Key-last author-rationale check: ${c.rationaleChecks[option.option_id]}`;
    }
  }
  const source_reviews = source.source_reviews.map((s) => {
    const coverage = comparison.sourceCoverage.find((c) => c.source_number === s.source_number);
    if (!coverage) throw new Error(`Missing source coverage: ${s.source_number}`);
    return { source_number: s.source_number, independent_solution: `${s.independent_solution} Conditions: ${s.conditions}`, coverage: { verdict: coverage.verdict, evidence: coverage.evidence } };
  });
  const verdicts = [
    ...source_reviews.map((s) => s.coverage.verdict),
    ...question_reviews.flatMap((q) => [q.task_fidelity.verdict, q.redundancy.verdict, q.answer_leakage.verdict, q.mathematics.verdict])
  ];
  const outcome = verdicts.includes("blocked") ? "blocked" : verdicts.includes("revise") ? "revise" : "pass";
  if (outcome !== comparison.choiceOutcome || draft.new_figures.length !== 0) throw new Error("Comparison outcome or figure inventory changed");
  const review = {
    schema: "s10y-choice-review-v1",
    seed_sha256: digest(manifest.seed.path),
    draft_sha256: digest(manifest.draftKeyLast.path),
    reviewer: { kind: "independent_agent", identity: "SAME188-6 N61 independent answer/choice reviewer 01; separate from both authors; source-first and visible-first evidence sealed before key disclosure" },
    source_reviews,
    figure_checks: [{
      figure_id: "fig-g10-88",
      asset_path: "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-88.svg",
      asset_sha256: "a33b85f2bfb60e4ad989fca2fd686cdf5fcb60fb1126dfa798ab2e678fb73046",
      observation: `${source.imageObservations[0].observation} Original actually opened: ${source.imageObservations[0].path}, sha256 ${source.imageObservations[0].sha256}. Current actual raster opened: ${source.imageObservations[1].path}, sha256 ${source.imageObservations[1].sha256}; bound to the current seed SVG above and corroborated by the key-last answer-author figureEvidence.render provenance. ${source.imageObservations[1].observation} No new figure is approved here and the already passed figure-production gate is not rerun.`
    }],
    new_figure_reviews: [],
    question_reviews,
    outcome
  };
  writeNew("review.json", review);
  const actualAnswers = JSON.parse(fs.readFileSync(manifest.answersKeyLast.path, "utf8"));
  const counts = {
    exercises: actualAnswers.answers.length,
    auto: actualAnswers.answers.filter((a) => a.grading === "auto").length,
    ungraded: actualAnswers.answers.filter((a) => a.grading === "ungraded").length,
    ungradedExercises: actualAnswers.answers.filter((a) => a.grading === "ungraded").map((a) => a.exercise),
    parts: actualAnswers.answers.reduce((n, a) => n + a.parts.length, 0),
    expected: actualAnswers.answers.reduce((n, a) => n + a.parts.reduce((m, p) => m + p.expected.length, 0), 0),
    numericExpected: actualAnswers.answers.reduce((n, a) => n + a.parts.filter((p) => p.judge === "numeric").reduce((m, p) => m + p.expected.length, 0), 0),
    expressionExpected: actualAnswers.answers.reduce((n, a) => n + a.parts.filter((p) => p.judge === "expression").reduce((m, p) => m + p.expected.length, 0), 0),
    exactExpected: actualAnswers.answers.reduce((n, a) => n + a.parts.filter((p) => p.judge === "exact").reduce((m, p) => m + p.expected.length, 0), 0)
  };
  if (JSON.stringify(counts) !== JSON.stringify(comparison.answerReview.coverageCounts)) throw new Error("Answer inventory mismatch");
  const answer = {
    ...comparison.answerReview,
    reviewer: { kind: "independent_agent", identity: review.reviewer.identity },
    inputBindings,
    inputSnapshotConfirmedUnchanged: true,
    sealedIndependentEvidence: {
      source: { path: scoped("source-independent.FIRST.json"), sha256: sha(scoped("source-independent.FIRST.json")), mode: "0444" },
      visible: { path: scoped("visible-independent.FIRST.json"), sha256: sha(scoped("visible-independent.FIRST.json")), mode: "0444" }
    },
    validationReceipt: scoped("validation.json"),
    validationInterpretation: "Choice validation is run exactly once after both reports are produced. Its actual command/exit/stdout/stderr will be in validation.json; choice mechanical pass does not override this answer FAIL."
  };
  writeNew("answer-review.json", answer);
  writeNew("input-bindings.after.json", { recordedAt: new Date().toISOString(), inputs: inputBindings });
  console.log(JSON.stringify({ answerResult: answer.result, choiceOutcome: review.outcome, questionCount: question_reviews.length, optionCount: question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0), counts, allInputsUnchanged: true }, null, 2));
} else if (mode === "validate-once") {
  const receipt = scoped("validation.json");
  if (fs.existsSync(receipt)) throw new Error("Validation has already been recorded; rerun refused");
  const result = run("python3", [
    path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py"),
    "--repo", repo, "--seed", args[0], "--draft", args[1], "--review", scoped("review.json")
  ], { env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" } });
  writeNew("validation.json", { startedFrom: repo, recordedAt: new Date().toISOString(), invocationCount: 1, ...result, commandString: result.command.join(" "), interpretation: "Mechanical contract result only; substantive mathematical and fidelity verdicts are in review.json and answer-review.json." });
  console.log(JSON.stringify(result, null, 2));
} else if (mode === "index") {
  const outputs = [];
  for (const name of fs.readdirSync(scope).sort()) {
    if (name === "output-index.json") continue;
    const p = scoped(name);
    const s = fs.statSync(p);
    if (!s.isFile()) throw new Error(`Unexpected directory: ${p}`);
    outputs.push({ path: p, sha256: sha(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, "0") });
  }
  writeNew("output-index.json", { schema: "n61-review-output-index@1", outputs });
  console.log(JSON.stringify({ path: scoped("output-index.json"), sha256: sha(scoped("output-index.json")), outputs: outputs.length }));
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
