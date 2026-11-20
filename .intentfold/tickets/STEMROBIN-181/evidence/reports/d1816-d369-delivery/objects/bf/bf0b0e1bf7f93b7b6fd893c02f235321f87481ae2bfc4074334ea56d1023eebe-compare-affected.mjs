import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";
import {isDeepStrictEqual as equal} from "node:util";

const root = process.cwd();
const prefix = ".intentfold/tickets/STEMROBIN-181/tmp";
const own = path.join(root, prefix, "d1816-d367-n149-layout-context-review");
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const compact = text => text.replace(/\s/g, "");
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bind = p => {
  const absolute = path.resolve(root, p);
  const bytes = fs.readFileSync(absolute);
  return {path: absolute, bytes: bytes.length, sha256: digest(bytes)};
};
const freeze = read(path.join(own, "input-freeze.json"));
const manifest = read(freeze.manifest.path);
const rawPath = ".tmp/STEMROBIN-181/d1816-d337/root/10p/lessons/phy10-c3-s4-n149/lesson.json";
const raw = read(rawPath);
const locales = manifest.changes.map(item => ({
  ...item, beforeData: read(item.beforeSnapshot.path), afterData: read(item.afterSnapshot.path)
}));
function differences(a, b, location = "") {
  if (equal(a, b)) return [];
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return [{path: location, before: a, after: b}];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(k => differences(a[k], b[k], `${location}/${k}`));
}
const normalizeCommand = [
  ".claude/skills/ld-s10y-lesson/.venv/bin/python",
  path.join(own, "normalize-only.py")
];
const normalizeStart = new Date().toISOString();
const normalized = spawnSync(normalizeCommand[0], normalizeCommand.slice(1), {
  cwd: root, encoding: "utf8",
  env: {...process.env, PYTHONDONTWRITEBYTECODE: "1"},
  input: JSON.stringify({locales: locales.map(l => ({locale: l.locale, before: l.beforeData, after: l.afterData}))})
});
const normalizationReceipt = {
  command: normalizeCommand,
  cwd: root,
  startedAtUtc: normalizeStart,
  finishedAtUtc: new Date().toISOString(),
  exitCode: normalized.status,
  error: normalized.error?.message ?? null,
  stderr: normalized.stderr,
  stdoutSha256: digest(normalized.stdout ?? ""),
  result: normalized.status === 0 ? JSON.parse(normalized.stdout) : null,
  imageOpens: 0,
  producerCalls: 0,
  bytecodeWritesDisabled: true
};
fs.writeFileSync(path.join(own, "normalization.receipt.json"), JSON.stringify(normalizationReceipt, null, 2) + "\n", {flag: "wx"});
const earlierFigure = read(`${prefix}/d1816-d355-fig277-first-review/report.json`);
const earlierReview = read(`${prefix}/d1816-d347-n149-affected-text-review/review-freeze.json`);
function frozenPriorMatch(p) {
  const b = earlierReview.files.find(item => item.path === path.resolve(root, p));
  return Boolean(b && bind(p).sha256 === b.sha256);
}
const localeObservations = locales.map(item => {
  const before = item.beforeData;
  const after = item.afterData;
  const command = ["node", ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs", "--json", item.working.path];
  const startedAtUtc = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {cwd: root, encoding: "utf8"});
  const flow = result.status === 0 ? JSON.parse(result.stdout) : null;
  const receiptPath = path.join(own, `${item.locale}.prose-flow.receipt.json`);
  const receipt = {
    command, cwd: root, startedAtUtc, finishedAtUtc: new Date().toISOString(),
    exitCode: result.status, error: result.error?.message ?? null, stderr: result.stderr,
    template: bind(item.working.path),
    stdoutSha256: digest(result.stdout ?? ""),
    flow,
    imageOpens: 0,
    producerCalls: 0
  };
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + "\n", {flag: "wx"});
  const oldFlowPath = `${prefix}/d1816-d347-n149-affected-text-review/${item.locale}.prose-flow.json`;
  const oldFlow = read(oldFlowPath);
  const offsetAt = (f, boundary) => f.paragraphs.slice(0, boundary.index).reduce((sum, p) => sum + compact(p.text).length, 0);
  const boundaryChecks = after.section_breaks.map((anchor, index) => {
    const old = oldFlow.boundaries.find(b => b.before === before.section_breaks[index].before && b.after === before.section_breaks[index].after);
    const matching = flow?.boundaries.filter(b => b.before === anchor.before && b.after === anchor.after) ?? [];
    const current = matching[0];
    return {
      conceptBoundary: index,
      beforeIndex: old?.index ?? null,
      afterIndex: current?.index ?? null,
      beforeCompactOffset: old ? offsetAt(oldFlow, old) : null,
      afterCompactOffset: current ? offsetAt(flow, current) : null,
      currentUniqueAdjacentPair: matching.length === 1 && flow.paragraphs[current.index - 1]?.text === anchor.before && flow.paragraphs[current.index]?.text === anchor.after,
      unchangedCompactTextPosition: Boolean(old && current && offsetAt(oldFlow, old) === offsetAt(flow, current)),
      currentAnchor: anchor
    };
  });
  const changes = differences(before, after);
  const changedProseIndices = before.prose.flatMap((p, i) => p.text === after.prose[i].text ? [] : [i]);
  const formula = text => [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map(m => m[1] ?? m[2]);
  const digits = text => [...text.matchAll(/\d+(?:\.\d+)?/g)].map(m => m[0]);
  const perBlock = after.prose.map((p, entry) => {
    const old = before.prose[entry];
    const origin = raw.prose[entry];
    return {
      entry,
      sourceRefs: p.source_refs,
      sourceTextExactlyRaw: p.source_text === origin.text,
      sourceRefsExactlyRaw: equal(p.source_refs, origin.source_refs),
      protectedEntryMetadataUnchanged: equal(Object.fromEntries(Object.entries(old).filter(([k]) => k !== "text")), Object.fromEntries(Object.entries(p).filter(([k]) => k !== "text"))),
      compactTextUnchanged: compact(old.text) === compact(p.text),
      formulaBodiesUnchanged: equal(formula(old.text), formula(p.text)),
      digitSequenceUnchanged: equal(digits(old.text), digits(p.text)),
      modernTextChanged: old.text !== p.text
    };
  });
  const permittedPaths = new Set(["/prose/4/text", "/prose/17/text"]);
  if (item.locale === "zh") permittedPaths.add("/printed_title");
  for (let i = 0; i < 4; i++) {
    permittedPaths.add(`/section_breaks/${i}/before`);
    permittedPaths.add(`/section_breaks/${i}/after`);
  }
  const affectedSources = [4, 17].map(entry => ({
    entry,
    rawText: raw.prose[entry].text,
    pageBlocks: raw.prose[entry].source_refs.map(ref => {
      const [, page, block] = ref.match(/^p(\d+)#(\d+)$/);
      const pagePath = `.tmp/STEMROBIN-181/d1816-d337/root/10p/pages/${page}/page.json`;
      const data = read(pagePath).blocks[Number(block) - 1];
      return {ref, page: bind(pagePath), originalBlock: data, matchesRawIgnoringWhitespace: compact(data.lines.join("")) === compact(raw.prose[entry].text)};
    })
  }));
  return {
    locale: item.locale,
    beforeSnapshot: bind(item.beforeSnapshot.path),
    afterSnapshot: bind(item.afterSnapshot.path),
    working: bind(item.working.path),
    currentWorkingBytesEqualAfterSnapshot: fs.readFileSync(item.working.path).equals(fs.readFileSync(item.afterSnapshot.path)),
    beforeMatchesD355ReviewedText: bind(item.beforeSnapshot.path).sha256 === earlierFigure.inputs[item.locale === "zh" ? "currentZH" : "currentEN"].sha256,
    beforeMatchesD347ApprovedAfter: earlierReview.files.some(b => b.path.endsWith(`d1816-d343-n149-text-repair/${item.locale}.after.template.json`) && b.sha256 === bind(item.beforeSnapshot.path).sha256),
    sourceSnapshotsUnchangedAndExactRaw: equal(before.source, after.source) && equal(after.source.data, raw) && after.source.sha256 === bind(rawPath).sha256,
    fixedMetadataUnchanged: equal(Object.fromEntries(Object.entries(before).filter(([k]) => !["prose", "section_breaks", ...(item.locale === "zh" ? ["printed_title"] : [])].includes(k))), Object.fromEntries(Object.entries(after).filter(([k]) => !["prose", "section_breaks", ...(item.locale === "zh" ? ["printed_title"] : [])].includes(k)))),
    zhPrintedTitleExactSource: item.locale === "zh" ? after.printed_title === raw.printed_title : null,
    changedProseIndices,
    onlyAllowedFieldsChanged: changes.every(d => permittedPaths.has(d.path)),
    exactDifferences: changes,
    perBlock,
    affectedSources,
    normalization: normalizationReceipt.result?.results.find(r => r.locale === item.locale) ?? null,
    oldFlow: {binding: bind(oldFlowPath), matchesPriorFreeze: frozenPriorMatch(oldFlowPath), paragraphCount: oldFlow.paragraphs.length},
    currentFlow: {receipt: bind(receiptPath), exitCode: result.status, paragraphCount: flow?.paragraphs.length ?? null, resolvedBreaks: flow?.resolvedBreaks ?? []},
    boundaryChecks,
    affectedFinalParagraphs: flow?.paragraphs.filter(p => [4, 17].includes(p.blockIndex)) ?? []
  };
});
const oldSpec = read(manifest.oldSpec.path);
const currentSpec = read(manifest.currentSpec.path);
const expectedText = locales.flatMap(item => [
  ...["chapter", "title", "printed_title"].filter(k => typeof item.afterData[k] === "string" && item.afterData[k].trim()).map(k => ({lesson: `${manifest.lesson}/${item.edition}/${k}`, text: item.afterData[k]})),
  ...item.afterData.prose.flatMap((p, i) => typeof p.text === "string" && p.text.trim() ? [{lesson: `${manifest.lesson}/${item.edition}/prose/${String(i + 1).padStart(3, "0")}`, text: p.text}] : [])
]);
const sourceWithoutAllowed = spec => {
  const clone = structuredClone(spec);
  delete clone.source.authoritativeText;
  delete clone.source.image.path;
  return clone;
};
const textChanges = oldSpec.source.authoritativeText.flatMap((old, i) => equal(old, currentSpec.source.authoritativeText[i]) ? [] : [{
  index: i, lesson: old.lesson, before: old.text, after: currentSpec.source.authoritativeText[i]?.text,
  identityUnchanged: old.lesson === currentSpec.source.authoritativeText[i]?.lesson,
  whitespaceOnly: compact(old.text) === compact(currentSpec.source.authoritativeText[i]?.text ?? "")
}]);
const expectedChangedContextIds = new Set([
  `${manifest.lesson}/modern-us-neutral/printed_title`,
  ...locales.flatMap(l => [4, 17].map(i => `${manifest.lesson}/${l.edition}/prose/${String(i + 1).padStart(3, "0")}`))
]);
const oldImage = bind(oldSpec.source.image.path);
const currentImage = bind(currentSpec.source.image.path);
const outputSvg = earlierFigure.inputs.svg;
const svg = bind(outputSvg.path);
const figure = {
  oldSpec: bind(manifest.oldSpec.path),
  currentSpec: bind(manifest.currentSpec.path),
  oldSpecMatchesD355: bind(manifest.oldSpec.path).sha256 === earlierFigure.inputs.spec.sha256,
  allOtherSpecFieldsExactlyUnchanged: equal(sourceWithoutAllowed(oldSpec), sourceWithoutAllowed(currentSpec)),
  objectsExactlyUnchanged: equal(oldSpec.objects, currentSpec.objects),
  assertionsExactlyUnchanged: equal(oldSpec.assertions, currentSpec.assertions),
  inventoryExactlyUnchanged: equal(oldSpec.source.inventory, currentSpec.source.inventory),
  canvasDisplayLayoutExactlyUnchanged: ["canvas", "display", "layout"].every(k => equal(oldSpec[k], currentSpec[k])),
  completeAuthoritativeTextExactlyCurrentTemplates: equal(currentSpec.source.authoritativeText, expectedText),
  authoritativeTextCount: currentSpec.source.authoritativeText.length,
  authoritativeTextChanges: textChanges,
  onlyFiveExpectedContextEntriesChanged: textChanges.length === 5 && textChanges.every(c => expectedChangedContextIds.has(c.lesson) && c.identityUnchanged && (c.lesson.endsWith("/printed_title") || c.whitespaceOnly)),
  zhContextPrintedTitleMatchesRaw: currentSpec.source.authoritativeText.find(t => t.lesson === `${manifest.lesson}/modern-us-neutral/printed_title`)?.text === raw.printed_title,
  oldImage,
  currentImage,
  sourceImageShaUnchanged: oldSpec.source.image.sha256 === currentSpec.source.image.sha256,
  oldAndCanonicalPNGHashesIdenticalAndMatchDeclared: oldImage.sha256 === currentImage.sha256 && currentImage.sha256 === currentSpec.source.image.sha256,
  sourceImageIsDurableCanonicalPath: currentSpec.source.image.path === "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-277.png",
  svg,
  svgMatchesD344AndD355: svg.sha256 === outputSvg.sha256 && svg.sha256 === "6b0c6a23ab2aed07915ea67ef129110c42db6c847b7785d6507c50a10e2213b1",
  changedPaths: differences(oldSpec, currentSpec).map(d => d.path)
};
const observations = {
  schema: "stemrobin181/affected-layout-context-observations@1",
  stage: "D367",
  observedAtUtc: new Date().toISOString(),
  inputFreeze: bind(path.join(own, "input-freeze.json")),
  normalizationReceipt: bind(path.join(own, "normalization.receipt.json")),
  localeObservations,
  figure,
  sourceRaw: bind(rawPath),
  sourceExercises: bind(".tmp/STEMROBIN-181/d1816-d337/root/10p/lessons/phy10-c3-s4-n149/exercises.json"),
  D347ReportMatchesPriorReviewFreeze: frozenPriorMatch(`${prefix}/d1816-d347-n149-affected-text-review/report.json`),
  D337FailureRetained: bind(manifest.originalNativeFailure.path),
  priorScienceRejudged: false,
  geometryRecomputed: false,
  imagesOpened: 0,
  producerCalls: 0,
  currentProseFlowCalls: 2,
  actualNormalizerBatchCalls: 1
};
fs.writeFileSync(path.join(own, "comparison-observations.json"), JSON.stringify(observations, null, 2) + "\n", {flag: "wx"});
console.log(JSON.stringify({
  locales: localeObservations.map(l => ({
    locale: l.locale,
    changes: l.changedProseIndices,
    onlyAllowedFieldsChanged: l.onlyAllowedFieldsChanged,
    sourceSnapshotsExact: l.sourceSnapshotsUnchangedAndExactRaw,
    actualNormalization: l.normalization,
    oldParagraphCount: l.oldFlow.paragraphCount,
    newParagraphCount: l.currentFlow.paragraphCount,
    breaks: l.boundaryChecks.map(b => ({before: b.beforeIndex, after: b.afterIndex, oldOffset: b.beforeCompactOffset, newOffset: b.afterCompactOffset, samePosition: b.unchangedCompactTextPosition}))
  })),
  figure: {
    allOtherFieldsUnchanged: figure.allOtherSpecFieldsExactlyUnchanged,
    fullCurrentTextMatches: figure.completeAuthoritativeTextExactlyCurrentTemplates,
    onlyFiveExpectedTextEntries: figure.onlyFiveExpectedContextEntriesChanged,
    pngHashMatches: figure.oldAndCanonicalPNGHashesIdenticalAndMatchDeclared,
    svgHashMatches: figure.svgMatchesD344AndD355,
    changedPaths: figure.changedPaths
  },
  output: bind(path.join(own, "comparison-observations.json"))
}, null, 2));
