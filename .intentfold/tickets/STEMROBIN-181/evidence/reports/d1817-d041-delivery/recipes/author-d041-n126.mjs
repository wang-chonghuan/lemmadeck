import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/nuclear-root';
const work = '.tmp/STEMROBIN-181/d1817/author-work';
const id = 'phy10-c3-s3-n126';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const sourcePassPath = `${scratch}/d041-n126-source-pass.json`;
const sourcePass = read(sourcePassPath);
assert.equal(sourcePass.status, 'PASS-complete-object');
for (const file of sourcePass.bindings) assert.equal(hash(file.path), file.sha256);
const sourcePath = `${root}/10p/lessons/${id}/lesson.json`;
const source = read(sourcePath);
assert.equal(source.prose.length, 3);
assert.equal(source.exercise_count, 0);
assert.deepEqual(source.prose.map(block => block.source_refs), [['p0330#3'], ['p0330#4'], ['p0330#5']]);
const authored = {
  'modern-us-neutral': {
    locale: 'zh', title: '原子核与基本粒子',
    prose: [
      '我们已经多次遇到原子核和电子。\n原子物理学主要研究原子中电子的状态，以及电子与原子核的相互作用。',
      '起初，核物理学与粒子物理学并没有清楚分开。\n随着对原子核过程的研究，物理学家发现了越来越多种粒子。\n大约在 1950 年前后，粒子物理学逐渐成为独立的研究领域。\n**核物理学**着重研究原子核的结构和变化。\n**基本粒子物理学**研究粒子的基本性质、相互作用和转化。\n这两个领域有许多共同的研究问题和方法。',
      '接下来主要学习核物理学的基本问题，并在最后简要讨论基本粒子的性质。\n首先需要认识探测和记录这些微观过程的设备。\n这些设备记录原子核与粒子的碰撞和相互转化，为研究微观世界提供信息。',
    ],
  },
  'modern-us-neutral-en': {
    locale: 'en', title: 'The atomic nucleus and elementary particles',
    prose: [
      'We have already encountered atomic nuclei and electrons.\nAtomic physics mainly studies the states of electrons in atoms and their interactions with the nucleus.',
      'At first, nuclear physics and particle physics were not clearly separate fields.\nAs physicists studied nuclear processes, they discovered more and more kinds of particles.\nAround 1950, particle physics gradually became an independent field of research.\n**Nuclear physics** focuses on the structure and changes of atomic nuclei.\n**Elementary-particle physics** studies the basic properties of particles, their interactions, and their transformations.\nThe two fields share many research questions and methods.',
      'Next we will mainly study the basic questions of nuclear physics, with a brief discussion of elementary particles at the end.\nFirst we need to meet the devices that detect and record these microscopic processes.\nThey record collisions and transformations of nuclei and particles, providing information about events in the microscopic world.',
    ],
  },
};
const records = [];
for (const [edition, text] of Object.entries(authored)) {
  execFileSync('node', [`${scratch}/run-native.mjs`, `d041-${edition}-n126-first-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-prepare', '--book', '10p', '--root', root, '--work', work,
    '--edition', edition, '--lesson', id], { stdio: 'inherit' });
  const file = `${work}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
  const template = read(file);
  template.locale = text.locale;
  template.title = text.title;
  template.section_breaks = [];
  assert.equal(template.prose.length, text.prose.length);
  for (const [index, block] of template.prose.entries()) {
    assert.equal(block.source_text, source.prose[index].text);
    block.text = text.prose[index];
    block.changes = ['layout', 'context', 'scientific-clarification',
      ...(text.locale === 'en' ? ['translation'] : [])];
    block.numeric_changes = [];
    block.historical_entities = [];
  }
  fs.writeFileSync(file, JSON.stringify(template, null, 2) + '\n');
  records.push({ edition, template: bind(file), source: bind(sourcePath) });
}
const output = `${scratch}/d041-n126-first-author.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id, sourcePass: bind(sourcePassPath), root, records,
  scientificClarifications: [
    'Atomic physics primarily studies electronic states and electron-nucleus interactions, rather than being defined as every possible nuclear process.',
    'The source approximate year1950 remains an approximate mid-century emergence, not a precise first-invention date.',
    'The two disciplines retain their distinction and shared questions/methods; detectors remain the entry to microscopic events.',
  ],
  numericChanges: [], originalWrittenQuestions: 0, figures: 0,
  review: 'unreviewed-author-candidate', addedDeliveredCards: 0,
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ firstAuthor: bind(output), independentReviewPending: true }));
