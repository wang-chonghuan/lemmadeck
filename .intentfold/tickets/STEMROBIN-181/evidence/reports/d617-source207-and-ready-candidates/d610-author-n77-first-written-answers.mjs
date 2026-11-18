import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, card = 'phy10-c2-s2-n77';
const folder = `${base}/d610-n77-first-written-answer-author`;
assert.equal(await exists(folder), false);
const prepared = `${base}/d602-n77-first-source-preparation`;
await verify(`${prepared}/manifest.json`, 'f69fb92f5a97a13a50ba540e2be7a100cd941c6cc3997a0809ca4a8757d9163b');
const manifest = await read(`${prepared}/manifest.json`);
await verify(manifest.sourceExercises.path, manifest.sourceExercises.sha256);
const templatePath = `${manifest.templateDirectory}/exercises.template.json`;
const template = await read(templatePath);
assert.deepEqual(template.exercises.map(row => row.number), ['1', '2', '3', '4', '5', '6', '7', '8']);
assert.ok(template.exercises.every(row => row.group_id === 'g1' && row.figure_refs.length === 0 && row.figures.length === 0));
const source = await read(manifest.sourceExercises.path);
assert.equal(source.count, 8);
const inputs = [await bind(`${prepared}/manifest.json`), await bind(templatePath), manifest.sourceExercises];
const capturedPath = 'ssot-resources/soviet10year-textbooks/artifacts/10p/answers.json';
const captured = await read(capturedPath);
assert.equal(captured.status, 'captured');
assert.equal(captured.answers.filter(row => row.lesson === card).length, 0);
inputs.push(await bind(capturedPath));
const prompts = [
  ['1. 简述光的折射定律。', '1. State the laws of refraction of light.'],
  ['2. 光的绝对折射率与相对折射率有什么区别？', '2. How does absolute refractive index differ from relative refractive index?'],
  ['3. 全反射的临界角等于什么？', '3. What determines the critical angle for total internal reflection?'],
  ['4. 什么样的透镜叫薄透镜？', '4. What is a thin lens?'],
  ['5. 什么叫透镜的主焦点？', '5. What is the principal focus of a lens?'],
  ['6. 写出透镜公式。', '6. Write the lens formula.'],
  ['7. 为了作出透镜的成像图，利用什么光线为宜？', '7. Which rays are convenient for constructing an image formed by a lens?'],
  ['8. 什么叫做透镜的放大率？', '8. What is the magnification of a lens?'],
];
const responses = [
  {
    coverage: ['coplanarity', 'normal-angle-convention', 'snell-law', 'fixed-frequency-media'],
    zh: '在固定频率、均匀各向同性透明介质的几何光学模型中，入射光线、折射光线和入射点处的法线在同一平面内。\n两条光线位于法线两侧，入射角与折射角都从法线量起，满足 $n_1\\sin\\theta_1=n_2\\sin\\theta_2$。\n这里两种折射率对应同一频率；这不是反射角等于入射角的定律。',
    en: 'For a fixed frequency in the geometrical-optics model of homogeneous, isotropic transparent media, the incident ray, refracted ray, and normal at the point of incidence lie in one plane.\nThe incident and refracted rays lie on opposite sides of the normal. With both angles measured from the normal, $n_1\\sin\\theta_1=n_2\\sin\\theta_2$.\nThe two refractive indices refer to the same frequency; this is not the law equating reflection and incidence angles.',
  },
  {
    coverage: ['absolute-index-c-over-phase-speed', 'ordered-relative-index', 'frequency-consistency'],
    zh: '绝对折射率把真空中的光速与介质中的相速度比较：$n=c/v$。\n光从介质 1 进入介质 2 时，介质 2 对介质 1 的相对折射率为 $n_{21}=n_2/n_1=v_1/v_2$。\n它比较两种介质，而不是每种介质与真空；交换两种介质的顺序会把相对折射率变为倒数，所有速度与折射率都取同一频率。',
    en: 'Absolute refractive index compares the vacuum speed of light with the phase speed in a medium: $n=c/v$.\nFor light going from medium 1 into medium 2, the index of medium 2 relative to medium 1 is $n_{21}=n_2/n_1=v_1/v_2$.\nThis compares two media rather than each medium with vacuum. Reversing their order gives the reciprocal relative index; all speeds and indices are evaluated at the same frequency.',
  },
  {
    coverage: ['higher-to-lower-index', 'critical-angle-at-refracted90', 'above-critical-tir', 'normal-angle'],
    zh: '在两种透明介质的理想界面上，只有从较大折射率介质射向较小折射率介质，即 $n_1>n_2$ 时，才有全反射临界角。\n临界角从法线量起，是折射角达到直角时的入射角，满足 $\\sin\\theta_c=n_2/n_1$。\n因此 $\\theta_c=\\arcsin(n_2/n_1)$。\n入射角大于临界角时发生全反射；等于临界角是折射光线沿界面的极限情况。',
    en: 'At an ideal interface between transparent media, a critical angle for total internal reflection exists only for incidence from the higher-index medium into the lower-index medium, with $n_1>n_2$.\nMeasured from the normal, it is the incidence angle at which the refraction angle reaches a right angle, so $\\sin\\theta_c=n_2/n_1$.\nThus $\\theta_c=\\arcsin(n_2/n_1)$.\nTotal internal reflection occurs above the critical angle; equality is the limiting case of a refracted ray along the interface.',
  },
  {
    coverage: ['thickness-negligible', 'curvature-scale', 'single-plane-model', 'not-small-focal-length'],
    zh: '薄透镜是厚度相对于两面的曲率半径足够小、在所需精度下可以忽略厚度的透镜。\n在相应的近轴成像模型中，可以把两次折射近似归到一个透镜平面，不必分别追踪透镜内部的光路。\n“薄”描述厚度可以忽略，并不是说焦距必须很小或透镜一定会聚。',
    en: 'A thin lens has a thickness sufficiently small compared with the radii of curvature of its two surfaces that thickness can be neglected at the required accuracy.\nIn the corresponding paraxial imaging model, its two refractions can be represented at a single lens plane without separately tracking the path inside the lens.\nThinness means negligible thickness, not necessarily a short focal length or a converging lens.',
  },
  {
    coverage: ['parallel-principal-axis', 'image-side-focus', 'real-convergence', 'virtual-backward-extension', 'paraxial'],
    zh: '在近轴模型中，平行于透镜主光轴的入射光线经透镜后会聚的点，或折射光线反向延长线相交的点，叫做该入射方向对应的像方主焦点。\n会聚透镜的实际折射光线通过实焦点；发散透镜的实际光线发散，只有反向延长线通过虚焦点。\n反向延长线不是光实际传播的路径，透镜也不是只有一个焦点。',
    en: 'In the paraxial model, the image-side principal focus for a given direction of incidence is the point where rays incident parallel to the principal axis converge after the lens, or where their backward extensions meet.\nActual refracted rays from a converging lens pass through a real focus. Rays from a diverging lens spread out; only their backward extensions pass through a virtual focus.\nBackward extensions are not actual light paths, and a lens does not have only one focus.',
  },
  {
    coverage: ['thin-paraxial-same-medium', 'lens-formula', 'f-vs-F', 'real-positive-signs', 'virtual-object'],
    zh: '对两侧为同一种介质的薄透镜，在近轴近似下：\n$\\frac{1}{d}+\\frac{1}{f}=\\frac{1}{F}$。\n其中物距为 $d$，像距为 $f$，焦距为 $F$，不可混淆像距与焦距。\n按本课约定，实物距、实像距和会聚透镜焦距取正；虚物距、虚像距和发散透镜焦距取负。\n虚物点指入射会聚光束在未经透镜改变时沿原方向会聚的位置；求解未知距离时保留它的带符号值。',
    en: 'For a thin lens with the same medium on both sides, in the paraxial approximation:\n$\\frac{1}{d}+\\frac{1}{f}=\\frac{1}{F}$.\nHere the object distance is $d$, image distance is $f$, and focal length is $F$; image distance and focal length are distinct.\nIn this lesson, real object distances, real image distances, and converging-lens focal lengths are positive; virtual object distances, virtual image distances, and diverging-lens focal lengths are negative.\nA virtual object is the point where incoming converging rays would meet without the lens changing them. Retain the signed value when solving for an unknown distance.',
  },
  {
    coverage: ['parallel-to-axis', 'object-focus-to-parallel', 'center-direction', 'two-independent-rays', 'virtual-image-extensions', 'on-axis-degeneracy'],
    zh: '对会聚薄透镜，三种便利光线是：\n1. 平行于主光轴入射的光线，折射后通过像方焦点。\n2. 入射前通过物方焦点的光线，折射后平行于主光轴。\n3. 通过光心的光线，在薄透镜近似中方向不变。\n通常选两条独立光线确定像点：实际折射线相交得到实像，反向延长线相交得到虚像。\n发散透镜的平行入射线折射后的反向延长线通过像方虚焦点；射向出射侧相应焦点的入射线则平行出射。\n物点在主光轴上时，三条特殊光线可能重合，应另选一条非轴向光线，利用像方焦平面作图，不能把同一条线当作两条独立光线。',
    en: 'For a converging thin lens, three convenient rays are:\n1. A ray incident parallel to the principal axis, which refracts through the image-side focus.\n2. A ray passing through the object-side focus before the lens, which emerges parallel to the principal axis.\n3. A ray through the optical center, whose direction is unchanged in the thin-lens approximation.\nUsually two independent rays locate the image point: actual refracted rays intersect for a real image, while backward extensions intersect for a virtual image.\nFor a diverging lens, the backward extension of a refracted parallel-incident ray passes through the image-side virtual focus; an incident ray aimed at the corresponding focus on the outgoing side emerges parallel.\nFor an object point on the principal axis, the three special rays may coincide. Choose another nonaxial ray and use the image-side focal plane; the same line is not two independent rays.',
  },
  {
    coverage: ['image-over-object-linear-size', 'nonnegative-Gamma', 'absolute-distance-ratio', 'not-orientation'],
    zh: '线放大率是像的线性尺寸与物体对应线性尺寸之比。\n若非零物体高度为 $h$，像高为 $H$，两者按尺寸的大小取值，则 $\\Gamma=H/h$。\n薄透镜近轴模型中有 $\\Gamma=|f|/|d|$。\n这里放大率是非负的大小比，不以它的符号表示正立或倒立；像的方向须另行判断。',
    en: 'Linear magnification is image linear size divided by the corresponding object linear size.\nFor nonzero object height $h$ and image height $H$, both taken as size magnitudes, $\\Gamma=H/h$.\nIn the paraxial thin-lens model, $\\Gamma=|f|/|d|$.\nThis magnification is a nonnegative size ratio, not a signed indication of upright or inverted orientation; orientation is determined separately.',
  },
];
const candidates = [], formulas = [];
for (const [language, column] of [['zh', 0], ['en', 1]]) {
  const exercises = structuredClone(template);
  for (const [index, item] of exercises.exercises.entries()) {
    const raw = template.exercises[index];
    item.text = prompts[index][column];
    item.lines = [item.text];
    item.changes = language === 'en' ? ['language', 'layout'] : ['layout'];
    assert.equal(item.source_text, raw.source_text);
    assert.deepEqual(item.pages, raw.pages);
  }
  const answers = exercises.exercises.map((item, index) => {
    const response = responses[index], text = response[language];
    for (const match of text.matchAll(/\$([^$]+)\$/g)) {
      formulas.push({ id: `${language}-q${item.number}-${formulas.length}`, field: 'displayAnswer', tex: match[1], display: false });
    }
    return {
      exercise: item.number, source_number: item.source_number,
      group_id: item.group_id, prompt: item.text, source_refs: item.pages,
      figureEvidence: [], grading: 'ungraded', source: 'derived',
      displayAnswer: text, parts: [], historical_entities: [],
      taskCoverage: response.coverage, reviewStatus: 'PENDING-INDEPENDENT-SCI-ZHEN',
    };
  });
  const exerciseFile = `${folder}/${language}/exercises.template.json`;
  const answerFile = `${folder}/${language}/answer-keys.candidate.json`;
  await immutableWrite(exerciseFile, serialize(exercises));
  await immutableWrite(answerFile, serialize({
    schema: 'ld-s10y-answer/lesson-answers@1', book: '10p', lesson: card,
    edition: 'modern-us-neutral', language, status: 'draft', answers,
    readOnlyWrittenResponses: true, automaticGradingKeys: 0,
    completeCard: false, nativeFinalizeRun: false, independentReview: 'PENDING',
  }));
  candidates.push(await bind(exerciseFile), await bind(answerFile));
}
const command = ['node', '.claude/skills/ld-s10y-lesson/tools/katex_check.js'];
const result = spawnSync(command[0], command.slice(1), {
  cwd: root, encoding: 'utf8', input: JSON.stringify(formulas), timeout: 30000,
});
await immutableWrite(`${folder}/local-latex.receipt.json`, serialize({
  command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  scope: 'Only newly authored answer formulas; no SOURCE/lesson/native/SCI replay.',
}));
assert.equal(result.status, 0, result.stderr);
const checks = JSON.parse(result.stdout);
assert.equal(checks.length, formulas.length);
assert.ok(checks.every(row => row.ok && row.warnings.length === 0));
await immutableWrite(`${folder}/input-bindings.json`, serialize({
  inputs, capturedAnswersForN77: 0, bookRawInvented: false,
  independentD601SolutionsNotReadBeforeAuthorFreeze: true,
  oldChoiceKeyInteractionInputsNotRead: true,
  textSCIStillPendingAndNotAnswerApproval: true,
}));
for (const row of inputs) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/report.json`, serialize({
  schema: 'n77-first-written-answer-author@1', ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-BILINGUAL-PROMPTS-AND-DERIVED-UNGRADED-ANSWERS-FROZEN',
  candidates, sourceQuestions: 8, writtenAnswers: 8, localizedAnswers: 16,
  localStructure: 'PASS', localKaTeX: 'PASS', formulaChecks: checks.length,
  SCI: 'pending-first-independent-answer-review', ZHEN: 'pending-first-independent-answer-review',
  native: 'pending', DISPLAY: 'pending', choices: 'pending', completeCard: false,
  questionFigureReferences: 0, imagePixelInference: false, numericProblemValuesInvented: false,
  noAutomaticGradingKeys: true, historicalFAILHOLDPreserved: true,
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/author-freeze.json`, serialize({
  schema: 'n77-written-answer-freeze@1', frozen: true, files,
  independentApproval: false, newImages: 0, parentImageCount: 24, compactionReset: false,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({ report: await bind(`${folder}/report.json`), freeze: await bind(`${folder}/author-freeze.json`), formulaChecks: checks.length }));
