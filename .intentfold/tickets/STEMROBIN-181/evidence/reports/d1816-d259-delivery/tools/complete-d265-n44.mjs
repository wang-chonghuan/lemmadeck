import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d259-n44-native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const V = `${T}/tmp/d1816-d264-n44-pronoun-review`;
const root = '.tmp/STEMROBIN-181/d1816-d256/root';
const work = '.tmp/STEMROBIN-181/d1816-d256/work';
const display = '.tmp/STEMROBIN-181/d1816-d259/display';
const id = 'phy9-c1-s5-n44';
const figure = 'fig-68';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
assert(!fs.existsSync(`${O}/result.json`));
const selected = read(`${T}/tmp/d1816-d263-n44-pronoun-author/bindings.json`);
for (const row of [selected.spec, selected.render, selected.svg,
  selected.templates.zh, selected.templates.en]) verify(row);
const englishReview = read(`${V}/english-review.json`);
const figureReview = read(`${V}/fig-68.review.json`);
assert.equal(englishReview.status, 'pass');
assert.equal(englishReview.bindings.english.sha256, selected.templates.en.sha256);
assert.equal(englishReview.bindings.approvedChinese.sha256, selected.templates.zh.sha256);
assert.equal(figureReview.status, 'pass');
assert.equal(figureReview.spec.sha256, selected.spec.sha256);
assert.equal(figureReview.outputs.svg.sha256, selected.svg.sha256);
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const directory = `${root}/9p/editions/${edition}/figures`;
  const durable = `${R}/editions/${edition}/figures`;
  const specFile = `${directory}/fig-68.spec.json`;
  const renderFile = `${directory}/fig-68.render.json`;
  const reviewFile = `${directory}/fig-68.review.json`;
  const svgFile = `${directory}/fig-68.svg`;
  for (const [kind, file] of [['spec', specFile], ['render', renderFile], ['review', reviewFile]]) {
    fs.copyFileSync(file, `${O}/${locale}-before-pronoun.${kind}.json`, fs.constants.COPYFILE_EXCL);
  }
  verify({ path: svgFile, sha256: selected.svg.sha256 });
  const spec = read(selected.spec.path);
  spec.source.image.path = `${R}/figures/fig-68.png`;
  verify(spec.source.image);
  fs.writeFileSync(specFile, JSON.stringify(spec, null, 2) + '\n');
  const render = read(selected.render.path);
  render.spec = { path: `${durable}/fig-68.spec.json`, sha256: bind(specFile).sha256 };
  render.output.svg = { path: `${durable}/fig-68.svg`, sha256: bind(svgFile).sha256 };
  fs.writeFileSync(renderFile, JSON.stringify(render, null, 2) + '\n');
  const local = structuredClone(render);
  local.spec.path = specFile;
  local.output.svg.path = svgFile;
  const localRenderFile = `${O}/${locale}.pronoun.local.render.json`;
  const localReviewFile = `${O}/${locale}.pronoun.local.review.json`;
  save(localRenderFile, local);
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d265-n44-${locale}-context-review-relocation`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
    '--status', 'pass', '--notes',
    `Independent affected English/context review retained at ${T}/evidence/reports/` +
    `d1816-d259-delivery/reviews/n44/fig-68.review.json SHA256 ${bind(`${V}/fig-68.review.json`).sha256}. ` +
    'D258 English and D262 source/semantic/visual PASS reused; only one recipient pronoun ' +
    'and metadata paths changed. Geometry, SVG, Chinese text and all other English prose unchanged.',
  ], { cwd: repo, stdio: 'inherit' });
  const review = read(localReviewFile);
  review.spec.path = render.spec.path;
  review.render = { path: `${durable}/fig-68.render.json`, sha256: bind(renderFile).sha256 };
  review.outputs = render.output;
  fs.writeFileSync(reviewFile, JSON.stringify(review, null, 2) + '\n');
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d265-n44-${locale}-context-adapt-finalize`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '9p', '--edition', edition, '--lesson', id, '--root', root, '--work', work,
  ], { cwd: repo, stdio: 'inherit' });
  if (locale === 'en') execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, 'd265-n44-en-first-complete-render',
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '9p', '--edition', edition, '--lesson', id, '--root', root, '--work', display,
  ], { cwd: repo, stdio: 'inherit' });
  records.push({ locale, edition, spec: bind(specFile), render: bind(renderFile),
    review: bind(reviewFile), svg: bind(svgFile),
    lesson: bind(`${root}/9p/editions/${edition}/lessons/${id}/lesson.json`) });
}
save(`${O}/result.json`, {
  name: 'n44', id, figure, root, work, display, records,
  englishReview: bind(`${V}/english-review.json`), figureReview: bind(`${V}/fig-68.review.json`),
  status: 'native-pass-display-pending', originalTasks: 0,
  actualGeometryRerenders: 0, fullChineseRenderReplayed: false,
  parentImageOpens: 0, completeCoursesAdded: 0, databaseWrites: false,
});
console.log(JSON.stringify({ status: 'pass', native: bind(`${O}/result.json`) }));
