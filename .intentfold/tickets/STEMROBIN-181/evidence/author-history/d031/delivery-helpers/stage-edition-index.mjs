import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const [book] = process.argv.slice(2);
assert.ok(['9p', '10p'].includes(book));
const prefix = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral`;
const indexPath = `${prefix}/book.json`;
const index = JSON.parse(await fs.readFile(indexPath));
const staged = new Set(execFileSync('git', ['ls-files', '--cached', `${prefix}/lessons`], {
  encoding: 'utf8',
}).trim().split('\n'));
const omitted = index.lessons.filter(row => !staged.has(`${prefix}/lessons/${row.id}/lesson.json`));
index.lessons = index.lessons.filter(row => staged.has(`${prefix}/lessons/${row.id}/lesson.json`));
assert.ok(index.lessons.length);
for (const row of index.lessons) {
  for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    assert.ok(staged.has(`${prefix}/lessons/${row.id}/${name}`), `Incomplete staged ${row.id}/${name}`);
  }
}
const bytes = JSON.stringify(index, null, 2) + '\n';
const object = execFileSync('git', ['hash-object', '-w', '--stdin'], {
  input: bytes, encoding: 'utf8',
}).trim();
execFileSync('git', ['update-index', '--cacheinfo', `100644,${object},${indexPath}`]);
console.log(`Staged ${book} generated index for ${index.lessons.length} staged lessons; omitted ${omitted.map(row => row.id).join(', ') || 'none'}. Working index and unfinished lesson files unchanged.`);
