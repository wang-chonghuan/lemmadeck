import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  root, ticket, evidence, indexPath, book, inputsPath, retentionManifest,
  completeCards, blockedCards, absolute, relative, read, exists,
  bind, verify, immutableWrite,
} from './retain-d018-evidence.mjs';
import { records } from './retain-d016-evidence.mjs';

// Main authorizes this only after retention, rebind and complete-d018.
// It writes one scratch request for stage-d018.mjs; it never stages files.
const output = `${ticket}/tmp/d018-staging-request.json`;
const finalizationPath = `${evidence}/reports/d018-finalization-binding.json`;
const reboundPath = `${evidence}/reports/d018-durable-path-binding.json`;
const meterPath = `${ticket}/production-meter.json`;
const stageHelper = `${ticket}/tmp/stage-d018.mjs`;
const modern = `${book}/editions/modern-us-neutral`;
const sourceStart = 156;
const sourcePrefix = 166;
const approvedFigures = ['fig-108', 'fig-109'];
const tools = [
  'htmlfrag.js', 'publish.mjs', 'render_lesson.js', 'vector_font.test.cjs',
].map(name => `.claude/skills/ld-s10y-lesson/tools/${name}`);
const sourceCards = [...new Set([...completeCards, ...blockedCards, 'phy9-c2-s2-n66'])];
const indices = [
  `${book}/book.json`, `${book}/answers.json`, `${book}/answers.audit.json`,
  `${modern}/book.json`,
];
const exactSet = (actual, expected, label) => {
  assert.equal(new Set(actual).size, actual.length, `Duplicate ${label}`);
  assert.deepEqual([...actual].sort(), [...expected].sort(), label);
};
const git = args => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
});
const nullPaths = value => value.split('\0').filter(Boolean);
const changedPaths = () => [...new Set([
  ...nullPaths(git(['diff', '--name-only', '--no-renames', '-z', 'HEAD', '--'])),
  ...nullPaths(git(['ls-files', '--others', '--exclude-standard', '-z', '--'])),
])].sort();

async function main() {
  assert.deepEqual(process.argv.slice(2), ['--execute'],
    'Prepared only: Main must authorize --execute after retention/rebind/complete-d018.');
  assert.ok(!(await exists(output)), 'Never overwrite or repeat an existing staging request.');
  assert.ok(await exists(finalizationPath),
    'Wait for the actual durable finalization binding; a scratch-only binding is insufficient.');
  const prerequisitePaths = [
    inputsPath, retentionManifest, reboundPath, finalizationPath, meterPath, indexPath, stageHelper,
  ];
  const frozenPrerequisites = await Promise.all(prerequisitePaths.map(bind));
  const [input, retained, rebound, finalized, meter, index] = await Promise.all(
    prerequisitePaths.slice(0, -1).map(read));
  assert.equal(input.batch, 'D018');
  assert.equal(input.final, true);
  assert.equal(input.sourcePrefix, sourcePrefix);
  exactSet(input.completeCards.map(card => card.id), completeCards, 'final input cards');
  exactSet(retained.scope, completeCards, 'retained cards');
  assert.equal(retained.sourceScope.integratedThrough, sourcePrefix);
  assert.equal(retained.sourceScope.page167ProductOrApproval, false);
  await verify(retained.finalInputs.path, retained.finalInputs.sha256);
  assert.equal(relative(retained.finalInputs.path), inputsPath);
  assert.equal(rebound.status, 'exact-path-bindings-rebound-no-new-approval');
  exactSet(rebound.scope, completeCards, 'rebound cards');
  assert.equal(finalized.status, 'pass');
  assert.equal(finalized.sourcePrefix, sourcePrefix);
  exactSet(finalized.cards.map(card => card.card), completeCards, 'finalized cards');
  assert.equal(relative(finalized.retained.path), retentionManifest);
  assert.equal(relative(finalized.rebound.path), reboundPath);
  await verify(finalized.retained.path, finalized.retained.sha256);
  await verify(finalized.rebound.path, finalized.rebound.sha256);
  const batch = meter.deliveryBatches.find(item => item.id === 'D-018');
  assert.equal(batch?.status, 'complete-pending-commit');
  assert.deepEqual(batch.cards, completeCards);
  exactSet(input.figures.map(figure => figure.id), approvedFigures, 'approved modern figures');
  exactSet(retained.figures, approvedFigures, 'retained modern figures');
  assert.ok(Array.isArray(retained.sourcePages));
  const pages = retained.sourcePages.map(page => page.page);
  exactSet(pages, Array.from({ length: sourcePrefix - sourceStart + 1 },
    (_, index) => sourceStart + index), 'retained source prefix');
  const sourceFigures = [...new Set(retained.sourcePages.flatMap(page => page.sourceFigures))].sort();
  assert.ok(sourceFigures.every(id => typeof id === 'string' && /^[a-z0-9-]+$/.test(id)));
  assert.ok(!sourceFigures.some(id => ['fig-101', 'fig-102'].includes(id)),
    'The retained source prefix must not include unrelated t4 figures.');
  const sourceGallery = new Set(sourceFigures.flatMap(id =>
    ['png', 'svg'].map(extension => `${book}/figures/${id}.${extension}`)));

  // D018 archival evidence includes its documented blocked/history records.
  // That membership never widens the active source or modern-product scope.
  const evidencePaths = new Set([indexPath, retentionManifest, reboundPath, finalizationPath]);
  for (const record of records(index)) {
    if (!['D-018', 'D018'].includes(record.batch)) continue;
    const file = relative(record.path);
    assert.ok(file.startsWith(`${evidence}/`), `Non-evidence D018 index record: ${file}`);
    evidencePaths.add(file);
  }
  assert.ok(Array.isArray(batch.evidence));
  for (const entry of batch.evidence) {
    assert.ok(typeof entry === 'string' && entry.startsWith('evidence/'));
    const file = relative(`${ticket}/${entry}`);
    assert.ok(file.startsWith(`${evidence}/`), `Escaping completion evidence path: ${entry}`);
    evidencePaths.add(file);
  }
  const categoryFor = file => {
    if (file !== relative(file) || /(^|\/)\.env(?:\.|\/|$)/.test(file)) return null;
    if (file.startsWith('.tmp/') || file.includes('/tmp/')) return null;
    if (/(^|[/-])10p(?:[./-]|$)/.test(file) ||
      /(?:phy9-c1-s7-t4|9p-t4)(?:\/|[-.])/.test(file)) return null;
    if (evidencePaths.has(file)) return 'evidence';
    if (file === meterPath) return 'meter';
    if (tools.includes(file)) return 'lessonTools';
    if (indices.includes(file)) return 'bookAndAnswerIndices';
    if (sourceCards.some(card => file.startsWith(`${book}/lessons/${card}/`))) return 'sourceLessons';
    if (completeCards.some(card => file.startsWith(`${modern}/lessons/${card}/`))) return 'modernLessons';
    if (sourceGallery.has(file)) return 'sourceGallery';
    const page = file.startsWith(`${book}/pages/`)
      ? file.slice(`${book}/pages/`.length).match(/^(\d{4})\//) : null;
    if (page && pages.includes(Number(page[1]))) return 'sourcePages';
    const figure = file.startsWith(`${modern}/figures/`)
      ? file.slice(`${modern}/figures/`.length).match(/^([a-z0-9-]+)\./) : null;
    if (figure && approvedFigures.includes(figure[1])) return 'approvedModernFigures';
    return null;
  };

  const branch = git(['branch', '--show-current']).trim();
  assert.equal(branch, 'codex/STEMROBIN-181-textbooks');
  const parent = git(['rev-parse', 'HEAD']).trim();
  assert.equal(git(['diff', '--cached', '--name-only', '-z']), '',
    'Preserve pre-existing staged work; Main must resolve it before producing this request.');
  const dirty = changedPaths();
  const selected = dirty.filter(file => categoryFor(file));
  assert.ok(selected.length, 'No actually changed allowed D018 files; do not create an empty request.');
  assert.ok(selected.includes(finalizationPath),
    'The new durable D018 finalization binding must be an actually changed staging candidate.');
  const files = [];
  const counts = {};
  for (const file of selected) {
    const stat = await fs.lstat(absolute(file));
    assert.ok(stat.isFile(),
      `The existing stage helper needs an existing regular file: ${file}; do not guess deletion/symlink bindings.`);
    files.push(await bind(file));
    const category = categoryFor(file);
    counts[category] = (counts[category] ?? 0) + 1;
  }
  const finalization = frozenPrerequisites.find(item => item.path === finalizationPath);
  const request = {
    batch: 'D018',
    final: true,
    sourcePrefix,
    finalization,
    files,
    scope: {
      sourceCards, provisionalSourceCard: 'phy9-c2-s2-n66',
      modernCards: [...completeCards], sourcePages: [...pages].sort((a, b) => a - b),
      sourceGalleryFigureIds: sourceFigures, modernFigureIds: [...approvedFigures],
      lessonTools: [...tools], bookAndAnswerIndices: [...indices],
      evidenceSelection: 'Existing D018-tagged index records and explicit completion-meter evidence paths',
      excludedProducts: ['All10p', 'Modern60/62/65', 't4 and figures101/102', 'Source167+',
        'App', 'Charter', 'Environment files', 'Scratch'],
    },
    preparation: {
      status: 'explicit-staging-request-only-not-staged',
      prerequisites: frozenPrerequisites,
      branch, parent,
      changedAllowedFiles: files.length,
      categoryCounts: counts,
      otherChangedFilesLeftUntouched: dirty.length - selected.length,
      noUnchangedPathsIncluded: true,
      existingGitIndexLeftUntouched: true,
      sourceScienceFigurePixelNativeOrAuditGateRepeated: false,
      retentionRebindCompletionStageCommitPushOrBrowserInvoked: false,
    },
  };
  assert.equal(git(['branch', '--show-current']).trim(), branch);
  assert.equal(git(['rev-parse', 'HEAD']).trim(), parent);
  assert.equal(git(['diff', '--cached', '--name-only', '-z']), '');
  assert.deepEqual(changedPaths().filter(file => categoryFor(file)), selected,
    'Allowed changes moved during request generation; preserve everything and retry only after coordination.');
  for (const binding of [...frozenPrerequisites, ...files]) {
    await verify(binding.path, binding.sha256);
  }
  await immutableWrite(output, `${JSON.stringify(request, null, 2)}\n`);
  console.log(`D018 scratch staging request prepared: ${output}; ${files.length} changed allowed files. Nothing staged.`);
}

if (process.argv[1] && absolute(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
