import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const F = `${T}/tmp/d1816-d083-n126-affected-author/author-freeze.json`;
const B = '.tmp/STEMROBIN-181/d1816-d088';
const I = 'phy9-c2-s6-n126';
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const verify = r => assert.equal(bind(r.path).sha256, r.sha256, r.path);
assert.equal(bind(F).sha256, '8e1e31e8027c1f1e0392d655e08d0a0c7e574ea03be8cc3a39fd39b7fdfc1e5c');
const author = read(F), copies = [];
const copy = (row, target) => {
  verify(row);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(row.path, target, fs.constants.COPYFILE_EXCL);
  copies.push({ source: row, target: bind(target) });
};
for (const row of author.sourceFiles) {
  const relative = row.path.slice(row.path.indexOf('/9p/pages/') + 4);
  copy(row, `${B}/root/9p/${relative}`);
}
for (const row of author.authoritativeRawLesson) copy(row, `${B}/root/9p/lessons/${I}/${path.basename(row.path)}`);
for (const row of author.sourceFigure.isolatedLibrary) copy(row, `${B}/root/9p/figures/${path.basename(row.path)}`);
for (const locale of author.editions) {
  for (const row of locale.templates) copy(row,
    `${B}/work/adapt/9p/${locale.edition}/lessons/${I}/${path.basename(row.path)}`);
}
execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, 'd088-n126-isolated-carrier-reindex',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'reindex', '--book', '9p', '--root', `${B}/root`,
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'], { cwd: repo, stdio: 'inherit' });
const out = `${T}/tmp/d1816-d088-n126-promotion/prepared.json`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({
  batch: 'D088', lesson: I, status: 'isolated-carrier-prepared-figure-affected-review-pending',
  author: bind(F), copies, sourceReviewReused: true, sourcePagesAdded: 0,
  completeCoursesAdded: 0, canonicalWrites: false, approvalsAdded: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'prepared-only', lesson: I, copies: copies.length }));
