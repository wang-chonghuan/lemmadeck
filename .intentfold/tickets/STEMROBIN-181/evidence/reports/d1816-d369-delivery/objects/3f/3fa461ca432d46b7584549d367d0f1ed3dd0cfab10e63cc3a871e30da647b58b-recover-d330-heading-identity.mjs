import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d330';
const O = `${T}/tmp/d1816-d330-n149-first-preparation`;
const id = 'phy10-c3-s4-n149';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return bind(file);
};
assert(!fs.existsSync(`${O}/prepared.json`));
const first = `${B}/root/10p/lessons/x3-149-中子的衰变-中微子的发现`;
const failure = save(`${O}/first-identity-failure.json`, {
  status: 'FIRST_ASSEMBLY_EXIT_ZERO_BUT_N149_STABLE_ID_UNCLAIMED',
  receipt: bind(`${T}/tmp/d1816-recovery/native/d330-n149-first-isolated-raw-assembly/receipt.json`),
  stdout: bind(`${T}/tmp/d1816-recovery/native/d330-n149-first-isolated-raw-assembly/stdout.txt`),
  originalOutput: ['lesson.json', 'lesson.md', 'exercises.json'].map(name => bind(`${first}/${name}`)),
  missingExpectedPath: `${B}/root/10p/lessons/${id}/lesson.json`,
  cause: 'Complete math token $149$ was not recognized as a section numeral after whole-heading emphasis removal.',
  firstFocusedFixtureFailure: bind(`${T}/tmp/d1816-recovery/native/d330-math-heading-focused-tests/receipt.json`),
  fixtureCorrection: 'Synthetic TOC chapter omitted kind=chapter and was incorrectly treated as another publishable card.',
  sourcePageEdits: 0, approvedStagesReplayed: false,
});
fs.mkdirSync(`${B}/first-unclaimed`, { recursive: true });
fs.renameSync(first, `${B}/first-unclaimed/x3-149-中子的衰变-中微子的发现`);
const native = (name, action, extra) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name,
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  action, '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`, ...extra,
], { stdio: 'inherit' });
native('d330-n149-heading-identity-affected-assembly', 'assemble',
  ['--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']);
const source = read(`${B}/root/10p/lessons/${id}/lesson.json`);
assert.equal(source.id, id);
assert.equal(source.exercise_count, 0);
assert.deepEqual(source.figures.map(row => row.id), ['fig-277']);
assert.deepEqual(source.prose, read(`${B}/first-unclaimed/x3-149-中子的衰变-中微子的发现/lesson.json`).prose);
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en'])
  native(`d330-n149-${edition === 'modern-us-neutral' ? 'zh' : 'en'}-first-adapt-prepare`,
    'adapt-prepare', ['--edition', edition, '--lesson', id]);
const prepared = save(`${O}/prepared.json`, {
  stage: 'D330', status: 'AFFECTED_IDENTITY_ASSEMBLY_AND_FIRST_BILINGUAL_PREPARE_PASS',
  input: bind(`${O}/input-freeze.json`), initialIdentityFailure: failure,
  root: `${B}/root`, work: `${B}/source-work`, id,
  source: bind(`${B}/root/10p/lessons/${id}/lesson.json`),
  exercises: bind(`${B}/root/10p/lessons/${id}/exercises.json`),
  proseEntries: source.prose.length, figures: source.figures,
  originalTasks: 0, neighboringRawCandidatesNotDelivered: true,
  sourcePagesAdded: 0, completeCoursesAdded: 0, newPaidCalls: 0, databaseWrites: false,
});
const file = `${T}/production-meter.json`;
const meter = read(file);
assert.equal(meter.currentCheckpoint.completeDeliveredCards, 142);
for (const [stage, directory] of [
  ['D320', 'd1816-d320-raw277-first-review'],
  ['D326', 'd1816-d326-source383-385-affected-review'],
]) {
  const collected = bind(`${T}/tmp/${directory}/parent-collected.json`);
  const row = read(collected.path);
  Object.assign(meter.currentResume1816[stage], {
    status: `${row.verdict}_COLLECTED_CLOSED`, report: row.report,
    reviewFreeze: row.reviewFreeze, parentCollected: collected,
    reviewerClosed: true, actualImageOpens: row.actualImageOpens,
  });
}
meter.currentResume1816.D330 = { status: 'AFFECTED_IDENTITY_ASSEMBLY_FIRST_ADAPT_PREPARE_PASS',
  prepared, root: `${B}/root`, work: `${B}/source-work`,
  sourcePagesAdded: 0, completeCoursesAdded: 0 };
Object.assign(meter.currentResume1816.D329, {
  status: 'SOLE_SOURCE380_ZERO_IMAGE_AFFECTED_REVIEW_ACTIVE',
  reviewer: '01a1fadd-d9d7-7771-bef2-2d8a8e28e351',
});
meter.currentResume1816.currentContinuation = '142 complete offline courses pushed. D320 RAW277 crop/SVG PASS and D326 seven corrections PASS collected/closed; strict audit equality failure preserved with metadata classification. D330 first assembly failed stable N149 identity; narrow math-heading identity repair recovered assembly and first bilingual preparation; original source/prose unchanged. D327 SOURCE386-388 and D329 SOURCE380 reviews active. Parent image opens23/24. No source/course counts added, paid calls, DB, publisher, deploy, merge, closure or full checks.';
meter.updatedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
console.log(JSON.stringify({ prepared }));
