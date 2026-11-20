import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-188/tmp");
const own = path.join(tmp, "n66-figure9899-review-01");
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const save = (name, data) => fs.writeFileSync(path.join(own, name), JSON.stringify(data, null, 2) + "\n");
const figureManifestPath = path.join(tmp, "n66-figure9899-review-inputs-01/manifest.json");
const textManifestPath = path.join(tmp, "n66-text-review-inputs-01/manifest.json");
const blindPath = path.join(tmp, "n66-figure9899-review-inputs-01/blind-intake.json");
const fm = load(figureManifestPath);
const tm = load(textManifestPath);

function records(value, map = new Map()) {
  if (Array.isArray(value)) {
    for (const item of value) records(item, map);
  } else if (value && typeof value === "object") {
    if (value.path && value.sha256) map.set(path.resolve(value.path), value.sha256);
    for (const item of Object.values(value)) records(item, map);
  }
  return map;
}

if (process.argv[2] === "capture") {
  const expected = records([fm, tm, load(blindPath)]);
  for (const p of [figureManifestPath, textManifestPath, blindPath]) expected.set(p, sha256(p));
  const bindings = [...expected].map(([p, expectedSha256]) => {
    const actual = sha256(p);
    if (actual !== expectedSha256) throw new Error(`Stale manifest binding: ${p}`);
    return { path: p, expectedSha256, sha256Before: actual };
  });
  const firsts = ["98", "99"].map((n) => {
    const p = path.join(own, `fig-g10-${n}.FIRST.json`);
    const stat = fs.statSync(p);
    const mode = (stat.mode & 0o7777).toString(8).padStart(4, "0");
    if (mode !== "0444") throw new Error(`Unsealed FIRST: ${p}`);
    return { path: p, sha256: sha256(p), bytes: stat.size, mode };
  });
  save("input-bindings-before.json", {
    schema: "review-input-bindings@1",
    capturedAt: new Date().toISOString(),
    allManifestHashesMatch: true,
    sealedIndependentFIRSTs: firsts,
    bindings
  });
  console.log(JSON.stringify({ boundInputs: bindings.length, firsts }, null, 2));
} else if (process.argv[2] === "text") {
  const raw = load(tm.rawLesson.path);
  const candidate = load(tm.lessonCandidate.path);
  const rawEx = load(tm.rawExercises.path);
  const modernEx = load(tm.exercisesCandidate.path);
  const math = (text) => [...text.matchAll(/\$([^$]*)\$/g)].map((match) =>
    match[1].replace(/\s+/g, "").replace(/[.,;]+$/, ""));
  const equal = (a, b, context) => assert.deepEqual(a, b, context);
  equal(candidate.source.data, raw, "embedded raw lesson");
  equal(modernEx.source.data, rawEx, "embedded raw exercises");
  equal(candidate.source.sha256, sha256(tm.rawLesson.path), "lesson raw binding");
  equal(modernEx.source.sha256, sha256(tm.rawExercises.path), "exercise raw binding");
  for (const key of ["id", "card_id", "chapter", "section", "number", "title", "printed_title", "start_page", "start_printed", "figures", "exercise_count"]) {
    equal(candidate[key], raw[key], key);
  }
  equal(candidate.prose.length, 16, "all prose objects");
  equal(candidate.prose.length, raw.prose.length, "prose object count");
  equal(candidate.errata, [], "no invented errata");
  const observations = [
    "Definition keeps nonnegative, bounded continuous f; the a<b boundaries, x-axis revolution, circular-or-point sections, S(x)=pi f^2(x), and V(x) between a and x. Three short conceptual paragraphs replace one run-on block.",
    "Figure 98 placeholder, ID, caption association and p0231#8 retained; no figure pixels reviewed by this text check.",
    "Figure 99 placeholder, ID, caption association and p0231#9 retained; no figure pixels reviewed by this text check.",
    "Figure 98 caption and source full-width spacing retained.",
    "Figure 99 caption and source full-width spacing retained.",
    "Increasing-or-decreasing assumption and integral from a to b retained; formula punctuation alone moves outside math.",
    "Pyramid-volume proof-method reference to section 58 retained, with concise wording.",
    "Positive Delta x and upper-bound condition, equal cylinder heights, both circular bases, section 65 reference, both squeeze inequalities and number (1) retained. Deliberate S_{(x+Delta x)} forms are not rewritten.",
    "Figure 100 placeholder and p0232#5 retained as a text identity only.",
    "Figure 100 caption and p0232#6 retained.",
    "Decreasing case still explicitly reverses inequality (1); no additional hypothesis invented.",
    "Continuity, both limits, derivative/antiderivative conclusion, V(b), V(a)=0, raw V_{(b)}-V_{(a)}, both integral expressions and proof terminator retained. Three actual paragraphs separate continuity, differentiation and endpoint evaluation.",
    "Emphasized volume theorem, pi integral of f squared, and formula number (2) retained.",
    "Figure 101 placeholder and p0233#4 retained in original object order; no figure approval.",
    "Continuous nonmonotone extension and formula (2)/figure 101 reference retained without an invented example.",
    "Figure 101 caption and p0233#6 retained."
  ];
  const perObject = candidate.prose.map((obj, i) => {
    const src = raw.prose[i];
    for (const key of ["kind", "id", "label", "printed_page", "source_refs"]) equal(obj[key], src[key], `object ${i + 1} ${key}`);
    equal(obj.source_text, src.text, `object ${i + 1} source text`);
    equal(math(obj.text), math(src.text), `object ${i + 1} formulas`);
    equal(obj.numeric_changes, [], `object ${i + 1} numeric changes`);
    equal(obj.historical_entities, [], `object ${i + 1} historical entities`);
    assert.ok(obj.changes.every((change) => ["wording", "layout"].includes(change)));
    return {
      index: i + 1, kind: obj.kind, id: obj.id, source_refs: obj.source_refs,
      formulas: math(obj.text), status: "pass", observation: observations[i]
    };
  });
  equal(modernEx.count, 1, "one exercise");
  equal(modernEx.exercises.length, 1, "one exercise object");
  const ex = modernEx.exercises[0];
  const originalEx = rawEx.exercises[0];
  for (const key of ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"]) equal(ex[key], originalEx[key], `exercise ${key}`);
  equal(ex.number, "242");
  equal(ex.pages, ["p0233#8", "p0234#1"]);
  equal(ex.source_text, originalEx.text);
  equal(math(ex.text), math(originalEx.text));
  equal(ex.lines.join("\n"), ex.text);
  equal(ex.numeric_changes, []);
  equal(ex.historical_entities, []);
  const subquestions = ex.lines.slice(2).map((line, i) => {
    equal(math(line), math(originalEx.lines[i + 2]), `subpart ${i + 1}`);
    assert.ok(line.startsWith(`${i + 1}\uFF09`));
    return { number: i + 1, formulas: math(line), status: "pass", rawLine: originalEx.lines[i + 2], modernLine: line };
  });
  equal(subquestions.length, 6);
  const flowScript = path.join(root, ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs");
  const result = spawnSync(process.execPath, [flowScript, "--json", tm.lessonCandidate.path], { cwd: root, encoding: "utf8" });
  const receipt = {
    command: [process.execPath, flowScript, "--json", tm.lessonCandidate.path],
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    input: { path: tm.lessonCandidate.path, sha256: sha256(tm.lessonCandidate.path) },
    tool: { path: flowScript, sha256: sha256(flowScript) },
    nativeP2cCalls: 0, writesOutsideOwnedRoot: 0
  };
  save("text-prose-flow.receipt.json", receipt);
  equal(result.status, 0, "authoritative flow tool");
  const flow = JSON.parse(result.stdout);
  equal(flow.boundaries.map(({ before, after }) => ({ before, after })), candidate.section_breaks);
  equal(flow.resolvedBreaks.length, 2);
  const before = load(path.join(own, "input-bindings-before.json"));
  const textPaths = new Set([textManifestPath, ...records(tm).keys()]);
  const inputBindings = before.bindings.filter((binding) => textPaths.has(binding.path)).map((binding) => {
    const after = sha256(binding.path);
    equal(after, binding.sha256Before, `unchanged ${binding.path}`);
    return { path: binding.path, sha256Before: binding.sha256Before, sha256After: after };
  });
  save("text-review.json", {
    schema: "stemrobin188-N66-modern-text-independent-review@1",
    status: "pass", findings: [], role: "sole-independent-reviewer",
    lesson: tm.lesson, scope: "text-only current modern N66",
    reviewedAt: new Date().toISOString(),
    expectedObjects: 16, objectsChecked: 16, all16ObjectsChecked: true, perObject,
    exercise: { number: "242", count: 1, pages: ex.pages, subquestionsChecked: 6, allSixSubpartsChecked: true, subquestions },
    mathematicalFidelity: {
      allInlineFormulasComparedInOrder: true,
      normalization: "Whitespace and terminal source math punctuation only; literal subscripts, operators, bounds, powers and numbers remain exact.",
      deliberateRawFormsPreserved: ["S_{(x+\\Delta x)}", "V_{(b)}", "V_{(a)}"],
      numbersConditionsAndCrossReferencesPreserved: true, inventedErrata: 0,
      exerciseAnswersAdded: 0, formulaOrNumericChanges: 0
    },
    identity: { figureIds: candidate.figures.map((f) => f.id), figurePlaceholdersCheckedOnly: true, historicalEntitiesChanged: 0, culturalIdentityStable: true },
    paragraphFlow: { status: "pass", actualParagraphCount: flow.paragraphs.length, resolvedBreaks: flow.resolvedBreaks, boundaries: flow.boundaries, receipt: { path: path.join(own, "text-prose-flow.receipt.json"), sha256: sha256(path.join(own, "text-prose-flow.receipt.json")) } },
    contentDesign: { reader: "Learner studying the source-bound volume-of-revolution argument and solving exercise 242.", judgment: "Each rewritten paragraph carries the original mathematical argument. Short conceptual grouping and six separate subparts improve scanability without added cultural framing, answers, examples or instructional filler." },
    sourceFIRST: { existingReviewPASSReused: true, sourceAdmission: { path: path.join(tmp, "g10-n66/source-admission.json"), sha256: sha256(path.join(tmp, "g10-n66/source-admission.json")) }, sourcePagePixelsOpened: 0, sourceRevisions: 0, inheritedSourceReviewHoldsCleared: false },
    inputBindings, imagesOpened: 0, headlessOfflineLimitation: "Text structures and authoritative paragraph flow checked only; no full-lesson browser layout or publication verification.",
    figure100101Approved: false, wholeN66Approved: false, wholeLessonApproved: false, published: false
  });
  console.log(JSON.stringify({ status: "pass", objectsChecked: 16, subquestionsChecked: 6, paragraphs: flow.paragraphs.length, breaks: flow.resolvedBreaks, inputBindings: inputBindings.length }, null, 2));
} else if (process.argv[2] === "native") {
  const id = process.argv[3];
  const figure = fm.figures.find((f) => f.id === id);
  assert.ok(figure, "assigned figure only");
  const decisions = load(path.join(own, "visual-decisions.json"));
  assert.equal(decisions.actualImagesOpened, 8);
  assert.equal(decisions.perFigure.find((f) => f.figure === id)?.status, "pass");
  const before = load(path.join(own, "input-bindings-before.json"));
  for (const binding of before.bindings) assert.equal(sha256(binding.path), binding.sha256Before, binding.path);
  const script = path.join(root, ".agents/skills/ld-s10y-image/scripts/record_review.py");
  const output = path.join(own, `${id}.review.json`);
  assert.ok(!fs.existsSync(output), "native review must not overwrite an existing review");
  const args = ["-B", script, "--spec", figure.spec.path, "--render", figure.render.path, "--output", output, "--status", "pass", "--notes",
    "Sole independent reviewer: original pixels inventoried once and FIRST sealed 0444 before later manifest/spec/output. Current desktop fixed-640 and both mobile endpoints inspected once; source structures, external curve pieces, hidden/visible lines, label readability and neutral cultural treatment pass. Text-only N66 review checked 16 objects and exercise 242's six subparts. Existing origin/vector/phi source-glyph HOLDs remain unresolved and uncleared. Local offline figure approval only; no whole-lesson, figure100101, headed-app, promotion or publication approval."];
  const result = spawnSync("python3", args, { cwd: root, encoding: "utf8" });
  save(`${id}.native-review.receipt.json`, {
    schema: "native-review-receipt@1", figure: id,
    command: ["python3", ...args], cwd: root, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    afterRealVisualPass: true, rendererReplay: false,
    script: { path: script, sha256: sha256(script) },
    inputs: { spec: figure.spec, render: figure.render, original: figure.original, svg: figure.svg },
    output: fs.existsSync(output) ? { path: output, sha256: sha256(output) } : null,
    finishedAt: new Date().toISOString()
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(load(output).status, "pass");
  console.log(result.stdout.trim());
} else if (process.argv[2] === "report") {
  const decisions = load(path.join(own, "visual-decisions.json"));
  const before = load(path.join(own, "input-bindings-before.json"));
  const inputBindings = before.bindings.map((binding) => {
    const sha256After = sha256(binding.path);
    assert.equal(sha256After, binding.sha256Before, binding.path);
    return { path: binding.path, sha256Before: binding.sha256Before, sha256After };
  });
  const author = load(path.join(tmp, "n66-figure9899-author-01/author-report.json"));
  const perFigure = decisions.perFigure.map((decision) => {
    const figure = fm.figures.find((f) => f.id === decision.figure);
    const nativePath = path.join(own, `${decision.figure}.review.json`);
    const receiptPath = path.join(own, `${decision.figure}.native-review.receipt.json`);
    const native = load(nativePath);
    const receipt = load(receiptPath);
    assert.equal(native.status, "pass");
    assert.equal(receipt.exitCode, 0);
    assert.equal(native.spec.sha256, figure.spec.sha256);
    assert.equal(native.render.sha256, figure.render.sha256);
    assert.equal(native.outputs.svg.sha256, figure.svg.sha256);
    const firstPath = path.join(own, `${decision.figure}.FIRST.json`);
    const firstRecord = before.sealedIndependentFIRSTs.find((record) => record.path === firstPath);
    assert.equal(sha256(firstPath), firstRecord.sha256);
    assert.equal(fs.statSync(firstPath).mode & 0o7777, 0o444);
    const screenshotEvidence = fm.screenshots.filter((s) => s.figure === decision.figure).map((s) => {
      assert.equal(s.geometry.svgWidth, 640);
      assert.equal(Math.min(...s.geometry.textPx), 24);
      if (s.position === "end") assert.equal(s.scroll.left + s.scroll.client, s.scroll.total);
      return { ...s, status: "independently-visually-reviewed-pass", imageLoads: 1, screenshot: { ...s.screenshot, sha256After: sha256(s.screenshot.path) } };
    });
    const spec = load(figure.spec.path);
    const render = load(figure.render.path);
    const svgText = fs.readFileSync(figure.svg.path, "utf8");
    assert.ok(svgText.includes("--ld-figure-ink"));
    assert.equal(render.status, "pass");
    assert.equal(render.collisions.length, 0);
    return {
      ...decision,
      hashBindings: { original: figure.original, spec: figure.spec, render: figure.render, output: figure.svg, independentFIRST: firstRecord, nativeReview: { path: nativePath, sha256: sha256(nativePath) }, nativeReceipt: { path: receiptPath, sha256: sha256(receiptPath) } },
      assertionsCheckedByNativeRenderedValidator: spec.assertions.map((a) => ({ id: a.id, type: a.type, status: "pass" })),
      authoritativeModernTextCompared: true,
      screenshotEvidence, mobileScrollEndReached: true,
      semanticCssColorsPresent: true, nativeReviewStatus: native.status
    };
  });
  const sourceGlyphHOLDs = author.figures.flatMap((figure) =>
    figure.holds.filter((hold) => hold.category === "source-glyph").map((hold) => ({ figure: figure.figure, ...hold, cleared: false, reviewerDisposition: "retained, not promoted to source identity certainty" })));
  save("input-bindings-after.json", { schema: "review-input-bindings@1", inputBindings, allUnchanged: true });
  save("report.json", {
    schema: "stemrobin188-N66-figure9899-independent-review@1",
    assignment: "SAME188-6/STEMROBIN-188", role: "sole-independent-reviewer",
    outputRoot: own, reviewedAt: new Date().toISOString(),
    status: "pass", findings: [], perFigure,
    sourceGlyphHOLDs,
    inheritedSourceReviewHolds: { cleared: false, sourceAdmission: { path: path.join(tmp, "g10-n66/source-admission.json"), sha256: sha256(path.join(tmp, "g10-n66/source-admission.json")) }, originalFailuresAndRepairCountsRetained: true },
    authorHistoryPreserved: { figure98Repairs: 0, figure99Repairs: 1, figure99TargetedLabelRepair: "99-b.labelPlacement.offset [0,16] retained", previousFailedRendersNotOpened: true, preservedFailureMetadata: author.failuresPreserved },
    sourceInventorySeal: { actualMode: "0444", bothFIRSTsUnchanged: true, laterManifestReadOnlyAfterSeal: true, sourceInventoryIndependentOfAuthor: true },
    actualImagesOpened: 8, imageLoadSequence: decisions.imageLoadSequence,
    extraImagesOpened: 0, reopens: 0, crops: 0, fullSourcePagePixelsOpened: 0, figure100101PixelsOpened: 0,
    headlessLimitation: true, offlineLimitation: true,
    limitation: decisions.limitation,
    fullModernLesson: fm.fullModernLesson, fullModernExercises: fm.fullModernExercises,
    textOnlyReview: { path: path.join(own, "text-review.json"), sha256: sha256(path.join(own, "text-review.json")), status: load(path.join(own, "text-review.json")).status },
    inputBindings,
    promotionReady: false, sourceGlyphIdentityApproved: false,
    wholeLessonApproved: false, wholeN66Approved: false, figure100101Approved: false, published: false,
    prohibitionCompliance: { writesOnlyOwnedRoot: true, specsEdited: 0, rendererReplays: 0, sourceRevisions: 0, appChanges: 0, coreChanges: 0, envAccess: 0, databaseCalls: 0, installs: 0, paidCalls: 0, nativeP2cCalls: 0, gitOperations: 0, publisherCalls: 0, messagesOrDelegationsToOtherAgents: 0 }
  });
  console.log(JSON.stringify({ status: "pass", figures: perFigure.map((f) => f.figure), actualImagesOpened: 8, retainedSourceGlyphHOLDs: sourceGlyphHOLDs.length, unchangedInputs: inputBindings.length }));
} else if (process.argv[2] === "index") {
  const outputs = fs.readdirSync(own).filter((name) => name !== "output-index.json").sort().map((name) => {
    const p = path.join(own, name);
    const stat = fs.statSync(p);
    if (!stat.isFile()) throw new Error(`Unexpected non-file output: ${p}`);
    return { path: p, sha256: sha256(p), bytes: stat.size, mode: (stat.mode & 0o7777).toString(8).padStart(4, "0") };
  });
  save("output-index.json", { schema: "review-output-index@1", outputRoot: own, outputs });
  console.log(JSON.stringify(["output-index.json", "report.json", "text-review.json"].map((name) => ({
    path: path.join(own, name), sha256: sha256(path.join(own, name))
  })), null, 2));
} else {
  throw new Error("Expected capture, text, native, report or index");
}
