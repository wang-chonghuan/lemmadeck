import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d023-n90-ohm-author');
const lessonId = 'phy9-c2-s3-n90';
const figureId = 'tbl-p0219-01';
const lessonDir = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons', lessonId);
const sourceRoot = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p');
const azureSkill = '/Users/yong/.agents/skills/n-azure';
const imageSkill = path.join(root, '.agents/skills/ld-s10y-image');
const paths = {
  source: path.join(sourceRoot, 'figures', `${figureId}.png`),
  lesson: path.join(lessonDir, 'lesson.template.json'),
  exercisesTemplate: path.join(lessonDir, 'exercises.template.json'),
  figuresTemplate: path.join(lessonDir, 'figures.template.json'),
  sourceLesson: path.join(sourceRoot, 'lessons', lessonId, 'lesson.json'),
  sourceExercises: path.join(sourceRoot, 'lessons', lessonId, 'exercises.json'),
  science: path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n90-science-effective-review.json'),
  currentProseFreeze: path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n90-prose-correction-freeze.json'),
  originalProseFreeze: path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n90-prose-freeze.json'),
  context: path.join(owned, 'context.json'),
  inventory: path.join(owned, 'source-inventory.json'),
  spec: path.join(owned, 'spec.json'),
  prompt: path.join(owned, 'prompt.txt'),
  png: path.join(owned, `${figureId}.png`),
  generation: path.join(owned, `${figureId}.png.json`),
  preview: path.join(owned, `${figureId}.w160.png`),
  previewEvidence: path.join(owned, 'commands/preview-width160.json'),
  draftValidation: path.join(owned, 'commands/draft-validation.json'),
  renderedValidation: path.join(owned, 'commands/rendered-validation.json'),
  generationAttempt: path.join(owned, 'attempt-01.json'),
  observations: path.join(owned, 'author-pixel-observations.json'),
  freeze: path.join(owned, 'authored-freeze.json'),
  helper: path.join(owned, 'commands/author.mjs'),
  azureHelper: path.join(azureSkill, 'scripts/generate_image.py'),
  validator: path.join(imageSkill, 'scripts/validate_spec.py')
};
const python = 'python3';
const imagePython = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
const endpoint = 'https://finleyswedencentralinstance.openai.azure.com';
const display = { purpose: 'decorative', layout: 'inline', maxWidthPx: 160, widths: [160], minTextPx: 16 };
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const binding = file => ({ path: file, sha256: sha(file) });
const sameHash = (file, expected) => assert.equal(sha(file), expected, `Changed binding: ${file}`);

function write(file, value, raw = false) {
  assert(file.startsWith(`${owned}/`), 'Write escaped owned directory');
  assert(!fs.existsSync(file), `Refusing to overwrite ${file}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, raw ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
}

function inputBindings() {
  const result = {};
  for (const key of [
    'source', 'lesson', 'exercisesTemplate', 'figuresTemplate', 'sourceLesson',
    'sourceExercises', 'science', 'currentProseFreeze', 'originalProseFreeze',
    'inventory', 'helper', 'azureHelper', 'validator'
  ]) result[key] = binding(paths[key]);
  for (const [key, file] of Object.entries({
    imageSkill: path.join(imageSkill, 'SKILL.md'),
    generationContract: path.join(imageSkill, 'references/generation.md'),
    figureSpecContract: path.join(imageSkill, 'references/figure-spec.md'),
    qualityGateContract: path.join(imageSkill, 'references/quality-gate.md'),
    routingContract: path.join(imageSkill, 'references/routing.md'),
    nativeSchema: path.join(imageSkill, 'assets/figure-spec.schema.json'),
    nativeContextHelper: path.join(imageSkill, 'scripts/build_context.py'),
    azureSkill: path.join(azureSkill, 'SKILL.md'),
    azureCap4: path.join(azureSkill, 'references/azure-openai-image-generation.md'),
    d017ReferenceFreeze: path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d017-n58-portrait-author-freeze.json'),
    d017ReferenceSpec: path.join(root, '.tmp/STEMROBIN-181/9p-n58-portrait/tbl-p0146-01.spec.json')
  })) result[key] = binding(file);
  return result;
}

function checkPremises() {
  sameHash(paths.science, '163ed5d932d98171b1bb976481b34e8c350dea6de9d038e67d5c105d1ee27b53');
  sameHash(paths.currentProseFreeze, 'c281829766efd40e1aecdac14c3a4e70434027fc4970da464249dc2ffafacf26');
  const sci = json(paths.science);
  assert.equal(sci.status, 'pass');
  assert.equal(sci.decision.independentSCIPassed, true);
  for (const [key, file] of Object.entries({
    lessonTemplate: paths.lesson, exercisesTemplate: paths.exercisesTemplate,
    figuresTemplate: paths.figuresTemplate, sourceLesson: paths.sourceLesson,
    sourceExercises: paths.sourceExercises, correction: paths.currentProseFreeze
  })) {
    assert.equal(path.resolve(root, sci.bindings[key].path), file);
    sameHash(file, sci.bindings[key].sha256);
  }
  const lesson = json(paths.lesson);
  assert.equal(lesson.id, lessonId);
  assert.equal(lesson.exercise_count, 0);
  assert.equal(json(paths.exercisesTemplate).exercises.length, 0);
  assert.equal(json(paths.sourceExercises).exercises.length, 0);
  assert.equal(lesson.prose[11].kind, 'fig');
  assert.equal(lesson.prose[11].id, figureId);
  assert.equal(lesson.prose[12].kind, 'cap');
  assert(lesson.prose[12].text.includes('1789'));
  assert(!lesson.prose[12].text.includes('1787'));
  assert(lesson.prose[12].source_text.includes('1787'));
  return lesson;
}

function checkUnchanged() {
  for (const item of Object.values(json(paths.context).inputBindings)) sameHash(item.path, item.sha256);
}

function runRecorded(label, executable, args) {
  const file = path.join(owned, 'commands', `${label}.json`);
  assert(!fs.existsSync(file), `Command already ran: ${label}`);
  const startedAt = new Date().toISOString();
  const result = spawnSync(executable, args, {
    cwd: root,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  });
  const record = {
    cwd: root, argv: [executable, ...args], startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, stdout: result.stdout || '',
    stderr: result.stderr || '', spawnError: result.error?.message || null,
    environmentValuesRecorded: false
  };
  write(file, record);
  assert.equal(result.status, 0, `${label} failed; evidence preserved at ${file}`);
  return record;
}

function validate(stage) {
  const record = runRecorded(`native-${stage}-command`, python, [
    paths.validator, paths.spec, '--stage', stage, '--json'
  ]);
  const output = JSON.parse(record.stdout);
  write(stage === 'draft' ? paths.draftValidation : paths.renderedValidation, output);
  assert.equal(output.status, 'pass');
  assert.deepEqual(output.errors, []);
}

function prepare() {
  const lesson = checkPremises();
  const inventory = json(paths.inventory);
  assert.equal(inventory.sourceObservation.opens, 1);
  const sourceBytes = fs.readFileSync(paths.source);
  assert.equal(sourceBytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(sourceBytes.readUInt32BE(16), 471);
  assert.equal(sourceBytes.readUInt32BE(20), 590);
  const prose = lesson.prose.flatMap((block, index) => (
    ['p', 'cap'].includes(block.kind)
      ? [{ index, kind: block.kind, label: block.label, sourceRefs: block.source_refs, text: block.text }]
      : []
  ));
  assert(prose.every(block => typeof block.text === 'string' && block.text.trim()));
  const authoritativeText = [
    { lesson: lessonId, text: lesson.printed_title },
    ...prose.map(block => ({ lesson: lessonId, text: block.text }))
  ];
  write(paths.context, {
    schema: 'ld-s10y-image/context@1',
    ticket: 'STEMROBIN-181', batch: 'D023', book: '9p', edition: 'modern-us-neutral',
    figure: figureId, authorOnly: true, createdAt: new Date().toISOString(),
    authoritativeRule: 'Complete CURRENT lesson p and cap plus printed_title override source pixels. Source PNG supplies portrait identity cues only. No task or answer context.',
    sourceImage: { ...binding(paths.source), width: 471, height: 590 },
    lessons: [{
      lesson: lessonId, title: lesson.printed_title, prose, exercises: [],
      biographyCaption: { index: 12, text: lesson.prose[12].text },
      historicalIdentity: { name: 'Georg Simon Ohm', modernLifeDates: '1789-1854', faithfulSourceBirthYearOnly: '1787' }
    }],
    authoritativeText, exerciseCount: 0, tasks: 0,
    fullCurrentProseAndCaptions: true, proseIndices: prose.map(block => block.index),
    inputBindings: inputBindings(),
    contextMethod: 'Structured extraction from the complete current lesson.template.json, not the durable edition. The existing build_context.py was read but not run: its durable-edition scan/nearby-only selection is not authoritative for this scratch template or the requested full text.',
    referenceContractReuse: 'D017 compact generated-portrait schema/asset/display and evidence shape only; original D023 source was opened afresh and the complete D023 text is bound here. No D017 images opened.'
  });
  write(paths.spec, {
    schema: 'ld-s10y-image/figure-spec@2', id: figureId, mode: 'generated',
    description: 'Decorative identification portrait of the actual source-bound Georg Simon Ohm for lesson90. Contemporary full-color textbook illustration preserves the near-frontal slightly leftward mature face, high forehead, swept wavy curls, strong sideburns, closed lips, clean chin, high neckwear and civilian coat. It supplies no archival-photograph claim, apparatus, equations, measured relationships, or embedded text.',
    source: {
      image: binding(paths.source), authoritativeText,
      inventory: inventory.groups.map(({ id, description, objects, assertions }) => ({ id, description, objects, assertions }))
    },
    canvas: { width: 1024, height: 1024, boundingBox: [0, 1024, 1024, 0], background: 'paper', keepAspectRatio: true },
    display,
    assets: [{ id: 'ohm-portrait', role: 'artwork', path: paths.png, metadata: paths.generation }],
    objects: [], assertions: []
  });
  const prompt = [
    'Create ONE finished contemporary full-color textbook portrait illustration of the REAL GEORG SIMON OHM, the source-bound German physicist and schoolteacher. His correct modern identity is Georg Simon Ohm (1789-1854). This is not a generic fictional scientist.',
    'Rendering mode: generated semantic artwork. Display purpose: decorative identification portrait, inline, maximum width160px. Output a square1024x1024 PNG on a completely plain white opaque background.',
    'THE COMPLETE CURRENT MODERN LESSON TEXT BELOW IS AUTHORITATIVE. The attached original extracted PNG is a VISUAL IDENTITY REFERENCE ONLY, not authority for wording or dates. The faithful source contains the old1787 birth-year token; do not use it as the modern birth year. NO DATES OR ANY TEXT ARE TO APPEAR IN THE IMAGE.',
    'Retain the source facial identity and posture: one mature man, near-frontal head turned slightly toward the viewer LEFT, broad high forehead, thick wavy swept-up/back curls at crown and sides, strong brows, deep-set eyes, prominent straight nose, closed thin lips, distinct thick sideburns along cheek/temple edges and a clean chin without a full beard or prominent moustache. Keep the serious calm expression and high neckwear/stock, light shirt opening, dark civilian lapelled coat and shoulder/chest bust. Do not replace him with Einstein, Maxwell, a generic elderly professor, or a different historical person. No spectacles or hat.',
    'Render as a modern educational raster illustration: clean confidently painted color shapes, simplified controlled contour edges and soft illustrative shading, natural skin tones and dark hair with subtle mature variation. Clothing may use neutral charcoal and a white shirt. Color is a contemporary illustrative choice, not a claim that the monochrome source establishes exact historical colors. NOT a photograph, NOT photorealistic, NOT an archival photo, NOT a black-and-white engraving, NOT a sepia print or restored scan. Do not retain dense hatching, scratchy backdrop strokes, paper grain, scan noise, aging, clipped bottom print, the stray source mark, or any decorative marks.',
    'Compose the entire head with swept hair, neck, both shoulders and upper chest clearly visible. Center the bust with comfortable white margins around the hair and shoulder edges; use approximately7percent outer margin. Make the head and its face the visual focus so eyebrows, nose, mouth, curls and sideburns remain distinct when the whole square is displayed at160px wide. Do not crop the head, hide the face, introduce motion blur, or leave the face tiny inside a large empty canvas.',
    'STRICT NEGATIVES: no Cyrillic, Chinese, Latin text, initials, names, labels, dates, numbers, symbols, equations, graphs, arrows, electrical diagrams, scientific apparatus, thermocouples, meters, wires, books, desks, hands, props, badges, flags, uniforms, medals, decorative frame, halo, background pattern, scenic setting, or extra people. The biography mentions experiments only as context; do NOT illustrate or invent experimental equipment. Draw the portrait only.',
    '',
    'COMPLETE CURRENT AUTHORITATIVE PRINTED TITLE AND ALL p/cap BLOCKS IN LESSON ORDER, WITH THE BIOGRAPHY CAPTION INCLUDED. This context is not image lettering; draw NONE of its text, formulas, labels, or dates:',
    ...authoritativeText.map((item, index) => `[context item ${index}]\n${item.text}`),
    '',
    'End of authoritative context. Final output is the one unlabelled modern illustration of the source-bound Ohm portrait only.'
  ].join('\n\n') + '\n';
  write(paths.prompt, prompt, true);
  const attempt = {
    ticket: 'STEMROBIN-181', figure: figureId, attempt: 1, role: 'initial-generation',
    createdAt: new Date().toISOString(), initialGenerationAttempts: 1,
    targetedRepairAttempts: 0, maximumTargetedRepairs: 1,
    helper: binding(paths.azureHelper), prompt: binding(paths.prompt),
    sourceReference: binding(paths.source), context: binding(paths.context),
    lesson: binding(paths.lesson), spec: binding(paths.spec),
    argv: [python, paths.azureHelper, '--prompt-file', paths.prompt,
      '--reference-image', paths.source, '--output', paths.png, '--metadata', paths.generation,
      '--endpoint', endpoint, '--model', 'gpt-image-2', '--api-version', 'preview',
      '--size', '1024x1024', '--quality', 'medium', '--background', 'opaque', '--retries', '0'],
    request: { endpoint, model: 'gpt-image-2', apiVersion: 'preview', mode: 'edit', size: '1024x1024', quality: 'medium', background: 'opaque', n: 1, automaticRetries: 0 },
    authorization: 'User permits the existing fixed direct n-azure cap4 route with the source reference. No cloud/session/setup/resource/freshness actions, proxy, dependency changes, or fallback. Key availability is checked without revealing credentials; absent key stops before the helper could request an Azure CLI token.',
    actualCostUsd: null, usage: null,
    costTelemetry: 'Unknown: approved helper does not retain response usage or billed cost. No fabricated spend estimate.',
    failures: 'Command results remain immutable, including any nonzero exit. No automatic retry, overwrite, or silent fallback.'
  };
  write(paths.generationAttempt, attempt);
  console.log(`Prepared complete title + ${prose.length} current p/cap blocks; zero tasks; original opens1.`);
}

function generate() {
  checkPremises();
  checkUnchanged();
  validate('draft');
  const authCheck = [
    'import importlib.util, sys',
    'from pathlib import Path',
    `spec = importlib.util.spec_from_file_location("approved_n_azure", ${JSON.stringify(paths.azureHelper)})`,
    'module = importlib.util.module_from_spec(spec)',
    'spec.loader.exec_module(module)',
    '_, key = module.resolve_settings(None)',
    'sys.exit(0 if key else 3)'
  ].join('\n');
  runRecorded('credential-availability-no-session', python, ['-c', authCheck]);
  const attempt = json(paths.generationAttempt);
  const [executable, ...args] = attempt.argv;
  runRecorded('generation-01-command', executable, args);
  console.log('One fixed-route generation command succeeded; no automatic retries.');
}

function generatedBindings() {
  const context = json(paths.context);
  const spec = json(paths.spec);
  const meta = json(paths.generation);
  assert.deepEqual(spec.source.authoritativeText, context.authoritativeText);
  assert.equal(meta.schema, 'n-azure/image-generation@1');
  assert.equal(meta.endpoint, endpoint);
  assert.equal(meta.model, 'gpt-image-2');
  assert.equal(meta.api_version, 'preview');
  assert.equal(meta.mode, 'edit');
  assert.equal(meta.auth_method, 'api-key');
  assert.equal(meta.prompt, fs.readFileSync(paths.prompt, 'utf8').trim());
  assert.deepEqual(meta.references, [{
    path: paths.source, bytes: fs.statSync(paths.source).size, sha256: sha(paths.source)
  }]);
  assert.equal(meta.output.path, paths.png);
  assert.equal(meta.output.sha256, sha(paths.png));
  assert.equal(meta.output.bytes, fs.statSync(paths.png).size);
  assert.equal(meta.output.width, 1024);
  assert.equal(meta.output.height, 1024);
  assert.deepEqual(meta.request, { size: '1024x1024', quality: 'medium', background: 'opaque', output_format: 'png', n: 1 });
  assert.deepEqual(spec.display, display);
  return meta;
}

function preview() {
  checkPremises();
  checkUnchanged();
  generatedBindings();
  validate('rendered');
  const code = [
    'from pathlib import Path',
    'from PIL import Image',
    'import json, hashlib',
    `source = Path(${JSON.stringify(paths.png)})`,
    `output = Path(${JSON.stringify(paths.preview)})`,
    'assert not output.exists(), "Refusing to overwrite preview"',
    'with Image.open(source) as image:',
    '    image.load()',
    '    assert image.size == (1024, 1024)',
    '    rendered = image.convert("RGB").resize((160, 160), Image.Resampling.LANCZOS)',
    '    rendered.save(output, format="PNG")',
    'with Image.open(output) as preview:',
    '    preview.load()',
    '    assert preview.size == (160, 160)',
    '    assert max(preview.convert("L").getextrema()) - min(preview.convert("L").getextrema()) > 32',
    '    print(json.dumps({"status":"pass","source":{"path":str(source),"sha256":hashlib.sha256(source.read_bytes()).hexdigest()},"output":{"path":str(output),"sha256":hashlib.sha256(output.read_bytes()).hexdigest(),"width":160,"height":160},"method":"Pillow LANCZOS raster resampling at actual160px, no browser/product width measured","embeddedText":"prohibited; requires author pixel observation","minTextPx":16,"textSizeCheck":"not applicable to unlabelled portrait; FigureSpec preserves required minTextPx16"}))'
  ].join('\n');
  const record = runRecorded('preview-width160-command', imagePython, ['-c', code]);
  write(paths.previewEvidence, JSON.parse(record.stdout));
  console.log('Native draft/rendered validations pass; actual160x160 PNG preview saved.');
}

function freeze() {
  checkPremises();
  checkUnchanged();
  const meta = generatedBindings();
  const observations = json(paths.observations);
  assert.equal(observations.authorOnly, true);
  assert.equal(observations.status, 'usable-authored-candidate-independent-review-pending');
  assert.equal(observations.imageOpens.total, 3);
  for (const key of ['source', 'png', 'preview']) {
    assert.deepEqual(observations.bindings[key], binding(paths[key]));
  }
  for (const stage of ['draft', 'rendered']) {
    const result = json(stage === 'draft' ? paths.draftValidation : paths.renderedValidation);
    assert.equal(result.status, 'pass');
    assert.deepEqual(result.errors, []);
  }
  const bindings = {};
  for (const key of [
    'source', 'context', 'inventory', 'lesson', 'sourceLesson', 'spec', 'prompt', 'png',
    'generation', 'science', 'currentProseFreeze', 'originalProseFreeze', 'preview',
    'previewEvidence', 'draftValidation', 'renderedValidation', 'generationAttempt',
    'observations', 'helper', 'azureHelper', 'validator', 'exercisesTemplate',
    'figuresTemplate', 'sourceExercises'
  ]) bindings[key] = binding(paths[key]);
  const nativeCommands = [
    'native-draft-command', 'credential-availability-no-session',
    'generation-01-command', 'native-rendered-command', 'preview-width160-command'
  ].map(label => {
    const file = path.join(owned, 'commands', `${label}.json`);
    const command = json(file);
    return { ...binding(file), argv: command.argv, cwd: command.cwd, exitCode: command.exitCode, startedAt: command.startedAt, finishedAt: command.finishedAt };
  });
  const protectedInputs = json(paths.context).inputBindings;
  write(paths.freeze, {
    schema: 'ld-s10y-image/authored-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D023', lesson: lessonId, figure: figureId,
    createdAt: new Date().toISOString(), authorOnly: true, mode: 'generated',
    status: 'author-frozen-independent-review-pending',
    candidateStatus: observations.status, bindings, protectedInputs,
    fullCurrentAuthoritativeTextBound: true, tasks: 0,
    textBinding: {
      template: bindings.lesson, context: bindings.context, spec: bindings.spec,
      printedTitlePointer: '/printed_title',
      authoritativeProseIndices: json(paths.context).proseIndices,
      biographyCaptionPointer: '/prose/12/text',
      identity: 'Georg Simon Ohm (1789-1854)',
      faithfulSourceBirthYear: '1787; retained only in unchanged faithful source/source_text',
      currentProseAuthority: bindings.currentProseFreeze,
      scienceAuthority: bindings.science,
      nativeProseReruns: 0, SCIReruns: 0
    },
    sourceObservation: json(paths.inventory).sourceObservation,
    sourceInventorySemanticMappings: json(paths.inventory).groups.map(group => ({
      id: group.id, asset: group.semanticAssetId, pixelChecks: group.authorPixelChecks,
      objects: group.objects, assertions: group.assertions
    })),
    display,
    widthEvidence: {
      declaredDesktopAndMobileMediaPx: 160, actualRasterPreviewPx: 160,
      evidence: bindings.previewEvidence,
      method: 'Actual160x160px raster inspected once after native rendered validation. No browser, desktop, offline card, or product measurement; declared media width is a contract, not measured acceptance.',
      embeddedLabelsOrDates: false, minTextPx: 16,
      textSizeApplicability: 'No embedded text; no fabricated raster-font-size measurement.'
    },
    generationInputs: {
      helper: bindings.azureHelper, promptFile: bindings.prompt,
      promptSHA256MatchesMetadataStringAfterTrim: true,
      context: bindings.context, sourceReference: bindings.source,
      endpoint: meta.endpoint, model: meta.model, apiVersion: meta.api_version,
      mode: meta.mode, authenticationMethod: meta.auth_method,
      referencesExactlyAsNativeMetadata: meta.references,
      request: meta.request, outputExactlyAsNativeMetadata: meta.output,
      returnedMetadata: bindings.generation,
      noProxyOrRouteFallback: true, automaticRetries: 0
    },
    nativeCommands,
    counts: {
      initialGenerationAttempts: 1, targetedRepairAttempts: 0, generationHTTPAttempts: 1,
      specDraftValidationRuns: 1, specRenderedValidationRuns: 1,
      nativeFigureValidationRuns: 2, realWidth160PreviewRuns: 1,
      semanticRasterRenderRuns: 0, nativeContextBuilderRuns: 0,
      credentialAvailabilityChecksWithoutSession: 1,
      SCIRuns: 0, nativeProseRuns: 0, independentReviewRuns: 0,
      promotionRuns: 0, imageOpens: 3
    },
    budget: {
      initialGenerationMaximum: 1, targetedRepairMaximumOverall: 1,
      targetedRepairsUsed: 0, targetedRepairsRemaining: 1,
      repairStatus: 'not-needed; no repair executed',
      imageOpenLimitRequested: 3, imageOpensUsed: 3,
      skillImageLimitPerBatch: 8, skillImageLimitPerContext: 24,
      actualCostUsd: null, usage: null,
      costTelemetry: 'Unknown: existing approved helper metadata omits response usage and billed cost. No new recurring cost, resources, setup, or fabricated estimate.'
    },
    authorPixelObservations: bindings.observations,
    failures: [],
    hardBlockers: [],
    immutableOriginalFailuresPolicy: 'Every executed command is retained; no overwritten failure, automatic retry, silent fallback, or unrecorded repair.',
    integrity: {
      allProtectedInputHashesUnchanged: true,
      nativeOutputHashAndSourceReferenceHashesMatch: true,
      suppliedEffectiveSCIAndCorrectedFreezeHashesMatch: true,
      generatedMetadataPromptMatchesFullCurrentContext: true
    },
    limits: {
      onlyOwnedDirectoryWritten: owned, sourceOrTemplateEdits: false,
      fig170Work: false, oldImageOpens: 0, sourcePageImageOpens: 0,
      userDesktopOrBrowserUsed: false,
      noAzureResourcesSessionSetupFreshnessOrCloudConfigurationChanges: true,
      noDependenciesGitDBFullchecksChildrenOrOtherChats: true,
      independentReviewRecorded: false, independentReview: 'Fresh independent review comes later.',
      SOURCEGateOrSCINativeProseReplay: false,
      promotionAdaptfinalizeOrPublication: false,
      noArchivalIdentityClaimBeyondSourceBoundTextAndPortraitCues: true
    }
  });
  console.log(JSON.stringify({ freeze: paths.freeze, sha256: sha(paths.freeze), status: 'author-frozen-independent-review-pending', generation: 1, nativeFigureValidationRuns: 2, width160PreviewRuns: 1, imageOpens: 3 }, null, 2));
}

const action = process.argv[2];
if (action === 'prepare') prepare();
else if (action === 'generate') generate();
else if (action === 'preview') preview();
else if (action === 'freeze') freeze();
else throw new Error('Expected prepare, generate, preview, or freeze');
