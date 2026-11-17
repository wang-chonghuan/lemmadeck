import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {
  root, ticket, evidence, indexPath, collections, records, absolute, relative,
  read, bytes, bind, hash, verify, exists, immutableWrite, walk, lookup,
} from './retain-d016-evidence.mjs';

// Prepared only. CLI: --execute n127|n130 --native-sha SHA --display-sha SHA
// --review-sha SHA --science-sha SHA --freeze-sha SHA [--affected-science-sha SHA].
// n127 --emphasis-repair-sha SHA selects the repaired freeze (also --freeze-sha),
// new native/four-text display/review, and --affected-science-sha binding-only review.
// n130 additionally requires --source318-consumed-sha SHA after canonical consumption.
export const raw = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
export const modern = `${raw}/editions/modern-us-neutral`;
export const preservationPath = `${ticket}/tmp/d032-start/preservation.json`;
export const encode = value => `${JSON.stringify(value, null, 2)}\n`;
export const pass = status => typeof status === 'string' && /^PASS(?:$|-)/.test(status);
export const same = (left, right) => relative(left) === relative(right);

export function options(names) {
  const { values, positionals } = parseArgs({
    options: { execute: { type: 'boolean' },
      ...Object.fromEntries(names.map(name => [name, { type: 'string' }])) },
    allowPositionals: true, strict: true,
  });
  assert.equal(values.execute, true, 'Preparation is not authorization to execute.');
  assert.equal(positionals.length, 1);
  assert.ok(['n127', 'n130'].includes(positionals[0]));
  for (const [key, value] of Object.entries(values))
    if (key !== 'execute') assert.match(value, /^[a-f0-9]{64}$/, key);
  return { short: positionals[0], values };
}

// Walk bound objects, never directories named by a shared source report.
export function bindings(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    for (const item of value) bindings(item, output);
    return output;
  }
  const sha256 = value.sha256 ?? value.fileSha256 ?? value.observedSha256;
  const workspacePath = typeof value.path === 'string'
    && /^(?:\.tmp\/|\.intentfold\/|ssot-resources\/|\.claude\/|\.agents\/|AGENTS\.md$|\/Users\/)/.test(value.path);
  if (workspacePath && /^[a-f0-9]{64}$/.test(sha256 ?? ''))
    output.push({ path: relative(value.path), sha256 });
  for (const [key, item] of Object.entries(value)) {
    if (['before', 'protectedFiles', 'preservation', 'preservedFiles',
      'originalPath', 'original', 'requestedInputs'].includes(key)) continue;
    if (item && typeof item === 'object') bindings(item, output);
  }
  return output;
}

function boundTo(document, binding) {
  return bindings(document).some(row => same(row.path, binding.path) && row.sha256 === binding.sha256);
}

const surfaceId = row => row.surface ?? row.id;
const displaySurfaces = ['zh', 'en'].flatMap(language => ['text', 'exercises'].flatMap(kind =>
  ['1440x960', '390x844'].map(viewport => `${language}-${kind}-${viewport}`))).sort();
const textSurfaces = displaySurfaces.filter(id => id.includes('-text-'));
const exerciseSurfaces = displaySurfaces.filter(id => id.includes('-exercises-'));

function exactSurfaces(rows, expected = displaySurfaces) {
  assert.ok(Array.isArray(rows));
  assert.equal(rows.length, expected.length);
  assert.deepEqual(rows.map(surfaceId).sort(), expected);
}

function guardMechanicalDisplay(display, nativeBinding, expected = displaySurfaces) {
  assert.equal(display.status, 'PASS-mechanical-independent-display-review-pending');
  assert.ok(boundTo(display.nativeResult, nativeBinding));
  assert.deepEqual(display.failures, []);
  assert.equal(display.execution.browserLaunches, 1);
  assert.equal(display.execution.nativeRerenders, 0);
  assert.equal(display.execution.browserClosed, true);
  exactSurfaces(display.surfaces, expected);
  exactSurfaces(display.screenshots, expected);
  for (const row of display.surfaces) {
    assert.ok(pass(row.status));
    assert.equal(row.endReachable, true);
    assert.deepEqual(row.failures, []);
    assert.deepEqual(row.observed.cutoffs, []);
    assert.deepEqual(row.observed.collisions, []);
    assert.equal(row.observed.media, 0);
    assert.equal(row.observed.exerciseBodies, 0);
  }
}

async function guardEmphasisScience(freeze, effectiveScience) {
  const base = `${ticket}/tmp/d035-n127`;
  assert.ok(same(freeze.precedingScienceRepair.path, `${base}-science-repair/repair-freeze.json`));
  assert.ok(same(freeze.precedingEffectiveScience.path, `${base}-science-affected-review.json`));
  for (const binding of [freeze.precedingScienceRepair, freeze.precedingEffectiveScience])
    await verify(binding.path, binding.sha256);
  const precedingFreeze = await read(freeze.precedingScienceRepair.path);
  const precedingScience = await read(freeze.precedingEffectiveScience.path);
  assert.equal(precedingFreeze.card, freeze.card);
  assert.equal(precedingScience.card, freeze.card);
  assert.equal(precedingScience.SCI.status, 'PASS');
  assert.equal(precedingScience.ZHEN.status, 'PASS');
  assert.ok(boundTo(precedingScience, freeze.precedingScienceRepair));
  assert.ok(boundTo(precedingScience, freeze.originalScienceReview));
  assert.equal(effectiveScience.schema, 's10y-emphasis-binding-science-bilingual-review@1');
  assert.equal(effectiveScience.status, 'complete-emphasis-binding-only-immutable');
  assert.equal(effectiveScience.review_completed, true);
  assert.equal(effectiveScience.immutable_completion, true);
  assert.ok(boundTo(effectiveScience, freeze.precedingEffectiveScience));
  assert.ok(boundTo(effectiveScience, freeze.precedingScienceRepair));
  assert.equal(effectiveScience.SCI.substantive_science_rereview, false);
  assert.equal(effectiveScience.ZHEN.substantive_bilingual_rereview, false);
  assert.equal(effectiveScience.approval_boundaries.fresh_full_review, false);
  assert.equal(effectiveScience.execution.scientific_or_bilingual_substantive_replays, 0);
  assert.equal(effectiveScience.execution.render_or_native_gate_replays, 0);
  assert.equal(effectiveScience.execution.new_image_opens, 0);
  assert.equal(effectiveScience.scope.source_objects, freeze.sourceObjects);
  assert.deepEqual(effectiveScience.scope.newly_affected_prose_indices, [1]);
  assert.deepEqual(effectiveScience.scope.prior_science_affected_prose_indices, [2]);
  for (const key of ['originalAuthor', 'originalScienceReview', 'preparation', 'source',
    'exercisesSource', 'closure', 'sourceObjects', 'sourceTasks', 'sourceFigures'])
    assert.deepEqual(freeze[key], precedingFreeze[key], `Inherited repair binding drift: ${key}`);
  assert.equal(freeze.sourceObjects, 4);
  assert.deepEqual(precedingFreeze.changedProseIndices, [2]);
  assert.deepEqual(freeze.priorScienceChangedProseIndices, [2]);
  assert.deepEqual(freeze.changedProseIndices, [1, 2]);
  assert.deepEqual(freeze.newlyAffectedProseIndices, [1]);
  assert.equal(freeze.substantiveScienceChangedByThisRepair, false);
  assert.equal(freeze.mathNumbersUnitsAndPlainMeaningChangedByThisRepair, false);
  assert.equal(freeze.sourceFigureOrTaskChanges, 0);
  assert.equal(freeze.sourceGateReplayed, false);
  for (const key of ['exercisesTemplate', 'figuresTemplate'])
    assert.deepEqual(freeze.frozenFiles[key], precedingFreeze.frozenFiles[key]);
  assert.equal(freeze.comparisons.length, 2);
  assert.deepEqual(freeze.comparisons.map(row => row.language).sort(), ['en', 'zh']);
  assert.equal(effectiveScience.comparisons.length, 2);
  assert.deepEqual(effectiveScience.comparisons.map(row => row.language).sort(), ['en', 'zh']);
  const plain = text => text.replaceAll('**', '').replace(/\s+/g, '');
  const math = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
    .map(match => match[1] ?? match[2]);
  for (const [key, language] of [['lessonTemplate', 'zh'], ['englishLesson', 'en']]) {
    const beforeBinding = precedingFreeze.frozenFiles[key];
    const afterBinding = freeze.frozenFiles[key];
    await verify(beforeBinding.path, beforeBinding.sha256);
    await verify(afterBinding.path, afterBinding.sha256);
    assert.ok(boundTo(precedingScience, beforeBinding));
    const before = await read(beforeBinding.path);
    const after = await read(afterBinding.path);
    const { prose: beforeProse, section_breaks: beforeBreaks, ...beforeMetadata } = before;
    const { prose: afterProse, section_breaks: afterBreaks, ...afterMetadata } = after;
    assert.deepEqual(afterMetadata, beforeMetadata, `Unrelated emphasis metadata: ${key}`);
    assert.equal(beforeProse.length, 4);
    assert.equal(afterProse.length, 4);
    for (let index = 0; index < 4; index++) {
      if (index !== 1) {
        assert.deepEqual(afterProse[index], beforeProse[index], `Unrelated emphasis prose: ${key}/${index}`);
        continue;
      }
      const { text: beforeText, ...beforeRow } = beforeProse[index];
      const { text: afterText, ...afterRow } = afterProse[index];
      assert.deepEqual(afterRow, beforeRow);
      assert.equal(plain(afterText), plain(beforeText), `Emphasis changed plain meaning: ${key}`);
      assert.deepEqual(math(afterText), math(beforeText), `Emphasis changed math: ${key}`);
    }
    const comparison = freeze.comparisons.find(row => row.language === language);
    const scienceComparison = effectiveScience.comparisons.find(row => row.language === language);
    assert.ok(boundTo(scienceComparison.prior_input, beforeBinding));
    assert.ok(boundTo(scienceComparison.current_input, afterBinding));
    assert.deepEqual(scienceComparison.changed_prose_indices, [1]);
    assert.equal(scienceComparison.current_affected_text, afterProse[1].text);
    assert.equal(scienceComparison.plain_text_equality.equal, true);
    const plainSha = hash(Buffer.from(plain(afterProse[1].text)));
    assert.equal(scienceComparison.plain_text_equality.prior_sha256, plainSha);
    assert.equal(scienceComparison.plain_text_equality.current_sha256, plainSha);
    assert.deepEqual(comparison.changedProseIndices, [1]);
    assert.equal(comparison.allWordsNumbersFormulasAndConditionsUnchangedIgnoringBoldAndWhitespace, true);
    assert.equal(comparison.otherThreeProseObjectsByteStructureUnchanged, true);
    assert.equal(comparison.paragraphs.length, 2);
    assert.deepEqual(comparison.paragraphs.map(row => row.text), afterProse[1].text.split(/\n\s*\n/));
    for (const row of comparison.paragraphs) {
      assert.equal(row.blockIndex, 1);
      assert.equal((row.text.match(/\*\*/g) ?? []).length, 2);
      assert.match(row.text, /\*\*[.\u3002]$/);
    }
    assert.equal(beforeBreaks.length, 1);
    assert.deepEqual(afterBreaks, [comparison.boundary]);
    for (const side of ['before', 'after'])
      assert.equal(plain(afterBreaks[0][side]), plain(beforeBreaks[0][side]));
  }
  return { precedingFreeze, precedingScience };
}

async function guardAffectedDisplay(base, freeze, native, display, review, paths, hashes) {
  const originalBindings = {
    originalNative: { path: `${base}-native/result.json`,
      sha256: 'f8751da0c1ae4aefe9f734df990598361c0ca9398bb8abca77162588f59ea4a7' },
    originalDisplayResult: { path: `${base}-display/result.json`,
      sha256: '309870de1fbcb7f385e10155f8daaac848ee6f04a8eba9db76f478c36edb1799' },
    originalDisplayReview: { path: `${base}-display-review.json`,
      sha256: 'cdf3cb942f2d14a5dab4055dc0daa4c5d7a2db7f1b3891172965855ebb321683' },
  };
  for (const binding of Object.values(originalBindings)) await verify(binding.path, binding.sha256);
  const [originalNative, originalDisplay, originalReview] =
    await Promise.all(Object.values(originalBindings).map(row => read(row.path)));
  for (const doc of [originalNative, originalDisplay, originalReview]) assert.equal(doc.card, freeze.card);
  assert.equal(originalNative.status, native.status);
  assert.deepEqual(originalNative.counts, native.counts);
  assert.deepEqual(originalNative.sourceClosure, freeze.closure);
  assert.ok(boundTo(originalNative.science, freeze.precedingEffectiveScience));
  assert.ok(boundTo(originalNative.inputs, freeze.precedingScienceRepair));
  assert.ok(boundTo(native, originalBindings.originalNative));
  assert.ok(boundTo(native, originalBindings.originalDisplayReview));
  assert.equal(native.affectedOnly, true);
  assert.deepEqual(native.newlyAffectedProseIndices, [1]);
  assert.equal(native.unchangedExerciseOutputAndHtmlBytes, true);
  assert.ok(boundTo(freeze.originalDisplayFailure, originalBindings.originalDisplayReview));
  assert.ok(boundTo(review.originalDisplayReview, originalBindings.originalDisplayReview));
  assert.ok(boundTo(review.originalDisplayResult, originalBindings.originalDisplayResult));
  assert.ok(boundTo(originalReview.nativeResult, originalBindings.originalNative));
  assert.ok(boundTo(originalReview.displayResult, originalBindings.originalDisplayResult));
  assert.equal(originalReview.status, 'FAIL');
  assert.equal(originalReview.fullCardDisplayApproved, false);
  assert.deepEqual(originalReview.defects.map(row => row.id), ['DISPLAY-001']);
  assert.deepEqual([...originalReview.defects[0].surfaces].sort(), textSurfaces);
  assert.equal(originalReview.defects[0].clipping, false);
  assert.equal(originalReview.defects[0].overlap, false);
  exactSurfaces(originalReview.coverage);
  for (const row of originalReview.coverage) {
    const text = textSurfaces.includes(surfaceId(row));
    assert.equal(row.status, text ? 'FAIL' : 'PASS');
    assert.deepEqual(row.findingIds, text ? ['DISPLAY-001'] : []);
    assert.equal(row.endReachable, true);
  }
  guardMechanicalDisplay(originalDisplay, originalBindings.originalNative);
  guardMechanicalDisplay(display, { path: paths.native, sha256: hashes.native }, textSurfaces);
  assert.equal(display.schema, originalDisplay.schema);
  assert.equal(display.affectedOnly, true);
  assert.deepEqual(display.checkedKinds, ['text']);
  assert.equal(display.unchangedExerciseObservationsReused, true);
  assert.ok(boundTo(display.originalNative, originalBindings.originalNative));
  assert.ok(boundTo(display.originalDisplayFailure, originalBindings.originalDisplayReview));
  assert.equal(originalReview.actualImageOpens, 8);
  exactSurfaces(originalReview.imageOpens);
  const screenshotKeys = rows => rows.map(row => `${relative(row.path)}:${row.sha256}`).sort();
  assert.deepEqual(screenshotKeys(originalReview.imageOpens), screenshotKeys(originalDisplay.screenshots));
  assert.ok(originalReview.imageOpens.every(row => typeof row.observations === 'string'
    && row.observations.length > 0 && row.actuallyOpened !== false));
  assert.equal(originalReview.displayChecks.visibleTextOrSymbolClipping, false);
  assert.equal(originalReview.displayChecks.overlappingBlocks, false);
  const exerciseByteEquality = [];
  assert.deepEqual(originalNative.languages.map(row => row.language).sort(), ['en', 'zh']);
  assert.deepEqual(native.languages.map(row => row.language).sort(), ['en', 'zh']);
  for (const current of native.languages) {
    const old = originalNative.languages.find(row => row.language === current.language);
    assert.equal(old.root, `${base}-native/${old.language}/root`);
    assert.equal(old.work, `${base}-native/${old.language}/work`);
    assert.equal(current.root, `${base}-emphasis-native/${current.language}/root`);
    assert.equal(current.work, `${base}-emphasis-native/${current.language}/work`);
    const pairs = [
      [old.outputs, current.outputs, 'exercises.json',
        `/9p/editions/modern-us-neutral/lessons/${freeze.card}/exercises.json`, 'root'],
      [old.outputs, current.outputs, 'figures.json',
        `/9p/editions/modern-us-neutral/lessons/${freeze.card}/figures.json`, 'root'],
      [old.html, current.html, 'exercises.html',
        `/render/9p/modern-us-neutral/${freeze.card}/exercises.html`, 'work'],
    ];
    for (const [beforeRows, afterRows, name, suffix, location] of pairs) {
      const before = beforeRows.filter(row => same(row.path, `${old[location]}${suffix}`));
      const after = afterRows.filter(row => same(row.path, `${current[location]}${suffix}`));
      assert.equal(before.length, 1, `Original ${current.language}/${name} missing.`);
      assert.equal(after.length, 1, `Repaired ${current.language}/${name} missing.`);
      for (const row of [before[0], after[0]]) await verify(row.path, row.sha256);
      assert.equal(after[0].sha256, before[0].sha256, `Exercise reuse byte drift: ${current.language}/${name}`);
      assert.deepEqual(await bytes(after[0].path), await bytes(before[0].path));
      if (name === 'exercises.json') {
        const exercises = await read(after[0].path);
        assert.equal(exercises.count, 0);
        assert.deepEqual(exercises.exercises, []);
      }
      if (name === 'figures.json') assert.deepEqual((await read(after[0].path)).figures, []);
      exerciseByteEquality.push({ language: current.language, name,
        original: before[0], repaired: after[0], byteIdentical: true });
    }
    for (const mechanical of [originalDisplay, display]) {
      const language = mechanical === display ? current : old;
      for (const surface of mechanical.surfaces.filter(row => row.language === language.language)) {
        assert.equal(surfaceId(surface),
          `${language.language}-${surface.kind}-${surface.viewport.width}x${surface.viewport.height}`);
        const html = language.html.find(row =>
          same(row.path, `${language.work}/render/9p/modern-us-neutral/${freeze.card}/${surface.kind}.html`));
        assert.ok(html);
        assert.ok(boundTo(surface.nativeHtml, html));
        const screenshot = mechanical.screenshots.find(row => surfaceId(row) === surfaceId(surface));
        assert.ok(same(screenshot.path,
          `${base}${mechanical === display ? '-emphasis' : ''}-display/${surfaceId(surface)}-fullpage.png`));
        assert.ok(boundTo(surface.screenshot, screenshot));
      }
    }
  }
  for (const row of [...originalDisplay.screenshots, ...display.screenshots])
    await verify(row.path, row.sha256);
  assert.ok(Array.isArray(review.actualImageOpens));
  assert.equal(review.actualImageOpens.length, 4);
  assert.ok(review.actualImageOpens.every(row => row.actuallyOpened !== false));
  assert.deepEqual(screenshotKeys(review.actualImageOpens), screenshotKeys(display.screenshots),
    'Only four repaired text screenshots are new firsthand opens.');
  for (const [opens, mechanical] of [[originalReview.imageOpens, originalDisplay],
    [review.actualImageOpens, display]]) {
    for (const row of opens) {
      const screenshot = mechanical.screenshots.find(item => same(item.path, row.path)
        && item.sha256 === row.sha256);
      assert.ok(screenshot);
      if (surfaceId(row) != null) assert.equal(surfaceId(row), surfaceId(screenshot));
    }
  }
  const reusedCoverage = originalReview.coverage.filter(row => exerciseSurfaces.includes(surfaceId(row)));
  for (const old of reusedCoverage) {
    const current = review.coverage.find(row => surfaceId(row) === surfaceId(old));
    for (const [key, value] of Object.entries(old))
      assert.deepEqual(current[key], value, `Exercise review changed: ${surfaceId(old)}/${key}`);
  }
  return {
    originalBindings, originalNative, originalDisplay, originalReview,
    reuse: {
      effectiveSurfaces: 8, newTextSurfaces: 4, reusedExerciseSurfaces: 4,
      newActualImageOpens: 4, reusedActualImageOpens: 4, exerciseByteEquality,
      coverage: [...review.coverage.filter(row => textSurfaces.includes(surfaceId(row))), ...reusedCoverage],
      newTextImageOpens: review.actualImageOpens,
      reusedExerciseImageOpens: originalReview.imageOpens
        .filter(row => exerciseSurfaces.includes(surfaceId(row))),
      reusedExerciseScreenshots: originalDisplay.screenshots
        .filter(row => exerciseSurfaces.includes(surfaceId(row))),
      reusedExerciseMechanicalObservations: originalDisplay.surfaces
        .filter(row => exerciseSurfaces.includes(surfaceId(row))),
      originalDisplayDefects: originalReview.defects,
      policy: 'Four new text opens plus four original exercise observations verbatim; no exercise reopen or eight-new-open claim.',
    },
  };
}

export async function guardPreservation(binding) {
  if (binding) await verify(binding.path, binding.sha256);
  const preservation = await read(binding?.path ?? preservationPath);
  assert.equal(preservation.fileCount, 103);
  assert.equal(preservation.files.length, 103);
  assert.equal(new Set(preservation.files.map(row => relative(row.path))).size, 103);
  for (const row of preservation.files) {
    await verify(row.path, row.sha256);
    assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode, row.path);
  }
  return preservation;
}

export async function guardSourcePrerequisites(short, freeze, preparation, source318ConsumedBinding) {
  const card = `phy9-c2-s6-${short}`;
  assert.equal(freeze.card, card);
  assert.equal(freeze.sourceTasks, 0);
  assert.equal(freeze.sourceFigures, 0);
  assert.equal(freeze.closure.lastOpen, false);
  assert.equal(freeze.closure.actualBoundaryConsumedNotReplayed, true);
  assert.deepEqual(freeze.closure.physicalPages, short === 'n127' ? [312] : [318, 319]);
  assert.equal(freeze.closure.rightBoundaryRef, short === 'n127' ? 'p0312#7' : 'p0320#1');
  const author = `${ticket}/tmp/d035-${short}-prose-author/root/9p`;
  const sourcePages = [];
  for (const page of freeze.closure.physicalPages) {
    const id = String(page).padStart(4, '0');
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      const isolated = await bind(`${author}/pages/${id}/${name}`);
      const canonical = `${raw}/pages/${id}/${name}`;
      await verify(canonical, isolated.sha256);
      if (page !== 318) assert.ok(boundTo(preparation.inputs, { path: canonical, sha256: isolated.sha256 }),
        `Missing consumed canonical source binding: ${canonical}`);
      sourcePages.push({ path: canonical, sha256: isolated.sha256 });
    }
  }
  if (short === 'n130') {
    assert.equal(freeze.closure.boundaryOnlyPage320, true);
    assert.equal(freeze.closure.source318WholePageRAWApproval, false);
    assert.equal(freeze.closure.source130OwnedProseApproved, true);
    const nativePath = `${ticket}/tmp/d035-source318-native-resume/pages-native.json`;
    const nativeBinding = preparation.inputs.find(row => same(row.path, nativePath));
    assert.ok(nativeBinding, 'n130 requires exact source318 native receipt.');
    await verify(nativeBinding.path, nativeBinding.sha256);
    const native = await read(nativeBinding.path);
    assert.equal(native.status, 'NATIVE-PASS');
    const page = native.pages.find(row => row.page === 318);
    assert.ok(page, 'Successful native-resume page318 is required.');
    assert.equal(page.status, 'NATIVE-PASS');
    assert.equal(page.rows.independentSource, 25);
    assert.equal(page.rows.nativePrinted, 25);
    assert.equal(page.rows.markdown, 25);
    assert.ok(source318ConsumedBinding, 'n130 requires the separate source318 consumption receipt.');
    assert.ok(same(source318ConsumedBinding.path, `${ticket}/tmp/d035-source318-consumed/result.json`));
    await verify(source318ConsumedBinding.path, source318ConsumedBinding.sha256);
    const consumed = await read(source318ConsumedBinding.path);
    assert.equal(consumed.status, 'PASS-source318-exact-preservation-consumed');
    assert.deepEqual(consumed.physicalPages, [318]);
    assert.equal(consumed.sourcePageAcceptedForFaithfulPreservation, true);
    assert.ok(boundTo(consumed.native, nativeBinding));
    for (const [name, key] of [
      ['page.md', 'pageMarkdown'], ['page.json', 'pageJson'], ['audit.json', 'audit'],
    ]) {
      const output = page.outputs[key];
      await verify(output.path, output.sha256);
      const canonical = sourcePages.find(row => row.path === `${raw}/pages/0318/${name}`);
      assert.equal(canonical.sha256, output.sha256, `Canonical318 differs from native ${key}.`);
      assert.ok(boundTo(consumed.outputs, canonical), `Consumption did not bind ${canonical.path}.`);
    }
    const textReviewBinding = freeze.closure.source318TextReview;
    assert.ok(boundTo(page.sourceReview.binding, textReviewBinding));
    assert.ok(boundTo(consumed.sourceTextReview, textReviewBinding));
    await verify(textReviewBinding.path, textReviewBinding.sha256);
    const textReview = await read(textReviewBinding.path);
    assert.equal(textReview.effectiveSource318.actual130StartStatus, 'PASS');
    assert.equal(textReview.fullPageSourceApproval, false);
    const boundaryBinding = freeze.closure.boundaryReview;
    await verify(boundaryBinding.path, boundaryBinding.sha256);
    const boundaryReview = await read(boundaryBinding.path);
    const boundary = boundaryReview.boundaries.actualHeadings.find(row => row.ref === 'p0320#1');
    assert.equal(boundary.sourceHeading, freeze.closure.rightBoundaryHeading);
    assert.equal(boundary.noPContAtPageStart, true);
    const isolatedBoundary = await read(`${author}/pages/0320/page.json`);
    assert.equal(isolatedBoundary.blocks.length, 1);
    assert.equal(isolatedBoundary.blocks[0].kind, 'h3');
    assert.equal(isolatedBoundary.blocks[0].cont, false);
    assert.equal(isolatedBoundary.blocks[0].lines.join('\n'), boundary.sourceHeading);
  }
  return sourcePages;
}

async function main() {
  const { short, values } = options(['native-sha', 'display-sha', 'review-sha',
    'science-sha', 'freeze-sha', 'affected-science-sha', 'source318-consumed-sha', 'emphasis-repair-sha']);
  for (const key of ['native-sha', 'display-sha', 'review-sha', 'science-sha', 'freeze-sha'])
    assert.match(values[key] ?? '', /^[a-f0-9]{64}$/, `Required --${key}`);
  const emphasisRepair = Boolean(values['emphasis-repair-sha']);
  if (emphasisRepair) {
    assert.equal(short, 'n127', '--emphasis-repair-sha is n127-only.');
    assert.equal(values['emphasis-repair-sha'], values['freeze-sha'],
      '--emphasis-repair-sha must equal the repaired --freeze-sha.');
    assert.match(values['affected-science-sha'] ?? '', /^[a-f0-9]{64}$/,
      'Emphasis repair requires the binding-only --affected-science-sha.');
  }
  const card = `phy9-c2-s6-${short}`;
  const source318ConsumedBinding = short === 'n130' ? {
    path: `${ticket}/tmp/d035-source318-consumed/result.json`,
    sha256: values['source318-consumed-sha'],
  } : null;
  if (source318ConsumedBinding)
    assert.match(source318ConsumedBinding.sha256 ?? '', /^[a-f0-9]{64}$/,
      'n130 requires --source318-consumed-sha');
  const base = `${ticket}/tmp/d035-${short}`;
  const folder = `${base}-retention`;
  const manifestPath = `${evidence}/reports/d035-${short}-retention-manifest.json`;
  assert.ok(!await exists(`${folder}/started.json`), 'Retention already started.');
  assert.ok(!await exists(manifestPath), 'Retention already completed.');
  const nativeFolder = `${base}${emphasisRepair ? '-emphasis' : ''}-native`;
  const freezePath = emphasisRepair ? `${base}-emphasis-repair/repair-freeze.json`
    : values['affected-science-sha']
      ? `${base}-science-repair/repair-freeze.json` : `${base}-prose-author/prose-freeze.json`;
  const paths = {
    native: `${nativeFolder}/result.json`,
    display: `${base}${emphasisRepair ? '-emphasis' : ''}-display/result.json`,
    review: emphasisRepair ? `${base}-emphasis-display-affected-review.json` : `${base}-display-review.json`,
    science: `${base}-science-review.json`,
    freeze: freezePath,
  };
  const hashes = { native: values['native-sha'], display: values['display-sha'],
    review: values['review-sha'], science: values['science-sha'], freeze: values['freeze-sha'] };
  for (const [key, file] of Object.entries(paths)) await verify(file, hashes[key]);
  const [native, display, review, firstScience, freeze] =
    await Promise.all(Object.values(paths).map(read));
  for (const doc of [native, display, review, firstScience, freeze]) assert.equal(doc.card, card);
  assert.equal(native.status, 'PASS-native-bilingual-full-card-display-pending');
  assert.equal(native.counts.modernFigures, 0);
  assert.equal(native.counts.sourceExercises, 0);
  assert.equal(native.counts.modernExercises, 0);
  assert.equal(native.counts.sourceProseObjects, freeze.sourceObjects);
  assert.ok(boundTo(native.inputs, { path: freezePath, sha256: hashes.freeze }));
  assert.deepEqual(native.sourceClosure, freeze.closure);
  assert.equal(firstScience.ZHEN.status, 'PASS');
  assert.equal(firstScience.substantive_passes, 1, 'Require the full first substantive review.');
  assert.equal(firstScience.scope.source_objects, freeze.sourceObjects);
  assert.ok(boundTo(firstScience, freeze.source));
  let effectiveScience = firstScience;
  let sciencePath = paths.science;
  let initialFreeze = freeze;
  if (values['affected-science-sha']) {
    sciencePath = emphasisRepair ? `${base}-emphasis-binding-review.json` : `${base}-science-affected-review.json`;
    await verify(sciencePath, values['affected-science-sha']);
    effectiveScience = await read(sciencePath);
    assert.equal(effectiveScience.card, card);
    assert.equal(firstScience.SCI.status, 'FAIL');
    assert.ok(boundTo(freeze.originalScienceReview, { path: paths.science, sha256: hashes.science }));
    await verify(freeze.originalAuthor.path, freeze.originalAuthor.sha256);
    initialFreeze = await read(freeze.originalAuthor.path);
    assert.ok(boundTo(firstScience, freeze.originalAuthor));
    assert.ok(boundTo(effectiveScience, { path: freezePath, sha256: hashes.freeze }));
    assert.ok(boundTo(effectiveScience, { path: paths.science, sha256: hashes.science }));
    assert.ok(Array.isArray(freeze.changedProseIndices) && freeze.changedProseIndices.length > 0);
    assert.ok(freeze.changedProseIndices.every(index => Number.isInteger(index)
      && index >= 0 && index < freeze.sourceObjects));
    assert.ok(freeze.changedProseIndices.length < freeze.sourceObjects);
    assert.deepEqual(effectiveScience.scope.affected_prose_indices, freeze.changedProseIndices);
    assert.deepEqual(effectiveScience.scope.unaffected_prose_indices,
      Array.from({ length: freeze.sourceObjects }, (_, index) => index)
        .filter(index => !freeze.changedProseIndices.includes(index)));
    assert.deepEqual(freeze.source, initialFreeze.source);
    assert.deepEqual(freeze.exercisesSource, initialFreeze.exercisesSource);
    for (const key of ['lessonTemplate', 'englishLesson']) {
      const before = await read(initialFreeze.frozenFiles[key].path);
      const after = await read(freeze.frozenFiles[key].path);
      assert.equal(after.prose.length, before.prose.length);
      for (let index = 0; index < before.prose.length; index++)
        if (!freeze.changedProseIndices.includes(index))
          assert.deepEqual(after.prose[index], before.prose[index], `Unrelated repair: ${key}/${index}`);
    }
  } else {
    assert.ok(boundTo(firstScience, { path: freezePath, sha256: hashes.freeze }));
  }
  assert.equal(effectiveScience.SCI.status, 'PASS');
  assert.equal(effectiveScience.ZHEN.status, 'PASS');
  for (const [science, approved] of [[firstScience, initialFreeze], [effectiveScience, freeze]]) {
    for (const key of ['lessonTemplate', 'englishLesson'])
      assert.ok(boundTo(science, approved.frozenFiles[key]), `SCI exact ${key} binding missing.`);
  }
  assert.ok(boundTo(native.science, await bind(sciencePath)));
  assert.equal(review.status, 'PASS');
  assert.ok(boundTo(review.nativeResult, { path: paths.native, sha256: hashes.native }));
  assert.ok(boundTo(review.displayResult, { path: paths.display, sha256: hashes.display }));
  exactSurfaces(review.coverage);
  assert.ok(review.coverage.every(row => pass(row.status)));
  let emphasisScience = null;
  let affectedDisplay = null;
  if (emphasisRepair) {
    emphasisScience = await guardEmphasisScience(freeze, effectiveScience);
    affectedDisplay = await guardAffectedDisplay(base, freeze, native, display, review, paths, hashes);
  } else {
    guardMechanicalDisplay(display, { path: paths.native, sha256: hashes.native });
    assert.equal(review.actualImageOpens.length, 8);
    assert.ok(review.actualImageOpens.every(row => row.actuallyOpened !== false));
    assert.deepEqual(review.actualImageOpens.map(row => `${relative(row.path)}:${row.sha256}`).sort(),
      display.screenshots.map(row => `${relative(row.path)}:${row.sha256}`).sort(),
      'Every full screenshot, including empty exercises, needs a firsthand open.');
  }
  // Independent PASS must explicitly cover the visible no-clipping/no-overlap predicates.
  assert.equal(review.displayChecks.visibleTextOrSymbolClipping, false);
  assert.equal(review.displayChecks.overlappingBlocks, false);
  const preparation = await read(freeze.preparation.path);
  await verify(freeze.preparation.path, freeze.preparation.sha256);
  const sourceLesson = await read(freeze.source.path);
  const sourceExercises = await read(freeze.exercisesSource.path);
  assert.equal(sourceLesson.card_id, card);
  assert.equal(sourceLesson.prose.length, freeze.sourceObjects);
  assert.ok(sourceLesson.prose.every(row => row.kind === 'p'));
  assert.deepEqual(sourceLesson.figures, []);
  assert.equal(sourceExercises.count, 0);
  assert.deepEqual(sourceExercises.exercises, []);
  const sourcePages = await guardSourcePrerequisites(short, freeze, preparation, source318ConsumedBinding);
  const beforeIndex = await bytes(indexPath);
  const index = JSON.parse(beforeIndex);
  for (const key of collections) assert.ok(Array.isArray(index[key]));
  const meterPath = `${ticket}/production-meter.json`;
  const beforeMeter = await bytes(meterPath);
  assert.equal(JSON.parse(beforeMeter).currentCheckpoint.completeDeliveredCards, 83);
  const preservationBinding = await bind(preservationPath);
  const preservation = await guardPreservation(preservationBinding);
  const protectedFiles = await Promise.all([`${raw}/book.json`, `${modern}/book.json`,
    'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json',
    'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/book.json'].map(bind));
  const plan = new Map();
  const plannedBindings = new Map();
  const retained = [];
  const reused = [];
  const dependencies = [];
  const history = `${evidence}/author-history/d035/${short}`;
  const historicalInputAliases = new Map();
  const historicalAliasesUsed = [];
  if (short === 'n130') {
    const receipt = await read(`${ticket}/tmp/d035-source318-native-resume/pages-native.json`);
    await verify(receipt.inputFreeze.path, receipt.inputFreeze.sha256);
    const inputFreeze = await read(receipt.inputFreeze.path);
    const stagedPath = `${ticket}/tmp/d035-source318-native-resume/root/9p/pages/0318/page.md`;
    const staging = inputFreeze.staging.find(row => same(row.staged.path, stagedPath));
    assert.ok(staging && staging.byteIdentical);
    assert.equal(staging.input.sha256, staging.staged.sha256);
    assert.equal(staging.staged.sha256, 'dd34654e4beb6ef063c1aed05f942fc4c42dd72bdc0ccb664d3d82b94c56352b');
    await verify(staging.input.path, staging.input.sha256);
    const finalized = receipt.pages.find(row => row.page === 318).outputs.pageMarkdown;
    assert.ok(same(finalized.path, staging.staged.path));
    await verify(finalized.path, finalized.sha256);
    historicalInputAliases.set(`${relative(staging.staged.path)}:${staging.staged.sha256}`, {
      input: staging.input, staging: staging.staged, finalOutput: finalized,
      inputFreeze: receipt.inputFreeze,
    });
  }
  async function retain(file, collection = 'reports', expected, destination) {
    file = relative(file);
    assert.ok(!file.startsWith('../') && !/(?:^|\/)\.env(?:\.|$)/.test(file), file);
    const alias = expected && historicalInputAliases.get(`${file}:${expected}`);
    if (alias) {
      const retainedInput = await retain(alias.input.path, collection, alias.input.sha256);
      historicalAliasesUsed.push({
        historicalStagingBinding: alias.staging,
        historicalInputRetained: retainedInput,
        finalOutput: alias.finalOutput,
        inputFreeze: alias.inputFreeze,
        reason: 'Native input-freeze proves this exact staging copy before finalize. Preserve its original input bytes separately from the separately verified final output at the same staging path.',
      });
      return retainedInput;
    }
    if (expected) {
      const previous = lookup(index, file, expected);
      if (previous) {
        await verify(previous, expected);
        const row = { path: previous, sha256: expected, originalPath: file };
        reused.push(row);
        return { path: row.path, sha256: row.sha256 };
      }
    }
    const data = await bytes(file);
    const sha256 = hash(data);
    if (expected) assert.equal(sha256, expected, `Bound evidence drift: ${file}`);
    const previous = lookup(index, file, sha256);
    if (previous) {
      await verify(previous, sha256);
      reused.push({ originalPath: file, path: previous, sha256 });
      return { path: previous, sha256 };
    }
    const plannedKey = `${file}:${sha256}`;
    if (plannedBindings.has(plannedKey)) return { path: plannedBindings.get(plannedKey), sha256 };
    destination ??= `${history}/inputs/${hash(Buffer.from(file)).slice(0, 12)}-${sha256.slice(0, 16)}-${path.basename(file)}`;
    assert.ok(relative(destination).startsWith(`${evidence}/`));
    for (const old of records(index).filter(row => same(row.path, destination)))
      assert.equal(old.sha256, sha256);
    if (plan.has(destination)) assert.equal(plan.get(destination).sha256, sha256);
    else {
      if (await exists(destination)) await verify(destination, sha256);
      plan.set(destination, { originalPath: file, path: destination, sha256, data, collection });
    }
    plannedBindings.set(plannedKey, destination);
    return { path: destination, sha256 };
  }
  async function readBound(binding) {
    const row = await retain(binding.path, 'reports', binding.sha256);
    return plan.has(row.path) ? JSON.parse(plan.get(row.path).data) : read(row.path);
  }
  const allowedPages = new Set([...freeze.closure.physicalPages, ...(short === 'n130' ? [320] : [])]);
  const pageScoped = file => {
    const ids = [...relative(file).matchAll(/(?:^|\/)(?:p)?0?(3\d{2})(?=\/|[-_.]|$)/g)]
      .map(match => Number(match[1]));
    return !ids.length || ids.every(page => allowedPages.has(page));
  };
  const historicalGuard = file => [
    indexPath, meterPath, `${raw}/book.json`, `${modern}/book.json`,
    ...protectedFiles.map(row => row.path),
  ].some(protectedPath => same(file, protectedPath));
  async function consumeBound(document, sourceScope = false) {
    for (const binding of bindings(document)) {
      if (historicalGuard(binding.path) || same(binding.path, preservationPath)) continue;
      if (preservation.files.some(row => same(row.path, binding.path))) continue;
      if (sourceScope && !pageScoped(binding.path)) continue;
      if (sourceScope && /\/figures\/|(?:^|\/)fig[-_]?\d/.test(binding.path)) continue;
      if (sourceScope && /\.(png|jpe?g)$/i.test(binding.path)
        && !/(?:^|\/)(?:p)?0?3\d{2}(?=\/|[-_.]|$)/.test(binding.path)) continue;
      const collection = /\.(png|jpe?g)$/i.test(binding.path)
        ? binding.path.includes('-display') ? 'surfaces' : 'sourceCrops' : 'reports';
      dependencies.push({ originalPath: binding.path, ...await retain(binding.path, collection, binding.sha256) });
    }
  }
  const reports = {};
  for (const [key, file] of Object.entries(paths))
    reports[key] = await retain(file, 'reports', hashes[key], key === 'review' || key === 'science'
      ? `${evidence}/reports/${path.basename(file)}` : undefined);
  reports.effectiveScience = await retain(sciencePath, 'reports',
    values['affected-science-sha'] ?? hashes.science, `${evidence}/reports/${path.basename(sciencePath)}`);
  if (emphasisRepair) {
    for (const [key, binding] of Object.entries({
      ...affectedDisplay.originalBindings,
      precedingScienceRepair: freeze.precedingScienceRepair,
      precedingEffectiveScience: freeze.precedingEffectiveScience,
    })) reports[key] = await retain(binding.path, 'reports', binding.sha256);
  }
  for (const doc of [freeze, initialFreeze, firstScience, effectiveScience, native, display, review,
    ...(emphasisRepair ? [emphasisScience.precedingFreeze, emphasisScience.precedingScience,
      affectedDisplay.originalNative, affectedDisplay.originalDisplay, affectedDisplay.originalReview] : [])])
    await consumeBound(doc);
  reports.preparation = await retain(freeze.preparation.path, 'reports', freeze.preparation.sha256);
  await consumeBound(preparation, true);
  for (const row of sourcePages) await retain(row.path, 'sourceCrops', row.sha256);
  const consumptionBinding = preparation.inputs.find(row =>
    same(row.path, `${ticket}/tmp/d035-source312-319-consumed/result.json`));
  assert.ok(consumptionBinding);
  const consumption = await readBound(consumptionBinding);
  for (const selection of consumption.selections.filter(row => allowedPages.has(row.page))) {
    await consumeBound(selection, true);
    for (const binding of [selection.native, selection.sourceReview])
      await consumeBound(await readBound(binding), true);
  }
  if (short === 'n130') {
    const source318NativeBinding = preparation.inputs.find(row =>
      same(row.path, `${ticket}/tmp/d035-source318-native-resume/pages-native.json`));
    reports.source318Consumption = await retain(source318ConsumedBinding.path, 'reports',
      source318ConsumedBinding.sha256);
    reports.source318Native = await retain(source318NativeBinding.path, 'reports', source318NativeBinding.sha256);
    await consumeBound(await readBound(source318ConsumedBinding), true);
    for (const binding of [freeze.closure.source318TextReview, freeze.closure.boundaryReview,
      source318NativeBinding])
      await consumeBound(await readBound(binding), true);
  }
  for (const suffix of ['prose-author', 'science-repair', 'science-evidence',
    'science-affected-evidence', 'native', 'display', ...(emphasisRepair ? [
      'display-evidence', 'emphasis-repair', 'emphasis-binding-evidence', 'emphasis-native',
      'emphasis-display', 'emphasis-display-evidence', 'emphasis-display-affected-evidence',
    ] : [])]) {
    const directory = `${base}-${suffix}`;
    if (!await exists(directory)) continue;
    for (const file of await walk(directory)) {
      if (!pageScoped(file)) continue;
      const lessonMatch = file.match(/\/(?:root\/9p\/|adapt\/9p\/modern-us-neutral\/|root\/9p\/editions\/modern-us-neutral\/)lessons\/([^/]+)\//);
      if (lessonMatch && lessonMatch[1] !== card) continue;
      await retain(file, /\.(png|jpe?g)$/i.test(file)
        ? suffix.includes('display') ? 'surfaces' : 'sourceCrops' : 'reports',
      undefined, `${history}/${suffix}/${path.relative(directory, file)}`);
      if (file.endsWith('.json')) await consumeBound(await read(file), true);
    }
  }
  assert.deepEqual(native.languages.map(row => row.language).sort(), ['en', 'zh']);
  for (const language of native.languages) {
    assert.equal(language.root, `${nativeFolder}/${language.language}/root`);
    assert.equal(language.work, `${nativeFolder}/${language.language}/work`);
    assert.equal(language.outputs.length, 4);
    assert.equal(language.html.length, 2);
    const directory = `${language.root}/9p/editions/modern-us-neutral/lessons/${card}`;
    assert.deepEqual(language.outputs.map(row => relative(row.path)).sort(),
      ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
        .map(name => `${directory}/${name}`).sort());
    assert.deepEqual(language.html.map(row => relative(row.path)).sort(),
      ['text', 'exercises'].map(name =>
        `${language.work}/render/9p/modern-us-neutral/${card}/${name}.html`).sort());
    for (const binding of [...language.outputs, ...language.html, language.finalize, language.render])
      await verify(binding.path, binding.sha256);
    const lesson = await read(`${directory}/lesson.json`);
    assert.deepEqual(lesson.prose, (await read(freeze.frozenFiles[
      language.language === 'zh' ? 'lessonTemplate' : 'englishLesson'].path)).prose);
    const exercises = await read(`${directory}/exercises.json`);
    assert.equal(exercises.count, 0);
    assert.deepEqual(exercises.exercises, []);
    assert.deepEqual((await read(`${directory}/figures.json`)).figures, []);
    assert.equal((await read(`${directory}/adaptation.audit.json`)).status, 'pass');
  }
  const zh = native.languages.find(row => row.language === 'zh');
  const candidateRaw = `${zh.root}/9p`;
  const candidateModern = `${candidateRaw}/editions/modern-us-neutral`;
  const authorRaw = `${base}-prose-author/root/9p`;
  const sourceBookInput = native.inputs.find(row => same(row.path, `${authorRaw}/book.json`));
  assert.ok(sourceBookInput, 'Generated raw book must be native-bound.');
  await verify(`${candidateRaw}/book.json`, sourceBookInput.sha256);
  const rawBook = await retain(`${candidateRaw}/book.json`);
  const modernBook = await retain(`${candidateModern}/book.json`);
  const sourceEntry = (await read(`${candidateRaw}/book.json`)).lessons.filter(row => row.id === card);
  const modernEntry = (await read(`${candidateModern}/book.json`)).lessons.filter(row => row.id === card);
  assert.equal(sourceEntry.length, 1);
  assert.equal(modernEntry.length, 1);
  assert.equal((await read(`${candidateModern}/book.json`)).lessons.length, 1);
  const modernLesson = await read(`${candidateModern}/lessons/${card}/lesson.json`);
  assert.deepEqual(modernEntry[0], {
    id: card, number: modernLesson.number, title: modernLesson.title,
    prose_blocks: modernLesson.prose.length, exercises: 0, figures: 0,
    source_lesson_sha256: freeze.source.sha256,
    source_exercises_sha256: freeze.exercisesSource.sha256,
  }, 'Generated modern row must describe the exact accepted native outputs.');
  const promotionPlan = [];
  for (const [candidate, canonical, names] of [
    [candidateRaw, raw, ['lesson.json', 'lesson.md', 'exercises.json']],
    [candidateModern, modern, ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']],
  ]) for (const name of names) {
    const file = `${candidate}/lessons/${card}/${name}`;
    if (candidate === candidateRaw) {
      const input = native.inputs.find(row => same(row.path, `${authorRaw}/lessons/${card}/${name}`));
      assert.ok(input, `Raw output must be native-bound: ${name}`);
      await verify(file, input.sha256);
      if (name !== 'lesson.md')
        await verify(file, name === 'lesson.json' ? freeze.source.sha256 : freeze.exercisesSource.sha256);
    }
    if (candidate === candidateModern) assert.ok(boundTo(zh.outputs, await bind(file)));
    promotionPlan.push({ source: await retain(file), destination: `${canonical}/lessons/${card}/${name}` });
  }
  for (const name of ['retain-d016-evidence.mjs', 'finalize-d035-no-figure-card.mjs',
    'check-d035-no-figure-display.mjs', 'retain-d035-no-figure-evidence.mjs',
    'promote-d035-no-figure-native.mjs', ...(emphasisRepair ? [
      'repair-d035-n127-emphasis.mjs', 'finalize-d035-n127-emphasis.mjs',
      'check-d035-n127-emphasis-display.mjs',
    ] : [])])
    await retain(`${ticket}/tmp/${name}`, 'reports', undefined, `${history}/helpers/${name}`);
  const authority = await retain(preservationPath, 'reports', preservationBinding.sha256);
  async function guard() {
    assert.deepEqual(await bytes(indexPath), beforeIndex, 'Shared evidence index changed.');
    assert.deepEqual(await bytes(meterPath), beforeMeter, 'Parent meter changed.');
    for (const row of [...protectedFiles, ...sourcePages]) await verify(row.path, row.sha256);
    await guardPreservation(preservationBinding);
    for (const row of plan.values()) await verify(row.originalPath, row.sha256);
  }
  await guard();
  await immutableWrite(`${folder}/started.json`, encode({
    card, reports, protectedFiles, sourcePages, preservation: preservationBinding,
    plan: [...plan.values()].map(({ data, ...row }) => row),
  }));
  for (const row of plan.values()) {
    await verify(row.originalPath, row.sha256);
    await immutableWrite(row.path, row.data);
    const record = { path: row.path, sha256: row.sha256, originalPath: row.originalPath,
      batch: 'D-035', card, deliveryClaim: false };
    if (!index[row.collection].some(item => same(item.path, row.path))) index[row.collection].push(record);
    retained.push(record);
  }
  await guard();
  await immutableWrite(manifestPath, encode({
    ticket: 'STEMROBIN-181', card, status: 'exact-complete-card-evidence-retained',
    native: reports.native, displayResult: reports.display, displayReview: reports.review,
    originalScience: reports.science, effectiveScience: reports.effectiveScience,
    freeze: reports.freeze, preparation: reports.preparation,
    preservation: authority, sourceClosure: freeze.closure, sourcePages,
    source318Consumption: reports.source318Consumption ?? null,
    source318Native: reports.source318Native ?? null,
    sourceEntry: sourceEntry[0], modernEntry: modernEntry[0], rawBook, modernBook, promotionPlan,
    dependencies, retained, reused, fullCardDisplayPASS: true,
    ...(emphasisRepair ? {
      emphasisRepair: reports.freeze,
      originalNative: reports.originalNative, originalDisplayResult: reports.originalDisplayResult,
      originalDisplayReview: reports.originalDisplayReview,
      precedingScienceRepair: reports.precedingScienceRepair,
      precedingEffectiveScience: reports.precedingEffectiveScience,
      originalDisplayFAILPreserved: true, affectedDisplayReuse: affectedDisplay.reuse,
      scienceBindingOnly: true, changedProseIndices: freeze.changedProseIndices,
    } : {}),
    originalScienceFAILPreserved: firstScience.SCI.status === 'FAIL',
    historicalInputAliases: historicalAliasesUsed,
    originalFailuresPreservedVerbatim: true, preservedUnownedFiles: preservation.files.length,
    counts: { sourceTasks: 0, sourceFigures: 0, modernTasks: 0, modernFigures: 0 },
    headlessOfflineOnly: true, formalProductAC: false, parentNewImageOpens: 0,
    completeDeliveredCardsUnchanged: 83,
    sourceDependencyPolicy: 'Bound source/native reports and exact relevant page inputs only. No recursive snapshots of shared source bundles; page320 is boundary-only, not full-page approval.',
    limits: emphasisRepair
      ? 'Retain original SCI/display failures and prior native/display/science evidence verbatim, exact science binding-only approval, four new text opens and four reused original exercise observations with byte-identical native exercise output/HTML. No eight-new-open claim, exercise/browser/gate replay, canonical promotion, meter, DB, Git, tests/build, setup or handoff.'
      : 'Retain existing exact SCI/ZHEN, native, display and firsthand eight-image evidence once. No gate/browser replay, canonical promotion, meter, DB, Git, tests/build, setup or handoff.',
  }));
  const manifest = await bind(manifestPath);
  index.reports.push({ ...manifest, batch: 'D-035', card, deliveryClaim: false });
  await guard();
  index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), encode(index));
  console.log(JSON.stringify({ manifest, retained: retained.length, reused: reused.length }));
}

if (process.argv[1] && path.resolve(root, process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
