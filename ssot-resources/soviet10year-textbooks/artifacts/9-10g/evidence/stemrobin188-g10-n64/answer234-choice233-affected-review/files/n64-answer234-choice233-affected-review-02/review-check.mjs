import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-188/tmp");
const own = path.join(T, "n64-answer234-choice233-affected-review-02");
const intake = path.join(T, "n64-answer234-choice233-affected-02/review-inputs.json");
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const textHash = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const load = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const save = (name, value) => fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + "\n");
const inputs = load(intake);
const tool = path.join(R, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const prepare = path.join(R, ".agents/skills/ld-s10y-choice/scripts/prepare.py");
function canonical(value) {
  const sorted = (v) => Array.isArray(v) ? v.map(sorted) : v && typeof v === "object"
    ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sorted(v[k])])) : v;
  return JSON.stringify(sorted(value)).replace(/[\u007f-\uffff]/g, (c) =>
    "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}
const digest = (v) => textHash(canonical(v));
function diff(a, b, prefix = "") {
  if (Object.is(a, b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) =>
      diff(a[k], b[k], `${prefix}/${k}`));
  }
  return [{ path: prefix, before: a, after: b }];
}
function records() {
  const rows = Object.entries(inputs).filter(([, v]) => v && typeof v === "object" && v.path && v.sha256)
    .map(([role, v]) => ({ role: role === "currentAnswer" ? "currentCandidate" : role, path: v.path, expectedSha256: v.sha256 }));
  rows.push({ role: "intake", path: intake, expectedSha256: hash(intake) });
  for (const [role, p] of [["validateTool", tool], ["digestImplementation", prepare]]) rows.push({ role, path: p, expectedSha256: hash(p) });
  return rows;
}
if (process.argv[2] === "capture") {
  const before = records().map((r) => {
    assert.ok(path.isAbsolute(r.path));
    assert.equal(hash(r.path), r.expectedSha256, r.path);
    return { ...r, sha256Before: r.expectedSha256 };
  });
  save("input-bindings-before.json", { bindings: before });
  const oldAnswer = load(inputs.previousAnswer.path);
  const answer = load(inputs.currentAnswer.path);
  const oldDraft = load(inputs.previousDraft.path);
  const draft = load(inputs.currentDraft.path);
  const seed = load(inputs.seed.path);
  const source233 = seed.exercises.find((e) => e.number === "233");
  const question233 = draft.questions.find((q) => q.source_numbers.includes("233"));
  console.log(JSON.stringify({
    bindings: before.length,
    answerKeys: Object.keys(answer), answerDiff: diff(oldAnswer, answer),
    draftDiff: diff(oldDraft, draft),
    affectedSource233: source233,
    affectedQuestion233: { id: question233.id, view: question233.view, limitations: question233.intent.limitations },
    affectedCoverage233: draft.coverage.find((c) => c.source_number === "233"),
    affectedAnswer234: answer.answers.find((a) => a.exercise === "234"),
    seedDigest: digest(seed), oldDraftDigest: digest(oldDraft), currentDraftDigest: digest(draft),
    seedFigures: seed.figures.length, newFigures: draft.new_figures.length
  }, null, 2));
} else if (process.argv[2] === "author-review") {
  const before = load(path.join(own, "input-bindings-before.json"));
  const bindings = before.bindings.map((b) => {
    const sha256After = hash(b.path);
    assert.equal(sha256After, b.sha256Before, b.path);
    return { role: b.role, path: b.path, sha256Before: b.sha256Before, sha256After };
  });
  const oldAnswer = load(inputs.previousAnswer.path), answer = load(inputs.currentAnswer.path);
  const oldDraft = load(inputs.previousDraft.path), draft = load(inputs.currentDraft.path);
  const oldAR = load(inputs.previousAnswerReview.path), oldCR = load(inputs.previousChoiceReview.path);
  const seed = load(inputs.seed.path), repair = load(inputs.repair.path);
  const sourceFIRST = inputs.inheritedIndependentSourceFIRST;
  const optionFIRST = inputs.inheritedIndependentOptionFIRST;
  for (const p of [sourceFIRST.path, optionFIRST.path]) assert.equal(fs.statSync(p).mode & 0o7777, 0o444);
  assert.equal(oldAR.schema, "stemrobin188-n64-answer-review@1");
  assert.equal(oldAR.semanticContentResult, "PASS");
  assert.equal(oldAR.result, "HOLD");
  assert.equal(oldCR.outcome, "revise");
  assert.equal(oldCR.seed_sha256, digest(seed));
  assert.equal(oldCR.draft_sha256, digest(oldDraft));
  assert.equal(draft.seed_sha256, digest(seed));
  assert.equal(seed.figures.length, 0);
  assert.equal(draft.new_figures.length, 0);
  const answerDiff = diff(oldAnswer, answer), draftDiff = diff(oldDraft, draft);
  assert.deepEqual(answerDiff.map((d) => d.path), [
    "/answers/5/grading", "/answers/5/parts/0", "/answers/5/parts/1", "/answers/5/parts/2", "/answers/5/notes"
  ]);
  assert.deepEqual(draftDiff.map((d) => d.path), [
    "/questions/2/intent/limitations/3", "/coverage/4/omitted_tasks/2"
  ]);
  assert.equal(answer.answers.length, 7);
  assert.deepEqual(answer.answers.map((a) => a.exercise), oldAnswer.answers.map((a) => a.exercise));
  const rawAnswerTokens = (p) => [...fs.readFileSync(p, "utf8")
    .matchAll(/"displayAnswer"\s*:\s*("(?:[^"\\]|\\.)*")/g)].map((m) => m[1]);
  const oldTokens = rawAnswerTokens(inputs.previousAnswer.path);
  const newTokens = rawAnswerTokens(inputs.currentAnswer.path);
  assert.equal(oldTokens.length, 7);
  assert.deepEqual(newTokens, oldTokens, "raw serialized displayAnswer tokens byte-identical");
  const displayBindings = answer.answers.map((a, i) => {
    assert.equal(a.displayAnswer, oldAnswer.answers[i].displayAnswer);
    assert.equal(JSON.parse(newTokens[i]), a.displayAnswer);
    assert.equal(a.grading, "ungraded");
    assert.deepEqual(a.parts, []);
    const prior = oldAR.perExerciseEvidence.find((e) => e.exercise === a.exercise);
    assert.equal(prior.contentResult, "PASS");
    return { exercise: a.exercise, utf8Sha256Before: textHash(oldAnswer.answers[i].displayAnswer), utf8Sha256After: textHash(a.displayAnswer), rawJsonTokenSha256Before: textHash(oldTokens[i]), rawJsonTokenSha256After: textHash(newTokens[i]), bytesUnchanged: true, mathematicalPASS: "inherited" };
  });
  const repaired234 = answer.answers.find((a) => a.exercise === "234");
  assert.equal(oldAnswer.answers[5].exercise, "234");
  assert.equal(oldAnswer.answers[5].grading, "auto");
  assert.equal(oldAnswer.answers[5].parts.length, 3);
  assert.ok(repaired234.notes.startsWith(oldAnswer.answers[5].notes));
  assert.ok(repaired234.notes.includes("x=3"));
  assert.ok(repaired234.notes.includes("y=3"));
  assert.ok(repaired234.notes.includes("exact"));
  assert.equal(draft.questions.length, 6);
  assert.equal(draft.questions.reduce((n, q) => n + q.view.options.length, 0), 24);
  assert.deepEqual(draft.questions.map((q) => q.view), oldDraft.questions.map((q) => q.view));
  assert.deepEqual(draft.questions.map((q) => q.key), oldDraft.questions.map((q) => q.key));
  assert.ok(draft.questions.every((q) => q.view.mode === "single" && q.view.figure_ids.length === 0 && q.view.options.every((o) => o.figure_ids.length === 0)));
  const q233 = draft.questions.find((q) => q.source_numbers.includes("233"));
  const oldQ233 = oldDraft.questions.find((q) => q.id === q233.id);
  const coverage233 = draft.coverage.find((c) => c.source_number === "233");
  const oldCoverage233 = oldDraft.coverage.find((c) => c.source_number === "233");
  assert.equal(q233.id, "n64-contact-section-area");
  assert.equal(q233.intent.limitations.length, oldQ233.intent.limitations.length + 1);
  assert.deepEqual(q233.intent.limitations.slice(0, -1), oldQ233.intent.limitations);
  assert.equal(coverage233.omitted_tasks.length, oldCoverage233.omitted_tasks.length + 1);
  assert.deepEqual(coverage233.omitted_tasks.slice(0, -1), oldCoverage233.omitted_tasks);
  assert.ok(q233.intent.limitations.at(-1).includes("构造切平面"));
  assert.ok(q233.intent.limitations.at(-1).includes("直接给出切平面"));
  assert.ok(q233.intent.limitations.at(-1).includes("不自动判分"));
  assert.ok(coverage233.omitted_tasks.at(-1).includes("独立构造"));
  assert.ok(coverage233.omitted_tasks.at(-1).includes("直接给出"));
  assert.ok(seed.exercises.find((e) => e.number === "233").text.startsWith("习题\n作半径"));
  const original233 = answer.answers.find((a) => a.exercise === "233");
  assert.equal(original233.grading, "ungraded");
  assert.deepEqual(original233.parts, []);
  assert.deepEqual(original233, oldAnswer.answers.find((a) => a.exercise === "233"));
  assert.deepEqual(oldCR.figure_checks, []);
  assert.deepEqual(oldCR.new_figure_reviews, []);
  assert.equal(oldCR.question_reviews.length, 6);
  assert.equal(oldCR.question_reviews.reduce((n, q) => n + q.mathematics.option_checks.length, 0), 24);
  assert.ok(oldCR.question_reviews.every((q) => q.mathematics.verdict === "pass"));
  assert.equal(oldCR.source_reviews.find((s) => s.source_number === "233").coverage.verdict, "revise");
  assert.ok(oldCR.source_reviews.filter((s) => s.source_number !== "233").every((s) => s.coverage.verdict === "pass"));
  const identity = "Sole independent affected-only reviewer, STEMROBIN-188 SAME188-6; unchanged mathematics inherited from the sealed original independent review, not newly solved";
  const inheritedChoice = `Inherited unchanged mathematical/source/question PASS from ${inputs.previousChoiceReview.path} (sha256 ${inputs.previousChoiceReview.sha256}); source FIRST ${sourceFIRST.sha256}, option FIRST ${optionFIRST.sha256}. No new independent solution or option solving in this affected review. `;
  const inheritedAnswer = `Mathematical content PASS inherited from ${inputs.previousAnswerReview.path} (sha256 ${inputs.previousAnswerReview.sha256}), bound to unchanged displayAnswer bytes and sealed source FIRST ${sourceFIRST.sha256}; not newly solved. `;
  const choiceReview = structuredClone(oldCR);
  choiceReview.seed_sha256 = digest(seed);
  choiceReview.draft_sha256 = digest(draft);
  choiceReview.reviewer = { kind: "independent_agent", identity };
  for (const s of choiceReview.source_reviews) {
    s.independent_solution = inheritedChoice + s.independent_solution;
    if (s.source_number === "233") {
      s.coverage = {
        verdict: "pass",
        evidence: "Affected-only independent source-coverage check: seed 233 explicitly says to construct the sphere tangent plane before calculating the section area, while the unchanged view starts with a supplied tangent plane tau at A. The appended intent.limitations and coverage.omitted_tasks now explicitly name that replaced tangent-plane construction, not merely auxiliary-section construction. The unchanged original answer 233 remains ungraded with parts=[] and its complete construction displayAnswer byte-identical. This passes honest coverage of the area-recognition adaptation, not independent construction certification. Original source-233 coverage revise remains immutable in the preceding review. Formula, endpoint and source mathematics PASS are inherited from that original independent review, not newly solved here."
      };
    } else {
      s.coverage.evidence = inheritedChoice + s.coverage.evidence;
      if (s.source_number === "234") s.coverage.evidence += " The original answer's repaired snapshot now disables all automatic grading; the prior fixed-variable equation-engine HOLD remains unresolved and is not hidden behind exact matching.";
    }
  }
  for (const q of choiceReview.question_reviews) {
    for (const field of ["task_fidelity", "redundancy", "answer_leakage"]) q[field].evidence = inheritedChoice + q[field].evidence;
    q.mathematics.independent_solution = inheritedChoice + q.mathematics.independent_solution;
    for (const o of q.mathematics.option_checks) o.evidence = inheritedChoice + o.evidence;
    if (q.question_id === q233.id) q.task_fidelity.evidence += " Newly independently checked affected disclosure: both internal limitation lists explicitly distinguish the source tangent-plane construction from the supplied-plane area task and retain the ungraded written original. The view, four options, mathematical key, redundancy and leakage evidence are otherwise unchanged and inherited.";
  }
  choiceReview.outcome = "pass";
  save("review.json", choiceReview);
  const answerReview = structuredClone(oldAR);
  answerReview.reviewer = { kind: "independent_agent", identity };
  answerReview.result = "PASS";
  answerReview.scope = "Only the repaired current answer-key snapshot: exercise 234 automatic-grading removal and notes disclosure. All seven mathematical display-answer PASS results are inherited unchanged, not newly solved; no grading-engine repair or product/full-lesson approval.";
  answerReview.findings = [];
  answerReview.inheritedFindings = oldAR.findings;
  answerReview.originalReviewResult = oldAR.result;
  answerReview.originalReview = inputs.previousAnswerReview;
  answerReview.currentCandidate = bindings.find((b) => b.role === "currentCandidate");
  answerReview.inputBindings = Object.fromEntries(bindings.map((b) => [b.role, {
    path: b.path, sha256Before: b.sha256Before, sha256After: b.sha256After
  }]));
  answerReview.allInputBindings = bindings;
  answerReview.perExercise = answer.answers.map((a) => ({ exercise: a.exercise, result: "PASS" }));
  answerReview.perExerciseEvidence = oldAR.perExerciseEvidence.map((e) => {
    const row = structuredClone(e);
    row.result = "PASS";
    row.evidence = inheritedAnswer + e.evidence;
    row.mathematicalReview = "inherited-PASS-not-newly-solved";
    if (row.exercise === "234") {
      row.gradingReview = "Affected-only independent PASS for the current ungraded snapshot: grading changes from auto to ungraded and all three expression parts are removed; no replacement exact/numeric/expression keys exist. The original x=3 versus y=3 false-accept HOLD remains unresolved. The notes explicitly disclose whole-exercise automatic-grading loss, retain the three correct equations/nonzero multiples in the byte-identical displayAnswer, and reject exact-string masking.";
      row.expectedReview = "Current parts=[] contains no expected or judge fields and does not claim MathLive/equation-equivalence qualification. Old expected equations are historical evidence only; no checker or exact contract was rerun.";
      row.inheritedLocalProbe = row.localProbe;
      delete row.localProbe;
    } else {
      row.gradingReview = "Unchanged grading/parts PASS inherited from original independent review. " + e.gradingReview;
      row.expectedReview = "Unchanged expected-field review inherited. " + e.expectedReview;
    }
    return row;
  });
  answerReview.limitations = [...oldAR.limitations, {
    result: "CAPACITY_LOSS",
    scope: "Current 234 automatic equation grading removed",
    evidence: "All three prescribed-contact plane equations are display-only within an ungraded original task. No automated acceptance/rejection or equivalent-equation certification remains in the current candidate."
  }];
  answerReview.counts = { ...oldAR.counts, answerGatePass: 7, answerGateHold: 0, answerAuto: 0, answerUngraded: 7, inheritedMathematicalContentPASS: 7, inheritedOptionTruthPASS: 24, choiceSourceCoveragePass: 7, choiceSourceCoverageRevise: 0, imagesOpened: 0 };
  answerReview.originalEngineHOLD = {
    result: "HOLD", counterexample: "submitted x=3 accepted against expected y=3 (also 3*y=9)",
    engineFixed: false, cleared: false, probeRerun: false,
    originalReview: inputs.previousAnswerReview,
    currentMitigation: "234 is ungraded with parts=[]; no exact masking"
  };
  answerReview.displayAnswerBindings = displayBindings;
  answerReview.affectedChecks = { grading234Removed: true, allSevenDisplayAnswersByteIdentical: true, noReplacementExactKeys: true, original233ConstructionRetainedUngraded: true };
  answerReview.actualImagesOpened = 0;
  save("answer-review.json", answerReview);
  save("affected-check.receipt.json", {
    schema: "affected-answer-choice-check-receipt@1",
    command: [process.execPath, ...process.argv.slice(1)], cwd: process.cwd(),
    status: "pass", exitCode: 0, answerDiff, draftDiff,
    displayAnswerBindings: displayBindings,
    currentCanonicalDraftDigest: digest(draft),
    viewsByteLogicallyUnchanged: true, all24OptionKeysUnchanged: true,
    allNonAffectedFieldsUnchanged: true,
    originalMathematicsInherited: true, newMathSolves: 0, imagesOpened: 0,
    inputBindings: bindings
  });
  console.log(JSON.stringify({ status: "affected-checks-pass", answer234Ungraded: true, unchangedDisplayAnswers: 7, unchangedViews: 6, unchangedOptions: 24, currentCanonicalDraftDigest: digest(draft), reviewOutcome: choiceReview.outcome, imagesOpened: 0 }, null, 2));
} else if (process.argv[2] === "validate") {
  const receipt = path.join(own, "choice-native-validation.receipt.json");
  assert.ok(!fs.existsSync(receipt), "Exactly one review-aware native validation permitted");
  const before = load(path.join(own, "input-bindings-before.json"));
  for (const b of before.bindings) assert.equal(hash(b.path), b.sha256Before, b.path);
  const reviewPath = path.join(own, "review.json");
  const args = ["-B", tool, "--repo", R, "--seed", inputs.seed.path, "--draft", inputs.currentDraft.path, "--review", reviewPath];
  const result = spawnSync("python3", args, { cwd: R, encoding: "utf8" });
  save("choice-native-validation.receipt.json", {
    schema: "affected-choice-native-validation-receipt@1",
    command: ["python3", ...args], cwd: R,
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
    reviewAwareCalls: 1, draftOnlyValidationCalls: 0,
    seed: inputs.seed, draft: inputs.currentDraft,
    review: { path: reviewPath, sha256: hash(reviewPath) },
    tool: { path: tool, sha256: hash(tool) },
    imagesOpened: 0, semanticProofAutomaticallyEstablished: false
  });
  console.log(JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2));
} else if (process.argv[2] === "report") {
  const before = load(path.join(own, "input-bindings-before.json"));
  const bindings = before.bindings.map((b) => {
    const after = hash(b.path);
    assert.equal(after, b.sha256Before, b.path);
    return { role: b.role, path: b.path, sha256Before: b.sha256Before, sha256After: after };
  });
  const checked = load(path.join(own, "affected-check.receipt.json"));
  const native = load(path.join(own, "choice-native-validation.receipt.json"));
  const answerReview = load(path.join(own, "answer-review.json"));
  const review = load(path.join(own, "review.json"));
  assert.equal(hash(path.join(own, "review.json")), native.review.sha256);
  assert.equal(native.reviewAwareCalls, 1);
  assert.equal(native.draftOnlyValidationCalls, 0);
  assert.equal(review.draft_sha256, digest(load(inputs.currentDraft.path)));
  assert.equal(answerReview.inputBindings.currentCandidate.sha256Before, inputs.currentAnswer.sha256);
  assert.equal(answerReview.inputBindings.currentCandidate.sha256After, inputs.currentAnswer.sha256);
  const status = native.exitCode === 0 && review.outcome === "pass" && answerReview.result === "PASS" ? "pass" : "fail";
  save("input-bindings-after.json", { bindings, allUnchanged: true });
  save("report.json", {
    schema: "stemrobin188-n64-answer234-choice233-affected-review@1",
    status, findings: status === "pass" ? [] : [{ scope: "one review-aware native validation", exitCode: native.exitCode, stdout: native.stdout, stderr: native.stderr }],
    scope: "Current repaired snapshots only: answer234 grading/parts/notes and choice233 intent.limitations/coverage.omitted_tasks. Seven source mathematical solutions and all 24 option truths/keys remain inherited PASS; no fresh solving, figure/source image review, original 232 ambiguity resolution or whole-package mathematical rereview.",
    reviewer: review.reviewer,
    currentAnswer: inputs.currentAnswer, currentDraft: inputs.currentDraft,
    currentCanonicalDraftDigest: review.draft_sha256,
    originalAnswerDiff: checked.answerDiff,
    originalChoiceDiff: checked.draftDiff,
    normalizedChangedFieldScope: ["answer234.grading", "answer234.parts", "answer234.notes", "choice233.intent.limitations", "coverage233.omitted_tasks"],
    displayAnswerBindings: checked.displayAnswerBindings,
    answer234AffectedObservation: "Only 234 changes from auto to ungraded, removes its three expression parts and appends the engine-counterexample/capacity-loss note. All seven serialized displayAnswer tokens and decoded UTF-8 values are byte-identical. All seven answers are now ungraded; no exact substitute or automatic keys remain. Current snapshot PASS is safe non-grading qualification, not an engine reliability PASS.",
    choice233AffectedObservation: "Seed 233 begins by asking to construct a sphere tangent plane. Its unchanged visible view supplies tau at A instead. The appended limitation and omitted-task entry now name this exact construction loss and explicitly retain the unchanged ungraded original construction/display answer. Recognition of section area is approved only as the declared reduced-capacity adaptation, not as proof of independent tangent-plane construction.",
    unchanged: { sevenDisplayAnswers: true, sixViews: true, twentyFourOptionsAndKeys: true, allOtherCandidateFields: true, seed: true, original233UngradedTask: true },
    inheritedEvidence: {
      sourceFIRST: inputs.inheritedIndependentSourceFIRST,
      optionFIRST: inputs.inheritedIndependentOptionFIRST,
      originalAnswerReview: inputs.previousAnswerReview,
      originalChoiceReview: inputs.previousChoiceReview,
      mathematicalSourcePASSInherited: 7, optionPASSInherited: 24,
      newlySolvedSourceTasks: 0, newlySolvedOptions: 0
    },
    originalEngineHOLD: answerReview.originalEngineHOLD,
    original232UniqueDistanceHOLD: { result: "HOLD", cleared: false, evidence: "Inherited unconditioned center-region ambiguity. The conditional choice/source mathematical PASS remains separate and is not a resolution of the original unique-distance request." },
    inheritedLimitationsAndProcedureHOLDs: load(inputs.previousAnswerReview.path).limitations,
    originalChoiceRevise: { ...inputs.previousChoiceReview, outcome: "revise", originalRecordUnmodified: true, clearedOrErased: false, currentAffectedDisclosureNowPass: true },
    originalAnswerHOLD: { ...inputs.previousAnswerReview, result: "HOLD", originalRecordUnmodified: true, engineHOLDCleared: false, currentUngradedSnapshotNowPass: true },
    capacityLosses: ["234: no automatic grading of any of the three plane equations; display and manual completion only.", "233 choice: tangent plane is supplied, so independent construction is not assessed; original ungraded construction task remains."],
    actualImagesOpened: 0, sourceImagesOpened: 0, figure96Opened: false,
    nativeReviewValidation: { path: path.join(own, "choice-native-validation.receipt.json"), sha256: hash(path.join(own, "choice-native-validation.receipt.json")), exitCode: native.exitCode, calls: 1, structuralOnly: true },
    affectedCheckReceipt: { path: path.join(own, "affected-check.receipt.json"), sha256: hash(path.join(own, "affected-check.receipt.json")) },
    inputBindings: bindings,
    offlineLimitation: "Offline field-diff/disclosure review and one review-aware native structural validation. All unrelated scientific, glyph, source, MathLive, product and publication qualifications remain as inherited; no new gate is demanded for passed unchanged mathematics.",
    wholeLessonApproved: false, productApproved: false, published: false,
    prohibitionCompliance: { writeRoot: own, parentCandidatesEdited: false, originalReviewsEdited: false, newImages: 0, appOrSkillChanges: 0, otherLessonSourcesRead: false, fullMathRereviews: 0, noReviewValidationCalls: 0, finalizeCalls: 0, publishers: 0, DBCalls: 0, envReads: 0, GitOrPlaneCalls: 0, networkCalls: 0, paidCalls: 0, installs: 0, subagentsOrOtherChats: 0 },
    reviewedAt: new Date().toISOString()
  });
  console.log(JSON.stringify({ status, nativeExitCode: native.exitCode, currentAnswerReview: answerReview.result, currentChoiceReview: review.outcome, inputBindings: bindings.length, imagesOpened: 0 }, null, 2));
} else if (process.argv[2] === "index") {
  const outputs = fs.readdirSync(own).filter((n) => n !== "output-index.json").sort().map((name) => {
    const p = path.join(own, name), st = fs.statSync(p);
    assert.ok(st.isFile());
    return { path: p, sha256: hash(p), bytes: st.size, mode: (st.mode & 0o7777).toString(8).padStart(4, "0") };
  });
  save("output-index.json", { outputs });
  console.log(JSON.stringify(["report.json", "output-index.json"].map((n) => ({ path: path.join(own, n), sha256: hash(path.join(own, n)) })), null, 2));
} else {
  throw new Error("Expected capture, author-review, validate, report or index");
}
