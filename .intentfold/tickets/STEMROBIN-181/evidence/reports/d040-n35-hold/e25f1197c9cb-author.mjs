import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
const repo = process.cwd();
const card = 'phy10-c1-s4-n35';
const relative = `adapt/10p/modern-us-neutral/lessons/${card}`;
const texts = JSON.parse(await fs.readFile(path.join(folder, 'texts.json'), 'utf8'));
const save = async (file, value, replace = false) => {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { flag: replace ? 'w' : 'wx' });
};
const bind = async file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
});
const receipt = async (name, command, args) => {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', timeout: 180000,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  await save(path.join(folder, `${name}.json`), {
    command, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message ?? null,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
};

const frozen = [];
for (const language of ['zh', 'en']) {
  const root = path.join(folder, language === 'zh' ? 'root' : 'root-en');
  const work = path.join(folder, language === 'zh' ? 'work' : 'work-en');
  const templateDir = path.join(work, relative);
  await fs.cp(templateDir, path.join(folder, `prepared/${language}`), {
    recursive: true, errorOnExist: true, force: false,
  });
  const template = path.join(templateDir, 'lesson.template.json');
  const lesson = JSON.parse(await fs.readFile(template, 'utf8'));
  const figuresBefore = await bind(path.join(templateDir, 'figures.template.json'));
  const exercisesBefore = await bind(path.join(templateDir, 'exercises.template.json'));
  assert.equal(lesson.prose.length, texts.length);
  lesson.language = language;
  for (const [index, block] of lesson.prose.entries()) {
    assert.deepEqual(block.source_refs, texts[index].source_refs);
    block.text = texts[index][language];
    block.changes = block.text === block.source_text ? [] : [
      ...(language === 'en' ? ['translation'] : []), 'wording', 'modernized', 'layout',
    ];
    block.numeric_changes = [];
  }
  await save(template, lesson, true);
  const initialFlow = await receipt(`prose-flow-${language}-initial`, process.execPath, [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', template,
  ]);
  // Derive anchors from the renderer's actual paragraphs at concept transitions.
  lesson.section_breaks = [3, 8, 11].map(blockIndex => {
    const paragraph = initialFlow.paragraphs.find(item => item.blockIndex === blockIndex);
    assert.ok(paragraph && paragraph.index > 0);
    return {
      before: initialFlow.paragraphs[paragraph.index - 1].text,
      after: paragraph.text,
    };
  });
  await save(template, lesson, true);
  const finalFlow = await receipt(`prose-flow-${language}`, process.execPath, [
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--json', template,
  ]);
  assert.equal(finalFlow.resolvedBreaks.length, 3);
  assert.equal((await bind(figuresBefore.path)).sha256, figuresBefore.sha256);
  assert.equal((await bind(exercisesBefore.path)).sha256, exercisesBefore.sha256);
  await fs.writeFile(path.join(folder, `lesson-${language}.md`),
    [`# ${language === 'zh' ? '电能的输送' : 'Electrical Energy Transmission'}`, '',
      ...lesson.prose.filter(block => block.kind === 'p' || block.kind === 'cap')
        .flatMap(block => [block.text, '']),
    ].join('\n'), { flag: 'wx' });
  frozen.push({
    language, root, work, template: await bind(template),
    exercisesTemplate: exercisesBefore, figuresTemplate: figuresBefore,
    readingText: await bind(path.join(folder, `lesson-${language}.md`)),
    proseFlowReceipt: await bind(path.join(folder, `prose-flow-${language}.json`)),
  });
}
const check = await receipt('text-check-command',
  path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-B', path.join(folder, 'validate-text.py')]);
await save(path.join(folder, 'text-check.json'), check);
assert.equal(check.status, 'pass');
const inputs = JSON.parse(await fs.readFile(path.join(folder, 'input-freeze.json'), 'utf8'));
for (const input of inputs.inputs) {
  assert.equal((await bind(input.original.path)).sha256, input.original.sha256);
  assert.equal((await bind(input.snapshot.path)).sha256, input.snapshot.sha256);
}
const rawPath = path.join(folder, `root/10p/lessons/${card}/lesson.json`);
const raw = JSON.parse(await fs.readFile(rawPath, 'utf8'));
const sourceClosure = {
  schema: 'ld-s10y-lesson/bounded-source-closure@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17',
  structuralStatus: 'pass', sourceApproval: false,
  physicalPages: [99, 100, 101], printedPages: [89, 90, 91],
  start: { heading: '35. 电能的输送', sourceRef: 'p0099#4' },
  end: { finalProseRef: 'p0101#2', excludedHeadingRef: 'p0101#3', excludedNumber: 36 },
  joinedContinuations: [
    ['p0099#8', 'p0100#1'], ['p0100#8', 'p0101#1'],
  ],
  targetSourceRefs: raw.prose.flatMap(block => block.source_refs),
  proseObjects: 10, figureObjects: 1, captionObjects: 1, exercises: 0,
  sourceFigure: {
    id: 'fig-63', sourceRef: 'p0100#4', captionRef: 'p0100#5',
    crop: await bind(path.join(folder, 'work/10p/pages/0100/figures/fig-63.png')),
    bookCopy: await bind(path.join(folder, 'root/10p/figures/fig-63.png')),
    modernAuthoring: 'not performed; independent delegate owns the modern figure',
  },
  nativeReceipts: [99, 100, 101].map((page, index) => ({
    page, status: 'PASS', linesPrinted: [25, 20, 25][index], linesMd: [25, 20, 25][index],
    receipt: inputs.inputs.find(item =>
      item.snapshot.path.endsWith(`receipts/finalize-${page}.json`)).snapshot,
  })),
  independentSource: {
    page99: {
      status: 'PASS',
      report: await bind(path.join(folder, 'inputs/reviews/d038-10p-source96-99-review.json')),
      scope: 'The current page99 hashes match the independent report. Its page96 native HOLD is outside this target span.',
    },
    pages100101: { status: 'pending', approvalInheritedFromNative: false },
  },
  preservedInputs: inputs.inputs,
  sourceFilesUnchanged: true,
  assembly: await bind(path.join(folder, 'assemble.json')),
  rawLesson: await bind(rawPath),
  rawExercises: await bind(path.join(folder, `root/10p/lessons/${card}/exercises.json`)),
  rawBook: await bind(path.join(folder, 'root/10p/book.json')),
  neighboringPartialObjects: {
    retainedUnchanged: true, adapted: false, published: false,
    warnings: [
      'p0099#1 is a preceding-unit continuation without its preceding page in this isolated span.',
      'p0101#7 is an open n36 tail; n36 is outside this authoring task.',
    ],
  },
};
await save(path.join(folder, 'source-closure.json'), sourceClosure);
await save(path.join(folder, 'prose-freeze.json'), {
  schema: 'ld-s10y-lesson/bounded-prose-author-freeze@1',
  ticket: 'STEMROBIN-181', card, date: '2026-11-17', frozen,
  source: await bind(rawPath),
  sourceClosure: await bind(path.join(folder, 'source-closure.json')),
  textCheck: await bind(path.join(folder, 'text-check.json')),
  inputFreeze: await bind(path.join(folder, 'input-freeze.json')),
  authorFiles: await Promise.all(['prepare.mjs', 'author.mjs', 'texts.json', 'validate-text.py']
    .map(file => bind(path.join(folder, file)))),
  status: 'prose-frozen-awaiting-independent-reviews-and-modern-figure',
  sourceReviewPending: true, SCI: false, ZHEN: false, fullCardApproval: false,
  proseObjects: 10, figures: 1, modernFiguresAuthored: 0,
  tasks: 0, addedTasks: 0, addedChoices: 0, answersAuthored: 0,
  sourceFormulaChanges: 0, sourceNumericChanges: 0, numericChangesDeclared: 0,
  historicalEntitiesRetained: [],
  imagesOpened: 0, adaptFinalizeRun: false, renderRun: false,
  nextGates: ['independent SOURCE closure for pages100101', 'independent SCI/ZHEN',
    'independently authored and reviewed modern fig-63', 'adapt-finalize and render only after modern figure is present'],
  changes: [
    'Remove political naming and dated geographic supply assertions without replacement statistics.',
    'Retain all source math, numbers and figure references; treat 500kV and 16-20kV as illustrative levels, not universal limits.',
    'State resistance/current conditions for Q=I^2Rt and fixed active-power/power-factor conditions for voltage-current comparisons.',
    'Distinguish ideal-transformer conditions from actual winding/core losses.',
    'Retain staged distribution, corona, conditional HVDC comparison, rectifier/inverter conversion and interconnected-grid concepts.',
    'Remove the absolute storage prohibition and unconditional grid-delivery/peak-load guarantees.',
  ],
});
console.log(JSON.stringify({
  freeze: path.join(folder, 'prose-freeze.json'),
  sourceClosure: path.join(folder, 'source-closure.json'),
  textCheck: check.status, adaptFinalizeRun: false, renderRun: false,
}, null, 2));
