import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const work = '.tmp/STEMROBIN-181/d1816/author-work/adapt/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const reportFile = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-raw245246-source309-final-review/report.json';
assert.equal(hash(reportFile), '83b39aabd418784c015d140ef2d7dd1ed9ce4d617886a351143543585f5830ca');
const report = JSON.parse(fs.readFileSync(reportFile));
for (const item of Object.values(report.input_bindings)) assert.equal(hash(item.path), item.sha256);
assert.equal(report.raw['fig-245'].verdict, 'PASS');
assert.equal(report.raw['fig-246'].verdict, 'PASS');
assert.equal(report.source309_ex7.verdict, 'HOLD');
fs.writeFileSync(`${scratch}/d040-n118-source-raw-pass.json`, JSON.stringify({
  batch: 'D040', id: 'phy10-c2-s6-n118', source: 'PASS-complete-object',
  text: bind(`${scratch}/d040-source306309-bindings.json`), raw: bind(reportFile),
  sourceRefs: ['p0306#7-8', 'p0307#1-8', 'p0308#1-9'],
  retainedSemanticUncertainty: 'Unknown fig245 component identity and exact fine aperture geometry remain historical source uncertainties; RAW pixels are preserved. Modern regularization must be explicitly authored, not asserted as source geometry.',
  excludedCard: 'phy10-c2-s6-t9', excludedReason: 'SOURCE309-ex7 FINAL typography HOLD; no further replay.',
  sourcePagesAdded: 0, completeCardsAdded: 0, parentNewImageOpens: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
const texts = {
  zh: [
    '原书回顾了写作时约40年前的无声电影：银幕上的人物会动作、张嘴，却不能直接听到影片所记录的人声。\n有声电影把语言、风声等声音与画面配合起来。这里介绍的是把声音记录在胶片上的光学录音，以及用光电管读出声音的方法，而不是现代数字录音。',
    '观察这种电影胶片，可以在画面旁找到**音道**，也就是记录声音的区域。\n这一种音道用宽度不断变化的暗色条纹记录声音，可把它看作声音变化留下的“照片”。',
    '录音时，声频电信号控制光束，使胶片受到的照明随声音变化；这称为光的调制。\n图245展示一种装置：光源1发出的光经过聚光镜2和楔形遮挡孔3，再经透镜4到达平面镜5，反射后经过窄缝6和透镜7，照到胶片8。\n透镜4把遮挡孔3成像在窄缝6所在的屏上，透镜7把窄缝处的光带成像在胶片8上。',
    '',
    '图245',
    '平面镜5固定在水平轴上，同一根轴上还有一个小线圈框。\n线圈位于永久磁铁的磁场中，构造与电流计中的线圈相似；镜子和线圈可以一起转动。',
    '放大后的声频交流电流进入线圈，使小镜子围绕水平轴振动。\n镜子的转动使遮挡孔的像移动，窄缝6处光带的宽度随电流变化；胶片上的光带宽度也随之变化。\n胶片显影后得到声音的底片记录，再制成放映用的正片，其音道是宽度变化的暗色条纹。',
    '播放时，极窄的光束照亮胶片音道，透过音道的光射到光电管上（图246）。\n随着胶片移动，音道宽度变化，使到达光电管的光流变化；光电管电路中的电流也随之变化。\n把这种变化的电信号放大，再送入扬声器，扬声器就把电信号转成声音。',
    '',
    '图246',
  ],
  en: [
    'The source looks back at silent films from about 40 years before it was written: people moved and opened their mouths on the screen, but recorded voices could not be heard directly from the film.\nSound films combine speech and other sounds with pictures. This section describes optical sound recording on photographic film and playback with a photoelectric tube, not modern digital recording.',
    'On this kind of movie film, a **soundtrack** runs alongside the picture frames.\nIn the system described here, a dark stripe of varying width records the sound. It is like a photograph of the changing sound signal.',
    'During recording, an electrical signal at audio frequencies controls the light reaching the film; this is modulation of the light.\nFigure 245 shows one arrangement: light from source 1 passes through condenser lens 2 and wedge-shaped aperture 3, then through lens 4 to mirror 5; after reflection it passes through narrow slit 6 and lens 7 to film 8.\nLens 4 forms an image of aperture 3 on the screen containing slit 6, and lens 7 forms an image of the light band at the slit on film 8.',
    '',
    'Figure 245',
    'Mirror 5 is mounted on a horizontal axle, with a small coil mounted on the same axle.\nThe coil lies in the magnetic field of a permanent magnet, as in a galvanometer. The mirror and coil can turn together.',
    'An amplified alternating current at audio frequencies flows through the coil, causing the small mirror to turn back and forth about the horizontal axle.\nThis shifts the image of the aperture, changing the width of the light band at slit 6 and on the film.\nDevelopment produces a negative sound record. A positive print for projection then carries a dark soundtrack stripe of varying width.',
    'During playback, a very narrow light beam illuminates the soundtrack, and the transmitted light reaches a photoelectric tube (Figure 246).\nAs the film moves, the changing soundtrack width varies the light reaching the tube, so the current in its circuit varies too.\nThe changing electrical signal is amplified and sent to a loudspeaker, which converts it back into sound.',
    '',
    'Figure 246',
  ],
};
const questions = {
  zh: [
    '1. 哪些实验事实支持光具有粒子性？',
    '2. 在通常的单光子光电效应中，发射光电子的条件、最大动能和饱和光电流分别有什么规律？',
    '3. 普朗克常数是多少？写出数值和单位。',
    '4. 已知光的频率$\\nu$，怎样求光子的能量和动量？光子的静质量与历史上所说的能量等效质量有什么区别？',
    '5. 相同强度的光垂直照射时，理想镜面和完全吸收的黑面，哪一个受到的光压较大？',
  ],
  en: [
    '1. Which experimental facts support particle-like behavior of light?',
    '2. In the usual single-photon photoelectric effect, what determines whether electrons are emitted, their maximum kinetic energy, and the saturation photocurrent?',
    "3. What is Planck's constant? Give its value and unit.",
    "4. Given the light frequency $\\nu$, how can you find a photon's energy and momentum? How does its rest mass differ from the historical energy-equivalent mass?",
    '5. For light of the same intensity at normal incidence, which experiences greater radiation pressure: an ideal mirror or a perfectly absorbing black surface?',
  ],
};
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${work}/${edition}/lessons/phy10-c2-s6-n118`;
  const before = `${scratch}/d040-n118-first-template/${edition}`;
  fs.mkdirSync(before, { recursive: true });
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    fs.copyFileSync(`${dir}/${name}`, `${before}/${name}`, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(`${before}/${name}`, 0o444);
  }
  const lessonFile = `${dir}/lesson.template.json`;
  const lesson = JSON.parse(fs.readFileSync(lessonFile));
  assert.equal(lesson.prose.length, texts[locale].length);
  lesson.locale = locale;
  if (locale === 'en') lesson.title = 'Recording and Playing Sound in Movies';
  lesson.prose.forEach((block, index) => {
    block.text = texts[locale][index];
    if (locale === 'en' && ['fig', 'cap'].includes(block.kind)) block.label = `Figure ${block.kind === 'fig' ? block.id.split('-')[1] : block.label.match(/\d+/)[0]}`;
    block.changes = block.kind === 'fig' ? [] : [locale === 'en' ? 'translation' : 'wording', 'layout', 'context'];
  });
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  const exercisesFile = `${dir}/exercises.template.json`;
  const exercises = JSON.parse(fs.readFileSync(exercisesFile));
  exercises.locale = locale;
  assert.equal(exercises.count, 5);
  exercises.exercises.forEach((exercise, index) => {
    exercise.text = questions[locale][index];
    exercise.lines = [exercise.text];
    exercise.changes = [locale === 'en' ? 'translation' : 'wording', 'layout', 'context'];
    if (index === 2) exercise.historical_entities = [{
      term: locale === 'en' ? 'Planck' : '普朗克', source_term: '普朗克',
      reason: 'Source-bound name of the scientific constant.',
    }];
  });
  fs.writeFileSync(exercisesFile, JSON.stringify(exercises, null, 2) + '\n');
  records.push({ locale, edition, lesson: bind(lessonFile), exercises: bind(exercisesFile),
    sourceLesson: lesson.source, sourceExercises: exercises.source });
}
fs.writeFileSync(`${scratch}/d040-n118-first-author.json`, JSON.stringify({
  batch: 'D040', id: 'phy10-c2-s6-n118', records, proseBlocks: 10, writtenQuestions: 5,
  changes: ['Historical forty-year reference explicitly anchored to source writing, not today.',
    'Audio modulation and negative/positive film stages clarified without altering numbered optical parts.',
    'Original mass question distinguishes rest mass from historical energy-equivalent mass.',
    'Single-photon and normal-incidence/ideal-surface assumptions made explicit.'],
  scienceAndBilingualReview: 'pending', modernFigures: 'delegation pending',
  addedCards: 0, parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ id: 'phy10-c2-s6-n118', authored: true, figuresPending: true }));
