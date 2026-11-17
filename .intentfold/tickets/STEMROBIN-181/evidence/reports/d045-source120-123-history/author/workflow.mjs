import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
export const owned = path.dirname(fileURLToPath(import.meta.url));
export const pages = [120, 121, 122, 123];
const prior = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-source116-119-author');
const priorHash = '206513d669026a7a730ba867403c93effe61dc3cd71b2b1551d2cc8f29d56c08';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const binding = async filename => ({ path: filename, sha256: digest(await readFile(filename)) });
export const exists = async filename => {
  try { await access(filename); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
};
export const immutable = async (filename, bytes) => {
  assert.ok(filename.startsWith(`${owned}/`));
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, bytes, { flag: 'wx' });
};
export const nativeCommand = (action, page) => [
  path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
  path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py'), action,
  '--book', '10p', '--page', String(page), '--root', path.join(owned, 'source'),
  '--work', path.join(owned, 'work'),
];
export const runNative = async (command, receipt) => {
  assert.equal(await exists(receipt), false, 'Do not repeat a recorded command.');
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutable(receipt, `${JSON.stringify({
    command, cwd: root, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  }, null, 2)}\n`);
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  return result;
};

const [action, pageArg] = process.argv.slice(2);
if (action === 'reuse') {
  const priorFreeze = await binding(path.join(prior, 'author-freeze.json'));
  assert.equal(priorFreeze.sha256, priorHash);
  const preceding = await binding(path.join(prior, 'source/10p/pages/0119/page.md'));
  const previous = JSON.parse(await readFile(priorFreeze.path));
  assert.equal(previous.pages.at(-1).native.find(item => item.path === preceding.path).sha256, preceding.sha256);
  const sourcePdf = previous.sourcePdf;
  assert.equal((await binding(sourcePdf.path)).sha256, sourcePdf.sha256);
  await immutable(path.join(owned, 'inputs/preceding-page119.md'), await readFile(preceding.path));
  const prepared = [];
  for (const page of pages) {
    const stem = String(page).padStart(4, '0');
    const inputs = [];
    for (const name of ['page.png', 'page.grid.png', 'page.template.md', 'layout.json']) {
      const filename = path.join(root, '.tmp/ld-s10y-lesson/10p/pages', stem, name);
      const bytes = await readFile(filename);
      const copy = path.join(owned, 'work/10p/pages', stem, name);
      await immutable(copy, bytes);
      inputs.push({ ...await binding(filename), copy: await binding(copy) });
    }
    const template = await readFile(inputs.find(item => item.path.endsWith('/page.template.md')).path, 'utf8');
    const meta = JSON.parse(template.split('---')[1]);
    assert.equal(meta.page, page);
    assert.equal(meta.render.sha256, inputs.find(item => item.path.endsWith('/page.png')).sha256);
    assert.equal(meta.source.pdf_sha256, sourcePdf.sha256);
    prepared.push({ physicalPage: page, inputs });
  }
  await immutable(path.join(owned, 'inputs/prepared.json'), `${JSON.stringify({
    schema: 'ld-s10y-lesson/prepared-input-reuse@1', physicalPages: pages, pages: prepared,
    sourcePdf, precedingPage: preceding, precedingFreeze: priorFreeze,
    precedingIndependentReview: 'pending', inheritedSourcePass: false,
    parentPrepareExitCode: 0, parentPrepareExitCodeBasis: 'Explicit human task input; not independently rerun.',
    prepareCommandsRun: 0, exactPreparedInputsCopied: 16,
    parentImageOpens: 0, precedingPageImageOpens: 0, canonicalWrites: 0,
    command: process.argv,
  }, null, 2)}\n`);
  console.log('Reused 16 exact prepared inputs and preceding text only; no prepare rerun.');
} else if (action === 'finalize' || action === 'repair-finalize') {
  const page = Number(pageArg);
  assert.ok(pages.includes(page));
  const stem = String(page).padStart(4, '0');
  const pageDir = path.join(owned, 'source/10p/pages', stem);
  const stage = action === 'finalize' ? 'initial' : 'repair';
  if (stage === 'repair') {
    for (const entry of await readdir(path.join(owned, 'commands'))) {
      assert.ok(!/^finalize-\d+-repair\.json$/.test(entry), 'At most one targeted repair in this batch.');
    }
    const first = JSON.parse(await readFile(path.join(owned, 'commands', `finalize-${page}-initial.json`)));
    if (first.exitCode === 0) {
      const cropFailure = JSON.parse(await readFile(path.join(owned, 'commands', `crop-${page}-initial-fail.json`)));
      assert.equal(cropFailure.status, 'FAIL');
      assert.equal(cropFailure.independentReview, false);
      for (const input of cropFailure.bindings) assert.equal((await binding(input.path)).sha256, input.sha256);
    }
  }
  await immutable(path.join(owned, stage, stem, 'page.authored.md'), await readFile(path.join(pageDir, 'page.md')));
  const result = await runNative(nativeCommand('finalize', page),
    path.join(owned, 'commands', `finalize-${page}-${stage}.json`));
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    if (await exists(path.join(pageDir, name))) {
      await immutable(path.join(owned, stage, stem, name), await readFile(path.join(pageDir, name)));
    }
  }
  if (await exists(path.join(pageDir, 'audit.json'))) {
    const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
    for (const figure of audit.figures) {
      const crop = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.png`);
      await immutable(path.join(owned, stage, stem, 'figures', `${figure.id}.png`), await readFile(crop));
    }
  }
  process.exitCode = result.status ?? 1;
} else if (action === 'vectorize') {
  const page = Number(pageArg);
  assert.ok(pages.includes(page));
  const stem = String(page).padStart(4, '0');
  const audit = JSON.parse(await readFile(path.join(owned, 'source/10p/pages', stem, 'audit.json')));
  assert.deepEqual(audit.errors, [], 'Do not vectorize a failed page.');
  for (const figure of audit.figures) {
    assert.equal(await exists(path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.svg`)), false);
  }
  const result = await runNative(nativeCommand('vectorize', page),
    path.join(owned, 'commands', `vectorize-${page}-initial.json`));
  for (const figure of audit.figures) {
    const filename = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.svg`);
    if (await exists(filename)) {
      await immutable(path.join(owned, 'vectorized', stem, 'figures', `${figure.id}.svg`), await readFile(filename));
    }
  }
  process.exitCode = result.status ?? 1;
} else if (action === 'freeze') {
  const observationsPath = path.join(owned, 'observations.json');
  const observations = JSON.parse(await readFile(observationsPath));
  assert.ok(observations.imageOpens.length <= 8);
  assert.ok(observations.authoredRepairs <= 1);
  assert.deepEqual(observations.physicalPages, pages);
  assert.equal(observations.sourceApproval, false);
  assert.equal(observations.independentReview, 'pending');
  for (const open of observations.imageOpens) Object.assign(open, await binding(path.join(owned, open.relativePath)));
  const prepared = path.join(owned, 'inputs/prepared.json');
  const preparation = JSON.parse(await readFile(prepared));
  for (const item of preparation.pages) {
    for (const input of item.inputs) {
      assert.equal((await binding(input.path)).sha256, input.sha256);
      assert.equal((await binding(input.copy.path)).sha256, input.copy.sha256);
    }
  }
  assert.equal((await binding(preparation.precedingFreeze.path)).sha256, priorHash);
  assert.equal((await binding(preparation.precedingPage.path)).sha256, preparation.precedingPage.sha256);
  const sourcePdf = preparation.sourcePdf;
  assert.equal((await binding(sourcePdf.path)).sha256, sourcePdf.sha256, 'Source PDF must remain unchanged.');
  const frozenPages = [];
  for (const page of pages) {
    const stem = String(page).padStart(4, '0');
    const pageDir = path.join(owned, 'source/10p/pages', stem);
    const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
    const parsed = JSON.parse(await readFile(path.join(pageDir, 'page.json')));
    assert.equal(audit.lines_printed, observations.expectedPrintedAndNativeCountsFromSourceObservation.linesByPhysicalPage[page]);
    assert.equal(audit.lines_md, audit.lines_printed);
    const observed = observations.pages.find(item => item.physicalPage === page);
    assert.equal(parsed.meta.printed_page, observed.printedPage);
    const blockAt = ref => {
      const [stemRef, number] = ref.split('#');
      assert.equal(stemRef, `p${stem}`);
      const block = parsed.blocks[Number(number) - 1];
      assert.ok(block, ref);
      return block;
    };
    if (observed.entry.cont) assert.equal(blockAt(observed.entry.block).cont, true);
    if (observed.exit.open) assert.equal(blockAt(observed.exit.block).open, true);
    for (const boundary of [observed.cardBoundary, ...(observed.cardBoundaries ?? [])].filter(Boolean)) {
      const block = blockAt(boundary.headingBlock);
      assert.equal(block.kind, 'h3');
      assert.equal(block.lines.join(''), boundary.literalHeading);
      assert.equal(blockAt(boundary.afterBlock).open, false);
    }
    if (observed.internalContinuation) {
      assert.equal(blockAt(observed.internalContinuation.openBlock).open, true);
      assert.equal(blockAt(observed.internalContinuation.contBlock).cont, true);
      assert.equal(blockAt(observed.internalContinuation.captionBlock).samerow, true);
    }
    const newExercises = parsed.blocks.filter(block => block.kind === 'ex' && !block.cont).map(block => block.label);
    assert.deepEqual(newExercises, observed.newExercises);
    const native = [];
    for (const name of ['page.md', 'page.json', 'audit.json']) native.push(await binding(path.join(pageDir, name)));
    const crops = [];
    for (const figure of audit.figures) {
      const filename = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.png`);
      const bytes = await readFile(filename);
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      const [x, y, width, height] = figure.box;
      const padding = figure.crop_padding_px ?? 12;
      const svg = filename.replace(/\.png$/, '.svg');
      crops.push({
        ...figure, ...await binding(filename), paddingPx: padding,
        exactPixelRect: [x - padding, y - padding, width + 2 * padding, height + 2 * padding],
        dimensions: [bytes.readUInt32BE(16), bytes.readUInt32BE(20)],
        source: await binding(path.join(owned, 'work/10p/pages', stem, 'page.png')),
        svg: await exists(svg) ? await binding(svg) : null,
        independentReview: 'pending',
      });
      assert.deepEqual(crops.at(-1).dimensions, [width + 2 * padding, height + 2 * padding]);
    }
    const firstPath = path.join(owned, 'commands', `finalize-${page}-initial.json`);
    const first = JSON.parse(await readFile(firstPath));
    const repairPath = path.join(owned, 'commands', `finalize-${page}-repair.json`);
    const vectorPath = path.join(owned, 'commands', `vectorize-${page}-initial.json`);
    const vector = await exists(vectorPath) ? JSON.parse(await readFile(vectorPath)) : null;
    frozenPages.push({
      physicalPage: page, printedPage: parsed.meta.printed_page,
      linesPrinted: audit.lines_printed, linesMd: audit.lines_md, blocks: parsed.blocks.length,
      native, crops, errors: audit.errors, sourceApproval: false,
      initialCommand: await binding(firstPath), initialExitCode: first.exitCode,
      repairCommand: await exists(repairPath) ? await binding(repairPath) : null,
      vectorizeCommand: vector ? await binding(vectorPath) : null,
      vectorizeExitCode: vector?.exitCode ?? null,
      newExercises,
      independentReview: 'pending', observations: observed,
    });
  }
  const toolBindings = [];
  for (const filename of [
    'AGENTS.md', '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/layout.py', '.claude/skills/ld-s10y-lesson/tools/normalize.py',
    '.claude/skills/ld-s10y-lesson/tools/mathcheck.py', '.claude/skills/ld-s10y-lesson/tools/vectorize.py',
    '.claude/skills/ld-s10y-lesson/tools/svg_raster.js', '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
    'ssot-resources/soviet10year-textbooks/sources/manifest.json',
    'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  ]) toolBindings.push(await binding(path.join(root, filename)));
  const inventory = [];
  async function walk(directory) {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else inventory.push(await binding(filename));
    }
  }
  await walk(owned);
  const filename = path.join(owned, 'author-freeze.json');
  await immutable(filename, `${JSON.stringify({
    schema: 'ld-s10y-lesson/source-author-freeze@1', ticket: 'STEMROBIN-181',
    book: '10p', physicalPages: pages, owned,
    preparation: await binding(prepared), sourcePdf, sourcePdfUnchanged: true,
    precedingFreeze: preparation.precedingFreeze, precedingIndependentReview: 'pending', inheritedSourcePass: false,
    workflowPatternReferences: [
      await binding(path.join(prior, 'workflow.mjs')),
      await binding(path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d042-10p-source112-115-author/workflow.mjs')),
    ],
    pages: frozenPages, observations: await binding(observationsPath),
    freezeCommand: process.argv, toolBindings,
    actualCounts: {
      nativeFiles: frozenPages.reduce((sum, page) => sum + page.native.length, 0),
      blocks: frozenPages.reduce((sum, page) => sum + page.blocks, 0),
      linesPrinted: frozenPages.reduce((sum, page) => sum + page.linesPrinted, 0),
      linesMd: frozenPages.reduce((sum, page) => sum + page.linesMd, 0),
      crops: frozenPages.reduce((sum, page) => sum + page.crops.length, 0),
      vectorizedFigures: frozenPages.reduce((sum, page) => sum + page.crops.filter(crop => crop.svg).length, 0),
      newExercises: frozenPages.reduce((sum, page) => sum + page.newExercises.length, 0),
      initialFinalizeCommands: frozenPages.length,
      initialFailures: frozenPages.filter(page => page.initialExitCode !== 0).length,
      initialAuthorCropFailures: observations.initialAuthorCropFailures,
      authoredRepairs: observations.authoredRepairs,
    },
    sourceApproval: false, independentReview: 'pending',
    countsAreMechanicalEvidenceNotSourceApproval: true,
    imageOpens: observations.imageOpens, totalImageOpens: observations.imageOpens.length,
    contextImageOpens: observations.imageOpens.length, contextImageLimit: 24, batchImageLimit: 8,
    parentImageOpens: 0, precedingPageImageOpens: 0,
    sectionClosureObservations: observations.sectionClosure,
    nonexclusiveFigureReferences: observations.nonexclusiveFigureReferences,
    sourceRawUncertainties: observations.sourceRawUncertainties,
    canonicalWrites: 0, vectorization: true, assembly: false, promotion: false, inventory,
  }, null, 2)}\n`);
  console.log(JSON.stringify(await binding(filename), null, 2));
} else if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  throw new Error(`Unknown action: ${action}`);
}
