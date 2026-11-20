import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const out = `${ticket}/tmp/d1816-d276-source48-51-affected-author`;
const oldRoot = '.tmp/STEMROBIN-181/d1816-d270/root';
const oldWork = '.tmp/STEMROBIN-181/d1816-d270/source-work';
const root = '.tmp/STEMROBIN-181/d1816-d276/root';
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (name, data) => {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(`${out}/${name}`, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
const unchanged = [[49, 24], [49, 25], [50, 26], [50, 27], [51, 29]];
if (process.argv[2] === 'prepare') {
  assert(!fs.existsSync(root));
  fs.cpSync(oldRoot, root, { recursive: true, dereference: false });
  for (const page of [48, 49, 50, 51]) {
    const dir = `10p/pages/${String(page).padStart(4, '0')}`;
    fs.mkdirSync(`${work}/${dir}/figures`, { recursive: true });
    for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
      fs.symlinkSync(path.resolve(`${oldWork}/${dir}/${name}`), `${work}/${dir}/${name}`);
    for (const name of fs.existsSync(`${oldWork}/${dir}/figures`)
      ? fs.readdirSync(`${oldWork}/${dir}/figures`) : []) {
      if (name.endsWith('.png'))
        fs.copyFileSync(`${oldWork}/${dir}/figures/${name}`, `${work}/${dir}/figures/${name}`);
      else if (name.endsWith('.svg') && name !== 'fig-28.svg')
        fs.symlinkSync(path.resolve(`${oldWork}/${dir}/figures/${name}`), `${work}/${dir}/figures/${name}`);
    }
  }
  save('prepared.json', {
    root, work,
    sourceReview: bind(`${ticket}/tmp/d1816-d269-source48-51-review/report.json`),
    rawReview: bind(`${ticket}/tmp/d1816-d272-raw-source50-review/report.json`),
    preservedSourceCandidates: [48, 50, 51].flatMap(page => ['page.md', 'page.json', 'audit.json'].map(name =>
      bind(`${oldRoot}/10p/pages/${String(page).padStart(4, '0')}/${name}`))),
    unchangedRawPNG: unchanged.map(([page, number]) =>
      bind(`${oldWork}/10p/pages/${String(page).padStart(4, '0')}/figures/fig-${number}.png`)),
    firstFailedRaw28: ['png', 'svg'].map(extension =>
      bind(`${oldWork}/10p/pages/0050/figures/fig-28.${extension}`)),
    sourceRepairRounds: 1, raw28RepairRounds: 1, sourceApproval: false,
    completeCoursesAdded: 0, databaseWrites: false,
  });
  console.log(JSON.stringify({ prepared: bind(`${out}/prepared.json`), root, work }));
} else {
  assert.equal(process.argv[2], 'run');
  assert(!fs.existsSync(`${out}/result.json`));
  const stages = [];
  let failure = null;
  const call = (name, executable, args) => {
    if (failure) return;
    try {
      execFileSync(process.execPath, [
        `${ticket}/tmp/d1816-recovery/run-native.mjs`, name, executable, ...args,
      ], { cwd: repo, stdio: 'inherit' });
      stages.push({ name, pass: true,
        receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
    } catch (error) {
      failure = { name, exitCode: error.status,
        receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) };
      stages.push({ ...failure, pass: false });
    }
  };
  for (const page of [48, 50, 51])
    call(`d276-source${page}-affected-finalize`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize',
      '--book', '10p', '--root', root, '--work', work, '--page', String(page),
    ]);
  const png = `${work}/10p/pages/0050/figures/fig-28.png`;
  const svg = `${work}/10p/pages/0050/figures/fig-28.svg`;
  const preview = `${out}/fig-28.svg-preview.png`;
  call('d276-fig28-affected-only-vectorize', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/vectorize.py', '--input', png, '--output', svg,
  ]);
  call('d276-fig28-affected-only-svg-preview', process.execPath, [
    '.claude/skills/ld-s10y-lesson/tools/svg_raster.js', svg, preview,
  ]);
  call('d276-source48-53-affected-assemble', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'assemble', '--book', '10p',
    '--root', root, '--work', work, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json',
  ]);
  const reusedPNG = unchanged.map(([page, number]) => {
    const relative = `10p/pages/${String(page).padStart(4, '0')}/figures/fig-${number}.png`;
    const previous = bind(`${oldWork}/${relative}`);
    const current = bind(`${work}/${relative}`);
    assert.equal(current.sha256, previous.sha256, `Unchanged RAW${number} drift`);
    return { previous, current };
  });
  save('result.json', {
    batch: 'D276', root, work, stages, failure,
    status: failure ? 'native-failure' : 'affected-native-pass-review-pending',
    prepared: bind(`${out}/prepared.json`), reusedPNG,
    source49NotReplayed: true, passedRawSVGNotReplayed: [24, 25, 26, 27, 29],
    raw28: failure ? null : { png: bind(png), svg: bind(svg), preview: bind(preview) },
    changedPages: [48, 50, 51].map(page => ({
      page, md: bind(`${root}/10p/pages/${String(page).padStart(4, '0')}/page.md`),
      json: bind(`${root}/10p/pages/${String(page).padStart(4, '0')}/page.json`),
      audit: bind(`${root}/10p/pages/${String(page).padStart(4, '0')}/audit.json`),
    })),
    sourceRepairRounds: 1, raw28RepairRounds: 1, sourceApproval: false,
    completeCoursesAdded: 0, canonicalPromotions: 0, paidCalls: 0, databaseWrites: false,
  });
  console.log(JSON.stringify({ result: bind(`${out}/result.json`), failure }));
}
