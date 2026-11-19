import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const O = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d860-source236-first-author");
const preparation = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp/d856-source236-first-preparation");
const sourcePage = path.join(preparation, "work/10p/pages/0236");
const work = path.join(O, "work");
const root = path.join(O, "artifacts");
const first = path.join(O, "FIRST");
const skill = path.join(R, ".claude/skills/ld-s10y-lesson");
const python = path.join(skill, ".venv/bin/python");
const stage = process.argv[2];
const preparedNames = ["page.png", "page.grid.png", "layout.json", "page.template.md"];
const toolNames = [
  "tools/p2c.py", "tools/blocks.py", "tools/layout.py", "tools/normalize.py",
  "tools/mathcheck.py", "tools/production.py", "tools/vectorize.py",
  "tools/svg_raster.js", "profiles/soviet-cn.json",
];

assert.equal(process.cwd(), R);
assert.ok(["copy", "finalize", "vectorize", "freeze"].includes(stage));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const digest = (file) => sha(fs.readFileSync(file));
const owned = (file) => {
  assert.ok(file.startsWith(O + path.sep), `unowned write: ${file}`);
  return file;
};
const write = (file, bytes) => {
  owned(file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
};
const json = (file, value) => write(file, JSON.stringify(value, null, 2) + "\n");
const fileHashes = (directory) => {
  const result = {};
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `symlink in author outputs: ${file}`);
    if (entry.isDirectory()) Object.assign(result, fileHashes(file));
    else if (entry.isFile()) result[path.relative(R, file)] = digest(file);
  }
  return result;
};
const toolHashes = () => Object.fromEntries(
  toolNames.map((name) => [path.relative(R, path.join(skill, name)), digest(path.join(skill, name))])
);
const preparationHashes = () => Object.fromEntries([
  ...preparedNames.map((name) => path.join(sourcePage, name)),
  ...["receipt.json", "stdout.txt", "stderr.txt"].map((name) => path.join(preparation, "FIRST", name)),
].map((file) => [path.relative(R, file), digest(file)]));
const snapshot = () => ({
  tools: toolHashes(),
  preparation: preparationHashes(),
  work: fileHashes(work),
  artifacts: fileHashes(root),
});

if (stage === "copy") {
  const receipt = JSON.parse(fs.readFileSync(path.join(preparation, "FIRST/receipt.json"), "utf8"));
  assert.equal(receipt.exit, 0);
  assert.equal(digest(path.join(preparation, "FIRST/stdout.txt")), receipt.stdoutSha256);
  assert.equal(digest(path.join(preparation, "FIRST/stderr.txt")), receipt.stderrSha256);
  const before = snapshot();
  const copies = [];
  for (const name of preparedNames) {
    const source = path.join(sourcePage, name);
    const destination = owned(path.join(work, "10p/pages/0236", name));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
    assert.equal(digest(source), digest(destination));
    copies.push({ source, destination, sha256: digest(destination) });
  }
  const after = snapshot();
  assert.deepEqual(after.preparation, before.preparation);
  assert.deepEqual(after.tools, before.tools);
  json(path.join(first, "copy-receipt.json"), {
    command: [process.execPath, path.join(O, "author-evidence.mjs"), stage],
    cwd: R, recordedAt: new Date().toISOString(), exit: 0,
    preparationReceipt: path.join(preparation, "FIRST/receipt.json"),
    copies, before, after, sourceApproval: false,
  });
  console.log(JSON.stringify({ stage, exit: 0, copies }, null, 2));
} else if (stage === "finalize" || stage === "vectorize") {
  const receiptPath = path.join(first, `${stage}.receipt.json`);
  assert.ok(!fs.existsSync(receiptPath), `${stage} was already attempted`);
  if (stage === "vectorize") {
    const previous = JSON.parse(fs.readFileSync(path.join(first, "finalize.receipt.json"), "utf8"));
    assert.equal(previous.exit, 0);
    const audit = JSON.parse(fs.readFileSync(path.join(root, "10p/pages/0236/audit.json"), "utf8"));
    assert.deepEqual(audit.errors, []);
    assert.ok(audit.figures.length > 0, "no figure: do not vectorize");
  }
  const before = snapshot();
  const args = [
    "-B", path.join(skill, "tools/p2c.py"), stage, "--book", "10p", "--page", "236",
    "--root", root, "--work", work,
  ];
  const temporary = owned(path.join(O, "runtime-tmp"));
  fs.mkdirSync(temporary, { recursive: true });
  const startedAt = new Date().toISOString();
  json(path.join(first, `${stage}.started.json`), {
    command: [python, ...args], cwd: R, startedAt, before,
    environmentOverrides: { TMPDIR: temporary, PYTHONDONTWRITEBYTECODE: "1" },
  });
  const result = spawnSync(python, args, {
    cwd: R,
    env: { ...process.env, TMPDIR: temporary, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 16 * 1024 * 1024,
  });
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  write(path.join(first, `${stage}.stdout.txt`), stdout);
  write(path.join(first, `${stage}.stderr.txt`), stderr);
  const after = snapshot();
  const receipt = {
    command: [python, ...args], cwd: R, startedAt, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdoutPath: path.join(first, `${stage}.stdout.txt`),
    stderrPath: path.join(first, `${stage}.stderr.txt`),
    stdoutSha256: sha(stdout), stderrSha256: sha(stderr),
    before, after,
    toolsUnchanged: JSON.stringify(before.tools) === JSON.stringify(after.tools),
    preparationUnchanged: JSON.stringify(before.preparation) === JSON.stringify(after.preparation),
    sourceApproval: false, independentReview: false, completeCard: false,
    hostUsage: "unknown",
  };
  json(receiptPath, receipt);
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  console.log(JSON.stringify({
    receiptPath, exit: result.status, signal: result.signal,
    toolsUnchanged: receipt.toolsUnchanged, preparationUnchanged: receipt.preparationUnchanged,
  }, null, 2));
  process.exitCode = result.status === 0 && receipt.toolsUnchanged && receipt.preparationUnchanged ? 0 : 1;
} else {
  const report = JSON.parse(fs.readFileSync(path.join(first, "report.json"), "utf8"));
  const hashes = fileHashes(O);
  json(path.join(first, "freeze.json"), {
    schema: "source-page-author-freeze@1",
    recordedAt: new Date().toISOString(), root: O, page: 236, book: "10p",
    status: report.status, sourceApproval: false, independentReview: false,
    scope: "FIRST author-only; no source approval or independent review",
    hashes,
    hostUsage: "unknown",
  });
  console.log(JSON.stringify({
    freeze: path.join(first, "freeze.json"),
    sha256: digest(path.join(first, "freeze.json")),
    files: Object.keys(hashes).length,
  }, null, 2));
}
