import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = `${W}/ssot-resources/soviet10year-textbooks/artifacts/6-8g`;
const O = `${B}/evidence/stemrobin188-6g-n37/preparation7`;
const book = `${O}/artifacts/6-8g`;
const work = `${O}/work`;
const lesson = 'geo68-c3-s2-n37';
const author = `${B}/evidence/stemrobin188-6g-source173174/author-first7`;
const review = `${B}/evidence/stemrobin188-6g-source173174/independent7/comparison-review7.json`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.ok(!fs.existsSync(book) && !fs.existsSync(work) && !fs.existsSync(`${O}/manifest.json`),
  'Do not replay preparation');
assert.equal(hash(review), 'daeb263c4bd0b0f7e31d7aadce7a80ff5f54930218f0bb8d69132fda7a39575e');
assert.equal(read(review).pages.find(page => page.physical_page === 173).source_verdict,
  'PASS_WITH_EXPLICIT_UNKNOWNS');
assert.equal(read(review).pages.find(page => page.physical_page === 174).heading,
  '38. 多边形的内角和');
const sources = [
  [149, `${B}/pages/0149/page.json`, '1dd3b3eb0fc3c41b1f004b76d8895601c326ceb6075297b8ed26ab1f8c27b1a5'],
  [159, `${B}/pages/0159/page.json`, '1fe4a3200ddbc9c3de9e136fcd36e825a2acf2e12cf86dec69dae29b03e46d61'],
  [171, `${B}/evidence/stemrobin188-6g-source169172/eight-defects-revision1-14/files/source169171-eight-defects-revision1-14/0171/page.json`,
    'ee2b0661e80b6df241e4d3d4572c1cee6bd26dc535d0396abbe1f13e4c18e0a8'],
  [172, `${B}/evidence/stemrobin188-6g-source171172/author-first13/files/source6g171172-author-first-13/artifacts/6-8g/pages/0172/page.json`,
    '24186a94a03d43acfee43ad1b5856ca81c8535cdcddd110947622c81fab180c0'],
  [173, `${author}/pages/0173/page.json`, 'cc6d15f96a53d746b62f89ea99d43d55ce32b3dfd8877decf6b61aca0de0c7ce'],
  [174, `${author}/pages/0174/page.json`, '75b71398f473ea3398c50d2b02ae0b5cd4c111f20007ed1e3fab0f5c4147d84d'],
];
const figures = [
  ['fig-229', `${B}/evidence/stemrobin188-6g-source171172/author-first13/files/source6g171172-author-first-13/work/6-8g/pages/0172/figures/fig-229.png`,
    'd12430595d34eddd92ad4f9aa3d8036549397e98460929fe4ccd3fb02002fa3c'],
  ['fig-230', `${author}/figures/fig-230.png`, 'c15026fd061594260867f8ce83a2fc33a0ba8de472ebda87b34e57569870d27f'],
  ['fig-231', `${author}/figures/fig-231.png`, 'e8e8b389d51b21ddab9d8b53b3f560a05b69931e406ef8deead5b5789da04dba'],
];
const sourcePages = [];
const figureBindings = [];
const commands = [];
const outputs = [];
fs.mkdirSync(`${book}/figures`, { recursive: true });
fs.mkdirSync(work, { recursive: true });
for (const [physical, file, expected] of sources) {
  assert.equal(hash(file), expected);
  const page = read(file);
  assert.equal(page.meta.book, '6-8g');
  assert.equal(page.meta.page, physical);
  const folder = `${book}/pages/${String(physical).padStart(4, '0')}`;
  fs.mkdirSync(folder, { recursive: true });
  fs.symlinkSync(path.relative(folder, file), `${folder}/page.json`);
  sourcePages.push({ physical, printed: page.meta.printed_page, ...bind(file),
    role: physical < 171 ? 'ancestor' : physical === 174 ? 'verified right boundary only' : 'selected source' });
}
for (const [id, file, expected] of figures) {
  assert.equal(hash(file), expected);
  fs.copyFileSync(file, `${book}/figures/${id}.png`, fs.constants.COPYFILE_EXCL);
  figureBindings.push({ id, source: bind(file), output: bind(`${book}/figures/${id}.png`),
    mode: 'OPAQUE_BYTES_NO_IMAGE_LOAD' });
}
function run(stage, argv) {
  for (const extension of ['stdout', 'stderr'])
    assert.ok(!fs.existsSync(`${O}/${stage}.${extension}`));
  const result = spawnSync(argv[0], argv.slice(1), {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
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
  const assembly = run('assemble', [python, '-B', `${O}/native-scoped.py`, 'assemble']);
  assert.equal(assembly, 0, 'N37 native assembly failed');
  const index = read(`${book}/book.json`);
  assert.equal(index.lessons.length, 1);
  assert.equal(index.lessons[0].id, lesson);
  const raw = `${book}/lessons/${lesson}`;
  const prose = read(`${raw}/lesson.json`);
  const exercises = read(`${raw}/exercises.json`);
  assert.deepEqual(exercises.exercises.map(exercise => exercise.number),
    Array.from({ length: 9 }, (_, i) => String(479 + i)));
  assert.deepEqual(prose.figures.map(figure => figure.id), ['fig-229', 'fig-230', 'fig-231']);
  const refs = [...prose.prose.flatMap(block => block.source_refs),
    ...exercises.exercises.flatMap(exercise => exercise.pages)];
  assert.ok(refs.every(ref => !ref.startsWith('p0174#')), 'Held N38 content escaped the boundary');
  counts = { prose: prose.prose.length, text: prose.prose.filter(block => block.kind === 'p').length,
    exercises: exercises.exercises.length, exerciseNumbers: exercises.exercises.map(exercise => exercise.number),
    figures: prose.figures.map(figure => figure.id), audit: index.audit };
  outputs.push(...['lesson.json', 'lesson.md', 'exercises.json'].map(file => bind(`${raw}/${file}`)));
  const prepared = run('adapt-prepare', [python, '-B', `${O}/native-scoped.py`, 'adapt-prepare']);
  assert.equal(prepared, 0, 'N37 native adaptation preparation failed');
  const templates = `${work}/adapt/6-8g/modern-us-neutral/lessons/${lesson}`;
  for (const file of ['lesson', 'exercises', 'figures'])
    outputs.push(bind(`${templates}/${file}.template.json`));
} catch (error) {
  failure = { name: error.name, message: error.message, stack: error.stack };
}
const manifest = {
  status: failure ? 'FAILED_PREPARATION_RETAINED' : 'PREPARED_NOT_APPROVED',
  book: '6-8g', requestedLesson: lesson, cwd: W,
  boundary: { leftInclusive: 'p0171#13', rightExclusive: 'p0174#1' },
  sourcePages, figureBindings, commands, counts, outputs, failure,
  reusedSourceReview: bind(review),
  priorSourceReview: `${B}/evidence/stemrobin188-6g-source169172/independent-review14/files/source169172-first-and167168-affected-review-13/report.md`,
  priorSource171Affected: `${B}/evidence/stemrobin188-6g-n32/204206-source169171-independent-review15/files/n32-204206-first-and-source169171-affected-review-14/report.md`,
  preservedHolds: ['N36 source167 caption/count/glyph', 'source174 post-heading token/role disagreement'],
  newSourceApproval: false, completeLessonApproved: false, published: false,
  canonicalWrites: 0, imagesLoaded: 0, sourcePageFinalizerReplays: 0,
};
fs.writeFileSync(`${O}/manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ status: manifest.status, counts, failure, manifest: `${O}/manifest.json` }));
if (failure) process.exitCode = 1;
