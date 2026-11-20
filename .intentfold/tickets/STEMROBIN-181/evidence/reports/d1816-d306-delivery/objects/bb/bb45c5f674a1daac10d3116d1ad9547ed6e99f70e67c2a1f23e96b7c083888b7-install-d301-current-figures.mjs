import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d301-current-figure-install`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const replaceOwned = (file, bytes) => {
  if (fs.existsSync(file)) {
    const backup = `${O}/before/${path.relative('.tmp/STEMROBIN-181', file)}`;
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);
};
const affectedFile = `${T}/tmp/d1816-d300-affected-context-review/report.json`;
const affected = read(affectedFile);
assert.equal(affected.verdict, 'PASS_AFFECTED_TEXT_AND_CONTEXT_ONLY');
const sourceReviews = new Map([
  ['fig-24', `${T}/tmp/d1816-d290-fig2425-review/report.json`],
  ['fig-25', `${T}/tmp/d1816-d290-fig2425-review/report.json`],
  ['fig-26', `${T}/tmp/d1816-d291-fig26-review/report.json`],
  ['fig-27', `${T}/tmp/d1816-d285-fig27-review/report.json`],
  ['fig-28', `${T}/tmp/d1816-d294-fig2829-review/report.json`],
  ['fig-29', `${T}/tmp/d1816-d294-fig2829-review/report.json`],
  ['tbl-p0053-01', `${T}/tmp/d1816-d296-n19-table-review/report.json`],
]);
const contextFile = `${T}/tmp/d1816-d299-current-figure-text/result.json`;
const context = read(contextFile);
for (const row of context.templates) verify(row.template);
const installs = [];
for (const candidate of context.records) {
  const { figure: id } = candidate;
  const completed = `${O}/${id}.installed.json`;
  if (fs.existsSync(completed)) {
    const record = read(completed);
    verify(record.affectedReview);
    for (const asset of record.records)
      for (const key of ['spec', 'svg', 'render', 'review']) verify(asset[key]);
    installs.push(bind(completed));
    continue;
  }
  for (const key of ['spec', 'svg', 'render']) verify(candidate[key]);
  const sourceReviewFile = sourceReviews.get(id);
  const sourceReview = read(sourceReviewFile);
  if (id === 'fig-26') {
    for (const key of ['sourceReview', 'mathReview', 'visualReview', 'culturalReview'])
      assert.equal(sourceReview[key].status, 'pass');
    assert.equal(sourceReview.blockingFindings.length, 1);
  } else assert.equal(sourceReview.status, 'pass');
  const spec = read(candidate.spec.path);
  const originalRender = read(candidate.render.path);
  assert.equal(originalRender.status, 'pass');
  assert.equal(originalRender.spec.sha256, candidate.spec.sha256);
  assert.equal(originalRender.output.svg.sha256, candidate.svg.sha256);
  assert(!JSON.stringify(spec).includes('.tmp/'));
  assert(!JSON.stringify(spec).includes('.intentfold/tickets/'));
  const records = [];
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const root = '.tmp/STEMROBIN-181/d1816-d276/root';
    const dir = `${root}/10p/editions/${edition}/figures`;
    const specFile = `${dir}/${id}.spec.json`;
    const svgFile = `${dir}/${id}.svg`;
    const renderFile = `${dir}/${id}.render.json`;
    const reviewFile = `${dir}/${id}.review.json`;
    replaceOwned(specFile, JSON.stringify(spec, null, 2) + '\n');
    replaceOwned(svgFile, fs.readFileSync(candidate.svg.path));
    const render = structuredClone(originalRender);
    render.spec = { path: `${canonical}/editions/${edition}/figures/${id}.spec.json`,
      sha256: bind(specFile).sha256 };
    render.output = { svg: { path: `${canonical}/editions/${edition}/figures/${id}.svg`,
      sha256: bind(svgFile).sha256 } };
    replaceOwned(renderFile, JSON.stringify(render, null, 2) + '\n');
    const localRender = structuredClone(render);
    localRender.spec.path = specFile;
    localRender.output.svg.path = svgFile;
    const localRenderFile = `${O}/${locale}-${id}.local.render.json`;
    const localReviewFile = `${O}/${locale}-${id}.local.review.json`;
    save(localRenderFile, localRender);
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`, `d301-${locale}-${id}-metadata-review-record`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
      '--status', 'pass', '--notes',
      `First independent source/math/visual/cultural report ${bind(sourceReviewFile).sha256}; ` +
      `affected-only complete current text/context review ${bind(affectedFile).sha256}. ` +
      'Objects, assertions, source inventory and SVG unchanged; context and durable metadata updated only. ' +
      'Original failures retained. No geometry rerender or repeated visual review.',
    ], { cwd: repo, stdio: 'inherit' });
    const review = read(localReviewFile);
    review.spec.path = render.spec.path;
    review.render = { path: `${canonical}/editions/${edition}/figures/${id}.render.json`,
      sha256: bind(renderFile).sha256 };
    review.outputs = render.output;
    replaceOwned(reviewFile, JSON.stringify(review, null, 2) + '\n');
    records.push({ root, locale, edition, spec: bind(specFile), svg: bind(svgFile),
      render: bind(renderFile), review: bind(reviewFile) });
    if (['fig-28', 'fig-29', 'tbl-p0053-01'].includes(id)) {
      const otherRoot = '.tmp/STEMROBIN-181/d1816-d287/source-root';
      const otherDir = `${otherRoot}/10p/editions/${edition}/figures`;
      const assets = {};
      for (const [key, file] of Object.entries({ spec: specFile, svg: svgFile,
        render: renderFile, review: reviewFile })) {
        const target = `${otherDir}/${path.basename(file)}`;
        replaceOwned(target, fs.readFileSync(file));
        assert.equal(bind(target).sha256, bind(file).sha256);
        assets[key] = bind(target);
      }
      records.push({ root: otherRoot, locale, edition, ...assets });
    }
    for (const number of [17, 18]) {
      const manifestFile = `.tmp/STEMROBIN-181/d1816-d276/source-work/adapt/10p/${edition}/lessons/phy10-c1-s3-n${number}/figures.template.json`;
      const manifest = read(manifestFile);
      const entry = manifest.figures.find(row => row.id === id);
      if (!entry) continue;
      for (const key of ['png', 'artwork', 'generation']) delete entry[key];
      entry.svg = `figures/${id}.svg`;
      for (const key of ['spec', 'render', 'review']) entry[key] = `figures/${id}.${key}.json`;
      fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    }
  }
  save(completed, { batch: 'D301', figure: id, records,
    sourceReview: bind(sourceReviewFile), affectedReview: bind(affectedFile),
    context: bind(contextFile), independentFigureApproved: true,
    geometryRerenders: 0, completeCoursesAdded: 0, databaseWrites: false, paidCalls: 0 });
  installs.push(bind(completed));
}
save(`${O}/result.json`, { batch: 'D301', status: 'pass', installs,
  sourceReviews: [...new Set(sourceReviews.values())].map(bind),
  affectedReview: bind(affectedFile), geometryRerenders: 0, completeCoursesAdded: 0,
  databaseWrites: false, paidCalls: 0 });
console.log(JSON.stringify({ installed: bind(`${O}/result.json`) }));
