import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const configs = {
  n44: { id: 'phy9-c1-s5-n44', figure: 'fig-68', stage: 'd256',
    author: `${T}/tmp/d1816-d256-n44-author`,
    review: `${T}/tmp/d1816-d262-n44-affected-visual`,
    englishReview: `${T}/tmp/d1816-d258-n44-review/english-review.json` },
  n51: { id: 'phy9-c1-s6-n51', figure: 'fig-88', stage: 'd257',
    author: `${T}/tmp/d1816-d257-n51-text-author`,
    review: `${T}/tmp/d1816-d260-n51-review` },
};
const name = process.argv[2];
const config = configs[name];
assert(config, 'Expected n44 or n51');
const { id, figure, stage, author, review } = config;
const root = `.tmp/STEMROBIN-181/d1816-${stage}/root`;
const work = `.tmp/STEMROBIN-181/d1816-${stage}/work`;
const display = '.tmp/STEMROBIN-181/d1816-d259/display';
const O = `${T}/tmp/d1816-d259-${name}-native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    assert.deepEqual(read(file), value, file);
    return;
  }
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
assert(!fs.existsSync(`${O}/result.json`));
const bindings = read(`${author}/bilingual-figure-bindings.json`);
for (const row of [bindings.spec, bindings.render, bindings.svg]) verify(row);
if (bind(bindings.templates.en.path).sha256 === bindings.templates.en.sha256) {
  verify(bindings.templates.en);
} else {
  const identity = read(`${O}/identity-recovery.json`);
  assert.equal(identity.original.sha256, bindings.templates.en.sha256);
  verify(identity.current);
  assert.equal(identity.proseChanged, false);
  assert.equal(identity.sourceChanged, false);
}
if (bind(bindings.templates.zh.path).sha256 === bindings.templates.zh.sha256) {
  verify(bindings.templates.zh);
} else {
  const layout = read(`${O}/layout-recovery.json`);
  assert.equal(layout.original.sha256, bindings.templates.zh.sha256);
  verify(layout.current);
  assert.equal(layout.semanticContentChanged, false);
}
const figureReviewFile = `${review}/${figure}.review.json`;
const figureReview = read(figureReviewFile);
assert.equal(figureReview.status, 'pass');
assert.equal(figureReview.spec.sha256, bindings.spec.sha256);
assert.equal(figureReview.outputs.svg.sha256, bindings.svg.sha256);
const englishReviewFile = config.englishReview || `${review}/english-review.json`;
const englishReview = read(englishReviewFile);
assert.equal(englishReview.status, 'pass');
assert.equal(englishReview.bindings.english.sha256, bindings.templates.en.sha256);
assert.equal(englishReview.bindings.approvedChinese.sha256, bindings.templates.zh.sha256);
const originalSpec = read(bindings.spec.path);
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${root}/9p/editions/${edition}/figures`;
  const durableDir = `${R}/editions/${edition}/figures`;
  const spec = structuredClone(originalSpec);
  spec.source.image.path = `${R}/figures/${figure}.png`;
  verify(spec.source.image);
  assert.deepEqual(spec.objects, originalSpec.objects);
  assert.deepEqual(spec.assertions, originalSpec.assertions);
  assert.deepEqual(spec.source.authoritativeText, originalSpec.source.authoritativeText);
  assert(!JSON.stringify(spec).includes('.tmp/'));
  const specFile = `${dir}/${figure}.spec.json`;
  const svgFile = `${dir}/${figure}.svg`;
  const renderFile = `${dir}/${figure}.render.json`;
  const reviewFile = `${dir}/${figure}.review.json`;
  save(specFile, spec);
  if (!fs.existsSync(svgFile))
    fs.copyFileSync(bindings.svg.path, svgFile, fs.constants.COPYFILE_EXCL);
  verify({ path: svgFile, sha256: bindings.svg.sha256 });
  const render = read(bindings.render.path);
  assert.equal(render.status, 'pass');
  render.spec = { path: `${durableDir}/${figure}.spec.json`, sha256: bind(specFile).sha256 };
  render.output.svg = { path: `${durableDir}/${figure}.svg`, sha256: bind(svgFile).sha256 };
  save(renderFile, render);
  const localRender = structuredClone(render);
  localRender.spec.path = specFile;
  localRender.output.svg.path = svgFile;
  const localRenderFile = `${O}/${locale}.local.render.json`;
  const localReviewFile = `${O}/${locale}.local.review.json`;
  save(localRenderFile, localRender);
  if (!fs.existsSync(localReviewFile)) execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d259-${name}-${locale}-review-relocation`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
    '--status', 'pass', '--notes',
    `Independent review retained at ${T}/evidence/reports/d1816-d259-delivery/` +
    `reviews/${name}/${figure}.review.json SHA256 ${bind(figureReviewFile).sha256}. ` +
    'Only source/output metadata paths relocated. Complete bilingual text, objects, ' +
    'assertions and SVG unchanged; no rendering or substantive review repeated. ' +
    'Independent source/semantic and visible-output approval is reused at the bound hashes.',
  ], { cwd: repo, stdio: 'inherit' });
  const relocatedReview = read(localReviewFile);
  relocatedReview.spec.path = render.spec.path;
  relocatedReview.render = { path: `${durableDir}/${figure}.render.json`,
    sha256: bind(renderFile).sha256 };
  relocatedReview.outputs = render.output;
  save(reviewFile, relocatedReview);
  const manifestFile = `${work}/adapt/9p/${edition}/lessons/${id}/figures.template.json`;
  const manifest = read(manifestFile);
  assert.deepEqual(manifest.figures.map(row => row.id), [figure]);
  const entry = manifest.figures[0];
  for (const key of ['png', 'artwork', 'generation']) delete entry[key];
  entry.svg = `figures/${figure}.svg`;
  for (const key of ['spec', 'render', 'review']) entry[key] = `figures/${figure}.${key}.json`;
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  for (const command of ['adapt-finalize', 'render']) {
    const completed = command === 'adapt-finalize'
      ? `${root}/9p/editions/${edition}/lessons/${id}/adaptation.audit.json`
      : `${display}/render/9p/${edition}/${id}/text.html`;
    if (fs.existsSync(completed)) {
      if (command !== 'adapt-finalize' || read(completed).status === 'pass') continue;
    }
    const firstCall = `d259-${name}-${locale}-${command}`;
    const priorReceipt = `${T}/tmp/d1816-recovery/native/${firstCall}/receipt.json`;
    let call = firstCall;
    if (fs.existsSync(priorReceipt)) {
      assert.notEqual(read(priorReceipt).exitCode, 0, 'Do not replay a passed native stage');
      call += locale === 'en' ? '-identity-recovery' : '-layout-recovery';
    }
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`, call,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', command,
      '--book', '9p', '--edition', edition, '--lesson', id,
      '--root', root, '--work', command === 'render' ? display : work,
    ], { cwd: repo, stdio: 'inherit' });
  }
  records.push({ locale, edition, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(reviewFile),
    lesson: bind(`${root}/9p/editions/${edition}/lessons/${id}/lesson.json`) });
}
save(`${O}/result.json`, {
  name, id, figure, root, work, display, records,
  englishReview: bind(englishReviewFile), figureReview: bind(figureReviewFile),
  status: 'native-pass-display-pending', originalTasks: 0, parentImageOpens: 0,
  actualRerenders: 0, databaseWrites: false, completeCoursesAdded: 0,
});
console.log(JSON.stringify({ native: bind(`${O}/result.json`), status: 'pass' }));
