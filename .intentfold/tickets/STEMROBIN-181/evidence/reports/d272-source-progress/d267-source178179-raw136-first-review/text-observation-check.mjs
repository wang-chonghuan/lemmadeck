import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const author = path.resolve(out, '../d260-source178179-first-author');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const input = read(path.join(author, 'input-bindings.json'));
for (const item of [input.manifest, ...input.preparedInputs]) assert.equal(bind(item.path).sha256, item.sha256);

// Independently observed pixel text, in the existing source normalization.
const observed = {
  '0178': [
    [2, ['图 136']],
    [3, [
      '第一个面同样的光通量照在这个平面上. 如果第二个平面和',
      '第一平面成 $\\alpha$ 角，那末从中心光源射在它上面的光线的入射',
      '角同样等于 $\\alpha$. 第二个平面的面积等于 $\\Delta S$. 从图形中很容易',
      '看出，两个平面都具有同一宽度 $a$，但长度 $b$ 和 $b_0$ 不同，并',
      '且因为',
      '$\\frac{b_0}{b}=\\cos\\alpha$',
    ]],
    [4, ['所以', '$\\frac{\\Delta S_0}{\\Delta S}=\\frac{ab_0}{ab}=\\cos\\alpha$']],
    [5, ['当光通量均为 $\\Delta\\Phi$ 时，两个平面的照度就将不同：', '$E=\\frac{\\Delta\\Phi}{\\Delta S}$，　$E_0=\\frac{\\Delta\\Phi}{\\Delta S_0}$']],
    [6, ['于是', '$\\frac{E}{E_0}=\\frac{\\Delta S_0}{\\Delta S}=\\cos\\alpha$']],
    [7, [
      '因此，与光线倾斜的面上的照度 $E$ 与光线垂直的面上的照度',
      '$E_0$ 有如下的联系：',
      '$E=E_0\\cos\\alpha$ (6.6)',
    ]],
    [8, ['这就是说，表面的照度与光线入射角的余弦成正比.']],
    [9, ['综合得出的结果，可以总结出一条一般的规律.']],
    [10, ['\u2022 168 \u2022']],
  ],
  '0179': [
    [1, [
      '点光源产生的照度与光源的发光强度、光线入射角的余',
      '弦成正比，与从光源到表面的距离的平方成反比：',
      '$E=\\frac{I}{R^2}\\cos\\alpha$ (6.7)',
    ]],
    [2, ['如果有几个光源，那么总的照度等于每个光源分别产生', '的照度的和.']],
    [3, [
      '照度可用特殊的仪器——流明计（照度计）来测量. 摄影',
      '师为确定摄影时曝光时间应用的仪器——曝光表的作用也是',
      '以照度的测量为基础的.',
    ]],
    [4, [
      '在我国为保护人们的正常视力，规定了住房和公共场所',
      '照度卫生标准，以保证日常生活和工作的最好条件. 其中教',
      '室黑板照度应为 150 流明，学校楼梯的照度应为 30 流明.',
    ]],
    [5, ['问题']],
    [6, ['什么叫做光线？']],
    [7, ['什么叫做光通量？']],
    [8, ['什么叫做发光强度？']],
    [9, ['点光源的照度与什么有关？']],
    [10, ['练 习 6']],
    [11, [
      '光束经过侧壁的小孔射入小盒子，并经过对面盒壁的小孔射',
      '出. 如果盒子里的空气是清洁的，通过前壁的小孔向盒内看，你能看见',
      '光束吗？',
    ]],
    [12, ['当地球进入月球半影范围内时，对于观察者来说，日食看起来', '是怎样的？']],
    [13, ['“伊凡·伊凡诺维奇走进去的那间屋子里是完全黑暗的，因为几']],
    [14, ['\u2022 169 \u2022']],
  ],
};
const typographyExpected = {
  '0178': [
    ['bold', 'p0178#8', 1, 1, 23, '这就是说，表面的照度与光线入射角的余弦成正比.'],
    ['italic', 'p0178#10', 1, 3, 5, '168'],
  ],
  '0179': [
    ['bold', 'p0179#1', 1, 1, 24, '点光源产生的照度与光源的发光强度、光线入射角的余'],
    ['bold', 'p0179#1', 2, 1, 22, '弦成正比，与从光源到表面的距离的平方成反比：'],
    ['bold', 'p0179#3', 1, 12, 14, '流明计'],
    ['bold', 'p0179#3', 2, 19, 21, '曝光表'],
    ['bold', 'p0179#5', 1, 1, 2, '问题'],
    ['bold', 'p0179#10', 1, 1, 5, '练 习 6'],
    ['italic', 'p0179#14', 1, 3, 5, '169'],
  ],
};
const pages = [], findings = [];
for (const page of ['0178', '0179']) {
  const sourcePath = path.join(author, `source/10p/pages/${page}/page.json`);
  const s = read(sourcePath);
  let physicalRow = 0;
  const rows = [];
  for (const [blockNumber, expectedLines] of observed[page]) {
    const b = s.blocks[blockNumber - 1];
    assert.equal(b.lines.length, expectedLines.length);
    expectedLines.forEach((expected, i) => {
      const row = ++physicalRow;
      const actual = b.lines[i];
      const equal = actual === expected;
      const record = {
        row, ref: `p${page}#${blockNumber}`, line: i + 1, kind: b.kind,
        printedExerciseNumber: b.kind === 'ex' ? b.label : null,
        expectedPixelTextInExistingNormalization: expected,
        actual, status: equal ? 'PASS' : 'FAIL',
        evidence: page === '0178' ? ['S178-O1', ...(row >= 14 ? ['S178-O3'] : [])] : ['S179-O2', row <= 11 ? 'S179-O4' : 'S179-O5'],
      };
      rows.push(record);
      if (!equal) findings.push(record);
    });
  }
  assert.equal(physicalRow, page === '0178' ? 19 : 24);
  const typography = [];
  for (const note of s.meta.notes.filter(n => ['bold', 'italic'].includes(n.type))) {
    const ranges = note.ranges || [{ line: note.line_range[0], text: note.text, character_range_1based_inclusive: note.character_range_1based_inclusive }];
    for (const r of ranges) {
      const [start, end] = r.character_range_1based_inclusive;
      const blockNumber = Number(note.block.split('#')[1]);
      assert.equal([...s.blocks[blockNumber - 1].lines[r.line - 1]].slice(start - 1, end).join(''), r.text);
      typography.push([note.type, note.block, r.line, start, end, r.text]);
    }
  }
  assert.deepEqual(typography, typographyExpected[page]);
  pages.push({
    page: Number(page), source: bind(sourcePath),
    rows, typographyRangesObservedAndMatched: typography, rangeContract: 'Existing 1-based inclusive source-line character ranges; no new parser requirement.',
  });
}
const p178 = read(path.join(author, 'source/10p/pages/0178/page.json'));
const p179 = read(path.join(author, 'source/10p/pages/0179/page.json'));
assert.deepEqual(p178.blocks.slice(0, 3).map(b => b.kind), ['fig', 'cap', 'p']);
assert.equal(p178.blocks[2].cont, true);
assert.equal(p178.blocks[8].open, false);
assert.equal(p179.blocks[0].cont, false);
assert.deepEqual(p179.blocks.slice(5, 9).map(b => b.label), ['1', '2', '3', '4']);
assert.deepEqual(p179.blocks.slice(10, 13).map(b => b.label), ['1', '2', '3']);
assert.equal(p179.blocks[12].open, true);
assert.equal(p179.blocks.filter(b => b.kind === 'fig').length, 0);
assert.equal(p178.blocks[0].id, 'fig-136');
assert.deepEqual(p178.blocks[0].box, [356, 253, 763, 237]);
const result = {
  schema: 'd267-independent-observed-text-comparison@1', date: '2026-11-18',
  status: findings.length ? 'FAIL' : 'PASS', sourceFindings: findings,
  independentPixelInventoryPrecededAuthorProseReading: true,
  sourceExpectationOrigin: 'Actual original page/detail observations recorded in independentinventory.md; source normalization follows the already-established faithful profile.',
  authorNativeUsedAsSemanticProof: false, authorReportVoteUsed: false,
  preparedInputHashesVerified: 9, pages,
  boundaryAndGroupFlags: 'PASS-local-continuation-and-segmentation; SOURCE180 and exercise3 closure remain HOLD.',
  newImagesOpenedByThisCommand: 0, nativeCommands: 0, oldFilesModified: 0,
};
const destination = path.join(out, 'text-observation-check.json');
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(destination), status: result.status, rows: pages.map(p => [p.page, p.rows.length]), typographyRanges: pages.reduce((n, p) => n + p.typographyRangesObservedAndMatched.length, 0), findings: findings.length }));
