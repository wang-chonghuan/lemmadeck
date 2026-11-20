import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const O = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d097-source322323-affected324-svg298-review');
assert.equal(process.cwd(), W);
const phase = process.argv[2];
assert.ok(['before', 'after'].includes(phase));
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
const expected = new Map();
function add(file, sha256, bytes) {
  const absolute = path.resolve(W, file);
  assert.ok(absolute.startsWith(W + '/'));
  const prior = expected.get(absolute);
  if (prior) assert.equal(prior.sha256, sha256);
  expected.set(absolute, { path: absolute, sha256, bytes });
}
function walk(v) {
  if (!v || typeof v !== 'object') return;
  if (v.path?.startsWith(W + '/') && v.sha256) add(v.path, v.sha256, v.bytes);
  for (const value of Object.values(v)) walk(value);
}
const freezes = [
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d084-source322323-author/author-freeze.json',
    '3e49196e5d684d8c3d07a4b5e7ae553fa2b8c0fe6f2e7483d22d48e12bd332ab'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d094-source324325-author/author-freeze.json',
    '24c0b262df501878b9223954db16cd7240649134842334107ac4d713b9f603f9'],
];
for (const [file, hash] of freezes) {
  add(file, hash);
  walk(JSON.parse(fs.readFileSync(path.join(W, file), 'utf8')));
}
const restoration = '.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d094-retained-source-paths/retained.json';
const restorationBytes = fs.readFileSync(path.join(W, restoration));
add(restoration, digest(restorationBytes), restorationBytes.length);
const restored = JSON.parse(restorationBytes);
for (const entry of restored.products) add(entry.path, entry.sha256);
for (const file of [
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0321/page.json',
]) {
  const bytes = fs.readFileSync(path.join(W, file));
  add(file, digest(bytes), bytes.length);
}
const bindings = [...expected.values()].sort((a, b) => a.path.localeCompare(b.path)).map(entry => {
  const bytes = fs.readFileSync(entry.path);
  const sha256 = digest(bytes);
  assert.equal(sha256, entry.sha256, entry.path);
  if (entry.bytes !== undefined) assert.equal(bytes.length, entry.bytes, entry.path);
  return { path: entry.path, sha256, bytes: bytes.length };
});
const images = [
  ['SOURCE322grid', '.tmp/ld-s10y-lesson/9p/pages/0322/page.grid.png'],
  ['RAW296PNG', '.tmp/ld-s10y-lesson/9p/pages/0322/figures/fig-296.png'],
  ['nativeSVG296preview', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d084-source322323-author/previews/fig-296.native.png'],
  ['SOURCE323grid', '.tmp/ld-s10y-lesson/9p/pages/0323/page.grid.png'],
  ['RAW297PNG', '.tmp/ld-s10y-lesson/9p/pages/0323/figures/fig-297.png'],
  ['nativeSVG297preview', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d084-source322323-author/previews/fig-297.native.png'],
  ['SOURCE324grid-affected-only', '.tmp/ld-s10y-lesson/9p/pages/0324/page.grid.png'],
  ['nativeSVG298preview', '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d094-source324325-author/fig-298.native-preview.png'],
].map(([id, file], i) => {
  const absolute = path.join(W, file);
  const bytes = fs.readFileSync(absolute);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
  const entry = bindings.find(v => v.path === absolute);
  assert.ok(entry);
  return { ordinal: i + 1, id, ...entry, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
});
const stable = { schema: 'D097/current-input-bindings@1', reviewer: 'D097', ticket: 'STEMROBIN-181', workdir: W, bindings, plannedImages: images };
const target = path.join(O, `bindings-${phase}.json`);
assert.ok(!fs.existsSync(target), 'Evidence is append-only');
if (phase === 'after') {
  const before = JSON.parse(fs.readFileSync(path.join(O, 'bindings-before.json'), 'utf8'));
  assert.deepEqual(stable, before, 'Reviewed input bytes changed');
}
fs.writeFileSync(target, JSON.stringify(stable, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ phase, path: target, sha256: digest(fs.readFileSync(target)), boundFiles: bindings.length, imageBindings: images }));
