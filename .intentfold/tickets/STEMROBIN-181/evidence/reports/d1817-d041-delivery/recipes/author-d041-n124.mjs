import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/root';
const work = '.tmp/STEMROBIN-181/d1817/author-work';
const id = 'phy10-c3-s2-n124';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const passPath = `${scratch}/d041-n124-source-pass.json`;
const sourcePass = read(passPath);
assert.equal(sourcePass.status, 'PASS-complete-object');
for (const file of sourcePass.bindings) assert.equal(hash(file.path), file.sha256);
const sourcePath = `${root}/10p/lessons/${id}/lesson.json`;
const source = read(sourcePath);
assert.equal(source.id, id);
assert.equal(source.prose.length, 6);
assert.equal(source.exercise_count, 0);
assert.equal(source.prose.filter(row => row.kind === 'fig').length, 0);
assert.deepEqual(source.prose.map(row => row.source_refs), [
  ['p0323#6'], ['p0323#7'], ['p0324#1'], ['p0324#2'], ['p0324#3'], ['p0324#6'],
]);

const authored = {
  'modern-us-neutral': {
    locale: 'zh',
    title: '玻尔理论的困难　量子力学',
    prose: [
      '玻尔理论的重要成就是解释氢原子。\n它不仅说明氢会发出哪些谱线，还能定量计算这些谱线的位置。',
      '但把同一套模型用于氦原子和更复杂的原子时，并没有取得同样的成功。\n玻尔理论仍能给出一些重要的定性解释，却不能建立同样可靠的完整定量理论。',
      '困难来自这个理论内部的不一致。\n它用牛顿力学和库仑定律处理电子的运动，又加入无法从这些经典定律推出的量子假设。\n物理学需要一个更统一的框架。\n二十世纪二十年代，量子力学建立起来，量子电动力学也开始发展。',
      '在新的理论中，稳定态以及由能量差决定的辐射频率不再只是另行加入的假设，而能从理论的基本原则得到解释。\n不过，玻尔为确定轨道提出的量子化规则只是有适用范围的近似，并不是处处成立的通则。',
      '量子力学中的电子不像行星那样沿一条确定的轨道运行。\n**电子云**表示在空间各处发现电子的概率分布，并不是电子绕圈留下的轨迹①。\n设想把空间分成以原子核为中心的一层层薄球壳：氢原子处于最低能态时，在这些球壳中发现电子的径向概率分布，在玻尔半径附近达到最大，与（11.8）中的半径相对应。\n这要和单位体积的概率密度区分开；后者在这个状态下是核处最大。\n量子力学提供了研究电子云性质和结构的框架，但具体的定量计算可能很复杂。\n本课先建立概念，更深入的内容留待后续学习。',
      '①把电子云比作长时间曝光得到的模糊图像，只是帮助理解空间分布的比喻。\n它不表示电子像日常可见的物体那样沿一条路线来回运动。',
    ],
  },
  'modern-us-neutral-en': {
    locale: 'en',
    title: "Difficulties of Bohr's Theory: Quantum Mechanics",
    prose: [
      "Bohr's theory achieved an important success with hydrogen.\nIt explained not only which spectral lines hydrogen produces, but also their positions quantitatively.",
      'Applying the same model to helium and more complex atoms did not bring the same success.\nThe theory still gave important qualitative explanations, but it could not provide an equally reliable, complete quantitative theory.',
      "The difficulty came from an inconsistency within the theory.\nIt used Newtonian mechanics and Coulomb's law to describe electron motion, while adding quantum postulates that could not be derived from those classical laws.\nPhysics needed a more unified framework.\nDuring the nineteen-twenties, quantum mechanics took shape and quantum electrodynamics began to develop.",
      "In the new theories, stationary states and radiation frequencies determined by energy differences could be explained from general principles, rather than added as separate postulates.\nHowever, Bohr's particular rule for quantizing an orbit remained an approximation with a limited range of use.",
      'In quantum mechanics, an electron does not follow a definite orbit like a planet.\nAn **electron cloud** represents the probability of finding the electron in different parts of space, not a trail left by circling motion.①\nImagine dividing space into thin spherical shells centered on the nucleus: for hydrogen in its lowest-energy state, the radial probability distribution for finding the electron in these shells has its maximum near the Bohr radius, corresponding to the radius in (11.8).\nThis differs from probability density per unit volume, which has its maximum at the nucleus in this state.\nQuantum mechanics provides a framework for studying electron clouds, although detailed quantitative calculations can be difficult.\nHere we establish the main ideas and leave further detail for later study.',
      '①A blurred image made by a long exposure is only an analogy for understanding a spatial distribution.\nIt does not mean that an electron moves back and forth along a path like an everyday visible object.',
    ],
  },
};
const records = [];
for (const [edition, text] of Object.entries(authored)) {
  execFileSync('node', [`${scratch}/run-native.mjs`, `d041-${edition}-n124-first-prepare`,
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
    const entity = text.locale === 'en'
      ? { term: 'Bohr', source_term: '玻尔', reason: 'Same source-bound historical physicist; no fictional substitution.' }
      : { term: '玻尔', source_term: '玻尔', reason: 'Source-bound historical physicist; identity retained.' };
    block.historical_entities = block.source_text.includes(entity.source_term)
      && block.text.includes(entity.term) ? [entity] : [];
  }
  fs.writeFileSync(file, JSON.stringify(template, null, 2) + '\n');
  records.push({ edition, template: bind(file), source: bind(sourcePath) });
}
const output = `${scratch}/d041-n124-first-author.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id, sourcePass: bind(passPath), records,
  scientificClarifications: [
    'Radial shell probability peaks near the Bohr radius for hydrogen ground state; volume probability density peaks at the nucleus.',
    'An electron cloud is a probability distribution, not a classical path or literal long-exposure photograph.',
    'Quantum electrodynamics began developing in the twenties, rather than being completely finished at that date.',
    'Bohr quantization has a limited approximation domain; the source claim of complete correctness is not generalized to every orbit rule.',
  ],
  numericChanges: [], equationsAndReferencesChanged: false,
  review: 'unreviewed-author-candidate', completeDeliveredCardsAdded: 0,
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(output), records, reviewPending: true }));
