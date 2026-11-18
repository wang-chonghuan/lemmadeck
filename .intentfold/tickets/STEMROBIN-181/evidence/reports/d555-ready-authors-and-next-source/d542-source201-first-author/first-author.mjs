import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(root, "source/10p/pages/0201");
const work = path.join(root, "work/10p/pages/0201");
const preparation = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d541-source201-first-preparation/manifest.json");
const manifestSHA = "dff3f608367dfd419a8856a3750bcba33c14ffa0f4f7c18daa2558c1636848c9";
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const limits = {
  fresh_bounded_context: true, inherited_images: 0, starting_images: 0,
  batch_limit: 8, context_limit: 24, parent_prior_images: 24,
  parent_budget_reset: false, old_reviewers_budget_reset: false,
  new_subagents: 0, permanent_A_D_replacements: 0
};
const load = (filename) => JSON.parse(fs.readFileSync(filename, "utf8"));
function binding(filename) {
  const bytes = fs.readFileSync(filename);
  return {
    path: filename, sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length, mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, "0")
  };
}
function safe(filename) {
  if (!path.resolve(filename).startsWith(root + path.sep)) throw new Error("write outside d542");
}
function writeNew(filename, data, readonly = false) {
  safe(filename);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
  if (readonly) fs.chmodSync(filename, 0o444);
  return binding(filename);
}
function copyNew(from, to) {
  safe(to);
  if (fs.existsSync(to)) throw new Error("copy destination already exists");
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true, force: false, errorOnExist: true });
}
function tree(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) return tree(filename);
      if (entry.isFile()) return [binding(filename)];
      throw new Error("nonregular evidence file");
    });
}
function verify(record, readonly = false) {
  const now = binding(record.path);
  if (now.sha256 !== record.sha256 || now.bytes !== record.bytes ||
      (readonly && now.mode !== "0444")) throw new Error("bound bytes or mode changed: " + record.path);
  return now;
}
function originals() {
  const inputs = load(path.join(root, "input-bindings.json"));
  if (inputs.manifest.sha256 !== manifestSHA) throw new Error("unexpected manifest");
  return [verify(inputs.manifest), ...inputs.originals.map((item) => verify(item))];
}
function ledger() {
  const directory = path.join(root, "image-open-events");
  const records = fs.existsSync(directory) ? fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort()
    .map((name) => load(path.join(directory, name))) : [];
  if (records.length > 8) throw new Error("image budget exceeded");
  const confirmed = records.filter((record) => fs.existsSync(path.join(root, "image-open-confirmations", `${record.sequence}.json`)));
  return {
    schema: "stemrobin181/source201-actual-opens@1", ...limits,
    opens: records, totals: {
      before: 0, new: records.length, cumulative: records.length,
      confirmed_observed: confirmed.length, batch_limit: 8, context_limit: 24
    }
  };
}
function init() {
  const manifest = binding(preparation);
  if (manifest.sha256 !== manifestSHA) throw new Error("preparation manifest hash mismatch");
  const data = load(preparation);
  if (data.book !== "10p" || data.pages.length !== 1 || data.pages[0] !== 201 ||
      data.prepareInvocations !== 1) throw new Error("unexpected preparation scope");
  const originalRecords = data.inputs.map((item) => {
    const record = binding(path.join(repo, item.path));
    if (record.sha256 !== item.sha256) throw new Error("prepared input hash mismatch");
    return record;
  });
  const input = writeNew(path.join(root, "input-bindings.json"), {
    schema: "stemrobin181/source201-isolated-prepared-copy@1",
    ticket: "STEMROBIN-181", batch: "d542", created_at: new Date().toISOString(),
    manifest, manifest_source_root: path.join(repo, data.sourceRoot),
    manifest_source_work: path.join(repo, data.sourceWork),
    manifest_source_root_existed: fs.existsSync(path.join(repo, data.sourceRoot)),
    originals: originalRecords, ...limits,
    input_hashes_saved_before_copy_and_image_read: true,
    copy_inputs_only: true, prepare_replays: 0, image_decodes_or_context_opens_in_copy_step: 0,
    canonical_writes: 0
  }, true);
  const copies = [];
  for (const directory of [source, work]) {
    for (const record of originalRecords) {
      const destination = path.join(directory, path.basename(record.path));
      copyNew(record.path, destination);
      const copy = binding(destination);
      if (copy.sha256 !== record.sha256) throw new Error("clone byte mismatch");
      copies.push({ ...copy, original: record.path });
    }
  }
  console.log(JSON.stringify({
    input,
    clone: writeNew(path.join(root, "clone-receipt.json"), {
      input, copies, copied_at: new Date().toISOString(), image_context_opens: 0,
      prepared_source_absent_work_inputs_cloned_to_both: !fs.existsSync(path.join(repo, data.sourceRoot))
    }, true)
  }));
}
function recordOpen(filename, purpose) {
  originals();
  if (fs.existsSync(path.join(root, "author-freeze.json"))) throw new Error("batch closed");
  const data = ledger();
  if (data.opens.length >= 8) throw new Error("no further image budget");
  safe(filename);
  const record = {
    sequence: data.opens.length + 1, image: binding(filename), purpose,
    recorded_before_image_read: new Date().toISOString(),
    tool: "functions.view_image", context_image_payloads: 1,
    fresh_context: true, inherited_images: 0
  };
  console.log(JSON.stringify(writeNew(path.join(root, "image-open-events", `${String(record.sequence).padStart(2, "0")}.json`), record, true)));
}
function confirmOpen(sequence) {
  const record = ledger().opens.find((item) => item.sequence === sequence);
  if (!record) throw new Error("missing before-open binding");
  verify(record.image);
  console.log(JSON.stringify(writeNew(path.join(root, "image-open-confirmations", `${sequence}.json`), {
    sequence, observed_at: new Date().toISOString(), image: record.image,
    actual_image_payload_observed: true
  }, true)));
}
function crop(name, box) {
  if (fs.existsSync(path.join(root, "author-freeze.json"))) throw new Error("batch closed");
  originals();
  if (!/^[a-z0-9-]+$/.test(name) || box.length !== 4 || !box.every(Number.isInteger)) throw new Error("invalid crop");
  const input = binding(path.join(work, "page.png"));
  const output = path.join(root, "crops", `${name}.png`);
  safe(output);
  if (fs.existsSync(output)) throw new Error("crop already exists; no replay");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const program = "from PIL import Image; import sys; Image.open(sys.argv[1]).crop(tuple(map(int, sys.argv[3:]))).save(sys.argv[2])";
  const result = spawnSync(python, ["-B", "-c", program, input.path, output, ...box.map(String)], {
    cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
  });
  console.log(JSON.stringify(writeNew(path.join(root, "crops", `${name}.receipt.json`), {
    input, box_xyxy: box, output: fs.existsSync(output) ? binding(output) : null,
    resizing_or_pixel_modification: false, image_context_opens: 0,
    exit_code: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? ""
  }, true)));
  if (result.status !== 0) throw new Error("crop failed; preserve without retry");
}
function observation() {
  const filename = path.join(root, "source-observation-freeze.json");
  const seal = binding(filename);
  if (seal.mode !== "0444") throw new Error("source observation not frozen");
  load(filename).files.forEach((item) => verify(item, true));
  return seal;
}
function sealObservation() {
  originals();
  copyNew(path.join(source, "page.md"), path.join(root, "source-observation/page.md"));
  const current = ledger();
  if (current.totals.confirmed_observed !== current.totals.new) throw new Error("unconfirmed image opening");
  writeNew(path.join(root, "actual-opens-before-native.json"), current, true);
  const files = [
    path.join(root, "input-bindings.json"), path.join(root, "clone-receipt.json"),
    path.join(root, "sourceinventory.json"), path.join(root, "boundary-fig174-owner.json"),
    path.join(root, "source-observation/page.md"), path.join(root, "actual-opens-before-native.json"),
    ...tree(path.join(root, "crops")).map((item) => item.path),
    ...tree(work).map((item) => item.path),
    ...tree(source).filter((item) => path.basename(item.path) !== "page.md").map((item) => item.path),
    ...tree(path.join(root, "image-open-events")).map((item) => item.path),
    ...tree(path.join(root, "image-open-confirmations")).map((item) => item.path)
  ];
  files.forEach((filename) => fs.chmodSync(filename, 0o444));
  const record = writeNew(path.join(root, "source-observation-freeze.json"), {
    schema: "stemrobin181/source201-first-author-observation-freeze@1",
    ticket: "STEMROBIN-181", batch: "d542", frozen_at: new Date().toISOString(),
    files: files.map(binding), source_md_before_normalization: binding(path.join(root, "source-observation/page.md")),
    original_source_observation_before_native: true, image_totals: current.totals, ...limits,
    SOURCE201: "AUTHOR_ONLY_PENDING_INDEPENDENT_SOURCE_REVIEW",
    native_is_not_source_truth: true, fullcard: false
  }, true);
  console.log(JSON.stringify(record));
}
function native(command) {
  const seal = observation();
  const directory = path.join(root, "native", `${command}-201-first`);
  if (fs.existsSync(directory)) throw new Error("first native attempt exists; no replay");
  if (command === "vectorize" && load(path.join(root, "native/finalize-201-first/receipt.json")).exit_code !== 0) {
    throw new Error("do not vectorize after failed finalize");
  }
  const originalBindings = originals();
  copyNew(source, path.join(directory, "before/source"));
  copyNew(work, path.join(directory, "before/work"));
  const runtime = path.join(root, "runtime-tmp");
  fs.mkdirSync(runtime, { recursive: true });
  const argv = ["-B", p2c, command, "--book", "10p", "--page", "201",
    "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    command, phase: "first", started_at: started, executable: python, argv, cwd: repo,
    observation: seal, source_before: tree(source), work_before: tree(work),
    originals_before: originalBindings, tools: [binding(p2c), binding(fileURLToPath(import.meta.url))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: runtime },
    context_image_opens: 0, no_new_prepare_or_fullproject: true
  }, true);
  const result = spawnSync(python, argv, {
    cwd: repo, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: runtime }
  });
  const stdout = writeNew(path.join(directory, "stdout.txt"), result.stdout ?? "", true);
  const stderr = writeNew(path.join(directory, "stderr.txt"), result.stderr ?? "", true);
  copyNew(source, path.join(directory, "after/source"));
  copyNew(work, path.join(directory, "after/work"));
  for (const stage of ["before", "after"]) tree(path.join(directory, stage)).forEach((item) => fs.chmodSync(item.path, 0o444));
  const receipt = writeNew(path.join(directory, "receipt.json"), {
    command, phase: "first", started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: result.status, signal: result.signal,
    error: result.error?.message ?? null, stdout, stderr,
    stdout_literal: result.stdout ?? "", stderr_literal: result.stderr ?? "",
    before_files: tree(path.join(directory, "before")), after_files: tree(path.join(directory, "after")),
    source_after: tree(source), work_after: tree(work), originals_after: originals(),
    all_first_attempt_bytes_retained: true, context_image_opens: 0,
    SOURCE201: "AUTHOR_ONLY_PENDING_INDEPENDENT_SOURCE_REVIEW",
    RAW_SVG: "PENDING_INDEPENDENT_PIXEL_REVIEW", native_is_not_source_truth: true
  }, true);
  console.log(JSON.stringify({ command, exit_code: result.status, stdout: result.stdout, stderr: result.stderr, receipt }));
}
function sealAll() {
  const seal = observation();
  const originalBindings = originals();
  const notes = load(path.join(root, "report-notes.json"));
  const current = ledger();
  if (current.totals.confirmed_observed !== current.totals.new) throw new Error("unconfirmed image opening");
  writeNew(path.join(root, "actual-opens.json"), current, true);
  const receipts = ["finalize", "vectorize"]
    .map((command) => path.join(root, "native", `${command}-201-first/receipt.json`))
    .filter((filename) => fs.existsSync(filename))
    .map((filename) => ({ ...binding(filename), exit_code: load(filename).exit_code }));
  tree(root).forEach((item) => fs.chmodSync(item.path, 0o444));
  const auditPath = path.join(source, "audit.json");
  const pagePath = path.join(source, "page.json");
  const report = writeNew(path.join(root, "report.json"), {
    ...notes, schema: "stemrobin181/source201-first-author-report@1", completed_at: new Date().toISOString(),
    observation: seal, actual_opens: binding(path.join(root, "actual-opens.json")),
    input_bindings: binding(path.join(root, "input-bindings.json")), originals_unchanged: originalBindings,
    native_receipts: receipts, page_md: binding(path.join(source, "page.md")),
    page_json: fs.existsSync(pagePath) ? binding(pagePath) : null,
    audit: fs.existsSync(auditPath) ? { ...binding(auditPath), literal: load(auditPath) } : null,
    first_source_transcription: binding(path.join(root, "source-observation/page.md")),
    boundary_and_owner: binding(path.join(root, "boundary-fig174-owner.json")),
    source_files: tree(source), work_files: tree(work),
    SOURCE201: "AUTHOR_ONLY_PENDING_INDEPENDENT_SOURCE_REVIEW",
    SOURCE_fidelity_independent_PASS: false, fullcard: false,
    canonical_consumption_authorized_or_performed: false
  }, true);
  const sealedFiles = tree(root);
  const freeze = writeNew(path.join(root, "author-freeze.json"), {
    schema: "stemrobin181/source201-first-author-freeze@1",
    ticket: "STEMROBIN-181", batch: "d542", root, frozen_at: new Date().toISOString(),
    files: sealedFiles, file_count_excluding_self: sealedFiles.length,
    total_files_including_self: sealedFiles.length + 1, all_listed_actual_modes: "0444", self_mode: "0444",
    source_observation_freeze: seal, originals_unchanged: originalBindings, native_receipts: receipts,
    native_finalize_attempts: receipts.filter((item) => item.path.includes("/finalize-")).length,
    native_vectorize_attempts: receipts.filter((item) => item.path.includes("/vectorize-")).length,
    SOURCE201: "AUTHOR_ONLY_PENDING_INDEPENDENT_SOURCE_REVIEW",
    RAW_SVG: "PENDING_INDEPENDENT_PIXEL_REVIEW",
    object_boundaries: notes.object_boundaries,
    n75_approved_complete: false, fullcard: false, image_totals: current.totals, ...limits,
    all_first_native_attempt_bytes_and_historical_FAIL_HOLD_preserved: true,
    no_DB_git_canonical_index_meter_consume_or_new_worker: true,
    batch_closed_no_further_image_opens: true, independent_review_requires_separate_fresh_batch: true
  }, true);
  sealedFiles.forEach((item) => verify(item, true));
  verify(freeze, true);
  originals();
  console.log(JSON.stringify({
    report, author_freeze: freeze, actual_opens: binding(path.join(root, "actual-opens.json")),
    boundary_and_owner: binding(path.join(root, "boundary-fig174-owner.json")),
    source_observation_freeze: seal, image_totals: current.totals, all_files_frozen_0444: true
  }));
}

const command = process.argv[2];
if (command === "init") init();
else if (command === "record-open") recordOpen(process.argv[3], process.argv[4]);
else if (command === "confirm-open") confirmOpen(Number(process.argv[3]));
else if (command === "crop") crop(process.argv[3], process.argv.slice(4).map(Number));
else if (command === "seal-observation") sealObservation();
else if (command === "finalize" || command === "vectorize") native(command);
else if (command === "seal") sealAll();
else throw new Error("unknown finite operation");
