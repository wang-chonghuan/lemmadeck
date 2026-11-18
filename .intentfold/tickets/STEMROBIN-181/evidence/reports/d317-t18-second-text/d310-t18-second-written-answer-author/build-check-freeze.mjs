import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '../../../../..');
const tmp = path.dirname(root);
const frozenSource = path.join(tmp, 'd032-t18-text-repair/frozen');
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
const sourceBindings = [
  verified('zh-authoritative-exercises', path.join(frozenSource, 'exercises.template.json'),
    'fb4ca6d2d5d7d060c51e2ae8d0e3c8310cc4c67aa72b3d9cbe1e2ac494f392f0'),
  verified('en-authoritative-exercises', path.join(frozenSource, 'english.exercises.template.json'),
    'fbc806dcc4c5108bfe3bd9bec17931d5bd65df6dd21b745c7474e980b1219f02'),
  verified('prior-text-PASS-status-only', path.join(tmp, 'd032-t18-science-effective-review.json'),
    '20a9faf60ed130ff34d1d0c10b32dab5f981f8ade18c062193df030c0d48f6b9')
];
const zh = parse(sourceBindings[0].path);
const en = parse(sourceBindings[1].path);
const statusFile = parse(sourceBindings[2].path);
const selectedIds = ['4', '5', '6', '7'];
const refs = { '4': ['p0279#3'], '5': ['p0279#4'], '6': ['p0279#5'], '7': ['p0279#6'] };
const selected = selectedIds.map(number => ({
  exercise: number,
  zh: zh.exercises.find(item => String(item.number) === number),
  en: en.exercises.find(item => String(item.number) === number),
  original: zh.source.data.exercises.find(item => String(item.number) === number)
}));
const statusOnly = statusFile.exercises
  .filter(item => selectedIds.includes(String(item.number)))
  .map(item => ({ number: String(item.number), status: item.status }));
const retainedHoldStatusOnly = statusFile.retainedHolds
  .filter(item => ['1', '9'].includes(String(item.exercise)))
  .map(item => ({ id: item.id, exercise: String(item.exercise), status: item.status }));
const candidatePath = path.join(root, 'written-answers.candidate.json');
const candidate = parse(candidatePath);

// One structure check for this new batch; no source SCI or old answer checks.
const forbidden = new Set(['expected', 'accept', 'input', 'interactions', 'bookRaw']);
const assertNoForbiddenFields = value => {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    ensure(!forbidden.has(key), `Forbidden answer field: ${key}`);
    assertNoForbiddenFields(child);
  }
};
ensure(zh.lesson === 'phy9-c2-s4-t18' && en.lesson === zh.lesson &&
  zh.count === 16 && en.count === 16 && zh.exercises.length === 16 && en.exercises.length === 16,
  'Authoritative lesson identity or task count mismatch');
ensure(candidate.status === 'draft' && candidate.book === '9p' &&
  candidate.lesson === zh.lesson && candidate.edition === zh.edition && en.edition === zh.edition,
  'Candidate identity mismatch');
ensure(candidate.answers.length === 4 &&
  JSON.stringify(candidate.answers.map(item => item.exercise)) === JSON.stringify(selectedIds),
  'Candidate must contain only the four selected tasks, in order');
assertNoForbiddenFields(candidate);
for (const item of selected) {
  const answer = candidate.answers.find(a => a.exercise === item.exercise);
  for (const prompt of [item.zh, item.en, item.original]) {
    ensure(prompt && String(prompt.source_number) === item.exercise && prompt.group_id === 'g0' &&
      JSON.stringify(prompt.pages) === JSON.stringify(refs[item.exercise]),
      `Source identity mismatch: ${item.exercise}`);
    ensure(prompt.figure_refs.length === 0 && prompt.figures.length === 0,
      `Unexpected figure-dependent selected task: ${item.exercise}`);
  }
  ensure(item.zh.source_text === item.original.text && item.en.source_text === item.original.text &&
    item.en.chinese_text === item.zh.text, `Source snapshot mismatch: ${item.exercise}`);
  ensure(answer.id === `t18-ex${item.exercise}` && answer.lesson === zh.lesson &&
    answer.source_number === item.exercise && answer.group_id === 'g0' &&
    JSON.stringify(answer.source_refs) === JSON.stringify(refs[item.exercise]),
    `Answer identity mismatch: ${item.exercise}`);
  ensure(answer.source === 'derived' && answer.grading === 'ungraded' &&
    Array.isArray(answer.parts) && answer.parts.length === 0 &&
    Array.isArray(answer.historical_entities) && answer.historical_entities.length === 0,
    `Read-only answer contract mismatch: ${item.exercise}`);
  ensure(Object.keys(answer.displayAnswer).sort().join(',') === 'en,zh' &&
    typeof answer.displayAnswer.zh === 'string' && answer.displayAnswer.zh.trim() &&
    typeof answer.displayAnswer.en === 'string' && answer.displayAnswer.en.trim(),
    `Missing bilingual displayAnswer: ${item.exercise}`);
}
ensure(statusOnly.length === 4 && statusOnly.every(item => item.status === 'PASS'),
  'Prior selected text PASS status mismatch');
const structure = write('local-structure.receipt.json', {
  schema: 'stemrobin/selected-written-answer-structure-receipt@1',
  invocations: 1, status: 'PASS', candidate: bind(candidatePath),
  selectedExerciseIds: selectedIds, authoredTasks: 4, displayAnswers: 8,
  sourceIdentityMatched: true, sourceSnapshotsUnchanged: true,
  derivedUngradedEmptyParts: true, forbiddenAutomaticFieldsAbsent: true,
  scope: 'Author candidate structure only; not SCI/ZHEN or full gate2.'
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
  lesson: zh.lesson, fullSourceTaskCount: 16,
  outerTemplateBindings: sourceBindings.slice(0, 2),
  originalEmbeddedSource: {
    pathAsDeclared: zh.source.path, sha256AsDeclared: zh.source.sha256,
    bindingMode: 'Embedded snapshots bound by the verified outer template hashes; not a new SOURCE audit.'
  },
  selected: selected.map(item => ({
    ...item,
    promptTextSha256: { zh: digest(item.zh.text), en: digest(item.en.text) },
    originalTextSha256: digest(item.original.text)
  })),
  priorTextStatusOnly: { binding: sourceBindings[2], selected: statusOnly },
  retainedHoldStatusOnly,
  priorObservationsSolutionsAndChoiceKeysConsumed: false
});
const inputBindings = write('input-bindings.json', {
  schema: 'stemrobin/four-t18-written-answer-input-bindings@1',
  ticket: 'STEMROBIN-181', inputs: sourceBindings, selectedInputs,
  contractsAndSyntaxTools: [
    { role: 'modern-answer-author-contract', ...bind(path.join(answerSkill, 'SKILL.md')) },
    { role: 'gate2-contract-not-full-gate-execution',
      ...bind(path.join(answerSkill, 'references/gate-2-lesson-answers/gate.md')) },
    { role: 'existing-delimiter-module', ...bind(path.join(skill, 'tools/mathcheck.py')) },
    { role: 'existing-katex-syntax-parser', ...bind(path.join(skill, 'tools/katex_check.js')) }
  ],
  allowedDefinitions: 'No additional definition files required; independently derived from the four modern prompts and ordinary stated physical models.',
  excludedInputs: ['Old answer displays or keys', 'Old choices', 'd308', 'd309',
    'Parent pre-author solution baseline', 'All images']
});
const texts = candidate.answers.flatMap(answer => ['zh', 'en'].map(language => ({
  id: answer.id, field: `displayAnswer.${language}`, text: answer.displayAnswer[language]
})));
const delimiterInput = write('local-delimiter.input.json', texts);
const pythonCode = [
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
  ['-c', pythonCode, path.join(skill, 'tools')], {
    input: JSON.stringify(texts), encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }
  });
fs.writeFileSync(path.join(root, 'local-delimiter.stdout.json'), delimiterRun.stdout ?? '', { flag: 'wx' });
fs.writeFileSync(path.join(root, 'local-delimiter.stderr.txt'), delimiterRun.stderr ?? '', { flag: 'wx' });
const delimiterOutput = delimiterRun.status === 0 ? JSON.parse(delimiterRun.stdout) : null;
const delimiterPass = delimiterOutput?.results.length === 8 &&
  delimiterOutput.results.every(item => item.errors.length === 0);
const delimiterReceipt = write('local-delimiter.receipt.json', {
  schema: 'stemrobin/selected-written-answer-delimiter-receipt@1',
  invocations: 1, callsPerNewDisplayText: 1, displayTexts: 8,
  input: delimiterInput, exitCode: delimiterRun.status,
  stdout: bind(path.join(root, 'local-delimiter.stdout.json')),
  stderr: bind(path.join(root, 'local-delimiter.stderr.txt')),
  status: delimiterPass ? 'PASS' : 'FAIL',
  scope: 'Only the eight new authored display texts; native copies derive from those exact strings.'
});
let katexInput = null;
let katexReceipt = null;
let katexPass = false;
if (delimiterOutput) {
  katexInput = write('local-katex.input.json', delimiterOutput.spans);
  const katexRun = spawnSync(process.execPath, [path.join(skill, 'tools/katex_check.js')], {
    input: JSON.stringify(delimiterOutput.spans), encoding: 'utf8', cwd: skill
  });
  fs.writeFileSync(path.join(root, 'local-katex.stdout.json'), katexRun.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(path.join(root, 'local-katex.stderr.txt'), katexRun.stderr ?? '', { flag: 'wx' });
  const results = katexRun.status === 0 ? JSON.parse(katexRun.stdout) : null;
  katexPass = results?.length === delimiterOutput.spans.length &&
    results.every(item => item.ok && !item.fatal && item.warnings.length === 0);
  katexReceipt = write('local-katex.receipt.json', {
    schema: 'stemrobin/selected-written-answer-katex-syntax-receipt@1',
    invocations: 1, callsPerFormulaSpan: 1, formulaSpans: delimiterOutput.spans.length,
    input: katexInput, exitCode: katexRun.status,
    stdout: bind(path.join(root, 'local-katex.stdout.json')),
    stderr: bind(path.join(root, 'local-katex.stderr.txt')),
    status: katexPass ? 'PASS' : 'FAIL',
    scope: 'KaTeX string syntax only; no browser, image, DISPLAY, scientific or answer-key approval.'
  });
}
const actual = write('actual-opens.json', {
  schema: 'stemrobin/zero-image-actual-opens@1', opens: [],
  budget: { contextImagesBeforeReview: 24, newImagesOpened: 0, actualOpenCalls: 0,
    reopens: 0, otherImagesOpened: 0, cumulativeContextImages: 24, reset: false }
});
const authorStatus = delimiterPass && katexPass ? 'FROZEN-DRAFT-INDEPENDENT-SCI-ZHEN-PENDING' :
  'FROZEN-DRAFT-LOCAL-CHECK-FAIL-INDEPENDENT-SCI-ZHEN-PENDING';
const report = write('report.json', {
  schema: 'stemrobin/four-t18-written-answer-author-report@1',
  ticket: 'STEMROBIN-181', lesson: zh.lesson, authorUnit: 'existing-Locke-d310',
  status: authorStatus, candidate: bind(candidatePath), nativeCandidates,
  inputBindings, selectedSourceEvidence: selectedInputs,
  authorDerivationSummary: [
    { exercise: '4', source_refs: refs['4'],
      basis: 'Cathodic reduction deposits metal on the hollow object; the counterelectrode goes inside the accessible, electrolyte-filled cavity.',
      conditions: 'DC cathode/anode polarity; no electrode contact; soluble-anode model identified as common rather than mandatory; no universal uniformity or invented voltage/geometry.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '5', source_refs: refs['5'],
      basis: 'Common series current gives common transferred charge; the same deposition reaction has the same electrochemical equivalent, yielding equal ideal mass and moles.',
      conditions: 'Same valence/reaction and ideal current efficiency; equal nonideal efficiencies also preserve equality; concentration, depletion, and side reactions do not justify unprovided actual masses.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '6', source_refs: refs['6'],
      basis: 'Oppositely moving opposite charges contribute conventional current in the same direction: (3 C + 2 C) / 1 s = 5 A.',
      conditions: 'Ordinary ionic drift; series continuity without bypass or sustained accumulation; interval data establish average current, steady model identifies it with constant current.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' },
    { exercise: '7', source_refs: refs['7'],
      basis: 'Solvent-assisted separation/formation of positive and negative ions differs from electron detachment in gas ionization.',
      conditions: 'Ionic crystals need not consist of neutral molecules; molecular weak electrolytes can react with solvent; gas attachment can also form negative ions; charge is conserved.',
      SCI: 'PENDING-INDEPENDENT-REVIEW', ZHEN: 'PENDING-INDEPENDENT-REVIEW' }
  ],
  priorTextPASSConsumedStatusOnly: { binding: sourceBindings[2], selected: statusOnly,
    notApprovalOfTheseNewAnswers: true },
  localChecks: {
    structure, delimiter: delimiterReceipt, katexSyntax: katexReceipt,
    onePassOnly: true, noFullGate2: true
  },
  coverage: candidate.coverage,
  unselectedTasks: {
    notAuthoredInThisBatch: candidate.coverage.unselectedExerciseIds,
    newlyClaimedCompleted: [], defaultTreatment: 'PENDING-OUTSIDE-THIS-BATCH-NOT-BLANKET-HOLD',
    existingCompletedEarlierWorkPreserved: true
  },
  retainedHolds: [
    { exercise: '1', status: 'HOLD', scope: 'Existing figure189 dependency; not read or changed.' },
    { exercise: '9', status: 'HOLD', scope: 'Existing discharge-type errata-authorization boundary; not read or changed.' }
  ],
  missingStages: ['First independent SCI/ZHEN review of these eight new displays',
    'Complete 16-task answer coverage/effective consolidation', 'Full gate2 and native answer finalize',
    'Actual full DISPLAY and publication'],
  completeAnswerKey: false, fullGate2PASS: false, wholeCardReady: false,
  nativeFinalizeRun: false, published: false, actualOpens: actual,
  images: { inherited: 24, new: 0, cumulative: 24, reset: false },
  oldFAILHOLDAndAllOtherAuthorsBytesPreserved: true,
  forbiddenOperationsPerformed: []
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
  authorUnit: 'existing-Locke-d310', status: authorStatus,
  candidates: bind(candidatePath), nativeCandidates, report, inputBindings,
  selectedSourceEvidence: selectedInputs, verifiedInputs: sourceBindings,
  artifacts: owned.map(item => ({ ...item, handoffMode: '0444' })),
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
  status: authorStatus, candidates: bind(candidatePath), nativeCandidates,
  inputBindings, report, authorFreeze: freeze,
  localChecks: { structureInvocations: 1, delimiterInvocations: 1,
    delimiterDisplayTexts: texts.length, katexInvocations: katexReceipt ? 1 : 0,
    formulaSpans: delimiterOutput?.spans.length ?? 0,
    delimiter: delimiterPass ? 'PASS' : 'FAIL', katex: katexPass ? 'PASS' : 'FAIL' },
  images: { new: 0, cumulative: 24 }, mode: '0444'
}, null, 2));
