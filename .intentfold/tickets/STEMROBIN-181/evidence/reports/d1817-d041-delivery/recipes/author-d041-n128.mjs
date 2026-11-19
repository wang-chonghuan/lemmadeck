import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/n128-root';
const work = '.tmp/STEMROBIN-181/d1817/author-work';
const id = 'phy10-c3-s3-n128';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const sourcePassPath = `${scratch}/d041-n128-source-pass.json`;
const sourcePass = read(sourcePassPath);
assert.equal(sourcePass.status, 'PASS-complete-object');
for (const binding of sourcePass.bindings) assert.equal(hash(binding.path), binding.sha256);
const sourcePath = `${root}/10p/lessons/${id}/lesson.json`;
const source = read(sourcePath);
assert.equal(source.prose.length, 7);
const authored = {
  'modern-us-neutral': {
    locale: 'zh', title: '天然放射现象的发现',
    prose: [
      '**天然放射现象**后来成为研究原子核结构的重要线索，它的发现起初来自一个意外。\n此前发现 $x$ 射线时，快速电子撞击放电管的玻璃壁，还伴随着管壁发光。\n贝克勒尔长期研究物质受光照后继续发光的余辉现象，并用铀盐做实验。',
      '贝克勒尔想知道：铀盐受光照而发光时，会不会同时放出某种能穿透遮挡物的射线？\n当时还不能把这种未知射线直接认定为后来辨明的 $\\alpha$ 射线。\n他用厚黑纸包住照相底片，在纸上放铀盐，再让它们受到阳光照射。\n显影后，底片上放铀盐的地方变黑了。\n这表明铀盐发出的射线能穿过黑纸，使底片感光，具有类似 $x$ 射线的穿透作用。\n他起初认为，射线是阳光照射的结果。\n在 1896 年 2 月的一次阴天，他把底片放进抽屉，底片上放着铜十字，铜十字上覆盖铀盐。\n过了两天，他把底片显影，仍看到了清晰的十字阴影。\n**这说明铀盐不需要阳光照射，也会自发放出某种射线。**\n这个意外推动了进一步研究，但科学发现不能只靠偶然，还需要实验和检验。',
      '不久，贝克勒尔发现铀盐的射线也能像 $x$ 射线那样电离空气，使验电器放电。\n他研究不同的铀化合物，发现在相同测量条件下，射线强度主要取决于样品中铀的数量，而不是铀组成哪一种化合物。\n这表明放射性是铀原子本身的性质，不是某种特定化合物的性质。',
      '研究者接着寻找其他会自发放出射线的元素。\n1898 年，在法国工作的玛丽·居里和其他科学家研究并发现了钍的放射性。\n玛丽·居里和丈夫皮埃尔·居里又系统研究含铀和钍的矿石，识别出此前未知的元素钋。\n钋的名称来自玛丽·居里的祖国波兰。',
      '后来，他们又发现了能强烈放出射线的新元素，并把它命名为镭，这个名称来自表示射线的词。\n玛丽·居里把物质自发放出这种辐射的性质称为**放射性**。',
      '镭在周期表中常用 [226] 标记，它表示一种镭同位素的质量数，不是精确的平均相对原子质量。\n镭的原子序数是 88；在它被发现以前，周期表中相应的位置还没有已知元素。\n根据化学性质，镭属于碱土元素。',
      '按今天的认识，原子序数从 83 起的元素都没有稳定同位素。\n这不表示原子序数更小的元素就不能有放射性同位素。',
    ],
  },
  'modern-us-neutral-en': {
    locale: 'en', title: 'The discovery of natural radioactivity',
    prose: [
      '**Natural radioactivity** later became an important clue to the structure of the atomic nucleus, and its discovery began with an unexpected result.\nWhen $x$ rays had first been discovered, fast electrons struck the glass wall of a discharge tube, and the wall also glowed.\nBecquerel had long studied the afterglow of substances exposed to light, using uranium salts in his experiments.',
      'Becquerel asked whether uranium salts might emit penetrating radiation at the same time as they glowed after exposure to light.\nAt that stage, the unknown radiation could not simply be identified as the $\\alpha$ rays distinguished later.\nHe wrapped a photographic plate in thick black paper, placed uranium salts on the paper, and exposed them to sunlight.\nAfter development, the plate was dark where the salts had been placed.\nThe salts emitted radiation that penetrated the paper and affected the plate, showing a penetrating action similar to that of $x$ rays.\nAt first, he thought sunlight had caused the emission.\nIn 1896, on a cloudy day in month 2 (February), he put a plate in a drawer, with a copper cross on the plate and uranium salts over the cross.\nTwo days later, he developed the plate and still found a clear shadow of the cross.\n**The uranium salts could emit radiation spontaneously without exposure to sunlight.**\nThis unexpected result encouraged further research, but discovery also requires experiments and checks.',
      'Soon Becquerel found that radiation from uranium salts could ionize air and discharge an electroscope, much as $x$ rays could.\nHe tested different uranium compounds and found that, under the same measurement conditions, the radiation intensity depended mainly on the amount of uranium in the sample, not on which compound contained it.\nRadioactivity was therefore a property of uranium atoms themselves, rather than of one particular compound.',
      'Researchers then looked for other elements that could emit radiation spontaneously.\nIn 1898, Marie Curie, working in France, and other scientists studied and discovered the radioactivity of thorium.\nMarie Curie and her husband Pierre Curie systematically studied ores containing uranium and thorium and identified a previously unknown element, polonium.\nIts name came from her homeland, Poland.',
      'Later they discovered another new element that emitted strong radiation and named it radium, from a word meaning ray.\nMarie Curie called the property of spontaneously emitting this radiation **radioactivity**.',
      'A periodic-table entry for radium often gives [226], indicating the mass number of a radium isotope, not an exact average relative atomic mass.\nRadium has atomic number 88; before its discovery, that place in the periodic table had no known element.\nIts chemical properties place it among the alkaline-earth elements.',
      'According to current knowledge, elements with atomic numbers starting at 83 have no stable isotopes.\nThis does not mean that elements with lower atomic numbers cannot have radioactive isotopes.',
    ],
  },
};
const primary = [
  ['becquerel', 'Becquerel facts, Work', 'Uranium salts spontaneously emit penetrating radiation recorded on a photographic plate; it was not X-ray radiation.'],
  ['curie', '1911 lecture, opening and discovery sections', 'Marie Curie described radioactivity as an atomic property, named it, and investigated thorium and new elements with Pierre Curie.'],
  ['radium-nist', 'Ra table, atomic number and isotope226 row', 'Ra atomic number88; isotope mass number226 is distinct from its relative atomic mass.'],
  ['nist-mass-convention', 'Notes, bracketed values', 'Brackets identify an isotope mass number for elements without a characteristic natural isotopic abundance.'],
  ['bismuth-decay', 'Experimental detection of alpha-particles from the radioactive decay of natural bismuth, abstract', 'Experimental detection established that natural bismuth is radioactive, rather than a stable exception at atomic number83.'],
].map(([name, locator, fact]) => {
  const directory = `${scratch}/native/d041-n128-${name}-primary`;
  const receipt = read(`${directory}/receipt.json`);
  assert.equal(receipt.exitCode, 0);
  return { url: receipt.command.at(-1), locator, fact, stdout: bind(`${directory}/stdout.txt`),
    acquisition: bind(`${directory}/receipt.json`) };
});
const entities = {
  0: [['贝克勒尔', 'Becquerel']],
  1: [['贝克勒尔', 'Becquerel']],
  2: [['贝克勒尔', 'Becquerel']],
  3: [['玛丽·斯可罗多夫斯卡·居里', 'Marie Curie', '玛丽·居里'],
    ['比埃尔·居里', 'Pierre Curie', '皮埃尔·居里'], ['法国', 'France'], ['波兰', 'Poland']],
  4: [['居里夫妇', 'Marie Curie', '玛丽·居里']],
};
const records = [];
for (const [edition, text] of Object.entries(authored)) {
  execFileSync('node', [`${scratch}/run-native.mjs`, `d041-${edition}-n128-first-prepare`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-prepare', '--book', '10p', '--root', root, '--work', work,
    '--edition', edition, '--lesson', id], { stdio: 'inherit' });
  const file = `${work}/adapt/10p/${edition}/lessons/${id}/lesson.template.json`;
  const template = read(file);
  template.locale = text.locale;
  template.title = text.title;
  template.section_breaks = [];
  assert.equal(template.prose.length, 7);
  for (const [index, block] of template.prose.entries()) {
    assert.equal(block.source_text, source.prose[index].text);
    block.text = text.prose[index];
    block.changes = ['layout', 'context', 'scientific-clarification', 'translation'];
    block.numeric_changes = [];
    block.historical_entities = (entities[index] || []).map(([source_term, english, chinese]) => ({
      source_term, term: text.locale === 'en' ? english : (chinese || source_term),
      reason: 'Source-bound historical person or place retained; localized spelling only.',
    }));
  }
  fs.writeFileSync(file, JSON.stringify(template, null, 2) + '\n');
  records.push({ edition, template: bind(file), source: bind(sourcePath) });
}
const output = `${scratch}/d041-n128-first-author.json`;
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id, sourcePass: bind(sourcePassPath), root, records, primary,
  clarifications: [
    'Unknown initial radiation is not preidentified as alpha; the observed alpha token remains in a qualified explanation.',
    'Afterglow description replaces the unusual archival term only in modern prose.',
    'Same-condition uranium quantity comparison is distinguished from a universal chemistry-independent intensity claim.',
    'Identification of polonium is not confused with isolating a macroscopic pure sample; Marie Curie receives naming credit.',
    'Bracketed226 is an isotope mass-number convention, not an exact average atomic mass.',
    'No stable isotopes from atomic number83 upward; lower-numbered radioactive isotopes are not excluded.',
  ],
  acquisitionLimits: [
    'CIAAW radium fetch returned HTTP404 despite exit0 and is not evidence.',
    'CIAAW bismuth atomic-weight page does not prove radioactive decay.',
    'Saved raw primary text stays scratch; only concise facts, hashes, URLs and locators may be promoted.',
  ],
  numericChanges: [], review: 'unreviewed-author-candidate', figures: 0, originalWrittenQuestions: 0,
  preExecutionRecovery: {
    error: 'SyntaxError: Unexpected identifier s in node --check, at the possessive after Marie Curie.',
    cause: 'Overescaped apostrophe in a single-quoted author string.',
    resolution: 'Reworded the same historical statement before first author execution; no generated candidate, review or image was repeated.',
  },
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false, addedDeliveredCards: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ firstAuthor: bind(output), independentReviewPending: true }));
