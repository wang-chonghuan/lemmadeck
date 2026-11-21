import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const base = path.join(root, '.tmp/stemrobin-184-six');
const lessonId = 'ana10-c6-s2-n81';
const modern = path.join(root,
  'ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral');
const lessonDir = path.join(modern, 'lessons', lessonId);
const out = path.join(base, 'n81-final-preview', lessonId);
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.relative(root, file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const write = (file, value) => fs.writeFileSync(file,
  typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const require = createRequire(path.join(root, 'app/package.json'));
const { chromium } = require('playwright');
const { inline, proseInline, proseFlow } = require(
  path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const lesson = read(path.join(lessonDir, 'lesson.json'));
const exercises = read(path.join(lessonDir, 'exercises.json'));
const answers = read(path.join(lessonDir, 'answer-keys.json'));
const choices = read(path.join(lessonDir, 'choice-set/draft.json'));
assert.equal(lesson.status, 'ready');
assert.equal(answers.status, 'ready');
const browser = await chromium.launch({ channel: 'chrome', headless: false });
const contexts = [];
const evidence = {
  schema: 'stemrobin1846/n81-final-offline-browser@1', cwd: root,
  status: 'RUNNING', startedAt: new Date().toISOString(),
  scope: 'Final offline display, native disclosure/option controls and navigation only; not live app, DB, keyboard, server judging or source-fidelity resolution.',
  inputs: ['lesson.json', 'exercises.json', 'figures.json', 'answer-keys.json',
    'interactions.json', 'choice-set/seed.json', 'choice-set/draft.json', 'choice-set/review.json']
    .map(name => bind(path.join(lessonDir, name))),
  observations: [], captures: [], nativeClicks: 0,
  parentImageViewsOrDecodes: 0, hiddenRasterCharges: 'UNKNOWN',
};
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  contexts.push(context);
  await context.route('**/*', route => {
    const url = route.request().url();
    return url.startsWith('data:') || url.startsWith('file:') ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', error => { throw error; });
  if (process.argv[2] === 'build') {
    const text = path.join(out, 'text.html');
    const written = path.join(out, 'exercises.html');
    for (const file of [text, written]) {
      await page.setContent(fs.readFileSync(file, 'utf8'), { waitUntil: 'load' });
      await page.evaluate(() => {
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', '课程');
        for (const [href, label] of [['text.html', '课文'], ['exercises.html', '习题'],
          ['choices.html', '选择题']]) {
          const a = document.createElement('a');
          a.href = href; a.textContent = label; nav.append(a);
        }
        document.querySelector('.sheet').prepend(nav);
        const style = document.createElement('style');
        style.textContent = 'nav{display:flex;gap:24px;margin-bottom:24px}nav a{color:#245d4f}h1{letter-spacing:0}details{border-top:1px solid #ddd;padding:14px 0}summary{cursor:pointer}details>div{padding-top:12px;line-height:1.9;overflow-x:auto}.answer .nb{max-width:100%}';
        document.head.append(style);
      });
      if (file === written) {
        await page.evaluate(items => {
          const section = document.createElement('section');
          section.setAttribute('aria-label', '标准答案');
          for (const item of items) {
            const details = document.createElement('details');
            details.dataset.exercise = item.exercise;
            const summary = document.createElement('summary');
            summary.textContent = item.exercise + ' · 标准答案';
            const body = document.createElement('div');
            body.className = 'answer'; body.innerHTML = item.html;
            details.append(summary, body); section.append(details);
          }
          document.querySelector('.sheet').append(section);
        }, answers.answers.map(item => ({ exercise: item.exercise, html: inline(item.displayAnswer) })));
      }
      fs.writeFileSync(file, await page.content());
    }
    await page.setContent(fs.readFileSync(text, 'utf8'), { waitUntil: 'load' });
    await page.evaluate(({ title, questions }) => {
      const sheet = document.querySelector('.sheet');
      const nav = sheet.querySelector('nav').cloneNode(true);
      sheet.replaceChildren(nav);
      const h1 = document.createElement('h1'); h1.textContent = title; sheet.append(h1);
      for (const q of questions) {
        const fieldset = document.createElement('fieldset');
        fieldset.dataset.questionId = q.id; fieldset.dataset.mode = q.mode;
        const legend = document.createElement('legend'); legend.innerHTML = q.stem;
        fieldset.append(legend);
        for (const option of q.options) {
          const label = document.createElement('label');
          label.dataset.optionId = option.id;
          const input = document.createElement('input');
          input.type = q.mode === 'multiple' ? 'checkbox' : 'radio';
          input.name = q.id; input.setAttribute('aria-label', option.id);
          const span = document.createElement('span'); span.innerHTML = option.html;
          label.append(input, span); fieldset.append(label);
        }
        sheet.append(fieldset);
      }
      const style = document.createElement('style');
      style.textContent = 'fieldset{border:0;border-top:1px solid #ddd;padding:20px 0;margin:20px 0;min-width:0}legend{font-size:18px;line-height:1.8;max-width:100%}fieldset label{display:flex;align-items:flex-start;gap:12px;padding:12px 0;font-size:17px;line-height:1.8}fieldset label span{min-width:0;max-width:100%}input{flex-shrink:0;margin-top:8px}';
      document.head.append(style);
    }, { title: lesson.title, questions: choices.questions.map(q => ({
      id: q.id, mode: q.view.mode, stem: inline(q.view.stem),
      options: q.view.options.map(o => ({ id: o.id, html: inline(o.text) })),
    })) });
    write(path.join(out, 'choices.html'), await page.content());
    const manifest = path.join(out, 'preview-manifest.json');
    write(manifest, { status: 'FINAL_OFFLINE_VIEW_PROJECTION_READY',
      inputs: evidence.inputs, files: ['text.html', 'exercises.html', 'choices.html']
        .map(name => bind(path.join(out, name))),
      answerDisclosures: answers.answers.length,
      choiceQuestions: choices.questions.length, exposedChoiceSubtree: 'view only',
      dbOrPublication: 0 });
    console.log(JSON.stringify({ manifest: bind(manifest) }));
  } else if (process.argv[2] === 'check') {
    const receiptPath = path.join(out, 'browser-evidence.json');
    assert(!fs.existsSync(receiptPath));
    const flow = proseFlow(lesson.prose, lesson.section_breaks).filter(b => !['fig', 'cap'].includes(b.kind));
    const expected = {
      text: flow.map(b => proseInline(b.text)),
      written: exercises.exercises.map(e => inline(e.text.replace(
        /^\s*(?:\d+\.\s*|\$\d+\^\{\*\}\$。\s*)/, ''))),
      answers: answers.answers.map(a => inline(a.displayAnswer)),
    };
    for (const viewport of [{ width: 1440, height: 960 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      for (const [name, file] of [['text', 'text.html'], ['written', 'exercises.html'], ['choices', 'choices.html']]) {
        await page.goto(pathToFileURL(path.join(out, file)).href, { waitUntil: 'load' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (const node of document.querySelectorAll('.katex-html span,.prose-math')) {
            const s = getComputedStyle(node);
            await document.fonts.load(`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`, node.textContent || 'x');
          }
          await document.fonts.ready;
        });
        const state = await page.evaluate(({ name, expected }) => {
          const signature = element => {
            const copy = element.cloneNode(true);
            for (const math of copy.querySelectorAll('.katex')) math.replaceWith(
              document.createTextNode('$' + math.querySelector('annotation').textContent + '$'));
            for (const br of copy.querySelectorAll('br')) br.replaceWith(document.createTextNode('\n'));
            return copy.textContent.replace(/\s+/g, ' ').trim();
          };
          const compare = (selector, items) => {
            const nodes = [...document.querySelectorAll(selector)];
            return { count: nodes.length, expectedCount: items.length,
              matches: items.map((html, i) => {
                const div = document.createElement('div'); div.innerHTML = html;
                return Boolean(nodes[i]) && signature(nodes[i]) === signature(div);
              }) };
          };
          return { name, errors: document.querySelectorAll('.err,.katex-error,.sr-tex-err').length,
            pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            fonts: document.fonts.status, mathCount: document.querySelectorAll('.katex').length,
            prose: name === 'text' ? compare('.para', expected.text) : null,
            written: name === 'written' ? compare('li.ex .body', expected.written) : null,
            answers: name === 'written' ? compare('details .answer', expected.answers) : null,
            sections: document.querySelectorAll('.para.section').length,
            questionCount: document.querySelectorAll('[data-question-id]').length,
            scripts: document.scripts.length, hidden: document.querySelectorAll('[hidden],input[type=hidden]').length,
            payloadAttributes: [...document.querySelectorAll('*')].flatMap(el => [...el.attributes]
              .filter(a => /correct|rationale|source|intent|key/i.test(a.name)).map(a => a.name)) };
        }, { name, expected });
        assert.equal(state.errors, 0);
        assert.equal(state.pageOverflow, false);
        assert.equal(state.fonts, 'loaded');
        assert(state.mathCount > 0);
        for (const comparison of [state.prose, state.written, state.answers].filter(Boolean)) {
          assert.equal(comparison.count, comparison.expectedCount);
          assert(comparison.matches.every(Boolean));
        }
        if (name === 'text') {
          assert.equal(state.sections, lesson.section_breaks.length);
          for (const figure of read(path.join(lessonDir, 'figures.json')).figures) {
            const element = page.locator(`#${figure.id}`);
            await element.scrollIntoViewIfNeeded();
            const metrics = await element.evaluate(el => {
              const svg = el.querySelector('svg'), media = el.querySelector('.figure-media');
              const scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
              return { width: media.getBoundingClientRect().width,
                text: Math.min(...[...svg.querySelectorAll('text')].map(n =>
                  Number(n.getAttribute('font-size')) * scale)),
                end: el.scrollWidth - el.clientWidth, before: el.scrollLeft };
            });
            assert.equal(metrics.width, 640); assert(metrics.text >= 16);
            if (metrics.end > 0) {
              const bounds = await element.boundingBox();
              await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
              await page.mouse.wheel(2000, 0);
              await element.evaluate(el => new Promise((resolve, reject) => {
                const deadline = performance.now() + 3000;
                const poll = () => {
                  if (Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth)) <= 1) return resolve();
                  if (performance.now() > deadline) return reject(new Error('Figure wheel end not reached'));
                  requestAnimationFrame(poll);
                };
                poll();
              }));
            }
            metrics.after = await element.evaluate(el => { const x = el.scrollLeft; el.scrollLeft = 0; return x; });
            assert.equal(metrics.after, metrics.end);
            evidence.observations.push({ figure: figure.id, viewport, ...metrics });
          }
          const warning = flow.findIndex(b => b.text.includes('最后，按照第二条规则'));
          await page.locator('.para').nth(warning).scrollIntoViewIfNeeded();
        } else if (name === 'written') {
          for (const answer of answers.answers) {
            const details = page.locator(`details[data-exercise="${answer.exercise}"]`);
            await details.locator('summary').click(); evidence.nativeClicks++;
            assert(await details.getAttribute('open') !== null);
            assert(await details.locator('.answer').isVisible());
          }
          await page.locator('details[data-exercise="68"]').scrollIntoViewIfNeeded();
        } else {
          assert.equal(state.questionCount, choices.questions.length);
          assert.equal(state.scripts, 0); assert.equal(state.hidden, 0);
          assert.deepEqual(state.payloadAttributes, []);
          for (const question of choices.questions) {
            const fieldset = page.locator(`[data-question-id="${question.id}"]`);
            assert.equal(await fieldset.locator('input').count(), question.view.options.length);
            for (const option of question.view.options) {
              const input = fieldset.locator(`[data-option-id="${option.id}"] input`);
              await input.click(); evidence.nativeClicks++;
              assert(await input.isChecked());
              if (question.view.mode === 'single') assert.equal(await fieldset.locator('input:checked').count(), 1);
              else { await input.click(); evidence.nativeClicks++; assert(!(await input.isChecked())); }
            }
          }
          await page.locator('[data-question-id]').first().scrollIntoViewIfNeeded();
        }
        const capture = path.join(out, `${name}-${viewport.width}.png`);
        assert(!fs.existsSync(capture));
        await page.screenshot({ path: capture });
        evidence.captures.push({ name, viewport, ...bind(capture) });
        evidence.observations.push({ viewport, ...state });
        await page.getByRole('navigation', { name: '课程' }).getByRole('link', {
          name: name === 'text' ? '习题' : '课文', exact: true,
        }).click();
        assert(page.url().endsWith(name === 'text' ? '/exercises.html' : '/text.html'));
        evidence.nativeClicks++;
      }
    }
    evidence.status = 'MECHANICAL_OFFLINE_PASS_VISUAL_REVIEW_PENDING';
    console.log(JSON.stringify({ status: evidence.status, screenshots: evidence.captures.length,
      clicks: evidence.nativeClicks, observations: evidence.observations.length }));
  } else throw new Error('Use build or check');
} catch (error) {
  evidence.status = 'FAIL'; evidence.failure = error.stack;
  throw error;
} finally {
  for (const context of contexts) await context.close();
  await browser.close();
  if (process.argv[2] === 'check') {
    evidence.browserClosed = true; evidence.endedAt = new Date().toISOString();
    write(path.join(out, 'browser-evidence.json'), evidence);
  }
}
