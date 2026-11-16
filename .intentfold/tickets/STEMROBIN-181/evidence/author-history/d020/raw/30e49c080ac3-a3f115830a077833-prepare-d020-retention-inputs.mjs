// Preparation only. Main explicitly runs this after freezing the completed batch.
import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  ticket, book, indexPath, absolute, relative, bytes, hash, read, exists,
  bind, verify, lookup, scratch, immutableWrite, activePaths,
} from './retain-d016-evidence.mjs';
import {
  inputsPath, historicalCardIds, n76HistoryBindings, n76MarkerDiagnosticSha,
  validateProvenanceOnly, provenanceReference, cardFigureIds, validateSourceTrace, walkD020History as walk,
} from './retain-d020-evidence.mjs';
import { nativeFontDependency } from './d019-native-font-path.mjs';

const work = `${ticket}/tmp`;
const shaPattern = /^[a-f0-9]{64}$/;
const resourcePath = /^(?:\.tmp\/|\.intentfold\/|\.claude\/|\.agents\/|ssot-resources\/|\/Users\/)/;
const resolvedBindings = new Map([
  [`${work}/9p-n79-prose-freeze.json`, 'ca50f96800e5237e9feab8c9b07d46c404a317b462144808b80116e47c0fc5e7'],
  [`${work}/9p-n79-science-review.json`, 'b8f93bae410ec7055c3e9f86f14a0315d3c29b417a19925169106313d29522e8'],
  [`${work}/d020-n79-native-finalization.json`, 'c4b495f16c547af057a759298461b674bc21d7e57524e07f9f303550a7593da6'],
  [`${work}/d020-source196-199-finalization.json`, '7da2a8e1ee4d02cce68d01c14cdfd38c4ebb1d17534ef6b45d6434513908def1'],
  [`${work}/9p-next-source-0200-0203-correction-1/author-correction-freeze.json`,
    '969d4163d7504f24c1aa4b6745c76a311a4a739dbdefb350dff5a93bde1b230f'],
  [`${work}/source-review-9p-0200-0203.json`, '5be67f9bbb43dcc9ab1c90bbac0e47b0f48e182fe61e5682cb20ae9f47a0cce6'],
  [`${work}/source-review-9p-0200-0203-correction.json`,
    '585974d777e2b5fb76422ec376858334ee8aacb0c154b111862632eaacf724b1'],
  [`${work}/9p-next-source-0200-0203/author-freeze.json`,
    '9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1'],
  [`${work}/9p-next-source-0200-0203-correction-1/before/author-freeze.json`,
    '9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1'],
  [`${work}/d020-source200-203-finalization.json`,
    '36d774fd49cc702a8d44673bdf62daea2720ceb8692063fbe23c91826ce0d47d'],
  [`${work}/9p-next-source-0204-0207/author-freeze.json`,
    '0cefcbb06e96ef22eee2c130d59cf752da54604722fefbf977664dd94c00effa'],
  ...n76HistoryBindings.map(binding => [binding.path, binding.sha256]),
]);
const sourceGroups = [
  { pages: [188, 189, 190, 191], report: 'd020-source188-191-finalization.json' },
  { pages: [192], report: 'd020-source192-finalization.json', pageOnly: true },
  { pages: [196, 197, 198, 199], report: 'd020-source196-199-finalization.json' },
  { pages: [200, 201, 202, 203], report: 'd020-source200-203-finalization.json' },
];
const authorFolders = [
  '9p-next-source-0188-0191', '9p-next-source-0188-0191-correction-1',
  '9p-next-source-0192-0195', '9p-next-source-0192-0195-correction-1',
  '9p-next-source-0196-0199', '9p-next-source-0196-0199-correction-1',
  '9p-next-source-0200-0203', '9p-next-source-0200-0203-correction-1',
];
const historyFolders = [
  ...authorFolders.map(name => `${work}/${name}`),
  `${work}/skill-policy-before185`, `${work}/d020-native-before`,
  `${work}/d020-source-before188`, `${work}/d020-source-before196`,
  `${work}/9p-n71-before`, `${work}/9p-n72-before`, `${work}/9p-n76-before`, `${work}/9p-n79-before`,
  `${work}/source-review-9p-0192-0195-evidence`,
  `${work}/source-review-9p-0192-0195-correction-proof`,
  `${work}/source-review-9p-0196-0199-proof`,
  `${work}/source-review-9p-0200-0203-proof-independent-20261116`,
  '.tmp/STEMROBIN-181/9p-d020-n71-figures',
  '.tmp/STEMROBIN-181/9p-d020-n72-figures',
  '.tmp/STEMROBIN-181/9p-d020-n76-fig140-141',
  '.tmp/STEMROBIN-181/9p-d020-n76-fig142-143',
];
const historyReports = [
  '9p-n71-prose-freeze.json', '9p-n71-science-review.json',
  '9p-n72-prose-freeze.json', '9p-n72-science-review.json',
  'd020-n72-figures-author-freeze.json', '9p-n72-figure-review.json',
  '9p-n76-prose-freeze.json', '9p-n76-science-review.json',
  'd020-n76-science-references.json', '9p-n76-figure-review-140-141.json',
  '9p-n79-prose-freeze.json', '9p-n79-science-review.json', 'd020-n79-native-finalization.json',
  'source-review-9p-0188-0191.json', 'source-review-9p-0188-0191-correction.json',
  'source-review-9p-0192-0195.json', 'source-review-9p-0192-0195-correction.json',
  'source-review-9p-0196-0199.json', 'source-review-9p-0196-0199-correction.json',
  'source-review-9p-0200-0203.json', 'source-review-9p-0200-0203-correction.json',
  'merge-page-contiguity-20261116.outcome.json', 'd020-offline-check-preparation.json',
  'd020-source188-191-native-assembly.json',
  'd020-source192-native-finalize.json', 'd020-source196-199-native-assembly.json',
  ...[188, 189, 190, 191].flatMap(page => [
    `d020-source188-191-native-${page}.json`, `d020-source188-191-complete-${page}.json`,
  ]),
  ...[196, 197, 198, 199].flatMap(page => [
    `d020-source196-199-native-${page}.json`, `d020-source196-199-complete-${page}.json`,
  ]),
];
const helperNames = [
  'prepare-d020-retention-inputs.mjs', 'retain-d020-evidence.mjs', 'rebind-d020-durable-paths.mjs',
  'finalize-d020-n72.mjs', 'finalize-d020-source188-191.mjs',
  'finalize-d020-source192.mjs', 'finalize-d020-source196-199.mjs',
  'review-d020-n72.mjs', 'record-d020-n76-science.mjs',
  'review-d020-source196-199-correction.mjs', 'merge-page-contiguity-20261116.py',
  'offline-d020-check.mjs', 'combine-d020-screenshot-reviews.mjs',
  'prepare-d020-offline-check.mjs', 'crop-d020-pixels.py',
];
const otherTask = file => {
  const name = relative(file);
  return (name.startsWith('.intentfold/tickets/') && !name.startsWith(`${ticket}/`)) ||
    (/^\.tmp\/STEMROBIN-\d+\//.test(name) && !name.startsWith('.tmp/STEMROBIN-181/'));
};
const local = file => {
  const name = relative(file);
  if (name.startsWith('../') && nativeFontDependency(file)) return path.resolve(file);
  assert.ok(name && !name.startsWith('../') && !path.isAbsolute(name),
    `Outside workspace: ${file}; Main must resolve external provenance before retention.`);
  assert.ok(!otherTask(file), `Other-task artifact is outside D020 scope: ${file}`);
  return name;
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
    if (prior && (prior.dependencies !== false || value.dependencies !== false)) delete merged.dependencies;
    found.set(identity(value), merged);
  }
  return [...found.values()];
};
const refs = document => {
  const found = new Map();
  const add = (owner, key, sha256, trail) => {
    if (trail.includes('command')) return;
    if (['command', 'entry', 'runtime', 'original_path'].includes(key)) return;
    if (typeof owner[key] !== 'string' || !resourcePath.test(owner[key]) || otherTask(owner[key])) return;
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
    if (Array.isArray(value)) return value.forEach((item, i) => {
      if (typeof item === 'string') add(value, i, null, [...trail, i]);
      else visit(item, [...trail, i]);
    });
    if (typeof value.path === 'string') {
      add(value, 'path', value.sha256 ?? value.byte_sha256, [...trail, 'path']);
    }
    for (const [key, item] of Object.entries(value)) {
      if (['path', 'original', 'originalPath'].includes(key)) continue;
      if (typeof item === 'string' && resourcePath.test(item)) add(value, key, null, [...trail, key]);
      else if (item && typeof item === 'object') visit(item, [...trail, key]);
    }
  };
  visit(document);
  return [...found.values()];
};

// node <this-file> --execute --plan <ticket/tmp/final-plan.json> <3-5 completed full card IDs>
// Plan: {batch:"D020",final:true,screensApproved:true,
// cards:[{id,science:{path,sha256},freeze:{path,sha256},native:{path,sha256},before?:[],evidence?:[]}],
// figureReports:[{card,report:{path,sha256},evidence?:[]}],
// screens:{result,tiles,review:{path,sha256},evidence?:[]},
// sourceTraces:[{book:"9p",pages:[...],pageOnly?:true,report:{path,sha256},evidence?:[]}],
// reportMappings:[{originalPath:EXACT_PROMOTER_PLACEHOLDER,report:{path,sha256}}],
// authorFreezes?:[],aliases?:[],activeBindings?:[],extraEvidence?:[],historyFolders?:[],
// bindingProofs?:[{report:{path,sha256},trail,proof:{path,sha256},proofTrail}],
// markerDiagnostic:{path,sha256},
// provenanceOnly?:[{report:{path,sha256},trail,path,classification:"harness-only-provenance",
// activeDependency:false,reason}]}.
// Main supplies explicit final3-5cards, currently intending72/79/81; no inferred completion.
// Every selected card needs its native receipt and every actual figure a complete raw gate.
// Future81/84 freeze/native/before bindings are consumed only when explicitly supplied.
// BOTH71/76, every candidate freeze, partial PASS and diagnostic remain raw history.
// Main may select completed200-203 and later approved/finalized204-207 source traces.
// The original200-203 FILE SHA is9fdc6520..., not its63b987... ordered-text manifest SHA.
//193/195/unfinalized194 remain history;192 remains its own page-only trace.
// This reuses D019's SHA/declaration/alias walk, not its semantic checks or pipeline.
async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Prepared only. Main: --execute --plan <final-plan.json> <3-5 completed full card IDs>.');
    return;
  }
  assert.deepEqual(args.slice(0, 2), ['--execute', '--plan']);
  const finalCards = args.slice(3);
  assert.ok(finalCards.length >= 3 && finalCards.length <= 5, 'Supply exactly3-5 completed argv cards.');
  assert.equal(new Set(finalCards).size, finalCards.length, 'Duplicate argv cards.');
  assert.ok(finalCards.every(id => /^phy9-c\d+-s\d+-n\d+$/.test(id) && !historicalCardIds.includes(id)),
    'Only explicit completed9p cards; BOTH n71 and n76 remain history-only.');
  const planFile = local(args[2]);
  assert.ok(planFile.startsWith(`${work}/`));
  assert.notEqual(planFile, inputsPath);
  assert.ok(!(await exists(inputsPath)), 'Do not overwrite an already frozen final input.');
  const planBytes = await bytes(planFile);
  const plan = JSON.parse(planBytes);
  assert.equal(plan.batch, 'D020');
  assert.equal(plan.final, true);
  assert.equal(plan.screensApproved, true, 'Wait for Main explicit final screenshot approval.');
  assert.deepEqual(plan.cards.map(card => card.id).sort(), [...finalCards].sort(),
    'Main final bindings must match exactly the argv completed cards.');
  assert.ok(Array.isArray(plan.figureReports) && Array.isArray(plan.reportMappings));
  assert.equal(new Set(plan.figureReports.map(item => item.card)).size, plan.figureReports.length);
  assert.ok(plan.figureReports.every(item => finalCards.includes(item.card)));
  await validateProvenanceOnly(plan.provenanceOnly);
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  const documents = new Map();
  const captured = new Map();
  const evidence = [];
  const aliases = [...(plan.aliases ?? [])];
  const activeBindings = [...(plan.activeBindings ?? [])];
  const declarations = new Map();
  const authorFreezes = [];
  const usedProvenance = new Set();
  const rootBinding = async file => {
    file = local(file);
    assert.ok(await exists(file), `Wait for Main frozen required artifact: ${file}`);
    const binding = await bind(file);
    if (resolvedBindings.has(file)) assert.equal(binding.sha256, resolvedBindings.get(file),
      `Main resolved immutable binding changed: ${file}`);
    captured.set(identity(binding), binding);
    return binding;
  };
  const addEvidence = binding => {
    assert.match(binding.sha256, shaPattern, `Evidence needs an exact SHA: ${binding.path}`);
    local(binding.path);
    evidence.push(binding);
  };
  const addAlias = (original, preserved, basis) => {
    if (otherTask(original.path) || otherTask(preserved.path)) return;
    assert.match(original.sha256, shaPattern);
    assert.equal(original.sha256, preserved.sha256, 'Snapshot bytes must match the declared original SHA.');
    if (local(original.path) === local(preserved.path)) return;
    aliases.push({ originalPath: local(original.path), path: local(preserved.path),
      sha256: original.sha256, basis });
  };
  const rememberDeclaration = (binding, proof) => {
    if (!binding?.path || otherTask(binding.path) ||
      !shaPattern.test(binding.sha256 ?? binding.byte_sha256 ?? '')) return;
    if (provenanceReference(plan.provenanceOnly, proof.report, [...proof.trail, 'path'], binding.path)) return;
    assert.ok(!relative(binding.path).startsWith('../') || nativeFontDependency(binding.path),
      `Unresolved external declaration: ${proof.report.path}/${[...proof.trail, 'path'].join('.')} -> ${binding.path}`);
    const file = local(binding.path);
    const sha256 = binding.sha256 ?? binding.byte_sha256;
    const values = declarations.get(file) ?? new Map();
    values.set(sha256, { path: file, sha256, proof });
    declarations.set(file, values);
  };
  const collect = (value, report, trail = []) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach((item, i) => collect(item, report, [...trail, i]));
    rememberDeclaration(value, { report, trail });
    const provenance = value.path &&
      provenanceReference(plan.provenanceOnly, report, [...trail, 'path'], value.path);
    const originalPath = value.originalPath ?? value.metadata?.original ??
      (typeof value.original === 'string' ? value.original : null);
    if (!provenance && originalPath && value.path && shaPattern.test(value.sha256 ?? '')) {
      addAlias({ path: originalPath, sha256: value.sha256 }, value, { report, trail });
    }
    if (!provenance && value.snapshot?.path && value.path && value.sha256) {
      addAlias(value, value.snapshot, { report, trail, kind: 'Explicit prior snapshot' });
    }
    if (value.original?.path && value.snapshot?.path) {
      addAlias(value.original, value.snapshot, { report, trail, kind: 'Explicit preserved original pair' });
    }
    if (!provenance && value.original?.path && value.path && value.original.sha256 === value.sha256) {
      addAlias(value.original, value, { report, trail, kind: 'Explicit same-SHA original/snapshot pair' });
    }
    if (value.original_path && value.retained_before?.path && value.sha256) {
      addAlias({ path: value.original_path, sha256: value.sha256 }, value.retained_before,
        { report, trail, kind: 'Explicit snake-case historical alias' });
    }
    for (const [field, child] of Object.entries(value)) collect(child, report, [...trail, field]);
  };
  const loadCurrent = async binding => {
    local(binding.path);
    await verify(binding.path, binding.sha256);
    if (resolvedBindings.has(local(binding.path))) {
      assert.equal(binding.sha256, resolvedBindings.get(local(binding.path)),
        `Main resolved binding must be preserved exactly: ${binding.path}`);
    }
    captured.set(identity(binding), binding);
    if (!documents.has(identity(binding))) {
      const document = await read(binding.path);
      documents.set(identity(binding), { binding, document });
      collect(document, binding);
    }
    return documents.get(identity(binding)).document;
  };
  const rootDocument = async file => {
    const binding = await rootBinding(file);
    return { binding, document: await loadCurrent(binding) };
  };
  const consume = async binding => {
    addEvidence(binding);
    await verify(binding.path, binding.sha256);
    captured.set(identity(binding), binding);
    if (binding.path.endsWith('.json') && binding.dependencies !== false) await loadCurrent(binding);
  };
  for (const entry of plan.provenanceOnly ?? []) {
    addEvidence(entry.report);
    await loadCurrent(entry.report);
  }

  const cards = [];
  const figuresByCard = new Map();
  for (const card of plan.cards) {
    const science = await loadCurrent(card.science);
    await loadCurrent(card.freeze);
    const native = await loadCurrent(card.native);
    assert.equal(science.status.toLowerCase(), 'pass', 'Consume an existing independent approval only.');
    assert.equal(native.status.toLowerCase(), 'pass', 'Main must supply an existing completed native receipt.');
    assert.equal(native.card, card.id);
    assert.equal(identity(native.science), identity(card.science));
    if (science.bindings?.authorFreeze) {
      assert.equal(identity(science.bindings.authorFreeze), identity(card.freeze));
    }
    const folder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const outputs = native.outputs;
    assert.ok(Array.isArray(outputs), `Native receipt must bind actual finalized outputs: ${card.id}`);
    const outputDocuments = new Map();
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      const selected = outputs.filter(binding => local(binding.path) === `${folder}/${name}`);
      assert.equal(selected.length, 1, `Missing exact native output: ${card.id}/${name}`);
      outputDocuments.set(name, await loadCurrent(selected[0]));
      addEvidence(selected[0]);
    }
    const ids = cardFigureIds(outputDocuments.get('lesson.json'), outputDocuments.get('exercises.json'));
    figuresByCard.set(card.id, ids);
    const figure = plan.figureReports.find(item => item.card === card.id);
    if (ids.length) {
      assert.ok(figure, `Missing explicit complete figure gate for ${card.id}.`);
      assert.equal(identity(native.figureGate), identity(figure.report));
    } else {
      assert.ok(!figure && !native.figureGate?.path, `Zero-figure card cannot carry a figure gate: ${card.id}.`);
    }
    const archived = native.archivedScienceFiguresTemplate;
    if (archived) addAlias(science.bindings.figuresTemplate, archived,
      { report: card.native, kind: 'Exact science figuresTemplate archive, not approval of current placeholders' });
    const cardEvidence = unique([card.native, ...(card.before ?? []), ...(card.evidence ?? [])]);
    cards.push({ id: card.id, science: card.science, freeze: card.freeze,
      native: card.native, before: card.before ?? [], evidence: cardEvidence });
    authorFreezes.push(card.freeze);
    for (const binding of cardEvidence) await consume(binding);
  }
  const figureReports = [];
  const reportMappings = [];
  const figuresRoot = `${book}/editions/modern-us-neutral/figures`;
  for (const item of plan.figureReports) {
    const report = await loadCurrent(item.report);
    assert.equal(report.status.toLowerCase(), 'pass', 'Only complete Main-supplied raw figure approvals.');
    const card = plan.cards.find(card => card.id === item.card);
    if (item.card === 'phy9-c2-s2-n72') {
      assert.equal(local(item.report.path), `${work}/9p-${item.card.split('-').at(-1)}-figure-review.json`);
    }
    const expected = item.card === 'phy9-c2-s2-n72' ? 4 : null;
    const figures = report.figures ?? [report];
    assert.ok(figures.length);
    assert.equal(new Set(figures.map(figure => figure.id)).size, figures.length);
    assert.deepEqual(figures.map(figure => figure.id).sort(), [...figuresByCard.get(item.card)].sort(),
      `Figure gate must cover exactly every native figure for ${item.card}, never a partial PASS.`);
    if (expected) assert.equal(figures.length, expected, `All four figures must be bound for ${item.card}.`);
    for (const figure of figures) {
      assert.equal(figure.status.toLowerCase(), 'pass');
      assert.ok(figure.id && figure.bindings?.spec?.sha256, 'Require actual SHA-bound approved figures.');
      const independent = await rootDocument(`${figuresRoot}/${figure.id}.independent-review.json`);
      const native = await rootDocument(`${figuresRoot}/${figure.id}.review.json`);
      assert.equal(independent.document.bindings.spec.sha256, figure.bindings.spec.sha256);
      assert.equal(native.document.spec.sha256, figure.bindings.spec.sha256);
      assert.equal(independent.document.originalReport.sha256, item.report.sha256);
      const originalPath = local(independent.document.originalReport.path);
      const direct = originalPath === local(item.report.path);
      const explicit = plan.reportMappings.filter(mapping =>
        local(mapping.originalPath) === originalPath && identity(mapping.report) === identity(item.report));
      assert.ok(direct || explicit.length === 1,
        `Main must bind exact promoter placeholder: ${figure.id}/${originalPath}; no basename/SHA-only guess.`);
      if (explicit.length) reportMappings.push(explicit[0]);
      addAlias(independent.document.originalReport, item.report,
        { report: independent.binding, kind: 'Main explicit promoter originalReport mapping' });
      addEvidence(independent.binding);
      addEvidence(native.binding);
      for (const [field, file] of Object.entries(independent.document.promotion.durable)) {
        const proof = ['render', 'generation'].includes(field) ? native.document[field] :
          field === 'spec' ? native.document.spec : native.document.outputs[field];
        assert.ok(proof?.path && proof.sha256, `Missing native approved output proof: ${figure.id}/${field}`);
        assert.equal(local(file), local(proof.path));
        activeBindings.push({ report: independent.binding.path,
          trail: ['promotion', 'durable', field], path: file, sha256: proof.sha256 });
        rememberDeclaration(proof, { report: native.binding, trail: [field] });
        await consume({ path: proof.path, sha256: proof.sha256 });
      }
    }
    const archived = report.archivedScienceFiguresTemplate;
    if (archived) addAlias((await loadCurrent(card.science)).bindings.figuresTemplate, archived,
      { report: item.report, kind: 'Explicit science-bound figuresTemplate archive' });
    const figureEvidence = unique([card.native, ...(item.evidence ?? [])]);
    for (const binding of figureEvidence) await consume(binding);
    figureReports.push({ card: item.card, report: item.report, evidence: figureEvidence });
  }
  for (const mapping of plan.reportMappings) {
    assert.ok(reportMappings.some(item => local(item.originalPath) === local(mapping.originalPath) &&
      identity(item.report) === identity(mapping.report)), 'Unused or inexact promoter report mapping.');
  }
  for (const card of cards) {
    if (figuresByCard.get(card.id).length) {
      assert.ok(figureReports.some(item => item.card === card.id), `Wait for all bound figures: ${card.id}.`);
    }
  }

  const historicalCards = [];
  for (const id of historicalCardIds) {
    const number = id.split('-').at(-1);
    const freeze = await rootDocument(`${work}/9p-${number}-prose-freeze.json`);
    const science = await rootDocument(`${work}/9p-${number}-science-review.json`);
    const figureBindings = number === 'n71'
      ? [await rootBinding('.tmp/STEMROBIN-181/9p-d020-n71-figures/author-freeze.json')]
      : n76HistoryBindings;
    for (const binding of figureBindings) {
      await consume(binding);
      if (/freeze\.json$/.test(binding.path)) authorFreezes.push(binding);
    }
    historicalCards.push({ id, freeze: freeze.binding, evidence: [science.binding, ...figureBindings] });
    authorFreezes.push(freeze.binding);
  }
  assert.equal(plan.markerDiagnostic?.sha256, n76MarkerDiagnosticSha,
    'Main must supply the exact history-only marker diagnostic path; no directory search or rerun.');
  const markerPath = local(plan.markerDiagnostic.path);
  assert.ok(markerPath.startsWith(`${work}/`) || markerPath.startsWith('.tmp/STEMROBIN-181/'));
  await consume(plan.markerDiagnostic);
  historicalCards.find(card => card.id === 'phy9-c2-s2-n76').evidence.push(plan.markerDiagnostic);
  for (const name of historyReports) {
    const item = await rootDocument(`${work}/${name}`);
    addEvidence(item.binding);
    if (/freeze\.json$/.test(name)) authorFreezes.push(item.binding);
  }
  const extraFolders = (plan.historyFolders ?? []).map(local);
  assert.ok(extraFolders.every(folder => folder.startsWith(`${work}/`) ||
    folder.startsWith('.tmp/STEMROBIN-181/')), 'Additional history folders must be explicit own-ticket scratch.');
  assert.ok(!extraFolders.includes(work) && !extraFolders.includes('.tmp/STEMROBIN-181'),
    'Do not scan the whole ticket workspace.');
  const folders = [...historyFolders, ...extraFolders];
  for (const folder of [...new Set(folders)]) {
    assert.ok(await exists(folder), `Missing explicit history folder: ${folder}`);
    for (const file of await walk(folder)) {
      const binding = await rootBinding(file);
      addEvidence(binding);
      if (/freeze\.json$/.test(file)) authorFreezes.push(binding);
      if (file.endsWith('.json')) await loadCurrent(binding);
    }
  }
  for (const name of helperNames) addEvidence(await rootBinding(`${work}/${name}`));
  for (const folder of authorFolders) {
    const name = folder === '9p-next-source-0196-0199-correction-1' ||
      folder === '9p-next-source-0200-0203-correction-1' ? 'author-correction-freeze.json' : 'author-freeze.json';
    authorFreezes.push(await rootBinding(`${work}/${folder}/${name}`));
  }
  for (const binding of plan.authorFreezes ?? []) {
    await consume(binding);
    authorFreezes.push(binding);
  }

  assert.ok(Array.isArray(plan.sourceTraces));
  assert.ok(plan.sourceTraces.length, 'Main must explicitly select completed approved source traces.');
  const sourceTraces = [];
  for (const group of sourceGroups) {
    const selected = plan.sourceTraces.filter(trace => local(trace.report.path) === `${work}/${group.report}`);
    assert.ok(selected.length <= 1, `Duplicate ${group.report}.`);
    if (selected.length) {
      assert.deepEqual(selected[0].pages, group.pages);
      assert.equal(selected[0].pageOnly === true, group.pageOnly === true);
    }
  }
  const seenPages = new Set();
  for (const trace of plan.sourceTraces) {
    assert.equal(trace.book, '9p');
    assert.ok(trace.pages?.length && trace.pages.every(page =>
      Number.isInteger(page) && page > 0 && ![193, 194, 195].includes(page)));
    assert.ok(local(trace.report.path).startsWith(`${work}/`), 'Main final source report must be own-ticket scratch.');
    if (trace.pages.some(page => [200, 201, 202, 203].includes(page))) {
      assert.equal(local(trace.report.path), `${work}/d020-source200-203-finalization.json`);
    }
    for (const page of trace.pages) {
      assert.ok(!seenPages.has(page), 'Duplicate source page.');
      seenPages.add(page);
    }
    const document = await loadCurrent(trace.report);
    validateSourceTrace(trace, document);
    for (const binding of trace.evidence ?? []) await consume(binding);
    sourceTraces.push({ book: trace.book, pages: trace.pages,
      ...(trace.pageOnly === true ? { pageOnly: true } : {}),
      report: trace.report, evidence: trace.evidence ?? [] });
    addEvidence(trace.report);
  }
  const screens = { evidence: plan.screens.evidence ?? [] };
  const screenPaths = {
    result: `${work}/offline-d020/result-${[...finalCards].sort().join('--')}.json`,
    tiles: `${work}/d020-offline-tiles.json`, review: `${work}/d020-screenshot-review.json`,
  };
  for (const [key, file] of Object.entries(screenPaths)) {
    const approved = plan.screens[key];
    assert.equal(local(approved.path), file, 'Main must bind existing exact selected-card screens.');
    screens[key] = approved;
    const document = await loadCurrent(approved);
    if (key !== 'tiles') assert.equal(document.status.toLowerCase(), 'pass');
  }
  for (const binding of screens.evidence) await consume(binding);
  for (const entry of plan.bindingProofs ?? []) {
    const report = await loadCurrent(entry.report);
    const proof = at(await loadCurrent(entry.proof), entry.proofTrail);
    const sha256 = proof.sha256 ?? proof.byte_sha256;
    assert.match(sha256, shaPattern, 'Proof must declare an existing exact byte SHA.');
    const file = at(report, entry.trail);
    assert.equal(local(file), local(proof.path), 'Proof identifies another historical path.');
    const prior = activeBindings.find(binding => local(binding.report) === local(entry.report.path) &&
      JSON.stringify(binding.trail) === JSON.stringify(entry.trail));
    if (prior) {
      assert.equal(local(prior.path), local(file));
      assert.equal(prior.sha256, sha256);
    } else {
      activeBindings.push({ report: local(entry.report.path), trail: entry.trail, path: file, sha256 });
    }
    rememberDeclaration({ path: file, sha256 }, { report: entry.proof, trail: entry.proofTrail });
    addEvidence(entry.report);
    addEvidence(entry.proof);
  }
  for (const binding of plan.extraEvidence ?? []) await consume(binding);

  const resolve = async binding => {
    const file = local(binding.path);
    assert.match(binding.sha256, shaPattern);
    if (await exists(file) && hash(await bytes(file)) === binding.sha256) {
      return { path: file, sha256: binding.sha256 };
    }
    const explicit = aliases.find(alias => local(alias.originalPath) === file && alias.sha256 === binding.sha256);
    const indexed = lookup(index, file, binding.sha256);
    const indexedSameBytes = Object.values(index).filter(Array.isArray).flat()
      .find(item => item.path && !otherTask(item.path) && item.sha256 === binding.sha256)?.path;
    const preserved = explicit?.path ?? indexed ??
      [...captured.values()].find(item => item.sha256 === binding.sha256)?.path ?? indexedSameBytes;
    assert.ok(preserved, `Missing exact historical bytes: ${file} (${binding.sha256}); Main must supply an alias.`);
    await verify(preserved, binding.sha256);
    const result = { path: local(preserved), sha256: binding.sha256 };
    addAlias(binding, result, { kind: 'D019 exact declared SHA matched preserved bytes; never current-version substitution' });
    return result;
  };
  const exactBindings = new Map();
  for (const binding of activeBindings) {
    const key = `${local(binding.report)}:${JSON.stringify(binding.trail)}`;
    const prior = exactBindings.get(key);
    if (prior) {
      assert.equal(local(prior.path), local(binding.path));
      assert.equal(prior.sha256, binding.sha256);
    } else {
      exactBindings.set(key, binding);
    }
  }
  activeBindings.splice(0, activeBindings.length, ...exactBindings.values());
  const inspected = new Set();
  for (let cursor = 0; cursor < documents.size; cursor++) {
    const entry = [...documents.values()][cursor];
    if (inspected.has(identity(entry.binding))) continue;
    inspected.add(identity(entry.binding));
    for (const ref of refs(entry.document)) {
      const provenance = provenanceReference(plan.provenanceOnly, entry.binding, ref.trail, ref.path);
      if (provenance) {
        usedProvenance.add(provenance);
        continue;
      }
      assert.ok(!relative(ref.path).startsWith('../') || nativeFontDependency(ref.path),
        `Unresolved external dependency: ${entry.binding.path}/${ref.trail.join('.')} -> ${ref.path}; ` +
        'only Main explicit known harness-document provenance fields may be excluded.');
      const explicit = activeBindings.filter(item => local(item.report) === local(entry.binding.path) &&
        JSON.stringify(item.trail) === JSON.stringify(ref.trail) && local(item.path) === local(ref.path));
      assert.ok(explicit.length <= 1, `Duplicate active binding: ${entry.binding.path}/${ref.trail.join('.')}`);
      const candidates = [...(declarations.get(local(ref.path))?.values() ?? [])];
      const sha256 = ref.sha256 ?? explicit[0]?.sha256 ?? (candidates.length === 1 ? candidates[0].sha256 : null);
      assert.match(sha256 ?? '', shaPattern,
        `Missing/ambiguous historical SHA: ${entry.binding.path}/${ref.trail.join('.')}; supply bindingProofs.`);
      if (!ref.sha256 && !explicit.length) activeBindings.push({
        report: entry.binding.path, trail: ref.trail, path: ref.path, sha256,
      });
      const resolved = await resolve({ path: ref.path, sha256 });
      addEvidence({ ...resolved,
        ...(scratch(ref.path) && resolved.path.endsWith('.json') ? {} : { dependencies: false }) });
      if (/freeze\.json$/.test(ref.path)) authorFreezes.push(resolved);
      captured.set(identity(resolved), resolved);
      if (resolved.path.endsWith('.json') && scratch(ref.path)) await loadCurrent(resolved);
    }
  }
  assert.equal(usedProvenance.size, (plan.provenanceOnly ?? []).length, 'Unused provenance-only declaration.');
  for (const alias of aliases) {
    local(alias.originalPath);
    await verify(local(alias.path), alias.sha256);
  }
  for (const binding of captured.values()) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(planFile), planBytes, 'Main final plan changed.');
  assert.deepEqual(await bytes(indexPath), indexBytes, 'Shared index changed during input capture.');
  const input = {
    ticket: 'STEMROBIN-181', batch: 'D020', final: true, cards, figureReports, historicalCards,
    authorFreezes: unique(authorFreezes), sourceTraces, screens,
    reportMappings: [...new Map(reportMappings.map(mapping => [
      `${local(mapping.originalPath)}:${identity(mapping.report)}`, mapping,
    ])).values()],
    aliases: [...new Map(aliases.map(alias => [
      `${local(alias.originalPath)}:${alias.sha256}:${local(alias.path)}`, alias,
    ])).values()],
    activeBindings, evidence: unique(evidence),
    markerDiagnostic: plan.markerDiagnostic, provenanceOnly: plan.provenanceOnly ?? [],
    approvalPlan: { path: planFile, sha256: hash(planBytes) },
    completedCardsFromExactArgv: finalCards,
    n71AndN76And193And195AndUnfinalized194AreHistoryOnly: true,
    sourceCompletionDerivedOnlyFromMainExplicitApprovedFinalTraces: true,
    scope: 'Main explicit completed cards and final source traces; existing screens and immutable author history only.',
  };
  await immutableWrite(inputsPath, `${JSON.stringify(input, null, 2)}\n`);
  console.log(JSON.stringify({ status: 'explicit-inputs-frozen-no-retention-or-rebind-executed',
    input: await bind(inputsPath), cards: finalCards, historicalCards: historicalCardIds,
    sourceScope: sourceTraces.map(({ book, pages, pageOnly }) => ({ book, pages, pageOnly })),
    semanticGateNativeBrowserDbGitIndexMeterWrites: 0 }, null, 2));
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
