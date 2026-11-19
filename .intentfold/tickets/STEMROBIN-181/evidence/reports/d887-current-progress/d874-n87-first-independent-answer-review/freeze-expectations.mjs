import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const T = path.join(R, '.intentfold/tickets/STEMROBIN-181');
const O = path.join(T, 'tmp/d874-n87-first-independent-answer-review');
assert.equal(process.cwd(), R);
for (let p = O; p !== path.dirname(p); p = path.dirname(p)) {
  assert(!fs.lstatSync(p).isSymbolicLink(), `Symlink boundary: ${p}`);
}
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const relative = p => path.relative(R, p);
const sourceDir = path.join(T, 'tmp/d836-source233-consume-n87-prepare');
const independentPath = path.join(T, 'tmp/d839-n87-first-independent-source-solutions/source-solutions.json');
const independentBytes = fs.readFileSync(independentPath);
assert.equal(sha(independentBytes), 'a164d8cba119369cb2ce5f7c0e8fd67565900afdf16c9fd777672732a3c84e2a');
const independent = JSON.parse(independentBytes);
const sourceExercisePath = path.join(sourceDir, 'root/10p/lessons/phy10-c2-s3-n87/exercises.json');
const sourceExercises = JSON.parse(fs.readFileSync(sourceExercisePath));
const bookPath = path.join(sourceDir, 'root/10p/book.json');
assert.equal(JSON.parse(fs.readFileSync(bookPath)).exercise_numbering, 'lesson');
assert.equal(sourceExercises.count, 6);
assert.equal(independent.solutions.length, 6);
const modern = Object.fromEntries(['zh', 'en'].map(locale => [
  locale,
  JSON.parse(fs.readFileSync(path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/exercises.template.json`))),
]));
const criteria = [
  [
    'Same suitably coherent source divided into two paths; equal frequency and stable relative phase.',
    'Do not confuse same colour of independent ordinary lamps with mutual coherence, or require equal amplitudes for coherence.',
    'Source coherence/path stability and compatible overlapping polarization are visibility conditions, not a numerical exercise.',
  ],
  [
    'Coherent superposition yields reinforcement and weakening dependent on relative phase.',
    'Any intensity formula must identify its coherence/polarization assumptions.',
    'A zero minimum requires matched amplitudes; unequal amplitudes leave residual intensity.',
    'Interference redistributes energy; dark regions do not establish heat generation or energy destruction.',
  ],
  [
    'For monochromatic light, frequency determines spectral colour; vacuum wavelength or wavelength in a specified common medium is equivalent.',
    'A stationary medium boundary leaves frequency unchanged even though wavelength and speed change.',
    'No assertion that every mixed/perceived colour has one wavelength.',
  ],
  [
    'Conditional thin-air-gap interpretation of crack faces; two reflected components select wavelengths of broadband light.',
    'Geometry, gap thickness, angle, spectrum and exact colours are not supplied source observations.',
    'For ordinary near-normal ice-air-ice reflection, only air-to-ice reverses phase; ice-to-air does not.',
    'If quantitative conditions are included, relative phase is 4*pi*n_gap*h*cos(theta_gap)/lambda0 + pi; reflection maxima and minima differ from a two-reversal coating.',
    'No unconditional iridescence for every crack, invented prism/rainbow construction or copied coating quarter-wave cancellation rule.',
  ],
  [
    'Answer no: frequency is conserved at the stationary boundary while speed and wavelength are divided by relative index n.',
    'Shorter in-water wavelength does not convert visible-frequency light into ultraviolet.',
    'Vision requires sufficient light; brightness, spectrum, sharpness and depth are not guaranteed unchanged.',
  ],
  [
    'List wavelength measurement, gas refractive-index measurement, surface flatness/machining inspection and antireflection coatings.',
    'Any coating explanation must distinguish normal-incidence air-film-glass two equal pi reflection shifts from Q4 one relative pi shift.',
    'Quarter-wave optical thickness sets opposite reflected phase; exact cancellation additionally requires amplitude matching and an ideal model.',
    'Do not endorse the literal integer-wave footnote as a valid cancellation rule under these conditions.',
    'Do not identify one tenth of an unspecified testing wavelength with a universal 10^-6 cm conversion; at 550 nm, one tenth is 55 nm, not 10 nm.',
    'Lossless reduction in reflection increases transmission; real absorption/other losses preclude unconditional all-energy transmission.',
  ],
];
const questions = sourceExercises.exercises.map((exercise, i) => {
  const solution = independent.solutions[i];
  assert.equal(solution.source_number, exercise.source_number);
  assert.equal(solution.original_question, exercise.text);
  assert.deepEqual(solution.source_refs, exercise.pages);
  for (const locale of ['zh', 'en']) {
    const e = modern[locale].exercises[i];
    assert.equal(e.number, exercise.number);
    assert.equal(e.source_number, exercise.source_number);
    assert.equal(e.group_id, exercise.group_id);
    assert.equal(e.source_text, exercise.text);
    assert.deepEqual(e.pages, exercise.pages);
    assert.deepEqual(e.figure_refs, []);
    assert.deepEqual(e.figures, []);
  }
  return {
    exercise: exercise.number,
    scoped_identity: `phy10-c2-s3-n87/${exercise.group_id}/${exercise.source_number}`,
    source_number: exercise.source_number,
    group_id: exercise.group_id,
    source_refs: exercise.pages,
    source_question: exercise.text,
    modern_questions: Object.fromEntries(['zh', 'en'].map(locale => [locale, modern[locale].exercises[i].text])),
    independent_solution_pointer: `/solutions/${i}`,
    independent_solution: solution,
    reviewer_criteria_before_candidate_read: criteria[i],
  };
});
const inputPaths = [
  independentPath,
  path.join(T, 'tmp/d839-n87-first-independent-source-solutions/verification.json'),
  ...independent.source_inputs.map(row => row.path),
  bookPath,
  ...['zh', 'en'].flatMap(locale => [
    path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/lesson.template.json`),
    path.join(T, `tmp/d858-n87-text-first-repair/candidate/${locale}/exercises.template.json`),
    path.join(T, `tmp/d837-n87-first-bilingual-text-author/candidate/${locale}/exercises.template.json`),
  ]),
  path.join(T, 'tmp/d858-n87-text-first-repair/n87-preauthor-source-requirements.v2.json'),
  path.join(T, 'tmp/d858-n87-text-first-repair/current-contract-bindings.json'),
  path.join(T, 'tmp/d858-n87-text-first-repair/input-preservation.json'),
  path.join(T, 'tmp/d858-n87-text-first-repair/input-bindings.json'),
  path.join(T, 'tmp/d849-n87-first-written-answer-author/input-hashes.json'),
  path.join(R, '.claude/skills/ld-s10y-answer/SKILL.md'),
  path.join(R, '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md'),
  path.join(R, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'),
  path.join(R, '.claude/skills/ld-s10y-lesson/tools/assemble.py'),
];
const inputs = [...new Set(inputPaths)].map(p => {
  assert(p.startsWith(`${R}/`));
  const bytes = fs.readFileSync(p);
  return { path: p, relative_path: relative(p), sha256: sha(bytes), bytes: bytes.length };
});
for (const row of independent.source_inputs) {
  assert.equal(inputs.find(input => input.path === row.path).sha256, row.sha256);
}
for (const locale of ['zh', 'en']) {
  const current = inputs.find(row => row.path.includes(`d858-n87-text-first-repair/candidate/${locale}/exercises`));
  const original = inputs.find(row => row.path.includes(`d837-n87-first-bilingual-text-author/candidate/${locale}/exercises`));
  assert.equal(current.sha256, original.sha256);
}
const frozenAt = new Date().toISOString();
const expectations = {
  schema: 'STEMROBIN-181/d874-independent-expectations-FIRST@1',
  status: 'FIRST-INDEPENDENT-EXPECTATIONS-FROZEN-BEFORE-CANDIDATE-READ',
  frozen_at_utc: frozenAt,
  R, T, O,
  card: 'phy10-c2-s3-n87',
  book: '10p',
  exercise_numbering: 'lesson',
  independent_source: { path: independentPath, sha256: sha(independentBytes) },
  independence: {
    author_answer_candidates_read_at_this_stage: false,
    author_self_solutions_read: false,
    expectations_origin: 'Only d839 frozen independent solutions; raw source and d858 exercise identities establish correspondence. Repaired prose is context, not a replacement expectation source.',
    prior_d839_pre_author_freeze: independent.status,
    prior_d839_verification_utc: '2026-11-19T00:12:05.103Z',
    chronology_limit: 'This record establishes local read order. The prior pre-author derivation is the d839 declaration plus bound verification, not a filesystem-wide forensic proof.',
  },
  grading_contract: {
    all_six: 'derived/ungraded',
    displayAnswer: 'Nonempty, correct and explanatory for every question.',
    automatic_grading_allowed: false,
    parts: 'Empty or absent for these qualitative ungraded tasks; no judge/expected grading payload. Explanatory subparts may be prose.',
    native_finalize_publish: 'Not authorized; not run. Auto-specific gate2 MathLive checks are inapplicable.',
  },
  image_declaration: {
    required_question_images: 0,
    loaded: 0,
    created: 0,
    image_batches: 0,
    per_batch_limit: 8,
    context_limit: 24,
    reason: 'All six source and modern exercises have empty figure_refs/figures and no task-specific figure request. Source figure blocks 201/202 have owner_exercise=null.',
  },
  questions,
};
const writeNew = (name, data) => fs.writeFileSync(
  path.join(O, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' },
);
writeNew('expectations-FIRST.json', expectations);
writeNew('input-bindings-pre-candidate-FIRST.json', {
  schema: 'STEMROBIN-181/d874-pre-candidate-input-bindings@1',
  captured_at_utc: frozenAt,
  algorithm: 'sha256',
  source_inputs_match_d839: true,
  d858_exercise_bytes_equal_d837: { zh: true, en: true },
  inputs,
});
console.log(JSON.stringify({
  status: expectations.status,
  frozen_at_utc: frozenAt,
  questions: questions.length,
  input_files: inputs.length,
  expectations_sha256: sha(fs.readFileSync(path.join(O, 'expectations-FIRST.json'))),
  input_bindings_sha256: sha(fs.readFileSync(path.join(O, 'input-bindings-pre-candidate-FIRST.json'))),
  output_root: O,
}, null, 2));
