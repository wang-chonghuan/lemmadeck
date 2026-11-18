import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, folder = `${base}/d629-n76-native-contract-repaired`;
const card = 'phy10-c2-s2-n76';
assert.equal(await exists(folder), false);
const prepared = await read(`${base}/d581-n76-first-source-preparation/manifest.json`);
const repairPath = `${base}/d627-n76-first-native-contract-repair/report.json`;
await verify(repairPath, 'dbcf48420766e764921657a7ad5fdbaf4faf062643212b04dd6dfac334599e99');
const repair = await read(repairPath);
const affectedPath = `${base}/d628-n76-first-native-contract-affected-review/report.json`;
const affected = await read(affectedPath);
assert.equal(affected.SCI, 'PASS');
assert.equal(affected.ZHEN, 'PASS');
const inputs = await Promise.all([repairPath, affectedPath,
  `${base}/d628-n76-first-native-contract-affected-review/review-freeze.json`,
  `${base}/d626-n76-first-bilingual-native/failure-freeze.json`,
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tests/test_dotted_figure_reference.py',
].map(bind));
for (const record of repair.outputs) await verify(record.path, record.sha256);
const figureInputs = [];
for (const number of [177, 178, 179, 180]) {
  const figure = `fig-${number}`;
  const reviewer = number < 179 ? 'd611-n76-fig177178-first-independent-review' : 'd614-n76-fig179180-first-independent-review';
  const reviewPath = `${base}/${reviewer}/${figure}.review.json`;
  const review = await read(reviewPath);
  assert.equal(review.schema, 'ld-s10y-image/review@1');
  assert.equal(review.status, 'pass');
  for (const record of [review.source, review.spec, review.render, review.outputs.svg]) {
    await verify(record.path, record.sha256);
    inputs.push(record);
  }
  inputs.push(await bind(reviewPath));
  figureInputs.push({ figure, reviewPath, review });
}
const runs = [], outputs = [], rebindings = [];
async function run(locale, action, rawRoot, work, own) {
  const command = [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
    '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
    '--root', absolute(rawRoot), '--work', absolute(work),
  ];
  await immutableWrite(`${own}/commands/${action}.started.json`, serialize({ command, invocationsAuthorized: 1 }));
  const result = spawnSync(command[0], command.slice(1), {
    cwd: root, encoding: 'utf8', timeout: 120000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${own}/commands/${action}.receipt.json`;
  await immutableWrite(receipt, serialize({
    command, invocations: 1, exitCode: result.status, signal: result.signal,
    error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr,
  }));
  runs.push({ locale, action, receipt: await bind(receipt), exitCode: result.status });
  if (result.status !== 0) {
    await immutableWrite(`${folder}/native-failure.json`, serialize({
      ticket: 'STEMROBIN-181', card, locale, action, runs, inputs,
      previousFAILPreserved: true, automaticRetry: false, completeCard: false,
    }));
    throw new Error(`${locale}/${action}: ${result.stdout || result.stderr}`);
  }
}
for (const locale of ['zh', 'en']) {
  const own = `${folder}/${locale}`, rawRoot = `${own}/root`, work = `${own}/work`;
  for (const file of await walk(`${prepared.rawRoot}/10p`)) {
    await immutableWrite(`${rawRoot}/10p/${path.relative(`${prepared.rawRoot}/10p`, file)}`, await bytes(file));
  }
  const edition = `${rawRoot}/10p/editions/modern-us-neutral`;
  const candidate = `${base}/d627-n76-first-native-contract-repair/candidate/${locale}`;
  const templates = `${work}/adapt/10p/modern-us-neutral/lessons/${card}`;
  for (const name of ['lesson.template.json', 'exercises.template.json']) {
    inputs.push(await bind(`${candidate}/${name}`));
    await immutableWrite(`${templates}/${name}`, await bytes(`${candidate}/${name}`));
  }
  const figures = await read(`${candidate}/figures.template.json`);
  for (const input of figureInputs) {
    const { figure, review } = input;
    const specPath = `${edition}/figures/${figure}.spec.json`;
    const svgPath = `${edition}/figures/${figure}.svg`;
    const renderPath = `${edition}/figures/${figure}.render.json`;
    const reviewPath = `${edition}/figures/${figure}.review.json`;
    await immutableWrite(specPath, await bytes(review.spec.path));
    await immutableWrite(svgPath, await bytes(review.outputs.svg.path));
    const producer = await read(review.render.path);
    producer.spec.path = specPath;
    producer.output.svg.path = svgPath;
    await immutableWrite(renderPath, serialize(producer));
    const rebound = structuredClone(review);
    rebound.spec.path = specPath;
    rebound.render = await bind(renderPath);
    rebound.outputs.svg.path = svgPath;
    await immutableWrite(reviewPath, serialize(rebound));
    rebindings.push({
      locale, figure, originalReview: await bind(input.reviewPath),
      reboundReview: await bind(reviewPath), specBytesUnchanged: true, svgBytesUnchanged: true,
      reviewedAtUnchanged: true, newFigureRenders: 0,
    });
    const entry = figures.figures.find(row => row.id === figure);
    assert.ok(entry);
    for (const key of ['png', 'artwork', 'generation', 'brief_status', 'brief_limits']) delete entry[key];
    Object.assign(entry, {
      spec: `figures/${figure}.spec.json`, svg: `figures/${figure}.svg`,
      render: `figures/${figure}.render.json`, review: `figures/${figure}.review.json`,
      changes: ['deterministic'],
    });
  }
  await immutableWrite(`${templates}/figures.template.json`, serialize(figures));
  await run(locale, 'adapt-finalize', rawRoot, work, own);
  const lessonFolder = `${edition}/lessons/${card}`;
  const audit = await read(`${lessonFolder}/adaptation.audit.json`);
  assert.equal(audit.status, 'pass');
  assert.equal(audit.exercises, 0);
  assert.equal(audit.figures, 4);
  let displayRoot = rawRoot, displayMapping = null;
  if (locale === 'en') {
    const nativeLesson = await read(`${lessonFolder}/lesson.json`);
    const displayLesson = structuredClone(nativeLesson);
    const titles = repair.titleMappings.find(row => row.locale === 'en');
    displayLesson.title = titles.displayTitle;
    displayLesson.printed_title = titles.displayPrintedTitle;
    const restore = structuredClone(displayLesson);
    restore.title = nativeLesson.title;
    restore.printed_title = nativeLesson.printed_title;
    assert.deepEqual(restore, nativeLesson);
    displayRoot = `${own}/display-root`;
    const displayEdition = `${displayRoot}/10p/editions/modern-us-neutral`;
    for (const file of await walk(edition)) {
      const suffix = path.relative(edition, file);
      await immutableWrite(`${displayEdition}/${suffix}`, await bytes(file));
    }
    const displayPath = `${displayEdition}/lessons/${card}/display-lesson.json`;
    await immutableWrite(displayPath, serialize(displayLesson));
    const nativePath = `${displayEdition}/lessons/${card}/lesson.json`;
    await fs.rename(absolute(nativePath), absolute(`${displayEdition}/lessons/${card}/native-lesson.json`));
    await fs.rename(absolute(displayPath), absolute(nativePath));
    displayMapping = {
      native: await bind(`${lessonFolder}/lesson.json`), display: await bind(nativePath),
      titleOnly: true, sourceAndProseUnchanged: true, titles,
    };
  }
  await run(locale, 'render', displayRoot, work, own);
  outputs.push({
    locale, root: rawRoot, displayRoot, work, displayMapping,
    nativeFiles: await Promise.all((await walk(lessonFolder)).map(bind)),
    html: await Promise.all((await walk(`${work}/render/10p/modern-us-neutral`))
      .filter(file => file.endsWith('.html')).map(bind)),
  });
}
for (const record of inputs) await verify(record.path, record.sha256);
await immutableWrite(`${folder}/report.json`, serialize({
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'BILINGUAL-NATIVE-PASS-FIRST-WHOLE-CARD-DISPLAY-PENDING',
  inputs, outputs, runs, rebindings, SCI: 'PASS-EFFECTIVE', ZHEN: 'PASS-EFFECTIVE',
  FIG: 'FIRST-INDEPENDENT-FOUR-PASS-REUSED', native: 'PASS',
  DISPLAY: 'PENDING-FIRST-WHOLE-CARD', sourceQuestions: 0,
  forcedAnswersOrChoices: false, completeCard: false, newFigureRenders: 0,
  newParentImages: 0, parentImageCount: 24, oldBudgetReset: false,
  sourceMutation: false, canonicalEdits: false, historicalFAILHOLDPreserved: true,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) files.push(await bind(file));
await immutableWrite(`${folder}/native-freeze.json`, serialize({
  files, status: 'FROZEN-NATIVE-PASS-FULL-DISPLAY-PENDING',
}));
for (const file of [...files.map(row => row.path), `${folder}/native-freeze.json`]) {
  await fs.chmod(absolute(file), 0o444);
}
console.log(JSON.stringify({ report: await bind(`${folder}/report.json`),
  freeze: await bind(`${folder}/native-freeze.json`), runs }));
