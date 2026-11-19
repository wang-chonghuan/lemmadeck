import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bind = (file) => { const bytes = readFileSync(file); return { path: file, bytes: bytes.length, sha256: hash(bytes) }; };
const readJson = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const verifyScript = path.join(out, "verify.mjs");
const verification = spawnSync(process.execPath, [verifyScript], {
  cwd: out, encoding: "utf8", maxBuffer: 1024 * 1024
});
for (const stream of ["stdout", "stderr"]) writeFileSync(path.join(out, `verify.native.${stream}`),
  verification[stream] ?? "", { flag: "wx" });
const verifyReceipt = { script: verifyScript, script_sha256: bind(verifyScript).sha256,
  wrapper_sha256: bind(fileURLToPath(import.meta.url)).sha256,
  actual_exit: verification.status, signal: verification.signal, spawn_error: verification.error?.message ?? null,
  stdout_sha256: hash(Buffer.from(verification.stdout ?? "")),
  stderr_sha256: hash(Buffer.from(verification.stderr ?? "")),
  purpose: "Hash-only integrity verification. No browser, layout, mathematics, Gate2 or pixel replay." };
writeFileSync(path.join(out, "verify.native-exit.json"), `${JSON.stringify(verifyReceipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(verification.stdout ?? "");
process.stderr.write(verification.stderr ?? "");
assert.equal(verification.status, 0);
assert.equal(verification.signal, null);
assert.equal(verification.error, undefined);
const files = readdirSync(out, { withFileTypes: true });
assert.ok(files.every((entry) => entry.isFile()));
assert.ok(files.every((entry) => !/\.(png|jpe?g|webp|html|pdf)$/i.test(entry.name)));
for (const prefix of ["diagnose", "closeout"]) {
  const receipt = readJson(`${prefix}.native-exit.json`);
  assert.equal(receipt.actual_exit, 0);
  assert.equal(receipt.script_sha256, bind(receipt.script).sha256);
  assert.equal(receipt.stdout_sha256, bind(path.join(out, `${prefix}.native.stdout`)).sha256);
  assert.equal(receipt.stderr_sha256, bind(path.join(out, `${prefix}.native.stderr`)).sha256);
}
const diagnosis = readJson("diagnosis.json");
for (const entry of [...diagnosis.durable_input_bindings, ...diagnosis.evidence_bindings]) {
  assert.equal(bind(entry.path).sha256, entry.sha256);
}
assert.equal(diagnosis.original_visual_gate_verdict, "FAIL");
assert.equal(diagnosis.images.new_opens, 0);
assert.equal(diagnosis.images.cumulative_opens, 6);
const entries = files.map((entry) => ({ name: entry.name, ...bind(path.join(out, entry.name)) }))
  .sort((a, b) => a.name.localeCompare(b.name));
const manifest = {
  schema: "stemrobin-184B/n12-targeted-layout-diagnosis-intake@1", directory: out,
  payload_files: entries.length, payload_bytes: entries.reduce((total, entry) => total + entry.bytes, 0),
  entries, input_bindings: diagnosis.durable_input_bindings,
  status: "COMPLETE_RECOMMENDATION_ONLY", original_visual_gate_verdict: "FAIL",
  repaired_visual_acceptance: "NOT_RUN", semantic_review: "NOT_REVIEWED_AWAITING_FRANKLIN",
  actual_native_exits: { diagnostic: 0, browser_shutdown: 0, diagnostic_closeout: 0, integrity_verification: verification.status,
    expected_absent_PID_probe: 1, expected_absent_listener_probe: 1 },
  screenshot_and_image_open_operations: 0, cumulative_image_opens: 6,
  manifests_excluded_from_self_hash: ["manifest.json", "SHA256SUMS"],
  all_original_inputs_unchanged: true, browser_and_server_closed: true,
  await_parent_intake: true
};
writeFileSync(path.join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
const manifestBinding = bind(path.join(out, "manifest.json"));
writeFileSync(path.join(out, "SHA256SUMS"), `${[...entries, { name: "manifest.json", ...manifestBinding }]
  .map((entry) => `${entry.sha256}  ${entry.name}`).join("\n")}\n`, { flag: "wx" });
const sumsBinding = bind(path.join(out, "SHA256SUMS"));
for (const entry of entries) assert.equal(bind(entry.path).sha256, entry.sha256);
console.log(JSON.stringify({
  all_hash_bindings_verified: true, file_count: entries.length + 2,
  total_bytes: manifest.payload_bytes + manifestBinding.bytes + sumsBinding.bytes,
  original_inputs_unchanged: true, no_new_images: true, cumulative_image_opens: 6,
  browser_and_server_closed: true, original_visual_gate: "FAIL",
  diagnosis: bind(path.join(out, "diagnosis.json")), markdown: bind(path.join(out, "diagnosis.md")),
  native_receipt: bind(path.join(out, "diagnose.native-exit.json")),
  manifest: manifestBinding, SHA256SUMS: sumsBinding
}, null, 2));
