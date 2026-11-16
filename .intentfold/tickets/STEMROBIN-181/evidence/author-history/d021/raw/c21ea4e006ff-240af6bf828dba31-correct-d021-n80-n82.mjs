import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bytes, bind, verify, immutableWrite } from './retain-d016-evidence.mjs';

const work = `${ticket}/tmp`;
const edits = {
  80: {
    0: '把两个导体适当地组合，可以使它们的电容主要由内部结构决定，对周围物体的影响不太敏感。\n这种导体组合叫做电容器；适当设计的电容器可以具有较大的电容，用来储存电荷和电场能量。',
    13: '**莱顿瓶**\n莱顿瓶是十八世纪中叶出现的一种早期电容器。\n原教材描述过一种早期实验安排：插在盛有水银的玻璃瓶中的钉子积聚了大量电荷；钉子与水银相连，水银充当内侧导体，握住瓶子的手掌充当外侧导体，玻璃把两者隔开。\n这段文字是历史装置的描述，不是建议重复的实验；水银有毒，储存的电荷也可能造成伤害。\n原教材还说明，后来用铜箔或锡箔分别包覆瓶的内外表面，形成两个导体（图158）。',
  },
  82: {
    14: '**不同类型的电容器**\n用途不同，电容器的结构也不同。\n原书介绍的纸介电容器由两层锡箔和把它们隔开的浸过石蜡的绝缘纸组成，锡箔与纸卷成紧密的小卷（图155）。\n这种卷绕结构把较大的导体面积收进较小的空间，图中是结构示意，不表示所有现代电容器都采用锡箔或纸。',
  },
};
for (const [number, changes] of Object.entries(edits)) {
  const folder = `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s2-n${number}`;
  const lessonPath = `${folder}/lesson.template.json`;
  const freezePath = `${work}/9p-n${number}-prose-freeze.json`;
  const reviewPath = `${work}/9p-n${number}-science-review.json`;
  const initial = await read(reviewPath);
  assert.equal(initial.status, 'needs-fixes');
  await verify(lessonPath, initial.bindings.lessonTemplate.sha256);
  const beforeFolder = `${work}/d021-n${number}-text-correction-before`;
  const archives = {};
  for (const name of ['lesson', 'figures']) {
    const file = `${folder}/${name}.template.json`;
    const archive = `${beforeFolder}/${name}.template.json`;
    await immutableWrite(archive, await bytes(file));
    archives[name] = { original: await bind(file), snapshot: await bind(archive) };
  }
  const reviewArchive = `${beforeFolder}/initial-science-review.json`;
  await immutableWrite(reviewArchive, await bytes(reviewPath));
  const lesson = await read(lessonPath);
  const before = structuredClone(lesson);
  for (const [index, text] of Object.entries(changes)) {
    lesson.prose[index].text = text;
  }
  lesson.section_breaks = [];
  await fs.writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`);
  execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c',
    'import sys;from pathlib import Path;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import edition;p=Path(sys.argv[1]);d=edition.load(p);edition.normalize_lesson_layout(d);edition.dump(p,d)',
    lessonPath,
  ], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  const flow = execFileSync(process.execPath, [
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath,
  ], { encoding: 'utf8' });
  const outline = JSON.parse(flow).paragraphs;
  const corrected = await read(lessonPath);
  corrected.section_breaks = before.section_breaks.map(boundary => {
    const prefix = boundary.after.split('\n')[0];
    const matches = outline.filter(item => item.text.startsWith(prefix));
    assert.equal(matches.length, 1);
    const item = matches[0];
    return { before: outline[item.index - 1].text, after: item.text };
  });
  await fs.writeFile(lessonPath, `${JSON.stringify(corrected, null, 2)}\n`);
  for (const [index, block] of corrected.prose.entries()) {
    if (!Object.hasOwn(changes, index)) assert.deepEqual(block, before.prose[index]);
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs', 'source_text']) {
      assert.deepEqual(block[key], before.prose[index][key]);
    }
  }
  const flowPath = `${work}/d021-n${number}-corrected-prose-flow.json`;
  await immutableWrite(flowPath, flow);
  const correctionPath = `${work}/9p-n${number}-prose-correction-freeze.json`;
  await immutableWrite(correctionPath, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D021', lesson: corrected.id,
    status: 'author-corrected-awaiting-affected-only-science',
    initialAuthorFreeze: await bind(freezePath),
    initialReview: archives.review = { original: await bind(reviewPath), snapshot: await bind(reviewArchive) },
    archives, changedBlocks: Object.keys(changes).map(Number),
    bindings: {
      sourceLesson: initial.bindings.sourceLesson, sourceExercises: initial.bindings.sourceExercises,
      lessonTemplate: await bind(lessonPath), exercisesTemplate: await bind(`${folder}/exercises.template.json`),
      figuresTemplate: await bind(`${folder}/figures.template.json`),
      nativeProseFlow: await bind(flowPath), helper: await bind(import.meta.filename),
    },
    mathAndSourceIdentityUnchanged: true, sourceAndModernTasks: 0,
    nativeLayoutInvocations: 1, nativeProseFlowInvocations: 1,
    limits: 'Restore only independent SCI omissions. No new physics, figure change or approval, source write, DB or Git.',
  }, null, 2)}\n`);
  console.log(JSON.stringify(await bind(correctionPath)));
}
