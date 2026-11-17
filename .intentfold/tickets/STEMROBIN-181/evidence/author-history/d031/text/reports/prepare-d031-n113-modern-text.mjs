import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const tmp = `${ticket}/tmp`;
const card = 'phy9-c2-s4-n113';
const folder = `${tmp}/d031-n113-modern-text-prepared`;
assert.ok(!await exists(`${folder}/result.json`));
const sciencePath = `${tmp}/9p-n113-science-review.json`;
await verify(sciencePath, 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7');
const science = await read(sciencePath);
assert.equal(science.status, 'SCI-PASS');
assert.equal(science.pass, true);
assert.deepEqual(science.findings, []);
const freezePath = `${tmp}/9p-n113-prose-freeze.json`;
await verify(freezePath, '3f9d0bdba786f30525533347860332583bc369827efa46ca6fc9061c9748d3f1');
const freeze = await read(freezePath);
const book = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const author = `${tmp}/d031-n113-prose-author`;
const protectedFiles = await Promise.all([
  `${book}/book.json`, `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  ...['phy9-c2-s4-n107', card, 'phy9-c2-s4-t18'].flatMap(id =>
    ['lesson.json', 'lesson.md', 'exercises.json'].map(name => `${book}/lessons/${id}/${name}`)),
  ...['fig-229', 'fig-230', 'fig-231', 'fig-232'].flatMap(id =>
    ['png', 'svg'].map(extension => `${book}/figures/${id}.${extension}`)),
].map(bind));
const expected = {
  'page.md': {
    before: '759112f2db7857656cacb7b0a177dae27eaaed096794bddcf4a3bdc29919a0c4',
    after: 'f8d60450d40e413431d0b02bf5da6c7be5f98580b58de801f642afa73f15d4a4',
  },
  'page.json': {
    before: '5bc16a4ea153fef472f488246c6e70a8246866d7380ca7c78174c3d69bc8a190',
    after: '8757a291aec564709a207a7e68103841fe1ad89adf3244364bb244cab1a2a90f',
  },
  'audit.json': {
    before: '9e5753b362dc170a36eb24b7140aab1a05b4847d3fc0f7b2d3fdf457ab3d8d0c',
    after: 'ee8d0cddb0c24ef6e426347c13f3d3d5238a85d050a64dbc0700ddc13a6c1a71',
  },
};
const metadata = [];
for (const [name, sha] of Object.entries(expected)) {
  const target = `${book}/pages/0278/${name}`;
  const source = `${author}/artifacts/9p/pages/0278/${name}`;
  await verify(target, sha.before);
  await verify(source, sha.after);
  await immutableWrite(`${folder}/before/${name}`, await bytes(target));
}
for (const [name, sha] of Object.entries(expected)) {
  const target = `${book}/pages/0278/${name}`;
  const source = `${author}/artifacts/9p/pages/0278/${name}`;
  await fs.writeFile(absolute(target), await bytes(source));
  await verify(target, sha.after);
  metadata.push({ input: await bind(source), current: await bind(target),
    previous: await bind(`${folder}/before/${name}`) });
}
const source = `${author}/work/adapt/9p/modern-us-neutral/lessons/${card}`;
const destination = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
const templates = [];
for (const name of ['lesson', 'exercises', 'figures']) {
  const input = `${source}/${name}.template.json`;
  const target = `${destination}/${name}.template.json`;
  const binding = freeze.ownedFileManifest.find(row => absolute(row.path) === absolute(input));
  assert.ok(binding);
  await verify(input, binding.sha256);
  assert.ok(!await exists(target));
  await immutableWrite(target, await bytes(input));
  templates.push({ input: await bind(input), prepared: await bind(target) });
}
for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'science-passed-errata-and-text-prepared-figures-pending',
  science: await bind(sciencePath), freeze: await bind(freezePath),
  approvedErrata: science.approvedSourceBoundErrata, metadata, templates, protectedFiles,
  sourceFidelityEvidenceReused: science.sourcePreservation,
  sourceTasks: 2, workedExamples: 2, newUnsolvedTasks: 0,
  limits: 'Only approved page278 errata metadata and byte-exact approved modern text templates migrated. Existing raw blocks, raw lesson/example bytes, crops, source book and meter unchanged. Original SOURCE/native receipts retain old hashes as history; this receipt binds current metadata. No recount, assemble, adapt-prepare, SCI/figure replay, finalize/render/browser, commit/push, DB or complete-card claim.',
}, null, 2)}\n`);
console.log(JSON.stringify({ receipt: await bind(`${folder}/result.json`) }));
