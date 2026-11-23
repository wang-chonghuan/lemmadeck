import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
const root = path.dirname(fileURLToPath(import.meta.url))
assert.equal(process.cwd(), cwd)
assert.equal(root, path.join(cwd, '.intentfold/tickets/STEMROBIN-188/tmp/n38-text-author7'))
const preparation = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/preparation7')
const lessonId = 'geo68-c3-s2-n38'
const candidate = path.join(root, 'candidate')
const tools = path.join(cwd, '.claude/skills/ld-s10y-lesson/tools')
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = filename => ({ path: filename, sha256: sha(fs.readFileSync(filename)) })
const read = filename => JSON.parse(fs.readFileSync(filename, 'utf8'))
const write = (filename, value) => {
  assert.ok(filename.startsWith(`${root}/`))
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 })
}
const replace = (filename, value) => {
  assert.ok(filename.startsWith(`${candidate}/`))
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`)
}
const resumingLayout = fs.existsSync(path.join(root, 'author-failure.json'))
const priorFailure = resumingLayout ? read(path.join(root, 'author-failure.json')) : null
if (resumingLayout) {
  assert.equal(priorFailure.proseFlowInvocations, 0)
  assert.equal(priorFailure.executions.length, 1)
  assert.equal(priorFailure.executions[0].stage, 'native-text-layout')
  assert.equal(priorFailure.executions[0].exitCode, 1)
  assert.ok(priorFailure.message.includes('nativeLayoutStable'))
}
const failures = priorFailure?.failures ?? []
const receipts = priorFailure?.executions ?? []
let proseFlowInvocations = 0

function execute(stage, executable, args, input) {
  const result = spawnSync(executable, args, {
    cwd,
    input,
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    maxBuffer: 8 * 1024 * 1024,
  })
  const stdout = path.join(root, `${stage}.stdout`)
  const stderr = path.join(root, `${stage}.stderr`)
  fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx', mode: 0o600 })
  fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx', mode: 0o600 })
  const receipt = {
    stage, cwd, argv: [executable, ...args], exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    ...(input === undefined ? {} : { stdinSha256: sha(input) }),
    streams: { stdout: bind(stdout), stderr: bind(stderr) },
  }
  receipts.push(receipt)
  write(path.join(root, `${stage}.receipt.json`), receipt)
  if (result.status !== 0 || result.error) {
    failures.push(receipt)
    throw new Error(`${stage} failed: ${result.error?.message ?? result.stderr ?? result.status}`)
  }
  return result.stdout
}

try {
  const manifestPath = path.join(preparation, 'manifest.json')
  const manifestBinding = bind(manifestPath)
  assert.equal(manifestBinding.sha256, 'd81564cf41d32e54238525797e153b05c4de3e990c612937d305f078c81c2109')
  const manifest = read(manifestPath)
  const rawRoot = path.join(preparation, 'artifacts/6-8g/lessons', lessonId)
  const templateRoot = path.join(preparation, 'work/adapt/6-8g/modern-us-neutral/lessons', lessonId)
  const inputs = [manifestBinding]
  for (const filename of [
    path.join(rawRoot, 'lesson.json'),
    path.join(rawRoot, 'lesson.md'),
    path.join(rawRoot, 'exercises.json'),
    ...['lesson', 'exercises', 'figures'].map(name => path.join(templateRoot, `${name}.template.json`)),
  ]) {
    const expected = manifest.outputs.find(item => item.path === filename)
    const binding = resumingLayout ? expected : bind(filename)
    assert.equal(binding.sha256, expected?.sha256)
    inputs.push(binding)
  }
  if (!resumingLayout) {
    assert.ok(!fs.existsSync(candidate), 'candidate must be a new isolated directory')
    fs.mkdirSync(candidate)
    for (const name of ['lesson', 'exercises', 'figures']) {
      const destination = path.join(candidate, `${name}.template.json`)
      fs.copyFileSync(path.join(templateRoot, `${name}.template.json`), destination, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(destination, 0o600)
    }
  }
  const originalLesson = read(path.join(templateRoot, 'lesson.template.json'))
  const originalExercises = read(path.join(templateRoot, 'exercises.template.json'))
  const lesson = read(path.join(candidate, 'lesson.template.json'))
  const exercises = read(path.join(candidate, 'exercises.template.json'))
  assert.deepEqual(lesson.source.data, read(path.join(rawRoot, 'lesson.json')))
  assert.deepEqual(exercises.source.data, read(path.join(rawRoot, 'exercises.json')))
  const authored = read(path.join(root, 'authored-text.json'))
  const prose = lesson.prose.filter(block => block.kind === 'p')
  assert.equal(prose.length, 20)
  assert.equal(Object.keys(authored.prose).length, 20)
  assert.equal(Object.keys(authored.exercises).length, 18)
  for (const block of prose) {
    const text = authored.prose[block.source_refs[0]]
    assert.equal(typeof text, 'string')
    block.text = text
    block.changes = ['translation', 'layout']
  }
  for (const exercise of exercises.exercises) {
    const text = authored.exercises[exercise.number]
    assert.equal(typeof text, 'string')
    exercise.text = text
    exercise.lines = text.split('\n')
    exercise.changes = exercise.number === '499' ? ['layout'] : ['translation', 'layout']
  }

  const pythonCode = `
import json, sys
sys.path.insert(0, sys.argv[1])
import edition
data = json.load(sys.stdin)
lesson = data["lesson"]
exercises = data["exercises"]
edition.normalize_lesson_layout(lesson)
edition.normalize_exercise_layout(exercises)
continuations = []
for block in lesson["prose"]:
    if block.get("kind") != "p":
        continue
    for attempt in range(4):
        continued = edition.normalize_prose_layout(block["text"])
        if continued == block["text"]:
            break
        continuations.append({"sourceRefs": block["source_refs"], "before": block["text"], "after": continued})
        block["text"] = continued
    else:
        raise AssertionError("affected prose layout did not stabilize")
facts = []
for kind, items in (("prose", lesson["prose"]), ("exercise", exercises["exercises"])):
    for item in items:
        source = item["source_text"]
        modern = item["text"]
        expressions = lambda text: [match.group(0) for match in edition.MATH.finditer(text)]
        fact = {
            "kind": kind,
            "sourceRefs": item.get("source_refs", item.get("pages")),
            "number": item.get("number"),
            "sourceBodyMath": expressions(source),
            "candidateBodyMath": expressions(modern),
            "exactBodyMathEqual": expressions(source) == expressions(modern),
            "nativeMathSignatureEqual": edition.math_signature(source) == edition.math_signature(modern),
            "sourceNumberSignature": edition.number_signature(source),
            "candidateNumberSignature": edition.number_signature(modern),
            "nativeNumberSignatureEqual": edition.number_signature(source) == edition.number_signature(modern),
            "nativeLayoutStable": (
                edition.normalize_prose_layout(modern) == modern if item.get("kind") == "p"
                else edition.normalize_numbered_subparts(modern) == modern if kind == "exercise"
                else True
            )
        }
        facts.append(fact)
        assert fact["exactBodyMathEqual"], fact
        assert fact["nativeMathSignatureEqual"], fact
        assert fact["nativeNumberSignatureEqual"], fact
        assert fact["nativeLayoutStable"], fact
json.dump({"lesson": lesson, "exercises": exercises, "facts": facts, "affectedLayoutContinuations": continuations}, sys.stdout, ensure_ascii=False)
sys.stdout.write("\\n")
`
  const normalizationInput = JSON.stringify({ lesson, exercises })
  if (resumingLayout) assert.equal(sha(normalizationInput), priorFailure.executions[0].stdinSha256)
  const normalized = JSON.parse(execute(
    resumingLayout ? 'native-text-layout-recovery' : 'native-text-layout',
    path.join(cwd, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    ['-B', '-c', pythonCode, tools],
    normalizationInput,
  ))
  replace(path.join(candidate, 'lesson.template.json'), normalized.lesson)
  replace(path.join(candidate, 'exercises.template.json'), normalized.exercises)
  const beforeFlow = bind(path.join(candidate, 'lesson.template.json'))
  proseFlowInvocations += 1
  const stdout = execute('prose-flow', 'node', [
    path.join(tools, 'prose_flow.mjs'), path.join(candidate, 'lesson.template.json'),
  ])
  const paragraphs = []
  const boundaries = []
  let current = null
  for (const line of stdout.trimEnd().split('\n')) {
    const start = line.match(/^\[(\d+)\] (.*)$/)
    if (start) {
      current = { index: Number(start[1]), text: start[2] }
      paragraphs.push(current)
    } else if (line.startsWith('    break: ')) {
      boundaries.push(JSON.parse(line.slice('    break: '.length)))
    } else {
      assert.ok(current, 'unexpected prose_flow stdout before first paragraph')
      current.text += `\n${line}`
    }
  }
  const transitions = [
    ['先证明三角形内角和定理。', 'inner/exterior-angle definitions to triangle theorem'],
    ['推论 1。', 'triangle proof and teaching footnote to corollaries'],
    ['48 $\\blacksquare$', 'triangle corollaries to convex polygon interior sum'],
    ['49 $\\blacksquare$', 'interior sum and quadrilateral special case to exterior sum'],
    ['附注。', 'exterior-angle theorem to nonconvex interior-angle note'],
  ]
  const selections = transitions.map(([prefix, reason]) => {
    const matches = boundaries.filter(boundary => boundary.after.startsWith(prefix))
    assert.equal(matches.length, 1, `ambiguous or missing actual boundary: ${prefix}`)
    return { boundary: matches[0], reason }
  })
  normalized.lesson.section_breaks = selections.map(item => item.boundary)
  replace(path.join(candidate, 'lesson.template.json'), normalized.lesson)

  const require = createRequire(import.meta.url)
  const { proseOutline, sectionBreakIndices } = require(path.join(tools, 'htmlfrag.js'))
  const finalOutline = proseOutline(normalized.lesson.prose)
  assert.deepEqual(finalOutline.map(({ index, text }) => ({ index, text })), paragraphs)
  assert.equal(boundaries.length, paragraphs.length - 1)
  for (let index = 1; index < paragraphs.length; index += 1) {
    assert.deepEqual(boundaries[index - 1], { before: paragraphs[index - 1].text, after: paragraphs[index].text })
  }
  const resolvedBreaks = sectionBreakIndices(normalized.lesson.prose, normalized.lesson.section_breaks)
  write(path.join(root, 'prose-flow.result.json'), {
    origin: 'Actual prose_flow CLI stdout; boundary objects are JSON.parse of its break lines.',
    input: beforeFlow,
    paragraphs,
    boundaries,
    selectedBoundaries: selections,
    finalResolvedBreaks: resolvedBreaks,
    finalParagraphsUnchanged: true,
    finalParagraphMetadata: finalOutline,
    note: 'CLI ran once after text authoring/layout. Only copied section_breaks anchors were added afterwards; native outline and anchor resolution were checked without rerunning the CLI.',
  })

  const protectedLesson = document => {
    const copy = structuredClone(document)
    delete copy.section_breaks
    for (const block of copy.prose) {
      if (block.kind !== 'p') continue
      delete block.text
      delete block.changes
    }
    return copy
  }
  const protectedExercises = document => {
    const copy = structuredClone(document)
    for (const exercise of copy.exercises) {
      delete exercise.text
      delete exercise.lines
      delete exercise.changes
    }
    return copy
  }
  assert.deepEqual(protectedLesson(originalLesson), protectedLesson(normalized.lesson))
  assert.deepEqual(protectedExercises(originalExercises), protectedExercises(normalized.exercises))
  const unknowns = text => text.match(/\[UNKNOWN:[^\]]+\]/g) ?? []
  const coverage = normalized.lesson.prose.filter(block => block.kind === 'p').map(block => ({
    sourceRefs: block.source_refs,
    sourceTextSha256: sha(block.source_text),
    candidateTextSha256: sha(block.text),
    paragraphs: finalOutline.filter(item => normalized.lesson.prose[item.blockIndex] === block).length,
    footnote: block.label === 'note',
  }))
  const taskCoverage = normalized.exercises.exercises.map(exercise => {
    assert.deepEqual(unknowns(exercise.text), unknowns(exercise.source_text))
    assert.deepEqual(exercise.lines, exercise.text.split('\n'))
    const sourcePrefix = exercise.source_text.match(/^\d+\*?\./)?.[0]
    assert.ok(sourcePrefix && exercise.text.startsWith(sourcePrefix))
    return {
      number: exercise.number,
      literalPrefix: sourcePrefix,
      sourceRefs: exercise.pages,
      sourceTextSha256: sha(exercise.source_text),
      candidateTextSha256: sha(exercise.text),
      unknowns: unknowns(exercise.text),
      lines: exercise.lines.length,
    }
  })
  assert.deepEqual(taskCoverage.map(item => item.number), Array.from({ length: 18 }, (_, index) => String(488 + index)))
  const figureInput = bind(path.join(templateRoot, 'figures.template.json'))
  const figureCandidate = bind(path.join(candidate, 'figures.template.json'))
  assert.equal(figureInput.sha256, figureCandidate.sha256)
  const counters = {
    authoredProseTextObjects: 20, authoredWrittenTasks: 18, proseBlocksRetained: 32,
    initialTextAuthoringPasses: 1, textRevisionPassesAfterProseFlow: 0,
    proseFlowInvocations, nativeTextLayoutInvocations: resumingLayout ? 2 : 1,
    affectedProseLayoutContinuations: normalized.affectedLayoutContinuations.length,
    imageLoads: 0, imageAuthoring: 0, imageApprovals: 0, paidCalls: 0,
    modelServiceCalls: 0, dependencyChanges: 0, sharedToolWrites: 0,
    sourceProducerRegenerations: 0, nativeAdaptFinalize: 0, renders: 0,
    answerPrepare: 0, choiceStages: 0, databaseOperations: 0,
    gitOperations: 0, canonicalWrites: 0, messagesSent: 0, timersCreated: 0,
    failureRecoveries: resumingLayout ? 1 : 0,
  }
  write(path.join(root, 'text-invariance.json'), {
    status: 'AUTHOR_ONLY_MECHANICAL_FACTS_NOT_MATHEMATICAL_APPROVAL',
    protectedLessonFieldsEqual: true, protectedExerciseFieldsEqual: true,
    sourceSnapshotsEqualRawInputs: true, sourceTextSourceRefsSourceMathIdentityAndOrderingUnchanged: true,
    figuresTemplateByteIdentical: true, numericChanges: 0, registeredErrataChanges: 0,
    exactBodyMathEqualForEveryObject: true, nativeMathSignaturesEqualForEveryObject: true,
    nativeNumberSignaturesEqualForEveryObject: true, nativeLayoutStableForEveryText: true,
    literalStarPrefixes: ['495*.', '505*.'],
    affectedLayoutContinuations: normalized.affectedLayoutContinuations,
    coverage: { sourceTextObjects: coverage, writtenTasks: taskCoverage },
    perObject: normalized.facts,
  })
  const candidates = ['lesson', 'exercises', 'figures'].map(name => bind(path.join(candidate, `${name}.template.json`)))
  const artifacts = [
    'authored-text.json', 'author.mjs', 'SOURCE-ADAPTATION.md',
    'native-text-layout.stdout', 'native-text-layout.stderr', 'native-text-layout.receipt.json',
    ...(resumingLayout ? ['author-failure.json', 'native-text-layout-recovery.stdout', 'native-text-layout-recovery.stderr', 'native-text-layout-recovery.receipt.json'] : []),
    'prose-flow.stdout', 'prose-flow.stderr', 'prose-flow.receipt.json',
    'prose-flow.result.json', 'text-invariance.json',
  ].map(filename => bind(path.join(root, filename)))
  const record = {
    status: 'AUTHOR_ONLY',
    ticket: 'STEMROBIN-188', lesson: lessonId, edition: 'modern-us-neutral',
    mode: 'offline', finish: 'review', cwd, ownedRoot: root,
    awaiting: 'Independent source-first text and mathematics review; later delegated figure authoring/review.',
    modernContentApproved: false, sourceMathematicsApprovedByAuthor: false,
    figuresApproved: false, completeLessonApproved: false, published: false,
    inputs, candidates, artifacts, executions: receipts,
    inheritedPreparationStatus: manifest.status,
    inheritedPreparationExecutionFacts: manifest.commands.map(({ stage, exitCode, cwd, argv, streams }) => ({ stage, exitCode, cwd, argv, streams })),
    inheritedExecutionNote: 'Reused supplied preparation manifest; producer stages were not rerun and their success is not modern/source mathematical approval.',
    localRecovery: resumingLayout ? {
      firstFailure: bind(path.join(root, 'author-failure.json')),
      cause: 'Author-added stability assertion failed after one native normalization pass on the consecutive-formula givens at p0174#8. Body math and number comparisons passed for that object.',
      action: 'Resumed only the failed text-layout stage with the exact same authored stdin hash; continued only individual prose objects whose native layout had not stabilized. No producer or full finalizer rerun.',
      affected: normalized.affectedLayoutContinuations.map(item => item.sourceRefs),
      sourceInputHashChecksReplayed: false,
      contentAuthoringRevisions: 0,
    } : null,
    selectedBoundary: manifest.boundary,
    inheritedSourceProvenance: manifest.sourcePages,
    provenanceNote: 'Manifest provenance retained by reference only. No source review/other-author roots, images, page179, or supplement506+ were opened.',
    coverage: { proseBlocks: 32, sourcePTextObjects: 20, writtenTasks: 18, first: '488', last: '505', finalParagraphs: finalOutline.length, sectionBreaks: resolvedBreaks },
    invariantEvidence: bind(path.join(root, 'text-invariance.json')),
    proseFlowEvidence: bind(path.join(root, 'prose-flow.result.json')),
    figuresState: 'PENDING_DELEGATED_UNCHANGED_TEMPLATE; inherited modernized labels/spec paths are preparation placeholders, not authoring or approval.',
    unknowns: [
      { kind: 'unresolved source subpart glyph', sourceRef: 'p0177#5', markers: taskCoverage.find(item => item.number === '493').unknowns, action: 'Retained verbatim; line-separated without inventing labels.' },
      { kind: 'blackbar/square roles', sourceRefs: ['p0174#15', 'p0175#1', 'p0175#7', 'p0175#8', 'p0175#9', 'p0176#1', 'p0176#3', 'p0176#4'], action: 'Existing blacksquare math tokens retained exactly; no claimed QED or editorial meaning.' },
      { kind: 'd original glyph/font/standalone meaning', action: 'No glyph/font identification or invented definition. Source 180-degree and 2d statements and all d expressions remain unchanged, with no covert unit conversion or errata.' },
    ],
    inheritedHolds: manifest.preservedHolds,
    inheritedFailures: manifest.preservedFailures,
    inheritedStateNote: 'Unrelated inherited holds/failures are historical manifest facts, not re-investigated or discharged.',
    counters, failures,
    seal: { fileMode: '0444', directoryMode: '0555', scope: 'Every file/directory owned under ownedRoot; no inputs or shared paths chmodded.', selfHash: 'Record cannot embed its own final hash; it is returned externally after sealing.' },
  }
  write(path.join(root, 'AUTHOR-RECORD.json'), record)
  const sealedFiles = []
  const seal = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name)
      assert.ok(!entry.isSymbolicLink(), 'owned tree must not contain symlinks')
      if (entry.isDirectory()) seal(filename)
      else {
        fs.chmodSync(filename, 0o444)
        assert.equal(fs.statSync(filename).mode & 0o777, 0o444)
        sealedFiles.push(bind(filename))
      }
    }
    fs.chmodSync(directory, 0o555)
  }
  seal(root)
  console.log(JSON.stringify({ status: 'AUTHOR_ONLY', record: bind(path.join(root, 'AUTHOR-RECORD.json')), candidates, counters, finalParagraphs: finalOutline.length, sectionBreaks: resolvedBreaks, failures, sealedFileCount: sealedFiles.length, sealedFiles }, null, 2))
} catch (error) {
  const failure = { status: 'AUTHOR_ONLY_EXECUTION_OR_INVARIANCE_FAILURE', message: error.message, cwd, proseFlowInvocations, executions: receipts, failures }
  const filename = path.join(root, 'author-failure.json')
  if (!fs.existsSync(filename)) write(filename, failure)
  console.error(JSON.stringify(failure, null, 2))
  process.exitCode = 1
}
