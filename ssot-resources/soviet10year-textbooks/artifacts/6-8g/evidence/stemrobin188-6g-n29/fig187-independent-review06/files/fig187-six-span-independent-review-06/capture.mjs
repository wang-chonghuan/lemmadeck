import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

export const root = path.dirname(new URL(import.meta.url).pathname);
export const repo = process.cwd();
export const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
export function binding(file) {
  const bytes = fs.readFileSync(file);
  const stat = fs.statSync(file);
  return {
    path: path.resolve(file), sha256: hash(bytes), bytes: bytes.length,
    mode: (stat.mode & 0o777).toString(8).padStart(4, "0")
  };
}
export function write(name, data) {
  const file = path.join(root, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: "wx" });
  return binding(file);
}
export function capture(name, argv, inputs = [], outputs = []) {
  const started_at = new Date().toISOString();
  const before = inputs.map(binding);
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: repo, encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 16 * 1024 * 1024
  });
  const streams = {};
  for (const stream of ["stdout", "stderr"]) {
    const file = path.join(root, `${name}.${stream}.txt`);
    fs.writeFileSync(file, result[stream] || "", { flag: "wx" });
    streams[stream] = binding(file);
  }
  const receipt = {
    argv, cwd: repo, started_at, ended_at: new Date().toISOString(),
    exit_code: result.status, signal: result.signal, error: result.error?.message || null,
    env_override: { PYTHONDONTWRITEBYTECODE: "1" },
    inputs: before, inputs_after: inputs.map(binding), streams,
    outputs: outputs.filter(fs.existsSync).map(binding)
  };
  const receiptBinding = write(`${name}.receipt.json`, receipt);
  return { receipt, binding: receiptBinding, stdout: result.stdout, stderr: result.stderr };
}

if (process.argv[2] === "audit") {
  const manifest = path.join(root, "../fig187-six-span-independent-FIRST-inputs-06/post-FIRST/candidates.json");
  const m = JSON.parse(fs.readFileSync(manifest));
  const audit = path.join(root, "independent-audit.py");
  const inputs = [audit, manifest, ...["spec", "svg", "render", "modernTextCandidate"].map(k => m.candidates[k].path)];
  const r = capture("independent-audit", ["/usr/bin/python3", audit], inputs);
  const data = JSON.parse(r.stdout);
  console.log(JSON.stringify({
    status: data.status, checks: data.checks.length, failures: data.failures,
    panels: data.panels, spans: data.six_spans.map(x => ({ id: x.id, interval: x.source_interval, pixels: x.projected_length_px })),
    receipt: r.binding
  }, null, 2));
  process.exitCode = r.receipt.exit_code;
}
