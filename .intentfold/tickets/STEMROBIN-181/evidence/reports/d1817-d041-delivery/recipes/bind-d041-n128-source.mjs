import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { verifyPhaseEvidence } from './source-evidence.mjs';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source334337-review/phase1-observation.json';
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/n128-root/10p';
const id = 'phy10-c3-s3-n128';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(hash(phasePath), '4d7e63c7285e9cba76cd050cec7e017649ff90919cd457acb356743f8c9d5d3b');
const phase = read(phasePath);
verifyPhaseEvidence(phase);
const blocks = new Map();
const bindings = [bind(phasePath)];
for (const page of phase.pages.filter(page => page.physical_page >= 335)) {
  const number = String(page.physical_page).padStart(4, '0');
  const pagePath = `${root}/pages/${number}/page.json`;
  const candidate = read(pagePath);
  assert.equal(candidate.meta.render.sha256, page.source.sha256);
  assert.equal(candidate.meta.printed_lines, page.line_accounting.unique_physical_lines);
  assert.deepEqual(read(`${root}/pages/${number}/audit.json`).errors, []);
  for (const [index, block] of page.blocks.entries()) {
    assert.deepEqual(candidate.blocks[index].lines.map(line => line.replaceAll('**', '')), block.lines);
    blocks.set(block.id, block);
  }
  bindings.push(bind(pagePath), bind(`${root}/pages/${number}/audit.json`));
}
const start = blocks.get('p0335#6'), next = blocks.get('p0337#5');
assert.equal(start.kind, 'h3');
assert.match(start.lines.join(''), /^128\./);
assert.equal(next.kind, 'h3');
assert.match(next.lines.join(''), /^129\./);
const sourcePath = `${root}/lessons/${id}/lesson.json`;
const lesson = read(sourcePath);
const refs = [['p0335#7'], ['p0336#1'], ['p0336#2'], ['p0336#3', 'p0337#1'],
  ['p0337#2'], ['p0337#3'], ['p0337#4']];
assert.equal(lesson.id, id);
assert.equal(lesson.prose.length, refs.length);
assert.equal(lesson.exercise_count, 0);
assert.equal(lesson.figures.length, 0);
assert.equal(read(`${root}/lessons/${id}/exercises.json`).count, 0);
for (const [index, group] of refs.entries()) {
  assert.deepEqual(lesson.prose[index].source_refs, group);
  assert.equal(lesson.prose[index].text.replaceAll('**', ''),
    group.flatMap(ref => blocks.get(ref).lines).join(''));
  assert(group.every(ref => blocks.get(ref).kind === 'p'));
  assert.equal(blocks.get(group[0]).flags.cont, false);
  assert.equal(blocks.get(group.at(-1)).flags.open, false);
}
assert.equal(blocks.get('p0336#3').flags.open, true);
assert.equal(blocks.get('p0337#1').flags.cont, true);
bindings.push(bind(sourcePath), bind(`${root}/lessons/${id}/lesson.md`),
  bind(`${root}/lessons/${id}/exercises.json`));
const file = `${scratch}/d041-n128-source-pass.json`;
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', id, status: 'PASS-complete-object', sourceRefs: refs, bindings,
  actualStart: { block: start.id, text: start.lines.join('') },
  actualRightBoundary: { lastBlock: 'p0337#4', nextBlock: next.id, nextHeading: next.lines.join('') },
  sourceScope: 'Only seven complete n128 prose objects. Adjacent unit127/129 and source figure262/263 are not approved by this object binding.',
  figures: 0, originalWrittenQuestions: 0, modernApproval: false,
  parentNewImageOpens: 0, paidCalls: 0, addedDeliveredCards: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ sourcePass: bind(file), id, modernApproval: false }));
