import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const folder = `${base}/d566-n75-first-bilingual-text-author`;
const prepared = `${base}/d564-n75-first-source-preparation`;
const manifest = await read(`${prepared}/manifest.json`);
const card = 'phy10-c2-s2-n75';
assert.equal(manifest.card, card);
assert.equal(manifest.sourceQuestions, 0);
assert.equal(await exists(folder), false);
const entries = [
  {
    ref: 'p0197#4', requirements: ['N75-R02'],
    zh: '前面讨论的是光在两种媒质的平面交界面上的折射。\n许多光学装置也利用球面上的折射。\n原教材强调球面便于制造，这是引入球面透镜的实用背景，并不表示所有现代光学表面都只能采用球面。',
    en: 'We have discussed refraction at a plane boundary between two media.\nMany optical devices also use refraction at spherical surfaces.\nThe original textbook emphasizes their ease of manufacture as a practical reason for studying spherical lenses, not as a claim that every modern optical surface must be spherical.',
  },
  {
    ref: 'p0197#5', requirements: ['N75-R03'],
    zh: '在本节的初等模型中，**透镜是由两个球面围成的透明物体**①。',
    en: 'In the elementary model used here, **a lens is a transparent body bounded by two spherical surfaces**①.',
  },
  {
    ref: 'p0197#14', requirements: ['N75-R03'],
    zh: '① 其中一个表面也可以是平面。\n在这一几何约定中，平面可看作曲率半径无限大的球面。',
    en: '① One surface may instead be plane.\nIn this geometric convention, a plane is treated as a spherical surface with an infinite radius of curvature.',
  },
  {
    ref: 'p0197#6', requirements: ['N75-R04'],
    zh: '透镜常用玻璃制成。\n通过两个球面曲率中心的直线 $O_1O_2$ 叫做透镜的**主光轴**，如图 164 所示。\n这里的 $O_1$ 和 $O_2$ 是球面的曲率中心，不是后面定义的光心。',
    en: 'Lenses are commonly made of glass.\nThe line $O_1O_2$ through the centers of curvature of the two spherical surfaces is the **principal axis**, as in Figure 164.\nHere $O_1$ and $O_2$ are centers of curvature, not the optical center defined below.',
  },
  {
    ref: 'p0197#13', requirements: ['N75-R05'],
    zh: '对于本节讨论的玻璃透镜在空气中的情况，中央比边缘厚的透镜是**会聚透镜**，如图 165 所示。\n图 166 用玻璃棱镜的组合来解释它的作用；这是一种概念模型，并不是说透镜真的由分离的棱镜拼成。\n玻璃棱镜在空气中使光线向底边偏折，这种模型说明近轴光线通过会聚透镜后趋向主光轴。\n相反，中央比边缘薄的玻璃透镜是**发散透镜**，如图 167 所示。\n在空气中，它使近轴光线向远离主光轴的方向偏折，光束因而发散。\n这种按形状判断作用的说法依赖透镜与外界媒质的折射率关系，不能不加条件地套用到所有媒质组合。',
    en: 'For the glass lenses in air considered here, a lens thicker at the center than at the edge is a **converging lens**, as in Figure 165.\nFigure 166 explains its action using a combination of glass prisms; this is a conceptual model, not a claim that the lens is assembled from separate prisms.\nA glass prism in air bends light toward its base, explaining why paraxial rays through a converging lens tend toward the principal axis.\nConversely, a glass lens thinner at the center than at the edge is a **diverging lens**, as in Figure 167.\nIn air it bends paraxial rays away from the principal axis, making the beam diverge.\nThis shape-based description depends on the refractive-index relation between the lens and its surroundings and cannot be applied without qualification to every combination of media.',
  },
  {
    ref: 'p0198#3', requirements: ['N75-R06'],
    zh: '**薄透镜**是本节采用的简化模型。\n图 164 中的厚度 $l=|AB|$，与两个球面的曲率半径 $R_1$、$R_2$ 以及物体到透镜的距离相比，小到可以忽略时，透镜就称为**薄透镜**。\n可以忽略是近似条件，不是说真实透镜没有厚度。\n以下所说的透镜都采用这一薄透镜模型。',
    en: 'A **thin lens** is the simplified model used in this section.\nA lens is called a **thin lens** when its thickness $l=|AB|$ in Figure 164 is negligible compared with the radii of curvature $R_1$, $R_2$ and the object-to-lens distance.\nNegligible thickness is an approximation, not a claim that a real lens has no thickness.\nAll lenses discussed below use this thin-lens model.',
  },
  {
    ref: 'p0198#6', requirements: ['N75-R07'],
    zh: '在薄透镜近似中，两个球面的顶点 $A$ 和 $B$ 足够接近，可以把它们当作同一个点。\n这个近似重合的点叫做**透镜的光心**，用 $O$ 表示。',
    en: 'In the thin-lens approximation, the two surface vertices $A$ and $B$ are sufficiently close to be treated as a single point.\nThis approximately coincident point is the **optical center**, denoted by $O$.',
  },
  {
    ref: 'p0198#7', requirements: ['N75-R08'],
    zh: '薄透镜的主光轴通过光心。\n通过光心的其他任何一条直线叫做**副光轴**。',
    en: 'The principal axis of a thin lens passes through its optical center.\nAny other line through that center is a **secondary optical axis**.',
  },
  {
    ref: 'p0198#8', requirements: ['N75-R09'],
    zh: '**透镜成像**可以与平面镜和球面镜成像作比较。\n在薄透镜、近轴光线的近似下，*物体*或光源的同一点发出的光线，穿过透镜的不同部分后，对应同一个像点①。\n如果折射后的光线实际相交，就形成实像。\n如果折射光线发散，而它们向后的延长线相交，就形成虚像。\n虚像可以用眼睛或光学仪器观察，但不能把延长线的交点误认为光线实际到达的位置。',
    en: '**Image formation by lenses** can be compared with image formation by plane and spherical mirrors.\nIn the thin-lens, paraxial approximation, rays from the same point of an *object* or light source correspond to one image point even when they pass through different parts of the lens①.\nIf the refracted rays actually intersect, they form a real image.\nIf they diverge but their backward extensions intersect, they form a virtual image.\nA virtual image can be observed by an eye or an optical instrument, but the intersection of extensions is not a point actually reached by those rays.',
  },
  {
    ref: 'p0198#10', requirements: ['N75-R09'],
    zh: '① 上述同一点成像的说法采用近轴条件：光线与主光轴之间的夹角很小。\n在这一近似下，光线或它们的延长线可视为相交于同一点，不能把它理解成任意角度、任意孔径下都精确成立。',
    en: '① The point-to-point imaging statement uses the paraxial condition: ray angles to the principal axis are small.\nWithin this approximation, rays or their extensions can be treated as meeting at one point; this is not exact for arbitrary ray angles or apertures.',
  },
  {
    ref: 'p0198#9', requirements: ['N75-R10', 'N75-R11'],
    zh: '**会聚透镜**的作用可以用原教材的圆盘实验观察。\n先把透镜水平地放在圆盘中心，再让光线沿主光轴竖直入射；观察到光线通过透镜而不偏折，如图 168 所示。\n然后让光线沿副光轴入射，观察到折射光线只发生很小的平移，如图 169 所示。\n第二次观察并不表示真实透镜中的平移严格为零。',
    en: 'The action of a **converging lens** can be observed in the original textbook experiment using a disk.\nFirst place the lens horizontally at the center of the disk and send a vertical ray along the principal axis; the ray passes through without bending, as in Figure 168.\nThen send a ray along a secondary optical axis and observe a small translation of the refracted ray, as in Figure 169.\nThe second observation does not imply that translation inside a real lens is exactly zero.',
  },
  {
    ref: 'p0199#8', requirements: ['N75-R12'],
    zh: '接着，让发光器发出的三条平行光线竖直射到透镜上。\n折射后，它们在透镜后相交于一点，如图 170 所示。\n这里的三条光线是这一步实验所用的光线数，前述薄透镜和近轴条件仍然适用。',
    en: 'Next send three parallel rays from the emitter vertically onto the lens.\nAfter refraction, they meet at one point behind the lens, as in Figure 170.\nThree is the number of rays used in this experimental step; the thin-lens and paraxial conditions still apply.',
  },
  {
    ref: 'p0199#9', requirements: ['N75-R13'],
    zh: '**平行于主光轴的光线经会聚透镜折射后，在近轴模型中相交于一点，这个点叫做主焦点**。\n主焦点用 $F$ 表示，见图 171a。',
    en: '**In the paraxial model, rays parallel to the principal axis meet at one point after refraction by a converging lens; that point is a principal focus**.\nThe focus is denoted by $F$, as in Figure 171a.',
  },
  {
    ref: 'p0199#13', requirements: ['N75-R14', 'N75-R15'],
    zh: '让平行于主光轴的光线从相反方向入射，它们经透镜后在另一侧会聚，这个交点是另一主焦点，见图 171b。\n与这里讨论的球面镜不同，透镜有两个主焦点。\n当透镜两侧是同一种媒质时，两个主焦点到薄透镜的**距离相等**。\n主焦点到透镜的距离叫做**焦距**。\n原教材用 $F$ 同时表示焦点和焦距：前者是一个点，后者是一个长度，必须结合语境区分。',
    en: 'Send rays parallel to the principal axis from the opposite direction; after passing through the lens, they converge on the other side at the other principal focus, as in Figure 171b.\nUnlike the spherical mirrors considered here, a lens has two principal foci.\nWhen the medium is the same on both sides, their **distances from the thin lens are equal**.\nThe distance from a principal focus to the lens is the **focal length**.\nThe original textbook uses $F$ for both a focus and a focal length: one is a point and the other is a length, so the context must distinguish them.',
  },
  {
    ref: 'p0199#14', requirements: ['N75-R16', 'N75-R17', 'N75-R18', 'N75-R19', 'N75-R20'],
    zh: '让发光器的三条平行光线倾斜于主光轴入射，它们折射后的交点不在主焦点，而在另一个点，见图 172a。\n在薄透镜、近轴模型中，不同倾斜方向的平行光束各自会聚在一个平面上；这个平面垂直于主光轴并通过主焦点，叫做**焦平面**，见图 172b。\n把发光点放在主焦点上，折射后的光束平行于主光轴。\n把发光点放在焦平面的其他点上，出射光束内部的光线仍相互平行，但不一定平行于主光轴，见图 173。\n对会聚透镜，把光源放在焦点以外，折射光线会聚形成实像，见图 174a。\n把光源放在焦点以内，折射光线发散，它们向后的延长线相交，得到虚像，见图 174b。',
    en: 'Send three parallel rays from the emitter at an angle to the principal axis; their refracted rays meet at a point other than the principal focus, as in Figure 172a.\nIn the thin-lens, paraxial model, parallel beams with different small tilts each converge in a plane perpendicular to the principal axis and passing through the principal focus; this is the **focal plane**, as in Figure 172b.\nA luminous point at the principal focus produces an outgoing beam parallel to the principal axis.\nA point elsewhere in the focal plane also produces rays parallel to one another, but the beam need not be parallel to the principal axis, as in Figure 173.\nFor a converging lens, a light source beyond the focus gives refracted rays that converge to form a real image, as in Figure 174a.\nA source closer than the focus gives diverging refracted rays whose backward extensions meet to form a virtual image, as in Figure 174b.',
  },
  {
    ref: 'p0201#2', requirements: ['N75-R21'],
    zh: '**发散透镜**也可以用类似的实验研究。\n先把它固定在圆盘中心，再让平行于主光轴的光线射向透镜；折射后的光线发散，见图 175。\n把这些光线向后延长，延长线交于发散透镜的主焦点。\n这是虚主焦点，也就是轴上远处光源在这一模型中的虚像位置，不是实际折射光线的交点，见图 176a。\n它到透镜的距离仍用 $F$ 表示。\n当透镜两侧媒质相同时，另一虚主焦点位于另一侧，到透镜的距离相等，见图 176b。',
    en: 'A **diverging lens** can be studied with a similar experiment.\nFirst fix it at the center of the disk, then send rays parallel to the principal axis toward it; the refracted rays diverge, as in Figure 175.\nTheir backward extensions meet at a principal focus of the diverging lens.\nThis is a virtual principal focus, the virtual image position of a distant axial source in this model, not an intersection of the actual refracted rays, as in Figure 176a.\nIts distance from the lens is still denoted by $F$.\nWhen the medium is the same on both sides, the other virtual principal focus lies on the opposite side at the same distance, as in Figure 176b.',
  },
  {
    ref: 'p0201#7', requirements: ['N75-R22'],
    zh: '**透镜的光焦度**描述透镜会聚或发散光线的作用。\n**光焦度是焦距的倒数**，用 $D$ 表示：\n$D=\\frac{1}{F}$。\n这里的 $F$ 是长度，不是焦点这个点。\n作为现代符号约定，在这条公式中给焦距带上符号：会聚透镜采用正焦距，发散透镜采用负焦距，相应的光焦度也分别为正、负。\n前面两个焦点到透镜的距离则是这一长度的大小；这个说明不改变原教材保留的公式。',
    en: '**Optical power** describes the converging or diverging action of a lens.\n**Optical power is the reciprocal of focal length**, denoted by $D$:\n$D=\\frac{1}{F}$.\nHere $F$ is a length, not the focus point.\nAs a modern sign convention, focal length in this formula is signed: it is positive for a converging lens and negative for a diverging lens, so their powers are positive and negative respectively.\nThe distances from the lens to its two foci discussed above are magnitudes of that length; this clarification leaves the original formula unchanged.',
  },
  {
    ref: 'p0201#8', requirements: ['N75-R23'],
    zh: '焦点到透镜的距离越小，透镜会聚或发散光线的作用越强，光焦度的绝对值也越大。\n比较发散透镜的作用强弱时，不能把负光焦度的数值大小直接当作作用强弱。',
    en: 'The closer the foci are to the lens, the stronger its converging or diverging action and the larger the absolute value of its optical power.\nFor diverging lenses, the numerical ordering of negative powers must not be confused with the ordering of their strengths.',
  },
  {
    ref: 'p0201#9', requirements: ['N75-R24'],
    zh: '光焦度 $D$ 的单位是屈光度。\n用 $D=\\frac{1}{F}$ 计算时，焦距必须以米为单位。\n焦距大小为 1 米的透镜，光焦度大小为 1 屈光度；正负号由会聚或发散的约定决定。',
    en: 'Optical power $D$ is measured in dioptres.\nWhen using $D=\\frac{1}{F}$, express focal length in metres.\nA lens with a focal-length magnitude of 1 metre has a power magnitude of 1 dioptre; the converging or diverging convention determines its sign.',
  },
];
const inputs = [await bind(`${prepared}/manifest.json`)];
for (const row of [manifest.sourceLesson, manifest.sourceExercises]) {
  await verify(row.path, row.sha256);
  inputs.push(row);
  await immutableWrite(`${folder}/source/${path.basename(row.path)}`, await bytes(row.path));
}
const templates = {};
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  const file = `${manifest.templateDirectory}/${name}`;
  inputs.push(await bind(file));
  templates[name] = await read(file);
  await immutableWrite(`${folder}/source/first-templates/${name}`, await bytes(file));
}
const source = await read(manifest.sourceLesson.path);
assert.equal(source.prose.filter(row => row.kind === 'p').length, entries.length);
const mappings = entries.map(entry => {
  const index = source.prose.findIndex(row => row.kind === 'p' && row.source_refs.includes(entry.ref));
  assert.ok(index >= 0, entry.ref);
  assert.deepEqual(entry.zh.match(/\$[^$]*\$/g) ?? [], entry.en.match(/\$[^$]*\$/g) ?? [], entry.ref);
  return { ...entry, index, source_refs: source.prose[index].source_refs, source_text: source.prose[index].text };
});
assert.equal(new Set(mappings.map(row => row.index)).size, entries.length);
await immutableWrite(`${folder}/source-sentence-mapping.json`, serialize({
  schema: 'STEMROBIN-181/n75-first-bilingual-source-coverage@1',
  mappings, heading: { source_ref: 'p0197#3', zh: '透镜', en: 'Lenses', requirement: 'N75-R01' },
  figures: 'Original objects, refs and order retained; exact visual semantics require separate image authors.',
  fullSourceCoverageNotIndependentSCI: true,
}));
const candidates = [];
const flows = [];
for (const locale of ['zh', 'en']) {
  const directory = `${folder}/candidate/${locale}`;
  const lesson = structuredClone(templates['lesson.template.json']);
  lesson.title = locale === 'zh' ? '透镜' : 'Lenses';
  lesson.printed_title = locale === 'zh' ? '75. 透镜' : '75. Lenses';
  for (const row of mappings) {
    const block = lesson.prose[row.index];
    assert.deepEqual(block.source_refs, row.source_refs);
    assert.equal(block.source_text, row.source_text);
    block.text = row[locale];
    block.changes = ['language', 'layout', 'clarification'];
    block.numeric_changes = [];
  }
  for (const block of lesson.prose.filter(row => row.kind === 'cap')) {
    const number = block.label.match(/\d+/)[0];
    block.text = locale === 'zh' ? `图 ${number}` : `Figure ${number}`;
    block.changes = locale === 'zh' ? [] : ['language'];
  }
  const figures = structuredClone(templates['figures.template.json']);
  for (const figure of figures.figures) {
    figure.changes = ['planned'];
    figure.brief_status = 'planned-text-only-not-pixel-inventory';
    figure.brief_limits = 'Read the original independently before FigureSpec authoring; current text is authoritative. Preserve all source subfigures and distinguish modern clarifications. No guessed fine detail, paid image output or visual PASS.';
  }
  for (const [name, value] of [
    ['lesson.template.json', lesson],
    ['exercises.template.json', templates['exercises.template.json']],
    ['figures.template.json', figures],
  ]) {
    const file = `${directory}/${name}`;
    await immutableWrite(file, serialize(value));
    candidates.push(await bind(file));
  }
  const command = ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
    `${directory}/lesson.template.json`];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 60000,
  });
  await immutableWrite(`${folder}/proseflow-${locale}.receipt.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, result.stderr);
  flows.push({ locale, receipt: await bind(`${folder}/proseflow-${locale}.receipt.json`) });
}
for (const row of inputs) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'd566-n75-first-bilingual-text-author', card,
  status: 'FIRST-BILINGUAL-AUTHOR-READY-INDEPENDENT-SCI-ZHEN-PENDING',
  inputs, candidates, sourceMapping: await bind(`${folder}/source-sentence-mapping.json`),
  sourceProseObjects: source.prose.length, authoredParagraphObjects: entries.length,
  sourceQuestions: 0, figures: manifest.figures, flows,
  nativeFinalizeRenderInvocations: 0, imageOpens: 0, parentImageCount: 24, oldBudgetReset: false,
  SCI: 'pending-first-independent', ZHEN: 'pending-first-independent',
  FIG: 'pending-first-image-authors', DISPLAY: 'pending',
  completeCard: false, historicalFAILHOLDPreserved: true, canonicalEdits: false,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/author-freeze.json`, serialize({
  ticket: 'STEMROBIN-181', schema: 'STEMROBIN-181/n75-first-author-freeze@1',
  status: 'FROZEN-FIRST-AUTHOR-NOT-INDEPENDENT-PASS', files,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({
  report: await bind(`${folder}/report.json`),
  freeze: await bind(`${folder}/author-freeze.json`),
}));
