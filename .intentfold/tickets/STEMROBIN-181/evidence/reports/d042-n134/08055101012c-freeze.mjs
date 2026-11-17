import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  owned, out, card, edition, load, bind, hash, save, snapshot, walk,
  templateDir, bookDir, verifyInputs,
} from "./common.mjs";

if (process.argv[2] === "verify") {
  const freeze = load(out("author-freeze.json"));
  verifyInputs();
  for (const item of freeze.artifacts) {
    assert.equal(hash(item.path), item.sha256, item.path);
  }
  for (const item of freeze.originalInputs) {
    assert.equal(hash(item.path), item.sha256, item.path);
  }
  assert.deepEqual(freeze.closedCards, [card]);
  console.log(JSON.stringify({
    card, status: "PASS-frozen-hashes",
    artifacts: freeze.artifacts.length, unchangedInputs: freeze.originalInputs.length,
    freeze: bind(out("author-freeze.json")),
    sourceClosure: freeze.sourceClosure, result: freeze.result,
  }, null, 2));
  process.exit(0);
}
assert.equal(process.argv[2], "create");
assert.ok(!existsSync(out("author-freeze.json")));
const inputs = verifyInputs();
const author = load(out("author-result.json"));
const textCheck = load(out("text-check.json"));
assert.equal(textCheck.status, "pass");
assert.deepEqual(textCheck.errors, []);
const rawDirectory = `${bookDir("zh")}/lessons/${card}`;
const raw = load(`${rawDirectory}/lesson.json`);
const exercises = load(`${rawDirectory}/exercises.json`);
assert.equal(raw.exercise_count, 0);
assert.deepEqual(exercises.exercises, []);
assert.deepEqual(raw.figures.map((figure) => figure.id), ["fig-301", "fig-302", "fig-303"]);
const page = (number) => load(`${bookDir("zh")}/pages/${String(number).padStart(4, "0")}/page.json`);
const block = (number, index) => page(number).blocks[index - 1];
assert.equal(block(327, 8).lines.join(""), "134. 铁磁质的基本性质");
assert.equal(block(327, 9).open, true);
assert.equal(block(328, 1).cont, true);
assert.equal(block(330, 5).open, false);
assert.equal(block(331, 1).kind, "h3");
assert.equal(block(331, 1).lines.join(""), "结束语");
const targetRefs = raw.prose.flatMap((item) => item.source_refs);
assert.ok(targetRefs.every((ref) => !ref.startsWith("p0331#")));
assert.ok(targetRefs.filter((ref) => ref.startsWith("p0327#")).every((ref) => ref === "p0327#9"));

const sourceFigures = raw.figures.map((figure) => {
  const document = page(figure.page);
  const index = document.blocks.findIndex((item) => item.kind === "fig" && item.id === figure.id);
  assert.ok(index >= 0);
  const caption = document.blocks[index + 1];
  assert.equal(caption.kind, "cap");
  assert.equal(caption.label, figure.label);
  return {
    id: figure.id, physicalPage: figure.page,
    sourceRef: `p${String(figure.page).padStart(4, "0")}#${index + 1}`,
    captionRef: `p${String(figure.page).padStart(4, "0")}#${index + 2}`,
    sourcePng: bind(`${bookDir("zh")}/figures/${figure.id}.png`),
    sourceSvg: bind(`${bookDir("zh")}/figures/${figure.id}.svg`),
    actualRawApproval: "Existing hash-bound consumed PASS; no new image opening or adjudication.",
    modernStatus: "pending-independent-figure-author-and-review",
  };
});
const nativeEvidence = [327, 328, 329, 330, 331].map((number) => {
  const auditPath = `${bookDir("zh")}/pages/${String(number).padStart(4, "0")}/audit.json`;
  const audit = load(auditPath);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.deepEqual(audit.errors, []);
  return {
    physicalPage: number, printedPage: number - 9, status: "existing-PASS-reused",
    linesPrinted: audit.lines_printed, linesMd: audit.lines_md, audit: bind(auditPath),
    scope: number === 331 ? "right-boundary-only; conclusion excluded" : "target source page",
  };
});
save("source-closure.json", {
  schema: "ld-s10y-lesson/bounded-source-closure@1",
  ticket: "STEMROBIN-181", card, date: "2026-11-17",
  status: "PASS-structural-closure-using-consumed-SOURCE-native-RAW",
  sourceAdjudicationPerformed: false, independentWholeCardApproval: false,
  inspectedTextPages: [327, 328, 329, 330, 331],
  targetPhysicalPages: [327, 328, 329, 330], targetPrintedPages: [318, 319, 320, 321],
  start: { headingRef: "p0327#8", heading: "134. 铁磁质的基本性质", firstProseRef: "p0327#9" },
  end: {
    finalProseRef: "p0330#5", lastObjectRef: "p0330#7", outgoingOpen: false,
    closesBefore: "p0331#1", excludedCard: "phy9-conclusion", excludedHeading: "结束语",
  },
  continuations: [
    { refs: ["p0327#9", "p0328#1"], transparent: ["p0327#10"], join: "很大的实际意义." },
    { refs: ["p0328#10", "p0329#1", "p0329#4"],
      transparent: ["p0328#11", "p0329#2", "p0329#3"], join: "增大（图 301）; 事实上也是这样." },
    { refs: ["p0329#7", "p0329#10", "p0330#1"],
      transparent: ["p0329#8", "p0329#9", "p0329#11"], join: "不等于零; 磁化强度才等于零." },
  ],
  targetSourceRefs: targetRefs, objects: raw.prose.length,
  proseObjects: raw.prose.filter((item) => item.kind === "p").length,
  figureObjects: sourceFigures.length, captionObjects: 3,
  sourceExerciseObjects: exercises.count, sourceFigures, nativeEvidence,
  sourceConsumption: inputs.inputs.filter((item) => item.snapshot.path.includes("/consumption/")),
  sourceAndRawReports: inputs.inputs.filter((item) => item.snapshot.path.includes("/retained/")),
  assembly: bind(out("assemble.json")),
  excluded: {
    precedingCard: "phy9-c2-s7-n133", precedingFigure: "fig-300",
    precedingPage327Refs: ["p0327#1", "p0327#2", "p0327#3", "p0327#4",
      "p0327#5", "p0327#6", "p0327#7"],
    conclusionRefs: ["p0331#1", "p0331#2", "p0331#3", "p0331#4"],
    fullBoundaryPagesPreservedInIsolatedSourceRoot: true,
    otherAssemblyCardsAdaptedFrozenPromoted: false,
    incomingFragmentWarning: "p0327#1 cont without prior open belongs to n132; it does not intersect the n134 target.",
    conclusionReadinessReusedOnlyAsBoundaryEvidence: bind(out("inputs/d038-conclusion-readiness.json")),
  },
});
const raw3 = ["lesson.json", "lesson.md", "exercises.json"].map((name) =>
  snapshot(`${rawDirectory}/${name}`, `frozen/raw/${name}`).snapshot);
const frozen = author.authored.map((item) => {
  const language = item.language;
  const directory = templateDir(language);
  const lesson = load(`${directory}/lesson.template.json`);
  const flow = JSON.parse(load(item.proseFlow.path).stdout);
  assert.equal(lesson.language, language);
  assert.equal(lesson.source.sha256, hash(`${rawDirectory}/lesson.json`));
  assert.deepEqual(lesson.source.data, raw);
  for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
    assert.equal(hash(`${bookDir(language)}/lessons/${card}/${name}`), hash(`${rawDirectory}/${name}`));
  }
  assert.ok(!existsSync(`${bookDir(language)}/editions/${edition}/lessons/${card}/lesson.json`));
  assert.ok(!existsSync(`${bookDir(language)}/editions/${edition}/book.json`));
  const templates = ["lesson.template.json", "exercises.template.json", "figures.template.json"]
    .map((name) => snapshot(`${directory}/${name}`, `frozen/${language}/${name}`).snapshot);
  snapshot(out(`lesson-${language}.md`), `frozen/${language}/prose.md`);
  const prose = save(`frozen/${language}/prose.json`, {
    card, language, status: "author-frozen-independent-reviews-pending",
    sourceLesson: raw3[0], prose: lesson.prose.filter((block) => block.kind === "p"),
    paragraphs: flow.paragraphs, section_breaks: lesson.section_breaks,
    figures: raw.figures, exercises: 0,
  });
  const outline = save(`frozen/${language}/prose-flow.json`, flow);
  return {
    language, templates, prose, markdown: bind(out(`frozen/${language}/prose.md`)),
    outline, commandReceipt: item.proseFlow,
    paragraphCount: flow.paragraphs.length, sectionBreakCount: lesson.section_breaks.length,
    sourceObjects: 23, proseObjects: 17, figures: 3, tasks: 0,
  };
});
const status = "AUTHOR-TEXT-FROZEN-TEXT-CONTRACT-PASS-SCI-ZHEN-MODERN-FIGURES-PENDING";
save("result.json", {
  schema: "ld-s10y-lesson/bounded-text-author-result@1",
  ticket: "STEMROBIN-181", card, status, closedCards: [card],
  ownership: {
    onlyOwnedPath: owned, canonicalWrites: 0, canonicalIndexWrites: 0,
    meterWrites: 0, databaseOperations: 0, gitOperations: 0, appOperations: 0,
    testsRun: 0, buildRun: false, intentfoldSetupUpdateGrillRun: false,
    externalMessages: 0, imagesOpened: 0, imagesDecoded: 0,
    sourceAdjudicationPerformed: false, sourceFiguresAuthored: 0, modernFiguresAuthored: 0,
    adaptFinalizeRun: false, renderRun: false, othersPreserved: true,
    isolatedBookIndex: "Generated only by the requested standard assemble; no index command or canonical index write.",
  },
  raw3, frozen, sourceClosure: bind(out("source-closure.json")),
  inputFreeze: bind(out("input-freeze.json")),
  nativeCommands: ["assemble.json", "adapt-prepare-zh.json", "adapt-prepare-en.json"]
    .map((name) => bind(out(name))),
  textCheck: bind(out("text-check.json")),
  textCheckCommand: bind(out("text-check-command-repair1.json")),
  textContractStatus: "PASS-text-only",
  sourceFormulaChanges: 0, sourceNumberChanges: 0, sourceErrata: 0,
  tasks: 0, choices: 0, answersAuthored: 0,
  retainedHistoricalPeople: ["Curie / 居里", "A. G. Stoletov / 斯托列托夫"],
  sourcePanelLocalization: { from: ["303а", "303б"], to: ["303a", "303b"], figures: "unchanged fig-303 identity" },
  authorPhysicalClarifications: [
    { refs: ["p0327#9", "p0328#1", "p0328#2", "p0328#3"],
      scope: "Same coil current and winding geometry; material-dependent enhancement below Curie temperature; no universally fixed permeability." },
    { refs: ["p0328#4"],
      scope: "Loss of ferromagnetic spontaneous magnetization is not loss of every magnetic response. Source temperatures remain historical textbook values, not newly adjudicated precision data." },
    { refs: ["p0328#5", "p0328#6", "p0328#7", "p0328#8", "p0328#9"],
      scope: "Long-rod/long-solenoid, aligned uniform central field, negligible end demagnetization; distinguish flux-density-contribution I from current and SI magnetization; permeability ratio only at a specified nonzero applied-field state." },
    { refs: ["p0328#10", "p0329#1", "p0329#4", "p0329#6"],
      scope: "Demagnetized initial state, fixed temperature below Curie, slow field change; saturation of material contribution, not total field. Loop-current picture is qualitative; domain explanation only supports this lesson's saturation/hysteresis." },
    { refs: ["p0329#7", "p0329#10", "p0330#1"],
      scope: "Fixed geometry/temperature, negligible background, history-dependent loop; remanence is not continuing coil current. Reverse-field magnitude and source coercivity scale distinguished from internal total B and mechanical force; symmetry conditional on unbiased equivalent cycling." },
    { refs: ["p0330#2", "p0330#3", "p0330#4", "p0330#5"],
      scope: "Historical identity and dates preserved; closed-ring geometry explained. Soft/hard is magnetic, depicted remanence comparison is not universal. Loss area needs physical axes, free-space-permeability and volume conversion; hysteresis distinguished from total device loss." },
  ],
  initialFailuresPreserved: [
    bind(out("prepare-attempt1.json")), bind(out("text-check-command.json")),
  ],
  authorRepair: author.authorRepair,
  nextGates: [
    "Independent SCI and ZHEN review of the hash-frozen target prose.",
    "Independent modern figure authoring and review for fig-301, fig-302, fig-303.",
    "Parent-owned adapt-finalize/render and later promotion only after all required inputs are complete.",
  ],
  approvalLimits: {
    sourceNativeRaw: "Existing consumed PASS reused, not newly adjudicated.",
    independentScience: false, independentBilingual: false, modernFigures: false,
    fullCardReady: false, canonicalPromotionPerformed: false,
  },
});
verifyInputs();
const artifacts = walk(owned).sort().map(bind);
save("author-freeze.json", {
  schema: "ld-s10y-lesson/bounded-prose-author-freeze@1",
  ticket: "STEMROBIN-181", card, frozenAt: new Date().toISOString(),
  status, closedCards: [card], raw3, frozen,
  sourceClosure: bind(out("source-closure.json")), result: bind(out("result.json")),
  originalInputs: inputs.inputs.map((item) => item.original), artifacts,
  excludesItselfFromArtifactHashes: true,
});
console.log(`Frozen ${card}: raw3, 6 bilingual templates, 2 prose packages, closure and ${artifacts.length} artifact hashes.`);
