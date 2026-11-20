import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const out = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n41-choice-author");
const require = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/package.json"));
const { Resvg } = require("@resvg/resvg-js");
for (const id of ["fig-160", "fig-161"]) {
  const source = path.join(repo, `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/${id}.svg`);
  const svg = fs.readFileSync(source, "utf8")
    .replaceAll("var(--ld-figure-ink, #15201f)", "#15201f")
    .replaceAll("var(--ld-figure-paper, #ffffff)", "#ffffff");
  const rendered = new Resvg(svg, { background: "#ffffff", font: { loadSystemFonts: true } }).render();
  const target = path.join(out, `${id}.fallback-colors.png`);
  fs.writeFileSync(target, rendered.asPng(), { flag: "wx" });
  console.log(JSON.stringify({ source, target, width: rendered.width, height: rendered.height }));
}
