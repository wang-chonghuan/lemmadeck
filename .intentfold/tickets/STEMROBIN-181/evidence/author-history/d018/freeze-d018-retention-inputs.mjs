import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ticket, durableFigures, indexPath, inputsPath, completeCards, blockedCards, exerciseCard,
  requiredReportNames, finalScreenPaths, reusedCheckpoint, reusedTiles, reusedPixelReview,
  requiredFontAliasManifests, displayCorrectionBindings, verifyEffectiveDisplay,
  absolute, relative, bytes, hash, read, exists, bind, lookup, verify, activePaths,
  immutableWrite, exactAliases, surfaceKey,
} from './retain-d018-evidence.mjs';

// Main supplies the final request with the retention input shape, plus optional
// frozenReports, bindingReports and approvedOutputs. This script writes only scratch inputs JSON.
// approvedOutputs entries are {report:{path,sha256},gate:{path,sha256},
// pathTrail:["promotion","durable","spec"],sha256Trail:["bindings","spec","sha256"]}.
// Explicit activeBindings disambiguate a frozen path with multiple historical SHAs.
// displayCorrection binds the n64 initial/effective result, tiles and review separately.
// The unsuccessful Arial-first attempt stays history; only offline-d018-font-final is effective.
const shaPattern = /^[a-f0-9]{64}$/;
const key = (file, sha256) => `${relative(file)}:${sha256}`;
const trailKey = (report, trail) => `${relative(report)}:${JSON.stringify(trail)}`;
const at = (document, trail) => {
  assert.ok(Array.isArray(trail) && trail.length, 'An exact structured field trail is required.');
  let value = document;
  for (const segment of trail) {
    assert.ok(value && Object.hasOwn(value, segment), `Missing declared field ${trail.join('.')}`);
    value = value[segment];
  }
  return value;
};
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};

async function main() {
  const [execute, requestPath, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && requestPath && extra.length === 0,
    'Prepared only. Main must authorize: --execute <final-request.json>');
  assert.ok(relative(requestPath).startsWith(`${ticket}/tmp/`), 'The Main request must be ticket scratch.');
  assert.notEqual(relative(requestPath), inputsPath);
  assert.ok(!(await exists(inputsPath)), 'Never overwrite or repeat an existing inputs freeze.');
  const requestBytes = await bytes(requestPath);
  const request = JSON.parse(requestBytes);
  const input = structuredClone(request);
  assert.equal(input.batch, 'D018');
  assert.equal(input.final, true, 'Wait for final combine result/tiles/review; provisional files are not accepted.');
  assert.equal(input.sourcePrefix, 166, '167 is unresolved history;168+ is not D018.');
  exactSet(input.completeCards.map(item => item.id), completeCards, 'complete cards');
  exactSet(input.excludedCards.map(item => item.id), blockedCards, 'blocked cards');
  assert.ok(input.excludedCards.every(item => item.status === 'blocked'));
  for (const name of ['figures', 'aliasManifests', 'aliases', 'activeBindings', 'extraEvidence',
    'interactionGates']) {
    assert.ok(Array.isArray(input[name]), `Main must explicitly supply ${name}, empty if unused.`);
  }
  assert.ok(input.figures.every(item => completeCards.includes(item.card) &&
    !['fig-104', 'fig-106', 'fig-110'].includes(item.id)));
  exactSet(input.interactionGates.map(item => `${item.card}:${item.surface}`),
    ['answers', 'choices'].map(surface => `${exerciseCard}:${surface}`), 't7 interaction gates');
  for (const manifest of requiredFontAliasManifests) {
    const fontAliases = await bind(manifest);
    const declaredFontAliases = input.aliasManifests.find(item =>
      relative(item.path) === manifest);
    if (declaredFontAliases) await verify(manifest, declaredFontAliases.sha256);
    else input.aliasManifests.push(structuredClone(fontAliases));
  }
  const correctionBindings = await displayCorrectionBindings(input);
  for (const [name, file] of Object.entries(finalScreenPaths)) {
    assert.equal(relative(input.screens?.[name]?.path ?? ''), file, `Wait for final screens.${name}`);
    await verify(file, input.screens[name].sha256);
  }
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  const aliases = await exactAliases(input);
  const catalog = new Map();
  const documents = new Map();
  const bindingReports = new Set(requiredReportNames.map(name => `${ticket}/tmp/${name}`));
  const pending = [];
  const explicit = new Map();
  const add = (file, sha256, basis) => {
    assert.match(sha256, shaPattern, `Invalid frozen SHA: ${file}`);
    file = relative(file);
    if (!catalog.has(file)) catalog.set(file, new Map());
    const candidates = catalog.get(file);
    if (!candidates.has(sha256)) candidates.set(sha256, structuredClone(basis));
  };
  for (const alias of aliases) {
    const basis = { kind: 'exact-frozen-alias', snapshot: { path: alias.path, sha256: alias.sha256 } };
    add(alias.path, alias.sha256, basis);
    add(alias.originalPath, alias.sha256, basis);
  }
  const resolve = async (file, sha256) => {
    const retained = lookup(index, file, sha256);
    const candidates = [
      ...aliases.filter(item => item.sha256 === sha256 &&
        [item.path, item.originalPath].some(original => relative(original) === relative(file)))
        .map(item => item.path),
      ...(retained ? [retained] : []),
      relative(file),
    ];
    for (const candidate of [...new Set(candidates)]) {
      if (await exists(candidate)) {
        const data = await bytes(candidate);
        if (hash(data) === sha256) return { path: relative(candidate), data };
      }
    }
    assert.fail(`No exact frozen bytes for ${file}:${sha256}; supply a real historical alias, not current scratch.`);
  };
  const queue = (binding, basis) => {
    assert.ok(binding?.path);
    add(binding.path, binding.sha256, basis);
    if (path.extname(binding.path) === '.json') pending.push(structuredClone(binding));
  };
  const roots = [
    ...await Promise.all(requiredReportNames.map(name => bind(`${ticket}/tmp/${name}`))),
    ...input.completeCards.map(item => item.science),
    ...input.excludedCards.map(item => item.report),
    ...input.figures.map(item => item.report),
    ...input.interactionGates.map(item => item.report),
    ...Object.values(input.screens),
    ...correctionBindings,
    ...await Promise.all([reusedCheckpoint, reusedTiles, reusedPixelReview].map(bind)),
    ...(input.frozenReports ?? []),
  ];
  for (const binding of [
    ...input.completeCards.map(item => item.science),
    ...input.excludedCards.map(item => item.report),
    ...input.figures.map(item => item.report),
    ...input.interactionGates.map(item => item.report),
  ]) {
    bindingReports.add(relative(binding.path));
  }
  for (const binding of input.bindingReports ?? []) {
    bindingReports.add(relative(binding.path));
    roots.push(binding);
  }
  for (const binding of correctionBindings) bindingReports.add(relative(binding.path));
  const historyNames = [
    'd018-n64-native-finalization.json', 'd018-n64-offline-render.json',
    '9p-n65-science-review.json', 'd018-p0167-separator-detail.json',
    'source-review-9p-0164-0167.json',
    '9p-next-source-0156-0159/author-freeze.json',
    '9p-next-source-0160-0163/author-freeze.json',
    '9p-next-source-0164-0167/author-freeze.json',
    'freeze-d018-retention-inputs.mjs',
    'd018-vector-font-before/aliases.json', 'd018-n64-vector-font-diagnosis/diagnosis.json',
    'd018-vector-font-first-policy/aliases.json',
    'offline-d018-font-correction/font-ready-capture.json',
    'd018-vector-font-final-tool-binding.json',
  ];
  for (const name of historyNames) {
    const binding = await bind(`${ticket}/tmp/${name}`);
    if (!input.extraEvidence.some(item => key(item.path, item.sha256) === key(binding.path, binding.sha256))) {
      input.extraEvidence.push({
        ...binding, role: name.includes('0167')
          ? 'Original source history/diagnosis;167 unresolved, not product or approval'
          : 'Original D018 report/helper bytes; no repeated gate',
      });
    }
  }
  for (const range of ['0156-0159', '0160-0163']) {
    const file = `${ticket}/tmp/source-review-9p-${range}-finalization-trace.json`;
    roots.push(await bind(file));
  }
  for (const figure of input.figures) {
    const binding = await bind(`${durableFigures}/${figure.id}.independent-review.json`);
    const document = await read(binding.path);
    assert.equal(document.status, 'pass');
    assert.equal(document.id, figure.id);
    assert.equal(document.originalReport.sha256, figure.report.sha256,
      'Active promotion must bind the supplied unique original figure gate.');
    roots.push(binding);
    bindingReports.add(relative(binding.path));
  }
  for (const binding of [...roots, ...input.extraEvidence, ...input.aliasManifests]) {
    await resolve(binding.path, binding.sha256);
    queue(binding, { kind: 'verbatim-frozen-document', document: structuredClone(binding) });
  }
  for (const declaration of input.approvedOutputs ?? []) {
    await verify(declaration.report.path, declaration.report.sha256);
    await verify(declaration.gate.path, declaration.gate.sha256);
    const report = await read(declaration.report.path);
    const gate = await read(declaration.gate.path);
    assert.equal(report.status, 'pass');
    assert.equal(gate.status, 'pass');
    const gateRefs = [];
    activePaths(report, (owner, field, sha256) => {
      if (sha256) gateRefs.push({ path: owner[field], sha256 });
    });
    assert.ok(gateRefs.some(item => key(item.path, item.sha256) ===
      key(declaration.gate.path, declaration.gate.sha256)),
    'The promotion/native report must explicitly bind its existing independent gate.');
    assert.ok(['promotion', 'outputs'].includes(declaration.pathTrail?.[0]),
      'Current output must be an explicit promotion/native-output field, not arbitrary scratch.');
    const file = at(report, declaration.pathTrail);
    const sha256 = at(report, declaration.sha256Trail);
    assert.ok(typeof file === 'string');
    assert.match(sha256, shaPattern);
    await verify(file, sha256);
    queue({ path: file, sha256 }, {
      kind: 'approved-promotion-current-output', report: structuredClone(declaration.report),
      gate: structuredClone(declaration.gate),
      pathTrail: structuredClone(declaration.pathTrail),
      sha256Trail: structuredClone(declaration.sha256Trail),
    });
    queue(declaration.report, { kind: 'verbatim-approved-promotion-report' });
  }
  // Read only JSON explicitly hash-bound by frozen reports. A revised file with
  // different bytes is never used to infer an old report's missing SHA.
  while (pending.length) {
    const binding = pending.shift();
    const identity = key(binding.path, binding.sha256);
    if (documents.has(identity)) continue;
    const resolved = await resolve(binding.path, binding.sha256);
    const document = JSON.parse(resolved.data);
    documents.set(identity, { report: relative(binding.path), binding, resolved: resolved.path, document });
    activePaths(document, (owner, field, sha256, trail) => {
      const pairedSha = field.endsWith('_path')
        ? owner[`${field.slice(0, -5)}_sha256`]
        : owner[`${field}Sha256`];
      const declared = sha256 ?? pairedSha;
      if (!declared) return;
      queue({ path: owner[field], sha256: declared }, {
        kind: 'hash-declared-frozen-input', document: structuredClone(binding), trail: structuredClone(trail),
      });
    });
    for (const surface of document.results ?? []) {
      if (surface.screenshot) add(surface.screenshot, surface.screenshotSha256,
        { kind: 'frozen-offline-screenshot', document: structuredClone(binding) });
      const end = surface.metrics?.scrollEndScreenshot;
      const endSha = surface.metrics?.scrollEndScreenshotSha256;
      if (end || endSha) {
        assert.ok(typeof end === 'string' && end.length);
        add(end, endSha, { kind: 'frozen-full-scroll-end-screenshot', document: structuredClone(binding) });
      }
    }
  }
  for (const item of input.activeBindings) {
    assert.ok(item.report && item.path && Array.isArray(item.trail));
    assert.match(item.sha256, shaPattern);
    const identity = trailKey(item.report, item.trail);
    assert.ok(!explicit.has(identity), 'Duplicate Main active binding');
    explicit.set(identity, structuredClone(item));
  }
  const bindings = [];
  const usedExplicit = new Set();
  for (const { report, document } of documents.values()) {
    if (!bindingReports.has(report)) continue;
    const refs = [];
    activePaths(document, (owner, field, sha256, trail) =>
      refs.push({ path: owner[field], sha256, trail }));
    for (const ref of refs) {
      if (ref.sha256) continue;
      const identity = trailKey(report, ref.trail);
      const specified = explicit.get(identity);
      if (specified) {
        assert.equal(relative(specified.path), relative(ref.path), 'Main binding path/field mismatch');
        usedExplicit.add(identity);
      }
      const candidates = catalog.get(relative(ref.path));
      const hashes = candidates ? [...candidates.keys()] : [];
      const sha256 = specified?.sha256 ?? (hashes.length === 1 ? hashes[0] : undefined);
      assert.ok(sha256 && candidates?.has(sha256),
        `Missing/ambiguous frozen proof: ${report}/${ref.trail.join('.')}. Main must explicitly bind an alias or approved output.`);
      const resolved = await resolve(ref.path, sha256);
      const row = {
        report, trail: structuredClone(ref.trail), path: relative(ref.path), sha256,
        basis: structuredClone(candidates.get(sha256)),
        exactBytes: { path: resolved.path, sha256 },
      };
      const previous = bindings.find(item => trailKey(item.report, item.trail) === identity);
      if (previous) assert.deepEqual(previous, row, 'Different frozen versions require per-document disambiguation.');
      else bindings.push(row);
    }
  }
  exactSet([...usedExplicit], [...explicit.keys()], 'consumed explicit active bindings');
  input.activeBindings = bindings;
  const prior = await read(reusedCheckpoint);
  const result = await read(input.screens.result.path);
  const pixel = await read(input.screens.review.path);
  const tiles = await read(input.screens.tiles.path);
  await verifyEffectiveDisplay(input, result, tiles, pixel);
  assert.ok(['incomplete', 'pass'].includes(prior.status));
  assert.equal(prior.results.length, 4);
  assert.equal(result.status, 'pass');
  assert.equal(pixel.status, 'pass');
  const reused = result.results.filter(item => (item.card ?? item.id) === completeCards[0]);
  exactSet(reused.map(surfaceKey), prior.results.map(surfaceKey), 'four original n63 rows');
  for (const row of reused) {
    assert.deepEqual(row, prior.results.find(item => surfaceKey(item) === surfaceKey(row)),
      'The final combine must copy n63 rows, not alter or rerun them.');
  }
  input.inputFreeze = {
    status: 'exact-input-bindings-frozen-not-a-new-approval',
    request: { path: relative(requestPath), sha256: hash(requestBytes) },
    hashBoundJsonDocuments: documents.size, explicitNoShaBindings: bindings.length,
    blindCurrentScratchHashFallback: false, originalCheckpointStatus: prior.status,
    initial64PixelStatus: 'fail', effective64DisplayCorrectionBound: true,
    final64TextFromCorrectionAndEmptyExercisesFromInitial: true,
    vectorFontBeforeToolAndHtmlAliasesIncluded: true,
    unsuccessfulFirstFontPolicyAndRecoveredAliasesIncludedAsHistory: true,
    fontReadyOriginalResultCheckpointAliasesIncluded: true,
    effective64ResultUsesFinalKaTeXFirstPolicy: true,
    sourcePrefix: 166, source167HistoryOnly: true, source168PlusExcluded: true,
    completeCards: structuredClone(completeCards), blockedCards: structuredClone(blockedCards),
    superseded65SeedCheckpointHistoryOnly: true,
    archiverRepeatedAnySourceScienceFigureOrPixelGate: false,
    productIndexMeterDatabaseGitBrowserOrNativeCalls: 0,
  };
  assert.deepEqual(await bytes(requestPath), requestBytes, 'Concurrent Main request change');
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Concurrent retained-alias index change');
  for (const item of documents.values()) await verify(item.resolved, item.binding.sha256);
  for (const binding of input.activeBindings) await verify(binding.exactBytes.path, binding.sha256);
  for (const binding of input.extraEvidence) await verify(binding.path, binding.sha256);
  await immutableWrite(inputsPath, `${JSON.stringify(input, null, 2)}\n`);
  console.log('D018 scratch inputs frozen. Retention/rebind remain unexecuted and separately authorized.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
