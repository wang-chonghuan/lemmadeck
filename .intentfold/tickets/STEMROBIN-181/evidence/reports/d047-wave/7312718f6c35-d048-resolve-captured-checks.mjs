import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, read, bytes, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';

const [execute] = process.argv.slice(2);
assert.equal(execute, '--execute');
const sourcePath = `${ticket}/tmp/d047-wave-display/run-e06b294c1a84-2026-11-17T10-28-34-924Z/result.json`;
await verify(sourcePath, '9145f5e698e1872a2f127abb608bfa95ef0e693b09c653136b9136be1d9169e1');
const original = await read(sourcePath);
assert.equal(original.surfaces.length, 40);
assert.equal(original.execution.browserPasses, 1);
assert.equal(original.execution.browserClosed, true);
for (const row of original.inputsAfter) {
  assert.equal(row.unchanged, true);
  await verify(row.path, row.sha256);
}
for (const row of [...original.screenshots, ...original.tiles])
  await verify(row.path, row.sha256);
const rendererPath = '.agents/skills/ld-s10y-image/scripts/render_spec.mjs';
const htmlRendererPath = '.claude/skills/ld-s10y-lesson/tools/render_lesson.js';
const renderer = (await bytes(rendererPath)).toString();
assert.ok(renderer.includes('id: `${object.id}-label`'));
assert.ok(renderer.includes("node.setAttribute('data-label-id', label.id)"));
const htmlRenderer = (await bytes(htmlRendererPath)).toString();
assert.ok(htmlRenderer.includes('.figcap{text-align:center;color:var(--sub);font-size:.85em'));
assert.ok(htmlRenderer.includes('p.para .katex,.prose-math{font-size:1.1em}'));
const corrections = [];
const permitted = new Set([
  'Complete FigureSpec label IDs and exact text',
  'Native prose math-character typography',
]);
assert.ok(original.failures.every(row => permitted.has(row.label)));
const inside = (a, b) => a.x >= b.x - 1 && a.y >= b.y - 1
  && a.x + a.width <= b.x + b.width + 1
  && a.y + a.height <= b.y + b.height + 1;
for (const surface of original.surfaces) {
  for (const failure of surface.failures) {
    if (failure.label === 'Complete FigureSpec label IDs and exact text') {
      const correctedExpected = failure.details.expected
        .map(row => ({ ...row, id: `${row.id}-label` }))
        .sort((a, b) => a.id.localeCompare(b.id));
      assert.deepEqual(correctedExpected, failure.details.actual,
        `Exact renderer ID and label text mismatch: ${surface.id}/${failure.details.id}`);
      corrections.push({
        surface: surface.id, label: failure.label, figure: failure.details.id,
        status: 'PASS', expected: correctedExpected, actual: failure.details.actual,
        reason: 'Renderer exports every text object as object.id + "-label"; no suffix stripping or text relaxation.',
      });
    } else {
      const paragraphs = surface.observed.blocks.filter(row => row.kind === 'p');
      const captions = surface.observed.blocks.filter(row => row.kind === 'cap');
      const classified = surface.observed.proseCharacters.map(character => {
        const owners = [...paragraphs, ...captions].filter(block => inside(character, block.geometry));
        assert.equal(owners.length, 1, `Character not uniquely bound to paragraph/caption: ${surface.id}/${character.text}`);
        const owner = owners[0];
        assert.ok(character.fontFamily.includes('KaTeX_Main'));
        assert.equal(character.display, 'inline');
        assert.equal(character.visibility, 'visible');
        assert.ok(character.width > 0 && character.height > 0);
        assert.ok(character.fontSize >= owner.geometry.fontSize - 0.01,
          'Nonformula characters must not be smaller than their own text container');
        if (owner.kind === 'p') assert.ok(character.fontSize >= 16);
        else assert.ok(Math.abs(character.fontSize - owner.geometry.fontSize * 1.1) <= 0.02,
          'Caption character size must follow unchanged native caption typography');
        return { text: character.text, fontSize: character.fontSize,
          parentKind: owner.kind, parentFontSize: owner.geometry.fontSize };
      });
      assert.ok(classified.some(row => row.parentKind === 'p'));
      corrections.push({
        surface: surface.id, label: failure.label, status: 'PASS', classified,
        reason: 'The paragraph typography check erroneously included .figcap spans. All body characters meet 16px and their paragraph size; caption characters follow the native 0.85em caption contract and remain larger than caption text.',
      });
    }
  }
}
assert.equal(corrections.length, original.failures.length);
const resolutionPath = `${ticket}/tmp/d048-display-captured-resolution.json`;
await immutableWrite(resolutionPath, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D029', status: 'PASS-affected-checker-contract-resolution',
  original: await bind(sourcePath), script: await bind(process.argv[1]),
  productionContracts: await Promise.all([rendererPath, htmlRendererPath].map(bind)),
  corrections, resolvedAssertions: corrections.length,
  browserLaunches: 0, nativeRerenders: 0, contentOrPixelsChanged: false,
  passedChecksReevaluated: false, originalFailureRetained: true,
}, null, 2)}\n`);
const effective = structuredClone(original);
effective.originalDisplayResult = await bind(sourcePath);
effective.affectedCheckerResolution = await bind(resolutionPath);
effective.originalStatus = original.status;
effective.originalFailures = original.failures;
effective.failures = [];
for (const surface of effective.surfaces) {
  surface.originalFailures = surface.failures;
  surface.checkerCorrections = corrections.filter(row => row.surface === surface.id);
  surface.failures = [];
  surface.status = 'PASS-mechanical';
}
effective.status = 'PASS-mechanical-40-surfaces-independent-display-review-pending';
effective.execution.affectedCapturedAssertionResolution = {
  report: await bind(resolutionPath), assertions: corrections.length,
  additionalBrowserPasses: 0, originalNativeInputsAndScreenshotsUnchanged: true,
};
const effectivePath = `${ticket}/tmp/d048-effective-wave-display.json`;
await immutableWrite(effectivePath, `${JSON.stringify(effective, null, 2)}\n`);
console.log(JSON.stringify({ resolution: await bind(resolutionPath),
  display: await bind(effectivePath), resolvedAssertions: corrections.length }));
