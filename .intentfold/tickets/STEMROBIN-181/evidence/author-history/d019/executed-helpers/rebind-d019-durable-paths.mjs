import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, absolute, relative, hash, bytes,
  read, exists, bind, verify, lookup, activePaths, scratch, immutableWrite,
} from './retain-d016-evidence.mjs';
import { finalInputs, inputsPath, retentionManifest } from './retain-d019-evidence.mjs';

const figuresRoot = `${book}/editions/modern-us-neutral/figures`;
const tracePath = `${ticket}/tmp/d019-durable-path-binding.json`;
const retainedTrace = `${evidence}/reports/d019-durable-path-binding.json`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const recorder = '.agents/skills/ld-s10y-image/scripts/record_review.py';
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const key = trail => JSON.stringify(trail);
const ownerAt = (value, trail) => trail.slice(0, -1).reduce((owner, field) => owner[field], value);
const bindingKey = binding => `${relative(binding.path)}:${binding.sha256}`;

function refs(value) {
  const result = [];
  activePaths(value, (owner, field, sha256, trail) => result.push({
    owner, field, trail, path: owner[field], sha256: sha256 ?? owner[`${field}Sha256`] ?? null,
  }));
  return result;
}

// Permit only existing dependency path/hash fields, never physics, observations,
// status, note text or repair counts. Reversal evidence records every exact delta.
function pathOnly(before, after) {
  const allowed = new Set();
  for (const ref of refs(before)) {
    allowed.add(key(ref.trail));
    if (ref.field === 'path' && 'sha256' in ref.owner) {
      allowed.add(key([...ref.trail.slice(0, -1), 'sha256']));
    }
    if (`${ref.field}Sha256` in ref.owner) {
      allowed.add(key([...ref.trail.slice(0, -1), `${ref.field}Sha256`]));
    }
  }
  const changes = [];
  function compare(a, b, trail = []) {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
      assert.ok(allowed.has(key(trail)), `Non-path metadata change: ${trail.join('.')}`);
      changes.push({ trail, before: a, after: b });
      return;
    }
    assert.equal(Array.isArray(a), Array.isArray(b), 'Metadata shape changed.');
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), `Metadata keys changed: ${trail.join('.')}`);
    for (const field of Object.keys(a)) {
      compare(a[field], b[field], [...trail, Array.isArray(a) ? Number(field) : field]);
    }
  }
  compare(before, after);
  const reversed = structuredClone(after);
  for (const change of changes) ownerAt(reversed, change.trail)[change.trail.at(-1)] = change.before;
  assert.deepEqual(reversed, before, 'Path/hash reversal did not restore the original metadata.');
  return changes;
}

// Final input figureReports explicitly maps each approved card to its raw gate.
// Optional figureGateMapping:[{id,report:{path,sha256}}] can disambiguate a reused
// aggregate gate. reportMappings:[{originalPath,report:{path,sha256}}] explicitly
// binds every promoter placeholder to that raw gate; no basename/SHA-only guess.
// Planned cards67/73/74 remain input-derived3-5cards; n68/n69/n70 are history-only.
export async function prepareRebind(inputFile = inputsPath, resume = false) {
  const { input, inputBytes, file } = await finalInputs(inputFile);
  assert.ok(await exists(retentionManifest), 'Execute approved retention before metadata rebind.');
  const retained = await read(retentionManifest);
  assert.equal(retained.finalInputs.sha256, hash(inputBytes));
  assert.deepEqual([...retained.scope].sort(), input.cards.map(card => card.id).sort());
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  const protectedFiles = new Map();
  const remember = async file => {
    const binding = await bind(file);
    protectedFiles.set(bindingKey(binding), binding);
    return binding;
  };
  const rawGates = new Map();
  const rootByFigure = new Map();
  const sourceByFigure = new Map();
  for (const item of input.figureReports) {
    const mapping = retained.effectiveReports.filter(row =>
      row.original.sha256 === item.report.sha256 && row.label === `${item.card} figure gate`);
    assert.equal(mapping.length, 1, `Missing/ambiguous retained raw gate: ${item.card}`);
    const raw = mapping[0].original;
    await verify(raw.path, raw.sha256);
    protectedFiles.set(bindingKey(raw), raw);
    const report = await read(raw.path);
    assert.equal(report.status, 'pass', 'Do not promote history or regenerate approval.');
    for (const figure of report.figures ?? [report]) {
      assert.equal(figure.status, 'pass');
      if (!rawGates.has(figure.id)) {
        rawGates.set(figure.id, figure);
        rootByFigure.set(figure.id, raw);
        sourceByFigure.set(figure.id, item.report);
      } else {
        const explicit = (input.figureGateMapping ?? []).filter(row => row.id === figure.id);
        assert.equal(explicit.length, 1, `Main must disambiguate figureGate mapping: ${figure.id}`);
        if (explicit[0].report.sha256 === raw.sha256) {
          rawGates.set(figure.id, figure);
          rootByFigure.set(figure.id, raw);
          sourceByFigure.set(figure.id, item.report);
        }
      }
    }
  }
  const targetIds = new Set();
  for (const card of input.cards) {
    const folder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${folder}/lesson.json`);
    const exercises = await read(`${folder}/exercises.json`);
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      await remember(`${folder}/${name}`);
    }
    for (const figure of lesson.figures ?? []) targetIds.add(figure.id);
    for (const block of lesson.prose ?? []) {
      if (block.kind === 'fig') targetIds.add(block.id);
      for (const figure of block.figures ?? []) targetIds.add(figure.id);
    }
    for (const exercise of exercises.exercises ?? []) {
      for (const id of exercise.figure_refs ?? []) targetIds.add(id);
      for (const figure of exercise.figures ?? []) targetIds.add(figure.id);
    }
  }
  assert.ok(targetIds.size, 'Final explicit cards derive no figures.');
  assert.deepEqual([...targetIds].sort(), [...rawGates.keys()].sort(),
    'Explicit figure gates must cover exactly the final cards, never blocked-card history.');
  const metadata = [];
  async function retainedBinding(original, expected, report, trail) {
    if (!expected) {
      const explicit = (input.activeBindings ?? []).filter(item =>
        relative(item.report) === relative(report) && relative(item.path) === relative(original) &&
        key(item.trail) === key(trail));
      assert.equal(explicit.length, 1, `Missing frozen dependency SHA: ${report}/${trail.join('.')}`);
      expected = explicit[0].sha256;
    }
    const stored = lookup(index, original, expected) ??
      retained.frozenInputAliases.find(item =>
        relative(item.originalPath) === relative(original) && item.sha256 === expected)?.path;
    if (!relative(original).startsWith('../') && !scratch(original) &&
      await exists(original) && hash(await bytes(original)) === expected) {
      await remember(original);
      return { path: relative(original), sha256: expected };
    }
    assert.ok(stored && !scratch(stored), `Missing retained exact dependency: ${original} (${expected})`);
    await verify(stored, expected);
    const binding = { path: stored, sha256: expected };
    protectedFiles.set(bindingKey(binding), binding);
    return binding;
  }
  async function rebind(value, report, overrides = new Map()) {
    const after = structuredClone(value);
    for (const ref of refs(after)) {
      const binding = overrides.get(key(ref.trail)) ??
        await retainedBinding(ref.path, ref.sha256, report, ref.trail);
      ref.owner[ref.field] = binding.path;
      if (ref.field === 'path' && 'sha256' in ref.owner) ref.owner.sha256 = binding.sha256;
      else if (`${ref.field}Sha256` in ref.owner) ref.owner[`${ref.field}Sha256`] = binding.sha256;
    }
    return { after, changes: pathOnly(value, after) };
  }
  for (const id of [...targetIds].sort()) {
    assert.ok(rawGates.has(id), `No explicit approved figureGate mapping: ${id}`);
    const gate = rawGates.get(id);
    const rawRoot = rootByFigure.get(id);
    const rawSource = sourceByFigure.get(id);
    const specPath = `${figuresRoot}/${id}.spec.json`;
    const independentPath = `${figuresRoot}/${id}.independent-review.json`;
    const nativePath = `${figuresRoot}/${id}.review.json`;
    const spec = await read(specPath);
    const producerKey = spec.mode === 'generated' ? 'generation' : 'render';
    const producerPath = `${figuresRoot}/${id}.${producerKey}.json`;
    const specBinding = await remember(specPath);
    for (const name of (await fs.readdir(absolute(figuresRoot))).filter(name =>
      name.startsWith(`${id}.`) && ![path.basename(independentPath), path.basename(nativePath),
        path.basename(producerPath)].includes(name))) await remember(`${figuresRoot}/${name}`);
    const beforeFile = file => resume
      ? `${evidence}/author-history/d019/figure-metadata-before/${id}/${path.basename(file)}`
      : file;
    const beforeProducerBytes = await bytes(beforeFile(producerPath));
    const beforeProducer = JSON.parse(beforeProducerBytes);
    const beforeIndependentBytes = await bytes(beforeFile(independentPath));
    const beforeIndependent = JSON.parse(beforeIndependentBytes);
    const beforeNativeBytes = await bytes(beforeFile(nativePath));
    const beforeNative = JSON.parse(beforeNativeBytes);
    assert.equal(beforeIndependent.status, 'pass');
    assert.equal(beforeIndependent.id, id);
    assert.equal(beforeNative.status, 'pass');
    assert.equal(beforeNative.figure, id);
    assert.equal(beforeNative.schema, 'ld-s10y-image/review@1');
    assert.equal(beforeIndependent.bindings.spec.sha256, specBinding.sha256,
      'Current spec must match the approved exact bytes; no spec correction here.');
    assert.equal(gate.bindings.spec.sha256, specBinding.sha256,
      'Explicit raw figure gate must bind the same immutable spec.');
    assert.equal(beforeIndependent.originalReport.sha256, rawRoot.sha256,
      'Promoter placeholder must identify the exact supplied raw gate, not a similarly named report.');
    const placeholder = relative(beforeIndependent.originalReport.path);
    const direct = [relative(rawSource.path), relative(rawRoot.path)].includes(placeholder);
    const reportMappings = input.reportMappings.filter(mapping =>
      relative(mapping.originalPath) === placeholder && mapping.report.sha256 === rawRoot.sha256);
    assert.ok(direct || reportMappings.length === 1,
      `Main must explicitly map promoter originalReport placeholder: ${id}/${placeholder}`);
    for (const mapping of reportMappings) {
      assert.equal(relative(mapping.report.path), relative(rawSource.path),
        `Placeholder maps to another figure gate: ${id}`);
    }
    const approvedProducer = gate.bindings[producerKey];
    assert.ok(approvedProducer?.sha256, `Missing approved ${producerKey}: ${id}`);
    const approved = await retainedBinding(approvedProducer.path, approvedProducer.sha256,
      rawRoot.path, ['bindings', producerKey, 'path']);
    pathOnly(await read(approved.path), beforeProducer);
    const producer = await rebind(beforeProducer, producerPath);
    const producerBytes = producer.changes.length ? encode(producer.after) : beforeProducerBytes;
    const finalProducer = { path: producerPath, sha256: hash(producerBytes) };
    const overrides = new Map([
      [key(['originalReport', 'path']), rawRoot],
      [key(['bindings', 'spec', 'path']), specBinding],
      [key(['bindings', producerKey, 'path']), finalProducer],
      [key(['promotion', 'durable', producerKey]), finalProducer],
    ]);
    const independent = await rebind(beforeIndependent, independentPath, overrides);
    for (const ref of refs(independent.after)) assert.ok(!scratch(ref.path), `Active scratch remains: ${id}`);
    metadata.push({
      id, specBinding, producerKey, producerPath, independentPath, nativePath,
      beforeProducerBytes, beforeIndependentBytes, beforeNativeBytes, beforeNative,
      producerBytes, independentBytes: independent.changes.length ? encode(independent.after) : beforeIndependentBytes,
      producerChanges: producer.changes, independentChanges: independent.changes,
      approvedProducer: approved, originalGate: rawRoot, originalGateSource: rawSource,
      explicitReportMapping: reportMappings[0] ?? null,
    });
  }
  return { input, inputBytes, inputFile: file, retained, index, indexBytes,
    metadata, protectedFiles, recorderBinding: await remember(recorder) };
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Prepared only. After Main final inputs and completed retention: --execute --input <ticket/tmp/final.json>');
    return;
  }
  assert.equal(args.length, 3);
  assert.ok(['--plan', '--execute', '--resume'].includes(args[0]));
  assert.equal(args[1], '--input');
  const resume = args[0] === '--resume';
  const state = await prepareRebind(args[2], resume);
  if (args[0] === '--plan') {
    console.log(JSON.stringify({ scope: state.retained.scope, figures: state.metadata.map(item => item.id),
      renderVisualScienceFinalizeCalls: 0, writes: 0 }, null, 2));
    return;
  }
  assert.ok(!(await exists(tracePath)), 'Metadata path rebind already recorded; do not repeat.');
  const workspace = `${ticket}/tmp/d019-figure-metadata-refresh`;
  assert.equal(await exists(workspace), resume,
    'An interrupted refresh needs explicit --resume; never rerun the recorder.');
  if (!resume) await fs.mkdir(absolute(workspace));
  // Record into scratch first. A recorder failure cannot leave durable metadata
  // half-rewritten; the existing visual approval timestamp and notes are retained.
  for (const item of state.metadata) {
    const producerFile = `${workspace}/${item.id}.${item.producerKey}.json`;
    const generated = `${workspace}/${item.id}.native-review.json`;
    await immutableWrite(producerFile, item.producerBytes);
    if (!resume) {
      execFileSync(absolute(python), [
        '-B', absolute(recorder), '--spec', absolute(item.specBinding.path),
        `--${item.producerKey}`, absolute(producerFile), '--output', absolute(generated),
        '--status', item.beforeNative.status, '--notes', item.beforeNative.notes,
      ], { cwd: root, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' }, stdio: 'inherit' });
    } else {
      assert.ok(await exists(generated), `Missing original recorder output: ${item.id}`);
    }
    const refreshed = await read(generated);
    item.recorderTimestamp = refreshed.reviewedAt;
    refreshed.reviewedAt = item.beforeNative.reviewedAt;
    refreshed[item.producerKey].path = item.producerPath;
    item.nativeChanges = pathOnly(item.beforeNative, refreshed);
    item.nativeBytes = encode(refreshed);
    item.generatedBinding = await bind(generated);
    item.generatedRetainedPath = `${evidence}/author-history/d019/native-metadata-refresh/${item.id}.review.json`;
  }
  for (const binding of state.protectedFiles.values()) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(state.inputFile), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent evidence index update.');
  const changes = [];
  for (const item of state.metadata) {
    for (const [file, beforeBytes, afterBytes, deltas] of [
      [item.producerPath, item.beforeProducerBytes, item.producerBytes, item.producerChanges],
      [item.independentPath, item.beforeIndependentBytes, item.independentBytes, item.independentChanges],
      [item.nativePath, item.beforeNativeBytes, item.nativeBytes, item.nativeChanges],
    ]) {
      assert.deepEqual(await bytes(file), resume ? afterBytes : beforeBytes,
        `Concurrent figure metadata change: ${file}`);
      const backup = `${evidence}/author-history/d019/figure-metadata-before/${item.id}/${path.basename(file)}`;
      await immutableWrite(backup, beforeBytes);
      changes.push({ file, beforeBytes, afterBytes, backup, deltas });
    }
  }
  for (const change of changes) {
    assert.deepEqual(await bytes(change.file), resume ? change.afterBytes : change.beforeBytes);
    if (!resume && !change.beforeBytes.equals(change.afterBytes)) {
      await fs.writeFile(absolute(change.file), change.afterBytes);
    }
  }
  const trace = {
    ticket: 'STEMROBIN-181', batch: 'D-019', status: 'exact-metadata-path-hashes-rebound-no-new-review',
    scope: state.retained.scope, sourceScope: state.retained.sourceScope,
    retention: await bind(retentionManifest),
    figures: state.metadata.map(item => ({
      id: item.id, originalGate: item.originalGate, originalGateSource: item.originalGateSource,
      explicitReportMapping: item.explicitReportMapping, approvedProducer: item.approvedProducer,
      nativeRecorderOutput: { path: item.generatedRetainedPath, sha256: item.generatedBinding.sha256 },
      nativeMetadataRecordedAt: item.recorderTimestamp,
      originalReviewedAtPreserved: item.beforeNative.reviewedAt,
    })),
    changes: changes.map(item => ({
      original: { path: item.backup, sha256: hash(item.beforeBytes) },
      current: { path: item.file, sha256: hash(item.afterBytes) },
      exactPathHashReversal: item.deltas,
    })),
    protectedFiles: [...state.protectedFiles.values()],
    specSvgArtworkBytesAndLessonExercisesFinalizationOutputsUnchanged: true,
    independentOutcomesObservationsNotesAndRepairCountsUnchanged: true,
    nativeRecordReviewMetadataRefreshOnly: true,
    recorderInternalStructuralChecksNotASecondVisualGate: true,
    interruptedMetadataCompletion: resume,
    recorderCallsThisInvocation: resume ? 0 : state.metadata.length,
    sourceSciencePixelRenderFinalizeDbGitOrMeterCalls: 0,
  };
  const mutable = new Set(changes.map(item => item.file));
  for (const binding of state.protectedFiles.values()) {
    if (!mutable.has(binding.path)) await verify(binding.path, binding.sha256);
  }
  for (const item of changes) await verify(item.file, hash(item.afterBytes));
  const traceBytes = encode(trace);
  await immutableWrite(tracePath, traceBytes);
  await immutableWrite(retainedTrace, traceBytes);
  for (const item of changes) state.index.reports.push({
    path: item.backup, sha256: hash(item.beforeBytes), originalPath: item.file,
    batch: 'D-019', role: 'Verbatim metadata before path/hash-only rebind; no new approval',
  });
  for (const item of state.metadata) {
    const target = item.generatedRetainedPath;
    await immutableWrite(target, await bytes(item.generatedBinding.path));
    state.index.reports.push({ path: target, sha256: item.generatedBinding.sha256,
      originalPath: item.generatedBinding.path, batch: 'D-019', role: 'Recorder output, metadata-only not a new visual review' });
  }
  state.index.reports.push({ path: retainedTrace, sha256: hash(traceBytes), originalPath: tracePath, batch: 'D-019' });
  assert.deepEqual(await bytes(state.inputFile), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent index update; immutable backups remain.');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), encode(state.index));
  console.log('D019 figure metadata paths/hashes rebound. Existing review times/outcomes, spec/SVG and lesson outputs preserved.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
