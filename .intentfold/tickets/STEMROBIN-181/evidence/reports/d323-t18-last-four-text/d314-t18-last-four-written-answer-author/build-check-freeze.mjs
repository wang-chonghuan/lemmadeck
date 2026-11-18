import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '../../../../..');
const tmp = path.dirname(root);
const skill = path.join(repo, '.claude/skills/ld-s10y-lesson');
const answerSkill = path.join(repo, '.claude/skills/ld-s10y-answer');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const read = p => fs.readFileSync(p);
const parse = p => JSON.parse(read(p));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const bind = p => {
  const bytes = read(p);
  return { path: p, sha256: digest(bytes), bytes: bytes.length };
};
const write = (name, value) => {
  const p = path.join(root, name);
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(p);
};
const verified = (role, p, expected) => {
  const item = { role, ...bind(p) };
  ensure(item.sha256 === expected, `Input binding mismatch: ${p}`);
  return { ...item, humanHashMatched: true };
};
const inputs = [
  verified('zh-authoritative-exercises',
    path.join(tmp, 'd032-t18-text-repair/frozen/exercises.template.json'),
    'fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0'),
  verified('en-authoritative-exercises',
    path.join(tmp, 'd032-t18-text-repair/frozen/english.exercises.template.json'),
    'fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02'),
  verified('prior-text-PASS-status-only', path.join(tmp, 'd032-t18-science-effective-review.json'),
    '20a9faf60ed130ff34d1d0c10b32dab5f981f8ade18c062193df030c0d48f6b9')
];
const zh = parse(inputs[0].path);
const en = parse(inputs[1].path);
const statusFile = parse(inputs[2].path);
const selectedIds = ['13', '14', '15', '16'];
const refs = { '13': ['p0279#12'], '14': ['p0279#13'], '15': ['p0279#14'], '16': ['p0279#15'] };
const selected = selectedIds.map(number => ({
  exercise: number,
  zh: zh.exercises.find(item => String(item.number) === number),
  en: en.exercises.find(item => String(item.number) === number),
  original: zh.source.data.exercises.find(item => String(item.number) === number)
}));
const statusOnly = statusFile.exercises
  .filter(item => selectedIds.includes(String(item.number)))
  .map(item => ({ number: String(item.number), status: item.status }));
const candidatePath = path.join(root, 'written-answers.candidate.json');
const candidate = parse(candidatePath);

// Single structure check of the four new answers, not a semantic or source audit.
const forbidden = new Set(['expected', 'accept', 'input', 'interactions', 'bookRaw']);
const checkFields = value => {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    ensure(!forbidden.has(key), `Forbidden automatic/borrowed answer field: ${key}`);
    checkFields(child);
  }
};
ensure(zh.lesson === 'phy9-c2-s4-t18' && en.lesson === zh.lesson &&
  zh.count === 16 && en.count === 16 && zh.exercises.length === 16 && en.exercises.length === 16,
  'Source task identity/count mismatch');
ensure(candidate.status === 'draft' && candidate.book === '9p' &&
  candidate.lesson === zh.lesson && candidate.edition === zh.edition && en.edition === zh.edition,
  'Candidate identity mismatch');
ensure(candidate.answers.length === 4 &&
  JSON.stringify(candidate.answers.map(item => item.exercise)) === JSON.stringify(selectedIds),
  'Candidate scope must be only 13,14,15,16 in source order');
checkFields(candidate);
for (const item of selected) {
  const answer = candidate.answers.find(a => a.exercise === item.exercise);
  for (const prompt of [item.zh, item.en, item.original]) {
    ensure(prompt && String(prompt.source_number) === item.exercise && prompt.group_id === 'g0' &&
      JSON.stringify(prompt.pages) === JSON.stringify(refs[item.exercise]),
      `Source identity mismatch: ${item.exercise}`);
    ensure(prompt.figure_refs.length === 0 && prompt.figures.length === 0,
      `Unexpected selected figure dependency: ${item.exercise}`);
  }
  ensure(item.zh.source_text === item.original.text && item.en.source_text === item.original.text &&
    item.en.chinese_text === item.zh.text, `Embedded snapshot mismatch: ${item.exercise}`);
  ensure(answer.id === `t18-ex${item.exercise}` && answer.lesson === zh.lesson &&
    answer.source_number === item.exercise && answer.group_id === 'g0' &&
    JSON.stringify(answer.source_refs) === JSON.stringify(refs[item.exercise]),
    `Answer source identity mismatch: ${item.exercise}`);
  ensure(answer.source === 'derived' && answer.grading === 'ungraded' &&
    Array.isArray(answer.parts) && answer.parts.length === 0 &&
    Array.isArray(answer.historical_entities) && answer.historical_entities.length === 0,
    `Read-only derived contract mismatch: ${item.exercise}`);
  ensure(Object.keys(answer.displayAnswer).sort().join(',') === 'en,zh' &&
    ['zh', 'en'].every(language =>
      typeof answer.displayAnswer[language] === 'string' && answer.displayAnswer[language].trim()),
    `Missing display text: ${item.exercise}`);
}
ensure(statusOnly.length === 4 && statusOnly.every(item => item.status === 'PASS'),
  'Selected prior text PASS statuses mismatch');
const structure = write('local-structure.receipt.json', {
  schema: 'stemrobin/selected-written-answer-structure-receipt@1',
  invocations: 1, status: 'PASS', candidate: bind(candidatePath),
  selectedExerciseIds: selectedIds, authoredTasks: 4, displayAnswers: 8,
  sourceIDsGroupAndPageRefsMatched: true,
  originalSourceSnapshotsPreserved: true, derivedUngradedEmptyParts: true,
  forbiddenAutomaticFieldsAbsent: true,
  scope: 'New author candidate structure only; not independent SCI/ZHEN or full gate2.'
});
const nativeCandidates = [];
for (const language of ['zh', 'en']) {
  fs.mkdirSync(path.join(root, language));
  nativeCandidates.push(write(`${language}/answer-keys.candidate.json`, {
    schema: 'ld-s10y-answer/lesson-answers@1',
    book: '9p', lesson: zh.lesson, edition: zh.edition, language, status: 'draft',
    answers: candidate.answers.map(answer => ({
      exercise: answer.exercise, grading: answer.grading, source: answer.source,
      displayAnswer: answer.displayAnswer[language], parts: [], historical_entities: []
    }))
  }));
}
const selectedInputs = write('selected-inputs.json', {
  schema: 'stemrobin/four-selected-t18-source-inputs@1',
  lesson: zh.lesson, sourceTaskCount: 16,
  outerBindings: inputs.slice(0, 2),
  embeddedOriginalSource: { pathAsDeclared: zh.source.path, sha256AsDeclared: zh.source.sha256,
    bindingMode: 'Verified outer templates bind embedded snapshots; no new SOURCE audit.' },
  selected: selected.map(item => ({
    ...item, textSha256: { zh: digest(item.zh.text), en: digest(item.en.text),
      original: digest(item.original.text) }
  })),
  priorTextStatusOnly: { binding: inputs[2], selected: statusOnly },
  retainedHoldStatusOnly: statusFile.retainedHolds
    .filter(item => ['1', '9'].includes(String(item.exercise)))
    .map(item => ({ id: item.id, exercise: String(item.exercise), status: item.status })),
  oldObservationsSolutionsOrChoiceKeysConsumed: false
});
const arithmetic = bind(path.join(root, 'author-arithmetic.json'));
const bindings = write('input-bindings.json', {
  schema: 'stemrobin/four-t18-written-answer-input-bindings@1',
  ticket: 'STEMROBIN-181', inputs, selectedInputs,
  independentlyAuthoredArithmetic: arithmetic,
  conventionalConstants: {
    electronChargeMagnitudeC: 1.60e-19, electronMassKg: 9.11e-31, speedOfLightMPerS: 3.00e8,
    status: 'CONVENTIONAL-ROUNDED-PHYSICAL-CONSTANTS-NOT-PRINTED-SOURCE-DATA'
  },
  sourceNumericData: {
    exercise15: { electrochemicalEquivalentKgPerC: 3e-7, densityKgPerM3: 8.9e3,
      totalAreaM2: 0.2, currentA: 25, hours: 2 },
    exercise16: { acceleratingVoltagesV: [500, 5000] }
  },
  contractsAndSyntaxTools: [
    { role: 'modern-answer-author-contract', ...bind(path.join(answerSkill, 'SKILL.md')) },
    { role: 'gate2-contract-not-full-gate-execution',
      ...bind(path.join(answerSkill, 'references/gate-2-lesson-answers/gate.md')) },
    { role: 'existing-delimiter-module', ...bind(path.join(skill, 'tools/mathcheck.py')) },
    { role: 'existing-katex-parser', ...bind(path.join(skill, 'tools/katex_check.js')) }
  ],
  excludedInputs: ['All old written answers and choices', 'd312 parent source baseline',
    'All other parent pre-author solution baselines', 'Images']
});
const texts = candidate.answers.flatMap(answer => ['zh', 'en'].map(language => ({
  id: answer.id, field: `displayAnswer.${language}`, text: answer.displayAnswer[language]
})));
const delimiterInput = write('local-delimiter.input.json', texts);
const code = [
  'import json, sys',
  'sys.path.insert(0, sys.argv[1])',
  'from mathcheck import check_delimiters, find_math_spans',
  'items = json.load(sys.stdin)',
  'results = []',
  'spans = []',
  'for item in items:',
  '    errors = check_delimiters(item["text"])',
  '    results.append({"id": item["id"], "field": item["field"], "errors": errors})',
  '    for tex, display in find_math_spans(item["text"]):',
  '        spans.append({"id": item["id"], "field": item["field"], "tex": tex, "display": display})',
  'print(json.dumps({"results": results, "spans": spans}, ensure_ascii=False))'
].join('\n');
const delimiterRun = spawnSync(path.join(skill, '.venv/bin/python'),
  ['-c', code, path.join(skill, 'tools')], {
    input: JSON.stringify(texts), encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
fs.writeFileSync(path.join(root, 'local-delimiter.stdout.json'), delimiterRun.stdout ?? '', { flag: 'wx' });
fs.writeFileSync(path.join(root, 'local-delimiter.stderr.txt'), delimiterRun.stderr ?? '', { flag: 'wx' });
const delimiterOutput = delimiterRun.status === 0 ? JSON.parse(delimiterRun.stdout) : null;
const delimiterPass = delimiterOutput?.results.length === 8 &&
  delimiterOutput.results.every(item => item.errors.length === 0);
const delimiter = write('local-delimiter.receipt.json', {
  schema: 'stemrobin/selected-written-answer-delimiter-receipt@1',
  invocations: 1, callsPerNewDisplayText: 1, displayTexts: 8, input: delimiterInput,
  exitCode: delimiterRun.status,
  stdout: bind(path.join(root, 'local-delimiter.stdout.json')),
  stderr: bind(path.join(root, 'local-delimiter.stderr.txt')),
  status: delimiterPass ? 'PASS' : 'FAIL',
  scope: 'Only eight new displays; native copies are generated from the exact same strings.'
});
let katex = null;
let katexPass = false;
if (delimiterOutput) {
  const katexInput = write('local-katex.input.json', delimiterOutput.spans);
  const run = spawnSync(process.execPath, [path.join(skill, 'tools/katex_check.js')], {
    input: JSON.stringify(delimiterOutput.spans), encoding: 'utf8', cwd: skill
  });
  fs.writeFileSync(path.join(root, 'local-katex.stdout.json'), run.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'local-katex.stderr.txt'), run.stderr ?? '', { flag: 'wx' });
  const results = run.status === 0 ? JSON.parse(run.stdout) : null;
  katexPass = results?.length === delimiterOutput.spans.length &&
    results.every(item => item.ok && !item.fatal && item.warnings.length === 0);
  katex = write('local-katex.receipt.json', {
    schema: 'stemrobin/selected-written-answer-katex-syntax-receipt@1',
    invocations: 1, callsPerFormulaSpan: 1, formulaSpans: delimiterOutput.spans.length,
    input: katexInput, exitCode: run.status,
    stdout: bind(path.join(root, 'local-katex.stdout.json')),
    stderr: bind(path.join(root, 'local-katex.stderr.txt')),
    status: katexPass ? 'PASS' : 'FAIL',
    scope: 'Formula string syntax only, not actual visual DISPLAY, native finalize or scientific approval.'
  });
}
const actual = write('actual-opens.json', {
  schema: 'stemrobin/zero-image-actual-opens@1', opens: [],
  budget: { contextImagesBeforeReview: 24, newImagesOpened: 0, actualOpenCalls: 0,
    reopens: 0, otherImagesOpened: 0, cumulativeContextImages: 24, reset: false }
});
const status = delimiterPass && katexPass ? 'FROZEN-DRAFT-INDEPENDENT-SCI-ZHEN-PENDING' :
  'FROZEN-DRAFT-LOCAL-CHECK-FAIL-INDEPENDENT-SCI-ZHEN-PENDING';
const report = write('report.json', {
  schema: 'stemrobin/four-t18-written-answer-author-report@1',
  ticket: 'STEMROBIN-181', lesson: zh.lesson, authorUnit: 'existing-Locke-d314',
  status, candidate: bind(candidatePath), nativeCandidates,
  inputBindings: bindings, selectedSourceEvidence: selectedInputs, authorArithmetic: arithmetic,
  authorDerivationSummary: [
    { exercise: '13', source_refs: refs['13'],
      basis: 'A conduction electron fills a valence-band vacancy; one mobile electron/hole pair ceases to act as carriers, without destroying the electron or charge.',
      limits: 'Radiative and nonradiative pathways distinguished; encounters not guaranteed instantaneous recombination.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '14', source_refs: refs['14'],
      basis: 'Uncontrolled impurity species/concentrations affect carriers, traps, recombination and scattering, requiring pure starting material for reproducible devices.',
      limits: 'Controlled intentional doping is not forbidden; not every impurity increases conductivity; no universal purity percentage invented.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '15', source_refs: refs['15'],
      basis: 'Using printed k, density, total area, current and time: m=kIt=0.054 kg; h=m/(density*area) approximately 0.0303 mm.',
      limits: '100% current efficiency and thin uniform layer are explicit assumptions; nonuniformity yields only nominal average; actual efficiency unspecified.',
      sourceNumbersUnchanged: true,
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '16', source_refs: refs['16'],
      basis: 'Negligible initial speed and no losses give classical v=sqrt(2eU/m): 500 V approximately 1.33e7 m/s; 5000 V approximately 4.19e7 m/s.',
      limits: 'Rounded constants explicitly conventional; nonzero initial-speed formula and relativistic correction distinguished, with 5000 V relativistic value approximately 4.16e7 m/s.',
      sourceNumbersUnchanged: true,
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' }
  ],
  priorTextPASSConsumedStatusOnly: { binding: inputs[2], selected: statusOnly,
    notApprovalOfTheseNewAnswers: true },
  localChecks: { structure, delimiter, katexSyntax: katex, onePassOnly: true,
    arithmeticInvocations: 1, noFullGate2: true },
  coverage: candidate.coverage,
  unselectedTasks: {
    notAuthoredInThisBatch: candidate.coverage.unselectedExerciseIds,
    newlyClaimedCompleted: [],
    treatment: 'PENDING-OUTSIDE-THIS-BATCH; NO-CHANGE-TO-EXISTING-STATUS-NOT-BLANKET-HOLD',
    exercises8And10NotBlanketHOLD: true, earlierCompletedArtifactsPreserved: true
  },
  retainedHolds: [
    { exercise: '1', status: 'HOLD', scope: 'Existing figure189 dependency; not read or changed.' },
    { exercise: '9', status: 'HOLD', scope: 'Existing discharge-type errata-authorization boundary; not read or changed.' }
  ],
  missingStages: ['First independent SCI/ZHEN review of these eight new displays',
    'Complete 16-task answer coverage/effective consolidation', 'Full gate2 and native answer finalize',
    'Actual full visual DISPLAY and publication'],
  completeAnswerKey: false, fullGate2PASS: false, wholeCardReady: false,
  nativeFinalizeRun: false, published: false, actualOpens: actual,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  oldFAILHOLDAndAllOtherAuthorsBytesPreserved: true, forbiddenOperationsPerformed: []
});
const owned = [];
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile()) owned.push(bind(path.join(root, entry.name)));
  else if (entry.isDirectory()) {
    for (const name of fs.readdirSync(path.join(root, entry.name)))
      owned.push(bind(path.join(root, entry.name, name)));
  }
}
const freeze = write('author-freeze.json', {
  schema: 'stemrobin/four-t18-written-answer-author-freeze@1',
  ticket: 'STEMROBIN-181', frozenUtc: new Date().toISOString(),
  authorUnit: 'existing-Locke-d314', status, candidates: bind(candidatePath),
  nativeCandidates, report, inputBindings: bindings, selectedSourceEvidence: selectedInputs,
  verifiedInputs: inputs, artifacts: owned.map(item => ({ ...item, handoffMode: '0444' })),
  localCheckStatus: delimiterPass && katexPass ? 'PASS' : 'FAIL',
  coverage: candidate.coverage, independentSCIAndZHEN: 'PENDING',
  completeAnswerKey: false, fullGate2PASS: false, wholeCardReady: false,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  immutability: 'All new owned files plus this freeze are chmod 0444; self-hash returned externally.'
});
for (const item of [...owned, freeze]) {
  fs.chmodSync(item.path, 0o444);
  ensure((fs.statSync(item.path).mode & 0o777) === 0o444 && digest(read(item.path)) === item.sha256,
    `Freeze mismatch: ${item.path}`);
}
console.log(JSON.stringify({
  status, candidate: bind(candidatePath), nativeCandidates, inputBindings: bindings,
  report, authorFreeze: freeze,
  localChecks: { structureInvocations: 1, delimiterInvocations: 1, delimiterDisplayTexts: 8,
    katexInvocations: katex ? 1 : 0, formulaSpans: delimiterOutput?.spans.length ?? 0,
    delimiter: delimiterPass ? 'PASS' : 'FAIL', katex: katexPass ? 'PASS' : 'FAIL' },
  images: { new: 0, cumulative: 24 }, mode: '0444'
}, null, 2));
