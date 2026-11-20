import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const B = '.tmp/STEMROBIN-181/d1816-d088';
const I = 'phy9-c2-s6-n126';
const F = `${T}/tmp/d1816-d083-n126-affected-author/author-freeze.json`;
const D = `${T}/tmp/d1816-d085-n126-affected-review`;
const O = `${T}/tmp/d1816-d088-n126-promotion`;
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const verify = r => assert.equal(bind(r.path).sha256, r.sha256, r.path);
const save = (p, data, exclusive = true) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(`${O}/figure-bindings.json`));
assert.equal(bind(`${D}/report.json`).sha256, 'df7aa22b683ee44e76e6f52e0e666d935d3166d60083f508a1b7479cc0a238af');
assert.equal(bind(`${D}/review-freeze.json`).sha256, 'aeafdc4717cb28ed3cb05bb482efa9dbc368ec40930d05a3a01d7cfcebee23d1');
const review = read(`${D}/report.json`);
assert.equal(review.status, 'PASS');
assert.equal(review.approval.currentAffectedR1R2R3R4Approved, true);
for (const key of ['R1', 'R2', 'R3', 'R4', 'affectedFigureZH', 'affectedFigureEN',
  'affectedFigureScientificSemantics', 'affectedENLocationModifier']) assert.equal(review.verdicts[key], 'PASS');
const author = read(F);
for (const row of read(`${D}/review-freeze.json`).files || []) verify(row);
const base = read(`${T}/tmp/d1816-d078-n126-first-review/report.json`);
assert.equal(base.verdicts.SCI.proseAndMathVerdict, 'PASS');
assert.equal(base.verdicts.ZH.verdict, 'PASS');
const records = [];
for (const figure of author.figures) {
  const edition = figure.edition, directory = `${R}/editions/${edition}/figures`;
  for (const row of [figure.spec, figure.svg, figure.nativeRenderReport]) verify(row);
  const specFile = `${directory}/fig-286.spec.json`, svgFile = `${directory}/fig-286.svg`;
  const renderFile = `${directory}/fig-286.render.json`, reviewFile = `${directory}/fig-286.review.json`;
  const spec = read(figure.spec.path);
  const sourceBefore = structuredClone(spec.source.image);
  assert.equal(bind(`${R}/figures/fig-286.png`).sha256, sourceBefore.sha256);
  spec.source.image.path = `${R}/figures/fig-286.png`;
  save(specFile, spec);
  fs.copyFileSync(figure.svg.path, svgFile, fs.constants.COPYFILE_EXCL);
  const render = read(figure.nativeRenderReport.path);
  assert.equal(render.status, 'pass');
  render.spec = bind(specFile);
  render.output.svg = bind(svgFile);
  save(renderFile, render);
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, `d088-${figure.locale}-fig286-record-review`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', renderFile, '--output', reviewFile, '--status', 'pass',
    '--notes', `Independent affected D085 report SHA256 ${bind(`${D}/report.json`).sha256}; original D078 prose/math/ZH/unaffectedEN PASS reused. R1-R4 resolved without assigning physical identity to uncertain small strokes. Only source/spec/output paths relocated; geometry, labels and SVG unchanged.`],
  { cwd: repo, stdio: 'inherit' });
  for (const p of [specFile, svgFile, renderFile, reviewFile]) assert(!fs.readFileSync(p, 'utf8').includes('.tmp/'), p);
  const carrierFigures = `${B}/root/9p/editions/${edition}/figures`;
  fs.mkdirSync(path.dirname(carrierFigures), { recursive: true });
  fs.symlinkSync(path.resolve(directory), carrierFigures, 'dir');
  const templateFile = `${B}/work/adapt/9p/${edition}/lessons/${I}/figures.template.json`;
  const template = read(templateFile);
  assert.deepEqual(template.figures.map(r => r.id), ['fig-286']);
  const row = template.figures[0];
  for (const ext of ['spec', 'render', 'review']) row[ext] = `figures/fig-286.${ext}.json`;
  row.svg = 'figures/fig-286.svg';
  save(templateFile, template, false);
  records.push({ edition, sourceBefore, sourceAfter: spec.source.image,
    candidateSpec: figure.spec, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), manifest: bind(templateFile),
    nativeGeometryRerendered: false, metadataOnlyRelocation: true });
}
save(`${O}/figure-bindings.json`, {
  schema: 'STEMROBIN-181/approved-figure-promotion@1', batch: 'D088', lesson: I,
  status: 'approved-figures-installed-first-native-finalization-pending',
  author: bind(F), baseReview: bind(`${T}/tmp/d1816-d078-n126-first-review/report.json`),
  affectedReview: bind(`${D}/report.json`), affectedReviewFreeze: bind(`${D}/review-freeze.json`),
  records, sourcePagesAdded: 0, completeCoursesAdded: 0, actualParentImageOpens: 0,
  databaseWrites: false, formalHandoff: false,
});
console.log(JSON.stringify({ installedFigures: 1, editions: 2, nativeFinalizationPending: true }));
