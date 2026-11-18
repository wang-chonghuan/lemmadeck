import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d458-n71-q3-first-choice-author");
const seeds = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d456-n71-q3-first-choice-seeds");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const validator = path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const expected = {
  manifest: "410697a5157809f059c87e9d8943cddb31705798b6208c2ee259d05aef0be7c1",
  zh: "5eaa884a864ee730c2ff0500d65946abb60263bf3a3cda86846bf7c02ed4cca1",
  en: "7099044156788755bd3cce54ae218fb4b7f03cc27da51273872ca8f38712093f"
};
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
function verifiedInputs() {
  const records = [binding(path.join(seeds, "manifest.json"))];
  if (records[0].sha256 !== expected.manifest) throw new Error("Manifest changed");
  for (const locale of ["zh", "en"]) {
    const clone = path.join(seeds, locale, "repo");
    const seed = binding(path.join(clone, ".tmp/q3-seed.json"));
    if (seed.sha256 !== expected[locale]) throw new Error("Seed changed");
    records.push(seed);
    const data = JSON.parse(fs.readFileSync(seed.path, "utf8"));
    if (data.exercises.length !== 1 || data.exercises[0].number !== "3" ||
        JSON.stringify(data.concepts.map(item => item.block)) !== "[6,9,10,11,12]" ||
        data.figures.length !== 0 || data.exercises[0].figure_ids.length !== 0) {
      throw new Error("Seed selection or zero-image scope changed");
    }
    for (const item of data.trace) {
      const file = path.resolve(clone, item.path);
      if (!file.startsWith(clone + path.sep)) throw new Error("Trace outside seed clone");
      const current = binding(file);
      if (current.sha256 !== item.sha256) throw new Error("Whitelisted clone bytes changed");
      records.push(current);
    }
  }
  return records;
}
function init() {
  for (const locale of ["zh", "en"]) {
    if (fs.existsSync(path.join(root, locale, "draft.json"))) throw new Error("Draft preceded solution freeze");
  }
  const records = verifiedInputs();
  const code = "import sys,json,hashlib; print(json.dumps({p:hashlib.sha256(json.dumps(json.load(open(p)),sort_keys=True,ensure_ascii=True,separators=(',',':')).encode('utf-8')).hexdigest() for p in sys.argv[1:]}))";
  const argv = ["-c", code, ...["zh", "en"].map(locale => path.join(seeds, locale, "repo/.tmp/q3-seed.json"))];
  const digestRun = spawnSync(python, argv, { cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" } });
  if (digestRun.status !== 0) throw new Error("Canonical digest failed");
  const digests = JSON.parse(digestRun.stdout);
  writeNew(path.join(root, "input-bindings.json"), {
    schema: "d458-q3-whitelist-bindings@1", recorded_at: new Date().toISOString(),
    files: records, canonical_seed_digests: digests, digest_executable: python,
    digest_argv: argv, digest_exit_code: digestRun.status, digest_stdout: digestRun.stdout,
    digest_stderr: digestRun.stderr, seed_preparations: 0, answer_or_old_choice_reads: 0,
    documents: ["SKILL.md", "references/authoring.md", "references/contract.md"].map(name =>
      binding(path.join(repo, ".agents/skills/ld-s10y-choice", name)))
  });
  const prior = binding(path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d453-source196-first-author/actual-opens.json"));
  if (prior.sha256 !== "625299844d3068ef665157fa25546708cc58549622c3c5997bb90c50a8d63697") throw new Error("Prior open binding changed");
  writeNew(path.join(root, "actual-opens.json"), {
    schema: "d458-zero-image-batch@1", ticket: "STEMROBIN-181",
    helper: "same-existing-finite-helper", prior_record: prior,
    prior_actual_opens: 16, batch_actual_opens: 0, batch_limit: 0,
    context_cumulative_opens: 16, context_cumulative_limit: 24,
    no_budget_reset: true, source_images_opened: 0, candidate_images_opened: 0,
    reopens: 0, entries: [], images_returned_to_parent: 0, batch_complete: true
  });
  const solution = path.join(root, "source-solution.md");
  fs.chmodSync(solution, 0o444);
  writeNew(path.join(root, "solution-freeze.json"), {
    schema: "d458-independent-source-solution-freeze@1", frozen_at: new Date().toISOString(),
    solution: binding(solution), source_bindings: binding(path.join(root, "input-bindings.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")), solution_mode: "0444",
    drafts_absent_at_freeze: true, options_constructed_at_freeze: false,
    selected_original_questions: ["3"], omitted_original_questions: ["1", "2"],
    independent_review: "PENDING"
  });
  for (const name of ["solution-freeze.json", "input-bindings.json", "actual-opens.json"]) {
    fs.chmodSync(path.join(root, name), 0o444);
  }
  console.log(JSON.stringify({ solution: binding(solution), canonical_seed_digests: digests }, null, 2));
}
function validate(locale) {
  if (!["zh", "en"].includes(locale)) throw new Error("Unauthorized locale");
  const directory = path.join(root, locale, "native-first-validate");
  if (fs.existsSync(directory)) throw new Error("First validate retained; no repeated attempt");
  const draft = path.join(root, locale, "draft.json");
  const solutionFreeze = JSON.parse(fs.readFileSync(path.join(root, "solution-freeze.json"), "utf8"));
  if (binding(solutionFreeze.solution.path).sha256 !== solutionFreeze.solution.sha256 ||
      (fs.statSync(solutionFreeze.solution.path).mode & 0o777) !== 0o444) {
    throw new Error("Frozen source solution changed");
  }
  const original = verifiedInputs();
  const argv = [validator, "--repo", path.join(seeds, locale, "repo"),
    "--seed", path.join(seeds, locale, "repo/.tmp/q3-seed.json"), "--draft", draft];
  const started = new Date().toISOString();
  writeNew(path.join(directory, "started.json"), {
    locale, started_at: started, executable: python, argv, cwd: repo,
    draft_before: binding(draft), source_before: original,
    solution_freeze: binding(path.join(root, "solution-freeze.json")),
    tools: [binding(validator), binding(fs.realpathSync(python)), binding(path.join(root, "first-author.mjs"))],
    environment_overrides: { PYTHONDONTWRITEBYTECODE: "1" }, attempt: 1
  });
  const run = spawnSync(python, argv, {
    cwd: repo, encoding: "utf8", env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 8 * 1024 * 1024
  });
  writeNew(path.join(directory, "stdout.txt"), run.stdout ?? "");
  writeNew(path.join(directory, "stderr.txt"), run.stderr ?? "");
  writeNew(path.join(directory, "receipt.json"), {
    locale, started_at: started, finished_at: new Date().toISOString(),
    executable: python, argv, cwd: repo, attempt: 1, exit_code: run.status,
    signal: run.signal, error: run.error?.message ?? null, draft_after: binding(draft),
    stdout: binding(path.join(directory, "stdout.txt")), stderr: binding(path.join(directory, "stderr.txt")),
    source_after: verifiedInputs(), review_argument_supplied: false,
    independent_review: "PENDING", semantic_approval_claimed: false
  });
  console.log(JSON.stringify({ locale, exit_code: run.status, stdout: run.stdout,
    stderr: run.stderr, receipt: path.join(directory, "receipt.json") }, null, 2));
}
function seal() {
  const files = tree(root);
  const freeze = path.join(root, "author-freeze.json");
  writeNew(freeze, {
    schema: "d458-q3-first-choice-author-freeze@1", ticket: "STEMROBIN-181",
    frozen_at: new Date().toISOString(), root, report: binding(path.join(root, "report.json")),
    solution_freeze: binding(path.join(root, "solution-freeze.json")),
    actual_opens: binding(path.join(root, "actual-opens.json")),
    unchanged_inputs: verifiedInputs(), files, all_final_files_mode: "0444",
    independent_review: "PENDING", complete_choices_coverage: false, no_budget_reset: true
  });
  for (const item of [...files, binding(freeze)]) fs.chmodSync(item.path, 0o444);
  for (const name of ["report.json", "author-freeze.json", "solution-freeze.json",
    "source-solution.md", "actual-opens.json", "zh/draft.json", "en/draft.json",
    "zh/native-first-validate/receipt.json", "en/native-first-validate/receipt.json"]) {
    console.log(JSON.stringify(binding(path.join(root, name))));
  }
}
const [command, locale] = process.argv.slice(2);
if (command === "init") init();
else if (command === "validate") validate(locale);
else if (command === "seal") seal();
else throw new Error("Unknown bounded operation");
