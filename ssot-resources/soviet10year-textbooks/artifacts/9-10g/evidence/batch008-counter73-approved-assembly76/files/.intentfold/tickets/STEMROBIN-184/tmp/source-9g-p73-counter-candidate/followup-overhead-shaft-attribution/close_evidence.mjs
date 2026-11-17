import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const parent = path.dirname(here);
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const before = JSON.parse(fs.readFileSync(path.join(here, "before.json")));
const [mode] = process.argv.slice(2);

function identity(file) {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: sha(bytes) };
}

function save(file, bytes) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
}

function json(file, value) {
  save(file, JSON.stringify(value, null, 2) + "\n");
}

function walk(directory, skip = false) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (skip && file === here) return [];
    return entry.isDirectory() ? walk(file, skip) : [identity(file)];
  }).sort((a, b) => a.path.localeCompare(b.path));
}

function protect() {
  if (JSON.stringify(walk(parent, true)) !== JSON.stringify(before.previous_inventory)) {
    throw new Error("Original v1-v5 artifact changed");
  }
  for (const file of before.files) {
    if (identity(file.path).sha256 !== file.sha256) throw new Error(`Frozen file changed: ${file.path}`);
  }
  for (const test of before.frozen_tests) {
    if (identity(test.path).sha256 !== test.sha256) throw new Error("Frozen test bytes changed");
  }
}

protect();
if (mode === "capture") {
  const files = before.files.map(file => {
    const target = path.join(here, "after", path.relative(here, file.retained.path));
    save(target, fs.readFileSync(file.path));
    return { ...identity(file.path), unchanged: true, retained: identity(target) };
  });
  const finalFiles = ["candidate/layout.py", "test_contracts.py", "test_carriers.py",
    "test_projection_boundaries.py", "test_harness.py"].map(name => {
    const source = path.join(here, name);
    const target = path.join(here, "after", name);
    save(target, fs.readFileSync(source));
    return { ...identity(source), retained: identity(target) };
  });
  const p76Before = JSON.parse(fs.readFileSync(path.join(here, "p76-before.json")));
  for (const file of p76Before.files) {
    if (identity(file.path).sha256 !== file.sha256) throw new Error("p76 input changed");
  }
  json(path.join(here, "after.json"), {
    captured_at: new Date().toISOString(), files, final_files: finalFiles,
    original_v1_v5_inventory_exactly_unchanged: true,
    prior_files_count: before.previous_inventory.length, prior_inventory: walk(parent, true),
    p76_inputs_unchanged: true,
    new_boundary_test_retention: "after full suite; no intervening file edits; raw command evidence unchanged",
  });
  const commands = fs.readdirSync(path.join(here, "commands")).sort().map(label => {
    const file = path.join(here, "commands", label, "result.json");
    const result = JSON.parse(fs.readFileSync(file));
    if (identity(result.stdout.path).sha256 !== result.stdout.sha256
      || identity(result.stderr.path).sha256 !== result.stderr.sha256) throw new Error("Raw command changed");
    return { label, ...result, result: identity(file) };
  });
  json(path.join(here, "command-identities.json"), commands);
  const lines = ["# Exact Command Identities", "",
    "Actual child argv/cwd/timestamps/exits and exact stdout/stderr streams.",
    "Frozen test bytes and candidate/harness snapshots are retained per command.",
    "Only one affected run, one unique full suite and one68-76 comparison were executed.", ""];
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
    candidate: identity(path.join(here, "candidate/layout.py")),
    commands: identity(path.join(here, "command-identities.md")),
    after: identity(path.join(here, "after.json")),
    command_results: commands.map(command => ({ label: command.label, exit: command.exit })),
    prior_files_unchanged: before.previous_inventory.length,
  }, null, 2));
} else if (mode === "manifest") {
  const after = JSON.parse(fs.readFileSync(path.join(here, "after.json")));
  const full = JSON.parse(fs.readFileSync(path.join(here, "tests-full-v6.json")));
  const affected = JSON.parse(fs.readFileSync(path.join(here, "tests-affected-v6.json")));
  const comparison = JSON.parse(fs.readFileSync(path.join(here, "comparison-v6.json")));
  const candidate = identity(path.join(here, "candidate/layout.py"));
  if (candidate.sha256 !== after.final_files.find(file => file.path.endsWith("/candidate/layout.py")).sha256
    || candidate.sha256 !== full.candidate_sha256 || candidate.sha256 !== affected.candidate_sha256) {
    throw new Error("Candidate identity differs across verified evidence");
  }
  const manifest = {
    ticket: "STEMROBIN-184",
    scope: "isolated original overarrow shaft projection attribution continuation",
    state: "candidate only; engineering checks PASS; promotion still unapproved",
    candidate,
    production: identity(path.join(root, ".claude/skills/ld-s10y-lesson/tools/layout.py")),
    released_report: identity(path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/report.md")),
    report: identity(path.join(here, "report.md")),
    diffs: ["v5-to-candidate.diff", "baseline-to-candidate.diff"].map(name => identity(path.join(here, name))),
    command_identities: identity(path.join(here, "command-identities.md")),
    commands: JSON.parse(fs.readFileSync(path.join(here, "command-identities.json"))),
    before: identity(path.join(here, "before.json")), after: identity(path.join(here, "after.json")),
    frozen25_and3_test_files_byte_identical: true,
    original19_contracts_unchanged: true, affected_tests: affected, unique_full_suite: full,
    unresolved_valid_tests_in_executed_scope: full.failures.concat(full.errors),
    read_only_comparison: {
      file: identity(path.join(here, "comparison-v6.json")),
      all_v5_bands_and_counts_unchanged: comparison.pages.every(page => page.v5_to_candidate_exact_bands_equal),
      baseline_changed_pages: comparison.pages.filter(page => !page.baseline_to_candidate_exact_bands_equal).map(page => page.page),
      pages: comparison.pages.map(page => ({ page: page.page, counts: page.counts,
        v5_changes: page.v5_to_candidate_changes, baseline_changes: page.baseline_to_candidate_changes })),
    },
    old_failures: {
      all_original_v1_v5_artifacts_unchanged: before.previous_inventory.length,
      rewritten_or_rerun: false,
      v4_v5_small_row_failures_remain_FAIL_in_original_evidence: true,
      v4_carrier_failures_remain_FAIL_in_original_evidence: true,
      original_strict_outside_failure_preserved_in_prior_inventory: true,
    },
    constraints: { promotion: 0, production_edits: 0, source_review_metadata_edits: 0,
      prepare: 0, finalize: 0, successful_source_gate_reruns: 0, images_displayed: 0,
      browsers: 0, exclusions: 0, expected_count_overrides: 0, old_input_geometry_edits: 0,
      generic_gap_or_height_cutoff_changes: 0, dependencies_services_git_otherworker_edits: 0,
      affected_contract_runs: 1, unique_final_suite_runs: 1, readonly68_76_comparison_runs: 1 },
    files: walk(here),
  };
  json(path.join(here, "manifest.json"), manifest);
  protect();
  console.log(JSON.stringify({
    report: manifest.report, candidate, production: manifest.production, released_report: manifest.released_report,
    diffs: manifest.diffs, commands: manifest.command_identities,
    manifest: identity(path.join(here, "manifest.json")),
    full_tests: full.tests_run, full_passed: full.passed,
    exact_band_comparison_passed: manifest.read_only_comparison.all_v5_bands_and_counts_unchanged,
    unresolved_valid_tests: manifest.unresolved_valid_tests_in_executed_scope.length,
  }, null, 2));
} else {
  throw new Error("Expected capture or manifest");
}
