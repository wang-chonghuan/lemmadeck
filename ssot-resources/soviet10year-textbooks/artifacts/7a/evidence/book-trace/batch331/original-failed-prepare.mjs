import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), repo);
const root = '.intentfold/tickets/STEMROBIN-182/tmp/batch331-7a-book-binding';
const bookPath = 'ssot-resources/soviet10year-textbooks/artifacts/7a/book.json';
const lessonRoot = path.join(path.dirname(bookPath), 'editions/modern-us-neutral/lessons');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ref = file => ({path: path.resolve(file), raw_sha256: sha(file)});
const read = file => JSON.parse(fs.readFileSync(file));
const canonical = value => Array.isArray(value) ? value.map(canonical) :
  value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const digest = value => crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, {flag: 'wx'});
};
assert(!fs.existsSync(`${root}/affected-review-request.json`));
const oldBooks = [
  {commit: 'ca6979922e4764f4894ed4474e478bd0b411674a', sha256: '2aabad7af4cb4a60c323726e1158bdda630f95c6c96fb002b6a0ee2f76ba4334'},
  {commit: '21d198fa9fde49bad90cf50059818a4e7c656ab7', sha256: 'a1a23798139967f894d79c0ef3b138f7ba6c4f9d9dcfcde257375628fdee97c5'},
];
fs.mkdirSync(root, {recursive: true});
for (const item of oldBooks) {
  const file = `${root}/original-book-${item.sha256.slice(0, 12)}.json`;
  const bytes = execFileSync('git', ['show', `${item.commit}:${bookPath}`]);
  fs.writeFileSync(file, bytes, {flag: 'wx'});
  assert.equal(sha(file), item.sha256);
  item.snapshot = ref(file);
}
const currentBook = read(bookPath);
const packages = [];
for (const id of fs.readdirSync(lessonRoot).sort()) {
  const dir = `${lessonRoot}/${id}/choice-set`;
  if (!fs.existsSync(`${dir}/seed.json`)) continue;
  const original = {};
  for (const name of ['seed', 'draft', 'review']) {
    const from = `${dir}/${name}.json`;
    const to = `${root}/${id}/original/${name}.json`;
    fs.mkdirSync(path.dirname(to), {recursive: true});
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(sha(from), sha(to));
    original[name] = ref(to);
  }
  const seed = read(original.seed.path);
  const draft = read(original.draft.path);
  const review = read(original.review.path);
  const bookTrace = seed.trace.find(row => row.path === bookPath);
  assert(bookTrace);
  const oldBook = oldBooks.find(row => row.sha256 === bookTrace.sha256);
  assert(oldBook, `Missing genuine old index for ${id}`);
  const oldRow = read(oldBook.snapshot.path).lessons.find(row => row.id === id);
  assert.deepEqual(currentBook.lessons.find(row => row.id === id), oldRow);
  assert.equal(review.seed_sha256, digest(seed));
  assert.equal(review.draft_sha256, digest(draft));
  const immutableTrace = seed.trace.filter(row => row.path !== bookPath);
  for (const row of immutableTrace) assert.equal(sha(row.path), row.sha256);
  const nextSeed = structuredClone(seed);
  nextSeed.trace.find(row => row.path === bookPath).sha256 = sha(bookPath);
  const nextDraft = structuredClone(draft);
  nextDraft.seed_sha256 = digest(nextSeed);
  const current = {seed: `${root}/${id}/current/seed.json`, draft: `${root}/${id}/current/draft.json`,
    review: path.resolve(`${root}/${id}/current/review.json`)};
  write(current.seed, nextSeed);
  write(current.draft, nextDraft);
  packages.push({lesson: id, durable_directory: path.resolve(dir), original,
    current: {seed: ref(current.seed), draft: ref(current.draft), review: current.review},
    old_book: oldBook.snapshot, original_reviewer: review.reviewer, original_outcome: review.outcome,
    immutable_trace: immutableTrace, sources: seed.exercises.length,
    questions: draft.questions.length, options: draft.questions.reduce((sum, q) => sum + q.view.options.length, 0)});
}
assert.equal(packages.length, 9);
write(`${root}/affected-review-request.json`, {
  scope: 'Zero-image BOOK-TRACE-BINDING ONLY for nine already reviewed current 7a packages.',
  current_book: ref(bookPath), original_books: oldBooks, packages,
  allowed_output_paths: [...packages.map(row => row.current.review), path.resolve(`${root}/direct-check-receipt.json`)],
  allowed_changes: ['seed.trace[book.json].sha256', 'draft.seed_sha256',
    'review.seed_sha256', 'review.draft_sha256', 'review.reviewer.identity binding attribution only'],
  all_other_seed_draft_and_review_objects_must_be_equal: true,
  original_SOURCE_math_figure_display_reviews_repeated: false,
  parent_image_opens: 0, parent_cumulative_image_opens: 24,
  whole_course_APP_or881_approval: false,
});
console.log(JSON.stringify({request: ref(`${root}/affected-review-request.json`),
  packages: packages.length, questions: packages.reduce((sum, row) => sum + row.questions, 0),
  options: packages.reduce((sum, row) => sum + row.options, 0), new_math: 0, images: 0}));
