import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const T = '.intentfold/tickets/STEMROBIN-181';
const name = process.argv[2];
assert(['n44', 'n51'].includes(name));
const stage = name === 'n44' ? 'd256' : 'd257';
const id = name === 'n44' ? 'phy9-c1-s5-n44' : 'phy9-c1-s6-n51';
const file = `.tmp/STEMROBIN-181/d1816-${stage}/work/adapt/9p/modern-us-neutral-en/lessons/${id}/lesson.template.json`;
const raw = JSON.parse(fs.readFileSync(`ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/${id}/lesson.json`));
const before = JSON.parse(fs.readFileSync(file));
const after = structuredClone(before);
after.chapter = raw.chapter;
after.printed_title = raw.printed_title;
assert.deepEqual(after.prose, before.prose);
assert.deepEqual(after.section_breaks, before.section_breaks);
assert.deepEqual(after.source, before.source);
assert.equal(after.title, before.title);
const bind = file => ({ path: file,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const original = bind(file);
const O = `${T}/tmp/d1816-d259-${name}-native`;
fs.mkdirSync(O, { recursive: true });
const backup = `${O}/en-before-identity-repair.template.json`;
fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(file, JSON.stringify(after, null, 2) + '\n');
fs.writeFileSync(`${O}/identity-recovery.json`, JSON.stringify({
  name, original, backup: bind(backup), current: bind(file),
  changedFields: ['chapter', 'printed_title'],
  old: { chapter: before.chapter, printed_title: before.printed_title },
  restored: { chapter: after.chapter, printed_title: after.printed_title },
  proseChanged: false, sourceChanged: false, sectionBreaksChanged: false,
  englishDisplayTitleChanged: false,
  proof: 'Native identity fields restored from raw lesson; English title, all prose ' +
    'and formulas, section boundaries, and embedded source are byte-identical.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('PASS: native identity restored, reviewed English prose unchanged');
