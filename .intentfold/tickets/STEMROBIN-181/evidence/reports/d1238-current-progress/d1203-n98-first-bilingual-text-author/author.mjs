import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
const inventoryPath = path.join(owned, 'source-inventory.json')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const inventory = load(inventoryPath)
assert.equal(hash(inventoryPath), '5b743021e3bb3537b0355786f105df669db54f2c3f1f037dc86c1478b0ad237e')
const card = inventory.card
const prep = path.dirname(path.dirname(path.dirname(inventory.preparation.path)))
const write = (file, data) => {
  assert.ok(file.startsWith(owned + path.sep))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx', mode: 0o644 })
}
const copy = (source, target) => {
  assert.ok(target.startsWith(owned + path.sep))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o644)
  assert.equal(hash(target), hash(source))
  return { source: bind(source), destination: bind(target), writableMode: '0644' }
}
for (const directory of ['root', 'work', 'zh', 'en', 'FIRST']) {
  assert.equal(fs.existsSync(path.join(owned, directory)), false, 'Do not replace existing author work')
}
const copies = []
for (const binding of [inventory.rawLesson, inventory.rawExercises]) {
  assert.equal(hash(binding.path), binding.sha256)
  copies.push(copy(binding.path, path.join(owned, 'root/10p/lessons', card, path.basename(binding.path))))
}
for (const page of ['0262', '0263', '0264']) {
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    copies.push(copy(path.join(prep, 'root/10p/pages', page, name), path.join(owned, 'root/10p/pages', page, name)))
  }
}
copies.push(copy(path.join(prep, 'root/10p/book.json'), path.join(owned, 'root/10p/book.json')))
for (const binding of inventory.suppliedTemplates) {
  assert.equal(hash(binding.path), binding.sha256)
  copies.push(copy(binding.path, path.join(owned, 'work/adapt/10p/modern-us-neutral/lessons', card, path.basename(binding.path))))
}

const text = {
  zh: [
    '速度合成的新定律与相对论关于空间和时间的新概念相一致。\n经典的速度合成定律不可能普遍成立，因为它与真空中光速不变这一论点相矛盾。',
    '如果火车以速度 $v$ 运行，车厢内的一束光沿火车运动的方向传播，那么这束光相对于地球的速度仍应是 $c$，**而不是** $v+c$。\n新的速度合成定律也必须给出这个结果。',
    '下面不加证明地给出共线运动情形下的速度合成定律。\n物体沿参考系 $K_1$ 的运动轴运动，参考系 $K_1$ 相对于参考系 $K$ 以速度 $v$ 运动。\n在整个运动过程中，坐标轴 $X$ 与 $X_1$ 始终重合，$Y$ 与 $Y_1$、$Z$ 与 $Z_1$ 始终分别平行（图 226）。',
    '',
    '用 $v_1$ 表示物体相对于 $K_1$ 的速度，用 $v_2$ 表示同一物体相对于 $K$ 的速度。\n速度合成的相对论定律给出：\n$v_2=\\frac{v_1+v}{1+\\frac{v_1v}{c^2}}$ （8.6）',
    '图 226',
    '当 $v\\ll c$ 且 $v_1\\ll c$ 时，分母中的项 $\\frac{v_1v}{c^2}$ 可以忽略。\n此时，式（8.6）近似为速度合成的经典定律：\n$v_2=v_1+v$。',
    '当 $v_1=c$ 时，速度 $v_2$ 也等于 $c$，这符合相对论的第二个假设。\n代入可得：\n$v_2=\\frac{c+v}{1+\\frac{cv}{c^2}}=c\\frac{c+v}{c+v}=c$。',
    '速度合成的相对论定律具有一个重要性质：只要速度 $v_1$ 和 $v$ 都不大于 $c$，合速度 $v_2$ 就不超过 $c$。\n在形式上的极限情形中，令 $v_1=v=c$，可得：\n$v_2=\\frac{2c}{2}=c$。',
    '速度 $v>c$ 不可能。\n若 $v>c$，式（8.1）和（8.2）就失去物理意义，因为计算得到的时间和长度会成为虚数。',
    '**光速是自然界中传递相互作用的最大可能速度**。',
  ],
  en: [
    'The new law of velocity addition agrees with the relativistic concepts of space and time.\nThe classical law cannot be generally valid because it conflicts with the constancy of the speed of light in vacuum.',
    'Suppose a train moves at speed $v$ and a light wave travels inside the carriage in the direction of the train\'s motion.\nThe speed of the light wave relative to Earth must still be $c$, **not** $v+c$.\nThe new law of velocity addition must also give this result.',
    'We state, without proof, the law for the special case of collinear motion.\nAn object moves along the motion axis of reference frame $K_1$, while reference frame $K_1$ moves relative to reference frame $K$ at velocity $v$.\nThroughout the motion, the axes $X$ and $X_1$ remain coincident, while $Y$ and $Y_1$, and $Z$ and $Z_1$, remain parallel respectively (Figure 226).',
    '',
    'Let $v_1$ denote the object\'s velocity relative to $K_1$, and let $v_2$ denote the same object\'s velocity relative to $K$.\nThe relativistic law of velocity addition gives:\n$v_2=\\frac{v_1+v}{1+\\frac{v_1v}{c^2}}$ (8.6)',
    'Figure 226',
    'When $v\\ll c$ and $v_1\\ll c$, the term $\\frac{v_1v}{c^2}$ in the denominator can be neglected.\nEquation (8.6) then reduces approximately to the classical law of velocity addition:\n$v_2=v_1+v$.',
    'When $v_1=c$, the velocity $v_2$ also equals $c$, as required by the second postulate of relativity.\nSubstitution gives:\n$v_2=\\frac{c+v}{1+\\frac{cv}{c^2}}=c\\frac{c+v}{c+v}=c$.',
    'A notable property of the relativistic law is that, for the allowed speeds $v_1$ and $v$ (neither greater than $c$), the resulting speed $v_2$ does not exceed $c$.\nIn the formal limiting case $v_1=v=c$, we obtain:\n$v_2=\\frac{2c}{2}=c$.',
    'A speed $v>c$ is impossible.\nFor $v>c$, equations (8.1) and (8.2) lose their physical meaning because the calculated time and length become imaginary.',
    '**The speed of light is the maximum possible speed for transmitting interactions in nature**.',
  ],
}
const questions = {
  zh: [
    '1. 相对论以哪些基本论点为基础？',
    '2. 相对论的第一个假设与力学中的相对性原理有什么区别？',
    '3. 什么样的事件称为同时事件？',
    '4. 什么叫本征时间？',
    '5. 为什么“运动着的参考系中时间流逝得较慢”这一论点不违背相对性原理，也就是不违背“一切惯性参考系都是等价的”这一论点？',
    '6. 时间间隔的相对性是在哪个实验中发现的？',
    '7. 棒的长度怎样随它的速度变化？',
    '8. 当运动速度满足什么条件时，速度合成的相对论定律会化为经典定律？',
  ],
  en: [
    '1. Which propositions form the basis of relativity?',
    '2. How does the first postulate of relativity differ from the principle of relativity in mechanics?',
    '3. Which events are called simultaneous?',
    '4. What is proper time?',
    '5. Why does the statement that time passes more slowly in a moving reference frame not contradict the principle of relativity, namely that all inertial reference frames are equivalent?',
    '6. In which experiment was the relativity of time intervals discovered?',
    '7. How does the length of a rod change with its velocity?',
    '8. At what velocities does the relativistic law of velocity addition reduce to the classical law?',
  ],
}
const candidates = []
for (const locale of ['zh', 'en']) {
  const lesson = load(inventory.suppliedTemplates[0].path)
  const exercises = load(inventory.suppliedTemplates[1].path)
  lesson.locale = locale
  exercises.locale = locale
  if (locale === 'en') lesson.title = 'The Relativistic Law of Velocity Addition'
  assert.equal(text[locale].length, lesson.prose.length)
  lesson.prose.forEach((block, index) => {
    block.text = text[locale][index]
    block.changes = block.text === block.source_text ? [] :
      (locale === 'en' ? ['translation', 'wording', 'layout'] : ['wording', 'layout'])
  })
  assert.equal(questions[locale].length, exercises.exercises.length)
  exercises.exercises.forEach((exercise, index) => {
    exercise.text = questions[locale][index]
    exercise.lines = exercise.text.split('\n')
    exercise.changes = exercise.text === exercise.source_text ? [] :
      (locale === 'en' ? ['translation', 'wording', 'layout'] : ['wording', 'layout'])
  })
  for (const [kind, data] of [['lesson', lesson], ['exercises', exercises]]) {
    const file = path.join(owned, locale, `${kind}.template.json`)
    write(file, data)
    candidates.push({ locale, kind, ...bind(file) })
  }
}
write(path.join(owned, 'work/seed-authoring.json'), {
  schema: 'stemrobin/text-seed-authoring@1',
  ticket: inventory.ticket, batch: inventory.batch, card,
  inventoryFrozenBeforeSeeds: bind(inventoryPath),
  startedAfterInventoryFreeze: inventory.frozenAt,
  finishedAt: new Date().toISOString(),
  root: path.join(owned, 'root'), work: path.join(owned, 'work'),
  rawAndSeedCopies: copies,
  firstAuthoredTemplatesBeforeNativeLayout: candidates,
  sourceImagesOpened: 0, authoringRounds: 1, independentApproval: 'pending',
})
console.log(JSON.stringify({ root: path.join(owned, 'root'), work: path.join(owned, 'work'), candidates }, null, 2))
