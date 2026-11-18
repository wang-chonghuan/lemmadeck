import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const output = path.dirname(fileURLToPath(import.meta.url));
const tmp = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp");
const prep = path.join(tmp, "d387-n70-source-preparation");
const author = path.join(tmp, "d388-n70-first-bilingual-text-author");
const card = "phy10-c2-s2-n70";
const sourcePath = path.join(prep, `root/10p/lessons/${card}/lesson.json`);
const sourceExercisesPath = path.join(prep, `root/10p/lessons/${card}/exercises.json`);
const candidate = path.join(author, "candidate");
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const hashFile = (file) => hash(fs.readFileSync(file));
const norm = (text) => String(text).replace(/\s+/g, "");
const inputBindings = [];
function read(file, role, expected, requireFrozen = false) {
  ensure(!/\.(png|svg|jpe?g|webp|gif|pdf)$/i.test(file), "Image/raw document read forbidden");
  const bytes = fs.readFileSync(file);
  const actual = hash(bytes);
  if (expected) ensure(actual === expected, `Input hash mismatch: ${file}`);
  const mode = (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0");
  if (requireFrozen) ensure(mode === "0444", `Author input not frozen: ${file}`);
  inputBindings.push({ path: file, role, sha256Before: actual, expectedSHA256: expected ?? null, mode, bytes: bytes.length });
  return JSON.parse(bytes);
}
const authorHashes = {
  report: { path: path.join(author, "report.json"), sha256: "d50f59f12919f619174582f142a07ade814c5d3ed9f5f0bfa4e1bdd9e203e0cd" },
  authorFreeze: { path: path.join(author, "author-freeze.json"), sha256: "7edac7791608082b2e2ce1a0ecb60c429c180aed7485fb6d3d79bf048785da08" },
  outputFrozenManifest: { path: path.join(author, "output-frozen-manifest.json"), sha256: "674a6d56ad6460fea5c0b9b45078137671e41e381bfd5038848f1e519828aba8" },
};
read(authorHashes.report.path, "author report hash binding, not scientific verdict evidence", authorHashes.report.sha256, true);
const authorFreeze = read(authorHashes.authorFreeze.path, "completed author freeze", authorHashes.authorFreeze.sha256, true);
const authorManifest = read(authorHashes.outputFrozenManifest.path, "author payload integrity", authorHashes.outputFrozenManifest.sha256, true);
ensure(authorFreeze.card === card && authorFreeze.frozenMode === "0444", "Wrong author card/freeze");
ensure(authorFreeze.report.sha256 === authorHashes.report.sha256, "Author report binding mismatch");
const manifest = read(path.join(prep, "manifest.json"), "closed n70 prefix assembly", "ba25d7e0457da04b120c449e192745e89d7ad4894cb3b1295a2bf09f73946374");
ensure(manifest.card === card && manifest.sourceQuestions === 0, "Source card or zero-question scope mismatch");
const source = read(sourcePath, "faithful n70 lesson", manifest.sourceLesson.sha256);
const sourceExercises = read(sourceExercisesPath, "faithful empty exercise set", manifest.sourceExercises.sha256);
function readCandidate(name, role) {
  const file = path.join(candidate, name);
  const binding = authorFreeze.candidateFiles.find((entry) => entry.path === file);
  ensure(binding, `Candidate missing from author freeze: ${name}`);
  return read(file, role, binding.sha256, true);
}
const zh = readCandidate("lesson.template.json", "Chinese authored lesson");
const en = readCandidate("english.lesson.template.json", "English authored lesson");
const zhExercises = readCandidate("exercises.template.json", "Chinese empty written exercises");
const enExercises = readCandidate("english.exercises.template.json", "English empty written exercises");
const figures = readCandidate("figures.template.json", "figure text associations only, not figures");
const pages = new Map();
for (const ref of new Set(source.prose.flatMap((entry) => entry.source_refs))) {
  const match = /^p(\d{4})#(\d+)$/.exec(ref);
  ensure(match, `Bad source reference: ${ref}`);
  ensure(match[1] !== "0185" || Number(match[2]) <= 6, "n71/source185#8 included in n70");
  if (!pages.has(match[1])) {
    const page = match[1];
    const file = path.join(prep, "root/10p/pages", page, "page.json");
    const binding = page === "0185" ? null : manifest.inputs.find((entry) => entry.suffix === `pages/${page}/page.json`)?.sha256;
    const data = read(file, "scoped source_refs JSON, selected blocks only", binding);
    pages.set(page, { file, data, sha256: hashFile(file) });
  }
}
const sourceReferences = [...new Set(source.prose.flatMap((entry) => entry.source_refs))].map((ref) => {
  const [, page, oneBased] = /^p(\d{4})#(\d+)$/.exec(ref);
  const entry = pages.get(page);
  const block = entry.data.blocks[Number(oneBased) - 1];
  ensure(block, `Missing one-based source reference: ${ref}`);
  return {
    ref, path: entry.file, pageSHA256: entry.sha256,
    oneBasedBlock: Number(oneBased), arrayIndex: Number(oneBased) - 1,
    kind: block.kind, label: block.label, figureId: block.id ?? null,
    sourceText: block.lines.join("\n"),
    textBindingStatus: "PASS",
    pixelOrFullPageReview: false,
  };
});
ensure(sourceReferences.length === 29 && source.prose.length === 26, "Unexpected source scope");
for (let i = 0; i < source.prose.length; i++) {
  const entry = source.prose[i];
  const combined = entry.source_refs.map((ref) => sourceReferences.find((item) => item.ref === ref).sourceText).join("\n");
  ensure(norm(combined) === norm(entry.text), `Source reference text mismatch at prose ${i}`);
  for (const localized of [zh, en]) {
    const target = localized.prose[i];
    ensure(target.kind === entry.kind && target.source_text === entry.text, "Changed faithful source text/kind");
    ensure(JSON.stringify(target.source_refs) === JSON.stringify(entry.source_refs), "Changed source references");
  }
}
for (const localized of [zh, en]) {
  ensure(JSON.stringify(localized.source.data) === JSON.stringify(source), "Embedded faithful source changed");
  ensure(localized.source.sha256 === manifest.sourceLesson.sha256 && localized.prose.length === 26, "Wrong localized source binding");
  ensure(localized.exercise_count === 0, "Invented lesson exercises");
}
for (const exerciseSet of [sourceExercises, zhExercises, enExercises]) {
  ensure(exerciseSet.count === 0 && Array.isArray(exerciseSet.exercises) && exerciseSet.exercises.length === 0, "Invented source-zero exercise");
}
for (const exerciseSet of [zhExercises, enExercises]) {
  ensure(JSON.stringify(exerciseSet.source.data) === JSON.stringify(sourceExercises), "Empty source exercise binding changed");
}

// Target-line selections and domain verdicts record the reviewer's independent semantic reading.
const targetLines = {
  0: [[0], [1], [2], [3], [4]],
  1: [[0], [1]],
  4: [[0], [1]],
  5: [[0], [0], [1], [2]],
  6: [[0], [1]],
  7: [[0], [1], [2], [3]],
  10: [[0]],
  11: [[0]],
  14: [[0, 1], [2], [3]],
  17: [[0], [1], [2], [3]],
  18: [[0, 1], [2, 3]],
  19: [[0]],
  20: [[0], [1], [2], [3], [4], [5]],
  25: [[0], [1]],
};
const semanticNotes = {
  0: "Examples and spherical-mirror scope retained. Modern prose describes possible larger/smaller images rather than making unequal size an exceptionless law; the plane-mirror positional rule is not a universal curved-mirror rule.",
  1: "Spherical reflecting surface and source point O retained; modern center-of-curvature terminology is explicitly separated from the source's optical-center term and from thin-lens usage.",
  4: "Vertex P and axes through curvature center retain the source geometry and OP/OK notation.",
  5: "Principal axis OP, symmetry-axis role and remaining secondary axes retain the source distinction; source introductory sentence is merged without losing its role.",
  6: "Inner reflecting surface is concave and outer reflecting surface convex in both languages.",
  7: "The optical-disk sequence and reversed middle ray are retained; side-ray meeting is explicitly approximate and linked to the footnote.",
  10: "The principal-focus claim is correctly scoped to a concave mirror and paraxial rays; the labeled real-focus clarification uses actual reflected rays in front of the mirror.",
  11: "First footnote preserves small ray height relative to sphere radius; modern spherical-aberration explanation prevents arbitrary-aperture exact-focus claims.",
  14: "Secondary-axis beam, equal-distance approximation, focal surface and small-angle perpendicular focal-plane approximation are preserved with narrow-beam/aberration qualifications.",
  17: "Focus-first staging, divergent rays toward the mirror and the luminous-point construction are preserved; reverse parallel-beam conclusion remains paraxial and is not confused with exact reversibility itself.",
  18: "Real/virtual image outcomes are correctly tied to moving the luminous point beyond/inside the focus; real rays versus backward extensions and front/behind locations are distinguished.",
  19: "Second footnote retains small incident angles relative to the principal axis; point imaging is not made an all-direction/all-aperture guarantee.",
  20: "Convex reflected rays diverge and backward extensions meet at a virtual focus behind the mirror in the paraxial model; screen and actual-ray distinctions are clearly labeled modern clarification.",
  25: "Focal length definition and source F symbol shared with focal-point label are preserved; modern vertex-to-focus measurement and need for a separate signed convention prevent curvature-center or point/length confusion.",
};
const lines = (entry) => entry.text.split("\n").filter((line) => line.trim());
const claims = [];
for (let i = 0; i < source.prose.length; i++) {
  const entry = source.prose[i];
  if (entry.kind !== "p" && entry.kind !== "cap") continue;
  const units = entry.kind === "p" ? entry.text.split(/[.。]/).map((text) => text.trim()).filter(Boolean) : [entry.text];
  units.forEach((sourceText, sourceSentenceIndex) => {
    const indices = entry.kind === "p" ? targetLines[i][sourceSentenceIndex] : [0];
    ensure(indices?.length, "Missing independent source-claim target selection");
    const zhLines = lines(zh.prose[i]);
    const enLines = lines(en.prose[i]);
    indices.forEach((n) => ensure(zhLines[n] && enLines[n], "Missing bilingual target line"));
    claims.push({
      id: `n70-source-claim-${String(claims.length + 1).padStart(2, "0")}`,
      sourceProseIndex: i, sourceSentenceIndex,
      sourceUnit: entry.kind === "cap" ? "caption" : "prose-sentence",
      source_refs: entry.source_refs, sourceText,
      zh: { path: path.join(candidate, "lesson.template.json"), proseIndex: i, nonemptyLineIndices: indices, text: indices.map((n) => zhLines[n]).join("\n") },
      en: { path: path.join(candidate, "english.lesson.template.json"), proseIndex: i, nonemptyLineIndices: indices, text: indices.map((n) => enLines[n]).join("\n") },
      sourceCoverage: "PASS", SCI: "PASS", ZHEN: "PASS",
      independentAssessment: entry.kind === "cap" ? "Caption figure number is preserved and translated; figure pixels/geometry remain pending." : semanticNotes[i],
      figurePixelApproval: false,
    });
  });
}
ensure(claims.length === 45 && claims.filter((claim) => claim.sourceUnit === "prose-sentence").length === 39, "Wrong independent textual-claim count");
const expectedFigures = ["fig-141", "fig-142", "fig-143", "fig-144", "fig-145", "fig-146"];
for (const data of [source, zh, en, figures]) {
  ensure(JSON.stringify(data.figures.map((figure) => figure.id)) === JSON.stringify(expectedFigures), "Changed figure association set");
}
const figureAssociations = expectedFigures.map((id) => {
  const sourceEntry = source.prose.find((entry) => entry.kind === "fig" && entry.id === id);
  const figure = figures.figures.find((entry) => entry.id === id);
  ensure(figure.status === "pending-FIG" && figure.association_only === true && figure.source_pixels_observed_in_this_authoring === false, "Figure approval drift");
  for (const format of ["png", "svg"]) {
    const sourceMetadata = manifest.inputs.find((entry) => entry.suffix === `figures/${id}.${format}`);
    ensure(sourceMetadata && figure.source[format].sha256 === sourceMetadata.sha256, "Figure source metadata association changed");
  }
  return {
    id, source_refs: sourceEntry.source_refs,
    textAssociation: "PASS", FIG: "pending", DISPLAY: "HOLD",
    pixelReview: false, geometryReview: false, grantedFigurePASS: false,
    sourceHashesComparedAsMetadataOnly: true,
  };
});
const modernClarifications = [
  { proseIndex: 0, role: "Geometrical-optics/specular-reflection model and global small-height/small-angle limitations", sourceRelationship: "Labeled modern explanation supporting the two later source footnotes" },
  { proseIndex: 1, role: "Curvature center rather than thin-lens optical center", sourceRelationship: "Labeled modern terminology; O remains the source sphere center" },
  { proseIndex: 10, role: "Concave principal focus is real because actual reflected rays meet", sourceRelationship: "Labeled modern clarification of the source ray construction" },
  { proseIndex: 11, role: "Spherical aberration and no arbitrary-width exact focus", sourceRelationship: "Labeled explanation of source footnote p0183#12" },
  { proseIndex: 14, role: "Focal-plane approximation excludes arbitrary off-axis angles", sourceRelationship: "Labeled clarification of small-angle focal-surface approximation in p0184#3/#6" },
  { proseIndex: 17, role: "Exact reversibility is distinct from approximate point-focus/parallel-beam modeling", sourceRelationship: "Labeled modern clarification; source focus staging remains unchanged" },
  { proseIndex: 18, role: "Distance changes are relative to focal position; virtual image is not reached by actual reflected light", sourceRelationship: "Labeled clarification of the source's focus-relative experiment" },
  { proseIndex: 19, role: "No universal all-angle/all-aperture point-imaging guarantee", sourceRelationship: "Labeled explanation of source footnote p0184#10" },
  { proseIndex: 20, role: "A virtual focus behind the mirror is not a real screen-receivable light convergence", sourceRelationship: "Labeled modern clarification of convex-focus extensions" },
  { proseIndex: 25, role: "Vertex-to-focus distance and separate signed-convention requirement", sourceRelationship: "Labeled modern clarification; source F point/length notation remains provenance" },
].map((entry) => {
  ensure(zh.prose[entry.proseIndex].text.includes("现代说明：") && en.prose[entry.proseIndex].text.includes("Modern clarification:"), "Unlabeled modern clarification");
  return { ...entry, SCI: "PASS", ZHEN: "PASS", sourceClaimedOriginalText: false };
});
const sourceMapping = {
  schema: "STEMROBIN-181/n70-independent-source-claim-mapping@1",
  card, reviewer: "reused d343/d363/d372 agent, first n70 text review",
  authorHashes,
  independence: "Mappings and semantic assessments were derived directly from faithful lesson/source_refs and both candidate languages; author coverage/mapping/SCI self-check outcomes were not adopted.",
  sourceReferenceConvention: "One-based #n; page JSON array index n-1",
  sourceReferenceChecks: sourceReferences,
  all26SourceEntriesMatchBoundRefs: true,
  sourceClaimCount: 45, proseSentenceCount: 39, captionCount: 6,
  sourceProseParagraphs: 14, sourceFigureBlocks: 6,
  claims, modernClarifications, figureAssociations,
  source185Prefix: "Only p0185#1-#6 are n70 dependencies; p0185#8/n71 is excluded.",
};
const sciChecks = Object.entries(semanticNotes).map(([index, assessment]) => ({
  sourceProseIndex: Number(index), source_refs: source.prose[Number(index)].source_refs,
  assessment, status: "PASS",
}));
const sciOutcome = {
  schema: "STEMROBIN-181/n70-independent-SCI@1", card,
  status: "PASS", scope: "Frozen n70 bilingual lesson text and zero exercises only",
  authorHashes, sourceLesson: { path: sourcePath, sha256: manifest.sourceLesson.sha256 },
  scientificReviewIsManual: true,
  scriptBoundary: "Structural/hash checks only; these scientific judgments record the independent reviewer's reading, not a computed scientific proof.",
  checkedSourceParagraphs: 14, checkedTextualClaims: 45,
  checks: sciChecks, modernClarifications,
  sourceQuestionCount: 0, zhExerciseCount: 0, enExerciseCount: 0,
  inventedQuestionsChoicesKeyboardAnswers: false,
  findings: [], repairListOnce: [],
  FIG: "pending", DISPLAY: "HOLD", fullGate2: "HOLD", completeCard: "HOLD",
};
const zhenOutcome = {
  schema: "STEMROBIN-181/n70-independent-ZHEN@1", card,
  status: "PASS", scope: "Frozen localized titles, 14 prose entries, 6 caption texts, source provenance and empty exercises",
  authorHashes,
  checkedTextualClaims: 45, checkedModernClarificationEntries: modernClarifications.length,
  judgment: "Definitions, ray-direction/location distinctions, both footnotes, approximation qualifiers, focus-relative motion, F notation and attribution remain equivalent in the two languages.",
  localizedTitles: { zh: zh.localized_title, en: en.localized_title },
  sourceDataPreservedInBothLanguages: true,
  sourceTextFieldsAreProvenanceNotEnglishTranslationTargets: true,
  visibleEnglishCaptionTextsLocalized: true,
  noExerciseOrAnswerLeakageInAuthoredText: true,
  sourceQuestions: 0, zhExercises: 0, enExercises: 0,
  findings: [], repairListOnce: [],
  pixelLayoutOrFigureLabelRenderingApproved: false,
  FIG: "pending", DISPLAY: "HOLD", fullGate2: "HOLD", completeCard: "HOLD",
};
const report = {
  schema: "STEMROBIN-181/n70-first-independent-text-review@1",
  ticket: "STEMROBIN-181", card,
  status: "FIRST-INDEPENDENT-SCI-PASS-ZHEN-PASS-FIG-DISPLAY-HOLD",
  SCI: "PASS", ZHEN: "PASS",
  authorHashes,
  sourceClosureBinding: { path: path.join(prep, "manifest.json"), sha256: "ba25d7e0457da04b120c449e192745e89d7ad4894cb3b1295a2bf09f73946374" },
  authorGate: { completedFreezeVerified0444: true, reportHashVerified: true, authorFreezeHashVerified: true, outputFrozenManifestHashVerified: true, authorPayloadTextHashesPreviouslyVerified: 29, firstReviewAfterFreeze: true },
  independentReview: { copiedAuthorVerdicts: false, authorSelfCheckEvidenceUsedAsSCIOrZHENProof: false, sourceRefsRead: 29, faithfulEntriesBound: 26, scientificProseParagraphs: 14, textualClaims: 45, proseSentences: 39, captions: 6, modernClarifications: modernClarifications.length },
  findings: [],
  repairListOnce: [],
  noRequiredTextRepairs: true,
  zeroSourceExercisePolicy: { source: 0, zhWritten: 0, enWritten: 0, inventedChoiceQuestions: 0, inventedKeyboardQuestions: 0, inventedAnswers: 0 },
  figureAssociations,
  imageBudget: { retained: 24, new: 0, total: 24, limit: 24, reset: false, actualOpens: [] },
  sourceScope: {
    n70PrefixClosed: true,
    refs185: sourceReferences.filter((entry) => entry.ref.startsWith("p0185")).map((entry) => entry.ref),
    excludedN71Reference: "p0185#8",
    n71ReviewOrApproval: false,
    historicalPreparationManifestFullPage185State: "HOLD-preserved at that frozen manifest",
    currentSource185FullPageState: "PASS consumed through423, latest human checkpoint; not rechecked or granted by this review",
    noReassemblyOrRawSourcePixelReplay: true,
  },
  retainedBoundaries: { FIG: "pending", DISPLAY: "HOLD", fullDISPLAY: "HOLD", fullGate2: "HOLD", completeCard: "HOLD", otherCardHolds: "unchanged", earlierT18HoldsAndKnownDisplayFailure: "unchanged" },
  forbiddenActionsPerformed: { images: 0, sourceFigurePixels: 0, FIGReview: 0, nativeChecks: 0, browsersCapturesRenders: 0, sourceReaudit: 0, otherLessonsReviewed: 0, paidGeneration: 0, DB: 0, git: 0, indexMeterCanonicalEdits: 0, newWorkersChatsWorktreesBranches: 0 },
  writeBoundary: output,
  outputs: ["source-claim-mapping.json", "sci-outcome.json", "zhen-outcome.json", "input-bindings.json", "report.json", "output-frozen-manifest.json"],
  limitation: "Text-only SCI/ZHEN results do not approve figures, display, client/native behavior, n71, another card, the complete card or a full Gate2.",
};
const serializedInputs = () => {
  inputBindings.forEach((entry) => {
    entry.sha256After = hashFile(entry.path);
    entry.unchanged = entry.sha256Before === entry.sha256After;
    ensure(entry.unchanged, "Reviewed input changed");
    if (entry.path.startsWith(author + "/")) ensure((fs.statSync(entry.path).mode & 0o777) === 0o444, "Author mode changed");
  });
  return {
    schema: "STEMROBIN-181/n70-independent-input-bindings@1",
    card, authorHashes, inputs: inputBindings,
    allInputsUnchanged: true, imageFilesRead: 0,
    semanticReadBoundary: "Faithful lesson, selected source_refs text, two language templates, empty exercise templates and figure-association metadata only",
    source185JSON: "Scoped preparation prefix JSON; its digest differs from a full-page JSON and is not claimed to be the whole page's digest",
  };
};
const products = {
  "source-claim-mapping.json": sourceMapping,
  "sci-outcome.json": sciOutcome,
  "zhen-outcome.json": zhenOutcome,
  "input-bindings.json": serializedInputs(),
  "report.json": report,
};
for (const [name, data] of Object.entries(products)) {
  fs.writeFileSync(path.join(output, name), JSON.stringify(data, null, 2) + "\n", { flag: "wx" });
}
const expectedNames = ["input-bindings.json", "report.json", "review.mjs", "sci-outcome.json", "source-claim-mapping.json", "zhen-outcome.json"];
ensure(JSON.stringify(fs.readdirSync(output).sort()) === JSON.stringify(expectedNames), "Unexpected own outputs");
const outputs = expectedNames.map((name) => {
  const file = path.join(output, name);
  fs.chmodSync(file, 0o444);
  ensure((fs.statSync(file).mode & 0o777) === 0o444, "Own output not frozen");
  return { path: file, sha256: hashFile(file), mode: "0444", bytes: fs.statSync(file).size };
});
const manifestPath = path.join(output, "output-frozen-manifest.json");
const frozen = {
  schema: "STEMROBIN-181/n70-independent-review-freeze@1",
  card, outputFrozen: true, status: "TRUE", frozenAt: new Date().toISOString(),
  SCI: "PASS", ZHEN: "PASS", authorHashes,
  reviewedInputs: inputBindings,
  outputs,
  imageBudget: report.imageBudget,
  grantedOnly: ["n70 frozen text SCI", "n70 frozen text ZHEN"],
  notGranted: ["FIG", "DISPLAY", "fullDISPLAY", "fullGate2", "complete-card", "n71", "other-card HOLD release"],
  manifestSelf: { path: manifestPath, mode: "0444", sha256Location: "Final textual return; excluded here to avoid circular self-hashing" },
};
fs.writeFileSync(manifestPath, JSON.stringify(frozen, null, 2) + "\n", { flag: "wx", mode: 0o444 });
fs.chmodSync(manifestPath, 0o444);
inputBindings.forEach((entry) => ensure(hashFile(entry.path) === entry.sha256Before, "Final input hash mismatch"));
outputs.forEach((entry) => ensure(hashFile(entry.path) === entry.sha256 && (fs.statSync(entry.path).mode & 0o777) === 0o444, "Final frozen output mismatch"));
ensure((fs.statSync(manifestPath).mode & 0o777) === 0o444, "Manifest not frozen");
console.log(JSON.stringify({
  SCI: "PASS", ZHEN: "PASS", findings: 0,
  sourceRefs: 29, independentTextualClaims: 45, sourceExercises: 0,
  reviewedInputsVerified: inputBindings.length, imageBudget: report.imageBudget,
  authorHashes, outputFrozen: true,
  outputs: [...outputs, { path: manifestPath, sha256: hashFile(manifestPath), mode: "0444" }],
}, null, 2));
