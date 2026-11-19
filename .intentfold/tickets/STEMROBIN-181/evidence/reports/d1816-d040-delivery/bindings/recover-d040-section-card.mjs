import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1816/root';
const book = `${root}/10p`;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const first = read(`${scratch}/d040-boundary-assembly.json`);
const preserved = [];
for (const suffix of ['book.json', ...['lesson.json', 'lesson.md', 'exercises.json']
  .map(name => `lessons/phy10-c2-s6-t9/${name}`)]) {
  const input = `${book}/${suffix}`;
  const output = `${scratch}/d040-section-card-first-failure/${suffix}`;
  assert(!fs.existsSync(output));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
  preserved.push({ input, output, sha256: hash(output) });
}
assert.equal(read(`${scratch}/native/d040-section-card-focused-contract-tests/receipt.json`).exitCode, 0);
execFileSync('node', [`${scratch}/run-native.mjs`, 'd040-independent-h2-card-assembly-recovery',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'assemble', '--book', '10p', '--root', root, '--work', '.tmp/ld-s10y-lesson',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'], { stdio: 'inherit' });
for (const row of first.comparisons) {
  assert.equal(hash(row.path), row.sha256, `Prior object was not restored exactly: ${row.path}`);
}
const intro = read(`${book}/lessons/phy10-c3-s1/lesson.json`);
const exercises = read(`${book}/lessons/phy10-c3-s1/exercises.json`);
assert.equal(intro.prose.length, 3);
assert.equal(exercises.count, 0);
assert(intro.prose.every(row => row.source_refs.every(ref => /^p0310#/.test(ref))));
assert.equal(read(`${book}/lessons/phy10-c2-s6-t9/lesson.json`).prose.length, 0);
const output = `${scratch}/d040-section-card-recovery.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D040', preserved, native: `${scratch}/native/d040-independent-h2-card-assembly-recovery/receipt.json`,
  tool: '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  test: '.claude/skills/ld-s10y-lesson/tools/test_section_cards.py',
  scope: 'TOC-matched independent unnumbered h2 sections open their own card; page/body facts stay untouched.',
  previousN118AndExercise12ByteIdenticalToBeforeBoundary: true, introProse: 3, introExercises: 0,
  rawApproval: false, source309TypographyHold: true, numbered119Incomplete: true,
  sourcePagesAdded: 0, addedCards: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, priorObjectsRestoredExactly: true, introduction: 'phy10-c3-s1', addedCards: 0 }));
