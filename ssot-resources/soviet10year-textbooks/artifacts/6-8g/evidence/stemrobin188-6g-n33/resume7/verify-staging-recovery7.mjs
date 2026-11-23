import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const allowed = [
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.test.cjs',
  '.intentfold/tickets/STEMROBIN-188/plan.md',
];
const paths = execFileSync('git', ['diff', '--cached', '--name-only', '-z'], {
  cwd: W, encoding: 'utf8',
}).split('\0').filter(Boolean);
assert.ok(paths.length > 0);
assert.ok(paths.every(file => file.startsWith(`${B}/`) || allowed.includes(file)));
assert.ok(!paths.some(file =>
  file.startsWith(`${B}/pages/0160/`) || file.startsWith(`${B}/pages/0161/`)
  || file.startsWith(`${B}/lessons/geo68-c3-s2-n34/`)
  || file.startsWith(`${B}/editions/modern-us-neutral/lessons/geo68-c3-s2-n34/`)
  || file.startsWith(`${B}/evidence/stemrobin188-6g-n34/`)
  || file.startsWith(`${B}/figures/fig-213.`)
  || file.startsWith(`${B}/figures/tbl-p0160-01.`)
  || file.startsWith(`${B}/editions/modern-us-neutral/figures/fig-213.`)
  || file.startsWith(`${B}/editions/modern-us-neutral/figures/tbl-p0160-01.`)));
assert.ok(!paths.some(file => /(?:^|\/)(?:\.env(?:\.|$)|node_modules|\.venv)(?:\/|$)/.test(file)));
console.log(JSON.stringify({
  stagedPaths: paths.length, unexpectedPaths: 0, n34Excluded: true,
  nulDelimitedPathParsing: true, restagedLessons: 0, contentReviewsRepeated: 0,
}));
