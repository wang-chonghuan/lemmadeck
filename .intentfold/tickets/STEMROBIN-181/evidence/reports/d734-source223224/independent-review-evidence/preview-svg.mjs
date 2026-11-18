import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
assert.equal(process.cwd(), repo);
const tmp = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d718-source223224-first-review");
const preparation = path.join(tmp, "d714-source223224-first-preparation");
const first = path.join(tmp, "d716-source223224-first-author");
const candidate = path.join(tmp, "d717-source223224-native-continuation");
const require = createRequire(path.join(repo, ".claude/skills/ld-s10y-lesson/package.json"));
const { Resvg } = require("@resvg/resvg-js");
const files = {};

function bind(id, filename, purpose) {
  const bytes = fs.readFileSync(filename);
  files[id] = {
    path: filename,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length,
    purpose,
  };
  return bytes;
}

bind("first_failure_receipt", path.join(first, "223-finalize.receipt.json"), "Retained original whitelist failure; not rerun");
bind("first_author_report", path.join(first, "report.json"), "Historical first-author report, not a verdict");
bind("candidate_report", path.join(candidate, "report.json"), "Existing native continuation summary, not an independent verdict");

for (const [page, figure] of [["0223", "fig-196"], ["0224", "fig-197"]]) {
  const source = bind(`${page}_source`, path.join(preparation, "work/10p/pages", page, "page.png"), "Original source pixels visually opened once");
  bind(`${page}_grid`, path.join(preparation, "work/10p/pages", page, "page.grid.png"), "Prepared grid companion; not visually opened");
  const candidateSource = bind(`${page}_candidate_source`, path.join(candidate, "work/10p/pages", page, "page.png"), "Candidate working source bytes; not additionally opened");
  assert.equal(createHash("sha256").update(source).digest("hex"), createHash("sha256").update(candidateSource).digest("hex"));
  for (const name of ["page.md", "page.json", "audit.json"]) {
    bind(`${page}_${name}`, path.join(candidate, "root/10p/pages", page, name), "Final source transcription candidate reviewed as text");
  }
  for (const verb of ["finalize", "vectorize"]) {
    bind(`${page}_${verb}`, path.join(candidate, `${Number(page)}-${verb}.receipt.json`), "Saved native receipt reused; no native command rerun");
  }
  bind(`${page}_raw`, path.join(candidate, "work/10p/pages", page, "figures", `${figure}.png`), "Final RAW crop visually opened once");
  const svg = bind(`${page}_svg`, path.join(candidate, "work/10p/pages", page, "figures", `${figure}.svg`), "Existing source SVG; no vectorization rerun");
  const preview = path.join(own, `${figure}-svg-preview.png`);
  fs.writeFileSync(preview, new Resvg(svg, { background: "#ffffff" }).render().asPng(), { flag: "wx" });
  bind(`${page}_svg_preview`, preview, "White-background natural-size rendering of the hash-bound existing SVG");
}

const snapshot = {
  ticket: "STEMROBIN-181",
  cwd: repo,
  createdAt: new Date().toISOString(),
  files,
  nativeCommandsRerun: 0,
  sourceOpens: 2,
  rawOpens: 2,
  svgPreviewOpens: 0,
};
fs.writeFileSync(path.join(own, "file-bindings.json"), JSON.stringify(snapshot, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ previews: ["0223", "0224"].map(page => files[`${page}_svg_preview`]), bindingCount: Object.keys(files).length }, null, 2));
