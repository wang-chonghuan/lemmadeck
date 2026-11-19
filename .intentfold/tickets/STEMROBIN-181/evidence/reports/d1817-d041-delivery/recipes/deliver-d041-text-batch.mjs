import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const require = createRequire(import.meta.url);
const { tocCardIds } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/lesson_order.js'));
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const output = `${ticket}/evidence/reports/d1817-d041-delivery`;
const parent = '5df63b92ec08385d9b934530483c90019e39b62d';
const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
const read = file => JSON.parse(fs.readFileSync(file));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = file => digest(fs.readFileSync(file));
const bind = file => ({ path: file, sha256: hash(file) });
const git = (args, input) => execFileSync('git', args, { input, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
const headJson = file => JSON.parse(git(['show', `${parent}:${file}`]));
const save = (file, value, exclusive = true) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: exclusive ? 'wx' : 'w' });
};
const files = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? files(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]);
const retain = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) assert.equal(hash(target), hash(source), target);
  else fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  return { ...bind(target), originalPath: source };
};
const staged = () => git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);

if (process.argv[2] === '--prepare') {
  assert.deepEqual(staged(), []);
  const readyFiles = process.argv.slice(3);
  assert(readyFiles.length >= 3 && readyFiles.length <= 5, 'Explicit small-batch ready receipts required');
  const ready = readyFiles.map(file => {
    const card = read(file);
    assert.equal(card.batch, 'D041');
    assert.equal(card.status, 'complete-offline-card-awaiting-small-batch');
    assert.equal(card.counts.writtenQuestions, 0);
    assert.equal(card.counts.figures, 0, 'This preparer is only for zero-figure text cards');
    for (const row of [...card.products, ...Object.values(card.gates).flat()]) {
      assert.equal(hash(row.path), row.sha256, row.path);
    }
    return { file, card };
  });
  const ids = ready.map(row => row.card.id);
  assert.equal(new Set(ids).size, ids.length);
  const retained = [], product = [], pages = new Map(), roots = new Map();
  for (const { file, card } of ready) {
    retained.push(retain(file, `${output}/bindings/${path.basename(file)}`));
    for (const binding of card.products) {
      const marker = binding.path.indexOf('/10p/');
      assert(marker >= 0);
      const target = `${book}/${binding.path.slice(marker + 5)}`;
      retained.push(retain(binding.path, target));
      product.push(target);
      roots.set(card.id, binding.path.slice(0, marker + 4));
    }
    const source = read(card.gates.SOURCE.path);
    assert.equal(source.status, 'PASS-complete-object');
    for (const binding of source.bindings) {
      if (!/\/pages\/\d{4}\/page\.json$/.test(binding.path)) continue;
      assert.equal(hash(binding.path), binding.sha256);
      const directory = path.dirname(binding.path);
      const page = read(binding.path);
      const number = page.meta.source.pdf_page;
      if (pages.has(number)) assert.equal(hash(`${pages.get(number)}/page.json`), hash(binding.path));
      else pages.set(number, directory);
    }
  }
  for (const [number, directory] of pages) {
    assert.deepEqual(read(`${directory}/audit.json`).errors, []);
    const target = `${book}/pages/${String(number).padStart(4, '0')}`;
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      retained.push(retain(`${directory}/${name}`, `${target}/${name}`));
      product.push(`${target}/${name}`);
    }
    // Adjacent native raster crops remain archival candidates, never modern figure approval.
    for (const figure of read(`${directory}/page.json`).meta.figures) {
      const source = `.tmp/ld-s10y-lesson/10p/pages/${String(number).padStart(4, '0')}/figures/${figure.id}.png`;
      assert(fs.existsSync(source));
      const figureTarget = `${book}/figures/${figure.id}.png`;
      retained.push(retain(source, figureTarget));
      product.push(figureTarget);
    }
  }
  for (const { card } of ready) {
    const number = card.id.match(/n(\d+)$/)[1];
    const suffixes = ['text-review', 'display', 'display-review',
      ...(number === '128' ? ['history-review', 'display-affected'] : [])];
    for (const suffix of suffixes) {
      const directory = `${ticket}/tmp/d1817-n${number}-${suffix}`;
      for (const file of files(directory)) {
        retained.push(retain(file, `${output}/reviews/n${number}-${suffix}/${path.relative(directory, file)}`));
      }
    }
  }
  for (const name of fs.readdirSync(scratch).filter(name => /^d041-n\d+.*candidate$/.test(name) &&
    fs.statSync(`${scratch}/${name}`).isDirectory())) {
    for (const file of files(`${scratch}/${name}`)) {
      retained.push(retain(file, `${output}/changed-input-history/${name}/${path.relative(`${scratch}/${name}`, file)}`));
    }
  }
  for (const name of fs.readdirSync(scratch).filter(name => /^source0(?:326|329)\./.test(name))) {
    retained.push(retain(`${scratch}/${name}`, `${output}/source-failure-history/${name}`));
  }
  for (const directory of fs.readdirSync(`${ticket}/tmp`).filter(name => /^d1817-source\d+-?[\d]*-review$/.test(name))) {
    for (const file of files(`${ticket}/tmp/${directory}`)) {
      retained.push(retain(file, `${output}/source-observations/${directory}/${path.relative(`${ticket}/tmp/${directory}`, file)}`));
    }
  }
  for (const name of fs.readdirSync(scratch).filter(name => /^d041.*\.json$/.test(name))) {
    retained.push(retain(`${scratch}/${name}`, `${output}/bindings/${name}`));
  }
  for (const name of fs.readdirSync(scratch).filter(name => /d041.*\.mjs$/.test(name) ||
    ['run-native.mjs', 'source-evidence.mjs'].includes(name))) {
    retained.push(retain(`${scratch}/${name}`, `${output}/recipes/${name}`));
  }
  for (const name of fs.readdirSync(`${scratch}/native`).filter(name => name.startsWith('d041-') &&
    !/primary|discovery|download|science|mit|facts/.test(name))) {
    for (const file of files(`${scratch}/native/${name}`)) {
      retained.push(retain(file, `${output}/native/${name}/${path.basename(file)}`));
    }
  }
  const previousPush = `${ticket}/evidence/reports/d1816-d040-delivery/actual-push.json`;
  assert.equal(read(previousPush).commit, parent);
  const order = new Map(tocCardIds(read('ssot-resources/soviet10year-textbooks/toc/10p/zh.json')).map((id, index) => [id, index]));
  const sourceIndex = headJson(`${book}/book.json`);
  for (const id of ids) {
    assert(!sourceIndex.lessons.some(row => row.id === id));
    const row = read(`${roots.get(id)}/book.json`).lessons.find(row => row.id === id);
    assert(row);
    sourceIndex.lessons.push(row);
  }
  sourceIndex.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
  assert(sourceIndex.lessons.every(row => order.has(row.id)));
  const headPages = git(['ls-tree', '-r', '--name-only', parent, '--', `${book}/pages`])
    .split('\n').filter(file => /\/page\.json$/.test(file));
  const newPages = [...pages.keys()].filter(number =>
    !headPages.includes(`${book}/pages/${String(number).padStart(4, '0')}/page.json`)).sort((a, b) => a - b);
  sourceIndex.pages = headPages.length + newPages.length;
  const projected = [{ path: `${book}/book.json`, value: sourceIndex }];
  for (const edition of editions) {
    const file = `${book}/editions/${edition}/book.json`;
    const index = headJson(file);
    for (const id of ids) {
      assert(!index.lessons.some(row => row.id === id));
      const directory = `${book}/editions/${edition}/lessons/${id}`;
      const lesson = read(`${directory}/lesson.json`);
      index.lessons.push({ id, number: lesson.number, title: lesson.title, prose_blocks: lesson.prose.length,
        exercises: 0, figures: 0, source_lesson_sha256: lesson.source.sha256,
        source_exercises_sha256: read(`${directory}/exercises.json`).source.sha256 });
    }
    index.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
    projected.push({ path: file, value: index });
  }
  save(`${output}/batch-ready.json`, {
    schema: 'STEMROBIN-181/offline-complete-batch@1', ticket: 'STEMROBIN-181', batch: 'D-041',
    status: 'complete-ready-to-commit-push', parent, cards: ids,
    productBindings: [...new Set(product)].map(bind), retained,
    sourcePagesConsumed: newPages, sourcePagesFinalized: 519 + newPages.length,
    sourceScope: 'Only selected complete prose objects are certified. Retained adjacent page text/glyphs/figures keep explicit HOLDs and native-candidate status.',
    counts: { completeCards: ids.length, originalWrittenQuestions: 0, readonlyStandards: 0,
      choiceResponseUnits: 0, choiceOptions: 0, sharedModernFigures: 0 },
    rawFigureStatus: 'Adjacent source raster crops retained as native candidates only; no RAW/SVG or modern figure certification.',
    imageUsage: { parentCumulative: 24, parentNewOpens: 0, paidCalls: 0 },
    limitations: 'All old holds, failure receipts and costs remain. Raw web articles/HTML stay scratch; concise primary facts are in the bound author receipts.',
    wholeProjectChecks: false, databaseWrites: false, deployment: false, formalHandoff: false,
  });
  const meterPath = `${ticket}/production-meter.json`;
  const workingMeter = read(meterPath);
  assert.equal(workingMeter.sourcePagesFinalized, 519);
  assert.equal(workingMeter.currentCheckpoint.completeDeliveredCards, 122);
  workingMeter.updatedAt = new Date().toISOString();
  workingMeter.sourcePagesFinalized = 519 + newPages.length;
  workingMeter.currentCheckpoint.sourcePagesFinalized = workingMeter.sourcePagesFinalized;
  workingMeter.currentCheckpoint.completeUnbatchedCards = ids;
  workingMeter.currentCheckpoint.nextBatch = { id: 'D042', status: 'continue-after-D041-push', scope: 'D-group physics, next source checkpoint' };
  workingMeter.currentResume1814.D041 = bind(`${output}/batch-ready.json`);
  workingMeter.deliveryBatches.push({ id: 'D-041', cards: ids, status: 'complete-ready-to-commit-push',
    newlyCompletedCards: ids.length, newUnsolvedWrittenTasks: 0, choiceQuestions: 0, choiceOptions: 0,
    readOnlyStandardAnswers: 0, modernFigures: 0, currentSourceCounts: { pages: workingMeter.sourcePagesFinalized },
    evidence: bind(`${output}/batch-ready.json`), elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null });
  workingMeter.countsStaleReason = `${workingMeter.sourcePagesFinalized} consumed source pages;122 pushed complete offline cards plus${ids.length} D041 cards awaiting push. Other aggregates remain stale.`;
  save(meterPath, workingMeter, false);
  const meter = headJson(meterPath);
  for (const field of ['updatedAt', 'sourcePagesFinalized', 'currentCheckpoint', 'currentResume1814', 'deliveryBatches', 'countsStaleReason']) {
    meter[field] = structuredClone(workingMeter[field]);
  }
  projected.push({ path: meterPath, value: meter });
  const indexPath = `${ticket}/evidence/index.json`;
  const workingIndex = read(indexPath), index = headJson(indexPath);
  const reports = [...files(output), previousPush];
  for (const target of [workingIndex, index]) {
    target.updatedAt = workingMeter.updatedAt;
    for (const file of reports) {
      const existing = target.reports.find(row => row.path === file);
      if (existing) assert.equal(existing.sha256, hash(file), file);
      else target.reports.push({ ...bind(file), batch: file === previousPush ? 'D040' : 'D041' });
    }
  }
  save(indexPath, workingIndex, false);
  projected.push({ path: indexPath, value: index });
  const projections = projected.map((row, index) => {
    const file = `${scratch}/d041-projections/${index}.json`;
    save(file, row.value);
    return { path: row.path, file, sha256: hash(file) };
  });
  const full = [...new Set([...product, ...reports])];
  const changed = git(['ls-files', '-m', '-o', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  save(`${scratch}/d041-stage-plan.json`, {
    parent, cards: ids, full: full.map(bind), projections,
    preservation: [...new Set(changed)].filter(file => !full.includes(file) &&
      !projections.some(row => row.path === file)).map(bind),
    workingBookIndexes: projections.filter(row => row.path.startsWith(book)).map(row => bind(row.path)),
    noWorkingBookIndexWrites: true,
  });
  console.log(JSON.stringify({ cards: ids, newPages, sourcePagesFinalized: workingMeter.sourcePagesFinalized,
    selectedFiles: full.length, projectedIndexes: projections.length }));
} else if (process.argv[2] === '--stage') {
  assert.deepEqual(staged(), []);
  const plan = read(`${scratch}/d041-stage-plan.json`);
  for (const row of [...plan.full, ...plan.preservation, ...plan.workingBookIndexes]) {
    assert.equal(hash(row.path), row.sha256, row.path);
  }
  git(['add', '--', ...plan.full.map(row => row.path)]);
  for (const row of plan.projections) {
    assert.equal(hash(row.file), row.sha256);
    const object = git(['hash-object', '-w', '--stdin'], fs.readFileSync(row.file)).trim();
    git(['update-index', '--add', '--cacheinfo', `100644,${object},${row.path}`]);
  }
  assert(staged().every(file => [...plan.full, ...plan.projections].some(row => row.path === file)));
  assert(!staged().some(file => /(^|\/)\.env($|\.)|^app\/|^\.agents\/skills\//.test(file)));
  for (const row of [...plan.full, ...plan.projections]) {
    assert.equal(digest(execFileSync('git', ['show', `:${row.path}`], { maxBuffer: 128 * 1024 * 1024 })), row.sha256);
  }
  for (const row of [...plan.preservation, ...plan.workingBookIndexes]) assert.equal(hash(row.path), row.sha256);
  console.log(JSON.stringify({ staged: staged().length, unownedPreserved: plan.preservation.length,
    workingBookIndexesPreserved: 3 }));
} else throw new Error('Select --prepare or --stage');
