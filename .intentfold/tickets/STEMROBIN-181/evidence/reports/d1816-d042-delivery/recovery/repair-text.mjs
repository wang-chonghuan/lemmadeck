import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery';
const root = '.tmp/STEMROBIN-181/d1818/isotope-root/10p';
const work = '.tmp/STEMROBIN-181/d1818/isotope-author-work/adapt/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file));
const bindings = [];
const sourceBefore = [132, 133].map(number => `${root}/lessons/phy10-c3-s3-n${number}/lesson.json`).map(file => ({ path: file, sha256: hash(file) }));
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  for (const number of [132, 133]) {
    const id = `phy10-c3-s3-n${number}`;
    const file = `${work}/${edition}/lessons/${id}/lesson.template.json`;
    const candidate = read(file);
    const snapshot = `${scratch}/first-candidates/${locale}-n${number}.template.json`;
    fs.mkdirSync(path.dirname(snapshot), { recursive: true });
    fs.copyFileSync(file, snapshot, fs.constants.COPYFILE_EXCL);
    const affected = [];
    const replace = (index, from, to) => {
      assert(candidate.prose[index].text.includes(from), `${number}/${locale}/${index}`);
      candidate.prose[index].text = candidate.prose[index].text.replace(from, to);
      affected.push(index);
    };
    if (number === 132 && locale === 'zh') {
      replace(2,
        '实验显示氖中有质量不同的原子，其中两个主要成分的质量数分别为20和22，天然混合物的平均相对原子质量约为20.2。',
        '实验显示氖中有质量不同的原子，绝大多数属于质量数为20的成分，另有较少的质量数为22的成分，天然混合物的平均相对原子质量约为20.2。\n质量数数的是一个原子核中质子和中子的总个数。');
      replace(7,
        '天然元素的平均相对原子质量是各种同位素按丰度加权的平均值，例如氯的平均值约为$35.5$。',
        '天然元素的平均相对原子质量要按各种同位素所占的比例来计算：哪种同位素的原子较多，平均值就更靠近它的相对质量。\n这叫按丰度加权，丰度指一种同位素在该元素的原子中所占的比例。\n例如氯的平均相对原子质量约为$35.5$。');
    } else if (number === 132) {
      replace(2,
        'They showed neon atoms with different masses, including two major components with mass numbers 20 and 22, while the natural mixture had an average relative atomic mass of about 20.2 in the account.',
        'They showed neon atoms with different masses: the great majority belonged to the component with mass number 20, while a smaller portion had mass number 22, and the natural mixture had an average relative atomic mass of about 20.2 in the account.\nMass number counts the total number of protons and neutrons in a nucleus.');
      replace(7,
        'The average relative atomic mass of a natural element is an abundance-weighted average over its isotopes, such as the approximate value $35.5$ for chlorine.',
        'The average relative atomic mass of a natural element is calculated using the proportion of atoms of each isotope: an isotope with more atoms pulls the average closer to its relative mass.\nThis is called abundance weighting, and abundance means the proportion of that isotope among the atoms of the element.\nFor example, chlorine has an average relative atomic mass of about $35.5$.');
    } else if (locale === 'zh') {
      replace(0,
        '原书用下面的反应式表示这一过程，式中的左上标表示质量数：',
        '核电荷中的$e$表示基本电荷的大小，也就是一个质子带有的正电荷量。\n原书用下面的反应式表示这一过程，$M$表示质量数，$Z$表示质子数，$X$和$Y$分别代指衰变前后元素的化学符号，不是指定某两种元素：');
      replace(1,
        '这里的质量数是核子总数，不是精确的相对原子质量。',
        '质子和中子合称核子，所以质量数是质子与中子的总个数，不是精确的相对原子质量。\n后面的电子符号中，$e$代表电子这个粒子；它与核电荷表达式中表示基本电荷大小的$e$用途不同。');
    } else {
      replace(0,
        'The original textbook represents this with the following equation, in which the upper-left index is the mass number:',
        'In the nuclear charge, $e$ means the magnitude of the elementary charge, the positive charge carried by a proton.\nThe original textbook represents the process with the following equation: $M$ means mass number, $Z$ means proton number, and $X$ and $Y$ stand for the chemical symbols of the original and daughter elements, rather than naming two particular elements:');
      replace(1,
        'Mass number counts nucleons and is not an exact relative atomic mass.',
        'Protons and neutrons are together called nucleons, so mass number counts the total number of protons and neutrons, not an exact relative atomic mass.\nIn the electron symbol used later, $e$ stands for the electron as a particle; this differs from its use for the magnitude of the elementary charge in an expression for nuclear charge.');
    }
    fs.writeFileSync(file, JSON.stringify(candidate, null, 2) + '\n');
    bindings.push({ id, locale, template: { path: file, sha256: hash(file) }, first: { path: snapshot, sha256: hash(snapshot) }, affectedProse: affected });
  }
}
for (const row of sourceBefore) assert.equal(hash(row.path), row.sha256);
fs.writeFileSync(`${scratch}/text-repair.json`, JSON.stringify({
  batch: 'D042', findings: ['N132-NEON-ABUNDANCE', 'N132-COUNT-AND-AVERAGE', 'N133-NUCLEON-AND-SYMBOL-LEGEND'],
  bindings, sourceBefore, sourceWrites: false, sourceEquationsChanged: false, newNumericalQuantities: false,
  historicalHoldsCleared: [], paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ templates: bindings.length, affectedProse: { n132: [2, 7], n133: [0, 1] }, sourceWrites: false }));
