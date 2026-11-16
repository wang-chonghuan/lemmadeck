import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const work = '.intentfold/tickets/STEMROBIN-181/tmp';
const id = 'phy9-c1-s6-t8';
const folder = `ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/lessons/${id}`;
const htmlPath = `.tmp/ld-s10y-lesson/render/9p/modern-us-neutral/${id}/answers.html`;
const correctionPath = `${work}/9p-t8-answer-display-correction.json`;
const freezePath = `${work}/9p-t8-answer-display-correction-freeze.json`;
const evidence = `${work}/d016-answer-display`;
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const bind = async file => ({
  path: file, sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const freeze = await read(freezePath);
assert.equal(freeze.status, 'frozen-display-only-correction');
assert.deepEqual(await bind(correctionPath), freeze.correction);
const originalGate = await read(`${work}/9p-t8-answer-review.json`);
assert.deepEqual(await bind(originalGate.bindings.draft.path), originalGate.bindings.draft);
const before = await read(`${folder}/answer-keys.json`);
const corrected = await read(correctionPath);
const changed = [];
assert.equal(before.answers.length, corrected.answers.length);
for (const [index, answer] of corrected.answers.entries()) {
  const previous = before.answers[index];
  assert.deepEqual({ ...answer, displayAnswer: previous.displayAnswer }, previous);
  if (answer.displayAnswer !== previous.displayAnswer) changed.push(answer.exercise);
}
assert.deepEqual({ ...corrected, answers: before.answers }, before);
assert.deepEqual(changed, ['5', '6', '8', '9', '10', '11']);
let html = await fs.readFile(htmlPath, 'utf8');
const initialResult = await read(`${work}/offline-batch2/result-phy9-c1-s6-n54--phy9-c1-s6-t8--phy9-c1-s7-n56--phy9-c1-s7-n57.json`);
for (const surface of initialResult.results.filter(item => item.id === id && item.surface === 'answers')) {
  assert.equal((await bind(htmlPath)).sha256, surface.sourceHtml.sha256);
  assert.equal((await bind(surface.screenshot)).sha256, surface.screenshotSha256);
}
const failedReport = await read(`${work}/d016-written-screenshot-review.json`);
assert.equal(failedReport.status, 'fail');
await fs.mkdir(evidence, { recursive: true });
for (const [source, name] of [
  [htmlPath, 'before.answers.html'],
  [`${folder}/answer-keys.json`, 'before.answer-keys.json'],
  [`${folder}/answer-keys.audit.json`, 'before.answer-keys.audit.json'],
]) {
  await fs.copyFile(source, `${evidence}/${name}`, fs.constants.COPYFILE_EXCL);
}
for (const number of changed) {
  const index = Number(number) - 1;
  const oldFragment = choiceHtml(before.answers[index].displayAnswer);
  const newFragment = choiceHtml(corrected.answers[index].displayAnswer);
  assert.equal(html.split(oldFragment).length, 2, `Nonunique answer fragment ${number}`);
  html = html.replace(oldFragment, newFragment);
}
await fs.copyFile(correctionPath, `${folder}/answer-keys.json`);
const command = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', '--book', '9p',
  '--edition', 'modern-us-neutral', '--lesson', id,
];
const output = execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', command, { encoding: 'utf8' });
process.stdout.write(output);
assert.deepEqual(await read(`${folder}/answer-keys.json`), corrected);
await fs.writeFile(htmlPath, html);
await fs.copyFile(htmlPath, `${evidence}/corrected.answers.html`, fs.constants.COPYFILE_EXCL);
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const { chromium } = createRequire(path.resolve('app/package.json'))('playwright');
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(`${evidence}/corrected.answers.html`)).href);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('li.ex').count(), 11);
    assert.equal(await page.locator('details[open]').count(), 11);
    const metrics = await page.evaluate(() => ({
      heading: document.querySelector('h1').textContent,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      formulaErrors: document.querySelectorAll('.err,.sr-tex-err,.tex-err,.katex-error').length,
      clippedAnswerMath: [...document.querySelectorAll('details .sr-nb')]
        .filter(element => element.scrollWidth > element.clientWidth + 1)
        .map(element => element.querySelector('annotation')?.textContent),
      images: [...document.images].map(image => ({
        complete: image.complete, naturalWidth: image.naturalWidth,
      })),
    }));
    assert.equal(metrics.overflow, false);
    assert.equal(metrics.formulaErrors, 0);
    assert.deepEqual(metrics.clippedAnswerMath, [], 'A standard-answer formula is still clipped');
    assert.ok(metrics.images.every(image => image.complete && image.naturalWidth > 0));
    assert.deepEqual(errors, []);
    const screenshot = `${evidence}/${id}-answers-${viewport.width}-corrected.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({
      id, surface: 'answers', viewport, metrics, screenshot,
      screenshotSha256: (await bind(screenshot)).sha256,
      sourceHtml: await bind(`${evidence}/corrected.answers.html`),
    });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(`${work}/d016-answer-display-finalization.json`, JSON.stringify({
  ticket: 'STEMROBIN-181', status: 'pass', changedExercises: changed,
  originalAnswerGate: await bind(`${work}/9p-t8-answer-review.json`),
  originalDisplayFailure: await bind(`${work}/d016-written-screenshot-review.json`),
  frozenCorrection: await bind(freezePath), correction: await bind(correctionPath),
  before: {
    html: await bind(`${evidence}/before.answers.html`),
    answerKeys: await bind(`${evidence}/before.answer-keys.json`),
    audit: await bind(`${evidence}/before.answer-keys.audit.json`),
  },
  current: {
    html: await bind(htmlPath), answerKeys: await bind(`${folder}/answer-keys.json`),
    audit: await bind(`${folder}/answer-keys.audit.json`),
  },
  nativeFinalization: { command, output },
  semanticFieldsUnchanged: true, newIndependentMathematicsGate: false,
  scope: 'Only six displayAnswer formula chains split; all other answer fields and all other HTML bytes preserved. Two affected answer surfaces checked, no other batch surface rerun.',
  results,
  browser: { headless: true, isolated: true, userProfileUsed: false, htmlReportAutoOpen: false },
}, null, 2) + '\n', { flag: 'wx' });
console.log('Affected answer display: desktop/mobile PASS, no clipped math atoms.');
