import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
assert.equal(process.cwd(), cwd);
const own = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d209-source68-70-review");
const bindings = new Map();
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");

function consult(file, purpose, expected) {
  const absolute = path.resolve(cwd, file);
  const bytes = fs.readFileSync(absolute);
  const entry = {
    path: absolute,
    bytes: bytes.length,
    sha256: digest(bytes),
    mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, "0"),
    purposes: [],
  };
  if (expected) {
    assert.equal(entry.bytes, expected.bytes, `Changed bytes: ${absolute}`);
    assert.equal(entry.sha256, expected.sha256, `Changed hash: ${absolute}`);
  }
  const previous = bindings.get(absolute);
  if (previous) {
    assert.equal(entry.sha256, previous.sha256, `Changed during review: ${absolute}`);
    entry.purposes = previous.purposes;
  }
  if (!entry.purposes.includes(purpose)) entry.purposes.push(purpose);
  bindings.set(absolute, entry);
  return bytes;
}

function json(file, purpose, expected) {
  return JSON.parse(consult(file, purpose, expected).toString("utf8"));
}

function generated(file, value) {
  const absolute = path.join(own, file);
  fs.writeFileSync(absolute, JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  fs.chmodSync(absolute, 0o444);
  consult(absolute, "new-review-output");
  return absolute;
}

const inputPath = path.join(own, "input-freeze.json");
const inputBytes = consult(inputPath, "human-authorized-input-freeze", {
  bytes: 1065,
  sha256: "ae02b2f3def69dd9f102cf695bf11f6b263a8cf5bb507fe2c7c060a0a0a7023a",
});
const input = JSON.parse(inputBytes);
const source = json(input.sourceOnly.path, "source-only-read-before-originals", input.sourceOnly);
const after = json(input.afterInventory.path, "read-only-after-three-baselines", input.afterInventory);

for (const file of [
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  ".agents/skills/ld-s10y-image/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/production-resume.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
]) consult(file, "consulted-governing-instructions");

for (const page of source.pages) consult(page.original.path, "original-source-pixels", page.original);
consult(source.precedingText.path, "source67-hash-only-no-text-re-review", source.precedingText);
const inherited = json(source.precedingSourceTextReview.path, "reuse-D196-source67-text-boundary", source.precedingSourceTextReview);
const inherited67 = inherited.pageOutcomes.find(p => p.page === 67);
assert.equal(inherited67.textVerdict, "PASS");
assert.equal(inherited67.boundaryVerdict, "PASS");
assert.equal(inherited67.sourceApproval, true);

const author = json(after.author.path, "post-baseline-author-history-not-source-truth", after.author);
consult(after.authorFreeze.path, "author-freeze-hash-only", after.authorFreeze);
consult(after.collectedAuthor.path, "consulted-author-collection", after.collectedAuthor);
consult(after.technicalPreparation.path, "consulted-native-technical-preparation", after.technicalPreparation);
for (const native of after.natives) {
  for (const file of native.receipts) consult(file.path, "reused-native-evidence-no-execution", file);
}

for (const native of author.native.receipts.filter(n =>
  ["p0068-finalize-FIRST", "p0068-vectorize-FIRST", "p0069-finalize-FIRST"].includes(n.value.name))) {
  consult(native.binding.path, "reused-original-native-receipt", native.binding);
  consult(native.value.stdout.path, "reused-original-native-stdout", native.value.stdout);
  consult(native.value.stderr.path, "reused-original-native-stderr", native.value.stderr);
}
for (const item of author.native.failedOutputRetained.candidate) {
  consult(item.frozen.path, "retained-first-failure-snapshot-hash-only", item.frozen);
}
for (const item of author.native.failedOutputRetained.generatedFigures) {
  consult(item.frozen.path, "retained-first-failure-figure-hash-only", item.frozen);
}
const originalFailure = author.native.receipts.find(n => n.value.name === "p0069-finalize-FIRST");
assert.equal(originalFailure.value.exitCode, 1);

for (const figure of after.figures) {
  for (const kind of ["raster", "svg", "svgPreview"]) {
    consult(figure[kind].path, `current-${kind}-consulted`, figure[kind]);
  }
}

const detail = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d203-10p-source68-70-author/source-crops/0069-definition-tail.png");
consult(detail, "image-open8-existing-source-detail", {
  bytes: 179725,
  sha256: "aa5327af7db109d9b211dc33819a52ff52c2bbb17562bfed35698ebf5bdd7951",
});

const reportPath = path.join(own, "report.json");
const report = json(reportPath, "new-review-report");
const supplementPath = path.join(own, "source-observations-supplement.json");
json(supplementPath, "post-baseline-review-observations");
const baselines = new Map();
for (const page of source.pages) {
  const baselinePath = path.join(own, `source${page.page}-baseline.md`);
  const text = consult(baselinePath, "immutable-pre-candidate-source-baseline").toString("utf8");
  assert.equal(fs.statSync(baselinePath).mode & 0o222, 0, "Baseline must be read-only");
  const rows = new Map(text.split("\n").flatMap(line => {
    const match = /^(S\d+-[RF]\d+): (.*)$/.exec(line);
    return match ? [[match[1], match[2]]] : [];
  }));
  baselines.set(page.page, { path: baselinePath, rows });
}

const rowIssues = {
  "S68-R06": ["D209-H2"],
  "S68-R08": ["D209-H2"],
  "S68-R13": ["D209-H1"],
  "S68-R15": ["D209-H1"],
  "S68-R17": ["D209-H1"],
  "S68-R18": ["D209-H1"],
  "S68-R19": ["D209-H1"],
  "S69-R03": ["D209-H1"],
  "S69-R08": ["D209-H4"],
  "S69-R11": ["D209-F3"],
  "S69-R12": ["D209-F3"],
  "S69-R13": ["D209-F3"],
  "S69-R16": ["D209-F2"],
  "S70-R04": ["D209-H1"],
  "S70-R06": ["D209-F1"],
  "S70-R10": ["D209-H1"],
};
const rowEvidence = [];
for (const page of after.candidates) {
  const mdFile = page.files.find(f => f.path.endsWith("/page.md"));
  const jsonFile = page.files.find(f => f.path.endsWith("/page.json"));
  const md = consult(mdFile.path, "every-current-candidate-md-row", mdFile).toString("utf8");
  const candidate = json(jsonFile.path, "every-current-candidate-json-row-boundary", jsonFile);
  const auditFile = page.files.find(f => f.path.endsWith("/audit.json"));
  const audit = json(auditFile.path, "reused-current-audit-no-checker-replay", auditFile);
  const frontmatterEnd = md.indexOf("\n---\n", 4);
  assert.notEqual(frontmatterEnd, -1);
  assert.deepEqual(JSON.parse(md.slice(4, frontmatterEnd)), candidate.meta);
  const mdLines = md.split("\n");
  const outcome = report.pageOutcomes.find(p => p.page === page.page);
  let candidateRows = 0;
  const rows = [];
  const figureBlocks = [];
  for (let blockIndex = 0; blockIndex < candidate.blocks.length; blockIndex++) {
    const block = candidate.blocks[blockIndex];
    const reference = `p${String(page.page).padStart(4, "0")}#${blockIndex + 1}`;
    const mapped = outcome.blockOutcomes.find(b => b.ref === reference);
    assert.ok(mapped, `Unmapped block ${reference}`);
    if (block.kind === "fig") {
      figureBlocks.push({ reference, figure: block.id, box: block.box, outcome: mapped.outcome });
      continue;
    }
    assert.equal(block.lines.length, mapped.baselineRows.length, `Row mapping ${reference}`);
    for (let lineIndex = 0; lineIndex < block.lines.length; lineIndex++) {
      const text = block.lines[lineIndex];
      const mdLine = mdLines.findIndex(line => line === text) + 1;
      assert.ok(mdLine > 0, `JSON row absent in MD ${reference}`);
      const baselineRef = mapped.baselineRows[lineIndex];
      const baselineKey = baselineRef.split(" ")[0];
      const baselineText = baselines.get(page.page).rows.get(baselineKey);
      assert.ok(baselineText !== undefined, `Missing baseline ${baselineRef}`);
      const findings = rowIssues[baselineRef] ?? [];
      const verdict = findings.some(id => id.includes("-F")) ? "FAIL"
        : findings.length ? "HOLD" : "PASS";
      rows.push({
        baselineRef,
        baselinePath: baselines.get(page.page).path,
        independentSourceRow: baselineText,
        candidatePath: mdFile.path,
        structuredPath: jsonFile.path,
        reference,
        markdownLine: mdLine,
        structuredLocation: `blocks[${blockIndex}].lines[${lineIndex}]`,
        candidateText: text,
        mdJsonRowAgreement: "PASS",
        independentSourceVerdict: verdict,
        findings,
        boundaryFlags: { cont: block.cont, open: block.open, samerow: block.samerow },
      });
      candidateRows++;
    }
  }
  assert.equal(candidateRows, outcome.candidateLogicalRows);
  assert.equal(candidateRows - outcome.sameRowDeduction, outcome.independentPhysicalRows);
  assert.equal(candidate.meta.printed_lines, outcome.independentPhysicalRows);
  assert.equal(audit.lines_md, outcome.independentPhysicalRows);
  rowEvidence.push({
    page: page.page,
    metadataMdJsonAgreement: "PASS",
    rowCoverage: "EVERY_NON_FIGURE_BLOCK_LINE_INCLUDING_CAPTION_AND_FOOTER",
    figures: figureBlocks,
    rows,
  });
}
const rowPath = generated("row-comparison.json", {
  batch: "D209",
  judgmentBasis: "Manual independent source baselines and explicit reviewer findings; script verifies mapping and MD/JSON agreement only, never source correctness",
  permittedTypographyNormalization: "Sentence-full-stop styling and math delimiter/bracket formatting; not word additions or enumeration-comma replacement",
  pages: rowEvidence,
});

const images = [
  ...source.pages.map(p => ({ page: p.page, kind: "original", path: p.original.path })),
  { page: 69, kind: "existingNativePng", path: after.figures[0].raster.path },
  { page: 69, kind: "existingRawSvgPreview", path: after.figures[0].svgPreview.path },
  { page: 70, kind: "existingNativePng", path: after.figures[1].raster.path },
  { page: 70, kind: "existingRawSvgPreview", path: after.figures[1].svgPreview.path },
  { page: 69, kind: "existingSourceDetail", path: detail },
].map((event, index) => ({ ordinal: index + 1, ...event, file: bindings.get(event.path) }));
assert.equal(images.length, 8);
assert.equal(report.counters.actualImageOpens, images.length);
assert.ok(report.pageOutcomes.every(p => p.composedSourceApproval === false));
consult(path.join(own, "assemble-evidence.mjs"), "review-evidence-assembly-source");

for (const file of [reportPath, supplementPath]) {
  fs.chmodSync(file, 0o444);
  consult(file, "immutable-review-output");
}
const freeze = {
  schema: "ld-s10y-source-review/freeze@1",
  batch: "D209",
  ticket: "STEMROBIN-181",
  cwd,
  finish: "review",
  inputFreezeSha256: digest(inputBytes),
  expectedInputAndCandidateBindingsVerified: true,
  noProducerOrNativeReviewExecuted: true,
  allActuallyConsultedFilesBound: true,
  referencedNativeToolPathsNotReadOrExecuted: true,
  source67ContentOnlyHashVerifiedNotReReviewed: true,
  baselineSaveOrderBeforeCandidateExposure: report.independence.immutableBaselines,
  immutableBaselines: [...baselines.values()].map(b => bindings.get(b.path)),
  consultedFilesAndOutputs: [...bindings.values()],
  report: bindings.get(reportPath),
  rowComparison: bindings.get(rowPath),
  imageOpenLedger: images,
  counters: report.counters,
  firstFailurePreserved: bindings.get(originalFailure.binding.path),
  sourceApproval: false,
  composedSourceApprovalByPage: report.pageOutcomes.map(p => ({ page: p.page, approved: false })),
  selfHash: "Not embedded to avoid circular binding; reported separately in completion text",
};
const freezePath = generated("review-freeze.json", freeze);
console.log(JSON.stringify({
  verdict: report.verdict,
  report: bindings.get(reportPath),
  freeze: bindings.get(freezePath),
  rowComparison: bindings.get(rowPath),
  boundFiles: freeze.consultedFilesAndOutputs.length,
  actualImageOpens: images.length,
  allBaselinesReadOnly: true,
  sourceApproval: false,
}, null, 2));
