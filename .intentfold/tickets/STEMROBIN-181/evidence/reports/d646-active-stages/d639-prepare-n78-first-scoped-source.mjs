import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, folder = `${base}/d639-n78-first-source-preparation`;
assert.equal(await exists(folder), false);
const card = 'phy10-c2-s2-n78';
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const meter = await read(`${ticket}/production-meter.json`);
assert.equal(meter.activeHumanDirection.nextSourceCheckpoints.n78.SOURCE, 'PASS-EFFECTIVE-COMPOSED-206209');
const inputs = [], projections = [];
for (let page = 206; page <= 209; page++) {
  const id = String(page).padStart(4, '0');
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const source = `${canonical}/pages/${id}/${name}`;
    inputs.push(await bind(source));
    const data = await bytes(source);
    await immutableWrite(`${folder}/full-source/10p/pages/${id}/${name}`, data);
    let view = data;
    if (name === 'page.json') {
      const projected = JSON.parse(data);
      if (page === 206) {
        assert.equal(projected.blocks[11].kind, 'h3');
        assert.match(projected.blocks[11].lines.join(''), /^78\.\s/u);
        projected.blocks = projected.blocks.slice(11);
        projections.push({ page, firstSourceRef: 'p0206#12', removedN77Only: true,
          scopedNativeRefOffset: 11 });
      }
      if (page === 209) {
        assert.equal(projected.blocks[3].kind, 'h3');
        assert.match(projected.blocks[3].lines.join(''), /^79\.\s/u);
        projected.blocks = projected.blocks.slice(0, 4);
        projections.push({ page, terminalBodyRef: 'p0209#3', retainedBoundaryHeading: 'p0209#4',
          excludedIncompleteN79: true });
      }
      view = Buffer.from(serialize(projected));
    }
    await immutableWrite(`${folder}/root/10p/pages/${id}/${name}`, view);
  }
}
for (const id of ['181', '182', '183']) {
  for (const extension of ['png', 'svg']) {
    const file = `${canonical}/figures/fig-${id}.${extension}`;
    inputs.push(await bind(file));
    await immutableWrite(`${folder}/root/10p/figures/fig-${id}.${extension}`, await bytes(file));
  }
}
await immutableWrite(`${folder}/started.json`, serialize({
  ticket: 'STEMROBIN-181', card, inputs, projections,
  sourceAuthority: meter.activeHumanDirection.nextSourceCheckpoints.n78,
  originalFAILHOLDPreserved: true, canonicalSourceWordsChanged: false, imageOpens: 0,
}));
const common = ['--book', '10p', '--root', absolute(`${folder}/root`), '--work', absolute(`${folder}/work`)];
for (const [stage, args] of [
  ['assemble', [...common, '--toc', 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json']],
  ['adapt-prepare', [...common, '--edition', 'modern-us-neutral', '--lesson', card]],
]) {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', stage, ...args];
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await immutableWrite(`${folder}/${stage}.receipt.json`, serialize({
    command, invocations: 1, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }));
  assert.equal(result.status, 0, `${stage}: ${result.stdout}\n${result.stderr}`);
}
const lessonPath = `${folder}/root/10p/lessons/${card}/lesson.json`;
const exercisesPath = `${folder}/root/10p/lessons/${card}/exercises.json`;
const lesson = await read(lessonPath), exercises = await read(exercisesPath);
assert.equal(lesson.card_id, card);
assert.equal(exercises.exercises.length, 0);
assert.deepEqual([...lesson.figures].sort(), ['fig-181', 'fig-182', 'fig-183']);
assert.ok(lesson.prose.every(block => !block.source_refs.some(ref => /^p0209#[4-9]$/.test(ref))));
for (const input of inputs) await verify(input.path, input.sha256);
await immutableWrite(`${folder}/manifest.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-SCOPED-SOURCE-CLOSED-MODERN-TEXT-PENDING',
  inputs, projections, sourceLesson: await bind(lessonPath), sourceExercises: await bind(exercisesPath),
  rawRoot: `${folder}/root`, work: `${folder}/work`,
  templateDirectory: `${folder}/work/adapt/10p/modern-us-neutral/lessons/${card}`,
  sourceQuestions: 0, proseBlocks: lesson.prose.length, figures: lesson.figures,
  originalPreauthorBaseline: await bind(`${base}/d619-n78-preauthor-source206207-requirements/source-requirements.json`),
  sourceRefMapping: 'Scoped source206 refs #1,#2,#3 correspond to canonical #12,#13,#14; footer #4 maps #15. Other refs unchanged.',
  sourcePagesAdded: 0, completeCardsAdded: 0, incompleteN79Excluded: true,
  SCI: 'NOT-AUTHORED', ZHEN: 'NOT-AUTHORED', FIG: 'PENDING-FIRST-MODERN', DISPLAY: 'NOT-RUN',
  imageOpens: 0, parentImageCount: 24, oldBudgetReset: false, historicalFAILHOLDPreserved: true,
  DBMergeDeploy: false,
}));
console.log(JSON.stringify({ manifest: await bind(`${folder}/manifest.json`),
  proseBlocks: lesson.prose.length, sourceQuestions: 0, figures: lesson.figures }));
