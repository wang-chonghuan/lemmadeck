const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const cwd = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), cwd);
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const owned = `${base}/source228-234-author`;
const outputRoot = "ssot-resources/soviet10year-textbooks/artifacts/7a/pages";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const fileFact = (file) => ({
  path: path.normalize(file),
  sha256: hash(file),
  bytes: fs.statSync(file).size,
});
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const pages = [];
for (let page = 228; page <= 234; page += 1) {
  const id = String(page).padStart(4, "0");
  const folder = `${outputRoot}/${id}`;
  const data = read(`${folder}/page.json`);
  const audit = read(`${folder}/audit.json`);
  const receiptPath = `${owned}/source-author-p${id}-FIRST.receipt.json`;
  const receipt = read(receiptPath);
  const work = `.tmp/ld-s10y-lesson/7a/pages/${id}`;
  assert.equal(receipt.cwd, cwd);
  assert.deepEqual(receipt.command, [
    ".claude/skills/ld-s10y-lesson/.venv/bin/python", "-B",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py", "finalize",
    "--book", "7a", "--page", String(page), "--work", ".tmp/ld-s10y-lesson",
  ]);
  assert.equal(data.meta.page, page);
  assert.equal(data.meta.printed_page, page - 6);
  for (const stream of receipt.streams) assert.equal(hash(stream.path), stream.sha256);
  const indexed = data.blocks.map((block, index) => ({ ...block, ref: `p${id}#${index + 1}` }));
  pages.push({
    page,
    printedPage: data.meta.printed_page,
    files: ["page.md", "page.json", "audit.json"].map((name) => fileFact(`${folder}/${name}`)),
    inputs: ["page.grid.png", "page.template.md", "layout.json"].map((name) => fileFact(`${work}/${name}`)),
    counts: {
      blocks: data.blocks.length,
      exerciseFragments: data.blocks.filter((block) => block.kind === "ex").length,
      authoredLines: audit.lines_md,
      detectedPrintedLines: audit.lines_printed,
      figures: audit.figures.length,
      errata: audit.errata,
    },
    figureIds: audit.figures.map((figure) => figure.id),
    exerciseLabels: data.blocks.filter((block) => block.kind === "ex").map((block) => block.label),
    headings: data.blocks.filter((block) => ["h1", "h2", "h3", "exhead"].includes(block.kind))
      .map((block) => ({ kind: block.kind, lines: block.lines })),
    boundaries: indexed.filter((block) => block.open || block.cont).map((block) => ({
      ref: block.ref,
      kind: block.kind,
      label: block.label,
      open: block.open,
      cont: block.cont,
      firstLine: block.lines[0],
      lastLine: block.lines.at(-1),
    })),
    notes: data.meta.notes,
    errata: data.meta.errata,
    finalize: {
      attempts: 1,
      exit: receipt.exit,
      signal: receipt.signal,
      error: receipt.error,
      command: receipt.command,
      receipt: fileFact(receiptPath),
      start: fileFact(`${owned}/source-author-p${id}-FIRST.start.json`),
      streams: receipt.streams.map((stream) => fileFact(stream.path)),
      auditErrors: audit.errors,
      normalizations: audit.normalizations,
      unknownChars: audit.unknown_chars,
      katexWarnings: audit.katex_warnings,
    },
  });
}

const table = pages.map((page) =>
  `| ${page.page} | ${page.printedPage} | ${page.counts.blocks} | ${page.counts.exerciseFragments} | ${page.counts.authoredLines}/${page.counts.detectedPrintedLines} | ${page.finalize.exit} | 0 |`
).join("\n");
const markdown = `# Source 228-234 Author

FIRST source author only. No source approval or independent review is claimed.
Cwd: \`${cwd}\`. Assigned branch: \`codex/STEMROBIN-182-textbooks\`; no Git operation performed.

Seven page.md files authored; seven page.json and seven audit.json files retained.
Each page finalized exactly once. Exits: five 0, two 1. No failed finalization rerun; no post-finalize transcription edits.

| Physical | Printed | Blocks | Exercise fragments | Authored/detected lines | Exit | Figures |
|---|---|---|---|---|---|---|
${table}

- Image reads: seven assigned page.grid.png files opened once each, plus one necessary page229 crop; total 8, no reopens or other page images.
- Figures: none on these seven pages; figure IDs and boxes are empty.
- Left boundary: page228 p cont follows accepted page227 p open (theorem 2), printed221 to printed222.
- Internal continuations: worked example2 228->229, example6 229->230, exercise779 230->231, last fraction exercise read as736 231->232, exercise791 232->233.
- Page233 ends exercise798 completely. Page234 starts n38, printed228; its final p open is "我们利用普通的乘法求 $7.34^2$ 的值：". Page235 was not read.
- Page229 retained the crop-confirmed printed33 in example3's numerator and registered p0229-math-1. Page231/232 labels read736/737/738 remain explicitly uncertain; not changed to786/787/788.
- Page229 FIRST failed: authored22 versus detected23. Page233 FIRST failed: authored23 versus detected24. Both only report line-count mismatch; preserve for parent diagnosis from independent source review.
- No prepare rerun, assemble, index, modern edition, answer/choice inspection, publisher, DB, app, Git, dependency, environment, network or tool modification work.

Exact SHA-256, file sizes, per-page counts, boundary block references, input hashes and actual command/receipt hashes are in source228-234-author.json. This report is not acceptance.
`;
const markdownPath = `${owned}/source228-234-author.md`;
fs.writeFileSync(markdownPath, markdown, { flag: "wx" });
const report = {
  schema: "source-author-first-report@1",
  ticket: "STEMROBIN-182",
  role: "source228-234-author",
  phase: "FIRST",
  cwd,
  assignedBranch: "codex/STEMROBIN-182-textbooks",
  branchCheckedWithGit: false,
  book: "7a",
  physicalPages: [228, 229, 230, 231, 232, 233, 234],
  printedPages: [222, 223, 224, 225, 226, 227, 228],
  authored: true,
  sourceApproval: false,
  independentReview: "not performed; pending parent",
  prepare: { reused: true, invocationsHere: 0, receipt: fileFact(`${base}/prepare228-234-FIRST.json`) },
  runner: {
    file: fileFact(`${base}/run-stage.cjs`),
    locationNote: "Existing runner and prepare receipt are in resume182-12, not its source228-234-author child. Runner labels use ../source228-234-author/source-author-pNNNN-FIRST so stage output stays in the owned child; runner is unmodified.",
  },
  priorContinuityText: fileFact(`${outputRoot}/0227/page.md`),
  summary: {
    authoredPages: 7,
    pageMarkdownFiles: 7,
    generatedPageJsonFiles: 7,
    generatedAuditJsonFiles: 7,
    blocks: pages.reduce((total, page) => total + page.counts.blocks, 0),
    exerciseFragments: pages.reduce((total, page) => total + page.counts.exerciseFragments, 0),
    authoredLines: pages.reduce((total, page) => total + page.counts.authoredLines, 0),
    detectedPrintedLines: pages.reduce((total, page) => total + page.counts.detectedPrintedLines, 0),
    finalizeInvocations: 7,
    exitsZero: pages.filter((page) => page.finalize.exit === 0).length,
    exitsNonzero: pages.filter((page) => page.finalize.exit !== 0).length,
    failedPages: pages.filter((page) => page.finalize.exit !== 0).map((page) => page.page),
    figureCount: 0,
    figureIds: [],
    postFinalizeEdits: 0,
  },
  images: {
    batch: "single fresh source author context",
    fullPageReads: 7,
    targetedCropReads: 1,
    reopens: 0,
    totalReads: 8,
    previousPageImageReads: 0,
    laterPageImageReads: 0,
    sentToParent: false,
    perPage: pages.map((page) => ({ page: page.page, fullPageReads: 1 })),
    crop: {
      file: fileFact(`${owned}/p0229-example3-targeted.png`),
      source: ".tmp/ld-s10y-lesson/7a/pages/0229/page.grid.png",
      boxXYXY: [500, 640, 970, 760],
      savedSize: [1410, 360],
      purpose: "Resolve example3's middle numerator from actual pixels; read33, not36.",
    },
  },
  boundaryFacts: {
    left: "p0228#1 p cont follows accepted page227 theorem2 p open; printed221->222.",
    internal: [
      "228->229: prose example2 open/cont",
      "229->230: prose example6 open/cont",
      "230->231: exercise779 open/cont",
      "231->232: fraction exercise read736 open/cont; printed label uncertainty retained",
      "232->233: exercise791 open/cont",
    ],
    section: "n37 continues through page233; page234 starts n38.",
    right: "p0234#10 p open introduces multiplication for7.34^2; next page235 unread.",
    tocFromAssignmentOnly: { n37: 227, n38: 234, n39: 237, n40: 242 },
  },
  restrictions: {
    prepareReruns: 0,
    finalizeReruns: 0,
    imageLimitExceeded: false,
    toolEdits: 0,
    outsideOwnedWrites: 0,
    assembleIndexModernAnswersChoicesPublisherDbAppGitDependenciesEnvironmentNetwork: "not performed",
  },
  pages,
  reportFiles: { markdown: fileFact(markdownPath), generator: fileFact(`${owned}/write-report.cjs`) },
};
const jsonPath = `${owned}/source228-234-author.json`;
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({
  reports: [fileFact(jsonPath), fileFact(markdownPath)],
  summary: report.summary,
  images: report.images.totalReads,
  sourceApproval: false,
}, null, 2));
