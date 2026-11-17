import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

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

const before = JSON.parse(fs.readFileSync(path.join(here, "before.json")));
const after = before.files.map(file => {
  const current = fs.readFileSync(file.path);
  const target = path.join(here, "after", path.relative(here, file.retained_path));
  save(target, current);
  return { ...identity(file.path), before_sha256: file.sha256,
    unchanged: sha(current) === file.sha256, retained_path: target,
    retained_sha256: sha(current) };
});
json(path.join(here, "after.json"), {
  captured_at: new Date().toISOString(), all_inputs_unchanged: after.every(file => file.unchanged),
  files: after,
});
const production = after.find(file => file.path.endsWith("/tools/layout.py"));
const released = after.find(file => file.path.endsWith("/counter-vector-rows/report.md"));
if (production?.sha256 !== "eb6fca6d9a62663ed7e97d7f39cda32d803375f61bf71adbf9aac84b4c335c3d"
  || released?.sha256 !== "534986e4919a34cb448dfa0a9497cf5f75785f82bc201bfd24e41868bccd60bb") {
  throw new Error("Frozen production/report changed; no promotion permitted");
}

const oldFailureRoot = path.join(root, ".intentfold/tickets/STEMROBIN-184/tmp/counter-vector-rows/commands/verify_repair-production");
const oldResult = JSON.parse(fs.readFileSync(path.join(oldFailureRoot, "result.json")));
const oldFiles = ["result.json", "stdout.raw", "stderr.raw"].map(name => {
  const source = path.join(oldFailureRoot, name);
  const target = path.join(here, "protected/existing-outside-failure", name);
  save(target, fs.readFileSync(source));
  return { ...identity(source), retained_path: target, retained_sha256: identity(target).sha256 };
});
if (oldResult.exit !== 1 || oldFiles.find(file => file.path.endsWith("/stderr.raw")).sha256 !== oldResult.stderr_sha256) {
  throw new Error("Original outside failure identity mismatch");
}
json(path.join(here, "existing-outside-failure-identity.json"), {
  original_exit: oldResult.exit, rerun: false, source_or_assertion_edited: false, files: oldFiles,
});

const commands = [];
for (const name of fs.readdirSync(path.join(here, "commands")).sort()) {
  const directory = path.join(here, "commands", name);
  const resultPath = path.join(directory, "result.json");
  if (!fs.existsSync(resultPath)) continue;
  const result = JSON.parse(fs.readFileSync(resultPath));
  commands.push({ label: name, ...result, result: identity(resultPath) });
}
const commandLines = ["# Actual Command Identities", "",
  "Every raw stdout/stderr and result below is retained; exit1 is not rewritten.", "",
  "Initial bootstrap wrapper exception: commands/bootstrap-initial-failure/tool-transcript.txt",
  "(tool-visible transcript, not claimed byte-exact stream separation).", ""];
for (const command of commands) {
  commandLines.push(`## ${command.label}`, "",
    `argv: \`${JSON.stringify(command.command)}\``,
    `cwd: \`${command.cwd}\``,
    `exit: ${command.exit}; started: ${command.started_at}; finished: ${command.finished_at}`,
    `result: \`${command.result.path}\``,
    `result SHA256: \`${command.result.sha256}\``,
    `stdout: \`${command.stdout.path}\``,
    `stdout SHA256: \`${command.stdout.sha256}\``,
    `stderr: \`${command.stderr.path}\``,
    `stderr SHA256: \`${command.stderr.sha256}\``,
    ...(command.candidate ? [`candidate SHA256: \`${command.candidate.sha256}\``] : []), "");
}
save(path.join(here, "command-identities.md"), commandLines.join("\n") + "\n");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [identity(file)];
  });
}
const finalTests = JSON.parse(fs.readFileSync(path.join(here, "tests-v3.json")));
const finalComparison = JSON.parse(fs.readFileSync(path.join(here, "comparison-v3.json")));
const manifest = {
  ticket: "STEMROBIN-184",
  scope: "isolated p73 candidate plus authorized read-only68-75 counter comparison",
  state: "candidate delivered with retained valid FAIL; parent disposition and promotion authorization pending",
  candidate: identity(path.join(here, "candidate/layout.py")),
  baseline: identity(path.join(here, "baseline/layout.py")),
  production, released_report: released,
  report: identity(path.join(here, "report.md")),
  diff: identity(path.join(here, "baseline-to-candidate.diff")),
  command_identities: identity(path.join(here, "command-identities.md")),
  before: identity(path.join(here, "before.json")),
  after: identity(path.join(here, "after.json")),
  all_inputs_unchanged: after.every(file => file.unchanged),
  final_tests: finalTests,
  comparison: finalComparison,
  constraints: { production_edits: 0, source_edits: 0, prepare: 0, finalize: 0,
    exclusions_or_expected_count_overrides: 0, images_or_browsers: 0,
    dependencies_or_services_or_git: 0, promotion: 0, existing_tests_read_as_design: 0 },
  original_outside_failure: { original_exit: 1, rerun: false, files: oldFiles },
  commands, files: walk(here),
};
json(path.join(here, "manifest.json"), manifest);
console.log(JSON.stringify({
  report: manifest.report, candidate: manifest.candidate, diff: manifest.diff,
  commands: manifest.command_identities, manifest: identity(path.join(here, "manifest.json")),
  final_test_exit: finalTests.passed ? 0 : 1,
  all_inputs_unchanged: manifest.all_inputs_unchanged,
  protected_production_sha256: production.sha256,
  protected_report_sha256: released.sha256,
}, null, 2));
