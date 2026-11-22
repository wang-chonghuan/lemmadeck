import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-threeanswers-affected-repair-12')
const oldFile = path.join(tmp, 'n32-nineanswer-draft-and-review-inputs-11/answer-keys.json')
const reviewFile = path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/report.md')
assert.equal(hash(oldFile), '2e9f43b12a3aac9d0b9c7dd439e1988fb93ef432727baf8e38ce8f50e8e50f07')
assert.equal(hash(reviewFile), '89251af2153a316cbb3855f77fa34fbe814828f4febaf762707197e71b833a85')
fs.mkdirSync(own)
const before = read(oldFile)
const after = structuredClone(before)
const find = exercise => after.answers.find(answer => answer.exercise === exercise)
find('437').displayAnswer = String.raw`把锐角的顶点记作 $V$，两条实际边射线记作 $r$、$s$，它们的支撑直线记作 $R$、$S$。题中的直线 $l$ 垂直于第一边，垂足 $P$ 在实际射线 $r$ 上。若 $P=V$，则 $l$ 与第二边相交于顶点。
设 $P\ne V$。因为两边夹角是锐角，$S$ 是 $R$ 的斜线；由本课推论 2，垂线 $l$ 与支撑直线 $S$ 相交，设交点为 $X$。
还要证明 $X$ 在实际射线 $s$ 上。在 $V$ 作直线 $t\perp R$。直线 $t$ 和 $l$ 垂直于同一直线，且垂足不同，故由第 31 小节的结论，它们是不同的平行直线。锐角的第二边 $s$ 除顶点外，位于直线 $t$ 的含 $P$ 半平面内；$S$ 的反向射线则在另一半平面内。直线 $l$ 与 $t$ 不相交而经过 $P$，所以它全部在含 $P$ 的半平面内。因而 $X$ 只能在实际射线 $s$ 上。
若垂足只在第一边的反向延长线上，推论 2 仍保证两条支撑直线相交，但不能把这个交点说成角的实际边上的点。`;
find('438').displayAnswer = String.raw`以下按题面顺序编号为 1 至 10，$\hat{n}$ 表示图中编号为 $n$ 的角的度数。只为叙述证明，把割线 $c$ 与上方直线 $a$、下方直线 $b$ 的交点分别记作 $P$、$Q$，把 $PQ$ 的中点记作 $M$；这些不是给题图增添的标注。
关于 $M$ 的中心对称把 $P$ 映到 $Q$。根据定理 39，直线 $a$ 的像经过 $Q$ 并与 $a$ 平行；由平行公理，这条像直线就是 $b$。同理，$b$ 映到 $a$。直线 $c$ 经过中心 $M$，映到自身。中心对称保持角的度数并把两边射线同时反向，所以图中的对应角对为 $(1,3)$、$(2,4)$、$(5,8)$、$(6,7)$。再用同一交点处的对顶角相等、邻补角之和为 $180^\circ$，即可逐项证明；这里没有预先使用同位角定理。

1. $\hat{1}=\hat{3}$：上述中心对称直接把角 1 映到角 3，故它们相等。这是一对外错角。

2. $\hat{1}=\hat{8}$：由第 1 项，$\hat{1}=\hat{3}$；下交点的角 3 与角 8 是对顶角，故 $\hat{3}=\hat{8}$。于是 $\hat{1}=\hat{8}$。

3. $\hat{6}=\hat{7}$：中心对称直接把角 6 映到角 7，故它们相等。这是一对外错角。

4. $\hat{3}=\hat{5}$：由第 1 项，$\hat{3}=\hat{1}$；上交点的角 1 与角 5 是对顶角，故 $\hat{1}=\hat{5}$。于是 $\hat{3}=\hat{5}$。

5. $\hat{4}=\hat{6}$：下交点的角 4 与角 7 是对顶角，故 $\hat{4}=\hat{7}$；由第 3 项，$\hat{7}=\hat{6}$。于是 $\hat{4}=\hat{6}$。

6. $\hat{7}=\hat{2}$：由第 3 项，$\hat{7}=\hat{6}$；上交点的角 6 与角 2 是对顶角，故 $\hat{6}=\hat{2}$。于是 $\hat{7}=\hat{2}$。

7. $\hat{5}=\hat{8}$：中心对称直接把角 5 映到角 8，故它们相等。这是一对内错角。

8. $\hat{2}=\hat{4}$：中心对称直接把角 2 映到角 4，故它们相等。这是一对内错角。

9. $\hat{2}+\hat{8}=180^\circ$：上交点的角 2 与角 1 共用一边，另外两边是割线 $c$ 的相反射线，故 $\hat{2}+\hat{1}=180^\circ$。由第 2 项，$\hat{1}=\hat{8}$，代入即得结论。角 2 与角 8 是同旁内角，位于不同交点，本身不是邻补角。

10. $\hat{7}+\hat{1}=180^\circ$：由第 6 项，$\hat{7}=\hat{2}$；再用上交点处的 $\hat{2}+\hat{1}=180^\circ$，即得结论。角 7 与角 1 都在两平行线外、割线同侧，是同旁外角，本身不是邻补角。

教学脚注：角 1 与角 8、角 7 与角 2 是题目脚注所指的同位角；另外两对是角 5 与角 3、角 6 与角 4。同位角位于两个交点的相同相对位置。角 2 与角 4、角 8 与角 5 是题目脚注所指的内错角，位于两线之间、割线两侧。对顶角必须在同一个交点：上交点为角 1 与角 5、角 2 与角 6，下交点为角 8 与角 3、角 7 与角 4。邻补角同样必须在同一交点，共用一边而另外两边为相反射线。以上十项通过中心对称及局部角关系推出所需的相等或互补结论；不能反过来把待证的平行线角关系当作前提，也不能仅凭角弧样式或图形外观证明。`;
find('438').notes += ' Original independent review rejected all ten proof dependencies, despite correct conclusions. This revision uses midpoint central symmetry, parallel uniqueness and local angle facts; original author FIRST and sanity remain historical, not repaired-proof approval.'
find('440').displayAnswer = String.raw`先从本课的结论推出所需性质，不直接引用平行四边形性质。取对角线 $AC$ 的中点 $M$，作关于 $M$ 的中心对称，它把 $A$ 映到 $C$。根据定理 39 和平行公理的唯一性，直线 $AB$ 映到经过 $C$ 且平行于 $AB$ 的直线 $CD$，直线 $AD$ 映到直线 $CB$；所以这两条直线的交点 $B$ 映到交点 $D$。
中心对称保持距离和角的度数，因此 $|AB|=|CD|$、$|BC|=|DA|$，且 $\widehat A=\widehat C$、$\widehat B=\widehat D$。再取 $AD\parallel BC$，以 $AB$ 为割线，按第 438 题已由中心对称证明的同旁内角互补关系，得 $\widehat A+\widehat B=180^\circ$。
由已知 $\widehat A=30^\circ$、$|AB|=2\mathrm{cm}$、$|BC|=4\mathrm{cm}$，得
$\widehat A=30^\circ$，$\widehat B=150^\circ$，$\widehat C=30^\circ$，$\widehat D=150^\circ$；
$|AB|=2\mathrm{cm}$，$|BC|=4\mathrm{cm}$，$|CD|=2\mathrm{cm}$，$|DA|=4\mathrm{cm}$。`;
find('440').grading = 'auto'
find('440').parts = [
  { label: '角 A（度）', judge: 'numeric', expected: ['30'] },
  { label: '角 B（度）', judge: 'numeric', expected: ['150'] },
  { label: '角 C（度）', judge: 'numeric', expected: ['30'] },
  { label: '角 D（度）', judge: 'numeric', expected: ['150'] },
  { label: '边 AB（cm）', judge: 'numeric', expected: ['2'] },
  { label: '边 BC（cm）', judge: 'numeric', expected: ['4'] },
  { label: '边 CD（cm）', judge: 'numeric', expected: ['2'] },
  { label: '边 DA（cm）', judge: 'numeric', expected: ['4'] },
]
for (const answer of before.answers)
  if (!['437', '438', '440'].includes(answer.exercise))
    assert.deepEqual(after.answers.find(item => item.exercise === answer.exercise), answer)
const keysFile = path.join(own, 'answer-keys.json')
save(keysFile, after)
const numericFile = path.join(own, '440-numeric-only.json')
save(numericFile, { answers: [find('440')] })
const argv = ['node', '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs', numericFile]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(own, `440-numeric.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
}
const receiptFile = path.join(own, '440-numeric.execution.json')
save(receiptFile, {
  cwd: repo, argv, startedAt, endedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, streams,
})
assert.equal(result.status, 0)
assert.equal(JSON.parse(result.stdout).checked, 8)
const record = {
  status: 'N32_THREE_AFFECTED_ANSWERS_REPAIRED_AUTHOR_ONLY',
  before: bind(oldFile), after: bind(keysFile), review: bind(reviewFile),
  changedExercises: ['437', '438', '440'], unchangedPASSExercises: ['432', '433', '434', '435', '436', '439'],
  perExerciseRevisionsUsed: { 437: 1, 438: 1, 440: 1 },
  independentAffectedReviewPending: true,
  numeric440: { checked: 8, receipt: bind(receiptFile), status: 'pass', notProofApproval: true },
  originalFIRSTsFailuresSanityAndImageCountersPreserved: true,
  noOldSanityReplay: true, noFullNineFinalizer: true,
  modernTextLabelsUnchangedPendingNormalFinalization: true,
  figureGeometryAndContextUnchanged: true, parentImageLoads: 0,
  wholeLessonApproved: false, published: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const references = [oldFile, reviewFile, keysFile, numericFile, receiptFile, recordFile,
  path.join(tmp, 'repair-n32-threeanswers-12.mjs'),
  ...Object.values(streams).map(item => item.path)].map(bind)
console.log(JSON.stringify(retainCurrent6g(
  'evidence/stemrobin188-6g-n32/threeanswers-affected-repair12', references,
  ['evidence/stemrobin188-6g-n32/independent-nineanswers-text-207208-review12/retention.json'],
  record,
)))
