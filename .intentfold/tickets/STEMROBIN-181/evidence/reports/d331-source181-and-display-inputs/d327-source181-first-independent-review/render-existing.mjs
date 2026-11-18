import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = path.join(repo, "tmp/d327-source181-first-independent-review");
const input = path.join(repo, ".intentfold/tickets/STEMROBIN-181/evidence/reports/d285-bounded-progress/d279-source181-first-author");
const renderer = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js");
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const receipts = [];

for (const id of ["fig-137", "fig-138"]) {
  const svg = path.join(input, "work/10p/pages/0181/figures", `${id}.svg`);
  const png = path.join(output, `${id}.existing-svg.resvg.png`);
  if (fs.existsSync(png)) throw new Error(`Refusing a second render: ${png}`);
  const startedUtc = new Date().toISOString();
  const result = spawnSync("node", [renderer, svg, png], { encoding: "utf8", cwd: repo });
  receipts.push({
    id,
    command: ["node", renderer, svg, png],
    startedUtc,
    finishedUtc: new Date().toISOString(),
    invocationCount: 1,
    exitCode: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    inputSHA256: sha(svg),
    outputSHA256: fs.existsSync(png) ? sha(png) : null,
    rendererSHA256: sha(renderer),
    nativeFinalizeInvocations: 0,
    nativeVectorizeInvocations: 0,
  });
  if (result.status !== 0) break;
}
fs.writeFileSync(path.join(output, "raster-receipts.json"), JSON.stringify(receipts, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipts, null, 2));
if (receipts.length !== 2 || receipts.some((r) => r.exitCode !== 0)) process.exit(1);
