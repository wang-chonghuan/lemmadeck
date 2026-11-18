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
const folder = `${base}/d605-n77-first-bilingual-text-author`;
const prepared = `${base}/d602-n77-first-source-preparation`;
const manifest = await read(`${prepared}/manifest.json`);
const card = 'phy10-c2-s2-n77';
assert.equal(manifest.card, card);
assert.equal(manifest.sourceQuestions, 8);
assert.equal(await exists(folder), false);
const requirements = [
  [`${base}/d591-n77-preauthor-source204-requirements/source-requirements.json`, 'edbd1f60df673daccfdb9374f985bd9e0dbdd15907b07bd2c2e35a9e03282dbc'],
  [`${base}/d595-n77-source205-requirement-extension/report.json`, '5dc29a8a77859dea607b44fb772a54901b3ddd29122958b6b9d99636d06ea011'],
  [`${base}/d600-n77-source206-requirement-extension/report.json`, 'bd87ef8152bf54f4298a6d05109cf074848d0718ed5dc3058fcd426b0c269e59'],
];
const inputs = [await bind(`${prepared}/manifest.json`)];
for (const [file, sha256] of requirements) {
  await verify(file, sha256);
  inputs.push(await bind(file));
}
const entries = [
  {
    ref: 'p0204#2', requirements: ['N77-R02'],
    zh: '以下在薄透镜、近轴近似中讨论透镜两侧为同一种均匀介质的情况。\n公式联系三个量：物体到透镜的距离 $d$、像到透镜的距离 $f$ 和焦距 $F$。\n小写字母表示像距，大写字母表示焦距；这些距离的正负将在后文约定。',
    en: 'We work in the thin-lens, paraxial approximation, with the same homogeneous medium on both sides of the lens.\nThe formula relates three quantities: the object-to-lens distance $d$, the image-to-lens distance $f$, and the focal length $F$.\nThe lowercase letter denotes image distance and the uppercase letter denotes focal length; their sign convention is stated below.',
  },
  {
    ref: 'p0204#3', requirements: ['N77-R03', 'N77-R04', 'N77-R05', 'N77-R06'],
    zh: '先利用图 179 中会聚透镜形成实像的作图推导公式，物体位于物方焦点之外。\n两侧焦点在图中都用同一个字母标记，以下各三角形使用所在一侧的焦点；这幅作图不是所有带符号成像情况的代表。\n由于 $\\triangle ABF$ 和 $\\triangle DOF$ 相似，得到：\n$\\frac{\\lvert OD\\rvert}{\\lvert AB\\rvert}=\\frac{\\lvert OF\\rvert}{\\lvert BF\\rvert}$\n又因为 $\\lvert OD\\rvert=\\lvert A_1B_1\\rvert$，所以：\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert AB\\rvert}=\\frac{\\lvert OF\\rvert}{\\lvert BF\\rvert}=\\frac{F}{d-F}$ （6.15）\n此外，$\\triangle COF$ 和 $\\triangle A_1B_1F$ 相似，给出：\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert OC\\rvert}=\\frac{\\lvert B_1F\\rvert}{\\lvert OF\\rvert}$\n考虑到 $\\lvert OC\\rvert=\\lvert AB\\rvert$，得到：\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert AB\\rvert}=\\frac{f-F}{F}$ （6.16）\n令（6.15）与（6.16）的右端相等：\n$\\frac{F}{d-F}=\\frac{f-F}{F}$\n于是：\n$F^2=fd-fF-Fd+F^2$\n即 $fF+Fd=fd$。\n本作图中的分母与距离乘积均不为零，用 $Ffd$ 除各项，得到：\n$\\frac{1}{d}+\\frac{1}{f}=\\frac{1}{F}$ （6.17）\n也可以用透镜的光焦度表示为：\n$\\frac{1}{d}+\\frac{1}{f}=D$ （6.18）',
    en: 'We first derive the formula from the converging-lens construction of a real image in Figure 179, with the object beyond the object-side focus.\nBoth foci have the same letter in the figure; each triangle below uses the focus on its own side. This construction does not represent every signed imaging case.\nThe triangles $\\triangle ABF$ and $\\triangle DOF$ are similar, so:\n$\\frac{\\lvert OD\\rvert}{\\lvert AB\\rvert}=\\frac{\\lvert OF\\rvert}{\\lvert BF\\rvert}$\nSince $\\lvert OD\\rvert=\\lvert A_1B_1\\rvert$, we obtain:\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert AB\\rvert}=\\frac{\\lvert OF\\rvert}{\\lvert BF\\rvert}=\\frac{F}{d-F}$ (6.15)\nLikewise, $\\triangle COF$ and $\\triangle A_1B_1F$ are similar, giving:\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert OC\\rvert}=\\frac{\\lvert B_1F\\rvert}{\\lvert OF\\rvert}$\nUsing $\\lvert OC\\rvert=\\lvert AB\\rvert$, we get:\n$\\frac{\\lvert A_1B_1\\rvert}{\\lvert AB\\rvert}=\\frac{f-F}{F}$ (6.16)\nEquating the right-hand sides of (6.15) and (6.16):\n$\\frac{F}{d-F}=\\frac{f-F}{F}$\nHence:\n$F^2=fd-fF-Fd+F^2$\nOr $fF+Fd=fd$.\nThe denominators and distance product are nonzero in this construction. Dividing each term by $Ffd$ gives:\n$\\frac{1}{d}+\\frac{1}{f}=\\frac{1}{F}$ (6.17)\nIn terms of the optical power of the lens, this is:\n$\\frac{1}{d}+\\frac{1}{f}=D$ (6.18)',
  },
  {
    ref: 'p0205#1', requirements: ['N77-R07'],
    zh: '关系式（6.17）或（6.18）称为**薄透镜公式**，其中 $d$、$f$ 和 $F$ 都是带符号的量。\n采用实物、实像和实焦距为正的约定，公式也可用于虚物、虚像和发散透镜；这里给出约定而不另行证明。\n会聚透镜有实焦点，$\\frac{1}{|F|}$ 项前取正号。\n发散透镜满足 $F<0$，公式右端为 $-\\frac{1}{|F|}$。\n实像的 $\\frac{1}{|f|}$ 项前取正号，虚像取负号。\n实发光点的 $\\frac{1}{|d|}$ 项前取正号，虚物点取负号。\n虚物点是入射会聚光束若未被透镜改变，沿原入射方向继续延伸会到达的点；它不是在那个位置实际发光的光源。',
    en: 'Relations (6.17) and (6.18) are called the **thin-lens formula**; $d$, $f$, and $F$ are signed quantities.\nWe use the convention that real objects, real images, and real focal lengths are positive. The formula also applies to virtual objects, virtual images, and diverging lenses; the sign convention is stated here without a further proof.\nA converging lens has a real focus, so the $\\frac{1}{|F|}$ term has a positive sign.\nFor a diverging lens, $F<0$, and the right-hand side is $-\\frac{1}{|F|}$.\nThe $\\frac{1}{|f|}$ term is positive for a real image and negative for a virtual image.\nThe $\\frac{1}{|d|}$ term is positive for a real luminous object and negative for a virtual object.\nA virtual object is the point that incoming converging rays would reach if continued in their incident directions without being changed by the lens. It is not an actual light source at that position.',
  },
  {
    ref: 'p0205#2', requirements: ['N77-R08'],
    zh: '当 $F$、$f$ 或 $d$ 未知时，把对应的带符号未知量写在 $\\frac{1}{F}$、$\\frac{1}{f}$ 或 $\\frac{1}{d}$ 中，项前保留正号。\n这个写法不预先规定未知量为正，也不应再按猜测给它添加一次符号。\n若求得的焦距、像距或物距为负，则按上述约定，它分别对应虚焦点、虚像或虚物点。',
    en: 'When $F$, $f$, or $d$ is unknown, retain the signed unknown in $\\frac{1}{F}$, $\\frac{1}{f}$, or $\\frac{1}{d}$, with a positive coefficient in front of the term.\nThis notation does not assume that the unknown value is positive, and a guessed sign must not be applied a second time.\nA negative result for the focal length, image distance, or object distance indicates a virtual focus, virtual image, or virtual object, respectively, in this convention.',
  },
  {
    ref: 'p0205#3', requirements: ['N77-R09'],
    zh: '**透镜的放大率**\n透镜形成的像通常与物体大小不同，放大率用来描述这种大小关系。',
    en: '**Lens Magnification**\nThe image formed by a lens generally differs in size from the object. Magnification describes this size relationship.',
  },
  {
    ref: 'p0205#4', requirements: ['N77-R09'],
    zh: '**像的线性尺寸与物体对应线性尺寸之比，叫做线放大率。**\n这里比较的是尺寸的大小，不用尺寸的正负表示正立或倒立。',
    en: '**Linear magnification is the ratio of an image linear size to the corresponding object linear size.**\nThese are size magnitudes; their signs are not used to describe upright or inverted orientation.',
  },
  {
    ref: 'p0205#5', requirements: ['N77-R09'],
    zh: '再看图 179，物体 $AB$ 的高度为 $h$，像 $A_1B_1$ 的高度为 $H$。\n线放大率为：\n$\\Gamma=\\frac{H}{h}$\n两种高度都按非负的尺寸大小取值，物体高度不为零。',
    en: 'Returning to Figure 179, let the height of the object $AB$ be $h$ and the height of the image $A_1B_1$ be $H$.\nThe linear magnification is:\n$\\Gamma=\\frac{H}{h}$\nBoth heights are nonnegative size magnitudes, and the object height is nonzero.',
  },
  {
    ref: 'p0205#6', requirements: ['N77-R10', 'N77-R11'],
    zh: '由于 $\\triangle OAB$ 与 $\\triangle OA_1B_1$ 相似，对应边的长度比给出：\n$\\frac{H}{h}=\\frac{|f|}{|d|}$\n像距和物距取绝对值，是因为这里求的是尺寸之比。',
    en: 'The triangles $\\triangle OAB$ and $\\triangle OA_1B_1$ are similar, so the ratio of corresponding lengths gives:\n$\\frac{H}{h}=\\frac{|f|}{|d|}$\nAbsolute values are used for image and object distances because this is a ratio of sizes.',
  },
  {
    ref: 'p0206#2', requirements: ['N77-R11'],
    zh: '因此，透镜的线放大率为：\n$\\Gamma=\\frac{|f|}{|d|}$ （6.19）\n这个非负的大小比值不表示像的方向；像的正立或倒立应另外由成像作图判断。',
    en: 'Thus, the linear magnification of the lens is:\n$\\Gamma=\\frac{|f|}{|d|}$ (6.19)\nThis nonnegative size ratio does not encode image orientation; upright or inverted orientation must be determined separately from the image construction.',
  },
];
for (const binding of [manifest.sourceLesson, manifest.sourceExercises]) {
  await verify(binding.path, binding.sha256);
  inputs.push(binding);
  await immutableWrite(`${folder}/source/${path.basename(binding.path)}`, await bytes(binding.path));
}
const templates = {};
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  const file = `${manifest.templateDirectory}/${name}`;
  templates[name] = await read(file);
  inputs.push(await bind(file));
  await immutableWrite(`${folder}/source/first-templates/${name}`, await bytes(file));
}
const source = await read(manifest.sourceLesson.path);
const math = text => text.match(/\$[^$]*\$/g) ?? [];
assert.equal(source.prose.length, entries.length);
const mappings = entries.map(entry => {
  const index = source.prose.findIndex(row => row.source_refs.includes(entry.ref));
  assert.ok(index >= 0, entry.ref);
  assert.equal(source.prose[index].kind, 'p');
  for (const locale of ['zh', 'en']) {
    assert.deepEqual(math(entry[locale]), math(source.prose[index].text), `${entry.ref}/${locale}: original math order`);
  }
  return { ...entry, index, source_refs: source.prose[index].source_refs, source_text: source.prose[index].text };
});
assert.equal(new Set(mappings.map(row => row.index)).size, entries.length);
await immutableWrite(`${folder}/source-sentence-mapping.json`, serialize({
  schema: 'STEMROBIN-181/n77-first-bilingual-source-coverage@1', mappings,
  heading: { source_ref: 'p0204#1', requirement: 'N77-R01', zh: '薄透镜公式与线放大率', en: 'Thin-Lens Formula and Linear Magnification' },
  questions: { requirement: 'N77-R12', count: 8, unchangedInTextAuthor: true, newChoicesOrAnswers: false },
  rightBoundary: { requirement: 'N77-R13', after: 'p0206#11', before: 'p0206#12', n78Excluded: true },
  mathematicalTokensAndOrderUnchanged: true,
  shared179: { pointer: '/prose/1/figures', displayedOnce: true, firstIndependentFigureReviewPending: true },
}));
const figures = structuredClone(templates['figures.template.json']);
const shared = {
  id: 'fig-179', label: '图 179', spec: 'figures/fig-179.spec.json',
  changes: ['planned'],
  source: {
    png: { path: 'figures/fig-179.png', sha256: '9de42cf841797ee8e23044b3338067f10ecaaf15183b1fa9388c7140cd95d115' },
    svg: { path: 'figures/fig-179.svg', sha256: '84b1de657c5ed07a796bdc91cc4cb6501dfaf7ac8da40a88a0af02ef103d1735' },
  },
  brief_status: 'planned-shared-n76-first-figure-review-pending',
  brief_limits: 'Reuse actual approved n76 fig179 only after its first independent approval. No duplicated image review, pixel observation or invented source facts by this text author.',
};
for (const binding of Object.values(shared.source)) {
  const file = `${manifest.rawRoot}/10p/${binding.path}`;
  await verify(file, binding.sha256);
  inputs.push(await bind(file));
}
figures.figures = [shared];
const candidates = [], flows = [];
for (const locale of ['zh', 'en']) {
  const directory = `${folder}/candidate/${locale}`;
  const lesson = structuredClone(templates['lesson.template.json']);
  lesson.title = locale === 'zh' ? '薄透镜公式与线放大率' : 'Thin-Lens Formula and Linear Magnification';
  lesson.printed_title = `77. ${lesson.title}`;
  for (const row of mappings) {
    const block = lesson.prose[row.index];
    assert.deepEqual(block.source_refs, row.source_refs);
    assert.equal(block.source_text, row.source_text);
    block.text = row[locale];
    block.changes = ['language', 'layout', 'clarification'];
    block.numeric_changes = [];
  }
  lesson.prose[1].figures = [{ id: 'fig-179' }];
  const command = ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, input: serialize(lesson), encoding: 'utf8', timeout: 60000,
  });
  await immutableWrite(`${folder}/proseflow-${locale}.receipt.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, result.stderr);
  const outline = JSON.parse(result.stdout).paragraphs;
  const start = locale === 'zh' ? '**透镜的放大率**' : '**Lens Magnification**';
  const paragraph = outline.find(row => row.text.startsWith(start));
  assert.ok(paragraph, `Missing actual ${locale} magnification boundary`);
  const previous = outline.find(row => row.index === paragraph.index - 1);
  assert.ok(previous);
  lesson.section_breaks = [{ before: previous.text, after: paragraph.text }];
  flows.push({ locale, receipt: await bind(`${folder}/proseflow-${locale}.receipt.json`), copiedBoundary: lesson.section_breaks[0] });
  for (const [name, value] of [
    ['lesson.template.json', lesson],
    ['exercises.template.json', templates['exercises.template.json']],
    ['figures.template.json', figures],
  ]) {
    const file = `${directory}/${name}`;
    await immutableWrite(file, serialize(value));
    candidates.push(await bind(file));
  }
}
for (const row of inputs) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'd605-n77-first-bilingual-text-author', card,
  status: 'FIRST-BILINGUAL-AUTHOR-READY-INDEPENDENT-SCI-ZHEN-PENDING',
  inputs, candidates, sourceMapping: await bind(`${folder}/source-sentence-mapping.json`),
  sourceProseObjects: source.prose.length, authoredParagraphObjects: entries.length,
  sourceQuestions: 8, exercisesUnchanged: true, independentRAWNotReadForTextAuthor: true,
  sharedFigures: ['fig-179'], sharedFigureDisplayedOnce: true, flows,
  nativeFinalizeRenderInvocations: 0, imageOpens: 0, parentImageCount: 24, oldBudgetReset: false,
  SCI: 'pending-first-independent', ZHEN: 'pending-first-independent',
  FIG: 'pending-n76-shared-first-image-review', DISPLAY: 'pending',
  completeCard: false, historicalFAILHOLDPreserved: true, canonicalEdits: false,
  newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/author-freeze.json`, serialize({
  ticket: 'STEMROBIN-181', schema: 'STEMROBIN-181/n77-first-author-freeze@1',
  status: 'FROZEN-FIRST-AUTHOR-NOT-INDEPENDENT-PASS', files,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({ report: await bind(`${folder}/report.json`), freeze: await bind(`${folder}/author-freeze.json`) }));
