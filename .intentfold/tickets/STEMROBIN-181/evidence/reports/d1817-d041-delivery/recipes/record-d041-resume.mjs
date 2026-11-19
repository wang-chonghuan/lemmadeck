import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const group = `${ticket}/tmp/d1817-source318321-review`;
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const parent = '5df63b92ec08385d9b934530483c90019e39b62d';
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), parent);
const entry = read(`${scratch}/d041-entry.json`);
assert.equal(hash(`${scratch}/d041-entry.json`), '9a92c647206cc302cbf9982d42aab8bc82d69efa9098f490d7d751aee9474ba1');
for (const file of entry.dirty) assert.equal(hash(file.path), file.sha256, file.path);
const artifacts = [
  'source0318.freeze.json', 'source0319.freeze.json', 'source0320.freeze.json',
  'source0321.freeze.json', 'source0315.typography.clarification.freeze.json',
  'source0318.typography.clarification.freeze.json', 'source0319.figures.clarification.freeze.json',
  'source0315.body-typography.crop.png', 'source0318.bottom-typography.crop.png',
  'source0319.right-figures.crop.png', 'source0320.formula-typography.crop.png',
].map(file => bind(`${group}/${file}`));
const output = `${scratch}/d041-resumed.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D041', status: 'resumed-by-latest-explicit-human-instruction',
  at: new Date().toISOString(), parent, pauseHistory: bind(`${scratch}/d041-paused.json`),
  entry: bind(`${scratch}/d041-entry.json`), artifacts,
  preservedDirtyFiles: entry.dirty.length,
  interruptedAgent: '01a1f4b4-0d3e-7c51-9f66-7c20da277906',
  firstMissingStage: 'Same agent resumed for exact image accounting and missing frozen phase package; no reopens of passed observations.',
  knownImageOrdinals: [1, 2, 3, 4, 5, 6, 7],
  finalInterruptedImageCount: 'pending retained-context report; crop existence is not evidence of an image open',
  source315: 'Visible body ordinary weight confirmed; only clipped native x1380..1536 suffix strip remains unobserved.',
  source318: 'Focused typography PASS reused.',
  source319: 'fig251 complete SOURCE inventory reused; fig250 r1 arrow direction remains HOLD.',
  deliveredCards: 122, consumedPages: 519, newCompleteCards: 0,
  parentNewImageOpens: 0, paidCalls: 0, databaseWrites: false,
  allowedNext: 'Continue same D-group ticket and branch. About four complete cards per commit/push, then next batch.',
  preservedConstraints: 'No duplicate PASS work, image/cost reset, repurchase, permanent production worker, new branch, shared DB, merge or deployment; finish=review.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ resumed: bind(output), preservedDirtyFiles: entry.dirty.length }));
