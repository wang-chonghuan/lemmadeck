import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.dirname(fileURLToPath(import.meta.url));
const prepared = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d042-source112-115-preparation/prepared.json');
const expected = '4df2238d78edbc710b26bc1e21a0dec8d7dca3f33ed3886a24c46a03202583c6';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const binding = async filename => ({ path: filename, sha256: digest(await readFile(filename)) });
const immutable = async (filename, bytes) => {
  assert.ok(filename.startsWith(`${owned}/`));
  await mkdir(path.dirname(filename), { recursive: true });
  await writeFile(filename, bytes, { flag: 'wx' });
};
const [action, pageArg] = process.argv.slice(2);

if (action === 'reuse') {
  const bytes = await readFile(prepared);
  assert.equal(digest(bytes), expected);
  const manifest = JSON.parse(bytes);
  await immutable(path.join(owned, 'inputs/prepared.json'), bytes);
  for (const item of manifest.pages) {
    for (const input of item.inputs) {
      const bytes = await readFile(path.join(root, input.path));
      assert.equal(digest(bytes), input.sha256, input.path);
      await immutable(path.join(owned, 'work/10p/pages', String(item.physicalPage).padStart(4, '0'), path.basename(input.path)), bytes);
    }
    if (item.receipt) {
      const bytes = await readFile(path.join(root, item.receipt.path));
      assert.equal(digest(bytes), item.receipt.sha256);
      await immutable(path.join(owned, 'inputs', path.basename(item.receipt.path)), bytes);
    }
  }
  for (const name of ['preceding-page111.json', 'preceding-page111.md']) {
    const bytes = await readFile(path.join(path.dirname(prepared), name));
    if (name.endsWith('.json')) assert.equal(digest(bytes), manifest.precedingPage.sha256);
    await immutable(path.join(owned, 'inputs', name), bytes);
  }
  await immutable(path.join(owned, 'inputs/reuse-receipt.json'), `${JSON.stringify({
    command: process.argv, preparation: await binding(prepared),
    exactInputsCopied: 16, previousPagePixelsOpened: false, canonicalWrites: 0,
  }, null, 2)}\n`);
  console.log('Verified and reused 16 prepared page inputs; preceding text only.');
} else if (action === 'finalize' || action === 'repair-finalize') {
  const page = Number(pageArg);
  assert.ok([112, 113, 114, 115].includes(page));
  const stem = String(page).padStart(4, '0');
  const pageDir = path.join(owned, 'source/10p/pages', stem);
  const stage = action === 'finalize' ? 'initial' : 'repair';
  if (stage === 'repair') {
    const first = JSON.parse(await readFile(path.join(owned, 'commands', `finalize-${page}-initial.json`)));
    assert.notEqual(first.exitCode, 0, 'A successful page cannot be re-finalized.');
  }
  await immutable(path.join(owned, stage, stem, 'page.authored.md'), await readFile(path.join(pageDir, 'page.md')));
  const command = [path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), '-B',
    path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py'), 'finalize',
    '--book', '10p', '--page', String(page), '--root', path.join(owned, 'source'),
    '--work', path.join(owned, 'work')];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutable(path.join(owned, 'commands', `finalize-${page}-${stage}.json`), `${JSON.stringify({
    command, cwd: root, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  }, null, 2)}\n`);
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    await immutable(path.join(owned, stage, stem, name), await readFile(path.join(pageDir, name)));
  }
  const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
  for (const figure of audit.figures) {
    const crop = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.png`);
    await immutable(path.join(owned, stage, stem, 'figures', `${figure.id}.png`), await readFile(crop));
  }
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  process.exitCode = result.status ?? 1;
} else if (action === 'freeze') {
  const observations = JSON.parse(await readFile(path.join(owned, 'observations.json')));
  assert.ok(observations.imageOpens.length <= 8);
  for (const open of observations.imageOpens) Object.assign(open, await binding(path.join(owned, open.relativePath)));
  const pages = [];
  for (const page of [112, 113, 114, 115]) {
    const stem = String(page).padStart(4, '0');
    const pageDir = path.join(owned, 'source/10p/pages', stem);
    const audit = JSON.parse(await readFile(path.join(pageDir, 'audit.json')));
    const native = [];
    for (const name of ['page.md', 'page.json', 'audit.json']) native.push(await binding(path.join(pageDir, name)));
    const crops = [];
    for (const figure of audit.figures) {
      const filename = path.join(owned, 'work/10p/pages', stem, 'figures', `${figure.id}.png`);
      const bytes = await readFile(filename);
      assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
      const [x, y, width, height] = figure.box;
      crops.push({
        ...figure, ...await binding(filename), paddingPx: 12,
        exactPixelRect: [x - 12, y - 12, width + 24, height + 24],
        dimensions: [bytes.readUInt32BE(16), bytes.readUInt32BE(20)],
        source: await binding(path.join(owned, 'work/10p/pages', stem, 'page.png')),
        independentReview: 'pending',
      });
      assert.deepEqual(crops.at(-1).dimensions, [width + 24, height + 24]);
    }
    const command = JSON.parse(await readFile(path.join(owned, 'commands', `finalize-${page}-initial.json`)));
    pages.push({
      physicalPage: page, linesPrinted: audit.lines_printed, linesMd: audit.lines_md,
      blocks: JSON.parse(await readFile(path.join(pageDir, 'page.json'))).blocks.length,
      native, crops, errors: audit.errors, sourceApproval: false,
      initialCommand: await binding(path.join(owned, 'commands', `finalize-${page}-initial.json`)),
      initialExitCode: command.exitCode,
      independentReview: 'pending', observations: observations.pages.find(item => item.physicalPage === page),
    });
  }
  const toolBindings = [];
  for (const filename of [
    '.claude/skills/ld-s10y-lesson/SKILL.md', '.agents/skills/ld-s10y-image/SKILL.md',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', '.claude/skills/ld-s10y-lesson/tools/blocks.py',
    '.claude/skills/ld-s10y-lesson/tools/layout.py', '.claude/skills/ld-s10y-lesson/tools/normalize.py',
    '.claude/skills/ld-s10y-lesson/tools/mathcheck.py', '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
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
  const filename = path.join(owned, 'complete-freeze.json');
  await immutable(filename, `${JSON.stringify({
    schema: 'ld-s10y-lesson/source-author-freeze@1', ticket: 'STEMROBIN-181',
    book: '10p', physicalPages: [112, 113, 114, 115], owned,
    preparation: { path: prepared, sha256: expected }, pages,
    observations: await binding(path.join(owned, 'observations.json')),
    freezeCommand: process.argv, toolBindings,
    actualCounts: {
      nativeFiles: pages.reduce((sum, page) => sum + page.native.length, 0),
      blocks: pages.reduce((sum, page) => sum + page.blocks, 0),
      linesPrinted: pages.reduce((sum, page) => sum + page.linesPrinted, 0),
      linesMd: pages.reduce((sum, page) => sum + page.linesMd, 0),
      crops: pages.reduce((sum, page) => sum + page.crops.length, 0),
      initialFinalizeCommands: 4,
      initialFailures: pages.filter(page => page.initialExitCode !== 0).length,
      authoredRepairs: observations.authoredRepairs,
    },
    sourceApproval: false, independentReview: 'pending',
    countsAreMechanicalEvidenceNotSourceApproval: true,
    imageOpens: observations.imageOpens, totalImageOpens: observations.imageOpens.length,
    sectionClosureObservations: observations.sectionClosure,
    nonexclusiveFigureReferences: observations.nonexclusiveFigureReferences,
    canonicalWrites: 0, vectorization: false, assembly: false, promotion: false,
    inventory,
  }, null, 2)}\n`);
  console.log(JSON.stringify(await binding(filename), null, 2));
} else {
  throw new Error(`Unknown action: ${action}`);
}
