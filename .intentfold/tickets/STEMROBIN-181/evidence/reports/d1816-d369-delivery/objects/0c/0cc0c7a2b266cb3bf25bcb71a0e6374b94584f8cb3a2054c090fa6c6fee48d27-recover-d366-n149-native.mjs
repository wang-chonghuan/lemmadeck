import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d366-n149-native-recovery`;
const root = '.tmp/STEMROBIN-181/d1816-d337/root';
const work = '.tmp/STEMROBIN-181/d1816-d337/source-work';
const display = '.tmp/STEMROBIN-181/d1816-d337/display';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const id = 'phy10-c3-s4-n149';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const replaceOwned = (file, value) => {
  if (fs.existsSync(file)) {
    const backup = `${O}/before/${path.relative(root, file)}`;
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) assert.equal(bind(from).sha256, bind(to).sha256, to);
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
};
assert(!fs.existsSync(`${O}/result.json`));
const figureReportFile = `${T}/tmp/d1816-d355-fig277-first-review/report.json`;
assert.equal(read(figureReportFile).status.toLowerCase(), 'pass');
const affectedReviewFile = `${T}/tmp/d1816-d367-n149-layout-context-review/report.json`;
assert.equal(read(affectedReviewFile).status.toLowerCase(), 'pass');
assert.equal(read(`${T}/tmp/d1816-d347-n149-affected-text-review/report.json`).status, 'PASS');
const originalFailureFile = `${T}/tmp/d1816-d337-n149-native/result.json`;
assert.equal(read(originalFailureFile).status, 'native-failure');
const prepared = read(`${T}/tmp/d1816-d337-n149-native/prepared.json`);
verify(prepared.source);
verify(prepared.exercises);
const layout = read(`${T}/tmp/d1816-d365-n149-native-layout-repair/author-freeze.json`);
for (const row of layout.changes) verify(row.working);
const context = read(`${T}/tmp/d1816-d352-current-figure-context/context.json`);
for (const key of ['spec', 'svg', 'render', 'source']) verify(context[key]);
verify(layout.currentSpec);
const originalSpec = read(layout.currentSpec.path);
const originalRender = read(context.render.path);
assert.equal(originalRender.status, 'pass');
assert.equal(originalRender.spec.sha256, context.spec.sha256);
assert.equal(originalRender.output.svg.sha256, context.svg.sha256);
copy(context.source.path, `${canonical}/figures/fig-277.png`);
copy(`${root}/10p/figures/fig-277.svg`, `${canonical}/figures/fig-277.svg`);
const spec = structuredClone(originalSpec);
spec.source.image.path = `${canonical}/figures/fig-277.png`;
verify(spec.source.image);
const withoutPath = value => {
  const result = structuredClone(value);
  delete result.source.image.path;
  return result;
};
assert.deepEqual(withoutPath(spec), withoutPath(originalSpec));
assert(!JSON.stringify(spec).includes('.tmp/'));
const installed = [];
const stages = [];
const native = (name, command, args) => {
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args],
    { cwd: repo, stdio: 'inherit' });
  stages.push({ name, status: 'pass',
    receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
};
let failure = null;
try {
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const dir = `${root}/10p/editions/${edition}/figures`;
    const specFile = `${dir}/fig-277.spec.json`;
    const svgFile = `${dir}/fig-277.svg`;
    const renderFile = `${dir}/fig-277.render.json`;
    const reviewFile = `${dir}/fig-277.review.json`;
    replaceOwned(specFile, spec);
    copy(context.svg.path, svgFile);
    const render = structuredClone(originalRender);
    render.spec = { path: `${canonical}/editions/${edition}/figures/fig-277.spec.json`,
      sha256: bind(specFile).sha256 };
    render.output = { svg: { path: `${canonical}/editions/${edition}/figures/fig-277.svg`,
      sha256: bind(svgFile).sha256 } };
    replaceOwned(renderFile, render);
    const localRender = structuredClone(render);
    localRender.spec.path = specFile;
    localRender.output.svg.path = svgFile;
    const localRenderFile = `${O}/${locale}.local.render.json`;
    const localReviewFile = `${O}/${locale}.local.review.json`;
    save(localRenderFile, localRender);
    native(`d366-${locale}-fig277-metadata-review-record`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      ['.agents/skills/ld-s10y-image/scripts/record_review.py',
        '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
        '--status', 'pass', '--notes',
        `First independent D355 figure report ${bind(figureReportFile).sha256}; ` +
        `affected D367 native-normalized layout/context report ${bind(affectedReviewFile).sha256}. ` +
        'Same wording, math, digits, source pixels, objects, assertions and SVG; normalized whitespace and same-position concept anchors. ' +
        'Source/metadata paths relocated with unchanged bytes. ' +
        'Two prior author repairs and renderer execution failures retained; zero geometry rerenders.'],
    );
    const review = read(localReviewFile);
    review.spec.path = render.spec.path;
    review.render = { path: `${canonical}/editions/${edition}/figures/fig-277.render.json`,
      sha256: bind(renderFile).sha256 };
    review.outputs = render.output;
    replaceOwned(reviewFile, review);
    const manifestFile = `${work}/adapt/10p/${edition}/lessons/${id}/figures.template.json`;
    const manifest = read(manifestFile);
    assert.deepEqual(manifest.figures.map(row => row.id), ['fig-277']);
    copy(manifestFile, `${O}/${locale}.before.figures.template.json`);
    const entry = manifest.figures[0];
    for (const key of ['png', 'artwork', 'generation']) delete entry[key];
    entry.svg = 'figures/fig-277.svg';
    for (const key of ['spec', 'render', 'review']) entry[key] = `figures/fig-277.${key}.json`;
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    installed.push({ locale, edition, spec: bind(specFile), svg: bind(svgFile),
      render: bind(renderFile), review: bind(reviewFile), manifest: bind(manifestFile) });
    const failedAudit = `${root}/10p/editions/${edition}/lessons/${id}/adaptation.audit.json`;
    if (fs.existsSync(failedAudit)) copy(failedAudit, `${O}/before/${locale}.adaptation.audit.json`);
    native(`d366-n149-${locale}-layout-recovery-adapt-finalize`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
        '--book', '10p', '--root', root, '--work', work, '--edition', edition, '--lesson', id]);
    native(`d366-n149-${locale}-first-offline-render`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
        '--book', '10p', '--root', root, '--work', display, '--edition', edition, '--lesson', id]);
  }
} catch (error) {
  failure = { message: error.message, exitCode: error.status ?? null };
}
const outputs = failure ? [] : installed.map(row => {
  const directory = `${root}/10p/editions/${row.edition}/lessons/${id}`;
  return { ...row, lesson: bind(`${directory}/lesson.json`),
    exercises: bind(`${directory}/exercises.json`),
    figures: bind(`${directory}/figures.json`),
    audit: bind(`${directory}/adaptation.audit.json`),
    html: bind(`${display}/render/10p/${row.edition}/${id}/text.html`) };
});
save(`${O}/result.json`, { stage: 'D366', id, book: '10p', root, work, display,
  status: failure ? 'native-failure' : 'native-pass-display-pending',
  failure, stages, outputs, figureReport: bind(figureReportFile),
  affectedReview: bind(affectedReviewFile), originalFailure: bind(originalFailureFile),
  sourceFiguresRetained: ['png', 'svg'].map(extension => bind(`${canonical}/figures/fig-277.${extension}`)),
  originalTasks: 0, geometryRerenders: 0, completeCoursesAdded: 0,
  sourcePagesAdded: 0, paidCalls: 0, imagesOpened: 0, databaseWrites: false });
console.log(JSON.stringify({ result: bind(`${O}/result.json`), failure }));
if (failure) process.exitCode = 1;
