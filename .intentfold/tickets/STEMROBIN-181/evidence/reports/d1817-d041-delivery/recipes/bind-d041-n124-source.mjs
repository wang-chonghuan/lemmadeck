import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const phasePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1817-source322325-review/phase1-observation.json';
const root = '.tmp/STEMROBIN-181/d1817/root/10p';
const id = 'phy10-c3-s2-n124';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
assert.equal(hash(phasePath), '3723ba6d76b3aae8b945657564eff8d320e18529a65ff4b2a39fdefcbf33943f');
const phase = read(phasePath);
for (const file of [...phase.initial_snapshots, ...phase.evidence]) {
  assert.equal(hash(file.path), file.sha256);
}
const refs = ['p0323#6', 'p0323#7', 'p0324#1', 'p0324#2', 'p0324#3', 'p0324#6'];
const sourceFile = `${root}/lessons/${id}/lesson.json`;
const lesson = read(sourceFile);
assert.equal(lesson.id, id);
assert.equal(lesson.prose.length, refs.length);
assert.equal(lesson.exercise_count, 0);
assert.equal(read(`${root}/lessons/${id}/exercises.json`).count, 0);
const bindings = [bind(phasePath), bind(sourceFile),
  bind(`${root}/lessons/${id}/lesson.md`), bind(`${root}/lessons/${id}/exercises.json`)];
const pages = new Map();
for (const number of [323, 324]) {
  const observed = phase.pages.find(page => page.physical_page === number);
  const file = `${root}/pages/${String(number).padStart(4, '0')}/page.json`;
  const candidate = read(file);
  assert.equal(candidate.meta.render.sha256, observed.source.sha256);
  assert.equal(candidate.meta.printed_lines, observed.line_accounting.unique_physical_lines);
  const receipt = `${scratch}/native/d041-source${number}-first-finalize/receipt.json`;
  assert.equal(read(receipt).exitCode, 0);
  pages.set(number, { observed, candidate });
  bindings.push(bind(file), bind(`${root}/pages/${String(number).padStart(4, '0')}/audit.json`),
    bind(receipt));
}
for (const [index, ref] of refs.entries()) {
  const number = Number(ref.slice(1, 5));
  const { observed, candidate } = pages.get(number);
  const sourceBlock = observed.blocks.find(block => block.id === ref);
  const candidateBlock = candidate.blocks[Number(ref.split('#')[1]) - 1];
  assert.equal(sourceBlock.kind, 'p');
  assert.equal(candidateBlock.kind, 'p');
  assert(!(sourceBlock.heavy_spans_certain || []).length);
  assert(!(sourceBlock.under_dot_spans_certain || []).length);
  assert.deepEqual(candidateBlock.lines, sourceBlock.lines);
  if (sourceBlock.flags.footnote) assert.equal(candidateBlock.label, 'footnote');
  assert.deepEqual(lesson.prose[index].source_refs, [ref]);
  assert.equal(lesson.prose[index].text, sourceBlock.lines.join(''));
}
const start = pages.get(323).observed.boundaries.find(row => row.type === 'numbered_start' && row.number === 124);
const end = pages.get(324).observed.boundaries.find(row => row.type === 'numbered_end' && row.number === 124);
assert.equal(start.block, 'p0323#5');
assert.equal(end.block, 'p0324#3');
assert.equal(end.footnote, 'p0324#6');
const neighborHolds = phase.pages.flatMap(page => (page.holds || []).map(hold => ({
  page: page.physical_page, ...hold,
})));
for (const hold of neighborHolds) assert(!refs.includes(hold.scope?.block));
assert(neighborHolds.some(hold => hold.id === '323-frequency-glyph-nu-v'));
const output = `${scratch}/d041-n124-source-pass.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', id, status: 'PASS-complete-object', sourceRefs: refs,
  actualStart: start, actualRightBoundary: end, bindings, neighborHolds,
  sourceScope: 'Only the six unit124 prose objects. No whole-page323 or adjacent unit123 formula approval.',
  prefixAndOpenCardsExcluded: ['x1', 'phy10-c3-s2-n123', 'phy10-c3-s2-n125'],
  figures: 0, originalWrittenQuestions: 0, modernApproval: false,
  addedDeliveredCards: 0, parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ sourcePass: bind(output), sourceRefs: refs, modernReviewPending: true }));
