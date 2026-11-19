import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery';
const root = '.tmp/STEMROBIN-181/d1816/root';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const unchangedIds = ['phy10-c2-s6-n118', 'phy10-c2-s6-t9'];
const before = unchangedIds.flatMap(id => ['lesson.json', 'lesson.md', 'exercises.json'].map(name => ({
  path: `${root}/10p/lessons/${id}/${name}`,
  sha256: hash(`${root}/10p/lessons/${id}/${name}`),
})));
const bindings = [];
for (const page of [310, 311]) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const suffix = `pages/${String(page).padStart(4, '0')}/${name}`;
    const input = `${canonical}/${suffix}`;
    const target = `${root}/10p/${suffix}`;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    assert(!fs.existsSync(target));
    fs.copyFileSync(input, target, fs.constants.COPYFILE_EXCL);
    bindings.push({ input, target, sha256: hash(input) });
  }
}
execFileSync('node', [`${scratch}/run-native.mjs`, 'd040-source310311-boundary-assembly',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'assemble', '--book', '10p', '--root', root, '--work', '.tmp/ld-s10y-lesson',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json'], { stdio: 'inherit' });
const comparisons = before.map(row => ({ ...row, after: hash(row.path), unchanged: hash(row.path) === row.sha256 }));
const output = `${scratch}/d040-boundary-assembly.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  batch: 'D040', root, bindings, comparisons,
  boundary: 'Actual310 new chapter closes exercise12; actual311 chapter header closes introduction. Independent final phase1 still pending.',
  exercise12TypographyHold: true, numbered119StillIncomplete: true,
  sourceApproval: false, addedCards: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
assert(comparisons.every(row => row.unchanged), 'Appending boundary changed earlier source objects; inspect affected changes before using them');
console.log(JSON.stringify({ root, boundaryAdded: true, previousObjectsByteIdentical: true, addedCards: 0 }));
