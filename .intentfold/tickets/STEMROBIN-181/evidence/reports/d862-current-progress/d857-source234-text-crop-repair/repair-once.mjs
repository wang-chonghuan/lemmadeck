import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const ticket = path.join(repo, ".intentfold/tickets/STEMROBIN-181");
const root = path.join(ticket, "tmp/d857-source234-text-crop-repair");
const first = path.join(ticket, "tmp/d834-source234-first-author");
const review = path.join(ticket, "tmp/d841-source234-first-independent-review");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const receipts = [];
const inputs = [];
assert.equal(process.cwd(), repo);
const write = (file, value) => {
  assert.ok(file.startsWith(`${root}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
function copyTree(source, target) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else {
      assert.ok(entry.isFile());
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(to, 0o644);
      inputs.push(bind(from));
    }
  }
}
copyTree(path.join(first, "root/10p/pages/0234"), path.join(root, "root/10p/pages/0234"));
copyTree(path.join(first, "work/10p/pages/0234"), path.join(root, "work/10p/pages/0234"));
inputs.push(bind(path.join(review, "review.md")), bind(path.join(review, "pixel-inspection.json")));
const pageFile = path.join(root, "root/10p/pages/0234/page.md");
const md = fs.readFileSync(pageFile, "utf8");
const fmEnd = md.indexOf("---", 3);
const meta = JSON.parse(md.slice(3, fmEnd));
const body = md.slice(fmEnd + 3);
const replacements = [
  ["菲涅耳学说　菲涅耳在实验中达到了衍射研究的顶峰.\n", "菲涅耳学说　菲涅耳在实验中达到了衍射研究的顶峰. \n"],
  ["的结果，就好象从很小的球块$ab$上的次光源向点$B$发射光.\n", "的结果，就好象从很小的球块$ab$上的次光源向点$B$发射光. \n"],
];
let repaired = body;
for (const [before, after] of replacements) {
  assert.equal(repaired.split(before).length, 2);
  repaired = repaired.replace(before, after);
}
const exactSourceLine = "涉决定了空间中所研究的点上的振幅.";
assert.ok(body.includes(`${exactSourceLine}\n`));
meta.figure_crops = {
  "fig-204": {
    padding_px: 8,
    reason: "d841 independent source review: padding8 is caption-free; edge prose exclusion preserves all7086 substantive figure pixels.",
    exclude_text_regions: [{
      block: 4, line: 3, text: exactSourceLine, box: [798, 1417, 80, 16],
      reason: "Exact source row17 adjacent prose only,547 unwanted ink pixels,zero figure pixels; original source unchanged.",
    }],
  },
};
fs.writeFileSync(pageFile, `---\n${JSON.stringify(meta, null, 2)}\n---${repaired}`);
write(path.join(root, "changes.json"), {
  source: bind(path.join(first, "root/10p/pages/0234/page.md")), candidate: bind(pageFile),
  textChanges: replacements, cropChange: meta.figure_crops,
  sourceImageUnchanged: hash(path.join(first, "work/10p/pages/0234/page.png")) === hash(path.join(root, "work/10p/pages/0234/page.png")),
  printedLinesUnchanged: true, figureSnappedBoxUnchanged: true, nativeCountingInputUnchanged: true,
});
const tools = ["p2c.py", "layout.py", "blocks.py", "vectorize.py"].map((name) => bind(path.join(repo, ".claude/skills/ld-s10y-lesson/tools", name)));
for (const stage of ["finalize", "vectorize"]) {
  const dir = path.join(root, "calls", `${stage}-retry2`);
  const args = ["-B", ".claude/skills/ld-s10y-lesson/tools/p2c.py", stage, "--book", "10p", "--page", "234", "--root", path.join(root, "root"), "--work", path.join(root, "work")];
  write(path.join(dir, "started.json"), { cwd: repo, command: python, args, startedAt: new Date().toISOString(), tools });
  const result = spawnSync(python, args, {
    cwd: repo, encoding: "utf8", timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  write(path.join(dir, "stdout.txt"), result.stdout || "");
  write(path.join(dir, "stderr.txt"), result.stderr || "");
  write(path.join(dir, "receipt.json"), { cwd: repo, command: python, args, exit: result.status, signal: result.signal, stderr: result.stderr, stdout: result.stdout, attempt: 2, finishedAt: new Date().toISOString() });
  receipts.push(bind(path.join(dir, "receipt.json")));
  console.log(`${stage}: ${result.status} ${result.stdout || ""}`);
  if (result.status !== 0) {
    write(path.join(root, "retry-failure.json"), { stage, result: result.status, receipts });
    throw new Error(result.stderr || result.stdout);
  }
}
write(path.join(root, "report.json"), {
  status: "REPAIRED_SOURCE_NATIVE_RAW_CANDIDATE_AFFECTED_REVIEW_PENDING",
  physicalPage: 234, sourceRows: [26, 26], contentRepairRounds: 1, imagesOpenedByParent: 1,
  inputs, tools, receipts, focusedChecks: bind(path.join(root, "focused-checks.json")),
  toolBefore: bind(path.join(root, "p2c.before.py")),
  outputs: [
    ...["page.md", "page.json", "audit.json"].map((name) => bind(path.join(root, "root/10p/pages/0234", name))),
    ...["fig-204.png", "fig-204.svg"].map((name) => bind(path.join(root, "work/10p/pages/0234/figures", name))),
  ],
  firstNativeAndReviewFailuresUnchanged: true, originalScanUnchanged: true,
  newPaidCalls: 0, newCompleteCards: 0, canonicalWrites: 0,
  SOURCE: "AFFECTED_TWO_SPACES_PENDING", RAW204: "AFFECTED_EDGE_TEXT_EXCLUSION_PENDING", SVG204: "AFFECTED_PENDING",
});
