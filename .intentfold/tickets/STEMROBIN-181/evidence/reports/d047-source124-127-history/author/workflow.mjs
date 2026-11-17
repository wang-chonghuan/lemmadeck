import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
export const owned = path.dirname(fileURLToPath(import.meta.url));
export const pages = [124, 125, 126, 127];
const pattern = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d044-10p-source120-123-author/workflow.mjs');
const preparedHash = '9377db4460fec528111df671252dbd45fde03ccfff35c16dcb34d8bb13f29ebb';
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
const absoluteBinding = input => ({ ...input, path: path.resolve(root, input.path) });
async function verifyInputs() {
  const prepared = path.join(owned, 'inputs/prepared.json');
  assert.equal((await binding(prepared)).sha256, preparedHash);
  const preparation = JSON.parse(await readFile(prepared));
  assert.deepEqual(preparation.physicalPages, pages);
  for (const input of [
    ...preparation.pages.flatMap(page => [page.receipt, ...page.inputs]),
    preparation.sourcePdf, preparation.precedingPage,
  ]) {
    const filename = path.resolve(root, input.path);
    assert.equal((await binding(filename)).sha256, input.sha256, filename);
  }
  const preceding = JSON.parse(await readFile(path.join(owned, 'inputs/preceding-page123.json')));
  assert.equal(preceding.meta.page, 123);
  assert.equal(preceding.blocks.at(-4).open, true);
  return preparation;
}
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
if (action === 'verify-inputs') {
  await verifyInputs();
  console.log('Prepared input SHA and provenance verified; zero prepare commands in this author run.');
} else if (action === 'finalize' || action === 'repair-finalize') {
  await verifyInputs();
  const page = Number(pageArg);
  assert.ok(pages.includes(page));
  const stem = String(page).padStart(4, '0');
  const pageDir = path.join(owned, 'source/10p/pages', stem);
  const stage = action === 'finalize' ? 'initial' : 'repair';
  if (stage === 'repair') {
    const defect = JSON.parse(await readFile(path.join(owned, 'commands', `defect-${page}.json`)));
    assert.equal(defect.status, 'FAIL');
    assert.equal(defect.affectedPage, page);
    assert.ok(defect.actualDefect);
    for (const input of defect.bindings) assert.equal((await binding(input.path)).sha256, input.sha256);
  }
  await immutable(path.join(owned, 'history', stage, stem, 'page.authored.md'), await readFile(path.join(pageDir, 'page.md')));
  const result = await runNative(nativeCommand('finalize', page),
    path.join(owned, 'commands', `finalize-${page}-${stage}.json`));
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    if (await exists(path.join(pageDir, name))) {
      await immutable(path.join(owned, 'history', stage, stem, name), await readFile(path.join(pageDir, name)));
    }
  }
  if (await exists(path.join(pageDir, 'audit.json'))) {
    const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
    for (const figure of audit.figures) {
      const crop = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.png`);
      if (await exists(crop)) {
        await immutable(path.join(owned, 'history', stage, stem, 'figures', `${figure.id}.png`), await readFile(crop));
      }
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
      await immutable(path.join(owned, 'history/vectorized', stem, 'figures', `${figure.id}.svg`), await readFile(filename));
    }
  }
  process.exitCode = result.status ?? 1;
} else if (action === 'freeze') {
  const preparation = await verifyInputs();
  const observationsPath = path.join(owned, 'observations.json');
  const observations = JSON.parse(await readFile(observationsPath));
  assert.ok(observations.imageOpens.length <= 8);
  assert.deepEqual(observations.physicalPages, pages);
  assert.equal(observations.sourceApproval, false);
  assert.equal(observations.independentReview, 'pending');
  for (const open of observations.imageOpens) {
    Object.assign(open, await binding(path.join(owned, open.relativePath)));
  }
  const frozenPages = [];
  for (const page of pages) {
    const stem = String(page).padStart(4, '0');
    const pageDir = path.join(owned, 'source/10p/pages', stem);
    const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
    const parsed = JSON.parse(await readFile(path.join(pageDir, 'page.json')));
    const observed = observations.pages.find(item => item.physicalPage === page);
    assert.equal(parsed.meta.printed_page, observed.printedPage);
    assert.equal(audit.lines_printed, observed.linesPrinted);
    assert.equal(audit.lines_md, observed.linesMd);
    assert.equal(Object.values(observed.sourceRowInventory).reduce((sum, count) => sum + count, 0), observed.linesPrinted);
    const blockAt = ref => {
      const [stemRef, number] = ref.split('#');
      assert.equal(stemRef, `p${stem}`);
      const block = parsed.blocks[Number(number) - 1];
      assert.ok(block, ref);
      return block;
    };
    if (observed.entry.cont) assert.equal(blockAt(observed.entry.block).cont, true);
    if (observed.exit.open) assert.equal(blockAt(observed.exit.block).open, true);
    for (const boundary of observed.cardBoundaries ?? []) {
      const block = blockAt(boundary.headingBlock);
      assert.equal(block.kind, 'h3');
      assert.equal(block.lines.join(''), boundary.literalHeading);
      assert.equal(blockAt(boundary.afterBlock).open, false);
    }
    const newExercises = parsed.blocks.filter(block => block.kind === 'ex' && !block.cont).map(block => block.label);
    assert.deepEqual(newExercises, observed.newExercises);
    for (const exercise of observed.exerciseObjects ?? []) {
      assert.equal(blockAt(exercise.block).kind, 'ex');
      assert.equal(blockAt(exercise.block).lines.join(''), exercise.printedText);
      assert.equal(blockAt(exercise.block).open, false);
    }
    for (const footnote of observed.footnotes ?? []) {
      assert.equal(blockAt(footnote.block).kind, 'p');
      assert.equal(blockAt(footnote.block).label, 'footnote');
      assert.ok(blockAt(footnote.ownerBlock).lines.join('').includes(footnote.marker));
    }
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
      const opened = observations.imageOpens.some(open => open.path === filename);
      crops.push({
        ...figure, ...await binding(filename), paddingPx: padding,
        exactPixelRect: [x - padding, y - padding, width + 2 * padding, height + 2 * padding],
        dimensions: [bytes.readUInt32BE(16), bytes.readUInt32BE(20)],
        source: await binding(path.join(owned, 'work/10p/pages', stem, 'page.png')),
        svg: await exists(svg) ? await binding(svg) : null,
        authorCropInspection: opened ? 'inspected-see-observations' : 'RAW-unreviewed-fresh-delegate-required',
        independentReview: 'pending', sourceApproval: false,
      });
      assert.deepEqual(crops.at(-1).dimensions, [width + 2 * padding, height + 2 * padding]);
      const cropObservation = observed.cropObservations.find(item => item.figureId === figure.id);
      assert.ok(cropObservation);
      assert.deepEqual(cropObservation.snappedBox, figure.box);
      assert.deepEqual(cropObservation.dimensions, crops.at(-1).dimensions);
      assert.equal(cropObservation.cropSeparatelyOpened, opened);
    }
    const firstPath = path.join(owned, 'commands', `finalize-${page}-initial.json`);
    const first = JSON.parse(await readFile(firstPath));
    const repairPath = path.join(owned, 'commands', `finalize-${page}-repair.json`);
    const vectorPath = path.join(owned, 'commands', `vectorize-${page}-initial.json`);
    const vector = await exists(vectorPath) ? JSON.parse(await readFile(vectorPath)) : null;
    frozenPages.push({
      physicalPage: page, printedPage: parsed.meta.printed_page,
      sourceObservedPrintedRows: observed.linesPrinted,
      linesPrinted: audit.lines_printed, linesMd: audit.lines_md, blocks: parsed.blocks.length,
      native, crops, errors: audit.errors, sourceApproval: false,
      initialCommand: await binding(firstPath), initialExitCode: first.exitCode,
      repairCommand: await exists(repairPath) ? await binding(repairPath) : null,
      vectorizeCommand: vector ? await binding(vectorPath) : null,
      vectorizeExitCode: vector?.exitCode ?? null, newExercises,
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
  ]) toolBindings.push(await binding(path.join(root, filename)));
  const inventory = [];
  for (const source of observations.sourceInventory) {
    assert.equal((await binding(path.join(owned, source.sourceImage))).sha256,
      observations.imageOpens.find(open => open.relativePath === source.sourceImage).sha256);
    assert.ok(observations.imageOpens.some(open => open.relativePath === source.crop));
  }
  const freezeInvocation = JSON.parse(await readFile(path.join(owned, 'commands/freeze-invocation.json')));
  assert.deepEqual(freezeInvocation.command.slice(1), process.argv.slice(1));
  async function walk(directory) {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else {
        assert.ok(entry.isFile(), 'No external write targets or symlinks in owned inventory.');
        inventory.push(await binding(filename));
      }
    }
  }
  await walk(owned);
  const filename = path.join(owned, 'author-freeze.json');
  await immutable(filename, `${JSON.stringify({
    schema: 'ld-s10y-lesson/source-author-freeze@1', ticket: 'STEMROBIN-181',
    book: '10p', physicalPages: pages, owned,
    preparation: await binding(path.join(owned, 'inputs/prepared.json')),
    sourcePdf: absoluteBinding(preparation.sourcePdf), sourcePdfUnchanged: true,
    precedingPage: absoluteBinding(preparation.precedingPage),
    precedingPageJson: await binding(path.join(owned, 'inputs/preceding-page123.json')),
    precedingReviewReused: preparation.precedingReviewReused, precedingContext: 'TEXT-ONLY',
    inheritedSourcePass: false, workflowPatternReferences: [await binding(pattern)],
    pages: frozenPages, observations: await binding(observationsPath),
    freezeCommand: process.argv, toolBindings,
    actualCounts: {
      nativeFiles: frozenPages.reduce((sum, page) => sum + page.native.length, 0),
      blocks: frozenPages.reduce((sum, page) => sum + page.blocks, 0),
      linesPrinted: frozenPages.reduce((sum, page) => sum + page.linesPrinted, 0),
      linesMd: frozenPages.reduce((sum, page) => sum + page.linesMd, 0),
      crops: frozenPages.reduce((sum, page) => sum + page.crops.length, 0),
      vectorizedFigures: frozenPages.reduce((sum, page) => sum + page.crops.filter(crop => crop.svg).length, 0),
      newExerciseObjects: frozenPages.reduce((sum, page) => sum + page.newExercises.length, 0),
      initialFinalizeCommands: frozenPages.length,
      initialFailures: frozenPages.filter(page => page.initialExitCode !== 0).length,
      initialAuthorCropFailures: observations.initialAuthorCropFailures,
      authoredRepairs: observations.authoredRepairs,
      prepareCommandsThisAuthorRun: 0,
    },
    sourceApproval: false, independentReview: 'pending',
    countsAreMechanicalEvidenceNotSourceApproval: true,
    imageOpens: observations.imageOpens, totalImageOpens: observations.imageOpens.length,
    contextImageOpens: observations.imageOpens.length, contextImageLimit: 24, batchImageLimit: 8,
    parentImageOpens: 0, precedingPageImageOpens: 0,
    sectionClosureObservations: observations.sectionClosure,
    sourceInventory: observations.sourceInventory,
    sourceInventoryProvenance: observations.sourceInventoryProvenance,
    cropReviewPending: observations.cropReviewPending,
    nonexclusiveFigureReferences: observations.nonexclusiveFigureReferences,
    sourceRawUncertainties: observations.sourceRawUncertainties,
    canonicalWrites: 0, vectorization: true, assembly: false, promotion: false, inventory,
  }, null, 2)}\n`);
  console.log(JSON.stringify(await binding(filename), null, 2));
} else if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  throw new Error(`Unknown action: ${action}`);
}
