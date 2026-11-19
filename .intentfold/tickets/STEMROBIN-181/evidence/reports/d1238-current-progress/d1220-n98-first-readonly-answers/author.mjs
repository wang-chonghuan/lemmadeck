import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const card = 'phy10-c2-s4-n98'
const author = path.join(tmp, 'd1203-n98-first-bilingual-text-author')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const texts = {
  zh: [
    '狭义相对论以两个基本假设为基础。第一，一切物理定律在所有惯性参考系中具有相同的形式，没有特殊的惯性系。第二，真空中的光速在所有惯性参考系中都相同，等于 $c$，不随光源或观察者的运动改变。',
    '力学中的相对性原理说，力学定律在所有惯性系中具有相同的形式。狭义相对论的第一个假设把这一要求扩大到一切物理定律，包括电磁现象的规律，而不只限于力学。',
    '在选定的参考系中，若两个事件由该系已经同步的各地钟记录为同一时刻，就称它们在这个参考系中同时发生。事件发生的时刻不等于信号到达观察者的时刻；不同地点的同时事件在另一个有相对运动的惯性系中一般并不同时。',
    '两个事件在某个惯性系的同一地点发生时，静止在该处的一只钟测得的时间间隔叫作这对事件的本征时间，记作 $\\tau_0$。它是这只钟亲自经历的间隔。相对该钟匀速运动的惯性系用同步钟测得的坐标时间间隔为 $\\tau=\\gamma\\tau_0$，其中 $\\gamma=1/\\sqrt{1-v^2/c^2}$，$|v|<c$。',
    '各惯性参考系都能用同一时间膨胀公式描述相对自己运动的钟，所以没有一个惯性系更特殊。对固定的一对事件，只有事件在同一地点发生的那个系能用当地一只静止钟测得本征时间；另一个系用不同地点的同步钟测量坐标时间。交换参考系、把另一只钟的相邻滴答作为事件时，比较的是另一对事件。不同惯性系对异地事件的同时性也不同，因此相互观察到运动钟较慢并不矛盾。',
    '短寿命粒子的衰变实验检验了时间间隔的相对性。例如，比较带电 $\\pi$ 介子静止或缓慢运动时的平均寿命与高速运动时由实验室钟测得的平均寿命。实验室中的平均寿命随速度增大，符合 $\\tau=\\gamma\\tau_0$。这里比较的是许多粒子的平均寿命，不要求每个粒子在同一时刻衰变。',
    '设硬质棒的固有长度为 $l_0$，棒沿自身长度方向相对测量惯性系以匀速 $v$ 运动，$|v|<c$。用该系同步钟在同一时刻确定两端位置，测得 $l=l_0\\sqrt{1-v^2/c^2}$。在 $l_0$ 不变时，速度大小越大，沿运动方向测得的长度越短；$v=0$ 时为 $l_0$。垂直于运动方向的长度不发生这种收缩。',
    '当参考系之间的相对速度 $v$ 和物体在运动参考系中的速度 $v_1$ 都远小于光速 $c$ 时，$|v_1v|/c^2\\ll1$，可以忽略相对论速度合成公式分母中的修正项。于是 $v_2=(v_1+v)/(1+v_1v/c^2)$ 近似为经典定律 $v_2\\approx v_1+v$，并不是在任意速度下都精确相等。',
  ],
  en: [
    'Special relativity is based on two postulates. First, all physical laws have the same form in every inertial reference frame; no inertial frame is privileged. Second, light in vacuum has the same speed $c$ in every inertial frame, independent of the motion of the source or observer.',
    'The principle of relativity in mechanics requires the laws of mechanics to have the same form in all inertial frames. The first postulate of special relativity extends that requirement to all physical laws, including the laws of electromagnetism, rather than mechanics alone.',
    'Two events are simultaneous in a chosen reference frame if synchronized clocks at their locations record the same time in that frame. Event times are not the times at which signals reach an observer. Events at different locations that are simultaneous in one inertial frame are generally not simultaneous in another moving inertial frame.',
    'If two events occur at the same location in an inertial frame, their proper time $\\tau_0$ is the interval measured by one clock at rest at that location. It is the interval directly experienced by that clock. An inertial frame moving uniformly relative to the clock measures the coordinate interval $\\tau=\\gamma\\tau_0$ with synchronized clocks, where $\\gamma=1/\\sqrt{1-v^2/c^2}$ and $|v|<c$.',
    'Every inertial frame uses the same time-dilation law for clocks moving relative to it, so no inertial frame is privileged. For a fixed pair of events, only the frame in which they occur at the same location uses one stationary local clock to measure their proper time; the other frame uses synchronized clocks at different locations to measure coordinate time. Exchanging the frames and taking successive ticks of the other clock selects a different pair of events. The frames also disagree about simultaneity at separated locations, so reciprocal time dilation is not a contradiction.',
    'Decay experiments with short-lived particles test the relativity of time intervals. For example, compare the mean lifetime of charged $\\pi$ mesons at rest or moving slowly with the mean lifetime of fast mesons measured by laboratory clocks. The laboratory mean lifetime increases with speed according to $\\tau=\\gamma\\tau_0$. This is an average over many particles, not a claim that every particle decays at the same time.',
    'Let a rigid rod have proper length $l_0$ and move uniformly along its own length at speed $v$ relative to the measuring inertial frame, with $|v|<c$. Locate both endpoints at the same time using that frame\'s synchronized clocks. The measured length is $l=l_0\\sqrt{1-v^2/c^2}$. For fixed $l_0$, increasing the speed magnitude decreases the measured length along the motion; at $v=0$ it equals $l_0$. A dimension perpendicular to the motion does not undergo this contraction.',
    'When both the relative frame speed $v$ and the object\'s speed $v_1$ in the moving frame are much smaller than the vacuum light speed $c$, $|v_1v|/c^2\\ll1$. The denominator correction in relativistic velocity addition can then be neglected. Thus $v_2=(v_1+v)/(1+v_1v/c^2)$ becomes approximately the classical law $v_2\\approx v_1+v$, not an exact equality valid at arbitrary speeds.',
  ],
}
const outputs = []
for (const locale of ['zh', 'en']) {
  const source = path.join(author, locale, 'exercises.template.json')
  const exercises = read(source).exercises
  assert.equal(exercises.length, 8)
  assert.ok(exercises.every(item => item.figure_refs.length === 0))
  const answers = exercises.map((exercise, index) => ({
    exercise: exercise.number, prompt: exercise.text, figureEvidence: [],
    grading: 'ungraded', source: 'derived', displayAnswer: texts[locale][index],
    parts: [], historical_entities: [],
  }))
  outputs.push({ locale, exercises: bind(source), candidate: save(path.join(own, locale, 'answer-keys.json'), {
    schema: 'ld-s10y-answer/lesson-answers@1', book: '10p', lesson: card,
    edition: 'modern-us-neutral', status: 'draft', answers,
  }) })
}
save(path.join(own, 'report.json'), {
  ticket: 'STEMROBIN-181', batch: 'D037', card,
  status: 'FIRST-EIGHT-BILINGUAL-READONLY-DERIVED-STANDARDS-INDEPENDENT-REVIEW-PENDING',
  outputs, sourceQuestionCount: 8, source: 'derived', grading: 'ungraded',
  oldAnswersRead: false, interactionsCreated: false, parentImageOpens: 0,
  nativeExecutions: 0, paidCalls: 0, completeCard: false,
})
