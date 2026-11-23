import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184';
assert.equal(process.cwd(), root);
const base = '.tmp/stemrobin-184-six/n82-resume';
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10c';
const edition = `${book}/editions/modern-us-neutral`;
const lesson = `${edition}/lessons/ana10-c6-s2-n82`;
const template = '.tmp/stemrobin-184-six/n81-n82-work/adapt/10c/modern-us-neutral/lessons/ana10-c6-s2-n82/figures.template.json';
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const write = (file, value, flag = 'wx') => writeFileSync(file,
  JSON.stringify(value, null, 2) + '\n', { flag });

if (process.argv[2] === 'figure') {
  const approval = process.argv[3];
  assert(approval && existsSync(approval), 'Actual independent figure approval is required');
  const report = read(`${base}/fig-21.render.json`);
  assert.equal(report.status, 'pass');
  assert.equal(report.spec.sha256, hash(`${base}/fig-21.spec.json`));
  assert.equal(report.output.svg.sha256, hash(`${base}/fig-21.svg`));
  for (const name of ['fig-21.spec.json', 'fig-21.svg']) {
    const target = `${edition}/figures/${name}`;
    assert(!existsSync(target), `Existing figure must not be overwritten: ${target}`);
    copyFileSync(`${base}/${name}`, target);
  }
  report.spec.path = `${edition}/figures/fig-21.spec.json`;
  report.output.svg.path = `${edition}/figures/fig-21.svg`;
  write(`${edition}/figures/fig-21.render.json`, report);
  copyFileSync(template, `${base}/figures.template.before.json`);
  const figures = read(template);
  assert.equal(figures.figures.length, 1);
  Object.assign(figures.figures[0], {
    mode: 'deterministic',
    spec: 'figures/fig-21.spec.json',
    svg: 'figures/fig-21.svg',
    render: 'figures/fig-21.render.json',
    review: 'figures/fig-21.review.json',
  });
  delete figures.figures[0].png;
  delete figures.figures[0].artwork;
  delete figures.figures[0].generation;
  write(template, figures, 'w');
  console.log(JSON.stringify({ figure: 'fig-21', independentApproval: approval,
    svgSha256: report.output.svg.sha256, template }));
} else if (process.argv[2] === 'answers') {
  const prepared = process.argv[3];
  const packageData = read(prepared);
  const authored = read(`${base}/answer-author.json`).answers;
  assert.equal(packageData.answers.length, 2);
  for (const entry of packageData.answers) {
    const answer = authored.find(item => item.exercise === entry.exercise);
    assert(answer, `Missing authored answer ${entry.exercise}`);
    Object.assign(entry, answer);
  }
  write(`${lesson}/answer-keys.json`, packageData);
  console.log(JSON.stringify({ answers: packageData.answers.length,
    file: `${lesson}/answer-keys.json`, grading: 'ungraded; no new keyboard interactions' }));
} else if (process.argv[2] === 'choices') {
  const seed = `${base}/seed.json`;
  const digest = spawnSync('python3',
    ['.agents/skills/ld-s10y-choice/scripts/prepare.py', 'digest', seed],
    { cwd: root, encoding: 'utf8' });
  assert.equal(digest.status, 0, digest.stderr);
  const authored = read(`${base}/question-author.json`);
  const draft = { schema: 's10y-choice-draft-v1', seed_sha256: digest.stdout.trim(),
    new_figures: [], ...authored };
  write(`${base}/draft.json`, draft);
  console.log(JSON.stringify({ draft: `${base}/draft.json`,
    questions: draft.questions.length, options: draft.questions.reduce((n, q) => n + q.view.options.length, 0) }));
} else {
  throw new Error('Use figure <actual-independent-approval>, answers <prepared-template>, or choices');
}
