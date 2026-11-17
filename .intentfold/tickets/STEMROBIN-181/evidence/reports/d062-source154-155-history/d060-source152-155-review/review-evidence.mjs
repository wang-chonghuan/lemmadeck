import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const output = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(output, "../../../../..");
const freezePath = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d059-10p-source152-155-author/author-freeze.json");
const expectedFreeze = "b46bf8db8297caa3a5e0f0bb4c3352b0a5f2b752efc09133b0864ce1b5ac635e";
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const write = (file, value) => fs.writeFileSync(
  file, `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" },
);
const freeze = read(freezePath);
assert.equal(bind(freezePath).sha256, expectedFreeze);
const page = (number) => freeze.pages.find((item) => item.physicalPage === number);
const figure = (id) => freeze.pages.flatMap((item) => item.figures).find((item) => item.id === id);
const concise = (value) => ({ path: value.path, sha256: value.sha256, bytes: value.bytes });

function verifyFrozen() {
  let occurrences = 0;
  const unique = new Map();
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if (typeof value.path === "string" && typeof value.sha256 === "string") {
      const current = bind(value.path);
      assert.equal(current.sha256, value.sha256, value.path);
      if (typeof value.bytes === "number") assert.equal(current.bytes, value.bytes, value.path);
      occurrences++;
      unique.set(current.path, current);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(freeze);
  return { checkedAt: new Date().toISOString(), freeze: bind(freezePath),
    bindingOccurrences: occurrences, uniqueFiles: unique.size,
    allHashesAndSizesMatched: true, bindings: [...unique.values()] };
}

if (process.argv[2] === "raster" || process.argv[2] === "raster-114") {
  if (process.argv[2] === "raster") {
    write(path.join(output, "input-integrity.json"), verifyFrozen());
  } else {
    assert.deepEqual(verifyFrozen().bindings, read(path.join(output, "input-integrity.json")).bindings);
  }
  const rasterizer = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/svg_raster.js");
  const ids = process.argv[2] === "raster-114" ? ["fig-114"] : ["fig-111", "fig-114"];
  for (const id of ids) {
    const source = figure(id);
    const originalPng = fs.readFileSync(source.png.path);
    const originalDimensions = [originalPng.readUInt32BE(16), originalPng.readUInt32BE(20)];
    const png = path.join(output, `${id}.svg-raster.png`);
    assert.equal(fs.existsSync(png), false, "Never overwrite an existing raster");
    const args = [rasterizer, source.svg.path, png, String(originalDimensions[0])];
    const startedAt = new Date().toISOString();
    const result = spawnSync("node", args, { cwd: repo, encoding: "utf8" });
    const stdout = path.join(output, `${id}.raster.stdout.txt`);
    const stderr = path.join(output, `${id}.raster.stderr.txt`);
    fs.writeFileSync(stdout, result.stdout ?? "", { flag: "wx" });
    fs.writeFileSync(stderr, result.stderr ?? "", { flag: "wx" });
    const receipt = { schema: "existing-svg-first-review-raster@1", figure: id,
      executable: "node", args, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
      exitCode: result.status, error: result.error?.message ?? null,
      existingSvg: concise(source.svg), originalCrop: concise(source.png),
      originalCropDimensions: originalDimensions, metadataBox: source.exactNativeBox,
      unmodifiedRasterizer: bind(rasterizer), stdout: bind(stdout), stderr: bind(stderr),
      nativePrepareFinalizeVectorizeRuns: 0,
      output: fs.existsSync(png) ? bind(png) : null };
    write(path.join(output, `${id}.raster-receipt.json`), receipt);
    assert.equal(result.status, 0, `Raster failed; preserve its output/receipt: ${id}`);
    const rendered = JSON.parse(result.stdout.trim());
    assert.equal(rendered.ok, true);
    assert.equal(rendered.w, originalDimensions[0]);
    assert.equal(rendered.h, originalDimensions[1]);
    console.log(JSON.stringify({ figure: id, dimensions: [rendered.w, rendered.h], output: receipt.output }));
  }
} else if (process.argv[2] === "report") {
  const observationsPath = path.join(output, "observations.json");
  const observations = read(observationsPath);
  assert.deepEqual(observations.pages.map((item) => item.physicalPage), [152, 153, 154, 155]);
  assert.equal(observations.imageOrder.length, 8);
  const finalIntegrity = verifyFrozen();
  const initialIntegrity = read(path.join(output, "input-integrity.json"));
  assert.deepEqual(finalIntegrity.bindings, initialIntegrity.bindings);
  write(path.join(output, "final-integrity.json"), finalIntegrity);
  const rasters = Object.fromEntries(["fig-111", "fig-114"].map((id) => {
    const file = path.join(output, `${id}.raster-receipt.json`);
    const receipt = read(file);
    assert.equal(receipt.exitCode, 0);
    assert.deepEqual(bind(receipt.output.path), receipt.output);
    return [id, { receipt: bind(file), result: receipt }];
  }));
  const imageOpens = observations.imageOrder.map(([type, id], index) => {
    const file = type === "page" ? page(id).files.sourcePixels.path
      : type === "crop" ? figure(id).png.path : rasters[id].result.output.path;
    return { sequenceInBatch: index + 1, type, id, detail: "original", ...bind(file) };
  });
  const report = {
    schema: "STEMROBIN-181/source-independent-review@1", ticket: "STEMROBIN-181",
    book: "10p", cwd: repo, reviewRole: "Existing independent reviewer, not the source author.",
    observationsCompletedAt: observations.observationsCompletedAt,
    authorFreeze: bind(freezePath), summary: observations.summary,
    imageBudget: { previousCumulative: 9, fullPages: 4, originalCrops: 2, svgRasters: 2,
      reopens: 0, batchTotal: 8, cumulativeTotal: 17, maxBatch: 8, maxContext: 24,
      noReset: true, opens: imageOpens },
    pages: observations.pages.map((result) => {
      const frozenPage = page(result.physicalPage);
      return { ...result, printedPage: frozenPage.printedPage,
        pagePixels: concise(frozenPage.files.sourcePixels),
        pageMd: concise(frozenPage.files.pageMd), pageJson: concise(frozenPage.files.pageJson),
        audit: concise(frozenPage.files.audit),
        nativeCount: { printed: frozenPage.linesPrinted, transcribed: frozenPage.linesTranscribed },
        sourceFigures: frozenPage.figures.map((item) => ({ id: item.id,
          exactNativeBox: item.exactNativeBox, png: concise(item.png), svg: concise(item.svg) })),
        originalNativeReceipts: frozenPage.nativeReceipts.map((item) => ({
          stage: item.stage, exitCode: item.exitCode, file: concise(item),
          original: concise(item.original), startedReceipt: concise(item.startedReceipt),
        })),
      };
    }),
    figures: observations.figures.map((result) => ({ ...result,
      originalCrop: concise(figure(result.id).png), originalSvg: concise(figure(result.id).svg),
      firstComparisonRaster: rasters[result.id] ?? null,
    })),
    exactEncodingHolds: observations.exactEncodingHolds,
    objects: observations.objects,
    inheritedHolds: observations.inheritedHolds,
    independentObservations: bind(observationsPath),
    preservation: { initialIntegrity: bind(path.join(output, "input-integrity.json")),
      finalIntegrity: bind(path.join(output, "final-integrity.json")),
      frozenBindingOccurrences: finalIntegrity.bindingOccurrences,
      uniqueFrozenFiles: finalIntegrity.uniqueFiles, allOriginalBytesUnchanged: true,
      noReceiptsOrInitialOutputsDeletedOrOverwritten: true },
    scope: { physicalPagesReviewed: [152, 153, 154, 155], oldImagesReopened: false,
      nativePrepareFinalizeVectorizeReruns: 0, existingSvgFirstComparisonRasters: 2,
      authorEdits: 0, canonicalWrites: 0, databasePublicationGitBrowserNewAgentOperations: 0,
      missing156OrFigure117ReviewedOrInferred: false },
    completion: { reportComplete: true, sourceApprovalIsNotWholeRawPageApproval: true,
      output: path.join(output, "report.json") },
  };
  write(path.join(output, "report.json"), report);
  console.log(JSON.stringify(bind(path.join(output, "report.json"))));
} else {
  throw new Error("Expected raster or report; no other operation is supported.");
}
