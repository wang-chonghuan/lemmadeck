import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp");
const OUT = path.join(T, "d885-n87-first-choice-author");
const L = "ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons/phy10-c2-s3-n87";
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${canonical(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u0080-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), "utf8"));
const descriptor = (name) => {
  const absolute = path.join(OUT, name);
  const bytes = fs.readFileSync(absolute);
  return { path: absolute, bytes: bytes.length, bytes_sha256: sha256(bytes), canonical_sha256: sha256(canonical(JSON.parse(bytes))) };
};
const write = (name, value) => {
  const target = path.join(OUT, name);
  if (!target.startsWith(`${OUT}/`)) throw new Error("Output escaped bounded scratch");
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const checkpoint = read("pre-options-checkpoint.json");
const freeze = read("checkpoint-freeze.json");
const checkpointDescriptor = descriptor("pre-options-checkpoint.json");
if (checkpointDescriptor.bytes_sha256 !== freeze.checkpoint_bytes_sha256 ||
    checkpointDescriptor.canonical_sha256 !== freeze.checkpoint_canonical_sha256) {
  throw new Error("Pre-options checkpoint changed after freeze");
}
const now = new Date().toISOString();
const localeArtifacts = {};
for (const locale of ["zh", "en"]) {
  const draft = read(`${locale}/draft.json`);
  const solutions = read(`${locale}/solutions.json`);
  const views = read(`${locale}/client-views.json`);
  const validation = read(`${locale}/validation.json`);
  if (validation.invocation_count !== 1 || validation.exit_code !== 0 || validation.result.semantic_approval !== false) {
    throw new Error("A single successful structural-only invocation is required");
  }
  if (descriptor(`${locale}/draft.json`).canonical_sha256 !== validation.result.draft_sha256) {
    throw new Error("Validated FIRST snapshot changed");
  }
  if (descriptor(`${locale}/solutions.json`).bytes_sha256 !== freeze.solutions[locale].bytes_sha256 ||
      descriptor(`${locale}/seed.json`).bytes_sha256 !== freeze.seeds[locale].bytes_sha256) {
    throw new Error("Frozen seed or solutions changed");
  }
  if (canonical(views) !== canonical(draft.questions.map((q) => q.view))) {
    throw new Error("Client-safe export is not exactly the view-only projection");
  }
  const bindings = {
    schema: "d885-n87-first-bindings-v1",
    stage: "FIRST",
    locale,
    frozen_at_utc: now,
    repository: R,
    output_root: OUT,
    source_root: validation.result.source_root,
    source_status: "text-only exact approved draft projection; native finalization pending",
    readiness: { structural_projection: "pass", semantic_independent_review: "pending", native_card: "not established", approval: false },
    checkpoint: checkpointDescriptor,
    seed: descriptor(`${locale}/seed.json`),
    solutions: descriptor(`${locale}/solutions.json`),
    draft: descriptor(`${locale}/draft.json`),
    client_safe_views: descriptor(`${locale}/client-views.json`),
    validation: descriptor(`${locale}/validation.json`),
    original_seed_path: validation.result.seed_path,
    source_files: read(`${locale}/seed.json`).trace.filter((item) => item.path.startsWith(`${L}/`)).map((item) => ({
      path: path.join(validation.result.source_root, item.path),
      bytes_sha256: item.sha256
    })),
    index_provenance: "retained in seed trace only; index was not read and membership was not verified",
    source_numbers: checkpoint.source_numbers,
    selected_concept_blocks: checkpoint.concept_blocks,
    selected_figures: [],
    new_figures: [],
    source_to_response: draft.questions.map((q) => ({
      source_number: q.source_numbers[0],
      question_id: q.id,
      mode: q.view.mode,
      option_ids: q.view.options.map((o) => o.id),
      concept_blocks: q.intent.concept_blocks,
      written_task_retained_in: `${locale}/solutions.json`,
      coverage_and_capacity_loss: draft.coverage.find((c) => c.source_number === q.source_numbers[0])
    })),
    source6_collective_coverage: [
      { application: "light wavelength measurement", option_id: "A" },
      { application: "antireflection treatment of optical instruments", option_id: "B" },
      { application: "gas refractive-index measurement", option_id: "C" },
      { application: "surface-quality inspection", option_id: "E", supporting_allowed_lesson_prose: [2, 3], additional_selected_concepts: [] }
    ],
    separation: "Only client-views.json contains learner-view subtrees. Draft keys, authored truths, source solutions, bindings, coverage and all receipts are internal. No application/client payload was produced."
  };
  write(`${locale}/bindings.json`, bindings);
  localeArtifacts[locale] = Object.fromEntries(
    ["seed", "solutions", "draft", "client-views", "validation", "bindings"].map((name) => [name, descriptor(`${locale}/${name}.json`)])
  );
}
const usage = {
  schema: "d885-n87-first-author-usage-v1",
  stage: "FIRST",
  recorded_at_utc: now,
  scope: "bounded bilingual author only",
  selected_written_tasks: 6,
  locales: ["zh", "en"],
  complete_units_per_locale: 6,
  single_units_per_locale: 4,
  multiple_units_per_locale: 2,
  options_per_locale: 26,
  written_tasks_preserved_separately: true,
  checkpoint_frozen_at_utc: freeze.frozen_at_utc,
  structural_validator_invocations: { zh: 1, en: 1 },
  independent_semantic_review_invocations: 0,
  self_independent_approvals: 0,
  external_model_calls: 0,
  paid_image_calls: 0,
  paid_generation_calls: 0,
  new_images: 0,
  browser_calls: 0,
  source_image_reads: 0,
  git_commands: 0,
  database_operations: 0,
  publisher_operations: 0,
  deployment_operations: 0,
  other_chat_operations: 0,
  canonical_resource_writes: 0,
  index_reads_or_writes: 0,
  existing_meter_reads_or_writes: 0,
  usage_source: "Local execution counts for this bounded authoring work only; no provider meter or historical usage files accessed.",
  assistant_token_usage: { input_tokens: null, output_tokens: null, reason: "Actual provider token usage is unavailable to this author; no estimate fabricated." },
  assistant_session_cost: { amount: null, currency: null, reason: "Actual session billing unavailable; no pricing lookup or meter access authorized." },
  explicitly_invoked_paid_service_cost: { amount: 0, reason: "No paid or external generation service was called." }
};
write("usage.json", usage);
const receipt = {
  schema: "d885-n87-first-author-receipt-v1",
  stage: "FIRST",
  frozen_at_utc: now,
  repository: R,
  output_root: OUT,
  checkpoint_frozen_before_options: true,
  checkpoint: checkpointDescriptor,
  checkpoint_freeze: descriptor("checkpoint-freeze.json"),
  bilingual_authored_units: descriptor("authored-units.json"),
  source_numbers: checkpoint.source_numbers,
  selected_concept_blocks: checkpoint.concept_blocks,
  locales: localeArtifacts,
  usage: descriptor("usage.json"),
  result: "FIRST bilingual draft and author-derived solutions frozen; projected structural checks passed once per locale",
  semantic_independent_review: "not executed; pending",
  semantic_approval: false,
  self_independent_approval: false,
  source_status: "Text-only exact approved draft projection; native finalization pending.",
  ready_native_card_claim: false,
  scope_limitations: [
    "Only three projected lesson JSON files and their seed are refreshed per locale. No original book index or index membership is verified.",
    "Mechanical validation checks fields, references, trace/projection consistency and key/rationale structure, not semantic correctness, task fidelity, distractor quality or bilingual meaning.",
    "Every choice unit is recognition, not proof of unaided written production; the six original written tasks and full author-derived solutions remain separate.",
    "Ice-fracture glints are conditional on thin air gaps, suitable illumination and overlapping reflections; no universal fracture guarantee or coating-rule transfer.",
    "Water shortens in-medium wavelength while preserving frequency; visibility is conditional on sufficient visible light reaching the eyes.",
    "Source 6 collectively covers all four source-listed application categories, including surface inspection supported by allowed prose without adding a selected definition or figure."
  ],
  preservation: "No files outside this output directory were written; no pre-existing work was reverted, overwritten or removed.",
  publication: "None. Canonical resources, index, existing meter, Git, database, publishers, deployment and other chats were not operated.",
  stop_boundary: "Stop here before semantic independent review, native finalization or any promotion."
};
write("receipt.json", receipt);
const report = [
  "# d885 n87 FIRST Bilingual Choice Author",
  "",
  "Six complete units per locale: four single, two multiple; 26 options each. All six written tasks remain separately preserved.",
  "Source: text-only exact approved draft projection. Native finalization pending; this is not a ready native card.",
  "Author-derived solutions and option-free checkpoint were frozen before alternatives were authored.",
  "Structural validation: one projected-source invocation per locale, both exit 0. Original index membership was not checked.",
  "Semantic independent review: not run. No self-independent approval or publishing.",
  "",
  `Checkpoint canonical SHA-256: ${checkpointDescriptor.canonical_sha256}`,
  `zh draft canonical SHA-256: ${localeArtifacts.zh.draft.canonical_sha256}`,
  `en draft canonical SHA-256: ${localeArtifacts.en.draft.canonical_sha256}`,
  "",
  "Learner-safe files contain only question view subtrees. Solutions, keys, option derivations, source bindings and this receipt stay internal.",
  "Recognizing supplied alternatives does not demonstrate unaided writing or listing. Coverage records that loss for every source.",
  "Source 6 jointly covers wavelength measurement, gas-index measurement, surface-quality inspection and antireflection treatment.",
  "No figures were selected or created. No paid calls or operations outside bounded scratch.",
  "",
  "Artifact paths and byte/canonical hashes: receipt.json and each locale's bindings.json.",
  "All file-byte hashes: SHA256SUMS. Usage counts and unavailable-provider-meter caveat: usage.json.",
  "Stop at FIRST handoff; independent semantic review and native finalization remain pending.",
  ""
].join("\n");
fs.writeFileSync(path.join(OUT, "receipt.md"), report, { flag: "wx" });
const files = [
  "pre-options-checkpoint.json", "checkpoint-freeze.json", "freeze-checkpoint.mjs",
  "authored-units.json", "project-drafts.mjs", "validate-projected.py",
  "run-structural-once.mjs", "finalize-first.mjs", "usage.json", "receipt.json", "receipt.md",
  ...["zh", "en"].flatMap((locale) => ["seed", "solutions", "draft", "client-views", "validation", "bindings"].map((name) => `${locale}/${name}.json`))
].sort();
const sums = `${files.map((name) => `${sha256(fs.readFileSync(path.join(OUT, name)))}  ${name}`).join("\n")}\n`;
fs.writeFileSync(path.join(OUT, "SHA256SUMS"), sums, { flag: "wx" });
for (const name of [...files, "SHA256SUMS"]) fs.chmodSync(path.join(OUT, name), 0o444);
console.log(JSON.stringify({
  output_root: OUT,
  frozen_at_utc: now,
  checkpoint_canonical_sha256: checkpointDescriptor.canonical_sha256,
  zh_draft_canonical_sha256: localeArtifacts.zh.draft.canonical_sha256,
  en_draft_canonical_sha256: localeArtifacts.en.draft.canonical_sha256,
  receipt_bytes_sha256: sha256(fs.readFileSync(path.join(OUT, "receipt.json"))),
  sha256sums_bytes_sha256: sha256(sums),
  files_frozen_read_only: files.length + 1,
  structural_validation: "once per locale, both exit 0; index membership unverified",
  independent_semantic_review: "not run",
  ready_native_card: false
}, null, 2));
