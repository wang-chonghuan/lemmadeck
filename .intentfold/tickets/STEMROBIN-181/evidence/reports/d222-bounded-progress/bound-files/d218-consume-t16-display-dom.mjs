import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {
  ticket, absolute, read, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d218-t16-display-dom-consumption`;
const resultPath = `${ticket}/tmp/d217-t16-display-target/run-cb88ca12bbc1-2026-11-17T22-38-50-300Z/result.json`;
await verify(resultPath, 'a2445d3868a006bbed08a0e45c7c21c7d440bdf453e6347bd2a2fe8a6365afb4');
const result = await read(resultPath);
const native = await read(`${ticket}/tmp/d204-t16-native-order-repair/result.json`);
const require = createRequire(import.meta.url);
const helpersPath = '.claude/skills/ld-s10y-lesson/tools/publish_merge.js';
const { sourceNumberForArtifact, displayNumberForArtifact } = require(absolute(helpersPath));
const sharp = require('/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
assert.equal(result.execution.browserClosed, true);
assert.equal(result.surfaces.length, 16);
const consumed = [];
for (const surface of result.surfaces) {
  await verify(surface.inputHTML.path, surface.inputHTML.sha256);
  if (surface.kind !== 'exercises') {
    assert.equal(surface.failures.length, 0);
    continue;
  }
  assert.deepEqual(surface.failures.map(row => row.label), ['Original printed exercise numbers']);
  const language = native.languages.find(row => row.language === surface.language);
  const exercisePath = `${language.nativeRoot}/10p/editions/modern-us-neutral/lessons/${native.card}/exercises.json`;
  const exerciseBinding = language.nativeOutputs.find(row => row.path === exercisePath);
  await verify(exercisePath, exerciseBinding.sha256);
  const expected = (await read(exercisePath)).exercises;
  assert.equal(expected.length, 5);
  assert.equal(surface.observed.exercises.length, expected.length);
  const numbers = expected.map((exercise, i) => {
    const observed = surface.observed.exercises[i];
    const number = sourceNumberForArtifact(exercise);
    const prefix = /^\s*(\d+)\.(?=\s|$)/.exec(observed.text);
    assert.equal(observed.text, exercise.text);
    assert.equal(observed.id, `ex-${exercise.number}`);
    assert.equal(observed.bodyVisible, true);
    assert.equal(observed.number, displayNumberForArtifact(exercise));
    assert.equal(prefix?.[1], String(number));
    return { id: observed.id, sourceNumber: number, visibleBodyPrefix: `${prefix[1]}.`,
      separateNumberColumn: observed.number, bodyVisible: true };
  });
  consumed.push({ surface: surface.id, inputHTML: surface.inputHTML,
    exercises: exerciseBinding, numbers, status: 'PASS-existing-DOM-native-number-contract' });
}
await immutableWrite(`${folder}/numbering-receipt.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D032', card: native.card,
  status: 'PASS-mechanical-composed-visual-pending',
  originalResult: await bind(resultPath), nativeNumberHelper: await bind(helpersPath),
  unchangedOriginalStatus: result.status, consumed,
  mechanicalSurfacesPassed: 16, independentVisualReview: 'PENDING',
  browserLaunches: 0, screenshotsCaptured: 0, nativeRerenders: 0, imagesOpened: 0,
  parentCumulativeImages: 24, originalFAILPreserved: true,
  explanation: 'Native displayNumberForArtifact suppresses a duplicate .n when the exact source number is already the visible finalized body prefix. The old assertion read only .n.',
}, null, 2)}\n`);

const selected = [], omitted = [];
for (const surface of result.surfaces) {
  const full = surface.screenshots.find(row => row.fullPage);
  assert.ok(full.coverage.exact && full.coverage.noGaps);
  selected.push(...full.tiles.map(tile => ({ ...tile, reason: 'Complete native full-page pixels' })));
  for (const coverage of surface.horizontalCoverage ?? []) {
    assert.equal(coverage.exactCoverageWithoutGaps, true);
    const screenshots = surface.screenshots.filter(row => row.scroller?.index === coverage.index);
    for (const screenshot of screenshots) {
      await verify(screenshot.path, screenshot.sha256);
      if (screenshot.scrollLeft === 0) {
        omitted.push({ surface: surface.id, screenshot: await bind(screenshot.path),
          reason: 'Initial horizontal content occurs in the complete native full-page capture',
          observedVia: await bind(full.path), actuallyOpened: false });
        continue;
      }
      if (coverage.tag === 'FIGURE') {
        selected.push(...screenshot.tiles.map(tile => ({ ...tile,
          reason: 'Real hidden figure content', scroller: screenshot.scroller,
          scrollLeft: screenshot.scrollLeft, nativeContentRange: screenshot.nativeContentRange })));
        continue;
      }
      assert.equal(coverage.tag, 'SPAN');
      assert.equal(coverage.contentWidth - coverage.width, 2);
      const { data, info } = await sharp(screenshot.path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.channels, 3);
      // Include one extra edge column so a rounded screenshot boundary cannot hide ink.
      const stripWidth = coverage.contentWidth - coverage.width + 1;
      let nonwhiteSamples = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = info.width - stripWidth; x < info.width; x++) {
          for (let channel = 0; channel < 3; channel++) {
            if (data[(y * info.width + x) * 3 + channel] !== 255) nonwhiteSamples++;
          }
        }
      }
      const proof = { surface: surface.id, screenshot: await bind(screenshot.path),
        contentWidth: coverage.contentWidth, clientWidth: coverage.width, scrollLeft: screenshot.scrollLeft,
        stripWidth, stripHeight: info.height, nonwhiteSamples, exactWhiteRequired: true };
      if (nonwhiteSamples) {
        selected.push(...screenshot.tiles.map(tile => ({ ...tile,
          reason: 'Potential text-edge ink; requires actual visual observation', edgeProof: proof })));
      } else {
        omitted.push({ ...proof, reason: 'Conservative newly exposed edge strip is entirely RGB255 white',
          actuallyOpened: false, originalFilePreserved: true });
      }
    }
    for (const screenshot of surface.screenshots.filter(row => row.kind === 'vertical-scroll-end')) {
      const screenshotBinding = await bind(screenshot.path);
      if (!omitted.some(row => row.screenshot?.path === screenshotBinding.path)) {
        omitted.push({ surface: surface.id, screenshot: screenshotBinding,
          reason: 'Full-page tiles cover all native vertical content; pageEnd reachability already captured',
          observedVia: await bind(full.path), actuallyOpened: false });
      }
    }
  }
}
const unique = [], reused = [];
const byHash = new Map();
for (const tile of selected) {
  await verify(tile.path, tile.sha256);
  if (byHash.has(tile.sha256)) {
    reused.push({ ...tile, observedVia: byHash.get(tile.sha256).path,
      byteIdenticalVerified: true, actuallyOpened: false });
  } else {
    byHash.set(tile.sha256, tile);
    unique.push(tile);
  }
}
const batches = [];
for (let i = 0; i < unique.length; i += 8) {
  const batch = { id: batches.length + 1, images: unique.slice(i, i + 8),
    status: 'PENDING-first-independent-visual-review', maximumImages: 8 };
  const file = `${folder}/batch-${String(batch.id).padStart(2, '0')}.json`;
  await immutableWrite(file, `${JSON.stringify(batch, null, 2)}\n`);
  batches.push(await bind(file));
}
await immutableWrite(`${folder}/review-list.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: native.card, status: 'PENDING-first-independent-visual-review',
  originalResult: await bind(resultPath), numberingReceipt: await bind(`${folder}/numbering-receipt.json`),
  surfaces: result.surfaces.map(surface => ({ id: surface.id, card: surface.card,
    language: surface.language, kind: surface.kind, viewport: surface.viewport })),
  fullPagePixelCoverage: true, fullPageTilesSelected: selected.filter(row => !row.scroller && !row.edgeProof).length,
  uniqueImageCount: unique.length, selected: unique, byteIdenticalReused: reused,
  omitted, batches, parentImagesOpened: 0, parentCumulativeImages: 24,
  originalScreenshotsDeleted: 0, newScreenshots: 0, resampling: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ numbering: await bind(`${folder}/numbering-receipt.json`),
  reviewList: await bind(`${folder}/review-list.json`), uniqueImages: unique.length,
  byteIdenticalReused: reused.length, omitted: omitted.length, batches: batches.length }));
