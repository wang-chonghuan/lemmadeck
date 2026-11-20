import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const selectionFile = process.argv[2];
assert(selectionFile, 'A collected independent figure selection is required');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = '.tmp/STEMROBIN-181/d1816-d276/root';
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const out = `${ticket}/tmp/d1816-d288-figure-install`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const selection = read(selectionFile);
assert.equal(selection.independentVerdict, 'pass');
assert.equal(selection.reviewerClosed, true);
for (const key of ['spec', 'svg', 'render', 'reviewReport']) verify(selection[key]);
const originalSpec = read(selection.spec.path);
const originalRender = read(selection.render.path);
const id = originalSpec.id;
assert(/^fig-2[4-9]$/.test(id));
assert.equal(originalSpec.mode, 'deterministic');
assert.equal(originalRender.status, 'pass');
assert.equal(originalRender.spec.sha256, selection.spec.sha256);
assert.equal(originalRender.output.svg.sha256, selection.svg.sha256);
const spec = structuredClone(originalSpec);
spec.source.image.path = `${canonical}/figures/${id}.png`;
verify(spec.source.image);
assert.deepEqual(spec.objects, originalSpec.objects);
assert.deepEqual(spec.assertions, originalSpec.assertions);
assert.deepEqual(spec.source.authoritativeText, originalSpec.source.authoritativeText);
assert(!JSON.stringify(spec).includes('.tmp/'));
assert(!JSON.stringify(spec).includes('.intentfold/tickets/'));
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${root}/10p/editions/${edition}/figures`;
  const specFile = `${dir}/${id}.spec.json`;
  const svgFile = `${dir}/${id}.svg`;
  const renderFile = `${dir}/${id}.render.json`;
  const reviewFile = `${dir}/${id}.review.json`;
  save(specFile, spec);
  fs.copyFileSync(selection.svg.path, svgFile, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(svgFile).sha256, selection.svg.sha256);
  const render = structuredClone(originalRender);
  render.spec = { path: `${canonical}/editions/${edition}/figures/${id}.spec.json`,
    sha256: bind(specFile).sha256 };
  render.output = { svg: { path: `${canonical}/editions/${edition}/figures/${id}.svg`,
    sha256: bind(svgFile).sha256 } };
  save(renderFile, render);
  const localRender = structuredClone(render);
  localRender.spec.path = specFile;
  localRender.output.svg.path = svgFile;
  const localRenderFile = `${out}/${locale}-${id}.local.render.json`;
  const localReviewFile = `${out}/${locale}-${id}.local.review.json`;
  save(localRenderFile, localRender);
  execFileSync(process.execPath, [
    `${ticket}/tmp/d1816-recovery/run-native.mjs`,
    `d288-${locale}-${id}-metadata-only-review-record`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
    '--status', 'pass', '--notes',
    `Independent review ${selection.reviewReport.sha256} passed source fidelity, ` +
    'mathematics and actual-width visual/cultural gates. Only source/metadata paths ' +
    'relocated; objects, assertions, complete authoritative text and SVG unchanged. ' +
    'Browser previews resolve CSS variables; no geometry rendering replay.',
  ], { cwd: repo, stdio: 'inherit' });
  const review = read(localReviewFile);
  review.spec.path = render.spec.path;
  review.render = { path: `${canonical}/editions/${edition}/figures/${id}.render.json`,
    sha256: bind(renderFile).sha256 };
  review.outputs = render.output;
  save(reviewFile, review);
  const manifests = [];
  for (const lesson of ['phy10-c1-s3-n17', 'phy10-c1-s3-n18']) {
    const file = `${work}/adapt/10p/${edition}/lessons/${lesson}/figures.template.json`;
    const manifest = read(file);
    const entry = manifest.figures.find(figure => figure.id === id);
    if (!entry) continue;
    const before = bind(file);
    for (const key of ['png', 'artwork', 'generation']) delete entry[key];
    entry.svg = `figures/${id}.svg`;
    for (const key of ['spec', 'render', 'review']) entry[key] = `figures/${id}.${key}.json`;
    fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
    manifests.push({ before, after: bind(file) });
  }
  assert.equal(manifests.length, 1);
  for (const file of [specFile, svgFile, renderFile, reviewFile]) {
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    assert(!fs.readFileSync(file, 'utf8').includes('.intentfold/tickets/'), file);
  }
  records.push({ locale, edition, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile), manifests });
}
save(`${out}/${id}.installed.json`, {
  batch: 'D288', figure: id, selection: bind(selectionFile), records,
  root, work, independentFigureApproved: true, geometryRerenders: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, databaseWrites: false, paidCalls: 0,
});
console.log(JSON.stringify({ installed: bind(`${out}/${id}.installed.json`) }));
