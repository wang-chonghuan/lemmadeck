import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d306-delivery`;
const git = args => execFileSync('git', args,
  { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const read = file => JSON.parse(fs.readFileSync(file));
const ready = read(`${O}/batch-ready.json`);
const parent = git(['rev-parse', 'HEAD']);
assert.equal(git(['rev-parse', 'origin/codex/STEMROBIN-181-textbooks']), parent);
const stagedBefore = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
assert(stagedBefore.length > 0);
for (const row of [...ready.productBindings, ...ready.sourceProductBindings])
  assert.equal(hash(execFileSync('git', ['show', `:${row.path}`],
    { maxBuffer: 16 * 1024 * 1024 })), row.sha256, row.path);
const sourceBook = 'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json';
const stagedBook = JSON.parse(git(['show', `:${sourceBook}`]));
const headBook = JSON.parse(git(['show', `HEAD:${sourceBook}`]));
assert.equal(stagedBook.pages, headBook.pages + 4);
assert.equal(read(sourceBook).pages, 212);
assert.deepEqual(stagedBook.lessons.filter(row => !ready.cards.slice(0, 2).includes(row.id)),
  headBook.lessons);
const layoutFile = '.claude/skills/ld-s10y-lesson/tools/layout.py';
const diff = git(['diff', '--cached', '--', layoutFile]);
assert.equal((diff.match(/^@@ /gm) ?? []).length, 2);
assert(!/^\+.*radical|^\+.*separator/gm.test(diff));
for (const file of stagedBefore) {
  assert(!/(^|\/)\.env(?:\/|$)/.test(file), file);
  assert(!/\/lessons\/phy10-c1-s3-n23\/|\/pages\/(?:0063|0064|0067|0187|0307)\//.test(file), file);
}
git(['diff', '--cached', '--check', '--', '.',
  `:(exclude,glob)${O}/objects/*/*-stdout.txt`,
  `:(exclude,glob)${O}/objects/*/*-stderr.txt`]);
const stagingFiles = [
  'stage-d306-delivery.mjs', 'finish-d306-stage.mjs',
  'd306-stage-first-failure.json', 'd306-stage-second-failure.json',
  'd306-stage-third-failure.json',
];
for (const file of stagingFiles) {
  const from = `${T}/tmp/d1816-recovery/${file}`;
  const to = `${O}/staging/${file}`;
  fs.mkdirSync(`${O}/staging`, { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
}
const scopeFile = `${O}/staging/staged-scope.json`;
fs.writeFileSync(scopeFile, JSON.stringify({
  batch: 'D306', parent, cards: ready.cards, stagedBeforeRecoveryRetention: stagedBefore,
  completeDeliveredBefore: 139, completeUnbatched: ready.cards,
  sourceBookStagedPages: 210, sourceBookWorkingPages: 212,
  excludedN23AndUnrelatedSourceEdits: true,
  excludedRadicalAndSeparatorLayoutEdits: true,
  whitespaceCheck: 'pass-except-byte-exact-immutable-command-logs',
  immutableLogsPreserved: true, preparedIndexReused: true,
  originalFailuresPreserved: true, wholeProjectChecks: false,
  formalHandoff: false, databaseWrites: false, commit: false, push: false,
}, null, 2) + '\n', { flag: 'wx' });
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
for (const file of [...stagingFiles, 'staged-scope.json'])
  index.reports.push({ ...bind(`${O}/staging/${file}`), batch: 'D306' });
index.updatedAt = new Date().toISOString();
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
git(['add', '--', indexFile, `${O}/staging`]);
git(['diff', '--cached', '--check', '--', '.',
  `:(exclude,glob)${O}/objects/*/*-stdout.txt`,
  `:(exclude,glob)${O}/objects/*/*-stderr.txt`]);
console.log(JSON.stringify({ stagedScope: bind(scopeFile),
  stagedFiles: git(['diff', '--cached', '--name-only']).split('\n').length,
  parent, completeDeliveredBefore: 139, completeUnbatched: ready.cards }));
