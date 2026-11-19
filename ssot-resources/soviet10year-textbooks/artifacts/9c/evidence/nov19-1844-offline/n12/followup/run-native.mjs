import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const out = path.dirname(fileURLToPath(import.meta.url));
const target = process.argv[2] ?? "check.mjs";
const prefix = target.replace(/\.mjs$/, "");
const script = path.join(out, target);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const result = spawnSync(process.execPath, [script], {
  cwd: "/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck",
  env: { ...process.env, DEBUG: target === "check.mjs" ? "pw:browser" : "" },
  encoding: "utf8", maxBuffer: 10 * 1024 * 1024
});
for (const stream of ["stdout", "stderr"]) writeFileSync(path.join(out, `${prefix}.native.${stream}`),
  result[stream] ?? "", { flag: "wx" });
const receipt = { script, script_sha256: hash(readFileSync(script)), wrapper_sha256: hash(readFileSync(fileURLToPath(import.meta.url))),
  actual_exit: result.status, signal: result.signal, spawn_error: result.error?.message ?? null,
  stdout_sha256: hash(Buffer.from(result.stdout ?? "")), stderr_sha256: hash(Buffer.from(result.stderr ?? "")),
  transparent_capture: "Actual native subprocess streams and return status retained exactly; no gate output replacement." };
writeFileSync(path.join(out, `${prefix}.native-exit.json`), `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status ?? 2;
