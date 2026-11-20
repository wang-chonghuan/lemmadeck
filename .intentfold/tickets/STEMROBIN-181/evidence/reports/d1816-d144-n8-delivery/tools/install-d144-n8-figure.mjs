import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const V = `${T}/tmp/d1816-d143-n8-figure-review`;
const O = `${T}/tmp/d1816-d144-n8-native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const C0 = '.tmp/STEMROBIN-181/d1816-d140/root';
const W0 = '.tmp/STEMROBIN-181/d1816-d141/work';
const C = '.tmp/STEMROBIN-181/d1816-d144/root';
const W = '.tmp/STEMROBIN-181/d1816-d144/work';
const id = 'phy9-c1-s1-n8';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(O));
assert(!fs.existsSync(C));
assert(!fs.existsSync(W));
const collected = read(`${V}/parent-collected.json`);
assert.equal(collected.reviewerClosed, true);
assert.equal(collected.semanticVerdict, 'pass');
assert.equal(collected.offlineVisualVerdict, 'pass');
const selected = collected.selected;
for (const row of [selected.source, selected.spec, selected.svg, selected.render]) verify(row);
const review = read(`${V}/fig-05.review.json`);
assert.equal(review.status, 'pass');
assert.equal(review.spec.sha256, selected.spec.sha256);
assert.equal(review.outputs.svg.sha256, selected.svg.sha256);
const copied = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  copied.push({ original: bind(from), copy: bind(to) });
};
copy(`${C0}/9p/book.json`, `${C}/9p/book.json`);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  copy(`${C0}/9p/lessons/${id}/${name}`, `${C}/9p/lessons/${id}/${name}`);
}
for (const page of ['0024', '0025']) {
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    const to = `${C}/9p/pages/${page}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(`${C0}/9p/pages/${page}/${name}`), to);
  }
}
for (const suffix of ['png', 'svg']) {
  const to = `${C}/9p/figures/fig-05.${suffix}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.symlinkSync(path.resolve(`${C0}/9p/figures/fig-05.${suffix}`), to);
}
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const relative = `adapt/9p/${edition}/lessons/${id}/${name}.template.json`;
    copy(`${W0}/${relative}`, `${W}/${relative}`);
  }
  const originalSpec = read(selected.spec.path);
  const spec = structuredClone(originalSpec);
  spec.source.image.path = `${R}/figures/fig-05.png`;
  verify(spec.source.image);
  assert.deepEqual(spec.objects, originalSpec.objects);
  assert.deepEqual(spec.assertions, originalSpec.assertions);
  assert.deepEqual(spec.source.authoritativeText, originalSpec.source.authoritativeText);
  assert(!JSON.stringify(spec).includes('.tmp/'));
  assert(!JSON.stringify(spec).includes('.intentfold/tickets/'));
  const dir = `${C}/9p/editions/${edition}/figures`;
  const specFile = `${dir}/fig-05.spec.json`;
  const svgFile = `${dir}/fig-05.svg`;
  const renderFile = `${dir}/fig-05.render.json`;
  const reviewFile = `${dir}/fig-05.review.json`;
  save(specFile, spec);
  copy(selected.svg.path, svgFile);
  const render = read(selected.render.path);
  assert.equal(render.status, 'pass');
  render.spec = { path: `${R}/editions/${edition}/figures/fig-05.spec.json`, sha256: bind(specFile).sha256 };
  render.output.svg = { path: `${R}/editions/${edition}/figures/fig-05.svg`, sha256: bind(svgFile).sha256 };
  save(renderFile, render);
  const localRender = structuredClone(render);
  localRender.spec.path = specFile;
  localRender.output.svg.path = svgFile;
  const localRenderFile = `${O}/${locale}-fig05.local.render.json`;
  const localReviewFile = `${O}/${locale}-fig05.local.review.json`;
  save(localRenderFile, localRender);
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`,
    `d144-n8-${locale}-fig05-metadata-only-review-record`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
    '--status', 'pass', '--notes',
    `Independent D143 current fig05 review SHA256 ${bind(`${V}/fig-05.review.json`).sha256}. Source pixels, complete approved bilingual text and unchanged objects/assertions/SVG reviewed. Only source and metadata paths relocated; no geometry, actual text or SVG changes and no rendering replay. ${collected.nativeReviewNotes}`,
  ], { cwd: repo, stdio: 'inherit' });
  const relocatedReview = read(localReviewFile);
  relocatedReview.spec.path = render.spec.path;
  relocatedReview.render = { path: `${R}/editions/${edition}/figures/fig-05.render.json`,
    sha256: bind(renderFile).sha256 };
  relocatedReview.outputs = render.output;
  save(reviewFile, relocatedReview);
  const manifestFile = `${W}/adapt/9p/${edition}/lessons/${id}/figures.template.json`;
  const manifest = read(manifestFile);
  assert.deepEqual(manifest.figures.map(row => row.id), ['fig-05']);
  const entry = manifest.figures[0];
  for (const key of ['png', 'artwork', 'generation']) delete entry[key];
  entry.svg = 'figures/fig-05.svg';
  for (const key of ['spec', 'render', 'review']) entry[key] = `figures/fig-05.${key}.json`;
  save(manifestFile, manifest, false);
  for (const file of [specFile, svgFile, renderFile, reviewFile]) {
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
  }
  records.push({ locale, edition, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), manifest: bind(manifestFile) });
}
save(`${O}/figure-install.json`, {
  batch: 'D144', status: 'INDEPENDENT_FIGURE_PASS_INSTALLED_SCRATCH_NATIVE_FINALIZATION_PENDING',
  lesson: id, records, copied, selected, independentReview: bind(`${V}/parent-collected.json`),
  operativeRoot: C, operativeWork: W, displayWork: '.tmp/STEMROBIN-181/d1816-d144/display',
  originalTasks: 0, answers: 0, choices: 0, parentImageOpens: 0,
  sourceReviewsReplayed: false, nativeRendersReplayed: 0, canonicalPromotions: 0,
  completeCoursesAdded: 0, productAcceptance: false, paidCalls: 0,
});
console.log(JSON.stringify({ install: bind(`${O}/figure-install.json`),
  nativeFinalizationPending: true, completeCoursesAdded: 0, parentImageOpens: 0 }));
