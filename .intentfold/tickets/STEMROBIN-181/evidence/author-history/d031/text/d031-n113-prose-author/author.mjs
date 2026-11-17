import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const own = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d031-n113-prose-author');
const folder = path.join(own, 'work/adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113');
const lessonPath = path.join(folder, 'lesson.template.json');
const exercisesPath = path.join(folder, 'exercises.template.json');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const dump = async (file, value) => {
  assert.ok(file.startsWith(`${own}/`));
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
};
const lesson = await read(lessonPath);
const exercises = await read(exercisesPath);
assert.deepEqual(lesson, await read(path.join(own, 'prepared/lesson.template.json')));
assert.deepEqual(exercises, await read(path.join(own, 'prepared/exercises.template.json')));
const prose = new Map([
  ['p0276#7', [
    '**热敏电阻**的电阻会随温度明显改变。',
    '本课讨论的这类半导体热敏元件，温度升高时电阻减小，温度降低时电阻增大。',
    '温度改变了材料中参与导电的电子和空穴的数量，电流通过的难易也随之改变。',
    '图 229 把热敏元件接入电路，用电流表观察电流的变化。',
    '保持电源电压不变，元件的电阻减小时，电路中的电流就增大。',
    '先标定不同温度下的读数，就可以由电流读数判断温度。',
    '其中感受温度的元件叫做**热敏电阻**，测温仪器还包括电源、读数装置等部分。',
  ].join('\n')],
  ['p0276#9', [
    '半导体吸收射来的电磁辐射后会升温，电阻随温度改变，电路的读数也就改变。',
    '利用这种过程探测辐射的装置，叫做电阻辐射测温器，也叫辐射热计。',
    '原书用“能察觉距离几千米远的点燃火柴的辐射”说明历史上高灵敏装置的探测能力。',
    '这种灵敏度需要相应的装置和测量条件，实际探测还受辐射的收集、沿途传播和背景干扰影响。',
    '这不是每台辐射热计都有的固定检测距离。',
  ].join('\n')],
  ['p0276#12', [
    '**光敏电阻**也利用半导体导电性可以改变的性质。',
    '半导体吸收光能后，导电性可以提高，电阻可以减小。',
    '这种光照引起的变化，在材料温度不变时也能发生。',
  ].join('\n')],
  ['p0276#13', [
    '保持电源电压和半导体温度不变，先观察图 230 的电路。',
    '在图 231 中给半导体加上光照，电流表显示电流显著增大。',
    '电压相同而电流增大，说明半导体的导电性提高，电阻减小。',
    '因为温度保持不变，这次电流变化不能只用“光把材料加热了”来解释。',
    '光照产生导电变化与辐射先加热、再改变电阻，是两种需要区分的过程。',
    '实际光敏元件也可能受温度影响，不能把“温度不变时仍有光照效应”理解成“电阻永远不受温度影响”。',
  ].join('\n')],
  ['p0277#7', [
    '半导体吸收光的能量后，一些原先受束缚的电子能参与导电，原来的位置则留下空穴。',
    '自由电子能在电场作用下移动，传递电荷。',
    '空穴是少了一个电子的位置，不是材料中被挖出的洞。',
    '邻近电子可以填进这个位置，又在原来的位置留下空穴。',
    '这样接连填补时，空穴的位置也在移动，可以把这种导电视为正电荷的移动。',
    '电子和空穴都是载流子，也就是参与传递电荷的成员。',
    '光使参与导电的载流子增多，半导体的导电性就提高。',
    '原书把这种现象称为**光电效应**；在这里，具体表现是材料内部的光电导效应。',
    '它不要求电子飞出材料，也不要求先把整块材料加热。',
  ].join('\n')],
  ['p0277#8', [
    '利用这种光电导效应制成的电阻元件，叫做**光敏电阻**。',
    '它把光照变化转成电阻变化，再由电路转成电流读数的变化。',
    '原书指出这类元件轻巧、灵敏，可以用于不同技术领域的感光检测。',
    '具体元件的灵敏度和适用范围仍由材料、结构与工作条件决定。',
  ].join('\n')],
]);
for (const block of lesson.prose) {
  const text = prose.get(block.source_refs[0]);
  if (text) {
    block.text = text;
    block.changes = ['explanation', 'layout'];
  }
  if (block.source_refs[0] === 'p0277#3') {
    block.text = 'Light';
    block.changes = ['context', 'language'];
  }
}
exercises.exercises[0].text = String.raw`1. 半径 $R=5$ 厘米的空心导体球放在盛有硫酸铜溶液的电解槽中。
球面上有一个半径 $r=0.5$ 毫米的小孔。
铜的沉积持续 $t=30$ 分钟，在 $1$ 秒钟内到达每平方厘米球面的电荷等于 $0.01$ 库仑。
求球的质量增加多少。
铜的摩尔质量 $A=0.0635$ 千克/摩尔。

**解**
因为 $r\ll R$，可以把小孔对球内电场的影响忽略，近似认为球内没有推动离子定向运动的电场。
因此只计算外表面沉积的铜，不把这个近似理解成球内的溶液没有离子。
外表面的面积为 $S=4\pi R^2=314$ 厘米$^2$。

在 $t=30$ 分$=1800$ 秒内，离子迁移的电量等于 $q=0.01$ 库仑/（厘米$^2$·秒）$\times314$ 厘米$^2\times1800$ 秒$=5652$ 库仑。
这里先把每单位面积、每秒到达的电荷乘以球的外表面积，再乘以沉积时间。

按法拉第定律，析出的铜的质量为：
$m=\frac{1}{F}\cdot\frac{A}{n}q$。
这里使用硫酸铜中铜的二价性质和已经学过的法拉第恒量。
把题给的摩尔质量和求出的电量代入，得到：
$m\approx1.9\times10^{-3}$ 千克。
这些铜沉积在球上，所以这就是球增加的质量。`;
exercises.exercises[1].text = String.raw`2. 把一个电容器通过 $R=1$ 欧姆的电阻接到高压电源上（图 232）。
电容器板的面积 $S=3\times10^{-3}$ 米$^2$，两板之间的距离 $d=$ $3\times10^{-3}$ 米。
用伦琴射线，也就是 X 射线，使板间的空气电离。
在 $1$ 秒钟内，每 $1$ 米$^3$ 的空气中形成 $n=$ $10^4$ 对离子。
每个离子的电量，其绝对值等于电子电量的绝对值。
设所有离子都到达电容器板，途中没有复合。
求电阻两端的电压。

**解**
根据欧姆定律，所求的电压 $V=IR$，式中 $I$ 是电路中的电流强度。
在持续收集离子的稳态下，电路各处的电流相同。
负离子向正极板移动，正离子向负极板移动，两者都贡献同一方向的电流。

计算通过一个截面的电流时，不能把每对离子在两块极板上的收集重复计作两份完整电荷。
每对离子完全被收集后，外电路通过一个电子电量大小的电荷。
板间体积由极板面积乘以板间距离得到，再乘以单位体积每秒形成的离子对数，就得到每秒收集的离子对数。
所以电流强度 $I=enSd$，式中 $e=1.6\times10^{-19}$ 库仑，是电子电量的绝对值。
这里的离子对数表示生成速率，而不是已经积存的离子数量。

把电流表达式代入欧姆定律，得到：
$V=enSdR$。
按题给的离子生成速率、面积、间距和电阻逐项相乘，电阻两端的电压为：
$V=1.4\times10^{-20}$ 伏特。`;
for (const example of exercises.exercises) {
  example.lines = example.text.split('\n');
  example.changes = ['explanation', 'layout', 'math-correction'];
}
for (const erratum of lesson.errata) {
  if (erratum.id === 'p0278-n113-example1-mass-exponent')
    erratum.corrected = '$m\\approx1.9\\times10^{-3}$';
  else if (erratum.id === 'p0278-n113-example2-voltage-exponent')
    erratum.corrected = '$V=1.4\\times10^{-20}$';
  else throw new Error(`Unknown bound erratum ${erratum.id}`);
}
await dump(lessonPath, lesson);
await dump(exercisesPath, exercises);
await dump(path.join(own, 'author-notes.json'), {
  contextChanges: [
    {
      source_refs: ['p0277#3'], from: 'Свет　光', to: 'Light',
      meaning: 'English light caption. The source snapshot retains Cyrillic and Chinese.',
      imageChanges: false,
      remainingFigureDependency: 'The inherited fig-231 source image still has its original Cyrillic word. This text author neither edits it nor approves it for modern display.',
    },
  ],
  explanations: [
    { source_refs: ['p0276#7'], change: 'Component versus complete measuring instrument; qualified falling resistance for the source-discussed type, constant-voltage comparison and calibration.' },
    { source_refs: ['p0276#9', 'p0276#11'], change: 'Bolometer absorbs radiation and measures its heating effect; distant-match statement is explicitly a conditional historical sensitivity claim, not a universal promise.' },
    { source_refs: ['p0276#13', 'p0277#6'], change: 'Constant-temperature photoconductivity is distinguished from heating without claiming all temperature dependence disappears. No invented meter values or labels.' },
    { source_refs: ['p0277#7'], change: 'Preserve source-emphasized photoelectric effect, specify internal photoconductivity; explain free electrons and moving vacancies with the cached primary text, no advanced new quantities.' },
    { pages: ['p0277#10', 'p0278#1'], change: 'Full worked example remains. Interpret the small-hole approximation as negligible inner-field-driven deposition, not absence of dissolved ions. Source sentence retained unedited in snapshots.' },
    { pages: ['p0278#2', 'p0278#5'], change: 'Full worked example remains. Clarify steady-state collection, n as pair-production rate and one external-circuit charge per collected pair; no doubling.' },
  ],
  typography: [
    { source_refs: ['p0276#7'], meaning: 'Both source strong runs for thermistor retained; lead bold and inline underdots use the existing strong convention.' },
    { source_refs: ['p0276#12'], meaning: 'Photoresistor lead term retains source bold.' },
    { source_refs: ['p0277#7', 'p0277#8'], meaning: 'Source underdots on photoelectric effect and photoresistor retained as strong.' },
  ],
  numericChanges: [],
  formulas: 'Only the two confirmed, page-registered result substitutions. All other exact formula tokens and their order stay source-bound.',
  externalAcquisitions: 0, imageOpens: 0, createdQuestions: 0,
  approvals: 'Author explanation and arithmetic only. No independent SCI, figure or display approval.',
  copyAudit: {
    status: 'AUTHOR_SELF_CHECK_ONLY',
    tests: ['Evidence', 'Item-specific relevance', 'Deletion'],
    deletions: ['Universal bolometer range promise', 'No-ions interpretation', 'Extra unsolved tasks', 'Pipeline and review commentary inside learner text'],
  },
});
const python = path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const tools = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools');
const program = `
import json, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import edition
payload = json.load(sys.stdin)
edition.normalize_lesson_layout(payload["lesson"])
edition.normalize_exercise_layout(payload["exercises"])
print(json.dumps(payload, ensure_ascii=False, indent=2))
`;
const input = { lesson, exercises };
const result = spawnSync(python, ['-B', '-c', program, tools], {
  cwd, input: JSON.stringify(input), encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, maxBuffer: 4 * 1024 * 1024,
});
await dump(path.join(own, 'normalizer.command.json'), {
  command: [python, '-B', '-c', program, tools],
  input: 'normalizer.before.json', output: 'normalizer.after.json',
  exitCode: result.status, stderr: result.stderr,
  owner: 'Production edition.normalize_lesson_layout and normalize_exercise_layout, not raw prose_flow layout.',
});
await dump(path.join(own, 'normalizer.before.json'), input);
assert.equal(result.status, 0, result.stderr);
const normalized = JSON.parse(result.stdout);
await dump(path.join(own, 'normalizer.after.json'), normalized);
await dump(lessonPath, normalized.lesson);
await dump(exercisesPath, normalized.exercises);
const flowCommand = ['node', path.join(tools, 'prose_flow.mjs'), lessonPath];
const flow = spawnSync(flowCommand[0], flowCommand.slice(1), { cwd, encoding: 'utf8' });
await dump(path.join(own, 'prose-flow.before-anchors.command.json'), {
  command: flowCommand, exitCode: flow.status, stderr: flow.stderr,
  nativeParagraphNormalizationAlreadyRun: true,
});
await fs.writeFile(path.join(own, 'prose-flow.before-anchors.stdout.txt'), flow.stdout, { flag: 'wx' });
assert.equal(flow.status, 0, flow.stderr);
console.log(flow.stdout);
