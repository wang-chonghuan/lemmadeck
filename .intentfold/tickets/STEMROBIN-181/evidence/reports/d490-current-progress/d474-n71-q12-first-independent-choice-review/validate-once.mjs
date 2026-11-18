import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const language = process.argv[2];
if (!["zh", "en"].includes(language)) throw new Error("Explicit language required");
const output = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const sourceRepo = path.join(tmp, "d456-n71-q3-first-choice-seeds", language, "repo");
const seed = path.join(sourceRepo, ".tmp/q12-seed.json");
const draft = path.join(tmp, "d473-n71-q12-first-choice-author", language, "draft.json");
const review = path.join(output, `${language}.review.json`);
const validator = path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const python = "/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const argv = ["-B", validator, "--repo", sourceRepo, "--seed", seed, "--draft", draft, "--review", review];
const receiptDir = path.join(output, `${language}-native-first-review`);
if (fs.existsSync(receiptDir)) throw new Error("First review validation already recorded");
if (JSON.parse(fs.readFileSync(review)).outcome !== "pass") throw new Error("Semantic PASS required first");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const inputs = [seed, draft, review, validator, path.join(path.dirname(validator), "prepare.py"),
  ...JSON.parse(fs.readFileSync(seed)).trace.map((entry) => path.join(sourceRepo, entry.path))];
const before = inputs.map((file) => ({ path: file, sha256: hash(file) }));
fs.mkdirSync(receiptDir);
const started = { language, started_at: new Date().toISOString(), command_argv: [python, ...argv], inputs: before };
fs.writeFileSync(path.join(receiptDir, "started.json"), JSON.stringify(started, null, 2) + "\n", { flag: "wx" });
const result = spawnSync(python, argv, { cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, encoding: "utf8" });
fs.writeFileSync(path.join(receiptDir, "stdout.txt"), result.stdout ?? "", { flag: "wx" });
fs.writeFileSync(path.join(receiptDir, "stderr.txt"), result.stderr ?? "", { flag: "wx" });
const after = before.map((entry) => ({ path: entry.path, sha256: hash(entry.path) }));
const unchanged = before.every((entry, index) => entry.sha256 === after[index].sha256);
const receipt = { schema: "stemrobin181/first-choice-review-validation-receipt@1", ...started,
  finished_at: new Date().toISOString(), attempts: 1, exit_code: result.status, signal: result.signal,
  error: result.error?.message ?? null, stdout: result.stdout ?? "", stderr: result.stderr ?? "",
  after, inputs_unchanged: unchanged, structure_only_reruns: 0, image_opens: 0,
  semantic_proof: "Independent reviews provide evidence; checker proves only declared artifact relationships." };
fs.writeFileSync(path.join(receiptDir, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
for (const name of fs.readdirSync(receiptDir)) fs.chmodSync(path.join(receiptDir, name), 0o444);
console.log(JSON.stringify(receipt, null, 2));
if (result.status !== 0 || !unchanged) process.exitCode = 1;
