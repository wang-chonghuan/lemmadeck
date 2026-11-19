import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
assert.equal(out, path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d907-n88-first-bilingual-text-author'))
const card = 'phy10-c2-s3-n88'
const previous = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d905-n88-postassembly-finish')
const preparation = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d904-n88-first-source-preparation')
const book = path.join(preparation, 'root/10p')
const templates = path.join(preparation, 'work/adapt/10p/modern-us-neutral/lessons', card)
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  assert.ok(file.startsWith(out + path.sep))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o644 })
  return bind(file)
}
const saveText = (file, text) => {
  assert.ok(file.startsWith(out + path.sep))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, text, { flag: 'wx', mode: 0o644 })
  return bind(file)
}

assert.ok(!fs.existsSync(path.join(out, 'started.json')), 'FIRST author is not replayable')
const reportPath = path.join(previous, 'report.json')
assert.equal(sha(reportPath), '83bd58575ab556515266a99b496b26cc438ad2ed375430c31a5628b753f0a34f')
const previousReport = read(reportPath)
assert.equal(previousReport.root, path.join(preparation, 'root'))
assert.equal(previousReport.work, path.join(preparation, 'work'))
const requirementsPath = path.join(previous, 'source-requirements.json')
assert.equal(sha(requirementsPath), previousReport.requirements.sha256)
const requirements = read(requirementsPath)
assert.deepEqual(requirements.boundary, { first: 'p0233#4', last: 'p0236#6', nextHeading: 'p0236#7' })
assert.equal(requirements.sourceQuestions, 0)
const inputLesson = path.join(templates, 'lesson.template.json')
const inputExercises = path.join(templates, 'exercises.template.json')
const base = read(inputLesson)
const exercises = read(inputExercises)
assert.equal(base.id, card)
assert.equal(base.exercise_count, 0)
assert.deepEqual(base.errata, [])
assert.equal(exercises.count, 0)
assert.deepEqual(exercises.exercises, [])
assert.equal(sha(path.join(book, base.source.path)), base.source.sha256)
assert.equal(sha(path.join(book, exercises.source.path)), exercises.source.sha256)
const holdPath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d845-source235-first-author/boundary-deviation.json')
const hold = read(holdPath)
assert.equal(hold.wholeAssignmentWriteBoundaryCompliant, false)
const watchedInputs = [
  reportPath, requirementsPath, inputLesson, inputExercises, holdPath,
  path.join(book, base.source.path), path.join(book, exercises.source.path),
  ...requirements.sourceFigureIds.map(id => path.join(book, 'figures', id + '.png')),
  path.join(tools, 'edition.py'), path.join(tools, 'prose_flow.mjs'), path.join(tools, 'htmlfrag.js'),
  path.join(tools, 'mathcheck.py'), path.join(tools, 'katex_check.js'),
  path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
]
const inputBindings = watchedInputs.map(bind)
save(path.join(out, 'started.json'), {
  ticket: 'STEMROBIN-181', successor: 'successor181-3', stage: 'd907-n88-FIRST-bilingual-text-author',
  card, cwd: repo, onlyWriteRoot: out, offlineOnly: true, firstCandidateOnly: true,
  sourceReviews: 'Prior independent source-page pass consumed as explicitly supplied by the human; no full-source review replay.',
  inheritedHold: bind(holdPath), independentApproval: false,
})
fs.mkdirSync(path.join(out, 'runtime-tmp'), { recursive: true })
const env = { ...process.env, TMPDIR: path.join(out, 'runtime-tmp'), PYTHONDONTWRITEBYTECODE: '1' }
const native = (name, executable, args, input) => {
  const command = [executable, ...args]
  const result = spawnSync(executable, args, {
    cwd: repo, env, input, encoding: 'utf8', timeout: 60000, maxBuffer: 8 * 1024 * 1024,
  })
  const receipt = save(path.join(out, 'native', name + '.receipt.json'), {
    command, cwd: repo, TMPDIR: env.TMPDIR, exit: result.status, stdout: result.stdout,
    stderr: result.stderr, error: result.error?.message ?? null, textOnly: true,
    producerOrWholeCardCall: false,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return { stdout: result.stdout, receipt }
}

const texts = {
  'p0233#5': {
    zh: [
      '光具有波动性，所以除了干涉，还会发生**衍射**。',
      '衍射是波经过障碍物边缘或小孔后，向原来直线路径以外的区域展开的现象。',
      '水波也有这种特点，因此用波来理解光，就不能只把光想成一条细直线。',
      '波长表示波在空间中重复一次的长度，频率表示波在同一位置每单位时间振动的次数。',
      '这两个量分别描述空间和时间，不能把波长短说成振动次数少。',
      '在同一种媒质中、传播速度相同的条件下，频率越高，波长越短。',
      '原书提醒我们，障碍物的大小与波长相当时，绕行和展开比较明显。',
      '可见光的波长很短，日常遇到的障碍物往往大得多，所以光的衍射不容易直接看清。',
      '这不表示衍射不存在，而是它对这些尺度下的光路影响通常很小。',
    ],
    en: [
      'Light behaves as a wave, so it can show **diffraction** as well as interference.',
      'Diffraction is the spreading of a wave past an edge or through an opening, into regions beyond its straight-ahead path.',
      'Water waves also spread this way, so a wave picture of light cannot treat light only as a thin straight line.',
      'Wavelength describes the distance over which a wave repeats in space.',
      'Frequency describes how many oscillations occur at one position per unit of time.',
      'One describes space and the other describes time, so a short wavelength does not mean fewer oscillations.',
      'In the same medium, when the wave speed is the same, a higher frequency means a shorter wavelength.',
      'The source explains that spreading is especially noticeable when the obstacle is comparable in size to the wavelength.',
      'Visible light has a very short wavelength, while everyday obstacles are usually much larger.',
      'That makes diffraction hard to notice directly, not absent.',
    ],
    basis: 'Define diffraction and wavelength; add explicitly authored space/time distinction for frequency and the same-speed qualification. No new formula or numerical value.',
  },
  'p0233#6': {
    zh: [
      '一束细窄的光通过小孔后，在对面的屏幕上形成光斑。',
      '如果只按直线传播来画光路，预计的光斑会比较小。',
      '实际的光斑却展开得更大，说明小孔后的波不能完全用直线光路来描述。',
      '这就是原书所说的偏离直线传播规律，不是光违反了波的规律。',
      '这里讨论的是传播方向和光斑范围的变化，并不是说光通过静止的小孔就改变了频率。',
    ],
    en: [
      'A narrow beam passing through a small hole makes a spot on a screen beyond it.',
      'A drawing that allows only straight-line travel predicts a smaller spot.',
      'The actual spot spreads farther, showing that straight rays alone do not describe the wave after the opening.',
      'This is the departure from straight-line propagation described in the source, not a failure of wave behavior.',
      'The change concerns direction and the spread of the spot, not a change of frequency caused by passing through a stationary opening.',
    ],
    basis: 'Preserve the small-hole observation and clarify ray-model failure versus wave behavior; distinguish spatial spreading from frequency change.',
  },
  'p0233#7': {
    zh: [
      '**杨氏实验**：原书记述，杨在发现光的干涉后，于 1802 年做了图 203 所示的经典衍射实验。',
      '他用大头针在不透明的屏上刺出靠得很近的小孔 $B$ 和 $C$，并用通过另一块屏上小孔 $A$ 的细窄光束照亮它们。',
      '原书强调，由同一束光照亮双孔，是这个实验成功的关键。',
      '根据惠更斯原理，从小孔 $A$ 展开的球面波，到达小孔 $B$ 和 $C$ 时，引起彼此相干的振动。',
      '相干在这里表示振动频率相同，而且彼此的相位差保持稳定。',
      '相位描述振动进行到一个周期中的哪一步，稳定的相位差让两束光能够形成稳定的明暗条纹。',
      '原书所说的“只有相干波才能干涉”，在这个观察中指能形成稳定、可辨认的干涉条纹。',
      '不相干的波也能叠加，只是相位关系不断变化，不能维持这样的条纹。',
      '衍射使小孔 $B$ 和 $C$ 后面的两束光各自展开，因而能够在屏幕上相遇。',
      '重叠区域里，振动相互加强的位置较亮，相互抵消的位置较暗。',
      '图中的弧线表示波面，不是许多根可以抓住的细光线。',
      '衍射让光束展开，干涉决定它们重叠后的明暗分布，两个概念在这里一起起作用。',
      '杨遮住一个小孔时，双孔造成的干涉条纹消失了，但这不表示剩下小孔的光不再衍射。',
      '原书把这项实验记述为首次而且极其精确地测出了不同颜色光的波长。',
    ],
    en: [
      "**Young's experiment.** According to the source, in 1802, after discovering light interference, Young carried out the classic diffraction experiment shown in Figure 203.",
      'He used a pin to make two nearby holes, $B$ and $C$, in an opaque screen and illuminated them with a narrow beam through hole $A$ in another screen.',
      'The source stresses that illuminating both holes from the same beam was the crucial detail.',
      "By Huygens' principle, the spherical wave spreading from hole $A$ produces coherent oscillations at holes $B$ and $C$.",
      'Here, coherent means having the same frequency and a phase difference that stays steady.',
      'Phase describes where an oscillation is within its repeating cycle.',
      'A steady phase difference allows a stable pattern of bright and dark fringes.',
      'In this observation, the source statement that only coherent waves can interfere refers to producing stable, recognizable fringes.',
      'Incoherent waves can also overlap, but their changing phase relationship does not maintain that pattern.',
      'Diffraction spreads the light from holes $B$ and $C$ so the two beams can overlap on the observing screen.',
      'Where their oscillations reinforce one another, the screen is brighter.',
      'Where their oscillations cancel one another, it is darker.',
      'The curved lines in the diagram represent wavefronts, not many separate thin rays.',
      'Diffraction spreads the beams, while interference determines the brightness pattern where they overlap.',
      'Young found that covering one hole removed the two-hole interference fringes, although light from the remaining hole could still diffract.',
      'The source credits this experiment with the first, extremely precise measurements of wavelengths for different colors of light.',
    ],
    basis: 'Preserve Young, date, apparatus, ordered labels and source priority claim by attribution. Explain coherence, phase, overlap, and blocking one hole without denying remaining diffraction. Diagram wavefront meaning comes from inspected fig-203.',
  },
  'p0234#2': {
    zh: [
      '**菲涅耳的理论**：原书把菲涅耳的工作描述为衍射研究的重要进展。',
      '他不仅详细研究了不同的衍射现象，还建立了定量理论。',
      '定量的意思是不只说会发生什么，还能计算光波叠加后各处的振动大小，从而预测图样的明暗。',
      '原书指出，这套理论在原理上可以计算光绕过不同障碍物所产生的干涉图样。',
      '原书也把他记述为首次从波动出发，解释了光在同种媒质中为什么通常表现为直线传播。',
      '这让衍射和直线光路成为同一波动解释在不同条件下的结果。',
    ],
    en: [
      "**Fresnel's theory.** The source presents Fresnel's work as an important advance in the study of diffraction.",
      'He studied different diffraction effects in detail and developed a quantitative theory.',
      'Quantitative means being able to calculate the resulting oscillation at different places, rather than only describing what might happen.',
      'Those calculations predict the bright and dark parts of a pattern.',
      'The source says his theory made it possible in principle to calculate interference patterns caused by different obstacles.',
      'It also credits him with the first wave-based explanation of why light in a uniform medium usually appears to travel in straight lines.',
      'Diffraction and the apparent straight path can therefore be understood within the same wave picture.',
    ],
    basis: 'Preserve Fresnel and quantitative scope; attribute source priority claims. Explain quantitative without adding a calculation or task.',
  },
  'p0234#3': {
    zh: [
      '菲涅耳把惠更斯原理与次波相互干涉的观点结合起来。',
      '惠更斯原理让我们把波面上的各处看作发出次波的位置。',
      '把这些次波到达同一点时的振动合起来，才得到那一点的总效果。',
      '原书说这个想法在第四章已经简述过，这里仍保留原书的章节归属。',
    ],
    en: [
      "Fresnel combined Huygens' principle with the interference of secondary waves.",
      "Huygens' principle treats positions on a wavefront as sources of secondary waves.",
      'Their oscillations must be combined at the point being studied to find the total effect there.',
      'The source refers back to a brief account in its fourth chapter, a reference to the original book rather than a new chapter in this lesson.',
    ],
    basis: 'Retain Huygens, Fresnel and the literal fourth-chapter source identity. Define secondary-wave construction as a model, not new physical lamps.',
  },
  'p0234#4': {
    zh: [
      '为了求空间中某一点的光波振幅，可以想象一个封闭表面包住光源。',
      '封闭表面像一个没有开口的外壳，这个外壳只是计算时选取的，并不真的挡住光。',
      '把表面各处看作次光源，让它们发出的次波在所研究的点叠加。',
      '振幅表示振动离开平衡状态的最大程度，相位则说明这些振动是否步调相合。',
      '所以不能只把各个振幅的大小相加，还要考虑振动到达时怎样相互加强或抵消。',
      '这一叠加的总效果决定那一点的光波振幅。',
    ],
    en: [
      'To calculate the light-wave amplitude at a point in space, imagine a closed surface surrounding the light source.',
      'A closed surface is like a shell with no opening, chosen for the calculation rather than placed there to block the light.',
      'Treat positions on it as secondary sources and combine the waves they send to the point being studied.',
      'Amplitude describes the greatest departure of an oscillation from its equilibrium state.',
      'Phase tells us how the arriving oscillations line up in their cycles.',
      'We must therefore consider reinforcement and cancellation, not simply add the sizes of all the amplitudes.',
      'The combined result determines the light-wave amplitude at that point.',
    ],
    basis: 'Clarify the imaginary closed surface, amplitude and phase-aware addition without introducing a formula.',
  },
  'p0234#5': {
    zh: [
      '图中，点光源 S 发出球面波，我们研究光怎样到达观察点 $B$（图 204）。',
      '图里的弧线是半径为 $R$ 的球面波面的一部分，不是一块圆形挡光板。',
      '考虑球面上各处次波在点 $B$ 的叠加，原书说明，它们的总效果近似于由很小的球面片 $ab$ 发出光。',
      '球面其他部分的次波，在这个计算里大多相互抵消，因此看不出同样大的总效果。',
      '结果仿佛光主要沿直线 $SB$ 传播。',
      '“仿佛”很重要，它说的是许多波叠加后的有效结果，不是说只有那条线上的波才存在。',
      '图中的小片是在帮助说明这个近似结果，并没有给出可用来计算其大小的数值。',
    ],
    en: [
      'The point source S sends out spherical waves, and we consider how light reaches the observation point $B$ in Figure 204.',
      'The curved line is part of a spherical wavefront of radius $R$, not a round plate blocking light.',
      'When its secondary waves are combined at point $B$, the source describes an effective result approximately like light arriving from the small surface patch $ab$.',
      'In this calculation, contributions from much of the rest of the spherical surface cancel one another.',
      'The result is as if light traveled mainly along the straight line $SB$.',
      'As if matters: it describes the combined effect, not a claim that waves elsewhere do not exist.',
      'The small patch illustrates this approximation, and the diagram supplies no numerical value for its size.',
    ],
    basis: 'Use inspected fig-204 to distinguish wavefront arc from obstacle, preserve ordered B/R/B/ab/SB tokens, and expose the effective straight-ray approximation rather than exact universal cancellation.',
  },
  'p0235#1': {
    zh: [
      '**由理论预言图样**：菲涅耳还定量研究了光绕过不同类型障碍物时的衍射。',
      '同一个波动理论要解释不同形状的图样，不能只解释一种现象。',
    ],
    en: [
      '**Predicting patterns.** Fresnel also studied diffraction by different kinds of obstacles quantitatively.',
      'The same wave theory needed to account for different pattern shapes, not just one effect.',
    ],
    basis: 'Retain the brief source bridge and give it a genuine transition to source predictions.',
  },
  'p0235#2': {
    zh: [
      '原书记述，1818 年，法兰西科学院的一次会议上，一位学者指出了菲涅耳理论的一个出人意料的结果。',
      '在原书所述的特定孔径、光源到孔的距离和孔到屏幕的距离下，圆孔后光斑的中心应当出现一个小暗斑。',
      '相反，不透明的小圆盘后，本来处在阴影中心的位置应当出现一个亮斑。',
      '原书说实验确实观察到了这样的结果，使在场的学者惊讶。',
      '波绕过边缘后叠加，中心可能变暗，也可能变亮，因此只画直线和阴影边界不能解释这些图样。',
      '圆孔中心的明暗与孔径、距离等条件有关，不能把这里的暗斑说成所有圆孔都必定有的结果。',
      '原书没有在这段给出孔径和距离的数值，也没有写出这位学者的姓名，这里不补造。',
    ],
    en: [
      'The source recounts a surprising result discussed at a meeting of the French Academy of Sciences in 1818.',
      "An unnamed scholar pointed out a prediction of Fresnel's theory.",
      'For the particular hole size and source-to-hole and hole-to-screen distances described by the source, the center of the spot behind a round hole should be dark.',
      'Behind a small opaque disk, the center of the shadow should instead contain a bright spot.',
      'The source reports that experiments confirmed these effects, surprising the scholars.',
      'Waves spreading past edges can combine to make a center dark or bright, something a drawing of straight rays and shadow edges alone cannot explain.',
      'The center of a round-hole pattern depends on the hole size, distances, and other conditions; it is not always dark.',
      'This passage supplies neither numerical sizes and distances nor the name of the scholar, so none are added here.',
    ],
    basis: 'Retain 1818, French Academy of Sciences, anonymous scholar, conditional hole dark center and disk bright center. No added scientist, dimensions, or universal dark-hole claim.',
  },
  'p0235#3': {
    zh: [
      '**不同障碍物的图样**：光波的波长短，当孔或障碍物比波长大很多时，偏离直线方向的角度通常较小。',
      '为了在原书讨论的实验中看清衍射，尤其是前面那些细小的明暗变化，要让障碍物与屏幕相隔较远。',
      '距离长一些，小角度的展开也能在屏幕上拉开可见的距离。',
      '这说明要同时考虑波长、孔或障碍物的大小，以及观察距离，而不是只看其中一个条件。',
    ],
    en: [
      '**Patterns from different obstacles.** Light has a short wavelength, so spreading angles are usually small when an opening or obstacle is much larger than that wavelength.',
      'In the experiments discussed by the source, placing the observing screen far from the obstacle makes diffraction easier to see.',
      'This is especially useful for the small bright and dark features just described.',
      'Over a longer distance, even a small angle of spreading can produce a noticeable separation on the screen.',
      'Wavelength, obstacle or opening size, and observation distance must therefore be considered together.',
    ],
    basis: 'Preserve distant-screen observation while qualifying small-angle behavior by scale. No new numerical distance or formula.',
  },
  'p0235#4': {
    zh: [
      '图 205 展示三种障碍物产生的衍射图样照片，下面的字母只是子图标签，并不是练习小问。',
      '从左到右，标签与原书的对应关系如下。',
      'a) 细金属线形成的图样，能看到沿着线方向排列的明暗带。',
      'b) 圆孔形成的图样，能看到围绕中心分布的明暗环。',
      'c) 圆形不透明物形成的图样，暗影中央有一个亮点，外围还有环状明暗变化。',
      '这些照片显示不同形状的障碍物会产生不同的明暗分布，但没有给出可用来量距的刻度。',
      '圆孔这一幅的中心看起来是暗的，它是所示条件下的一个例子，不代表每一个圆孔图样都相同。',
    ],
    en: [
      'Figure 205 shows photographs of diffraction patterns produced by three kinds of obstacles.',
      'The letters below identify panels, not exercise questions.',
      'From left to right, their source identities are as follows.',
      'a) A thin metal wire produces bright and dark bands running along the wire direction.',
      'b) A round opening produces bright and dark rings around the center.',
      'c) A round opaque object produces a bright dot in the center of its dark shadow, with surrounding ring-like changes in brightness.',
      'The photographs show different brightness distributions, but provide no scale for measuring distances.',
      'The center of the round-opening example appears dark; this is one set of conditions, not the appearance of every round-opening pattern.',
    ],
    basis: 'Inspected fig-205 supplies qualitative bands/rings/central-dot descriptions. Localize Cyrillic panel letters to a/b/c, preserve left-to-right identity, no exact ring count or task.',
  },
  'p0235#7': {
    zh: [
      '**分辨不等于放大**：显微镜能把像放大，但光的波动性限制了它能分清多细的结构。',
      '分辨本领表示能否把相邻的细节认成彼此不同的部分，而不是像看起来有多大。',
      '由于衍射，小物体的像不能无限细小，而会展开成有一定宽度的模糊图样。',
      '如果相邻细节的图样混在一起，单纯放大只会把混在一起的像也放大，不能自动把细节分开。',
      '原书以物体大小小于光波波长为例，说明普通光学观察会遇到这样的困难。',
      '这里讲的是普通显微镜的衍射限制，并不是说波长是适用于所有成像方法、所有条件的一条绝对大小界线。',
      '是否能分清细节还与收集光的范围、成像方法和判定标准有关，所以不能只凭放大倍数下结论。',
    ],
    en: [
      '**Resolution is not magnification.** A microscope can make an image larger, but the wave nature of light limits how fine a structure it can distinguish.',
      'Resolution means recognizing nearby details as separate parts, not merely making their image look big.',
      'Diffraction spreads the image of a tiny object into a pattern with a finite width instead of an indefinitely sharp point.',
      'If patterns from neighboring details merge, magnification makes the merged image larger without automatically separating the details.',
      'The source uses objects smaller than the wavelength as an example of this difficulty in ordinary optical observation.',
      'This describes the diffraction limit of an ordinary microscope, not an absolute size boundary for every imaging method under every condition.',
      'Resolution also depends on how much light is collected, the imaging method, and the rule used to judge separation.',
      'Magnification alone does not settle whether details can be distinguished.',
    ],
    basis: 'Preserve the source below-wavelength example and merged-image observation. Explicitly delimit conventional optical resolution; do not present wavelength alone as a universal cutoff.',
  },
  'p0236#2': {
    zh: [
      '望远镜也有衍射造成的分辨限制。',
      '物镜是朝向被观察物体、收集光的镜头，它的开口有边界。',
      '光通过这个有限的开口时发生衍射，星星的像便不是理想的一个点，而是中央亮斑和周围较弱的明暗环。',
      '两个星星在天空中的方向非常接近时，像的图样会重叠，可能难以看出是两个光点。',
      '角距离说的是两个方向之间的夹角，不是两颗星在空间里的实际距离。',
      '原书说明，能分开的极限角距离由波长与物镜直径的比决定。',
      '这个比越小，在相同观察方法和判定条件下，就越有利于区分接近的光点。',
      '因此较大的物镜直径或较短的波长，通常有助于提高衍射受限的分辨本领。',
      '原书这里没有给出精确的系数或分辨判据，不能据此编出精确的极限数值。',
    ],
    en: [
      'Diffraction also limits a telescope.',
      'Its objective is the light-collecting lens facing the observed object, and its opening has a boundary.',
      'Diffraction at this finite opening makes a star image a central bright spot with fainter bright and dark rings, rather than an ideal point.',
      'If two stars lie in very similar directions in the sky, their patterns overlap and can be hard to recognize as two light sources.',
      'Angular separation means the angle between the viewing directions, not the actual distance between the stars in space.',
      'The source says the limiting angular separation is determined by the ratio of wavelength to objective diameter.',
      'A smaller ratio helps distinguish nearby directions when the observing method and separation criterion are the same.',
      'A larger objective diameter or a shorter wavelength therefore usually improves diffraction-limited resolution.',
      'The source gives no exact factor or separation criterion here, so it does not support an exact numerical limit.',
    ],
    basis: 'Retain star rings and wavelength/diameter ratio in words. Explain angular separation, aperture and conditional trend; add no Rayleigh constant or numerical aperture equation.',
  },
  'p0236#3': {
    zh: [
      '**直线光路的适用范围**：几何光学把光的传播用光线来描述，便于讨论光路、影子、反射和折射。',
      '衍射说明这种描述是近似模型，不是对任何尺度都完全准确的图景。',
      '原书强调，当传播路径上的障碍物远大于光波的波长时，直线传播和其他几何光学规律才适用。',
      '把这句话与原书前面所说的“近似性质”合起来理解，意思是在所研究的尺度上，衍射影响小到可以忽略时，光线模型很准确。',
      '它不表示波动消失，也不表示所有实验误差都不存在。',
      '当孔、边缘附近的细节或待分辨的结构接近波长的尺度时，就要考虑波的展开和干涉，不能继续只靠直线光路。',
    ],
    en: [
      '**When straight rays are useful.** Geometrical optics represents light by rays, which are useful for describing paths, shadows, reflection, and refraction.',
      'Diffraction shows that this is an approximate model, not a complete picture at every scale.',
      'The source emphasizes obstacles much larger than the wavelength as the condition for applying straight-line propagation and the other laws of geometrical optics.',
      'Read together with its statement about approximation, this means the ray model is very accurate when diffraction is negligible for the scale being studied.',
      'It does not mean wave behavior disappears or that every experimental error is absent.',
      'When openings, details near edges, or structures to be resolved approach the wavelength scale, spreading and interference must be considered instead of relying only on straight rays.',
    ],
    basis: 'Preserve the source much-larger-than-wavelength condition and explicitly interpret accuracy as an approximation with observation-scale limits, not exact universal straight propagation.',
  },
  'p0236#5': {
    zh: [
      '**奥古斯汀·菲涅耳**：原书介绍的奥古斯汀·菲涅耳生于 1788 年，卒于 1827 年，是法国物理学家。',
      '旁边保留来源身份的肖像对应的就是这位物理学家，不是虚构人物。',
      '原书评价，菲涅耳奠定了现代波动光学的基础。',
      '他用次波干涉补充惠更斯原理，建立了衍射的定量理论。',
      '这些贡献把观察到的明暗图样与可以计算的波动模型联系起来。',
    ],
    en: [
      '**Augustin Fresnel.** The source identifies Augustin Fresnel, born in 1788 and deceased in 1827, as a French physicist.',
      'The adjacent source portrait represents this historical physicist, not a fictional character.',
      'The source credits Fresnel with laying the foundations of modern wave optics.',
      "He supplemented Huygens' principle with interference between secondary waves and developed a quantitative theory of diffraction.",
      'These contributions connected observed brightness patterns with a wave model that could be used for calculation.',
    ],
    basis: 'Retain literal source full name, 1788/1827, French identity, Huygens and contributions. The inspected portrait supports only its source-bound identity, not new biographical details or archival authenticity.',
  },
  'p0236#6': {
    zh: [
      '原书把首先证实**光波横向性**的贡献归于菲涅耳。',
      '横向性表示光的振动方向与传播方向垂直，这与波经过边缘后的衍射展开不是同一个意思。',
      '前面的次波和波面图帮助描述传播与叠加，却不能只凭那些弧线就证明光的振动方向。',
      '原书还指出，菲涅耳关于反射波和折射波的相位、振幅的公式，仍然具有重要意义。',
      '这一段只介绍这些公式研究什么，没有列出公式本身，所以这里也不补写。',
    ],
    en: [
      'The source credits Fresnel with first establishing the **transverse nature of light waves**.',
      'Transverse means that the oscillation direction is perpendicular to the direction of travel.',
      'It is not another name for the spreading of a wave past an edge.',
      'The earlier wavefront drawings help describe propagation and overlap, but their curved lines alone do not establish the oscillation direction.',
      "The source also states that Fresnel's formulas for the phase and amplitude of reflected and refracted waves remain important.",
      'This passage describes what those formulas concern without giving the formulas themselves, so none are added here.',
    ],
    basis: 'Attribute source priority claim, explain transverse versus diffraction and wavefront-model limitation, retain reflection/refraction phase/amplitude significance without adding formulas.',
  },
}

const entityTerms = {
  'p0233#7': [['杨', 'Young'], ['惠更斯', 'Huygens']],
  'p0234#2': [['菲涅耳', 'Fresnel']],
  'p0234#3': [['菲涅耳', 'Fresnel'], ['惠更斯', 'Huygens']],
  'p0235#1': [['菲涅耳', 'Fresnel']],
  'p0235#2': [['法兰西科学院', 'French Academy of Sciences'], ['菲涅耳', 'Fresnel']],
  'p0236#5': [['奥古斯汀·菲涅耳', 'Augustin Fresnel'], ['菲涅耳', 'Fresnel'], ['法国', 'French'], ['惠更斯', 'Huygens']],
  'p0236#6': [['菲涅耳', 'Fresnel']],
}
const conceptStarts = {
  zh: ['**杨氏实验**', '**菲涅耳的理论**', '**由理论预言图样**', '**不同障碍物的图样**',
    '**分辨不等于放大**', '**直线光路的适用范围**', '**奥古斯汀·菲涅耳**'],
  en: ["**Young's experiment.**", "**Fresnel's theory.**", '**Predicting patterns.**',
    '**Patterns from different obstacles.**', '**Resolution is not magnification.**',
    '**When straight rays are useful.**', '**Augustin Fresnel.**'],
}
const sourceObservations = [
  {
    id: 'fig-203', refs: ['p0233#7', 'p0234#1', 'p0233#8', 'p0233#9'],
    visibleLabels: ['A', 'B', 'C'],
    observation: 'Upper barrier with A; spreading curved wavefronts reach a second barrier with B and C; two spreading wavefront families overlap below it and reach a lower screen. No numerical lengths or angle scale.',
    use: 'Explain shared illumination, coherent secondary waves, spreading and overlap; curved strokes denote wavefronts rather than ray paths.',
    uncertainty: 'Source stroke density and scan texture are not a reliable count of wave cycles or fringes.',
  },
  {
    id: 'fig-204', refs: ['p0234#5', 'p0234#8', 'p0234#6', 'p0234#7'],
    visibleLabels: ['S', 'R', 'a', 'b', 'B'],
    observation: 'Point source S on left, radius segment R to curved spherical wavefront, near-axis patch endpoints a and b, and horizontal line from S to observation point B on right.',
    use: 'Identify the arc as a wavefront, not an opaque disk; distinguish a model surface patch and an effective straight propagation direction.',
    uncertainty: 'Patch size is schematic and has no supplied number; do not infer exact cancellation everywhere outside it.',
  },
  {
    id: 'fig-205', refs: ['p0235#4', 'p0235#5', 'p0235#6'],
    sourcePanelLabels: ['а', 'б', 'в'], futureVisiblePanelLabels: ['a', 'b', 'c'],
    observation: 'Three panels left to right: fine metal wire with longitudinal bands; circular hole with alternating concentric brightness and a dark-looking center; opaque circular object with central bright dot in dark shadow and surrounding ring-like pattern.',
    use: 'Retain wire/opening/disk identities and qualitative brightness distribution, with Latin panel labels in both candidate texts.',
    uncertainty: 'No scale or reliable exact ring count. The shown dark hole center is conditional, not universal.',
  },
  {
    id: 'tbl-p0236-01', refs: ['p0236#4', 'p0236#5', 'p0236#6'],
    visibleLabels: [],
    observation: 'Unlabeled monochrome historical portrait crop of a man in formal clothing, associated by source biography with Augustin Fresnel.',
    use: 'Retain the source portrait subject identity only; biography stays bound to source text and dates.',
    uncertainty: 'Pixels alone do not independently prove identity, image provenance, or archival authenticity. No generated or reused modern portrait is approved.',
  },
]
save(path.join(out, 'source-diagram-usage.json'), {
  schema: 'STEMROBIN-181/d907-source-diagram-usage@1', authorObservationOnly: true,
  imageBatches: [{ batch: 1, images: 4, portraitIncluded: true, perBatchLimit: 4 }],
  imagesLoadedInThisContext: 4, reopens: 0, crops: 0, fullSourcePagesLoaded: 0,
  contextImageLimit: 24, noIndependentSourceReviewReplay: true,
  figures: sourceObservations.map(item => ({
    ...item, source: bind(path.join(book, 'figures', item.id + '.png')),
    modernAssetCreated: false, modernFigureApproval: false,
  })),
})

const normalizeCode = `
import json, sys
sys.path.insert(0, sys.argv[1])
import edition
document = json.load(sys.stdin)
edition.normalize_lesson_layout(document)
print(json.dumps(document, ensure_ascii=False))
`
const candidates = {}
const outlineEvidence = {}
const candidateBindings = {}
for (const locale of ['zh', 'en']) {
  const lesson = structuredClone(base)
  lesson.locale = locale
  lesson.status = 'draft'
  if (locale === 'en') lesson.title = 'Diffraction of Light'
  lesson.section_breaks = []
  const authoredRefs = []
  for (const block of lesson.prose) {
    const ref = block.source_refs[0]
    if (block.kind === 'p') {
      assert.ok(texts[ref], 'Missing authored prose: ' + ref)
      block.text = texts[ref][locale].join('\n')
      block.changes = locale === 'en' ? ['translation', 'explanation', 'layout'] : ['explanation', 'layout']
      block.numeric_changes = []
      block.historical_entities = (entityTerms[ref] ?? []).map(([sourceTerm, englishTerm]) => ({
        term: locale === 'en' ? englishTerm : sourceTerm,
        ...(locale === 'en' ? { source_term: sourceTerm } : {}),
        reason: `Source-bound historical identity in ${block.source_refs.join(', ')}; retained rather than replaced by a fictional modern name. English source_term is a literal source alias, not an added source fact.`,
      }))
      authoredRefs.push(ref)
    } else if (block.kind === 'cap') {
      block.text = 'Figure ' + block.source_text.match(/\d+/)[0]
      block.changes = ['translation', 'layout']
    }
    if (locale === 'en' && ['fig', 'cap'].includes(block.kind) && block.label)
      block.label = 'Figure ' + block.label.match(/\d+/)[0]
  }
  assert.deepEqual(authoredRefs.sort(), Object.keys(texts).sort())
  if (locale === 'en')
    for (const figure of lesson.figures)
      if (figure.label) figure.label = 'Figure ' + figure.label.match(/\d+/)[0]
  const normalized = native('normalize-' + locale, python, ['-B', '-c', normalizeCode, tools], JSON.stringify(lesson))
  const document = JSON.parse(normalized.stdout)
  const lessonFile = path.join(out, locale, 'lesson.template.json')
  save(lessonFile, document)
  const exerciseFile = path.join(out, locale, 'exercises.template.json')
  fs.copyFileSync(inputExercises, exerciseFile, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(exerciseFile, 0o644)
  assert.equal(sha(exerciseFile), sha(inputExercises))
  // Select named conceptual transitions from the helper's literal adjacent-paragraph objects.
  const outline = native('outline-' + locale, process.execPath, [path.join(tools, 'prose_flow.mjs'), lessonFile])
  const boundaryObjects = outline.stdout.split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  document.section_breaks = conceptStarts[locale].map(start => {
    const matches = boundaryObjects.filter(boundary => boundary.after.startsWith(start))
    assert.equal(matches.length, 1, 'Concept must match exactly one native boundary: ' + start)
    return structuredClone(matches[0])
  })
  fs.writeFileSync(lessonFile, JSON.stringify(document, null, 2) + '\n')
  const flow = native('flow-' + locale, process.execPath, [path.join(tools, 'prose_flow.mjs'), '--json', lessonFile])
  candidates[locale] = document
  candidateBindings[locale] = { lesson: bind(lessonFile), exercises: bind(exerciseFile), writableMode: '0644' }
  outlineEvidence[locale] = {
    boundaryDerivation: outline.receipt,
    finalFlow: flow.receipt,
    paragraphs: JSON.parse(flow.stdout).paragraphs.length,
    sectionBreaks: JSON.parse(flow.stdout).boundaries,
    boundarySelection: 'Literal before/after objects copied from native prose_flow output by named concept starts; no handwritten paragraph integers.',
  }
}

const checkCode = `
import copy, json, re, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import edition as e
import mathcheck
payload = json.load(sys.stdin)
book = Path(payload["book"])
profile = payload["profile"]
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
raw = e.load(book / payload["rawLesson"])
raw_exercises = e.load(book / payload["rawExercises"])
requirements = payload["requirements"]
expected_refs = [b["ref"] for b in requirements["blocks"] if b["kind"] != "h3"]
results = {}
katex_items = []
def fail(errors, condition, message):
    if not condition:
        errors.append(message)
for locale, document in payload["candidates"].items():
    errors = []
    fail(errors, document["schema"] == e.LESSON_SCHEMA, "Wrong lesson schema")
    fail(errors, document["edition"] == "modern-us-neutral", "Wrong edition")
    fail(errors, document["status"] == "draft", "Candidate must not claim approval")
    errors += e.validate_source(book, document.get("source"), book / payload["rawLesson"], "lesson")
    errors += e.validate_lesson_identity(raw, document)
    fail(errors, document.get("errata") == [], "No unbound errata permitted")
    fail(errors, document.get("exercise_count") == 0, "No original tasks")
    fail(errors, len(document["prose"]) == len(raw["prose"]), "Prose object count changed")
    normalized = copy.deepcopy(document)
    e.normalize_lesson_layout(normalized)
    fail(errors, normalized == document, "Candidate must already have native normalized layout")
    block_results = []
    actual_refs = []
    for index, (source, modern) in enumerate(zip(raw["prose"], document["prose"])):
        label = f"{locale}.prose[{index}]"
        block_errors = []
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            if field == "label" and source["kind"] in ("fig", "cap"):
                fail(block_errors, e.same_figure_label(source.get(field), modern.get(field), locale), label + ".label changed identity")
            else:
                fail(block_errors, source.get(field) == modern.get(field), label + "." + field + " changed identity")
        fail(block_errors, modern["source_text"] == source.get("text", ""), label + ".source_text changed")
        block_errors += e.validate_text(
            source.get("text", ""), modern.get("text"), modern.get("changes"), modern.get("numeric_changes"),
            label, forbidden, modern.get("historical_entities"), None, modern.get("notation_changes"))
        source_math = [m.group(0) for m in e.MATH.finditer(source.get("text", ""))]
        modern_math = [m.group(0) for m in e.MATH.finditer(modern["text"])]
        fail(block_errors, source_math == modern_math, label + " ordered literal math tokens changed")
        source_numbers = re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", source.get("text", "")))
        modern_numbers = re.findall(r"\\d+(?:\\.\\d+)?", e.MATH.sub("", modern["text"]))
        fail(block_errors, source_numbers == modern_numbers, label + " ordered numeric tokens, including figure references, changed")
        fail(block_errors, modern.get("numeric_changes") == [], label + " numeric changes not authorized")
        block_errors += mathcheck.check_delimiters(modern["text"])
        fail(block_errors, not re.search(r"<\\/?(?:span|div|p|br)\\b", modern["text"], re.I), label + " handwritten markup")
        if locale == "en":
            fail(block_errors, not e.NON_ENGLISH_FIGURE_SCRIPT.search(modern["text"]), label + " non-English visible text")
        if modern["kind"] == "cap":
            fail(block_errors, bool(re.fullmatch(r"Figure \\d+", modern["text"])), label + " non-English visible caption")
        if modern["kind"] == "fig":
            fail(block_errors, modern["text"] == "", label + " invented figure content")
        for tex, display in mathcheck.find_math_spans(modern["text"]):
            katex_items.append({"id": label, "field": "text", "tex": tex, "display": display})
        actual_refs.extend(modern["source_refs"])
        block_results.append({
            "sourceRefs": modern["source_refs"], "kind": modern["kind"],
            "sourceMathTokens": source_math, "candidateMathTokens": modern_math,
            "sourceNumericTokens": source_numbers, "candidateNumericTokens": modern_numbers,
            "nativeTextErrors": block_errors, "historicalEntities": modern.get("historical_entities", []),
        })
        errors += block_errors
    fail(errors, len(actual_refs) == len(set(actual_refs)), "Duplicate source reference")
    fail(errors, set(actual_refs) == set(expected_refs), "Missing or outside n88 source reference")
    fail(errors, document["prose"][-1]["source_refs"][-1] == "p0236#6", "Wrong right boundary")
    fail(errors, all("p0236#7" not in b["source_refs"] for b in document["prose"]), "n89 included")
    fail(errors, [b["id"] for b in document["prose"] if b["kind"] == "fig"] == requirements["sourceFigureIds"], "Figure identity/order changed")
    fail(errors, [b["id"] for b in document["figures"]] == requirements["sourceFigureIds"], "Figure registry identity/order changed")
    results[locale] = {"status": "pass" if not errors else "fail", "errors": errors, "blocks": block_results,
        "exerciseCount": 0, "sourceReferenceSetExactlyCoveredOnce": set(actual_refs) == set(expected_refs) and len(actual_refs) == len(set(actual_refs))}
exercise_results = {}
for locale, exercise in payload["exercises"].items():
    errors = e.validate_source(book, exercise.get("source"), book / payload["rawExercises"], "exercises")
    fail(errors, exercise["schema"] == e.EXERCISES_SCHEMA, "Wrong exercise schema")
    fail(errors, exercise["count"] == raw_exercises["count"] == 0, "Invented task count")
    fail(errors, exercise["exercises"] == raw_exercises["exercises"] == [], "Invented task")
    exercise_results[locale] = {"status": "pass" if not errors else "fail", "errors": errors, "count": 0}
print(json.dumps({"scope": "Native text/source/identity/math/number contracts only; no full validate_lesson or figure gates",
    "independentApproval": False, "lessons": results, "exercises": exercise_results, "katexInput": katex_items}, ensure_ascii=False))
`
const checked = native('text-contract-FIRST', python, ['-B', '-c', checkCode, tools], JSON.stringify({
  book, profile: read(path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')),
  rawLesson: base.source.path, rawExercises: exercises.source.path,
  requirements, candidates, exercises: { zh: read(candidateBindings.zh.exercises.path), en: read(candidateBindings.en.exercises.path) },
}))
const textEvidence = JSON.parse(checked.stdout)
const katex = native('katex-text-only-FIRST', process.execPath, [path.join(tools, 'katex_check.js')], JSON.stringify(textEvidence.katexInput))
const katexResults = JSON.parse(katex.stdout)
const allTextErrors = [
  ...Object.values(textEvidence.lessons).flatMap(item => item.errors),
  ...Object.values(textEvidence.exercises).flatMap(item => item.errors),
  ...katexResults.filter(item => !item.ok || item.fatal || item.warnings?.length).map(item => JSON.stringify(item)),
]
const textStatus = allTextErrors.length ? 'fail' : 'pass'
save(path.join(out, 'native-text-only-evidence.json'), {
  schema: 'STEMROBIN-181/d907-native-text-only-evidence@1', status: textStatus,
  scope: textEvidence.scope, independentApproval: false, candidates: candidateBindings,
  nativeContract: checked.receipt, flow: outlineEvidence, katex: katex.receipt,
  literalMathTokensChecked: textEvidence.katexInput.length, errors: allTextErrors,
  evidenceIsNot: ['Independent bilingual review', 'Source review replay', 'Modern figure approval', 'Whole-card validation', 'Publication authorization'],
})
const mapping = {
  schema: 'STEMROBIN-181/d907-source-mapping@1', card, sourceRequirements: bind(requirementsPath),
  boundary: requirements.boundary, originalSourceQuestions: 0, modernAuthoredTasks: 0,
  sourceHeading: { ref: 'p0233#4', source: requirements.blocks[0].lines.join('\n'), role: 'Original number/printed_title; Chinese title preserved and English title localized.' },
  sourceSnapshot: bind(path.join(book, base.source.path)), candidateFiles: candidateBindings,
  continuity: [
    { refs: ['p0233#7', 'p0234#1'], role: 'One Young apparatus/interference prose object across fig-203; object and ordered math tokens preserved.' },
    { refs: ['p0234#5', 'p0234#8'], role: 'One spherical-wavefront argument across fig-204; object and ordered math tokens preserved.' },
    { refs: ['p0235#7', 'p0236#1'], role: 'One microscope resolution argument across page boundary; original below-wavelength example retained and scoped.' },
  ],
  blocks: base.prose.map((block, index) => ({
    sourceRefs: block.source_refs, kind: block.kind, figureId: block.id,
    sourceTextSha256: crypto.createHash('sha256').update(block.source_text).digest('hex'),
    authoringBasis: texts[block.source_refs[0]]?.basis ??
      (block.kind === 'cap' ? 'Caption text localized to English; number and source snapshot unchanged.' : 'Figure placeholder retained without drawing, new pixels or modern approval.'),
    locales: Object.fromEntries(['zh', 'en'].map(locale => [locale, {
      candidateTextSha256: crypto.createHash('sha256').update(candidates[locale].prose[index].text).digest('hex'),
      orderedMathTokens: textEvidence.lessons[locale].blocks[index].candidateMathTokens,
      orderedNumericTokens: textEvidence.lessons[locale].blocks[index].candidateNumericTokens,
      changes: candidates[locale].prose[index].changes,
      historicalEntities: candidates[locale].prose[index].historical_entities,
    }])),
  })),
  displayLanguage: {
    captions: 'Figure 203, Figure 204, Figure 205 in both candidate texts.',
    panelLabels: 'a, b, c are figure panel labels, not authored tasks.',
    chineseInternalLabels: 'Chinese routing labels remain in zh metadata to preserve the native identity contract; visible caption text is English.',
    futureFigureLabels: 'English only. No modern figure bytes were authored or approved in this stage.',
  },
  sourceClaimsNotIndependentlyVerified: [
    'The source dates the Young experiment to 1802 and attributes first highly precise wavelength measurements to it.',
    'The source dates the academy account to 1818; the unnamed scholar is not renamed.',
    'Source priority claims for Fresnel are attributed to the source, not silently replaced by a new historical narrative.',
    'The original fourth-chapter reference remains a source-book identity, not an invented local lesson link.',
  ],
  scopeClarificationsNotErrata: [
    'Coherent-only interference is scoped to stable observable fringes; incoherent waves may still superpose.',
    'A dark hole center is conditional on setup; no universal dark center or exact dimensions are invented.',
    'The small spherical patch describes an effective approximation, not an assertion that all other waves physically vanish.',
    'Below-wavelength microscopy is a source example scoped to ordinary optical imaging; no absolute all-method cutoff is asserted.',
    'Geometrical optics is an approximate model on the relevant observation scale, not exact at all scales.',
    'Frequency and wavelength, diffraction and transverse oscillation, and magnification and resolution are explicitly distinguished.',
  ],
  registeredErrata: [], numericChanges: [], independentApproval: false,
}
save(path.join(out, 'source-mapping.json'), mapping)
save(path.join(out, 'usage.json'), {
  schema: 'STEMROBIN-181/d907-author-usage@1', card, stage: 'FIRST bilingual text author',
  contentCandidates: { zh: 1, en: 1 }, contentRevisionsAfterFirstFreeze: 0,
  independentlyApprovedCandidates: 0, authorSelfIndependentReviews: 0,
  imagesLoaded: 4, imageBatches: 1, portraitsLoaded: 1, reopens: 0, crops: 0,
  fullSourcePageImagesLoaded: 0, priorSourceReviewReplays: 0,
  modernFiguresCreated: 0, modernPortraitsCreatedOrReused: 0, paidCalls: 0,
  calls: {
    normalizeText: 2, nativeBoundaryDerivation: 2, finalNativeFlow: 2,
    nativeTextContract: 1, katexTextOnly: 1,
    adaptPrepare: 0, adaptFinalize: 0, sourceFinalize: 0, assemble: 0, vectorize: 0,
    renderWholeCard: 0, wholeProjectTests: 0, publishers: 0, database: 0,
    git: 0, meterOrIndex: 0, otherChats: 0, backendOrNetwork: 0, deploy: 0,
  },
  inputBindings,
  nativePython: 'Python -B and PYTHONDONTWRITEBYTECODE=1; TMPDIR confined to own runtime-tmp.',
  inheritedSource235HelperDeviation: {
    evidence: bind(holdPath), status: 'HOLD, not waived',
    originalDeviation: 'Historical n-plane GET helper created and deleted four response temp files outside its allowed write root.',
    exactDeletedFileNames: null, noReconstructionInvented: true,
    notMadeCompliantBySourceOrContentPass: true,
  },
})
for (const binding of inputBindings)
  assert.equal(sha(binding.path), binding.sha256, 'Read-only input changed during authoring: ' + binding.path)
const uncertainties = [
  'Independent bilingual pedagogical/scientific and historical-name review is still required; this agent is the author, not that reviewer.',
  'All four modern diagrams/portrait remain uncreated and unapproved. Original PNG inspection is explanatory context only, not a modern figure gate.',
  'Historical source235 helper write-boundary deviation remains HOLD; a source or text pass cannot waive it.',
  'Offline source attribution is retained for historical dates and priority claims; no external verification was attempted.',
  'Source supplies no exact aperture sizes, observation distances, resolution coefficient, separation criterion, or image scale; no such facts are fabricated.',
  'Source gray/black scan texture does not support exact fringe/ring counts or portrait provenance claims.',
  'Additional scope clarifications are authored explanations for independent review, not source transcriptions or silent mathematical errata.',
]
const report = save(path.join(out, 'report.json'), {
  schema: 'STEMROBIN-181/d907-FIRST-bilingual-text-author@1',
  ticket: 'STEMROBIN-181', successor: 'successor181-3', card,
  status: textStatus === 'pass' ? 'FIRST-CANDIDATE-FROZEN-TEXT-ONLY-PASS-OVERALL-HOLD' : 'FIRST-CANDIDATE-FROZEN-TEXT-ONLY-FAIL-OVERALL-HOLD',
  authorOnly: true, cwd: repo, onlyWriteRoot: out, offlineOnly: true,
  candidate: candidateBindings, sourceBoundary: requirements.boundary,
  originalQuestions: 0, authoredChoices: 0, authoredAnswers: 0, authoredPractice: 0,
  nativeTextOnlyStatus: textStatus, nativeTextErrors: allTextErrors,
  sourceMapping: bind(path.join(out, 'source-mapping.json')),
  sourceDiagramUsage: bind(path.join(out, 'source-diagram-usage.json')),
  nativeTextEvidence: bind(path.join(out, 'native-text-only-evidence.json')),
  usage: bind(path.join(out, 'usage.json')),
  inheritedHold: { evidence: bind(holdPath), status: 'HOLD, not waived', contentGateDoesNotWaive: true },
  uncertainties, independentApproval: false, completeCard: false,
  candidateFreeze: 'FIRST final bytes are frozen by this hash-bound record. Candidate templates remain 0644 writable for an explicitly authorized later stage; no further author changes in this run.',
  stop: 'Stop after this FIRST text-only freeze. No adapt-finalize, assembly, modern image work, whole-card rendering, canonical promotion, index/meter, Git, DB, publisher, deploy, backend or other-chat actions.',
})
const artifactBindings = [
  ...Object.values(candidateBindings).flatMap(item => [item.lesson, item.exercises]),
  ...['started.json', 'source-mapping.json', 'source-diagram-usage.json', 'usage.json', 'native-text-only-evidence.json', 'author-FIRST.mjs'].map(name => bind(path.join(out, name))),
  ...fs.readdirSync(path.join(out, 'native')).map(name => bind(path.join(out, 'native', name))),
  report,
]
const frozen = save(path.join(out, 'FIRST-freeze.json'), {
  schema: 'STEMROBIN-181/d907-FIRST-freeze@1', candidateOrdinal: 'FIRST', freezeCount: 1,
  authorOnly: true, independentApproval: false, status: 'HOLD', artifacts: artifactBindings,
  sourceInputsUnchangedAtFreeze: true, sourceInputs: inputBindings,
})
for (const artifact of artifactBindings)
  if (!Object.values(candidateBindings).some(item => [item.lesson.path, item.exercises.path].includes(artifact.path)))
    fs.chmodSync(artifact.path, 0o444)
fs.chmodSync(frozen.path, 0o444)
console.log(JSON.stringify({
  status: 'FIRST-FROZEN-OVERALL-HOLD', nativeTextOnlyStatus: textStatus,
  candidates: candidateBindings, report, freeze: frozen,
  sourceQuestions: 0, imagesLoaded: 4, paidCalls: 0, independentApproval: false,
}, null, 2))
