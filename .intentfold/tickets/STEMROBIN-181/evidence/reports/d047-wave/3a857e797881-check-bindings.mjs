import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const ticket = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp');
const author = path.join(ticket, 'd047-n39-choice-author');
const reviewRoot = path.join(ticket, 'd047-n39-choice-review');
const expected = {
  en: {
    seed: '2b6531b85a23a1f90b4fcef88d9e0e24702a7eaafb015f8453f2c00a3a8e6d72',
    draft: '4889e58bb504ee98590466143a112d451072196613ae69a3cfba6c21b80a580e',
  },
  zh: {
    seed: '78794ae8dfe8167cb33978e93e3f7e08f6db8e7dabc22de6bdc2f5e7abe7f1fb',
    draft: '62af77ce122f38ae6ba0d9c3ca06a8aa0630b7ff0bb5f519699b555df6259223',
  },
};
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sorted = value => Array.isArray(value)
  ? value.map(sorted)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]))
    : value;
const canonical = value => JSON.stringify(sorted(value))
  .replace(/[\u007f-\uffff]/g, character =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
const bind = file => ({
  path: file,
  byte_sha256: sha256(fs.readFileSync(file)),
  canonical_sha256: sha256(canonical(read(file))),
});
const manifestPath = path.join(author, 'snapshot-manifest.json');
const manifest = read(manifestPath);
const records = [];

for (const language of ['en', 'zh']) {
  const langRoot = path.join(author, language);
  const repo = path.join(langRoot, 'repo');
  const seedFile = path.join(repo, '.tmp/choice/seed.json');
  const draftFile = path.join(repo, '.tmp/choice/draft.json');
  const reviewFile = path.join(reviewRoot, `${language}.review.json`);
  const seed = read(seedFile);
  const draft = read(draftFile);
  const review = read(reviewFile);
  const seedBinding = bind(seedFile);
  const draftBinding = bind(draftFile);
  const reviewBinding = bind(reviewFile);
  const frozen = manifest.snapshots.find(item => item.language === language);
  assert.equal(seedBinding.canonical_sha256, expected[language].seed);
  assert.equal(draftBinding.canonical_sha256, expected[language].draft);
  assert.equal(seedBinding.byte_sha256, frozen.seed_file_sha256);
  assert.equal(draftBinding.byte_sha256, frozen.draft_file_sha256);
  assert.equal(review.seed_sha256, seedBinding.canonical_sha256);
  assert.equal(review.draft_sha256, draftBinding.canonical_sha256);

  const sourceFiles = seed.trace.map(entry => {
    const file = path.join(repo, entry.path);
    const byteHash = sha256(fs.readFileSync(file));
    assert.equal(byteHash, entry.sha256);
    return {path: file, byte_sha256: byteHash};
  });
  const lesson = read(sourceFiles[1].path);
  for (const concept of seed.concepts) {
    assert.equal(lesson.prose[concept.block].kind, 'p');
    assert.equal(lesson.prose[concept.block].text, concept.text);
  }

  const contextFile = path.join(langRoot, 'n38-context.json');
  const context = read(contextFile);
  const contextBinding = bind(contextFile);
  assert.equal(contextBinding.byte_sha256, frozen.n38_context_file_sha256);
  const contextSource = read(context.source);
  const contextSourceHash = sha256(fs.readFileSync(context.source));
  assert.equal(contextSourceHash, context.source_sha256);
  assert.equal(contextSource.id, context.source_lesson);
  assert.equal(contextSource.language, language);
  const conceptChecks = context.concepts.map(concept => {
    const actual = contextSource.prose[concept.block];
    assert.equal(actual.kind, 'p');
    assert.equal(actual.text, concept.text);
    return {
      block: concept.block,
      exact_text_match: true,
      text_sha256: sha256(concept.text),
    };
  });
  assert.deepEqual(context.concepts.map(item => item.block), [0, 5, 6, 7, 8]);
  assert.deepEqual(context.bindings.map(item => ({
    source_numbers: item.source_numbers, blocks: item.blocks,
  })), [
    {source_numbers: ['1', '3'], blocks: [0, 5, 6, 8]},
    {source_numbers: ['2'], blocks: [0, 5, 6, 8]},
    {source_numbers: ['6'], blocks: [7]},
  ]);

  const learnerFile = path.join(langRoot, 'learner-view.json');
  const learner = read(learnerFile);
  const learnerBinding = bind(learnerFile);
  assert.equal(learnerBinding.byte_sha256, frozen.learner_view_file_sha256);
  assert.deepEqual(learner.questions, draft.questions.map(({id, view}) => ({id, view})));
  const figures = seed.figures.flatMap(figure => figure.assets.map(asset => {
    const file = path.join(repo, asset.path);
    const byteHash = sha256(fs.readFileSync(file));
    assert.equal(byteHash, asset.sha256);
    return {figure_id: figure.id, path: file, byte_sha256: byteHash};
  }));
  const rasterFile = path.join(langRoot, 'fig-70.on-white.full.png');
  const rasterHash = sha256(fs.readFileSync(rasterFile));
  assert.equal(rasterHash, '8768c1c2b44e52aa5de0a7c6bcd2dbb014d0a28f31a5964d2fb912882e4761f0');
  records.push({
    language, repo, seed: seedBinding, draft: draftBinding, review: reviewBinding,
    learner_view: learnerBinding, source_files: sourceFiles,
    n39_definitions: seed.concepts.map(concept => ({
      block: concept.block, exact_text_match: true, text_sha256: sha256(concept.text),
    })),
    n38_context: {
      ...contextBinding,
      source_path: context.source,
      source_byte_sha256: contextSourceHash,
      concepts: conceptChecks,
      source_bindings: context.bindings,
    },
    figures,
    opened_raster: {path: rasterFile, byte_sha256: rasterHash},
  });
}

const drafts = ['en', 'zh'].map(language =>
  read(path.join(author, language, 'repo/.tmp/choice/draft.json')));
const signature = draft => ({
  questions: draft.questions.map(question => ({
    id: question.id,
    source_numbers: question.source_numbers,
    mode: question.view.mode,
    figure_ids: question.view.figure_ids,
    options: question.view.options.map(({id, figure_ids}) => ({id, figure_ids})),
    correct: question.key.correct,
    truths: question.key.rationales.map(({option_id, truth}) => ({option_id, truth})),
    concept_blocks: question.intent.concept_blocks,
  })),
  coverage: draft.coverage.map(({source_number, question_ids}) => ({source_number, question_ids})),
  new_figures: draft.new_figures,
});
assert.deepEqual(signature(drafts[0]), signature(drafts[1]));
assert.equal(drafts[0].questions.length, 5);
assert.equal(drafts[0].questions.flatMap(question => question.view.options).length, 21);
assert.equal(drafts[0].questions.filter(question => question.view.mode === 'single').length, 4);
assert.equal(drafts[0].questions.filter(question => question.view.mode === 'multiple').length, 1);
assert.equal(drafts[0].coverage.length, 6);
assert.deepEqual(drafts[0].new_figures, []);
assert.equal(
  sha256(fs.readFileSync(manifest.independent_solutions.path)),
  manifest.independent_solutions.sha256,
);
console.log(JSON.stringify({
  status: 'PASS',
  check_scope: 'Read-only byte/canonical snapshot and external definition bindings; not a semantic or native structural checker.',
  manifest: bind(manifestPath),
  source_solution_freeze: bind(path.join(reviewRoot, 'source-solutions.frozen.json')),
  option_evaluation_freeze: bind(path.join(reviewRoot, 'key-free-option-evaluation.frozen.json')),
  language_records: records,
  bilingual_structure_and_keys_equal: true,
}, null, 2));
