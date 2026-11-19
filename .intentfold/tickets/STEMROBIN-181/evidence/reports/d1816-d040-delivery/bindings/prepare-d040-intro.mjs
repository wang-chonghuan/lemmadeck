import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const group = `${ticket}/tmp/d1816-source310313-review`;
const root = '.tmp/STEMROBIN-181/d1816/root';
const work = '.tmp/STEMROBIN-181/d1816/author-work';
const id = 'phy10-c3-s1';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const phase = `${group}/phase1-observation.json`;
assert.equal(hash(phase), 'efe8bd9148d84e3d9fbef5c2fd7610c5b4230bddbf8a80eda044e52cccebb9fe');
const report = read(phase);
for (const row of report.freeze_sequence) assert.equal(hash(row.path), row.sha256);
const sourcePath = `${root}/10p/lessons/${id}/lesson.json`;
const source = read(sourcePath);
assert.equal(source.id, id);
assert.equal(source.start_page, 310);
assert.equal(source.prose.length, 3);
assert.equal(source.exercise_count, 0);
const observationPath = `${group}/source0310.freeze.json`;
const observation = read(observationPath);
const candidatePath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0310/page.json';
const candidate = read(candidatePath);
assert.equal(candidate.meta.render.sha256, observation.source.sha256);
assert.equal(candidate.meta.printed_lines, 20);
for (let index = 0; index < observation.blocks.length; index++) {
  const block = observation.blocks[index];
  const target = candidate.blocks[index];
  assert.equal(target.kind, block.kind);
  const expected = [...block.lines];
  for (const span of block.heavy_spans_certain) {
    if (/^h[123]$/.test(block.kind)) continue;
    const line = span.line - 1;
    assert(expected[line].includes(span.text));
    expected[line] = expected[line].replace(span.text, `**${span.text}**`);
  }
  assert.deepEqual(target.lines, expected);
}
for (let index = 0; index < source.prose.length; index++) {
  const ref = `p0310#${index + 3}`;
  assert.deepEqual(source.prose[index].source_refs, [ref]);
  assert.equal(source.prose[index].text, candidate.blocks[index + 2].lines.join(''));
}
const boundaryPath = `${group}/source0311.freeze.json`;
assert.equal(read(boundaryPath).blocks[0].kind, 'h2');
assert.equal(read(boundaryPath).blocks[1].kind, 'h3');
assert(read(boundaryPath).boundaries.intro_right_boundary);
for (const page of [310, 311]) {
  assert.equal(read(`${scratch}/native/d040-source${page}-first-finalize/receipt.json`).exitCode, 0);
}
const sourceReceipt = `${scratch}/d040-intro-source-pass.json`;
assert(!fs.existsSync(sourceReceipt));
fs.writeFileSync(sourceReceipt, JSON.stringify({
  batch: 'D040', id, source: 'PASS-complete-object', phase1: bind(phase),
  observation: bind(observationPath), candidate: bind(candidatePath), originalLesson: bind(sourcePath),
  actualRightBoundary: bind(boundaryPath),
  sourceRefs: source.prose.flatMap(row => row.source_refs),
  source311Scope: 'Actual following header boundary only; numbered119 is not approved or complete.',
  sourceTextAndPrintedTypography: 'Frozen independent observations plus exact candidate binding and native20-line PASS.',
  figures: 0, exercises: 0, parentNewImageOpens: 0, addedDeliveredCards: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
const texts = {
  'modern-us-neutral': {
    title: '原子物理与核物理：引言',
    prose: [
      '发现原子具有复杂结构，推动了现代物理学的发展。\n为了定量解释原子光谱，科学家在研究原子结构的过程中发现了微观粒子运动的新规律——**量子力学**规律。',
      '**汤姆生模型**是早期解释原子内部电荷分布的一种模型。\n发现电子的英国物理学家汤姆生认为，正电荷均匀分布在原子的整个体积内，而电子位于这片正电荷之中。\n在这个模型中，最简单的氢原子是一个半径约为$10^{-8}$厘米的正电荷球，里面有一个电子。\n较复杂的原子含有多个电子，可以把它们比作散布在糕点中的葡萄干。\n这只是当时的一种模型：后来探测正电荷分布的实验表明，它不能正确描述原子的结构。',
      '卢瑟福的实验对理解原子结构十分重要。\n接下来将更细致地分析这些实验，理解它们为什么能检验不同的原子结构模型。',
    ],
    entities: [
      [],
      [{ term: '汤姆生', reason: 'Source-bound historical physicist J. J. Thomson; identity retained, not a fictional cultural substitution.' }],
      [{ term: '卢瑟福', reason: 'Source-bound historical physicist Ernest Rutherford; identity retained while the grade-specific invitation is localized.' }],
    ],
  },
  'modern-us-neutral-en': {
    title: 'Atomic and Nuclear Physics: Introduction',
    prose: [
      'The discovery that atoms have a complex internal structure helped shape modern physics.\nWhile developing a quantitative theory to explain atomic spectra, scientists discovered new laws of motion for microscopic particles: the laws of **quantum mechanics**.',
      'The **Thomson model** was an early model of the distribution of electric charge inside an atom.\nJ. J. Thomson, the British physicist who discovered the electron, proposed that positive charge was spread uniformly throughout the atom, with electrons embedded in it.\nIn this model, the simplest atom, hydrogen, was a positively charged sphere with a radius of about $10^{-8}$ centimeters and one electron inside.\nMore complex atoms contained several electrons, like raisins scattered through a cake.\nThis was a historical model: later experiments on the distribution of positive charge showed that it did not correctly describe atomic structure.',
      "Ernest Rutherford's experiments were important in revealing atomic structure.\nWe will examine these experiments more closely to understand how they can test different models of an atom.",
    ],
    entities: [
      [],
      [
        { term: 'Thomson', source_term: '汤姆生', reason: 'English name of the same source-bound historical physicist J. J. Thomson.' },
        { term: 'British', source_term: '英国', reason: "Translation of the source's historical national descriptor; no new identity is introduced." },
      ],
      [{ term: 'Ernest Rutherford', source_term: '厄奈斯特·卢瑟福', reason: 'English name of the same historical scientist explicitly identified in the source.' }],
    ],
  },
};
const records = [];
for (const [edition, authored] of Object.entries(texts)) {
  execFileSync('node', [`${scratch}/run-native.mjs`, `d040-${edition}-intro-first-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-prepare', '--book', '10p', '--root', root, '--work', work,
    '--edition', edition, '--lesson', id], { stdio: 'inherit' });
  const file = `${work}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
  const template = read(file);
  assert.equal(template.prose.length, 3);
  template.title = authored.title;
  for (let index = 0; index < template.prose.length; index++) {
    const row = template.prose[index];
    assert.equal(row.source_text, source.prose[index].text);
    row.text = authored.prose[index];
    row.changes = ['layout', 'context', 'scientific-clarification', ...(edition.endsWith('-en') ? ['translation'] : [])];
    row.numeric_changes = [];
    row.historical_entities = authored.entities[index];
  }
  template.section_breaks = [];
  fs.writeFileSync(file, JSON.stringify(template, null, 2) + '\n');
  records.push({ edition, template: bind(file), source: bind(sourcePath) });
}
const output = `${scratch}/d040-intro-first-author.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D040', id, root, work, sourcePass: bind(sourceReceipt), records,
  scientificClarifications: ['The historical Thomson model is an early charge-distribution model, not the first atomic model of any kind.', 'Radius and source mathematical notation are unchanged.'],
  historicalIdentity: 'Thomson and Rutherford remain real source-bound scientists in both locales.',
  modernReview: 'pending', parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), sourcePass: bind(sourceReceipt), records, modernReviewPending: true }));
