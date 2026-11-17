import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(own, '../../../../..');
const scripts = path.join(repo, '.agents/skills/ld-s10y-choice/scripts');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = target => JSON.parse(fs.readFileSync(target, 'utf8'));
const write = (target, value) =>
  fs.writeFileSync(target, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const environment = { ...process.env, PYTHONDONTWRITEBYTECODE: '1' };
const solutionFreeze = read(path.join(own, 'solutions.freeze.json'));
const provenance = read(path.join(own, 'projection-provenance.json'));

const checkBindings = () => {
  for (const binding of solutionFreeze.bound_files) {
    assert.equal(hash(fs.readFileSync(binding.path)), binding.sha256, 'Pre-draft freeze changed');
  }
  for (const binding of provenance.source_files_and_final_assets) {
    assert.equal(hash(fs.readFileSync(binding.source)), binding.sha256, 'Approved source changed');
    assert.equal(hash(fs.readFileSync(binding.projection)), binding.sha256, 'Projection changed');
  }
  for (const language of ['en', 'zh']) {
    const context = read(path.join(own, language, 'n38-context.json'));
    assert.equal(hash(fs.readFileSync(context.source)), context.source_sha256, 'n38 source changed');
  }
};
checkBindings();
const drafts = ['en', 'zh'].map(language =>
  read(path.join(own, language, 'repo/.tmp/choice/draft.json')));
const shape = draft => draft.questions.map(question => ({
  id: question.id, source_numbers: question.source_numbers,
  mode: question.view.mode, figures: question.view.figure_ids,
  options: question.view.options.map(option => ({ id: option.id, figures: option.figure_ids })),
  correct: question.key.correct,
}));
assert.deepEqual(shape(drafts[0]), shape(drafts[1]), 'Bilingual structural/author-key mismatch');
const snapshots = [];
for (const [index, language] of ['en', 'zh'].entries()) {
  const projection = path.join(own, language, 'repo');
  const seedPath = path.join(projection, '.tmp/choice/seed.json');
  const draftPath = path.join(projection, '.tmp/choice/draft.json');
  const validationPath = path.join(own, language, 'validation-result.json');
  if (fs.existsSync(validationPath)) throw new Error('Already validated this candidate; refusing a second run');
  const draft = drafts[index];
  const viewsPath = path.join(own, language, 'learner-view.json');
  write(viewsPath, {
    schema: 'offline-key-free-learner-views-v1',
    language,
    questions: draft.questions.map(question => ({ id: question.id, view: question.view })),
  });
  const args = [path.join(scripts, 'validate.py'), '--repo', projection,
    '--seed', seedPath, '--draft', draftPath];
  const result = spawnSync('python3', args, { encoding: 'utf8', env: environment });
  write(validationPath, {
    phase: 'structural only; no review supplied',
    candidate_validation_invocations: 1,
    command: ['env', 'PYTHONDONTWRITEBYTECODE=1', 'python3', ...args],
    exit_code: result.status, stdout: result.stdout, stderr: result.stderr,
  });
  if (result.status !== 0) throw new Error(`${language} validation failed: ${result.stderr}`);
  const digestArgs = [path.join(scripts, 'prepare.py'), 'digest', draftPath];
  const digested = spawnSync('python3', digestArgs, { encoding: 'utf8', env: environment });
  if (digested.status !== 0) throw new Error(digested.stderr);
  const row = {
    language, repo: projection,
    seed: seedPath, seed_sha256: draft.seed_sha256,
    seed_file_sha256: hash(fs.readFileSync(seedPath)),
    draft: draftPath, draft_sha256: digested.stdout.trim(),
    draft_file_sha256: hash(fs.readFileSync(draftPath)),
    learner_view: viewsPath, learner_view_file_sha256: hash(fs.readFileSync(viewsPath)),
    n38_context: path.join(own, language, 'n38-context.json'),
    n38_context_file_sha256: hash(fs.readFileSync(path.join(own, language, 'n38-context.json'))),
    validation_result: validationPath, validation_exit_code: result.status,
    counts: {
      source_problems: 6,
      questions: draft.questions.length,
      single: draft.questions.filter(question => question.view.mode === 'single').length,
      multiple: draft.questions.filter(question => question.view.mode === 'multiple').length,
      options: draft.questions.reduce((total, question) => total + question.view.options.length, 0),
      selected_n39_concept_blocks: 6, separately_bound_n38_blocks: 5,
      source_figures_used: 1, new_figures: draft.new_figures.length,
      entirely_deferred_source_problems: 0,
    },
    semantic_gate: 'pending fresh independent reviewer; no author approval',
  };
  write(path.join(own, language, 'draft.freeze.json'), row);
  snapshots.push(row);
  console.log(`${language}: exit ${result.status}; ${result.stdout.trim()}`);
  console.log(`${language}: seed canonical SHA-256 ${row.seed_sha256}`);
  console.log(`${language}: draft canonical SHA-256 ${row.draft_sha256}`);
}
checkBindings();
write(path.join(own, 'snapshot-manifest.json'), {
  schema: 'offline-author-handoff-snapshots-v1',
  frozen_at: new Date().toISOString(),
  scope: 'STEMROBIN-181 D029, n39 only, d047 fresh offline choice author',
  snapshots,
  independent_solutions: solutionFreeze.bound_files.find(binding =>
    binding.path.endsWith('/independent-solutions.json')),
  solutions_freeze: path.join(own, 'solutions.freeze.json'),
  image_open_log: path.join(own, 'image-open-log.json'),
  image_opens: { batch: 3, context: 3, maximum_batch: 8, maximum_context: 24 },
  figure70_approved_svg_sha256: '4bae69e25800526c2b16adca5af0d6c71bb013159e240e6d4474e72cd15fba9f',
  bilingual_binding: 'Question IDs, source mappings, modes, option IDs, figure IDs and author keys match mechanically. Equivalent learner-visible and internal mathematical content authored in both languages; semantic equivalence still requires independent review.',
  reviewer: 'not assigned or run in this author context',
  approval: 'not semantically approved; not a full card; no promotion or publication',
  limitations: [
    'Choice recognition does not establish unaided definition/explanation writing, example generation, or production of the phase calculation.',
    'n38 cross-lesson context is a separately hash-bound sidecar because the native seed/draft contract has no cross-lesson concept field; native validation alone does not bind that sidecar.',
    'Native structural checks do not establish semantic fidelity, all option mathematics, leakage, legibility in the application, or bilingual semantic equivalence.',
    'Only intrinsic full-figure inspection occurred; no app render, card render, or responsive browser check was authorized.',
    'Figure 70 phase magnitude is clarified as unsigned and after arrival; sign and pre-arrival conventions were not silently assumed.',
  ],
  retained_failure: path.join(own, 'en/inspect-result.json'),
});
