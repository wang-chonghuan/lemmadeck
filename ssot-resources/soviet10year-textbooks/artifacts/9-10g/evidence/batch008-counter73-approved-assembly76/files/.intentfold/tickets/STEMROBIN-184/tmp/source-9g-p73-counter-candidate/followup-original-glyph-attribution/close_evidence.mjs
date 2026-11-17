import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const previous = path.dirname(here);
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const before = JSON.parse(fs.readFileSync(path.join(here, "before.json")));
const [mode] = process.argv.slice(2);

function save(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
}

function json(file, value) {
  save(file, JSON.stringify(value, null, 2) + "\n");
}

function identity(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
}

function walk(directory, skipFollowup = false) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (skipFollowup && file === here) return [];
    return entry.isDirectory() ? walk(file, skipFollowup) : [identity(file)];
  }).sort((a, b) => a.path.localeCompare(b.path));
}

function protect() {
  const current = walk(previous, true);
  if (JSON.stringify(current) !== JSON.stringify(before.previous_inventory)) {
    throw new Error("An original v1-v3 file changed");
  }
  for (const file of before.files) {
    if (identity(file.path).sha256 !== file.sha256) throw new Error(`Frozen file changed: ${file.path}`);
  }
  if (identity(path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py")).sha256
    !== before.production_sha256
    || identity(path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md")).sha256
    !== before.report_sha256) throw new Error("Frozen production/report changed");
}

protect();
if (mode === "capture") {
  const files = before.files.map(file => {
    const destination = path.join(here, "after", path.relative(here, file.retained_path));
    save(destination, fs.readFileSync(file.path));
    return { ...identity(file.path), before_sha256: file.sha256, unchanged: true,
      retained_path: destination, retained_sha256: identity(destination).sha256 };
  });
  const candidate = path.join(here, "candidate/layout.py");
  save(path.join(here, "after/candidate/layout.py"), fs.readFileSync(candidate));
  save(path.join(here, "after/test_contracts.py"), fs.readFileSync(path.join(here, "test_contracts.py")));
  save(path.join(here, "after/test_carriers.py"), fs.readFileSync(path.join(here, "test_carriers.py")));
  const outsideFiles = ["result.json", "stdout.raw", "stderr.raw"].map(name => {
    const source = path.join(previous, "protected/existing-outside-failure", name);
    const destination = path.join(here, "protected/existing-outside-failure", name);
    save(destination, fs.readFileSync(source));
    return { ...identity(source), retained: identity(destination) };
  });
  const outside = JSON.parse(fs.readFileSync(outsideFiles[0].path));
  if (outside.exit !== 1 || outside.stderr_sha256 !== outsideFiles[2].sha256) {
    throw new Error("Original strict outside identity does not match");
  }
  json(path.join(here, "existing-outside-failure-identity.json"), {
    exit: 1, original_command: outside.command, rerun: false,
    assertion_or_region_changed: false, files: outsideFiles,
  });
  const p76Before = JSON.parse(fs.readFileSync(path.join(here, "p76-before.json")));
  for (const file of p76Before.files) {
    if (identity(file.path).sha256 !== file.sha256) throw new Error("p76 comparison input changed");
  }
  json(path.join(here, "after.json"), {
    captured_at: new Date().toISOString(),
    production_and_released_report_unchanged: true,
    previous_v1_v3_inventory_exactly_unchanged: true,
    previous_files_count: before.previous_inventory.length,
    previous_inventory: walk(previous, true), files,
    p76_inputs: p76Before.files.map(file => ({ ...identity(file.path), unchanged: true })),
    final_candidate: identity(candidate),
    final_candidate_bytes: identity(path.join(here, "after/candidate/layout.py")),
  });
  const commands = fs.readdirSync(path.join(here, "commands")).sort().map(label => {
    const resultPath = path.join(here, "commands", label, "result.json");
    const result = JSON.parse(fs.readFileSync(resultPath));
    if (identity(result.stdout.path).sha256 !== result.stdout.sha256
      || identity(result.stderr.path).sha256 !== result.stderr.sha256) {
      throw new Error(`Raw evidence changed: ${label}`);
    }
    return { label, ...result, result: identity(resultPath) };
  });
  json(path.join(here, "command-identities.json"), commands);
  const lines = ["# Actual Command Identities", "",
    "These are the actual child argv, cwd, timestamps, exits and exact raw streams.",
    "The node evidence.mjs wrapper retains each command's code and script snapshots.",
    "No exit1 stream is rewritten. No finalize/prepare/source gate was executed.", ""];
  for (const command of commands) {
    lines.push(`## ${command.label}`, "",
      `argv: \`${JSON.stringify(command.command)}\``,
      `cwd: \`${command.cwd}\``,
      `exit: ${command.exit}; started: ${command.started_at}; finished: ${command.finished_at}`,
      `result: \`${command.result.path}\``,
      `result SHA256: \`${command.result.sha256}\``,
      `stdout: \`${command.stdout.path}\``,
      `stdout SHA256: \`${command.stdout.sha256}\``,
      `stderr: \`${command.stderr.path}\``,
      `stderr SHA256: \`${command.stderr.sha256}\``,
      ...(command.candidate ? [`candidate SHA256: \`${command.candidate.sha256}\``] : []),
      ...(command.script ? [`script SHA256: \`${command.script.sha256}\``] : []), "");
  }
  save(path.join(here, "command-identities.md"), lines.join("\n") + "\n");
  protect();
  console.log(JSON.stringify({
    after: identity(path.join(here, "after.json")),
    command_identities: identity(path.join(here, "command-identities.md")),
    candidate: identity(candidate),
    v3_diff: identity(path.join(here, "v3-to-followup.diff")),
    baseline_diff: identity(path.join(here, "baseline-to-followup.diff")),
    commands: commands.map(command => ({ label: command.label, exit: command.exit })),
    prior_files_unchanged: before.previous_inventory.length,
  }, null, 2));
} else if (mode === "manifest") {
  const comparison = JSON.parse(fs.readFileSync(path.join(here, "comparison-v5.json")));
  const finalTests = JSON.parse(fs.readFileSync(path.join(here, "tests-v5.json")));
  const carrierTests = JSON.parse(fs.readFileSync(path.join(here, "carrier-tests-v5.json")));
  const scope = JSON.parse(fs.readFileSync(path.join(here, "code-test-scope.json")));
  const after = JSON.parse(fs.readFileSync(path.join(here, "after.json")));
  if (identity(path.join(here, "candidate/layout.py")).sha256 !== after.final_candidate.sha256) {
    throw new Error("Candidate changed after final capture");
  }
  const commands = JSON.parse(fs.readFileSync(path.join(here, "command-identities.json")));
  const manifest = {
    ticket: "STEMROBIN-184",
    scope: "additive isolated original-versus-residual full-glyph attribution; read-only68-76 comparison",
    state: "candidate only; promotion not authorized; retained pre-existing small-row FAIL",
    production: identity(path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py")),
    released_report: identity(path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md")),
    candidate: identity(path.join(here, "candidate/layout.py")),
    before: identity(path.join(here, "before.json")),
    after: identity(path.join(here, "after.json")),
    report: identity(path.join(here, "report.md")),
    diffs: ["v3-to-followup.diff", "baseline-to-followup.diff"].map(name => identity(path.join(here, name))),
    command_identities: identity(path.join(here, "command-identities.md")),
    approved19_tests_unchanged_and_passing: true,
    final_tests: finalTests, final_carrier_tests: carrierTests, code_scope: scope,
    complete_followup_suite_green: false,
    retained_failures: {
      initial_v4_full_contracts: identity(path.join(here, "commands/candidate-v4-contracts/result.json")),
      initial_v4_carrier_contracts: identity(path.join(here, "commands/candidate-v4-carrier-contracts/result.json")),
      final_v5_full_contracts: identity(path.join(here, "commands/candidate-v5-contracts/result.json")),
      final_failure_cause: "small23px vector shafts remain separate raw bands in eb6/v3/v4/v5; not expanded into this attribution patch",
      original_strict_outside: identity(path.join(here, "existing-outside-failure-identity.json")),
      original_v1_v3_files_exactly_unchanged: before.previous_inventory.length,
    },
    comparison: {
      file: identity(path.join(here, "comparison-v5.json")),
      all_v3_followup_bands_identical: comparison.pages.every(page => page.v3_to_followup_exact_bands_equal),
      baseline_changed_pages: comparison.pages.filter(page => !page.baseline_to_followup_exact_bands_equal).map(page => page.page),
      pages: comparison.pages.map(page => ({
        page: page.page, counts: page.counts,
        baseline_changes: page.baseline_to_followup_changes,
        v3_changes: page.v3_to_followup_changes,
      })),
    },
    commands,
    constraints: { production_edits: 0, source_or_review_edits: 0, prepare: 0, finalize: 0,
      source_gates: 0, images_or_browsers: 0, exclusions_or_expected_overrides: 0,
      thresholds_raised: 0, automatic_promotion: 0, dependencies_services_or_git: 0,
      other_worker_edits: 0, test_assertions_weakened: 0 },
    artifacts: walk(here),
  };
  json(path.join(here, "manifest.json"), manifest);
  protect();
  console.log(JSON.stringify({
    report: manifest.report, candidate: manifest.candidate, production: manifest.production,
    released_report: manifest.released_report, diffs: manifest.diffs,
    commands: manifest.command_identities, manifest: identity(path.join(here, "manifest.json")),
    complete_suite_green: manifest.complete_followup_suite_green,
    final_carrier_tests_passed: carrierTests.passed,
    exact_band_comparison_passed: manifest.comparison.all_v3_followup_bands_identical,
  }, null, 2));
} else {
  throw new Error("Expected capture or manifest");
}
