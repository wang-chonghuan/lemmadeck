import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d315-10p-source383-385-parent-author`;
const root = '.tmp/STEMROBIN-181/d1816-d315/root';
const work = '.tmp/STEMROBIN-181/d1816-d315/source-work';
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
for (const page of [383, 384, 385])
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${page}`));
execFileSync(process.execPath, [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd315-10p-source383-385-first-prepare',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/production.py', 'prepare-range',
  '--repo', '.', '--book', '10p', '--first', '383', '--last', '385', '--work', work,
], { stdio: 'inherit' });
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  batch: 'D315', role: 'FIRST_PARENT_SOURCE383_385_AUTHOR_ONLY',
  root, work, pages: [383, 384, 385].map(page => ({
    page, printedPage: page - 10,
    original: bind(`${work}/10p/pages/0${page}/page.png`),
    grid: bind(`${work}/10p/pages/0${page}/page.grid.png`),
    layout: bind(`${work}/10p/pages/0${page}/layout.json`),
    template: bind(`${work}/10p/pages/0${page}/page.template.md`),
  })),
  incomingContext: 'SOURCE382 separate author active; no incoming tail fabricated.',
  sourceApproval: false, completeCoursesAdded: 0, parentPriorImageOpens: 16,
  maximumBatchImageOpens: 8, maximumContextImageOpens: 24,
  paidCalls: 0, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(file));
assert.equal(meter.currentResume1816.parentContinuationImageOpens, 16);
assert(!meter.currentResume1816.D315);
meter.currentResume1816.D315 = {
  status: 'FIRST_PARENT_SOURCE383_385_AUTHOR_INPUT_READY', inputFreeze: bind(`${O}/input-freeze.json`),
  root, work, imagesAuthorized: 8, actualParentImageOpens: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, authorClosed: false,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: bind(`${O}/input-freeze.json`), parentImageOpens: 16 }));
