import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d150-n9-figures-review-input`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(O));
const prepared = read(`${T}/tmp/d1816-d149-n9-figures-author/input-freeze.json`);
const lessonFile = `${prepared.root}/9p/lessons/phy9-c1-s1-n9/lesson.json`;
const lesson = read(lessonFile);
assert.equal(lesson.exercise_count, 0);
fs.mkdirSync(O, { recursive: true });
const source = save(`${O}/source-only.json`, {
  batch: 'D150', role: 'SOURCE_ONLY_BEFORE_CANDIDATE_AND_AUTHOR_RATIONALE',
  book: '9p', lesson: 'phy9-c1-s1-n9',
  figures: prepared.figures.map(id => ({ id,
    sourceImage: bind(`${prepared.root}/9p/figures/${id}.png`) })),
  originalLesson: bind(lessonFile),
  originalText: lesson.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
  originalTasks: 0, answerKeys: [],
  instruction: 'Open both original PNGs first, then save independent source inventory before reading candidates or author rationale',
  sourcePageReviewReplayed: false, fullTextScienceReviewReplayed: false,
});
const languages = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const file = `${T}/tmp/d1816-d147-n9-affected-text/frozen/${edition}/lesson.template.json`;
  const text = read(file);
  languages[locale] = { binding: bind(file),
    fullText: text.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
    visibleFigureLabels: text.prose.filter(row => ['fig', 'cap'].includes(row.kind)) };
}
const visibleText = save(`${O}/visible-text.json`, {
  role: 'CURRENT_APPROVED_BILINGUAL_TEXT_FOR_FIGURE_COMPATIBILITY',
  languages, independentTextReview: prepared.textReview,
  scope: 'First figure compatibility review, not replay of composed SCI/ZH/EN text review',
  figureApproval: false, productAcceptance: false,
});
console.log(JSON.stringify({ sourceOnly: source, visibleText, imagesOpened: 0,
  reviewerDispatched: false }));
