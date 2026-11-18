import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../../..");
const language = process.argv[2];
assert.ok(["zh", "en"].includes(language));
const mappingPath = path.join(root, "mapping.receipt.json");
const mapping = JSON.parse(fs.readFileSync(mappingPath));
const selected = mapping.outputs.find((item) => item.language === language);
const script = path.join(repo, ".agents/skills/ld-s10y-choice/scripts/validate.py");
const argv = [
  script,
  "--repo", selected.repo,
  "--seed", selected.seed.path,
  "--draft", selected.draft.path,
  "--review", selected.review.path
];
const receiptPath = path.join(root, language, "native-validation.receipt.json");
assert.equal(fs.existsSync(receiptPath), false);
const started = new Date().toISOString();
const result = spawnSync("python3", argv, {
  cwd: repo,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
  maxBuffer: 1024 * 1024
});
const hash = (filename) => crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex");
const receipt = {
  schema: "d293-native-validation-receipt@1",
  language,
  executable: "python3",
  argv,
  cwd: repo,
  environmentOverride: { PYTHONDONTWRITEBYTECODE: "1" },
  started,
  completed: new Date().toISOString(),
  invocationCount: 1,
  exitCode: result.status,
  signal: result.signal,
  error: result.error?.message ?? null,
  stdout: result.stdout ?? "",
  stderr: result.stderr ?? "",
  interpretation: result.status === 3
    ? "Native mechanical checks passed; retained nonpassing semantic outcome revise. Exit 3 is not a tool failure and will not be rerun to obtain pass."
    : "Actual exit retained; no retry performed.",
  snapshotBindings: {
    phase1: mapping.phase1,
    mapping: { path: mappingPath, sha256: hash(mappingPath) },
    seed: { path: selected.seed.path, sha256: hash(selected.seed.path) },
    draft: { path: selected.draft.path, sha256: hash(selected.draft.path) },
    review: { path: selected.review.path, sha256: hash(selected.review.path) },
    validator: { path: script, sha256: hash(script) }
  },
  newImages: 0,
  cumulativeImages: 24,
  sourceArithmeticRerun: false,
  semanticReviewRepeated: false
};
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ receiptPath, exitCode: result.status, stdout: receipt.stdout, stderr: receipt.stderr }));
process.exitCode = result.status ?? 1;
