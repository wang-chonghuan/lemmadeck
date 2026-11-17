import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const batch = resolve(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d030-source280-283-author");
const phase = process.argv[2];
assert(["initial", "correction-1"].includes(phase), "Only original and one targeted correction");
const out = resolve(batch, phase);
const freezePath = resolve(batch, phase === "initial" ? "author-freeze.initial.json" : "author-freeze.json");
assert(!existsSync(freezePath), "Never overwrite a freeze");
assert(!existsSync(resolve(out, "authored-inputs.json")), "Never replay an authored count phase");
mkdirSync(out, { recursive: true });
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const binding = file => {
  const absolute = resolve(repo, file);
  const bytes = readFileSync(absolute);
  return { path: relative(repo, absolute), bytes: bytes.length, sha256: sha(bytes) };
};
const snapshot = (file, name) => {
  const source = resolve(repo, file);
  const bytes = readFileSync(source);
  const destination = resolve(out, "snapshots", name);
  assert(!existsSync(destination), "No snapshot overwrites");
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, bytes, { flag: "wx", mode: 0o444 });
  return { ...binding(source), snapshot: relative(repo, destination) };
};
const front = file => {
  const match = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
  assert(match, "Native JSON frontmatter required");
  return JSON.parse(match[1]);
};
const observations = JSON.parse(readFileSync(resolve(batch, "source-observations.json"), "utf8"));
const physicalPages = phase === "initial" ? [280, 281, 282, 283] : [283];
const manifestPath = resolve(repo, "ssot-resources/soviet10year-textbooks/sources/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const catalog = manifest.catalogs.find(item => item.book === "9p");
const pdfRecord = manifest.pdfs.find(item => item.book === catalog.sourcePdf);
const pdf = resolve(repo, manifest.pdfRoot, pdfRecord.file);
assert(existsSync(pdf), "Exact native source PDF must exist");
const sourcePdf = binding(pdf);
assert.equal(sourcePdf.sha256, pdfRecord.sha256);
assert.equal(statSync(pdf).size, pdfRecord.bytes);
const sourceManifest = snapshot(manifestPath, "bindings/source-manifest.json");
const toc = snapshot("ssot-resources/soviet10year-textbooks/toc/9p/zh.json", "bindings/toc-9p-zh.json");
const profile = snapshot(".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json", "bindings/soviet-cn.json");
const countEngine = ".intentfold/tickets/STEMROBIN-181/tmp/d025-source-count.py";
const engine = snapshot(countEngine, "tools/existing-native-count.py");
const modules = ["p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py"]
  .map(name => snapshot(`.claude/skills/ld-s10y-lesson/tools/${name}`, `tools/${name}`));
const instructions = [
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
].map((file, index) => snapshot(file, `instructions/${index === 0 ? "lesson" : "image"}-SKILL.md`));
const pages = physicalPages.map(page => {
  const stem = String(page).padStart(4, "0");
  const candidateFile = resolve(phase === "initial" ? batch : out, `${stem}.page.md`);
  const native = resolve(repo, `.tmp/ld-s10y-lesson/9p/pages/${stem}`);
  const template = front(resolve(native, "page.template.md"));
  const authored = front(candidateFile);
  for (const key of ["schema", "book", "page", "source", "render", "profile"]) {
    assert.deepEqual(authored[key], template[key], `Exact template ${key} binding`);
  }
  assert.equal(authored.printed_page, page - 9);
  assert.equal(authored.source.pdf_sha256, sourcePdf.sha256);
  assert.equal(authored.profile.sha256, profile.sha256);
  assert(!Object.hasOwn(authored, "counting"));
  assert(!Object.hasOwn(authored, "figure_crops"));
  const candidate = snapshot(candidateFile, `candidates/${stem}.page.md`);
  const preparation = Object.fromEntries(["page.png", "page.grid.png", "layout.json", "page.template.md"]
    .map(name => [name, snapshot(resolve(native, name), `pages/${stem}/${name}`)]));
  assert.equal(preparation["page.png"].sha256, authored.render.sha256);
  const prepareReceiptFile = resolve(batch, `${page}.prepare-receipt.json`);
  const receipt = JSON.parse(readFileSync(prepareReceiptFile, "utf8"));
  assert.equal(receipt.status, 0);
  return {
    physicalPage: page, printedPage: page - 9,
    authorObservedUniqueTextRows: observations.authorObservedUniqueTextRows[page - 280],
    candidate, preparation,
    prepareReceipt: snapshot(prepareReceiptFile, `prepare/${page}.prepare-receipt.json`),
    sourceBinding: authored.source, renderBinding: authored.render, profileBinding: authored.profile,
  };
});
const predecessor = phase === "initial"
  ? snapshot(observations.boundaries.incoming.textOnlyPath, "incoming/0279.page.md")
  : null;
const observationBinding = snapshot(resolve(batch, "source-observations.json"), "source-observations.json");
const driver = snapshot(import.meta.filename, "tools/count-and-freeze.mjs");
const initialFreeze = phase === "correction-1" ? binding(resolve(batch, "author-freeze.initial.json")) : null;
const inputs = {
  schema: "ld-s10y-lesson/source-author-inputs@1",
  ticket: "STEMROBIN-181", role: "SOURCE AUTHOR", phase,
  frozenAt: new Date().toISOString(), sourceApproval: false,
  sourcePdf, sourceManifest, pdfRecord, catalog, toc, profile, engine, modules,
  instructions, driver, observations: observationBinding, predecessor, pages, initialFreeze,
  scope: {
    owned: relative(repo, batch),
    nativePreparationOnly: ".tmp/ld-s10y-lesson/9p/pages/0280..0283",
    durableWrites: false, gitWrites: false, databaseAccess: false, testsOrBuild: false,
    nativeFinalize: false, nativePrepareInvocationsTotal: 4,
    contextImageLoads: 8, sourceSelfApproval: false,
  },
};
const inputsPath = resolve(out, "authored-inputs.json");
writeFileSync(inputsPath, JSON.stringify(inputs, null, 2) + "\n", { flag: "wx", mode: 0o444 });
const payload = {
  pages: pages.map(page => ({
    page: page.physicalPage,
    candidate: resolve(repo, page.candidate.snapshot),
    source: resolve(repo, page.preparation["page.png"].snapshot),
  })),
};
const countInputPath = resolve(out, "count-input.json");
writeFileSync(countInputPath, JSON.stringify(payload, null, 2) + "\n", { flag: "wx", mode: 0o444 });
const started = new Date().toISOString();
const result = spawnSync(".claude/skills/ld-s10y-lesson/.venv/bin/python", [countEngine], {
  cwd: repo, encoding: "utf8", input: JSON.stringify(payload),
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
});
const receiptPath = resolve(out, "count-receipt.json");
writeFileSync(receiptPath, JSON.stringify({
  phase, started, finished: new Date().toISOString(),
  executable: ".claude/skills/ld-s10y-lesson/.venv/bin/python", args: [countEngine],
  engine, input: binding(countInputPath), status: result.status, signal: result.signal,
  stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  sourceSelfApproval: false, pipelineNormalizationApplied: false, cropWrites: 0,
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
let counts = null;
let parseFailure = null;
try {
  counts = JSON.parse(result.stdout);
} catch (error) {
  parseFailure = error.message;
}
const countsPath = resolve(out, "counts.json");
writeFileSync(countsPath, JSON.stringify(counts ?? {
  status: "native-count-process-failed", processStatus: result.status, parseFailure,
  receipt: binding(receiptPath), sourceSelfApproval: false,
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
const countFailures = counts?.pages.filter(page => !page.native_count_matches_candidate)
  .map(page => ({
    physicalPage: page.pdf_page, candidateRows: page.candidate_rows,
    nativeRows: page.native_masked_rows, delta: page.native_minus_candidate,
  })) ?? [];
const failuresPath = resolve(out, "failed-receipts.json");
writeFileSync(failuresPath, JSON.stringify({
  processFailed: result.status !== 0, parseFailure, countFailures,
  nativeReceipt: binding(receiptPath), retainedOriginalInputs: binding(inputsPath),
  sourceApproval: false, rowsInvented: false, emptyContinuationsAdded: false,
}, null, 2) + "\n", { flag: "wx", mode: 0o444 });
const record = {
  schema: "ld-s10y-lesson/source-author-freeze@1",
  ticket: "STEMROBIN-181", batch: "d030-source280-283-author", phase,
  role: "SOURCE AUTHOR", status: "frozen-awaiting-independent-SOURCE",
  frozenAt: new Date().toISOString(),
  approval: false, independentSourceReviewPerformed: false,
  inputs: binding(inputsPath), countInput: binding(countInputPath),
  countReceipt: binding(receiptPath), countResults: binding(countsPath),
  failures: binding(failuresPath), initialFreeze,
  summary: counts?.pages.map(page => ({
    physicalPage: page.pdf_page, printedPage: page.pdf_page - 9,
    authoredRows: page.candidate_rows, nativeRows: page.native_masked_rows,
    countMatches: page.native_count_matches_candidate,
    authorObservedRows: observations.authorObservedUniqueTextRows[page.pdf_page - 280],
    figures: page.figures.map(figure => figure.id),
  })) ?? [],
  targetedCorrectionsUsed: phase === "initial" ? 0 : 1,
  correction: phase === "correction-1" ? {
    changedPhysicalPages: [283],
    reason: observations.knownInitialLayoutIssue,
    note: "Only existing caption239 block moved to its true samerow partner; no literal rows changed.",
    sourceApproval: false,
  } : null,
  originalFreezePreserved: true,
  noNormalizationApplied: true,
  nativeCountIsNotSourceApproval: true,
  imagesLoaded: 8, imageBudgetExhausted: true,
  unownedWrites: 0,
};
writeFileSync(freezePath, JSON.stringify(record, null, 2) + "\n", { flag: "wx", mode: 0o444 });
console.log(JSON.stringify({
  freeze: binding(freezePath), summary: record.summary,
  countFailures, parseFailure, processStatus: result.status,
  independentSourceReviewPerformed: false,
}, null, 2));
