import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { root, owned, pages, binding, immutable, exists, nativeCommand, runNative } from './workflow.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const manifest = path.join(owned, 'inputs/prepared.json');
assert.equal(await exists(manifest), false);
const sourcePdf = await binding(path.join(root,
  'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf'));
assert.equal(sourcePdf.sha256, '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40');
const preparedPages = [];
for (const page of pages) {
  const stem = String(page).padStart(4, '0');
  const work = path.join(owned, 'work/10p/pages', stem);
  const names = ['page.png', 'page.grid.png', 'page.template.md', 'layout.json'];
  const ready = await Promise.all(names.map(name => exists(path.join(work, name))));
  assert.ok(ready.every(value => !value), 'Do not overwrite existing preparation.');
  const receiptPath = path.join(owned, 'commands', `prepare-${page}-initial.json`);
  const result = await runNative(nativeCommand('prepare', page), receiptPath);
  assert.equal(result.status, 0, result.stderr);
  const inputs = [];
  for (const name of names) inputs.push(await binding(path.join(work, name)));
  preparedPages.push({ physicalPage: page, inputs, receipt: await binding(receiptPath), preparedInputsReused: false });
}
const previous = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0115/page.md');
const previousBytes = await readFile(previous);
const previousMeta = JSON.parse(previousBytes.toString().split('---')[1]);
const previousBlocks = JSON.parse(await readFile(previous.replace(/\.md$/, '.json'))).blocks;
assert.equal(previousMeta.page, 115);
await immutable(path.join(owned, 'inputs/preceding-page115.md'), previousBytes);
await immutable(path.join(owned, 'inputs/preceding-page115.json'), await readFile(previous.replace(/\.md$/, '.json')));
await immutable(manifest, `${JSON.stringify({
  ticket: 'STEMROBIN-181', book: '10p', physicalPages: pages, pages: preparedPages, sourcePdf,
  precedingPageAuthority: await binding(previous),
  precedingPage: await binding(path.join(owned, 'inputs/preceding-page115.md')),
  precedingOpenText: previousBlocks.filter(block => block.kind === 'p' && block.open).map(block => block.lines),
  sourceApproval: false, newImageOpens: 0, canonicalWrites: 0,
  reusedPatterns: [
    await binding(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d042-10p-source112-115-author/workflow.mjs')),
    await binding(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d042-prepare-source112-115.mjs')),
  ],
}, null, 2)}\n`);
console.log(JSON.stringify({ preparation: await binding(manifest) }));
