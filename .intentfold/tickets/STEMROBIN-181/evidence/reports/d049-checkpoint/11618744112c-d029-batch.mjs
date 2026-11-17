import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  exists, immutableWrite,
} from './retain-d016-evidence.mjs';
import { evidenceProjection } from './stage-d027.mjs';

const [action] = process.argv.slice(2);
assert.ok(['--prepare', '--stage', '--record-push'].includes(action));
const branch = 'codex/STEMROBIN-181-textbooks';
const parent = 'aa0d0dea1b795602b53ece5a9bb9d4f58a84011a';
const cards = [38, 39, 40, 44].map(n => `phy10-c1-s5-n${n}`);
const readyPaths = [38, 39, 40, 44].map(n => `${evidence}/reports/d047-n${n}-readiness.json`);
const sourceReceipts = [
  `${evidence}/reports/d045-source117-119-consumed.json`,
  `${evidence}/reports/d045-source120-123-consumed.json`,
  `${evidence}/reports/d047-source124-125-consumed.json`,
];
const folder = `${ticket}/tmp/d029`;
const manifestPath = `${folder}/manifest.json`;
const finalizationPath = `${evidence}/reports/d029-finalization-binding.json`;
const meterPath = `${ticket}/production-meter.json`;
const ownedTools = [
  'edition.py', 'publish_merge.js', 'render_lesson.js',
].map(name => `.claude/skills/ld-s10y-lesson/tools/${name}`);
const json = buffer => JSON.parse(buffer);
function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: root, encoding: options.binary ? undefined : 'utf8',
    input: options.input, timeout: 180000, maxBuffer: 128 * 1024 * 1024,
    env: { ...process.env, GIT_LITERAL_PATHSPECS: '1' },
  });
  assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
  return result.stdout;
}
const headBytes = file => git(['show', `${parent}:${file}`], { binary: true });
const exact = (a, b) => assert.deepEqual([...a].sort(), [...b].sort());
async function preservedFiles() {
  await verify('.claude/skills/ld-s10y-lesson/tools/assemble.py',
    '4f16b51802a415cebcfec6fb359549027f8b3bd6ba8d62ef0fad5f0187494340');
  await verify('.claude/skills/ld-s10y-lesson/tools/edition.py',
    '123886f27b64f0200f3157280b38c86ac9c208c6da1b53895dc93294ffeb2170');
  const old = await read(`${ticket}/tmp/d032-start/preservation.json`);
  for (const row of old.files.filter(row =>
    row.path !== 'ssot-resources/soviet10year-textbooks/artifacts/10p/book.json')) {
    await verify(row.path, row.sha256);
    assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
  }
  return old;
}
async function context() {
  assert.equal(git(['branch', '--show-current']).trim(), branch);
  const t = await read(`${ticket}/ticket.json`);
  assert.equal(t.finish, 'review');
  assert.equal(t.stage, 'developing');
  assert.equal(t.branch, branch);
  assert.equal(t.worktree, root);
}
await context();
if (action === '--prepare') {
  assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
  assert.equal(git(['rev-parse', `origin/${branch}`]).trim(), parent);
  assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
  assert.equal(await exists(manifestPath), false);
  const preservation = await preservedFiles();
  const meterBefore = await bytes(meterPath);
  const indexBefore = await bytes(indexPath);
  const meter = json(meterBefore);
  const index = json(indexBefore);
  exact(meter.currentCheckpoint.completeUnbatchedCards, cards);
  assert.equal(meter.currentCheckpoint.completeDeliveredCards, 89);
  assert.ok(!meter.deliveryBatches.some(row => row.id === 'D-029'));
  const accepted = [];
  const productFiles = new Set();
  for (const [i, file] of readyPaths.entries()) {
    const ready = await read(file);
    assert.equal(ready.card, cards[i]);
    assert.match(ready.status, /^complete-unbatched-local/);
    assert.equal(ready.SCI, 'PASS');
    assert.equal(ready.ZHEN, 'PASS');
    for (const row of ready.outputs) {
      await verify(row.path, row.sha256);
      assert.ok(row.path.startsWith('ssot-resources/soviet10year-textbooks/artifacts/'));
      productFiles.add(row.path);
    }
    const book = cards[i].startsWith('phy10') ? '10p' : '9p';
    const raw = `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
    const expectedCount = cards[i].endsWith('-n39') ? 6 : 0;
    assert.equal((await read(`${raw}/lessons/${cards[i]}/exercises.json`)).count, expectedCount);
    assert.equal((await read(`${raw}/editions/modern-us-neutral/lessons/${cards[i]}/exercises.json`)).count, expectedCount);
    assert.equal((await read(`${raw}/editions/modern-us-neutral/lessons/${cards[i]}/adaptation.audit.json`)).status, 'pass');
    accepted.push({ card: cards[i], book, readiness: await bind(file), outputs: ready.outputs });
  }
  for (const file of sourceReceipts) {
    const receipt = await read(file);
    assert.equal(receipt.status, 'PASS-source-consumed');
    for (const row of receipt.outputs) {
      await verify(row.path, row.sha256);
      productFiles.add(row.path);
    }
  }
  const report = {
    ticket: 'STEMROBIN-181', batch: 'D029', status: 'pass', branch, parent, cards: accepted,
    counts: { newlyCompletedCards: 4, newUnsolvedWrittenTasks: 6, workedExamples: 0,
      choiceQuestions: (await read(readyPaths[1])).counts.choiceQuestions,
      choiceOptions: (await read(readyPaths[1])).counts.choiceOptions, readOnlyStandardAnswers: 6 },
    currentSourceCounts: { pages: meter.currentCheckpoint.sourcePagesFinalized,
      exerciseObjects: meter.currentCheckpoint.sourceWrittenExercises },
    sourceCountBasis: 'Current confirmed working SOURCE totals; committed page counts derive separately from HEAD plus these explicit owned files.',
    sourceReceipts: await Promise.all(sourceReceipts.map(bind)),
    existingGatesReused: true, fullProjectTestsOrBuildRun: false,
    limits: 'Four independently complete offline cards; all other drafts and holds excluded. No corpus completion, DB writes, merge, deploy or handoff.',
  };
  await immutableWrite(finalizationPath, `${JSON.stringify(report, null, 2)}\n`);
  index.reports.push(await bind(finalizationPath));
  index.updatedAt = new Date().toISOString();
  const evidencePlan = await evidenceProjection(parent, index, { files: preservation.files });
  for (const row of evidencePlan.newlyIndexedFiles) productFiles.add(row.path);
  for (const ownedTool of ownedTools) productFiles.add(ownedTool);
  const helpers = [process.argv[1], `${ticket}/tmp/d046-finalize-wave-card.mjs`,
    `${ticket}/tmp/d047-bind-n40.mjs`];
  report.helpers = await Promise.all(helpers.map(bind));
  meter.deliveryBatches.push({
    id: 'D-029', cards, status: 'complete-pending-commit', targetsAreProvisional: false,
    ...report.counts, currentSourceCounts: report.currentSourceCounts,
    sourceCountBasis: report.sourceCountBasis, evidence: [finalizationPath, ...readyPaths],
    elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null,
  });
  Object.assign(meter.currentCheckpoint.nextBatch, {
    id: 'D-029', status: 'complete-pending-commit', completeCards: cards,
    completeCardClaim: true, targetsAreProvisional: false, targetBatchSize: 4,
  });
  meter.updatedAt = new Date().toISOString();
  assert.deepEqual(await bytes(meterPath), meterBefore);
  assert.deepEqual(await bytes(indexPath), indexBefore);
  await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  productFiles.add(meterPath);
  const ownedFiles = await Promise.all([...productFiles].sort().map(bind));
  await immutableWrite(manifestPath, `${JSON.stringify({
    ...report, finalization: await bind(finalizationPath), ownedFiles,
    evidenceProjection: evidencePlan.projected,
    omittedEvidenceRows: evidencePlan.omittedRows,
    preservation: await bind(`${ticket}/tmp/d032-start/preservation.json`),
  }, null, 2)}\n`);
  console.log(JSON.stringify({ manifest: await bind(manifestPath), ownedFiles: ownedFiles.length,
    completeCards: cards, currentSourceCounts: report.currentSourceCounts }));
} else if (action === '--stage') {
  assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
  assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
  const manifest = await read(manifestPath);
  const preservation = await preservedFiles();
  for (const row of manifest.ownedFiles) await verify(row.path, row.sha256);
  const projections = [];
  for (const book of ['9p', '10p']) {
    const raw = `ssot-resources/soviet10year-textbooks/artifacts/${book}`;
    const modern = `${raw}/editions/modern-us-neutral`;
    const ownCards = cards.filter(card => card.startsWith(book === '9p' ? 'phy9-' : 'phy10-'));
    const source = json(headBytes(`${raw}/book.json`));
    const currentSource = await read(`${raw}/book.json`);
    for (const card of ownCards) {
      assert.ok(!source.lessons.some(row => row.id === card));
      const row = currentSource.lessons.find(row => row.id === card);
      assert.ok(row);
      source.lessons.push(row);
    }
    const headPages = git(['ls-tree', '-r', '--name-only', parent, '--', `${raw}/pages`])
      .split('\n').filter(file => /\/page\.json$/.test(file));
    const ownPages = manifest.ownedFiles.map(row => row.path)
      .filter(file => file.startsWith(`${raw}/pages/`) && file.endsWith('/page.json'));
    source.pages = new Set([...headPages, ...ownPages]).size;
    source.audit.exercise_count = source.lessons.reduce((sum, row) => sum + row.exercises, 0);
    const numbers = new Set();
    for (const row of source.lessons) {
      const working = ownCards.includes(row.id);
      const lesson = json(working ? await bytes(`${raw}/lessons/${row.id}/lesson.json`)
        : headBytes(`${raw}/lessons/${row.id}/lesson.json`));
      const exercises = json(working ? await bytes(`${raw}/lessons/${row.id}/exercises.json`)
        : headBytes(`${raw}/lessons/${row.id}/exercises.json`));
      for (const figure of [...lesson.figures,
        ...exercises.exercises.flatMap(item => item.figures ?? []),
        ...lesson.prose.filter(item => item.kind === 'fig')]) {
        const match = /^fig-(\d+)$/.exec(figure.id ?? '');
        if (match) numbers.add(Number(match[1]));
      }
    }
    source.audit.figure_numbers = [...numbers].sort((a, b) => a - b);
    const scratchRaw = `${folder}/projection/${book}`;
    const scratchModern = `${scratchRaw}/editions/modern-us-neutral`;
    await immutableWrite(`${scratchRaw}/book.json`, `${JSON.stringify(source, null, 2)}\n`);
    await immutableWrite(`${scratchModern}/book.json`, headBytes(`${modern}/book.json`));
    const currentModern = await read(`${modern}/book.json`);
    const rows = ownCards.map(card => currentModern.lessons.find(row => row.id === card));
    assert.ok(rows.every(Boolean));
    const rowsPath = `${folder}/projection/${book}-rows.json`;
    await immutableWrite(rowsPath, `${JSON.stringify(rows, null, 2)}\n`);
    const code = [
      'import sys,json', 'from pathlib import Path',
      "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')", 'import edition',
      'book,modern,rows,profile=map(Path,sys.argv[1:])',
      'edition.update_book_index(book,modern,profile,json.loads(rows.read_text()))',
    ].join('\n');
    const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', code,
      scratchRaw, scratchModern, rowsPath, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'];
    const result = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', timeout: 180000 });
    assert.equal(result.status, 0, result.stderr);
    await immutableWrite(`${folder}/projection/${book}-native-index.json`,
      `${JSON.stringify({ command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`);
    for (const [target, from] of [
      [`${raw}/book.json`, `${scratchRaw}/book.json`],
      [`${modern}/book.json`, `${scratchModern}/book.json`],
    ]) {
      const projected = await read(from);
      const base = json(headBytes(target));
      assert.deepEqual(projected.lessons.filter(row => !ownCards.includes(row.id)), base.lessons);
      projections.push({ target, from, before: await bind(target) });
    }
  }
  const indexProjectionPath = `${folder}/projection/evidence-index.json`;
  await immutableWrite(indexProjectionPath, `${JSON.stringify(manifest.evidenceProjection, null, 2)}\n`);
  projections.push({ target: indexPath, from: indexProjectionPath, before: await bind(indexPath) });
  const projectedPaths = new Set(projections.map(row => row.target));
  const files = manifest.ownedFiles.filter(row => !projectedPaths.has(row.path));
  assert.ok(files.every(row => !row.path.startsWith('app/') &&
    (!row.path.startsWith('.claude/') || ownedTools.includes(row.path)) &&
    !row.path.includes('/charter/') && !row.path.split('/').includes('tmp') && !row.path.includes('.env')));
  git(['add', '--', ...files.map(row => row.path)]);
  for (const projection of projections) {
    const data = await bytes(projection.from);
    const object = git(['hash-object', '-w', '--stdin'], { input: data }).trim();
    git(['update-index', '--cacheinfo', `100644,${object},${projection.target}`]);
  }
  exact(git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean),
    [...files.map(row => row.path), ...projections
      .filter(row => !headBytes(row.target).equals(
        git(['show', `:${row.target}`], { binary: true })))
      .map(row => row.target)]);
  for (const row of files) assert.deepEqual(git(['show', `:${row.path}`], { binary: true }), await bytes(row.path));
  for (const row of projections) {
    assert.deepEqual(git(['show', `:${row.target}`], { binary: true }), await bytes(row.from));
    await verify(row.before.path, row.before.sha256);
  }
  await preservedFiles();
  await immutableWrite(`${folder}/staging.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D029', parent, branch,
    manifest: await bind(manifestPath), files, projections,
    preservedUnownedFiles: preservation.files.length - 1, sharedWorkingIndicesUnchanged: true,
  }, null, 2)}\n`);
  console.log(JSON.stringify({ staged: files.length + projections.length, cards, staging: await bind(`${folder}/staging.json`) }));
} else {
  const currentHead = git(['rev-parse', 'HEAD']).trim();
  assert.notEqual(currentHead, parent);
  assert.equal(git(['rev-parse', `origin/${branch}`]).trim(), currentHead);
  const remote = git(['ls-remote', 'origin', `refs/heads/${branch}`]).trim().split(/\s+/)[0];
  assert.equal(remote, currentHead);
  assert.equal(git(['rev-parse', `${currentHead}^`]).trim(), parent);
  assert.equal(git(['diff', '--cached', '--name-only']).trim(), '');
  await preservedFiles();
  const meterBefore = await bytes(meterPath);
  const meter = json(meterBefore);
  const batch = meter.deliveryBatches.find(row => row.id === 'D-029');
  assert.equal(batch.status, 'complete-pending-commit');
  batch.status = 'complete-committed-pushed';
  batch.commit = currentHead;
  batch.push = `origin/${branch}`;
  batch.pushReceipt = `${folder}/push.json`;
  const cp = meter.currentCheckpoint;
  assert.equal(cp.completeDeliveredCards, 89);
  cp.completeDeliveredCards = 93;
  cp.completeUnbatchedCards = [];
  cp.modernReadyArtifacts = 93;
  cp.readyDoesNotMeanDelivered = '93 complete offline cards pushed through D029; remaining corpus and older HOLDs unfinished.';
  cp.nextBatch = {
    id: 'D-030', previousDeliveryId: 'D-029', status: 'developing', targetBatchSize: 4,
    targetsAreProvisional: true, completeCards: [], completeCardClaim: false,
    currentTargets: ['phy10-c1-s5-n43', 'phy10-c1-s5-n45'],
    blockedTargets: [
      { card: 'phy10-c1-s5-n42', reason: 'Figure80 split-part source layout HOLD; no global stitching approved.' },
      { card: 'phy10-c1-s5-n46', reason: 'SOURCE126/127 homograph HOLD; later boundary evidence does not resolve it.' },
    ],
    remainingBatchSlots: 2,
    sourceTotals: { pages: cp.sourcePagesFinalized, exerciseObjects: cp.sourceWrittenExercises },
  };
  meter.updatedAt = new Date().toISOString();
  await immutableWrite(`${folder}/actual-push.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', batch: 'D029', branch, commit: currentHead, remote,
    cards, completeDeliveredCards: 93, noGateReplay: true, corpusComplete: false,
  }, null, 2)}\n`);
  assert.deepEqual(await bytes(meterPath), meterBefore);
  await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
  console.log(JSON.stringify({ commit: currentHead, remote, completeDeliveredCards: 93, nextBatch: 'D-030' }));
}
