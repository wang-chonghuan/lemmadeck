const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
const base = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13');
const own = path.join(base, 'n45-modern-review');
const lessonId = 'alg7-c4-s3-n45';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const mode = file => (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0');
const bindings = new Map();
const findings = [];
function check(condition, unit, issue) {
  if (!condition) findings.push({ unit, issue });
  return condition;
}
function bind(file, expected, origin) {
  const artifactRelative = file.startsWith('figures/') || file.startsWith('lessons/');
  const absolute = path.resolve(
    artifactRelative ? path.join(base, 'n45-source-stage/artifacts/7a') : root, file);
  const actual = hash(absolute);
  const entry = { path: absolute, sha256: actual, mode: mode(absolute) };
  if (expected) {
    entry.expectedSha256 = expected;
    entry.match = check(actual === expected, absolute, `Hash mismatch in ${origin}`);
  }
  bindings.set(absolute, { ...bindings.get(absolute), ...entry });
  return actual;
}
function bindRecords(value, origin) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || '')) {
    bind(value.path, value.sha256, origin);
  }
  for (const child of Object.values(value)) bindRecords(child, origin);
}
const docs = [
  'n45-source-stage/candidate-binding.json',
  'n45-adapt-work/prepared-binding.json',
  'n45-modern-author/final-binding.json',
  'n45-modern-author/freeze.json',
  'n45-modern-figure-author/FINAL/manifest.json'
];
for (const file of docs) {
  const absolute = path.join(base, file);
  bind(absolute);
  bindRecords(read(absolute), absolute);
}
const manifestFile = path.join(base, 'n45-modern-figure-author/FINAL/manifest.json');
check(hash(manifestFile) === '70e81bbfe83feb0968a420ee0fdcc687ab792057f5f159fccd0dcea36a9eb1ec',
  'manifest', 'Not the candidate explicitly designated by the user');

const rawDir = path.join(base, 'n45-source-stage/artifacts/7a/lessons', lessonId);
const preparedDir = path.join(base, 'n45-adapt-work/PREPARED', lessonId);
const finalDir = path.join(base, 'n45-modern-author/FINAL', lessonId);
const rawLesson = read(path.join(rawDir, 'lesson.json'));
const rawExercises = read(path.join(rawDir, 'exercises.json'));
const preparedLesson = read(path.join(preparedDir, 'lesson.template.json'));
const preparedExercises = read(path.join(preparedDir, 'exercises.template.json'));
const currentLesson = read(path.join(finalDir, 'lesson.template.json'));
const currentExercises = read(path.join(finalDir, 'exercises.template.json'));
const currentFigures = read(path.join(finalDir, 'figures.template.json'));
const flow = read(path.join(base, 'n45-modern-author/prose-flow-FINAL.stdout'));
const faithfulLessonKeys = ['id', 'card_id', 'number', 'title', 'printed_title',
  'start_page', 'start_printed', 'chapter', 'section', 'figures', 'exercise_count'];
for (const key of faithfulLessonKeys) {
  check(isDeepStrictEqual(currentLesson[key], rawLesson[key]), `lesson.${key}`, 'Metadata drift');
}
for (const [name, raw, prepared, current, rawFile] of [
  ['lesson', rawLesson, preparedLesson, currentLesson, 'lesson.json'],
  ['exercises', rawExercises, preparedExercises, currentExercises, 'exercises.json']
]) {
  check(isDeepStrictEqual(current.source, prepared.source), name, 'Prepared source binding changed');
  check(isDeepStrictEqual(current.source.data, raw), name, 'Embedded source differs from RAW');
  check(current.source.sha256 === hash(path.join(rawDir, rawFile)), name, 'RAW hash drift');
}
check(hash(path.join(finalDir, 'figures.template.json')) ===
  hash(path.join(preparedDir, 'figures.template.json')), 'figures', 'Prepared figure entries changed');
check(currentLesson.errata.length === 0, 'lesson', 'Unexpected mathematical correction');
check(rawLesson.prose.length === 19 && currentLesson.prose.length === 19,
  'lesson', 'Source-layer block completeness');
check(currentExercises.count === 19 && currentExercises.exercises.length === 19,
  'exercises', 'Original count is not 19');

const cyrillic = Object.fromEntries(
  ['\u0430', '\u0431', '\u0432', '\u0433', '\u0434', '\u0435', '\u0436', '\u0437', '\u0438', '\u043a']
    .map((letter, index) => [letter, String.fromCharCode(97 + index)])
);
const parts = text => text.split(/(\$[^$]*\$)/g);
const maths = text => parts(text).filter(chunk => chunk.startsWith('$'));
const numbers = text => parts(text).filter(chunk => !chunk.startsWith('$'))
  .flatMap(chunk => chunk.match(/\d+(?:\.\d+)?/g) || []);
function canonical(text, neutralize) {
  return parts(text).map(chunk => {
    if (chunk.startsWith('$')) return chunk;
    if (neutralize) chunk = chunk.replaceAll('\u5973\u6253\u5b57\u5458', '\u6253\u5b57\u5458');
    return chunk.replace(/[\u0430-\u044f]/g, letter => cyrillic[letter] || letter)
      .replace(/[\s.,\u3002\uFF0C\uFF1B;:\uFF1A?!\uFF1F\uFF01\u3001()\uFF08\uFF09]/g, '');
  }).join('');
}
const rows = [];
let mathSpans = 0;
let latinSubparts = 0;
function compareText(unit, source, prepared, current, neutralize = false) {
  const exactMath = isDeepStrictEqual(maths(source.text), maths(current.text));
  const exactNumbers = isDeepStrictEqual(numbers(source.text), numbers(current.text));
  const equivalentText = canonical(source.text, neutralize) === canonical(current.text, false);
  check(exactMath, unit, 'TeX span/sign/order drift');
  check(exactNumbers, unit, 'Nonmath numeric token drift');
  check(equivalentText, unit, 'Wording or conditions changed beyond allowed transformations');
  check(current.source_text === source.text && current.source_text === prepared.source_text,
    unit, 'Source text snapshot drift');
  check((current.numeric_changes || []).length === 0, unit, 'Unexpected numeric change declaration');
  check(!/[\u0400-\u04ff]/.test(current.text), unit, 'Cyrillic retained in modern text');
  mathSpans += maths(current.text).length;
  rows.push({ unit, mathSpans: maths(current.text).length, exactMath, exactNumbers, equivalentText });
}
rawLesson.prose.forEach((source, index) => {
  const current = currentLesson.prose[index];
  compareText(`prose[${index}]`, source, preparedLesson.prose[index], current);
  for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
    check(isDeepStrictEqual(current[key], source[key]), `prose[${index}].${key}`, 'Source binding drift');
  }
});
rawExercises.exercises.forEach((source, index) => {
  const current = currentExercises.exercises[index];
  check(source.number === String(873 + index), source.number, 'Noncontinuous original range');
  compareText(`exercise[${source.number}]`, source, preparedExercises.exercises[index],
    current, source.number === '885');
  for (const key of ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']) {
    check(isDeepStrictEqual(current[key], source[key]), `${source.number}.${key}`, 'Ownership/metadata drift');
  }
  const labels = [...current.text.matchAll(/^([a-z])\) /gm)].map(match => match[1]);
  const sourceLabels = [...source.text.matchAll(/([\u0430-\u044f])\)/g)].map(match => cyrillic[match[1]]);
  check(isDeepStrictEqual(labels, sourceLabels), source.number, 'Subpart omission or order drift');
  check(labels.every((label, n) => label === String.fromCharCode(97 + n)),
    source.number, 'Subparts are not in natural Latin order');
  check(current.lines.join('\n') === current.text, source.number, 'Lines and text disagree');
  latinSubparts += labels.length;
  rows.at(-1).latinSubparts = labels.length;
});
check(mathSpans === 86 && latinSubparts === 44, 'text', 'Expected 86 spans / 44 subparts');
check(flow.paragraphs.length === 18 && isDeepStrictEqual(flow.resolvedBreaks, [8]),
  'prose flow', 'Frozen flow paragraph/boundary mismatch');
for (const paragraph of flow.paragraphs) {
  const current = currentLesson.prose[paragraph.blockIndex];
  check(current.kind === 'p' &&
    current.text.split(/\n\s*\n/)[paragraph.paragraphInBlock] === paragraph.text,
  `flow[${paragraph.index}]`, 'Inherited paragraph no longer matches the exact candidate');
}
check(isDeepStrictEqual(currentLesson.section_breaks, [{
  before: flow.paragraphs[7].text, after: flow.paragraphs[8].text
}]), 'section_breaks', 'Boundary is not adjacent in the inherited actual prose flow');

const inherited = [];
for (const command of read(manifestFile).commands) {
  bindRecords(read(command.receipt.path), command.name);
  inherited.push({ name: command.name, exitCode: command.exitCode, receipt: command.receipt });
}
for (const file of [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py'
]) bind(path.join(root, file));
for (const file of [
  'source259-266-review/report.md',
  'source267-274-review/report.md',
  'n45-modern-author/text-edits-recovery-binding.json',
  'n45-modern-author/text-check-FIRST.diagnosis.json',
  'n45-modern-author/text-preservation.json',
  'n45-modern-author/source-prose-equivalence.json',
  'n45-modern-figure-author/check-curve-facts.cjs'
]) bind(path.join(base, file));
const report = {
  schema: 'n45-independent-current-comparison@1',
  purpose: 'Read-only JSON and hash comparison; no producer, test, flow parser, renderer or browser invoked',
  cwd: root,
  originals: 19,
  originalRange: [873, 891],
  rawBlocks: 19,
  sourceProseBlocks: 17,
  inheritedFlowParagraphs: 18,
  inheritedResolvedBoundary: 8,
  mathSpans,
  latinSubparts,
  figuresTemplateStatus: currentFigures.status,
  figuresTemplateLimitation: 'Prepared draft refs only; final-output contract composition is not reviewed or performed',
  rows,
  inheritedCommands: inherited,
  findings,
  status: findings.length ? 'fail' : 'pass',
  inputHashes: [...bindings.values()].sort((a, b) => a.path.localeCompare(b.path))
};
fs.writeFileSync(path.join(own, 'comparison.json'), JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: report.status, originals: 19, latinSubparts, mathSpans,
  paragraphs: 18, inputHashRecords: bindings.size, findings }, null, 2));
process.exitCode = findings.length ? 1 : 0;
