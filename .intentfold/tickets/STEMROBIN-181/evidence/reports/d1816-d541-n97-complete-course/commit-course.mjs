import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/evidence/reports/d1816-d541-n97-complete-course`;
const C = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const ID = 'phy10-c2-s4-n97';
const git = (...args) => execFileSync('git', args, {
  cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
}).trim();
const read = file => JSON.parse(fs.readFileSync(file));
const bytes = value => JSON.stringify(value, null, 2) + '\n';
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const ready = read(`${O}/batch-ready.json`);
assert.equal(ready.status, 'complete-retained-unbatched');
assert.deepEqual(ready.cards, [ID]);
assert.equal(git('rev-parse', '--short=9', 'HEAD'), '1d5f41e14');
assert.equal(git('diff', '--cached', '--name-only'), '');
const base = git('rev-parse', 'HEAD');
const remoteHead = git('ls-remote', '--exit-code', 'origin',
  'refs/heads/codex/STEMROBIN-181-textbooks').split(/\s+/)[0];
assert.equal(git('merge-base', remoteHead, base), remoteHead);
for (const row of [...ready.products, ...ready.sourceProducts]) verify(row);
verify(ready.sourceBook);
const stageJson = (file, value) => {
  const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], {
    cwd: repo, input: bytes(value), encoding: 'utf8',
  }).trim();
  git('update-index', '--cacheinfo', `100644,${blob},${file}`);
};
const indexes = [`${C}/book.json`, ...['modern-us-neutral', 'modern-us-neutral-en']
  .map(edition => `${C}/editions/${edition}/book.json`)];
const selectedIndexes = [];
for (const file of indexes) {
  const original = JSON.parse(git('show', `HEAD:${file}`));
  const current = read(file);
  assert(!original.lessons.some(row => row.id === ID));
  const row = current.lessons.find(row => row.id === ID);
  assert(row);
  const selected = structuredClone(original);
  const order = new Map(current.lessons.map((item, index) => [item.id, index]));
  selected.lessons.push(row);
  selected.lessons.sort((left, right) => order.get(left.id) - order.get(right.id));
  selectedIndexes.push({ file, selected, working: bind(file) });
}
const meterFile = `${T}/production-meter.json`;
const working = read(meterFile);
const selected = JSON.parse(git('show', `HEAD:${meterFile}`));
for (const meter of [working, selected]) {
  assert.equal(meter.currentCheckpoint.completeDeliveredCards, 146);
  assert.equal(meter.sourcePagesFinalized, 577);
  assert.equal(meter.modernCardsFinalized, 78);
  assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
}
const beforeReview = bind(`${O}/before-review.md`);
assert.equal(beforeReview.sha256, selected.currentResume1816.D532.review.sha256);
working.currentResume1816.D532.review.path = beforeReview.path;
selected.currentResume1816.D532.review.path = beforeReview.path;
const pins = {
  D534: `${T}/evidence/reports/d1816-d534-n97-fig223224-local-repair/report.json`,
  D535: `${T}/evidence/reports/d1816-d535-n97-fig225-local-repair/repair.json`,
  D536: `${T}/evidence/reports/d1816-d536-n97-affected-review/report.json`,
  D541: `${O}/batch-ready.json`,
};
for (const [key, file] of Object.entries(pins)) {
  assert(!Object.hasOwn(working.currentResume1816, key));
  const record = { evidence: bind(file), completeCoursesAdded: key === 'D541' ? 1 : 0,
    sourcePagesAdded: 0, paidCalls: 0, formalHandoffComplete: false,
    status: key === 'D541' ? 'ONE_COMPLETE_N97_RETAINED_PUSH_PENDING' : read(file).status };
  working.currentResume1816[key] = record;
  selected.currentResume1816[key] = record;
}
const continuation = ' D534/D535 repaired only N97 axis/point label placement and restored approved rigid-rod context; all geometry and source inventories preserved. D536 independent affected PASS, D538 bilingual native PASS with EN printed_title-only technical recovery, D539 four offline surfaces PASS and D540 independent six-screenshot DISPLAY PASS composed without prior review replay. D541 retained one complete bilingual N97 with3 figures/0 tasks;0 new source pages. N97 content push pending;146 pushed courses/577 approved pages unchanged until verified push. All old failures/HOLDs remain; no DB/publisher/merge/deploy/closure or global checks. Prepared genuinely missing 10p physical274/275 and started fresh bounded SOURCE author.';
working.currentResume1816.currentContinuation += continuation;
selected.currentResume1816.currentContinuation = working.currentResume1816.currentContinuation;
for (const meter of [working, selected]) {
  meter.currentCheckpoint.completeUnbatchedCards = [ID];
  meter.currentCheckpoint.indexedSourceCards['10p'] =
    selectedIndexes.find(row => row.file === `${C}/book.json`).selected.lessons.length;
  meter.deliveryBatches.push({
    id: 'D1816-D541', cards: [ID], status: 'complete-ready-to-commit-push',
    newlyCompletedCards: 1, evidence: bind(`${O}/batch-ready.json`),
    inputTokens: null, outputTokens: null, costUsd: null,
  });
}
fs.writeFileSync(meterFile, bytes(working));
const reportDirectories = [
  `${T}/evidence/reports/d1816-d534-n97-fig223224-local-repair`,
  `${T}/evidence/reports/d1816-d535-n97-fig225-local-repair`,
  `${T}/evidence/reports/d1816-d536-n97-affected-review`, O,
];
fs.copyFileSync(import.meta.filename, `${O}/commit-course.mjs`, fs.constants.COPYFILE_EXCL);
fs.copyFileSync(`${T}/tmp/d1816-recovery/commit-d542-n97-course.first.mjs`,
  `${O}/commit-course.first.mjs`, fs.constants.COPYFILE_EXCL);
const firstAttempt = `${O}/native/d542-n97-first-narrow-commit`;
fs.mkdirSync(firstAttempt, { recursive: true });
for (const name of ['receipt.json', 'stdout.txt', 'stderr.txt'])
  fs.copyFileSync(`${T}/tmp/d1816-recovery/native/d542-n97-first-narrow-commit/${name}`,
    `${firstAttempt}/${name}`, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(`${O}/commit-scope.json`, bytes({
  base, remoteHead, ordinaryFastForwardOnly: true,
  branch: 'codex/STEMROBIN-181-textbooks', cards: [ID],
  indexedFieldsOnly: 'Add and TOC-sort N97 row; preserve all other HEAD rows and index fields.',
  meterFieldsOnly: ['currentResume1816.D532.review.path', 'currentResume1816.D534',
    'currentResume1816.D535', 'currentResume1816.D536', 'currentResume1816.D541',
    'currentResume1816.currentContinuation', 'currentCheckpoint.completeUnbatchedCards',
    'currentCheckpoint.indexedSourceCards.10p', 'deliveryBatches appended D1816-D541'],
  ready: bind(`${O}/batch-ready.json`), workingIndexes: selectedIndexes.map(row => row.working),
  unrelatedDirtyContentPreserved: true, coursesPushed: 146, pages: 577,
  paidCalls: 0, databaseWrites: false, formalHandoff: false,
}), { flag: 'wx' });
const normalFiles = [...ready.products, ...ready.sourceProducts]
  .map(row => path.relative(repo, row.path)).filter(file => !indexes.includes(file));
git('add', '--', ...normalFiles, ...reportDirectories, `${T}/review.md`);
for (const row of selectedIndexes) stageJson(row.file, row.selected);
stageJson(meterFile, selected);
const allowed = new Set([...normalFiles, ...indexes, meterFile, `${T}/review.md`]);
const staged = git('diff', '--cached', '--name-only').split('\n');
assert(staged.every(file => allowed.has(file) ||
  reportDirectories.some(directory => file.startsWith(`${directory}/`))));
assert(staged.every(file => !/(^|\/)\.env(?:$|\/)/.test(file)));
git('diff', '--cached', '--check');
git('commit', '--quiet', '-m', 'STEMROBIN-181: complete bilingual N97 with composed figure and offline display approval');
console.log(JSON.stringify({ contentCommit: git('rev-parse', 'HEAD'), course: ID,
  readyToPush: true, coursesPushed: 146, approvedSourcePages: 577 }));
