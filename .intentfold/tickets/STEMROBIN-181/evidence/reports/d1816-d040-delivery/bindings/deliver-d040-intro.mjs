import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck');
const require = createRequire(import.meta.url);
const { tocCardIds } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/lesson_order.js'));
const ticket = '.intentfold/tickets/STEMROBIN-181';
const scratch = `${ticket}/tmp/d1814-recovery`;
const base = '.tmp/STEMROBIN-181/d1816';
const book = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const output = `${ticket}/evidence/reports/d1816-d040-delivery`;
const id = 'phy10-c3-s1';
const parent = '6a79c3c6e11ea0e949766a93a70eb9476df5b456';
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
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]);
const retain = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) assert.equal(hash(target), hash(source), target);
  else fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  return { ...bind(target), originalPath: source };
};
const staged = () => git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean);
function gates() {
  assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
  const text = read(`${ticket}/tmp/d1816-intro-text-review/report.json`);
  assert.equal(text.overall, 'PASS');
  assert.equal(text.SCI.verdict, 'PASS');
  assert.equal(text.ZHEN.verdict, 'PASS');
  for (const row of text.binding.files) assert.equal(hash(row.path), row.sha256);
  const source = read(`${scratch}/d040-intro-source-pass.json`);
  assert.equal(source.source, 'PASS-complete-object');
  for (const name of ['phase1', 'observation', 'candidate', 'originalLesson', 'actualRightBoundary']) {
    assert.equal(hash(source[name].path), source[name].sha256);
  }
  const dom = read(`${ticket}/tmp/d1816-intro-display/result.json`);
  assert.equal(dom.status, 'pass');
  assert.equal(dom.records.length, 4);
  for (const row of dom.records) {
    assert.equal(hash(row.screenshot.path), row.screenshot.sha256);
    assert.equal(hash(row.html.path), row.html.sha256);
  }
  const pixels = read(`${ticket}/tmp/d1816-intro-display-review/report.json`);
  assert.equal(pixels.overall, 'PASS');
  assert.equal(pixels.DISPLAY, 'PASS');
  assert.equal(pixels.image_accounting.actual_total_image_opens, 4);
  for (const row of pixels.image_accounting.ledger) assert.equal(hash(row.path), row.current_sha256);
  for (const name of ['d040-zh-intro-title-finalize-recovery', 'd040-en-intro-title-finalize-recovery',
    'd040-section-card-focused-contract-tests', 'd040-section-card-heading-presentation-tests',
    'd040-en-intro-heading-space-render-recovery', 'd040-intro-offline-mathml-read-recovery',
    'd040-precommit-target-check']) assert.equal(read(`${scratch}/native/${name}/receipt.json`).exitCode, 0);
  for (const edition of editions) {
    const dir = `${base}/root/10p/editions/${edition}/lessons/${id}`;
    assert.equal(read(`${dir}/adaptation.audit.json`).status, 'pass');
    assert.equal(read(`${dir}/exercises.json`).count, 0);
    assert.equal(read(`${dir}/figures.json`).figures.length, 0);
  }
}

if (process.argv.includes('--prepare')) {
  gates();
  assert.deepEqual(staged(), []);
  const retained = [], product = [];
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    const target = `${book}/lessons/${id}/${name}`;
    retained.push(retain(`${base}/root/10p/lessons/${id}/${name}`, target));
    product.push(target);
  }
  for (const edition of editions) for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
    const target = `${book}/editions/${edition}/lessons/${id}/${name}`;
    retained.push(retain(`${base}/root/10p/editions/${edition}/lessons/${id}/${name}`, target));
    product.push(target);
  }
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const target = `${book}/pages/0310/${name}`;
    assert.equal(hash(target), hash(`${base}/root/10p/pages/0310/${name}`));
    product.push(target);
  }
  product.push('.claude/skills/ld-s10y-lesson/tools/assemble.py',
    '.claude/skills/ld-s10y-lesson/tools/test_section_cards.py',
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js');
  const groups = ['d1816-intro-text-review', 'd1816-intro-display', 'd1816-intro-display-review',
    'd1816-source302305-review', 'd1816-source306309-review', 'd1816-source310313-review',
    'd1816-raw245246-source309-final-review', 'd1816-n118-text-review'];
  for (const group of groups) for (const file of files(`${ticket}/tmp/${group}`)) {
    retained.push(retain(file, `${output}/${group}/${path.relative(`${ticket}/tmp/${group}`, file)}`));
  }
  for (const file of files(`${base}/figure-author`).filter(file => !file.includes('/inputs/contract/'))) {
    retained.push(retain(file, `${output}/held-figure-author/${path.relative(`${base}/figure-author`, file)}`));
  }
  for (const edition of editions) for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const file = `${base}/author-work/adapt/10p/${edition}/lessons/phy10-c2-s6-n118/${name}`;
    retained.push(retain(file, `${output}/held-n118-current/${edition}/${name}`));
  }
  for (const name of ['source-solutions-before-options.json', 'readonly-answers-bilingual.json', 'choice-authored-bilingual.json']) {
    retained.push(retain(`${base}/${name}`, `${output}/held-n118-unvalidated/${name}`));
  }
  const bindingFiles = fs.readdirSync(scratch).filter(name =>
    /^d040.*\.json$/.test(name) || /^(repair-d040|author-d040|bind-d040|prepare-d040|recover-d040|check-d040|append-d040|deliver-d040).*\.mjs$/.test(name)
    || name === 'render_lesson.before-intro-heading-space.js');
  for (const name of bindingFiles) retained.push(retain(`${scratch}/${name}`, `${output}/bindings/${name}`));
  for (const subdir of ['d040-section-card-first-failure', 'd040-intro-title-first-candidate',
    'd040-n118-first-template', 'd040-n118-silent-film-first-candidate']) {
    for (const file of files(`${scratch}/${subdir}`)) retained.push(retain(file, `${output}/bindings/${subdir}/${path.relative(`${scratch}/${subdir}`, file)}`));
  }
  for (const name of fs.readdirSync(`${scratch}/native`).filter(name => name.startsWith('d040-') && !name.includes('discovery'))) {
    for (const file of files(`${scratch}/native/${name}`)) retained.push(retain(file, `${output}/native/${name}/${path.basename(file)}`));
  }
  const previousPush = `${ticket}/evidence/reports/d1815-d039-delivery/actual-push.json`;
  assert.equal(read(previousPush).commit, parent);
  const sourceIndex = headJson(`${book}/book.json`);
  assert(!sourceIndex.lessons.some(row => row.id === id));
  sourceIndex.lessons.push(read(`${base}/root/10p/book.json`).lessons.find(row => row.id === id));
  const order = new Map(tocCardIds(read('ssot-resources/soviet10year-textbooks/toc/10p/zh.json')).map((card, index) => [card, index]));
  assert(sourceIndex.lessons.every(row => order.has(row.id)));
  sourceIndex.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
  const headPages = git(['ls-tree', '-r', '--name-only', parent, '--', `${book}/pages`]).split('\n').filter(file => /\/page\.json$/.test(file));
  const newPages = headPages.includes(`${book}/pages/0310/page.json`) ? [] : [310];
  sourceIndex.pages = headPages.length + newPages.length;
  const projected = [{ path: `${book}/book.json`, value: sourceIndex }];
  for (const edition of editions) {
    const file = `${book}/editions/${edition}/book.json`;
    const index = headJson(file);
    const dir = `${book}/editions/${edition}/lessons/${id}`;
    const lesson = read(`${dir}/lesson.json`);
    assert(!index.lessons.some(row => row.id === id));
    index.lessons.push({ id, number: lesson.number, title: lesson.title, prose_blocks: 3, exercises: 0, figures: 0,
      source_lesson_sha256: lesson.source.sha256, source_exercises_sha256: read(`${dir}/exercises.json`).source.sha256 });
    index.lessons.sort((a, b) => order.get(a.id) - order.get(b.id));
    projected.push({ path: file, value: index });
  }
  const sourcePagesFinalized = 518 + newPages.length;
  save(`${output}/batch-ready.json`, {
    schema: 'STEMROBIN-181/offline-complete-batch@1', ticket: 'STEMROBIN-181', batch: 'D-040',
    status: 'complete-ready-to-commit-push', parent, cards: [id],
    productBindings: product.map(bind), retained, sourcePagesConsumed: newPages, sourcePagesFinalized,
    counts: { completeCards: 1, originalWrittenQuestions: 0, readonlyStandards: 0, choiceResponseUnits: 0, choiceOptions: 0, sharedModernFigures: 0 },
    sourceScope: 'Only complete introduction p0310#3-5; actual p0311 heading is independent boundary evidence, not following119 approval.',
    toolRepairs: ['TOC-owned unnumbered h2 card assembly with nine focused tests; n118/t9 pre-boundary bytes restored.',
      'English TOC metadata lookup ignores inter-Han presentation spaces; source identity and prose unchanged.'],
    holds: ['n118 modern245 repaired native label-clearance FAIL;246 author-visible wire/label HOLD; no further245 spec repair.',
      't9 SOURCE309-ex7 final typography HOLD; no replay.', 'source304 glyph,302/303 emphasis,119 source312/313 local glyph and incomplete right boundary.',
      'Missing paid181 output remains HOLD with no repurchase.'],
    unvalidatedHeldN118: 'Hand-authored four choice units/18 options and five bilingual standards retained only as candidates; not validated, approved or counted.',
    excludedPrivateDiscovery: 'd040-science-optical-sound-primary-discovery CAPTCHA/IP bytes remain in scratch, not staged.',
    imageUsage: { parentCumulative: 24, parentNewOpens: 0, paidCalls: 0, figureAuthorOpens: 4 },
    wholeProjectChecks: false, databaseWrites: false, deployment: false, formalHandoff: false,
  });
  const meterPath = `${ticket}/production-meter.json`;
  const workingMeter = read(meterPath);
  assert.equal(workingMeter.sourcePagesFinalized, 518);
  assert.equal(workingMeter.currentCheckpoint.completeDeliveredCards, 121);
  workingMeter.updatedAt = new Date().toISOString();
  workingMeter.sourcePagesFinalized = sourcePagesFinalized;
  workingMeter.currentCheckpoint.sourcePagesFinalized = sourcePagesFinalized;
  workingMeter.currentCheckpoint.completeUnbatchedCards = [id];
  workingMeter.currentCheckpoint.nextBatch = { id: 'D041', status: 'continue-after-D040-push', scope: 'D-group physics, source314 onward' };
  workingMeter.currentResume1814.D040 = bind(`${output}/batch-ready.json`);
  workingMeter.deliveryBatches.push({ id: 'D-040', cards: [id], status: 'complete-ready-to-commit-push',
    newlyCompletedCards: 1, newUnsolvedWrittenTasks: 0, choiceQuestions: 0, choiceOptions: 0,
    readOnlyStandardAnswers: 0, modernFigures: 0, currentSourceCounts: { pages: sourcePagesFinalized },
    evidence: bind(`${output}/batch-ready.json`), elapsedSeconds: null, inputTokens: null, outputTokens: null, costUsd: null });
  workingMeter.countsStaleReason = `${sourcePagesFinalized} consumed source pages;121 pushed complete offline cards plus one D040 card awaiting push. Other aggregates remain stale.`;
  save(meterPath, workingMeter, false);
  const meter = headJson(meterPath);
  for (const field of ['updatedAt', 'sourcePagesFinalized', 'currentCheckpoint', 'currentResume1814', 'deliveryBatches', 'countsStaleReason']) meter[field] = structuredClone(workingMeter[field]);
  projected.push({ path: meterPath, value: meter });
  const indexPath = `${ticket}/evidence/index.json`;
  const workingIndex = read(indexPath), index = headJson(indexPath);
  const reports = [...files(output), previousPush];
  for (const target of [workingIndex, index]) {
    target.updatedAt = workingMeter.updatedAt;
    for (const file of reports) {
      const existing = target.reports.find(row => row.path === file);
      if (existing) assert.equal(existing.sha256, hash(file), file);
      else target.reports.push({ ...bind(file), batch: file === previousPush ? 'D039' : 'D040' });
    }
  }
  save(indexPath, workingIndex, false);
  projected.push({ path: indexPath, value: index });
  const projections = projected.map((row, i) => {
    const file = `${scratch}/d040-projections/${i}.json`;
    save(file, row.value);
    return { path: row.path, file, sha256: hash(file) };
  });
  const full = [...new Set([...product, ...reports])];
  const changed = git(['ls-files', '-m', '-o', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  save(`${scratch}/d040-stage-plan.json`, {
    parent, cards: [id], full: full.map(bind), projections,
    preservation: [...new Set(changed)].filter(file => !full.includes(file) && !projections.some(row => row.path === file)).map(bind),
    workingBookIndexes: projections.filter(row => row.path.startsWith(book)).map(row => bind(row.path)),
    noWorkingBookIndexWrites: true,
  });
  console.log(JSON.stringify({ cards: [id], newPages, sourcePagesFinalized, files: full.length, projectedIndexes: projections.length }));
} else if (process.argv.includes('--stage')) {
  assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
  assert.deepEqual(staged(), []);
  const plan = read(`${scratch}/d040-stage-plan.json`);
  for (const row of [...plan.full, ...plan.preservation, ...plan.workingBookIndexes]) assert.equal(hash(row.path), row.sha256, row.path);
  git(['add', '--', ...plan.full.map(row => row.path)]);
  for (const row of plan.projections) {
    assert.equal(hash(row.file), row.sha256);
    const object = git(['hash-object', '-w', '--stdin'], fs.readFileSync(row.file)).trim();
    git(['update-index', '--add', '--cacheinfo', `100644,${object},${row.path}`]);
  }
  assert(staged().every(file => [...plan.full, ...plan.projections].some(row => row.path === file)));
  assert(!staged().some(file => /(^|\/)\.env($|\.)|^app\/|^\.agents\/skills\//.test(file)));
  assert(!staged().some(file => file.includes('optical-sound-primary-discovery')));
  for (const row of [...plan.full, ...plan.projections]) {
    assert.equal(digest(execFileSync('git', ['show', `:${row.path}`], { maxBuffer: 128 * 1024 * 1024 })), row.sha256, row.path);
  }
  for (const row of [...plan.preservation, ...plan.workingBookIndexes]) assert.equal(hash(row.path), row.sha256, row.path);
  console.log(JSON.stringify({ staged: staged().length, unownedPreserved: plan.preservation.length, workingBooksPreserved: 3 }));
} else throw new Error('Select --prepare or --stage');
