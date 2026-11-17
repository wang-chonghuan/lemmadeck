import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const reportPath = path.join(path.dirname(directory), "geo910-n19-choice-independent-source-first.md");
const seedPath = path.join(path.dirname(directory), "geo910-n19-choice-seed.json");
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const read = (name) => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"));
const emit = (name, value) => fs.writeFileSync(
  path.join(directory, name), `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const core = read("solution-core.json");
const initialLedger = read("inputhashledger.json");
const renderEvidence = read("render-evidence.json");
const arithmeticEvidence = read("arithmetic-evidence.json");
const seedDigest = sha(canonical(seed));
assert.equal(seedDigest, "21aba5ade30915e19ae40469c14a891e7b70f16f33ac4e9c32f7fe14536de2f4");
assert.deepEqual(core.source_reviews.map((item) => item.source_number), seed.exercises.map((item) => item.number));
assert.equal(core.source_reviews.flatMap((item) => item.task_units).length, 12);
assert.equal(core.choice_view_seen, false);
assert.equal(core.internal_key_seen, false);
assert.equal(core.semantic_gate_outcome, null);
assert.equal(core.image_budget.opened, 2);
assert.equal(core.image_budget.reopened, 0);
assert.equal(core.image_budget.parent_image_payloads_sent, 0);
assert.equal(arithmeticEvidence.assertions_completed, true);
assert.equal(arithmeticEvidence.source_count, 6);
for (const input of initialLedger.inputs) assert.equal(sha(fs.readFileSync(input.path)), input.sha256, input.path);
for (const render of renderEvidence.renders) assert.equal(sha(fs.readFileSync(render.screenshot_path)), render.screenshot_sha256);

const frozenAt = new Date().toISOString();
const phase1 = {
  ...core,
  stage_status: "frozen_source_only_awaiting_explicit_phase2",
  frozen_at: frozenAt,
  seed_path: seedPath,
  seed_sha256: seedDigest,
  exact_source: seed,
  renderer_evidence: renderEvidence,
  arithmetic_evidence: arithmeticEvidence,
  report_path: reportPath,
};
emit("phase1.json", phase1);
const sourceFields = [
  ...seed.exercises.map((item) => ({
    selector: `/exercises/number=${item.number}`,
    role: "exact_full_written_source",
    canonical_sha256: sha(canonical(item)),
    text_utf8_sha256: sha(item.text),
  })),
  ...seed.concepts.map((item) => ({
    selector: `/concepts/block=${item.block}`,
    role: "exact_selected_definition",
    canonical_sha256: sha(canonical(item)),
    text_utf8_sha256: sha(item.text),
  })),
  ...seed.figures.map((item) => ({
    selector: `/figures/id=${item.id}`,
    role: "selected_actual_concept_figure",
    canonical_sha256: sha(canonical(item)),
  })),
];
const imageEvents = renderEvidence.renders.map((item, index) => ({
  event: "image_open",
  sequence: index + 1,
  viewer: "functions.view_image via multi_tool_use.parallel",
  figure_id: item.figure_id,
  source_asset_path: item.source_path,
  source_asset_sha256: item.source_sha256,
  opened_path: item.screenshot_path,
  opened_sha256: item.screenshot_sha256,
  full_render: true,
  crop: false,
  reopen: false,
  observation: core.figure_checks.find((figure) => figure.figure_id === item.figure_id).observation,
}));
const ownFiles = [
  reportPath,
  path.join(directory, "solution-core.json"),
  path.join(directory, "render-source.mjs"),
  path.join(directory, "freeze-phase1.mjs"),
  path.join(directory, "arithmetic-check.mjs"),
  path.join(directory, "arithmetic-evidence.json"),
  path.join(directory, "arithmetic-attempt-1.json"),
  path.join(directory, "render-evidence.json"),
  path.join(directory, "inputhashledger.json"),
  path.join(directory, "phase1.json"),
  ...renderEvidence.renders.map((item) => item.screenshot_path),
];
const outputHashes = ownFiles.map((file) => ({
  path: file,
  sha256: sha(fs.readFileSync(file)),
  byte_length: fs.statSync(file).size,
}));
emit("complete-inputhashledger.json", {
  ...initialLedger,
  schema: "independent-source-complete-inputhashledger-v1",
  frozen_at: frozenAt,
  source_fields: sourceFields,
  policy_input_note: "Policy files govern procedure only; the verified seed is the sole mathematical prose input.",
  runtime_note: "Existing app Playwright and Chromium execute rendering, not mathematical authority. No package installation or external documentation request.",
  image_open_events: imageEvents,
  image_budget: core.image_budget,
  exact_inputs_reverified_at_freeze: true,
  access_events: [...initialLedger.access_events, ...imageEvents],
  outputs: outputHashes,
  rejected_or_unseen_author_inputs: initialLedger.unprovided_inputs,
  allowed_writes: [reportPath, directory],
  outside_allowed_writes: [],
  formal_semantic_review_completed: false,
  seed_reprepared: false,
  validation_or_skill_tests_run: false,
  reviewer_created_arithmetic_checks: true,
  retained_failed_attempts: [path.join(directory, "arithmetic-attempt-1.json")],
});
const ledgerPath = path.join(directory, "complete-inputhashledger.json");
emit("freeze-manifest.json", {
  schema: "independent-source-phase1-freeze-manifest-v1",
  frozen_at: frozenAt,
  phase: "phase1_source_only",
  seed_path: seedPath,
  seed_canonical_sha256: seedDigest,
  seed_raw_sha256: sha(fs.readFileSync(seedPath)),
  outputs: [...outputHashes, {
    path: ledgerPath,
    sha256: sha(fs.readFileSync(ledgerPath)),
    byte_length: fs.statSync(ledgerPath).size,
  }],
  image_opens: 2,
  image_reopens: 0,
  semantic_gate_outcome: null,
  next_action_requires: "Explicit Phase 2 learner-view-only disclosure; Phase 3 internal comparison remains later and separately authorized.",
});
console.log(JSON.stringify({
  stage_status: phase1.stage_status,
  source_count: core.source_reviews.length,
  complete_task_units: core.source_reviews.flatMap((item) => item.task_units),
  seed_canonical_sha256: seedDigest,
  phase1_json_sha256: sha(fs.readFileSync(path.join(directory, "phase1.json"))),
  report_sha256: sha(fs.readFileSync(reportPath)),
  ledger_sha256: sha(fs.readFileSync(ledgerPath)),
  freeze_manifest_sha256: sha(fs.readFileSync(path.join(directory, "freeze-manifest.json"))),
  image_budget: core.image_budget,
  semantic_gate_outcome: null,
}, null, 2));
