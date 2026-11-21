import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const progress = JSON.parse(fs.readFileSync(path.join(base, 'source-progress.json'), 'utf8'));
assert.equal(progress.n47.completeOffline, true);
assert.equal(progress.n47.completeLessonDelta, 1);
assert.equal(git('diff', '--cached', '--name-only'), '',
  'Preserve any user staging; this narrow stage requires an initially empty index');
const head = git('rev-parse', 'HEAD');
assert.equal(head, 'e6aa79ccce50e1edf4a8ed88285c1f72ce23bf82');
assert.equal(git('rev-parse', 'refs/remotes/origin/codex/STEMROBIN-184-textbooks'), head);
const localHistoricalBranch = git('rev-parse', 'refs/heads/codex/STEMROBIN-184-textbooks');
assert.equal(localHistoricalBranch, 'bd853c8f2e1d762ce9b92d19dd4bc8eeb4bf434d');
const layoutPath = '.claude/skills/ld-s10y-lesson/tools/layout.py';
assert.equal(hash(fs.readFileSync(path.join(root, layoutPath))),
  'e38dff05a7ed6819e631db8df9fbfb033512a23db6fc1a172c233dcec291421e');
const usagePath = '.intentfold/tickets/STEMROBIN-184/usage.json';
const currentUsage = JSON.parse(fs.readFileSync(path.join(root, usagePath), 'utf8'));
const headUsage = JSON.parse(git('show', `HEAD:${usagePath}`));
const restoredHeadOnlyKeys = [];
for (const [key, value] of Object.entries(headUsage)) {
  if (!Object.hasOwn(currentUsage, key)) {
    currentUsage[key] = value;
    restoredHeadOnlyKeys.push(key);
  }
}
fs.writeFileSync(path.join(root, usagePath), JSON.stringify(currentUsage, null, 2) + '\n');
const bookPath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/book.json';
const currentBook = JSON.parse(fs.readFileSync(path.join(root, bookPath), 'utf8'));
const headBook = JSON.parse(git('show', `HEAD:${bookPath}`));
const lesson = currentBook.lessons.find(item => item.id === 'ana9-c4-s2-n47');
assert(lesson);
assert(!headBook.lessons.some(item => item.id === lesson.id));
const stagedBook = {
  ...headBook,
  pages: headBook.pages + 2,
  lessons: [...headBook.lessons, lesson],
};
assert.equal(currentBook.pages - stagedBook.pages, 3,
  'Three unrelated untracked canonical pages stay outside this delivery');
const paths = [
  layoutPath,
  '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
  '.claude/skills/ld-s10y-lesson/tools/test_layout_nested_fraction_rows.py',
  '.claude/skills/ld-s10y-lesson/tools/test_layout_fraction_support_projection.py',
  '.intentfold/tickets/STEMROBIN-184/plan.md', usagePath,
  'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0168',
  'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0169',
  'ssot-resources/soviet10year-textbooks/artifacts/9c/lessons/ana9-c4-s2-n47',
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c4-s2-n47',
  'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/book.json',
  ...[
    'nov21-1846-source168', 'nov21-1846-source168-review-stage1',
    'nov21-1846-source168-review-wrap', 'nov21-1846-source168-review-stage2',
    'nov21-1846-source168-count-diagnostic', 'nov21-1846-source168-count-repair',
    'nov21-1846-source169', 'nov21-1846-source169-review-zero-view',
    'nov21-1846-source169-review-stage1', 'nov21-1846-source169-review-stage2',
    'nov21-1846-source169-post-intake', 'nov21-1846-n47-offline-hold', 'nov21-1846-n47',
  ].map(name => `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/${name}`),
];
git('add', '--', ...paths);
const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
  cwd: root, encoding: 'utf8',
  input: JSON.stringify(stagedBook, null, 2) + '\n',
}).trim();
git('update-index', '--add', '--cacheinfo', `100644,${blob},${bookPath}`);
const staged = git('diff', '--cached', '--name-only').split('\n').filter(Boolean);
assert(staged.length > 0);
assert(!staged.some(file => /(^|\/)\.env(?:$|\/)/.test(file)));
assert(!staged.some(file => /pages\/(0104|0122|0135)\//.test(file)));
assert(staged.every(file => file === bookPath
  || paths.some(allowed => file === allowed || file.startsWith(`${allowed}/`))));
const receipt = {
  schema: 'stemrobin1846/n47-narrow-stage@1', at: new Date().toISOString(),
  head, remote: head, branch: 'codex/STEMROBIN-184-textbooks',
  localHistoricalBranchUnchanged: localHistoricalBranch,
  stagedFiles: staged.length, paths, stagedBookBlob: blob,
  bookPageCount: { head: headBook.pages, staged: stagedBook.pages,
    workingPreserved: currentBook.pages, unrelatedDeltaPreserved: 3 },
  restoredHeadOnlyUsageKeys: restoredHeadOnlyKeys,
  parentNewImagesOrDecodes: 0, verificationReplays: 0,
  commitOrPushYet: false, finish: 'review',
};
fs.writeFileSync(path.join(base, 'n47-narrow-stage-receipt.json'),
  JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
