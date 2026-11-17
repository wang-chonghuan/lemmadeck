import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d031-n113-unit-repair`;
assert.ok(!await exists(`${folder}/before/result.json`));
const failures = [
  [`${ticket}/tmp/d031-n113-pixel-review-b.json`,
    'dae850aa2b9ed75048ab56efb8dc72f5d8792153556e3b6c79db1287b23ae6db'],
  [`${ticket}/tmp/d031-n113-pixel-review.json`,
    '3a6b39e7f1b70019674d985a7270b5429a2ea5c110133c4c5f8dcaac824a333a'],
];
for (const [file, sha256] of failures) {
  await verify(file, sha256);
  const report = await read(file);
  assert.equal(report.status, 'fail');
  assert.deepEqual(report.findings.map(row => row.id), ['D031-PIXEL-B-001']);
}
const tool = '.claude/skills/ld-s10y-lesson/tools/render_lesson.js';
await immutableWrite(`${folder}/before/render_lesson.js`, await bytes(tool));
const displayPath = `${ticket}/tmp/offline-d024/result-phy9-c2-s4-n113.json`;
const display = await read(displayPath);
await verify(displayPath, '24e1da510ae4b33388b724c4170dddd59a6fa050e966bf518ba8d7b4d4ce59c1');
const protectedFiles = await Promise.all([
  ...display.results.flatMap(row => [
    row.sourceHtml.path, row.screenshot,
    ...(row.metrics.scrollEndScreenshot ? [row.metrics.scrollEndScreenshot] : []),
  ]),
  ...['phy9-c2-s4-n111', 'phy9-c2-s4-n113', 'phy9-c2-s5-n114'].flatMap(card =>
    ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(name =>
      `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${card}/${name}`)),
  `${ticket}/production-meter.json`,
  'ssot-resources/soviet10year-textbooks/artifacts/9p/book.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/book.json',
].map(bind));
await immutableWrite(`${folder}/before/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card: 'phy9-c2-s4-n113',
  status: 'original-failure-and-inputs-frozen',
  failures: await Promise.all(failures.map(([file]) => bind(file))),
  display: await bind(displayPath),
  tool: await bind(`${folder}/before/render_lesson.js`),
  protectedFiles,
  limits: 'Snapshot only; no stage replay, image opening, product write or completion claim.',
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(`${folder}/before/result.json`)));
