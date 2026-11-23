import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181";
const own = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d2038-n77-first-en-review");
assert.equal(process.cwd(), root);
const englishPath = path.join(own, "english-review.json");
const english = JSON.parse(fs.readFileSync(englishPath, "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const bindings = Object.entries(english.inspected_inputs).map(([id, binding]) => {
  const absolute = path.resolve(root, binding.path);
  assert.ok(absolute.startsWith(root + path.sep));
  const bytes = fs.readFileSync(absolute);
  assert.equal(sha(bytes), binding.sha256, `Changed reviewed input: ${id}`);
  return { id, path: absolute, bytes: bytes.length, sha256: binding.sha256 };
});
const streamPaths = {
  stdout: path.join(own, "validator.stdout.txt"),
  stderr: path.join(own, "validator.stderr.txt"),
};
const receiptPath = path.join(own, "validator-result.json");
for (const output of [...Object.values(streamPaths), receiptPath]) {
  assert.equal(fs.existsSync(output), false, `Preserve existing validator evidence: ${output}`);
}
const input = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d2034-n77-en-choice-review-inputs");
const executable = path.join(root, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const args = [
  "-B",
  path.join(root, ".agents/skills/ld-s10y-choice/scripts/validate.py"),
  "--repo", root,
  "--seed", path.join(input, "seed.json"),
  "--draft", path.join(input, "draft.json"),
  "--review", path.join(own, "review.json"),
  "--edition", "modern-us-neutral-en",
];
const startedAt = new Date().toISOString();
const result = spawnSync(executable, args, { cwd: root, encoding: "buffer", maxBuffer: 8 * 1024 * 1024 });
const finishedAt = new Date().toISOString();
const streams = {};
for (const key of ["stdout", "stderr"]) {
  const bytes = result[key] ?? Buffer.alloc(0);
  fs.writeFileSync(streamPaths[key], bytes, { flag: "wx" });
  streams[key] = { path: streamPaths[key], bytes: bytes.length, sha256: sha(bytes) };
}
const changedInputs = bindings.filter((binding) => sha(fs.readFileSync(binding.path)) !== binding.sha256);
const receipt = {
  card: "phy10-c2-s2-n77",
  cwd: root,
  argv: [executable, ...args],
  invocations: 1,
  startedAt,
  finishedAt,
  exitCode: result.status,
  signal: result.signal,
  error: result.error ? String(result.error) : null,
  streams,
  englishReview: { path: englishPath, sha256: sha(fs.readFileSync(englishPath)) },
  inspectedInputBindings: bindings,
  changedInputs,
  closesReady: result.status === 0 && changedInputs.length === 0 && english.status === "PASS",
  closesReadyScope: "181-7 independent English/key-blind review only; not ticket/native/display/pixel/publication closure",
};
fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({
  exitCode: receipt.exitCode,
  stdout: (result.stdout ?? Buffer.alloc(0)).toString("utf8"),
  stderr: (result.stderr ?? Buffer.alloc(0)).toString("utf8"),
  changedInputs: changedInputs.map((binding) => binding.id),
  closesReady: receipt.closesReady,
  receipt: receiptPath,
}, null, 2));
process.exitCode = result.status ?? 1;
