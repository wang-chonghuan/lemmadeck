import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const R = "/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck";
const W = path.join(R, ".tmp/stemrobin-184-six/source10c5255-work");
const A = path.join(R, ".tmp/stemrobin-184-six/source10c7273-author");
assert.equal(process.cwd(), R);
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = (p) => {
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length, sha256: hash(bytes) };
};
const verify = (binding) => {
  assert.deepEqual(bind(binding.path), binding);
  return binding;
};
const frontmatter = (p) => {
  const text = fs.readFileSync(p, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert.ok(match, `missing JSON frontmatter: ${p}`);
  return { meta: JSON.parse(match[1]), body: text.slice(match[0].length) };
};
const frequencies = (values) => {
  const result = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
};

const observationsPath = path.join(A, "observations.json");
const observations = readJson(observationsPath);
const preparePath = path.join(W, "receipts/nov22-prepare-p0072-0073-01/execution.json");
const prepareBinding = bind(preparePath);
assert.equal(prepareBinding.sha256, observations.preflight.prepare_execution_sha256);
const prepare = readJson(preparePath);
assert.equal(prepare.exitCode, 0);
for (const stream of Object.values(prepare.streams)) verify(stream);
for (const trace of prepare.image_call_traces) verify(trace);

const protectedFiles = Object.entries(observations.protected_hashes_before).map(([relative, before]) => {
  const current = bind(path.join(R, relative));
  assert.equal(current.sha256, before, `protected bytes changed: ${relative}`);
  return { ...current, sha256_before: before, unchanged: true };
});
for (const entry of observations.model_image_ledger) {
  assert.equal(bind(entry.path).sha256, entry.sha256);
}

const pages = [];
const allEvents = [];
for (const number of [72, 73]) {
  const padded = String(number).padStart(4, "0");
  const directory = path.join(W, "artifacts/10c/pages", padded);
  const preparedDirectory = path.join(W, "10c/pages", padded);
  const receiptDirectory = path.join(W, "receipts", `nov22-finalize-p${padded}-01`);
  const executionPath = path.join(receiptDirectory, "execution.json");
  const execution = readJson(executionPath);
  assert.equal(execution.cwd, R);
  assert.equal(execution.exitCode, 0);
  assert.equal(execution.argv[execution.argv.indexOf("--page") + 1], String(number));
  assert.equal(execution.argv[execution.argv.indexOf("--book") + 1], "10c");
  assert.equal(execution.argv[execution.argv.indexOf("--root") + 1], path.join(W, "artifacts"));
  const current = Object.fromEntries(["page.md", "page.json", "audit.json"].map((name) => [name, bind(path.join(directory, name))]));
  verify(execution.input_page);
  const snapshots = execution.outputs.map(verify);
  for (const [name, binding] of Object.entries(current)) {
    const snapshot = snapshots.find((entry) => path.basename(entry.path) === `output-${name}`);
    assert.ok(snapshot, `missing receipt snapshot: ${name}`);
    assert.equal(snapshot.sha256, binding.sha256);
  }
  const input = frontmatter(execution.input_page.path);
  const output = frontmatter(current["page.md"].path);
  assert.equal(input.body, output.body, "native finalizer changed source body");
  const changedMeta = Object.keys({ ...input.meta, ...output.meta }).filter((key) =>
    JSON.stringify(input.meta[key]) !== JSON.stringify(output.meta[key]));
  const page = readJson(current["page.json"].path);
  assert.deepEqual(page.meta, output.meta);
  const audit = readJson(current["audit.json"].path);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.equal(audit.lines_md, observations.pages[padded].physical_baselines_authored);
  const streams = Object.fromEntries(Object.entries(execution.streams).map(([name, binding]) => [name, verify(binding)]));
  const traceBindings = execution.image_call_traces.map(verify);
  const events = traceBindings.flatMap((binding) =>
    fs.readFileSync(binding.path, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line)));
  allEvents.push(...events);
  const stderr = fs.readFileSync(streams.stderr.path, "utf8");
  const stdout = fs.readFileSync(streams.stdout.path, "utf8");
  const facts = observations.pages[padded];
  const blocks = page.blocks.map((block, index) => {
    const result = { ref: `p${padded}#${index + 1}`, kind: block.kind, lines: block.lines };
    if (block.label !== null) result.label = block.label;
    if (block.owner_exercise !== null) result.owner_exercise = block.owner_exercise;
    if (block.owner_exercises) result.owner_exercises = block.owner_exercises;
    for (const flag of ["open", "cont", "samerow"]) if (block[flag]) result[flag] = true;
    return result;
  });
  const tasks = blocks.filter((block) => block.kind === "ex").map((block) => block.label);
  assert.deepEqual(tasks, facts.task_numbers);
  const owners = blocks.filter((block) => block.owner_exercises).map((block) => block.owner_exercises);
  assert.deepEqual(owners, facts.requests.filter((request) => request.owners && request.closed).map((request) => request.owners));
  const original = bind(path.join(preparedDirectory, "page.png"));
  const template = bind(path.join(preparedDirectory, "page.template.md"));
  assert.equal(original.sha256, facts.source_png_sha256);
  assert.equal(template.sha256, facts.template_sha256);
  const preparedTemplate = frontmatter(template.path).meta;
  assert.equal(preparedTemplate.source.pdf_sha256, output.meta.source.pdf_sha256);
  assert.equal(preparedTemplate.render.sha256, original.sha256);
  const figureDirectories = [path.join(directory, "figures"), path.join(preparedDirectory, "figures")];
  const figuresOnDisk = figureDirectories.flatMap((p) =>
    fs.existsSync(p) ? fs.readdirSync(p).map((name) => path.join(p, name)) : []);
  assert.equal(figuresOnDisk.length, 0, "unexpected figure output");
  assert.equal(audit.figures.length, 0);
  pages.push({
    physical_page: number,
    printed_page: output.meta.printed_page,
    source: {
      pdf: path.join(R, "ssot-resources/soviet10year-textbooks/sources/soviet10years", output.meta.source.pdf),
      pdf_sha256: output.meta.source.pdf_sha256,
      pdf_hash_source: "prepared template; PDF not opened by this author",
      original_png: original,
      grid: bind(path.join(preparedDirectory, "page.grid.png")),
      prepared_template: template,
      render: output.meta.render
    },
    current_files: current,
    native_execution: {
      receipt: bind(executionPath), cwd: execution.cwd, argv: execution.argv,
      started_at: execution.startedAt, finished_at: execution.finishedAt,
      exit_code: execution.exitCode, attempts: 1,
      input_snapshot: execution.input_page, output_snapshots: snapshots,
      current_outputs_match_snapshots: true, streams, trace_bindings: traceBindings,
      stdout_summary: stdout.trim(),
      faults: stderr ? [{
        kind: "instrumentation shutdown cleanup exception",
        exception: "AttributeError: 'NoneType' object has no attribute 'startswith'",
        location: "source10c5255-author/instrumentation/sitecustomize.py:18 profile",
        context: "Exception ignored in logging._removeHandlerRef during interpreter shutdown",
        native_exit_code: execution.exitCode, preserved_raw_stream: streams.stderr,
        no_retry_no_instrumentation_edit: true
      }] : [],
      trace_observed: {
        entries: events.length,
        categories: frequencies(events.map((event) => event.category)),
        entrypoints: frequencies(events.map((event) => `${event.module}.${event.method}`)),
        pids: [...new Set(events.map((event) => event.pid))],
        null_source_entries: events.filter((event) => event.source === null).length,
        codec_calls_and_return_codes: "UNKNOWN; C-level codec not exposed by these traces",
        low_level_decode_count: "UNKNOWN; Python load entries are not codec invocations",
        observed_crop_entries: events.filter((event) => /crop/i.test(event.method)).length,
        observed_save_entries: events.filter((event) => event.method === "save").length,
        coverage: "Observed Python profile entries only; cleanup fault retained, no implicit codec zero."
      }
    },
    audit,
    native_changes: {
      body_unchanged: true, changed_frontmatter_keys: changedMeta,
      added_frontmatter_values: Object.fromEntries(changedMeta.map((key) => [key, output.meta[key]])),
      normalization_count: audit.normalizations.length,
      exclusions_count: audit.count_exclusions.length,
      expected_row_override: false
    },
    task_count: tasks.length, task_numbers: tasks,
    requests_and_boundaries: facts.requests,
    incoming_boundary: facts.incoming_boundary ?? null,
    headings: facts.headings, exheads: facts.exheads,
    same_row_pairs: facts.same_row_pairs,
    blocks,
    figure_inventory: [], figure_labels: [], figure_geometry: [],
    crop_bindings: [], crop_hash_policy: "No figures or ROI crops exist; byte hashing only, no image opens for evidence.",
    caption_rows: [], open_cont: facts.open_cont, unknowns: facts.unknowns
  });
}

const report = {
  schema: "source10c7273/author-evidence@1",
  role: "ORIGINAL_SOURCE_AUTHOR",
  status: "AUTHORED_NATIVE_FINALIZE_EXIT0_WITH_INSTRUMENTATION_CLEANUP_FAULTS",
  independent_review: false,
  full_course_pass: false,
  scope: observations.scope,
  cwd: R,
  observations: bind(observationsPath),
  helper: bind(path.join(A, "bind_evidence.mjs")),
  preflight: observations.preflight,
  prepare_reused: { execution: prepareBinding, exit_code: prepare.exitCode, rerun: false, streams_and_trace_hashes_verified_without_image_open: true },
  protected_files: protectedFiles,
  model_image_usage: {
    fresh_context: true, ledger: observations.model_image_ledger,
    original_grid_payloads: 2, roi_payloads: 0, reopens: 0, all_payloads: 2,
    payload_ceiling: 4, original_ceiling: 2, roi_ceiling: 2,
    creation_actions_conservative: 2, creation_actions_ceiling: 6,
    hard_batch_ceiling: 8, context_ceiling: 24,
    parent_usage: "24/24 exhausted; returned text only",
    generated_images: 0, paid_model_calls_by_author_tools: 0,
    model_tool_internal_codec_calls: "UNKNOWN; not observed",
    native_calls_excluded_from_model_payload_ledger: true
  },
  native_image_usage: {
    scope: "This author's two first-finalize receipts only; prior prepare not rerun or double-counted.",
    entries: allEvents.length,
    observed_categories: frequencies(allEvents.map((event) => event.category)),
    observed_entrypoints: frequencies(allEvents.map((event) => `${event.module}.${event.method}`)),
    codec_calls_and_return_codes: "UNKNOWN",
    decode_operations_not_inferred_from_load_entry_count: true,
    image_payloads_returned_to_model_by_native_finalize: 0
  },
  pages,
  boundary_summary: {
    page72_incoming_shared_request_owners: ["211","212","213","214"],
    start: "ex211/ex212 first row, ex213/ex214 second row; independent pixel reading",
    closure: "ex214 before 求反余切的值：; no invented page72 request paragraph or cont",
    page71_request_text_source: "Human text-only hint, not pixel approval; page71 untouched.",
    page72_last_ex231: "complete",
    page73_incoming_ex232: "complete new task, not cont",
    previous_exercise_sequence_closure: "after ex237 before §18 / h3 89 on physical73",
    N89_start: "physical73 h3",
    N89_last_object: "p open ending 对; next-page continuation and full unit closure UNKNOWN"
  },
  sessions: {
    author_exec_cwd: "R for every exec",
    native_children: pages.map((p) => ({
      page: p.physical_page, pids: p.native_execution.trace_observed.pids,
      exited: true, exit_code: p.native_execution.exit_code
    })),
    active_exec_sessions: [], browsers_created: 0, browser_sessions_open: 0,
    background_processes_started: 0, all_author_sessions_closed: true
  },
  restrictions_observed: {
    no_backend_freshness_update_install_reinitialize: true,
    no_DB_publish_Git_deploy_chat_supervisor_peer_messages: true,
    no_new_dependencies_or_skill_code_edits: true,
    no_old_author_review_candidate_history_read: "Only explicitly authorized receipt_runner.py text and byte hashes of existing instrumentation; no old author/review reports.",
    no_OCR_answers_choices_math_inference: true,
    no_other_page_image_crop_or_page71_edit: true,
    no_assemble_vectorize_adapt_render_downstream_final_gates: true,
    no_count_geometry_exclusion_hack_or_fake_cont: true,
    first_raw_streams_traces_outputs_snapshots_preserved: true
  }
};
const output = path.join(A, "evidence.json");
const bytes = Buffer.from(`${JSON.stringify(report, null, 2)}\n`);
assert.ok(bytes.length <= 65536, `evidence exceeds 64 KiB bound: ${bytes.length}`);
fs.writeFileSync(output, bytes, { flag: "wx" });
console.log(JSON.stringify({
  evidence: bind(output), observations: bind(observationsPath),
  pages: pages.map((p) => ({
    page: p.physical_page, current: p.current_files, receipt: p.native_execution.receipt,
    exit_code: p.native_execution.exit_code, lines: [p.audit.lines_printed, p.audit.lines_md],
    tasks: p.task_count, normalizations: p.audit.normalizations.length,
    trace: p.native_execution.trace_observed
  })),
  faults: pages.length, active_exec_sessions: []
}, null, 2));
