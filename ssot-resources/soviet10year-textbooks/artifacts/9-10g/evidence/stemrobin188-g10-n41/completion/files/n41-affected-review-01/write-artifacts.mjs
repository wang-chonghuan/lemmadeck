import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
assert.equal(process.cwd(), cwd);
const out = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n41-affected-review-01');
const manifestPath = path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n41-affected-review-inputs-01/manifest.json');
const bytes = new Map();
const loadBytes = p => {
  assert.equal(path.normalize(p), p);
  assert.ok(p.startsWith(cwd + '/'), `Not a current-checkout input: ${p}`);
  if (!bytes.has(p)) bytes.set(p, fs.readFileSync(p));
  return bytes.get(p);
};
const json = p => JSON.parse(loadBytes(p).toString('utf8'));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const manifest = json(manifestPath);
const select = suffix => {
  const found = manifest.bindings.filter(b => b.path.endsWith(suffix));
  assert.equal(found.length, 1, suffix);
  return found[0].path;
};
const entries = [
  { path: manifestPath }, ...manifest.bindings, manifest.answerCandidate,
  manifest.choice.seed, manifest.choice.draft, manifest.choice.inheritedReview,
  manifest.visual.inheritedText, ...manifest.visual.screenshots,
];
const inputs = [...new Map(entries.map(b => [b.path, b])).values()].map(b => {
  const data = loadBytes(b.path);
  const actual = sha(data);
  if (b.sha256) assert.equal(actual, b.sha256, b.path);
  return {
    path: b.path, sha256: actual, bytes: data.length,
    ...(b.resolution ? { resolution: b.resolution } : {}),
  };
});
const binding = p => {
  const b = inputs.find(b => b.path === p);
  assert.ok(b, `Input not named by manifest: ${p}`);
  return { path: b.path, sha256: b.sha256, bytes: b.bytes };
};
// Match the skill's canonical JSON contract, including ASCII string escaping.
const canonical = value => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value !== null && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(k => canonical(k) + ':' + canonical(value[k])).join(',') + '}';
  }
  if (typeof value === 'string') {
    return JSON.stringify(value).replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
  }
  return JSON.stringify(value);
};
const digest = v => sha(Buffer.from(canonical(v), 'utf8'));
const equality = (before, after) => {
  assert.equal(canonical(before), canonical(after));
  return { before_sha256: digest(before), after_sha256: digest(after), canonical_bytes_identical: true };
};
const changes = (a, b, prefix = '') => {
  if (canonical(a) === canonical(b)) return [];
  if (a === undefined || b === undefined || a === null || b === null ||
      typeof a !== 'object' || typeof b !== 'object') {
    return [{ path: prefix, before: a ?? null, after: b ?? null, before_present: a !== undefined, after_present: b !== undefined }];
  }
  return [...new Set([...Object.keys(a), ...Object.keys(b)])]
    .flatMap(k => changes(a[k], b[k], prefix + '/' + k));
};
const reviewer = {
  kind: 'independent_agent',
  identity: 'SAME188-6 / STEMROBIN-188 sole independent affected reviewer; current Codex reviewer, neither author; previous Singer closed',
};
const oldAnswerPath = select('/before/answer-keys.candidate.json');
const oldAnswer = json(oldAnswerPath);
const candidate = json(manifest.answerCandidate.path);
const priorAnswerPath = select('/n41-answer-choice-review-01/answer-review.json');
const priorAnswer = json(priorAnswerPath);
const priorReportPath = select('/n41-answer-choice-review-01/report.json');
const priorReport = json(priorReportPath);
const priorVisual = json(manifest.visual.inheritedText.path);
const priorChoice = json(manifest.choice.inheritedReview.path);
const oldSeedPath = select('/n41-choice-author/seed.json');
const oldDraftPath = select('/n41-choice-author/draft.json');
const oldSeed = json(oldSeedPath);
const newSeed = json(manifest.choice.seed.path);
const oldDraft = json(oldDraftPath);
const newDraft = json(manifest.choice.draft.path);
const lessonPath = select('/modern-us-neutral/lessons/geo910-c1-s3-n41/lesson.json');
const exercisesPath = select('/modern-us-neutral/lessons/geo910-c1-s3-n41/exercises.json');
const beforeExercisesPath = select('/before/modern/exercises.json');
const figuresPath = select('/modern-us-neutral/lessons/geo910-c1-s3-n41/figures.json');
const lesson = json(lessonPath);
const modern = json(exercisesPath);
const beforeModern = json(beforeExercisesPath);
const numbers = Array.from({ length: 14 }, (_, i) => String(391 + i));
const affected = ['392', '397'];
const changedSources = ['391', '392', '393', '394', '395', '396', '397'];
const duplicateNumbers = changedSources.filter(n => n !== '395');
assert.deepEqual(candidate.answers.map(a => a.exercise), numbers);
assert.deepEqual(oldAnswer.answers.map(a => a.exercise), numbers);
assert.equal(candidate.count, 14);
assert.equal(priorAnswer.candidate.sha256, binding(oldAnswerPath).sha256);
assert.equal(priorAnswer.outcome, 'revise');
assert.equal(priorAnswer.counts.mathematics_pass, 14);
assert.equal(priorAnswer.counts.displayed_solution_pass, 14);
const answerDiff = changes(oldAnswer, candidate);
assert.deepEqual([...new Set(answerDiff.map(d => d.path.split('/')[2]))], ['1', '6']);
assert.ok(answerDiff.every(d => /^\/answers\/(?:1|6)\/(?:grading|parts|notes)(?:\/|$)/.test(d.path)));
const answerRows = numbers.map((exercise, i) => {
  const before = oldAnswer.answers[i], after = candidate.answers[i];
  const prior = priorAnswer.reviews.find(r => r.exercise === exercise);
  assert.equal(prior.mathematics.verdict, 'pass');
  assert.equal(prior.displayed_proof_or_construction.verdict, 'pass');
  assert.equal(before.displayAnswer, after.displayAnswer);
  const displayHash = sha(Buffer.from(after.displayAnswer, 'utf8'));
  const allowed = affected.includes(exercise) ? new Set(['grading', 'parts', 'notes']) : new Set();
  const beforeStable = Object.fromEntries(Object.entries(before).filter(([k]) => !allowed.has(k)));
  const afterStable = Object.fromEntries(Object.entries(after).filter(([k]) => !allowed.has(k)));
  return {
    exercise, displayAnswer_utf8_sha256_before: displayHash, displayAnswer_utf8_sha256_after: displayHash,
    displayAnswer_and_embedded_derivation_byte_identical: true,
    unchanged_fields: equality(beforeStable, afterStable),
    ...(!allowed.size ? { whole_answer_key: equality(before, after) } : {}),
    inherited_mathematics: prior.mathematics,
    inherited_displayed_proof_or_construction: prior.displayed_proof_or_construction,
  };
});
for (const n of affected) {
  const row = candidate.answers.find(a => a.exercise === n);
  assert.equal(row.grading, 'ungraded');
  assert.deepEqual(row.parts, []);
  assert.ok(row.notes.includes('without automatic correctness grading'));
}
const gradingCounts = {
  exercises: candidate.answers.length,
  auto: candidate.answers.filter(a => a.grading === 'auto').length,
  ungraded: candidate.answers.filter(a => a.grading === 'ungraded').length,
  parts: candidate.answers.reduce((n, a) => n + a.parts.length, 0),
  exact_parts: candidate.answers.flatMap(a => a.parts).filter(p => p.judge === 'exact').length,
  numeric_parts: candidate.answers.flatMap(a => a.parts).filter(p => p.judge === 'numeric').length,
  expression_parts: candidate.answers.flatMap(a => a.parts).filter(p => p.judge === 'expression').length,
  exact_accepted_forms: candidate.answers.flatMap(a => a.parts).filter(p => p.judge === 'exact').reduce((n, p) => n + p.expected.length, 0),
};
assert.deepEqual(gradingCounts, { exercises: 14, auto: 6, ungraded: 8, parts: 14, exact_parts: 5, numeric_parts: 9, expression_parts: 0, exact_accepted_forms: 10 });
assert.equal(digest(oldSeed), priorChoice.seed_sha256);
assert.equal(digest(oldDraft), priorChoice.draft_sha256);
assert.equal(digest(newSeed), manifest.choice.seedSha256);
assert.equal(digest(newDraft), manifest.choice.draftSha256);
assert.equal(newDraft.seed_sha256, digest(newSeed));
assert.equal(priorChoice.outcome, 'pass');
assert.equal(priorChoice.source_reviews.length, 14);
assert.equal(priorChoice.question_reviews.length, 14);
const seedDiff = changes(oldSeed, newSeed);
assert.deepEqual(seedDiff.map(d => d.path), changedSources.map((_, i) => `/exercises/${i}/text`).concat('/trace/2/sha256'));
assert.deepEqual(changes(oldDraft, newDraft).map(d => d.path), ['/seed_sha256']);
const frozenDraft = equality(
  Object.fromEntries(Object.entries(oldDraft).filter(([k]) => k !== 'seed_sha256')),
  Object.fromEntries(Object.entries(newDraft).filter(([k]) => k !== 'seed_sha256')),
);
const project = item => ({
  number: item.number,
  text: (item.group && item.group.trim() ? item.group + '\n' : '') + item.text,
  figure_ids: [...new Set([...(item.figure_refs ?? []), ...(item.figures ?? []).map(f => f.id)])],
});
assert.deepEqual(newSeed.exercises, modern.exercises.map(project));
assert.deepEqual(oldSeed.exercises, beforeModern.exercises.map(project));
const sourceTransitions = changedSources.map(n => {
  const before = oldSeed.exercises.find(e => e.number === n);
  const after = newSeed.exercises.find(e => e.number === n);
  const projected = modern.exercises.map(project).find(e => e.number === n);
  const expected = n === '395'
    ? before.text.replace('\uff1a$', '\uff1a\n$')
    : before.text.replace(n + '\uff0e', n + '.');
  assert.equal(after.text, expected);
  assert.deepEqual(after, projected);
  return {
    source_number: n, before_text: before.text, after_text: after.text,
    before_text_utf8_sha256: sha(Buffer.from(before.text, 'utf8')),
    after_text_utf8_sha256: sha(Buffer.from(after.text, 'utf8')),
    current_projection_text_utf8_sha256: sha(Buffer.from(projected.text, 'utf8')),
    exact_transition: n === '395' ? 'Insert one newline before the unchanged four-summand formula.' : 'Change only the printed number fullwidth period to ASCII period.',
    current_projection_byte_identical: true,
  };
});
assert.deepEqual(newSeed.concepts, newSeed.concepts.map(c => ({ block: c.block, text: lesson.prose[c.block].text })));
for (const n of numbers) {
  const a = beforeModern.exercises.find(e => e.number === n);
  const b = modern.exercises.find(e => e.number === n);
  const omit = new Set(['text', 'lines', 'changes']);
  equality(Object.fromEntries(Object.entries(a).filter(([k]) => !omit.has(k))),
    Object.fromEntries(Object.entries(b).filter(([k]) => !omit.has(k))));
  assert.deepEqual(b.lines, b.text.split('\n'));
  if (!changedSources.includes(n)) equality(a, b);
}
const modernDiff = changes(beforeModern, modern);
assert.ok(modernDiff.every(d => /^\/exercises\/[0-6]\/(?:text|lines|changes)(?:\/|$)/.test(d.path)));
const frozenQuestionRows = newDraft.questions.map((q, i) => ({
  question_id: q.id, whole_question: equality(oldDraft.questions[i], q),
  view: equality(oldDraft.questions[i].view, q.view),
  options: equality(oldDraft.questions[i].view.options, q.view.options),
  key: equality(oldDraft.questions[i].key, q.key),
}));
const frozenSeedRows = {
  source: equality(oldSeed.source, newSeed.source),
  definitions: equality(oldSeed.concepts, newSeed.concepts),
  figures: equality(oldSeed.figures, newSeed.figures),
  coverage: equality(oldDraft.coverage, newDraft.coverage),
  new_figures: equality(oldDraft.new_figures, newDraft.new_figures),
};
const traceTransition = changes(oldSeed.trace, newSeed.trace);
assert.deepEqual(traceTransition.map(d => d.path), ['/2/sha256']);
assert.equal(newSeed.trace[2].sha256, binding(exercisesPath).sha256);
assert.equal(oldSeed.trace[2].sha256, binding(beforeExercisesPath).sha256);
for (const t of newSeed.trace.slice(1)) {
  const p = path.join(cwd, t.path);
  assert.equal(binding(p).sha256, t.sha256);
}
for (const figure of newSeed.figures) {
  for (const asset of figure.assets) assert.equal(binding(path.join(cwd, asset.path)).sha256, asset.sha256);
}
const serializationNote = 'The supplied JSON files have different indentation/serialization bytes. Whole-file SHA256s are not claimed identical. Frozen structured content is byte-identical under the skill-mandated canonical JSON serialization; every decoded prose/formula string is also compared exactly. No formatting change is treated as a semantic rerun.';
const preserved = {
  previous_report: binding(priorReportPath),
  previous_answer_review: binding(priorAnswerPath),
  previous_choice_review: binding(manifest.choice.inheritedReview.path),
  previous_visual_review: binding(manifest.visual.inheritedText.path),
  original_overall_outcome: priorReport.outcome,
  original_scope_outcomes: priorReport.outcomes,
  original_scope_specific_failures: priorReport.findings,
  previous_visual_outcome: priorVisual.outcome,
  whole_page_source_status: 'HOLD',
  whole_page_sourceApproved: priorReport.original_failures_and_holds.prior_whole_pages_sourceApproved,
  prior_source_holds: priorReport.original_failures_and_holds.prior_source_holds,
  prerequisite_resolution: binding(select('/prerequisites/bindings.json')),
  inherited_binding_resolution: binding(select('/inherited-binding-resolution.json')),
  original_184_tree_read: false,
  original_failure_receipts: 'Remain in the bound previous report and their original files, unmodified; no failed stage is silently approved.',
  repair_counters: {
    ...priorReport.preserved_repair_counters,
    parent_answer_content_repair: 1,
    exercise_presentation_repair: 1,
  },
  historyReset: false, old_reviews_rewritten: false, published: false,
};
assert.equal(preserved.original_overall_outcome, 'revise');
assert.equal(preserved.previous_visual_outcome, 'revise');
assert.equal(preserved.whole_page_sourceApproved, false);
const inputBindings = {
  manifest: binding(manifestPath), candidate: binding(manifest.answerCandidate.path),
  before_candidate: binding(oldAnswerPath),
  original_author_candidate: binding(select('/n41-answer-author/answer-keys.candidate.json')),
  original_source_projection: binding(select('/source-with-conventions.json')),
  current_lesson: binding(lessonPath), before_exercises: binding(beforeExercisesPath),
  current_exercises: binding(exercisesPath), current_figures: binding(figuresPath),
  repair: binding(select('/n41-answer-display-repair-01/repair.json')),
  modern_transition: binding(select('/modern-transition.json')),
  prerequisite_resolution: preserved.prerequisite_resolution,
  inherited_binding_resolution: preserved.inherited_binding_resolution,
};
const answerReview = {
  schema: 'same188-6/independent-answer-review@1', status: 'pass', outcome: 'pass',
  reviewer, cwd, book: '9-10g', lesson: manifest.lesson,
  scope: 'Affected-only semantic review of 392/397 auto-to-ungraded contract, empty parts and explanatory notes; all14 mathematics/display derivations inherited, other12 keys unchanged.',
  candidate: binding(manifest.answerCandidate.path), input_bindings: inputBindings,
  inherited_mathematical_review: {
    binding: binding(priorAnswerPath), original_candidate_binding: priorAnswer.candidate,
    mathematics_pass: 14, displayed_solution_pass: 14,
    review_rows_reused: 14, new_derivations: 0, old_grading_failures_not_rewritten: true,
    author_frozen_derivations_binding_inherited_not_reopened: priorAnswer.author_frozen_derivations,
  },
  whole_candidate_diff: answerDiff, unchanged_answer_evidence: answerRows,
  affected_reviews: [
    {
      exercise: '392', status: 'pass', before: { grading: 'auto', parts: 2 },
      after: { grading: 'ungraded', parts: 0 },
      notes: candidate.answers.find(a => a.exercise === '392').notes,
      evidence: 'Both lexical exact interval parts and their expected forms are removed. Both open ranges and full necessity/sufficiency explanation remain byte-identical. The note explicitly admits equivalent interval notation is not reliably recognized. This avoids claiming automatic correctness for an unconstrained interval response; it does not repair or approve the old exact judge.',
    },
    {
      exercise: '397', status: 'pass', before: { grading: 'auto', parts: 1 },
      after: { grading: 'ungraded', parts: 0 },
      notes: candidate.answers.find(a => a.exercise === '397').notes,
      evidence: 'The symbolic expression part and both expected forms are removed. The distance and regular-tetrahedron derivation remain byte-identical. The note correctly identifies the nonnegative distance parameter and missing domain-aware equivalence contract. This is an honest non-auto contract, not a claim that the expression judge now accepts equivalent radicals.',
    },
  ],
  capacity: { before: { auto: 8, ungraded: 6 }, after: { auto: 6, ungraded: 8 }, loss: 'Two fewer automatically graded exercises; standard answers and derivations remain available for all14.' },
  counts: gradingCounts, serialization_note: serializationNote,
  gate2: {
    affected_semantic_contract: 'pass', full_gate2_approved: false,
    exact_input_chain: 'Not run or approved here. The remaining10 accepted forms across5 exact parts still require separately authorized real MathLive keyboard/edit/serialization evidence.',
    finalize: 0, MathLive: 0, grading_probes: 0, publish: 0,
  },
  preserved_history: preserved,
};
const traceReview = {
  schema: 'same188-6/independent-choice-trace-review@1', status: 'pass', reviewer, cwd,
  lesson: manifest.lesson,
  scope: 'Seven presentation-only source-text transitions and one exercise trace hash; inherited choice semantic rows, no whole semantic rerun.',
  input_manifest: binding(manifestPath),
  seed: binding(manifest.choice.seed.path), draft: binding(manifest.choice.draft.path),
  before_seed: binding(oldSeedPath), before_draft: binding(oldDraftPath),
  seed_sha256: digest(newSeed), draft_sha256: digest(newDraft),
  inherited_review: binding(manifest.choice.inheritedReview.path),
  before_seed_sha256: digest(oldSeed), before_draft_sha256: digest(oldDraft),
  current_source_bindings: [binding(lessonPath), binding(exercisesPath), binding(figuresPath)],
  before_source_exercises: binding(beforeExercisesPath),
  exact_source_transitions: sourceTransitions, seed_diff: seedDiff,
  source_exercise_json_diff: modernDiff,
  source_metadata_note: 'text and synchronized lines change only at391-397; changes adds layout for393/394/395/396/397. All source_text, pages, numbering, groups, numeric changes and figure references remain unchanged. Unaffected398-404 source objects are canonically byte-identical.',
  trace_transition: traceTransition,
  catalogue_trace: {
    path: path.join(cwd, newSeed.trace[0].path), sha256: newSeed.trace[0].sha256,
    status: 'Unchanged historical index snapshot reused, not read or asserted equal to a mutable live index.',
  },
  frozen_draft_except_seed_hash: frozenDraft, frozen_questions: frozenQuestionRows,
  frozen_definitions_figures_coverage: frozenSeedRows,
  inherited_rows: { source_reviews: 14, question_reviews: 14, options: 58, true: 19, false: 39, semantic_reruns: 0 },
  inherited_figure_checks: 'Both original rows reused exactly; assets retain their bound bytes. No figures or source pages opened.',
  serialization_note: serializationNote,
  original_overall_REVISE_preserved: true, original_source_HOLD_preserved: true,
  choice_author_revision: 1, historyReset: false,
};
const exerciseObservations = [
  ['391', 'All three triples100/120/10,80/50/30,125/120/115 and endings visible. One left391 label only.'],
  ['392', 'Both70/80 and100/120 cases and full range request visible. One392 label only.'],
  ['393', 'All-right face premise and dihedral degree request complete. One393 label only.'],
  ['394', 'Total180 degrees and all-acute proof request complete. One394 label only.'],
  ['395', 'Desktop has ACB+CBD+BDA+DAC<360 degrees complete. Mobile initial shows all four summands and strict<; right endpoint supplies full360-degree bound. Overlapping CBD/BDA/DAC confirm one continuous unchanged formula.'],
  ['396', 'Both45-degree faces, right dihedral premise and third-face request complete. One396 label only.'],
  ['397', 'All60-degree faces, parameter a, point on edge and opposite-plane distance request complete. One397 label only.'],
  ['398', 'Two60-degree and one90-degree faces and full opposite-edge plane-inclination request visible through sentence ending.'],
  ['399', 'Complete locus request for points equidistant from all trihedral edges visible.'],
  ['400', 'alpha,beta,gamma premise and cos(alpha)+cos(beta)+cos(gamma)>-3/2 visible with strict sign and minus fraction.'],
  ['401', 'Both face-angle bisectors and third supplementary-angle bisector coplanarity request complete.'],
  ['402', 'Both complete data sequences80/130/70/100 and10/20/40/80/160 visible, including final values.'],
  ['403', 'SABCD, all face angles and ASC equal60 degrees and full dihedral degree request visible.'],
  ['404', 'Convex four-faced angle and parallelogram-section construction request complete; bottom row and return button present.'],
].map(([exercise, evidence]) => ({ exercise, verdict: 'pass', evidence }));
const dimensions = p => ({ width: loadBytes(p).readUInt32BE(16), height: loadBytes(p).readUInt32BE(20) });
const screenBindings = manifest.visual.screenshots.map(s => binding(s.path));
const machinePath = select('/n41-exercise-display-repair-01/result.json');
const machine = json(machinePath);
const endpoint = machine.results.find(r => r.kind === 'exercise395-right-end').endpoint;
assert.deepEqual(endpoint.before, { left: 0, width: 310, scrollWidth: 349 });
assert.deepEqual(endpoint.after, { left: 39, width: 310, scrollWidth: 349 });
assert.ok(endpoint.right <= endpoint.containerRight);
const textSurfaces = priorVisual.surfaces.filter(s => s.kind === 'text');
assert.equal(textSurfaces.length, 2);
for (const s of textSurfaces) {
  assert.equal(s.outcome, 'pass');
  assert.equal(binding(s.screenshot.path).sha256, s.screenshot.sha256);
}
assert.equal(priorVisual.source_lesson_sha256, binding(lessonPath).sha256);
const visualReview = {
  schema: 'same188-6/independent-visual-observation@1', status: 'pass', outcome: 'pass',
  reviewer, cwd, lesson: manifest.lesson,
  scope: 'Only three supplied fullframe PNGs: new desktop exercises, new mobile exercises, mobile395 actual scroll right endpoint. Two text-only PASS surfaces inherited with zero opens.',
  input_manifest: binding(manifestPath), source_bindings: [binding(lessonPath), binding(exercisesPath), binding(figuresPath)],
  machine_result: binding(machinePath),
  method: 'functions.view_image opened each of the three full files exactly once, without crops/reopens or screenshot generation. PNG dimensions read from headers only. Pixels judged independently; machine-pass labels are not substituted for visual approval.',
  surfaces: [
    {
      kind: 'exercises', viewport: { width: 1440, height: 960 }, screenshot: screenBindings[0],
      dimensions: dimensions(screenBindings[0].path), outcome: 'pass',
      observation: 'All14 rows391-404 present in the full1505px frame, title and return button included. Six duplicate body numbers removed.395 has a separate formula line with all four summands and strict360-degree bound visible at once. No right/bottom clipping or overlap observed.',
    },
    {
      kind: 'exercises', viewport: { width: 390, height: 844 }, screenshot: screenBindings[1],
      dimensions: dimensions(screenBindings[1].path), outcome: 'pass',
      observation: 'All14 rows391-404, complete body endings for other13 exercises and bottom return button present in the full1893px frame. Six duplicate body numbers removed.395 initial formula viewport shows completeACB,CBD,BDA,DAC and strict< but only the start of360; the end is not fully visible without horizontal scrolling.',
      initial_395_bound_fully_visible: false, complete_395_accessible_with_endpoint: true,
    },
    {
      kind: 'exercise395-right-end', viewport: { width: 390, height: 844 }, screenshot: screenBindings[2],
      dimensions: dimensions(screenBindings[2].path), outcome: 'pass', endpoint,
      observation: 'At the actual right endpoint, CBD+BDA+DAC<360 degrees and final punctuation are visible inside the exercise cell. The left edge cuts the beginning ofACB, as expected when scrolled39px; CBD/BDA/DAC overlap the initial frame. Combined views show every summand and the full strict relation without shrinking or changing the formula.',
    },
  ],
  exercise_observations: exerciseObservations,
  numbering_fixes: { exercises: duplicateNumbers, desktop: 'pass', mobile: 'pass', evidence: 'Each of the six rows has one left identifier and no repeated body number in either fresh fullframe.' },
  overflow_accessibility: {
    status: 'pass',
    basis: 'Existing real overflow container and supplied initial/right endpoint evidence; no new browser interaction performed.',
    initial_left: 0, maximum_left: 39, client_width: 310, scroll_width: 349,
    full_relation_simultaneously_visible_on_mobile: false,
    full_relation_accessible_by_horizontal_scroll: true,
    judgment: 'The old alleged loss of the right bound is genuinely accessible in the revised presentation. This is a scoped accessibility PASS, not a claim that the initial mobile frame is unclipped or that the entire expression fits simultaneously.',
  },
  inherited_text: {
    review: binding(manifest.visual.inheritedText.path), scope: 'Only the two kind=text surfaces whose outcome is pass.',
    lesson_source_unchanged: true, screenshots_byte_unchanged: true, image_opens_here: 0,
    surfaces: textSurfaces,
    inherited_figures_are_not_new_reviews: true,
  },
  old_visual_REVISE: { binding: binding(manifest.visual.inheritedText.path), outcome: 'revise', modified: false },
  counts: { image_opens: 3, fresh_context_image_total: 3, image_limit: 3, desktop_fullframes: 1, mobile_fullframes: 2, exercises_visible: 14, numbering_fixes: 6, text_surfaces_reused: 2, text_image_opens: 0, source_image_opens: 0, crops: 0, reopens: 0, screenshot_regeneration: 0, browser_calls: 0 },
  preserved_history: preserved,
};
const emit = (name, content) => {
  const destination = path.join(out, name);
  assert.equal(path.dirname(destination), out);
  fs.writeFileSync(destination, content, { flag: 'wx' });
  return { path: destination, sha256: sha(fs.readFileSync(destination)), bytes: fs.statSync(destination).size };
};
const emitJSON = (name, value) => emit(name, JSON.stringify(value, null, 2) + '\n');
// Only these top-level strings change; inherited review rows retain their literal file bytes.
let choiceText = loadBytes(manifest.choice.inheritedReview.path).toString('utf8');
for (const [oldText, newText] of [
  [`"seed_sha256": "${priorChoice.seed_sha256}"`, `"seed_sha256": "${digest(newSeed)}"`],
  [`"draft_sha256": "${priorChoice.draft_sha256}"`, `"draft_sha256": "${digest(newDraft)}"`],
  [JSON.stringify(priorChoice.reviewer.identity), JSON.stringify(reviewer.identity)],
]) {
  assert.equal(choiceText.split(oldText).length, 2);
  choiceText = choiceText.replace(oldText, newText);
}
const adoptedChoice = JSON.parse(choiceText);
assert.deepEqual(adoptedChoice.source_reviews, priorChoice.source_reviews);
assert.deepEqual(adoptedChoice.question_reviews, priorChoice.question_reviews);
assert.deepEqual(adoptedChoice.figure_checks, priorChoice.figure_checks);
assert.deepEqual(adoptedChoice.new_figure_reviews, priorChoice.new_figure_reviews);
assert.equal(adoptedChoice.outcome, 'pass');
traceReview.inherited_rows.literal_review_row_bytes_preserved = true;
traceReview.inherited_rows.source_reviews_sha256 = digest(priorChoice.source_reviews);
traceReview.inherited_rows.question_reviews_sha256 = digest(priorChoice.question_reviews);
const generated = [
  emitJSON('answer-review.json', answerReview),
  emit('review.json', choiceText),
  emitJSON('trace-review.json', traceReview),
  emitJSON('visual-observation.json', visualReview),
];
const counters = {
  new_answer_derivations: 0, new_grading_probes: 0, inherited_math_display_pass: 14,
  affected_answer_contracts: 2, inherited_choice_source_reviews: 14, inherited_choice_question_reviews: 14,
  choice_semantic_reruns: 0, choice_source_presentation_transitions: 7,
  image_opens: 3, fresh_context_images: 3, text_image_opens: 0, original_figure_page_opens: 0,
  crops: 0, reopens: 0, new_screenshots: 0, inherited_previous_context_image_opens: 8,
  image_opens_across_previous_and_current_reviews: 11,
  checker_renderer_validator_review_record_reruns: 0, freshness_setup_Grill: 0,
  installs: 0, database: 0, env: 0, model: 0, paid: 0, network: 0,
  Git: 0, backend: 0, core_writes: 0, peer_messages: 0, subdelegates: 0,
  finalize: 0, MathLive: 0, publication: 0, reviewer_content_repairs: 0,
  read_only_inventory_missing_output_directory: 1,
};
const report = {
  schema: 'same188-6/independent-affected-review-report@1',
  generated_at: new Date().toISOString(), reviewer, cwd, ticket: 'STEMROBIN-188', batch: 'SAME188-6',
  lesson: manifest.lesson, status: 'pass', outcome: 'pass',
  scope: 'Only the authorized answer392/397 contract, seven choice source presentation/trace transitions, and three new exercise fullframes.',
  outcomes: { answer_affected_nonauto_contract: 'pass', choice_inherited_semantics_current_binding: 'pass', choice_trace_transition: 'pass', exercise_visual_accessibility: 'pass', text_only_inherited_scoped_surfaces: 'pass', previous_overall: 'revise', previous_visual: 'revise', whole_page_source: 'HOLD', full_gate2: 'not-approved', published: false },
  capacity: { auto: 6, ungraded: 8, mathematics_and_display_solutions_reused: 14, original_auto: 8, original_ungraded: 6 },
  input_manifest: binding(manifestPath), normalized_input_bindings: inputs,
  output_bindings: generated, canonical_snapshots: { seed_sha256: digest(newSeed), draft_sha256: digest(newDraft) },
  inherited_review_rows: { source: 14, question: 14, exact_literal_row_bytes_preserved: true, figure_checks: 2, new_figure_reviews: 0 },
  frozen_content: { draft_except_seed_hash: frozenDraft, questions: frozenQuestionRows, seed_fields_and_coverage: frozenSeedRows },
  serialization_note: serializationNote,
  preserved_history: preserved, counters,
  technical_discovery: 'The initial read-only rg inventory reported the not-yet-created own output directory absent. It did not run any producer or change any content counter.',
  required_work_not_authorized_here: 'No full Gate2/MathLive, finalize, retention, publication or source whole-page approval. New scoped passes neither overwrite the old overall REVISE nor approve old failing judge contracts.',
};
generated.push(emitJSON('report.json', report));
const markdown = [
  '# N41 Affected Independent Review',
  '',
  'Affected scope: PASS. Previous overall REVISE, old visual REVISE and all scope-specific failure records remain unchanged. Whole-page source HOLD remains; no publication or full Gate2 approval.',
  '',
  '## Answers',
  '',
  '392/397 now declare ungraded, have no judging parts, and explicitly explain the unsupported interval/domain equivalence contracts. All14 displayAnswer strings and embedded derivations are byte-identical; the other12 keys and every other candidate field are unchanged under canonical JSON. The previous14 independent mathematical/display PASS results are inherited, not re-solved. Capacity is explicitly6auto/8ungraded, previously8auto/6ungraded.',
  '',
  '## Choice And Trace',
  '',
  'Only six printed-number punctuation changes and one newline before395 are reflected in the seed. All14 source projections match current exercise prose exactly; only the exercise trace hash changes. Draft content changes only seed_sha256. All14 questions,58 options,keys,coverage,definitions and figure content are canonically byte-identical; actual figure asset bytes are unchanged. All14 source_reviews and14 question_reviews plus both figure checks retain their literal previous review bytes in the new standard review.json.',
  '',
  `New seed canonical SHA256: ${digest(newSeed)}`,
  `New draft canonical SHA256: ${digest(newDraft)}`,
  '',
  serializationNote,
  '',
  '## Visual',
  '',
  'Exactly3 provided PNGs opened once each, zero crops/reopens/regeneration. Both fresh exercise fullframes show all14 rows and fix all6 duplicate numbers. Desktop395 shows ACB+CBD+BDA+DAC<360 degrees complete. Mobile initial shows all4 summands and strict< but cuts the final bound; actual39px scroll endpoint reveals full<360 degrees. Shared middle terms demonstrate continuous access through the existing310px container with349px scrollWidth. Scoped accessibility PASS does not claim simultaneous full mobile visibility. Two unchanged text-only PASS surfaces reused with zero opens.',
  '',
  '## History And Boundaries',
  '',
  'fig160 repair1/1,fig161 repair0/1,choice-author revision1,parent answer repair1,exercise presentation repair1 remain. All8 source holds and previous specific failures remain. Only normalized current manifest input paths were read; original184 tree not read. No checker/renderer/validator/review-record reruns, grading probes, setup/freshness/Grill, DB/env/install/model/paid/network/Git/backend/core changes, messages, delegation, finalize or MathLive.',
  '',
  '## Input And Output Hashes',
  '',
  ...inputs.map(b => `${b.path} SHA256 ${b.sha256}`),
  '',
  ...generated.map(b => `${b.path} SHA256 ${b.sha256}`),
  '',
].join('\n');
generated.push(emit('report.md', markdown));
emitJSON('delivery-hashes.json', {
  schema: 'same188-6/affected-review-delivery-hashes@1', status: 'pass',
  files: generated,
  emission_script: { path: path.join(out, 'write-artifacts.mjs'), sha256: sha(fs.readFileSync(path.join(out, 'write-artifacts.mjs'))) },
});
console.log(JSON.stringify({ status: 'pass', outputs: generated, seed_sha256: digest(newSeed), draft_sha256: digest(newDraft), capacity: gradingCounts, image_opens: 3, previous_overall: 'revise', source: 'HOLD' }, null, 2));
