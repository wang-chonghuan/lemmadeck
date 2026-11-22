import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const out = path.dirname(fileURLToPath(import.meta.url));
const read = name => JSON.parse(fs.readFileSync(path.join(out, name), 'utf8'));
const prior = read('intake.json');
assert.equal(prior.files.length, 4);
assert.equal(prior.figures.length, 4);
assert.equal(prior.nativeFinalizerReused.exitCode, 0);
assert(prior.firstFailure.message.includes('42 !== 50'));
const lesson = JSON.parse(fs.readFileSync(prior.files[0].canonical.path, 'utf8'));
const require = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/package.json'));
const { proseOutline, proseFlow } = require(path.join(root,
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const outline = proseOutline(lesson.prose);
const flow = proseFlow(lesson.prose, lesson.section_breaks);
assert.equal(outline.length, 42);
assert.equal(flow.length, 50);
assert.equal(flow.filter(block => block.kind === 'p').length, 42);
assert.equal(flow.filter(block => block.kind === 'fig').length, 4);
assert.equal(flow.filter(block => block.kind === 'cap').length, 4);
const boundaries = lesson.section_breaks.map((pair, number) => {
  const matches = outline.filter((p, i) => i > 0
    && outline[i - 1].text === pair.before && p.text === pair.after);
  assert.equal(matches.length, 1, `boundary ${number}`);
  return { number, beforeIndex: matches[0].index - 1, afterIndex: matches[0].index, ...pair };
});
assert.equal(boundaries.length, 5);
const targets = {
  outline, affectedBlocks: prior.affectedBlocks, boundaries,
  html: prior.textHTML, canonicalLesson: prior.files[0].canonical,
  paragraphCount: 42, proseFlowItemCount: 50,
  countClarification: '50 proseFlow items = 42 actual prose paragraphs + 4 figures + 4 captions; not 50 p.para nodes.',
  metadataPASSReused: { intake: path.join(out, 'intake.json'),
    sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(out, 'intake.json'))).digest('hex'),
    canonicalExactFiles: 4, figureTransfers: 4, finalizerExitCode: 0 },
  recovery: 'Only failed paragraph-count/mapping preparation; no figure or canonical binding checks replayed.',
};
fs.writeFileSync(path.join(out, 'targets.json'), JSON.stringify(targets, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(targets, null, 2));
