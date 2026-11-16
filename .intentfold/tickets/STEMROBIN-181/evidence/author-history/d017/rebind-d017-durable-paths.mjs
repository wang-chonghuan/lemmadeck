import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  ticket, evidence, indexPath, durableFigures, inputsPath, retentionManifest,
  absolute, relative, hash, bytes, read, exists, bind, lookup, verify,
  activePaths, scratch, immutableWrite, finalInputs, figureIds,
} from './retain-d017-evidence.mjs';

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'],
    'Prepared only; retention must finish and Main must separately authorize --execute.');
  const { input, inputBytes } = await finalInputs();
  assert.ok(await exists(retentionManifest), 'Run only after authorized D017 retention');
  const retained = await read(retentionManifest);
  assert.equal(retained.finalInputs.sha256, hash(inputBytes), 'Retention belongs to different final inputs');
  assert.deepEqual([...retained.scope].sort(), input.completeCards.map(card => card.id).sort());
  assert.deepEqual(retained.excludedCards.map(card => card.id), input.excludedCards.map(card => card.id));
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
    assert.equal(before.status, 'pass', 'Consume the existing unique gate; do not manufacture approval');
    assert.deepEqual(Buffer.from(`${JSON.stringify(before, null, 2)}\n`), beforeBytes,
      'Unexpected report formatting: do not reserialize unrelated bytes');
    const after = structuredClone(before);
    const references = [];
    activePaths(after, (owner, key, sha256, trail) => references.push({ owner, key, sha256, trail }));
    const replacements = [];
    for (const reference of references) {
      const original = reference.owner[reference.key];
      const expected = reference.sha256 ?? hash(await bytes(original));
      if (!scratch(original)) {
        await verify(original, expected);
        continue;
      }
      const retainedPath = lookup(index, original, expected);
      assert.ok(retainedPath?.startsWith(`${evidence}/`), `No exact retained ${id} input: ${original}`);
      assert.ok(!scratch(retainedPath));
      await verify(retainedPath, expected);
      reference.owner[reference.key] = retainedPath;
      replacements.push({
        trail: reference.trail, original: { path: original, sha256: expected },
        retained: { path: retainedPath, sha256: expected },
      });
    }
    const reversed = structuredClone(after);
    for (const replacement of replacements) {
      let owner = reversed;
      for (const key of replacement.trail.slice(0, -1)) owner = owner[key];
      owner[replacement.trail.at(-1)] = replacement.original.path;
    }
    assert.deepEqual(Buffer.from(`${JSON.stringify(reversed, null, 2)}\n`), beforeBytes,
      `Only path changes are allowed: ${id}`);
    const active = [];
    activePaths(after, (owner, key, sha256) => active.push({ path: owner[key], sha256 }));
    for (const binding of active) {
      assert.ok(!scratch(binding.path), `Unresolved active scratch binding: ${id}/${binding.path}`);
      assert.ok(await exists(binding.path), `Missing durable binding: ${binding.path}`);
      if (binding.sha256) await verify(binding.path, binding.sha256);
    }
    assert.ok(after.originalReport?.sha256, `Missing immutable original gate for ${id}`);
    await verify(after.originalReport.path, after.originalReport.sha256);
    protectedFiles.push(await bind(after.originalReport.path));
    for (const name of (await fs.readdir(absolute(durableFigures)))
      .filter(name => name.startsWith(`${id}.`) && name !== `${id}.independent-review.json`)) {
      const asset = `${durableFigures}/${name}`;
      protectedFiles.push(await bind(asset));
      if (name.endsWith('.json')) {
        const metadata = await read(asset);
        activePaths(metadata, (owner, key) => {
          assert.ok(!scratch(owner[key]),
            `Unsupported active scratch path in protected ${name}; report, do not modify spec/media/native metadata.`);
        });
      }
    }
    const backup = `${evidence}/author-history/d017/${id}-before-durable-paths.independent-review.json`;
    const afterBytes = replacements.length ? Buffer.from(`${JSON.stringify(after, null, 2)}\n`) : beforeBytes;
    plans.push({ id, file, beforeBytes, afterBytes, backup, replacements,
      before: { path: file, sha256: hash(beforeBytes) }, after: { path: file, sha256: hash(afterBytes) },
      originalGate: after.originalReport, activePathsVerified: active.length });
  }
  for (const binding of retained.preservedProducts) {
    if (!plans.some(plan => plan.file === relative(binding.path))) protectedFiles.push(binding);
  }
  const tracePath = `${ticket}/tmp/d017-durable-path-binding.json`;
  assert.ok(!(await exists(tracePath)), 'Already recorded: do not rebind a second time');
  const trace = {
    ticket: 'STEMROBIN-181', batch: 'D-017', status: 'path-bindings-verified',
    scope: input.completeCards.map(card => card.id),
    excludedCards: input.excludedCards.map(card => ({ id: card.id, status: card.status,
      originalBlockerReport: card.report, activePathsRebound: false, productAndFiguresStaged: false })),
    retention: await bind(retentionManifest),
    figures: plans.map(({ id, before, after, backup, replacements, originalGate, activePathsVerified }) => ({
      id, before, current: after, preservedBefore: { path: backup, sha256: before.sha256 },
      replacements, originalGate, activePathsVerified,
    })),
    protectedFiles,
    n58PriorAssetPathCorrectionPreserved: true,
    originalGateBytesMediaSpecsRenderGenerationTemplatesUnchanged: true,
    sourceScienceFigureChoiceAnswerGateRepeated: false,
    browserRendererNativeReviewMeterOrDatabaseCalls: 0,
    inFlightProcesses: [],
  };
  assert.deepEqual(await bytes(inputsPath), inputBytes, 'Final inputs changed during preflight');
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Shared evidence index changed during preflight');
  for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
  for (const plan of plans) {
    assert.deepEqual(await bytes(plan.file), plan.beforeBytes, `Concurrent review edit: ${plan.file}`);
    await immutableWrite(plan.backup, plan.beforeBytes);
  }
  for (const plan of plans) {
    assert.deepEqual(await bytes(plan.file), plan.beforeBytes, `Concurrent review edit before write: ${plan.file}`);
    if (plan.replacements.length) await fs.writeFile(absolute(plan.file), plan.afterBytes);
  }
  for (const binding of protectedFiles) await verify(binding.path, binding.sha256);
  for (const plan of plans) await verify(plan.file, plan.after.sha256);
  const traceBytes = Buffer.from(`${JSON.stringify(trace, null, 2)}\n`);
  await immutableWrite(tracePath, traceBytes);
  const retainedTrace = `${evidence}/reports/d017-durable-path-binding.json`;
  await immutableWrite(retainedTrace, traceBytes);
  for (const plan of plans) {
    const record = { path: plan.backup, sha256: plan.before.sha256, originalPath: plan.file,
      batch: 'D-017', role: 'Historical gate before path rebind, not the active approval' };
    const previous = index.reports.find(row => row.path === record.path);
    if (previous) assert.equal(previous.sha256, record.sha256);
    else index.reports.push(record);
  }
  index.reports.push({ path: retainedTrace, sha256: hash(traceBytes), originalPath: tracePath, batch: 'D-017' });
  assert.deepEqual(await bytes(inputsPath), inputBytes, 'Final inputs changed before index update');
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Concurrent evidence index update; preserve new snapshots and stop');
  index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
  console.log(`D017 rebound ${plans.reduce((sum, plan) => sum + plan.replacements.length, 0)} active evidence paths; no gates repeated.`);
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
