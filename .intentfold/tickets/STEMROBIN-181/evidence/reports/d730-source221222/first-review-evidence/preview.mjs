import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
if (process.cwd() !== repo) throw new Error("Wrong working directory");
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d711-source221222-first-review");
const prepared = path.join(tmp, "d709-source221222-first-preparation/work/10p/pages");
const authored = path.join(tmp, "d710-source221222-first-author");
const require = createRequire(import.meta.url);
const runtime = require.resolve("@resvg/resvg-js", {
  paths: [path.join(repo, ".claude/skills/ld-s10y-lesson")],
});
const { Resvg } = require(runtime);
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const binding = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: digest(bytes) };
};
const files = [];
for (const page of ["0221", "0222"]) {
  files.push(path.join(prepared, page, "page.png"));
  for (const name of ["page.md", "page.json", "audit.json"]) {
    files.push(path.join(authored, "root/10p/pages", page, name));
  }
}
const figure = path.join(authored, "work/10p/pages/0221/figures/fig-195");
files.push(`${figure}.png`, `${figure}.svg`);
for (const name of [
  "221-finalize.receipt.json",
  "222-finalize.receipt.json",
  "221-vectorize.receipt.json",
  "222-vectorize.receipt.json",
]) {
  files.push(path.join(authored, name));
}
const inputs = files.map(binding);
const svgPreview = path.join(own, "fig-195.svg-preview.png");
const rendered = new Resvg(fs.readFileSync(`${figure}.svg`), {
  background: "#ffffff",
  fitTo: { mode: "width", value: 1096 },
}).render();
fs.writeFileSync(svgPreview, rendered.asPng());

const crops = [
  {
    source: path.join(prepared, "0221/page.png"),
    output: path.join(own, "source-0221-row8-10-caption.png"),
    box: [180, 605, 1380, 830],
  },
  {
    source: path.join(prepared, "0222/page.png"),
    output: path.join(own, "source-0222-refraction-emphasis.png"),
    box: [160, 200, 1355, 1090],
  },
  {
    source: path.join(prepared, "0222/page.png"),
    output: path.join(own, "source-0222-n83-quote-punctuation.png"),
    box: [150, 1320, 1355, 2005],
  },
];
execFileSync(
  path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
  [
    "-B",
    "-c",
    "import json,sys\nfrom PIL import Image\nfor c in json.loads(sys.argv[1]):\n    im=Image.open(c['source'])\n    im.crop(tuple(c['box'])).save(c['output'])\n",
    JSON.stringify(crops),
  ],
  { cwd: repo, stdio: "pipe" },
);
const result = {
  scope: "STEMROBIN-181 source221222 first independent review only",
  cwd: repo,
  own,
  runtime,
  preview: binding(svgPreview),
  previewSize: { width: rendered.width, height: rendered.height },
  crops: crops.map((crop) => ({ ...crop, ...binding(crop.output) })),
  inputs,
  receiptsReplayed: false,
};
fs.writeFileSync(path.join(own, "bindings.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
