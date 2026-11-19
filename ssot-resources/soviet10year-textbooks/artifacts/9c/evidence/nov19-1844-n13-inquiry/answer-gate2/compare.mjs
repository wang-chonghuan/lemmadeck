import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const output = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(output, '../../..');
const retained = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-inquiry';
const modern = 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n13';
const inputs = [
  ['entry', '.intentfold/readme.md', 4096, 'f8dd29bc96c49c08a668dfece3de3fee85dab43f49460ecf3fffe0cb605b1e76'],
  ['engineering', '.intentfold/charter/engineering.md', 14249, 'd4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c'],
  ['operations', '.intentfold/charter/operations.md', 14439, 'dd990c52a21b6ad8d4ae414bf939d20133b26fdaef6757885a94c4d257a41ee9'],
  ['intentfold_routing_only', '/Users/yong/.agents/skills/intentfold/SKILL.md', 33572, 'ccc1c9e4ba4d5f897df568eaa87283d5789e91ec8f1cc3cf171bcc6ed57f201c'],
  ['answer_skill', '.claude/skills/ld-s10y-answer/SKILL.md', 13701, 'a825db87672032d77aef61e5ae20098a2334ef6cfe7c12d2d1d90c110c955857'],
  ['gate2', '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md', 1769, '9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9'],
  ['first_findings', `${retained}/source-first/FIRST-findings.md`, 20249, 'c9e108db6e2a50bc1e8d4b667b19f9f21ae416e2637605668ac7905d6d7c4a15'],
  ['first_expectations', `${retained}/source-first/FIRST-expectations.json`, 3697, 'af9c91f4676127ff9546f2d20f79c8fc35353e1b61ccab6017c4ffe313e41d6e'],
  ['first_freeze', `${retained}/source-first/FIRST-freeze.json`, 4131, '261cc51aa91c8d6f0e0b759fc6c70ea0fe8e0ec05f0e718c0f53b7317ca61d38'],
  ['content_verdict', `${retained}/content-review/verdict.json`, 11523, 'd266885ed31e7b8812a0f411d229982f7f8cf44a7ec0b05e46baeefc736bd8ba'],
  ['content_review', `${retained}/content-review/REVIEW.md`, 11362, '327514c715be62394aa0c7dd7171d7d7b8f6a86a31e7cad3250e546c009f8404'],
  ['exercises', `${modern}/exercises.json`, 2192, 'a3f5d23e241828e28a4c2b3f21384687d780dfea78426aee47eee8dc04662329'],
  ['answer', `${modern}/answer-keys.json`, 1967, '22ac2f8548b729a875642e766d698ae647fbefe05c1057a8d05c2dcc3f2ad934'],
  ['official_template', '.tmp/ld-s10y-answer/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/answer-keys.template.json', 582, '9c8edacdcbf116c1a98aa0045440d81aae02e12c8d3df131e5443a05e25d3557'],
  ['binding_receipt', '.tmp/stemrobin-184-resume/n13-answer-bound.receipt.json', 1360, 'e6c7f754fc82659375d186aa7607ba49a85ee20bbebd5d151c5eccbf5318687c'],
];
const checks = [];
const bindings = [];
const data = {};
function check(name, ok, detail, failure = 'REVISE') {
  checks.push({ name, status: ok ? 'PASS' : failure, detail });
}
for (const [role, relative, bytes, sha256] of inputs) {
  try {
    const buffer = fs.readFileSync(path.resolve(root, relative));
    const actual = { role, path: path.resolve(root, relative), bytes: buffer.length,
      sha256: crypto.createHash('sha256').update(buffer).digest('hex') };
    bindings.push(actual);
    check(`binding:${role}`, actual.bytes === bytes && actual.sha256 === sha256,
      { expected: { bytes, sha256 }, actual }, 'BLOCKED');
    data[role] = relative.endsWith('.json') ? JSON.parse(buffer.toString()) : buffer.toString();
  } catch (error) {
    check(`read:${role}`, false, String(error), 'BLOCKED');
  }
}
try {
  const e = data.exercises, k = data.answer, t = data.official_template;
  const f = data.first_expectations, r = data.binding_receipt, v = data.content_verdict;
  const x = e.exercises[0], a = k.answers[0], template = t.answers[0];
  for (const role of ['first_findings', 'first_expectations']) {
    const frozen = data.first_freeze.evidence_files.find(item => item.file === path.basename(inputs.find(row => row[0] === role)[1]));
    const actual = bindings.find(item => item.role === role);
    check(`retained-freeze:${role}`, frozen.bytes === actual.bytes && frozen.sha256 === actual.sha256,
      'Identity of retained approval only; no FIRST checks replayed.', 'BLOCKED');
  }
  check('prior-content-review-reference', v.textual_verdict === 'PASS_TEXT_ONLY' &&
    v.content_report.failed_checks === 0 && v.first_tests_replayed === false,
  'Reused textual verdict, not whole-lesson or figure approval.', 'BLOCKED');
  for (const role of ['official_template', 'exercises', 'answer']) {
    const actual = bindings.find(item => item.role === role);
    const expected = role === 'answer' ? r.output : r.inputs.find(item => path.resolve(root, item.path) === actual.path);
    check(`official-receipt:${role}`, expected?.bytes === actual.bytes && expected?.sha256 === actual.sha256,
      'Current file matches pre-Gate2 binding receipt.', 'BLOCKED');
  }
  check('lesson-and-edition', [e, k, t].every(item => item.lesson === 'ana9-c3-s1-n13' && item.edition === 'modern-us-neutral') &&
    k.book === '9c' && t.book === '9c' && k.status === 'draft', 'Current n13 key remains draft.');
  check('one-exercise-one-key', e.count === 1 && e.exercises.length === 1 && k.answers.length === 1 &&
    t.answers.length === 1 && x.number === '115' && x.source_number === '115' &&
    a.exercise === '115' && template.exercise === '115' && x.group_id === 'g1' &&
    JSON.stringify(x.pages) === '["p0057#5"]', 'Lesson-local identity and no duplicate/missing numbered key.');
  check('official-prompt', template.prompt === x.text && x.lines.join('\n') === x.text,
    'The actual modern explanation request matches official preparation.');
  check('figure-free', JSON.stringify(template.figureEvidence) === '[]' &&
    JSON.stringify(x.figure_refs) === '[]' && JSON.stringify(x.figures) === '[]',
    'figureEvidence=[]; no image or figure-review dependency claimed.');
  check('derived-without-bookRaw', a.source === 'derived' && template.source === 'derived' &&
    !Object.hasOwn(a, 'bookRaw') && !Object.hasOwn(template, 'bookRaw'),
    'No bookRaw matched; no whole-book answer omission inferred.');
  check('ungraded-empty-parts', a.grading === 'ungraded' && JSON.stringify(a.parts) === '[]' &&
    !Object.hasOwn(a, 'expected'), 'Full written explanations remain ungraded; MathLive NA, attempts0.');
  check('historical-entities', JSON.stringify(a.historical_entities) === '[]' &&
    JSON.stringify(template.historical_entities) === '[]', 'No modern persons/units/cultural substitution needed.');
  const segments = a.displayAnswer.split('\n\n');
  check('four-labeled-explanations-and-conclusion', segments.length === 5 &&
    segments.slice(0, 4).every((text, i) => text.startsWith(`${f.exercise115[i].part}) `)) &&
    segments[4].includes('\u540c\u4e00\u4e2a\u4f59\u6570\u4f1a\u51b3\u5b9a\u76f8\u540c\u7684\u4e0b\u4e00\u4f4d\u548c\u4e0b\u4e00\u4f59\u6570'),
    'All requested representations and explanatory reasons are retained in displayAnswer.');
  const proseFragments = [
    ['\u6574\u6570\u90e8\u5206\u662f\u4e8c', '\u521d\u59cb\u4f59\u6570\u662f\u4e00', '\u4ecd\u5f97\u4f59\u6570\u4e00', '\u5c0f\u6570\u4f4d\u4e00\u76f4\u662f\u4e09'],
    ['\u7b2c\u4e00\u4f4d\u662f\u4e03', '\u4f59\u6570\u4e8c\u5341', '\u5546\u516d', '\u53ea\u6709\u7b2c\u4e00\u4f4d\u4e0d\u5c5e\u4e8e\u5faa\u73af\u8282'],
    ['\u4e03\u5206\u4e4b\u56db', '4\\to5\\to1\\to3\\to2\\to6\\to4', '\u4e94\u3001\u4e03\u3001\u4e00\u3001\u56db\u3001\u4e8c\u3001\u516b', '\u8fd9\u516d\u4f4d'],
    ['4\\to7\\to4', '\u4e09\u3001\u516d\u4e24\u4e2a\u6570\u5b57', '\u56de\u5230\u521d\u59cb\u4f59\u6570', '\u5faa\u73af\u8282\u662f\u4e09\u516d'],
  ];
  for (let i = 0; i < 4; i++) {
    const approved = f.exercise115[i], segment = segments[i] ?? '';
    const fraction = `${approved.numerator.startsWith('-') ? '-' : ''}\\frac{${approved.numerator.replace('-', '')}}{${approved.denominator}}`;
    const integer = approved.floor_integer.startsWith('-') ? `\\overline{${approved.floor_integer.slice(1)}}` : approved.floor_integer;
    check(`115${approved.part}:source-modern-input`, x.lines[i + 1].includes(`${approved.part}) $${fraction}$`) &&
      x.source_text.includes(`${approved.source_label}) $${fraction}$`),
      'Labels and signed input copied from frozen FIRST expectations; no new source solve.');
    check(`115${approved.part}:approved-decimal-identity`, segment.includes(`${fraction}=${integer}.${approved.first_digits.slice(0, 6)}`) &&
      segment.includes(`=${integer}.${approved.prefix}(${approved.period})$`),
      { reused: approved, arithmetic_executed: false });
    check(`115${approved.part}:approved-remainder-and-reason`, proseFragments[i].every(fragment => segment.includes(fragment)),
      'Lexical coverage compared to FIRST findings, not arithmetic or editor verification.');
    if (i >= 2) check(`115${approved.part}:integer-only-bar`, segment.includes(`${fraction}=${approved.floor_integer}+\\frac{4}{${approved.denominator}}`) &&
      segment.match(/\\overline\{[^}]*\}/g)?.every(bar => bar === `\\overline{${approved.floor_integer.slice(1)}}`),
      'Only integer1/integer3 is barred; nonnegative fractional tail follows approved decomposition.');
  }
  check('corrected-Chinese-reading', a.displayAnswer.includes('\u4e03\u5206\u4e4b\u56db') &&
    !a.displayAnswer.includes('\u56db\u5206\u4e4b\u4e03'), 'Current corrected wording only; earlier candidate not read.');
} catch (error) {
  check('comparison-exception', false, String(error), 'BLOCKED');
}
const status = checks.some(item => item.status === 'BLOCKED') ? 'BLOCKED' :
  checks.some(item => item.status === 'REVISE') ? 'REVISE' : 'PASS';
console.log(JSON.stringify({ phase: 'first-formal-gate2-answer-comparison-only',
  ticket: 'STEMROBIN-184 B', lesson: 'ana9-c3-s1-n13', status,
  inputs: bindings, checks, failed_checks: checks.filter(item => item.status !== 'PASS'),
  mathematical_replay: false, editor_exercised: false, mathlive: 'NA', mathlive_attempts: 0,
  image_usage: 0, stop: 'completed for parent intake BEFORE answer finalizer' }, null, 2));
process.exitCode = status === 'PASS' ? 0 : 1;
