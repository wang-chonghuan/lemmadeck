import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck";
const scope = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-n118-text-review");
const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const frozenWrite = (file, bytes) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx", mode: 0o444 });
  fs.chmodSync(file, 0o444);
};
const rows = [];
for (const name of ["d040-science-radiation-pressure-first", "d040-science-planck-constant-nist", "d040-science-light-speed-nist"]) {
  const source = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/native", name);
  const receipt = JSON.parse(fs.readFileSync(path.join(source, "receipt.json"), "utf8"));
  if (receipt.exitCode !== 0 || receipt.command[0] !== "cloak-fetch" || receipt.command[1].includes("google.com/search")) {
    throw new Error(`Unusable receipt: ${name}`);
  }
  for (const file of ["receipt.json", "stdout.txt", "stderr.txt"]) {
    const bytes = fs.readFileSync(path.join(source, file));
    frozenWrite(path.join(scope, "receipts", name, file), bytes);
    rows.push({ type: "reused", source: path.relative(root, path.join(source, file)), retained: `receipts/${name}/${file}`, sha256: sha256(bytes) });
  }
}
const fetched = [
  ["primary-variable-area-patent", "https://patents.google.com/patent/US2511199A/en"],
  ["primary-optical-recording-patent", "https://patents.google.com/patent/US4087651A/en"],
  ["cern-photon", "https://opendata.cern.ch/glossary/Photon"],
];
for (const [name, url] of fetched) {
  const startedAt = new Date().toISOString();
  const result = spawnSync("cloak-fetch", [url], { cwd: root, encoding: "utf8", timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
  frozenWrite(path.join(scope, "receipts", name, "stdout.txt"), result.stdout || "");
  frozenWrite(path.join(scope, "receipts", name, "stderr.txt"), result.stderr || "");
  const receipt = { name, command: ["cloak-fetch", url], cwd: root, startedAt, finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, screenshots: false, imageOpens: 0 };
  frozenWrite(path.join(scope, "receipts", name, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n");
  rows.push({ type: "fetched", ...receipt, stdoutSha256: sha256(result.stdout || ""), stdoutBytes: Buffer.byteLength(result.stdout || "") });
  console.log(JSON.stringify(rows.at(-1), null, 2));
  if (result.status !== 0) break;
}
frozenWrite(path.join(scope, "science-receipt-manifest.json"), JSON.stringify({ createdAt: new Date().toISOString(), rows, discoveryResponsesRetained: false }, null, 2) + "\n");
