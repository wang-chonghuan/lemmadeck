import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d302-n19-native`;
const root = '.tmp/STEMROBIN-181/d1816-d287/source-root';
const work = '.tmp/STEMROBIN-181/d1816-d287/work';
const display = '.tmp/STEMROBIN-181/d1816-d302/display';
const id = 'phy10-c1-s3-n19';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const verify = row => assert.equal(bind(row.path).sha256, row.sha256);
assert.equal(read(`${T}/tmp/d1816-d300-affected-context-review/report.json`).verdict,
  'PASS_AFFECTED_TEXT_AND_CONTEXT_ONLY');
const current = read(`${T}/tmp/d1816-d299-current-figure-text/result.json`);
for (const entry of current.templates.filter(row => row.number === 19)) verify(entry.template);
const installed = ['tbl-p0053-01', 'fig-28', 'fig-29'].map(figure => {
  const file = `${T}/tmp/d1816-d301-current-figure-install/${figure}.installed.json`;
  const record = read(file);
  assert.equal(record.independentFigureApproved, true);
  for (const asset of record.records.filter(row => row.root === root))
    for (const key of ['spec', 'svg', 'render', 'review']) verify(asset[key]);
  return bind(file);
});
fs.mkdirSync(O, { recursive: true });
const stages = [];
let failure = null;
const call = (name, args) => {
  if (failure) return;
  try {
    execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`, name,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args],
    { cwd: repo, stdio: 'inherit' });
    stages.push({ name, status: 'pass',
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  } catch (error) {
    failure = { name, exitCode: error.status };
    stages.push({ ...failure, status: 'fail',
      receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  }
};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  call(`d302-n19-${locale}-first-adapt-finalize`,
    ['adapt-finalize', '--book', '10p', '--root', root, '--work', work,
      '--edition', edition, '--lesson', id]);
  call(`d302-n19-${locale}-first-offline-render`,
    ['render', '--book', '10p', '--root', root, '--work', display,
      '--edition', edition, '--lesson', id]);
}
const outputs = failure ? [] : ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => ({
  id, edition, lesson: bind(`${root}/10p/editions/${edition}/lessons/${id}/lesson.json`),
  exercises: bind(`${root}/10p/editions/${edition}/lessons/${id}/exercises.json`),
  figures: bind(`${root}/10p/editions/${edition}/lessons/${id}/figures.json`),
  audit: bind(`${root}/10p/editions/${edition}/lessons/${id}/adaptation.audit.json`),
  html: bind(`${display}/render/10p/${edition}/${id}/text.html`),
}));
fs.writeFileSync(`${O}/result.json`, JSON.stringify({ batch: 'D302',
  status: failure ? 'native-failure' : 'native-pass-display-pending',
  id, book: '10p', root, work, display, stages, failure, outputs, installed,
  originalTasks: 0, answers: 0, choices: 0,
  existingChineseScienceReplayed: false, geometryRerenders: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, databaseWrites: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${O}/result.json`), failure }));
