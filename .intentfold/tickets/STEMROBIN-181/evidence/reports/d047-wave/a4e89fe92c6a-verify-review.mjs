import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.resolve(evidence, "../../../../..");
const tmp = path.dirname(evidence);
const output = path.join(tmp, "d044-n38-n40-science-review.json");
const require = createRequire(import.meta.url);
const bindings = new Map();
const historicalToolBindings = [];
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const absolute = (p) => path.isAbsolute(p) ? p : path.join(workspace, p);

function bind(p, expected, role = "reviewed-text-or-receipt") {
  const file = absolute(p);
  assert(!/\.(?:png|svg|jpg|jpeg|webp|pdf)$/i.test(file), "Image/PDF reads are outside scope");
  const bytes = fs.readFileSync(file);
  const sha256 = digest(bytes);
  if (expected) assert.equal(sha256, expected, `Binding drift: ${file}`);
  const previous = bindings.get(file);
  bindings.set(file, {
    path: file,
    sha256,
    bytes: bytes.length,
    roles: [...new Set([...(previous?.roles ?? []), role])],
    expectedSha256: expected ?? previous?.expectedSha256 ?? null,
    expectedBindingMatches: expected ? true : previous?.expectedBindingMatches ?? null,
  });
  return bytes.toString("utf8");
}

function json(p, expected, role) {
  return JSON.parse(bind(p, expected, role));
}

function freezeReferences(value, trail = []) {
  if (!value || typeof value !== "object") return;
  if (typeof value.path === "string" && /^[0-9a-f]{64}$/.test(value.sha256 ?? "")) {
    if (["contractBindings", "reusedPatterns"].includes(trail[0])) {
      const file = absolute(value.path);
      const currentSha256 = digest(fs.readFileSync(file));
      bindings.set(file, {
        path: file,
        sha256: currentSha256,
        roles: ["hash-only-historical-tool-or-pattern-reference"],
        expectedSha256: null,
        expectedBindingMatches: null,
      });
      historicalToolBindings.push({
        path: file,
        recordedCheckTimeSha256: value.sha256,
        observedCurrentSha256: currentSha256,
        unchangedSinceCheck: currentSha256 === value.sha256,
        role: "Historical execution binding, not a claim that a concurrently edited tool is unchanged",
      });
    } else {
      bind(value.path, value.sha256, trail.join("."));
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) freezeReferences(child, [...trail, key]);
}

function payload(receipt) {
  assert.equal(receipt.exitCode, 0, "Recorded command failed");
  return typeof receipt.stdout === "string" ? JSON.parse(receipt.stdout) : receipt.stdout;
}

const findings = json(path.join(evidence, "review-findings.json"), null, "independent-human-judgments");
bind(fileURLToPath(import.meta.url), null, "review-verifier-source");
bind(path.join(evidence, "capture-primary.mjs"), null, "primary-capture-source");
bind(path.join(evidence, "verify-science.mjs"), null, "independent-science-check-source");
for (const file of [
  ".intentfold/readme.md", ".intentfold/project.json",
  ".intentfold/charter/engineering.md", ".intentfold/charter/operations.md",
  ".claude/skills/ld-s10y-lesson/SKILL.md",
  ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
  "/Users/yong/.agents/skills/intentfold/SKILL.md",
]) bind(file, null, "read-only-routing-or-contract");

const freezeHashes = {
  n38: "d5e69cdda197b60aa3d89879184a2f77401e9700539972e11da96bd086562048",
  n40: "57460be08f809264a7c942aee226687f336cf544a76e45fc4d190fac869388d1",
};
const freezes = {};
const documents = {};
const flowEvidence = {};
const cardResults = [];
const htmlfragFile = ".claude/skills/ld-s10y-lesson/tools/htmlfrag.js";
bind(htmlfragFile, null, "read-only-authoritative-flow-projection");
const { proseOutline, sectionBreakIndices, proseFlow } = require(absolute(htmlfragFile));

for (const name of ["n38", "n40"]) {
  const author = path.join(tmp, `d044-10p-${name}-author`);
  const freezeFile = path.join(author, "author-freeze.json");
  const freeze = json(freezeFile, freezeHashes[name], "human-specified-author-freeze");
  freezes[name] = freeze;
  freezeReferences(freeze);
  const input = json(freeze.inputFreeze.path, freeze.inputFreeze.sha256, "author-input-manifest");
  const raw = json(input.raw.path, input.raw.sha256, "raw-source-card");
  const exercises = json(input.exercises.path, input.exercises.sha256, "raw-source-zero-tasks");
  assert.equal(raw.prose.length, name === "n38" ? 13 : 22);
  assert.equal(raw.prose.filter((p) => p.kind === "p").length, name === "n38" ? 7 : 16);
  assert.equal(raw.prose.filter((p) => p.kind === "fig").length, 3);
  assert.equal(raw.prose.filter((p) => p.kind === "cap").length, 3);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  assert.equal(raw.exercise_count, 0);
  assert.equal(findings.cards[name].objects.length, raw.prose.length);
  for (const reused of input.inputs.filter((entry) => entry.path)) {
    const report = json(reused.path, reused.sha256, "reused-source-approval-not-rerun");
    assert.equal(report.SOURCE, "PASS");
    assert.equal(report.RAW, "PASS");
  }

  const textsFile = path.join(author, "texts.json");
  const texts = json(textsFile, null, "current-author-sentence-texts");
  const rows = Array.isArray(texts) ? texts : texts.blocks;
  assert.equal(rows.length, raw.prose.length);
  documents[name] = {};
  const languages = [];
  for (const frozen of freeze.frozen) {
    const language = frozen.language;
    const template = json(frozen.template.path, frozen.template.sha256, "current-frozen-language-template");
    documents[name][language] = template;
    assert.deepEqual(template.source.data, raw);
    assert.equal(template.source.sha256, input.raw.sha256);
    assert.equal(template.prose.length, raw.prose.length);
    const taskTemplate = json(frozen.exercisesTemplate.path, frozen.exercisesTemplate.sha256);
    assert.equal(taskTemplate.count, 0);
    assert.deepEqual(taskTemplate.exercises, []);
    const figureTemplate = json(frozen.figuresTemplate.path, frozen.figuresTemplate.sha256);
    assert.deepEqual(figureTemplate.figures.map((f) => f.id),
      name === "n38" ? ["fig-69", "fig-70", "fig-71"] : ["fig-73", "fig-74", "fig-75", "fig-64"]);

    for (const [index, block] of template.prose.entries()) {
      const source = raw.prose[index];
      assert.equal(block.kind, source.kind);
      assert.equal(block.id, source.id);
      assert.equal(block.label, source.label);
      assert.equal(block.printed_page, source.printed_page);
      assert.deepEqual(block.source_refs, source.source_refs);
      assert.equal(block.source_text, source.text);
      assert.deepEqual(block.numeric_changes, []);
      assert.deepEqual(rows[index].source_refs, source.source_refs);
      assert.equal(block.text.replace(/\n+/g, "\n"), rows[index][language].replace(/\n+/g, "\n"));
      assert.deepEqual(findings.cards[name].objects[index].source_refs, source.source_refs);
    }
    if (frozen.currentProse) {
      const current = json(frozen.currentProse.path, frozen.currentProse.sha256);
      assert.deepEqual(current.prose, template.prose);
      assert.deepEqual(current.section_breaks, template.section_breaks);
    }
    const normalizationRef = frozen.nativeNormalizationReceipt ?? frozen.normalizationReceipt;
    const normalized = payload(json(normalizationRef.path, normalizationRef.sha256));
    assert.deepEqual(normalized.document.prose, template.prose);
    const receiptRef = frozen.nativeFlowReceipt ?? frozen.proseFlowReceipt;
    const recorded = payload(json(receiptRef.path, receiptRef.sha256));
    const outline = proseOutline(template.prose);
    const resolved = sectionBreakIndices(template.prose, template.section_breaks);
    assert.deepEqual(outline, recorded.paragraphs);
    assert.deepEqual(resolved, recorded.resolvedBreaks);
    if (frozen.nativeFlow) {
      assert.deepEqual(json(frozen.nativeFlow.path, frozen.nativeFlow.sha256), recorded);
    }
    const actualFlow = proseFlow(template.prose, template.section_breaks);
    if (frozen.nativeProseFlowReceipt) {
      const nativeFlow = json(frozen.nativeProseFlowReceipt.path, frozen.nativeProseFlowReceipt.sha256);
      assert.deepEqual(actualFlow, nativeFlow.flow);
      assert.equal(nativeFlow.sharedFigure64Occurrences, 1);
      assert.equal(nativeFlow.sharedFigure64AfterFinalReferencingParagraph, true);
    }
    const reading = bind(frozen.readingText.path, frozen.readingText.sha256);
    const expectedBody = `${template.prose.filter((p) => p.kind !== "fig").map((p) => p.text).join("\n\n")}\n`;
    assert.equal(reading.slice(reading.indexOf("\n\n") + 2), expectedBody);
    const rawReadingFile = frozen.rawReadingText?.path ??
      path.join(author, language, "root/10p/lessons", freeze.card, "lesson.md");
    const rawReading = bind(rawReadingFile, frozen.rawReadingText?.sha256, "raw-reading-text-no-images-opened");
    for (const source of raw.prose.filter((p) => p.kind === "p")) {
      assert(rawReading.includes(source.text), "Raw reading/source prose mismatch");
    }

    const paragraphs = outline.map((p) => {
      const lines = p.text.split("\n").filter((line) => line.trim());
      const completeEndings = lines.every((line) =>
        /[.!?。！？](?:\*+)?$/.test(line.trim()));
      assert(completeEndings, "Sentence-ending structural failure");
      assert(!/[;；]/.test(p.text), "Unexpected semicolon split risk");
      const exception = findings.cards[name].singletonJudgments.find((item) =>
        item.language === language && item.paragraphIndex === p.index);
      let groupingVerdict = "PASS-2-3-COMPLETE-SENTENCES";
      if (lines.length === 1) {
        assert(exception, "Singleton requires an explicit independent semantic judgment");
        groupingVerdict = exception.verdict;
      } else assert(lines.length >= 2 && lines.length <= 3, "Paragraph sentence count outside 2-3");
      return {
        ...p,
        source_refs: template.prose[p.blockIndex].source_refs,
        sentenceLines: lines.length,
        completeEndings,
        manuallyReviewedForGrammarAndCompleteness: true,
        groupingVerdict,
      };
    });
    flowEvidence[`${name}-${language}`] = {
      template: { path: frozen.template.path, sha256: frozen.template.sha256 },
      flowReceipt: receiptRef,
      normalizedReceipt: normalizationRef,
      paragraphs,
      resolvedBreaks: resolved,
      boundaries: recorded.boundaries,
      actualFlow,
      source: "Read-only projection of unchanged normalized templates, equal to recorded native flows",
      normalizationExecuted: false,
      nativeTextCheckExecuted: false,
      imagesOpened: 0,
    };
    languages.push({
      language,
      template: frozen.template,
      readingText: frozen.readingText,
      proseParagraphs: outline.length,
      fullFlowObjects: actualFlow.length,
      sectionBreaks: resolved,
      singletonParagraphs: paragraphs.filter((p) => p.sentenceLines === 1).map((p) => ({
        index: p.index, source_refs: p.source_refs, verdict: p.groupingVerdict,
      })),
      sentenceLines: paragraphs.reduce((total, p) => total + p.sentenceLines, 0),
      semicolonFragments: 0,
      status: findings.cards[name][language === "zh" ? "ZH" : "EN"],
    });
  }
  for (const defect of findings.cards[name].defects) {
    const paragraph = flowEvidence[`${name}-${defect.language}`].paragraphs[defect.paragraphIndex];
    assert.equal(paragraph.blockIndex, defect.blockIndex);
    assert(paragraph.text.includes(defect.exactText));
    assert.deepEqual(paragraph.source_refs, defect.source_refs);
    if (defect.nativeFlowIndex !== undefined) {
      assert.equal(flowEvidence[`${name}-${defect.language}`].actualFlow[defect.nativeFlowIndex].text,
        defect.exactText);
    }
  }
  const objects = findings.cards[name].objects.map((review, index) => ({
    ...review,
    kind: raw.prose[index].kind,
    rawTextSha256: digest(raw.prose[index].text),
    sourceMeaningStatus: name === "n40" && index === 5 ? "PASS-IN-CONTEXT" : "PASS",
    reviewedText: Object.fromEntries(["zh", "en"].map((language) => [language, {
      template: freeze.frozen.find((f) => f.language === language).template,
      jsonPointer: `/prose/${index}/text`,
      textSha256: digest(documents[name][language].prose[index].text),
      text: documents[name][language].prose[index].text,
    }])),
  }));
  cardResults.push({
    card: freeze.card,
    authorFreeze: { path: freezeFile, sha256: freezeHashes[name] },
    raw: input.raw,
    ...findings.cards[name],
    objects,
    counts: {
      sourceObjects: raw.prose.length,
      prose: raw.prose.filter((p) => p.kind === "p").length,
      footnotesIncludedInProse: raw.prose.filter((p) => p.label === "footnote").length,
      figures: 3, captions: 3, tasks: 0, addedTasks: 0,
      sourceMathTokens: name === "n38" ? 2 : 0,
      changedScientificNumbers: 0,
      imagesOpened: 0,
    },
    languages,
    titleScope: "Bilingual reading headings reviewed; preserved Chinese catalog metadata is not an English-metadata migration",
    missingModernFigureIds: name === "n38" ?
      ["fig-69", "fig-70", "fig-71"] : ["fig-73", "fig-74", "fig-75", "fig-64"],
  });
}

const resolutionFile = path.join(tmp, "d044-localized-reference-checks/resolution.json");
const resolutionHash = "510c25f0297fcb98f3f422f7348ca2600d1b02015c7ae4f3cec5a9475f986c9e";
const resolution = json(resolutionFile, resolutionHash, "human-specified-native-resolution-overlay");
assert.equal(resolution.status, "pass");
for (const tool of [resolution.tool, resolution.original, resolution.affected]) {
  bind(tool.path, tool.sha256, "native-resolution-tool-hash-not-executed");
}
assert.equal(resolution.tool.sha256, resolution.affected.sha256);
assert.equal(resolution.original.sha256,
  freezes.n38.contractBindings.find((tool) => tool.path.endsWith("/edition.py")).sha256);
assert.equal(resolution.sourceOrAuthorTextChanged, false);
assert.equal(resolution.normalizationChanged, false);
assert.equal(resolution.originalFailuresPreserved, true);
const focused = resolution.results.find((result) => result.name === "focused-contract");
const focusedReceipt = json(focused.receipt.path, focused.receipt.sha256);
const focusedData = payload(focusedReceipt);
assert.equal(focusedData.status, "pass");
for (const kind of ["quantity-change", "figure-change", "figure-loss", "figure-addition", "section-change", "formula-change"]) {
  const item = focusedData.cases.find((entry) => entry.case === kind);
  assert.equal(item.status, "pass");
  assert(item.rejectedErrors.length > 0);
}
const nativeBindings = [];
for (const name of ["n38", "n40"]) {
  const result = resolution.results.find((r) => r.name === `${name}-native-affected`);
  const receipt = json(result.receipt.path, result.receipt.sha256, "affected-native-pass-receipt-not-rerun");
  const data = payload(receipt);
  assert.equal(result.status, "pass");
  assert.equal(data.status, "pass");
  assert.equal(data.native_text_status, "pass");
  for (const language of data.languages) {
    const current = freezes[name].frozen.find((entry) => entry.language === language.language);
    assert.equal(language.template, current.template.path);
    assert.equal(language.template_sha256, current.template.sha256);
    assert.deepEqual(language.native_text_errors ?? [], []);
    if (language.paragraphs) assert.deepEqual(language.paragraphs.paragraphs,
      flowEvidence[`${name}-${language.language}`].paragraphs.map((p) => ({
        index: p.index, blockIndex: p.blockIndex, paragraphInBlock: p.paragraphInBlock, text: p.text,
      })));
  }
  const originalCheck = freezes[name].nativeTextCheck ?? freezes[name].textCheck;
  const old = json(originalCheck.path, originalCheck.sha256, "original-fail-receipt-preserved");
  assert.equal(old.status, "fail");
  assert.equal(old.native_text_status, "fail");
  const oldErrors = old.errors ?? old.native_text_errors;
  assert(oldErrors.length >= (name === "n38" ? 5 : 8));
  nativeBindings.push({
    card: freezes[name].card,
    originalCheck,
    originalStatus: "FAIL",
    originalErrors: oldErrors,
    affectedCheck: result.receipt,
    affectedStatus: "PASS",
    exitCode: receipt.exitCode,
    currentTemplateHashesBound: true,
    nativeChecksRerunByReviewer: false,
    authorAndRawUnchanged: true,
    scientificOrBilingualApprovalImplied: false,
  });
}
assert.equal(freezes.n38.targetedRepairs, 1);
assert.equal(freezes.n40.targetedRepairRuns, 0);

const capture = json(path.join(evidence, "primary-capture.json"), null, "public-primary-authority-text-capture");
for (const source of capture) {
  assert.equal(source.exitCode, 0);
  const text = bind(source.text.path, source.text.sha256, "public-primary-authority-rendered-text");
  bind(source.stderr.path, source.stderr.sha256, "primary-fetch-receipt-stderr");
  assert(text.includes("Status: 200"));
}
const authorityUses = [
  {
    id: "openstax-intensity",
    source_refs: ["p0112#14", "p0113#1", "p0113#2", "p0114#7", "p0115#1"],
    summary: "Power per area, lossless spherical dilution, amplitude-squared scaling at fixed conditions and fluid compression/rarefaction agree with the scoped text.",
    locator: "Section 17.3, equations 17.8-17.11 and the adjacent parcel/bulk-modulus derivation",
  },
  {
    id: "usgs-body-waves",
    source_refs: ["p0114#8", "p0115#2"],
    summary: "USGS describes P vibration parallel to propagation, S vibration perpendicular, earlier P arrivals in rock, and distinct direct/reflected wave paths.",
    locator: "Body waves inside the earth, first three body paragraphs",
    limit: "This page was not used as evidence for the fluid shear restriction; that premise is handled by the stated ordinary-fluid model.",
  },
  {
    id: "usgs-travel-times",
    source_refs: ["p0115#2"],
    summary: "USGS gives S-P time versus distance for a stated depth and an identified Earth model, supporting the card's velocity/path-model condition.",
    locator: "Table introduction specifies source depth; table footer identifies iasp91 and ARTIM",
    limit: "No graph, PDF or image opened; no numerical values imported into either card.",
  },
];
const report = {
  schema: "ld-s10y-lesson/independent-science-bilingual-text-review@1",
  ticket: "STEMROBIN-181",
  date: "2026-11-17",
  reviewer: findings.reviewer,
  completedAt: new Date().toISOString(),
  status: "COMPLETE-WITH-TEXT-HOLD",
  independentSCI: true,
  independentZHEN: true,
  reviewedSourceObjects: 35,
  cardResults,
  nativeResolutionOverlay: {
    status: "PASS-BINDING-VERIFIED-NOT-RERUN",
    resolution: { path: resolutionFile, sha256: resolutionHash },
    currentTool: resolution.tool,
    originalToolSnapshot: resolution.original,
    affectedToolSnapshot: resolution.affected,
    focusedContract: focused.receipt,
    casesCapableOfRejectingChanges: ["quantity-change", "figure-change", "figure-loss", "figure-addition", "section-change", "formula-change"],
    nativeBindings,
    historicalFailuresRetainedAsFailures: true,
    repairsUsedByOverlay: "Separate minimal shared-tool resolution, not a prose-author repair",
  },
  authoritativeFlow: {
    path: path.join(evidence, "normalized-flow-review.json"),
    normalizationRerun: false,
    affectedNativeTextChecksRerun: false,
    readOnlyProjectionEqualsFrozenNativeReceipts: true,
  },
  primaryAuthorities: capture.map((source) => ({
    ...source,
    usage: authorityUses.find((use) => use.id === source.id),
  })),
  scienceEvidence: {
    path: path.join(evidence, "science-verification.json"),
    automatedChecksDoNotReplaceIndependentSemanticReview: true,
  },
  scope: {
    ...findings.scope,
    reviewOnly: true,
    allowedWriteRoot: evidence,
    allowedReportFile: output,
    imageHashesMerelyReferencedInAuthorManifests: "Not re-read or verified; no visual/source-figure approval",
    sourceReviewsReused: true,
    nativeAffectedCheckRuns: 0,
    normalizationRuns: 0,
    appTestsOrBuilds: 0,
    publicationPerformed: false,
    fullCardApproval: false,
  },
  bindings: [...bindings.values()],
  historicalToolBindings,
};

function writeEvidence(file, data) {
  assert(path.dirname(file) === evidence || file === output);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}
writeEvidence(path.join(evidence, "normalized-flow-review.json"), flowEvidence);
const scienceFile = path.join(evidence, "science-verification.json");
const science = json(scienceFile, null, "independent-model-consistency-and-negative-controls");
assert.equal(science.status, "PASS");
report.scienceEvidence.sha256 = digest(fs.readFileSync(scienceFile));
report.authoritativeFlow.sha256 = digest(fs.readFileSync(report.authoritativeFlow.path));
report.bindings = [...bindings.values()];
report.bindings.push({
  path: report.authoritativeFlow.path, sha256: report.authoritativeFlow.sha256,
  roles: ["generated-frozen-flow-observations"],
});
for (const binding of report.bindings) {
  assert.equal(digest(fs.readFileSync(binding.path)), binding.sha256, "End-of-review drift");
}
report.endBindingCheck = "PASS";
writeEvidence(output, report);
writeEvidence(path.join(evidence, "verification-summary.json"), {
  status: "PASS-REVIEW-COMPLETENESS-AND-BINDINGS",
  report: { path: output, sha256: digest(fs.readFileSync(output)) },
  inputsBound: report.bindings.length,
  historicalNativeFailuresUnchanged: true,
  sourceObjectsReviewed: 35,
  imagesOpened: 0,
  nativeAffectedChecksRerun: 0,
  cardResults: cardResults.map((card) => ({ card: card.card, SCI: card.SCI, ZHEN: card.ZHEN, fullCardApproval: false })),
});
console.log(JSON.stringify({
  status: "PASS-REVIEW-COMPLETENESS-AND-BINDINGS",
  report: output,
  inputsBound: report.bindings.length,
  cardResults: cardResults.map((card) => ({ card: card.card, SCI: card.SCI, ZHEN: card.ZHEN, defects: card.defects.length })),
  imagesOpened: 0,
  nativeAffectedChecksRerun: 0,
}, null, 2));
