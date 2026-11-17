import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.resolve(root, "../d190-t16-q3-inputs/answer-inputs.json");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const load = (file) => {
  const bytes = readFileSync(file);
  return { value: JSON.parse(bytes), sha256: sha256(bytes) };
};
const input = load(inputPath);
assert.equal(
  input.sha256,
  "968cbfae46ced46252a2798e7470c02ead50359ea577e8c7be96867f183a3179",
  "Sole input changed"
);
assert.deepEqual(input.value.selected, ["3"]);
assert.equal(input.value.answerInputs.length, 2);
assert.deepEqual(input.value.answerInputs.map((entry) => entry.language).sort(), ["en", "zh"]);
for (const entry of input.value.answerInputs) {
  assert.equal(entry.question.number, "3");
  assert.equal(entry.question.source_number, "3");
  assert.equal(entry.question.group_id, "g0");
  assert.deepEqual(entry.question.figure_refs, ["fig-120"]);
  assert.equal(entry.bookRaw.exercise, 3);
  assert.equal(entry.bookRaw.lesson, input.value.card);
}

const draft = load(path.join(root, "draft.json"));
const ledger = load(path.join(root, "actual-opens.json"));
const receipt = load(path.join(root, "calculation-receipt.json"));
assert.equal(draft.value.schema, "ld-s10y-answer/lesson-answers@1");
assert.equal(draft.value.status, "draft");
assert.equal(draft.value.lesson, input.value.card);
assert.equal(draft.value.book, "10p");
assert.equal(draft.value.edition, "modern-us-neutral");
assert.equal(draft.value.answers.length, 1);
const answer = draft.value.answers[0];
assert.equal(answer.exercise, "3");
assert.equal(answer.grading, "ungraded");
assert.ok(["book", "derived"].includes(answer.source));
assert.equal(answer.source, "book");
for (const entry of input.value.answerInputs) {
  assert.equal(answer.bookRaw, entry.bookRaw.raw, "bookRaw must be byte-for-byte equivalent after JSON decoding");
  assert.equal(receipt.value.bookRaw, entry.bookRaw.raw);
}
for (const field of ["displayAnswer", "displayAnswerEn", "notes", "notesEn"]) {
  assert.equal(typeof answer[field], "string");
  assert.ok(answer[field].length > 0);
}
assert.ok(answer.conditions.length > 0);
assert.equal(answer.conditions.length, answer.conditionsEn.length);
assert.ok(answer.authorDerivation.steps.every((step) => step.zh && step.en));

const rejectJudgingStructure = (value) => {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!["parts", "expected"].includes(key), `Forbidden judging key: ${key}`);
    rejectJudgingStructure(child);
  }
};
rejectJudgingStructure(draft.value);

const evidence = {};
for (const role of ["original", "modernPreview", "spec"]) {
  const declared = input.value.figure[role];
  const actual = sha256(readFileSync(declared.path));
  assert.equal(actual, declared.sha256, `${role} changed`);
  evidence[role] = { path: declared.path, sha256: actual };
}
assert.equal(ledger.value.events.length, 2);
for (const [index, role] of ["original", "modernPreview"].entries()) {
  const event = ledger.value.events[index];
  assert.equal(event.sequence, index + 1);
  assert.equal(event.tool, "functions.view_image");
  assert.equal(event.role, role);
  assert.equal(event.path, evidence[role].path);
  assert.equal(event.sha256, evidence[role].sha256);
  assert.equal(event.actualOpens, 1);
}
assert.equal(ledger.value.specRead.sha256, evidence.spec.sha256);
assert.equal(ledger.value.counts.original, 1);
assert.equal(ledger.value.counts.modernPreview, 1);
assert.equal(ledger.value.beforeThisTask, 0);
assert.equal(ledger.value.counts.batchImages, 2);
assert.equal(ledger.value.counts.freshContextCumulativeImages, 2);
assert.equal(ledger.value.counts.reopens, 0);
assert.equal(ledger.value.counts.crops, 0);
assert.ok(ledger.value.counts.batchImages <= 8);
assert.ok(ledger.value.counts.freshContextCumulativeImages <= 24);

// Numerical tolerances here check floating-point reproduction, not student grading.
const near = (actual, recorded) => {
  assert.ok(Number.isFinite(actual) && Number.isFinite(recorded));
  assert.ok(Math.abs(actual - recorded) <= 1e-12 * Math.max(Math.abs(recorded), 1e-30));
};
const L = 2e-4;
const c = 3e8;
assert.deepEqual(receipt.value.given, { L_H: L, C_min_pF: 12, C_max_pF: 450 });
assert.equal(receipt.value.propagationSpeed_m_per_s, c);
assert.equal(receipt.value.pF_to_F, 1e-12);
assert.equal(receipt.value.speedIsApproximate, true);
assert.deepEqual(answer.authorDerivation.given, receipt.value.given);
assert.equal(answer.authorDerivation.physicalApproximation.propagationSpeed_m_per_s, c);
assert.equal(receipt.value.input.sha256, input.sha256);
assert.equal(receipt.value.endpoints.length, 2);
assert.equal(answer.authorDerivation.endpoints.length, 2);
const endpoints = [12, 450].map((C_pF, index) => {
  const C_F = C_pF * 1e-12;
  const LC_HF = L * C_F;
  const sqrtLC_s = Math.sqrt(LC_HF);
  const period_s = 2 * Math.PI * sqrtLC_s;
  const frequency_Hz = 1 / period_s;
  const wavelength_m = c * period_s;
  const wavelengthViaFrequency_m = c / frequency_Hz;
  const actual = {
    C_pF, C_F, L_H: L, LC_HF, sqrtLC_s, period_s, frequency_Hz,
    wavelength_m, wavelengthViaFrequency_m, roundedInteger_m: Math.round(wavelength_m),
  };
  for (const [key, value] of Object.entries(actual)) near(value, receipt.value.endpoints[index][key]);
  const authored = answer.authorDerivation.endpoints[index];
  for (const key of ["C_pF", "C_F", "frequency_Hz", "wavelength_m"]) near(actual[key], authored[key]);
  assert.equal(authored.displayRounded_m, Number(wavelength_m.toFixed(2)));
  assert.equal(authored.bookRounded_m, actual.roundedInteger_m);
  near(wavelength_m, wavelengthViaFrequency_m);
  return actual;
});
assert.ok(endpoints[0].wavelength_m < endpoints[1].wavelength_m);
assert.ok(endpoints[0].frequency_Hz > endpoints[1].frequency_Hz);
assert.deepEqual(endpoints.map((endpoint) => endpoint.roundedInteger_m), [92, 565]);
assert.equal(answer.bookRaw, "从 λ₁≈92 米至 λ₂=565 米。");
near(endpoints[1].wavelength_m / endpoints[0].wavelength_m, Math.sqrt(450 / 12));
near(receipt.value.endpointRatio, Math.sqrt(450 / 12));
near(receipt.value.capacitanceRatioSquareRoot, Math.sqrt(450 / 12));
for (const field of ["displayAnswer", "displayAnswerEn"]) {
  assert.ok(answer[field].includes("92.34"));
  assert.ok(answer[field].includes("565.49"));
}

const output = {
  status: "author-mechanical-checks-completed",
  independentReview: "pending-parent-dispatch",
  inputSha256: input.sha256,
  draftSha256: draft.sha256,
  ledgerSha256: ledger.sha256,
  calculationReceiptSha256: receipt.sha256,
  scriptSha256: sha256(readFileSync(fileURLToPath(import.meta.url))),
  evidence,
  endpoints,
  bookRawExact: true,
  source: answer.source,
  grading: answer.grading,
  forbiddenJudgingKeysAbsent: true,
  actualImageOpens: { original: 1, modernPreview: 1, batch: 2, freshContextCumulative: 2 },
  imageOpensProvenance: "Observed view_image calls recorded in ledger; hashing alone does not prove an image open.",
};
if (process.argv.includes("--frozen")) {
  const report = load(path.join(root, "report.json"));
  const freeze = load(path.join(root, "author-freeze.json"));
  assert.equal(report.value.independentReview.status, "pending-parent-dispatch");
  assert.equal(report.value.independentReview.selfSignedPass, false);
  assert.equal(freeze.value.status, "authored-frozen-awaiting-independent-review");
  assert.equal(freeze.value.selfSignedPass, false);
  assert.deepEqual(freeze.value.selected, ["3"]);
  assert.equal(freeze.value.input.sha256, input.sha256);
  assert.equal(freeze.value.files["draft.json"], draft.sha256);
  assert.equal(freeze.value.files["actual-opens.json"], ledger.sha256);
  assert.equal(freeze.value.files["calculation-receipt.json"], receipt.sha256);
  assert.equal(freeze.value.files["verify.mjs"], output.scriptSha256);
  assert.equal(freeze.value.files["report.json"], report.sha256);
  assert.equal(report.value.artifacts["draft.json"], draft.sha256);
  assert.equal(report.value.artifacts["actual-opens.json"], ledger.sha256);
  assert.equal(report.value.artifacts["calculation-receipt.json"], receipt.sha256);
  assert.equal(report.value.artifacts["verify.mjs"], output.scriptSha256);
  output.reportSha256 = report.sha256;
  output.freezeSha256 = freeze.sha256;
  output.freezeBindingsChecked = true;
}
console.log(JSON.stringify(output, null, 2));
