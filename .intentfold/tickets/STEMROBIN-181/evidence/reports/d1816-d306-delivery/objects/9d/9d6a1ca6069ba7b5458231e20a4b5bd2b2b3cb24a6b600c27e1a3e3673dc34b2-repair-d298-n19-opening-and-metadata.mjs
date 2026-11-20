import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d298-n19-affected-author`;
const root = '.tmp/STEMROBIN-181/d1816-d287/source-root/10p';
const work = '.tmp/STEMROBIN-181/d1816-d287/work/adapt/10p';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const id = 'phy10-c1-s3-n19';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
const oldSentence = "Different physical quantities change periodically, which means their changes repeat: in mechanical oscillations, the changing quantities are the object's position coordinate $x$ and its velocity component $v_x$, which gives its speed and direction along the chosen axis;";
const newSentence = "Different physical quantities change periodically, which means their changes repeat.\nIn mechanical oscillations, the changing quantities are the object's position coordinate $x$ and its velocity component $v_x$, which gives its speed and direction along the chosen axis.";
const oldContinuation = "in electrical oscillations, they are the charge $q$ stored in the capacitor and the current $i$ flowing in the circuit.";
const newContinuation = "In electrical oscillations, the changing quantities are the charge $q$ stored in the capacitor and the current $i$ flowing in the circuit.";
const oldTextFile = `${T}/tmp/d1816-d287-n19-text-recovery/frozen/en.text.md`;
let englishText = fs.readFileSync(oldTextFile, 'utf8');
assert(englishText.includes(oldSentence) && englishText.includes(oldContinuation));
englishText = englishText.replace(oldSentence, newSentence).replace(oldContinuation, newContinuation);
fs.mkdirSync(O, { recursive: true });
const newTextFile = `${O}/en.text.md`;
fs.writeFileSync(newTextFile, englishText, { flag: 'wx' });
const copiedSources = [];
for (const figure of ['tbl-p0053-01', 'fig-28', 'fig-29'])
  for (const suffix of ['png', 'svg']) {
    const source = `${canonical}/figures/${figure}.${suffix}`;
    const target = `${root}/figures/${figure}.${suffix}`;
    copy(source, target);
    copiedSources.push({ source: bind(source), target: bind(target) });
  }
const templates = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${work}/${edition}/lessons/${id}`;
  const lessonFile = `${dir}/lesson.template.json`;
  const manifestFile = `${dir}/figures.template.json`;
  const lesson = read(lessonFile);
  const original = structuredClone(lesson);
  const before = bind(lessonFile);
  copy(lessonFile, `${O}/before/${locale}.lesson.template.json`);
  copy(manifestFile, `${O}/before/${locale}.figures.template.json`);
  if (locale === 'en') {
    assert(lesson.prose[0].text.includes(oldSentence));
    assert(lesson.prose[0].text.includes(oldContinuation));
    lesson.prose[0].text = lesson.prose[0].text
      .replace(oldSentence, newSentence).replace(oldContinuation, newContinuation);
    for (const block of lesson.prose) if (block.kind === 'fig') block.label = 'Table';
    lesson.figures.find(figure => figure.id === 'tbl-p0053-01').label = 'Table';
  }
  for (const number of [28, 29]) {
    const figure = `fig-${number}`;
    const pattern = new RegExp(`图\\s*(?:\\$\\s*)?${number}(?!\\d)`);
    const targets = lesson.prose.filter(block => block.kind === 'p' && pattern.test(block.source_text));
    assert.equal(targets.length, 1);
    assert(!targets[0].figures?.length);
    targets[0].figures = [{ id: figure, label: locale === 'en' ? `Figure ${number}` : `图 ${number}` }];
  }
  const beforeParagraphs = proseFlow(original.prose, original.section_breaks).filter(row => row.kind === 'p');
  const afterParagraphs = proseFlow(lesson.prose, lesson.section_breaks).filter(row => row.kind === 'p');
  assert.equal(afterParagraphs.length, beforeParagraphs.length);
  for (const [index, paragraph] of afterParagraphs.entries()) {
    if (locale === 'en' && index <= 1) continue;
    assert.equal(paragraph.text, beforeParagraphs[index].text);
  }
  assert.deepEqual(lesson.source, original.source);
  assert.deepEqual(lesson.section_breaks, original.section_breaks);
  const manifest = read(manifestFile);
  manifest.figures = ['tbl-p0053-01', 'fig-28', 'fig-29'].map(figure => ({
    id: figure,
    label: figure === 'tbl-p0053-01' ? (locale === 'en' ? 'Table' : '表')
      : (locale === 'en' ? `Figure ${Number(figure.slice(4))}` : `图 ${Number(figure.slice(4))}`),
    spec: `figures/${figure}.spec.json`, svg: `figures/${figure}.svg`,
    render: `figures/${figure}.render.json`, review: `figures/${figure}.review.json`,
    changes: ['modernized'],
    source: Object.fromEntries(['png', 'svg'].map(suffix => [
      suffix, { path: `figures/${figure}.${suffix}`,
        sha256: bind(`${canonical}/figures/${figure}.${suffix}`).sha256 },
    ])),
  }));
  fs.writeFileSync(lessonFile, JSON.stringify(lesson, null, 2) + '\n');
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  templates.push({ locale, before, after: bind(lessonFile), manifest: bind(manifestFile),
    unchangedProseParagraphs: locale === 'en' ? afterParagraphs.length - 2 : afterParagraphs.length,
    fullParagraphs: afterParagraphs.length, sourceSnapshotChanged: false });
}
const contexts = [];
for (const figure of ['fig-28', 'fig-29', 'tbl-p0053-01']) {
  const first = `${T}/tmp/d1816-d293-n19-figure-context/${figure}`;
  const spec = read(`${first}/spec.json`);
  const original = structuredClone(spec);
  const english = spec.source.authoritativeText.filter(entry =>
    entry.lesson === id && entry.locale === 'en');
  assert.equal(english.length, 1);
  assert.equal(english[0].text, fs.readFileSync(oldTextFile, 'utf8'));
  english[0].text = englishText;
  const specFile = `${O}/figures/${figure}/spec.json`;
  save(specFile, spec);
  const renderFile = `${first}/${figure}.render.json`;
  const render = read(renderFile);
  assert.equal(render.status, 'pass');
  assert.equal(render.spec.sha256, bind(`${first}/spec.json`).sha256);
  const svg = bind(render.output.svg.path);
  assert.equal(svg.sha256, render.output.svg.sha256);
  render.spec = { path: specFile, sha256: bind(specFile).sha256 };
  const newRenderFile = `${O}/figures/${figure}/${figure}.render.json`;
  save(newRenderFile, render);
  for (const key of ['objects', 'assertions', 'canvas', 'display', 'layout'])
    assert.deepEqual(spec[key], original[key]);
  contexts.push({ figure, firstSpec: bind(`${first}/spec.json`),
    firstRender: bind(renderFile), spec: bind(specFile), render: bind(newRenderFile),
    svg, geometryChanged: false, geometryRerenders: 0 });
}
save(`${O}/result.json`, { batch: 'D298', status: 'affected-review-pending',
  initialTextReview: bind(`${T}/tmp/d1816-d292-n19-text-review/report.json`),
  initialEnglishText: bind(oldTextFile), englishText: bind(newTextFile),
  templates, contexts, copiedSources, contentRepairRounds: 1,
  changedEnglishParagraphs: [0, 1], ChineseProseChanged: false,
  sourceSnapshotsChanged: false, sectionBoundariesChanged: false,
  geometryRerenders: 0, actualParentImageOpens: 0, completeCoursesAdded: 0,
  databaseWrites: false, paidCalls: 0 });
console.log(JSON.stringify({ result: bind(`${O}/result.json`) }));
