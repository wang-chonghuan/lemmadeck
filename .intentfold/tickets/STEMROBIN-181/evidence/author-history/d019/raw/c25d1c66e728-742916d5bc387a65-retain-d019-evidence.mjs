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

export const inputsPath = `${ticket}/tmp/d019-retention-inputs.json`;
export const retentionManifest = `${evidence}/reports/d019-retention-manifest.json`;
const history = `${evidence}/author-history/d019`;
const historicalCards = [68, 69, 70].map(n => `phy9-c2-s2-n${n}`);
const finalizedSourcePages = {
  '9p': Array.from({ length: 19 }, (_, index) => 168 + index),
  '10p': [60, 61, 62, 63],
};
const shaPattern = /^[a-f0-9]{64}$/;
const resourcePath = /^(?:\.tmp\/|\.intentfold\/|\.claude\/|\.agents\/|ssot-resources\/|\/Users\/)/;
const surfaceKey = item =>
  `${item.card ?? item.id}:${item.surface}:${item.viewport?.width ?? item.viewport}`;
const tileKey = item => `${relative(item.path)}:${item.sha256}`;
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
const encode = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const local = file => {
  const name = relative(file);
  if (name.startsWith('../') && nativeFontDependency(file)) return path.resolve(file);
  assert.ok(name && !name.startsWith('../') && !path.isAbsolute(name), `Outside workspace: ${file}`);
  return name;
};

// Main supplies final bindings, not provisional names or an inferred batch:
// {batch:"D019",final:true,
//  cards:[{id,science:{path,sha256},freeze:{path,sha256},evidence:[]}],
//  figureReports:[{card,report:{path,sha256},evidence:[]}],
//  screens:{result:{path,sha256},tiles:{path,sha256},review:{path,sha256},evidence:[]},
//  sourceTraces:[{book:"9p"|"10p",pages:[...],pageOnly:true for10p,
//    report:{path,sha256},evidence:[native page PNG/MD/JSON/audit/crop bindings]}],
//  historicalCards:[{id,freeze:{path,sha256},evidence:[blocked reports/candidates]}],
//  authorFreezes:[{path,sha256}],
//  reportMappings:[{originalPath:promoterPlaceholder,report:{path,sha256}}],
//  evidence?:[{path,sha256,dependencies?:false}],
//  aliases?:[{originalPath,path,sha256}],
//  activeBindings?:[{report,trail:[...],path,sha256}]}
// Evidence lists include n68/n69/n70 prose/candidates/failures (history only), source
// initial failures/corrections, manifests and repairs. Planned cards are67/73/74;
// Main still supplies final3-5cards. Finalized source scope is9p168-186 (not167
// or187) and10p60-63 page-only. Whole author freezes, including blocked187, stay
// immutable history. Main explicitly enumerates all freezes; no directory scan.
// n67 historical figuresTemplate requires an exact alias from Main, not an
// inferred snapshot path. Promoter placeholders require explicit reportMappings.
export async function finalInputs(file = inputsPath) {
  file = local(file);
  assert.ok(file.startsWith(`${ticket}/tmp/`), 'Final input must be ticket scratch.');
  assert.ok(await exists(file), `Waiting for Main final {cards,figureReports,screens,sourceTraces}: ${file}`);
  const inputBytes = await bytes(file);
  const input = JSON.parse(inputBytes);
  assert.equal(input.batch, 'D019');
  assert.equal(input.final, true, 'Wait for the explicitly frozen final batch.');
  assert.ok(Array.isArray(input.cards) && Array.isArray(input.figureReports));
  const ids = input.cards.map(card => card.id);
  assert.ok(ids.length >= 3 && ids.length <= 5, 'Wait for Main explicit final3-5card batch.');
  exactSet(ids, [...new Set(ids)], 'Main final card identities');
  assert.ok(ids.every(id => /^phy9-c2-s2-n\d+$/.test(id) && !historicalCards.includes(id)),
    'Only explicitly completed9p cards; n68/n69/n70 remain history-only.');
  assert.ok(input.screens && ['result', 'tiles', 'review'].every(key => input.screens[key]?.sha256),
    'Wait for final result, tiles and their existing independent screenshot review.');
  assert.ok(Array.isArray(input.historicalCards), 'Explicit n68/n69/n70 history bindings are required.');
  exactSet(input.historicalCards.map(card => card.id), historicalCards, 'Blocked modern history');
  assert.ok(input.historicalCards.every(card => card.freeze?.path && card.freeze?.sha256 &&
    Array.isArray(card.evidence) && card.evidence.length),
  'History must bind author freezes and actual blocked reports/candidates, not claim completion.');
  assert.ok(Array.isArray(input.authorFreezes) && input.authorFreezes.length,
    'Main must explicitly bind all author freezes, including source and blocked history.');
  for (const card of [...input.cards, ...input.historicalCards]) {
    assert.ok(input.authorFreezes.some(binding => relative(binding.path) === relative(card.freeze.path) &&
      binding.sha256 === card.freeze.sha256), `Missing exact author freeze: ${card.id}`);
  }
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
  assert.ok(Array.isArray(input.sourceTraces));
  for (const trace of input.sourceTraces) {
    assert.ok(['9p', '10p'].includes(trace.book) && Array.isArray(trace.pages) && trace.pages.length);
    assert.ok(trace.pages.every(Number.isInteger));
    if (trace.book === '10p') assert.equal(trace.pageOnly, true, '10p60-63 remains page-only/unassembled.');
  }
  for (const name of ['9p', '10p']) {
    const pages = input.sourceTraces.filter(item => item.book === name).flatMap(item => item.pages);
    assert.ok(pages.length && pages.every(page => page > 0), `Missing explicit ${name} source scope.`);
    exactSet(pages, [...new Set(pages)], `${name} explicit source pages`);
    exactSet(pages, finalizedSourcePages[name], `${name} approved finalized source scope`);
  }
  return { file, inputBytes, input };
}

// Reuse activePaths, also capturing SHA-bound historical "before" objects and
// native sibling hashes. OriginalPath remains provenance, never an active alias.
function references(document) {
  const found = new Map();
  const add = (owner, key, sha256, trail) => {
    if (['command', 'entry', 'runtime', 'original_path'].includes(key)) return;
    if (!resourcePath.test(owner[key])) return;
    if (!sha256 && existsSync(absolute(owner[key])) && statSync(absolute(owner[key])).isDirectory()) return;
    if (!sha256 && !existsSync(absolute(owner[key])) &&
      !/\.(?:json|mjs|js|py|md|png|svg|html|woff2|txt|log)$/.test(owner[key])) return;
    found.set(JSON.stringify(trail), { owner, key, path: owner[key],
      sha256: sha256 ?? owner[`${key}Sha256`] ?? null, trail });
  };
  activePaths(document, add);
  function visit(value, trail = []) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) return value.forEach((item, i) => visit(item, [...trail, i]));
    if (typeof value.path === 'string') add(value, 'path', value.sha256, [...trail, 'path']);
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
    (card.evidence ?? []).forEach(item => enqueue(item, `${card.id} history`));
  }
  for (const card of input.historicalCards) {
    enqueue(card.freeze, `${card.id} blocked author freeze`);
    card.evidence.forEach(item => enqueue(item, `${card.id} blocked history`));
  }
  input.authorFreezes.forEach(item => enqueue(item, 'explicit immutable author freeze'));
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
    if (value.path && value.originalPath && shaPattern.test(value.sha256 ?? '')) {
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
        index[collection].push({ path: previous, sha256, originalPath: original, batch: 'D-019',
          role: 'Exact SHA alias for preserved historical bytes; no new approval' });
      }
      reused.push({ originalPath: original, path: previous, sha256 });
      return previous;
    }
    const category = collection === 'surfaces' ? `${evidence}/offline/d019` :
      ['sourceCrops', 'figurePixels'].includes(collection) ? `${evidence}/pixels/d019` : `${history}/raw`;
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
    const refs = references(document);
    documents.set(key, { document, refs });
    refs.filter(ref => ref.sha256).forEach(remember);
    for (const ref of refs) {
      const sha256 = expectedSha(ref, binding.path);
      ref.expected = sha256;
      enqueue({ path: ref.path, sha256 }, `${binding.path}/${ref.trail.join('.')}`);
    }
  }
  for (const trace of input.sourceTraces) for (const page of trace.pages) {
    const png = `.tmp/ld-s10y-lesson/${trace.book}/pages/${String(page).padStart(4, '0')}/page.png`;
    const candidates = [...(registry.get(png) ?? [])];
    assert.equal(candidates.length, 1, `Missing/ambiguous frozen original scan binding: ${png}`);
    await resolve(png, candidates[0]);
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
    assert.equal(exercises.exercises.length, 0, 'These D019 cards retain zero tasks.');
    for (const id of lesson.figures.map(item => item.id)) assert.ok(figures.has(id), `Missing approved figure: ${id}`);
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      const asset = `${folder}/${name}`;
      protectedFiles.set(asset, { path: asset, sha256: hash(await bytes(asset)) });
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
    const destination = `${evidence}/reports/d019/${hash(binding.path).slice(0, 12)}-${path.basename(binding.path)}`;
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
    ticket: 'STEMROBIN-181', batch: 'D-019', status: 'existing-evidence-retention-only-no-new-approval',
    scope: input.cards.map(card => card.id),
    excludedModernCards: historicalCards,
    n68N69N70ProseAndFigureCandidatesFailuresAreHistoricalOnly: true,
    completionDerivedFromMainExplicitFinalCardsOnly: true,
    authorFreezeBindings: input.authorFreezes,
    historicalCardBindings: input.historicalCards,
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
    promotedN67NativeReportAndContextOnlyRebindRetainedNotRerun: true,
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
  assert.ok(!(await exists(retentionManifest)), 'D019 already retained; do not execute twice.');
  for (const binding of state.protectedFiles.values()) await verify(binding.path, binding.sha256);
  for (const [destination, item] of state.plan) {
    if (item.source) await verify(item.source, item.sha256);
    await immutableWrite(destination, item.data);
    const record = { path: destination, sha256: item.sha256, originalPath: item.source,
      batch: 'D-019', ...item.metadata };
    const old = state.index[item.collection].find(row => row.path === destination);
    if (old) assert.equal(old.sha256, item.sha256, 'Index byte conflict.');
    else state.index[item.collection].push(record);
  }
  const manifestBytes = encode(state.summary);
  await immutableWrite(retentionManifest, manifestBytes);
  state.index.reports.push({ path: retentionManifest, sha256: hash(manifestBytes), batch: 'D-019' });
  for (const binding of state.protectedFiles.values()) await verify(binding.path, binding.sha256);
  assert.deepEqual(await bytes(state.inputFile), state.inputBytes);
  assert.deepEqual(await bytes(indexPath), state.indexBytes, 'Concurrent index update; stop with immutable copies intact.');
  state.index.updatedAt = new Date().toISOString();
  await fs.writeFile(absolute(indexPath), encode(state.index));
  console.log('D019 evidence retained. Products/meters/staging/Git untouched; no gate repeated.');
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
