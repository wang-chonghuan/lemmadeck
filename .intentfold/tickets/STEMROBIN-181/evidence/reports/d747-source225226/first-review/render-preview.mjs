import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const runtime = join(repo, ".claude/skills/ld-s10y-lesson/node_modules/@resvg/resvg-js");
const { Resvg } = require(runtime);
const page = process.argv[2];
const figures = { "0225": "fig-198", "0226": "tbl-p0226-01" };
if (!(page in figures)) throw new Error("Expected page 0225 or 0226.");
const figure = figures[page];
const input = join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d731-source225226-first-author/work/10p/pages", page, "figures", `${figure}.svg`);
const bytes = readFileSync(input);
const png = new Resvg(bytes, { background: "#ffffff" }).render().asPng();
const preview = join(output, "previews", `${figure}.svg-preview.png`);
mkdirSync(dirname(preview), { recursive: true });
writeFileSync(preview, png, { flag: "wx" });
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const receipt = {
  schema: "d739/resvg-preview@1",
  page: Number(page),
  figure,
  cwd: process.cwd(),
  input: { path: input, sha256: sha256(bytes) },
  output: { path: preview, sha256: sha256(png) },
  runtime: { path: runtime, version: require(join(runtime, "package.json")).version },
  native_finalize_replayed: false,
  vectorizer_replayed: false
};
writeFileSync(join(output, "previews", `${figure}.preview-receipt.json`), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify(receipt, null, 2));
