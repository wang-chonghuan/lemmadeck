import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const C = '.tmp/STEMROBIN-181/d1816-d112/root/9p';
const W = '.tmp/STEMROBIN-181/d1816-d115/work';
const I = 'phy9-c1-s2-n19';
const D = `${T}/tmp/d1816-d119-n19-fig26-label-review`;
const O = `${T}/tmp/d1816-d120-n19-figure-install`;
const read = p => JSON.parse(fs.readFileSync(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p) });
const verify = r => assert.equal(hash(r.path), r.sha256, r.path);
const bindings = value => !value || typeof value !== 'object' ? [] : [
  ...(value.path && value.sha256 ? [value] : []),
  ...Object.values(value).flatMap(bindings),
];
const save = (p, data, exclusive = true) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(`${O}/figure-bindings.json`));
const authorFile = `${T}/tmp/d1816-d118-n19-fig26-label-author/author-freeze.json`;
assert.equal(hash(authorFile), 'ba42139e328b6850c783e9c153aa215e13a86ba7949092df825f468a8cb6ac54');
const author = read(authorFile);
for (const row of bindings(author)) verify(row);
const metadataReviewFile = `${T}/tmp/d1816-d116-n19-metadata-review/review-freeze.json`;
assert.equal(hash(metadataReviewFile), 'd5aef20641999aee5fcf937988436ec0464bf0f2312ab394403eb92fe62aa581');
const metadataReview = read(metadataReviewFile);
for (const row of [metadataReview.report, ...Object.values(metadataReview.inputs)]) verify(row);
assert.equal(read(metadataReview.report.path).status, 'PASS');
const reviewFile = `${D}/report.json`;
const reviewFreezeFile = `${D}/review-freeze.json`;
const scratchReviewFile = `${D}/fig-26.review.json`;
const review = read(reviewFile);
assert.equal(review.status.toLowerCase(), 'pass');
assert.equal(read(scratchReviewFile).status, 'pass');
const approved = bindings(read(reviewFreezeFile));
for (const row of approved) verify(row);
for (const row of [author.candidate, author.render, author.svg, author.preview]) {
  assert(approved.some(r => path.resolve(r.path) === path.resolve(row.path)
    && r.sha256 === row.sha256), `Missing independent binding: ${row.path}`);
}
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const directory = `${C}/editions/${edition}/figures`;
  const specFile = `${directory}/fig-26.spec.json`;
  const svgFile = `${directory}/fig-26.svg`;
  const renderFile = `${directory}/fig-26.render.json`;
  const finalReviewFile = `${directory}/fig-26.review.json`;
  const spec = read(author.candidate.path);
  const original = structuredClone(spec);
  spec.source.image.path = `${R}/figures/fig-26.png`;
  for (const item of spec.source.authoritativeText) delete item.template;
  assert.deepEqual(spec.objects, original.objects);
  assert.deepEqual(spec.assertions, original.assertions);
  assert.deepEqual(spec.source.authoritativeText.map(item => item.text),
    original.source.authoritativeText.map(item => item.text));
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256);
  save(specFile, spec);
  fs.copyFileSync(author.svg.path, svgFile, fs.constants.COPYFILE_EXCL);
  assert.equal(hash(svgFile), author.svg.sha256);
  const render = read(author.render.path);
  assert.equal(render.status, 'pass');
  render.spec = { path: `${R}/editions/${edition}/figures/fig-26.spec.json`, sha256: hash(specFile) };
  render.output.svg = { path: `${R}/editions/${edition}/figures/fig-26.svg`, sha256: hash(svgFile) };
  save(renderFile, render);
  // Record against the actual carrier files, then relocate only their paths.
  const localRenderFile = `${O}/${locale}-local.render.json`;
  const localRender = structuredClone(render);
  localRender.spec.path = specFile;
  localRender.output.svg.path = svgFile;
  save(localRenderFile, localRender);
  const localReviewFile = `${O}/${locale}-local.review.json`;
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d120-n19-${locale}-approved-figure-record`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
    '--status', 'pass', '--notes',
    `Independent D119 affected report SHA256 ${hash(reviewFile)}; D117 source/physical/cultural PASS reused. D118 geometry, SVG, labels and full context text unchanged. Scratch template locator removed; source/spec/SVG/evidence paths relocated only. D113 prose PASS and D116 metadata PASS reused; original Chinese review not rebound.`],
  { cwd: repo, stdio: 'inherit' });
  const finalReview = read(localReviewFile);
  const relocate = value => {
    if (!value || typeof value !== 'object') return;
    if (value.path === localRenderFile) Object.assign(value, {
      path: `${R}/editions/${edition}/figures/fig-26.render.json`, sha256: hash(renderFile),
    });
    else if (typeof value.path === 'string' && value.path.startsWith(`${C}/editions/`)) {
      value.path = value.path.replace(`${C}/editions/`, `${R}/editions/`);
    }
    for (const item of Object.values(value)) relocate(item);
  };
  relocate(finalReview);
  save(finalReviewFile, finalReview);
  for (const p of [specFile, svgFile, renderFile, finalReviewFile]) {
    assert(!fs.readFileSync(p, 'utf8').includes('.tmp/'), p);
  }
  const templateFile = `${W}/adapt/9p/${edition}/lessons/${I}/figures.template.json`;
  const template = read(templateFile);
  assert.deepEqual(template.figures.map(row => row.id), ['fig-26']);
  const entry = template.figures[0];
  for (const key of ['png', 'generation', 'artwork']) delete entry[key];
  for (const key of ['spec', 'render', 'review']) entry[key] = `figures/fig-26.${key}.json`;
  entry.svg = 'figures/fig-26.svg';
  if (locale === 'en') entry.label = 'Figure 26';
  save(templateFile, template, false);
  records.push({ locale, edition, spec: bind(specFile), svg: bind(svgFile),
    render: bind(renderFile), review: bind(finalReviewFile), manifest: bind(templateFile),
    actualRerenders: 0, metadataOnlyRelocation: true });
}
save(`${O}/figure-bindings.json`, {
  schema: 'STEMROBIN-181/approved-figure-isolated-install@1',
  ticket: 'STEMROBIN-181', batch: 'D120', lesson: I,
  status: 'approved-figure-installed-first-native-finalization-pending',
  author: bind(authorFile), independentReview: bind(reviewFile),
  independentReviewFreeze: bind(reviewFreezeFile), scratchReview: bind(scratchReviewFile),
  metadataReview: bind(metadataReviewFile), records,
  sourcePagesAdded: 0, completeCoursesAdded: 0, imageOpens: 0,
  paidCalls: 0, databaseWrites: false, formalHandoff: false,
});
console.log(JSON.stringify({ figures: 1, editions: 2, nativeFinalizationPending: true }));
