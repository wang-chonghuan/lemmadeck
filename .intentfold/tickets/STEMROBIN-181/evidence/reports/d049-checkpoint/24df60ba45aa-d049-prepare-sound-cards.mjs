import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';
assert.deepEqual(process.argv.slice(2), ['--execute']);
const folder = `${ticket}/tmp/d049-sound-preparation`;
assert.equal(await exists(`${folder}/prepared.json`), false);
const raw = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const sourceReceipts = [
  `${ticket}/evidence/reports/d045-source120-123-consumed.json`,
  `${ticket}/evidence/reports/d047-source124-125-consumed.json`,
];
const inputs = [];
for (const file of sourceReceipts) {
  const receipt = await read(file);
  assert.equal(receipt.status, 'PASS-source-consumed');
  for (const row of receipt.outputs) await verify(row.path, row.sha256);
  inputs.push(await bind(file));
}
const protectedFiles = await Promise.all([
  `${raw}/book.json`, `${raw}/editions/modern-us-neutral/book.json`,
  `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
].map(bind));
for (let page = 120; page <= 125; page++) {
  const stem = String(page).padStart(4, '0');
  const audit = await read(`${raw}/pages/${stem}/audit.json`);
  assert.equal(audit.lines_printed, audit.lines_md);
  assert.deepEqual(audit.errors, []);
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const original = `${raw}/pages/${stem}/${name}`;
    const snapshot = `${folder}/root/10p/pages/${stem}/${name}`;
    await immutableWrite(snapshot, await bytes(original));
    inputs.push({ original: await bind(original), snapshot: await bind(snapshot) });
  }
}
for (const number of [81, 82, 83, 84]) {
  for (const suffix of ['png', 'svg']) {
    const original = `${raw}/figures/fig-${number}.${suffix}`;
    const snapshot = `${folder}/root/10p/figures/fig-${number}.${suffix}`;
    await immutableWrite(snapshot, await bytes(original));
    inputs.push({ original: await bind(original), snapshot: await bind(snapshot) });
  }
}
const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
  '.claude/skills/ld-s10y-lesson/tools/p2c.py'];
async function run(name, args) {
  const result = spawnSync(command[0], [...command.slice(1), ...args], {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
  });
  await immutableWrite(`${folder}/${name}.json`, `${JSON.stringify({
    command: [...command, ...args], exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }, null, 2)}\n`);
  assert.equal(result.status, 0, result.stdout + result.stderr);
}
await run('assemble', ['assemble', '--book', '10p',
  '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  '--root', absolute(`${folder}/root`), '--work', absolute(`${folder}/work`)]);
const targets = [];
for (const number of [43, 45]) {
  const card = `phy10-c1-s5-n${number}`;
  const owner = `${ticket}/tmp/d049-10p-n${number}-author`;
  assert.equal(await exists(owner), false);
  for (const language of ['zh', 'en']) {
    const localeRoot = `${owner}/${language}/root`;
    await fs.cp(absolute(`${folder}/root`), absolute(localeRoot),
      { recursive: true, force: false, errorOnExist: true });
    await run(`n${number}-${language}-prepare`, ['adapt-prepare', '--book', '10p',
      '--edition', 'modern-us-neutral', '--lesson', card,
      '--root', absolute(localeRoot), '--work', absolute(`${owner}/${language}/work`)]);
  }
  const lesson = await read(`${owner}/zh/root/10p/lessons/${card}/lesson.json`);
  const exercises = await read(`${owner}/zh/root/10p/lessons/${card}/exercises.json`);
  assert.equal(exercises.count, number === 45 ? 5 : 0);
  targets.push({ card, owner, prose: lesson.prose.length, tasks: exercises.count,
    sourceFigures: lesson.figures.map(row => row.id) });
  await immutableWrite(`${owner}/input-freeze.json`, `${JSON.stringify({
    ticket: 'STEMROBIN-181', card, inputs, sourceReviewsReused: true,
    raw: await bind(`${owner}/zh/root/10p/lessons/${card}/lesson.json`),
    exercises: await bind(`${owner}/zh/root/10p/lessons/${card}/exercises.json`),
    imagesOpened: 0, newFigureApproval: false, cardComplete: false,
  }, null, 2)}\n`);
}
for (const row of protectedFiles) await verify(row.path, row.sha256);
await immutableWrite(`${folder}/prepared.json`, `${JSON.stringify({
  ticket: 'STEMROBIN-181', targets, inputs, protectedFiles,
  sourceReviewsReused: true, canonicalWrites: 0, newImageOpens: 0,
  excluded: ['n42 Figure80 stitching HOLD', 'n46 SOURCE126/127 homograph HOLD'],
}, null, 2)}\n`);
console.log(JSON.stringify({ preparation: await bind(`${folder}/prepared.json`), targets }));
