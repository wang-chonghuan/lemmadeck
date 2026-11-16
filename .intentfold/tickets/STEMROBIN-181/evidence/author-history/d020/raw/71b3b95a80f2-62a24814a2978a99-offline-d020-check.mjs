import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { choiceHtml } from '../../../../.claude/skills/ld-s10y-lesson/tools/choice_html.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
delete process.env.PWDEBUG;
process.env.PLAYWRIGHT_HTML_OPEN = 'never';
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const selected = new Set(process.argv.slice(2).filter(arg => !['--resume', '--checkpoint-only'].includes(arg)));
const resume = process.argv.includes('--resume');
const checkpointOnly = process.argv.includes('--checkpoint-only');
const previous = new Set(['phy9-c1-s1-n1', 'phy9-c1-s1-n2', 'phy9-c1-s1-n3', 'phy9-c1-s1-n4']);
const evidence = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/offline-d020');
await fs.mkdir(evidence, { recursive: true });
const targets = [];
for (const book of ['9p', '10p']) {
  const edition = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts', book, 'editions/modern-us-neutral');
  const index = JSON.parse(await fs.readFile(path.join(edition, 'book.json'), 'utf8'));
  for (const entry of index.lessons) {
    const id = entry.card_id ?? entry.id ?? entry.lesson;
    if (selected.size ? !selected.has(id) : previous.has(id)) continue;
    const lessonDir = path.join(edition, 'lessons', id);
    targets.push({
      book, id,
      lesson: JSON.parse(await fs.readFile(path.join(lessonDir, 'lesson.json'), 'utf8')),
      exercises: JSON.parse(await fs.readFile(path.join(lessonDir, 'exercises.json'), 'utf8')),
      figures: JSON.parse(await fs.readFile(path.join(lessonDir, 'figures.json'), 'utf8')),
      edition,
      lessonDir,
    });
  }
}
assert.ok(targets.length, 'No finalized cards selected');
if (selected.size) assert.equal(targets.length, selected.size, 'A selected card is not finalized');
const resultName = selected.size
  ? `result-${[...selected].sort().join('--')}.json`
  : 'result.json';
const checkpointPath = path.join(evidence, resultName.replace(/^result/, 'checkpoint'));
const checkpoint = resume ? JSON.parse(await fs.readFile(checkpointPath, 'utf8')) : {};
const results = checkpoint.results ?? [];
const reusedSurfaceCount = results.length;
const fileHash = async file => createHash('sha256').update(await fs.readFile(path.resolve(root, file))).digest('hex');
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    for (const target of targets) {
      const surfaces = ['text', 'exercises'];
      if (await fs.access(path.join(target.lessonDir, 'choice-set/draft.json')).then(() => true, () => false)) {
        surfaces.push('choices', 'answers');
      }
      for (const surface of surfaces) {
        const retained = results.find(result => result.id === target.id && result.surface === surface && result.viewport.width === viewport.width);
        if (retained) {
          assert.equal(await fileHash(retained.sourceHtml.path), retained.sourceHtml.sha256, 'Retained HTML changed');
          assert.equal(await fileHash(retained.screenshot), retained.screenshotSha256, 'Retained screenshot changed');
          continue;
        }
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const file = path.join(root, '.tmp/ld-s10y-lesson/render', target.book, 'modern-us-neutral', target.id, `${surface}.html`);
        await page.goto(pathToFileURL(file).href);
        await page.evaluate(() => document.fonts.ready);
        await page.locator('h1').waitFor();
        const metrics = await page.evaluate(() => {
          const markdownText = element => {
            if (!element) return null;
            const clone = element.cloneNode(true);
            for (const formula of clone.querySelectorAll('.katex')) {
              const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
              if (!tex) throw new Error('Rendered formula has no source annotation');
              formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
            }
            return clone.textContent;
          };
          return {
          heading: document.querySelector('h1')?.textContent,
          bodyText: document.body.innerText,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          formulaErrors: document.querySelectorAll('.err,.sr-tex-err,.tex-err,.katex-error').length,
          clippedAnswerMath: [...document.querySelectorAll('details .sr-nb')]
            .filter(element => element.scrollWidth > element.clientWidth + 1)
            .map(element => element.querySelector('annotation')?.textContent),
          clippedChoiceMath: [...document.querySelectorAll('.options .sr-nb')]
            .filter(element => element.scrollWidth > element.clientWidth + 1)
            .map(element => element.querySelector('annotation')?.textContent),
          orphanQuotes: [...document.querySelectorAll('p.para')].filter(p => /^[”’」』]+$/.test(p.textContent.trim())).length,
          images: [...document.images].map(image => ({
            complete: image.complete, naturalWidth: image.naturalWidth,
            width: image.getBoundingClientRect().width,
            height: image.getBoundingClientRect().height,
          })),
          media: [...document.querySelectorAll('figure.fig')].map(figure => ({
            id: figure.id,
            width: figure.querySelector('.figure-media').getBoundingClientRect().width,
            texts: [...figure.querySelectorAll('svg text')].map(text => {
              const matrix = text.getScreenCTM();
              return {
                text: text.textContent,
                size: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(matrix.a, matrix.b),
              };
            }),
          })),
          breaks: [...document.querySelectorAll('p.para.section')].map(line => {
            let previous = line.previousElementSibling;
            while (previous?.matches('figure.fig,.figcap')) previous = previous.previousElementSibling;
            if (!previous?.matches('p.para')) throw new Error('Semantic break has no preceding prose paragraph');
            return { before: markdownText(previous), after: markdownText(line) };
          }),
          choiceStems: [...document.querySelectorAll('li.ex > .body')].map(body => {
            const stem = body.cloneNode(true);
            stem.querySelector('.options')?.remove();
            for (const figure of stem.querySelectorAll('figure.fig')) figure.remove();
            return markdownText(stem);
          }),
          };
        });
        assert.ok(metrics.heading.includes(target.lesson.title), target.id);
        assert.equal(metrics.overflow, false, `${target.id}/${surface}: page overflow`);
        assert.equal(metrics.formulaErrors, 0, `${target.id}/${surface}: formula error`);
        assert.equal(metrics.orphanQuotes, 0, `${target.id}/${surface}: orphan closing quote`);
        assert.deepEqual(errors, [], `${target.id}/${surface}: browser errors`);
        const blocks = surface === 'text' ? target.lesson.prose : target.exercises.exercises;
        if (surface === 'choices') {
          assert.deepEqual(metrics.clippedChoiceMath, [], `${target.id}: clipped choice formula`);
          const draft = JSON.parse(await fs.readFile(path.join(target.lessonDir, 'choice-set/draft.json'), 'utf8'));
          assert.equal(await page.locator('li.ex').count(), draft.questions.length, `${target.id}: missing choice`);
          assert.equal(await page.locator('.option').count(),
            draft.questions.reduce((count, question) => count + question.view.options.length, 0));
          assert.equal(await page.locator('input:not([disabled])').count(), 0);
          const expectedStems = await page.evaluate(html => html.map(value => {
            const stem = document.createElement('div');
            stem.innerHTML = value;
            for (const formula of stem.querySelectorAll('.katex')) {
              const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
              if (!tex) throw new Error('Expected formula has no source annotation');
              formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
            }
            return stem.textContent;
          }), draft.questions.map(question => choiceHtml(question.view.stem)));
          const normalizeStem = text => text.replace(/\s+/g, '');
          assert.deepEqual(metrics.choiceStems.map(normalizeStem), expectedStems.map(normalizeStem),
            `${target.id}: rendered choice stem changed`);
        }
        if (surface === 'answers') {
          assert.equal(await page.locator('li.ex').count(), target.exercises.count);
          assert.equal(await page.locator('details[open]').count(), target.exercises.count);
          assert.deepEqual(metrics.clippedAnswerMath, [], `${target.id}: clipped standard-answer formula`);
        }
        if (surface === 'exercises') {
          const count = await page.locator('li.ex').count();
          assert.equal(count, target.exercises.count, `${target.id}: missing written task`);
        }
        const choiceDraft = surface === 'choices'
          ? JSON.parse(await fs.readFile(path.join(target.lessonDir, 'choice-set/draft.json'), 'utf8'))
          : null;
        const refs = surface === 'choices'
          ? choiceDraft.questions.flatMap(question => [
            ...question.view.figure_ids,
            ...question.view.options.flatMap(option => option.figure_ids),
          ])
          : surface === 'text'
          ? blocks.flatMap(block => block.kind === 'fig' ? [block.id] : (block.figures ?? []).map(figure => figure.id))
          : blocks.flatMap(block => block.figures.map(figure => figure.id));
        assert.equal(metrics.media.length, refs.length, `${target.id}/${surface}: missing figure`);
        assert.ok(metrics.images.every(image => image.complete && image.naturalWidth > 0 && image.width > 0));
        for (let index = 0; index < refs.length; index += 1) {
          const manifest = target.figures.figures.find(figure => figure.id === refs[index]);
          const spec = JSON.parse(await fs.readFile(path.join(target.edition, manifest.spec), 'utf8'));
          const media = metrics.media[index];
          assert.equal(media.id, refs[index], `${target.id}: figure order mismatch`);
          assert.ok(media.width > 0, `${target.id}: blank figure`);
          assert.ok(media.texts.every(text => text.size >= spec.display.minTextPx),
            `${target.id}/${refs[index]}: text too small at actual media width ${media.width}`);
        }
        if (surface === 'text') {
          const normalize = text => text?.replace(/\s+/g, '');
          const boundaries = await page.evaluate(html => {
            const text = fragment => {
              const container = document.createElement('div');
              container.innerHTML = fragment;
              for (const formula of container.querySelectorAll('.katex')) {
                const tex = formula.querySelector('annotation[encoding="application/x-tex"]');
                if (!tex) throw new Error('Expected boundary has no math source annotation');
                formula.replaceWith(document.createTextNode(`$${tex.textContent}$`));
              }
              return container.textContent;
            };
            return html.map(boundary => ({
              before: text(boundary.before),
              after: text(boundary.after),
            }));
          }, (target.lesson.section_breaks ?? []).map(boundary => ({
            before: choiceHtml(boundary.before),
            after: choiceHtml(boundary.after),
          })));
          for (const boundary of boundaries) {
            assert.ok(metrics.breaks.some(line =>
              normalize(line.before) === normalize(boundary.before) &&
              normalize(line.after) === normalize(boundary.after)),
            `${target.id}: semantic break misplaced`);
          }
        }
        const scrollEnds = await page.evaluate(() => {
          const elements = [...document.querySelectorAll('.nb, figure.fig, li.ex .body')]
            .filter(element => element.scrollWidth > element.clientWidth + 1);
          return elements.map(element => {
            element.scrollLeft = element.scrollWidth;
            const result = {
              kind: element.tagName,
              tex: element.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? null,
              scrollWidth: element.scrollWidth, clientWidth: element.clientWidth,
              scrollLeft: element.scrollLeft,
              endReached: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
            };
            return result;
          });
        });
        assert.ok(scrollEnds.every(item => item.endReached), `${target.id}/${surface}: unreachable horizontal end`);
        if (scrollEnds.length) {
          const endScreenshot = path.join(evidence, `${target.id}-${surface}-${viewport.width}-scroll-end.png`);
          await page.screenshot({ path: endScreenshot, fullPage: true });
          metrics.scrollEndScreenshot = endScreenshot;
          metrics.scrollEndScreenshotSha256 = await fileHash(endScreenshot);
        }
        metrics.scrollEnds = scrollEnds;
        await page.evaluate(() => {
          for (const element of document.querySelectorAll('.nb, figure.fig, li.ex .body')) element.scrollLeft = 0;
          window.scrollTo(0, document.documentElement.scrollHeight);
          if (scrollY + innerHeight < document.documentElement.scrollHeight - 1) throw new Error('Page end unreachable');
          window.scrollTo(0, 0);
        });
        const screenshot = path.join(evidence, `${target.id}-${surface}-${viewport.width}.png`);
        await page.screenshot({ path: screenshot, fullPage: true });
        results.push({
          id: target.id, surface, viewport, metrics, screenshot,
          screenshotSha256: await fileHash(screenshot),
          sourceHtml: { path: file, sha256: await fileHash(file) },
        });
        await fs.writeFile(checkpointPath, JSON.stringify({
          ...checkpoint, status: 'incomplete', results,
        }, null, 2) + '\n');
        await page.close();
      }
    }
    await context.close();
  }
} catch (error) {
  await fs.writeFile(checkpointPath, JSON.stringify({
    ...checkpoint, status: 'fail', error: error.message, results,
  }, null, 2) + '\n');
  throw error;
} finally {
  await browser.close();
}
if (checkpointOnly) {
  console.log(`INCOMPLETE: saved ${results.length} passed surfaces; missing author-stage surfaces will continue from this same checkpoint without rechecking.`);
  process.exit(0);
}
await fs.writeFile(path.join(evidence, resultName),
  JSON.stringify({
    status: 'pass', surface: 'existing offline renderer', results, reusedSurfaceCount,
    browser: { headless: true, isolated: true, userProfileUsed: false, htmlReportAutoOpen: false },
    ...(checkpoint.initialFailure ? { initialFailure: checkpoint.initialFailure } : {}),
  }, null, 2) + '\n');
console.log(`PASS: ${results.length} headless desktop/mobile offline surface checks`);
