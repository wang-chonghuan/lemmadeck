import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const started = new Date().toISOString();
const expected = JSON.parse(fs.readFileSync(path.join(here, "FIRST-expectations.json"), "utf8"));
const initial = ["FIRST-findings.md", "FIRST-expectations.json", "FIRST-check.mjs", "FIRST-run-freeze.mjs", "FIRST-technical-recovery.json"];
assert.deepEqual(fs.readdirSync(here).sort(), [...initial].sort(), "refuse to replace existing inquiry evidence");

function sha(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function create(name, bytes) {
  assert.ok(name.startsWith("FIRST-") && path.basename(name) === name);
  fs.writeFileSync(path.join(here, name), bytes, { flag: "wx" });
}

function createJson(name, value) {
  create(name, `${JSON.stringify(value, null, 2)}\n`);
}

// Mirrors the inspected blocks.text_of contract; no image or metadata access.
function textOf(block) {
  let text = "";
  for (const raw of block.lines) {
    const line = raw.replaceAll("\u21b5", "");
    if ((text.endsWith("$") && line.startsWith("$")) ||
        (text.endsWith(")") && /^[A-Za-z\u0400-\u04ff]\)/.test(line))) text += " ";
    text += line;
  }
  return text.trim();
}

const blocks = [];
let active = false;
let stopped = false;
for (const source of expected.source_files) {
  const raw = fs.readFileSync(path.join(repo, source.path));
  assert.equal(raw.length, source.bytes);
  assert.equal(sha(raw), source.sha256, `source changed since first reading: page${source.page}`);
  const page = JSON.parse(raw);
  const indices = [];
  for (const [index, block] of page.blocks.entries()) {
    if (block.kind === "h3") {
      if (!active && !stopped && textOf(block) === "13. 循环小数") active = true;
      else if (active) {
        assert.equal(source.page, 57);
        assert.equal(index, 5);
        assert.match(textOf(block), /^14\.\s*实\s*数$/u);
        active = false;
        stopped = true;
        break;
      }
    }
    if (!active) continue;
    indices.push(index);
    const projection = Object.fromEntries(
      ["kind", "label", "cont", "open", "samerow", "lines"].map((key) => [key, block[key]]),
    );
    const semanticText = textOf(projection);
    blocks.push({
      page: source.page,
      source_path: source.path,
      pointer: `/blocks/${index}`,
      block: projection,
      block_sha256: sha(Buffer.from(JSON.stringify(projection))),
      semantic_text: semanticText,
      semantic_text_sha256: sha(Buffer.from(semanticText)),
    });
  }
  assert.deepEqual(indices, source.indices, "derived scope must match independently fixed boundaries");
}
assert.ok(stopped && !active);
assert.equal(blocks.length, expected.scope_block_count);
createJson("FIRST-source-scope.json", {
  stage: "FIRST-source-only-independent",
  recorded_at: new Date().toISOString(),
  source_files: expected.source_files,
  excluded: ["page55 /blocks/0 exercise114", "page57 /blocks/5 and following n14"],
  no_source_metadata_or_errata_disclosed: true,
  no_image_paths_boxes_or_pixels_copied: true,
  images_opened: 0,
  pointer_indexing: "zero-based JSON pointers",
  normalization_contract: ".claude/skills/ld-s10y-lesson/tools/blocks.py:text_of",
  blocks,
});

const receipts = [];
for (const control of [null, ...expected.negative_controls]) {
  const name = control ? `negative-${control}` : "check";
  const args = [path.join(here, "FIRST-check.mjs")];
  if (control) args.push(`--negative-control=${control}`);
  const runStarted = new Date().toISOString();
  const result = spawnSync(process.execPath, args, {
    cwd: repo,
    encoding: "utf8",
    timeout: 60000,
    maxBuffer: 4 * 1024 * 1024,
  });
  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  const stdoutFile = `FIRST-${name}.stdout.txt`;
  const stderrFile = `FIRST-${name}.stderr.txt`;
  create(stdoutFile, stdout);
  create(stderrFile, stderr);
  receipts.push({
    name,
    command: [process.execPath, ...args],
    cwd: repo,
    started_at: runStarted,
    finished_at: new Date().toISOString(),
    expected_exit: control ? 1 : 0,
    actual_exit: result.status,
    signal: result.signal,
    error: result.error ? { name: result.error.name, message: result.error.message, code: result.error.code } : null,
    stdout: { file: stdoutFile, bytes: Buffer.byteLength(stdout), sha256: sha(Buffer.from(stdout)) },
    stderr: { file: stderrFile, bytes: Buffer.byteLength(stderr), sha256: sha(Buffer.from(stderr)) },
    expectation_origin: "source-first derivations fixed in FIRST-findings.md and FIRST-expectations.json before any check execution",
  });
}
const passed = receipts.every((r) => r.actual_exit === r.expected_exit && r.signal === null && r.error === null);
createJson("FIRST-execution.json", {
  stage: "FIRST-source-only-independent",
  started_at: started,
  finished_at: new Date().toISOString(),
  node: process.version,
  platform: process.platform,
  architecture: process.arch,
  positive_check_passed: receipts[0].actual_exit === 0,
  capable_of_failing: receipts.slice(1).every((r) => r.actual_exit === 1 && r.stderr.bytes > 0),
  all_required_exit_statuses_matched: passed,
  receipts,
  preparation_failure: {
    tool_output: "7ffd45",
    actual_exit: 2,
    stderr: "rg: .tmp/stemrobin-184-resume/n13-independent: No such file or directory (os error 2)\n",
    stdout_description: "filename-only inventory under .claude/skills/ld-s10y-lesson",
    diagnosis: "permitted output directory did not yet exist; no content verdict",
    recovery: "apply_patch created only this permitted directory and the four initial FIRST files",
  },
  pre_freeze_technical_recovery: "FIRST-technical-recovery.json",
  usage: expected.usage,
});
if (!passed) {
  console.error(JSON.stringify({ status: "not-frozen", receipts }));
  process.exit(1);
}

function inventory(name) {
  const bytes = fs.readFileSync(path.join(here, name));
  return { file: name, bytes: bytes.length, sha256: sha(bytes) };
}

const frozenFiles = fs.readdirSync(here).sort().map(inventory);
createJson("FIRST-freeze.json", {
  stage: "FIRST-source-only-independent",
  status: "frozen",
  frozen_at: new Date().toISOString(),
  freeze_is_before_any_disclosed_stage: true,
  no_further_stage_authorized_or_performed: true,
  source_files: expected.source_files,
  evidence_files: frozenFiles,
  manifest_self_hash: "returned in final stdout inventory, not embedded recursively",
  immutability: { file_mode: "0444", directory_mode: "0555", do_not_edit_first_files_after_freeze: true },
  usage: expected.usage,
});
const names = fs.readdirSync(here).sort();
for (const name of names) fs.chmodSync(path.join(here, name), 0o444);
fs.chmodSync(here, 0o555);
assert.equal(fs.statSync(here).mode & 0o777, 0o555);
for (const name of names) assert.equal(fs.statSync(path.join(here, name)).mode & 0o777, 0o444);
console.log(JSON.stringify({
  status: "frozen",
  directory: here,
  image_opens: 0,
  positive_exit: receipts[0].actual_exit,
  negative_exits: receipts.slice(1).map((r) => ({ control: r.name, actual_exit: r.actual_exit })),
  total_bytes: names.reduce((sum, name) => sum + fs.statSync(path.join(here, name)).size, 0),
  files: names.map(inventory),
}, null, 2));
