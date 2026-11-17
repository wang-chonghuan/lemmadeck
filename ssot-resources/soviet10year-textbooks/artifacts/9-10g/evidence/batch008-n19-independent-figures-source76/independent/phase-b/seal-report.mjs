import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.dirname(fileURLToPath(import.meta.url));
const own = path.dirname(out);
const report = path.join(path.dirname(own), "geo910-n18-n19-fig74-76-independent-phase-b-report.md");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const load = async (file) => JSON.parse(await readFile(file, "utf8"));
const save = async (name, value) => writeFile(path.join(out, name),
  `${JSON.stringify(value, null, 2)}\n`, { flag: "wx" });
const bind = async (file, expected) => {
  const bytes = await readFile(file);
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected, file);
  return { path: file, sha256, bytes: bytes.length };
};
const phaseA = await load(path.join(own, "freeze.json"));
const baseLedger = await load(path.join(own, "imageledger.json"));
const browser = await load(path.join(out, "browser-observations.json"));
const assertions = await load(path.join(out, "original-spec-assertions.json"));
const outputHashes = await load(path.join(out, "output-hashes.json"));
assert.equal(browser.figures.length, 2);
assert.equal(baseLedger.openedCount, 3);
assert.equal(assertions.status, "PASS");
assert.equal(browser.runtime.browserClosed, true);
for (const item of phaseA.artifacts) await bind(item.path, item.sha256);
for (const item of phaseA.inputs.filter((input) => input.snapshot)) await bind(item.snapshot, item.snapshotSha256);
for (const item of outputHashes.selectedOutputs) {
  for (const kind of ["spec", "render", "svg"]) await bind(item[kind].path, item[kind].sha256);
}
const additionalOpens = browser.figures.map((figure, index) => ({
  open: 4 + index, phase: "B", tool: "functions.view_image", detail: "original",
  ...figure.composite, figure: figure.figure, sixUnscaledActualBrowserCells: true,
  visualInspectionCompleted: true
}));
const cumulativeLedger = {
  schema: "independent-image-ledger/additive-phase-b@1",
  ticket: "STEMROBIN-184",
  baseImmutableLedger: await bind(path.join(own, "imageledger.json"),
    "178d4ac2bac434adeca868737688f8ed977caa57183748b7184fff97d34529aa"),
  limit: 8, openedCount: 5, sourceReopens: 0, remaining: 3,
  phaseAOriginalOpens: 3, phaseBCompositeOpens: 2, capturedCellFiles: 12,
  capturedCellFilesIndividuallyOpened: 0, budgetReset: false,
  entries: [...baseLedger.entries, ...additionalOpens],
  unusedOpens: "Reserved only for concrete issues; none needed",
  parentReceives: "textual paths, hashes and findings only; no image payload"
};
await save("imageledger.json", cumulativeLedger);
const frozenEvidence = {
  inventory: await bind(path.join(own, "fullsource-first.md"),
    "e1cafc590cf16579fb0cc111a95ff386d0fec0f996836009993ffa107e6998fe"),
  freeze: await bind(path.join(own, "freeze.json"),
    "d0296e01b57497a3b0d563b0001067a2df58794c5cff9a4ddd515476ec692b77"),
  snapshots: phaseA.inputs.filter((input) => input.snapshot).map((input) => ({
    path: input.snapshot, sha256: input.snapshotSha256
  }))
};
const browserEvidence = await bind(path.join(out, "browser-observations.json"),
  "e0cb796166df39953e271aa18cce65de25c723e8e6dbd59a68cd1a134c330f0f");
const mathEvidence = await bind(path.join(out, "original-spec-assertions.json"),
  "8be6310ad034a7724d49a0c8fda1741abd80117566302e2b87eb1d5ff2cb1f6b");
const finalRecords = [];
for (const output of outputHashes.selectedOutputs) {
  const id = output.figure;
  const figure = browser.figures.find((item) => item.figure === id);
  const record = {
    schema: "independent-figure-final-status@1",
    ticket: "STEMROBIN-184",
    figure: id,
    status: id === "fig-74" ? "HOLD" : "PASS",
    scope: "Authorized independent current-output figure comparison only; not official review or promotion",
    selectedAttempt: output.selectedAttempt,
    outputBindings: output,
    frozenEvidence,
    reusedAuthorCommands: outputHashes.reusedCommands.filter((item) => item.figure === id),
    officialReview: false, promoted: false, wholeLessonApproved: false,
    sourceReopens: 0, repairedByReviewer: false,
    blockers: id === "fig-74" ? [{ type: "exhausted-render-collision",
      id: "a2-vector-head-label", score: 10000, childRenderExitCode: 2 }] : [],
    browser: id === "fig-74" ? { performed: false, reason: "Manifest/render failure disposition only" } : {
      performed: true, oneComparison: true, evidence: browserEvidence,
      composite: figure.composite, compositeOpenedOnce: true,
      sampleCount: figure.samples.length, widths: [640, 328],
      themes: ["neutral", "accent", "print"],
      allCellAssertionsPass: figure.samples.every((sample) => sample.status === "PASS"),
      visualStatus: "PASS", minTextPxAt328: Math.min(...figure.samples
        .filter((sample) => sample.width === 328)
        .flatMap((sample) => sample.geometry.labels.map((label) => label.finalFontPx))),
      findings: id === "fig-75" ? [
        "Two equal opposite staggered vectors; all shafts and heads visible and attached.",
        "Complete a and minus-a glyphs with supported vector marks; no clipping, overlap or replacement boxes.",
        "No invented endpoint names, dots, formula, result or cultural content."
      ] : [
        "OA, AB and OB point correctly; one incoming head at A and two at B remain distinct.",
        "Visible O dot at common tail; clear A, capital B and capital O labels.",
        "No extra metric assumption, equation, source point omission or cultural content."
      ]
    },
    mathematics: id === "fig-74" ? { performed: false, reason: "No new figure comparison authorized" } :
      { evidence: mathEvidence, ...assertions.math.find((item) => item.figure === id) },
    limits: [
      "Selected outputs and render metadata are author scratch, not durable promotion metadata.",
      "No official record_review, source read/edit, publisher/DB, choice/answer or lesson approval.",
      "No additional repair, gate restart or browser comparison."
    ]
  };
  if (figure) {
    assert.ok(record.browser.allCellAssertionsPass);
    assert.ok(record.browser.minTextPxAt328 >= 16);
    await bind(figure.composite.path, figure.composite.sha256);
  }
  finalRecords.push(record);
  await save(`${id}.final-status.json`, record);
}
await save("perfigure-final-status.json", {
  schema: "independent-current-figure-comparison/final@1",
  ticket: "STEMROBIN-184",
  completedAtUtc: new Date().toISOString(),
  status: "COMPLETE_WITH_FIG74_HOLD",
  figures: finalRecords,
  imageLedger: await bind(path.join(out, "imageledger.json")),
  report: await bind(report),
  officialReview: false, durablePromotion: false, wholeLessonApproved: false
});
const files = [];
for (const name of await readdir(out)) {
  if (name === "cells") {
    for (const cell of await readdir(path.join(out, "cells"))) files.push(await bind(path.join(out, "cells", cell)));
  } else files.push(await bind(path.join(out, name)));
}
files.push(await bind(report));
const seal = {
  schema: "independent-phase-b/seal@1",
  ticket: "STEMROBIN-184",
  sealedAtUtc: new Date().toISOString(),
  status: "COMPLETE",
  phaseAUnmodified: true,
  frozenEvidence,
  files,
  finalStatus: {"fig-74": "HOLD", "fig-75": "PASS", "fig-76": "PASS"},
  totalImageOpens: 5, sourceReopens: 0, remainingImageOpens: 3,
  browserComparisons: 1, rerenderSpec: 0, authorValidationReruns: 0,
  officialReviewsWritten: 0, promoted: 0, browserClosed: true
};
await save("phase-b-seal.json", seal);
console.log(JSON.stringify({
  status: seal.status, finalStatus: seal.finalStatus,
  report: await bind(report),
  finalRecords: await bind(path.join(out, "perfigure-final-status.json")),
  ledger: await bind(path.join(out, "imageledger.json")),
  seal: await bind(path.join(out, "phase-b-seal.json")),
  totalImageOpens: 5, sourceReopens: 0, remainingImageOpens: 3,
  browserClosed: true, phaseAUnmodified: true
}, null, 2));
