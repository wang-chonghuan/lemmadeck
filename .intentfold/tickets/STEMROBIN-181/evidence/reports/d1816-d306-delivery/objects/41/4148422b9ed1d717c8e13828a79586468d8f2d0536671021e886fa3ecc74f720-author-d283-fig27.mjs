import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const out = `${ticket}/tmp/d1816-d283-fig27-author`;
const work = '.tmp/STEMROBIN-181/d1816-d276/source-work';
const root = '.tmp/STEMROBIN-181/d1816-d276/root';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
fs.mkdirSync(out, { recursive: true });
assert(!fs.existsSync(`${out}/spec.json`));
const draftFile = `${ticket}/tmp/d1816-d275-fig27-author/geometry-draft.json`;
const inventoryFile = `${ticket}/tmp/d1816-d275-fig27-author/source-inventory.json`;
const spec = read(draftFile);
spec.source.image = bind(`${root}/10p/figures/fig-27.png`);
delete spec.source.image.bytes;
const textBindings = [];
spec.source.authoritativeText = ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => {
  const file = `${work}/adapt/10p/${edition}/lessons/phy10-c1-s3-n18/lesson.template.json`;
  const lesson = read(file);
  textBindings.push(bind(file));
  return { lesson: lesson.id, locale: edition.endsWith('-en') ? 'en' : 'zh',
    text: [lesson.printed_title, ...lesson.prose.filter(block => block.kind !== 'fig')
      .map(block => block.text)].join('\n\n') };
});
fs.writeFileSync(`${out}/spec.json`, JSON.stringify(spec, null, 2) + '\n', { flag: 'wx' });
const stages = [];
let failure = null;
const call = (name, command, args) => {
  if (failure) return;
  try {
    execFileSync(process.execPath, [
      `${ticket}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
    ], { cwd: repo, stdio: 'inherit' });
    stages.push({ name, pass: true,
      receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  } catch (error) {
    failure = { name, exitCode: error.status };
    stages.push({ ...failure, pass: false,
      receipt: bind(`${ticket}/tmp/d1816-recovery/native/${name}/receipt.json`) });
  }
};
call('d283-fig27-first-draft-validation', '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
  '.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${out}/spec.json`, '--stage', 'draft',
]);
call('d283-fig27-first-render', process.execPath, [
  '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', `${out}/spec.json`,
  '--svg', `${out}/fig-27.svg`, '--report', `${out}/fig-27.render.json`,
]);
call('d283-fig27-first-svg-preview', process.execPath, [
  '.claude/skills/ld-s10y-lesson/tools/svg_raster.js', `${out}/fig-27.svg`,
  `${out}/fig-27.preview.png`,
]);
fs.writeFileSync(`${out}/result.json`, JSON.stringify({
  batch: 'D283', status: failure ? 'native-failure' : 'native-pass-visual-review-pending',
  sourceInventory: bind(inventoryFile), reusedUnvalidatedDraft: bind(draftFile),
  textBindings, spec: bind(`${out}/spec.json`), stages, failure,
  sourceOriginallyViewedInD275: true, newParentImages: 0,
  independentFigureApproval: false, completeCoursesAdded: 0,
  paidCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(`${out}/result.json`), failure }));
