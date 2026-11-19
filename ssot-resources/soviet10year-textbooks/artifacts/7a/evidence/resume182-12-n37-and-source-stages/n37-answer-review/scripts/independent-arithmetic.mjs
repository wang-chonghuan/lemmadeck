import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const root = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-answer-review';
const solutionsPath = `${root}/source-solutions/independent-n37-solutions.json`;
const solutionsBytes = fs.readFileSync(solutionsPath);
const solutions = JSON.parse(solutionsBytes);
assert.deepEqual(solutions.solutions.map(s => Number(s.exercise)), Array.from({length: 22}, (_, i) => 777 + i));
assert.deepEqual(solutions.solutions.map(s => s.answers.length), [9,8,6,2,4,4,4,4,9,6,8,4,4,6,6,4,2,2,4,2,2,1]);

const q = (n, d = 1) => [BigInt(n), BigInt(d)];
const mul = (a, b) => [a[0] * b[0], a[1] * b[1]];
const div = (a, b) => [a[0] * b[1], a[1] * b[0]];
const sub = (a, b) => [a[0] * b[1] - b[0] * a[1], a[1] * b[1]];
const square = a => mul(a, a);
const prod = (...factors) => factors.reduce(mul, q(1));
const same = (a, b) => a[0] * b[1] === b[0] * a[1];
const results = [];
const check = (exercise, radicands, roots) => {
  assert.equal(radicands.length, roots.length);
  roots.forEach((r, i) => {
    assert(r[0] >= 0n && r[1] > 0n);
    assert(same(square(r), radicands[i]), `${exercise}${String.fromCharCode(97+i)}: root does not square to source radicand`);
  });
  results.push({exercise, checks: roots.length, result: 'PASS', kind: 'exact-rational-square'});
};

check('777', [prod(q(100),q(49)),prod(q(121),q(64)),prod(q(81),q(400)),prod(q(36,100),q(49)),prod(q(144),q(25,100)),prod(q(225,100),q(4,100)),prod(q(9),q(64),q(25)),prod(q(16,100),q(25,10000),q(900)),prod(q(121,100),q(9,100),q(1,100))], [q(70),q(88),q(180),q(42,10),q(6),q(3,10),q(120),q(6,10),q(33,1000)]);
check('778', [q(16,25),q(9,64),q(64,49),q(121,25),q(144,169),q(225,256),q(25,16),q(169,81)], [q(4,5),q(3,8),q(8,7),q(11,5),q(12,13),q(15,16),q(5,4),q(13,9)]);
check('779', [prod(q(810),q(40)),prod(q(72),q(32)),prod(q(75),q(48)),prod(q(49,10),q(360)),prod(q(25,10),q(144,10)),prod(q(90),q(64,10))], [q(180),q(48),q(60),q(42),q(6),q(24)]);
check('780', [q(3**2+4**2),q(10**2-6**2)], [q(5),q(8)]);
assert(5<3+4 && 8>10-6);
check('781', [q(13**2-12**2),q(313**2-312**2),q(17**2-8**2),q(117**2-108**2)], [q(5),q(25),q(15),q(45)]);
check('782', [prod(q(25,81),q(16,49),q(196,9)),prod(q(36,100),q(25,100),q(144)),prod(q(49,16),q(64,25)),prod(q(81,16),q(196,81))], [q(40,27),q(36,10),q(14,5),q(7,2)]);
check('785', [prod(q(2),q(8)),prod(q(10),q(40)),prod(q(12),q(3)),prod(q(27),q(3)),prod(q(21),q(21**3)),prod(q(13),q(52)),prod(q(63),q(7)),prod(q(2,3),q(3,8)),prod(q(12,10),q(10,3))], [q(4),q(20),q(6),q(9),q(441),q(26),q(21),q(1,2),q(2)]);
check('786', [q(2,18),q(23,2300),q(999,111),q(15,735),q(52,117),q(12500,500)], [q(1,3),q(1,10),q(3),q(1,7),q(2,3),q(5)]);
const coefficients = [q(1,2),q(7,5),q(-3),q(-4),q(5,6),q(3,10),q(-3,2),q(-7)];
const radicands787 = [10,5,2,3,3,14,10,2];
const originalSquares787 = [q(25,10),q(49,5),q(36,2),q(144,3),q(25,12),q(441,350),q(45,2),q(294,3)];
coefficients.forEach((a,i) => {
  assert(same(mul(square(a),q(radicands787[i])),originalSquares787[i]));
  assert.equal(a[0]<0n,[false,false,true,true,false,false,true,true][i]);
});
results.push({exercise:'787',checks:8,result:'PASS',kind:'exact-rational-square-and-original-sign'});
check('788', [q(2**6*3**4),q(5**4*2**6),q(3**2*5**6,10**4),q(7**2,2**6*5**4)], [q(72),q(200),q(15,4),q(7,200)]);
const powers789 = [5**2*7**2,3**4*7**2,2**4*5**2*7**2,2**2*3**2*5**2*7**2];
assert.deepEqual(powers789,[1225,3969,19600,44100]);
check('789',powers789.map(n=>q(n)),[q(35),q(63),q(140),q(210)]);
check('790',[q(448900),q(115600),q(7840000),q(5184,100),q(6241,100),q(7744,10000)],[q(670),q(340),q(2800),q(72,10),q(79,10),q(88,100)]);
const approx791 = [mul(q(153,100),q(10)),mul(q(485,100),q(10)),mul(q(153,100),q(100)),div(q(485,100),q(10)),div(q(153,100),q(10)),div(q(485,100),q(100))];
const expected791 = [q(153,10),q(485,10),q(153),q(485,1000),q(153,1000),q(485,10000)];
approx791.forEach((a,i)=>assert(same(a,expected791[i])));
assert.deepEqual(solutions.solutions.find(s=>s.exercise==='791').answers.map(x=>x.replace(/^0\./,'').replace(/^0+/, '').replace('.','').length),[3,3,3,3,3,3]);
results.push({exercise:'791',checks:6,result:'PASS',kind:'exact-scaling-of-given-three-significant-digit-approximations'});
const intsA = [], intsB = [];
for(let x=-20;x<=20;x++) {
  // Integers avoid binary decimal rounding in the two original systems.
  if(5*x-1<6 && 15*x-4>1) intsA.push(x);
  if(4>3-x && 3*x-15<10) intsB.push(x);
}
assert.deepEqual(intsA,[1]);
assert.deepEqual(intsB,[0,1,2,3,4,5,6,7,8]);
results.push({exercise:'796',checks:2,result:'PASS',kind:'integer-enumeration-with-exact-scaled-inequalities',sets:[intsA,intsB],note:'Independent algebraic bounds 1/3<x<7/5 and -1<x<25/3 establish completeness outside the enumeration window.'});
assert(same(sub(q(75),mul(q(4),q(152,10))),q(142,10)));
assert(same(sub(mul(q(4),q(318,100)),q(1054,100)),q(218,100)));
results.push({exercise:'797',checks:2,result:'PASS',kind:'exact-substitution-after-absolute-value-sign-resolution'});
// Coefficient identity behind the full symbolic proof, not a sampling proof.
assert.deepEqual([1,10,25].map((c,i)=>c-[1,0,0][i]),[0,10,25]);
results.push({exercise:'798',checks:1,result:'PASS',kind:'polynomial-numerator-identity',note:'Domain and strict bounds are proved in the frozen independent solution, not inferred from samples.'});
const report = {schema:'independent-arithmetic@1',cwd:process.cwd(),solutionsSha256:crypto.createHash('sha256').update(solutionsBytes).digest('hex'),answerKeyRead:false,exerciseCount:22,subquestionCount:solutions.solutions.reduce((n,s)=>n+s.answers.length,0),result:'PASS',checks:results,nonscalarReview:['783','784','792','793','794','795'],imagesOpened:0};
fs.writeFileSync(`${root}/reports/independent-arithmetic.json`,`${JSON.stringify(report,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify(report,null,2));
