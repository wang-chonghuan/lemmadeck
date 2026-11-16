import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bind, bytes, exists, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const plans = {
  80: {
    starts: ['**充电与电量**', '**电容的定义**', '**莱顿瓶**'],
    text: {
      0: '把两个导体适当地组合，可以使它们的电容主要由内部结构决定，对周围物体的影响不太敏感。\n这种导体组合叫做电容器，可以用来储存电荷和电场能量。',
      1: '**电容器由彼此绝缘的两个导体组成，中间用电介质隔开。**\n这里讨论的常见电容器采用较薄的导体作为极板；“极板很薄”是这种结构的特点，不是所有电容器的定义条件。',
      2: '最简单的平行板电容器由两块相同、彼此平行并相隔很近的金属板组成（图150）。\n当两板带等量异号电荷，板的横向尺寸远大于间距且可以忽略边缘效应时，电场主要集中在板间，内部近似为匀强电场。\n电场线从正极板指向负极板；有限极板的边缘仍有漏出的电场线。\n球形电容器由同心的内球导体和外球壳导体组成（图151）。\n在理想同心、静电平衡、内外导体带等量异号电荷且没有外加电场的模型中，它产生的电场只在两导体之间。',
      7: '**充电与电量**\n给电容器充电时，可以把两块极板分别接到电源的两极，例如蓄电池的两极。\n另一种连接是：一块极板接电源的一极，电源的另一极与第二块极板一同接地。\n在忽略对外杂散电容的理想两极板模型中，接地并不表示极板没有电荷：两块极板仍带等量异号电荷。\n大地充当很大的电荷库，电荷通过接地连接转移，直到满足相应的电势条件。',
      8: '**电容器的电量，指一个极板上所带电量的绝对值。**\n它不是把两块极板的带符号电量相加；等量异号的两极板总电量为零。',
      9: '**电容的定义**\n保持几何形状、周围连接和线性绝缘介质不变时，极板电量增加，板间电场与电势差按相同比例增加。\n因此，极板电量的绝对值与两极板电势差 $|U|$ 的比值不随充电量改变，这个比值叫做电容器的电容：',
      11: '电容由极板的形状、大小、相互位置和间距决定，也与板间电介质的相对介电常数 $\\varepsilon$ 有关。\n这里的相对介电常数没有单位；把它视为不变，要求介质在所讨论的电场范围内近似线性，并且尚未发生击穿。',
      12: '对板间距离很小的平行板结构，或由外导体包围内部的屏蔽结构，周围物体对内部电势差的影响可以很小。\n“电容与周围物体无关”是这种理想结构的近似结论，不是对任意有限电容器、任意外部连接都严格成立的规律。',
      13: '**莱顿瓶**\n莱顿瓶是十八世纪中叶出现的一种早期电容器。\n原教材描述过一种早期实验安排：玻璃瓶内的水银和插入其中的钉子相连，水银充当内侧导体，握住瓶子的手掌充当外侧导体，玻璃把两者隔开。\n这段文字是历史装置的描述，不是建议重复的实验；水银有毒，储存的电荷也可能造成伤害。\n后来常用金属箔分别包覆瓶的内外表面，形成两个导体（图158）。',
    },
  },
  82: {
    starts: ['**电容器的串联**', '**不同类型的电容器**'],
    text: {
      0: '把多个电容器连接成一组，可以得到不同的等效电容。\n下面讨论理想、线性、漏电和连接线杂散电容可忽略的电容器；它们的电容均为正，并联和串联是两种基本连接方式。',
      1: '**电容器的并联**\n图153中，每个电容器的一块极板接到同一个节点，另一块极板接到另一个节点，所以各电容器两端的电势差相同。\n在图示充电状态下，正极板彼此相连，负极板彼此相连；判断并联要看连接节点，而不只是看极板上当前电荷的正负。',
      4: '并联电容器组在同一电势差下，接到同一个节点的各极板电量可以相加，因此等效电容等于各电容之和①：',
      5: '① 请根据电容的定义和电荷、电势差的关系，自行证明公式(8-40)，以及下面的公式(8-41)。\n证明串联关系时，需要用到中间导体组起初总电量为零、没有向外漏电这一条件。',
      7: '至少有两个正电容并联时，它们的等效电容大于其中任意一个电容。',
      8: '**电容器的串联**\n图154中，电容器依次连接，中间的连接导体不再接到其他电路节点。\n在这些中间导体组起初电中性、且没有漏电的条件下，相邻极板感应出等量异号电荷，各电容器的极板电量绝对值相同。\n图示状态中，第一个电容器的负极板与第二个电容器的正极板相连，后面依此连接；整个电容器组的电势差是各电容器电势差之和。',
      11: '**在上述理想串联条件下，等效电容的倒数等于各个电容倒数之和：**',
      13: '至少有两个正电容串联时，等效电容小于其中任意一个电容。\n实际选用电容器还必须注意允许的工作电压；串联不保证电压自动均分。',
      14: '**不同类型的电容器**\n用途不同，电容器的结构也不同。\n原书介绍的纸介电容器由两层金属箔和隔开的绝缘纸组成，纸可以浸渍石蜡等绝缘材料；金属箔与纸卷成紧密的小卷（图155）。\n这种卷绕结构把较大的导体面积收进较小的空间，图中是结构示意，不表示所有现代电容器都采用锡箔或纸。',
      15: '在一些无线电调谐电路中，可以使用空气可变电容器（图156）。\n它有彼此绝缘的两组金属片，转动旋钮时，一组插入另一组的片隙，改变正对重叠面积，从而改变电容。\n两组金属片不能接触，否则会短路；空气充当这里的电介质，这不是对所有现代无线电装置用法的概括。',
      22: '电解电容器利用很薄的绝缘氧化膜，使有效电介质厚度很小，从而获得较大的电容（图157）。\n在这里介绍的结构中，金属箔上的氧化膜是电介质；浸有电解液的纸是保持电解液的隔离材料，真正与氧化膜另一面接触并导电的是电解液。\n因此不能把纸本身简单当作金属极板。\n常见的铝电解电容器有规定的极性和额定电压，使用时必须遵守这些限制。',
      23: '电容器还可以采用其他电介质和结构。\n具体结构应当根据所需电容、工作电压、频率和应用条件选择。',
    },
  },
};

for (const [number, plan] of Object.entries(plans)) {
  const card = `phy9-c2-s2-n${number}`;
  const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}`;
  const before = `${work}/d021-n${number}-before`;
  const freezePath = `${work}/9p-n${number}-prose-freeze.json`;
  assert.ok(!await exists(freezePath));
  const prior = {};
  for (const name of ['lesson', 'exercises', 'figures']) {
    const file = `${folder}/${name}.template.json`;
    const archive = `${before}/${name}.template.json`;
    await immutableWrite(archive, await bytes(file));
    prior[name] = await bind(archive);
  }
  const lessonPath = `${folder}/lesson.template.json`;
  const lesson = await read(lessonPath);
  const raw = await read(`${book}/lessons/${card}/lesson.json`);
  assert.deepEqual(lesson.source.data, raw);
  const original = structuredClone(lesson);
  for (const [index, text] of Object.entries(plan.text)) {
    assert.equal(lesson.prose[index].kind, 'p');
    lesson.prose[index].text = text;
    lesson.prose[index].changes = ['context', 'layout'];
  }
  await fs.writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
  const native = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c',
    'import sys;from pathlib import Path;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import edition;p=Path(sys.argv[1]);d=edition.load(p);edition.normalize_lesson_layout(d);edition.dump(p,d)',
    lessonPath,
  ], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  const flow = execFileSync(process.execPath, [
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath,
  ], { encoding: 'utf8' });
  const outline = JSON.parse(flow).paragraphs;
  const normalized = await read(lessonPath);
  normalized.section_breaks = plan.starts.map(start => {
    const matches = outline.filter(item => item.text.startsWith(start));
    assert.equal(matches.length, 1, start);
    const item = matches[0];
    return { before: outline[item.index - 1].text, after: item.text };
  });
  await fs.writeFile(lessonPath, `${JSON.stringify(normalized, null, 2)}\n`);
  const flowPath = `${work}/9p-n${number}-native-prose-flow.json`;
  await immutableWrite(flowPath, flow);
  const atoms = text => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map(match => match[1] ?? match[2]);
  const coverage = normalized.prose.map((block, index) => {
    assert.equal(block.source_text, raw.prose[index].text);
    assert.deepEqual(atoms(block.text), atoms(raw.prose[index].text));
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
      assert.deepEqual(block[key], raw.prose[index][key]);
    }
    if (block.kind !== 'p') assert.deepEqual(block, original.prose[index]);
    return { index, source_refs: block.source_refs, exactMathAtomsRetained: true,
      sourceText: block.source_text, modernText: block.text };
  });
  const exercises = await read(`${folder}/exercises.template.json`);
  assert.equal(exercises.count, 0);
  assert.deepEqual(exercises.exercises, []);
  await immutableWrite(freezePath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D021', lesson: card,
    status: 'author-frozen-awaiting-independent-science', author: 'Main',
    bindings: {
      sourceLesson: await bind(`${book}/lessons/${card}/lesson.json`),
      sourceExercises: await bind(`${book}/lessons/${card}/exercises.json`),
      lessonTemplate: await bind(lessonPath),
      exercisesTemplate: await bind(`${folder}/exercises.template.json`),
      figuresTemplate: await bind(`${folder}/figures.template.json`),
      helper: await bind(import.meta.filename), nativeProseFlow: await bind(flowPath),
    },
    before: prior, coverage, sourceBlocks: raw.prose.length,
    modernParagraphs: outline.length, sourceTasks: 0, modernTasks: 0,
    sourceFigures: raw.figures.map(figure => figure.id),
    nativeAuthorCheck: { normalizationInvocations: 1, proseFlowInvocations: 1,
      nativeOutput: native, copiedActualBoundaryObjects: normalized.section_breaks },
    limits: 'Author text and native layout only. No science or image approval; no source changes, promotion, DB, Git or full-project checks.',
  }, null, 2)}\n`);
  console.log(JSON.stringify(await bind(freezePath)));
}
