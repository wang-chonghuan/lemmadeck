import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const D = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery';
const file = `${D}/check-d088-n126-offline.mjs`, evidence = `${D}/d088-display-script-derivation.json`;
const before = `${D}/check-d088-n126-offline-first-unexecuted.mjs`;
const bind = p => ({ path: p, sha256: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') });
const record = JSON.parse(fs.readFileSync(evidence));
assert.equal(bind(file).sha256, record.derived.sha256);
assert(!fs.existsSync(`${D}/native/d088-n126-first-offline-dom`));
const rawFile = '.tmp/STEMROBIN-181/d1816-d088/root/9p/lessons/phy9-c2-s6-n126/lesson.json';
assert.equal(JSON.parse(fs.readFileSync(rawFile)).prose.length, 15);
const text = fs.readFileSync(file, 'utf8');
assert.equal(text.split('assert.equal(raw.prose.length, 13);').length, 2);
fs.copyFileSync(file, before, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(file, text.replace('assert.equal(raw.prose.length, 13);', 'assert.equal(raw.prose.length, 15);'));
Object.assign(record, { unexecutedDerivationBefore: bind(before), derived: bind(file),
  fixtureCorrection: '15 source entries including figure/caption; 13 text entries is not the raw entry count',
  authoritativeRaw: bind(rawFile), nativeStagesRerun: false, browserAssertionsChanged: false });
fs.writeFileSync(evidence, JSON.stringify(record, null, 2) + '\n');
console.log(JSON.stringify({ status: 'unexecuted-fixture-corrected', sourceEntries: 15 }));
