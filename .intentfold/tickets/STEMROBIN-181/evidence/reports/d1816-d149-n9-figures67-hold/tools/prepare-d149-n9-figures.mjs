import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d149-n9-figures-author`;
const A = `${T}/tmp/d1816-d147-n9-affected-text`;
const root = '.tmp/STEMROBIN-181/d1816-d149/root';
const work = '.tmp/STEMROBIN-181/d1816-d149/work';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const id = 'phy9-c1-s1-n9';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(O));
assert(!fs.existsSync(root));
assert(!fs.existsSync(work));
const reviewFile = `${T}/tmp/d1816-d148-n9-affected-review/parent-collected.json`;
const textReview = read(reviewFile);
assert.equal(textReview.reviewerClosed, true);
for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) assert.equal(textReview[key], 'pass');
const original = read(`${R}/lessons/${id}/lesson.json`);
assert.equal(original.exercise_count, 0);
const figures = original.prose.filter(row => row.kind === 'fig').map(row => row.id);
assert.equal(figures.length, 10);
const batchFigures = figures.slice(0, 2);
assert.deepEqual(batchFigures, ['fig-06', 'fig-07']);
const sourceBindings = [];
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const from = `${R}/lessons/${id}/${name}`;
  const to = `${root}/9p/lessons/${id}/${name}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, 0o644);
  assert.equal(bind(from).sha256, bind(to).sha256);
  sourceBindings.push(bind(from));
}
assert.equal(read(`${root}/9p/lessons/${id}/exercises.json`).count, 0);
const pages = [...new Set(original.prose.flatMap(row => row.source_refs)
  .map(ref => ref.match(/^p(\d+)#/)[1]))];
for (const page of pages) {
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    const from = `${R}/pages/${page}/${name}`;
    const to = `${root}/9p/pages/${page}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
  }
}
for (const figure of figures) {
  for (const suffix of ['png', 'svg']) {
    const from = `${R}/figures/${figure}.${suffix}`;
    const to = `${root}/9p/figures/${figure}.${suffix}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.symlinkSync(path.resolve(from), to);
  }
}
const book = read(`${R}/book.json`);
const entry = book.lessons.find(row => row.id === id);
assert(entry);
save(`${root}/9p/book.json`, { ...book, lessons: [entry] });
const drafts = [];
const texts = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const templates = `${work}/adapt/9p/${edition}/lessons/${id}`;
  const carrier = `${root}/9p/editions/${edition}/lessons/${id}`;
  fs.mkdirSync(templates, { recursive: true });
  fs.mkdirSync(carrier, { recursive: true });
  for (const name of ['lesson', 'exercises', 'figures']) {
    const from = `${A}/frozen/${edition}/${name}.template.json`;
    const input = `${templates}/${name}.template.json`;
    const output = `${carrier}/${name}.json`;
    fs.copyFileSync(from, input, fs.constants.COPYFILE_EXCL);
    fs.copyFileSync(from, output, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(input, 0o644);
    fs.chmodSync(output, 0o644);
    assert.equal(bind(from).sha256, bind(input).sha256);
    assert.equal(bind(from).sha256, bind(output).sha256);
    drafts.push({ frozen: bind(from), operativeTemplate: bind(input), unfinalizedCarrier: bind(output) });
  }
  const lessonFile = `${carrier}/lesson.json`;
  const lesson = read(lessonFile);
  texts[locale] = {
    lesson: bind(lessonFile),
    fullModernText: lesson.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
    blocks: lesson.prose,
  };
}
const contexts = [];
for (const figure of batchFigures) {
  const nativeContexts = {};
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const output = `${O}/contexts/${locale}/${figure}.native-context.json`;
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`,
      `d149-${locale}-${figure.replace('-', '')}-first-context`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.agents/skills/ld-s10y-image/scripts/build_context.py',
      '--book', '9p', '--edition', edition, '--figure', figure,
      '--root', root, '--output', output,
    ], { cwd: repo, stdio: 'inherit' });
    nativeContexts[locale] = bind(output);
  }
  contexts.push(save(`${O}/${figure}.input-context.json`, {
    batch: 'D149', ticket: 'STEMROBIN-181', book: '9p', lesson: id, figure,
    role: 'FIRST_SHARED_MODERN_FIGURE_AUTHOR_INPUT',
    nativeContexts, textBindings: texts, sourceBindings,
    fullText: { zh: texts.zh.fullModernText, en: texts.en.fullModernText,
      originalZh: original.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n') },
    sourceImage: bind(`${root}/9p/figures/${figure}.png`),
    durableSourceImage: bind(`${R}/figures/${figure}.png`),
    sourceInventory: 'NOT_AUTHORED: inspect original PNG before spec or rendering',
    sourceRequirementsFromTextOnly: [
      'Particles in dilute gas are separated by distances large compared with their own size.',
      'Compression reduces interparticle distances, not the particle size in the stated dilute approximation.',
      'Do not invent numerical molecular-volume, pressure, temperature or force calibration.',
      'Inventory the actual source count, subfigures, container/piston, arrows and relationships from pixels before drawing.',
    ],
    defaultDisplay: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    authorMayChooseValidatedNaturalInlineSize: true,
    root, work, authoritativeTextRule: 'Use complete approved learner text, not scratch locators as prose',
    independentTextReview: bind(reviewFile),
    originalTasks: 0, paidCalls: 0, sourceReviewsReplayed: false,
    independentFigureApproval: false, promotionAuthorized: false,
    maximumAuthorImageOpensForEntireTwoFigureBatch: 8, maximumContextImageOpens: 24,
    maximumContentRepairsPerFigure: 1, portraitGenerationAuthorized: false,
  }));
}
const freeze = save(`${O}/input-freeze.json`, {
  batch: 'D149', status: 'FIRST_TWO_N9_FIGURES_AUTHOR_INPUT_READY',
  contexts, drafts, textReview: bind(reviewFile), sourceBindings,
  root, work, figures: batchFigures, otherFiguresPending: figures.slice(2),
  nativeContextCalls: 4, nativeFinalizers: 0, nativeRenders: 0,
  parentImageOpens: 0, maximumAuthorImageOpens: 8, originalTasks: 0,
  paidCalls: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
  independentFigureApproval: false, promotionAuthorized: false,
  portraitGenerationAuthorized: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D149 = {
  status: 'FIRST_TWO_N9_FIGURES_AUTHOR_INPUT_READY', inputFreeze: freeze,
  contexts, root, work, figures: batchFigures, otherFiguresPending: figures.slice(2),
  imagesAuthorized: 8, completeCoursesAdded: 0, canonicalPromotions: 0,
};
meter.currentResume1816.currentContinuation =
  '137 complete offline courses pushed;561 SOURCE pages and136 captured book-answer records unchanged. D144 N8 delivered. N9 composed SCI/ZH/EN text PASS after exact affected block24 repair; original REVISE and3 attributed-source limits retained, original34 blocks reused. First deterministic fig06/07 author inputs prepared; all10 figures not yet approved, portrait generation unauthorized. All earlier HOLDs/source187/307 unchanged. Continue authorized small batches;no DB,paid calls,parent images,deploy,merge,closure or formal handoff.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: freeze, nativeContextCalls: 4,
  figures: batchFigures, imagesOpened: 0, completeCoursesAdded: 0 }));
