import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d330-n149-first-preparation`;
const prepared = JSON.parse(fs.readFileSync(`${O}/prepared.json`));
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
assert(!fs.existsSync(`${O}/author-freeze.json`));
const source = read(prepared.source.path);
assert.equal(bind(prepared.source.path).sha256, prepared.source.sha256);
const zh = source.prose.map(block => block.text);
zh[0] = '$\\beta$ **衰变的性质**　在这里讨论的 $\\beta$ 衰变中，核内的中子转变为质子，并产生电子；电子不是预先存放在核中的。电子离开核后，核的电荷，即质子数增加 $1$，质量数不变，中子数减少 $1$。在这种 $\\beta$ 放射过程中，质子留在核内，电子飞出核外；完整过程还包括下文介绍的反中微子。中子可以在适当的核内保持稳定，不能据此认为任意束缚中子都稳定。';
zh[1] = '同一种初始核发生同一种衰变时，可以放出能量不同的电子，而形成的最终核相同。如果只把初始核与最终核、电子作能量对账，就会出现差额。这曾使人怀疑能量守恒定律；并不是已经证明能量不守恒，而是还没有把全部产物计入。';
zh[2] = '**泡利的假设**　在瑞士工作的物理学家泡利提出，衰变时还有一种未被当时仪器记录到的“隐”粒子，与质子和电子一同产生，并带走差额的能量。原书采用不带电、无静止质量的近似描述它。难以记录它的关键是它与物质相互作用极弱，不能理解成它绝对不能产生电离或核反应。';
zh[3] = '如果假设粒子完全不与任何东西相互作用，实验就无法检验这个解释，能量仿佛随粒子永远消失了。泡利的假设不是这种说法：粒子与物质的相互作用极弱，但不是不存在。因此它可以穿过很厚的物质，也仍有被实验发现的可能。';
zh[4] = '费米把这种粒子称为**中微子**，意思是“小中子”。原书把它的静止质量写成 $0$，并在这个无质量近似中说它不能静止、产生后就以$300000$ 千米/秒运动。这是原书的历史近似，不是今天对中微子质量和速度的精确结论。计算表明，中微子在一定厚度的物质中发生相互作用的机会很小，因此实验探测十分困难。“地球对中微子比玻璃对光更透明”是在强调这种很强的穿透能力。';
zh[5] = '**自由中子的衰变**　中微子不仅出现在核的$\\beta$ 衰变中，也出现在一些自由粒子的自发衰变中，自由中子就是例子。核内相互作用可以使适当核中的中子稳定；自由中子则会衰变。原书把其平均寿命近似写成16分钟，这不是今天的精确测量值。这类测量需要中子源，核反应堆能够提供强中子束。';
zh[6] = '本课以中微子(符号$\\nu$)和反中微子(符号$\\bar{\\nu}$)区分这一过程的粒子。中子转变为质子并产生电子时，放出的正是反中微子。';
zh[8] = '在这个衰变中，不能只把质子和电子的能量相加来对账。还必须计入反中微子带走的能量，才是完整的能量守恒关系。';
zh[9] = '**中微子的实验发现**　从假设提出到实验发现，经过了大约26年。实验记录到的不是直接可见的中微子径迹，而是反中微子引发反应的产物。理论预言，能量足够的反中微子与质子发生反应时，可以产生正电子和中子：';
zh[11] = '反中微子与物质发生相互作用的机会很小，但数量足够多时仍有希望记录到反应。核反应堆中，铀核裂变会形成大量短寿命的$\\beta$放射性碎片，从而产生大量反中微子。原书叙述的实验于1956年在美国进行：在反应堆附近的地下，用铅和石蜡屏蔽装置；水体为200升，外围液态闪烁物约300升。$\\gamma$量子通过闪烁物时产生闪光。这里保留的是原书的装置概述，不是可供照做的实验操作。';
zh[12] = '反中微子与水中的质子反应后，产生正电子(图 277 中 $A$ 点)。正电子随后与电子在$B$ 点湮灭，产生2个$\\gamma$ 量子。$\\gamma$ 量子使闪烁物发光，仪器记录这个早期信号。反应同时产生的中子经过多次散射后，在$C$ 点被水中加入的镉核俘获；镉核随后放出一些$\\gamma$量子，形成延迟信号。开始的两个向不同方向飞出的$\\gamma$量子和稍后产生的$\\gamma$量子相互配合，帮助辨认反中微子事件；可靠性还依赖排除背景，不能仅凭任意两次闪光就证明一次事件。';
zh[15] = '**粒子衰变的实质**　粒子衰变是粒子的转化，不能一概理解成复杂物体被拆成原先存放在内部的零件。这个结论也不能用来判断每一种粒子是否由更小的粒子组成。';
zh[16] = '**衰变产物与原粒子的关系，不像瓦罐碎片与完整瓦罐的关系。**原书曾用“反中微子以光速运动”来说明它不是预先藏在中子里面的零件；这个速度说法属于前述旧近似，不能单独作为组成关系的证明。中子衰变产生的质子和电子，可以结合成氢原子。氢原子是另一个系统，不是中子。';
zh[17] = '粒子的寿命有限，并不能单凭这一点判定它不是基本粒子。原书按当时的分类把中子也叫作基本粒子；今天不能把这个旧称当成中子没有内部结构的结论。重氢——**氘**的原子核由中子和质子组成；它是稳定的，但“稳定”与“没有组成部分”不是一回事。';
const en = [
  '$\\beta$ **Decay**\nIn the type of $\\beta$ decay discussed here, a neutron in the nucleus becomes a proton and an electron is produced. The electron was not stored inside the nucleus beforehand.\nThe proton number, and therefore the nuclear charge, increases by $1$; the mass number stays the same and the neutron number decreases by $1$.\nIn this $\\beta$ process, the proton remains in the nucleus and the electron leaves it. The complete process also includes the antineutrino introduced below.\nA neutron can remain stable in a suitable nucleus; this does not mean that every bound neutron is stable.',
  'The same kind of initial nucleus can undergo the same decay and emit electrons with different energies while producing the same final nucleus.\nIf only the final nucleus and the electron are included in the energy account, some energy appears to be missing.\nThis once raised doubts about energy conservation. It did not prove that energy was destroyed: a decay product was missing from the account.',
  '**Pauli\'s hypothesis**\nPauli, a physicist working in Switzerland, proposed an additional particle that the instruments of the time had not detected.\nIt was produced together with the proton and electron and carried away the missing energy.\nThe original textbook described it using an electrically neutral, massless approximation. Its very weak interaction with matter makes detection difficult; it is not absolutely incapable of causing ionization or a nuclear reaction.',
  'A particle that never interacted with anything would make this explanation impossible to test: energy would seem to disappear with it forever.\nPauli\'s proposal was different. The interaction was extremely weak, not absent.\nThe particle could therefore pass through thick material while still having a chance of being detected.',
  'Fermi named the particle the **neutrino**, meaning \"little neutron.\"\nThe original textbook wrote its rest mass as $0$ and, within that massless approximation, said it could not be at rest and moved at$300000$ kilometers per second as soon as it was produced.\nThese are historical approximations in the textbook, not precise present-day conclusions about neutrino mass and speed.\nCalculations showed that interactions in a given thickness of material would be very rare, making detection difficult.\nThe comparison \"Earth is more transparent to neutrinos than glass is to light\" emphasizes their strong penetrating ability.',
  '**Free-neutron decay**\nNeutrinos occur not only in nuclear$\\beta$ decay but also in the spontaneous decay of some free particles, including the neutron.\nNuclear interactions can keep a neutron stable in a suitable nucleus, whereas a free neutron decays.\nThe textbook gave its mean lifetime approximately as16 minutes; this is not a precise modern measurement.\nExperiments need neutron sources, and nuclear reactors can provide intense neutron beams.',
  'This lesson distinguishes the neutrino (symbol$\\nu$) from the antineutrino (symbol$\\bar{\\nu}$) in this process.\nWhen a neutron becomes a proton and emits an electron, an antineutrino is emitted.',
  '$n \\rightarrow p + e^{-} + \\bar{\\nu}$',
  'The energy account for this decay is incomplete if it includes only the proton and electron.\nThe energy carried away by the antineutrino must also be included to apply energy conservation.',
  '**Experimental discovery**\nAbout26 years passed between the hypothesis and the experimental discovery.\nThe instruments recorded reaction products, not a directly visible neutrino track.\nTheory predicted that an antineutrino with sufficient energy could interact with a proton and produce a neutron and a positron:',
  '$p + \\bar{\\nu} \\rightarrow n + e^{+}$',
  'An antineutrino rarely interacts with matter, but a sufficiently large number can produce detectable events.\nUranium fission in a reactor creates many short-lived$\\beta$-radioactive fragments, producing many antineutrinos.\nThe experiment described in the textbook took place in1956 in the United States: a detector near the reactor was placed underground and shielded with lead and paraffin.\nThe textbook describes200 liters of water and about300 liters of liquid scintillator around it.\nA$\\gamma$ quantum passing through the scintillator produces a flash. This is the original book\'s outline of the apparatus, not instructions for performing the experiment.',
  'An antineutrino interaction with a proton in the water produces a positron (point$A$ in Figure 277).\nThe positron subsequently annihilates with an electron at$B$, producing2$\\gamma$ quanta.\nThese$\\gamma$ quanta make the scintillator flash, providing the prompt signal.\nThe neutron produced in the reaction undergoes scattering before a cadmium nucleus added to the water captures it at$C$.\nThe excited nucleus then emits several$\\gamma$ quanta, providing a delayed signal.\nThe two early$\\gamma$ quanta traveling in different directions and the later$\\gamma$ quanta help identify antineutrino events.\nReliable identification also requires rejecting background events; any pair of flashes is not automatically proof of an antineutrino interaction.',
  '',
  'Figure 277',
  '**What particle decay means**\nParticle decay is a transformation. It must not always be imagined as a complicated object splitting into parts that were already stored inside it.\nThis statement alone does not establish whether a particular particle has smaller constituents.',
  '**Decay products are not related to the initial particle in the same way that broken pieces are related to an intact clay pot.**\nThe textbook used the claim that an antineutrino moves at the speed of light to argue that it was not stored inside the neutron beforehand.\nThat speed claim belongs to the historical approximation already discussed; it is not, by itself, a proof about constituents.\nThe proton and electron produced in neutron decay can bind to form a hydrogen atom. A hydrogen atom is a different system, not a neutron.',
  'A finite lifetime does not, by itself, show that a particle is not elementary.\nThe textbook called the neutron elementary under its historical classification; that old description must not be read as a present-day claim that the neutron has no internal structure.\nThe nucleus of heavy hydrogen, **deuterium**, contains a neutron and a proton.\nIt is stable, but stability is not the same as having no constituent parts.',
];
assert.equal(en.length, source.prose.length);
const require = createRequire(import.meta.url);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const records = [];
for (const [locale, edition, texts, title, chapter] of [
  ['zh', 'modern-us-neutral', zh, source.title, source.chapter],
  ['en', 'modern-us-neutral-en', en, 'Neutron Decay and the Discovery of the Neutrino', 'Elementary Particles'],
]) {
  const file = `${prepared.work}/adapt/10p/${edition}/lessons/${prepared.id}/lesson.template.json`;
  const draft = read(file);
  draft.locale = locale;
  draft.title = title;
  draft.printed_title = locale === 'zh' ? `149. ${title}` : `149. ${title}`;
  draft.chapter = chapter;
  draft.section_breaks = [];
  for (const [i, block] of draft.prose.entries()) {
    assert.equal(block.source_text, source.prose[i].text);
    block.text = texts[i];
    block.changes = block.text === block.source_text ? [] :
      ['layout', ...(locale === 'en' ? ['translation'] : []),
        ...(!['fig', 'cap'].includes(block.kind) ? ['scientific-scope-clarification'] : [])];
    if (locale === 'en' && block.label?.startsWith('图'))
      block.label = block.label.replace(/^图\s*/, 'Figure ');
    if (i === 2) block.historical_entities = locale === 'zh'
      ? [{ term: '瑞士', reason: 'p0382#3 names Switzerland in the historical Pauli account.' }]
      : [{ term: 'Switzerland', source_term: '瑞士', reason: 'Translation of the source location in p0382#3; Pauli worked there.' }];
  }
  const normalized = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-c', 'import json,sys\nsys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")\nimport edition\nd=json.load(sys.stdin)\nedition.normalize_lesson_layout(d)\nprint(json.dumps(d,ensure_ascii=False))',
  ], { input: JSON.stringify(draft), encoding: 'utf8' }));
  const flow = proseFlow(normalized.prose, []).filter(row => row.kind === 'p');
  const prefixes = locale === 'zh'
    ? ['**泡利的假设**', '**自由中子的衰变**', '**中微子的实验发现**', '**粒子衰变的实质**']
    : ['**Pauli\'s hypothesis**', '**Free-neutron decay**', '**Experimental discovery**', '**What particle decay means**'];
  normalized.section_breaks = prefixes.map(prefix => {
    const index = flow.findIndex(row => row.text.startsWith(prefix));
    assert(index > 0, prefix);
    return { before: flow[index - 1].text, after: flow[index].text };
  });
  fs.writeFileSync(file, JSON.stringify(normalized, null, 2) + '\n');
  records.push({ locale, edition, template: bind(file) });
}
fs.writeFileSync(`${O}/author-freeze.json`, JSON.stringify({
  stage: 'D330', schema: 'STEMROBIN-181/n149-first-bilingual-author@1',
  prepared: bind(`${O}/prepared.json`), source: prepared.source, records,
  jobStory: 'A young independent learner follows why missing beta-decay energy led to a testable particle hypothesis and a prompt/delayed detection signal.',
  question: 'How did neutron decay lead to the discovery of the neutrino?',
  priority: 'Preserve original sequence, two reactions, detector signals and original figure; clarify the domain of obsolete statements without rewriting source evidence.',
  scientificScopeClarifications: [
    'Beta-minus decay is a transformation, with an antineutrino needed for the complete reaction and energy account.',
    'Mass0 and speed300000 are explicitly retained as original historical approximations, not current exact facts.',
    'Mean lifetime16 is explicitly retained as the original approximate value, not a current precise measurement.',
    'Weak interaction is not absolute inability to ionize or react; inverse beta reaction needs adequate energy.',
    'Historical neutron-as-elementary language is qualified; instability alone does not imply constituents.',
    'Prompt and delayed signals require background rejection; no unsafe hands-on reactor procedure.',
  ],
  formulasAndOriginalNumericalValuesIntendedUnchanged: true,
  scienceReviewPending: true, translationReviewPending: true,
  rawSourceAndPixelHoldsUnchanged: true, modernFigurePending: true,
  originalTasks: 0, addedTasks: 0, sourcePagesAdded: 0, completeCoursesAdded: 0,
  imagesOpened: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ freeze: bind(`${O}/author-freeze.json`), records }));
