import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d590';
const C = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const O = `${T}/tmp/d1816-d598-n25-native`;
const E = `${T}/evidence/reports/d1816-d598-n25-native`;
const ID = 'phy10-c1-s3-n25';
const R = `${T}/tmp/d1816-d596-n25-first-review/report.json`;
const A = `${T}/tmp/d1816-d600-n25-affected-repair`;
const FIRST_A = `${T}/tmp/d1816-d591-n25-bilingual-author`;
const F = `${T}/tmp/d1816-d593-n25-figures-first`;
const AR = `${T}/tmp/d1816-d601-n25-affected-review/report.json`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) assert.equal(bind(from).sha256, bind(to).sha256, to);
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  return bind(to);
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
const review = read(R);
assert.equal(review.status, 'revise');
assert.equal(review.SCI.status, 'pass');
assert.equal(review.figures['fig-40'].status, 'pass');
assert.equal(review.figures['fig-41'].status, 'pass');
const affected = read(AR);
assert.equal(affected.status, 'PASS');
assert.equal(affected.reviewerIsAuthor, false);
const verifyBindings = value => {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) assert.equal(bind(value.path).sha256, value.sha256, value.path);
  for (const child of Object.values(value)) verifyBindings(child);
};
verifyBindings(affected);
assert(!fs.existsSync(`${O}/result.json`));
const raw = read(`${B}/root/10p/lessons/${ID}/lesson.json`);
assert.equal(raw.prose.length, 23);
assert.equal(raw.exercise_count, 0);
assert.equal(read(`${B}/root/10p/lessons/${ID}/exercises.json`).count, 0);
for (const row of read(`${FIRST_A}/author-freeze.json`).bindings)
  assert.equal(bind(row.path).sha256, row.sha256);
const originalReview = copy(R, `${E}/first-review/report.json`);
const affectedReview = copy(AR, `${E}/affected-review/report.json`);
const repair = copy(`${A}/repair.json`, `${E}/affected-review/repair.json`);
const originalInventory = copy(
  `${T}/tmp/d1816-d596-n25-first-review/independent-source-inventory.json`,
  `${E}/first-review/independent-source-inventory.json`);
const relocations = [];
for (const id of ['fig-40', 'fig-41', 'fig-42']) {
  const candidate = id === 'fig-42' ? A : F;
  const specFile = `${candidate}/${id}.spec.json`;
  const producerFile = `${candidate}/${id}.render.json`;
  const spec = read(specFile), producer = read(producerFile);
  assert.equal(producer.status, 'pass');
  assert.equal(producer.spec.sha256, bind(specFile).sha256);
  assert.equal(producer.output.svg.sha256, bind(`${candidate}/${id}.svg`).sha256);
  assert.equal(spec.source.image.sha256, bind(spec.source.image.path).sha256);
  for (const suffix of ['spec.json', 'render.json', 'svg', 'preview.png'])
    copy(`${candidate}/${id}.${suffix}`, `${E}/approved-figures/${id}.${suffix}`);
  const sourceImage = copy(spec.source.image.path, `${C}/figures/${id}.png`);
  copy(`${B}/root/10p/figures/${id}.svg`, `${C}/figures/${id}.svg`);
  const originalSpec = bind(specFile);
  const originalRender = bind(producerFile);
  spec.source.image.path = `${C}/figures/${id}.png`;
  const comparison = read(specFile);
  comparison.source.image.path = spec.source.image.path;
  assert.deepEqual(spec, comparison);
  relocations.push({ id, originalSpec, originalRender, sourceImage,
    onlySpecChange: 'source.image.path', originalSourceHashUnchanged: true,
    geometryLabelsAssertionsAndAuthoritativeTextUnchanged: true,
    svgBytesUnchanged: true });
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const directory = `${B}/root/10p/editions/${edition}/figures`;
    const specTarget = `${directory}/${id}.spec.json`;
    const svgTarget = `${directory}/${id}.svg`;
    const renderTarget = `${directory}/${id}.render.json`;
    const reviewTarget = `${directory}/${id}.review.json`;
    save(specTarget, spec);
    copy(`${candidate}/${id}.svg`, svgTarget);
    const render = structuredClone(producer);
    render.spec = { path: specTarget, sha256: bind(specTarget).sha256 };
    render.output.svg.path = svgTarget;
    save(renderTarget, render);
    if (locale === 'zh') {
      native(`d598-n25-${id}-review-binding`,
        '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
          '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
          '--spec', specTarget, '--render', renderTarget, '--output', reviewTarget,
          '--status', 'pass',
          '--notes', `D596 first independent SCI/prose/faithfulness/source-inventory PASS with two revise findings: ${originalReview.path}. D601 independently passed only the added notation declarations and fig42 heavier current stroke: ${affectedReview.path}. Unchanged fig40/41 PASS reused. Source path relocation preserves approved source pixels, text, geometry, labels, assertions and SVG. Original source alphabet/O-or-zero/lead-in identity HOLDs and native/export failures retained. Offline course display pending.`,
        ]);
    } else {
      const zhReview = `${B}/root/10p/editions/modern-us-neutral/figures/${id}.review.json`;
      const value = read(zhReview);
      value.spec.path = specTarget;
      value.render = { path: renderTarget, sha256: bind(renderTarget).sha256 };
      value.outputs.svg.path = svgTarget;
      value.relocation = { originalReview: bind(zhReview), sameFigureBytes: true,
        independentReviewReplayed: false };
      save(reviewTarget, value);
    }
  }
}
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const template = `${B}/work/adapt/10p/${edition}/lessons/${ID}`;
  fs.mkdirSync(template, { recursive: true });
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
    if (fs.existsSync(`${template}/${name}`))
      copy(`${template}/${name}`, `${E}/prepared-templates/${locale}/${name}`);
  for (const name of ['lesson.template.json', 'exercises.template.json'])
    fs.copyFileSync(`${A}/${locale}/${name}`, `${template}/${name}`);
  const figures = read(`${A}/${locale}/figures.template.json`);
  for (const figure of figures.figures) {
    const id = figure.id;
    Object.assign(figure, { spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
      render: `figures/${id}.render.json`, review: `figures/${id}.review.json` });
    for (const key of ['png', 'generation', 'artwork']) delete figure[key];
    if (locale === 'en') figure.label = `Figure ${Number(id.slice(4))}`;
  }
  fs.writeFileSync(`${template}/figures.template.json`, JSON.stringify(figures, null, 2) + '\n');
  for (const action of ['adapt-finalize', 'render']) {
    native(`d598-n25-${locale}-first-${action}`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
        '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
        '--book', '10p', '--root', `${B}/root`, '--work', `${B}/work`,
        '--edition', edition, '--lesson', ID,
      ]);
  }
  const directory = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${directory}/lesson.json`).exercise_count, 0);
  assert.equal(read(`${directory}/exercises.json`).count, 0);
  records.push({ locale, edition, products: ['lesson.json', 'exercises.json',
    'figures.json', 'adaptation.audit.json'].map(name => bind(`${directory}/${name}`)),
  html: bind(`${B}/work/render/10p/${edition}/${ID}/text.html`),
  exercisesHtml: bind(`${B}/work/render/10p/${edition}/${ID}/exercises.html`) });
}
save(`${O}/result.json`, { course: ID, status: 'NATIVE_PASS_DISPLAY_PENDING',
  firstReview: originalReview, affectedReview, repair,
  firstInventory: originalInventory, records, relocations,
  originalWrittenTasks: 0, standardsProduced: 0, choicesProduced: 0,
  answerChoiceApplicability: 'Source-bound course has zero tasks; no answers or choices invented.',
  sourcePagesAdded: 0, completeCoursesAdded: 0, sourceIdentityHoldsPreserved: true,
  passedReviewsReplayed: false, geometryRerendered: false, paidCalls: 0,
  databaseWrites: false, productAcceptance: false, formalHandoff: false });
console.log(JSON.stringify({ course: ID, native: 'PASS', display: 'PENDING' }));
