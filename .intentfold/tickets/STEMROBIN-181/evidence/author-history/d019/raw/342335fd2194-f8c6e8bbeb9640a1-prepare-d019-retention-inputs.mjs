import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  ticket, book, indexPath, absolute, relative, bytes, hash, read, exists,
  bind, verify, lookup, walk, scratch, immutableWrite, activePaths,
} from './retain-d016-evidence.mjs';
import { inputsPath } from './retain-d019-evidence.mjs';
import { nativeFontDependency } from './d019-native-font-path.mjs';

const work = `${ticket}/tmp`;
const finalCards = [67, 73, 74].map(number => `phy9-c2-s2-n${number}`);
const historyCards = [68, 69, 70].map(number => `phy9-c2-s2-n${number}`);
const shaPattern = /^[a-f0-9]{64}$/;
const resourcePath = /^(?:\.tmp\/|\.intentfold\/|\.claude\/|\.agents\/|ssot-resources\/|\/Users\/)/;
const sourceGroups = [
  { book: '9p', pages: [168, 169, 170, 171], stem: '0168-0171' },
  { book: '9p', pages: [172, 173, 174, 175], stem: '0172-0175' },
  { book: '9p', pages: [176, 177, 178, 179], stem: '0176-0179' },
  { book: '9p', pages: [180, 181, 182, 183, 184, 185, 186], stem: '0180-0186' },
  { book: '10p', pages: [60, 61, 62, 63], stem: '0060-0063', pageOnly: true },
];
const authorFolders = [
  ...['0168-0171', '0172-0175', '0176-0179', '0180-0183', '0184-0187']
    .map(stem => `${work}/9p-next-source-${stem}`),
  `${work}/10p-next-source-0060-0063`,
];
const screenPaths = {
  result: `${work}/offline-d019/result-phy9-c2-s2-n67--phy9-c2-s2-n73--phy9-c2-s2-n74.json`,
  tiles: `${work}/d019-offline-tiles.json`,
  review: `${work}/d019-screenshot-review.json`,
};
const historyReports = [
  '9p-n67-author-initial/9p-n67-prose-freeze.json',
  'd019-n67-figures-author-freeze.json', 'd019-n67-figures-context-binding.json',
  'd019-n68-figures-author-freeze.json', '9p-n68-figure-review.json',
  'd019-n69-figures-author-freeze.json', '9p-n69-figure-review.json',
  'd019-n70-figures-author-freeze.json', '9p-n70-figure-review-initial.json',
  'd019-n70-fig127-repair-freeze.json',
  '9p-n70-figure-review.json',
  'source-review-9p-0168-0171.json',
  'source-review-9p-0172-0175.json', 'source-review-9p-0172-0175-correction.json',
  'source-review-9p-0176-0179.json',
  'source-review-9p-0180-0183.json', 'source-review-9p-0180-0183-correction-1.json',
  'source-review-9p-0184-0187.json',
  'source-review-10p-0060-0063.json', 'source-review-10p-0060-0063-correction.json',
];
const helperNames = [
  'prepare-d019-retention-inputs.mjs', 'retain-d019-evidence.mjs', 'rebind-d019-durable-paths.mjs',
  'finalize-d019-card.mjs', 'finalize-d019-source168-171.mjs',
  'finalize-d019-source172-175.mjs', 'finalize-d019-source176-179.mjs',
  'finalize-d019-source180-186.mjs', 'finalize-d019-source60-63.mjs',
  'review-promote-d019-n67.mjs', 'offline-d019-check.mjs', 'd019-native-font-path.mjs',
];
const local = file => {
  const result = relative(file);
  if (result.startsWith('../') && nativeFontDependency(file)) return path.resolve(file);
  assert.ok(result && !result.startsWith('../') && !path.isAbsolute(result), `Outside workspace: ${file}`);
  assert.ok(!/(?:\/pages\/|next-source-)(?:0?188|0?189|0?190|0?191)(?:\/|-)/.test(result),
    `Unapproved future188-191 source is outside this input builder: ${file}`);
  return result;
};
const at = (value, trail) => trail.reduce((owner, field) => {
  assert.ok(owner && Object.hasOwn(owner, field), `Missing binding proof field: ${trail.join('.')}`);
  return owner[field];
}, value);
const identity = binding => `${local(binding.path)}:${binding.sha256}`;
const unique = values => {
  const found = new Map();
  for (const value of values) {
    const prior = found.get(identity(value));
    const merged = { ...prior, ...value };
    if (prior && (prior.dependencies !== false || value.dependencies !== false)) {
      delete merged.dependencies;
    }
    found.set(identity(value), merged);
  }
  return [...found.values()];
};
const refs = document => {
  const found = new Map();
  const add = (owner, key, sha256, trail) => {
    if (['command', 'entry', 'runtime', 'original_path'].includes(key)) return;
    if (typeof owner[key] !== 'string' || !resourcePath.test(owner[key])) return;
    if (!sha256 && existsSync(absolute(owner[key])) && statSync(absolute(owner[key])).isDirectory()) return;
    if (!sha256 && !existsSync(absolute(owner[key])) &&
      !/\.(?:json|mjs|js|py|md|png|svg|html|woff2|txt|log)$/.test(owner[key])) return;
    found.set(JSON.stringify(trail), {
      path: owner[key], trail, sha256: sha256 ?? owner[`${key}Sha256`] ?? null,
    });
  };
  activePaths(document, add);
  const visit = (value, trail = []) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach((item, index) => visit(item, [...trail, index]));
    if (typeof value.path === 'string') add(value, 'path', value.sha256, [...trail, 'path']);
    for (const [key, item] of Object.entries(value)) {
      if (['path', 'original', 'originalPath'].includes(key)) continue;
      if (typeof item === 'string' && resourcePath.test(item)) add(value, key, null, [...trail, key]);
      else if (item && typeof item === 'object') visit(item, [...trail, key]);
    }
  };
  visit(document);
  return [...found.values()];
};

// Main runs this only after approving the final screens.
// --execute --plan <ticket/tmp/final-plan.json>
// Plan:{batch:"D019",final:true,screensApproved:true,cards:[67/73/74 full ids],
// screens:{result,tiles,review:{path,sha256}},aliases?:[],extraEvidence?:[],
// bindingProofs?:[{report:{path,sha256},trail,proof:{path,sha256},proofTrail}]}.
// Proofs select an existing path+sha256/byte_sha256 declaration. Hashless historical
// references are never assigned the current file hash. Only this scratch input
// is written; no retention, rebind, recorder, rendering or gate is invoked.
async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Prepared only for67/73/74;68/69/70 history-only. Wait for Main final screenshots approval.');
    return;
  }
  assert.deepEqual(args.slice(0, 2), ['--execute', '--plan']);
  assert.equal(args.length, 3);
  const planFile = local(args[2]);
  assert.ok(planFile.startsWith(`${work}/`));
  assert.notEqual(planFile, inputsPath);
  assert.ok(!(await exists(inputsPath)), 'Do not overwrite an already frozen final input.');
  const planBytes = await bytes(planFile);
  const plan = JSON.parse(planBytes);
  assert.equal(plan.batch, 'D019');
  assert.equal(plan.final, true);
  assert.equal(plan.screensApproved, true, 'Wait for Main explicit final screenshot approval.');
  assert.deepEqual([...plan.cards].sort(), [...finalCards].sort(), 'Only the final67/73/74 set is authorized.');
  const index = await read(indexPath);
  const documents = new Map();
  const captured = new Map();
  const evidence = [];
  const aliases = [...(plan.aliases ?? [])];
  const activeBindings = [];
  const declarations = new Map();
  const loaded = new Map();
  const rootBinding = async file => {
    file = local(file);
    assert.ok(await exists(file), `Wait for Main frozen required artifact: ${file}`);
    const binding = await bind(file);
    captured.set(identity(binding), binding);
    return binding;
  };
  const addEvidence = binding => {
    assert.match(binding.sha256, shaPattern, `Evidence needs an exact SHA: ${binding.path}`);
    local(binding.path);
    evidence.push(binding);
  };
  const addAlias = (original, preserved, basis) => {
    assert.match(original.sha256, shaPattern);
    assert.equal(original.sha256, preserved.sha256, 'Snapshot bytes must match the declared original SHA.');
    if (local(original.path) === local(preserved.path)) return;
    aliases.push({ originalPath: local(original.path), path: local(preserved.path),
      sha256: original.sha256, basis });
  };
  const rememberDeclaration = (binding, proof) => {
    if (!binding?.path || !shaPattern.test(binding.sha256 ?? binding.byte_sha256 ?? '')) return;
    const file = local(binding.path);
    const sha256 = binding.sha256 ?? binding.byte_sha256;
    const values = declarations.get(file) ?? new Map();
    values.set(sha256, { path: file, sha256, proof });
    declarations.set(file, values);
  };
  const collect = (value, report, trail = []) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach((item, index) => collect(item, report, [...trail, index]));
    rememberDeclaration(value, { report, trail });
    const originalPath = value.originalPath ?? value.metadata?.original ??
      (typeof value.original === 'string' ? value.original : null);
    if (originalPath && value.path && shaPattern.test(value.sha256 ?? '')) {
      addAlias({ path: originalPath, sha256: value.sha256 }, value, { report, trail });
    }
    if (value.snapshot?.path && value.path && value.sha256) {
      addAlias(value, value.snapshot, { report, trail, kind: 'Explicit prior snapshot' });
    }
    if (value.original?.path && value.snapshot?.path) {
      addAlias(value.original, value.snapshot, { report, trail, kind: 'Explicit preserved original pair' });
    }
    if (value.original?.path && value.path && value.original.sha256 === value.sha256) {
      addAlias(value.original, value, { report, trail, kind: 'Explicit same-SHA original/snapshot pair' });
    }
    if (value.original_path && value.retained_before?.path && value.sha256) {
      addAlias({ path: value.original_path, sha256: value.sha256 }, value.retained_before,
        { report, trail, kind: 'Explicit snake-case historical alias' });
    }
    for (const [field, child] of Object.entries(value)) collect(child, report, [...trail, field]);
  };
  const loadCurrent = async binding => {
    await verify(binding.path, binding.sha256);
    const key = identity(binding);
    if (!documents.has(key)) {
      const document = await read(binding.path);
      documents.set(key, { binding, document });
      collect(document, binding);
    }
    return documents.get(key).document;
  };
  const rootDocument = async file => {
    const binding = await rootBinding(file);
    return { binding, document: await loadCurrent(binding) };
  };
  const authorFreezes = [];
  const cards = [];
  const figureReports = [];
  for (const id of finalCards) {
    const short = id.split('-').at(-1);
    const science = await rootDocument(`${work}/9p-${short}-science-review.json`);
    const freeze = await rootDocument(`${work}/9p-${short}-prose-freeze.json`);
    const figures = await rootDocument(`${work}/9p-${short}-figure-review.json`);
    const native = await rootDocument(`${work}/d019-${short}-native-finalization.json`);
    for (const item of [science, figures, native]) assert.equal(item.document.status, 'pass');
    assert.equal(local(native.document.science.path), science.binding.path);
    assert.equal(native.document.science.sha256, science.binding.sha256);
    assert.equal(local(native.document.figureGate.path), figures.binding.path);
    assert.equal(native.document.figureGate.sha256, figures.binding.sha256);
    const oldFigures = science.document.bindings.figuresTemplate;
    const archived = native.document.archivedScienceFiguresTemplate ??
      figures.document.archivedScienceFiguresTemplate;
    if (archived) addAlias(oldFigures, archived, { report: native.binding, kind: 'SCI figuresTemplate archive' });
    cards.push({ id, science: science.binding, freeze: freeze.binding, evidence: [native.binding] });
    figureReports.push({ card: id, report: figures.binding, evidence: [native.binding] });
    authorFreezes.push(freeze.binding);
    addEvidence(native.binding);
  }
  const historicalCards = [];
  for (const id of historyCards) {
    const short = id.split('-').at(-1);
    const freeze = await rootDocument(`${work}/9p-${short}-prose-freeze.json`);
    const science = await rootDocument(`${work}/9p-${short}-science-review.json`);
    const figureFreeze = await rootDocument(`${work}/d019-${short}-figures-author-freeze.json`);
    const reportName = short === 'n70' ? '9p-n70-figure-review-initial.json' : `9p-${short}-figure-review.json`;
    const figures = await rootDocument(`${work}/${reportName}`);
    const cardEvidence = [science.binding, figureFreeze.binding, figures.binding];
    if (short === 'n70') {
      const repair = await rootDocument(`${work}/d019-n70-fig127-repair-freeze.json`);
      cardEvidence.push(repair.binding);
      authorFreezes.push(repair.binding);
    }
    historicalCards.push({ id, freeze: freeze.binding, evidence: cardEvidence });
    authorFreezes.push(freeze.binding, figureFreeze.binding);
    cardEvidence.forEach(addEvidence);
  }
  for (const name of historyReports) {
    const item = await rootDocument(`${work}/${name}`);
    addEvidence(item.binding);
    if (/freeze\.json$/.test(name)) authorFreezes.push(item.binding);
  }
  const allowedFolders = [
    ...authorFolders,
    ...[67, 68, 69, 70].map(number => `.tmp/STEMROBIN-181/9p-d019-n${number}-figures`),
    ...[67, 68, 69].map(number => `${work}/9p-n${number}-before`),
    `${work}/9p-n67-author-initial`, `${work}/d019-native-before`,
    ...[172, 176, 180].map(page => `${work}/d019-source-before${page}`),
  ];
  for (const folder of allowedFolders) {
    assert.ok(await exists(folder), `Missing explicit history folder: ${folder}`);
    for (const file of await walk(folder)) {
      const binding = await rootBinding(file);
      addEvidence(binding);
      if (/freeze\.json$/.test(file)) authorFreezes.push(binding);
      if (file.endsWith('.json')) await loadCurrent(binding);
    }
  }
  for (const name of helperNames) addEvidence(await rootBinding(`${work}/${name}`));
  for (const folder of authorFolders) authorFreezes.push(await rootBinding(`${folder}/author-freeze.json`));
  const sourceTraces = [];
  for (const group of sourceGroups) {
    const trace = await rootDocument(`${work}/source-review-${group.book}-${group.stem}-finalization-trace.json`);
    assert.ok(trace.document.status.startsWith('pass'));
    assert.deepEqual(trace.document.pages.map(page => page.pdfPage ?? page.pdf_page ?? page.page), group.pages);
    if (group.pageOnly) assert.equal(trace.document.assemblyPerformed, false);
    sourceTraces.push({ ...group, report: trace.binding, evidence: [] });
    addEvidence(trace.binding);
  }
  const screens = {};
  for (const [key, file] of Object.entries(screenPaths)) {
    const approved = plan.screens[key];
    assert.equal(local(approved.path), file, 'Main must bind the actual final67/73/74 screens.');
    await verify(approved.path, approved.sha256);
    screens[key] = approved;
    captured.set(identity(approved), approved);
    const document = await loadCurrent(approved);
    if (key !== 'tiles') assert.equal(document.status.toLowerCase(), 'pass');
  }
  const reportMappings = [];
  for (const item of figureReports) {
    const report = await loadCurrent(item.report);
    for (const figure of report.figures) {
      assert.equal(figure.status, 'pass');
      const folder = `${book}/editions/modern-us-neutral/figures`;
      const independent = await rootDocument(`${folder}/${figure.id}.independent-review.json`);
      const native = await rootDocument(`${folder}/${figure.id}.review.json`);
      assert.equal(independent.document.originalReport.sha256, item.report.sha256);
      reportMappings.push({ originalPath: independent.document.originalReport.path, report: item.report });
      addAlias(independent.document.originalReport, item.report,
        { report: independent.binding, kind: 'Explicit promoter originalReport mapping' });
      addEvidence(independent.binding);
      addEvidence(native.binding);
      for (const [field, file] of Object.entries(independent.document.promotion.durable)) {
        const proof = field === 'render' || field === 'generation'
          ? native.document[field] : native.document.spec && field === 'spec'
            ? native.document.spec : native.document.outputs[field];
        assert.ok(proof?.path && proof.sha256, `No native approved output proof: ${figure.id}/${field}`);
        assert.equal(local(file), local(proof.path));
        activeBindings.push({ report: independent.binding.path, trail: ['promotion', 'durable', field],
          path: file, sha256: proof.sha256 });
        addEvidence({ path: proof.path, sha256: proof.sha256 });
        rememberDeclaration(proof, { report: native.binding, trail: [field] });
        if (proof.path.endsWith('.json')) await loadCurrent(proof);
      }
    }
  }
  for (const entry of plan.bindingProofs ?? []) {
    const report = await loadCurrent(entry.report);
    const proof = at(await loadCurrent(entry.proof), entry.proofTrail);
    const sha256 = proof.sha256 ?? proof.byte_sha256;
    assert.match(sha256, shaPattern, 'Binding proof must declare an existing byte SHA.');
    const file = at(report, entry.trail);
    assert.equal(local(file), local(proof.path), 'Binding proof identifies another historical path.');
    activeBindings.push({ report: local(entry.report.path), trail: entry.trail, path: file, sha256 });
    rememberDeclaration({ path: file, sha256 }, { report: entry.proof, trail: entry.proofTrail });
    addEvidence(entry.report);
    addEvidence(entry.proof);
  }
  for (const binding of plan.extraEvidence ?? []) {
    await verify(binding.path, binding.sha256);
    captured.set(identity(binding), binding);
    addEvidence(binding);
    if (binding.path.endsWith('.json') && binding.dependencies !== false) await loadCurrent(binding);
  }
  const resolve = async binding => {
    const file = local(binding.path);
    assert.match(binding.sha256, shaPattern);
    if (await exists(file) && hash(await bytes(file)) === binding.sha256) return { path: file, sha256: binding.sha256 };
    const explicit = aliases.find(alias => local(alias.originalPath) === file && alias.sha256 === binding.sha256);
    const indexed = lookup(index, file, binding.sha256);
    const indexedSameBytes = Object.values(index).filter(Array.isArray).flat()
      .find(item => item.path && item.sha256 === binding.sha256)?.path;
    const preserved = explicit?.path ?? indexed ??
      [...captured.values()].find(item => item.sha256 === binding.sha256)?.path ?? indexedSameBytes;
    assert.ok(preserved, `Missing exact historical bytes: ${file} (${binding.sha256}); supply a preserved alias.`);
    await verify(preserved, binding.sha256);
    const result = { path: local(preserved), sha256: binding.sha256 };
    addAlias(binding, result, { kind: 'Exact declared SHA matched preserved bytes; no filename/current-version assumption' });
    return result;
  };
  // Follow only frozen references and the explicit history folders above.
  // Read metadata and hashes, never perform another text/pixel/science review.
  const inspected = new Set();
  for (let cursor = 0; cursor < documents.size; cursor++) {
    const entry = [...documents.values()][cursor];
    if (inspected.has(identity(entry.binding))) continue;
    inspected.add(identity(entry.binding));
    for (const ref of refs(entry.document)) {
      const explicit = activeBindings.find(item => local(item.report) === local(entry.binding.path) &&
        JSON.stringify(item.trail) === JSON.stringify(ref.trail));
      const candidates = [...(declarations.get(local(ref.path))?.values() ?? [])];
      const sha256 = ref.sha256 ?? explicit?.sha256 ?? (candidates.length === 1 ? candidates[0].sha256 : null);
      assert.match(sha256 ?? '', shaPattern,
        `Missing/ambiguous historical SHA: ${entry.binding.path}/${ref.trail.join('.')}; supply bindingProofs.`);
      if (!ref.sha256 && !explicit) activeBindings.push({
        report: entry.binding.path, trail: ref.trail, path: ref.path, sha256,
      });
      const resolved = await resolve({ path: ref.path, sha256 });
      addEvidence({ path: resolved.path, sha256,
        ...(scratch(ref.path) && resolved.path.endsWith('.json') ? {} : { dependencies: false }) });
      captured.set(identity(resolved), resolved);
      if (resolved.path.endsWith('.json') && scratch(ref.path)) await loadCurrent(resolved);
    }
  }
  for (const alias of aliases) await verify(alias.path, alias.sha256);
  for (const binding of captured.values()) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(planFile), planBytes, 'Main final approval plan changed.');
  const uniqueMappings = [...new Map(reportMappings.map(mapping => [
    `${local(mapping.originalPath)}:${mapping.report.sha256}`, mapping,
  ])).values()];
  const input = {
    ticket: 'STEMROBIN-181', batch: 'D019', final: true, cards, figureReports, historicalCards,
    authorFreezes: unique(authorFreezes), sourceTraces, screens,
    reportMappings: uniqueMappings,
    aliases: [...new Map(aliases.map(alias => [
      `${local(alias.originalPath)}:${alias.sha256}:${local(alias.path)}`, alias,
    ])).values()],
    activeBindings, evidence: unique(evidence),
    approvalPlan: { path: planFile, sha256: hash(planBytes) },
    deliverySourcesExclude167And187And188Through191: true,
    blocked187AndN68N69N70RetainedAsHistoricalEvidenceOnly: true,
    scope: '67/73/74 only. Existing approvals, source finalization traces and exact author history; no new gate.',
  };
  await immutableWrite(inputsPath, `${JSON.stringify(input, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'explicit-inputs-frozen-no-retention-or-rebind-executed',
    input: await bind(inputsPath), cards: finalCards, historicalCards: historyCards,
    retainedSourcePages: sourceGroups.map(({ book, pages }) => ({ book, pages })),
    gatesNativeBrowserDbGitCalls: 0 }, null, 2));
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
