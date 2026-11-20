import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const stage = process.argv[2];
const cfg = {
  D311: { author: 'D308', pages: [376, 377, 378, 379] },
  D313: { author: 'D310', pages: [380, 381, 382] },
  D316: { author: 'D315', pages: [383, 384, 385] },
  D319: { author: 'D318', pages: [386, 387, 388] },
  D335: { author: 'D331', pages: [389, 390, 391] },
  D345: { author: 'D341', pages: [392, 393] },
}[stage];
assert(cfg, 'Explicit supported stage required');
const meterFile = `${T}/production-meter.json`;
const meter = JSON.parse(fs.readFileSync(meterFile));
const author = meter.currentResume1816[cfg.author];
assert.equal(author.authorClosed, true);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
const lower = stage.toLowerCase();
const root = `.tmp/STEMROBIN-181/d1816-${lower}/root`;
const work = `.tmp/STEMROBIN-181/d1816-${lower}/source-work`;
const O = `${T}/tmp/d1816-${lower}-source${cfg.pages[0]}-${cfg.pages.at(-1)}-first-native`;
for (const dir of [root, work, O]) assert(!fs.existsSync(dir), dir);
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const copy = (from, to, mode = 0o444) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(to, mode);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
const drafts = [];
for (const page of cfg.pages) {
  const number = String(page).padStart(4, '0');
  const source = `${author.root}/10p/pages/${number}/page.md`;
  drafts.push(bind(source));
  copy(source, `${O}/before/${number}/page.md`);
  copy(source, `${root}/10p/pages/${number}/page.md`, 0o644);
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    copy(`${author.work}/10p/pages/${number}/${name}`, `${work}/10p/pages/${number}/${name}`);
  fs.mkdirSync(`${work}/10p/pages/${number}/figures`, { recursive: true });
}
const native = [];
let failure = null;
const call = (page, action) => {
  const name = `${lower}-source${page}-first-${action}`;
  const result = spawnSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
    '--book', '10p', '--page', String(page), '--root', root, '--work', work,
  ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  const receipt = JSON.parse(fs.readFileSync(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`));
  const row = { page, action, exitCode: receipt.exitCode,
    receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) };
  native.push(row);
  for (const file of ['receipt.json', 'stdout.txt', 'stderr.txt'])
    copy(`${T}/tmp/d1816-recovery/native/${name}/${file}`, `${O}/native/${name}/${file}`);
  if (receipt.exitCode !== 0) failure = row;
};
for (const page of cfg.pages) {
  call(page, 'finalize');
  if (failure) break;
  const number = String(page).padStart(4, '0');
  const parsed = JSON.parse(fs.readFileSync(`${root}/10p/pages/${number}/page.json`));
  if (parsed.meta.figures.length) {
    call(page, 'vectorize');
    if (failure) break;
  }
}
for (const draft of drafts) assert.equal(bind(draft.path).sha256, draft.sha256);
const file = `${O}/result.json`;
fs.writeFileSync(file, JSON.stringify({
  batch: stage, authorStage: cfg.author, status: failure ? 'first-native-failure' : 'native-pass-source-review-pending',
  pages: cfg.pages, root, work, drafts, authorReport: author.report,
  authorFreeze: author.authorFreeze, native, failure,
  originalAuthorDraftsUnchanged: true, laterStagesStoppedAtFirstFailure: Boolean(failure),
  sourceApproval: false, sourcePagesAdded: 0, completeCoursesAdded: 0,
  parentImageOpens: 0, newPaidCalls: 0, databaseWrites: false,
  formalHandoff: false, wholeProjectChecks: false,
}, null, 2) + '\n', { flag: 'wx' });
meter.currentResume1816[stage] = {
  status: failure ? 'FIRST_NATIVE_FAILURE_PRESERVED_SOURCE_REVIEW_PENDING' : 'FIRST_NATIVE_PASS_SOURCE_REVIEW_PENDING',
  result: bind(file), root, work, sourcePagesAdded: 0, completeCoursesAdded: 0,
};
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ result: bind(file), failure, sourceApproval: false }));
