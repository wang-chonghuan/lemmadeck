import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repo = process.cwd();
const root = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-fig204206-author-first-10');
const textRoot = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n32-text-candidate-10');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
const record = path.join(textRoot, 'record.json');
if (hash(record) !== 'ec41479a2e7166be2e3b5a22374d7eac82abc2fe8ad5b6e593147bb417c04fc1') {
  throw new Error('Authoritative text record does not match assignment');
}
const lessonFile = path.join(textRoot, 'lesson.template.json');
const exerciseFile = path.join(textRoot, 'exercises.template.json');
const lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8'));
const exercises = JSON.parse(fs.readFileSync(exerciseFile, 'utf8'));
const freezeHashes = {
  '204': '447540698be4931188a35e39de91ea275cd2b38892eb16b51ba5149a6cf78ca2',
  '205': '4e2bfcbdbf4f948b54bb6f5756b9033ed99faceb9b656924ee3670fdbc54d71e',
  '206': '528eeea2c1865203ce02fdb02e1d290cd7d981e3c1b37c13987e8f9eb93d2688',
};
for (const number of Object.keys(freezeHashes)) {
  const file = path.join(root, `fig-${number}`, 'FIRST.json');
  const stat = fs.statSync(file);
  if ((stat.mode & 0o777) !== 0o444 || hash(file) !== freezeHashes[number]) {
    throw new Error(`FIRST not frozen: ${number}`);
  }
  write(path.join(root, `fig-${number}`, 'FIRST.freeze.json'), {
    schema: 'completed-first-freeze@1',
    role: 'AUTHOR_ONLY_NOT_REVIEW',
    first: bind(file),
    completedChmod: { argv: ['chmod', '0444', path.relative(repo, file)], cwd: repo, exitCode: 0 },
    observedStat: { modeOctal: '0444', size: stat.size, ctime: stat.ctime.toISOString(), mtime: stat.mtime.toISOString() },
    observedAt: new Date().toISOString(),
    beforeSpecOrNativeRender: true,
  });
}
const selection = { '204': [0, 1, 2, 3], '205': [6, 7], '206': [8, 14] };
for (const [number, indices] of Object.entries(selection)) {
  const context = {
    figure: `fig-${number}`, book: '6-8g', lesson: lesson.id,
    bindings: [bind(lessonFile), bind(exerciseFile), bind(record)],
    authoritativeText: indices.map(i => ({ lesson: lesson.id, text: lesson.prose[i].text })),
    relevantExercises: exercises.exercises.filter(e => e.figure_refs?.includes(`fig-${number}`)).map(e => ({ number: e.number, text: e.text })),
    answerKeysRead: false,
  };
  write(path.join(root, `fig-${number}`, 'context.json'), context);
}
const segment = (id, from, to, dash = 0, strokeWidth = 3.5) => ({
  id, type: 'segment', from, to, stroke: 'ink', strokeWidth, dash,
});
const label = (id, at, text, position = 'CENTER', offset = [0, 0]) => ({
  id, type: 'text', at, text, fontSize: 36, fontWeight: 500,
  labelColor: 'ink', labelPlacement: { position, offset },
});
const point = (id, at, text, position, offset) => ({
  id, type: 'point', at, label: text, visible: false,
  fontSize: 36, fontWeight: 500, labelColor: 'ink',
  labelPlacement: { position, offset },
});
const onLine = (id, point, a, b) => ({ id, type: 'pointOnLine', point, a, b });
const parallel = (id, a, b, c, d) => ({ id, type: 'parallel', a, b, c, d });
const perpendicular = (id, a, b, c, d) => ({ id, type: 'perpendicular', a, b, c, d });
const connects = (id, arrow, from, to) => ({ id, type: 'connects', arrow, from, to });
const group = (id, description, objects, assertions, requires = []) => ({ id, description, objects, assertions, requires });
const makeSpec = (number, height, description, objects, assertions, inventory) => {
  const first = JSON.parse(fs.readFileSync(path.join(root, `fig-${number}`, 'FIRST.json'), 'utf8'));
  const context = JSON.parse(fs.readFileSync(path.join(root, `fig-${number}`, 'context.json'), 'utf8'));
  return {
    schema: 'ld-s10y-image/figure-spec@2', id: `fig-${number}`,
    mode: 'deterministic', description,
    source: { image: first.source, authoritativeText: context.authoritativeText, inventory },
    canvas: { width: 640, height, boundingBox: [0, height, 640, 0] },
    display: { layout: 'inline', purpose: 'instructional', maxWidthPx: 640, minTextPx: 16, widths: [300, 358, 640] },
    objects, assertions,
  };
};

const a204 = [[25, 235], [580, 235]];
const b204 = [[85, 45], [605, 45]];
const c204 = [[115, 365], [415, 105]];
const objects204 = [
  segment('s204-a', ...a204), segment('s204-b', ...b204), segment('s204-c', ...c204),
  point('s204-A', [265, 235], 'A', 'NE', [12, -14]),
  label('s204-a-label', [570, 271], 'a'),
  label('s204-b-label', [596, 81], 'b'),
  label('s204-c-label', [139, 398], 'c'),
];
// Canvas padding retains the source's top label without changing its incidence.
objects204.at(-1).at = [140, 391];
const assertions204 = [
  onLine('s204-A-on-a', 's204-A', ...a204),
  onLine('s204-A-on-c', 's204-A', ...c204),
  parallel('s204-a-b-direction', ...a204, ...b204),
  connects('s204-c-finite-gap', 's204-c', ...c204),
];
const spec204 = makeSpec('204', 430,
  'Source contradiction-proof schematic: actual a parallel b and A on a/c; visible finite c ends above b. The supposition that c does not meet b is hypothetical, not an executable Euclidean fact. Semantic HOLD: retain the full proof context without asserting the refuted supposition.',
  objects204, assertions204, [
    group('s204-source', 'FIRST source drawing: three straight solid strokes, labels a/b/c and crossing A; no extra b intersection or dot. Only one source named point, so multi-point requirement is inapplicable; its two incidences are explicit.',
      objects204.map(o => o.id), assertions204.map(a => a.id)),
  ]);

const F = [160, 330], B = [340, 195];
const a205 = [[70, 210], [430, 690]];
const c205 = [[40, 420], [415, 138.75]];
const b205 = [[295, 60], [500, 675]];
const p205 = [[250, 75], [550, 475]];
const elbow = at => [
  [at[0] + 9.6, at[1] + 12.8],
  [at[0] + 22.4, at[1] + 3.2],
  [at[0] + 12.8, at[1] - 9.6],
];
const ef = elbow(F), eb = elbow(B);
const objects205 = [
  segment('s205-a', ...a205), segment('s205-b', ...b205),
  segment('s205-c', ...c205), segment('s205-p', ...p205),
  { id: 's205-foot', type: 'point', at: F, visible: true, size: 0.6, strokeWidth: 0.6, stroke: 'ink', fill: 'ink' },
  point('s205-B', B, 'B', 'SE', [14, 16]),
  segment('s205-right-a-c-1', ef[0], ef[1], 0, 2),
  segment('s205-right-a-c-2', ef[1], ef[2], 0, 2),
  segment('s205-right-p-c-1', eb[0], eb[1], 0, 2),
  segment('s205-right-p-c-2', eb[1], eb[2], 0, 2),
  label('s205-a-label', a205[1], 'a', 'NW', [-12, -12]),
  label('s205-b-label', b205[1], 'b', 'W', [-16, 0]),
  label('s205-c-label', c205[0], 'c', 'NE', [16, -12]),
  label('s205-p-label', p205[1], 'p', 'E', [14, 0]),
];
const assertions205 = [
  onLine('s205-foot-on-a', 's205-foot', ...a205),
  onLine('s205-foot-on-c', 's205-foot', ...c205),
  onLine('s205-B-on-c', 's205-B', ...c205),
  onLine('s205-B-on-b', 's205-B', ...b205),
  onLine('s205-B-on-p', 's205-B', ...p205),
  perpendicular('s205-a-perp-c', ...a205, ...c205),
  perpendicular('s205-p-perp-c', ...p205, ...c205),
  parallel('s205-a-parallel-p', ...a205, ...p205),
  { id: 's205-foot-B-on-c', type: 'collinear', a: 's205-foot', b: 's205-B', c: c205[0] },
  { id: 's205-foot-B-distinct', type: 'distance', a: 's205-foot', b: 's205-B', value: 225 },
  { id: 's205-right-a-c-size', type: 'equalDistance', a: ef[0], b: ef[1], c: ef[1], d: ef[2] },
  { id: 's205-right-p-c-size', type: 'equalDistance', a: eb[0], b: eb[1], c: eb[1], d: eb[2] },
  perpendicular('s205-right-a-c-corner', ef[0], ef[1], ef[1], ef[2]),
  perpendicular('s205-right-p-c-corner', eb[0], eb[1], eb[1], eb[2]),
  ...objects205.filter(o => o.type === 'segment').map(o => connects(`${o.id}-endpoints`, o.id, o.from, o.to)),
];
const spec205 = makeSpec('205', 760,
  'Perpendicular and oblique lines in the source orientation: actual a perpendicular c, p through B perpendicular c, a parallel p, and b oblique to c through B. Both original local right-angle elbows and the unnamed a/c foot are retained. The rejected assumption b parallel a belongs only to the proof prose.',
  objects205, assertions205, [
    group('s205-source', 'FIRST: four straight solid strokes, a/b/c/p/B labels, unnamed a/c foot, and two local square corners. Modern unnamed foot anchor stays within existing crossing ink; it is not a source dot or added point label.',
      objects205.map(o => o.id), assertions205.map(a => a.id), ['pointRelationships']),
  ]);

const a206 = [[25, 290], [390, 290]];
const b206 = [[25, 200], [390, 200]];
const c206 = [[25, 60], [550, 60]];
const ad206 = [[390, 290], [590, 210]];
const bd206 = [[390, 200], [590, 280]];
const objects206 = [
  segment('s206-a-solid', ...a206), segment('s206-b-solid', ...b206),
  segment('s206-c-solid', ...c206),
  segment('s206-a-dash', ...ad206, 2, 2.5),
  segment('s206-b-dash', ...bd206, 2, 2.5),
  point('s206-P', [502.5, 245], 'P', 'N', [0, -14]),
  label('s206-a-label', [40, 324], 'a'),
  label('s206-b-label', [40, 234], 'b'),
  label('s206-c-label', [40, 94], 'c'),
];
const assertions206 = [
  parallel('s206-a-solid-parallel-c-solid', ...a206, ...c206),
  parallel('s206-b-solid-parallel-c-solid', ...b206, ...c206),
  onLine('s206-P-on-a-dash', 's206-P', ...ad206),
  onLine('s206-P-on-b-dash', 's206-P', ...bd206),
  ...objects206.filter(o => o.type === 'segment').map(o => connects(`${o.id}-endpoints`, o.id, o.from, o.to)),
];
const spec206 = makeSpec('206', 360,
  'Contradiction schematic, not feasible Euclidean full lines: parallel horizontal solid portions a/b/c and separately angled dashed continuations crossing at P. Turns and solid/dash distinctions are source facts. Assertions check only depicted strokes. The hypothesis of two parallels meeting at P remains unexecuted and blocks promotion (semantic HOLD).',
  objects206, assertions206, [
    group('s206-source', 'FIRST: preserve all three horizontal solid portions, their two straight dashed turned continuations and a/b/c/P labels. P is the only source named point; both depicted dash incidences are mapped. No false assertion that the full turned paths are Euclidean straight lines.',
      objects206.map(o => o.id), assertions206.map(a => a.id)),
  ]);
for (const spec of [spec204, spec205, spec206]) {
  write(path.join(root, spec.id, 'spec.json'), spec);
  const first = JSON.parse(fs.readFileSync(path.join(root, spec.id, 'FIRST.json')));
  const mappedPoints = spec.objects.filter(o => o.type === 'point').map(o => o.id);
  const coverage = Object.fromEntries(mappedPoints.map(id => [id, spec.assertions.filter(a =>
    ['point', 'a', 'b', 'c', 'd', 'from', 'to'].some(key => a[key] === id)).map(a => a.id)]));
  write(path.join(root, spec.id, 'author-semantics.json'), {
    schema: 'figure-author-semantics@1', role: 'AUTHOR_ONLY_NOT_REVIEW',
    first: bind(path.join(root, spec.id, 'FIRST.json')),
    spec: bind(path.join(root, spec.id, 'spec.json')),
    actualGiven: first.proseActualGiven,
    hypotheticalOnly: first.proseHypothesisOnly,
    modernAdditions: first.modernAdditionsPlanned,
    mappedPointAssertionCoverage: coverage,
    allMappedPointsCovered: Object.values(coverage).every(ids => ids.length > 0),
    multiPointRequirement: spec.id === 'fig-205' ? 'native pointRelationships; foot and B covered together wholly inside group' : 'Only one named source point; native two-point group requirement is inapplicable. Its incident strokes use literal endpoints, not invented source points.',
    unresolved: spec.id === 'fig-204'
      ? ['Native FigureSpec has no logical hypothetical/nonintersection assertion; c-does-not-meet-b is preserved as proof-only prose and cannot be certified as actual geometry.']
      : spec.id === 'fig-206'
        ? ['Native FigureSpec has no contradiction-schematic assertion scope for full turned a/b paths parallel to c and meeting at P. Stroke-only checks do not certify the complete mathematical schematic.']
        : [],
    disposition: spec.id === 'fig-205' ? 'AUTHOR_ONLY' : 'HOLD',
    contentRevisions: 0, review: null, promotion: false,
  });
}
