import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const carrier = '.tmp/STEMROBIN-181/d1816-d057/n22-root/10p';
const work = '.tmp/STEMROBIN-181/d1816-d057/n22-work';
const id = 'phy10-c1-s3-n22';
const output = `${ticket}/tmp/d1816-d057-n22-promotion/figure-bindings.json`;
const repairFile = `${ticket}/tmp/d1816-d061-n22-amplitude-repair/author-freeze.json`;
const reviewFile = `${ticket}/tmp/d1816-d062-n22-review/report.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const verify = row => assert.equal(hash(row.path), row.sha256, row.path);
const save = (file, data, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(output));
const repair = read(repairFile), review = read(reviewFile);
const reviewFreeze = read(`${ticket}/tmp/d1816-d062-n22-review/review-freeze.json`);
verify(reviewFreeze.report);
assert.equal(review.status.toLowerCase(), 'pass');
assert(review.role.includes('NOT AUTHOR'));
assert.equal(review.SCI.toLowerCase(), 'pass');
assert.equal(review.ZHEN.toLowerCase(), 'pass');
assert.equal(review.toolAffected.toLowerCase(), 'pass');
for (const row of repair.records) verify(row.lesson);
for (const row of repair.raw) verify(row);
const records = [];
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${root}/editions/${edition}/figures`;
  fs.mkdirSync(directory, { recursive: true });
  const figures = [];
  for (const row of repair.figureRecords.filter(row => row.edition === edition)) {
    const scratchBinding = reviewFreeze.figureReviews.find(binding =>
      path.basename(binding.path) === `${row.figure}.review.json`);
    assert(scratchBinding);
    verify(scratchBinding);
    const scratchReview = scratchBinding.path;
    assert.equal(read(scratchReview).status, 'pass');
    for (const key of ['spec', 'svg', 'render']) verify(row[key]);
    verify(read(row.spec.path).source.image);
    const base = `${directory}/${row.figure}`;
    for (const extension of ['spec.json', 'svg']) {
      const from = row[extension === 'svg' ? 'svg' : 'spec'].path;
      assert(!fs.readFileSync(from, 'utf8').includes('.tmp/'), from);
      fs.copyFileSync(from, `${base}.${extension}`, fs.constants.COPYFILE_EXCL);
    }
    const render = read(row.render.path);
    assert.equal(render.status, 'pass');
    assert.equal(render.reuse.geometryLabelsAssertionsDisplayUnchanged, true);
    render.reuse = {
      kind: render.reuse.kind,
      priorSpecSha256: render.reuse.priorSpec.sha256,
      priorRenderSha256: render.reuse.priorRender.sha256,
      unchangedSvgSha256: render.reuse.unchangedSvgSha256,
      geometryLabelsAssertionsDisplayUnchanged: true,
      retainedCandidateRenderSha256: row.render.sha256,
    };
    render.spec = bind(`${base}.spec.json`);
    render.output.svg = bind(`${base}.svg`);
    save(`${base}.render.json`, render);
    execFileSync('python3', [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${base}.spec.json`, '--render', `${base}.render.json`,
      '--output', `${base}.review.json`, '--status', 'pass', '--notes',
      `Independent D062 report SHA256 ${hash(reviewFile)}; scratch review SHA256 ${hash(scratchReview)}. Geometry and SVG reused unchanged; D061 localized only amplitude-label text. Passing original render and immutable before snapshots retained in batch evidence. Durable metadata paths relocated only.`,
    ], { cwd: repo, stdio: 'inherit' });
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json']) {
      assert(!fs.readFileSync(`${base}.${extension}`, 'utf8').includes('.tmp/'));
    }
    figures.push({ id: row.figure, spec: bind(`${base}.spec.json`), svg: bind(`${base}.svg`),
      render: bind(`${base}.render.json`), review: bind(`${base}.review.json`),
      scratchReview: bind(scratchReview) });
  }
  assert.deepEqual(figures.map(row => row.id), ['fig-34', 'fig-35']);
  const link = `${carrier}/editions/${edition}/figures`;
  fs.mkdirSync(path.dirname(link), { recursive: true });
  assert(!fs.existsSync(link));
  fs.symlinkSync(path.resolve(directory), link, 'dir');
  const templateFile = `${work}/adapt/10p/${edition}/lessons/${id}/figures.template.json`;
  const template = read(templateFile);
  assert.deepEqual(template.figures.map(row => row.id), ['fig-34', 'fig-35']);
  for (const row of template.figures) {
    row.spec = `figures/${row.id}.spec.json`;
    row.svg = `figures/${row.id}.svg`;
    row.render = `figures/${row.id}.render.json`;
    row.review = `figures/${row.id}.review.json`;
  }
  fs.chmodSync(templateFile, 0o644);
  save(templateFile, template, false);
  records.push({ edition, figures, manifest: bind(templateFile) });
}
save(output, {
  schema: 'STEMROBIN-181/approved-figure-promotion@1', batch: 'D057', lesson: id,
  status: 'approved-figures-installed-native-finalization-pending',
  repairedAuthor: bind(repairFile), independentReview: bind(reviewFile), records,
  sourcePagesAdded: 0, imageOpens: 0, rerendered: false,
  completeCoursesAdded: 0, paidCalls: 0, databaseWrites: false,
});
console.log(JSON.stringify({ installedFigures: 2, editions: 2, nativeFinalizationPending: true }));
