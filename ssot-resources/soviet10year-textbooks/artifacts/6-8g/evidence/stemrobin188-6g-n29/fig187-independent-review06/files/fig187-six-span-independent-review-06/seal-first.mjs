import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = path.dirname(new URL(import.meta.url).pathname);
const first = path.join(root, "FIRST.json");
const cwd = process.cwd();
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const executions = [];
for (const [name, argv] of [
  ["chmod", ["chmod", "0444", first]],
  ["stat", ["stat", "-f", "%N|%Sp|%OLp|%z|%m|%c|%B", first]],
  ["hash", ["shasum", "-a", "256", first]]
]) {
  const start = new Date().toISOString();
  const result = spawnSync(argv[0], argv.slice(1), { cwd, encoding: "utf8" });
  const streams = {};
  for (const stream of ["stdout", "stderr"]) {
    const file = path.join(root, `FIRST-seal.${name}.${stream}.txt`);
    const bytes = Buffer.from(result[stream] || "");
    fs.writeFileSync(file, bytes, { flag: "wx" });
    streams[stream] = { path: file, sha256: hash(bytes), bytes: bytes.length };
  }
  executions.push({
    argv, cwd, started_at: start, ended_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal, streams
  });
  if (result.status !== 0) throw new Error(`${name} failed: ${result.stderr}`);
}
const s = fs.statSync(first);
if ((s.mode & 0o777) !== 0o444) throw new Error("FIRST is not 0444");
const receipt = {
  schema: "independent-FIRST-seal-receipt@1",
  first: {
    path: first, sha256: hash(fs.readFileSync(first)), bytes: s.size,
    mode: "0444", mtime: s.mtime.toISOString(), ctime: s.ctime.toISOString()
  },
  executions,
  seal_completed_at: new Date().toISOString(),
  post_FIRST_candidate_access_yet: false,
  sequence: [
    "source manifest hashes verified",
    "current N29 prose projection read",
    "original187 PNG viewed once",
    "independent FIRST written",
    "chmod 0444 completed",
    "actual stat completed",
    "actual SHA256 completed",
    "post-FIRST access permitted only after this receipt"
  ]
};
const out = path.join(root, "FIRST-seal.receipt.json");
fs.writeFileSync(out, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(out, 0o444);
console.log(JSON.stringify(receipt, null, 2));
