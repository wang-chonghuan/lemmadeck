import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(own, '../../../../..');
const tmp = path.dirname(own);
const lesson = 'phy10-c1-s5-n39';
const edition = 'modern-us-neutral';
const tool = path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'));
const receipt = filename => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
});

function owned(filename) {
  const resolved = path.resolve(filename);
  assert(resolved.startsWith(`${own}/`), `Write outside ownership: ${resolved}`);
  return resolved;
}

function writeJson(filename, data) {
  owned(filename);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
}

function copy(source, destination, inputs) {
  owned(destination);
  const data = fs.readFileSync(source);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, data, { flag: 'wx' });
  inputs.push({ source: receipt(source), snapshot: receipt(destination) });
}

async function prepare() {
  const inputs = [];
  const commands = [];
  const canonical = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/answers.json');
  assert.equal(read(canonical).answers.filter(item => item.lesson === lesson).length, 0);
  for (const language of ['en', 'zh']) {
    const native = path.join(tmp, 'd046-n39-native', language);
    const nativeRoot = path.join(native, 'root');
    const authority = path.join(native, language === 'en' ? 'display-root' : 'root');
    const root = path.join(own, language, 'root');
    const work = path.join(own, language, 'work');
    const book = path.join(root, '10p');
    copy(path.join(nativeRoot, '10p/book.json'), path.join(book, 'book.json'), inputs);
    copy(canonical, path.join(book, 'answers.json'), inputs);
    for (const name of ['lesson.json', 'exercises.json']) {
      copy(
        path.join(nativeRoot, '10p/lessons', lesson, name),
        path.join(book, 'lessons', lesson, name),
        inputs,
      );
    }
    const editionRoot = path.join(book, 'editions', edition);
    const sourceEdition = path.join(authority, '10p/editions', edition);
    for (const name of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']) {
      copy(
        path.join(sourceEdition, 'lessons', lesson, name),
        path.join(editionRoot, 'lessons', lesson, name),
        inputs,
      );
    }
    const exercises = read(path.join(editionRoot, 'lessons', lesson, 'exercises.json'));
    assert.deepEqual(exercises.exercises.map(item => item.number), ['1', '2', '3', '4', '5', '6']);
    assert.equal(read(path.join(book, 'book.json')).exercise_numbering, 'lesson');
    for (const figure of read(path.join(editionRoot, 'lessons', lesson, 'figures.json')).figures) {
      for (const name of [figure.svg, figure.spec, figure.review, figure.render].filter(Boolean)) {
        copy(path.join(sourceEdition, name), path.join(editionRoot, name), inputs);
      }
      copy(
        path.join(nativeRoot, '10p/figures', `${figure.id}.png`),
        path.join(book, 'figures', `${figure.id}.png`),
        inputs,
      );
    }
    const contextRoot = path.join(tmp, 'd046-n38-native', language, language === 'en' ? 'display-root' : 'root');
    copy(
      path.join(contextRoot, '10p/editions', edition, 'lessons/phy10-c1-s5-n38/lesson.json'),
      path.join(own, 'context', language, 'n38.lesson.json'),
      inputs,
    );
    const argv = [
      '-B', tool, 'prepare', '--book', '10p', '--edition', edition,
      '--lesson', lesson, '--root', root, '--work', work,
    ];
    const result = spawnSync('python3', argv, {
      cwd: repo,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      encoding: 'utf8',
      timeout: 60000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    assert.equal(result.status, 0, result.stderr || result.stdout || String(result.error));
    const templatePath = path.join(work, '10p', edition, 'lessons', lesson, 'answer-keys.template.json');
    const template = read(templatePath);
    assert.equal(template.status, 'draft');
    assert.equal(template.answers.length, 6);
    assert(template.answers.every(item => item.source === 'derived' && !('bookRaw' in item)));
    assert.deepEqual(template.answers[5].figureEvidence.map(item => item.id), ['fig-70']);
    for (const evidence of template.answers[5].figureEvidence) {
      for (const filename of [evidence.originalPng, evidence.editionAsset, evidence.figureSpec]) {
        assert(fs.existsSync(filename), `Missing prepared figure evidence: ${filename}`);
      }
    }
    commands.push({
      language, executable: 'python3', argv, cwd: repo, exitCode: result.status,
      stdout: result.stdout, stderr: result.stderr, template: receipt(templatePath),
      output: path.join(editionRoot, 'lessons', lesson, 'answer-keys.json'),
      count: 6, source: 'derived', capturedMatches: 0,
    });
  }
  const report = {
    ticket: 'STEMROBIN-181', task: 'D029 n39 fresh offline answer AUTHOR',
    createdAt: new Date().toISOString(), status: 'native-prepare-complete-only',
    tool: receipt(tool), inputs, commands,
    canonicalAnswerEvidence: { ...receipt(canonical), totalEntries: read(canonical).answers.length, matchingN39: 0 },
    constraints: {
      writes: own, offline: true, finalization: 'parent-owned-after-independent-review',
      gate2Approval: false, publish: false, judging: false, interactions: false,
      parts: 'Native schema requires empty parts arrays for ungraded whole-task standards.',
      sourceCaveat: 'EN display-root lacks original PNGs; original images and book metadata copied from current n39 EN native root, with hashes.',
    },
  };
  writeJson(path.join(own, 'prepare-receipt.json'), report);
  console.log(JSON.stringify({ receipt: receipt(path.join(own, 'prepare-receipt.json')), commands }, null, 2));
}

async function renderFigure() {
  const browserTmp = path.join(own, 'browser-tmp');
  fs.mkdirSync(browserTmp, { recursive: true });
  process.env.TMPDIR = browserTmp;
  const require = createRequire(path.join(repo, 'app/package.json'));
  const { chromium } = require('playwright');
  const svgPath = path.join(own, 'en/root/10p/editions', edition, 'figures/fig-70.svg');
  const zhPath = path.join(own, 'zh/root/10p/editions', edition, 'figures/fig-70.svg');
  assert.equal(receipt(svgPath).sha256, receipt(zhPath).sha256);
  const imageData = fs.readFileSync(svgPath).toString('base64');
  const browser = await chromium.launch({
    headless: true, downloadsPath: browserTmp, tracesDir: browserTmp,
  });
  const screenshots = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 3060 }, deviceScaleFactor: 1,
      offline: true, serviceWorkers: 'block',
    });
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    await page.setContent(`<style>html,body{margin:0;padding:0;background:white}img{display:block;width:1280px;height:3060px}</style><img src="data:image/svg+xml;base64,${imageData}" alt="">`);
    await page.locator('img').evaluate(image => image.decode());
    for (const [name, clip] of [
      ['fig-70-approved-modern-a-d.png', { x: 0, y: 0, width: 1280, height: 1720 }],
      ['fig-70-approved-modern-e-f.png', { x: 0, y: 1720, width: 1280, height: 1340 }],
    ]) {
      const filename = path.join(own, 'pixels', name);
      owned(filename);
      assert(!fs.existsSync(filename));
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      await page.screenshot({ path: filename, clip });
      screenshots.push({ ...receipt(filename), clip });
    }
    await context.close();
  } finally {
    await browser.close();
  }
  writeJson(path.join(own, 'figure-pixel-receipt.json'), {
    status: 'local-pixels-rendered-not-reviewed', input: receipt(svgPath),
    identicalZH: receipt(zhPath), screenshots, network: 'offline; all routed requests aborted',
    browser: 'Existing app Playwright/Chromium; headless static SVG rasterization only, not product acceptance.',
  });
  console.log(JSON.stringify({ screenshots }, null, 2));
}

function freezeSolutions() {
  const draftPaths = ['en', 'zh'].map(language => path.join(
    own, language, 'root/10p/editions', edition, 'lessons', lesson, 'answer-keys.json',
  ));
  assert(draftPaths.every(filename => !fs.existsSync(filename)), 'Freeze must precede drafts');
  const preparation = read(path.join(own, 'prepare-receipt.json'));
  assert(preparation.inputs.every(item =>
    receipt(item.source.path).sha256 === item.source.sha256
    && receipt(item.snapshot.path).sha256 === item.snapshot.sha256,
  ), 'Authoritative inputs changed before solution freeze');
  const ledger = read(path.join(own, 'image-opens.json'));
  assert.equal(ledger.contextTotalOpens, 3);
  assert(ledger.batches.every(batch => batch.opened <= 8));
  const report = {
    status: 'working-solutions-frozen-before-draft-no-approval',
    frozenAt: new Date().toISOString(),
    workingSolutions: receipt(path.join(own, 'independent-working-solutions.md')),
    prepareReceipt: receipt(path.join(own, 'prepare-receipt.json')),
    figurePixelReceipt: receipt(path.join(own, 'figure-pixel-receipt.json')),
    imageOpens: receipt(path.join(own, 'image-opens.json')),
    exerciseCount: 6, draftPathsAbsentAtFreeze: draftPaths,
    review: 'pending-independent-review', nativeFinalize: 'parent-owned-not-run',
    solution: { wavelengthIntervals: 12, adjacentPhaseRadians: 'pi/6', adjacentPhaseDegrees: 30 },
  };
  writeJson(path.join(own, 'solution-freeze.json'), report);
  console.log(JSON.stringify({ freeze: receipt(path.join(own, 'solution-freeze.json')), ...report }, null, 2));
}

function freezeDrafts() {
  const freeze = read(path.join(own, 'solution-freeze.json'));
  assert.equal(receipt(freeze.workingSolutions.path).sha256, freeze.workingSolutions.sha256);
  const preparation = read(path.join(own, 'prepare-receipt.json'));
  assert.equal(receipt(tool).sha256, preparation.tool.sha256, 'Native tool changed since prepare');
  const inputChecks = preparation.inputs.map(item => ({
    path: item.source.path,
    preparedSha256: item.source.sha256,
    currentSha256: receipt(item.source.path).sha256,
    snapshotUnchanged: receipt(item.snapshot.path).sha256 === item.snapshot.sha256,
  }));
  assert(inputChecks.every(item => item.snapshotUnchanged), 'Isolated source snapshots changed');
  const languages = [];
  for (const language of ['en', 'zh']) {
    const draftPath = path.join(
      own, language, 'root/10p/editions', edition, 'lessons', lesson, 'answer-keys.json',
    );
    const document = read(draftPath);
    assert.equal(document.status, 'draft');
    assert.equal(document.count, 6);
    assert.equal(document.answers.length, 6);
    for (const answer of document.answers) {
      assert.equal(answer.grading, 'ungraded');
      assert.equal(answer.source, 'derived');
      assert.deepEqual(answer.parts, []);
      assert.deepEqual(Object.keys(answer).sort(), [
        'displayAnswer', 'exercise', 'grading', 'parts', 'source',
      ]);
    }
    const python = [
      'import importlib.util, json, pathlib, sys',
      'spec = importlib.util.spec_from_file_location("native_lesson_answers", sys.argv[1])',
      'module = importlib.util.module_from_spec(spec)',
      'spec.loader.exec_module(module)',
      'profile = module.load(module.MODERN_US_PROFILE)',
      'terms = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])',
      'document, errors = module.validate_lesson(pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3]), "10p", "phy10-c1-s5-n39", "modern-us-neutral", terms)',
      'print(json.dumps({"operation": "validate_lesson_read_only", "errors": errors, "count": len(document.get("answers", [])), "status": document.get("status")}, ensure_ascii=False))',
      'sys.exit(2 if errors else 0)',
    ].join('\n');
    const exercisePath = path.join(path.dirname(draftPath), 'exercises.json');
    const result = spawnSync('python3', ['-B', '-c', python, tool, draftPath, exercisePath], {
      cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      encoding: 'utf8', timeout: 60000, stdio: ['ignore', 'pipe', 'pipe'],
    });
    assert.equal(result.status, 0, result.stderr || result.stdout || String(result.error));
    const nativeCheck = JSON.parse(result.stdout);
    const frozenPath = path.join(own, 'frozen', language, 'answer-keys.json');
    const copies = [];
    copy(draftPath, frozenPath, copies);
    assert.equal(receipt(draftPath).sha256, receipt(frozenPath).sha256);
    assert(!fs.existsSync(path.join(path.dirname(draftPath), 'answer-keys.audit.json')));
    assert(!fs.existsSync(path.join(path.dirname(draftPath), 'interactions.json')));
    languages.push({
      language, exerciseIds: document.answers.map(item => item.exercise),
      draft: receipt(draftPath), frozenDraft: receipt(frozenPath),
      counts: { answers: 6, ungraded: 6, derived: 6, parts: 0, judgingCandidates: 0, bookRaw: 0, interactions: 0 },
      nativePreliminary: { ...nativeCheck, exitCode: result.status, stderr: result.stderr, tool: receipt(tool) },
    });
  }
  const report = {
    ticket: 'STEMROBIN-181', task: 'D029 n39 fresh offline answer AUTHOR',
    status: 'frozen-bilingual-drafts-native-preliminary-clean-awaiting-independent-review',
    completedAt: new Date().toISOString(), helper: receipt(fileURLToPath(import.meta.url)),
    prepareReceipt: receipt(path.join(own, 'prepare-receipt.json')),
    solutionFreeze: receipt(path.join(own, 'solution-freeze.json')),
    workingSolutions: receipt(freeze.workingSolutions.path),
    imageOpens: { receipt: receipt(path.join(own, 'image-opens.json')), count: 3, batches: 1, maximumInBatch: 3 },
    figurePixelReceipt: receipt(path.join(own, 'figure-pixel-receipt.json')),
    languages, inputChecks,
    caveats: [
      'Author-only: no independent Gate 2 review, no self-approval, no native finalize, no ready status or native audit.',
      'Read-only native validate_lesson is preliminary schema/cultural validation only; no MathLive or expression-check finalize subprocess was run.',
      'The native schema requires parts: [] for every ungraded whole-task answer. No nonempty parts, judge, expected, choices, widgets or interaction artifacts exist.',
      'Canonical answer capture has no n39 entries; all six answers per locale are derived and contain no bookRaw.',
      'EN display-root lacks original PNGs; exact original PNG bytes and book metadata came from the current n39 EN native root.',
      'The adjacent phase magnitude pi/6 applies to adjacent balls in the reached harmonic-wave region, not the initially stationary tail.',
      'Static headless offline SVG rasterization was used to inspect actual approved pixels; it is not live product acceptance.',
      'Parent owns independent review, structural/native cap2 finalize and subsequent binding. No publisher was run.',
    ],
    boundaries: { writes: own, envFilesRead: false, db: false, network: false, dependenciesChanged: false, appOrToolWrites: false, gitWrites: false, indexWrites: false, meterWrites: false },
  };
  writeJson(path.join(own, 'result.json'), report);
  console.log(JSON.stringify({
    result: receipt(path.join(own, 'result.json')),
    status: report.status, languages, sourceInputsChanged: inputChecks.filter(item => item.preparedSha256 !== item.currentSha256),
  }, null, 2));
}

const command = process.argv[2];
assert(['prepare', 'render-figure', 'freeze-solutions', 'freeze-drafts'].includes(command), 'Use prepare, render-figure, freeze-solutions or freeze-drafts');
if (command === 'prepare') await prepare();
if (command === 'render-figure') await renderFigure();
if (command === 'freeze-solutions') freezeSolutions();
if (command === 'freeze-drafts') freezeDrafts();
