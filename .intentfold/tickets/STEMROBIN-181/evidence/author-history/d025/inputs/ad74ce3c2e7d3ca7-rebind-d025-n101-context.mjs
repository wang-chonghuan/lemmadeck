import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d025-n101-context-rebind`;
const output = `${tmp}/d025-n101-context-rebind.json`;
assert.ok(!await exists(output));
const originalFreezePath = `${tmp}/d026-n101-figures-author-freeze.json`;
const originalReviewPath = `${tmp}/9p-n101-figure-review.json`;
const originalFreeze = await read(originalFreezePath);
const originalReview = await read(originalReviewPath);
assert.equal(originalReview.status, 'fail');
assert.deepEqual(originalReview.findings.map(row => row.id), [
  'N101-FIG-AUTHORITATIVE-CONTEXT-NOT-EQUAL',
]);
const templatePath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n101/lesson.template.json';
const lessonBinding = await bind(templatePath);
const lesson = await read(templatePath);
const text = [lesson.printed_title, ...lesson.prose.map(row => row.text).filter(Boolean)].join('\n\n');
const rows = [];
for (const previous of originalFreeze.figureRecords) {
  for (const binding of [previous.source, previous.spec, previous.render, previous.svg,
    previous.context, previous.review, ...previous.previews]) {
    await verify(binding.path, binding.sha256);
  }
  const before = await read(previous.spec.path);
  const spec = structuredClone(before);
  spec.source.authoritativeText = [{ lesson: lesson.id, text }];
  const reversed = structuredClone(spec);
  reversed.source.authoritativeText = before.source.authoritativeText;
  assert.deepEqual(reversed, before);
  const specPath = `${folder}/${spec.id}/spec.json`;
  await immutableWrite(specPath, `${JSON.stringify(spec, null, 2)}\n`);
  const newSpec = await bind(specPath);
  const contextPath = `${folder}/${spec.id}/context.json`;
  await immutableWrite(contextPath, `${JSON.stringify({
    lesson: lesson.id, authoritativeText: spec.source.authoritativeText,
    lessonTemplate: lessonBinding, source: previous.source,
    auxiliaryEnglishTranslation: originalFreeze.englishContexts,
    originalMixedContext: previous.context,
  }, null, 2)}\n`);
  const validationPath = `${folder}/${spec.id}/validation.json`;
  assert.ok(!await exists(validationPath));
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py', specPath, '--stage', 'draft'];
  const validation = spawnSync(command[0], command.slice(1), {
    encoding: 'utf8', timeout: 60000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(validationPath, `${JSON.stringify({
    command, exitCode: validation.status, stdout: validation.stdout, stderr: validation.stderr,
  }, null, 2)}\n`);
  assert.equal(validation.status, 0, validation.stderr);
  const render = await read(previous.render.path);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, previous.spec.sha256);
  assert.equal(render.output.svg.sha256, previous.svg.sha256);
  render.spec = newSpec;
  render.contextOnlyRebind = {
    originalNativeReport: previous.render, previousSpec: previous.spec, currentSpec: newSpec,
    changedOnly: '/source/authoritativeText',
    geometryAndInventoryAndDisplayDeepEqual: true,
    svgAndPreviewBytesUnchanged: true, rerendered: false, newRepair: false,
    independentApproval: 'pending affected-only context review; initial pixel findings retained',
  };
  const renderPath = `${folder}/${spec.id}/render.json`;
  await immutableWrite(renderPath, `${JSON.stringify(render, null, 2)}\n`);
  rows.push({
    id: spec.id, status: 'context-corrected-independent-affected-review-pending',
    before: { spec: previous.spec, render: previous.render, context: previous.context },
    bindings: { source: previous.source, lesson: lessonBinding,
      spec: newSpec, context: await bind(contextPath),
      render: await bind(renderPath), svg: previous.svg },
    validation: await bind(validationPath), previews: previous.previews,
    changedOnly: '/source/authoritativeText', geometryDeepEqual: true,
    mediaBytesUnchanged: true, newRenderCalls: 0, newGeometryRepairs: 0, imageOpens: 0,
  });
}
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D025', lesson: lesson.id,
  status: 'context-only-rebound-independent-affected-review-pending',
  originalFreeze: await bind(originalFreezePath), originalReview: await bind(originalReviewPath),
  currentTemplate: lessonBinding, rows,
  procedure: 'D015 context-only metadata bridge reused. Original reports/specs remain immutable. No rendering, pixel reopening, geometry repair, promotion, SCI replay or lesson mutation.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
