import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import {
  ticket, indexPath, durableFigures, completeCards, blockedCards, exerciseCard,
  requiredReportNames, requiredFontAliasManifests, finalScreenPaths,
  initial64DisplayPaths, final64DisplayResultPath, fontFinalFolder, figureIds,
  absolute, relative, bytes, hash, read, exists, bind, lookup, verify, immutableWrite, activePaths,
} from './retain-d018-evidence.mjs';

const work = `${ticket}/tmp`;
const destination = process.argv[4] ?? `${work}/d018-retention-request.json`;
const independent64 = {
  path: `${work}/d018-n64-vector-font-screenshot-correction.json`,
  sha256: '95addb86f9757c2790d1bca57ab900790d02bf002b691c7587ab322a16f23906',
};
const extraRootNames = [
  'd018-n63-unit-erratum/before.json',
  '9p-n62-prepared-baseline.json',
  '9p-t7-before/bindings.json', '9p-t7-f1-before/bindings.json',
  '9p-t7-author-check.json', '9p-t7-correction-freeze.json', '9p-t7-science-correction.json',
  'd018-t7-native-finalization.json', '9p-t7-answer-author-freeze.json',
  '9p-t7-answer-review.json', 'd018-t7-answer-native-finalization.json',
  '9p-t7-choice-reasoning-freeze.json', '9p-t7-choice-author-manifest.json',
  '9p-t7-choice-structural.json', '9p-t7-choice-seed-source-reviews.json',
  '9p-t7-choice-views.json', '9p-t7-choice-blind-freeze.json',
  '9p-t7-choice-author-comparison.json', '9p-t7-choice-review.json',
  '9p-t7-choice-review-provenance.json',
  '9p-t7-choice-validation.json', 'd018-t7-offline-render.json',
  'd018-t7-layout-correction.json', 'd018-t7-choice-layout-diagnosis.json',
  'answer-review-9p-ex9-capture.json', 'answer-review-9p-ex9-capture-promotion.json',
  'source-review-9p-0156-0159-finalization-trace.json',
  'source-review-9p-0160-0163-finalization-trace.json',
];

// After final screens exist, Main supplies --execute <plan.json>.
// Plan: {batch:"D018",final:true,aliases:[],aliasManifests:[],extraEvidence:[],
// frozenReports:[],bindingReports:[],bindingProofs:[],outputReports:[]}.
// bindingProofs: {report:{path,sha256},trail,proof:{path,sha256},proofTrail}.
// proofTrail selects a {path,sha256|byte_sha256} declaration, never current-file hashing.
// outputReports: {report:{path,sha256},gateTrail}, for additional native outputs arrays.
// This writes only the request. Existing freeze/retain/rebind/stage remain unexecuted.
async function main() {
  const [execute, planPath, requestedDestination, ...extra] = process.argv.slice(2);
  assert.ok(execute === '--execute' && planPath && !extra.length,
    'Prepared only: --execute <final-composer-plan.json> after final t7 gates/screens.');
  assert.ok(relative(planPath).startsWith(`${work}/`));
  assert.ok(relative(destination).startsWith(`${work}/`));
  assert.notEqual(relative(planPath), destination);
  assert.ok(!(await exists(destination)), 'Never overwrite an existing retention request.');
  const planBytes = await bytes(planPath);
  const plan = JSON.parse(planBytes);
  assert.equal(plan.batch, 'D018');
  assert.equal(plan.final, true);
  const documents = new Map();
  const load = async binding => {
    await verify(binding.path, binding.sha256);
    const file = relative(binding.path);
    const identity = `${file}:${binding.sha256}`;
    if (!documents.has(identity)) documents.set(identity, await read(file));
    return documents.get(identity);
  };
  const rootBinding = async file => {
    // Current immutable report roots are frozen now; historical input SHAs come from declarations.
    const binding = await bind(file);
    await load(binding);
    return binding;
  };
  const at = (document, trail) => {
    let value = document;
    for (const key of trail) {
      assert.ok(value && Object.hasOwn(value, key), `Missing proof field: ${trail.join('.')}`);
      value = value[key];
    }
    return value;
  };
  const gates = await Promise.all([
    ['answers', 'd018-t7-answer-native-finalization.json'],
    ['choices', '9p-t7-choice-validation.json'],
  ].map(async ([surface, name]) => {
    const report = await rootBinding(`${work}/${name}`);
    assert.equal((await load(report)).status, 'pass', `Wait for t7 ${surface} native gate.`);
    return { card: exerciseCard, surface, report };
  }));
  const render = await rootBinding(`${work}/d018-t7-offline-render.json`);
  assert.equal((await load(render)).status, 'pass');
  const screens = Object.fromEntries(await Promise.all(Object.entries(finalScreenPaths)
    .map(async ([key, file]) => [key, await rootBinding(file)])));
  assert.equal((await load(screens.result)).status, 'pass');
  assert.equal((await load(screens.review)).status, 'pass', 'Wait for the final combined display evidence.');
  await load(independent64);
  const frozenReports = await Promise.all([...new Set([
    ...requiredReportNames, ...extraRootNames,
  ])].map(name => rootBinding(`${work}/${name}`)));
  frozenReports.push(independent64, ...(plan.frozenReports ?? []));
  for (const binding of plan.frozenReports ?? []) await load(binding);
  const aliases = structuredClone(plan.aliases ?? []);
  const aliasManifests = await Promise.all([...new Set([
    `${work}/d018-bound-inputs/snapshot-60-62-63.json`,
    `${work}/d018-bound-inputs/snapshot-64.json`,
    `${work}/d018-n63-prior-index-archival-recovery.json`,
    `${work}/d018-prior64-recovery/recovery.json`,
    `${work}/d018-t7-layout-before/aliases.json`,
    `${work}/d018-t7-helper-archival-recovery/aliases.json`,
    `${work}/d018-source-index-archival-recovery/aliases.json`,
    `${work}/d018-n62-shared-book-template-recovery/aliases.json`,
    ...requiredFontAliasManifests,
  ])].map(rootBinding));
  aliasManifests.push(...(plan.aliasManifests ?? []));
  for (const binding of plan.aliasManifests ?? []) await load(binding);
  const manifestAliases = [];
  for (const binding of aliasManifests) {
    const document = await load(binding);
    manifestAliases.push(
      ...(document.files ?? []), ...(document.exact_aliases ?? []),
      ...(document.recovered?.originalPath ? [document.recovered] : []),
    );
  }
  for (const name of ['9p-t7-before/bindings.json', '9p-t7-f1-before/bindings.json']) {
    const snapshot = await load(frozenReports.find(binding =>
      relative(binding.path) === `${work}/${name}`));
    for (const entry of [
      ...Object.values(snapshot.templates ?? {}),
      ...(snapshot.exercisesTemplateBefore ? [snapshot.exercisesTemplateBefore] : []),
    ]) aliases.push({
      path: entry.path, originalPath: entry.metadata.original, sha256: entry.sha256,
      role: 'Exact declared t7 prepared-before or task5 F1-before bytes; not corrected-current substitution',
    });
  }
  const captureGate = await load(frozenReports.find(binding =>
    relative(binding.path) === `${work}/answer-review-9p-ex9-capture.json`));
  aliases.push({
    path: `${work}/9p-ex9-answer-capture/before44.answers.json`,
    originalPath: captureGate.bindings.prior44Answers.path,
    sha256: captureGate.bindings.prior44Answers.sha256,
    role: 'Exact pre-append answer capture snapshot, not the current 51-answer file',
  });
  const sourceBefore = await load(frozenReports.find(binding =>
    relative(binding.path) === `${work}/d018-n63-unit-erratum/before.json`));
  for (const snapshot of sourceBefore.preserved) {
    assert.equal(snapshot.active.sha256, snapshot.preserved.sha256);
    aliases.push({
      ...snapshot.preserved, originalPath: snapshot.active.path,
      role: 'Exact source snapshot before the already registered n63 metadata erratum',
    });
  }
  const sourceRoot = 'ssot-resources/soviet10year-textbooks/artifacts/9p/';
  for (const alias of [...aliases, ...manifestAliases]) {
    if (!relative(alias.originalPath ?? '').startsWith(`${sourceRoot}lessons/`)) continue;
    aliases.push({
      path: alias.path, sha256: alias.sha256,
      originalPath: relative(alias.originalPath).slice(sourceRoot.length),
      role: 'Book-relative source.path refers to the same declared 9p source snapshot',
    });
  }
  for (const report of frozenReports) {
    const sourceBindings = [];
    activePaths(await load(report), (owner, field, sha256) => {
      if (sha256 && relative(owner[field]).startsWith(`${sourceRoot}lessons/`)) {
        sourceBindings.push({ path: owner[field], sha256 });
      }
    });
    for (const source of sourceBindings) {
      if (!(await exists(source.path)) || hash(await bytes(source.path)) !== source.sha256) continue;
      const originalPath = relative(source.path).slice(sourceRoot.length);
      if (aliases.some(alias => alias.originalPath === originalPath && alias.sha256 === source.sha256)) continue;
      aliases.push({ ...source, originalPath,
        role: 'Unchanged source bytes exactly match the immutable report and book-relative source.path' });
    }
  }
  const declarations = [];
  const collect = value => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 ?? '')) {
      declarations.push({ path: value.path, sha256: value.sha256 });
      if (typeof value.metadata?.original === 'string') {
        aliases.push({
          path: value.path, originalPath: value.metadata.original, sha256: value.sha256,
          role: 'Explicit original-path snapshot metadata retained from the frozen author report',
        });
      }
    }
    for (const child of Object.values(value)) collect(child);
  };
  for (const report of [...frozenReports, ...aliasManifests]) collect(await load(report));
  const exactSnapshots = new Map();
  for (const source of [...declarations, ...aliases, ...manifestAliases]) {
    if (!source.path || !source.sha256 || !(await exists(source.path))) continue;
    if (hash(await bytes(source.path)) === source.sha256) exactSnapshots.set(source.sha256, source.path);
  }
  for (const declaration of declarations) {
    const snapshot = exactSnapshots.get(declaration.sha256);
    if (!snapshot || relative(snapshot) === relative(declaration.path)) continue;
    if (aliases.some(alias => relative(alias.originalPath) === relative(declaration.path) &&
      alias.sha256 === declaration.sha256)) continue;
    aliases.push({
      path: snapshot, originalPath: declaration.path, sha256: declaration.sha256,
      role: 'Historical reference and preserved snapshot explicitly declare the same exact byte SHA in frozen reports',
    });
  }
  for (const alias of aliases) await verify(alias.path, alias.sha256);
  const extraEvidence = structuredClone(plan.extraEvidence ?? []);
  const bindingReports = [
    await rootBinding(`${work}/9p-t7-choice-blind-freeze.json`),
    await rootBinding(`${work}/9p-t7-choice-review-provenance.json`),
    ...(plan.bindingReports ?? []),
  ];
  const activeBindings = [];
  const approvedOutputs = [];
  const addEvidence = binding => {
    if (!extraEvidence.some(item => relative(item.path) === relative(binding.path) &&
      item.sha256 === binding.sha256)) extraEvidence.push(structuredClone(binding));
  };
  const layoutDiagnosis = await rootBinding(`${work}/d018-t7-choice-layout-diagnosis.json`);
  addEvidence({
    ...(await load(layoutDiagnosis)).failedScreenshot,
    role: 'Initial strict choice display failure diagnosis; historical pixels, not an acceptance gate',
  });
  const addExplicit = async (report, trail, proof) => {
    const sha256 = proof.sha256 ?? proof.byte_sha256;
    assert.match(sha256, /^[a-f0-9]{64}$/, 'Only a declared byte SHA is a file binding.');
    const referenced = at(await load(report), trail);
    assert.equal(relative(referenced), relative(proof.path), 'Proof must identify the exact referenced path.');
    const item = { report: relative(report.path), trail, path: referenced, sha256 };
    const previous = activeBindings.find(row => row.report === item.report &&
      JSON.stringify(row.trail) === JSON.stringify(trail));
    if (previous) assert.deepEqual(previous, item, 'Conflicting frozen field proof.');
    else activeBindings.push(item);
  };
  const oldScience = await rootBinding(`${work}/9p-t7-science-review.json`);
  await addExplicit(oldScience, ['findings', 0, 'location', 'path'],
    (await load(oldScience)).bindings.exercisesTemplate);
  for (const name of ['9p-t7-choice-blind-freeze.json', '9p-t7-choice-review-provenance.json']) {
    const report = await rootBinding(`${work}/${name}`);
    for (const [key, proof] of Object.entries((await load(report)).bindings)) {
      if (!proof.byte_sha256) continue;
      await addExplicit(report, ['bindings', key, 'path'], proof);
      addEvidence({ path: proof.path, sha256: proof.byte_sha256 });
    }
  }
  for (const declaration of plan.bindingProofs ?? []) {
    const proof = at(await load(declaration.proof), declaration.proofTrail);
    await addExplicit(declaration.report, declaration.trail, proof);
    frozenReports.push(declaration.proof, declaration.report);
    bindingReports.push(declaration.report);
    addEvidence({ path: proof.path, sha256: proof.sha256 ?? proof.byte_sha256 });
  }
  const figures = [];
  for (const card of completeCards) {
    for (const id of await figureIds([{ id: card }])) {
      const report = await rootBinding(`${durableFigures}/${id}.independent-review.json`);
      const document = await load(report);
      assert.equal(document.status, 'pass');
      const gate = document.originalReport;
      await load(gate);
      figures.push({ id, card, report: gate });
      for (const [key, file] of Object.entries(document.promotion.durable)) {
        if (key === 'render') {
          const nativeReview = await rootBinding(`${durableFigures}/${id}.review.json`);
          const renderBinding = (await load(nativeReview)).render;
          assert.equal(relative(renderBinding.path), relative(file));
          await verify(file, renderBinding.sha256);
          await addExplicit(report, ['promotion', 'durable', key], renderBinding);
          frozenReports.push(nativeReview);
          bindingReports.push(nativeReview);
          continue;
        }
        const sha256 = document.bindings[key]?.sha256;
        assert.match(sha256, /^[a-f0-9]{64}$/, `No original output SHA for ${id}/${key}.`);
        approvedOutputs.push({
          report, gate, pathTrail: ['promotion', 'durable', key],
          sha256Trail: ['bindings', key, 'sha256'],
        });
        await addExplicit(report, ['promotion', 'durable', key], { path: file, sha256 });
      }
    }
  }
  for (const declaration of [
    { report: await rootBinding(`${work}/d018-n63-native-finalization.json`), gateTrail: ['science'] },
    { report: await rootBinding(`${work}/d018-n64-native-finalization.json`), gateTrail: ['science'] },
    { report: await rootBinding(`${work}/d018-t7-native-finalization.json`), gateTrail: ['scienceCorrection'] },
    { report: gates[0].report, gateTrail: ['answerGate'] },
    ...(plan.outputReports ?? []),
  ]) {
    const document = await load(declaration.report);
    const gate = at(document, declaration.gateTrail);
    assert.equal((await load(gate)).status, 'pass');
    assert.ok(Array.isArray(document.outputs), 'Use an actual native outputs array.');
    frozenReports.push(declaration.report, gate);
    document.outputs.forEach((output, index) => {
      assert.match(output.sha256, /^[a-f0-9]{64}$/);
      approvedOutputs.push({
        report: declaration.report, gate, pathTrail: ['outputs', index, 'path'],
        sha256Trail: ['outputs', index, 'sha256'],
      });
    });
  }
  // The initial author-check names a genuinely older helper version.
  const before = await load(frozenReports.find(binding =>
    relative(binding.path) === `${work}/9p-t7-before/bindings.json`));
  const originalHelper = before.helper;
  const index = await read(indexPath);
  const retainedHelper = lookup(index, originalHelper.path, originalHelper.sha256);
  const helperAlias = [...aliases, ...manifestAliases].find(item =>
    typeof item.originalPath === 'string' &&
    relative(item.originalPath) === relative(originalHelper.path) &&
    item.sha256 === originalHelper.sha256);
  assert.ok(retainedHelper || helperAlias,
  'Supply exact old build-d018-t7-prose.mjs bytes (27cffd83...), not the current cb921964... helper.');
  await verify(helperAlias?.path ?? retainedHelper, originalHelper.sha256);
  const mainPixels = `${work}/d018-n64-font-final-screenshot-review.json`;
  if (await exists(mainPixels)) addEvidence({
    ...(await bind(mainPixels)),
    role: 'Duplicate Main pixel observation retained as history only; not a second acceptance gate',
  });
  for (const binding of extraEvidence) await verify(binding.path, binding.sha256);
  const scienceNames = ['9p-n63-science-review.json', '9p-n64-science-review.json',
    '9p-t7-science-correction.json'];
  const complete = await Promise.all(completeCards.map(async (id, index) => {
    const science = await rootBinding(`${work}/${scienceNames[index]}`);
    assert.equal((await load(science)).status, 'pass');
    return { id, science };
  }));
  const excludedNames = ['9p-n60-figure-review.json', 'd018-n62-figures-author-freeze.json',
    '9p-n65-figure-review.json'];
  const request = {
    ticket: 'STEMROBIN-181', batch: 'D018', final: true, sourcePrefix: 166,
    completeCards: complete,
    excludedCards: await Promise.all(blockedCards.map(async (id, index) => ({
      id, status: 'blocked', report: await rootBinding(`${work}/${excludedNames[index]}`),
    }))),
    sourceOnlyCards: ['phy9-c2-s2-n66'],
    figures, screens, interactionGates: gates,
    displayCorrection: {
      card: completeCards[1],
      initial: Object.fromEntries(await Promise.all(Object.entries(initial64DisplayPaths)
        .map(async ([key, file]) => [key, await rootBinding(file)]))),
      effective: {
        result: await rootBinding(final64DisplayResultPath),
        tiles: await rootBinding(`${fontFinalFolder}/d018-n64-effective-screenshot-tiles.json`),
        review: independent64,
      },
    },
    aliasManifests, aliases, activeBindings, approvedOutputs,
    frozenReports, bindingReports, extraEvidence,
    scope: 'Existing gates only. n66 is source-only through166;167 remains unresolved history. No new approval or retention execution.',
  };
  assert.deepEqual(await bytes(planPath), planBytes, 'Concurrent Main plan change.');
  await immutableWrite(destination, `${JSON.stringify(request, null, 2)}\n`);
  console.log(JSON.stringify({
    status: 'final-retention-request-composed-not-a-new-gate',
    request: await bind(destination),
    freezeRetainRebindStageNativeBrowserDbOrGateCalls: 0,
  }, null, 2));
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
