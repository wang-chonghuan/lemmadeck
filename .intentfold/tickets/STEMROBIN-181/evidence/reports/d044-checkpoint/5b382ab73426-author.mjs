import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, immutableWrite,
} from '../retain-d016-evidence.mjs';

const folder = `${ticket}/tmp/d044-10p-n39-author`;
const card = 'phy10-c1-s5-n39';
const tools = '.claude/skills/ld-s10y-lesson/tools';
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const texts = [
  [
    `在横波传播时，当振动传到了第十三个球后，第一个和第十三个球将作完全相同的振动。
当第一个球在平衡位置上并向左运动时（见图70e），第十三个球也在平衡位置，并且也向左运动。
又过了$\\frac{1}{4}$周期，第一个球向左运动到最大偏移位置，第十三个球同样也到达这样的位置（见图70f）。

这两个球的振动相位总是相同的。
**相距最近的振动相位相同的两个点间的距离叫做波长**。
所以，第一个球和第十三个球之间的距离，第二个球和第十四个球之间的距离，第三个球和第十五个球之间的距离都等于波长（见图70e、f）。`,
    `As the transverse wave travels, once the vibration has reached the thirteenth ball, the first and thirteenth balls undergo identical vibrations.
When the first ball is at its equilibrium position and moving left (see Figure 70e), the thirteenth ball is also at equilibrium and moving left.
After another $\\frac{1}{4}$ of a period, the first ball reaches its maximum displacement to the left, and the thirteenth ball reaches the same position (see Figure 70f).

The two balls always vibrate in the same phase.
**The distance between the nearest points vibrating in the same phase is called the wavelength**.
Thus the distances from the first ball to the thirteenth, from the second to the fourteenth, and from the third to the fifteenth all equal one wavelength (see Figures 70e and 70f).`,
  ],
  [
    `图71b所示纵波的波长等于第二个球与第十四个球之间的距离，或第四个球与第十六个球之间的距离。
波长用希腊字母$\\lambda$表示。`,
    `For the longitudinal wave in Figure 71b, the wavelength equals the distance between the second and fourteenth balls, or between the fourth and sixteenth balls.
Wavelength is denoted by the Greek letter $\\lambda$.`,
  ],
  [
    `在波传播时，物体的不同点（例如这个模型中的各个球），只要它们之间的距离不等于$n\\lambda$（$n$为整数），就以不同的相位振动。
相距$\\lambda/2$的第一个球和第七个球（见图70）以相反的相位振动：当第一个球向左运动时，第七个球就向右运动，反过来也是这样。`,
    `As a wave travels, different points in the medium, such as the balls in this model, vibrate in different phases unless their separation equals $n\\lambda$ ($n$ is an integer).
The first and seventh balls, separated by $\\lambda/2$ (see Figure 70), vibrate in opposite phases: when the first ball moves left, the seventh moves right, and vice versa.`,
  ],
  [
    `在一个周期内，波传播的距离为$\\lambda$（见图70e）。
因此，波速可由下面的公式求出：
$v=\\frac{\\lambda}{T}$ (4.1)

因为周期$T$与频率$\\nu$的关系为
$T=\\frac{1}{\\nu}$，
所以
$v=\\lambda\\nu$ (4.2)`,
    `In one period, a wave travels a distance $\\lambda$ (see Figure 70e).
Its speed is therefore given by
$v=\\frac{\\lambda}{T}$ (4.1)

Since the period $T$ and frequency $\\nu$ are related by
$T=\\frac{1}{\\nu}$,
it follows that
$v=\\lambda\\nu$ (4.2)`,
  ],
  [
    `**波速等于波长与振动频率的乘积**。`,
    `**Wave speed equals wavelength multiplied by the vibration frequency**.`,
  ],
  [
    `波沿绳传播时，我们可以观察到两种周期性。`,
    `When a wave travels along a string, we can observe two kinds of periodicity.`,
  ],
  [
    `第一，绳的每个质点随时间作周期性振动。
在谐振动的情况下，这些振动遵循正弦或余弦规律，各质点的频率和振幅相同，区别仅在于相位。`,
    `First, each point on the string vibrates periodically in time.
For harmonic vibrations, which follow a sine or cosine law, all the points have the same frequency and amplitude and differ only in phase.`,
  ],
  [
    `第二，在任一时刻，绳上每隔$\\lambda$的距离就会出现重复的波形。
图72中过$O$点的曲线表示某一时刻的波形。
随着时间推移，整个波形以速度$v$从左向右移动。`,
    `Second, at any instant, the shape of the wave repeats along the string at intervals of $\\lambda$.
The curve through $O$ in Figure 72 shows the wave's shape at one instant.
As time passes, the entire shape moves from left to right at speed $v$.`,
  ],
  [
    `经过一段时间
$\\Delta t=\\frac{\\Delta s}{v}$
波形就变成图中不过$O$点的那条曲线。`,
    `After a time interval
$\\Delta t=\\frac{\\Delta s}{v}$
the wave has the shape shown by the curve that does not pass through $O$.`,
  ],
  [
    `表示波速、波长与振动频率关系的公式(4.2)，同样适用于纵波。`,
    `Equation (4.2), which relates wave speed, wavelength, and vibration frequency, also applies to longitudinal waves.`,
  ],
];
const questions = [
  ['1. 什么叫做波？', '1. What is a wave?'],
  ['2. 横波与纵波有什么区别？分别举出横波与纵波的例子。',
    '2. How do transverse and longitudinal waves differ? Give examples of each.'],
  ['3. 波动的基本特点是什么？', '3. What is the basic characteristic of wave motion?'],
  ['4. 什么叫做波长？', '4. What is wavelength?'],
  ['5. 波速与波长有什么关系？', '5. How are wave speed and wavelength related?'],
  ['6. 指出图70中两个相邻的球振动的相位差。',
    '6. State the phase difference between the vibrations of two adjacent balls in Figure 70.'],
];
const authored = [];
async function run(name, executable, args, input) {
  const result = spawnSync(executable, args, {
    cwd: root, encoding: 'utf8', input, timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  await immutableWrite(`${folder}/${name}.json`, `${JSON.stringify({
    command: [executable, ...args], exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}
for (const [locale, language] of ['zh', 'en'].entries()) {
  const directory = `${folder}/${language}/work/adapt/10p/modern-us-neutral/lessons/${card}`;
  const lessonPath = `${directory}/lesson.template.json`;
  const exercisesPath = `${directory}/exercises.template.json`;
  const figuresPath = `${directory}/figures.template.json`;
  for (const name of ['lesson', 'exercises', 'figures']) {
    await immutableWrite(`${folder}/prepared/${language}/${name}.template.json`,
      await bytes(`${directory}/${name}.template.json`));
  }
  let lesson = await read(lessonPath);
  let exercises = await read(exercisesPath);
  const figures = await read(figuresPath);
  const raw = lesson.source.data;
  assert.equal(raw.prose.filter(block => block.kind === 'p').length, texts.length);
  assert.equal(exercises.count, questions.length);
  lesson.language = language;
  exercises.language = language;
  let textIndex = 0;
  for (const block of lesson.prose) {
    if (block.kind === 'p') block.text = texts[textIndex++][locale];
    else if (block.kind === 'cap' && language === 'en') block.text = 'Figure 72';
    block.changes = block.text === block.source_text ? [] :
      [...(language === 'en' ? ['translation'] : []), 'wording', 'layout'];
    block.numeric_changes = [];
  }
  lesson.prose[0].figures = [{ id: 'fig-70', label: '图 70' }];
  lesson.prose[1].figures = [{ id: 'fig-71', label: '图 71' }];
  for (const [index, exercise] of exercises.exercises.entries()) {
    exercise.text = questions[index][locale];
    exercise.lines = exercise.text.split('\n');
    exercise.changes = exercise.text === exercise.source_text ? [] :
      [...(language === 'en' ? ['translation'] : []), 'wording', 'layout'];
    exercise.numeric_changes = [];
  }
  for (const number of [70, 71]) {
    const id = `fig-${number}`;
    figures.figures.push({
      id, label: `图 ${number}`, spec: `figures/${id}.spec.json`,
      changes: ['modernized'], source: Object.fromEntries(
        await Promise.all(['png', 'svg'].map(async suffix => [suffix, {
          path: `figures/${id}.${suffix}`,
          sha256: (await bind(`${folder}/${language}/root/10p/figures/${id}.${suffix}`)).sha256,
        }]))),
    });
  }
  const normalized = JSON.parse(await run(`normalize-${language}`, python, [
    '-B', '-c', [
      'import json,sys',
      'sys.path.insert(0,sys.argv[1])',
      'from edition import normalize_lesson_layout,normalize_exercise_layout',
      'lesson,exercises=json.load(sys.stdin)',
      'normalize_lesson_layout(lesson)',
      'normalize_exercise_layout(exercises)',
      'json.dump([lesson,exercises],sys.stdout,ensure_ascii=False,indent=2)',
    ].join('\n'), tools,
  ], JSON.stringify([lesson, exercises])));
  [lesson, exercises] = normalized;
  await fs.writeFile(absolute(lessonPath), `${JSON.stringify(lesson, null, 2)}\n`);
  await fs.writeFile(absolute(exercisesPath), `${JSON.stringify(exercises, null, 2)}\n`);
  await fs.writeFile(absolute(figuresPath), `${JSON.stringify(figures, null, 2)}\n`);
  const flow = JSON.parse(await run(`flow-initial-${language}`, process.execPath,
    [`${tools}/prose_flow.mjs`, '--json', lessonPath]));
  lesson.section_breaks = ['p0110#6', 'p0111#2', 'p0111#4', 'p0111#6', 'p0111#9']
    .map(ref => {
      const blockIndex = lesson.prose.findIndex(block => block.source_refs[0] === ref);
      const paragraph = flow.paragraphs.find(row => row.blockIndex === blockIndex);
      assert.ok(paragraph && paragraph.index > 0);
      return { before: flow.paragraphs[paragraph.index - 1].text, after: paragraph.text };
    });
  await fs.writeFile(absolute(lessonPath), `${JSON.stringify(lesson, null, 2)}\n`);
  const finalFlow = JSON.parse(await run(`flow-${language}`, process.execPath,
    [`${tools}/prose_flow.mjs`, '--json', lessonPath]));
  await immutableWrite(`${folder}/frozen/${language}/lesson.template.json`, await bytes(lessonPath));
  await immutableWrite(`${folder}/frozen/${language}/exercises.template.json`, await bytes(exercisesPath));
  await immutableWrite(`${folder}/frozen/${language}/figures.template.json`, await bytes(figuresPath));
  const title = language === 'zh' ? '波长与波速' : 'Wavelength and Wave Speed';
  await immutableWrite(`${folder}/frozen/${language}/prose.md`,
    `# 39. ${title}\n\n${lesson.prose.filter(block => block.kind === 'p' || block.kind === 'cap')
      .map(block => block.text).join('\n\n')}\n`);
  await immutableWrite(`${folder}/frozen/${language}/questions.md`,
    `${exercises.exercises.map(row => row.text).join('\n\n')}\n`);
  authored.push({ language, lesson: await bind(lessonPath), exercises: await bind(exercisesPath),
    figures: await bind(figuresPath), prose: await bind(`${folder}/frozen/${language}/prose.md`),
    questions: await bind(`${folder}/frozen/${language}/questions.md`),
    flow: await bind(`${folder}/flow-${language}.json`), paragraphs: finalFlow.paragraphs.length,
    sectionBreaks: finalFlow.resolvedBreaks.length });
}
const input = await read(`${folder}/input-freeze.json`);
for (const row of input.inputs) {
  if (row.original) {
    await verify(row.original.path, row.original.sha256);
    await verify(row.snapshot.path, row.snapshot.sha256);
  } else await verify(row.path, row.sha256);
}
await immutableWrite(`${folder}/author-freeze.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', card, status: 'authored-awaiting-native-text-and-independent-SCI-ZHEN',
  input: await bind(`${folder}/input-freeze.json`), authored,
  proseObjects: 10, sourceWrittenTasks: 6, modernFiguresAuthored: 0, sharedProseFigures: ['fig-70', 'fig-71'],
  subfigureMapping: { а: 'a', б: 'b', в: 'c', г: 'd', д: 'e', е: 'f' },
  scienceApproval: false, bilingualApproval: false, fullCardApproval: false,
  imagesOpened: 0, rawSourceChanged: false, nativeFinalizeRun: false, renderRun: false,
}, null, 2)}\n`);
console.log(JSON.stringify({ freeze: await bind(`${folder}/author-freeze.json`), authored }));
