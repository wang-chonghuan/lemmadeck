import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const tmp = '.intentfold/tickets/STEMROBIN-188/tmp';
const N = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38';
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s2-n38';
const E = `${B}/editions/modern-us-neutral`;
const T = `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/${L}`;
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
  const root = `${N}/resume7`;
  fs.mkdirSync(root, { recursive: true });
  for (const extension of ['stdout', 'stderr', 'json'])
    assert.ok(!fs.existsSync(`${root}/${name}.${extension}`), `Existing execution: ${name}`);
  const result = spawnSync(command, argv, {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${root}/${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${root}/${name}.json`, `${JSON.stringify({
    cwd: W, command, argv, exitCode: result.status,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, `${name} failed`);
}
function retain(from, to) {
  for (const item of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, item.name);
    const target = path.join(to, item.name);
    assert.ok(!item.isSymbolicLink(), `Unexpected child symlink: ${source}`);
    if (item.isDirectory()) retain(source, target);
    else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (fs.existsSync(target))
        assert.ok(fs.readFileSync(source).equals(fs.readFileSync(target)),
          `Changed retained first bytes: ${target}`);
      else fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(target, 0o444);
    }
  }
}
if (process.argv[2] === 'retain-child') {
  const [, , , child, target, file, digest] = process.argv;
  assert.match(child, /^n38-[a-z0-9-]+7$/);
  assert.match(target, /^[a-z0-9-]+7$/);
  assert.equal(path.basename(file), file);
  assert.match(digest, /^[a-f0-9]{64}$/);
  assert.equal(hash(`${tmp}/${child}/${file}`), digest, 'Returned child hash differs');
  retain(`${tmp}/${child}`, `${N}/${target}`);
  console.log(JSON.stringify({
    retained: `${N}/${target}`, file, sha256: digest,
    producerReplays: 0, imagesLoadedByParent: 0, contentApprovedByRetention: false,
  }));
} else if (process.argv[2] === 'install-text') {
  const reviewFile = `${N}/content-independent7/comparison-review7.json`;
  assert.equal(hash(reviewFile), '4facc2d0c3c6f4ca28c45ff5f51ccb20d313693b2edd8bd2373b19bd5a3c62c8');
  const review = read(reviewFile);
  assert.equal(review.outcome, 'COMPARISON_PASS_WITH_499_HOLD');
  assert.equal(review.summary.prose.PASS, 20);
  assert.equal(review.summary.standards.PASS, 17);
  assert.equal(review.holds[0].exercise, '499');
  for (const key of ['lessonCandidate', 'exercisesCandidate'])
    assert.equal(hash(review.bindings[key].path), review.bindings[key].sha256);
  for (const name of ['lesson', 'exercises', 'figures'])
    copy(`${N}/text-author7/candidate/${name}.template.json`, `${T}/${name}.template.json`);
  const preparation = `${N}/preparation7`;
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(`${preparation}/artifacts/6-8g/lessons/${L}/${name}`, `${B}/lessons/${L}/${name}`);
  const manifest = read(`${preparation}/manifest.json`);
  for (const page of manifest.sourcePages) {
    const target = `${B}/pages/${String(page.physical).padStart(4, '0')}`;
    for (const name of ['page.json', 'page.md', 'audit.json']) {
      const from = path.join(path.dirname(page.path), name);
      if (fs.existsSync(from)) copy(from, `${target}/${name}`);
    }
  }
  for (const figure of manifest.figureBindings)
    copy(figure.output.path, `${B}/figures/${figure.id}.png`);
  execute('raw-reindex-first7', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
    '--book', '6-8g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json',
  ]);
  console.log('Approved N38 text and raw dependencies installed; all modern figures and 499 remain pending.');
} else if (process.argv[2] === 'prepare-label-repair') {
  const root = `${N}/figure-label-repair7`;
  assert.ok(!fs.existsSync(root), 'Existing repair candidate');
  for (const id of ['fig-232', 'fig-233'])
    for (const suffix of ['spec.json', 'supplemental.json'])
      copy(`${N}/fig232233-author7/${id}.${suffix}`, `${root}/${id}.${suffix}`);
  console.log('Writable affected label/provenance candidates prepared; original REVISE snapshots unchanged.');
} else if (process.argv[2] === 'bind-label-repair') {
  const root = `${N}/figure-label-repair7`;
  const changes = [];
  for (const id of ['fig-232', 'fig-233']) {
    const file = `${root}/${id}.spec.json`;
    const current = read(file);
    const expected = read(`${N}/fig232233-author7/${id}.spec.json`);
    const labels = id === 'fig-232' ? { '232-C': 'C', '232-D': 'D', '232-E': 'E' } : { '233-H': 'H' };
    for (const [objectId, label] of Object.entries(labels)) {
      assert.equal(expected.objects.find(object => object.id === objectId).label, '?');
      assert.equal(current.objects.find(object => object.id === objectId).label, label);
      expected.objects.find(object => object.id === objectId).label = label;
    }
    expected.source.inventory[0].description = current.source.inventory[0].description;
    if (id === 'fig-232') expected.description = current.description;
    else expected.source.inventory[6].description = current.source.inventory[6].description;
    assert.deepEqual(current, expected, 'Only specified labels and provenance descriptions may change');
    const supplementalFile = `${root}/${id}.supplemental.json`;
    const supplemental = read(supplementalFile);
    const previous = read(`${N}/fig232233-author7/${id}.supplemental.json`);
    for (const index of id === 'fig-232' ? [2] : [2, 24, 28])
      previous.checks[index].name = supplemental.checks[index].name;
    assert.deepEqual(supplemental, previous, 'Only affected check names may change');
    supplemental.spec.sha256 = hash(file);
    fs.writeFileSync(supplementalFile, `${JSON.stringify(supplemental, null, 2)}\n`);
    changes.push({ id, spec: file, sha256: hash(file), labels,
      geometryAssertionsDisplayUnchanged: true, supplementalGeometryChecksReused: true });
  }
  fs.writeFileSync(`${root}/resolution7.json`, `${JSON.stringify({
    status: 'affected-repair-review-pending',
    review: `${N}/fig232233-independent7/review7.json`,
    reviewSha256: 'd070a3880b1f59e2bbd3561dbddc17ea7a9588e616ed458ddba6a7a8006cf5b1',
    changes, sector6ArcGeometryUnchanged: true,
    sourceAlphabetCodeFineMarkRoles: 'UNKNOWN',
    originalCandidatesFirstFailuresAndReviewRetained: true,
    imagesLoadedByParent: 0,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Exact label/provenance-only changes bound; unchanged geometry checks reused.');
} else if (process.argv[2] === 'render-label-repair') {
  const root = `${N}/figure-label-repair7`;
  for (const id of ['fig-232', 'fig-233']) {
    execute(`render-label-repair-${id}-first7`, 'node', [
      '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
      '--spec', `${root}/${id}.spec.json`, '--svg', `${root}/${id}.svg`,
      '--report', `${root}/${id}.native.render.json`, '--png', `${root}/${id}.full.png`,
    ]);
    const report = read(`${root}/${id}.native.render.json`);
    report.spec.path = `${E}/figures/${id}.spec.json`;
    report.output.svg.path = `${E}/figures/${id}.svg`;
    fs.writeFileSync(`${root}/${id}.render.json`, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  }
} else if (process.argv[2] === 'promote-figure') {
  const [, , , id, author, review, digest] = process.argv;
  assert.match(id, /^fig-23[2-8]$/);
  assert.match(author, /^[a-z0-9-]+7$/);
  assert.match(review, /^[a-z0-9-]+7\/[a-z0-9-]+7\.json$/);
  assert.match(digest, /^[a-f0-9]{64}$/);
  const reviewFile = `${N}/${review}`;
  assert.equal(hash(reviewFile), digest);
  assert.equal(read(reviewFile).status, 'pass');
  for (const suffix of ['spec.json', 'svg', 'render.json'])
    copy(`${N}/${author}/${id}.${suffix}`, `${E}/figures/${id}.${suffix}`);
  execute(`record-review-${id}-first7`, 'python3', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${E}/figures/${id}.spec.json`,
    '--render', `${E}/figures/${id}.render.json`,
    '--output', `${E}/figures/${id}.review.json`, '--status', 'pass',
    '--notes', `Independent substantive source/geometry/visual/cultural review ${reviewFile} SHA256 ${digest}; original UNKNOWNs and failures retained. No rerender or image reopen.`,
  ]);
  const file = `${T}/figures.template.json`;
  const figures = read(file);
  const entry = figures.figures.find(figure => figure.id === id);
  assert.ok(entry, `Missing lesson figure ${id}`);
  for (const field of ['png', 'generation', 'artwork']) delete entry[field];
  Object.assign(entry, {
    spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
    render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
  });
  fs.writeFileSync(file, `${JSON.stringify(figures, null, 2)}\n`);
  console.log(`${id} promoted from its independent PASS; other figures unchanged.`);
} else if (['modern-finalize', 'render', 'answer-prepare', 'answer-finalize'].includes(process.argv[2])) {
  const stage = process.argv[2];
  const suffix = process.argv[3] || 'first7';
  assert.match(suffix, /^[a-z0-9-]+7$/);
  if (stage.startsWith('answer-')) {
    execute(`${stage}-${suffix}`, 'python3', [
      '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
      stage.slice('answer-'.length), '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L,
    ]);
  } else {
    execute(`${stage}-${suffix}`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
      stage === 'modern-finalize' ? 'adapt-finalize' : stage,
      '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L,
    ]);
  }
} else if (process.argv[2] === 'bind-answers') {
  const manyReview = `${N}/content-independent7/comparison-review7.json`;
  const oneReview = `${N}/content-independent7/answer499-review7.json`;
  assert.equal(read(manyReview).summary.standards.PASS, 17);
  assert.equal(read(oneReview).status, 'pass');
  const many = `${N}/seventeen-answers-author7/candidate-answer-keys.json`;
  const one = `${N}/answer499-author7/candidate-answer-keys.json`;
  const approved = [...read(many).answers, ...read(one).answers];
  assert.equal(approved.length, 18);
  const finalized = read(`${E}/lessons/${L}/exercises.json`);
  const reviewed = read(`${N}/text-author7/candidate/exercises.template.json`);
  assert.deepEqual(finalized.exercises.map(item => [item.number, item.text]),
    reviewed.exercises.map(item => [item.number, item.text]),
    'Final prompt content differs from the reviewed snapshot');
  const native = `.tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/${L}/answer-keys.template.json`;
  const template = read(native);
  assert.equal(template.answers.length, 18);
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
  fs.writeFileSync(`${N}/resume7/answers-binding7.json`, `${JSON.stringify({
    nativeTemplate: native, nativeTemplateSha256: hash(native),
    approvedMany: many, approvedManySha256: hash(many),
    approvedOne: one, approvedOneSha256: hash(one),
    reviewMany: manyReview, reviewManySha256: hash(manyReview),
    reviewOne: oneReview, reviewOneSha256: hash(oneReview),
    finalizedPromptSha256: hash(`${E}/lessons/${L}/exercises.json`),
    exactReviewedPromptTextRetained: true, currentFigureEvidencePreserved: true,
    answers: 18, derived: 18, ungraded: 18, parts: 0, published: false,
  }, null, 2)}\n`, { flag: 'wx' });
  console.log('Eighteen approved read-only standards bound to unchanged finalized prompts and native figure evidence.');
} else if (process.argv[2] === 'display') {
  const kind = process.argv[3];
  assert.ok(['text', 'exercises', 'choices'].includes(kind));
  execute(`display-${kind}-first7`, 'node', [`${tmp}/display-n38-7.mjs`, kind]);
} else if (process.argv[2] === 'record-display') {
  const kind = process.argv[3];
  assert.ok(['text', 'exercises', 'choices'].includes(kind));
  const name = process.argv[4] || 'review7';
  assert.match(name, /^[a-z0-9-]+7$/);
  const review = `${N}/${kind}-display-independent7/${name}.json`;
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
} else if (process.argv[2] === 'display-endpoints') {
  const suffix = process.argv[3] || 'first7';
  assert.match(suffix, /^[a-z0-9-]+7$/);
  execute(`display-exercises-endpoints-${suffix}`, 'node', [`${tmp}/endpoints-n38-7.mjs`]);
} else if (process.argv[2] === 'retain-choices') {
  const source = process.argv[3] === 'repair7' ? `${N}/choices-repair7` : `${tmp}/n38-choices-author7`;
  const review = `${N}/choices-independent7/review.json`;
  assert.equal(read(review).outcome, 'pass');
  copy(review, `${source}/review.json`);
  fs.chmodSync(`${source}/review.json`, 0o444);
  execute('choice-retain-first7', 'python3', [
    '.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
    '--repo', '.', '--book', '6-8g', '--lesson', L, '--source', source,
  ]);
} else if (process.argv[2] === 'prepare-choice-repair') {
  const target = `${N}/choices-repair7`;
  assert.ok(!fs.existsSync(target), 'Existing choice repair');
  for (const name of ['seed.json', 'draft.json'])
    copy(`${N}/choices-author7/${name}`, `${target}/${name}`);
  console.log('Writable affected-choice candidate prepared; original authors, FIRST and VIEWS unchanged.');
} else if (process.argv[2] === 'bind-choice-repair') {
  const target = `${N}/choices-repair7`;
  const original = `${N}/choices-author7/draft.json`;
  const current = read(`${target}/draft.json`);
  const expected = read(original);
  expected.questions[3].view.stem = current.questions[3].view.stem;
  const before = expected.questions[14];
  const after = current.questions[14];
  for (const [index, text] of ['$(6,9,22,12)$\u3002', '$(4,7,20,12)$\u3002', '$(14,20,46,12)$\u3002'].entries()) {
    assert.equal(after.view.options[index].text, text);
    before.view.options[index].text = text;
    for (const field of ['derivation', 'misconception'])
      before.key.rationales[index][field] = after.key.rationales[index][field];
  }
  assert.equal(after.intent.limitations.length, before.intent.limitations.length + 1);
  before.intent.limitations.push(after.intent.limitations.at(-1));
  const oldCoverage = expected.coverage.find(item => item.source_number === '501');
  const newCoverage = current.coverage.find(item => item.source_number === '501');
  assert.equal(newCoverage.omitted_tasks.length, oldCoverage.omitted_tasks.length + 1);
  oldCoverage.omitted_tasks.push(newCoverage.omitted_tasks.at(-1));
  oldCoverage.reason = newCoverage.reason;
  assert.deepEqual(current, expected, 'Only q04 stem and q15 leakage/rationale/loss fields may change');
  const visible = read(`${N}/choices-author7/view-only.json`);
  visible.questions = current.questions.map(question => question.view);
  fs.writeFileSync(`${target}/view-only.json`, `${JSON.stringify(visible, null, 2)}\n`, { flag: 'wx' });
  fs.writeFileSync(`${target}/resolution7.json`, `${JSON.stringify({
    status: 'affected-choice-review-pending', originalDraft: original,
    originalDraftSha256: hash(original), changedDraftSha256: hash(`${target}/draft.json`),
    sourceSeedUnchanged: true, sourceSolvingAndImageEvidenceReused: true,
    oldViewsReview: `${N}/choices-independent7/views-review.json`,
    oldViewsReviewSha256: '0a0e2b2b6e94ffe3beeda7959dde49f0e5c98f21f26616b44a1b2300edc90ffe',
    changedQuestions: ['q04', 'q15'], allKeysAndOtherQuestionFieldsUnchanged: true,
    q15FourthResultSharedAndNondiscriminating: true, recognitionLossExplicit: true,
    originalAuthorFirstFailuresAndReviewsRetained: true, parentImageLoads: 0,
    firstManualPatchFailure: 'Expected expanded JSON lines did not match compact option formatting; no bytes changed. Narrow source lookup then apply_patch succeeded.',
  }, null, 2)}\n`, { flag: 'wx' });
  for (const name of ['seed.json', 'draft.json', 'view-only.json', 'resolution7.json'])
    fs.chmodSync(`${target}/${name}`, 0o444);
  console.log(JSON.stringify({ target, draftSha256: hash(`${target}/draft.json`),
    viewSha256: hash(`${target}/view-only.json`), resolutionSha256: hash(`${target}/resolution7.json`) }));
} else if (process.argv[2] === 'retain-final') {
  for (const kind of ['text', 'exercises', 'choices'])
    assert.equal(read(`${N}/display7/${kind}.json`).status, 'pass');
  assert.equal(read(`${E}/lessons/${L}/choice-set/review.json`).outcome, 'pass');
  const root = `${N}/resume7`;
  for (const name of ['resume-n38-7.mjs', 'display-n38-7.mjs', 'stage-n38-7.mjs', 'endpoints-n38-7.mjs'])
    copy(`${tmp}/${name}`, `${root}/${name}`);
  for (const name of ['lesson', 'exercises', 'figures']) {
    copy(`${T}/${name}.template.json`, `${root}/${name}.final-template.json`);
    fs.chmodSync(`${root}/${name}.final-template.json`, 0o444);
  }
  console.log('Final templates and active helpers retained; complete offline N38 ready for narrow commit.');
} else {
  throw new Error(`Unknown continuation stage: ${process.argv[2]}`);
}
