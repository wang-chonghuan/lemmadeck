import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const require = createRequire(path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"));
const { Resvg } = require("@resvg/resvg-js");
const [input, output] = process.argv.slice(2);
const rendered = new Resvg(fs.readFileSync(input, "utf8"), { background: "white" }).render();
fs.writeFileSync(output, rendered.asPng(), { flag: "wx" });
console.log(JSON.stringify({ input, output, width: rendered.width, height: rendered.height }));
