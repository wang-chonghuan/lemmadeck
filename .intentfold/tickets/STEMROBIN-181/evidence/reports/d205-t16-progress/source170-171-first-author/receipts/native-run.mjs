import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = process.cwd();
const base = path.resolve(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d195-source170-171-first-author");
const input = path.resolve(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d194-source170-171-preparation/manifest.json");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const write = (file, value) => {
  const target = path.resolve(base, file);
  if (!target.startsWith(base + path.sep)) throw new Error("Write outside author boundary");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
};

const [action, pageArg, attemptArg] = process.argv.slice(2);
if (action === "copy") {
  const expected = "ddd976d2ed61af6fe00e692ab17d2f5fb74bb3fc046c5b2b36d956ef3fcf60bb";
  if (sha(input) !== expected) throw new Error("Input manifest hash mismatch");
  const manifest = JSON.parse(fs.readFileSync(input, "utf8"));
  const verified = [...manifest.receipts, ...manifest.outputs.flatMap((entry) => entry.files)];
  for (const entry of verified) {
    if (sha(path.resolve(repo, entry.path)) !== entry.sha256) throw new Error(`Hash mismatch: ${entry.path}`);
  }
  const work = path.join(base, "work");
  if (fs.existsSync(work)) throw new Error("Refusing to overwrite existing work");
  fs.cpSync(path.resolve(repo, manifest.sourceWork), work, { recursive: true, errorOnExist: true, force: false });
  fs.mkdirSync(path.join(base, "source"), { recursive: true });
  for (const entry of manifest.outputs.flatMap((item) => item.files)) {
    const copied = path.join(work, path.relative(path.resolve(repo, manifest.sourceWork), path.resolve(repo, entry.path)));
    if (sha(copied) !== entry.sha256) throw new Error(`Copied hash mismatch: ${copied}`);
  }
  write("receipts/copy.json", {
    inputManifest: input,
    inputManifestSha256: expected,
    sourceWork: path.resolve(repo, manifest.sourceWork),
    destinationWork: work,
    verifiedInputs: verified,
    copiedFiles: manifest.outputs.flatMap((entry) => entry.files).length,
    reprepare: false,
    preparationSourceDirectoryExists: fs.existsSync(path.resolve(repo, manifest.sourceRoot)),
  });
  console.log("Verified manifest, 2 preparation receipts and 8 prepared files; copied existing work without prepare.");
} else {
  if (!["finalize", "vectorize"].includes(action)) throw new Error("Unsupported native action");
  const page = Number(pageArg);
  const attempt = Number(attemptArg);
  if (![170, 171].includes(page) || ![1, 2].includes(attempt)) throw new Error("Invalid page or attempt");
  if (action === "vectorize" && attempt !== 1) throw new Error("Only one narrow vectorization allowed");
  const name = `receipts/${action}-${page}-attempt${attempt}`;
  if (fs.existsSync(path.join(base, `${name}.json`))) throw new Error("Native attempt already exists");
  const pageDir = path.join(base, "source/10p/pages", String(page).padStart(4, "0"));
  const command = [
    ".claude/skills/ld-s10y-lesson/.venv/bin/python",
    "-B",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    action,
    "--book", "10p",
    "--page", String(page),
    "--root", path.join(base, "source"),
    "--work", path.join(base, "work"),
  ];
  const before = fs.existsSync(path.join(pageDir, "page.md")) ? sha(path.join(pageDir, "page.md")) : null;
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo,
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 16 * 1024 * 1024,
  });
  const snapshots = [];
  for (const file of ["page.md", "page.json", "audit.json"]) {
    const original = path.join(pageDir, file);
    if (!fs.existsSync(original)) continue;
    const target = path.join(base, `${name}.${file}`);
    fs.copyFileSync(original, target, fs.constants.COPYFILE_EXCL);
    snapshots.push({ path: target, sha256: sha(target) });
  }
  write(`${name}.json`, {
    command, action, page, attempt,
    inputPageMdSha256: before,
    exitCode: result.status,
    signal: result.signal,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    spawnError: result.error?.message ?? null,
    snapshots,
    independentReview: false,
  });
  console.log(result.stdout ?? "");
  if (result.stderr) console.error(result.stderr);
  console.log(`Recorded actual native exit ${result.status} in ${name}.json`);
  process.exitCode = result.status ?? 2;
}
