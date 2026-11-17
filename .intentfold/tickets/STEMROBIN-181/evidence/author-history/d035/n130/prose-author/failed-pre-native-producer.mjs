import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import {
  ticket, absolute, read, bytes, bind, verify, exists, immutableWrite,
} from './retain-d016-evidence.mjs';

const [phase, expectedNativeSha] = process.argv.slice(2);
assert.ok(['prepare', 'author'].includes(phase));
const card = 'phy9-c2-s6-n130';
const folder = `${ticket}/tmp/d035-n130-prose-author`;
const root = `${folder}/root`;
const work = `${folder}/work`;
const book = `${root}/9p`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/9p';
const target = `${work}/adapt/9p/modern-us-neutral/lessons/${card}`;
const textPath = `${ticket}/tmp/d035-n130-prose-texts.json`;
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python';
const entry = '.claude/skills/ld-s10y-lesson/tools/p2c.py';
const require = createRequire(absolute('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const { proseOutline } = require('./htmlfrag.js');
const template = name => `${target}/${name}.template.json`;
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
async function run(name, command, input, allowFailure = false) {
  assert.ok(!await exists(`${folder}/commands/${name}.started.json`));
  await immutableWrite(`${folder}/commands/${name}.started.json`, encode({ command, input: input ?? null }));
  const result = spawnSync(command[0], command.slice(1), {
    input: input === undefined ? undefined : JSON.stringify(input), encoding: 'utf8',
    timeout: 180000, maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  const receipt = `${folder}/commands/${name}.json`;
  await immutableWrite(receipt, encode({
    command, exitCode: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    signal: result.signal, error: result.error?.message ?? null,
  }));
  console.log(`${name}: ${result.status}`);
  if (!allowFailure) assert.equal(result.status, 0, `${name}: ${result.stderr}\n${result.stdout}`);
  return { ...result, receipt: await bind(receipt) };
}
const options = ['--book', '9p', '--root', root, '--work', work];
if (phase === 'prepare') {
  const consumptionPath = `${ticket}/tmp/d035-source312-319-consumed/result.json`;
  await verify(consumptionPath, '62f5ae9f10574badc1eac165f1799227c8127496fcdc117380ed108716030903');
  const consumption = await read(consumptionPath);
  const nativePath = `${ticket}/tmp/d035-source318-native-resume/pages-native.json`;
  const boundaryReviewPath = `${ticket}/tmp/d035-source320-323-source-review.json`;
  const textReviewPath = `${ticket}/tmp/d035-source318-repair-affected-review.json`;
  await verify(nativePath, expectedNativeSha);
  await verify(boundaryReviewPath, 'f2574d05b87ccde70f62dbb11d410039c5ec22fe59dd43c1ba0ce6153926ff30');
  await verify(textReviewPath, '373000f82857df36ee46b43edea776e26212f27e13002b59dbbf91c6ca8665da');
  const native = await read(nativePath);
  const boundaryReview = await read(boundaryReviewPath);
  const textReview = await read(textReviewPath);
  assert.equal(textReview.effectiveSource318.actual130StartStatus, 'PASS');
  assert.equal(textReview.fullPageSourceApproval, false);
  const actualBoundary = boundaryReview.boundaries.actualHeadings.find(row => row.ref === 'p0320#1');
  assert.equal(actualBoundary.sourceHeading, '131. 电流的能量');
  assert.equal(actualBoundary.noPContAtPageStart, true);
  assert.ok(!await exists(`${folder}/preparation.json`));
  const preserved = await read(`${ticket}/tmp/d032-start/preservation.json`);
  const protectedFiles = await Promise.all([
    `${canonical}/book.json`, `${canonical}/editions/modern-us-neutral/book.json`,
    `${ticket}/production-meter.json`, `${ticket}/evidence/index.json`,
  ].map(bind));
  for (const row of preserved.files) {
    await verify(row.path, row.sha256);
    assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
  }
  const inputs = [await bind(consumptionPath), await bind(nativePath),
    await bind(boundaryReviewPath), await bind(textReviewPath), ...protectedFiles];
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const source = `${canonical}/pages/0319/${name}`;
    const row = consumption.outputs.find(row => absolute(row.path) === absolute(source));
    assert.ok(row);
    await verify(row.path, row.sha256);
    inputs.push(row);
    await immutableWrite(`${book}/pages/0319/${name}`, await bytes(source));
  }
  const nativePage = native.pages.find(row => row.page === 318 || row.physicalPage === 318);
  assert.equal(nativePage.status, 'PASS');
  assert.deepEqual(nativePage.rows, [25, 25]);
  for (const row of nativePage.outputs) {
    await verify(row.path, row.sha256);
    inputs.push(row);
    const name = row.path.split('/').at(-1);
    await immutableWrite(`${book}/pages/0318/${name}`, await bytes(row.path));
  }
  const prepared318 = '.tmp/ld-s10y-lesson/9p/pages/0318';
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md'])
    await immutableWrite(`${work}/9p/pages/0318/${name}`, await bytes(`${prepared318}/${name}`));
  const rawFigure = native.cropReviewTargets.find(row => row.id === 'fig-294');
  for (const row of [rawFigure.crop, rawFigure.svg]) {
    await verify(row.path, row.sha256);
    inputs.push(row);
    await immutableWrite(`${work}/9p/pages/0318/figures/${row.path.split('/').at(-1)}`, await bytes(row.path));
  }
  const boundaryCandidate = `${ticket}/tmp/d035-source320-323-author/0320.page.md`;
  await verify(boundaryCandidate, '078999752f4f7793477d0a1db2c07f01d9aca862728518f928e160053bd52acc');
  inputs.push(await bind(boundaryCandidate));
  const boundary = await run('derive-boundary320', [python, '-B', '-c', [
    'import sys,json',
    "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
    'import blocks',
    'meta,body=blocks.parse(json.load(sys.stdin))',
    "assert body[0]['kind']=='h3' and body[0]['lines']==['131. 电流的能量']",
    "meta['notes']=meta.get('notes',[])+['Isolated boundary-only input: only p0320#1 retained. Not a full page, count, prose or RAW approval. Original source and independent boundary review separately bound.']",
    "print(json.dumps({'meta':meta,'blocks':body[:1]},ensure_ascii=False))",
  ].join('\n')], (await bytes(boundaryCandidate)).toString('utf8'));
  await immutableWrite(`${book}/pages/0320/page.json`, boundary.stdout);
  const assembly = await run('assemble', [python, '-B', entry, 'assemble', ...options,
    '--toc', 'ssot-resources/soviet10year-textbooks/toc/9p/zh.json'], undefined, true);
  const source = await read(`${book}/lessons/${card}/lesson.json`);
  const exercises = await read(`${book}/lessons/${card}/exercises.json`);
  assert.equal(source.card_id, card);
  assert.equal(source.prose.length, 7);
  assert.deepEqual(source.prose.map(row => row.source_refs),
    [['p0318#8', 'p0319#1'], ['p0319#2'], ['p0319#3'], ['p0319#4'],
      ['p0319#5'], ['p0319#7'], ['p0319#6']]);
  assert.deepEqual(source.figures, []);
  assert.equal(exercises.count, 0);
  assert.equal(exercises.exercises.length, 0);
  const prepare = await run('adapt-prepare', [python, '-B', entry, 'adapt-prepare', ...options,
    '--edition', 'modern-us-neutral', '--lesson', card]);
  const templates = [];
  for (const name of ['lesson', 'exercises', 'figures']) {
    await immutableWrite(`${folder}/before/${name}.template.json`, await bytes(template(name)));
    templates.push(await bind(`${folder}/before/${name}.template.json`));
  }
  for (const row of [...inputs, ...preserved.files]) {
    await verify(row.path, row.sha256);
    if (row.mode != null) assert.equal((await fs.stat(absolute(row.path))).mode & 0o777, row.mode);
  }
  await immutableWrite(`${folder}/preparation.json`, encode({
    card, source: await bind(`${book}/lessons/${card}/lesson.json`),
    exercises: await bind(`${book}/lessons/${card}/exercises.json`),
    inputs, protectedFiles, templates, assembly: assembly.receipt, prepare: prepare.receipt,
    assemblyDiagnostics: (await read(`${book}/book.json`)).audit,
    closure: {
      headingRef: 'p0318#7', firstProseRef: 'p0318#8', lastProseRef: 'p0319#6',
      lastOpen: false, rightBoundaryRef: 'p0320#1', rightBoundaryHeading: '131. 电流的能量',
      physicalPages: [318, 319], printedPages: [309, 310],
      actualBoundaryConsumedNotReplayed: true, boundaryOnlyPage320: true,
      source318WholePageRAWApproval: false, source130OwnedProseApproved: true,
      boundaryReview: await bind(boundaryReviewPath), source318TextReview: await bind(textReviewPath),
    },
    sourceTasks: 0, sourceFigures: 0, canonicalWrites: 0, parentImageOpens: 0,
    preservedUnownedFiles: preserved.files.length,
    fullCardApproval: false, independentScienceApproval: false,
  }));
} else {
  const preparation = await read(`${folder}/preparation.json`);
  assert.ok(!await exists(`${folder}/prose-freeze.json`));
  const texts = await read(textPath);
  assert.equal(texts.card, card);
  const lesson = await read(`${folder}/before/lesson.template.json`);
  const english = structuredClone(lesson);
  lesson.language = 'zh';
  english.language = 'en';
  english.translated_title = texts.translated_title;
  english.translated_section = null;
  for (const [index, block] of lesson.prose.entries()) {
    const authored = texts.blocks.find(row => JSON.stringify(row.source_refs) === JSON.stringify(block.source_refs));
    assert.ok(authored);
    assert.equal(block.kind, 'p');
    block.text = authored.zh;
    block.changes = authored.changes;
    english.prose[index].text = authored.en;
    english.prose[index].changes = ['translation', ...authored.changes];
  }
  const normalize = await run('normalize', [python, '-B', '-c', [
    'import sys,json',
    "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
    'import edition',
    'payload=json.load(sys.stdin)',
    "for doc in payload['documents']: edition.normalize_lesson_layout(doc)",
    'print(json.dumps(payload,ensure_ascii=False))',
  ].join('\n')], { documents: [lesson, english] });
  const documents = JSON.parse(normalize.stdout).documents;
  const flows = [];
  for (const [index, language] of ['zh', 'en'].entries()) {
    const doc = documents[index];
    const outline = proseOutline(doc.prose);
    const prefixes = texts.concept_starts[language];
    doc.section_breaks = prefixes.map(prefix => {
      const matches = outline.filter(row => row.text.startsWith(prefix));
      assert.equal(matches.length, 1, prefix);
      const afterIndex = outline.findIndex(row => row === matches[0]);
      assert.ok(afterIndex > 0);
      return { before: outline[afterIndex - 1].text, after: outline[afterIndex].text };
    });
    const destination = `${folder}/frozen/${language === 'zh' ? 'lesson.template.json' : 'english.lesson.json'}`;
    await immutableWrite(destination, encode(doc));
    const flow = await run(`prose-flow-${language}`, [process.execPath,
      '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', destination]);
    flows.push({ language, receipt: flow.receipt, report: JSON.parse(flow.stdout) });
  }
  for (const name of ['exercises', 'figures'])
    await immutableWrite(`${folder}/frozen/${name}.template.json`, await bytes(`${folder}/before/${name}.template.json`));
  const validate = await run('validate-text', [python, '-B', '-c', [
    'import sys,json',
    'from pathlib import Path',
    "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
    'import edition',
    'payload=json.load(sys.stdin)',
    "source=payload['lesson']['source']['data']",
    "forbidden=payload['profile']['forbidden_terms']+payload['profile']['forbidden_person_names']",
    "errors=edition.validate_source(Path(payload['book']),payload['lesson']['source'],Path(payload['book'])/payload['lesson']['source']['path'],'lesson')",
    "for doc in [payload['lesson'],payload['english']]:",
    "    errors+=edition.validate_identity_fields(source,doc,edition.IDENTITY_FIELDS,'lesson')",
    "    assert len(source['prose'])==len(doc['prose'])==7",
    "    for raw,modern in zip(source['prose'],doc['prose']):",
    "        assert raw['source_refs']==modern['source_refs']",
    "        errors+=edition.validate_text(raw['text'],modern['text'],modern['changes'],modern['numeric_changes'],','.join(modern['source_refs']),forbidden,modern['historical_entities'])",
    "print(json.dumps({'errors':errors,'sourceObjects':7,'sourceTasks':0,'figures':0},ensure_ascii=False))",
    'sys.exit(1 if errors else 0)',
  ].join('\n')], {
    book, lesson: documents[0], english: documents[1],
    profile: await read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  });
  for (const row of preparation.inputs) {
    if (!preparation.protectedFiles.some(protectedRow => protectedRow.path === row.path))
      await verify(row.path, row.sha256);
  }
  await immutableWrite(`${folder}/prose-freeze.json`, encode({
    schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
    ticket: 'STEMROBIN-181', card,
    status: 'bilingual-prose-frozen-independent-SCI-ZHEN-pending',
    preparation: await bind(`${folder}/preparation.json`),
    source: preparation.source, exercisesSource: preparation.exercises,
    texts: await bind(textPath), closure: preparation.closure,
    frozenFiles: {
      lessonTemplate: await bind(`${folder}/frozen/lesson.template.json`),
      englishLesson: await bind(`${folder}/frozen/english.lesson.json`),
      exercisesTemplate: await bind(`${folder}/frozen/exercises.template.json`),
      figuresTemplate: await bind(`${folder}/frozen/figures.template.json`),
    },
    nativeNormalize: normalize.receipt, nativeTextCheck: validate.receipt, flows,
    sourceObjects: 7, sourceTasks: 0, sourceFigures: 0,
    sourceErrata: [], addedExamples: 0, addedEquations: 0, addedTasks: 0,
    sourceGateReplayed: false, originalAssemblyDiagnosticsPreserved: true,
    parentNewImageOpens: 0, independentSCI: false, independentZHEN: false,
    fullCardApproval: false, canonicalPromotion: false,
  }));
  console.log(JSON.stringify(await bind(`${folder}/prose-freeze.json`)));
}
