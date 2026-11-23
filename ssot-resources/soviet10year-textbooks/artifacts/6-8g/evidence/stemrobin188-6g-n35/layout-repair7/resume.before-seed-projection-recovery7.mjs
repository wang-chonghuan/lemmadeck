import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s2-n35';
const N = `${B}/evidence/stemrobin188-6g-n35`;
const E = `${B}/editions/modern-us-neutral`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
const R = `${N}/resume7`;
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (from, to) => {
  if (fs.existsSync(to)) {
    assert.ok(fs.readFileSync(from).equals(fs.readFileSync(to)), `Different existing bytes: ${to}`);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
};
const retain = (source, target) => {
  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, item.name);
    const to = path.join(target, item.name);
    assert.ok(!item.isSymbolicLink(), `Unexpected symlink: ${from}`);
    if (item.isDirectory()) retain(from, to);
    else {
      copy(from, to);
      fs.chmodSync(to, 0o444);
    }
  }
};
const execute = (name, command, argv) => {
  fs.mkdirSync(R, { recursive: true });
  for (const extension of ['stdout', 'stderr', 'json'])
    assert.ok(!fs.existsSync(`${R}/${name}.${extension}`), `Existing execution: ${name}`);
  const result = spawnSync(command, argv, { cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${R}/${name}.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, `${name} failed`);
};
const suffix = () => {
  const value = process.argv[3] || 'first7';
  assert.match(value, /^[a-z0-9-]+7$/);
  return value;
};
if (process.argv[2] === 'authors') {
  const root = '.intentfold/tickets/STEMROBIN-188/tmp';
  assert.equal(hash(`${root}/n35-text-author7/lesson.template.json`),
    'e4adb032a0171cb919edd7204b1caa319c16a3813d21966859c39396344c038d');
  assert.equal(hash(`${root}/n35-text-author7/exercises.template.json`),
    '0f103a9b9f71b52f767a31c65f0d739ade98e15314935decf84a65ccfff3ca81');
  assert.equal(hash(`${root}/n35-nine-answers-author7/candidate-answer-keys.json`),
    '278753ebdc2164aa6105a9ece63c19751d673ba05ce47314ebe1990a78e69a69');
  retain(`${root}/n35-text-author7`, `${N}/text-author7`);
  retain(`${root}/n35-nine-answers-author7`, `${N}/nine-answers-author7`);
  retain(`${root}/n35-content-independent7`, `${N}/content-independent7`);
  console.log('N35 author candidates and sealed SOURCE-FIRST retained; approval still pending.');
} else if (process.argv[2] === 'content-review') {
  retain('.intentfold/tickets/STEMROBIN-188/tmp/n35-content-independent7',
    `${N}/content-independent7`);
  console.log('N35 independent comparison retained without rewriting earlier seals.');
} else if (process.argv[2] === 'retain-child') {
  const [, , , child, target, filename, expectedHash] = process.argv;
  assert.match(child, /^n35-[a-z0-9-]+7$/);
  assert.match(target, /^[a-z0-9-]+7$/);
  const source = `.intentfold/tickets/STEMROBIN-188/tmp/${child}`;
  if (filename) {
    assert.equal(path.basename(filename), filename);
    assert.equal(hash(`${source}/${filename}`), expectedHash);
  }
  retain(source, `${N}/${target}`);
  console.log(`Retained ${child} without rerunning its source, author or review stages.`);
} else if (process.argv[2] === 'working-text') {
  const review = read(`${N}/content-independent7/comparison-review.json`);
  for (const scope of ['complete-modern-prose', 'all-ten-modern-prompts',
    'textual-layout-and-flow-boundaries'])
    assert.equal(review.scope_verdicts.find(item => item.scope === scope).verdict, 'PASS');
  for (const name of ['lesson', 'exercises', 'figures'])
    copy(`${N}/text-author7/${name}.template.json`, `${T}/${name}.template.json`);
  console.log('Approved N35 text installed as writable working templates; figures/finalization pending.');
} else if (process.argv[2] === 'repair-answer-text') {
  const source = `${N}/nine-answers-author7/candidate-answer-keys.json`;
  const target = `${N}/nine-answers-text-repair7/candidate-answer-keys.json`;
  assert.ok(!fs.existsSync(target), 'Existing answer text repair');
  const data = read(source);
  for (const id of ['452', '453', '459']) {
    const answer = data.answers.find(item => item.exercise === id);
    assert.ok(answer.displayAnswer.includes('\u0431)'));
    answer.displayAnswer = answer.displayAnswer.replaceAll('\u0431)', 'b)')
      .replaceAll('\u0432)', 'c)');
  }
  const answer = data.answers.find(item => item.exercise === '457');
  const before = "\u5373\u4f7f $P$ \u5206\u522b\u6210\u4e3a $OO'$\u3001$MM'$ \u7684\u4e2d\u70b9";
  assert.equal(answer.displayAnswer.split(before).length, 2);
  answer.displayAnswer = answer.displayAnswer.replace(before,
    "\u4e5f\u5c31\u662f\u4f7f $P$ \u5206\u522b\u6210\u4e3a $OO'$\u3001$MM'$ \u7684\u4e2d\u70b9");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  console.log(JSON.stringify({ affectedAnswers: ['452', '453', '457', '459'],
    changedField: 'displayAnswer', sourceAndMathChanged: false,
    path: target, sha256: hash(target), affectedReviewPending: true }));
} else if (process.argv[2] === 'promote-figures') {
  const author = process.argv[3];
  const independent = process.argv[4];
  for (const name of [author, independent]) assert.match(name, /^fig[0-9]+-[a-z]+7$/);
  const manifest = read(`${N}/${author}/manifest.json`);
  const batch = manifest.batch || manifest.scope;
  const originalRoot = manifest.ownedDirectory || manifest.owned
    || `${W}/.intentfold/tickets/STEMROBIN-188/tmp/n35-${author}`;
  const candidateFile = (figure, suffix) => {
    const field = { 'spec.json': 'spec', svg: 'svg', 'render.json': 'render' }[suffix];
    const original = figure.current?.[suffix]?.path || figure[field]?.path;
    if (!original) return `${N}/${author}/${figure.id}.${suffix}`;
    if (original === `${figure.id}.${suffix}`) return `${N}/${author}/${original}`;
    const relative = path.relative(originalRoot, original);
    assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative));
    return path.join(N, author, relative);
  };
  const reviewFile = `${N}/${independent}/review.json`;
  assert.equal(read(reviewFile).status, 'pass');
  const figures = read(`${T}/figures.template.json`);
  for (const figure of manifest.figures) {
    assert.ok(batch.includes(figure.id));
    for (const suffix of ['spec.json', 'svg'])
      copy(candidateFile(figure, suffix), `${E}/figures/${figure.id}.${suffix}`);
    const producerFile = candidateFile(figure, 'render.json');
    const producer = read(producerFile);
    let pathAdjusted = false;
    if (producer.output.svg.path === `figures/${figure.id}.svg`) {
      producer.output.svg.path = `${E}/figures/${figure.id}.svg`;
      producer.spec.path = `${E}/figures/${figure.id}.spec.json`;
      pathAdjusted = true;
    }
    const target = `${E}/figures/${figure.id}.render.json`;
    if (!fs.existsSync(target)) copy(producerFile, target);
    if (pathAdjusted) {
      const recoveryFile = `${R}/${figure.id}.render-path-recovery7.json`;
      assert.ok(!fs.existsSync(recoveryFile));
      fs.writeFileSync(target, `${JSON.stringify(producer, null, 2)}\n`);
      fs.writeFileSync(recoveryFile, `${JSON.stringify({
        originalRender: producerFile, originalSha256: hash(producerFile),
        currentRender: target, currentSha256: hash(target),
        changedFields: ['spec.path', 'output.svg.path'], sourceSpecSvgHashesChanged: false,
        geometryOrDisplayChanged: false, rendererReplays: 0,
        reusedIndependentReview: reviewFile, reusedIndependentReviewSha256: hash(reviewFile),
        diagnosis: 'Native record_review resolves producer output paths from repository CWD, not producer.root.',
      }, null, 2)}\n`, { flag: 'wx' });
    }
    const firstFailed = fs.existsSync(`${R}/record-review-${figure.id}-first7.json`);
    execute(`record-review-${figure.id}-${firstFailed ? 'path-recovery7' : 'first7'}`, 'python3', [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${E}/figures/${figure.id}.spec.json`,
      '--render', `${E}/figures/${figure.id}.render.json`,
      '--output', `${E}/figures/${figure.id}.review.json`, '--status', 'pass',
      '--notes', `Independent source-first mathematical/cultural/visual review ${reviewFile} SHA256 ${hash(reviewFile)}. Approved spec/SVG bytes unchanged. ${pathAdjusted ? `Producer path-only relocation recorded in ${R}/${figure.id}.render-path-recovery7.json. ` : ''}Original failures, revisions and source UNKNOWN remain retained.`,
    ]);
    Object.assign(figures.figures.find(item => item.id === figure.id), {
      spec: `figures/${figure.id}.spec.json`, svg: `figures/${figure.id}.svg`,
      render: `figures/${figure.id}.render.json`, review: `figures/${figure.id}.review.json`,
    });
  }
  fs.writeFileSync(`${T}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
  console.log(JSON.stringify({ promoted: batch, nativeRerenders: 0, imagesLoaded: 0 }));
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
  for (const id of [214, 215, 216, 217, 218])
    copy(`${preparation}/artifacts/6-8g/figures/fig-${id}.png`, `${B}/figures/fig-${id}.png`);
  execute('raw-reindex-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'reindex', '--book', '6-8g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json']);
  console.log(JSON.stringify({ rawLessonInstalled: L, sourceWordsChanged: 0,
    originalFiguresInstalled: 5, sourceFinalizerReplays: 0, approvedLesson: false, published: false }));
} else if (process.argv[2] === 'modern') {
  execute(`modern-finalize-${suffix()}`, P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'adapt-finalize', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'answer-prepare') {
  execute(`answer-prepare-${suffix()}`, 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'prepare', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'choice-seed') {
  execute('choice-seed-first7', 'python3', [
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
    '--repo', '.', '--book', '6-8g', '--lesson', L,
    ...[450, 451, 452, 453, 454, 455, 456, 457, 458, 459]
      .flatMap(number => ['--exercise', String(number)]),
    ...[1, 2, 7, 8, 9, 12, 13, 14, 20]
      .flatMap(index => ['--concept-block', String(index)]),
    '--out', '.intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/seed.json',
  ]);
} else if (process.argv[2] === 'choice-structural') {
  execute('choice-structural-symbol-recovery7', 'python3', [
    '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
    '--seed', '.intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/seed.json',
    '--draft', '.intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/draft.json',
  ]);
} else if (process.argv[2] === 'choice-layout-seed') {
  const target = '.intentfold/tickets/STEMROBIN-188/tmp/n35-choices-layout7';
  assert.ok(!fs.existsSync(`${target}/seed.json`), 'Existing recovery seed');
  execute('choice-seed-layout-recovery7', 'python3', [
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', 'prepare',
    '--repo', '.', '--book', '6-8g', '--lesson', L,
    ...[450, 451, 452, 453, 454, 455, 456, 457, 458, 459]
      .flatMap(number => ['--exercise', String(number)]),
    ...[1, 2, 7, 8, 9, 12, 13, 14, 20]
      .flatMap(index => ['--concept-block', String(index)]),
    '--out', `${target}/seed.json`,
  ]);
  const digest = fs.readFileSync(`${R}/choice-seed-layout-recovery7.stdout`, 'utf8')
    .match(/seed_sha256=([a-f0-9]{64})/)[1];
  const oldSeed = read(`${N}/choices-author7/seed.json`);
  const newSeed = read(`${target}/seed.json`);
  const expected = structuredClone(oldSeed);
  expected.trace = newSeed.trace;
  for (const number of ['454', '456', '459']) {
    const marker = number === '459' ? '*' : '\\bullet';
    const exercise = expected.exercises.find(item => item.number === number);
    const before = `$${number}^{${marker}}.$`;
    assert.ok(exercise.text.startsWith(before));
    exercise.text = `$${number}^{${marker}}$.` + exercise.text.slice(before.length);
  }
  assert.deepEqual(newSeed, expected, 'Unexpected source change in seed recovery');
  const oldDraft = read(`${N}/choices-author7/draft.json`);
  const draft = { ...oldDraft, seed_sha256: digest };
  fs.writeFileSync(`${target}/draft.json`, `${JSON.stringify(draft, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  fs.chmodSync(`${target}/seed.json`, 0o444);
  fs.writeFileSync(`${N}/layout-repair7/choice-binding-recovery7.json`, `${JSON.stringify({
    oldSeed: `${N}/choices-author7/seed.json`, oldSeedSha256: oldDraft.seed_sha256,
    currentSeed: `${target}/seed.json`, currentSeedSha256: digest,
    oldDraft: `${N}/choices-author7/draft.json`, oldDraftBytesSha256: hash(`${N}/choices-author7/draft.json`),
    currentDraft: `${target}/draft.json`, currentDraftBytesSha256: hash(`${target}/draft.json`),
    draftChangedFields: ['seed_sha256'], seedChangedFields: ['three prefix periods', 'source trace hashes'],
    viewsKeysIntentsCoverageAndFiguresChanged: false,
    reusedSourceFirst: `${N}/choices-independent7/SOURCE-FIRST.md`,
    reusedViewsFirst: `${N}/choices-independent7/VIEWS-FIRST.md`,
    additionalImages: 0, semanticComparisonPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ seed: `${target}/seed.json`, draft: `${target}/draft.json`,
    seed_sha256: digest, draftChangedFields: ['seed_sha256'], imagesLoaded: 0 }));
} else if (process.argv[2] === 'choice-views') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n35-choices7/draft.json';
  const draft = read(source);
  const target = `${R}/choice-views-first7.json`;
  fs.writeFileSync(target, `${JSON.stringify({
    schema: 'stemrobin188/choice-views-first@1', lesson: L,
    questions: draft.questions.map(question => ({ id: question.id, view: question.view })),
    new_figures: draft.new_figures.map(({ id, path, sha256 }) => ({ id, path, sha256 })),
  }, null, 2)}\n`, { flag: 'wx', mode: 0o444 });
  console.log(JSON.stringify({ views: target, sha256: hash(target),
    questions: draft.questions.length, options: draft.questions.reduce((n, q) => n + q.view.options.length, 0),
    newFigures: draft.new_figures.length, keysOrIntentsDisclosed: false }));
} else if (process.argv[2] === 'answers') {
  execute(`answer-finalize-${suffix()}`, 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'finalize', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'repair-prefix-layout') {
  const recovery = `${N}/layout-repair7`;
  assert.ok(!fs.existsSync(recovery), 'Existing prefix repair');
  const files = {
    working: `${T}/exercises.template.json`,
    exercises: `${E}/lessons/${L}/exercises.json`,
    answers: `${E}/lessons/${L}/answer-keys.json`,
    html: `.tmp/ld-s10y-lesson/render/6-8g/modern-us-neutral/${L}/exercises.html`,
  };
  for (const [name, file] of Object.entries(files)) {
    copy(file, `${recovery}/${name}.before${path.extname(file)}`);
    fs.chmodSync(`${recovery}/${name}.before${path.extname(file)}`, 0o444);
  }
  const template = read(files.working);
  for (const number of ['454', '456', '459']) {
    const exercise = template.exercises.find(item => item.number === number);
    const marker = number === '459' ? '*' : '\\bullet';
    const before = `$${number}^{${marker}}.$`;
    const after = `$${number}^{${marker}}$.`;
    assert.ok(exercise.text.startsWith(before));
    exercise.text = after + exercise.text.slice(before.length);
    assert.ok(exercise.lines[0].startsWith(before));
    exercise.lines[0] = after + exercise.lines[0].slice(before.length);
    if (!exercise.changes.includes('layout')) exercise.changes.push('layout');
  }
  fs.writeFileSync(files.working, `${JSON.stringify(template, null, 2)}\n`);
  fs.writeFileSync(`${recovery}/recovery.json`, `${JSON.stringify({
    diagnosis: 'Annotated printed prefixes require a prose period outside math. Offline answer fragments lacked the existing application sr-nb CSS.',
    originalDisplayFailure: `${N}/exercises-display-independent7/review.json`,
    originalDisplayFailureSha256: hash(`${N}/exercises-display-independent7/review.json`),
    before: Object.fromEntries(Object.entries(files).map(([name, file]) => [name, {
      path: `${recovery}/${name}.before${path.extname(file)}`,
      sha256: hash(`${recovery}/${name}.before${path.extname(file)}`),
    }])),
    unchangedLessonSha256: hash(`${E}/lessons/${L}/lesson.json`),
    affectedPrompts: ['454', '456', '459'],
    changedFields: ['text', 'lines', 'changes:layout'],
    rawAndSourceTextChanged: false, mathematicsChanged: false,
    answer451ContentChanged: false, sharedCodeChanged: false,
    affectedDisplayReviewPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Three prefix periods repaired; original templates, outputs and failed display retained.');
} else if (process.argv[2] === 'bind-layout-prompts') {
  const recovery = `${N}/layout-repair7`;
  const original = read(`${recovery}/answers.before.json`);
  const file = `${E}/lessons/${L}/answer-keys.json`;
  const answers = read(file);
  assert.deepEqual(answers, original);
  const exercises = read(`${E}/lessons/${L}/exercises.json`);
  for (const number of ['454', '456', '459'])
    answers.answers.find(item => item.exercise === number).prompt =
      exercises.exercises.find(item => item.number === number).text;
  assert.equal(hash(`${E}/lessons/${L}/lesson.json`), read(`${recovery}/recovery.json`).unchangedLessonSha256);
  fs.writeFileSync(file, `${JSON.stringify(answers, null, 2)}\n`);
  console.log('Only three canonical answer prompt bindings updated; standards and figure evidence unchanged.');
} else if (process.argv[2] === 'bind-answers') {
  const review = `${N}/content-independent7/answer450-review7.json`;
  assert.equal(read(review).status, 'pass');
  const nine = `${N}/nine-answers-text-repair7/candidate-answer-keys.json`;
  const one = `${N}/answer450-author7/candidate-answer-keys.json`;
  const approved = [...read(nine).answers, ...read(one).answers];
  assert.equal(approved.length, 10);
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
  fs.writeFileSync(`${R}/answers-binding7.json`, `${JSON.stringify({
    nativeTemplate: native, nativeTemplateSha256: hash(native),
    approvedNine: nine, approvedNineSha256: hash(nine),
    approvedOne: one, approvedOneSha256: hash(one),
    review450: review, review450Sha256: hash(review),
    reviewNine: `${N}/content-independent7/affected-review7.json`,
    currentPromptAndFigureEvidencePreserved: true, answers: 10,
    derived: 10, ungraded: 10, parts: 0, published: false,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Ten approved read-only answers installed; native finalization still pending.');
} else if (process.argv[2] === 'render') {
  execute(`render-${suffix()}`, P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'render', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
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
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${kind} complete display PASS recorded; original mechanical snapshot retained.`);
} else {
  throw new Error('Select authors, content-review, working-text, repair-answer-text, install, modern, answer-prepare, answers or render');
}
