import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d140-n8-text-author`;
const V = `${T}/tmp/d1816-d140-n8-text-review`;
const O = `${T}/tmp/d1816-d141-n8-figure-author`;
const id = 'phy9-c1-s1-n8';
const work = '.tmp/STEMROBIN-181/d1816-d141/work';
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
assert(!fs.existsSync(work));
const collected = read(`${V}/parent-collected.json`);
assert.equal(collected.reviewerClosed, true);
for (const key of ['scienceVerdict', 'zhVerdict', 'enVerdict']) {
  assert.equal(collected[key], 'pass', key);
}
assert.equal(bind(`${A}/author-freeze.json`).sha256,
  '4ba5d71bb1db1655870673716d3e22bc7d5692fb5679ae4a655d3345a61dda15');
const prepared = read(`${A}/prepared.json`);
const originalPath = `${prepared.root}/9p/lessons/${id}/lesson.json`;
const original = read(originalPath);
const sourceExercises = `${prepared.root}/9p/lessons/${id}/exercises.json`;
assert.equal(read(sourceExercises).count, 0);
assert.equal(original.exercise_count, 0);
const drafts = [];
const texts = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const templates = `${work}/adapt/9p/${edition}/lessons/${id}`;
  const carrier = `${prepared.root}/9p/editions/${edition}/lessons/${id}`;
  fs.mkdirSync(templates, { recursive: true });
  fs.mkdirSync(carrier, { recursive: true });
  for (const name of ['lesson', 'exercises', 'figures']) {
    const frozen = `${A}/frozen/${edition}/${name}.template.json`;
    const input = `${templates}/${name}.template.json`;
    const output = `${carrier}/${name}.json`;
    fs.copyFileSync(frozen, input, fs.constants.COPYFILE_EXCL);
    fs.copyFileSync(frozen, output, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(frozen).sha256, bind(input).sha256);
    assert.equal(bind(frozen).sha256, bind(output).sha256);
    drafts.push({ frozen: bind(frozen), operativeTemplate: bind(input), unfinalizedCarrier: bind(output) });
  }
  const lessonPath = `${carrier}/lesson.json`;
  const lesson = read(lessonPath);
  assert.equal(read(`${carrier}/exercises.json`).count, 0);
  texts[locale] = {
    lesson: bind(lessonPath),
    fullModernText: lesson.prose.filter(row => row.kind !== 'fig')
      .map(row => row.text).join('\n\n'),
    blocks: lesson.prose,
  };
}
const nativeContexts = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const output = `${O}/contexts/${locale}/fig-05.native-context.json`;
  execFileSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, `d141-${locale}-fig05-first-context`,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.agents/skills/ld-s10y-image/scripts/build_context.py',
    '--book', '9p', '--edition', edition, '--figure', 'fig-05',
    '--root', prepared.root, '--output', output,
  ], { cwd: repo, stdio: 'inherit' });
  nativeContexts[locale] = bind(output);
}
const context = save(`${O}/fig-05.input-context.json`, {
  batch: 'D141', ticket: 'STEMROBIN-181', book: '9p', lesson: id, figure: 'fig-05',
  role: 'FIRST_SHARED_MODERN_FIGURE_AUTHOR_INPUT',
  nativeContexts, textBindings: texts, originalLesson: bind(originalPath),
  originalExercises: bind(sourceExercises),
  fullText: { zh: texts.zh.fullModernText, en: texts.en.fullModernText,
    originalZh: original.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n') },
  sourceImage: bind(`${prepared.root}/9p/figures/fig-05.png`),
  durableSourceImage: bind('ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-05.png'),
  sourceInventory: 'NOT_AUTHORED: inspect original PNG before spec or rendering.',
  sourceRequirementsFromTextOnly: [
    'One shared F-r frame, not separated panels.',
    'Repulsive positive curve, attractive negative curve and signed net curve.',
    'Net zero at r0, net positive for r<r0 and negative for r>r0.',
    'Far-distance interaction tends to zero without an invented finite cutoff.',
    'Retain the source thick near-equilibrium segment of the net curve.',
    'No invented numerical calibration or named physical force law.',
  ],
  display: { purpose: 'instructional', layout: 'scroll', widths: [640], minTextPx: 16 },
  operativeTemplateWork: work, scratchRoot: prepared.root,
  authoritativeTextRule: 'Use actual complete frozen learner text, not scratch locators as prose.',
  originalTasks: 0, answers: 0, choices: 0, paidCalls: 0,
  sourceFidelityReused: true, sourceReviewsReplayed: false,
  independentTextReview: bind(`${V}/parent-collected.json`),
  textCarrierState: 'Unfinalized scratch draft copied byte-exact from independently approved text.',
  independentFigureApproval: false, promotionAuthorized: false,
  parentImageOpens: 0, maximumAuthorImageOpens: 8, maximumContextImageOpens: 24,
  maximumContentRepairsPerFigure: 1,
});
const freeze = save(`${O}/input-freeze.json`, {
  batch: 'D141', status: 'FIRST_SHARED_FIG05_AUTHOR_INPUT_READY', context, drafts,
  authorFreeze: bind(`${A}/author-freeze.json`), textReviewCollected: bind(`${V}/parent-collected.json`),
  nativeContextCalls: 2, nativeFinalizers: 0, nativeRenders: 0,
  operativeTemplateWork: work, sourceReviewsReplayed: false,
  imagesOpened: 0, originalTasks: 0, paidCalls: 0, completeCoursesAdded: 0,
  canonicalPromotions: 0, independentFigureApproval: false, promotionAuthorized: false,
});
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
meter.currentResume1816.D141 = {
  status: 'FIRST_SHARED_FIG05_AUTHOR_INPUT_READY', inputFreeze: freeze,
  context, figures: ['fig-05'], nativeContextCalls: 2, imagesAuthorized: 8,
  work, root: prepared.root, completeCoursesAdded: 0, canonicalPromotions: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ batch: 'D141', inputFreeze: freeze, context,
  nativeContextCalls: 2, imagesOpened: 0, completeCoursesAdded: 0 }));
