import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const base = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(base, "../../../../..");
const [stage, pageText] = process.argv.slice(2);
const page = Number(pageText);
assert(["prepare", "finalize", "vectorize"].includes(stage));
assert([156, 157].includes(page));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const inventory = (directory) => !fs.existsSync(directory) ? [] :
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? inventory(file) : [record(file)];
  });
const writeNew = (file, value) => {
  assert(path.resolve(file).startsWith(`${base}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const sourcePage = path.join(base, "source/10p/pages", String(page).padStart(4, "0"));
const workPage = path.join(base, "work/10p/pages", String(page).padStart(4, "0"));
const prefix = path.join(base, "receipts", `${stage}-${page}-initial`);
assert(!fs.existsSync(`${prefix}.started.json`), "Each native stage runs only once.");
assert(!fs.existsSync(`${prefix}.json`), "Preserve existing receipts.");
if (stage === "prepare") assert(!fs.existsSync(workPage), "Do not overwrite a prepared page.");
const executable = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const args = [
  path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py"), stage,
  "--book", "10p", "--page", String(page),
  "--root", path.join(base, "source"), "--work", path.join(base, "work"),
];
const startedAt = new Date().toISOString();
const inputs = [...inventory(sourcePage), ...inventory(workPage)];
writeNew(`${prefix}.started.json`, { stage, page, executable, args, cwd: repo, startedAt, inputs });
if (stage === "finalize") {
  const snapshot = path.join(base, "history", `finalize-${page}-initial`);
  fs.mkdirSync(snapshot, { recursive: true });
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = path.join(sourcePage, name);
    if (fs.existsSync(file)) fs.copyFileSync(file, path.join(snapshot, name), fs.constants.COPYFILE_EXCL);
  }
}
const result = spawnSync(executable, args, {
  cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
});
writeNew(`${prefix}.json`, {
  stage, page, executable, args, cwd: repo, startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status,
  signal: result.signal, error: result.error?.message ?? null,
  inputs, stdout: result.stdout ?? "", stderr: result.stderr ?? "",
  outputs: [...inventory(sourcePage), ...inventory(workPage)],
  authorOnly: true, independentApproval: false,
});
console.log(result.stdout ?? "");
console.error(result.stderr ?? "");
console.log(JSON.stringify({ receipt: `${prefix}.json`, exitCode: result.status }));
process.exit(result.status ?? 1);
