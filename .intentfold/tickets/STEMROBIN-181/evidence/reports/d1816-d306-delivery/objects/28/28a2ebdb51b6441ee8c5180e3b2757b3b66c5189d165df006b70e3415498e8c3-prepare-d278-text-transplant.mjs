import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = '.tmp/STEMROBIN-181/d1816-d276/root';
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const out = `${ticket}/tmp/d1816-d278-text-transplant`;
const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
const lessons = ['phy10-c1-s3-n17', 'phy10-c1-s3-n18'];
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const freezeFile = `${ticket}/tmp/d1816-d274-n17-n18-text-author/freeze.json`;
const freeze = JSON.parse(fs.readFileSync(freezeFile));
const results = [];
fs.mkdirSync(out, { recursive: true });
assert(!fs.existsSync(`${out}/result.json`));
for (const edition of editions) {
  execFileSync(process.execPath, [
    `${ticket}/tmp/d1816-recovery/run-native.mjs`, `d278-${edition}-fresh-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-prepare',
    '--book', '10p', '--edition', edition, '--root', root, '--work', work,
    ...lessons.flatMap(id => ['--lesson', id]),
  ], { cwd: repo, stdio: 'inherit' });
  for (const id of lessons) {
    const oldFile = `.tmp/STEMROBIN-181/d1816-d270/source-work/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
    const input = bind(oldFile);
    assert.equal(input.sha256, freeze.templates.find(item => item.path === input.path).sha256);
    const file = `${work}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
    const before = bind(file);
    const fresh = JSON.parse(fs.readFileSync(file));
    const old = JSON.parse(fs.readFileSync(oldFile));
    const source = structuredClone(fresh.source);
    const identity = fresh.prose.map(block => ({
      source_refs: block.source_refs, source_text: block.source_text,
      kind: block.kind, id: block.id, printed_page: block.printed_page,
    }));
    assert.equal(fresh.prose.length, old.prose.length);
    for (const field of freeze.transplant.lesson_fields)
      if (Object.hasOwn(old, field)) fresh[field] = old[field];
    for (const block of fresh.prose) {
      const authored = old.prose.filter(item =>
        JSON.stringify(item.source_refs) === JSON.stringify(block.source_refs));
      assert.equal(authored.length, 1, `Ambiguous refs in ${id}`);
      for (const field of freeze.transplant.prose_fields)
        if (Object.hasOwn(authored[0], field)) block[field] = structuredClone(authored[0][field]);
    }
    for (const figure of fresh.figures) {
      const previous = old.figures.find(item => item.id === figure.id);
      assert(previous);
      figure.label = previous.label;
    }
    assert.deepEqual(fresh.source, source);
    assert.deepEqual(fresh.prose.map(block => ({
      source_refs: block.source_refs, source_text: block.source_text,
      kind: block.kind, id: block.id, printed_page: block.printed_page,
    })), identity);
    assert.equal(fresh.exercise_count, 0);
    fs.writeFileSync(file, JSON.stringify(fresh, null, 2) + '\n');
    results.push({ edition, id, authored: input, freshBefore: before,
      transplanted: bind(file), sourceBindingPreserved: true, sourceBlocks: identity.length });
  }
}
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  batch: 'D278', root, work, authorFreeze: bind(freezeFile), results,
  independentModernReview: 'pending', sourceApproval: false,
  completeCoursesAdded: 0, databaseWrites: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${out}/result.json`) }));
