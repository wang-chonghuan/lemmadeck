import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s2-n34';
const N = `${B}/evidence/stemrobin188-6g-n34`;
const git = (args, input) => execFileSync('git', args, { cwd: W, encoding: 'utf8', input });
const paths = args => git(args).split('\0').filter(Boolean);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-188-textbooks');
assert.deepEqual(paths(['diff', '--cached', '--name-only', '-z']), [], 'Preserve unrelated staging');
assert.equal(read(`${E}/lessons/${L}/choice-set/review.json`).outcome, 'pass');
assert.equal(read(`${N}/display7/surfaces.json`).status, 'pass');
assert.equal(read(`${N}/display7/choices.json`).status, 'pass');
const checkpoint = '.intentfold/tickets/STEMROBIN-188/plan.md';
const sourceReview = `${B}/evidence/stemrobin188-6g-source163164/independent-review12`;
const roots = [
  `${B}/lessons/${L}`, `${E}/lessons/${L}`, N, checkpoint,
  ...['0160', '0161'].map(id => `${B}/pages/${id}`),
  ...['tbl-p0160-01', 'fig-213'].flatMap(id => [
    `${B}/figures/${id}.png`,
    ...['svg', 'spec.json', 'render.json', 'review.json'].map(ext => `${E}/figures/${id}.${ext}`),
  ]),
  ...['author-first10', 'independent-review11', 'two-affected-repairs11']
    .map(name => `${B}/evidence/stemrobin188-6g-source161162/${name}`),
  `${sourceReview}/retention.json`,
  `${sourceReview}/files/source161-affected-inputs-12/inputs.json`,
  `${sourceReview}/files/source163164-first-and161-affected-review-12/report.json`,
  `${sourceReview}/files/source163164-first-and161-affected-review-12/affected161-markdown-audit.receipt.json`,
];
assert.ok(roots.every(file => fs.existsSync(file)), 'Missing necessary retained source path');
git(['add', '--', ...roots]);

// Build only this lesson's index delta without changing unfinished working rows.
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
  || roots.some(root => file === root || file.startsWith(`${root}/`))), 'Unexpected staged paths');
assert.ok(!staged.some(file =>
  /(?:^|\/)(?:\.env(?:\.|$)|node_modules|\.venv)(?:\/|$)/.test(file)), 'Secret/runtime path staged');
assert.ok(!staged.some(file => /geo68-c3-s2-n35|artifacts\/9-10g/.test(file)));
console.log(JSON.stringify({ lesson: L, stagedPaths: staged.length, unexpectedPaths: 0,
  unrelatedStagingOrWorkingEditsTouched: false, indexes: 'HEAD plus N34 only' }));
