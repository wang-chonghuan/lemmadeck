import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const json = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const diagnosis = json("diagnosis.json");
for (const entry of [...diagnosis.durable_input_bindings, ...diagnosis.evidence_bindings]) {
  assert.equal(hash(entry.path), entry.sha256);
}
for (const prefix of ["diagnose", "closeout"]) {
  const receipt = json(`${prefix}.native-exit.json`);
  assert.equal(receipt.actual_exit, 0);
  assert.equal(receipt.script_sha256, hash(receipt.script));
  assert.equal(receipt.stdout_sha256, hash(path.join(out, `${prefix}.native.stdout`)));
  assert.equal(receipt.stderr_sha256, hash(path.join(out, `${prefix}.native.stderr`)));
}
assert.equal(diagnosis.original_visual_gate_verdict, "FAIL");
assert.equal(diagnosis.prior_check_native_exit, 1);
assert.equal(diagnosis.images.new_opens, 0);
assert.equal(diagnosis.images.cumulative_opens, 6);
assert.equal(diagnosis.closure.browser_native_exit, 0);
assert.equal(diagnosis.closure.process_probe.actual_exit, 1);
assert.equal(diagnosis.closure.listener_probe.actual_exit, 1);
assert.ok(readdirSync(out).every((name) => !/\.(png|jpe?g|webp|html|pdf)$/i.test(name)));
console.log(JSON.stringify({ integrity_verification: "PASS", source_HTMLs_and_durable_evidence_unchanged: true,
  original_visual_gate: "FAIL", new_pixels_or_browser_observations: 0, image_opens: "6/6",
  diagnostic_and_closeout_native_exit: [0, 0], repaired_visual_acceptance: "NOT_RUN" }));
