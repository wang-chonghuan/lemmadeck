import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const source = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const output = `${ticket}/tmp/d1816-recovery/recovery.json`;
assert(!fs.existsSync(output));
const readOld = file => JSON.parse(fs.readFileSync(path.join(source, file)));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const copied = [];
const files = new Map();
const include = (file, expected) => {
  assert(!path.isAbsolute(file) && !file.split('/').includes('..'));
  const bytes = fs.readFileSync(path.join(source, file));
  const sha256 = hash(bytes);
  if (expected) assert.equal(sha256, expected, file);
  if (files.has(file)) assert.equal(files.get(file).sha256, sha256);
  files.set(file, { bytes, sha256 });
};
const directory = dir => {
  for (const entry of fs.readdirSync(path.join(source, dir), { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    assert(!entry.isSymbolicLink(), file);
    if (entry.isDirectory()) directory(file);
    else include(file);
  }
};
const pauseFile = `${scratch}/d042-pause-20261119.json`;
const pause = readOld(pauseFile);
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), pause.head);
include(pauseFile);
include(`${ticket}/production-meter.json`);
include(`${scratch}/d042-isotopes-first-modern-author.json`);
include(`${scratch}/d042-n133-sentence-layout.json`);
include(`${scratch}/d042-n133-zh-title-first-failed.template.json`);
for (const state of pause.currentStates.filter(state => /n(132|133)$/.test(state.id))) {
  include(state.sourceState.path, state.sourceState.sha256);
  const original = readOld(state.sourceState.path);
  for (const binding of original.bindings) {
    include(binding.path, binding.sha256);
    if (/\/pages\/\d+\/page\.json$/.test(binding.path)) include(binding.path.replace(/page\.json$/, 'page.md'));
  }
  const root = '.tmp/STEMROBIN-181/d1818/isotope-root/10p';
  directory(`${root}/lessons/${state.id}`);
  for (const candidate of state.modernCandidates) {
    directory(path.dirname(candidate.template.path));
    directory(`${root}/editions/${candidate.edition}/lessons/${state.id}`);
    for (const binding of [candidate.template, ...candidate.outputs]) include(binding.path, binding.sha256);
  }
}
const author = readOld(`${scratch}/d042-isotopes-first-modern-author.json`);
for (const binding of author.primary) {
  include(binding.path, binding.sha256);
  const context = readOld(binding.path);
  for (const item of context.sources || [context]) {
    for (const key of ['stdout', 'receipt']) {
      if (item[key]) include(item[key].path, item[key].sha256);
    }
  }
}
for (const receipt of pause.nativeReceipts.filter(row => /n132|n133/.test(row.path))) {
  include(receipt.path, receipt.sha256);
  directory(path.dirname(receipt.path));
}
for (const record of author.records) include(record.outline.path, record.outline.sha256);
for (const [file, row] of files) {
  const target = path.join(repo, file);
  if (fs.existsSync(target)) {
    if (file !== `${ticket}/production-meter.json`) assert.equal(hash(fs.readFileSync(target)), row.sha256, file);
    else fs.writeFileSync(target, row.bytes);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, row.bytes, { flag: 'wx' });
  }
  assert.equal(hash(fs.readFileSync(path.join(source, file))), row.sha256, `Source changed: ${file}`);
  copied.push({ path: file, sha256: row.sha256, bytes: row.bytes.length });
}
for (const item of [
  ['app/node_modules', '/Users/yong/work/lemmadeck-ws/lemmadeck/app/node_modules'],
  ['.claude/skills/ld-s10y-lesson/node_modules', '/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/node_modules'],
  ['.claude/skills/ld-s10y-lesson/.venv', '/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv'],
]) {
  assert(fs.existsSync(item[1]));
  if (!fs.existsSync(item[0])) fs.symlinkSync(item[1], item[0]);
}
fs.writeFileSync(output, JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D042', source, workspace: repo,
  head: pause.head, recordedAt: new Date().toISOString(),
  scope: 'Only n132/n133 necessary source, candidates, evidence and existing meter.',
  copied, files: copied.length, bytes: copied.reduce((sum, row) => sum + row.bytes, 0),
  sourceWrites: false, wholeDirtyTreeRecovered: false, paidCalls: 0,
  oldHoldsCleared: [], deliveredCardsAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ recovery: output, files: copied.length, bytes: copied.reduce((sum, row) => sum + row.bytes, 0), sourceWrites: false }));
