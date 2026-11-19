const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const W = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
assert.equal(process.cwd(), W);
const evidence = path.join(W, ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11");
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const bind = (file) => ({ path: path.resolve(file), sha256: sha256(file) });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const text = (block) => block.lines.join("\n");

const boundaryFacts = {
  221: {
    left: "p cont; physical220 ends in 就; this page begins 是函数, joining 就是函数.",
    right: "p open, final printed character 映; physical222 begins 射.",
    continuation: "n35 prose; figure54 is transparent to paragraph boundaries.",
  },
  222: {
    left: "p cont: 射. closes physical221's 映.",
    right: "exercise760 complete; physical223 begins section11 and n36, with no n35 continuation on that page.",
    continuation: "n35 exercises754-760; 复 习 题 precedes exercise760.",
  },
  223: {
    left: "section11 and n36 begin at physical223/printed217; no left continuation.",
    right: "p open: example1 statement complete, its worked solution continues at physical224.",
    continuation: "Examples are instructional prose, not exercise objects.",
  },
  224: {
    left: "p cont: worked solution of physical223 example1.",
    right: "ex763 open: only the introductory prompt is printed; subparts begin at physical225.",
    continuation: "Example1's complete formula contains one ↵ at its actual printed break.",
  },
  225: {
    left: "ex763 cont: subparts а), б), в) close the prompt from physical224.",
    right: "ex769 open: this page stops after г); physical226 contains д), е).",
    continuation: "Preserve original horizontal order and asymmetric layout of exercise767.",
  },
  226: {
    left: "ex769 cont: д), е) close exercise769.",
    right: "exercise776 complete; physical227 starts n37.",
    continuation: "Exercises773 and774 request drawing but contain no source figure.",
  },
  227: {
    left: "n37 begins at physical227/printed221; no left continuation.",
    right: "p open: theorem2 statement is printed in full, but proof and subsequent n37 material are unobserved.",
    continuation: "Do not infer physical228 text or claim n37 closure.",
  },
};

const pages = [];
for (let page = 221; page <= 227; page += 1) {
  const number = String(page).padStart(4, "0");
  const durable = path.join(W, "ssot-resources/soviet10year-textbooks/artifacts/7a/pages", number);
  const prepared = path.join(W, ".tmp/ld-s10y-lesson/7a/pages", number);
  const pageJson = read(path.join(durable, "page.json"));
  const audit = read(path.join(durable, "audit.json"));
  const md = fs.readFileSync(path.join(durable, "page.md"), "utf8");
  const meta = JSON.parse(md.split("---", 3)[1]);
  assert.deepEqual(meta, pageJson.meta);
  assert.equal(audit.lines_md, audit.lines_printed);
  assert.deepEqual(audit.errors, []);
  assert.equal(meta.render.sha256, sha256(path.join(prepared, "page.png")));
  const base = path.join(evidence, "stages", `source-author-p${number}-FIRST`);
  const receipt = read(`${base}.receipt.json`);
  const start = read(`${base}.start.json`);
  assert.deepEqual(start.command, receipt.command);
  assert.equal(start.cwd, W);
  assert.equal(receipt.exit, 0);
  assert.equal(receipt.signal, null);
  assert.equal(receipt.error, null);
  for (const stream of receipt.streams) {
    assert.equal(stream.sha256, sha256(path.join(W, stream.path)));
  }
  const content = pageJson.blocks.filter((block) => block.kind !== "foot");
  const first = content[0];
  const last = content.at(-1);
  const figures = audit.figures.map((figure) => ({
    id: figure.id,
    label: figure.label,
    originalWholeGraph: true,
    subfigures: [],
    coarseBox: figure.from,
    cropBox: figure.box,
    captionSeparate: true,
    ownerExercise: null,
    crop: bind(path.join(prepared, "figures", `${figure.id}.png`)),
    imageReadsOfCrop: 0,
  }));
  pages.push({
    physicalPage: page,
    printedPage: meta.printed_page,
    status: "FIRST-source-author-finalize-pass",
    finalizeInvocations: 1,
    exit: receipt.exit,
    signal: receipt.signal,
    error: receipt.error,
    printedLines: audit.lines_printed,
    markdownLines: audit.lines_md,
    blockCount: pageJson.blocks.length,
    sourceFiles: ["page.md", "page.json", "audit.json"].map((name) => bind(path.join(durable, name))),
    preparedInputs: ["page.png", "page.grid.png", "page.template.md", "layout.json"].map((name) => bind(path.join(prepared, name))),
    receipt: {
      ...receipt,
      streams: receipt.streams.map((stream) => ({ ...stream, path: path.join(W, stream.path) })),
      files: ["start.json", "stdout", "stderr", "receipt.json"].map((suffix) => bind(`${base}.${suffix}`)),
    },
    imageUsage: { grid: 1, pagePng: 0, crop: 0, reopen: 0 },
    boundaries: boundaryFacts[page],
    exactFirstBlock: { kind: first.kind, label: first.label, cont: first.cont, text: text(first) },
    exactLastBlock: { kind: last.kind, label: last.label, open: last.open, text: text(last) },
    exactOpenTails: content.filter((block) => block.open).map((block) => ({
      kind: block.kind, label: block.label, text: text(block),
    })),
    figures,
    mathematicalErrata: meta.errata,
    glyphUncertainty: page === 227 ? [
      {
        text: "我们应当规定",
        disposition: "Retained as read on the sole grid inspection. Wording is awkward; not a confirmed mathematical erratum. No reopen requested or used.",
      },
    ] : [],
    notes: meta.notes,
    normalizationCount: audit.normalizations.length,
    unknownCharacters: audit.unknown_chars,
    katexWarnings: audit.katex_warnings,
    postFinalizeMetadataEdit: page === 222 ? {
      files: ["page.md", "page.json"],
      reason: "Corrected boundary note only after first inspection of physical223 established its direct section11/n36 opening.",
      textBlocksChanged: false,
      finalizeRepeated: false,
    } : null,
  });
}

const sourcePdf = path.join(W, "ssot-resources/soviet10year-textbooks/sources/soviet10years/7a 苏联十年制学校数学教材 代数 七年级.pdf");
const source = bind(sourcePdf);
assert.equal(source.sha256, read(pages[0].sourceFiles[1].path).meta.source.pdf_sha256);
const report = {
  schema: "STEMROBIN-182/FIRST-source-author-batch@1",
  ticket: "STEMROBIN-182",
  book: "7a",
  W,
  generatedAt: new Date().toISOString(),
  authorizedPhysicalPages: [221, 222, 223, 224, 225, 226, 227],
  role: "FIRST source author only",
  sourceAuthorComplete: true,
  sourceReview: false,
  fullLessonApproval: false,
  lessonAssemblyPerformed: false,
  offlineOnly: true,
  prohibitedActionsPerformed: [],
  prepareRepeated: false,
  toolsRepaired: false,
  localFinalizeFailures: [],
  totalFinalizeInvocations: 7,
  imageUsage: {
    batchCount: 1,
    batchLimit: 8,
    contextLimit: 24,
    actualImagesLoaded: 7,
    gridReadsEach: 1,
    reopens: 0,
    extraCropsViewed: 0,
    physical220ImageReads: 0,
    remainingBatchAllowanceUnused: 1,
  },
  source,
  toolBindings: [
    ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/run-stage.cjs",
    ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source221-227-author-report.cjs",
  ].map((name) => bind(path.join(W, name))),
  existingPrepareReceipts: [
    "prepare221-224-FIRST.json", "prepare225-227-FIRST.json", "prepare221-227-FIRST.json",
  ].map((name) => bind(path.join(evidence, name))),
  leftExternalBoundary: {
    physicalPage: 220,
    printedPage: 214,
    authority: "Direct user-supplied text; no image opened and no independent revalidation in this batch.",
    exactOpenTail: "较大的自变量值对应于较大的函数值. 一般地，可以证明，如果 $x_1$ 和 $x_2$ 是非负数，并且 $x_2>x_1$，那么 $\\sqrt{x_2}>\\sqrt{x_1}$，就",
    footer: "214",
    joinsTo: pages[0].exactFirstBlock,
  },
  lessonBoundaries: [
    { lesson: "n35", startsPhysical: 220, startsPrinted: 214, localRightBoundaryPhysical: 222, note: "Start supplied by user; this batch does not independently review physical220." },
    { lesson: "n36", startsPhysical: 223, startsPrinted: 217, localRightBoundaryPhysical: 226, note: "Local source text boundaries only; no assembly or approval." },
    { lesson: "n37", startsPhysical: 227, startsPrinted: 221, closed: false, note: "Only opening source page retained; later proof and lesson content not read." },
  ],
  pages,
};

const lines = [
  "# STEMROBIN-182 FIRST Source Author: 7a Physical221-227",
  "",
  `W: ${W}`,
  "",
  "Offline FIRST source-author completion only. Not source review or full lesson approval.",
  "Exactly seven page.grid.png reads, one per page, one image per call. No reopen, no extra crop, no physical220 image.",
  "No prepare repeat, Git, DB, .env, network, external model, publisher, app, deploy, E, index, lesson assembly or tool repair.",
  "",
  "## Per-Page Status",
  "",
  "| Physical | Printed | FIRST Exit | Lines MD/Printed | Figures |",
  "|---|---|---|---|---|",
  ...pages.map((page) => `| ${page.physicalPage} | ${page.printedPage} | ${page.exit} | ${page.markdownLines}/${page.printedLines} | ${page.figures.map((figure) => figure.id).join(", ") || "none"} |`),
  "",
  "Each named finalize ran exactly once. All signals/errors null. Raw stdout/stderr and pre-spawn command/cwd/start timestamps are retained.",
  "There were no local finalize failures, no counting workarounds, and no tool repairs.",
  "",
  "## Boundaries",
  "",
  `External left boundary, provided by user, physical220/printed214: ${report.leftExternalBoundary.exactOpenTail}`,
  "Footer: 214. The final 就 joins physical221's first 是 to form 就是.",
  "n35 starts physical220/printed214; local right boundary physical222.",
  "n36 starts physical223/printed217; local right boundary physical226.",
  "n37 starts physical227/printed221; not closed or approved.",
  "",
  ...pages.flatMap((page) => [
    `### Physical${page.physicalPage}`,
    page.boundaries.left,
    page.boundaries.right,
    page.boundaries.continuation,
    ...(page.exactOpenTails.length ? page.exactOpenTails.flatMap((tail) => [
      `Exact open tail (${tail.kind}${tail.label ? ` ${tail.label}` : ""}):`,
      "```text",
      tail.text,
      "```",
    ]) : ["No open right-tail block."]),
    "",
  ]),
  "## Figures And Uncertainty",
  "",
  "Only fig-54, physical221. One original whole coordinate graph; no subfigure split.",
  "Author coarse box [235,885,1100,560]; FIRST finalize crop box [243,893,1087,549]. Caption 图 54 is separate.",
  `Crop path: ${pages[0].figures[0].crop.path}`,
  `Crop SHA256: ${pages[0].figures[0].crop.sha256}`,
  "No unnumbered tables or owner-ex assignments in this seven-page batch.",
  "Confirmed mathematical errata: none on all seven pages.",
  "Local word/glyph uncertainty: physical227 我们应当规定 retained as read; awkward wording is not a confirmed mathematical erratum.",
  "No other unresolved glyph noted. Printed Cyrillic subpart labels and apparent source wording remain original.",
  "Physical224 uses one ↵ for the actual example1 formula break. No other artificial ↵.",
  "After the sole physical223 grid read, only physical222's boundary metadata note was corrected in both page.md and page.json. No content-block edit or finalize repeat.",
  "",
  "## Sources And SHA256",
  "",
  `${source.path} ${source.sha256}`,
  ...pages.flatMap((page) => [
    "",
    `Physical${page.physicalPage}:`,
    ...page.sourceFiles.map((file) => `${file.path} ${file.sha256}`),
    ...page.preparedInputs.map((file) => `${file.path} ${file.sha256}`),
  ]),
  "",
  "## FIRST Receipts And SHA256",
  "",
  ...pages.flatMap((page) => [
    "",
    `Physical${page.physicalPage}: start ${page.receipt.startedAt}; finish ${page.receipt.finishedAt}; exit ${page.exit}; signal null; error null.`,
    `cwd: ${page.receipt.cwd}`,
    `command: ${page.receipt.command.join(" ")}`,
    ...page.receipt.files.map((file) => `${file.path} ${file.sha256}`),
  ]),
  "",
  "## Existing Preparation And Tool Bindings",
  "",
  ...report.existingPrepareReceipts.map((file) => `${file.path} ${file.sha256}`),
  ...report.toolBindings.map((file) => `${file.path} ${file.sha256}`),
  "",
];

const reportJson = path.join(evidence, "source221-227-author.json");
const reportMd = path.join(evidence, "source221-227-author.md");
fs.writeFileSync(reportJson, `${JSON.stringify(report, null, 2)}\n`, { flag: "wx" });
fs.writeFileSync(reportMd, `${lines.join("\n")}\n`, { flag: "wx" });
console.log(JSON.stringify({ reports: [bind(reportMd), bind(reportJson)], imagesLoaded: 7, finalizeExits: pages.map((page) => page.exit) }, null, 2));
