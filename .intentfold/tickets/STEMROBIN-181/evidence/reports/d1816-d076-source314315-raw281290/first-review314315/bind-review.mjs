import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong working directory");
const own = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d074-source314315-review";
const authorPath = ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d071-source314315-author/author-freeze.json";
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(path.resolve(root, file))).digest("hex");
const readJson = (file) => JSON.parse(fs.readFileSync(path.resolve(root, file), "utf8"));
const report = readJson(`${own}/report.json`);
const ledger = readJson(`${own}/image-ledger.json`);
const author = readJson(authorPath);
const inputs = new Map();

// Bind evidence bytes only; semantic verdicts are authored in report.json.
function bind(file, expected, role) {
  const actual = sha(file);
  if (expected && actual !== expected) throw new Error(`Evidence changed: ${file}`);
  const prior = inputs.get(file);
  inputs.set(file, {
    path: file,
    absolutePath: path.resolve(root, file),
    sha256: actual,
    ...(expected ? {authorExpectedSha256: expected, authorFreezeMatch: true} : {}),
    roles: [...new Set([...(prior?.roles ?? []), role])],
  });
}
function traverse(value) {
  if (Array.isArray(value)) return value.forEach(traverse);
  if (!value || typeof value !== "object") return;
  if (value.path && value.sha256) bind(value.path, value.sha256, "author-freeze-referenced evidence");
  Object.values(value).forEach(traverse);
}
bind(authorPath, report.authorFreeze.sha256, "author freeze");
traverse(author);
for (const image of ledger.opens) bind(image.path, image.sha256, `independently opened image ${image.ordinal}`);
for (const receipt of author.nativeReceipts) {
  for (const basename of ["stdout.txt", "stderr.txt"]) {
    const file = path.join(path.dirname(receipt.path), basename);
    bind(file, undefined, "existing native execution text, including failure and repair; not rerun");
  }
}
for (const file of [
  ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live181-read/stdout.txt",
  ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live179-comments-read/stdout.txt",
  ".intentfold/readme.md",
  ".intentfold/project.json",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  ".intentfold/charter/product.md",
  ".intentfold/charter/ui.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".agents/skills/ld-s10y-image/references/quality-gate.md",
]) bind(file, undefined, "read authority or governing instruction");
bind("ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0313/page.md", undefined, "adjacent tail TEXT only; whole-file hash, no page review");

const consistency = author.records.map((record) => {
  const md = fs.readFileSync(record.pageMd.path, "utf8");
  const [, meta, body] = md.split(/^---\s*$/m);
  const json = readJson(record.pageJson.path);
  const blocks = body.trim().split(/\n\s*\n/).map((chunk) => {
    const match = chunk.match(/^<!-- (.*?) -->\n([\s\S]*)$/);
    if (!match) throw new Error("Unparsed MD block");
    return {header: match[1], lines: match[1].startsWith("fig ") ? [] : match[2].split("\n")};
  });
  if (JSON.stringify(JSON.parse(meta)) !== JSON.stringify(json.meta)) throw new Error("MD/JSON meta drift");
  if (blocks.length !== json.blocks.length) throw new Error("MD/JSON block-count drift");
  blocks.forEach((block, index) => {
    if (JSON.stringify(block.lines) !== JSON.stringify(json.blocks[index].lines)) throw new Error("MD/JSON row drift");
  });
  const source = report.records.find((item) => item.page === record.page).SOURCE;
  for (const coverage of source.rows.coverage) {
    if (!coverage.rowVerdicts) continue;
    const current = json.blocks[coverage.block - 1];
    if (current.lines.length !== coverage.rowVerdicts.length) throw new Error("Incomplete authored row coverage");
    coverage.mdLines.forEach((line, index) => {
      if (md.split("\n")[line - 1] !== current.lines[index]) throw new Error("Incorrect MD line reference");
    });
  }
  return {page: record.page, metaExact: true, allBlockLinesExact: true, blocks: blocks.length, authoredRowReferencesComplete: true};
});
if (ledger.opens.length !== 8 || ledger.actualImageOpens !== 8) throw new Error("Ledger count drift");
const before = readJson(".intentfold/tickets/STEMROBIN-181/tmp/d1816-d071-source315-before/page.json");
const current = readJson("ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0315/page.json");
if (JSON.stringify(before.blocks) !== JSON.stringify(current.blocks)) throw new Error("315 before/current block drift");
const comments = readJson(report.authority.receipt179Comments);
if (comments.results[0].id !== report.authority.latest179CommentId) throw new Error("Authority ID drift");

function writeOwned(basename, value) {
  const output = path.resolve(root, own, basename);
  if (path.dirname(output) !== path.resolve(root, own)) throw new Error("Write outside owned directory");
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, {flag: "wx"});
}
const frozenAt = new Date().toISOString();
writeOwned("input-hashes.json", {
  schema: "STEMROBIN-181/review-input-hashes@1",
  batch: "D074",
  boundAt: frozenAt,
  mechanicalOnly: true,
  allAuthorFreezeReferencesMatch: true,
  mdJsonConsistency: consistency,
  source315BeforeCurrentAll14BlocksExact: true,
  source315BeforeCurrentCropGeometryExact: JSON.stringify(before.meta.figures) === JSON.stringify(current.meta.figures),
  inputs: [...inputs.values()],
});
const artifacts = ["report.json", "image-ledger.json", "grill.md", "input-hashes.json", "bind-review.mjs"].map((basename) => ({
  path: `${own}/${basename}`,
  sha256: sha(`${own}/${basename}`),
}));
for (const input of inputs.values()) {
  if (sha(input.path) !== input.sha256) throw new Error(`Input changed during binding: ${input.path}`);
}
writeOwned("review-freeze.json", {
  schema: "STEMROBIN-181/independent-review-freeze@1",
  batch: "D074",
  frozenAt,
  status: report.status,
  reviewerIsAuthor: false,
  authorFreeze: report.authorFreeze,
  artifacts,
  inputBindings: {path: `${own}/input-hashes.json`, sha256: sha(`${own}/input-hashes.json`)},
  allInputHashesStableAtFreeze: true,
  actualImageOpens: 8,
  actualContextImageOpens: 8,
  reopens: 0,
  whole127a128Approval: false,
  sourcePagesAdded: 0,
  parentConsumptionPending: true,
  repairsPerformed: false,
  nativeProducerReruns: 0,
});
console.log(JSON.stringify({status: report.status, actualImageOpens: 8, artifacts, reviewFreeze: {
  path: `${own}/review-freeze.json`,
  sha256: sha(`${own}/review-freeze.json`),
}}, null, 2));
