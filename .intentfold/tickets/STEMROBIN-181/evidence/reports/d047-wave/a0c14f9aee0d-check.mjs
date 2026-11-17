import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(out, '../../../../..');
const ticket = 'STEMROBIN-181';
const cards = [38, 39, 40, 44].map(n => `phy10-c1-s5-n${n}`);
const viewports = [{ width: 1440, height: 960 }, { width: 390, height: 844 }];
const requireApp = createRequire(path.join(repo, 'app/package.json'));
const requireSkills = createRequire(path.join(repo, '.agents/skills/package.json'));
const requireNative = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const absolute = p => path.resolve(repo, p);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const hash = p => sha(fs.readFileSync(p));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const normalize = text => String(text ?? '').replace(/\s+/g, '');
const mathTokens = text => [...String(text ?? '').matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
  .map(m => ({ tex: m[1] ?? m[2], display: m[1] !== undefined }));
const immutable = new Map();
const allowedHTML = new Set();
let run, browser, context, sharp, nativeHelpers, choiceHtml;

function argumentsFor(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 2) {
    assert.ok(['--manifest', '--sha'].includes(argv[i]) && argv[i + 1], 'Usage: check.mjs --manifest FILE --sha SHA256');
    assert.ok(!Object.hasOwn(options, argv[i]), `Duplicate argument ${argv[i]}`);
    options[argv[i]] = argv[i + 1];
  }
  assert.ok(options['--manifest'] && /^[a-f0-9]{64}$/i.test(options['--sha'] ?? ''),
    'Both --manifest FILE and --sha SHA256 are required');
  return { manifest: absolute(options['--manifest']), sha256: options['--sha'].toLowerCase() };
}

function bind(p, role = 'consumed-input', expected) {
  assert.ok(typeof p === 'string' && p.length, 'Input path must be nonempty');
  const file = absolute(p);
  assert.ok(fs.statSync(file).isFile(), `Not a file: ${file}`);
  const sha256 = hash(file);
  if (expected !== undefined) {
    assert.match(expected, /^[a-f0-9]{64}$/i, `Invalid SHA256: ${file}`);
    assert.equal(sha256, expected.toLowerCase(), `SHA256 mismatch: ${file}`);
  }
  const prior = immutable.get(file);
  if (prior) assert.equal(prior.sha256, sha256, `Input changed during preparation: ${file}`);
  else immutable.set(file, { path: file, sha256, role });
  return { path: file, sha256, ...(expected ? { expectedSha256: expected.toLowerCase() } : {}) };
}

function receipt(binding, role) {
  assert.ok(binding && typeof binding.sha256 === 'string', `Missing hash binding: ${role}`);
  return bind(binding.path, role, binding.sha256);
}

function outputBinding(file) {
  return { path: file, sha256: hash(file) };
}

function write(name, value) {
  const file = path.join(run, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return outputBinding(file);
}

const result = {
  schema: 'ld-s10y-lesson/offline-wave-display@1',
  ticket, cards, startedAt: new Date().toISOString(), status: 'PREPARING',
  execution: {
    headless: true, channel: 'chrome', browserLaunches: 0, browserPasses: 0,
    isolatedContexts: 0, offline: true, networkAllowed: false, deviceScaleFactor: 1,
    nativeRerenders: 0, supplementalHTMLAssemblies: 0, supplementalHTMLFiles: 0,
    repairs: 0, retries: 0, foregroundActions: 0,
    screenshotsOpenedByCommand: 0, substantiveReviewsRepeated: 0,
    appOrDatabaseStarted: false, formalProductAC: false,
    limitation: 'Explicitly requested isolated headless native offline HTML DISPLAY only. Supplemental HTML adaptation uses reviewed views/ready keys and existing native DOM/CSS in this same browser pass. No product app, DB, native renderer replay, content authoring, or substantive review.',
  },
  surfaces: [], screenshots: [], tiles: [], failures: [], externalRequests: [],
  inputHTMLUnchanged: [], visualReview: 'PENDING-independent-firsthand-opens',
};

function check(surface, condition, label, details) {
  if (!condition) {
    const failure = { surface: surface?.id ?? null, label, ...(details !== undefined ? { details } : {}) };
    result.failures.push(failure);
    if (surface) surface.failures.push(failure);
  }
  return condition;
}

function failure(surface, label, error) {
  check(surface, false, label, String(error.stack ?? error));
}

function nativeSource(document, root, book, role) {
  assert.ok(document.source?.data && document.source.path && document.source.sha256, `${role}: missing embedded native source`);
  const binding = bind(path.join(absolute(root), book, document.source.path), `${role}-source`, document.source.sha256);
  assert.deepEqual(read(binding.path), document.source.data, `${role}: embedded source changed`);
  return binding;
}

function editionDirectory(root, book) {
  return path.join(absolute(root), book, 'editions/modern-us-neutral');
}

function getHtml(entries, kind, work) {
  assert.ok(Array.isArray(entries), 'Missing native HTML bindings');
  const matches = entries.filter(item => path.basename(item.path) === `${kind}.html`);
  assert.equal(matches.length, 1, `Exactly one ${kind}.html required`);
  const binding = receipt(matches[0], 'immutable-inputHTML');
  const relative = path.relative(absolute(work), binding.path);
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'HTML must be in the declared native work directory');
  const inputHTML = fs.readFileSync(binding.path, 'utf8');
  assert.ok(/<!doctype html>/i.test(inputHTML), `Not a native full HTML document: ${binding.path}`);
  assert.ok(!/<script\b/i.test(inputHTML), `Native offline HTML must have no scripts: ${binding.path}`);
  return { ...binding, embeddedFontFaces: (inputHTML.match(/@font-face\s*\{/g) ?? []).length };
}

function loadNative(item) {
  assert.ok(cards.includes(item.card), `Unexpected card: ${item.card}`);
  const binding = receipt(item.native, 'native-result');
  const native = read(binding.path);
  assert.equal(native.card, item.card, 'Manifest/native card mismatch');
  assert.equal(native.ticket, ticket);
  assert.match(native.status ?? '', /^PASS-native/);
  assert.deepEqual(native.languages.map(entry => entry.language).sort(), ['en', 'zh']);
  for (const input of native.inputs ?? []) receipt(input, 'native-finalization-input');
  for (const entry of native.languages) {
    receipt(entry.finalize, 'native-finalize-receipt');
    receipt(entry.render, 'native-render-receipt');
  }
  result.nativeResults ??= [];
  result.nativeResults.push(binding);
  return native.languages.map(entry => {
    assert.ok(entry.nativeRoot && entry.root && entry.work, 'nativeRoot/root/work required');
    assert.ok(Array.isArray(entry.nativeOutputs), 'nativeOutputs required');
    for (const output of entry.nativeOutputs) receipt(output, 'native-finalized-output');
    const byName = name => {
      const matches = entry.nativeOutputs.filter(output => path.basename(output.path) === name);
      assert.equal(matches.length, 1, `Missing/duplicate native ${name}`);
      return read(absolute(matches[0].path));
    };
    const lesson = byName('lesson.json'), exercises = byName('exercises.json');
    const figures = byName('figures.json'), audit = byName('adaptation.audit.json');
    assert.equal(lesson.status, 'ready');
    assert.equal(exercises.status, 'ready');
    assert.equal(figures.status, 'ready');
    assert.equal(audit.status, 'pass');
    assert.equal(exercises.count, exercises.exercises.length);
    assert.equal(exercises.source.data.count, exercises.count);
    assert.equal(exercises.source.data.exercises.length, exercises.count);
    assert.deepEqual(exercises.exercises.map(e => String(e.number)),
      exercises.source.data.exercises.map(e => String(e.number)), 'Original exercise identity/order changed');
    if (item.card.endsWith('-n39')) assert.equal(exercises.count, 6, 'n39 must retain all six original exercises');
    nativeSource(lesson, entry.nativeRoot, '10p', 'lesson');
    nativeSource(exercises, entry.nativeRoot, '10p', 'exercises');
    const edition = editionDirectory(entry.root, '10p');
    const displayLesson = read(bind(path.join(edition, 'lessons', item.card, 'lesson.json'), 'display-lesson').path);
    const withoutTitles = ({ title, printed_title, ...rest }) => rest;
    assert.deepEqual(withoutTitles(displayLesson), withoutTitles(lesson), 'Display clone changed more than title fields');
    for (const name of ['exercises.json', 'figures.json']) {
      const display = read(bind(path.join(edition, 'lessons', item.card, name), 'display-clone-input').path);
      assert.deepEqual(display, name === 'exercises.json' ? exercises : figures, `Display clone ${name} changed`);
    }
    if (entry.displayBinding) {
      receipt(entry.displayBinding.nativeLesson, 'display-binding-native');
      receipt(entry.displayBinding.displayLesson, 'display-binding-clone');
      assert.equal(entry.displayBinding.sourceAndProseUnchanged, true);
    }
    const flow = nativeHelpers.proseFlow(lesson.prose, lesson.section_breaks);
    const outline = nativeHelpers.proseOutline(lesson.prose);
    const indices = nativeHelpers.sectionBreakIndices(lesson.prose, lesson.section_breaks);
    assert.ok(outline.length, 'Native text surface cannot be empty');
    const specs = new Map();
    for (const figure of figures.figures) {
      assert.ok(!specs.has(figure.id), `Duplicate figure ${figure.id}`);
      const spec = read(bind(path.join(edition, figure.spec), 'native-figure-spec').path);
      assert.ok(Number.isFinite(spec.display?.minTextPx) && spec.display.minTextPx >= 16, 'Missing/invalid figure display text threshold');
      for (const field of ['svg', 'png', 'artwork', 'render', 'review', 'generation']) {
        if (figure[field]) bind(path.join(edition, figure[field]), `native-figure-${field}`);
      }
      specs.set(figure.id, spec);
    }
    return {
      card: item.card, language: entry.language, entry, lesson, displayLesson,
      exercises, figures, specs, flow, outline, indices,
      nativeResult: binding,
      html: Object.fromEntries(['text', 'exercises'].map(kind => [kind, getHtml(entry.html, kind, entry.work)])),
    };
  });
}

function loadSupplement(binding, languages) {
  const file = receipt(binding, 'supplemental-result');
  const supplemental = read(file.path);
  const card = supplemental.card ?? 'phy10-c1-s5-n39';
  assert.equal(card, 'phy10-c1-s5-n39');
  assert.deepEqual(supplemental.languages.map(entry => entry.language).sort(), ['en', 'zh']);
  result.supplemental = file;
  for (const entry of supplemental.languages) {
    const target = languages.find(data => data.card === card && data.language === entry.language);
    assert.ok(entry.root && entry.work, 'Supplemental root/work required');
    assert.ok(Array.isArray(entry.outputs ?? []), 'Supplemental outputs must be hash bindings');
    for (const output of entry.outputs ?? []) receipt(output, 'supplemental-output-or-review-evidence');
    const draftBinding = receipt(entry.choiceDraft, 'reviewed-choice-draft');
    const answerBinding = receipt(entry.answerKeys, 'reviewed-answer-keys');
    const draft = read(draftBinding.path), keys = read(answerBinding.path);
    assert.ok(Array.isArray(draft.questions) && Array.isArray(keys.answers), 'Native draft.questions and keys.answers required');
    assert.equal(keys.status, 'ready');
    assert.equal(keys.lesson, target.card);
    assert.ok(draft.questions.length > 0, 'Reviewed choice draft must have questions');
    assert.equal(keys.answers.length, target.exercises.count);
    assert.equal(new Set(draft.questions.map(q => q.id)).size, draft.questions.length, 'Duplicate question IDs');
    const originalNumbers = target.exercises.exercises.map(e => String(nativeHelpers.sourceNumberForArtifact(e)));
    const originalIds = target.exercises.exercises.map(e => String(e.number));
    assert.deepEqual(keys.answers.map(a => String(a.exercise)), originalIds, 'Answer keys must correspond to all original exercises in order');
    const meaningful = text => typeof text === 'string' && /[\p{L}\p{N}]/u.test(text);
    for (const question of draft.questions) {
      assert.ok(meaningful(question.id) && meaningful(question.view?.stem), 'Empty choice ID/stem');
      assert.ok(Array.isArray(question.source_numbers) && question.source_numbers.length > 0,
        'Each reviewed choice must identify its corresponding original problem(s)');
      assert.equal(new Set(question.source_numbers.map(String)).size, question.source_numbers.length);
      assert.ok(question.source_numbers.map(String).every(number => originalNumbers.includes(number)),
        'Choice references a non-original problem');
      assert.ok(['single', 'multiple'].includes(question.view.mode));
      assert.ok(Array.isArray(question.view.options) && question.view.options.length >= 2, 'Meaningful choice alternatives required');
      assert.equal(new Set(question.view.options.map(option => option.id)).size, question.view.options.length);
      assert.ok(question.view.options.every(option => meaningful(option.id) && meaningful(option.text)), 'Empty option');
      assert.equal(new Set(question.view.options.map(option => normalize(option.text))).size, question.view.options.length, 'Duplicate option text');
      assert.ok(Array.isArray(question.view.figure_ids) && question.view.options.every(option => Array.isArray(option.figure_ids)));
    }
    const coveredSources = draft.questions.flatMap(question => question.source_numbers.map(String));
    assert.deepEqual([...new Set(coveredSources)].sort(), [...originalNumbers].sort(),
      'Reviewed choice views must collectively cover all six original problems; combined-source questions are allowed');
    for (const [i, answer] of keys.answers.entries()) {
      assert.equal(String(answer.exercise), String(target.exercises.exercises[i].number),
        'Answer is not bound to the finalized original exercise');
      assert.equal(answer.grading, 'ungraded');
      assert.deepEqual(answer.parts, []);
      assert.ok(meaningful(answer.displayAnswer), 'Empty standard answer');
    }
    // This consumes a prior substantive review; it does not repeat that review.
    let reviewBinding = null;
    if (entry.review) {
      reviewBinding = receipt(entry.review, 'supplemental-reviewed-source-coverage-receipt');
      const review = read(reviewBinding.path);
      assert.equal(review.status, 'pass');
      assert.equal(review.choiceDraftSha256, draftBinding.sha256);
      assert.equal(review.answerKeysSha256, answerBinding.sha256);
      assert.deepEqual(review.questionIds, draft.questions.map(q => q.id));
      assert.deepEqual(review.exerciseIds.map(String), originalIds);
      for (const input of review.inputs ?? []) receipt(input, 'retained-independent-review');
    }
    const edition = editionDirectory(entry.root, '10p');
    const supplementalLesson = read(bind(path.join(edition, 'lessons', target.card, 'lesson.json'), 'supplemental-lesson').path);
    for (const field of ['source', 'prose', 'section_breaks']) {
      assert.deepEqual(supplementalLesson[field], target.lesson[field], `Supplemental ${field} changed`);
    }
    const supplementalExercises = read(bind(path.join(edition, 'lessons', target.card, 'exercises.json'), 'supplemental-exercises').path);
    const stripMetadata = ({ answerKey, interaction, ...exercise }) => exercise;
    assert.deepEqual(supplementalExercises.source, target.exercises.source);
    assert.deepEqual(supplementalExercises.exercises.map(stripMetadata), target.exercises.exercises.map(stripMetadata));
    for (const figure of target.figures.figures) {
      for (const field of ['spec', 'svg', 'png', 'artwork']) {
        if (figure[field]) {
          const baseline = bind(path.join(editionDirectory(target.entry.root, '10p'), figure[field]));
          bind(path.join(edition, figure[field]), 'supplemental-native-figure', baseline.sha256);
        }
      }
    }
    target.supplement = { entry, draft, keys, draftBinding, answerBinding, review: reviewBinding,
      reviewProvenance: reviewBinding ? 'hash-bound prior review receipt'
        : 'parent-supplied final SHA-bound supplemental manifest attests reviewed draft/ready read-only keys',
      assemblyAttempted: false, fragments: {} };
    result.supplementalCounts ??= [];
    result.supplementalCounts.push({
      language: entry.language, writtenExercises: target.exercises.count, standardAnswers: keys.answers.length,
      choiceQuestions: draft.questions.length, choiceOptions: draft.questions.reduce((n, q) => n + q.view.options.length, 0),
      modes: draft.questions.reduce((counts, q) => ({ ...counts, [q.view.mode]: (counts[q.view.mode] ?? 0) + 1 }), {}),
      sourceCoverage: draft.questions.map(q => ({ questionId: q.id, sourceNumbers: q.source_numbers.map(String) })),
    });
  }
}

async function assembleSupplement(page, data, surface) {
  data.supplement.assemblyAttempted = true;
  const extracted = await page.evaluate(() => ({
    css: [...document.querySelectorAll('style')].map(style => style.textContent).join('\n'),
    figures: [...document.querySelectorAll('figure.fig')].map(figure => ({ id: figure.id, html: figure.outerHTML })),
  }));
  assert.ok(extracted.css.length, 'Missing native exercise CSS');
  assert.deepEqual(extracted.figures.map(f => f.id), expectedFor(data, 'exercises').refs,
    'Supplemental figures must be the actual native exercise DOM figures');
  const figures = new Map(extracted.figures.map(figure => [figure.id, figure.html]));
  const figureHtml = id => {
    assert.ok(data.specs.has(id) && figures.has(id), `No approved native exercise DOM figure ${id}; do not author or rerender`);
    return figures.get(id);
  };
  const escape = text => nativeHelpers.esc(String(text)).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const css = `${extracted.css}
.sr-nb{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:middle;white-space:nowrap}
.options{list-style:none;margin:.75em 0 0;padding:0}
.option{display:flex;align-items:flex-start;gap:.6em;margin:.6em 0}
.option input{flex:none;margin-top:.65em}
.option span{min-width:0}
details{margin-top:.75em}`;
  const baseTitle = String(data.displayLesson.printed_title || data.displayLesson.title);
  const titles = data.language === 'en'
    ? { choices: `${baseTitle} - Choices`, answers: `${baseTitle} - Written Questions and Standard Answers`, summary: 'Standard answer' }
    : { choices: `${baseTitle} - \u9009\u62e9\u9898`, answers: `${baseTitle} - \u4e66\u5199\u9898\u4e0e\u6807\u51c6\u7b54\u6848`, summary: '\u6807\u51c6\u7b54\u6848' };
  const document = (title, body) => `<!DOCTYPE html><html lang="${escape(data.language)}"><head><meta charset="utf-8"><title>${escape(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${css}</style></head><body><main class="sheet"><h1>${escape(title)}</h1>${body}</main></body></html>`;
  const fragments = { choices: [], answers: [] };
  const questions = data.supplement.draft.questions.map((question, index) => {
    const view = question.view;
    const type = view.mode === 'single' ? 'radio' : 'checkbox';
    const stem = choiceHtml(view.stem);
    fragments.choices.push(stem);
    const options = view.options.map((option, optionIndex) => {
      const text = choiceHtml(option.text);
      fragments.choices.push(text);
      const label = String.fromCharCode(65 + optionIndex);
      return `<li class="option"><input disabled type="${type}" name="question-${index}" aria-label="${escape(label)}"><span>${escape(label)}. ${text}${option.figure_ids.map(figureHtml).join('')}</span></li>`;
    }).join('');
    return `<li class="ex" data-question-id="${escape(question.id)}"><div class="no">${index + 1}.</div><div class="body">${stem}${view.figure_ids.map(figureHtml).join('')}<ul class="options">${options}</ul></div></li>`;
  }).join('');
  const written = data.supplement.keys.answers.map((answer, index) => {
    const exercise = data.exercises.exercises[index];
    const prompt = choiceHtml(exercise.text), body = choiceHtml(answer.displayAnswer);
    fragments.answers.push(prompt, body);
    return `<li class="ex" id="ex-${escape(exercise.number)}"><div class="no">${index + 1}.</div><div class="body">${prompt}${(exercise.figures ?? []).map(figure => figureHtml(figure.id)).join('')}<details open><summary>${escape(titles.summary)}</summary>${body}</details></div></li>`;
  }).join('');
  const directory = path.join(run, 'supplemental', data.language);
  fs.mkdirSync(directory, { recursive: true });
  const generated = [];
  for (const [kind, body] of [['choices', questions], ['answers', written]]) {
    const file = path.join(directory, `${kind}.html`);
    fs.writeFileSync(file, document(titles[kind], `<ol class="ex">${body}</ol>`), { flag: 'wx' });
    const binding = outputBinding(file);
    data.html[kind] = { ...getHtml([binding], kind, run), generatedSupplemental: true };
    allowedHTML.add(pathToFileURL(file).href);
    generated.push({ kind, ...data.html[kind] });
    result.execution.supplementalHTMLFiles++;
  }
  data.supplement.fragments = fragments;
  data.supplement.titles = titles;
  result.execution.supplementalHTMLAssemblies++;
  result.supplementalAssembly ??= [];
  result.supplementalAssembly.push({
    card: data.card, language: data.language, nativeExerciseHTML: surface.inputHTML,
    sourceSurface: surface.id, nativeCSSSha256: sha(extracted.css),
    copiedFigures: extracted.figures.map(figure => ({ id: figure.id, nativeOuterHTMLSha256: sha(figure.html) })),
    choiceDraft: data.supplement.draftBinding, answerKeys: data.supplement.answerBinding,
    review: data.supplement.review, reviewProvenance: data.supplement.reviewProvenance,
    title: baseTitle, titles, generatedHTML: generated,
    rendering: 'production choiceHtml; only draft.view + ID-bound original exercise prompt/ready displayAnswer + unchanged approved native exercise figure.outerHTML',
    contentAuthored: false, nativeRendererReplayed: false, sameBrowserPass: true,
  });
}

async function inspectPage(page, fragments = []) {
  return page.evaluate(fragments => {
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
    };
    const geometry = node => {
      const css = getComputedStyle(node);
      return { ...rect(node), display: css.display, visibility: css.visibility,
        fontSize: parseFloat(css.fontSize), fontFamily: css.fontFamily, textIndent: css.textIndent };
    };
    const sourceText = node => {
      if (!node) return '';
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      if (node.matches('.katex')) {
        const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
        if (!annotation) throw new Error('Rendered formula missing native TeX annotation');
        const delimiter = node.closest('.katex-display') ? '$$' : '$';
        return `${delimiter}${annotation.textContent}${delimiter}`;
      }
      if (node.matches('figure,script,style,input,textarea,select,summary')) return '';
      if (node.tagName === 'BR') return '\n';
      const text = [...node.childNodes].map(sourceText).join('');
      return node.tagName === 'STRONG' ? `**${text}**` : text;
    };
    const without = (node, selector) => {
      const clone = node.cloneNode(true);
      clone.querySelectorAll(selector).forEach(child => child.remove());
      return sourceText(clone);
    };
    const visible = node => {
      const g = geometry(node);
      return g.width > 0 && g.height > 0 && g.display !== 'none' && g.visibility === 'visible';
    };
    const clipping = (box, node) => {
      const problems = [];
      for (let parent = node; parent; parent = parent.parentElement) {
        const css = getComputedStyle(parent), r = rect(parent);
        if (['hidden', 'clip'].includes(css.overflowY) && (box.y < r.y - 1 || box.y + box.height > r.y + r.height + 1)) {
          problems.push({ axis: 'y', ancestor: parent.className?.baseVal ?? parent.className });
        }
        if (['hidden', 'clip'].includes(css.overflowX) && (box.x < r.x - 1 || box.x + box.width > r.x + r.width + 1)) {
          // The native scroll figure deliberately clips its offscreen horizontal content.
          if (!parent.matches('figure[data-figure-layout="scroll"]')) problems.push({ axis: 'x', ancestor: parent.className?.baseVal ?? parent.className });
        }
      }
      return problems;
    };
    const sheet = document.querySelector('.sheet');
    if (!sheet) throw new Error('Missing native .sheet');
    const paragraphs = [...sheet.querySelectorAll('p.para')].map((node, index) => ({
      index, text: sourceText(node), sectionBreak: node.classList.contains('section'),
      borderTop: parseFloat(getComputedStyle(node).borderTopWidth), geometry: geometry(node),
    }));
    const blocks = [...sheet.children].map(node => ({
      kind: node.matches('figure') ? 'fig' : node.matches('.figcap') ? 'cap' : node.matches('p.para') ? 'p' : 'other',
      id: node.matches('figure') ? node.id : undefined,
      text: sourceText(node), geometry: geometry(node),
    }));
    const pairs = selector => {
      const nodes = [...sheet.querySelectorAll(selector)];
      return nodes.slice(1).flatMap((node, i) => {
        if (node.parentElement !== nodes[i].parentElement || !visible(node) || !visible(nodes[i])) return [];
        const a = rect(nodes[i]), b = rect(node), overlap = a.y + a.height - b.y;
        return overlap > 1 ? [{ selector, prior: i, next: i + 1, overlapPx: overlap }] : [];
      });
    };
    const nonemptyBlocks = blocks.filter(b => b.geometry.width > 0 && b.geometry.height > 0);
    const collisions = nonemptyBlocks.slice(1).flatMap((block, i) => {
      const prior = nonemptyBlocks[i], overlap = prior.geometry.y + prior.geometry.height - block.geometry.y;
      return overlap > 1 ? [{ prior: i, next: i + 1, overlapPx: overlap }] : [];
    }).concat(pairs('li.ex'), pairs('.option'));
    const formulas = [...sheet.querySelectorAll('.katex')].map(node => {
      const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
      const visual = node.querySelector('.katex-html');
      const box = visual ? geometry(visual) : null;
      const scroll = node.closest('.nb,.sr-nb');
      return {
        tex: annotation?.textContent ?? null, display: !!node.closest('.katex-display'),
        geometry: geometry(node), visual: box,
        scroll: scroll ? { width: scroll.clientWidth, contentWidth: scroll.scrollWidth,
          overflowX: getComputedStyle(scroll).overflowX } : null,
        cutoffs: box ? clipping(box, visual) : ['missing visual formula'],
      };
    });
    const cutoffs = [];
    const walker = document.createTreeWalker(sheet, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent.trim() || node.parentElement.closest('.katex,figure,script,style')) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        const box = { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
        if (r.left < -1 || r.right > innerWidth + 1) cutoffs.push({ text: node.textContent, box, reason: 'outside viewport' });
        const container = node.parentElement.closest('p.para,.body,h1,.crumb,.figcap,.jump,summary,.option');
        if (container && !node.parentElement.closest('.nb,.sr-nb')) {
          const boundary = container.getBoundingClientRect();
          if (r.left < boundary.left - 1 || r.right > boundary.right + 1) {
            cutoffs.push({ text: node.textContent, box, reason: 'outside native text container' });
          }
        }
        for (const problem of clipping(box, node.parentElement)) cutoffs.push({ text: node.textContent, box, ...problem });
      }
    }
    const media = [...sheet.querySelectorAll('figure.fig')].map((figure, index) => {
      const container = figure.querySelector('.figure-media'), svg = container?.querySelector('svg');
      const labels = [...figure.querySelectorAll('svg text')].map(node => {
        const matrix = node.getScreenCTM(), box = rect(node), svgBox = rect(node.ownerSVGElement);
        return {
          id: node.dataset.labelId ?? null, text: node.textContent, geometry: box,
          font: getComputedStyle(node).fontFamily,
          sizePx: matrix ? parseFloat(getComputedStyle(node).fontSize) * Math.hypot(matrix.a, matrix.b) : 0,
          visible: visible(node),
          insideMedia: box.x >= svgBox.x - 1 && box.y >= svgBox.y - 1
            && box.x + box.width <= svgBox.x + svgBox.width + 1
            && box.y + box.height <= svgBox.y + svgBox.height + 1,
        };
      });
      const labelOverlaps = labels.flatMap((a, i) => labels.slice(i + 1).flatMap(b => {
        const x = Math.min(a.geometry.x + a.geometry.width, b.geometry.x + b.geometry.width) - Math.max(a.geometry.x, b.geometry.x);
        const y = Math.min(a.geometry.y + a.geometry.height, b.geometry.y + b.geometry.height) - Math.max(a.geometry.y, b.geometry.y);
        return x > 1 && y > 1 ? [{ a: a.id ?? a.text, b: b.id ?? b.text, width: x, height: y }] : [];
      }));
      return { index, id: figure.id, layout: figure.dataset.figureLayout, labels, labelOverlaps,
        geometry: rect(figure), mediaGeometry: container ? rect(container) : null,
        svgGeometry: svg ? rect(svg) : null, preparedFont: svg?.getAttribute('data-ld-vector-font'),
        clientWidth: figure.clientWidth, contentWidth: figure.scrollWidth, scrollLeft: figure.scrollLeft,
        mode: container?.dataset.figureMode,
        images: [...figure.querySelectorAll('img')].map(img => ({
          complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, geometry: rect(img),
        })) };
    });
    const exercises = [...sheet.querySelectorAll('li.ex')].map(node => {
      const body = node.querySelector('.body'), detail = body?.querySelector('details');
      return {
        id: node.id, questionId: node.dataset.questionId ?? null,
        number: node.querySelector('.no')?.textContent.trim(),
        text: body ? without(body, 'figure,.options,details') : null,
        geometry: geometry(node), bodyVisible: body ? visible(body) : false,
        details: [...node.querySelectorAll('details')].map(d => ({ open: d.open, visible: visible(d), text: without(d, 'summary') })),
        answer: detail ? without(detail, 'summary') : null,
        options: [...node.querySelectorAll('.option')].map((option, i) => {
          const input = option.querySelector('input'), span = input?.nextElementSibling;
          return { index: i, text: span ? sourceText(span).replace(/^[A-Z]\.\s*/, '') : without(option, 'input').replace(/^[A-Z]\.\s*/, ''),
            label: input?.getAttribute('aria-label'), type: input?.type, disabled: input?.disabled,
            checked: input?.checked, geometry: geometry(option), visible: visible(option) };
        }),
      };
    });
    const literal = sheet.cloneNode(true);
    literal.querySelectorAll('.katex,figure,script,style').forEach(node => node.remove());
    const viewOnly = sheet.cloneNode(true);
    viewOnly.querySelectorAll('li.ex,h1,.crumb,a.jump,.exgroup').forEach(node => node.remove());
    const heading = sheet.querySelector('h1'), footer = sheet.querySelector('a.jump');
    return {
      title: heading ? sourceText(heading) : null, headingVisible: heading ? visible(heading) : false,
      paragraphs, blocks, collisions, formulas, cutoffs, media, exercises,
      exerciseLists: sheet.querySelectorAll('ol.ex').length,
      errors: [...sheet.querySelectorAll('.err,.sr-tex-err,.tex-err,.katex-error')].map(n => n.textContent),
      unresolvedMath: /\$|\\[A-Za-z]{2,}\b|\*\*/.test(literal.textContent),
      viewOnlyExtraneousText: sourceText(viewOnly).trim(),
      expectedVisibleFragments: fragments.map(html => {
        const fragment = document.createElement('div');
        fragment.innerHTML = html;
        return sourceText(fragment);
      }),
      controls: [...sheet.querySelectorAll('input,textarea,select,button,[contenteditable]')].map(node => ({
        tag: node.tagName, type: node.type, disabled: !!node.disabled,
        editable: node.isContentEditable, checked: node.checked ?? false,
      })),
      fonts: [...document.fonts].map(font => ({ family: font.family, status: font.status })),
      fontStatus: document.fonts.status,
      proseCharacters: [...sheet.querySelectorAll('.prose-math,.sr-prose-math')].map(node => ({ text: node.textContent, ...geometry(node) })),
      scriptCount: document.scripts.length,
      footer: footer ? { text: footer.innerText, href: footer.getAttribute('href'), geometry: rect(footer) } : null,
      scroll: { width: document.scrollingElement.scrollWidth, clientWidth: document.scrollingElement.clientWidth,
        height: document.scrollingElement.scrollHeight, viewportWidth: innerWidth },
    };
  }, fragments);
}

function expectedFor(data, kind) {
  if (kind === 'text') return {
    texts: data.flow.filter(b => b.kind !== 'fig').map(b => b.text),
    refs: data.flow.filter(b => b.kind === 'fig').map(b => b.id),
  };
  if (kind === 'choices') return {
    texts: data.supplement.draft.questions.flatMap(q => [q.view.stem, ...q.view.options.map(o => o.text)]),
    refs: data.supplement.draft.questions.flatMap(q => [...q.view.figure_ids, ...q.view.options.flatMap(o => o.figure_ids)]),
  };
  return {
    texts: data.exercises.exercises.flatMap((e, i) => kind === 'answers' ? [e.text, data.supplement.keys.answers[i].displayAnswer] : [e.text]),
    refs: data.exercises.exercises.flatMap(e => (e.figures ?? []).map(f => f.id)),
  };
}

function validateSurface(surface, data, observed) {
  const expected = expectedFor(data, surface.kind);
  surface.expected = { ...expected, math: expected.texts.flatMap(mathTokens) };
  check(surface, observed.headingVisible && observed.title, 'Native heading is visible', observed.title);
  check(surface, observed.scriptCount === 0, 'No scripts in unchanged native HTML');
  check(surface, observed.errors.length === 0 && !observed.unresolvedMath, 'No unresolved math/error markers', observed.errors);
  check(surface, observed.fontStatus === 'loaded' && observed.fonts.length === surface.inputHTML.embeddedFontFaces
    && observed.fonts.length > 0 && !observed.fonts.some(font => font.status === 'error'), 'Native embedded font readiness', observed.fonts);
  check(surface, observed.scroll.width <= observed.scroll.clientWidth && observed.scroll.width <= surface.viewport.width,
    'Zero whole-page horizontal overflow', observed.scroll);
  check(surface, observed.cutoffs.length === 0, 'No prose/control/answer cutoffs', observed.cutoffs);
  check(surface, observed.collisions.length === 0, 'No incoherent block or option overlap', observed.collisions);
  check(surface, isDeepStrictEqual(observed.formulas.map(({ tex, display }) => ({ tex, display })), surface.expected.math),
    'Complete ordered native formula sources and display modes', observed.formulas.map(({ tex, display }) => ({ tex, display })));
  check(surface, observed.formulas.every(m => m.visual && m.visual.width > 0 && m.visual.height > 0
    && m.geometry.fontSize >= 16 && m.geometry.fontFamily.includes('KaTeX_Main') && m.cutoffs.length === 0
    && (!m.scroll || (m.scroll.width > 0 && (m.scroll.contentWidth <= m.scroll.width + 1 || ['auto', 'scroll'].includes(m.scroll.overflowX))))),
  'Visible readable complete native formulas; native horizontal scroll is not clipping', observed.formulas);
  check(surface, isDeepStrictEqual(observed.media.map(m => m.id), expected.refs), 'All native figures in exact surface order', observed.media.map(m => m.id));
  for (const media of observed.media) {
    const spec = data.specs.get(media.id);
    if (!check(surface, !!spec, 'Referenced figure has native FigureSpec', media.id)) continue;
    check(surface, media.geometry.height > 0 && media.mediaGeometry?.width > 0 && media.mediaGeometry?.height > 0,
      'Positive actual figure media dimensions', media);
    check(surface, media.layout === spec.display.layout, 'Native figure layout follows spec', media.id);
    check(surface, media.mode === spec.mode, 'Native media mode follows spec', media.id);
    const expectedLabels = spec.objects.filter(object => object.type === 'text' && object.visible !== false)
      .map(object => ({ id: object.id, text: object.text })).sort((a, b) => a.id.localeCompare(b.id));
    const actualLabels = media.labels.map(label => ({ id: label.id, text: label.text }))
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));
    check(surface, isDeepStrictEqual(actualLabels, expectedLabels), 'Complete FigureSpec label IDs and exact text', {
      id: media.id, expected: expectedLabels, actual: actualLabels,
    });
    if (media.labels.some(label => label.text.includes('\u20d7'))) {
      check(surface, media.preparedFont === 'katex-main'
        && media.labels.filter(label => label.text.includes('\u20d7')).every(label => label.font.includes('KaTeX_Main')),
      'Native combining-vector labels use the prepared complete-glyph font', media.id);
    }
    if (media.layout === 'scroll') check(surface, Math.abs(media.mediaGeometry.width - 640) <= 0.01,
      'Scroll media labels measured at actual fixed640scroll width', { id: media.id, width: media.mediaGeometry.width });
    check(surface, media.images.every(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
      && img.geometry.width > 0 && img.geometry.height > 0), 'Native raster/layer images loaded', media.images);
    check(surface, media.images.every(img => Math.abs(
      img.geometry.width / img.geometry.height - img.naturalWidth / img.naturalHeight) <= 0.01),
    'Native raster/layer aspect ratio retained', media.images);
    check(surface, media.labels.every(label => label.visible && label.insideMedia && label.sizePx >= spec.display.minTextPx - 0.01),
      'Every label meets spec minimum at actual media width and is uncut', { id: media.id, minTextPx: spec.display.minTextPx, width: media.mediaGeometry?.width, labels: media.labels });
    check(surface, media.labelOverlaps.length === 0, 'No label/label overlap', { id: media.id, overlaps: media.labelOverlaps });
  }
  if (surface.kind === 'text') {
    check(surface, observed.title === (data.displayLesson.printed_title || data.displayLesson.title), 'Exact language display title', observed.title);
    check(surface, isDeepStrictEqual(observed.paragraphs.map(p => p.text), data.outline.map(p => p.text)),
      'Every exact complete native paragraph', observed.paragraphs.map(p => p.text));
    check(surface, observed.paragraphs.every(p => p.geometry.width > 0 && p.geometry.height > 0
      && p.geometry.visibility === 'visible' && p.geometry.display !== 'none' && parseFloat(p.geometry.textIndent) === 0),
    'All paragraphs visible and unindented');
    check(surface, observed.proseCharacters.every(p => p.fontFamily.includes('KaTeX_Main') && p.fontSize >= 16),
      'Native prose math-character typography', observed.proseCharacters);
    const intendedFlow = data.flow.map(b => ({ kind: b.kind, text: b.text || '', ...(b.kind === 'fig' ? { id: b.id } : {}) }));
    const actualFlow = observed.blocks.filter(b => b.kind !== 'other').map(b => ({
      kind: b.kind, text: b.kind === 'fig' ? '' : b.text, ...(b.kind === 'fig' ? { id: b.id } : {}),
    }));
    check(surface, isDeepStrictEqual(actualFlow, intendedFlow), 'Exact production proseFlow/figure/caption sequence', actualFlow);
    check(surface, isDeepStrictEqual(observed.paragraphs.filter(p => p.sectionBreak).map(p => p.index), data.indices),
      'Exact production sectionBreakIndices', data.indices);
    surface.boundaries = data.indices.map(index => ({
      index, before: data.outline[index - 1].text, after: data.outline[index].text,
      actualBefore: observed.paragraphs[index - 1]?.text, actualAfter: observed.paragraphs[index]?.text,
      borderTop: observed.paragraphs[index]?.borderTop,
    }));
    check(surface, surface.boundaries.every(b => b.before === b.actualBefore && b.after === b.actualAfter && b.borderTop >= 1),
      'Native adjacent boundary strings with visible section rule', surface.boundaries);
    check(surface, observed.exercises.length === 0 && observed.controls.length === 0, 'Text contains no exercise/edit controls');
    check(surface, observed.footer?.href === 'exercises.html'
      && new RegExp(`\\b${data.exercises.count}\\b`).test(observed.footer.text), 'Native exercise footer/count', observed.footer);
  } else {
    const expectedCount = surface.kind === 'choices' ? data.supplement.draft.questions.length : data.exercises.count;
    check(surface, observed.exercises.length === expectedCount, 'Derived original exercise or draft choice count', {
      expected: expectedCount, actual: observed.exercises.length,
    });
    check(surface, observed.exercises.every(e => e.bodyVisible), 'Every nonempty exercise body visible');
    if (surface.kind === 'exercises') {
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.text), data.exercises.exercises.map(e => e.text)),
        'Exact finalized original exercise prose', observed.exercises.map(e => e.text));
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.id), data.exercises.exercises.map(e => `ex-${e.number}`)),
        'Original exercise IDs/order');
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.number), data.exercises.exercises.map(e => {
        const n = nativeHelpers.sourceNumberForArtifact(e);
        return n == null ? '' : `${n}.`;
      })), 'Original printed exercise numbers');
      check(surface, observed.controls.length === 0 && observed.exercises.every(e => !e.details.length && !e.options.length),
        'Original written surface has no choice/answer/editor content');
      if (data.exercises.count === 0) {
        surface.emptyExerciseInterpretation = 'Valid native zero-count/source-count/exercises with no lists, paragraphs, math, media or controls; no positive-height empty-container assertion.';
        check(surface, observed.exerciseLists === 0 && observed.paragraphs.length === 0 && observed.formulas.length === 0
          && observed.media.length === 0, 'Correct finalized empty exercise surface');
      }
      check(surface, observed.footer?.href === 'text.html', 'Native exercise return link', observed.footer);
    }
    if (surface.kind === 'choices') {
      const questions = data.supplement.draft.questions;
      let cursor = 0;
      const expectedViews = questions.map(question => ({
        stem: observed.expectedVisibleFragments[cursor++],
        options: question.view.options.map(() => observed.expectedVisibleFragments[cursor++]),
      }));
      check(surface, observed.title === data.supplement.titles.choices, 'Exact language-bound supplemental choice title', observed.title);
      check(surface, cursor === observed.expectedVisibleFragments.length, 'Every derived view fragment is accounted for');
      check(surface, observed.viewOnlyExtraneousText === '', 'Choice surface contains only native view content', observed.viewOnlyExtraneousText);
      check(surface, isDeepStrictEqual(observed.exercises.map(e => e.questionId), questions.map(q => q.id)), 'All reviewed choice IDs in order');
      check(surface, observed.exercises.every((e, i) => e.text === expectedViews[i]?.stem),
        'All complete meaningful draft stems, view only', observed.exercises.map(e => e.text));
      for (const [i, exercise] of observed.exercises.entries()) {
        const question = questions[i];
        if (!question) continue;
        check(surface, exercise.options.length === question.view.options.length
          && exercise.options.every((option, j) => option.text === expectedViews[i]?.options[j]
            && option.visible && option.disabled && !option.checked
            && option.type === (question.view.mode === 'single' ? 'radio' : 'checkbox')),
        'Derived option count, exact alternatives, meaningful disabled native controls', { question: question.id, options: exercise.options });
        check(surface, exercise.details.length === 0, 'No answer details leaked to choice view', question.id);
      }
      const count = questions.reduce((n, q) => n + q.view.options.length, 0);
      check(surface, observed.controls.length === count
        && observed.controls.every(c => c.tag === 'INPUT' && ['radio', 'checkbox'].includes(c.type)
          && c.disabled && !c.checked && !c.editable), 'Choice controls are only derived disabled unselected alternatives', observed.controls);
    }
    if (surface.kind === 'answers') {
      check(surface, observed.title === data.supplement.titles.answers, 'Exact language-bound supplemental answer title', observed.title);
      check(surface, observed.expectedVisibleFragments.length === data.exercises.count * 2, 'All derived prompt and answer fragments accounted for');
      check(surface, observed.controls.length === 0, 'No editable inputs or choice controls in answer surface', observed.controls);
      check(surface, observed.exercises.every((e, i) => e.text === observed.expectedVisibleFragments[i * 2]
        && e.details.length === 1 && e.details[0].open && e.details[0].visible
        && e.answer === observed.expectedVisibleFragments[i * 2 + 1] && e.options.length === 0),
      'All six corresponding original prompts and complete reviewed standard answers open', observed.exercises);
    }
  }
}

async function platformFonts(page) {
  const session = await context.newCDPSession(page);
  try {
    await session.send('DOM.enable');
    await session.send('CSS.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeIds } = await session.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'figure svg text' });
    const rows = [];
    for (const nodeId of nodeIds) {
      const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
      rows.push({ nodeId, fonts });
    }
    return rows;
  } finally {
    await session.detach();
  }
}

async function recordScreenshot(surface, file, buffer, extra) {
  const metadata = await sharp(buffer).metadata();
  const screenshot = { surface: surface.id, ...outputBinding(file), width: metadata.width, height: metadata.height,
    inputHTML: surface.inputHTML, deviceScaleFactor: 1, ...extra, tiles: [] };
  result.screenshots.push(screenshot);
  surface.screenshots.push(screenshot);
  // Tiles are unscaled extracts from the actual screenshot, not resampled thumbnails.
  const tileHeight = 1536;
  for (let top = 0; top < metadata.height; top += tileHeight) {
    const region = { left: 0, top, width: metadata.width, height: Math.min(tileHeight, metadata.height - top) };
    let binding = outputBinding(file);
    if (metadata.height > tileHeight) {
      const tileFile = file.replace(/\.png$/, `-tile-${String(screenshot.tiles.length + 1).padStart(3, '0')}.png`);
      await sharp(buffer).extract(region).png().toFile(tileFile);
      binding = outputBinding(tileFile);
    }
    const tile = { surface: surface.id, ...binding, screenshot: outputBinding(file), region,
      originalPixels: true, resampled: false, screenshotCoverage: { x: 0, y: top, width: region.width, height: region.height },
      ...(extra.documentCoverage ? { documentCoverage: {
        x: extra.documentCoverage.x, y: extra.documentCoverage.y + top, width: region.width, height: region.height,
      } } : {}),
      ...(extra.figureCoverage ? { figureCoverage: {
        id: extra.figureCoverage.id, x: extra.figureCoverage.x, y: extra.figureCoverage.y + top,
        width: region.width, height: region.height, mediaWidth: extra.figureCoverage.mediaWidth,
      } } : {}) };
    screenshot.tiles.push(tile);
    result.tiles.push(tile);
  }
  screenshot.coverage = { exact: true, noGaps: true, noOverlap: true,
    width: metadata.width, height: metadata.height,
    coveredPixels: screenshot.tiles.reduce((n, tile) => n + tile.region.width * tile.region.height, 0) };
  check(surface, screenshot.coverage.coveredPixels === metadata.width * metadata.height, 'Exact original-pixel tile coverage');
  return screenshot;
}

async function inkPixels(buffer, excluded = [], mediaRegion = null) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const area = mediaRegion ?? { x: 0, y: 0, width: info.width, height: info.height };
  const scan = {
    left: Math.max(3, Math.ceil(area.x) + 3), top: Math.max(3, Math.ceil(area.y) + 3),
    right: Math.min(info.width - 3, Math.floor(area.x + area.width) - 3),
    bottom: Math.min(info.height - 3, Math.floor(area.y + area.height) - 3),
  };
  const mask = Buffer.alloc(info.width * info.height);
  for (const r of excluded) {
    const left = Math.max(0, Math.floor(r.x - 2)), right = Math.min(info.width, Math.ceil(r.x + r.width + 2));
    const top = Math.max(0, Math.floor(r.y - 2)), bottom = Math.min(info.height, Math.ceil(r.y + r.height + 2));
    if (right <= left || bottom <= top) continue;
    for (let y = top; y < bottom; y++) mask.fill(1, y * info.width + left, y * info.width + right);
  }
  let ink = 0, inspected = 0;
  for (let y = scan.top; y < scan.bottom; y++) {
    for (let x = scan.left; x < scan.right; x++) {
      if (mask[y * info.width + x]) continue;
      const offset = (y * info.width + x) * info.channels;
      inspected++;
      if (Math.min(data[offset], data[offset + 1], data[offset + 2]) < 210) ink++;
    }
  }
  return { width: info.width, height: info.height, inspectedPixels: inspected,
    nonLabelInkPixels: ink, nonblank: ink >= 100, scanRegion: scan,
    excludesLabelsAndOuterThreePixels: true, excludesScrollbar: !!mediaRegion };
}

async function capture(surface, page, observed) {
  await page.evaluate(() => {
    document.querySelectorAll('.nb,.sr-nb,figure.fig,li.ex .body').forEach(node => { node.scrollLeft = 0; });
    scrollTo(0, 0);
  });
  const fullFile = path.join(run, `${surface.id}-fullpage.png`);
  const fullBuffer = await page.screenshot({ path: fullFile, fullPage: true, animations: 'disabled', timeout: 30000 });
  const full = await recordScreenshot(surface, fullFile, fullBuffer, {
    kind: 'full-page', fullPage: true, documentCoverage: { x: 0, y: 0 }, nativeScrollPosition: 'start',
  });
  surface.mediaPixels = [];
  for (const media of observed?.media ?? []) {
    try {
      const left = Math.max(0, Math.ceil(media.mediaGeometry.x));
      const top = Math.max(0, Math.ceil(media.mediaGeometry.y));
      const width = Math.floor(Math.min(media.mediaGeometry.x + media.mediaGeometry.width,
        media.geometry.x + media.clientWidth, full.width)) - left;
      const height = Math.floor(Math.min(media.mediaGeometry.y + media.mediaGeometry.height, full.height)) - top;
      assert.ok(width > 0 && height > 0, `No visible screenshot media area: ${media.id}`);
      const buffer = await sharp(fullBuffer).extract({ left, top, width, height }).png().toBuffer();
      const excluded = media.labels.map(label => ({ ...label.geometry, x: label.geometry.x - left, y: label.geometry.y - top }));
      const pixels = { id: media.id, screenshot: outputBinding(fullFile), rectangle: { left, top, width, height },
        ...await inkPixels(buffer, excluded) };
      surface.mediaPixels.push(pixels);
      check(surface, pixels.nonblank, 'Actual figure content, not only labels/border, is nonblank in screenshot pixels', pixels);
    } catch (error) {
      failure(surface, `Figure pixel check: ${media.id}`, error);
    }
  }
  surface.horizontalCoverage = [];
  const scrollers = await page.evaluate(() => [...document.querySelectorAll('figure.fig,.nb,.sr-nb,li.ex .body')]
    .map((node, index) => ({ index, id: node.id || null, tag: node.tagName,
      width: node.clientWidth, contentWidth: node.scrollWidth }))
    .filter(node => node.contentWidth > node.width + 1));
  const locator = page.locator('figure.fig,.nb,.sr-nb,li.ex .body');
  for (const scroller of scrollers) {
    const node = locator.nth(scroller.index);
    const spans = [];
    try {
      assert.ok(scroller.width > 0, 'Scrollable container has no width');
      const max = scroller.contentWidth - scroller.width;
      const offsets = [...new Set([0, ...Array.from({ length: Math.ceil(max / scroller.width) },
        (_, i) => Math.min((i + 1) * scroller.width, max)), max])];
      for (const [i, offset] of offsets.entries()) {
        const metrics = await node.evaluate((element, offset) => {
          element.scrollLeft = offset;
          const r = element.getBoundingClientRect(), media = element.querySelector('.figure-media');
          const mediaBox = media?.getBoundingClientRect();
          return { left: element.scrollLeft, width: element.clientWidth, contentWidth: element.scrollWidth,
            geometry: { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height },
            mediaWidth: media?.getBoundingClientRect().width ?? null,
            mediaRegion: mediaBox ? { x: mediaBox.x - r.x, y: mediaBox.y - r.y, width: mediaBox.width, height: mediaBox.height } : null,
            labels: [...element.querySelectorAll('svg text')].map(label => {
              const b = label.getBoundingClientRect();
              return { x: b.x - r.x, y: b.y - r.y, width: b.width, height: b.height };
            }) };
        }, offset);
        check(surface, Math.abs(metrics.left - offset) <= 1, 'Native horizontal content position reachable', { scroller, offset, metrics });
        const file = path.join(run, `${surface.id}-scroll-${scroller.index}-${i === offsets.length - 1 ? 'end' : `part-${i + 1}`}.png`);
        const buffer = await node.screenshot({ path: file, animations: 'disabled', timeout: 30000 });
        const screenshot = await recordScreenshot(surface, file, buffer, {
          kind: 'native-horizontal-scroll-crop', fullPage: false,
          scroller: { index: scroller.index, id: scroller.id, tag: scroller.tag },
          scrollLeft: metrics.left, scrollEnd: i === offsets.length - 1,
          ...(scroller.tag === 'FIGURE' ? { figureCoverage: {
            id: scroller.id, x: metrics.left, y: 0, mediaWidth: metrics.mediaWidth,
          } } : {}),
        });
        spans.push({ start: metrics.left, end: metrics.left + metrics.width, screenshot: outputBinding(file) });
        if (scroller.tag === 'FIGURE') {
          const pixels = await inkPixels(buffer, metrics.labels, metrics.mediaRegion);
          surface.mediaPixels.push({ id: scroller.id, scrollLeft: metrics.left, screenshot: outputBinding(file), ...pixels });
          check(surface, pixels.nonblank, 'Actual scroll-figure content nonblank at captured span', pixels);
        }
        screenshot.nativeContentRange = { start: metrics.left, end: metrics.left + metrics.width, contentWidth: metrics.contentWidth };
      }
      const sorted = [...spans].sort((a, b) => a.start - b.start);
      const exact = sorted[0]?.start <= 1 && sorted.at(-1)?.end >= scroller.contentWidth - 1
        && sorted.slice(1).every((span, i) => span.start <= sorted[i].end + 1);
      surface.horizontalCoverage.push({ ...scroller, spans, exactCoverageWithoutGaps: exact, endReachable: sorted.at(-1)?.end >= scroller.contentWidth - 1 });
      check(surface, exact, 'Native horizontal content fully covered and mobile figure end reachable', { scroller, spans });
    } catch (error) {
      failure(surface, `Scroll capture: ${scroller.id ?? scroller.index}`, error);
    } finally {
      await node.evaluate(element => { element.scrollLeft = 0; }).catch(error => failure(surface, 'Reset native scroll position', error));
    }
  }
  surface.pageEnd = await page.evaluate(() => {
    scrollTo(0, document.scrollingElement.scrollHeight);
    const end = document.querySelector('.sheet')?.lastElementChild?.getBoundingClientRect();
    return { reached: scrollY + innerHeight >= document.scrollingElement.scrollHeight - 1,
      lastContentVisible: !!end && end.bottom <= innerHeight + 1 && end.bottom > 0,
      pageY: scrollY, height: document.scrollingElement.scrollHeight };
  });
  check(surface, surface.pageEnd.reached && surface.pageEnd.lastContentVisible, 'Page and final native content reachable', surface.pageEnd);
  if (full.height > surface.viewport.height) {
    const file = path.join(run, `${surface.id}-page-end.png`);
    const buffer = await page.screenshot({ path: file, animations: 'disabled', timeout: 30000 });
    await recordScreenshot(surface, file, buffer, {
      kind: 'vertical-scroll-end', fullPage: false, documentCoverage: { x: 0, y: surface.pageEnd.pageY },
    });
  }
}

async function visit(data, kind, viewport) {
  const surface = {
    id: `${data.card}-${data.language}-${kind}-${viewport.width}x${viewport.height}`,
    card: data.card, language: data.language, kind, viewport, status: 'RUNNING',
    inputHTML: data.html[kind], nativeResult: data.nativeResult,
    failures: [], screenshots: [], pageErrors: [], consoleErrors: [], requestFailures: [],
  };
  result.surfaces.push(surface);
  const page = await context.newPage();
  let loaded = false, observed;
  page.on('pageerror', error => surface.pageErrors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') surface.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => surface.requestFailures.push({ url: request.url(), failure: request.failure() }));
  try {
    assert.ok(surface.inputHTML, 'Supplemental HTML assembly did not produce this surface; no stale capture');
    await page.setViewportSize(viewport);
    const url = pathToFileURL(surface.inputHTML.path).href;
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    loaded = page.url() === url;
    await page.evaluate(async () => { await document.fonts.ready; });
    observed = await inspectPage(page, data.supplement?.fragments[kind] ?? []);
    surface.observed = observed;
    validateSurface(surface, data, observed);
    surface.platformFonts = await platformFonts(page);
    check(surface, surface.platformFonts.every(row => row.fonts.some(font => font.glyphCount > 0)),
      'Actual native label glyph font use', surface.platformFonts);
  } catch (error) {
    failure(surface, 'Surface inspection failed; no repair or replay', error);
  } finally {
    // A failed assertion/inspection must still retain its own captures, never the previous page.
    if (loaded) {
      if (kind === 'exercises' && viewport.width === viewports[0].width
        && data.supplement && !data.supplement.assemblyAttempted) {
        try { await assembleSupplement(page, data, surface); }
        catch (error) { failure(surface, 'Supplemental HTML assembly failed; no native replay or retry', error); }
      }
      try { await capture(surface, page, observed); }
      catch (error) { failure(surface, 'Surface capture failed', error); }
    } else check(surface, false, 'No screenshot of a stale/unloaded surface');
    check(surface, surface.pageErrors.length === 0 && surface.consoleErrors.length === 0 && surface.requestFailures.length === 0,
      'No page/console/resource failures', { page: surface.pageErrors, console: surface.consoleErrors, requests: surface.requestFailures });
    check(surface, surface.screenshots.some(s => s.fullPage), 'Full-page capture retained for this surface');
    await page.close().catch(error => failure(surface, 'Close surface page', error));
    surface.status = surface.failures.length ? 'FAIL-preserved-no-repair' : 'PASS-mechanical';
    console.log(`${surface.id}: ${surface.status} (${surface.failures.length} failures)`);
  }
}

try {
  const args = argumentsFor(process.argv.slice(2));
  result.manifest = bind(args.manifest, 'final-batch-manifest', args.sha256);
  run = path.join(out, `run-${args.sha256.slice(0, 12)}-${new Date().toISOString().replace(/[:.]/g, '-')}`);
  fs.mkdirSync(run, { recursive: false });
  result.execution.command = `cd ${JSON.stringify(path.join(repo, 'app'))} && node ${JSON.stringify(path.join(out, 'check.mjs'))} --manifest ${JSON.stringify(args.manifest)} --sha ${args.sha256}`;
  result.execution.script = bind(path.join(out, 'check.mjs'), 'display-check-script');
  const manifest = read(args.manifest);
  assert.ok(Array.isArray(manifest.cards));
  assert.deepEqual(manifest.cards.map(item => item.card).sort(), [...cards].sort(), 'Manifest must bind exactly n38,n39,n40,n44');
  result.fullWaveSurfaceCount = 40;
  result.expectedSurfaceCount = manifest.supplemental ? 40 : 32;
  result.supplementalPending = !manifest.supplemental;
  result.missingSurfaces = manifest.supplemental ? [] : ['en', 'zh'].flatMap(language =>
    ['choices', 'answers'].flatMap(kind => viewports.map(viewport => ({
      card: 'phy10-c1-s5-n39', language, kind, viewport,
    }))));
  result.productionHelpers = [
    'htmlfrag.js', 'prose_flow.mjs', 'render_lesson.js', 'publish_merge.js', 'choice_html.mjs',
  ].map(name => bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools', name), 'production-helper-reference'));
  nativeHelpers = { ...requireNative('./htmlfrag.js'), ...requireNative('./publish_merge.js') };
  const languages = manifest.cards.flatMap(loadNative);
  if (manifest.supplemental) {
    loadSupplement(manifest.supplemental, languages);
    ({ choiceHtml } = await import(pathToFileURL(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs')).href));
    result.productionHelpers.push(bind(path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/retain-choice-ex1.mjs'), 'supplemental-template-reference-only'));
  }
  // Screenshot processing uses the desktop's existing bundled image runtime.
  result.execution.playwrightPackage = bind(requireApp.resolve('playwright/package.json'), 'app-installed-playwright');
  result.execution.playwrightVersion = requireApp('playwright/package.json').version;
  const runtimePackages = '/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
  const requireRuntime = createRequire(path.join(runtimePackages, 'sharp/package.json'));
  const sharpPath = requireRuntime.resolve('sharp');
  assert.ok(fs.realpathSync(sharpPath).startsWith(`${runtimePackages}${path.sep}`),
    'sharp must come from the verified desktop runtime; no installation');
  result.execution.sharp = bind(sharpPath, 'bundled-desktop-sharp');
  sharp = requireRuntime('sharp');
  const { chromium } = requireApp('playwright');
  delete process.env.PWDEBUG;
  process.env.PLAYWRIGHT_HTML_OPEN = 'never';
  result.execution.browserLaunches = 1;
  browser = await chromium.launch({ channel: 'chrome', headless: true,
    args: ['--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run'] });
  result.execution.browserPasses = 1;
  result.execution.browserVersion = browser.version();
  context = await browser.newContext({ viewport: viewports[0], deviceScaleFactor: 1,
    offline: true, serviceWorkers: 'block', acceptDownloads: false });
  result.execution.isolatedContexts = 1;
  for (const data of languages) for (const html of Object.values(data.html)) allowedHTML.add(pathToFileURL(html.path).href);
  await context.route('**/*', async route => {
    const request = route.request(), url = request.url();
    if (url.startsWith('data:') || (request.isNavigationRequest() && allowedHTML.has(url))) await route.continue();
    else {
      result.externalRequests.push({ url, resourceType: request.resourceType() });
      await route.abort('blockedbyclient');
    }
  });
  result.status = 'RUNNING';
  for (const data of languages) {
    for (const viewport of viewports) {
      for (const kind of ['text', 'exercises', ...(data.supplement ? ['choices', 'answers'] : [])]) {
        try { await visit(data, kind, viewport); }
        catch (error) { failure(null, `${data.card}/${data.language}/${kind}/${viewport.width}: unhandled surface error; continuing`, error); }
      }
    }
  }
  check(null, result.surfaces.length === result.expectedSurfaceCount, 'Every planned surface visited', result.surfaces.length);
  check(null, result.surfaces.filter(s => s.screenshots.some(image => image.fullPage)).length === result.expectedSurfaceCount,
    'Every planned surface has an independent full-page screenshot');
  check(null, result.externalRequests.length === 0, 'No network or unbound local resource requested', result.externalRequests);
  if (manifest.supplemental) check(null, result.execution.supplementalHTMLAssemblies === 2
    && result.execution.supplementalHTMLFiles === 4, 'Both supplemental languages assembled exactly once within this browser pass',
  { assemblies: result.execution.supplementalHTMLAssemblies, files: result.execution.supplementalHTMLFiles });
} catch (error) {
  failure(null, 'Preflight/execution stopped', error);
} finally {
  try { if (context) await context.close(); }
  catch (error) { failure(null, 'Context close failed', error); }
  finally {
    try {
      if (browser) {
        await browser.close();
        result.execution.browserClosed = true;
      } else result.execution.browserClosed = null;
    } catch (error) {
      result.execution.browserClosed = false;
      failure(null, 'Browser close failed', error);
    }
  }
  result.inputsAfter = [...immutable.values()].map(binding => {
    try {
      const afterSha256 = hash(binding.path);
      return { ...binding, afterSha256, unchanged: afterSha256 === binding.sha256 };
    } catch (error) { return { ...binding, unchanged: false, error: String(error) }; }
  });
  result.inputHTMLUnchanged = result.inputsAfter.filter(input => input.role === 'immutable-inputHTML');
  check(null, result.inputsAfter.every(input => input.unchanged), 'All consumed native inputs and render inputHTML remain byte-unchanged',
    result.inputsAfter.filter(input => !input.unchanged));
  result.finishedAt = new Date().toISOString();
  result.status = result.failures.length ? 'FAIL-preserved-no-repair'
    : result.supplementalPending ? 'PASS-mechanical-32-surfaces-supplemental-pending'
      : 'PASS-mechanical-40-surfaces-independent-display-review-pending';
  if (run) {
    const reviewBatches = [];
    for (let i = 0; i < result.tiles.length; i += 8) {
      reviewBatches.push({ batch: reviewBatches.length + 1, maxImageOpens: 8,
        assets: result.tiles.slice(i, i + 8), status: 'PENDING-fresh-independent-reviewer',
        imagesOpenedByCommand: 0 });
    }
    result.screenshotManifest = write('screenshot-manifest.json', {
      schema: 'offline-wave-screenshot-manifest@1', ticket, manifest: result.manifest,
      expectedSurfaceCount: result.expectedSurfaceCount, browserPasses: result.execution.browserPasses,
      deviceScaleFactor: 1, screenshotsOpenedByCommand: 0, screenshots: result.screenshots,
    });
    result.tileManifest = write('tile-manifest.json', {
      schema: 'offline-wave-original-pixel-tiles@1', ticket, manifest: result.manifest,
      tileHeightPx: 1536, resampled: false, imagesOpenedByCommand: 0,
      tiles: result.tiles, reviewBatches,
      coverage: result.screenshots.map(s => ({ screenshot: outputBinding(s.path), surface: s.surface,
        kind: s.kind, coverage: s.coverage, nativeContentRange: s.nativeContentRange ?? null,
        documentCoverage: s.documentCoverage ?? null, figureCoverage: s.figureCoverage ?? null })),
    });
    const binding = write('result.json', result);
    console.log(JSON.stringify({ status: result.status, surfaces: result.surfaces.length,
      failures: result.failures.map(f => ({ surface: f.surface, label: f.label, details: f.details })),
      result: binding, screenshotManifest: result.screenshotManifest, tileManifest: result.tileManifest }, null, 2));
  } else console.error(JSON.stringify({ status: result.status, failures: result.failures }, null, 2));
  process.exitCode = result.failures.length ? 1 : 0;
}
