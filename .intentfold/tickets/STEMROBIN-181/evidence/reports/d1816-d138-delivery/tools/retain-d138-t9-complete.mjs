import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const A = `${T}/tmp/d1816-d138-t9-choice-author`;
const V = `${T}/tmp/d1816-d138-t9-semantic-review`;
const D = `${T}/tmp/d1816-d138-t9-display`;
const O = `${T}/evidence/reports/d1816-d138-delivery`;
const C = '.tmp/STEMROBIN-181/d1816-d138/root/9p';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const ID = 'phy9-c1-s3-t9';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(row =>
  row.isSymbolicLink() ? [] : row.isDirectory() ? walk(`${directory}/${row.name}`) : [`${directory}/${row.name}`]);
const save = (file, value, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
const products = [];
const retained = [];
const copy = (from, to, list) => {
  assert(!fs.existsSync(to), to);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256, to);
  list.push({ ...bind(to), originalPath: from });
};
assert(!fs.existsSync(O));
assert.equal(read(`${V}/report.json`).status.toLowerCase(), 'pass');
assert.equal(read(`${V}/report.json`).reviewerIsAuthor, false);
assert.equal(read(`${V}/report.json`).englishQ2AffectedVerdict.toLowerCase(), 'pass');
assert.equal(read(`${V}/report.json`).answersVerdict.toLowerCase(), 'pass');
const display = read(`${D}/latest-result.json`);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 12);
const pixels = read(`${T}/tmp/d1816-d138-t9-display-review/combined.json`);
assert.equal(pixels.status, 'pass');
assert.equal(pixels.screenshots.length, 12);
for (const row of display.records) {
  verify(row.html);
  verify(row.screenshot);
  assert(pixels.screenshots.some(entry =>
    path.resolve(entry.path) === path.resolve(row.screenshot.path) && entry.sha256 === row.screenshot.sha256));
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  assert.equal(bind(`${C}/lessons/${ID}/${name}`).sha256, bind(`${R}/lessons/${ID}/${name}`).sha256);
}
const rawBook = bind(`${R}/book.json`);
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const dir = `${C}/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${dir}/answer-keys.json`).status, 'ready');
  assert.equal(read(`${dir}/exercises.json`).count, 6);
  assert.equal(read(`${dir}/lesson.json`).prose.length, 0);
  assert.equal(read(`${V}/review.${locale}.json`).outcome, 'pass');
  for (const file of walk(dir)) {
    assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
    copy(file, file.replace(`${C}/editions/`, `${R}/editions/`), products);
  }
  for (const figure of ['fig-24', 'fig-30']) {
    for (const suffix of ['spec.json', 'svg', 'render.json', 'review.json']) {
      const file = `${C}/editions/${edition}/figures/${figure}.${suffix}`;
      assert(!fs.readFileSync(file, 'utf8').includes('.tmp/'), file);
      copy(file, file.replace(`${C}/editions/`, `${R}/editions/`), products);
    }
  }
  execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`,
    `d138-t9-${locale}-retain-native-edition-index`, '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    `${T}/tmp/d1816-recovery/update-edition-index.py`,
    '--book', R, '--carrier', C, '--edition', edition, '--lesson', ID],
  { cwd: repo, stdio: 'inherit' });
  products.push(bind(`${R}/editions/${edition}/book.json`));
  const choiceSource = `.tmp/STEMROBIN-181/d1816-d138/retained-choice-${locale}`;
  const seed = read(`${A}/input-freeze.json`).seed.path;
  for (const [from, name] of [[seed, 'seed.json'], [`${A}/draft.${locale}.json`, 'draft.json'],
    [`${V}/review.${locale}.json`, 'review.json']]) {
    copy(from, `${choiceSource}/${name}`, retained);
  }
  if (locale === 'zh') {
    execFileSync(process.execPath, [`${T}/tmp/d1816-recovery/run-native.mjs`,
      'd138-t9-zh-native-choice-retention', 'python3',
      '.claude/skills/ld-s10y-lesson/tools/retain_choices.py',
      '--repo', repo, '--book', '9p', '--lesson', ID, '--source', choiceSource],
    { cwd: repo, stdio: 'inherit' });
    for (const file of walk(`${R}/editions/${edition}/lessons/${ID}/choice-set`)) products.push(bind(file));
  } else {
    for (const name of ['seed.json', 'draft.json', 'review.json']) {
      copy(`${choiceSource}/${name}`, `${R}/editions/${edition}/lessons/${ID}/choice-set/${name}`, products);
    }
  }
}
verify(rawBook);
for (const stage of ['d133-t9-text-author', 'd134-t9-text-review',
  'd135-t9-figures-author', 'd136-t9-source-derivations', 'd137-t9-figures-review',
  'd138-t9-native', 'd138-t9-choice-author', 'd138-t9-semantic-review',
  'd138-t9-display', 'd138-t9-display-review']) {
  const dir = `${T}/tmp/d1816-${stage}`;
  for (const file of walk(dir)) copy(file, `${O}/stages/${stage}/${path.relative(dir, file)}`, retained);
}
for (const call of fs.readdirSync(`${T}/tmp/d1816-recovery/native`).filter(name =>
  name.startsWith('d138-t9-') || name === 'd138-en-q3-mobile-layout-recovery')) {
  const dir = `${T}/tmp/d1816-recovery/native/${call}`;
  for (const file of walk(dir)) copy(file, `${O}/native/${call}/${path.basename(file)}`, retained);
}
for (const name of ['recover-d138-en-native.mjs', 'install-finalize-d138-t9.mjs',
  'prepare-d138-t9-choice-source.mjs', 'prepare-d138-t9-semantic-review.mjs',
  'prepare-d138-display-review.mjs', 'collect-d138-author.mjs', 'collect-d138-review.mjs',
  'diagnose-d138-mobile-math.mjs', 'repair-d138-mobile-answers.mjs',
  'repair-d138-en-mobile-unit.mjs',
  'd138-en-q3-original-layout-call-failure.json',
  'check-d138-t9-offline.mjs', 'retain-d138-t9-complete.mjs',
  'stage-d138-delivery.mjs', 'record-d138-push.mjs']) {
  copy(`${T}/tmp/d1816-recovery/${name}`, `${O}/tools/${name}`, retained);
}
const draft = read(`${A}/draft.zh.json`);
save(`${O}/batch-ready.json`, {
  schema: 'STEMROBIN-181/offline-complete-batch@1', ticket: 'STEMROBIN-181', batch: 'D138',
  status: 'complete-retained-unbatched', cards: [ID], productBindings: products, retained,
  counts: { newCourses: 1, originalWrittenQuestions: 6, readonlyStandards: 6,
    choiceResponseUnits: draft.questions.length,
    choiceOptions: draft.questions.reduce((sum, row) => sum + row.view.options.length, 0),
    sharedModernFigures: 2, sourcePagesAdded: 0 },
  sourceStagesReused: true, passedNativeStagesReplayed: 0, originalEnglishFailurePreserved: true,
  formulaOrderCheckUnchanged: true, twelveOfflineScreenshotsPASS: true,
  headless: true, productAcceptance: false, wholeProjectChecks: false, formalHandoff: false,
  paidCalls: 0, databaseWrites: false, parentNewImageOpens: 0,
});
console.log(JSON.stringify({ readiness: bind(`${O}/batch-ready.json`), products: products.length,
  retained: retained.length, completeCoursesAdded: 1, sourcePagesAdded: 0, staged: false }));
