import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const W = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const T = path.join(W, ".intentfold/tickets/STEMROBIN-181");
const owned = path.join(T, "tmp/d042-9p-n134-text-repair");
const author = path.join(T, "tmp/d040-9p-n134-author");
const tools = path.join(W, ".claude/skills/ld-s10y-lesson/tools");
const python = path.join(W, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const card = "phy9-c2-s7-n134";
assert.equal(path.dirname(fileURLToPath(import.meta.url)), owned);

const bytes = (filename) => readFileSync(filename);
const sha = (value) => createHash("sha256").update(value).digest("hex");
const load = (filename) => JSON.parse(bytes(filename));
const bind = (filename) => ({ path: filename, sha256: sha(bytes(filename)) });
const jsonBytes = (value) => `${JSON.stringify(value, null, 2)}\n`;
const stringBinding = (value) => ({ text: value, sha256: sha(value) });
const out = (name) => {
  const filename = path.resolve(owned, name);
  assert.ok(filename.startsWith(`${owned}/`), filename);
  return filename;
};
const save = (name, value) => {
  const filename = out(name);
  mkdirSync(path.dirname(filename), { recursive: true });
  writeFileSync(filename, typeof value === "string" || Buffer.isBuffer(value)
    ? value : jsonBytes(value), { flag: "wx" });
  return bind(filename);
};
const walk = (directory) => readdirSync(directory, { withFileTypes: true })
  .flatMap((item) => {
    const filename = path.join(directory, item.name);
    assert.ok(!item.isSymbolicLink(), filename);
    return item.isDirectory() ? walk(filename) : [filename];
  });
const verifyBindings = (bindings) => {
  for (const item of bindings) assert.equal(sha(bytes(item.path)), item.sha256, item.path);
};
const run = (name, command, args, input) => {
  const result = spawnSync(command, args, {
    cwd: W, input, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  save(`commands/${name}.json`, {
    command, args, stdinSha256: input === undefined ? null : sha(input),
    status: result.status, stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  });
  assert.equal(result.error, undefined, name);
  assert.equal(result.status, 0, `${name}: ${result.stderr}`);
  return JSON.parse(result.stdout);
};

if (process.argv[2] === "--verify") {
  const freeze = load(out("repair-freeze.json"));
  verifyBindings(freeze.artifacts);
  verifyBindings(load(freeze.inputPreservation.path).bindings);
  console.log(JSON.stringify({
    path: out("repair-freeze.json"), sha256: sha(bytes(out("repair-freeze.json"))),
    status: freeze.status, artifactsVerified: freeze.artifacts.length,
    frozenInputHashesVerified: load(freeze.inputPreservation.path).bindings.length,
  }, null, 2));
  process.exit(0);
}
assert.deepEqual(process.argv.slice(2), ["--build"]);
assert.ok(!existsSync(out("repair-freeze.json")));
const authorFreezeBinding = {
  path: path.join(author, "author-freeze.json"),
  sha256: "ab08cd85ebc7fffe66cfc16be0c9a6b5b7bd25c92c4ef0dece5af711d8b82753",
};
const reviewBinding = {
  path: path.join(T, "tmp/d041-9p-n134-science-review.json"),
  sha256: "f6865f454e4316aedd6a3aeec34f076c756223b595bfc3dbf3fb33d79381f925",
};
verifyBindings([authorFreezeBinding, reviewBinding]);
const freeze = load(authorFreezeBinding.path);
const review = load(reviewBinding.path);
assert.equal(freeze.card, card);
assert.equal(review.card, card);
assert.deepEqual(review.findings.map((item) => item.id), ["SCI-01", "ZHEN-01", "ZHEN-02"]);
const finding = (id) => review.findings.find((item) => item.id === id);
const patterns = [
  path.join(T, "tmp/d040-bind-fig300-and-title.mjs"),
  path.join(W, ".intentfold/charter/engineering.md"),
  path.join(W, ".claude/skills/ld-s10y-lesson/SKILL.md"),
  path.join(W, ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md"),
  path.join(W, ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"),
  ...["edition.py", "prose_flow.mjs", "htmlfrag.js", "mathcheck.py", "katex_check.js"]
    .map((name) => path.join(tools, name)),
  out("repair.mjs"), out("validate-text.py"),
].map(bind);
const inputMap = new Map();
for (const item of [
  authorFreezeBinding, reviewBinding, ...freeze.raw3,
  ...freeze.artifacts, ...freeze.originalInputs, ...patterns,
]) {
  if (inputMap.has(item.path)) assert.deepEqual(inputMap.get(item.path), item);
  inputMap.set(item.path, item);
}
const inputBindings = [...inputMap.values()].sort((a, b) => a.path.localeCompare(b.path));
verifyBindings(inputBindings);
const inputPreservation = save("input-preservation.json", {
  schema: "ld-s10y-lesson/text-repair-input-preservation@1",
  method: "Byte hashing only; existing SOURCE/RAW evidence consumed without gate replay.",
  authorFreeze: authorFreezeBinding, review: reviewBinding, bindings: inputBindings,
  sourceGateReplay: false, imagesOpened: 0, imagesDecoded: 0,
});
const raw = load(freeze.raw3.find((item) => item.path.endsWith("/lesson.json")).path);
const repairs = [];
const languages = [];
const rawValueSignature = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map((item) => item[0]);

for (const frozen of freeze.frozen) {
  const language = frozen.language;
  const beforeBinding = frozen.templates.find((item) => item.path.endsWith("/lesson.template.json"));
  const before = load(beforeBinding.path);
  assert.equal(sha(jsonBytes(before)), beforeBinding.sha256);
  const candidate = structuredClone(before);
  const replacementOperations = [];
  const replace = (index, from, to, id, qualification = null) => {
    const text = candidate.prose[index].text;
    assert.equal(text.split(from).length, 2, `${language} ${id}: unique replacement`);
    candidate.prose[index].text = text.replace(from, to);
    replacementOperations.push({
      finding: id, field: `prose[${index}].text`,
      sourceRefs: candidate.prose[index].source_refs,
      before: stringBinding(from), after: stringBinding(to), qualification,
    });
  };
  if (language === "en") {
    replace(0,
      "At a temperature below the material's Curie temperature, inserting a suitable iron or steel core can greatly strengthen the field inside a coil while its current and winding geometry remain the same.",
      finding("ZHEN-02").replacementRecommended.en, "ZHEN-02");
    replace(3,
      "These numbers are retained as the textbook's reported values, not as modern precision measurements;",
      finding("SCI-01").replacementRecommended.en, "SCI-01");
    replace(3,
      "a particular material's transition temperature must be established from its composition and measurement data.",
      "A particular material's transition temperature must be established from its composition and measurement data.",
      "SCI-01",
      "Sentence-boundary capitalization only: the exact replacement ends with a period instead of the former semicolon. The following composition/measurement qualification is otherwise verbatim.");
  } else {
    assert.equal(language, "zh");
    const from = candidate.prose[3].text.split("\n")
      .find((line) => line.startsWith("\u8fd9\u4e9b\u6570\u503c"));
    assert.ok(from && from.endsWith("\uff1b"));
    replace(3, from, finding("SCI-01").replacementRecommended.zh, "SCI-01");
  }
  const authored = structuredClone(candidate);
  const normalized = run(`normalize-${language}`, python, [
    "-B", out("validate-text.py"), "--normalize",
  ], JSON.stringify(candidate));
  for (let index = 0; index < before.prose.length; index++) {
    assert.equal(normalized.prose[index].text.replace(/\s/g, ""),
      authored.prose[index].text.replace(/\s/g, ""), "Native reflow changes whitespace only");
    assert.deepEqual(rawValueSignature(normalized.prose[index].text),
      rawValueSignature(before.prose[index].text), "Literal formula tokens preserved");
  }
  const beforeFlow = load(frozen.outline.path);
  const initialFlow = run(`prose-flow-${language}-unanchored`, process.execPath, [
    path.join(tools, "prose_flow.mjs"), "--stdin",
  ], JSON.stringify({ ...normalized, section_breaks: [] }));
  save(`${language}/prose-flow-unanchored.json`, initialFlow);
  const anchorBindings = beforeFlow.boundaries.map((boundary) => {
    const originalAfter = beforeFlow.paragraphs[boundary.index];
    assert.equal(originalAfter.paragraphInBlock, 0);
    const after = initialFlow.paragraphs.find((paragraph) =>
      paragraph.blockIndex === originalAfter.blockIndex && paragraph.paragraphInBlock === 0);
    assert.ok(after && after.index > 0);
    return {
      sourceRefs: normalized.prose[after.blockIndex].source_refs,
      before: boundary,
      after: {
        index: after.index, before: initialFlow.paragraphs[after.index - 1].text,
        after: after.text,
      },
    };
  });
  normalized.section_breaks = anchorBindings.map(({ after }) => ({
    before: after.before, after: after.after,
  }));
  const template = save(`${language}/lesson.template.json`, normalized);
  const flow = run(`prose-flow-${language}`, process.execPath, [
    path.join(tools, "prose_flow.mjs"), "--json", template.path,
  ]);
  assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })),
    normalized.section_breaks);
  const outline = save(`${language}/prose-flow.json`, flow);
  const copies = frozen.templates.filter((item) => item !== beforeBinding)
    .map((item) => {
      const current = save(`${language}/${path.basename(item.path)}`, bytes(item.path));
      assert.equal(current.sha256, item.sha256);
      return { before: item, after: current };
    });
  const title = language === "en"
    ? finding("ZHEN-01").replacementRecommended.enNumberedDisplayTitle
    : normalized.printed_title;
  assert.equal(bytes(frozen.markdown.path).toString("utf8").split("\n")[0], `# ${title}`);
  const markdownText = (document) => `# ${title}\n\n${
    document.prose.filter((block) => block.kind === "p" || block.kind === "cap")
      .map((block) => block.text).join("\n\n")
  }\n`;
  const markdown = save(`${language}/prose.md`, markdownText(normalized));
  const beforeProse = load(frozen.prose.path);
  assert.deepEqual(beforeProse.paragraphs, beforeFlow.paragraphs);
  assert.deepEqual(beforeProse.prose, before.prose.filter((block) => block.kind === "p"));
  const prose = {
    ...beforeProse,
    prose: normalized.prose.filter((block) => block.kind === "p"),
    paragraphs: flow.paragraphs, section_breaks: normalized.section_breaks,
  };
  const proseBinding = save(`${language}/prose.json`, prose);
  const changedBlocks = before.prose.flatMap((block, index) =>
    block.text === normalized.prose[index].text ? [] : [index]);
  assert.deepEqual(changedBlocks, language === "en" ? [0, 3] : [3]);
  assert.equal(normalized.title, raw.title);
  assert.equal(normalized.printed_title, raw.printed_title);
  assert.deepEqual(normalized.source, before.source);
  assert.deepEqual(normalized.source.data, raw);
  const reversed = structuredClone(normalized);
  for (const index of changedBlocks) reversed.prose[index].text = before.prose[index].text;
  reversed.section_breaks = before.section_breaks;
  assert.deepEqual(reversed, before,
    "Reverse diff: finding-bound prose fields and derived section anchors only");
  assert.equal(sha(jsonBytes(reversed)), beforeBinding.sha256);
  assert.equal(sha(markdownText(reversed)), frozen.markdown.sha256);
  const reversedProse = {
    ...prose, prose: beforeProse.prose, paragraphs: beforeProse.paragraphs,
    section_breaks: beforeProse.section_breaks,
  };
  assert.deepEqual(reversedProse, beforeProse);
  assert.equal(sha(jsonBytes(reversedProse)), frozen.prose.sha256);
  const blockChanges = changedBlocks.map((index) => ({
    blockIndex: index, field: `prose[${index}].text`,
    finding: index === 0 ? "ZHEN-02" : "SCI-01",
    sourceRefs: before.prose[index].source_refs,
    before: stringBinding(before.prose[index].text),
    authoredBeforeNativeReflow: stringBinding(authored.prose[index].text),
    after: stringBinding(normalized.prose[index].text),
    nativeReflowWhitespaceOnly: true,
    sourceTextUnchanged: true, literalMathTokensUnchanged: true,
  }));
  repairs.push({
    language, replacementOperations, changedBlocks: blockChanges,
    nativeTemplateDelta: {
      changedTextFields: changedBlocks.map((index) => `prose[${index}].text`),
      changedSectionAnchors: anchorBindings.filter(({ before, after }) =>
        before.before !== after.before || before.after !== after.after),
      allSevenConceptStartsPreserved: anchorBindings.map((item) => item.sourceRefs),
      paragraphIndicesBefore: beforeFlow.resolvedBreaks,
      paragraphIndicesAfter: flow.resolvedBreaks,
      paragraphCountBefore: beforeFlow.paragraphs.length,
      paragraphCountAfter: flow.paragraphs.length,
      titleUnchanged: true, printedTitleUnchanged: true,
      sourceAndAllOtherFieldsUnchanged: true,
    },
    reverseProof: {
      template: {
        expectedBefore: beforeBinding, after: template,
        reconstructedBeforeSha256: sha(jsonBytes(reversed)), exact: true,
      },
      normalizedText: {
        expectedBefore: frozen.prose, after: proseBinding,
        reconstructedBeforeSha256: sha(jsonBytes(reversedProse)), exact: true,
        differences: "Finding-bound prose text and native-derived paragraphs/section anchors only.",
      },
      markdown: {
        expectedBefore: frozen.markdown, after: markdown,
        reconstructedBeforeSha256: sha(markdownText(reversed)), exact: true,
        translatedHeadingAlreadyPresentAndRetained: language === "en",
      },
      exerciseAndFigureTemplates: copies,
    },
  });
  languages.push({
    language, templates: [template, ...copies.map((item) => item.after)],
    normalizedText: proseBinding, markdown, outline,
    paragraphCount: flow.paragraphs.length, sectionBreakCount: flow.resolvedBreaks.length,
    sourceObjects: 23, proseObjects: 17, figures: 3, exercises: 0,
    nativeCandidateTitle: normalized.title,
    nativeCandidatePrintedTitle: normalized.printed_title,
  });
}

const check = run("native-text-check", python, ["-B", out("validate-text.py"), "--check"]);
assert.equal(check.status, "pass");
assert.deepEqual(check.errors, []);
assert.ok(check.languages.every((item) => item.nativeIdentityErrors.length === 0));
const textCheck = save("text-check.json", check);
const en = languages.find((item) => item.language === "en");
const originalEn = freeze.frozen.find((item) => item.language === "en");
const originalEnTemplate = originalEn.templates.find((item) =>
  item.path.endsWith("/lesson.template.json"));
const enTemplate = en.templates.find((item) => item.path.endsWith("/lesson.template.json"));
const displayTitle = save("display-title.json", {
  schema: "ld-s10y-lesson/offline-display-title-binding@1",
  ticket: "STEMROBIN-181", card, language: "en", edition: "modern-us-neutral",
  status: "DISPLAY-ONLY-SIDECAR-FROZEN-AFFECTED-ZHEN-REVIEW-PENDING",
  finding: "ZHEN-01", review: reviewBinding,
  displayTitle: finding("ZHEN-01").replacementRecommended.enDisplayTitle,
  numberedHeading: finding("ZHEN-01").replacementRecommended.enNumberedDisplayTitle,
  displayCloneFields: {
    title: finding("ZHEN-01").replacementRecommended.enDisplayTitle,
    printed_title: finding("ZHEN-01").replacementRecommended.enNumberedDisplayTitle,
  },
  candidate: enTemplate, originalCandidate: originalEnTemplate,
  markdown: en.markdown, nativeTextCheck: textCheck,
  sourceLesson: freeze.raw3.find((item) => item.path.endsWith("/lesson.json")),
  sourceIdentity: { title: raw.title, printed_title: raw.printed_title },
  immutableBindingPatternReference: patterns.find((item) =>
    item.path.endsWith("/d040-bind-fig300-and-title.mjs")),
  separation: {
    nativeCandidateTitleAndPrintedTitleRawEqual: true,
    nativeCandidateIdentityException: false,
    nativeValidationMustPrecedeAnyDisplayClone: true,
    cloneOwner: "Parent workflow only, after its native validation.",
    cloneScope: "Isolated offline-display clone; title/printed_title only.",
    applySidecarDuringAdaptFinalize: false,
    applySidecarToCanonicalOrRaw: false,
    sourceDataAndSourceTextMustRemainUnchanged: true,
    noLanguageAwareDisplayFieldAddedToP2c: true,
    codeChange: false, displayCloneCreatedHere: false,
    offlineRenderPerformedHere: false,
  },
});
const reverseProof = save("reverse-diff-proof.json", {
  schema: "ld-s10y-lesson/finding-bound-text-reverse-diff@1",
  ticket: "STEMROBIN-181", card, authorFreeze: authorFreezeBinding, review: reviewBinding,
  status: "PASS-finding-only-text-repair-and-separated-display-binding",
  languages: repairs, displayTitle,
  nativeCandidateIdentityExceptions: [],
  allowedSubstantiveChanges: ["SCI-01 bilingual disclaimer", "ZHEN-02 EN many-times wording"],
  allowedDerivedChanges: [
    "Native whitespace reflow in the affected prose fields.",
    "SCI-01 EN following sentence initial a -> A after the exact replacement's terminal period; no other change to that qualification.",
    "Native paragraph indices and helper-resolved adjacent section anchors.",
    "ZHEN-01 separate translated-title/numbered-heading display sidecar; existing translated Markdown heading retained.",
  ],
  sourceDataChanged: false, sourceTextChanged: false,
  nativeTitleChanged: false, nativePrintedTitleChanged: false,
  raw3Changed: false, figureOrCaptionObjectsChanged: false,
});
verifyBindings(inputBindings);
const outputs = walk(owned).sort().map(bind);
const status = "AFFECTED-TEXT-REPAIR-FROZEN-NATIVE-TEXT-PASS-DISPLAY-SEPARATED-REVIEW-PENDING";
const repairFreeze = save("repair-freeze.json", {
  schema: "ld-s10y-lesson/bounded-text-repair-freeze@1",
  ticket: "STEMROBIN-181", card, date: "2026-11-17",
  frozenAt: new Date().toISOString(), status, ownedOutputRoot: owned,
  authorFreeze: authorFreezeBinding, review: reviewBinding,
  raw3: freeze.raw3, inputPreservation, languages, reverseProof, displayTitle, textCheck,
  replacements: repairs.map(({ language, replacementOperations }) => ({
    language, changes: replacementOperations,
  })),
  findingStatus: {
    "SCI-01": "Exact bilingual recommended disclaimer applied; affected SCI review pending.",
    "ZHEN-02": "Exact EN second-sentence recommendation applied; affected ZHEN review pending.",
    "ZHEN-01": "Translated title and numbered heading hash-bound in separate display-title.json and Markdown; raw-equal native candidate identity retained; affected ZHEN review pending.",
  },
  titleSeparation: {
    nativeContract: "edition.py requires raw equality for both title and printed_title.",
    candidateIdentityExceptions: [],
    revisedEnTitleAndPrintedTitleEqualRaw: true,
    displayBindingOnly: true, sidecarExcludedFromNativeCandidate: true,
    parentMayUseIsolatedDisplayOnlyCloneAfterNativeValidation: true,
    displayCloneCreated: false, canonicalOrRawMutation: false, codeChange: false,
    languageAwareNativeDisplayFieldExists: false,
    metadataCoverage: "Native source identity PASS; localized offline heading binding supplied separately, not a new native display field or whole-card approval.",
  },
  sourcePreservation: {
    allInputHashesRecheckedBeforeAndAfter: true,
    sourceDataAndFullSourceBindingsExact: true,
    sourceTextAndIdentityExactForAll23ObjectsInBothLanguages: true,
    sourceReferencesPreserved: true, frozenRaw3BytesPreserved: true,
    sourceNumbersAndFormulasChanged: 0, numericChanges: [], errata: [],
    retainedHistoricalTemperatures: ["753", "365", "1000", "below 100"],
    retainedHistoricalDates: ["1839", "1896"],
    historicalValuesNotReplacedOrNewlyEndorsed: true,
    sourceClosureEvidence: freeze.sourceClosure,
    sourceGateReplayed: false,
  },
  figureGeometry: {
    affected: false, figureTemplatesByteIdentical: true,
    figureAndCaptionObjectsUnchanged: true, sourceFigureBindingsUnchanged: true,
    graphicArtifactsWritten: 0, geometryAuthoredOrMeasured: false,
    sourceOrModernImagesOpened: 0, imagesDecoded: 0, renderPerformed: false,
    figureApprovalPerformed: false,
    status: "Separate modern-figure gate remains pending; hash equality is not visual approval.",
  },
  executionBoundaries: {
    sameResumedInvocation: true, onlyOwnedRootWritten: true,
    otherWorkerEditsPreserved: true, setupUpdateGrillPerformed: false,
    backendOperations: 0, gitOperations: 0, appOperations: 0,
    dependencyEdits: 0, charterEdits: 0, canonicalWrites: 0, databaseOperations: 0,
    sourceGateReplay: false, adaptPreparePerformed: false, adaptFinalizePerformed: false,
    renderPerformed: false, figureApprovalPerformed: false, externalMessages: 0,
    imagesOpened: 0, testsOrBuildRun: false,
  },
  approval: {
    affectedScienceReview: "pending", affectedBilingualReview: "pending",
    modernFigures: "pending-separate-gate", wholeCardApproved: false,
    publicationReleased: false, canonicalPromotionPerformed: false,
  },
  artifacts: outputs, excludesItselfFromArtifactHashes: true,
});
console.log(JSON.stringify({ ...repairFreeze, status }, null, 2));
