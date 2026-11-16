import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, collections, absolute, relative,
  bytes, read, exists, bind, verify, immutableWrite,
} from './retain-d016-evidence.mjs';
import { inputsPath, retentionManifest } from './retain-d019-evidence.mjs';

// Preparation only. Main supplies the final SHA-bound file list and separately
// authorizes --execute; no dirty-file discovery, recorder, gate or commit runs.
const completeCards = [67, 73, 74].map(n => `phy9-c2-s2-n${n}`);
const historicalCards = [68, 69, 70].map(n => `phy9-c2-s2-n${n}`);
const sourceCards = Array.from({ length: 10 }, (_, i) => `phy9-c2-s2-n${66 + i}`);
const modern = `${book}/editions/modern-us-neutral`;
const book10 = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const figureIds = ['fig-113', 'fig-114', 'fig-138', 'fig-139'];
const sourceScope = [
  { book: '9p', pages: Array.from({ length: 19 }, (_, i) => 168 + i), pageOnly: false },
  { book: '10p', pages: [60, 61, 62, 63], pageOnly: true },
];
const reboundPath = `${evidence}/reports/d019-durable-path-binding.json`;
const finalizationPath = `${evidence}/reports/d019-finalization-binding.json`;
const meterPath = `${ticket}/production-meter.json`;
const output = `${ticket}/tmp/d019-staging-boundary.json`;
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
const normalizeScope = rows => ['9p', '10p'].map(name => ({
  book: name,
  pages: rows.filter(row => row.book === name).flatMap(row => row.pages).sort((a, b) => a - b),
  pageOnly: rows.filter(row => row.book === name).every(row => row.pageOnly === true),
}));
function local(file) {
  assert.equal(typeof file, 'string');
  const name = relative(file);
  assert.ok(name && !name.startsWith('../') && !path.isAbsolute(name), `Outside workspace: ${file}`);
  return name;
}
function safePath(file) {
  assert.ok(!file.startsWith('.tmp/') && !file.split('/').includes('tmp'), `Scratch is not staged: ${file}`);
  assert.ok(!/(^|\/)(?:\.env(?:\.|$)|[^/]*(?:credential|secret|private[-_]?key)[^/]*$)/i.test(file),
    `Forbidden secret path: ${file}`);
  assert.ok(!/\.(?:pem|key|p12|pfx)$/i.test(file), `Forbidden key material: ${file}`);
}
async function noSymlink(file) {
  let current = root;
  for (const part of file.split('/')) {
    current = path.join(current, part);
    assert.ok(!(await fs.lstat(current)).isSymbolicLink(), `Unexpected symlink: ${file}`);
  }
}

async function main() {
  const [execute, requestPath, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && requestPath && !extra.length,
    'Prepared only: --execute <final-staging-request.json> requires separate Main authorization.');
  assert.ok(local(requestPath).startsWith(`${ticket}/tmp/`));
  const requestBytes = await bytes(requestPath);
  const request = JSON.parse(requestBytes);
  assert.equal(request.batch, 'D019');
  assert.equal(request.final, true);
  assert.ok(!(await exists(output)), 'Do not repeat an existing staging operation.');
  assert.equal(local(request.finalization.path), finalizationPath);
  await verify(finalizationPath, request.finalization.sha256);

  const inputBytes = await bytes(inputsPath);
  const input = JSON.parse(inputBytes);
  const retainedBinding = await bind(retentionManifest);
  const retained = await read(retentionManifest);
  const reboundBinding = await bind(reboundPath);
  const rebound = await read(reboundPath);
  const finalized = await read(finalizationPath);
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  const meterBytes = await bytes(meterPath);
  const batch = JSON.parse(meterBytes).deliveryBatches.find(item => item.id === 'D-019');
  assert.equal(input.batch, 'D019');
  assert.equal(input.final, true);
  exactSet(input.cards.map(card => card.id), completeCards, 'Final modern cards');
  exactSet(input.historicalCards.map(card => card.id), historicalCards, 'Blocked history only');
  assert.deepEqual(normalizeScope(input.sourceTraces), sourceScope);
  assert.equal(retained.status, 'existing-evidence-retention-only-no-new-approval');
  exactSet(retained.scope, completeCards, 'Retained scope');
  exactSet(retained.excludedModernCards, historicalCards, 'Retained exclusions');
  assert.deepEqual(normalizeScope(retained.sourceScope), sourceScope);
  assert.equal(retained.finalInputs.originalPath, inputsPath);
  await verify(inputsPath, retained.finalInputs.sha256);
  await verify(retained.finalInputs.path, retained.finalInputs.sha256);
  assert.equal(rebound.status, 'exact-metadata-path-hashes-rebound-no-new-review');
  exactSet(rebound.scope, completeCards, 'Rebound scope');
  assert.deepEqual(rebound.retention, retainedBinding);
  assert.equal(finalized.batch, 'D019');
  assert.equal(finalized.status, 'pass');
  exactSet(finalized.cards.map(card => card.card), completeCards, 'Finalization scope');
  assert.deepEqual(finalized.retention, retainedBinding);
  assert.deepEqual(finalized.rebound, reboundBinding);
  assert.equal(finalized.sourcePrefix, 186);
  assert.deepEqual(finalized.unresolvedSourcePages, [167, 187]);
  assert.equal(batch.status, 'complete-pending-commit');
  exactSet(batch.cards, completeCards, 'Meter scope');
  exactSet(retained.figures, figureIds, 'Complete-card figures');
  exactSet(rebound.figures.map(figure => figure.id), figureIds, 'Rebound figures');

  const allowed = new Set([`${book}/book.json`, `${modern}/book.json`,
    meterPath, indexPath, retentionManifest, reboundPath, finalizationPath]);
  for (const card of sourceCards) for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    allowed.add(`${book}/lessons/${card}/${name}`);
  }
  for (const card of completeCards) for (const name of [
    'lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json',
  ]) allowed.add(`${modern}/lessons/${card}/${name}`);
  for (const id of figureIds) for (const suffix of [
    'svg', 'spec.json', 'render.json', 'independent-review.json', 'review.json',
  ]) allowed.add(`${modern}/figures/${id}.${suffix}`);
  for (const scope of sourceScope) {
    const folder = scope.book === '9p' ? book : book10;
    for (const page of scope.pages) {
      const pageFolder = `${folder}/pages/${String(page).padStart(4, '0')}`;
      for (const name of ['page.md', 'page.json', 'audit.json']) allowed.add(`${pageFolder}/${name}`);
      const parsed = await read(`${pageFolder}/page.json`);
      assert.equal(parsed.meta.book, scope.book);
      assert.equal(parsed.meta.page, page);
      for (const figure of parsed.meta.figures ?? []) {
        assert.match(figure.id, /^(?:fig-\d+|tbl-p\d{4}-\d+)$/);
        assert.ok(!['fig-101', 'fig-102'].includes(figure.id), 'Inherited figures stay protected.');
        for (const suffix of ['png', 'svg']) allowed.add(`${folder}/figures/${figure.id}.${suffix}`);
      }
    }
  }
  // Evidence paths must be individually registered for this batch, never a
  // recursive directory permission that could admit future/D018 candidates.
  const evidenceHashes = new Map();
  const destinations = [
    `${evidence}/author-history/d019/`, `${evidence}/offline/d019/`,
    `${evidence}/pixels/d019/`, `${evidence}/reports/d019/`,
  ];
  for (const collection of collections) for (const row of index[collection] ?? []) {
    if (row.batch !== 'D-019') continue;
    if (row.role === 'Exact SHA alias for preserved historical bytes; no new approval') continue;
    const file = local(row.path);
    assert.ok(destinations.some(prefix => file.startsWith(prefix)) ||
      [retentionManifest, reboundPath, finalizationPath].includes(file),
    `Unexpected D019 evidence destination: ${file}`);
    allowed.add(file);
    const prior = evidenceHashes.get(file);
    if (prior) assert.equal(prior, row.sha256, `Conflicting retained hashes: ${file}`);
    evidenceHashes.set(file, row.sha256);
  }
  const expectedOutputs = finalized.cards.flatMap(card => card.outputs);
  for (const binding of [...expectedOutputs, ...rebound.changes.map(change => change.current)]) {
    assert.ok(allowed.has(local(binding.path)), `Unexpected finalized/rebound output: ${binding.path}`);
    await verify(binding.path, binding.sha256);
  }
  assert.ok(Array.isArray(request.files) && request.files.length, 'Main supplies exact file bindings.');
  const paths = request.files.map(item => local(item.path));
  exactSet(paths, [...new Set(paths)], 'Staging paths');
  for (const [i, file] of paths.entries()) {
    assert.ok(allowed.has(file), `Outside exact D019 whitelist: ${file}`);
    safePath(file);
    await noSymlink(file);
    if (evidenceHashes.has(file)) assert.equal(request.files[i].sha256, evidenceHashes.get(file));
    await verify(file, request.files[i].sha256);
  }
  for (const file of [indexPath, meterPath, finalizationPath, retentionManifest, reboundPath]) {
    assert.ok(paths.includes(file), `Missing final staging metadata: ${file}`);
  }
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  assert.equal(git(['branch', '--show-current']), 'codex/STEMROBIN-181-textbooks');
  const stagedNames = () => execFileSync('git', ['diff', '--cached', '--name-only', '-z'],
    { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const existingStaged = stagedNames();
  if (existingStaged.length) exactSet(existingStaged, paths, 'Preserve existing staged work');
  assert.deepEqual(await bytes(requestPath), requestBytes, 'Concurrent request change.');
  assert.deepEqual(await bytes(inputsPath), inputBytes, 'Concurrent retention input change.');
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Concurrent evidence index change.');
  assert.deepEqual(await bytes(meterPath), meterBytes, 'Concurrent meter change.');
  for (const binding of [retainedBinding, reboundBinding, request.finalization, ...request.files]) {
    await verify(binding.path, binding.sha256);
  }
  if (!existingStaged.length) git(['add', '--', ...paths]);
  const staged = stagedNames();
  exactSet(staged, paths, 'Only declared changed files staged; never unstage on failure');
  await immutableWrite(output, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D-019', status: 'staged-with-explicit-boundary',
    request: await bind(requestPath), finalization: request.finalization,
    retained: retainedBinding, rebound: reboundBinding,
    branch: git(['branch', '--show-current']), parent: git(['rev-parse', 'HEAD']),
    completeCards, sourceOnlyCards: sourceCards, sourceScope, stagedFiles: staged,
    exactAllowedPaths: [...allowed].sort(),
    excluded: ['Source167/187/188+', '10p modern index/n5 and all other10p modern files',
      'Modern68/69/70 and D018n65 candidates except retained D019 history',
      '9pt4/fig101/fig102', 'Scratch/secrets/tools/app/dependencies/Charter'],
    sourceScienceFigurePixelOrNativeGatesRepeated: false, commitOrPushPerformed: false,
  }, null, 2)}\n`);
  console.log(`D019 explicit staging complete: ${staged.length} files; no commit or push.`);
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
