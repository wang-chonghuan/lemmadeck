import fs from 'node:fs';
import assert from 'node:assert/strict';
import { repo, ticket, bind, read, save, run } from './n42-native.mjs';

const configurations = {
  'phy9-c2-s2-n64': { task: 'D1013', batch: 'D018', objects: 42, figures: 2,
    out: 'd1816-d1013-n64-first-missing-en', sourceBinding: 'source',
    native: 'evidence/author-history/d018/reports/d018-n64-native-finalization.json',
    science: 'evidence/author-history/d018/reports/9p-n64-science-review.json',
    freeze: 'evidence/author-history/d018/reports/9p-n64-prose-freeze.json',
    figureGate: 'evidence/reports/9p-n64-figure-review.json', groupedSourcePages: false },
  'phy9-c2-s2-n81': { task: 'D1025', batch: 'D020', objects: 17, figures: 1,
    out: 'd1816-d1025-n81-first-missing-en', sourceBinding: 'sourceLesson',
    native: 'evidence/author-history/d020/raw/5a0f7c8cf9a8-a0f4f6ee1aa786e5-d020-n81-native-finalization.json',
    science: 'evidence/author-history/d020/raw/54c597016936-30d6939957c5cc0e-9p-n81-science-review.json',
    freeze: 'evidence/author-history/d020/raw/19b527c13169-f26a5028cf8d01b3-9p-n81-prose-freeze.json',
    figureGate: 'evidence/author-history/d020/raw/4a1d31d13990-cfed85a116b1734b-9p-n81-figure-review.json',
    groupedSourcePages: true },
  'phy9-c2-s3-n89': { task: 'D1034', batch: 'D022', objects: 4, figures: 0,
    out: 'd1816-d1034-n89-first-missing-en', sourceBinding: 'sourceLesson',
    native: 'evidence/reports/d022-n89-native-finalization.json',
    science: 'evidence/reports/9p-n89-science-review.json',
    freeze: 'evidence/reports/9p-n89-prose-freeze.json',
    figureGate: 'evidence/reports/9p-n89-figure-review.json',
    freezeBinding: 'freeze', relevantInputPages: true },
  'phy9-c2-s4-n105': { task: 'D1041', batch: 'D025', objects: 9, figures: 0,
    out: 'd1816-d1041-n105-first-missing-en', sourceBinding: 'source',
    native: 'evidence/reports/d025-105-native-result.json',
    science: 'evidence/reports/9p-n105-science-effective-review.json',
    freeze: 'evidence/reports/9p-n105-prose-freeze.json',
    figureGate: 'evidence/reports/9p-n105-figure-effective-review.json',
    nativeStatus: 'pass-native-display-pending', figureGateBinding: 'gate',
    ownedInvolvedPages: true },
};
const card = process.argv[2] || 'phy9-c2-s2-n64', config = configurations[card];
assert(config);
const artifacts = `${repo}/ssot-resources/soviet10year-textbooks/artifacts`;
const book = `${artifacts}/9p`;
const nativeFile = `${ticket}/${config.native}`;
const scienceFile = `${ticket}/${config.science}`;
const freezeFile = `${ticket}/${config.freeze}`;
const figureGateFile = `${ticket}/${config.figureGate}`;
const native = read(nativeFile), science = read(scienceFile);
assert.equal(native.status, config.nativeStatus || 'pass');
for (const file of [scienceFile, figureGateFile]) assert.equal(read(file).status, 'pass');
assert.equal(bind(scienceFile).sha256, native.science.sha256);
assert.equal(bind(figureGateFile).sha256, native[config.figureGateBinding || 'figureGate'].sha256);
assert.equal(bind(freezeFile).sha256, science.bindings[config.freezeBinding || 'authorFreeze'].sha256);
const products = native.outputs.map(original => {
  const current = bind(`${repo}/${original.path}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const source = bind(`${book}/lessons/${card}/lesson.json`), raw = read(source.path);
assert.equal(source.sha256, science.bindings[config.sourceBinding].sha256);
assert.equal(raw.exercise_count, 0);
assert.equal(raw.figures.length, config.figures);
assert.equal(raw.prose.length, config.objects);
const approvedZh = products.find(product => product.path.endsWith('/lesson.json'));
assert.deepEqual(read(approvedZh.path).source.data, raw);
const freeze = read(freezeFile), frozenPages = freeze.sourcePages;
const ownedPages = new Set(raw.prose.flatMap(block => block.source_refs || [])
  .map(reference => /^p(\d+)#/.exec(reference)?.[1]).filter(Boolean));
const pageBindings = config.ownedInvolvedPages
  ? freeze.involvedSourcePages.filter(input => {
    const page = /\/pages\/(\d+)\/page\.(?:json|md)$/.exec(input.path)?.[1];
    return page && ownedPages.has(page);
  }) : config.relevantInputPages
  ? freeze.relevantInputs.map(input => input.original).filter(input =>
    input.path.includes('/ssot-resources/soviet10year-textbooks/artifacts/9p/pages/'))
  : config.groupedSourcePages
    ? Object.values(frozenPages).flatMap(page => [page.pageJson, page.pageMarkdown]) : frozenPages;
assert(pageBindings.length > 0);
const pages = pageBindings.map(original => {
  const current = bind(`${repo}/${original.path.replace(/^.*\/lemmadeck\//, '')}`);
  assert.equal(current.sha256, original.sha256);
  return current;
});
const sourceEdition = `${book}/editions/modern-us-neutral`;
const figures = read(`${sourceEdition}/lessons/${card}/figures.json`).figures.map(figure => {
  const files = Object.fromEntries(['spec', 'svg', 'render', 'review']
    .map(key => [key, bind(`${sourceEdition}/${figure[key]}`)]));
  assert.equal(read(files.review.path).status, 'pass');
  return { id: figure.id, files, existingReviewStatus: 'pass',
    sourceFigureGate: bind(figureGateFile), inventoryOnly: true,
    newEnglishTupleOrFigureApprovalCreated: false };
});
assert(!fs.existsSync(`${book}/editions/modern-us-neutral-en/lessons/${card}`));
assert(!read(`${book}/editions/modern-us-neutral-en/book.json`).lessons.some(row => row.id === card));
const work = `${repo}/.tmp/STEMROBIN-181/d1816-${config.task.toLowerCase()}/work`;
const receipt = run(`${config.task.toLowerCase()}-${card.split('-').at(-1)}-first-missing-en-prepare`, [
  `${repo}/.claude/skills/ld-s10y-lesson/.venv/bin/python`, '-B',
  `${repo}/.claude/skills/ld-s10y-lesson/tools/p2c.py`, 'adapt-prepare',
  '--book', '9p', '--edition', 'modern-us-neutral-en', '--lesson', card,
  '--root', artifacts, '--work', work,
]);
save(`${ticket}/tmp/${config.out}/prepared.json`, {
  task: config.task, card, work, firstEnglishPrepare: receipt,
  completeChineseHistoricalNative: bind(nativeFile), historicalZhScience: bind(scienceFile),
  historicalZhAuthorFreeze: bind(freezeFile), historicalFigureGate: bind(figureGateFile),
  approvedZh, source, sourcePages: pages, originalObjects: config.objects,
  productsReusedExactly: products, originalTasks: 0, originalFigures: config.figures,
  existingFigureTupleInventory: figures, newEnglishTuplesStillPending: true,
  originalSourceZhAndFigurePassReplayed: false, alreadyDeliveredAndCountedInHistoricalBatch: config.batch,
  englishCanonicalAndIndexAbsent: true, retainedEnglishRestorationNotAssumed: true,
  englishAuthorAndIndependentReview: 'pending', parentNewImages: 0,
  paidCalls: 0, databaseWrites: 0, newCompleteCourses: 0, newSourcePages: 0,
});
console.log(JSON.stringify({ prepared: bind(`${ticket}/tmp/${config.out}/prepared.json`),
  originalObjects: config.objects, originalFigures: config.figures, newCompleteCourses: 0, newSourcePages: 0 }));
