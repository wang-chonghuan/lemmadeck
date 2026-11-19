import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const phase = `${ticket}/tmp/d1817-source314317-review/phase1-observation.json`;
const base = '.tmp/STEMROBIN-181/d1817';
const parent = '5df63b92ec08385d9b934530483c90019e39b62d';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({ path: file, sha256: hash(file) });
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });

assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
assert.equal(hash(phase), '82605a08e69dc23be56204178b2498d8f1f1aac5b1ef9cdee865f2590a4d50c4');
const observed = read(phase);
for (const file of [...observed.initial_snapshots, ...observed.evidence]) {
  assert.equal(hash(file.path), file.sha256, file.path);
}
for (const page of observed.pages) {
  assert.equal(hash(page.source.path), page.source.sha256);
}
const meter = read(`${ticket}/production-meter.json`);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 122);
assert.equal(meter.sourcePagesFinalized, 519);
const previousPush = `${ticket}/evidence/reports/d1816-d040-delivery/actual-push.json`;
assert.equal(read(previousPush).commit, parent);
assert(!fs.existsSync(`${base}/root`), 'Existing D041 work must not be overwritten');
fs.mkdirSync(`${base}/root`, { recursive: true });

const status = git(['status', '--porcelain=v1', '-z', '--untracked-files=all']);
const dirty = status.split('\0').filter(Boolean).map(row => {
  const file = row.slice(3);
  assert(!/^R|^C|^.R|^.C/.test(row), 'Rename status needs explicit preservation handling');
  return { status: row.slice(0, 2), ...bind(file) };
});
const indexes = ['book.json', 'editions/modern-us-neutral/book.json',
  'editions/modern-us-neutral-en/book.json']
  .map(file => bind(`ssot-resources/soviet10year-textbooks/artifacts/10p/${file}`));
const receipt = `${scratch}/d041-entry.json`;
assert(!fs.existsSync(receipt));
fs.writeFileSync(receipt, JSON.stringify({
  batch: 'D041', parent, previousPush: bind(previousPush),
  root: `${base}/root`, phase: bind(phase), observedBindings: observed.evidence,
  sourceBoundaries: observed.usable_object_boundaries, holds: observed.final_holds,
  dirty, indexes, completeDeliveredCards: 122, consumedPages: 519,
  parentNewImageOpens: 0, sourceAgentImageOpens: 8, sourceAgentClosed: true,
  paidCalls: 0, addedCards: 0, canonicalAuthoring: false, databaseWrites: false,
  scope: 'Continue D-group physics only; retain all source/content HOLDs; no formal handoff.',
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ receipt: bind(receipt), dirtyFiles: dirty.length, addedCards: 0 }));
