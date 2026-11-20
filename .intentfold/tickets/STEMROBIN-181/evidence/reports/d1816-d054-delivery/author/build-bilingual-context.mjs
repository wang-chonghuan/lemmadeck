import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const native = JSON.parse(fs.readFileSync(path.join(own, 'native-text-validation.json')));
assert.equal(native.status, 'pass');
const locales = native.locales.map(row => {
  assert.equal(hash(row.template.path), row.template.sha256);
  const template = JSON.parse(fs.readFileSync(row.template.path));
  return {
    locale: row.locale, edition: template.edition, lesson: template.id, title: template.title,
    template: row.template, source: { path: template.source.path, sha256: template.source.sha256 },
    prose: template.prose, section_breaks: template.section_breaks, figures: template.figures,
    exercise_count: template.exercise_count, exercises: [],
    completeText: template.prose.filter(x => ['p', 'cap'].includes(x.kind)).map(x => x.text).join('\n\n'),
  };
});
fs.writeFileSync(path.join(own, 'bilingual-context.json'), JSON.stringify({
  schema: 'STEMROBIN-181/d054-bilingual-complete-context@1', role: 'AUTHOR',
  independentReview: 'pending', nativeTextCheck: { path: path.join(own, 'native-text-validation.json'), sha256: hash(path.join(own, 'native-text-validation.json')) },
  locales,
}, null, 2) + '\n');
console.log(hash(path.join(own, 'bilingual-context.json')));
