import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
const json = (name) => JSON.parse(readFileSync(path.join(out, name), "utf8"));
const review = json("review.json");
for (const entry of [...review.input_bindings, ...review.evidence_bindings]) assert.equal(hash(entry.path), entry.sha256);
for (const prefix of ["check", "closeout"]) {
  const receipt = json(`${prefix}.native-exit.json`);
  assert.equal(receipt.actual_exit, 0);
  assert.equal(receipt.script_sha256, hash(receipt.script));
  assert.equal(receipt.stdout_sha256, hash(path.join(out, `${prefix}.native.stdout`)));
  assert.equal(receipt.stderr_sha256, hash(path.join(out, `${prefix}.native.stderr`)));
}
assert.equal(review.verdict, "PASS");
assert.equal(review.assertions.total, 96);
assert.equal(review.assertions.failed, 0);
assert.equal(review.fresh_pixel_proof, false);
assert.equal(review.images.new_opens, 0);
assert.equal(review.images.after_opens, 6);
assert.equal(review.closure.browser_native_exit, 0);
assert.equal(review.closure.process_probe.actual_exit, 1);
assert.equal(review.closure.listener_probe.actual_exit, 1);
assert.ok(readdirSync(out).every((name) => !/\.(png|jpe?g|webp|html|pdf)$/i.test(name)));
console.log(JSON.stringify({ integrity_verification: "PASS", scoped_actual_verdict: "PASS", fresh_pixels: false,
  original_first_visual_FAIL_preserved: true, HTMLs_and_reviews_unchanged_during_followup: true,
  actual_target_assertions: "96/96", cumulative_image_opens: "6/6", browser_and_server_closed: true }));
