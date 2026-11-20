import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const O = path.join(W, '.tmp/STEMROBIN-181/d1816-d073');
const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author');
const raw = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const bind = file => ({path: file, sha256: hash(file), bytes: fs.statSync(file).size});
const save = (file, data) => {
  assert.ok(file.startsWith(O + '/') || file.startsWith(E + '/'));
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
};
const copies = [];
for (const page of ['0310', '0311', '0312']) {
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    const from = path.join(raw, 'pages', page, file);
    const to = path.join(O, 'root/9p/pages', page, file);
    fs.mkdirSync(path.dirname(to), {recursive: true});
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(from), hash(to));
    copies.push({source: bind(from), copy: bind(to)});
  }
}
save(path.join(E, 'carrier.json'), {
  role: 'FIRST_AUTHOR', completePageCopies: copies, sourceApprovalPending: 'D069-parent-consumption',
  noCanonicalWrites: true, noSourceApproval: true,
});
const receiptDir = path.join(E, 'native');
const run = (name, args) => {
  const startedAt = new Date().toISOString();
  const result = spawnSync(args[0], args.slice(1), {cwd: W, encoding: 'utf8',
    env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}});
  const dir = path.join(receiptDir, name);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(path.join(dir, 'stdout.txt'), result.stdout || '', {flag: 'wx'});
  fs.writeFileSync(path.join(dir, 'stderr.txt'), result.stderr || '', {flag: 'wx'});
  save(path.join(dir, 'receipt.json'), {role: 'FIRST_AUTHOR', command: args, cwd: W,
    startedAt, finishedAt: new Date().toISOString(), exitCode: result.status,
    error: result.error?.message || null});
  console.log(name, result.status, result.stdout, result.stderr);
  assert.equal(result.status, 0, name);
};
const P = path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const S = path.join(W, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
run('isolated-assemble', [P, S, 'assemble', '--book', '9p', '--toc',
  path.join(W, 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'),
  '--root', path.join(O, 'root'), '--work', path.join(W, '.tmp/ld-s10y-lesson')]);
const book = path.join(O, 'root/9p');
const index = JSON.parse(fs.readFileSync(path.join(book, 'book.json')));
const excluded = [];
for (const lesson of index.lessons) {
  if (lesson.id === 'phy9-c2-s6-n126') continue;
  const from = path.join(book, 'lessons', lesson.id);
  const to = path.join(O, 'boundary-drafts', lesson.id);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.renameSync(from, to);
  excluded.push({id: lesson.id, retainedOnlyAsBoundary: to});
}
save(path.join(E, 'target-selection.json'), {
  role: 'FIRST_AUTHOR', target: 'phy9-c2-s6-n126', excluded,
  nativeIndexRetainedUnmodified: bind(path.join(book, 'book.json')),
  deliveryTargets: ['phy9-c2-s6-n126'],
  note: 'Native index records boundary assembly; boundary drafts are moved out, never adapted or delivered.',
});
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  run(edition + '-adapt-prepare', [P, S, 'adapt-prepare', '--book', '9p',
    '--edition', edition, '--lesson', 'phy9-c2-s6-n126',
    '--root', path.join(O, 'root'), '--work', path.join(O, 'work')]);
}
