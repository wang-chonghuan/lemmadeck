import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181', R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const B = '.tmp/STEMROBIN-181/d1816-d090', I = 'phy9-c2-s6-n128';
const F = `${T}/tmp/d1816-d092-n128-affected-author/author-freeze.json`;
const D = `${T}/tmp/d1816-d095-affected128-source320321-review`;
const O = `${T}/tmp/d1816-d090-n128-promotion`;
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const verify = r => assert.equal(bind(r.path).sha256, r.sha256, r.path);
const save = (p, data, exclusive = true) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
const [expectedReportHash, expectedFreezeHash] = process.argv.slice(2);
assert.match(expectedReportHash || '', /^[a-f0-9]{64}$/);
assert.match(expectedFreezeHash || '', /^[a-f0-9]{64}$/);
assert.equal(bind(`${D}/report.json`).sha256, expectedReportHash);
assert.equal(bind(`${D}/review-freeze.json`).sha256, expectedFreezeHash);
assert.equal(bind(F).sha256, '42c2f015bd755b2d80b49741448e559ccde04ae47d1bcd2cb44a554591c39f15');
assert(!fs.existsSync(`${O}/figure-bindings.json`));
const review = read(`${D}/report.json`);
assert.equal(review.status, 'PASS_SCOPES_ONLY_NO_PROMOTION');
assert.equal(review.approval.scopedIndependentReviewComplete, true);
for (const key of ['SCI', 'ZH', 'EN', 'context']) assert.equal(review.verdicts[key].verdict, 'PASS');
assert.equal(review.actionableAffectedOnlyDefects.length, 0);
const originalReview = read(`${T}/tmp/d1816-d089-n128-first-review/report.json`);
for (const id of ['fig-290', 'fig-291']) assert.equal(originalReview.verdicts[id].verdict, 'PASS');
const author = read(F), prepared = read(`${O}/prepared.json`);
const raw = read(`${B}/root/9p/lessons/${I}/lesson.json`), templateCopies = [];
for (const row of author.templates) {
  verify(row.lesson);
  const target = `${B}/work/adapt/9p/${row.edition}/lessons/${I}/lesson.template.json`;
  const originalCopy = prepared.copies.find(r => r.target.path === target);
  assert(originalCopy);
  verify(originalCopy.target);
  const locale = row.edition === 'modern-us-neutral-en' ? 'en' : 'zh';
  const template = read(row.lesson.path);
  const metadataBefore = { printed_title: template.printed_title, locale: template.locale ?? null };
  const proseBefore = structuredClone(template.prose);
  template.printed_title = raw.printed_title;
  template.locale = locale;
  assert.deepEqual(template.prose, proseBefore);
  save(`${O}/identity-before-${locale}.json`, {
    source: row.lesson, originalPreparedCopy: originalCopy.target,
    metadataBefore, metadataAfter: { printed_title: template.printed_title, locale },
    changedPointers: ['/printed_title', '/locale'],
    reason: 'Preserve exact source printed-title emphasis and use supported locale metadata; modern title and all prose/math/ref/source snapshots remain unchanged. D092 out-of-scope identity diagnostics are preserved, not erased.',
  });
  save(target, template, false);
  templateCopies.push({ edition: row.edition, locale, reviewedTemplate: row.lesson, workingTemplate: bind(target) });
}
const records = [];
for (const row of templateCopies) {
  const directory = `${R}/editions/${row.edition}/figures`;
  for (const figure of author.figures) {
    for (const key of ['spec', 'render', 'unchangedSVG']) verify(figure[key]);
    const specFile = `${directory}/${figure.id}.spec.json`, svgFile = `${directory}/${figure.id}.svg`;
    const renderFile = `${directory}/${figure.id}.render.json`, reviewFile = `${directory}/${figure.id}.review.json`;
    const spec = read(figure.spec.path), sourceBefore = structuredClone(spec.source.image);
    const sourceImage = `${R}/figures/${figure.id}.png`;
    assert.equal(bind(sourceImage).sha256, sourceBefore.sha256);
    spec.source.image.path = sourceImage;
    save(specFile, spec);
    fs.copyFileSync(figure.unchangedSVG.path, svgFile, fs.constants.COPYFILE_EXCL);
    const render = read(figure.render.path);
    assert.equal(render.status, 'pass');
    render.spec = bind(specFile);
    render.output.svg = bind(svgFile);
    save(renderFile, render);
    execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, `d090-${row.locale}-${figure.id}-record-review`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', specFile, '--render', renderFile, '--output', reviewFile, '--status', 'pass',
      '--notes', `D089 graphic PASS reused unchanged; D095 affected text/context PASS report SHA256 ${expectedReportHash}. Current D092 complete bilingual source text is bound. Only source/spec/output paths are relocated; SVG/geometry/labels unchanged. No graphic re-review or re-render.`],
    { cwd: repo, stdio: 'inherit' });
    for (const p of [specFile, svgFile, renderFile, reviewFile]) assert(!fs.readFileSync(p, 'utf8').includes('.tmp/'), p);
    records.push({ edition: row.edition, locale: row.locale, id: figure.id,
      sourceBefore, sourceAfter: spec.source.image, candidateSpec: figure.spec,
      spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile), review: bind(reviewFile),
      nativeGeometryRerendered: false, metadataOnlyRelocation: true });
  }
  const carrierFigures = `${B}/root/9p/editions/${row.edition}/figures`;
  fs.mkdirSync(path.dirname(carrierFigures), { recursive: true });
  fs.symlinkSync(path.resolve(directory), carrierFigures, 'dir');
  const manifestFile = `${B}/work/adapt/9p/${row.edition}/lessons/${I}/figures.template.json`;
  const manifest = read(manifestFile);
  assert.deepEqual(manifest.figures.map(r => r.id), ['fig-290', 'fig-291']);
  for (const figure of manifest.figures) {
    for (const ext of ['spec', 'render', 'review']) figure[ext] = `figures/${figure.id}.${ext}.json`;
    figure.svg = `figures/${figure.id}.svg`;
    for (const key of ['png', 'generation', 'artwork']) delete figure[key];
  }
  save(manifestFile, manifest, false);
  row.figureManifest = bind(manifestFile);
}
save(`${O}/figure-bindings.json`, {
  schema: 'STEMROBIN-181/approved-figure-promotion@1', batch: 'D090', lesson: I,
  status: 'approved-figures-installed-first-native-finalization-pending',
  affectedAuthor: bind(F), originalReview: bind(`${T}/tmp/d1816-d089-n128-first-review/report.json`),
  affectedReview: bind(`${D}/report.json`), affectedReviewFreeze: bind(`${D}/review-freeze.json`),
  records, templates: templateCopies, metadataOnlyIdentityCorrection: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0, parentImageOpens: 0,
  databaseWrites: false, formalHandoff: false,
});
console.log(JSON.stringify({ installedFigures: 2, editions: 2, nativeFinalizationPending: true }));
