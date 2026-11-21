import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const { proseOutline, sectionBreakIndices } = createRequire(import.meta.url)(
  path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d590';
const A = `${T}/tmp/d1816-d600-n25-affected-repair`;
const O = `${T}/tmp/d1816-d604-n25-boundary-recovery`;
const E = `${T}/evidence/reports/d1816-d598-n25-native`;
const ID = 'phy10-c1-s3-n25';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file), bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(O));
const firstFailure = `${T}/tmp/d1816-recovery/native/d598-n25-zh-first-adapt-finalize/receipt.json`;
assert.equal(read(firstFailure).exitCode, 2);
const records = [], bindings = [];
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const originalFile = `${A}/${locale}/lesson.template.json`;
  const original = read(originalFile);
  const oldOutline = proseOutline(original.prose);
  const oldIndices = sectionBreakIndices(original.prose, original.section_breaks);
  assert.deepEqual(oldIndices, [2, 5, 9, 12, 16]);
  const targets = oldIndices.map(index => ({
    blockIndex: oldOutline[index].blockIndex,
    paragraphInBlock: oldOutline[index].paragraphInBlock,
  }));
  const normalization = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c',
    'import json,sys;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import edition;d=json.load(sys.stdin);edition.normalize_lesson_layout(d);print(json.dumps(d,ensure_ascii=False))',
  ], { cwd: repo, input: JSON.stringify(original), encoding: 'utf8', maxBuffer: 1024 * 1024 });
  assert.equal(normalization.status, 0, normalization.stderr);
  const current = JSON.parse(normalization.stdout);
  const invariant = structuredClone(current);
  for (let index = 0; index < original.prose.length; index++) {
    assert.equal(current.prose[index].text.replace(/\s+/g, ''),
      original.prose[index].text.replace(/\s+/g, ''));
    invariant.prose[index].text = original.prose[index].text;
  }
  assert.deepEqual(invariant, original);
  const outline = proseOutline(current.prose);
  current.section_breaks = targets.map(target => {
    const matches = outline.filter(item => item.blockIndex === target.blockIndex
      && item.paragraphInBlock === target.paragraphInBlock);
    assert.equal(matches.length, 1);
    const after = matches[0];
    assert(after.index > 0);
    return { before: outline[after.index - 1].text, after: after.text };
  });
  assert.equal(sectionBreakIndices(current.prose, current.section_breaks).length, 5);
  const directory = `${B}/work/adapt/10p/${edition}/lessons/${ID}`;
  fs.mkdirSync(directory, { recursive: true });
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
    if (fs.existsSync(`${directory}/${name}`)) {
      fs.mkdirSync(`${O}/before/${locale}`, { recursive: true });
      fs.copyFileSync(`${directory}/${name}`, `${O}/before/${locale}/${name}`, fs.constants.COPYFILE_EXCL);
    }
  save(`${O}/${locale}-normalized.template.json`, current);
  fs.writeFileSync(`${directory}/lesson.template.json`, JSON.stringify(current, null, 2) + '\n');
  fs.copyFileSync(`${A}/${locale}/exercises.template.json`, `${directory}/exercises.template.json`);
  const figures = read(`${A}/${locale}/figures.template.json`);
  for (const figure of figures.figures) {
    const id = figure.id;
    Object.assign(figure, { spec: `figures/${id}.spec.json`, svg: `figures/${id}.svg`,
      render: `figures/${id}.render.json`, review: `figures/${id}.review.json` });
    for (const key of ['png', 'generation', 'artwork']) delete figure[key];
    if (locale === 'en') figure.label = `Figure ${Number(id.slice(4))}`;
  }
  fs.writeFileSync(`${directory}/figures.template.json`, JSON.stringify(figures, null, 2) + '\n');
  const evidence = { locale, before: bind(originalFile),
    candidate: bind(`${O}/${locale}-normalized.template.json`),
    priorApprovedTargets: targets, anchors: current.section_breaks,
    onlyNativeWhitespaceAndAnchorRebinding: true,
    sourceFormulasBlockIdentityAllOtherFieldsAndSemanticSectionsUnchanged: true,
    firstFailure: bind(firstFailure), scientificAndFigureReviewsReplayed: false };
  save(`${O}/${locale}-anchor-binding.json`, evidence);
  bindings.push(evidence);
  for (const action of ['adapt-finalize', 'render'])
    native(`d604-n25-${locale}-${action}`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
      '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', action, '--book', '10p',
      '--root', `${B}/root`, '--work', `${B}/work`, '--edition', edition, '--lesson', ID,
    ]);
  const final = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${final}/adaptation.audit.json`).status, 'pass');
  assert.equal(read(`${final}/exercises.json`).count, 0);
  records.push({ locale, edition, products: ['lesson.json', 'exercises.json',
    'figures.json', 'adaptation.audit.json'].map(name => bind(`${final}/${name}`)),
  html: bind(`${B}/work/render/10p/${edition}/${ID}/text.html`),
  exercisesHtml: bind(`${B}/work/render/10p/${edition}/${ID}/exercises.html`) });
}
save(`${O}/recovery.json`, { status: 'PASS', bindings, records,
  firstFailurePreserved: true, previousFigureBindingPassesReplayed: false,
  sourceIdentityHoldsPreserved: true, paidCalls: 0, parentImageOpens: 0 });
save(`${T}/tmp/d1816-d598-n25-native/result.json`, {
  status: 'NATIVE_PASS_DISPLAY_PENDING', course: ID, records,
  firstReview: bind(`${E}/first-review/report.json`),
  affectedReview: bind(`${E}/affected-review/report.json`),
  repair: bind(`${E}/affected-review/repair.json`),
  recovery: bind(`${O}/recovery.json`), firstFailure: bind(firstFailure),
  originalWrittenTasks: 0, standardsProduced: 0, choicesProduced: 0,
  sourcePagesAdded: 0, completeCoursesAdded: 0, sourceIdentityHoldsPreserved: true,
  paidCalls: 0, databaseWrites: false, productAcceptance: false, formalHandoff: false,
});
console.log(JSON.stringify({ course: ID, native: 'PASS', display: 'PENDING' }));
