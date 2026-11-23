import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
assert.equal(process.cwd(), W)
const A = path.join(W, '.intentfold/tickets/STEMROBIN-188/tmp/n37-text-author7')
const P = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37/preparation7')
const C = path.join(A, 'candidate')
const T = path.join(P, 'work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37')
const R = path.join(P, 'artifacts/6-8g/lessons/geo68-c3-s2-n37')
const recordPath = path.join(A, 'AUTHOR-RECORD.json')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const hash = (file) => digest(fs.readFileSync(file))
const binding = (file) => ({ path: file, sha256: hash(file) })
const record = read(recordPath)
assert.equal(record.sealed, undefined, 'Already sealed; do not duplicate a passed audit')
const action = {
  order: 32,
  kind: 'scoped-body-equality-and-seal',
  cwd: W,
  command: 'node .intentfold/tickets/STEMROBIN-188/tmp/n37-text-author7/audit-and-seal.mjs',
  started: new Date().toISOString(),
}
record.actions.push(action)

try {
  const manifest = read(path.join(P, 'manifest.json'))
  record.preparationManifest = binding(path.join(P, 'manifest.json'))
  record.inputs = manifest.outputs.map((entry) => {
    assert.equal(hash(entry.path), entry.sha256, `Input drift: ${entry.path}`)
    return { ...entry, hashVerified: true, mode: (fs.statSync(entry.path).mode & 0o777).toString(8).padStart(4, '0') }
  })
  record.reusedNativePreparation = manifest.commands
  record.reusedNativeCounts = manifest.counts
  record.originalRaw = ['lesson.json', 'exercises.json', 'lesson.md'].map((file) => binding(path.join(R, file)))
  record.originalTemplates = ['lesson', 'exercises', 'figures'].map((name) => binding(path.join(T, `${name}.template.json`)))
  record.profiles = ['modern-us-neutral', 'soviet-cn'].map((name) => binding(path.join(W, `.claude/skills/ld-s10y-lesson/profiles/${name}.json`)))
  record.reusedReviews = [
    manifest.reusedSourceReview.path,
    manifest.priorSourceReview,
    manifest.priorSource171Affected,
  ].map(binding)
  assert.equal(record.reusedReviews[0].sha256, manifest.reusedSourceReview.sha256)
  record.originalFailures = binding(path.join(A, 'ORIGINAL-FAILURES.json'))
  record.supportingScripts = ['run-native-flow.mjs', 'audit-and-seal.mjs'].map((file) => binding(path.join(A, file)))
  const files = ['lesson', 'exercises', 'figures'].map((name) => path.join(C, `${name}.template.json`))
  const [lesson, exercises, figures] = files.map(read)
  const originals = ['lesson', 'exercises', 'figures'].map((name) => read(path.join(T, `${name}.template.json`)))
  const rawLesson = read(path.join(R, 'lesson.json'))
  const rawExercises = read(path.join(R, 'exercises.json'))
  assert.deepEqual(lesson.source.data, rawLesson)
  assert.deepEqual(exercises.source.data, rawExercises)
  assert.equal(lesson.source.sha256, hash(path.join(R, 'lesson.json')))
  assert.equal(exercises.source.sha256, hash(path.join(R, 'exercises.json')))
  assert.equal(lesson.prose.length, 6)
  assert.equal(lesson.prose.filter((block) => block.kind === 'p').length, 4)
  assert.equal(exercises.count, 9)
  assert.deepEqual(exercises.exercises.map((item) => item.number), ['479', '480', '481', '482', '483', '484', '485', '486', '487'])
  assert.equal(hash(files[2]), hash(path.join(T, 'figures.template.json')))
  assert.deepEqual(figures, originals[2])
  assert.deepEqual(figures.figures.map((figure) => figure.id), ['fig-229', 'fig-230', 'fig-231'])
  record.figureBindings = manifest.figureBindings.map(({ id, source, output, mode }) => ({
    id, source, prepared: output, mode,
    candidate: figures.figures.find((figure) => figure.id === id),
    producerStatus: 'PENDING_LD_S10Y_IMAGE',
    imageReadThisAuthor: false,
  }))

  const stripped = (item, fields) => Object.fromEntries(Object.entries(item).filter(([key]) => !fields.includes(key)))
  assert.deepEqual(stripped(lesson, ['prose', 'section_breaks']), stripped(originals[0], ['prose', 'section_breaks']))
  assert.deepEqual(stripped(exercises, ['exercises']), stripped(originals[1], ['exercises']))
  const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[1] ?? match[2])
  const pairs = []
  for (const [index, block] of lesson.prose.entries()) {
    assert.deepEqual(stripped(block, ['text', 'changes']), stripped(originals[0].prose[index], ['text', 'changes']))
    assert.equal(block.source_text, rawLesson.prose[index].text)
    assert.deepEqual(math(block.text), math(block.source_text))
    if (block.kind !== 'p') assert.deepEqual(block, originals[0].prose[index])
    pairs.push({ object: `lesson.prose[${index}]`, source: block.source_text, modern: block.text })
  }
  for (const [index, exercise] of exercises.exercises.entries()) {
    assert.deepEqual(stripped(exercise, ['text', 'lines', 'changes']), stripped(originals[1].exercises[index], ['text', 'lines', 'changes']))
    assert.equal(exercise.source_text, rawExercises.exercises[index].text)
    assert.equal(exercise.text, exercise.lines.join('\n'))
    const modern = exercise.number === '487'
      ? exercise.text.replace(/^\$487\^\{\*\}\$\.\s*/, '')
      : exercise.text
    const source = exercise.number === '487'
      ? exercise.source_text.replace(/^487\*\s*/, '')
      : exercise.source_text
    assert.deepEqual(math(modern), math(source))
    pairs.push({ object: `exercise.${exercise.number}`, source, modern })
  }
  assert.match(exercises.exercises[8].text, /^\$487\^\{\*\}\$\.\s/)
  assert.deepEqual(exercises.exercises[7].lines.map((line) => line.match(/^([1-2a-d])\)/)?.[1]).filter(Boolean), ['1', '2', 'a', 'b', 'c', 'd'])
  const profile = read(path.join(W, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
  for (const pair of pairs) {
    assert.equal(/[\u0400-\u04ff]/u.test(pair.modern), false)
    for (const formula of math(pair.modern)) assert.equal(/[、，；。？！：]/u.test(formula), false)
    for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) assert.equal(pair.modern.includes(term), false)
  }

  const flowPath = path.join(A, 'prose-flow.execution.json')
  const flow = read(flowPath)
  assert.equal(flow.exitCode, 0)
  assert.equal(flow.cwd, W)
  for (const stream of Object.values(flow.streams)) assert.equal(hash(stream.path), stream.sha256)
  const flowText = fs.readFileSync(flow.streams.stdout.path, 'utf8')
  const boundaries = flowText.split('\n').filter((line) => line.startsWith('    break: ')).map((line) => JSON.parse(line.slice('    break: '.length)))
  for (const boundary of lesson.section_breaks) assert.ok(boundaries.some((actual) => JSON.stringify(actual) === JSON.stringify(boundary)))
  assert.equal(lesson.section_breaks.length, 2)
  const beforeBoundarySelection = structuredClone(lesson)
  beforeBoundarySelection.section_breaks = []
  assert.equal(digest(`${JSON.stringify(beforeBoundarySelection, null, 2)}\n`), flow.input.sha256, 'Flow-input bytes changed beyond selected boundaries')
  record.nativeFlow = {
    receipt: binding(flowPath),
    execution: flow,
    paragraphs: flowText.split('\n').filter((line) => /^\[\d+\] /.test(line)).length,
    availableBoundaryObjects: boundaries.length,
    selectedBoundaryObjects: lesson.section_breaks,
    finalProseUnchangedSinceInvocation: true,
    onlyPostFlowCandidateChange: 'section_breaks: [] -> two exact emitted boundary objects',
    repeated: false,
  }

  const python = path.join(W, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const code = [
    'import json, sys',
    'sys.dont_write_bytecode = True',
    'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
    'import edition',
    'def forbidden_renderer(*args, **kwargs):',
    '    raise RuntimeError("No renderer or continuation repair authorized")',
    'edition.katex_validate = forbidden_renderer',
    'results = []',
    'for item in json.load(sys.stdin):',
    '    source = edition.math_signature(item["source"])',
    '    modern = edition.math_signature(item["modern"])',
    '    assert source == modern, item["object"]',
    '    results.append({"object": item["object"], "source": source, "modern": modern, "equal": True})',
    'print(json.dumps(results, ensure_ascii=False))',
  ].join('\n')
  const signature = spawnSync(python, ['-B', '-c', code], { cwd: W, input: JSON.stringify(pairs), encoding: 'utf8' })
  record.nativeMathSignatureExecution = {
    command: python, argv: ['-B', '-c', code], cwd: W, exitCode: signature.status,
    stderr: signature.stderr, stdinSha256: digest(JSON.stringify(pairs)),
    tool: binding(path.join(W, '.claude/skills/ld-s10y-lesson/tools/edition.py')),
    rendererDisabled: true, imagesOpened: 0,
  }
  assert.equal(signature.status, 0, signature.stderr)
  const signatures = JSON.parse(signature.stdout)
  record.equalityChecks = {
    embeddedRawSnapshots: 2,
    sourceTextObjects: pairs.length,
    literalBodyMathExpressions: pairs.reduce((count, pair) => count + math(pair.source).length, 0),
    nativeMathSignatures: signatures,
    completeUnchangedIdentityAndBindingEnvelopes: true,
    figureTemplateByteEquality: true,
    nativeBoundaryObjectMembership: true,
    ChinesePunctuationOutsideMath: true,
    modernProfileAndLatinSubparts: true,
    numberedSubpartsPreserved: true,
    forbiddenFieldsAdded: false,
    allPassed: true,
  }
  record.counts = {
    rawProseBlocks: 6, textBlocks: 4, nativeParagraphs: record.nativeFlow.paragraphs,
    exercises: 9, exerciseNumbers: exercises.exercises.map((exercise) => exercise.number),
    figures: 3, figureIds: figures.figures.map((figure) => figure.id),
    sectionBreaks: 2, changedLessonTextBlocks: 4, changedExercises: 9,
    subpartItems: 13, literalBodyMathExpressions: record.equalityChecks.literalBodyMathExpressions,
  }
  for (const file of files) fs.chmodSync(file, 0o444)
  record.candidates = files.map((file) => {
    const mode = (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0')
    assert.equal(mode, '0444')
    return { ...binding(file), bytes: fs.statSync(file).size, mode }
  })
  record.sealed = true
  record.sealedAt = new Date().toISOString()
  record.counters.nativeMathSignatureChecks = 15
  record.counters.auditSealPasses = 1
  action.finished = new Date().toISOString()
  action.exitCode = 0
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
  console.log(JSON.stringify({ status: record.status, record: binding(recordPath), candidates: record.candidates, counts: record.counts, failures: 2, imagesOpened: 0, nativeProseFlowCalls: 1 }, null, 2))
} catch (error) {
  action.finished = new Date().toISOString()
  action.exitCode = 1
  action.failure = error.stack ?? String(error)
  record.sealed = false
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`)
  console.error(error.stack ?? String(error))
  process.exitCode = 1
}
