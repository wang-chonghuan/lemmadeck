const fs = require('node:fs');
const crypto = require('node:crypto');

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong cwd');
const own = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-review-FIRST';
const author = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-choice-author';
const expectedSeed = '2379eaac29b0f067ffc5469a178c69e92fb2d4dab09b140e44eb728f362a6c73';
const expectedDraft = '9c5a56f1d82e26e00058da4d2e0a8ec72ebac487a0d3dd2408eee1eb258eacf7';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = name => JSON.parse(fs.readFileSync(name, 'utf8'));
function sorted(value) {
  if (Array.isArray(value)) return value.map(sorted);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, sorted(value[key])]));
  }
  return value;
}
const canonical = value => JSON.stringify(sorted(value)).replace(/[\u007f-\uffff]/g,
  char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
const digest = value => hash(canonical(value));
function writeFrozen(name, value) {
  const file = `${own}/${name}`;
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  fs.chmodSync(file, 0o444);
  return { path: file, canonical_sha256: digest(value), file_sha256: hash(fs.readFileSync(file)) };
}

const stage = process.argv[2];
if (stage === 'source') {
  const first = read(`${own}/source-first.json`);
  const firstFreeze = read(`${own}/source-first.freeze.json`);
  if (digest(first) !== firstFreeze.source_canonical_sha256) throw new Error('FIRST checkpoint changed');
  const recovered = read(`${own}/source-recovered.json`);
  const replacements = new Map(recovered.source_reviews.map(item => [item.source_number, item]));
  const completed = {
    stage: 'SOURCE-FIRST COMPLETE FROZEN EVIDENCE',
    status: 'complete',
    seed_sha256: expectedSeed,
    source_reviews: first.source_reviews.map(item => replacements.get(item.source_number) || item),
    figure_checks: recovered.figure_checks,
    definitions: first.selected_definitions,
    original_checkpoint_sha256: digest(first),
    affected_recovery_sha256: digest(recovered),
    total_image_loads: 4,
    author_view_exposure: false,
    author_internal_exposure: false,
  };
  if (completed.source_reviews.some(item => item.verdict !== 'solved')) throw new Error('Source unresolved');
  const evidence = writeFrozen('source-complete.json', completed);
  fs.chmodSync(`${own}/source-recovered.json`, 0o444);
  const receipt = writeFrozen('source-complete.freeze.json', {
    stage: 'SOURCE COMPLETE FREEZE BEFORE AUTHOR VIEW',
    frozen_at: new Date().toISOString(),
    ...evidence,
    seed_sha256: expectedSeed,
    image_loads: 4,
    author_view_exposure: false,
    author_internal_exposure: false,
  });
  console.log(JSON.stringify({ evidence, receipt }, null, 2));
} else if (stage === 'view') {
  const source = read(`${own}/source-complete.json`);
  const receipt = read(`${own}/source-complete.freeze.json`);
  if (digest(source) !== receipt.canonical_sha256 || source.status !== 'complete') {
    throw new Error('Source freeze missing or changed');
  }
  const seed = read(`${author}/seed.json`);
  if (digest(seed) !== expectedSeed) throw new Error('Seed changed');
  const draft = read(`${author}/draft.json`);
  if (digest(draft) !== expectedDraft) throw new Error('Author draft snapshot changed');
  const view = draft.questions.map(({ id, view }) => ({ id, view }));
  const projection = writeFrozen('view-only.json', view);
  writeFrozen('view-only.receipt.json', {
    projected_at: new Date().toISOString(),
    seed_sha256: expectedSeed,
    draft_sha256: expectedDraft,
    source_freeze_sha256: digest(source),
    projection,
    reviewer_exposed_fields: ['id', 'view'],
    reviewer_internal_exposure: false,
  });
  console.log(JSON.stringify(view, null, 2));
} else if (stage === 'freeze-view') {
  const review = read(`${own}/view-independent.json`);
  if (review.draft_sha256 !== expectedDraft || review.seed_sha256 !== expectedSeed) {
    throw new Error('Wrong visible-review snapshot');
  }
  const projection = read(`${own}/view-only.json`);
  if (review.question_reviews.length !== projection.length) throw new Error('Missing question review');
  for (const question of projection) {
    const row = review.question_reviews.find(item => item.question_id === question.id);
    if (!row || row.mathematics.option_checks.length !== question.view.options.length) {
      throw new Error('Missing independent option checks');
    }
  }
  fs.chmodSync(`${own}/view-independent.json`, 0o444);
  const receipt = writeFrozen('view-independent.freeze.json', {
    stage: 'VISIBLE FIDELITY AND ALL TRUTHS FROZEN BEFORE INTERNAL EXPOSURE',
    frozen_at: new Date().toISOString(),
    seed_sha256: expectedSeed,
    draft_sha256: expectedDraft,
    view_review_sha256: digest(review),
    view_projection_sha256: digest(projection),
    question_count: review.question_reviews.length,
    option_count: review.question_reviews.reduce((sum, item) => sum + item.mathematics.option_checks.length, 0),
    independent_correct_sets: review.question_reviews.map(item => ({
      question_id: item.question_id,
      correct: item.mathematics.correct,
    })),
    reviewer_internal_exposure: false,
  });
  console.log(JSON.stringify(receipt, null, 2));
} else if (stage === 'internal') {
  const frozen = read(`${own}/view-independent.freeze.json`);
  const viewReview = read(`${own}/view-independent.json`);
  if (digest(viewReview) !== frozen.view_review_sha256) throw new Error('Visible truths changed');
  const draft = read(`${author}/draft.json`);
  if (digest(draft) !== expectedDraft) throw new Error('Author snapshot changed');
  console.log(JSON.stringify({
    schema: draft.schema,
    seed_sha256: draft.seed_sha256,
    new_figures: draft.new_figures,
    questions: draft.questions.map(({ id, source_numbers, intent, key }) => ({ id, source_numbers, intent, key })),
    coverage: draft.coverage,
  }, null, 2));
} else {
  throw new Error('Unknown stage');
}
