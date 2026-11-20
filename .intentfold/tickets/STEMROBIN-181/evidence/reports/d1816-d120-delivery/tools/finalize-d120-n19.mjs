import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const C = '.tmp/STEMROBIN-181/d1816-d112/root';
const W = '.tmp/STEMROBIN-181/d1816-d115/work';
const P = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const S = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const I = 'phy9-c1-s2-n19';
const O = `${T}/tmp/d1816-d120-n19-native`;
const read = p => JSON.parse(fs.readFileSync(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const bind = p => ({ path: p, sha256: hash(p) });
const verify = r => assert.equal(hash(r.path), r.sha256, r.path);
const installFile = `${T}/tmp/d1816-d120-n19-figure-install/figure-bindings.json`;
const install = read(installFile);
for (const record of install.records) {
  for (const key of ['spec', 'svg', 'render', 'review', 'manifest']) verify(record[key]);
}
const authorFile = `${T}/tmp/d1816-d115-n19-text-metadata-author/author-freeze.json`;
const author = read(authorFile);
for (const record of author.records) verify(record.template);
const calls = [];
const native = (name, args) => {
  execFileSync('node', [`${T}/tmp/d1816-recovery/run-native.mjs`, name, P, S, ...args],
    { cwd: repo, stdio: 'inherit' });
  const receipt = `${T}/tmp/d1816-recovery/native/${name}/receipt.json`;
  assert.equal(read(receipt).exitCode, 0);
  calls.push(bind(receipt));
};
const records = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  native(`d120-n19-${locale}-first-native-finalize`, [
    'adapt-finalize', '--book', '9p', '--edition', edition, '--lesson', I,
    '--root', C, '--work', W,
  ]);
  const directory = `${C}/9p/editions/${edition}/lessons/${I}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${directory}/exercises.json`).count, 0);
  assert.equal(read(`${directory}/lesson.json`).prose.length, 16);
  assert.deepEqual(read(`${directory}/figures.json`).figures.map(row => row.id), ['fig-26']);
  native(`d120-n19-${locale}-first-offline-render`, [
    'render', '--book', '9p', '--edition', edition, '--lesson', I,
    '--root', C, '--work', '.tmp/STEMROBIN-181/d1816-d112/display',
  ]);
  const htmlDirectory = `.tmp/STEMROBIN-181/d1816-d112/display/render/9p/${edition}/${I}`;
  records.push({
    locale, edition,
    files: fs.readdirSync(directory).map(name => bind(`${directory}/${name}`)),
    html: ['text.html', 'exercises.html'].map(name => bind(`${htmlDirectory}/${name}`)),
  });
}
fs.mkdirSync(O, { recursive: true });
const output = `${O}/native-finalized.json`;
assert(!fs.existsSync(output));
fs.writeFileSync(output, JSON.stringify({
  schema: 'STEMROBIN-181/first-native-bilingual-finalization@1',
  ticket: 'STEMROBIN-181', batch: 'D120', lesson: I, status: 'pass',
  author: bind(authorFile), approvedFigureInstall: bind(installFile), calls, records,
  nativeFinalizers: 2, nativeRenders: 2,
  sourcePagesAdded: 0, completeCoursesAdded: 0, imageOpens: 0,
  paidCalls: 0, databaseWrites: false, productAcceptance: false,
  offlineDisplayAndIndependentVisualPending: true,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ status: 'pass', nativeFinalizers: 2, offlineRenders: 2,
  result: bind(output), displayPending: true }));
