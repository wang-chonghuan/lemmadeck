import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const folder = `${work}/9p-ex7-answer-capture`;
const read = async p => JSON.parse(await fs.readFile(p, 'utf8'));
const bind = async path => ({
  path, sha256: crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex'),
});
const freeze = await read(`${folder}/author-freeze.json`);
const payload = await read(freeze.bindings.append_payload.path);
for (const name of ['append_payload', 'source', 'prior_durable_answers', 'current_source_exercises', 'toc']) {
  const value = freeze.bindings[name];
  assert.deepEqual(await bind(value.path), { path: value.path, sha256: value.sha256 });
}
const snippet = freeze.snippets.find(s => s.group === '练习 7');
assert.deepEqual(await bind(snippet.file.path), snippet.file);
const originalCropCheck = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '-c', 'import sys;from PIL import Image; a=Image.open(sys.argv[1]).convert("RGB");b=Image.open(sys.argv[2]).convert("RGB");x,y,w,h=map(int,sys.argv[3:]);assert a.crop((x,y,x+w,y+h)).tobytes()==b.tobytes();print("Exact original exercise7 pixels confirmed")',
  freeze.bindings.source.path, snippet.file.path, ...snippet.box_xywh.map(String),
], { encoding: 'utf8' });
const raw = [
  '$\\approx2.8\\times10^{-10}$ 米.',
  '$\\approx1884$ 牛顿.',
  '$\\approx3.53\\times10^8$ 牛顿/米$^2$.',
  '$\\approx4200$ 米.',
  '$\\approx2\\times10^{11}$ 牛顿/米$^2$.',
  '$\\approx345$ 米/秒.',
  '$\\approx0.33$ 千克.',
  '$0^\\circ\\mathrm{C}$.',
];
assert.deepEqual(payload.answers.map(a => a.exercise), [4, 5, 6, 7, 8, 9, 10, 11]);
assert.deepEqual(payload.answers.map(a => a.raw), raw);
assert.ok(payload.answers.every(a => a.lesson === 'phy9-c1-s6-t8' && a.pdfPage === 337 && a.printedPage === 328));
const gatePath = `${work}/answer-review-9p-ex7-capture.json`;
await fs.writeFile(gatePath, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass',
  reviewKind: 'unique-independent-initial-capture-gate-exercise7-only',
  authorFreeze: await bind(`${folder}/author-freeze.json`), payload: await bind(freeze.bindings.append_payload.path),
  source: freeze.bindings.source, snippet, actualOriginalSnippetOpened: true,
  exactOriginalCropCheck: originalCropCheck,
  entries: payload.answers.map(a => ({ ...a, status: 'source-faithful-pass' })),
  scope: 'All eight printed entries4-11, units, exponents, period and lesson identity. No invented answers1-3. Formula6 exponent8 and entry10 .33kg faithfully preserved, not scientifically accepted. Full338 diagnostic image had no target; no entries338 used.',
  excluded: 'No repeat review of prior answers1-6; exercise8 candidate not gated or promoted.',
}, null, 2) + '\n', { flag: 'wx' });
const durablePath = freeze.bindings.prior_durable_answers.path;
const prior = await read(durablePath);
const original = JSON.parse(JSON.stringify(prior.answers));
assert.equal(prior.answers.length, 33);
for (const entry of payload.answers) assert(!prior.answers.some(a => a.lesson === entry.lesson && a.exercise === entry.exercise));
prior.answers.push(...payload.answers);
prior.count = prior.answers.length;
await fs.writeFile(durablePath, JSON.stringify(prior, null, 2) + '\n');
const command = ['.claude/skills/ld-s10y-answer/tools/answers.py', 'finalize', '--book', '9p'];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
const final = await read(durablePath);
assert.equal(final.status, 'captured');
assert.equal(final.count, 41);
assert.deepEqual(final.answers.filter(a => a.lesson !== 'phy9-c1-s6-t8'), original);
await fs.writeFile(`${work}/answer-review-9p-ex7-capture-promotion.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', initialGate: await bind(gatePath),
  nativeFinalization: { command, output }, durable: await bind(durablePath),
  previous33AnswersUnchanged: true, newSourceFaithfulEntries: 8,
  noExercise8PromotionOrAnswerMathApproval: true,
}, null, 2) + '\n', { flag: 'wx' });
