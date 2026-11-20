import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const C = '.tmp/STEMROBIN-181/d1816-d138/root/9p';
const M = '.tmp/STEMROBIN-181/d1816-d138/choice-repo';
const O = `${T}/tmp/d1816-d138-t9-choice-author`;
const ID = 'phy9-c1-s3-t9';
const R = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const read = p => JSON.parse(fs.readFileSync(p));
const bind = p => {
  const bytes = fs.readFileSync(p);
  return { path: path.resolve(p), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
assert(!fs.existsSync(M));
assert(!fs.existsSync(O));
assert.equal(read(`${T}/tmp/d1816-d137-t9-figures-review/parent-collected.json`).reviewerClosed, true);
const native = read(`${T}/tmp/d1816-d138-t9-native/native-finalized.json`);
assert.equal(native.status, 'pass');
const copied = [];
const copy = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(source).sha256, bind(target).sha256);
  copied.push({ source: bind(source), mirror: bind(target) });
};
copy(`${C}/book.json`, `${M}/${R}/book.json`);
for (const name of ['lesson.json', 'exercises.json', 'figures.json']) {
  copy(`${C}/editions/modern-us-neutral/lessons/${ID}/${name}`,
    `${M}/${R}/editions/modern-us-neutral/lessons/${ID}/${name}`);
}
for (const figure of ['fig-24', 'fig-30']) {
  copy(`${C}/editions/modern-us-neutral/figures/${figure}.svg`,
    `${M}/${R}/editions/modern-us-neutral/figures/${figure}.svg`);
}
fs.mkdirSync(`${M}/.tmp/d138`, { recursive: true });
fs.mkdirSync(O, { recursive: true });
const nativeCall = (name, args) => {
  const call = spawnSync(process.execPath, [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name, 'python3',
    '.agents/skills/ld-s10y-choice/scripts/prepare.py', ...args,
  ], { cwd: repo, encoding: 'utf8' });
  if (call.status !== 0) throw new Error(`${name}\n${call.stdout}\n${call.stderr}`);
  return bind(`${T}/tmp/d1816-recovery/native/${name}/stdout.txt`);
};
const inspection = nativeCall('d138-t9-first-choice-inspect', [
  'inspect', '--repo', M, '--book', '9p', '--lesson', ID,
]);
assert.deepEqual(read(inspection.path).concept_candidates, []);
const seedPath = `${M}/.tmp/d138/seed.json`;
nativeCall('d138-t9-first-choice-seed', [
  'prepare', '--repo', M, '--book', '9p', '--lesson', ID,
  ...['1', '2', '3', '4', '5', '6'].flatMap(number => ['--exercise', number]),
  '--no-concepts', '--out', path.resolve(seedPath),
]);
const supplementSource = `${T}/tmp/d1816-d134-t9-text-review-input/source-only.json`;
const supplement = read(supplementSource).originalDefinitionParagraphs;
const supplementalDefinitionsPath = `${O}/source-definition-context.json`;
fs.writeFileSync(supplementalDefinitionsPath, JSON.stringify({
  role: 'ORIGINAL_PREREQUISITE_DEFINITIONS_NOT_SOLVED_EXAMPLES',
  source: bind(supplementSource), definitions: supplement,
  seedConceptSelection: 'Explicit no-concepts because T9 has no prose blocks; original n32 prerequisite definition remains separately bound.',
}, null, 2) + '\n', { flag: 'wx' });
const input = {
  batch: 'D138', role: 'FIRST_COMPLETE_T9_CHOICE_AUTHOR_INPUT',
  choiceRepo: path.resolve(M), seed: bind(seedPath), inspection, copied,
  definitions: bind(supplementalDefinitionsPath),
  originalPngs: ['fig-24', 'fig-30'].map(figure => bind(`${C}/figures/${figure}.png`)),
  sourceTasks: 6, imageOpensAuthorized: 8, optionsAuthored: 0,
  nativeFinalized: bind(`${T}/tmp/d1816-d138-t9-native/native-finalized.json`),
  authorSolutionStage: 'D136 pre-option text-only derivations may be reused by the same author. Q2 still needs first actual-figure solving.',
  answerFilesConsulted: false, independentApproval: false,
  promotionAuthorized: false, completeCoursesAdded: 0,
};
const freezePath = `${O}/input-freeze.json`;
fs.writeFileSync(freezePath, JSON.stringify(input, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ batch: 'D138', inputFreeze: bind(freezePath),
  seed: input.seed, choiceRepo: input.choiceRepo, imagesOpened: 0 }));
