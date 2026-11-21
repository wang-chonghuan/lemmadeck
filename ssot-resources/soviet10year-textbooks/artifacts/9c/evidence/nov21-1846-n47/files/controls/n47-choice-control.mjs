import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const progressPath = path.join(base, 'source-progress.json');
const usagePath = path.join(root, '.intentfold/tickets/STEMROBIN-184/usage.json');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length, sha256: hash(bytes) };
};
const writeNew = (file, value) => fs.writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) freeze(file);
    else fs.chmodSync(file, 0o444);
  }
  fs.chmodSync(directory, 0o555);
};
const frozenTextFiles = directory => {
  const rows = [];
  assert.equal(fs.statSync(directory).mode & 0o777, 0o555, directory);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    assert(!entry.isSymbolicLink(), file);
    if (entry.isDirectory()) rows.push(...frozenTextFiles(file));
    else {
      assert(!/\.(png|svg|jpe?g|webp|pdf)$/i.test(file), file);
      assert.equal(fs.statSync(file).mode & 0o777, 0o444, file);
      rows.push(bind(file));
    }
  }
  return rows;
};
const progress = read(progressPath), usage = read(usagePath);
const n47 = progress.n47;
const [mode, ...args] = process.argv.slice(2);
const author = path.join(base, 'n47-choice-author');
const reviewer = path.join(base, 'n47-choice-review');
const release = path.join(base, 'n47-choice-release');
const receipt = {
  schema: 'stemrobin1846/n47-choice-control@1', mode,
  at: new Date().toISOString(), book: '9c', lesson: 'ana9-c4-s2-n47',
  authority: 'Parent-agent dispatch/continuation fact, not a new human prompt',
  parentNewImagesOrDecodes: 0, passedStageReplays: 0,
  newSourceReviews: 0, completeLessonDelta: 0, finish: 'review',
};
if (mode === 'author-intake') {
  assert(!n47.choiceAuthor.intake);
  receipt.files = frozenTextFiles(author);
  const manifest = read(path.join(author, 'manifest.json'));
  assert.equal(receipt.files.length, manifest.artifact_inventory.length + 1);
  for (const row of manifest.artifact_inventory) {
    const actual = receipt.files.find(file => file.path === row.path);
    assert(actual, row.path);
    assert.equal(actual.bytes, row.bytes);
    assert.equal(actual.sha256, row.sha256);
  }
  assert.equal(manifest.validation.first_attempt_exit_code, 0);
  assert.equal(manifest.validation.semantic_review_performed, false);
  assert(manifest.ordering.independent_solution_frozen_utc
    < manifest.ordering.draft_started_utc);
  receipt.solutionBeforeOptions = manifest.ordering;
  receipt.manifest = bind(path.join(author, 'manifest.json'));
  const seed = read(path.join(author, 'seed.json'));
  const draft = read(path.join(author, 'draft.json'));
  assert.equal(seed.source.lesson, receipt.lesson);
  assert.equal(seed.figures.length, 0);
  assert.equal(draft.new_figures.length, 0);
  receipt.counts = { questions: draft.questions.length,
    options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0),
    sourceNumbers: seed.exercises.map(e => e.number),
    concepts: seed.concepts.map(c => c.block), figures: 0 };
  receipt.canonicalDigestContract = 'Official skill digest, not ordinary file hash';
  receipt.intakeScope = 'Full frozen tree integrity; mathematical approval remains pending independent reviewer';
  n47.choiceAuthor.intake = receipt;
} else if (mode === 'author-close') {
  assert(n47.choiceAuthor.intake);
  assert.equal(args[0], n47.choiceAuthor.agent);
  assert.equal(args[1], 'completed');
  receipt.agent = args[0];
  receipt.previousStatusFromActualClose = args[1];
  n47.choiceAuthor.closed = true;
  n47.choiceAuthor.closure = receipt;
  assert(!fs.existsSync(release));
  fs.mkdirSync(release);
  fs.mkdirSync(path.join(release, 'stage1'));
  fs.copyFileSync(path.join(author, 'seed.json'),
    path.join(release, 'stage1/seed.json'), fs.constants.COPYFILE_EXCL);
  freeze(path.join(release, 'stage1'));
  receipt.sourceFirstRelease = bind(path.join(release, 'stage1/seed.json'));
} else if (mode === 'review-dispatch') {
  assert.equal(n47.choiceAuthor.closed, true);
  assert(!n47.choiceReview);
  receipt.agent = args[0];
  receipt.nickname = args[1];
  receipt.historyFork = false;
  receipt.imagesAuthorized = 0;
  receipt.scope = 'Stage1 seed only; full source solution frozen before view release; no keys until stage3';
  n47.choiceReview = { ...receipt, closed: false };
} else if (/^review-stage[123]-intake$/.test(mode)) {
  const stage = Number(mode.match(/[123]/)[0]);
  assert(n47.choiceReview);
  assert(!n47.choiceReview[`stage${stage}`]);
  receipt.files = frozenTextFiles(path.join(reviewer, `stage${stage}`));
  const externalManifest = path.join(reviewer, `stage${stage}-manifest.json`);
  if (fs.existsSync(externalManifest)) {
    assert.equal(fs.statSync(externalManifest).mode & 0o777, 0o444);
    const manifest = read(externalManifest);
    for (const row of manifest.files) {
      const actual = bind(path.resolve(reviewer, row.path));
      assert.equal(actual.bytes, row.bytes);
      assert.equal(actual.sha256, row.sha256);
    }
    receipt.files.push(bind(externalManifest));
  }
  if (stage === 3) {
    const review = read(path.join(reviewer, 'stage3/review.json'));
    receipt.outcome = review.outcome;
    receipt.review = bind(path.join(reviewer, 'stage3/review.json'));
    assert.equal(review.reviewer.kind, 'independent_agent');
  }
  receipt.intakeScope = 'Frozen text custody; report observations consumed separately, no source/math replay';
  n47.choiceReview[`stage${stage}`] = receipt;
} else if (mode === 'review-stage2-release') {
  assert(n47.choiceReview.stage1);
  assert(!n47.choiceReview.stage2Release);
  const draft = read(path.join(author, 'draft.json'));
  const output = path.join(release, 'stage2');
  fs.mkdirSync(output);
  writeNew(path.join(output, 'views.json'), {
    schema: 'stemrobin1846/choice-view-projection@1',
    questions: draft.questions.map(q => ({
      id: q.id, source_numbers: q.source_numbers, view: q.view,
    })),
  });
  freeze(output);
  receipt.viewOnlyProjection = bind(path.join(output, 'views.json'));
  n47.choiceReview.stage2Release = receipt;
} else if (mode === 'review-stage3-release') {
  assert(n47.choiceReview.stage2);
  assert(!n47.choiceReview.stage3Release);
  receipt.fullDraft = bind(path.join(author, 'draft.json'));
  receipt.scope = 'One key-last comparison only; no source168 answers/standard keys/interactions/history';
  n47.choiceReview.stage3Release = receipt;
} else if (mode === 'review-close') {
  assert(n47.choiceReview.stage3);
  assert.equal(args[0], n47.choiceReview.agent);
  assert.equal(args[1], 'completed');
  receipt.agent = args[0];
  receipt.previousStatusFromActualClose = args[1];
  n47.choiceReview.closed = true;
  n47.choiceReview.closure = receipt;
} else if (mode === 'approved-materialize') {
  assert.equal(n47.choiceReview.closed, true);
  assert.equal(n47.choiceReview.stage3.outcome, 'pass');
  const output = path.join(base, 'n47-choice-approved');
  assert(!fs.existsSync(output));
  fs.mkdirSync(output);
  receipt.files = ['seed.json', 'draft.json', 'review.json'].map(name => {
    const source = name === 'review.json' ? path.join(reviewer, 'stage3', name)
      : path.join(author, name);
    const target = path.join(output, name);
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    return bind(target);
  });
  freeze(output);
  n47.approvedChoices = receipt;
} else {
  throw new Error(`Unknown mode ${mode}`);
}
const receiptPath = path.join(base, `n47-choice-${mode}-parent-receipt.json`);
writeNew(receiptPath, receipt);
n47[`${mode}Receipt`] = bind(receiptPath);
usage[`nov21_1846_n47_choice_${mode.replaceAll('-', '_')}`] = receipt;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + '\n');
fs.writeFileSync(usagePath, JSON.stringify(usage, null, 2) + '\n');
console.log(JSON.stringify({ mode, receipt: bind(receiptPath),
  counts: receipt.counts, outcome: receipt.outcome, textFiles: receipt.files?.length }));
