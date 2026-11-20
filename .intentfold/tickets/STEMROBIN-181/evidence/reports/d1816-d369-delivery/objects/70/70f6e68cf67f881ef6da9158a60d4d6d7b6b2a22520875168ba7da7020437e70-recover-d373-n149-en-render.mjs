import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d373-n149-en-render-recovery`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const previousFile = `${T}/tmp/d1816-d366-n149-native-recovery/result.json`;
const previous = read(previousFile);
assert.equal(previous.status, 'native-failure');
assert.equal(previous.stages.length, 5);
assert(previous.failure.message.includes('d366-n149-en-first-offline-render'));
assert.equal(read(`${T}/tmp/d1816-recovery/native/d372-english-chapter-render-focused-regression/receipt.json`).exitCode, 0);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  assert.equal(read(`${previous.root}/10p/editions/${edition}/lessons/${previous.id}/adaptation.audit.json`).status, 'pass');
assert(!fs.existsSync(O));
fs.mkdirSync(O, { recursive: true });
const name = 'd373-n149-en-offline-render-recovery';
let failure = null;
try {
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    '.claude/skills/ld-s10y-lesson/.venv/bin/python',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', '--book', '10p',
    '--root', previous.root, '--work', previous.display,
    '--edition', 'modern-us-neutral-en', '--lesson', previous.id,
  ], { cwd: repo, stdio: 'inherit' });
} catch (error) {
  failure = { message: error.message, exitCode: error.status ?? null };
}
const outputs = failure ? [] : ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => {
  const dir = `${previous.root}/10p/editions/${edition}/lessons/${previous.id}`;
  const figures = `${previous.root}/10p/editions/${edition}/figures`;
  return { edition, lesson: bind(`${dir}/lesson.json`), exercises: bind(`${dir}/exercises.json`),
    figures: bind(`${dir}/figures.json`), audit: bind(`${dir}/adaptation.audit.json`),
    html: bind(`${previous.display}/render/10p/${edition}/${previous.id}/text.html`),
    spec: bind(`${figures}/fig-277.spec.json`), svg: bind(`${figures}/fig-277.svg`),
    render: bind(`${figures}/fig-277.render.json`), review: bind(`${figures}/fig-277.review.json`) };
});
const resultFile = `${O}/result.json`;
fs.writeFileSync(resultFile, JSON.stringify({
  ...previous, stage: 'D373', status: failure ? 'native-failure' : 'native-pass-display-pending',
  failure, outputs, priorFailure: bind(previousFile), previousSuccessfulStagesReplayed: 0,
  rendererRepair: bind('.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
  focusedTests: bind(`${T}/tmp/d1816-recovery/native/d372-english-chapter-render-focused-regression/receipt.json`),
  recoveredStage: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`),
  geometryRerenders: 0, completeCoursesAdded: 0, sourcePagesAdded: 0,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ result: bind(resultFile), failure }));
if (failure) process.exitCode = 1;
