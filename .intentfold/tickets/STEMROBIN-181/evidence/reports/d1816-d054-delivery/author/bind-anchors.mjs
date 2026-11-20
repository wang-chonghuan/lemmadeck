import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d054-n14-author');
for (const [locale, edition, starts] of [
  ['zh', 'modern-us-neutral', ['要理解振幅为什么会显著增大', '摩擦和其他阻力会显著影响共振', '弱阻尼系统在共振附近']],
  ['en', 'modern-us-neutral-en', ['To understand why the amplitude can grow', 'Friction and other forms of resistance', 'Near resonance, a weakly damped system']],
]) {
  const file = path.join(root, '.tmp/STEMROBIN-181/d1816-d054/n14-work/adapt/10p', edition, 'lessons/phy10-c1-s2-n14/lesson.template.json');
  const doc = JSON.parse(fs.readFileSync(file));
  const flow = JSON.parse(fs.readFileSync(path.join(own, `${locale}-prose-flow-before-anchors.json`)));
  doc.section_breaks = starts.map(start => {
    const match = flow.paragraphs.filter(p => p.text.startsWith(start));
    assert.equal(match.length, 1);
    const after = match[0];
    const before = flow.paragraphs.find(p => p.index === after.index - 1);
    assert(before);
    return { before: before.text, after: after.text };
  });
  fs.writeFileSync(file, JSON.stringify(doc, null, 2) + '\n');
}
