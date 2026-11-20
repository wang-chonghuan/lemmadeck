import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d318-10p-source386-388-author`;
const root = '.tmp/STEMROBIN-181/d1816-d318/root';
const work = '.tmp/STEMROBIN-181/d1816-d318/source-work';
const pages = [386, 387, 388];
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
for (const dir of [O, root, work]) assert(!fs.existsSync(dir));
for (const page of pages)
  assert(!fs.existsSync(`ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0${page}`));
execFileSync(process.execPath, [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd318-10p-source386-388-first-prepare',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/production.py',
  'prepare-range', '--repo', '.', '--book', '10p',
  '--first', '386', '--last', '388', '--work', work,
], { stdio: 'inherit' });
fs.mkdirSync(O, { recursive: true });
fs.writeFileSync(`${O}/input-freeze.json`, JSON.stringify({
  batch: 'D318', ticket: 'STEMROBIN-181', book: '10p',
  role: 'FIRST_SOURCE386_388_AUTHOR_ONLY_NO_NATIVE_SUBPROCESS', root, work,
  pages: pages.map(page => ({
    page, printedPage: page - 10,
    original: bind(`${work}/10p/pages/0${page}/page.png`),
    grid: bind(`${work}/10p/pages/0${page}/page.grid.png`),
    layout: bind(`${work}/10p/pages/0${page}/layout.json`),
    template: bind(`${work}/10p/pages/0${page}/page.template.md`),
  })),
  preparation: bind(`${T}/tmp/d1816-recovery/native/d318-10p-source386-388-first-prepare/receipt.json`),
  toc: bind('ssot-resources/soviet10year-textbooks/toc/10p/zh.json'),
  target: 'N150 began printed375; observe ending and next chapter/151 heading from actual pixels. Complete source pages including boundary page, but do not claim complete151.',
  incomingContext: 'SOURCE385 final object: 第三组是介子. 这组也由八种粒子组成，其中最轻的是π介子：正 / 的、负的和中性的，它们的质量是电子质量的264倍(π^0)和273倍(π^+，. This is prior observed text, not a source386 prediction; preserve uncertainty until read.',
  writeScope: [path.resolve(O), path.resolve(root)],
  preparedInputsImmutable: true, maximumActualImageOpens: 8,
  maximumContextImageOpens: 24, firstNativeParentLanePending: true,
  sourceApproval: false, completeCoursesAdded: 0, sourcePagesAdded: 0,
  parentImageOpens: 0, paidCalls: 0, databaseWrites: false, formalHandoff: false,
}, null, 2) + '\n', { flag: 'wx' });
const file = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(file));
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
assert(!meter.currentResume1816.D318);
meter.currentResume1816.D318 = {
  status: 'FIRST_SOURCE386_388_AUTHOR_INPUT_READY', inputFreeze: bind(`${O}/input-freeze.json`),
  root, work, author: null, authorClosed: false, imagesAuthorized: 8,
  sourcePagesAdded: 0, completeCoursesAdded: 0, firstNativeParentLanePending: true,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ inputFreeze: bind(`${O}/input-freeze.json`),
  completeDelivered: 142, sourceApproval: false, parentImageOpens: 0 }));
