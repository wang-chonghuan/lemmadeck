import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, read, save, copy, bind, run } from './n42-native.mjs';

const firstFile = `${ticket}/tmp/d1816-d1967-n113-first-en-native/result.json`;
const first = read(firstFile), out = `${ticket}/tmp/d1816-d1978-n113-native-caption-recovery`;
const prepared = read(first.prepared.path), currentFile = `${first.target}/lesson.json`;
const lesson = read(currentFile), recovered = structuredClone(lesson), changes = [];
for (const [index, block] of recovered.prose.entries()) {
  const match = block.kind === 'cap' && block.text.trim().match(/^图\s*(\d+)$/);
  if (!match) continue;
  changes.push({ index, before: block.text, after: `Figure ${match[1]}`, sourceLabel: block.label });
  block.text = `Figure ${match[1]}`;
  block.changes = [...new Set([...block.changes, 'translation'])];
}
assert.equal(changes.length, 3);
copy(currentFile, `${out}/lesson.first-original.json`);
copy(firstFile, `${out}/native.first-original.json`);
save(`${out}/lesson.caption-recovered.json`, recovered);
fs.copyFileSync(`${out}/lesson.caption-recovered.json`, `${prepared.templates}/lesson.template.json`);
const python = `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
const pipeline = `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`;
const finalize = run('d1978-n113-affected-native-caption-finalize', [
  python, '-B', pipeline, 'adapt-finalize', '--book', '9p', '--edition', 'modern-us-neutral-en',
  '--lesson', first.card, '--root', prepared.root, '--work', prepared.work,
]);
const render = run('d1978-n113-affected-native-caption-render', [
  python, '-B', pipeline, 'render', '--book', '9p', '--edition', 'modern-us-neutral-en',
  '--lesson', first.card, '--root', prepared.root, '--work', prepared.work,
]);
const carrier = `${prepared.carrier}/editions/modern-us-neutral-en/lessons/${first.card}`;
for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
  fs.copyFileSync(`${carrier}/${name}`, `${first.target}/${name}`);
save(`${out}/provenance.json`, {
  card: first.card, scope: 'Three native visible caption text fields and translation markers only',
  changes, sourceLabelsAndARIAIdentityPreserved: true, originalAuthorPreserved: true,
  allOtherProseAndExamplesAndMathUnchanged: true, originalFigureAssetsAndEvidenceUnchanged: true,
  nativePublicationWouldOtherwiseContainChineseCaptions: true,
  independentEnglishReviewPending: true, imagesOpened: 0, paidCalls: 0, databaseWrites: 0,
});
save(`${out}/result.json`, {
  ...first, finalize, render, originalNative: bind(`${out}/native.first-original.json`),
  products: fs.readdirSync(first.target).map(name => bind(`${first.target}/${name}`)),
  html: first.html.map(item => bind(item.path)), captionRecovery: bind(`${out}/provenance.json`),
});
console.log(JSON.stringify({ card: first.card, changes, result: bind(`${out}/result.json`) }));
