import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck";
const scope = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-n118-text-review");
const target = path.join(scope, "receipts/primary-playback-patent");
const command = ["cloak-fetch", "https://patents.google.com/patent/US1940858A/en"];
const startedAt = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: "utf8", timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
fs.mkdirSync(target, { recursive: true });
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");
const receipt = { command, cwd: root, startedAt, finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, stdoutSha256: sha256(result.stdout || ""), screenshots: false, imageOpens: 0 };
for (const [file, content] of [["stdout.txt", result.stdout || ""], ["stderr.txt", result.stderr || ""], ["receipt.json", JSON.stringify(receipt, null, 2) + "\n"]]) {
  fs.writeFileSync(path.join(target, file), content, { flag: "wx", mode: 0o444 });
  fs.chmodSync(path.join(target, file), 0o444);
}
console.log(JSON.stringify(receipt, null, 2));
if (result.status !== 0) process.exitCode = 1;
