import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(root, "source/10p/pages/0199");
const work = path.join(root, "work/10p/pages/0199");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const manifestSHA = "0d76728f26849b2659460217f31a0e5f9671cd9fa5f44c5bd15e9313c1e9867e";

function binding(filename) {
  const bytes = fs.readFileSync(filename);
  return {
    path: filename,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    mode: (fs.statSync(filename).mode & 0o777).toString(8).padStart(4, "0")
  };
}
const load = (filename) => JSON.parse(fs.readFileSync(filename, "utf8"));
function safe(filename) {
  if (!filename.startsWith(root + path.sep)) throw new Error("write outside d524");
}
function writeNew(filename, data) {
  safe(filename);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
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
  const current = binding(record.path);
  if (current.sha256 !== record.sha256 || current.bytes !== record.bytes ||
      (readonly && current.mode !== "0444")) throw new Error("bound bytes or mode changed: " + record.path);
  return current;
}
function originals() {
  const inputs = load(path.join(root, "input-bindings.json"));
  if (inputs.manifest.sha256 !== manifestSHA) throw new Error("unexpected preparation manifest");
  return [verify(inputs.manifest), ...inputs.originals.map((item) => verify(item))];
}
function observation() {
  const filename = path.join(root, "source-observation-freeze.json");
  const seal = binding(filename);
  if (seal.mode !== "0444") throw new Error("observation not sealed");
  const data = load(filename);
  data.files.forEach((item) => verify(item, true));
  const ledger = load(path.join(root, "actual-opens.json"));
  if (ledger.totals.old !== 23 || ledger.totals.new !== 1 || ledger.totals.cumulative !== 24 ||
      ledger.opens.length !== 1) throw new Error("actual context image ledger changed");
  return seal;
}
function sealObservation() {
  originals();
  const snapshot = path.join(root, "source-observation/page.md");
  copyNew(path.join(source, "page.md"), snapshot);
  const filenames = [
    path.join(root, "sourceinventory.json"),
    path.join(root, "actual-opens.json"),
    path.join(root, "input-bindings.json"),
    snapshot
  ];
  filenames.forEach((filename) => fs.chmodSync(filename, 0o444));
  const seal = writeNew(path.join(root, "source-observation-freeze.json"), {
    schema: "stemrobin181/source199-first-author-observation-freeze@1",
    ticket: "STEMROBIN-181",
    batch: "d524",
    frozen_at: new Date().toISOString(),
    files: filenames.map(binding),
    observed_wholepage_once: true,
    original_source_observation_before_native: true,
    source_md_before_normalization: binding(snapshot),
    image_totals: { old: 23, new: 1, cumulative: 24, limit: 24, budget_reset: false },
    extra_images_forbidden: true,
    SOURCE199: "AUTHOR/native-only-HOLD",
    independent_reviews: "HOLD_NO_REVIEWER_CAPACITY",
    n75_complete: false,
    fullcard: false
  });
  fs.chmodSync(seal.path, 0o444);
  console.log(JSON.stringify(binding(seal.path)));
}
function native(command) {
  if (!["finalize", "vectorize"].includes(command)) throw new Error("unauthorized native operation");
  const seal = observation();
  const directory = path.join(root, "native", `${command}-199-first`);
  if (fs.existsSync(directory)) throw new Error("first native attempt exists; no replay authorized");
  if (command === "vectorize") {
    const first = load(path.join(root, "native/finalize-199-first/receipt.json"));
    if (first.exit_code !== 0) throw new Error("do not vectorize after failed first finalize");
  }
  const originalBindings = originals();
  copyNew(source, path.join(directory, "before/source"));
  copyNew(work, path.join(directory, "before/work"));
  const runtime = path.join(root, "runtime-tmp");
  fs.mkdirSync(runtime, { recursive: true });
  const argv = [p2c, command, "--book", "10p", "--page", "199",
    "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    command,
    phase: "first",
    started_at: started,
    executable: python,
    argv,
    cwd: repo,
    observation: seal,
    source_before: tree(source),
    work_before: tree(work),
    originals_before: originalBindings,
    tools: [binding(p2c), binding(fileURLToPath(import.meta.url))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: runtime },
    image_opens: 0,
    no_new_prepare_or_fullproject: true
  });
  const result = spawnSync(python, argv, {
    cwd: repo,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: runtime }
  });
  const stdout = writeNew(path.join(directory, "stdout.txt"), result.stdout ?? "");
  const stderr = writeNew(path.join(directory, "stderr.txt"), result.stderr ?? "");
  copyNew(source, path.join(directory, "after/source"));
  copyNew(work, path.join(directory, "after/work"));
  const receipt = writeNew(path.join(directory, "receipt.json"), {
    command,
    phase: "first",
    started_at: started,
    finished_at: new Date().toISOString(),
    executable: python,
    argv,
    cwd: repo,
    exit_code: result.status,
    signal: result.signal,
    error: result.error?.message ?? null,
    stdout,
    stderr,
    stdout_literal: result.stdout ?? "",
    stderr_literal: result.stderr ?? "",
    source_after: tree(source),
    work_after: tree(work),
    originals_after: originals(),
    all_first_attempt_bytes_retained: true,
    SOURCE199: "AUTHOR/native-only-HOLD",
    RAW_SVG: "HOLD_NOT_INDEPENDENTLY_OBSERVED",
    native_is_not_source_truth: true,
    image_opens: 0,
    native_processing_does_not_reset_context_images: true,
    image_totals: { old: 23, new: 1, cumulative: 24, limit: 24, budget_reset: false }
  });
  console.log(JSON.stringify({ command, exit_code: result.status, stdout: result.stdout,
    stderr: result.stderr, receipt }));
}
function sealAll() {
  const seal = observation();
  const originalBindings = originals();
  const notes = load(path.join(root, "report-notes.json"));
  const nativeReceipts = ["finalize", "vectorize"]
    .map((command) => path.join(root, "native", `${command}-199-first/receipt.json`))
    .filter((filename) => fs.existsSync(filename))
    .map((filename) => ({ ...binding(filename), exit_code: load(filename).exit_code }));
  const auditPath = path.join(source, "audit.json");
  const pagePath = path.join(source, "page.json");
  const report = writeNew(path.join(root, "report.json"), {
    ...notes,
    schema: "stemrobin181/source199-first-author-report@1",
    completed_at: new Date().toISOString(),
    observation: seal,
    actual_opens: binding(path.join(root, "actual-opens.json")),
    input_bindings: binding(path.join(root, "input-bindings.json")),
    originals_unchanged: originalBindings,
    native_receipts: nativeReceipts,
    page_md: binding(path.join(source, "page.md")),
    page_json: fs.existsSync(pagePath) ? binding(pagePath) : null,
    audit: fs.existsSync(auditPath) ? { ...binding(auditPath), literal: load(auditPath) } : null,
    first_source_transcription: binding(path.join(root, "source-observation/page.md")),
    source_files: tree(source),
    work_files: tree(work),
    SOURCE199: "AUTHOR/native-only-HOLD",
    SOURCE_fidelity_independent_PASS: false,
    n75_complete: false,
    fullcard: false,
    canonical_consumption_authorized_or_performed: false
  });
  const files = tree(root);
  files.forEach((item) => fs.chmodSync(item.path, 0o444));
  const sealedFiles = files.map((item) => binding(item.path));
  const freeze = writeNew(path.join(root, "author-freeze.json"), {
    schema: "stemrobin181/source199-first-author-freeze@1",
    ticket: "STEMROBIN-181",
    batch: "d524",
    root,
    frozen_at: new Date().toISOString(),
    files: sealedFiles,
    file_count_excluding_self: sealedFiles.length,
    total_files_including_self: sealedFiles.length + 1,
    all_listed_actual_modes: "0444",
    self_mode: "0444",
    source_observation_freeze: seal,
    originals_unchanged: originalBindings,
    native_receipts: nativeReceipts.map((item) => ({ ...binding(item.path), exit_code: item.exit_code })),
    native_finalize_attempts: 1,
    native_vectorize_attempts: nativeReceipts.filter((item) => item.path.includes("/vectorize-")).length,
    SOURCE199: "AUTHOR/native-only-HOLD",
    text_RAW_SVG_independent_review: "HOLD_NO_IMAGE_CAPACITY",
    n75_complete: false,
    fullcard: false,
    image_totals: { old: 23, new: 1, cumulative: 24, limit: 24, budget_reset: false },
    all_first_native_attempt_bytes_and_historical_FAIL_HOLD_preserved: true,
    no_DB_git_canonical_index_meter_consume_or_new_worker: true
  });
  fs.chmodSync(freeze.path, 0o444);
  sealedFiles.forEach((item) => verify(item, true));
  if (binding(freeze.path).mode !== "0444") throw new Error("freeze not readonly");
  originals();
  console.log(JSON.stringify({
    report: binding(report.path),
    author_freeze: binding(freeze.path),
    actual_opens: binding(path.join(root, "actual-opens.json")),
    source_observation_freeze: seal,
    native_receipts: nativeReceipts.map((item) => ({ ...binding(item.path), exit_code: item.exit_code })),
    image_totals: { old: 23, new: 1, cumulative: 24, limit: 24, budget_reset: false }
  }));
}

const command = process.argv[2];
if (command === "seal-observation") sealObservation();
else if (command === "finalize" || command === "vectorize") native(command);
else if (command === "seal") sealAll();
else throw new Error("unknown finite operation");
