import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s2-n35';
const N = `${B}/evidence/stemrobin188-6g-n35`;
const git = (args, input) => execFileSync('git', args, { cwd: W, encoding: 'utf8', input });
const paths = args => git(args).split('\0').filter(Boolean);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-188-textbooks');
assert.deepEqual(paths(['diff', '--cached', '--name-only', '-z']), [], 'Existing staging preserved; do not mix it into this lesson');
assert.equal(read(`${E}/lessons/${L}/choice-set/review.json`).outcome, 'pass');
for (const surface of ['text', 'exercises', 'choices'])
  assert.equal(read(`${N}/display7/${surface}.json`).status, 'pass');
const preparation = read(`${N}/preparation7/manifest.json`);
const roots = [
  `${B}/lessons/${L}`, `${E}/lessons/${L}`, N,
  '.intentfold/tickets/STEMROBIN-188/plan.md',
  ...preparation.sourcePages.flatMap(page => ['page.json', 'page.md', 'audit.json']
    .map(name => `${B}/pages/${String(page.physical).padStart(4, '0')}/${name}`)
    .filter(file => fs.existsSync(file))),
  ...[214, 215, 216, 217, 218].flatMap(number => [
    `${B}/figures/fig-${number}.png`,
    ...['svg', 'spec.json', 'render.json', 'review.json'].map(suffix => `${E}/figures/fig-${number}.${suffix}`),
  ]),
  ...['author-first11', 'independent-review12', 'affected-repair12']
    .map(name => `${B}/evidence/stemrobin188-6g-source163164/${name}`),
  ...['author-first12', 'independent-review13', 'two-text-defects-revision1-13']
    .map(name => `${B}/evidence/stemrobin188-6g-source165166/${name}`),
];
assert.ok(roots.every(file => fs.existsSync(file)), 'Missing required retained path');
git(['add', '--', ...roots]);
const indexes = [`${B}/book.json`, `${E}/book.json`];
for (const file of indexes) {
  const base = JSON.parse(git(['show', `HEAD:${file}`]));
  const working = read(file);
  const row = working.lessons.find(item => item.id === L);
  assert.ok(row && !base.lessons.some(item => item.id === L));
  const order = new Map(working.lessons.map((item, index) => [item.id, index]));
  base.lessons.push(row);
  base.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
  if (file === indexes[0])
    base.pages = paths(['ls-files', '--cached', '-z', `${B}/pages/*/page.json`]).length;
  const oid = git(['hash-object', '-w', '--stdin'], `${JSON.stringify(base, null, 2)}\n`).trim();
  git(['update-index', '--cacheinfo', `100644,${oid},${file}`]);
}
const staged = paths(['diff', '--cached', '--name-only', '-z']);
assert.ok(staged.every(file => indexes.includes(file)
  || roots.some(root => file === root || file.startsWith(`${root}/`))), 'Unexpected staged path');
assert.ok(!staged.some(file =>
  /(?:^|\/)(?:\.env(?:\.|$)|node_modules|\.venv)(?:\/|$)/.test(file)), 'Secret/runtime path staged');
assert.ok(!staged.some(file => /artifacts\/9-10g|two-page-affected-repair7/.test(file)));
console.log(JSON.stringify({ lesson: L, stagedPaths: staged.length, unexpectedPaths: 0,
  unrelatedStagingOrWorkingEditsTouched: false, indexes: 'HEAD plus N35 only' }));
