import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const file = '.tmp/STEMROBIN-181/d1817/author-work/adapt/10p/modern-us-neutral-en/lessons/phy10-c3-s3-n128/lesson.template.json';
const history = `${scratch}/d041-n128-en-number-boundary-first-candidate`;
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(read(`${scratch}/native/d041-n128-en-first-finalize/receipt.json`).exitCode, 2);
fs.mkdirSync(history, { recursive: true });
fs.copyFileSync(file, `${history}/lesson.template.json`, fs.constants.COPYFILE_EXCL);
const audit = '.tmp/STEMROBIN-181/d1817/n128-root/10p/editions/modern-us-neutral-en/lessons/phy10-c3-s3-n128/adaptation.audit.json';
if (fs.existsSync(audit)) fs.copyFileSync(audit, `${history}/adaptation.audit.json`, fs.constants.COPYFILE_EXCL);
const document = read(file);
assert(document.prose[5].text.includes('Radium has atomic number 88.'));
document.prose[5].text = document.prose[5].text.replace('Radium has atomic number 88.',
  'Radium has atomic number 88 in the periodic table.');
document.section_breaks = [];
fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');
const label = 'd041-n128-en-number-boundary-affected-outline';
execFileSync('node', [`${scratch}/run-native.mjs`, label, 'node',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', file], { stdio: 'inherit' });
const outline = read(`${scratch}/native/${label}/stdout.txt`);
document.section_breaks = ['Becquerel asked', 'Researchers then', 'A periodic-table entry'].map(prefix => {
  const matches = outline.paragraphs.filter(row => row.text.startsWith(prefix));
  assert.equal(matches.length, 1);
  const after = matches[0];
  const before = outline.paragraphs.find(row => row.index === after.index - 1);
  assert(before);
  return { before: before.text, after: after.text };
});
fs.writeFileSync(file, JSON.stringify(document, null, 2) + '\n');
const output = `${scratch}/d041-n128-en-number-boundary-recovery.json`;
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id: 'phy10-c3-s3-n128', affected: 'English prose[5] and its text-bound section boundary',
  error: "Nonformula numeric signature want=['226','88'], got=['226']",
  diagnosis: 'The numeric tokenizer excludes an integer immediately before a sentence stop; the author text already contained88.',
  before: bind(`${history}/lesson.template.json`), after: bind(file),
  correction: 'Move88 away from the sentence-ending period by adding the same periodic-table context.',
  numericChanges: [], scientificContentChanged: false, sourceUnchanged: true,
  chinesePASSNotRepeated: true, contentReviewsNotYetRun: true, parentNewImageOpens: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ recovery: bind(output) }));
