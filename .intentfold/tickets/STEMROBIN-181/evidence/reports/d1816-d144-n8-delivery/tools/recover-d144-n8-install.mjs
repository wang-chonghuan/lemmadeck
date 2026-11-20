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
const save = (file, value, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(`${O}/figure-install.json`));
assert(!fs.existsSync(`${C}/9p/editions/modern-us-neutral-en`));
const collected = read(`${V}/parent-collected.json`);
assert.equal(collected.reviewerClosed, true);
const selected = collected.selected;
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  if (to.startsWith(`${W}/`)) fs.chmodSync(to, 0o644);
};
const zhReceipt = `${T}/tmp/d1816-recovery/native/d144-n8-zh-fig05-metadata-only-review-record/receipt.json`;
assert.equal(read(zhReceipt).exitCode, 0);
const failedManifest = `${W}/adapt/9p/modern-us-neutral/lessons/${id}/figures.template.json`;
assert.equal(fs.statSync(failedManifest).mode & 0o222, 0);
save(`${O}/first-install-failure.json`, {
  batch: 'D144', exitCode: 1, category: 'TECHNICAL_COPY_PERMISSION',
  firstCommand: ['node', `${T}/tmp/d1816-recovery/install-d144-n8-figure.mjs`],
  failedScript: bind(`${T}/tmp/d1816-recovery/install-d144-n8-figure.mjs`),
  failedOperation: 'fs.writeFileSync on newly copied operative figures.template.json',
  error: { code: 'EACCES', syscall: 'open', path: failedManifest },
  inheritedCopyMode: fs.statSync(failedManifest).mode & 0o777,
  completedZhNativeRegistration: bind(zhReceipt),
  rawOuterStdoutStderrLocallyCaptured: false,
  outerCallFailureRetainedInToolConversation: true,
  sourceOrFigureContentFailure: false, authorRepairUsageReset: false,
  frozenSourcesWillNotBeChanged: true,
});
const records = [];
const updateManifest = (locale, edition) => {
  const file = `${W}/adapt/9p/${edition}/lessons/${id}/figures.template.json`;
  const manifest = read(file);
  assert.deepEqual(manifest.figures.map(row => row.id), ['fig-05']);
  const entry = manifest.figures[0];
  for (const key of ['png', 'artwork', 'generation']) delete entry[key];
  entry.svg = 'figures/fig-05.svg';
  for (const key of ['spec', 'render', 'review']) entry[key] = `figures/fig-05.${key}.json`;
  save(file, manifest, false);
  const dir = `${C}/9p/editions/${edition}/figures`;
  const files = ['spec.json', 'svg', 'render.json', 'review.json']
    .map(suffix => `${dir}/fig-05.${suffix}`);
  for (const output of files) assert(!fs.readFileSync(output, 'utf8').includes('.tmp/'), output);
  records.push({ locale, edition, spec: bind(files[0]), svg: bind(files[1]),
    render: bind(files[2]), review: bind(files[3]), manifest: bind(file) });
};
for (const name of ['lesson', 'exercises', 'figures']) {
  const original = `${W0}/adapt/9p/modern-us-neutral/lessons/${id}/${name}.template.json`;
  const working = `${W}/adapt/9p/modern-us-neutral/lessons/${id}/${name}.template.json`;
  assert.equal(bind(working).sha256, bind(original).sha256);
  fs.chmodSync(working, 0o644);
}
const zhDir = `${C}/9p/editions/modern-us-neutral/figures`;
assert.equal(read(`${zhDir}/fig-05.review.json`).status, 'pass');
assert.equal(bind(`${zhDir}/fig-05.svg`).sha256, selected.svg.sha256);
updateManifest('zh', 'modern-us-neutral');
const edition = 'modern-us-neutral-en';
for (const name of ['lesson', 'exercises', 'figures']) {
  const relative = `adapt/9p/${edition}/lessons/${id}/${name}.template.json`;
  copy(`${W0}/${relative}`, `${W}/${relative}`);
}
const spec = read(selected.spec.path);
const originalSpec = structuredClone(spec);
spec.source.image.path = `${R}/figures/fig-05.png`;
assert.equal(bind(spec.source.image.path).sha256, spec.source.image.sha256);
assert.deepEqual(spec.objects, originalSpec.objects);
assert.deepEqual(spec.assertions, originalSpec.assertions);
assert.deepEqual(spec.source.authoritativeText, originalSpec.source.authoritativeText);
assert(!JSON.stringify(spec).includes('.tmp/'));
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
const localRenderFile = `${O}/en-fig05.local.render.json`;
const localReviewFile = `${O}/en-fig05.local.review.json`;
save(localRenderFile, localRender);
execFileSync(process.execPath, [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd144-n8-en-fig05-metadata-only-review-record',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.agents/skills/ld-s10y-image/scripts/record_review.py',
  '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
  '--status', 'pass', '--notes',
  `Independent D143 review SHA256 ${bind(`${V}/fig-05.review.json`).sha256}. Actual source, objects/assertions/text/SVG unchanged; only source and metadata paths relocated. ${collected.nativeReviewNotes}`,
], { cwd: repo, stdio: 'inherit' });
const finalReview = read(localReviewFile);
finalReview.spec.path = render.spec.path;
finalReview.render = { path: `${R}/editions/${edition}/figures/fig-05.render.json`,
  sha256: bind(renderFile).sha256 };
finalReview.outputs = render.output;
save(reviewFile, finalReview);
updateManifest('en', edition);
const copied = [];
for (const name of ['book.json', ...['lesson.json', 'lesson.md', 'exercises.json'].map(file =>
  `lessons/${id}/${file}`)]) {
  const original = bind(`${C0}/9p/${name}`);
  const working = bind(`${C}/9p/${name}`);
  assert.equal(original.sha256, working.sha256);
  copied.push({ original, copy: working });
}
for (const localeEdition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  for (const name of ['lesson', 'exercises']) {
    const relative = `adapt/9p/${localeEdition}/lessons/${id}/${name}.template.json`;
    const original = bind(`${W0}/${relative}`);
    const working = bind(`${W}/${relative}`);
    assert.equal(original.sha256, working.sha256);
    copied.push({ original, copy: working });
  }
}
save(`${O}/figure-install.json`, {
  batch: 'D144', status: 'INDEPENDENT_FIGURE_PASS_INSTALLED_SCRATCH_NATIVE_FINALIZATION_PENDING',
  lesson: id, records, copied, selected, independentReview: bind(`${V}/parent-collected.json`),
  operativeRoot: C, operativeWork: W, displayWork: '.tmp/STEMROBIN-181/d1816-d144/display',
  recovery: bind(`${O}/first-install-failure.json`),
  successfulZhNativeRecordReplayed: false, sourceAndFrozenTemplatesUnchanged: true,
  originalTasks: 0, answers: 0, choices: 0, parentImageOpens: 0,
  sourceReviewsReplayed: false, nativeRendersReplayed: 0, canonicalPromotions: 0,
  completeCoursesAdded: 0, productAcceptance: false, paidCalls: 0,
});
console.log(JSON.stringify({ install: bind(`${O}/figure-install.json`),
  metadataPermissionRecovery: true, replayedSuccessfulStages: 0, nativeFinalizationPending: true }));
