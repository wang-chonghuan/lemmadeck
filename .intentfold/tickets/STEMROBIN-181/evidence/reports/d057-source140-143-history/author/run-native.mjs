import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const base = path.join(repo, "tmp/d053-10p-source140-143-author");
const [stage, pageText, attempt = "initial"] = process.argv.slice(2);
const page = Number(pageText);
if (!["prepare", "finalize", "vectorize"].includes(stage) ||
    ![140, 141, 142, 143].includes(page) ||
    !["initial", "correction-1"].includes(attempt)) {
  throw new Error("Expected an authorized native stage, page 140-143 and bounded attempt.");
}
const receipts = path.join(base, "receipts");
fs.mkdirSync(receipts, { recursive: true });
const prefix = path.join(receipts, `${stage}-${page}-${attempt}`);
const resultPath = `${prefix}.json`;
if (fs.existsSync(resultPath)) {
  console.log(fs.readFileSync(resultPath, "utf8"));
  process.exit(0);
}
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const inventory = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? inventory(file) : [{ path: file, sha256: hash(file), bytes: fs.statSync(file).size }];
  });
};
const sourcePage = path.join(base, "source/10p/pages", String(page).padStart(4, "0"));
const workPage = path.join(base, "work/10p/pages", String(page).padStart(4, "0"));
if (stage === "prepare" && fs.existsSync(path.join(workPage, "page.png")) &&
    fs.existsSync(path.join(workPage, "page.template.md"))) {
  const reused = { stage, page, attempt, reusedExistingOutputs: true, exitCode: null,
    outputs: inventory(workPage) };
  fs.writeFileSync(resultPath, `${JSON.stringify(reused, null, 2)}\n`);
  console.log(JSON.stringify(reused, null, 2));
  process.exit(0);
}
const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const args = [
  path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py"), stage,
  "--book", "10p", "--page", String(page),
  "--root", path.join(base, "source"),
  "--work", path.join(base, "work"),
];
const inputs = [...inventory(sourcePage), ...inventory(workPage)];
const startedAt = new Date().toISOString();
fs.writeFileSync(`${prefix}.started.json`, `${JSON.stringify({ executable, args, cwd: repo, startedAt, inputs }, null, 2)}\n`);
if (stage === "finalize") {
  const snapshot = path.join(base, "history", `${stage}-${page}-${attempt}`);
  fs.mkdirSync(snapshot, { recursive: true });
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = path.join(sourcePage, name);
    if (fs.existsSync(file)) fs.copyFileSync(file, path.join(snapshot, name));
  }
}
const result = spawnSync(executable, args, {
  cwd: repo,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8",
  maxBuffer: 16 * 1024 * 1024,
});
fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout ?? "");
fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr ?? "");
const receipt = {
  stage, page, attempt, executable, args, cwd: repo, startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal,
  error: result.error?.message ?? null, inputs,
  stdout: { path: `${prefix}.stdout.txt`, sha256: hash(`${prefix}.stdout.txt`) },
  stderr: { path: `${prefix}.stderr.txt`, sha256: hash(`${prefix}.stderr.txt`) },
  outputs: [...inventory(sourcePage), ...inventory(workPage)],
};
fs.writeFileSync(resultPath, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(result.stdout ?? "");
console.error(result.stderr ?? "");
console.log(JSON.stringify({ receipt: resultPath, exitCode: result.status }));
process.exit(result.status ?? 1);
