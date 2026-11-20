import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
const work = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-work/adapt/10p');
const lesson = 'phy10-c1-s2-n14';
const authored = JSON.parse(fs.readFileSync(path.join(own, 'authored-text.json')));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const receipt = { role: 'AUTHOR', source: hash(path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-root/10p/lessons', lesson, 'lesson.json')), targets: [] };
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const target = path.join(work, edition, 'lessons', lesson, 'lesson.template.json');
  const doc = JSON.parse(fs.readFileSync(target));
  assert.equal(doc.prose.length, authored[locale].length);
  const before = hash(target);
  doc.locale = locale;
  if (locale === 'en') {
    doc.title = 'Resonance';
    for (const figure of doc.figures) figure.label = figure.label.replace(/^图 /, 'Figure ');
  }
  doc.prose.forEach((block, index) => {
    block.text = authored[locale][index];
    block.changes = block.text === block.source_text ? [] : ['context', 'layout', ...(locale === 'en' ? ['translation'] : [])];
    if (locale === 'en' && /^图 \d+$/.test(block.label || '')) block.label = block.label.replace(/^图 /, 'Figure ');
  });
  fs.writeFileSync(target, JSON.stringify(doc, null, 2) + '\n');
  receipt.targets.push({ path: target, beforeSha256: before, sha256: hash(target) });
}
fs.writeFileSync(path.join(own, 'materialize-text.receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt));
