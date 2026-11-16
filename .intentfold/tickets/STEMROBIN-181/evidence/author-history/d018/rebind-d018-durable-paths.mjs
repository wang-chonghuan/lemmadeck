import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  ticket, evidence, indexPath, durableFigures, inputsPath, retentionManifest,
  absolute, relative, hash, bytes, read, exists, bind, lookup, verify,
  activePaths, scratch, immutableWrite, finalInputs, figureIds, exactAliases, expectedSha,
} from './retain-d018-evidence.mjs';

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'],
    'Prepared only; Main must separately authorize rebind after completed D018 retention.');
  const { input, inputBytes } = await finalInputs();
  assert.ok(await exists(retentionManifest), 'D018 retention has not been executed.');
  const retained = await read(retentionManifest);
  assert.equal(retained.finalInputs.sha256, hash(inputBytes));
  assert.deepEqual([...retained.scope].sort(), input.completeCards.map(item => item.id).sort());
  assert.deepEqual(retained.excludedCards, input.excludedCards);
  assert.equal(retained.sourceScope.integratedThrough, 166);
  assert.equal(retained.sourceScope.page167ProductOrApproval, false);
  const aliases = await exactAliases(input);
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  const figures = await figureIds(input.completeCards);
  const plans = [];
  const protectedFiles = [];
  for (const id of figures) {
    const file = `${durableFigures}/${id}.independent-review.json`;
    const beforeBytes = await bytes(file);
    const before = JSON.parse(beforeBytes);
    assert.equal(before.id, id);
    assert.equal(before.status, 'pass', 'Use the unique existing gate; never manufacture approval.');
    assert.deepEqual(Buffer.from(`${JSON.stringify(before, null, 2)}\n`), beforeBytes,
      'Unexpected formatting: do not rewrite unrelated report bytes.');
    const after = structuredClone(before);
    const refs = [];
    activePaths(after, (owner, key, sha256, trail) => refs.push({ owner, key, sha256, trail }));
    const replacements = [];
    const expectedByTrail = new Map();
    for (const ref of refs) {
      const original = ref.owner[ref.key];
      const expected = await expectedSha(input, aliases, original, ref.sha256, file, ref.trail);
      expectedByTrail.set(JSON.stringify(ref.trail), expected);
      const present = await exists(original);
      const currentMatches = present && hash(await bytes(original)) === expected;
      if (!scratch(original) && currentMatches) continue;
      const destination = lookup(index, original, expected);
      assert.ok(destination?.startsWith(`${evidence}/`), `No exact retained historical bytes: ${id}/${original}`);
      assert.ok(!scratch(destination));
      await verify(destination, expected);
      assert.ok(![original, destination].some(value =>
        /\/(?:pages|source-pages)\/0167(?:\/|$)/.test(value)),
        'Source167 is historical only, not an active completed-figure binding.');
      ref.owner[ref.key] = destination;
      replacements.push({
        trail: structuredClone(ref.trail),
        original: { path: original, sha256: expected },
        retained: { path: destination, sha256: expected },
        currentOriginalBytesWereDifferent: present && !currentMatches,
      });
    }
    const reversed = structuredClone(after);
    for (const item of replacements) {
      let owner = reversed;
      for (const key of item.trail.slice(0, -1)) owner = owner[key];
      owner[item.trail.at(-1)] = item.original.path;
    }
    assert.deepEqual(Buffer.from(`${JSON.stringify(reversed, null, 2)}\n`), beforeBytes,
      `Only path changes are allowed: ${id}`);
    const active = [];
    activePaths(after, (owner, key, sha256, trail) =>
      active.push({ path: owner[key], sha256, trail }));
    for (const item of active) {
      assert.ok(!scratch(item.path), `Active scratch reference remains: ${id}/${item.path}`);
      assert.ok(await exists(item.path), `Missing active durable path: ${item.path}`);
      const expected = expectedByTrail.get(JSON.stringify(item.trail));
      assert.ok(expected, 'A rebind may not introduce a new unbound active field');
      await verify(item.path, expected);
    }
    assert.ok(after.originalReport?.sha256, 'Missing immutable original independent report');
    await verify(after.originalReport.path, after.originalReport.sha256);
    protectedFiles.push(await bind(after.originalReport.path));
    for (const name of (await fs.readdir(absolute(durableFigures)))
      .filter(name => name.startsWith(`${id}.`) && name !== `${id}.independent-review.json`)) {
      const asset = `${durableFigures}/${name}`;
      protectedFiles.push(await bind(asset));
      if (name.endsWith('.json')) activePaths(await read(asset), (owner, key) =>
        assert.ok(!scratch(owner[key]), `Protected ${name} contains scratch; stop, do not edit spec/media/native metadata.`));
    }
    const backup = `${evidence}/author-history/d018/${id}-before-durable-paths.independent-review.json`;
    const afterBytes = replacements.length ? Buffer.from(`${JSON.stringify(after, null, 2)}\n`) : beforeBytes;
    plans.push({
      id, file, beforeBytes, afterBytes, backup, replacements,
      before: { path: file, sha256: hash(beforeBytes) },
      current: { path: file, sha256: hash(afterBytes) },
      originalGate: structuredClone(after.originalReport), activePathsVerified: active.length,
    });
  }
  for (const item of retained.preservedProducts) {
    if (!plans.some(plan => plan.file === relative(item.path))) protectedFiles.push(item);
  }
  const tracePath = `${ticket}/tmp/d018-durable-path-binding.json`;
  assert.ok(!(await exists(tracePath)), 'Do not repeat a recorded path rebind.');
  const trace = {
    ticket: 'STEMROBIN-181', batch: 'D-018', status: 'exact-path-bindings-rebound-no-new-approval',
    scope: input.completeCards.map(item => item.id),
    excludedCards: input.excludedCards.map(item => ({
      ...structuredClone(item), activePathsRebound: false, productOrFiguresPromoted: false,
    })),
    retention: await bind(retentionManifest),
    figures: plans.map(({ id, before, current, backup, replacements, originalGate, activePathsVerified }) => ({
      id, before, current, preservedBefore: { path: backup, sha256: before.sha256 },
      replacements: structuredClone(replacements), originalGate, activePathsVerified,
    })),
    protectedFiles,
    originalGateAuthorFreezeMediaSpecsNativeRenderGenerationTemplatesUnchanged: true,
    n63PriorIndexPrior64AndN65BeforeFigureTemplateExactAliasesConsumedOnlyByHash: true,
    source167HistoryOnly: true, reused63SurfacesAndPixelReportNotRerun: true,
    sourceScienceFigureGateRepeated: false,
    browserRendererNativeReviewDbGitMeterOrPromotionCalls: 0, inFlightProcesses: [],
  };
  assert.deepEqual(await bytes(inputsPath), inputBytes);
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Concurrent shared index update');
  for (const item of protectedFiles) await verify(item.path, item.sha256);
  for (const plan of plans) {
    assert.deepEqual(await bytes(plan.file), plan.beforeBytes, 'Concurrent independent report change');
    await immutableWrite(plan.backup, plan.beforeBytes);
  }
  for (const plan of plans) {
    assert.deepEqual(await bytes(plan.file), plan.beforeBytes);
    if (plan.replacements.length) await fs.writeFile(absolute(plan.file), plan.afterBytes);
  }
  for (const item of protectedFiles) await verify(item.path, item.sha256);
  for (const plan of plans) await verify(plan.file, plan.current.sha256);
  const traceBytes = Buffer.from(`${JSON.stringify(trace, null, 2)}\n`);
  await immutableWrite(tracePath, traceBytes);
  const retainedTrace = `${evidence}/reports/d018-durable-path-binding.json`;
  await immutableWrite(retainedTrace, traceBytes);
  for (const plan of plans) {
    const record = {
      path: plan.backup, sha256: plan.before.sha256, originalPath: plan.file,
      batch: 'D-018', role: 'Historical gate before path rebind, not the active approval',
    };
    const old = index.reports.find(item => relative(item.path) === record.path);
    if (old) assert.equal(old.sha256, record.sha256);
    else index.reports.push(structuredClone(record));
  }
  index.reports.push({ path: retainedTrace, sha256: hash(traceBytes), originalPath: tracePath, batch: 'D-018' });
  assert.deepEqual(await bytes(inputsPath), inputBytes);
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Concurrent index update; preserve snapshots and stop');
  index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  console.log('D018 exact active paths rebound. Blocked60/62/65, specs/media, original reports and meters unchanged.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
