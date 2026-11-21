import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const git = (args, options = {}) => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options,
});
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
const completion = read('.tmp/stemrobin-184-six/n81-completion.json');
assert.equal(completion.completeLessonDelta, 1);
assert.equal(completion.lesson, 'ana10-c6-s2-n81');
assert.equal(completion.choices.semanticOutcome, 'pass');
const record = '.intentfold/tickets/STEMROBIN-184/usage.json';
const before = JSON.parse(git(['show', `HEAD:${record}`]));
const current = read(record);
const changedKeys = [...new Set([...Object.keys(before), ...Object.keys(current)])]
  .filter(key => JSON.stringify(before[key]) !== JSON.stringify(current[key]));
const selectedKeys = ['nov21_1846_n81_n82_resume', 'nov21_1846_n81_complete'];
const stagedUsage = structuredClone(before);
for (const key of selectedKeys) {
  assert(current[key]);
  stagedUsage[key] = current[key];
}
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c';
const index = `${book}/editions/modern-us-neutral/book.json`;
const oldIndex = JSON.parse(git(['show', `HEAD:${index}`]));
const newIndex = read(index);
const oldIds = new Set(oldIndex.lessons.map(item => item.id));
assert.deepEqual(newIndex.lessons.filter(item => !oldIds.has(item.id)).map(item => item.id),
  ['ana10-c6-s2-n81']);
assert.deepEqual(newIndex.lessons.filter(item => oldIds.has(item.id)), oldIndex.lessons);
const paths = [
  '.intentfold/tickets/STEMROBIN-184/plan.md', record, index,
  `${book}/editions/modern-us-neutral/lessons/ana10-c6-s2-n81`,
  ...Array.from({ length: 9 }, (_, i) => i + 12).flatMap(n =>
    ['spec.json', 'svg', 'render.json', 'review.json'].map(ext =>
      `${book}/editions/modern-us-neutral/figures/fig-${n}.${ext}`)),
];
git(['add', '--', ...paths]);
const usageObject = git(['hash-object', '-w', '--stdin'], {
  input: JSON.stringify(stagedUsage, null, 2) + '\n',
}).trim();
git(['update-index', '--add', '--cacheinfo', `100644,${usageObject},${record}`]);
const evidence = `${book}/evidence/nov21-1846-n81-production`;
git(['add', '-f', '--', evidence]);
const files = git(['diff', '--cached', '--name-only']).trim().split('\n');
assert(files.every(file => paths.some(p => file === p || file.startsWith(p + '/'))
  || file.startsWith(evidence + '/')));
assert(files.every(file => !file.includes('/9c/') && !file.startsWith('.agents/')
  && !file.startsWith('.claude/') && !file.startsWith('.tmp/')));
assert(files.every(file => file !== '.env' && file !== 'app/.env'));
console.log(JSON.stringify({ stagedFiles: files.length, selectedUsageKeys: selectedKeys,
  excludedPendingUsageKeys: changedKeys.filter(key => !selectedKeys.includes(key)),
  completedLessonDelta: 1, selectedLesson: completion.lesson,
  excluded: ['9c', 'n82', 'repair tools', 'root scratch', '.env'],
  branchCreationOrForceOperations: 0 }));
