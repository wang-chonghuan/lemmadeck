import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, source = `${base}/d607-n77-first-bilingual-text-author`;
const folder = `${base}/d615-n77-r07-first-text-repair`;
assert.equal(await exists(folder), false);
const reportPath = `${base}/d608-n77-first-independent-text-review/report.json`;
await verify(reportPath, 'e819a49e2431c08d4065baa7cd7d03d8612f283ee353489d72058ac1423c809a');
await verify(`${source}/author-freeze.json`, '1817e0127078ff6dbd3640ad559e25d3449dc350c189ff6f8d21c571a9f67732');
const review = await read(reportPath);
assert.equal(review.SCI, 'PASS-TEXT-ONLY');
assert.equal(review.ZHEN, 'FAIL-EXACT-NUMERIC-REFERENCE-PRESERVATION');
const requirement = review.requirements.find(row => row.id === 'N77-R07');
assert.deepEqual(requirement.blockers, [
  'N77-TEXT-R07-ZH-OMITTED-REPEATED-6.17', 'N77-TEXT-R07-EN-OMITTED-REPEATED-6.17',
]);
const deltas = [], candidates = [];
for (const locale of ['zh', 'en']) {
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const from = `${source}/candidate/${locale}/${name}`;
    const to = `${folder}/candidate/${locale}/${name}`;
    const original = await bytes(from);
    if (name !== 'lesson.template.json') {
      await immutableWrite(to, original);
    } else {
      const before = JSON.parse(original), after = structuredClone(before);
      const old = locale === 'zh'
        ? '发散透镜满足 $F<0$，公式右端为 $-\\frac{1}{|F|}$。'
        : 'For a diverging lens, $F<0$, and the right-hand side is $-\\frac{1}{|F|}$.';
      const replacement = locale === 'zh'
        ? '发散透镜满足 $F<0$，公式（6.17）右端为 $-\\frac{1}{|F|}$。'
        : 'For a diverging lens, $F<0$, and the right-hand side of (6.17) is $-\\frac{1}{|F|}$.';
      assert.equal(before.prose[2].text.split(old).length, 2);
      after.prose[2].text = before.prose[2].text.replace(old, replacement);
      const normalize = value => {
        const clone = structuredClone(value);
        clone.prose[2].text = '';
        return clone;
      };
      assert.deepEqual(normalize(after), normalize(before));
      const math = value => value.match(/\$[^$]*\$/g) ?? [];
      assert.deepEqual(math(after.prose[2].text), math(before.prose[2].text));
      assert.deepEqual(after.prose[2].text.match(/6\.\d+/g), ['6.17', '6.18', '6.17']);
      await immutableWrite(to, serialize(after));
      deltas.push({
        locale, pointer: '/prose/2/text', old, replacement,
        original: await bind(from), candidate: await bind(to),
        mathTokensUnchanged: true, allOtherFieldsUnchanged: true,
        SCIAlreadyPASSNotReauthored: true,
      });
    }
    candidates.push(await bind(to));
  }
}
await immutableWrite(`${folder}/report.json`, serialize({
  schema: 'STEMROBIN-181/n77-r07-first-text-repair@1',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n77', batch: 'D033',
  status: 'SOLE-LOCALIZED-R07-REFERENCE-REPAIR-FROZEN-AFFECTED-ZHEN-PENDING',
  priorReview: await bind(reportPath), priorAuthorFreeze: await bind(`${source}/author-freeze.json`),
  repairNumber: 1, repairsAllowedAfterThis: 0, affectedRequirement: 'N77-R07',
  deltas, candidates, SCI: 'PASS-FIRST-INDEPENDENT-REUSED-NOT-REVIEWED',
  ZHEN: 'R07-FIRST-AFFECTED-REVIEW-PENDING-OTHER-PASSES-REUSED',
  nativeInvocations: 0, newParentImages: 0, parentImageCount: 24, oldBudgetReset: false,
  historicalFAILHOLDPreserved: true, completeCard: false, canonicalEdits: false,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) {
  await fs.chmod(absolute(file), 0o444);
  files.push(await bind(file));
}
await immutableWrite(`${folder}/author-freeze.json`, serialize({
  schema: 'STEMROBIN-181/n77-r07-repair-freeze@1', files,
  firstFAILNotReplaced: true, frozen: true,
}));
await fs.chmod(absolute(`${folder}/author-freeze.json`), 0o444);
console.log(JSON.stringify({
  report: await bind(`${folder}/report.json`),
  freeze: await bind(`${folder}/author-freeze.json`), affectedPointers: deltas.map(row => `${row.locale}:${row.pointer}`),
}));
