import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  root, ticket, absolute, bytes, read, bind, verify, exists, immutableWrite, walk,
} from './retain-d016-evidence.mjs';

assert.deepEqual(process.argv.slice(2), ['--execute']);
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
const base = `${ticket}/tmp`, folder = `${base}/d626-n76-first-bilingual-native`;
const card = 'phy10-c2-s2-n76';
assert.equal(await exists(folder), false);
const prepared = await read(`${base}/d581-n76-first-source-preparation/manifest.json`);
const inputs = [];
for (const [file, sha256] of [
  [`${base}/d598-n76-r08-first-affected-text-review/report.json`, '4a5e5bfdee7093f900968599a2363a571c6f1e66700d0fd03bac195d03e33526'],
  [`${base}/d611-n76-fig177178-first-independent-review/report.json`, 'bf5e26ba66b2cf23802b0ac5bd5ea170c3e948ae0b39ee80306770d0fe9525d9'],
  [`${base}/d614-n76-fig179180-first-independent-review/report.json`, '3c8487745771f9341acc4f0a1d27826ac824818502da25168bd0f0ff0ef1e0ec'],
]) {
  await verify(file, sha256);
  inputs.push(await bind(file));
}
const textReview = await read(inputs[0].path);
assert.equal(textReview.SCI, 'PASS');
assert.equal(textReview.ZHEN, 'PASS');
const figureInputs = [];
for (const number of [177, 178, 179, 180]) {
  const figure = `fig-${number}`;
  const reviewer = number < 179 ? 'd611-n76-fig177178-first-independent-review' : 'd614-n76-fig179180-first-independent-review';
  const reviewPath = `${base}/${reviewer}/${figure}.review.json`;
  const review = await read(reviewPath);
  assert.equal(review.schema, 'ld-s10y-image/review@1');
  assert.equal(review.status, 'pass');
  assert.equal(review.figure, figure);
  for (const record of [review.source, review.spec, review.render, review.outputs.svg]) {
    await verify(record.path, record.sha256);
    inputs.push(record);
  }
  inputs.push(await bind(reviewPath));
  figureInputs.push({ figure, reviewPath, review });
}
const runs = [], outputs = [], rebindings = [];
for (const locale of ['zh', 'en']) {
  const own = `${folder}/${locale}`, rawRoot = `${own}/root`, work = `${own}/work`;
  for (const file of await walk(`${prepared.rawRoot}/10p`)) {
    const destination = `${rawRoot}/10p/${path.relative(`${prepared.rawRoot}/10p`, file)}`;
    await immutableWrite(destination, await bytes(file));
  }
  const edition = `${rawRoot}/10p/editions/modern-us-neutral`;
  const candidate = `${base}/d597-n76-r08-first-text-repair/candidate/${locale}`;
  const templates = `${work}/adapt/10p/modern-us-neutral/lessons/${card}`;
  for (const name of ['lesson.template.json', 'exercises.template.json']) {
    const file = `${candidate}/${name}`;
    inputs.push(await bind(file));
    await immutableWrite(`${templates}/${name}`, await bytes(file));
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
    const originalRender = await read(review.render.path), producer = structuredClone(originalRender);
    producer.spec.path = specPath;
    producer.output.svg.path = svgPath;
    assert.equal(producer.spec.sha256, (await bind(specPath)).sha256);
    assert.equal(producer.output.svg.sha256, (await bind(svgPath)).sha256);
    await immutableWrite(renderPath, serialize(producer));
    const rebound = structuredClone(review);
    rebound.spec.path = specPath;
    rebound.render = await bind(renderPath);
    rebound.outputs.svg.path = svgPath;
    await immutableWrite(reviewPath, serialize(rebound));
    rebindings.push({
      locale, figure, kind: 'PATH-ONLY-RELOCATION-OF-EXACT-FIRST-INDEPENDENT-PASS',
      originalReview: await bind(input.reviewPath), reboundReview: await bind(reviewPath),
      originalRender: review.render, reboundRender: await bind(renderPath),
      specBytesUnchanged: true, svgBytesUnchanged: true, reviewedAtUnchanged: true,
      newNativeFigureRenders: 0, newSemanticReviews: 0,
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
  for (const action of ['adapt-finalize', 'render']) {
    const command = [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
      '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
      '--root', absolute(rawRoot), '--work', absolute(work),
    ];
    const before = [];
    for (const file of await walk(own)) before.push(await bind(file));
    const started = `${own}/commands/${action}.started.json`;
    await immutableWrite(started, serialize({ command, invocationsAuthorized: 1, before }));
    const result = spawnSync(command[0], command.slice(1), {
      cwd: root, encoding: 'utf8', timeout: 120000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });
    const after = [];
    for (const file of await walk(own)) after.push(await bind(file));
    const receipt = `${own}/commands/${action}.receipt.json`;
    await immutableWrite(receipt, serialize({
      command, invocations: 1, exitCode: result.status, signal: result.signal,
      error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr,
      before, after,
    }));
    runs.push({ locale, action, receipt: await bind(receipt), exitCode: result.status });
    if (result.status !== 0) {
      await immutableWrite(`${folder}/first-native-failure.json`, serialize({
        ticket: 'STEMROBIN-181', card, locale, action, receipt: await bind(receipt),
        inputs, sourceFilesPreserved: true, partialOutputsPreserved: true,
        automaticRetry: false, completeCard: false,
      }));
      throw new Error(`${locale}/${action} FIRST FAIL retained: ${result.stderr || result.stdout}`);
    }
  }
  const auditPath = `${edition}/lessons/${card}/adaptation.audit.json`;
  const audit = await read(auditPath);
  assert.equal(audit.status, 'pass');
  assert.equal(audit.exercises, 0);
  assert.equal(audit.figures, 4);
  const nativeFiles = [];
  for (const file of await walk(`${edition}/lessons/${card}`)) nativeFiles.push(await bind(file));
  const renderFolder = `${work}/render/10p/modern-us-neutral`;
  const htmlFiles = (await walk(renderFolder)).filter(file => file.endsWith('.html'));
  assert.ok(htmlFiles.length > 0);
  outputs.push({ locale, root: rawRoot, work, nativeFiles, html: await Promise.all(htmlFiles.map(bind)) });
}
for (const record of inputs) await verify(record.path, record.sha256);
await immutableWrite(`${folder}/report.json`, serialize({
  schema: 'STEMROBIN-181/n76-first-bilingual-native@1',
  ticket: 'STEMROBIN-181', batch: 'D033', card,
  status: 'FIRST-BILINGUAL-ADAPT-FINALIZE-AND-RENDER-PASS-FULL-DISPLAY-PENDING',
  inputs, rebindings, runs, outputs,
  SCI: 'PASS-EFFECTIVE-REUSED', ZHEN: 'PASS-EFFECTIVE-REUSED',
  FIG: 'FIRST-INDEPENDENT-FOUR-PASS-REUSED', native: 'PASS', DISPLAY: 'PENDING-FIRST-WHOLE-CARD',
  sourceQuestions: 0, forcedChoicesOrAnswers: false, completeCard: false,
  newFigureRenders: 0, newParentImages: 0, parentImageCount: 24, oldBudgetReset: false,
  canonicalEdits: false, historicalFAILHOLDPreserved: true,
  newPaidGeneration: 0, newPermanentWorkersWorktreesBranches: 0, DBMergeDeploy: false,
}));
const files = [];
for (const file of await walk(folder)) files.push(await bind(file));
await immutableWrite(`${folder}/native-freeze.json`, serialize({
  schema: 'STEMROBIN-181/n76-native-freeze@1', files,
  status: 'FROZEN-NATIVE-PASS-NOT-WHOLE-CARD-DISPLAY-PASS',
}));
for (const file of [...files.map(row => row.path), `${folder}/native-freeze.json`]) await fs.chmod(absolute(file), 0o444);
console.log(JSON.stringify({ report: await bind(`${folder}/report.json`), freeze: await bind(`${folder}/native-freeze.json`), outputs }));
