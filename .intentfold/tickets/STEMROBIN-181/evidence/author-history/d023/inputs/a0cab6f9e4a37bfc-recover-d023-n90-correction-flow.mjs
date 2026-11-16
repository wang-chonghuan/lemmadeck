import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { ticket, book, read, bytes, bind, exists, immutableWrite } from './retain-d016-evidence.mjs';

const require = createRequire(import.meta.url);
const { proseOutline } = require('../../../../.claude/skills/ld-s10y-lesson/tools/htmlfrag.js');
const tmp = `${ticket}/tmp`;
const work = `${tmp}/d023-sci-correction/n90`;
const output = `${tmp}/9p-n90-prose-correction-freeze.json`;
assert.ok(!await exists(output) && !await exists(`${work}/flow-recovery-started.json`));
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/phy9-c2-s3-n90/lesson.template.json';
const folder = lessonPath.slice(0, lessonPath.lastIndexOf('/'));
const current = await read(lessonPath);
const freezePath = `${tmp}/9p-n90-prose-freeze.json`;
const freeze = await read(freezePath);
const beforePath = freeze.templates.find(row => row.active.path.endsWith('/lesson.template.json')).snapshot.path;
const before = await read(beforePath);
const checkPath = `${work}/native-text-check.json`;
assert.deepEqual((await read(checkPath)).errors, []);
await immutableWrite(`${work}/flow-failure.json`, `${JSON.stringify({
  command: ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath],
  exitCode: 2, stderr: 'section_breaks[4] must identify exactly one adjacent paragraph pair; matched 0',
  precedingNormalizeAndValidateText: 'Succeeded once; results reused, not rerun.',
}, null, 2)}\n`);
const outline = proseOutline(current.prose);
const affected = current.section_breaks.find(row => row.before === before.prose[17].text);
assert.ok(affected);
const candidates = outline.filter((row, index) => index > 0 && outline[index - 1].text === affected.before);
assert.equal(candidates.length, 1);
const oldAnchor = structuredClone(affected);
affected.after = candidates[0].text;
assert.ok(affected.after.includes('绕过原本的用电器'));
await immutableWrite(`${work}/flow-recovery-started.json`, `${JSON.stringify({
  current: await bind(lessonPath), oldAnchor, newAnchor: affected,
  paragraphDerivation: await bind('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  scope: 'One stale after-anchor updated from actual native proseOutline; no prose/number/source change.',
}, null, 2)}\n`);
await fs.writeFile(lessonPath, `${JSON.stringify(current, null, 2)}\n`);
const flow = execFileSync(process.execPath,
  ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', lessonPath], { encoding: 'utf8' });
await immutableWrite(`${work}/native-flow.json`, flow);
await immutableWrite(`${work}/lesson.template.json`, await bytes(lessonPath));
const reviewPath = `${tmp}/9p-n90-science-review.json`;
const review = await read(reviewPath);
await immutableWrite(output, `${JSON.stringify({
  ticket: 'STEMROBIN-181', batch: 'D023', lesson: 'phy9-c2-s3-n90',
  status: 'affected-prose-correction-frozen-awaiting-independent-SCI',
  changedBlocks: [12, 18], findings: review.findings.map(row => row.id),
  before: { freeze: await bind(freezePath), review: await bind(reviewPath), lesson: await bind(beforePath) },
  bindings: {
    lessonTemplate: await bind(lessonPath),
    exercisesTemplate: await bind(`${folder}/exercises.template.json`),
    figuresTemplate: await bind(`${folder}/figures.template.json`),
    sourceLesson: await bind(`${book}/lessons/phy9-c2-s3-n90/lesson.json`),
    sourceExercises: await bind(`${book}/lessons/phy9-c2-s3-n90/exercises.json`),
    correctedSnapshot: await bind(`${work}/lesson.template.json`),
    nativeText: await bind(checkPath), nativeFlow: await bind(`${work}/native-flow.json`),
    nativeHelper: await bind(`${tmp}/d021-n83-n84-native-text-20261116-a.py`),
    correctionHelper: await bind(`${tmp}/freeze-d023-n90-science-correction.mjs`),
    flowRecoveryHelper: await bind(`${tmp}/recover-d023-n90-correction-flow.mjs`),
    flowFailure: await bind(`${work}/flow-failure.json`),
    flowRecovery: await bind(`${work}/flow-recovery-started.json`),
  },
  delta: [12, 18].map(index => ({ block: index, before: before.prose[index].text, after: current.prose[index].text })),
  historicalNumericCorrection: current.prose[12].numeric_changes,
  sectionAnchorCorrection: { before: oldAnchor, current: affected, actualParserDerived: true },
  externalEvidenceReused: review.externalEvidence,
  faithfulSourceAndFormulaAndOtherBlocksAndTasksAndFiguresUnchanged: true,
  originalSCIObservationsReused: true, independentReviewCalls: 0,
  correctionNative: { normalize: 1, validateText: 1, failedFlow: 1, affectedAnchorRecoveryFlow: 1 },
  imageOpens: 0, sourceGateReplays: 0, geometryRepairs: 0,
}, null, 2)}\n`);
console.log(JSON.stringify(await bind(output)));
