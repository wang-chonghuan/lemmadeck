import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = `${W}/ssot-resources/soviet10year-textbooks/artifacts/6-8g`;
const O = `${B}/evidence/stemrobin188-6g-n38/preparation7`;
const book = `${O}/artifacts/6-8g`;
const work = `${O}/work`;
const lesson = 'geo68-c3-s2-n38';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.ok(!fs.existsSync(book) && !fs.existsSync(work) && !fs.existsSync(`${O}/manifest.json`),
  'Do not replay N38 preparation');
const reviews = [
  [`${B}/evidence/stemrobin188-6g-source173174/independent7/targeted-adjudication7.json`,
    '8244d79fef6801d368e2801fe13b1f0c35454e5ecce70dd129b87c3994354a66'],
  [`${B}/evidence/stemrobin188-6g-source175176/independent7/comparison-review7.json`,
    'c7b25c97f1a9f5bf003300f1ebc0f4cf01f2aa69e4471d0803818933624832a1'],
  [`${B}/evidence/stemrobin188-6g-source175176/independent7/native176-affected-review7.json`,
    'cbba062237707071864660de0192aedc421490338e869a0067efc0dcb97bfb83'],
  [`${B}/evidence/stemrobin188-6g-source177178/independent7/comparison-review7.json`,
    '0e10b5fdd18e68e479dc20c6159a85b7885af62da4f1edbe321ee6029e1215f8'],
  [`${B}/evidence/stemrobin188-6g-source177178/independent7/source175-target-adjudication7.json`,
    '8be057b3028955edfe54b265146ca0bd6540f52d813097db4ee29c365ec61116'],
];
for (const [file, expected] of reviews) assert.equal(hash(file), expected);
const source175176 = `${B}/evidence/stemrobin188-6g-source175176`;
const source177178 = `${B}/evidence/stemrobin188-6g-source177178/author-first7`;
assert.equal(hash(`${source177178}/author-manifest.json`),
  '5c8d495c65c3db217401834b76e6f7188402786bf10fd43aeab130c3d7c3130e');
const expectedPages = new Map([
  [149, '1dd3b3eb0fc3c41b1f004b76d8895601c326ceb6075297b8ed26ab1f8c27b1a5'],
  [159, '1fe4a3200ddbc9c3de9e136fcd36e825a2acf2e12cf86dec69dae29b03e46d61'],
  [174, '75b71398f473ea3398c50d2b02ae0b5cd4c111f20007ed1e3fab0f5c4147d84d'],
  [175, '2d0e6d557bb723d2daf6ed842d6b9c46a2a0e8d2b4ce175d54f411c086c1abe3'],
  [176, '28ded4b834756e3757e45a89dcee4387fa433904a1deeead8e358115790741f9'],
  ...read(`${source177178}/author-manifest.json`).pages.map(page =>
    [page.physical, page.native_candidate['page.json'].sha256]),
]);
const sources = [
  [149, `${B}/pages/0149/page.json`],
  [159, `${B}/pages/0159/page.json`],
  [174, `${B}/pages/0174/page.json`],
  [175, `${source175176}/row3-repair7/artifacts/6-8g/pages/0175/page.json`],
  [176, `${source175176}/separator-repair7/artifacts/6-8g/pages/0176/page.json`],
  ...[177, 178].map(page => [page,
    `${source177178}/artifacts/6-8g/pages/${String(page).padStart(4, '0')}/page.json`]),
];
const figures = [
  ...[232, 233].map(n => [`fig-${n}`,
    `${B}/evidence/stemrobin188-6g-source173174/author-first7/figures/fig-${n}.png`]),
  ...[234, 235].map(n => [`fig-${n}`,
    `${source175176}/row3-repair7/work/6-8g/pages/0175/figures/fig-${n}.png`]),
  ...[236, 237].map(n => [`fig-${n}`,
    `${source175176}/separator-repair7/work/6-8g/pages/0176/figures/fig-${n}.png`]),
  ['fig-238', `${source177178}/work/6-8g/pages/0178/figures/fig-238.png`],
];
const sourcePages = [];
const figureBindings = [];
const commands = [];
const outputs = [];
fs.mkdirSync(`${book}/figures`, { recursive: true });
fs.mkdirSync(work, { recursive: true });
for (const [physical, file] of sources) {
  assert.equal(hash(file), expectedPages.get(physical), 'Reviewed source bytes changed');
  const page = read(file);
  assert.equal(page.meta.book, '6-8g');
  assert.equal(page.meta.page, physical);
  const folder = `${book}/pages/${String(physical).padStart(4, '0')}`;
  fs.mkdirSync(folder, { recursive: true });
  fs.symlinkSync(path.relative(folder, file), `${folder}/page.json`);
  sourcePages.push({ physical, printed: page.meta.printed_page, ...bind(file),
    role: physical < 174 ? 'ancestor' : 'independently reviewed selected source/boundary' });
}
for (const [id, file] of figures) {
  fs.copyFileSync(file, `${book}/figures/${id}.png`, fs.constants.COPYFILE_EXCL);
  figureBindings.push({ id, source: bind(file), output: bind(`${book}/figures/${id}.png`),
    mode: 'OPAQUE_BYTES_NO_IMAGE_LOAD' });
}
function run(stage, argv) {
  for (const extension of ['stdout', 'stderr'])
    assert.ok(!fs.existsSync(`${O}/${stage}.${extension}`));
  const result = spawnSync(argv[0], argv.slice(1), { cwd: W, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 });
  const streams = {};
  for (const stream of ['stdout', 'stderr']) {
    fs.writeFileSync(`${O}/${stage}.${stream}`, result[stream] || '', { flag: 'wx' });
    streams[stream] = bind(`${O}/${stage}.${stream}`);
  }
  commands.push({ stage, cwd: W, argv, exitCode: result.status, streams });
  console.log(result.stdout);
  console.error(result.stderr);
  return result.status;
}
let failure = null;
let counts = null;
try {
  const python = `${W}/.claude/skills/ld-s10y-lesson/.venv/bin/python`;
  assert.equal(run('assemble', [python, '-B', `${O}/native-scoped.py`, 'assemble']), 0);
  const index = read(`${book}/book.json`);
  assert.equal(index.lessons.length, 1);
  assert.equal(index.lessons[0].id, lesson);
  const raw = `${book}/lessons/${lesson}`;
  const prose = read(`${raw}/lesson.json`);
  const exercises = read(`${raw}/exercises.json`);
  assert.deepEqual(exercises.exercises.map(exercise => exercise.number),
    Array.from({ length: 18 }, (_, index) => String(488 + index)));
  assert.deepEqual(prose.figures.map(figure => figure.id),
    Array.from({ length: 7 }, (_, index) => `fig-${232 + index}`));
  counts = { prose: prose.prose.length,
    text: prose.prose.filter(block => block.kind === 'p').length,
    exercises: exercises.exercises.length,
    exerciseNumbers: exercises.exercises.map(exercise => exercise.number),
    figures: prose.figures.map(figure => figure.id), audit: index.audit };
  outputs.push(...['lesson.json', 'lesson.md', 'exercises.json'].map(file => bind(`${raw}/${file}`)));
  assert.equal(run('adapt-prepare', [python, '-B', `${O}/native-scoped.py`, 'adapt-prepare']), 0);
  const templates = `${work}/adapt/6-8g/modern-us-neutral/lessons/${lesson}`;
  for (const name of ['lesson', 'exercises', 'figures'])
    outputs.push(bind(`${templates}/${name}.template.json`));
} catch (error) {
  failure = { name: error.name, message: error.message, stack: error.stack };
}
const manifest = {
  status: failure ? 'FAILED_PREPARATION_RETAINED' : 'PREPARED_NOT_APPROVED',
  book: '6-8g', requestedLesson: lesson, cwd: W,
  boundary: { leftInclusive: 'p0174#1', rightExclusive: 'p0178#9' },
  sourcePages, figureBindings, sourceReviews: reviews.map(([file]) => bind(file)),
  commands, counts, outputs, failure,
  modernContentApproved: false, completeLessonApproved: false, published: false,
  canonicalWrites: 0, imagesLoaded: 0, sourcePageFinalizerReplays: 0,
  preservedHolds: ['N36 caption/count/glyph', 'source220 UNKNOWN', 'unobserved supplement509 continuation'],
  preservedFailures: ['source175 author missing word', 'source176 first count failure',
    'independent FIRST reading discrepancies and targeted tool failure'],
};
fs.writeFileSync(`${O}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: manifest.status, counts, failure, manifest: `${O}/manifest.json` }));
if (failure) process.exitCode = 1;
