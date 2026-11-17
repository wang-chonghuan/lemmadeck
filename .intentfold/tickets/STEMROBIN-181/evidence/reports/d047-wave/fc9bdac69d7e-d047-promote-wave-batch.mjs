import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, evidence, indexPath, absolute, relative, read, bytes, bind, verify,
  exists, immutableWrite, walk, hash,
} from './retain-d016-evidence.mjs';

const [execute, integrationPath, integrationSha] = process.argv.slice(2);
assert.equal(execute, '--execute');
await verify(integrationPath, integrationSha);
const integration = await read(integrationPath);
const cards = [38, 39, 40, 44].map(n => `phy10-c1-s5-n${n}`);
assert.deepEqual(integration.cards.map(row => row.card), cards);
assert.ok(Array.isArray(integration.retainFolders) && integration.retainFolders.length > 0);
assert.ok(Array.isArray(integration.retainFiles) && integration.retainFiles.length > 0);
const retentionFiles = new Set(integration.retainFiles.map(relative));
for (const source of integration.retainFolders) {
  for (const file of await walk(source)) {
    if (!file.endsWith('page.grid.png')) retentionFiles.add(relative(file));
  }
}
for (const file of retentionFiles) {
  assert.ok(file.startsWith(`${ticket}/tmp/`) && !file.split('/').includes('node_modules')
    && !file.split('/').some(part => part === '.env' || part.startsWith('.env.')));
  assert.ok((await fs.stat(absolute(file))).isFile());
}
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const modern = `${raw}/editions/modern-us-neutral`;
const folder = `${ticket}/tmp/d047-wave-promotion`;
const meterPath = `${ticket}/production-meter.json`;
const sourceBefore = await bytes(`${raw}/book.json`);
const modernBefore = await bytes(`${modern}/book.json`);
const indexBefore = await bytes(indexPath);
const meterBefore = await bytes(meterPath);
assert.equal(await exists(`${folder}/started.json`), false);
const preservation = await read(`${ticket}/tmp/d032-start/preservation.json`);
async function guard() {
  for (const row of preservation.files.filter(row => row.path !== `${raw}/book.json`)) {
    await verify(row.path, row.sha256);
    assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
  }
  await verify('.claude/skills/ld-s10y-lesson/tools/assemble.py',
    '4f16b51802a415cebcfec6fb359549027f8b3bd6ba8d62ef0fad5f0187494340');
}
await guard();
await verify(integration.display.path, integration.display.sha256);
await verify(integration.displayReview.path, integration.displayReview.sha256);
const display = await read(integration.display.path);
const displayReview = await read(integration.displayReview.path);
assert.match(display.status, /^PASS/);
assert.deepEqual(display.failures, []);
assert.equal(display.execution.browserClosed, true);
assert.equal(displayReview.status, 'PASS');
assert.equal(displayReview.allSurfacesCovered, true);
assert.equal(displayReview.allRequiredTilesActuallyOpened, true);
assert.equal(displayReview.displayResult.sha256, integration.display.sha256);
await verify(integration.supplemental.path, integration.supplemental.sha256);
const supplemental = await read(integration.supplemental.path);
assert.equal(supplemental.status, 'PASS-native-reviewed-supplements');
const nativeCards = [];
for (const row of integration.cards) {
  await verify(row.native.path, row.native.sha256);
  const native = await read(row.native.path);
  assert.equal(native.card, row.card);
  assert.equal(native.status, 'PASS-native-bilingual-display-pending');
  await verify(native.manifest.path, native.manifest.sha256);
  const manifest = await read(native.manifest.path);
  assert.equal(manifest.SCI, 'PASS');
  assert.equal(manifest.ZHEN, 'PASS');
  for (const report of manifest.reports) await verify(report.path, report.sha256);
  nativeCards.push({ ...row, nativeReceipt: row.native, native, manifest });
}
await immutableWrite(`${folder}/started.json`, `${JSON.stringify({
  integration: await bind(integrationPath), protectedFiles: preservation.files,
  policy: 'Consume exact SOURCE/SCI/ZHEN/figure/choice/answer/display PASS; no substantive gate replay.',
}, null, 2)}\n`);
const index = JSON.parse(indexBefore);
const retained = [];
const map = new Map();
async function retain(file, collection = 'reports', metadata = {}) {
  file = relative(file);
  if (!map.has(file)) {
    const target = `${evidence}/reports/d047-wave/${hash(Buffer.from(file)).slice(0, 12)}-${path.basename(file)}`;
    await immutableWrite(target, await bytes(file));
    const row = { ...await bind(target), originalPath: file, batch: 'D029', ...metadata };
    retained.push(row);
    index[collection].push(row);
    map.set(file, { path: row.path, sha256: row.sha256 });
  }
  return map.get(file);
}
const reports = {
  integration: await retain(integrationPath),
  display: await retain(integration.display.path),
  displayReview: await retain(integration.displayReview.path),
  supplemental: await retain(integration.supplemental.path),
};
for (const version of integration.retainVersions ?? []) {
  await verify(version.path, version.sha256);
  await retain(version.path, 'reports', {
    originalPath: relative(version.originalPath),
    snapshotPath: relative(version.path),
    role: 'Exact tool version used by the initial display; retained before the affected numbering repair.',
  });
}
for (const file of retentionFiles)
  await retain(file, /(?:fullpage|tile|scroll-).*\.png$/.test(file) ? 'surfaces' : 'reports');
for (const card of nativeCards) {
  await retain(card.native.manifest.path);
  for (const row of card.manifest.reports) await retain(row.path);
  for (const figure of card.manifest.figures) await retain(figure.independentReview.path);
}
const outputsByCard = new Map(cards.map(card => [card, []]));
const figureOutputs = new Map();
async function output(card, target, data) {
  assert.equal(await exists(target), false, `Refuse overwrite: ${target}`);
  await immutableWrite(target, data);
  const row = await bind(target);
  outputsByCard.get(card).push(row);
  return row;
}
async function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  const receipt = `${folder}/${name}.json`;
  await immutableWrite(receipt, `${JSON.stringify({
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
  return retain(receipt);
}
async function rebindHistory(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (const item of value) await rebindHistory(item);
    return;
  }
  if (typeof value.path === 'string' &&
      /^(?:\.tmp\/|\.intentfold\/tickets\/STEMROBIN-181\/tmp\/)/.test(relative(value.path))) {
    if (value.sha256) await verify(value.path, value.sha256);
    Object.assign(value, await retain(value.path));
  }
  for (const [key, item] of Object.entries(value)) if (key !== 'path') await rebindHistory(item);
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
for (const card of nativeCards) {
  const zh = card.native.languages.find(row => row.language === 'zh');
  const candidateRaw = `${zh.nativeRoot}/10p`;
  const candidateModern = `${zh.root}/10p/editions/modern-us-neutral`;
  for (const [from, to, names] of [
    [`${candidateRaw}/lessons/${card.card}`, `${raw}/lessons/${card.card}`,
      ['lesson.json', 'lesson.md', 'exercises.json']],
    [`${candidateModern}/lessons/${card.card}`, `${modern}/lessons/${card.card}`,
      ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']],
  ]) {
    for (const name of names) await output(card.card, `${to}/${name}`, await bytes(`${from}/${name}`));
  }
  for (const figure of card.manifest.figures) {
    const id = figure.id;
    if (figureOutputs.has(id)) {
      outputsByCard.get(card.card).push(...figureOutputs.get(id));
      continue;
    }
    const rows = [];
    const mode = figure.mode;
    assert.ok(['deterministic', 'generated', 'hybrid'].includes(mode));
    const originalSpec = await read(`${candidateModern}/figures/${id}.spec.json`);
    const spec = structuredClone(originalSpec);
    const assetRows = [];
    if (mode === 'hybrid') {
      await verify(`${raw}/figures/${id}.png`, spec.source.image.sha256);
      spec.source.image.path = `${raw}/figures/${id}.png`;
      for (const asset of spec.assets) {
        const assetPath = `${modern}/figures/${id}.${asset.id}.png`;
        const metadataPath = `${modern}/figures/${id}.${asset.id}.generation.json`;
        const assetMetadata = await read(asset.metadata);
        assetMetadata.output.path = assetPath;
        await rebindHistory(assetMetadata);
        assetRows.push(await output(card.card, assetPath, await bytes(asset.path)));
        assetRows.push(await output(card.card, metadataPath,
          `${JSON.stringify(assetMetadata, null, 2)}\n`));
        asset.path = assetPath;
        asset.metadata = metadataPath;
      }
      assert.deepEqual(spec.objects, originalSpec.objects);
      assert.deepEqual(spec.assertions, originalSpec.assertions);
    }
    rows.push(await output(card.card, `${modern}/figures/${id}.spec.json`,
      mode === 'hybrid' ? `${JSON.stringify(spec, null, 2)}\n`
        : await bytes(`${candidateModern}/figures/${id}.spec.json`)));
    rows.push(await output(card.card, `${modern}/figures/${id}.${mode === 'generated' ? 'png' : 'svg'}`,
      await bytes(`${candidateModern}/figures/${id}.${mode === 'generated' ? 'png' : 'svg'}`)));
    if (mode === 'hybrid') {
      rows.push(await output(card.card, `${modern}/figures/${id}.artwork.png`,
        await bytes(`${candidateModern}/figures/${id}.artwork.png`)));
    }
    const evidenceSuffix = mode === 'generated' ? 'generation' : 'render';
    const metadata = await read(`${candidateModern}/figures/${id}.${evidenceSuffix}.json`);
    if (mode === 'generated') metadata.output.path = `${modern}/figures/${id}.png`;
    else {
      metadata.spec.path = `${modern}/figures/${id}.spec.json`;
      metadata.spec.sha256 = rows[0].sha256;
      metadata.output.svg.path = `${modern}/figures/${id}.svg`;
      if (mode === 'hybrid') {
        metadata.output.artwork.path = `${modern}/figures/${id}.artwork.png`;
        for (const asset of metadata.assets) {
          const matched = spec.assets.find(row => row.id === asset.id);
          assert.ok(matched);
          asset.path = matched.path;
          asset.metadata = await bind(matched.metadata);
        }
      }
    }
    await rebindHistory(metadata);
    const evidencePath = `${modern}/figures/${id}.${evidenceSuffix}.json`;
    rows.push(await output(card.card, evidencePath, `${JSON.stringify(metadata, null, 2)}\n`));
    const independentPath = `${modern}/figures/${id}.independent-review.json`;
    rows.push(await output(card.card, independentPath, `${JSON.stringify({
      schema: 'ld-s10y-image/promoted-independent-review@1', figure: id, status: 'pass',
      originalReport: await retain(figure.independentReview.path),
      fullCardDisplay: reports.displayReview,
      spec: rows[0], output: rows[1], [evidenceSuffix]: rows.at(-1),
      limits: 'Exact existing independent approvals consumed. Geometry/artwork unchanged; only durable evidence paths rebound.',
    }, null, 2)}\n`));
    const reviewPath = `${modern}/figures/${id}.review.json`;
    await run(`${id}-durable-review`, [python, '-B',
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${modern}/figures/${id}.spec.json`, `--${evidenceSuffix}`, evidencePath,
      '--output', reviewPath, '--status', 'pass', '--notes',
      `Independent source/figure and batch full-card display PASS consumed; binding ${independentPath}. No content rerender or substantive review replay.`,
    ]);
    rows.push(await bind(reviewPath));
    outputsByCard.get(card.card).push(rows.at(-1));
    figureOutputs.set(id, [...rows, ...assetRows]);
  }
}
const zhSupplement = supplemental.languages.find(row => row.language === 'zh');
for (const row of zhSupplement.outputs) {
  await verify(row.path, row.sha256);
  await output('phy10-c1-s5-n39', `${modern}/lessons/phy10-c1-s5-n39/${row.name}`, await bytes(row.path));
}
const sourceIndex = JSON.parse(sourceBefore);
const rows = [];
for (const card of nativeCards) {
  const zh = card.native.languages.find(row => row.language === 'zh');
  const source = await read(`${zh.nativeRoot}/10p/book.json`);
  const row = source.lessons.find(row => row.id === card.card);
  assert.ok(row);
  assert.ok(!sourceIndex.lessons.some(entry => entry.id === row.id));
  sourceIndex.lessons.push(row);
  const candidateIndex = await read(`${zh.nativeRoot}/10p/editions/modern-us-neutral/book.json`);
  rows.push(candidateIndex.lessons.find(entry => entry.card_id === card.card || entry.id === card.card || entry.lesson === card.card));
}
assert.ok(rows.every(Boolean));
sourceIndex.audit.exercise_count = sourceIndex.lessons.reduce((sum, row) => sum + row.exercises, 0);
sourceIndex.audit.figure_numbers = [...new Set([
  ...sourceIndex.audit.figure_numbers,
  ...[...figureOutputs.keys()].map(id => Number(id.split('-').at(-1))),
])].sort((a, b) => a - b);
await immutableWrite(`${folder}/modern-rows.json`, `${JSON.stringify(rows, null, 2)}\n`);
assert.deepEqual(await bytes(`${raw}/book.json`), sourceBefore);
await fs.writeFile(absolute(`${raw}/book.json`), `${JSON.stringify(sourceIndex, null, 2)}\n`);
const code = [
  'import sys,json', 'from pathlib import Path',
  "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')", 'import edition',
  'book,modern,rows,profile=map(Path,sys.argv[1:])',
  'edition.update_book_index(book,modern,profile,json.loads(rows.read_text()))',
].join('\n');
const indexCommand = await run('native-modern-index', [python, '-B', '-c', code,
  raw, modern, `${folder}/modern-rows.json`, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json']);
const durableHybridCheck = await run('n44-durable-path-check', [python, '-B',
  '.claude/skills/ld-s10y-lesson/tools/validate_publish.py', raw,
  '--edition', 'modern-us-neutral', '--lesson', 'phy10-c1-s5-n44']);
assert.deepEqual((await read(`${modern}/book.json`)).lessons.filter(row =>
  !cards.includes(row.card_id ?? row.id ?? row.lesson)), JSON.parse(modernBefore).lessons);
const readiness = [];
for (const card of nativeCards) {
  const number = Number(card.card.split('-n').at(-1));
  const target = `${evidence}/reports/d047-n${number}-readiness.json`;
  const count = number === 39 ? supplemental.counts : {
    tasks: 0, choiceQuestions: 0, choiceOptions: 0, readOnlyStandardAnswers: 0,
  };
  await immutableWrite(target, `${JSON.stringify({
    ticket: 'STEMROBIN-181', card: card.card, status: 'complete-unbatched-local-only',
    SOURCE: 'PASS', SCI: 'PASS', ZHEN: 'PASS', fullCardDisplayPASS: true,
    native: await retain(card.nativeReceipt.path),
    manifest: await retain(card.native.manifest.path), reports, outputs: outputsByCard.get(card.card),
    counts: { ...count, modernFigures: card.manifest.figures.length }, indexCommand, durableHybridCheck,
    existingGatesConsumed: true, parentImageOpens: 0, canonicalPromotion: true,
    limits: 'Offline local promotion only; no push claim, DB, app integration, corpus completion, tests/build, handoff, merge or deploy.',
  }, null, 2)}\n`);
  index.reports.push(await bind(target));
  readiness.push(await bind(target));
}
await guard();
assert.deepEqual(await bytes(indexPath), indexBefore);
index.updatedAt = new Date().toISOString();
await fs.writeFile(absolute(indexPath), `${JSON.stringify(index, null, 2)}\n`);
const meter = JSON.parse(meterBefore);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 89);
assert.deepEqual(meter.currentCheckpoint.completeUnbatchedCards, []);
meter.currentCheckpoint.completeUnbatchedCards = cards;
meter.currentCheckpoint.modernReadyArtifacts = 93;
meter.currentCheckpoint.nextBatch.completeCards = cards;
meter.currentCheckpoint.nextBatch.completeCardClaim = false;
meter.currentCheckpoint.nextBatch.latestReadiness = readiness.at(-1);
meter.currentCheckpoint.readyDoesNotMeanDelivered = '89 pushed cards; four independently complete local D029 cards awaiting explicit commit/push.';
meter.readOnlyStandardAnswers += 6;
meter.updatedAt = new Date().toISOString();
assert.deepEqual(await bytes(meterPath), meterBefore);
await fs.writeFile(absolute(meterPath), `${JSON.stringify(meter, null, 2)}\n`);
await immutableWrite(`${folder}/result.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D029', status: 'PASS-local-promotion',
  integration: await bind(integrationPath), readiness, retained, parentImageOpens: 0,
}, null, 2)}\n`);
console.log(JSON.stringify({ readiness, completeUnbatchedCards: cards }));
