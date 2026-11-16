// D020 preparation only: Main supplies final inputs and separately authorizes execution.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, collections, absolute, relative,
  hash, bytes, read, exists, verify, lookup, activePaths, scratch, immutableWrite,
} from './retain-d016-evidence.mjs';
import { nativeFontDependency } from './d019-native-font-path.mjs';

export const inputsPath = `${ticket}/tmp/d020-retention-inputs.json`;
export const retentionManifest = `${evidence}/reports/d020-retention-manifest.json`;
const history = `${evidence}/author-history/d020`;
export const historicalCardIds = ['phy9-c2-s2-n71', 'phy9-c2-s2-n76'];
export const n76MarkerDiagnosticSha = '904d900cf2865d0508c4c1ac962b8b884f6b7554cca746e40a61e2f49caa9336';
export const n76HistoryBindings = [
  { path: '.tmp/STEMROBIN-181/9p-d020-n76-fig140-141/author-freeze.json',
    sha256: '8f8b7809012fd1b6555714cef9a3da6afdf5ea8b49582d06f193298e9c5ee92c' },
  { path: '.tmp/STEMROBIN-181/9p-d020-n76-fig142-143/authorfreeze.json',
    sha256: '58ad9c92ee6d8cdca59db19c19c91228ba63ece6eb903770c81e8f94863ae63c' },
  { path: `${ticket}/tmp/9p-n76-figure-review-140-141.json`,
    sha256: 'b934970f0e4366623df7fc5d035aa3fa4267df649d42ff574707978e67293ffe' },
];
const shaPattern = /^[a-f0-9]{64}$/;
const resourcePath = /^(?:\.tmp\/|\.intentfold\/|\.claude\/|\.agents\/|ssot-resources\/|\/Users\/)/;
const otherTask = file => {
  const name = relative(file);
  return (name.startsWith('.intentfold/tickets/') && !name.startsWith(`${ticket}/`)) ||
    (/^\.tmp\/STEMROBIN-\d+\//.test(name) && !name.startsWith('.tmp/STEMROBIN-181/'));
};
const surfaceKey = item =>
  `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
const tileKey = item => `${relative(item.path)}:${item.sha256}`;
let nativeInputLinks;
export async function walkD020History(folder) {
  const files = [];
  for (const entry of await fs.readdir(absolute(folder), { withFileTypes: true })) {
    const file = `${relative(folder)}/${entry.name}`;
    if (entry.isSymbolicLink()) {
      if (!nativeInputLinks) {
        nativeInputLinks = new Map();
        const n76 = n76HistoryBindings[0];
        await verify(n76.path, n76.sha256);
        for (const link of (await read(n76.path)).nativeInputStagingLinks) {
          nativeInputLinks.set(relative(link.path), link);
        }
        const n81 = '.tmp/STEMROBIN-181/9p-d020-n81-fig152/native-context-call-start.json';
        await verify(n81, 'c5a0add1746b429aec3431ecf69e6e71a0511318df6c0d928874f62b76961bd5');
        const start = await read(n81);
        for (const link of start.projection) {
          const binding = Object.values(start.bindings).find(value =>
            relative(value.path) === relative(link.target));
          assert.ok(binding?.sha256, `Unbound native input link: ${link.path}`);
          nativeInputLinks.set(relative(link.path), { ...link, sha256: binding.sha256 });
        }
      }
      const link = nativeInputLinks.get(file);
      assert.ok(link, `Unexpected unbound symlink: ${file}`);
      const target = await fs.realpath(absolute(file));
      assert.ok(!relative(target).startsWith('../'), `External native link: ${file}`);
      assert.equal(target, await fs.realpath(absolute(link.target)), `Changed native link: ${file}`);
      assert.ok((await fs.stat(target)).isFile(), `Native link is not a file: ${file}`);
      await verify(file, link.sha256);
      files.push(file);
    } else if (entry.isDirectory()) {
      files.push(...await walkD020History(file));
    } else {
      assert.ok(entry.isFile(), `Unexpected history entry: ${file}`);
      files.push(file);
    }
  }
  return files.sort();
}
export function cardFigureIds(lesson, exercises) {
  const ids = new Set();
  for (const figure of lesson.figures ?? []) ids.add(figure.id);
  for (const block of lesson.prose ?? []) {
    if (block.kind === 'fig') ids.add(block.id);
    for (const figure of block.figures ?? []) ids.add(figure.id);
  }
  for (const exercise of exercises.exercises ?? []) {
    for (const id of exercise.figure_refs ?? []) ids.add(id);
    for (const figure of exercise.figures ?? []) ids.add(figure.id);
  }
  assert.ok([...ids].every(id => typeof id === 'string' && id), 'Invalid native figure identity.');
  return [...ids].sort();
}
export function validateSourceTrace(trace, document) {
  assert.ok(document.status?.toLowerCase().startsWith('pass'), 'Only completed native source receipts are final traces.');
  assert.ok(document.sourceReview?.path && shaPattern.test(document.sourceReview.sha256),
    'A standalone author freeze or source review is not a native final trace.');
  const pages = document.pdfPages ??
    document.pages?.map(page => page.pdfPage ?? page.pdf_page ?? page.page);
  assert.deepEqual(pages, trace.pages, 'Native trace must declare exactly Main selected pages.');
  const records = document.pages ?? (trace.pages.length === 1 ? [document] : []);
  assert.equal(records.length, trace.pages.length, 'Require a native receipt for every selected page.');
  for (const page of records) {
    assert.ok(page.finalization && page.audit?.path && shaPattern.test(page.audit.sha256) &&
      page.pageJson?.path && shaPattern.test(page.pageJson.sha256),
    'Require existing native finalization, audit and page JSON bindings; never infer source completion.');
  }
  if (trace.pages.includes(192)) {
    assert.equal(trace.pageOnly, true);
    assert.deepEqual(trace.pages, [192]);
    assert.ok(!document.assembly && document.assemblyPerformed !== true, '192 remains page-only.');
  }
}
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const local = file => {
  const name = relative(file);
  if (name.startsWith('../') && nativeFontDependency(file)) return path.resolve(file);
  assert.ok(name && !name.startsWith('../') && !path.isAbsolute(name), `Outside workspace: ${file}`);
  assert.ok(!otherTask(file), `Other-task artifact is outside D020 retention scope: ${file}`);
  return name;
};

const knownHarnessDocuments = new Set([
  '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '/Users/yong/.agents/skills/n-plane/SKILL.md',
]);
const externalTicketReadHelper = '/Users/yong/.agents/skills/n-plane/scripts/plane.sh';
export const nPlaneHarnessProvenance = Object.freeze([
  ['9p-next-source-0200-0203/author-check.json',
    'ca8d00eb6237b02deca832e6461e9d49a90ffb5094e4ce8c1380be737fe09cc4'],
  ['9p-next-source-0200-0203/author-freeze.json',
    '9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1'],
  ['9p-next-source-0200-0203-correction-1/before/author-freeze.json',
    '9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1'],
  ['9p-next-source-0204-0207/author-freeze.json',
    '0cefcbb06e96ef22eee2c130d59cf752da54604722fefbf977664dd94c00effa'],
  ['9p-next-source-0204-0207/author-check.json',
    'ca2875c944a4726320fd7ed6fa3b194d1de155ca23528fb9b1929334e903af23'],
].map(([name, sha256]) => Object.freeze({
  report: Object.freeze({ path: `${ticket}/tmp/${name}`, sha256 }),
  trail: Object.freeze(['live_ticket_read', 'helper']),
  path: externalTicketReadHelper,
  classification: 'harness-only-provenance',
  activeDependency: false,
  reason: 'Records the live ticket read transport only, not a product or native input. ' +
    'Keep this exact raw report field verbatim; do not read or copy the external personal helper.',
})));
export const nativeRuntimeProvenance = Object.freeze([
  {
    report: {
      path: `${ticket}/tmp/9p-next-source-0200-0203-correction-1/author-correction-freeze.json`,
      sha256: '969d4163d7504f24c1aa4b6745c76a311a4a739dbdefb350dff5a93bde1b230f',
    },
    trail: ['corrected_152', 'tool_bindings', 'python_executable', 'path'],
  },
  {
    report: {
      path: `${ticket}/tmp/9p-next-source-0200-0203-correction-1/crop-152-binding.json`,
      sha256: 'cc77d1d9fde83767aecaa2241564fa34690f22c78c88ac9abfb203ecd394ff32',
    },
    trail: ['tool_bindings', 'python_executable', 'path'],
  },
].map(entry => ({
  ...entry,
  path: '/Users/yong/.local/share/uv/python/cpython-3.13.13-macos-aarch64-none/bin/python3.13',
  classification: 'harness-only-provenance',
  activeDependency: false,
  reason: 'Exact runtime-executable identity in the raw crop invocation; preserve its recorded version/hash, ' +
    'not a copied interpreter binary. All source pixels, native crop code, configuration and output bindings remain active.',
})));
export const unavailableHistoricalProducer = Object.freeze({
  report: {
    path: '.tmp/STEMROBIN-181/9p-d020-n76-fig142-143/runtime-bindings.json',
    sha256: '429aaf2f1864c7c9263d3ef8ea3d37ed09255ed7b9d3cf9cc57d93e3053366fc',
  },
  trail: ['author', 'path'],
  path: '/Users/yong/.codex/worktrees/00b1/lemmadeck/.tmp/STEMROBIN-181/9p-d020-n76-fig142-143/author.mjs',
  classification: 'harness-only-provenance',
  activeDependency: false,
  reason: 'Historical failed n76 producer version949e26735d4af9791996fb7e2695629ad75654fe09bd85974093e38d5916013d ' +
    'is unavailable in the156 regular files of the explicit candidate-history folders. Preserve its raw identity and ' +
    'this missing-evidence record; never substitute current code or claim this failed history is reproducible. ' +
    'n76 remains excluded; no completed card or active source/spec/render dependency is waived.',
});
export const bindingDiagnosticProvenance = Object.freeze({
  report: {
    path: `${ticket}/tmp/d020-final-plan-request-proofs.json`,
    sha256: '444a49cb7e0a4f2eef270cd61deade683c3d96f4f34917350c058f4921d05aaa',
  },
  trail: ['missingReport', 'path'],
  path: `${ticket}/tmp/d020-main-final-plan-missing-inputs.json`,
  classification: 'harness-only-provenance',
  activeDependency: false,
  reason: 'The initial binding-resolution diagnostic records error-message paths, not content dependencies. ' +
    'The proof document independently binds every resolved source and snapshot; this diagnostic origin alone is provenance-only.',
});
export const provenanceReference = (entries, report, trail, file) => (entries ?? []).find(entry =>
  local(entry.report.path) === local(report.path) && entry.report.sha256 === report.sha256 &&
  JSON.stringify(entry.trail) === JSON.stringify(trail) && entry.path === file);

// An exception identifies one field in one immutable raw report, never a directory.
// Only pinned ticket-read and runtime-identity fields are provenance-only.
// Other external executables and all product/native content inputs stay binding.
export async function validateProvenanceOnly(entries = []) {
  assert.ok(Array.isArray(entries), 'provenanceOnly must explicitly list exact report fields.');
  const keys = [];
  for (const entry of entries) {
    const report = local(entry.report.path);
    const exactTicketRead = entry.path === externalTicketReadHelper &&
      provenanceReference(nPlaneHarnessProvenance, entry.report, entry.trail, entry.path);
    const exactRuntime = provenanceReference(nativeRuntimeProvenance, entry.report, entry.trail, entry.path);
    const exactMissingProducer = provenanceReference([unavailableHistoricalProducer],
      entry.report, entry.trail, entry.path);
    const exactDiagnostic = provenanceReference([bindingDiagnosticProvenance],
      entry.report, entry.trail, entry.path);
    assert.ok(knownHarnessDocuments.has(entry.path) || exactTicketRead || exactRuntime ||
      exactMissingProducer || exactDiagnostic,
      `Not an allowed exact external harness field: ${entry.path}; report path/trail/SHA remain binding.`);
    assert.equal(entry.classification, 'harness-only-provenance');
    assert.equal(entry.activeDependency, false);
    assert.ok(typeof entry.reason === 'string' && entry.reason.trim(),
      'Main must explain why this field is harness provenance, not a native/product dependency.');
    assert.ok(Array.isArray(entry.trail) && entry.trail.length &&
      entry.trail.every(field => typeof field === 'string' || Number.isInteger(field)));
    assert.ok(report.startsWith(`${ticket}/tmp/`) || report.startsWith('.tmp/STEMROBIN-181/'),
      'Provenance exceptions cannot exclude live/durable metadata dependencies.');
    await verify(report, entry.report.sha256);
    let value = await read(report);
    for (const field of entry.trail) {
      assert.ok(value && Object.hasOwn(value, field), `Missing provenance trail: ${report}/${entry.trail.join('.')}`);
      value = value[field];
    }
    assert.equal(value, entry.path, `Inexact provenance field: ${report}/${entry.trail.join('.')}`);
    if (exactMissingProducer) {
      assert.equal((await read(report)).author.sha256,
        '949e26735d4af9791996fb7e2695629ad75654fe09bd85974093e38d5916013d');
    }
    keys.push(`${report}:${entry.report.sha256}:${JSON.stringify(entry.trail)}`);
  }
  exactSet(keys, [...new Set(keys)], 'Explicit provenance-only fields');
}

// Main supplies final bindings, not provisional names or an inferred batch:
// {batch:"D020",final:true,
//  cards:[{id,science:{path,sha256},freeze:{path,sha256},native:{path,sha256},before?:[],evidence:[]}],
//  figureReports:[{card,report:{path,sha256},evidence:[]}],
//  screens:{result:{path,sha256},tiles:{path,sha256},review:{path,sha256},evidence:[]},
//  sourceTraces:[{book:"9p",pages:[...],pageOnly?:true,
//    report:{path,sha256},evidence:[native page PNG/MD/JSON/audit/crop bindings]}],
//  historicalCards:[{id,freeze:{path,sha256},evidence:[blocked reports/candidates]}], // BOTH71/76
//  authorFreezes:[{path,sha256}],
//  reportMappings:[{originalPath:promoterPlaceholder,report:{path,sha256}}],
//  evidence?:[{path,sha256,dependencies?:false}],
//  aliases?:[{originalPath,path,sha256}],
//  activeBindings?:[{report,trail:[...],path,sha256}],
//  markerDiagnostic:{path,sha256},
//  provenanceOnly?:[{report:{path,sha256},trail,path,classification:"harness-only-provenance",
//    activeDependency:false,reason}]}
// Main supplies explicit final3-5cards, including future81/84 only after completion.
// n71/129 and n76/140-143 (including the partial PASS) are history only.
// Main's188-191 trace is tmp/d020-source188-191-finalization.json; its record-only
// recovery is history, not a native rerun.192 is page-only under
// tmp/d020-source192-finalization.json.194 is approved but UNFINALIZED (ex3
// crosses blocked195 and lacksfigure148), so it is never a source trace.
//193/195 and every original freeze/correction/proof remain immutable history.
//200-203 is completed;204-207 author history is not a final source trace. Include only Main's explicit approved
// final traces, never infer an exact range or require10p for this batch.
// Main explicitly enumerates all author freezes; no directory scan.
// Aliases bind archived pre185 lesson/image/choice skills, assemble.before-gap-fix,
// and old spec/report bytes by exact SHA, never by a guessed snapshot filename.
// Promoter placeholders require explicit reportMappings. Inherited other-task
// artifacts are provenance only and excluded from this batch's dependencies.
export async function finalInputs(file = inputsPath) {
  file = local(file);
  assert.ok(file.startsWith(`${ticket}/tmp/`), 'Final input must be ticket scratch.');
  assert.ok(await exists(file), `Waiting for Main final {cards,figureReports,screens,sourceTraces}: ${file}`);
  const inputBytes = await bytes(file);
  const input = JSON.parse(inputBytes);
  assert.equal(input.batch, 'D020');
  assert.equal(input.final, true, 'Wait for the explicitly frozen final batch.');
  assert.ok(Array.isArray(input.cards) && Array.isArray(input.figureReports));
  const ids = input.cards.map(card => card.id);
  assert.ok(ids.length >= 3 && ids.length <= 5, 'Wait for Main explicit final3-5card batch.');
  exactSet(ids, [...new Set(ids)], 'Main final card identities');
  assert.ok(ids.every(id => /^phy9-c\d+-s\d+-n\d+$/.test(id) && !historicalCardIds.includes(id)),
    'Only explicitly completed9p cards; BOTH n71 and n76 remain history-only.');
  assert.ok(input.cards.every(card => card.native?.path && shaPattern.test(card.native.sha256)),
    'Every selected final card needs its explicit completed native receipt.');
  exactSet(input.figureReports.map(item => item.card),
    [...new Set(input.figureReports.map(item => item.card))], 'Final figure-report cards');
  assert.ok(input.figureReports.every(item => ids.includes(item.card)), 'No history-only figure gate.');
  assert.ok(input.screens && ['result', 'tiles', 'review'].every(key => input.screens[key]?.sha256),
    'Wait for final result, tiles and their existing independent screenshot review.');
  assert.ok(Array.isArray(input.historicalCards), 'Explicit n71 AND n76 history bindings are required.');
  exactSet(input.historicalCards.map(card => card.id), historicalCardIds, 'Blocked modern history');
  assert.ok(input.historicalCards.every(card => card.freeze?.path && card.freeze?.sha256 &&
    Array.isArray(card.evidence) && card.evidence.length),
  'History must bind author freezes and actual blocked reports/candidates, not claim completion.');
  assert.ok(Array.isArray(input.authorFreezes) && input.authorFreezes.length,
    'Main must explicitly bind all author freezes, including source and blocked history.');
  for (const card of [...input.cards, ...input.historicalCards]) {
    assert.ok(input.authorFreezes.some(binding => relative(binding.path) === relative(card.freeze.path) &&
      binding.sha256 === card.freeze.sha256), `Missing exact author freeze: ${card.id}`);
  }
  for (const card of input.historicalCards) {
    const number = card.id.split('-').at(-1);
    assert.equal(local(card.freeze.path), `${ticket}/tmp/9p-${number}-prose-freeze.json`);
    assert.ok(card.evidence.some(binding =>
      local(binding.path) === `${ticket}/tmp/9p-${number}-science-review.json` &&
      shaPattern.test(binding.sha256)), `Missing history-only prose science receipt: ${card.id}`);
  }
  const n76 = input.historicalCards.find(card => card.id === 'phy9-c2-s2-n76');
  for (const binding of n76HistoryBindings) {
    assert.ok(n76.evidence.some(item => local(item.path) === binding.path && item.sha256 === binding.sha256),
      `Missing exact history-only n76 candidate/partial PASS: ${binding.path}`);
    if (/freeze\.json$/.test(binding.path)) assert.ok(input.authorFreezes.some(item =>
      local(item.path) === binding.path && item.sha256 === binding.sha256), 'Missing n76 candidate author freeze.');
  }
  assert.equal(input.markerDiagnostic?.sha256, n76MarkerDiagnosticSha, 'Bind the exact history-only marker diagnostic.');
  const markerPath = local(input.markerDiagnostic.path);
  assert.ok(markerPath.startsWith(`${ticket}/tmp/`) || markerPath.startsWith('.tmp/STEMROBIN-181/'));
  assert.ok(n76.evidence.some(item => local(item.path) === markerPath && item.sha256 === n76MarkerDiagnosticSha));
  await validateProvenanceOnly(input.provenanceOnly);
  assert.ok(Array.isArray(input.reportMappings), 'Supply explicit promoter originalReport mappings.');
  const mappingKeys = [];
  for (const mapping of input.reportMappings) {
    assert.ok(mapping.originalPath && mapping.report?.path, 'Report mapping needs originalPath and raw report.');
    assert.match(mapping.report.sha256, shaPattern, 'Report mapping needs the original exact SHA.');
    assert.ok(input.figureReports.some(item => relative(item.report.path) === relative(mapping.report.path) &&
      item.report.sha256 === mapping.report.sha256), 'Placeholder must map to an explicitly supplied raw figure gate.');
    mappingKeys.push(`${local(mapping.originalPath)}:${mapping.report.sha256}`);
  }
  exactSet(mappingKeys, [...new Set(mappingKeys)], 'Explicit report mapping identities');
  assert.ok(Array.isArray(input.sourceTraces) && input.sourceTraces.length,
    'Missing explicit approved9p source traces.');
  for (const trace of input.sourceTraces) {
    assert.equal(trace.book, '9p', 'Only9p new source traces are supported for D020.');
    assert.ok(Array.isArray(trace.pages) && trace.pages.length, 'Missing explicit per-trace source pages.');
    assert.ok(trace.pages.every(page => Number.isInteger(page) && page > 0));
    exactSet(trace.pages, [...new Set(trace.pages)], 'Explicit per-trace source pages');
    assert.ok(trace.pages.every(page => ![193, 194, 195].includes(page)),
      '193/195 are blocked and194 is unfinalized; retain their bytes as history only.');
    if (trace.pages.includes(192)) {
      assert.equal(trace.pageOnly, true, '192 remains page-only.');
      assert.deepEqual(trace.pages, [192], '192 must have its own page-only trace.');
    }
  }
  const pages = input.sourceTraces.flatMap(trace => trace.pages);
  exactSet(pages, [...new Set(pages)], '9p explicit source pages');
  return { file, inputBytes, input };
}

// Reuse activePaths, also capturing SHA-bound historical "before" objects and
// native sibling hashes. OriginalPath remains provenance, never an active alias.
function references(document) {
  const found = new Map();
  const add = (owner, key, sha256, trail) => {
    if (trail.includes('command')) return;
    if (['command', 'entry', 'runtime', 'original_path'].includes(key)) return;
    if (!resourcePath.test(owner[key]) || otherTask(owner[key])) return;
    if (!sha256 && existsSync(absolute(owner[key])) && statSync(absolute(owner[key])).isDirectory()) return;
    if (!sha256 && !existsSync(absolute(owner[key])) &&
      !/\.(?:json|mjs|js|py|md|png|svg|html|woff2|txt|log)$/.test(owner[key])) return;
    found.set(JSON.stringify(trail), { owner, key, path: owner[key],
      sha256: sha256 ?? owner[`${key}Sha256`] ?? null, trail });
  };
  activePaths(document, add);
  function visit(value, trail = []) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach((item, i) => {
      if (typeof item === 'string') add(value, i, null, [...trail, i]);
      else visit(item, [...trail, i]);
    });
    if (typeof value.path === 'string') add(value, 'path', value.sha256 ?? value.byte_sha256, [...trail, 'path']);
    for (const [key, item] of Object.entries(value)) {
      if (['path', 'original', 'originalPath'].includes(key)) continue;
      if (typeof item === 'string' && resourcePath.test(item)) add(value, key, null, [...trail, key]);
      else if (item && typeof item === 'object') visit(item, [...trail, key]);
    }
  }
  visit(document);
  return [...found.values()];
}

export async function prepareRetention(file = inputsPath) {
  const { input, inputBytes, file: inputFile } = await finalInputs(file);
  const indexBytes = await bytes(indexPath);
  const index = JSON.parse(indexBytes);
  collections.forEach(key => assert.ok(Array.isArray(index[key]), `Missing evidence collection: ${key}`));
  const plan = new Map();
  const aliases = [
    ...(input.aliases ?? []),
    ...input.reportMappings.map(mapping => ({
      originalPath: mapping.originalPath, path: mapping.report.path, sha256: mapping.report.sha256,
    })),
  ];
  const registry = new Map();
  const protectedFiles = new Map();
  const resolved = new Map();
  const queue = [];
  const roots = [];
  const reused = [];
  const frozenInputAliases = [];
  const parseDisabled = new Set();
  const usedProvenance = new Set();
  const remember = binding => {
    assert.match(binding.sha256, shaPattern, `Missing historical/source SHA: ${binding.path}`);
    const name = local(binding.originalPath ?? binding.path);
    const hashes = registry.get(name) ?? new Set();
    hashes.add(binding.sha256);
    registry.set(name, hashes);
  };
  const enqueue = (binding, label, effective = false) => {
    assert.ok(binding?.path, `Missing final binding: ${label}`);
    remember(binding);
    const item = { ...binding, path: local(binding.path), label, effective };
    queue.push(item);
    if (binding.dependencies === false) parseDisabled.add(`${item.path}:${item.sha256}`);
    if (effective) roots.push(item);
  };
  for (const card of input.cards) {
    enqueue(card.science, `${card.id} science`, true);
    enqueue(card.freeze, `${card.id} author freeze`, true);
    enqueue(card.native, `${card.id} completed native receipt`);
    (card.before ?? []).forEach(item => enqueue(item, `${card.id} explicit before binding`));
    (card.evidence ?? []).forEach(item => enqueue(item, `${card.id} history`));
  }
  for (const card of input.historicalCards) {
    enqueue(card.freeze, `${card.id} blocked author freeze`);
    card.evidence.forEach(item => enqueue(item, `${card.id} blocked history`));
  }
  input.authorFreezes.forEach(item => enqueue(item, 'explicit immutable author freeze'));
  for (const entry of input.provenanceOnly ?? []) enqueue(entry.report, 'raw harness-provenance report');
  for (const figure of input.figureReports) {
    assert.ok(input.cards.some(card => card.id === figure.card), 'No blocked-card effective figure gate.');
    enqueue(figure.report, `${figure.card} figure gate`, true);
    (figure.evidence ?? []).forEach(item => enqueue(item, `${figure.card} figure history`));
  }
  for (const key of ['result', 'tiles', 'review']) enqueue(input.screens[key], `screens.${key}`, true);
  for (const trace of input.sourceTraces) {
    enqueue(trace.report, `${trace.book} source trace`, true);
    (trace.evidence ?? []).forEach(item => enqueue(item, `${trace.book} source history`));
  }
  for (const binding of [...(input.evidence ?? []), ...(input.screens.evidence ?? [])]) {
    enqueue(binding, 'explicit history');
  }

  // Only explicit originalPath+SHA records in supplied preservation manifests
  // create aliases; matching filenames or current-byte guesses never do.
  function collectAliases(value) {
    if (!value || typeof value !== 'object') return;
    if (value.path && value.originalPath && shaPattern.test(value.sha256 ?? '') &&
      !otherTask(value.path) && !otherTask(value.originalPath)) {
      aliases.push({ path: value.path, originalPath: value.originalPath, sha256: value.sha256 });
    }
    Object.values(value).forEach(collectAliases);
  }
  for (const binding of [...queue]) {
    if (!binding.path.endsWith('.json') || binding.dependencies === false ||
      !(await exists(binding.path))) continue;
    const data = await bytes(binding.path);
    if (hash(data) === binding.sha256) collectAliases(JSON.parse(data));
  }
  for (const alias of aliases) {
    assert.ok(alias.originalPath && alias.path, 'Historical aliases need originalPath and preserved path.');
    local(alias.originalPath);
    local(alias.path);
    await verify(alias.path, alias.sha256);
    remember(alias);
    enqueue(alias, 'exact SHA alias');
  }
  const projectedIndex = () => {
    const result = structuredClone(index);
    for (const [destination, item] of plan) result[item.collection].push({
      path: destination, sha256: item.sha256, originalPath: item.source, ...item.metadata,
    });
    return result;
  };
  async function retain(source, data, collection, original) {
    const sha256 = hash(data);
    const previous = lookup(projectedIndex(), original, sha256) ??
      lookup(projectedIndex(), source, sha256);
    if (previous) {
      if (!plan.has(previous)) await verify(previous, sha256);
      if (!lookup(projectedIndex(), original, sha256)) {
        // Main's later staging must include this role, even for a reused raw path.
        index[collection].push({ path: previous, sha256, originalPath: original, batch: 'D-020',
          role: 'Exact SHA alias for preserved historical bytes; no new approval' });
      }
      reused.push({ originalPath: original, path: previous, sha256 });
      return previous;
    }
    const category = collection === 'surfaces' ? `${evidence}/offline/d020` :
      ['sourceCrops', 'figurePixels'].includes(collection) ? `${evidence}/pixels/d020` : `${history}/raw`;
    const destination = `${category}/${hash(original).slice(0, 12)}-${sha256.slice(0, 16)}-${path.basename(original)}`;
    if (plan.has(destination)) assert.equal(plan.get(destination).sha256, sha256, 'Destination collision.');
    else {
      if (await exists(destination)) await verify(destination, sha256);
      plan.set(destination, { source, data, sha256, collection,
        metadata: { original: original, role: 'Verbatim existing evidence; no new gate or approval' } });
    }
    return destination;
  }
  async function resolve(original, expected) {
    original = local(original);
    assert.match(expected, shaPattern, `Missing historical/source SHA: ${original}`);
    const key = `${original}:${expected}`;
    if (resolved.has(key)) return resolved.get(key);
    const reportMapping = input.reportMappings.find(mapping =>
      local(mapping.originalPath) === original && mapping.report.sha256 === expected);
    let source = reportMapping ? local(reportMapping.report.path) : original;
    let data = await exists(source) ? await bytes(source) : null;
    if (!data || hash(data) !== expected) {
      const archived = lookup(projectedIndex(), original, expected);
      const alias = aliases.find(item => local(item.originalPath) === original && item.sha256 === expected);
      source = archived ?? alias?.path;
      assert.ok(source, `Missing exact historical bytes: ${original} (${expected}); no current-file substitution.`);
      source = local(source);
      data = await bytes(source);
    }
    assert.equal(hash(data), expected, `Exact alias drift: ${original}`);
    const isPixel = /\.png$/i.test(original);
    const collection = !isPixel ? 'reports' :
      /(?:offline|screenshot|tile)/.test(original) ? 'surfaces' :
        /(?:source|\/pages\/|\/artifacts\/(?:9p|10p)\/figures\/)/.test(original) ? 'sourceCrops' : 'figurePixels';
    const alreadyDurable = source === original &&
      (original.startsWith('ssot-resources/') || original.startsWith(`${evidence}/`));
    const destination = alreadyDurable ? original : await retain(source, data, collection, original);
    protectedFiles.set(source, { path: source, sha256: expected });
    const result = { originalPath: original, path: destination, sha256: expected, source, data };
    resolved.set(key, result);
    if (source !== original) frozenInputAliases.push({
      originalPath: original, path: destination, sha256: expected, snapshotSource: source,
      basis: 'Exact SHA alias only; later retention is not retroactive approval',
    });
    return result;
  }
  function expectedSha(ref, report) {
    if (ref.sha256) return ref.sha256;
    const explicit = (input.activeBindings ?? []).filter(item =>
      local(item.report) === local(report) && local(item.path) === local(ref.path) &&
      JSON.stringify(item.trail) === JSON.stringify(ref.trail));
    assert.ok(explicit.length <= 1, `Ambiguous explicit binding: ${report}/${ref.trail.join('.')}`);
    if (explicit.length) return explicit[0].sha256;
    const candidates = [...(registry.get(local(ref.path)) ?? [])];
    assert.equal(candidates.length, 1,
      `Missing/ambiguous historical/source SHA: ${report}/${ref.trail.join('.')}; Main must supply activeBindings.`);
    return candidates[0];
  }

  const documents = new Map();
  const inspected = new Set();
  for (let i = 0; i < queue.length; i++) {
    const binding = queue[i];
    const key = `${binding.path}:${binding.sha256}`;
    const item = await resolve(binding.path, binding.sha256);
    if (inspected.has(key)) continue;
    inspected.add(key);
    if (!binding.path.endsWith('.json') || parseDisabled.has(key)) continue;
    // Already-durable dependencies stay protected, not a new whole-book scan.
    if (!scratch(binding.path) && !binding.effective && !aliases.some(a => local(a.path) === binding.path)) continue;
    const document = JSON.parse(item.data);
    const refs = references(document).filter(ref => {
      const entry = provenanceReference(input.provenanceOnly, binding, ref.trail, ref.path);
      if (entry) {
        usedProvenance.add(entry);
        return false;
      }
      assert.ok(!relative(ref.path).startsWith('../') || nativeFontDependency(ref.path),
        `Unresolved external dependency: ${binding.path}/${ref.trail.join('.')} -> ${ref.path}`);
      return true;
    });
    documents.set(key, { document, refs });
    refs.filter(ref => ref.sha256).forEach(remember);
    for (const ref of refs) {
      const sha256 = expectedSha(ref, binding.path);
      ref.expected = sha256;
      enqueue({ path: ref.path, sha256 }, `${binding.path}/${ref.trail.join('.')}`);
    }
  }
  assert.equal(usedProvenance.size, (input.provenanceOnly ?? []).length,
    'Every provenance-only field must be found in the preserved raw report; no unused exceptions.');
  for (const trace of input.sourceTraces) {
    validateSourceTrace(trace, JSON.parse((await resolve(trace.report.path, trace.report.sha256)).data));
    for (const page of trace.pages) {
      const png = `.tmp/ld-s10y-lesson/${trace.book}/pages/${String(page).padStart(4, '0')}/page.png`;
      const candidates = [...(registry.get(png) ?? [])];
      assert.equal(candidates.length, 1, `Missing/ambiguous frozen original scan binding: ${png}`);
      await resolve(png, candidates[0]);
    }
  }

  const figures = new Set();
  for (const item of input.figureReports) {
    const report = JSON.parse((await resolve(item.report.path, item.report.sha256)).data);
    assert.equal(report.status.toLowerCase(), 'pass', 'Consume only Main-approved complete-card figure gates.');
    for (const figure of report.figures ?? [report]) {
      assert.equal(figure.status.toLowerCase(), 'pass');
      assert.ok(typeof figure.id === 'string', 'Figure gate needs its actual identity.');
      figures.add(figure.id);
    }
  }
  const surfaceDefinition = [];
  for (const card of input.cards) {
    const science = JSON.parse((await resolve(card.science.path, card.science.sha256)).data);
    assert.equal(science.status.toLowerCase(), 'pass', 'A freeze alone is not independent science approval.');
    const folder = `${book}/editions/modern-us-neutral/lessons/${card.id}`;
    const lesson = await read(`${folder}/lesson.json`);
    const exercises = await read(`${folder}/exercises.json`);
    assert.equal(exercises.exercises.length, 0, 'These D020 cards retain zero tasks.');
    const cardFigures = cardFigureIds(lesson, exercises);
    const gate = input.figureReports.find(item => item.card === card.id);
    const native = JSON.parse((await resolve(card.native.path, card.native.sha256)).data);
    assert.equal(native.status.toLowerCase(), 'pass', 'A provisional native receipt is not completion.');
    assert.equal(native.card, card.id);
    assert.equal(local(native.science.path), local(card.science.path));
    assert.equal(native.science.sha256, card.science.sha256);
    if (cardFigures.length) {
      assert.ok(gate, `Missing complete approved figure gate: ${card.id}`);
      assert.equal(local(native.figureGate.path), local(gate.report.path));
      assert.equal(native.figureGate.sha256, gate.report.sha256);
      const raw = JSON.parse((await resolve(gate.report.path, gate.report.sha256)).data);
      exactSet((raw.figures ?? [raw]).map(figure => figure.id), cardFigures, `${card.id} exact figure coverage`);
    } else assert.ok(!gate && !native.figureGate?.path, `Zero-figure card has a figure gate: ${card.id}`);
    for (const id of cardFigures) assert.ok(figures.has(id), `Missing approved figure: ${id}`);
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      const asset = `${folder}/${name}`;
      const approved = native.outputs?.filter(binding => local(binding.path) === asset) ?? [];
      assert.equal(approved.length, 1, `Missing exact completed native output: ${asset}`);
      await verify(asset, approved[0].sha256);
      protectedFiles.set(asset, { path: asset, sha256: approved[0].sha256 });
    }
    for (const surface of ['text', 'exercises']) for (const viewport of [1440, 390]) {
      surfaceDefinition.push({ card: card.id, surface, viewport });
    }
  }
  const result = JSON.parse((await resolve(input.screens.result.path, input.screens.result.sha256)).data);
  const tiles = JSON.parse((await resolve(input.screens.tiles.path, input.screens.tiles.sha256)).data);
  const review = JSON.parse((await resolve(input.screens.review.path, input.screens.review.sha256)).data);
  assert.equal(result.status.toLowerCase(), 'pass');
  assert.equal(review.status.toLowerCase(), 'pass');
  exactSet(result.results.map(surfaceKey), surfaceDefinition.map(surfaceKey), 'final surface coverage');
  const opened = review.tiles ?? review.actualOpened;
  assert.ok(Array.isArray(opened) && Array.isArray(tiles.tiles));
  exactSet(opened.map(tileKey), tiles.tiles.map(tileKey), 'existing actually-opened tile coverage');
  for (const tile of opened) assert.ok(tile.actuallyOpened === true || tile.actualOpened === true ||
    tile.actualOpenedByMain === true, `No recorded pixel open: ${tile.path}`);

  const effectiveReports = [];
  for (const binding of roots) {
    const key = `${binding.path}:${binding.sha256}`;
    const item = await resolve(binding.path, binding.sha256);
    const entry = documents.get(key);
    assert.ok(entry, `Missing root report document: ${binding.path}`);
    const current = structuredClone(entry.document);
    const replacements = [];
    for (const ref of entry.refs) {
      const retained = await resolve(ref.path, ref.expected);
      if (retained.path === ref.path) continue;
      let owner = current;
      for (const field of ref.trail.slice(0, -1)) owner = owner[field];
      owner[ref.key] = retained.path;
      replacements.push({ trail: ref.trail, from: ref.path, to: retained.path, sha256: ref.expected });
    }
    const reversed = structuredClone(current);
    for (const replacement of replacements) {
      let owner = reversed;
      for (const field of replacement.trail.slice(0, -1)) owner = owner[field];
      owner[replacement.trail.at(-1)] = replacement.from;
    }
    assert.deepEqual(reversed, entry.document, 'Only dependency paths may change; retain outcomes/observations verbatim.');
    const rawPath = scratch(binding.path) ? item.path :
      await retain(item.source, item.data, 'reports', binding.path);
    const data = encode(current);
    const destination = `${evidence}/reports/d020/${hash(binding.path).slice(0, 12)}-${path.basename(binding.path)}`;
    if (await exists(destination)) assert.deepEqual(await bytes(destination), data, 'Refuse effective-report overwrite.');
    const prior = plan.get(destination);
    if (prior) assert.deepEqual(prior.data, data, 'Effective-report collision.');
    else plan.set(destination, { source: null, data, sha256: hash(data), collection: 'reports',
      metadata: { role: 'Path-only effective copy; existing independent outcome unchanged', original: binding.path } });
    effectiveReports.push({ label: binding.label,
      original: { path: rawPath, sha256: binding.sha256 },
      effective: { path: destination, sha256: hash(data) }, replacements });
  }
  const retainedInput = await retain(inputFile, inputBytes, 'reports', inputFile);
  const summary = {
    ticket: 'STEMROBIN-181', batch: 'D-020', status: 'existing-evidence-retention-only-no-new-approval',
    scope: input.cards.map(card => card.id),
    excludedModernCards: historicalCardIds,
    n71AndN76ProseScienceCandidateFiguresPartialPassAndFailuresAreHistoricalOnly: true,
    completionDerivedFromMainExplicitFinalCardsOnly: true,
    authorFreezeBindings: input.authorFreezes,
    historicalCardBindings: input.historicalCards,
    markerDiagnostic: input.markerDiagnostic,
    provenanceOnly: await Promise.all((input.provenanceOnly ?? []).map(async entry => ({
      ...entry, rawReport: { path: (await resolve(entry.report.path, entry.report.sha256)).path,
        sha256: entry.report.sha256 },
    }))),
    externalHarnessDocumentsNotCopiedOrTreatedAsActiveDependencies: true,
    explicitPromoterReportMappings: input.reportMappings,
    finalInputs: { path: retainedInput, sha256: hash(inputBytes), originalPath: inputFile },
    sourceScope: input.sourceTraces.map(trace => ({ book: trace.book, pages: trace.pages, pageOnly: trace.pageOnly === true })),
    figures: [...figures].sort(), effectiveReports, frozenInputAliases, reused,
    protectedFiles: [...protectedFiles.values()],
    derivedCounts: { plannedFiles: plan.size,
      sourcePages: input.sourceTraces.reduce((sum, trace) => sum + trace.pages.length, 0),
      surfaces: result.results.length, openedTiles: opened.length },
    rawReportsAndHistoricalDependenciesPreservedVerbatim: true,
    historicalInputsResolvedOnlyByExactSha: true,
    currentProductSpecRenderReviewSourceAndScreensUnchanged: true,
    existingNativeReportsAndRecordOnlyRecoveriesRetainedNotRerun: true,
    gatesRendererBrowserFinalizeAssembleDbGitMeterOrPromotionCalls: 0,
  };
  return { inputFile, inputBytes, indexBytes, index, plan, summary, protectedFiles };
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args[0] === '--help') {
    console.log('Prepared only. Waiting for Main final {cards,figureReports,screens,sourceTraces}.');
    console.log('After explicit final authorization: --execute --input <ticket/tmp/frozen-input.json>');
    return;
  }
  assert.equal(args.length, 3);
  assert.ok(['--plan', '--execute'].includes(args[0]));
  assert.equal(args[1], '--input');
  const state = await prepareRetention(args[2]);
  if (args[0] === '--plan') {
    console.log(JSON.stringify(state.summary, null, 2));
    return;
  }
  assert.deepEqual(await bytes(state.inputFile), state.inputBytes, 'Final inputs changed.');
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent shared evidence update.');
  assert.ok(!(await exists(retentionManifest)), 'D020 already retained; do not execute twice.');
  for (const binding of state.protectedFiles.values()) await verify(binding.path, binding.sha256);
  for (const [destination, item] of state.plan) {
    if (item.source) await verify(item.source, item.sha256);
    await immutableWrite(destination, item.data);
    const record = { path: destination, sha256: item.sha256, originalPath: item.source,
      batch: 'D-020', ...item.metadata };
    const old = state.index[item.collection].find(row => row.path === destination);
    if (old) assert.equal(old.sha256, item.sha256, 'Index byte conflict.');
    else state.index[item.collection].push(record);
  }
  const manifestBytes = encode(state.summary);
  await immutableWrite(retentionManifest, manifestBytes);
  state.index.reports.push({ path: retentionManifest, sha256: hash(manifestBytes), batch: 'D-020' });
  for (const binding of state.protectedFiles.values()) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(state.inputFile), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent index update; stop with immutable copies intact.');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), encode(state.index));
  console.log('D020 evidence retained. Products/meters/staging/Git untouched; no gate repeated.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
