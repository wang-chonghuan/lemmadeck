import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const verificationScript = path.join(out, "verify.mjs");
const result = spawnSync(process.execPath, [verificationScript], { cwd: out, encoding: "utf8", maxBuffer: 1024 * 1024 });
for (const stream of ["stdout", "stderr"]) writeFileSync(path.join(out, `verify.native.${stream}`), result[stream] ?? "", { flag: "wx" });
const receipt = { script: verificationScript, script_sha256: bind(verificationScript).sha256,
  wrapper_sha256: bind(fileURLToPath(import.meta.url)).sha256,
  actual_exit: result.status, signal: result.signal, spawn_error: result.error?.message ?? null,
  stdout_sha256: hash(Buffer.from(result.stdout ?? "")), stderr_sha256: hash(Buffer.from(result.stderr ?? "")),
  purpose: "Hash-only closeout verification, not a browser/layout/math/semantic/Gate2 replay." };
writeFileSync(path.join(out, "verify.native-exit.json"), `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
assert.equal(result.status, 0);
assert.equal(result.signal, null);
assert.equal(result.error, undefined);
const files = readdirSync(out, { withFileTypes: true });
assert.ok(files.every((entry) => entry.isFile()));
const entries = files.map((entry) => ({ name: entry.name, ...bind(path.join(out, entry.name)) })).sort((a, b) => a.name.localeCompare(b.name));
const review = JSON.parse(readFileSync(path.join(out, "review.json"), "utf8"));
const manifest = {
  schema: "stemrobin-184B/n12-actual-followup-intake@1", directory: out,
  scoped_actual_verdict: review.verdict, fresh_pixel_proof: false, original_first_FAIL_preserved: true,
  input_bindings: review.input_bindings, payload_files: entries.length,
  payload_bytes: entries.reduce((total, entry) => total + entry.bytes, 0), entries,
  actual_native_exits: { check: 0, browser_shutdown: 0, closeout: 0, integrity_verification: result.status,
    expected_absent_PID_probe: 1, expected_absent_listener_probe: 1 },
  assertions: review.assertions, images: { this_followup: 0, cumulative: 6, maximum: 6 },
  manifests_excluded_from_self_hash: ["manifest.json", "SHA256SUMS"],
  whole_lesson_semantic_Gate2_or_screenshot_PASS_declared: false,
  browser_and_server_closed: true, await_parent_intake: true
};
writeFileSync(path.join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
const manifestBinding = bind(path.join(out, "manifest.json"));
writeFileSync(path.join(out, "SHA256SUMS"), `${[...entries, { name: "manifest.json", ...manifestBinding }]
  .map((entry) => `${entry.sha256}  ${entry.name}`).join("\n")}\n`, { flag: "wx" });
const sumsBinding = bind(path.join(out, "SHA256SUMS"));
for (const entry of entries) assert.equal(bind(entry.path).sha256, entry.sha256);
for (const entry of review.input_bindings) assert.equal(bind(entry.path).sha256, entry.sha256);
console.log(JSON.stringify({
  all_hash_bindings_verified: true, file_count: entries.length + 2,
  total_bytes: manifest.payload_bytes + manifestBinding.bytes + sumsBinding.bytes,
  scoped_actual_verdict: "PASS", fresh_pixel_proof: false, new_image_operations: 0,
  cumulative_image_opens: 6, browser_and_server_closed: true,
  review: bind(path.join(out, "review.json")), markdown: bind(path.join(out, "review.md")),
  native_receipt: bind(path.join(out, "check.native-exit.json")),
  manifest: manifestBinding, SHA256SUMS: sumsBinding
}, null, 2));
