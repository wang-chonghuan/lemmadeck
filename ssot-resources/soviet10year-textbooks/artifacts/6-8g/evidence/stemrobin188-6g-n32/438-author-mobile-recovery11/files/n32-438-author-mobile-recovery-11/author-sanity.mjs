import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = path.dirname(import.meta.filename);
const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const require = createRequire(import.meta.url);
const katex = require(path.join(repo, '.claude/skills/ld-s10y-lesson/node_modules/katex'));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const first = path.join(root, 'FIRST.md');
assert.equal(sha(first), '0824fc6a2ce2357244a26237f41edb5a5c5b2cb583077d8df5a5212c8b71f921');
assert.equal(fs.statSync(first).mode & 0o777, 0o444);

const document = read(path.join(root, 'answer-keys.json'));
assert.equal(document.schema, 'ld-s10y-answer/lesson-answers@1');
assert.equal(document.book, '6-8g');
assert.equal(document.lesson, 'geo68-c3-s1-n32');
assert.equal(document.edition, 'modern-us-neutral');
assert.equal(document.status, 'draft');
assert.equal(document.answers.length, 1);
const answer = document.answers[0];
assert.equal(answer.exercise, '438');
assert.equal(answer.grading, 'ungraded');
assert.equal(answer.source, 'derived');
assert.deepEqual(answer.parts, []);
assert.equal(answer.bookRaw, undefined);

const sourcePath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32/exercises.json');
const modernPath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10/exercises.template.json');
const source = read(sourcePath).exercises.filter(e => e.number === '438');
const modern = read(modernPath).exercises.filter(e => e.number === '438');
assert.equal(source.length, 1);
assert.equal(modern.length, 1);
const claims = text => Array.from(text.matchAll(/\$([^$]*\\hat\{[1-8]\}[^$]*)\$/g), m => m[1].replace(/\s/g, ''));
const targets = [
  '\\hat{1}=\\hat{3}', '\\hat{1}=\\hat{8}', '\\hat{6}=\\hat{7}',
  '\\hat{3}=\\hat{5}', '\\hat{4}=\\hat{6}', '\\hat{7}=\\hat{2}',
  '\\hat{5}=\\hat{8}', '\\hat{2}=\\hat{4}',
  '\\hat{2}+\\hat{8}=180^\\circ', '\\hat{7}+\\hat{1}=180^\\circ',
];
assert.deepEqual(claims(source[0].text), targets);
assert.deepEqual(claims(modern[0].text), targets);
assert.deepEqual(modern[0].numeric_changes, []);
assert.deepEqual(modern[0].figure_refs, ['fig-208']);

// Fixed source-pixel sectors supply symbolic angles, not values sampled from a render.
// alpha is arbitrary: one coefficient pair represents k*alpha + constant degrees.
const sectors = {
  1: { vertex: 'U', position: 'NE', interior: false, side: 'R', value: [1, 0] },
  2: { vertex: 'U', position: 'SE', interior: true, side: 'R', value: [-1, 180] },
  5: { vertex: 'U', position: 'SW', interior: true, side: 'L', value: [1, 0] },
  6: { vertex: 'U', position: 'NW', interior: false, side: 'L', value: [-1, 180] },
  8: { vertex: 'V', position: 'NE', interior: true, side: 'R', value: [1, 0] },
  7: { vertex: 'V', position: 'SE', interior: false, side: 'R', value: [-1, 180] },
  3: { vertex: 'V', position: 'SW', interior: false, side: 'L', value: [1, 0] },
  4: { vertex: 'V', position: 'NW', interior: true, side: 'L', value: [-1, 180] },
};
const opposite = { NE: 'SW', SW: 'NE', NW: 'SE', SE: 'NW' };
const relation = (kind, a, b) => {
  const x = sectors[a], y = sectors[b];
  if (kind === 'corresponding') return x.vertex !== y.vertex && x.position === y.position;
  if (kind === 'vertical') return x.vertex === y.vertex && opposite[x.position] === y.position;
  if (kind === 'adjacent') return x.vertex === y.vertex && x.position !== y.position && opposite[x.position] !== y.position;
  if (kind === 'alternate-interior') return x.interior && y.interior && x.vertex !== y.vertex && x.side !== y.side;
  if (kind === 'alternate-exterior') return !x.interior && !y.interior && x.vertex !== y.vertex && x.side !== y.side;
  if (kind === 'same-side-interior') return x.interior && y.interior && x.vertex !== y.vertex && x.side === y.side;
  if (kind === 'same-side-exterior') return !x.interior && !y.interior && x.vertex !== y.vertex && x.side === y.side;
  throw new Error(`Unknown relation: ${kind}`);
};
const evalTerm = term => {
  if (term === '180^\\circ') return [0, 180];
  return term.split('+').reduce((sum, token) => {
    const match = /^\\hat\{([1-8])\}$/.exec(token);
    assert.ok(match, `Unsupported angle term ${token}`);
    const value = sectors[match[1]].value;
    return [sum[0] + value[0], sum[1] + value[1]];
  }, [0, 0]);
};
const identity = equation => {
  const terms = equation.split('=');
  assert.ok(terms.length >= 2, `Not an identity: ${equation}`);
  const value = evalTerm(terms[0]);
  for (const term of terms.slice(1)) assert.deepEqual(evalTerm(term), value, equation);
};
const proofSteps = [
  [['corresponding', 1, 8], ['vertical', 8, 3], ['alternate-exterior', 1, 3]],
  [['corresponding', 1, 8]],
  [['corresponding', 6, 4], ['vertical', 4, 7], ['alternate-exterior', 6, 7]],
  [['corresponding', 3, 5]],
  [['corresponding', 4, 6]],
  [['corresponding', 7, 2]],
  [['vertical', 5, 1], ['corresponding', 1, 8], ['alternate-interior', 5, 8]],
  [['vertical', 2, 6], ['corresponding', 6, 4], ['alternate-interior', 2, 4]],
  [['adjacent', 2, 1], ['corresponding', 1, 8], ['same-side-interior', 2, 8]],
  [['adjacent', 7, 8], ['corresponding', 8, 1], ['same-side-exterior', 7, 1]],
];
const requiredProofFormulae = [
  ['\\hat{1}=\\hat{8}', '\\hat{8}=\\hat{3}'],
  ['\\hat{1}=\\hat{8}'],
  ['\\hat{6}=\\hat{4}', '\\hat{4}=\\hat{7}'],
  ['\\hat{3}=\\hat{5}'], ['\\hat{4}=\\hat{6}'], ['\\hat{7}=\\hat{2}'],
  ['\\hat{5}=\\hat{1}', '\\hat{1}=\\hat{8}'],
  ['\\hat{2}=\\hat{6}', '\\hat{6}=\\hat{4}'],
  ['\\hat{2}+\\hat{1}=180^\\circ', '\\hat{1}=\\hat{8}'],
  ['\\hat{7}+\\hat{8}=180^\\circ', '\\hat{8}=\\hat{1}'],
];
const sections = Array.from(answer.displayAnswer.matchAll(/(?:^|\n\n)(\d+)\. ([\s\S]*?)(?=\n\n(?:\d+\. |教学脚注：)|$)/g));
assert.deepEqual(sections.map(s => Number(s[1])), [1,2,3,4,5,6,7,8,9,10]);
const checkedParts = sections.map((section, i) => {
  const equations = claims(section[2]);
  assert.equal(equations[0], targets[i]);
  for (const equation of equations) identity(equation);
  for (const formula of requiredProofFormulae[i]) assert.ok(equations.includes(formula), `Missing proof ${i + 1}: ${formula}`);
  for (const [kind, a, b] of proofSteps[i]) {
    assert.ok(relation(kind, a, b), `Wrong ${kind} reference ${a},${b}`);
    const supplementary = kind === 'adjacent' || kind.startsWith('same-side-');
    const formula = supplementary ? `\\hat{${a}}+\\hat{${b}}=180^\\circ` : `\\hat{${a}}=\\hat{${b}}`;
    identity(formula);
  }
  return { subpart: i + 1, target: targets[i], identitiesChecked: equations, sourceRelationSteps: proofSteps[i], status: 'pass' };
});
const footnote = answer.displayAnswer.split('教学脚注：')[1];
assert.ok(footnote);
for (const [kind, a, b] of [
  ['corresponding',1,8], ['corresponding',7,2],
  ['alternate-interior',2,4], ['alternate-interior',8,5],
  ['vertical',1,5], ['vertical',2,6], ['vertical',8,3], ['vertical',7,4],
  ['same-side-interior',2,8], ['same-side-exterior',7,1],
]) {
  assert.ok(footnote.includes(`角 ${a} 与角 ${b}`));
  assert.ok(relation(kind,a,b));
}
assert.ok(sections[8][2].includes('是同旁内角'));
assert.ok(sections[9][2].includes('是同旁外角，不是同旁内角'));
const maths = Array.from(answer.displayAnswer.matchAll(/\$([^$]+)\$/g), m => m[1]);
assert.equal((answer.displayAnswer.match(/\$/g) ?? []).length, 2 * maths.length);
for (const expression of maths) {
  const html = katex.renderToString(expression, { throwOnError: true, strict: 'error', trust: false, output: 'htmlAndMathml' });
  assert.ok(html.includes('katex'));
  assert.ok(!html.includes('katex-error'));
}
const report = {
  schema: 'same188-6/scoped-author-math-katex@1',
  role: 'AUTHOR_ONLY',
  status: 'PASS_AUTHOR_ONLY',
  scope: { book: '6-8g', lesson: 'geo68-c3-s1-n32', exercises: ['438'], fullLessonFinalizer: false },
  method: 'Source-pixel sector inventory, symbolic affine angle identities valid for arbitrary alpha, actual proof-step references, all ten source/modern targets, and strict local KaTeX rendering of every display formula.',
  checkedParts,
  teachingFootnote: 'pass',
  grading: 'ungraded, empty parts, derived, draft',
  katex: { version: katex.version, formulaCount: maths.length, status: 'pass', packagePath: path.join(repo, '.claude/skills/ld-s10y-lesson/node_modules/katex') },
  bindings: [
    { path: first, sha256: sha(first), mode: '0444' },
    { path: sourcePath, sha256: sha(sourcePath) },
    { path: modernPath, sha256: sha(modernPath) },
    { path: path.join(root, 'answer-keys.json'), sha256: sha(path.join(root, 'answer-keys.json')) },
    { path: path.join(root, 'author-sanity.mjs'), sha256: sha(path.join(root, 'author-sanity.mjs')) },
  ],
  independentReview: 'NOT_CLAIMED',
  mobileDisplayOrWidthCheckExecuted: false,
  browserStarted: false,
  networkCalls: 0,
};
fs.writeFileSync(path.join(root, 'author-sanity.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(report, null, 2));
