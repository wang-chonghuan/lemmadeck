import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(base, "../../../../..");
const frozen = path.join(base, "frozen");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const record = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size });
const writeNew = (file, value) => {
  assert(path.resolve(file).startsWith(`${base}/`));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
};
const snapshot = (file, relative) => {
  const target = path.join(frozen, relative);
  assert(target.startsWith(`${frozen}/`));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(file), hash(target));
  return { ...record(target), original: record(file), exactCopy: true };
};
assert(!fs.existsSync(frozen), "One exact freeze; later amendments require separate paths.");
const previousFile = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d059-10p-source152-155-author/author-freeze.json");
assert.equal(hash(previousFile), "b46bf8db8297caa3a5e0f0bb4c3352b0a5f2b752efc09133b0864ce1b5ac635e");
const previous = read(previousFile);
assert.equal(previous.imageBudget.cumulativeActualOpens, 16);
const previous155 = previous.pages.find((page) => page.physicalPage === 155);
const incomingFile = previous155.files.pageJson.path;
assert.equal(hash(incomingFile), previous155.files.pageJson.sha256);
const incoming = read(incomingFile).blocks[10];
assert.equal(incoming.kind, "p");
assert.equal(incoming.open, true);
assert.deepEqual(incoming.lines, ["图115所示的电路中，将有如图117所示的脉动电流流过，"]);
const incomingBindingFile = path.join(base, "incoming-text-binding.json");
writeNew(incomingBindingFile, {
  status: "preceding-frozen-text-only-not-source-reapproval",
  previousFreeze: record(previousFile), previousPageJson: record(incomingFile),
  sourceRef: "p0155#11", block: incoming,
  priorImageOpened: false, independentSourceReviewPending: true,
});
const observationsFile = path.join(base, "source-observations.json");
const observations = read(observationsFile);
assert.equal(observations.imageBudget.actualNewBatchOpens, 6);
assert.equal(observations.imageBudget.actualCumulative, 22);
const inputs = {
  previousFreeze: record(previousFile),
  incomingTextOnly: snapshot(incomingBindingFile, "inputs/incoming-text-binding.json"),
  sourcePdf: record(path.join(repo, "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf")),
  manifest: record(path.join(repo, "ssot-resources/soviet10year-textbooks/sources/manifest.json")),
  toc: record(path.join(repo, "ssot-resources/soviet10year-textbooks/toc/10p/zh.json")),
  faithfulProfile: record(path.join(repo, ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json")),
};
assert.equal(inputs.sourcePdf.sha256, previous.immutableBindings.pdf.sha256);
assert.equal(inputs.toc.sha256, previous.immutableBindings.toc.sha256);
const pages = [];
const ledgers = [];
const nativeFailures = [];
for (const page of [156, 157]) {
  const padded = String(page).padStart(4, "0");
  const sourceDir = path.join(base, "source/10p/pages", padded);
  const workDir = path.join(base, "work/10p/pages", padded);
  const source = read(path.join(sourceDir, "page.json"));
  const audit = read(path.join(sourceDir, "audit.json"));
  const observedRows = observations.pixelRowCountsObservedBeforeFinalize[String(page)];
  assert.equal(audit.lines_md, observedRows.total);
  assert.equal(audit.lines_printed, observedRows.total);
  assert.equal(source.meta.source.pdf_sha256, inputs.sourcePdf.sha256);
  assert.equal(source.meta.render.sha256, hash(path.join(workDir, "page.png")));
  const rows = [];
  const blocks = source.blocks.map((block, index) => {
    const sourceRef = `p${padded}#${index + 1}`;
    if (block.kind !== "fig") {
      for (const [lineIndex, text] of block.lines.entries()) {
        if (block.samerow) {
          rows[rows.length - 1].parallelFragments.push({ sourceRef, kind: block.kind, lineIndex, text });
        } else {
          rows.push({ printedRowIndex: rows.length + 1, sourceRef, kind: block.kind, lineIndex, text, parallelFragments: [] });
        }
      }
    }
    return {
      sourceRef, kind: block.kind, label: block.label, lines: block.lines,
      open: block.open, cont: block.cont, samerow: block.samerow,
    };
  });
  assert.equal(rows.length, observedRows.total);
  ledgers.push({
    physicalPage: page, printedPage: page - 10,
    sourcePixels: record(path.join(workDir, "page.png")),
    manualPixelRowCountCapturedBeforeFinalize: observedRows,
    nativeLinesPrinted: audit.lines_printed, nativeLinesMd: audit.lines_md,
    rows,
  });
  const receipts = ["prepare", "finalize", "vectorize"].map((stage) => {
    const file = path.join(base, "receipts", `${stage}-${page}-initial.json`);
    const receipt = read(file);
    if (receipt.exitCode !== 0) nativeFailures.push({ page, stage, exitCode: receipt.exitCode, receipt: record(file) });
    return {
      ...snapshot(file, `receipts/${stage}-${page}-initial.json`),
      stage, exitCode: receipt.exitCode, stdout: receipt.stdout, stderr: receipt.stderr,
      started: snapshot(file.replace(/\.json$/, ".started.json"), `receipts/${stage}-${page}-initial.started.json`),
    };
  });
  const figures = source.meta.figures.map((figure) => {
    const observation = observations.figures.find((item) => item.id === figure.id);
    assert(observation);
    const svgFile = path.join(workDir, "figures", `${figure.id}.svg`);
    return {
      id: figure.id, label: figure.label, owner: observation.owner,
      ownershipBasis: observation.ownershipBasis,
      exactNativeCropBox: figure.box,
      png: snapshot(path.join(workDir, "figures", `${figure.id}.png`), `figures/${figure.id}.png`),
      svg: fs.existsSync(svgFile) ? snapshot(svgFile, `figures/${figure.id}.svg`) : null,
      authorObservation: observation,
      nativeVectorizationIsNotIndependentSourceApproval: true,
      independentReview: "pending",
    };
  });
  pages.push({
    physicalPage: page, printedPage: page - 10,
    SOURCE: page === 157 ? "HOLD-emphasis-and-unopened-crop-author-candidate" : "faithful-author-observed-candidate",
    RAW: audit.errors.length ? "HOLD-native-errors-preserved" : "native-first-stages-only",
    independentSourceApproval: false, independentRawApproval: false,
    actualSourceRows: observedRows.total,
    nativeLinesPrinted: audit.lines_printed, nativeLinesMd: audit.lines_md,
    nativeErrors: audit.errors, normalizationChanges: audit.normalizations,
    originalExercises: source.blocks.filter((block) => block.kind === "ex").length,
    blocks,
    files: {
      pageMd: snapshot(path.join(sourceDir, "page.md"), `pages/${padded}/page.md`),
      pageJson: snapshot(path.join(sourceDir, "page.json"), `pages/${padded}/page.json`),
      audit: snapshot(path.join(sourceDir, "audit.json"), `pages/${padded}/audit.json`),
      initialTranscription: snapshot(path.join(base, "history", `finalize-${page}-initial/page.md`), `history/finalize-${page}-initial/page.md`),
      originalPagePixels: snapshot(path.join(workDir, "page.png"), `pixels/${padded}/page.png`),
      gridNotOpened: record(path.join(workDir, "page.grid.png")),
      layout: snapshot(path.join(workDir, "layout.json"), `pixels/${padded}/layout.json`),
      preparedTemplate: snapshot(path.join(workDir, "page.template.md"), `pixels/${padded}/page.template.md`),
    },
    figures, nativeReceipts: receipts,
    reruns: 0, corrections: 0,
  });
}
const lineLedgerFile = path.join(base, "printed-source-line-ledger.json");
writeNew(lineLedgerFile, {
  schema: "STEMROBIN-181/printed-source-line-ledger@1",
  status: "actual-author-source-rows-native-bound-not-independent-approval",
  method: "Manual source-view row counts were captured before finalize. Each final row retains exact source transcription and block identity; samerow captions remain fragments of the real shared row.",
  pages: ledgers,
});
const holds = [
  { object: "p0157#1", status: "HOLD-emphasis-range", reason: "Opening three-row paragraph emphasis range is not unambiguously resolved; original pixels, exact text candidate and pre-native draft retained for independent source review." },
  { object: "fig-121", status: "HOLD-unopened-crop", reason: "Full-page source observed, native crop/SVG created once, but standalone crop not opened because all six authorized new opens were used." },
  { object: "phy10-c1-s6-n60", status: "HOLD-open-boundary", reason: "Only its actual start and available157 prose were read;158 and subsequent boundary are unread and no TOC body was inferred." },
  ...nativeFailures.map((failure) => ({ object: `p${failure.page}-${failure.stage}`, status: "HOLD-native-failure", ...failure })),
];
const freezeFile = path.join(base, "author-freeze.json");
writeNew(freezeFile, {
  schema: "STEMROBIN-181/source-author-freeze@1",
  ticket: "STEMROBIN-181", book: "10p",
  author: "Carson-existing-author", role: "faithful-source-author-only",
  authoredAt: new Date().toISOString(), cwd: repo, outputRoot: base,
  status: "source-author-frozen-with-HOLD-await-independent-review",
  SOURCE: "faithful-source-candidates-no-independent-approval",
  RAW: nativeFailures.length ? "native-failures-preserved" : "native-prepare-finalize-vectorize-first-stages-only",
  independentSourceApproval: false, independentRawApproval: false,
  fullObjectApproval: false, nativeAssemblyPerformed: false,
  authorizedPhysicalPages: [156, 157],
  actualReadRange: { physical: [156, 157], printed: [146, 147] },
  immutableBindings: inputs,
  pages,
  sourceLineLedger: snapshot(lineLedgerFile, "printed-source-line-ledger.json"),
  observations: snapshot(observationsFile, "source-observations.json"),
  explicitContinuations: observations.crossPageAndInlineContinuations,
  unitBoundaries: observations.unitBoundaries,
  holds,
  priorHolds: {
    policy: "Previous152-155 freeze remains byte-identical. Its parent independent review is pending; its holds are neither repaired nor globalized here.",
    fig113Repaired: false, previousPagesTouched: false,
  },
  nativeStages: {
    preparePerPage: 1, finalizePerPage: 1, vectorizePerPage: 1,
    failures: nativeFailures.length, reruns: 0, corrections: 0,
    sourceAssembly: 0, fullObjectApproval: 0, canonicalConsumption: 0,
    modernTextOrFigures: 0, publication: 0, database: 0,
  },
  imageBudget: observations.imageBudget,
  fidelityPolicy: observations.fidelityPolicy,
  nativeTools: [
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    ".claude/skills/ld-s10y-lesson/tools/layout.py",
    ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    ".claude/skills/ld-s10y-lesson/tools/normalize.py",
    ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
    ".claude/skills/ld-s10y-lesson/tools/vectorize.py",
    ".claude/skills/ld-s10y-lesson/tools/svg_raster.js",
  ].map((relative) => record(path.join(repo, relative))),
  authorScripts: [
    snapshot(path.join(base, "run-native.mjs"), "author-scripts/run-native.mjs"),
    snapshot(path.join(base, "freeze.mjs"), "author-scripts/freeze.mjs"),
  ],
  restrictions: {
    onlyNewOwnedDirectoryWritten: base,
    previousFreezeByteIdentical: true, priorImagesReopened: false,
    source158Or159Read: false, sourceBodyInferred: false,
    source113Repair: false, n52OrN45Touched: false,
    newWorkerOrWorktreeOrBranch: false, sharedCanonicalWritten: false,
    databaseAccess: false, browserOrPublication: false, gitOperations: false,
    oldAnswersChoicesInteractionsRead: false, reviewerApprovalClaimed: false,
    resetCompressionOrBudgetReset: false, failuresOrReceiptsDeleted: false,
  },
});
assert.equal(hash(previousFile), "b46bf8db8297caa3a5e0f0bb4c3352b0a5f2b752efc09133b0864ce1b5ac635e");
const sha = hash(freezeFile);
fs.writeFileSync(path.join(base, "author-freeze.sha256"), `${sha}  author-freeze.json\n`, { flag: "wx" });
console.log(JSON.stringify({
  status: "author-frozen-with-HOLD-not-independent-approved",
  authorFreeze: record(freezeFile), sourceLineLedger: record(lineLedgerFile),
  actualReadRange: [156, 157],
  sourceRows: pages.map((page) => ({ physicalPage: page.physicalPage, rows: page.actualSourceRows })),
  nativeFailures: nativeFailures.length, holds, budget: observations.imageBudget,
}, null, 2));
