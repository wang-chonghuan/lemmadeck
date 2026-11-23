import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188";
const ownRel = ".intentfold/tickets/STEMROBIN-188/tmp/n35-choice-independent7";
const own = path.join(root, ownRel);
const candidateRel = ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices-rationale7";
const previousRel = ".intentfold/tickets/STEMROBIN-188/tmp/n35-choices-layout7";
const recoveryRel = "ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35/choice-rationale-repair7/recovery.json";
const reviewName = "review-affected7.json";
const receiptName = "native-validation-affected7.json";
const stdoutName = "native-validation-affected7.stdout.txt";
const stderrName = "native-validation-affected7.stderr.txt";
const summaryName = "affected-review7.md";
const oldHashes = {
  "SOURCE-FIRST.md": "da457315b2b8ab3e492291190a6cd706ee73e2b53100a6f235e735821cf3f7d9",
  "source-review.json": "1ad4b93563cfe1400d50b68c837d04e4fa1f0bc5d7dc4c73f74c420db8b05163",
  "VIEWS-FIRST.md": "1dc3b404fcdea94263085a3e34aebd7666f74490cf8ad7ec378ac8e6b8820745",
  "views-review.json": "d9a7e37b44349902a693e045b05c78b05e11d40f03988b4036232f50db850b2e",
  "review.json": "b3e6affb9e28a8eca5bc13683c8c3f40f2209029b11ce92c3f1dc46eed6cb4a1",
  "final-review7.md": "b9855712d2cac44c2faf744c29d2719a7ff5f01eb254c678fe614396baefc761",
  "native-validation7.json": "083fc79fca27f854bd4c8fa5404809653b33f521483ee4845d130c48435140da",
  "native-validation7.stdout.txt": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "native-validation7.stderr.txt": "ff8f4fb4f881df39ed71f4794f8749f44bc8ba11fd062d75fce831136a7652d9",
};

const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bytes = (relative) => fs.readFileSync(path.join(root, relative));
const read = (relative) => JSON.parse(bytes(relative).toString("utf8"));
const ascii = (text) => text.replace(/[\u007f-\uffff]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value !== null && typeof value === "object") {
    return "{" + Object.keys(value).sort().map((k) => ascii(JSON.stringify(k)) + ":" + canonical(value[k])).join(",") + "}";
  }
  return ascii(JSON.stringify(value));
}
const digest = (value) => sha(canonical(value));
const jsonText = (value) => ascii(JSON.stringify(value, null, 2)) + "\n";
const writeNew = (name, text) => fs.writeFileSync(path.join(own, name), text, { flag: "wx" });
const seal = (name) => fs.chmodSync(path.join(own, name), 0o444);
function verifyOld() {
  for (const [name, expected] of Object.entries(oldHashes)) {
    const file = path.join(own, name);
    assert.equal(sha(fs.readFileSync(file)), expected, name);
    assert.equal(fs.statSync(file).mode & 0o777, 0o444, name);
  }
}
function differences(a, b, location = "", result = []) {
  if (canonical(a) === canonical(b)) return result;
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    a.forEach((item, i) => differences(item, b[i], location + "/" + i, result));
  } else if (a && b && typeof a === "object" && typeof b === "object"
      && !Array.isArray(a) && !Array.isArray(b)) {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), location);
    for (const key of Object.keys(a)) differences(a[key], b[key], location + "/" + key, result);
  } else {
    result.push(location);
  }
  return result;
}

assert.equal(process.cwd(), root);
verifyOld();
for (const name of [reviewName, receiptName, stdoutName, stderrName, summaryName]) {
  assert.equal(fs.existsSync(path.join(own, name)), false, name);
}
const seed = read(candidateRel + "/seed.json");
const draft = read(candidateRel + "/draft.json");
const previous = read(previousRel + "/draft.json");
const prior = read(ownRel + "/review.json");
const priorReceipt = read(ownRel + "/native-validation7.json");
assert.deepEqual(seed, read(previousRel + "/seed.json"));
assert.equal(digest(seed), "c7406fb6a2c456510dac7847f734961a7b8011b1fd809006532f41dd4eed5eed");
assert.equal(sha(bytes(candidateRel + "/seed.json")), "697dd9887472f0302ec89f03460afb08438773a50eb616790b01f300522ff602");
assert.equal(digest(draft), "d830569a84f4f325fb2c34ad2bc078e78c1d753b603f340a2e11b3c95d5d2fc7");
assert.equal(sha(bytes(candidateRel + "/draft.json")), "5aad407a282514892e982e9b95bf028495f51386d50750223179f9e3d6821539");
assert.equal(digest(previous), prior.draft_sha256);
assert.equal(prior.outcome, "revise");
assert.equal(priorReceipt.exitCode, 3);
const changedFields = [
  "/questions/0/key/rationales/2/misconception",
  "/questions/0/key/rationales/3/derivation",
  "/questions/1/key/rationales/3/misconception",
];
assert.deepEqual(differences(previous, draft), changedFields);
const recovery = read(recoveryRel);
assert.equal(recovery.currentDraftSha256, sha(bytes(candidateRel + "/draft.json")));
assert.equal(recovery.sourceViewsKeysOptionTruthIntentsCoverageAndFiguresChanged, false);

const findings = [
  {
    question_id: "ray-groups", option_id: "C", field: "misconception", verdict: "pass",
    evidence: "The repaired wrong procedure independently labels upper-support rightward and lower-support leftward as positive. It therefore assigns AB,QB,DC,PC to the positive group and BA,QA,CD,PD to the negative group, exactly the option's two false groups and claimed opposition between them. Ignoring the same-side requirement makes sign-label agreement an invalid direction test; no supporting-boundary inference is needed.",
  },
  {
    question_id: "ray-groups", option_id: "D", field: "derivation", verdict: "pass",
    evidence: "The repair states that one ray contains the other for each same-group pair, not mutual containment. On the already sealed F-P-Q-E order, [FP) contains [PQ) contains [QE), while [EQ) contains [QP) contains [PF). No ray from either group contains a ray from the opposite group because their unbounded tails extend in opposite directions. This is the required pairwise nesting condition.",
  },
  {
    question_id: "origin-counts", option_id: "D", field: "misconception", verdict: "pass",
    evidence: "For every fixed M, including M=A and origins off the known support, the repaired mistaken restriction allows only the known orientation d and forbids -d. It consequently generates one same-direction ray and zero opposite-direction rays without assuming a common origin. When the origin is arbitrary, the stated procedure still counts distinct origins, giving infinitely many same-direction rays. Thus it generates all three displayed entries (1,0,infinite) on the unchanged domain.",
  },
];
const review = structuredClone(prior);
review.draft_sha256 = digest(draft);
for (const finding of findings) {
  const question = review.question_reviews.find((q) => q.question_id === finding.question_id);
  const check = question.mathematics.option_checks.find((o) => o.option_id === finding.option_id);
  const marker = " Author comparison: ";
  assert.equal(check.evidence.split(marker).length, 2);
  check.evidence = check.evidence.split(marker)[0] + marker + finding.evidence;
}
const oldSuffix = "a revise verdict here concerns the specifically documented rationale/misconception defects, not an altered key.";
for (const question of review.question_reviews) {
  if (!["ray-groups", "origin-counts"].includes(question.question_id)) continue;
  assert.equal(question.mathematics.verdict, "revise");
  assert.equal(question.mathematics.independent_solution.endsWith(oldSuffix), true);
  question.mathematics.independent_solution =
    question.mathematics.independent_solution.slice(0, -oldSuffix.length)
    + "the affected-only repair review resolves the documented internal explanation defects without altering any key, option truth, mathematical domain or sealed solution.";
  question.mathematics.verdict = "pass";
}
review.outcome = "pass";
const allowedReviewChanges = [
  "/draft_sha256",
  "/question_reviews/0/mathematics/verdict",
  "/question_reviews/0/mathematics/independent_solution",
  "/question_reviews/0/mathematics/option_checks/2/evidence",
  "/question_reviews/0/mathematics/option_checks/3/evidence",
  "/question_reviews/1/mathematics/verdict",
  "/question_reviews/1/mathematics/independent_solution",
  "/question_reviews/1/mathematics/option_checks/3/evidence",
  "/outcome",
];
assert.deepEqual(differences(prior, review), allowedReviewChanges);
let unchangedQuestions = 0;
let unchangedOptions = 0;
for (let i = 0; i < review.question_reviews.length; i++) {
  const q = review.question_reviews[i];
  if (canonical(q) === canonical(prior.question_reviews[i])) unchangedQuestions++;
  q.mathematics.option_checks.forEach((check, j) => {
    if (canonical(check) === canonical(prior.question_reviews[i].mathematics.option_checks[j])) unchangedOptions++;
  });
}
assert.equal(unchangedQuestions, 7);
assert.equal(unchangedOptions, 36);
writeNew(reviewName, jsonText(review));
seal(reviewName);

const argv = [
  "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
  "--repo", ".",
  "--seed", candidateRel + "/seed.json",
  "--draft", candidateRel + "/draft.json",
  "--review", ownRel + "/" + reviewName,
];
const counters = {
  ...priorReceipt.cumulative_counters,
  additional_images_in_affected_stage: 0,
  native_semantic_validator_invocations: 2,
  affected_native_semantic_validator_invocations: 1,
  affected_rationale_checks: 3,
  unchanged_rationale_records_reused: 36,
  unchanged_complete_question_reviews_reused: 7,
  author_rationale_derivation_check_events: 40,
  author_incorrect_option_misconception_check_events: 29,
  original_internal_findings: 3,
  resolved_internal_findings: 3,
  remaining_internal_findings: 0,
};
const receipt = {
  status: "prepared",
  argv, cwd: root, exitCode: null,
  receipt_prepared_at: new Date().toISOString(),
  receipt_and_streams_reserved_before_execution: true,
  native_validator_invocations_this_stage: 0,
  prior_native_exit_code: 3,
  prior_review_sha256: oldHashes["review.json"],
  prior_receipt_sha256: oldHashes["native-validation7.json"],
  review_outcome: review.outcome,
  seed_canonical_sha256: digest(seed),
  seed_bytes_sha256: sha(bytes(candidateRel + "/seed.json")),
  draft_canonical_sha256: digest(draft),
  draft_bytes_sha256: sha(bytes(candidateRel + "/draft.json")),
  review_canonical_sha256: digest(review),
  review_bytes_sha256: sha(bytes(ownRel + "/" + reviewName)),
  recovery_report: { path: path.join(root, recoveryRel), sha256: sha(bytes(recoveryRel)) },
  draft_changed_fields: changedFields,
  review_changed_fields: allowedReviewChanges,
  affected_findings: findings,
  affected_package_relationships: {
    verdict: "pass",
    evidence: "Exactly three internal explanation strings changed. Sources, all nine views, keys, option truths, intents, limitations, coverage and figures are identical to the previously reviewed snapshot. The repairs now justify or generate their own alternatives and introduce no learner-visible leakage, dependence, domain changes or capacity claims. Seven complete question records and 36 option records are carried forward identically; source and figure records are also identical.",
  },
  preserved_evidence_sha256: oldHashes,
  cumulative_counters: counters,
  stdout: { path: path.join(own, stdoutName), sha256: null, bytes: null },
  stderr: { path: path.join(own, stderrName), sha256: null, bytes: null },
};
const stdoutFd = fs.openSync(path.join(own, stdoutName), "wx");
const stderrFd = fs.openSync(path.join(own, stderrName), "wx");
writeNew(receiptName, jsonText(receipt));
receipt.started_at = new Date().toISOString();
const started = performance.now();
const result = spawnSync(argv[0], argv.slice(1), {
  cwd: root, stdio: ["ignore", stdoutFd, stderrFd],
});
fs.closeSync(stdoutFd);
fs.closeSync(stderrFd);
receipt.status = result.error ? "execution_error" : "completed";
receipt.exitCode = result.status;
receipt.signal = result.signal;
receipt.execution_error = result.error ? String(result.error) : null;
receipt.elapsed_seconds = Math.round((performance.now() - started) * 1000000) / 1000000000;
receipt.native_validator_invocations_this_stage = 1;
receipt.finished_at = new Date().toISOString();
for (const [key, name] of [["stdout", stdoutName], ["stderr", stderrName]]) {
  const stream = fs.readFileSync(path.join(own, name));
  receipt[key].sha256 = sha(stream);
  receipt[key].bytes = stream.length;
}
verifyOld();
assert.equal(digest(read(candidateRel + "/draft.json")), review.draft_sha256);
assert.equal(digest(read(candidateRel + "/seed.json")), review.seed_sha256);
fs.writeFileSync(path.join(own, receiptName), jsonText(receipt));
for (const name of [receiptName, stdoutName, stderrName]) seal(name);

const summary = `# N35 Affected Review 7

Verdict: **pass**. All three repaired internal explanations resolve the retained
findings. This is affected-only review, not a repeat of the passed mathematics.

- ray-groups D: pairwise one-way nesting replaces false mutual inclusion.
- ray-groups C: independently assigning upper-right/lower-left positive produces
  exactly the two displayed false groups and their mistaken sign-based opposition.
- origin-counts D: allowing only the known orientation at every fixed origin
  produces (1,0,infinite), including equal and off-support origins.

Exactly three draft explanation fields changed. Seven complete question reviews,
36 option records, all source/figure reviews, fidelity, redundancy, leakage,
coverage and production-loss judgments are carried forward identically.
No new source solving, key solving or images. No new package defect.
Original REVISE review, exit 3 and all source/views seals remain unchanged at 0444.

Seed canonical SHA-256: ${receipt.seed_canonical_sha256}
Draft canonical SHA-256: ${receipt.draft_canonical_sha256}
Draft byte SHA-256: ${receipt.draft_bytes_sha256}
Review canonical SHA-256: ${receipt.review_canonical_sha256}
Review byte SHA-256: ${receipt.review_bytes_sha256}
Recovery SHA-256: ${receipt.recovery_report.sha256}
Review: ${path.join(own, reviewName)}
Receipt: ${path.join(own, receiptName)}
Receipt and exclusive stdout/stderr paths were reserved before native execution.

Actual command: ${argv.join(" ")}
Actual cwd: ${root}
Actual native exit: ${receipt.exitCode}; affected runs 1; cumulative runs 2.
Native stdout: ${receipt.stdout.bytes} bytes, SHA-256 ${receipt.stdout.sha256}
Native stderr: ${receipt.stderr.bytes} bytes, SHA-256 ${receipt.stderr.sha256}
The native result checks structure/binding and declared review agreement;
the three explanation judgments above are substantive reviewer conclusions.

Cumulative: sources 10; views 9; options 39 (12 true/27 false); prior author keys
9, derivations 39 and misconceptions 27 retained. Added explanation checks:
1 derivation and 2 misconceptions; total events 40/29. Findings 3 resolved, 0 open.
Image opens 1/8 batch and 1/24 context; new opens/crops/reopens 0; browsers 0.
Prior launches 2, failed capture 1, screenshot 1. Prior cwd deviation 1, new 0.
Prepare reruns 0; authoring/DB/env/install/app/Git/worktree/chat/peer actions 0.
`;
writeNew(summaryName, summary);
seal(summaryName);
seal("native-review-affected-run7.mjs");
verifyOld();
console.log(JSON.stringify({
  verdict: review.outcome,
  native_exit_code: receipt.exitCode,
  stdout: fs.readFileSync(path.join(own, stdoutName), "utf8"),
  stderr: fs.readFileSync(path.join(own, stderrName), "utf8"),
  argv, cwd: root,
  files: [reviewName, summaryName, receiptName, stdoutName, stderrName, "native-review-affected-run7.mjs"].map((name) => ({
    path: path.join(own, name),
    sha256: sha(fs.readFileSync(path.join(own, name))),
    mode: (fs.statSync(path.join(own, name)).mode & 0o777).toString(8),
  })),
  counters,
}, null, 2));
