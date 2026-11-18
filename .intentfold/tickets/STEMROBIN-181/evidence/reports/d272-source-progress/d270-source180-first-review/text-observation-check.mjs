import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const author = path.resolve(out, '../d268-source180-first-author');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const sourcePath = path.join(author, 'source/10p/pages/0180/page.json');
const s = read(sourcePath);

// Expectations transcribed from the actual page/detail observations, not native PASS.
const observed = [
  [1, [
    '扇百叶窗都关着. 一缕日光从百叶窗的缝隙射入，并以一种虹的色彩',
    '射到对面的墙上，在那上边形成一幅以屋顶、树木和晾在院子里的衣服',
    '组成的彩色风景画. 不过全部是倒影.”（Н. В. 果戈里 «伊凡·伊凡',
    '诺维奇和伊凡·尼基弗罗维奇争吵的故事»）. 阐明这种现象的起因.',
  ]],
  [2, ['4. 为什么街灯照在地上，脚的影子很清楚，而头的影子大都是模', '糊一片？']],
  [3, [
    '5. 挂在车床上高 1.1 米处的灯，在操作处产生的照度为 50 流明，',
    '按规定照度应在 50 流明左右，变化不能大于 10 流明，问灯可以挂在车',
    '床上多高的范围内？',
  ]],
  [4, [
    '6. 有两个点光源，它们的发光强度是 $I_1=80$ 坎德拉，$I_2=125$ 坎德',
    '拉，彼此相距 $l=3.6$ 米. 为了使一个不大的平面屏的两边的照度相等，',
    '应当把它放在连结两光源的线段的何处？ 如果屏不垂直于连接两光源',
    '的直线，上述答案变化吗？',
  ]],
  [5, [
    '7. 房间被两盏离地板 $h=3$ 米，彼此相距 $l=4$ 米的灯照亮. 设灯',
    '为点光源，每盏灯的发光强度 $I=200$ 坎德拉. 求每灯正下方地板上的',
    '照度和两灯连线的中点下方地板上的照度，从天花板和墙上反射的光',
    '对照度的影响可以忽略不计.',
  ]],
  [6, ['69. 光的反射定律 平面镜成像']],
  [7, [
    '当光线没有到达一种媒质和另一媒质的交界面时，在同',
    '一种媒质里光线是直线传播的. 在两种媒质的交界面上光就',
    '改变自己的方向. 一部分光（在很多情况下是全部的光）返回',
    '第一种媒质，这种现象叫做光的反射.',
  ]],
  [8, [
    '光的反射定律. 光的反射定律决定入射线 $AB$、反射线',
    '$BD$ 和在入射点与界面垂直的线 $BC$ 的相互位置（图 137a）.',
  ]],
  [9, [
    '在第 47 节已经研究过机械波的反射，我们看到，当波反',
    '射时，反射角等于入射角. 这个定律对于任何性质的波都是',
  ]],
  [10, ['\u2022 170 \u2022']],
];
const typographyExpected = [
  ['bold', 'p0180#6', 1, 1, 16, '69. 光的反射定律 平面镜成像'],
  ['bold', 'p0180#7', 4, 13, 16, '光的反射'],
  ['bold', 'p0180#8', 1, 1, 7, '光的反射定律.'],
  ['italic', 'p0180#9', 1, 4, 5, '47'],
  ['italic', 'p0180#10', 1, 3, 5, '170'],
];
const rows = [], findings = [];
let physicalRow = 0;
for (const [number, lines] of observed) {
  const b = s.blocks[number - 1];
  assert.equal(b.lines.length, lines.length);
  for (const [i, expected] of lines.entries()) {
    const actual = b.lines[i], equal = actual === expected;
    const record = {
      row: ++physicalRow, ref: `p0180#${number}`, line: i + 1,
      kind: b.kind, printedExerciseNumber: b.kind === 'ex' ? b.label : null,
      actual, expectedPixelTextInExistingNormalization: expected,
      status: equal ? 'PASS' : 'FAIL',
      evidence: ['S180-O1', number <= 5 ? 'S180-O2' : 'S180-O3'],
    };
    if (!equal) {
      record.finding = 'S180-F001';
      findings.push(record);
    }
    rows.push(record);
  }
}
assert.equal(physicalRow, 27);
assert.equal(findings.length, 1);
assert.equal(findings[0].row, 3);
const typography = [];
for (const n of s.meta.notes.filter(n => ['bold', 'italic'].includes(n.type))) {
  const [start, end] = n.character_range_1based_inclusive;
  const number = Number(n.block.split('#')[1]);
  const line = n.line_range[0];
  assert.equal([...s.blocks[number - 1].lines[line - 1]].slice(start - 1, end).join(''), n.text);
  typography.push([n.type, n.block, line, start, end, n.text]);
}
assert.deepEqual(typography, typographyExpected);
const math = s.meta.notes.find(n => n.type === 'math-typography').ranges;
for (const r of math) {
  const number = Number(r.block.split('#')[1]), [start, end] = r.character_range_1based_inclusive;
  assert.equal([...s.blocks[number - 1].lines[r.line - 1]].slice(start - 1, end).join(''), r.text);
}
assert.equal(math.length, 9);
assert.deepEqual(s.blocks.slice(0, 5).map(b => b.label), ['3', '4', '5', '6', '7']);
assert.equal(s.blocks[0].cont, true);
assert.equal(s.blocks[0].open, false);
assert.equal(s.blocks[5].kind, 'h3');
assert.equal(s.blocks[8].open, true);
assert.equal(s.blocks.filter(b => b.kind === 'fig').length, 0);
const oldReportPath = path.resolve(out, '../d267-source178179-raw136-first-review/report.json');
assert.equal(bind(oldReportPath).sha256, '7efccf933a94992d9dbfd615e6ca926822995d57cb341f67a8cb924b7bff4bcd');
const previousText = read(oldReportPath).boundaries.right.observedText;
assert(previousText.endsWith('因为几'));
const joined = previousText + s.blocks[0].lines.join('');
assert(joined.includes('因为几扇百叶窗都关着.'));
assert(joined.includes('倒影.”（Н. В. 果戈里'));
const result = {
  schema: 'd270-independent-observed-text-comparison@1', date: '2026-11-18',
  status: 'FAIL', source: bind(sourcePath), rows, findings,
  passRows: 26, failRows: 1,
  typographyStatus: 'PASS', typographyRangesObservedAndMatched: typography,
  mathematicalSpanStatus: 'PASS', mathematicalRanges: math,
  rangeConvention: 'Existing source-line character ranges including LaTeX serialization; no new parser requirement.',
  previousIndependentTail: { report: bind(oldReportPath), text: previousText },
  localExercise3ContinuationAndClosure: 'PASS-BOUNDARY-ONLY; quote punctuation fidelity fails at row3.',
  newTitleAndRightOpenFlags: 'PASS-local; SOURCE181 unobserved, n69 not complete.',
  actualFigures: 0, RAW137Status: 'HOLD-REFERENCED-NOT-OBSERVED',
  authorReportVoteUsed: false, nativePassUsedAsSemanticProof: false,
  newImageOpensByThisCommand: 0, oldFilesModified: 0, nativeReruns: 0,
};
const destination = path.join(out, 'text-observation-check.json');
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output: bind(destination), status: result.status, passRows: 26, failRows: 1, typographyRanges: typography.length, mathRanges: math.length }));
