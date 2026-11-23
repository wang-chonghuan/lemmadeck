import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const N = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37';
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s2-n37';
const E = `${B}/editions/modern-us-neutral`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const R = `${N}/resume7`;
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const tmp = '.intentfold/tickets/STEMROBIN-188/tmp';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
function copy(from, to) {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different existing bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
}
function execute(name, command, argv) {
  fs.mkdirSync(R, { recursive: true });
  for (const extension of ['stdout', 'stderr', 'json'])
    assert.ok(!fs.existsSync(`${R}/${name}.${extension}`), `Existing execution: ${name}`);
  const result = spawnSync(command, argv, {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${R}/${name}.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, `${name} failed`);
}
function suffix() {
  const value = process.argv[3] || 'first7';
  assert.match(value, /^[a-z0-9-]+7$/);
  return value;
}
function retain(source, target) {
  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, item.name);
    const to = path.join(target, item.name);
    assert.ok(!item.isSymbolicLink(), `Unexpected child symlink: ${from}`);
    if (item.isDirectory()) retain(from, to);
    else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      if (fs.existsSync(to))
        assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Changed sealed bytes: ${to}`);
      else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(to, 0o444);
    }
  }
}
if (process.argv[2] === 'authors') {
  const text = `${tmp}/n37-text-author7`;
  const answers = `${tmp}/n37-seven-answers-author7`;
  assert.equal(hash(`${text}/AUTHOR-RECORD.json`),
    '909989b48d250f9d29fab6a2adf46f5b005fc3f3548837e683a2c4ca94eebc41');
  assert.equal(hash(`${text}/candidate/lesson.template.json`),
    'c5837502d8984364b97b4b77272519144d1dddf15f36c887572047e7ed098a83');
  assert.equal(hash(`${text}/candidate/exercises.template.json`),
    'afb2e2ffebcd00204877c5bc65858a18be901d94baa0ddd1a76585b89d2c2cd2');
  assert.equal(hash(`${answers}/candidate-answer-keys.json`),
    '7c1a8d69280974e65c62020bb097b8c2ca0c79b6d713763b0305efff7f4dfcdd');
  const candidate = read(`${answers}/candidate-answer-keys.json`);
  assert.deepEqual(candidate.answers.map(answer => answer.exercise),
    ['480', '481', '482', '483', '484', '485', '487']);
  for (const answer of candidate.answers) {
    assert.equal(answer.source, 'derived');
    assert.equal(answer.grading, 'ungraded');
    assert.deepEqual(answer.parts, []);
  }
  retain(text, `${N}/text-author7`);
  retain(answers, `${N}/seven-answers-author7`);
  console.log('N37 text and seven answer author candidates retained; independent review pending.');
} else if (process.argv[2] === 'retain-child') {
  const [, , , child, target, file, digest] = process.argv;
  assert.match(child, /^n37-[a-z0-9-]+7$/);
  assert.match(target, /^[a-z0-9-]+7$/);
  if (file) {
    assert.equal(path.basename(file), file);
    assert.equal(hash(`${tmp}/${child}/${file}`), digest);
  }
  retain(`${tmp}/${child}`, `${N}/${target}`);
  console.log(`Retained ${child}; no source or producer replays.`);
} else if (process.argv[2] === 'working-text') {
  const review = read(`${N}/content-independent7/review.json`);
  assert.equal(review.approval_boundaries.actual_text_candidate_content_math, 'PASS_SCOPED');
  for (const input of review.inputs) assert.equal(hash(input.path), input.sha256);
  for (const name of ['lesson', 'exercises', 'figures'])
    copy(`${N}/text-author7/candidate/${name}.template.json`, `${T}/${name}.template.json`);
  console.log('Approved N37 text installed as writable working templates; figures pending.');
} else if (process.argv[2] === 'install') {
  const preparation = `${N}/preparation7`;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(`${preparation}/artifacts/6-8g/lessons/${L}/${name}`, `${B}/lessons/${L}/${name}`);
  for (const page of read(`${preparation}/manifest.json`).sourcePages) {
    assert.equal(hash(page.path), page.sha256);
    const target = `${B}/pages/${String(page.physical).padStart(4, '0')}`;
    copy(page.path, `${target}/page.json`);
    for (const name of ['page.md', 'audit.json']) {
      const from = path.join(path.dirname(page.path), name);
      if (fs.existsSync(from)) copy(from, `${target}/${name}`);
    }
  }
  for (const figure of read(`${preparation}/manifest.json`).figureBindings)
    copy(figure.output.path, `${B}/figures/${figure.id}.png`);
  execute('raw-reindex-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'reindex', '--book', '6-8g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json']);
  console.log('Retained N37 raw lesson and source dependencies installed; no source finalizer replay.');
} else if (process.argv[2] === 'promote-figures') {
  const author = `${N}/fig229231-author7`;
  const review = `${N}/fig229231-independent7/width-affected-review7.json`;
  assert.equal(read(review).status, 'pass');
  const manifest = read(`${author}/manifest.json`);
  const figures = read(`${T}/figures.template.json`);
  assert.deepEqual(manifest.figures.map(figure => figure.id), ['fig-229', 'fig-230', 'fig-231']);
  for (const figure of manifest.figures) {
    const source = `${N}/figure-width-repair7`;
    for (const suffix of ['spec.json', 'svg', 'render.json'])
      copy(`${source}/${figure.id}.${suffix}`, `${E}/figures/${figure.id}.${suffix}`);
    execute(`record-review-${figure.id}-first7`, 'python3', [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${E}/figures/${figure.id}.spec.json`,
      '--render', `${E}/figures/${figure.id}.render.json`,
      '--output', `${E}/figures/${figure.id}.review.json`, '--status', 'pass',
      '--notes', `Independent source-first mathematical/cultural/visual review ${review} SHA256 ${hash(review)}. Approved source/spec/SVG bytes unchanged; original UNKNOWNs and failures retained.`,
    ]);
    Object.assign(figures.figures.find(item => item.id === figure.id), {
      spec: `figures/${figure.id}.spec.json`, svg: `figures/${figure.id}.svg`,
      render: `figures/${figure.id}.render.json`, review: `figures/${figure.id}.review.json`,
    });
  }
  fs.writeFileSync(`${T}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
  console.log('Three approved figures promoted; no native rerenders or image reopens.');
} else if (process.argv[2] === 'prepare-figure-repair') {
  const target = `${N}/figure-provenance-repair7`;
  assert.ok(!fs.existsSync(target), 'Existing provenance repair');
  for (const suffix of ['spec.json', 'svg', 'render.json'])
    copy(`${N}/fig229231-author7/fig-229.${suffix}`, `${target}/fig-229.${suffix}`);
  console.log('Writable figure229 provenance repair created; original rejected snapshot retained.');
} else if (process.argv[2] === 'bind-figure-repair') {
  const original = `${N}/fig229231-author7`;
  const target = `${N}/figure-provenance-repair7`;
  const spec = read(`${target}/fig-229.spec.json`);
  const expected = read(`${original}/fig-229.spec.json`);
  expected.source.inventory[0].description = spec.source.inventory[0].description;
  assert.deepEqual(spec, expected, 'Only source inventory description may change');
  assert.equal(hash(`${target}/fig-229.svg`), hash(`${original}/fig-229.svg`));
  execute('validate-provenance-fig229-first7', 'python3', [
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    `${target}/fig-229.spec.json`, '--stage', 'draft',
  ]);
  const report = read(`${target}/fig-229.render.json`);
  assert.deepEqual(report, read(`${original}/fig-229.render.json`));
  report.spec.sha256 = hash(`${target}/fig-229.spec.json`);
  fs.writeFileSync(`${target}/fig-229.render.json`, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(`${target}/recovery.json`, `${JSON.stringify({
    originalSpec: `${original}/fig-229.spec.json`,
    currentSpec: `${target}/fig-229.spec.json`,
    originalRender: `${original}/fig-229.render.json`,
    currentRender: `${target}/fig-229.render.json`,
    changedSpecFields: ['source.inventory[0].description'],
    changedRenderFields: ['spec.sha256'],
    sourceSvgGeometryLabelsAssertionsDisplayChanged: false,
    rendererReplays: 0, imagesLoaded: 0, independentAffectedReviewPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Provenance-only repair bound to unchanged native SVG; no renderer replay.');
} else if (process.argv[2] === 'figure-surfaces') {
  execute('figure-affected-surfaces-first7', 'node', [`${tmp}/figure-surfaces-n37-7.mjs`]);
} else if (process.argv[2] === 'prepare-width-repair') {
  const target = `${N}/figure-width-repair7`;
  assert.ok(!fs.existsSync(target), 'Existing width metadata repair');
  for (const id of ['fig-229', 'fig-230', 'fig-231']) {
    const source = `${N}/${id === 'fig-229' ? 'figure-provenance-repair7' : 'fig229231-author7'}`;
    for (const suffix of ['spec.json', 'svg', 'render.json'])
      copy(`${source}/${id}.${suffix}`, `${target}/${id}.${suffix}`);
  }
  console.log('Writable width-only metadata candidates created; original REVISE snapshots retained.');
} else if (process.argv[2] === 'bind-width-repair') {
  const target = `${N}/figure-width-repair7`;
  const records = [];
  for (const id of ['fig-229', 'fig-230', 'fig-231']) {
    const source = `${N}/${id === 'fig-229' ? 'figure-provenance-repair7' : 'fig229231-author7'}`;
    const current = read(`${target}/${id}.spec.json`);
    const expected = read(`${source}/${id}.spec.json`);
    expected.display.widths = [...expected.display.widths,
      ...(id === 'fig-229' ? [346] : [294, 295])].sort((a, b) => a - b);
    assert.deepEqual(current, expected, 'Only declared display widths may change');
    assert.equal(hash(`${target}/${id}.svg`), hash(`${source}/${id}.svg`));
    execute(`validate-widths-${id}-first7`, 'python3', [
      '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
      `${target}/${id}.spec.json`, '--stage', 'draft',
    ]);
    const report = read(`${target}/${id}.render.json`);
    assert.deepEqual(report, read(`${source}/${id}.render.json`));
    report.spec.sha256 = hash(`${target}/${id}.spec.json`);
    fs.writeFileSync(`${target}/${id}.render.json`, `${JSON.stringify(report, null, 2)}\n`);
    records.push({
      id, originalSpec: `${source}/${id}.spec.json`, currentSpec: `${target}/${id}.spec.json`,
      originalRender: `${source}/${id}.render.json`, currentRender: `${target}/${id}.render.json`,
      changedSpecFields: ['display.widths'], changedRenderFields: ['spec.sha256'],
      actualMobileMediaWidth: id === 'fig-229' ? 346 : 294.40625,
      declaredIntegerWidths: id === 'fig-229' ? [346] : [294, 295],
      existingNativeDisplayChecksUnchanged: true, newNativeBracketChecksClaimed: false,
    });
  }
  fs.writeFileSync(`${target}/recovery.json`, `${JSON.stringify({
    records, actualSurfaceEvidence: `${N}/figure-surfaces7/manifest.json`,
    actualSurfaceEvidenceSha256: hash(`${N}/figure-surfaces7/manifest.json`),
    interpretation: 'The native FigureSpec checker requires integer widths. Declare integer brackets for fractional actual media widths and preserve exact measured media/font widths in the bound surface evidence. Existing narrower 280px native checks and actual-surface PASS remain applicable.',
    checkerChanged: false, sourceSvgGeometryLabelsAssertionsChanged: false,
    rendererReplays: 0, imagesLoaded: 0, independentAffectedReviewPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Integer declarations bound to exact actual fractional-width proof; no new native display checks claimed.');
} else if (process.argv[2] === 'modern') {
  execute(`modern-finalize-${suffix()}`, P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-finalize', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'repair-native-text') {
  const target = `${N}/native-text-repair7`;
  assert.ok(!fs.existsSync(target), 'Existing native text repair');
  for (const name of ['lesson', 'exercises'])
    copy(`${T}/${name}.template.json`, `${target}/${name}.before.json`);
  copy(`${E}/lessons/${L}/adaptation.audit.json`, `${target}/adaptation.audit.before.json`);
  execute('diagnose-native-layout-first7', P, ['-B', '-c',
    `import sys,json; sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools'); import edition; x=json.load(open('${T}/lesson.template.json')); print(json.dumps([{'block':i,'paragraphs':edition.normalize_prose_layout(b['text']).split('\\n\\n')} for i,b in enumerate(x['prose']) if b['kind']=='p'],ensure_ascii=False))`,
  ]);
  const outline = JSON.parse(fs.readFileSync(`${R}/diagnose-native-layout-first7.stdout`, 'utf8'));
  const lesson = read(`${T}/lesson.template.json`);
  lesson.section_breaks = [
    { before: outline.find(item => item.block === 0).paragraphs.at(-1),
      after: outline.find(item => item.block === 3).paragraphs[0] },
    { before: outline.find(item => item.block === 4).paragraphs.at(-1),
      after: outline.find(item => item.block === 5).paragraphs[0] },
  ];
  const exercises = read(`${T}/exercises.template.json`);
  const exercise = exercises.exercises.find(item => item.number === '487');
  assert.ok(exercise.text.startsWith('$487^{*}$. '));
  exercise.text = exercise.text.replace('$487^{*}$. ', '487* ');
  exercise.lines = exercise.text.split('\n');
  for (const [name, value] of [['lesson', lesson], ['exercises', exercises]]) {
    fs.writeFileSync(`${T}/${name}.template.json`, `${JSON.stringify(value, null, 2)}\n`);
    copy(`${T}/${name}.template.json`, `${target}/${name}.template.json`);
  }
  fs.writeFileSync(`${target}/recovery.json`, `${JSON.stringify({
    failedNative: `${R}/modern-finalize-first7.json`,
    changedFields: ['lesson.section_breaks', 'exercises[8].text prefix', 'exercises[8].lines prefix'],
    sourceTextBodyMathAndPrintedStarChanged: false,
    boundaryMeaning: ['translation argument to direction-angle definition', 'congruence conclusion to magnitude/region clarification'],
    nativeNormalizerUsedForBoundaryAnchors: true,
    originalPassSourceFiguresAndSevenStandardsReused: true,
    affectedIndependentReviewPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Only normalized boundary anchors and literal printed487* prefix repaired; original failure retained.');
} else if (process.argv[2] === 'answer-prepare' || process.argv[2] === 'answer-finalize') {
  const stage = process.argv[2];
  execute(`${stage}-${suffix()}`, 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    stage.slice('answer-'.length), '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'render') {
  execute(`render-${suffix()}`, P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'render', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'bind-answers') {
  const sevenReview = `${N}/content-independent7/review.json`;
  const twoReview = `${N}/content-independent7/answer479486-review7.json`;
  assert.equal(read(sevenReview).approval_boundaries.actual_seven_figure_free_standard_content_math, 'PASS_SCOPED');
  assert.equal(read(twoReview).status, 'pass');
  const seven = `${N}/seven-answers-author7/candidate-answer-keys.json`;
  const two = `${N}/answer479486-author7/candidate-answer-keys.json`;
  const approved = [...read(seven).answers, ...read(two).answers];
  assert.equal(approved.length, 9);
  const native = `.tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/${L}/answer-keys.template.json`;
  const template = read(native);
  for (const answer of template.answers) {
    const matches = approved.filter(item => item.exercise === answer.exercise);
    assert.equal(matches.length, 1);
    const current = matches[0];
    assert.equal(current.source, 'derived');
    assert.equal(current.grading, 'ungraded');
    assert.deepEqual(current.parts, []);
    assert.ok(current.displayAnswer);
    for (const field of ['source', 'grading', 'displayAnswer', 'parts', 'notes', 'historical_entities'])
      if (Object.hasOwn(current, field)) answer[field] = current[field];
  }
  const target = `${E}/lessons/${L}/answer-keys.json`;
  assert.ok(!fs.existsSync(target), 'Existing answer keys');
  fs.writeFileSync(target, `${JSON.stringify(template, null, 2)}\n`, { flag: 'wx' });
  fs.mkdirSync(R, { recursive: true });
  fs.writeFileSync(`${R}/answers-binding7.json`, `${JSON.stringify({
    nativeTemplate: native, nativeTemplateSha256: hash(native),
    approvedSeven: seven, approvedSevenSha256: hash(seven),
    approvedTwo: two, approvedTwoSha256: hash(two),
    reviewSeven: sevenReview, reviewSevenSha256: hash(sevenReview),
    reviewTwo: twoReview, reviewTwoSha256: hash(twoReview),
    currentPromptAndFigureEvidencePreserved: true,
    answers: 9, derived: 9, ungraded: 9, parts: 0, published: false,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Nine approved read-only answers bound to native modern prompts and figure evidence.');
} else if (process.argv[2] === 'display') {
  const kind = process.argv[3];
  assert.ok(['text', 'exercises', 'choices'].includes(kind));
  execute(`display-${kind}-first7`, 'node', [`${tmp}/display-n37-7.mjs`, kind]);
} else if (process.argv[2] === 'choice-seed') {
  const lesson = read(`${E}/lessons/${L}/lesson.json`);
  const exercises = read(`${E}/lessons/${L}/exercises.json`);
  execute('choice-seed-first7', 'python3', [
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
    '--repo', '.', '--book', '6-8g', '--lesson', L,
    ...exercises.exercises.flatMap(exercise => ['--exercise', exercise.number]),
    ...lesson.prose.flatMap((block, index) => block.kind === 'p'
      ? ['--concept-block', String(index)] : []),
    '--concept-figure', 'fig-229',
    '--out', `${tmp}/n37-choices7/seed.json`,
  ]);
} else if (process.argv[2] === 'choice-views') {
  const file = `${R}/choice-views-first7.json`;
  assert.ok(!fs.existsSync(file), 'Existing views disclosure');
  const draft = read(`${tmp}/n37-choices7/draft.json`);
  fs.writeFileSync(file, `${JSON.stringify({
    questions: draft.questions.map(question => ({ id: question.id, view: question.view })),
  }, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  console.log(JSON.stringify({ path: file, sha256: hash(file), keysDisclosed: false }));
} else if (process.argv[2] === 'retain-choices') {
  const source = `${tmp}/n37-choices7`;
  const review = `${N}/choices-independent7/review.json`;
  assert.equal(read(review).outcome, 'pass');
  copy(review, `${source}/review.json`);
  fs.chmodSync(`${source}/review.json`, 0o444);
  execute('choice-retain-first7', 'python3', [
    '.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
    '--repo', '.', '--book', '6-8g', '--lesson', L, '--source', source,
  ]);
} else if (process.argv[2] === 'record-display') {
  const kind = process.argv[3];
  assert.ok(['text', 'exercises', 'choices'].includes(kind));
  const review = `${N}/${kind}-display-independent7/review.json`;
  assert.equal(read(review).status, 'pass');
  const file = `${N}/display7/${kind}.json`;
  const before = `${N}/display7/${kind}.before-visual-review7.json`;
  copy(file, before);
  fs.chmodSync(before, 0o444);
  const data = read(file);
  assert.equal(data.status, 'mechanical-pass-visual-review-pending');
  data.status = 'pass';
  data.independentReview = review;
  data.independentReviewSha256 = hash(review);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${kind} complete display PASS recorded; original mechanical snapshot retained.`);
} else if (process.argv[2] === 'retain-final') {
  for (const kind of ['text', 'exercises', 'choices'])
    assert.equal(read(`${N}/display7/${kind}.json`).status, 'pass');
  assert.equal(read(`${E}/lessons/${L}/choice-set/review.json`).outcome, 'pass');
  for (const name of ['resume-n37-7.mjs', 'display-n37-7.mjs', 'stage-n37-7.mjs',
    'figure-surfaces-n37-7.mjs'])
    copy(`${tmp}/${name}`, `${R}/${name}`);
  for (const name of ['lesson', 'exercises', 'figures']) {
    copy(`${T}/${name}.template.json`, `${R}/${name}.final-template.json`);
    fs.chmodSync(`${R}/${name}.final-template.json`, 0o444);
  }
  console.log('Final templates and active helpers retained; complete offline N37 ready for narrow commit.');
} else {
  throw new Error('Select authors, retain-child, install, modern, answer-prepare, answer-finalize, render or choice-seed');
}
