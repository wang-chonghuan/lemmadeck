import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {createRequire} from "node:module";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const out = path.dirname(new URL(import.meta.url).pathname);
const tool = path.join(root, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js");
const svg = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d216-source174-175-first-author/work/10p/pages/0175/figures/fig-134.svg");
const png = path.join(out, "fig-134.svg-preview.png");
const sha = p => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
if (fs.existsSync(png)) throw new Error("Refuse to overwrite existing preview.");
if (!fs.existsSync(path.join(out, "raw134-pixel-inventory.json"))) throw new Error("Inventory required first.");
const svgHash = sha(svg);
if (svgHash !== "8e69a49ec693890fefcae6f28e2d161a4da0609e10f3b59f1be0b3adaa1d2137") throw new Error("SVG binding drift.");
const messages = [];
const priorArgv = process.argv;
const priorLog = console.log;
process.argv = [process.execPath, tool, svg, png];
console.log = (...args) => messages.push(args.join(" "));
try {
  createRequire(import.meta.url)(tool);
} finally {
  process.argv = priorArgv;
  console.log = priorLog;
}
const rendered = JSON.parse(messages.at(-1));
const receipt = {
  schema: "stemrobin/existing-svg-preview-receipt@1",
  command: [process.execPath, tool, svg, png],
  toolSha256: sha(tool),
  inputSvg: {path: svg, sha256: svgHash},
  inventorySha256: sha(path.join(out, "raw134-pixel-inventory.json")),
  execution: "existing svg_raster.js loaded in the same Node process; no child process or agent spawned",
  exitCode: rendered.ok ? 0 : 1,
  signal: null,
  stdout: messages.join("\n") + "\n",
  stderr: "",
  error: rendered.error ?? null,
  preview: fs.existsSync(png) ? {path: png, sha256: sha(png)} : null,
  nativeVectorizeRerun: false,
  rawRecropped: false
};
fs.writeFileSync(path.join(out, "svg134-preview-receipt.json"), JSON.stringify(receipt, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify(receipt));
if (!rendered.ok) process.exitCode = 1;
