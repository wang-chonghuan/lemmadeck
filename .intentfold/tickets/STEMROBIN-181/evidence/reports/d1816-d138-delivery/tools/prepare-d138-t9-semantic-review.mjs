import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d138-t9-choice-author`;
const O = `${T}/tmp/d1816-d138-t9-semantic-review-input`;
const C = '.tmp/STEMROBIN-181/d1816-d138/root/9p';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const ID = 'phy9-c1-s3-t9';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (name, value) => {
  fs.mkdirSync(O, { recursive: true });
  const file = `${O}/${name}`;
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(O));
assert(fs.existsSync(`${A}/author-freeze.json`));
assert(fs.existsSync(`${A}/answers-author-freeze.json`));
const input = read(`${A}/input-freeze.json`);
const source = read(`${C}/lessons/${ID}/exercises.json`);
const prerequisites = `${R}/lessons/phy9-c1-s2-n17/lesson.json`;
const n17 = read(prerequisites);
const processDefinitions = n17.prose.filter(row =>
  row.text?.includes('容器放到一个盛有热水') || row.text?.includes('缓慢地减小容器'));
assert.equal(processDefinitions.length, 2);
const baseline = read(`${T}/tmp/d1816-d133-t9-text-author/en-translations.json`);
const originals = save('source-only.json', {
  role: 'ORIGINAL_TASKS_AND_DEFINITIONS_ONLY_NO_ANSWERS_OPTIONS_OR_AUTHOR_REASONING',
  source: bind(`${C}/lessons/${ID}/exercises.json`),
  tasks: source.exercises.map(row => ({
    number: row.number, text: row.text, figure_refs: row.figure_refs, figures: row.figures,
  })),
  seed: input.seed,
  definitions: read(`${A}/source-definition-context.json`),
  processDefinitions: {
    source: bind(prerequisites),
    paragraphs: processDefinitions.map(row => ({ text: row.text, source_refs: row.source_refs })),
  },
  originalPngs: input.originalPngs,
});
const languages = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const exercises = read(`${C}/editions/${edition}/lessons/${ID}/exercises.json`);
  const draft = read(`${A}/draft.${locale}.json`);
  languages.push({
    locale,
    questions: draft.questions.map(row => ({ id: row.id, source_numbers: row.source_numbers, view: row.view })),
    currentWrittenQ2: exercises.exercises[1].text,
    q2FigureLabels: exercises.exercises[1].figures,
  });
}
const visible = save('visible-only.json', {
  role: 'VISIBLE_ONLY_READ_AFTER_INDEPENDENT_SOURCE_SOLUTION',
  languages,
  affectedEnglishQ2: {
    sourceText: source.exercises[1].text,
    before: baseline.exercises[1].text,
    after: languages.find(row => row.locale === 'en').currentWrittenQ2,
    scope: 'Sentence order only; graph science reviewed separately, unchanged other five written questions reuse D134.',
  },
});
save('input-freeze.json', {
  batch: 'D138', sourceOnly: originals, visibleOnly: visible,
  authorFreeze: bind(`${A}/author-freeze.json`),
  answersAuthorFreeze: bind(`${A}/answers-author-freeze.json`),
  drafts: ['zh', 'en'].map(locale => ({ locale, file: bind(`${A}/draft.${locale}.json`) })),
  answerKeys: ['modern-us-neutral', 'modern-us-neutral-en'].map(edition =>
    ({ edition, file: bind(`${C}/editions/${edition}/lessons/${ID}/answer-keys.json`) })),
  readOrder: [
    'Source-only.json, seed and actual source/modern images; save independent source solutions.',
    'Visible-only.json; save fidelity/redundancy/leakage and independently enumerate all true option sets.',
    'Only then read author drafts, solutions and standard answers for comparison.',
  ],
  imagesAuthorized: 8, independentReviewerIsAuthor: false,
  parentImagesOpened: 0, paidCalls: 0, canonicalPromotion: false,
});
console.log(JSON.stringify({ batch: 'D138', reviewInput: bind(`${O}/input-freeze.json`) }));
