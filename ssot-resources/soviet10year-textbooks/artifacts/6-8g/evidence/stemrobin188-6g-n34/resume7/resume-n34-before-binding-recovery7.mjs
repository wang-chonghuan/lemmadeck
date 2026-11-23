import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188';
assert.equal(fs.realpathSync(process.cwd()), W);
const B = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g';
const L = 'geo68-c3-s2-n34';
const N = `${B}/evidence/stemrobin188-6g-n34`;
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
const execute = (name, command, argv) => {
  fs.mkdirSync(R, { recursive: true });
  const result = spawnSync(command, argv, {
    cwd: W, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  for (const stream of ['stdout', 'stderr'])
    fs.writeFileSync(`${R}/${name}.${stream}`, result[stream] || '', { flag: 'wx' });
  fs.writeFileSync(`${R}/${name}.json`, `${JSON.stringify({ cwd: W, command, argv, exitCode: result.status }, null, 2)}\n`, { flag: 'wx' });
  console.log(result.stdout);
  console.error(result.stderr);
  assert.equal(result.status, 0, `${name} failed`);
};

if (process.argv[2] === 'install') {
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
  for (const id of ['tbl-p0160-01', 'fig-213'])
    copy(`${preparation}/artifacts/6-8g/figures/${id}.png`, `${B}/figures/${id}.png`);
  execute('faithful-pages-first7', P, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import blocks
root=Path(sys.argv[2])
for number in [149,159,160,161]:
    directory=root/"pages"/f"{number:04d}"
    data=json.loads((directory/"page.json").read_text())
    serialized=[{key:value for key,value in item.items() if key!="id"} for item in data["blocks"]]
    if (directory/"page.md").exists():
        meta,items=blocks.parse((directory/"page.md").read_text())
        assert items==serialized,number
    else:
        md=blocks.dump(data["meta"],data["blocks"],number)
        meta,items=blocks.parse(md)
        assert meta==data["meta"] and items==serialized,number
        (directory/"page.md").write_text(md)
print(json.dumps({"faithfulBlocksUnchanged":True,"pages":4,"sourceFinalizerReplays":0}))
`, path.resolve('.claude/skills/ld-s10y-lesson/tools'), path.resolve(B)]);
  execute('raw-reindex-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'reindex', '--book', '6-8g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json']);
} else if (process.argv[2] === 'modern') {
  execute(`modern-finalize-${process.argv[3] || 'first7'}`, P, ['-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'answer-prepare') {
  execute('answer-prepare-first7', 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'prepare', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'answers') {
  execute('answer-finalize-first7', 'python3', ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
    'finalize', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'render') {
  execute('render-first7', P, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    'render', '--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', L]);
} else if (process.argv[2] === 'retain-answer-author') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n34-answers-author7';
  const target = `${N}/answers-author7`;
  assert.ok(!fs.existsSync(target));
  fs.cpSync(source, target, { recursive: true, errorOnExist: true });
  console.log(JSON.stringify({ retained: target, source: 'derived', ungraded: 4,
    semanticReviewPending: true, imagesLoaded: 0 }));
} else if (process.argv[2] === 'clarification-reference-check') {
  execute('clarification-reference-before7', P, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import edition
approval=json.loads(Path(sys.argv[2]).read_text())
field=approval["approved_fields"][0]
source=json.loads(Path(field["candidate_path"]).read_text())["prose"][7]["source_text"]
errors=edition.validate_text(source,field["replacement_value"],["layout","mathematical-definition-clarification"],[],"lesson.prose[7]",[])
assert len(errors)==1 and "got=['449']" in errors[0],errors
print(json.dumps({"originalC1NativeTextErrors":errors,"formulasChanged":False,"sourceChanges":0,"finalizerCalls":0},ensure_ascii=False))
`, path.resolve('.claude/skills/ld-s10y-lesson/tools'),
    '.intentfold/tickets/STEMROBIN-188/tmp/n34-content-independent7/approval.json']);
} else if (process.argv[2] === 'bind-content') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n34-content-independent7';
  const approval = read(`${source}/approval.json`);
  const recovery = read(`${source}/clarification-reference-recovery.json`);
  assert.equal(recovery.decision, 'APPROVED_EXACT_ADJUSTED_REFERENCE_STRING');
  const field = approval.approved_fields[0];
  assert.equal(hash(field.candidate_path), field.bound_candidate_sha256);
  assert.equal(hash(`${source}/approval.json`), recovery.input_original_approval.sha256);
  const reviewTarget = `${N}/content-independent7`;
  assert.ok(!fs.existsSync(reviewTarget));
  fs.cpSync(source, reviewTarget, { recursive: true, errorOnExist: true });
  for (const name of ['lesson', 'exercises', 'figures'])
    copy(`${N}/text-author7/${name}.template.json`, `${T}/${name}.template.json`);
  const lesson = read(`${T}/lesson.template.json`);
  assert.equal(lesson.prose[7].text, field.original_value);
  assert.deepEqual(lesson.prose[7].source_refs, field.source_refs_exact);
  lesson.prose[7].text = recovery.field.approved_adjusted_replacement_value;
  lesson.prose[7].changes.push('mathematical-definition-clarification');
  fs.writeFileSync(`${T}/lesson.template.json`, `${JSON.stringify(lesson, null, 2)}\n`);
  copy(`${T}/lesson.template.json`, `${R}/lesson.approved-template7.json`);
  fs.chmodSync(`${R}/lesson.approved-template7.json`, 0o444);
  execute('clarification-reference-after7', P, ['-B', '-c', String.raw`
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import edition
item=json.loads(Path(sys.argv[2]).read_text())["prose"][7]
errors=edition.validate_text(item["source_text"],item["text"],item["changes"],item["numeric_changes"],"lesson.prose[7]",[])
assert not errors,errors
print(json.dumps({"approvedC1NativeTextErrors":errors,"sourceChanges":0,"formulasChanged":False,"finalizerCalls":0}))
`, path.resolve('.claude/skills/ld-s10y-lesson/tools'), `${T}/lesson.template.json`]);
  fs.writeFileSync(`${R}/content-binding.json`, `${JSON.stringify({
    lesson: L, originalApproval: `${reviewTarget}/approval.json`,
    originalApprovalSha256: hash(`${reviewTarget}/approval.json`),
    referenceRecovery: `${reviewTarget}/clarification-reference-recovery.json`,
    referenceRecoverySha256: hash(`${reviewTarget}/clarification-reference-recovery.json`),
    approvedCandidate: `${R}/lesson.approved-template7.json`,
    approvedCandidateSha256: hash(`${R}/lesson.approved-template7.json`),
    appliedField: '/prose/7/text', sourceChanges: 0, formulasChanged: false,
    exercisesApproved: 4, writtenAnswersApproved: 4,
    figuresPending: true, finalized: false, published: false,
  }, null, 2)}\n`, { flag: 'wx' });
} else if (process.argv[2] === 'retain-figure-author') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n34-figures-author7';
  const target = `${N}/figures-author7`;
  assert.equal(hash(`${source}/manifest.json`), '3ee0d2d1fc44e2bedd98dae599c74b524f06c27480bb916ae19889a891aa5e90');
  assert.ok(!fs.existsSync(target));
  fs.cpSync(source, target, { recursive: true, errorOnExist: true });
  console.log(JSON.stringify({ retained: target, figures: 2,
    independentReviewPending: true, imagesLoaded: 0 }));
} else if (process.argv[2] === 'promote-figures') {
  const source = '.intentfold/tickets/STEMROBIN-188/tmp/n34-figures-independent7';
  assert.equal(read(`${source}/review.json`).status, 'pass');
  const reviewTarget = `${N}/figures-independent7`;
  assert.ok(!fs.existsSync(reviewTarget));
  fs.cpSync(source, reviewTarget, { recursive: true, errorOnExist: true });
  const figures = read(`${T}/figures.template.json`);
  for (const id of ['tbl-p0160-01', 'fig-213']) {
    for (const suffix of ['spec.json', 'render.json', 'svg'])
      copy(`${N}/figures-author7/${id}.${suffix}`, `${E}/figures/${id}.${suffix}`);
    execute(`record-review-${id}-first7`, 'python3', [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${E}/figures/${id}.spec.json`,
      '--render', `${E}/figures/${id}.render.json`,
      '--output', `${E}/figures/${id}.review.json`, '--status', 'pass',
      '--notes', `Independent source-first mathematical/cultural/visual review ${reviewTarget}/review.json SHA256 ${hash(`${reviewTarget}/review.json`)}. Approved spec/render/SVG bytes unchanged. Historical source uncertainty and original failures remain retained.`,
    ]);
    Object.assign(figures.figures.find(item => item.id === id), {
      spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
      render: `figures/${id}.render.json`, review: `figures/${id}.review.json`,
    });
  }
  fs.writeFileSync(`${T}/figures.template.json`, `${JSON.stringify(figures, null, 2)}\n`);
} else if (process.argv[2] === 'bind-answers') {
  const candidatePath = `${N}/answers-author7/candidate-answer-keys.json`;
  assert.equal(hash(candidatePath), '0c68160e262a40d1ca141e6cd0f1d77696795677e1a9e31f1449e2af113305cb');
  const candidate = read(candidatePath);
  const template = read(`.tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/${L}/answer-keys.template.json`);
  assert.equal(template.lesson, L);
  assert.equal(template.answers.length, candidate.answers.length);
  for (const answer of template.answers) {
    const approved = candidate.answers.find(item => item.exercise === answer.exercise);
    assert.ok(approved);
    assert.equal(approved.grading, 'ungraded');
    assert.deepEqual(approved.parts, []);
    for (const field of ['grading', 'source', 'displayAnswer', 'parts', 'notes'])
      answer[field] = approved[field];
  }
  const target = `${E}/lessons/${L}/answer-keys.json`;
  assert.ok(!fs.existsSync(target));
  fs.writeFileSync(target, `${JSON.stringify(template, null, 2)}\n`, { flag: 'wx' });
  const finalLesson = read(`${E}/lessons/${L}/lesson.json`);
  const finalExercises = read(`${E}/lessons/${L}/exercises.json`);
  const projectProse = value => value.prose.map(item => ({
    kind: item.kind, id: item.id, label: item.label, source_refs: item.source_refs,
    text: item.text.replace(/\s/g, ''),
  }));
  const projectExercises = value => value.exercises.map(item => ({
    number: item.number, pages: item.pages, text: item.text.replace(/\s/g, ''),
  }));
  for (const id of ['tbl-p0160-01', 'fig-213']) {
    const spec = read(`${E}/figures/${id}.spec.json`);
    const [boundLesson, boundExercises] = spec.source.authoritativeText.map(item => JSON.parse(item.text));
    assert.deepEqual(projectProse(boundLesson), projectProse(finalLesson));
    assert.deepEqual(projectExercises(boundExercises), projectExercises(finalExercises));
  }
  fs.writeFileSync(`${R}/native-context-binding7.json`, `${JSON.stringify({
    figures: 2, approvedProseEntries: 15, approvedExercises: 4,
    approvedWordsAndMathUnchanged: true, metadataAndWhitespaceOnly: true,
    rendererReplays: 0, independentReviewsRepeated: 0, imagesLoaded: 0,
    answerCandidateSha256: hash(candidatePath), answerKeysInstalled: 4,
    answerFinalizationPending: true,
  }, null, 2)}\n`, { flag: 'wx' });
} else {
  throw new Error('Select install, modern, answer-prepare, answers, render, retain-answer-author, clarification-reference-check, bind-content, retain-figure-author, promote-figures or bind-answers');
}
