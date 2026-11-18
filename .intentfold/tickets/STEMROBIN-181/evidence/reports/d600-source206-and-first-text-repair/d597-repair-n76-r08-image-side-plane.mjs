import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`;
const previous = `${base}/d582-n76-first-bilingual-text-author`;
const folder = `${base}/d597-n76-r08-first-text-repair`;
const reviewPath = `${base}/d585-n76-first-independent-text-review/report.json`;
const inventoryPath = `${base}/d569-source203-first-independent-review/sourceinventory.json`;
for (const [file, sha] of [
  [`${previous}/report.json`, '111fad1a0d63af92771c095ad81176a7248d6a892abd5e66747962ed5c48afc7'],
  [`${previous}/author-freeze.json`, 'e4d736e1f90e5c97351f908da89067d3f39ed534f6a98c82cc35ce7ea58ee98c'],
  [reviewPath, 'd73acc7fda78771360ea451917c8a4a67ad7fe971035bf5631d2b5eb4899f60a'],
  [`${base}/d585-n76-first-independent-text-review/review-freeze.json`,
    '7f03560d559c4a1d80460a6fb984acb56fc5eb000b899fd2f0d101493ecb1ffd'],
  [inventoryPath, 'ecdedaf5e2d2041acf216ac52e26204111f14046bb34eeaa88b95f80b8541897'],
]) await verify(file, sha);
assert.equal(await exists(folder), false);
const review = await read(reviewPath);
assert.deepEqual(review.gates.SCI.blocking_list, ['N76-R08-H01']);
assert.equal(review.gates.ZHEN.status, 'PASS');
const sourceInventory = await read(inventoryPath);
assert.ok(JSON.stringify(sourceInventory).includes('F right of O'));
const author = await read(`${previous}/report.json`);
for (const row of (await read(`${previous}/author-freeze.json`)).files) {
  await verify(row.path, row.sha256);
}
const replacements = {
  zh: {
    before: '先过光心作平行于 $SB$ 的副光轴 $PQ$，再作通过焦点 $F$、垂直于主光轴的焦平面，求出它与副光轴的交点 $C$。',
    after: '先过光心作平行于 $SB$ 的副光轴 $PQ$，再在透镜的出射光一侧作通过像方焦点 $F$、垂直于主光轴的焦平面，求出它与副光轴的交点 $C$。',
  },
  en: {
    before: 'Draw the secondary optical axis $PQ$ through the optical center, parallel to $SB$, and draw the focal plane through the focus $F$, perpendicular to the principal axis; let its intersection with the secondary axis be $C$.',
    after: 'Draw the secondary optical axis $PQ$ through the optical center, parallel to $SB$; on the outgoing-light side of the lens, draw the focal plane through the image-side focus $F$, perpendicular to the principal axis, and let its intersection with the secondary axis be $C$.',
  },
};
const candidates = [], deltas = [];
for (const locale of ['zh', 'en']) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const oldPath = `${previous}/candidate/${locale}/${name}.template.json`;
    const binding = author.candidates.find(row => row.path === oldPath);
    assert.ok(binding, oldPath);
    await verify(oldPath, binding.sha256);
    const before = await read(oldPath), after = structuredClone(before);
    if (name === 'lesson') {
      const index = after.prose.findIndex(row => row.kind === 'p' && row.source_refs.includes('p0203#5'));
      assert.equal(index, 10);
      const { before: oldLine, after: newLine } = replacements[locale];
      const lines = after.prose[index].text.split('\n');
      assert.equal(lines[3], oldLine);
      lines[3] = newLine;
      after.prose[index].text = lines.join('\n');
      const math = text => text.match(/\$[^$]*\$/g) ?? [];
      assert.deepEqual(math(after.prose[index].text), math(before.prose[index].text));
      const unchangedProjection = structuredClone(after);
      unchangedProjection.prose[index].text = before.prose[index].text;
      assert.deepEqual(unchangedProjection, before);
      deltas.push({
        locale, pointer: `/prose/${index}/text`, affectedLineOneBased: 4,
        source_refs: before.prose[index].source_refs,
        before: oldLine, after: newLine, historicalFinding: 'N76-R08-H01',
        sourceSnapshotAndAllOtherFieldsUnchanged: true, mathematicalTokensUnchanged: true,
      });
    }
    const candidate = `${folder}/candidate/${locale}/${name}.template.json`;
    await immutableWrite(candidate, serialize(after));
    candidates.push(await bind(candidate));
  }
}
await immutableWrite(`${folder}/delta.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  repairNumber: 1, affectedRequirement: 'N76-R08', deltas,
  originalAuthor: await bind(`${previous}/report.json`),
  originalSCI_HOLD: await bind(reviewPath), acceptedSourceInventory: await bind(inventoryPath),
  alreadyPassedR01ThroughR07NotRewritten: true,
  originalZHENPassRetainedNotRechecked: true,
  originalSourceOrImagesChanged: false, newImageOpens: 0,
}));
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n76',
  status: 'FIRST-LOCALIZED-R08-TEXT-REPAIR-READY-AFFECTED-SCI-ZHEN-PENDING',
  originalAuthor: await bind(`${previous}/report.json`),
  originalAuthorFreeze: await bind(`${previous}/author-freeze.json`),
  firstReview: await bind(reviewPath), delta: await bind(`${folder}/delta.json`),
  candidates, repairsUsed: 1, affectedRequirements: ['N76-R08'],
  firstFAILHOLDPreserved: true, allOtherFieldsAndSourceSnapshotsUnchanged: true,
  nativeRuns: 0, imagesOpened: 0, parentImageCount: 24, oldBudgetReset: false,
  SCI: 'pending-affected-only', ZHEN: 'pending-affected-only',
  FIG: 'pending-first-author', DISPLAY: 'pending', completeCard: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/author-freeze.json`, serialize({
  schema: 'STEMROBIN-181/n76-r08-first-repair-freeze@1',
  ticket: 'STEMROBIN-181', status: 'FROZEN-REPAIR-NOT-INDEPENDENT-PASS', files,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({
  report: await bind(`${folder}/report.json`), freeze: await bind(`${folder}/author-freeze.json`),
}));
