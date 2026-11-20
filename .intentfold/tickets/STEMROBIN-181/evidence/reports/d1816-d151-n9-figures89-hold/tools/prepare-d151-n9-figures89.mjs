import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d151-n9-figures89-author`;
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
const previousFile = `${T}/tmp/d1816-d149-n9-figures-author/input-freeze.json`;
const previous = read(previousFile);
const root = previous.root;
const work = previous.work;
const lessonFile = `${root}/9p/lessons/phy9-c1-s1-n9/lesson.json`;
const lesson = read(lessonFile);
const figures = lesson.prose.filter(row => row.kind === 'fig').map(row => row.id);
const batchFigures = figures.filter(id => /^fig-\d+$/.test(id)).slice(2, 4);
assert.deepEqual(batchFigures, ['fig-08', 'fig-09']);
const review = read(previous.textReview.path);
assert.equal(review.reviewerClosed, true);
for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) assert.equal(review[key], 'pass');
const languages = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const file = `${T}/tmp/d1816-d147-n9-affected-text/frozen/${edition}/lesson.template.json`;
  const text = read(file);
  languages[locale] = {
    binding: bind(file), blocks: text.prose,
    fullText: text.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
  };
}
const contexts = [];
for (const figure of batchFigures) {
  const nativeContexts = {};
  for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
    const output = `${O}/contexts/${locale}/${figure}.native-context.json`;
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`,
      `d151-${locale}-${figure.replace('-', '')}-first-context`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.agents/skills/ld-s10y-image/scripts/build_context.py',
      '--book', '9p', '--edition', edition, '--figure', figure,
      '--root', root, '--output', output,
    ], { cwd: repo, stdio: 'inherit' });
    nativeContexts[locale] = bind(output);
  }
  contexts.push(save(`${O}/${figure}.input-context.json`, {
    batch: 'D151', ticket: 'STEMROBIN-181', book: '9p', lesson: 'phy9-c1-s1-n9', figure,
    role: 'FIRST_SHARED_MODERN_FIGURE_AUTHOR_INPUT',
    nativeContexts, languages, originalLesson: bind(lessonFile),
    originalText: lesson.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
    sourceImage: bind(`${root}/9p/figures/${figure}.png`),
    durableSourceImage: bind(`ssot-resources/soviet10year-textbooks/artifacts/9p/figures/${figure}.png`),
    sourceInventory: 'NOT_AUTHORED: open original PNG first and record actual source structure',
    sourceRequirementsFromTextOnly: [
      'The liquid picture is a qualitative local cage approximation, not a permanent crystal lattice.',
      'The source compression illustration is explicitly qualified: short-range repulsion, not literal molecular deformation as a sole explanation.',
      'Preserve actual source facts and distinguish modern explanatory additions. Do not invent quantitative constants.',
    ],
    root, work, independentTextReview: previous.textReview,
    defaultDisplay: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
    authorMayChooseValidatedNaturalInlineSize: true,
    maximumImageOpensForWholeTwoFigureBatch: 8, maximumContextImageOpens: 24,
    maximumContentRepairsPerFigure: 1, originalTasks: 0, paidCalls: 0,
    portraitGenerationAuthorized: false, parentImageOpens: 0,
    sourcePageReviewsReplayed: false, independentFigureApproval: false,
    promotionAuthorized: false,
  }));
}
const freeze = save(`${O}/input-freeze.json`, {
  batch: 'D151', status: 'FIRST_TWO_N9_LIQUID_FIGURE_AUTHOR_INPUTS_READY',
  contexts, root, work, figures: batchFigures,
  otherFiguresPending: figures.filter(id => !batchFigures.includes(id)),
  immutableSharedCarrier: bind(previousFile), textReview: previous.textReview,
  fullTextBindings: Object.values(languages).map(row => row.binding),
  nativeContextCalls: 4, nativeFinalizers: 0, nativeRenders: 0,
  maximumAuthorImageOpens: 8, parentImageOpens: 0,
  paidCalls: 0, originalTasks: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
  independentApproval: false, portraitGenerationAuthorized: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D151 = {
  status: 'FIRST_TWO_N9_LIQUID_FIGURE_AUTHOR_INPUTS_READY',
  inputFreeze: freeze, contexts, root, work, figures: batchFigures,
  imagesAuthorized: 8, completeCoursesAdded: 0, canonicalPromotions: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: freeze, figures: batchFigures,
  nativeContextCalls: 4, imagesOpened: 0, completeCoursesAdded: 0 }));
