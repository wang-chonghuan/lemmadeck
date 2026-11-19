import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck";
const scope = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-n118-text-review");
const lesson = "phy10-c2-s6-n118";
const inputs = [
  ["source/lesson.json", `.tmp/STEMROBIN-181/d1816/root/10p/lessons/${lesson}/lesson.json`],
  ["source/exercises.json", `.tmp/STEMROBIN-181/d1816/root/10p/lessons/${lesson}/exercises.json`],
  ["zh/lesson.template.json", `.tmp/STEMROBIN-181/d1816/author-work/adapt/10p/modern-us-neutral/lessons/${lesson}/lesson.template.json`],
  ["zh/exercises.template.json", `.tmp/STEMROBIN-181/d1816/author-work/adapt/10p/modern-us-neutral/lessons/${lesson}/exercises.template.json`],
  ["en/lesson.template.json", `.tmp/STEMROBIN-181/d1816/author-work/adapt/10p/modern-us-neutral-en/lessons/${lesson}/lesson.template.json`],
  ["en/exercises.template.json", `.tmp/STEMROBIN-181/d1816/author-work/adapt/10p/modern-us-neutral-en/lessons/${lesson}/exercises.template.json`],
  ["source/source-raw-pass.json", ".intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/d040-n118-source-raw-pass.json"],
  ["source/source-bindings.json", ".intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/d040-source306309-bindings.json"],
];
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const started = new Date().toISOString();
const entries = inputs.map(([target, source]) => {
  const input = path.join(root, source);
  const before = fs.statSync(input);
  const bytes = fs.readFileSync(input);
  const after = fs.statSync(input);
  if (before.size !== after.size || before.mtimeMs !== after.mtimeMs) {
    throw new Error(`Input changed during capture: ${source}`);
  }
  JSON.parse(bytes.toString("utf8"));
  const output = path.join(scope, "snapshots", target);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, bytes, { flag: "wx", mode: 0o444 });
  fs.chmodSync(output, 0o444);
  return { source, snapshot: path.relative(scope, output), sha256: sha256(bytes), bytes: bytes.length, mtime: after.mtime.toISOString() };
});
const drift = entries.map((entry) => ({
  source: entry.source,
  unchangedAtCaptureEnd: sha256(fs.readFileSync(path.join(root, entry.source))) === entry.sha256,
}));
const manifest = { batch: "D040", lesson, started, completed: new Date().toISOString(), scope, entries, drift };
fs.writeFileSync(path.join(scope, "snapshot-manifest.json"), JSON.stringify(manifest, null, 2) + "\n", { flag: "wx", mode: 0o444 });
fs.chmodSync(path.join(scope, "snapshot-manifest.json"), 0o444);
console.log(JSON.stringify(manifest, null, 2));
if (drift.some((entry) => !entry.unchangedAtCaptureEnd)) process.exitCode = 2;
