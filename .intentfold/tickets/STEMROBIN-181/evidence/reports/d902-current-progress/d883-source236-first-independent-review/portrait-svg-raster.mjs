import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const R = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(R, ".intentfold/tickets/STEMROBIN-181");
const O = path.join(T, "tmp/d883-source236-first-independent-review");
const receiptFile = path.join(T, "tmp/d891-source236-portrait-first-vectorize/FIRST/receipt.json");
const receiptSha = "00c7be33a631b44069bc5ec456db046b540cf70d64690764e5046f357d6ab14a";
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
assert.equal(process.cwd(), R);
assert.equal(sha(receiptFile), receiptSha);
const receipt = JSON.parse(readFileSync(receiptFile, "utf8"));
assert.equal(receipt.exit, 0);
assert.equal(receipt.cwd, R);
for (const field of ["source", "png", "svg"]) {
  assert.equal(sha(path.resolve(R, receipt[field].path)), receipt[field].sha256);
}
assert.equal(receipt.source.sha256, receipt.png.sha256);
assert.equal(receipt.source.sha256, "96e76c45711addcd4cdf619cb47bb3192328aa4619000608c8517ec7eee9e82a");
assert.equal(receipt.svg.sha256, "261bcec095ab2123b5d4ab52b3369a8627345385d01a4ec05aa3234128af4a49");
const stdoutFile = path.join(path.dirname(receiptFile), "stdout.txt");
const stderrFile = path.join(path.dirname(receiptFile), "stderr.txt");
assert.equal(readFileSync(stdoutFile, "utf8"), receipt.stdout);
assert.equal(readFileSync(stderrFile, "utf8"), receipt.stderr);
const out = path.join(O, "portrait-first-svg-raster.png");
const evidence = path.join(O, "portrait-svg-raster.receipt.json");
assert.equal(existsSync(out), false);
assert.equal(existsSync(evidence), false);
const tool = path.join(R, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js");
const command = [process.execPath, tool, path.resolve(R, receipt.svg.path), out];
const result = spawnSync(command[0], command.slice(1), {
  cwd: R,
  encoding: "utf8",
  env: { ...process.env, TMPDIR: O },
});
const record = {
  schema: "source-portrait-svg-first-raster-receipt@1",
  vectorReceipt: receiptFile,
  vectorReceiptSha256: receiptSha,
  command,
  cwd: R,
  exit: result.status,
  signal: result.signal,
  error: result.error ? String(result.error) : null,
  stdout: result.stdout,
  stderr: result.stderr,
  toolSha256: sha(tool),
  sourcePng: { path: path.resolve(R, receipt.source.path), sha256: receipt.source.sha256 },
  vectorPng: { path: path.resolve(R, receipt.png.path), sha256: receipt.png.sha256 },
  svg: { path: path.resolve(R, receipt.svg.path), sha256: receipt.svg.sha256 },
  raster: existsSync(out) ? { path: out, sha256: sha(out) } : null,
  rasterInvocationsThisScope: 1,
  vectorizeInvocationsThisReviewer: 0,
  finalizeInvocations: 0,
  sourceProseReviewReplays: 0,
  rasterNotYetVisuallyApproved: true,
};
writeFileSync(evidence, `${JSON.stringify(record, null, 2)}\n`, { flag: "wx" });
assert.equal(result.status, 0);
const dimensions = JSON.parse(result.stdout);
assert.equal(dimensions.ok, true);
assert.deepEqual([dimensions.w, dimensions.h], [341, 467]);
assert.equal(sha(path.resolve(R, receipt.svg.path)), receipt.svg.sha256);
console.log(JSON.stringify(record, null, 2));
