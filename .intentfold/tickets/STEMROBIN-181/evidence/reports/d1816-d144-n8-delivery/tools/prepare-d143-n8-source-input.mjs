import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d143-n8-figure-review-input`;
const A = `${T}/tmp/d1816-d140-n8-text-author`;
const V = `${T}/tmp/d1816-d140-n8-text-review`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
assert(!fs.existsSync(O));
assert.equal(read(`${V}/parent-collected.json`).reviewerClosed, true);
const prepared = read(`${A}/prepared.json`);
const lessonFile = `${prepared.root}/9p/lessons/phy9-c1-s1-n8/lesson.json`;
const lesson = read(lessonFile);
fs.mkdirSync(O, { recursive: true });
save(`${O}/source-only.json`, {
  batch: 'D143', role: 'SOURCE_ONLY_BEFORE_CANDIDATE_AND_AUTHOR_RATIONALE',
  book: '9p', lesson: 'phy9-c1-s1-n8', figure: 'fig-05',
  sourceImage: bind(`${prepared.root}/9p/figures/fig-05.png`),
  sourceLesson: bind(lessonFile),
  originalText: lesson.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
  originalTasks: 0, answerKeys: [],
  instruction: 'Open the original PNG first, then save an independent complete source inventory before any candidate or author rationale read.',
  sourcePageReviewReplayed: false, fullTextScienceReviewReplayed: false,
});
const languages = {};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const file = `${A}/frozen/${edition}/lesson.template.json`;
  const text = read(file);
  languages[locale] = { binding: bind(file),
    fullText: text.prose.filter(row => row.kind !== 'fig').map(row => row.text).join('\n\n'),
    visibleFigureLabels: text.prose.filter(row => ['fig', 'cap'].includes(row.kind)),
  };
}
save(`${O}/visible-text.json`, {
  role: 'CURRENT_APPROVED_BILINGUAL_TEXT_FOR_FIGURE_COMPATIBILITY',
  languages, independentTextReview: bind(`${V}/parent-collected.json`),
  scope: 'Figure compatibility with the complete approved text; not a replay of the passed SCI/ZH/EN text review.',
  figureApproval: false, productAcceptance: false,
});
console.log(JSON.stringify({ sourceOnly: bind(`${O}/source-only.json`),
  languages: bind(`${O}/visible-text.json`), imageOpens: 0, reviewerDispatched: false }));
