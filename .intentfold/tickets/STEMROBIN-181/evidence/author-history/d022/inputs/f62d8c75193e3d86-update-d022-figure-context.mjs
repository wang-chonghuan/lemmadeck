import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { ticket, read, bind, verify, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const [number, authorPath] = process.argv.slice(2);
assert.ok(['86', '87', '88'].includes(number));
const tmp = `${ticket}/tmp`;
const correctionPath = `${tmp}/9p-n${number}-prose-correction-freeze.json`;
const correction = await read(correctionPath);
const lessonBinding = correction.bindings.lessonTemplate;
await verify(lessonBinding.path, lessonBinding.sha256);
const lesson = await read(lessonBinding.path);
const text = [lesson.printed_title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n');
const author = await read(authorPath);
const rows = [];
const candidates = author.candidates ?? [author];
for (const candidate of candidates) {
  if (author.candidates) assert.equal(candidate.nativeStatus, 'pass');
  else assert.equal(candidate.geometryCandidateStatus, 'initial-native-render-pass-author-observed-no-repair');
  const originalSpec = candidate.finalSpec ?? candidate.spec;
  const originalRender = candidate.render;
  for (const item of [originalSpec, originalRender, candidate.svg, ...candidate.previews])
    await verify(item.path, item.sha256);
  const before = await read(originalSpec.path);
  const spec = structuredClone(before);
  spec.source.authoritativeText = [{ lesson: lesson.id, text }];
  const folder = `${tmp}/d022-n${number}-context-update/${spec.id}`;
  const specPath = `${folder}/spec.json`;
  const svgPath = `${folder}/${spec.id}.svg`;
  const renderPath = `${folder}/render.json`;
  assert.ok(!await exists(renderPath));
  await immutableWrite(specPath, `${JSON.stringify(spec, null, 2)}\n`);
  const env = { ...process.env, PLAYWRIGHT_HTML_OPEN: 'never' };
  delete env.PWDEBUG;
  const command = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specPath, '--svg', svgPath, '--report', renderPath];
  const output = execFileSync(process.execPath, command, { encoding: 'utf8', env });
  assert.equal((await read(renderPath)).status, 'pass');
  assert.deepEqual(await bytes(svgPath), await bytes(candidate.svg.path));
  const contextPath = `${folder}/context.json`;
  await immutableWrite(contextPath, `${JSON.stringify({
    lesson: lesson.id, text, lessonTemplate: lessonBinding, source: spec.source.image,
    originalContext: candidate.contextComplete ?? candidate.context,
    correction: await bind(correctionPath),
  }, null, 2)}\n`);
  rows.push({
    id: spec.id, status: 'native-context-update-identical-svg-not-independent-approval',
    before: { spec: originalSpec, render: originalRender, svg: candidate.svg },
    bindings: { source: spec.source.image, context: await bind(contextPath),
      lesson: lessonBinding, spec: await bind(specPath), render: await bind(renderPath),
      svg: await bind(svgPath) },
    previews: candidate.previews,
    delta: { field: 'source.authoritativeText', before: before.source.authoritativeText,
      after: spec.source.authoritativeText },
    command, output, geometryAndInventoryAndLabelsAndAssertionsUnchanged: true,
    svgBytesIdentical: true, sourceOrPreviewOpens: 0,
    newGeometryRepairs: 0, nativeContextUpdateCalls: 1,
  });
}
const output = `${tmp}/d022-n${number}-figure-context-update.json`;
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D022', status: 'context-only-native-update-identical-svg',
  correction: await bind(correctionPath), author: await bind(authorPath), rows,
  procedure: 'Existing D021 context-only native update reused. Source/geometry/labels/assertions and actual SVG pixels unchanged; first independent figure review remains pending.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
