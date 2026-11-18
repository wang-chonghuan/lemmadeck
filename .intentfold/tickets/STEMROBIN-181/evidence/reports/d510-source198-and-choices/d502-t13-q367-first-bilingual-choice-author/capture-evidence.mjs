import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const scratch = path.join(workspace, ".intentfold/tickets/STEMROBIN-181/tmp");
const seedRoot = path.join(scratch, "d499-t13-first-text-choice-seeds");
const validator = path.join(workspace, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const preparer = path.join(workspace, ".agents/skills/ld-s10y-choice/scripts/prepare.py");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const load = (filename) => JSON.parse(fs.readFileSync(filename, "utf8"));
const mode = (filename) => (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, "0");
const absolute = (filename) => path.isAbsolute(filename) ? filename : path.resolve(workspace, filename);

function binding(filename) {
  const bytes = fs.readFileSync(filename);
  return { path: filename, sha256: sha(bytes), bytes: bytes.length, mode: mode(filename) };
}

function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
  }
  return value;
}

function canonicalDigest(value) {
  const json = JSON.stringify(sorted(value)).replace(/[\u007f-\uffff]/g,
    (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));
  return sha(Buffer.from(json, "utf8"));
}

function write(filename, value, readonly = false) {
  const target = path.resolve(root, filename);
  if (!target.startsWith(root + path.sep)) throw new Error("write outside d502");
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  if (readonly) fs.chmodSync(target, 0o444);
  return binding(target);
}

function verify(record) {
  const current = binding(record.path);
  if (current.sha256 !== record.sha256) throw new Error("input bytes changed: " + record.path);
  return current;
}

function prepareEvidence() {
  const manifestPath = path.join(seedRoot, "manifest.json");
  const manifest = load(manifestPath);
  if (binding(manifestPath).sha256 !== "624520a98af35752c3deb7dce2c826c0cc800c00b13dbe739ca4caf118efe500") {
    throw new Error("d499 manifest hash mismatch");
  }
  const solutionPath = path.join(root, "author-source-solution.json");
  const solutionSealPath = path.join(root, "source-solution-freeze.json");
  const solution = load(solutionPath);
  const solutionBinding = binding(solutionPath);
  const solutionSeal = binding(solutionSealPath);
  if (solutionBinding.sha256 !== "24758825469a22e02cf66b5bb0c31b16934bf2eea4d6b2bb22193fa115cae1b9" ||
      solutionSeal.sha256 !== "277c5ac5e5b64639c3554dcda270846efbd3bc6c2c4996a20f2c2f153c342231" ||
      solutionBinding.mode !== "0444" || solutionSeal.mode !== "0444") {
    throw new Error("independent solution seal changed");
  }
  const locales = manifest.seeds.map((entry) => {
    const repo = absolute(entry.repo);
    const seedPath = absolute(entry.seed.path);
    const seed = load(seedPath);
    const seedBinding = binding(seedPath);
    if (seedBinding.sha256 !== entry.seed.sha256) throw new Error("seed hash mismatch");
    const draftPath = path.join(root, entry.language, "draft.json");
    const draft = load(draftPath);
    const canonical = canonicalDigest(seed);
    if (draft.seed_sha256 !== canonical) throw new Error("draft canonical seed binding mismatch");
    const refreshedInputs = seed.trace.map((trace) => {
      const file = binding(path.resolve(repo, trace.path));
      if (file.sha256 !== trace.sha256) throw new Error("prepared source clone changed");
      return file;
    });
    return {
      locale: entry.language,
      repo,
      seed: { ...seedBinding, canonical_sha256: canonical },
      draft: { ...binding(draftPath), canonical_sha256: canonicalDigest(draft) },
      refresh_inputs: refreshedInputs
    };
  });
  const provenance = {
    schema: "t13-q367-first-bilingual-choice-author/provenance@1",
    ticket: "STEMROBIN-181",
    batch: "d502",
    card: "phy10-c2-s2-t13",
    not_t10: true,
    source_prompt_binding: solution.original_prompt_binding,
    independent_solution: solutionBinding,
    independent_solution_seal: solutionSeal,
    source_metadata_is_internal_not_added_to_strict_native_draft: true,
    rows: solution.solutions.map((row) => ({
      source_number: row.source_number,
      group_id: row.group_id,
      pages: row.pages,
      source_text: row.source_text,
      source_figure_refs: row.source_figure_refs,
      modern_clarification: row.modern_clarification,
      original_source_scope_limit: row.source_scope_limit,
      locale_bindings: locales.map((locale) => {
        const seed = load(locale.seed.path);
        const prompt = seed.exercises.find((exercise) => exercise.number === row.source_number);
        const draft = load(locale.draft.path);
        const question = draft.questions.find((item) => item.source_numbers.includes(row.source_number));
        if (!prompt || !question || row.group_id !== "g0") throw new Error("source mapping mismatch");
        return {
          locale: locale.locale,
          question_id: question.id,
          source_number: row.source_number,
          group_id: row.group_id,
          pages: row.pages,
          seed: locale.seed,
          seed_prompt_snapshot: prompt,
          draft: locale.draft,
          visible_subtree: "/questions/" + draft.questions.indexOf(question) + "/view",
          source_quote_preserved_in_provenance_not_rewritten: true
        };
      })
    })),
    concepts: [],
    figures: [],
    independent_semantic_review: "pending",
    fullcard: false,
    complete_choice_coverage: false
  };
  const provenanceBinding = write("source-provenance.json", provenance, true);
  const result = write("inputs-before.json", {
    schema: "t13-q367-first-bilingual-choice-author/inputs-before@1",
    created_at: new Date().toISOString(),
    manifest: binding(manifestPath),
    independent_solution: solutionBinding,
    source_solution_seal: solutionSeal,
    source_provenance: provenanceBinding,
    tools: [binding(validator), binding(preparer)],
    evidence_capture_script: binding(fileURLToPath(import.meta.url)),
    locales,
    d499_actual_mode: "0644: recorded, not changed; supplied hashes matched",
    validation_yet_run: false,
    inspect_prepare_replayed: false,
    other_solutions_or_keys_read: false,
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false }
  }, true);
  console.log(JSON.stringify(result));
}

function validateLocale(localeName) {
  const receiptName = path.join(localeName, "first-structural-receipt.json");
  if (fs.existsSync(path.join(root, receiptName))) throw new Error("first validation already recorded");
  const before = load(path.join(root, "inputs-before.json"));
  const locale = before.locales.find((item) => item.locale === localeName);
  if (!locale) throw new Error("unknown locale");
  verify(locale.seed);
  verify(locale.draft);
  locale.refresh_inputs.forEach(verify);
  before.tools.forEach(verify);
  const args = [validator, "--repo", locale.repo, "--seed", locale.seed.path, "--draft", locale.draft.path];
  const start = new Date().toISOString();
  const result = spawnSync("python3", args, {
    cwd: workspace,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  for (const [kind, content] of [["stdout", result.stdout], ["stderr", result.stderr]]) {
    const filename = path.join(root, localeName, "first-structural-" + kind + ".txt");
    fs.writeFileSync(filename, content ?? "", { flag: "wx" });
    fs.chmodSync(filename, 0o444);
  }
  const record = write(receiptName, {
    schema: "t13-q367-first-bilingual-choice-author/first-structural-receipt@1",
    batch: "d502",
    locale: localeName,
    attempt: 1,
    command: { executable: "python3", argv: args, cwd: workspace, env_overrides: { PYTHONDONTWRITEBYTECODE: "1" } },
    started_at: start,
    finished_at: new Date().toISOString(),
    exit_code: result.status,
    signal: result.signal,
    spawn_error: result.error?.message ?? null,
    inputs_before: binding(path.join(root, "inputs-before.json")),
    seed: locale.seed,
    draft: locale.draft,
    native_refreshed_source_input_bindings: locale.refresh_inputs,
    tool_bindings: before.tools,
    stdout: binding(path.join(root, localeName, "first-structural-stdout.txt")),
    stderr: binding(path.join(root, localeName, "first-structural-stderr.txt")),
    stdout_literal: result.stdout ?? "",
    stderr_literal: result.stderr ?? "",
    verdict: result.status === 0 ? "STRUCTURE_PASS_SEMANTIC_PENDING" : "FIRST_STRUCTURE_FAILURE_RETAINED",
    semantic_review_executed: false,
    review_flag_used: false,
    new_images: 0,
    cumulative_context_images: 23,
    inspect_prepare_command_replayed: false,
    repair_performed: false,
    historical_failure_bytes_preserved: true
  }, true);
  console.log(JSON.stringify(record));
  console.log(result.stdout ?? "");
  if (result.stderr) console.error(result.stderr);
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}

function finalize() {
  if (fs.existsSync(path.join(root, "author-freeze.json"))) throw new Error("author batch already frozen");
  const before = load(path.join(root, "inputs-before.json"));
  const receipts = before.locales.map((locale) => {
    const filename = path.join(root, locale.locale, "first-structural-receipt.json");
    const receipt = load(filename);
    if (receipt.exit_code !== 0 || receipt.attempt !== 1) throw new Error("first structure did not pass");
    return binding(filename);
  });
  const notes = load(path.join(root, "author-notes.json"));
  const actualOpens = write("actual-opens.json", {
    schema: "t13-q367-first-bilingual-choice-author/actual-opens@1",
    batch: "d502",
    context_is_existing_finite_helper: true,
    new_image_opens: [],
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false },
    no_view_open_screenshot_render_or_image_hash_substitution: true,
    independent_solution_exposure_order: "original prompt independently solved and 0444 sealed before seed exposure; source-solution-freeze.json records the boundary",
    input_text_bindings: [before.manifest, before.independent_solution, before.source_solution_seal,
      ...before.locales.map((locale) => locale.seed)],
    native_structural_refresh_text_bindings: before.locales.flatMap((locale) => locale.refresh_inputs),
    text_read_restrictions: {
      seed_contains_options_or_keys: false,
      other_author_or_reviewer_solutions_or_keys_read: false,
      d473_content_read: false,
      d493_d495_read: false,
      no_answers_or_choice_payloads_consulted: true
    },
    commands: {
      first_structural_validation_per_locale: { zh: 1, en: 1 },
      inspect_prepare_replays: 0,
      review_flag_calls: 0,
      native_flow_render_full_tests: 0,
      DB_git_index_meter_consume_paid_worker_changes: 0
    },
    retained_prevalidation_incidents: notes.prevalidation_incidents
  }, true);
  const artifactBindings = [
    binding(path.join(root, "author-source-solution.json")),
    binding(path.join(root, "source-solution-freeze.json")),
    binding(path.join(root, "source-provenance.json")),
    binding(path.join(root, "inputs-before.json")),
    binding(path.join(root, "author-notes.json")),
    ...before.locales.map((locale) => ({
      ...binding(locale.draft.path),
      locale: locale.locale,
      canonical_sha256: canonicalDigest(load(locale.draft.path))
    })),
    ...receipts
  ];
  artifactBindings.forEach((record) => fs.chmodSync(record.path, 0o444));
  const report = write("report.json", {
    ...notes,
    schema: "t13-q367-first-bilingual-choice-author/report@1",
    completed_at: new Date().toISOString(),
    status: "FIRST_BILINGUAL_CHOICES_AUTHORED_STRUCTURE_PASS_SEMANTIC_PENDING",
    artifact_bindings: artifactBindings.map((record) => ({ ...record, mode: mode(record.path) })),
    actual_opens: actualOpens,
    author_solution_sealed_before_seed_options: true,
    source_number_group_pages_and_source_text_preserved: true,
    native_draft_unknown_metadata_fields_added: false,
    structure: {
      zh: "PASS_FIRST_ATTEMPT_EXIT_0",
      en: "PASS_FIRST_ATTEMPT_EXIT_0",
      receipts,
      native_validation_calls: 2,
      repairs: 0,
      semantic_proof_claimed: false
    },
    original_scope_HOLDs_cleared: false,
    source_Q7_ambient_and_grazing_HOLD_preserved: true,
    choice_full_gate: "pending_independent_semantic_review",
    fullcard: false,
    complete_choice_coverage: false
  }, true);
  const files = [];
  function collect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) collect(filename);
      else if (entry.isFile()) files.push(filename);
      else throw new Error("unexpected nonregular evidence");
    }
  }
  collect(root);
  for (const filename of files) fs.chmodSync(filename, 0o444);
  const sealedFiles = files.map(binding);
  const freeze = write("author-freeze.json", {
    schema: "t13-q367-first-bilingual-choice-author/author-freeze@1",
    ticket: "STEMROBIN-181",
    batch: "d502",
    frozen_at: new Date().toISOString(),
    files: sealedFiles,
    file_count_excluding_self: sealedFiles.length,
    total_files_including_self: sealedFiles.length + 1,
    all_listed_files_actual_mode: "0444",
    self_mode: "0444",
    historical_solution_seals_preserved_byte_exact: true,
    source_solution_before_seed: true,
    first_structural_receipts: receipts,
    structural_attempts_per_locale: { zh: 1, en: 1 },
    repairs: 0,
    failed_local_probe_preserved_in_notes_and_report: true,
    independent_semantic_review: "pending",
    SCI: notes.SCI,
    ZHEN: notes.ZHEN,
    historical_HOLDs_preserved: true,
    fullcard: false,
    complete_choice_coverage: false,
    image_ledger: { before: 23, new: 0, cumulative: 23, limit: 24, reset: false },
    no_DB_git_consume_index_meter_or_new_workers: true
  }, true);
  for (const filename of [...files, freeze.path]) {
    if (mode(filename) !== "0444") throw new Error("final freeze mode mismatch");
  }
  for (const record of sealedFiles) verify(record);
  console.log(JSON.stringify({ report, author_freeze: freeze, actual_opens: actualOpens, first_structural_receipts: receipts }));
}

const action = process.argv[2];
if (action === "prepare-evidence") prepareEvidence();
else if (action === "validate-locale") validateLocale(process.argv[3]);
else if (action === "finalize") finalize();
else throw new Error("unknown evidence action");
