import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const root = '.tmp/STEMROBIN-181/d1816-d268/root';
const work = '.tmp/STEMROBIN-181/d1816-d268/source-work';
const O = `${T}/tmp/d1816-d268-source48-51-native`;
const R = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
assert(!fs.existsSync(`${O}/result.json`));
const authorFile = `${T}/tmp/d1816-d268-source48-51-author/report.json`;
const author = read(authorFile);
const originals = [];
for (const page of [48, 49, 50, 51]) {
  const label = String(page).padStart(4, '0');
  const file = `${root}/10p/pages/${label}/page.md`;
  assert(fs.existsSync(file), file);
  assert(!fs.existsSync(`${R}/pages/${label}`), 'Do not replace existing canonical source');
  originals.push(bind(file));
}
const referenceOnly = [];
for (const page of ['0052', '0053']) {
  for (const name of ['page.json', 'page.md', 'audit.json']) {
    const from = `${R}/pages/${page}/${name}`;
    const to = `${root}/10p/pages/${page}/${name}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (!fs.existsSync(to)) fs.symlinkSync(path.resolve(from), to);
    assert.equal(bind(from).sha256, bind(to).sha256);
    referenceOnly.push(bind(from));
  }
}
for (const suffix of ['png', 'svg']) {
  const from = `${R}/figures/tbl-p0053-01.${suffix}`;
  const to = `${root}/10p/figures/tbl-p0053-01.${suffix}`;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (!fs.existsSync(to)) fs.symlinkSync(path.resolve(from), to);
  referenceOnly.push(bind(from));
}
const stages = [];
let firstFailure = null;
const native = (name, command, extra = []) => {
  try {
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`, name,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', command,
      '--book', '10p', '--root', root, '--work', work, ...extra,
    ], { cwd: repo, stdio: 'inherit' });
    stages.push({ name, command, status: 'pass',
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
    return true;
  } catch (error) {
    firstFailure = { name, command, exitCode: error.status,
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) };
    stages.push({ ...firstFailure, status: 'fail' });
    return false;
  }
};
for (const page of [48, 49, 50, 51]) {
  if (!native(`d268-source${page}-first-finalize`, 'finalize', ['--page', String(page)])) break;
}
if (!firstFailure) native('d268-source48-53-first-assemble', 'assemble', [
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
if (!firstFailure) native('d268-source48-51-first-vectorize', 'vectorize');
if (!firstFailure) native('d268-source48-53-after-vectorize-assemble', 'assemble', [
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
]);
const candidates = [];
for (const page of [48, 49, 50, 51]) {
  const directory = `${root}/10p/pages/${String(page).padStart(4, '0')}`;
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    if (fs.existsSync(`${directory}/${name}`)) candidates.push(bind(`${directory}/${name}`));
  }
}
const index = fs.existsSync(`${root}/10p/book.json`) ? read(`${root}/10p/book.json`) : null;
save(`${O}/result.json`, {
  batch: 'D268', book: '10p', status: firstFailure ? 'first-native-failure' : 'native-pass-review-pending',
  authorReport: bind(authorFile), originalAuthorMd: originals, candidates,
  referenceOnly, stages, firstFailure, root, work,
  assembledCards: index?.lessons?.map(row => row.id) || [],
  sourceApproval: false, modernApproval: false, sourcePagesAdded: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, paidCalls: 0,
  fullProjectChecks: false, formalHandoff: false, databaseWrites: false,
});
console.log(JSON.stringify({ result: bind(`${O}/result.json`), firstFailure,
  cards: index?.lessons?.map(row => row.id) || [], approval: false }));
