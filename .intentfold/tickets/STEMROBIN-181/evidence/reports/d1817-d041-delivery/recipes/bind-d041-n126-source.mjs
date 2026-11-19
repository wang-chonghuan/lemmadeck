import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { verifyPhaseEvidence } from './source-evidence.mjs';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const expectedPhaseHash = process.argv[2];
assert(/^[0-9a-f]{64}$/.test(expectedPhaseHash || ''));
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source330333-review/phase1-observation.json';
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1817/nuclear-root/10p';
const id = 'phy10-c3-s3-n126';
const read = file => JSON.parse(fs.readFileSync(file));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(hash(phasePath), expectedPhaseHash);
const phase = read(phasePath);
verifyPhaseEvidence(phase);
const observed = phase.pages.find(page => page.physical_page === 330);
assert.equal(hash(observed.source.path), observed.source.sha256);
const pagePath = `${root}/pages/0330/page.json`;
const candidate = read(pagePath);
assert.equal(candidate.meta.render.sha256, observed.source.sha256);
assert.equal(candidate.meta.printed_lines, observed.line_accounting.unique_physical_lines);
assert.deepEqual(read(`${root}/pages/0330/audit.json`).errors, []);
const start = observed.blocks.find(block => block.id === 'p0330#2');
const next = observed.blocks.find(block => block.id === 'p0330#6');
assert.equal(start.kind, 'h3');
assert.match(start.lines.join(''), /^126\./);
assert.equal(next.kind, 'h3');
assert.match(next.lines.join(''), /^127\./);
const sourcePath = `${root}/lessons/${id}/lesson.json`;
const lesson = read(sourcePath);
const refs = ['p0330#3', 'p0330#4', 'p0330#5'];
assert.equal(lesson.id, id);
assert.equal(lesson.prose.length, refs.length);
assert.equal(lesson.exercise_count, 0);
assert.equal(lesson.figures.length, 0);
assert.equal(read(`${root}/lessons/${id}/exercises.json`).count, 0);
for (const [index, ref] of refs.entries()) {
  const sourceBlock = observed.blocks.find(block => block.id === ref);
  const candidateBlock = candidate.blocks[Number(ref.split('#')[1]) - 1];
  assert.equal(sourceBlock.kind, 'p');
  assert.equal(sourceBlock.flags.open, false);
  assert.deepEqual(candidateBlock.lines.map(line => line.replaceAll('**', '')), sourceBlock.lines);
  assert.deepEqual(lesson.prose[index].source_refs, [ref]);
  assert.equal(lesson.prose[index].text.replaceAll('**', ''), sourceBlock.lines.join(''));
}
const bindings = [bind(phasePath), bind(pagePath), bind(`${root}/pages/0330/audit.json`),
  bind(sourcePath), bind(`${root}/lessons/${id}/lesson.md`), bind(`${root}/lessons/${id}/exercises.json`)];
const file = `${scratch}/d041-n126-source-pass.json`;
assert(!fs.existsSync(file));
fs.writeFileSync(file, JSON.stringify({
  batch: 'D041', id, status: 'PASS-complete-object', sourceRefs: refs, bindings,
  actualStart: { block: start.id, text: start.lines.join('') },
  actualRightBoundary: { lastBlock: refs.at(-1), nextBlock: next.id, nextHeading: next.lines.join('') },
  sourceScope: 'Only three complete unit126 prose blocks on330; following unit127, figures and other pages are not approved by this binding.',
  figures: 0, originalWrittenQuestions: 0, modernApproval: false,
  addedDeliveredCards: 0, parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ sourcePass: bind(file), id, modernReviewPending: true }));
