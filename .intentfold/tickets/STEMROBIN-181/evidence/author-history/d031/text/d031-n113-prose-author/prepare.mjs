import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const cwd = process.cwd();
const ticket = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const own = path.join(ticket, 'd031-n113-prose-author');
const candidate = path.join(ticket, 'd030-n113-source-candidate');
const artifact = path.join(own, 'artifacts');
const work = path.join(own, 'work');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => {
  const data = await fs.readFile(file);
  return { path: file, bytes: data.length, sha256: hash(data) };
};
async function write(file, data) {
  assert.ok(file.startsWith(`${own}/`));
  if (process.argv.includes('--resume-before-native')) {
    try {
      assert.deepEqual(await fs.readFile(file), Buffer.from(data), file);
      return;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, data, { flag: 'wx' });
}
const json = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
if (process.argv.includes('--resume-before-native')) {
  await assert.rejects(fs.access(path.join(own, 'finalize-278.command.json')), { code: 'ENOENT' });
}
const inputs = [];
async function copy(from, to, expected) {
  const binding = await bind(from);
  if (expected) assert.equal(binding.sha256, expected, from);
  inputs.push(binding);
  await write(to, await fs.readFile(from));
}
async function command(label, args) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await json(path.join(own, `${label}.command.json`), {
    command: args, cwd, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  console.log(result.stdout.trim());
}
const report = path.join(candidate, 'result.json');
assert.equal((await bind(report)).sha256,
  'ac7f99cedec1d08f1d72b6787e619dbbb28a2420d3373812d6a0a4dc27f6f15c');
await copy(report, path.join(own, 'inputs/source-candidate.result.json'));
const reviews = [
  ['d030-source276-279-affected-review.json',
    '567bc0c989210ae684bcd6a9d290439839e128fcbc0296cbd139bf486e9e2df6'],
  ['d030-source276-crop-review.json',
    '34e19e1a9582fe73a55a95aeb1dd00233e34a5aabf8495d84c459ab89fdb1bce'],
  ['d030-source277-278-crop-review.json',
    '72f8c1f4b87c2ac9e5bf06da16d566cdef060965620d9e452924e49969455730'],
];
for (const [name, sha] of reviews)
  await copy(path.join(ticket, name), path.join(own, 'inputs', name), sha);
const nativePath = path.join(ticket, 'd030-source276-279-native/pages-native.json');
await copy(nativePath, path.join(own, 'inputs/pages-native.json'),
  '134cbbb5686a74a02dab0d7e4348bf496cc4f120301a07c42f00086039210fc1');
const native = await read(nativePath);
const shared = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const protectedFiles = await Promise.all([
  path.join(shared, 'book.json'),
  path.join(shared, 'editions/modern-us-neutral/book.json'),
  ...[276, 277, 278, 279].flatMap(page =>
    ['page.md', 'page.json', 'audit.json'].map(name =>
      path.join(shared, 'pages', String(page).padStart(4, '0'), name))),
].map(bind));
for (const page of native.pages) {
  const num = String(page.page).padStart(4, '0');
  for (const binding of page.outputs) {
    const name = path.basename(binding.path);
    const from = path.join(candidate, 'artifacts/9p/pages', num, name);
    await copy(from, path.join(artifact, '9p/pages', num, name), binding.sha256);
    await copy(from, path.join(own, 'inputs/pages', num, name), binding.sha256);
  }
  const source = await read(path.join(artifact, '9p/pages', num, 'page.json'));
  for (const name of ['page.png', 'layout.json', 'page.template.md', 'page.grid.png']) {
    const from = path.join(ticket, 'd030-source276-279-author/snapshots/pages', num, name);
    await copy(from, path.join(work, '9p/pages', num, name),
      name === 'page.png' ? source.meta.render.sha256 : undefined);
  }
}
for (const figure of native.cropReviewTargets) {
  const num = String(figure.page).padStart(4, '0');
  for (const binding of [figure.crop, figure.svg]) {
    const name = path.basename(binding.path);
    await copy(path.join(candidate, 'work/9p/pages', num, 'figures', name),
      path.join(work, '9p/pages', num, 'figures', name), binding.sha256);
    await copy(path.join(candidate, 'artifacts/9p/figures', name),
      path.join(artifact, '9p/figures', name), binding.sha256);
  }
}
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const binding = (await read(report)).cards[0].outputs.find(row => path.basename(row.path) === name);
  await copy(path.join(cwd, binding.path),
    path.join(own, 'inputs/raw113', name), binding.sha256);
}
const priorLaw = path.join(shared, 'lessons/phy9-c2-s4-n101/lesson.json');
await copy(priorLaw, path.join(own, 'inputs/prerequisite-n101.lesson.json'));
const law = await read(priorLaw);
assert.ok(law.prose.some(row => row.text.includes('$F=96500$')));
assert.ok(law.prose.some(row => row.text.includes('$n=2$')));
for (const name of ['openstax-semiconductors.json', 'openstax-semiconductors.txt'])
  await copy(path.join(ticket, 'd026-semiconductor-references', name),
    path.join(own, 'inputs/references', name));

const q = 0.01 * 314 * 1800;
const m = 0.0635 * q / (2 * 96500);
const volume = 3e-3 * 3e-3;
const pairsPerSecond = 1e4 * volume;
const current = 1.6e-19 * pairsPerSecond;
const voltage = current * 1;
assert.equal(q, 5652);
assert.ok(Math.abs(m - 0.0018595958549222798) < 1e-15);
assert.ok(Math.abs(voltage - 1.44e-20) < 1e-34);
const errata = [
  {
    id: 'p0278-n113-example1-mass-exponent',
    block: 'p0278#1',
    original: '$m\\approx1.9\\times10^3$',
    reason: '独立作者算术核验：保留原题q=5652库仑、A=0.0635千克/摩尔；本书101课给出F=96500库仑/摩尔、硫酸铜中铜的价数n=2。按印刷m=(A/n)q/F得0.0018595958549222798千克，原书两位有效数字应为1.9×10^-3千克。原印正3已由SOURCE像素确认；只登记勘误，不改忠实正文。不是独立SCI批准。',
  },
  {
    id: 'p0278-n113-example2-voltage-exponent',
    block: 'p0278#5',
    original: '$V=1.4\\times10^{-11}$',
    reason: '独立作者算术核验：保留原题e=1.6×10^-19库仑、n=10^4对/(米³·秒)、S=3×10^-3米²、d=3×10^-3米、R=1欧姆。按印刷V=enSdR，板间体积9×10^-6米³，每秒0.09对，电压1.44×10^-20伏特；按原书两位有效数字应为1.4×10^-20伏特。每对离子贡献一次外电路电荷e，不能重复计成2e。原印-11已由SOURCE像素确认；只登记勘误，不改忠实正文。不是独立SCI批准。',
  },
];
await json(path.join(own, 'calculations.json'), {
  scope: 'Independent arithmetic by this TEXT AUTHOR; not independent SCI or physical apparatus approval.',
  example1: {
    preservedGivens: { R_cm: 5, holeRadius_mm: 0.5, time_min: 30,
      chargePer_cm2_per_s_C: 0.01, molarMass_kg_per_mol: 0.0635 },
    preservedPrintedIntermediates: { area_cm2: 314, time_s: 1800, charge_C: q },
    prerequisite: await bind(priorLaw),
    prerequisiteFacts: { F_C_per_mol: 96500, copperValence: 2 },
    calculation: '0.0635*5652/(2*96500)',
    result_kg: m, roundedResult: '$m\\approx1.9\\times10^{-3}$',
    geometryNote: 'Small-hole model used as a source approximation; no new statement that the inner liquid contains no ions.',
  },
  example2: {
    preservedGivens: { R_ohm: 1, S_m2: 3e-3, d_m: 3e-3,
      pairs_per_m3_per_s: 1e4, charge_C: 1.6e-19 },
    calculation: '1.6e-19*1e4*3e-3*3e-3*1',
    volume_m3: volume, pairsPerSecond, current_A: current,
    result_V: voltage, roundedResult: '$V=1.4\\times10^{-20}$',
    chargeAccounting: 'A collected pair supplies one electron charge through a given external-circuit section; the two opposite carriers are not two independent full charges across that section.',
  },
  registrations: errata,
  proposalsIfRegistrationFails: [
    { id: errata[0].id, corrected: '$m\\approx1.9\\times10^{-3}$' },
    { id: errata[1].id, corrected: '$V=1.4\\times10^{-20}$' },
  ],
});
const pagePath = path.join(artifact, '9p/pages/0278/page.md');
const originalPage = await fs.readFile(pagePath, 'utf8');
const match = originalPage.match(/^---\n([\s\S]*?)\n---\n/);
assert.ok(match);
const body = originalPage.slice(match[0].length);
const meta = JSON.parse(match[1]);
assert.deepEqual(meta.errata, []);
meta.errata = errata;
await fs.writeFile(pagePath, `---\n${JSON.stringify(meta, null, 2)}\n---\n${body}`);
await json(path.join(own, 'inputs.binding.json'), {
  inputs, protectedFiles, sourcePathResolution: 'Requested .tmp/d030-source276-279-affected-review.json is the ticket tmp report.',
  initialReadFailures: [
    { command: 'rg tools/adapt.py', reason: 'No adapt.py; actual production owner is edition.py. Read corrected path.' },
    { command: 'ls own author root and freeze', reason: 'Both absent before this author; expected collision check.' },
    { command: 'prepare.mjs first call', reason: 'Stopped at incorrectly transcribed unrounded mass assertion before metadata registration or any native call. Node arithmetic returns0.0018595958549222798; corrected the assertion and reason, resumed existing exact input copies only. Rounded correction1.9e-3 unchanged.' },
  ],
});
const p2c = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/p2c.py');
const python = path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const base = [python, '-B', p2c];
await command('finalize-278', [...base, 'finalize', '--book', '9p',
  '--page', '278', '--root', artifact, '--work', work]);
const finalized = await fs.readFile(pagePath, 'utf8');
assert.equal(finalized.slice(finalized.match(/^---\n[\s\S]*?\n---\n/)[0].length), body);
const audit = await read(path.join(artifact, '9p/pages/0278/audit.json'));
assert.deepEqual(audit.errors, []);
assert.deepEqual(audit.figures,
  (await read(path.join(own, 'inputs/pages/0278/audit.json'))).figures);
const cropChecks = [];
for (const figure of native.cropReviewTargets) {
  for (const binding of [figure.crop, figure.svg]) {
    const local = path.join(work, '9p/pages', String(figure.page).padStart(4, '0'),
      'figures', path.basename(binding.path));
    const actual = await bind(local);
    assert.equal(actual.sha256, binding.sha256);
    cropChecks.push({ id: figure.id, ...actual, approvedInputSha256: binding.sha256, unchanged: true });
  }
}
await json(path.join(own, 'metadata-finalize-preservation.json'), {
  bodyBytesUnchanged: true, bodySha256: hash(body), exactNormalizedAuditGeometryReused: true,
  nativeFinalizeCalls: 1, vectorizeCalls: 0, imageOpens: 0,
  visualImageLoads: 0, nativeInternalRasterRead: 'Page278 only, required by native finalize; no visual inspection.',
  cropChecks, copiedSourcePage: await bind(pagePath),
  copiedSourceJSON: await bind(path.join(artifact, '9p/pages/0278/page.json')),
});
await command('assemble', [...base, 'assemble', '--book', '9p',
  '--root', artifact, '--work', work,
  '--toc', path.join(cwd, 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json')]);
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  const local = path.join(artifact, '9p/lessons/phy9-c2-s4-n113', name);
  assert.equal((await bind(local)).sha256,
    (await bind(path.join(own, 'inputs/raw113', name))).sha256);
}
await command('adapt-prepare', [...base, 'adapt-prepare', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', 'phy9-c2-s4-n113',
  '--root', artifact, '--work', work]);
const templates = path.join(work, 'adapt/9p/modern-us-neutral/lessons/phy9-c2-s4-n113');
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
  await copy(path.join(templates, name), path.join(own, 'prepared', name));
await copy(path.join(work, 'adapt/9p/modern-us-neutral/book.template.json'),
  path.join(own, 'prepared/book.template.json'));
const lesson = await read(path.join(templates, 'lesson.template.json'));
assert.equal(lesson.errata.length, 2);
assert.deepEqual(lesson.errata.map(row => row.target), ['exercises[0]', 'exercises[1]']);
for (const binding of [...inputs, ...protectedFiles])
  assert.equal((await bind(binding.path)).sha256, binding.sha256, binding.path);
await json(path.join(own, 'prepare.result.json'), {
  status: 'OWN_SOURCE_METADATA_REGISTERED_PREPARED',
  artifactRoot: artifact, workRoot: work, raw113BytesUnchanged: true,
  counts: { finalize278: 1, assemble: 1, adaptPrepare113: 1, imageOpens: 0 },
  boundErrata: lesson.errata, cropBytesUnchanged: true,
  independentScienceApproval: false, independentFigureApproval: false,
  assemblyWarnings: ['Boundary t18 exercise1 refers to old fig-189, absent in this bounded four-page copy; not authored or promoted.'],
});
console.log(JSON.stringify(await bind(path.join(own, 'prepare.result.json'))));
