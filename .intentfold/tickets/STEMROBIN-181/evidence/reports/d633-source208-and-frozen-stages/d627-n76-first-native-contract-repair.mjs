import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const failed = `${base}/d626-n76-first-bilingual-native`;
const folder = `${base}/d627-n76-first-native-contract-repair`;
assert.equal(await exists(folder), false);
const failure = await read(`${failed}/first-native-failure.json`);
assert.equal(failure.locale, 'zh');
assert.equal(failure.action, 'adapt-finalize');
await verify(failure.receipt.path, failure.receipt.sha256);
assert.equal((await read(failure.receipt.path)).exitCode, 2);
const failedFiles = [];
for (const file of await walk(failed)) failedFiles.push(await bind(file));
const failureFreeze = `${failed}/failure-freeze.json`;
await immutableWrite(failureFreeze, serialize({
  ticket: 'STEMROBIN-181', status: 'FROZEN-FIRST-NATIVE-FAIL',
  files: failedFiles, producer: await bind(`${base}/d626-finalize-n76-first-bilingual-native.mjs`),
  sourceAndPartialBytesUnchanged: true, automaticRetry: false,
}));
for (const file of [...failedFiles.map(row => row.path), failureFreeze,
  `${base}/d626-finalize-n76-first-bilingual-native.mjs`]) {
  await fs.chmod(absolute(file), 0o444);
}
const inputs = [], outputs = [], deltas = [], titleMappings = [];
for (const locale of ['zh', 'en']) {
  const source = `${base}/d597-n76-r08-first-text-repair/candidate/${locale}`;
  const target = `${folder}/candidate/${locale}`;
  const original = await read(`${source}/lesson.template.json`);
  const candidate = structuredClone(original);
  if (locale === 'zh') {
    for (const index of [3, 4]) candidate.prose[index].changes = ['layout'];
    candidate.prose[6].text = candidate.prose[6].text.replace(/^[123]\) /gm, '');
    candidate.prose[10].text = [
      '再考虑物点位于主光轴上的情况。',
      '这时，三条方便的特殊光线合并为主光轴上的同一条光线，不能据此确定一个交点。',
      '图 180 因而在透镜上任取一点 $B$，选择到达这点的光线 $SB$。',
      '先过光心作平行于 $SB$ 的副光轴 $PQ$，再在透镜的出射光一侧作通过像方焦点 $F$、垂直于主光轴的焦平面，求出它与副光轴的交点 $C$。',
      '在近轴模型中，折射光线 $BC$ 通过 $C$；把它与沿主光轴的光线一起使用，就作出了物点 $S$ 发出的两条光线的光路。',
      '图中光源位于焦点和会聚透镜之间，折射光线发散，向后的延长线确定点 $S$ 的虚像点 $S_1$。',
      '向后的延长线是作图线，不代表光沿该方向实际传播。',
    ].join('\n');
  } else {
    titleMappings.push({
      locale, nativeTitle: original.source.data.title,
      nativePrintedTitle: original.source.data.printed_title,
      displayTitle: original.title, displayPrintedTitle: original.printed_title,
    });
    candidate.title = original.source.data.title;
    candidate.printed_title = original.source.data.printed_title;
    candidate.prose[6].text = candidate.prose[6].text.replace(/^[123]\) /gm, '');
    candidate.prose[7].text = candidate.prose[7].text.replace(
      'The ray $AOA_1$ through the optical center $O$ also reaches $A_1$.',
      'The ray through the optical center $O$, namely $AOA_1$, also reaches $A_1$.',
    );
    candidate.prose[10].text = [
      'Now consider an object point on the principal axis.',
      'The three convenient special rays then coincide with the principal axis and do not by themselves determine an intersection point.',
      'Figure 180 therefore selects an arbitrary point $B$ on the lens and the ray $SB$ arriving there.',
      'Draw through the optical center a secondary optical axis parallel to $SB$, denoted by $PQ$; on the outgoing-light side of the lens, draw the focal plane through the image-side focus $F$, perpendicular to the principal axis, and let its intersection with the secondary axis be $C$.',
      'In the paraxial model, the refracted ray $BC$ passes through $C$; together with the axial ray, this gives two light paths from the object point $S$.',
      'The source shown lies between the focus and the converging lens, so the refracted rays diverge and their backward extensions locate the virtual image of $S$ at $S_1$.',
      'Backward extensions are construction lines, not paths along which the light actually propagates.',
    ].join('\n');
  }
  assert.deepEqual(candidate.source, original.source);
  const changedPointers = [];
  for (const field of ['title', 'printed_title']) {
    if (candidate[field] !== original[field]) changedPointers.push(`/${field}`);
  }
  for (let i = 0; i < original.prose.length; i++) {
    for (const field of ['text', 'changes']) {
      if (JSON.stringify(candidate.prose[i][field]) !== JSON.stringify(original.prose[i][field])) {
        changedPointers.push(`/prose/${i}/${field}`);
      }
    }
    const unchanged = structuredClone(candidate.prose[i]);
    unchanged.text = original.prose[i].text;
    unchanged.changes = original.prose[i].changes;
    assert.deepEqual(unchanged, original.prose[i]);
  }
  inputs.push(await bind(`${source}/lesson.template.json`));
  await immutableWrite(`${target}/lesson.template.json`, serialize(candidate));
  outputs.push(await bind(`${target}/lesson.template.json`));
  for (const name of ['exercises.template.json', 'figures.template.json']) {
    inputs.push(await bind(`${source}/${name}`));
    await immutableWrite(`${target}/${name}`, await bytes(`${source}/${name}`));
    outputs.push(await bind(`${target}/${name}`));
  }
  deltas.push({ locale, changedPointers });
}
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76', batch: 'D033',
  status: 'FIRST-NATIVE-CONTRACT-REPAIR-AFFECTED-REVIEW-PENDING',
  failureFreeze: await bind(failureFreeze), inputs, outputs, deltas, titleMappings,
  rationale: [
    'Recognize the faithful dotted Chinese figure reference without altering raw source or reference identities.',
    'Declare two caption-spacing changes and remove author-added list numerals absent from the source.',
    'Restore the source math-token order and its repeated source-point label, preserving the accepted optical statements.',
    'Keep source title identities in native artifacts and retain the original English titles for the existing display projection.',
  ],
  semanticR08RepairReplayed: false, priorSCIAndZHENPreserved: true,
  nativeAttempts: 0, newFigureRenders: 0, newParentImages: 0,
  parentImageCount: 24, oldBudgetReset: false, completeCard: false,
  sourceMutation: false, validationWeakened: false, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) files.push(await bind(file));
await immutableWrite(`${folder}/author-freeze.json`, serialize({ files,
  producer: await bind(`${base}/d627-n76-first-native-contract-repair.mjs`),
  status: 'FROZEN-FIRST-NATIVE-CONTRACT-REPAIR',
}));
for (const file of [...files.map(row => row.path), `${folder}/author-freeze.json`]) {
  await fs.chmod(absolute(file), 0o444);
}
console.log(JSON.stringify({
  report: await bind(`${folder}/report.json`),
  freeze: await bind(`${folder}/author-freeze.json`), deltas,
}));
