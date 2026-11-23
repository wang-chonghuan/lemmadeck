import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const E = `${B}/editions/modern-us-neutral`;
const L = 'geo68-c3-s1-n33';
const N = `${B}/evidence/stemrobin188-6g-n33`;
const git = (args, input) => execFileSync('git', args, { cwd: W, encoding: 'utf8', input });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(git(['branch', '--show-current']).trim(), 'codex/STEMROBIN-188-textbooks');
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '', 'Preserve unrelated staging');
assert.equal(read(`${E}/lessons/${L}/choice-set/review.json`).outcome, 'pass');
assert.equal(read(`${N}/display7/surfaces.json`).status, 'pass');
assert.equal(read(`${N}/display7/choices.json`).status, 'pass');

const roots = [
  `${B}/lessons/${L}`, `${E}/lessons/${L}`, N,
  ...['0149', '0155', '0156', '0157', '0158', '0159'].map(id => `${B}/pages/${id}`),
  ...[209, 210, 211, 212].flatMap(id => [
    `${B}/figures/fig-${id}.png`,
    ...['svg', 'spec.json', 'render.json', 'review.json'].map(ext => `${E}/figures/fig-${id}.${ext}`),
  ]),
  `${B}/evidence/stemrobin188-6g-source149150/author-first06`,
  `${B}/evidence/stemrobin188-6g-source149150/independent-source08`,
  `${B}/evidence/stemrobin188-6g-source155156/author-first09`,
  `${B}/evidence/stemrobin188-6g-source155156/independent-review09`,
  `${B}/evidence/stemrobin188-6g-source155/footnote-owner-repair09`,
  `${B}/evidence/stemrobin188-6g-source155157158/affected-review10`,
  `${B}/evidence/stemrobin188-6g-source157158/author-first09`,
  `${B}/evidence/stemrobin188-6g-source157158/independent-review09`,
  `${B}/evidence/stemrobin188-6g-source157158/literal-repair10`,
  `${B}/evidence/stemrobin188-6g-source159160/author-first09`,
  `${B}/evidence/stemrobin188-6g-source159160/period-affected-review11`,
  `${B}/evidence/stemrobin188-6g-source159160/independent-review10`,
  `${B}/evidence/stemrobin188-6g-source159160/period-repair11`,
  '.intentfold/tickets/STEMROBIN-188/plan.md',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs',
];
assert.ok(roots.every(file => fs.existsSync(file)), 'Missing required retained source/review root');
git(['add', '--', ...roots]);

// Index blobs start from HEAD so unfinished lesson rows stay working changes.
for (const file of [`${B}/book.json`, `${E}/book.json`]) {
  const base = JSON.parse(git(['show', `HEAD:${file}`]));
  const working = read(file);
  const row = working.lessons.find(item => item.id === L);
  assert.ok(row && !base.lessons.some(item => item.id === L));
  const order = new Map(working.lessons.map((item, index) => [item.id, index]));
  base.lessons.push(row);
  base.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
  if (file === `${B}/book.json`)
    base.pages = git(['ls-files', '--cached', `${B}/pages/*/page.json`]).trim().split('\n').filter(Boolean).length;
  const oid = git(['hash-object', '-w', '--stdin'], `${JSON.stringify(base, null, 2)}\n`).trim();
  git(['update-index', '--cacheinfo', `100644,${oid},${file}`]);
}

// Stage only the already reviewed SEC_NUM delta, preserving other edits.
const parser = '.claude/skills/ld-s10y-lesson/tools/assemble.py';
const source = git(['show', `HEAD:${parser}`]);
const oldLine = String.raw`    r"\s*(?:\$\\blacktriangledown\$\s*)?(?:[.．、]\s*|\s+)(\S.*)$"`;
const newLine = String.raw`    r"\s*(?:(?:\$\\blacktriangledown\$|\u25bc)\s*)?(?:[.．、]\s*|\s+)(\S.*)$"`;
assert.equal(source.split(oldLine).length, 2);
assert.ok(fs.readFileSync(parser, 'utf8').includes(newLine));
const parserOid = git(['hash-object', '-w', '--stdin'], source.replace(oldLine, newLine)).trim();
git(['update-index', '--cacheinfo', `100644,${parserOid},${parser}`]);
const staged = git(['diff', '--cached', '--name-only']).trim().split('\n');
assert.ok(staged.every(file => file.startsWith(`${B}/`) || file === parser
  || file === '.intentfold/tickets/STEMROBIN-188/plan.md'
  || ['render_lesson.js', 'render_lesson.test.cjs'].some(name => file === `.claude/skills/ld-s10y-lesson/tools/${name}`)));
assert.ok(!staged.some(file => /(?:^|\/)(?:\.env(?:\.|$)|node_modules|\.venv)(?:\/|$)/.test(file)));
console.log(JSON.stringify({ lesson: L, stagedPaths: staged.length, unfinishedRowsAndOtherEditsPreserved: true }));
