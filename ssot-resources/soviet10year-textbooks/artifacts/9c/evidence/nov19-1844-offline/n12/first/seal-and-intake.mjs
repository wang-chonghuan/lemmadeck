import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const write = (name, value) => writeFileSync(path.join(out, name), value, { flag: "wx" });
const bind = (name) => {
  const file = path.join(out, name);
  const bytes = readFileSync(file);
  return { path: file, name, bytes: bytes.length, sha256: hash(bytes) };
};
const result = spawnSync(process.execPath, [path.join(out, "seal.mjs")], {
  cwd: "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck",
  encoding: "utf8", maxBuffer: 5 * 1024 * 1024
});
write("seal.native.stdout", result.stdout ?? "");
write("seal.native.stderr", result.stderr ?? "");
const receipt = {
  script: path.join(out, "seal.mjs"), script_sha256: bind("seal.mjs").sha256,
  wrapper: bind("seal-and-intake.mjs"),
  actual_exit: result.status, signal: result.signal, spawn_error: result.error?.message ?? null,
  stdout_sha256: hash(Buffer.from(result.stdout ?? "")),
  stderr_sha256: hash(Buffer.from(result.stderr ?? "")),
  transparent_capture: "Actual sealing subprocess streams and exit retained. This is text artifact finalization, not a browser or gate replay."
};
write("seal.native-exit.json", `${JSON.stringify(receipt, null, 2)}\n`);
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
assert.equal(result.status, 0);
assert.equal(result.signal, null);
assert.equal(result.error, undefined);
const files = readdirSync(out, { withFileTypes: true });
assert.ok(files.every((file) => file.isFile()), "Unexpected nested or nonfile artifact");
assert.equal(files.filter((file) => file.name.endsWith(".png")).length, 6);
const entries = files.map((file) => bind(file.name)).sort((a, b) => a.name.localeCompare(b.name));
const report = JSON.parse(readFileSync(path.join(out, "report.json"), "utf8"));
const manifest = {
  schema: "stemrobin-184B/n12-offline-review-intake@1",
  directory: out, lesson: "ana9-c3-s1-n12",
  visual_gate_verdict: report.visual_gate_verdict,
  semantic_verdict: report.semantic_verdict,
  payload_file_count: entries.length, payload_bytes: entries.reduce((total, entry) => total + entry.bytes, 0),
  files: entries,
  canonical_HTML_inputs: report.input_bindings,
  images: { captures: 6, opens: 6, prior: 0, reopen: 0, crop: 0 },
  native_exit_codes: { browser_check: 1, browser_shutdown: 0, closeout: 0, seal: result.status,
    closure_ps_no_match: 1, closure_lsof_no_match: 1 },
  manifests_excluded_from_own_payload_to_avoid_self_hash_cycle: ["manifest.json", "SHA256SUMS"],
  preservation: "All capture-phase/native artifacts remain exact. report.preseal.json/md preserve the closeout-output version; report.json/md are final intake versions after two documented wording corrections.",
  browser_and_local_server_closed: true, no_new_browser_or_image_operations_in_seal: true,
  await_parent_durable_intake: true, stop_only_this_child_batch: true
};
assert.equal(manifest.visual_gate_verdict, "FAIL");
for (const entry of entries) assert.equal(bind(entry.name).sha256, entry.sha256);
for (const entry of manifest.canonical_HTML_inputs) {
  assert.equal(hash(readFileSync(entry.path)), entry.sha256);
}
write("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
const manifestBinding = bind("manifest.json");
write("SHA256SUMS", `${[...entries, manifestBinding].map((entry) => `${entry.sha256}  ${entry.name}`).join("\n")}\n`);
const sumsBinding = bind("SHA256SUMS");
const lines = readFileSync(path.join(out, "SHA256SUMS"), "utf8").trimEnd().split("\n");
assert.equal(lines.length, entries.length + 1);
for (const line of lines) {
  const [digest, name] = line.split("  ");
  assert.equal(bind(name).sha256, digest);
}
console.log(JSON.stringify({
  all_payload_and_manifest_hashes_verified: true,
  final_file_count: entries.length + 2,
  final_total_bytes: entries.reduce((total, entry) => total + entry.bytes, 0) + manifestBinding.bytes + sumsBinding.bytes,
  payload_files: entries.length,
  visual_gate: "FAIL", browser_check_exit: 1, closeout_exit: 0, seal_exit: 0,
  browser_and_server_closed: true, image_opens: 6, no_more_images: true,
  report: bind("report.json"), markdown: bind("report.md"),
  manifest: manifestBinding, SHA256SUMS: sumsBinding
}, null, 2));
