import fs from "node:fs";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const own = ".intentfold/tickets/STEMROBIN-182/tmp/reviewer-8a-modern/";
const table = ".intentfold/tickets/STEMROBIN-182/tmp/batch16-work/adapt/8a/modern-us-neutral/figure-authoring/tbl-p0011-01/";
const hash = path => crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
const read = path => JSON.parse(fs.readFileSync(path, "utf8"));
const output = `${own}table-review.json`;
const resultPath = `${own}table-record-result.json`;
assert.equal(fs.existsSync(output), false);
assert.equal(fs.existsSync(resultPath), false);
const text = read(`${own}text-review.json`);
const observations = read(`${own}table-observations.json`);
assert.equal(text.status, "pass");
assert.equal(text.source_reviews.length, 11);
assert.equal(text.source_reviews.reduce((sum, ex) => sum + ex.subparts, 0), 55);
assert.equal(observations.status, "pass");
for (const binding of Object.values(observations.current_binding)) {
  assert.equal(hash(binding.path), binding.sha256);
}
const notes = [
  "Independent agent session A, not the8a author. Original PDF8-14 full pixels, raw prose/tasks and full original PDF11 table PNG were inspected before current modern content/spec.",
  "Source inventory is exactly2rows9logical columns including the wide label column. Top x,-3,-2,-1,0,1,2,3,4; bottom x^3-2x^2+5x-10,-70,-36,-18,-10,-6,0,14,42. Independent polynomial evaluations match every value. Two adjacent2x1/2x8 grids and18cell labels preserve all pairings in one frame.",
  "Original outer vertical rules were absent; current closed frame is a declared framing addition only. Original prose still distinguishes a sampled zero from proof that(x-2)(x^2+5) has only real root2. No new root highlight or exercise answer is added.",
  "Personally opened12existing actual-SVG PNGs: neutral/accent/print full640x320 and each theme390left/middle/right. All labels20px, full media640px, scroll positions0/125/250 with390client and640scroll width. In every theme the right view exposes final4/42 plus right/bottom borders; both row labels and all middle/negative values are readable without text/grid collision. Visible paper/grid/ink are semantic variables, no cultural text or symbols.",
  "Current source/spec/render/SVG hashes match; existing render reports pass,20objects18labels,no collisions,min20px. Capture PNG hashes and technical metrics were checked. Capture metadata lacks a separate SVG digest, so no cryptographic raster-to-SVG certificate is claimed; actual visible content/positions were independently compared with current spec/SVG.",
  `Detailed frozen independent observations sha256=${hash(`${own}table-observations.json`)}; source baseline sha256=${hash(`${own}source-baseline.json`)}; current compared snapshot sha256=${hash(`${own}reviewed-snapshot.json`)}.`,
  "Scratch figure review only: n2 templates are not finalized, output paths are not yet durable and later promotion requires rebind. No full lesson/product display approval is claimed. No new browser, renderer, canonical command, model service or durable edit."
].join(" ");
const args = [
  ".agents/skills/ld-s10y-image/scripts/record_review.py",
  "--spec", `${table}spec.json`,
  "--render", `${table}render.json`,
  "--output", output,
  "--status", "pass",
  "--notes", notes
];
const startedAt = new Date().toISOString();
const run = spawnSync("python3", args, { encoding: "utf8" });
const result = {
  operation: "formal-image-review-recording",
  command: ["python3", ...args],
  invocation_count: 1,
  startedAt,
  finishedAt: new Date().toISOString(),
  exit_code: run.status,
  signal: run.signal,
  stdout: run.stdout,
  stderr: run.stderr,
  spawn_error: run.error?.message ?? null,
  status: run.status === 0 ? "pass" : "recording-failed",
  formal_review: fs.existsSync(output) ? { path: output, sha256: hash(output) } : null,
  supporting_review_files: ["source-baseline.json", "reviewed-snapshot.json", "text-review.json", "table-observations.json"]
    .map(name => ({ path: `${own}${name}`, sha256: hash(`${own}${name}`) })),
  new_browser_sessions: 0,
  new_render_commands: 0,
  canonical_commands: 0,
  durable_writes: 0,
  model: null,
  usage: null
};
fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(result, null, 2));
process.exitCode = run.status ?? 1;
