import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d135-t9-figures-author`;
const V = `${T}/tmp/d1816-d137-t9-figures-review`;
const O = `${T}/tmp/d1816-d138-t9-native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const C0 = '.tmp/STEMROBIN-181/d1816-d133/root';
const W0 = '.tmp/STEMROBIN-181/d1816-d135/work';
const C = '.tmp/STEMROBIN-181/d1816-d138/root';
const W = '.tmp/STEMROBIN-181/d1816-d138/work';
const D = '.tmp/STEMROBIN-181/d1816-d138/display';
const ID = 'phy9-c1-s3-t9';
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => {
  const bytes = fs.readFileSync(p);
  return { path: p, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = value => assert.equal(bind(value.path).sha256, value.sha256, value.path);
const save = (file, value, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
assert(!fs.existsSync(O));
assert(!fs.existsSync(C));
assert(!fs.existsSync(W));
assert.equal(read(`${V}/parent-collected.json`).reviewerClosed, true);
const author = read(`${A}/report.json`);
const retainedInputs = [];
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
  retainedInputs.push({ frozen: bind(from), working: bind(to) });
};
copy(`${C0}/9p/book.json`, `${C}/9p/book.json`);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  copy(`${C0}/9p/lessons/${ID}/${name}`, `${C}/9p/lessons/${ID}/${name}`);
}
for (const page of ['0092', '0093']) {
  const dir = `${C}/9p/pages/${page}`;
  fs.mkdirSync(dir, { recursive: true });
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    fs.symlinkSync(path.resolve(`${C0}/9p/pages/${page}/${name}`), `${dir}/${name}`);
  }
}
fs.mkdirSync(`${C}/9p/figures`, { recursive: true });
for (const figure of ['fig-24', 'fig-30']) {
  for (const extension of ['png', 'svg']) {
    fs.symlinkSync(path.resolve(`${C0}/9p/figures/${figure}.${extension}`),
      `${C}/9p/figures/${figure}.${extension}`);
  }
}
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  for (const name of ['lesson', 'exercises', 'figures']) {
    const suffix = `adapt/9p/${edition}/lessons/${ID}/${name}.template.json`;
    copy(`${W0}/${suffix}`, `${W}/${suffix}`);
  }
}
const calls = [];
const native = (name, script, args) => {
  execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`, name, P, script, ...args],
    { cwd: repo, stdio: 'inherit' });
  const file = `${T}/tmp/d1816-recovery/native/${name}/receipt.json`;
  assert.equal(read(file).exitCode, 0);
  calls.push(bind(file));
};
const figureRecords = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  for (const selected of author.figures) {
    const figure = selected.figure;
    for (const entry of [selected.source, selected.spec, selected.svg, selected.nativeRender]) verify(entry);
    const review = read(`${V}/${figure}.review.json`);
    assert.equal(review.status, 'pass');
    assert.equal(review.spec.sha256, selected.spec.sha256);
    assert.equal(review.outputs.svg.sha256, selected.svg.sha256);
    const original = read(selected.spec.path);
    const spec = structuredClone(original);
    spec.source.image.path = `${R}/figures/${figure}.png`;
    verify(spec.source.image);
    const removed = [];
    spec.source.authoritativeText = spec.source.authoritativeText.filter(row => {
      if (!row.text.startsWith('Input context and full bilingual T9 text locators: ')) return true;
      removed.push(row);
      return false;
    }).map(row => {
      if (!row.text.startsWith(`${repo}/`)) return row;
      const newline = row.text.indexOf('\n');
      assert(newline > 0 && row.text.slice(0, newline).includes('/lesson.json#/prose/'));
      return { ...row, text: row.text.slice(newline + 1) };
    });
    assert.equal(removed.length, 1);
    assert.deepEqual(spec.objects, original.objects);
    assert.deepEqual(spec.assertions, original.assertions);
    assert.deepEqual(spec.source.authoritativeText.slice(0, 2), original.source.authoritativeText.slice(0, 2));
    assert(!JSON.stringify(spec).includes('.tmp/'));
    assert(!JSON.stringify(spec).includes('.intentfold/tickets/'));
    const dir = `${C}/9p/editions/${edition}/figures`;
    const specFile = `${dir}/${figure}.spec.json`;
    const svgFile = `${dir}/${figure}.svg`;
    const renderFile = `${dir}/${figure}.render.json`;
    const reviewFile = `${dir}/${figure}.review.json`;
    save(specFile, spec);
    fs.copyFileSync(selected.svg.path, svgFile, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(svgFile).sha256, selected.svg.sha256);
    const render = read(selected.nativeRender.path);
    assert.equal(render.status, 'pass');
    render.spec = { path: `${R}/editions/${edition}/figures/${figure}.spec.json`, sha256: bind(specFile).sha256 };
    render.output.svg = { path: `${R}/editions/${edition}/figures/${figure}.svg`, sha256: bind(svgFile).sha256 };
    save(renderFile, render);
    const localRender = structuredClone(render);
    localRender.spec.path = specFile;
    localRender.output.svg.path = svgFile;
    const localRenderFile = `${O}/${locale}-${figure}.local.render.json`;
    const localReviewFile = `${O}/${locale}-${figure}.local.review.json`;
    save(localRenderFile, localRender);
    native(`d138-t9-${locale}-${figure}-metadata-only-review-record`,
      '.agents/skills/ld-s10y-image/scripts/record_review.py', [
        '--spec', specFile, '--render', localRenderFile, '--output', localReviewFile,
        '--status', 'pass', '--notes',
        `Independent D137 ${figure} review SHA256 ${bind(`${V}/${figure}.review.json`).sha256}. D135 source, actual diagram, geometry, assertions and SVG approved; exact SVG and all objects/assertions retained. Only source path relocated, provenance-only scratch-locator paragraph removed, and source excerpt path-prefix lines removed. Actual q2 and original definition prose unchanged. No visual/native rendering replay.`,
      ]);
    const relocatedReview = read(localReviewFile);
    relocatedReview.spec.path = render.spec.path;
    relocatedReview.render = { path: `${R}/editions/${edition}/figures/${figure}.render.json`, sha256: bind(renderFile).sha256 };
    relocatedReview.outputs = render.output;
    save(reviewFile, relocatedReview);
    const templateFile = `${W}/adapt/9p/${edition}/lessons/${ID}/figures.template.json`;
    const template = read(templateFile);
    const entry = template.figures.find(row => row.id === figure);
    assert(entry);
    for (const key of ['png', 'artwork', 'generation']) delete entry[key];
    entry.svg = `figures/${figure}.svg`;
    for (const key of ['spec', 'render', 'review']) entry[key] = `figures/${figure}.${key}.json`;
    save(templateFile, template, false);
    figureRecords.push({ figure, locale, selected: selected.selectedCandidate,
      originalSpec: selected.spec, spec: bind(specFile), svg: bind(svgFile),
      render: bind(renderFile), review: bind(reviewFile), manifest: bind(templateFile),
      metadataOnly: true, nativeRendersReplayed: 0 });
  }
}
for (const record of figureRecords) record.manifest = bind(record.manifest.path);
save(`${O}/figure-install.json`, {
  batch: 'D138', figureRecords, independentReviewer: bind(`${V}/review-freeze.json`),
  retainedInputs, frozenD133D135CarrierAndTemplatesUnchanged: true,
  imagesOpened: 0, canonicalPromotions: 0, completeCoursesAdded: 0,
});
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  native(`d138-t9-${locale}-first-native-finalize`, '.claude/skills/ld-s10y-lesson/tools/p2c.py', [
    'adapt-finalize', '--book', '9p', '--edition', edition, '--lesson', ID,
    '--root', C, '--work', W,
  ]);
  const dir = `${C}/9p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/exercises.json`).count, 6);
  assert.equal(read(`${dir}/lesson.json`).prose.length, 0);
  native(`d138-t9-${locale}-first-offline-render`, '.claude/skills/ld-s10y-lesson/tools/p2c.py', [
    'render', '--book', '9p', '--edition', edition, '--lesson', ID,
    '--root', C, '--work', D,
  ]);
  records.push({ locale, edition, files: fs.readdirSync(dir).map(name => bind(`${dir}/${name}`)),
    html: ['text.html', 'exercises.html'].map(name => bind(`${D}/render/9p/${edition}/${ID}/${name}`)) });
}
save(`${O}/native-finalized.json`, {
  batch: 'D138', status: 'pass', lesson: ID, records, calls,
  operativeRoot: C, operativeWork: W, displayWork: D,
  figureInstall: bind(`${O}/figure-install.json`),
  nativeFinalizers: 2, offlineRenders: 2, parentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
  originalWrittenQuestions: 6, independentChoicesAnswersAndDisplayPending: true,
});
console.log(JSON.stringify({ batch: 'D138', nativeFinalized: bind(`${O}/native-finalized.json`),
  originalQuestions: 6, completeCoursesAdded: 0 }));
