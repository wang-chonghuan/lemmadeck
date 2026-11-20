import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

const W = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
const T = ".intentfold/tickets/STEMROBIN-181/tmp";
const OUT = path.join(W, T, "d1816-d098-n128-layout-display-n129-affected-review");
assert.equal(process.cwd(), W);
const abs = (p) => path.isAbsolute(p) ? p : path.join(W, p);
const read = (p) => JSON.parse(fs.readFileSync(abs(p), "utf8"));
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
const strip = (s) => s.replace(/\s/gu, "");
const without = (obj, keys) => Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
const full = (doc) => doc.prose.map((b) => b.text).filter((s) => s.trim()).join("\n\n");
const math = (s) => [...s.matchAll(/\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])*\$/g)].map((m) => m[0]);
const outline = (doc) => {
  const rows = [];
  doc.prose.forEach((b, blockIndex) => {
    if (b.kind !== "p") return;
    b.text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean).forEach((text, paragraphInBlock) => {
      rows.push({index: rows.length, blockIndex, paragraphInBlock, text});
    });
  });
  return rows;
};
function boundaries(doc) {
  const rows = outline(doc);
  return doc.section_breaks.map((anchor) => {
    const matches = rows.slice(1).filter((row) =>
      row.text === anchor.after.trim() && rows[row.index - 1].text === anchor.before.trim());
    assert.equal(matches.length, 1, "anchor must identify one adjacent paragraph pair");
    const row = matches[0];
    return {index: row.index, blockIndex: row.blockIndex, paragraphInBlock: row.paragraphInBlock, ...anchor};
  });
}
function pointers(a, b, p = "") {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === "object" && typeof b === "object") {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => pointers(a[k], b[k], `${p}/${k}`));
  }
  return [{pointer: p, before: a, after: b}];
}
const f128 = read(`${T}/d1816-d090-n128-promotion/layout-display-author-freeze.json`);
const display = read(`${T}/d1816-d090-n128-display/result.json`);
const n128 = f128.records.map((r) => {
  const before = read(r.templateBefore.path);
  const after = read(r.templateAfter.path);
  const lesson = read(r.finalized[0].path);
  const audit = read(r.finalized[3].path);
  assert.equal(before.prose.length, 22);
  assert.equal(after.prose.length, 22);
  assert.deepEqual(before.source, after.source);
  assert.deepEqual(without(before, ["prose", "section_breaks"]), without(after, ["prose", "section_breaks"]));
  const textChanges = [];
  const cleared = [];
  const layoutTagsAdded = [];
  const blockProofs = after.prose.map((block, i) => {
    const old = before.prose[i];
    assert.deepEqual(without(old, ["text", "changes"]), without(block, ["text", "changes"]));
    assert.equal(strip(old.text), strip(block.text), `nonwhitespace prose ${r.locale}/${i}`);
    assert.deepEqual(math(old.text), math(block.text), `exact math spans ${r.locale}/${i}`);
    if (old.text !== block.text) textChanges.push(i);
    if (JSON.stringify(old.changes) !== JSON.stringify(block.changes)) {
      if (block.changes.length === 0) {
        assert.equal(block.text, block.source_text, "clear only genuinely unchanged source text");
        cleared.push(i);
      } else {
        assert.deepEqual(block.changes.filter((c) => c !== "layout"), old.changes);
        assert.ok(block.changes.includes("layout"));
        assert.notEqual(old.text, block.text);
        layoutTagsAdded.push(i);
      }
    }
    if (block.text === block.source_text) assert.deepEqual(block.changes, []);
    else assert.ok(block.changes.length > 0);
    return {
      index: i, kind: block.kind, sourceRefs: block.source_refs,
      beforeTextSHA256: hash(old.text), afterTextSHA256: hash(block.text),
      normalizedBeforeSHA256: hash(strip(old.text)), normalizedAfterSHA256: hash(strip(block.text)),
      nonWhitespaceExact: true, mathSpansExact: true, sourceAndMetadataExact: true,
    };
  });
  assert.deepEqual(textChanges, r.affectedLayout.whitespaceOnlyTextBlocks);
  assert.deepEqual(cleared, r.affectedLayout.unchangedTextChangesCleared);
  const bound = boundaries(after);
  assert.equal(bound.length, 3);
  assert.deepEqual(bound.map((b) => [b.blockIndex, b.paragraphInBlock]), [[3, 0], [14, 0], [21, 0]]);
  assert.deepEqual(bound.map(({index, before, after}) => ({index, before, after})), audit.resolvedSectionBreaks);
  const paragraphCount = outline(after).length;
  const figures = after.prose.filter((b) => b.kind === "fig");
  const captions = after.prose.filter((b) => b.kind === "cap");
  assert.equal(figures.length, 2);
  assert.equal(captions.length, 2);
  assert.equal(paragraphCount, r.locale === "zh" ? 23 : 19);
  assert.equal(paragraphCount + figures.length + captions.length, r.fullDisplayEntries);
  assert.equal(after.exercise_count, 0);
  assert.equal(audit.status, "pass");
  assert.deepEqual(pointers(after, lesson).map((p) => p.pointer), ["/status"]);
  assert.equal(lesson.status, "ready");
  const affectedPass = read(f128.affectedSCIAndLocalesReview.path);
  const passTarget = affectedPass.verdicts[r.locale.toUpperCase()].target;
  const reviewedText = read(passTarget.path);
  assert.deepEqual(after.source, reviewedText.source);
  assert.deepEqual(after.prose.map((b) => strip(b.text)), reviewedText.prose.map((b) => strip(b.text)));
  return {
    locale: r.locale, before: r.templateBefore, after: r.templateAfter,
    normalizedWholeTextSHA256: hash(strip(full(after))), blockProofs, whitespaceOnlyTextBlocks: textChanges,
    unchangedTextChangesCleared: cleared, machineDerivedBoundaries: bound,
    layoutTagsAdded,
    rawEntries: after.prose.length, paragraphs: paragraphCount, displayEntries: r.fullDisplayEntries,
    figures: figures.length, captions: captions.length, exercises: 0,
    exactSourceSnapshotAndRefs: true, D095ReviewedProseNormalizedExact: true,
    templateToFinalizedDifferenceOnlyReadyStatus: true, status: "PASS",
  };
});
const contexts128 = f128.figures.map((f) => {
  const before = read(f.before[0].path);
  const spec = read(f.spec.path);
  const strippedBefore = structuredClone(before);
  const strippedAfter = structuredClone(spec);
  delete strippedBefore.source.authoritativeText;
  delete strippedAfter.source.authoritativeText;
  assert.deepEqual(strippedBefore, strippedAfter, "no geometry/spec change beyond complete context");
  for (const r of f128.records) {
    const template = read(r.templateAfter.path);
    const currentText = spec.source.authoritativeText.filter((t) => t.lesson === template.id && t.edition === r.edition);
    const oldText = before.source.authoritativeText.filter((t) => t.lesson === template.id && t.edition === r.edition);
    assert.equal(currentText.length, 1);
    assert.equal(oldText.length, 1);
    assert.equal(currentText[0].text, full(template));
    assert.equal(strip(oldText[0].text), strip(currentText[0].text));
  }
  const oldRender = read(f.before[1].path);
  const render = read(f.render.path);
  assert.deepEqual(without(oldRender, ["spec", "output"]), without(render, ["spec", "output"]));
  assert.equal(oldRender.output.svg.sha256, render.output.svg.sha256);
  assert.equal(render.output.svg.sha256, f.svg.sha256);
  assert.equal(render.spec.sha256, f.spec.sha256);
  const review = read(f.review.path);
  assert.equal(review.spec.sha256, f.spec.sha256);
  assert.equal(review.render.sha256, f.render.sha256);
  assert.equal(review.outputs.svg.sha256, f.svg.sha256);
  assert.equal(review.status, "pass");
  return {
    id: f.id, locale: f.locale, spec: f.spec, render: f.render, review: f.review, svg: f.svg,
    completeZHAndENTextExact: true, onlyContextWhitespaceChanged: true,
    geometryAllOtherSpecFieldsExact: true, svgByteIdenticalToPreRecoveryRenderBinding: true,
    unchangedRenderMeasurementsAndOutputs: true, metadataHashesCurrent: true,
    graphicalApproval: "D089_PASS_REUSED_NO_NEW_APPROVAL", status: "PASS",
  };
});
const savedMedia = display.records.map((r) => {
  assert.equal(r.status, "pass");
  assert.equal(r.geometry.width, r.viewport.width);
  assert.equal(r.sourceBlocks, 22);
  assert.equal(r.emptyExercisesChecked, true);
  const a = r.figureChecks.find((f) => f.id === "fig-290");
  const b = r.figureChecks.find((f) => f.id === "fig-291");
  assert.equal(a.width, 640);
  assert.equal(a.scrollEndReachable, true);
  assert.ok(Math.min(...a.labelSizes) >= 16);
  assert.equal(b.width, r.viewport.name === "mobile" ? 358 : 640);
  assert.ok(Math.min(...b.labelSizes) >= 16);
  return {
    locale: r.locale, viewport: r.viewport, screenshot: r.screenshot,
    figure290: {width: a.width, minimumLabelPx: Math.min(...a.labelSizes), scrollEndReachable: a.scrollEndReachable},
    figure291: {width: b.width, minimumLabelPx: Math.min(...b.labelSizes)},
    evidence: "SAVED_DOM_MEASUREMENTS_ONLY_NOT_RERUN", status: "PASS",
  };
});
const f129 = read(`${T}/d1816-d096-n129-affected-author/author-freeze.json`);
const proposal = read(`${T}/d1816-d096-n129-affected-author/proposed-corrected-text.json`);
const decision = read(`${T}/d1816-d096-n129-affected-author/source-bound-registration-decision.json`);
const n129 = f129.candidateBindings.filter((b) => b.kind === "lesson.template.json").map((binding) => {
  const before = read(binding.before.path);
  const candidate = read(binding.candidate.path);
  const differences = pointers(before, candidate);
  assert.deepEqual(differences.map((d) => d.pointer).sort(),
    ["/prose/11/text", "/prose/12/text", "/section_breaks/2/after"].sort());
  assert.deepEqual(candidate.source, before.source);
  const rows = boundaries(candidate);
  const captured = read(`${T}/d1816-d096-n129-affected-author/prose-flow-${binding.locale}.json`);
  assert.deepEqual(rows.map(({index, before, after}) => ({index, before, after})), captured.boundaries);
  const records = proposal.records.filter((r) => r.locale === binding.locale).map((r) => {
    const i = Number(r.pointer.split("/")[2]);
    assert.equal(candidate.prose[i].text, r.replacement);
    assert.equal(before.prose[i].text, r.original);
    const d = decision.records.find((d) => d.locale === r.locale && d.pointer === r.pointer);
    const raw = read(d.rawLesson.path);
    assert.equal(candidate.prose[i].source_text, raw.prose[i].text);
    assert.equal(candidate.prose[i].source_text, d.sourcePageBlockOriginal);
    assert.deepEqual(candidate.prose[i].source_refs, [r.sourceRef]);
    assert.equal(hash(candidate.prose[i].text), d.candidateTextSHA256);
    assert.deepEqual(math(before.prose[i].text), math(candidate.prose[i].text));
    assert.equal(d.registered, false);
    return {
      repairId: r.repairId, locale: r.locale, sourceRef: r.sourceRef, pointer: r.pointer,
      candidate: r.candidate, textSHA256: hash(r.replacement),
      sourceTextAndRefsExact: true, formulaTokensUnchanged: true,
      proposalMechanicalBinding: "PASS", supportedRegistration: "HOLD",
    };
  });
  return {
    locale: binding.locale, before: binding.before, candidate: binding.candidate,
    changedPointers: differences, machineDerivedBoundaries: rows,
    unchangedOtherProseBlocks: 11, originalRawEntries: 13,
    sourceSnapshotSourceTextRefsExact: true, noInventedChangesTokens: true, records, status: "PASS",
  };
});
const contexts129 = f129.candidateBindings.filter((b) => b.kind === "localeContext").map((b) => {
  const context = read(b.candidate.path);
  const binding = f129.candidateBindings.find((x) => x.kind === "lesson.template.json" && x.locale === b.locale);
  const candidate = read(binding.candidate.path);
  const complete = [candidate.title, ...candidate.prose.map((p) => p.text)].join("\n\n");
  assert.equal(context.completeEditionText, complete);
  assert.equal(context.template.sha256, binding.candidate.sha256);
  const specBinding = f129.candidateBindings.find((x) => x.kind === "spec" && x.locale === b.locale && x.figure === b.figure);
  const spec = read(specBinding.candidate.path);
  assert.equal(context.spec.sha256, specBinding.candidate.sha256);
  const expected = spec.source.authoritativeText.filter((x) => x.locale === b.locale && x.lesson === candidate.id);
  assert.equal(expected.length, 1);
  assert.equal(expected[0].text, complete);
  const oldSpec = read(specBinding.before.path);
  const strippedBefore = structuredClone(oldSpec);
  const strippedAfter = structuredClone(spec);
  delete strippedBefore.source.authoritativeText;
  delete strippedAfter.source.authoritativeText;
  assert.deepEqual(strippedBefore, strippedAfter);
  const svgBinding = f129.candidateBindings.find((x) => x.kind === "svg" && x.locale === b.locale && x.figure === b.figure);
  assert.equal(svgBinding.before.sha256, svgBinding.candidate.sha256);
  return {
    figure: b.figure, locale: b.locale, binding: b.candidate, spec: specBinding.candidate,
    completeProposedTextExact: true, geometryAllOtherSpecFieldsUnchanged: true,
    svg: svgBinding.candidate, svgByteIdentical: true,
    status: "PASS_CONTEXT_ONLY", graphicApproval: b.figure === "fig-294" ? "HOLD_REUSED" : "D091_PASS_REUSED",
  };
});
assert.equal(contexts129.length, 6);
assert.equal(decision.legitimateExistingRegistrationRoute, false);
assert.equal(decision.mathErrataRouteUsed, false);
const output = {
  reviewer: "D098", workdir: W, capturedAt: new Date().toISOString(),
  method: "Read-only structured comparisons; independent derivation from captured text. No native pipeline, renderer, DOM, scientific or graphical stage rerun.",
  n128, contexts128, savedMedia, n129, contexts129,
  registration: {status: "HOLD", supportedRoute: false, parserPermissivenessIsNotAuthorization: true},
  status: "PASS_STRUCTURE_SCOPES_ONLY",
};
fs.writeFileSync(path.join(OUT, "structure-result.json"), `${JSON.stringify(output, null, 2)}\n`, {flag: "wx"});
console.log(JSON.stringify({
  n128: n128.map((r) => ({locale: r.locale, status: r.status, paragraphs: r.paragraphs,
    displayEntries: r.displayEntries, boundaries: r.machineDerivedBoundaries.map((b) => b.index)})),
  n128ContextBindings: contexts128.length, mediaSurfaces: savedMedia.length,
  n129ProposedLocaleBindings: n129.length, n129ContextBindings: contexts129.length,
  registration: output.registration,
}, null, 2));
