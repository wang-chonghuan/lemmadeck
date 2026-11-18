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
const folder = `${base}/d582-n76-first-bilingual-text-author`;
const prepared = `${base}/d581-n76-first-source-preparation`;
const manifest = await read(`${prepared}/manifest.json`);
const card = 'phy10-c2-s2-n76';
assert.equal(manifest.card, card);
assert.equal(manifest.sourceQuestions, 0);
assert.equal(await exists(folder), false);
const entries = [
  {
    ref: 'p0202#2', requirements: ['N76-R02'],
    zh: '在本节的薄透镜、近轴模型中，透镜的各焦点位置确定了它的成像特性。\n已知光源到透镜的距离和焦距，就可以确定像的位置，不必逐段研究透镜内部的光路，也不必精确画出两个球面的形状。\n因此，作图时可以用图 177 的符号表示会聚透镜，用图 178 的符号表示发散透镜。',
    en: 'In the thin-lens, paraxial model used here, the focal positions determine the imaging properties of a lens.\nKnowing the source-to-lens distance and focal length lets us locate the image without tracing the path inside the lens or drawing the exact shapes of its two spherical surfaces.\nWe can therefore represent a converging lens by the symbol in Figure 177 and a diverging lens by the symbol in Figure 178.',
  },
  {
    ref: 'p0202#7', requirements: ['N76-R03'],
    zh: '在上述近似中，**同一物点发出的光线经透镜后，对应同一个像点**。\n实像点是实际折射光线的交点，虚像点是发散光线向后延长线的交点。\n透镜能使物体的每一点对应一个像点，也就能形成整个物体的像；这一说法不表示任意角度、任意孔径的光线都精确交于一点。',
    en: 'Within this approximation, **rays from the same object point correspond to the same image point after passing through the lens**.\nA real image point is an intersection of actual refracted rays; a virtual image point is an intersection of backward extensions of diverging rays.\nImaging each object point produces an image of the whole object; this does not assert exact concurrence for arbitrary ray angles or apertures.',
  },
  {
    ref: 'p0202#8', requirements: ['N76-R04'],
    zh: '已知会聚透镜的焦点和光心时，可以优先利用三条特殊光线作图。\n1) 平行于主光轴入射的光线，折射后通过透镜另一侧的焦点。\n2) 入射前通过物方焦点的光线，折射后平行于主光轴，这是光路可逆性的结果。\n3) 通过光心的光线方向不变；真实光路中的小平移在薄透镜近似中可以忽略。\n最后一条规则不是说真实透镜内的平移严格为零。',
    en: 'When the foci and optical center of a converging lens are known, three special rays are convenient for constructing an image.\n1) A ray incident parallel to the principal axis refracts through the focus on the other side of the lens.\n2) A ray passing through the object-side focus before reaching the lens emerges parallel to the principal axis, by reversibility of the light path.\n3) A ray through the optical center keeps its direction; its small translation in a real lens is neglected in the thin-lens approximation.\nThe last rule does not claim that translation inside a real lens is exactly zero.',
  },
  {
    ref: 'p0202#9', requirements: ['N76-R05', 'N76-R06', 'N76-R07'],
    zh: '图 179 展示物体 $AB$ 的像的作法。\n先求点 $A$ 的像：让光线 $AC$ 平行于主光轴，折射后通过远方焦点；再让光线 $AD$ 通过物方焦点，折射后平行于主光轴。\n两条折射光线的交点就是 $A$ 的像点 $A_1$，其他物点的像也可以类似地作出。\n不能认为像只是由两条或三条光线形成的；在这一近似中，从 $A$ 发出、经透镜后会聚到 $A_1$ 的许多光线共同形成这个像点。\n通过光心 $O$ 的光线 $AOA_1$ 也到达 $A_1$。\n所以，求像点时可以选用三条特殊光线中的任意两条独立光线：\n1) 通过光心的光线。\n2) 平行于主光轴入射的光线。\n3) 入射前通过焦点的光线。',
    en: 'Figure 179 shows how to construct the image of the object $AB$.\nFirst locate the image of $A$: send $AC$ parallel to the principal axis so that it refracts through the far focus, and send $AD$ through the object-side focus so that it emerges parallel to the principal axis.\nThe two refracted rays intersect at the image of $A$, denoted by $A_1$; other object points can be imaged in the same way.\nThe image is not formed by only two or three rays: in this approximation, many rays from $A$ converge at $A_1$ after passing through the lens and together form that image point.\nThe ray $AOA_1$ through the optical center $O$ also reaches $A_1$.\nTo locate an image point, we may therefore choose any two independent rays from the three special kinds:\n1) A ray through the optical center.\n2) A ray incident parallel to the principal axis.\n3) A ray passing through the focus before reaching the lens.',
  },
  {
    ref: 'p0203#5', requirements: ['N76-R08'],
    zh: '再考虑物点位于主光轴上的情况。\n这时，三条方便的特殊光线合并为主光轴上的同一条光线，不能据此确定一个交点。\n图 180 因而另外选择光线 $SB$，其中 $B$ 是光线到达透镜的位置。\n先过光心作平行于 $SB$ 的副光轴 $PQ$，再作通过焦点 $F$、垂直于主光轴的焦平面，求出它与副光轴的交点 $C$。\n在近轴模型中，折射光线 $BC$ 通过 $C$；把它与沿主光轴的光线一起使用，就得到了两条光路。\n图中光源 $S$ 位于焦点和会聚透镜之间，折射光线发散，向后的延长线确定虚像点 $S_1$。\n向后的延长线是作图线，不代表光沿该方向实际传播。',
    en: 'Now consider an object point on the principal axis.\nThe three convenient special rays then coincide with the principal axis and do not by themselves determine an intersection point.\nFigure 180 therefore selects another ray $SB$, where $B$ is its point of arrival at the lens.\nDraw the secondary optical axis $PQ$ through the optical center, parallel to $SB$, and draw the focal plane through the focus $F$, perpendicular to the principal axis; let its intersection with the secondary axis be $C$.\nIn the paraxial model, the refracted ray $BC$ passes through $C$; together with the axial ray, this gives two light paths.\nThe source $S$ shown lies between the focus and the converging lens, so the refracted rays diverge and their backward extensions locate the virtual image point $S_1$.\nBackward extensions are construction lines, not paths along which the light actually propagates.',
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
  const mathTokens = text => [...new Set(text.match(/\$[^$]*\$/g) ?? [])].sort();
  assert.deepEqual(mathTokens(entry.zh), mathTokens(entry.en), entry.ref);
  return { ...entry, index, source_refs: source.prose[index].source_refs, source_text: source.prose[index].text };
});
assert.equal(new Set(mappings.map(row => row.index)).size, entries.length);
await immutableWrite(`${folder}/source-sentence-mapping.json`, serialize({
  schema: 'STEMROBIN-181/n76-first-bilingual-source-coverage@1', mappings,
  heading: { source_ref: 'p0202#1', zh: '透镜成像作图法', en: 'Constructing Lens Images', requirement: 'N76-R01' },
  sourceQuestionCount: 0, constructionExamplesAreNotNewUnsolvedPractice: true,
  fullSourceCoverageNotIndependentSCI: true,
}));
const candidates = [], flows = [];
for (const locale of ['zh', 'en']) {
  const directory = `${folder}/candidate/${locale}`;
  const lesson = structuredClone(templates['lesson.template.json']);
  lesson.title = locale === 'zh' ? '透镜成像作图法' : 'Constructing Lens Images';
  lesson.printed_title = `76. ${lesson.title}`;
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
    figure.brief_limits = 'Independently inspect the original before FigureSpec authoring. Complete current text is authoritative. Preserve source symbols, labels, rays and shared frames; separate modern clarifications from original facts. No guessed measurements or visual PASS.';
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
    '--json', `${directory}/lesson.template.json`];
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
  ticket: 'STEMROBIN-181', batch: 'd582-n76-first-bilingual-text-author', card,
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
  ticket: 'STEMROBIN-181', schema: 'STEMROBIN-181/n76-first-author-freeze@1',
  status: 'FROZEN-FIRST-AUTHOR-NOT-INDEPENDENT-PASS', files,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({
  report: await bind(`${folder}/report.json`),
  freeze: await bind(`${folder}/author-freeze.json`),
}));
