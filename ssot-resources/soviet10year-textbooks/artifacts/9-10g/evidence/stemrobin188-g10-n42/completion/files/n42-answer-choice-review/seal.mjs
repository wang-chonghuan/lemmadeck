import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Unexpected cwd');
const out = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n42-answer-choice-review');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const canonical = value => JSON.stringify(value, (key, val) =>
  val && typeof val === 'object' && !Array.isArray(val)
    ? Object.fromEntries(Object.keys(val).sort().map(key => [key, val[key]]))
    : val).replace(/[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));
const [phase, ...names] = process.argv.slice(2);
if (!['FIRST', 'PREKEY'].includes(phase) || !names.length) throw new Error('Invalid phase');
const bindings = [];
const bind = (name, role) => {
  const absolute = path.resolve(root, name);
  const bytes = fs.readFileSync(absolute);
  const entry = { path: absolute, sha256: hash(bytes), size: bytes.length, role };
  if (absolute.endsWith('.json')) entry.canonical_sha256 = hash(canonical(JSON.parse(bytes)));
  bindings.push(entry);
};
if (phase === 'FIRST') {
  const input = '.intentfold/tickets/STEMROBIN-188/tmp/n42-review-inputs/source-only.json';
  bind(input, 'source-only input');
  const source = JSON.parse(fs.readFileSync(path.join(root, input)));
  for (const entry of source.seed.trace) bind(entry.path, 'seed trace bytes, not repeated freshness gate');
  for (const image of source.imageInputs) {
    bind(image.original, 'opened original crop');
    bind(image.modern, 'current SVG rendered and opened as PNG');
    bind(image.spec, 'spec bytes only, not prior figure gate');
  }
  for (const prerequisite of source.prerequisites) bind(prerequisite.path, 'whole-file hash only; interpreted supplied extracts only');
  bind('ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c2-s1-n42/lesson.json', 'raw source bytes');
  bind('ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c2-s1-n42/exercises.json', 'raw exercise bytes');
  for (const name of ['render-current.mjs', 'render-receipt.json', 'fig-g10-01-current-480.png', 'fig-g10-02-current-480.png']) bind(path.join(out, name), 'review-local render evidence');
} else {
  const visible = '.intentfold/tickets/STEMROBIN-188/tmp/n42-review-inputs/visible-questions.json';
  bind(visible, 'visible-only input');
  const snapshot = path.join(out, 'PREKEY-visible-snapshot.json');
  fs.writeFileSync(snapshot, fs.readFileSync(path.join(root, visible)), { flag: 'wx', mode: 0o444 });
  bind(snapshot, 'immutable exact visible-only snapshot');
  bind(path.join(out, 'FIRST-seal.json'), 'earlier independent source seal');
}
for (const name of names) {
  const absolute = path.resolve(out, name);
  if (!absolute.startsWith(out + path.sep)) throw new Error('Seal outside output directory');
  bind(absolute, 'immutable independent review record');
  fs.chmodSync(absolute, 0o444);
}
const receipt = {
  schema: 'n42-review-phase-seal-v1',
  phase,
  sealed_at: new Date().toISOString(),
  next_phase: phase === 'FIRST' ? 'Visible questions only; no author internals or candidate' : 'Author comparison allowed; candidate remains key-last',
  bindings,
};
const target = path.join(out, `${phase}-seal.json`);
fs.writeFileSync(target, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx', mode: 0o444 });
console.log(JSON.stringify({ phase, seal_path: target, seal_sha256: hash(fs.readFileSync(target)), bindings }, null, 2));
