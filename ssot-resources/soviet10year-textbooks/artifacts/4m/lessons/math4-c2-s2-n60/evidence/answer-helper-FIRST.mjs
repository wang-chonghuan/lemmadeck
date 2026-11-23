import assert from 'node:assert/strict';
import fs from 'node:fs';

const id = 'math4-c2-s2-n60';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/4m';
const output = `${root}/lessons/${id}/evidence/answer-draft.json`;
assert.ok(!fs.existsSync(output));
const numeric = (label, expected, unit) => ({
  label, judge: 'numeric', expected: [expected], ...(unit ? { unit } : {}),
});
const answer = (exercise, displayAnswer, parts, notes) => ({
  exercise: String(exercise), source: 'derived',
  grading: parts ? 'auto' : 'ungraded', displayAnswer, parts: parts ?? [],
  ...(notes ? { notes } : {}),
});
const answers = [
  answer(1009,
    '$5<5.38<6$，近似于$5$；$82<82.71<83$，近似于$83$；'
    + '$121<121.3<122$，近似于$121$。'
    + '分别比较到两个相邻自然数的距离，较近的一端就是所求近似值。',
    [['5.38', '5', '6', '5'], ['82.71', '82', '83', '83'], ['121.3', '121', '122', '121']]
      .flatMap(([input, low, high, nearest]) => [
        numeric(`${input}的较小相邻自然数`, low),
        numeric(`${input}的较大相邻自然数`, high),
        numeric(`${input}的近似自然数`, nearest),
      ])),
  answer(1010,
    '依次为$7$，$12$，$0$，$9$，$300$，$7$。'
    + '直接看原数的十分位：$8.5$按五入处理，$300.499$的十分位是$4$，不进位。',
    ['7', '12', '0', '9', '300', '7'].map((value, index) => numeric(`第${index + 1}个小数`, value))),
  answer(1011,
    '1箱货物四舍五入到个位约重$16$公斤，到十分位约重$16.4$公斤。'
    + '分别看被舍去的第一位数字$3$和$8$。',
    [numeric('到个位', '16', '公斤'), numeric('到十分位', '16.4', '公斤')])),
  answer(1012,
    'a) 依次为$2.8$，$3.1$，$204.0$，$62.4$，$80.5$；'
    + 'b) 依次为$0.07$，$1.36$，$10.08$，$76.54$，$4.46$；'
    + 'c) 依次为$170$，$2090$，$440$，$300$。'
    + 'a) 中$203.962$进位到$204.0$，保留十分位；c) 是到十位，不是到十分位。',
    [['a', ['2.8', '3.1', '204.0', '62.4', '80.5']],
      ['b', ['0.07', '1.36', '10.08', '76.54', '4.46']],
      ['c', ['170', '2090', '440', '300']]]
      .flatMap(([label, values]) => values.map((value, index) => numeric(`${label}) 第${index + 1}个小数`, value)))),
  answer(1013,
    'a) 区域$I$在大圆内、小圆外，只能收看$A$台；'
    + 'b) 区域$III$在小圆内、大圆外，只能收看$B$台；'
    + 'c) 区域$II$在两圆内，可收看两台。两圆的交也是区域$II$。'
    + '区域$IV$在两圆外，不能收看任何一台。',
    null, '按图辨认区域和解释集合关系，保留四项完整回答，不用通用表达式判分代替图形位置判断。'),
  answer(1014,
    '$2.75\\cdot3=2.75+2.75+2.75=8.25$。'
    + '乘以自然数$3$表示三个相同加数相加：先得$5.50$，再加$2.75$得$8.25$。',
    null, '题目同时要求重复加法形式和数值。数值或表达式等价无法确认学生写出了三个相同加数，故不自动判分。'),
  answer(1015,
    '总份数是$3+5=8$。连衣裙占$\\frac{3}{8}$，罩衫占$\\frac{5}{8}$；'
    + '两者相加为$1$。',
    [numeric('连衣裙占比', '\\frac{3}{8}'), numeric('罩衫占比', '\\frac{5}{8}')])),
  answer(1016,
    '按从空池开始、匀速注水且无水流出的模型，'
    + '$6$小时是$360$分钟，$1$小时$25$分是$85$分钟，'
    + '水占游泳池的$\\frac{85}{360}=\\frac{17}{72}$。'
    + '若不采用这些模型条件，仅凭题中的两个时间不能唯一确定水量比例。',
    null, '原文没有明确初始水量或流量是否恒定，条件答案不硬判为无条件唯一数值。'),
  answer(1017,
    'a) 依次为$2$，$1$，$37$，$38$，$802$；'
    + 'b) 依次为$0.4$，$0.8$，$1.0$，$61.4$。'
    + '$0.9702$到十分位需要进位并保留$1.0$；$61.3501$直接看百分位$5$。',
    [['a', ['2', '1', '37', '38', '802']], ['b', ['0.4', '0.8', '1.0', '61.4']]]
      .flatMap(([label, values]) => values.map((value, index) => numeric(`${label}) 第${index + 1}个小数`, value)))),
  answer(1018,
    '取交点$O$，画直线$AC$，使$OA$和$OC$为相反射线。'
    + '用量角器画射线$OB$，令$\\angle AOB=155^\\circ$，'
    + '再反向延长为$OD$，得到直线$BD$。'
    + '其余三个角依次为$\\angle BOC=25^\\circ$、$\\angle COD=155^\\circ$、'
    + '$\\angle DOA=25^\\circ$。邻角和为$180^\\circ$，对顶角相等；'
    + '四角和为$360^\\circ$。',
    null, '要求实际作图及求其余角，数值列表不能证明作图完成；完整作法和三角结果均保留。'),
  answer(1019,
    '$37.3+21.7=59$，$59\\cdot13=767$，$767+8688=9455$，'
    + '$9455:31=305$，$305-196=109$，所以结果为$109$。',
    [numeric('结果', '109')]),
];
assert.equal(answers.length, 11);
assert.equal(answers.filter(item => item.grading === 'auto').length, 7);
assert.equal(answers.flatMap(item => item.parts).length, 43);
fs.writeFileSync(output, JSON.stringify({
  schema: 'ld-s10y-answer/lesson-answers@1',
  book: '4m', lesson: id, edition: 'modern-us-neutral', status: 'draft',
  authorEvidence: `lessons/${id}/evidence/author-solutions.md`,
  answers,
}, null, 2) + '\n');
console.log(JSON.stringify({ answers: answers.length, auto: 7, ungraded: 4, numericParts: 43 }));
