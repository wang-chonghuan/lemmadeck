import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d473-n71-q12-first-choice-author");
const manifestPath = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d472-n71-q12-first-choice-seeds/manifest.json");
const expected = "d7275acd1acc5ab9a7425ab487a9da2ed64eee875208b2c8c88205c789e2965b";
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const validator = path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py");

function binding(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: crypto.createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}
function writeNew(file, data) {
  if (!file.startsWith(root + path.sep)) throw new Error("Write outside authorized root");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
}
function tree(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? tree(file) : entry.isFile() ? [binding(file)] : [];
  });
}
function manifest() {
  if (binding(manifestPath).sha256 !== expected) throw new Error("Manifest changed");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}
function selection(locale) {
  if (!["zh", "en"].includes(locale)) throw new Error("Unauthorized locale");
  const item = manifest().seeds.find(value => value.language === locale);
  if (!item) throw new Error("Missing locale in manifest");
  return { repo: path.resolve(repo, item.repo), seed: path.resolve(repo, item.seed.path) };
}
function verifiedInputs() {
  const records = [binding(manifestPath)];
  for (const item of manifest().seeds) {
    for (const expectedFile of [item.seed, ...item.bindings, item.bookBinding]) {
      const record = binding(path.resolve(repo, expectedFile.path));
      if (record.sha256 !== expectedFile.sha256) throw new Error("Whitelisted input changed");
      records.push(record);
    }
    const seed = JSON.parse(fs.readFileSync(path.resolve(repo, item.seed.path), "utf8"));
    if (JSON.stringify(seed.exercises.map(value => value.number)) !== '["1","2"]' ||
        seed.concepts.length || seed.figures.length || seed.source.concept_figure_ids.length ||
        seed.exercises.some(value => value.figure_ids.length)) throw new Error("Selection/no-concepts/no-image scope changed");
  }
  return records;
}
function init() {
  if (["zh", "en"].some(locale => fs.existsSync(path.join(root, locale, "draft.json")))) throw new Error("Draft precedes solution freeze");
  const files = verifiedInputs();
  const code = "import sys,json,hashlib; print(json.dumps({p:hashlib.sha256(json.dumps(json.load(open(p)),sort_keys=True,ensure_ascii=True,separators=(',',':')).encode()).hexdigest() for p in sys.argv[1:]}))";
  const argv = ["-c", code, selection("zh").seed, selection("en").seed];
  const run = spawnSync(python, argv, { cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" } });
  if (run.status !== 0) throw new Error("Canonical seed digest failed");
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "d473-whitelist-input-bindings@1", recorded_at: new Date().toISOString(),
    files, canonical_seed_digests: JSON.parse(run.stdout), digest_executable: python,
    digest_argv: argv, digest_exit_code: run.status, digest_stdout: run.stdout, digest_stderr: run.stderr,
    no_concepts: true, prepare_or_inspect_runs: 0, answer_or_old_choice_reads: 0,
    skill_documents: ["SKILL.md", "references/authoring.md", "references/contract.md"].map(name =>
      binding(path.join(repo, ".agents/skills/ld-s10y-choice", name)))
  });
  const prior = binding(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d467-source197-first-author/actual-opens.json"));
  if (prior.sha256 !== "7a29ae8c511cfdaad7e19a070f0e889ba8b2cb7a898dab55e5bf03b994043431" ||
      JSON.parse(fs.readFileSync(prior.path, "utf8")).context_cumulative_opens !== 18) throw new Error("Prior ledger changed");
  writeNew(path.join(root, "actual-opens.json"), {
    schema: "d473-zero-image-batch@1", ticket: "STEMROBIN-181", prior_record: prior,
    prior_actual_opens: 18, batch_actual_opens: 0, context_cumulative_opens: 18,
    context_cumulative_limit: 24, no_budget_reset: true, entries: [], reopens: 0,
    source_or_candidate_images_opened: 0, images_returned_to_parent: 0, batch_complete: true
  });
  const solution = path.join(root, "source-solution.md");
  fs.chmodSync(solution, 0o444);
  writeNew(path.join(root, "solution-freeze.json"), {
    schema: "d473-pre-option-source-solution-freeze@1", frozen_at: new Date().toISOString(),
    source_solution: binding(solution), input_bindings: binding(path.join(root, "input-bindings.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")), solution_mode: "0444",
    option_bearing_drafts_absent: true, selected_original_questions: ["1", "2"],
    independent_review: "PENDING"
  });
  for (const name of ["input-bindings.json", "actual-opens.json", "solution-freeze.json"]) fs.chmodSync(path.join(root, name), 0o444);
  console.log(JSON.stringify({ solution: binding(solution), canonical_seed_digests: JSON.parse(run.stdout) }, null, 2));
}
function validate(locale, phase = "first") {
  const input = selection(locale);
  if (!["first", "affected"].includes(phase) ||
      (phase === "affected" && !fs.existsSync(path.join(root, locale, "local-repair.json")))) throw new Error("Unauthorized validation phase");
  const directory = path.join(root, locale, `native-${phase}-validate`);
  if (fs.existsSync(directory)) throw new Error("Native attempt already retained");
  const draft = path.join(root, locale, "draft.json");
  const solutionFreeze = JSON.parse(fs.readFileSync(path.join(root, "solution-freeze.json"), "utf8"));
  if (binding(solutionFreeze.source_solution.path).sha256 !== solutionFreeze.source_solution.sha256) throw new Error("Source solution changed");
  const originals = verifiedInputs();
  writeNew(path.join(directory, "draft.before.json"), fs.readFileSync(draft, "utf8"));
  const argv = [validator, "--repo", input.repo, "--seed", input.seed, "--draft", draft];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    locale, phase, started_at: started, executable: python, argv, cwd: repo,
    draft_before: binding(draft), source_before: originals,
    solution_freeze: binding(path.join(root, "solution-freeze.json")),
    tools: [binding(validator), binding(fs.realpathSync(python)), binding(path.join(root, "first-author.mjs"))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1" }
  });
  const run = spawnSync(python, argv, { cwd: repo, encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, maxBuffer: 8 * 1024 * 1024 });
  writeNew(path.join(directory, "stdout.txt"), run.stdout ?? "");
  writeNew(path.join(directory, "stderr.txt"), run.stderr ?? "");
  writeNew(path.join(directory, "receipt.json"), {
    locale, phase, started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, exit_code: run.status, signal: run.signal,
    error: run.error?.message ?? null, draft_after: binding(draft),
    stdout: binding(path.join(directory, "stdout.txt")), stderr: binding(path.join(directory, "stderr.txt")),
    source_after: verifiedInputs(), review_supplied: false, independent_review: "PENDING"
  });
  console.log(JSON.stringify({ locale, phase, exit_code: run.status, stdout: run.stdout,
    stderr: run.stderr, receipt: path.join(directory, "receipt.json") }, null, 2));
}
function seal() {
  const files = tree(root);
  const freeze = path.join(root, "author-freeze.json");
  writeNew(freeze, {
    schema: "d473-q12-first-choice-author-freeze@1", root, ticket: "STEMROBIN-181",
    frozen_at: new Date().toISOString(), report: binding(path.join(root, "report.json")),
    source_solution: binding(path.join(root, "source-solution.md")),
    actual_opens: binding(path.join(root, "actual-opens.json")), files,
    unchanged_inputs: verifiedInputs(), final_mode: "0444",
    independent_review: "PENDING", complete_n71: false, no_budget_reset: true
  });
  for (const item of [...files, binding(freeze)]) fs.chmodSync(item.path, 0o444);
  for (const name of ["report.json", "author-freeze.json", "source-solution.md", "solution-freeze.json",
    "actual-opens.json", "zh/draft.json", "en/draft.json",
    "zh/native-first-validate/receipt.json", "en/native-first-validate/receipt.json"]) console.log(JSON.stringify(binding(path.join(root, name))));
}
const [command, locale, phase] = process.argv.slice(2);
if (command === "init") init();
else if (command === "validate") validate(locale, phase);
else if (command === "seal") seal();
else throw new Error("Unknown bounded operation");
