import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), cwd);
const base = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d201-n23-text-author');
const preparedPath = path.join(base, 'prepared.json');
const prepared = JSON.parse(fs.readFileSync(preparedPath, 'utf8'));
const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json'];
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const binding = file => {
  const bytes = fs.readFileSync(file);
  return {
    path: file,
    bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
};
const writeNew = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data, { flag: 'wx' });
};
const writeJson = (file, data) => writeNew(file, `${JSON.stringify(data, null, 2)}\n`);
const working = (edition, name) => path.join(cwd,
  '.tmp/STEMROBIN-181/d1816-d201/work/adapt/10p', edition,
  'lessons/phy10-c1-s3-n23', name);
const mathTokens = text => [...text.matchAll(/\$([^$]*)\$/g)].map(match => match[0]);
const require = createRequire(import.meta.url);
const { proseOutline, sectionBreakIndices } =
  require(path.join(cwd, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));

function preservedInputs() {
  const entries = [
    ...prepared.rawInputs,
    ...prepared.evidence,
    ...prepared.currentBindings,
    ...prepared.immutableInputTemplates,
  ];
  return [...new Map(entries.map(item => [item.path, item])).values()].map(expected => {
    const actual = binding(expected.path);
    assert.deepEqual(actual, expected, `Input binding changed: ${expected.path}`);
    return actual;
  });
}

function checkEdition(edition) {
  const lesson = json(working(edition, names[0]));
  const exercises = json(working(edition, names[1]));
  const inputLesson = json(path.join(base, 'input-templates', edition, names[0]));
  const inputExercises = json(path.join(base, 'input-templates', edition, names[1]));
  assert.deepEqual(lesson.source, inputLesson.source);
  assert.deepEqual(exercises.source, inputExercises.source);
  assert.deepEqual(lesson.errata, inputLesson.errata);
  assert.equal(lesson.prose.length, 22);
  assert.equal(lesson.exercise_count, 4);
  assert.equal(exercises.count, 4);
  assert.equal(exercises.exercises.length, 4);
  assert.deepEqual(lesson.figures, inputLesson.figures);
  for (const key of ['id', 'card_id', 'number', 'printed_title', 'start_page', 'start_printed']) {
    assert.deepEqual(lesson[key], inputLesson[key]);
  }
  const coverage = lesson.prose.map((block, index) => {
    const original = inputLesson.prose[index];
    for (const key of ['kind', 'id', 'label', 'printed_page', 'source_refs', 'source_text',
      'numeric_changes', 'historical_entities']) {
      assert.deepEqual(block[key], original[key], `${edition} block ${index}: ${key}`);
    }
    assert.deepEqual(mathTokens(block.text), mathTokens(original.source_text),
      `${edition} block ${index}: original mathematical tokens`);
    if (block.kind === 'p') assert.ok(block.text.trim());
    if (block.text !== block.source_text) assert.ok(block.changes.length);
    assert.ok(!block.changes.includes('math-correction'));
    assert.ok(!block.changes.includes('notation'));
    assert.ok(!block.notation_changes?.length);
    return {
      sourceRefs: block.source_refs,
      kind: block.kind,
      id: block.id,
      sourceSnapshotPreserved: true,
      originalMathExpressionsPreservedExactly: true,
      authored: block.kind === 'p',
      figurePending: block.kind === 'fig' || block.kind === 'cap',
      outputCharacters: block.text.length,
    };
  });
  const taskCoverage = exercises.exercises.map((task, index) => {
    const original = inputExercises.exercises[index];
    for (const key of ['number', 'source_number', 'group', 'group_id', 'pages',
      'figure_refs', 'figures', 'source_text', 'numeric_changes', 'historical_entities']) {
      assert.deepEqual(task[key], original[key], `${edition} task ${index}: ${key}`);
    }
    assert.deepEqual(mathTokens(task.text), mathTokens(original.source_text));
    assert.equal(task.text, task.lines.join(edition.endsWith('-en') ? ' ' : ''));
    for (const key of ['answer', 'answerKey', 'correct_index', 'accept', 'solution',
      'choices', 'interaction']) assert.equal(Object.hasOwn(task, key), false);
    return {
      number: task.number,
      sourceNumber: task.source_number,
      group: task.group,
      groupId: task.group_id,
      sourceRefs: task.pages,
      sourceSnapshotPreserved: true,
      originalMathExpressionsPreservedExactly: true,
      answerOutputsAbsent: true,
      outputCharacters: task.text.length,
    };
  });
  assert.deepEqual([...exercises.exercises[2].text.matchAll(/\d+/g)].map(m => m[0]),
    ['3', '220', '127']);
  assert.equal(binding(working(edition, names[2])).sha256,
    binding(path.join(base, 'input-templates', edition, names[2])).sha256);
  return { edition, sourceBlocks: 22, textBlocks: 20, figureBlocks: 1, captionBlocks: 1,
    originalTasks: 4, coverage, taskCoverage };
}

function flow(edition) {
  assert.ok(editions.includes(edition));
  const folder = path.join(base, 'native', edition, 'prose-flow-first');
  assert.equal(fs.existsSync(folder), false, 'Do not replay a completed native flow');
  preservedInputs();
  const coverage = checkEdition(edition);
  const input = working(edition, names[0]);
  const inputSnapshot = path.join(folder, 'lesson.input.json');
  writeNew(inputSnapshot, fs.readFileSync(input));
  const args = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json',
    path.relative(cwd, input)];
  const startedAt = new Date().toISOString();
  const run = spawnSync('node', args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const stdout = path.join(folder, 'stdout.json');
  const stderr = path.join(folder, 'stderr.txt');
  writeNew(stdout, run.stdout ?? '');
  writeNew(stderr, run.stderr ?? '');
  const receipt = {
    schema: 'STEMROBIN-181/native-receipt@1',
    stage: 'prose-flow-first',
    edition,
    cwd,
    command: ['node', ...args],
    startedAt,
    finishedAt: new Date().toISOString(),
    exitCode: run.status,
    signal: run.signal,
    error: run.error?.message ?? null,
    input: binding(input),
    inputSnapshot: binding(inputSnapshot),
    stdout: binding(stdout),
    stderr: binding(stderr),
    noReplay: true,
  };
  writeJson(path.join(folder, 'receipt.json'), receipt);
  writeJson(path.join(folder, 'preservation-check.json'), coverage);
  console.log(JSON.stringify(receipt, null, 2));
  if (run.status !== 0) process.exitCode = run.status ?? 2;
  else console.log(run.stdout);
}

function layout(edition) {
  assert.ok(editions.includes(edition));
  const folder = path.join(base, 'layout', edition);
  assert.equal(fs.existsSync(folder), false);
  const input = working(edition, names[0]);
  const source = json(input);
  writeNew(path.join(folder, 'lesson.before-layout.json'), fs.readFileSync(input));
  const code = [
    'import json, sys',
    "sys.path.insert(0, '.claude/skills/ld-s10y-lesson/tools')",
    'from edition import normalize_prose_layout',
    'document = json.load(sys.stdin)',
    'for block in document["prose"]:',
    '    if block["kind"] == "p":',
    '        block["text"] = normalize_prose_layout(block["text"])',
    'print(json.dumps(document, ensure_ascii=False))',
  ].join('\n');
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', code];
  const startedAt = new Date().toISOString();
  const normalized = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', input: JSON.stringify(source), maxBuffer: 16 * 1024 * 1024,
  });
  writeNew(path.join(folder, 'normalizer.stdout.json'), normalized.stdout ?? '');
  writeNew(path.join(folder, 'normalizer.stderr.txt'), normalized.stderr ?? '');
  writeJson(path.join(folder, 'normalizer.receipt.json'), {
    cwd, command, startedAt, finishedAt: new Date().toISOString(),
    exitCode: normalized.status, error: normalized.error?.message ?? null,
    input: binding(input), onlyFunctionCalled: 'normalize_prose_layout',
    adaptFinalizeCalled: false, sourceAssemblyCalled: false,
  });
  assert.equal(normalized.status, 0);
  const document = JSON.parse(normalized.stdout);
  const paragraphs = proseOutline(document.prose);
  const boundaries = paragraphs.slice(1).map(after => ({
    index: after.index,
    before: paragraphs[after.index - 1].text,
    after: after.text,
  }));
  const transitions = ['p0062#3', 'p0062#7', 'p0063#5', 'p0063#7',
    'p0063#10', 'p0063#12', 'p0064#2'];
  const selected = transitions.map(ref => {
    const after = paragraphs.find(item =>
      item.paragraphInBlock === 0 && document.prose[item.blockIndex].source_refs.includes(ref));
    assert.ok(after, `Missing conceptual transition: ${ref}`);
    const returned = boundaries.find(item => item.index === after.index);
    assert.ok(returned);
    return { before: returned.before, after: returned.after };
  });
  document.section_breaks = selected;
  const resolvedBreaks = sectionBreakIndices(document.prose, selected);
  writeJson(path.join(folder, 'final-shared-parser-flow.json'), {
    schema: 'STEMROBIN-181/final-shared-parser-flow@1',
    cwd,
    engine: '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
    functions: ['proseOutline', 'sectionBreakIndices'],
    proseFlowCliReplayed: false,
    paragraphs, boundaries, selected, resolvedBreaks,
    transitionSourceRefs: transitions,
    note: 'Final adjacent anchors come from the returned shared-parser paragraph flow after deterministic whitespace normalization, never from hand-counted blocks.',
  });
  let patch = `*** Begin Patch\n*** Update File: ${input}\n`;
  for (let index = 0; index < source.prose.length; index += 1) {
    const before = source.prose[index].text;
    const after = document.prose[index].text;
    if (before !== after) {
      assert.equal(before.replace(/\s+/g, ''), after.replace(/\s+/g, ''));
      patch += `@@\n-      "text": ${JSON.stringify(before)},\n+      "text": ${JSON.stringify(after)},\n`;
    }
  }
  assert.deepEqual(source.section_breaks, []);
  const boundaryLines = JSON.stringify(selected, null, 2).split('\n')
    .map((line, index) => `${index === 0 ? '  "section_breaks": ' : '  '}${line}`)
    .join('\n');
  patch += `@@\n-  "section_breaks": [],\n+${boundaryLines.replaceAll('\n', '\n+')},\n*** End Patch\n`;
  const patchPath = path.join(folder, 'layout-and-boundaries.patch');
  writeNew(patchPath, patch);
  const applied = spawnSync('apply_patch', [], { cwd, encoding: 'utf8', input: patch });
  writeNew(path.join(folder, 'apply-patch.stdout.txt'), applied.stdout ?? '');
  writeNew(path.join(folder, 'apply-patch.stderr.txt'), applied.stderr ?? '');
  writeJson(path.join(folder, 'apply-patch.receipt.json'), {
    cwd, command: ['apply_patch'], stdin: binding(patchPath), exitCode: applied.status,
    error: applied.error?.message ?? null, output: binding(input),
  });
  assert.equal(applied.status, 0);
  assert.deepEqual(json(input), document);
  console.log(JSON.stringify({
    edition, output: binding(input), finalParagraphs: paragraphs.length,
    sectionBreaks: selected.length, resolvedBreaks,
    returnedFlow: binding(path.join(folder, 'final-shared-parser-flow.json')),
    proseFlowCliReplayed: false,
  }, null, 2));
}

function freeze() {
  assert.equal(fs.existsSync(path.join(base, 'frozen')), false);
  assert.equal(fs.existsSync(path.join(base, 'report.json')), false);
  assert.equal(fs.existsSync(path.join(base, 'author-freeze.json')), false);
  const inputs = preservedInputs();
  const coverage = editions.map(checkEdition);
  const candidateDocuments = editions.map(edition => json(working(edition, names[0])));
  const verificationCode = [
    'import json, sys',
    "sys.path.insert(0, '.claude/skills/ld-s10y-lesson/tools')",
    'from edition import normalize_prose_layout, prose_number_signature',
    'documents = json.load(sys.stdin)',
    'report = []',
    'for document in documents:',
    '    blocks = []',
    '    for block in document["prose"]:',
    '        blocks.append({',
    '            "source_refs": block["source_refs"],',
    '            "non_formula_numbers_and_references_preserved":',
    '                prose_number_signature(block["text"]) == prose_number_signature(block["source_text"]),',
    '            "layout_idempotent": block["kind"] != "p" or',
    '                normalize_prose_layout(block["text"]) == block["text"],',
    '        })',
    '    report.append({"edition": document["edition"], "blocks": blocks})',
    'print(json.dumps(report, ensure_ascii=False))',
  ].join('\n');
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c', verificationCode];
  const verification = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', input: JSON.stringify(candidateDocuments),
    maxBuffer: 16 * 1024 * 1024,
  });
  const verifyDir = path.join(base, 'verification');
  writeNew(path.join(verifyDir, 'stdout.json'), verification.stdout ?? '');
  writeNew(path.join(verifyDir, 'stderr.txt'), verification.stderr ?? '');
  writeJson(path.join(verifyDir, 'receipt.json'), {
    cwd, command, exitCode: verification.status, error: verification.error?.message ?? null,
    onlyFunctionsCalled: ['normalize_prose_layout', 'prose_number_signature'],
    nativeFinalizationOrRenderingCalled: false,
    inputs: editions.map(edition => binding(working(edition, names[0]))),
    stdout: binding(path.join(verifyDir, 'stdout.json')),
    stderr: binding(path.join(verifyDir, 'stderr.txt')),
  });
  assert.equal(verification.status, 0);
  const mechanical = JSON.parse(verification.stdout);
  for (const item of mechanical) {
    for (const block of item.blocks) {
      assert.equal(block.non_formula_numbers_and_references_preserved, true,
        `${item.edition} ${block.source_refs}: number/reference preservation`);
      assert.equal(block.layout_idempotent, true,
        `${item.edition} ${block.source_refs}: deterministic layout`);
    }
  }
  const native = editions.map(edition => {
    const folder = path.join(base, 'native', edition, 'prose-flow-first');
    const receiptPath = path.join(folder, 'receipt.json');
    const receipt = json(receiptPath);
    assert.equal(receipt.exitCode, 0);
    const result = json(receipt.stdout.path);
    const final = json(path.join(base, 'layout', edition, 'final-shared-parser-flow.json'));
    const current = json(working(edition, names[0]));
    assert.deepEqual(proseOutline(current.prose), final.paragraphs);
    assert.deepEqual(sectionBreakIndices(current.prose, current.section_breaks), final.resolvedBreaks);
    assert.deepEqual(current.section_breaks, final.selected);
    if (edition === 'modern-us-neutral') {
      assert.deepEqual(result.paragraphs, final.paragraphs);
      assert.deepEqual(result.resolvedBreaks, final.resolvedBreaks);
    } else {
      const beforeLayout = json(path.join(base, 'layout', edition, 'lesson.before-layout.json'));
      assert.deepEqual(beforeLayout, json(receipt.inputSnapshot.path));
      current.prose.forEach((block, index) =>
        assert.equal(block.text.replace(/\s+/g, ''),
          beforeLayout.prose[index].text.replace(/\s+/g, '')));
    }
    return {
      edition,
      proseFlowCliCalls: 1,
      receipt: binding(receiptPath),
      inputSnapshot: binding(receipt.inputSnapshot.path),
      stdout: binding(receipt.stdout.path),
      stderr: binding(receipt.stderr.path),
      exitCode: receipt.exitCode,
      finalParagraphs: final.paragraphs.length,
      sectionBreaks: final.selected.length,
      finalSharedParserFlow: binding(path.join(base, 'layout', edition, 'final-shared-parser-flow.json')),
      proseFlowCliFinalCandidateConfirmed: edition === 'modern-us-neutral',
      caveat: edition.endsWith('-en')
        ? 'The single English CLI call preceded whitespace-only layout normalization and section anchors. Its exact input/output remains retained, not relabeled as a final-template CLI pass. Final English anchors are from the returned htmlfrag.js shared-parser flow and resolve against the actual final template. No passed CLI call was replayed.'
        : 'The single Chinese CLI call binds the actual final template and final section anchors.',
    };
  });
  const outputs = [];
  for (const edition of editions) {
    for (const name of names) {
      const source = working(edition, name);
      const destination = path.join(base, 'frozen', edition, name);
      writeNew(destination, fs.readFileSync(source));
      fs.chmodSync(destination, 0o444);
      assert.equal(binding(source).sha256, binding(destination).sha256);
      outputs.push({ edition, name, current: binding(source), frozen: binding(destination),
        frozenMode: '0444' });
    }
  }
  const previousNativeRoots = [
    'd201-n23-zh-first-isolated-prepare',
    'd201-n23-en-first-isolated-prepare',
    'd201-n23-first-text-preparation-helper',
    'd199-n23-first-affected-isolated-assembly',
  ].map(name => path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native', name));
  const inheritedNative = previousNativeRoots.map(folder => ({
    receipt: binding(path.join(folder, 'receipt.json')),
    stdout: binding(path.join(folder, 'stdout.txt')),
    stderr: binding(path.join(folder, 'stderr.txt')),
    exitCode: json(path.join(folder, 'receipt.json')).exitCode,
    consumedReadOnly: true,
    replayed: false,
  }));
  for (const run of inheritedNative) assert.equal(run.exitCode, 0);
  const contractPaths = [
    '.intentfold/readme.md', '.intentfold/project.json',
    '.intentfold/charter/engineering.md', '.intentfold/charter/operations.md',
    '.intentfold/charter/product.md', '.intentfold/charter/ui.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.claude/skills/ld-s10y-lesson/references/production-resume.md',
    '.claude/skills/ld-s10y-lesson/tools/edition.py',
    '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
    '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  ].map(file => binding(path.join(cwd, file)));
  const supportEvidence = [
    'exploration-failures.json', 'chinese-wrapper-first-failure.stderr.txt',
    'record-evidence.mjs',
    'verification/receipt.json', 'verification/stdout.json', 'verification/stderr.txt',
    ...editions.flatMap(edition => [
      `layout/${edition}/lesson.before-layout.json`,
      `layout/${edition}/normalizer.receipt.json`,
      `layout/${edition}/normalizer.stdout.json`,
      `layout/${edition}/normalizer.stderr.txt`,
      `layout/${edition}/layout-and-boundaries.patch`,
      `layout/${edition}/apply-patch.receipt.json`,
      `layout/${edition}/apply-patch.stdout.txt`,
      `layout/${edition}/apply-patch.stderr.txt`,
      `native/${edition}/prose-flow-first/preservation-check.json`,
    ]),
  ].map(file => binding(path.join(base, file)));
  const scienceJudgments = [
    {
      topic: 'Waveform and power model',
      sourceRefs: ['p0062#3', 'p0062#5', 'p0062#7', 'p0064#2', 'p0064#3'],
      authorJudgment: 'Scientifically coherent with explicit model boundaries.',
      scope: 'Peak divided by square root of two is restricted to the sinusoidal current/voltage considered here. Instantaneous resistive power assumes a fixed linear pure resistor. The final product of voltage and current RMS values is scoped to that same resistor, with voltage proportional to current and in phase, and the same averaging interval; not arbitrary reactive circuits.',
      sourceFormulaExpressionsChanged: false,
    },
    {
      topic: 'Time averaging and heating equivalence',
      sourceRefs: ['p0062#2', 'p0063#9'],
      authorJudgment: 'Exact whole-cycle result distinguished from long-interval approximation.',
      scope: 'A stable repeating waveform and constant resistance give identical energy per cycle. Exact periodic average applies over integer numbers of complete cycles. A long noninteger interval is an approximation. Equal heating comparisons require the same fixed resistor and equal durations, using either full-cycle intervals or an RMS value defined for the actual chosen interval.',
    },
    {
      topic: 'Quarter-period cancellation',
      sourceRefs: ['p0062#9', 'p0063#3'],
      authorJudgment: 'The source argument is made precise in prose, without changing either printed quarter-period expression.',
      scope: 'Positive and negative half-waves of the doubled-frequency changing term occupy consecutive quarter-current-period intervals bounded by that term crossing zero. This is not true of every arbitrarily placed quarter-period interval. Their signed time contributions cancel over a complete current cycle; only the changing term may be negative, not total resistor power.',
      figureVisualApprovalClaimed: false,
    },
    {
      topic: 'Ambiguous printed current bar notation',
      sourceRefs: ['p0063#4', 'p0063#5', 'p0063#6', 'p0063#7', 'p0063#8', 'p0063#11'],
      authorJudgment: 'Coherent only with the source-prose interpretation stated explicitly beside the preserved equations.',
      scope: 'Printed overline-i followed by a square is retained byte-exact inside formulas. The prose says it is mean-square: square each instantaneous signed current first, time-average, then take the nonnegative root for RMS. Squaring the mean is different and is zero for a nonzero-amplitude zero-offset sinusoid over full cycles; interpreting the printed current equations literally that way would make the equalities false. The retained voltage formula already bars the square. This author has not corrected any formula or created an erratum.',
      formulaChangeRequiredForThisExplicitProseInterpretation: false,
      ifLiteralStandardNotationRequired: 'HOLD for parent/human decision; a source-bound formula correction would require authorization and cannot be performed by this author.',
      independentScientificApproval: false,
    },
    {
      topic: 'Instrumentation and lamp example',
      sourceRefs: ['p0061#9', 'p0062#1', 'p0063#12', 'p0064#1'],
      authorJudgment: 'Original instructional examples retained without universal claims.',
      scope: 'The original 50 hertz is retained as a source example, not a current US mains standard. Lamp thermal response can smooth visible changes, not guarantee that every lamp never flickers. Meter RMS readings depend on suitable waveform, frequency, and range; true-RMS meters also have limits. This text author has not checked an actual lamp or meter.',
    },
    {
      topic: 'Question safety and breadth',
      sourceRefs: ['p0064#5', 'p0064#6', 'p0064#7', 'p0064#8'],
      authorJudgment: 'All four original questions retained without solution steps or answer keys.',
      scope: 'Forced electrical oscillation conditions; current-voltage relationship in a pure resistor; both original 220 volt and 127 volt amplitude calculations under an explicit sinusoidal/RMS assumption; both current and voltage RMS definitions. The first questions retain the source review breadth and may draw on preceding lesson material. No preceding lesson was reauthored. The lighting question is explicitly paper-only with no household measurement instruction.',
    },
  ];
  const counters = {
    originalSourceBlocksPerEdition: 22,
    originalTextBlocksPerEdition: 20,
    originalFigureBlocksPerEdition: 1,
    originalCaptionBlocksPerEdition: 1,
    originalTasksPerEdition: 4,
    authoredTextEditions: 2,
    fullBilingualAuthorPasses: 1,
    substantiveReauthorRoundsAfterFirstDraft: 0,
    whitespaceLayoutNormalizationPassesPerEdition: 1,
    templatesFrozen: 6,
    proseFlowCliCallsPerEdition: 1,
    proseFlowCliFailedCalls: 0,
    wrapperPreconditionFailuresBeforeNative: 1,
    exploratoryReadOnlyLookupFailures: 2,
    technicalFailuresPreserved: 3,
    sourceReviewCalls: 0,
    sourceAssemblyCalls: 0,
    adaptPrepareCalls: 0,
    adaptFinalizeCalls: 0,
    renderCalls: 0,
    buildCalls: 0,
    rawSourceEdits: 0,
    errataAdded: 0,
    formulaCorrections: 0,
    notationChanges: 0,
    imageOpens: 0,
    images0: true,
    figureAuthoringCalls: 0,
    answerOrChoiceOutputs: 0,
    networkCalls: 0,
    apiCalls: 0,
    modelCalls: 0,
    paidCalls: 0,
    dbCalls: 0,
    publisherCalls: 0,
    gitCalls: 0,
    deployCalls: 0,
    peerOrSupervisorMessages: 0,
    independentReviews: 0,
    completeCoursesAdded: 0,
    canonicalModernPromotions: 0,
    productAcceptance: false,
    formalHandoff: false,
  };
  const holds = [{
    phase: 'Figure approval and visual acceptance',
    id: 'fig-36',
    reason: 'Figure 36 remains unapproved. Figure template placeholders and original figure provenance are unchanged. No image was opened, authored, rendered, or visually approved by this text author.',
    blocks: ['p0063#1', 'p0063#2'],
    dependentStages: 'Parent-managed visual approval, native finalization and later acceptance remain pending.',
  }];
  const report = {
    schema: 'STEMROBIN-181/bilingual-text-author-report@1',
    batch: 'D201', ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n23',
    cwd,
    status: 'FULL_22_BLOCK_FOUR_TASK_BILINGUAL_TEXT_AUTHORED_INDEPENDENT_REVIEW_PENDING_FIGURE_HOLD',
    finish: 'review', grill: 'self already satisfied in the same invocation; not repeated',
    originalReadFirst: {
      completeRawLesson: prepared.rawInputs.slice(0, 3),
      allFourOriginalQuestionsReadBeforeAuthoring: true,
      finalProseRef: 'p0064#3', finalQuestionRef: 'p0064#8',
      nextTitleExcluded: 'p0064#9',
      notPrevious20BlockZeroTaskPartial: true,
    },
    authorCoverage: coverage,
    scienceJudgments,
    sourceBindingJudgment: 'Prepared approved SOURCE61-63 and consumed SOURCE64 composed D198 PASS bindings preserved and reused read-only. This author did not perform independent source review or repeat source assembly/preparation.',
    bilingualJudgment: 'Full natural English equivalence authored against the full modern Chinese text, not a summary; all original ordered source snapshots and task breadth retained. Original immutable figure labels and exercise group identity are preserved as structural metadata. This is an author judgment, not independent translation approval.',
    holds,
    pending: [
      'Independent bilingual text and scientific review.',
      'Figure 36 approval and visual checks.',
      'Parent-only actual native notation issue handling under the existing contract; bare Cyrillic amplitude subscripts remain exact and no speculative exception or notation alias is added.',
      'Parent-managed adapt-finalize/render/build and later source/product acceptance when authorized.',
    ],
    native,
    nativeScopeCaveat: 'English CLI proof is the first pre-layout draft only. Final English paragraph/anchor proof is explicitly the shared htmlfrag.js parser output, not a rerun or a claimed final English CLI pass.',
    inheritedNativeReceipts: inheritedNative,
    authorStructuralVerification: {
      passed: true, independentReview: false,
      provenanceSnapshots: 'Equal to immutable original input templates.',
      mathTokens: 'Every original per-block expression retained byte-exact, including repeated quarter-period tokens and bare Cyrillic amplitude subscripts.',
      nonFormulaNumbersAndReferences: 'Equal to official prose_number_signature for every source block.',
      taskIdentitiesAndValues: 'All four identities, groups, numbers, source pages, figure references and original values preserved; no answer/choice/interaction fields added.',
      layouts: 'Official normalize_prose_layout is idempotent on current text.',
      sectionAnchors: 'All seven adjacent anchors per edition copied from returned shared-parser final-flow objects and resolve exactly against the current template.',
      figures: 'Both figure templates byte-identical to their immutable originals; figure block stays blank.',
      report: binding(path.join(verifyDir, 'stdout.json')),
      receipt: binding(path.join(verifyDir, 'receipt.json')),
    },
    inputs: { prepared: binding(preparedPath), bindings: inputs, contractsAndTools: contractPaths },
    outputs,
    evidence: supportEvidence,
    counters,
    independentReviewStillPending: true,
    sourceOrCourseCompleteClaim: false,
  };
  const reportPath = path.join(base, 'report.json');
  writeJson(reportPath, report);
  const freezePath = path.join(base, 'author-freeze.json');
  writeJson(freezePath, {
    schema: 'STEMROBIN-181/bilingual-author-freeze@1',
    batch: 'D201', ticket: 'STEMROBIN-181', book: '10p', lesson: 'phy10-c1-s3-n23',
    cwd, createdAt: new Date().toISOString(),
    status: report.status,
    authorReport: binding(reportPath),
    prepared: binding(preparedPath),
    inputBindings: prepared.immutableInputTemplates.map(item => binding(item.path)),
    inputBindingRule: 'Original input-template bindings point only to immutable input-templates, never to stale pre-edit hashes of mutable working outputs.',
    sourceBindings: inputs.filter(item =>
      !prepared.immutableInputTemplates.some(template => template.path === item.path)),
    contractsAndTools: contractPaths,
    currentOutputsAndFrozenSnapshots: outputs,
    native, inheritedNativeReceipts: inheritedNative,
    evidence: supportEvidence,
    holds, counters,
    independentReviewStillPending: true,
    outputSnapshotsImmutableMode: '0444',
    nativeScopeCaveat: report.nativeScopeCaveat,
    noFormulaChangeOrNewErratum: true,
    figureVisualApproval: false,
    courseComplete: false,
  });
  fs.chmodSync(reportPath, 0o444);
  fs.chmodSync(freezePath, 0o444);
  console.log(JSON.stringify({ report: binding(reportPath), authorFreeze: binding(freezePath) }, null, 2));
}

if (process.argv[2] === 'flow') flow(process.argv[3]);
else if (process.argv[2] === 'layout') layout(process.argv[3]);
else if (process.argv[2] === 'freeze') freeze();
else throw new Error('usage: record-evidence.mjs <flow|layout> <edition> | freeze');
