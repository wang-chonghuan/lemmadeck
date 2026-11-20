import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp");
const own = path.join(tmp, "d1816-d364-n149-n151-display-review");
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const bind = (file) => {
  const b = fs.readFileSync(file);
  return { path: file, sha256: sha(b), bytes: b.length };
};
const verify = (expected) => {
  const actual = bind(expected.path);
  if (actual.sha256 !== expected.sha256) throw new Error(`Input drift: ${expected.path}`);
  return actual;
};
const resultPath = path.join(tmp, "d1816-d363-n149-n151-display/result.json");
const resultBinding = bind(resultPath);
if (resultBinding.sha256 !== "7068aea4d83420eb8607c95ace168c4479dcbaa6fa6a0b00a32f10b53fdf9889") {
  throw new Error("D363 result changed");
}
const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
if (result.status !== "pass" || result.records.length !== 8) throw new Error("Missing queued captures");
const nativePaths = [
  path.join(tmp, "d1816-d373-n149-en-render-recovery/result.json"),
  path.join(tmp, "d1816-d362-n151-native/result.json")
];
const native = nativePaths.map((file) => ({ binding: bind(file), data: JSON.parse(fs.readFileSync(file, "utf8")) }));
const reviews = [
  "d1816-d347-n149-affected-text-review",
  "d1816-d367-n149-layout-context-review",
  "d1816-d358-n151-first-text-review",
  "d1816-d371-n151-affected-text-review",
  "d1816-d355-fig277-first-review"
].flatMap((name) => ["report.json", "review-freeze.json"].map((file) => bind(path.join(tmp, name, file))));
const nativeBindings = native.flatMap(({ binding, data }) => {
  if (data.status !== "native-pass-display-pending") throw new Error("Native result is not ready");
  const records = [binding];
  for (const stage of data.stages) if (stage.receipt) records.push(verify(stage.receipt));
  for (const output of data.outputs) {
    for (const value of Object.values(output)) {
      if (value && typeof value === "object" && value.path && value.sha256) records.push(verify(value));
    }
  }
  for (const key of ["recoveredStage", "affectedTextReview", "independentTextReview", "originalFailure", "priorFailure", "figureReport", "affectedReview"]) {
    if (data[key]?.path && data[key]?.sha256) records.push(verify(data[key]));
  }
  return records;
});
const surfaces = result.records.map((record, index) => {
  const bindings = ["lesson", "html", "screenshot"].map((key) => ({ role: key, ...verify(record[key]) }));
  const png = fs.readFileSync(record.screenshot.path);
  const dimensions = { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
  const lesson = JSON.parse(fs.readFileSync(record.lesson.path, "utf8"));
  const dir = path.dirname(record.lesson.path);
  const editionRoot = path.resolve(dir, "../..");
  const bookRoot = path.resolve(editionRoot, "../..");
  const audit = JSON.parse(fs.readFileSync(path.join(dir, "adaptation.audit.json"), "utf8"));
  const figures = JSON.parse(fs.readFileSync(path.join(dir, "figures.json"), "utf8"));
  const exercises = JSON.parse(fs.readFileSync(path.join(dir, "exercises.json"), "utf8"));
  for (const name of ["adaptation.audit.json", "figures.json", "exercises.json"]) {
    bindings.push({ role: name, ...bind(path.join(dir, name)) });
  }
  bindings.push({ role: "rawLesson", ...verify({ path: path.join(bookRoot, lesson.source.path), sha256: lesson.source.sha256 }) });
  const emptyHtml = record.html.path.replace(/text\.html$/, "exercises.html");
  bindings.push({ role: "emptyExercisesHtmlCurrentNotScreenshot", ...bind(emptyHtml) });
  const figureBindings = figures.figures.flatMap((figure) =>
    ["spec", "svg", "render", "review"].map((key) => ({ id: figure.id, role: key, ...bind(path.join(editionRoot, figure[key])) }))
  );
  const boxes = record.geometry.boxes;
  const fonts = record.geometry.fonts;
  const nativeOutput = native.find((n) => n.data.id === record.id)?.data.outputs.find((o) => o.edition === record.edition);
  if (!nativeOutput || nativeOutput.lesson.sha256 !== record.lesson.sha256 || nativeOutput.html.sha256 !== record.html.sha256) {
    throw new Error("Capture/native mismatch");
  }
  return {
    index, id: record.id, locale: record.locale, edition: record.edition,
    viewport: record.viewport, screenshot: { ...verify(record.screenshot), ...dimensions },
    bindings, figureBindings,
    displayIdentity: { title: lesson.title, printedTitle: lesson.printed_title, chapter: lesson.chapter },
    automaticEvidence: {
      originalRecordStatus: record.status, sourceBlocks: record.sourceBlocks,
      paragraphs: record.paragraphs, expectedConceptGaps: lesson.section_breaks.length,
      resolvedConceptIndices: audit.resolvedSectionBreaks.map((item) => item.index),
      media: record.media, documentWidth: record.geometry.width,
      childBoxCount: boxes.length,
      minimumAdjacentBoxGap: Math.min(...boxes.slice(1).map((box, i) => box.y - boxes[i].bottom)),
      minX: Math.min(...boxes.map((box) => box.x)),
      maxRight: Math.max(...boxes.map((box) => box.right)),
      firstBox: boxes[0], crumbBox: boxes[1], lastBox: boxes.at(-1),
      fontSamples: fonts.length,
      fontFamilies: [...new Set(fonts.map((font) => font.family))],
      minFontRatio: Math.min(...fonts.map((font) => font.ratio)),
      maxFontRatio: Math.max(...fonts.map((font) => font.ratio)),
      textIndents: [...new Set(record.geometry.indents)],
      emptyExercisesChecked: record.emptyExercisesChecked,
      currentExerciseCount: exercises.count,
      auditStatus: audit.status, auditErrors: audit.errors,
      notIndependentPixelReading: true
    }
  };
});
const captureTool = bind(path.join(tmp, "d1816-recovery/check-d363-n149-n151-offline.mjs"));
const captureReceipt = bind(path.join(tmp, "d1816-recovery/native/d363-n149-n151-first-eight-offline-surfaces/receipt.json"));
const phase = process.argv[2];
if (phase === "inputs") {
  const file = path.join(own, "input-bindings.json");
  fs.writeFileSync(file, JSON.stringify({
    stage: "D364", frozenAt: new Date().toISOString(), result: resultBinding,
    capturesOpenedBeforeThisFreeze: 0, currentContextImagesBeforeD364: 8,
    nativeBindings, priorReviewBindings: reviews, captureTool, captureReceipt, surfaces,
    inheritedCaptureConditions: {
      offline: result.offline, headless: result.headless, requests: result.requests,
      productAcceptance: result.productAcceptance, databaseWrites: result.databaseWrites
    }
  }, null, 2) + "\n", { flag: "wx" });
  fs.chmodSync(file, 0o444);
  console.log(JSON.stringify({ binding: bind(file), screenshotCount: surfaces.length, allListedCaptureNativeHashesMatch: true }, null, 2));
} else if (phase === "review") {
  const inputFile = path.join(own, "input-bindings.json");
  const inputs = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  verify(inputs.result);
  for (const file of inputs.nativeBindings.concat(inputs.priorReviewBindings)) verify(file);
  for (const surface of inputs.surfaces) {
    for (const file of surface.bindings.concat(surface.figureBindings)) verify(file);
  }
  const reportFile = path.join(own, "report.json");
  const report = JSON.parse(fs.readFileSync(reportFile, "utf8"));
  if (report.screenshots.length !== 8) throw new Error("Expected all eight visual observations");
  report.resultBinding = resultBinding;
  report.inputBindings = bind(inputFile);
  report.nativeAndReviewBindings = { native: nativeBindings, priorReviews: reviews, captureTool, captureReceipt };
  report.screenshots = report.screenshots.map((observation, index) => {
    const surface = inputs.surfaces[index];
    if (observation.path !== surface.screenshot.path || observation.sha256 !== surface.screenshot.sha256) {
      throw new Error("Observation mapped to wrong original screenshot");
    }
    return { ...observation, id: surface.id, locale: surface.locale, viewport: surface.viewport,
      originalDimensions: { width: surface.screenshot.width, height: surface.screenshot.height },
      courseHtmlAndFigureCurrentBindings: surface.bindings.concat(surface.figureBindings),
      automaticEvidence: surface.automaticEvidence };
  });
  report.imageLedger = report.screenshots.map((shot, index) => ({
    batchOpen: index + 1, contextOpen: index + 9, path: shot.path, sha256: shot.sha256,
    kind: "originalFullPagePNG", openedOnce: true, generatedOrCropped: false
  }));
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2) + "\n");
  const freezeFile = path.join(own, "review-freeze.json");
  fs.writeFileSync(freezeFile, JSON.stringify({
    stage: "D364", frozenAt: new Date().toISOString(), status: report.status,
    report: bind(reportFile), inputBindings: bind(inputFile), D363Result: resultBinding,
    reviewTool: bind(path.join(own, "seal.mjs")), exactInputsUnchanged: true,
    screenshots: report.screenshots.map((shot) => ({ path: shot.path, sha256: shot.sha256, status: shot.status })),
    newImageOpens: 8, entireActualContextImageOpens: 16,
    D368Report: bind(path.join(tmp, "d1816-d368-source394397-first-review/report.json")),
    D368Freeze: bind(path.join(tmp, "d1816-d368-source394397-first-review/review-freeze.json")),
    notProductAC: true, databasePublication: false, candidateEdits: false,
    D364WorkStoppedAfterFreeze: true, separatelyQueuedD378NotStartedAtFreeze: true
  }, null, 2) + "\n", { flag: "wx" });
  fs.chmodSync(reportFile, 0o444);
  fs.chmodSync(freezeFile, 0o444);
  console.log(JSON.stringify({ report: bind(reportFile), reviewFreeze: bind(freezeFile), newImageOpens: 8, entireActualContextImageOpens: 16 }, null, 2));
} else {
  throw new Error("Expected inputs or review phase");
}
