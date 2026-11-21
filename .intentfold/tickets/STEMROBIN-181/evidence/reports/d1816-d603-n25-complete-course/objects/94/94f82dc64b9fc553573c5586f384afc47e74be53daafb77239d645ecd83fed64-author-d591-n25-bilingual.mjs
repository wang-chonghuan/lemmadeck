import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const require = createRequire(`${repo}/app/package.json`);
const { proseFlow, proseOutline } = require(`${repo}/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js`);
const id = 'phy10-c1-s3-n25';
const work = '.tmp/STEMROBIN-181/d1816-d590/work';
const output = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d591-n25-bilingual-author';
const texts = JSON.parse(fs.readFileSync('.intentfold/tickets/STEMROBIN-181/tmp/d1816-d590-n25-first-source/texts.json', 'utf8'));
const bindings = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const prepared = `${work}/adapt/10p/${edition}/lessons/${id}`;
  const directory = `${output}/${locale}`;
  fs.mkdirSync(directory, { recursive: true });
  for (const file of ['lesson', 'exercises', 'figures']) {
    const document = JSON.parse(fs.readFileSync(`${prepared}/${file}.template.json`, 'utf8'));
    if (file === 'lesson') {
      document.locale = locale;
      if (locale === 'en') {
        document.title = 'Inductance in an AC Circuit';
        document.printed_title = '25. Inductance in an AC Circuit';
      }
      for (const [index, block] of document.prose.entries()) {
        if (block.kind === 'p') {
          assert(texts[locale][index], `Missing author text ${locale}/${index}`);
          block.text = texts[locale][index];
          block.changes = locale === 'en' ? ['translation', 'layout', 'clarification'] : ['layout', 'clarification'];
        } else if (locale === 'en' && block.kind === 'cap') {
          block.text = block.source_text.replace('图 ', 'Figure ');
          block.changes = ['translation'];
        }
      }
      const outline = proseOutline(document.prose);
      const transitions = [6, 9, 13, 18, 22];
      document.section_breaks = transitions.map(index => {
        const row = outline.findIndex(item => item.blockIndex === index);
        assert(row > 0, `Missing boundary block ${index}`);
        return { before: outline[row - 1].text, after: outline[row].text };
      });
      assert(proseFlow(document.prose, document.section_breaks).length > 0);
    }
    const target = `${directory}/${file}.template.json`;
    fs.writeFileSync(target, JSON.stringify(document, null, 2) + '\n', { flag: 'wx' });
    bindings.push({ path: target, sha256: crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex') });
  }
}
fs.writeFileSync(`${output}/author-freeze.json`, JSON.stringify({
  lesson: id, status: 'first-bilingual-text-authored-unreviewed', bindings,
  originalWrittenTasks: 0, newStandards: 0, choices: 0, sourceGlyphHoldsPreserved: true,
  mathematicalFormulaValuesUnchanged: true, sourceAlphabetIdentityAdjudicated: false,
  modernFiguresPending: ['fig-40', 'fig-41', 'fig-42'], databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ out: output, originalWrittenTasks: 0, independentReview: 'pending', figures: 'pending' }));
