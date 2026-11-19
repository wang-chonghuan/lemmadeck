import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181/tmp");
const old = path.join(T, "d860-source236-first-author");
const O = path.join(T, "d870-source236-punctuation-repair");
const root = path.join(O, "root");
const work = path.join(O, "work");
const first = path.join(O, "FIRST");
const skill = path.join(R, ".claude/skills/ld-s10y-lesson");
const page = path.join(root, "10p/pages/0236/page.md");
const stage = process.argv[2];
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const digest = (file) => sha(fs.readFileSync(file));
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
assert.equal(process.cwd(), R);
assert.ok(["copy", "diff", "finalize", "freeze"].includes(stage));

const write = (file, bytes) => {
  assert.ok(file.startsWith(O + path.sep));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: "wx" });
};
const json = (file, value) => write(file, JSON.stringify(value, null, 2) + "\n");
const hashes = (directory) => {
  const result = {};
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `redirected author path: ${file}`);
    if (entry.isDirectory()) Object.assign(result, hashes(file));
    else if (entry.isFile()) result[path.relative(R, file)] = digest(file);
  }
  return result;
};
const tools = () => Object.fromEntries([
  "tools/p2c.py", "tools/blocks.py", "tools/layout.py", "tools/normalize.py",
  "tools/mathcheck.py", "tools/production.py", "tools/vectorize.py",
  "tools/svg_raster.js", "profiles/soviet-cn.json",
].map((file) => [path.relative(R, path.join(skill, file)), digest(path.join(skill, file))]));
const snapshot = () => ({ d860: hashes(old), tools: tools(), root: hashes(root), work: hashes(work) });
const copy = (source, destination) => {
  assert.ok(destination.startsWith(O + path.sep));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o644);
  assert.equal(digest(source), digest(destination));
  return { source, destination, sha256: digest(destination) };
};

if (stage === "copy") {
  const before = snapshot();
  assert.equal(digest(path.join(old, "FIRST/freeze.json")),
    "426be0a40c4587230c780f06be1e33e78b7807c14ab40ec89a4fd358d54da383");
  for (const [file, expected] of Object.entries(readJson(path.join(old, "FIRST/freeze.json")).hashes)) {
    assert.equal(digest(path.join(R, file)), expected, `FIRST changed: ${file}`);
  }
  const copies = [];
  for (const name of ["page.png", "page.grid.png", "layout.json", "page.template.md"]) {
    copies.push(copy(path.join(old, "work/10p/pages/0236", name),
      path.join(work, "10p/pages/0236", name)));
  }
  for (const name of ["page.md", "page.json", "audit.json"]) {
    copies.push(copy(path.join(old, "artifacts/10p/pages/0236", name),
      path.join(root, "10p/pages/0236", name)));
  }
  copies.push(copy(path.join(old, "work/10p/pages/0236/figures/tbl-p0236-01.png"),
    path.join(work, "10p/pages/0236/figures/tbl-p0236-01.png")));
  copies.push(copy(page, path.join(first, "page.before.md")));
  const after = snapshot();
  assert.deepEqual(before.d860, after.d860);
  assert.deepEqual(before.tools, after.tools);
  json(path.join(first, "copy.receipt.json"), {
    cwd: R, recordedAt: new Date().toISOString(), exit: 0, copies, before, after,
    purpose: "Exact writable FIRST inputs; no preparation or source approval",
  });
  console.log(JSON.stringify({ exit: 0, copies }, null, 2));
} else if (stage === "diff") {
  const baselinePath = path.join(first, "page.before.md");
  const baseline = fs.readFileSync(baselinePath, "utf8");
  let expected = baseline;
  const changes = readJson(path.join(old, "FIRST/report.json")).failure.affectedKnownRows;
  assert.equal(changes.length, 6);
  for (const change of changes) {
    const from = change.after + change.candidate;
    assert.equal(expected.split(from).length - 1, 1, `nonunique reported token: ${from}`);
    expected = expected.replace(from, change.after + change.source);
  }
  assert.equal(fs.readFileSync(page, "utf8"), expected, "changes outside the six authorized dots");
  const args = ["-u", "--label", "d860/FIRST/page.md", "--label", "d870/repair/page.md", baselinePath, page];
  const before = snapshot();
  const result = spawnSync("diff", args, { cwd: R });
  write(path.join(first, "punctuation.diff"), result.stdout);
  write(path.join(first, "diff.stderr.txt"), result.stderr);
  const after = snapshot();
  json(path.join(first, "diff.receipt.json"), {
    command: ["diff", ...args], cwd: R, exit: result.status, signal: result.signal,
    expectedDifferenceExit: 1, stdoutSha256: sha(result.stdout), stderrSha256: sha(result.stderr),
    baselineSha256: digest(baselinePath), candidateSha256: digest(page),
    changes, exactAuthorizedDiff: fs.readFileSync(page, "utf8") === expected, before, after,
  });
  assert.equal(result.status, 1);
  copy(page, path.join(first, "page.repaired-before-native.md"));
  process.stdout.write(result.stdout);
} else if (stage === "finalize") {
  assert.ok(!fs.existsSync(path.join(first, "finalize.started.json")), "finalize was already attempted");
  const diff = readJson(path.join(first, "diff.receipt.json"));
  assert.equal(diff.candidateSha256, digest(page));
  const before = snapshot();
  const temporary = path.join(O, "runtime-tmp");
  fs.mkdirSync(temporary, { recursive: true });
  const command = [path.join(skill, ".venv/bin/python"), "-B", path.join(skill, "tools/p2c.py"),
    "finalize", "--book", "10p", "--page", "236", "--root", root, "--work", work];
  const startedAt = new Date().toISOString();
  json(path.join(first, "finalize.started.json"), { command, cwd: R, startedAt, before });
  const result = spawnSync(command[0], command.slice(1), {
    cwd: R, env: { ...process.env, TMPDIR: temporary, PYTHONDONTWRITEBYTECODE: "1" },
    maxBuffer: 16 * 1024 * 1024,
  });
  const stdout = result.stdout ?? Buffer.alloc(0);
  const stderr = result.stderr ?? Buffer.alloc(0);
  write(path.join(first, "finalize.stdout.txt"), stdout);
  write(path.join(first, "finalize.stderr.txt"), stderr);
  const after = snapshot();
  const receipt = {
    command, cwd: R, startedAt, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdoutSha256: sha(stdout), stderrSha256: sha(stderr), before, after,
    d860Unchanged: JSON.stringify(before.d860) === JSON.stringify(after.d860),
    toolsUnchanged: JSON.stringify(before.tools) === JSON.stringify(after.tools),
    repairedTextUnchangedByNative: digest(page) === diff.candidateSha256,
    sourceApproval: false, independentReview: false,
    environmentOverrides: { TMPDIR: temporary, PYTHONDONTWRITEBYTECODE: "1" },
  };
  json(path.join(first, "finalize.receipt.json"), receipt);
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  console.log(JSON.stringify({
    exit: result.status, d860Unchanged: receipt.d860Unchanged,
    toolsUnchanged: receipt.toolsUnchanged, repairedTextUnchangedByNative: receipt.repairedTextUnchangedByNative,
  }, null, 2));
  process.exitCode = result.status === 0 && receipt.d860Unchanged && receipt.toolsUnchanged
    && receipt.repairedTextUnchangedByNative ? 0 : 1;
} else {
  const report = readJson(path.join(first, "report.json"));
  const receipt = readJson(path.join(first, "finalize.receipt.json"));
  assert.deepEqual(hashes(old), receipt.after.d860, "d860 changed after native receipt");
  json(path.join(first, "freeze.json"), {
    schema: "source-page-bounded-author-freeze@1", recordedAt: new Date().toISOString(),
    root: O, status: report.status, hashes: hashes(O),
    sourceApproval: false, independentReview: false, hostUsage: "unknown",
  });
  console.log(JSON.stringify({
    report: path.join(first, "report.json"), reportSha256: digest(path.join(first, "report.json")),
    freeze: path.join(first, "freeze.json"), freezeSha256: digest(path.join(first, "freeze.json")),
    pageMdSha256: digest(page), diffSha256: digest(path.join(first, "punctuation.diff")),
  }, null, 2));
}
