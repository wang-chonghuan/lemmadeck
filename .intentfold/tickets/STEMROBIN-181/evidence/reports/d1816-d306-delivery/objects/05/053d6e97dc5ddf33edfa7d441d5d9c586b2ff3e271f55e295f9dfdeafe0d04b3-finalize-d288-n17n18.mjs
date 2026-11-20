import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = '.tmp/STEMROBIN-181/d1816-d276/root';
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const display = '.tmp/STEMROBIN-181/d1816-d288/display';
const out = `${ticket}/tmp/d1816-d288-n17n18-native`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const ids = ['phy10-c1-s3-n17', 'phy10-c1-s3-n18'];
const installed = [24, 25, 26, 27, 28, 29].map(number => {
  const file = `${ticket}/tmp/d1816-d301-current-figure-install/fig-${number}.installed.json`;
  const record = read(file);
  assert.equal(record.independentFigureApproved, true);
  for (const entry of record.records)
    for (const key of ['spec', 'svg', 'render', 'review'])
      assert.equal(bind(entry[key].path).sha256, entry[key].sha256);
  return bind(file);
});
assert.equal(read(`${ticket}/tmp/d1816-d279-n17n18-text-review/report.json`).verdict, 'PASS_TEXT_ONLY');
const layout = read(`${ticket}/tmp/d1816-d286-section-breaks/result.json`);
assert.equal(layout.textChanged, false);
assert.equal(layout.sourceBindingsChanged, false);
const normalized = read(`${ticket}/tmp/d1816-d295-native-layout/result.json`);
assert.equal(normalized.status, 'pass');
assert.equal(normalized.wordingAndFormulasChanged, false);
assert.equal(normalized.sourceSnapshotsChanged, false);
assert.equal(normalized.conceptPositionsChanged, false);
const currentText = read(`${ticket}/tmp/d1816-d299-current-figure-text/result.json`);
for (const change of currentText.templates.filter(change => [17, 18].includes(change.number)))
  assert.equal(bind(change.template.path).sha256, change.template.sha256);
fs.mkdirSync(out, { recursive: true });
assert(!fs.existsSync(`${out}/result.json`));
const stages = [];
let failure = null;
const call = (name, executable, args) => {
  if (failure) return;
  try {
    execFileSync(process.execPath, [
      `${ticket}/tmp/d1816-recovery/run-native.mjs`, name, executable, ...args,
    ], { cwd: repo, stdio: 'inherit' });
    stages.push({ name, pass: true,
      receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  } catch (error) {
    failure = { name, exitCode: error.status };
    stages.push({ ...failure, pass: false,
      receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  }
};
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  call(`d288-n17n18-${locale}-first-adapt-finalize`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize',
    '--book', '10p', '--root', root, '--work', work, '--edition', edition,
    ...ids.flatMap(id => ['--lesson', id]),
  ]);
  call(`d288-n17n18-${locale}-first-offline-render`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render',
    '--book', '10p', '--root', root, '--work', display, '--edition', edition,
    ...ids.flatMap(id => ['--lesson', id]),
  ]);
}
const outputs = failure ? [] : ids.flatMap(id =>
  ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => ({
    id, edition, lesson: bind(`${root}/10p/editions/${edition}/lessons/${id}/lesson.json`),
    exercises: bind(`${root}/10p/editions/${edition}/lessons/${id}/exercises.json`),
    figures: bind(`${root}/10p/editions/${edition}/lessons/${id}/figures.json`),
    audit: bind(`${root}/10p/editions/${edition}/lessons/${id}/adaptation.audit.json`),
    html: bind(`${display}/render/10p/${edition}/${id}/text.html`),
  })));
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  batch: 'D288', status: failure ? 'native-failure' : 'native-pass-display-pending',
  ids, book: '10p', root, work, display, installed, stages, failure, outputs,
  originalTasks: 0, answers: 0, choices: 0, sourceReviewsReplayed: false,
  independentTextReviewsReplayed: false, geometryRerenders: 0,
  completeCoursesAdded: 0, canonicalPromotions: 0, databaseWrites: false, paidCalls: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${out}/result.json`), failure }));
