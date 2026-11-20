import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d310-10p-source380-382-author`;
const root = '.tmp/STEMROBIN-181/d1816-d310/root';
const work = '.tmp/STEMROBIN-181/d1816-d310/source-work';
const pages = [380, 381, 382];
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
for (const page of pages)
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/10p/pages/${page}`));
execFileSync(process.execPath, [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd310-10p-source380-382-first-prepare',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/production.py',
  'prepare-range', '--repo', '.', '--book', '10p',
  '--first', '380', '--last', '382', '--work', work,
], { stdio: 'inherit' });
const input = {
  batch: 'D310', ticket: 'STEMROBIN-181', book: '10p',
  role: 'FIRST_SOURCE380_382_AUTHOR_ONLY_NO_NATIVE_SUBPROCESS',
  root, work,
  pages: pages.map(page => ({
    page, printedPage: page - 10,
    original: bind(`${work}/10p/pages/0${page}/page.png`),
    grid: bind(`${work}/10p/pages/0${page}/page.grid.png`),
    layout: bind(`${work}/10p/pages/0${page}/layout.json`),
    template: bind(`${work}/10p/pages/0${page}/page.template.md`),
  })),
  preparation: bind(`${T}/tmp/d1816-recovery/native/d310-10p-source380-382-first-prepare/receipt.json`),
  toc: bind('ssot-resources/soviet10year-textbooks/toc/10p/zh.json'),
  target: 'N148 starts printed369 and N149 starts printed371. Record all source content and actual title boundary; N149 remains open beyond this batch.',
  incomingContext: 'SOURCE379 author is a separate active batch; no finalized preceding text supplied yet. Do not invent its tail or read its images. Parent composes actual cross-page text later.',
  writeScope: [path.resolve(O), path.resolve(root)],
  preparedInputsImmutable: true, maximumActualImageOpens: 8,
  maximumContextImageOpens: 24, firstNativeParentLanePending: true,
  sourceApproval: false, completeCoursesAdded: 0, sourcePagesAdded: 0,
  parentImageOpens: 0, paidCalls: 0, databaseWrites: false, formalHandoff: false,
};
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify(input, null, 2) + '\n', { flag: 'wx' });
const meterFile = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(meterFile));
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
assert(!meter.currentResume1816.D310);
meter.currentResume1816.D310 = {
  status: 'FIRST_SOURCE380_382_AUTHOR_INPUT_READY', inputFreeze: bind(`${O}/input-freeze.json`),
  root, work, author: null, authorClosed: false, imagesAuthorized: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0, firstNativeParentLanePending: true,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: bind(`${O}/input-freeze.json`),
  completeDelivered: 142, sourceApproval: false, parentImageOpens: 0 }));
