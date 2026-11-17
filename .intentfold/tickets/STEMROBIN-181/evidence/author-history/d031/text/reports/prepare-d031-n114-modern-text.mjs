import assert from 'node:assert/strict';
import {
  ticket, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const card = 'phy9-c2-s5-n114';
const tmp = `${ticket}/tmp`;
const folder = `${tmp}/d031-n114-modern-text-prepared`;
assert.ok(!await exists(`${folder}/result.json`));
const science = `${tmp}/9p-n114-science-review.json`;
await verify(science, '75456eabec7b4a666cd5e00db5b2c7f8791b902f96190f4a5f026cb19e0151b8');
assert.equal((await read(science)).status, 'PASS');
const freeze = `${tmp}/9p-n114-prose-freeze.json`;
await verify(freeze, '200785cc8ef4675b8bc3f233202c5d6c2837781ba28b281757fd287548ed679e');
const author = `${tmp}/d031-n114-prose-author`;
const source = `${author}/work/adapt/9p/modern-us-neutral/lessons/${card}`;
const destination = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
await verify(`${source}/lesson.template.json`, '72802abd6f3c39e3389862d3cbfd29f62242d6de529bfeee761748962b988cb6');
await verify(`${source}/exercises.template.json`, '5a154d90562c2dbc30f543fe9afb2d1f7d3ddc92ee3d1073ddbf98b47ba9774b');
await verify(`${source}/figures.template.json`, 'fac021ca0097bfd870174b9bcfd6c2a95e57ac72abe36c55f6f6929d9302c9f7');
const bindings = [];
for (const name of ['lesson', 'exercises', 'figures']) {
  const file = `${source}/${name}.template.json`;
  const target = `${destination}/${name}.template.json`;
  assert.ok(!await exists(target));
  await immutableWrite(target, await bytes(file));
  bindings.push({ input: await bind(file), prepared: await bind(target) });
}
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'science-passed-text-prepared-figures-pending',
  science: await bind(science), freeze: await bind(freeze), bindings,
  sourceTasks: 0,
  limits: 'Only byte-exact approved text and unapproved placeholder figure manifest copied to standard scratch templates. No new adapt-prepare, source assembly, SCI, figure approval, finalize, render, DB, commit/push or complete-card claim.',
}, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(`${folder}/result.json`) }));
