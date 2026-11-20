import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scope = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(scope, "../../../../..");
const priorRoot = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-answer-choice-review-01");
const manifestPath = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n61-answer215-affected-02/review-inputs.json");
const hash = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const own = (name) => {
  const p = path.resolve(scope, name);
  assert.equal(path.dirname(p), scope);
  return p;
};
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeNew = (name, value) => fs.writeFileSync(own(name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const command = (cmd, args) => {
  const result = spawnSync(cmd, args, { cwd: repo, encoding: "utf8" });
  return { command: [cmd, ...args], exitCode: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "", error: result.error?.message ?? null };
};
const diff = (a, b, pointer = "") => {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((key) => diff(a[key], b[key], `${pointer}/${key}`));
  }
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    return a.flatMap((value, i) => diff(value, b[i], `${pointer}/${i}`));
  }
  return [pointer || "/"];
};

const [mode, ...args] = process.argv.slice(2);
if (mode === "inspect-once") {
  const manifest = read(manifestPath);
  assert.equal(manifest.outputRoot, scope);
  assert.equal(manifest.imagesAllowed, 0);
  const inputNames = ["currentCandidate", "previousCandidate", "previousReview", "repair", "unchangedSourceOwnFIRST", "sourceSeed"];
  const inputs = inputNames.map((name) => ({ name, ...manifest[name] }));
  inputs.push(
    { name: "reviewInputs", path: manifestPath, sha256: null },
    { name: "previousChoiceReview", path: path.join(priorRoot, "review.json"), sha256: "e1f3ec51bd04f55d3291243389e23d6eb3e2fd5ffcdb393fcda619b1614fb5aa" },
    { name: "previousVisibleOwnFIRST", path: path.join(priorRoot, "visible-independent.FIRST.json"), sha256: "904eadbb7b402ec6ce9f4985e0b79272259e8408a796b05af483df2aa8a1120e" }
  );
  const bindings = inputs.map((input) => {
    const actual = hash(input.path);
    if (input.sha256) assert.equal(actual, input.sha256, input.name);
    return { name: input.name, path: input.path, declaredSha256: input.sha256, sha256Before: actual };
  });
  assert.equal(manifest.currentCandidate.sha256, "45855d9103f9016e7cb107adf79caa7ccdc95297939b36e47826a975c1a142a7");
  for (const name of ["previousReview", "unchangedSourceOwnFIRST", "previousChoiceReview", "previousVisibleOwnFIRST"]) {
    assert.equal(fs.statSync(bindings.find((input) => input.name === name).path).mode & 0o777, 0o444, name);
  }
  const current = read(manifest.currentCandidate.path);
  const old = read(manifest.previousCandidate.path);
  const previousReview = read(manifest.previousReview.path);
  const sourceFIRST = read(manifest.unchangedSourceOwnFIRST.path);
  const repair = read(manifest.repair.path);
  const changedPointers = diff(old, current);
  const allowed = new Set(["/answers/9/grading", "/answers/9/parts", "/answers/9/displayAnswer", "/answers/9/notes"]);
  assert(changedPointers.length > 0);
  for (const pointer of changedPointers) assert(allowed.has(pointer), `Unexpected repair change: ${pointer}`);
  const inheritedExercises = [];
  for (let i = 0; i < 9; i++) {
    const exercise = String(206 + i);
    assert.equal(old.answers[i].exercise, exercise);
    assert.deepEqual(current.answers[i], old.answers[i]);
    assert.equal(previousReview.perExercise[i].exercise, exercise);
    assert.equal(previousReview.perExercise[i].result, "PASS");
    inheritedExercises.push({ exercise, result: "PASS", candidateEntryUnchanged: true, inheritedFromReviewSha256: manifest.previousReview.sha256 });
  }
  assert.equal(previousReview.result, "FAIL");
  assert(previousReview.findings.some((finding) => finding.id === "N61-A215-END-CONDITION"));
  assert.equal(current.answers[9].exercise, "215");
  const old215 = old.answers[9];
  const new215 = current.answers[9];
  const prefix = old215.displayAnswer.split("\n按水桶通常")[0];
  assert(prefix.length > 0);
  const dimensionsDisplayPrefixUnchanged = new215.displayAnswer.startsWith(prefix);
  const bindingsAfter = bindings.map((binding) => ({ ...binding, sha256After: hash(binding.path), bytes: fs.statSync(binding.path).size, mode: (fs.statSync(binding.path).mode & 0o777).toString(8).padStart(4, "0") }));
  for (const binding of bindingsAfter) assert.equal(binding.sha256Before, binding.sha256After);
  writeNew("receipt.json", {
    schema: "n61-answer215-affected-inspection-receipt@1",
    recordedAt: new Date().toISOString(),
    command: ["node", fileURLToPath(import.meta.url), "inspect-once"],
    inspectionInvocations: 1,
    exitCode: 0,
    inputBindings: bindingsAfter,
    changedPointers,
    unchangedFirstNineComparedStructurallyOnly: inheritedExercises,
    tenDimensionalDisplayPrefixUnchanged: dimensionsDisplayPrefixUnchanged,
    inheritedTenTargets: old215.parts.slice(0, 10).map((part) => ({ label: part.label, expected: part.expected, unit: part.unit })),
    previous215Result: previousReview.perExercise[9].result,
    previousFindingPreserved: previousReview.findings.find((finding) => finding.id === "N61-A215-END-CONDITION"),
    newImagesOpened: 0,
    unchangedSourceSeedAndChoiceReviewAndVisibleFIRST: "Hashes only; no contents reopened for semantic review",
    offlineOnly: true
  });
  console.log(JSON.stringify({
    inputBindingsMatch: bindingsAfter.length,
    changedPointers,
    inheritedFirstNine: inheritedExercises,
    tenDimensionalDisplayPrefixUnchanged: dimensionsDisplayPrefixUnchanged,
    old215Grading: old215.grading,
    old215PartCount: old215.parts.length,
    current215: new215,
    ownSealedIndependent215: sourceFIRST.source_reviews.find((item) => item.source_number === "215"),
    repair,
    actualNewImages: 0
  }, null, 2));
} else if (mode === "report") {
  const receipt = read(own("receipt.json"));
  for (const binding of receipt.inputBindings) assert.equal(hash(binding.path), binding.sha256After);
  const input = (name) => receipt.inputBindings.find((binding) => binding.name === name);
  const reference = (name) => ({ path: input(name).path, sha256: input(name).sha256After });
  const current = read(input("currentCandidate").path);
  const answer215 = current.answers[9];
  assert.equal(answer215.grading, "ungraded");
  assert.deepEqual(answer215.parts, []);
  assert.equal(receipt.tenDimensionalDisplayPrefixUnchanged, true);
  assert.deepEqual(receipt.changedPointers.slice().sort(), [
    "/answers/9/grading", "/answers/9/displayAnswer", "/answers/9/parts", "/answers/9/notes"
  ].sort());
  const inherited = receipt.unchangedFirstNineComparedStructurallyOnly.map((entry) => ({
    exercise: entry.exercise,
    result: "PASS",
    reviewMode: "inherited_hash_bound_not_rechecked",
    mathematicalEvidence: `The previous independent PASS for exercise ${entry.exercise} is inherited from the sealed previous review, not solved or mathematically rechecked in this affected review.`,
    inheritedReview: { ...reference("previousReview"), exercise: entry.exercise },
    inheritedCandidate: reference("previousCandidate"),
    unchangedCandidateEvidence: "The current and old candidate exercise entries are structurally identical. This identity check establishes inheritance, not a new mathematical review.",
    receipt: own("receipt.json")
  }));
  // These semantic findings are authored by the reviewer after reading only the changed215 material and grading.
  const review215 = {
    exercise: "215",
    result: "PASS",
    reviewMode: "affected_only",
    resolvedFinding: "N61-A215-END-CONDITION",
    reviewedFields: ["grading", "parts", "displayAnswer material paragraph", "notes"],
    inheritedTenNetTargetPASS: {
      previousReview: { ...reference("previousReview"), exercise: "215", evidenceField: "perExercise[9].mathematicalEvidence: ten dimensional targets PASS" },
      sourceOwnFIRST: { ...reference("unchangedSourceOwnFIRST"), source_number: "215" },
      displayPrefixByteForByteUnchanged: true,
      rereviewed: false
    },
    mathematicalEvidence: [
      "The sealed own FIRST already established lateral area96*pi*sqrt(37) cm^2 independent of end assignment. The repair retains this area and divides square centimeters by10000, not100, for square meters.",
      "For diameter20 cm bottom with the other end open, add100*pi cm^2: pi*(96*sqrt(37)+100)/10000 = pi*(24*sqrt(37)+25)/2500 m^2. This is the sealed own small-bottom conditional result0.21486772249157293, whose displayed0.214868 is an honest approximation.",
      "For diameter28 cm bottom with the other end open, add196*pi cm^2: pi*(96*sqrt(37)+196)/10000 = pi*(24*sqrt(37)+49)/2500 m^2. This is the sealed own large-bottom conditional result0.245027011966035, whose displayed0.245027 is an honest approximation.",
      "For both ends closed, add100*pi+196*pi=296*pi cm^2, giving pi*(96*sqrt(37)+296)/10000 m^2. The repair expressly labels this as the closed-two-end alternative, not the required bucket convention."
    ],
    fidelityEvidence: "The new material paragraph explicitly states that end direction/opening is unspecified and presents each material answer under its own condition. It no longer promotes the usual-small-bottom convention into an unstated source premise. The ten net display targets and all earlier figure observations are inherited unchanged; neither source prose nor images were reopened.",
    gradingEvidence: "grading=ungraded and parts=[] remove the previous sole small-bottom expected value and all automatic judgments for215. A larger-bottom conditional solution is no longer falsely rejected by a small-bottom auto key. The standard answer remains substantive, including both net data sets and explicit material alternatives.",
    capacityLoss: {
      scope: "Whole exercise215 automatic grading",
      reason: "The established schema assigns grading at exercise level, not separately to the net and material subquestions.",
      consequence: "All ten previously source-supported numeric net targets are now display-only, along with the conditional material response; their mathematical PASS is preserved, but their automatic-judging capacity is lost.",
      disclosedByRepair: true,
      disclosedInCandidateNotes: true,
      acceptedWithinRequestedRepair: true,
      noSourceTaskRemovedFromDisplay: true
    },
    previousFAILPreserved: reference("previousReview")
  };
  const parts = current.answers.flatMap((answer) => answer.parts);
  const report = {
    schema: "n61-answer215-affected-review@1",
    reviewer: { kind: "independent_agent", identity: "SAME188-6 sole independent N61 affected reviewer02; same reviewer as original N61-A215-END-CONDITION" },
    result: "PASS",
    findings: [],
    reviewScope: "Affected-only approval of the one parent repair to N61-A215-END-CONDITION. Exercises206-214, ten215 dimensional targets and choice14/59 PASS are inherited, not re-reviewed. This does not release local source-glyph, historical FIRST or other production/approval holds.",
    currentCandidate: reference("currentCandidate"),
    resolvedFindings: ["N61-A215-END-CONDITION"],
    perExercise: [...inherited, review215],
    inputBindings: receipt.inputBindings.map(({ path: p, sha256Before, sha256After }) => ({ path: p, sha256Before, sha256After })),
    inheritedChoicePASS: { ...reference("previousChoiceReview"), questions: 14, optionChecks: 59, reviewedAgain: false, evidenceAccess: "Hash only; no source/choice/figure contents reopened" },
    preservedEvidence: {
      originalFAIL: reference("previousReview"),
      oldCandidate: reference("previousCandidate"),
      sourceOwnFIRST: reference("unchangedSourceOwnFIRST"),
      visibleOwnFIRST: reference("previousVisibleOwnFIRST"),
      allOriginalHashesUnchanged: true
    },
    capacityLoss: review215.capacityLoss,
    currentInventory: {
      exercises: current.answers.length,
      auto: current.answers.filter((answer) => answer.grading === "auto").length,
      ungraded: current.answers.filter((answer) => answer.grading === "ungraded").length,
      ungradedExercises: current.answers.filter((answer) => answer.grading === "ungraded").map((answer) => answer.exercise),
      parts: parts.length,
      expected: parts.reduce((total, part) => total + part.expected.length, 0),
      inventoryIsNotNewMathValidation: true
    },
    receipt: own("receipt.json"),
    actualNewImages: 0,
    imagesOpened: 0,
    unchangedSourceChoiceFigureReopened: false,
    validation: {
      fullChoiceValidateInvocations: 0,
      nativeAnswerFinalizeInvocations: 0,
      mathematicalProofAutomaticallyClaimed: false,
      semanticEvidenceBasis: "Changed conditional material formulas and grading policy compared with this reviewer's sealed own independent215 solution and original finding; unchanged results inherited by hash."
    },
    parentRepair: reference("repair"),
    wholeLessonApproved: false,
    published: false,
    writesOnlyNewReviewRoot: true
  };
  assert.deepEqual(report.perExercise.map((entry) => entry.exercise), Array.from({ length: 10 }, (_, i) => String(206 + i)));
  assert(report.perExercise.every((entry) => entry.result === "PASS"));
  assert.equal(report.currentInventory.auto, 7);
  assert.equal(report.currentInventory.ungraded, 3);
  assert.equal(report.currentInventory.expected, 14);
  writeNew("answer-review.json", report);
  console.log(JSON.stringify({ result: report.result, affectedOnly: true, findings: report.findings, inheritedFirstNine: inherited.length, inheritedNetTargets: 10, actualNewImages: 0, inventory: report.currentInventory, path: own("answer-review.json"), sha256: hash(own("answer-review.json")) }, null, 2));
} else if (mode === "seal") {
  const p = own(args[0]);
  const before = hash(p);
  const chmod = command("chmod", ["0444", p]);
  const stat = command("stat", ["-f", "%N %Sp %OLp %z %m", p]);
  const shasum = command("shasum", ["-a", "256", p]);
  assert.equal(chmod.exitCode, 0);
  assert.equal(stat.exitCode, 0);
  assert.equal(shasum.exitCode, 0);
  assert.equal(fs.statSync(p).mode & 0o777, 0o444);
  assert.equal(hash(p), before);
  writeNew(`${args[0]}.seal.json`, { path: p, sha256Before: before, sha256After: hash(p), mode: "0444", bytes: fs.statSync(p).size, recordedAt: new Date().toISOString(), chmod, stat, shasum });
  console.log(JSON.stringify({ path: p, sha256: hash(p), mode: "0444" }));
} else if (mode === "index") {
  const receipt = read(own("receipt.json"));
  for (const binding of receipt.inputBindings) assert.equal(hash(binding.path), binding.sha256After);
  const outputs = fs.readdirSync(scope).sort().filter((name) => name !== "output-index.json").map((name) => {
    const p = own(name);
    const s = fs.statSync(p);
    assert(s.isFile());
    return { path: p, sha256: hash(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, "0") };
  });
  writeNew("output-index.json", { schema: "n61-answer215-affected-output-index@1", outputs });
  console.log(JSON.stringify({ path: own("output-index.json"), sha256: hash(own("output-index.json")), outputs: outputs.length, inputsUnchanged: receipt.inputBindings.length }));
} else {
  throw new Error(`Unknown operation: ${mode}`);
}
