import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d348-source391-marker-repair`;
const root = '.tmp/STEMROBIN-181/d1816-d348/root';
const work = '.tmp/STEMROBIN-181/d1816-d348/source-work';
const beforeRoot = '.tmp/STEMROBIN-181/d1816-d335';
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
assert(!fs.existsSync(O));
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
};
const source = `${beforeRoot}/root/10p/pages/0391/page.md`;
copy(source, `${O}/before.page.md`);
copy(source, `${root}/10p/pages/0391/page.md`);
for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
  copy(`${beforeRoot}/source-work/10p/pages/0391/${name}`, `${work}/10p/pages/0391/${name}`);
const target = `${root}/10p/pages/0391/page.md`;
const original = fs.readFileSync(target, 'utf8');
const span = '**引力、电磁力、核力及弱\n相互作用**';
assert(original.includes(span));
fs.writeFileSync(target, original.replace(span, '**引力、电磁力、核力**及**弱\n相互作用**'));
execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, 'd348-source391-marker-only-finalize',
  '.claude/skills/ld-s10y-lesson/.venv/bin/python',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
  '--book', '10p', '--page', '391', '--root', root, '--work', work,
], { cwd: repo, stdio: 'inherit' });
copy(target, `${O}/after.page.md`);
fs.writeFileSync(`${O}/author-freeze.json`, JSON.stringify({
  stage: 'D348', finding: 'D336-MARKER-391-12',
  firstReview: bind(`${T}/tmp/d1816-d336-source389-391-review/report.json`),
  before: bind(`${O}/before.page.md`), after: bind(`${O}/after.page.md`),
  source: bind(`${work}/10p/pages/0391/page.png`),
  pageJson: bind(`${root}/10p/pages/0391/page.json`),
  root, work, change: 'Only the ordinary conjunction 及 is excluded from bold; source letters, punctuation, rows and all other blocks unchanged.',
  contentRepairs: 1, imagesOpened: 0, paidCalls: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, affectedReviewPending: true,
}, null, 2) + '\n');
console.log(JSON.stringify({ freeze: bind(`${O}/author-freeze.json`) }));
