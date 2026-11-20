import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d306-delivery`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const raw = fs.readFileSync(file);
  return { path: file, bytes: raw.length,
    sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const verify = record => assert.equal(bind(record.path).sha256, record.sha256, record.path);
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isSymbolicLink() ? [] : entry.isDirectory()
    ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
assert(!fs.existsSync(O));
const displayFile = `${T}/tmp/d1816-d303-display/result.json`;
const display = read(displayFile);
assert.equal(display.status, 'pass');
assert.equal(display.records.length, 12);
assert.deepEqual(display.requests, []);
const observations = ['d304-n17n18-display-review', 'd305-n19-display-review'].map(stage => {
  const file = `${T}/tmp/d1816-${stage}/report.json`;
  const report = read(file);
  assert.equal(report.status, 'pass');
  return { file, report };
});
for (const row of display.records) {
  for (const key of ['lesson', 'html', 'screenshot']) verify(row[key]);
  const matching = observations.flatMap(row => row.report.screenshots).filter(image =>
    path.resolve(image.path) === path.resolve(row.screenshot.path) &&
    image.sha256 === row.screenshot.sha256);
  assert.equal(matching.length, 1);
  assert.equal(matching[0].status, 'pass');
}
const native17 = read(`${T}/tmp/d1816-d307-n17n18-native-recovery/result.json`);
const native19 = read(`${T}/tmp/d1816-d302-n19-native/result.json`);
assert.equal(native17.status, 'native-pass-display-pending');
assert.equal(native19.status, 'native-pass-display-pending');
const cards = [...native17.ids.map(id => ({ id, root: native17.root, work: native17.work })),
  { id: native19.id, root: native19.root, work: native19.work }];
const products = [];
const retained = [];
const byHash = new Map();
const copyEvidence = from => {
  const source = bind(from);
  let target = byHash.get(source.sha256);
  if (!target) {
    const to = `${O}/objects/${source.sha256.slice(0, 2)}/${source.sha256}-${path.basename(from)}`;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
    assert.equal(bind(to).sha256, source.sha256);
    target = bind(to);
    byHash.set(source.sha256, target);
  }
  retained.push({ ...target, originalPath: path.resolve(from) });
  return target;
};
const promote = (from, to) => {
  const record = bind(from);
  assert(!fs.readFileSync(from, 'utf8').includes('.tmp/'), from);
  if (fs.existsSync(to)) assert.equal(bind(to).sha256, record.sha256, to);
  else {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  }
  products.push(bind(to));
};
for (const card of cards) {
  assert.equal(read(`${canonical}/lessons/${card.id}/exercises.json`).count, 0);
  for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
    const dir = `${card.root}/10p/editions/${edition}/lessons/${card.id}`;
    assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
    assert.equal(read(`${dir}/exercises.json`).count, 0);
    for (const file of walk(dir))
      promote(file, file.replace(`${card.root}/10p/editions/`, `${canonical}/editions/`));
    for (const figure of read(`${dir}/figures.json`).figures)
      for (const key of ['svg', 'spec', 'render', 'review']) {
        const suffix = figure[key];
        const from = `${card.root}/10p/editions/${edition}/${suffix}`;
        promote(from, `${canonical}/editions/${edition}/${suffix}`);
      }
    execFileSync(process.execPath, [
      `${T}/tmp/d1816-recovery/run-native.mjs`,
      `d306-${card.id}-${edition}-retain-native-index`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python',
      `${T}/tmp/d1816-recovery/update-edition-index.py`,
      '--book', canonical, '--carrier', `${card.root}/10p`,
      '--edition', edition, '--lesson', card.id,
    ], { cwd: repo, stdio: 'inherit' });
    for (const file of walk(`${card.work}/adapt/10p/${edition}/lessons/${card.id}`))
      copyEvidence(file);
  }
}
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  products.push(bind(`${canonical}/editions/${edition}/book.json`));
const sourceProducts = [];
for (const page of ['0048', '0049', '0050', '0051'])
  for (const file of walk(`${canonical}/pages/${page}`)) sourceProducts.push(bind(file));
for (const number of [24, 25, 26, 27, 28, 29])
  for (const suffix of ['png', 'svg'])
    sourceProducts.push(bind(`${canonical}/figures/fig-${number}.${suffix}`));
for (const number of [17, 18])
  for (const file of walk(`${canonical}/lessons/phy10-c1-s3-n${number}`))
    sourceProducts.push(bind(file));
const stages = fs.readdirSync(`${T}/tmp`).filter(name =>
  /^d1816-d(?:26[8-9]|2[7-9]\d|30[0-5]|307)-/.test(name));
for (const stage of stages)
  for (const file of walk(`${T}/tmp/${stage}`)) copyEvidence(file);
const nativeDir = `${T}/tmp/d1816-recovery/native`;
for (const stage of fs.readdirSync(nativeDir).filter(name =>
  /^d(?:26[8-9]|2[7-9]\d|30[0-7])-/.test(name)))
  for (const file of walk(`${nativeDir}/${stage}`)) copyEvidence(file);
for (const file of fs.readdirSync(`${T}/tmp/d1816-recovery`).filter(name =>
  /d(?:26[8-9]|2[7-9]\d|30[0-7])/.test(name) && /\.(?:mjs|py)$/.test(name)))
  copyEvidence(`${T}/tmp/d1816-recovery/${file}`);
const readiness = `${O}/batch-ready.json`;
save(readiness, { schema: 'STEMROBIN-181/offline-complete-batch@1', batch: 'D306',
  status: 'complete-retained-unbatched', cards: cards.map(row => row.id),
  productBindings: [...new Map(products.map(row => [row.path, row])).values()],
  sourceProductBindings: sourceProducts, sourceBookWorkingBinding: bind(`${canonical}/book.json`),
  retained, duplicateEvidenceBytesStoredOnce: true,
  display: copyEvidence(displayFile), observations: observations.map(row => copyEvidence(row.file)),
  counts: { newCourses: 3, newSourcePages: 4, originalWrittenQuestions: 0,
    readonlyStandards: 0, choices: 0, independentModernFigures: 7 },
  disposition: 'N17, N18 and N19 have zero original questions; no answers or choices invented.',
  originalFailuresPreserved: true, passedSubstantiveStagesReplayed: 0,
  metadataOnlyRebinding: true, twelveOfflineDisplaySurfacesPASS: true,
  parentContinuationImageOpens: 16, parentNewFinalImageOpens: 0,
  newPaidCalls: 0, databaseWrites: false, publish: false, deploy: false,
  merge: false, formalHandoff: false, wholeProjectChecks: false, productAcceptance: false });
const meterFile = `${T}/production-meter.json`;
const meter = read(meterFile);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 139);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
assert(!meter.deliveryBatches.some(row => row.id === 'D306'));
meter.currentCheckpoint.completeUnbatchedCards = cards.map(row => row.id);
meter.currentResume1816.D306 = { status: 'THREE_COMPLETE_OFFLINE_COURSES_READY_TO_COMMIT_PUSH',
  readiness: bind(readiness), cards: cards.map(row => row.id), completeCoursesAdded: 3,
  canonicalPromotions: 3, parentContinuationImageOpens: 16 };
meter.currentResume1816.currentContinuation =
  '139 complete offline courses pushed plus three complete N17/N18/N19 bilingual offline courses retained and ready to commit/push. First science/source/math/visual/cultural reviews reused; only whitespace/native identity/context and N19 opening affected review added. All native finalizations/renders and12desktop/mobile screens PASS. Zero original tasks; no answers/choices invented. Original failures and repair/image usage preserved. Parent opens16; no new paid call, DB/publisher/deploy/merge/closure or formal handoff. Continue after this small batch push.';
meter.deliveryBatches.push({ id: 'D306', cards: cards.map(row => row.id),
  status: 'complete-ready-to-commit-push', newlyCompletedCards: 3,
  evidence: bind(readiness), elapsedSeconds: null, inputTokens: null, outputTokens: null,
  costUsd: null, batchSizing: 'Three complete bilingual courses sharing source-rich electrical/mechanical figures.' });
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(meterFile, JSON.stringify(meter, null, 2) + '\n');
const indexFile = `${T}/evidence/index.json`;
const index = read(indexFile);
for (const file of walk(O)) index.reports.push({ ...bind(file), batch: 'D306' });
index.updatedAt = meter.updatedAt;
fs.writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
console.log(JSON.stringify({ readiness: bind(readiness), products: products.length,
  retainedUniqueBytes: byHash.size, completeUnbatched: cards.map(row => row.id) }));
