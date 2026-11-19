const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
const root = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n35-choice-author";
if (process.cwd() !== cwd) throw new Error("Wrong working directory");

const stage = process.argv[2];
const seed = `${root}/seed.json`;
const draft = `${root}/draft.json`;
const commands = {
  prepare: [
    "python3", "-B", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "prepare",
    "--repo", ".", "--book", "7a", "--lesson", "alg7-c4-s1-n35",
    "--exercise", "754", "--exercise", "755", "--exercise", "756",
    "--exercise", "757", "--exercise", "758", "--exercise", "759",
    "--exercise", "760",
    "--concept-block", "0", "--concept-block", "6",
    "--concept-block", "15", "--concept-block", "16",
    "--concept-figure", "fig-54", "--out", seed
  ],
  validate: [
    "python3", "-B", ".agents/skills/ld-s10y-choice/scripts/validate.py",
    "--repo", ".", "--seed", seed, "--draft", draft
  ]
};
if (!Object.hasOwn(commands, stage)) throw new Error("Unknown stage");
const prefix = path.join(root, `FIRST-${stage}`);
for (const extension of ["stdout", "stderr", "receipt.json"]) {
  if (fs.existsSync(`${prefix}.${extension}`)) throw new Error("FIRST stage already recorded");
}
const command = commands[stage];
const started = new Date().toISOString();
const result = spawnSync(command[0], command.slice(1), { cwd, encoding: "utf8" });
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value).sort().map(k => `${canonical(k)}:${canonical(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c =>
    `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
};
const artifacts = [seed, ...(stage === "validate" ? [draft] : [])]
  .filter(p => fs.existsSync(p))
  .map(p => {
    const bytes = fs.readFileSync(p);
    return { path: p, sha256: hash(bytes), canonical_sha256: hash(canonical(JSON.parse(bytes))) };
  });
fs.writeFileSync(`${prefix}.stdout`, result.stdout || "", { flag: "wx" });
fs.writeFileSync(`${prefix}.stderr`, result.stderr || "", { flag: "wx" });
const receipt = {
  schema: "n35-choice-author-mechanical-stage-v1",
  stage, ordinal: "FIRST", cwd, command,
  started, finished: new Date().toISOString(),
  exit_code: result.status, signal: result.signal,
  error: result.error ? result.error.message : null,
  stdout_sha256: hash(result.stdout || ""),
  stderr_sha256: hash(result.stderr || ""),
  artifacts,
  semantic_approval: false,
  scope: stage === "validate"
    ? "Structural source/hash/contract check only; parent owns independent semantic gate."
    : "Formal source whitelist preparation after parent modern-finalize notice."
};
fs.writeFileSync(`${prefix}.receipt.json`, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
console.log(JSON.stringify(receipt, null, 2));
process.exitCode = result.status ?? 2;
