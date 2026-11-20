import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const root = '.tmp/STEMROBIN-181/d1816-d270/root/10p';
const work = '.tmp/STEMROBIN-181/d1816-d270/source-work/10p';
const previewRoot = '.tmp/STEMROBIN-181/d1816-d270/raw-svg-previews';
const nativeFile = `${ticket}/tmp/d1816-d270-source48-51-native-recovery/result.json`;
const native = JSON.parse(fs.readFileSync(nativeFile));
assert.equal(native.firstFailure, null);
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
const freezes = [];
for (const [batch, page, numbers] of [[271, 49, [24, 25]], [272, 50, [26, 27, 28]], [273, 51, [29]]]) {
  const output = `${ticket}/tmp/d1816-d${batch}-raw-source${page}-review`;
  const directory = `${work}/pages/${String(page).padStart(4, '0')}`;
  const figures = [];
  assert(!fs.existsSync(`${output}/input-freeze.json`));
  fs.mkdirSync(previewRoot, { recursive: true });
  for (const number of numbers) {
    const id = `fig-${number}`;
    const preview = `${previewRoot}/${id}.svg-preview.png`;
    const call = `d${batch}-${id}-first-svg-preview`;
    assert(!fs.existsSync(preview));
    execFileSync(process.execPath, [
      `${ticket}/tmp/d1816-recovery/run-native.mjs`, call, process.execPath,
      '.claude/skills/ld-s10y-lesson/tools/svg_raster.js',
      `${directory}/figures/${id}.svg`, preview,
    ], { cwd: repo, stdio: 'inherit' });
    figures.push({ id, png: bind(`${directory}/figures/${id}.png`),
      svg: bind(`${directory}/figures/${id}.svg`), preview: bind(preview),
      previewReceipt: bind(`${ticket}/tmp/d1816-recovery/native/${call}/receipt.json`) });
  }
  const sourceOnly = save(`${output}/source-only.json`, {
    batch: `D${batch}`, book: '10p', page, printedPage: page - 10,
    figureIds: figures.map(figure => figure.id), original: bind(`${directory}/page.png`),
    instructions: 'Original only: inventory the stated figures, full topology, subfigures, labels, arrows, grid/curve detail and all visible source facts. Save independent inventory before reading after-inventory.json or opening candidates.',
  });
  const afterInventory = save(`${output}/after-inventory.json`, {
    figures, page: bind(`${root}/pages/${String(page).padStart(4, '0')}/page.json`),
    audit: bind(`${root}/pages/${String(page).padStart(4, '0')}/audit.json`),
    native: bind(nativeFile), firstNativeStagesAndPreviewsNotToBeReplayed: true,
    sourceApproval: false, modernFigureApproval: false, repairsAuthorized: false,
  });
  freezes.push(save(`${output}/input-freeze.json`, {
    batch: `D${batch}`, sourceOnly, afterInventory,
    imageLimitPerBatch: 8, imageLimitPerContext: 24,
    completeCoursesAdded: 0, paidCalls: 0, databaseWrites: false, formalHandoff: false,
  }));
}
console.log(JSON.stringify({ freezes, previewsGenerated: 6, parentImageOpens: 0 }));
